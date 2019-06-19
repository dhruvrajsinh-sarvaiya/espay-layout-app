/**
 * Active User Component
 */
import React, { Component, Fragment } from "react";
// intl messages
import IntlMessages from "Util/IntlMessages";

class ReferralProgramDetailsWdgt extends Component {
  render() {
    const i = 1;
    return (
      <Fragment>
        <div className="card py-15 px-50">
          <h2 className="heading pb-10 mb-20 text-center">
            <span className="border-bottom border-warning">
              <IntlMessages id="sidebar.programDetails" />
            </span>
          </h2>
          <div className="program_detail_info mb-25">
            <p>
              <IntlMessages id="my_account.referralProgramDetailInfo" />
            </p>
            <p>
              <IntlMessages id="my_account.referralProgramDetailInfo1" />
            </p>
            <p>
              <IntlMessages id="my_account.referralProgramDetailInfo2" />
            </p>
            <p>
              <IntlMessages id="my_account.referralProgramDetailInfo3" />
            </p>
            <p>
              <IntlMessages id="my_account.referralProgramDetailInfo4" />
            </p>
            <p>
              <IntlMessages id="my_account.referralProgramDetailInfo5" />
            </p>
          </div>
          <div className="update_notes">
            <p className="text-warning font-weight-bold">
              <IntlMessages id="sidebar.importantNotice" />
            </p>
            <p>
              <IntlMessages id="my_account.referralProgramNotes" />
            </p>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default ReferralProgramDetailsWdgt;
