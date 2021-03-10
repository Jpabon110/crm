/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/no-access-state-in-setstate */
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
import
DatePicker,
{ registerLocale }
  from 'react-datepicker';
import { connect } from 'react-redux';
import es from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import map from 'lodash/map';
import NumberFormat from 'react-currency-format';
import Select from 'react-select';
import RUTJS from 'rutjs';
import remove from 'lodash/remove';
import emailValidator from 'email-validator';
import moment from 'moment';
import { setRUTFormat } from '../../../shared/utils';
import {
  createContacts,
  getContactByRut,
  updateContact,
  // deleteUser,
} from '../../../redux/actions/contactosActions';
import BasicNotification from '../../../shared/components/Notifications/BasicNotification';
import {
  getSexes,
  getNationalities,
  getCivilStatus,
  getRegions,
  getCommuns,
} from '../../../redux/actions/resourcesActions';

registerLocale('es', es);

class ModalComponent extends Component {
  static defaultProps = {
    title: '',
    message: '',
    colored: false,
    header: false,
    selectedOption: null,
  };

  state = {
    _id: undefined,
    names: '',
    paternalSurname: '',
    maternalSurname: '',
    companyName: '',
    userSII: '',
    passwordSII: '',
    emails: [],
    arriveRut: false,
    rent: undefined,
    birthdate: null,
    rut: '0',
    phones: [],
    addresses: [],
    profile: null,
    nationality: null,
    sex: null,
    civilStatus: null,
    type: { value: 'dependent', label: 'Dependiente' },
  };

  // constructor() {
  //   super();

  // }


  componentDidMount() {
    this.props.getSexes();
    this.props.getNationalities();
    this.props.getCivilStatus();
    this.props.getRegions({ all: true }, (body) => {
      this.setState({ regions: body });
    });
  }

  componentDidUpdate() {
    const { arriveRut } = this.state;
    const { rutToFind } = this.props;
    if (arriveRut === false && rutToFind) {
      this.props.getContactByRut(rutToFind, (contactInfo) => {
        // console.log(contactInfo);
        this.setState({
          _id: contactInfo._id ? contactInfo._id : undefined,
          names: contactInfo.names ? contactInfo.names : '',
          paternalSurname: contactInfo.paternalSurname ? contactInfo.paternalSurname : '',
          maternalSurname: contactInfo.maternalSurname ? contactInfo.maternalSurname : '',
          companyName: contactInfo.companyName ? contactInfo.companyName : '',
          userSII: contactInfo.userSII ? contactInfo.userSII : '',
          passwordSII: contactInfo.passwordSII ? contactInfo.passwordSII : '',
          emails: contactInfo.emails ? contactInfo.emails : [],
          rent: contactInfo.rent ? contactInfo.rent : undefined,
          birthdate: contactInfo.birthdate ? moment(contactInfo.birthdate).toDate() : null,
          rut: contactInfo.rut ? contactInfo.rut : '0',
          phones: contactInfo.phones ? contactInfo.phones : [],
          addresses: contactInfo.addresses ? contactInfo.addresses : [],
          profile: contactInfo.profile ? contactInfo.profile : null,
          nationality: contactInfo.nationality ? contactInfo.nationality : null,
          sex: contactInfo.sex ? contactInfo.sex : null,
          civilStatus: contactInfo.civilStatus ? contactInfo.civilStatus : null,
          type: contactInfo.type ? this.translateContact(contactInfo.type) : { value: 'dependent', label: 'Dependiente' },
        });
      });
      this.setState({ arriveRut: true });
    }
  }

  onChangeInput = key => (e) => {
    if (key === 'rut') {
      this.setState({ [key]: setRUTFormat(e.target.value) });
    } else if (key === 'birthdate') {
      this.setState({ [key]: e });
    } else if ((key === 'profile') || (key === 'nationality') || (key === 'sex') || (key === 'civilStatus')) {
      this.setState({ [key]: e });
    } else if ((key === 'rent')) {
      this.setState({ [key]: e.target.value.replace(/[^$0-9\s]/gi, '') });
    } else if ((key === 'type')) {
      this.setState({
        [key]: e,
        names: '',
        paternalSurname: '',
        maternalSurname: '',
        companyName: '',
        userSII: '',
        passwordSII: '',
      });
    } else {
      this.setState({ [key]: e.target.value });
    }
  }

