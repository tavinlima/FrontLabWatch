import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enJSON from './translations/en.json';
import ptBRJSON from './translations/ptBR.json';

//Init
i18n.use(initReactI18next).init({
    //Língua que o seu site abrirá por default
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
    resources: {
        en: enJSON,
        ptBR: ptBRJSON
    },
   
});

export default i18n;