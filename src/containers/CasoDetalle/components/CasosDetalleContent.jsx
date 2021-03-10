/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-shadow */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-indent */
/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, { Component, Fragment } from 'react';
import jwtDecode from 'jwt-decode';
import {
  Card, CardBody, Row, FormGroup, Label, Button, Nav, NavItem, NavLink,
  TabContent, TabPane, Input, Badge, Col,
} from 'reactstrap';
import classnames from 'classnames';
import Select from 'react-select';
import map from 'lodash/map';
import NumberFormat from 'react-currency-format';
import moment from 'moment';
import RUTJS from 'rutjs';
import Skeleton from 'react-loading-skeleton';
import { connect } from 'react-redux';
import avatarDefault from '../../../shared/img/avatar-default.jpg';
import BasicNotification from '../../../shared/components/Notifications/BasicNotification';
import { setRUTFormat, isUserAllowed } from '../../../shared/utils';
import DModal from '../../../shared/components/Modal/Modal';
import EModal from '../../../shared/components/Modal/ModalE';
import AssignActivityModal from './AssignActivityModal';
import ModalContactoEdit from '../../Contactos/components/ModalContactoEdit';
import CloseCaseModal from '../../../shared/components/Modal/CloseCaseModal';
import MailsContents from '../../CotizacionesDetalle/components/MailsContents';
import {
  getCasesIdMe,
  getCasesId,
  deleteCase,
  getAllTypesCases,
  getAllSubTypesCases,
  updateCase,
  updateCaseMe,
  createCase,
  createMyCase,
} from '../../../redux/actions/casesActions';
import {
  getContactByRut,
  getContractByRut,
  resetState,
} from '../../../redux/actions/contactosActions';
import {
  getUsers,
} from '../../../redux/actions/userActions';
import { changeTitleAction } from '../../../redux/actions/topbarActions';
import ModalFindClient from '../../Casos/components/AssignCaseModal';

class CasoDetalle extends Component {
  constructor() {
    super();
    this.state = {
      activeTab: '1',
      isOpenModalD: false,
      isOpenModalE: false,
      isOpenModalAssignActivity: false,
      isOpenModalCloseCase: false,
      isOpenModalContactEdit: false,
      // authorizedDataUse: false,
      // responseRating: undefined,
      // mediationAndArbitration: undefined,
      // SMARequestDate: undefined,
      isOpenModalAassignClient: false,
      cancelAssignclient: false,
      hideFind: true,
      disabledIt: true,
      hideNewContact: false,
      isOpenModalMessageMail: false,
      messages: undefined,
      NewMessage: {
        editor: null,
        attachments: [],
      },
      idDetail: null,
      new: false,
      _id: null,
      origin: { value: null, label: null },
      status: { value: 'opened', label: 'Abierto' },
      type: null,
      subtype: null,
      description: undefined,
      code: '',
      assign: '',
      client: '',
      activities: [],
      executive: null,
      createdAt: '',
      commitmentDate: '',
      names: '',
      paternalSurname: '',
      sourceMail: '',
      rut: '',
      email: '',
      emailArrayToMailsContents: [],
      // rentClient: 0,
      // phone: '',
      users: [],
      editField: true,
      showButton: false,
      updateLocal: false,
      activity: {
        description: null,
        executive: null,
      },
    };
  }

  componentDidMount() {
    const token = localStorage.getItem('accessToken');
    this.props.setTitle('Detalle del caso');
    const { id, rut } = this.props.match.params;
    if (id) {
      const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');
      if (isAdmin) {
        this.props.getCasesId(id, (caseInfo) => {
          this.assignValueOnState(caseInfo);
        });
        this.props.getUsers({ all: true, roles: 'admin, manager, dec-executive' }, (body) => {
          this.setState({ users: map(body, user => ({ value: user._id, label: `${user.firstName} ${user.lastName}` })) });
        });
      } else {
        this.props.getCasesIdMe(id, (caseInfo) => {
          this.assignValueOnState(caseInfo);
        });
      }
    }

    if (rut) {
      const isAdmin = isUserAllowed('admin');
      if (isAdmin) {
        this.props.getUsers({ all: true, roles: 'admin, manager, dec-executive' }, (body) => {
          this.setState({ users: map(body, user => ({ value: user._id, label: `${user.firstName} ${user.lastName}` })) });
        });
      }

      this.props.getContactByRut(rut, (body) => {
        this.setState({
          new: true,
          client: body._id,
          createdAt: new Date(),
          names: (body.names === '') ? body.companyName : body.names,
          paternalSurname: body.paternalSurname,
          rut: body.rut,
          email: body.emails.length > 0 ? body.emails[0].email : '',
          // rentClient: body.rent,
          // phone: body.phones[0],
          editField: false,
        });
      });

      this.props.getContractByRut(rut);
    }

    this.props.getAllTypesCases({ all: true });
    if (token) {
      const { user } = jwtDecode(token);
      this.setState({ _idWhenAdmin: user._id });
    }
  }

  componentDidUpdate() {
    const { rut, updateLocal, isOpenModalAassignClient, cancelAssignclient } = this.state;
    const { getContactByRut, getContractByRut } = this.props;
    if (rut && (rut !== '') && !updateLocal && isOpenModalAassignClient === false && cancelAssignclient === false) {
      getContactByRut(rut, () => {});
      getContractByRut(rut);
      this.setState({ updateLocal: true });
    }
  }

  componentWillUnmount() {
    const { resetState } = this.props;
    resetState();
  }

  onUpdate = (cb) => {
    cb();
  }

