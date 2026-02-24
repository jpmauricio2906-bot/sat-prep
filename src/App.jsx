import { useState, useEffect } from "react";

// ─── SAT STRUCTURE ──────────────────────────────────────────────────────────
// Digital SAT: 98 total questions (54 R&W + 44 Math)
// Full = 98 | Half = 49 | Quarter = 25
const TEST_LENGTHS = {
  full:    { label: "Full SAT",     total: 98,  rw: 54, math: 44, time: "2h 14min" },
  half:    { label: "Half Length",  total: 49,  rw: 27, math: 22, time: "~67min"   },
  quarter: { label: "Quarter",      total: 25,  rw: 14, math: 11, time: "~34min"   },
};

const DIFFICULTY_LEVELS = {
  easy:   { label: "Easy",   color: "#2ecc71", desc: "Build confidence with foundational questions" },
  medium: { label: "Medium", color: "#f7c44f", desc: "Core difficulty — closest to the real SAT" },
  hard:   { label: "Hard",   color: "#e74c3c", desc: "Challenge yourself with advanced questions" },
};

const SECTIONS = {
  math: {
    label: "Math",
    icon: "∑",
    color: "#4f8ef7",
    topics: ["Algebra", "Geometry", "Data Analysis", "Advanced Math", "Problem Solving"],
  },
  reading: {
    label: "Reading & Writing",
    icon: "✦",
    color: "#f7914f",
    topics: ["Main Idea", "Vocabulary in Context", "Evidence", "Grammar", "Rhetorical Skills"],
  },
};

