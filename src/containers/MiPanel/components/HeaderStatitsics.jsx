/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import {
  CardBody, Col,
} from 'reactstrap';
import moment from 'moment';

registerLocale('es', es);

class HeaderStatisticsComponet extends Component {
  onChangeInput = key => (e) => {
    if (this.props.onChange) {
      this.props.onChange(key, e);
    }
  }

  render() {
    const { title, disable, onClickExport, onClickConsolte } = this.props;
    let { fromDate, toDate } = this.props;
    if (fromDate) {
      fromDate = moment(fromDate, 'DD-MM-YYYY').toDate();
    }
    if (toDate) {
      toDate = moment(toDate, 'DD-MM-YYYY').toDate();
    }
    return (
      <div className="row">
        <CardBody style={{ backgroundColor: '#f2f4f7', padding: '0px 10px' }}>
          <div className="col-md-12 col-lg-12 fiveBot pt-0 pb-0 mb-3">
            <div className="col-md-5 col-lg-5">
              <h2><strong>{title}</strong></h2>
            </div>
            <Col md="7" lg="7">
              <div
                className="fix_in"
                style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end' }}
              >
                <DatePicker
                  className="nHeight"
                  locale="es"
                  disabled={disable}
                  dateFormat="dd/MM/yyyy"
                  name="dateToExportStart"
                  id="dateToExportStart"
                  placeholderText="Desde"
                  // maxDate={toDate}
                  maxDate={new Date()}
                  style={{ minHeight: '32px' }}
                  selected={fromDate}
                  onChange={this.onChangeInput('fromDate')}
                />
                <DatePicker
                  className="nHeight"
                  locale="es"
                  disabled={disable}
                  dateFormat="dd/MM/yyyy"
                  name="dateToExportFinish"
                  id="dateToExportFinish"
                  placeholderText="Hasta"
                  // minDate={fromDate}
                  maxDate={new Date()}
                  style={{ minHeight: '32px' }}
                  selected={toDate}
                  onChange={this.onChangeInput('toDate')}
                />
                <div style={{ display: 'flex' }}>
                  <button
                    className="btn button_change black_resize_button"
                    type="button"
                    style={{ padding: '5px', width: '100px', height: '32px' }}
                    onClick={onClickConsolte}
                  >
                    Consultar
                  </button>
                  <button
                    className="btn button_change black_resize_button"
                    type="button"
                    style={{ padding: '5px', width: '100px', height: '32px' }}
                    onClick={onClickExport}
                  >
                    Exportar
                  </button>
                </div>
              </div>
            </Col>
          </div>
        </CardBody>
      </div>
    );
  }
}

export default HeaderStatisticsComponet;
