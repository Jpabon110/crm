/* eslint-disable react/button-has-type */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */
import React, { Component } from 'react';
import {
  Button, ButtonToolbar, Label, Input, Row,
  Col, FormGroup,
  Modal, ModalBody,
} from 'reactstrap';
import map from 'lodash/map';
import Select from 'react-select';
// import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import BasicNotification from './Notifications/BasicNotification';

class NewCaseModalComponent extends Component {
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
      onChangeInput, value, isOpen, onSubmitNewCase, types, subtypes, disable,
    } = this.props;

    const typesOptions = map(types, type => ({ value: type._id, label: type.name }));
    const subtypesOptions = map(subtypes, subtype => ({ value: subtype._id, label: subtype.name }));

    const optionsOriginphone = [
      { value: 'phone', label: 'Telefono' },
      { value: 'web', label: 'Web' },
      { value: 'Otros', label: 'Otros' },
    ];

    // const options = [
    //   { value: 'origen', label: 'origen' },
    //   { value: 'tipo', label: 'tipo' },
    //   { value: 'tipografia', label: 'tipografia' },
    // ];

    return (
      <div>
        <Modal
          isOpen={isOpen}
          toggle={this.props.toggle}
          className="modal-dialog modal-dialog--success modal-new-dialog"
        >
          <div className="modal__header">
            <button className="lnr lnr-cross modal__close-btn" type="button" onClick={this.props.toggle} />
            <h2 className="bold-text label_autofin  modal__title" style={{ fontWeight: 'bold', textAlign: 'left' }}> <strong>Nuevo Caso</strong></h2>
          </div>
          <form className="form form--horizontal" onSubmit={onSubmitNewCase}>
            <ModalBody>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label className="label_autofin" for="origen">Origen:</Label>
                    <Select
                      options={optionsOriginphone}
                      type="text"
                      name="origen"
                      placeholder="seleccione"
                      id="origen"
                      value={value.origen}
                      onChange={onChangeInput('origen')}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label className="label_autofin" for="type">Tipo:</Label>
                    <Select
                      options={typesOptions}
                      type="text"
                      placeholder="seleccione"
                      name="type"
                      id="type"
                      value={value.type}
                      onChange={onChangeInput('type')}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label className="label_autofin" for="subtype">Tipificación:</Label>
                    <Select
                      options={subtypesOptions}
                      type="text"
                      name="subtype"
                      id="subtype"
                      placeholder="seleccione"
                      isDisabled={disable || !value.type}
                      isLoading={disable}
                      value={value.subtype}
                      onChange={onChangeInput('subtype')}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <Label className="label_autofin" for="description">descripción:</Label>
                    <Input
                      type="textarea"
                      name="description"
                      id="description"
                      maxLength="300"
                      value={value.description}
                      onChange={onChangeInput('description')}
                      required
                    />
                  </FormGroup>
                </Col>
                {/* <Col md="6">
                  <FormGroup className="columend_date">
                    <Label className="label_autofin" for="appointment">Fecha de compromiso:</Label>
                    <DatePicker
                      className="form-control"
                      dateFormat="dd/MM/yyyy"
                      name="appointment"
                      id="appointment"
                      selected={value.appointment}
                      onChange={onChangeInput('appointment')}
                      required
                    />
                  </FormGroup>
                </Col> */}
                <Col md="6">
                  <FormGroup>
                    <Label className="label_autofin" for="assign">Asignado a:</Label>
                    <Input
                      type="text"
                      name="assign"
                      id="assign"
                      maxLength="20"
                      value={`${value.firstName} ${value.lastName}`}
                      required
                      disabled
                    />
                  </FormGroup>
                </Col>
              </Row>
            </ModalBody>
            <ButtonToolbar className="modal__footer" style={{ justifyContent: 'flex-end' }}>
              <Button className="asignar" onClick={this.props.toggle}>Cancel</Button>{' '}
              <Button
                className="asignar just_this"
                type="submit"
                id="added"
              >Crear
              </Button>
            </ButtonToolbar>
          </form>
        </Modal>
      </div>
    );
  }
}

export default NewCaseModalComponent;
