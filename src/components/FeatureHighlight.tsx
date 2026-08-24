import { CheckCircle2 } from 'lucide-react';
import { ReactNode } from 'react';

interface FeatureHighlightProps {
  label: string;
  title: string;
  description: string;
  bulletPoints: string[];
  imageFirst?: boolean;
  children?: ReactNode;
}

export default function FeatureHighlight({ 
  label, 
  title, 
  description, 
  bulletPoints, 
  imageFirst = false,
  children 
}: FeatureHighlightProps) {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${imageFirst ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-24`}>
          
          {/* Content Side */}
          <div className="flex-1 max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-purple-bg text-brand-purple font-semibold text-sm mb-6 tracking-wide uppercase">
              {label}
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-dark mb-6 leading-tight">
              {title}
            </h2>
            <p className="text-lg text-brand-text-gray mb-8 leading-relaxed">
              {description}
            </p>
            
            <ul className="space-y-4">
              {bulletPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 size={24} className="text-brand-purple flex-shrink-0 mt-0.5" />
                  <span className="text-brand-dark font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Image/Graphic Side */}
          <div className="flex-1 w-full max-w-2xl">
            <div className="relative">
               {/* Abstract decorative background blob */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-brand-purple-bg via-gray-50 to-white rounded-full blur-3xl -z-10"></div>
               
               {/* Custom Graphic passed as children */}
               <div className="relative z-10 bg-white p-4 md:p-8 rounded-3xl shadow-xl border border-gray-100">
                 {children}
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
