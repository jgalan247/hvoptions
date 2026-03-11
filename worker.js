/**
 * Cloudflare Worker — Haute Vallée GCSE Options Chatbot API
 * 3-tier logic: reject abuse → response bank (responses.json) → Haiku fallback
 *
 * DEPLOY INSTRUCTIONS:
 * 1. Go to workers.cloudflare.com → Create Worker
 * 2. Paste this entire file
 * 3. Click Settings → Variables → Add:
 *      ANTHROPIC_API_KEY = sk-ant-your-key-here
 * 4. Save & Deploy
 * 5. Note the worker URL (e.g. https://hv-options.YOUR-SUBDOMAIN.workers.dev)
 *    and update WORKER_URL in index.html
 */

// GitHub raw URL for the response bank
const RESPONSES_URL = 'https://raw.githubusercontent.com/jgalan247/hvoptions/main/responses.json';

// Cache responses.json for 10 minutes to avoid hitting GitHub on every request
let cachedResponses = null;
let cacheTimestamp = 0;
const CACHE_TTL = 10 * 60 * 1000;

async function getResponses() {
  const now = Date.now();
  if (cachedResponses && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedResponses;
  }
  try {
    const res = await fetch(RESPONSES_URL);
    if (res.ok) {
      const data = await res.json();
      cachedResponses = data;
      cacheTimestamp = now;
      return data;
    }
  } catch (e) {
    if (cachedResponses) return cachedResponses;
  }
  return null;
}

// ── System prompt for Haiku fallback ──────────────────────────────
const SYSTEM_PROMPT = `You are a friendly, helpful GCSE options guide for Haute Vallée School (HV) in Jersey. You help Year 8 students and their parents understand the school's GCSE options for 2025-2027. Answer based ONLY on the information below. If something is not covered, say so honestly and suggest they contact the school on 01534 736524 or enquiries@hv.sch.je.

IMPORTANT GUIDELINES:
- Keep responses SHORT: 2-3 sentences or 3-4 bullet points maximum.
- For SEN questions: 1-2 practical points only, then recommend the SENCO.
- Never invent information. If not covered, say so in one sentence and direct to school.
- Be warm and reassuring — parents and students may be anxious about choices.

=== HAUTE VALLÉE SCHOOL – OPTIONS BOOKLET 2025 ===

SCHOOL INFO:
- Telephone: 01534 736524, Email: enquiries@hv.sch.je, Web: www.hv.sch.je
- Headteacher: Stuart J Hughes
- Options chosen in Year 8 (unusual — most schools do Year 9)
- GCSEs studied over 3 years (Years 9, 10, 11)

SELECTION PROCESS:
- Students choose 3 option subjects (plus compulsory core subjects)
- Choice 1 MUST be from: Computer Science, French, Geography, History, Psychology, Religious Studies, Spanish, Combined Spanish & Portuguese
- Choices 2 & 3: any subject from full list
- Also pick 2 reserve choices (R and S)
- Online platform: https://www.studentoptions.co/hautevallee/
- Deadline was 8pm Friday 7 March 2025 (for current cycle)
- Restrictions: only ONE vocational subject (Construction, Hair & Beauty, Motor Vehicle); if choosing Music, pick either BTEC or GCSE, not both

CORE SUBJECTS (compulsory for all):
1. IGCSE English Language (Cambridge 0990) — 50% exam, 50% coursework
2. IGCSE English Literature (Edexcel 4ET1) — 60% exam, 40% coursework
3. IGCSE Mathematics (Edexcel 4MA1) — Foundation (grades 5-1) or Higher (9-4)
4. GCSE Triple Science (Edexcel) — ALL start Triple, end of Yr9 review may move to Combined Science
5. Core PE (not examined)

OPTIONAL SUBJECTS (23 total):
Art & Design (AQA 8201) — 100% practical, portfolio 60% + controlled exam 40%
Business Studies (Edexcel 1BS0) — 100% exam, 2 papers
CeFE Financial Education (Agored Cymru) — Level 2, not traditional GCSE
Child Development (OCR J818) — 40% exam + 60% coursework
Combined Portuguese/Spanish (Edexcel) — Portuguese GCSE in Yr9, then Spanish in Yrs 10-11
Computer Science (Edexcel 1CP2) — Paper 1 theory + Paper 2 Python programming
Design Technology (IGCSE) — 25% theory + 50% coursework + 25% resistant materials
Food Prep & Nutrition (AQA 8585) — 50% exam + 50% coursework
French (Edexcel 1FR1) — 4 skills each 25%
Geography (Edexcel 4GE1) — 2 exam papers + fieldwork
History (Edexcel 1HIO) — 100% exam, 3 papers, no coursework
ICT (Cambridge 0983) — theory 40% + 2 practical papers 60%
Motor Vehicle Studies — vocational, leads to Level 2 diploma
Music BTEC (Pearson) — 50% internal + 50% external, no written exam
Music GCSE (AQA) — performing 30% + composing 30% + listening exam 40%
Performing Arts BTEC (Edexcel) — 75% internal + 25% external, no written exam
Photography (AQA 8206) — portfolio 60% + controlled exam 40%
Psychology (OCR J203) — 100% exam, 2 papers
Religious Studies (AQA 8063A) — 100% exam, 2 papers
Spanish (Edexcel 1SP1) — 4 skills each 25%
Sport BTEC (Pearson) — 2 internal + 1 external exam
Construction (Highlands College) — Jersey Progression Award, vocational
Hair & Beauty (Highlands College) — Jersey Progression Award, vocational

SEN GUIDANCE (always refer to school SENCO for individual arrangements):
- Access arrangements available: extra time, reader, scribe, rest breaks, laptop use
- Minimal/no written exams: Art, Photography, Performing Arts BTEC, Music BTEC, Construction, Hair & Beauty, Motor Vehicle
- Structured subjects for autistic students: Computer Science, Business Studies, History, Psychology
- For dyslexia: English Lit SPaG only 5% of marks; Art, Photography, Performing Arts have very little written work`;

