import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import TradeRouteForm from "Components/TradeRoute/TradeRouteForm";
import JbsPageLoader from "Components/JbsPageLoader/JbsPageLoader";

import { getTradeRouteInfo } from "Actions/TradeRoute";

class EditTradeRoute extends Component {
  componentWillMount() {
    this.props.getTradeRouteInfo(this.props.pagedata);
  }
  render() {
    return (
      <div className="EditTradeRoute mb-20">
        {/* <PageTitleBar
          title={<IntlMessages id="wallet.EditTradeRoute" />}
          match={this.props.match}
       />*/}
        {this.props.loading && <JbsPageLoader />}
        {this.props.response && (
          <TradeRouteForm
            details={this.props.response}
            history={this.props.history}
            location={this.props.location}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ tradeRoute }) => {
  const { response, loading } = tradeRoute;
  return { response, loading };
};

export default connect(
  mapStateToProps,
  {
    getTradeRouteInfo
  }
)(EditTradeRoute);
