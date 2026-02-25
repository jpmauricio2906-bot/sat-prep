
import fs from "fs";
import path from "path";

const questions = JSON.parse(fs.readFileSync("public/questions.json","utf8"));

function norm(s){ return String(s||"").toLowerCase().replace(/\s+/g," ").trim(); }
function fingerprint(q){
  const base = [
    q.section, q.topic, q.difficulty,
    norm(q.question),
    (q.choices||[]).map(norm).join("|"),
    q.answerIndex,
    q.visual?.type||"",
    q.visual?.shape||q.visual?.chartType||""
  ].join("||");
  let h=0;
  for(let i=0;i<base.length;i++) h = (h*31 + base.charCodeAt(i)) >>> 0;
  return String(h);
}

function needsVisual(q){
  return q.section==="math" && (q.topic==="Geometry" || q.topic==="Data Analysis");
}
function visualOk(q){
  if(!needsVisual(q)) return true;
  if(!q.visual) return false;
  if(q.topic==="Geometry") return q.visual.type==="svg" && !!q.visual.shape;
  if(q.topic==="Data Analysis") return q.visual.type==="chart" || q.visual.type==="table" || q.visual.type==="svg";
  return true;
}

function solve(q){
  const t=q.meta?.template;
  const p=q.meta?.params||{};
  switch(t){
    case "linear_equation_ax_plus_b": return p.x;
    case "pythagorean_hypotenuse": return p.c;
    case "rectangle_area": return p.area;
    case "circle_circumference": return p.C;
    case "distance_formula": return p.dist;
    case "percent_increase": return p.correct;
    case "quadratic_root": return p.p;
    case "bar_mean": return p.mean;
    case "scatter_correlation_sign": return p.sign===1 ? "Positive association" : "Negative association";
    case "reading_placeholder": return "Choice A";
    default: return null;
  }
}

const issues=[];
const matrix=[];
const seen=new Set();

// bucket counts
const buckets=new Map();
function bucketKey(q){ return `${q.section}|${q.topic}|${q.difficulty}`; }

for(const q of questions){
  const errs=[];
  if(!q.id) errs.push("missing id");
  if(!q.section) errs.push("missing section");
  if(!q.topic) errs.push("missing topic");
  if(!q.difficulty) errs.push("missing difficulty");
  if(!q.question) errs.push("missing question");
  if(!Array.isArray(q.choices) || q.choices.length!==4) errs.push("choices must be 4");
  if(typeof q.answerIndex!=="number" || q.answerIndex<0 || q.answerIndex>3) errs.push("answerIndex 0..3");
  if(needsVisual(q) && !visualOk(q)) errs.push("visual missing/invalid for topic");

  const fp=fingerprint(q);
  if(seen.has(fp)) errs.push("duplicate fingerprint");
  seen.add(fp);

  const bk=bucketKey(q);
  buckets.set(bk, (buckets.get(bk)||0)+1);

  // correctness when solvable
  const expected=solve(q);
  if(expected!==null){
    const correctChoice=q.choices[q.answerIndex];
    if(typeof expected==="number"){
      const val=Number(correctChoice);
      if(!Number.isFinite(val)) errs.push(`correct choice not numeric (expected ${expected})`);
      else if(Math.abs(val-expected)>1e-6) errs.push(`answer mismatch expected ${expected} got ${val}`);
    } else {
      if(norm(correctChoice)!==norm(expected)) errs.push(`answer mismatch expected "${expected}" got "${correctChoice}"`);
    }
  } else {
    errs.push("unverified_template_or_missing_meta");
  }

  matrix.push({
    id:q.id,
    section:q.section,
    topic:q.topic,
    difficulty:q.difficulty,
    has_visual: q.visual? "yes":"no",
    visual_type: q.visual?.type||"",
    visual_shape: q.visual?.shape||q.visual?.chartType||"",
    fingerprint: fp
  });

  if(errs.length){
    issues.push({id:q.id, section:q.section, topic:q.topic, difficulty:q.difficulty, errors:errs, question:q.question});
  }
}

// bucket coverage check (expect 40)
for(const [bk,count] of buckets.entries()){
  if(count<40){
    const [section,topic,difficulty]=bk.split("|");
    issues.push({id:"", section, topic, difficulty, errors:[`bucket_underfilled_${count}`], question:""});
  }
}

function toCSV(rows){
  const esc=v=>('"'+String(v??"").replace(/"/g,'""')+'"');
  if(!rows.length) return "";
  const headers=Object.keys(rows[0]);
  const out=[headers.map(esc).join(",")];
  for(const r of rows) out.push(headers.map(h=>esc(r[h])).join(","));
  return out.join("\n");
}

fs.writeFileSync("public/question_issues.json", JSON.stringify({generatedAt:new Date().toISOString(), count:issues.length, issues}, null, 2));
fs.writeFileSync("public/question_matrix.csv", toCSV(matrix));
console.log(`Validation complete. Issues: ${issues.length}. Matrix rows: ${matrix.length}.`);
