/* 
    Developer : Nishant Vadgam
    Date : 27-09-2018
    File Comment : Fee & Limit Pattern root component
*/
import React, { Component } from "react";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import IntlMessages from "Util/IntlMessages";
import PatternList from "Components/FeeAndLimitPatterns/PatternList";

class FeeAndLimitPatternsList extends Component {
  render() {
    return (
      <div className="FeeAndLimitPatterns mb-20">
        <PageTitleBar
          title={<IntlMessages id="sidebar.feesAndLimitPatterns" />}
          match={this.props.match}
        />
        <PatternList
          history={this.props.history}
          location={this.props.location}
        />
      </div>
    );
  }
}

export default FeeAndLimitPatternsList;
