import React, { useRef, useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Button,
  Spinner,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { useSocket } from '../../hooks/index.js';
import { channelSchema } from '../../validationSchemas.js';

const AddChannelForm = ({ onHide }) => {
  const { t } = useTranslation();
  const socket = useSocket();

  const nameRef = useRef();

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: channelSchema,
    onSubmit: ({ name }, { setSubmitting }) => {
      setSubmitting(true);

      const channel = { name };

      socket.emit('newChannel', channel, ({ status }) => {
        if (status === 'ok') {
          onHide();
        }
      });
    },
  });

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group>
        <Form.Control
          name="name"
          aria-label="Add channel"
          data-testid="add-channel"
          className="mb-2"
          onChange={formik.handleChange}
          value={formik.values.name}
          isInvalid={formik.errors.name}
          readOnly={formik.isSubmitting}
          ref={nameRef}
        />
        {formik.errors.name
          && <Form.Control.Feedback type="invalid">{t(formik.errors.name)}</Form.Control.Feedback>}
      </Form.Group>
      <div className="d-flex justify-content-end border-top pt-2">
        <Button
          type="button"
          className="mr-2"
          variant="secondary"
          onClick={onHide}
          disabled={formik.isSubmitting}
        >
          {t('buttons.cancel')}
        </Button>
        <Button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting
            && <Spinner className="mr-1" animation="border" size="sm" />}
          {t('buttons.add')}
        </Button>
      </div>
    </Form>
  );
};

const AddChannel = ({ onExited }) => {
  const [show, setShow] = useState(true);

  const onHide = () => {
    setShow(false);
  };

  const { t } = useTranslation();

  return (
    <Modal show={show} onHide={onHide} onExited={onExited}>
      <Modal.Header closeButton>
        <Modal.Title>{t('texts.addChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddChannelForm onHide={onHide} />
      </Modal.Body>
    </Modal>
  );
};

export default AddChannel;
