import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Badge,
  Table,
  Row,
  Col
} from "reactstrap";
import NotFoundTable from "../NotFoundTable/notFoundTable";
import IntlMessages from "Util/IntlMessages";
// Import component for validation
import validator from "validator";
import { connect } from "react-redux";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { NotificationManager } from "react-notifications";
import {
  getTradingFees,
  onUpdateTradingFees,
  addTradingFees
} from "Actions/StackingFees";
import MUIDataTable from "mui-datatables";
import Button from "@material-ui/core/Button";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import Drawer from "rc-drawer";
import "rc-drawer/assets/index.css";

var validateStackingFeesRequest = require("../../validation/StackingFees/StackingFees");
var validateaddStackingFeesRequest = require("../../validation/StackingFees/AddStackingFees");

const buttonSizeSmall = {
  maxHeight: "28px",
  minHeight: "28px",
  maxWidth: "28px",
  fontSize: "1rem"
};

class StackingFees extends React.Component {
  state = {
    editStackingFeesModal: false,
    editStackingFeesReport: null,
    selectedStackingFeesReport: null,
    openViewStackingFeesDialog: false,
    addNewStackingFees: false,
    addNewStackingFeesForm: false,
    addNewStackingFeesDetails: {
      id: "",
      uniqvalues: "",
      makercharges: "",
      takercharges: "",
      chargetype: "",
      currency: ""
    },
    successMessage: "",
    errors: ""
  };
  componentWillMount() {
    this.props.getTradingFees();
  }

  // viewStackingFeesReport(data) {
  //   this.setState({
  //     openViewStackingFeesDialog: true,
  //     selectedStackingFeesReport: data
  //   });
  // }

  // edit Stacking Fees Report
  onEditStackingFeesReport(stackingFees) {
    this.setState({
      editStackingFeesModal: true,
      editStackingFeesReport: stackingFees,
      addNewStackingFeesForm: false
    });
  }

  // toggle edit Stacking Fess report  modal
  toggleEditStackingFeesReportModal = () => {
    this.setState({
      editStackingFeesModal: !this.state.editStackingFeesModal,
      errors: {}
    });
  };

  closeAll = () => {
    this.props.closeAll();
    this.setState({
      editStackingFeesModal: false
    });
  };

  toggleDrawer = data => {
    this.setState({
      openViewStackingFeesDialog: !this.state.openViewStackingFeesDialog,
      selectedStackingFeesReport: data
    });
    // console.log("XYZ", data);
  };

  closeAll1 = () => {
    this.props.closeAll();
    this.setState({
      openViewStackingFeesDialog: false
    });
  };

  // submit Stacking Fees form
  onSubmitStackingFeesReportForm() {
    const { errors, isValid } = validateStackingFeesRequest(this.state);
    this.setState({ errors: errors });
    if (isValid) {
      const { editStackingFeesReport } = this.state;
      this.setState({
        editStackingFeesModal: false
      });
      let indexOfStackingFeesReport;
      for (let i = 0; i < this.props.tradingFees.length; i++) {
        const stackingFees = this.props.tradingFees[i];
        if (stackingFees.id === editStackingFeesReport.id) {
          indexOfStackingFeesReport = i;
        }
      }
      this.props.onUpdateTradingFees(this.state.editStackingFeesReport);

      NotificationManager.success("Report has been Edit successfully!");
    }
  }

  // on change Stacking Fees report
  onChangeStackingFeesReport(key, value) {
    this.setState({
      editStackingFeesReport: {
        ...this.state.editStackingFeesReport,
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
        editStackingFeesReport: {
          ...this.state.editStackingFeesReport,
          [key]: value
        }
      });
    }
  }

  // add new Payment Method report
  addNewStackingFees() {
    this.setState({
      editStackingFeesModal: true,
      addNewStackingFeesForm: true,
      editStackingFeesReport: null,
      addNewStackingFeesDetails: {
        id: "",
        uniqvalues: "",
        makercharges: "",
        takercharges: "",
        chargetype: "",
        currency: ""
      }
    });
  }

  onChangeStackingFeesAddNewForm(key, value) {
    this.setState({
      addNewStackingFeesDetails: {
        ...this.state.addNewStackingFeesDetails,
        [key]: value
      }
    });
  }

  onSubmitAddNewStackingFeesForm() {
    const { errors, isValid } = validateaddStackingFeesRequest(this.state);
    this.setState({ errors: errors });
    if (isValid) {
      const { addNewStackingFeesDetails } = this.state;

      this.setState({ editStackingFeesModal: false });
      let newStackingFees = addNewStackingFeesDetails;

      this.props.addTradingFees(newStackingFees);
      NotificationManager.success("Report has been Add successfully!");
    }
  }

