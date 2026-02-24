import { useState, useEffect, useCallback } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

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

const QUESTION_BANK = {
  math: {
    Algebra: [
      {
        q: "If 3x + 7 = 22, what is the value of x?",
        choices: ["3", "5", "7", "9"],
        answer: 1,
        explanation: "3x = 22 − 7 = 15, so x = 5.",
      },
      {
        q: "Which of the following is equivalent to 2(x + 3) − 4(x − 1)?",
        choices: ["−2x + 10", "6x + 2", "−2x + 2", "2x + 10"],
        answer: 0,
        explanation: "2x + 6 − 4x + 4 = −2x + 10.",
      },
      {
        q: "If y = 2x − 1 and y = x + 3, what is x?",
        choices: ["2", "4", "5", "7"],
        answer: 1,
        explanation: "2x − 1 = x + 3 → x = 4.",
      },
    ],
    Geometry: [
      {
        q: "A rectangle has length 8 and width 5. What is its area?",
        choices: ["26", "40", "13", "45"],
        answer: 1,
        explanation: "Area = 8 × 5 = 40.",
      },
      {
        q: "The radius of a circle is 6. What is the circumference? (Use π ≈ 3.14)",
        choices: ["18.84", "37.68", "113.04", "28.26"],
        answer: 1,
        explanation: "C = 2πr = 2 × 3.14 × 6 = 37.68.",
      },
    ],
    "Data Analysis": [
      {
        q: "In a data set {4, 7, 7, 9, 13}, what is the median?",
        choices: ["7", "8", "9", "6"],
        answer: 0,
        explanation: "The middle value of the sorted set is 7.",
      },
      {
        q: "A student scored 80, 90, 70, and 100 on four tests. What is the mean?",
        choices: ["82", "84", "85", "90"],
        answer: 2,
        explanation: "(80+90+70+100)/4 = 340/4 = 85.",
      },
    ],
    "Advanced Math": [
      {
        q: "What are the roots of x² − 5x + 6 = 0?",
        choices: ["x = 2 and x = 3", "x = 1 and x = 6", "x = −2 and x = −3", "x = 0 and x = 5"],
        answer: 0,
        explanation: "Factor: (x − 2)(x − 3) = 0, so x = 2 or x = 3.",
      },
    ],
    "Problem Solving": [
      {
        q: "If a car travels 150 miles in 3 hours, what is its average speed in mph?",
        choices: ["40", "45", "50", "55"],
        answer: 2,
        explanation: "Speed = distance / time = 150 / 3 = 50 mph.",
      },
    ],
  },
  reading: {
    "Main Idea": [
      {
        q: "A paragraph begins: 'Despite centuries of study, the ocean floor remains largely unexplored.' The main idea is that the ocean floor is…",
        choices: ["well documented", "mostly unknown", "teeming with life", "scientifically irrelevant"],
        answer: 1,
        explanation: "'Largely unexplored' directly supports the idea that it is mostly unknown.",
      },
    ],
    "Vocabulary in Context": [
      {
        q: "In the sentence 'The scientist's meticulous notes enabled the breakthrough,' the word 'meticulous' most nearly means:",
        choices: ["careless", "extremely careful", "brief", "creative"],
        answer: 1,
        explanation: "'Meticulous' means showing great attention to detail — extremely careful.",
      },
      {
        q: "'The politician's rhetoric was deliberately obfuscating.' 'Obfuscating' most nearly means:",
        choices: ["clarifying", "persuasive", "confusing", "inspiring"],
        answer: 2,
        explanation: "'Obfuscate' means to make unclear or confusing.",
      },
    ],
    Evidence: [
      {
        q: "If an author claims 'most teens prefer streaming to cable,' which evidence best supports this?",
        choices: [
          "A quote from one teenager",
          "A survey of 5,000 teens nationwide",
          "A cable company's press release",
          "An anecdote from a parent",
        ],
        answer: 1,
        explanation: "A large, representative survey is the strongest and most reliable evidence.",
      },
    ],
    Grammar: [
      {
        q: "Which sentence is grammatically correct?",
        choices: [
          "Each of the students have a textbook.",
          "Each of the students has a textbook.",
          "Each of the students are having a textbook.",
          "Each of the students had been having a textbook.",
        ],
        answer: 1,
        explanation: "'Each' is singular, so it takes the singular verb 'has.'",
      },
    ],
    "Rhetorical Skills": [
      {
        q: "An author ends an essay with a call to action urging readers to vote. This technique is primarily meant to:",
        choices: ["entertain", "inform about history", "persuade readers to act", "describe a process"],
        answer: 2,
        explanation: "A call to action is a persuasive device meant to motivate readers to do something.",
      },
    ],
  },
};

