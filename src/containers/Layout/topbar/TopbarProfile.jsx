/* eslint-disable react/prop-types */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { PureComponent } from 'react';
// import jwtDecode from 'jwt-decode';
import DownIcon from 'mdi-react/ChevronDownIcon';
import { connect } from 'react-redux';
import { Collapse } from 'reactstrap';
import avatarDefault from '../../../shared/img/avatar-default.jpg';
import {
  getMe,
} from '../../../redux/actions/userActions';
import TopbarMenuLink from './TopbarMenuLink';

class TopbarProfile extends PureComponent {
  constructor() {
    super();
    this.state = {
      collapse: false,
    };
  }

  componentDidMount() {
    this.props.getMe();
  }

  toggle = () => {
    this.setState(prevState => ({ collapse: !prevState.collapse }));
  };

  onClick = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }

  render() {
    const { collapse } = this.state;
    const { currentUser } = this.props;
    const { avatar = '', firstName = '', lastName = '' } = currentUser || {};
    const name = `${firstName} ${lastName}`;

    return (
      <div className="topbar__profile">
        <button type="button" className="topbar__avatar" onClick={this.toggle}>
          <img className="topbar__avatar-img" src={avatar || avatarDefault} alt="avatar" />
          {/* <p className="topbar__avatar-name" /> */}
          <DownIcon className="topbar__icon" />
        </button>
        {collapse && <button type="button" className="topbar__back" onClick={this.toggle} />}
        <Collapse isOpen={collapse} className="topbar__menu-wrap">
          <div className="topbar__menu">
            <TopbarMenuLink title={name} icon="" />
            <TopbarMenuLink title="Mi cuenta" icon="" path="/micuenta" />
            <TopbarMenuLink title="Cambiar contraseña" icon="" path="/password" />
            <a className="topbar__link" href="javascript:void(0);" onClick={this.onClick}>
              <span className="topbar__link-icon" />
              <p className="topbar__link-title">Cerrar sesión</p>
            </a>
          </div>
        </Collapse>
      </div>
    );
  }
}

const mapStateToProps = ({ users }) => ({
  currentUser: users.currentUser,
});

const mapDispatchToProps = {
  getMe,
};

export default connect(mapStateToProps, mapDispatchToProps)(TopbarProfile);
