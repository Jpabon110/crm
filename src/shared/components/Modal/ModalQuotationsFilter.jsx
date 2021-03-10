/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import {
  Button, ButtonToolbar, Modal, Label,
  Col, FormGroup,
  // Input,
} from 'reactstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import classNames from 'classnames';
import ereaserIcon from '../../img/ereaser_icon.png';

export default class ModalComponent extends PureComponent {
  render() {
    const {
      color, title,
      // message,
      colored, header, isOpen, toggle, usersFilters,
      // codeFilters,
      valueToFilter, onChangeFilter,
      // isRUTValid,
      cleanFilters, isAdminP,
    } = this.props;

    const optionsOriginphone = [
      { value: 'phone', label: 'Teléfono' },
      { value: 'web', label: 'Web' },
      { value: 'referred', label: 'Referido' },
      { value: 'face', label: 'Presencial' },
      { value: 'trinidad', label: 'Trinidad' },
    ];

    const statusOptions = [
      { value: 'pending', label: 'Pendiente' },
      { value: 'opened', label: 'Abierto' },
      { value: 'closed', label: 'Cerrado' },
    ];


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
          {header}
          <h4 className="bold-text  modal__title" style={{ textAlign: 'left', padding: '0px 15px' }}>{title}</h4>
        </div>
        <div className="modal__body" style={{ overflowY: 'scroll', height: '500px' }}>

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
            <FormGroup>
              <Label className="label_autofin" for="status">Enviado a Evaluación:</Label>
              <Select
                options={[{ label: 'si', value: 'yes' }, { label: 'no', value: 'no' }]}
                type="text"
                name="inTrinidad"
                id="inTrinidad"
                placeholder="seleccionar"
                value={valueToFilter.inTrinidad}
                onChange={onChangeFilter('inTrinidad')}
              />
            </FormGroup>
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
            {/* <span className="lnr lnr-magic-wand icon_standars" /> */}
            <img
              src={ereaserIcon}
              alt=""
              style={{
                width: '20px', position: 'relative', right: '7%', marginBottom: '3px',
              }}
            />
            Limpiar filtros
          </Button>{' '}
          <Button className="asignar just_this" onClick={toggle(true)}>
            <span className="lnr lnr-funnel icon_standars" />
            Filtrar
          </Button>
        </ButtonToolbar>
      </Modal>
    );
  }
}
