/* eslint-disable array-callback-return */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-else-return */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-shadow */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-indent */
/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, { Component, Fragment } from 'react';
import {
  Card, CardBody, Row, FormGroup, Label, Button, Nav, Badge, NavItem, NavLink, TabContent, TabPane, Input,
  Col,
} from 'reactstrap';
import classnames from 'classnames';
import Select from 'react-select';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import map from 'lodash/map';
import NumberFormat from 'react-currency-format';
import RUTJS from 'rutjs';
import moment from 'moment';
import Isemail from 'isemail';
import { connect } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import Skeleton from 'react-loading-skeleton';
import avatarDefault from '../../../shared/img/avatar-default.jpg';
import AssignActivityModal from './AssignActivityModal';
import BasicNotification from '../../../shared/components/Notifications/BasicNotification';
import { setRUTFormat, isUserAllowed } from '../../../shared/utils';
import DModal from '../../../shared/components/Modal/Modal';
import SendEvaluationModal from '../../../shared/components/Modal/SendEvaluationModal';
import EvaluateModal from '../../../shared/components/Modal/ModalEvaluation';
import EModal from '../../../shared/components/Modal/ModalE';
import CloseQuotationsModal from '../../../shared/components/Modal/CloseQuotationsModal';
import ModalContactoEdit from '../../Contactos/components/ModalContactoEdit';
import MailsContents from './MailsContents';
import {
  getCasesIdMe,
  deleteCase,
  getAllTypesCases,
  getAllSubTypesCases,
  updateCase,
  createCase,
  createMyCase,
} from '../../../redux/actions/casesActions';
import {
  getContactByRut,
  getContractByRut,
} from '../../../redux/actions/contactosActions';
import {
  createQuotations,
  createQuotationsMe,
  updateQuotations,
  updateQuotationsMe,
  getQuotationById,
  getQuotationByIdMe,
  deleteQuotations,
  sendFormRequest,
} from '../../../redux/actions/quotationsActions';
import {
  getRegions,
  getSettings,
  getCommuns,
  getCivilStatus,
} from '../../../redux/actions/resourcesActions';
import {
  getUsers,
} from '../../../redux/actions/userActions';
import { changeTitleAction } from '../../../redux/actions/topbarActions';


registerLocale('es', es);

class QuotationDetalle extends Component {
  constructor() {
    super();
    this.state = {
      activeTab: '1',
      isOpenModalD: false,
      isOpenModalSendForm: false,
      isOpenModalContactEdit: false,
      isOpenModalE: false,
      isOpenModalCloseQuotations: false,
      isOpenEvaluateModal: false,
      isOpenModalAssignActivity: false,
      isOpenModalMessageMail: false,
      idDetail: null,
      new: false,
      _id: '',
      client: '',
      executive: null,
      haveProperty: false,
      haveVehicle: false,
      companyName: '',
      companyRUT: '',
      typeContract: null,
      concessionaire: '',
      dateEntry: null,
      status: '',
      workPhone: '',
      workSituation: null,
      officePhone: '',
      origin: null,
      trinidadCode: null,
      carPatent: null,
      users: [],
      updateLocal: false,
      editField: true,
      showButton: false,
      code: 0,
      activities: [],
      activity: {
        description: null,
        executive: null,
      },
      typeVehicle: null,
      priceVehicle: '',
      initialPayment: '',
      numberOfFees: 0,
      feeToPay: '',
      names: '',
      paternalSurname: '',
      maternalSurname: '',
      rut: '',
      messages: undefined,
      NewMessage: {
        editor: null,
        attachments: [],
      },
      birthdate: '',
      phone: '',
      civilStatus: '',
      address: {
        street: null,
        region: null,
        commune: null,
      },
      email: '',
      sourceMail: '',
      emailArrayToMailsContents: [],
      namesCrm: '',
      paternalCrm: '',
      rutCrm: '',
      // phoneClienteCrm: '',
      // emailClienteCrm: '',
      // rentClienteCrm: '',
      rent: '',
      fromSimulation: false,
      disableToDo: false,
      plan: null,
      fixedIncome: false,
      variableIncome: false,
      averageIncome: '',
      clientActivity: null,
      sentInformationRequest: null,
      sentClientResponse: null,
      toDo: {
        action: 'updateToDo',
        payload: {
          customerContacted: {
            status: false,
            date: null,
          },
          completedForm: {
            status: false,
            date: null,
          },
          FAndIDerivative: {
            status: false,
            date: null,
          },
          clientVisit: {
            status: false,
            date: null,
          },
        },
      },
    };
  }

  componentDidMount() {
    const {
      id,
      rut } = this.props.match.params;

    this.props.getSettings();

    this.props.getRegions({ all: true }, (body) => {
      this.setState({ regions: body });
    });
    this.props.setTitle('Detalle cotización');

    this.props.getCivilStatus();

    if (id) {
      // console.log('entro en id');

      const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');
      if (isAdmin) {
        this.props.getQuotationById(id, (quotationInfo) => {
          if (isAdmin) {
            this.props.getUsers({ all: true, roles: 'admin, manager, sales-executive' }, (body) => {
              this.setState({ users: map(body, user => ({ value: user._id, label: `${user.firstName} ${user.lastName}` })) });
            });
          }
          this.assignValueOnState(quotationInfo);
        });
      } else {
        this.props.getQuotationByIdMe(id, (quotationInfo) => {
          const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');
          if (isAdmin) {
            this.props.getUsers({ all: true, roles: 'admin, manager, sales-executive' }, (body) => {
              this.setState({ users: map(body, user => ({ value: user._id, label: `${user.firstName} ${user.lastName}` })) });
            });
          }
          this.assignValueOnState(quotationInfo);
        });
      }
    }

    if (rut) {
      const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');
      if (isAdmin) {
        this.props.getUsers({ all: true, roles: 'admin, manager, sales-executive' }, (body) => {
          this.setState({ users: map(body, user => ({ value: user._id, label: `${user.firstName} ${user.lastName}` })) });
        });
      }

      this.props.getContactByRut(rut, (body) => {
        // if (body.names === '') {
        console.log('info del contacto', body.emails);
        // }
        this.setState({
          new: true,
          client: body._id,
          createdAt: new Date(),
          namesCrm: (body.names === '') ? body.companyName : body.names,
          paternalCrm: body.paternalSurname || '',
          rutCrm: body.rut ? body.rut : '',
          // phoneClienteCrm: body.phones ? `${body.phones[0].code} ${body.phones[0].number}` : '',
          emailClienteCrm: body.emails[0].email,
          // rentClienteCrm: body.rent ? body.rent : '',
          editField: false,
          // info a precargar
          rut: body.rut ? body.rut : '',
          names: body.names ? body.names : '',
          paternalSurname: body.paternalSurname ? body.paternalSurname : '',
          maternalSurname: body.maternalSurname ? body.maternalSurname : '',
          birthdate: body.birthdate ? moment(body.birthdate).toDate() : '',
          email: body.emails[0].email,
          emailArrayToMailsContents: (body.emails) ? (body.emails.length > 0) ? body.emails.map(email => ({ value: email.email, label: email.email })) : [] : [],
          civilStatus: body.civilStatus ? body.civilStatus : '',
          phone: body.phones ? body.phones[0].number : '',
          address: body.addresses ? body.addresses[0] : '',
        });
      });

      this.props.getContractByRut(rut);
    }
  }

  componentDidUpdate() {
    const { rutCrm, updateLocal } = this.state;
    const { getContactByRut, getContractByRut } = this.props;
    if (rutCrm && !updateLocal) {
      getContactByRut(rutCrm, () => { });
      getContractByRut(rutCrm);
      this.setState({ updateLocal: true });
    }
  }

  assignValueOnState = (value) => {
    const { id } = this.props.match.params;
    const { payload } = this.state.toDo;
    payload.customerContacted = ((value.customerContacted) && (value.customerContacted.date)) ? value.customerContacted : { status: false, date: null };
    payload.completedForm = ((value.completedForm) && (value.completedForm.date)) ? value.completedForm : { status: false, date: null };
    payload.FAndIDerivative = ((value.FAndIDerivative) && (value.FAndIDerivative.date)) ? value.FAndIDerivative : { status: false, date: null };
    payload.clientVisit = ((value.clientVisit) && (value.clientVisit.date)) ? value.clientVisit : { status: false, date: null };
    this.setState({
      idDetail: id,
      _id: id,
      names: (value.names === '') ? value.companyName : value.names,
      paternalSurname: value.paternalSurname,
      maternalSurname: value.maternalSurname,
      rut: value.rut || '',
      messages: value.messages ? value.messages : undefined,
      email: value.email ? value.email : '',
      address: value.address ? value.address : '',
      birthdate: value.birthdate ? moment(value.birthdate).toDate() : '',
      civilStatus: value.civilStatus ? value.civilStatus : '',
      fixedIncome: this.translatePropierty(value.fixedIncome),
      variableIncome: this.translatePropierty(value.variableIncome),
      averageIncome: value.averageIncome ? value.averageIncome : '',
      namesCrm: value.client.names ? value.client.names : '',
      fromSimulation: value.fromSimulation ? value.fromSimulation : false,
      plan: value.plan ? value.plan : null,
      paternalCrm: value.client.paternalSurname ? value.client.paternalSurname : '',
      rutCrm: value.client.rut ? value.client.rut : '',
      // phoneClienteCrm: value.client.phones ? `${value.client.phones[0].code} ${value.client.phones[0].number}` : '',
      emailClienteCrm: value.client.emails ? value.client.emails[0].email : '',
      emailArrayToMailsContents: (value.client.emails) ? (value.client.emails.length > 0) ? value.client.emails.map(email => ({ value: email.email, label: email.email })) : [] : [],
      // rentClienteCrm: value.client.rent ? value.client.rent : '',
      clientActivity: value.clientActivity ? value.clientActivity : '',
      rent: (value.rent) ? value.rent : '',
      workSituation: value.workSituation ? this.translatePropierty(value.workSituation) : null,
      status: (value.status) ? value.status : '',
      phone: value.client.phones[0].number,
      executive: value.executive ? { value: value.executive._id, label: `${value.executive.firstName} ${value.executive.lastName}` } : null,
      haveProperty: this.translatePropierty(value.haveProperty),
      haveVehicle: this.translatePropierty(value.haveVehicle),
      carPatent: value.carPatent ? value.carPatent : '',
      companyName: value.companyName || '',
      companyRUT: (value.companyRUT) ? setRUTFormat(value.companyRUT) : '',
      typeContract: (value.typeContract) ? this.translateContract(value.typeContract) : '',
      concessionaire: value.concessionaire,
      code: value.code,
      trinidadCode: value.trinidadCode || null,
      typeVehicle: (value.typeVehicle) ? this.translatePropierty(value.typeVehicle) : '',
      priceVehicle: (value.priceVehicle) ? value.priceVehicle : '',
      initialPayment: (value.initialPayment) ? value.initialPayment : '',
      numberOfFees: (value.numberOfFees) ? value.numberOfFees : '',
      feeToPay: (value.feeToPay) ? value.feeToPay : '',
      dateEntry: value.dateEntry ? moment(value.dateEntry).toDate() : '',
      workPhone: value.workPhone,
      officePhone: value.officePhone,
      activities: value.activities,
      origin: this.findValue(value.origin),
      createdAt: value.createdAt,
      client: value.client._id,
      evaluation: value.evaluation,
      sentInformationRequest: value.sentInformationRequest ? moment(value.sentInformationRequest).format('DD/MM/YYYY, h:mm:ss') : null,
      sentClientResponse: value.sentClientResponse ? moment(value.sentClientResponse).format('DD/MM/YYYY, h:mm:ss') : null,
      payload,
    });
  }

  cancelEdit = () => {
    const { id } = this.props.match.params;
    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');
    if (isAdmin) {
      this.props.getQuotationById(id, (quotationInfo) => {
        this.props.getUsers({ all: true, roles: 'admin, manager, sales-executive' }, (body) => {
          this.setState({ users: map(body, user => ({ value: user._id, label: `${user.firstName} ${user.lastName}` })) });
        });
        this.assignValueOnState(quotationInfo);
      });
    } else {
      this.props.getQuotationByIdMe(id, (quotationInfo) => {
        this.assignValueOnState(quotationInfo);
      });
    }
    this.setState({ editField: true, showButton: false });
  }

