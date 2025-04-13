import React from 'react';
import { Globe, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTranslation, Language } from '@/lib/i18n';

// Language to flag emoji mapping
const languageFlags: Record<Language, string> = {
  en: '🇬🇧',
  sv: '🇸🇪',
  no: '🇳🇴',
  da: '🇩🇰',
  fi: '🇫🇮',
};

export const LanguageSelector = () => {
  const { language, setLanguage, t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className="flex items-center gap-3 h-11 px-4"
        >
          <Globe className="h-5 w-5" />
          <span className="text-base font-medium">{languageFlags[language]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 p-2">
        {Object.keys(languageFlags).map((lang) => (
          <DropdownMenuItem
            key={lang}
            className="flex items-center justify-between cursor-pointer py-3"
            onClick={() => setLanguage(lang as Language)}
          >
            <span className="flex items-center gap-3">
              <span className="text-xl">{languageFlags[lang as Language]}</span>
              <span className="text-base">{t(`language.${lang === 'en' ? 'english' : lang === 'sv' ? 'swedish' : lang === 'no' ? 'norwegian' : lang === 'da' ? 'danish' : 'finnish'}`)}</span>
            </span>
            {language === lang && <Check className="h-5 w-5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 