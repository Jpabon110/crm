/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-plusplus */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
// import jwtDecode from 'jwt-decode';
import { connect } from 'react-redux';

class CotizacionesFilterHeadComponent extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    const {
      summary,
      title,
      filter,
      toFilter,
    } = this.props;

    return (
      <div className="profile_info" onClick={toFilter(filter)} style={{ cursor: 'pointer' }}>
        {/* <h1> <strong>{instalment.tcVar}</strong> </h1> */}
        <h1>
          <strong>
            {summary || 0}
          </strong>
        </h1>
        <h5> <strong>{title}</strong></h5>
      </div>
    );
  }
}

export default connect(null, null, null, { forwardRef: true })(CotizacionesFilterHeadComponent);
