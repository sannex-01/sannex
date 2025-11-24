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
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-background to-background opacity-50" />
      
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
            {title}
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
