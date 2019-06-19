/**
 * Form Elemets
 */
/**
 * Sms Authentication
 */
import React, { Component } from "react";
import { Form, FormGroup, Label, Input, Col, Button,Row } from "reactstrap";
import { connect } from "react-redux";
import MyProfileInfoWdgt from "./MyProfileInfoWdgt";
// redux action
import { sendSmsauth, submitSendSmsauth } from "Actions";
// intl messages
import IntlMessages from "Util/IntlMessages";

const validateSmsAuth = require("../../validation/MyAccount/sms_auth");

class SmsAuthWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneno: "",
      smsauthcode: "",
      errors: ""
    };

    this.onSendSms = this.onSendSms.bind(this);
    this.onSubmitSendSms = this.onSubmitSendSms.bind(this);
  }

  /**
   * On SendSms
   */
  onSendSms() {
    const { phoneno } = this.state;

    const { errors, isValid } = validateSmsAuth(this.state);
    this.setState({ errors: errors });

    if (isValid) {
      this.props.sendSmsauth({ phoneno });
    }
  }

  /**
   * On Submit SendSms
   */
  onSubmitSendSms() {
    const { phoneno, smsauthcode } = this.state;

    const { errors, isValid } = validateSmsAuth(this.state);
    this.setState({ errors: errors });

    if (isValid) {
      this.props.submitSendSmsauth({ phoneno, smsauthcode });
    }
  }

  render() {
    const { phoneno, smsauthcode, errors } = this.state;
    return (
      <div>
        <Row className="offset-md-2">
        <Col md={6}>      
        </Col>
          <Col md={9}>
        <Form className="mt-20">
          <FormGroup className="has-wrapper" row>
            <Label for="PhoneNo-1" className="control-label" sm={3}>
              Phone Number
            </Label>
            <Col sm={6}>
              <Input
                type="PhoneNo"
                name="PhoneNo"
                value={phoneno}
                id="PhoneNo"
                placeholder="Enter Phone Number"
                onChange={e => this.setState({ phoneno: e.target.value })}
              />
              {errors.phoneno && (
                <span className="text-danger text-left">
                  <IntlMessages id={errors.phoneno} />
                </span>
              )}
            </Col>
          </FormGroup>
          <FormGroup className="has-wrapper" row>
            <Label
              for="Smsauthcode-1"
              className="control-label"
              md={3}
            >
              SMS Authentication Code
            </Label>
            <Col md={4}>
              <Input
                type="Smsauthcode"
                name="Smsauthcode"
                value={smsauthcode}
                id="Smsauthcode"
                placeholder="Enter Sms Authetication Code"
                onChange={e => this.setState({ smsauthcode: e.target.value })}
              />
              {errors.smsauthcode && (
                <span className="text-danger text-left">
                  <IntlMessages id={errors.smsauthcode} />
                </span>
              )}
            </Col>
            <Col md={2}>
              <Button color="secondary" onClick={this.onSendSms}>
                {<IntlMessages id="sidebar.sendSms" />}
              </Button>
            </Col>
          </FormGroup>
          <FormGroup className="has-wrapper" row>
            <Col sm={3} />
            <Col sm={2}>
              <Button color="warning" onClick={this.onSubmitSendSms}>
                {<IntlMessages id="sidebar.btnSubmit" />}
              </Button>
            </Col>
          </FormGroup>
        </Form>
        </Col>
         
        </Row>
      </div>
    );
  }
}

// map state to props
const mapStateToProps = ({ smsauth }) => {
  var response = { userList: smsauth.smsauth, loading: smsauth.loading };
  return response;
};

export default connect(
  mapStateToProps,
  {
    sendSmsauth,
    submitSendSmsauth
  }
)(SmsAuthWidget);
