import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { MantineProvider } from '@mantine/core';

test('renders learn react link', () => {
  render(
    <MantineProvider> 
      <App />
    </MantineProvider>
 );
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});