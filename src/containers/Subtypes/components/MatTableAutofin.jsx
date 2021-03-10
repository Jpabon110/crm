/* eslint-disable max-len */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import {
  Card, CardBody, Spinner,
} from 'reactstrap';
import NumberFormat from 'react-currency-format';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import { setRUTFormat } from '../../../shared/utils';
import MatTableHead from '../../Tables/MaterialTable/components/MatTableHead';

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => b[orderBy] - a[orderBy] : (a, b) => a[orderBy] - b[orderBy];
}

export default class MatTable extends PureComponent {
  state = {
    order: 'asc',
    orderBy: 'RUT',
    selected: [],
    data: [],
    page: 0,
    rowsPerPage: 5,
  };

  componentDidMount() {
    this.setState({ data: this.props.contacts });
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
      this.setState({ selected: this.props.contacts.map(n => n._id) });
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

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
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

  render() {
    const {
      order, orderBy, selected, rowsPerPage, page,
    } = this.state;
    const {
      contacts, onEditar, onClickDeleteContacto, cargando,
    } = this.props;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, contacts.length - (page * rowsPerPage));

    return (
      // <Col md={12} lg={12}>
      <Card>
        <CardBody style={{ padding: '20px' }}>
          <div className="material-table__wrap">
            {
              cargando && (
                <dir className="profile_centralize" style={{ overflowy: 'hidden' }}>
                  <Spinner color="dark" style={{ width: '7rem', height: '7rem' }} />
                </dir>
              )
            }
            <Table className="material-table border_bot table-hover">
              {
                !cargando && (
                  <MatTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={this.handleSelectAllClick}
                    onRequestSort={this.handleRequestSort}
                    rowCount={contacts.length}
                    contacts={contacts}
                    cargando={cargando}
                  />
                )
              }
              <TableBody>
                { !cargando && (contacts
                  .sort(getSorting(order, orderBy))
                  .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                  .map((d) => {
                    const isSelected = this.isSelected(d._id);
                    return (
                      <TableRow
                        className="material-table__row"
                        // role="checkbox"
                        // aria-checked={isSelected}
                        // tabIndex={-1}
                        key={d._id}
                        // selected={isSelected}
                        // checked={isSelected}
                        // onClick={event => this.handleClick(event, d._id)}
                      >
                        <TableCell className="material-table__cell" padding="checkbox">
                          <Checkbox
                            checked={isSelected}
                            className="material-table__checkbox"
                            role="checkbox"
                            aria-checked={isSelected}
                            tabIndex={-1}
                            style={{ color: isSelected ? '#C7AC43' : 'rgba(0, 0, 0, 0.54)' }}
                            key={d._id}
                            selected={isSelected}
                            onClick={event => this.handleClick(event, d._id)}
                          />
                        </TableCell>
                        <TableCell
                          className="material-table__cell"
                          align="left"
                        >
                          {setRUTFormat(d.rut)}
                        </TableCell>
                        {/* <TableCell
                          className="material-table__cell"
                          padding="none"
                          align="left"
                        >
                          {d.ID}
                        </TableCell> */}
                        <TableCell
                          className="material-table__cell"
                          align="left"
                        >
                          {`${d.names} ${d.paternalSurname} ${d.maternalSurname}`}
                        </TableCell>
                        {/* <TableCell
                          className="material-table__cell"
                          align="left"
                        >
                          {d.Tipo}
                        </TableCell>
                        <TableCell
                          className="material-table__cell"
                          align="left"
                        >
                          {d.Estado}
                        </TableCell> */}
                        <TableCell
                          className="material-table__cell"
                          align="left"
                        >
                          {d.phones.length >= 1 && d.phones[0].number }
                        </TableCell>
                        <TableCell
                          className="material-table__cell"
                          align="left"
                        >
                          {d.emails.length >= 1 && d.emails[0] }
                        </TableCell>
                        <TableCell
                          className="material-table__cell"
                          align="left"
                        >
                          <NumberFormat
                            value={d.rent}
                            displayType="text"
                            decimalSeparator=","
                            thousandSeparator="."
                            prefix="$"
                          />
                        </TableCell>
                        <TableCell
                          className="material-table__cell"
                          align="left"
                        >
                          <a href="#" onClick={onEditar(d)}>
                            <span
                              className="lnr lnr-lnr lnr-pencil"
                              style={{
                                fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', color: '#000',
                              }}
                            />
                          </a>
                          <a
                            style={{ marginLeft: '5px' }}
                            onClick={onClickDeleteContacto(d)}
                            href="#"
                          >
                            <span
                              className="lnr lnr-lnr lnr-trash"
                              style={{
                                fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', color: '#000', marginLeft: '10%',
                              }}
                            />
                          </a>
                        </TableCell>
                      </TableRow>
                    );
                  }))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows, backgroundColor: '#fff' }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            component="div"
            className="material-table__pagination profile_centralize"
            count={contacts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage="Filas por páginas"
            backIconButtonProps={{ 'aria-label': 'Previous Page' }}
            nextIconButtonProps={{ 'aria-label': 'Next Page' }}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 15]}
          />
        </CardBody>
      </Card>
    );
  }
}
