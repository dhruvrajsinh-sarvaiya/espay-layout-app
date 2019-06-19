/**
 * CreatedBy : Salim Deraiya
 * Date :08/10/2018
 * Edit Complain Form
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { Form, FormGroup, Label, Input } from "reactstrap";

// intl messages
import IntlMessages from "Util/IntlMessages";
//Import addComplain...
import { getComplainById, editComplain } from "Actions/MyAccount";
import MatButton from "@material-ui/core/Button";
//Import Complain Type list object
import { departmentList, ticketOwnerList, priorityList } from "Helpers/helpers";
const validateComplainForm = require("../../validation/MyAccount/complain_form");

class EditComplainFormWdgt extends Component {
  constructor(props) {
    super();
    this.state = {
      data: {
        customer_name: "",
        customer_email: "",
        phone: "",
        department_id: "",
        subject: "",
        description: "",
        status: "",
        ticket_owner: "",
        due_date: "",
        priority: "",
        attachment: ""
      },
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    var cId = this.props.location.state.id;
    if (cId != "") {
      this.props.getComplainById(cId);
    } else {
      this.props.history.push("/app/my-account/complain-reports");
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.data });
  }

  onChange(event) {
    let newObj = Object.assign({}, this.state.data);
    newObj[event.target.name] = event.target.value;
    this.setState({ data: newObj });
  }

  onSubmit(event) {
    event.preventDefault();

    const { errors, isValid } = validateComplainForm(this.state.data);
    this.setState({ errors: errors });

    if (isValid) {
      const finalObj = this.state.data;
      delete finalObj["customer_name"];
      delete finalObj["customer_email"];
      delete finalObj["phone"];

      this.props.editComplain(finalObj);
      this.props.history.push("/app/my-account/complain-reports");
    }
  }

  render() {
    const {
      department_id,
      customer_name,
      customer_email,
      phone,
      subject,
      description,
      status,
      ticket_owner,
      due_date,
      priority
    } = this.state.data;
    const { errors } = this.state;
    const departments = departmentList();
    const ticketOwners = ticketOwnerList();
    const prioritys = priorityList();
    return (
      <Fragment>
        <div className="card p-15">
          <h2 className="heading pb-10 mb-20 border-bottom">
            <IntlMessages id="sidebar.editComplain" />
          </h2>
          <Form>
            <div className="row">
              <div className="col-md-4">
                <FormGroup>
                  <Label className="col-form-label">
                    <IntlMessages id="sidebar.customerName" />
                  </Label>
                  <Input
                    type="text"
                    name="customer_name"
                    disabled="disabled"
                    className="form-control"
                    id="customer_name"
                    value={customer_name}
                    onChange={this.onChange}
                  />
                  {errors.customer_name && (
                    <span className="text-danger">
                      <IntlMessages id={errors.customer_name} />
                    </span>
                  )}
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup>
                  <Label className="col-form-label">
                    <IntlMessages id="sidebar.email" />
                  </Label>
                  <Input
                    type="text"
                    name="customer_email"
                    disabled="disabled"
                    className="form-control"
                    id="customer_email"
                    value={customer_email}
                    onChange={this.onChange}
                  />
                  {errors.customer_email && (
                    <span className="text-danger">
                      <IntlMessages id={errors.customer_email} />
                    </span>
                  )}
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup>
                  <Label className="col-form-label">
                    <IntlMessages id="sidebar.phone" />
                  </Label>
                  <Input
                    type="text"
                    name="phone"
                    disabled="disabled"
                    className="form-control"
                    id="phone"
                    value={phone}
                    onChange={this.onChange}
                  />
                  {errors.phone && (
                    <span className="text-danger">
                      <IntlMessages id={errors.phone} />
                    </span>
                  )}
                </FormGroup>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <FormGroup>
                  <Label className="col-form-label">
                    <IntlMessages id="sidebar.department" />
                  </Label>
                  <Input
                    type="select"
                    name="department_id"
                    className="form-control"
                    id="department_id"
                    value={department_id}
                    onChange={this.onChange}
                  >
                    <option value="">-- Select Department --</option>
                    {departments &&
                      departments.map((list, index) => (
                        <option key={index} value={list.id}>
                          {list.name}
                        </option>
                      ))}
                  </Input>
                  {errors.department_id && (
                    <span className="text-danger">
                      <IntlMessages id={errors.department_id} />
                    </span>
                  )}
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup>
                  <Label className="col-form-label">
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
                    <option value="1">Open</option>
                    <option value="0">Closed</option>
                  </Input>
                  {errors.status && (
                    <span className="text-danger">
                      <IntlMessages id={errors.status} />
                    </span>
                  )}
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup>
                  <Label className="col-form-label">
                    <IntlMessages id="sidebar.ticketOwner" />
                  </Label>
                  <Input
                    type="select"
                    name="ticket_owner"
                    className="form-control"
                    id="ticket_owner"
                    value={ticket_owner}
                    onChange={this.onChange}
                  >
                    <option value="">-- Select Type --</option>
                    {ticketOwners &&
                      ticketOwners.map((list, index) => (
                        <option key={index} value={list.id}>
                          {list.name}
                        </option>
                      ))}
                  </Input>
                  {errors.ticket_owner && (
                    <span className="text-danger">
                      <IntlMessages id={errors.ticket_owner} />
                    </span>
                  )}
                </FormGroup>
              </div>
            </div>
            <FormGroup>
              <Label className="col-form-label">
                <IntlMessages id="sidebar.subject" />
              </Label>
              <Input
                type="text"
                name="subject"
                className="form-control"
                id="subject"
                value={subject}
                onChange={this.onChange}
              />
              {errors.subject && (
                <span className="text-danger">
                  <IntlMessages id={errors.subject} />
                </span>
              )}
            </FormGroup>
            <FormGroup>
              <Label className="col-form-label">
                <IntlMessages id="sidebar.description" />
              </Label>
              <Input
                type="textarea"
                name="description"
                className="form-control"
                rows="10"
                id="description"
                value={description}
                onChange={this.onChange}
              />
              {errors.description && (
                <span className="text-danger">
                  <IntlMessages id={errors.description} />
                </span>
              )}
            </FormGroup>
            <div className="row">
              <div className="col-md-4">
                <FormGroup>
                  <Label className="col-form-label">
                    <IntlMessages id="sidebar.priority" />
                  </Label>
                  <Input
                    type="select"
                    name="priority"
                    className="form-control"
                    id="priority"
                    value={priority}
                    onChange={this.onChange}
                  >
                    <option value="">-- Select Type --</option>
                    {prioritys &&
                      prioritys.map((list, index) => (
                        <option key={index} value={list.id}>
                          {list.name}
                        </option>
                      ))}
                  </Input>
                  {errors.priority && (
                    <span className="text-danger">
                      <IntlMessages id={errors.priority} />
                    </span>
                  )}
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup>
                  <Label className="col-form-label">
                    <IntlMessages id="sidebar.dueDate" />
                  </Label>
                  <Input
                    type="date"
                    name="due_date"
                    className="form-control"
                    id="due_date"
                    value={due_date}
                    onChange={this.onChange}
                  />
                  {errors.due_date && (
                    <span className="text-danger">
                      <IntlMessages id={errors.due_date} />
                    </span>
                  )}
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup>
                  <Label className="col-form-label">
                    <IntlMessages id="sidebar.attachments" />
                  </Label>
                  <Input
                    type="file"
                    name="attachment"
                    className="form-control"
                    id="attachment"
                    onChange={this.onChange}
                  />
                  {errors.attachment && (
                    <span className="text-danger">
                      <IntlMessages id={errors.attachment} />
                    </span>
                  )}
                </FormGroup>
              </div>
            </div>
            <div className="row">
              <div className="col-md-10" />

              <div className="col-md-1">
                <MatButton
                  variant="raised"
                  className="btn-primary text-white"
                  onClick={this.onSubmit}
                >
                  <IntlMessages id="sidebar.btnSubmit" />
                </MatButton>
              </div>

              <div className="col-md-1">
                <MatButton
                  component={Link}
                  to="/app/my-account/complain-reports"
                  variant="raised"
                  className="btn-danger text-white"
                >
                  <IntlMessages id="sidebar.btnCancel" />
                </MatButton>
              </div>
            </div>
          </Form>
        </div>
      </Fragment>
    );
  }
}

// map state to props
const mapStateToProps = ({ complainRdcer }) => {
  const { data, loading } = complainRdcer;
  return { data, loading };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      getComplainById,
      editComplain
    }
  )(EditComplainFormWdgt)
);
