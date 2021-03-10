/* eslint-disable array-callback-return */
/* eslint-disable react/self-closing-comp */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import { Collapse } from 'reactstrap';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import NotificationsIcon from 'mdi-react/NotificationsIcon';
// import ReactInterval from 'react-interval';
import {
  getNotifications,
} from '../../../redux/actions/resourcesActions';
import avatarDefault from '../../../shared/img/avatar-default.jpg';

class TopbarNotification extends PureComponent {
  constructor() {
    super();
    this.state = {
      collapse: false,
      // notifiaciones: [],
      // flatOpen: false,
    };
  }

  componentDidMount() {
    // this.props.getNotifications((body) => {
    //   this.setState({ notifiaciones: body });
    //   let flat = 0;
    //   body.map((Notification) => {
    //     if (Notification.readed === false) {
    //       flat += 1;
    //     }
    //     if (flat > 0) {
    //       this.setState({ flatOpen: true });
    //     } else {
    //       this.setState({ flatOpen: false });
    //     }
    //   });
    // });
  }

  toggle = () => {
    this.setState(prevState => ({ collapse: !prevState.collapse }));
  };

  render() {
    const { collapse } = this.state;
    const { notifiaciones, flatOpen } = this.props;

    return (
      <div className="topbar__collapse">
        {/* <ReactInterval
          timeout={30000}
          enabled
          callback={() => this.props.getNotifications((body) => {
            let flat = 0;
            body.map((Notification) => {
              if (Notification.readed === false) {
                flat += 1;
              }
              if (flat > 0) {
                this.setState({ flatOpen: true });
              } else {
                this.setState({ flatOpen: false });
              }
            });
            this.setState({ notifiaciones: body });
          })}
        /> */}
        <button className="topbar__btn topbar__btn--new" type="button" onClick={this.toggle}>
          <NotificationsIcon />
          {(flatOpen === true) && (
          <div className="topbar__btn-new-label"><div></div></div>
          )}
        </button>
        {collapse && <button className="topbar__back" type="button" onClick={this.toggle} />}
        <Collapse
          isOpen={collapse}
          className="topbar__collapse-content"
        >
          <div className="topbar__collapse-title-wrap">
            <p className="topbar__collapse-title">Notificaciones</p>
            {/* <button className="topbar__collapse-button" type="button">Marcar todas como leídas</button> */}
          </div>
          <div style={{ overflowY: 'scroll', height: '200px' }}>
            {notifiaciones.map((notification, index) => (
              <div className="topbar__collapse-item" key={index}>
                <a href={notification.type === 'case' ? `/casos/${notification.objective}` : `/cotizaciones/${notification.objective}`}>
                  <div className="topbar__collapse-img-wrap">
                    <img className="topbar__collapse-img" src={avatarDefault} alt="" />
                  </div>
                  <p className="topbar__collapse-message">
                    <span className="topbar__collapse-name">{notification.name}</span>
                    {notification.body}
                  </p>
                  <p className="topbar__collapse-date">{notification.date}</p>
                </a>
              </div>
            ))}
          </div>
          {/* <Link className="topbar__collapse-link" to="/dashboard_default" onClick={this.toggle}>
            ver todas las notifiaciones
          </Link> */}
        </Collapse>
      </div>
    );
  }
}

const mapStateToProps = ({ resources }) => ({
  loadingNotifications: resources.loadingNotifications,
  notifications: resources.notifications,
});


const mapDispatchToProps = {
  getNotifications,
};
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(TopbarNotification);
