/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  Button, ButtonToolbar, Label,
  FormGroup,
  Input,
  Modal, ModalBody,
} from 'reactstrap';
import 'react-datepicker/dist/react-datepicker.css';
import TextEditor from '../text-editor/TextEditor';

class MessageModalMailComponent extends Component {
  setTextEditorRef = (element) => {
    this.textEditor = element;
  };

  getTextHtml = () => {
    if (!this.textEditor) {
      return null;
    }
    return this.textEditor.getTextHtml();
  }

  setTextHtml = (bodyHTML) => {
    if (!this.textEditor) {
      return null;
    }
    return this.textEditor.setTextHtml(bodyHTML);
  }

  render() {
    const { props } = this;
    const {
      onChangeTitle,
      isOpenModalTemplate,
      onSubmit,
      loading,
      toggleModalNewMessage,
      title,
      titleTemplate,
    } = props;
    return (
      <div>
        <Modal
          isOpen={isOpenModalTemplate}
          toggle={toggleModalNewMessage}
          className="modal-dialog2 modal-dialog--success"
        >
          <div className="modal__header">
            <button className="lnr lnr-cross modal__close-btn" type="button" onClick={toggleModalNewMessage} />
            <h2 className="bold-text label_autofin  modal__title" style={{ fontWeight: 'bold', textAlign: 'left' }}>
              <strong>{title}</strong>
            </h2>
          </div>
          <ModalBody>
            <FormGroup style={{ textAlign: 'left' }}>
              <h5 className="mb-2" style={{ fontWeight: '600' }}>Título:</h5>
              <Input
                type="text"
                className="newArea"
                name="description"
                id="description"
                value={titleTemplate}
                onChange={onChangeTitle}
              />
            </FormGroup>
            <FormGroup style={{ textAlign: 'left' }}>
              <Label className="label_autofin" for="description">Ingrese nueva plantilla:</Label>
              <TextEditor ref={this.setTextEditorRef} />
            </FormGroup>
          </ModalBody>
          <ButtonToolbar className="modal__footer" style={{ justifyContent: 'flex-end' }}>
            <Button className="asignar" onClick={toggleModalNewMessage}>Cancelar</Button>{' '}
            <Button
              className="asignar just_this"
              onClick={onSubmit}
              id="added"
              disabled={loading}
            >Guardar
            </Button>
          </ButtonToolbar>
        </Modal>
      </div>
    );
  }
}

export default MessageModalMailComponent;
