/* eslint-disable react/no-array-index-key */
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
  Card, CardBody,
  Col, Row,
} from 'reactstrap';
import QueryString from 'query-string';
import TableCell from '@material-ui/core/TableCell';
import { connect } from 'react-redux';
import map from 'lodash/map';
import moment from 'moment';
import { changeTitleAction } from '../../../redux/actions/topbarActions';
import {
  getAllTypesCases,
  createSubCase,
  getAllSubTypesCases,
  updateSubCase,
  deleteSubCase,
} from '../../../redux/actions/casesActions';
import DModal from '../../../shared/components/Modal/Modal';
import ModalSubtype from './ModalSubtype';
import BasicNotification from '../../../shared/components/Notifications/BasicNotification';
import MatTable from '../../../shared/components/MaterialTable';

const headers = [
  {
    id: 'nombre', disablePadding: true, label: 'Nombre',
  },
  {
    id: 'tipo', disablePadding: true, label: 'Tipo',
  },
  {
    id: 'fechaCreacion', disablePadding: false, label: 'Fecha creacion',
  },
  {
    id: 'SLA', disablePadding: false, label: 'SLA',
  },
  {
    id: 'webEnabled', disablePadding: false, label: 'Disponible en la web',
  },
  {
    id: 'accions', disablePadding: false, label: 'Acciones',
  },
];

class SubtypeContent extends Component {
  state = {
    isOpenModalC: false,
    isOpenModalD: false,
    name: null,
    description: null,
    type: null,
    webEnabled: false,
    slaMeasure: null,
    slaTime: null,
    selected: [],
    page: 0,
    rowsPerPage: 10,
    dropdownOpen: false,
  };

