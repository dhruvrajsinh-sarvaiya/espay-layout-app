/**
 * My Profile Info
 */
import React, { Component, Fragment } from "react";

// My Account Import
import { MyProfileInfoWdgt } from "Components/MyAccount";
import { Card } from 'reactstrap';

export default class myprofileinfo extends Component {
  render() {
    return (
      <Fragment>
        <Card>
          <MyProfileInfoWdgt />
        </Card>
      </Fragment>
    );
  }
}
