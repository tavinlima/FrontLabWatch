import es from '../../assets/img/icons8-espanha-96.png';
import br from '../../assets/img/icons8-brasil-96.png';
import us from '../../assets/img/icons8-eua-96.png';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import './index.css';

//Criamos um array e suas configurações
const LanguageOptions =[
    {
        name: "Português",
        value: "ptBR",
        flag: br

    },
    {
        name: "English",
        value: "en",
        flag: us

    },
    {
        name: "Español",
        value: "es",
        flag: es

    }
]

export const LanguageSwitcher = () =>{
//i18n no hooks é a instância de configuração da biblioteca
const { t, i18n } = useTranslation();

    return(
        <div className='language-switcher'>
            <span className='title'>{t('selectYourLanguage')}</span>
            {LanguageOptions.map(LanguageOptions => (
                <button key={LanguageOptions.value} onClick={() => {
                    i18n.changeLanguage(LanguageOptions.value)
                }}>
                    <img src ={LanguageOptions.flag} alt = {LanguageOptions.name}/>
                        <span
                            style={{
                                // A linguagem que está carregada no i18n é igual a que foi redenrizada? Se sim colocar ela como bold.
                                fontWeight: 
                                    i18n.language === LanguageOptions.value ? "bold" : "normal",
                                textDecoration:
                                    i18n.language === LanguageOptions.value ? "underline" : "none"
                            }}
                        >
                            {LanguageOptions.name}
                        </span>
                </button>
            ))}
        </div>
    )
}
