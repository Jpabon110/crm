import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
// import Checkbox from '@material-ui/core/Checkbox';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const rows = [
  {
    id: 'Usuarios', disablePadding: true, label: 'Usuarios',
  },
  {
    id: 'Correo', disablePadding: false, label: 'Correo',
  },
  // {
  //   id: 'Session', disablePadding: false, label: 'Último Inicio de sesión',
  // },
  {
    id: 'rut', disablePadding: false, label: 'RUT',
  },
  {
    id: 'Roles', disablePadding: false, label: 'Roles',
  },
  {
    id: 'Anexo', disablePadding: false, label: 'Anexo',
  },
  {
    id: 'status', disablePadding: false, label: 'Estado',
  },
  {
    id: 'Aciones', disablePadding: false, label: 'Aciones',
  },
  // {
  //   id: 'Editar', disablePadding: false, label: 'Editar',
  // },
  // {
  //   id: 'Eliminar', disablePadding: false, label: 'Eliminar',
  // },
];

export default class MatTableHead extends PureComponent {
  static propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
  };

  createSortHandler = property => (event) => {
    const { onRequestSort } = this.props;
    onRequestSort(event, property);
  };

  render() {
    // const {
    //   onSelectAllClick, order, orderBy, numSelected, rowCount,
    // } = this.props;
    const {
      order, orderBy,
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          {/* <TableCell padding="checkbox">
            <Checkbox
              className={`material-table__checkbox ${numSelected === rowCount && 'material-table__checkbox--checked'}`}
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell> */}
          {rows.map(row => (
            <TableCell
              className="material-table__cell material-table__cell--sort"
              key={row.id}
              align="left"
              padding={row.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === row.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === row.id}
                direction={order}
                onClick={this.createSortHandler(row.id)}
                className="material-table__sort-label"
                style={{ color: '#000' }}
              >
                {row.label}
              </TableSortLabel>
            </TableCell>
          ), this)}
        </TableRow>
      </TableHead>
    );
  }
}
