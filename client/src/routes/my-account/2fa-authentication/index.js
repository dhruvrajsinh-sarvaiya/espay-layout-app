/**
 * Agency Dashboard
 */
import React, { Component } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

import {
  TwoFAGoogleAuthentication,
  TwoFASMSAuthentication
} from "Components/MyAccount";

export default class TwoFaAuthentication extends Component {
  state = {
    activeIndex: 0
  };

  handleChange(event, value) {
    this.setState({
      activeIndex: value
    });
  }

  render() {
    const { activeIndex } = this.state;

    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="my_account.2faAuthentication" />}
          match={this.props.match}
        />
        <JbsCollapsibleCard customClasses="col-sm-8 col-lg-4 mx-auto">
          <div className="mb-0">
            <h2 className="heading mb-30 text-center">2FA</h2>
            <div>
              <Tabs
                value={activeIndex}
                onChange={(e, value) => this.handleChange(e, value)}
              >
                <Tab
                  className="col-md-6"
                  label={
                    <h3>
                      <IntlMessages id="my_account.google_authentication" />
                    </h3>
                  }
                />
                <Tab
                  className="col-md-6"
                  label={
                    <h3>
                      <IntlMessages id="my_account.sms_authentication" />
                    </h3>
                  }
                />
              </Tabs>
              <div className="pt-25 pb-25">
                {activeIndex === 0 && <TwoFAGoogleAuthentication />}
                {activeIndex === 1 && <TwoFASMSAuthentication />}
              </div>
            </div>
          </div>
        </JbsCollapsibleCard>
      </div>
    );
  }
}
