/**
 * Form Elemets
 */
/**
 * Profile
 */
import React, { Component } from "react";
import { Form, FormGroup, Input, Label, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// redux action
import { updateProfile } from "Actions/MyAccount";

//intl messages
import IntlMessages from "Util/IntlMessages";
import MatButton from "@material-ui/core/Button";

//Validation
const validateUpdateProfile = require("../../validation/MyAccount/update_profiles");

class ProfileInfoWdgt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileName: "",
      profileDescription: "",
      exchange: "",
      errors: "",
      createdat: "",
      modifiedat: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.onUpdateProfile = this.onUpdateProfile.bind(this);
  }

  componentWillMount() {
    let prevObj = this.props.location.state;
    if (prevObj.id !== "") {
      this.setState({
        profileName: prevObj.item.profilename,
        profileDescription: prevObj.item.description,
        exchange: prevObj.item.exchange,
        createdat: prevObj.item.createdat,
        modifiedat: prevObj.item.modifiedat
      });
    } else {
      this.props.history.push("/app/my-account/customers");
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  /**
   * On Create Profile
   */
  onUpdateProfile() {
    const {
      profileName,
      profileDescription,
      exchange,
      modifiedat,
      createdat
    } = this.state;
    const { errors, isValid } = validateUpdateProfile(this.state);
    this.setState({ errors: errors });

    if (isValid) {
      this.props.updateProfile({
        profileName,
        profileDescription,
        exchange,
        modifiedat,
        createdat
      });
    }
  }

  render() {
    const {
      profileName,
      profileDescription,
      exchange,
      createdat,
      modifiedat,
      errors
    } = this.state;
    return (
      <div className="mt-20">
        <Form>
          <Row>
            <Col md={12}>
              <FormGroup className="row">
                <Label for="profileName" className="col-md-2 p-0">
                  {<IntlMessages id="profile.profileName" />}
                </Label>
                <Input
                  type="text"
                  name="profileName"
                  className="col-md-5"
                  value={profileName}
                  id="profileName"
                  placeholder="Enter Profile Name"
                  onChange={this.handleChange}
                />
                {errors.profileName && (
                  <span className="text-danger text-left">
                    <IntlMessages id={errors.profileName} />
                  </span>
                )}
              </FormGroup>

              <FormGroup className="row">
                <Label for="profileDescription" className="col-md-2 p-0">
                  {<IntlMessages id="profile.profiledescription" />}
                </Label>
                <Input
                  type="textarea"
                  name="profileDescription"
                  className="col-md-5"
                  value={profileDescription}
                  id="profileDescription"
                  placeholder="Enter Profile Description"
                  onChange={this.handleChange}
                />
                {errors.profileDescription && (
                  <span className="text-danger text-left">
                    <IntlMessages id={errors.profileDescription} />
                  </span>
                )}
              </FormGroup>

              <FormGroup className="row">
                <Label for="exchange" className="col-md-2 p-0">
                  {<IntlMessages id="profile.profileExchange" />}
                </Label>
                <Input
                  type="select"
                  name="exchange"
                  className="col-md-5"
                  value={exchange}
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
                <Label for="accountcreatedat" className="col-md-2 p-0">
                  {<IntlMessages id="profile.profilecreatedat" />}
                </Label>
                <div className="col-md-8">
                  <Label for="accountcreatedat" className="control-label ">
                    {createdat}
                  </Label>
                </div>
              </FormGroup>

              <FormGroup className="row">
                <Label for="accountcreatedat" className="col-md-2 p-0">
                  {<IntlMessages id="profile.profilemodifiedat" />}
                </Label>
                <div className="col-md-8">
                  <Label for="accountcreatedat" className="control-label">
                    {modifiedat}
                  </Label>
                </div>
              </FormGroup>

              <FormGroup className="has-wrapper" row>
                <div className="col-md-2" />
                <div className="col-md-1 p-0">
                  <MatButton
                    variant="raised"
                    className="btn-primary text-white mb-10"
                    onClick={this.onUpdateProfile}
                  >
                    {<IntlMessages id="profile.updateProfile" />}
                  </MatButton>
                </div>
                <div className="col-md-2" />
                <div className="col-md-2" />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

// map state to props
const mapStateToProps = ({ profiles }) => {
  var response = {
    userList: profiles.profilesdata,
    loading: profiles.loading
  };
  return response;
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      updateProfile
    }
  )(ProfileInfoWdgt)
);
