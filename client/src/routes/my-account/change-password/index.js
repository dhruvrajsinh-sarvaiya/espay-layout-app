/**
 * Agency Dashboard
 */
import React, { Component, Fragment } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { ChangePasswordWdgt } from "Components/MyAccount";

export default class ChangePassword extends Component {
  render() {
    return (
      <Fragment>
        <PageTitleBar title={<IntlMessages id="sidebar.changepassword" />} match={this.props.match} />
        <ChangePasswordWdgt />
      </Fragment>
    );
  }
}
