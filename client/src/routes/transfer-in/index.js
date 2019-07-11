import React, { Component } from "react";
import { connect } from "react-redux";

import { getInternalTransferHistory } from "Actions/TransferInOut";

import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

import IntlMessages from "Util/IntlMessages";

import TransferInOut from "Components/TransferInOut/TransferInOut";

class TransferIN extends Component {
  componentWillMount() {
    this.props.getInternalTransferHistory();
  }
  render() {
    return (
      <div className="data-table-wrapper mb-20">
        <PageTitleBar
          title={<IntlMessages id="sidebar.transferin" />}
          match={this.props.match}
        />
        <TransferInOut
          data={this.props.internalTransferHistory}
          title={<IntlMessages id="sidebar.internalTransfer" />}
          darkMode={this.props.darkMode}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ transferIn , settings }) => {
  const { darkMode } = settings;
  const { internalTransferHistory } = transferIn;
  return { internalTransferHistory , darkMode };
};

export default connect(
  mapStateToProps,
  {
    getInternalTransferHistory
  }
)(TransferIN);
