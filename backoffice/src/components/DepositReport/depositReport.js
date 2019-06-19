import React from "react";
import MUIDataTable from "mui-datatables";
import { Badge, Form, FormGroup, Label, Input, Table } from "reactstrap";
import Button from "@material-ui/core/Button";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import Drawer from "rc-drawer";
import "rc-drawer/assets/index.css";
import { getDepositReport, onUpdateDepositReport } from "Actions/DepositReport";
import { connect } from "react-redux";
import NotFoundTable from "../NotFoundTable/notFoundTable";
import validator from "validator";
import { NotificationManager } from "react-notifications";

const validateDepositReportRequest = require("../../validation/depositReport");

const buttonSizeSmall = {
  maxHeight: "28px",
  minHeight: "28px",
  maxWidth: "28px",
  fontSize: "1rem"
};

class DepositReport extends React.Component {
  state = {
    editDepositReportModal: false,
    editDepositReport: null,
    selectedDepositReport: null,
    openViewDepositDialog: false,
    successMessage: "",
    errors: "",
    open: false,
    open1: false
  };

  componentWillMount() {
    this.props.getDepositReport();
  }
  toggleDrawer = data => {
    this.setState({
      open: !this.state.open,
      selectedDepositReport: data
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
  // viewDepositReport(data) {
  //   this.setState({
  //     openViewDepositDialog: true,
  //     selectedDepositReport: data
  //   });
  // }
  // edit Deposit Report
  onEditDepositReport = depositReport => {
    this.setState({
      open1: !this.state.open1,
      editDepositReport: depositReport
    });
  };

  // submit Withdrawal Asset form
  onSubmitDepositReportForm() {
    const { errors, isValid } = validateDepositReportRequest(this.state);
    this.setState({ errors: errors });
    if (isValid) {
      const { editDepositReport } = this.state;
      this.setState({
        open1: false
      });
      let indexOfDepositReport;
      for (let i = 0; i < this.props.depositReportData.length; i++) {
        const depositReport = this.props.depositReportData[i];
        if (depositReport.id === editDepositReport.id) {
          indexOfDepositReport = i;
        }
      }
      this.props.onUpdateDepositReport(this.state.editDepositReport);

      NotificationManager.success("Report has been Edit successfully!");
    }
  }

  // on change Withdrawal report
  onChangeDepositReport(key, value) {
    this.setState({
      editDepositReport: {
        ...this.state.editDepositReport,
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
        editDepositReport: {
          ...this.state.editDepositReport,
          [key]: value
        }
      });
    }
  }
  render() {
    const { editDepositReport } = this.state;
    const columns = [
      {
        name: <IntlMessages id="table.id" />,
        options: { sort: true, filter: false }
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
        name: <IntlMessages id="table.currency" />,
        options: { sort: true }
      },
      {
        name: <IntlMessages id="table.dipositAmount" />,
        options: { sort: true }
      },
      {
        name: <IntlMessages id="table.commission" />,
        options: { sort: true }
      },
      {
        name: <IntlMessages id="table.creditedAmount" />,
        options: { sort: true }
      },
      {
        name: <IntlMessages id="table.status" />,
        options: { sort: true }
      },
      {
        name: <IntlMessages id="table.action" />,
        options: { sort: false }
      }
    ];
    const options = {
      responsive: "scroll",
      selectableRows: false,
      download: false,
      viewColumns: false,
      filter: false,
      print: false
    };
    return (
      <div className="StackingHistory">
        {this.props.depositReportData.length !== 0 ? (
          <MUIDataTable
            title={this.props.title}
            data={this.props.depositReportData.map(item => {
              return [
                item.SNo,
                item.Date,
                item.Username,
                item.Type,
                item.Currency,
                item.DepositAmount,
                item.Commission,
                item.CreatedAmount,
                <h4>
                  {item.Status === "Completed" ? (
                    <Badge className="mr-10 mt-5" color="success">
                      {item.Status}
                    </Badge>
                  ) : (
                    <Badge className="mr-10 mt-5" color="primary">
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
                      onClick={() => this.onEditDepositReport(item)}
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
        <Drawer
          width="50%"
          handler={false}
          open={this.state.open}
          onMaskClick={this.toggleDrawer}
          level=".drawer1"
          className="drawer12"
          placement="right"
        >
          <JbsCollapsibleCard>
            <div className="page-title d-flex justify-content-between align-items-center">
              <h2>
                <span>{<IntlMessages id="sidebar.depositReport" />}</span>
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
            {this.state.selectedDepositReport !== null && (
              <div className="mx-auto">
                <Table bordered striped>
                  <tbody>
                    <tr>
                      <td>
                        <IntlMessages id="lable.date" />
                      </td>
                      <td>
                        <span className="fw-bold">
                          {this.state.selectedDepositReport.Date}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <IntlMessages id="lable.username" />
                      </td>
                      <td>
                        <span className="fw-bold">
                          {this.state.selectedDepositReport.Username}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <IntlMessages id="lable.type" />
                      </td>
                      <td>
                        <span className="fw-bold">
                          {this.state.selectedDepositReport.Type}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <IntlMessages id="lable.currency" />
                      </td>
                      <td>
                        <span className="fw-bold">
                          {this.state.selectedDepositReport.Currency}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <IntlMessages id="lable.depositAmount" />
                      </td>
                      <td>
                        <span className="fw-bold">
                          {this.state.selectedDepositReport.DepositAmount}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <IntlMessages id="lable.commission" />
                      </td>
                      <td>
                        <span className="fw-bold">
                          {this.state.selectedDepositReport.Commission}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <IntlMessages id="lable.createdAmount" />
                      </td>
                      <td>
                        <span className="fw-bold">
                          {this.state.selectedDepositReport.CreatedAmount}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <IntlMessages id="lable.status" />
                      </td>
                      <td>
                        {" "}
                        <span className="badge badge-success">
                          {this.state.selectedDepositReport.Status}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <IntlMessages id="lable.depositAddress" />
                      </td>
                      <td>
                        <span className="fw-bold">
                          {this.state.selectedDepositReport.DepositAddress}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <IntlMessages id="lable.comment" />
                      </td>
                      <td>
                        <span className="fw-bold">
                          {this.state.selectedDepositReport.Comment}
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
          onMaskClick={this.onEditDepositReport}
          level=".drawer1"
          className="drawer11"
          placement="right"
        >
          <JbsCollapsibleCard>
            <div className="page-title d-flex justify-content-between align-items-center">
              <h2>
                <span>{<IntlMessages id="modal.editdepositReport" />}</span>
              </h2>
              <div className="page-title-wrap">
                <Button
                  className="btn-warning text-white mr-10 mb-10"
                  style={buttonSizeSmall}
                  variant="fab"
                  mini
                  onClick={this.onEditDepositReport}
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
              {editDepositReport !== null && (
                <Form>
                  <FormGroup>
                    <Label for="address">
                      <IntlMessages id="lable.depositAddress" />
                    </Label>
                    <Input
                      type="text"
                      name="depositAddress"
                      value={editDepositReport.DepositAddress}
                      readOnly
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="amount">
                      <IntlMessages id="lable.createdAmount" />
                    </Label>
                    <Input
                      type="text"
                      name="FinalAmount"
                      value={editDepositReport.CreatedAmount}
                      onChange={e =>
                        this.onChangeEditNumber("CreatedAmount", e.target.value)
                      }
                    />
                    {this.state.errors.CreatedAmount && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.CreatedAmount} />
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="status">
                      <IntlMessages id="lable.Status" />
                    </Label>
                    <Input
                      type="select"
                      name="Status"
                      value={editDepositReport.Status}
                      onChange={e =>
                        this.onChangeDepositReport("Status", e.target.value)
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
                      value={editDepositReport.Comment}
                      onChange={e =>
                        this.onChangeDepositReport("Comment", e.target.value)
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
                    className="btn-primary text-white mr-5"
                    onClick={() => this.onSubmitDepositReportForm()}
                  >
                    <IntlMessages id="button.update" />
                  </Button>
                  <Button
                    variant="raised"
                    className="btn-danger text-white"
                    onClick={this.onEditDepositReport}
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

const mapStateToProps = ({ depositReport }) => {
  const { depositReportData } = depositReport;
  return { depositReportData };
};

export default connect(
  mapStateToProps,
  {
    getDepositReport,
    onUpdateDepositReport
  }
)(DepositReport);
