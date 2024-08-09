import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

export default function NavBar() {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contacts">Contact</Link>
        </li>
        <li>
          <Link to="/cryptoprices">Cryptoprices</Link>
        </li>
        <li>
          <Link to="/incomplete">Incomplete</Link>
        </li>
      </ul>
    </nav>
  );
}
