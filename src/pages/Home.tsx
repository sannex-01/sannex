import { mockHomepageSettings } from '@/data/mockData';
import HeroSection from '@/components/home/HeroSection';
import AboutPreview from '@/components/home/AboutPreview';
import ServicesSection from '@/components/home/ServicesSection';
import CTASection from '@/components/home/CTASection';

const Home = () => {
  return (
    <div className="relative min-h-screen">
        <HeroSection
          title={mockHomepageSettings.heroTitle}
          subtitle={mockHomepageSettings.heroSubtitle}
          primaryCTA={mockHomepageSettings.heroPrimaryCTA}
          primaryLink={mockHomepageSettings.heroPrimaryLink}
        />
        
        <ServicesSection services={mockHomepageSettings.services} />
        
        <AboutPreview />
        
        <CTASection />
    </div>
  );
};

export default Home;
