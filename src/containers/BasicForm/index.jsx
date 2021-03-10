/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Col, Container, Row } from 'reactstrap';
// import { withTranslation } from 'react-i18next';
// import PropTypes from 'prop-types';
import HorizontalForm from './components/HorizontalForm';
// import VerticalForm from './components/VerticalForm';
import showResults from '../Show';

const BasicForm = (props) => {
  console.log(props.toggleModal);
  return (
    <Container>
      <Row>
        <Col md={12}>
          <h3 className="page-title">Buenasssss</h3>
          <h3 className="page-subhead subhead">Use this elements, if you want to show some hints or additional
                information
          </h3>
        </Col>
      </Row>
      <Row>
        <HorizontalForm onSubmit={showResults} toggleModal={props.toggleModal} />
      </Row>
    </Container>

  );
};


export default BasicForm;
