/** Dependency-free validator for data/*.json (CI runs on every push). */
import { readFileSync } from "node:fs";

const errors = [];
const err = (m) => errors.push(m);
const biLang = (o, at, field, minLen = 0) => {
	for (const lang of ["en", "ru"]) {
		const v = o?.[field]?.[lang];
		if (typeof v !== "string" || v.length < minLen) err(`${at}: ${field}.${lang} missing/short`);
	}
};
const hasSources = (o, at) => {
	if (!Array.isArray(o.sources) || !o.sources.length) return err(`${at}: sources required`);
	for (const s of o.sources) if (!s.title || !/^https?:\/\//.test(s.url ?? "")) err(`${at}: bad source`);
};

// — vital-signs.json —
const v = JSON.parse(readFileSync(new URL("../data/vital-signs.json", import.meta.url), "utf8"));
if (v.meta?.license !== "CC-BY-4.0") err("vital-signs: meta.license must be CC-BY-4.0");
const SPECIES = new Set(["dog", "cat", "rabbit", "ferret", "guinea-pig", "hamster", "rat", "chinchilla", "parrot-small", "parrot-medium", "parrot-large", "red-eared-slider", "tortoise"]);
const PARAMS = new Set(["temperature_c", "heart_rate_bpm", "respiratory_rate_rpm", "crt_sec", "potz_c"]);
const STAGES = new Set(["neonate", "puppy", "kitten", "young", "adult", "senior", "all"]);
const ids = new Set();
for (const it of v.vitals ?? []) {
	const at = `vital "${it.id ?? "?"}"`;
	if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(it.id ?? "")) err(`${at}: bad id`);
	if (ids.has(it.id)) err(`${at}: duplicate id`); ids.add(it.id);
	if (!SPECIES.has(it.species)) err(`${at}: bad species "${it.species}"`);
	if (!PARAMS.has(it.parameter)) err(`${at}: bad parameter "${it.parameter}"`);
	if (!STAGES.has(it.life_stage)) err(`${at}: bad life_stage "${it.life_stage}"`);
	if (typeof it.normal_min !== "number" || typeof it.normal_max !== "number" || it.normal_min >= it.normal_max)
		err(`${at}: normal_min/max invalid`);
	biLang(it, at, "red_flag", 10);
	biLang(it, at, "notes", 20);
	hasSources(it, at);
}
if ((v.vitals ?? []).length < 40) err(`vital-signs: only ${(v.vitals ?? []).length} records (<40)`);

// — age-weight.json —
const w = JSON.parse(readFileSync(new URL("../data/age-weight.json", import.meta.url), "utf8"));
for (const row of w.age_conversion ?? []) {
	if (typeof row.pet_age_years !== "number" || typeof row.human_age_years !== "number")
		err(`age_conversion: non-numeric row (${JSON.stringify(row).slice(0, 60)})`);
}
if ((w.age_conversion ?? []).length < 25) err("age_conversion: too few rows");
for (const row of w.healthy_weight ?? []) {
	const at = `healthy_weight ${row.species}/${row.size_group ?? "-"}`;
	if (typeof row.min_kg !== "number" || typeof row.max_kg !== "number" || row.min_kg >= row.max_kg) err(`${at}: bad range`);
}
const bcs = w.body_condition_score ?? [];
if (bcs.length !== 9) err(`body_condition_score: expected 9 rows, got ${bcs.length}`);
for (const row of bcs) biLang(row, `bcs ${row.score}`, "description", 15);

if (errors.length) {
	console.error("FAILED:\n" + errors.map((e) => "  - " + e).join("\n"));
	process.exit(1);
}
console.log(`OK: ${v.vitals.length} vitals, ${w.age_conversion.length} age rows, ${w.healthy_weight.length} weight rows, ${bcs.length} BCS`);
