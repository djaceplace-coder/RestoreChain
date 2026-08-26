const fs = require('fs');
let content = fs.readFileSync('src/pages/Landing.tsx', 'utf8');

const innerContentRegex = /<div className="transition-all duration-500 ease-in-out transform">[\s\S]*?<\/p>/;
content = content.replace(innerContentRegex, `<div key={currentSlide} className="animate-fade-in flex flex-col items-center">
        <div className="transition-all duration-500 ease-in-out transform animate-slide-up">
          {slides[currentSlide].icon}
        </div>
        <h1 className="text-3xl font-display font-bold mb-4 tracking-tight animate-slide-up" style={{animationDelay: '100ms'}}>
          {slides[currentSlide].title}
        </h1>
        <p className="text-gray-400 text-base max-w-sm mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '200ms'}}>
          {slides[currentSlide].description}
        </p>
        </div>`);

fs.writeFileSync('src/pages/Landing.tsx', content);
