"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, Check } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n()

  const languages = [
    { code: "en" as const, name: "English", flag: "🇺🇸" },
    { code: "id" as const, name: "Bahasa Indonesia", flag: "🇮🇩" },
  ]

  const currentLanguage = languages.find((lang) => lang.code === language)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="border-[#A796CB]/30 hover:bg-[#A796CB]/10 bg-transparent">
          <Globe className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">
            {currentLanguage?.flag} {currentLanguage?.name}
          </span>
          <span className="sm:hidden">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
            {language === lang.code && <Check className="h-4 w-4 text-[#7962A6]" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
