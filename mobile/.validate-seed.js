/**
 * Runtime validation of SEED_RECIPES against the Zod schema.
 * Disposable dev tool — delete after the seed stabilises.
 */

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const root = __dirname;
// Use a scratch dir under the mobile project so Node can resolve `zod`
// (require walks up to the nearest node_modules). But use a timestamped
// name so we don't fight the OS over stale perms from a prior run.
const tmp = path.join(root, `.validate-tmp-${Date.now()}`);
fs.mkdirSync(tmp, { recursive: true });

const files = [
  'src/data/types.ts',
  'src/data/scale.ts',
  'src/data/seed-recipes.ts',
];

for (const rel of files) {
  const src = fs.readFileSync(path.join(root, rel), 'utf8');
  const out = ts.transpileModule(src, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
      skipLibCheck: true,
    },
  }).outputText;
  const jsRel = rel.replace(/\.ts$/, '.js');
  const dest = path.join(tmp, jsRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, out);
}

const { SEED_RECIPES } = require(path.join(tmp, 'src/data/seed-recipes.js'));
const { Recipe } = require(path.join(tmp, 'src/data/types.js'));
const {
  scaleIngredient,
  LEFTOVER_OPTIONS,
  totalPortionsFor,
  formatAmount,
} = require(path.join(tmp, 'src/data/scale.js'));

// 1. Schema pass
let failures = 0;
for (const raw of SEED_RECIPES) {
  const parsed = Recipe.safeParse(raw);
  if (!parsed.success) {
    failures += 1;
    const issue = parsed.error.issues[0];
    console.error(
      `FAIL ${raw.id || '(no id)'} — ${issue.path.join('.')}: ${issue.message}`,
    );
  }
}
if (failures > 0) {
  console.error(`\n${failures} recipe(s) failed validation.`);
  process.exit(1);
}

console.log(`Schema: OK (${SEED_RECIPES.length} recipes)`);

// 2. Custom-curve sanity check — risotto stock and sourdough water
const risotto = SEED_RECIPES.find((r) => r.id === 'risotto');
const stock = risotto.ingredients.find((i) => i.scales === 'custom');
if (!stock) {
  console.error('FAIL: risotto has no custom-scaling ingredient');
  process.exit(1);
}
console.log(
  `\nRisotto "${stock.name}" curve:`,
  Object.keys(stock.curve)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => `${k}→${stock.curve[k]}`)
    .join(', '),
);
for (const target of [1, 2, 4, 6, 8]) {
  const amt = scaleIngredient(stock, target, risotto.base_servings);
  console.log(`  ${target} servings → ${formatAmount(amt)} ${stock.unit}`);
}

// 3. Leftover modes math
console.log('\nLeftover modes (base_servings=2, people=4):');
for (const opt of LEFTOVER_OPTIONS) {
  const t = totalPortionsFor(opt, 4, 2);
  const math = typeof opt.multiplier === 'number'
    ? `${opt.multiplier} × 2`
    : `4 + ${opt.extra ?? 0}`;
  console.log(`  ${opt.id.padEnd(10)} (${math}) → ${t} portions`);
}

// 4. Round-trip cornerstone — smash burger ingredient scaling at "lunch" for 4 people
const burger = SEED_RECIPES.find((r) => r.id === 'smash-burger');
const lunch = LEFTOVER_OPTIONS.find((o) => o.id === 'lunch');
const totalPeople = totalPortionsFor(lunch, 4, burger.base_servings);
console.log(`\nSmash burger for 4 people + lunches (${totalPeople} portions):`);
for (const ing of burger.ingredients) {
  const scaled = scaleIngredient(ing, totalPeople, burger.base_servings);
  console.log(
    `  ${formatAmount(scaled).padStart(6)} ${ing.unit.padEnd(4)} ${ing.name} (${ing.scales})`,
  );
}

console.log('\nAll checks passed.');
process.exit(0);
