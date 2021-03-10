/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/button-has-type */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */
import React, { Component } from 'react';
import {
  Button, ButtonToolbar, Label, Input, FormGroup,
  Modal, ModalBody,
} from 'reactstrap';
import 'react-datepicker/dist/react-datepicker.css';
// import BasicNotification from './Notifications/BasicNotification';

class AssigCaseModalComponent extends Component {
  static defaultProps = {
    title: '',
    message: '',
    colored: false,
    header: false,
    selectedOption: null,
  };

  constructor() {
    super();
    this.state = {
      // _id: null,
      // phones: [
      //   {
      //     code: '',
      //     number: '',
      //   },
      // ],
    };
  }


  render() {
    const {
      hideFind, hideNewContact,
      onChangeInput, value, isOpen, onSubmitAssign, isRUTValid, onNewContact,
      // disabledIt,
    } = this.props;

    // console.log('valor', isRUTValid(value.rut));

    return (
      <div>
        <Modal
          isOpen={isOpen}
          toggle={this.props.toggle}
          className="modal-dialog modal-dialog--success"
        >
          <div className="modal__header">
            <button className="lnr lnr-cross modal__close-btn" type="button" onClick={this.props.toggle} />
            <h2 className="bold-text label_autofin  modal__title" style={{ fontWeight: 'bold', textAlign: 'left' }}> <strong>Nueva Cotización</strong></h2>
          </div>
          <form className="form form--horizontal" onSubmit={onSubmitAssign}>
            <ModalBody>
              <FormGroup style={{ textAlign: 'left' }}>
                <Label className="label_autofin" for="rut">Ingrese RUT:</Label>
                <Input
                  type="text"
                  name="rut"
                  id="rut"
                  value={value.rut}
                  invalid={!isRUTValid(value.rut)}
                  onChange={onChangeInput('rut')}
                  required
                />
                <span hidden={hideNewContact}>Este contacto no esta registrado</span>
              </FormGroup>
            </ModalBody>
            <ButtonToolbar className="modal__footer">
              <Button className="asignar" onClick={this.props.toggle}>Cancelar</Button>{' '}
              <Button
                className="asignar just_this"
                type="submit"
                hidden={hideFind}
                disabled={!isRUTValid(value.rut) || !value.rut ? true : false}
                id="added"
              >Buscar
              </Button>
              <Button
                className="asignar just_this"
                style={{ marginTop: '5%' }}
                type="button"
                onClick={onNewContact}
                id="added"
                hidden={hideNewContact}
              >Nuevo contacto
              </Button>
            </ButtonToolbar>
          </form>
        </Modal>
      </div>
    );
  }
}

export default AssigCaseModalComponent;
