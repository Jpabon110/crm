/* eslint-disable no-param-reassign */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-useless-return */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/prop-types */
/* eslint-disable no-useless-constructor */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable max-len */
import React, { Component, Fragment } from 'react';
// import Select from 'react-select';
import { connect } from 'react-redux';
import {
  FormGroup,
  Col,
  // Label,
} from 'reactstrap';
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';
import TableCell from '@material-ui/core/TableCell';
// import map from 'lodash/map';
import MatTable from '../../../shared/components/MaterialTable';
import { isUserAllowed } from '../../../shared/utils';
import {
  getAllEmailTemplates,
  createEmailTemplate,
  updateEmailTemplate,
  removeEmailTemplateById,
} from '../../../redux/actions/emailTemplateActions';
import ModalTemplate from '../../../shared/components/Modal/ModalTemplate';
import ModalDeleteTemplate from '../../../shared/components/Modal/Modal';
import BasicNotification from '../../../shared/components/Notifications/BasicNotification';

const headers = [
  {
    id: 'title', disablePadding: false, label: 'Titulo',
  },
  {
    id: 'dateCreate', disablePadding: false, label: 'Fecha creación',
  },
  {
    id: 'dateUpdate', disablePadding: false, label: 'Ultima actualización',
  },
  {
    id: 'actions', disablePadding: false, label: 'Acciones',
  },

];


class EmailTemplateComponent extends Component {
  constructor() {
    super();
    this.state = {
      page: 0,
      rowsPerPage: 7,
      justAdminOrManager: false,
      isOpenModalTemplate: false,
      isOpenModalDeleteTemplate: false,
      title: 'Nueva Plantilla',
      titleTemplate: '',
      NewMessage: {
        editor: null,
        attachments: undefined,
      },
    };
  }

  componentDidMount() {
    const isAdmin = isUserAllowed('admin') || isUserAllowed('manager');
    this.setState({ justAdminOrManager: isAdmin });
    this.props.getAllEmailTemplates();
  }

  onClickAction = (action, template) => () => {
    switch (action) {
      case 'delete':
        this.deleteTemplate(template);
        break;
      case 'update':
        this.uploadTemplate(template);
        break;
      case 'create':
        this.createTemplate();
        break;
      default:
        break;
    }
  }

  uploadTemplate = (template) => {
    if (this.mailRef) {
      this.setState({
        isOpenModalTemplate: true,
        title: 'Editar Plantilla',
        _id: template._id,
        titleTemplate: template.title,
      });
      setTimeout(() => {
        this.mailRef.setTextHtml(template.body);
      }, 500);
    }
  }


  deleteTemplate = (template) => {
    this.setState({ isOpenModalDeleteTemplate: true });
    this.setState({
      isOpenModalDeleteTemplate: true,
      _id: template._id,
    });
  }

  createTemplate = () => {
    this.setState({ isOpenModalTemplate: true, title: 'Nueva Plantilla' });
  }

  toggleModalNewMessage = () => {
    this.setState({ isOpenModalTemplate: false, titleTemplate: '', _id: '' });
  };

  toggleModalDeleteTemplate = isOk => () => {
    if (isOk) {
      this.props.removeEmailTemplateById(this.state._id, () => {
        this.setState({ isOpenModalDeleteTemplate: false });
        this.props.getAllEmailTemplates();
      });
    } else {
      this.setState({ isOpenModalDeleteTemplate: false });
    }
  }

  onChangeTitle = (e) => {
    this.setState({ titleTemplate: e.target.value });
  };

