import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  HashRouter,
  Routes,
  Route
} from "react-router-dom"
import './index.css'
import { Home } from './components/Home'
import { FormatFile } from './components/FormatFile'
import { MissingCRN } from './components/MissingCRN'
import { BuyingD } from './components/BuyingD'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/enrollment" element={<FormatFile />} />
        <Route path="/missing" element={<MissingCRN />} />
        <Route path="/buying" element={<BuyingD />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
)


