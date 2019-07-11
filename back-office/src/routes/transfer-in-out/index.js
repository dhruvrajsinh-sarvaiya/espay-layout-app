import React, { Component } from "react";
import TransferInAndOut from "Components/TransferINAndOUT/TransferInAndOut";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import Button from "@material-ui/core/Button";
import IntlMessages from "Util/IntlMessages";
const buttonSizeSmall = {
  maxHeight: "28px",
  minHeight: "28px",
  maxWidth: "28px",
  fontSize: "1rem"
};

export default class TransferInOut extends Component {
  state = {
    openChild: false
  };
  closeAll = () => {
    this.props.closeAll();
    this.setState({
      openChild: false
    });
  };
  render() {
    const { drawerClose } = this.props;
    return (
      <JbsCollapsibleCard>
        <div className="page-title d-flex justify-content-between align-items-center">
          <h2>
            <span>{<IntlMessages id="sidebar.transferInOut" />}</span>
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
        <TransferInAndOut />
      </JbsCollapsibleCard>
    );
  }
}