  translateContact = (contact) => {
    // if (contact.type) {
    //   return { value: 'dependent', label: 'Dependiente' };
    // }
    if (contact === 'dependent') {
      return { value: 'dependent', label: 'Dependiente' };
    }
    if (contact === 'independent') {
      return { value: 'independent', label: 'Inependiente' };
    }
    if (contact === 'company') {
      return { value: 'company', label: 'Empresa' };
    }
    return { value: 'dependent', label: 'Dependiente' };
  }

  isRUTValid = (rut) => {
    if (!rut) return true;
    return (new RUTJS(rut)).isValid;
  }

  onChangePhone = (key, index) => (e) => {
    const phones = [...this.state.phones];
    phones[index][key] = e.target.value.replace(/[^0-9\s]/gi, '').trim();
    this.setState({ phones });
  }

  onRemove = index => () => {
    const phones = [...this.state.phones];
    remove(phones, (_, i) => i === index);
    this.setState({ phones });
  }

  addPhone = () => {
    const phones = [...this.state.phones];
    phones.push({ code: '+56', number: '' });
    this.setState({ phones });
  }

  onChangeEmail = (key, index) => (e) => {
    const emails = [...this.state.emails];
    emails[index][key] = e.target.value;
    this.setState({ emails });
  }

  onRemoveEmail = index => () => {
    const emails = [...this.state.emails];
    remove(emails, (_, i) => i === index);
    this.setState({ emails });
  }

  addEmail = () => {
    const emails = [...this.state.emails];
    emails.push({ email: '' });
    this.setState({ emails });
  }

  onChangeAddress = (key, index) => (e) => {
    const addresses = [...this.state.addresses];

    if (key === 'region') {
      addresses[index][key] = {
        value: e.value,
        label: e.label,
      };
      addresses[index].commune = null;
      this.props.getCommuns({ region: e.value }, (body) => {
        addresses[index].coptions = body;
        this.setState({ addresses });
      });
    } else if (key === 'commune') {
      addresses[index][key] = e;
      this.setState({ addresses });
    } else {
      addresses[index][key] = e.target.value;
      this.setState({ addresses });
    }
  }

  onRemoveAddress = index => () => {
    const addresses = [...this.state.addresses];
    remove(addresses, (_, i) => i === index);
    this.setState({ addresses });
  }

  addAddress = () => {
    const addresses = [...this.state.addresses];
    addresses.push({
      street: '', commune: null, region: null, copts: [],
    });
    this.setState({ addresses });
  }

