/**
 * Form Elemets
 */
/**
 * Disable SMS Authentication
 *  */

import React, { Component } from "react";
import { Form, FormGroup, Label, Input, Col, Button } from "reactstrap";
import { connect } from "react-redux";
// redux action
import { sendSmsauthDisable, submitSendSmsauthDisable } from "Actions";

// intl messages
import IntlMessages from "Util/IntlMessages";

const validateDisableSmsAuth = require("../../validation/MyAccount/disable_sms_auth");

class DisableSmsAuthWdgt extends Component {
  constructor(props) {
    super();
    this.state = {
      loginpassword: "",
      phonenumber: "",
      smsauthcode: "",
      errors: ""
    };
    this.onSendSmsDisable = this.onSendSmsDisable.bind(this);
    this.onSubmitSendSmsDisable = this.onSubmitSendSmsDisable.bind(this);
  }

  /**
   * On SendSms
   */
  onSendSmsDisable() {
    const { loginpassword, phonenumber } = this.state;

    const { errors, isValid } = validateDisableSmsAuth(this.state);
    this.setState({ errors: errors });

    if (isValid) {
      this.props.sendSmsauthDisable({ loginpassword, phonenumber });
    }
  }

  /**
   * On Submit SendSms
   */
  onSubmitSendSmsDisable() {
    const { loginpassword, phonenumber, smsauthcode } = this.state;

    const { errors, isValid } = validateDisableSmsAuth(this.state);
    this.setState({ errors: errors });

    if (isValid) {
      this.props.submitSendSmsauthDisable({
        loginpassword,
        phonenumber,
        smsauthcode
      });
    }
  }

  render() {
    const { loginpassword, phonenumber, smsauthcode, errors } = this.state;
    return (
      <div>
        <Form>
          <div className="mt-20 downloadappbox row">
            <div className="col-md-12">
              <FormGroup className="has-wrapper text-right" row>
                <Label for="loginpassword" className="control-label" sm={2}>
                  {<IntlMessages id="sidebar.disableloginpassword" />}
                </Label>
                <Col sm={6}>
                  <Input
                    type="password"
                    name="loginpassword"
                    // value={loginpassword} //Added By Bharat Jograna
                    id="loginpassword"
                    placeholder="Enter Login Password"
                    onChange={e =>
                      this.setState({ loginpassword: e.target.value })
                    }
                  />
                  {errors.loginpassword && (
                    <span className="text-danger text-left">
                      <IntlMessages id={errors.loginpassword} />
                    </span>
                  )}
                </Col>
              </FormGroup>

              <FormGroup className="has-wrapper text-right" row>
                <Label for="phonenumber" className="control-label" sm={2}>
                  {<IntlMessages id="sidebar.disablephonenumber" />}
                </Label>
                <Col sm={6}>
                  <Input
                    type="text"
                    name="phonenumber"
                    value={phonenumber}
                    id="phonenumber"
                    placeholder="EnterPhone Number"
                    onChange={e =>
                      this.setState({ phonenumber: e.target.value })
                    }
                  />
                  {errors.phonenumber && (
                    <span className="text-danger text-left">
                      <IntlMessages id={errors.phonenumber} />
                    </span>
                  )}
                </Col>
              </FormGroup>
              <FormGroup className="has-wrapper" row>
                <Label
                  for="Smsauthcode-1"
                  className="text-right control-label col-sm-12 col-xl-2 col-md-2"
                >
                  {<IntlMessages id="sidebar.disablesmsauthcode" />}
                </Label>
                <div className="col-sm-8 col-8 col-xl-4 col-md-4">
                  <Input
                    type="Smsauthcode"
                    name="Smsauthcode"
                    value={smsauthcode}
                    id="Smsauthcode"
                    placeholder="Enter Sms Authetication Code"
                    onChange={e =>
                      this.setState({ smsauthcode: e.target.value })
                    }
                  />
                </div>

                <div className="col-sm-4 col-4 col-lg-2 col-md-2">
                  <Button color="secondary" onClick={this.onSendSmsDisable}>
                    {<IntlMessages id="sidebar.sendSms" />}
                  </Button>
                </div>
                <Col sm={2} />
                <Col sm={6}>
                  {errors.smsauthcode && (
                    <span className="text-danger text-left">
                      <IntlMessages id={errors.smsauthcode} />
                    </span>
                  )}
                </Col>
              </FormGroup>

              <FormGroup className="has-wrapper" row>
                <Col sm={2} />
                <Col sm={2}>
                  <Button color="warning" onClick={this.onSubmitSendSmsDisable}>
                    {<IntlMessages id="sidebar.btnSubmit" />}
                  </Button>
                </Col>
              </FormGroup>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

// map state to props
const mapStateToProps = ({ disablesmsauth }) => {
  var response = {
    userList: disablesmsauth.disablesmsauth1,
    loading: disablesmsauth.loading
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    sendSmsauthDisable,
    submitSendSmsauthDisable
  }
)(DisableSmsAuthWdgt);
