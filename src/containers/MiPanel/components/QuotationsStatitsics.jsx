/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  PieChart, Pie, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import PropTypes from 'prop-types';
import Panel from '../../../shared/components/Panel';

class QuotationsStatisticsComponet extends Component {
  constructor() {
    super();
    this.state = {
      // name: '',
    };
  }

  componentDidMount() {
    // this.setState({ name: this.props.name });
  }


  render() {
    const { body } = this.props;

    const tipo = [{ name: `auto ${body.types ? body.types.auto : 0}`, value: body.types ? body.types.auto : 100, fill: '#4ce1b6' },
      { name: `moto ${body.types ? body.types.moto : 0}`, value: body.types ? body.types.moto : 100, fill: '#70bbfd' }];

    const estado = [{ name: `Cerrado ${body.status ? body.status.closed : 0}`, value: body.status ? body.status.closed : 100, fill: '#4ce1b6' },
      { name: `Abierto ${body.status ? body.status.opened : 0}`, value: body.status ? body.status.opened : 100, fill: '#70bbfd' },
      { name: `Pendiente ${body.status ? body.status.pending : 0}`, value: body.status ? body.status.pending : 100, fill: '#ff4861' }];

    const origen = [{ name: `Web ${body.origins ? body.origins.web : 0}`, value: body.origins ? body.origins.web : 100, fill: '#4ce1b6' },
      { name: `Presencial ${body.origins ? body.origins.face : 0}`, value: body.origins ? body.origins.face : 100, fill: '#70bbfd' },
      { name: `Telefono ${body.origins ? body.origins.phone : 0}`, value: body.origins ? body.origins.phone : 100, fill: '#f6da6e' },
      { name: `Referido ${body.origins ? body.origins.referred : 0}`, value: body.origins ? body.origins.referred : 100, fill: '#ff4861' }];

    const style = {
      left: 0,
      width: 150,
      lineHeight: '24px',
      position: 'relative',
    };

    const renderLegend = ({ payload }) => (
      <ul className="dashboard__chart-legend">
        {
          payload.map((entry, index) => (
            <li key={`item-${index}`}><span style={{ backgroundColor: entry.color }} />{entry.value}</li>
          ))
        }
      </ul>
    );

    renderLegend.propTypes = {
      payload: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string,
        vslue: PropTypes.string,
      })).isRequired,
    };
    return (
      <div className="row">
        <Panel
          lg={6}
          md={6}
          xl={3}
          title="ESTADO"
          subhead="Total"
        >
          <div className="dashboard__visitors-chart">
            <h1 className="dashboard__visitors-chart-title">{ body.status ? (body.status.closed + body.status.opened + body.status.pending) : 0 }</h1>
            {/* <p className="dashboard__visitors-chart-number">12,384</p> */}
            <ResponsiveContainer className="dashboard__chart-pie" width="100%" height={220}>
              <PieChart className="dashboard__chart-pie-container">
                <Tooltip />
                <Pie data={estado} dataKey="value" cy={110} innerRadius={70} outerRadius={100} />
                <Legend layout="vertical" verticalAlign="bottom" wrapperStyle={style} content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel
          lg={6}
          md={6}
          xl={3}
          title="ORIGEN"
          subhead="Total"
        >
          <div className="dashboard__visitors-chart">
            <h1 className="dashboard__visitors-chart-title">{ body.origins ? (body.origins.face + body.origins.referred + body.origins.phone + body.origins.web + body.origins.trinidad) : 0 }</h1>
            {/* <p className="dashboard__visitors-chart-number">12,384</p> */}
            <ResponsiveContainer className="dashboard__chart-pie" width="100%" height={220}>
              <PieChart className="dashboard__chart-pie-container">
                <Tooltip />
                <Pie data={origen} dataKey="value" cy={110} innerRadius={70} outerRadius={100} />
                <Legend layout="vertical" verticalAlign="bottom" wrapperStyle={style} content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel
          lg={6}
          md={6}
          xl={3}
          title="TIPOS"
          subhead="Total"
        >
          <div className="dashboard__visitors-chart">
            <h1 className="dashboard__visitors-chart-title">{ body.types ? (body.types.auto + body.types.moto) : 0 }</h1>
            {/* <p className="dashboard__visitors-chart-number">12,384</p> */}
            <ResponsiveContainer className="dashboard__chart-pie" width="100%" height={220}>
              <PieChart className="dashboard__chart-pie-container">
                <Tooltip />
                <Pie data={tipo} dataKey="value" cy={110} innerRadius={70} outerRadius={100} />
                <Legend layout="vertical" verticalAlign="bottom" wrapperStyle={style} content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    );
  }
}

export default QuotationsStatisticsComponet;
