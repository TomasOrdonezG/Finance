import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { TransactionsPage } from "./pages/TransactionsPage/TransactionsPage";
import Home from "./pages/Home/Home";

const logo = require("./assets/finance-logo1k.png");

function App() {
  const location = useLocation();
  const activeLink = location.pathname;

  return (
    <div className="app">
      <nav className="main-nav">
        <div className="logo-container">
          <img src={logo} width={85} height={85} alt="finance-logo" />
          <h1>Finance</h1>
        </div>

        <ul>
          <li key="chequings">
            <Link to="/chequings" className={activeLink === "/chequings" ? "active" : ""}>
              Chequings
            </Link>
          </li>
          <li key="cash">
            <Link to="/cash" className={activeLink === "/cash" ? "active" : ""}>
              Cash
            </Link>
          </li>
          <li key="home">
            <Link to="/" className={activeLink === "/" ? "active" : ""}>
              Home
            </Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chequings" element={<TransactionsPage account="chequings" />} />
        <Route path="/cash" element={<TransactionsPage account="cash" />} />
      </Routes>
    </div>
  );
}

export default App;
