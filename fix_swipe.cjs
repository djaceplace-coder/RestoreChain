const fs = require('fs');
let content = fs.readFileSync('src/pages/Landing.tsx', 'utf8');

// We'll add a simple swipe handler to the carousel content
const stateRegex = /const \[currentSlide, setCurrentSlide\] = useState\(0\);/;
content = content.replace(stateRegex, `const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe && currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  }`);

const contentRegex = /<div className="flex-1 flex flex-col items-center justify-center px-6 text-center z-10">/;
content = content.replace(contentRegex, `<div 
        className="flex-1 flex flex-col items-center justify-center px-6 text-center z-10 w-full touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEndHandler}
      >`);

fs.writeFileSync('src/pages/Landing.tsx', content);
