/* eslint-disable react/button-has-type */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Col, Button, ButtonToolbar, Label, Input, Row, FormGroup, Modal,
} from 'reactstrap';
import toLower from 'lodash/toLower';
import Select from 'react-select';
import RUTJS from 'rutjs';
import map from 'lodash/map';
import {
  getSignature,
  uploadAvatar,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../../redux/actions/userActions';
import avatarDefault from '../img/avatar-default.jpg';
import {
  getRoles,
} from '../../redux/actions/resourcesActions';
import BasicNotification from './Notifications/BasicNotification';

class ModalComponent extends Component {
  static defaultProps = {
    title: '',
    message: '',
    colored: false,
    header: false,
    selectedOption: null,
  };

  constructor() {
    super();
    this.state = {
      _id: null,
      modal: false,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      anexo: '',
      rut: '',
      rolesOptions: [],
      roles: [],
      avatar: '',
      status: true,
    };
    this.inputFile = React.createRef();
  }

  componentDidMount() {
    this.props.getRoles({ all: true }, (body) => {
      this.setState({ rolesOptions: map(body, role => ({ value: role, label: this.translateRol(role) })) });
    });
    // this.setState({ users: map(body, user => ({ value: user._id, label: `${user.firstName} ${user.lastName}` })) });
  }

  toggle = isOk => () => {
    this.setState({ modal: false });
    if (this.props.onClose) {
      this.props.onClose(isOk);
    }
  }

  onChangeInput = key => (e) => {
    if (key === 'status') {
      this.setState({ status: e && e.value === 'true' });
    } else if (key === 'rut') {
      this.setState({ [key]: e.target.value });
    } else if (key === 'avatar') {
      this.setState({ [key]: e });
    } else if (key === 'roles') {
      this.setState({ [key]: e });
    } else if (key === 'email') {
      this.setState({ [key]: toLower(e.target.value) });
    } else if (key === 'anexo') {
      const justNumbers = e.target.value.replace(/[^0-9\s]/gi, '').trim();
      this.setState({ [key]: justNumbers });
    } else {
      this.setState({ [key]: e.target.value });
    }
  }

  onChangeImg = () => {
    if (this.inputFile) {
      this.inputFile.current.click();
    }
  }

  onChangeInputFile = (event) => {
    this.renderFile(event.target.files[0], (image) => {
      this.onChangeInput('avatar')(image);
    });
  }

  renderFile = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const photo = {
        file,
        temp: event.target.result,
      };
      callback(photo);
    };
    reader.onerror = () => {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: `Ocurrio un error al intentar cargar la imágen ${file.name}`,
      });
    };
    reader.readAsDataURL(file);
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
    return avatarDefault;
  }

  isRUTValid = (rut) => {
    if (!rut) return true;
    return (new RUTJS(rut)).isValid;
  }

  onSubmit = (e) => {
    e.preventDefault();
    const {
      _id,
      firstName,
      lastName,
      email,
      password,
      anexo,
      rut,
      roles,
      avatar,
      status,
    } = this.state;

    if (!this.isRUTValid(rut)) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe ingresar un RUT válido.',
      });
      return;
    }

    if (!_id && password.length < 8) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe ingresar una contraseña con mínimo 8 caracteres.',
      });
      return;
    }

    if (!_id && roles.length === 0) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Se debe ingresar al menos un rol.',
      });
      return;
    }

    if (avatar.file) {
      this.props.getSignature(avatar.file.name, (body) => {
        this.props.uploadAvatar({ ...body, file: avatar.file }, (data) => {
          this.sendData({
            _id,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            password,
            anexo,
            rut,
            roles: this.resolveRoles(roles),
            avatar: data.secure_url,
            status,
          });
        });
      });
      // const { body } = await Users.getSignature(avatar.file.name);
    } else {
      this.sendData({
        _id,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        anexo,
        rut,
        roles: this.resolveRoles(roles),
        avatar,
        status,
      });
    }
  }

  resolveRoles = roles => roles.map(rol => rol.value || rol)

  sendData = (data) => {
    if (!data._id) {
      delete data._id;
      this.props.createUser(data, () => {
        this.toggle(true)();
      });
    } else {
      this.props.updateUser(data._id, data, () => {
        this.toggle(true)();
      });
    }
  }

  showModal = () => {
    this.setState({ modal: true });
  }

  translateRol = (rol) => {
    switch (rol) {
      case 'admin':
        return 'Administrador';
      case 'manager':
        return 'Manager';
      case 'dec-executive':
        return 'Ejecutivo DEC';
      case 'sales-executive':
        return 'Ejecutivo Ventas';
      default:
        return rol;
    }
  }

  translateRoles = roles => roles.map(rol => ({ value: rol, label: this.translateRol(rol) }))

  setData = (data) => {
    this.setState({ ...data, roles: this.translateRoles(data.roles) });
  }

  render() {
    const {
      _id, modal, firstName, lastName, email, password, anexo, rut, roles, avatar, status,
    } = this.state;
    const statusOptions = [
      { value: 'true', label: 'Activo' },
      { value: 'false', label: 'Inactivo' },
    ];
    const statusSelected = status === true ? statusOptions[0] : statusOptions[1];
    return (
      <div>
        <Modal
          isOpen={modal || this.props.isOpen}
          toggle={this.toggle()}
          className="modal-dialog modal-dialog--header"
        >
          <div className="modal__header">
            <button className="lnr lnr-cross modal__close-btn" type="button" onClick={this.toggle()} />
            <h2 className="bold-text label_autofin  modal__title"> <strong>{this.props.title}</strong></h2>
          </div>
          <div className="modal__body">
            <Col md={12} lg={12}>
              <form className="form form--horizontal" onSubmit={this.onSubmit}>
                <Row className="row_center">
                  <div className="everlast">
                    <div>
                      <Col md="12">
                        <FormGroup className="centralize_avatar">
                          <Label className="label_autofin" for="avatar">Foto perfil:</Label>
                          <img
                            className="topbar__avatar-img for_user"
                            src={this.getSrc(avatar)}
                            alt="avatar"
                          />
                          <FormGroup className="element_center_file">
                            <Button
                              className="asignar"
                              onClick={this.onChangeImg}
                            >Cambiar
                            </Button>
                            <input
                              type="file"
                              ref={this.inputFile}
                              onChange={this.onChangeInputFile}
                              hidden
                            />
                          </FormGroup>
                        </FormGroup>
                      </Col>
                    </div>
                    <div>
                      <Col md="12">
                        <FormGroup className="form__form-group-input">
                          <Label className="label_autofin" for="firstName">Nombre:</Label>
                          <Input
                            className="new_size"
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={firstName}
                            onChange={this.onChangeInput('firstName')}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup>
                          <Label className="label_autofin" for="lastName">Apellido:</Label>
                          <Input
                            className="new_size"
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={lastName}
                            onChange={this.onChangeInput('lastName')}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup>
                          <Label className="label_autofin" for="email">Email:</Label>
                          <Input
                            className="new_size"
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={this.onChangeInput('email')}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup>
                          <Label className="label_autofin" for="password">Contraseña:</Label>
                          <Input
                            className="new_size"
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            disabled={_id}
                            onChange={this.onChangeInput('password')}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup>
                          <Label className="label_autofin" for="rut">Rut:</Label>
                          <Input
                            type="text"
                            name="rut"
                            id="rut"
                            value={rut}
                            onChange={this.onChangeInput('rut')}
                            invalid={!this.isRUTValid(rut)}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup>
                          <Label className="label_autofin" for="anexo">Anexo:</Label>
                          <Input
                            type="text"
                            name="anexo"
                            id="anexo"
                            value={anexo}
                            onChange={this.onChangeInput('anexo')}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup>
                          <Label className="label_autofin" for="role">Roles:</Label>
                          <Select
                            onChange={this.onChangeInput('roles')}
                            options={this.state.rolesOptions}
                            isMulti={this.state.rolesOptions}
                            value={roles}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup>
                          <Label className="label_autofin" for="role">Estatus:</Label>
                          <Select
                            onChange={this.onChangeInput('status')}
                            options={statusOptions}
                            value={statusSelected}
                          />
                        </FormGroup>
                      </Col>
                    </div>
                  </div>
                </Row>
                <ButtonToolbar className="modal__footer">
                  <Button className="asignar" onClick={this.toggle()}>Cancel</Button>{' '}
                  <Button
                    className="asignar just_this"
                    type="submit"
                    id="added"
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
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = {
  getSignature,
  uploadAvatar,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getRoles,
};

export default connect(null, mapDispatchToProps, null, { forwardRef: true })(ModalComponent);
