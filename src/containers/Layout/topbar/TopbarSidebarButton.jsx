import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';

// const icon = `${process.env.PUBLIC_URL}/img/burger.svg`;
const icon = '';

class TopbarSidebarButton extends PureComponent {
  static propTypes = {
    changeMobileSidebarVisibility: PropTypes.func.isRequired,
    changeSidebarVisibility: PropTypes.func.isRequired,
  };

  render() {
    const { changeMobileSidebarVisibility, changeSidebarVisibility } = this.props;

    return (
      <div>
        <button type="button" className="topbar__button topbar__button--desktop" onClick={changeSidebarVisibility}>
          <img src={icon} alt="" className="topbar__button-icon topbar__logo" />
          {/* <Link className="topbar__logo" to="/dashboard_default" /> */}
        </button>
        <button type="button" className="topbar__button topbar__button--mobile" onClick={changeMobileSidebarVisibility}>
          <img src={icon} alt="" className="topbar__button-icon topbar__logo" />
        </button>
      </div>
    );
  }
}

export default TopbarSidebarButton;
