/* eslint-disable no-console */
/* eslint-disable react/no-unused-state */
/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
// import jwtDecode from 'jwt-decode';
import { connect } from 'react-redux';
// import {
//   PieChart, Pie, Tooltip, Legend, ResponsiveContainer,
// } from 'recharts';
// import PropTypes from 'prop-types';
import XLSX from 'xlsx';
import moment from 'moment';
import {
  getAllCasesDashboard,
  getCaseDataExport,
} from '../../../redux/actions/casesActions';
import HeaderStatitsics from './HeaderStatitsics';
import CasesStatitsics from './CasesStatitsics';
import QuotationsStatitsics from './QuotationsStatitsics';
// import Panel from '../../../shared/components/Panel';
import {
  getAllQuotationsDashboard,
  getQuotationDataExport,
} from '../../../redux/actions/quotationsActions';
import { changeTitleAction } from '../../../redux/actions/topbarActions';

class MiPanelContent extends Component {
  state = {
    fromDateCase: undefined,
    toDateCase: undefined,
    fromDateQuotation: undefined,
    toDateQuotation: undefined,
  };

  componentDidMount() {
    this.props.setTitle('Mi Panel');
    this.props.getAllCasesDashboard({}, (body) => {
      const {
        fromDate,
        toDate,
      } = body;
      this.setState({ fromDateCase: fromDate, toDateCase: toDate });
    });
    this.props.getAllQuotationsDashboard({}, (body) => {
      const {
        fromDate,
        toDate,
      } = body;
      this.setState({ fromDateQuotation: fromDate, toDateQuotation: toDate });
    });
  }

  componentWillUnmount() {
    this.props.setTitle('');
  }

  onChangeCasesPeriod = (key, value) => {
    if (key === 'fromDate') {
      this.setState({ fromDateCase: moment(value).format('DD-MM-YYYY') });
    } else {
      this.setState({ toDateCase: moment(value).format('DD-MM-YYYY') });
    }
    // const {
    //   fromDate,
    //   toDate,
    // } = this.state;
    // console.log('query', query);
    // const query = { [key]: value ? moment(value).format('DD-MM-YYYY') : undefined };
    // this.props.getAllCasesDashboard(query);
  }

  onChangeQuotationPeriod = (key, value) => {
    if (key === 'fromDate') {
      this.setState({ fromDateQuotation: moment(value).format('DD-MM-YYYY') });
    } else {
      this.setState({ toDateQuotation: moment(value).format('DD-MM-YYYY') });
    }
    // const query = { [key]: value ? moment(value).format('DD-MM-YYYY') : undefined };
    // this.props.getAllQuotationsDashboard(query);
  }

  onClickConsolte = key => () => {
    const {
      fromDateCase,
      toDateCase,
      fromDateQuotation,
      toDateQuotation,
    } = this.state;

    if (key === 'cases') {
      const query = { fromDate: fromDateCase, toDate: toDateCase };
      this.props.getAllCasesDashboard(query);
    } else {
      const query = { fromDate: fromDateQuotation, toDate: toDateQuotation };
      this.props.getAllQuotationsDashboard(query);
    }
  }

  onClickExportCases = () => {
    const { dataDashboardCases: { fromDate, toDate } } = this.props;
    this.props.getCaseDataExport({ fromDate, toDate }, data => this.exportExcel('Casos', { fromDate, toDate }, data));
  }

  onClickExportQuotation = () => {
    const { dataDashboardQuot: { fromDate, toDate } } = this.props;
    this.props.getQuotationDataExport({ fromDate, toDate }, data => this.exportExcel('Cotizaciones', { fromDate, toDate }, data));
  }

  exportExcel = (target, { fromDate: f, toDate: t }, data = []) => {
    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, target);
      XLSX.writeFile(wb, `${target.toLowerCase()}_${f.replace(/-/gi, '_')}_al_${t.replace(/-/gi, '_')}.xlsx`);
    } catch (e) {
      console.error('export error');
    }
  }

  render() {
    const {
      dataDashboardCases,
      gettingDataDashboardCases,
      dataDashboardQuot,
      gettingDataDashboardQuot,
    } = this.props;

    return (
      <div className="dashboard container">
        <HeaderStatitsics
          title="Casos"
          onChange={this.onChangeCasesPeriod}
          onClickExport={this.onClickExportCases}
          fromDate={this.state.fromDateCase}
          toDate={this.state.toDateCase}
          disable={gettingDataDashboardCases}
          onClickConsolte={this.onClickConsolte('cases')}
        />
        <CasesStatitsics body={dataDashboardCases} />
        <HeaderStatitsics
          title="Cotizaciones"
          onChange={this.onChangeQuotationPeriod}
          onClickExport={this.onClickExportQuotation}
          fromDate={this.state.fromDateQuotation}
          toDate={this.state.toDateQuotation}
          disable={gettingDataDashboardQuot}
          onClickConsolte={this.onClickConsolte('quotations')}
        />
        <QuotationsStatitsics body={dataDashboardQuot} />
      </div>
    );
  }
}

const mapStateToProps = ({ cases, quotations }) => ({
  gettingDataDashboardCases: cases.gettingDataDashboard,
  dataDashboardCases: cases.dataDashboard,
  dataDashboardQuot: quotations.dataDashboard,
  gettingDataDashboardQuot: quotations.gettingDataDashboard,
});

const mapDispatchToProps = {
  changeTitleAction,
  setTitle: changeTitleAction,
  getAllCasesDashboard,
  getAllQuotationsDashboard,
  getCaseDataExport,
  getQuotationDataExport,
};
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(MiPanelContent);
