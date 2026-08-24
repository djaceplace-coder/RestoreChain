const fs = require('fs');
const pages = ["HowItWorks", "Integrations", "Calculator", "Professionals", "Prices", "WalletLookup", "PortfolioTracker", "Guide", "Glossary", "Blog", "Pricing", "Support"];

if (!fs.existsSync('src/pages')) {
  fs.mkdirSync('src/pages', { recursive: true });
}

pages.forEach(page => {
  const title = page.replace(/([A-Z])/g, ' $1').trim();
  const content = `export default function ${page}() {
  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-dark mb-6">
        ${title}
      </h1>
      <p className="text-xl text-brand-text-gray mb-10">
        This section is being developed as part of the RestoreChain platform build-out.
      </p>
    </div>
  );
}
`;
  fs.writeFileSync(`src/pages/${page}.tsx`, content);
});
console.log("Scaffolding complete.");
