import React, { Component } from "react";
import { connect } from "react-redux";

import { getExternalTransferHistory } from "Actions/TransferInOut";

import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

import IntlMessages from "Util/IntlMessages";

import TransferInOut from "Components/TransferInOut/TransferInOut";

class TransferOUT extends Component {
  componentWillMount() {
    this.props.getExternalTransferHistory();
  }

  render() {
    return (
      <div className="data-table-wrapper mb-20">
        <PageTitleBar
          title={<IntlMessages id="sidebar.transferout" />}
          match={this.props.match}
        />

        <TransferInOut
          data={this.props.externalTransferHistory}
          title={<IntlMessages id="sidebar.externalTransfer" />}
          darkMode={this.props.darkMode}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ transferOut,settings }) => {
  const { darkMode } = settings;
  const { externalTransferHistory } = transferOut;
  return { externalTransferHistory,darkMode };
};

export default connect(
  mapStateToProps,
  {
    getExternalTransferHistory
  }
)(TransferOUT);
