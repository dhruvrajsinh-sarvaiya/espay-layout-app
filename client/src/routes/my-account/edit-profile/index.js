/**
 * Edit Profile Index Page (code added by Parth Jani 20-9-2018)
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { EditProfileWdgt } from "Components/MyAccount";

export default class EditProfile extends Component {
  render() {
    const { match } = this.props;
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.editProfile" />}
          match={match}
        />
        <JbsCollapsibleCard>
          <EditProfileWdgt />
        </JbsCollapsibleCard>
      </div>
    );
  }
}
