/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import { Link, Redirect } from 'react-router-dom';
import superagent from 'superagent';
import toLower from 'lodash/toLower';
import logo from '../../../shared/img/logo/Autofin_logo.png';
import { setToken } from '../../../helper/Agent';
import BasicNotification from '../../../shared/components/Notifications/BasicNotification';

class LogInForm extends PureComponent {
  state = {
    email: '',
    password: '',
    showPassword: false,
  };

  showPassword = (e) => {
    e.preventDefault();
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    document.getElementById('start').style.display = 'none';
    document.getElementById('loader').style.display = 'block';
    const { email, password } = this.state;
    const { history } = this.props;
    const REACT_APP_API_URI = process.env.REACT_APP_API_ROOT;
    try {
      const { body } = await superagent
        .post(`${REACT_APP_API_URI}/sign-in`)
        .send({ email: toLower(email.trim()), password })
        .set('Accept', 'application/json');
      const { accessToken, refreshToken } = body;
      window.localStorage.setItem('accessToken', accessToken);
      window.localStorage.setItem('refreshToken', refreshToken);
      BasicNotification.info('Bienvenido a Autofin CRM');
      setToken(accessToken);
      history.push('/');
    } catch (error) {
      if (error.status === 400) {
        BasicNotification.error('Las credenciales son incorrectas');
        document.getElementById('start').style.display = 'block';
        document.getElementById('loader').style.display = 'none';
      } else {
        BasicNotification.error('Ocurrió un error mientras se realizaba la operación.');
        document.getElementById('start').style.display = 'block';
        document.getElementById('loader').style.display = 'none';
      }
    }
  }

  onChange = key => (e) => {
    this.setState({ [key]: e.target.value });
  }

  render() {
    const { showPassword, email, password } = this.state;
    if (localStorage.getItem('accessToken')) {
      return <Redirect to="/" />;
    }
    return (
      <form className="form" onSubmit={this.handleSubmit}>
        <img src={logo} alt="" />
        <div className="form__form-group">
          <span className="label_autofin">Usuario</span>
          <div className="form__form-group-input">
            <input
              name="name"
              component="input"
              type="text"
              placeholder="Usuario"
              value={email}
              onChange={this.onChange('email')}
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="label_autofin">Contraseña</span>
          <div className="form__form-group-input">
            <input
              name="password"
              component="input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={this.onChange('password')}
            />
          </div>
        </div>
        {/* <Link
          id="start"
          className="btn black_resize_button account__btn account__btn--small"
          onClick={this.handleSubmit}
          to="/pages/one"
        >
          Ingresar
        </Link> */}
        <button
          className="btn black_resize_button account__btn account__btn--small"
          id="start"
          type="submit"
        >
          Ingresar
        </button>
        <button
          className="btn black_resize_button account__btn account__btn--small"
          id="loader"
          type="button"
          style={{ display: 'none' }}
          disabled
        >
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          <span className="sr-only">Loading...</span>
        </button>
        <Link className="forgotten_p" to={`/forgoten?email=${email}`}>
          ¿Olvidaste tu contraseña?
        </Link>
      </form>
    );
  }
}

export default LogInForm;
