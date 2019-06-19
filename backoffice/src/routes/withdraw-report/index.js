import React, { Component } from "react";
import { connect } from "react-redux";
import { getWithdrawalReport } from "Actions/WithdrawalReport";
import IntlMessages from "Util/IntlMessages";
import WithdrwalReportComponent from "Components/WithdrawalReport/withdrawalReport";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import Button from "@material-ui/core/Button";

const buttonSizeSmall = {
  maxHeight: "28px",
  minHeight: "28px",
  maxWidth: "28px",
  fontSize: "1rem"
};

class Withdrawal extends Component {
  state = {
    open: false
  };
  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false
    });
  };
  componentDidMount() {
    this.props.getWithdrawalReport();
  }
  render() {
    const { drawerClose } = this.props;
    return (
      <JbsCollapsibleCard>
        <div className="page-title d-flex justify-content-between align-items-center">
          <h2>
            <span>{<IntlMessages id="sidebar.withdrawalTransaction" />}</span>
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
        <WithdrwalReportComponent
          title={<IntlMessages id="sidebar.withdrawalTransaction" />}
          data={this.props.withdrawalReportData}
          closeAll={this.closeAll}
        />
      </JbsCollapsibleCard>
    );
  }
}

const mapStateToProps = ({ withdrawalReport }) => {
  const { withdrawalReportData } = withdrawalReport;
  return { withdrawalReportData };
};

export default connect(
  mapStateToProps,
  {
    getWithdrawalReport
  }
)(Withdrawal);
