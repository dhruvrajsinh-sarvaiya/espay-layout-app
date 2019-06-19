/**
 * Update By Sanjay 14/02/2019
 */
import React, { Component, Fragment } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import {
  // ReferralTopCommissionWdgt,
  ReferralProgramDetailsWdgt,
  ReferralWithoutLoginBlk,
  ReferralDetailBlk,
  // ReferralFriendsTableWdgt,
  // ReferralLatestCommissionHistoryTableWdgt,
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
        {/* <h2 className="heading pb-10 mb-20 border-bottom">
          <IntlMessages id="sidebar.referralProgram" />
        </h2> */}
        {/* <div className="mb-20">
          <ReferralTopCommissionWdgt />
        </div> */}
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
      {/* <div className="mb-20 row">
        <div className="col-md-6 col-sm-12">
          <ReferralFriendsTableWdgt />
        </div>
        <div className="col-md-6 col-sm-12">
          <ReferralLatestCommissionHistoryTableWdgt />
        </div>
      </div> */}
    </Fragment>
  );
};
