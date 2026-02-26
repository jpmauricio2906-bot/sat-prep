import { useState, useEffect, useRef, createContext, useContext } from "react";
import {
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";
import QUESTIONS from "./data/questions.json";

// ─── THEMES ──────────────────────────────────────────────────────────────────
const THEMES = {
  midnight: {
    name:"Midnight", emoji:"🌙", description:"Deep dark blue (default)",
    bg:"#0d1117", bgCard:"#13181f", bgHero:"linear-gradient(135deg,#0f1b35 0%,#13181f 100%)",
    bgInput:"#1a1f2e", bgTable:"#0d1420", bgTableHd:"#0f1b35", bgAlt:"#111828", bgAlert:"#1a1700",
    border:"#1e2838", borderAlert:"#3d3000", borderGrid:"#1a2535",
    text:"#e8eaf0", textSub:"#7a8298", textMuted:"#4a5068", textChoice:"#cdd0dc", textExpl:"#b0b8cc",
    accent1:"#4f8ef7", accent2:"#f7914f", accent1Soft:"#7ab3f7",
    accent1Bg:"linear-gradient(135deg,#1a3a6e,#0f2347)", startBtn:"linear-gradient(135deg,#2563eb,#1a3a6e)",
    correct:"#2ecc71", incorrect:"#e74c3c", correctBg:"#162d1e", incorrectBg:"#2d1616",
    correctBdr:"#2ecc71", incorrectBdr:"#e74c3c",
    chartGrid:"#1e2838", chartTick:"#7a8298", chartTooltipBg:"#13181f",
    chartBar:"#4f8ef7", chartLine:"#f7914f", chartDot:"#f7914f", chartScatter:"#4f8ef7", chartTrend:"#2ecc71",
    svgBg:"#0d1420", svgFill:"#0f2040", svgStroke:"#4f8ef7", svgLabel:"#f7c44f",
    svgMuted:"#aaa", svgAxis:"#2a3a5a", svgGrid:"#1a2535", svgAxisLabel:"#4a5a7a",
    svgArc:"#f7914f", svgCylBtm:"#0a1828", pillBg:"#1e2838", pillText:"#7ab3f7",
  },
  arctic: {
    name:"Arctic", emoji:"🏔️", description:"Clean white & ice blue",
    bg:"#f0f4f8", bgCard:"#ffffff", bgHero:"linear-gradient(135deg,#e8f0fe 0%,#ffffff 100%)",
    bgInput:"#f1f5fb", bgTable:"#f0f4f8", bgTableHd:"#dbeafe", bgAlt:"#f8fafc", bgAlert:"#fffbeb",
    border:"#d1dce8", borderAlert:"#fcd34d", borderGrid:"#e2e8f0",
    text:"#1e293b", textSub:"#64748b", textMuted:"#94a3b8", textChoice:"#334155", textExpl:"#475569",
    accent1:"#2563eb", accent2:"#0891b2", accent1Soft:"#3b82f6",
    accent1Bg:"linear-gradient(135deg,#dbeafe,#eff6ff)", startBtn:"linear-gradient(135deg,#2563eb,#1d4ed8)",
    correct:"#16a34a", incorrect:"#dc2626", correctBg:"#f0fdf4", incorrectBg:"#fef2f2",
    correctBdr:"#16a34a", incorrectBdr:"#dc2626",
    chartGrid:"#e2e8f0", chartTick:"#64748b", chartTooltipBg:"#ffffff",
    chartBar:"#2563eb", chartLine:"#0891b2", chartDot:"#0891b2", chartScatter:"#2563eb", chartTrend:"#16a34a",
    svgBg:"#f0f4f8", svgFill:"#dbeafe", svgStroke:"#2563eb", svgLabel:"#d97706",
    svgMuted:"#64748b", svgAxis:"#94a3b8", svgGrid:"#e2e8f0", svgAxisLabel:"#94a3b8",
    svgArc:"#0891b2", svgCylBtm:"#e0e9f4", pillBg:"#dbeafe", pillText:"#1d4ed8",
  },
  forest: {
    name:"Forest", emoji:"🌿", description:"Calm greens & earth tones",
    bg:"#0f1a14", bgCard:"#152018", bgHero:"linear-gradient(135deg,#0a1f10 0%,#152018 100%)",
    bgInput:"#1a2a1e", bgTable:"#0f1a14", bgTableHd:"#1a3020", bgAlt:"#172219", bgAlert:"#1c1a00",
    border:"#213828", borderAlert:"#4a4200", borderGrid:"#1a2a1e",
    text:"#e2ede4", textSub:"#7a9e82", textMuted:"#4a6a52", textChoice:"#c8deca", textExpl:"#a8c4aa",
    accent1:"#4ade80", accent2:"#fb923c", accent1Soft:"#86efac",
    accent1Bg:"linear-gradient(135deg,#14532d,#052e16)", startBtn:"linear-gradient(135deg,#16a34a,#14532d)",
    correct:"#4ade80", incorrect:"#f87171", correctBg:"#052e16", incorrectBg:"#2d1616",
    correctBdr:"#4ade80", incorrectBdr:"#f87171",
    chartGrid:"#213828", chartTick:"#7a9e82", chartTooltipBg:"#152018",
    chartBar:"#4ade80", chartLine:"#fb923c", chartDot:"#fb923c", chartScatter:"#4ade80", chartTrend:"#facc15",
    svgBg:"#0f1a14", svgFill:"#1a3020", svgStroke:"#4ade80", svgLabel:"#facc15",
    svgMuted:"#7a9e82", svgAxis:"#2a4a32", svgGrid:"#1a2a1e", svgAxisLabel:"#4a6a52",
    svgArc:"#fb923c", svgCylBtm:"#0a1810", pillBg:"#1a3020", pillText:"#4ade80",
  },
  tableau: {
    name:"Tableau", emoji:"📊", description:"Data-viz inspired, slate",
    bg:"#1b2030", bgCard:"#232b3e", bgHero:"linear-gradient(135deg,#1a2540 0%,#232b3e 100%)",
    bgInput:"#2a3349", bgTable:"#1b2030", bgTableHd:"#2a3a54", bgAlt:"#222a3c", bgAlert:"#261e00",
    border:"#2e3a52", borderAlert:"#5a4800", borderGrid:"#253040",
    text:"#e6eaf4", textSub:"#8090b0", textMuted:"#506080", textChoice:"#c8d0e0", textExpl:"#a0b0c8",
    accent1:"#4e79a7", accent2:"#f28e2b", accent1Soft:"#76a8cc",
    accent1Bg:"linear-gradient(135deg,#1e3a5a,#162840)", startBtn:"linear-gradient(135deg,#4e79a7,#2a5080)",
    correct:"#59a14f", incorrect:"#e15759", correctBg:"#0e2a14", incorrectBg:"#2a1010",
    correctBdr:"#59a14f", incorrectBdr:"#e15759",
    chartGrid:"#2e3a52", chartTick:"#8090b0", chartTooltipBg:"#232b3e",
    chartBar:"#4e79a7", chartLine:"#f28e2b", chartDot:"#f28e2b", chartScatter:"#4e79a7", chartTrend:"#59a14f",
    svgBg:"#1b2030", svgFill:"#2a3a54", svgStroke:"#4e79a7", svgLabel:"#f28e2b",
    svgMuted:"#8090b0", svgAxis:"#2e3a52", svgGrid:"#253040", svgAxisLabel:"#506080",
    svgArc:"#f28e2b", svgCylBtm:"#141c2a", pillBg:"#2a3a54", pillText:"#76a8cc",
  },
  office: {
    name:"Office", emoji:"💼", description:"Microsoft Office — crisp & professional",
    bg:"#f3f2f1", bgCard:"#ffffff", bgHero:"linear-gradient(135deg,#deecf9 0%,#ffffff 100%)",
    bgInput:"#faf9f8", bgTable:"#f3f2f1", bgTableHd:"#c7e0f4", bgAlt:"#faf9f8", bgAlert:"#fff4ce",
    border:"#d2d0ce", borderAlert:"#f7d159", borderGrid:"#e1dfdd",
    text:"#201f1e", textSub:"#605e5c", textMuted:"#a19f9d", textChoice:"#323130", textExpl:"#484644",
    accent1:"#0078d4", accent2:"#d83b01", accent1Soft:"#2899f5",
    accent1Bg:"linear-gradient(135deg,#deecf9,#eff6fc)", startBtn:"linear-gradient(135deg,#0078d4,#005a9e)",
    correct:"#107c10", incorrect:"#a4262c", correctBg:"#dff6dd", incorrectBg:"#fde7e9",
    correctBdr:"#107c10", incorrectBdr:"#a4262c",
    chartGrid:"#e1dfdd", chartTick:"#605e5c", chartTooltipBg:"#ffffff",
    chartBar:"#0078d4", chartLine:"#d83b01", chartDot:"#d83b01", chartScatter:"#0078d4", chartTrend:"#107c10",
    svgBg:"#f3f2f1", svgFill:"#deecf9", svgStroke:"#0078d4", svgLabel:"#d83b01",
    svgMuted:"#605e5c", svgAxis:"#c8c6c4", svgGrid:"#e1dfdd", svgAxisLabel:"#a19f9d",
    svgArc:"#d83b01", svgCylBtm:"#e8e6e4", pillBg:"#deecf9", pillText:"#005a9e",
  },
  sunset: {
    name:"Sunset", emoji:"🌅", description:"Warm purples & coral",
    bg:"#16091e", bgCard:"#1f1030", bgHero:"linear-gradient(135deg,#2a0a3a 0%,#1f1030 100%)",
    bgInput:"#2a1540", bgTable:"#16091e", bgTableHd:"#2a0a3a", bgAlt:"#221240", bgAlert:"#1e1400",
    border:"#3a1a50", borderAlert:"#5a4000", borderGrid:"#261040",
    text:"#f0e6ff", textSub:"#9a78b8", textMuted:"#5a4070", textChoice:"#dcc8f0", textExpl:"#b898d0",
    accent1:"#c084fc", accent2:"#fb7185", accent1Soft:"#d8b4fe",
    accent1Bg:"linear-gradient(135deg,#4c1d95,#2e1065)", startBtn:"linear-gradient(135deg,#9333ea,#6b21a8)",
    correct:"#34d399", incorrect:"#fb7185", correctBg:"#022c22", incorrectBg:"#2d0a14",
    correctBdr:"#34d399", incorrectBdr:"#fb7185",
    chartGrid:"#3a1a50", chartTick:"#9a78b8", chartTooltipBg:"#1f1030",
    chartBar:"#c084fc", chartLine:"#fb7185", chartDot:"#fb7185", chartScatter:"#c084fc", chartTrend:"#34d399",
    svgBg:"#16091e", svgFill:"#2a0a3a", svgStroke:"#c084fc", svgLabel:"#fb7185",
    svgMuted:"#9a78b8", svgAxis:"#3a1a50", svgGrid:"#261040", svgAxisLabel:"#5a4070",
    svgArc:"#fb7185", svgCylBtm:"#10061a", pillBg:"#2a0a3a", pillText:"#d8b4fe",
  },
  sand: {
    name:"Sand", emoji:"🏖️", description:"Warm neutrals, easy on eyes",
    bg:"#fdf6ee", bgCard:"#fffaf4", bgHero:"linear-gradient(135deg,#fde8c8 0%,#fffaf4 100%)",
    bgInput:"#fdf0e0", bgTable:"#fdf6ee", bgTableHd:"#f5deb3", bgAlt:"#fdf0e0", bgAlert:"#fffbcc",
    border:"#e8d5b0", borderAlert:"#d4b000", borderGrid:"#ecdcc0",
    text:"#3d2b1f", textSub:"#7a5c3a", textMuted:"#b09070", textChoice:"#4a3020", textExpl:"#5a4030",
    accent1:"#b45309", accent2:"#0369a1", accent1Soft:"#d97706",
    accent1Bg:"linear-gradient(135deg,#fde8c8,#fdf6ee)", startBtn:"linear-gradient(135deg,#b45309,#92400e)",
    correct:"#15803d", incorrect:"#b91c1c", correctBg:"#f0fdf4", incorrectBg:"#fff1f2",
    correctBdr:"#15803d", incorrectBdr:"#b91c1c",
    chartGrid:"#e8d5b0", chartTick:"#7a5c3a", chartTooltipBg:"#fffaf4",
    chartBar:"#b45309", chartLine:"#0369a1", chartDot:"#0369a1", chartScatter:"#b45309", chartTrend:"#15803d",
    svgBg:"#fdf6ee", svgFill:"#fde8c8", svgStroke:"#b45309", svgLabel:"#0369a1",
    svgMuted:"#7a5c3a", svgAxis:"#d4b090", svgGrid:"#ecdcc0", svgAxisLabel:"#b09070",
    svgArc:"#0369a1", svgCylBtm:"#f0e4cc", pillBg:"#fde8c8", pillText:"#92400e",
  },
};

const ThemeCtx = createContext(THEMES.midnight);
const useTheme = () => useContext(ThemeCtx);

// ─── SAT STRUCTURE ────────────────────────────────────────────────────────────
const TEST_LENGTHS = {
  // Real Digital SAT: 54 R&W + 44 Math = 98 questions, 64+70 = 134 min
  full:    { label:"Full SAT",      total:98, rw:54, math:44, time:"2h 14min" },
  // Half: one full module of each section
  half:    { label:"Half Length",   total:49, rw:27, math:22, time:"~67min"   },
  // Quarter: representative sample of each section
  quarter: { label:"Quarter Length",total:25, rw:14, math:11, time:"~34min"   },
};
const DIFFICULTY_LEVELS = {
  easy:   { label:"Easy",   color:"#2ecc71", desc:"Build confidence with foundational questions" },
  medium: { label:"Medium", color:"#f7c44f", desc:"Core difficulty — closest to the real SAT"  },
  hard:   { label:"Hard",   color:"#e74c3c", desc:"Challenge yourself with advanced questions"  },
};
const SECTIONS = {
  math:    { label:"Math",              icon:"∑", topics:["Algebra","Geometry","Data Analysis","Advanced Math","Problem Solving","Statistics & Probability"] },
  reading: { label:"Reading & Writing", icon:"✦", topics:["Main Idea","Vocabulary in Context","Evidence","Grammar","Rhetorical Skills"] },
};

// Only show the passage box for Reading & Writing question types that require a passage.
const PASSAGE_TOPICS = new Set(["Main Idea","Evidence","Vocabulary in Context","Rhetorical Skills"]);

function renderPassage(q, T){
  // Grammar questions use "replace the underlined portion" behavior.
  // Some banks omit q.choiceMode, so we treat topic==="Grammar" as replace_underline too.
  const passage = q?.passage;
  const underline = q?.underline;
  if(!passage) return null;

  const shouldHide = (q?.choiceMode === "replace_underline") || (q?.topic === "Grammar");

  if(underline && typeof underline === "string"){
    const i = passage.indexOf(underline);
    if(i !== -1){
      const before = passage.slice(0,i);
      const after = passage.slice(i + underline.length);

      if(shouldHide){
        return (
          <span>
            {before}
            <span style={{ textDecoration: "underline", textDecorationThickness: "2px" }}>
              {"_____"}{/* hidden target */}
            </span>
            {after}
          </span>
        );
      }

      return (
        <span>
          {before}
          <span style={{ textDecoration: "underline", textDecorationThickness: "2px" }}>{underline}</span>
          {after}
        </span>
      );
    }
  }

  return <span>{passage}</span>;
}

// ─── FIGURE COMPONENTS ────────────────────────────────────────────────────────
function SVGFigure({ type, params }) {
  const T = useTheme();
  const W=280, H=200;
  const base={ background:T.svgBg, border:`1px solid ${T.border}`, borderRadius:10, padding:12, margin:"0 auto 20px", display:"block" };
  if (type==="right_triangle") {
    const {a=3,b=4,c=5}=params;
    const labelA = a==="?" ? "?" : String(a);
    const labelB = b==="?" ? "?" : String(b);
    const labelC = c==="?" ? "?" : String(c);
    const colA = a==="?" ? T.correct : T.svgLabel;
    const colB = b==="?" ? T.correct : T.svgLabel;
    const colC = c==="?" ? T.correct : T.svgLabel;
    return (<svg width={W} height={H} style={base}>
      <polygon points="40,160 200,160 200,40" fill={T.svgFill} stroke={T.svgStroke} strokeWidth="2"/>
      <rect x="188" y="148" width="12" height="12" fill="none" stroke={T.svgStroke} strokeWidth="1.5"/>
      <text x="120" y="178" fill={colA} fontSize="14" textAnchor="middle">{labelA}</text>
      <text x="218" y="108" fill={colB} fontSize="14" textAnchor="start">{labelB}</text>
      <text x="100" y="88"  fill={colC} fontSize="14" textAnchor="middle">{labelC}</text>
      <text x="48"  y="155" fill={T.svgMuted} fontSize="11">A</text>
      <text x="204" y="155" fill={T.svgMuted} fontSize="11">B</text>
      <text x="204" y="38"  fill={T.svgMuted} fontSize="11">C</text>
    </svg>);
  }
  if (type==="circle_arc") {
    const {radius=12,angle=60}=params;
    const cx=W/2,cy=H/2,r=70,rad=(angle*Math.PI)/180;
    const x2=cx+r*Math.cos(-Math.PI/2+rad),y2=cy+r*Math.sin(-Math.PI/2+rad);
    return (<svg width={W} height={H} style={base}>
      <circle cx={cx} cy={cy} r={r} fill={T.svgFill} stroke={T.svgAxis} strokeWidth="1.5"/>
      <line x1={cx} y1={cy} x2={cx} y2={cy-r} stroke={T.svgStroke} strokeWidth="2"/>
      <line x1={cx} y1={cy} x2={x2} y2={y2}   stroke={T.svgStroke} strokeWidth="2"/>
      <path d={`M ${cx} ${cy-r} A ${r} ${r} 0 0 1 ${x2} ${y2}`} fill="none" stroke={T.svgArc} strokeWidth="3"/>
      <text x={cx+8}  y={cy-r/2} fill={T.svgLabel} fontSize="13">{radius}</text>
      <text x={cx+20} y={cy-10}  fill={T.svgMuted}  fontSize="12">{angle}°</text>
      <text x={cx-14} y={cy+16}  fill={T.svgMuted}  fontSize="11">O</text>
      <circle cx={cx} cy={cy} r="3" fill={T.svgStroke}/>
    </svg>);
  }
  if (type==="rectangle") {
    const {w=8,h=5}=params;
    return (<svg width={W} height={H} style={base}>
      <rect x="50" y="50" width="180" height="110" fill={T.svgFill} stroke={T.svgStroke} strokeWidth="2"/>
      <text x="140" y="118" fill={T.svgLabel} fontSize="15" textAnchor="middle">{w}</text>
      <text x="22"  y="110" fill={T.svgLabel} fontSize="15" textAnchor="middle">{h}</text>
      <line x1="50"  y1="170" x2="230" y2="170" stroke={T.svgStroke} strokeWidth="1" strokeDasharray="4"/>
      <line x1="230" y1="50"  x2="230" y2="170" stroke={T.svgStroke} strokeWidth="1" strokeDasharray="4"/>
    </svg>);
  }
  if (type==="coordinate_plane") {
    const {points=[],lineEq,curve}=params;
    // Grid: ±5 range, uniform 22px per unit on both axes, centered at (140,105)
    const CX=140, CY=105, STEP=22;
    const sx = v => CX + v*STEP;
    const sy = v => CY - v*STEP;
    const RANGE = [-4,-3,-2,-1,0,1,2,3,4];

    // Build a render function from either a legacy lineEq function or a JSON curve descriptor
    const getCurveEq = () => {
      if (typeof lineEq === "function") return lineEq;
      if (curve) {
        if (curve.type === "line")     return x => curve.m * x + curve.b;
        if (curve.type === "parabola") return x => curve.a * (x - curve.h) ** 2 + curve.k;
      }
      return null;
    };
    const curveEq = getCurveEq();
    const buildPath = (fn) => {
      const pts=[];
      for(let x=-4;x<=4;x+=0.2){ const y=fn(x); if(y>=-4.5&&y<=4.5) pts.push(`${sx(x).toFixed(1)},${sy(y).toFixed(1)}`); }
      return pts.length>1 ? `M ${pts.join(" L ")}` : null;
    };

    // Label offset: keep labels from overlapping the point dot
    const labelOffset = (px, py) => {
      // prefer above-right, but shift if near edge
      const ox = px >= 3 ? -28 : 6;
      const oy = py >= 3 ? 14 : -8;
      return [ox, oy];
    };

    return (<svg width={W} height={H} style={base}>
      {/* Grid lines */}
      {RANGE.map(i=>(<g key={i}>
        <line x1={sx(i)} y1="10" x2={sx(i)} y2="195" stroke={T.svgGrid} strokeWidth="1"/>
        <line x1="15" y1={sy(i)} x2="265" y2={sy(i)} stroke={T.svgGrid} strokeWidth="1"/>
      </g>))}
      {/* Axes */}
      <line x1="15" y1={CY} x2="265" y2={CY} stroke={T.svgAxis} strokeWidth="1.8"/>
      <line x1={CX} y1="10" x2={CX} y2="195" stroke={T.svgAxis} strokeWidth="1.8"/>
      {/* Axis tick labels — x */}
      {[-4,-3,-2,-1,1,2,3,4].map(i=>(
        <text key={i} x={sx(i)-3} y={CY+13} fill={T.svgAxisLabel} fontSize="9" textAnchor="middle">{i}</text>
      ))}
      {/* Axis tick labels — y */}
      {[-4,-3,-2,-1,1,2,3,4].map(i=>(
        <text key={i} x={CX-8} y={sy(i)+3} fill={T.svgAxisLabel} fontSize="9" textAnchor="end">{i}</text>
      ))}
      {/* Axis name labels */}
      <text x="258" y={CY-5} fill={T.svgAxisLabel} fontSize="11">x</text>
      <text x={CX+4} y="14"  fill={T.svgAxisLabel} fontSize="11">y</text>
      {/* Curve / line */}
      {curveEq&&(curve?.type==="parabola" ? (()=>{
        const d=buildPath(curveEq);
        return d ? <path d={d} fill="none" stroke={T.svgArc} strokeWidth="2.5"/> : null;
      })() : (()=>{ const x1v=-4,x2v=4,y1v=curveEq(x1v),y2v=curveEq(x2v);
        return <line x1={sx(x1v)} y1={sy(y1v)} x2={sx(x2v)} y2={sy(y2v)} stroke={T.svgArc} strokeWidth="2.5"/>;
      })())}
      {/* Points — dot + coordinate label */}
      {points.map(([px,py],i)=>{
        const [lox,loy] = labelOffset(px,py);
        const col = i===0 ? T.svgStroke : T.svgArc;
        return (<g key={i}>
          <circle cx={sx(px)} cy={sy(py)} r="5" fill={col} stroke={T.svgBg} strokeWidth="2"/>
          <text x={sx(px)+lox} y={sy(py)+loy} fill={col} fontSize="10" fontWeight="700">
            ({px},{py})
          </text>
        </g>);
      })}
    </svg>);
  }
  if (type==="cylinder") {
    const {r=3, h=10}=params;
    return (<svg width={W} height={H} style={base}>
      <ellipse cx="140" cy="55"  rx="60" ry="18" fill={T.svgFill}    stroke={T.svgStroke} strokeWidth="2"/>
      <rect x="80" y="55" width="120" height="100" fill={T.svgFill} stroke="none"/>
      <line x1="80"  y1="55" x2="80"  y2="155" stroke={T.svgStroke} strokeWidth="2"/>
      <line x1="200" y1="55" x2="200" y2="155" stroke={T.svgStroke} strokeWidth="2"/>
      <ellipse cx="140" cy="155" rx="60" ry="18" fill={T.svgCylBtm} stroke={T.svgStroke} strokeWidth="2"/>
      <text x="210" y="110" fill={T.svgLabel} fontSize="13">h={h}</text>
      <text x="140" y="48"  fill={T.svgLabel} fontSize="13" textAnchor="middle">r={r}</text>
      <line x1="140" y1="55" x2="200" y2="55" stroke={T.svgLabel} strokeWidth="1.5" strokeDasharray="4"/>
    </svg>);
  }
  return null;
}

function ChartFigure({ type, data, config={} }) {
  const T=useTheme();
  const chartStyle={ background:T.svgBg, border:`1px solid ${T.border}`, borderRadius:10, padding:"12px 4px 4px", marginBottom:20 };
  const tip={ background:T.chartTooltipBg, border:`1px solid ${T.border}`, borderRadius:8, color:T.text };
  const H=200;
  if (type==="bar") return (<div style={chartStyle}>
    <ResponsiveContainer width="100%" height={H}>
      <BarChart data={data} margin={{top:5,right:20,left:0,bottom:5}}>
        <CartesianGrid strokeDasharray="3 3" stroke={T.chartGrid}/>
        <XAxis dataKey={config.xKey||"name"} tick={{fill:T.chartTick,fontSize:11}}/>
        <YAxis tick={{fill:T.chartTick,fontSize:11}}/>
        <Tooltip contentStyle={tip}/>
        <Bar dataKey={config.yKey||"value"} fill={T.chartBar} radius={[4,4,0,0]}/>
      </BarChart>
    </ResponsiveContainer>
    {config.caption&&<p style={{textAlign:"center",color:T.textSub,fontSize:11,margin:"4px 0 8px"}}>{config.caption}</p>}
  </div>);
  if (type==="line") return (<div style={chartStyle}>
    <ResponsiveContainer width="100%" height={H}>
      <LineChart data={data} margin={{top:5,right:20,left:0,bottom:5}}>
        <CartesianGrid strokeDasharray="3 3" stroke={T.chartGrid}/>
        <XAxis dataKey={config.xKey||"x"} tick={{fill:T.chartTick,fontSize:11}}/>
        <YAxis tick={{fill:T.chartTick,fontSize:11}}/>
        <Tooltip contentStyle={tip}/>
        <Line type="monotone" dataKey={config.yKey||"y"} stroke={T.chartLine} strokeWidth={2.5} dot={{fill:T.chartDot,r:4}}/>
      </LineChart>
    </ResponsiveContainer>
    {config.caption&&<p style={{textAlign:"center",color:T.textSub,fontSize:11,margin:"4px 0 8px"}}>{config.caption}</p>}
  </div>);
  if (type==="scatter") return (<div style={chartStyle}>
    <ResponsiveContainer width="100%" height={H}>
      <ScatterChart margin={{top:5,right:20,left:0,bottom:5}}>
        <CartesianGrid strokeDasharray="3 3" stroke={T.chartGrid}/>
        <XAxis dataKey="x" type="number" tick={{fill:T.chartTick,fontSize:11}}/>
        <YAxis dataKey="y" type="number" tick={{fill:T.chartTick,fontSize:11}}/>
        <Tooltip cursor={{strokeDasharray:"3 3"}} contentStyle={tip}/>
        {config.trendLine&&<ReferenceLine stroke={T.chartTrend} strokeDasharray="6 3" segment={config.trendLine}/>}
        <Scatter data={data} fill={T.chartScatter}/>
      </ScatterChart>
    </ResponsiveContainer>
    {config.caption&&<p style={{textAlign:"center",color:T.textSub,fontSize:11,margin:"4px 0 8px"}}>{config.caption}</p>}
  </div>);
  return null;
}

function TableFigure({ headers, rows, caption }) {
  const T=useTheme();
  return (<div style={{overflowX:"auto",marginBottom:20}}>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,background:T.bgTable,borderRadius:10,overflow:"hidden",border:`1px solid ${T.border}`}}>
      {caption&&<caption style={{color:T.textSub,fontSize:11,captionSide:"top",textAlign:"center",padding:"8px 0 4px"}}>{caption}</caption>}
      <thead><tr>{headers.map((h,i)=>(
        <th key={i} style={{padding:"10px 14px",background:T.bgTableHd,color:T.accent1,fontWeight:700,fontSize:12,textAlign:"center",borderBottom:`1px solid ${T.border}`}}>{h}</th>
      ))}</tr></thead>
      <tbody>{rows.map((row,i)=>(
        <tr key={i} style={{background:i%2===0?T.bgTable:T.bgAlt}}>
          {row.map((cell,j)=>(<td key={j} style={{padding:"9px 14px",color:T.textChoice,textAlign:"center",borderBottom:`1px solid ${T.borderGrid}`,fontWeight:j===0?600:400}}>{cell}</td>))}
        </tr>
      ))}</tbody>
    </table>
  </div>);
}

