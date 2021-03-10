import React from 'react';
// import { Link } from 'react-router-dom';
// import FacebookIcon from 'mdi-react/FacebookIcon';
// import GooglePlusIcon from 'mdi-react/GooglePlusIcon';
import Forgoten from './components/ForgotenForm';
// import JuanForm from '../testPabon/components/JuanForm';

const LogIn = props => (
  <div className="account">
    <div className="account__wrapper rectangle">
      <div className="account__card">
        <Forgoten {...props} />
      </div>
    </div>
  </div>
);

export default LogIn;

// if you want to add select, date-picker and time-picker in your app you need to uncomment the first
// four lines in /scss/components/form.scss to add styles