// ─── QUESTION BANK ──────────────────────────────────────────────────────────
const QUESTION_BANK = {
  math: {
    Algebra: {
      easy: [
        { q: "If 3x + 7 = 22, what is x?", choices: ["3","5","7","9"], answer: 1, explanation: "3x = 15, so x = 5." },
        { q: "What is 2x when x = 6?", choices: ["8","10","12","14"], answer: 2, explanation: "2 × 6 = 12." },
        { q: "Solve: x − 4 = 10", choices: ["6","14","10","4"], answer: 1, explanation: "x = 10 + 4 = 14." },
      ],
      medium: [
        { q: "Which is equivalent to 2(x+3) − 4(x−1)?", choices: ["−2x+10","6x+2","−2x+2","2x+10"], answer: 0, explanation: "2x+6−4x+4 = −2x+10." },
        { q: "If y = 2x − 1 and y = x + 3, what is x?", choices: ["2","4","5","7"], answer: 1, explanation: "2x−1 = x+3 → x = 4." },
        { q: "Solve: 5x − 3 = 2x + 12", choices: ["3","5","7","9"], answer: 1, explanation: "3x = 15, x = 5." },
      ],
      hard: [
        { q: "If f(x) = 3x² − 2x + 1, what is f(−2)?", choices: ["9","17","13","21"], answer: 1, explanation: "3(4) − 2(−2) + 1 = 12 + 4 + 1 = 17." },
        { q: "For what value of k does kx² − 4x + 1 = 0 have exactly one solution?", choices: ["2","4","8","16"], answer: 1, explanation: "Discriminant = 0: 16 − 4k = 0, k = 4." },
      ],
    },
    Geometry: {
      easy: [
        { q: "A rectangle has length 8 and width 5. What is its area?", choices: ["26","40","13","45"], answer: 1, explanation: "Area = 8 × 5 = 40." },
        { q: "What is the perimeter of a square with side 6?", choices: ["12","24","36","18"], answer: 1, explanation: "Perimeter = 4 × 6 = 24." },
      ],
      medium: [
        { q: "The radius of a circle is 6. What is the circumference? (π ≈ 3.14)", choices: ["18.84","37.68","113.04","28.26"], answer: 1, explanation: "C = 2πr = 2 × 3.14 × 6 = 37.68." },
        { q: "A right triangle has legs 3 and 4. What is the hypotenuse?", choices: ["5","6","7","8"], answer: 0, explanation: "√(9+16) = √25 = 5." },
      ],
      hard: [
        { q: "A cylinder has radius 3 and height 10. What is its volume? (π ≈ 3.14)", choices: ["94.2","282.6","188.4","314"], answer: 1, explanation: "V = πr²h = 3.14 × 9 × 10 = 282.6." },
        { q: "In a circle, an arc subtends a central angle of 60°. If the radius is 12, what is the arc length? (π ≈ 3.14)", choices: ["12.56","6.28","18.84","25.12"], answer: 0, explanation: "Arc = (60/360) × 2πr = (1/6) × 75.36 ≈ 12.56." },
      ],
    },
    "Data Analysis": {
      easy: [
        { q: "In {4, 7, 7, 9, 13}, what is the median?", choices: ["7","8","9","6"], answer: 0, explanation: "Middle value of sorted set is 7." },
        { q: "What is the mode of {2, 4, 4, 5, 7}?", choices: ["2","4","5","7"], answer: 1, explanation: "4 appears most often." },
      ],
      medium: [
        { q: "A student scored 80, 90, 70, 100 on four tests. What is the mean?", choices: ["82","84","85","90"], answer: 2, explanation: "(80+90+70+100)/4 = 85." },
        { q: "A data set has mean 50 and 5 values. If one value is removed (value = 70), what is the new mean?", choices: ["45","46","47","48"], answer: 0, explanation: "Total = 250. Remove 70: 180/4 = 45." },
      ],
      hard: [
        { q: "A scatterplot shows a strong positive correlation. Which r-value is most likely?", choices: ["−0.9","0.1","0.85","−0.3"], answer: 2, explanation: "Strong positive correlation → r close to +1, so 0.85." },
        { q: "If the standard deviation of a data set is 0, what must be true?", choices: ["All values are 0","All values are equal","The mean is 0","The set has one value"], answer: 1, explanation: "SD = 0 means no spread — all values are identical." },
      ],
    },
    "Advanced Math": {
      easy: [
        { q: "What is x² when x = 5?", choices: ["10","15","25","30"], answer: 2, explanation: "5² = 25." },
      ],
      medium: [
        { q: "What are the roots of x² − 5x + 6 = 0?", choices: ["2 and 3","1 and 6","−2 and −3","0 and 5"], answer: 0, explanation: "(x−2)(x−3) = 0." },
        { q: "Simplify: (x² − 9) / (x − 3)", choices: ["x+3","x−3","x+9","x²"], answer: 0, explanation: "(x−3)(x+3)/(x−3) = x+3." },
      ],
      hard: [
        { q: "If g(x) = x³ − 4x, for which value(s) of x does g(x) = 0?", choices: ["0, 2, −2","0, 4","1, −1","2, −2"], answer: 0, explanation: "x(x²−4) = x(x−2)(x+2); roots are 0, 2, −2." },
        { q: "Which expression is equivalent to (2x + 3)²?", choices: ["4x²+9","4x²+6x+9","4x²+12x+9","2x²+12x+9"], answer: 2, explanation: "(2x)²+2(2x)(3)+3² = 4x²+12x+9." },
      ],
    },
    "Problem Solving": {
      easy: [
        { q: "A car travels 150 miles in 3 hours. What is its average speed in mph?", choices: ["40","45","50","55"], answer: 2, explanation: "150/3 = 50 mph." },
        { q: "If apples cost $0.50 each, how much do 8 apples cost?", choices: ["$3.00","$3.50","$4.00","$4.50"], answer: 2, explanation: "8 × $0.50 = $4.00." },
      ],
      medium: [
        { q: "A store discounts an item 20%. If the original price is $80, what is the sale price?", choices: ["$60","$64","$68","$72"], answer: 1, explanation: "$80 × 0.80 = $64." },
        { q: "A tank fills at 5 gallons/min and drains at 2 gallons/min. How long to fill 30 gallons (net)?", choices: ["5 min","8 min","10 min","15 min"], answer: 2, explanation: "Net rate = 3 gal/min; 30/3 = 10 min." },
      ],
      hard: [
        { q: "If x varies inversely with y, and x=4 when y=9, what is x when y=6?", choices: ["3","6","8","12"], answer: 1, explanation: "xy = 36 → x = 36/6 = 6." },
        { q: "Working together, A and B complete a job in 4 hours. A alone takes 6 hours. How long does B take alone?", choices: ["8h","10h","12h","14h"], answer: 2, explanation: "1/4 = 1/6 + 1/B → 1/B = 1/12, so B = 12 hrs." },
      ],
    },
  },
  reading: {
    "Main Idea": {
      easy: [
        { q: "'Despite centuries of study, the ocean floor remains largely unexplored.' The main idea is that the ocean floor is…", choices: ["well documented","mostly unknown","teeming with life","irrelevant"], answer: 1, explanation: "'Largely unexplored' = mostly unknown." },
        { q: "A paragraph describes how recycling reduces landfill waste. The main purpose is to…", choices: ["entertain readers","inform about recycling benefits","argue against recycling","describe landfill history"], answer: 1, explanation: "The paragraph informs about a benefit of recycling." },
      ],
      medium: [
        { q: "An author discusses both the advantages and disadvantages of remote work. The passage is primarily…", choices: ["persuasive — arguing for remote work","analytical — examining multiple perspectives","narrative — telling a personal story","descriptive — portraying a scene"], answer: 1, explanation: "Presenting pros and cons is analytical/balanced." },
      ],
      hard: [
        { q: "A passage opens with a personal anecdote, then shifts to cite three studies on climate change. This structure primarily serves to…", choices: ["entertain before educating","establish emotional connection then build credibility","refute the opening claim","summarize existing research"], answer: 1, explanation: "Anecdote = emotional hook; studies = credibility. This is a classic rhetorical structure." },
      ],
    },
    "Vocabulary in Context": {
      easy: [
        { q: "'The scientist's meticulous notes enabled the breakthrough.' 'Meticulous' most nearly means:", choices: ["careless","extremely careful","brief","creative"], answer: 1, explanation: "Meticulous = great attention to detail." },
        { q: "'She gave a candid answer.' 'Candid' most nearly means:", choices: ["rehearsed","honest","lengthy","confusing"], answer: 1, explanation: "Candid = truthful and straightforward." },
      ],
      medium: [
        { q: "'The politician's rhetoric was deliberately obfuscating.' 'Obfuscating' most nearly means:", choices: ["clarifying","persuasive","confusing","inspiring"], answer: 2, explanation: "Obfuscate = make unclear." },
        { q: "'The critic's review was scathing.' 'Scathing' most nearly means:", choices: ["mild","praising","harshly critical","brief"], answer: 2, explanation: "Scathing = severely critical." },
      ],
      hard: [
        { q: "In context: 'The new policy was seen as draconian by most citizens.' 'Draconian' most nearly means:", choices: ["generous","excessively harsh","widely popular","poorly explained"], answer: 1, explanation: "Draconian refers to laws/rules that are extremely severe." },
        { q: "'Her equanimity during the crisis impressed everyone.' 'Equanimity' means:", choices: ["panic","indifference","mental calmness","confusion"], answer: 2, explanation: "Equanimity = mental calmness and composure, especially in difficult situations." },
      ],
    },
    Evidence: {
      easy: [
        { q: "An author claims 'most teens prefer streaming to cable.' Which best supports this?", choices: ["A quote from one teen","A survey of 5,000 teens","A cable company press release","A parent's anecdote"], answer: 1, explanation: "Large representative survey = strongest evidence." },
      ],
      medium: [
        { q: "A researcher wants to prove Exercise X reduces stress. Which study design is strongest?", choices: ["Interviewing 5 people","Observing one gym class","Randomized controlled trial with 200 participants","Reading articles about exercise"], answer: 2, explanation: "Randomized controlled trials are the gold standard in research." },
        { q: "Which statement weakens the claim 'social media increases teen anxiety'?", choices: ["Studies show more screen time correlates with anxiety","Teens report feeling stressed by social media","A study shows no significant anxiety difference in teens who don't use social media","Anxiety rates rose as social media grew"], answer: 2, explanation: "If non-users show similar anxiety, social media may not be the cause." },
      ],
      hard: [
        { q: "An author argues a new drug is effective. A critic notes the study was funded by the drug manufacturer. This critique questions the study's:", choices: ["sample size","statistical methods","objectivity/bias","peer review status"], answer: 2, explanation: "Funding source can bias results — this is a conflict of interest argument." },
      ],
    },
    Grammar: {
      easy: [
        { q: "Which sentence is grammatically correct?", choices: ["Each of the students have a textbook.","Each of the students has a textbook.","Each students has a textbook.","Each of student have a textbook."], answer: 1, explanation: "'Each' is singular → 'has'." },
        { q: "Choose the correct sentence:", choices: ["Him and I went to the store.","He and I went to the store.","Him and me went to the store.","He and me went to the store."], answer: 1, explanation: "Subject pronouns: He and I (not Him and me)." },
      ],
      medium: [
        { q: "Which uses the semicolon correctly?", choices: ["I like cats; and dogs.","She studied hard; she passed the exam.","He ran fast; but lost.","They won; the game."], answer: 1, explanation: "Semicolons join two independent clauses." },
        { q: "Choose the correct word: 'The team (is/are) playing well.'", choices: ["is","are","were","have been"], answer: 0, explanation: "In American English, collective nouns like 'team' take singular verbs." },
      ],
      hard: [
        { q: "Which sentence avoids a dangling modifier?", choices: ["Running down the street, the rain soaked her.","Running down the street, she got soaked by the rain.","Having run down the street, the rain was heavy.","To run down the street, the rain started."], answer: 1, explanation: "The modifier 'Running down the street' must refer to the subject 'she'." },
        { q: "Identify the correct use of the apostrophe:", choices: ["The dogs' bone was buried.","The dog's' bone was buried.","The dogs bone was buried.","The dogs's bone was buried."], answer: 0, explanation: "Plural possessive: dogs' (the bone belonging to multiple dogs)." },
      ],
    },
    "Rhetorical Skills": {
      easy: [
        { q: "An author ends an essay urging readers to vote. This is primarily meant to:", choices: ["entertain","inform about history","persuade readers to act","describe a process"], answer: 2, explanation: "Call to action = persuasive device." },
      ],
      medium: [
        { q: "An author uses a rhetorical question: 'Can we really afford to ignore climate change?' The purpose is to:", choices: ["request information","admit uncertainty","prompt the reader to reflect and agree","introduce a counterargument"], answer: 2, explanation: "Rhetorical questions aren't meant to be answered — they guide the reader to a conclusion." },
        { q: "An author writes: 'Like a ship without a compass, the company drifted.' This is an example of:", choices: ["alliteration","a metaphor/simile","hyperbole","personification"], answer: 1, explanation: "'Like a ship' is a simile comparing the company to a ship." },
      ],
      hard: [
        { q: "An author refutes a common counterargument before presenting their own thesis. This technique is called:", choices: ["anaphora","a concession and rebuttal","an appeal to authority","circular reasoning"], answer: 1, explanation: "Acknowledging then refuting the opposing view strengthens the author's argument." },
        { q: "Which best describes the rhetorical effect of repeating a phrase at the start of consecutive sentences?", choices: ["It creates ambiguity","It is anaphora — building emphasis and rhythm","It is an ad hominem attack","It weakens the argument"], answer: 1, explanation: "Repeating a phrase at the start of clauses is anaphora, a persuasive device for emphasis." },
      ],
    },
  },
};

