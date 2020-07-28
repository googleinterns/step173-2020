import React from 'react';
import ReactDOM from 'react-dom';
import Filter from './Filter';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Filter label = "Minimum Age" value={21} menu={[8, 10, 14, 16, 21]}
    onChange={(v) => setMinAge(v)} />, div);
});