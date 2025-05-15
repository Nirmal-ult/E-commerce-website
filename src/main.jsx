import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';  // No need to wrap with Router here
import { BrowserRouter as Router } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <Router>
    <App /> 
  </Router>
   // Directly render App without BrowserRouter here
);
