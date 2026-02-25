import fs from "fs";
import path from "path";

/**
 * Question Validator v1.0
 * - Validates schema
 * - Detects duplicates (fingerprint)
 * - Enforces visual requirements by topic
 * - Verifies answers + visuals for templated questions (meta.template !== 'manual')
 * - Outputs:
 *    public/question_issues.json
 *    public/question_matrix.csv
 */

const ROOT = process.cwd();
const QUESTIONS_PATH = path.join(ROOT, "public", "questions.json");
const OUT_ISSUES = path.join(ROOT, "public", "question_issues.json");
const OUT_MATRIX = path.join(ROOT, "public", "question_matrix.csv");

// Target minimum per (section, topic, difficulty) bucket.
// This is a *warning*, not a hard build failure by default.
const TARGET_PER_BUCKET = 40;

const norm = (s) => String(s ?? "").trim().toLowerCase().replace(/\s+/g, " ");
const safeNum = (x) => {
  const n = Number(String(x).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
};

function fingerprint(q) {
  const choices = Array.isArray(q.choices) ? q.choices.map(norm).join("|") : "";
  const params = q.meta?.params ? JSON.stringify(q.meta.params) : "";
  return [q.section, q.topic, q.difficulty, norm(q.question), choices, params].join("::");
}

function reduceFraction(n, d) {
  const g = (a,b)=> b===0 ? a : g(b, a%b);
  const gg = g(Math.abs(n), Math.abs(d));
  return [n/gg, d/gg];
}

function solveExpected(q) {
  const t = q.meta?.template;
  const p = q.meta?.params || {};
  const v = q.visual || null;

  switch (t) {
    case "linear_equation_ax_plus_b": {
      const a = Number(p.a), b = Number(p.b), c = Number(p.c);
      if (!Number.isFinite(a) || a === 0) return { kind: "unknown" };
      return { kind: "number", value: (c - b) / a };
    }
    case "x_minus_k_equals_c": {
      const k = Number(p.k), c = Number(p.c);
      return Number.isFinite(k) && Number.isFinite(c) ? { kind: "number", value: k + c } : { kind: "unknown" };
    }
    case "double_x": {
      const x = Number(p.x);
      return Number.isFinite(x) ? { kind: "number", value: 2 * x } : { kind: "unknown" };
    }
    case "y_intercept_line": {
      const b = Number(p.b);
      return Number.isFinite(b) ? { kind: "number", value: b } : { kind: "unknown" };
    }
    case "area_rectangle": {
      const w = Number(p.w), h = Number(p.h);
      return Number.isFinite(w) && Number.isFinite(h) ? { kind: "number", value: w * h } : { kind: "unknown" };
    }
    case "perimeter_square": {
      const s = Number(p.s);
      return Number.isFinite(s) ? { kind: "number", value: 4 * s } : { kind: "unknown" };
    }
    case "pythagorean_hypotenuse": {
      const a = Number(p.a), b = Number(p.b);
      return Number.isFinite(a) && Number.isFinite(b) ? { kind: "number", value: Math.sqrt(a*a + b*b) } : { kind: "unknown" };
    }
    case "circumference": {
      const r = Number(p.r), pi = Number(p.pi ?? 3.14);
      return Number.isFinite(r) && Number.isFinite(pi) ? { kind: "number", value: 2 * pi * r } : { kind: "unknown" };
    }
    case "cylinder_volume": {
      const r = Number(p.r), h = Number(p.h), pi = Number(p.pi ?? 3.14);
      return Number.isFinite(r) && Number.isFinite(h) && Number.isFinite(pi) ? { kind: "number", value: pi * r * r * h } : { kind: "unknown" };
    }
    case "arc_length": {
      const r = Number(p.r), angle = Number(p.angle), pi = Number(p.pi ?? 3.14);
      return Number.isFinite(r) && Number.isFinite(angle) && Number.isFinite(pi)
        ? { kind: "number", value: (angle / 360) * 2 * pi * r }
        : { kind: "unknown" };
    }
    case "scatter_correlation_description": {
      if (!v || v.type !== "chart" || v.chartType !== "scatter" || !Array.isArray(v.data) || v.data.length < 2) {
        return { kind: "unknown" };
      }
      const xs = v.data.map(pt => Number(pt.x));
      const ys = v.data.map(pt => Number(pt.y));
      if (xs.some(x => !Number.isFinite(x)) || ys.some(y => !Number.isFinite(y))) return { kind: "unknown" };
      const mean = arr => arr.reduce((a,b)=>a+b,0)/arr.length;
      const mx = mean(xs), my = mean(ys);
      let num = 0, dx = 0, dy = 0;
      for (let i=0;i<xs.length;i++){
        const a = xs[i]-mx, b = ys[i]-my;
        num += a*b; dx += a*a; dy += b*b;
      }
      const corr = num / Math.sqrt(dx*dy);
      return { kind: "corr", value: corr };
    }
    case "fraction_from_table_female_math": {
      if (!v || v.type !== "table" || !Array.isArray(v.headers) || !Array.isArray(v.rows)) return { kind: "unknown" };
      const headers = v.headers.map(String);
      const mathIdx = headers.indexOf("Math") >= 0 ? headers.indexOf("Math") : 1;
      const female = v.rows.find(r => String(r?.[0] ?? "").toLowerCase().startsWith("female"));
      if (!female) return { kind: "unknown" };
      const num = safeNum(female[mathIdx]);
      const den = safeNum(female[female.length-1]);
      if (num === null || den === null || den === 0) return { kind: "unknown" };
      const [rn, rd] = reduceFraction(num, den);
      return { kind: "fraction", value: `${rn}/${rd}` };
    }
    case "r_value_from_description": {
      return { kind: "heuristic_r" };
    }
    default:
      return { kind: "unknown" };
  }
}

function visualIssues(q) {
  const issues = [];
  const v = q.visual || null;

  if (q.topic === "Geometry") {
    if (!v || v.type !== "svg") issues.push("Geometry questions should include an SVG figure (visual.type='svg').");
  }
  if (q.topic === "Data Analysis") {
    if (!v || !["chart","table"].includes(v.type)) issues.push("Data Analysis questions should include a chart or table (visual.type='chart'|'table').");
  }

  const t = q.meta?.template;
  const p = q.meta?.params || {};

  if (t === "area_rectangle") {
    if (!v || v.type !== "svg" || v.shape !== "rectangle") issues.push("Rectangle area template expects visual.shape='rectangle'.");
    else {
      if (v.params?.w !== p.w || v.params?.h !== p.h) issues.push("Rectangle visual params mismatch vs meta.params (w/h).");
    }
  }
  if (t === "pythagorean_hypotenuse") {
    if (!v || v.type !== "svg" || v.shape !== "right_triangle") issues.push("Pythagorean template expects visual.shape='right_triangle'.");
    else {
      if (v.params?.a !== p.a || v.params?.b !== p.b) issues.push("Right triangle visual params mismatch vs meta.params (a/b).");
    }
  }
  if (t === "y_intercept_line") {
    if (!v || v.type !== "svg" || v.shape !== "coordinate_plane") issues.push("Line/intercept template expects a coordinate plane SVG.");
  }
  if (t === "scatter_correlation_description") {
    if (!v || v.type !== "chart" || v.chartType !== "scatter") issues.push("Scatter correlation template expects a scatter chart visual.");
  }

  return issues;
}

function answerIssues(q, expected) {
  const issues = [];
  if (!Array.isArray(q.choices) || q.choices.length !== 4) return issues;
  if (typeof q.answerIndex !== "number" || q.answerIndex < 0 || q.answerIndex > 3) return issues;

  const chosen = q.choices[q.answerIndex];

  if (expected.kind === "number") {
    const n = safeNum(chosen);
    if (n === null) issues.push(`Expected numeric answer but correct choice is non-numeric: "${chosen}".`);
    else {
      const ok = Math.abs(n - expected.value) <= 1e-6 || Math.abs(n - expected.value) <= 0.02;
      if (!ok) issues.push(`Answer mismatch: expected ≈ ${expected.value}, got "${chosen}".`);
    }
  } else if (expected.kind === "fraction") {
    const expF = expected.value.split("/");
    const [en, ed] = expF.map(Number);
    const chF = String(chosen).split("/");
    if (chF.length === 2) {
      const [cn, cd] = chF.map(Number);
      if (Number.isFinite(cn) && Number.isFinite(cd) && cd !== 0) {
        const [rn, rd] = reduceFraction(cn, cd);
        if (!(rn === en && rd === ed)) issues.push(`Fraction mismatch: expected ${expected.value}, got "${chosen}".`);
      } else issues.push(`Fraction mismatch: expected ${expected.value}, got "${chosen}".`);
    } else issues.push(`Fraction mismatch: expected ${expected.value}, got "${chosen}".`);
  } else if (expected.kind === "corr") {
    const corr = expected.value;
    const desc = (() => {
      if (Math.abs(corr) < 0.2) return "No correlation";
      const strong = Math.abs(corr) >= 0.7;
      if (corr > 0) return strong ? "Strong positive correlation" : "Weak positive correlation";
      return strong ? "Strong negative correlation" : "Weak negative correlation";
    })();
    if (norm(chosen) !== norm(desc)) issues.push(`Correlation description mismatch: expected "${desc}" from chart, got "${chosen}".`);
  } else if (expected.kind === "heuristic_r") {
    const qn = norm(q.question);
    const nums = q.choices.map(c => safeNum(c));
    if (nums.every(n => n === null)) return issues;
    if (qn.includes("strong positive")) {
      let bestIdx = -1, best = -Infinity;
      nums.forEach((n, idx) => { if (n !== null && n > best) { best = n; bestIdx = idx; }});
      if (bestIdx >= 0 && q.answerIndex !== bestIdx) issues.push(`r-value mismatch (heuristic): strong positive → expected "${q.choices[bestIdx]}".`);
    }
    if (qn.includes("strong negative")) {
      let bestIdx = -1, best = Infinity;
      nums.forEach((n, idx) => { if (n !== null && n < best) { best = n; bestIdx = idx; }});
      if (bestIdx >= 0 && q.answerIndex !== bestIdx) issues.push(`r-value mismatch (heuristic): strong negative → expected "${q.choices[bestIdx]}".`);
    }
  }

  return issues;
}

function validate() {
  const questions = JSON.parse(fs.readFileSync(QUESTIONS_PATH, "utf8"));

  const issues = [];
  const matrixRows = [];
  const fpSeen = new Map();

  // Bucket counts
  const bucket = new Map();
  for (const q of questions) {
    const key = `${q.section}||${q.topic}||${q.difficulty}`;
    bucket.set(key, (bucket.get(key) || 0) + 1);
  }
  for (const [key, count] of bucket.entries()) {
    if (count < TARGET_PER_BUCKET) {
      issues.push({ type: "bucket_size", bucket: key, errors: [`Bucket has ${count} questions; target is ${TARGET_PER_BUCKET}.`] });
    }
  }

  for (const q of questions) {
    const errs = [];

    if (!q.id) errs.push("Missing id");
    if (!q.section) errs.push("Missing section");
    if (!q.topic) errs.push("Missing topic");
    if (!q.difficulty) errs.push("Missing difficulty");
    if (!q.question) errs.push("Missing question text");
    if (!Array.isArray(q.choices) || q.choices.length !== 4) errs.push("choices must be an array of length 4");
    if (typeof q.answerIndex !== "number" || q.answerIndex < 0 || q.answerIndex > 3) errs.push("answerIndex must be 0..3");

    const fp = fingerprint(q);
    if (fpSeen.has(fp)) errs.push(`Duplicate fingerprint (matches id=${fpSeen.get(fp)})`);
    else fpSeen.set(fp, q.id);

    errs.push(...visualIssues(q));

    const exp = solveExpected(q);
    if (q.meta?.template && q.meta.template !== "manual") {
      if (exp.kind === "unknown") errs.push(`Template "${q.meta.template}" could not be validated (missing params/visual).`);
      else errs.push(...answerIssues(q, exp));
    }

    if (errs.length) {
      issues.push({
        type: "question",
        id: q.id,
        section: q.section,
        topic: q.topic,
        difficulty: q.difficulty,
        template: q.meta?.template ?? null,
        errors: errs,
        question: q.question,
      });
    }

    matrixRows.push({
      id: q.id ?? "",
      section: q.section ?? "",
      topic: q.topic ?? "",
      difficulty: q.difficulty ?? "",
      template: q.meta?.template ?? "",
      hasVisual: q.visual ? "yes" : "no",
      visualType: q.visual?.type ?? "",
      visualDetail: q.visual?.shape ?? q.visual?.chartType ?? "",
      answerIndex: String(q.answerIndex ?? ""),
      correctChoice: Array.isArray(q.choices) && typeof q.answerIndex === "number" ? String(q.choices[q.answerIndex] ?? "") : "",
      fingerprint: fp,
    });
  }

  const out = {
    generatedAt: new Date().toISOString(),
    targetPerBucket: TARGET_PER_BUCKET,
    totalQuestions: questions.length,
    issueCount: issues.length,
    issues,
  };
  fs.writeFileSync(OUT_ISSUES, JSON.stringify(out, null, 2));

  const headers = Object.keys(matrixRows[0] || { id: "" });
  const lines = [headers.join(",")];
  for (const r of matrixRows) {
    const row = headers.map(h => {
      const v = String(r[h] ?? "");
      const escaped = (v.includes(",") || v.includes("\"") || v.includes("\n")) ? `"${v.replace(/"/g,'""')}"` : v;
      return escaped;
    }).join(",");
    lines.push(row);
  }
  fs.writeFileSync(OUT_MATRIX, lines.join("\n"));

  console.log(`Questions validated: ${questions.length}`);
  console.log(`Issues found: ${issues.length}`);
  console.log(`Wrote: public/question_issues.json and public/question_matrix.csv`);
}

validate();