  onChangeNumber(key, value) {
    if (
      validator.isDecimal(value, {
        force_decimal: false,
        decimal_digits: "0,8"
      }) ||
      validator.isNumeric(value)
    ) {
      this.setState({
        addNewStackingFeesDetails: {
          ...this.state.addNewStackingFeesDetails,
          [key]: value
        }
      });
    }
  }

  render() {
    const {
      editStackingFeesModal,
      editStackingFeesReport,
      addNewStackingFeesForm,
      addNewStackingFeesDetails
    } = this.state;
    const columns = [
      {
        name: <IntlMessages id="table.id" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="lable.uniqValue" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="lable.makerCharges" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="lable.takerCharges" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="lable.chargeType" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="lable.currency" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.action" />,
        options: { sort: true, filter: false }
      }
    ];
    const options = {
      responsive: "scroll",
      selectableRows: false,
      print: false,
      download: false,
      viewColumns: false,
      filter: false,
      customToolbar: () => {
        return (
          <Button
            variant="raised"
            className="btn-primary text-white mt-5"
            style={{ float: "right" }}
            onClick={() => this.addNewStackingFees()}
          >
            <IntlMessages id="button.addNew" />
          </Button>
        );
      }
    };
    return (
      <div className="StackingHistory">
        {this.props.tradingFees.length !== 0 ? (
          <MUIDataTable
            data={this.props.tradingFees.map(item => {
              return [
                item.id,
                item.uniqvalues,
                item.makercharges,
                item.takercharges,
                <Badge color="success" pill>
                  {item.chargetype}
                </Badge>,
                item.currency,
                <div className="list-action">
                  <a
                    className="mr-10"
                    href="javascript:void(0)"
                    onClick={() => this.toggleDrawer(item)}
                  >
                    <i className="ti-eye" />
                  </a>
                  <a
                    href="javascript:void(0)"
                    onClick={() => this.onEditStackingFeesReport(item)}
                  >
                    <i className="ti-pencil" />
                  </a>
                </div>
              ];
            })}
            columns={columns}
            options={options}
          />
        ) : (
          <NotFoundTable title={this.props.title} columns={columns} />
        )}
        {editStackingFeesModal && (
          <Drawer
            width="50%"
            handler={false}
            open={this.state.editStackingFeesModal}
            onMaskClick={this.toggleEditStackingFeesReportModal}
            level=".drawer1"
            className="drawer12"
            placement="right"
          >
            <JbsCollapsibleCard>
              <div className="page-title d-flex justify-content-between align-items-center">
                {addNewStackingFeesForm ? (
                  <h2>
                    <span>
                      <IntlMessages id="modal.addStackingFees" />
                    </span>
                  </h2>
                ) : (
                  <h2>
                    <span>
                      <IntlMessages id="modal.editTrading" />
                    </span>
                  </h2>
                )}
                <div className="page-title-wrap">
                  <Button
                    className="btn-warning text-white mr-10 mb-10"
                    style={buttonSizeSmall}
                    variant="fab"
                    mini
                    onClick={this.toggleEditStackingFeesReportModal}
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

              {addNewStackingFeesForm ? (
                <Form>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.uniqValue" />
                    </Label>
                    <Input
                      type="text"
                      name="uniqvalues"
                      value={addNewStackingFeesDetails.uniqvalues}
                      onChange={e =>
                        this.onChangeNumber("uniqvalues", e.target.value)
                      }
                    />
                    {this.state.errors.uniqvalues && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.uniqvalues} />
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.makerCharges" />
                    </Label>
                    <Input
                      type="text"
                      name="makercharges"
                      value={addNewStackingFeesDetails.makercharges}
                      onChange={e =>
                        this.onChangeNumber("makercharges", e.target.value)
                      }
                    />
                    {this.state.errors.makercharges && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.makercharges} />
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.takerCharges" />
                    </Label>
                    <Input
                      type="text"
                      name="takercharges"
                      value={addNewStackingFeesDetails.takercharges}
                      onChange={e =>
                        this.onChangeNumber("takercharges", e.target.value)
                      }
                    />
                    {this.state.errors.takercharges && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.takercharges} />
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.chargeType" />
                    </Label>
                    <Input
                      type="select"
                      name="chargetype"
                      value={addNewStackingFeesDetails.chargetype}
                      onChange={e =>
                        this.onChangeStackingFeesAddNewForm(
                          "chargetype",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Please Select</option>
                      <option value="Percentage">Percentage</option>
                      <option value="Fixed">Fixed</option>
                    </Input>
                    {this.state.errors.chargetype && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.chargetype} />
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.currency" />
                    </Label>
                    <Input
                      type="text"
                      name="currency"
                      value={addNewStackingFeesDetails.currency}
                      onChange={e =>
                        this.onChangeStackingFeesAddNewForm(
                          "currency",
                          e.target.value
                        )
                      }
                    />
                    {this.state.errors.currency && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.currency} />
                      </span>
                    )}
                  </FormGroup>
                </Form>
              ) : (
                <Form>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.id" />
                    </Label>
                    <Input
                      type="text"
                      defaultValue={editStackingFeesReport.id}
                      readOnly
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.uniqValue" />
                    </Label>
                    <Input
                      type="text"
                      name="uniqvalues"
                      value={editStackingFeesReport.uniqvalues}
                      onChange={e =>
                        this.onChangeEditNumber("uniqvalues", e.target.value)
                      }
                    />
                    {this.state.errors.uniqvalues && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.uniqvalues} />
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.makerCharges" />
                    </Label>
                    <Input
                      type="text"
                      name="makercharges"
                      value={editStackingFeesReport.makercharges}
                      onChange={e =>
                        this.onChangeEditNumber("makercharges", e.target.value)
                      }
                    />
                    {this.state.errors.makercharges && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.makercharges} />
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.takerCharges" />
                    </Label>
                    <Input
                      type="text"
                      name="takercharges"
                      value={editStackingFeesReport.takercharges}
                      onChange={e =>
                        this.onChangeEditNumber("takercharges", e.target.value)
                      }
                    />
                    {this.state.errors.takercharges && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.takercharges} />
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.chargeType" />
                    </Label>
                    <Input
                      type="select"
                      name="chargetype"
                      value={editStackingFeesReport.chargetype}
                      onChange={e =>
                        this.onChangeStackingFeesReport(
                          "chargetype",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Please Select</option>
                      <option value="Percentage">Percentage</option>
                      <option value="Fixed">Fixed</option>
                    </Input>
                    {this.state.errors.chargetype && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.chargetype} />
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.currency" />
                    </Label>
                    <Input
                      type="text"
                      name="currency"
                      value={editStackingFeesReport.currency}
                      onChange={e =>
                        this.onChangeStackingFeesReport(
                          "currency",
                          e.target.value
                        )
                      }
                    />
                    {this.state.errors.currency && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.currency} />
                      </span>
                    )}
                  </FormGroup>
                </Form>
              )}
              {addNewStackingFeesForm ? (
                <div>
                  <Button
                    variant="raised"
                    className="btn-primary text-white"
                    onClick={() => this.onSubmitAddNewStackingFeesForm()}
                  >
                    <IntlMessages id="button.add" />
                  </Button>{" "}
                  <Button
                    variant="raised"
                    className="btn-danger text-white"
                    onClick={this.toggleEditStackingFeesReportModal}
                  >
                    <IntlMessages id="button.cancel" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    variant="raised"
                    className="btn-primary text-white"
                    onClick={() => this.onSubmitStackingFeesReportForm()}
                  >
                    <IntlMessages id="button.update" />
                  </Button>{" "}
                  <Button
                    variant="raised"
                    className="btn-danger text-white"
                    onClick={this.toggleEditStackingFeesReportModal}
                  >
                    <IntlMessages id="button.cancel" />
                  </Button>
                </div>
              )}
            </JbsCollapsibleCard>
          </Drawer>
        )}
        <Drawer
          width="50%"
          handler={false}
          open={this.state.openViewStackingFeesDialog}
          onMaskClick={this.toggleDrawer}
          level=".drawer1"
          className="drawer12"
          placement="right"
        >
          <JbsCollapsibleCard>
            <div className="page-title d-flex justify-content-between align-items-center">
              <h2>Stacking Fees</h2>
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
                  onClick={this.closeAll1}
                >
                  <i className="zmdi zmdi-home" />
                </Button>
              </div>
            </div>
            {this.state.selectedStackingFeesReport !== null && (
              <div className="mx-auto">
                <Table bordered striped>
                  <tbody>
                    <tr>
                      <td>Uniq Values</td>
                      <td>
                        <span className="fw-bold">
                          {this.state.selectedStackingFeesReport.uniqvalues}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Maker Charges</td>
                      <td>
                        <span className="fw-bold">
                          {this.state.selectedStackingFeesReport.makercharges}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Taker Charges</td>
                      <td>
                        <span className="fw-bold">
                          {this.state.selectedStackingFeesReport.takercharges}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Charge Type</td>
                      <td>
                        <span className="badge badge-success">
                          {this.state.selectedStackingFeesReport.chargetype}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Currency</td>
                      <td>
                        <span className="fw-bold">
                          {this.state.selectedStackingFeesReport.currency}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            )}
          </JbsCollapsibleCard>
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = ({ stackingFees }) => {
  var responce = {
    tradingFees: stackingFees.tradingFees,
    loading: stackingFees.Loading
  };
  return responce;
};

export default connect(
  mapStateToProps,
  {
    onUpdateTradingFees,
    getTradingFees,
    addTradingFees
  }
)(StackingFees);
