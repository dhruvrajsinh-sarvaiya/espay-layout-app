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

export default class BlockchainPrivateKeyWdgt extends Component {
  constructor(props) {
    super(props);
    this.onUserSignUp = this.onUserSignUp.bind(this);
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
              <span className="text-dark">0Xfba8Xbaa53456789df5bb3654fffe</span>
            </FormGroup>
          </div>

          <div className="mt-30 text-center">
            <h4>**Do not lose it!** It cannot be recovered if you lose it.</h4>
          </div>

          <div className="mt-20 text-center">
            <h4>you will need this private key to login to your account.</h4>
          </div>
          <div className="mt-20 text-center">
            <FormGroup>
              <Button
                className="btn-warning text-white text-bold btn-block w-100"
                variant="raised"
                size="large"
                onClick={this.onUserSignUp}
              >
                Login to Exchange
              </Button>
            </FormGroup>
          </div>
        </Form>
      </div>
    );
  }
}
