/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { PureComponent } from 'react';
import {
  Card,
  CardBody,
  Container,
  Row, Col,
  FormGroup,
  Label,
} from 'reactstrap';
import { connect } from 'react-redux';
import PrePaidEmail from './components/prePaidEmail';
import CustomerServiceEmail from './components/customerServiceEmail';
import {
  getSettings,
  getSettingsUrlCustomerService,
  getSettingsUrlPrePaid,
  getSettingsUrlPrePaidInternal,
} from '../../redux/actions/resourcesActions';

// const ConfigContent = props => (
class ConfigContent extends PureComponent {
  constructor() {
    super();
    this.state = {
      // nRecordLoad: 0,
      // nRecordIncidences: 0,
    };
  }

  componentDidMount() {
    this.props.getSettings();
    this.props.getSettingsUrlCustomerService();
    this.props.getSettingsUrlPrePaid();
    this.props.getSettingsUrlPrePaidInternal();
  }

  render() {
    const {
      settings, settingsUrlCustomer, settingsUrlPre, settingsUrlPreInternal,
    } = this.props;
    const cronJobStatus = settings && settings.cronJobStatus ? settings.cronJobStatus : 'inactive';
    return (
      <Container className="dashboard">
        <Card>
          <CardBody>
            <Row>
              <PrePaidEmail
                title="Correo Prepago"
                prePaid={(settings && settings.prepaid) ? settings.prepaid : {}}
                settingsUrlPre={settingsUrlPre || '#'}
                idSetting={(settings && settings._id) ? settings._id : ''}
                editarT
              />
              <CustomerServiceEmail
                title="Correo servicio cliente"
                customerService={(settings && settings.customerService) ? settings.customerService : {}}
                settingsUrlCustomer={settingsUrlCustomer || '#'}
              />
            </Row>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Row>
              <PrePaidEmail
                title="Correo Prepago por Renovación"
                prePaid={(settings && settings.prepaidInternal) ? settings.prepaidInternal : {}}
                settingsUrlPre={settingsUrlPreInternal || '#'}
                idSetting={(settings && settings._id) ? settings._id : ''}
                editarT={false}
              />
            </Row>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Row>
              <Col md={12}>
                <FormGroup style={{ margin: 0 }}>
                  <div className="profile_info col-md-12 mb-0 mt-3">
                    <FormGroup className="details_profile_columned" style={{ margin: 0 }}>
                      <h2 className="title_modal_contact mb-2">Cron Jobs</h2>
                      <div className="top_linear_divaindo">___</div>
                    </FormGroup>
                  </div>
                  <div className="centralice_section ml-1">
                    <FormGroup>
                      <Label className="label_porfolio">
                          Correo entrante: { cronJobStatus === 'active'
                        ? <span style={{ color: 'green' }}>Activo</span>
                        : <span style={{ color: 'red' }}>Inactivo</span> }
                      </Label>
                    </FormGroup>
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    );
  }
}

const mapStateToProps = ({ resources }) => ({
  settings: resources.settings,
  loadingSetting: resources.loadingSetting,
  loadingSettingUrlCustomer: resources.loadingSettingUrlCustomer,
  settingsUrlCustomer: resources.settingsUrlCustomer,
  loadingSettingUrlPre: resources.loadingSettingUrlPre,
  settingsUrlPre: resources.settingsUrlPre,
  settingsUrlPreInternal: resources.settingsUrlPreInternal,
  loadingSettingUrlPreInternal: resources.loadingSettingUrlPreInternal,
});


const mapDispatchToProps = {
  getSettings,
  getSettingsUrlCustomerService,
  getSettingsUrlPrePaid,
  getSettingsUrlPrePaidInternal,
};


export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(ConfigContent);