  assignValueOnState = (value) => {
    const { id } = this.props.match.params;
    this.props.getAllSubTypesCases({ all: true, type: value.type._id });
    // let emailArrayToMailsContents = [];
    // if ((value.client) && (value.client.emails.length > 0)) {
    //   emailArrayToMailsContents = value.client.emails.map(email => ({ value: email.email, label: email.email }));
    // } else if (value.clientEmail) {
    //   emailArrayToMailsContents = value.client.emails.map(email => ({ value: email.email, label: email.email }));
    // }
    this.setState({
      idDetail: id,
      _id: id,
      flatForClient: (value.client) ? true : undefined,
      type: { value: value.type._id, label: value.type.name },
      subtype: { value: value.subtype._id, label: value.subtype.name },
      status: this.findValue(value.status),
      messages: value.messages ? value.messages : undefined,
      // SMARequestDate: value.SMARequestDate ? moment(value.SMARequestDate).toDate() : null,
      // amountInvolved: value.amountInvolved ? value.amountInvolved : '0',
      // mediationAndArbitration: this.translateArbitration(value.mediationAndArbitration),
      // responseRating: value.responseRating ? value.responseRating : null,
      branchOffice: value.branchOffice ? value.branchOffice : 'Casa Matriz',
      origin: this.findValue(value.origin),
      // authorizedDataUse: this.translateAutorization(value.authorizedDataUse),
      sourceMail: value.sourceMail || '',
      description: value.description,
      createdAt: value.createdAt,
      closedDate: value.closedDate,
      commitmentDate: value.commitmentDate,
      names: (value.client) && ((value.client.names !== '') ? value.client.names : ((value.client.companyName) && (value.client.companyName !== '') && value.client.companyName)),
      paternalSurname: (value.client) && ((value.client.paternalSurname) ? value.client.paternalSurname : ''),
      rut: (value.client) && ((value.client.rut) ? value.client.rut : ''),
      email: (value.client) ? (value.client.emails.length > 0) ? value.client.emails[0].email : '' : '',
      emailArrayToMailsContents: (value.client) ? (value.client.emails.length > 0) ? value.client.emails.map(email => ({ value: email.email, label: email.email })) : [] : (value.clientEmail) ? [{ value: value.clientEmail, label: value.clientEmail }] : [],
      clientEmail: value.clientEmail || undefined,
      rentClient: (value.client) ? value.client.rent : '',
      phone: (value.client) ? value.client.phones[0] : '',
      code: value.code,
      activities: value.activities,
      executive: { value: (value.executive) ? value.executive._id : '', label: value.executive ? `${value.executive.firstName} ${value.executive.lastName}` : '' },
      client: ((value.client) && (value.client._id)) ? value.client._id : '',
    });
  }

  cancelEdit = () => {
    const { id } = this.props.match.params;
    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');

    if (isAdmin) {
      this.props.getCasesId(id, (caseInfo) => {
        this.assignValueOnState(caseInfo);
      });
    } else {
      this.props.getCasesIdMe(id, (caseInfo) => {
        this.assignValueOnState(caseInfo);
      });
    }

    this.setState({ editField: true, showButton: false });
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
    if (value === 'email') {
      return { value: 'email', label: 'Correo' };
    }
    if (value === 'web') {
      return { value: 'web', label: 'Web' };
    }
    if (value === 'referred') {
      return { value: 'referred', label: 'Referido' };
    }
    if (value === 'face') {
      return { value: 'face', label: 'Presencial' };
    }
    return null;
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
    // console.log(e.target.value);
    activity[key] = e.target.value;
    this.setState({ activity });
  };

  onClickModalAssignClient = () => {
    this.setState({
      isOpenModalAassignClient: true,
      cancelAssignclient: true,
      hideFind: false,
      disabledIt: false,
      hideNewContact: true,
      rut: '',
    });
  }

  isRUTValid = (rut) => {
    if (!rut) return true;
    return (new RUTJS(rut)).isValid;
  }

  onChangeInput = key => (e) => {
    if (
      (key === 'origin')
      || (key === 'subtype')
      || (key === 'appointment')
      || (key === 'executive')
      // || (key === 'authorizedDataUse')
      // || (key === 'SMARequestDate')
      // || (key === 'responseRating')
      // || (key === 'mediationAndArbitration')
    ) {
      this.setState({ [key]: e });
    } else if ((key === 'type')) {
      this.setState({ [key]: e, subtype: null });
      if (e) {
        this.props.getAllSubTypesCases({ all: true, type: e.value });
      }
    } else if (key === 'rut') {
      this.setState({ [key]: setRUTFormat(e.target.value) });
    } else if ((key === 'status')) {
      this.setState({ [key]: e });
    } else {
      this.setState({ [key]: e.target.value });
    }
  }

