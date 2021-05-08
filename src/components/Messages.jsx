import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Col,
  Form,
  InputGroup,
  Button,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { messageSchema } from '../validationSchemas.js';

const getUsername = () => JSON.parse(localStorage.getItem('userId')).username;

const MessagesBox = () => {
  const { currentChannelId } = useSelector((state) => state.channelsInfo);
  const { messages } = useSelector((state) => state.messagesInfo);

  return (
    <div id="messages-box" className="chat-messages overflow-auto mb-3">
      {messages
        .filter(({ channelId }) => (parseInt(channelId, 10) === currentChannelId))
        .map(({ id, body, username }) => (
          <div key={id} className="text-break">
            <b>{username}</b>
            :&nbsp;
            {body}
          </div>
        ))}
    </div>
  );
};

const NewMessageForm = ({ socket }) => {
  const { currentChannelId } = useSelector((state) => state.channelsInfo);
  const inputRef = useRef();

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
            onChange={formik.handleChange}
            value={formik.values.body}
            isInvalid={formik.errors.body}
            ref={inputRef}
            readOnly={formik.isSubmitting}
          />
          <InputGroup.Append>
            <Button type="submit" disabled={formik.isSubmitting}>{t('buttons.send')}</Button>
          </InputGroup.Append>
          {formik.errors.body
            && <Form.Control.Feedback type="invalid">{t(formik.errors.body)}</Form.Control.Feedback>}
        </InputGroup>
      </Form>
    </div>
  );
};

const Messages = ({ socket }) => (
  <Col className="h-100">
    <div className="d-flex flex-column h-100">
      <MessagesBox />
      <NewMessageForm socket={socket} />
    </div>
  </Col>
);

export default Messages;
