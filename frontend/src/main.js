import React from 'react'
import App from './App.jsx'
import "./styles/index.css"
import "./styles/slider.css"
import * as ReactDOMClient from "react-dom/client.js";

const rootId = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootId);
root.render(<App />);
