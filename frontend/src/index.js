// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App';
// import 'bootstrap/dist/css/bootstrap.min.css';
// const root = createRoot(document.getElementById('root'));
// root.render(<App />);
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
