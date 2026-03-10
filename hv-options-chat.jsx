import { useState, useRef, useEffect } from "react";

const BOOKLET_CONTEXT = `You are a friendly, helpful GCSE options guide for Haute Vallée School (HV) in Jersey. You help Year 8 students and their parents understand the school's GCSE options for 2025-2027. Answer based ONLY on the information below. If something is not covered, say so honestly and suggest they contact the school.

IMPORTANT GUIDELINES:
- Keep responses SHORT: 2-3 sentences or 3 bullet points maximum. No long answers.
- For SEN questions: 1-2 practical points only, then recommend the SENCO.
- Never invent information. If not covered, say so in one sentence and direct to school.

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
1. IGCSE English Language (Cambridge 0990) — 50% exam, 50% coursework. Assessed Oct & May.
2. IGCSE English Literature (Edexcel 4ET1) — 60% exam, 40% coursework. Texts: Of Mice and Men, An Inspector Calls, Macbeth, poetry. SPaG only 5% of marks.
3. IGCSE Mathematics (Edexcel 4MA1) — Foundation (grades 5-1) or Higher (9-4). Two calculator papers. Assessed Nov & May.
4. GCSE Triple Science (Edexcel) — ALL start Triple Science in Yr9. End of Yr9 review: stay Triple (3 GCSEs) or move to Combined Science (2 GCSEs). 6 exams at end of Yr11. Leader: Mrs R Gallagher r.gallagher@hv.sch.je
5. Core PE (not examined)

OPTIONAL SUBJECTS:

ART & DESIGN (GCSE, AQA 8201)
- NO written exam — 100% practical
- Portfolio 60% + 10-hour controlled exam piece 40%
- Leader: Mrs S Boccone s.boccone@hv.sch.je
- Good for: creative, independent workers

BUSINESS STUDIES (GCSE, Edexcel 1BS0)
- 100% written exam: 2 papers x 1hr 45min (50% each)
- Calculations, multiple choice, short & extended writing
- Leader: Miss S Dimaro s.dimaro@hv.sch.je

CERTIFICATE IN FINANCIAL EDUCATION — CeFE (Level 2, Agored Cymru)
- Technical Award (Level 2 equivalent, not traditional GCSE)
- Covers public finance, financial management, employability & enterprise
- Leader: Miss S Dimaro s.dimaro@hv.sch.je
- Complements Maths and Business Studies

CHILD DEVELOPMENT (Cambridge National, OCR J818)
- 40% exam (1hr 15min) + 60% coursework (two NEA units)
- Leader: Ms V Shanklyn v.shanklyn@hv.sch.je
- Good for: early years, midwifery, childcare careers

COMBINED PORTUGUESE/SPANISH (GCSE, Edexcel)
- Sit Portuguese GCSE in Year 9, then 2-year Spanish GCSE in Yrs 10-11
- Ideal for students already fluent/strong in Portuguese
- 4 skills each 25%: Listening, Reading, Speaking, Writing
- Leader: Miss R Durbano r.durbano@hv.sch.je

COMPUTER SCIENCE (IGCSE, Edexcel 1CP2)
- Paper 1: Principles of Computer Science (theory)
- Paper 2: Practical programming in Python 3 (on-screen exam)
- Good for: logical thinkers, problem solvers, students strong in Maths
- Leader: Miss S Dimaro s.dimaro@hv.sch.je

DESIGN TECHNOLOGY (IGCSE)
- Paper 1: Product Design 25% (1hr 15min) + Coursework project 50% + Paper 3: Resistant Materials 25% (1hr)
- Leader: Mr S Browne S.Browne@hv.sch.je

FOOD PREPARATION AND NUTRITION (GCSE, AQA 8585)
- 50% written exam (1hr 45min) + 50% coursework (food investigation 15% + food prep 35%)
- Leader: Mr S Browne S.Browne@hv.sch.je

FRENCH (GCSE, Edexcel 1FR1)
- 4 skills each 25%: Listening, Reading, Speaking, Writing
- Native French speaker helps with speaking prep
- French is an official language of Jersey
- Leader: Miss R Durbano r.durbano@hv.sch.je

GEOGRAPHY (IGCSE, Edexcel 4GE1)
- 2 exams: Paper 1 Physical Geography (1hr 10min) + Paper 2 Human Geography (1hr 45min)
- Includes coastal and urban fieldwork
- Leader: Mr M Ingram m.ingram@hv.sch.je

HISTORY (GCSE, Edexcel 1HIO)
- 100% exam, NO coursework: 3 papers
- Topics: Medicine in Britain, American West, Elizabethan England, Weimar & Nazi Germany
- Reading and writing intensive
- Leader: Mr M Ingram m.ingram@hv.sch.je

ICT — INFORMATION & COMMUNICATION TECHNOLOGY (IGCSE, Cambridge 0983)
- Paper 1 Theory (2hrs, 40%) + Paper 2 Practical (2hr 30min, 30%) + Paper 3 Practical (2hr 30min, 30%)
- Covers software applications, web design, data manipulation — different from Computer Science (less programming, more using software)

MOTOR VEHICLE STUDIES (vocational)
- Ideal for automotive industry; covers servicing, tools, health & safety, tyres
- Leads to Level 2 diploma or apprenticeship
- Counts as the ONE vocational option
- Leader: Miss R Knowles R.Knowles@hv.sch.je

MUSIC BTEC (Pearson BTEC International Level 2)
- 50% internal project-based + 50% externally assessed assignment
- NO traditional written exam
- Graded: Distinction* = 8.5, Distinction = 7, Merit = 5/6, Pass = 4/5
- Cannot choose both BTEC Music AND GCSE Music
- Leader: Miss C Cooper c.cooper@hv.sch.je

MUSIC GCSE (AQA)
- Performing 30% + Composing 30% + Listening exam 40% (1hr 30min)
- Should already play an instrument or sing
- Leader: Miss C Cooper c.cooper@hv.sch.je

PERFORMING ARTS (BTEC, Edexcel 600/4785/9)
- 75% internal + 25% external (video audition + application letter)
- NO written exam — performance based
- Leader: Mr D Mortimer d.mortimer@hv.sch.je

PHOTOGRAPHY (GCSE, AQA 8206)
- Portfolio 60% + 10-hour controlled exam piece 40%
- Some written analysis required
- Leader: Mrs S Boccone s.boccone@hv.sch.je

PSYCHOLOGY (GCSE, OCR J203)
- 100% exam, NO coursework: 2 papers x 90min in Year 11
- Includes maths questions (10%+) and essays
- Topics: Criminal Psychology, Development, Memory, Sleep & Dreaming, Social Influence, Psychological Problems
- Leader: Miss A Halsall a.halsall@hv.sch.je

RELIGIOUS STUDIES (GCSE, AQA 8063A)
- 100% exam: 2 papers (50% each). Christianity + Islam + 4 thematic modules
- Leader: Mrs C Riley c.riley@hv.sch.je

SPANISH (GCSE, Edexcel 1SP1)
- 4 skills each 25%: Listening, Reading, Speaking, Writing
- Native Spanish speaker helps with speaking
- Leader: Miss R Durbano r.durbano@hv.sch.je

SPORT (BTEC, Pearson 603/7068/3)
- 2 internal assignments + 1 external exam (1.5hrs)
- Mostly practical and project-based
- Leader: Mrs P Paine p.paine@hv.sch.je

CONSTRUCTION & BUILT ENVIRONMENT (Jersey Progression Award — Highlands College)
- 2-year course; Year 9 school-based, Yrs 10-11 at Highlands one afternoon/week
- Counts as ONE vocational option

HAIR AND BEAUTY (Jersey Progression Award — Highlands College)
- 2-year course; Year 9 school-based, Yrs 10-11 at Highlands one afternoon/week
- Counts as ONE vocational option

=== EXAM vs COURSEWORK SUMMARY ===
Mostly/entirely EXAM based:
- History (100%), Psychology (100%), Religious Studies (100%), Business Studies (100%), French/Spanish/Portuguese (100% but includes speaking)

Good mix of COURSEWORK (lower exam pressure):
- Child Development (60% CW), Design Technology (50% CW), Food Prep (50% CW), English Language (50% CW), English Literature (40% CW)

Minimal/NO written exams (very practical):
- Art & Design (no written exam), Photography (no written exam), Performing Arts BTEC (no written exam), Music BTEC (no written exam), Sport BTEC (mostly practical), Construction/Hair & Beauty/Motor Vehicle (all highly practical)

=== SEN GUIDANCE (general — always refer to school SENCO for individual arrangements) ===
- All students with documented SEN needs may be eligible for access arrangements: extra time, reader, scribe, rest breaks, laptop use — arranged via SENCO
- For students who struggle with written exams: Art, Photography, Performing Arts BTEC, Music BTEC, Construction, Hair & Beauty, Motor Vehicle have minimal or no written exams
- For autistic students who prefer structure and clear rules: Computer Science (logical, structured), Business Studies, History, and Psychology have clear mark schemes and defined content
- For students with dyslexia: English Literature specifically notes SPaG is only 5% of marks; Art, Photography, Performing Arts have very little written work
- English Literature: "Spelling, punctuation and grammar is only 5% of the course, so you needn't worry if you don't feel that you are a good writer"
- Students can change option choices by logging back into the platform before the deadline; after deadline contact school directly`;