// ─── STORAGE ────────────────────────────────────────────────────────────────
function loadProgress() {
  try {
    const stored = localStorage.getItem("sat_progress_v3");
    if (stored) return JSON.parse(stored);
  } catch {}
  const init = {};
  Object.keys(SECTIONS).forEach((sec) => {
    init[sec] = {};
    SECTIONS[sec].topics.forEach((t) => {
      init[sec][t] = { easy: { c: 0, t: 0 }, medium: { c: 0, t: 0 }, hard: { c: 0, t: 0 } };
    });
  });
  return init;
}
function saveProgress(p) { try { localStorage.setItem("sat_progress_v3", JSON.stringify(p)); } catch {} }
function pct(c, t) { return t === 0 ? 0 : Math.round((c / t) * 100); }

function getQuestionsForPracticeTest(length, difficulty) {
  const config = TEST_LENGTHS[length];
  const allQuestions = [];
  const sections = [
    { key: "math", count: config.math },
    { key: "reading", count: config.rw },
  ];
  sections.forEach(({ key, count }) => {
    const topics = SECTIONS[key].topics;
    let pool = [];
    topics.forEach((topic) => {
      const qs = QUESTION_BANK[key][topic]?.[difficulty] ?? [];
      pool.push(...qs.map((q) => ({ ...q, section: key, topic })));
    });
    pool = pool.sort(() => Math.random() - 0.5);
    allQuestions.push(...pool.slice(0, count));
  });
  return allQuestions.sort(() => Math.random() - 0.5);
}

