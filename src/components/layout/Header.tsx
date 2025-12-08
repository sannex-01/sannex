import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Menu, X, MessageCircle } from 'lucide-react';
import MusicPlayer from '@/components/MusicPlayer';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Header = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.whoWeAre'), path: '/about' },
  ];

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
            Sannex
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path ? 'text-primary' : 'text-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <MusicPlayer />
            <LanguageSwitcher />
            <Button asChild>
              <a href="https://calendly.com/sannex/book-free-consultation" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                {t('nav.letsTalk')}
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <MusicPlayer />
            <button
              className="p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === link.path ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-muted-foreground">{t('languageModal.title')}</span>
                  <LanguageSwitcher />
                </div>
              </div>
              <Button asChild className="w-full">
                <a href="https://calendly.com/sannex/book-free-consultation" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  {t('nav.letsTalk')}
                </a>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
