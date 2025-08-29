import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './context/ThemeContext.jsx';
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap css
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; //bootstrap js
import { ToastContainer } from 'react-toastify'; //toastify container declaration
import 'react-toastify/dist/ReactToastify.css'; // react toastify css
import 'react-datepicker/dist/react-datepicker.css'; //datepicker css
import 'bs-stepper/dist/css/bs-stepper.min.css'; //bs-stepper css
import 'react-calendar/dist/Calendar.css'; //react-calender css
import 'react-phone-input-2/lib/style.css' //phone number flags css
import 'react-vertical-timeline-component/style.min.css'; //vertical timeline css
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App /> 
      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeProvider>
  </StrictMode>,
)
