import { mockHomepageSettings } from '@/data/mockData';
import HeroSection from '@/components/home/HeroSection';
import AboutPreview from '@/components/home/AboutPreview';
import CTASection from '@/components/home/CTASection';

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection
        title={mockHomepageSettings.heroTitle}
        subtitle={mockHomepageSettings.heroSubtitle}
        primaryCTA={mockHomepageSettings.heroPrimaryCTA}
        primaryLink={mockHomepageSettings.heroPrimaryLink}
        secondaryCTA={mockHomepageSettings.heroSecondaryCTA}
        secondaryLink={mockHomepageSettings.heroSecondaryLink}
      />
      
      <AboutPreview />
      
      <CTASection />
    </div>
  );
};

export default Home;
