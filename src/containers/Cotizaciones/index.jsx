import React from 'react';
// import { Link } from 'react-router-dom';
// import FacebookIcon from 'mdi-react/FacebookIcon';
// import GooglePlusIcon from 'mdi-react/GooglePlusIcon';
import CotizacionesContent from './components/CotizacionesContent';
// import JuanForm from '../testPabon/components/JuanForm';

const Panel = props => (
  <CotizacionesContent {...props} />
);

export default Panel;

// if you want to add select, date-picker and time-picker in your app you need to uncomment the first
// four lines in /scss/components/form.scss to add styles