function Figure({ fig }) {
  if (!fig) return null;
  if (fig.type==="svg")   return <SVGFigure type={fig.shape} params={fig.params||{}}/>;
  if (fig.type==="chart") return <ChartFigure type={fig.chartType} data={fig.data} config={fig.config||{}}/>;
  if (fig.type==="table") return <TableFigure headers={fig.headers} rows={fig.rows} caption={fig.caption}/>;
  return null;
}

// ─── THEME PICKER ─────────────────────────────────────────────────────────────
function ThemePicker({ current, onChange }) {
  const T=useTheme();
  const [open,setOpen]=useState(false);
  return (
    <div style={{position:"relative"}}>
      <button onClick={()=>setOpen(o=>!o)} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:10,padding:"7px 14px",cursor:"pointer",color:T.text,fontFamily:"inherit",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:6}}>
        <span>{THEMES[current].emoji}</span>
        <span style={{color:T.text}}>{THEMES[current].name}</span>
        <span style={{color:T.textSub,fontSize:11}}>▾</span>
      </button>
      {open&&(
        <div style={{position:"absolute",top:"calc(100% + 8px)",right:0,background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:14,padding:8,zIndex:100,minWidth:230,boxShadow:"0 8px 32px rgba(0,0,0,0.25)"}}>
          {Object.entries(THEMES).map(([key,th])=>(
            <button key={key} onClick={()=>{onChange(key);setOpen(false);}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 14px",background:current===key?T.bgInput:"transparent",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit",textAlign:"left",marginBottom:2}}>
              <span style={{fontSize:20}}>{th.emoji}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13,color:current===key?T.accent1:T.text}}>{th.name}</div>
                <div style={{fontSize:11,color:T.textSub}}>{th.description}</div>
              </div>
              {current===key&&<span style={{color:T.accent1,fontSize:14}}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── QUESTION BANK ────────────────────────────────────────────────────────────
const BASE_QB = {
  math: {
    Algebra: {
      easy:[
        {q:"If 3x + 7 = 22, what is x?",choices:["3","5","7","9"],answer:1,explanation:"3x=15, x=5."},
        {q:"What is 2x when x = 6?",choices:["8","10","12","14"],answer:2,explanation:"2×6=12."},
        {q:"Solve: x − 4 = 10",choices:["6","14","10","4"],answer:1,explanation:"x=14."},
        {q:"The graph shows y = 2x − 1. What is the y-intercept?",fig:{type:"svg",shape:"coordinate_plane",params:{lineEq:x=>2*x-1,points:[[0,-1]]}},choices:["−2","−1","0","1"],answer:1,explanation:"At x=0: y=−1."},
      ],
      medium:[
        {q:"Which is equivalent to 2(x+3) − 4(x−1)?",choices:["−2x+10","6x+2","−2x+2","2x+10"],answer:0,explanation:"2x+6−4x+4=−2x+10."},
        {q:"If y=2x−1 and y=x+3, what is x?",choices:["2","4","5","7"],answer:1,explanation:"x=4."},
        {q:"Solve: 5x − 3 = 2x + 12",choices:["3","5","7","9"],answer:1,explanation:"3x=15, x=5."},
        {q:"Where do the two lines intersect?",fig:{type:"svg",shape:"coordinate_plane",params:{lineEq:x=>x+1,points:[[2,3]]}},choices:["(1,2)","(2,3)","(3,4)","(0,1)"],answer:1,explanation:"Intersection at (2,3)."},
      ],
      hard:[
        {q:"If f(x)=3x²−2x+1, what is f(−2)?",choices:["9","17","13","21"],answer:1,explanation:"3(4)−2(−2)+1=17."},
        {q:"For what k does kx²−4x+1=0 have exactly one solution?",choices:["2","4","8","16"],answer:1,explanation:"Discriminant=0: 16−4k=0, k=4."},
      ],
    },
    Geometry:{
      easy:[
        {q:"What is the area of the rectangle shown?",fig:{type:"svg",shape:"rectangle",params:{w:8,h:5}},choices:["26","40","13","45"],answer:1,explanation:"8×5=40."},
        {q:"Perimeter of a square with side 6?",choices:["12","24","36","18"],answer:1,explanation:"4×6=24."},
      ],
      medium:[
        {q:"What is the hypotenuse of the triangle shown?",fig:{type:"svg",shape:"right_triangle",params:{a:3,b:4,c:"?"}},choices:["5","6","7","8"],answer:0,explanation:"√(9+16)=5."},
        {q:"Radius=6. Circumference? (π≈3.14)",choices:["18.84","37.68","113.04","28.26"],answer:1,explanation:"2×3.14×6=37.68."},
      ],
      hard:[
        {q:"Volume of the cylinder shown? (π≈3.14)",fig:{type:"svg",shape:"cylinder",params:{}},choices:["94.2","282.6","188.4","314"],answer:1,explanation:"π×9×10=282.6."},
        {q:"Central angle 60°, radius 12. Arc length? (π≈3.14)",fig:{type:"svg",shape:"circle_arc",params:{radius:12,angle:60}},choices:["12.56","6.28","18.84","25.12"],answer:0,explanation:"(60/360)×2π×12≈12.56."},
      ],
    },
    "Data Analysis":{
      easy:[
        {q:"Which month had the highest sales?",fig:{type:"chart",chartType:"bar",data:[{name:"Jan",value:40},{name:"Feb",value:65},{name:"Mar",value:50},{name:"Apr",value:80},{name:"May",value:55}],config:{xKey:"name",yKey:"value",caption:"Monthly Sales (units)"}},choices:["January","February","March","April"],answer:3,explanation:"April=80 units."},
        {q:"Median of {4,7,7,9,13}?",choices:["7","8","9","6"],answer:0,explanation:"Middle value=7."},
        {q:"Mode of {2,4,4,5,7}?",choices:["2","4","5","7"],answer:1,explanation:"4 appears most."},
      ],
      medium:[
        {q:"What is the mean score from the table?",fig:{type:"table",headers:["Student","Score"],rows:[["Alice","82"],["Bob","90"],["Carlos","74"],["Diana","94"],["Evan","80"]],caption:"Test Scores"},choices:["82","84","86","88"],answer:1,explanation:"420/5=84."},
        {q:"Between which months did temperature rise most?",fig:{type:"chart",chartType:"line",data:[{x:"Jan",y:30},{x:"Feb",y:35},{x:"Mar",y:50},{x:"Apr",y:62},{x:"May",y:70},{x:"Jun",y:74}],config:{xKey:"x",yKey:"y",caption:"Average Monthly Temperature (°F)"}},choices:["Jan–Feb","Feb–Mar","Mar–Apr","May–Jun"],answer:1,explanation:"Feb→Mar = +15°F, the largest jump."},
        {q:"Mean of 80,90,70,100?",choices:["82","84","85","90"],answer:2,explanation:"340/4=85."},
      ],
      hard:[
        {q:"Which best describes the scatterplot relationship?",fig:{type:"chart",chartType:"scatter",data:[{x:1,y:55},{x:2,y:60},{x:3,y:65},{x:4,y:72},{x:5,y:78},{x:6,y:85},{x:7,y:88},{x:8,y:93}],config:{xLabel:"Hours Studied",yLabel:"Score",caption:"Hours Studied vs. Test Score",trendLine:[{x:1,y:52},{x:8,y:95}]}},choices:["Strong negative correlation","No correlation","Weak positive correlation","Strong positive correlation"],answer:3,explanation:"Scores rise with hours → strong positive correlation."},
        {q:"What fraction of female students prefer Math?",fig:{type:"table",headers:["","Math","English","Total"],rows:[["Male","18","12","30"],["Female","14","16","30"],["Total","32","28","60"]],caption:"Subject Preference by Gender"},choices:["7/15","7/16","14/30","7/30"],answer:0,explanation:"14/30=7/15."},
        {q:"Strong positive scatterplot. Most likely r-value?",choices:["−0.9","0.1","0.85","−0.3"],answer:2,explanation:"Strong positive → r≈+1."},
      ],
    },
    "Advanced Math":{
      easy:[{q:"x² when x=5?",choices:["10","15","25","30"],answer:2,explanation:"25."}],
      medium:[
        {q:"Roots of x²−5x+6=0?",choices:["2 and 3","1 and 6","−2 and −3","0 and 5"],answer:0,explanation:"(x−2)(x−3)=0."},
        {q:"Simplify (x²−9)/(x−3)",choices:["x+3","x−3","x+9","x²"],answer:0,explanation:"x+3."},
        {q:"What are the x-intercepts of the parabola?",fig:{type:"svg",shape:"coordinate_plane",params:{lineEq:x=>-(x-1)*(x+3)/3,points:[[1,0],[-3,0]]}},choices:["x=1 and x=−3","x=−1 and x=3","x=0 and x=2","x=1 and x=3"],answer:0,explanation:"Crosses at x=1 and x=−3."},
      ],
      hard:[
        {q:"g(x)=x³−4x. Where does g(x)=0?",choices:["0,2,−2","0,4","1,−1","2,−2"],answer:0,explanation:"x(x−2)(x+2)=0."},
        {q:"(2x+3)² equals?",choices:["4x²+9","4x²+6x+9","4x²+12x+9","2x²+12x+9"],answer:2,explanation:"4x²+12x+9."},
      ],
    },
    "Problem Solving":{
      easy:[
        {q:"150 miles in 3 hours. Average speed?",choices:["40 mph","45 mph","50 mph","55 mph"],answer:2,explanation:"50 mph."},
        {q:"8 apples at $0.50 each?",choices:["$3.00","$3.50","$4.00","$4.50"],answer:2,explanation:"$4.00."},
      ],
      medium:[
        {q:"Maria buys 2 shirts and 1 pair of pants. Total?",fig:{type:"table",headers:["Item","Price"],rows:[["Shirt","$25"],["Pants","$45"],["Shoes","$60"],["Hat","$15"]],caption:"Store Prices"},choices:["$70","$85","$95","$100"],answer:2,explanation:"$50+$45=$95."},
        {q:"20% off $80 item. Sale price?",choices:["$60","$64","$68","$72"],answer:1,explanation:"$64."},
        {q:"Tank fills at 5 gal/min, drains at 2. Fill 30 gallons?",choices:["5 min","8 min","10 min","15 min"],answer:2,explanation:"Net 3 gal/min; 10 min."},
      ],
      hard:[
        {q:"In which quarter did production DECREASE?",fig:{type:"chart",chartType:"bar",data:[{name:"Q1",value:120},{name:"Q2",value:145},{name:"Q3",value:130},{name:"Q4",value:160}],config:{xKey:"name",yKey:"value",caption:"Quarterly Production (units)"}},choices:["Q1","Q2","Q3","Q4"],answer:2,explanation:"Q3(130)<Q2(145)."},
        {q:"x varies inversely with y. x=4,y=9. Find x when y=6.",choices:["3","6","8","12"],answer:1,explanation:"xy=36, x=6."},
        {q:"A and B together finish in 4h. A alone=6h. B alone?",choices:["8h","10h","12h","14h"],answer:2,explanation:"12h."},
      ],
    },
  },
  reading:{
    "Main Idea":{
      easy:[
        {q:"'Ocean floor remains largely unexplored.' Main idea?",choices:["well documented","mostly unknown","teeming with life","irrelevant"],answer:1,explanation:"Largely unexplored=mostly unknown."},
        {q:"Paragraph describes recycling reducing landfill waste. Purpose?",choices:["entertain","inform about benefits","argue against recycling","describe history"],answer:1,explanation:"Informing about a benefit."},
      ],
      medium:[
        {q:"Author covers pros and cons of remote work. Passage is primarily…",choices:["persuasive","analytical","narrative","descriptive"],answer:1,explanation:"Pros and cons=analytical."},
        {q:"Most supported conclusion from the survey?",fig:{type:"table",headers:["Age Group","Books/Year","Digital","Print"],rows:[["13–17","8","62%","38%"],["18–25","6","70%","30%"],["26–40","9","45%","55%"],["41+","12","28%","72%"]],caption:"Reading Habits Survey"},choices:["Older readers read fewer books","Digital preferred by all","Older readers prefer print and read more","Teens read most"],answer:2,explanation:"41+ reads 12/year and 72% prefer print."},
      ],
      hard:[
        {q:"Passage opens with anecdote then cites three studies. Structure serves to…",choices:["entertain then educate","establish emotional connection then credibility","refute the opening","summarize research"],answer:1,explanation:"Anecdote=hook; studies=credibility."},
      ],
    },
    "Vocabulary in Context":{
      easy:[
        {q:"'Meticulous notes enabled the breakthrough.' Meticulous means:",choices:["careless","extremely careful","brief","creative"],answer:1,explanation:"Meticulous=detailed care."},
        {q:"'She gave a candid answer.' Candid means:",choices:["rehearsed","honest","lengthy","confusing"],answer:1,explanation:"Candid=truthful."},
      ],
      medium:[
        {q:"'Rhetoric was deliberately obfuscating.' Obfuscating means:",choices:["clarifying","persuasive","confusing","inspiring"],answer:2,explanation:"Obfuscate=make unclear."},
        {q:"'The review was scathing.' Scathing means:",choices:["mild","praising","harshly critical","brief"],answer:2,explanation:"Scathing=severely critical."},
      ],
      hard:[
        {q:"'The policy was draconian.' Draconian means:",choices:["generous","excessively harsh","popular","poorly explained"],answer:1,explanation:"Draconian=extremely severe."},
        {q:"'Her equanimity impressed everyone.' Equanimity means:",choices:["panic","indifference","mental calmness","confusion"],answer:2,explanation:"Equanimity=calm composure."},
      ],
    },
    Evidence:{
      easy:[{q:"Best evidence 'most teens prefer streaming to cable'?",choices:["Quote from one teen","Survey of 5,000 teens","Cable press release","Parent anecdote"],answer:1,explanation:"Large survey=strongest."}],
      medium:[
        {q:"Strongest study design to prove Exercise X reduces stress?",choices:["Interview 5 people","Observe one class","Randomized controlled trial","Reading articles"],answer:2,explanation:"RCT=gold standard."},
        {q:"Which data supports 'screen time harms academic performance'?",fig:{type:"table",headers:["Screen Time","Avg GPA","Hours Sleep"],rows:[["< 1 hr","3.7","8.2"],["1–2 hrs","3.4","7.8"],["2–4 hrs","3.1","7.2"],["4+ hrs","2.7","6.5"]],caption:"Screen Time & Academic Performance"},choices:["4+ hrs students sleep 6.5h","<1hr students have 3.7 GPA","As screen time increases, GPA consistently decreases","Screen time affects sleep more than GPA"],answer:2,explanation:"GPA drops 3.7→2.7 as screen time rises."},
        {q:"Which weakens 'social media increases teen anxiety'?",choices:["More screen time correlates with anxiety","Teens report stress","Non-users show no significant anxiety difference","Anxiety rose with social media"],answer:2,explanation:"If non-users show similar anxiety, social media may not be the cause."},
      ],
      hard:[{q:"Author argues drug is effective. Critic notes it was funded by manufacturer. This questions the study's:",choices:["sample size","statistical methods","objectivity/bias","peer review"],answer:2,explanation:"Funding source=conflict of interest."}],
    },
    Grammar:{
      easy:[
        {q:"Which is grammatically correct?",choices:["Each of the students have a textbook.","Each of the students has a textbook.","Each students has.","Each of student have."],answer:1,explanation:"'Each' is singular→'has'."},
        {q:"Correct sentence:",choices:["Him and I went.","He and I went.","Him and me went.","He and me went."],answer:1,explanation:"Subject pronouns: He and I."},
      ],
      medium:[
        {q:"Correct semicolon use?",choices:["I like cats; and dogs.","She studied hard; she passed.","He ran fast; but lost.","They won; the game."],answer:1,explanation:"Semicolons join independent clauses."},
        {q:"'The team ___ playing well.'",choices:["is","are","were","have been"],answer:0,explanation:"Collective noun→singular verb."},
      ],
      hard:[
        {q:"Which avoids a dangling modifier?",choices:["Running, the rain soaked her.","Running, she got soaked by the rain.","Having run, the rain was heavy.","To run, the rain started."],answer:1,explanation:"'Running' must refer to 'she'."},
        {q:"Correct apostrophe:",choices:["The dogs' bone was buried.","The dog's' bone.","The dogs bone.","The dogs's bone."],answer:0,explanation:"Plural possessive: dogs'."},
      ],
    },
    "Rhetorical Skills":{
      easy:[{q:"Author ends essay urging readers to vote. Primarily meant to:",choices:["entertain","inform","persuade readers to act","describe a process"],answer:2,explanation:"Call to action=persuasive."}],
      medium:[
        {q:"'Can we afford to ignore climate change?' Purpose:",choices:["request info","admit uncertainty","prompt reader to agree","introduce counterargument"],answer:2,explanation:"Rhetorical questions guide conclusions."},
        {q:"Which claim is best supported by this data?",fig:{type:"chart",chartType:"line",data:[{x:"2018",y:42},{x:"2019",y:47},{x:"2020",y:53},{x:"2021",y:58},{x:"2022",y:64}],config:{xKey:"x",yKey:"y",caption:"Public Support for Policy A (%)"}},choices:["Support remained stable","Policy A steadily gained support since 2018","Policy A lost support after 2020","Both equally popular"],answer:1,explanation:"42%→64%=consistent upward trend."},
        {q:"'Like a ship without a compass, the company drifted.' This is:",choices:["alliteration","a simile","hyperbole","personification"],answer:1,explanation:"'Like a ship'=simile."},
      ],
      hard:[
        {q:"Author refutes counterargument before thesis. This is called:",choices:["anaphora","concession and rebuttal","appeal to authority","circular reasoning"],answer:1,explanation:"Acknowledging then refuting=concession and rebuttal."},
        {q:"Repeating a phrase at the start of consecutive sentences is:",choices:["creates ambiguity","anaphora — building emphasis","an ad hominem attack","weakens argument"],answer:1,explanation:"Anaphora=repetition for emphasis."},
      ],
    },
  },
};

// ─── QUESTION BANK EXPANSION (safe) ──────────────────────────────────────────
// Expands each topic+difficulty bucket to ~45 items without changing app flow.
// - Generates correctness-safe Algebra Easy variants
// - Otherwise clones existing questions with harmless "(v#)" tags
const TARGET_Q_PER_BUCKET = 45;

function cloneQuestion(q, variantTag) {
  const out = {
    ...q,
    q: `${q.q} ${variantTag}`,
    choices: Array.isArray(q.choices) ? [...q.choices] : q.choices,
  };
  if (q.fig) out.fig = { ...q.fig, params: q.fig.params };
  return out;
}

function fisherYatesShuffleCopy(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generate correctness-safe Algebra Easy items
function genAlgebraEasy(n, startIndex = 0) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const k = startIndex + i + 1;
    const type = k % 4;

    if (type === 0) {
      const a = 2 + (k % 4);        // 2..5
      const x = 2 + (k % 9);        // 2..10
      const b = 1 + ((k * 3) % 11); // 1..11
      const c = a * x + b;
      const correct = x;
      const pool = [correct, correct - 2, correct + 1, correct + 3].map(String);
      const choices = fisherYatesShuffleCopy(pool).slice(0, 4);
      out.push({
        q: `If ${a}x + ${b} = ${c}, what is x?`,
        choices,
        answer: choices.indexOf(String(correct)),
        explanation: `Subtract ${b} and divide by ${a}: x=${correct}.`,
      });
    } else if (type === 1) {
      const t = 4 + (k % 9); // 4..12
      const correct = 2 * t;
      const pool = [correct, correct - 2, correct + 2, correct + 4].map(String);
      const choices = fisherYatesShuffleCopy(pool);
      out.push({
        q: `What is 2x when x = ${t}?`,
        choices,
        answer: choices.indexOf(String(correct)),
        explanation: `2×${t}=${correct}.`,
      });
    } else if (type === 2) {
      const a = 2 + (k % 9);          // 2..10
      const b = 5 + ((k * 2) % 13);   // 5..17
      const correct = a + b;
      const pool = [correct, correct - 4, correct + 3, b].map(String);
      const choices = fisherYatesShuffleCopy(pool);
      out.push({
        q: `Solve: x − ${a} = ${b}`,
        choices,
        answer: choices.indexOf(String(correct)),
        explanation: `Add ${a} to both sides: x=${correct}.`,
      });
    } else {
      const m = 1 + (k % 4);   // 1..4
      const b = -4 + (k % 9);  // -4..4
      const correct = b;
      const pool = [correct, correct - 1, correct + 1, -correct].map(String);
      const choices = fisherYatesShuffleCopy(pool);
      out.push({
        q: `For the line y = ${m}x ${b >= 0 ? "+" : "−"} ${Math.abs(b)}, what is the y-intercept?`,
        choices,
        answer: choices.indexOf(String(correct)),
        explanation: `The y-intercept is the constant term (when x=0): y=${correct}.`,
      });
    }
  }
  return out;
}

function expandBucket(baseArr, generatorFn) {
  const base = Array.isArray(baseArr) ? baseArr : [];
  if (base.length >= TARGET_Q_PER_BUCKET) return base;

  const expanded = [...base];

  // 1) add generated items (only for buckets we trust for correctness)
  if (typeof generatorFn === "function") {
    const need = TARGET_Q_PER_BUCKET - expanded.length;
    expanded.push(...generatorFn(need, expanded.length));
  }

  // 2) if still short, clone with safe variant tags
  let v = 1;
  while (expanded.length < TARGET_Q_PER_BUCKET) {
    const src = base[expanded.length % base.length];
    expanded.push(cloneQuestion(src, `(v${v++})`));
  }

  return expanded;
}

function expandBank(baseBank) {
  const result = { math: {}, reading: {} };

  for (const topic of Object.keys(baseBank.math)) {
    result.math[topic] = {};
    for (const diff of Object.keys(baseBank.math[topic])) {
      const gen =
        topic === "Algebra" && diff === "easy"
          ? genAlgebraEasy
          : null;
      result.math[topic][diff] = expandBucket(baseBank.math[topic][diff], gen);
    }
  }

  for (const topic of Object.keys(baseBank.reading)) {
    result.reading[topic] = {};
    for (const diff of Object.keys(baseBank.reading[topic])) {
      result.reading[topic][diff] = expandBucket(baseBank.reading[topic][diff], null);
    }
  }

  return result;
}

let BANK = expandBank(BASE_QB);

// ─── QUESTION BANK LOADING (JSON) ─────────────────────────────────────────────
// Expected file: /public/questions.json (served at /questions.json)
// Each row: { id, section: "math"|"reading", topic, difficulty, question, choices, answerIndex, explanation, visual }

function normalizeText(s){
  return String(s||"")
    .toLowerCase()
    .replace(/[\u2010\u2011\u2012\u2013\u2014]/g,"-")
    .replace(/\s+/g," ")
    .trim();
}

function fingerprintQuestion(q){
  const base = [
    q.section,
    q.topic,
    q.difficulty,
    normalizeText(q.question),
    (q.choices||[]).map(normalizeText).join("|"),
    q.answerIndex,
    q.visual?.type || "",
    q.visual?.shape || q.visual?.chartType || ""
  ].join("||");
  // lightweight stable hash
  let h=0;
  for(let i=0;i<base.length;i++){ h = (h*31 + base.charCodeAt(i)) >>> 0; }
  return String(h);
}

function needsVisual(q){
  if(q.section === "math" && q.topic === "Geometry") return true;
  if(q.section === "math" && q.topic === "Data Analysis") return true;
  if(q.section === "math" && q.topic === "Statistics & Probability") return true;
  return false;
}

function isVisualAcceptable(q){
  if(!needsVisual(q)) return true;
  if(!q.visual) return false;

  if(q.section === "math" && q.topic === "Geometry"){
    // Geometry: require svg figure
    return q.visual.type === "svg" && !!q.visual.shape;
  }
  if(q.section === "math" && q.topic === "Data Analysis"){
    // Data Analysis: chart or table
    if(q.visual.type === "chart") return true;
    if(q.visual.type === "table") return true;
    return q.visual.type === "svg";
  }
  if(q.section === "math" && q.topic === "Statistics & Probability"){
    // Statistics & Probability: chart or table
    if(q.visual.type === "chart") return true;
    if(q.visual.type === "table") return true;
    return q.visual.type === "svg";
  }
  return true;
}

function buildBankFromQuestionList(list){
  const issues = [];
  const seen = new Set();

  const bank = { math:{}, reading:{} };
  const matrix = [];

  for(const raw of (list||[])){
    const q = {
      id: raw.id || undefined,
      section: raw.section,
      topic: raw.topic,
      difficulty: raw.difficulty,
      // Reading/Writing passages (Digital SAT): support common field names from generators
      passage: raw.passage ?? raw.passageText ?? raw.stimulus ?? raw.context ?? raw.text ?? null,
      question: raw.question,
      choices: raw.choices,
      answerIndex: raw.answerIndex,
      explanation: raw.explanation || "",
      visual: raw.visual ?? null
    };

    // Basic validation
    if(!q.section || (q.section!=="math" && q.section!=="reading")){
      issues.push({level:"error", code:"bad_section", id:q.id, detail:q.section});
      continue;
    }
    if(!q.topic || !q.difficulty){
      issues.push({level:"error", code:"missing_topic_or_difficulty", id:q.id});
      continue;
    }
    if(!Array.isArray(q.choices) || q.choices.length !== 4){
      issues.push({level:"error", code:"choices_not_4", id:q.id, detail:q.choices?.length});
      continue;
    }
    if(typeof q.answerIndex !== "number" || q.answerIndex<0 || q.answerIndex>3){
      issues.push({level:"error", code:"bad_answerIndex", id:q.id, detail:q.answerIndex});
      continue;
    }

    // Duplicate detection (skip duplicates automatically)
    const fp = fingerprintQuestion(q);
    const isDup = seen.has(fp);
    if(isDup){
      issues.push({level:"warn", code:"duplicate_skipped", id:q.id, fp});
      continue;
    }
    seen.add(fp);

    // Visual enforcement
    const needs = needsVisual(q);
    const has = !!q.visual;
    const okVis = isVisualAcceptable(q);
    if(needs && !has){
      issues.push({level:"warn", code:"missing_visual", id:q.id, section:q.section, topic:q.topic, difficulty:q.difficulty});
    } else if(needs && has && !okVis){
      issues.push({level:"warn", code:"bad_visual_type", id:q.id, visualType:q.visual?.type, topic:q.topic});
    }

    // Build matrix row
    matrix.push({
      id: q.id || "",
      section: q.section,
      topic: q.topic,
      difficulty: q.difficulty,
      question: q.question,
      has_visual: has ? "yes" : "no",
      visual_type: q.visual?.type || "",
      visual_shape: q.visual?.shape || "",
      fingerprint: fp,
      passage_present: q.passage ? "yes" : "no",
      passage_len: q.passage ? String(q.passage).length : ""
    });

    // Convert to the in-app object format (backwards compatible)
    const appQ = {
      id: q.id || fp,
      q: q.question,
      choices: q.choices,
      answer: q.answerIndex,
      explanation: q.explanation,
      fig: q.visual,
      passage: q.passage,
      underline: raw.underline ?? null,
      choiceMode: raw.choiceMode ?? null,
    };

    const sec = q.section;
    if(!bank[sec][q.topic]) bank[sec][q.topic] = { easy:[], medium:[], hard:[] };
    bank[sec][q.topic][q.difficulty].push(appQ);
  }

  return { bank, issues, matrix };
}

function downloadText(filename, content, mime="text/plain"){
  const blob = new Blob([content], {type: mime});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function toCSV(rows){
  const esc = (v)=>('"'+String(v??"").replace(/"/g,'""')+'"');
  if(!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.map(esc).join(",")];
  for(const r of rows){
    lines.push(headers.map(h=>esc(r[h])).join(","));
  }
  return lines.join("\n");
}

function loadBankFromLocal() {
  // Local, curated, build-time bank (no network fetch; no generation)
  return buildBankFromQuestionList(QUESTIONS);
}


// ─── STORAGE ──────────────────────────────────────────────────────────────────
function makeEmpty(){
  const o={};
  Object.keys(SECTIONS).forEach(sec=>{o[sec]={};SECTIONS[sec].topics.forEach(t=>{o[sec][t]={easy:{c:0,t:0},medium:{c:0,t:0},hard:{c:0,t:0}};});});
  return o;
}
function loadProg(){try{const s=localStorage.getItem("sat_p4");if(s)return JSON.parse(s);}catch{}return makeEmpty();}
function saveProg(p){try{localStorage.setItem("sat_p4",JSON.stringify(p));}catch{}}
function loadThemeKey(){try{return localStorage.getItem("sat_theme4")||"midnight";}catch{return "midnight";}}
function saveThemeKey(k){try{localStorage.setItem("sat_theme4",k);}catch{}}
function pct(c,t){return t===0?0:Math.round((c/t)*100);}
function getPracticeQs(length,diff){
  const cfg=TEST_LENGTHS[length];let all=[];
  [{key:"math",n:cfg.math},{key:"reading",n:cfg.rw}].forEach(({key,n})=>{
    let pool=[];
    SECTIONS[key].topics.forEach(t=>{const qs=BANK[key][t]?.[diff]??[];pool.push(...qs.map(q=>({...q,section:key,topic:t})));});
    pool=pool.sort(()=>Math.random()-0.5);all.push(...pool.slice(0,n));
  });
  return all.sort(()=>Math.random()-0.5);
}


/* ─── MOCK SAT (TIMED SECTIONS + SCORING) ────────────────────────────────────
   Digital SAT total time ≈ 2h14m (134 minutes): R&W 64m + Math 70m.
   For shorter mocks, we scale section times proportionally. */
const MOCK_SECTION_MINUTES = {
  full:    { reading: 64, math: 70 },
  half:    { reading: 32, math: 35 },
  quarter: { reading: 16, math: 18 },
};

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }
function fmtTime(sec){
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s/60);
  const r = s%60;
  return `${m}:${String(r).padStart(2,'0')}`;
}

// SAT score conversion using a realistic scaled-score curve.
// Based on published College Board score tables (Digital SAT 2024).
// Maps raw-score percentage → scaled section score [200, 800] in increments of 10.
// The curve is non-linear: scores compress near the extremes and spread in the middle.
const SAT_SECTION_CURVE = [
  // [minPct, maxPct, score]  — right-inclusive buckets
  [0,   2,  200], [3,   5,  210], [6,   8,  220], [9,  11,  230],
  [12,  14, 240], [15,  17, 250], [18,  20, 260], [21,  23, 270],
  [24,  26, 280], [27,  29, 290], [30,  32, 300], [33,  35, 310],
  [36,  38, 320], [39,  41, 330], [42,  44, 340], [45,  47, 350],
  [48,  50, 360], [51,  53, 370], [54,  56, 380], [57,  59, 390],
  [60,  62, 400], [63,  65, 420], [66,  68, 440], [69,  71, 460],
  [72,  74, 480], [75,  77, 500], [78,  80, 530], [81,  83, 560],
  [84,  86, 590], [87,  89, 620], [90,  92, 650], [93,  94, 680],
  [95,  96, 710], [97,  98, 740], [99,  99, 770], [100,100, 800],
];

function scaledSectionScore(percent){
  const p = clamp(Math.round(percent), 0, 100);
  for(const [lo, hi, score] of SAT_SECTION_CURVE){
    if(p >= lo && p <= hi) return score;
  }
  return p <= 0 ? 200 : 800;
}

// Returns a descriptive band label for a section score
function scoreBand(score){
  if(score >= 750) return "Outstanding";
  if(score >= 650) return "Strong";
  if(score >= 550) return "Proficient";
  if(score >= 450) return "Developing";
  if(score >= 350) return "Needs Work";
  return "Beginning";
}

// Returns a composite total score (200–1600) and a percentile estimate
function compositePercentile(total){
  // Approximate percentiles based on College Board 2024 data
  if(total >= 1550) return 99;
  if(total >= 1500) return 99;
  if(total >= 1450) return 97;
  if(total >= 1400) return 95;
  if(total >= 1350) return 92;
  if(total >= 1300) return 88;
  if(total >= 1250) return 84;
  if(total >= 1200) return 79;
  if(total >= 1150) return 73;
  if(total >= 1100) return 67;
  if(total >= 1050) return 60;
  if(total >= 1000) return 53;
  if(total >= 950)  return 45;
  if(total >= 900)  return 38;
  if(total >= 850)  return 31;
  if(total >= 800)  return 24;
  if(total >= 750)  return 18;
  if(total >= 700)  return 13;
  if(total >= 650)  return 9;
  if(total >= 600)  return 6;
  if(total >= 550)  return 3;
  if(total >= 500)  return 2;
  return 1;
}

function buildPool(section, diff){
  let pool=[];
  SECTIONS[section].topics.forEach(t=>{
    const qs = BANK[section]?.[t]?.[diff] ?? [];
    pool.push(...qs.map(q=>({...q,section,topic:t})));
  });
  return pool.sort(()=>Math.random()-0.5);
}

function pickN(arr, n){
  if(arr.length<=n) return arr.slice();
  const copy = arr.slice().sort(()=>Math.random()-0.5);
  return copy.slice(0,n);
}

function getMockTest(length, diff){
  const cfg = TEST_LENGTHS[length];
  const mins = MOCK_SECTION_MINUTES[length] ?? MOCK_SECTION_MINUTES.half;

  const readingQs = pickN(buildPool('reading', diff), cfg.rw);
  const mathQs    = pickN(buildPool('math', diff),    cfg.math);

  return {
    length,
    difficulty: diff,
    sections: [
      { key:'reading', label: SECTIONS.reading.label, minutes: mins.reading, questions: readingQs },
      { key:'math',    label: SECTIONS.math.label,    minutes: mins.math,    questions: mathQs },
    ]
  };
}


// ─── RADIAL ───────────────────────────────────────────────────────────────────
function RadialProgress({value,size=80,stroke=7,color}){
  const T=useTheme();
  const c=color||T.accent1,r=(size-stroke)/2,circ=2*Math.PI*r,offset=circ-(value/100)*circ;
  return(<svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.bgInput} strokeWidth={stroke}/>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{transition:"stroke-dashoffset 0.6s ease"}}/>
  </svg>);
}

// ─── PRACTICE TEST PAGE ───────────────────────────────────────────────────────
function PracticeTestPage({onStart,onBack}){
  const T=useTheme();
  const [sel,setSel]=useState("half");
  const [diff,setDiff]=useState("medium");
  const cfg=TEST_LENGTHS[sel],dv=DIFFICULTY_LEVELS[diff];
  return(<div style={{display:"flex",flexDirection:"column",gap:20}}>
    <button onClick={onBack} style={{background:"transparent",border:"none",color:T.accent1,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",alignSelf:"flex-start"}}>← Dashboard</button>
    <div style={{background:T.bgHero,border:`1px solid ${T.border}`,borderRadius:20,padding:28}}>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:3,color:T.accent1,marginBottom:8}}>PRACTICE TEST</div>
      <h1 style={{fontSize:24,fontWeight:800,margin:"0 0 8px",color:T.text}}>Configure Your Session</h1>
      <p style={{color:T.textSub,fontSize:13,margin:0}}>The real Digital SAT has <strong style={{color:T.accent1}}>98 questions</strong> — 54 R&W + 44 Math</p>
    </div>
    <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:24}}>
      <div style={{fontWeight:700,fontSize:13,color:T.textSub,letterSpacing:1,textTransform:"uppercase",marginBottom:16}}>📏 Test Length</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
        {Object.entries(TEST_LENGTHS).map(([key,val])=>(
          <button key={key} onClick={()=>setSel(key)} style={{borderRadius:14,border:`2px solid ${sel===key?T.accent1:T.border}`,padding:"20px 14px",cursor:"pointer",textAlign:"center",fontFamily:"inherit",background:sel===key?T.bgInput:T.bgCard,color:T.text}}>
            <div style={{fontSize:22,marginBottom:6}}>{key==="full"?"📋":key==="half"?"📄":"📝"}</div>
            <div style={{fontWeight:800,fontSize:15,color:sel===key?T.accent1:T.text}}>{val.label}</div>
            <div style={{color:T.textSub,fontSize:12,marginTop:4}}>{val.total} questions</div>
            <div style={{display:"inline-block",background:T.pillBg,borderRadius:20,padding:"3px 10px",fontSize:11,color:T.pillText,marginTop:8}}>{val.time}</div>
            <div style={{color:T.textMuted,fontSize:11,marginTop:6}}>{val.rw} R&W · {val.math} Math</div>
          </button>
        ))}
      </div>
    </div>
    <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:24}}>
      <div style={{fontWeight:700,fontSize:13,color:T.textSub,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>🎯 Difficulty Level</div>
      <p style={{color:T.textSub,fontSize:13,marginBottom:16}}>The real SAT mixes all levels — focus on one tier to build targeted skills.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
        {Object.entries(DIFFICULTY_LEVELS).map(([key,val])=>(
          <button key={key} onClick={()=>setDiff(key)} style={{borderRadius:14,border:`2px solid ${diff===key?val.color:T.border}`,padding:"20px 14px",cursor:"pointer",textAlign:"center",fontFamily:"inherit",background:diff===key?`${val.color}18`:T.bgCard,color:T.text}}>
            <div style={{fontSize:22,marginBottom:6}}>{key==="easy"?"🟢":key==="medium"?"🟡":"🔴"}</div>
            <div style={{fontWeight:800,fontSize:15,color:diff===key?val.color:T.text}}>{val.label}</div>
            <div style={{color:T.textSub,fontSize:12,marginTop:6,lineHeight:1.4}}>{val.desc}</div>
          </button>
        ))}
      </div>
    </div>
    <div style={{background:T.bgCard,border:`1.5px solid ${T.border}`,borderRadius:16,padding:"20px 24px",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
      <div style={{flex:1}}>
        <div style={{fontWeight:800,fontSize:17,marginBottom:6,color:T.text}}>Your Session</div>
        <div style={{color:T.textSub,fontSize:14}}>
          <span style={{color:T.accent1,fontWeight:700}}>{cfg.total} questions</span>{" · "}
          <span style={{color:dv.color,fontWeight:700}}>{dv.label}</span>{" · ~"}{cfg.time}
        </div>
        <div style={{color:T.textMuted,fontSize:12,marginTop:4}}>{cfg.rw} R&W · {cfg.math} Math</div>
      </div>
      <button onClick={()=>onStart(sel,diff)} style={{background:T.startBtn,border:"none",borderRadius:12,padding:"14px 28px",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>Start Test →</button>
    </div>
  </div>);
}



// ─── MOCK TEST (TIMED) ─────────────────────────────────────────────────────
function MockTestPage({onStart,onBack}){
  const T=useTheme();
  const [sel,setSel]=useState('full');
  const [diff,setDiff]=useState('medium');
  const cfg=TEST_LENGTHS[sel], dv=DIFFICULTY_LEVELS[diff];
  const mins = MOCK_SECTION_MINUTES[sel] ?? MOCK_SECTION_MINUTES.half;

  return(<div style={{display:'flex',flexDirection:'column',gap:20}}>
    <button onClick={onBack} style={{background:'transparent',border:'none',color:T.accent1,fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:'inherit',alignSelf:'flex-start'}}>← Dashboard</button>

    <div style={{background:T.bgHero,border:`1px solid ${T.border}`,borderRadius:20,padding:28}}>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:3,color:T.accent1,marginBottom:8}}>TIMED MOCK</div>
      <h1 style={{fontSize:24,fontWeight:800,margin:'0 0 8px',color:T.text}}>Mock Digital SAT</h1>
      <p style={{color:T.textSub,fontSize:13,margin:0}}>Runs in <strong style={{color:T.accent1}}>two timed sections</strong> (R&W then Math) with a simple 1600-style score.</p>
    </div>

    <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:24}}>
      <div style={{fontWeight:700,fontSize:13,color:T.textSub,letterSpacing:1,textTransform:'uppercase',marginBottom:16}}>📏 Test Length</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12}}>
        {Object.entries(TEST_LENGTHS).map(([key,val])=>{
          const m = MOCK_SECTION_MINUTES[key] ?? MOCK_SECTION_MINUTES.half;
          const timeLabel = `${m.reading}m R&W + ${m.math}m Math`;
          return (
            <button key={key} onClick={()=>setSel(key)} style={{borderRadius:14,border:`2px solid ${sel===key?T.accent1:T.border}`,padding:'20px 14px',cursor:'pointer',textAlign:'center',fontFamily:'inherit',background:sel===key?T.bgInput:T.bgCard,color:T.text}}>
              <div style={{fontSize:22,marginBottom:6}}>{key==='full'?'⏱️':key==='half'?'⏲️':'⌛'}</div>
              <div style={{fontWeight:800,fontSize:15,color:sel===key?T.accent1:T.text}}>{val.label}</div>
              <div style={{color:T.textSub,fontSize:12,marginTop:4}}>{val.rw} R&W · {val.math} Math</div>
              <div style={{display:'inline-block',background:T.pillBg,borderRadius:20,padding:'3px 10px',fontSize:11,color:T.pillText,marginTop:8}}>{timeLabel}</div>
            </button>
          );
        })}
      </div>
    </div>

    <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:24}}>
      <div style={{fontWeight:700,fontSize:13,color:T.textSub,letterSpacing:1,textTransform:'uppercase',marginBottom:4}}>🎯 Difficulty Level</div>
      <p style={{color:T.textSub,fontSize:13,marginBottom:16}}>Pick one difficulty for now (adaptive comes next).</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12}}>
        {Object.entries(DIFFICULTY_LEVELS).map(([key,val])=>{
          const on = diff===key;
          return (
            <button key={key} onClick={()=>setDiff(key)} style={{borderRadius:14,border:`2px solid ${on?val.color:T.border}`,padding:'20px 14px',cursor:'pointer',textAlign:'center',fontFamily:'inherit',background:on?`${val.color}18`:T.bgCard,color:T.text}}>
              <div style={{fontSize:22,marginBottom:6}}>{key==='easy'?'🟢':key==='medium'?'🟡':'🔴'}</div>
              <div style={{fontWeight:800,fontSize:15,color:on?val.color:T.text}}>{val.label}</div>
              <div style={{color:T.textSub,fontSize:12,marginTop:6,lineHeight:1.4}}>{val.desc}</div>
            </button>
          );
        })}
      </div>
    </div>

    <div style={{background:T.bgCard,border:`1.5px solid ${T.border}`,borderRadius:16,padding:'20px 24px',display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
      <div style={{flex:1}}>
        <div style={{fontWeight:800,fontSize:17,marginBottom:6,color:T.text}}>Your Mock</div>
        <div style={{color:T.textSub,fontSize:14}}>
          <span style={{color:T.accent1,fontWeight:700}}>{cfg.total} questions</span>{' · '}
          <span style={{color:dv.color,fontWeight:700}}>{dv.label}</span>{' · '}
          <span style={{color:T.textMuted}}>{mins.reading}m R&W + {mins.math}m Math</span>
        </div>
      </div>
      <button onClick={()=>onStart(sel,diff)} style={{background:T.startBtn,border:'none',borderRadius:12,padding:'14px 28px',color:'#fff',fontWeight:800,fontSize:15,cursor:'pointer',fontFamily:'inherit'}}>Start Timed Mock →</button>
    </div>
  </div>);
}

