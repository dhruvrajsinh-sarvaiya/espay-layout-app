import React, { Component } from "react";
import { connect } from "react-redux";
import { getInternalTransferHistory } from "Actions/TransferInOut";
import IntlMessages from "Util/IntlMessages";
import TransferInOut from "Components/TransferInOut/TransferInOut";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import Button from "@material-ui/core/Button";
const buttonSizeSmall = {
  maxHeight: "28px",
  minHeight: "28px",
  maxWidth: "28px",
  fontSize: "1rem"
};

class TransferIN extends Component {
  state = {
    openChild: false
  };
  closeAll = () => {
    this.props.closeAll();
    this.setState({
      openChild: false
    });
  };
  componentWillMount() {
    this.props.getInternalTransferHistory();
  }
  render() {
    const { drawerClose } = this.props;
    return (
      <JbsCollapsibleCard>
        <div className="page-title d-flex justify-content-between align-items-center">
          <h2>
            <span>{<IntlMessages id="sidebar.internalTransfer" />}</span>
          </h2>
          <div className="page-title-wrap">
            <Button
              className="btn-warning text-white mr-10 mb-10"
              style={buttonSizeSmall}
              variant="fab"
              mini
              onClick={drawerClose}
            >
              <i className="zmdi zmdi-mail-reply" />
            </Button>
            <Button
              className="btn-info text-white mr-10 mb-10"
              style={buttonSizeSmall}
              variant="fab"
              mini
              onClick={this.closeAll}
            >
              <i className="zmdi zmdi-home" />
            </Button>
          </div>
        </div>
        <TransferInOut
          data={this.props.internalTransferHistory}
        />
      </JbsCollapsibleCard>
    );
  }
}

const mapStateToProps = ({ transferIn }) => {
  const { internalTransferHistory } = transferIn;
  return { internalTransferHistory };
};

export default connect(
  mapStateToProps,
  {
    getInternalTransferHistory
  }
)(TransferIN);
