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

const IrremovableChannel = ({ name, buttonVariant, onClick }) => (
  <Nav.Link
    as={Button}
    variant={buttonVariant}
    block
    className="mb-2 text-left"
    onClick={onClick}
  >
    {name}
  </Nav.Link>
);

const RemovableChannel = ({
  name,
  buttonVariant,
  onClick,
  t,
}) => (
  <Dropdown as={ButtonGroup} className="d-flex mb-2">
    <Button variant={buttonVariant} onClick={onClick}>{name}</Button>
    <Dropdown.Toggle
      split
      variant={buttonVariant}
      className="flex-grow-0"
    />
    <Dropdown.Menu>
      <Dropdown.Item>{t('buttons.remove')}</Dropdown.Item>
      <Dropdown.Item>{t('buttons.rename')}</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);

const Channels = () => {
  const { channels, currentChannelId } = useSelector((state) => state.channelsInfo);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const getButtonVariant = (id) => (id === currentChannelId ? 'primary' : 'light');

  const handleClickChannel = (id) => () => {
    dispatch(setCurrentChannelId({ id }));
  };

  const renderChannels = () => (
    <Nav variant="pills" fill className="flex-column">
      {channels.map(({ id, name, removable }) => {
        const Channel = removable ? RemovableChannel : IrremovableChannel;
        return (
          <Nav.Item key={id}>
            <Channel
              name={name}
              buttonVariant={getButtonVariant(id)}
              onClick={handleClickChannel(id)}
              t={t}
            />
          </Nav.Item>
        );
      })}
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
