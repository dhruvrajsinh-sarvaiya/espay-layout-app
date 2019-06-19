import React from "react";
import { Badge, Table, Form, FormGroup, Label, Input } from "reactstrap";
import Button from "@material-ui/core/Button";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import Drawer from "rc-drawer";
import "rc-drawer/assets/index.css";
import NotFoundTable from "../NotFoundTable/notFoundTable";
// Import component for internationalization
import IntlMessages from "Util/IntlMessages";
import { connect } from "react-redux";
// Import component for validation
import validator from "validator";
//Action Import for Withdrawal Report Update
import { onUpdateWhithdrawalReport } from "Actions/WithdrawalReport";
import MUIDataTable from "mui-datatables";
import { NotificationManager } from "react-notifications";
//validation import from validation folder Update
const validateWithdrawalReport = require("../../validation/withdrawalReport");

const buttonSizeSmall = {
  maxHeight: "28px",
  minHeight: "28px",
  maxWidth: "28px",
  fontSize: "1rem"
};

class WithdrawalReport extends React.Component {
  state = {
    editWithdrawalReportModal: false,
    editWithdrawalReport: null,
    selectedWithdrawalReport: null,
    openViewWithdrawalDialog: false,
    successMessage: "",
    errors: "",
    open: false,
    open1: false
  };

