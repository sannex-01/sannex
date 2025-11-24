import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 md:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Have a project in mind?
          </h2>
          <p className="text-lg mb-8 opacity-90">
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
