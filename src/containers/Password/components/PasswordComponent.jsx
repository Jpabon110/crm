/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-has-content */
import React, { Component } from 'react';
import {
  Card, CardBody, Col, Row, FormGroup, Button, Label, Input, ButtonToolbar,
} from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { changePassword } from '../../../redux/actions/userActions';
import BasicNotification from '../../../shared/components/Notifications/BasicNotification';

class MicuentaContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPassword: '',
      newPassword: '',
      confirm: '',
    };
  }


  onClickAction = (action, item) => () => {
    switch (action) {
      case 'delete':
        this.deleteUser(item);
        break;
      case 'update':
        this.uploadUser(item);
        break;
      default:
        break;
    }
  }

  onChangeInput = key => (e) => {
    if (key === 'avatar') {
      this.setState({ [key]: e });
    } else if (key === 'roles') {
      this.setState({ [key]: e });
    } else {
      this.setState({ [key]: e.target.value });
    }
  }

  changePassword = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirm } = this.state;
    if (newPassword.length < 8) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe ingresar una contraseña con mínimo 8 caracteres.',
      });
    } else if (newPassword === confirm) {
      this.props.changePassword({ currentPassword, newPassword }, () => {
        this.setState({ currentPassword: '', newPassword: '', confirm: '' });
      });
    } else {
      BasicNotification.error('Las contraseñas nuevas no coinciden');
    }
  }

  getSrc = (avatar) => {
    if (avatar) {
      if (typeof avatar === 'string') {
        return avatar;
      }

      if (avatar.temp) {
        return avatar.temp;
      }
    }
    return '';
  }

  translateRol = (rol) => {
    switch (rol) {
      case 'admin':
        return 'Administrador';
      case 'manager':
        return 'Manager';
      case 'exceutive':
        return 'Ejecutivo DEC';
      default:
        return rol;
    }
  }

  translateRoles = roles => roles.map(rol => ({ value: rol, label: this.translateRol(rol) }))


  render() {
    const {
      currentPassword,
      newPassword,
      confirm,
    } = this.state;
    return (
      <div className="dashboard container profile_centralize">
        <Col md={6} lg={6} xl={6}>
          <Card>
            <CardBody>
              <div className="modal__header">
                <h2 className="bold-text label_autofin  modal__title"> <strong>Cambiar contraseña</strong></h2>
              </div>
              <div className="modal__body">
                <Col md={12} lg={12}>
                  <form className="form form--horizontal" onSubmit={this.changePassword}>
                    <Row className="row_center">
                      <div className="everlast">
                        <div>
                          <Col md="12">
                            <FormGroup>
                              <Label className="label_autofin" for="currentPassword">Contraseña actual:</Label>
                              <Input
                                type="password"
                                name="currentPassword"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={this.onChangeInput('currentPassword')}
                                required
                              />
                            </FormGroup>
                          </Col>
                          <Col md="12">
                            <FormGroup>
                              <Label className="label_autofin" for="newPassword">Nueva contrseña:</Label>
                              <Input
                                type="password"
                                name="newPassword"
                                id="newPassword"
                                value={newPassword}
                                onChange={this.onChangeInput('newPassword')}
                                required
                              />
                            </FormGroup>
                          </Col>
                          <Col md="12">
                            <FormGroup className="form__form-group-input">
                              <Label className="label_autofin" for="confirm">Confirmar contraseña</Label>
                              <Input
                                type="password"
                                name="confirm"
                                id="confirm"
                                value={confirm}
                                onChange={this.onChangeInput('confirm')}
                                required
                              />
                            </FormGroup>
                          </Col>
                        </div>
                      </div>
                    </Row>
                    <ButtonToolbar className="modal__footer">
                      <Link className="asignar btn_pass" to="/micuenta">Cancel</Link>
                      <Button
                        className="asignar just_this"
                        type="submit"
                      >Guardar
                      </Button>
                      <Button
                        className="btn black_resize_button account__btn account__btn--small"
                        id="loader"
                        type="button"
                        style={{ display: 'none' }}
                        disabled
                      />
                    </ButtonToolbar>
                  </form>
                </Col>
              </div>
            </CardBody>
          </Card>
        </Col>
      </div>
    );
  }
}

const mapDispatchToProps = {
  changePassword,
};

export default connect(null, mapDispatchToProps)(MicuentaContent);
