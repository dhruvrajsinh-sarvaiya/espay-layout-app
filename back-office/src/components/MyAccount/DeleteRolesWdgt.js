/**
 * Add Roles Wdgt
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import Button from "@material-ui/core/Button";
import { Form, FormGroup, Input, Label } from "reactstrap";

// redux action
import { roles, deleteRoles } from "Actions/MyAccount";

//intl messages
import IntlMessages from "Util/IntlMessages";

//Validation
const validateAddRole = require("../../validation/MyAccount/add_roles");

class DeleteRolesWdgt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role_name: "",
      transfer_to_role: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    let prevObj = this.props.location.state;
    if (prevObj.id != "") {
      this.setState({
        role_name: prevObj.name,
        transfer_to_role: prevObj.id
      });

      this.props.roles();
    } else {
      this.props.history.push("/app/my-account/roles");
    }
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
    const { role_name, transfer_to_role, errors } = this.state;
    const reportToList = this.props.list;
    return (
      <Fragment>
        <div className="card w-50 mx-auto p-30">
          <h2 className="mb-10 text-center">
            <span className="border-bottom border-warning">
              <IntlMessages id="sidebar.deleteRoles" />
            </span>
          </h2>
          <p className="form-text">
            <IntlMessages id="my_account.deleteRoleNote" />
          </p>
          <Form>
            <FormGroup className="row">
              <Label htmlFor="role_name" className="col-md-3">
                <IntlMessages id="my_account.roleToDelete" />
              </Label>
              <Input
                type="text"
                className="form-control col-md-9"
                id="role_name"
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
              <Label htmlFor="transfer_to_role" className="col-md-3">
                <IntlMessages id="my_account.reportsTo" />
              </Label>
              <Input
                type="select"
                name="transfer_to_role"
                className="form-control col-md-9"
                id="transfer_to_role"
                value={transfer_to_role}
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
              {errors.transfer_to_role && (
                <small className="offset-md-3 form-text text-danger">
                  <IntlMessages id={errors.transfer_to_role} />
                </small>
              )}
            </FormGroup>
            <FormGroup>
              <Button
                variant="raised"
                color="primary"
                className="btn mr-10"
                onClick={this.onSubmit}
              >
                <IntlMessages id="sidebar.btnTransferNDelete" />
              </Button>
              <Link
                to="/app/my-account/roles"
                className="btn bg-danger text-white"
              >
                <IntlMessages id="sidebar.btnCancel" />
              </Link>
            </FormGroup>
          </Form>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ rolesRdcer }) => {
  const { list, loading } = rolesRdcer;
  return { list, loading };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      roles,
      deleteRoles
    }
  )(DeleteRolesWdgt)
);

// export default DeleteRolesWdgt;