  onSubmitNewTemplate = (e) => {
    if (e) {
      e.preventDefault();
    }
    let message;
    if (this.mailRef) {
      message = this.mailRef.getTextHtml();
    }
    const {
      titleTemplate,
      _id,
    } = this.state;

    if (!message) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe ingresar mensaje para responder el correo.',
      });
      return;
    }

    const data = {
      title: titleTemplate,
      body: message,
    };

    // console.log('newMessage', message);
    const isAdmin = isUserAllowed('admin');
    if (isAdmin) {
      this.sendData(_id, data);
    } else {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'No posees privilegios para editar esta platilla.',
      });
    }
  }

  sendData = (_id, data) => {
    if (!_id) {
      this.props.createEmailTemplate(data, () => {
        this.setState({ isOpenModalTemplate: false, titleTemplate: '' });
        this.props.getAllEmailTemplates();
      });
    } else {
      this.props.updateEmailTemplate(_id, data, () => {
        this.setState({ isOpenModalTemplate: false, titleTemplate: '', _id: '' });
        this.props.getAllEmailTemplates();
      });
    }
    this.setState({ isOpenModalTemplate: false });
  }

  setMailRef = (element) => {
    this.mailRef = element;
  };

  render() {
    const {
      title,
      loadingAllTemplates,
      allEmailTemplates,
      countEmailTemplates,
      // limitEmailTemplates,
    } = this.props;
    const {
      page,
      rowsPerPage,
    } = this.state;

    const data = allEmailTemplates
      // .sort(getSorting(order, orderBy))
      // .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
      .map(d => ({
        // isSelected: this.isSelected(d._id),
        id: d._id,
        code: d.code,
        cells: (
          <Fragment>
            <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} align="left">{d.title}</TableCell>
            <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} align="left">{moment(d.createdAt).format('DD/MM/YYYY, HH:mm')}</TableCell>
            <TableCell className="material-table__cell" style={{ borderBottom: '0px' }} align="left">{moment(d.updatedAt).format('DD/MM/YYYY, HH:mm')}</TableCell>
            <TableCell
              className="material-table__cell"
              align="left"
            >
              <a href="javascript:void(0);" onClick={this.onClickAction('update', d)}>
                <span
                  className="lnr lnr-lnr lnr-pencil"
                  style={{
                    fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', color: '#000',
                  }}
                />
              </a>
              <a href="javascript:void(0);" onClick={this.onClickAction('delete', d)} style={{ marginLeft: '15%' }}>
                <span
                  className="lnr lnr-lnr lnr-trash"
                  style={{
                    fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', color: '#000',
                  }}
                />
              </a>
            </TableCell>
          </Fragment>
        ),
      }));
    return (
      <Col md={12}>
        <ModalTemplate
          ref={this.setMailRef}
          messages={this.state.messages}
          id={this.state._id}
          // loading={disableCloseCase}
          onClickModalNewMailsReplays={this.onClickModalNewMailsReplays}
          toggleModalNewMessage={this.toggleModalNewMessage}
          NewMessage={this.state.NewMessage}
          onChangeTitle={this.onChangeTitle}
          isOpenModalTemplate={this.state.isOpenModalTemplate}
          onSubmit={this.onSubmitNewTemplate}
          title={this.state.title}
          titleTemplate={this.state.titleTemplate}
        />
        <ModalDeleteTemplate
          color="warning"
          title="¡Atención!"
          message="¿Está seguro que desea eliminar la plantilla?"
          toggle={this.toggleModalDeleteTemplate}
          isOpen={this.state.isOpenModalDeleteTemplate}
        />
        <FormGroup style={{ margin: 0 }}>
          <div className="flexWrapert">
            <div className="col-md-10">
              <FormGroup className="details_profile_columned" style={{ margin: 0 }}>
                <h2 className="title_modal_contact mb-2">{title}</h2>
                <div className="top_linear_divaindo">___</div>
              </FormGroup>
            </div>
            <Col xs="auto" sm="auto" md="auto">
              <button type="button" style={{ fontSize: '13px' }} className="asignar2 new_contact_button" onClick={this.onClickAction('create')}>+ Nueva plantilla</button>
            </Col>
          </div>
          {
            loadingAllTemplates && (
              <Skeleton count={rowsPerPage + 1} height={40} />
            )
          }

          {
            !loadingAllTemplates && (
              <MatTable
                onSelectAllClick={this.onSelectAllClick}
                onChangePage={this.onChangePage}
                cargando={loadingAllTemplates}
                onChangeRowsPerPage={{}}
                onClickRow={undefined}
                onClick={{}}
                onChange={undefined}
                selected={[]}
                headers={headers}
                data={data}
                page={page}
                rowsPerPage={rowsPerPage}
                total={countEmailTemplates}
                justAdminOrManager={this.state.justAdminOrManager}
                checkbox={false}
              />
            )
          }
        </FormGroup>
      </Col>
    );
  }
}

const mapStateToProps = ({ emailTemplate }) => ({
  allEmailTemplates: emailTemplate.allEmailTemplates,
  loadingAllTemplates: emailTemplate.loadingAllTemplates,
  countEmailTemplates: emailTemplate.countEmailTemplates,
  limitEmailTemplates: emailTemplate.limitEmailTemplates,
  loadingTemplate: emailTemplate.loadingTemplate,
  emailTemplate: emailTemplate.emailTemplate,
});


const mapDispatchToProps = {
  getAllEmailTemplates,
  createEmailTemplate,
  updateEmailTemplate,
  removeEmailTemplateById,
};
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(EmailTemplateComponent);
