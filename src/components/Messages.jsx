import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Col,
  Form,
  InputGroup,
  Button,
  Spinner,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { useSocket } from '../hooks/index.js';
import { messageSchema } from '../validationSchemas.js';

const getUsername = () => localStorage.getItem('username');

const MessagesBox = () => {
  const { currentChannelId } = useSelector((state) => state.channelsInfo);
  const { messages } = useSelector((state) => state.messagesInfo);

  return (
    <div id="messages-box" className="chat-messages overflow-auto mb-3">
      {messages
        .filter(({ channelId }) => (Number(channelId) === currentChannelId))
        .map(({ id, body, username }) => (
          <div key={id} className="mb-2">
            <b>{username}</b>
            <div className="text-break">{body}</div>
          </div>
        ))}
    </div>
  );
};

const NewMessageForm = () => {
  const { currentChannelId } = useSelector((state) => state.channelsInfo);
  const inputRef = useRef();
  const socket = useSocket();

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema: messageSchema,
    onSubmit: ({ body }, { resetForm, setSubmitting }) => {
      setSubmitting(true);

      const message = { body, channelId: currentChannelId, username: getUsername() };
      socket.emit('newMessage', message, ({ status }) => {
        if (status === 'ok') {
          setSubmitting(false);

          resetForm();
          inputRef.current.focus();
        }
      });
    },
  });

  const { t } = useTranslation();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="mt-auto">
      <Form noValidate onSubmit={formik.handleSubmit}>
        <InputGroup hasValidation={formik.errors.body}>
          <Form.Control
            name="body"
            aria-label="body"
            data-testid="new-message"
            onChange={formik.handleChange}
            value={formik.values.body}
            isInvalid={formik.errors.body}
            ref={inputRef}
            readOnly={formik.isSubmitting}
          />
          <InputGroup.Append>
            <Button type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting
                && <Spinner className="mr-1" animation="border" size="sm" />}
              {t('buttons.send')}
            </Button>
          </InputGroup.Append>
          {formik.errors.body
            && <Form.Control.Feedback type="invalid">{t(formik.errors.body)}</Form.Control.Feedback>}
        </InputGroup>
      </Form>
    </div>
  );
};

const Messages = () => (
  <Col className="h-100">
    <div className="d-flex flex-column h-100">
      <MessagesBox />
      <NewMessageForm />
    </div>
  </Col>
);

export default Messages;
