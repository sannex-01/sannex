import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

  useEffect(() => {
    const hasSelectedLanguage = localStorage.getItem(LANGUAGE_KEY);
    if (!hasSelectedLanguage) {
      setIsOpen(true);
    }
  }, []);

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
