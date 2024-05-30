import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  HashRouter,
  Routes,
  Route
} from "react-router-dom"
import './index.css'
import { Home } from './components/Home'
import { FormatFile } from './components/enrollment/FormatFile'
import { MissingCRN } from './components/enrollment/MissingCRN'
import { BuyingD } from './components/decisions/BuyingD'
import { NewBD } from './components/decisions/NewBD'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/enrollment" element={<FormatFile />} />
        <Route path="/missing" element={<MissingCRN />} />
        <Route path="/buying" element={<NewBD />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
)


