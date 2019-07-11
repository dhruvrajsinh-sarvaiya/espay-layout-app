/* 
    Developer : Nishant Vadgama
    Date : 19-09-2018
    File Comment : Admin Daemon Address List
*/
import React, { Component } from "react";
// Import component for internationalization
import IntlMessages from "Util/IntlMessages";
import DaemonAddressList from "Components/DaemonAddress/DaemonAddressList";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import Button from "@material-ui/core/Button";

const buttonSizeSmall = {
  maxHeight: "28px",
  minHeight: "28px",
  maxWidth: "28px",
  fontSize: "1rem"
};

class DaemonAddressIndex extends Component {
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
            <span>{<IntlMessages id="wallet.DATitle" />}</span>
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
        <DaemonAddressList />
      </JbsCollapsibleCard>
    );
  }
}

export default DaemonAddressIndex;
