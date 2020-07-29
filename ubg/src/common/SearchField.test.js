import React from 'react';
import ReactDOM from 'react-dom';
import SearchField from './SearchField';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SearchField />, div);
});
