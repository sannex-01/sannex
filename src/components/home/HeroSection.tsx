import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, CheckCircle } from 'lucide-react';
import VideoBackground from '@/components/VideoBackground';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  primaryCTA: string;
  primaryLink: string;
  secondaryCTA?: string;
  secondaryLink?: string;
}

const HeroSection = ({
  title,
  subtitle,
  primaryCTA,
  primaryLink,
}: HeroSectionProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
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
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <VideoBackground />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light border border-primary/20">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Upwork Top Rated</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light border border-primary/20">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">50+ Successful Contracts</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            {words.map((word, index) => (
              <span key={index} className="inline-block mr-3">
                <span
                  onMouseEnter={() => hasAnimated && setHoveredIndex(index)}
                  onMouseLeave={() => hasAnimated && setHoveredIndex(null)}
                  className={`inline-block transition-all duration-300 cursor-pointer ${
                    index === hoveredIndex
                      ? 'bg-primary text-primary-foreground px-2 py-1 rounded-md scale-105'
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
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto group">
              <a href={primaryLink} target="_blank" rel="noopener noreferrer">
                {primaryCTA}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
};

export default HeroSection;
