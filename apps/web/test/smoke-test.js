const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('Running Web Frontend Smoke Test for Phase 2...');

// Verify essential files and components exist
const requiredFiles = [
  'package.json',
  'tsconfig.json',
  'next.config.mjs',
  'tailwind.config.ts',
  'postcss.config.mjs',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/globals.css',
  'src/app/api/health/route.ts',
  'src/lib/i18n/translations.ts',
  'src/lib/i18n/context.tsx',
  'src/components/Header.tsx',
  'src/components/HeroBanner.tsx',
  'src/components/CasinoCategories.tsx',
  'src/components/PopularGames.tsx',
  'src/components/SportsSection.tsx',
  'src/components/FeaturedEvents.tsx',
  'src/components/Promotions.tsx',
  'src/components/PlatformBenefits.tsx',
  'src/components/Footer.tsx',
  'src/components/BetSlipDrawer.tsx',
  'src/components/AuthModal.tsx',
  'src/components/SportsbookArena.tsx',
  'src/components/WalletModal.tsx',
];

for (const file of requiredFiles) {
  const fullPath = path.join(__dirname, '..', file);
  assert(fs.existsSync(fullPath), `Expected file missing: ${file}`);
}

// Verify package.json validity
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
assert.strictEqual(pkg.name, '@new-brand/web', 'Package name mismatch');
assert(pkg.dependencies.next, 'Next.js dependency missing');
assert(pkg.dependencies.react, 'React dependency missing');
assert(pkg.dependencies['lucide-react'], 'lucide-react dependency missing');

console.log('✅ Phase 2 Web Frontend smoke test passed successfully (all 9 components verified).');
process.exit(0);
