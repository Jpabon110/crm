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
  // Dropdown, DropdownToggle,
  // DropdownMenu, DropdownItem,
  // TabContent, TabPane,
  Col, Input, Badge,
  // Input,
} from 'reactstrap';
// import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
// import TablePagination from '@material-ui/core/TablePagination';
import QueryString from 'query-string';
// import map from 'lodash/map';

import RUTJS from 'rutjs';
import { connect } from 'react-redux';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
import Skeleton from 'react-loading-skeleton';
import jwtDecode from 'jwt-decode';
import find from 'lodash/find';
import remove from 'lodash/remove';
import map from 'lodash/map';
import moment from 'moment';
import MatTable from '../../../shared/components/MaterialTable';
import {
  getUsers,
} from '../../../redux/actions/userActions';
import { setRUTFormat, isUserAllowed } from '../../../shared/utils';
import {
  getAllQuotations,
  getAllQuotationsMe,
  updateQuotationMany,
} from '../../../redux/actions/quotationsActions';
import ModalReasing from '../../../shared/components/Modal/ModalReasing';
// import MatTableHeadCaseList from './MatTableHeadCotizacionesList';
import ereaserIcon from '../../../shared/img/ereaser_icon.png';
import {
  getContactByRut,
  getContacts,
} from '../../../redux/actions/contactosActions';
import BasicNotification from '../../../shared/components/Notifications/BasicNotification';
import ModalAC from './AssignQuotationsModal';
import FilterModal from '../../../shared/components/Modal/ModalQuotationsFilter';

// function getSorting(order, orderBy) {
//   return order === 'desc' ? (a, b) => b[orderBy] - a[orderBy] : (a, b) => a[orderBy] - b[orderBy];
// }


