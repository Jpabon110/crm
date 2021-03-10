/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/button-has-type */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */
import React, { Component } from 'react';
import {
  Col, Button, ButtonToolbar, Label, Input, Row, FormGroup,
  Modal, ModalBody,
} from 'reactstrap';
import DatePicker, { registerLocale } from 'react-datepicker';
import { connect } from 'react-redux';
import es from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import map from 'lodash/map';
import NumberFormat from 'react-currency-format';
import Select from 'react-select';
import {
  getSexes,
  getNationalities,
  getCivilStatus,
  getRegions,
  getCommuns,
} from '../../../redux/actions/resourcesActions';
// import RegionesComunas from './Json_Regiones_y_Comunas';

registerLocale('es', es);

class ModalComponent extends Component {
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


  componentDidMount() {
    this.props.getSexes();
    this.props.getNationalities();
    this.props.getCivilStatus();
    this.props.getRegions({ all: true }, (body) => {
      this.setState({ regions: body });
    });
  }

  render() {
    const {
      onChangeInput, onChangePhone, onRemove, addPhone,
      value, isOpen, onChangeAddress, onRemoveAddress,
      addAddress, addEmail, onChangeEmail, onRemoveEmail,
      onSubmit, isRUTValid, disableButtonCreate,
    } = this.props;

    const optionsTypes = [
      { value: 'dependent', label: 'Dependiente' },
      { value: 'independent', label: 'Independiente' },
      { value: 'company', label: 'Empresa' },
    ];


    const optionsS = map(this.props.sexes, typ => ({ value: typ.value, label: typ.label }));
    const Nationalities = map(this.props.nationalities, typ => ({ value: typ.value, label: typ.label }));
    const optionsEC = map(this.props.civilStatus, typ => ({ value: typ.value, label: typ.label }));

    return (
      <div>
        <Modal
          isOpen={isOpen}
          toggle={this.props.toggle}
          className="modal-dialog modal-dialog--header"
          scrollable="true"
        >
          <div className="modal__header">
            <button className="lnr lnr-cross modal__close-btn" type="button" onClick={this.props.toggle} />
            <h2 className="bold-text label_autofin  modal__title" style={{ fontWeight: 'bold' }}> <strong>Nuevo Contacto</strong></h2>
          </div>
          <form className="form form--horizontal" onSubmit={onSubmit}>
            <ModalBody>
              <Row>
                <Col md="12" className="mb-3">
                  <h4 className="title_modal_contact"> Datos personales </h4>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label className="label_autofin" for="type">Tipo:</Label>
                    <Select
                      options={optionsTypes}
                      type="text"
                      name="type"
                      id="type"
                      placeholder="seleccionar"
                      value={value.type}
                      onChange={onChangeInput('type')}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label className="label_autofin" for="rut">*Rut:</Label>
                    <Input
                      type="text"
                      name="rut"
                      id="rut"
                      value={value.rut}
                      onChange={onChangeInput('rut')}
                      invalid={!isRUTValid(value.rut)}
                      disabled={value._id}
                    />
                  </FormGroup>
                </Col>
                <Col md="4" hidden={(value.type.value === 'company') && true}>
                  <FormGroup>
                    <Label className="label_autofin" for="names">*Nombres:</Label>
                    <Input
                      type="text"
                      name="names"
                      id="names"
                      maxLength="20"
                      value={value.names}
                      onChange={onChangeInput('names')}
                    />
                  </FormGroup>
                </Col>
                <Col md="4" hidden={(value.type.value === 'company') && true}>
                  <FormGroup>
                    <Label className="label_autofin" for="paternalSurname">*Apellido Paterno:</Label>
                    <Input
                      type="text"
                      name="paternalSurname"
                      id="paternalSurname"
                      maxLength="20"
                      value={value.paternalSurname}
                      onChange={onChangeInput('paternalSurname')}
                    />
                  </FormGroup>
                </Col>
                <Col md="4" hidden={(value.type.value === 'company') && true}>
                  <FormGroup>
                    <Label className="label_autofin" for="maternalSurname2">Apellido Materno:</Label>
                    <Input
                      type="text"
                      name="maternalSurname2"
                      id="maternalSurname2"
                      maxLength="20"
                      value={value.maternalSurname}
                      onChange={onChangeInput('maternalSurname')}
                      autoComplete="off"
                    />
                  </FormGroup>
                </Col>
                <Col md="4" hidden={((value.type.value === 'dependent') || (value.type.value === 'independent')) && true}>
                  <FormGroup>
                    <Label className="label_autofin" for="companyName">*Nombre empresa:</Label>
                    <Input
                      type="text"
                      name="companyName"
                      id="companyName"
                      maxLength="20"
                      value={value.companyName}
                      onChange={onChangeInput('companyName')}
                    />
                  </FormGroup>
                </Col>
                <Col md="4" hidden={((value.type.value === 'dependent') || (value.type.value === 'independent')) && true}>
                  <FormGroup>
                    <Label className="label_autofin" for="userSII">*Usuario SII:</Label>
                    <Input
                      type="text"
                      name="userSII"
                      id="userSII"
                      maxLength="20"
                      value={value.userSII}
                      onChange={onChangeInput('userSII')}
                    />
                  </FormGroup>
                </Col>
                <Col md="4" hidden={((value.type.value === 'dependent') || (value.type.value === 'independent')) && true}>
                  <FormGroup>
                    <Label className="label_autofin" for="password">*Contraseña:</Label>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      maxLength="20"
                      value={value.passwordSII}
                      onChange={onChangeInput('passwordSII')}
                    />
                  </FormGroup>
                </Col>
                <Col md="4" hidden={(value.type.value === 'company') && true}>
                  <FormGroup className="columend_date">
                    <Label className="label_autofin" for="birthdate">Fecha de nacimiento:</Label>
                    <DatePicker
                      className="form-control"
                      locale="es"
                      dateFormat="dd/MM/yyyy"
                      name="birthdate"
                      id="birthdate"
                      maxDate={new Date()}
                      // showMonthYearDropdown
                      showYearDropdown
                      dropdownMode="select"
                      selected={value.birthdate}
                      onChange={onChangeInput('birthdate')}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label className="label_autofin" for="rent">Renta:</Label>
                    {/* <Input
                      type="number"
                      min="0"
                      name="rent"
                      id="rent"
                      max="99999999"
                      value={value.rent}
                      onChange={onChangeInput('rent')}
                    /> */}

                    <NumberFormat
                      style={{ border: '1px solid #ced4da', borderRadius: '0.25rem' }}
                      prefix="$"
                      min="0"
                      name="rent"
                      id="rent"
                      max="99999999"
                      decimalSeparator=","
                      thousandSeparator="."
                      value={value.rent || ''}
                      onChange={onChangeInput('rent')}
                    />
                  </FormGroup>
                </Col>
                {/* <Col md="4">
                  <FormGroup>
                    <Label className="label_autofin" for="profile">Perfil:</Label>
                    <Select
                      options={options}
                      type="text"
                      name="profile"
                      id="profile"
                      placeholder="seleccionar"
                      value={value.profile}
                      onChange={onChangeInput('profile')}
                    />
                  </FormGroup>
                </Col> */}
                <Col md="4">
                  <FormGroup>
                    <Label className="label_autofin" for="nationality">Nacionalidad:</Label>
                    <Select
                      options={Nationalities}
                      // defaultValue={Nationatilies[42].label}
                      type="text"
                      name="nationality"
                      id="nationality"
                      placeholder="seleccionar"
                      value={value.nationality}
                      onChange={onChangeInput('nationality')}
                    />
                  </FormGroup>
                </Col>
                <Col md="4" hidden={(value.type.value === 'company') && true}>
                  <FormGroup>
                    <Label className="label_autofin" for="sex">Sexo:</Label>
                    <Select
                      options={optionsS}
                      type="text"
                      name="sex"
                      id="sex"
                      isClearable="true"
                      placeholder="seleccionar"
                      value={value.sex}
                      onChange={onChangeInput('sex')}
                    />
                  </FormGroup>
                </Col>
                <Col md="4" hidden={(value.type.value === 'company') && true}>
                  <FormGroup>
                    <Label className="label_autofin" for="civilStatus">Estado civil:</Label>
                    <Select
                      options={optionsEC}
                      type="text"
                      placeholder="seleccionar"
                      name="civilStatus"
                      isClearable="true"
                      id="civilStatus"
                      value={value.civilStatus}
                      onChange={onChangeInput('civilStatus')}
                    />
                  </FormGroup>
                </Col>

                <Col md="12" className="mb-4">
                  <Row>
                    <Col md="4" style={{ display: 'flex' }}>
                      <h4 className="title_modal_contact"> Direcciones </h4>
                      <Button className="plus_add" style={{ marginLeft: '5%' }} onClick={addAddress} color="success" size="sm">+</Button>
                    </Col>
                    {/* <Col md="2">
                    </Col> */}
                  </Row>
                </Col>
                <Col sm="12">
                  {
                    map(value.addresses, (address, index) => (
                      <Row key={index} className="mt-6">
                        <Col sm="4">
                          <FormGroup>
                            <Label className="label_autofin" for="profile">Calle</Label>
                            <Input
                              className="mb-2"
                              onChange={onChangeAddress('street', index)}
                              value={address.street}
                              placeholder="Calle"
                              maxLength="50"
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <FormGroup>
                            <Label className="label_autofin" for="profile">Región</Label>
                            {/* <Input
                              className="mb-2"
                              onChange={onChangeAddress('region', index)}
                              value={address.region}
                              placeholder="Region"
                              maxLength="20"
                              required
                            /> */}
                            <Select
                              options={this.state.regions}
                              type="text"
                              name="region"
                              id="region"
                              placeholder="seleccionar"
                              value={address.region}
                              onChange={onChangeAddress('region', index)}
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <FormGroup>
                            <Label className="label_autofin" for="profile">Comuna</Label>
                            {/* <Input
                              className="mb-2"
                              onChange={onChangeAddress('commune', index)}
                              value={address.commune}
                              placeholder="Comuna"
                              maxLength="20"
                              required
                            /> */}
                            <Select
                              options={address.coptions}
                              type="text"
                              name="commune"
                              id="commune"
                              placeholder="seleccionar"
                              value={address.commune}
                              isClearable="true"
                              onChange={onChangeAddress('commune', index)}
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="1" className="mt-4">
                          <Button className="mb-2 plus_add2" onClick={onRemoveAddress(index)} size="sm" block>
                            <span
                              className="lnr lnr-lnr lnr-trash"
                              style={{
                                fontWeight: 'bold', cursor: 'pointer',
                              }}
                            />
                          </Button>
                        </Col>
                      </Row>
                    ))
                  }
                </Col>
                <Col md="12" className="mb-4">
                  <Row>
                    <Col md="4" style={{ display: 'flex' }}>
                      <h4 className="title_modal_contact"> Teléfono </h4>
                      <Button className="plus_add" style={{ marginLeft: '5%' }} onClick={addPhone} color="success" size="sm">+</Button>
                    </Col>
                    {/* <Col md="2">
                    </Col> */}
                  </Row>
                </Col>
                <Col sm="12">
                  {
                    map(value.phones, (phone, index) => (
                      <Row key={index} className="mt-6">
                        <Col sm="2">
                          <FormGroup>
                            <Label className="label_autofin" for="profile">Código</Label>
                            <Input
                              className="mb-2"
                              maxLength="3"
                              onChange={onChangePhone('code', index)}
                              value={phone.code}
                              placeholder="Código"
                              required
                              disabled
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="4">
                          <FormGroup>
                            <Label className="label_autofin" for="profile">Teléfono</Label>
                            <Input
                              className="mb-2"
                              maxLength="9"
                              minLength="9"
                              onChange={onChangePhone('number', index)}
                              value={phone.number}
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="1" className="mt-4">
                          <Button className="mb-2 plus_add2" onClick={onRemove(index)} size="sm" block>
                            <span
                              className="lnr lnr-lnr lnr-trash"
                              style={{
                                fontWeight: 'bold', cursor: 'pointer',
                              }}
                            />
                          </Button>
                        </Col>
                      </Row>
                    ))
                  }
                </Col>
                <Col md="12" className="mb-4">
                  <Row>
                    <Col md="4" style={{ display: 'flex' }}>
                      <h4 className="title_modal_contact"> Correo </h4>
                      <Button className="plus_add" style={{ marginLeft: '5%' }} onClick={addEmail} color="success" size="sm">+</Button>
                    </Col>
                    {/* <Col md="2">
                    </Col> */}
                  </Row>
                </Col>
                <Col sm="12">
                  {
                    map(value.emails, (email, index) => (
                      <Row key={index} className="mt-6">
                        <Col sm="4">
                          <FormGroup>
                            <Label className="label_autofin" for="profile">Correos Electrónicos</Label>
                            <Input
                              className="mb-2"
                              maxLength="50"
                              onChange={onChangeEmail('email', index)}
                              value={email.email}
                              type="email"
                              placeholder="Email"
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="1" className="mt-4">
                          <Button className="mb-2 plus_add2" onClick={onRemoveEmail(index)} size="sm" block>
                            <span
                              className="lnr lnr-lnr lnr-trash"
                              style={{
                                fontWeight: 'bold', cursor: 'pointer',
                              }}
                            />
                          </Button>
                        </Col>
                      </Row>
                    ))
                  }
                </Col>
                {/* <Col md="12" className="mb-4">
                  <Row>
                    <Col md="5" style={{ display: 'flex' }}>
                      <h4 className="title_modal_contact"> Correos Electrónicos </h4>
                      <Button className="plus_add" style={{ marginLeft: '5%' }} onClick={addEmail} color="success" size="sm">+</Button>
                    </Col>
                  </Row>
                </Col>
                <Col sm="12">
                  {
                    map(value.emails, (email, index) => (
                      <Row key={index} className="mt-4">
                        <Col sm="4">
                          <Input className="mb-2" type="email" maxLength="50" onChange={onChangeEmail(index)} value={email} placeholder="Email" required />
                        </Col>
                        <Col sm="1" className="mt-1">
                          <Button className="mb-2 plus_add2" onClick={onRemoveEmail(index)} size="sm" block>
                            <span
                              className="lnr lnr-lnr lnr-trash"
                              style={{
                                fontWeight: 'bold', cursor: 'pointer',
                              }}
                            />
                          </Button>
                        </Col>
                      </Row>
                    ))
                  }
                </Col> */}

              </Row>
            </ModalBody>
            <ButtonToolbar className="modal__footer">
              <Button className="asignar" onClick={this.props.toggle}>Cancel</Button>{' '}
              <Button
                className="asignar just_this"
                type="submit"
                id="added"
                disabled={disableButtonCreate}
              >Guardar
              </Button>
            </ButtonToolbar>
          </form>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = ({ resources }) => ({

  sexes: resources.sexes,
  nationalities: resources.nationalities,
  civilStatus: resources.civilStatus,
  regions: resources.Regions,
  Communs: resources.Communs,

});


const mapDispatchToProps = {
  getSexes,
  getNationalities,
  getCivilStatus,
  getRegions,
  getCommuns,

};
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(ModalComponent);

// export default ModalComponent;
