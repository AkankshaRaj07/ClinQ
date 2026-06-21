import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QueueProvider } from './context/QueueContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueueProvider>
      <App />
    </QueueProvider>
  </React.StrictMode>,
)
