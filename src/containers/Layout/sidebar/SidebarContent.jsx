import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import { isUserAllowed, isOptionAllowed } from '../../../shared/utils';

class SidebarContent extends Component {
  static propTypes = {
    // changeToDark: PropTypes.func.isRequired,
    // changeToLight: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  hideSidebar = () => {
    const { onClick } = this.props;
    onClick();
  };

  render() {
    const show = isUserAllowed('admin');
    return (
      <div className="sidebar__content">
        <ul className="sidebar__block">
          <div>
            {
              isOptionAllowed(['admin', 'manager'])
              && <SidebarLink title="Mi panel" icon="lnr lnr-chart-bars" route="/mipanel" onClick={this.hideSidebar} />
            }
            {
              isOptionAllowed(['admin', 'manager', 'dec-executive'])
              && (
                <SidebarLink title="Casos y tareas" icon="lnr lnr-inbox" route="/casos" onClick={this.hideSidebar} />
              )
            }
            {
              isOptionAllowed(['admin', 'manager', 'sales-executive'])
              && (
              <SidebarLink
                title="Cotizaciones"
                icon="lnr lnr-license"
                route="/cotizaciones"
                onClick={this.hideSidebar}
              />
              )
            }
            <SidebarLink title="Contactos" icon="lnr lnr-user" route="/contactos" onClick={this.hideSidebar} />
          </div>
          <div>
            {
              show
              && (
                <SidebarLink
                  title="Usuarios y roles"
                  icon="lnr lnr-users"
                  route="/usuarios"
                  onClick={this.hideSidebar}
                />
              )
            }
            {
              isOptionAllowed(['admin', 'manager'])
              && (
                <Fragment>
                  <SidebarLink
                    title="Tipificación"
                    icon="lnr lnr-indent-increase"
                    route="/tipificacion"
                    onClick={this.hideSidebar}
                  />
                  <SidebarLink
                    title="Administración"
                    icon="lnr lnr-cog"
                    route="/configuracion"
                    onClick={this.hideSidebar}
                  />
                  <SidebarLink
                    title="Plantillas"
                    icon="lnr lnr-file-add"
                    route="/templates"
                    onClick={this.hideSidebar}
                  />
                </Fragment>
              )
            }
          </div>
        </ul>
      </div>
    );
  }
}

export default SidebarContent;
