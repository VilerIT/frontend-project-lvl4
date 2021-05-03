import React from 'react';
import { withTranslation } from 'react-i18next';

const App = ({ t, i18n }) => {
  const handleClick = () => {
    const newLang = (i18n.language === 'en' ? 'ru' : 'en');
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="card text-center">
      <div className="card-body">
        <h5 className="card-title">Chat (Slack)</h5>
        <p className="card-text">
          Label:
          {t('labels.username')}
        </p>
        <button type="button" className="btn btn-primary" onClick={handleClick}>Change language</button>
      </div>
    </div>
  );
};

export default withTranslation()(App);
