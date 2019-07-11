/**
 * Facebook Login Button Component
 */
import React, { Component, Fragment } from "react";
import config from "./config.json";

//For Twitter login button
import TwitterLogin from "react-twitter-auth";

class TwitterLoginButtonWdgt extends Component {
  constructor(props) {
    super(props);

    this.twitterResponse = this.twitterResponse.bind(this);
    this.onFailure = this.onFailure.bind(this);
  }

  twitterResponse(response) {}

  onFailure(error) {}

  render() {
    return (
      <Fragment>
        <TwitterLogin
          text="Twitter"
          className="btn_tw_login"
          showIcon={false}
          loginUrl={config.TWITTER_LOGIN_URL}
          onFailure={this.onFailure}
          onSuccess={this.twitterResponse}
          requestTokenUrl={config.TWITTER_REQUEST_TOKEN_URL}
        />
      </Fragment>
    );
  }
}

export default TwitterLoginButtonWdgt;
