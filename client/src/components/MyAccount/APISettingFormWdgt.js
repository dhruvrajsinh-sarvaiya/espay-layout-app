/**
 * API Setting Form Component
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { FormGroup, Input, Button } from "reactstrap";

// intl messages
import IntlMessages from "Util/IntlMessages";

//Import Forgot password...
import { apiSettingCreate } from "Actions/MyAccount";

const validateAPISetting = require("../../validation/MyAccount/api_setting_form");

class APISettingFormWdgt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "create",
      new_api_key: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    this.setState({
      new_api_key: event.target.value
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ new_api_key: nextProps.new_api_key });
  }

  onSubmit(event) {
    event.preventDefault();

    const { errors, isValid } = validateAPISetting(this.state);
    this.setState({ errors: errors });

    if (isValid) {
      this.props.apiSettingCreate(this.state.new_api_key);
    }
  }

  render() {
    const { new_api_key, errors } = this.state;
    return (
      <Fragment>
        <div className="mb-0 text-center">
          <h2 className="heading mb-20">
            <span className="border-bottom border-danger px-50 ">
              <IntlMessages id="sidebar.api" />
            </span>
          </h2>
          <p className="mb-10 helper-text">
            <IntlMessages id="my_account.enableWithdrawNote" />
          </p>
          <form>
            <FormGroup>
              <div className="input-group mb-0 mx-auto w-50">
                <Input
                  type="text"
                  className="form-control mt-10"
                  value={new_api_key}
                  onChange={this.onChange}
                />
                <div className="input-group-append mt-10">
                  <Button
                    color="success"
                    className="text-white btn-block"
                    onClick={this.onSubmit}
                    type="button"
                  >
                    <IntlMessages id="sidebar.btnCreateNewKey" />
                  </Button>
                </div>
              </div>
              {errors.new_api_key && (
                <div className="text-danger text-left mx-auto w-50">
                  <IntlMessages id={errors.new_api_key} />
                </div>
              )}
            </FormGroup>
          </form>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ apiSettingRdcer }) => {
  const { new_api_key, loading } = apiSettingRdcer;
  return { new_api_key, loading };
};

export default connect(
  mapStateToProps,
  { apiSettingCreate }
)(APISettingFormWdgt);
