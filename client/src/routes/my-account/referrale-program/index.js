/**
 * Update By Sanjay 14/02/2019
 */
import React, { Component, Fragment } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import {
  ReferralProgramDetailsWdgt,
  ReferralWithoutLoginBlk,
  ReferralDetailBlk,
  ReferralCountCardsWdgt
} from "Components/MyAccount/ReferralProgram";

export default class ReferraleProgram extends Component {
  render() {
    const user_id = localStorage.getItem("user_id");
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.referralProgram" />}
          match={this.props.match}
        />
        {user_id !== "" ? (
          <WithLoginReferralBlk />
        ) : (
            <WithoutLoginReferralBlk />
          )}
        <div className="mb-20">
          <ReferralProgramDetailsWdgt />
        </div>
      </div>
    );
  }
}

const WithoutLoginReferralBlk = () => {
  return (
    <Fragment>
      <div className="mb-20">
        <ReferralWithoutLoginBlk />
      </div>
    </Fragment>
  );
};

const WithLoginReferralBlk = () => {
  return (
    <Fragment>
      <div className="mb-20">
        <ReferralDetailBlk />
      </div>
      <div className="mb-10">
        <ReferralCountCardsWdgt />
      </div>
    </Fragment>
  );
};
