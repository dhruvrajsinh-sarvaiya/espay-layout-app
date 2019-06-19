/**
 * Add Roles Wdgt
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { Form, FormGroup, Input, Label } from "reactstrap";
import MatButton from "@material-ui/core/Button";
// redux action
import { roles, editRoles, getRolesById } from "Actions/MyAccount";

//intl messages
import IntlMessages from "Util/IntlMessages";

//Validation
const validateAddRole = require("../../validation/MyAccount/add_roles");

const exchangeList = [
  { id: 1, name: "Ohocash" },
  { id: 2, name: "Paro Exchange" },
  { id: 3, name: "Uniq Exchange" }
];

class EditRolesWdgt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        role_name: "",
        role_description: "",
        role_exchange: "",
        reports_to: "",
        created_by: "",
        modified_by: ""
      },
      list: [],
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    var roleId = this.props.match.params.id;
    if (roleId !== "") {
      this.props.roles();
      this.props.getRolesById(roleId);
    } else {
      this.props.history.push("/app/my-account/roles");
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data,
      list: nextProps.list
    });
  }

  onChange(event) {
    let newData = Object.assign({}, this.state.data);
    newData[event.target.name] = event.target.value;
    this.setState({ data: newData });
  }

  onSubmit(event) {
    event.preventDefault();
    const { errors, isValid } = validateAddRole(this.state);
    this.setState({ errors: errors });

    if (isValid) {
      this.props.editRoles(this.state.data);
    }
  }

  render() {
    const {
      role_name,
      role_description,
      role_exchange,
      reports_to,
      created_by,
      modified_by
    } = this.state.data;
    const reportToList = this.state.list;
    const { errors } = this.state;
    const { showTitle } = this.props;
    return (
      <Fragment>
        <div className="card p-30">
          {showTitle && (
            <h2 className="mb-10 text-center">
              <span className="border-bottom border-warning">
                <IntlMessages id="sidebar.editRoles" />
              </span>
            </h2>
          )}
          <Form>
            <FormGroup className="row">
              <Label htmlFor="newrole" className="col-md-2">
                <IntlMessages id="my_account.newRole" />
              </Label>
              <Input
                type="text"
                className="form-control col-md-9"
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
              <Label htmlFor="roleDescription" className="col-md-2">
                <IntlMessages id="my_account.roleDescription" />
              </Label>
              <Input
                type="textarea"
                className="form-control col-md-9"
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
              <Label htmlFor="role_exchange" className="col-md-2">
                <IntlMessages id="my_account.exchange" />
              </Label>
              <Input
                type="select"
                name="role_exchange"
                className="form-control col-md-9"
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
              <Label htmlFor="reports_to" className="col-md-2">
                <IntlMessages id="my_account.reportsTo" />
              </Label>
              <Input
                type="select"
                name="reports_to"
                className="form-control col-md-9"
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
            <FormGroup className="row">
              <Label className="col-md-2">
                <IntlMessages id="sidebar.createdBy" />
              </Label>
              <Label className="col-md-9">{created_by}</Label>
            </FormGroup>
            <FormGroup className="row">
              <Label className="col-md-2">
                <IntlMessages id="sidebar.modifiedBy" />
              </Label>
              <Label className="col-md-9">{modified_by}</Label>
            </FormGroup>
            <FormGroup className="row offset-md-2">
              <div className="col-md-2 p-0 mr-15">
                <MatButton
                  variant="raised"
                  className="btn-primary text-white mb-15"
                  onClick={this.onSubmit}
                >
                  <IntlMessages id="sidebar.btnSaveRole" />
                </MatButton>
              </div>

              <div className="col-md-2 p-0 mr-15">
                <MatButton
                  component={Link}
                  to="/app/my-account/roles"
                  variant="raised"
                  className="btn-danger text-white mb-15"
                >
                  <IntlMessages id="sidebar.btnCancel" />
                </MatButton>
              </div>
            </FormGroup>
          </Form>
        </div>
      </Fragment>
    );
  }
}

EditRolesWdgt.defaultProps = {
  showTitle: false
};

const mapStateToProps = ({ rolesRdcer }) => {
  const { list, data, loading } = rolesRdcer;
  return { list, data, loading };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      roles,
      editRoles,
      getRolesById
    }
  )(EditRolesWdgt)
);
