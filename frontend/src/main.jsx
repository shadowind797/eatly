import React from 'react'
import App from './App.jsx'
import "./styles/index.css"
import "./styles/slider.css"
import {createRoot} from "react-dom/client";

const rootId = document.getElementById("root");
const root = createRoot(rootId);
root.render(<App />);
