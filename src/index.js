import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  HashRouter,
  Routes,
  Route
} from "react-router-dom"
import './index.css'
import { Home } from './components/Home'
import { BuyingD } from './components/decisions/BuyingD'
import { EnrollHome } from './components/enrollment/EnrollHome'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/enrollment" element={<EnrollHome />} />
        <Route path="/buying" element={<BuyingD />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
)


