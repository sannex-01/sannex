import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { updateURLWithLanguage } from '@/utils/geolocation';

interface LanguageOption {
  code: string;
  name: string;
  translationKey: string;
}

interface LanguageGroup {
  titleKey: string;
  languages: LanguageOption[];
}

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  const languageGroups: LanguageGroup[] = [
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

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('preferredLanguage', languageCode);
    updateURLWithLanguage(languageCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change language">
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languageGroups.map((group, groupIndex) => (
          <div key={group.titleKey}>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {t(group.titleKey)}
            </DropdownMenuLabel>
            {group.languages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={i18n.language === language.code ? 'bg-accent' : ''}
              >
                {t(language.translationKey)}
              </DropdownMenuItem>
            ))}
            {groupIndex < languageGroups.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
