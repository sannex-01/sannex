import { mockHomepageSettings } from '@/data/mockData';
import HeroSection from '@/components/home/HeroSection';
import AboutPreview from '@/components/home/AboutPreview';
import ServicesSection from '@/components/home/ServicesSection';
import CTASection from '@/components/home/CTASection';
import VideoBackground from '@/components/VideoBackground';

const Home = () => {
  return (
    <div className="relative min-h-screen">
      <VideoBackground />
      
      <div className="relative z-10">
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
    </div>
  );
};

export default Home;
