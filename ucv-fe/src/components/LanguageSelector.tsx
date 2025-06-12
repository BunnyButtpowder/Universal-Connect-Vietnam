import { Button } from "@/components/ui/button"
import { Globe, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/LanguageContext"

export function LanguageSelector() {
  const { language, setLanguage, t, isLoading } = useLanguage();

  const handleLanguageChange = async (newLanguage: 'en' | 'vi') => {
    if (newLanguage !== language) {
      await setLanguage(newLanguage);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 cursor-pointer relative"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          <span className="sr-only">{t('language.toggleLanguage')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          className={`cursor-pointer ${language === 'en' ? 'bg-accent' : ''}`}
          onClick={() => handleLanguageChange('en')}
          disabled={isLoading}
        >
          {t('language.english')}
          {language === 'en' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`cursor-pointer ${language === 'vi' ? 'bg-accent' : ''}`}
          onClick={() => handleLanguageChange('vi')}
          disabled={isLoading}
        >
          {t('language.vietnamese')}
          {language === 'vi' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 