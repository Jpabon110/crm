/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import find from 'lodash/find';
import {
  Col,
  Row,
  Button,
  ButtonToolbar,
  Modal,
  ModalBody,
  FormGroup,
} from 'reactstrap';
import HTMLReactParser from 'html-react-parser';
import {
  getAllEmailTemplates,
} from '../../../redux/actions/emailTemplateActions';

class EmailTemplateModal extends Component {
  state = {
    optSelected: null,
    textHTML: null,
    template: null,
  };

  componentDidMount() {
    this.props.getAllEmailTemplates({ all: true });
  }

  onChange = (opt) => {
    let template = null;
    let textHTML = null;
    if (opt) {
      const { templates } = this.props;
      template = find(templates, t => t._id === opt.value);
      textHTML = template.body.replace(/\n/ig, '');
      const component = this.buildHTML(textHTML);
      template = component;
    }
    this.setState({ textHTML, template, optSelected: opt });
  }

  buildHTML = textHTML => HTMLReactParser(textHTML);

  render() {
    const {
      isOpen,
      toggle,
      templates,
      loading,
    } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        toggle={toggle(false)}
        className="modal-dialog2 modal-dialog--success"
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" type="button" onClick={toggle(false)} />
          <h2 className="bold-text label_autofin  modal__title" style={{ fontWeight: 'bold', textAlign: 'left' }}>
            <strong>Seleccione la plantilla</strong>
          </h2>
        </div>
        <ModalBody>
          <Row>
            <Col md="12">
              <FormGroup>
                <Select
                  options={templates.map(t => ({ value: t._id, label: t.title }))}
                  type="text"
                  isDisabled={loading}
                  placeholder="Selecciona la platilla"
                  name="template"
                  id="template"
                  value={this.state.optSelected}
                  onChange={this.onChange}
                />
              </FormGroup>
            </Col>
            {
              this.state.template
              && <Col md="12" style={{ textAlign: 'left' }}>{this.state.template}</Col>
            }
          </Row>
        </ModalBody>
        <ButtonToolbar className="modal__footer" style={{ justifyContent: 'flex-end' }}>
          <Button className="asignar" onClick={toggle(false)}>Cancelar</Button>{' '}
          <Button className="asignar just_this" onClick={toggle(this.state.textHTML)} disabled={!this.state.textHTML}>Seleccionar</Button>
        </ButtonToolbar>
      </Modal>
    );
  }
}

const mapStateToProps = ({ emailTemplate }) => ({
  templates: emailTemplate.allEmailTemplates,
  loading: emailTemplate.loadingAllTemplates,
});

const mapDispatchToProps = {
  getAllEmailTemplates,
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailTemplateModal);
