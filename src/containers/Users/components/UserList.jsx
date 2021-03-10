/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React, { PureComponent, Fragment } from 'react';
import {
  Col, Badge,
} from 'reactstrap';
import TableCell from '@material-ui/core/TableCell';
import { connect } from 'react-redux';
import QueryString from 'query-string';
import Skeleton from 'react-loading-skeleton';
// import map from 'lodash/map';
import MatTable from '../../../shared/components/MaterialTable';
import {
  getUsers,
  deleteUser,
} from '../../../redux/actions/userActions';
import { changeTitleAction } from '../../../redux/actions/topbarActions';
import Modal from '../../../shared/components/Modal';
import CModal from '../../../shared/components/Modal/Modal';
import { setRUTFormat } from '../../../shared/utils';

const headUser = [
  {
    id: 'Usuarios', label: 'Usuarios',
  },
  {
    id: 'Correo', label: 'Correo',
  },
  {
    id: 'rut', label: 'RUT',
  },
  {
    id: 'Roles', label: 'Roles',
  },
  {
    id: 'Anexo', label: 'Anexo',
  },
  {
    id: 'status', label: 'Estado',
  },
  {
    id: 'Aciones', label: 'Aciones',
  },
];

const NewUser = {
  _id: null,
  modal: false,
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  anexo: '',
  rut: '',
  titleModal: '',
  roles: [],
  avatar: '',
};