function TimedSectionView({sectionLabel, questions, secondsTotal, onDone}){
  const T=useTheme();
  const [idx,setIdx]=useState(0);
  const [selected,setSelected]=useState(null);
  const [showExp,setShowExp]=useState(false);
  const [results,setResults]=useState([]);
  const [secsLeft,setSecsLeft]=useState(secondsTotal);
  // Ref always holds the latest results so timer/submit closures are never stale
  const resultsRef = useRef([]);
  const doneCalledRef = useRef(false);

  function safeDone(r){
    if(doneCalledRef.current) return;
    doneCalledRef.current = true;
    onDone(r);
  }

  useEffect(()=>{
    setSecsLeft(secondsTotal);
    doneCalledRef.current = false;
  },[secondsTotal]);

  useEffect(()=>{
    const t = setInterval(()=>setSecsLeft(s=>s-1), 1000);
    return ()=>clearInterval(t);
  },[]);

  useEffect(()=>{
    if(secsLeft<=0){
      safeDone(resultsRef.current);
    }
  },[secsLeft]);

  if(!questions||!questions.length) return(<div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:32}}><p style={{color:T.textSub}}>No questions available.</p></div>);

  const q=questions[idx];
  const isLast = idx===questions.length-1;
  const progress=((idx+1)/questions.length)*100;
  const sc = q.section==='math'?T.accent1:T.accent2;

  function choose(i){
    if(selected!==null) return;
    setSelected(i);
    setShowExp(true);
    const newEntry = {section:q.section,topic:q.topic,correct:i===q.answer};
    const updated = [...resultsRef.current, newEntry];
    resultsRef.current = updated;
    setResults(updated);
  }

  function next(){
    if(isLast){
      safeDone(resultsRef.current);
    } else {
      setIdx(i=>i+1);
      setSelected(null);
      setShowExp(false);
    }
  }

  return(
    <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:'32px 28px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12,flexWrap:'wrap',gap:10}}>
        <span style={{color:T.textSub,fontSize:12}}>{sectionLabel} · {q.topic}</span>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <span style={{color:T.textSub,fontSize:12}}>Time left</span>
          <span style={{color:secsLeft<=60?T.incorrect:sc,fontWeight:800,fontSize:14,fontVariantNumeric:'tabular-nums'}}>{fmtTime(secsLeft)}</span>
        </div>
      </div>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <span style={{color:sc,fontWeight:700,fontSize:13}}>{idx+1} / {questions.length}</span>
        <button onClick={()=>safeDone(resultsRef.current)} style={{background:'transparent',border:`1px solid ${T.border}`,borderRadius:10,padding:'8px 12px',cursor:'pointer',color:T.textSub,fontFamily:'inherit',fontWeight:700,fontSize:12}}>Submit section</button>
      </div>

      <div style={{height:4,background:T.bgInput,borderRadius:4,marginBottom:28}}>
        <div style={{height:4,width:`${progress}%`,background:sc,borderRadius:4,transition:'width 0.4s ease'}}/>
      </div>

      {(q.section==="reading" && q.passage) && (
      <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 16px",marginBottom:18,color:T.text,lineHeight:1.6,fontSize:14}}>
        {renderPassage(q, T)}
      </div>
    )}
    {q.fig&&<Figure fig={q.fig}/>}
      <p style={{fontSize:17,lineHeight:1.6,fontWeight:600,marginBottom:24,color:T.text}}>{q.q}</p>

      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20}}>
        {q.choices.map((c,i)=>{
          let bg=T.bgInput,border=T.border;
          if(selected!==null){
            if(i===q.answer){bg=T.correctBg;border=T.correctBdr;}
            else if(i===selected){bg=T.incorrectBg;border=T.incorrectBdr;}
          }
          return(
            <button key={i} onClick={()=>choose(i)} style={{display:'flex',alignItems:'center',padding:'14px 16px',borderRadius:10,fontSize:14,color:T.textChoice,textAlign:'left',fontFamily:'inherit',lineHeight:1.4,background:bg,border:`1.5px solid ${border}`,cursor:selected!==null?'default':'pointer'}}>
              <span style={{color:sc,fontWeight:700,marginRight:12,fontSize:13}}>{String.fromCharCode(65+i)}</span>{c}
            </button>
          );
        })}
      </div>

      {showExp&&(
        <div style={{background:T.bgInput,border:`1px solid ${T.border}`,borderRadius:10,padding:'14px 16px',fontSize:13,color:T.textExpl,lineHeight:1.6}}>
          <span style={{color:selected===q.answer?T.correct:T.incorrect,fontWeight:700,marginRight:8}}>{selected===q.answer?'✓ Correct!':'✗ Incorrect'}</span>
          {q.explanation}
        </div>
      )}

      {selected!==null&&(
        <button style={{padding:'12px 24px',borderRadius:10,border:'none',fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:'inherit',color:'#fff',background:sc,marginTop:16}} onClick={next}>
          {isLast?'Finish Section →':'Next Question →'}
        </button>
      )}
    </div>
  );
}

