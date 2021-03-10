import React from 'react';
import {
  Col, Badge, Table,
} from 'reactstrap';

const BasicTable = () => (
  <Col md={12} lg={12} xl={12}>
    <Table responsive hover>
      <thead>
        <tr>
          <th>Origen</th>
          <th>ID</th>
          <th>Tipo</th>
          <th>Tipificación</th>
          <th>Plazo</th>
          <th>Creado</th>
          <th>Fecha de compromiso</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>*</td>
          <td>109123</td>
          <td>Reclamo</td>
          <td>Problemas con la cuponera</td>
          <td><Badge className="badge_color">Dentro de plazo</Badge></td>
          <td>05/12/2018 18:00</td>
          <td>05/12/2018 18:00</td>
          <td>Pendiente</td>
        </tr>
        <tr>
          <td>*</td>
          <td>109123</td>
          <td>Reclamo</td>
          <td>Problemas con la cuponera</td>
          <td><Badge className="badge_color">Dentro de plazo</Badge></td>
          <td>05/12/2018 18:00</td>
          <td>05/12/2018 18:00</td>
          <td>Pendiente</td>
        </tr>
      </tbody>
    </Table>
  </Col>
);


export default BasicTable;