// ─── RADIAL PROGRESS ────────────────────────────────────────────────────────
function RadialProgress({ value, size = 80, stroke = 7, color = "#4f8ef7" }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e2130" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }} />
    </svg>
  );
}

// ─── PRACTICE TEST SELECTOR PAGE ────────────────────────────────────────────
function PracticeTestPage({ onStart, onBack }) {
  const [selectedLength, setSelectedLength] = useState("half");
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
  const config = TEST_LENGTHS[selectedLength];
  const diff = DIFFICULTY_LEVELS[selectedDifficulty];

  return (
    <div style={styles.page}>
      {/* Header */}
      <button onClick={onBack} style={styles.backBtn}>← Dashboard</button>
      <div style={styles.pageHeader}>
        <div style={styles.heroLabel}>PRACTICE TEST</div>
        <h1 style={styles.heroTitle}>Configure Your Session</h1>
        <p style={styles.heroSub}>
          The real Digital SAT has <strong style={{color:"#4f8ef7"}}>98 questions</strong> —
          54 Reading & Writing + 44 Math
        </p>
      </div>

      {/* Test Length */}
      <div style={styles.sectionCard}>
        <div style={styles.cardLabel}>📏 Test Length</div>
        <div style={styles.optionGrid}>
          {Object.entries(TEST_LENGTHS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setSelectedLength(key)}
              style={{
                ...styles.optionCard,
                borderColor: selectedLength === key ? "#4f8ef7" : "#2a2f42",
                background: selectedLength === key ? "#0f1b35" : "#13181f",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>
                {key === "full" ? "📋" : key === "half" ? "📄" : "📝"}
              </div>
              <div style={{ fontWeight: 800, fontSize: 15, color: selectedLength === key ? "#4f8ef7" : "#e8eaf0" }}>
                {val.label}
              </div>
              <div style={{ color: "#7a8298", fontSize: 12, marginTop: 4 }}>{val.total} questions</div>
              <div style={styles.pill}>{val.time}</div>
              <div style={{ color: "#5a6282", fontSize: 11, marginTop: 6 }}>
                {val.rw} R&W · {val.math} Math
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div style={styles.sectionCard}>
        <div style={styles.cardLabel}>🎯 Difficulty Level</div>
        <p style={{ color: "#7a8298", fontSize: 13, marginBottom: 16, marginTop: -8 }}>
          The real SAT mixes all difficulty levels — focus on one tier to build targeted skills.
        </p>
        <div style={styles.optionGrid}>
          {Object.entries(DIFFICULTY_LEVELS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setSelectedDifficulty(key)}
              style={{
                ...styles.optionCard,
                borderColor: selectedDifficulty === key ? val.color : "#2a2f42",
                background: selectedDifficulty === key ? `${val.color}15` : "#13181f",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>
                {key === "easy" ? "🟢" : key === "medium" ? "🟡" : "🔴"}
              </div>
              <div style={{ fontWeight: 800, fontSize: 15, color: selectedDifficulty === key ? val.color : "#e8eaf0" }}>
                {val.label}
              </div>
              <div style={{ color: "#7a8298", fontSize: 12, marginTop: 6, lineHeight: 1.4 }}>
                {val.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Summary & Start */}
      <div style={styles.summaryCard}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 6 }}>Your Session</div>
          <div style={{ color: "#aaa", fontSize: 14 }}>
            <span style={{ color: "#4f8ef7", fontWeight: 700 }}>{config.total} questions</span>
            {" "}·{" "}
            <span style={{ color: diff.color, fontWeight: 700 }}>{diff.label}</span>
            {" "}difficulty · ~{config.time}
          </div>
          <div style={{ color: "#5a6282", fontSize: 12, marginTop: 4 }}>
            {config.rw} Reading & Writing · {config.math} Math
          </div>
        </div>
        <button
          onClick={() => onStart(selectedLength, selectedDifficulty)}
          style={styles.startBtn}
        >
          Start Test →
        </button>
      </div>
    </div>
  );
}

// ─── QUIZ VIEW ───────────────────────────────────────────────────────────────
function QuizView({ questions, onDone }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExp, setShowExp] = useState(false);
  const [results, setResults] = useState([]);

  if (!questions || questions.length === 0) {
    return (
      <div style={styles.card}>
        <p style={{ color: "#aaa" }}>No questions available for this configuration.</p>
        <button style={styles.btn} onClick={() => onDone([])}>Back</button>
      </div>
    );
  }

  const q = questions[idx];
  const isLast = idx === questions.length - 1;
  const progress = ((idx + 1) / questions.length) * 100;
  const sectionColor = SECTIONS[q.section]?.color ?? "#4f8ef7";

  function choose(i) {
    if (selected !== null) return;
    setSelected(i);
    setShowExp(true);
    setResults((r) => [...r, { section: q.section, topic: q.topic, correct: i === q.answer }]);
  }

  function next() {
    const newResults = [...results, { section: q.section, topic: q.topic, correct: selected === q.answer }];
    if (isLast) {
      onDone(newResults);
    } else {
      setIdx((i) => i + 1);
      setSelected(null);
      setShowExp(false);
    }
  }

  return (
    <div style={styles.quizWrap}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ color: "#aaa", fontSize: 12 }}>
          {SECTIONS[q.section]?.label} › {q.topic}
        </span>
        <span style={{ color: sectionColor, fontWeight: 700, fontSize: 13 }}>
          {idx + 1} / {questions.length}
        </span>
      </div>
      <div style={{ height: 4, background: "#1e2130", borderRadius: 4, marginBottom: 28 }}>
        <div style={{ height: 4, width: `${progress}%`, background: sectionColor, borderRadius: 4, transition: "width 0.4s ease" }} />
      </div>
      <p style={styles.question}>{q.q}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {q.choices.map((c, i) => {
          let bg = "#1a1f2e", border = "#2a2f42";
          if (selected !== null) {
            if (i === q.answer) { bg = "#162d1e"; border = "#2ecc71"; }
            else if (i === selected) { bg = "#2d1616"; border = "#e74c3c"; }
          }
          return (
            <button key={i} onClick={() => choose(i)}
              style={{ ...styles.choice, background: bg, border: `1.5px solid ${border}`, cursor: selected !== null ? "default" : "pointer" }}>
              <span style={{ color: sectionColor, fontWeight: 700, marginRight: 12, fontSize: 13 }}>
                {String.fromCharCode(65 + i)}
              </span>
              {c}
            </button>
          );
        })}
      </div>
      {showExp && (
        <div style={styles.explanation}>
          <span style={{ color: selected === q.answer ? "#2ecc71" : "#e74c3c", fontWeight: 700, marginRight: 8 }}>
            {selected === q.answer ? "✓ Correct!" : "✗ Incorrect"}
          </span>
          {q.explanation}
        </div>
      )}
      {selected !== null && (
        <button style={{ ...styles.btn, background: sectionColor, marginTop: 16 }} onClick={next}>
          {isLast ? "Finish Test →" : "Next Question →"}
        </button>
      )}
    </div>
  );
}

// ─── RESULTS VIEW ────────────────────────────────────────────────────────────
function ResultsView({ results, length, difficulty, onBack, onRetry }) {
  const correct = results.filter((r) => r.correct).length;
  const total = results.length;
  const p = pct(correct, total);
  const diff = DIFFICULTY_LEVELS[difficulty];
  const grade = p >= 80 ? "Excellent!" : p >= 60 ? "Good work!" : "Keep practicing!";
  const ringColor = p >= 75 ? "#2ecc71" : p >= 50 ? "#f7c44f" : "#e74c3c";

  // breakdown by topic
  const topicBreakdown = {};
  results.forEach(({ section, topic, correct: c }) => {
    const key = `${section}::${topic}`;
    if (!topicBreakdown[key]) topicBreakdown[key] = { section, topic, correct: 0, total: 0 };
    topicBreakdown[key].total++;
    if (c) topicBreakdown[key].correct++;
  });

  return (
    <div style={styles.page}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ position: "relative", display: "inline-flex", marginBottom: 16 }}>
          <RadialProgress value={p} size={130} stroke={10} color={ringColor} />
          <div style={{ ...styles.radialLabel }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>{p}%</div>
          </div>
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>{grade}</h2>
        <p style={{ color: "#aaa" }}>
          {TEST_LENGTHS[length].label} · <span style={{ color: diff.color }}>{diff.label}</span> difficulty
        </p>
        <p style={{ color: "#ccc", fontSize: 18, fontWeight: 700, marginTop: 8 }}>
          {correct} / {total} correct
        </p>
      </div>

      {/* Topic Breakdown */}
      <div style={styles.sectionCard}>
        <div style={styles.cardLabel}>📊 Performance by Topic</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Object.values(topicBreakdown).map(({ section, topic, correct: c, total: t }) => {
            const tp = pct(c, t);
            const barColor = tp >= 75 ? "#2ecc71" : tp >= 50 ? "#f7c44f" : "#e74c3c";
            return (
              <div key={`${section}${topic}`} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 160, flexShrink: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{topic}</div>
                  <div style={{ fontSize: 11, color: "#7a8298" }}>{SECTIONS[section].label}</div>
                </div>
                <div style={styles.barTrack}>
                  <div style={{ ...styles.barFill, width: `${tp}%`, background: barColor }} />
                </div>
                <span style={{ color: barColor, fontWeight: 700, fontSize: 13, minWidth: 40 }}>{tp}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
        <button style={{ ...styles.btn, background: "#4f8ef7" }} onClick={onRetry}>Try Again</button>
        <button style={{ ...styles.btn, background: "#1e2130", border: "1.5px solid #2a2f42" }} onClick={onBack}>Dashboard</button>
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ progress, onStartTopic, onPracticeTest }) {
  const allStats = Object.values(progress).flatMap((sec) =>
    Object.values(sec).flatMap((t) => Object.values(t))
  );
  const totalC = allStats.reduce((a, s) => a + s.c, 0);
  const totalT = allStats.reduce((a, s) => a + s.t, 0);
  const overallPct = pct(totalC, totalT);

  const weakTopics = [];
  Object.keys(SECTIONS).forEach((sec) => {
    SECTIONS[sec].topics.forEach((topic) => {
      const s = progress[sec]?.[topic];
      if (!s) return;
      const allDiff = Object.values(s);
      const tot = allDiff.reduce((a, x) => a + x.t, 0);
      const cor = allDiff.reduce((a, x) => a + x.c, 0);
      if (tot > 0 && pct(cor, tot) < 60) weakTopics.push(topic);
    });
  });

  return (
    <div style={styles.dashWrap}>
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroLeft}>
          <div style={styles.heroLabel}>SAT PREP</div>
          <h1 style={styles.heroTitle}>Study Dashboard</h1>
          <p style={styles.heroSub}>Track progress · Identify gaps · Ace the test</p>
          <button onClick={onPracticeTest} style={styles.practiceTestBtn}>
            📋 Take a Practice Test
          </button>
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <RadialProgress value={overallPct} size={110} stroke={9} color="#4f8ef7" />
          <div style={styles.radialLabel}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{overallPct}%</div>
            <div style={{ fontSize: 10, color: "#aaa" }}>Overall</div>
          </div>
        </div>
      </div>

      {weakTopics.length > 0 && (
        <div style={styles.alertBox}>
          <span style={{ fontSize: 16, marginRight: 10 }}>⚠</span>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 4, color: "#f7c44f" }}>Areas needing attention</div>
            <div style={{ color: "#ccc", fontSize: 13 }}>{weakTopics.join(" · ")}</div>
          </div>
        </div>
      )}

      {Object.entries(SECTIONS).map(([secKey, sec]) => (
        <div key={secKey} style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <span style={{ fontSize: 22, marginRight: 10 }}>{sec.icon}</span>
            <span style={{ fontWeight: 700, fontSize: 17 }}>{sec.label}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {sec.topics.map((topic) => {
              const s = progress[secKey]?.[topic] ?? { easy:{c:0,t:0}, medium:{c:0,t:0}, hard:{c:0,t:0} };
              const totals = Object.values(s).reduce((a, x) => ({ c: a.c + x.c, t: a.t + x.t }), { c: 0, t: 0 });
              const tp = pct(totals.c, totals.t);
              const barColor = tp >= 75 ? "#2ecc71" : tp >= 50 ? "#f7c44f" : tp > 0 ? "#e74c3c" : "#2a2f42";
              return (
                <div key={topic}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ width: 180, flexShrink: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{topic}</div>
                      <div style={{ color: "#aaa", fontSize: 12 }}>
                        {totals.t === 0 ? "Not started" : `${totals.c}/${totals.t} (${tp}%)`}
                      </div>
                    </div>
                    <div style={{ ...styles.barTrack, flex: 1 }}>
                      <div style={{ ...styles.barFill, width: `${tp}%`, background: barColor }} />
                    </div>
                  </div>
                  {/* Difficulty sub-buttons */}
                  <div style={{ display: "flex", gap: 8, marginTop: 8, marginLeft: 192, flexWrap: "wrap" }}>
                    {Object.entries(DIFFICULTY_LEVELS).map(([diff, dv]) => {
                      const ds = s[diff] ?? { c: 0, t: 0 };
                      return (
                        <button key={diff}
                          onClick={() => onStartTopic(secKey, topic, diff)}
                          style={{ ...styles.diffBtn, borderColor: dv.color, color: dv.color }}>
                          {dv.label} {ds.t > 0 ? `(${pct(ds.c, ds.t)}%)` : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div style={styles.footer}>Questions answered: {totalT} · Correct: {totalC}</div>
    </div>
  );
}

// ─── TOPIC QUIZ (single topic) ───────────────────────────────────────────────
function TopicQuizView({ section, topic, difficulty, onDone }) {
  const pool = (QUESTION_BANK[section]?.[topic]?.[difficulty] ?? []).sort(() => Math.random() - 0.5);
  const questions = pool.map((q) => ({ ...q, section, topic }));
  return <QuizView questions={questions} onDone={onDone} />;
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [view, setView] = useState("dashboard");
  const [active, setActive] = useState({});
  const [lastResults, setLastResults] = useState(null);

  useEffect(() => saveProgress(progress), [progress]);

  function updateProgress(results) {
    setProgress((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      results.forEach(({ section, topic, correct }) => {
        if (!next[section]?.[topic]) return;
        const diff = active.difficulty ?? "medium";
        if (!next[section][topic][diff]) next[section][topic][diff] = { c: 0, t: 0 };
        next[section][topic][diff].t++;
        if (correct) next[section][topic][diff].c++;
      });
      return next;
    });
  }

  function finishQuiz(results) {
    updateProgress(results);
    setLastResults(results);
    setView("results");
  }

  return (
    <div style={styles.root}>
      <div style={styles.container}>
        {view === "dashboard" && (
          <>
            <Dashboard
              progress={progress}
              onStartTopic={(sec, topic, diff) => {
                setActive({ section: sec, topic, difficulty: diff, mode: "topic" });
                setView("quiz");
              }}
              onPracticeTest={() => setView("practiceTest")}
            />
            <button style={{ ...styles.btn, background: "transparent", border: "1px solid #222", color: "#444", margin: "0 auto", display: "block", fontSize: 12, marginTop: 8 }}
              onClick={() => { if (confirm("Reset all progress?")) { setProgress(loadProgress()); localStorage.removeItem("sat_progress_v3"); } }}>
              Reset All Progress
            </button>
          </>
        )}
        {view === "practiceTest" && (
          <PracticeTestPage
            onBack={() => setView("dashboard")}
            onStart={(length, difficulty) => {
              const qs = getQuestionsForPracticeTest(length, difficulty);
              setActive({ mode: "practice", length, difficulty, questions: qs });
              setView("quiz");
            }}
          />
        )}
        {view === "quiz" && active.mode === "topic" && (
          <TopicQuizView
            section={active.section}
            topic={active.topic}
            difficulty={active.difficulty}
            onDone={finishQuiz}
          />
        )}
        {view === "quiz" && active.mode === "practice" && (
          <QuizView questions={active.questions} onDone={finishQuiz} />
        )}
        {view === "results" && lastResults && (
          <ResultsView
            results={lastResults}
            length={active.length ?? "quarter"}
            difficulty={active.difficulty ?? "medium"}
            onBack={() => setView("dashboard")}
            onRetry={() => {
              if (active.mode === "practice") {
                const qs = getQuestionsForPracticeTest(active.length, active.difficulty);
                setActive({ ...active, questions: qs });
              }
              setView("quiz");
            }}
          />
        )}
      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = {
  root: { minHeight: "100vh", background: "#0d1117", color: "#e8eaf0", fontFamily: "'DM Sans', system-ui, sans-serif", padding: "24px 16px 48px" },
  container: { maxWidth: 700, margin: "0 auto" },
  card: { background: "#13181f", border: "1px solid #1e2838", borderRadius: 16, padding: "32px 28px" },
  dashWrap: { display: "flex", flexDirection: "column", gap: 20 },
  page: { display: "flex", flexDirection: "column", gap: 20 },
  pageHeader: { background: "linear-gradient(135deg, #0f1b35 0%, #13181f 100%)", border: "1px solid #1e2838", borderRadius: 20, padding: "28px" },
  hero: { background: "linear-gradient(135deg, #0f1b35 0%, #13181f 100%)", border: "1px solid #1e2838", borderRadius: 20, padding: "32px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  heroLeft: { flex: 1 },
  heroLabel: { fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#4f8ef7", marginBottom: 8 },
  heroTitle: { fontSize: 28, fontWeight: 800, margin: "0 0 8px", lineHeight: 1.1 },
  heroSub: { color: "#7a8298", fontSize: 13, margin: "0 0 16px" },
  radialLabel: { position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  practiceTestBtn: { background: "linear-gradient(135deg, #1a3a6e, #0f2347)", border: "1.5px solid #4f8ef7", borderRadius: 10, padding: "10px 18px", color: "#7ab3f7", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" },
  alertBox: { background: "#1a1700", border: "1px solid #3d3000", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "flex-start" },
  sectionCard: { background: "#13181f", border: "1px solid #1e2838", borderRadius: 16, padding: "24px 22px" },
  sectionHeader: { display: "flex", alignItems: "center", marginBottom: 18, fontSize: 15 },
  cardLabel: { fontWeight: 700, fontSize: 14, color: "#7a8298", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 },
  optionGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 },
  optionCard: { borderRadius: 14, border: "2px solid", padding: "20px 14px", cursor: "pointer", textAlign: "center", fontFamily: "inherit", transition: "all 0.2s" },
  pill: { display: "inline-block", background: "#1e2838", borderRadius: 20, padding: "3px 10px", fontSize: 11, color: "#7ab3f7", marginTop: 8 },
  summaryCard: { background: "#13181f", border: "1.5px solid #1e2838", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" },
  startBtn: { background: "linear-gradient(135deg, #2563eb, #1a3a6e)", border: "none", borderRadius: 12, padding: "14px 28px", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 },
  barTrack: { height: 6, background: "#1e2130", borderRadius: 4, overflow: "hidden", minWidth: 60 },
  barFill: { height: "100%", borderRadius: 4, transition: "width 0.5s ease" },
  diffBtn: { background: "transparent", border: "1.5px solid", borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  quizWrap: { background: "#13181f", border: "1px solid #1e2838", borderRadius: 16, padding: "32px 28px" },
  question: { fontSize: 17, lineHeight: 1.6, fontWeight: 600, marginBottom: 24, color: "#e8eaf0" },
  choice: { display: "flex", alignItems: "center", padding: "14px 16px", borderRadius: 10, fontSize: 14, color: "#cdd0dc", textAlign: "left", fontFamily: "inherit", lineHeight: 1.4 },
  explanation: { background: "#111520", border: "1px solid #1e2838", borderRadius: 10, padding: "14px 16px", fontSize: 13, color: "#b0b8cc", lineHeight: 1.6 },
  btn: { padding: "12px 24px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", color: "#fff", letterSpacing: 0.3 },
  backBtn: { background: "transparent", border: "none", color: "#4f8ef7", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", padding: "0 0 4px", alignSelf: "flex-start" },
  footer: { color: "#4a5068", fontSize: 12, textAlign: "center", paddingBottom: 8 },
};
