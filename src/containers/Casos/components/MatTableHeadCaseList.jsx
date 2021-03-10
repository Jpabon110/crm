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
    id: 'ID', disablePadding: false, label: 'ID',
  },
  {
    id: 'Origen', disablePadding: true, label: 'Origen',
  },
  {
    id: 'Cliente', disablePadding: false, label: 'Cliente',
  },
  {
    id: 'Rut cliente', disablePadding: false, label: 'Rut cliente',
  },
  {
    id: 'Estado', disablePadding: false, label: 'Estado',
  },
  {
    id: 'Tipo', disablePadding: false, label: 'Tipo',
  },
  {
    id: 'Tipificación', disablePadding: false, label: 'Tipificación',
  },
  {
    id: 'Plazo', disablePadding: false, label: 'Plazo',
  },
  {
    id: 'Creado', disablePadding: false, label: 'Creado',
  },
  {
    id: 'Fecha de compromiso', disablePadding: false, label: 'Fecha de compromiso',
  },
  {
    id: 'Ejecutivo asignado', disablePadding: false, label: 'Ejecutivo asignado',
  },
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
    const {
      order, orderBy,
    } = this.props;


    const isAdmin = isUserAllowed('admin');
    return (
      <TableHead>
        <TableRow>
          {/* <TableCell padding="checkbox">
            <Checkbox
              className={`material-table__checkbox ${numSelected === rowCount && 'material-table__checkbox--checked'}`}
              indeterminate={numSelected > 0 && numSelected < rowCount}
              style={{ color: numSelected ? '#C7AC43' : 'rgba(0, 0, 0, 0.54)' }}
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
                  (row.id === 'Ejecutivo')
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
