/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/button-has-type */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */
import React from 'react';
import {
  Col, Button, ButtonToolbar, Label, Input, Row, FormGroup,
  Modal, ModalBody,
} from 'reactstrap';
import { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import map from 'lodash/map';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

registerLocale('es', es);

export default (props) => {
  const {
    onChangeInput, value, isOpen, onSubmit, disableButtonCreate, updating, types, toggle,
  } = props;
  const typesOptions = map(types, type => ({ value: type._id, label: type.name }));
  const optionsSLA = [
    { value: 'days', label: 'Dias' },
    { value: 'hours', label: 'Horas' },
    { value: 'minutes', label: 'Minutos' },
  ];
  const optionsWeb = [
    { value: 'true', label: 'Sí' },
    { value: 'false', label: 'No' },
  ];
  const webEnabled = value.webEnabled ? optionsWeb[0] : optionsWeb[1];
  return (
    <div>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        className="modal-dialog modal-dialog--header"
        scrollable="true"
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" type="button" onClick={toggle} />
          <h2 className="bold-text label_autofin  modal__title" style={{ fontWeight: 'bold' }}> <strong>Nueva tipificación</strong></h2>
        </div>
        <form className="form form--horizontal" onSubmit={onSubmit}>
          <ModalBody>
            <Row>
              <Col md="12" className="mb-3">
                <h4 className="title_modal_contact"> Datos tipificación </h4>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label className="label_autofin" for="name">Nombre:</Label>
                  <Input
                    type="text"
                    maxLength="50"
                    name="name"
                    id="name"
                    value={value.name}
                    onChange={onChangeInput('name')}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label className="label_autofin" for="type">Tipo:</Label>
                  <Select
                    className="select_contacts"
                    options={typesOptions}
                    placeholder="seleccionar"
                    name="type"
                    id="type"
                    isClearable
                    value={value.type}
                    onChange={onChangeInput('type')}
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label className="label_autofin" for="slaMeasure">Tiempo:</Label>
                  <Select
                    className="select_contacts"
                    options={optionsSLA}
                    name="slaMeasure"
                    id="slaMeasure"
                    placeholder="seleccionar"
                    isClearable
                    value={value.slaMeasure || optionsSLA[4]}
                    onChange={onChangeInput('slaMeasure')}
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label className="label_autofin" for="slaTime">SLA:</Label>
                  <Input
                    type="number"
                    min="1"
                    name="slaTime"
                    id="slaTime"
                    value={value.slaTime}
                    onChange={onChangeInput('slaTime')}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label className="label_autofin" for="slaTime">Disponible para la web:</Label>
                  <Select
                    className="select_contacts"
                    options={optionsWeb}
                    name="webEnabled"
                    id="webEnabled"
                    isClearable
                    value={webEnabled}
                    onChange={onChangeInput('webEnabled')}
                  />
                </FormGroup>
              </Col>
              <Col md="12">
                <FormGroup>
                  <Label className="label_autofin" for="description">Descripción:</Label>
                  <Input
                    type="textarea"
                    maxLength="3000"
                    name="description"
                    id="description"
                    value={value.description}
                    onChange={onChangeInput('description')}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ButtonToolbar className="modal__footer">
            <Button className="asignar" onClick={toggle}>Cancel</Button>{' '}
            <Button
              className="asignar just_this"
              type="submit"
              id="added"
              disabled={disableButtonCreate || updating}
            >Guardar
            </Button>
          </ButtonToolbar>
        </form>
      </Modal>
    </div>
  );
};
