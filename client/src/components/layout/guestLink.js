import React from 'react';
import { Link } from 'react-router-dom'; 

let guestLinks = {};
export default guestLinks = (
  //return (
    <ul className="navbar-nav ml-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/register">
          Sign Up
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/login">
          Login
        </Link>
      </li>
    </ul>
  //  )
);