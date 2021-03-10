/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import React, { PureComponent } from 'react';
// import { Field, reduxForm } from 'redux-form';
// import EyeIcon from 'mdi-react/EyeIcon';
// import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
// import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { connect } from 'react-redux';
import {
  restPassword,
} from '../../../redux/actions/authAction';
// import PropTypes from 'prop-types';
import logo from '../../../shared/img/logo/Autofin_logo.png';
// import renderCheckBoxField from '../../../shared/components/form/CheckBox';
import BasicNotification from '../../../shared/components/Notifications/BasicNotification';

class ForgotenForm extends PureComponent {
  constructor() {
    super();
    this.state = {
      email: '',
    };
  }

  componentDidMount() {
    const values = queryString.parse(this.props.location.search);
    if (values.email) {
      this.setState({ email: values.email.trim() });
    }
  }

  onChange = (e) => {
    this.setState({ email: e.target.value.trim() });
  }

  onSubmit = (e) => {
    e.preventDefault();
    const {
      email,
    } = this.state;
    if (!email) {
      BasicNotification.error('Debe ingresar el email.');
      return;
    }
    this.props.restPassword({ email }, () => {
      this.setState({ email: '' });
    });
  }

  render() {
    const { email } = this.state;

    return (
      <form className="form" onSubmit={this.onSubmit}>
        <img src={logo} alt="" />
        <div className="form__form-group-forgotten">
          <span className="label_autofin">Ingresar email</span>
          <input
            email="email"
            component="input"
            type="text"
            placeholder="Email"
            onChange={this.onChange}
            required
            value={email}
          />
          <p className="label_autofin" style={{ color: '#666666' }}>Porfavor ingresa tu email y enviaremos una nueva contraseña.</p>
          <div className="footerForgotten">
            <button className="btn black_resize_button account__btn account__btn--small" type="submit">
              Enviar
            </button>
            <div className="forgotten_p_a">
              <Link style={{ color: '#666666' }} to="/">
                volver a inicio de sesion
              </Link>
            </div>

          </div>
        </div>
      </form>
    );
  }
}

const mapDispatchToProps = {
  restPassword,
};

export default connect(null, mapDispatchToProps, null, { forwardRef: true })(ForgotenForm);
