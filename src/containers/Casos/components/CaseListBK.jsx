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
import React, { PureComponent } from 'react';
import {
  Card, CardBody,
  // Nav, NavItem, NavLink,
  TabContent, TabPane, Col, Badge, Input,
  // Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import QueryString from 'query-string';
import map from 'lodash/map';
// import classnames from 'classnames';
import RUTJS from 'rutjs';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Skeleton from 'react-loading-skeleton';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import ereaserIcon from '../../../shared/img/ereaser_icon.png';
import {
  getUsers,
} from '../../../redux/actions/userActions';
import { setRUTFormat, isUserAllowed } from '../../../shared/utils';
import DModal from '../../../shared/components/Modal/Modal';
import FCModal from '../../../shared/components/Modal/ModalFiltersCases';
import {
  getAllTypesCases,
  getAllSubTypesCases,
  getAllCases,
  getAllCasesMe,
  createCase,
  createMyCase,
  deleteCase,
} from '../../../redux/actions/casesActions';
import MatTableHeadCaseList from './MatTableHeadCaseList';
import {
  getContactByRut,
  getContacts,
} from '../../../redux/actions/contactosActions';
import BasicNotification from '../../../shared/components/Notifications/BasicNotification';
import ModalAC from './AssignCaseModal';
import ModalNC from './NewCaseModal';

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => b[orderBy] - a[orderBy] : (a, b) => a[orderBy] - b[orderBy];
}

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
    order: 'asc',
    orderBy: 'calories',
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
  };

  componentDidMount() {
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

    this.props.getAllTypesCases({ all: true }, (body) => {
      this.setState({ typesFilters: map(body, typeC => ({ value: typeC._id, label: `${typeC.name}` })) });
    });
    // this.props.getAllSubTypesCases({ all: true }, (body) => {
    //   this.setState({ subTypesFilters: map(body, subTypeC => ({ value: subTypeC._id, label: `${subTypeC.name}` })) });
    // });
    this.props.getContacts({ all: true }, (body) => {
      this.setState({ contactsFilters: map(body, contact => ({ value: contact._id, label: `${contact.names} ${contact.paternalSurname}` })) });
    });

    const { rut = false } = QueryString.parse(this.props.location.search);

    const token = localStorage.getItem('accessToken');
    if (token) {
      const { user } = jwtDecode(token);
      const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');
      this.setState({ justAdminOrManager: isAdmin });

      if (isAdmin) {
        this.props.getUsers({ all: true }, (body) => {
          this.setState({ usersFilters: map(body, userF => ({ value: userF._id, label: `${userF.firstName} ${userF.lastName}` })) });
        });
        // this.props.getAllCases(query, (body) => {
        this.props.getAllCases({ all: true }, (body) => {
          this.setState({ codeFilters: map(body, caseInfo => ({ value: caseInfo.code, label: `${caseInfo.code}` })) });
        });
      } else {
        this.props.getAllCasesMe(query, (body) => {
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

  toFilter = () => {
    const { valueToFilter } = this.state;
    const dataToFilter = {};
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
    if ((key === 'origen') || (key === 'subtype') || (key === 'appointment')) {
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
    return 'nada';
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

  render() {
    const {
      activeTab, rowsPerPage, page, order, orderBy, selected,
    } = this.state;
    const { allCases, loadingCases } = this.props;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, allCases.length - (page * rowsPerPage));
    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');

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
        <Card style={{ paddingBottom: '10px' }}>
          <CardBody className="card_body_flex" style={{ padding: '5px 10px' }}>
            <Col md="8" style={{ display: 'flex', flexWrap: 'wrap' }}>
              <Col xs="auto" sm="auto" md="auto" style={{ padding: '0px' }}>
                {/* <form style={{ display: 'flex' }} onSubmit={this.onSubmitSearch}>
                  <Input className="find_of_bar" onChange={this.onChangeSearch} placeholder="Buscar" style={{ marginTop: '0.5%', marginLeft: '8px' }} />
                  <button type="submit" style={{ margin: '0px', marginLeft: '10px', marginRight: '10px' }} className="btn2 asignar2">Buscar</button>
                </form> */}
                <form
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                  }}
                  onSubmit={this.onSubmitSearch}
                >
                  <span className="lnr lnr-magnifier form-control-feedback" />
                  <Input className="find_of_bar" id="byFindIt" onChange={this.onChangeSearch} value={this.state.search} placeholder="Nombre Cliente, Rut Cliente" style={{ marginTop: '3.5%', marginLeft: '8px', paddingLeft: '25px' }} />
                  {/* <button type="submit" style={{ margin: '10px 0px 0px 10px' }} className="btn2 asignar2">
                    <span className="lnr lnr-magnifier icon_standars" /> Buscar
                  </button> */}
                  {
                    (this.state.search) && (
                      <button type="button" style={{ margin: '10px 0px 0px 10px' }} onClick={this.state.justAdminOrManager ? this.allCases : this.allMyCases} className="btn2 asignar2">
                        <img src={ereaserIcon} alt="" style={{ width: '15px' }} />
                        {/* <span className="lnr lnr-magic-wand icon_standars" style={{ fontSize: '15px' }} /> */}
                        {/* Limpiar busqueda */}
                      </button>
                    )
                  }
                  <button type="button" style={{ margin: '10px 0px 0px 10px' }} onClick={this.onClickFilterCase} className="btn2 asignar2">
                    <span className="lnr lnr-funnel icon_standars" />
                    {/* Filtrar */}
                  </button>
                </form>
              </Col>
            </Col>

            <Col md="4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Col xs="auto" sm="auto" md="auto" style={{ marginTop: '2.5%' }}>
                <button type="button" style={{ fontSize: '13px' }} className="asignar2 new_contact_button" onClick={this.onClickModalAssignCase}>+ Nuevo Caso</button>
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
        {/* <Card className="cardo_botton">
          <CardBody className="w_o_padding">
            <div className="tabs tabs--bordered-bottom">
              <div className="tabs__wrap flex_separate">
                <Nav tabs className="w_o_border">
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '1', the_wigth_casos: true })}
                      onClick={() => {
                        this.toggle('1');
                      }}
                    >
                      <strong>Casos</strong>
                      <span className="badge badge-autofin" style={{ fontSize: '18px' }}>{allCases.length}</span>
                    </NavLink>
                  </NavItem>
                </Nav>
                <div className="a_paw">
                  <button type="button" style={{ margin: '0px 10px 0px 10px' }} onClick={this.onClickFilterCase} className="btn2 asignar2">Filtrar</button>
                  <button type="button" style={{ fontSize: '13px' }} className="asignar2 new_contact_button" onClick={this.onClickModalAssignCase}>+ Nuevo Caso</button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card> */}
        <Card className="cardo_botton">
          <CardBody>
            <div className="tabs tabs--bordered-bottom">
              <div className="tabs__wrap">
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <Col md={12} lg={12} xl={12}>
                      {
                        loadingCases && (
                          <Skeleton count={rowsPerPage + 1} height={40} />
                        )
                      }

                      {
                        !loadingCases && (
                          <Table className="material-table border_bot table-hover">

                            <MatTableHeadCaseList
                              numSelected={selected.length}
                              order={order}
                              orderBy={orderBy}
                              onSelectAllClick={this.handleSelectAllClick}
                              onRequestSort={this.handleRequestSort}
                              rowCount={allCases.length}
                              isAdmin={isAdmin}
                            />

                            <TableBody>
                              {allCases
                                .sort(getSorting(order, orderBy))
                                .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                                .map((d) => {
                                  const isSelected = this.isSelected(d._id);
                                  return (
                                    <TableRow
                                      className="material-table__row"
                                      role="checkbox"
                                      aria-checked={isSelected}
                                      tabIndex={-1}
                                      key={d._id}
                                      onClick={this.onClickCaseView(d._id)}
                                      selected={isSelected}
                                    >
                                      <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} align="left">{d.code}</TableCell>
                                      <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} align="left">{this.traducerOrigin(d.origin)}</TableCell>
                                      <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} align="left">{ d.client && (`${d.client.companyName || ''} ${d.client.names || ''} ${d.client.paternalSurname || ''}`)}</TableCell>
                                      <TableCell className="material-table__cell" style={{ borderBottom: '0px', width: '10%' }} align="left">{d.client && (setRUTFormat(d.client.rut))}</TableCell>
                                      {/* { */}
                                      {/* (this.state.justAdminOrManager) ? ( */}
                                      <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} align="left">
                                        {
                                          (d.status !== 'closed')
                                            ? (<Badge className="badge_color">{this.traducerStatus(d.status)}</Badge>)
                                            : (<Badge className="badge_color_red">{this.traducerStatus(d.status)}</Badge>)
                                        }
                                      </TableCell>

                                      {/* ) : (
                                          <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} align="left" />
                                        )
                                      } */}

                                      <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} align="left">{d.type.name}</TableCell>
                                      <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} align="left">{d.subtype.name}</TableCell>
                                      <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} align="left">
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
                                      <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} align="left">{moment(d.createdAt).format('DD/MM/YYYY, HH:mm:ss')}</TableCell>
                                      <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} align="left">{d.commitmentDate ? moment(d.commitmentDate).format('DD/MM/YYYY, HH:mm:ss') : ''}</TableCell>
                                      <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} align="left">{`${d.executive.firstName} ${d.executive.lastName}`}</TableCell>
                                    </TableRow>
                                  );
                                })
                              }
                            </TableBody>
                          </Table>
                        )
                      }

                      {emptyRows > 0 && (
                        <TableRow style={{ height: 49 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                      <TablePagination
                        style={{ display: 'flex', justifyContent: 'center' }}
                        component="div"
                        className="material-table__pagination"
                        count={allCases.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        backIconButtonProps={{ 'aria-label': 'Previous Page' }}
                        nextIconButtonProps={{ 'aria-label': 'Next Page' }}
                        labelRowsPerPage="Filas por páginas"
                        onChangePage={this.handleChangePage}
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 15, 20]}
                      />
                    </Col>
                  </TabPane>
                  <TabPane tabId="2">
                    <p>none
                    </p>
                  </TabPane>
                </TabContent>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}


const mapStateToProps = ({ cases, contacts, users }) => ({
  types: cases.types,
  disable: cases.disable,
  subtypes: cases.subtypes,
  users: users.collection,
  contact: contacts.contact,
  contacts: contacts.collection,
  loadingCases: cases.loadingCases,
  allCases: cases.allCases,
  disableCreate: cases.disableCreate,
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
};
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(DefaultTabsBorderedBottom);