  componentDidMount() {
    this.props.changeTitleAction('Tipificación');
    let { page = 1, limit = 10, newContact = false } = QueryString.parse(this.props.location.search);
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
      this.onClickContacto();
    }
    this.setState({ page, rowsPerPage: limit });
    this.props.getAllTypesCases({ all: true });
    this.props.getAllSubTypesCases();
  }

  componentWillUnmount() {
    this.props.changeTitleAction('');
  }

  toggle = () => {
    const { fromCases = false } = QueryString.parse(this.props.location.search);
    const { rut } = this.state;
    if (fromCases) {
      this.props.history.push(`/casos?rut=${rut}`);
    }
    this.setState({ isOpenModalC: false });
  }

  toggleDrop = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  onClickContacto = () => {
    this.setState({
      isOpenModalC: true,
      _id: null,
      name: null,
      description: null,
      type: null,
      slaMeasure: null,
      webEnabled: false,
      slaTime: null,
    });
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

  onSubmit = (e) => {
    e.preventDefault();

    const {
      _id,
      name,
      description,
      type,
      slaMeasure,
      webEnabled,
      slaTime,
    } = this.state;

    if ((name === null)) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe ingresar al menos un name.',
      });
      this.props.getAllSubTypesCases();
      return;
    }

    if ((description === null)) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe ingresar al menos un name.',
      });
      this.props.getAllSubTypesCases();
      return;
    }

    if ((type === null)) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe ingresar al menos un tipo.',
      });
      this.props.getAllSubTypesCases();
      return;
    }

    if ((slaMeasure === null)) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe ingresar al menos un name.',
      });
      this.props.getAllSubTypesCases();
      return;
    }

    if ((slaTime === null)) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe ingresar al menos un name.',
      });
      this.props.getAllSubTypesCases();
      return;
    }
    this.sendData({
      _id,
      name: name.trim(),
      description: description.trim(),
      type: type.value,
      webEnabled,
      SLA: {
        [slaMeasure.value]: String(slaTime).trim(),
      },
    });
  }

  destructiveSLA = (SLA) => {
    if (SLA.years) {
      return { slaTime: SLA.years, slaMeasure: 'years', slaMeasureLabel: 'Años' };
    }
    if (SLA.months) {
      return { slaTime: SLA.months, slaMeasure: 'months', slaMeasureLabel: 'Meses' };
    }
    if (SLA.weeks) {
      return { slaTime: SLA.weeks, slaMeasure: 'weeks', slaMeasureLabel: 'Semanas' };
    }
    if (SLA.days) {
      return { slaTime: SLA.days, slaMeasure: 'days', slaMeasureLabel: 'Dias' };
    }
    if (SLA.hours) {
      return { slaTime: SLA.hours, slaMeasure: 'hours', slaMeasureLabel: 'Horas' };
    }
    if (SLA.minutes) {
      return { slaTime: SLA.minutes, slaMeasure: 'minutes', slaMeasureLabel: 'Minutos' };
    }
    return null;
  }

  onEditar = conact => () => {
    const {
      _id,
      name,
      description,
      type,
    } = conact;
    const SLAReestruct = this.destructiveSLA(conact.SLA);
    this.setState({
      _id,
      name,
      description,
      type: { value: type._id, label: type.name },
      slaTime: SLAReestruct.slaTime,
      slaMeasure: { value: SLAReestruct.slaMeasure, label: SLAReestruct.slaMeasureLabel },
      isOpenModalC: true,
    });
  }

  onDelete = () => {
    const { contact } = this.state;
    this.props.deleteSubCase(contact._id, () => {
      this.props.getAllSubTypesCases();
      this.setState({ isOpenModalD: false });
    });
  }

  sendData = (data) => {
    if (!data._id) {
      delete data._id;
      this.props.createSubCase(data, () => {
        this.props.getAllSubTypesCases();
        this.toggle();
      });
    } else {
      this.props.updateSubCase(data._id, data, () => {
        this.props.getAllSubTypesCases();
        this.toggle();
      });
    }
  }

  onChangeInput = key => (e) => {
    if ((key === 'type') || (key === 'slaMeasure')) {
      this.setState({ [key]: e });
    } else if (key === 'webEnabled') {
      this.setState({ [key]: e && e.value === 'true' });
    } else {
      this.setState({ [key]: e.target.value });
    }
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
    this.props.history.push(`/tipificacion?${QueryString.stringify({ ...query, page: page + 1 })}`);
    this.props.getAllSubTypesCases({ ...query, page: page + 1 });
  }

  onChangeRowsPerPage = (rowsPerPage) => {
    this.setState({ rowsPerPage });
    const query = QueryString.parse(this.props.location.search);
    this.props.history.push(`/tipificacion?${QueryString.stringify({ ...query, limit: rowsPerPage })}`);
    this.props.getAllSubTypesCases({ ...query, limit: rowsPerPage });
  }

  render() {
    const {
      selected,
      page,
      rowsPerPage,
    } = this.state;
    const {
      total, loadingSubTypes, disableCreateSub, updating,
    } = this.props;
    const data = map(this.props.subtypes, subtype => ({
      id: subtype._id,
      cells: (
        <Fragment>
          <TableCell className="material-table__cell" align="left">{subtype.name}</TableCell>
          <TableCell className="material-table__cell" align="left">{subtype.type.name}</TableCell>
          <TableCell className="material-table__cell" align="left">{moment(subtype.createdAt).format('DD/MM/YYYY, h:mm:ss')}</TableCell>
          <TableCell className="material-table__cell" align="left">{this.destructiveSLA(subtype.SLA).slaTime} {this.destructiveSLA(subtype.SLA).slaMeasureLabel}</TableCell>
          <TableCell className="material-table__cell" align="left">{subtype.webEnabled ? 'Sí' : 'No'}</TableCell>
          <TableCell className="material-table__cell" align="left">
            <a href="javascript:void(0);" onClick={this.onEditar(subtype)}>
              <span
                className="lnr lnr-lnr lnr-pencil"
                style={{
                  fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', color: '#000',
                }}
              />
            </a>
            <a
              style={{ marginLeft: '10%' }}
              onClick={this.onClickDeleteContacto(subtype)}
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
        <ModalSubtype
          isOpen={this.state.isOpenModalC}
          toggle={this.toggle}
          onChangeInput={this.onChangeInput}
          value={this.state}
          types={this.props.types}
          onSubmit={this.onSubmit}
          disableButtonCreate={disableCreateSub}
          updating={updating}
        />
        <DModal
          title="Atención"
          color="warning"
          message="¿Esta seguro que desea borrar este registro?"
          isOpen={this.state.isOpenModalD}
          toggle={this.toggleDeleteContacto}
        />
        <Card style={{ paddingBottom: '10px' }}>
          <CardBody className="card_body_flex" style={{ padding: '10px' }}>
            <Row className="w-100">
              <Col md="12">
                <button
                  type="button"
                  className="asignar2 new_contact_button float-right"
                  onClick={this.onClickContacto}
                >
                  Nueva tipificación
                </button>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Row>
          <MatTable
            onSelectAllClick={this.onSelectAllClick}
            onChangePage={this.onChangePage}
            cargando={loadingSubTypes}
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

const mapStateToProps = ({ contacts, cases }) => ({
  contacts: contacts.collection,
  cargando: contacts.cargando,
  types: cases.types,
  total: cases.countSubTypes,
  limit: cases.limitSubTypes,
  subtypes: cases.subtypes,
  loadingSubTypes: cases.loadingSubTypes,
  updating: cases.updating,
  disableCreateSub: cases.disableCreateSub,
  subTypeCreated: cases.subTypeCreated,
});

const mapDispatchToProps = {
  changeTitleAction,
  getAllTypesCases,
  getAllSubTypesCases,
  createSubCase,
  updateSubCase,
  deleteSubCase,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubtypeContent);
