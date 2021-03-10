import React from 'react';
import {
  Card, CardBody, Col, Progress,
} from 'reactstrap';

const DataProgressBar = () => (
  <Col md={12} lg={6}>
    <Card>
      <CardBody>
        <div className="card__title">
          <h5 className="bold-text">Buena</h5>
          <h5 className="subhead">Use default progress with text</h5>
        </div>
        <div className="progress-wrap progress-wrap--middle">
          <Progress value={70}>70%</Progress>
        </div>
      </CardBody>
    </Card>
  </Col>
);


export default DataProgressBar;
