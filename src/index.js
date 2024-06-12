import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  HashRouter,
  Routes,
  Route
} from "react-router-dom"
import './index.css'
import { Home } from './components/Home'
import { BuyingDHome } from './components/decisions/BuyingDHome'
import { EnrollHome } from './components/enrollment/EnrollHome'
import { AdoptionHome } from './components/adoptions/AdoptionHome'
import { DevHome } from './components/dev/DevHome'


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/enrollment" element={<EnrollHome />} />
        <Route path="/buying" element={<BuyingDHome />} />
        <Route path="/adoptions" element={<AdoptionHome />} />
        <Route path="/dev" element={<DevHome />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
)