  translatePropierty = (value) => {
    if (value === true) {
      return { value: true, label: 'Si' };
    }

    if (value === false) {
      // console.log('translatePropierty -> value', value);
      return { value: false, label: 'No' };
    }

    if (value === 'auto') {
      return { value: 'auto', label: 'Auto' };
    }

    if (value === 'dependent') {
      return { value: 'dependent', label: 'Dependente' };
    }


    if (value === 'independent') {
      return { value: 'independent', label: 'Independente' };
    }

    if (value === 'moto') {
      return { value: 'moto', label: 'Moto' };
    }

    return null;
  }

  findIcon = (origin) => {
    // console.log(origin);

    if (origin) {
      if (origin.value === 'phone') {
        return 'phone-handset';
      }
      if (origin.value === 'web') {
        return 'laptop';
      }
      if ((origin.value === 'referred') || (origin.value === 'face') || (origin.value === 'trinidad')) {
        return 'user';
      }
    }
    return 'user';
  }

  onClickContactoEditar = () => {
    this.setState({ isOpenModalContactEdit: true });
  }

  translateContract = (value) => {
    if (value === 'fixedTerm') {
      return { value: 'fixedTerm', label: 'Plazo fijo' };
    }

    if (value === 'undefined') {
      return { value: 'undefined', label: 'Indefenido' };
    }

    return null;
  }

  startEdit = () => {
    this.setState({ editField: false, showButton: true });
  }

  findValue = (value) => {
    if (value === 'pending') {
      return { value: 'pending', label: 'Pendiente' };
    }
    if (value === 'opened') {
      return { value: 'opened', label: 'Abierto' };
    }
    if (value === 'closed') {
      return { value: 'closed', label: 'Cerrado' };
    }
    if (value === 'phone') {
      return { value: 'phone', label: 'Teléfono' };
    }
    if (value === 'web') {
      return { value: 'web', label: 'Web' };
    }
    if (value === 'other') {
      return { value: 'other', label: 'Otros' };
    }
    if (value === 'referred') {
      return { value: 'referred', label: 'Referido' };
    }

    if (value === 'face') {
      return { value: 'face', label: 'Presencial' };
    }

    if (value === 'trinidad') {
      return { value: 'trinidad', label: 'Trinidad' };
    }
    return null;
  }

  findValueWithClassForStatus = (value) => {
    if (value === 'pending') {
      return { class: 'badge_color_yellow', label: 'Pendiente' };
    }
    if (value === 'opened') {
      return { class: 'badge_color', label: 'Abierto' };
    }
    if (value === 'closed') {
      return { class: 'badge_color_red', label: 'Cerrado' };
    }
    return { class: 'badge_color_yellow', label: 'Pendiente' };
  }

  toggle = (tab) => {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  onChangeActivity = key => (e) => {
    const activity = { ...this.state.activity };
    activity[key] = e.target.value;
    this.setState({ activity });
  };

  onChangeInput = key => (e) => {
    if ((key === 'names')
      || (key === 'paternalSurname')
      || (key === 'maternalSurname')
      || (key === 'companyName')
      || (key === 'concessionaire')
      || (key === 'street')
      || (key === 'email')
      || (key === 'clientActivity')
      || (key === 'numberOfFees')) {
      this.setState({ [key]: e.target.value });
    } else if (key === 'carPatent') {
      this.setState({ [key]: e.target.value.replace(/[^A-Z0-9\s]/gi, '').trim() });
    } else if ((key === 'phone')) {
      const justNumbers = e.target.value.replace(/[^0-9\s]/gi, '').trim();
      this.setState({ [key]: justNumbers });
    } else if ((key === 'companyRUT') || (key === 'rut')) {
      this.setState({ [key]: setRUTFormat(e.target.value.trim()) });
    } else if ((key === 'officePhone') || (key === 'workPhone')) {
      const justNumbers = e.target.value.replace(/[^0-9\s]/gi, '').trim();
      this.setState({ [key]: justNumbers });
    } else if ((key === 'rent')
      || (key === 'priceVehicle')
      || (key === 'initialPayment')
      || (key === 'numberOfFees')
      || (key === 'feeToPay')
      || (key === 'averageIncome')) {
      this.setState({ [key]: e.target.value.replace(/[^$0-9\s]/gi, '') });
    } else {
      this.setState({ [key]: e });
    }
  }

  onChangeToDoList = key => (e) => {
    const { _id, toDo } = this.state;
    this.setState({ disableToDo: true });

    if (key === 'customerContacted') {
      toDo.payload.customerContacted = e.target.checked;
    }

    if (key === 'completedForm') {
      toDo.payload.completedForm = e.target.checked;
    }

    if (key === 'FAndIDerivative') {
      toDo.payload.FAndIDerivative = e.target.checked;
    }

    if (key === 'clientVisit') {
      toDo.payload.clientVisit = e.target.checked;
    }

    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');
    if (isAdmin) {
      this.props.updateQuotations(_id, toDo, () => {
        this.props.getQuotationById(_id, (body) => {
          this.assignValueOnState(body);
          this.setState({ disableToDo: false });
        });
      });
    } else {
      this.props.updateQuotationsMe(_id, toDo, () => {
        this.props.getQuotationByIdMe(_id, (body) => {
          this.assignValueOnState(body);
          this.setState({ disableToDo: false });
        });
      });
    }
  }

  onChangeAddressPersonal = key => (e) => {
    const address = { ...this.state.address };
    if (key === 'street') {
      address.street = e.target.value;
      this.setState({ address });
    } else if (key === 'addressRegion') {
      if (e) {
        address.region = {
          value: e.value,
          label: e.label,
        };
        address.commune = null;
        this.setState({ address });
        this.props.getCommuns({ region: e.value }, (body) => {
          address.coptions = body;
          this.setState({ address });
        });
      } else {
        address.region = null;
        address.commune = null;
        address.coptions = [];
        this.setState({ address });
      }
    } else {
      address.commune = e;
      this.setState({ address });
    }
  }

  justReplace = (string) => {
    let withNewLine = '';
    withNewLine = string.replace('↵', '\n');
    return withNewLine;
  }

  onSubmitNewQuotations = (e) => {
    if (e) {
      e.preventDefault();
    }

    const {
      _id,
      client,
      executive,
      haveProperty,
      haveVehicle,
      carPatent,
      companyName,
      companyRUT,
      birthdate,
      typeContract,
      typeVehicle,
      priceVehicle,
      initialPayment,
      numberOfFees,
      feeToPay,
      civilStatus,
      dateEntry,
      names,
      email,
      phone,
      paternalSurname,
      maternalSurname,
      rut,
      rent,
      address,
      concessionaire,
      workSituation,
      workPhone,
      officePhone,
      origin,
      fixedIncome,
      variableIncome,
      averageIncome,
      clientActivity,
    } = this.state;

    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');

    const today = new Date();

    if ((birthdate !== '') && (moment(birthdate).year() > moment(today).year())) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Error ingrese una fecha de nacimiento valida.',
      });