function MockRunner({mock,onBack,onDone}){
  const T=useTheme();
  const [secIdx,setSecIdx]=useState(0);
  const [showBreak,setShowBreak]=useState(false);
  // Ref accumulates results across sections without stale-closure issues
  const allResultsRef = useRef([]);

  // Reset accumulator whenever this MockRunner mounts (covers retries)
  useEffect(()=>{ allResultsRef.current = []; },[]);

  const sec = mock.sections[secIdx];
  const nextSec = mock.sections[secIdx+1];
  const secsTotal = (sec.minutes||1)*60;
  const totalSections = mock.sections.length;

  function finishSection(sectionResults){
    const merged = [...allResultsRef.current, ...sectionResults];
    allResultsRef.current = merged;

    if(secIdx === totalSections-1){
      onDone(merged);
    } else {
      // Show a break screen between sections instead of jumping directly
      setShowBreak(true);
    }
  }

  function startNextSection(){
    setShowBreak(false);
    setSecIdx(i=>i+1);
  }

  const isReading = sec.key === 'reading';
  const accentColor = isReading ? T.accent2 : T.accent1;

  const header = (
    <div style={{background:T.bgHero,border:`1px solid ${T.border}`,borderRadius:20,padding:'18px 22px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}>
      <div>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:3,color:accentColor,marginBottom:6}}>
          SECTION {secIdx+1} OF {totalSections}
        </div>
        <div style={{fontWeight:900,fontSize:18,color:T.text}}>{sec.label}</div>
        <div style={{color:T.textSub,fontSize:12,marginTop:3}}>
          {TEST_LENGTHS[mock.length].label} · {DIFFICULTY_LEVELS[mock.difficulty].label} · {sec.questions.length} questions · {sec.minutes} min
        </div>
      </div>
      <button onClick={onBack} style={{background:'transparent',border:`1px solid ${T.border}`,borderRadius:10,padding:'10px 12px',cursor:'pointer',color:T.textSub,fontFamily:'inherit',fontWeight:800,fontSize:12}}>Exit</button>
    </div>
  );

  // Between-section break screen
  if(showBreak && nextSec){
    return(
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        {header}
        <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:20,padding:'40px 28px',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:20}}>
          <div style={{fontSize:40}}>☕</div>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:3,color:T.accent1,textTransform:'uppercase'}}>Section Complete</div>
          <h2 style={{fontSize:26,fontWeight:900,color:T.text,margin:0}}>Great work on {sec.label}!</h2>
          <p style={{color:T.textSub,fontSize:14,margin:0,maxWidth:400,lineHeight:1.6}}>
            On the real SAT, you would now take a short break before the next section.<br/>
            When you're ready, begin <strong style={{color:T.accent1}}>{nextSec.label}</strong> — {nextSec.questions.length} questions in {nextSec.minutes} minutes.
          </p>
          <div style={{display:'flex',flexDirection:'column',gap:10,width:'100%',maxWidth:340}}>
            <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:14,padding:'14px 18px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{color:T.textSub,fontSize:13}}>Next section</span>
              <span style={{color:T.text,fontWeight:800}}>{nextSec.label}</span>
            </div>
            <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:14,padding:'14px 18px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{color:T.textSub,fontSize:13}}>Questions</span>
              <span style={{color:T.text,fontWeight:800}}>{nextSec.questions.length}</span>
            </div>
            <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:14,padding:'14px 18px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{color:T.textSub,fontSize:13}}>Time allowed</span>
              <span style={{color:T.text,fontWeight:800}}>{nextSec.minutes} min</span>
            </div>
          </div>
          <button
            onClick={startNextSection}
            style={{padding:'14px 36px',borderRadius:12,border:'none',fontWeight:800,fontSize:15,cursor:'pointer',fontFamily:'inherit',color:'#fff',background:T.accent1,marginTop:8}}
          >
            Start {nextSec.label} →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      {header}
      {/* key={secIdx} forces a full remount when section changes,
          resetting all internal state (idx, timer, results) cleanly */}
      <TimedSectionView
        key={secIdx}
        sectionLabel={sec.label}
        questions={sec.questions}
        secondsTotal={secsTotal}
        onDone={finishSection}
      />
    </div>
  );
}

