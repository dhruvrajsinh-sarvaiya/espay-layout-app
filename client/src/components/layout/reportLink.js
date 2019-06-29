import React from 'react';
import { Link } from 'react-router-dom';

let authLinks = {};

export default authLinks = (

  <ul className="navbar-nav ml-auto">
    <li className="nav-item">
      <Link className="nav-link" to="/feed">
        Post Feed
      </Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link" to="/dashboard">
        Dashboard
      </Link>
    </li>
  </ul>
)
