/**
 * Active User Component
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import { FormGroup, Input, Button } from "reactstrap";

// intl messages
import IntlMessages from "Util/IntlMessages";

//Import Login Blockchain...
import { loginBlockchain } from "Actions/MyAccount";

const validateLoginBlockchain = require("../../validation/MyAccount/login_blockchain");

class BlockchainPrivateKey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "key",
      private_key: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    this.setState({ private_key: event.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const { errors, isValid } = validateLoginBlockchain(this.state);
    this.setState({ errors: errors });

    if (isValid) {
      this.props.loginBlockchain(this.state);
    }
  }

  render() {
    const { private_key, errors } = this.state;
    return (
      <Fragment>
        <form>
          <FormGroup>
            <Input
              type="textarea"
              name="private_key"
              id="private_key"
              value={private_key}
              onChange={this.onChange}
              placeholder="Enter your Private key"
            />
            {errors.private_key && (
              <span className="text-danger">
                <IntlMessages id={errors.private_key} />
              </span>
            )}
          </FormGroup>
          <Button
            variant="raised"
            color="success"
            className="text-white btn-block"
            onClick={this.onSubmit}
          >
            <IntlMessages id="sidebar.btnLogin" />
          </Button>
        </form>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ loginRdcer }) => {
  return loginRdcer;
};

export default connect(
  mapStateToProps,
  { loginBlockchain }
)(BlockchainPrivateKey);