      return;
    }

    if (isAdmin) {
      if (executive === null) {
        BasicNotification.show({
          color: 'danger',
          title: 'Atención',
          message: 'Debe seleccionar un ejecutivo.',
        });

        return;
      }
    }

    // initialPayment

    if (names === '') {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe ingresar un nombre del cliente.',
      });

      return;
    }


    if (paternalSurname === '') {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe ingresar un apellido paterno del cliente.',
      });

      return;
    }

    if (rut === '') {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe ingresar el rut del cliente.',
      });

      return;
    }

    if (Isemail.validate(email) === false) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe ingresar un email valido.',
      });

      return;
    }

    if (!workSituation) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Porfavor es necesario seleccionar una Situación Laboral.',
      });

      return;
    } else if ((workSituation.value === 'independent') && ((!clientActivity) || (clientActivity === ''))) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Porfavor es necesario indicar la actividad del cliente.',
      });
      return;
    }

    // if ((workSituation.value === 'independent') && (clientActivity) && (clientActivity.length < 10)) {
    //   BasicNotification.show({
    //     color: 'danger',
    //     title: 'Atención',
    //     message: 'La descripcion de la actividad del cliente es muy corta.',
    //   });
    //   return;
    // }

    if (!origin) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe seleccionar un origen.',
      });

      return;
    }

    if (((address.street !== null) && (address.street !== '')) || (address.region !== null) || (address.commune !== null)) {
      if ((address.street === '') || (address.region === null) || (address.commune === null)) {
        BasicNotification.show({
          color: 'danger',
          title: 'Atención',
          message: 'Debe ingresar todos los campos de la o las direcciones.',
        });
        return;
      }
    }

    if ((haveVehicle.value === true) && (!carPatent)) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe ingresar la patente del vehiculo.',
      });

      return;
    }

    if (!typeVehicle) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe seleccionar un tipo de vehiculo.',
      });

      return;
    }

    // if ((initialPayment) && (!priceVehicle)) {
    //   BasicNotification.show({
    //     color: 'danger',
    //     title: 'Atención',
    //     message: 'No se puede ingresar un monto pie sin un precio vehiculo',
    //   });

    //   return;
    // }

    // if (parseInt(String(initialPayment).replace(/[^,0-9\s]/gi, ''), 10) > parseInt(String(priceVehicle).replace(/[^,0-9\s]/gi, ''), 10)) {
    //   BasicNotification.show({
    //     color: 'danger',
    //     title: 'Atención',
    //     message: 'El monto pie no puede ser mayor al precio vehiculo',
    //   });

    //   return;
    // }

    // if ((initialPayment) && (priceVehicle) && (parseInt(String(initialPayment).replace(/[^,0-9\s]/gi, ''), 10) > (parseInt(String(priceVehicle).replace(/[^,0-9\s]/gi, ''), 10) - 600000))) {
    //   BasicNotification.show({
    //     color: 'danger',
    //     title: 'Atención',
    //     message: `El monto pie no puede ser mayor a ${String(priceVehicle).replace(/[^,0-9\s]/gi, '') - 600000}`,
    //   });

    //   return;
    // }

    // if ((initialPayment) && (priceVehicle) && (parseInt(String(initialPayment).replace(/[^,0-9\s]/gi, ''), 10) < (parseInt(String(priceVehicle).replace(/[^,0-9\s]/gi, ''), 10) * 0.1))) {
    //   BasicNotification.show({
    //     color: 'danger',
    //     title: 'Atención',
    //     message: 'El monto pie minimo debe ser el 10% del precio vehiculo',
    //   });

    //   return;
    // }

    // if ((feeToPay) && (!priceVehicle)) {
    //   BasicNotification.show({
    //     color: 'danger',
    //     title: 'Atención',
    //     message: 'No se puede ingresar un valor cuota sin un precio vehiculo',
    //   });

    //   return;
    // }

    // if ((feeToPay) && (!numberOfFees)) {
    //   BasicNotification.show({
    //     color: 'danger',
    //     title: 'Atención',
    //     message: 'No se puede ingresar un valor cuota sin un Número cuotas',
    //   });

    //   return;
    // }

    // if ((parseInt(String(feeToPay).replace(/[^,0-9\s]/gi, ''), 10) * parseInt(String(numberOfFees).replace(/[^,0-9\s]/gi, ''), 10)) > parseInt(String(priceVehicle).replace(/[^,0-9\s]/gi, ''), 10)) {
    //   BasicNotification.show({
    //     color: 'danger',
    //     title: 'Atención',
    //     message: 'El numero cuotas con el valor cuotas no puede exceder el valor del precio vehiculo',
    //   });

    //   return;
    // }

    if (!origin.value) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe seleccionar un origen.',
      });

      return;
    }

    if (isAdmin) {
      if (!typeContract) {
        this.sendData({
          _id,
          client,
          haveProperty: haveProperty.value,
          haveVehicle: haveVehicle.value,
          carPatent,
          companyName: companyName.trim(),
          companyRUT: companyRUT.replace(/[^K0-9\s]/gi, ''),
          birthdate,
          dateEntry,
          civilStatus,
          rent: String(rent).replace(/[^,0-9\s]/gi, ''),
          typeVehicle: typeVehicle.value,
          priceVehicle: String(priceVehicle).replace(/[^,0-9\s]/gi, ''),
          initialPayment: !initialPayment ? (initialPayment * 0.1) : String(initialPayment).replace(/[^,0-9\s]/gi, ''),
          numberOfFees: String(numberOfFees).replace(/[^,0-9\s]/gi, ''),
          feeToPay: String(feeToPay).replace(/[^,0-9\s]/gi, ''),
          workPhone,
          workSituation: workSituation.value,
          names: names.trim(),
          paternalSurname: paternalSurname ? paternalSurname.trim() : '',
          maternalSurname: maternalSurname ? maternalSurname.trim() : '',
          rut: rut.replace(/[^K0-9\s]/gi, ''),
          officePhone,
          email: email.trim(),
          phone: phone.trim(),
          address: ((address.street) && (address.commune) && (address.region)) ? address : undefined,
          fixedIncome: fixedIncome ? fixedIncome.value : undefined,
          variableIncome: variableIncome ? variableIncome.value : undefined,
          averageIncome: (averageIncome !== '') ? averageIncome.toString().replace(/[^,0-9\s]/gi, '') : '',
          clientActivity: clientActivity ? clientActivity.trim() : '',
          origin: origin.value,
          executive: executive.value,
          concessionaire: concessionaire ? concessionaire.trim() : '',
        });
      } else {
        this.sendData({
          _id,
          client,
          haveProperty: haveProperty.value,
          haveVehicle: haveVehicle.value,
          carPatent,
          birthdate,
          companyName: companyName.trim(),
          companyRUT: companyRUT.replace(/[^K0-9\s]/gi, ''),
          typeContract: typeContract.value,
          dateEntry,
          rent: String(rent).replace(/[^,0-9\s]/gi, ''),
          civilStatus,
          typeVehicle: typeVehicle.value,
          priceVehicle: String(priceVehicle).replace(/[^,0-9\s]/gi, ''),
          initialPayment: !initialPayment ? (initialPayment * 0.1) : String(initialPayment).replace(/[^,0-9\s]/gi, ''),
          numberOfFees: String(numberOfFees).replace(/[^,0-9\s]/gi, ''),
          feeToPay: String(feeToPay).replace(/[^,0-9\s]/gi, ''),
          workPhone,
          workSituation: workSituation.value,
          names: names.trim(),
          paternalSurname: paternalSurname ? paternalSurname.trim() : '',
          maternalSurname: maternalSurname ? maternalSurname.trim() : '',
          rut: rut.replace(/[^K0-9\s]/gi, ''),
          officePhone,
          email: email.trim(),
          phone: phone.trim(),
          address: ((address.street) && (address.commune) && (address.region)) ? address : undefined,
          fixedIncome: fixedIncome ? fixedIncome.value : undefined,
          variableIncome: variableIncome ? variableIncome.value : undefined,
          averageIncome: (averageIncome !== '') ? averageIncome.toString().replace(/[^,0-9\s]/gi, '') : '',
          clientActivity: clientActivity ? clientActivity.trim() : '',
          origin: origin.value,
          executive: executive.value,
          concessionaire: concessionaire ? concessionaire.trim() : '',
        });
      }
    } else if (!typeContract) {
      this.sendData({
        _id,
        client,
        executive,
        haveProperty: haveProperty.value,
        haveVehicle: haveVehicle.value,
        carPatent,
        birthdate,
        companyName: companyName.trim(),
        companyRUT: companyRUT.replace(/[^K0-9\s]/gi, ''),
        dateEntry,
        civilStatus,
        rent: String(rent).replace(/[^,0-9\s]/gi, ''),
        typeVehicle: typeVehicle.value,
        priceVehicle: String(priceVehicle).replace(/[^,0-9\s]/gi, ''),
        initialPayment: !initialPayment ? (initialPayment * 0.1) : String(initialPayment).replace(/[^,0-9\s]/gi, ''),
        numberOfFees: String(numberOfFees).replace(/[^,0-9\s]/gi, ''),
        feeToPay: String(feeToPay).replace(/[^,0-9\s]/gi, ''),
        workPhone,
        workSituation: workSituation.value,
        names: names.trim(),
        paternalSurname: paternalSurname ? paternalSurname.trim() : '',
        maternalSurname: maternalSurname ? maternalSurname.trim() : '',
        rut: rut.replace(/[^K0-9\s]/gi, ''),
        officePhone,
        email: email.trim(),
        phone: phone.trim(),
        address: ((address.street) && (address.commune) && (address.region)) ? address : undefined,
        fixedIncome: fixedIncome ? fixedIncome.value : undefined,
        variableIncome: variableIncome ? variableIncome.value : undefined,
        averageIncome: (averageIncome !== '') ? averageIncome.toString().replace(/[^,0-9\s]/gi, '') : '',
        clientActivity: clientActivity ? clientActivity.trim() : '',
        origin: origin.value,
        concessionaire: concessionaire ? concessionaire.trim() : '',
      });
    } else {
      this.sendData({
        _id,
        client,
        executive,
        haveProperty: haveProperty.value,
        haveVehicle: haveVehicle.value,
        carPatent,
        birthdate,
        companyName: companyName.trim(),
        companyRUT: companyRUT.replace(/[^K0-9\s]/gi, ''),
        typeContract: typeContract.value,
        dateEntry,
        civilStatus,
        rent: String(rent).replace(/[^,0-9\s]/gi, ''),
        typeVehicle: typeVehicle.value,
        priceVehicle: String(priceVehicle).replace(/[^,0-9\s]/gi, ''),
        initialPayment: !initialPayment ? (initialPayment * 0.1) : String(initialPayment).replace(/[^,0-9\s]/gi, ''),
        numberOfFees: String(numberOfFees).replace(/[^,0-9\s]/gi, ''),
        feeToPay: String(feeToPay).replace(/[^,0-9\s]/gi, ''),
        workPhone,
        names: names.trim(),
        paternalSurname: paternalSurname ? paternalSurname.trim() : '',
        maternalSurname: maternalSurname ? maternalSurname.trim() : '',
        rut: rut.replace(/[^K0-9\s]/gi, ''),
        officePhone,
        email: email.trim(),
        phone: phone.trim(),
        address: ((address.street) && (address.commune) && (address.region)) ? address : undefined,
        workSituation: workSituation.value,
        fixedIncome: fixedIncome ? fixedIncome.value : undefined,
        variableIncome: variableIncome ? variableIncome.value : undefined,
        averageIncome: (averageIncome !== '') ? averageIncome.toString().replace(/[^,0-9\s]/gi, '') : '',
        clientActivity: clientActivity ? clientActivity.trim() : '',
        origin: origin.value,
        concessionaire: concessionaire ? concessionaire.trim() : '',
      });
    }
  }

  sendData = (data) => {
    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');
    if (data.action) {
      if (isAdmin) {
        this.props.updateQuotations(data._id, data, () => {
          this.props.getQuotationById(data._id, (body) => {
            this.setState({ evaluation: body.evaluation, trinidadCode: body.trinidadCode });
          });
        });
      } else {
        this.props.updateQuotationsMe(data._id, data, () => {
          this.props.getQuotationByIdMe(data._id, (body) => {
            this.setState({ evaluation: body.evaluation, trinidadCode: body.trinidadCode });
          });
        });
      }
    } else if (!data._id) {
      delete data._id;

      if (isAdmin) {
        this.props.createQuotations(data, (body) => {
          this.props.history.push(`/cotizaciones/${body._id}`);
        });
      } else {
        this.props.createQuotationsMe(data, (body) => {
          this.props.history.push(`/cotizaciones/${body._id}`);
        });
      }
    } else if (isAdmin) {
      this.props.updateQuotations(data._id, data, () => {
        this.props.getQuotationById(data._id, () => {
          this.props.getQuotationById(data._id, (quotationsInfo) => {
            this.setState({
              activities: quotationsInfo.activities,
              executive: quotationsInfo.executive ? { value: quotationsInfo.executive._id, label: `${quotationsInfo.executive.firstName} ${quotationsInfo.executive.lastName}` } : null,
            });
          });
        });
      });
    } else {
      this.props.updateQuotationsMe(data._id, data, () => {
        this.props.history.push(`/cotizaciones/${data._id}`);
      });
    }

    this.setState({ editField: true, showButton: false });
  }

  onClickEditQuotation = quotationSelected => () => {
    this.setState({ isOpenModalE: true, quotationSelected });
  }

  onClickDeleteQuotations = quotationSelected => () => {
    this.setState({ isOpenModalD: true, quotationSelected });
  }

  onClickSendForm = quotation => () => {
    this.setState({ isOpenModalSendForm: true, quotation });
  }

  onClickCustomerEvaluation = () => {
    if ((this.state.rent) && (this.state.typeVehicle) && (this.state.workSituation)) {
      const {
        _id,
      } = this.state;
      this.sendData({ _id, action: 'sendToTrinidad' });
    } else {
      this.setState({ isOpenEvaluateModal: true });
    }
  }

  onDelete = () => {
    const { quotationSelected } = this.state;
    this.props.deleteQuotations(quotationSelected, () => {
      this.setState({ isOpenModalD: false });
      this.props.history.push('/cotizaciones');
    });
  }

  onSendForm = () => {
    const { quotation } = this.state;
    this.props.sendFormRequest({ quotation }, () => {
      this.setState({ isOpenModalSendForm: false });
      const { id } = this.props.match.params;
      const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');
      if (isAdmin) {
        this.props.getQuotationById(id, (quotationInfo) => {
          this.props.getUsers({ all: true, roles: 'admin, manager, sales-executive' }, (body) => {
            this.setState({ users: map(body, user => ({ value: user._id, label: `${user.firstName} ${user.lastName}` })) });
          });
          this.assignValueOnState(quotationInfo);
        });
      } else {
        this.props.getQuotationByIdMe(id, (quotationInfo) => {
          this.assignValueOnState(quotationInfo);
        });
      }
      // this.props.history.push('/cotizaciones');
    });
  }

  onClickCloseQuotation = quotationSelected => () => {
    this.setState({ isOpenModalCloseQuotations: true, quotationSelected });
  }

  onCloseCase = () => {
    const { quotationSelected } = this.state;
    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');

    const data = {
      action: 'close',
    };

    if (isAdmin) {
      this.props.updateQuotations(quotationSelected, data, () => {
        this.props.getQuotationById(quotationSelected, (quotationInfo) => {
          this.setState({
            idDetail: quotationSelected,
            _id: quotationSelected,
            names: (quotationInfo.client.names === '') ? quotationInfo.client.companyName : quotationInfo.client.names,
            paternalSurname: quotationInfo.client.paternalSurname,
            rut: quotationInfo.client.rut,
            email: quotationInfo.client.emails.length > 0 ? quotationInfo.client.emails[0].email : '',
            rent: (quotationInfo.rent) ? quotationInfo.rent : '',
            status: (quotationInfo.status) ? quotationInfo.status : '',
            phone: quotationInfo.client.phones[0],
            executive: quotationInfo.executive ? { value: quotationInfo.executive._id, label: `${quotationInfo.executive.firstName} ${quotationInfo.executive.lastName}` } : null,
            haveProperty: (quotationInfo.haveProperty) ? this.translatePropierty(quotationInfo.haveProperty) : null,
            haveVehicle: (quotationInfo.haveVehicle) ? this.translatePropierty(quotationInfo.haveVehicle) : null,
            carPatent: quotationInfo.carPatent ? quotationInfo.carPatent : '',
            companyName: quotationInfo.companyName || '',
            companyRUT: (quotationInfo.companyRUT) ? setRUTFormat(quotationInfo.companyRUT) : '',
            typeContract: (quotationInfo.typeContract) ? this.translateContract(quotationInfo.typeContract) : '',
            concessionaire: quotationInfo.concessionaire,
            workSituation: quotationInfo.workSituation ? quotationInfo.workSituation : null,
            fixedIncome: (quotationInfo.fixedIncome) ? this.translatePropierty(quotationInfo.fixedIncome) : null,
            variableIncome: (quotationInfo.variableIncome) ? this.translatePropierty(quotationInfo.variableIncome) : null,
            averageIncome: quotationInfo.averageIncome ? quotationInfo.averageIncome.replace(/[^0-9\s]/gi, '').trim() : null,
            code: quotationInfo.code,
            trinidadCode: quotationInfo.trinidadCode || null,
            typeVehicle: (quotationInfo.typeVehicle) ? this.translatePropierty(quotationInfo.typeVehicle) : '',
            priceVehicle: (quotationInfo.priceVehicle) ? quotationInfo.priceVehicle : '',
            initialPayment: (quotationInfo.initialPayment) ? quotationInfo.initialPayment : '',
            numberOfFees: (quotationInfo.numberOfFees) ? quotationInfo.numberOfFees : '',
            feeToPay: (quotationInfo.feeToPay) ? quotationInfo.feeToPay : '',
            dateEntry: quotationInfo.dateEntry ? moment(quotationInfo.dateEntry).toDate() : '',
            workPhone: quotationInfo.workPhone,
            officePhone: quotationInfo.officePhone,
            activities: quotationInfo.activities,
            origin: this.findValue(quotationInfo.origin),
            createdAt: quotationInfo.createdAt,
            client: quotationInfo.client._id,
            evaluation: quotationInfo.evaluation,
          });
        });
      });
    } else {
      this.props.updateQuotationsMe(quotationSelected, data, () => {
        this.props.getQuotationByIdMe(quotationSelected, (quotationInfo) => {
          this.setState({
            idDetail: quotationSelected,
            _id: quotationSelected,
            names: (quotationInfo.client.names === '') ? quotationInfo.client.companyName : quotationInfo.client.names,
            paternalSurname: quotationInfo.client.paternalSurname,
            rut: quotationInfo.client.rut,
            email: quotationInfo.client.emails.length > 0 ? quotationInfo.client.emails[0].email : '',
            rent: (quotationInfo.rent) ? quotationInfo.rent : '',
            status: (quotationInfo.status) ? quotationInfo.status : '',
            phone: quotationInfo.client.phones[0],
            executive: quotationInfo.executive ? { value: quotationInfo.executive._id, label: `${quotationInfo.executive.firstName} ${quotationInfo.executive.lastName}` } : null,
            haveProperty: (quotationInfo.haveProperty) ? this.translatePropierty(quotationInfo.haveProperty) : null,
            haveVehicle: (quotationInfo.haveVehicle) ? this.translatePropierty(quotationInfo.haveVehicle) : null,
            carPatent: quotationInfo.carPatent ? quotationInfo.carPatent : '',
            companyName: quotationInfo.companyName || '',
            companyRUT: (quotationInfo.companyRUT) ? setRUTFormat(quotationInfo.companyRUT) : '',
            typeContract: (quotationInfo.typeContract) ? this.translateContract(quotationInfo.typeContract) : '',
            concessionaire: quotationInfo.concessionaire,
            workSituation: quotationInfo.workSituation ? quotationInfo.workSituation : null,
            fixedIncome: (quotationInfo.fixedIncome) ? this.translatePropierty(quotationInfo.fixedIncome) : null,
            variableIncome: (quotationInfo.variableIncome) ? this.translatePropierty(quotationInfo.variableIncome) : null,
            averageIncome: quotationInfo.averageIncome ? quotationInfo.averageIncome.replace(/[^0-9\s]/gi, '').trim() : null,
            code: quotationInfo.code,
            trinidadCode: quotationInfo.trinidadCode || null,
            typeVehicle: (quotationInfo.typeVehicle) ? this.translatePropierty(quotationInfo.typeVehicle) : '',
            numberOfFees: (quotationInfo.numberOfFees) ? quotationInfo.numberOfFees : '',
            feeToPay: (quotationInfo.feeToPay) ? quotationInfo.feeToPay : '',
            dateEntry: (quotationInfo.dateEntry) ? quotationInfo.dateEntry : '',
            activities: quotationInfo.activities,
            workPhone: quotationInfo.workPhone,
            officePhone: quotationInfo.officePhone,
            origin: this.findValue(quotationInfo.origin),
            createdAt: quotationInfo.createdAt,
            client: quotationInfo.client._id,
            evaluation: quotationInfo.evaluation,
          });
        });
      });
    }
  }

  newWindow = link => () => {
    window.open(link, 'name', 'width=600,height=400');
  }

  toggleDeleteContacto = isOk => () => {
    if (isOk) {
      this.onDelete();
    } else {
      this.setState({ isOpenModalD: false });
    }
  }

  toggleSendForm = isOk => () => {
    if (isOk) {
      this.onSendForm();
    } else {
      this.setState({ isOpenModalSendForm: false });
    }
  }

  toggleEvaluateCustomer = () => () => {
    this.setState({ isOpenEvaluateModal: false });
  }

  toggleEditContacto = isOk => () => {
    if (isOk) {
      this.onSubmitNewQuotations();
    } else {
      this.setState({ isOpenModalE: false });
    }
  }

  toggleCloseQuotations = isOk => () => {
    if (isOk) {
      this.setState({ isOpenModalCloseQuotations: false });
      this.onCloseCase();
    } else {
      this.setState({ isOpenModalCloseQuotations: false });
    }
  }

  onChangeAddress = (key, index) => (e) => {
    const addresses = [...this.state.addresses];

    if (key === 'regions') {
      addresses[index][key] = e;
      addresses[index].commune = null;
      addresses[index].coptions = e ? e.communes : [];
      this.setState({ addresses });
    } else if (key === 'communes') {
      addresses[index][key] = e;
      this.setState({ addresses });
    } else {
      addresses[index][key] = e.target.value;
      this.setState({ addresses });
    }
  }

  onSubmitNewActivity = (e) => {
    if (e) {
      e.preventDefault();
    }

    const {
      _id,
    } = this.state;

    if (_id === null) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Se debe crear la cotización antes de ingresar actividades.',
      });

      return;
    }

    const activityState = {
      description: this.state.activity.description.trim(),
    };

    if (activityState.description === null) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe ingresar una descripcion para la actividad.',
      });

      // return;
    } else {
      const data = {
        action: 'addActivity',
        activity: activityState,
      };


      const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');
      if (isAdmin) {
        this.props.updateQuotations(_id, data, () => {
          this.setState({ isOpenModalAssignActivity: false });
          this.props.getQuotationById(_id, (quotationsInfo) => {
            this.setState({
              activities: quotationsInfo.activities,
              executive: quotationsInfo.executive ? { value: quotationsInfo.executive._id, label: `${quotationsInfo.executive.firstName} ${quotationsInfo.executive.lastName}` } : null,
              client: quotationsInfo.client.rut,
            });
          });
          this.props.getUsers({ all: true, roles: 'admin, manager, sales-executive' }, (body) => {
            this.setState({ users: map(body, user => ({ value: user._id, label: `${user.firstName} ${user.lastName}` })) });
          });
        });
      } else {
        this.props.updateQuotationsMe(_id, data, () => {
          this.setState({ isOpenModalAssignActivity: false });
          this.props.getQuotationByIdMe(_id, (quotationsInfo) => {
            this.setState({
              activities: quotationsInfo.activities,
              executive: quotationsInfo.executive ? { value: quotationsInfo.executive._id, label: `${quotationsInfo.executive.firstName} ${quotationsInfo.executive.lastName}` } : null,
              client: quotationsInfo.client.rut,
            });
          });
        });
      }
    }
  }

  onClickModalNewMailsReplays = () => {
    const NewMessage = {
      body: null,
      editor: null,
      attachments: [],
    };
    this.setState({ isOpenModalMessageMail: true, NewMessage });
  }

  toggleModalNewMessage = () => {
    this.setState({ isOpenModalMessageMail: false });
  };

  removeAttachment = e => () => {
    // const { NewMessage } = this.state;
    const NewMessage = { ...this.state.NewMessage };
    const aux = [];
    NewMessage.attachments.map((file, index) => {
      if (index !== e) {
        aux.push(file);
      }
    });

    NewMessage.attachments = aux;

    this.setState({ NewMessage });
  }

  onChangeMessage = key => (e) => {
    const NewMessage = { ...this.state.NewMessage };
    if (key === 'editor' || key === 'to' || key === 'cc') {
      NewMessage[key] = e;
    } else if (key === 'attachments') {
      // NewMessage[key] = e.target.files;
      Object.values(e.target.files).map((file) => {
        // NewMessage[key].push({ name: file.name });
        NewMessage[key].push(file);
      });
    } else {
      NewMessage[key] = e.target.value;
    }
    this.setState({ NewMessage });
  };

  onSubmitNewMailsReplays = (e) => {
    if (e) {
      e.preventDefault();
    }
    const { _id, NewMessage } = this.state;
    let message;
    if (this.mailRef) {
      message = this.mailRef.getTextHtml();
    }
    if (!_id) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Se debe crear la cotización antes de responder correos.',
      });
      return;
    }
    if (!message) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe ingresar un mensaje para responder el correo.',
      });
      return;
    }

    if (!NewMessage.to) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe ingresar el correo destinatario.',
      });
      return;
    }

    // const data = {
    //   action: 'addMessage',
    //   body: message,
    // };
    const data = {
      action: 'addMessage',
      to: NewMessage.to.value,
      cc: NewMessage.cc,
      body: message,
    };
    if (NewMessage.attachments) {
      let totalSize = 0;
      map(NewMessage.attachments, (file) => {
        totalSize += file.size;
      });
      if (totalSize > 5000000) {
        BasicNotification.show({
          color: 'danger',
          title: 'Atención',
          message: 'Los archivos adjuntos no pueden superar los 5 MB',
        });
        return;
      }
      data.attachments = NewMessage.attachments;
    }

    // console.log('data', data);
    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');
    if (isAdmin) {
      this.props.updateQuotations(_id, data, () => {
        this.setState({ isOpenModalMessageMail: false });
        this.props.getQuotationById(_id, (quotationsInfo) => {
          this.setState({
            messages: quotationsInfo.messages,
            executive: quotationsInfo.executive ? { value: quotationsInfo.executive._id, label: `${quotationsInfo.executive.firstName} ${quotationsInfo.executive.lastName}` } : null,
            client: quotationsInfo.client.rut,
          });
        });
        this.props.getUsers({ all: true, roles: 'admin, manager, sales-executive' }, (body) => {
          this.setState({ users: map(body, user => ({ value: user._id, label: `${user.firstName} ${user.lastName}` })) });
        });
      });
    } else {
      this.props.updateQuotationsMe(_id, data, () => {
        this.setState({ isOpenModalMessageMail: false });
        this.props.getQuotationByIdMe(_id, (quotationsInfo) => {
          this.setState({
            messages: quotationsInfo.messages,
            executive: quotationsInfo.executive ? { value: quotationsInfo.executive._id, label: `${quotationsInfo.executive.firstName} ${quotationsInfo.executive.lastName}` } : null,
            client: quotationsInfo.client.rut,
          });
        });
      });
    }
  }

  toggleModalAssignActivity = () => {
    this.setState({ isOpenModalAssignActivity: false });
  };

  toggleModalContactEdit = isOk => () => {
    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');
    const { id } = this.props.match.params;
    if (isOk) {
      this.props.getContactByRut(this.state.rutCrm, () => {
        this.setState({ isOpenModalContactEdit: false });
      });
      if (isAdmin) {
        this.props.getQuotationById(id, (quotationInfo) => {
          this.assignValueOnState(quotationInfo);
        });
      } else {
        this.props.getQuotationByIdMe(id, (quotationInfo) => {
          this.assignValueOnState(quotationInfo);
        });
      }
    } else {
      this.setState({ isOpenModalContactEdit: false });
    }
  }

  isRUTValid = (rut) => {
    if (!rut) return true;
    return (new RUTJS(rut)).isValid;
  }

  onClickModalAssignActivity = () => {
    const activity = {
      description: null,
      executive: null,
    };
    this.setState({ isOpenModalAssignActivity: true, activity });
  }

  getEvaluationStatus = () => {
    const {
      trinidadCode,
      evaluation,
    } = this.state;
    let status = 'No enviada';
    let comment;
    let code;
    if (trinidadCode) {
      code = `#${trinidadCode}`;
      status = 'Enviada';
    }
    if (evaluation) {
      status = evaluation.status;
      comment = evaluation.comment;
    }
    return (
      <Fragment>
        {
          code && (
            <div className="profile_info col-md-4">
              <FormGroup className="details_profile_columned">
                <Label className="label_autofin" for="profile">Código</Label>
                <span>{code}</span>
              </FormGroup>
            </div>
          )
        }
        <div className="profile_info col-md-4">
          <FormGroup className="details_profile_columned">
            <Label className="label_autofin" for="profile">Estado</Label>
            <span>{status}</span>
          </FormGroup>
        </div>
        {
          comment && (
            <div className="profile_info col-md-12">
              <FormGroup className="details_profile_columned">
                <Label className="label_autofin" for="profile">Comentario</Label>
                <span>{comment}</span>
              </FormGroup>
            </div>
          )
        }
      </Fragment>
    );
  }

  getStatusForm = () => {
    const status = 'enviado';

    return (
      <Fragment>
        <div className="profile_info col-md-3">
          <FormGroup className="details_profile_columned">
            <Label className="label_autofin" for="profile">Estado</Label>
            <span>{status}</span>
          </FormGroup>
        </div>
        <div className="profile_info col-md-4">
          <FormGroup className="details_profile_columned">
            <Label className="label_autofin" for="profile">Fecha envio formulario</Label>
            <span>{this.state.sentInformationRequest}</span>
          </FormGroup>
        </div>
        <div className="profile_info col-md-4">
          <FormGroup className="details_profile_columned">
            <Label className="label_autofin" for="profile">Fecha respuesta cliente</Label>
            <span>{this.state.sentClientResponse || 'sin responder'}</span>
          </FormGroup>
        </div>
      </Fragment>
    );
  }

  setMailRef = (element) => {
    // console.log('setMailRef -> element', element);
    this.mailRef = element;
  };

  render() {
    const {
      activeTab,
      users,
    } = this.state;
    const {
      contact,
      contracts,
      cargandoContact,
      loadingQuotations,
      disableCloseQuotations,
      settings,
    } = this.props;
    const today = moment().format('DD/MM/YYYY');
    let edad = 0;
    contact && (
      edad = moment(today).year() - moment(contact.birthdate).year()
    );
    const { id, rut } = this.props.match.params;

    // console.log('settings', settings);

    const statusTranslate = this.findValueWithClassForStatus(this.state.status);

    let subject = '';
    let formBody = '';
    const optionsEC = map(this.props.civilStatus, typ => ({ value: typ.value, label: typ.label }));

    if (parseInt(this.state.rut, 10) > 500000000) {
      subject = `AUTOFIN%20Cotización%20%23%20${this.state.code}%20evaluación%20crédito%20automotriz`;

      formBody = `Si%20%20quieres%20%20cotizar%20%20como%20%20empresa:%0D%0A

      -RUT%20%20Empresa:%0D%0A
      -Adjuntar%20%20carpeta%20%20tributaria.
      %0D%0A
      %0D%0A`;
    }

    // const createEmailForm = `https://mail.google.com/mail/?view=cm&fs=1&to=${this.state.emailClienteCrm}&su=${subject}&body=${formBody}`;
    const createEmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${this.state.emailClienteCrm}&su=${subject}&body=${formBody}`;

    const optionsPropierty = [
      { value: true, label: 'Si' },
      { value: false, label: 'No' },
    ];

    const optionsOrigin = [
      { value: 'phone', label: 'Teléfono' },
      // { value: 'web', label: 'Web' },
      { value: 'referred', label: 'Referido' },
      { value: 'face', label: 'Presencial' },
      { value: 'trinidad', label: 'Trinidad' },
    ];

    const optionsSituation = [
      { value: 'dependent', label: 'Dependiente' },
      { value: 'independent', label: 'Independiente' },
    ];

    const optionsContrats = [
      { value: 'fixedTerm', label: 'Plazo fijo' },
      { value: 'undefined', label: 'Indefinido' },
    ];

    const optionsTypeVehicle = [
      { value: 'auto', label: 'Auto' },
      { value: 'moto', label: 'Moto' },
    ];
    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');

    return (
      <div className="dashboard container">
        <DModal
          title="Atención"
          color="danger"
          message="¿Esta seguro que desea borrar este registro?"
          isOpen={this.state.isOpenModalD}
          toggle={this.toggleDeleteContacto}
        />
        <SendEvaluationModal
          title="Atención"
          color="warning"
          message="¿Deseas enviar el Formulario Solicitud de Financiamiento a este cliente?"
          isOpen={this.state.isOpenModalSendForm}
          toggle={this.toggleSendForm}
        />
        <EvaluateModal
          title="Atención"
          color="danger"
          message="Para poder realizar la evaluación se necesita los siguientes campos:"
          isOpen={this.state.isOpenEvaluateModal}
          workSituation={this.state.workSituation}
          rent={this.state.rent}
          typeVehicle={this.state.typeVehicle}
          toggle={this.toggleEvaluateCustomer}
        />
        <CloseQuotationsModal
          title="Advertencia"
          color="warning"
          message="¿Esta seguro que desea Cerrar esta cotización?"
          isOpen={this.state.isOpenModalCloseQuotations}
          toggle={this.toggleCloseQuotations}
        />
        <EModal
          title="Atención"
          color="primary"
          message="¿Esta seguro que desea editar este registro?"
          isOpen={this.state.isOpenModalE}
          toggle={this.toggleEditContacto}
        />
        <ModalContactoEdit
          isOpen={this.state.isOpenModalContactEdit}
          rutToFind={this.state.rutCrm}
          toggle={this.toggleModalContactEdit}
        />
        <AssignActivityModal
          isOpen={this.state.isOpenModalAssignActivity}
          toggle={this.toggleModalAssignActivity}
          value={this.state.activity}
          cargando={this.props.cargando}
          onSubmitNewActivity={this.onSubmitNewActivity}
          onChangeActivity={this.onChangeActivity}
        />
        <Row>
          <div className="col-md-7">
            <Card className="cardo_botton" style={{ height: 'auto' }}>
              <CardBody style={{ padding: '0px 10px' }}>
                <form className="form form--horizontal" onSubmit={this.onSubmitNewQuotations}>
                  <div className="profile_casos profile_casos_detail">
                    <div className="compacted col-md-12" style={{ marginBottom: '2%' }}>
                      <div className="col-md-5" style={{ padding: '0px', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                        <div className="" style={{ display: 'flex', width: '80%' }}>
                          <div className={`new_lnr lnr-${this.findIcon(this.state.origin)} font-case-details`} style={{ height: '40px' }} />
                          <div className="head_title_to_case_detail" style={{ flexDirection: 'column', marginLeft: '5%', justifyContent: 'center' }}>
                            <h5>Cotización <span>{!rut && (`#${this.state.code}`)}</span></h5>
                            <Badge className={statusTranslate.class}>{statusTranslate.label}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-7" style={{ padding: '0px', display: 'flex', justifyContent: 'space-between' }}>
                        {
                          this.state.createdAt && (
                            <FormGroup className="mt-4">
                              {!rut && (
                                <Fragment>
                                  <h5 style={{ fontWeight: '600' }}>Creado</h5>
                                  <span>{moment(this.state.createdAt).format('DD/MM/YYYY, h:mm:ss')}
                                  </span>
                                </Fragment>
                              )
                              }
                            </FormGroup>
                          )
                        }
                        <FormGroup>
                          {
                            !this.state.new ? (
                              <Fragment>
                                <div className="col-md-3 mt-2">
                                  {
                                    ((!this.state.showButton) && (!this.props.loadingInfoQuotations)) && (
                                      this.state.status === 'opened' ? (
                                        <span
                                          className="lnr lnr-pencil font-case-details delete_case"
                                          // onClick={this.onClickEditQuotation(this.state.idDetail)}
                                          onClick={this.startEdit}
                                        />
                                      )
                                        : ''
                                    )
                                  }
                                </div>
                                {((isAdmin) && (!this.props.loadingInfoQuotations)) && (
                                  <div className="col-md-3 mt-4">
                                    <span
                                      className="lnr lnr-lnr lnr-trash font-case-details delete_case"
                                      onClick={this.onClickDeleteQuotations(this.state.idDetail)}
                                    />
                                  </div>
                                )}
                              </Fragment>
                            ) : (
                                <div className="mt-4">
                                  <Button
                                    className="asignar just_this"
                                    type="submit"
                                    id="added"
                                    disabled={this.props.disableCreate}
                                  >Guardar
                                  </Button>
                                  <Button
                                    className="asignar"
                                    type="button"
                                    id="added"
                                    disabled={this.props.disableCreate}
                                    onClick={this.props.history.goBack}
                                  >Cancelar
                                  </Button>
                                </div>
                            )
                          }
                        </FormGroup>
                      </div>
                      <div className="profile_info col-md-12 mb-0">
                        <FormGroup className="details_profile_columned" style={{ margin: 0 }}>
                          <h1 className="datos-personales title_modal_contact mb-2">Datos personales</h1>
                          <div className="top_linear_divaindo">___</div>
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup style={{ textAlign: 'left' }}>
                          <Label className="label_autofin" for="rut">*Rut cliente:</Label>
                          <Input
                            type="text"
                            name="rut"
                            id="rut"
                            className="newArea"
                            disabled={this.state.editField}
                            value={setRUTFormat(this.state.rut)}
                            invalid={!this.isRUTValid(this.state.rut)}
                            onChange={this.onChangeInput('rut')}
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup>
                          <Label className="label_autofin" for="names">*Nombre cliente</Label>
                          <Input
                            type="text"
                            name="names"
                            id="names"
                            maxLength="20"
                            className="newArea"
                            disabled={this.state.editField}
                            value={this.state.names}
                            onChange={this.onChangeInput('names')}
                            required
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup>
                          <Label className="label_autofin" for="paternalSurname">*Apellido paterno</Label>
                          <Input
                            type="text"
                            name="paternalSurname"
                            id="paternalSurname"
                            maxLength="20"
                            className="newArea"
                            disabled={this.state.editField}
                            value={this.state.paternalSurname}
                            onChange={this.onChangeInput('paternalSurname')}
                            required
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup>
                          <Label className="label_autofin" for="maternalSurname">Apellido materno</Label>
                          <Input
                            type="text"
                            name="maternalSurname"
                            id="maternalSurname"
                            maxLength="20"
                            className="newArea"
                            disabled={this.state.editField}
                            value={this.state.maternalSurname}
                            onChange={this.onChangeInput('maternalSurname')}
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <Label className="label_autofin" for="birthdate">Fecha nacimiento</Label>
                        <FormGroup>
                          <DatePicker
                            className="newArea"
                            locale="es"
                            disabled={this.state.editField}
                            dateFormat="dd/MM/yyyy"
                            name="birthdate"
                            id="birthdate"
                            maxDate={new Date()}
                            // showMonthYearDropdown
                            showYearDropdown
                            dropdownMode="select"
                            selected={this.state.birthdate}
                            onChange={this.onChangeInput('birthdate')}
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup style={{ textAlign: 'left' }}>
                          <Label className="label_autofin" for="email">*Correo:</Label>
                          <Input
                            className="mb-2 newArea"
                            maxLength="50"
                            disabled={this.state.editField}
                            onChange={this.onChangeInput('email')}
                            value={this.state.email}
                            type="email"
                            placeholder="correo"
                            required
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup style={{ textAlign: 'left' }}>
                          <Label className="label_autofin" for="phone">*Telefono:</Label>
                          <Input
                            className="mb-2 newArea"
                            maxLength="9"
                            minLength="9"
                            disabled={this.state.editField}
                            onChange={this.onChangeInput('phone')}
                            value={this.state.phone}
                            type="phone"
                            placeholder="telefono"
                            required
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup style={{ textAlign: 'left' }}>
                          <Label className="label_autofin" for="rut">Estado civil:</Label>
                          <Select
                            options={optionsEC}
                            type="text"
                            isDisabled={this.state.editField}
                            placeholder="seleccionar"
                            name="civilStatus"
                            isClearable="true"
                            id="civilStatus"
                            value={this.state.civilStatus}
                            onChange={this.onChangeInput('civilStatus')}
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup>
                          <Label className="label_autofin" for="profile">Calle</Label>
                          <Input
                            className="mb-2 newArea"
                            disabled={this.state.editField}
                            onChange={this.onChangeAddressPersonal('street')}
                            value={this.state.address ? this.state.address.street ? this.state.address.street : '' : ''}
                            placeholder="Calle"
                            maxLength="50"
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup>
                          <Label className="label_autofin" for="profile">Región</Label>
                          <Select
                            options={this.state.regions}
                            type="text"
                            name="region"
                            id="region"
                            isDisabled={this.state.editField}
                            placeholder="seleccionar"
                            value={this.state.address && this.state.address.region ? this.state.address.region : ''}
                            onChange={this.onChangeAddressPersonal('addressRegion')}
                            isClearable="true"
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup>
                          <Label className="label_autofin" for="profile">Comuna</Label>
                          <Select
                            options={this.state.address ? this.state.address.coptions || [] : []}
                            type="text"
                            isDisabled={this.state.editField}
                            name="commune"
                            id="commune"
                            placeholder="seleccionar"
                            noOptionsMessage={() => 'Seleccione la región'}
                            value={this.state.address && this.state.address.commune ? this.state.address.commune : ''}
                            isClearable="true"
                            onChange={this.onChangeAddressPersonal('addressCommune')}
                            required
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup style={{ textAlign: 'left' }}>
                          <Label className="label_autofin" for="haveProperty">¿Posee propiedades?</Label>
                          <Select
                            options={optionsPropierty}
                            type="text"
                            placeholder="seleccionar"
                            name="haveProperty"
                            id="haveProperty"
                            isDisabled={this.state.editField}
                            value={this.state.haveProperty}
                            onChange={this.onChangeInput('haveProperty')}
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup style={{ textAlign: 'left' }}>
                          <Label className="label_autofin" for="rut">¿Posee vehiculos?</Label>
                          <Select
                            options={optionsPropierty}
                            type="text"
                            placeholder="seleccionar"
                            name="propierty"
                            id="propierty"
                            isDisabled={this.state.editField}
                            value={this.state.haveVehicle}
                            onChange={this.onChangeInput('haveVehicle')}
                          />
                        </FormGroup>
                      </div>
                      {
                        ((!this.state.haveVehicle) || (this.state.haveVehicle.value === false)) && (
                          <Fragment>
                            <div className="col-md-6" />
                          </Fragment>
                        )
                      }
                      {
                        ((this.state.haveVehicle) && (this.state.haveVehicle.value === true)) && (
                          <Fragment>
                            <div className="col-md-6">
                              <FormGroup>
                                <Label className="label_autofin" for="profile">*Patente</Label>
                                <Input
                                  className="mb-2 newArea"
                                  disabled={this.state.editField}
                                  onChange={this.onChangeInput('carPatent')}
                                  value={this.state.carPatent ? this.state.carPatent : ''}
                                  placeholder="Patente"
                                  maxLength="6"
                                />
                              </FormGroup>
                            </div>
                            <div className="col-md-6" />
                          </Fragment>
                        )
                      }
                      <div className="profile_info col-md-12 mb-0 mt-3">
                        <FormGroup className="details_profile_columned" style={{ margin: 0 }}>
                          <h1 className="datos-personales title_modal_contact mb-2">Datos cotización</h1>
                          <div className="top_linear_divaindo">___</div>
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup>
                          <Label className="label_autofin" for="typeVehicle">*Tipo vehiculo:</Label>
                          <Select
                            options={optionsTypeVehicle}
                            type="text"
                            placeholder="seleccione"
                            name="typeVehicle"
                            id="typeVehicle"
                            value={this.state.typeVehicle}
                            isDisabled={this.state.editField}
                            // isDisabled={typesOptionsFindIt}
                            onChange={this.onChangeInput('typeVehicle')}
                            required
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup>
                          <Label className="label_autofin" for="priceVehicle">Precio vehiculo:</Label>
                          <NumberFormat
                            style={{ border: '1px solid #ced4da', borderRadius: '0.25rem' }}
                            prefix="$"
                            disabled={this.state.editField}
                            min="0"
                            name="priceVehicle"
                            id="priceVehicle"
                            max="99999999"
                            className="newArea"
                            decimalSeparator=","
                            thousandSeparator="."
                            value={this.state.priceVehicle}
                            onChange={this.onChangeInput('priceVehicle')}
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup>
                          <Label className="label_autofin" for="initialPayment">Monto Pie:</Label>
                          <NumberFormat
                            style={{ border: '1px solid #ced4da', borderRadius: '0.25rem' }}
                            prefix="$"
                            disabled={this.state.editField}
                            min="0"
                            name="initialPayment"
                            id="initialPayment"
                            max="99999999"
                            className="newArea"
                            decimalSeparator=","
                            thousandSeparator="."
                            value={this.state.initialPayment}
                            onChange={this.onChangeInput('initialPayment')}
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup>
                          <Label className="label_autofin" for="numberOfFees">Número cuotas:</Label>
                          <Input
                            type="number"
                            name="numberOfFees"
                            id="numberOfFees"
                            min="0"
                            max="99999999"
                            className="newArea"
                            disabled={this.state.editField}
                            value={this.state.numberOfFees}
                            onChange={this.onChangeInput('numberOfFees')}
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup>
                          <Label className="label_autofin" for="feeToPay">Valor cuota:</Label>
                          <NumberFormat
                            style={{ border: '1px solid #ced4da', borderRadius: '0.25rem' }}
                            prefix="$"
                            disabled={this.state.editField}
                            min="0"
                            name="feeToPay"
                            id="feeToPay"
                            max="99999999"
                            className="newArea"
                            decimalSeparator=","
                            thousandSeparator="."
                            value={this.state.feeToPay}
                            onChange={this.onChangeInput('feeToPay')}
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup>
                          <Label className="label_autofin" for="origin">*Origen:</Label>
                          <Select
                            options={optionsOrigin}
                            type="text"
                            name="origin"
                            placeholder="seleccionar"
                            id="origin"
                            isDisabled={(this.state.origin) && ((this.state.origin.value === 'web') ? true : this.state.editField)}
                            value={this.state.origin}
                            onChange={this.onChangeInput('origin')}
                            // isDisabled={optionsOriginphoneFindIt}
                            required
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup>
                          <Label className="label_autofin" for="concessionaire">Concesionario:</Label>
                          <Input
                            className="newArea"
                            name="concessionaire"
                            id="concessionaire"
                            maxLength="40"
                            disabled={this.state.editField}
                            onChange={this.onChangeInput('concessionaire')}
                            value={this.state.concessionaire}
                          />
                        </FormGroup>
                      </div>
                      {!isAdmin && (
                        <div className="col-md-6" />
                      )}
                      {isAdmin && (
                        <Fragment>
                          <div className="col-md-6">
                            <FormGroup>
                              <Label className="label_autofin" for="executive">*Ejecutivo asignado:</Label>
                              <Select
                                options={users}
                                type="text"
                                name="executive"
                                placeholder="seleccione"
                                id="executive"
                                isDisabled={this.state.editField}
                                value={this.state.executive}
                                onChange={this.onChangeInput('executive')}
                                // isDisabled={optionsOriginphoneFindIt}
                                required
                              />
                            </FormGroup>
                          </div>
                          <div className="col-md-6" />
                        </Fragment>
                      )}
                      <div className="profile_info col-md-12 mb-0 mt-3">
                        <FormGroup className="details_profile_columned" style={{ margin: 0 }}>
                          <h1 className="datos-personales title_modal_contact mb-2">Datos laborales</h1>
                          <div className="top_linear_divaindo">___</div>
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup>
                          <Label className="label_autofin" for="companyName">Nombre empleador</Label>
                          <Input
                            type="text"
                            name="companyName"
                            id="companyName"
                            maxLength="20"
                            className="newArea"
                            disabled={this.state.editField}
                            value={this.state.companyName}
                            onChange={this.onChangeInput('companyName')}
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup style={{ textAlign: 'left' }}>
                          <Label className="label_autofin" for="rut">Rut empleador:</Label>
                          <Input
                            type="text"
                            name="rut"
                            id="rut"
                            className="newArea"
                            disabled={this.state.editField}
                            value={this.state.companyRUT}
                            invalid={!this.isRUTValid(this.state.companyRUT)}
                            onChange={this.onChangeInput('companyRUT')}
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup style={{ textAlign: 'left' }}>
                          <Label className="label_autofin" for="rent">Renta:</Label>
                          <NumberFormat
                            style={{ border: '1px solid #ced4da', borderRadius: '0.25rem' }}
                            prefix="$"
                            min="0"
                            name="rent"
                            id="rent"
                            max="99999999"
                            className="newArea"
                            decimalSeparator=","
                            thousandSeparator="."
                            value={this.state.rent}
                            disabled={this.state.editField}
                            onChange={this.onChangeInput('rent')}
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup className="columend_date">
                          <Label className="label_autofin" for="dateEntry">Fecha de ingreso:</Label>
                          <DatePicker
                            className="newArea"
                            locale="es"
                            dateFormat="dd/MM/yyyy"
                            name="dateEntry"
                            id="dateEntry"
                            maxDate={new Date()}
                            disabled={this.state.editField}
                            showYearDropdown
                            dropdownMode="select"
                            selected={this.state.dateEntry}
                            onChange={this.onChangeInput('dateEntry')}
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup>
                          <Label className="label_autofin" for="workSituation">*Situación Laboral:</Label>
                          <Select
                            options={optionsSituation}
                            type="text"
                            placeholder="seleccione"
                            name="workSituation"
                            id="workSituation"
                            value={this.state.workSituation}
                            isDisabled={this.state.editField}
                            // isDisabled={typesOptionsFindIt}
                            onChange={this.onChangeInput('workSituation')}
                            required
                          />
                        </FormGroup>
                      </div>
                      {
                        ((this.state.workSituation) && (this.state.workSituation.value === 'dependent')) && (
                          <div className="col-md-6">
                            <FormGroup>
                              <Label className="label_autofin" for="typeContract">Tipo contrato:</Label>
                              <Select
                                options={optionsContrats}
                                type="text"
                                placeholder="seleccione"
                                name="typeContract"
                                id="typeContract"
                                value={this.state.typeContract}
                                isDisabled={this.state.editField}
                                // isDisabled={typesOptionsFindIt}
                                onChange={this.onChangeInput('typeContract')}
                                required
                              />
                            </FormGroup>
                          </div>
                        )
                      }
                      <div className="col-md-6">
                        <FormGroup style={{ textAlign: 'left' }}>
                          <Label className="label_autofin" for="fixedIncome">¿Ingreso fijo?</Label>
                          <Select
                            options={optionsPropierty}
                            type="text"
                            placeholder="seleccionar"
                            name="fixedIncome"
                            id="fixedIncome"
                            isDisabled={this.state.editField}
                            value={this.state.fixedIncome}
                            onChange={this.onChangeInput('fixedIncome')}
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup style={{ textAlign: 'left' }}>
                          <Label className="label_autofin" for="variableIncome">¿Ingreso Variable?</Label>
                          <Select
                            options={optionsPropierty}
                            type="text"
                            placeholder="seleccionar"
                            name="variableIncome"
                            id="variableIncome"
                            isDisabled={this.state.editField}
                            value={this.state.variableIncome}
                            onChange={this.onChangeInput('variableIncome')}
                          />
                        </FormGroup>
                      </div>
                      {/* <div className="col-md-6">
                        <FormGroup>
                          <Label className="label_autofin" for="fixedIncome">Ingreso fijo:</Label>
                          <NumberFormat
                            style={{ border: '1px solid #ced4da', borderRadius: '0.25rem' }}
                            prefix="$"
                            disabled={this.state.editField}
                            min="0"
                            name="fixedIncome"
                            id="fixedIncome"
                            max="99999999"
                            className="newArea"
                            decimalSeparator=","
                            thousandSeparator="."
                            value={this.state.fixedIncome || ''}
                            onChange={this.onChangeInput('fixedIncome')}
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup>
                          <Label className="label_autofin" for="variableIncome">Ingreso Variable:</Label>
                          <NumberFormat
                            style={{ border: '1px solid #ced4da', borderRadius: '0.25rem' }}
                            prefix="$"
                            disabled={this.state.editField}
                            min="0"
                            name="variableIncome"
                            id="variableIncome"
                            max="99999999"
                            className="newArea"
                            decimalSeparator=","
                            thousandSeparator="."
                            value={this.state.variableIncome || ''}
                            onChange={this.onChangeInput('variableIncome')}
                          />
                        </FormGroup>
                      </div> */}
                      {
                        ((this.state.origin) && (this.state.origin.value === 'web')) && (
                          this.state.plan && (
                            <div className="col-md-6">
                              <FormGroup>
                                <Label className="label_autofin" for="plan">Plan</Label>
                                <Input
                                  type="text"
                                  maxLength="300"
                                  minLength="30"
                                  name="plan"
                                  id="plan"
                                  className="newArea"
                                  disabled="true"
                                  value={this.state.plan || ''}
                                  onChange={this.onChangeInput('plan')}
                                />
                              </FormGroup>
                            </div>
                          )
                        )
                      }
                      {
                        ((this.state.origin) && (this.state.origin.value === 'web')) && (
                          (this.state.fromSimulation !== false) && (
                            <div className="col-md-6">
                              <FormGroup>
                                <Label className="label_autofin" for="plan">Simulación:</Label>
                                <Checkbox
                                  style={{ color: (this.state.fromSimulation !== false) ? '#C7AC43' : 'rgba(0, 0, 0, 0.54)' }}
                                  disabled="true"
                                  checked="true"
                                // checked={this.state.fromSimulation}
                                />
                              </FormGroup>
                            </div>
                          )
                        )
                      }
                      <div className="col-md-6">
                        <FormGroup>
                          <Label className="label_autofin" for="averageIncome">Ingreso Promedio:</Label>
                          <NumberFormat
                            style={{ border: '1px solid #ced4da', borderRadius: '0.25rem' }}
                            prefix="$"
                            disabled={this.state.editField}
                            min="0"
                            name="averageIncome"
                            id="averageIncome"
                            max="99999999"
                            className="newArea"
                            decimalSeparator=","
                            thousandSeparator="."
                            value={this.state.averageIncome || ''}
                            onChange={this.onChangeInput('averageIncome')}
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6" />
                      {
                        this.state.workSituation && (
                          ((this.state.workSituation.value) && (this.state.workSituation.value === 'independent'))
                            ? (
                              <div className="col-md-12">
                                <FormGroup>
                                  <Label className="label_autofin" for="clientActivity">*Actividad del Cliente</Label>
                                  <Input
                                    type="textarea"
                                    maxLength="300"
                                    minLength="30"
                                    style={{ height: '100px' }}
                                    name="clientActivity"
                                    id="clientActivity"
                                    className="newArea"
                                    disabled={this.state.editField}
                                    value={this.state.clientActivity || ''}
                                    onChange={this.onChangeInput('clientActivity')}
                                  />
                                </FormGroup>
                              </div>
                            )
                            : (
                              <div className="col-md-6" />
                            )
                        )
                      }
                      <div className="col-md-6" />
                      {
                        this.state.showButton && (
                          <div className="col-md-12">
                            <Button className="asignar" onClick={this.cancelEdit}>Cancelar</Button>{' '}
                            <Button
                              className="asignar just_this"
                              type="submit"
                              id="added"
                            >Guardar
                            </Button>
                          </div>
                        )
                      }
                    </div>
                  </div>
                </form>
              </CardBody>
            </Card>
            <Card className="cardo_botton" style={{ height: 'auto' }}>
              <CardBody style={{ padding: '0px 10px' }}>
                <div className="profile_casos profile_casos_detail">
                  <div className="col-md-12" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', padding: '10px 0px' }}>
                    <Row>
                      {
                        !rut && (
                          <Fragment>
                            {
                              this.state.status === 'opened' ? (
                                <Fragment>
                                  <Button
                                    className="asignar button_details"
                                    style={{ margin: '0px' }}
                                    onClick={this.onClickModalAssignActivity}
                                  >
                                    Añadir actividad
                                  </Button>
                                  {/* <Button
                                    className="asignar button_details"
                                    type="submit"
                                    id="added"
                                    style={{ borderRadius: '0px 0px 0px 0px', margin: '0px' }}
                                    onClick={this.onClickCloseQuotation(this.state.idDetail)}
                                  >
                                    Cerrar cotización
                                  </Button> */}
                                  {/* {
                                    !this.state.trinidadCode && (
                                      <Button
                                        className="asignar button_details"
                                        type="submit"
                                        id="added"
                                        onClick={this.onClickCustomerEvaluation}
                                        style={{ borderRadius: '0px 5px 5px 0px' }}
                                      >
                                        Evaluar cliente
                                      </Button>
                                    )
                                  } */}
                                </Fragment>
                              )
                                : ''
                            }
                          </Fragment>
                        )
                      }
                    </Row>
                  </div>
                  {
                    this.state.activities.length > 0 && (
                  <div className="col-md-12" style={{ height: '300px', overflowY: 'scroll', marginBottom: '5%' }}>
                    {this.state.activities && (
                      this.state.activities
                        .map(activity => (
                          <div key={activity._id} className="cards_reply" style={{ marginBottom: '3%' }}>
                            <Row className="row_flexible">
                              <div className="compacted col-md-5">
                                <div className="profile_avatar_details">
                                  <img src={(activity.executive) ? (activity.executive.avatar) ? activity.executive.avatar : avatarDefault : ''} alt="avatar" />
                                </div>
                                <div className="profile_info col-md-8" style={{ textAlign: 'center' }}>
                                  <h5>{(activity.executive) ? (activity.executive) ? `${activity.executive.firstName} ${activity.executive.lastName}` : 'sin nombre' : ''}</h5>
                                </div>
                              </div>
                              <div className="compacted col-md-7">
                                <h6> {moment(activity.date).format('DD/MM/YYYY HH:mm')}</h6>
                              </div>
                            </Row>
                            <Row>
                              <div className="compacted col-md-12" style={{ padding: '0px 40px' }}>
                                {/* <p style={{ width: 'inherit' }}>{this.justReplace(activity.description)}</p> */}
                                <Input
                                  type="textarea"
                                  maxLength="300"
                                  minLength="30"
                                  style={{ height: '100px' }}
                                  name="clientActivity"
                                  id="clientActivity"
                                  className="newArea"
                                  disabled="true"
                                  value={this.justReplace(activity.description)}
                                />
                              </div>
                            </Row>
                          </div>
                        ))
                    )
                    }
                  </div>
                    )
                  }
                </div>
              </CardBody>
            </Card>
            {
              this.state.messages && (
                <MailsContents
                  ref={this.setMailRef}
                  messages={this.state.messages}
                  id={this.state._id}
                  sourceMail={(settings && settings.customerService) ? settings.customerService.email : ''}
                  loading={disableCloseQuotations}
                  onClickModalNewMailsReplays={this.onClickModalNewMailsReplays}
                  toggleModalNewMessage={this.toggleModalNewMessage}
                  NewMessage={this.state.NewMessage}
                  onChangeMessage={this.onChangeMessage}
                  isOpenModalMessageMail={this.state.isOpenModalMessageMail}
                  onSubmit={this.onSubmitNewMailsReplays}
                  emailArrayToMailsContents={this.state.emailArrayToMailsContents}
                  removeAttachment={this.removeAttachment}
                />
              )
            }
          </div>
          <div className="col-md-5">
            <Card className="cardo_botton" style={{ height: 'auto' }}>
              <CardBody style={{ padding: '0px 10px' }}>
                <div className="profile_casos card col-md-12" style={{ flexWrap: 'wrap', justifyContent: 'flex-start', padding: '10px 0px' }}>
                  {/* <div className="compacted col-md-4">
                    <div className="profile_avatar" style={{ height: '65px', width: '65px' }}>
                      <img src="../../img/avatar-profile.jpg" alt="avatar" />
                    </div>
                  </div> */}
                  <div className="profile_info col-md-12" style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {
                      loadingQuotations && (
                        <Skeleton count={1} height={40} />
                      )
                    }
                    <div className="col-md-4 mt-3">
                      <h5 className="label_autofin">{this.state.namesCrm} {this.state.paternalCrm}</h5>
                      <h5>{setRUTFormat(this.state.rutCrm)}</h5>
                    </div>

                    <div className="profile_info_calls col-md-8" style={{ justifyContent: 'flex-start', marginTop: '2%' }}>
                      <Row>
                        <Button
                          className="asignar button_details button_profile_detail"
                          type="submit"
                          id="added"
                          onClick={this.onClickCloseQuotation(this.state.idDetail)}
                        >
                          Cerrar cotización
                        </Button>
                        <Button
                          className="asignar button_details button_profile_detail"
                          type="submit"
                          onClick={this.newWindow(createEmail)}
                          id="added"
                        >
                          <a
                            target="_blank"
                            style={{ color: '#646777' }}
                          >
                            Enviar correo
                          </a>
                        </Button>
                        <Button
                          className="asignar button_details button_profile_detail mt-2"
                          // onClick={this.newWindow(createEmailForm)}
                          onClick={this.onClickSendForm(this.state.idDetail)}
                          id="added"
                        >
                          <a
                            target="_blank"
                            style={{ color: '#646777' }}
                          >
                            Enviar formulario
                          </a>
                        </Button>
                        {
                          !this.state.trinidadCode && (
                            <Button
                              className="asignar button_details button_profile_detail mt-2"
                              type="submit"
                              onClick={this.onClickCustomerEvaluation}
                              id="added"
                            >
                              <a
                                style={{ color: '#646777' }}
                              >
                                Evaluar cliente
                              </a>
                            </Button>
                          )
                        }
                      </Row>
                    </div>
                  </div>
                  {(id) && (
                    <div className="border_top_detail col-md-12">
                      <div className="profile_info col-md-12">
                        <FormGroup className="details_profile_columned">
                          <span className="datos-personales">Gestión</span>
                        </FormGroup>
                      </div>
                      <div className="col-md-3" style={{ display: 'flex', padding: 0 }}>
                        <FormGroup>
                          <Checkbox
                            style={{ color: (this.state.disableToDo !== true) ? '#C7AC43' : '#646777', padding: '10px 7px' }}
                            onChange={this.onChangeToDoList('customerContacted')}
                            disabled={this.state.disableToDo}
                            // checked="true"
                            checked={(this.state.toDo.payload.customerContacted.status !== false)}
                          />
                        </FormGroup>
                        <FormGroup style={{ marginBottom: '0px' }}>
                          <Label className="label_autofin" style={{ marginBottom: '0px', marginTop: '8%' }} for="plan">Llamar cliente</Label><br />
                          <Label className="label_autofin" style={{ fontWeight: 500 }} for="plan">{(this.state.toDo.payload.customerContacted.date !== null) ? moment(this.state.toDo.payload.customerContacted.date).format('DD/MM/YYYY hh:mm:ss') : ''}</Label>
                        </FormGroup>
                      </div>
                      <div className="col-md-3" style={{ display: 'flex', padding: 0 }}>
                        <FormGroup>
                          <Checkbox
                            style={{ color: (this.state.disableToDo !== true) ? '#C7AC43' : '#646777', padding: '10px 7px' }}
                            onChange={this.onChangeToDoList('completedForm')}
                            disabled={this.state.disableToDo}
                            // checked="true"
                            checked={(this.state.toDo.payload.completedForm.status !== false)}
                          />
                        </FormGroup>
                        <FormGroup style={{ marginBottom: '0px' }}>
                          <Label className="label_autofin" style={{ marginBottom: '0px', marginTop: '6%' }} for="plan">Completar formulario</Label><br />
                          <Label className="label_autofin" style={{ fontWeight: 500 }} for="plan">{(this.state.toDo.payload.completedForm.date !== null) ? moment(this.state.toDo.payload.completedForm.date).format('DD/MM/YYYY hh:mm:ss') : ''}</Label>
                        </FormGroup>
                      </div>
                      <div className="col-md-3" style={{ display: 'flex', padding: 0 }}>
                        <FormGroup>
                          <Checkbox
                            style={{ color: (this.state.disableToDo !== true) ? '#C7AC43' : '#646777', padding: '10px 7px' }}
                            onChange={this.onChangeToDoList('FAndIDerivative')}
                            disabled={this.state.disableToDo}
                            // checked="true"
                            checked={(this.state.toDo.payload.FAndIDerivative.status !== false)}
                          />
                        </FormGroup>
                        <FormGroup style={{ marginBottom: '0px' }}>
                          <Label className="label_autofin" style={{ marginBottom: '0px', marginTop: '8%' }} for="plan">Derivar al F&I</Label><br />
                          <Label className="label_autofin" style={{ fontWeight: 500 }} for="plan">{(this.state.toDo.payload.FAndIDerivative.date !== null) ? moment(this.state.toDo.payload.FAndIDerivative.date).format('DD/MM/YYYY hh:mm:ss') : ''}</Label>
                        </FormGroup>
                      </div>
                      <div className="col-md-3" style={{ display: 'flex', padding: 0 }}>
                        <FormGroup>
                          <Checkbox
                            style={{ color: (this.state.disableToDo !== true) ? '#C7AC43' : '#646777', padding: '10px 7px' }}
                            onChange={this.onChangeToDoList('clientVisit')}
                            disabled={this.state.disableToDo}
                            // checked="true"
                            checked={(this.state.toDo.payload.clientVisit.status !== false)}
                          />
                        </FormGroup>
                        <FormGroup style={{ marginBottom: '0px' }}>
                          <Label className="label_autofin" style={{ marginBottom: '0px', marginTop: '8%' }} for="plan">Estado visita</Label><br />
                          <Label className="label_autofin" style={{ fontWeight: 500 }} for="plan">{(this.state.toDo.payload.clientVisit.date !== null) ? moment(this.state.toDo.payload.clientVisit.date).format('DD/MM/YYYY hh:mm:ss') : ''}</Label>
                        </FormGroup>
                      </div>
                      {/* <div className="profile_info col-md-4">
                      <FormGroup className="details_profile_columned">
                        <Label className="label_autofin" for="profile">Teléfono</Label>
                        <span>
                          {this.state.phone
                            ? this.state.phoneClienteCrm || ''
                            : 'Sin teléfono'
                          }
                        </span>
                      </FormGroup>
                    </div>
                    <div className="profile_info col-md-4">
                      <FormGroup className="details_profile_columned">
                        <Label className="label_autofin" for="profile">Correo</Label>
                        <span>{this.state.emailClienteCrm || 'Sin correo '}</span>
                      </FormGroup>
                    </div>
                    <div className="profile_info col-md-4">
                      <FormGroup className="details_profile_columned">
                        <Label className="label_autofin" for="profile">Renta</Label>
                        <span>
                          <NumberFormat
                            value={this.state.rentClienteCrm || '0'}
                            displayType="text"
                            decimalSeparator=","
                            thousandSeparator="."
                            prefix="$"
                          />
                        </span>
                      </FormGroup>
                    </div> */}
                      <div className="profile_info col-md-12">
                        <FormGroup className="details_profile_columned">
                          <span className="datos-personales">Evaluación Cliente</span>
                        </FormGroup>
                      </div>
                      {this.getEvaluationStatus()}

                      {
                        (this.state.sentInformationRequest) && (
                          <Fragment>
                            <div className="profile_info col-md-12">
                              <FormGroup className="details_profile_columned">
                                <span className="datos-personales">Estado Formulario</span>
                              </FormGroup>
                            </div>
                            {this.getStatusForm()}
                          </Fragment>
                        )
                      }
                    </div>
                  )}
                  <div className="border_top_detail_state_sell col-md-12">
                    <FormGroup className="details_profile_columned">
                      {/* <Label className="label_autofin" for="profile">Estado de la venta</Label>
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <Button
                          className="button_state_sell_selected"
                          type="submit"
                          id="added"
                        >Cotizar
                        </Button>
                        <Button
                          className="button_state_sell_selected"
                          type="submit"
                          id="added"
                        >Solicitud
                        </Button>
                        <Button
                          className="button_state_sell"
                          type="submit"
                          id="added"
                        >Aprobado
                        </Button>
                        <Button
                          className="button_state_sell"
                          type="submit"
                          id="added"
                        >Cursado
                        </Button>
                      </div> */}
                    </FormGroup>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card style={{ height: '40%' }}>
              <CardBody style={{ padding: '0px' }}>
                <div className="tabs tabs--bordered-bottom" style={{ overflowX: 'hidden', height: '100%' }}>
                  <div className="tabs__wrap">
                    <Nav tabs className="w_o_border">
                      <NavItem style={{ width: '50%' }}>
                        <NavLink
                          style={{ width: 'auto' }}
                          className={`detail_info_customer ${classnames({ active: activeTab === '1' })}`}
                          onClick={() => {
                            this.toggle('1');
                          }}
                        >
                          Datos cliente
                        </NavLink>
                      </NavItem>
                      <NavItem style={{ width: '50%' }}>
                        <NavLink
                          style={{ width: 'auto' }}
                          className={`products_documents ${classnames({ active: activeTab === '2' })}`}
                          onClick={() => {
                            this.toggle('2');
                          }}
                        >
                          Productos y documentos
                        </NavLink>
                      </NavItem>
                    </Nav>
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="1">
                        <Row className="ml-3 mb-2">
                          <Col>
                            <span className="datos-personales">Datos Personales</span>
                            {
                              id && (
                                contact && (
                                  <Button
                                    className="asignar button_details button_profile_detail ml-2"
                                    onClick={this.onClickContactoEditar}
                                    id="added"
                                  >
                                    Editar
                                  </Button>
                                )
                              )
                            }
                          </Col>
                        </Row>
                        {
                          contact
                            ? (
                              <Row className="ml-3 mb-2">
                                <Col md={6}>
                                  <div>
                                    <span className="span-title">
                                      RUT
                                    </span>
                                    <br />
                                    <span>
                                      {contact
                                        ? setRUTFormat(contact.rut)
                                        : '-'
                                      }
                                    </span>
                                  </div>
                                  <div>
                                    <span className="span-title">
                                      Teléfonos
                                    </span>
                                    <br />
                                    <span>
                                      {contact && contact.phones.length > 0
                                        ? map(contact.phones, phone => <span key={`${phone.code}${phone.number}`}>{`${phone.code} - ${phone.number}`} <br /></span>)
                                        : '-'
                                      }
                                    </span>
                                  </div>
                                  <div>
                                    <span className="span-title">
                                      Región
                                    </span>
                                    <br />
                                    {(contact && contact.addresses && contact.addresses.length > 0)
                                      ? map(contact.addresses, (address, index) => (<div><span>{`${index + 1}.- ${(address.region) ? address.region.label : ''}`}</span></div>))
                                      : '-'
                                    }
                                  </div>
                                  <div>
                                    <span className="span-title">
                                      Comuna
                                    </span>
                                    <br />
                                    <span>
                                      {(contact && contact.addresses && contact.addresses.length > 0)
                                        ? map(contact.addresses, (address, index) => (<div><span>{`${index + 1}.- ${(address.commune) ? address.commune.label : ''}`}</span></div>))
                                        : '-'
                                      }
                                    </span>
                                  </div>
                                </Col>
                                <Col md={6}>
                                  <div>
                                    <span className="span-title">
                                      Fecha de Nacimiento
                                    </span>
                                    <br />
                                    <span>
                                      {contact && contact.birthdate
                                        ? <span>{moment(contact.birthdate).format('DD/MM/YYYY')}</span>
                                        : '-'
                                      }
                                    </span>
                                  </div>
                                  <div>
                                    <span className="span-title">
                                      Email
                                    </span>
                                    <br />
                                    <span>
                                      {contact && contact.emails.length > 0
                                        ? map(contact.emails, item => <span key={item.email}>{`${item.email}`} <br /> </span>)
                                        : '-'
                                      }
                                    </span>
                                  </div>
                                  <div>
                                    <span className="span-title">
                                      Renta
                                    </span>
                                    <br />
                                    <span>
                                      {contact && contact.rent
                                        ? contact.rent
                                        : '0'
                                      }
                                    </span>
                                  </div>
                                  <div>
                                    <span className="span-title">
                                      Edad
                                    </span>
                                    <br />
                                    <span>
                                      {contact && contact.birthdate
                                        ? <span>{edad}</span>
                                        : '-'
                                      }
                                    </span>
                                  </div>
                                </Col>
                                <Col>
                                  <div>
                                    <span className="span-title">
                                      Dirección
                                    </span>
                                    <br />
                                    <span>
                                      {contact && contact.addresses.length > 0
                                        ? map(contact.addresses, (address, index) => (<div><span>{`${index + 1}.- ${address.street}`}</span></div>))
                                        : '-'
                                      }
                                    </span>
                                  </div>
                                </Col>
                              </Row>
                            )
                            : (
                              (cargandoContact === true) && (
                              <Row className="ml-3 mb-2">
                                <Col>
                                  <Skeleton count={4} height={40} />

                                </Col>
                                <Col>
                                  <Skeleton count={4} height={40} />
                                </Col>
                                <Col>
                                  <Skeleton count={1} height={40} />
                                </Col>
                              </Row>
                              )
                            )
                        }
                        {
                          (contact && contact.length === 0) && (
                            <Row className="ml-3 mb-2">
                                <Col>Sin Registros</Col>
                            </Row>
                          )
                        }
                      </TabPane>
                      <TabPane tabId="2">
                        {
                          contracts && contracts.length > 0
                            ? map(contracts, contract => (
                              <Row className="case-rectangle">
                                <Col className="ml-4" sm={4} xs={4} md={4}>
                                  <div>
                                    <span className="span-title">Producto</span>
                                  </div>
                                  <div>
                                    {contract && contract.NombreProducto
                                      ? <span>{contract.NombreProducto.toUpperCase()}</span>
                                      : ''
                                    }
                                  </div>
                                </Col>
                                <Col sm={2} xs={2} md={2}>
                                  <div>
                                    <span className="span-title">ID</span>
                                  </div>
                                  <div>
                                    {contract && contract.id
                                      ? <span>{`#${contract.id}`}</span>
                                      : ''
                                    }
                                  </div>
                                </Col>
                                <Col sm={5} xs={5} md={5}>
                                  <Row>
                                    <Col>
                                      <div>
                                        <span className="span-title">Vehículo</span>
                                      </div>
                                      <div>
                                        {contract && contract.Modelo
                                          ? <span>{`${contract.Modelo}`}</span>
                                          : ''
                                        }
                                      </div>
                                    </Col>
                                    <Col>
                                      <div>
                                        <span className="span-title">Marca</span>
                                      </div>
                                      <div>
                                        {contract && contract.Marca
                                          ? <span>{`${contract.Marca}`}</span>
                                          : ''
                                        }
                                      </div>
                                    </Col>
                                    <Col>
                                      <div>
                                        <span className="span-title">Año</span>
                                      </div>
                                      <div>
                                        {contract && contract.AnnoVehiculo
                                          ? <span>{`${contract.AnnoVehiculo}`}</span>
                                          : ''
                                        }
                                      </div>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            ))
                            : <Col>Sin Registros</Col>
                        }
                      </TabPane>
                    </TabContent>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </Row>

        {/* <CaseList history={this.props.history} location={this.props.location} /> */}
      </div>
    );
  }
}

