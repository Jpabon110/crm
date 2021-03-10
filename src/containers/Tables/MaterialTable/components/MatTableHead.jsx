import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const rows = [
  {
    id: 'RUT', disablePadding: true, label: 'RUT',
  },
  // {
  //   id: 'ID', disablePadding: false, label: 'ID',
  // },
  {
    id: 'Nombre', disablePadding: false, label: 'Nombre',
  },
  // {
  //   id: 'Tipo', disablePadding: false, label: 'Tipo',
  // },
  // {
  //   id: 'Estado', disablePadding: false, label: 'Estado',
  // },
  {
    id: 'Telefono', disablePadding: false, label: 'Teléfono',
  },
  {
    id: 'Email', disablePadding: false, label: 'Email',
  },
  // {
  //   id: 'Perfil', disablePadding: false, label: 'Perfil',
  // },
  {
    id: 'Renta', disablePadding: false, label: 'Renta',
  },
  {
    id: 'Accion', disablePadding: false, label: 'Acción',
  },
];

export default class MatTableHead extends PureComponent {
  static propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  createSortHandler = property => (event) => {
    const { onRequestSort } = this.props;
    onRequestSort(event, property);
  };

  render() {
    const {
      onSelectAllClick, order, orderBy, numSelected, rowCount,
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              className={`material-table__checkbox ${numSelected === rowCount && 'material-table__checkbox--checked'}`}
              indeterminate={numSelected > 0 && numSelected < rowCount}
              style={{ color: numSelected ? '#C7AC43' : 'rgba(0, 0, 0, 0.54)' }}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
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
                {row.label}
              </TableSortLabel>
            </TableCell>
          ), this)}
        </TableRow>
      </TableHead>
    );
  }
}
