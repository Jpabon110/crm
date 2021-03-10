/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import TableSortLabel from '@material-ui/core/TableSortLabel';
// import { isUserAllowed } from '../../utils';

export default class MatTableHead extends PureComponent {
  // static propTypes = {
  //   numSelected: PropTypes.number.isRequired,
  //   onRequestSort: PropTypes.func.isRequired,
  //   onSelectAllClick: PropTypes.func.isRequired,
  //   order: PropTypes.string.isRequired,
  //   orderBy: PropTypes.string.isRequired,
  //   rowCount: PropTypes.number.isRequired,
  //   headers: PropTypes.arrayOf.isRequired,
  // };

  createSortHandler = property => (event) => {
    const { onRequestSort } = this.props;
    // console.log('property', property);
    // console.log('event', event);
    onRequestSort(event, property);
  };

  render() {
    const {
      onSelectAllClick, order, orderBy, numSelected, rowCount, headers, justAdminOrManager, checkbox,
    } = this.props;

    // console.log('en head orderBy', orderBy);
    // console.log('en head order', order);

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            {
              ((justAdminOrManager) && (checkbox === true)) && (
                <Checkbox
                  className={`material-table__checkbox ${numSelected === rowCount && 'material-table__checkbox--checked'}`}
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  style={{ color: numSelected ? '#C7AC43' : 'rgba(0, 0, 0, 0.54)' }}
                  checked={numSelected === rowCount}
                  onChange={onSelectAllClick}
                />
              )
            }
          </TableCell>
          {headers.map(row => (
            <TableCell
              className="material-table__cell material-table__cell--sort"
              key={row.id}
              align="left"
              padding={row.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === row.id ? order : false}
            >
              <TableSortLabel
                active={(orderBy === 'createdAt' || orderBy === 'code') && orderBy === row.id}
                direction={order}
                onClick={(orderBy === 'createdAt' || orderBy === 'code') && this.createSortHandler(row.id)}
                className="material-table__sort-label"
                style={{ fontWeight: 'bold', color: '#000' }}
              >
                {
                  row.label
                }
              </TableSortLabel>
            </TableCell>
          ), this)}
        </TableRow>
      </TableHead>
    );
  }
}
