/**
 * Active User Component
 */
import React, { Component, Fragment } from "react";

// intl messages
import IntlMessages from "Util/IntlMessages";

const topCommission = [
  {
    email: "test@test.com",
    commission: "178.76453349 BTC",
    format_email: "ja***@***.com"
  },
  {
    email: "test@test.com",
    commission: "158.76453349 BTC",
    format_email: "mi***@***.com"
  },
  {
    email: "test@test.com",
    commission: "128.76453349 BTC",
    format_email: "he***@***.com"
  }
];

class ReferralTopCommissionWdgt extends Component {
  render() {
    let i = 1;
    return (
      <Fragment>
        <div className="top_commission_blk row">
          {topCommission &&
            topCommission.map((obj, index) => (
              <div className="col-md-4" key={index}>
                <div className="card p-10">
                  <div className="media">
                    <div className="media-left border h-100 font-2x p-10 rounded mr-30 font-weight-bold">
                      {i}
                    </div>
                    <div className="media-left pt-15 mr-50">
                      <p className="m-0">
                        <IntlMessages id="sidebar.no" /> {i++}
                      </p>
                      <p className="m-0 font-weight-bold">{obj.format_email}</p>
                    </div>
                    <div className="media-left pt-15">
                      <p className="m-0">
                        <IntlMessages id="sidebar.commission" />
                      </p>
                      <p className="m-0 font-weight-bold">{obj.commission}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </Fragment>
    );
  }
}

export default ReferralTopCommissionWdgt;
