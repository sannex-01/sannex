import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { detectLanguageFromGeolocation, getLanguageFromURL } from '@/utils/geolocation';

const LANGUAGE_KEY = 'preferredLanguage';

interface LanguageOption {
  code: string;
  name: string;
  translationKey: string;
}

interface LanguageSection {
  titleKey: string;
  languages: LanguageOption[];
}

const LanguageSelectionModal = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeLanguage = async () => {
      // Check if language is already in URL
      const urlLanguage = getLanguageFromURL();
      if (urlLanguage) {
        i18n.changeLanguage(urlLanguage);
        localStorage.setItem(LANGUAGE_KEY, urlLanguage);
        return;
      }

      // Check if user has already selected a language
      const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage);
        navigate(`/${savedLanguage}`, { replace: true });
        return;
      }

      // Try geolocation-based detection
      try {
        const detectedLanguage = await detectLanguageFromGeolocation();
        i18n.changeLanguage(detectedLanguage);
        localStorage.setItem(LANGUAGE_KEY, detectedLanguage);
        navigate(`/${detectedLanguage}`, { replace: true });
        
        // Show modal for user to confirm or change
        setIsOpen(true);
      } catch (error) {
        // If geolocation fails, show modal
        setIsOpen(true);
      }
    };

    initializeLanguage();
  }, [i18n, navigate]);

  const languageSections: LanguageSection[] = [
    {
      titleKey: 'languageModal.nigeria',
      languages: [
        { code: 'ig', name: 'Igbo', translationKey: 'languageModal.igbo' },
        { code: 'ha', name: 'Hausa', translationKey: 'languageModal.hausa' },
        { code: 'yo', name: 'Yorùbá', translationKey: 'languageModal.yoruba' },
      ],
    },
    {
      titleKey: 'languageModal.africa',
      languages: [
        { code: 'sw', name: 'Swahili', translationKey: 'languageModal.swahili' },
      ],
    },
    {
      titleKey: 'languageModal.global',
      languages: [
        { code: 'en', name: 'English', translationKey: 'languageModal.english' },
        { code: 'fr', name: 'French', translationKey: 'languageModal.french' },
      ],
    },
  ];

  const handleLanguageSelect = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem(LANGUAGE_KEY, languageCode);
    navigate(`/${languageCode}`, { replace: true });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center mb-4">
            {t('languageModal.title')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {languageSections.map((section) => (
            <div key={section.titleKey} className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                {t(section.titleKey)}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {section.languages.map((language) => (
                  <Button
                    key={language.code}
                    variant="outline"
                    className="w-full"
                    onClick={() => handleLanguageSelect(language.code)}
                  >
                    {t(language.translationKey)}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSelectionModal;
