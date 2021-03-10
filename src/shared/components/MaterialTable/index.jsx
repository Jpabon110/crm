/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, { PureComponent, Fragment } from 'react';
import {
  Card,
  CardBody,
  // Col,
  // Spinner,
} from 'reactstrap';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Skeleton from 'react-loading-skeleton';
import Head from './Head';

export default class MatTable extends PureComponent {
  state = {
    order: 'desc',
    orderBy: 'code',
  };

  onRequestSort = (_, property) => {
    const orderBy = property;
    // console.log('property', property);
    let order = 'desc';
    const { orderBy: stateOrderBy, order: stateOrder } = this.state;
    if (orderBy === 'createdAt' || orderBy === 'code') {
      if (stateOrderBy === property && stateOrder === 'desc') { order = 'asc'; }
      this.setState({ order, orderBy });
    }
  };

  handleSelectAllClick = (_, checked) => {
    this.props.onSelectAllClick(checked);
  };

  handleChangePage = (_, page) => {
    this.props.onChangePage(page);
  };

  handleChangeRowsPerPage = (event) => {
    this.props.onChangeRowsPerPage(event.target.value);
  };

  isSelected = (id) => {
    const { selected } = this.props;
    return selected.indexOf(id) !== -1;
  };

  getSorting = (order, orderBy) => {
    if (order === 'desc') {
      return (a, b) => b[orderBy] - a[orderBy];
    }
    return (a, b) => a[orderBy] - b[orderBy];

    // return order === 'desc' ? (a, b) => b[orderBy] - a[orderBy] : (a, b) => a[orderBy] - b[orderBy];
  }

  comparerAsc = (a, b, orderBy) => {
    if (orderBy === 'createdAt') {
      if (a.date > b.date) {
        return 1;
      }
      if (a.date < b.date) {
        return -1;
      }
    } else {
      if (a.code > b.code) {
        return 1;
      }
      if (a.code < b.code) {
        return -1;
      }
    }
    // a must be equal to b
    return 0;
  }

  comparerDesc = (a, b, orderBy) => {
    if (orderBy === 'createdAt') {
      if (b.date > a.date) {
        return 1;
      }
      if (b.date < a.date) {
        return -1;
      }
    } else {
      if (b.code > a.code) {
        return 1;
      }
      if (b.code < a.code) {
        return -1;
      }
    }
    // a must be equal to b
    return 0;
  }

  render() {
    const { order, orderBy } = this.state;
    const {
      data,
      total,
      headers,
      selected,
      page,
      rowsPerPage,
      cargando,
      onChange,
      justAdminOrManager,
      checkbox,
      onClickRow,
      // onClick,
    } = this.props;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, total - (page * rowsPerPage));
    // console.log('orderBy', orderBy);
    // // console.log('getSorting', this.getSorting(order, orderBy));
    // console.log('comparerAsc', data.sort((a, b) => this.comparerAsc(a, b)));
    // console.log('data', data);
    // console.log('comparerAsc', data.sort((a, b) => this.comparerAsc(a, b)));
    return (
      // <Col md={12} lg={12}>
      <Card>
        <CardBody>
          {
            cargando && (
              <Skeleton count={rowsPerPage + 1} height={40} />
            )
          }
          {
            !cargando && (
              <Fragment>
                <div className="material-table__wrap">
                  <Table className="material-table border_bot table-hover">
                    <Head
                      numSelected={selected ? selected.length : 0}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={this.handleSelectAllClick}
                      onRequestSort={this.onRequestSort}
                      rowCount={rowsPerPage}
                      headers={headers}
                      justAdminOrManager={justAdminOrManager}
                      checkbox={checkbox}
                    />
                    <TableBody>
                      {
                        data
                          .sort((order === 'desc') ? (a, b) => this.comparerDesc(a, b, orderBy) : (a, b) => this.comparerAsc(a, b))
                          // .sort(this.getSorting(order, orderBy))
                          // .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                          .map((d) => {
                            const isSelected = this.isSelected(d.id);
                            return (
                              <TableRow
                                className="material-table__row"
                                role="checkbox"
                                // onClick={onClick ? onClick(d.id) : undefined}
                                key={d.id}
                              >
                                <TableCell className="material-table__cell" padding="checkbox">
                                  {
                                    ((justAdminOrManager) && (checkbox === true)) && (
                                      <Checkbox
                                        className="material-table__checkbox"
                                        style={{ color: isSelected ? '#C7AC43' : 'rgba(0, 0, 0, 0.54)' }}
                                        onChange={onChange ? onChange({ id: d.id, code: d.code }) : ''}
                                        onClick={onClickRow ? onClickRow(d.id) : ''}
                                        checked={isSelected}
                                      />
                                    )
                                  }
                                </TableCell>
                                {d.cells}
                              </TableRow>
                            );
                          })
                      }
                      {
                        emptyRows > 0
                        && (
                          <TableRow style={{ height: 49 * emptyRows, backgroundColor: '#fff' }}>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )
                      }
                    </TableBody>
                  </Table>
                  <TablePagination
                    component="div"
                    className="material-table__pagination profile_centralize"
                    count={parseInt(total, 10)}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{ 'aria-label': 'Previous Page' }}
                    nextIconButtonProps={{ 'aria-label': 'Next Page' }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                    labelRowsPerPage="Filas por página"
                    rowsPerPageOptions={[5, 10, 15]}
                  />
                </div>
              </Fragment>
            )
          }
        </CardBody>
      </Card>
      // {/* </Col> */}
    );
  }
}