// ── TIER 1: Abuse / off-topic filter ────────────────────────────
const ABUSE_PATTERNS = [
  /\b(fuck|shit|cunt|bastard|wanker|arsehole|asshole|dick|piss\s?off|bollocks|twat)\b/i,
  /\b(kill|die|bomb|attack|threat)\b/i,
  /\b(nigger|faggot|retard)\b/i,
];

const OFFTOPIC_PATTERNS = [
  /\b(tell me a joke|sing|poem|story|recipe|write me|code|program|translate|what is the meaning of life)\b/i,
  /\b(who is the president|capital of|how to hack|bitcoin|crypto|lottery)\b/i,
  /\b(ignore (previous|all|your) (instructions|prompt|rules))\b/i,
  /\b(you are now|act as|pretend to be|new persona|jailbreak|DAN)\b/i,
  /\b(system prompt|reveal your|what are your instructions)\b/i,
];

const ABUSE_MSG = "I'd appreciate it if we could keep things respectful. I'm here to help with GCSE options — what would you like to know?";
const REDIRECT_MSG = "I'm only able to help with Haute Vallée GCSE options and subject choices. What would you like to know about the options available?";

function isAbusive(text) {
  return ABUSE_PATTERNS.some(p => p.test(text));
}

function isOffTopic(text) {
  return OFFTOPIC_PATTERNS.some(p => p.test(text));
}

// ── TIER 2: Response bank keyword matching ──────────────────────
// Scoring system to avoid false positives:
// - Each keyword match adds to an entry's score based on keyword quality
// - Longer user questions need higher scores (complex = let Haiku handle)
// - Short direct lookups ("photography", "ebacc") get a boost
// - If no entry meets the threshold, falls through to Haiku (Tier 3)

function matchResponseBank(userText, responses) {
  if (!responses || !responses.responses) return null;

  const lower = userText.toLowerCase();
  const userWords = lower.split(/\s+/).filter(w => w.length > 0);
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of responses.responses) {
    let entryScore = 0;
    let matchedKeywords = 0;

    for (const keyword of entry.keywords) {
      const kw = keyword.toLowerCase();
      if (!lower.includes(kw)) continue;

      matchedKeywords++;
      const kwWords = kw.split(/\s+/).length;

      if (kwWords >= 3) {
        entryScore += kw.length * 2;       // Strong: long phrase match
      } else if (kwWords === 2) {
        entryScore += kw.length * 1.5;     // Good: two-word phrase
      } else {
        entryScore += kw.length;            // Single word: score by length
      }
    }

    // Bonus for multiple keyword matches on the same entry
    if (matchedKeywords >= 2) {
      entryScore *= 1.3;
    }

    if (entryScore > bestScore) {
      bestScore = entryScore;
      bestMatch = entry;
    }
  }

  if (!bestMatch) return null;

  // Dynamic threshold: longer questions need higher confidence
  // Short queries (1-3 words) are likely direct lookups → low threshold
  // Long queries (8+ words) are likely nuanced → high threshold
  let threshold;
  if (userWords.length <= 3) {
    threshold = 4;      // "photography", "ebacc", "french"
  } else if (userWords.length <= 6) {
    threshold = 5;      // "what is the ebacc", "tell me about history"
  } else {
    threshold = 25;     // "my child is not very academic what do you recommend"
  }

  return bestScore >= threshold ? bestMatch : null;
}

// ── Main handler ────────────────────────────────────────────────
export default {
  async fetch(request, env) {

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // Only POST /chat
    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/chat') {
      return new Response('Not found', { status: 404 });
    }

    try {
      const body = await request.json();
      const { messages } = body;

      if (!messages || !Array.isArray(messages)) {
        return jsonResponse({ error: 'Invalid request' }, 400);
      }

      const lastMsg = messages[messages.length - 1];
      const userText = (lastMsg && lastMsg.role === 'user') ? lastMsg.content : '';

      // ── TIER 1: Reject abuse / off-topic ──
      if (userText && isAbusive(userText)) {
        return respond(ABUSE_MSG);
      }
      if (userText && isOffTopic(userText)) {
        return respond(REDIRECT_MSG);
      }
      if (userText && userText.length > 500) {
        return respond("That's quite a long message! Could you keep your question a bit shorter so I can help you better?");
      }

      // ── TIER 2: Response bank ──
      const responses = await getResponses();
      const match = matchResponseBank(userText, responses);
      if (match) {
        return respond(match.response);
      }

      // ── TIER 3: Haiku fallback ──
      const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 300,
          system: SYSTEM_PROMPT,
          messages: messages
        })
      });

      const data = await anthropicRes.json();
      return jsonResponse(data);

    } catch (err) {
      return jsonResponse({ error: 'Server error' }, 500);
    }
  }
};

function respond(text) {
  return jsonResponse({ content: [{ type: 'text', text }] });
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}
