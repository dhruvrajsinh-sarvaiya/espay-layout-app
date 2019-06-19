/**
 * Edit Customer
 */
import React, { Component } from "react";
import MatButton from "@material-ui/core/Button";
import { Form, FormGroup, Input, Label, Col, Row } from "reactstrap";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
// redux action
import {
  editPatternsAssignments,
  deletePatternsAssignments
} from "Actions/MyAccount";

//intl messages
import IntlMessages from "Util/IntlMessages";

// delete confirmation dialog
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";

//Validation
const validateEditPatternsAssignments = require("../../validation/MyAccount/edit_patterns_assignments");

class EditPatternsAssignments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exchange: "",
      membership: "",
      feeslimits: "",
      referalpattern: "",
      remark: "",
      assignedby: "",
      modifiedby: "",
      errors: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.onEditPatternsAssignments = this.onEditPatternsAssignments.bind(this);
    this.ondeleteCustomerDialog = this.ondeleteCustomerDialog.bind(this);
    this.ondeleteCustomer = this.ondeleteCustomer.bind(this);
  }

  componentWillMount() {
    let prevObj = this.props.location.state;

    if (prevObj.id !== "") {
      this.setState({
        exchange: prevObj.item.exchange,
        membership: prevObj.item.membership,
        feeslimits: prevObj.item.feeslimits,
        referalpattern: prevObj.item.referalpattern,
        remark: prevObj.item.remark,
        modifiedby: prevObj.item.modifiedby,
        assignedby: prevObj.item.assignedby
      });
    } else {
      this.props.history.push("/app/my-account/patterns-assignments");
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  /**
   * On Edit Customers
   */
  onEditPatternsAssignments() {
    const {
      exchange,
      membership,
      feeslimits,
      referalpattern,
      remark,
      assignedby,
      modifiedby
    } = this.state;
    const { errors, isValid } = validateEditPatternsAssignments(this.state);
    this.setState({ errors: errors });

    if (isValid) {
      this.props.editPatternsAssignments({
        exchange,
        membership,
        feeslimits,
        referalpattern,
        assignedby,
        modifiedby,
        remark
      });
    }
  }

  ondeleteCustomerDialog(data) {
    const { errors, isValid } = validateEditPatternsAssignments(this.state);
    this.setState({ errors: errors });
    if (isValid) {
      this.refs.deleteConfirmationDialog.open();
      this.setState({ selectedUser: data });
    }
  }

  ondeleteCustomer() {
    const { selectedUser } = this.state;
    this.props.deletePatternsAssignments({ selectedUser });
    this.refs.deleteConfirmationDialog.close();
  }

  render() {
    const {
      exchange,
      membership,
      feeslimits,
      referalpattern,
      remark,
      assignedby,
      modifiedby,
      errors
    } = this.state;

    return (
      <div>
        <Form>
          <Row>
            <Col md={12}>
              <FormGroup className="row">
                <Label for="exchange" className="col-md-2">
                  {
                    <IntlMessages id="my_account.patternsAssignments.exchange" />
                  }
                </Label>
                <Input
                  type="select"
                  name="exchange"
                  value={exchange}
                  className="col-md-5"
                  id="exchange"
                  onChange={this.handleChange}
                >
                  <option value="">Please Select</option>
                  <option value="OHO Cash">OHO Cash</option>
                  <option value="PARO Exchange">PARO Exchange</option>
                  <option value="UNIQ Exchange">UNIQ Exchange</option>
                </Input>
                {errors.exchange && (
                  <span className="text-danger text-left">
                    <IntlMessages id={errors.exchange} />
                  </span>
                )}
              </FormGroup>

              <FormGroup className="row">
                <Label for="membership" className="col-md-2">
                  {
                    <IntlMessages id="my_account.patternsAssignments.membership" />
                  }
                </Label>
                <Input
                  type="select"
                  name="membership"
                  value={membership}
                  className="col-md-5"
                  id="membership"
                  onChange={this.handleChange}
                >
                  <option value="">Please Select</option>
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premimum">Premimum</option>
                </Input>
                {errors.membership && (
                  <span className="text-danger text-left">
                    <IntlMessages id={errors.membership} />
                  </span>
                )}
              </FormGroup>

              <FormGroup className="row">
                <Label for="feeslimits" className="col-md-2">
                  {
                    <IntlMessages id="my_account.patternsAssignments.feesLimits" />
                  }
                </Label>
                <Input
                  type="select"
                  name="feeslimits"
                  value={feeslimits}
                  className="col-md-5"
                  id="feeslimits"
                  onChange={this.handleChange}
                >
                  <option value="">Please Select</option>
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premimum">Premimum</option>
                </Input>
                {errors.feeslimits && (
                  <span className="text-danger text-left">
                    <IntlMessages id={errors.feeslimits} />
                  </span>
                )}
              </FormGroup>

              <FormGroup className="row">
                <Label for="referalpattern" className="col-md-2">
                  {
                    <IntlMessages id="my_account.patternsAssignments.referalPattern" />
                  }
                </Label>
                <Input
                  type="select"
                  name="referalpattern"
                  className="col-md-5"
                  value={referalpattern}
                  id="referalpattern"
                  onChange={this.handleChange}
                >
                  <option value="">Please Select</option>
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premimum">Premimum</option>
                </Input>
                {errors.referalpattern && (
                  <span className="text-danger text-left">
                    <IntlMessages id={errors.referalpattern} />
                  </span>
                )}
              </FormGroup>

              <FormGroup className="row">
                <Label for="remark" className="col-md-2">
                  {<IntlMessages id="my_account.common.remark" />}
                </Label>
                <Input
                  type="textarea"
                  name="remark"
                  value={remark}
                  className="col-md-5"
                  id="remark"
                  onChange={this.handleChange}
                />
                {errors.remark && (
                  <span className="text-danger text-left">
                    <IntlMessages id={errors.remark} />
                  </span>
                )}
              </FormGroup>

              <FormGroup className="row">
                <Label for="assignedby" className="col-md-2">
                  {
                    <IntlMessages id="my_account.patternAssignments.assignedby" />
                  }
                </Label>
                <Label
                  value={assignedby}
                  for="accountcreatedat"
                  className="col-md-5"
                >
                  {assignedby}
                </Label>
              </FormGroup>

              <FormGroup className="row">
                <Label for="modifiedby" className="col-md-2">
                  {
                    <IntlMessages id="my_account.patternAssignments.modifiedby" />
                  }
                </Label>
                <Label
                  value={modifiedby}
                  for="accountcreatedat"
                  className="col-md-5"
                >
                  {modifiedby}
                </Label>
              </FormGroup>

              <FormGroup className="has-wrapper" row>
                <div className="col-md-2" />

                <div className="col-md-1 p-0 mr-15">
                  <MatButton
                    variant="raised"
                    className="btn-success mb-10 text-white"
                    onClick={this.onEditPatternsAssignments}
                  >
                    <IntlMessages id="my_account.patternAssignments.editPatternsAssignments" />
                  </MatButton>
                </div>

                <div className="col-md-1 p-0 mr-15">
                  <MatButton
                    variant="raised"
                    className="btn-danger mb-10 text-white"
                    onClick={() => this.ondeleteCustomerDialog(this.state)}
                  >
                    {
                      <IntlMessages id="my_account.patternAssignments.deletePatternsAssignments" />
                    }
                  </MatButton>
                </div>
                <div className="col-md-1 p-0 mr-15">
                  <MatButton
                    component={Link}
                    to="/app/my-account/patterns-assignments"
                    variant="raised"
                    color="primary"
                    className="mb-10 text-white"
                  >
                    {
                      <IntlMessages id="my_account.patternsassignments.cancel" />
                    }
                  </MatButton>
                </div>
              </FormGroup>
            </Col>
          </Row>
        </Form>

        <DeleteConfirmationDialog
          ref="deleteConfirmationDialog"
          title="Are You Sure Want To Delete?"
          message="This will delete user permanently."
          onConfirm={() => this.ondeleteCustomer()}
        />
      </div>
    );
  }
}

// map state to props
const mapStateToProps = ({ patternsAssignment }) => {
  var response = {
    userList: patternsAssignment.displayCustomersData,
    loading: patternsAssignment.loading
  };
  return response;
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      editPatternsAssignments,
      deletePatternsAssignments
    }
  )(EditPatternsAssignments)
);
