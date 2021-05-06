import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Col,
  Nav,
  Button,
  Dropdown,
  ButtonGroup,
} from 'react-bootstrap';

import { setCurrentChannelId } from '../slices/channelsInfoSlice.js';

const Channels = () => {
  const { channels, currentChannelId } = useSelector((state) => state.channelsInfo);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const getButtonVariant = (id) => (id === currentChannelId ? 'primary' : 'light');

  const handleClickChannel = (id) => () => {
    dispatch(setCurrentChannelId({ id }));
  };

  const renderIrremovable = ({ id, name }) => (
    <Nav.Link
      as={Button}
      variant={getButtonVariant(id)}
      block
      className="mb-2 text-left"
      onClick={handleClickChannel(id)}
    >
      {name}
    </Nav.Link>
  );

  const renderRemovable = ({ id, name }) => (
    <Dropdown as={ButtonGroup} className="d-flex mb-2">
      <Button variant={getButtonVariant(id)} onClick={handleClickChannel(id)}>{name}</Button>
      <Dropdown.Toggle
        split
        variant={getButtonVariant(id)}
        className="flex-grow-0"
      />
      <Dropdown.Menu>
        <Dropdown.Item>{t('buttons.remove')}</Dropdown.Item>
        <Dropdown.Item>{t('buttons.rename')}</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  const renderChannels = () => (
    <Nav variant="pills" fill className="flex-column">
      {channels.map((channel) => (
        <Nav.Item key={channel.id}>
          {channel.removable ? renderRemovable(channel) : renderIrremovable(channel)}
        </Nav.Item>
      ))}
    </Nav>
  );

  return (
    <Col xs={3} className="border-right">
      <div className="d-flex mb-2">
        <span>{t('texts.channels')}</span>
        <Button variant="link" className="ml-auto p-0">+</Button>
      </div>
      {renderChannels()}
    </Col>
  );
};

export default Channels;