// ─── STORAGE ────────────────────────────────────────────────────────────────

function loadProgress() {
  try {
    const stored = localStorage.getItem("sat_progress_v2");
    if (stored) return JSON.parse(stored);
  } catch {}
  const init = {};
  Object.keys(SECTIONS).forEach((sec) => {
    init[sec] = {};
    SECTIONS[sec].topics.forEach((t) => {
      init[sec][t] = { correct: 0, total: 0 };
    });
  });
  return init;
}

function saveProgress(progress) {
  try {
    localStorage.setItem("sat_progress_v2", JSON.stringify(progress));
  } catch {}
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function pct(c, t) {
  return t === 0 ? 0 : Math.round((c / t) * 100);
}

function getQuestions(section, topic) {
  const pool = QUESTION_BANK[section]?.[topic] ?? [];
  return [...pool].sort(() => Math.random() - 0.5);
}

function getWeakTopics(progress) {
  const weak = [];
  Object.keys(SECTIONS).forEach((sec) => {
    SECTIONS[sec].topics.forEach((t) => {
      const s = progress[sec]?.[t] ?? { correct: 0, total: 0 };
      if (s.total > 0 && pct(s.correct, s.total) < 60) weak.push({ sec, topic: t });
    });
  });
  return weak;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function RadialProgress({ value, size = 80, stroke = 7, color = "#4f8ef7" }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e2130" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

// ─── QUIZ VIEW ───────────────────────────────────────────────────────────────

function QuizView({ section, topic, onDone }) {
  const questions = getQuestions(section, topic);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExp, setShowExp] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  if (questions.length === 0) {
    return (
      <div style={styles.card}>
        <p style={{ color: "#aaa" }}>No questions available for this topic yet.</p>
        <button style={styles.btn} onClick={() => onDone(0, 0)}>Back</button>
      </div>
    );
  }

  const q = questions[idx];
  const isLast = idx === questions.length - 1;

  function choose(i) {
    if (selected !== null) return;
    setSelected(i);
    setShowExp(true);
    setScore((s) => ({ correct: s.correct + (i === q.answer ? 1 : 0), total: s.total + 1 }));
  }

  function next() {
    if (isLast) {
      onDone(score.correct + (selected === q.answer ? 1 : 0), score.total + 1);
    } else {
      setIdx((i) => i + 1);
      setSelected(null);
      setShowExp(false);
    }
  }

  const progress = ((idx + 1) / questions.length) * 100;
  const sectionColor = SECTIONS[section].color;

  return (
    <div style={styles.quizWrap}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ color: "#aaa", fontSize: 13 }}>
          {SECTIONS[section].label} › {topic}
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
          let bg = "#1a1f2e";
          let border = "#2a2f42";
          if (selected !== null) {
            if (i === q.answer) { bg = "#162d1e"; border = "#2ecc71"; }
            else if (i === selected && i !== q.answer) { bg = "#2d1616"; border = "#e74c3c"; }
          }
          if (selected === null) {
            bg = undefined; // handled via hover in style
          }
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              style={{
                ...styles.choice,
                background: bg ?? "#1a1f2e",
                border: `1.5px solid ${border}`,
                cursor: selected !== null ? "default" : "pointer",
              }}
            >
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
          {isLast ? "Finish Quiz" : "Next Question →"}
        </button>
      )}
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

