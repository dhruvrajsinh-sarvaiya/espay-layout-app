import React, { Component } from "react";
import IncomingTransactionsComponent from "Components/IncomingTransactions/IncomingTransactions";
import { connect } from "react-redux";
import { getIncomingTransactionsReport } from "Actions/IncomingTransactions";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import IntlMessages from "Util/IntlMessages";

class IncomingTransactions extends Component {
  componentWillMount() {
    this.props.getIncomingTransactionsReport();
  }
  render() {
    return (
      <div className="data-table-wrapper mb-20">
        <PageTitleBar
          title={<IntlMessages id="sidebar.incomingTransactions" />}
          match={this.props.match}
        />
        <IncomingTransactionsComponent
          data={this.props.incomingTransactionsData}
          Loading={this.props.Loading}
          darkMode={this.props.darkMode}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ incomingTransactionsReducer , settings }) => {
  const { darkMode } = settings;
  const { incomingTransactionsData, Loading } = incomingTransactionsReducer;
  return { incomingTransactionsData, Loading , darkMode };
};

export default connect(
  mapStateToProps,
  {
    getIncomingTransactionsReport
  }
)(IncomingTransactions);
