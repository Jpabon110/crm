/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-return-assign */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, {
  Component,
  Fragment,
} from 'react';
import {
  Button, ButtonToolbar, Label,
  FormGroup,
  Input,
  Modal, ModalBody,
} from 'reactstrap';
import jwtDecode from 'jwt-decode';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select/creatable';
import { components } from 'react-select';
import Tooltip from '@atlaskit/tooltip';
import TextEditor from '../../../shared/components/text-editor/TextEditor';
import EmailTemplateModal from './EmailTemplateModal';

class MessageModalMailComponent extends Component {
  state = {
    showTemplateModal: false,
    // emailFrom: '',
  };

  componentDidMount() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const { email } = jwtDecode(token).user;
      // this.setState({ emailFrom: email });
    }
  }

  setTextEditorRef = (element) => {
    this.textEditor = element;
  };

  getTextHtml = () => {
    if (!this.textEditor) {
      return null;
    }
    return this.textEditor.getTextHtml();
  }

  templateModalToggle = textHTML => () => {
    if (textHTML) {
      if (this.textEditor) {
        this.textEditor.setTextHtml(textHTML);
      }
    }
    this.setState({ showTemplateModal: false });
  }

  showTemplateModal = () => {
    this.setState({ showTemplateModal: true });
  }

  Input = props => (
    <components.Input {...props} />
  );

  render() {
    const {
      onChangeMessage,
      isOpen,
      onSubmit,
      NewMessage,
      removeAttachment,
      loading,
      emailArrayToMailsContents,
      toggle,
      sourceMail,
    } = this.props;

    const { showTemplateModal } = this.state;


    return (
      <div>
        <Modal
          isOpen={isOpen}
          toggle={toggle}
          className="modal-dialog2 modal-dialog--success"
        >
          <div className="modal__header">
            <button className="lnr lnr-cross modal__close-btn" type="button" onClick={toggle} />
            <h2 className="bold-text label_autofin  modal__title" style={{ fontWeight: 'bold', textAlign: 'left' }}>
              <strong>Nueva respuesta</strong>
            </h2>
          </div>
          <ModalBody>
            <FormGroup style={{ textAlign: 'left', padding: '0' }} className="col-md-6">
              <Label className="label_autofin" for="executive">De:</Label> <br />
              <span style={{ margin: '3px 0px' }}>
                <strong style={{ margin: '0px 5px' }}>{ sourceMail }</strong>
              </span>
            </FormGroup>
            <FormGroup style={{ textAlign: 'left', padding: '0' }}>
              <Label className="label_autofin" for="executive">Para:</Label>
              <Select
                // isMulti
                options={emailArrayToMailsContents}
                // components={{ Input }}
                onChange={onChangeMessage('to')}
                className="autoHeightSelect"
              />
              {/* <Select
                closeMenuOnSelect={false}
                components={{ Input }}
                onChange={onChangeMessage('to')}
                className="autoHeightSelect"
                isMulti
                options={emailArrayToMailsContents}
              /> */}
            </FormGroup>
            <FormGroup style={{ textAlign: 'left', padding: '0' }}>
              <Label className="label_autofin" for="executive">CC:</Label>
              <Select
                isMulti
                options={emailArrayToMailsContents}
                onChange={onChangeMessage('cc')}
                className="autoHeightSelect"
              />
            </FormGroup>
            <FormGroup style={{ textAlign: 'left' }}>
              <Label className="label_autofin" for="description">Ingrese nueva respuesta:</Label>
              <TextEditor ref={this.setTextEditorRef} onChange={onChangeMessage('editor')} />
            </FormGroup>
            <FormGroup style={{ textAlign: 'left' }}>
              <Label className="label_autofin" for="description">Ingrese adjunto:</Label>
              <br />
              <Input type="file" multiple onChange={onChangeMessage('attachments')} />
              {
                (NewMessage) && (
                  <div className="col-md-auto" style={{ padding: '3%' }}>
                    {
                      NewMessage.attachments.map((attachment, index) => (
                        <Fragment>
                          <h5>
                            <span className="lnr lnr-cross-circle" style={{ marginRight: '1%' }} onClick={removeAttachment(index)} /> {attachment.name}
                          </h5>
                          <br />
                        </Fragment>
                      ))
                    }
                  </div>
                )
              }
              {/* {
                (NewMessage) && (
                  <div className="col-md-auto" style={{ padding: '3%' }}>
                    {
                      NewMessage.attachments.map((attachments, index) => (
                        <Fragment>
                          <h5>
                            <span className="lnr lnr-cross-circle" style={{ marginRight: '1%' }} />{ attachments[0].name } { index }
                          </h5>
                          <br />
                        </Fragment>
                      ))
                    }
                  </div>
                )
              } */}
            </FormGroup>
          </ModalBody>
          <ButtonToolbar className="modal__footer" style={{ justifyContent: 'flex-end' }}>
            <Button className="asignar" onClick={this.showTemplateModal}>Cargar Plantilla</Button>{' '}
            <Button className="asignar" onClick={toggle}>Cancelar</Button>{' '}
            <Button
              className="asignar just_this"
              onClick={onSubmit}
              id="added"
              disabled={loading}
            >Enviar respuesta
            </Button>
          </ButtonToolbar>
        </Modal>
        <EmailTemplateModal
          isOpen={showTemplateModal}
          toggle={this.templateModalToggle}
        />
      </div>
    );
  }
}

export default MessageModalMailComponent;
