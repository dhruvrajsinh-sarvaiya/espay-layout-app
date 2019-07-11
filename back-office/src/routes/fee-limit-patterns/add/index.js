/* 
    Developer : Nishant Vadgam
    Date : 27-09-2018
    File Comment : Fee & Limit Pattern root component
*/
import React, { Component } from "react";
import PatternForm from "Components/FeeAndLimitPatterns/PatternForm";

class AddFeeAndLimitPattern extends Component {
  state = {
    activeIndex: 0,
    //main form details
    patternName: "",
    patternDesc: "",
    patternStatus: "Active",
    patternExchange: "",
    // deposit form
    depositFeeAndLimit: {
      errors: {},
      depositFeeType: "Fixed",
      depositFeeRange: "No",
      depositFeeAmount: "",
      limits: [
        {
          type: "",
          min_amount: "",
          max_amount: ""
        }
      ],
      fees: [
        {
          from: "",
          to: "",
          amount: ""
        }
      ],
      coins: [],
      isSubmitted: false
    },
    // withdraw form
    withdrawFeeAndLimit: {
      errors: {},
      withdrawFeeType: "Fixed",
      withdrawFeeRange: "No",
      withdrawFeeAmount: "",
      limits: [
        {
          type: "",
          min_amount: "",
          max_amount: ""
        }
      ],
      fees: [
        {
          from: "",
          to: "",
          amount: ""
        }
      ],
      coins: [],
      isSubmitted: false
    },
    //trade form
    tradeFeeAndLimit: {
      errors: {},
      tradeFeeType: "Fixed",
      tradeFeeRange: "No",
      tradeFeeAmount: "",
      limits: [
        {
          type: "",
          min_amount: "",
          max_amount: ""
        }
      ],
      fees: [
        {
          from: "",
          to: "",
          amount: ""
        }
      ],
      pairs: [],
      isSubmitted: false
    },
    // errors
    errors: {}
  };
  render() {
    return (
      <div className="FeeAndLimitPatterns mb-20">
        <PatternForm
          details={this.state}
          history={this.props.history}
          location={this.props.location}
        />
      </div>
    );
  }
}

export default AddFeeAndLimitPattern;
