import React, { Component } from "react";
import { connect } from "react-redux";
import WithdrawRouteForm from "Components/WithdrawRoute/WithdrawRouteForm";
import JbsPageLoader from "Components/JbsPageLoader/JbsPageLoader";

import { getWithdrawRouteInfo } from "Actions/WithdrawRoute";

class AddTradeRoute extends Component {
  componentWillMount() {
    this.props.getWithdrawRouteInfo(this.props.pagedata);
  }
  render() {
    return (
      <div className="AddWithdrawRoute mb-20">
        {this.props.loading && <JbsPageLoader />}
        {this.props.response && (
          <WithdrawRouteForm
            details={this.props.response}
            history={this.props.history}
            location={this.props.location}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ withdrawRoute }) => {
  const { response, loading } = withdrawRoute;
  return { response, loading };
};

export default connect(
  mapStateToProps,
  {
    getWithdrawRouteInfo
  }
)(AddTradeRoute);
