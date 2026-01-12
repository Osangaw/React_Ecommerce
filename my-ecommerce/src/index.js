import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Change this import to 'react-router-dom'
import { BrowserRouter } from "react-router-dom"; 
import store from "./store/index";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById('root'));

window.store = store;

root.render(
  <Provider store={store}>
    <BrowserRouter> {/* ✅ Router must wrap the App */}
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  </Provider>
);

reportWebVitals();