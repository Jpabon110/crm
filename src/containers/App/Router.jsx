/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Layout from '../Layout/index';
import MainWrapper from './MainWrapper';

import LogIn from '../LogIn/index';
import forgoten from '../forgoten/index';
// import ExamplePageOne from '../Example/index';
// import ExamplePageTwo from '../ExampleTwo/index';
import MiPanelContent from '../MiPanel/index';
import UsuariosContent from '../Users/index';
import MiCuentaContent from '../MiCuenta/index';
import PasswordContent from '../Password/index';
import CasosContent from '../Casos/index';
import Cotizaciones from '../Cotizaciones/index';
import Configuration from '../Configuration/index';
import CasoDetalleContent from '../CasoDetalle/index';
import CotizacionesDetalleContent from '../CotizacionesDetalle/index';
import ContactosContent from '../Contactos/index';
import SubtypesContent from '../Subtypes/index';
import EmailTemplateContent from '../EmailTemplate/index';

import { isUserAllowed, isOptionAllowed } from '../../shared/utils';

// const Pages = () => (
//   <Switch>
//     <Route path="/pages/one" component={ExamplePageOne} />
//     <Route path="/pages/two" component={ExamplePageTwo} />
//   </Switch>
// );

const wrappedRoutes = () => {
  // console.log('here', isOptionAllowed(['sales-executive']));
  if (!localStorage.getItem('accessToken')) {
    return <Redirect to="/login" />;
  }
  if (window.location.pathname === '/') {
    const isAdmin = isOptionAllowed(['admin', 'manager']);
    if (isAdmin) {
      // return <Redirect to="/mipanel" />;
      return <Redirect to="/casos" />;
    }

    if (isOptionAllowed(['dec-executive'])) {
      return <Redirect to="/casos" />;
    }

    if (isOptionAllowed(['sales-executive'])) {
      return <Redirect to="/cotizaciones" />;
    }
  }
  return (
    <div>
      <Layout />
      <div className="container__wrap">
        <Route exact path="/mipanel" component={MiPanelContent} />
        {
          isUserAllowed('admin')
          && <Route exact path="/usuarios" component={UsuariosContent} />
        }
        <Route exact path="/micuenta" component={MiCuentaContent} />

        {
          isOptionAllowed(['admin', 'manager'])
          && (
            <Fragment>
              <Route exact path="/tipificacion" component={SubtypesContent} />
              <Route exact path="/configuracion" component={Configuration} />
              <Route exact path="/templates" component={EmailTemplateContent} />
            </Fragment>
          )
        }

        <Route exact path="/password" component={PasswordContent} />
        {
          isOptionAllowed(['admin', 'manager', 'dec-executive'])
          && (
            <Fragment>
              <Route exact path="/casos" component={CasosContent} />
              <Route exact path="/casos/new/:rut" component={CasoDetalleContent} />
              <Route exact path="/casos/:id" component={CasoDetalleContent} />
            </Fragment>
          )
        }
        <Route exact path="/contactos" component={ContactosContent} />

        {
          isOptionAllowed(['admin', 'manager', 'sales-executive'])
          && (
            <Fragment>
              <Route exact path="/cotizaciones" component={Cotizaciones} />
              <Route exact path="/cotizaciones/new/:rut" component={CotizacionesDetalleContent} />
              <Route exact path="/cotizaciones/:id" component={CotizacionesDetalleContent} />
            </Fragment>
          )
        }
      </div>
    </div>
  );
};

const Router = () => (
  <MainWrapper>
    <main>
      <Switch>
        <Route exact path="/login" component={LogIn} />
        <Route exact path="/forgoten" component={forgoten} />
        <Route path="/" component={wrappedRoutes} />
      </Switch>
    </main>
  </MainWrapper>
);

export default Router;
