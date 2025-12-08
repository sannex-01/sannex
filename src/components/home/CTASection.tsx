import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import VideoBackground from '@/components/VideoBackground';

const CTASection = () => {
  const { t } = useTranslation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const title = t('cta.heading');
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
      <VideoBackground />
      <div className="absolute inset-0 bg-primary/80 z-[5]" />
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
            {t('cta.subtitle')}
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="group"
          >
            <a href="https://calendly.com/sannex/book-free-consultation" target="_blank" rel="noopener noreferrer">
              {t('cta.button')}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
