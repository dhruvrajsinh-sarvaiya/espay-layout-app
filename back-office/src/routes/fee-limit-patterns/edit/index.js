/* 
    Developer : Nishant Vadgam
    Date : 27-09-2018
    File Comment : Fee & Limit Pattern root component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import PatternForm from "Components/FeeAndLimitPatterns/PatternForm";
// jbs page loader
import JbsPageLoader from "Components/JbsPageLoader/JbsPageLoader";
import { getPatternById, postPatternInfo } from "Actions/FeeAndLimitPatterns";

class AddFeeAndLimitPattern extends Component {
  componentWillMount() {
    this.props.getPatternById(this.props.pagedata);
  }
  render() {
    return (
      <div className="FeeAndLimitPatterns mb-20">
        {this.props.loading && <JbsPageLoader />}
        {this.props.response && (
          <PatternForm
            details={this.props.response}
            history={this.props.history}
            location={this.props.location}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ patternListReducer }) => {
  const { response, loading } = patternListReducer;
  return { response, loading };
};

export default connect(
  mapStateToProps,
  {
    getPatternById,
    postPatternInfo
  }
)(AddFeeAndLimitPattern);
