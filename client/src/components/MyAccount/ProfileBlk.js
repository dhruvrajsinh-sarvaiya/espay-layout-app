/**
 * Active User Component
 */
import React, { Fragment } from "react";
import { Link } from "react-router-dom";

// intl messages
import IntlMessages from "Util/IntlMessages";
import { Button } from "@material-ui/core";

const ProfileBlk = () => {
  return (
    <Fragment>
      <div className="card p-15 mb-15">
        <div className="row">
          <div className="col-md-9">
            <span className="d-flex">
              <i className="material-icons mr-10">lock</i>
              <h2>
                <IntlMessages id="my_account.profile" />
              </h2>
            </span>
          </div>
          <div className="col-md-3 text-right">
            <Button
              component={Link}
              to="/app/my-account/edit-profile"
              className="text-white btn-primary h-25 font-weight-bold"
            >
              <IntlMessages id="sidebar.btnEdit" />
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProfileBlk;
