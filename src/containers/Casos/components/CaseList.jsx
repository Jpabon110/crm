/* eslint-disable array-callback-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-undef */
/* eslint-disable no-script-url */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import React, { PureComponent, Fragment } from 'react';
import {
  Card, CardBody,
  // Nav, NavItem, NavLink,
  // TabContent, TabPane,
  Col, Badge, Input,
  // Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';
// import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
// import TablePagination from '@material-ui/core/TablePagination';
import QueryString from 'query-string';
import map from 'lodash/map';
import find from 'lodash/find';
import remove from 'lodash/remove';
// import classnames from 'classnames';
import RUTJS from 'rutjs';
import { connect } from 'react-redux';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
import Skeleton from 'react-loading-skeleton';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import ereaserIcon from '../../../shared/img/ereaser_icon.png';
import {
  getUsers,
} from '../../../redux/actions/userActions';
import MatTable from '../../../shared/components/MaterialTable';
import { setRUTFormat, isUserAllowed } from '../../../shared/utils';
import DModal from '../../../shared/components/Modal/Modal';
import ModalReasing from '../../../shared/components/Modal/ModalReasing';
import FCModal from '../../../shared/components/Modal/ModalFiltersCases';
import {
  getAllTypesCases,
  getAllSubTypesCases,
  getAllCases,
  getAllCasesMe,
  createCase,
  createMyCase,
  deleteCase,
  updateCaseMany,
} from '../../../redux/actions/casesActions';
// import MatTableHeadCaseList from './MatTableHeadCaseList';
import {
  getContactByRut,
  getContacts,
} from '../../../redux/actions/contactosActions';
import BasicNotification from '../../../shared/components/Notifications/BasicNotification';
import ModalAC from './AssignCaseModal';
import ModalNC from './NewCaseModal';

// function getSorting(order, orderBy) {
//   return order === 'desc' ? (a, b) => b[orderBy] - a[orderBy] : (a, b) => a[orderBy] - b[orderBy];
// }

const headers = [
  {
    id: 'code', disablePadding: false, label: 'ID',
  },
  {
    id: 'origin', disablePadding: true, label: 'Origen',
  },
  {
    id: 'Cliente', disablePadding: false, label: 'Cliente',
  },
  {
    id: 'Rut cliente', disablePadding: false, label: 'Rut cliente',
  },
  {
    id: 'status', disablePadding: false, label: 'Estado',
  },
  {
    id: 'type', disablePadding: false, label: 'Tipo',
  },
  {
    id: 'subtype', disablePadding: false, label: 'Tipificación',
  },
  {
    id: 'Plazo', disablePadding: false, label: 'Plazo',
  },
  {
    id: 'createdAt', disablePadding: false, label: 'Creado',
  },
  {
    id: 'commitmentDate', disablePadding: false, label: 'Fecha de compromiso',
  },
  {
    id: 'executive', disablePadding: false, label: 'Ejecutivo asignado',
  },
];

class DefaultTabsBorderedBottom extends PureComponent {
  state = {
    activeTab: '1',
    isOpenModalAC: false,
    isOpenModalNC: false,
    isOpenModalFilter: false,
    origen: '',
    justAdminOrManager: false,
    tipo: null,
    tipify: null,
    rut: '',
    description: '',
    selected: [],
    order: 'desc',
    orderBy: 'code',
    isOpenModalReasing: false,
    reasign: true,
    reasignCases: [],
    reasignCasesOnwer: '',
    executives: {},
    executiveSelected: null,
    disabledIt: false,
    hideFind: false,
    page: 0,
    rowsPerPage: 10,
    hideNewContact: true,
    appointment: '',
    assign: '',
    isOpenModalD: false,
    client: '',
    firstName: '',
    lastName: '',
    usersFilters: null,
    tooltipOpen: false,
    typesFilters: null,
    subTypesFilters: null,
    codeFilters: null,
    contactsFilters: null,
    search: null,
    valueToFilter: {
      executive: null,
      type: null,
      subtype: null,
      code: null,
      origin: null,
      client: null,
      status: null,
      term: null,
      fromDate: null,
      toDate: null,
    },
    onlyNotClosed: false,
  };

  componentDidMount() {
    let { page = 1, limit = 10 } = QueryString.parse(this.props.location.search);
    const query = {};
    if (page && !Number.isNaN(page)) {
      page = parseInt(page, 10) - 1;
      Object.assign(query, { page: page + 1 });
    }
    if (limit && !Number.isNaN(limit)) {
      limit = parseInt(limit, 10);
      Object.assign(query, { limit });
    }

    this.setState({ page, rowsPerPage: limit });

    this.props.getAllTypesCases({}, (body) => {
      this.setState({ typesFilters: map(body, typeC => ({ value: typeC._id, label: `${typeC.name}` })) });
    });
    // this.props.getAllSubTypesCases({ all: true }, (body) => {
    //   this.setState({ subTypesFilters: map(body, subTypeC => ({ value: subTypeC._id, label: `${subTypeC.name}` })) });
    // });
    this.props.getContacts({ all: true }, (body) => {
      this.setState({ contactsFilters: map(body, contact => ({ value: contact._id, label: `${contact.names} ${contact.paternalSurname}` })) });
    });

    const {
      rut = false, onlyNotClosed, executive, type, subtype, code, origin, client, status, term, fromDate, toDate,
    } = QueryString.parse(this.props.location.search);
    this.setState({ onlyNotClosed });

    const token = localStorage.getItem('accessToken');

    if (token) {
      const { user } = jwtDecode(token);
      const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');
      const reasignCasesOnwer = `${user.firstName} ${user.lastName}`;
      this.setState({ justAdminOrManager: isAdmin, reasignCasesOnwer });

      if (isAdmin) {
        this.props.getUsers({ all: true, roles: 'admin, manager, dec-executive' }, (body) => {
          this.setState({ executives: map(body, userExecutive => ({ value: userExecutive._id, label: `${userExecutive.firstName} ${userExecutive.lastName}` })) });
        });
        this.props.getUsers({ all: true, roles: 'admin, manager, dec-executive' }, (body) => {
          this.setState({ usersFilters: map(body, userF => ({ value: userF._id, label: `${userF.firstName} ${userF.lastName}` })) });
        });
        this.props.getAllCases({
          onlyNotClosed: true, executive, type, subtype, code, origin, client, status, term, fromDate, toDate,
        }, (body) => {
          this.setState({ codeFilters: map(body, caseInfo => ({ value: caseInfo.code, label: `${caseInfo.code}` })) });
        });
      } else {
        this.props.getAllCasesMe({
          onlyNotClosed: true, executive, type, subtype, code, origin, client, status, term, fromDate, toDate, ...query,
        }, (body) => {
          this.setState({ codeFilters: map(body, caseInfo => ({ value: caseInfo.code, label: `${caseInfo.code}` })) });
        });
      }

      const {
        firstName,
        lastName,
      } = user;

      this.setState({
        firstName,
        lastName,
        isAdmin,
      });
    }

    if (rut) {
      this.setState({ rut, isOpenModalAC: true });
    }
  }

  onClickCaseView = e => () => {
    this.props.history.push(`/casos/${e}`);
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };


  selectCasesToReasign = e => () => {
    const { reasignCases } = this.state;

    if (find(reasignCases, aCase => aCase.id === e.id)) {
      remove(reasignCases, aCase => aCase.id === e.id);
    } else {
      reasignCases.push(e);
    }
    if (reasignCases.length === 0) {
      this.setState({ reasign: true });
    } else {
      this.setState({ reasignCases, reasign: false });
    }
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  onClickDeleteCase = caseSelected => () => {
    this.setState({ isOpenModalD: true, caseSelected });
  }

  toggleModalAC = () => {
    this.setState({ isOpenModalAC: false });
  };

  toggleModalNC = () => {
    this.setState({ isOpenModalNC: false });
  };

  onClickModalAssignCase = () => {
    this.setState({
      isOpenModalAC: true,
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

  onClickModalNewCase = () => {
    this.setState({
      _id: null,
      isOpenModalNC: true,
      origen: '',
      tipo: '',
      tipify: '',
      description: '',
      appointment: '',
      assign: '',
    });
  }

  onClickFilterCase = () => {
    this.setState({
      isOpenModalFilter: true,
    });
  }

  onClickReasingCase = () => {
    this.setState({
      isOpenModalReasing: true,
    });
  }

  toFilter = () => {
    const { valueToFilter } = this.state;
    const dataToFilter = { onlyNotClosed: true };
    if (valueToFilter.client != null) {
      dataToFilter.client = valueToFilter.client.replace(/[^K0-9\s]/gi, '');
    }

    if (valueToFilter.executive != null) {
      dataToFilter.executive = valueToFilter.executive.value;
    }

    if (valueToFilter.type != null) {
      dataToFilter.type = valueToFilter.type.value;
    }

    if (valueToFilter.subtype != null) {
      dataToFilter.subtype = valueToFilter.subtype.value;
    }

    if (valueToFilter.code != null) {
      dataToFilter.code = valueToFilter.code.value;
    }

    if (valueToFilter.origin != null) {
      dataToFilter.origin = valueToFilter.origin.value;
    }

    if (valueToFilter.status != null) {
      dataToFilter.status = valueToFilter.status.value;
    }

    if (valueToFilter.term != null) {
      dataToFilter.term = valueToFilter.term.value;
    }

    if (valueToFilter.fromDate != null) {
      dataToFilter.fromDate = moment(valueToFilter.fromDate).format('DD-MM-YYYY');
    }

    if (valueToFilter.toDate != null) {
      dataToFilter.toDate = moment(valueToFilter.toDate).format('DD-MM-YYYY');
    }

    let query = QueryString.parse(this.props.location.search);
    if (dataToFilter) {
      query = {};
    }

    Object.assign(query, dataToFilter);

    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');

    if (isAdmin) {
      this.props.getAllCases(query, () => {
        this.props.history.push(`/casos?${QueryString.stringify(query)}`);
        this.setState({ isOpenModalFilter: false });
      });
    } else {
      this.props.getAllCasesMe(query, () => {
        this.props.history.push(`/casos?${QueryString.stringify(query)}`);
        this.setState({ isOpenModalFilter: false });
      });
    }
  }

  toggleFilterCase = isOk => () => {
    if (isOk) {
      this.toFilter();
    } else {
      this.setState({ isOpenModalFilter: false });
    }
  }

  toggleReasign = isOk => () => {
    if (isOk) {
      this.onSubmitTransferCases();
    } else {
      this.setState({ isOpenModalReasing: false });
    }
  }

  onSubmitTransferCases = (e) => {
    if (e) {
      e.preventDefault();
    }

    const {
      executiveSelected,
      reasignCases,
    } = this.state;

    const cases = reasignCases.map(reasignCase => reasignCase.id);

    if (executiveSelected === null) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe seleccionar un ejecutivo destinatario.',
      });

      return;
    }

    // console.log({ action: 'assignExcecutive', executive: executiveSelected.value, cases });

    this.props.updateCaseMany({ action: 'assignExcecutive', executive: executiveSelected.value, cases }, () => {
      this.setState({ isOpenModalReasing: false });
      const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');

      if (isAdmin) {
        this.props.getAllCases();
      } else {
        this.props.getAllCasesMe();
      }
    });
    this.setState({ selected: [], reasignCases: [] });
  }

  cleanFilters = () => {
    if (this.state.justAdminOrManager) {
      this.props.getAllCases({}, (body) => {
        this.setState({ codeFilters: map(body, caseInfo => ({ value: caseInfo.code, label: `${caseInfo.code}` })) });
      });
    } else {
      this.props.getAllCasesMe({}, (body) => {
        this.setState({ codeFilters: map(body, caseInfo => ({ value: caseInfo.code, label: `${caseInfo.code}` })) });
      });
    }
    this.setState({
      valueToFilter: {
        executive: null,
        type: null,
        subtype: null,
        code: null,
        origin: null,
        client: null,
        status: null,
        term: null,
        fromDate: null,
        toDate: null,
      },
    });
    this.props.history.push('/casos');
  }

  onChangeInput = key => (e) => {
    if ((key === 'origen') || (key === 'subtype') || (key === 'appointment') || (key === 'executiveSelected')) {
      this.setState({ [key]: e });
    } else if ((key === 'type')) {
      this.setState({ [key]: e, subtype: null });
      if (e) {
        this.props.getAllSubTypesCases({ all: true, type: e.value });
      }
    } else if (key === 'rut') {
      this.setState({ [key]: setRUTFormat(e.target.value) });
    } else {
      this.setState({ [key]: e.target.value });
    }
  }

  onChangeFilter = key => (e) => {
    const valueToFilter = { ...this.state.valueToFilter };
    if ((key === 'client')) {
      valueToFilter[key] = setRUTFormat(e.target.value);
      this.setState({ valueToFilter });
    } else if ((key === 'type')) {
      valueToFilter[key] = e;
      valueToFilter.subtype = null;
      this.setState({ valueToFilter });
      if (e) {
        this.props.getAllSubTypesCases({ all: true, type: e.value });
      }
    } else if ((key === 'toDate')) {
      if (valueToFilter.fromDate) {
        if (moment(e).isBefore(valueToFilter.fromDate)) {
          BasicNotification.show({
            color: 'danger',
            title: 'Atención',
            message: 'La fecha final no puede ser menor que la inicial.',
          });
        } else {
          valueToFilter[key] = e;
          this.setState({ valueToFilter });
        }
      } else {
        BasicNotification.show({
          color: 'danger',
          title: 'Atención',
          message: 'Debe seleccionar una fecha de inicio primero.',
        });
      }
    } else {
      valueToFilter[key] = e;
      this.setState({ valueToFilter });
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';
    const { orderBy: stateOrderBy, order: stateOrder } = this.state;

    if (stateOrderBy === property && stateOrder === 'desc') { order = 'asc'; }

    this.setState({ order, orderBy });
  };

  isSelected = (id) => {
    const { selected } = this.state;
    return selected.indexOf(id) !== -1;
  };

  onSubmitAssign = (e) => {
    e.preventDefault();
    this.setState({ disabledIt: true });

    const {
      rut,
    } = this.state;

    this.props.getContactByRut(rut.replace(/[^K0-9\s]/gi, ''), (body) => {
      if (body) {
        BasicNotification.show({
          color: 'success',
          title: 'Atención',
          message: 'Contacto encontrado.',
        });
        this.setState({ client: rut.replace(/[^K0-9\s]/gi, '') });
        this.props.history.push(`/casos/new/${this.state.client}`);
      } else {
        this.setState({
          hideFind: true,
          hideNewContact: false,
          // rut: '',
        });
      }
    });
  }

  onChangeSearch = (e) => {
    this.setState({ search: e.target.value });
  }

  onSubmitSearch = (e) => {
    e.preventDefault();

    const {
      search,
    } = this.state;


    const query = {};

    Object.assign(query, { search });
    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');

    if (isAdmin) {
      this.props.getAllCases(query, () => {
        this.props.history.push(`/casos?${QueryString.stringify(query)}`);
      });
    } else {
      this.props.getAllCasesMe(query, () => {
        this.props.history.push(`/casos?${QueryString.stringify(query)}`);
      });
    }
  }

  onNewContact = () => {
    // (`/casos/new/${this.state.client}`);
    this.props.history.push(`/contactos?fromCases=true&newContact=true&rut=${this.state.rut}`);
  }

  onSubmitNewCase = (e) => {
    e.preventDefault();

    const {
      _id,
      origen,
      type,
      subtype,
      description,
      assign,
      client,
    } = this.state;

    if (origen === null) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe seleccionar un origen.',
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


    if (subtype === null) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe seleccionar un tipo.',
      });

      return;
    }

    this.sendData({
      _id,
      origin: origen.value,
      type: type.value,
      subtype: subtype.value,
      description,
      assign,
      client,
    });
  }

  traducerStatus = (status) => {
    if (status === 'pending') {
      return 'pendiente';
    }

    if (status === 'opened') {
      return 'Abierto';
    }


    if (status === 'closed') {
      return 'Cerrado';
    }
    return 'nada';
  }

  traducerOrigin = (status) => {
    if (status === 'phone') {
      return 'Telefono';
    }

    if (status === 'web') {
      return 'Web';
    }

    if (status === 'referred') {
      return 'Referido';
    }

    if (status === 'face') {
      return 'Presencial';
    }

    if (status === 'trinidad') {
      return 'Trinidad';
    }
    return 'Mail';
  }

  sendData = (data) => {
    let { page = 1, limit = 15 } = QueryString.parse(this.props.location.search);
    const query = {};
    if (page && !Number.isNaN(page)) {
      page = parseInt(page, 10) - 1;
      Object.assign(query, { page: page + 1 });
    }
    if (limit && !Number.isNaN(limit)) {
      limit = parseInt(limit, 10);
      Object.assign(query, { limit });
    }

    this.setState({ page, rowsPerPage: limit });
    if (!data._id) {
      delete data._id;
      const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');

      if (isAdmin) {
        this.props.createCase(data, (body) => {
          this.props.getAllCases(query);
          this.toggleModalNC();
          this.props.history.push(`/casos/${body._id}`);
        });
      } else {
        this.props.createMyCase(data, (body) => {
          this.props.getAllCasesMe(query);
          this.toggleModalNC();
          this.props.history.push(`/casos/${body._id}`);
        });
      }
    }
  }

  onClickDeleteContacto = contact => () => {
    this.setState({ isOpenModalD: true, contact });
  }

  toggleDeleteContacto = isOk => () => {
    if (isOk) {
      this.onDelete();
    } else {
      this.setState({ isOpenModalD: false });
    }
  }

  onDelete = () => {
    const { caseSelected } = this.state;
    this.props.deleteCase(caseSelected._id, () => {
      this.props.getAllCases({});
      this.setState({ isOpenModalD: false });
    });
  }

  toggleTooltip = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    });
  }

  allCases = () => {
    this.props.getAllCases({}, (body) => {
      this.setState({ search: '', codeFilters: map(body, caseInfo => ({ value: caseInfo.code, label: `${caseInfo.code}` })) });
    });
  }

  allMyCases = () => {
    this.props.getAllCasesMe({}, (body) => {
      this.setState({ search: '', codeFilters: map(body, caseInfo => ({ value: caseInfo.code, label: `${caseInfo.code}` })) });
    });
  }

  onChangePage = (page) => {
    this.setState({ page });
    const query = QueryString.parse(this.props.location.search);
    this.props.history.push(`/casos?${QueryString.stringify({ ...query, page: page + 1 })}`);
    if (this.state.justAdminOrManager === true) {
      if (this.state.onlyNotClosed === false) {
        this.props.getAllCases({ onlyNotClosed: false, ...query, page: page + 1 });
      } else {
        this.props.getAllCases({ onlyNotClosed: true, ...query, page: page + 1 });
      }
    } else if (this.state.onlyNotClosed === false) {
      this.props.getAllCasesMe({ onlyNotClosed: false, ...query, page: page + 1 });
    } else {
      this.props.getAllCasesMe({ onlyNotClosed: true, ...query, page: page + 1 });
    }
  }

  onChangeRowsPerPage = (rowsPerPage) => {
    this.setState({ rowsPerPage });
    const query = QueryString.parse(this.props.location.search);
    this.props.history.push(`/casos?${QueryString.stringify({ ...query, limit: rowsPerPage })}`);
    if (this.state.justAdminOrManager === true) {
      if (this.state.onlyNotClosed === false) {
        this.props.getAllCases({ onlyNotClosed: false, ...query, limit: rowsPerPage });
      } else {
        this.props.getAllCases({ onlyNotClosed: true, ...query, limit: rowsPerPage });
      }
    } else if (this.state.onlyNotClosed === false) {
      this.props.getAllCasesMe({ onlyNotClosed: false, ...query, limit: rowsPerPage });
    } else {
      this.props.getAllCasesMe({ onlyNotClosed: true, ...query, limit: rowsPerPage });
    }
  }

  onSelectAllClick = (checked) => {
    if (checked) {
      const { allCases } = this.props;

      let { reasignCases } = this.state;

      if (reasignCases.length === 0) {
        allCases.map((allCase) => {
          reasignCases.push({ id: allCase._id, code: allCase.code });
        });
      } else {
        reasignCases = [];
        allCases.map((allCase) => {
          // if (find(reasignCases, aCase => aCase.id !== allCase._id)) {
          reasignCases.push({ id: allCase._id, code: allCase.code });
          // }
        });
      }


      if (reasignCases.length === 0) {
        this.setState({ reasign: true });
      } else {
        this.setState({ reasignCases, reasign: false });
      }
      this.setState({ selected: allCases.map(allCase => allCase._id) });
      return;
    }
    this.setState({ selected: [], reasignCases: [] });
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

  setPage = (page) => {
    this.setState({ page });
  }

  render() {
    const {
      // activeTab,
      rowsPerPage, page,
      // order, orderBy,
      selected,
    } = this.state;
    const {
      allCases,
      loadingCases,
      total,
      loadingReasing,
    } = this.props;
    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');
    // console.log('reasignCases', this.state.reasignCases);
    // console.log('loadingReasing', loadingReasing);
    const data = allCases
      // .sort(getSorting(order, orderBy))
      // .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
      .map(d => ({
        // isSelected: this.isSelected(d._id),
        id: d._id,
        code: d.code,
        date: d.createdAt,
        cells: (
          <Fragment>
            <TableCell className="material-table__cell" onClick={this.onClickCaseView(d._id)} style={{ borderBottom: '0px' }} align="left">{d.code}</TableCell>
            <TableCell className="material-table__cell" onClick={this.onClickCaseView(d._id)} style={{ borderBottom: '0px' }} align="left">{this.traducerOrigin(d.origin)}</TableCell>
            <TableCell className="material-table__cell" onClick={this.onClickCaseView(d._id)} style={{ borderBottom: '0px' }} align="left">{d.client && (`${d.client.companyName || ''} ${d.client.names || ''} ${d.client.paternalSurname || ''}`)}</TableCell>
            <TableCell className="material-table__cell" onClick={this.onClickCaseView(d._id)} style={{ borderBottom: '0px', width: '10%' }} align="left">{d.client && (setRUTFormat(d.client.rut))}</TableCell>
            <TableCell className="material-table__cell" onClick={this.onClickCaseView(d._id)} style={{ borderBottom: '0px' }} align="left">
              {
                (d.status !== 'closed')
                  ? (d.status !== 'pending')
                    ? (<Badge className="badge_color">{this.traducerStatus(d.status)}</Badge>)
                    : (<Badge className="badge_color_yellow">{this.traducerStatus(d.status)}</Badge>)
                  : (<Badge className="badge_color_red">{this.traducerStatus(d.status)}</Badge>)
              }
            </TableCell>
            <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} onClick={this.onClickCaseView(d._id)} align="left">{d.type.name}</TableCell>
            <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} onClick={this.onClickCaseView(d._id)} align="left">{d.subtype.name}</TableCell>
            <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} onClick={this.onClickCaseView(d._id)} align="left">
              {
                d.commitmentDate
                  ? (
                    d.status !== 'closed'
                      ? moment().isAfter(d.commitmentDate)
                        ? <Badge className="badge_color_red">fuera del plazo</Badge>
                        : <Badge className="badge_color">dentro del plazo</Badge>
                      : <Badge className="badge_color_yellow">caso cerrado</Badge>
                  )
                  : <Badge className="badge_color_yellow">caso pendiente</Badge>
              }
              {
                d.commitmentDate && moment().isSame(d.commitmentDate) && (
                  <Badge className="badge_color_yellow">vence hoy</Badge>
                )
              }
            </TableCell>
            <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} onClick={this.onClickCaseView(d._id)} align="left">{moment(d.createdAt).format('DD/MM/YYYY, HH:mm:ss')}</TableCell>
            <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} onClick={this.onClickCaseView(d._id)} align="left">{d.commitmentDate ? moment(d.commitmentDate).format('DD/MM/YYYY, HH:mm:ss') : ''}</TableCell>
            <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} onClick={this.onClickCaseView(d._id)} align="left">{`${d.executive.firstName} ${d.executive.lastName}`}</TableCell>
          </Fragment>
        ),
      }));

    return (
      <div>
        <ModalAC
          isOpen={this.state.isOpenModalAC}
          toggle={this.toggleModalAC}
          onSubmitAssign={this.onSubmitAssign}
          onChangeInput={this.onChangeInput}
          value={this.state}
          title="Nuevo Caso"
          isRUTValid={this.isRUTValid}
          onNewContact={this.onNewContact}
          hideFind={this.state.hideFind}
          disabledIt={this.state.disabledIt}
          hideNewContact={this.state.hideNewContact}
        />
        <ModalNC
          isOpen={this.state.isOpenModalNC}
          toggle={this.toggleModalNC}
          value={this.state}
          onSubmitNewCase={this.onSubmitNewCase}
          onClickModalNewCase={this.onClickModalNewCase}
          onChangeInput={this.onChangeInput}
          types={this.props.types}
          subtypes={this.props.subtypes}
        />
        <DModal
          title="Atención"
          color="warning"
          message="¿Esta seguro que desea borrar este registro?"
          isOpen={this.state.isOpenModalD}
          toggle={this.toggleDeleteContacto}
        />
        <FCModal
          title="Filtrar"
          color="warning"
          message="¿Esta seguro que desea borrar este registro?"
          isOpen={this.state.isOpenModalFilter}
          toggle={this.toggleFilterCase}
          onChangeFilter={this.onChangeFilter}
          usersFilters={this.state.usersFilters}
          isAdminP={isAdmin}
          typesFilters={this.state.typesFilters}
          subTypesFilters={this.props.subtypes}
          codeFilters={this.state.codeFilters}
          isRUTValid={this.isRUTValid}
          contactsFilters={this.state.contactsFilters}
          valueToFilter={this.state.valueToFilter}
          cleanFilters={this.cleanFilters}
        />
        <ModalReasing
          title="Reasignación de casos"
          color="warning"
          message="¿Esta seguro que desea borrar este registro?"
          isOpen={this.state.isOpenModalReasing}
          toggle={this.toggleReasign}
          onChange={this.onChangeInput}
          values={this.state.reasignCases}
          onwer={this.state.reasignCasesOnwer}
          executives={this.state.executives}
          loadingReasing={loadingReasing}
        />
        <Card style={{ paddingBottom: '10px' }}>
          <CardBody className="card_body_flex" style={{ padding: '5px 10px' }}>
            <Col md="8" style={{ display: 'flex', flexWrap: 'wrap' }}>
              <Col xs="auto" sm="auto" md="auto" style={{ padding: '0px' }}>
                <form
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                  }}
                  onSubmit={this.onSubmitSearch}
                >
                  <span className="lnr lnr-magnifier form-control-feedback" />
                  <Input className="find_of_bar" id="byFindIt" onChange={this.onChangeSearch} value={this.state.search} placeholder="Nombre Cliente, Rut Cliente" style={{ marginTop: '3.5%', marginLeft: '8px', paddingLeft: '25px' }} />
                  {
                    (this.state.search) && (
                      <button type="button" style={{ margin: '10px 0px 0px 10px' }} onClick={this.state.justAdminOrManager ? this.allCases : this.allMyCases} className="btn2 asignar2">
                        <img src={ereaserIcon} alt="" style={{ width: '15px' }} />
                      </button>
                    )
                  }
                  <button type="button" style={{ margin: '10px 0px 0px 10px' }} onClick={this.onClickFilterCase} className="btn2 asignar2">
                    <span className="lnr lnr-funnel icon_standars" />
                  </button>
                </form>
              </Col>
            </Col>

            <Col md="4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Col xs="auto" sm="auto" md="auto">
                <button type="button" style={{ margin: '10% 0px 0px 10%', fontSize: '12px' }} hidden={this.state.reasign} onClick={this.onClickReasingCase} className="btn2 asignar2">
                  Reasignar
                </button>
              </Col>
              <Col xs="auto" sm="auto" md="auto" style={{ marginTop: '2.5%' }}>
                <button type="button" style={{ fontSize: '13px' }} className="asignar2 new_contact_button" onClick={this.onClickModalAssignCase}>+ Nuevo Caso</button>
              </Col>
            </Col>
          </CardBody>
        </Card>
        {
          loadingCases && (
            <Skeleton count={rowsPerPage + 1} height={40} />
          )
        }

        {
          !loadingCases && (
            <MatTable
              onSelectAllClick={this.onSelectAllClick}
              onChangePage={this.onChangePage}
              cargando={loadingCases}
              onChangeRowsPerPage={this.onChangeRowsPerPage}
              onClickRow={this.onClickRow}
              onClick={this.onClickCaseView}
              onChange={this.selectCasesToReasign}
              selected={selected}
              headers={headers}
              data={data}
              page={page}
              rowsPerPage={rowsPerPage}
              total={total}
              justAdminOrManager={this.state.justAdminOrManager}
              checkbox
            />
          )
        }
      </div>
    );
  }
}


const mapStateToProps = ({ cases, contacts, users }) => ({
  types: cases.types,
  disable: cases.disable,
  subtypes: cases.subtypes,
  total: cases.countCases,
  limit: cases.limitCases,
  users: users.collection,
  contact: contacts.contact,
  contacts: contacts.collection,
  loadingCases: cases.loadingCases,
  allCases: cases.allCases,
  disableCreate: cases.disableCreate,
  loadingReasing: cases.loadingReasing,
});


const mapDispatchToProps = {
  getAllTypesCases,
  getAllSubTypesCases,
  getContactByRut,
  getAllCases,
  createCase,
  deleteCase,
  getAllCasesMe,
  createMyCase,
  getUsers,
  getContacts,
  updateCaseMany,
};
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(DefaultTabsBorderedBottom);
