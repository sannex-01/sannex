import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Lightbulb, Users } from 'lucide-react';
import VideoBackground from '@/components/VideoBackground';

const About = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  
  const values = [
    {
      icon: Target,
      title: t('aboutPage.value1Title'),
      description: t('aboutPage.value1Desc'),
    },
    {
      icon: Lightbulb,
      title: t('aboutPage.value2Title'),
      description: t('aboutPage.value2Desc'),
    },
    {
      icon: Users,
      title: t('aboutPage.value3Title'),
      description: t('aboutPage.value3Desc'),
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="relative min-h-screen">
        <VideoBackground />
        <div className="relative z-10 pt-24 pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12 animate-fade-in py-12 md:py-20">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  {t('aboutPage.title')}
                </h1>
                <p className="text-xl text-muted-foreground">
                  {t('aboutPage.subtitle')}
                </p>
              </div>

              <div className="prose prose-lg max-w-none mb-8 animate-fade-in">
                <Card className="bg-black border-white/20">
                  <CardContent className="pt-6">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">{t('aboutPage.ourStory')}</h2>
                    <p className="text-muted-foreground mb-4">
                      {t('aboutPage.storyP1')}
                    </p>
                    <p className="text-muted-foreground mb-4">
                      {t('aboutPage.storyP2')}
                    </p>
                    <p className="text-muted-foreground">
                      {t('aboutPage.storyP3')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">

            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">
                {t('aboutPage.ourValues')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <Card
                      key={index}
                      className="text-center animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="pt-6">
                        <div className="h-12 w-12 rounded-lg bg-primary-light flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-foreground">
                          {value.title}
                        </h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="mb-16 animate-fade-in">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-6 text-foreground">
                    {t('aboutPage.ourExpertise')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-3 text-foreground">{t('aboutPage.technologies')}</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• React, TypeScript, Next.js</li>
                        <li>• Django, FastAPI, Node.js</li>
                        <li>• PostgreSQL, MongoDB, Redis</li>
                        <li>• AWS, Docker, CI/CD</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3 text-foreground">{t('aboutPage.specializations')}</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• AI & Machine Learning</li>
                        <li>• Workflow Automation (n8n)</li>
                        <li>• Payment Integrations</li>
                        <li>• API Development</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center animate-fade-in">
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                {t('aboutPage.readyTitle')}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t('aboutPage.readySubtitle')}
              </p>
              <div className="flex justify-center">
                <Button asChild size="lg">
                  <a href="https://calendly.com/sannex/book-free-consultation" target="_blank" rel="noopener noreferrer">{t('aboutPage.getInTouch')}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
