/* eslint-disable max-len */
/* eslint-disable react/no-unused-state */
import React, { PureComponent } from 'react';
import {
  Card, CardBody, Col,
} from 'reactstrap';
import UserList from './UserList';

class DefaultTabsBorderedBottom extends PureComponent {
  onClik = () => {
    if (this.userListRef) {
      this.userListRef.createUser();
    }
  }

  setUserListRef = (e) => {
    this.userListRef = e;
  };

  render() {
    return (
      <Col md={12} lg={12} xl={12}>
        <Card>
          <CardBody>
            <div className="col-md-12 col-lg-12 fiveBot pt-0 pb-0">
              <div>
                <h2><strong>Usuarios</strong></h2>
                <p className="autofin_p">Este página le permitirá definir cómo compartir los datos
                  de CRM entre usuarios en función de la jerarquía de roles de su organización.
                </p>
              </div>
              <div>
                {/* <ModalForm /> */}
                <button className="btn button_change black_resize_button" type="button" style={{ padding: '5px', width: '120px' }} onClick={this.onClik}>Crear usuario</button>
              </div>
            </div>
            <UserList ref={this.setUserListRef} location={this.props} />
          </CardBody>
        </Card>
      </Col>
    );
  }
}
export default DefaultTabsBorderedBottom;
