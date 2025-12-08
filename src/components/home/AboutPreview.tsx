import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';

const AboutPreview = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  
  const highlights = [
    t('about.highlight1'),
    t('about.highlight2'),
    t('about.highlight3'),
    t('about.highlight4'),
  ];

  return (
    <section className="py-20 md:py-40 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t('about.heading')}
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              {t('about.paragraph1')}
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              {t('about.paragraph2')}
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
              <Link to={`/${currentLang}/about`}>{t('about.learnMore')}</Link>
            </Button>
          </div>

          <div className="relative animate-slide-up">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-light to-primary/10 p-8 flex items-center justify-center">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <div className="text-5xl font-bold text-foreground">200+</div>
                  <div className="text-muted-foreground">{t('about.stat1')}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-5xl font-bold text-foreground">50+</div>
                  <div className="text-muted-foreground">{t('about.stat2')}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-5xl font-bold text-foreground">99.9%</div>
                  <div className="text-muted-foreground">{t('about.stat3')}</div>
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
