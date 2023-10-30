import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import StoreProvider from './redux/store'

import 'antd/dist/reset.css'
import '@ant-design/icons'
import './index.css'
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>,
)
