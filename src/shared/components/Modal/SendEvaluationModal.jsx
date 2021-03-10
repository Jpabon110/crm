/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import { Button, ButtonToolbar, Modal } from 'reactstrap';
import classNames from 'classnames';

export default class ModalComponent extends PureComponent {
  render() {
    const {
      color, title, message, colored, header, isOpen, toggle,
    } = this.props;
    let Icon;

    switch (color) {
      case 'primary':
        Icon = <span className="lnr lnr-pushpin modal__title-icon" />;
        break;
      case 'success':
        Icon = <span className="lnr lnr-thumbs-up modal__title-icon" />;
        break;
      case 'warning':
        Icon = <span className="lnr lnr-flag modal__title-icon" />;
        break;
      case 'danger':
        Icon = <span className="lnr lnr-cross-circle modal__title-icon" />;
        break;
      default:
        break;
    }
    const modalClass = classNames({
      'modal-dialog--colored': colored,
      'modal-dialog--header': header,
    });

    return (
      <Modal
        isOpen={isOpen}
        toggle={toggle()}
        className={`modal-dialog--${color} ${modalClass}`}
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" type="button" onClick={toggle()} />
          {header ? '' : Icon}
          <h4 className="bold-text  modal__title">{title}</h4>
        </div>
        <div className="modal__body">
          {message}
        </div>
        <ButtonToolbar className="modal__footer">
          <Button onClick={toggle()}>Cancelar</Button>{' '}
          <Button outline={colored} color={color} onClick={toggle(true)}>Aceptar</Button>
        </ButtonToolbar>
      </Modal>
    );
  }
}
