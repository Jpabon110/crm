/* eslint-disable react/prop-types */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import SidebarLink from './SidebarLink';
import DefaultTabsBorderedBottom from './DefaultTabsBorderedBottom';

class UsuariosContent extends Component {
  hideSidebar = () => {
    // const { onClick } = this.props;
    // onClick();
  };

  render() {
    return (
      <div className="dashboard container">
        <DefaultTabsBorderedBottom
          {...this.props}
        />
      </div>
    );
  }
}

export default UsuariosContent;