const CHIPS = [
  "What subjects are available?",
  "How do I choose my options?",
  "What is the EBacc?",
  "Can I change my mind later?",
  "My child is dyslexic – which subjects suit them?",
  "Difference between GCSE and BTEC?",
  "Tell me about Computer Science",
  "Which subjects have no written exams?",
  "What are the core subjects?",
  "Tell me about the Highlands College courses",
];

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "4px 2px" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: "50%", background: "#94a3b8",
          animation: "bounce 1.2s infinite",
          animationDelay: `${i * 0.2}s`
        }} />
      ))}
    </div>
  );
}

function parseMarkdown(text) {
  const lines = text.split("\n");
  const elements = [];
  let listItems = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length) {
      elements.push(
        <ul key={key++} style={{ paddingLeft: 18, margin: "6px 0" }}>
          {listItems.map((item, i) => <li key={i} style={{ marginBottom: 3 }}>{item}</li>)}
        </ul>
      );
      listItems = [];
    }
  };

  for (const line of lines) {
    if (!line.trim()) { flushList(); continue; }
    if (line.startsWith("- ") || line.startsWith("• ")) {
      const content = line.replace(/^[-•]\s/, "");
      listItems.push(renderInline(content));
    } else {
      flushList();
      elements.push(<p key={key++} style={{ margin: "4px 0" }}>{renderInline(line)}</p>);
    }
  }
  flushList();
  return elements;
}

