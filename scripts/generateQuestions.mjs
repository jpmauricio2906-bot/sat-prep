
import fs from "fs";
import path from "path";

function lcg(seed){
  let s = seed >>> 0;
  return ()=>{
    // Numerical Recipes LCG
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
function randInt(rng, a, b){
  return a + Math.floor(rng() * (b - a + 1));
}
function choice(rng, arr){
  return arr[Math.floor(rng()*arr.length)];
}
function shuffle(rng, arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(rng()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
function fp(obj){
  const s = JSON.stringify(obj);
  let h=0;
  for(let i=0;i<s.length;i++) h = (h*31 + s.charCodeAt(i)) >>> 0;
  return String(h);
}
function asChoicesCorrectIndex(correct, distractors){
  const all = shuffle(Math.random, [correct, ...distractors].slice(0,4)); // not used
}

// Helpers for numeric formatting
function fmtNum(x){
  if (Number.isInteger(x)) return String(x);
  const r = Math.round(x*100)/100;
  return String(r);
}
function makeChoicesFromCorrect(rng, correct, step=1){
  const c = Number(correct);
  const ds = new Set();
  while(ds.size<3){
    const d = c + step*randInt(rng,-6,6);
    if(d!==c) ds.add(d);
  }
  const opts = shuffle(rng, [c, ...ds]);
  const idx = opts.indexOf(c);
  return { choices: opts.map(fmtNum), answerIndex: idx };
}

// --- TEMPLATE GENERATORS (return question object in list format) ---
function genAlgebraLinear(rng, id, diff){
  // ax + b = c with integer x
  const x = randInt(rng, diff==="easy"?1:diff==="medium"?-8:-12, diff==="easy"?12:diff==="medium"?12:18);
  const a = randInt(rng, diff==="easy"?1:2, diff==="hard"?8:5);
  const b = randInt(rng, diff==="easy"?-10:-20, diff==="easy"?20:20);
  const c = a*x + b;
  const q = `If ${a}x ${b>=0?"+":"-"} ${Math.abs(b)} = ${c}, what is x?`;
  const {choices, answerIndex} = makeChoicesFromCorrect(rng, x, 1);
  return {
    id,
    section:"math",
    topic:"Algebra",
    difficulty:diff,
    question:q,
    choices,
    answerIndex,
    explanation:`Solve: ${a}x = ${c} ${b>=0?`- ${b}`:`+ ${Math.abs(b)}`} ⇒ x = ${x}.`,
    visual:null,
    meta:{ template:"linear_equation_ax_plus_b", params:{a,b,c,x} }
  };
}

function genAdvancedQuadratic(rng, id, diff){
  // (x-p)(x-q)=0
  const p = randInt(rng, diff==="easy"?-6:-10, diff==="easy"?6:10);
  let qv = randInt(rng, diff==="easy"?-6:-10, diff==="easy"?6:10);
  if (qv===p) qv += 1;
  const b = -(p+qv);
  const c = p*qv;
  const question = `What is one solution to x² ${b>=0?"+":"-"} ${Math.abs(b)}x ${c>=0?"+":"-"} ${Math.abs(c)} = 0 ?`;
  const correct = p;
  const {choices, answerIndex} = makeChoicesFromCorrect(rng, correct, 1);
  return {
    id,
    section:"math",
    topic:"Advanced Math",
    difficulty:diff,
    question,
    choices,
    answerIndex,
    explanation:`Factor: (x ${p>=0?`- ${p}`:`+ ${Math.abs(p)}`})(x ${qv>=0?`- ${qv}`:`+ ${Math.abs(qv)}`})=0 ⇒ x=${p} or x=${qv}.`,
    visual:null,
    meta:{ template:"quadratic_root", params:{p,q:qv} }
  };
}

function genProblemSolvingPercent(rng, id, diff){
  const base = randInt(rng, 20, diff==="hard"?400:200);
  const pct = randInt(rng, diff==="easy"?5:10, diff==="hard"?60:40);
  const question = `A price of $${base} is increased by ${pct}%. What is the new price?`;
  const correct = base * (1 + pct/100);
  const step = diff==="easy"?5:10;
  const {choices, answerIndex} = makeChoicesFromCorrect(rng, Math.round(correct*100)/100, step);
  return {
    id,
    section:"math",
    topic:"Problem Solving",
    difficulty:diff,
    question,
    choices,
    answerIndex,
    explanation:`New price = ${base} × (1 + ${pct}/100) = ${fmtNum(correct)}.`,
    visual:null,
    meta:{ template:"percent_increase", params:{base, pct, correct} }
  };
}

function genGeometryRightTriangle(rng, id, diff){
  const triples = [[3,4,5],[5,12,13],[8,15,17],[7,24,25],[9,40,41]];
  const [a0,b0,c0] = choice(rng, triples);
  const k = randInt(rng, diff==="easy"?1:diff==="medium"?2:3, diff==="hard"?4:6);
  const a=a0*k, b=b0*k, c=c0*k;
  const question = `In the right triangle shown, the legs are ${a} and ${b}. What is the hypotenuse?`;
  const {choices, answerIndex} = makeChoicesFromCorrect(rng, c, k);
  return {
    id,
    section:"math",
    topic:"Geometry",
    difficulty:diff,
    question,
    choices,
    answerIndex,
    explanation:`Use Pythagorean theorem: √(${a}²+${b}²)=√(${a*a}+${b*b})=${c}.`,
    visual:{ type:"svg", shape:"right_triangle", params:{a, b} },
    meta:{ template:"pythagorean_hypotenuse", params:{a, b, c} }
  };
}

function genGeometryRectangle(rng, id, diff){
  const w = randInt(rng, diff==="easy"?2:5, diff==="hard"?30:20);
  const h = randInt(rng, diff==="easy"?3:6, diff==="hard"?25:18);
  const question = `A rectangle has width ${w} and height ${h}. What is its area?`;
  const correct = w*h;
  const {choices, answerIndex} = makeChoicesFromCorrect(rng, correct, diff==="easy"?2:5);
  return {
    id,
    section:"math",
    topic:"Geometry",
    difficulty:diff,
    question,
    choices,
    answerIndex,
    explanation:`Area = width × height = ${w}×${h} = ${correct}.`,
    visual:{ type:"svg", shape:"rectangle", params:{w, h} },
    meta:{ template:"rectangle_area", params:{w, h, area:correct} }
  };
}

function genGeometryCircle(rng, id, diff){
  const r = randInt(rng, diff==="easy"?2:4, diff==="hard"?20:12);
  const question = `A circle has radius ${r}. Using π ≈ 3.14, what is the circumference?`;
  const correct = 2*3.14*r;
  const rounded = Math.round(correct*100)/100;
  const {choices, answerIndex} = makeChoicesFromCorrect(rng, rounded, diff==="easy"?1:5);
  return {
    id,
    section:"math",
    topic:"Geometry",
    difficulty:diff,
    question,
    choices,
    answerIndex,
    explanation:`Circumference = 2πr ≈ 2×3.14×${r} = ${fmtNum(rounded)}.`,
    visual:{ type:"svg", shape:"circle_arc", params:{r, arcDegrees: 360} },
    meta:{ template:"circle_circumference", params:{r, pi:3.14, C:rounded} }
  };
}

function genDataBarMean(rng, id, diff){
  const n = 5;
  const labels = ["A","B","C","D","E"];
  const values = labels.map(()=>randInt(rng, diff==="easy"?2:5, diff==="hard"?30:18));
  const mean = values.reduce((a,b)=>a+b,0)/n;
  const meanRounded = Math.round(mean*100)/100;
  const question = `The bar chart shows values for categories A–E. What is the mean of the five values?`;
  const {choices, answerIndex} = makeChoicesFromCorrect(rng, meanRounded, diff==="easy"?1:2);
  const data = labels.map((name,i)=>({name, value: values[i]}));
  return {
    id,
    section:"math",
    topic:"Data Analysis",
    difficulty:diff,
    question,
    choices,
    answerIndex,
    explanation:`Mean = (sum of values)/5 = ${values.join("+")} / 5 = ${fmtNum(meanRounded)}.`,
    visual:{ type:"chart", chartType:"bar", data, config:{xKey:"name", yKey:"value", caption:"Category values"} },
    meta:{ template:"bar_mean", params:{values, mean: meanRounded} }
  };
}

function genDataScatterCorrelation(rng, id, diff){
  // generate positive or negative trend
  const sign = choice(rng, [1,-1]);
  const pts = [];
  let baseX = randInt(rng, 1, 5);
  let baseY = randInt(rng, 5, 15);
  for(let i=0;i<8;i++){
    const x = baseX + i;
    const noise = randInt(rng, -2, 2);
    const y = baseY + sign*i + noise;
    pts.push({x, y});
  }
  const question = `Based on the scatter plot, which describes the association between x and y?`;
  const correctText = sign===1 ? "Positive association" : "Negative association";
  const choices = shuffle(rng, [correctText, "No association", "Nonlinear association", sign===1?"Negative association":"Positive association"]);
  const answerIndex = choices.indexOf(correctText);
  return {
    id,
    section:"math",
    topic:"Data Analysis",
    difficulty:diff,
    question,
    choices,
    answerIndex,
    explanation:`As x increases, y tends to ${sign===1?"increase":"decrease"}, indicating a ${correctText.toLowerCase()}.`,
    visual:{ type:"chart", chartType:"scatter", data: pts, config:{ caption:"Scatter plot", trendLine: null } },
    meta:{ template:"scatter_correlation_sign", params:{sign} }
  };
}

function genCoordinateDistance(rng, id, diff){
  const x1=randInt(rng,-10,10), y1=randInt(rng,-10,10);
  const dx=choice(rng,[3,4,5,6,8,9]); const dy=choice(rng,[3,4,5,6,8,9]);
  const x2=x1+dx, y2=y1+dy;
  const dist = Math.sqrt(dx*dx+dy*dy);
  const distRounded = Math.round(dist*100)/100;
  const question = `On the coordinate plane, what is the distance between (${x1}, ${y1}) and (${x2}, ${y2})?`;
  const {choices, answerIndex} = makeChoicesFromCorrect(rng, distRounded, 1);
  return {
    id,
    section:"math",
    topic:"Geometry",
    difficulty:diff,
    question,
    choices,
    answerIndex,
    explanation:`Distance = √(Δx²+Δy²)=√(${dx}²+${dy}²)=√(${dx*dx+dy*dy})=${fmtNum(distRounded)}.`,
    visual:{ type:"svg", shape:"coordinate_plane", params:{points:[{x:x1,y:y1,label:"A"},{x:x2,y:y2,label:"B"}]} },
    meta:{ template:"distance_formula", params:{dx,dy,dist:distRounded} }
  };
}

function genReadingTopic(rng, id, topic, diff){
  // Simple deterministic "mini-passage" questions with known answer
  const themes = {
    "Main Idea":["The paragraph primarily argues that","The passage mainly suggests that","The author’s main point is that"],
    "Vocabulary in Context":["In the passage, the word \"resilient\" most nearly means","In context, \"deduce\" most nearly means","The word \"allocate\" most nearly means"],
    "Evidence":["Which choice provides the best evidence for the claim?","Which quotation best supports the idea?","Which detail most strongly supports the conclusion?"],
    "Grammar":["Which choice best completes the sentence?","Which revision best corrects the sentence?","Which choice best maintains standard English conventions?"],
    "Rhetorical Skills":["Which choice best introduces the example?","Which transition best connects the sentences?","Which choice best emphasizes the contrast?"],
  };
  const stems = themes[topic] || ["Which choice is best?"];
  const stem = choice(rng, stems);
  const correct = "Choice A";
  const choices = shuffle(rng, ["Choice A","Choice B","Choice C","Choice D"]);
  const answerIndex = choices.indexOf(correct);
  const question = `${stem}`;
  return {
    id,
    section:"reading",
    topic,
    difficulty:diff,
    question,
    choices,
    answerIndex,
    explanation:`This item is programmatically generated for practice; correct answer is ${correct}.`,
    visual:null,
    meta:{ template:"reading_placeholder", params:{topic} }
  };
}

const TARGET=40;
const seed = 20260224; // stable seed
const rng = lcg(seed);

const mathTopics = ["Algebra","Geometry","Data Analysis","Advanced Math","Problem Solving"];
const readingTopics = ["Main Idea","Vocabulary in Context","Evidence","Grammar","Rhetorical Skills"];
const diffs = ["easy","medium","hard"];

const out=[];
const seen = new Set();

function pushUnique(q){
  const key = q.section+"|"+q.topic+"|"+q.difficulty+"|"+q.question;
  if(seen.has(key)) return false;
  seen.add(key);
  out.push(q);
  return true;
}

function fill(topic, diff, genFns, section="math"){
  let n=0; let tries=0;
  while(n<TARGET && tries<5000){
    tries++;
    const id = `${section}-${topic.replace(/\s+/g,"_").toLowerCase()}-${diff}-${String(n+1).padStart(3,"0")}`;
    const gen = choice(rng, genFns);
    const q = gen(id, diff);
    if(pushUnique(q)) n++;
  }
}

for(const diff of diffs){
  fill("Algebra", diff, [(id,d)=>genAlgebraLinear(rng,id,d)], "math");
  // Geometry: mix multiple
  fill("Geometry", diff, [
    (id,d)=>genGeometryRightTriangle(rng,id,d),
    (id,d)=>genGeometryRectangle(rng,id,d),
    (id,d)=>genGeometryCircle(rng,id,d),
    (id,d)=>genCoordinateDistance(rng,id,d)
  ], "math");
  fill("Data Analysis", diff, [
    (id,d)=>genDataBarMean(rng,id,d),
    (id,d)=>genDataScatterCorrelation(rng,id,d)
  ], "math");
  fill("Advanced Math", diff, [(id,d)=>genAdvancedQuadratic(rng,id,d)], "math");
  fill("Problem Solving", diff, [(id,d)=>genProblemSolvingPercent(rng,id,d)], "math");

  for(const topic of readingTopics){
    let n=0, tries=0;
    while(n<TARGET && tries<2000){
      tries++;
      const id = `reading-${topic.replace(/\s+/g,"_").toLowerCase()}-${diff}-${String(n+1).padStart(3,"0")}`;
      const q = genReadingTopic(rng, id, topic, diff);
      if(pushUnique(q)) n++;
    }
  }
}

const outPath = path.resolve("public/questions.json");
fs.mkdirSync(path.dirname(outPath), {recursive:true});
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`Generated ${out.length} questions at ${outPath}`);
