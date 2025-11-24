import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Award } from 'lucide-react';

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
  secondaryCTA,
  secondaryLink,
}: HeroSectionProps) => {
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const words = title.split(' ');

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightedIndex((prev) => (prev + 1) % words.length);
    }, 400);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20 dark:opacity-10"
        >
          <source src="https://cdn.pixabay.com/video/2024/03/31/206294_large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light border border-primary/20">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Upwork Top Rated</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light border border-primary/20">
              <span className="text-sm font-medium text-foreground">🇳🇬 Nigeria-based</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            {words.map((word, index) => (
              <span
                key={index}
                className={`inline-block transition-all duration-300 ${
                  index === highlightedIndex
                    ? 'bg-primary text-primary-foreground px-2 py-1 rounded-md scale-105'
                    : ''
                }`}
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                {word}{' '}
              </span>
            ))}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto group">
              <Link to={primaryLink}>
                {primaryCTA}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            {secondaryCTA && secondaryLink && (
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link to={secondaryLink}>{secondaryCTA}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
};

export default HeroSection;
