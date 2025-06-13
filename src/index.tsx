import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; 
import App from './App'; 
import reportWebVitals from './reportWebVitals';
import { MantineProvider, createTheme } from '@mantine/core'; 
import '@mantine/core/styles.css'; 

const theme = createTheme({
  primaryColor: 'cyan',

  fontFamily: 'Roboto, sans-serif',
  });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MantineProvider theme={theme}> {}
      <App />
    </MantineProvider>
  </React.StrictMode>
);

reportWebVitals();