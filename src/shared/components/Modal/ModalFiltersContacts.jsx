/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import {
  Button, ButtonToolbar, Modal, Label,
  Col, FormGroup,
} from 'reactstrap';
import { connect } from 'react-redux';
import Select from 'react-select';
import map from 'lodash/map';
import classNames from 'classnames';
import { getSexes, getNationalities, getCivilStatus } from '../../../redux/actions/resourcesActions';

class ModalComponent extends PureComponent {
  componentDidMount() {
    this.props.getSexes();
    this.props.getNationalities();
    this.props.getCivilStatus();
  }

  render() {
    const {
      color, title,
      // message,
      colored, header, isOpen, toggle, valueToFilter, onChangeFilter, cleanFilters,
    } = this.props;

    const optionsS = map(this.props.sexes, typ => ({ value: typ.value, label: typ.label }));
    const Nationalities = map(this.props.nationalities, typ => ({ value: typ.value, label: typ.label }));
    const optionsEC = map(this.props.civilStatus, typ => ({ value: typ.value, label: typ.label }));
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
          {/* {header ? '' : Icon} */}
          {header}
          <h4 className="bold-text  modal__title" style={{ textAlign: 'left', padding: '0px 15px' }}>{title}</h4>
        </div>
        <div className="modal__body">
          {/* {message}
         */}
          <Col md="12" style={{ textAlign: 'left' }}>
            <FormGroup>
              <Label className="label_autofin" for="nationalities">Nacionalidad:</Label>
              <Select
                options={Nationalities}
                type="text"
                name="nationalities"
                placeholder="seleccione"
                id="nationalities"
                value={valueToFilter.nationalities}
                onChange={onChangeFilter('nationalities')}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label className="label_autofin" for="sexes">Sexo:</Label>
              <Select
                options={optionsS}
                type="text"
                name="sexes"
                id="sexes"
                placeholder="seleccionar"
                value={valueToFilter.sexes}
                onChange={onChangeFilter('sexes')}
              />
            </FormGroup>
            <FormGroup>
              <Label className="label_autofin" for="civilStates">Estado civil:</Label>
              <Select
                options={optionsEC}
                type="text"
                name="civilStates"
                id="civilStates"
                placeholder="seleccionar"
                value={valueToFilter.civilStates}
                onChange={onChangeFilter('civilStates')}
              />
            </FormGroup>
          </Col>

        </div>
        <ButtonToolbar className="modal__footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={cleanFilters}>Limpiar filtros</Button>{' '}
          <Button className="asignar just_this" onClick={toggle(true)}>Filtrar</Button>
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

const mapStateToProps = ({ resources }) => ({

  sexes: resources.sexes,
  nationalities: resources.nationalities,
  civilStatus: resources.civilStatus,

});


const mapDispatchToProps = {
  getSexes,
  getNationalities,
  getCivilStatus,

};
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(ModalComponent);
