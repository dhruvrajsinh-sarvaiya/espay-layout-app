/**
 * ESPAY FINTECH - A Material Design Admin Template
 * Copyright 2018 All Rights Reserved
 * Made Wih Love
 * Created By ESPAY
 */
import React from 'react';
import ReactDOM from 'react-dom';

// helper for common functions
import { setSessionToken, setSitesetting } from "Helpers/helpers";


setSessionToken();
//Added By kushal : For Get sitesetting from database

setTimeout(() => {
  setSitesetting();
}, 3000);

// Save a reference to the root element for reuse
const rootEl = document.getElementById("root");

// Create a reusable render method that we can call more than once
let render = () => {
  // Dynamically import our main App component, and render it
  const MainApp = require('./App').default;
  ReactDOM.render(
    <MainApp />,
    rootEl
  );
};

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render(
      <NextApp />,
      rootEl
    );
  });
}

// wait till token not generated and stored in localstorage
var temp = 1;
var myTimer = setInterval(checkMyValue, 100);

function checkMyValue() {
  var response = localStorage.getItem('front_access_token');
  if (response) {
    clearInterval(myTimer);
    render();
  }
  temp++;
}