function MockResultsView({mock,results,onBack,onRetry}){
  const T=useTheme();
  const bySec = { reading: [], math: [] };
  results.forEach(r=>{ if(bySec[r.section]) bySec[r.section].push(r); });

  const rC = bySec.reading.filter(x=>x.correct).length;
  const rT = bySec.reading.length;
  const mC = bySec.math.filter(x=>x.correct).length;
  const mT = bySec.math.length;

  const rP = pct(rC, rT);
  const mP = pct(mC, mT);
  const rS = scaledSectionScore(rP);
  const mS = scaledSectionScore(mP);
  const total = rS + mS;
  const pctile = compositePercentile(total);
  const rBand = scoreBand(rS);
  const mBand = scoreBand(mS);

  // Per-topic breakdown
  const byTopic = {};
  results.forEach(({section, topic, correct:c}) => {
    const k = section + '::' + topic;
    if(!byTopic[k]) byTopic[k] = {section, topic, correct:0, total:0};
    byTopic[k].total++;
    if(c) byTopic[k].correct++;
  });

  // Score bar color
  const scoreColor = total >= 1200 ? T.correct : total >= 900 ? '#f7c44f' : T.incorrect;

  // Ring gauge for composite
  const maxScore = 1600, minScore = 400;
  const pctFill = clamp((total - minScore) / (maxScore - minScore) * 100, 0, 100);
  const ringSize = 160, ringStroke = 12;
  const radius = (ringSize - ringStroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - pctFill / 100);

  const lengthLabel = mock?.length ? (mock.length.charAt(0).toUpperCase() + mock.length.slice(1)) + ' Test' : 'Mock Test';

  return(
    <div style={{display:'flex',flexDirection:'column',gap:20}}>

      {/* ── Header composite score ── */}
      <div style={{textAlign:'center',background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:20,padding:'28px 20px 22px'}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:3,color:T.accent1,marginBottom:16,textTransform:'uppercase'}}>SAT Score Report · {lengthLabel}</div>

        {/* Ring gauge */}
        <div style={{position:'relative',display:'inline-flex',alignItems:'center',justifyContent:'center',marginBottom:16}}>
          <svg width={ringSize} height={ringSize}>
            <circle cx={ringSize/2} cy={ringSize/2} r={radius} fill="none" stroke={T.bgInput} strokeWidth={ringStroke}/>
            <circle cx={ringSize/2} cy={ringSize/2} r={radius} fill="none" stroke={scoreColor}
              strokeWidth={ringStroke} strokeDasharray={circ} strokeDashoffset={offset}
              strokeLinecap="round" transform={`rotate(-90 ${ringSize/2} ${ringSize/2})`}
              style={{transition:'stroke-dashoffset 0.8s ease'}}/>
          </svg>
          <div style={{position:'absolute',display:'flex',flexDirection:'column',alignItems:'center'}}>
            <div style={{fontSize:36,fontWeight:900,color:T.text,lineHeight:1}}>{total}</div>
            <div style={{fontSize:11,color:T.textMuted,marginTop:2}}>/ 1600</div>
          </div>
        </div>

        <div style={{fontSize:13,color:T.textSub,marginBottom:4}}>
          Approx. <strong style={{color:T.text}}>{pctile}th percentile</strong> nationally
        </div>
        <div style={{fontSize:12,color:T.textMuted}}>
          R&amp;W <strong style={{color:T.accent2}}>{rS}</strong> &nbsp;+&nbsp; Math <strong style={{color:T.accent1}}>{mS}</strong>
        </div>
      </div>

      {/* ── Section score cards ── */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:14}}>
        {[
          {label:'Reading & Writing', correct:rC, total:rT, pct:rP, score:rS, band:rBand, color:T.accent2},
          {label:'Math',              correct:mC, total:mT, pct:mP, score:mS, band:mBand, color:T.accent1},
        ].map(({label,correct,total:tot,pct:p,score,band,color})=>{
          const barPct = clamp((score-200)/600*100, 0, 100);
          return(
            <div key={label} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:20}}>
              <div style={{fontWeight:800,fontSize:13,color:T.text,marginBottom:4}}>{label}</div>
              <div style={{fontSize:28,fontWeight:900,color:color,lineHeight:1,marginBottom:2}}>{score}</div>
              <div style={{fontSize:11,color:T.textMuted,marginBottom:10}}>200–800 &nbsp;·&nbsp; {band}</div>
              {/* mini score bar */}
              <div style={{height:5,background:T.bgInput,borderRadius:4,marginBottom:8,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${barPct}%`,background:color,borderRadius:4,transition:'width 0.6s ease'}}/>
              </div>
              <div style={{fontSize:12,color:T.textSub}}>{correct}/{tot} correct &nbsp;({p}%)</div>
            </div>
          );
        })}
      </div>

      {/* ── Per-topic performance ── */}
      <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:20}}>
        <div style={{fontWeight:700,fontSize:12,color:T.textSub,letterSpacing:1,textTransform:'uppercase',marginBottom:14}}>📊 Performance by Topic</div>
        <div style={{display:'flex',flexDirection:'column',gap:9}}>
          {Object.values(byTopic).map(({section,topic,correct:c,total:t})=>{
            const tp = pct(c,t);
            const bc = tp>=75 ? T.correct : tp>=50 ? '#f7c44f' : T.incorrect;
            return(
              <div key={section+topic} style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:150,flexShrink:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:T.text,lineHeight:1.3}}>{topic}</div>
                  <div style={{fontSize:10,color:T.textMuted}}>{SECTIONS[section]?.label}</div>
                </div>
                <div style={{flex:1,height:5,background:T.bgInput,borderRadius:4,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${tp}%`,background:bc,borderRadius:4,transition:'width 0.5s ease'}}/>
                </div>
                <span style={{color:bc,fontWeight:700,fontSize:12,minWidth:36,textAlign:'right'}}>{tp}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Score interpretation guide ── */}
      <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:20}}>
        <div style={{fontWeight:700,fontSize:12,color:T.textSub,letterSpacing:1,textTransform:'uppercase',marginBottom:12}}>Score Guide (per section)</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:8}}>
          {[
            {range:'750–800', label:'Outstanding', color:'#4ade80'},
            {range:'650–740', label:'Strong',      color:'#86efac'},
            {range:'550–640', label:'Proficient',  color:'#fde047'},
            {range:'450–540', label:'Developing',  color:'#fb923c'},
            {range:'350–440', label:'Needs Work',  color:'#f87171'},
            {range:'200–340', label:'Beginning',   color:'#ef4444'},
          ].map(({range,label,color})=>(
            <div key={label} style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:10,height:10,borderRadius:'50%',background:color,flexShrink:0}}/>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:T.text}}>{label}</div>
                <div style={{fontSize:10,color:T.textMuted}}>{range}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:14,fontSize:11,color:T.textMuted,lineHeight:1.5}}>
          Scores are estimated using a simulated SAT curve. Section scores range 200–800; composite is their sum (400–1600). Real SAT scores may vary based on equating.
        </div>
      </div>

      <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
        <button style={{padding:'12px 24px',borderRadius:10,border:'none',fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:'inherit',color:'#fff',background:T.accent1}} onClick={onRetry}>Try Another Mock</button>
        <button style={{padding:'12px 24px',borderRadius:10,border:`1.5px solid ${T.border}`,fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:'inherit',color:T.text,background:T.bgInput}} onClick={onBack}>Dashboard</button>
      </div>
    </div>
  );
}
// ─── QUIZ VIEW ────────────────────────────────────────────────────────────────
function QuizView({questions,onDone,onExit,headerLabel}){
  const T=useTheme();
  const [idx,setIdx]=useState(0);
  const [selected,setSelected]=useState(null);
  const [showExp,setShowExp]=useState(false);
  const [results,setResults]=useState([]);
  // Ref keeps results in sync so onDone never receives stale state
  // Must be declared BEFORE any early returns to satisfy Rules of Hooks
  const resultsRef = useRef([]);
  // Early return guard — all hooks must be above this line
  if(!questions||!questions.length) return(<div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:32}}><p style={{color:T.textSub}}>No questions available.</p></div>);
  const q=questions[idx],isLast=idx===questions.length-1;
  const progress=((idx+1)/questions.length)*100;
  const sc=idx%2===0?T.accent1:T.accent2;
  function choose(i){
    if(selected!==null)return;
    setSelected(i);setShowExp(true);
    const updated=[...resultsRef.current,{section:q.section,topic:q.topic,correct:i===q.answer}];
    resultsRef.current=updated;
    setResults(updated);
  }
  function next(){
    if(isLast){onDone(resultsRef.current);}else{setIdx(i=>i+1);setSelected(null);setShowExp(false);}
  }
  function requestExit(){
    if(!onExit) return;
    const ok = confirm("Exit this test and return to the dashboard? Your partial progress will NOT be saved.");
    if(ok) onExit();
  }
  return(<div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden"}}>
    {onExit && (
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:T.bgAlt,borderBottom:`1px solid ${T.border}`}}>
        <button onClick={requestExit} style={{background:"transparent",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:800,color:T.textSub}}>
          🏠 Dashboard
        </button>
        <div style={{fontSize:12,fontWeight:800,color:T.textMuted,letterSpacing:1,textTransform:"uppercase"}}>
          {headerLabel || "Test"}
        </div>
        <button onClick={requestExit} style={{background:"transparent",border:`1px solid ${T.border}` ,borderRadius:10,padding:"6px 10px",cursor:"pointer",fontFamily:"inherit",fontWeight:800,color:T.text}}>
          ❌ Exit
        </button>
      </div>
    )}
    <div style={{padding:"32px 28px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <span style={{color:T.textSub,fontSize:12}}>{SECTIONS[q.section]?.label} › {q.topic}</span>
      <span style={{color:sc,fontWeight:700,fontSize:13}}>{idx+1} / {questions.length}</span>
    </div>
    <div style={{height:4,background:T.bgInput,borderRadius:4,marginBottom:28}}>
      <div style={{height:4,width:`${progress}%`,background:sc,borderRadius:4,transition:"width 0.4s ease"}}/>
    </div>
    {(q.section==="reading" && q.passage) && (
      <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 16px",marginBottom:18,color:T.text,lineHeight:1.6,fontSize:14}}>
        {renderPassage(q, T)}
      </div>
    )}
    {q.fig&&<Figure fig={q.fig}/>}
    <p style={{fontSize:17,lineHeight:1.6,fontWeight:600,marginBottom:24,color:T.text}}>{q.q}</p>
    <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
      {q.choices.map((c,i)=>{
        let bg=T.bgInput,border=T.border;
        if(selected!==null){
          if(i===q.answer){bg=T.correctBg;border=T.correctBdr;}
          else if(i===selected){bg=T.incorrectBg;border=T.incorrectBdr;}
        }
        return(<button key={i} onClick={()=>choose(i)} style={{display:"flex",alignItems:"center",padding:"14px 16px",borderRadius:10,fontSize:14,color:T.textChoice,textAlign:"left",fontFamily:"inherit",lineHeight:1.4,background:bg,border:`1.5px solid ${border}`,cursor:selected!==null?"default":"pointer"}}>
          <span style={{color:sc,fontWeight:700,marginRight:12,fontSize:13}}>{String.fromCharCode(65+i)}</span>{c}
        </button>);
      })}
    </div>
    {showExp&&(<div style={{background:T.bgInput,border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 16px",fontSize:13,color:T.textExpl,lineHeight:1.6}}>
      <span style={{color:selected===q.answer?T.correct:T.incorrect,fontWeight:700,marginRight:8}}>{selected===q.answer?"✓ Correct!":"✗ Incorrect"}</span>
      {q.explanation}
    </div>)}
    {selected!==null&&(<button style={{padding:"12px 24px",borderRadius:10,border:"none",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",color:"#fff",background:sc,marginTop:16}} onClick={next}>
      {isLast?"Finish Test →":"Next Question →"}
    </button>)}
    </div>
  </div>);
}

function TopicQuizView({section,topic,difficulty,onDone,onExit}){
  const pool=(BANK[section]?.[topic]?.[difficulty]??[]).sort(()=>Math.random()-0.5);
  return <QuizView questions={pool.map(q=>({...q,section,topic}))} onDone={onDone} onExit={onExit} headerLabel={`${topic} · ${DIFFICULTY_LEVELS[difficulty]?.label ?? difficulty}`}/>;
}

// ─── RESULTS ──────────────────────────────────────────────────────────────────
function ResultsView({results,length,difficulty,onBack,onRetry}){
  const T=useTheme();
  const correct=results.filter(r=>r.correct).length,total=results.length,p=pct(correct,total);
  const dv=DIFFICULTY_LEVELS[difficulty];
  const grade=p>=80?"Excellent!":p>=60?"Good work!":"Keep practicing!";
  const ring=p>=75?T.correct:p>=50?"#f7c44f":T.incorrect;
  const bd={};
  results.forEach(({section,topic,correct:c})=>{
    const k=`${section}::${topic}`;if(!bd[k])bd[k]={section,topic,correct:0,total:0};
    bd[k].total++;if(c)bd[k].correct++;
  });
  return(<div style={{display:"flex",flexDirection:"column",gap:20}}>
    <div style={{textAlign:"center",marginBottom:16}}>
      <div style={{position:"relative",display:"inline-flex",marginBottom:16}}>
        <RadialProgress value={p} size={130} stroke={10} color={ring}/>
        <div style={{position:"absolute",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <div style={{fontSize:28,fontWeight:800,color:T.text}}>{p}%</div>
        </div>
      </div>
      <h2 style={{fontSize:26,fontWeight:800,marginBottom:8,color:T.text}}>{grade}</h2>
      <p style={{color:T.textSub}}>{TEST_LENGTHS[length].label} · <span style={{color:dv.color}}>{dv.label}</span></p>
      <p style={{color:T.text,fontSize:18,fontWeight:700,marginTop:8}}>{correct} / {total} correct</p>
    </div>
    <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:24}}>
      <div style={{fontWeight:700,fontSize:13,color:T.textSub,letterSpacing:1,textTransform:"uppercase",marginBottom:16}}>📊 Performance by Topic</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {Object.values(bd).map(({section,topic,correct:c,total:t})=>{
          const tp=pct(c,t),bc=tp>=75?T.correct:tp>=50?"#f7c44f":T.incorrect;
          return(<div key={`${section}${topic}`} style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:160,flexShrink:0}}>
              <div style={{fontSize:13,fontWeight:600,color:T.text}}>{topic}</div>
              <div style={{fontSize:11,color:T.textSub}}>{SECTIONS[section].label}</div>
            </div>
            <div style={{flex:1,height:6,background:T.bgInput,borderRadius:4,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${tp}%`,background:bc,borderRadius:4,transition:"width 0.5s ease"}}/>
            </div>
            <span style={{color:bc,fontWeight:700,fontSize:13,minWidth:40}}>{tp}%</span>
          </div>);
        })}
      </div>
    </div>
    <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
      <button style={{padding:"12px 24px",borderRadius:10,border:"none",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",color:"#fff",background:T.accent1}} onClick={onRetry}>Try Again</button>
      <button style={{padding:"12px 24px",borderRadius:10,border:`1.5px solid ${T.border}`,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",color:T.text,background:T.bgInput}} onClick={onBack}>Dashboard</button>
    </div>
  </div>);
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({progress,onStartTopic,onPracticeTest,onMockTest, bankIssues=[], auditEnabled=false, onExportMatrix, onExportIssues}){
  const T=useTheme();
  const all=Object.values(progress).flatMap(s=>Object.values(s).flatMap(t=>Object.values(t)));
  const tC=all.reduce((a,s)=>a+s.c,0),tT=all.reduce((a,s)=>a+s.t,0),op=pct(tC,tT);
  const weak=[];
  Object.keys(SECTIONS).forEach(sec=>SECTIONS[sec].topics.forEach(topic=>{
    const s=progress[sec]?.[topic];if(!s)return;
    const vals=Object.values(s),tot=vals.reduce((a,x)=>a+x.t,0),cor=vals.reduce((a,x)=>a+x.c,0);
    if(tot>0&&pct(cor,tot)<60)weak.push(topic);
  }));
  return(<div style={{display:"flex",flexDirection:"column",gap:20}}>
    {(bankIssues?.length>0) && (
      <div style={{padding:"10px 12px",borderRadius:12,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,180,0,0.12)"}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap"}}>
          <div>
            <div style={{fontWeight:800}}>Question bank checks: {bankIssues.length} issue{bankIssues.length===1?"":"s"}</div>
            <div style={{opacity:0.9,fontSize:13}}>Tip: add <b>?audit=1</b> to the URL to export a full question matrix CSV.</div>
          </div>
          <div style={{display:"flex",gap:10}}>
            {auditEnabled && (
              <button onClick={onExportMatrix} style={{padding:"8px 10px",borderRadius:10,border:"1px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.06)",color:"white",cursor:"pointer"}}>
                📄 Export Matrix (CSV)
              </button>
            )}
            <button onClick={onExportIssues} style={{padding:"8px 10px",borderRadius:10,border:"1px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.06)",color:"white",cursor:"pointer"}}>
              ⚠️ Export Issues (JSON)
            </button>
          </div>
        </div>
      </div>
    )}

    <div style={{background:T.bgHero,border:`1px solid ${T.border}`,borderRadius:20,padding:"32px 28px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{flex:1}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:3,color:T.accent1,marginBottom:8}}>SAT PREP</div>
        <h1 style={{fontSize:28,fontWeight:800,margin:"0 0 8px",lineHeight:1.1,color:T.text}}>Study Dashboard</h1>
        <p style={{color:T.textSub,fontSize:13,margin:"0 0 16px"}}>Track progress · Identify gaps · Ace the test</p>
        <button onClick={onPracticeTest} style={{background:T.accent1Bg,border:`1.5px solid ${T.accent1}`,borderRadius:10,padding:"10px 18px",color:T.accent1Soft,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>📋 Untimed Test</button>
        <button onClick={onMockTest} style={{background:'transparent',border:`1.5px solid ${T.border}`,borderRadius:10,padding:'10px 18px',color:T.text,fontWeight:800,fontSize:13,cursor:'pointer',fontFamily:'inherit',marginLeft:10}}>⏱️ Timed Test</button>
      </div>
      <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <RadialProgress value={op} size={110} stroke={9}/>
        <div style={{position:"absolute",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <div style={{fontSize:22,fontWeight:800,color:T.text}}>{op}%</div>
          <div style={{fontSize:10,color:T.textSub}}>Overall</div>
        </div>
      </div>
    </div>
    {weak.length>0&&(<div style={{background:T.bgAlert,border:`1px solid ${T.borderAlert}`,borderRadius:12,padding:"14px 18px",display:"flex",alignItems:"flex-start",gap:4}}>
      <span style={{fontSize:16,marginRight:10}}>⚠</span>
      <div>
        <div style={{fontWeight:700,marginBottom:4,color:"#f7c44f"}}>Areas needing attention</div>
        <div style={{color:T.textChoice,fontSize:13}}>{weak.join(" · ")}</div>
      </div>
    </div>)}
    {[["math",T.accent1],["reading",T.accent2]].map(([secKey,sc])=>(
      <div key={secKey} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:"24px 22px"}}>
        <div style={{display:"flex",alignItems:"center",marginBottom:18}}>
          <span style={{fontSize:22,marginRight:10,color:sc}}>{SECTIONS[secKey].icon}</span>
          <span style={{fontWeight:700,fontSize:17,color:T.text}}>{SECTIONS[secKey].label}</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {SECTIONS[secKey].topics.map(topic=>{
            const s=progress[secKey]?.[topic]??{easy:{c:0,t:0},medium:{c:0,t:0},hard:{c:0,t:0}};
            const tots=Object.values(s).reduce((a,x)=>({c:a.c+x.c,t:a.t+x.t}),{c:0,t:0});
            const tp=pct(tots.c,tots.t),bc=tp>=75?T.correct:tp>=50?"#f7c44f":tp>0?T.incorrect:T.border;
            return(<div key={topic}>
              <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                <div style={{width:180,flexShrink:0}}>
                  <div style={{fontWeight:600,fontSize:14,color:T.text}}>{topic}</div>
                  <div style={{color:T.textSub,fontSize:12}}>{tots.t===0?"Not started":`${tots.c}/${tots.t} (${tp}%)`}</div>
                </div>
                <div style={{flex:1,height:6,background:T.bgInput,borderRadius:4,overflow:"hidden",minWidth:60}}>
                  <div style={{height:"100%",width:`${tp}%`,background:bc,borderRadius:4,transition:"width 0.5s ease"}}/>
                </div>
              </div>
              <div style={{display:"flex",gap:8,marginTop:8,marginLeft:192,flexWrap:"wrap"}}>
                {Object.entries(DIFFICULTY_LEVELS).map(([diff,dv])=>{
                  const ds=s[diff]??{c:0,t:0};
                  return(<button key={diff} onClick={()=>onStartTopic(secKey,topic,diff)} style={{background:"transparent",border:`1.5px solid ${dv.color}`,borderRadius:8,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",color:dv.color}}>
                    {dv.label}{ds.t>0?` (${pct(ds.c,ds.t)}%)`:""}
                  </button>);
                })}
              </div>
            </div>);
          })}
        </div>
      </div>
    ))}
    <div style={{color:T.textMuted,fontSize:12,textAlign:"center",paddingBottom:8}}>Questions answered: {tT} · Correct: {tC}</div>
  </div>);
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App(){

  // Bank audit & reload trigger (BANK is module-scoped for minimal invasive changes)
  const [bankVersion, setBankVersion] = useState(0);
  const [bankIssues, setBankIssues] = useState([]);
  const [bankMatrix, setBankMatrix] = useState([]);

  // Enable audit tools with ?audit=1 in URL
  const auditEnabled = (() => {
    try { return new URLSearchParams(window.location.search).has("audit"); }
    catch { return false; }
  })();

  const exportQuestionMatrixCSV = () => {
    if(!bankMatrix || bankMatrix.length===0){
      alert("No matrix available. Ensure /public/questions.json is present and reload.");
      return;
    }
    downloadText("question_matrix.csv", toCSV(bankMatrix), "text/csv");
  };

  const exportBankIssuesJSON = () => {
    downloadText("question_bank_issues.json", JSON.stringify(bankIssues, null, 2), "application/json");
  };

  useEffect(() => {
    (async () => {
      try {
        const { bank, issues, matrix } = await loadBankFromLocal();
        // Keep your existing expansion logic OFF by default to avoid accidental repeats.
        BANK = bank;
        setBankIssues(issues);
        setBankMatrix(matrix);
        setBankVersion(v => v + 1);
      } catch (e) {
        // Fallback to built-in bank if JSON not present
        try {
          const fallback = expandBank(BASE_QB);
          BANK = fallback;
          const { issues, matrix } = buildBankFromQuestionList([]); // no external list => no matrix
          setBankIssues([{level:"warn", code:"using_embedded_bank", detail:String(e)}]);
          setBankMatrix(matrix);
          setBankVersion(v => v + 1);
        } catch {
          setBankIssues([{level:"error", code:"bank_load_failed", detail:String(e)}]);
        }
      }
    })();
  }, []);

  const [themeKey,setThemeKey]=useState(loadThemeKey);
  const [progress,setProgress]=useState(loadProg);
  const [view,setView]=useState("dashboard");
  const [active,setActive]=useState({});
  const [lastResults,setLastResults]=useState(null);
  const T=THEMES[themeKey]??THEMES.midnight;
  useEffect(()=>saveProg(progress),[progress]);
  useEffect(()=>saveThemeKey(themeKey),[themeKey]);
  function updProg(results){
    setProgress(prev=>{
      const next=JSON.parse(JSON.stringify(prev));
      results.forEach(({section,topic,correct})=>{
        if(!next[section]?.[topic])return;
        const diff=active.difficulty??"medium";
        if(!next[section][topic][diff])next[section][topic][diff]={c:0,t:0};
        next[section][topic][diff].t++;if(correct)next[section][topic][diff].c++;
      });
      return next;
    });
  }
  function finish(results){updProg(results);setLastResults(results);setView("results");}
  function finishMock(results){
    // For now we only store results; mock scoring is computed in MockResultsView
    setLastResults({mode:"mock", results, mock: active.mock});
    setView("mockResults");
  }
  return(
    <ThemeCtx.Provider value={T}>
      <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'DM Sans',system-ui,sans-serif",padding:"12px 16px 48px"}}>
        {/* Top bar */}
        <div style={{maxWidth:700,margin:"0 auto",display:"flex",justifyContent:"flex-end",marginBottom:12}}>
          <ThemePicker current={themeKey} onChange={setThemeKey}/>
        </div>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          {view==="dashboard"&&(<>
            <Dashboard progress={progress}
              onStartTopic={(sec,topic,diff)=>{setActive({section:sec,topic,difficulty:diff,mode:"topic"});setView("quiz");}}
              onPracticeTest={()=>setView("practiceTest")}
              onMockTest={()=>setView("mockSetup")}
              bankIssues={bankIssues}
              auditEnabled={auditEnabled}
              onExportMatrix={exportQuestionMatrixCSV}
              onExportIssues={exportBankIssuesJSON} />
            <button style={{padding:"10px 20px",borderRadius:10,border:`1px solid ${T.border}`,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit",color:T.textMuted,background:"transparent",margin:"0 auto",display:"block",marginTop:8}}
              onClick={()=>{if(confirm("Reset all progress?")){setProgress(makeEmpty());localStorage.removeItem("sat_p4");}}}>
              Reset All Progress
            </button>
          </>)}
          {view==="practiceTest"&&(
            <PracticeTestPage
              onBack={()=>setView("dashboard")}
              onStart={(length,diff)=>{const qs=getPracticeQs(length,diff);setActive({mode:"practice",length,difficulty:diff,questions:qs});setView("quiz");}}/>
          )}
          {view==="mockSetup"&&(
            <MockTestPage
              onBack={()=>setView("dashboard")}
              onStart={(length,diff)=>{const mock=getMockTest(length,diff);setActive({mode:"mock",length,difficulty:diff,mock});setView("mock");}}/>
          )}

          {view==="quiz"&&active.mode==="topic"&&(
            <TopicQuizView
              section={active.section}
              topic={active.topic}
              difficulty={active.difficulty}
              onDone={finish}
              onExit={()=>{setActive({});setView("dashboard");}}
            />
          )}
          {view==="quiz"&&active.mode==="practice"&&(
            <QuizView
              questions={active.questions}
              onDone={finish}
              onExit={()=>{setActive({});setView("dashboard");}}
              headerLabel={`Untimed Test · ${TEST_LENGTHS[active.length]?.label ?? ""} · ${DIFFICULTY_LEVELS[active.difficulty]?.label ?? ""}`}
            />
          )}
          {view==="mock"&&active.mode==="mock"&&(
            <MockRunner mock={active.mock} onBack={()=>setView("dashboard")} onDone={finishMock}/>
          )}

          {view==="results"&&lastResults&&(
            <ResultsView
              results={lastResults}
              length={active.length??"quarter"}
              difficulty={active.difficulty??"medium"}
              onBack={()=>setView("dashboard")}
              onRetry={()=>{if(active.mode==="practice"){const qs=getPracticeQs(active.length,active.difficulty);setActive({...active,questions:qs});}setView("quiz");}}/>
          )}
          {view==="mockResults"&&lastResults?.mode==="mock"&&(
            <MockResultsView
              mock={lastResults.mock}
              results={lastResults.results}
              onBack={()=>setView("dashboard")}
              onRetry={()=>{const mock=getMockTest(active.length??"full", active.difficulty??"medium");setActive({mode:"mock",length:active.length??"full",difficulty:active.difficulty??"medium",mock});setView("mock");}}/>
          )}
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}
