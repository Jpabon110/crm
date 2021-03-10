/* eslint-disable react/no-unused-state */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
// import jwtDecode from 'jwt-decode';
import {
  Card, CardBody, Col, Row, FormGroup, Button, Label, Input, ButtonToolbar,
} from 'reactstrap';
import Select from 'react-select';
import { connect } from 'react-redux';
import {
  getMe, updateMe, getSignature, uploadAvatar,
} from '../../../redux/actions/userActions';
// import { Link } from 'react-router-dom';
import avatarDefault from '../../../shared/img/avatar-default.jpg';
import BasicNotification from '../../../shared/components/Notifications/BasicNotification';


class MicuentaContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'calories',
      firstName: '',
      lastName: '',
      avatar: '',
      roles: [],
      email: '',
      rut: '',
      jobPosition: '',
    };
    this.inputFile = React.createRef();
  }

  componentDidMount() {
    this.getMe();
    // const token = localStorage.getItem('accessToken');
    // if (token) {
    //   const { user } = jwtDecode(token);
    //   const {
    //     avatar, firstName, lastName, roles, email, rut,
    //   } = user;
    //   this.setState({
    //     avatar, firstName, lastName, roles, email, rut,
    //   });
    // }
  }

  getMe = () => {
    this.props.getMe((me) => {
      const {
        avatar, firstName, lastName, roles, email, rut, jobPosition, anexo,
      } = me;
      this.setState({
        avatar,
        firstName,
        lastName,
        roles,
        email,
        rut,
        anexo,
        jobPosition,
      });
    });
  }

  updateMe = (e) => {
    e.preventDefault();
    // const data = this.state;
    const {
      _id,
      firstName,
      lastName,
      email,
      password,
      anexo,
      avatar,
    } = this.state;

    if (avatar.file) {
      this.props.getSignature(avatar.file.name, (body) => {
        this.props.uploadAvatar({ ...body, file: avatar.file }, (data) => {
          this.sendData({
            _id,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            password,
            anexo: anexo.trim(),
            avatar: data.secure_url,
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
        anexo: anexo.trim(),
        avatar,
      });
    }
    // this.props.updateMe(data, () => {
    //   this.getMe();
    // });
  }


  sendData = (data) => {
    this.props.updateMe(data, () => {
      this.getMe();
    });
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
      BasicNotification.error(`Ocurrio un error al intentar cargar la imágen ${file.name}`);
    };
    reader.readAsDataURL(file);
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';
    const { orderBy: stateOrderBy, order: stateOrder } = this.state;

    if (stateOrderBy === property && stateOrder === 'desc') { order = 'asc'; }

    this.setState({ order, orderBy });
  };

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
      avatar, firstName, lastName, roles, email, rut, anexo,
    } = this.state;

    const rolesAux = this.translateRoles(roles);

    const options = [
      { value: 'admin', label: 'Administrador' },
      { value: 'manager', label: 'Manager' },
      { value: 'exceutive', label: 'Ejecutivo DEC' },
    ];
    return (
      <div className="dashboard container profile_centralize">
        <Col md={8} lg={8} xl={8}>
          <Card>
            <CardBody>
              <div className="modal__header">
                <h2 className="bold-text label_autofin  modal__title"> <strong>Perfil</strong></h2>
              </div>
              <div className="modal__body">
                <Col md={12} lg={12}>
                  <form className="form form--horizontal" onSubmit={this.updateMe}>
                    <Row className="row_center">
                      <div className="everlast">
                        <div>
                          <Col md="12">
                            <FormGroup className="centralize_avatar">
                              <Label className="label_autofin" for="avatar">Foto perfil:</Label>
                              <img
                                className="topbar__avatar-img for_user"
                                src={(avatar) ? this.getSrc(avatar) : avatarDefault}
                                alt="avatar"
                              />
                              <FormGroup className="element_center_file">
                                <Button
                                  className="asignar button_change"
                                  onClick={this.onChangeImg}
                                >Cambiar imagen
                                </Button>
                                <input
                                  type="file"
                                  ref={this.inputFile}
                                  onChange={this.onChangeInputFile}
                                  hidden
                                />
                                {/* <Link className="asignar btn_pass" to="/micuenta">Cambiar contraseña</Link> */}
                              </FormGroup>
                            </FormGroup>
                          </Col>
                        </div>
                        <div>
                          <Col md="12">
                            <FormGroup>
                              <Label className="label_autofin" for="rut">RUT:</Label>
                              <Input
                                type="text"
                                name="rut"
                                id="rut"
                                value={rut}
                                // value="25920858-0"
                                onChange={this.onChangeInput('rut')}
                                disabled
                              />
                            </FormGroup>
                          </Col>
                          <Col md="12">
                            <FormGroup className="form__form-group-input">
                              <Label className="label_autofin" for="firstName">Nombre:</Label>
                              <Input
                                className="new_size"
                                type="text"
                                name="firstName"
                                id="firstName"
                                value={firstName}
                                // value="JUAN"
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
                          {/* <Col md="12">
                            <FormGroup>
                              <Label className="label_autofin" for="email">Cargo:</Label>
                              <Input
                                className="new_size"
                                type="text"
                                name="email"
                                id="email"
                                value=""
                                disabled
                              />
                            </FormGroup>
                          </Col> */}
                          <Col md="12">
                            <FormGroup>
                              <Label className="label_autofin" for="email">Email:</Label>
                              <Input
                                className="new_size"
                                type="text"
                                name="email"
                                id="email"
                                value={email}
                                // value="JPABON@GMAIL.COM"
                                onChange={this.onChangeInput('email')}
                                disabled
                              />
                            </FormGroup>
                          </Col>
                          {/* <Col md="12">
                            <FormGroup>
                              <Label className="label_autofin" for="anexo">Telefono:</Label>
                              <Input
                                type="text"
                                name="phone"
                                id="phone"
                                // value={anexo}
                                onChange={this.onChangeInput('phone')}
                                required
                              />
                            </FormGroup>
                          </Col> */}
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
                            <FormGroup disabled>
                              <Label className="label_autofin" for="role">Role:</Label>
                              <Select
                                className="this_one_only"
                                onChange={this.onChangeInput('roles')}
                                options={options}
                                isMulti={options}
                                value={rolesAux}
                                isDisabled
                              />
                            </FormGroup>
                          </Col>
                        </div>
                      </div>
                    </Row>
                    <ButtonToolbar className="modal__footer" style={{ justifyContent: 'flex-end' }}>
                      <Button
                        className="asignar just_this"
                        type="submit"
                        style={{ cursor: 'pointer' }}
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
  getMe,
  updateMe,
  getSignature,
  uploadAvatar,
};

export default connect(null, mapDispatchToProps)(MicuentaContent);
