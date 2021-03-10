/* eslint-disable react/no-danger */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-else-return */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-shadow */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-indent */
/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, { Component, Fragment } from 'react';
import {
  Card, CardBody, Row, Button,
} from 'reactstrap';
import map from 'lodash/map';
import replace from 'lodash/replace';
import { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { connect } from 'react-redux';
import base64url from 'base64url';
import avatarDefault from '../../../shared/img/avatar-default.jpg';
import MessageModalMailComponent from './MessageModalMailComponent';
import {
  getContactByRut,
  getContractByRut,
} from '../../../redux/actions/contactosActions';
import {
  createQuotations,
  createQuotationsMe,
  updateQuotations,
  updateQuotationsMe,
  getQuotationById,
  getQuotationByIdMe,
  deleteQuotations,
  sendFormRequest,
} from '../../../redux/actions/quotationsActions';
import {
  getRegions,
  getCommuns,
  getCivilStatus,
} from '../../../redux/actions/resourcesActions';
import {
  getUsers,
} from '../../../redux/actions/userActions';
import { changeTitleAction } from '../../../redux/actions/topbarActions';


registerLocale('es', es);

class MailsContents extends Component {
  constructor() {
    super();
    this.state = {
      activeTab: '1',
      isOpenModalD: false,
      isOpenModalSendForm: false,
      isOpenModalContactEdit: false,
      isOpenModalE: false,
      isOpenModalCloseQuotations: false,
      isOpenEvaluateModal: false,
      idDetail: null,
    };
  }

  setModalRef = (element) => {
    this.modalRef = element;
  };

  getTextHtml = () => {
    if (!this.modalRef) {
      return null;
    }
    return this.modalRef.getTextHtml();
  }

  convertTextPlainToHtml = (textPlain) => {
    const bodyArray = textPlain.split('↵');
    return (<div>{map(bodyArray, text => <p>{text}</p>)}</div>);
  }

  createMarkup = textHtml => ({ __html: textHtml });

  convertTextHTMLToHTML = (textHtml, inline) => {
    let textHtmlClean = textHtml.split('<div class="gmail_quote">')[0];
    textHtmlClean = textHtml.split('<div id="appendonsend"></div>')[0];
    if (inline && Array.isArray(inline)) {
      for (let i = 0; i < inline.length; i += 1) {
        const { mimeType, data, src } = inline[i];
        textHtmlClean = replace(textHtmlClean, src, `data:${mimeType};base64,${base64url.toBase64(data)}`);
      }
    }
    return <div dangerouslySetInnerHTML={this.createMarkup(textHtmlClean)} />;
  };

  onClickModalNewMailsReplays = () => {
    const activity = {
      description: null,
      executive: null,
    };
    this.setState({ isOpenModalMessageMail: true, activity });
  }

  render() {
    const {
      messages,
      onSubmit,
      onChangeMessage,
      toggleModalNewMessage,
      onClickModalNewMailsReplays,
      isOpenModalMessageMail,
      removeAttachment,
      NewMessage,
      emailArrayToMailsContents,
      loading,
      sourceMail,
    } = this.props;

    // console.log('messages', messages);

    return (
      <Fragment>
        <MessageModalMailComponent
          isOpen={isOpenModalMessageMail}
          toggle={toggleModalNewMessage}
          sourceMail={sourceMail}
          loading={loading}
          emailArrayToMailsContents={emailArrayToMailsContents}
          onSubmit={onSubmit}
          ref={this.setModalRef}
          NewMessage={NewMessage}
          removeAttachment={removeAttachment}
          onChangeMessage={onChangeMessage}
        />
        <Card className="cardo_botton" style={{ height: 'auto' }}>
          <CardBody style={{ padding: '0px 10px' }}>
            <div className="profile_casos profile_casos_detail">
              <div className="col-md-12" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', padding: '10px 0px' }}>
                <Row>
                  <Fragment>
                    <Fragment>
                      <Button
                        className="asignar button_details"
                        type="submit"
                        id="added"
                        style={{ borderRadius: '0px 0px 0px 0px', margin: '0px' }}
                        onClick={onClickModalNewMailsReplays}
                      >
                        Responder correo
                      </Button>
                    </Fragment>
                  </Fragment>
                </Row>
              </div>
              {
                (messages !== undefined) && (
              <div className="col-md-12" style={{ height: '300px', overflowY: 'scroll', marginBottom: '5%' }}>
                {(messages !== undefined) && (
                  messages
                    .map((activity) => {
                      const { attachments = [], inline } = activity;
                      const attachmentsBlobs = map(attachments, (item) => {
                        const { data, filename, mimeType } = item;
                        // const blob = base64url.decode(data);
                        return (
                            <a key={item.id} style={{ color: '#000' }} href={`data:${mimeType};base64,${base64url.toBase64(data)}`} download={filename}>{filename}</a>
                        );
                      });
                      return (
                        <div key={activity.id} className="cards_reply" style={{ marginBottom: '3%' }}>
                          <Row className="row_flexible">
                            <div className="compacted col-md-5">
                              <div className="profile_avatar_details">
                                <img src={avatarDefault} alt="avatar" />
                              </div>
                              <div className="profile_info col-md-8" style={{ textAlign: 'center' }}>
                                <h5>{(activity.from) ? activity.from : 'Sin remitente'}</h5>
                              </div>
                            </div>
                            <div className="compacted col-md-7">
                              <h6> {moment(activity.date).format('DD/MM/YYYY HH:mm')}</h6>
                            </div>
                          </Row>
                          <Row>
                            <div className="compacted col-md-12" style={{ padding: '0px 40px' }}>
                              {/* <p style={{ width: 'inherit' }}>{this.convertTextPlainToHtml(activity.body)}</p> */}
                              {/* <Input
                                type="textarea"
                                maxLength="300"
                                minLength="30"
                                style={{ height: '100px' }}
                                name="clientActivity"
                                id="clientActivity"
                                className="newArea"
                                disabled="true"
                                value={this.convertTextPlainToHtml(activity.textPlain)}
                              /> */}
                              <span>
                                {
                                  activity.textHtml ? this.convertTextHTMLToHTML(activity.textHtml, inline) : this.convertTextPlainToHtml(activity.textPlain)
                                }
                              </span>
                              {
                                (attachmentsBlobs.length > 0) && (
                                <div className="col-md-12">
                                    <h4 style={{
                                      fontSize: '14px',
                                      fontWeight: '600',
                                      margin: '7px 0px',
                                    }}
                                    >
                                      Adjuntos:
                                    </h4>
                                  <div
                                    className="col-md-12"
                                    style={{ display: 'flex', flexDirection: 'column' }}
                                  >
                                    {
                                      attachmentsBlobs
                                    }
                                  </div>
                                </div>
                                )
                              }
                            </div>
                          </Row>
                        </div>
                      );
                    })
                )
                }
              </div>
                )
              }
            </div>
          </CardBody>
        </Card>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ contacts, users, quotations, resources }) => ({
  SendedForm: quotations.SendedForm,
  contact: contacts.contact,
  loadingInfoQuotations: quotations.loadingInfoQuotations,
  cargandoContact: contacts.cargando,
  civilStatus: resources.civilStatus,
  regions: resources.Regions,
  Communs: resources.Communs,
  quotationInfo: quotations.quotationInfo,
  loadingQuotations: quotations.loadingInfoQuotations,
  quotationCreated: quotations.quotationCreated,
  users: users.collection,
  update: contacts.update,
  contracts: contacts.contracts,
});


const mapDispatchToProps = {
  setTitle: changeTitleAction,
  getRegions,
  getCommuns,
  getCivilStatus,
  deleteQuotations,
  updateQuotations,
  sendFormRequest,
  getContactByRut,
  createQuotationsMe,
  updateQuotationsMe,
  getQuotationByIdMe,
  createQuotations,
  getQuotationById,
  getContractByRut,
  getUsers,
};
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(MailsContents);