class DefaultTabsBorderedBottom extends PureComponent {
  state = {
    activeTab: '1',
    isOpenModalAC: false,
    isOpenModalNC: false,
    isOpenModalFilter: false,
    origen: '',
    justAdminOrManager: false,
    headers: [],
    tipo: null,
    tipify: null,
    rut: '',
    description: '',
    selected: [],
    search: null,
    order: 'asc',
    orderBy: 'calories',
    isOpenModalReasing: false,
    reasign: true,
    reasignQuotations: [],
    reasignQuotationsOnwer: '',
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
    typesFilters: null,
    subTypesFilters: null,
    codeFilters: null,
    contactsFilters: null,
    valueToFilter: {
      executive: null,
      origin: null,
      status: null,
      fromDate: null,
      toDate: null,
      inTrinidad: null,
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

    const {
      rut = false,
      onlyNotClosed,
      executive,
      origin,
      status,
      fromDate,
      toDate,
      inTrinidad,
    } = QueryString.parse(this.props.location.search);
    this.setState({ onlyNotClosed });

    const token = localStorage.getItem('accessToken');
    if (token) {
      const { user } = jwtDecode(token);
      const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');
      const reasignQuotationsOnwer = `${user.firstName} ${user.lastName}`;
      this.setState({ justAdminOrManager: isAdmin, reasignQuotationsOnwer });

      const headers = [
        {
          id: 'code', disablePadding: true, label: 'ID',
        },
        {
          id: 'Origen', disablePadding: true, label: 'Origen',
        },
        {
          id: 'Estado', disablePadding: true, label: 'Estado',
        },
        {
          id: 'Nombre cliente', disablePadding: false, label: 'Nombre cliente',
        },
        {
          id: 'Rut cliente', disablePadding: false, label: 'Rut cliente',
        },
        (isAdmin) && ({ id: 'Ejecutivo Asignado', disablePadding: false, label: 'Ejecutivo Asignado' }),
        // {
        //   id: 'Nombre empleador', disablePadding: false, label: 'Nombre empleador',
        // },
        // {
        //   id: 'Rut empleador', disablePadding: false, label: 'Rut empleador',
        // },
        {
          id: 'Tipo vehículo', disablePadding: false, label: 'Tipo vehículo',
        },
        {
          id: 'Situación laboral', disablePadding: false, label: 'Situación laboral',
        },
        {
          id: 'createdAt', disablePadding: false, label: 'Fecha ingreso',
        },
      ];

      this.setState({ headers });

      if (isAdmin) {
        this.props.getUsers({ all: true, roles: 'admin, manager, sales-executive' }, (body) => {
          this.setState({ executives: map(body, userExecutive => ({ value: userExecutive._id, label: `${userExecutive.firstName} ${userExecutive.lastName}` })) });
        });
        this.props.getUsers({ all: true, roles: 'admin, manager, sales-executive' }, (body) => {
          this.setState({ usersFilters: map(body, userF => ({ value: userF._id, label: `${userF.firstName} ${userF.lastName}` })) });
        });
        this.props.getAllQuotations({
          onlyNotClosed: true, executive, origin, status, fromDate, toDate, inTrinidad,
        }, () => {
        });
      } else {
        this.props.getAllQuotationsMe({
          onlyNotClosed: true, executive, origin, status, fromDate, toDate, inTrinidad,
        }, () => {
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

  onClickQuotationView = e => () => {
    this.props.history.push(`/cotizaciones/${e}`);
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

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

  onClickDeleteCase = caseSelected => () => {
    this.setState({ isOpenModalD: true, caseSelected });
  }

  toggleModalAC = () => {
    this.setState({ isOpenModalAC: false, rut: '' });
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
      // rut: '',
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

  toggleFilterCase = isOk => () => {
    if (isOk) {
      this.toFilter();
    } else {
      this.setState({ isOpenModalFilter: false });
    }
  }

  onClickFilterCase = () => {
    this.setState({
      isOpenModalFilter: true,
    });
  }

  cleanFilters = () => {
    if (this.state.justAdminOrManager) {
      this.props.getAllQuotations({ onlyNotClosed: true }, () => {
        this.setState({
          valueToFilter: {
            executive: null,
            origin: null,
            status: null,
            fromDate: null,
            toDate: null,
            inTrinidad: null,
          },
        });
      });
    } else {
      this.props.getAllQuotationsMe({ onlyNotClosed: true }, () => {
        this.setState({
          valueToFilter: {
            executive: null,
            origin: null,
            status: null,
            fromDate: null,
            toDate: null,
            inTrinidad: null,
          },
        });
      });
    }
    this.props.history.push('/cotizaciones');
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
      // if (body.length > 0) {
      if (body) {
        BasicNotification.show({
          color: 'success',
          title: 'Atención',
          message: 'Contacto encontrado.',
        });
        this.setState({ client: rut.replace(/[^K0-9\s]/gi, '') });
        this.props.history.push(`/cotizaciones/new/${this.state.client}`);
        // this.toggleModalAC();
        // this.onClickModalNewCase();
      } else {
        this.setState({
          hideFind: false,
          hideNewContact: false,
          // rut: '',
        });
      }
    });
  }


  onNewContact = () => {
    // this.props.history.push('/contactos?fromQuotations=true&newContact=true');
    this.props.history.push(`/contactos?fromQuotations=true&newContact=true&rut=${this.state.rut}`);
  }

  traducerStatus = (status) => {
    if (status === 'pending') {
      return 'Pendiente';
    }

    if (status === 'opened') {
      return 'Abierto';
    }


    if (status === 'closed') {
      return 'Cerrado';
    }
    return 'Nada';
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
    return 'Nada';
  }

  traducerSituation = (status) => {
    if (status === 'dependent') {
      return 'Dependiente';
    }

    if (status === 'independent') {
      return 'Independiente';
    }

    return status;
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
      this.props.getAllCases({ onlyNotClosed: true });
      this.setState({ isOpenModalD: false });
    });
  }

  toFilter = () => {
    const { valueToFilter } = this.state;
    const dataToFilter = {};

    if (valueToFilter.executive != null) {
      dataToFilter.executive = valueToFilter.executive.value;
    }

    if (valueToFilter.origin != null) {
      dataToFilter.origin = valueToFilter.origin.value;
    }

    if (valueToFilter.status != null) {
      dataToFilter.status = valueToFilter.status.value;
    }

    if (valueToFilter.fromDate != null) {
      dataToFilter.fromDate = moment(valueToFilter.fromDate).format('DD-MM-YYYY');
    }

    if (valueToFilter.toDate != null) {
      dataToFilter.toDate = moment(valueToFilter.toDate).format('DD-MM-YYYY');
    }

    if (valueToFilter.inTrinidad != null) {
      dataToFilter.inTrinidad = valueToFilter.inTrinidad.value;
    }

    let query = QueryString.parse(this.props.location.search);
    if (dataToFilter) {
      query = {};
    }

    Object.assign(query, dataToFilter);

    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');

    if (isAdmin) {
      this.props.getAllQuotations({ onlyNotClosed: true, ...query }, () => {
        this.props.history.push(`/cotizaciones?${QueryString.stringify(query)}`);
        this.setState({ isOpenModalFilter: false });
      });
    } else {
      this.props.getAllQuotationsMe({ onlyNotClosed: true, ...query }, () => {
        this.props.history.push(`/cotizaciones?${QueryString.stringify(query)}`);
        this.setState({ isOpenModalFilter: false });
      });
    }
  }

  onSubmitSearch = (e) => {
    e.preventDefault();

    const {
      search,
    } = this.state;

    let query = QueryString.parse(this.props.location.search);

    if (search === null) {
      query = {};
    }
    Object.assign(query, { search });
    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');

    if (isAdmin) {
      this.props.getAllQuotations(query, () => {
        this.props.history.push(`/cotizaciones?${QueryString.stringify(query)}`);
      });
    } else {
      this.props.getAllQuotationsMe(query, () => {
        this.props.history.push(`/cotizaciones?${QueryString.stringify(query)}`);
      });
    }
  }

  onChangeSearch = (e) => {
    this.setState({ search: e.target.value });
  }

  AllQuotations = () => {
    this.props.getAllQuotations({ }, (body) => {
      this.setState({ search: '', codeFilters: map(body, caseInfo => ({ value: caseInfo.code, label: `${caseInfo.code}` })) });
    });
  }

  AllMyQuotations = () => {
    this.props.getAllQuotationsMe({ }, (body) => {
      this.setState({ search: '', codeFilters: map(body, caseInfo => ({ value: caseInfo.code, label: `${caseInfo.code}` })) });
    });
  }

  onChangePage = (page) => {
    this.setState({ page });
    const query = QueryString.parse(this.props.location.search);
    this.props.history.push(`/cotizaciones?${QueryString.stringify({ ...query, page: page + 1 })}`);
    if (this.state.justAdminOrManager === true) {
      if (this.state.onlyNotClosed === false) {
        this.props.getAllQuotations({ onlyNotClosed: false, ...query, page: page + 1 });
      } else {
        this.props.getAllQuotations({ onlyNotClosed: true, ...query, page: page + 1 });
      }
    } else if (this.state.onlyNotClosed === false) {
      this.props.getAllQuotationsMe({ onlyNotClosed: false, ...query, page: page + 1 });
    } else {
      this.props.getAllQuotationsMe({ onlyNotClosed: true, ...query, page: page + 1 });
    }
  }

  onChangeRowsPerPage = (rowsPerPage) => {
    this.setState({ rowsPerPage });
    const query = QueryString.parse(this.props.location.search);
    this.props.history.push(`/cotizaciones?${QueryString.stringify({ ...query, limit: rowsPerPage })}`);
    if (this.state.justAdminOrManager === true) {
      if (this.state.onlyNotClosed === false) {
        this.props.getAllQuotations({ onlyNotClosed: false, ...query, limit: rowsPerPage });
      } else {
        this.props.getAllQuotations({ onlyNotClosed: true, ...query, limit: rowsPerPage });
      }
    } else if (this.state.onlyNotClosed === false) {
      this.props.getAllQuotationsMe({ onlyNotClosed: false, ...query, limit: rowsPerPage });
    } else {
      this.props.getAllQuotationsMe({ onlyNotClosed: true, ...query, limit: rowsPerPage });
    }
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

  onClickReasingQuotation = () => {
    this.setState({
      isOpenModalReasing: true,
    });
  }


  selectQuotationsToReasign = e => () => {
    const { reasignQuotations } = this.state;

    if (find(reasignQuotations, aCase => aCase.id === e.id)) {
      remove(reasignQuotations, aCase => aCase.id === e.id);
    } else {
      reasignQuotations.push(e);
    }
    if (reasignQuotations.length === 0) {
      this.setState({ reasign: true });
    } else {
      this.setState({ reasignQuotations, reasign: false });
    }
  }

  onSelectAllClick = (checked) => {
    if (checked) {
      const { allCases } = this.props;

      let { reasignQuotations } = this.state;

      if (reasignQuotations.length === 0) {
        allCases.map((allCase) => {
          reasignQuotations.push({ id: allCase._id, code: allCase.code });
        });
      } else {
        reasignQuotations = [];
        allCases.map((allCase) => {
          // if (find(reasignQuotations, aCase => aCase.id !== allCase._id)) {
          reasignQuotations.push({ id: allCase._id, code: allCase.code });
          // }
        });
      }


      if (reasignQuotations.length === 0) {
        this.setState({ reasign: true });
      } else {
        this.setState({ reasignQuotations, reasign: false });
      }
      this.setState({ selected: allCases.map(allCase => allCase._id) });
      return;
    }
    this.setState({ selected: [], reasignQuotations: [] });
  }

  toggleReasign = isOk => () => {
    if (isOk) {
      this.onSubmitTransferQuotations();
    } else {
      this.setState({ isOpenModalReasing: false });
    }
  }

  onSubmitTransferQuotations = (e) => {
    if (e) {
      e.preventDefault();
    }

    const {
      executiveSelected,
      reasignQuotations,
    } = this.state;

    const quotations = reasignQuotations.map(reasignQuotation => reasignQuotation.id);

    if (executiveSelected === null) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe seleccionar un ejecutivo destinatario.',
      });

      return;
    }

    this.props.updateQuotationMany({ action: 'assignExcecutive', executive: executiveSelected.value, quotations }, () => {
      this.setState({ isOpenModalReasing: false });
      const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');

      if (isAdmin) {
        this.props.getAllQuotations();
      } else {
        this.props.getAllQuotationsMe();
      }
    });
    this.setState({ selected: [], reasignCases: [] });
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
      allQuotations,
      loadingQuoations,
      total,
      loadingReasing,
    } = this.props;

    // const emptyRows = rowsPerPage - Math.min(rowsPerPage, allQuotations.length - (page * rowsPerPage));
    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');

    const data = allQuotations
      // .sort(getSorting(order, orderBy))
      // .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
      .map(d => ({
        // const isSelected = this.isSelected(d._id);
        // const statusTranslate = this.findValueWithClassForStatus(d.status);
        id: d._id,
        code: d.code,
        date: d.createdAt,
        cells: (
          <Fragment>
            <TableCell className="material-table__cell" onClick={this.onClickQuotationView(d._id)} style={{ borderBottom: '0px' }} align="left">{d.code || ''}</TableCell>
            <TableCell className="material-table__cell" onClick={this.onClickQuotationView(d._id)} style={{ borderBottom: '0px' }} align="left">{this.traducerOrigin(d.origin) || ''}</TableCell>
            <TableCell className="material-table__cell" onClick={this.onClickQuotationView(d._id)} style={{ borderBottom: '0px' }} align="left"><Badge className={this.findValueWithClassForStatus(d.status).class}>{this.findValueWithClassForStatus(d.status).label || ''}</Badge></TableCell>
            <TableCell className="material-table__cell" onClick={this.onClickQuotationView(d._id)} style={{ borderBottom: '0px' }} align="left">{d.client && (`${d.client.companyName || ''} ${d.client.names || ''} ${d.client.paternalSurname || ''}`)}</TableCell>
            <TableCell className="material-table__cell" onClick={this.onClickQuotationView(d._id)} style={{ borderBottom: '0px', width: '10%' }} align="left">{d.client && (`${setRUTFormat(d.client.rut) || ''}`)}</TableCell>
            {
              (this.state.justAdminOrManager) ? (
                d.executive ? (
                  <TableCell className="material-table__cell" onClick={this.onClickQuotationView(d._id)} style={{ borderBottom: '0px' }} align="left">{`${d.executive.firstName} ${d.executive.lastName}`}</TableCell>
                ) : (
                  <TableCell className="material-table__cell" onClick={this.onClickQuotationView(d._id)} style={{ borderBottom: '0px' }} align="left" />
                )
              ) : (
                <TableCell className="material-table__cell" onClick={this.onClickQuotationView(d._id)} style={{ borderBottom: '0px' }} align="left" />
              )
            }

            {/* {
              (d.companyName) ? (
                <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} align="left">{d.companyName}</TableCell>
              ) : (
                <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} align="left" />
              )
            }
            {
              (d.companyRUT) ? (
                <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} align="left">{d.companyRUT}</TableCell>
              ) : (
                <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} align="left" />
              )
            } */}
            {
              (d.typeVehicle) ? (
                <TableCell className="material-table__cell" onClick={this.onClickQuotationView(d._id)} style={{ borderBottom: '0px' }} align="left">{d.typeVehicle}</TableCell>
              ) : (
                <TableCell className="material-table__cell" onClick={this.onClickQuotationView(d._id)} style={{ borderBottom: '0px' }} align="left" />
              )
            }
            {
              (d.workSituation) ? (
                <TableCell className="material-table__cell" onClick={this.onClickQuotationView(d._id)} style={{ borderBottom: '0px' }} align="left">{this.traducerSituation(d.workSituation)}</TableCell>
              ) : (
                <TableCell className="material-table__cell" onClick={this.onClickQuotationView(d._id)} style={{ borderBottom: '0px' }} align="left" />
              )
            }
            <TableCell className="material-table__cell" onClick={this.onClickQuotationView(d._id)} style={{ borderBottom: '0px' }} align="left">{moment(d.createdAt).format('DD/MM/YYYY,HH:mm:ss')}</TableCell>
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
          isRUTValid={this.isRUTValid}
          onNewContact={this.onNewContact}
          hideFind={this.state.hideFind}
          disabledIt={this.state.disabledIt}
          hideNewContact={this.state.hideNewContact}
        />
        <FilterModal
          isOpen={this.state.isOpenModalFilter}
          toggle={this.toggleFilterCase}
          onChangeFilter={this.onChangeFilter}
          usersFilters={this.state.usersFilters}
          isAdminP={isAdmin}
          isRUTValid={this.isRUTValid}
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
          values={this.state.reasignQuotations}
          onwer={this.state.reasignQuotationsOnwer}
          executives={this.state.executives}
          loadingReasing={loadingReasing}
        />
        <Card style={{ paddingBottom: '10px' }}>
          <CardBody className="card_body_flex" style={{ padding: '5px 10px' }}>
            <Col md="8" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <Col xs="auto" sm="auto" md="auto" style={{ padding: '0px' }}>
                <form
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                  }}
                  onSubmit={this.onSubmitSearch}
                >
                  <span className="lnr lnr-magnifier form-control-feedback" />
                  <Input className="find_of_bar" onChange={this.onChangeSearch} value={this.state.search} placeholder="Nombre Cliente, Rut Cliente" style={{ marginTop: '2.5%', marginLeft: '8px', paddingLeft: '25px' }} />
                  {/* <button type="submit" style={{ margin: '10px 0px 0px 10px' }} className="btn2 asignar2">
                    <span className="lnr lnr-magnifier icon_standars" />
                    Buscar
                  </button> */}
                  {
                    (this.state.search) && (
                      <button type="button" style={{ margin: '5px 0px 0px 10px' }} onClick={this.state.justAdminOrManager ? this.AllQuotations : this.AllMyQuotations} className="btn2 asignar2">
                        <img src={ereaserIcon} alt="" style={{ width: '15px' }} />
                        {/* <span className="lnr lnr-magic-wand icon_standars" style={{ fontSize: '15px' }} /> */}
                        {/* Limpiar busqueda */}
                      </button>
                    )
                  }
                  <button type="button" style={{ margin: '5px 0px 0px 10px' }} onClick={this.onClickFilterCase} className="btn2 asignar2">
                    <span className="lnr lnr-funnel icon_standars" style={{ fontSize: '15px' }} />
                    {/* Filtrar */}
                  </button>
                </form>
              </Col>
              <Col md="2" className="mb-2" style={{ padding: '0px' }}>
                {/* <button type="button" style={{ margin: '0px 10px 0px 10px' }} onClick={this.onClickFilterCase} className="btn2 asignar2">Filtrar</button> */}
              </Col>
            </Col>

            <Col md="4" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Col xs="auto" sm="auto" md="auto">
                <button type="button" style={{ margin: '10% 0px 0px 10%', fontSize: '12px' }} hidden={this.state.reasign} onClick={this.onClickReasingQuotation} className="btn2 asignar2">
                  Reasignar
                </button>
              </Col>
              <Col xs="auto" sm="auto" md="auto">
                <button type="button" style={{ margin: '6px 0px' }} className="asignar2 new_contact_button" onClick={this.onClickModalAssignCase}>+ Nueva Cotizacion</button>
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
        {
          loadingQuoations && (
            <Skeleton count={rowsPerPage + 1} height={40} />
          )
        }

        {
          !loadingQuoations && (
            <MatTable
              onSelectAllClick={this.onSelectAllClick}
              onChangePage={this.onChangePage}
              cargando={loadingQuoations}
              onChangeRowsPerPage={this.onChangeRowsPerPage}
              onClickRow={this.onClickRow}
              onClick={this.onClickQuotationView}
              onChange={this.selectQuotationsToReasign}
              selected={selected}
              headers={this.state.headers}
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


const mapStateToProps = ({
  contacts, users, quotations,
}) => ({
  users: users.collection,
  contact: contacts.contact,
  contacts: contacts.collection,
  total: quotations.countQuotations,
  limit: quotations.limitQuotations,
  loadingQuoations: quotations.loadingQuoations,
  quotations: quotations.quotationsInfo,
  allQuotations: quotations.allQuotations,
  loadingReasing: quotations.loadingReasing,
});


const mapDispatchToProps = {
  getContactByRut,
  getUsers,
  getContacts,
  getAllQuotations,
  getAllQuotationsMe,
  updateQuotationMany,
};
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(DefaultTabsBorderedBottom);
