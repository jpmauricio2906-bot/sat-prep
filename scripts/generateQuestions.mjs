
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
    // SVGFigure expects params { radius, angle }
    visual:{ type:"svg", shape:"circle_arc", params:{radius:r, angle:360} },
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
    // SVGFigure expects points as array of [x,y] tuples.
    visual:{ type:"svg", shape:"coordinate_plane", params:{points:[[x1,y1],[x2,y2]]} },
    meta:{ template:"distance_formula", params:{dx,dy,dist:distRounded} }
  };
}

function genReadingTopic(rng, id, topic, diff){
  // Digital SAT-style mini passages (2–4 sentences) across 6 domains:
  // Science, History, Social Science, Humanities, Literature, Technology.
  // Items are template-driven (not placeholders) with plausible distractors.

  const domains = ["Science","History","Social Science","Humanities","Literature","Technology"];

  // Sentence/idea pools per domain to create varied, SAT-like mini passages.
  const POOLS = {
    "Science": {
      subjects: ["ecologists","astronomers","neuroscientists","chemists","climatologists","biologists"],
      topics: ["pollinator networks","exoplanet atmospheres","memory consolidation","catalyst efficiency","urban heat islands","microbial communities"],
      verbs: ["observed","measured","modeled","tested","analyzed","replicated"],
      findings: [
        "the effect was strongest under low-light conditions",
        "the pattern disappeared when the sample size increased",
        "the results varied across regions with different rainfall",
        "the new method reduced error without increasing cost",
        "the trend reversed when the variable was held constant",
        "the effect persisted even after controlling for temperature"
      ]
    },
    "History": {
      subjects: ["archivists","historians","diplomats","reformers","journalists","legislators"],
      topics: ["trade policy","labor protections","public education","urban sanitation","postal networks","voting reforms"],
      verbs: ["argued","reported","documented","debated","proposed","criticized"],
      findings: [
        "the policy’s impact differed sharply between rural and urban areas",
        "the compromise satisfied neither faction completely",
        "the reform’s success depended on local enforcement",
        "public opinion shifted after a widely circulated pamphlet",
        "the measure was framed as temporary but lasted for decades",
        "implementation lagged despite strong rhetoric"
      ]
    },
    "Social Science": {
      subjects: ["sociologists","economists","psychologists","anthropologists","policy analysts","survey researchers"],
      topics: ["risk perception","student motivation","household budgeting","community trust","workplace collaboration","social media habits"],
      verbs: ["found","estimated","surveyed","interviewed","compared","tracked"],
      findings: [
        "participants overestimated rare events after vivid examples",
        "small incentives changed behavior more than large warnings",
        "the effect weakened when choices were presented simultaneously",
        "self-reports diverged from observed behavior",
        "the relationship held only for first-time participants",
        "results depended on how the question was framed"
      ]
    },
    "Humanities": {
      subjects: ["critics","curators","linguists","philosophers","art historians","essayists"],
      topics: ["modernist poetry","public monuments","translation choices","musical improvisation","museum lighting","aesthetic theory"],
      verbs: ["claimed","noted","interpreted","contrasted","emphasized","questioned"],
      findings: [
        "the work invites multiple interpretations rather than a single message",
        "the style prioritizes texture and rhythm over narrative clarity",
        "the argument challenges a common assumption about authenticity",
        "the author uses contrast to highlight a subtle tension",
        "the example complicates an otherwise straightforward claim",
        "the analysis shifts attention from content to form"
      ]
    },
    "Literature": {
      subjects: ["the narrator","the protagonist","the speaker","the author","a character","the storyteller"],
      topics: ["a missed opportunity","an unexpected reunion","a difficult choice","a quiet confession","a turning point","a lingering doubt"],
      verbs: ["admits","recalls","describes","reveals","suggests","implies"],
      findings: [
        "the tone moves from certainty to hesitation",
        "the description underscores the character’s isolation",
        "the scene hints at conflict without stating it directly",
        "the imagery creates a sense of urgency",
        "the dialogue exposes an unspoken motive",
        "the ending reframes the earlier events"
      ]
    },
    "Technology": {
      subjects: ["engineers","designers","developers","research teams","manufacturers","startups"],
      topics: ["battery management","data compression","privacy settings","sensor calibration","recommendation systems","cloud reliability"],
      verbs: ["released","optimized","tested","updated","benchmarked","debugged"],
      findings: [
        "the update improved performance but increased energy use",
        "users preferred transparency even when it reduced convenience",
        "the system failed mostly under peak demand",
        "small design changes reduced errors dramatically",
        "the model generalized poorly outside its training data",
        "latency dropped after the pipeline was simplified"
      ]
    }
  };

  const domain = choice(rng, domains);
  const P = POOLS[domain];

  // Build a 2–4 sentence passage with mild variation.
  const subj = choice(rng, P.subjects);
  const top  = choice(rng, P.topics);
  const v    = choice(rng, P.verbs);
  const fin  = choice(rng, P.findings);

  const structures = ["cause_effect","contrast","example","concession"];
  const structure = choice(rng, structures);

  let s1="", s2="", s3="", s4="";
  if (structure === "cause_effect") {
    s1 = `${subj} ${v} ${top} to better understand how small changes can produce large outcomes.`;
    s2 = `They found that ${fin}.`;
    s3 = `This suggests that the phenomenon is sensitive to context rather than governed by a single rule.`;
  } else if (structure === "contrast") {
    s1 = `${subj} often describe ${top} in broad terms, but recent work focuses on specific mechanisms.`;
    s2 = `In one analysis, ${fin}.`;
    s3 = `The contrast highlights how general claims can miss important details.`;
  } else if (structure === "example") {
    s1 = `${subj} use ${top} as an example of how methods influence conclusions.`;
    s2 = `For instance, ${fin}.`;
    s3 = `The example shows why interpreting results requires attention to procedure.`;
  } else { // concession
    s1 = `Although ${top} seems straightforward at first glance, ${subj} argue that it is more complex in practice.`;
    s2 = `In particular, ${fin}.`;
    s3 = `Even so, the broader pattern remains useful for generating new hypotheses.`;
  }

  // 2–4 sentences
  const passageSentences = shuffle(rng, [s1, s2, s3].filter(Boolean)).slice(0, randInt(rng,2,3));
  const passage = passageSentences.join(" ");

  function makeChoices(correct, distractors){
    const opts = shuffle(rng, [correct, ...distractors].slice(0,4));
    return { choices: opts, answerIndex: opts.indexOf(correct) };
  }

  // --- Topic templates ---
  if (topic === "Main Idea") {
    const correct = `The passage explains a recent perspective on ${top} and emphasizes that ${fin}.`;
    const tooNarrow = `The passage lists several definitions of ${top}.`;
    const tooBroad  = `The passage argues that all research methods are equally effective.`;
    const offTopic  = `The passage describes a personal experience unrelated to research.`;
    const {choices, answerIndex} = makeChoices(correct, [tooNarrow, tooBroad, offTopic]);
    return {
      id, section:"reading", topic, difficulty:diff,
      passage,
      question:"Which choice best states the main idea of the text?",
      choices, answerIndex,
      explanation:"Main idea questions ask for the overall point, not a minor detail.",
      visual:null,
      meta:{ template:"rw_main_idea", params:{domain, structure, top, fin, correct} }
    };
  }

  if (topic === "Vocabulary in Context") {
    const vocabSet = [
      {w:"consequently", correct:"as a result", ds:["in contrast","for example","in the meantime"]},
      {w:"notably", correct:"in particular", ds:["rarely","suddenly","carelessly"]},
      {w:"mitigate", correct:"reduce", ds:["predict","exaggerate","ignore"]},
      {w:"plausible", correct:"seemingly reasonable", ds:["strictly illegal","highly confusing","completely finished"]},
      {w:"retain", correct:"keep", ds:["replace","explain","celebrate"]},
      {w:"refine", correct:"improve by making small changes", ds:["hide from view","argue against","remove entirely"]}
    ];
    const v = choice(rng, vocabSet);

    // Insert target word into a short sentence based on the passage theme
    const sent = `In discussing ${top}, the author suggests that researchers should ${v.w} their assumptions rather than treat them as fixed.`;
    const fullPassage = passage + " " + sent;

    const {choices, answerIndex} = makeChoices(v.correct, v.ds);
    return {
      id, section:"reading", topic, difficulty:diff,
      passage: fullPassage,
      question:`As used in the text, what does "${v.w}" most nearly mean?`,
      choices, answerIndex,
      explanation:"Vocabulary-in-context asks for the meaning in this specific sentence.",
      visual:null,
      meta:{ template:"rw_vocab", params:{word:v.w, correct:v.correct, domain} }
    };
  }

  if (topic === "Evidence") {
    // We’ll ask for the sentence that best supports a claim.
    const claim = `The passage suggests that context can strongly influence findings about ${top}.`;
    const evidence = choice(rng, passageSentences);
    const d1 = `Some researchers consider ${top} a settled topic and therefore avoid new studies.`;
    const d2 = `The passage includes a definition of ${top} that is unrelated to the claim.`;
    const d3 = `The author describes a historical origin of ${top} without discussing evidence.`;
    const {choices, answerIndex} = makeChoices(`"${evidence}"`, [`"${d1}"`, `"${d2}"`, `"${d3}"`]);
    return {
      id, section:"reading", topic, difficulty:diff,
      passage,
      question: `${claim} Which choice provides the best evidence for this claim?`,
      choices, answerIndex,
      explanation:"Evidence questions ask for the line that directly supports the stated claim.",
      visual:null,
      meta:{ template:"rw_evidence", params:{domain, top, evidence, correct:`"${evidence}"`} }
    };
  }

  if (topic === "Rhetorical Skills") {
    // Transition / logical connection
    const transitions = [
      {t:"However,", role:"contrast"},
      {t:"Therefore,", role:"cause_effect"},
      {t:"For example,", role:"example"},
      {t:"Similarly,", role:"comparison"}
    ];
    const correctObj = choice(rng, transitions);

    const p1 = `${subj} have proposed several explanations for ${top}.`;
    const p2 = `${fin}.`;
    const p3 = `This detail helps readers understand the author’s point.`;
    const passage2 = `${p1} [BLANK] ${p2} ${p3}`;

    const distractors = shuffle(rng, transitions.filter(x=>x.t!==correctObj.t)).slice(0,3).map(x=>x.t);
    const {choices, answerIndex} = makeChoices(correctObj.t, distractors);

    return {
      id, section:"reading", topic, difficulty:diff,
      passage: passage2,
      question:"Which choice best fills in the blank to create the most logical transition?",
      choices, answerIndex,
      explanation:"Transitions must match the logical relationship between sentences.",
      visual:null,
      meta:{ template:"rw_transition", params:{correctTransition:correctObj.t, correct:correctObj.t, domain, top} }
    };
  }

  // Grammar
  if (topic === "Grammar") {
    // Create a sentence with a common, checkable grammar issue.
    const grammars = [
      {
        type:"sv_agreement",
        stem:`The list of items ___ on the desk.`,
        correct:"is",
        ds:["are","were","be"]
      },
      {
        type:"pronoun_antecedent",
        stem:`When the committee finished the report, ___ was published online.`,
        correct:"it",
        ds:["they","them","their"]
      },
      {
        type:"comma_splice",
        stem:`The experiment ended early, ___ the equipment overheated.`,
        correct:"because",
        ds:["and","however","so"]
      },
      {
        type:"modifier",
        stem:`___, the results surprised the researchers.`,
        correct:"After reviewing the data",
        ds:["To review the data","Reviewing data is","The data was reviewed"]
      }
    ];
    const g = choice(rng, grammars);
    const question = `Which choice completes the text so that it conforms to the conventions of Standard English?`;
    const {choices, answerIndex} = makeChoices(g.correct, g.ds);

    return {
      id, section:"reading", topic, difficulty:diff,
      passage: g.stem,
      question,
      choices, answerIndex,
      explanation:"Grammar questions test standard English conventions.",
      visual:null,
      meta:{ template:"rw_grammar", params:{type:g.type, correct:g.correct} }
    };
  }

  // Fallback (should never hit)
  const {choices, answerIndex} = makeChoices("A", ["B","C","D"]);
  return {
    id, section:"reading", topic, difficulty:diff,
    passage,
    question:"Which choice best completes the text?",
    choices, answerIndex,
    explanation:"Generated fallback.",
    visual:null,
    meta:{ template:"rw_fallback", params:{domain} }
  };
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
