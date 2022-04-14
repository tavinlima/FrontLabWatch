import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

function Translate() {
const { t } = useTranslation();

    return(
        <div>
            <h1>{t('a')}</h1>
            <h2>{t('welcome')}</h2>
        </div>
    );
}

export default Translate;