import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ThemedApp from "./ThemedApp.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   { <ThemedApp/> }
   {/* { <App /> } */}
  </StrictMode>,
)
