import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  Form,
  Button,
  Spinner,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';

import { channelSchema } from '../../validationSchemas.js';

const RenameChannelForm = ({ onHide, socket }) => {
  const { channelId, name } = useSelector((state) => state.modal.extra);
  const { t } = useTranslation();

  const nameRef = useRef();

  const formik = useFormik({
    initialValues: {
      name,
    },
    validationSchema: channelSchema,
    onSubmit: ({ name: newName }, { setSubmitting }) => {
      setSubmitting(true);

      const channel = { id: channelId, name: newName };

      socket.emit('renameChannel', channel, ({ status }) => {
        if (status === 'ok') {
          onHide();
        }
      });
    },
  });

  useEffect(() => {
    nameRef.current.select();
  }, []);

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group>
        <Form.Control
          name="name"
          aria-label="Rename channel"
          data-testid="rename-channel"
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
          {t('buttons.send')}
        </Button>
      </div>
    </Form>
  );
};

const RenameChannel = ({ onExited, socket }) => {
  const [show, setShow] = useState(true);
  const { t } = useTranslation();

  const onHide = () => {
    setShow(false);
  };

  return (
    <Modal show={show} onHide={onHide} onExited={onExited}>
      <Modal.Header closeButton>
        <Modal.Title>{t('texts.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <RenameChannelForm onHide={onHide} socket={socket} />
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannel;
