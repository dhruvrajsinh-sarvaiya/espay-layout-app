/**
 * Form Elemets
 */
/**
 * Create New Profile
 */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Form, FormGroup, Input, Label, Row, Col } from "reactstrap";
import { connect } from "react-redux";

// redux action
import { createProfile } from "Actions/MyAccount";

//intl messages
import IntlMessages from "Util/IntlMessages";
import MatButton from "@material-ui/core/Button";

//Validation
const validateCreateProfile = require("../../validation/MyAccount/profiles");

class CreateProfileWdgt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileName: "",
      profileDescription: "",
      exchange: "",
      cloneProfile: "",
      errors: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.onCreateProfile = this.onCreateProfile.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  /**
   * On Create Profile
   */
  onCreateProfile() {
    const {
      profileName,
      profileDescription,
      exchange,
      cloneProfile
    } = this.state;
    const { errors, isValid } = validateCreateProfile(this.state);
    this.setState({ errors: errors });

    if (isValid) {
      this.props.createProfile({
        profileName,
        profileDescription,
        exchange,
        cloneProfile
      });
    }
  }

  render() {
    const {
      profileName,
      profileDescription,
      exchange,
      cloneProfile,
      errors
    } = this.state;
    return (
      <div>
        <Form>
          <Row>
            <Col md={12}>
              <FormGroup className="row">
                <Label for="profileName" className="col-md-2">
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
                <Label for="profileDescription" className="col-md-2">
                  {<IntlMessages id="profile.profiledescription" />}
                </Label>
                <Input
                  type="textarea"
                  name="profileDescription"
                  value={profileDescription}
                  className="col-md-5"
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
                <Label for="exchange" className="col-md-2">
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
                <Label for="cloneProfile" className="col-md-2">
                  {<IntlMessages id="profile.cloneProfile" />}
                </Label>
                <Input
                  type="select"
                  name="cloneProfile"
                  value={cloneProfile}
                  className="col-md-5"
                  id="cloneProfile"
                  onChange={this.handleChange}
                >
                  <option value="">Please Select</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Partner">Partner</option>
                </Input>
                {errors.cloneProfile && (
                  <span className="text-danger text-left">
                    <IntlMessages id={errors.cloneProfile} />
                  </span>
                )}
              </FormGroup>

              <FormGroup className="has-wrapper" row>
                <div className="col-md-2" />
                <div className="col-md-1 p-0 mr-10">
                  <MatButton
                    variant="raised"
                    className="btn-primary text-white mb-10"
                    onClick={this.onCreateProfile}
                  >
                    {<IntlMessages id="profile.create" />}
                  </MatButton>
                </div>
                <div className="col-md-1 p-0 mr-10">
                  <MatButton
                    component={Link}
                    to="/app/my-account/profiles"
                    variant="raised"
                    className="btn-secondary text-white mb-10"
                  >
                    {<IntlMessages id="profile.cancel" />}
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
const mapStateToProps = ({ profiles }) => {
  var response = {
    userList: profiles.profilesdata,
    loading: profiles.loading
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    createProfile
  }
)(CreateProfileWdgt);
