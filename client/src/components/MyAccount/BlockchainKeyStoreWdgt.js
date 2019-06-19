/**
 * Form Elemets
 */
/**
 * Sign Up With BlockChain
 */
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { Form, FormGroup } from "reactstrap";

// intl messages
import IntlMessages from "Util/IntlMessages";

export default class BlockchainKeyStoreWdgt extends Component {
  constructor(props) {
    super(props);
    this.onUserSignUp = this.onUserSignUp.bind(this);
  }

  /**
   * On User Signup
   */
  onUserSignUp() {
    this.props.changeUsername("User3");
  }

  render() {
    return (
      <div>
        <Form>
          <div className="session-head mb-30 text-center">
            <h2>{<IntlMessages id="sidebar.keystorefile" />}</h2>
          </div>

          <div className="border border-dark text-center">
            <FormGroup className="mt-20">
              <span className="text-dark  fw-bold">
                Download Key Store File
              </span>
            </FormGroup>
          </div>

          <div className="mt-30 text-center">
            <h4>**Do not lose it!** It cannot be recovered if you lose it.</h4>
          </div>

          <div className="mt-30 text-center">
            <h4>
              **Do not lose it!** Your funds will be stolen if you use this file
              on a malicious/phishing site.
            </h4>
          </div>

          <div className="mt-20 text-center">
            <h4>
              **Make a backup!** Secure it like the millions of dollars it may
              one day be worth.
            </h4>
          </div>
          <div className="mt-10 text-center">
            <FormGroup>
              <Button
                className="btn-warning text-white text-bold btn-block w-100"
                variant="raised"
                size="large"
                onClick={this.onUserSignUp}
              >
                I understand. Continue.
              </Button>
            </FormGroup>
          </div>
        </Form>
      </div>
    );
  }
}
