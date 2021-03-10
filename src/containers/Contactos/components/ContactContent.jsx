/* eslint-disable no-script-url */
/* eslint-disable no-useless-return */
/* eslint-disable consistent-return */
/* eslint-disable prefer-const */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/prop-types */
import React, { Component, Fragment } from 'react';
import {
  Card, CardBody, Input, Col, Row,
  // Dropdown,
  // DropdownToggle, DropdownMenu, DropdownItem,
  // Tooltip,
  // FormGroup,
} from 'reactstrap';
import QueryString from 'query-string';
import TableCell from '@material-ui/core/TableCell';
import { connect } from 'react-redux';
import remove from 'lodash/remove';
import map from 'lodash/map';
import find from 'lodash/find';
import emailValidator from 'email-validator';
import RUTJS from 'rutjs';
import moment from 'moment';
import NumberFormat from 'react-currency-format';
import RegionesComunas from './Json_Regiones_y_Comunas';
import {
  getRegions,
  getCommuns,
} from '../../../redux/actions/resourcesActions';
import { changeTitleAction } from '../../../redux/actions/topbarActions';
import ereaserIcon from '../../../shared/img/ereaser_icon.png';
import {
  createContacts,
  getContacts,
  updateContact,
  deleteUser,
} from '../../../redux/actions/contactosActions';
import DModal from '../../../shared/components/Modal/Modal';
import FModal from '../../../shared/components/Modal/ModalFiltersContacts';
import {
  setRUTFormat,
  isUserAllowed,
  findFullName,
} from '../../../shared/utils';
import ModalContacto from './ModalContacto';
import {
  updateCase,
  updateCaseMe,
} from '../../../redux/actions/casesActions';
import BasicNotification from '../../../shared/components/Notifications/BasicNotification';
import MatTable from '../../../shared/components/MaterialTable';

const headers = [
  {
    id: 'rut', disablePadding: true, label: 'RUT',
  },
  {
    id: 'name', disablePadding: true, label: 'Nombre',
  },
  {
    id: 'phone', disablePadding: false, label: 'Teléfono',
  },
  {
    id: 'email', disablePadding: false, label: 'Email',
  },
  {
    id: 'rent', disablePadding: false, label: 'Renta',
  },
  {
    id: 'actions', disablePadding: false, label: 'Acciones',
  },
];

export class ContactContent extends Component {
  state = {
    isOpenModalC: false,
    // isOpenModalContactEdit: false,
    isOpenModalD: false,
    isOpenModalF: false,
    names: '',
    paternalSurname: '',
    maternalSurname: '',
    companyName: '',
    userSII: '',
    passwordSII: '',
    emails: [],
    rent: 0,
    birthdate: null,
    rut: '0',
    phones: [],
    addresses: [],
    tooltipOpen: false,
    profile: null,
    nationality: null,
    sex: null,
    civilStatus: null,
    selected: [],
    search: null,
    type: { value: 'dependent', label: 'Dependiente' },
    page: 0,
    rowsPerPage: 10,
    dropdownOpen: false,
    communes: [],
    valueToFilter: {
      nationalities: {},
      sexes: {},
      civilStates: {},
    },
  };

  componentDidMount() {
    this.props.changeTitleAction('Contactos');
    let {
      page = 1, limit = 10, newContact = false, rut = '', search,
    } = QueryString.parse(this.props.location.search);
    const query = {};
    if (page && !Number.isNaN(page)) {
      page = parseInt(page, 10) - 1;
      Object.assign(query, { page: page + 1 });
    }
    if (limit && !Number.isNaN(limit)) {
      limit = parseInt(limit, 10);
      Object.assign(query, { limit });
    }

    if (newContact) {
      this.setState({ rut });
      this.onClickContacto();
    }
    this.setState({ page, rowsPerPage: limit });
    this.props.getContacts({ ...query, search });
  }

  componentWillUnmount() {
    this.props.changeTitleAction('');
  }

