
import fs from "fs";
import path from "path";

/**
 * Programmatic SAT question generator (Math + Reading/Writing)
 * - Generates TARGET questions per (section/topic/difficulty)
 * - Deterministic via SEED
 * - Produces machine-checkable meta for Math + many RW templates
 */

const TARGET = Number(process.env.Q_TARGET ?? 40);
const SEED = Number(process.env.Q_SEED ?? Date.now());

function lcg(seed){
  let s = seed >>> 0;
  return ()=> {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
const rng = lcg(SEED);

function randInt(a,b){ return a + Math.floor(rng()*(b-a+1)); }
function choice(arr){ return arr[Math.floor(rng()*arr.length)]; }
function shuffleCopy(arr){
  const a = [...arr];
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(rng()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}
function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }

function norm(s){ return String(s).trim().toLowerCase().replace(/\s+/g," "); }
function fp(q){
  return [
    q.section, q.topic, q.difficulty,
    norm(q.passage ?? ""),
    norm(q.question ?? ""),
    (q.choices ?? []).map(norm).join("|"),
    JSON.stringify(q.meta?.template ?? ""),
    JSON.stringify(q.meta?.params ?? {})
  ].join("::");
}

const out = [];
const seen = new Set();
function pushUnique(q){
  const k = fp(q);
  if(seen.has(k)) return false;
  seen.add(k);
  out.push(q);
  return true;
}

function makeChoices(correct, distractors){
  const all = shuffleCopy([correct, ...distractors].slice(0,4));
  const answerIndex = all.indexOf(correct);
  return {choices: all, answerIndex};
}
function makeNumericChoices(correct, spread){
  // spread: array of plausible offsets
  const ds = shuffleCopy(spread).slice(0,3);
  const distractors = ds.map(d=>String(correct + d));
  return makeChoices(String(correct), distractors);
}
function approxPi(){ return 3.14; }

/* ----------------------------- MATH GENERATORS ----------------------------- */

function genAlgebraLinear(id,diff){
  // Solve ax + b = c
  let a = choice([1,2,3,4,5,6,7,8,9]);
  if(diff==="hard") a = choice([6,7,8,9,10,12,15]);
  let x = randInt(1, diff==="easy"?10:diff==="medium"?15:20);
  let b = randInt(-10, 12);
  if(diff==="easy") b = randInt(-6,6);
  const c = a*x + b;

  const question = `Solve for x: ${a}x ${b>=0?"+":"-"} ${Math.abs(b)} = ${c}`;
  const correct = x;
  const spread = diff==="easy"?[-3,-2,-1,1,2,3]:diff==="medium"?[-5,-3,-2,2,3,5]:[-8,-5,-3,3,5,8];
  const {choices, answerIndex} = makeNumericChoices(correct, spread);

  return {
    id, section:"math", topic:"Algebra", difficulty:diff,
    question,
    choices, answerIndex,
    explanation:"Isolate x by subtracting/adding and dividing.",
    visual:null,
    meta:{ template:"linear_equation_ax_plus_b", params:{a,b,c, x} }
  };
}

function genGeometryRightTriangle(id,diff){
  // Pythagorean with nice triples scaled
  const triples = diff==="easy"
    ? [[3,4,5],[5,12,13],[6,8,10]]
    : diff==="medium"
      ? [[8,15,17],[7,24,25],[9,40,41]]
      : [[12,35,37],[20,21,29],[28,45,53]];
  const [a0,b0,c0] = choice(triples);
  const k = diff==="hard" ? randInt(2,4) : diff==="medium" ? randInt(1,3) : randInt(1,2);
  const a=a0*k, b=b0*k, c=c0*k;

  const ask = choice(["hypotenuse","area"]);
  if(ask==="hypotenuse"){
    const question = `In the right triangle shown, the legs are ${a} and ${b}. What is the hypotenuse?`;
    const correct = c;
    const {choices, answerIndex} = makeNumericChoices(correct, [-6,-3,-1,1,3,6,9]);
    return {
      id, section:"math", topic:"Geometry", difficulty:diff,
      question,
      choices, answerIndex,
      explanation:"Use the Pythagorean theorem.",
      visual:{ type:"svg", shape:"right_triangle", params:{ a, b } },
      meta:{ template:"pythagorean_hypotenuse", params:{ a, b, c } }
    };
  } else {
    const question = `In the right triangle shown, the legs are ${a} and ${b}. What is the area of the triangle?`;
    const correct = (a*b)/2;
    const spread = diff==="easy"?[-12,-6,-3,3,6,12]:[-40,-20,-10,10,20,40];
    const {choices, answerIndex} = makeNumericChoices(correct, spread);
    return {
      id, section:"math", topic:"Geometry", difficulty:diff,
      question,
      choices, answerIndex,
      explanation:"Area of a right triangle = (1/2)ab.",
      visual:{ type:"svg", shape:"right_triangle", params:{ a, b } },
      meta:{ template:"right_triangle_area", params:{ a, b, area: correct } }
    };
  }
}

function genGeometryRectangle(id,diff){
  const w = randInt(diff==="easy"?4:6, diff==="hard"?20:16);
  const h = randInt(diff==="easy"?3:5, diff==="hard"?18:14);
  const ask = choice(["area","perimeter"]);
  if(ask==="area"){
    const correct = w*h;
    const question = `A rectangle has width ${w} and height ${h}. What is its area?`;
    const {choices, answerIndex} = makeNumericChoices(correct, [-w, -h, -2, 2, h, w, w+h]);
    return {
      id, section:"math", topic:"Geometry", difficulty:diff,
      question,
      choices, answerIndex,
      explanation:"Area = width × height.",
      visual:{ type:"svg", shape:"rectangle", params:{ w, h } },
      meta:{ template:"rectangle_area", params:{ w, h, area: correct } }
    };
  } else {
    const correct = 2*(w+h);
    const question = `A rectangle has width ${w} and height ${h}. What is its perimeter?`;
    const {choices, answerIndex} = makeNumericChoices(correct, [-4,-2,-1,1,2,4,6]);
    return {
      id, section:"math", topic:"Geometry", difficulty:diff,
      question,
      choices, answerIndex,
      explanation:"Perimeter = 2(w + h).",
      visual:{ type:"svg", shape:"rectangle", params:{ w, h } },
      meta:{ template:"rectangle_perimeter", params:{ w, h, p: correct } }
    };
  }
}

function genGeometryCircle(id,diff){
  const r = randInt(diff==="easy"?3:4, diff==="hard"?16:12);
  const ask = choice(["circumference","area"]);
  if(ask==="circumference"){
    const correct = +(2*approxPi()*r).toFixed(2);
    const question = `A circle has radius ${r}. Using π = 3.14, what is its circumference?`;
    const distractors = [
      +(approxPi()*r).toFixed(2),
      +(2*approxPi()*(r+1)).toFixed(2),
      +(2*approxPi()*(r-1)).toFixed(2)
    ].map(v=>String(v));
    const {choices, answerIndex} = makeChoices(String(correct), distractors);
    return {
      id, section:"math", topic:"Geometry", difficulty:diff,
      question,
      choices, answerIndex,
      explanation:"Circumference = 2πr.",
      visual:{ type:"svg", shape:"circle", params:{ radius:r } },
      meta:{ template:"circle_circumference", params:{ r, pi:3.14, c: correct } }
    };
  } else {
    const correct = +(approxPi()*r*r).toFixed(2);
    const question = `A circle has radius ${r}. Using π = 3.14, what is its area?`;
    const distractors = [
      +(2*approxPi()*r).toFixed(2),
      +(approxPi()*(r+1)*(r+1)).toFixed(2),
      +(approxPi()*(r-1)*(r-1)).toFixed(2)
    ].map(v=>String(v));
    const {choices, answerIndex} = makeChoices(String(correct), distractors);
    return {
      id, section:"math", topic:"Geometry", difficulty:diff,
      question,
      choices, answerIndex,
      explanation:"Area = πr².",
      visual:{ type:"svg", shape:"circle", params:{ radius:r } },
      meta:{ template:"circle_area", params:{ r, pi:3.14, area: correct } }
    };
  }
}

function genCoordinateDistance(id,diff){
  const x1 = randInt(-6,6), y1 = randInt(-6,6);
  let x2 = randInt(-6,6), y2 = randInt(-6,6);
  if(x2===x1 && y2===y1){ x2 = x1+1; }
  // Make it often a Pythagorean distance
  const dx = randInt(1, diff==="easy"?6:8);
  const dy = randInt(1, diff==="easy"?6:8);
  const sign = ()=> (rng()<0.5?-1:1);
  const A=[x1,y1];
  const B=[x1+dx*sign(), y1+dy*sign()];
  const dist = Math.sqrt(dx*dx + dy*dy);
  const correct = +dist.toFixed(2);
  const question = `On the coordinate plane shown, what is the distance between points A and B? (Round to the nearest hundredth.)`;
  const distractors = [
    +(Math.sqrt(Math.abs(dx*dx - dy*dy))).toFixed(2),
    +(dx+dy).toFixed(2),
    +(Math.sqrt((dx+1)*(dx+1)+dy*dy)).toFixed(2)
  ].map(v=>String(v));
  const {choices, answerIndex} = makeChoices(String(correct), distractors);
  return {
    id, section:"math", topic:"Geometry", difficulty:diff,
    question,
    choices, answerIndex,
    explanation:"Use the distance formula.",
    visual:{ type:"svg", shape:"coordinate_plane", params:{ points:[A,B] } },
    meta:{ template:"coordinate_distance", params:{ A, B, dx, dy, dist: correct } }
  };
}

function genDataBarMean(id,diff){
  const labels = ["A","B","C","D","E"].slice(0, diff==="easy"?4:5);
  const values = labels.map(()=> randInt(diff==="easy"?2:1, diff==="hard"?20:15));
  const mean = values.reduce((a,b)=>a+b,0)/values.length;
  const correct = +mean.toFixed(1);
  const question = `The bar chart shows values for categories ${labels.join(", ")}. What is the mean of the values?`;
  const distractors = [
    +(mean+1.5).toFixed(1),
    +(mean-1.5).toFixed(1),
    +((values.slice().sort((a,b)=>a-b)[Math.floor(values.length/2)])).toFixed(1)
  ].map(v=>String(v));
  const {choices, answerIndex} = makeChoices(String(correct), distractors);
  return {
    id, section:"math", topic:"Data Analysis", difficulty:diff,
    question,
    choices, answerIndex,
    explanation:"Mean = sum ÷ count.",
    visual:{ type:"chart", chartType:"bar", params:{ labels, values } },
    meta:{ template:"bar_mean", params:{ labels, values, mean: correct } }
  };
}

function genDataScatterCorrelation(id,diff){
  // generate points with positive/negative trend
  const trend = choice(["positive","negative"]);
  const n = diff==="easy"?8:10;
  const xs = Array.from({length:n}, (_,i)=> i+1);
  const noise = diff==="hard"?6: diff==="medium"?4:3;
  const pts = xs.map(x=>{
    const base = trend==="positive" ? 3*x : 30 - 2.5*x;
    const y = base + randInt(-noise, noise);
    return [x, clamp(Math.round(y), 0, 40)];
  });
  const question = `Based on the scatterplot shown, which statement best describes the relationship between x and y?`;
  const correct = trend==="positive" ? "As x increases, y tends to increase." : "As x increases, y tends to decrease.";
  const distractors = trend==="positive"
    ? ["As x increases, y tends to decrease.","There is no clear relationship between x and y.","y increases only when x is even."]
    : ["As x increases, y tends to increase.","There is no clear relationship between x and y.","y decreases only when x is even."];
  const {choices, answerIndex} = makeChoices(correct, distractors);
  return {
    id, section:"math", topic:"Data Analysis", difficulty:diff,
    question,
    choices, answerIndex,
    explanation:"Look at the overall trend of the points.",
    visual:{ type:"chart", chartType:"scatter", params:{ points: pts } },
    meta:{ template:"scatter_trend", params:{ trend, points: pts } }
  };
}

function genAdvancedQuadratic(id,diff){
  // Factorable quadratics: x^2 + bx + c
  const r1 = randInt(-10,10) || 2;
  const r2 = randInt(-10,10) || -3;
  const b = -(r1+r2);
  const c = r1*r2;
  const question = `If (x ${r1>=0? "-":"+ "} ${Math.abs(r1)})(x ${r2>=0? "-":"+ "} ${Math.abs(r2)}) = 0, what is one solution for x?`;
  const correct = r1;
  const {choices, answerIndex} = makeNumericChoices(correct, [-6,-3,-1,1,3,6]);
  return {
    id, section:"math", topic:"Advanced Math", difficulty:diff,
    question,
    choices, answerIndex,
    explanation:"Set each factor equal to zero.",
    visual:null,
    meta:{ template:"quadratic_factor_roots", params:{ r1, r2, b, c } }
  };
}

function genProblemSolvingPercent(id,diff){
  const base = randInt(50, diff==="easy"?200:diff==="hard"?600:400);
  const p = randInt(diff==="easy"?5:8, diff==="hard"?35:25);
  const inc = rng()<0.5;
  const result = inc ? base*(1+p/100) : base*(1-p/100);
  const correct = +result.toFixed(2);
  const question = `A quantity is ${inc?"increased":"decreased"} by ${p}%. The original value is ${base}. What is the new value?`;
  const distractors = [
    +(base + (inc?1:-1)*p).toFixed(2),
    +(base*(p/100)).toFixed(2),
    +(base*(1+(inc?1:-1)*(p/100)+0.05)).toFixed(2)
  ].map(v=>String(v));
  const {choices, answerIndex} = makeChoices(String(correct), distractors);
  return {
    id, section:"math", topic:"Problem Solving", difficulty:diff,
    question,
    choices, answerIndex,
    explanation:"Multiply by 1 ± p/100.",
    visual:null,
    meta:{ template:"percent_change", params:{ base, p, inc, newValue: correct } }
  };
}

/* --------------------------- RW PASSAGES & TEMPLATES --------------------------- */

const domains = [
  {key:"science", label:"Science"},
  {key:"history", label:"History"},
  {key:"social", label:"Social Science"},
  {key:"humanities", label:"Humanities"},
  {key:"literature", label:"Literature"},
  {key:"technology", label:"Technology"},
];

const topicsRW = ["Main Idea","Vocabulary in Context","Evidence","Rhetorical Skills","Grammar"];
const diffs = ["easy","medium","hard"];

const hooks = {
  science: ["field experiment","recent study","controlled trial","observational data","laboratory analysis","long-term monitoring"],
  history: ["archival record","political debate","reform movement","public address","treaty negotiation","economic policy"],
  social: ["survey research","behavioral pattern","community program","policy evaluation","social norm","market response"],
  humanities: ["museum exhibit","philosophical argument","architectural design","cultural tradition","critical interpretation","artistic movement"],
  literature: ["narrator","character","setting","imagery","tone","dialogue"],
  technology: ["software update","prototype","network","algorithm","battery design","data security"],
};

const structures = ["contrast","cause_effect","example","qualification","problem_solution"];

function makePassage(domainKey){
  const hook = choice(hooks[domainKey]);
  const structure = choice(structures);
  const s1 = (()=>{
    switch(structure){
      case "contrast":
        return `Although the ${hook} initially seemed promising, later findings complicated that impression.`;
      case "cause_effect":
        return `Because the ${hook} was designed to reduce bias, its results were easier to interpret.`;
      case "example":
        return `For example, one ${hook} revealed a detail that earlier accounts had overlooked.`;
      case "qualification":
        return `The ${hook} supports a common claim, but only under specific conditions.`;
      case "problem_solution":
        return `The main challenge with the ${hook} was inconsistency, so researchers revised their approach.`;
      default:
        return `The ${hook} drew attention for its unexpected results.`;
    }
  })();

  const s2 = (()=>{
    switch(structure){
      case "contrast":
        return `Instead of confirming a single explanation, it suggested multiple factors at work.`;
      case "cause_effect":
        return `As a result, subsequent conclusions relied less on speculation.`;
      case "example":
        return `That detail helped explain why later outcomes differed from earlier ones.`;
      case "qualification":
        return `In other contexts, however, the same evidence points to a different conclusion.`;
      case "problem_solution":
        return `After the revision, the results became more consistent across trials.`;
      default:
        return `Researchers continue to debate what the results imply.`;
    }
  })();

  const maybe3 = rng()<0.6 ? (()=>{
    switch(structure){
      case "contrast":
        return `This shift highlights how new methods can reshape interpretations.`;
      case "cause_effect":
        return `Even so, the researchers noted that the data remained limited.`;
      case "example":
        return `Still, the researchers cautioned against drawing broad conclusions from one case.`;
      case "qualification":
        return `This nuance matters because the claim is often repeated without context.`;
      case "problem_solution":
        return `The revised method also reduced the time needed to gather reliable data.`;
      default:
        return `Further work will clarify the pattern.`;
    }
  })() : null;

  const maybe4 = rng()<0.25 ? `Overall, the discussion emphasizes careful reasoning rather than quick certainty.` : null;

  const s = [s1,s2,maybe3,maybe4].filter(Boolean);
  return { text: s.join(" "), structure, hook };
}

function genRW(id, topic, diff){
  const dom = choice(domains);
  const passageObj = makePassage(dom.key);
  let passage = passageObj.text;

  // Vocabulary targets (pick a word we include)
  const vocabPairs = [
    ["promising","likely to succeed"],
    ["complicated","made more complex"],
    ["interpret","understand or explain"],
    ["speculation","guessing without firm evidence"],
    ["overlooked","failed to notice"],
    ["cautioned","warned"],
    ["nuance","subtle difference"],
    ["reliable","trustworthy"],
    ["emphasizes","stresses or highlights"]
  ];

  if(topic==="Main Idea"){
    const correct = `The passage suggests that the ${passageObj.hook} led to a more careful understanding of the situation.`;
    const distractors = [
      `The passage argues that the ${passageObj.hook} proved one explanation beyond doubt.`,
      `The passage mainly describes how the ${passageObj.hook} was abandoned as ineffective.`,
      `The passage claims that the ${passageObj.hook} is irrelevant to current research.`
    ];
    const {choices, answerIndex} = makeChoices(correct, distractors);
    return {
      id, section:"reading", topic, difficulty:diff,
      passage,
      question:"Which choice best states the main idea of the passage?",
      choices, answerIndex,
      explanation:"Main idea captures the passage’s overall point without adding new claims.",
      visual:null,
      meta:{ template:"rw_main_idea", params:{ domain: dom.key, structure: passageObj.structure } }
    };
  }

  if(topic==="Vocabulary in Context"){
    const [word, meaning] = choice(vocabPairs);
    // Ensure the target word actually appears in the passage in a coherent way.
    // We keep passages short (2–4 sentences) and SAT-like.
    const hasWord = new RegExp(`\\b${word}\\b`, "i").test(passage);
    if(!hasWord){
      const inserts = {
        "speculation": `Some critics dismissed the early conclusion as speculation rather than evidence.` ,
        "promising": `At first, the results seemed promising, but later analysis raised doubts.` ,
        "complicated": `Later findings complicated the initial impression, making simple conclusions harder to defend.` ,
        "interpret": `The team debated how best to interpret the results given the limited sample.` ,
        "overlooked": `A later review identified an overlooked variable that affected the outcome.` ,
        "cautioned": `The authors cautioned readers against treating the pattern as definitive.` ,
        "nuance": `A key nuance in the data suggested that context mattered more than expected.` ,
        "reliable": `The revision produced more reliable measurements across repeated trials.` ,
        "emphasizes": `Overall, the discussion emphasizes careful reasoning rather than quick certainty.`
      };
      const extra = inserts[word] || `In the discussion, the author uses the word ${word} to clarify the point.`;
      // Insert before the final sentence if possible to keep flow.
      const sents = passage.split(/(?<=[.!?])\s+/).filter(Boolean);
      if(sents.length >= 2){
        sents.splice(Math.min(2, sents.length), 0, extra);
        passage = sents.join(" ");
      } else {
        passage = `${passage} ${extra}`;
      }
    }
    const question = `As used in the passage, what does "${word}" most nearly mean?`;
    const correct = meaning;
    const distractors = [
      "completely finished",
      "strictly prohibited",
      "physically distant"
    ];
    const {choices, answerIndex} = makeChoices(correct, distractors);
    return {
      id, section:"reading", topic, difficulty:diff,
      passage,
      question,
      choices, answerIndex,
      explanation:"Choose the meaning that fits the sentence and tone.",
      visual:null,
      meta:{ template:"rw_vocab", params:{ word, correct } }
    };
  }

  if(topic==="Evidence"){
    // Evidence: choose best sentence to support a claim (we use sentence indices)
    const sents = passage.split(/(?<=[.!?])\s+/).filter(Boolean);
    const claim = `The author indicates that the ${passageObj.hook} did not point to a single simple explanation.`;
    // determine which sentence supports claim
    let bestIdx = 1; // usually s2
    if(sents.length>=3 && /multiple factors|multiple/.test(sents[1])) bestIdx = 1;
    const options = [
      `Sentence ${1}: "${sents[0]}"`,
      `Sentence ${2}: "${sents[1] ?? sents[0]}"`,
      `Sentence ${3}: "${sents[2] ?? sents[0]}"`,
      `Sentence ${4}: "${sents[3] ?? sents[0]}"`
    ];
    const correct = options[bestIdx];
    const distractors = options.filter((_,i)=>i!==bestIdx);
    const {choices, answerIndex} = makeChoices(correct, distractors);
    return {
      id, section:"reading", topic, difficulty:diff,
      passage,
      question:`Which choice provides the best evidence for the following claim?\n\n${claim}`,
      choices, answerIndex,
      explanation:"Select the sentence that most directly supports the claim.",
      visual:null,
      meta:{ template:"rw_evidence", params:{ bestIdx: bestIdx+1 } }
    };
  }

  if(topic==="Rhetorical Skills"){
    // Transition selection between two clauses (SAT-like)
    const before = `The ${passageObj.hook} raised new questions.`;
    const after = `researchers became less confident in a single explanation.`;
    const correct = choice(["Consequently","As a result","Therefore"]);
    const distractors = ["However","For example","In addition"];
    const {choices, answerIndex} = makeChoices(correct, distractors);
    return {
      id, section:"reading", topic, difficulty:diff,
      passage: `${before} ____ , ${after}`,
      question:"Which choice completes the text with the most logical transition?",
      choices, answerIndex,
      explanation:"Pick the transition that matches cause-and-effect.",
      visual:null,
      meta:{ template:"rw_transition", params:{ correct } }
    };
  }

  // Grammar
  const base = `The results of the ${passageObj.hook}`;
  const correctVerb = "were";
  const wrongVerb = "was";
  const question = `Which choice completes the text so that it conforms to the conventions of Standard English?\n\n${base} ____ more consistent after the revision.`;
  const correct = correctVerb;
  const distractors = [wrongVerb, "are", "is"];
  const {choices, answerIndex} = makeChoices(correct, distractors);
  return {
    id, section:"reading", topic:"Grammar", difficulty:diff,
    passage,
    question,
    choices, answerIndex,
    explanation:"Subject–verb agreement: 'results' is plural.",
    visual:null,
    meta:{ template:"rw_grammar_sva", params:{ correct } }
  };
}

/* ----------------------------- GENERATE ALL ----------------------------- */

function fill(section, topic, diff, gens){
  let n=0, tries=0;
  while(n<TARGET && tries<20000){
    tries++;
    const id = `${section}-${topic.replace(/\s+/g,"_").toLowerCase()}-${diff}-${String(n+1).padStart(3,"0")}`;
    const q = choice(gens)(id, diff);
    if(pushUnique(q)) n++;
  }
}

// Math
for(const diff of diffs){
  fill("math","Algebra", diff, [(id,d)=>genAlgebraLinear(id,d)]);
  fill("math","Geometry", diff, [
    (id,d)=>genGeometryRightTriangle(id,d),
    (id,d)=>genGeometryRectangle(id,d),
    (id,d)=>genGeometryCircle(id,d),
    (id,d)=>genCoordinateDistance(id,d),
  ]);
  fill("math","Data Analysis", diff, [
    (id,d)=>genDataBarMean(id,d),
    (id,d)=>genDataScatterCorrelation(id,d),
  ]);
  fill("math","Advanced Math", diff, [(id,d)=>genAdvancedQuadratic(id,d)]);
  fill("math","Problem Solving", diff, [(id,d)=>genProblemSolvingPercent(id,d)]);
}

// Reading/Writing (stored under section:"reading")
for(const diff of diffs){
  for(const topic of topicsRW){
    fill("reading", topic, diff, [(id,d)=>genRW(id, topic, d)]);
  }
}

const outPath = path.resolve("public/questions.json");
fs.mkdirSync(path.dirname(outPath), {recursive:true});
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`Generated ${out.length} questions (TARGET=${TARGET}, SEED=${SEED}) at ${outPath}`);
