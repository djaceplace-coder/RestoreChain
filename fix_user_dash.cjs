const fs = require('fs');

function forceAssets(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /let { data: userPortfolios, error: pErr } = await supabase\s*\.from\('portfolios'\)\s*\.select\('\*'\)\s*\.eq\('user_id', user\.id\);\s*if \(pErr \|\| !userPortfolios\) \{\s*const { data: fallbackAssets } = await supabase\s*\.from\('assets'\)\s*\.select\('\*'\)\s*\.eq\('user_id', user\.id\);\s*userPortfolios = fallbackAssets \|\| \[\];\s*\}/g,
    "let { data: userPortfolios, error: pErr } = await supabase.from('portfolios').select('*').eq('user_id', user.id);\nif (pErr || !userPortfolios || userPortfolios.length === 0) {\n  const { data: fallbackAssets } = await supabase.from('assets').select('*').eq('user_id', user.id);\n  userPortfolios = fallbackAssets || [];\n  if (userPortfolios.length === 0) {\n    // If both are empty, check if admin provisioned via profiles total_balance\n    if (profile && profile.total_balance > 0) {\n      userPortfolios = [{ symbol: 'BTC', balance: profile.total_balance / 70000, value: profile.total_balance }];\n    }\n  }\n}"
  );
  fs.writeFileSync(file, content);
}

forceAssets('src/pages/dashboard/Overview.tsx');
forceAssets('src/pages/dashboard/Portfolio.tsx');
console.log("Fixed dashboard fallback");
