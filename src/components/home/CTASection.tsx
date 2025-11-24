import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const title = "Have a project in mind?";
  const words = title.split(' ');

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setHoveredIndex(currentIndex);
        currentIndex++;
      } else {
        clearInterval(interval);
        setHasAnimated(true);
        setHoveredIndex(null);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-primary/95 z-0" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-foreground leading-tight">
            {words.map((word, index) => (
              <span key={index} className="inline-block mr-3">
                <span
                  onMouseEnter={() => hasAnimated && setHoveredIndex(index)}
                  onMouseLeave={() => hasAnimated && setHoveredIndex(null)}
                  className={`inline-block transition-all duration-300 cursor-pointer ${
                    index === hoveredIndex
                      ? 'bg-background text-foreground px-2 py-1 rounded-md scale-105'
                      : ''
                  }`}
                  style={{
                    transitionDelay: `${index * 50}ms`,
                  }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h2>
          <p className="text-lg mb-8 text-primary-foreground/90">
            Let's discuss how we can help you build AI-powered solutions, automate workflows, 
            or develop custom applications that drive your business forward.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="group"
          >
            <Link to="/contact">
              Contact Sannex
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