  toggle = () => {
    const { fromCases = false } = QueryString.parse(this.props.location.search);
    const { fromDetailsCase = false, idCase } = QueryString.parse(this.props.location.search);
    const { fromQuotations = false } = QueryString.parse(this.props.location.search);
    const { rut } = this.state;
    if (fromCases) {
      this.props.history.push(`/casos?rut=${rut}`);
    }
    if (fromDetailsCase) {
      this.props.history.push(`/casos/${idCase}`);
    }
    if (fromQuotations) {
      this.props.history.push(`/cotizaciones?rut=${rut}`);
    }
    this.setState({ isOpenModalC: false });
  }

  toggleDrop = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  // onClickContactoEditar = () => {
  //   this.setState({ isOpenModalContactEdit: true });
  // }

  onClickContacto = () => {
    let {
      rut = null,
      newContact,
      fromDetailsCase,
      clientEmail,
    } = QueryString.parse(this.props.location.search);
    if (rut) {
      this.setState({
        isOpenModalC: true,
        _id: null,
        names: '',
        paternalSurname: '',
        maternalSurname: '',
        companyName: '',
        userSII: '',
        passwordSII: '',
        emails: [],
        rent: 0,
        birthdate: null,
        rut,
        type: { value: 'dependent', label: 'Dependiente' },
        phones: [],
        addresses: [],
        profile: null,
        nationality: { value: 1, label: 'Chilena' },
        sex: null,
        civilStatus: null,
        communes: [],
      });
    } else {
      this.setState({
        isOpenModalC: true,
        _id: null,
        names: '',
        paternalSurname: '',
        maternalSurname: '',
        companyName: '',
        userSII: '',
        passwordSII: '',
        emails: [],
        rent: 0,
        birthdate: null,
        rut: '',
        type: { value: 'dependent', label: 'Dependiente' },
        phones: [],
        addresses: [],
        profile: null,
        nationality: { value: 1, label: 'Chilena' },
        sex: null,
        civilStatus: null,
        communes: [],
      });
    }
    if ((newContact !== undefined) && (fromDetailsCase !== undefined) && (clientEmail !== undefined)) {
      const mail = [{
        email: clientEmail,
        fromTrinidad: false,
        status: true,
      }];
      this.setState({ emails: mail });
    }
  }

  onClickDeleteContacto = contact => () => {
    this.setState({ isOpenModalD: true, contact });
  }

  onClickFilterContacto = () => {
    // this.setState({ isOpenModalF: true, contact });
    this.setState({
      isOpenModalF: true,
      _id: null,
      names: '',
      paternalSurname: '',
      maternalSurname: '',
      companyName: '',
      userSII: '',
      passwordSII: '',
      emails: [],
      rent: 0,
      birthdate: null,
      rut: '',
      type: { value: 'dependent', label: 'Dependiente' },
      phones: [],
      addresses: [],
      profile: null,
      nationality: { value: 'CHL', label: 'Chile' },
      sex: null,
      civilStatus: null,
      communes: [],
    });
  }

  toggleDeleteContacto = isOk => () => {
    if (isOk) {
      this.onDelete();
    } else {
      this.setState({ isOpenModalD: false });
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

  toggleTooltip = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    });
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

      // if ((maternalSurname.trim() === '')) {
      //   BasicNotification.show({
      //     color: 'danger',
      //     title: 'Atención',
      //     message: 'Debes ingresar un apellido materno.',
      //   });
      //   return;
      // }
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

    // console.log(phones);

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

  onEditar = conact => () => {
    const {
      _id,
      names,
      paternalSurname,
      maternalSurname,
      type,
      companyName,
      userSII,
      passwordSII,
      emails,
      rent,
      birthdate,
      rut,
      phones,
      addresses,
      profile,
      nationality,
      sex,
      civilStatus,
    } = conact;

    this.setState({
      _id,
      names,
      isOpenModalC: true,
      paternalSurname: paternalSurname ? paternalSurname.trim() : '',
      maternalSurname: maternalSurname ? maternalSurname.trim() : '',
      type: this.translateContact(type),
      companyName: companyName ? companyName.trim() : '',
      userSII: userSII ? userSII.trim() : '',
      passwordSII,
      emails,
      rent,
      birthdate: birthdate ? moment(birthdate).toDate() : birthdate,
      rut,
      phones,
      addresses: map(addresses, (address) => {
        if (address.region) {
          const result = find(RegionesComunas, region => region.value === address.region.value);
          return { ...address, coptions: result.communes };
        }
        return {};
      }),
      profile,
      nationality,
      sex,
      civilStatus,
    });
  }

