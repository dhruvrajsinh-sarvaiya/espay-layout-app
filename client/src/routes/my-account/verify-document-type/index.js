/**
 * Agency Dashboard
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { VerifyDocumentTypeWdgt } from "Components/MyAccount";

export default class VerifyDocumentType extends Component {
  render() {
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.verifyDocuments" />}
          match={this.props.match}
        />
        <JbsCollapsibleCard customClasses="col-sm-8 col-lg-5 mx-auto p-0">
          <VerifyDocumentTypeWdgt />
        </JbsCollapsibleCard>
      </div>
    );
  }
}
