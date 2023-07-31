import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  HashRouter,
  Routes,
  Route
} from "react-router-dom"
import './index.css'
import { FormatFile } from './components/FormatFile'
import { MissingCRN } from './components/MissingCRN'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<FormatFile />} />
        <Route path="/missing" element={<MissingCRN />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
)


