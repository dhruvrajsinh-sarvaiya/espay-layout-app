/**
 * Active User Component
 */
import React, { Component, Fragment } from "react";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

// intl messages
import IntlMessages from "Util/IntlMessages";

import {
  BlockchainKeystoreFile,
  BlockchainPrivateKey
} from "Components/MyAccount";

class LoginBlockchain extends Component {
  constructor(props) {
    super();
    this.state = {
      activeIndex: 0
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, value) {
    this.setState({
      activeIndex: value
    });
  }

  render() {
    const { activeIndex } = this.state;
    return (
      <Fragment>
        <div className="mb-0">
          <h2 className="heading mb-30 text-center border-bottom border-danger">
            <IntlMessages id="my_account.loginBlockchain" />
          </h2>
          <div>
            <Tabs
              value={activeIndex}
              onChange={this.handleChange}
              textColor="primary"
              indicatorColor="primary"
              centered
            >
              <Tab
                className="col-md-6"
                label={
                  <h3>
                    <IntlMessages id="my_account.keystoreFile" />
                  </h3>
                }
              />
              <Tab
                className="col-md-6"
                label={
                  <h3>
                    <IntlMessages id="my_account.privateKey" />
                  </h3>
                }
              />
            </Tabs>
            <div className="pt-25 pb-25">
              {activeIndex === 0 && <BlockchainKeystoreFile />}
              {activeIndex === 1 && <BlockchainPrivateKey />}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default LoginBlockchain;
