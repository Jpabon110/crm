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
      hideFind,
      onChangeActivity, value, isOpen, onSubmitNewActivity, cargando,
    } = this.props;

    return (
      <div>
        <Modal
          isOpen={isOpen}
          toggle={this.props.toggle}
          className="modal-dialog modal-dialog--success"
        >
          <div className="modal__header">
            <button className="lnr lnr-cross modal__close-btn" type="button" onClick={this.props.toggle} />
            <h2 className="bold-text label_autofin  modal__title" style={{ fontWeight: 'bold', textAlign: 'left' }}> <strong>Nueva Actividad</strong></h2>
          </div>
          <form className="form form--horizontal" onSubmit={onSubmitNewActivity}>
            <ModalBody>
              <FormGroup style={{ textAlign: 'left' }}>
                <Label className="label_autofin" for="description">Ingrese nueva actividad:</Label>
                <Input
                  type="textarea"
                  name="description"
                  id="description"
                  maxLength="400"
                  value={value.description || ''}
                  onChange={onChangeActivity('description')}
                />
              </FormGroup>
            </ModalBody>
            <ButtonToolbar className="modal__footer" style={{ justifyContent: 'flex-end' }}>
              <Button className="asignar" onClick={this.props.toggle}>Cancelar</Button>{' '}
              <Button
                className="asignar just_this"
                type="submit"
                hidden={hideFind}
                id="added"
                disabled={cargando}
              >Agregar actividad
              </Button>
            </ButtonToolbar>
          </form>
        </Modal>
      </div>
    );
  }
}

export default AssigCaseModalComponent;
