/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import NotificationSystem from 'rc-notification';

class BasicNotification extends PureComponent {
  static defaultProps = {
    color: '',
    title: '',
  };

  render() {
    const { color, title, message } = this.props;
    return (
      <div className={`notification notification--${color}`}>
        <h5 className="notification__title bold-text">{title}</h5>
        <p className="notification__message">{message}</p>
      </div>
    );
  }
}

const showNotification = ({ content, position }) => {
  NotificationSystem.newInstance({}, (notification) => {
    notification.notice({
      content,
      duration: 3,
      closable: true,
      style: {
        top: 0, left: 'calc(100vw - 100%)', position: 'relative', zIndex: '999999999',
      },
      className: position,
    });
  });
};

const show = ({ color, title, message }) => showNotification({
  content: <BasicNotification
    color={color}
    title={title}
    message={message}
  />,
  position: 'right-up',
});

const error = (message) => {
  show({
    color: 'danger',
    title: 'Atención',
    message,
  });
};

const info = (message) => {
  show({
    color: 'info',
    title: 'Información',
    message,
  });
};

const success = (message) => {
  show({
    color: 'success',
    title: 'Atención',
    message,
  });
};

export default {
  show,
  error,
  info,
  success,
};
