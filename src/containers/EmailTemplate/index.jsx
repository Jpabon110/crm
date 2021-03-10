/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { PureComponent } from 'react';
import {
  Card,
  CardBody,
  Container,
  Row,
} from 'reactstrap';
import EmailTemplateComponent from './components/EmailTemplateComponent';

// const ConfigContent = props => (
class EmailTemaplteContent extends PureComponent {
  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount() {

  }

  render() {
    return (
      <Container className="dashboard">
        <Card>
          <CardBody>
            <Row>
              <EmailTemplateComponent
                title="Manejador de Plantillas"
              />
            </Row>
          </CardBody>
        </Card>
      </Container>
    );
  }
}

export default EmailTemaplteContent;
