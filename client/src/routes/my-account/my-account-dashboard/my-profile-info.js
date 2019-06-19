/**
 * My Profile Info
 */
import React, { Component, Fragment } from "react";

// My Account Import
import { MyProfileInfoWdgt } from "Components/MyAccount";
import { Card } from 'reactstrap';

// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

export default class myPortfolioInfo extends Component {
  render() {
    return (
      <Fragment>
        {/* <JbsCollapsibleCard> */}
          <Card>
          <MyProfileInfoWdgt />
          </Card>
        {/* </JbsCollapsibleCard> */}
      </Fragment>
    );
  }
}