function renderInline(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I'm the **Haute Vallée Year 8 Options Guide**.\n\nI can help you and your child understand the GCSE subjects on offer for 2025–2027 — what they involve, how they're assessed, and which might be the right fit.\n\nWhat would you like to know? Use the quick questions below or just ask me anything."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const newHistory = [...history, { role: "user", content: trimmed }];
    setHistory(newHistory);
    setMessages(prev => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: BOOKLET_CONTEXT,
          messages: newHistory
        })
      });

      const data = await res.json();

      if (!res.ok || data.type === "error") {
        const errDetail = data?.error?.message || `HTTP ${res.status}`;
        setMessages(prev => [...prev, { role: "assistant", content: `⚠️ API error: ${errDetail}` }]);
        setLoading(false);
        return;
      }

      const reply = data?.content?.[0]?.text || "Sorry, I couldn't get a response. Please try again.";
      setHistory(prev => [...prev, { role: "assistant", content: reply }]);
      setMessages(prev => [...prev, { role: "assistant", content: reply, sensitive: /dyslexia|autism|autistic|adhd|sen|special needs|learning diff|disability|support|change|withdraw/i.test(trimmed) }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: `⚠️ Error: ${e.message}` }]);
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f1f5f9" }}>
      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .msg-anim { animation: fadeIn 0.2s ease; }
        .chip:hover { background: #0d7a6e !important; color: white !important; }
        textarea:focus { outline: none; border-color: #0d7a6e !important; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{ background: "#1a2b4a", padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
        <div style={{ width: 42, height: 42, background: "#e8a020", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 17, color: "#1a2b4a", flexShrink: 0 }}>HV</div>
        <div>
          <div style={{ color: "white", fontWeight: 600, fontSize: 16 }}>Year 8 Options Guide</div>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 1 }}>
            <span style={{ display: "inline-block", width: 7, height: 7, background: "#4ade80", borderRadius: "50%", marginRight: 5, verticalAlign: "middle" }} />
            Haute Vallée School · 2025–2027
          </div>
        </div>
      </div>

      {/* Chips */}
      <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "10px 16px", display: "flex", gap: 8, overflowX: "auto", flexShrink: 0, scrollbarWidth: "none" }}>
        {CHIPS.map(chip => (
          <button key={chip} className="chip" onClick={() => send(chip)}
            style={{ background: "#e6f4f2", color: "#0d7a6e", border: "1px solid rgba(13,122,110,0.2)", borderRadius: 20, padding: "5px 13px", fontSize: 12.5, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s" }}>
            {chip}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} className="msg-anim" style={{ display: "flex", gap: 10, maxWidth: "85%", alignSelf: msg.role === "user" ? "flex-end" : "flex-start", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, marginTop: 2, background: msg.role === "user" ? "#e8a020" : "#1a2b4a", color: msg.role === "user" ? "#1a2b4a" : "#e8a020" }}>
              {msg.role === "user" ? "You" : "HV"}
            </div>
            <div style={{ background: msg.role === "user" ? "#1a2b4a" : "white", color: msg.role === "user" ? "white" : "#1e2d3d", padding: "11px 15px", borderRadius: msg.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px", border: msg.role === "bot" ? "1px solid #e2e8f0" : "none", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", fontSize: 14.5, lineHeight: 1.6 }}>
              {parseMarkdown(msg.content)}
              {msg.sensitive && (
                <div style={{ background: "#fdf3e0", border: "1px solid rgba(232,160,32,0.3)", borderRadius: 8, padding: "7px 11px", fontSize: 12, color: "#7a5010", marginTop: 10 }}>
                  ⚠️ For your child's specific needs, always speak to the school's SENCO directly.
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="msg-anim" style={{ display: "flex", gap: 10, alignSelf: "flex-start" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1a2b4a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#e8a020" }}>HV</div>
            <div style={{ background: "white", padding: "11px 15px", borderRadius: "4px 16px 16px 16px", border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div style={{ background: "white", borderTop: "1px solid #e2e8f0", padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-end", flexShrink: 0 }}>
        <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
          placeholder="Ask anything about GCSE options…"
          rows={1}
          style={{ flex: 1, border: "1.5px solid #dde3ec", borderRadius: 12, padding: "10px 14px", fontSize: 14.5, fontFamily: "inherit", resize: "none", maxHeight: 120, lineHeight: 1.5, color: "#1e2d3d", transition: "border-color 0.2s" }}
          onInput={e => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
        />
        <button onClick={() => send(input)} disabled={loading || !input.trim()}
          style={{ width: 42, height: 42, background: loading || !input.trim() ? "#e2e8f0" : "#1a2b4a", border: "none", borderRadius: 12, cursor: loading || !input.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={loading || !input.trim() ? "#94a3b8" : "white"}><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
      <div style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", padding: "5px 0 8px", background: "white" }}>
        Based on the HV Options Booklet 2025 · Always confirm decisions with the school
      </div>
    </div>
  );
}