  onDelete = () => {
    const { contact } = this.state;
    this.props.deleteUser(contact._id, () => {
      this.props.getContacts();
      this.setState({ isOpenModalD: false });
    });
  }

  sendData = (data) => {
    const { fromDetailsCase, idCase } = QueryString.parse(this.props.location.search);
    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');
    if ((fromDetailsCase !== undefined) && idCase) {
      delete data._id;
      this.props.createContacts(data, (body) => {
        // console.log('body', body);
        const assignClient = {
          action: 'assignClient',
          payload: {
            client: body._id,
          },
        };
        // console.log('idCase', idCase);
        // console.log('assignClient', assignClient);

        if (isAdmin) {
          this.props.updateCase(idCase, assignClient, () => {
            this.toggle();
          });
        } else {
          this.props.updateCaseMe(idCase, assignClient, () => {
            this.toggle();
          });
        }
      });
    }

    if (!data._id) {
      delete data._id;
      this.props.createContacts(data, () => {
        this.props.getContacts();
        this.toggle();
      });
    } else {
      this.props.updateContact(data._id, data, () => {
        this.props.getContacts();
        this.toggle();
      });
    }
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

  // onChangeEmail = index => (e) => {
  //   const emails = [...this.state.emails];
  //   emails[index] = e.target.value;
  //   this.setState({ emails });
  // }

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

  onChangeSearch = (e) => {
    this.setState({ search: e.target.value });
  }

  onSubmitSearch = (e) => {
    e.preventDefault();

    const {
      search,
    } = this.state;

    // let query = QueryString.parse(this.props.location.search);
    let query = {};

    // if (search === null) {
    //   query = {};
    // }


    Object.assign(query, { search });

    // const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');

    // if (isAdmin) {
    this.props.getContacts(query, () => {
      this.props.history.push(`/contactos?${QueryString.stringify(query)}`);
    });
    // }
  }

  onSelectAllClick = (checked) => {
    if (checked) {
      const { contacts } = this.props;
      this.setState({ selected: contacts.map(contact => contact._id) });
      return;
    }
    this.setState({ selected: [] });
  }

  onClickRow = id => () => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    this.setState({ selected: newSelected });
  }

  onChangePage = (page) => {
    this.setState({ page });
    const query = QueryString.parse(this.props.location.search);
    this.props.history.push(`/contactos?${QueryString.stringify({ ...query, page: page + 1 })}`);
    this.props.getContacts({ ...query, page: page + 1 });
  }

  onChangeRowsPerPage = (rowsPerPage) => {
    this.setState({ rowsPerPage });
    const query = QueryString.parse(this.props.location.search);
    this.props.history.push(`/contactos?${QueryString.stringify({ ...query, limit: rowsPerPage })}`);
    this.props.getContacts({ ...query, limit: rowsPerPage });
  }

  onChangeFilter = key => (e) => {
    const valueToFilter = { ...this.state.valueToFilter };
    valueToFilter[key] = e;
    this.setState({ valueToFilter });
  }

  toFilter = () => {
    const { valueToFilter } = this.state;
    const dataToFilter = {};

    if (valueToFilter.nationalities != null) {
      dataToFilter.nationalities = valueToFilter.nationalities.value;
    }

    if (valueToFilter.sexes != null) {
      dataToFilter.sexes = valueToFilter.sexes.value;
    }

    if (valueToFilter.civilStates != null) {
      dataToFilter.civilStates = valueToFilter.civilStates.value;
    }

    let query = QueryString.parse(this.props.location.search);
    if (dataToFilter) {
      query = {};
    }

    Object.assign(query, dataToFilter);

    this.props.getContacts(query, () => {
      this.props.history.push(`/contactos?${QueryString.stringify(query)}`);
      this.setState({ isOpenModalF: false });
    });
  }

