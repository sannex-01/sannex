import { Service } from '@/types/project';
import { useTranslation } from 'react-i18next';
import { Bot, Globe, Plug, CreditCard, Users, GraduationCap, LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ServicesSectionProps {
  services: Service[];
}

const iconMap: Record<string, LucideIcon> = {
  Bot,
  Globe,
  Plug,
  CreditCard,
  Users,
  GraduationCap,
};

const ServicesSection = ({ services }: ServicesSectionProps) => {
  const { t } = useTranslation();
  
  // Map services to use translation keys
  const translatedServices = services.map((service, index) => ({
    ...service,
    title: t(`services.service${index + 1}.title`),
    description: t(`services.service${index + 1}.description`),
  }));

  return (
    <section id="services" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('services.heading')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {translatedServices.map((service, index) => {
            const Icon = iconMap[services[index].icon] || Bot;
            return (
              <Card
                key={service.id}
                className="group relative overflow-hidden hover:shadow-lg hover:-translate-y-2 transition-all duration-500 border-border animate-slide-up backdrop-blur-sm bg-card/50 hover:bg-card hover:border-primary/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-primary/20">
                    <Icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <CardDescription className="text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
