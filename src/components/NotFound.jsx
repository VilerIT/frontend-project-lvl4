import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';

const NotFound = ({ t }) => (
  <Row className="align-items-center h-100">
    <Col>
      <div className="text-center">
        <h1>{t('texts.notFound')}</h1>
        <p>{t('texts.pageDoesNotExist')}</p>
      </div>
    </Col>
  </Row>
);

export default withTranslation()(NotFound);
