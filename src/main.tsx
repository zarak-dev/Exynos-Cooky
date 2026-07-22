// AFTER
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { ConfigProvider, App as AntApp } from 'antd';
import { store } from './store';
import './index.css'
import App from './App.tsx'

const theme = {
  token: {
    colorPrimary: '#00009c',
    borderRadius: 0,
    fontFamily: "'Poppins', sans-serif",
  },
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <AntApp>
          <App />
        </AntApp>
      </ConfigProvider>
    </Provider>
  </StrictMode>,
)