  toggleDrawer = data => {
    this.setState({
      open: !this.state.open,
      selectedWithdrawalReport: data
    });
  };
  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false
    });
  };

  closeAll1 = () => {
    this.props.closeAll();
    this.setState({
      open1: false
    });
  };

  // edit Withdrawal Report
  onEditWithdrawalReport = withdrawalReport => {
    this.setState({
      open1: !this.state.open1,
      editWithdrawalReport: withdrawalReport
    });
  };

  // submit Withdrawal Asset form
  onSubmitWithdrawalReportForm() {
    const { errors, isValid } = validateWithdrawalReport(this.state);
    this.setState({ errors: errors });
    if (isValid) {
      const { editWithdrawalReport } = this.state;
      this.setState({
        open1: false
      });
      let indexOfWithdrawalReport;
      for (let i = 0; i < this.props.data.length; i++) {
        const withdrawalReport = this.props.data[i];
        if (withdrawalReport.id === editWithdrawalReport.id) {
          indexOfWithdrawalReport = i;
        }
      }
      this.props.onUpdateWhithdrawalReport(this.state.editWithdrawalReport);
      NotificationManager.success("Report has been Edit successfully!");
    }
  }

  // on change Withdrawal report
  onChangeWithdrawalReport(key, value) {
    this.setState({
      editWithdrawalReport: {
        ...this.state.editWithdrawalReport,
        [key]: value
      }
    });
  }

  //function for allow only integer in text box for Edit from
  onChangeEditNumber(key, value) {
    if (
      validator.isDecimal(value, {
        force_decimal: false
      }) ||
      validator.isNumeric(value)
    ) {
      this.setState({
        editWithdrawalReport: {
          ...this.state.editWithdrawalReport,
          [key]: value
        }
      });
    }
  }

  render() {
    const { editWithdrawalReport } = this.state;
    const columns = [
      {
        name: <IntlMessages id="table.id" />,
        options: { sort: true }
      },
      {
        name: <IntlMessages id="table.date" />,
        options: { sort: true }
      },
      {
        name: <IntlMessages id="table.username" />,
        options: { sort: true, filter: false }
      },
      {
        name: <IntlMessages id="table.type" />,
        options: { sort: true }
      },
      {
        name: <IntlMessages id="table.amount" />,
        options: { sort: true }
      },
      {
        name: <IntlMessages id="table.commission" />,
        options: { sort: true }
      },
      {
        name: <IntlMessages id="table.finalAmount" />,
        options: { sort: true }
      },
      {
        name: <IntlMessages id="table.status" />,
        options: { sort: true }
      },
      {
        name: <IntlMessages id="table.action" />,
        options: { sort: true }
      }
    ];
    const options = {
      filterType: "multiselect",
      responsive: "scroll",
      selectableRows: false,
      print: false,
      download: false,
      viewColumns: false,
      filter: false
    };
    return (
      <div className="StackingHistory">
        {this.props.data.length !== 0 ? (
          <MUIDataTable
            title={this.props.title}
            data={this.props.data.map(item => {
              return [
                item.id,
                item.Date,
                item.Username,
                item.Type,
                item.Amount,
                item.Commission,
                item.FinalAmount,
                <h4>
                  {item.Status === "Completed" ? (
                    <Badge className="mr-10 mt-5" color="primary">
                      {item.Status}
                    </Badge>
                  ) : (
                    <Badge className="mr-10 mt-5" color="success">
                      {item.Status}
                    </Badge>
                  )}
                </h4>,
                <h4 className="list-action">
                  {item.Status === "Completed" ? (
                    <a
                      href="javascript:void(0)"
                      onClick={() => this.toggleDrawer(item)}
                    >
                      <i className="ti-eye" />
                    </a>
                  ) : (
                    <a
                      href="javascript:void(0)"
                      onClick={() => this.onEditWithdrawalReport(item)}
                    >
                      <i className="ti-pencil" />
                    </a>
                  )}
                </h4>
              ];
            })}
            columns={columns}
            options={options}
          />
        ) : (
          <NotFoundTable title={this.props.title} columns={columns} />
        )}
        {/* Withdrawal Report Edit Modal*/}
        <Drawer
          width="50%"
          handler={false}
          open={this.state.open}
          onMaskClick={this.toggleDrawer}
          level=".drawer0"
          className="drawer12"
          placement="right"
        >
          <JbsCollapsibleCard>
            <div className="page-title d-flex justify-content-between align-items-center">
              <h2>
                <span>{<IntlMessages id="wallet.withdrawlReport" />}</span>
              </h2>
              <div className="page-title-wrap">
                <Button
                  className="btn-warning text-white mr-10 mb-10"
                  style={buttonSizeSmall}
                  variant="fab"
                  mini
                  onClick={this.toggleDrawer}
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
            {this.state.selectedWithdrawalReport !== null && (
              <div className="mx-auto">
                <Table bordered striped>
                  <tbody>
                    <tr>
                      <td>
                        <IntlMessages id="lable.date" />
                      </td>
                      <td>
                        <span className="fw-bold">
                          {this.state.selectedWithdrawalReport.Date}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <IntlMessages id="lable.username" />
                      </td>
                      <td>
                        <span className="fw-bold">
                          {this.state.selectedWithdrawalReport.Username}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <IntlMessages id="lable.amount" />
                      </td>
                      <td>
                        <span className="fw-bold">
                          {this.state.selectedWithdrawalReport.Amount}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <IntlMessages id="lable.commission" />
                      </td>
                      <td>
                        <span className="fw-bold">
                          {this.state.selectedWithdrawalReport.Commission}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <IntlMessages id="lable.finalAmount" />
                      </td>
                      <td>
                        <span className="fw-bold">
                          {this.state.selectedWithdrawalReport.FinalAmount}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <IntlMessages id="lable.orderStatus" />
                      </td>
                      <td>
                        {" "}
                        <span className="badge badge-primary">
                          {this.state.selectedWithdrawalReport.Status}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <IntlMessages id="lable.walletAddress" />
                      </td>
                      <td>
                        <span className="fw-bold">
                          {this.state.selectedWithdrawalReport.Address}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <IntlMessages id="lable.trnId" />
                      </td>
                      <td>
                        {" "}
                        <span className="fw-bold">
                          {this.state.selectedWithdrawalReport.TransactionID}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <IntlMessages id="lable.comment" />
                      </td>
                      <td>
                        <span className="fw-bold">
                          {this.state.selectedWithdrawalReport.Comment}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            )}
          </JbsCollapsibleCard>
        </Drawer>
        <Drawer
          width="50%"
          handler={false}
          open={this.state.open1}
          onMaskClick={this.onEditWithdrawalReport}
          level=".drawer0"
          className="drawer11"
          placement="right"
        >
          <JbsCollapsibleCard>
            <div className="page-title d-flex justify-content-between align-items-center">
              <h2>
                <span>{<IntlMessages id="modal.editWithdrawalReport" />}</span>
              </h2>
              <div className="page-title-wrap">
                <Button
                  className="btn-warning text-white mr-10 mb-10"
                  style={buttonSizeSmall}
                  variant="fab"
                  mini
                  onClick={this.onEditWithdrawalReport}
                >
                  <i className="zmdi zmdi-mail-reply" />
                </Button>
                <Button
                  className="btn-info text-white mr-10 mb-10"
                  style={buttonSizeSmall}
                  variant="fab"
                  mini
                  onClick={this.closeAll1}
                >
                  <i className="zmdi zmdi-home" />
                </Button>
              </div>
            </div>
            <div className="mx-auto">
              {editWithdrawalReport !== null && (
                <Form>
                  <FormGroup>
                    <Label for="address">
                      <IntlMessages id="lable.walletAddress" />
                    </Label>
                    <Input
                      type="text"
                      name="Address"
                      value={editWithdrawalReport.Address}
                      onChange={e =>
                        this.onChangeWithdrawalReport("Address", e.target.value)
                      }
                    />
                    {this.state.errors.Address && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.Address} />
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="amount">
                      <IntlMessages id="lable.finalAmount" />
                    </Label>
                    <Input
                      type="text"
                      name="FinalAmount"
                      value={editWithdrawalReport.FinalAmount}
                      onChange={e =>
                        this.onChangeEditNumber("FinalAmount", e.target.value)
                      }
                    />
                    {this.state.errors.FinalAmount && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.FinalAmount} />
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="status">
                      <IntlMessages id="lable.orderStatus" />
                    </Label>
                    <Input
                      type="select"
                      name="Status"
                      value={editWithdrawalReport.Status}
                      onChange={e =>
                        this.onChangeWithdrawalReport("Status", e.target.value)
                      }
                    >
                      <option value="">Please Select</option>
                      <option value="Completed">Completed</option>
                      <option value="Pending" defaultValue>
                        Pending
                      </option>
                      <option value="Cancelled">Cancelled</option>
                    </Input>
                    {this.state.errors.Status && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.Status} />
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.comment" />
                    </Label>
                    <Input
                      type="textarea"
                      name="Comment"
                      value={editWithdrawalReport.Comment}
                      onChange={e =>
                        this.onChangeWithdrawalReport("Comment", e.target.value)
                      }
                    />
                    {this.state.errors.Comment && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.Comment} />
                      </span>
                    )}
                  </FormGroup>
                  <Button
                    variant="raised"
                    className="btn-primary text-white"
                    onClick={() => this.onSubmitWithdrawalReportForm()}
                  >
                    <IntlMessages id="button.update" />
                  </Button>{" "}
                  <Button
                    variant="raised"
                    className="btn-danger text-white"
                    onClick={this.onEditWithdrawalReport}
                  >
                    <IntlMessages id="button.cancel" />
                  </Button>
                </Form>
              )}
            </div>
          </JbsCollapsibleCard>
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = ({ withdrawalReport }) => {
  var responce = {
    withdrawalReport: withdrawalReport.withdrawalReportData,
    loading: withdrawalReport.Loading
  };
  return responce;
};

export default connect(
  mapStateToProps,
  {
    onUpdateWhithdrawalReport
  }
)(WithdrawalReport);
