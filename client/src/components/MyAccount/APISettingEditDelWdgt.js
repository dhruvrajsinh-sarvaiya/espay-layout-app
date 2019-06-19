/**
 * API Setting Form Component
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import MatButton from "@material-ui/core/Button";
import { Label, FormGroup, Input, Button } from "reactstrap";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

// intl messages
import IntlMessages from "Util/IntlMessages";

//Import Forgot password...
import {
  apiSettingSave,
  apiSettingEdit,
  apiSettingDelete
} from "Actions/MyAccount";

const validateAPISetting = require("../../validation/MyAccount/api_setting_form");

class APISettingEditDelWdgt extends Component {
  constructor(props) {
    super();
    this.state = {
      open: false,
      delete_all: false,
      api_key:
        "PLxx6EOXRErP4IYDvr35RynTMc9BricwBHvT2XtD9PY2ZOGP2XUpSssYHmPxUmtl",
      secret_key: "***",
      api_option: [],
      ip_access_rest: "2",
      current_ip: "45.116.123.43",
      trusted_ip: "",
      errors: {}
    };

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.deleteAllApi = this.deleteAllApi.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentWillReceiveProps(nextProps) {}

  handleClickOpen() {
    this.setState({ open: true });
  }

  deleteAllApi() {
    this.setState({ delete_all: true });
  }

  handleEdit() {
    this.props.apiSettingEdit(this.state);
  }

  handleDelete() {
    this.props.apiSettingDelete(this.state);
  }

  handleClose() {
    this.setState({ open: false, delete_all: false });
  }

  onChange(event) {
    var target = event.target;

    if (target.type === "checkbox") {
      if (target.checked) {
        this.state.api_option.push(target.value);
      } else {
        this.state.api_option.splice(
          this.state.api_option.indexOf(target.value),
          1
        );
      }
    } else {
      this.setState({ [target.name]: target.value });
    }
  }

  handleSave(event) {
    event.preventDefault();

    const { errors, isValid } = validateAPISetting(this.state);
    this.setState({ errors: errors });

    if (isValid) {
      this.props.apiSettingSave(this.state);
    }
  }

  render() {
    const {
      open,
      api_key,
      secret_key,
      current_ip,
      trusted_ip,
      delete_all,
      errors
    } = this.state;
    const withIcon = {
      fontSize: "150px"
    };
    return (
      <Fragment>
        <div className="mb-0">
          <form>
            <div className="text-right mb-20">
              <MatButton className="text-secondary" onClick={this.deleteAllApi}>
                <u>
                  <IntlMessages id="my_account.deleteAllAPI" />
                </u>
              </MatButton>
            </div>
            <div className="clearfix pb-10 border-bottom border-danger">
              <h2 className="heading float-left">
                <IntlMessages id="my_account.JBSLTestAPI" />
              </h2>
              <div className="float-right">
                <Button
                  className="btn ml-10"
                  color="primary"
                  onClick={this.handleSave}
                >
                  <IntlMessages id="sidebar.btnSave" />
                </Button>
                <Button
                  className="btn btn-orange ml-10"
                  onClick={this.handleEdit}
                >
                  <IntlMessages id="sidebar.btnEdit" />
                </Button>
                <Button
                  className="btn btn-danger ml-10"
                  onClick={this.handleClickOpen}
                >
                  <IntlMessages id="sidebar.btnDelete" />
                </Button>
              </div>
            </div>
            <div className="media border-bottom px-15 py-25">
              <div className="media-left mr-30">
                <i className="material-icons" style={withIcon}>
                  dashboard
                </i>
              </div>
              <div className="media-body">
                <h4>
                  <IntlMessages id="sidebar.apiKeyColon" />
                </h4>
                <p>{api_key}</p>
                <h4>
                  <IntlMessages id="sidebar.secretKeyColon" />
                </h4>
                <p>{secret_key}</p>
                <p className="m-0">
                  <IntlMessages id="my_account.optionColon" />
                </p>
                <div className="checkbox_area">
                  <div className="form-check form-check-inline">
                    <Input
                      className="form-check-input"
                      type="checkbox"
                      id="api_options1"
                      name="api_option"
                      value="1"
                      onChange={this.onChange}
                    />
                    <label className="form-check-label" htmlFor="api_options1">
                      <IntlMessages id="my_account.readInfo" />
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <Input
                      className="form-check-input"
                      type="checkbox"
                      id="api_options2"
                      name="api_option"
                      value="2"
                      onChange={this.onChange}
                    />
                    <label className="form-check-label" htmlFor="api_options2">
                      <IntlMessages id="my_account.enableTrading" />
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <Input
                      className="form-check-input"
                      type="checkbox"
                      id="api_options3"
                      name="api_option"
                      value="3"
                      onChange={this.onChange}
                    />
                    <label className="form-check-label" htmlFor="api_options3">
                      <IntlMessages id="my_account.enableWithdrawals" />
                    </label>
                  </div>
                </div>
                {errors.api_option && (
                  <div className="text-danger">
                    <IntlMessages id={errors.api_option} />
                  </div>
                )}
              </div>
            </div>
            <div className="media p-15">
              <div className="media-left mr-30">
                <IntlMessages id="my_account.ipAccessRestrictionColon" />
              </div>
              <div className="media-body">
                <div className="radio_area">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="ip_access_rest"
                      id="ip_access1"
                      value="1"
                      checked={this.state.ip_access_rest == "1"}
                      onChange={this.onChange}
                    />
                    <label className="form-check-label" htmlFor="inlineRadio1">
                      <IntlMessages id="my_account.restrictAccessIPNote" />
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="ip_access_rest"
                      id="ip_access2"
                      value="2"
                      checked={this.state.ip_access_rest == "2"}
                      onChange={this.onChange}
                    />
                    <label className="form-check-label" htmlFor="inlineRadio2">
                      <IntlMessages id="my_account.unrestrictedLessSecure" />
                    </label>
                  </div>
                </div>
                {errors.ip_access_rest && (
                  <div className="text-danger">
                    <IntlMessages id={errors.ip_access_rest} />
                  </div>
                )}
                <p className="m-0">
                  <IntlMessages id="my_account.yourCurrentIP" /> {current_ip}
                </p>
                <FormGroup>
                  <Label htmlFor="trusted_ip">
                    <IntlMessages id="my_account.trustedIPS" />
                  </Label>
                  <Input
                    type="text"
                    name="trusted_ip"
                    id="trusted_ip"
                    value={trusted_ip}
                    onChange={this.onChange}
                  />
                  {errors.trusted_ip && (
                    <div className="text-danger">
                      <IntlMessages id={errors.trusted_ip} />
                    </div>
                  )}
                </FormGroup>
                <p className="mb-10 helper-text">
                  <IntlMessages id="my_account.enteringMultipleIPNote" />
                </p>
              </div>
            </div>
          </form>
        </div>
        {/* Dialog for Delete All Api */}
        <Dialog open={delete_all} keepMounted onClose={this.handleClose}>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <IntlMessages id="my_account.allDelAPINote" />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="raised"
              onClick={this.handleClose}
              className="btn-danger text-white mr-10"
            >
              <IntlMessages id="sidebar.btnYes" />
            </Button>
            <Button
              variant="raised"
              onClick={this.handleClose}
              className="btn-success text-white mr-10"
            >
              <IntlMessages id="sidebar.btnNo" />
            </Button>
          </DialogActions>
        </Dialog>
        {/* Dialog for Perticular Single Api */}
        <Dialog open={open} keepMounted onClose={this.handleClose}>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <div>
                <IntlMessages id="my_account.permanentlyDelNote" />
              </div>
              <div className="font-weight-bold">{api_key}</div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="raised"
              onClick={this.handleDelete}
              className="btn-danger text-white mr-10"
            >
              <IntlMessages id="sidebar.btnYes" />
            </Button>
            <Button
              variant="raised"
              onClick={this.handleClose}
              className="btn-success text-white mr-10"
            >
              <IntlMessages id="sidebar.btnNo" />
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ apiSettingRdcer }) => {
  const { data, loading } = apiSettingRdcer;
  return { data, loading };
};

export default connect(
  mapStateToProps,
  {
    apiSettingSave,
    apiSettingEdit,
    apiSettingDelete
  }
)(APISettingEditDelWdgt);
