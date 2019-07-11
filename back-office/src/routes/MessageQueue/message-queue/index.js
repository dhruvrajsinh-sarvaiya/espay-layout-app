/*
 * CreatedBy : Megha Kariya
 * Date : 15-01-2019
 * Comment : Message queue routes
 */
/**
 * Display Messages
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { MessageQueueWdgt } from "Components/MessageQueue";

export default class Risks extends Component {
  render() {
    return (
      <div className="data-table-wrapper mb-20">
        <PageTitleBar
          title={<IntlMessages id="report.messageQueue.displayMessage" />}
          match={this.props.match}
        />
        <MessageQueueWdgt />
      </div>
    );
  }
}
