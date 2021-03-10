/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-plusplus */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
// import jwtDecode from 'jwt-decode';
import {
  Card, CardBody,
} from 'reactstrap';
import { connect } from 'react-redux';
import QueryString from 'query-string';
import moment from 'moment';
import {
  getAllQuotations,
  getAllQuotationsMe,
  getQuotationsSummary,
} from '../../../redux/actions/quotationsActions';
import { isUserAllowed } from '../../../shared/utils';
import {
  getMe,
} from '../../../redux/actions/userActions';
import { changeTitleAction } from '../../../redux/actions/topbarActions';
import CaseList from './CotizacionesList';
import CotizacionesFilterHead from './CotizacionesFilterHead';

const monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
const monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');
moment.locale('es', {
  months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
  monthsShort(m, format) {
    if (/-MMM-/.test(format)) {
      return monthsShort[m.month()];
    }
    return monthsShortDot[m.month()];
  },
  weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
  weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
  weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sá'.split('_'),
  longDateFormat: {
    LLLL: 'dddd, D [de] MMMM [de] YYYY',
  },
});

class MiPanelContent extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount() {
    this.props.setTitle('Cotizaciones');

    this.props.getMe();
    this.props.getQuotationsSummary({ onlyNotClosed: true });

    // const isAdmin = isUserAllowed('admin');
    // // console.log(isAdmin);

    // if (isAdmin) {
    //   this.props.getAllQuotations();
    // } else {
    //   this.props.getAllQuotationsMe();
    // }
  }

  componentWillUnmount() {
    this.props.setTitle('');
  }

  toFilter = status => () => {
    const dataToFilter = {
      status,
      onlyNotClosed: false,
    };

    const ToFilterFormAnsweredData = {
      formAnswered: true,
      onlyNotClosed: true,
    };
    let query = QueryString.parse(this.props.location.search);

    if (query.limit) {
      const aux = { limit: query.limit };
      query = {};
      Object.assign(query, aux);
    } else {
      query = {};
    }

    if (status !== 'all') {
      if (status !== 'formAnswered') {
        Object.assign(query, dataToFilter);
      } else {
        Object.assign(query, ToFilterFormAnsweredData);
      }
    } else {
      Object.assign(query, { onlyNotClosed: false });
    }

    if (this.quotationListRef) {
      this.quotationListRef.setPage(0);
    }

    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');

    if (isAdmin) {
      this.props.getAllQuotations(query, () => {
        this.props.history.push(`/cotizaciones?${QueryString.stringify(query)}`);
      });
    } else {
      this.props.getAllQuotationsMe(query, () => {
        this.props.history.push(`/cotizaciones?${QueryString.stringify(query)}`);
      });
    }
  }

  calculateDate = (Quotations) => {
    const data = {
      tcVar: 0,
    };
    for (let index = 0; index < Quotations.length; index + 1) {
      data.tcVar++;
    }
    return data;
  }

  setQuotationListRef = (e) => {
    this.quotationListRef = e;
  };

  render() {
    const {
      summary,
    } = this.props;

    // const { avatar, firstName, lastName } = this.props.currentUser;
    const { firstName, lastName } = this.props.currentUser;

    return (
      <div className="dashboard container">
        <Card className="cardo_botton">
          <CardBody style={{ padding: '0px 10px' }}>
            <div className="profile_casos card" style={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              <div className="compacted col-md-3">
                {/* <div className="profile_avatar">
                  <img src={avatar || avatarDefault} alt="avatar" />
                </div> */}
                <div className="profile_info">
                  <h5>{moment().lang('es').format('LLLL')}</h5>
                  <h3>Hola, {`${firstName} ${lastName}`}</h3>
                  <h3> <strong>Que tengas un buen día</strong></h3>
                </div>
              </div>
              {/* <div className="profile_info col-md-9"> */}
              <div className="profile_info col-md-6">
                <h5>Tu resumen</h5>
                <div className="profile_info_calls">
                  <CotizacionesFilterHead
                    title="Formularios recibidos"
                    summary={(summary) && (summary.formAnswered) && summary.formAnswered}
                    filter="formAnswered"
                    toFilter={this.toFilter}
                  />

                  <CotizacionesFilterHead
                    title="Pendientes"
                    summary={(summary) && (summary.pending) && summary.pending}
                    filter="pending"
                    toFilter={this.toFilter}
                  />

                  <CotizacionesFilterHead
                    title="Abiertas"
                    summary={(summary) && (summary.open) && summary.open}
                    filter="opened"
                    toFilter={this.toFilter}
                  />

                  <CotizacionesFilterHead
                    title="Cerradas"
                    summary={(summary) && (summary.closed) && summary.closed}
                    filter="closed"
                    toFilter={this.toFilter}
                  />

                  {/* <CotizacionesFilterHead
                    title="Aprobadas"
                    summary={(summary) && (summary.pending) && summary.pending}
                    filter="pending"
                    toFilter={this.toFilter}
                  />
                  <CotizacionesFilterHead
                    title="Rechazadas"
                    summary={(summary) && (summary.pending) && summary.pending}
                    filter="pending"
                    toFilter={this.toFilter}
                  />
                  <CotizacionesFilterHead
                    title="Curses / Precurses"
                    summary={(summary) && (summary.pending) && summary.pending}
                    filter="pending"
                    toFilter={this.toFilter}
                  /> */}
                  <CotizacionesFilterHead
                    title="Total"
                    summary={(summary) && (summary.total) && summary.total}
                    filter="all"
                    toFilter={this.toFilter}
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        <CaseList ref={this.setQuotationListRef} history={this.props.history} location={this.props.location} />
      </div>
    );
  }
}
const mapStateToProps = ({ quotations, users }) => ({
  allQuotations: quotations.allQuotations,
  summary: quotations.summary,
  currentUser: users.currentUser,
});

const mapDispatchToProps = {
  getAllQuotations,
  getMe,
  getQuotationsSummary,
  getAllQuotationsMe,
  setTitle: changeTitleAction,
};
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(MiPanelContent);