  toggleFilterContacto = isOk => () => {
    if (isOk) {
      this.toFilter();
    } else {
      this.setState({ isOpenModalF: false });
    }
  }

  cleanFilters = () => {
    this.setState({
      valueToFilter: {
        nationalities: {},
        sexes: {},
        civilStates: {},
      },
    });
  }

  AllContacts = () => {
    this.props.getContacts();
    this.setState({ search: '' });
  }

  render() {
    const {
      selected,
      page,
      rowsPerPage,
    } = this.state;
    const { total } = this.props;

    const data = map(this.props.contacts, contact => ({
      id: contact._id,
      cells: (
        <Fragment>
          <TableCell className="material-table__cell" align="left">{setRUTFormat(contact.rut)}</TableCell>
          <TableCell className="material-table__cell" align="left">
            {findFullName(contact)}
          </TableCell>
          <TableCell className="material-table__cell" align="left">{contact.phones.length >= 1 && `${contact.phones[0].code} ${contact.phones[0].number}`}</TableCell>
          <TableCell className="material-table__cell" align="left">{contact.emails.length >= 1 && contact.emails[0].email}</TableCell>
          <TableCell className="material-table__cell" align="left">
            <NumberFormat
              value={contact.rent || 0}
              displayType="text"
              decimalSeparator=","
              thousandSeparator="."
              prefix="$"
            />
          </TableCell>
          <TableCell className="material-table__cell" align="left">
            <a href="javascript:void(0);" onClick={this.onEditar(contact)}>
              <span
                className="lnr lnr-lnr lnr-pencil"
                style={{
                  fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', color: '#000',
                }}
              />
            </a>
            <a
              style={{ marginLeft: '10%' }}
              onClick={this.onClickDeleteContacto(contact)}
              href="javascript:void(0);"
            >
              <span
                className="lnr lnr-lnr lnr-trash"
                style={{
                  fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', color: '#000',
                }}
              />
            </a>
          </TableCell>
        </Fragment>),
    }));
    return (
      <div className="dashboard container">
        <ModalContacto
          isOpen={this.state.isOpenModalC}
          toggle={this.toggle}
          onChangeInput={this.onChangeInput}
          onChangePhone={this.onChangePhone}
          onRemove={this.onRemove}
          addPhone={this.addPhone}
          value={this.state}
          communes={this.state.communes}
          onChangeAddress={this.onChangeAddress}
          onRemoveAddress={this.onRemoveAddress}
          addAddress={this.addAddress}
          onChangeEmail={this.onChangeEmail}
          onRemoveEmail={this.onRemoveEmail}
          isRUTValid={this.isRUTValid}
          addEmail={this.addEmail}
          onSubmit={this.onSubmit}
          disableButtonCreate={this.props.creatting}
        />
        {/* <ModalContactoEdit
          isOpen={this.state.isOpenModalContactEdit}
          toggle={this.toggle}
        /> */}
        <DModal
          title="Atención"
          color="warning"
          message="¿Esta seguro que desea borrar este registro?"
          isOpen={this.state.isOpenModalD}
          toggle={this.toggleDeleteContacto}
        />
        <FModal
          title="Filtrar"
          color="warning"
          message="¿Esta seguro que desea borrar este registro?"
          isOpen={this.state.isOpenModalF}
          toggle={this.toggleFilterContacto}
          onChangeFilter={this.onChangeFilter}
          cleanFilters={this.cleanFilters}
          valueToFilter={this.state.valueToFilter}
        />
        <Card style={{ paddingBottom: '10px' }}>
          <CardBody className="card_body_flex" style={{ paddingTop: '10px' }}>
            <Col md="8" style={{ display: 'flex', flexWrap: 'wrap' }}>
              <Col xs="auto" sm="auto" md="auto">
                {/* <FormGroup>
                  <Input className="find_of_bar" placeholder="Buscar" style={{ marginTop: '1%' }} />
                </FormGroup> */}
                <form style={{ display: 'flex', flexWrap: 'wrap' }} onSubmit={this.onSubmitSearch}>
                  {/* <p className="info_icon_search" id="TooltipExample"> <span>!</span></p>
                  <Tooltip placement="botton" isOpen={this.state.tooltipOpen} target="TooltipExample" toggle={this.toggleTooltip}>
                    Al buscar con rut, sin puntos, ni guion
                  </Tooltip> */}
                  <span className="lnr lnr-magnifier form-control-feedback" />
                  <Input className="find_of_bar" onChange={this.onChangeSearch} value={this.state.search} placeholder="Nombre Cliente, Rut Cliente" style={{ marginTop: '13px', paddingLeft: '32px' }} />
                  {/* <button type="submit" style={{ margin: '10px 10px' }} className="btn2 asignar2">
                    <span className="lnr lnr-magnifier icon_standars" />
                    Buscar
                  </button> */}
                  <button type="button" style={{ margin: '11px 0px 0px 10px' }} onClick={this.AllContacts} className="btn2 asignar2">
                    {/* <span className="lnr lnr-magic-wand icon_standars" /> */}
                    <img src={ereaserIcon} alt="" style={{ width: '15px' }} />
                    {/* Limpiar busqueda */}
                  </button>
                </form>
              </Col>
              <Col md="2" className="mb-2" style={{ padding: '0px' }}>
                {/* <button type="button" className="btn2 asignar2" onClick={this.onClickFilterContacto}>
                  <span className="lnr lnr-funnel icon_standars" />
                  Filtrar
                </button> */}
              </Col>
            </Col>

            <Col md="4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Col xs="auto" sm="auto" md="auto">
                <button
                  type="button"
                  className="asignar2 new_contact_button"
                  onClick={this.onClickContacto}
                  style={{ margin: '10px 10px' }}
                >
                  Nuevo Contacto
                </button>
                {/* <button
                  type="button"
                  className="asignar2 new_contact_button"
                  onClick={this.onClickContactoEditar}
                  style={{ margin: '10px 10px' }}
                >
                  Nuevo Contacto 2
                </button> */}
              </Col>
              {/* <Col md="2">
                <Dropdown isOpen={this.state.dropdownOpen} size="sm" toggle={this.toggleDrop}>
                  <DropdownToggle caret style={{ backgroundColor: '#fff' }} className="this_one">
                    <span
                      className="lnr lnr-lnr lnr-cog"
                      style={{
                        fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', color: '#000',
                      }}
                    />
                  </DropdownToggle>
                  <DropdownMenu style={{ fontSize: '12px', minWidth: '6rem' }}>
                    <DropdownItem>Importar</DropdownItem>
                    <DropdownItem>Exportar</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </Col> */}
            </Col>
          </CardBody>
        </Card>
        <Row>
          <MatTable
            onSelectAllClick={this.onSelectAllClick}
            onChangePage={this.onChangePage}
            cargando={this.props.cargando}
            onChangeRowsPerPage={this.onChangeRowsPerPage}
            onClickRow={this.onClickRow}
            selected={selected}
            headers={headers}
            data={data}
            page={page}
            rowsPerPage={rowsPerPage}
            total={total}
          />
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ({ contacts, resources }) => ({
  contacts: contacts.collection,
  cargando: contacts.cargando,
  creatting: contacts.creatting,
  total: contacts.count,
  limit: contacts.limit,
  all: contacts,
  Communs: resources.Communs,
});

const mapDispatchToProps = {
  changeTitleAction,
  createContacts,
  getContacts,
  updateContact,
  deleteUser,
  getRegions,
  getCommuns,
  updateCase,
  updateCaseMe,
};
export default connect(mapStateToProps, mapDispatchToProps)(ContactContent);