function Dashboard({ progress, onStart }) {
  const weakTopics = getWeakTopics(progress);

  const totalCorrect = Object.values(progress).flatMap((sec) =>
    Object.values(sec).map((t) => t.correct)
  ).reduce((a, b) => a + b, 0);

  const totalAttempted = Object.values(progress).flatMap((sec) =>
    Object.values(sec).map((t) => t.total)
  ).reduce((a, b) => a + b, 0);

  const overallPct = pct(totalCorrect, totalAttempted);

  return (
    <div style={styles.dashWrap}>
      {/* Header */}
      <div style={styles.hero}>
        <div style={styles.heroLeft}>
          <div style={styles.heroLabel}>SAT PREP</div>
          <h1 style={styles.heroTitle}>Study Dashboard</h1>
          <p style={styles.heroSub}>Track progress · Identify gaps · Ace the test</p>
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <RadialProgress value={overallPct} size={110} stroke={9} color="#4f8ef7" />
          <div style={styles.radialLabel}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{overallPct}%</div>
            <div style={{ fontSize: 10, color: "#aaa" }}>Overall</div>
          </div>
        </div>
      </div>

      {/* Weak Areas */}
      {weakTopics.length > 0 && (
        <div style={styles.alertBox}>
          <span style={{ fontSize: 16, marginRight: 10 }}>⚠</span>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 4, color: "#f7c44f" }}>Areas needing attention</div>
            <div style={{ color: "#ccc", fontSize: 13 }}>
              {weakTopics.map((w) => `${w.topic}`).join(" · ")}
            </div>
          </div>
        </div>
      )}

      {/* Sections */}
      {Object.entries(SECTIONS).map(([secKey, sec]) => (
        <div key={secKey} style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <span style={{ fontSize: 22, marginRight: 10 }}>{sec.icon}</span>
            <span style={{ fontWeight: 700, fontSize: 17 }}>{sec.label}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sec.topics.map((topic) => {
              const s = progress[secKey]?.[topic] ?? { correct: 0, total: 0 };
              const p = pct(s.correct, s.total);
              const barColor = p >= 75 ? "#2ecc71" : p >= 50 ? "#f7c44f" : p > 0 ? "#e74c3c" : "#2a2f42";
              return (
                <div key={topic} style={styles.topicRow}>
                  <div style={styles.topicMeta}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{topic}</span>
                    <span style={{ color: "#aaa", fontSize: 12 }}>
                      {s.total === 0 ? "Not started" : `${s.correct}/${s.total} correct (${p}%)`}
                    </span>
                  </div>
                  <div style={styles.barTrack}>
                    <div style={{ ...styles.barFill, width: `${p}%`, background: barColor }} />
                  </div>
                  <button
                    style={{ ...styles.quizBtn, borderColor: sec.color, color: sec.color }}
                    onClick={() => onStart(secKey, topic)}
                  >
                    {s.total === 0 ? "Start" : "Practice"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div style={styles.footer}>
        Questions answered: {totalAttempted} · Correct: {totalCorrect}
      </div>
    </div>
  );
}

// ─── RESULTS VIEW ────────────────────────────────────────────────────────────

function ResultsView({ section, topic, correct, total, onBack, onRetry }) {
  const p = pct(correct, total);
  const sectionColor = SECTIONS[section].color;
  const grade = p >= 80 ? "Excellent!" : p >= 60 ? "Good work!" : "Keep practicing!";
  return (
    <div style={{ ...styles.card, textAlign: "center", padding: "48px 32px" }}>
      <div style={{ position: "relative", display: "inline-flex", marginBottom: 20 }}>
        <RadialProgress value={p} size={130} stroke={10} color={p >= 75 ? "#2ecc71" : p >= 50 ? "#f7c44f" : "#e74c3c"} />
        <div style={{ ...styles.radialLabel, fontSize: 28, fontWeight: 800 }}>
          <div style={{ color: "#fff" }}>{p}%</div>
        </div>
      </div>
      <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>{grade}</h2>
      <p style={{ color: "#aaa", marginBottom: 4 }}>
        {topic} · {SECTIONS[section].label}
      </p>
      <p style={{ color: "#ccc", marginBottom: 32 }}>
        {correct} of {total} questions correct
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button style={{ ...styles.btn, background: sectionColor }} onClick={onRetry}>
          Try Again
        </button>
        <button style={{ ...styles.btn, background: "#1e2130", border: "1.5px solid #2a2f42" }} onClick={onBack}>
          Dashboard
        </button>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [view, setView] = useState("dashboard"); // dashboard | quiz | results
  const [active, setActive] = useState({ section: null, topic: null });
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => saveProgress(progress), [progress]);

  function startQuiz(section, topic) {
    setActive({ section, topic });
    setView("quiz");
  }

  function finishQuiz(correct, total) {
    setProgress((prev) => {
      const next = { ...prev };
      const current = next[active.section][active.topic];
      next[active.section] = {
        ...next[active.section],
        [active.topic]: {
          correct: current.correct + correct,
          total: current.total + total,
        },
      };
      return next;
    });
    setLastResult({ correct, total });
    setView("results");
  }

  function resetAll() {
    if (!confirm("Reset all progress? This cannot be undone.")) return;
    const fresh = loadProgress();
    Object.keys(SECTIONS).forEach((sec) => {
      SECTIONS[sec].topics.forEach((t) => {
        fresh[sec][t] = { correct: 0, total: 0 };
      });
    });
    setProgress(fresh);
    setView("dashboard");
  }

  return (
    <div style={styles.root}>
      <div style={styles.container}>
        {view === "dashboard" && (
          <>
            <Dashboard progress={progress} onStart={startQuiz} />
            <button style={{ ...styles.btn, background: "transparent", border: "1px solid #333", color: "#666", margin: "0 auto", display: "block", fontSize: 12, marginTop: 8 }} onClick={resetAll}>
              Reset All Progress
            </button>
          </>
        )}
        {view === "quiz" && (
          <QuizView
            section={active.section}
            topic={active.topic}
            onDone={finishQuiz}
          />
        )}
        {view === "results" && lastResult && (
          <ResultsView
            section={active.section}
            topic={active.topic}
            correct={lastResult.correct}
            total={lastResult.total}
            onBack={() => setView("dashboard")}
            onRetry={() => startQuiz(active.section, active.topic)}
          />
        )}
      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0d1117",
    color: "#e8eaf0",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    padding: "24px 16px 48px",
  },
  container: {
    maxWidth: 680,
    margin: "0 auto",
  },
  card: {
    background: "#13181f",
    border: "1px solid #1e2838",
    borderRadius: 16,
    padding: "32px 28px",
  },
  dashWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  hero: {
    background: "linear-gradient(135deg, #0f1b35 0%, #13181f 100%)",
    border: "1px solid #1e2838",
    borderRadius: 20,
    padding: "32px 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroLeft: {
    flex: 1,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 3,
    color: "#4f8ef7",
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 800,
    margin: "0 0 8px",
    lineHeight: 1.1,
  },
  heroSub: {
    color: "#7a8298",
    fontSize: 13,
    margin: 0,
  },
  radialLabel: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  alertBox: {
    background: "#1a1700",
    border: "1px solid #3d3000",
    borderRadius: 12,
    padding: "14px 18px",
    display: "flex",
    alignItems: "flex-start",
    gap: 4,
  },
  sectionCard: {
    background: "#13181f",
    border: "1px solid #1e2838",
    borderRadius: 16,
    padding: "24px 22px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: 18,
    fontSize: 15,
    color: "#e8eaf0",
  },
  topicRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  topicMeta: {
    width: 180,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    flexShrink: 0,
  },
  barTrack: {
    flex: 1,
    height: 6,
    background: "#1e2130",
    borderRadius: 4,
    overflow: "hidden",
    minWidth: 60,
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
    transition: "width 0.5s ease",
  },
  quizBtn: {
    background: "transparent",
    border: "1.5px solid",
    borderRadius: 8,
    padding: "6px 14px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    flexShrink: 0,
    letterSpacing: 0.5,
    fontFamily: "inherit",
  },
  footer: {
    color: "#4a5068",
    fontSize: 12,
    textAlign: "center",
    paddingBottom: 8,
  },
  quizWrap: {
    background: "#13181f",
    border: "1px solid #1e2838",
    borderRadius: 16,
    padding: "32px 28px",
  },
  question: {
    fontSize: 17,
    lineHeight: 1.6,
    fontWeight: 600,
    marginBottom: 24,
    color: "#e8eaf0",
  },
  choice: {
    display: "flex",
    alignItems: "center",
    padding: "14px 16px",
    borderRadius: 10,
    fontSize: 14,
    color: "#cdd0dc",
    textAlign: "left",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
    lineHeight: 1.4,
  },
  explanation: {
    background: "#111520",
    border: "1px solid #1e2838",
    borderRadius: 10,
    padding: "14px 16px",
    fontSize: 13,
    color: "#b0b8cc",
    lineHeight: 1.6,
  },
  btn: {
    padding: "12px 24px",
    borderRadius: 10,
    border: "none",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "inherit",
    color: "#fff",
    letterSpacing: 0.3,
  },
};
