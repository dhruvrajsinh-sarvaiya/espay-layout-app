/**
 * Add Roles Wdgt
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { Form, FormGroup, Input, Label } from "reactstrap";

// redux action
import { roles, addRoles } from "Actions/MyAccount";

//intl messages
import IntlMessages from "Util/IntlMessages";
import MatButton from "@material-ui/core/Button";

//Validation
const validateAddRole = require("../../validation/MyAccount/add_roles");

const exchangeList = [
  { id: 1, name: "Ohocash" },
  { id: 2, name: "Paro Exchange" },
  { id: 3, name: "Uniq Exchange" }
];

class AddRolesWdgt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role_name: "",
      role_description: "",
      role_exchange: "",
      reports_to: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    this.props.roles();
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();

    const { errors, isValid } = validateAddRole(this.state);
    this.setState({ errors: errors });

    if (isValid) {
      this.props.addRoles(this.state);
    }
  }

  render() {
    const {
      role_name,
      role_description,
      role_exchange,
      reports_to,
      errors
    } = this.state;
    const reportToList = this.props.list;
    return (
      <Fragment>
        <Form className=" mt-20 offset-md-2">
          <FormGroup className="row ">
            <Label htmlFor="newrole" className="col-md-3 text-right">
              <IntlMessages id="my_account.newRole" />
            </Label>
            <Input
              type="text"
              className="form-control col-md-6"
              id="newrole"
              name="role_name"
              value={role_name}
              onChange={this.onChange}
            />
            {errors.role_name && (
              <small className="offset-md-3 form-text text-danger">
                <IntlMessages id={errors.role_name} />
              </small>
            )}
          </FormGroup>
          <FormGroup className="row">
            <Label htmlFor="roleDescription" className="col-md-3 text-right">
              <IntlMessages id="my_account.roleDescription" />
            </Label>
            <Input
              type="textarea"
              className="form-control col-md-6"
              name="role_description"
              id="role_description"
              value={role_description}
              onChange={this.onChange}
            />
            {errors.role_description && (
              <small className="offset-md-3 form-text text-danger">
                <IntlMessages id={errors.role_description} />
              </small>
            )}
          </FormGroup>
          <FormGroup className="row">
            <Label htmlFor="role_exchange" className="col-md-3 text-right">
              <IntlMessages id="my_account.exchange" />
            </Label>
            <Input
              type="select"
              name="role_exchange"
              className="form-control col-md-6"
              id="role_exchange"
              value={role_exchange}
              onChange={this.onChange}
            >
              <option value="">-- Select Exchange --</option>
              {exchangeList &&
                exchangeList.map((list, index) => (
                  <option key={index} value={list.id}>
                    {list.name}
                  </option>
                ))}
            </Input>
            {errors.role_exchange && (
              <small className="offset-md-3 form-text text-danger">
                <IntlMessages id={errors.role_exchange} />
              </small>
            )}
          </FormGroup>
          <FormGroup className="row">
            <Label htmlFor="reports_to" className="col-md-3 text-right">
              <IntlMessages id="my_account.reportsTo" />
            </Label>
            <Input
              type="select"
              name="reports_to"
              className="form-control col-md-6"
              id="reports_to"
              value={reports_to}
              onChange={this.onChange}
            >
              <option value="">-- Select Report To --</option>
              {reportToList &&
                reportToList.map((list, index) => (
                  <option key={index} value={list.id}>
                    {list.name}
                  </option>
                ))}
            </Input>
            {errors.reports_to && (
              <small className="offset-md-3 form-text text-danger">
                <IntlMessages id={errors.reports_to} />
              </small>
            )}
          </FormGroup>
          <FormGroup className="row offset-md-3">
            <div className="col-md-2">
              <MatButton
                variant="raised"
                className="btn-primary text-white"
                onClick={this.onSubmit}
              >
                <IntlMessages id="sidebar.btnSaveRole" />
              </MatButton>
            </div>

            <div className="col-md-2">
              <MatButton
                component={Link}
                to="/app/my-account/roles"
                variant="raised"
                className="btn-danger text-white"
              >
                <IntlMessages id="sidebar.btnCancel" />
              </MatButton>
            </div>
          </FormGroup>
        </Form>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ rolesRdcer }) => {
  const { list, loading } = rolesRdcer;
  return { list, loading };
};

export default connect(
  mapStateToProps,
  {
    roles,
    addRoles
  }
)(AddRolesWdgt);

// export default AddRolesWdgt;
