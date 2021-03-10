/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/prop-types */
/* eslint-disable no-useless-constructor */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable max-len */
import React, { Component } from 'react';
import {
  FormGroup,
  Col,
  Label,
} from 'reactstrap';

class creditPortfolio extends Component {
  constructor() {
    super();
  }


  render() {
    const {
      title,
      customerService,
      settingsUrlCustomer,
    } = this.props;
    return (
      <Col md={6}>
        <FormGroup style={{ margin: 0 }}>
          <div className="profile_info col-md-12 mb-0 mt-3">
            <FormGroup className="details_profile_columned" style={{ margin: 0 }}>
              <h2 className="title_modal_contact mb-2">{title}</h2>
              <div className="top_linear_divaindo">___</div>
            </FormGroup>
          </div>
          <div className="centralice_section ml-1">
            {
              ((customerService) && customerService.email) && (
                <FormGroup>
                  <Label className="label_porfolio">Correo Asignado:</Label><br />
                  <Label>{ customerService.email }</Label>
                </FormGroup>
              )
            }
            <a
              href={settingsUrlCustomer.url}
              target="_blank"
              type="button"
              style={{ margin: '6px 0px', color: 'white' }}
              className="asignar2 new_contact_button"
            >
              Asignar correo
            </a>
          </div>
        </FormGroup>
      </Col>
    );
  }
}

export default creditPortfolio;
