import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
// import Checkbox from '@material-ui/core/Checkbox';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { isUserAllowed } from '../../../shared/utils';


const rows = [
  {
    id: 'ID', disablePadding: true, label: 'ID',
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
  {
    id: 'Ejecutivo Asignado', disablePadding: false, label: 'Ejecutivo Asignado',
  },
  {
    id: 'Nombre empleador', disablePadding: false, label: 'Nombre empleador',
  },
  {
    id: 'Rut empleador', disablePadding: false, label: 'Rut empleador',
  },
  {
    id: 'Situación laboral', disablePadding: false, label: 'Situación laboral',
  },
  {
    id: 'Fecha ingreso', disablePadding: false, label: 'Fecha ingreso',
  },
];

export default class MatTableHead extends PureComponent {
  static propTypes = {
    // numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    // onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    // rowCount: PropTypes.number.isRequired,
  };

  createSortHandler = property => (event) => {
    const { onRequestSort } = this.props;
    onRequestSort(event, property);
  };

  render() {
    const {
      order, orderBy,
    } = this.props;

    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');

    return (
      <TableHead>
        <TableRow>
          {rows.map(row => (
            <TableCell
              className="material-table__cell material-table__cell--sort"
              key={row.id}
              align="left"
              padding={row.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === row.id ? order : false}
              style={{ fontWeight: 'bold', color: '#000' }}
            >
              <TableSortLabel
                active={orderBy === row.id}
                direction={order}
                onClick={this.createSortHandler(row.id)}
                className="material-table__sort-label"
                style={{ fontWeight: 'bold', color: '#000' }}
              >
                {
                  (row.id === 'Ejecutivo Asignado')
                    ? (isAdmin) && (
                      row.label
                    )
                    : (
                      row.label
                    )
                }

              </TableSortLabel>
            </TableCell>
          ), this)}
        </TableRow>
      </TableHead>
    );
  }
}
