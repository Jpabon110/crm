/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import {
  Card, CardBody, Col, Button, ButtonToolbar, Label, Input, Row, FormGroup,
} from 'reactstrap';
// import { Field, reduxForm } from 'redux-form';
import { reduxForm } from 'redux-form';
// import EyeIcon from 'mdi-react/EyeIcon';
// import EmailIcon from 'mdi-react/EmailIcon';
// import AccountSearchIcon from 'mdi-react/AccountSearchIcon';
// import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
// import renderFileInputField from '../../../shared/components/form/FileInput';
// import renderSelectField from '../../../shared/components/form/Select';
// import renderMultiSelectField from '../../../shared/components/form/MultiSelect';
class HorizontalForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    // reset: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      showPassword: false,
    };
  }

  showPassword = (e) => {
    e.preventDefault();
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  };

  onChangeInput = () => {

  };

  render() {
    const { handleSubmit, toggleModal } = this.props;
    console.log('horizontal:', toggleModal);
    // const { showPassword } = this.state;


    return (
      <Col md={12} lg={12}>
        <Card style={{ height: 'auto' }}>
          <CardBody>
            <form className="form form--horizontal" onSubmit={handleSubmit}>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <Label for="firtsname">Nombre:</Label>
                    <Input
                      type="text"
                      name="firtsname"
                      id="firtsname"
                      // disabled={props.loading}
                      // value={offerLetter.firtsname}
                      onChange={this.onChangeInput('firtsname')}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <Label for="lastname">Apellido:</Label>
                    <Input
                      type="text"
                      name="lastname"
                      id="lastname"
                      // disabled={props.loading}
                      // value={offerLetter.lastname}
                      onChange={this.onChangeInput('lastname')}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <Label for="email">Email:</Label>
                    <Input
                      type="text"
                      name="email"
                      id="email"
                      // disabled={props.loading}
                      // value={offerLetter.email}
                      onChange={this.onChangeInput('email')}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <Label for="password">Contraseña:</Label>
                    <Input
                      type="text"
                      name="password"
                      id="password"
                      disabled
                      // value={offerLetter.password}
                      onChange={this.onChangeInput('password')}
                      required
                    />
                  </FormGroup>
                </Col>
                {/* <Col md="12">
                  <FormGroup>
                    <Label for="rut">Rut:</Label>
                    <Input
                      type="text"
                      name="rut"
                      id="rut"
                      disabled
                      // value={offerLetter.rut}
                      onChange={this.onChangeInput('rut')}
                      required
                    />
                  </FormGroup>
                </Col> */}
                <Col md="12">
                  <FormGroup>
                    <Label for="avatar">Avatar:</Label>
                    <Input
                      type="text"
                      name="avatar"
                      id="avatar"
                      disabled
                      // value={offerLetter.avatar}
                      onChange={this.onChangeInput('avatar')}
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
              <ButtonToolbar className="form__button-toolbar">
                <Button color="primary" type="submit">Submit</Button>
                <Button type="button" onClick={() => toggleModal}>
                  Cancel
                </Button>
              </ButtonToolbar>
            </form>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

export default reduxForm({
  form: 'horizontal_form', // a unique identifier for this form
})(HorizontalForm);
