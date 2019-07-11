/* 
    Developer : Kevin Ladani
    Date : 23-11-2018
    File Comment : MyAccount Personal Dashboard Component
*/
import React, { Component, Fragment } from "react";
import "rc-drawer/assets/index.css";
import PresonalDashboardWdgt from "./Dashboards/PresonalDashboard";

// Component for MyAccount Organization dashboard
class PresonalDashboard extends Component {
render() {
    return (
      <Fragment>
        <PresonalDashboardWdgt></PresonalDashboardWdgt>
      </Fragment>
    );
  }
}

export default PresonalDashboard;
