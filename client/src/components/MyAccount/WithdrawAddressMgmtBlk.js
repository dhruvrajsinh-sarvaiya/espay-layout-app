/**
 * Active User Component
 */
import React, { Fragment } from "react";
import { Link } from "react-router-dom";

// intl messages
import IntlMessages from "Util/IntlMessages";
import { Button } from "@material-ui/core";

const WithdrawAddressMgmtBlk = () => {
  return (
    <Fragment>
      <div className="card">
        <div className="bg-secondary pt-20 pb-15 text-center text-white">
          <h3>
            <IntlMessages id="my_account.withdrawAddressManagement" />
          </h3>
        </div>
        <div className="row">
          <div className="col-md-9">
            <div className="media p-15">
              <div className="media-left">
                <i className="material-icons mr-10">chrome_reader_mode</i>
              </div>
              <div className="media-body">
                <p>
                  <IntlMessages id="my_account.withdrawAddressManagementInfo" />
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <Button
              component={Link}
              to="/app/my-account/withdraw-address-management"
              className="btn-primary text-white m-10 h-20 font-weight-bold"
            >
              <IntlMessages id="sidebar.btnAddressManagement" />
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default WithdrawAddressMgmtBlk;