const mapStateToProps = ({ cases, contacts, users, quotations, resources }) => ({
  settings: resources.settings,
  loadingSetting: resources.loadingSetting,
  caseInfo: cases.caseInfo,
  disableCloseCase: cases.disableCloseCase,
  SendedForm: quotations.SendedForm,
  disableCreate: cases.disableCreate,
  disableCloseQuotations: quotations.disableCloseQuotations,
  types: cases.types,
  contact: contacts.contact,
  loadingInfoQuotations: quotations.loadingInfoQuotations,
  cargandoContact: contacts.cargando,
  civilStatus: resources.civilStatus,
  disable: cases.disable,
  subtypes: cases.subtypes,
  regions: resources.Regions,
  Communs: resources.Communs,
  quotationInfo: quotations.quotationInfo,
  loadingQuotations: quotations.loadingInfoQuotations,
  quotationCreated: quotations.quotationCreated,
  users: users.collection,
  update: contacts.update,
  contracts: contacts.contracts,
});


const mapDispatchToProps = {
  getSettings,
  getCasesIdMe,
  setTitle: changeTitleAction,
  getAllTypesCases,
  getAllSubTypesCases,
  deleteCase,
  getRegions,
  getCommuns,
  updateCase,
  getCivilStatus,
  createCase,
  deleteQuotations,
  updateQuotations,
  sendFormRequest,
  getContactByRut,
  createMyCase,
  createQuotationsMe,
  updateQuotationsMe,
  getQuotationByIdMe,
  createQuotations,
  getQuotationById,
  getContractByRut,
  getUsers,
};
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(QuotationDetalle);
