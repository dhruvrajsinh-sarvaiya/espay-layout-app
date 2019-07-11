import React, { Component } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

import {
  SignupWithEmailWidget,
  SignupWithBlockchainWidget,
  BlockchainKeyStoreWdgt,
  BlockchainPrivateKeyWdgt
} from "Components/MyAccount";

function TabContainer({ children }) {
  return (
    <Typography component="div" style={{ padding: 8 * 2 }}>
      {children}
    </Typography>
  );
}

export default class SignupWithBlockchain extends Component {
  state = {
    activeIndex: 1,
    username: "User1"
  };

  changeUserName(newName) {
    this.setState({
      username: newName
    });
  }

  Counterevent() {
    this.setState({ view1: false });
  }

  handleChangeIndex(index) {
    this.setState({ activeIndex: index });
  }

  handleChange(event, value) {
    this.setState({ activeIndex: value });
  }

  render() {
    var loginButton;
    if (this.state.username === "User1") {
      loginButton = (
        <SignupWithBlockchainWidget
          changeUsername={this.changeUserName.bind(this)}
        />
      );
    }
    if (this.state.username === "User2") {
      loginButton = (
        <BlockchainKeyStoreWdgt
          changeUsername={this.changeUserName.bind(this)}
        />
      );
    }
    if (this.state.username === "User3") {
      loginButton = <BlockchainPrivateKeyWdgt />;
    }
    const { activeIndex } = this.state;
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.signupWithBlochChain" />}
          match={this.props.match}
        />
        <JbsCollapsibleCard customClasses="col-sm-4 col-md-4 mx-auto">
          <div className="session-head mt-30 mb-30 text-center">
            <h1>{<IntlMessages id="sidebar.signupWithBlochChain" />}</h1>
          </div>
          <Tabs
            value={this.state.activeIndex}
            onChange={(e, value) => this.handleChange(e, value)}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
          >
            <Tab label="Normal Registration" />
            <Tab label="BlockChain Registration" />
          </Tabs>

          {activeIndex === 0 && (
            <TabContainer>
              <div className="session-head mb-20 text-center">
                <h2>{<IntlMessages id="sidebar.Register" />}</h2>
              </div>
              <SignupWithEmailWidget />
            </TabContainer>
          )}
          {activeIndex === 1 && <TabContainer>{loginButton}</TabContainer>}
        </JbsCollapsibleCard>
      </div>
    );
  }
}
