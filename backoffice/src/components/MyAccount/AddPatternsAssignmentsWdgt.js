/**
 * Form Elemets
 */
/**
 * Add Customer
 */
import React, { Component } from "react";
import { Form, FormGroup, Input, Label, div, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

// redux action
import { addPatternsAssignments } from "Actions/MyAccount";
import MatButton from "@material-ui/core/Button";

//intl messages
import IntlMessages from "Util/IntlMessages";

//Validation
const validateAddPatternsAssignments = require("../../validation/MyAccount/add_patterns_assignments");

class AddPatternsAssignmentsWdgt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exchange: "",
      membership: "",
      feeslimits: "",
      referalpattern: "",
      remark: "",
      errors: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.onAddPatternsAssignments = this.onAddPatternsAssignments.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  /**
   * On Add Customers
   */
  onAddPatternsAssignments() {
    const {
      exchange,
      membership,
      feeslimits,
      referalpattern,
      remark
    } = this.state;
    const { errors, isValid } = validateAddPatternsAssignments(this.state);
    this.setState({ errors: errors });

    if (isValid) {
      this.props.addPatternsAssignments({
        exchange,
        membership,
        feeslimits,
        referalpattern,
        remark
      });
    }
  }

  render() {
    const {
      exchange,
      membership,
      feeslimits,
      referalpattern,
      remark,
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
                  className="col-md-5"
                  value={membership}
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
                  value={referalpattern}
                  className="col-md-5"
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

              <FormGroup className="has-wrapper" row>
                <div className="col-md-2" />
                <div className="col-md-2 p-0 mr-15">
                  <MatButton
                    variant="raised"
                    className="btn-primary text-white mb-15"
                    onClick={this.onAddPatternsAssignments}
                  >
                    <IntlMessages id="my_account.patternAssignments.addNewpatternsAssignments" />
                  </MatButton>
                </div>
                <div className="col-md-2 p-0 mr-15">
                  <MatButton
                    component={Link}
                    to="/app/my-account/patterns-assignments"
                    variant="raised"
                    className="btn-danger text-white mb-15"
                  >
                    <IntlMessages id="my_account.patternsassignments.cancel" />
                  </MatButton>
                </div>
              </FormGroup>
            </Col>
          </Row>
        </Form>
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

export default connect(
  mapStateToProps,
  {
    addPatternsAssignments
  }
)(AddPatternsAssignmentsWdgt);
