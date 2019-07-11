/*
 * CreatedBy : Megha Kariya
 * Date : 17-01-2019
 * Comment : push Message routes
 */
/**
 * Display Users for Message
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { PushMessageWdgt } from "Components/PushMessage";

export default class Messages extends Component {
  render() {
    return (
      <div className="data-table-wrapper mb-20">
        <PageTitleBar
          title={<IntlMessages id="sidebar.pushMessage" />}
          match={this.props.match}
        />
        <PushMessageWdgt />
      </div>
    );
  }
}