  onSubmitNewCase = (e) => {
    if (e) {
      e.preventDefault();
    }

    const {
      _id,
      origin,
      status,
      type,
      subtype,
      description,
      assign,
      // authorizedDataUse,
      client,
      // amountInvolved,
      // mediationAndArbitration,
      // SMARequestDate,
      // responseRating,
      executive,
    } = this.state;

    if (origin.value === null) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe seleccionar un origen.',
      });

      return;
    }


    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');

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


    if (subtype === null) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe seleccionar una tipificación.',
      });

      return;
    }

    if (type === null) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe seleccionar un tipo.',
      });

      return;
    }

    if (description === undefined) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe ingresar una descripcion.',
      });

      return;
    }

    // if ((type.value === '5d03ca464bed563b7bef6956') && (amountInvolved === undefined)) {
    //   BasicNotification.show({
    //     color: 'danger',
    //     title: 'Atención',
    //     message: 'Debe ingresar un monto.',
    //   });

    //   return;
    // }

    // if (responseRating === null) {
    //   BasicNotification.show({
    //     color: 'danger',
    //     title: 'Atención',
    //     message: 'Debe seleccionar una calificación de respuesta.',
    //   });

    //   return;
    // }

    // if ((type.value === '5d03ca464bed563b7bef6956') && (mediationAndArbitration === undefined)) {
    //   BasicNotification.show({
    //     color: 'danger',
    //     title: 'Atención',
    //     message: 'Debe seleccionar una solicitud de Sistema de Mediación y Arbitraje.',
    //   });

    //   return;
    // }

    // if ((type.value === '5d03ca464bed563b7bef6956') && (SMARequestDate === undefined)) {
    //   BasicNotification.show({
    //     color: 'danger',
    //     title: 'Atención',
    //     message: 'Debe seleccionar una Fecha solicitud.',
    //   });

    //   return;
    // }


    if (origin === null) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe seleccionar un origen.',
      });

      return;
    }

    if (status === null) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe seleccionar un estado.',
      });
    }
    if (isAdmin) {
      if (type.value === '5d03ca464bed563b7bef6956') {
        this.sendData({
          _id,
          origin: origin.value,
          status: status.value,
          type: type.value,
          subtype: subtype.value,
          // authorizedDataUse: authorizedDataUse.value,
          description: description.trim(),
          assign,
          client,
          // mediationAndArbitration: (mediationAndArbitration !== undefined) ? mediationAndArbitration.value : undefined,
          // responseRating: (responseRating !== undefined) ? responseRating : undefined,
          // SMARequestDate: (SMARequestDate !== undefined) ? SMARequestDate : undefined,
          // amountInvolved: amountInvolved.replace(/[^K0-9\s]/gi, ''),
          executive: executive.value,
        });
      } else {
        this.sendData({
          _id,
          origin: origin.value,
          status: status.value,
          type: type.value,
          subtype: subtype.value,
          // authorizedDataUse: authorizedDataUse.value,
          description: description.trim(),
          assign,
          client,
          // responseRating,
          executive: executive.value,
        });
      }
    } else if (type.value === '5d03ca464bed563b7bef6956') {
      this.sendData({
        _id,
        origin: origin.value,
        status: status.value,
        type: type.value,
        // authorizedDataUse: authorizedDataUse.value,
        subtype: subtype.value,
        description: description.trim(),
        assign,
        client,
        // mediationAndArbitration: (mediationAndArbitration !== undefined) ? mediationAndArbitration.value : undefined,
        // responseRating: (responseRating !== undefined) ? responseRating : undefined,
        // SMARequestDate: (SMARequestDate !== undefined) ? SMARequestDate : undefined,
        // amountInvolved: amountInvolved.replace(/[^K0-9\s]/gi, ''),
      });
    } else {
      this.sendData({
        _id,
        origin: origin.value,
        status: status.value,
        type: type.value,
        // authorizedDataUse: authorizedDataUse.value,
        subtype: subtype.value,
        description: description.trim(),
        assign,
        client,
        // SMARequestDate,
        // amountInvolved: amountInvolved.replace(/[^K0-9\s]/gi, ''),
        // responseRating,
      });
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
        message: 'Se debe crear el caso antes de ingresar actividades.',
      });

      return;
    }

    const activityState = {
      description: this.state.activity.description.trim(),
      executive: this.state.executive.value,
    };

    if (activityState.description === null) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe ingresar una descripcion para la actividad.',
      });
    } else {
      const data = {
        action: 'addActivity',
        activity: activityState,
      };

      const isAdmin = isUserAllowed('admin');
      if (isAdmin) {
        data.activity.executive = this.state._idWhenAdmin;
        this.props.updateCase(_id, data, () => {
          this.setState({ isOpenModalAssignActivity: false });
          this.props.getCasesId(_id, (caseInfo) => {
            this.setState({
              activities: caseInfo.activities,
              executive: { value: (caseInfo.executive) ? caseInfo.executive._id : '', label: caseInfo.executive ? `${caseInfo.executive.firstName} ${caseInfo.executive.lastName}` : '' },
              client: (caseInfo.client) ? caseInfo.client.rut : '',
            });
          });
          this.props.getUsers({ all: true }, (body) => {
            this.setState({ users: map(body, user => ({ value: user._id, label: `${user.firstName} ${user.lastName}` })) });
          });
        });
      } else {
        this.props.updateCaseMe(_id, data, () => {
          this.setState({ isOpenModalAssignActivity: false });
          this.props.getCasesIdMe(_id, (caseInfo) => {
            this.setState({
              activities: caseInfo.activities,
              executive: { value: (caseInfo.executive) ? caseInfo.executive._id : '', label: caseInfo.executive ? `${caseInfo.executive.firstName} ${caseInfo.executive.lastName}` : '' },
              client: (caseInfo.client) ? caseInfo.client.rut : '',
            });
          });
        });
      }
    }
  }

  sendData = (data) => {
    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');

    if (!data._id) {
      delete data._id;

      if (isAdmin) {
        this.props.createCase(data, (body) => {
          this.props.history.push(`/casos/${body._id}`);
        });
      } else {
        this.props.createMyCase(data, (body) => {
          this.props.history.push(`/casos/${body._id}`);
        });
      }
    } else if (isAdmin) {
      this.props.updateCase(data._id, data, () => {
        this.props.getCasesId(data._id, (caseInfo) => {
          this.assignValueOnState(caseInfo);
        });
        this.props.history.push(`/casos/${data._id}`);
      });
    } else {
      this.props.updateCaseMe(data._id, data, () => {
        this.props.getCasesIdMe(data._id, (caseInfo) => {
          this.assignValueOnState(caseInfo);
        });
      });
    }
    this.setState({ editField: true, showButton: false });
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

  onChangeMessage = key => (e) => {
    const NewMessage = { ...this.state.NewMessage };
    if (key === 'editor' || key === 'to' || key === 'cc') {
      NewMessage[key] = e;
    } else if (key === 'attachments') {
      // NewMessage.attachments.map((attachment) => {
      Object.values(e.target.files).map((file) => {
        // NewMessage[key].push({ name: file.name });
        NewMessage[key].push(file);
      });
      // });
      // console.log(e.target.files);
      // NewMessage[key].push(e.target.files);
      // NewMessage[key] = e.target.files;
      // console.log(NewMessage[key]);
    } else {
      NewMessage[key] = e.target.value;
    }
    this.setState({ NewMessage });
  };

  onSubmitNewMailsReplays = (e) => {
    if (e) {
      e.preventDefault();
    }
    let message;
    if (this.mailRef) {
      message = this.mailRef.getTextHtml();
    }
    const { _id, NewMessage } = this.state;

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
        message: 'Debe ingresar mensaje para responder el correo.',
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
      this.props.updateCase(_id, data, () => {
        this.setState({ isOpenModalMessageMail: false });
        this.props.getCasesId(_id, (casesInfo) => {
          this.setState({
            messages: casesInfo.messages ? casesInfo.messages : [],
            executive: casesInfo.executive ? { value: casesInfo.executive._id, label: `${casesInfo.executive.firstName} ${casesInfo.executive.lastName}` } : null,
            client: casesInfo.client ? casesInfo.client.rut : '',
          });
        });
        this.props.getUsers({ all: true }, (body) => {
          this.setState({ users: map(body, user => ({ value: user._id, label: `${user.firstName} ${user.lastName}` })) });
        });
      });
    } else {
      this.props.updateCaseMe(_id, data, () => {
        this.setState({ isOpenModalMessageMail: false });
        this.props.getCasesIdMe(_id, (casesInfo) => {
          this.setState({
            messages: casesInfo.messages ? casesInfo.messages : [],
            executive: casesInfo.executive ? { value: casesInfo.executive._id, label: `${casesInfo.executive.firstName} ${casesInfo.executive.lastName}` } : null,
            client: casesInfo.client ? casesInfo.client.rut : '',
          });
        });
      });
    }
  }

  justReplace = (string) => {
    let withNewLine = '';
    withNewLine = string.replace('↵', '\n');
    return withNewLine;
  }

  onClickDeleteCase = caseSelected => () => {
    this.setState({ isOpenModalD: true, caseSelected });
  }

  onClickEditCase = caseSelected => () => {
    this.setState({ isOpenModalE: true, caseSelected });
  }

  onClickCloseCase = caseSelected => () => {
    this.setState({ isOpenModalCloseCase: true, caseSelected });
  }

  onDelete = () => {
    const { caseSelected } = this.state;
    this.props.deleteCase(caseSelected, () => {
      this.setState({ isOpenModalD: false });
      this.props.history.push('/casos');
    });
  }

  onCloseCase = () => {
    const { caseSelected } = this.state;
    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');

    const data = {
      action: 'close',
    };

    if (isAdmin) {
      this.props.updateCase(caseSelected, data, () => {
        this.props.getCasesId(caseSelected, (caseInfo) => {
          this.assignValueOnState(caseInfo);
        });
      });
    } else {
      this.props.updateCaseMe(caseSelected, data, () => {
        this.props.getCasesIdMe(caseSelected, (caseInfo) => {
          this.assignValueOnState(caseInfo);
        });
      });
    }
  }

  toggleDeleteContacto = isOk => () => {
    if (isOk) {
      this.onDelete();
    } else {
      this.setState({ isOpenModalD: false });
    }
  }

  toggleEditContacto = isOk => () => {
    if (isOk) {
      this.onSubmitNewCase();
    } else {
      this.setState({ isOpenModalE: false });
    }
  }

  toggleCloseCase = isOk => () => {
    if (isOk) {
      this.setState({ isOpenModalCloseCase: false });
      this.onCloseCase();
    } else {
      this.setState({ isOpenModalCloseCase: false });
    }
  }

  toggleModalAssignActivity = () => {
    this.setState({ isOpenModalAssignActivity: false });
  };

  findIcon = (origin) => {
    if (origin === 'phone') {
      return 'phone-handset';
    }
    if (origin === 'web') {
      return 'laptop';
    }

    if ((origin === 'referred') || (origin === 'face') || (origin === 'trinidad')) {
      return 'user';
    }
    return 'user';
  }

  newWindow = link => () => {
    window.open(link, 'name', 'width=600,height=400');
  }

  onClickModalAssignActivity = () => {
    const activity = {
      description: null,
      executive: null,
    };
    this.setState({ isOpenModalAssignActivity: true, activity });
  }

  translateAutorization = (value) => {
    if (value === true) {
      return { value: true, label: 'Autorizado' };
    }
    return { value: false, label: 'No autorizado' };
  }

  translateArbitration = (value) => {
    if (value === true) {
      return { value: true, label: 'Si' };
    }
    return { value: false, label: 'No' };
  }

  toggleModalAC = () => {
    this.setState({ isOpenModalAassignClient: false });
  };

  onNewContact = () => {
    // (`/casos/new/${this.state.client}`);
    const { clientEmail } = this.state;
    this.props.history.push(`/contactos?fromDetailsCase=true&newContact=true&rut=${this.state.rut}&idCase=${this.state.idDetail}&clientEmail=${clientEmail}`);
  }

  onSubmitAssign = (e) => {
    e.preventDefault();
    this.setState({ disabledIt: true });

    const {
      rut,
    } = this.state;
    const { id } = this.props.match.params;


    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');

    this.props.getContactByRut(rut.replace(/[^K0-9\s]/gi, ''), (body) => {
      if (body) {
        BasicNotification.show({
          color: 'success',
          title: 'Atención',
          message: 'Contacto encontrado.',
        });
        const assignClient = {
          action: 'assignClient',
          payload: {
            client: body._id,
          },
        };
        if (isAdmin) {
          this.props.updateCase(id, assignClient, () => {
            this.props.getCasesId(id, (caseInfo) => {
              this.assignValueOnState(caseInfo);
            });
            this.setState({ isOpenModalAassignClient: false });
          });
        } else {
          this.props.updateCaseMe(id, assignClient, () => {
            this.props.getCasesIdMe(id, (caseInfo) => {
              this.assignValueOnState(caseInfo);
            });
            this.setState({ isOpenModalAassignClient: false });
          });
        }
        this.setState({ client: rut.replace(/[^K0-9\s]/gi, '') });
        this.props.history.push(`/casos/${id}`);
      } else {
        this.setState({
          hideFind: true,
          hideNewContact: false,
        });
      }
    });
  }

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

  setMailRef = (element) => {
    this.mailRef = element;
  };

  onClickContactoEditar = () => {
    this.setState({ isOpenModalContactEdit: true });
  }

  toggleModalContactEdit = isOk => () => {
    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');
    const { id } = this.props.match.params;
    if (isOk) {
      if (isAdmin) {
        this.props.getCasesId(id, (caseInfo) => {
          this.assignValueOnState(caseInfo);
        });
      } else {
        this.props.getCasesIdMe(id, (caseInfo) => {
          this.assignValueOnState(caseInfo);
        });
      }
      this.props.getContactByRut(this.state.rut, () => {
        this.setState({ isOpenModalContactEdit: false });
      });
    } else {
      this.setState({ isOpenModalContactEdit: false });
    }
  }

  render() {
    moment().locale('es');
    const {
      activeTab, type, users,
      code, emailArrayToMailsContents,
    } = this.state;

    // console.log(this.state.NewMessage);

    // const authorizationOptions = [
    //   { value: true, label: 'Autorizo' },
    //   { value: false, label: 'No Autorizo' },
    // ];

    // const rateOptions = [
    //   { value: '1', label: 'Aceptado' },
    //   { value: '2', label: 'Aceptado parcial o presenta otra solución' },
    //   { value: '3', label: 'Rechaza' },
    //   { value: '4', label: 'No procede y, solicita o presenta antecedentes para respaldar respuesta' },
    // ];

    // const mediationOptions = [
    //   { value: true, label: 'Si' },
    //   { value: false, label: 'No' },
    // ];

    const {
      types, subtypes, disable, contact, contracts, loadingInfoCase, disableCloseCase, cargandoContract,
    } = this.props;

    const { rut } = this.props.match.params;

    const today = moment(new Date());
    let edad = 0;
    contact && (
      edad = moment(today).year() - moment(contact.birthdate).year()
    );


    const statusOptions = [
      { value: 'pending', label: 'Pendiente' },
      { value: 'opened', label: 'Abierto' },
      { value: 'closed', label: 'Cerrado' },
    ];

    const optionsOrigin = [
      { value: 'phone', label: 'Teléfono' },
      { value: 'referred', label: 'Referido' },
      { value: 'face', label: 'Presencial' },
    ];
    const typesOptions = map(types, typ => ({ value: typ._id, label: typ.name }));
    const subtypesOptions = map(subtypes, subtype => ({ value: subtype._id, label: subtype.name }));
    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');

    const formPersonal = '';

    const createEmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${this.state.email}&su=AUTOFIN%20Caso%20número%20${this.state.code}&body=${formPersonal}`;
    return (
      <div className="dashboard container">
        <ModalFindClient
          isOpen={this.state.isOpenModalAassignClient}
          toggle={this.toggleModalAC}
          onSubmitAssign={this.onSubmitAssign}
          onChangeInput={this.onChangeInput}
          title="Asignar cliente"
          value={this.state}
          isRUTValid={this.isRUTValid}
          onNewContact={this.onNewContact}
          hideFind={this.state.hideFind}
          disabledIt={this.state.disabledIt}
          hideNewContact={this.state.hideNewContact}
        />
        <DModal
          title="Atención"
          color="danger"
          message="¿Esta seguro que desea borrar este registro?"
          isOpen={this.state.isOpenModalD}
          toggle={this.toggleDeleteContacto}
        />
        <EModal
          title="Atención"
          color="primary"
          message="¿Esta seguro que desea editar este registro?"
          isOpen={this.state.isOpenModalE}
          toggle={this.toggleEditContacto}
        />
        <CloseCaseModal
          title="Advertencia"
          color="warning"
          message="¿Esta seguro que desea Cerrar este caso?"
          isOpen={this.state.isOpenModalCloseCase}
          toggle={this.toggleCloseCase}
        />
        <AssignActivityModal
          isOpen={this.state.isOpenModalAssignActivity}
          toggle={this.toggleModalAssignActivity}
          value={this.state.activity}
          cargando={this.props.cargando}
          onSubmitNewActivity={this.onSubmitNewActivity}
          onChangeActivity={this.onChangeActivity}
        />
        <ModalContactoEdit
          isOpen={this.state.isOpenModalContactEdit}
          rutToFind={this.state.rut}
          toggle={this.toggleModalContactEdit}
        />
        <Row>
          <div className="col-md-7">
            <Card className="cardo_botton" style={{ height: 'auto' }}>
              <CardBody style={{ padding: '0px 10px' }}>
                <form className="form form--horizontal" onSubmit={this.onSubmitNewCase}>
                  <div className="profile_casos profile_casos_detail">
                    <div className="compacted col-md-12" style={{ marginBottom: '2%' }}>
                      <div className="col-md-5" style={{ padding: '0px', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                        <div className="" style={{ display: 'flex', width: '80%' }}>
                          <div className={`new_lnr lnr-${this.findIcon(this.state.origin)} font-case-details`} style={{ height: '40px' }} />
                          <div className="head_title_to_case_detail" style={{ flexDirection: 'column', marginLeft: '5%' }}>
                            <h5>{type ? type.label : ''} <span>{!rut && (`#${code}`)}</span></h5>
                            {
                              (this.state.status.value !== 'closed')
                                ? moment().isAfter(this.state.commitmentDate) ? (
                                  <Badge className="badge_color_red">fuera del plazo</Badge>
                                ) : (
                                    <Badge className="badge_color">dentro del plazo</Badge>
                                )
                                : (<Badge className="badge_color_yellow">caso cerrado</Badge>)
                            }
                          </div>
                        </div>
                      </div>
                      <div className="col-md-7" style={{ padding: '0px', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
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
                          {
                            !this.state.new && (
                              <FormGroup className="mt-4">
                                <h5 style={{ fontWeight: '600' }}>Sucursal</h5>
                                <span>{
                                  this.state.branchOffice
                                }
                                </span>

                              </FormGroup>
                            )
                          }

                        </div>
                        <div>
                        {
                              !this.state.new && (
                            <FormGroup className="mt-4">
                              <h5 style={{ fontWeight: '600' }}>Fecha de compromiso</h5>
                              <span>{
                                moment(this.state.commitmentDate).format('DD/MM/YYYY, h:mm:ss')
                              }
                              </span>

                            </FormGroup>
                              )
                            }
                        <FormGroup className="mt-4">
                          {!rut && (
                            <Fragment>
                              <h5 style={{ fontWeight: '600' }}>Fecha de cierre</h5>
                              <span>{ (this.state.closedDate) ? moment(this.state.closedDate).format('DD/MM/YYYY, h:mm:ss') : 'Sin fecha'}
                              </span>
                            </Fragment>
                          )
                          }
                        </FormGroup>
                        </div>
                        <FormGroup>
                          {
                            !this.state.new ? (
                              <Fragment>
                                <div className="col-md-3 mt-2">
                                {
                                    !this.state.showButton && (
                                      this.state.status.value === 'opened' ? (
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
                                {isAdmin && (
                                <div className="col-md-3 mt-4">
                                  <span
                                    className="lnr lnr-lnr lnr-trash font-case-details delete_case"
                                    onClick={this.onClickDeleteCase(this.state.idDetail)}
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
                      <div className="col-md-6">
                        <FormGroup>
                          <Label className="label_autofin" for="type">Tipo:</Label>
                          <Select
                            options={typesOptions}
                            type="text"
                            placeholder="seleccione"
                            name="type"
                            id="type"
                            value={this.state.type}
                            isDisabled={this.state.editField}
                            onChange={this.onChangeInput('type')}
                            required
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup>
                          <Label className="label_autofin" for="subtype">Tipificación:</Label>
                          <Select
                            options={subtypesOptions}
                            type="text"
                            name="subtype"
                            id="subtype"
                            placeholder="seleccione"
                            isLoading={disable}
                            isDisabled={this.state.editField}
                            value={this.state.subtype}
                            onChange={this.onChangeInput('subtype')}
                            required
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup>
                          <Label className="label_autofin" for="status">Estado:</Label>
                          <Select
                            options={statusOptions}
                            type="text"
                            name="status"
                            id="status"
                            isDisabled="true"
                            placeholder="seleccione"
                            value={(this.props.match.params.rut) ? statusOptions[1] : this.state.status}
                            onChange={this.onChangeInput('status')}
                            required
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">

                        <FormGroup>
                          <Label className="label_autofin" for="origin">Origen:</Label>
                          <Select
                            options={optionsOrigin}
                            type="text"
                            name="origin"
                            placeholder="seleccione"
                            id="origin"
                            isDisabled={this.state.editField || this.state.origin === 'web'}
                            value={this.state.origin}
                            onChange={this.onChangeInput('origin')}
                            required
                          />
                        </FormGroup>

                      </div>
                      {isAdmin && (
                        <Fragment>
                        <div className="col-md-6">
                          <FormGroup>
                            <Label className="label_autofin" for="executive">Ejecutivo asignado:</Label>
                            <Select
                              options={users}
                              type="text"
                              name="executive"
                              placeholder="seleccione"
                              id="executive"
                              isDisabled={this.state.editField}
                              value={this.state.executive}
                              onChange={this.onChangeInput('executive')}
                              required
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-6" />
                        </Fragment>
                      )}
                      <div className="col-md-12">
                        <div className="">
                          <div className="profile_info col-sm-12 col-md-12" style={{ padding: '0px' }}>
                            <h5 className="mb-2" style={{ fontWeight: '600' }}>Descripción:</h5>
                            <Input
                              type="textarea"
                              className="newArea"
                              name="description"
                              id="description"
                              style={{ height: '64px' }}
                              maxLength="300"
                              disabled={this.state.editField}
                              value={this.state.description}
                              onChange={this.onChangeInput('description')}
                            />
                          </div>
                        </div>
                      </div>
                      {/* {
                        ((this.state.type) && (this.state.type.value === '5d03ca464bed563b7bef6956')) && (
                          <div className="col-md-6 mt-3">
                            <FormGroup>
                              <Label className="label_autofin" for="executive">Monto implicado</Label>
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
                                disabled={this.state.editField}
                                value={this.state.amountInvolved}
                                onChange={this.onChangeInput('amountInvolved')}
                              />
                            </FormGroup>
                          </div>
                        )
                      } */}
                      {/* <Fragment>
                        <div className="col-md-6 mt-3">
                          <FormGroup>
                            <Label className="label_autofin" for="executive">Autoriza el tratamiento de datos personales</Label>
                            <Select
                              options={authorizationOptions}
                              type="text"
                              name="executive"
                              placeholder="seleccione"
                              id="executive"
                              isDisabled={this.state.editField || this.state.origin.value === 'web'}
                              value={this.state.authorizedDataUse}
                              onChange={this.onChangeInput('authorizedDataUse')}
                              required
                            />
                          </FormGroup>
                        </div>
                        {
                        ((!this.state.type) || (this.state.type.value !== '5d03ca464bed563b7bef6956')) && (
                          <div className="col-md-6" />
                        )
                      }
                      </Fragment> */}
                      {/* <Fragment>
                        <div className="col-md-8 mt-3">
                          <FormGroup>
                            <Label className="label_autofin" for="executive">¿Cómo califica su respuesta?</Label>
                            <Select
                              options={rateOptions}
                              type="text"
                              name="executive"
                              placeholder="seleccione"
                              id="executive"
                              isDisabled={this.state.editField}
                              value={this.state.responseRating}
                              onChange={this.onChangeInput('responseRating')}
                              required
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4" />
                      </Fragment> */}
                      {/* {
                        ((this.state.type) && (this.state.type.value === '5d03ca464bed563b7bef6956')) && (
                          <Fragment>
                            <div className="col-md-8 mt-3">
                              <FormGroup>
                                <Label className="label_autofin" for="executive">¿Consumidor solicita Sistema de Mediación y Arbitraje?</Label>
                                <Select
                                  options={mediationOptions}
                                  type="text"
                                  name="executive"
                                  placeholder="seleccione"
                                  id="executive"
                                  isDisabled={this.state.editField}
                                  value={this.state.mediationAndArbitration}
                                  onChange={this.onChangeInput('mediationAndArbitration')}
                                  required
                                />
                              </FormGroup>
                            </div>
                            <div className="col-md-4" />
                          </Fragment>
                        )
                      } */}
                      {/* {
                        ((this.state.type) && (this.state.type.value === '5d03ca464bed563b7bef6956')) && (
                          <Fragment>
                            <div className="col-md-6">
                              <FormGroup className="columend_date">
                                <Label className="label_autofin" for="SMARequestDate">Fecha solicitud SMA</Label>
                                <DatePicker
                                  className="newArea"
                                  locale="es"
                                  dateFormat="dd/MM/yyyy"
                                  name="SMARequestDate"
                                  id="SMARequestDate"
                                  maxDate={new Date()}
                                  disabled={this.state.editField}
                                  showYearDropdown
                                  dropdownMode="select"
                                  selected={this.state.SMARequestDate}
                                  onChange={this.onChangeInput('SMARequestDate')}
                                />
                              </FormGroup>
                            </div>
                            <div className="col-md-6" />
                          </Fragment>
                        )
                      } */}
                      {
                        this.state.showButton && (
                          <div className="col-md-12" style={{ paddingTop: '5%' }}>
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
                      {
                        (this.state.clientEmail && this.state.flatForClient === undefined) && (
                          <div className="col-md-12" style={{ paddingTop: '5%' }}>
                            <button type="button" style={{ fontSize: '13px' }} className="asignar2 new_contact_button" onClick={this.onClickModalAssignClient}>Asignar cliente</button>
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
                    {
                      !rut && (
                        <Fragment>
                          {
                            this.state.status.value === 'opened' ? (
                              <Fragment>
                                <Button className="asignar button_details" style={{ margin: '0px' }} onClick={this.onClickModalAssignActivity}>
                                  Añadir actividad
                                </Button>
                                {/* <Button
                                  className="asignar button_details"
                                  type="submit"
                                  id="added"
                                  style={{ borderRadius: '0px 5px 5px 0px' }}
                                  onClick={this.onClickCloseCase(this.state.idDetail)}
                                >Cerrar caso
                                </Button> */}
                              </Fragment>
                            )
                              : ''
                          }
                        </Fragment>
                      )
                    }
                    {/* </Row> */}
                  </div>
                  {
                    this.state.activities.length > 0 && (
                  <div className="col-md-12" style={{ height: '300px', overflowY: 'scroll', marginBottom: '5%' }}>
                    {this.state.activities && (
                      this.state.activities
                        .map(all => (
                          <div key={all._id} className="cards_reply" style={{ marginBottom: '3%' }}>
                            <Row className="row_flexible">
                              <div className="compacted col-md-5">
                                <div className="profile_avatar_details">
                                  <img src={(all.executive) ? (all.executive.avatar) ? all.executive.avatar : avatarDefault : ''} alt="avatar" />
                                </div>
                                <div className="profile_info col-md-8" style={{ textAlign: 'center' }}>
                                  <h5>{(all.executive) ? `${all.executive.firstName} ${all.executive.lastName}` : 'Sin nombre'}</h5>
                                  {/* <h6>Cliente Premium</h6> */}
                                </div>
                              </div>
                              <div className="compacted col-md-7">
                                <h6> {moment(all.date).format('DD/MM/YYYY HH:mm')}</h6>
                              </div>
                            </Row>
                            <Row>
                              <div className="compacted col-md-12" style={{ padding: '0px 40px' }}>
                                {/* <p style={{ width: 'inherit' }}>{this.justReplace(all.description)}</p> */}
                                <Input
                                  type="textarea"
                                  maxLength="300"
                                  minLength="30"
                                  style={{ height: '100px' }}
                                  name="clientActivity"
                                  id="clientActivity"
                                  className="newArea"
                                  disabled="true"
                                  value={this.justReplace(all.description)}
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
                sourceMail={this.state.sourceMail}
                emailArrayToMailsContents={emailArrayToMailsContents}
                loading={disableCloseCase}
                onClickModalNewMailsReplays={this.onClickModalNewMailsReplays}
                toggleModalNewMessage={this.toggleModalNewMessage}
                NewMessage={this.state.NewMessage}
                onChangeMessage={this.onChangeMessage}
                isOpenModalMessageMail={this.state.isOpenModalMessageMail}
                onSubmit={this.onSubmitNewMailsReplays}
                removeAttachment={this.removeAttachment}
              />
              )
            }
          </div>
          <div className="col-md-5">
            <Card className="cardo_botton" style={{ height: 'auto' }}>
              <CardBody style={{ padding: '0px 10px' }}>
                <div className="profile_casos card col-md-12" style={{ flexWrap: 'wrap', justifyContent: 'flex-start', padding: '10px 0px' }}>
                  {/* <div className="compacted col-md-2">
                    <div className="profile_avatar" style={{ height: '65px', width: '65px' }}>
                      <img src="../../img/avatar-profile.jpg" alt="avatar" />
                    </div>
                  </div> */}
                  <div className="profile_info col-md-12" style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {
                      loadingInfoCase && (
                        <Skeleton count={1} height={40} />
                      )
                    }
                    <div className="col-md-4 ml-2">
                      <h5 className="label_autofin">{(this.state.names !== undefined) ? this.state.names : 'sin nombre'} {(this.state.paternalSurname !== undefined) ? this.state.paternalSurname : 'sin apellido'}</h5>
                      <h5>{((this.state.rut) && (this.state.rut !== '')) ? setRUTFormat(this.state.rut) : 'sin rut' }</h5>
                    </div>
                    <div className="profile_info_calls col-md-7" style={{ justifyContent: 'flex-start', marginTop: '2%' }}>
                      <Row>
                        {/* <Button
                          className="asignar button_details button_profile_detail"
                          type="submit"
                          id="added"
                        >
                          Llamar
                        </Button> */}
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
                          className="asignar button_details button_profile_detail"
                          type="submit"
                          onClick={this.onClickCloseCase(this.state.idDetail)}
                          id="added"
                        >
                          <a
                            style={{ color: '#646777' }}
                          >
                            Cerrar caso
                          </a>
                        </Button>
                      </Row>
                    </div>
                  </div>
                  <div className="border_top_detail col-md-12">
                    <div className="profile_info col-md-12">
                      <FormGroup className="details_profile_columned">
                        <span className="datos-personales">Datos Personales CRM</span>
                      </FormGroup>
                    </div>
                    <div className="profile_info col-md-4">
                      <FormGroup className="details_profile_columned">
                        <Label className="label_autofin" for="profile">Teléfono</Label>
                        <span>
                          {this.state.phone
                            ? `${this.state.phone.code || ''} ${this.state.phone.number || ''}`
                            : 'Sin teléfono'
                           }
                        </span>
                      </FormGroup>
                    </div>
                    <div className="profile_info col-md-4">
                      <FormGroup className="details_profile_columned">
                        <Label className="label_autofin" for="profile">Correo</Label>
                        <span>{ this.state.email || this.state.clientEmail || 'Sin correo ' }</span>
                      </FormGroup>
                    </div>
                    <div className="profile_info col-md-4">
                      <FormGroup className="details_profile_columned">
                        <Label className="label_autofin" for="profile">Renta</Label>
                        <span>
                          <NumberFormat
                            value={this.state.rentClient || '0'}
                            displayType="text"
                            decimalSeparator=","
                            thousandSeparator="."
                            prefix="$"
                          />
                        </span>
                      </FormGroup>
                    </div>
                  </div>
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
            <Card style={{ height: '50%' }}>
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
                          {
                            contact
                              ? (
                              <Fragment>
                                <Row className="ml-3 mb-2">
                                  <Col>
                                    <Row>
                                      <span className="datos-personales mr-3">Datos Personales</span>
                                      <Button
                                        className="asignar button_details button_profile_detail"
                                        id="added"
                                        onClick={this.onClickContactoEditar}
                                      >
                                        Editar
                                      </Button>
                                    </Row>
                                  </Col>
                                </Row>
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
                                          ? map(contact.phones, phone => <div><span>{`${phone.code} - ${phone.number}`}</span></div>)
                                          : '-'
                                        }
                                      </span>
                                    </div>
                                    <div>
                                      <span className="span-title">
                                        Región
                                      </span>
                                      <br />
                                      {contact && contact.addresses.length > 0
                                        ? map(contact.addresses, (address, index) => (<div><span>{`${index + 1}.- ${(address.region) && (address.region.label) ? address.region.label : ''}`}</span></div>))
                                        : '-'
                                      }
                                    </div>
                                    <div>
                                      <span className="span-title">
                                        Comuna
                                      </span>
                                      <br />
                                      <span>
                                        {contact && contact.addresses.length > 0
                                          ? map(contact.addresses, (address, index) => (<div><span>{`${index + 1}.- ${(address.commune) && (address.commune.label) ? address.commune.label : ''}`}</span></div>))
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
                                          ? map(contact.emails, email => <div><span>{`${email.email}`}</span> <br /></div>)
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
                                          ? map(contact.addresses, (address, index) => (<div><span>{`${index + 1}.- ${(address.street) ? address.street : 'ninguna'}`}</span></div>))
                                          : '-'
                                        }
                                      </span>
                                    </div>
                                  </Col>
                                </Row>
                              </Fragment>
                              )
                              : (cargandoContract)
                                ? (
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
                                : (
                                <div style={{ marginLeft: '10%' }}>
                                  Sin registros
                                </div>
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
                                { contract && contract.NombreProducto
                                  ? <span>{contract.NombreProducto.toUpperCase()}</span>
                                  : '-'
                                }
                              </div>
                            </Col>
                            <Col sm={2} xs={2} md={2}>
                              <div>
                                <span className="span-title">ID</span>
                              </div>
                              <div>
                                { contract && contract.id
                                  ? <span>{`#${contract.id}`}</span>
                                  : '-'
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
                                  { contract && contract.Modelo
                                    ? <span>{`${contract.Modelo}`}</span>
                                    : '-'
                                  }
                                </div>
                                </Col>
                                <Col>
                                  <div>
                                    <span className="span-title">Marca</span>
                                  </div>
                                  <div>
                                    { contract && contract.Marca
                                      ? <span>{`${contract.Marca}`}</span>
                                      : '-'
                                    }
                                  </div>
                                </Col>
                                <Col>
                                  <div>
                                    <span className="span-title">Año</span>
                                  </div>
                                  <div>
                                    { contract && contract.AnnoVehiculo
                                      ? <span>{`${contract.AnnoVehiculo}`}</span>
                                      : '-'
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
      </div>
    );
  }
}

const mapStateToProps = ({ cases, contacts, users }) => ({
  caseInfo: cases.caseInfo,
  loadingInfoCase: cases.loadingInfoCase,
  disableCloseCase: cases.disableCloseCase,
  disableCreate: cases.disableCreate,
  types: cases.types,
  contact: contacts.contact,
  disable: cases.disable,
  subtypes: cases.subtypes,
  users: users.collection,
  cargando: cases.disableCloseCase,
  update: contacts.update,
  contracts: contacts.contracts,
  cargandoContract: contacts.cargandoContract,
});


const mapDispatchToProps = {
  getCasesIdMe,
  getCasesId,
  getAllTypesCases,
  getAllSubTypesCases,
  deleteCase,
  updateCase,
  updateCaseMe,
  createCase,
  getContactByRut,
  createMyCase,
  getUsers,
  getContractByRut,
  resetState,
  setTitle: changeTitleAction,
};
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(CasoDetalle);
