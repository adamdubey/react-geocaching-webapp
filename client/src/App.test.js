import React from 'react';
import { render } from '@testing-library/react';
import App from './pages/App';

test('renders app text', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/App/i);
  expect(linkElement).toBeInTheDocument();
});