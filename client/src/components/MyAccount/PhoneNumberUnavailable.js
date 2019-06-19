/**
 * Active User Component
 */
import React, { Component, Fragment } from "react";

import { Input, Button } from "reactstrap";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";

// intl messages
import IntlMessages from "Util/IntlMessages";

export default class PhoneNumberUnavailable extends Component {
  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { data } = this.state;
    return (
      <Fragment>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            <IntlMessages id="my_account.resetSMSAuth" />
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <IntlMessages id="my_account.resetSMSAuthTxt1" />
              <Divider className="mt-5 mb-5" />
              <div className="row mt-5 mb-5">
                <div className="col-md-11">
                  <IntlMessages id="my_account.resetSMSAuthTxt2" />
                </div>
                <div className="col-md-1">
                  <Input type="radio" name="type1" />
                </div>
              </div>
              <div className="row mt-5 mb-5">
                <div className="col-md-11">
                  <IntlMessages id="my_account.resetSMSAuthTxt3" />
                </div>
                <div className="col-md-1">
                  <Input type="radio" name="type2" />
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="raised"
              onClick={this.handleClose}
              color="primary"
              className="text-white float-right"
            >
              <IntlMessages id="sidebar.btnConfirmYourResetRequest" />
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}
