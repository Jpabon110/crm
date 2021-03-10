import React from 'react';
import LogInForm from './components/LogInForm';

const LogIn = props => (
  <div className="account">
    <div className="account__wrapper rectangle">
      <div className="account__card">
        <LogInForm {...props} />
      </div>
    </div>
  </div>
);

export default LogIn;

// if you want to add select, date-picker and time-picker in your app you need to uncomment the first
// four lines in /scss/components/form.scss to add styles
