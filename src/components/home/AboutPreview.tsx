import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

const AboutPreview = () => {
  const highlights = [
    'Specialized in AI & Automation solutions',
    'Fullstack expertise with React, Django, FastAPI',
    'Experience with African and global clients',
    'Focus on practical, scalable solutions',
  ];

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Building Technology Solutions That Scale
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Sannex Technologies specializes in AI-powered automation, custom web applications, 
              and seamless integrations that help businesses operate more efficiently.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Based in Lagos, Nigeria, we work with churches, universities, startups, and 
              enterprises across Africa and globally, delivering solutions that combine 
              technical excellence with practical business value.
            </p>
            <div className="space-y-4 mb-8">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{highlight}</span>
                </div>
              ))}
            </div>
            <Button asChild size="lg">
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </div>

          <div className="relative animate-slide-up">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-light to-primary/10 p-8 flex items-center justify-center">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <div className="text-5xl font-bold text-foreground">200+</div>
                  <div className="text-muted-foreground">Developers Trained</div>
                </div>
                <div className="space-y-2">
                  <div className="text-5xl font-bold text-foreground">50+</div>
                  <div className="text-muted-foreground">Projects Delivered</div>
                </div>
                <div className="space-y-2">
                  <div className="text-5xl font-bold text-foreground">99.9%</div>
                  <div className="text-muted-foreground">Uptime Achieved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
