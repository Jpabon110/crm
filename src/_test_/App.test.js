/* eslint-disable array-callback-return */
/* eslint-disable no-undef */
// import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('TableInfo', () => {
  it('Conocer estructura de la variable studens', () => {
    const studens = [{ name: 'Marco', minutes: 142, days: 2 }];

    studens.map((studen) => {
      expect(studen.name).toBeDefined();
      expect(studen.minutes).toBeDefined();
      expect(studen.days).toBeDefined();
    });
  });

  it('Verificar valor de la función comparer', () => {
    // const studens = { name: 'Marco', minutes: 142, days: 2 };

    const compare = jest.fn((a, b) => {
      let comparison = 0;
      if (b.minutes > a.minutes) {
        comparison = 1;
      } else if (b.minutes < a.minutes) {
        comparison = -1;
      }
      return comparison;
    });

    // const wrapper = shallow(
    //   <TableInfo
    //     studens={studens}
    //     compare={compare}
    //   />,
    // );

    compare({ name: 'Marco', minutes: 102 }, { name: 'juan', minutes: 142 });
    expect(compare).toHaveReturnedWith(1 || -1);
  });
});
