import React from 'react';

import MiCuentaComponent from './components/MiCuentaComponent';

const Panel = props => (
  <MiCuentaComponent {...props} />
);

export default Panel;

// if you want to add select, date-picker and time-picker in your app you need to uncomment the first
// four lines in /scss/components/form.scss to add styles
