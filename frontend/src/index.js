import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Teacher from "./components/Teacher";
import Students from "./components/Students";
import "bootstrap/dist/css/bootstrap.min.css";
import MyNav from "./components/MyNav";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MyNav></MyNav>
      <div className="container">
        <Routes>
        <Route path="/" element={<Teacher></Teacher>}></Route>
        <Route path="/students" element={<Students></Students>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