class UserList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'calories',
      selected: [],
      data: [],
      page: 0,
      rowsPerPage: 10,
      isOpenModal: false,
      isOpenCModal: false,
      user: null,
    };
    this.modal = null;
  }

  componentDidMount() {
    let { page = 0, limit = 10 } = QueryString.parse(this.props.location.location.search);
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

    this.props.getUsers({ ...query }, (users) => {
      this.setState({ data: users });
    });
    this.props.changeTitleAction('Usuarios');
  }

  componentWillUnmount() {
    this.props.changeTitleAction('');
  }

  getUsers = () => {
    this.props.getUsers({}, (users) => {
      this.setState({ data: users });
    });
  }

  onChangeRowsPerPage = (rowsPerPage) => {
    this.setState({ rowsPerPage });
    const query = QueryString.parse(this.props.location.location.search);
    this.props.location.history.push(`/usuarios?${QueryString.stringify({ ...query, limit: rowsPerPage })}`);
    this.props.getUsers({ ...query, limit: rowsPerPage }, (users) => {
      this.setState({ data: users });
    });
    // if (this.state.justAdminOrManager === true) {
    //   if (this.state.onlyNotClosed === false) {
    //     this.props.getAllCases({ onlyNotClosed: false, ...query, limit: rowsPerPage });
    //   } else {
    //     this.props.getAllCases({ onlyNotClosed: true, ...query, limit: rowsPerPage });
    //   }
    // } else if (this.state.onlyNotClosed === false) {
    //   this.props.getAllCasesMe({ onlyNotClosed: false, ...query, limit: rowsPerPage });
    // } else {
    //   this.props.getAllCasesMe({ onlyNotClosed: true, ...query, limit: rowsPerPage });
    // }
  }

  onChangePage = (page) => {
    this.setState({ page });
    const query = QueryString.parse(this.props.location.location.search);
    this.props.location.history.push(`/usuarios?${QueryString.stringify({ ...query, page: page + 1 })}`);
    this.props.getUsers({ ...query, page: page + 1 }, (users) => {
      this.setState({ data: users });
    });
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';
    const { orderBy: stateOrderBy, order: stateOrder } = this.state;

    if (stateOrderBy === property && stateOrder === 'desc') { order = 'asc'; }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
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
  };

  // handleChangePage = (event, page) => {
  //   this.setState({ page });
  // };

  handleChangePage = (_, page) => {
    this.onChangePage(page);
  };

  handleChangeRowsPerPage = (event) => {
    // this.setState({ rowsPerPage: event.target.value });
    this.onChangeRowsPerPage(event.target.value);
  };

  handleDeleteSelected = () => {
    const { data } = this.state;
    let copyData = [...data];
    const { selected } = this.state;
    for (let i = 0; i < selected.length; i += 1) {
      copyData = copyData.filter(obj => obj.id !== selected[i]);
    }
    this.setState({ data: copyData, selected: [] });
  };

  isSelected = (id) => {
    const { selected } = this.state;
    return selected.indexOf(id) !== -1;
  };

  translateRol = (rol) => {
    switch (rol) {
      case 'admin':
        return 'Administrador';
      case 'manager':
        return 'Manager';
      case 'dec-executive':
        return 'Ejecutivo DEC';
      case 'sales-executive':
        return 'Ejecutivo Ventas';
      default:
        return rol;
    }
  }

  onClickAction = (action, item) => () => {
    switch (action) {
      case 'delete':
        this.deleteUser(item);
        break;
      case 'update':
        this.uploadUser(item);
        break;
      default:
        break;
    }
  }

  translateRole = (value) => {
    if (value === true) {
      return { value: true, label: 'Si' };
    }

    if (value === false) {
      return { value: false, label: 'No' };
    }

    return null;
  }

  uploadUser = (item) => {
    this.setState({
      isOpenModal: true,
      titleModal: 'Editar Usuario',
    });
    if (this.modal) {
      this.modal.setData(item);
    }
  }

  deleteUser = (item) => {
    this.setState({ isOpenCModal: true, item });
  }

  setModalRef = (e) => {
    this.modal = e;
  };

  onClose = (isOk) => {
    this.setState({ isOpenModal: false, user: null });
    if (isOk) {
      this.getUsers();
    }
  }

  toggleCModal = isOk => () => {
    if (isOk) {
      this.props.deleteUser(this.state.item._id, () => {
        this.setState({ isOpenCModal: false, item: null });
        this.getUsers();
      });
    } else {
      this.setState({ isOpenCModal: false });
    }
  }

  createUser = () => {
    this.setState({
      isOpenModal: true,
      titleModal: 'Nuevo Usuario',
    });
    if (this.modal) {
      this.modal.setData({ ...NewUser });
    }
  }

  render() {
    const {
      selected,
      rowsPerPage,
      page,
    } = this.state;

    const {
      cargando,
      total,
      users,
    } = this.props;

    console.log('users', users);
    // const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - (page * rowsPerPage));


    const data = users
      // .sort(getSorting(order, orderBy))
      // .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
      .map(d => ({
        // isSelected: this.isSelected(d._id),
        id: d._id,
        cells: (
          <Fragment>
            <TableCell
              className="material-table__cell"
              scope="row"
              padding="none"
            >
              {`${d.firstName} ${d.lastName}`}
            </TableCell>
            <TableCell className="material-table__cell" align="left">{d.email}</TableCell>
            <TableCell
              className="material-table__cell"
              scope="row"
              padding="none"
            >{setRUTFormat(d.rut)}
            </TableCell>
            <TableCell className="material-table__cell" align="left">{d.roles.map((role, index) => (
              <span key={index}><Badge color="secondary">{this.translateRol(role)}</Badge> </span>
            ))}
            </TableCell>
            <TableCell className="material-table__cell" align="left">{d.anexo}</TableCell>
            <TableCell className="material-table__cell" align="left">{d.status ? 'Activo' : 'Inactivo'}</TableCell>
            <TableCell
              className="material-table__cell"
              align="left"
            >
              <a href="javascript:void(0);" onClick={this.onClickAction('update', d)}>
                <span
                  className="lnr lnr-lnr lnr-pencil"
                  style={{
                    fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', color: '#000',
                  }}
                />
              </a>
              <a href="javascript:void(0);" onClick={this.onClickAction('delete', d)} style={{ marginLeft: '15%' }}>
                <span
                  className="lnr lnr-lnr lnr-trash"
                  style={{
                    fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', color: '#000',
                  }}
                />
              </a>
            </TableCell>
          </Fragment>
        ),
      }));

    return (
      <Col md={12} lg={12}>
        <Modal
          isOpen={this.state.isOpenModal}
          onClose={this.onClose}
          ref={this.setModalRef}
          user={this.state.user}
          title={this.state.titleModal}
        />
        <CModal
          color="warning"
          title="¡Atención!"
          message="¿Está seguro que desea eliminar el usuario?"
          toggle={this.toggleCModal}
          isOpen={this.state.isOpenCModal}
        />
        {/* <Card>
          <CardBody> */}
        {
          cargando && (
            // <dir className="profile_centralize">
            //   <Spinner color="dark" style={{ width: '5rem', height: '5rem' }} />
            // </dir>
            <Skeleton count={rowsPerPage + 1} height={40} />
          )
        }
        {
          !cargando && (
            <MatTable
              onSelectAllClick={this.onSelectAllClick}
              onChangePage={this.onChangePage}
              cargando={cargando}
              onChangeRowsPerPage={this.onChangeRowsPerPage}
              selected={selected}
              headers={headUser}
              data={data}
              page={page}
              rowsPerPage={rowsPerPage}
              total={total}
            />
          )
        }
      </Col>
    );
  }
}

const mapStateToProps = ({ users }) => ({
  users: users.collection,
  cargando: users.cargando,
  total: users.total,
  limit: users.limit,
});


const mapDispatchToProps = {
  getUsers,
  deleteUser,
  changeTitleAction,
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(UserList);