  onSubmit = (e) => {
    e.preventDefault();

    const {
      _id,
      names,
      paternalSurname,
      maternalSurname,
      companyName,
      userSII,
      passwordSII,
      emails,
      rent,
      birthdate,
      rut,
      type,
      phones,
      addresses,
      profile,
      nationality,
      sex,
      civilStatus,
    } = this.state;

    if (addresses.length > 0) {
      for (let index = 0; index < addresses.length; index += 1) {
        if ((!addresses[index].street) || (!addresses[index].region) || (!addresses[index].commune)) {
          BasicNotification.show({
            color: 'danger',
            title: 'Atención',
            message: 'Debe ingresar todos los campos de la o las direcciones.',
          });
          return;
        }
      }
    }

    if (!type) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debes seleccionar un tipo de contacto',
      });
      return;
    }

    const today = new Date();

    if ((birthdate !== '') && (moment(birthdate).year() > moment(today).year())) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Error ingrese una fecha de nacimiento valida.',
      });

      return;
    }

    if ((type.value === 'dependent') || (type.value === 'independent')) {
      if ((names.trim() === '')) {
        BasicNotification.show({
          color: 'danger',
          title: 'Atención',
          message: 'Debes ingresar un nombre.',
        });
        return;
      }

      if (parseInt(rut.replace(/[^K0-9\s]/gi, ''), 10) > 550000000) {
        BasicNotification.show({
          color: 'danger',
          title: 'Atención',
          message: 'No puedes usar rut de empresa en un contacto tipo persona natural.',
        });
        return;
      }

      if ((!paternalSurname) && (paternalSurname.trim() === '')) {
        BasicNotification.show({
          color: 'danger',
          title: 'Atención',
          message: 'Debes ingresar un apellido paterno.',
        });
        return;
      }
    } else {
      if (parseInt(rut.replace(/[^K0-9\s]/gi, ''), 10) < 550000000) {
        BasicNotification.show({
          color: 'danger',
          title: 'Atención',
          message: 'No puedes usar rut de persona natural en un contacto tipo empresa.',
        });
        return;
      }

      if ((companyName.trim() === '')) {
        BasicNotification.show({
          color: 'danger',
          title: 'Atención',
          message: 'Debes ingresar un nombre de empresa.',
        });
        return;
      }

      if ((userSII.trim() === '')) {
        BasicNotification.show({
          color: 'danger',
          title: 'Atención',
          message: 'Debes ingresar su usuario SII.',
        });
        return;
      }

      if ((passwordSII.trim() === '')) {
        BasicNotification.show({
          color: 'danger',
          title: 'Atención',
          message: 'Debes ingresar su contraseña.',
        });
        return;
      }
    }

    if (this.findElement(emails)) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Los correos no pueden repetirse.',
      });
      return;
    }


    if (this.findElementPhones(phones)) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Los numeros no pueden repetirse.',
      });
      return;
    }

    if (!this.isRUTValid(rut)) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe ingresar un RUT válido.',
      });
      return;
    }

    if ((phones.length === 0)) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe ingresar al menos un telefono.',
      });
      return;
    }

    if ((emails.length === 0)) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe ingresar al menos un email.',
      });
      return;
    }

    for (let index = 0; index < emails.length; index += 1) {
      const element = emails[index].email;

      if (!emailValidator.validate(element)) {
        BasicNotification.show({
          color: 'danger',
          title: 'Atención',
          message: 'Debe ingresar un correo valido.',
        });
        return;
      }
    }

    this.sendData({
      _id,
      names: names.trim(),
      paternalSurname: paternalSurname ? paternalSurname.trim() : '',
      maternalSurname: maternalSurname ? maternalSurname.trim() : '',
      type: type.value,
      companyName: companyName ? companyName.trim() : '',
      userSII: userSII ? userSII.trim() : '',
      passwordSII,
      emails,
      rent: String(rent).replace(/[^,0-9\s]/gi, ''),
      birthdate,
      rut: rut.replace(/[^K0-9\s]/gi, ''),
      phones,
      addresses,
      profile,
      nationality,
      sex,
      civilStatus,
    });
  }


  sendData = (data) => {
    if (!data._id) {
      delete data._id;
      this.props.createContacts(data, () => {
        // this.props.getContacts();
        this.props.toggle(true)();
      });
    } else {
      this.props.updateContact(data._id, data, () => {
        // this.props.getContacts();
        this.props.toggle(true)();
      });
    }
  }

  findElement = (emails) => {
    let findIt = 0;

    for (let index = 0; index < emails.length; index += 1) {
      const search = emails[index];
      for (let index2 = 0; index2 < emails.length; index2 += 1) {
        const compare = emails[index2];
        if (search.email === compare.email) {
          findIt += 1;
        }
      }
      if (findIt > 1) {
        return true;
      }
      findIt = 0;
    }

    return false;
  }

  findElementPhones = (phones) => {
    let findIt = 0;

    for (let index = 0; index < phones.length; index += 1) {
      const search = phones[index].number;
      for (let index2 = 0; index2 < phones.length; index2 += 1) {
        const compare = phones[index2].number;
        if (search === compare) {
          findIt += 1;
        }
      }
      if (findIt > 1) {
        return true;
      }
      findIt = 0;
    }

    return false;
  }


  render() {
    const {
      isOpen,
      disableButtonCreate,
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
            <button className="lnr lnr-cross modal__close-btn" type="button" onClick={this.props.toggle(false)} />
            <h2 className="bold-text label_autofin  modal__title" style={{ fontWeight: 'bold' }}> <strong>Editar Contacto</strong></h2>
          </div>
          <form className="form form--horizontal" onSubmit={this.onSubmit}>
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
                      value={this.state.type}
                      onChange={this.onChangeInput('type')}
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
                      value={this.state.rut}
                      onChange={this.onChangeInput('rut')}
                      invalid={!this.isRUTValid(this.state.rut)}
                      disabled={this.state._id}
                    />
                  </FormGroup>
                </Col>
                <Col md="4" hidden={(this.state.type.value === 'company') && true}>
                  <FormGroup>
                    <Label className="label_autofin" for="names">*Nombres:</Label>
                    <Input
                      type="text"
                      name="names"
                      id="names"
                      maxLength="20"
                      value={this.state.names}
                      onChange={this.onChangeInput('names')}
                    />
                  </FormGroup>
                </Col>
                <Col md="4" hidden={(this.state.type.value === 'company') && true}>
                  <FormGroup>
                    <Label className="label_autofin" for="paternalSurname">*Apellido Paterno:</Label>
                    <Input
                      type="text"
                      name="paternalSurname"
                      id="paternalSurname"
                      maxLength="20"
                      value={this.state.paternalSurname}
                      onChange={this.onChangeInput('paternalSurname')}
                    />
                  </FormGroup>
                </Col>
                <Col md="4" hidden={(this.state.type.value === 'company') && true}>
                  <FormGroup>
                    <Label className="label_autofin" for="maternalSurname2">Apellido Materno:</Label>
                    <Input
                      type="text"
                      name="maternalSurname2"
                      id="maternalSurname2"
                      maxLength="20"
                      value={this.state.maternalSurname}
                      onChange={this.onChangeInput('maternalSurname')}
                      autoComplete="off"
                    />
                  </FormGroup>
                </Col>
                <Col md="4" hidden={((this.state.type.value === 'dependent') || (this.state.type.value === 'independent')) && true}>
                  <FormGroup>
                    <Label className="label_autofin" for="companyName">*Nombre empresa:</Label>
                    <Input
                      type="text"
                      name="companyName"
                      id="companyName"
                      maxLength="20"
                      value={this.state.companyName}
                      onChange={this.onChangeInput('companyName')}
                    />
                  </FormGroup>
                </Col>
                <Col md="4" hidden={((this.state.type.value === 'dependent') || (this.state.type.value === 'independent')) && true}>
                  <FormGroup>
                    <Label className="label_autofin" for="userSII">*Usuario SII:</Label>
                    <Input
                      type="text"
                      name="userSII"
                      id="userSII"
                      maxLength="20"
                      value={this.state.userSII}
                      onChange={this.onChangeInput('userSII')}
                    />
                  </FormGroup>
                </Col>
                <Col md="4" hidden={((this.state.type.value === 'dependent') || (this.state.type.value === 'independent')) && true}>
                  <FormGroup>
                    <Label className="label_autofin" for="password">*Contraseña:</Label>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      maxLength="20"
                      value={this.state.passwordSII}
                      onChange={this.onChangeInput('passwordSII')}
                    />
                  </FormGroup>
                </Col>
                <Col md="4" hidden={(this.state.type.value === 'company') && true}>
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
                      selected={this.state.birthdate || null}
                      onChange={this.onChangeInput('birthdate')}
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
                      value={this.state.rent}
                      onChange={this.onChangeInput('rent')}
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
                      value={this.state.rent}
                      onChange={this.onChangeInput('rent')}
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
                      value={this.state.profile}
                      onChange={this.onChangeInput('profile')}
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
                      value={this.state.nationality}
                      onChange={this.onChangeInput('nationality')}
                    />
                  </FormGroup>
                </Col>
                <Col md="4" hidden={(this.state.type.value === 'company') && true}>
                  <FormGroup>
                    <Label className="label_autofin" for="sex">Sexo:</Label>
                    <Select
                      options={optionsS}
                      type="text"
                      name="sex"
                      id="sex"
                      isClearable="true"
                      placeholder="seleccionar"
                      value={this.state.sex}
                      onChange={this.onChangeInput('sex')}
                    />
                  </FormGroup>
                </Col>
                <Col md="4" hidden={(this.state.type.value === 'company') && true}>
                  <FormGroup>
                    <Label className="label_autofin" for="civilStatus">Estado civil:</Label>
                    <Select
                      options={optionsEC}
                      type="text"
                      placeholder="seleccionar"
                      name="civilStatus"
                      isClearable="true"
                      id="civilStatus"
                      value={this.state.civilStatus}
                      onChange={this.onChangeInput('civilStatus')}
                    />
                  </FormGroup>
                </Col>

                <Col md="12" className="mb-4">
                  <Row>
                    <Col md="4" style={{ display: 'flex' }}>
                      <h4 className="title_modal_contact"> Direcciones </h4>
                      <Button className="plus_add" style={{ marginLeft: '5%' }} onClick={this.addAddress} color="success" size="sm">+</Button>
                    </Col>
                    {/* <Col md="2">
                    </Col> */}
                  </Row>
                </Col>
                <Col sm="12">
                  {
                    map(this.state.addresses, (address, index) => (
                      <Row key={index} className="mt-6">
                        <Col sm="4">
                          <FormGroup>
                            <Label className="label_autofin" for="profile">Calle</Label>
                            <Input
                              className="mb-2"
                              onChange={this.onChangeAddress('street', index)}
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
                              onChange={this.onChangeAddress('region', index)}
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
                              onChange={this.onChangeAddress('region', index)}
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <FormGroup>
                            <Label className="label_autofin" for="profile">Comuna</Label>
                            {/* <Input
                              className="mb-2"
                              onChange={this.onChangeAddress('commune', index)}
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
                              onChange={this.onChangeAddress('commune', index)}
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="1" className="mt-4">
                          <Button className="mb-2 plus_add2" onClick={this.onRemoveAddress(index)} size="sm" block>
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
                      <Button className="plus_add" style={{ marginLeft: '5%' }} onClick={this.addPhone} color="success" size="sm">+</Button>
                    </Col>
                    {/* <Col md="2">
                    </Col> */}
                  </Row>
                </Col>
                <Col sm="12">
                  {
                    map(this.state.phones, (phone, index) => (
                      <Row key={index} className="mt-6">
                        <Col sm="2">
                          <FormGroup>
                            <Label className="label_autofin" for="profile">Código</Label>
                            <Input
                              className="mb-2"
                              maxLength="3"
                              onChange={this.onChangePhone('code', index)}
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
                              onChange={this.onChangePhone('number', index)}
                              value={phone.number}
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="1" className="mt-4">
                          <Button className="mb-2 plus_add2" onClick={this.onRemove(index)} size="sm" block>
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
                      <Button className="plus_add" style={{ marginLeft: '5%' }} onClick={this.addEmail} color="success" size="sm">+</Button>
                    </Col>
                    {/* <Col md="2">
                    </Col> */}
                  </Row>
                </Col>
                <Col sm="12">
                  {
                    map(this.state.emails, (email, index) => (
                      <Row key={index} className="mt-6">
                        <Col sm="4">
                          <FormGroup>
                            <Label className="label_autofin" for="profile">Correos Electrónicos</Label>
                            <Input
                              className="mb-2"
                              maxLength="50"
                              onChange={this.onChangeEmail('email', index)}
                              value={email.email}
                              type="email"
                              placeholder="Email"
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="1" className="mt-4">
                          <Button className="mb-2 plus_add2" onClick={this.onRemoveEmail(index)} size="sm" block>
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
                      <Button className="plus_add" style={{ marginLeft: '5%' }} onClick={this.addEmail} color="success" size="sm">+</Button>
                    </Col>
                  </Row>
                </Col>
                <Col sm="12">
                  {
                    map(this.state.emails, (email, index) => (
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
              <Button className="asignar" onClick={this.props.toggle(false)}>Cancel</Button>{' '}
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

const mapStateToProps = ({ resources, contacts }) => ({
  contacts: contacts.collection,
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
  updateContact,
  getContactByRut,
  createContacts,
  getRegions,
  getCommuns,
};
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(ModalComponent);
