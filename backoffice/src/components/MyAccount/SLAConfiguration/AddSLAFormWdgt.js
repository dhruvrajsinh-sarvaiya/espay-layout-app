/**
 * Auther : Salim Deraiya
 * Created : 09/10/2018
 * Add SLA Configuration
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

import Button from "@material-ui/core/Button";
import { Form, FormGroup, Input, Label } from "reactstrap";

// redux action
import { addSLAConfiguration } from "Actions/MyAccount";

//intl messages
import IntlMessages from "Util/IntlMessages";
//Helper
import { priorityList, responseList, resolveList } from "Helpers/helpers";
//Validation
const validateSLAForm = require("../../../validation/MyAccount/sla_configuration");



class AddSLAFormWdgt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        name: "",
        description: "",
        execute_on: "",
        priority: "2",
        response: "",
        response_within: "1",
        resolve: "",
        resolve_within: "2",
        status: ""
      },
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    let newObj = Object.assign({}, this.state.data);
    newObj[event.target.name] = event.target.value;
    this.setState({ data: newObj });
  }

  onSubmit(event) {
    event.preventDefault();

    const { errors, isValid } = validateSLAForm(this.state.data);
    this.setState({ errors: errors });

    if (isValid) {
      this.props.addSLAConfiguration(this.state.data);
    }
  }

  render() {
    const {
      name,
      description,
      execute_on,
      priority,
      resolve,
      resolve_within,
      response,
      response_within,
      status
    } = this.state.data;
    const { errors } = this.state;
    const prioritys = priorityList();
    const responses = responseList();
    const resolves = resolveList();
    return (
      <Fragment>
        <div className="card p-30">
          <Form>
            <div className="row">
              <div className="col-md-6 col-sm-12 pr-30 border-right">
                <h2>
                  <IntlMessages id="sidebar.editSla" />
                </h2>
                <FormGroup>
                  <Label htmlFor="name">
                    <IntlMessages id="sidebar.name" />
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={name}
                    onChange={this.onChange}
                  />
                  {errors.name && (
                    <small className="form-text text-danger">
                      <IntlMessages id={errors.name} />
                    </small>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="description">
                    <IntlMessages id="sidebar.description" />
                  </Label>
                  <Input
                    type="textarea"
                    className="form-control"
                    name="description"
                    id="description"
                    value={description}
                    onChange={this.onChange}
                  />
                  {errors.description && (
                    <small className="form-text text-danger">
                      <IntlMessages id={errors.description} />
                    </small>
                  )}
                </FormGroup>
                <FormGroup className="row">
                  <div className="col-md-6 col-sm-12">
                    <Label htmlFor="execute_on">
                      <IntlMessages id="sidebar.executeOn" />
                    </Label>
                    <Input
                      type="select"
                      name="execute_on"
                      className="form-control"
                      id="execute_on"
                      value={execute_on}
                      onChange={this.onChange}
                    >
                      <option value="">-- Select ExecuteOn --</option>
                      <option value="1">Ticket Create</option>
                    </Input>
                    {errors.execute_on && (
                      <small className="form-text text-danger">
                        <IntlMessages id={errors.execute_on} />
                      </small>
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <Label htmlFor="status">
                      <IntlMessages id="sidebar.status" />
                    </Label>
                    <Input
                      type="select"
                      name="status"
                      className="form-control"
                      id="status"
                      value={status}
                      onChange={this.onChange}
                    >
                      <option value="">-- Select Status --</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </Input>
                    {errors.status && (
                      <small className="form-text text-danger">
                        <IntlMessages id={errors.status} />
                      </small>
                    )}
                  </div>
                </FormGroup>
              </div>
              <div className="col-md-6 col-sm-12 pl-30">
                <h2>
                  <IntlMessages id="sidebar.target" />
                </h2>
                <FormGroup>
                  <Label htmlFor="priority">
                    <IntlMessages id="sidebar.priority" />
                  </Label>
                  <Input
                    type="select"
                    name="priority"
                    className="form-control w-50"
                    id="priority"
                    value={priority}
                    onChange={this.onChange}
                  >
                    <option value="">-- Select Priority --</option>
                    {prioritys &&
                      prioritys.map((list, index) => (
                        <option key={index} value={list.id}>
                          {list.name}
                        </option>
                      ))}
                  </Input>
                  {errors.priority && (
                    <small className="form-text text-danger">
                      <IntlMessages id={errors.priority} />
                    </small>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="response_within">
                    <IntlMessages id="sidebar.respondWithin" />
                  </Label>
                  <div>
                    <Input
                      type="text"
                      className="form-control w-10 d-inline mr-20"
                      name="response"
                      id="response"
                      value={response}
                      onChange={this.onChange}
                    />
                    <Input
                      type="select"
                      name="response_within"
                      className="form-control w-25 d-inline"
                      id="response_within"
                      value={response_within}
                      onChange={this.onChange}
                    >
                      {responses &&
                        responses.map((list, index) => (
                          <option key={index} value={list.id}>
                            {list.name}
                          </option>
                        ))}
                    </Input>
                  </div>
                  {errors.response && (
                    <small className="form-text text-danger">
                      <IntlMessages id={errors.response} />
                    </small>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="resolve_within">
                    <IntlMessages id="sidebar.resolveWithin" />
                  </Label>
                  <div>
                    <Input
                      type="text"
                      className="form-control w-10 d-inline mr-20"
                      name="resolve"
                      id="resolve"
                      value={resolve}
                      onChange={this.onChange}
                    />
                    <Input
                      type="select"
                      name="resolve_within"
                      className="form-control w-25 d-inline"
                      id="resolve_within"
                      value={resolve_within}
                      onChange={this.onChange}
                    >
                      {resolves &&
                        resolves.map((list, index) => (
                          <option key={index} value={list.id}>
                            {list.name}
                          </option>
                        ))}
                    </Input>
                  </div>
                  {errors.resolve && (
                    <small className="form-text text-danger">
                      <IntlMessages id={errors.resolve} />
                    </small>
                  )}
                </FormGroup>
              </div>
              <div className="col-md-12">
                <div className="text-right">
                  <Button
                    variant="raised"
                    color="primary"
                    className="btn mr-10"
                    onClick={this.onSubmit}
                  >
                    <IntlMessages id="sidebar.btnSave" />
                  </Button>
                  <Link
                    to="/app/my-account/sla-configuration"
                    className="btn bg-danger text-white"
                  >
                    <IntlMessages id="sidebar.btnCancel" />
                  </Link>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ slaRdcer }) => {
  const { data, loading } = slaRdcer;
  return { data, loading };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      addSLAConfiguration
    }
  )(AddSLAFormWdgt)
);
