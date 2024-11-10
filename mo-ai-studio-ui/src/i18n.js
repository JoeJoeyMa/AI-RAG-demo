import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import HttpApi from "i18next-http-backend"
import translationEn from "../public/locales/en/translation"
import translationZh from "../public/locales/zh/translation"

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "zh",
    resources: {
      en: {
        translation: translationEn,
      },
      zh: {
        translation: translationZh,
      },
    },
    supportedLngs: ["zh", "en"],
    interpolation: {
      escapeValue: false,
    },
    saveMissing: true,
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      console.log(`Missing translation - Lang: ${lng}, NS: ${ns}, Key: ${key}, Fallback: ${fallbackValue}`)
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
      caches: ['localStorage', 'cookie'],
    },
  })

// Function to change language and save to local storage
export const changeLanguage = (lng) => {
  i18n.changeLanguage(lng)
  localStorage.setItem("i18nextLng", lng)
}

export default i18n