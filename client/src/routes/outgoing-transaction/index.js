import React, { Component } from "react";
import OutGoingTransactionComponent from "Components/OutGoingTransaction/OutGoingTransaction";
import { connect } from "react-redux";
import { getOutGoingTransactionReport } from "Actions/OutGoingTransaction";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import IntlMessages from "Util/IntlMessages";

class OutGoingTransaction extends Component {
  componentWillMount() {
    this.props.getOutGoingTransactionReport();
  }
  render() {
    return (
      <div className="data-table-wrapper mb-20">
        <PageTitleBar
          title={<IntlMessages id="sidebar.outGoingTransaction" />}
          match={this.props.match}
        />
        <OutGoingTransactionComponent
          data={this.props.outGoingTransactionsData}
          Loading={this.props.Loading}
          darkMode={this.props.darkMode}
          />
      </div>
    );
  }
}

const mapStateToProps = ({ outGoingTransactionsReducer , settings }) => {
  const { darkMode } = settings;
  const { outGoingTransactionsData, Loading } = outGoingTransactionsReducer;
  return { outGoingTransactionsData, Loading , darkMode };
};

export default connect(
  mapStateToProps,
  {
    getOutGoingTransactionReport
  }
)(OutGoingTransaction);
