/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import {
  Button, ButtonToolbar, Modal, Label,
  Col, FormGroup,
  // Input,
} from 'reactstrap';
import Select from 'react-select';
import map from 'lodash/map';
import DatePicker from 'react-datepicker';
import classNames from 'classnames';
import ereaserIcon from '../../img/ereaser_icon.png';

export default class ModalComponent extends PureComponent {
  render() {
    const {
      color, title,
      // message,
      colored, header, isOpen, toggle, usersFilters, typesFilters, subTypesFilters,
      // codeFilters,
      valueToFilter, onChangeFilter,
      // isRUTValid,
      cleanFilters, isAdminP,
    } = this.props;

    const subtypesOptions = map(subTypesFilters, subtype => ({ value: subtype._id, label: subtype.name }));


    const optionsOriginphone = [
      { value: 'phone', label: 'Teléfono' },
      { value: 'web', label: 'Web' },
      { value: 'email', label: 'Mail' },
      { value: 'other', label: 'Otros' },
    ];

    const statusOptions = [
      { value: 'pending', label: 'Pendiente' },
      { value: 'opened', label: 'Abierto' },
      { value: 'closed', label: 'Cerrado' },
    ];

    const termsOptions = [
      { value: 'within', label: 'Dentro del plazo' },
      { value: 'out', label: 'Fuera del plazo' },
    ];

    const modalClass = classNames({
      'modal-dialog--colored': colored,
      'modal-dialog--header': header,
    });

    // console.log(valueToFilter.fromDate);


    return (
      <Modal
        isOpen={isOpen}
        toggle={toggle()}
        className={`modal-dialog--${color} ${modalClass}`}
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" type="button" onClick={toggle()} />
          {/* {header ? '' : Icon} */}
          {header}
          <h4 className="bold-text  modal__title" style={{ textAlign: 'left', padding: '0px 15px' }}>{title}</h4>
        </div>
        <div className="modal__body" style={{ overflowY: 'scroll', height: '500px' }}>
          {/* {message}
         */}
          <Col md="12" style={{ textAlign: 'left' }}>
            { isAdminP && (
            <FormGroup>
              <Label className="label_autofin" for="executive">Ejecutivo:</Label>
              <Select
                options={usersFilters}
                type="text"
                name="executive"
                placeholder="seleccione"
                id="executive"
                value={valueToFilter.executive}
                onChange={onChangeFilter('executive')}
                required
              />
            </FormGroup>
            )}
            <FormGroup>
              <Label className="label_autofin" for="type">Tipos:</Label>
              <Select
                options={typesFilters}
                type="text"
                name="type"
                placeholder="seleccione"
                id="type"
                value={valueToFilter.type}
                onChange={onChangeFilter('type')}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label className="label_autofin" for="subtype">tipificación:</Label>
              <Select
                options={subtypesOptions}
                type="text"
                name="subtype"
                placeholder="seleccione"
                id="subtype"
                value={valueToFilter.subtype}
                onChange={onChangeFilter('subtype')}
                required
              />
            </FormGroup>
            {/* <FormGroup>
              <Label className="label_autofin" for="code">ID:</Label>
              <Select
                options={codeFilters}
                type="text"
                name="code"
                id="code"
                placeholder="seleccionar"
                value={valueToFilter.code}
                onChange={onChangeFilter('code')}
              />
            </FormGroup> */}
            <FormGroup>
              <Label className="label_autofin" for="origin">Origen:</Label>
              <Select
                options={optionsOriginphone}
                type="text"
                name="origin"
                id="origin"
                placeholder="seleccionar"
                value={valueToFilter.origin}
                onChange={onChangeFilter('origin')}
              />
            </FormGroup>
            {/* <FormGroup>
              <Label className="label_autofin" for="client">Rut contacto:</Label>
              <Input
                type="text"
                name="client"
                style={{ fontSize: '13px' }}
                id="client"
                value={valueToFilter.client}
                onChange={onChangeFilter('client')}
                invalid={!isRUTValid(valueToFilter.client)}
              />
            </FormGroup> */}
            <FormGroup>
              <Label className="label_autofin" for="status">Estado:</Label>
              <Select
                options={statusOptions}
                type="text"
                name="status"
                id="status"
                placeholder="seleccionar"
                value={valueToFilter.status}
                onChange={onChangeFilter('status')}
              />
            </FormGroup>
            <FormGroup>
              <Label className="label_autofin" for="term">Plazo:</Label>
              <Select
                options={termsOptions}
                type="text"
                name="term"
                id="term"
                placeholder="seleccionar"
                value={valueToFilter.term}
                onChange={onChangeFilter('term')}
              />
            </FormGroup>
            <FormGroup className="columend_date">
              <Label className="label_autofin" for="range">Rango de fechas:</Label>
              <FormGroup className="columend_date">
                <Label className="label_autofin" for="range">Desde:</Label>
                <DatePicker
                  className="form-control"
                  locale="es"
                  dateFormat="dd/MM/yyyy"
                  name="fromDate"
                  id="fromDate"
                  maxDate={new Date()}
                  // showMonthYearDropdown
                  showYearDropdown
                  dropdownMode="select"
                  selected={valueToFilter.fromDate}
                  onChange={onChangeFilter('fromDate')}
                />
              </FormGroup>
              <FormGroup className="columend_date">
                <Label className="label_autofin" for="range">Hasta:</Label>
                <DatePicker
                  className="form-control"
                  locale="es"
                  dateFormat="dd/MM/yyyy"
                  name="toDate"
                  id="toDate"
                  maxDate={new Date()}
                  minDate={valueToFilter.fromDate}
                  // showMonthYearDropdown
                  showYearDropdown
                  dropdownMode="select"
                  selected={valueToFilter.toDate}
                  onChange={onChangeFilter('toDate')}
                />
              </FormGroup>
            </FormGroup>
          </Col>

        </div>
        <ButtonToolbar className="modal__footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={cleanFilters}>
            <img
              src={ereaserIcon}
              alt=""
              style={{
                width: '20px', position: 'relative', right: '7%', marginBottom: '3px',
              }}
            />
            {/* <span className="lnr lnr-magic-wand icon_standars" /> */}
            Limpiar filtros
          </Button>{' '}
          <Button className="asignar just_this" onClick={toggle(true)}>
            <span className="lnr lnr-funnel icon_standars" />
            Filtrar
          </Button>
          {/* <ButtonToolbar className="modal__footer" style={{ justifyContent: 'flex-end' }}>
              <Button className="asignar" onClick={this.props.toggle}>Cancel</Button>{' '}
              <Button
                className="asignar just_this"
                type="submit"
                id="added"
              >Crear
              </Button>
            </ButtonToolbar> */}
        </ButtonToolbar>
      </Modal>
    );
  }
}
