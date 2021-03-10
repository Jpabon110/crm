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
import Select from 'react-select';
import { connect } from 'react-redux';
import {
  FormGroup,
  Col,
  Label,
} from 'reactstrap';
import map from 'lodash/map';
import BasicNotification from '../../../shared/components/Notifications/BasicNotification';
import {
  getAllSubTypesCases,
} from '../../../redux/actions/casesActions';
import {
  updateSettingsPrePaid,
} from '../../../redux/actions/resourcesActions';

class prePaidEmail extends Component {
  constructor() {
    super();
    this.state = {
      type: [{ value: '5d04012e1ca88e6954723e70', label: 'Consulta' }],
      subtypes: [],
      updateLocal: false,
      editSubtypes: true,
    };
  }

  componentDidMount() {
    this.props.getAllSubTypesCases({ all: true, type: this.state.type[0].value });
  }

  componentDidUpdate() {
    const {
      prePaid,
    } = this.props;
    if (prePaid.subtypes && !this.state.updateLocal) {
      this.setState({ subtypes: this.transformOptions(prePaid.subtypes), updateLocal: true });
    }
  }

  onChangeInput = key => (e) => {
    if (key === 'subtypes') {
      this.setState({ [key]: e });
    }
  }

  startEdit = () => {
    this.setState({ editSubtypes: false });
  }

  cancelEdit = () => {
    this.setState({ editSubtypes: true });
  }

  sendSubtypes = () => {
    const { subtypes } = this.state;
    const { idSetting } = this.props;
    const data = {
      subtypes: map(subtypes, subtype => subtype.value),
    };
    if (!subtypes) {
      BasicNotification.show({
        color: 'danger',
        title: 'Atención',
        message: 'Debe seleccionar al menos una Tipificación.',
      });
      return;
    }
    this.props.updateSettingsPrePaid(idSetting, data, () => {
      this.setState({ editSubtypes: true });
    });
  }

  transformOptions(subTypes) {
    const transform = [];
    map(subTypes, (subtype) => {
      transform.push({ value: subtype._id, label: subtype.name });
    });
    return transform;
  }


  render() {
    const {
      title,
      prePaid,
      settingsUrlPre,
      subtypes,
      editarT,
    } = this.props;
    const typesOptions = [
      { value: '5d04012e1ca88e6954723e70', label: 'Consulta' },
    ];
    const subtypesOptions = map(subtypes, subtype => ({ value: subtype._id, label: subtype.name }));
    return (
      <Col md={6}>
        <FormGroup style={{ margin: 0 }}>
          <div className="flexWrapert">
            <div className="col-md-8">
              <FormGroup className="details_profile_columned" style={{ margin: 0 }}>
                <h2 className="title_modal_contact mb-2">{title}</h2>
                <div className="top_linear_divaindo">___</div>
              </FormGroup>
            </div>
            {
              (editarT) && (
                <div className="col-md-3">
                  <FormGroup className="details_profile_columned" style={{ margin: 0 }}>
                    <button
                      type="button"
                      style={{ fontSize: '13px', borderRadius: '0px', width: '110px' }}
                      hidden={!this.state.editSubtypes}
                      className="asignar2 new_contact_button"
                      onClick={this.startEdit}
                    >
                      Editar tipificación
                    </button>
                    <button
                      type="button"
                      hidden={this.state.editSubtypes}
                      style={{ fontSize: '13px', borderRadius: '0px', width: '110px' }}
                      className="asignar2 new_contact_button"
                      onClick={this.sendSubtypes}
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      style={{ fontSize: '13px', borderRadius: '0px', width: '110px' }}
                      hidden={this.state.editSubtypes}
                      className="asignar2 new_contact_button mt-2"
                      onClick={this.cancelEdit}
                    >
                      Cancelar
                    </button>
                  </FormGroup>
                </div>
              )
            }

          </div>

          <div className="centralice_section ml-1">
            <div className="col-md-6">
              {
                ((prePaid) && prePaid.email) && (
                  <FormGroup>
                    <Label className="label_porfolio">Correo Asignado:</Label><br />
                    <Label>{prePaid.email}</Label>
                  </FormGroup>
                )
              }
              <a
                href={settingsUrlPre.url}
                target="_blank"
                type="button"
                style={{ margin: '2px 0px', color: 'white' }}
                className="asignar2 new_contact_button"
              >
                Asignar correo
              </a>
            </div>
            {
              ((prePaid) && prePaid.email && (editarT)) && (
                <Fragment>
                  <div className="col-md-5">
                    <FormGroup>
                      <Label className="label_autofin" for="type">Tipo:</Label>
                      <Select
                        options={typesOptions}
                        type="text"
                        placeholder="seleccione"
                        name="type"
                        id="type"
                        value={this.state.type}
                        isDisabled
                        // onChange={this.onChangeInput('type')}
                        required
                      />
                    </FormGroup>
                  </div>
                  <div className="col-md-12">
                    <FormGroup>
                      <Label className="label_autofin" for="subtype">Tipificación:</Label>
                      <Select
                        className="makeAll"
                        onChange={this.onChangeInput('subtypes')}
                        isMulti={subtypesOptions}
                        options={subtypesOptions}
                        value={this.state.subtypes}
                        isDisabled={this.state.editSubtypes}
                      />
                    </FormGroup>
                  </div>
                </Fragment>
              )
            }
          </div>
        </FormGroup>
      </Col>
    );
  }
}

const mapStateToProps = ({ cases }) => ({
  subtypes: cases.subtypes,
});


const mapDispatchToProps = {
  getAllSubTypesCases,
  updateSettingsPrePaid,
};
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(prePaidEmail);
