import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ptBR from './locales/pt/pt-br.json';
import enUS from './locales/en/en-us.json';
import es from './locales/es/es.json';
import LanguageDetector from 'i18next-browser-languagedetector'



const resources = {
    'en-US': enUS,
    'pt-BR': ptBR,
    'es': es,
  }
  
  // i18n.use(initReactI18next).init({
  //   resources,
  //   lng: navigator.language,
  //   interpolation: {
  //     escapeValue: false,
  //   }
  // })

  i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: "en",
    interpolation:{
      escapeValue: false
    },
    resources:{
      en: enUS,
      ptBR: ptBR,
      es : es
    },
    detection: {
      order: ['path', 'cookie', 'htmlTag'],
      caches: ['cookie'],
    }
  });
  
  export default i18n;