/**
 * CreatedBy : Kevin Ladani
 * Date : 29/09/2018
 */
/**
 * Create Profile
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { CreateProfileWdgt } from "Components/MyAccount";

export default class CreateProfile extends Component {
  render() {
    return (
      <div>
        <PageTitleBar
          title={<IntlMessages id="profiles.createNewProfile" />}
          match={this.props.match}
        />
        <JbsCollapsibleCard customClasses="col-lg-9 mx-auto">
          <CreateProfileWdgt />
        </JbsCollapsibleCard>
      </div>
    );
  }
}
