import React, { Component } from "react";
import { connect } from "react-redux";
import JbsPageLoader from "Components/JbsPageLoader/JbsPageLoader";
class EditTradeRoute extends Component {
  render() {
    return (
      <div className="EditTradeRoute mb-20">
        {this.props.loading && <JbsPageLoader />}
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
  }
)(EditTradeRoute);
