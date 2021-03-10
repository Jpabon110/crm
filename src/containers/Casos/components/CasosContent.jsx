/* eslint-disable jsx-a11y/no-static-element-interactions */
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
  getAllCases,
  getCaseSummary,
  getAllCasesMe,
} from '../../../redux/actions/casesActions';
import { isUserAllowed } from '../../../shared/utils';
// import avatarDefault from '../../../shared/img/avatar-default.jpg';
import {
  getMe,
} from '../../../redux/actions/userActions';
// import { isUserAllowed } from '../../../shared/utils';
import { changeTitleAction } from '../../../redux/actions/topbarActions';
import CaseList from './CaseList';

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
    this.props.setTitle('Casos');
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.props.getMe();
      this.props.getCaseSummary();
      // const { user } = jwtDecode(token);
      // const { avatar, firstName, lastName } = user;
      // this.setState({ avatar, name: `${firstName} ${lastName}` });
      // const isAdmin = isUserAllowed('admin');
      // console.log(isAdmin);

      // if (isAdmin) {
      //   this.props.getAllCases();
      // } else {
      //   this.props.getAllCasesMe();
      // }
    }
  }

  componentWillUnmount() {
    this.props.setTitle('');
  }

  toFilter = status => () => {
    let dataToFilter = {};

    let query = QueryString.parse(this.props.location.search);

    if (query.limit) {
      const aux = { limit: query.limit };
      query = {};
      Object.assign(query, aux);
    } else {
      query = {};
    }

    if (status === 'all') {
      Object.assign(query, { onlyNotClosed: false });
    } else if ((status === 'opened') || (status === 'pending')) {
      dataToFilter = { status, onlyNotClosed: true };
      Object.assign(query, dataToFilter);
    } else if ((status === 'out') || (status === 'within')) {
      dataToFilter = { term: status, onlyNotClosed: true };
      Object.assign(query, dataToFilter);
    } else if (status === 'closed') {
      dataToFilter = { status, onlyNotClosed: false };
      Object.assign(query, dataToFilter);
    }

    if (this.caseListRef) {
      this.caseListRef.setPage(0);
    }

    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');

    if (isAdmin) {
      this.props.getAllCases(query, () => {
        this.props.history.push(`/casos?${QueryString.stringify(query)}`);
      });
    } else {
      this.props.getAllCasesMe(query, () => {
        this.props.history.push(`/casos?${QueryString.stringify(query)}`);
      });
    }
  }


  calculateDate = (cases) => {
    const data = {
      dpVar: 0,
      fpVar: 0,
      vhVar: 0,
    };
    for (let index = 0; index < cases.length; index++) {
      // console.log(cases[index].commitmentDate);
      if (moment().isAfter(cases[index].commitmentDate)) {
        data.fpVar++;
      } else {
        data.dpVar++;
      }
      if (moment().isSame(cases[index].commitmentDate)) {
        data.vhVar++;
      }
    }
    return data;
  }

  setCaseListRef = (e) => {
    this.caseListRef = e;
  };

  render() {
    const { summary } = this.props;
    // const { avatar, firstName, lastName } = this.props.currentUser;
    const { firstName, lastName } = this.props.currentUser;
    // let instalment = null;

    // instalment = this.calculateDate(allCases);
    return (
      <div className="dashboard container">
        <Card className="cardo_botton">
          <CardBody style={{ padding: '0px 10px' }}>
            <div className="profile_casos card" style={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              <div className="compacted col-md-5">
                {/* <div className="profile_avatar">
                  <img src={avatar || avatarDefault} alt="avatar" />
                </div> */}
                <div className="profile_info col-md-8">
                  <h5>{moment().lang('es').format('LLLL')}</h5>
                  <h3>Hola, {`${firstName} ${lastName}`}</h3>
                  <h3> <strong>Que tengas un buen día</strong></h3>
                </div>
              </div>
              <div className="profile_info col-md-7">
                <h5>Tu resumen</h5>
                <div className="profile_info_calls">
                  <div className="profile_info" onClick={this.toFilter('within')} style={{ cursor: 'pointer' }}>
                    <h1> <strong>{(summary) && (summary.withinTerm) && summary.withinTerm}</strong> </h1>
                    <h5> <strong>Dentro de plazo</strong></h5>
                  </div>
                  <div className="profile_info" onClick={this.toFilter('out')} style={{ cursor: 'pointer' }}>
                    <h1> <strong>{(summary) && (summary.OutTerm) && summary.OutTerm}</strong> </h1>
                    <h5> <strong>Fuera de plazo</strong></h5>
                  </div>
                  <div className="profile_info" onClick={this.toFilter('pending')} style={{ cursor: 'pointer' }}>
                    <h1> <strong>{(summary) && (summary.pending) && summary.pending}</strong> </h1>
                    <h5> <strong>Pendientes</strong></h5>
                  </div>
                  <div className="profile_info" onClick={this.toFilter('opened')} style={{ cursor: 'pointer' }}>
                    <h1> <strong>{(summary) && (summary.open) && summary.open}</strong> </h1>
                    <h5> <strong>Abiertos</strong></h5>
                  </div>
                  <div className="profile_info" onClick={this.toFilter('closed')} style={{ cursor: 'pointer' }}>
                    <h1> <strong>{(summary) && (summary.closed) && summary.closed}</strong> </h1>
                    <h5> <strong>Cerrados</strong></h5>
                  </div>
                  <div className="profile_info" onClick={this.toFilter('all')} style={{ cursor: 'pointer' }}>
                    <h1> <strong>{(summary) && (summary.total) && summary.total}</strong> </h1>
                    <h5> <strong>Total</strong></h5>
                  </div>
                  {/* <div className="profile_info">
                    <h1> <strong>{instalment.vhVar}</strong> </h1>
                    <h5> <strong>Vencen hoy</strong></h5>
                  </div> */}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        <CaseList ref={this.setCaseListRef} history={this.props.history} location={this.props.location} />
      </div>
    );
  }
}

const mapStateToProps = ({ cases, users }) => ({
  allCases: cases.allCases,
  summary: cases.summary,
  currentUser: users.currentUser,
});


const mapDispatchToProps = {
  getAllCases,
  getMe,
  getCaseSummary,
  getAllCasesMe,
  setTitle: changeTitleAction,
};
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(MiPanelContent);

// const mapDispatchToProps = dispatch => ({
//   setTitle: (title) => {
//     dispatch(changeTitleAction(title));
//   },
// });
// export default connect(null, mapDispatchToProps)(MiPanelContent);
