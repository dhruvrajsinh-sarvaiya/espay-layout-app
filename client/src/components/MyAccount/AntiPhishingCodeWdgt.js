/**
 * Set Anti-Phishing Code page (code added by Parth Jani 21-9-2018)
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Label, Input, Col, Button } from "reactstrap";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { getAntiPhishingCode } from "Actions/MyAccount";

// validation added for edit-profile
const validateAntiPhishingCode = require("../../validation/MyAccount/anti_phishing_code");

class AntiPhishingCodeWdgt extends Component {
  constructor(props) {
    super();
    this.state = {
      antiphishingcode: "",
      errors: {}
    };

    this.onSetAntiPhishingCode = this.onSetAntiPhishingCode.bind(this);
  }

  /**
   * On Edit Profile update
   */
  onSetAntiPhishingCode() {
    const { errors, isValid } = validateAntiPhishingCode(this.state);
    this.setState({ errors: errors });
    if (isValid) {
      this.props.getAntiPhishingCode();
    }
  }

  render() {
    const { antiphishingcode, errors } = this.state;
    return (
      <div>
        <Form>
          <div className="offset-md-2 mt-20 downloadappbox row">
            <div className="col-md-12">
              <FormGroup className="has-wrapper text-left">
                <Label for="antiphishingcode" className="control-label d-inline-block" sm={2}>
                  {
                    <IntlMessages id="my_account.antiPhishingCode.antiPhishinglabel" />
                  }
                </Label>
                <Col sm={6} className="d-inline-block">
                  <Input
                    type="text"                    
                    name="antiphishingcode"
                    value={antiphishingcode}
                    id="antiphishingcode"
                    placeholder="Set Anti-Phishing code"
                    onChange={e =>
                      this.setState({ antiphishingcode: e.target.value })
                    }
                  />
                  {/* <p className="mb-0 text-left">please enter 4-20 non-special characters.</p> */}
                  {errors.antiphishingcode && (
                    <span className="text-danger text-left">
                      <IntlMessages id={errors.antiphishingcode} />
                    </span>
                  )}
                </Col>
              </FormGroup>

              <FormGroup className="has-wrapper" row>
                <Col sm={2} />
                <Col sm={2}>
                  <Button color="warning ml-10" onClick={this.onSetAntiPhishingCode}>
                    Submit
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

const mapStateToProps = ({ antiPhishingCodeRdcer }) => {
  const { data, loading } = antiPhishingCodeRdcer;
  return { data, loading };
};
export default connect(
  mapStateToProps,
  {
    getAntiPhishingCode
  }
)(AntiPhishingCodeWdgt);
