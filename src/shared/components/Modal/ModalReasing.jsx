/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import {
  Button, ButtonToolbar, Modal,
  Col, FormGroup, Row,
  // Input,
} from 'reactstrap';
import Select from 'react-select';
import classNames from 'classnames';
// import ereaserIcon from '../../img/ereaser_icon.png';

export default class ModalReasignComponent extends PureComponent {
  render() {
    const {
      color, title,
      colored, header, isOpen, toggle, values, onwer, executives, onChange, loadingReasing,
    } = this.props;

    const modalClass = classNames({
      'modal-dialog--colored': colored,
      'modal-dialog--header': header,
    });

    return (
      <Modal
        isOpen={isOpen}
        toggle={toggle()}
        className={`modal-dialog--${color} ${modalClass}`}
        style={{ maxWidth: '70%' }}
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" type="button" onClick={toggle()} />
          {header}
          <h2 className="bold-text  modal__title" style={{ textAlign: 'left', padding: '0px 15px' }}>{title}</h2>
        </div>
        <br />
        <div className="modal__body">
          <Row>
            <Col md="4" style={{ textAlign: 'left' }}>
              <FormGroup style={{ borderRight: '2px solid #dee2e66b', height: '100%' }}>
                <h4 className="label_autofin">Casos:</h4>
                <br />
                <div style={{ display: 'grid', padding: '0px 10px' }}>
                  {
                    values.map(value => (
                      <span style={{ margin: '3px 0px' }}>
                        <strong><span style={{ fontWeight: 700 }} className="lnr lnr-checkmark-circle" /></strong>
                        <strong style={{ margin: '0px 5px' }}>ID:</strong>
                        { value.code }
                      </span>
                    ))
                  }
                </div>
              </FormGroup>
            </Col>
            <Col md="4" style={{ textAlign: 'left' }}>
              <FormGroup style={{ borderRight: '2px solid #dee2e66b', height: '100%' }}>
                <h4 className="label_autofin">Ejecutivo actual:</h4> <br />
                <span>{onwer}</span>
              </FormGroup>
            </Col>
            <Col md="4" style={{ textAlign: 'left' }}>
              <FormGroup>
                <h4 className="label_autofin">Ejecutivo a transferir casos:</h4> <br />
                <Select
                  options={executives}
                  type="text"
                  name="executive"
                  placeholder="seleccione"
                  id="executive"
                  onChange={onChange('executiveSelected')}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
        </div>
        <br />
        <ButtonToolbar className="modal__footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={toggle()} style={{ backgroundColor: '#ffff' }}>
            {/* <img
              src={ereaserIcon}
              alt=""
              style={{
                width: '20px', position: 'relative', right: '7%', marginBottom: '3px',
              }}
            /> */}
            Cancelar
          </Button>{' '}
          <Button className="asignar just_this" onClick={toggle(true)} disabled={loadingReasing}>
            {/* <span className="lnr lnr-funnel icon_standars" /> */}
            Transferir
          </Button>
        </ButtonToolbar>
      </Modal>
    );
  }
}
