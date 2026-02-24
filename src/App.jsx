import { useState, useEffect, createContext, useContext } from "react";
import {
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

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
  full:    { label:"Full SAT",    total:98, rw:54, math:44, time:"2h 14min" },
  half:    { label:"Half Length", total:49, rw:27, math:22, time:"~67min"   },
  quarter: { label:"Quarter",     total:25, rw:14, math:11, time:"~34min"   },
};
const DIFFICULTY_LEVELS = {
  easy:   { label:"Easy",   color:"#2ecc71", desc:"Build confidence with foundational questions" },
  medium: { label:"Medium", color:"#f7c44f", desc:"Core difficulty — closest to the real SAT"  },
  hard:   { label:"Hard",   color:"#e74c3c", desc:"Challenge yourself with advanced questions"  },
};
const SECTIONS = {
  math:    { label:"Math",              icon:"∑", topics:["Algebra","Geometry","Data Analysis","Advanced Math","Problem Solving"] },
  reading: { label:"Reading & Writing", icon:"✦", topics:["Main Idea","Vocabulary in Context","Evidence","Grammar","Rhetorical Skills"] },
};

// ─── FIGURE COMPONENTS ────────────────────────────────────────────────────────
function SVGFigure({ type, params }) {
  const T = useTheme();
  const W=280, H=200;
  const base={ background:T.svgBg, border:`1px solid ${T.border}`, borderRadius:10, padding:12, margin:"0 auto 20px", display:"block" };
  if (type==="right_triangle") {
    const {a=3,b=4,c=5}=params;
    return (<svg width={W} height={H} style={base}>
      <polygon points="40,160 200,160 200,40" fill={T.svgFill} stroke={T.svgStroke} strokeWidth="2"/>
      <rect x="188" y="148" width="12" height="12" fill="none" stroke={T.svgStroke} strokeWidth="1.5"/>
      <text x="120" y="178" fill={T.svgLabel} fontSize="14" textAnchor="middle">{a}</text>
      <text x="215" y="105" fill={T.svgLabel} fontSize="14">{b}</text>
      <text x="105" y="90"  fill={T.correct}  fontSize="14">{c} ?</text>
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
    const {points=[],lineEq}=params;
    return (<svg width={W} height={H} style={base}>
      <line x1="20" y1="100" x2="260" y2="100" stroke={T.svgAxis} strokeWidth="1.5"/>
      <line x1="140" y1="10" x2="140" y2="190" stroke={T.svgAxis} strokeWidth="1.5"/>
      {[-4,-3,-2,-1,1,2,3,4].map(i=>(<g key={i}>
        <line x1={140+i*25} y1="10" x2={140+i*25} y2="190" stroke={T.svgGrid} strokeWidth="1"/>
        <line x1="20" y1={100+i*22} x2="260" y2={100+i*22} stroke={T.svgGrid} strokeWidth="1"/>
        <text x={140+i*25-3} y="112" fill={T.svgAxisLabel} fontSize="9">{i}</text>
      </g>))}
      {lineEq&&(()=>{ const x1v=-4,x2v=4,y1v=lineEq(x1v),y2v=lineEq(x2v);
        return <line x1={140+x1v*25} y1={100-y1v*22} x2={140+x2v*25} y2={100-y2v*22} stroke={T.svgArc} strokeWidth="2.5"/>;
      })()}
      {points.map(([px,py],i)=>(<circle key={i} cx={140+px*25} cy={100-py*22} r="5" fill={T.svgStroke} stroke={T.svgBg} strokeWidth="2"/>))}
      <text x="255" y="96"  fill={T.svgAxisLabel} fontSize="11">x</text>
      <text x="143" y="16"  fill={T.svgAxisLabel} fontSize="11">y</text>
    </svg>);
  }
  if (type==="cylinder") {
    return (<svg width={W} height={H} style={base}>
      <ellipse cx="140" cy="55"  rx="60" ry="18" fill={T.svgFill}    stroke={T.svgStroke} strokeWidth="2"/>
      <rect x="80" y="55" width="120" height="100" fill={T.svgFill} stroke="none"/>
      <line x1="80"  y1="55" x2="80"  y2="155" stroke={T.svgStroke} strokeWidth="2"/>
      <line x1="200" y1="55" x2="200" y2="155" stroke={T.svgStroke} strokeWidth="2"/>
      <ellipse cx="140" cy="155" rx="60" ry="18" fill={T.svgCylBtm} stroke={T.svgStroke} strokeWidth="2"/>
      <text x="210" y="110" fill={T.svgLabel} fontSize="13">h=10</text>
      <text x="140" y="48"  fill={T.svgLabel} fontSize="13" textAnchor="middle">r=3</text>
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
// v4.2: Expanded question bank (≈45 per topic: 15 easy / 15 medium / 15 hard)
// Notes:
// • Deterministic (seeded) generation so questions are stable across refreshes
// • Questions are ONLY recorded to progress when a test is finished (handled elsewhere)

function makeRng(seed=1234567){
  let s = seed >>> 0;
  return () => {
    // LCG (deterministic)
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
function randint(rng, a, b){ return Math.floor(rng()*(b-a+1))+a; }
function shuffleInPlace(rng, arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(rng()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}
function mcqFromCorrect(rng, correct, makeDistractor){
  const vals = new Set([correct]);
  while(vals.size<4) vals.add(makeDistractor());
  const choices = Array.from(vals);
  shuffleInPlace(rng, choices);
  return { choices: choices.map(String), answer: choices.indexOf(correct) };
}

// ---- Math generators ---------------------------------------------------------
function genAlgebraEasy(rng, n=15){
  const out=[];
  for(let i=0;i<n;i++){
    const a = randint(rng,1,6);
    const x = randint(rng,1,12);
    const b = randint(rng,-10,10);
    const c = a*x + b;
    const base = mcqFromCorrect(rng, x, ()=> x + randint(rng,-3,3) || x+1);
    out.push({
      q:`If ${a}x ${b>=0?"+":"−"} ${Math.abs(b)} = ${c}, what is x?`,
      choices: base.choices,
      answer: base.answer,
      explanation:`Solve: ${a}x = ${c} ${b>=0?"−":"+"} ${Math.abs(b)} = ${a*x}. So x = ${a*x}/${a} = ${x}.`,
    });
  }
  return out;
}
function genAlgebraMedium(rng, n=15){
  const out=[];
  for(let i=0;i<n;i++){
    const k = randint(rng,2,7);
    const m = randint(rng,-6,9);
    const p = randint(rng,2,7);
    const q = randint(rng,-6,9);
    const n0 = randint(rng,-12,12);
    // Expression: k(x+m) + n0 − p(x+q)
    const coeff = k - p;
    const constant = k*m + n0 - p*q;
    const correct = `${coeff===1?"":coeff===-1?"-":coeff}x ${constant>=0?"+":"−"} ${Math.abs(constant)}`.replace("1x","x").replace("-1x","-x");
    const distractors = [
      `${(k+p)}x ${constant>=0?"+":"−"} ${Math.abs(constant)}`,
      `${coeff}x ${(-constant)>=0?"+":"−"} ${Math.abs(-constant)}`,
      `${coeff}x ${ (k*m - n0 - p*q)>=0?"+":"−"} ${Math.abs(k*m - n0 - p*q)}`
    ].map(s=>s.replace("1x","x").replace("-1x","-x"));
    const choices=[correct,...distractors];
    shuffleInPlace(rng, choices);
    out.push({
      q:`Which expression is equivalent to ${k}(x ${m>=0?"+":"−"} ${Math.abs(m)}) ${n0>=0?"+":"−"} ${Math.abs(n0)} − ${p}(x ${q>=0?"+":"−"} ${Math.abs(q)})?`,
      choices,
      answer: choices.indexOf(correct),
      explanation:`Distribute: ${k}x + ${k*m} ${n0>=0?"+":"−"} ${Math.abs(n0)} − ${p}x ${p*q>=0?"−":"+"} ${Math.abs(p*q)} = (${k}−${p})x + (${k*m} ${n0>=0?"+":"−"} ${Math.abs(n0)} ${p*q>=0?"−":"+"} ${Math.abs(p*q)}).`,
    });
  }
  return out;
}
function genAlgebraHard(rng, n=15){
  const out=[];
  for(let i=0;i<n;i++){
    // Two-equation system with integer solution
    const x = randint(rng,1,10);
    const y = randint(rng,1,10);
    const a1 = randint(rng,1,6), b1 = randint(rng,1,6);
    const a2 = randint(rng,1,6), b2 = randint(rng,1,6);
    const c1 = a1*x + b1*y;
    const c2 = a2*x + b2*y;
    const base = mcqFromCorrect(rng, x, ()=> x + randint(rng,-3,3) || x+2);
    out.push({
      q:`If ${a1}x + ${b1}y = ${c1} and ${a2}x + ${b2}y = ${c2}, what is x?`,
      choices: base.choices,
      answer: base.answer,
      explanation:`The system has solution (x,y)=(${x},${y}). You can solve by elimination or substitution to find x=${x}.`,
    });
  }
  return out;
}

function genGeometryEasy(rng,n=15){
  const out=[];
  for(let i=0;i<n;i++){
    const w=randint(rng,2,20), h=randint(rng,2,20);
    const correct=w*h;
    const base=mcqFromCorrect(rng, correct, ()=> correct + randint(rng,-20,20) || correct+5);
    out.push({
      q:`A rectangle has width ${w} and height ${h}. What is its area?`,
      choices: base.choices,
      answer: base.answer,
      explanation:`Area = width × height = ${w}×${h} = ${correct}.`,
    });
  }
  return out;
}
function genGeometryMedium(rng,n=15){
  const out=[];
  for(let i=0;i<n;i++){
    const r=randint(rng,2,12);
    const correct = 2*r*Math.PI;
    // keep as exact form 2πr
    const corrStr = `${2*r===1?"":2*r}π`.replace("1π","π")+` (${r})?`.includes("?")?"":""; // unused
    const correctExact = `${2*r}π`.replace("1π","π");
    const distractors=[`${r}π`,`${2*r*r}π`,`${4*r}π`].map(s=>s.replace("1π","π"));
    const choices=[correctExact,...distractors];
    shuffleInPlace(rng, choices);
    out.push({
      q:`A circle has radius ${r}. What is the circumference in terms of π?`,
      choices,
      answer: choices.indexOf(correctExact),
      explanation:`Circumference = 2πr = 2π(${r}) = ${correctExact}.`,
    });
  }
  return out;
}
function genGeometryHard(rng,n=15){
  const out=[];
  for(let i=0;i<n;i++){
    const a=randint(rng,3,15);
    const b=randint(rng,3,15);
    const correct = Math.sqrt(a*a+b*b);
    // pick cases where hypotenuse is integer often
    const hyp = Number.isInteger(correct)? correct : Math.round(correct*10)/10;
    const base=mcqFromCorrect(rng, hyp, ()=> hyp + randint(rng,-5,5) || hyp+1);
    out.push({
      q:`A right triangle has legs ${a} and ${b}. What is the length of the hypotenuse?`,
      choices: base.choices,
      answer: base.answer,
      explanation:`Use Pythagorean theorem: c = √(${a}²+${b}²) = √(${a*a}+${b*b}) ≈ ${hyp}.`,
    });
  }
  return out;
}

function genDataEasy(rng,n=15){
  const out=[];
  for(let i=0;i<n;i++){
    const nums=[randint(rng,1,12),randint(rng,1,12),randint(rng,1,12),randint(rng,1,12)];
    const sum=nums.reduce((a,b)=>a+b,0);
    const correct=sum/nums.length;
    const base=mcqFromCorrect(rng, correct, ()=> correct + randint(rng,-3,3) || correct+1);
    out.push({
      q:`What is the mean of ${nums.join(", ")}?`,
      choices: base.choices,
      answer: base.answer,
      explanation:`Mean = (sum of values) / (number of values) = ${sum}/4 = ${correct}.`,
    });
  }
  return out;
}
function genDataMedium(rng,n=15){
  const out=[];
  for(let i=0;i<n;i++){
    const total=randint(rng,30,120);
    const part=randint(rng,5,total-5);
    const correct = (part/total);
    const correctPct = Math.round(correct*100);
    const base=mcqFromCorrect(rng, correctPct, ()=> correctPct + randint(rng,-20,20) || correctPct+5);
    out.push({
      q:`A jar has ${part} red marbles out of ${total} total marbles. What percent are red?`,
      choices: base.choices.map(v=>v+"%"),
      answer: base.answer,
      explanation:`Percent = (${part}/${total})×100 ≈ ${correctPct}%.`,
    });
  }
  return out;
}
function genDataHard(rng,n=15){
  const out=[];
  for(let i=0;i<n;i++){
    const x1=randint(rng,0,6), x2=x1+randint(rng,2,8);
    const m=randint(rng,-4,6);
    const b=randint(rng,-10,10);
    const y1=m*x1+b, y2=m*x2+b;
    const correct=m;
    const base=mcqFromCorrect(rng, correct, ()=> correct + randint(rng,-3,3) || correct+1);
    out.push({
      q:`A line passes through (${x1}, ${y1}) and (${x2}, ${y2}). What is its slope?`,
      choices: base.choices,
      answer: base.answer,
      explanation:`Slope m = (y₂−y₁)/(x₂−x₁) = (${y2}−${y1})/(${x2}−${x1}) = ${m}.`,
    });
  }
  return out;
}

function genAdvEasy(rng,n=15){
  const out=[];
  for(let i=0;i<n;i++){
    const a=randint(rng,2,9), b=randint(rng,2,6);
    const correct = Math.pow(a,b);
    const base=mcqFromCorrect(rng, correct, ()=> correct + randint(rng,-50,50) || correct+10);
    out.push({
      q:`What is ${a}^${b}?`,
      choices: base.choices,
      answer: base.answer,
      explanation:`${a}^${b} means multiplying ${a} by itself ${b} times = ${correct}.`,
    });
  }
  return out;
}
function genAdvMedium(rng,n=15){
  const out=[];
  for(let i=0;i<n;i++){
    const r=randint(rng,-5,8);
    const correct = r;
    const base=mcqFromCorrect(rng, correct, ()=> correct + randint(rng,-4,4) || correct+2);
    out.push({
      q:`If (x − ${r})² = 0, what is x?`,
      choices: base.choices,
      answer: base.answer,
      explanation:`(x − ${r})² = 0 implies x − ${r} = 0, so x = ${r}.`,
    });
  }
  return out;
}
function genAdvHard(rng,n=15){
  const out=[];
  for(let i=0;i<n;i++){
    const r1=randint(rng,-6,6);
    let r2=randint(rng,-6,6);
    if(r2===r1) r2+=1;
    const a=1;
    const b=-(r1+r2);
    const c=r1*r2;
    const correct = `${a===1?"":a}x^2 ${b>=0?"+":"−"} ${Math.abs(b)}x ${c>=0?"+":"−"} ${Math.abs(c)}`
      .replace("1x^2","x^2");
    const distractors=[
      `x^2 ${b>=0?"+":"−"} ${Math.abs(b)}x ${(-c)>=0?"+":"−"} ${Math.abs(-c)}`,
      `x^2 ${ (r1+r2)>=0?"+":"−"} ${Math.abs(r1+r2)}x ${c>=0?"+":"−"} ${Math.abs(c)}`,
      `x^2 ${b>=0?"+":"−"} ${Math.abs(b)}x ${ (r1+r2)>=0?"+":"−"} ${Math.abs(r1+r2)}`
    ];
    const choices=[correct,...distractors];
    shuffleInPlace(rng, choices);
    out.push({
      q:`A quadratic has zeros at x=${r1} and x=${r2}. Which equation could represent it?`,
      choices,
      answer: choices.indexOf(correct),
      explanation:`With zeros r₁ and r₂: (x−r₁)(x−r₂)=x²−(r₁+r₂)x+r₁r₂ = ${correct}.`,
    });
  }
  return out;
}

function genPSolEasy(rng,n=15){
  const out=[];
  for(let i=0;i<n;i++){
    const rate=randint(rng,2,12);
    const hours=randint(rng,2,10);
    const correct=rate*hours;
    const base=mcqFromCorrect(rng, correct, ()=> correct + randint(rng,-20,20) || correct+3);
    out.push({
      q:`A car travels at ${rate} miles per hour for ${hours} hours. How many miles does it travel?`,
      choices: base.choices,
      answer: base.answer,
      explanation:`Distance = rate × time = ${rate}×${hours} = ${correct}.`,
    });
  }
  return out;
}
function genPSolMedium(rng,n=15){
  const out=[];
  for(let i=0;i<n;i++){
    const a=randint(rng,2,9), b=randint(rng,2,9), c=randint(rng,2,9);
    const correct = a/b;
    const correctStr = `${a/b}`; // decimal possible
    const choices=[correctStr, `${a/c}`, `${c/b}`, `${b/a}`];
    shuffleInPlace(rng, choices);
    out.push({
      q:`A recipe uses ${a} cups of flour for every ${b} cups of sugar. What is the flour-to-sugar ratio as a number (flour ÷ sugar)?`,
      choices,
      answer: choices.indexOf(correctStr),
      explanation:`Ratio flour ÷ sugar = ${a}/${b} = ${a/b}.`,
    });
  }
  return out;
}
function genPSolHard(rng,n=15){
  const out=[];
  for(let i=0;i<n;i++){
    // Percent increase/decrease
    const original=randint(rng,40,200);
    const pct=randint(rng,5,35);
    const inc = rng()<0.5;
    const correct = Math.round(original*(inc?(1+pct/100):(1-pct/100)));
    const base=mcqFromCorrect(rng, correct, ()=> correct + randint(rng,-30,30) || correct+7);
    out.push({
      q:`An item costs $${original}. Its price is ${inc?"increased":"decreased"} by ${pct}%. What is the new price (nearest dollar)?`,
      choices: base.choices.map(v=>"$"+v),
      answer: base.answer,
      explanation:`New price = ${original}×(1 ${inc?"+":"−"} ${pct}/100) ≈ ${correct}.`,
    });
  }
  return out;
}

// ---- R&W generators (small passages + grammar/vocab) -------------------------
const RW_PASSAGES = [
  {
    topic:"Main Idea",
    passage:"City planners tested a pilot program that added protected bike lanes on three major streets. After six months, cycling increased and minor traffic delays were limited to rush hour. The planners recommended expanding the program.",
    question:"Which choice best states the main idea of the passage?",
    correct:"A pilot bike-lane program increased cycling with manageable traffic impacts, so planners recommend expansion.",
    distractors:[
      "Protected bike lanes always reduce traffic delays during all hours of the day.",
      "City planners decided to remove bike lanes after observing severe congestion.",
      "Cycling decreased because the pilot program made streets less safe."
    ]
  },
  {
    topic:"Main Idea",
    passage:"A biologist compared two wetlands: one restored five years ago and one never drained. The restored wetland had fewer bird species, but the number rose each year. The biologist concluded that restoration can rebuild biodiversity over time.",
    question:"Which choice best states the main idea of the passage?",
    correct:"Wetland restoration can gradually rebuild biodiversity, even if early species counts are lower.",
    distractors:[
      "Restored wetlands immediately match undisturbed wetlands in every species measure.",
      "Bird species are unrelated to wetland quality and change randomly year to year.",
      "Wetlands should never be restored because biodiversity always declines."
    ]
  },
  {
    topic:"Evidence",
    passage:"In a study of study habits, students who used short daily review sessions outperformed students who crammed the night before. The researchers noted that daily review led to better long-term recall.",
    question:"Which sentence from the passage best supports the idea that daily review improves performance?",
    correct:"Students who used short daily review sessions outperformed students who crammed the night before.",
    distractors:[
      "In a study of study habits, students were observed for one semester.",
      "The researchers noted that students prefer different schedules.",
      "Some students reported feeling stressed during exam week."
    ]
  },
  {
    topic:"Vocabulary",
    passage:"The committee’s decision was met with immediate criticism, but the chair remained resolute and continued with the plan.",
    question:"As used in the passage, \"resolute\" most nearly means",
    correct:"determined",
    distractors:["confused","careless","secretive"]
  },
  {
    topic:"Grammar",
    passage:"Select the best revision for the underlined portion: \"The results of the experiment show, that the hypothesis was incorrect.\"",
    question:"Which choice best revises the underlined portion to follow standard English conventions?",
    correct:"show that",
    distractors:["show, that","shows, that","shows that,"]
  },
];

function genRWEasy(rng, topic, n=15){
  const out=[];
  // Favor Grammar/Vocabulary in easy
  const pool = RW_PASSAGES.filter(p=>["Grammar","Vocabulary"].includes(p.topic));
  for(let i=0;i<n;i++){
    const p = pool[i % pool.length];
    const choices=[p.correct,...p.distractors];
    shuffleInPlace(rng, choices);
    out.push({
      passage:p.passage,
      q:p.question,
      choices,
      answer: choices.indexOf(p.correct),
      explanation:`Correct because it best matches the meaning or follows standard conventions.`,
      meta:{topic},
    });
  }
  return out;
}
function genRWMedium(rng, topic, n=15){
  const out=[];
  // Mix in main idea/evidence
  const pool = RW_PASSAGES.filter(p=>["Main Idea","Evidence","Vocabulary"].includes(p.topic));
  for(let i=0;i<n;i++){
    const p = pool[i % pool.length];
    const choices=[p.correct,...p.distractors];
    shuffleInPlace(rng, choices);
    out.push({
      passage:p.passage,
      q:p.question,
      choices,
      answer: choices.indexOf(p.correct),
      explanation:`Choose the option that is most directly supported by the passage.`,
      meta:{topic},
    });
  }
  return out;
}
function genRWHard(rng, topic, n=15){
  const out=[];
  // Hard focuses on Main Idea/Evidence with close distractors
  const pool = RW_PASSAGES.filter(p=>["Main Idea","Evidence"].includes(p.topic));
  for(let i=0;i<n;i++){
    const p = pool[i % pool.length];
    // Make distractors "closer" by reusing + slight tweak (still deterministic)
    const close = [...p.distractors];
    if(close.length<3) close.push("This option is not supported by the passage.");
    const choices=[p.correct,...close];
    shuffleInPlace(rng, choices);
    out.push({
      passage:p.passage,
      q:p.question,
      choices,
      answer: choices.indexOf(p.correct),
      explanation:`The correct choice best matches what the passage actually says (not what it suggests or what might be true generally).`,
      meta:{topic},
    });
  }
  return out;
}

function buildQuestionBank(){
  const rng = makeRng(424242);
  return {
    math: {
      Algebra: {
        easy:   genAlgebraEasy(rng,15),
        medium: genAlgebraMedium(rng,15),
        hard:   genAlgebraHard(rng,15),
      },
      Geometry: {
        easy:   genGeometryEasy(rng,15),
        medium: genGeometryMedium(rng,15),
        hard:   genGeometryHard(rng,15),
      },
      "Data Analysis": {
        easy:   genDataEasy(rng,15),
        medium: genDataMedium(rng,15),
        hard:   genDataHard(rng,15),
      },
      "Advanced Math": {
        easy:   genAdvEasy(rng,15),
        medium: genAdvMedium(rng,15),
        hard:   genAdvHard(rng,15),
      },
      "Problem Solving": {
        easy:   genPSolEasy(rng,15),
        medium: genPSolMedium(rng,15),
        hard:   genPSolHard(rng,15),
      },
    },
    rw: {
      "Main Idea": {
        easy:   genRWMedium(rng,"Main Idea",15),
        medium: genRWMedium(rng,"Main Idea",15),
        hard:   genRWHard(rng,"Main Idea",15),
      },
      "Evidence": {
        easy:   genRWMedium(rng,"Evidence",15),
        medium: genRWMedium(rng,"Evidence",15),
        hard:   genRWHard(rng,"Evidence",15),
      },
      "Vocabulary": {
        easy:   genRWEasy(rng,"Vocabulary",15),
        medium: genRWMedium(rng,"Vocabulary",15),
        hard:   genRWMedium(rng,"Vocabulary",15),
      },
      "Grammar": {
        easy:   genRWEasy(rng,"Grammar",15),
        medium: genRWEasy(rng,"Grammar",15),
        hard:   genRWMedium(rng,"Grammar",15),
      },
    }
  };
}

const QB = buildQuestionBank();
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

  useEffect(()=>{
    setSecsLeft(secondsTotal);
  },[secondsTotal]);

  useEffect(()=>{
    const t = setInterval(()=>setSecsLeft(s=>s-1), 1000);
    return ()=>clearInterval(t);
  },[]);

  useEffect(()=>{
    if(secsLeft<=0){
      // time up: finish section immediately
      onDone(results);
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
    setResults(r=>[...r,{section:q.section,topic:q.topic,correct:i===q.answer}]);
  }

  function next(){
    if(isLast){
      onDone(results);
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
        <button onClick={()=>onDone(results)} style={{background:'transparent',border:`1px solid ${T.border}`,borderRadius:10,padding:'8px 12px',cursor:'pointer',color:T.textSub,fontFamily:'inherit',fontWeight:700,fontSize:12}}>Submit section</button>
      </div>

      <div style={{height:4,background:T.bgInput,borderRadius:4,marginBottom:28}}>
        <div style={{height:4,width:`${progress}%`,background:sc,borderRadius:4,transition:'width 0.4s ease'}}/>
      </div>

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
  const [allResults,setAllResults]=useState([]);

  const sec = mock.sections[secIdx];
  const secsTotal = (sec.minutes||1)*60;

  function finishSection(sectionResults){
    const merged = [...allResults, ...sectionResults.map(r=>({...r, section: sec.key}))];
    setAllResults(merged);

    if(secIdx === mock.sections.length-1){
      onDone(merged);
    } else {
      setSecIdx(i=>i+1);
    }
  }

  const header = (
    <div style={{background:T.bgHero,border:`1px solid ${T.border}`,borderRadius:20,padding:'18px 22px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}>
      <div>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:3,color:T.accent1,marginBottom:6}}>TIMED MOCK</div>
        <div style={{fontWeight:900,fontSize:18,color:T.text}}>{secIdx+1}/2 · {sec.label}</div>
        <div style={{color:T.textSub,fontSize:12}}>Length: {TEST_LENGTHS[mock.length].label} · Difficulty: {DIFFICULTY_LEVELS[mock.difficulty].label}</div>
      </div>
      <button onClick={onBack} style={{background:'transparent',border:`1px solid ${T.border}`,borderRadius:10,padding:'10px 12px',cursor:'pointer',color:T.textSub,fontFamily:'inherit',fontWeight:800,fontSize:12}}>Exit</button>
    </div>
  );

  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      {header}
      <TimedSectionView sectionLabel={sec.label} questions={sec.questions} secondsTotal={secsTotal} onDone={finishSection}/>
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

  const rP = pct(rC,rT);
  const mP = pct(mC,mT);

  const rS = scaledSectionScore(rP);
  const mS = scaledSectionScore(mP);
  const total = rS + mS;

  return(
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{textAlign:'center',marginBottom:4}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:3,color:T.accent1,marginBottom:8}}>SCORE REPORT</div>
        <h2 style={{fontSize:34,fontWeight:900,margin:'0 0 6px',color:T.text}}>{total}</h2>
        <p style={{color:T.textSub,margin:0}}>R&W {rS} · Math {mS}</p>
        <p style={{color:T.textMuted,fontSize:12,marginTop:10}}>Scoring is currently a simple, transparent mapping from % correct → 200–800. We can swap in a more realistic curve later.</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:14}}>
        <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:18}}>
          <div style={{fontWeight:800,fontSize:14,color:T.text,marginBottom:6}}>Reading & Writing</div>
          <div style={{color:T.textSub,fontSize:13}}>{rC}/{rT} correct ({rP}%)</div>
          <div style={{marginTop:10,color:T.accent2,fontWeight:900,fontSize:22}}>{rS}</div>
        </div>
        <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:18}}>
          <div style={{fontWeight:800,fontSize:14,color:T.text,marginBottom:6}}>Math</div>
          <div style={{color:T.textSub,fontSize:13}}>{mC}/{mT} correct ({mP}%)</div>
          <div style={{marginTop:10,color:T.accent1,fontWeight:900,fontSize:22}}>{mS}</div>
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
  if(!questions||!questions.length) return(<div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:32}}><p style={{color:T.textSub}}>No questions available.</p></div>);
  const q=questions[idx],isLast=idx===questions.length-1;
  const progress=((idx+1)/questions.length)*100;
  const sc=idx%2===0?T.accent1:T.accent2;
  function choose(i){
    if(selected!==null)return;
    setSelected(i);setShowExp(true);
    setResults(r=>[...r,{section:q.section,topic:q.topic,correct:i===q.answer}]);
  }
  function next(){
    // Results are recorded once at selection time; do not double-count.
    if(isLast){onDone(results);}else{setIdx(i=>i+1);setSelected(null);setShowExp(false);}
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
  const pool=(QB[section]?.[topic]?.[difficulty]??[]).sort(()=>Math.random()-0.5);
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
function Dashboard({progress,onStartTopic,onPracticeTest,onMockTest}){
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
              onMockTest={()=>setView("mockSetup")}/>
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
