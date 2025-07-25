"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { translations, type Language } from "./translations"

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("visim-language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "id")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference when changed
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("visim-language", lang)
  }

  // Translation function with nested key support
  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = translations[language]

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        // Fallback to English if key not found
        let fallback: any = translations.en
        for (const fk of keys) {
          if (fallback && typeof fallback === "object" && fk in fallback) {
            fallback = fallback[fk]
          } else {
            return key // Return key if not found in fallback either
          }
        }
        return fallback
      }
    }

    return typeof value === "string" ? value : key
  }

  return <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
