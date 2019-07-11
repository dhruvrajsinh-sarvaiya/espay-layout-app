/**
 * Active User Component
 */
import React, { Fragment } from "react";
import { Link } from "react-router-dom";

// intl messages
import IntlMessages from "Util/IntlMessages";

const ReferralBannerBlk = () => {
  return (
    <Fragment>
      <div className="card p-15 mb-15 text-center">
        <Link to="/app/my-account/referral-program">
          <IntlMessages id="my_account.referralProgramBanner" />
        </Link>
      </div>
    </Fragment>
  );
};

export default ReferralBannerBlk;
