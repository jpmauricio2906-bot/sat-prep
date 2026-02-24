import { useState, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

// ─── SAT STRUCTURE ───────────────────────────────────────────────────────────
const TEST_LENGTHS = {
  full:    { label: "Full SAT",    total: 98, rw: 54, math: 44, time: "2h 14min" },
  half:    { label: "Half Length", total: 49, rw: 27, math: 22, time: "~67min"   },
  quarter: { label: "Quarter",     total: 25, rw: 14, math: 11, time: "~34min"   },
};
const DIFFICULTY_LEVELS = {
  easy:   { label: "Easy",   color: "#2ecc71", desc: "Build confidence with foundational questions" },
  medium: { label: "Medium", color: "#f7c44f", desc: "Core difficulty — closest to the real SAT"  },
  hard:   { label: "Hard",   color: "#e74c3c", desc: "Challenge yourself with advanced questions"  },
};
const SECTIONS = {
  math:    { label: "Math",               icon: "∑", color: "#4f8ef7", topics: ["Algebra","Geometry","Data Analysis","Advanced Math","Problem Solving"] },
  reading: { label: "Reading & Writing",  icon: "✦", color: "#f7914f", topics: ["Main Idea","Vocabulary in Context","Evidence","Grammar","Rhetorical Skills"] },
};

// ─── FIGURE COMPONENTS ───────────────────────────────────────────────────────

// 1. SVG FIGURES — geometry diagrams
function SVGFigure({ type, params }) {
  const W = 280, H = 200;
  const base = { background: "#0d1420", border: "1px solid #1e2838", borderRadius: 10, padding: 12, margin: "0 auto 20px", display: "block" };

  if (type === "right_triangle") {
    const { a = 3, b = 4, c = 5 } = params;
    return (
      <svg width={W} height={H} style={base}>
        <polygon points="40,160 200,160 200,40" fill="#0f2040" stroke="#4f8ef7" strokeWidth="2"/>
        <rect x="188" y="148" width="12" height="12" fill="none" stroke="#4f8ef7" strokeWidth="1.5"/>
        <text x="120" y="178" fill="#f7c44f" fontSize="14" textAnchor="middle">{a}</text>
        <text x="215" y="105" fill="#f7c44f" fontSize="14">{b}</text>
        <text x="105" y="90" fill="#2ecc71" fontSize="14">{c} ?</text>
        <text x="48" y="155" fill="#aaa" fontSize="11">A</text>
        <text x="204" y="155" fill="#aaa" fontSize="11">B</text>
        <text x="204" y="38" fill="#aaa" fontSize="11">C</text>
      </svg>
    );
  }

  if (type === "circle_arc") {
    const { radius = 12, angle = 60 } = params;
    const cx = W/2, cy = H/2, r = 70;
    const rad = (angle * Math.PI) / 180;
    const x2 = cx + r * Math.cos(-Math.PI/2 + rad);
    const y2 = cy + r * Math.sin(-Math.PI/2 + rad);
    return (
      <svg width={W} height={H} style={base}>
        <circle cx={cx} cy={cy} r={r} fill="#0f2040" stroke="#2a3a5a" strokeWidth="1.5"/>
        <line x1={cx} y1={cy} x2={cx} y2={cy - r} stroke="#4f8ef7" strokeWidth="2"/>
        <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="#4f8ef7" strokeWidth="2"/>
        <path d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${x2} ${y2}`} fill="none" stroke="#f7914f" strokeWidth="3"/>
        <text x={cx + 8} y={cy - r/2} fill="#f7c44f" fontSize="13">{radius}</text>
        <text x={cx + 20} y={cy - 10} fill="#aaa" fontSize="12">{angle}°</text>
        <text x={cx - 14} y={cy + 16} fill="#aaa" fontSize="11">O</text>
        <circle cx={cx} cy={cy} r="3" fill="#4f8ef7"/>
      </svg>
    );
  }

  if (type === "rectangle") {
    const { w = 8, h = 5 } = params;
    return (
      <svg width={W} height={H} style={base}>
        <rect x="50" y="50" width="180" height="110" fill="#0f2040" stroke="#4f8ef7" strokeWidth="2"/>
        <text x="140" y="118" fill="#f7c44f" fontSize="15" textAnchor="middle">{w}</text>
        <text x="22" y="110" fill="#f7c44f" fontSize="15" textAnchor="middle">{h}</text>
        <line x1="50" y1="170" x2="230" y2="170" stroke="#4f8ef7" strokeWidth="1" strokeDasharray="4"/>
        <line x1="230" y1="50" x2="230" y2="170" stroke="#4f8ef7" strokeWidth="1" strokeDasharray="4"/>
      </svg>
    );
  }

  if (type === "coordinate_plane") {
    const { points = [], lineEq } = params;
    return (
      <svg width={W} height={H} style={base}>
        {/* axes */}
        <line x1="20" y1="100" x2="260" y2="100" stroke="#2a3a5a" strokeWidth="1.5"/>
        <line x1="140" y1="10" x2="140" y2="190" stroke="#2a3a5a" strokeWidth="1.5"/>
        {/* grid */}
        {[-4,-3,-2,-1,1,2,3,4].map(i => (
          <g key={i}>
            <line x1={140+i*25} y1="10" x2={140+i*25} y2="190" stroke="#1a2535" strokeWidth="1"/>
            <line x1="20" y1={100+i*22} x2="260" y2={100+i*22} stroke="#1a2535" strokeWidth="1"/>
            <text x={140+i*25-3} y="112" fill="#4a5a7a" fontSize="9">{i}</text>
          </g>
        ))}
        {/* line if given */}
        {lineEq && (() => {
          const x1=-4, x2=4;
          const y1=lineEq(x1), y2=lineEq(x2);
          return <line x1={140+x1*25} y1={100-y1*22} x2={140+x2*25} y2={100-y2*22} stroke="#f7914f" strokeWidth="2.5"/>;
        })()}
        {/* points */}
        {points.map(([px,py],i) => (
          <circle key={i} cx={140+px*25} cy={100-py*22} r="5" fill="#4f8ef7" stroke="#0d1420" strokeWidth="2"/>
        ))}
        <text x="255" y="96" fill="#4a5a7a" fontSize="11">x</text>
        <text x="143" y="16" fill="#4a5a7a" fontSize="11">y</text>
      </svg>
    );
  }

  if (type === "cylinder") {
    return (
      <svg width={W} height={H} style={base}>
        <ellipse cx="140" cy="55" rx="60" ry="18" fill="#0f2040" stroke="#4f8ef7" strokeWidth="2"/>
        <rect x="80" y="55" width="120" height="100" fill="#0f2040" stroke="#4f8ef7" strokeWidth="0"/>
        <line x1="80" y1="55" x2="80" y2="155" stroke="#4f8ef7" strokeWidth="2"/>
        <line x1="200" y1="55" x2="200" y2="155" stroke="#4f8ef7" strokeWidth="2"/>
        <ellipse cx="140" cy="155" rx="60" ry="18" fill="#0a1828" stroke="#4f8ef7" strokeWidth="2"/>
        <text x="210" y="110" fill="#f7c44f" fontSize="13">h=10</text>
        <text x="140" y="48" fill="#f7c44f" fontSize="13" textAnchor="middle">r=3</text>
        <line x1="140" y1="55" x2="200" y2="55" stroke="#f7c44f" strokeWidth="1.5" strokeDasharray="4"/>
      </svg>
    );
  }

  return null;
}

// 2. RECHARTS FIGURES — data charts
function ChartFigure({ type, data, config = {} }) {
  const chartStyle = { background: "#0d1420", border: "1px solid #1e2838", borderRadius: 10, padding: "12px 4px 4px", marginBottom: 20 };
  const H = 200;

  if (type === "bar") {
    return (
      <div style={chartStyle}>
        <ResponsiveContainer width="100%" height={H}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2838"/>
            <XAxis dataKey={config.xKey || "name"} tick={{ fill: "#7a8298", fontSize: 11 }}/>
            <YAxis tick={{ fill: "#7a8298", fontSize: 11 }}/>
            <Tooltip contentStyle={{ background: "#13181f", border: "1px solid #2a3a5a", borderRadius: 8, color: "#e8eaf0" }}/>
            <Bar dataKey={config.yKey || "value"} fill="#4f8ef7" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
        {config.caption && <p style={{ textAlign: "center", color: "#7a8298", fontSize: 11, margin: "4px 0 8px" }}>{config.caption}</p>}
      </div>
    );
  }

  if (type === "line") {
    return (
      <div style={chartStyle}>
        <ResponsiveContainer width="100%" height={H}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2838"/>
            <XAxis dataKey={config.xKey || "x"} tick={{ fill: "#7a8298", fontSize: 11 }} label={{ value: config.xLabel, position: "insideBottom", offset: -2, fill: "#7a8298", fontSize: 11 }}/>
            <YAxis tick={{ fill: "#7a8298", fontSize: 11 }} label={{ value: config.yLabel, angle: -90, position: "insideLeft", fill: "#7a8298", fontSize: 11 }}/>
            <Tooltip contentStyle={{ background: "#13181f", border: "1px solid #2a3a5a", borderRadius: 8, color: "#e8eaf0" }}/>
            <Line type="monotone" dataKey={config.yKey || "y"} stroke="#f7914f" strokeWidth={2.5} dot={{ fill: "#f7914f", r: 4 }}/>
          </LineChart>
        </ResponsiveContainer>
        {config.caption && <p style={{ textAlign: "center", color: "#7a8298", fontSize: 11, margin: "4px 0 8px" }}>{config.caption}</p>}
      </div>
    );
  }

  if (type === "scatter") {
    return (
      <div style={chartStyle}>
        <ResponsiveContainer width="100%" height={H}>
          <ScatterChart margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2838"/>
            <XAxis dataKey="x" type="number" name={config.xLabel || "x"} tick={{ fill: "#7a8298", fontSize: 11 }} label={{ value: config.xLabel, position: "insideBottom", offset: -2, fill: "#7a8298", fontSize: 10 }}/>
            <YAxis dataKey="y" type="number" name={config.yLabel || "y"} tick={{ fill: "#7a8298", fontSize: 11 }}/>
            <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ background: "#13181f", border: "1px solid #2a3a5a", borderRadius: 8, color: "#e8eaf0" }}/>
            {config.trendLine && <ReferenceLine stroke="#2ecc71" strokeDasharray="6 3" segment={config.trendLine}/>}
            <Scatter data={data} fill="#4f8ef7"/>
          </ScatterChart>
        </ResponsiveContainer>
        {config.caption && <p style={{ textAlign: "center", color: "#7a8298", fontSize: 11, margin: "4px 0 8px" }}>{config.caption}</p>}
      </div>
    );
  }

  return null;
}

// 3. TABLE FIGURES — HTML data tables
function TableFigure({ headers, rows, caption }) {
  return (
    <div style={{ overflowX: "auto", marginBottom: 20 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, background: "#0d1420", borderRadius: 10, overflow: "hidden", border: "1px solid #1e2838" }}>
        {caption && <caption style={{ color: "#7a8298", fontSize: 11, marginBottom: 6, captionSide: "top", textAlign: "center", padding: "8px 0 4px" }}>{caption}</caption>}
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ padding: "10px 14px", background: "#0f1b35", color: "#7ab3f7", fontWeight: 700, fontSize: 12, textAlign: "center", borderBottom: "1px solid #1e2838" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#0d1420" : "#111828" }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "9px 14px", color: "#cdd0dc", textAlign: "center", borderBottom: "1px solid #161e2e", fontWeight: j === 0 ? 600 : 400 }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── FIGURE RENDERER — dispatches to the right component ─────────────────────
function Figure({ fig }) {
  if (!fig) return null;
  if (fig.type === "svg")   return <SVGFigure type={fig.shape} params={fig.params || {}} />;
  if (fig.type === "chart") return <ChartFigure type={fig.chartType} data={fig.data} config={fig.config || {}} />;
  if (fig.type === "table") return <TableFigure headers={fig.headers} rows={fig.rows} caption={fig.caption} />;
  return null;
}

// ─── QUESTION BANK ───────────────────────────────────────────────────────────
const QUESTION_BANK = {
  math: {
    Algebra: {
      easy: [
        { q: "If 3x + 7 = 22, what is x?", choices: ["3","5","7","9"], answer: 1, explanation: "3x = 15, so x = 5." },
        { q: "What is 2x when x = 6?", choices: ["8","10","12","14"], answer: 2, explanation: "2 × 6 = 12." },
        { q: "Solve: x − 4 = 10", choices: ["6","14","10","4"], answer: 1, explanation: "x = 10 + 4 = 14." },
        {
          q: "The graph below shows the line y = 2x − 1. What is the y-intercept?",
          fig: { type: "svg", shape: "coordinate_plane", params: { lineEq: x => 2*x - 1, points: [[0,-1]] } },
          choices: ["−2","−1","0","1"], answer: 1, explanation: "The y-intercept is where x=0: y = 2(0)−1 = −1.",
        },
      ],
      medium: [
        { q: "Which is equivalent to 2(x+3) − 4(x−1)?", choices: ["−2x+10","6x+2","−2x+2","2x+10"], answer: 0, explanation: "2x+6−4x+4 = −2x+10." },
        { q: "If y = 2x − 1 and y = x + 3, what is x?", choices: ["2","4","5","7"], answer: 1, explanation: "2x−1 = x+3 → x = 4." },
        { q: "Solve: 5x − 3 = 2x + 12", choices: ["3","5","7","9"], answer: 1, explanation: "3x = 15, x = 5." },
        {
          q: "The graph shows two lines. At which point do they intersect?",
          fig: { type: "svg", shape: "coordinate_plane", params: { lineEq: x => x + 1, points: [[2,3]] } },
          choices: ["(1,2)","(2,3)","(3,4)","(0,1)"], answer: 1, explanation: "The lines intersect at (2,3) where both equations are satisfied.",
        },
      ],
      hard: [
        { q: "If f(x) = 3x² − 2x + 1, what is f(−2)?", choices: ["9","17","13","21"], answer: 1, explanation: "3(4) − 2(−2) + 1 = 12+4+1 = 17." },
        { q: "For what value of k does kx² − 4x + 1 = 0 have exactly one solution?", choices: ["2","4","8","16"], answer: 1, explanation: "Discriminant = 0: 16 − 4k = 0, k = 4." },
      ],
    },
    Geometry: {
      easy: [
        {
          q: "What is the area of the rectangle shown below?",
          fig: { type: "svg", shape: "rectangle", params: { w: 8, h: 5 } },
          choices: ["26","40","13","45"], answer: 1, explanation: "Area = length × width = 8 × 5 = 40.",
        },
        { q: "What is the perimeter of a square with side 6?", choices: ["12","24","36","18"], answer: 1, explanation: "Perimeter = 4 × 6 = 24." },
      ],
      medium: [
        {
          q: "Using the triangle shown, what is the length of the hypotenuse?",
          fig: { type: "svg", shape: "right_triangle", params: { a: 3, b: 4, c: "?" } },
          choices: ["5","6","7","8"], answer: 0, explanation: "By the Pythagorean theorem: √(3²+4²) = √25 = 5.",
        },
        { q: "The radius of a circle is 6. What is the circumference? (π ≈ 3.14)", choices: ["18.84","37.68","113.04","28.26"], answer: 1, explanation: "C = 2πr = 2 × 3.14 × 6 = 37.68." },
      ],
      hard: [
        {
          q: "What is the volume of the cylinder shown below? (π ≈ 3.14)",
          fig: { type: "svg", shape: "cylinder", params: {} },
          choices: ["94.2","282.6","188.4","314"], answer: 1, explanation: "V = πr²h = 3.14 × 9 × 10 = 282.6.",
        },
        {
          q: "In the circle shown, the central angle is 60° and the radius is 12. What is the arc length? (π ≈ 3.14)",
          fig: { type: "svg", shape: "circle_arc", params: { radius: 12, angle: 60 } },
          choices: ["12.56","6.28","18.84","25.12"], answer: 0, explanation: "Arc = (60/360) × 2πr = (1/6) × 75.36 ≈ 12.56.",
        },
      ],
    },
    "Data Analysis": {
      easy: [
        {
          q: "According to the bar chart below, which month had the highest sales?",
          fig: {
            type: "chart", chartType: "bar",
            data: [{ name:"Jan",value:40 },{ name:"Feb",value:65 },{ name:"Mar",value:50 },{ name:"Apr",value:80 },{ name:"May",value:55 }],
            config: { xKey: "name", yKey: "value", caption: "Monthly Sales (units)" },
          },
          choices: ["January","February","March","April"], answer: 3, explanation: "April has the tallest bar at 80 units.",
        },
        { q: "In {4, 7, 7, 9, 13}, what is the median?", choices: ["7","8","9","6"], answer: 0, explanation: "Middle value = 7." },
        { q: "What is the mode of {2, 4, 4, 5, 7}?", choices: ["2","4","5","7"], answer: 1, explanation: "4 appears most often." },
      ],
      medium: [
        {
          q: "The table below shows student test scores. What is the mean score?",
          fig: {
            type: "table",
            headers: ["Student","Score"],
            rows: [["Alice","82"],["Bob","90"],["Carlos","74"],["Diana","94"],["Evan","80"]],
            caption: "Test Scores",
          },
          choices: ["82","84","86","88"], answer: 1, explanation: "(82+90+74+94+80)/5 = 420/5 = 84.",
        },
        {
          q: "The line graph shows a city's temperature over 6 months. Between which months did temperature rise the most?",
          fig: {
            type: "chart", chartType: "line",
            data: [{ x:"Jan",y:30 },{ x:"Feb",y:35 },{ x:"Mar",y:50 },{ x:"Apr",y:62 },{ x:"May",y:70 },{ x:"Jun",y:74 }],
            config: { xKey: "x", yKey: "y", xLabel: "Month", yLabel: "Temp (°F)", caption: "Average Monthly Temperature" },
          },
          choices: ["Jan–Feb","Feb–Mar","Mar–Apr","May–Jun"], answer: 1, explanation: "Feb to Mar shows a 15°F jump — the largest single-month increase.",
        },
        { q: "A student scored 80, 90, 70, 100 on four tests. What is the mean?", choices: ["82","84","85","90"], answer: 2, explanation: "(80+90+70+100)/4 = 85." },
      ],
      hard: [
        {
          q: "The scatterplot below shows hours studied vs. test scores. Which best describes the relationship?",
          fig: {
            type: "chart", chartType: "scatter",
            data: [{ x:1,y:55 },{ x:2,y:60 },{ x:3,y:65 },{ x:4,y:72 },{ x:5,y:78 },{ x:6,y:85 },{ x:7,y:88 },{ x:8,y:93 }],
            config: { xLabel: "Hours Studied", yLabel: "Score", caption: "Hours Studied vs. Test Score", trendLine: [{ x:1,y:52 },{ x:8,y:95 }] },
          },
          choices: ["Strong negative correlation","No correlation","Weak positive correlation","Strong positive correlation"], answer: 3,
          explanation: "As hours studied increase, scores consistently rise — this is a strong positive correlation.",
        },
        {
          q: "Based on the two-way table below, what fraction of female students prefer Math?",
          fig: {
            type: "table",
            headers: ["", "Math", "English", "Total"],
            rows: [["Male","18","12","30"],["Female","14","16","30"],["Total","32","28","60"]],
            caption: "Subject Preference by Gender",
          },
          choices: ["7/15","7/16","14/30","7/30"], answer: 0, explanation: "14 female students prefer Math out of 30 total females = 14/30 = 7/15.",
        },
        { q: "A scatterplot shows strong positive correlation. Which r-value is most likely?", choices: ["−0.9","0.1","0.85","−0.3"], answer: 2, explanation: "Strong positive → r close to +1." },
      ],
    },
    "Advanced Math": {
      easy: [
        { q: "What is x² when x = 5?", choices: ["10","15","25","30"], answer: 2, explanation: "5² = 25." },
      ],
      medium: [
        { q: "What are the roots of x² − 5x + 6 = 0?", choices: ["2 and 3","1 and 6","−2 and −3","0 and 5"], answer: 0, explanation: "(x−2)(x−3) = 0." },
        { q: "Simplify: (x² − 9) / (x − 3)", choices: ["x+3","x−3","x+9","x²"], answer: 0, explanation: "(x−3)(x+3)/(x−3) = x+3." },
        {
          q: "The graph below shows a parabola. What are the x-intercepts (roots)?",
          fig: { type: "svg", shape: "coordinate_plane", params: { lineEq: x => -(x-1)*(x+3)/3, points: [[1,0],[-3,0]] } },
          choices: ["x=1 and x=−3","x=−1 and x=3","x=0 and x=2","x=1 and x=3"], answer: 0,
          explanation: "The parabola crosses the x-axis at x=1 and x=−3.",
        },
      ],
      hard: [
        { q: "If g(x) = x³ − 4x, for which values of x does g(x) = 0?", choices: ["0, 2, −2","0, 4","1, −1","2, −2"], answer: 0, explanation: "x(x²−4) = x(x−2)(x+2); roots are 0, 2, −2." },
        { q: "Which expression is equivalent to (2x + 3)²?", choices: ["4x²+9","4x²+6x+9","4x²+12x+9","2x²+12x+9"], answer: 2, explanation: "(2x)²+2(2x)(3)+3² = 4x²+12x+9." },
      ],
    },
    "Problem Solving": {
      easy: [
        { q: "A car travels 150 miles in 3 hours. What is its average speed?", choices: ["40 mph","45 mph","50 mph","55 mph"], answer: 2, explanation: "150/3 = 50 mph." },
        { q: "If apples cost $0.50 each, how much do 8 apples cost?", choices: ["$3.00","$3.50","$4.00","$4.50"], answer: 2, explanation: "8 × $0.50 = $4.00." },
      ],
      medium: [
        {
          q: "The table shows prices at a store. If Maria buys 2 shirts and 1 pair of pants, how much does she spend?",
          fig: {
            type: "table",
            headers: ["Item","Price"],
            rows: [["Shirt","$25"],["Pants","$45"],["Shoes","$60"],["Hat","$15"]],
            caption: "Store Price List",
          },
          choices: ["$70","$85","$95","$100"], answer: 2, explanation: "2 shirts ($50) + 1 pants ($45) = $95.",
        },
        { q: "A store discounts an item 20%. If original price is $80, what is the sale price?", choices: ["$60","$64","$68","$72"], answer: 1, explanation: "$80 × 0.80 = $64." },
        { q: "A tank fills at 5 gal/min and drains at 2 gal/min. Time to fill 30 gallons net?", choices: ["5 min","8 min","10 min","15 min"], answer: 2, explanation: "Net rate = 3 gal/min; 30/3 = 10 min." },
      ],
      hard: [
        {
          q: "The bar chart shows production at a factory over 4 quarters. In which quarter did production DECREASE compared to the previous quarter?",
          fig: {
            type: "chart", chartType: "bar",
            data: [{ name:"Q1",value:120 },{ name:"Q2",value:145 },{ name:"Q3",value:130 },{ name:"Q4",value:160 }],
            config: { xKey: "name", yKey: "value", caption: "Quarterly Production (units)" },
          },
          choices: ["Q1","Q2","Q3","Q4"], answer: 2, explanation: "Q3 (130) is lower than Q2 (145) — the only decrease.",
        },
        { q: "If x varies inversely with y, and x=4 when y=9, what is x when y=6?", choices: ["3","6","8","12"], answer: 1, explanation: "xy = 36 → x = 36/6 = 6." },
        { q: "Working together, A and B finish a job in 4 hours. A alone takes 6 hours. How long does B take alone?", choices: ["8h","10h","12h","14h"], answer: 2, explanation: "1/4 = 1/6 + 1/B → B = 12 hrs." },
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
        { q: "An author discusses both advantages and disadvantages of remote work. The passage is primarily…", choices: ["persuasive — arguing for remote work","analytical — examining multiple perspectives","narrative — a personal story","descriptive — portraying a scene"], answer: 1, explanation: "Presenting pros and cons = analytical/balanced." },
        {
          q: "The table below shows survey results on reading habits. What is the most supported conclusion?",
          fig: {
            type: "table",
            headers: ["Age Group","Books/Year (avg)","Prefer Digital","Prefer Print"],
            rows: [["13–17","8","62%","38%"],["18–25","6","70%","30%"],["26–40","9","45%","55%"],["41+","12","28%","72%"]],
            caption: "Reading Habits Survey (n=1,200)",
          },
          choices: [
            "Older readers read fewer books per year",
            "Digital reading is preferred by all age groups",
            "Older readers tend to prefer print and read more books",
            "Teenagers read the most books per year",
          ], answer: 2, explanation: "The 41+ group reads 12 books/year (highest) and 72% prefer print — supporting this conclusion.",
        },
      ],
      hard: [
        { q: "A passage opens with a personal anecdote, then shifts to cite three studies on climate change. This structure primarily serves to…", choices: ["entertain before educating","establish emotional connection then build credibility","refute the opening claim","summarize existing research"], answer: 1, explanation: "Anecdote = emotional hook; studies = credibility." },
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
        { q: "'The new policy was seen as draconian.' 'Draconian' most nearly means:", choices: ["generous","excessively harsh","widely popular","poorly explained"], answer: 1, explanation: "Draconian = extremely severe." },
        { q: "'Her equanimity during the crisis impressed everyone.' 'Equanimity' means:", choices: ["panic","indifference","mental calmness","confusion"], answer: 2, explanation: "Equanimity = calm composure under pressure." },
      ],
    },
    Evidence: {
      easy: [
        { q: "An author claims 'most teens prefer streaming to cable.' Which best supports this?", choices: ["A quote from one teen","A survey of 5,000 teens","A cable company press release","A parent's anecdote"], answer: 1, explanation: "Large representative survey = strongest evidence." },
      ],
      medium: [
        { q: "A researcher wants to prove Exercise X reduces stress. Which study design is strongest?", choices: ["Interviewing 5 people","Observing one gym class","Randomized controlled trial with 200 participants","Reading articles about exercise"], answer: 2, explanation: "Randomized controlled trials are the gold standard." },
        {
          q: "A student argues screen time harms academic performance. Which data from the table best supports this claim?",
          fig: {
            type: "table",
            headers: ["Daily Screen Time","Avg GPA","Hours of Sleep"],
            rows: [["< 1 hour","3.7","8.2"],["1–2 hours","3.4","7.8"],["2–4 hours","3.1","7.2"],["4+ hours","2.7","6.5"]],
            caption: "Screen Time and Academic Performance Study",
          },
          choices: [
            "Students with 4+ hours have 6.5 hours of sleep",
            "Students with less than 1 hour of screen time have a 3.7 GPA",
            "As screen time increases, GPA consistently decreases",
            "Screen time affects sleep more than GPA",
          ], answer: 2, explanation: "GPA drops from 3.7 to 2.7 as screen time increases — a consistent downward trend directly supporting the claim.",
        },
        { q: "Which statement weakens the claim 'social media increases teen anxiety'?", choices: ["More screen time correlates with anxiety","Teens report feeling stressed by social media","Non-users show no significant anxiety difference","Anxiety rates rose as social media grew"], answer: 2, explanation: "If non-users show similar anxiety, social media may not be the cause." },
      ],
      hard: [
        { q: "An author argues a new drug is effective. A critic notes the study was funded by the manufacturer. This critique questions the study's:", choices: ["sample size","statistical methods","objectivity/bias","peer review status"], answer: 2, explanation: "Funding source = conflict of interest = bias concern." },
      ],
    },
    Grammar: {
      easy: [
        { q: "Which sentence is grammatically correct?", choices: ["Each of the students have a textbook.","Each of the students has a textbook.","Each students has a textbook.","Each of student have a textbook."], answer: 1, explanation: "'Each' is singular → 'has'." },
        { q: "Choose the correct sentence:", choices: ["Him and I went to the store.","He and I went to the store.","Him and me went.","He and me went."], answer: 1, explanation: "Subject pronouns: He and I." },
      ],
      medium: [
        { q: "Which uses the semicolon correctly?", choices: ["I like cats; and dogs.","She studied hard; she passed.","He ran fast; but lost.","They won; the game."], answer: 1, explanation: "Semicolons join two independent clauses." },
        { q: "Choose: 'The team ___ playing well.'", choices: ["is","are","were","have been"], answer: 0, explanation: "In American English, collective nouns take singular verbs." },
      ],
      hard: [
        { q: "Which sentence avoids a dangling modifier?", choices: ["Running down the street, the rain soaked her.","Running down the street, she got soaked.","Having run, the rain was heavy.","To run, the rain started."], answer: 1, explanation: "'Running' must refer to the subject 'she'." },
        { q: "Identify the correct apostrophe use:", choices: ["The dogs' bone was buried.","The dog's' bone.","The dogs bone.","The dogs's bone."], answer: 0, explanation: "Plural possessive: dogs' (bone belonging to multiple dogs)." },
      ],
    },
    "Rhetorical Skills": {
      easy: [
        { q: "An author ends an essay urging readers to vote. This is primarily meant to:", choices: ["entertain","inform about history","persuade readers to act","describe a process"], answer: 2, explanation: "Call to action = persuasive device." },
      ],
      medium: [
        { q: "'Can we really afford to ignore climate change?' This rhetorical question is meant to:", choices: ["request information","admit uncertainty","prompt the reader to agree","introduce a counterargument"], answer: 2, explanation: "Rhetorical questions guide the reader to a conclusion." },
        {
          q: "The graph shows public support for two policies over time. Which rhetorical claim is best supported by the data?",
          fig: {
            type: "chart", chartType: "line",
            data: [{ x:"2018",y:42,b:55 },{ x:"2019",y:47,b:52 },{ x:"2020",y:53,b:49 },{ x:"2021",y:58,b:45 },{ x:"2022",y:64,b:40 }],
            config: { xKey: "x", yKey: "y", xLabel: "Year", yLabel: "Support (%)", caption: "Public Support: Policy A (blue) over time" },
          },
          choices: [
            "Support for both policies has remained stable",
            "Policy A has steadily gained public support since 2018",
            "Policy A lost support after 2020",
            "Both policies are equally popular",
          ], answer: 1, explanation: "Policy A rose from 42% to 64% — a consistent upward trend.",
        },
        { q: "An author writes: 'Like a ship without a compass, the company drifted.' This is:", choices: ["alliteration","a simile","hyperbole","personification"], answer: 1, explanation: "'Like a ship' = simile." },
      ],
      hard: [
        { q: "An author refutes a counterargument before presenting their thesis. This is called:", choices: ["anaphora","concession and rebuttal","appeal to authority","circular reasoning"], answer: 1, explanation: "Acknowledging then refuting the opposing view = concession and rebuttal." },
        { q: "Repeating a phrase at the start of consecutive sentences is:", choices: ["creates ambiguity","anaphora — building emphasis and rhythm","an ad hominem attack","weakens the argument"], answer: 1, explanation: "Anaphora = repetition at the start of clauses for emphasis." },
      ],
    },
  },
};

// ─── STORAGE ─────────────────────────────────────────────────────────────────
function loadProgress() {
  try {
    const s = localStorage.getItem("sat_progress_v3");
    if (s) return JSON.parse(s);
  } catch {}
  const init = {};
  Object.keys(SECTIONS).forEach(sec => {
    init[sec] = {};
    SECTIONS[sec].topics.forEach(t => {
      init[sec][t] = { easy:{c:0,t:0}, medium:{c:0,t:0}, hard:{c:0,t:0} };
    });
  });
  return init;
}
function saveProgress(p) { try { localStorage.setItem("sat_progress_v3", JSON.stringify(p)); } catch {} }
function pct(c,t) { return t===0 ? 0 : Math.round((c/t)*100); }

function getQuestionsForPracticeTest(length, difficulty) {
  const config = TEST_LENGTHS[length];
  let allQ = [];
  [{ key:"math", count:config.math }, { key:"reading", count:config.rw }].forEach(({ key, count }) => {
    let pool = [];
    SECTIONS[key].topics.forEach(topic => {
      const qs = QUESTION_BANK[key][topic]?.[difficulty] ?? [];
      pool.push(...qs.map(q => ({ ...q, section:key, topic })));
    });
    pool = pool.sort(() => Math.random()-0.5);
    allQ.push(...pool.slice(0, count));
  });
  return allQ.sort(() => Math.random()-0.5);
}

// ─── RADIAL PROGRESS ─────────────────────────────────────────────────────────
function RadialProgress({ value, size=80, stroke=7, color="#4f8ef7" }) {
  const r=(size-stroke)/2, circ=2*Math.PI*r, offset=circ-(value/100)*circ;
  return (
    <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e2130" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition:"stroke-dashoffset 0.6s ease" }}/>
    </svg>
  );
}

// ─── PRACTICE TEST SELECTOR ───────────────────────────────────────────────────
function PracticeTestPage({ onStart, onBack }) {
  const [selectedLength, setSelectedLength] = useState("half");
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
  const config = TEST_LENGTHS[selectedLength];
  const diff = DIFFICULTY_LEVELS[selectedDifficulty];
  return (
    <div style={S.page}>
      <button onClick={onBack} style={S.backBtn}>← Dashboard</button>
      <div style={S.pageHeader}>
        <div style={S.heroLabel}>PRACTICE TEST</div>
        <h1 style={S.heroTitle}>Configure Your Session</h1>
        <p style={S.heroSub}>The real Digital SAT has <strong style={{color:"#4f8ef7"}}>98 questions</strong> — 54 R&W + 44 Math</p>
      </div>
      <div style={S.sectionCard}>
        <div style={S.cardLabel}>📏 Test Length</div>
        <div style={S.optionGrid}>
          {Object.entries(TEST_LENGTHS).map(([key,val]) => (
            <button key={key} onClick={() => setSelectedLength(key)} style={{ ...S.optionCard, borderColor: selectedLength===key ? "#4f8ef7":"#2a2f42", background: selectedLength===key ? "#0f1b35":"#13181f" }}>
              <div style={{ fontSize:22, marginBottom:6 }}>{key==="full"?"📋":key==="half"?"📄":"📝"}</div>
              <div style={{ fontWeight:800, fontSize:15, color: selectedLength===key ? "#4f8ef7":"#e8eaf0" }}>{val.label}</div>
              <div style={{ color:"#7a8298", fontSize:12, marginTop:4 }}>{val.total} questions</div>
              <div style={S.pill}>{val.time}</div>
              <div style={{ color:"#5a6282", fontSize:11, marginTop:6 }}>{val.rw} R&W · {val.math} Math</div>
            </button>
          ))}
        </div>
      </div>
      <div style={S.sectionCard}>
        <div style={S.cardLabel}>🎯 Difficulty Level</div>
        <p style={{ color:"#7a8298", fontSize:13, marginBottom:16, marginTop:-8 }}>The real SAT mixes all difficulty levels — focus on one tier to build targeted skills.</p>
        <div style={S.optionGrid}>
          {Object.entries(DIFFICULTY_LEVELS).map(([key,val]) => (
            <button key={key} onClick={() => setSelectedDifficulty(key)} style={{ ...S.optionCard, borderColor: selectedDifficulty===key ? val.color:"#2a2f42", background: selectedDifficulty===key ? `${val.color}15`:"#13181f" }}>
              <div style={{ fontSize:22, marginBottom:6 }}>{key==="easy"?"🟢":key==="medium"?"🟡":"🔴"}</div>
              <div style={{ fontWeight:800, fontSize:15, color: selectedDifficulty===key ? val.color:"#e8eaf0" }}>{val.label}</div>
              <div style={{ color:"#7a8298", fontSize:12, marginTop:6, lineHeight:1.4 }}>{val.desc}</div>
            </button>
          ))}
        </div>
      </div>
      <div style={S.summaryCard}>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:800, fontSize:17, marginBottom:6 }}>Your Session</div>
          <div style={{ color:"#aaa", fontSize:14 }}>
            <span style={{ color:"#4f8ef7", fontWeight:700 }}>{config.total} questions</span>{" · "}
            <span style={{ color:diff.color, fontWeight:700 }}>{diff.label}</span>{" difficulty · ~"}{config.time}
          </div>
          <div style={{ color:"#5a6282", fontSize:12, marginTop:4 }}>{config.rw} Reading & Writing · {config.math} Math</div>
        </div>
        <button onClick={() => onStart(selectedLength, selectedDifficulty)} style={S.startBtn}>Start Test →</button>
      </div>
    </div>
  );
}

// ─── QUIZ VIEW ────────────────────────────────────────────────────────────────
function QuizView({ questions, onDone }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExp, setShowExp] = useState(false);
  const [results, setResults] = useState([]);

  if (!questions || questions.length === 0) {
    return <div style={S.card}><p style={{ color:"#aaa" }}>No questions available.</p><button style={S.btn} onClick={() => onDone([])}>Back</button></div>;
  }

  const q = questions[idx];
  const isLast = idx === questions.length - 1;
  const progress = ((idx+1)/questions.length)*100;
  const sectionColor = SECTIONS[q.section]?.color ?? "#4f8ef7";

  function choose(i) {
    if (selected !== null) return;
    setSelected(i);
    setShowExp(true);
    setResults(r => [...r, { section:q.section, topic:q.topic, correct: i===q.answer }]);
  }
  function next() {
    const newResults = [...results, { section:q.section, topic:q.topic, correct: selected===q.answer }];
    if (isLast) { onDone(newResults); }
    else { setIdx(i => i+1); setSelected(null); setShowExp(false); }
  }

  return (
    <div style={S.quizWrap}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <span style={{ color:"#aaa", fontSize:12 }}>{SECTIONS[q.section]?.label} › {q.topic}</span>
        <span style={{ color:sectionColor, fontWeight:700, fontSize:13 }}>{idx+1} / {questions.length}</span>
      </div>
      <div style={{ height:4, background:"#1e2130", borderRadius:4, marginBottom:28 }}>
        <div style={{ height:4, width:`${progress}%`, background:sectionColor, borderRadius:4, transition:"width 0.4s ease" }}/>
      </div>

      {/* Figure rendered above the question */}
      {q.fig && <Figure fig={q.fig} />}

      <p style={S.question}>{q.q}</p>
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
        {q.choices.map((c,i) => {
          let bg="#1a1f2e", border="#2a2f42";
          if (selected !== null) {
            if (i===q.answer) { bg="#162d1e"; border="#2ecc71"; }
            else if (i===selected) { bg="#2d1616"; border="#e74c3c"; }
          }
          return (
            <button key={i} onClick={() => choose(i)} style={{ ...S.choice, background:bg, border:`1.5px solid ${border}`, cursor: selected!==null?"default":"pointer" }}>
              <span style={{ color:sectionColor, fontWeight:700, marginRight:12, fontSize:13 }}>{String.fromCharCode(65+i)}</span>
              {c}
            </button>
          );
        })}
      </div>
      {showExp && (
        <div style={S.explanation}>
          <span style={{ color: selected===q.answer ? "#2ecc71":"#e74c3c", fontWeight:700, marginRight:8 }}>
            {selected===q.answer ? "✓ Correct!" : "✗ Incorrect"}
          </span>
          {q.explanation}
        </div>
      )}
      {selected !== null && (
        <button style={{ ...S.btn, background:sectionColor, marginTop:16 }} onClick={next}>
          {isLast ? "Finish Test →" : "Next Question →"}
        </button>
      )}
    </div>
  );
}

// ─── RESULTS VIEW ─────────────────────────────────────────────────────────────
function ResultsView({ results, length, difficulty, onBack, onRetry }) {
  const correct = results.filter(r => r.correct).length;
  const total = results.length;
  const p = pct(correct, total);
  const diff = DIFFICULTY_LEVELS[difficulty];
  const grade = p>=80 ? "Excellent!" : p>=60 ? "Good work!" : "Keep practicing!";
  const ringColor = p>=75 ? "#2ecc71" : p>=50 ? "#f7c44f" : "#e74c3c";

  const topicBreakdown = {};
  results.forEach(({ section, topic, correct:c }) => {
    const key=`${section}::${topic}`;
    if (!topicBreakdown[key]) topicBreakdown[key] = { section, topic, correct:0, total:0 };
    topicBreakdown[key].total++;
    if (c) topicBreakdown[key].correct++;
  });

  return (
    <div style={S.page}>
      <div style={{ textAlign:"center", marginBottom:32 }}>
        <div style={{ position:"relative", display:"inline-flex", marginBottom:16 }}>
          <RadialProgress value={p} size={130} stroke={10} color={ringColor}/>
          <div style={S.radialLabel}><div style={{ fontSize:28, fontWeight:800, color:"#fff" }}>{p}%</div></div>
        </div>
        <h2 style={{ fontSize:26, fontWeight:800, marginBottom:8 }}>{grade}</h2>
        <p style={{ color:"#aaa" }}>{TEST_LENGTHS[length].label} · <span style={{ color:diff.color }}>{diff.label}</span> difficulty</p>
        <p style={{ color:"#ccc", fontSize:18, fontWeight:700, marginTop:8 }}>{correct} / {total} correct</p>
      </div>
      <div style={S.sectionCard}>
        <div style={S.cardLabel}>📊 Performance by Topic</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {Object.values(topicBreakdown).map(({ section, topic, correct:c, total:t }) => {
            const tp=pct(c,t);
            const bc = tp>=75?"#2ecc71":tp>=50?"#f7c44f":"#e74c3c";
            return (
              <div key={`${section}${topic}`} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:160, flexShrink:0 }}>
                  <div style={{ fontSize:13, fontWeight:600 }}>{topic}</div>
                  <div style={{ fontSize:11, color:"#7a8298" }}>{SECTIONS[section].label}</div>
                </div>
                <div style={S.barTrack}><div style={{ ...S.barFill, width:`${tp}%`, background:bc }}/></div>
                <span style={{ color:bc, fontWeight:700, fontSize:13, minWidth:40 }}>{tp}%</span>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginTop:8 }}>
        <button style={{ ...S.btn, background:"#4f8ef7" }} onClick={onRetry}>Try Again</button>
        <button style={{ ...S.btn, background:"#1e2130", border:"1.5px solid #2a2f42" }} onClick={onBack}>Dashboard</button>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ progress, onStartTopic, onPracticeTest }) {
  const allStats = Object.values(progress).flatMap(sec => Object.values(sec).flatMap(t => Object.values(t)));
  const totalC = allStats.reduce((a,s) => a+s.c, 0);
  const totalT = allStats.reduce((a,s) => a+s.t, 0);
  const overallPct = pct(totalC, totalT);
  const weakTopics = [];
  Object.keys(SECTIONS).forEach(sec => {
    SECTIONS[sec].topics.forEach(topic => {
      const s = progress[sec]?.[topic]; if (!s) return;
      const vals = Object.values(s);
      const tot=vals.reduce((a,x)=>a+x.t,0), cor=vals.reduce((a,x)=>a+x.c,0);
      if (tot>0 && pct(cor,tot)<60) weakTopics.push(topic);
    });
  });

  return (
    <div style={S.dashWrap}>
      <div style={S.hero}>
        <div style={S.heroLeft}>
          <div style={S.heroLabel}>SAT PREP</div>
          <h1 style={S.heroTitle}>Study Dashboard</h1>
          <p style={S.heroSub}>Track progress · Identify gaps · Ace the test</p>
          <button onClick={onPracticeTest} style={S.practiceTestBtn}>📋 Take a Practice Test</button>
        </div>
        <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <RadialProgress value={overallPct} size={110} stroke={9} color="#4f8ef7"/>
          <div style={S.radialLabel}>
            <div style={{ fontSize:22, fontWeight:800, color:"#fff" }}>{overallPct}%</div>
            <div style={{ fontSize:10, color:"#aaa" }}>Overall</div>
          </div>
        </div>
      </div>

      {weakTopics.length > 0 && (
        <div style={S.alertBox}>
          <span style={{ fontSize:16, marginRight:10 }}>⚠</span>
          <div>
            <div style={{ fontWeight:700, marginBottom:4, color:"#f7c44f" }}>Areas needing attention</div>
            <div style={{ color:"#ccc", fontSize:13 }}>{weakTopics.join(" · ")}</div>
          </div>
        </div>
      )}

      {Object.entries(SECTIONS).map(([secKey, sec]) => (
        <div key={secKey} style={S.sectionCard}>
          <div style={S.sectionHeader}>
            <span style={{ fontSize:22, marginRight:10 }}>{sec.icon}</span>
            <span style={{ fontWeight:700, fontSize:17 }}>{sec.label}</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {sec.topics.map(topic => {
              const s = progress[secKey]?.[topic] ?? { easy:{c:0,t:0}, medium:{c:0,t:0}, hard:{c:0,t:0} };
              const totals = Object.values(s).reduce((a,x) => ({ c:a.c+x.c, t:a.t+x.t }), { c:0, t:0 });
              const tp=pct(totals.c, totals.t);
              const bc = tp>=75?"#2ecc71":tp>=50?"#f7c44f":tp>0?"#e74c3c":"#2a2f42";
              return (
                <div key={topic}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                    <div style={{ width:180, flexShrink:0 }}>
                      <div style={{ fontWeight:600, fontSize:14 }}>{topic}</div>
                      <div style={{ color:"#aaa", fontSize:12 }}>{totals.t===0?"Not started":`${totals.c}/${totals.t} (${tp}%)`}</div>
                    </div>
                    <div style={{ ...S.barTrack, flex:1 }}><div style={{ ...S.barFill, width:`${tp}%`, background:bc }}/></div>
                  </div>
                  <div style={{ display:"flex", gap:8, marginTop:8, marginLeft:192, flexWrap:"wrap" }}>
                    {Object.entries(DIFFICULTY_LEVELS).map(([diff, dv]) => {
                      const ds=s[diff]??{c:0,t:0};
                      return (
                        <button key={diff} onClick={() => onStartTopic(secKey, topic, diff)}
                          style={{ ...S.diffBtn, borderColor:dv.color, color:dv.color }}>
                          {dv.label}{ds.t>0?` (${pct(ds.c,ds.t)}%)`:""}
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
      <div style={S.footer}>Questions answered: {totalT} · Correct: {totalC}</div>
    </div>
  );
}

// ─── TOPIC QUIZ ───────────────────────────────────────────────────────────────
function TopicQuizView({ section, topic, difficulty, onDone }) {
  const pool = (QUESTION_BANK[section]?.[topic]?.[difficulty] ?? []).sort(() => Math.random()-0.5);
  const questions = pool.map(q => ({ ...q, section, topic }));
  return <QuizView questions={questions} onDone={onDone} />;
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [view, setView] = useState("dashboard");
  const [active, setActive] = useState({});
  const [lastResults, setLastResults] = useState(null);

  useEffect(() => saveProgress(progress), [progress]);

  function updateProgress(results) {
    setProgress(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      results.forEach(({ section, topic, correct }) => {
        if (!next[section]?.[topic]) return;
        const diff = active.difficulty ?? "medium";
        if (!next[section][topic][diff]) next[section][topic][diff] = { c:0, t:0 };
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
    <div style={S.root}>
      <div style={S.container}>
        {view==="dashboard" && (
          <>
            <Dashboard progress={progress}
              onStartTopic={(sec,topic,diff) => { setActive({ section:sec, topic, difficulty:diff, mode:"topic" }); setView("quiz"); }}
              onPracticeTest={() => setView("practiceTest")}/>
            <button style={{ ...S.btn, background:"transparent", border:"1px solid #222", color:"#444", margin:"0 auto", display:"block", fontSize:12, marginTop:8 }}
              onClick={() => { if(confirm("Reset all progress?")) { setProgress(loadProgress()); localStorage.removeItem("sat_progress_v3"); }}}>
              Reset All Progress
            </button>
          </>
        )}
        {view==="practiceTest" && (
          <PracticeTestPage onBack={() => setView("dashboard")}
            onStart={(length, difficulty) => {
              const qs = getQuestionsForPracticeTest(length, difficulty);
              setActive({ mode:"practice", length, difficulty, questions:qs });
              setView("quiz");
            }}/>
        )}
        {view==="quiz" && active.mode==="topic" && (
          <TopicQuizView section={active.section} topic={active.topic} difficulty={active.difficulty} onDone={finishQuiz}/>
        )}
        {view==="quiz" && active.mode==="practice" && (
          <QuizView questions={active.questions} onDone={finishQuiz}/>
        )}
        {view==="results" && lastResults && (
          <ResultsView results={lastResults} length={active.length??"quarter"} difficulty={active.difficulty??"medium"}
            onBack={() => setView("dashboard")}
            onRetry={() => {
              if (active.mode==="practice") {
                const qs = getQuestionsForPracticeTest(active.length, active.difficulty);
                setActive({ ...active, questions:qs });
              }
              setView("quiz");
            }}/>
        )}
      </div>
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  root: { minHeight:"100vh", background:"#0d1117", color:"#e8eaf0", fontFamily:"'DM Sans', system-ui, sans-serif", padding:"24px 16px 48px" },
  container: { maxWidth:700, margin:"0 auto" },
  card: { background:"#13181f", border:"1px solid #1e2838", borderRadius:16, padding:"32px 28px" },
  dashWrap: { display:"flex", flexDirection:"column", gap:20 },
  page: { display:"flex", flexDirection:"column", gap:20 },
  pageHeader: { background:"linear-gradient(135deg, #0f1b35 0%, #13181f 100%)", border:"1px solid #1e2838", borderRadius:20, padding:"28px" },
  hero: { background:"linear-gradient(135deg, #0f1b35 0%, #13181f 100%)", border:"1px solid #1e2838", borderRadius:20, padding:"32px 28px", display:"flex", justifyContent:"space-between", alignItems:"center" },
  heroLeft: { flex:1 },
  heroLabel: { fontSize:11, fontWeight:700, letterSpacing:3, color:"#4f8ef7", marginBottom:8 },
  heroTitle: { fontSize:28, fontWeight:800, margin:"0 0 8px", lineHeight:1.1 },
  heroSub: { color:"#7a8298", fontSize:13, margin:"0 0 16px" },
  radialLabel: { position:"absolute", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" },
  practiceTestBtn: { background:"linear-gradient(135deg, #1a3a6e, #0f2347)", border:"1.5px solid #4f8ef7", borderRadius:10, padding:"10px 18px", color:"#7ab3f7", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" },
  alertBox: { background:"#1a1700", border:"1px solid #3d3000", borderRadius:12, padding:"14px 18px", display:"flex", alignItems:"flex-start" },
  sectionCard: { background:"#13181f", border:"1px solid #1e2838", borderRadius:16, padding:"24px 22px" },
  sectionHeader: { display:"flex", alignItems:"center", marginBottom:18, fontSize:15 },
  cardLabel: { fontWeight:700, fontSize:14, color:"#7a8298", letterSpacing:1, textTransform:"uppercase", marginBottom:16 },
  optionGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))", gap:12 },
  optionCard: { borderRadius:14, border:"2px solid", padding:"20px 14px", cursor:"pointer", textAlign:"center", fontFamily:"inherit", transition:"all 0.2s" },
  pill: { display:"inline-block", background:"#1e2838", borderRadius:20, padding:"3px 10px", fontSize:11, color:"#7ab3f7", marginTop:8 },
  summaryCard: { background:"#13181f", border:"1.5px solid #1e2838", borderRadius:16, padding:"20px 24px", display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" },
  startBtn: { background:"linear-gradient(135deg, #2563eb, #1a3a6e)", border:"none", borderRadius:12, padding:"14px 28px", color:"#fff", fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:"inherit", flexShrink:0 },
  barTrack: { height:6, background:"#1e2130", borderRadius:4, overflow:"hidden", minWidth:60 },
  barFill: { height:"100%", borderRadius:4, transition:"width 0.5s ease" },
  diffBtn: { background:"transparent", border:"1.5px solid", borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" },
  quizWrap: { background:"#13181f", border:"1px solid #1e2838", borderRadius:16, padding:"32px 28px" },
  question: { fontSize:17, lineHeight:1.6, fontWeight:600, marginBottom:24, color:"#e8eaf0" },
  choice: { display:"flex", alignItems:"center", padding:"14px 16px", borderRadius:10, fontSize:14, color:"#cdd0dc", textAlign:"left", fontFamily:"inherit", lineHeight:1.4 },
  explanation: { background:"#111520", border:"1px solid #1e2838", borderRadius:10, padding:"14px 16px", fontSize:13, color:"#b0b8cc", lineHeight:1.6 },
  btn: { padding:"12px 24px", borderRadius:10, border:"none", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit", color:"#fff", letterSpacing:0.3 },
  backBtn: { background:"transparent", border:"none", color:"#4f8ef7", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit", padding:"0 0 4px", alignSelf:"flex-start" },
  footer: { color:"#4a5068", fontSize:12, textAlign:"center", paddingBottom:8 },
};
