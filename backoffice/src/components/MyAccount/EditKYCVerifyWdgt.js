/**
 * Add Roles Wdgt
 */
import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";

import {
  EditPersonalKYCVerifyWdgt,
  EditEnterpriseKYCVerifyWdgt
} from "Components/MyAccount";

const KYCVerifyForm = ({ data }) => {
  var formRender = "";
  if (data.uid === 1) {
    formRender = <EditPersonalKYCVerifyWdgt />;
  } else if (data.uid === 2) {
    formRender = <EditEnterpriseKYCVerifyWdgt />;
  }

  return formRender;
};

class EditKYCVerifyWdgt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: "",
      user_type: 1
    };
  }

  componentWillMount() {
    var preData = this.props.location.state.data;

    if (preData.id !== "") {
      this.setState({ uid: preData.id, user_type: preData.user_type });
    } else {
      this.props.history.push("/app/my-account/kyc-verify");
    }
  }

  render() {
    return (
      <Fragment>
        <KYCVerifyForm data={this.state} />
      </Fragment>
    );
  }
}

export default withRouter(EditKYCVerifyWdgt);
