/* eslint-disable max-len */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import SettingsIcon from 'mdi-react/SettingsIcon';
import {
  Collapse,
  // Button,
} from 'reactstrap';
import ReactInterval from 'react-interval';
import TopbarSidebarButton from './TopbarSidebarButton';
import TopbarProfile from './TopbarProfile';
import TopbarNotification from './TopbarNotification';
import {
  getNotifications,
} from '../../../redux/actions/resourcesActions';
// import TopbarSearch from './TopbarSearch';

class Topbar extends PureComponent {
  static propTypes = {
    changeMobileSidebarVisibility: PropTypes.func.isRequired,
    changeSidebarVisibility: PropTypes.func.isRequired,
  };

    state ={
      isOpen: false,
      notifiaciones: [],
      flatOpen: false,
      howManyIsPrepaid: 0,
      // open: true,
    }

    componentDidMount() {
      this.props.getNotifications((body) => {
        this.setState({ notifiaciones: body });
        let flat = 0;
        let PrepaidInternal = 0;
        body.map((Notification) => {
          if (Notification.readed === false) {
            flat += 1;
          }
          if (Notification.isPrepaidInternal) {
            PrepaidInternal += 1;
          }
        });
        if (flat > 0) {
          this.setState({ flatOpen: true });
        } else {
          this.setState({ flatOpen: false });
        }
        if (PrepaidInternal > 0) {
          this.setState({ isOpen: true, howManyIsPrepaid: PrepaidInternal });
        } else {
          this.setState({ isOpen: false });
        }
      });
    }

    toggle = isOk => () => {
      if (isOk) {
        this.setState({ isOpen: true });
      } else {
        this.setState({ isOpen: false });
        this.props.history.push('/casos?onlyNotClosed=true&subtype=5da7b31d50f7c166411ea241&type=5d03ca2e4bed563b7bef6955');
      }
    }

    render() {
      const { changeMobileSidebarVisibility, changeSidebarVisibility, title } = this.props;
      let flat = 0;
      let PrepaidInternal = 0;

      return (
        <div className="topbar">
          <div className="topbar__wrapper">
            <div className="topbar__left">
              <TopbarSidebarButton
                changeMobileSidebarVisibility={changeMobileSidebarVisibility}
                changeSidebarVisibility={changeSidebarVisibility}
              />
              <div className="top_title">
                <strong>{title || ''}</strong>
              </div>
            </div>
            <div className="topbar__right">
              {/* <TopbarSearch /> */}
              <ReactInterval
                timeout={30000}
                enabled
                callback={() => this.props.getNotifications((body) => {
                  body.map((Notification) => {
                    if (Notification.readed) {
                      flat += 1;
                    }
                    if (Notification.isPrepaidInternal) {
                      PrepaidInternal += 1;
                    }
                  });
                  if (flat > 0) {
                    this.setState({ flatOpen: true });
                  } else {
                    this.setState({ flatOpen: false });
                  }
                  if (PrepaidInternal > 0) {
                    this.setState({ isOpen: true, howManyIsPrepaid: PrepaidInternal });
                  } else {
                    this.setState({ isOpen: false });
                  }
                  this.setState({ notifiaciones: body });
                })}
              />
              <TopbarNotification
                notifiaciones={this.state.notifiaciones}
                flatOpen={this.state.flatOpen}
              />
              {/* <a className="topbar__btn" href="/">
              <SettingsIcon />
            </a> */}
              <TopbarProfile />
            </div>
          </div>
          {/* <Button color="primary" onClick={this.toggle(true)} style={{ marginBottom: '1rem' }}>Toggle</Button> */}
          <Collapse isOpen={this.state.isOpen} onClick={this.toggle(false)}>
            <div className="isPrepaidEmail">
              <span>Tienes ({this.state.howManyIsPrepaid}) nuevos casos de prepago por renovación.</span>
            </div>
          </Collapse>
        </div>
      );
    }
}


const mapStateToProps = ({ resources, topbar }) => ({
  loadingNotifications: resources.loadingNotifications,
  notifications: resources.notifications,
  title: topbar.title,
});


const mapDispatchToProps = {
  getNotifications,
};
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(Topbar);


// export default connect(mapStateToProps)(Topbar);
