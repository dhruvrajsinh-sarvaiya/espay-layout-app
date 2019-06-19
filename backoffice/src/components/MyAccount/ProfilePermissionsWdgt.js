/**
 * Form Elemets
 */
/**
 * Add New Profile
 */
import React, { Component } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Form, FormGroup, Label } from "reactstrap";
import { connect } from "react-redux";
import MatButton from "@material-ui/core/Button";

// redux action
import { updateProfilePermissions } from "Actions/MyAccount";

//intl messages
import IntlMessages from "Util/IntlMessages";

class ProfilePermissionsWdgt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dashView: false,
      dsahPlaceOrder: false,
      adminView: false,
      adminCreate: false,
      adminEdit: false,
      adminDelete: false,
      roleView: false,
      roleCreate: false,
      roleEdit: false,
      roleDelete: false
    };
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.onUpdateProfilePermission = this.onUpdateProfilePermission.bind(this);
  }

  handleCheckChange = name => (event, checked) => {
    this.setState({ [name]: event.target.checked });
  };

  /**
   * On Create Profile
   */
  onUpdateProfilePermission() {
    this.props.updateProfilePermissions(this.state);
  }

  render() {
    return (
      <div className="mt-20">
        <Form>
          <FormGroup className="has-wrapper" row>
            <Label for="profileName" className="p-0 mt-15 text-left col-md-2">
              {<IntlMessages id="profile.exchangeDashboard" />}
            </Label>

            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={this.state.dashView}
                  onChange={this.handleCheckChange("dashView")}
                  value="DashView"
                />
              }
              label="View"
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={this.state.dsahPlaceOrder}
                  onChange={this.handleCheckChange("dsahPlaceOrder")}
                  value="DsahPlaceOrder"
                />
              }
              label="Place Order"
            />
          </FormGroup>

          <FormGroup className="has-wrapper row ">
            <Label for="profileName" className="p-0 mt-15 text-left col-md-12">
              {<IntlMessages id="profile.adminAccessManagementPermissions" />}
            </Label>
          </FormGroup>

          <FormGroup className="has-wrapper" row>
            <Label for="profileName" className="p-0 mt-15 text-left col-md-2">
              {<IntlMessages id="profile.adminProfiles" />}
            </Label>

            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={this.state.adminView}
                  onChange={this.handleCheckChange("adminView")}
                  value="ProfileView"
                />
              }
              label={<IntlMessages id="profile.view" />}
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={this.state.adminCreate}
                  onChange={this.handleCheckChange("adminCreate")}
                  value="ProfileCreate"
                />
              }
              label={<IntlMessages id="profile.create" />}
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={this.state.adminEdit}
                  onChange={this.handleCheckChange("adminEdit")}
                  value="ProfileEdit"
                />
              }
              label={<IntlMessages id="profile.edit" />}
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={this.state.adminDelete}
                  onChange={this.handleCheckChange("adminDelete")}
                  value="ProfileDelete"
                />
              }
              label={<IntlMessages id="profile.delete" />}
            />
          </FormGroup>

          <FormGroup className="has-wrapper" row>
            <Label for="profileName" className="p-0 mt-15 text-left col-md-2">
              {<IntlMessages id="profile.adminRole" />}
            </Label>

            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={this.state.roleView}
                  onChange={this.handleCheckChange("roleView")}
                  value="RoleView"
                />
              }
              label="View"
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={this.state.roleCreate}
                  onChange={this.handleCheckChange("roleCreate")}
                  value="RoleCreate"
                />
              }
              label="Create"
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={this.state.roleEdit}
                  onChange={this.handleCheckChange("roleEdit")}
                  value="RoleEdit"
                />
              }
              label="Edit"
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={this.state.roleDelete}
                  onChange={this.handleCheckChange("roleDelete")}
                  value="RoleDelete"
                />
              }
              label="Delete"
            />
          </FormGroup>

          <FormGroup className="has-wrapper" row>
            <div className="col-md-2" />
            <div className="col-md-1 p-0">
              <MatButton
                variant="raised"
                className="btn-primary text-white"
                onClick={this.onUpdateProfilePermission}
              >
                {<IntlMessages id="profile.updateProfile" />}
              </MatButton>
            </div>
            <div className="col-md-2" />
            <div className="col-md-2" />
          </FormGroup>
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
    updateProfilePermissions
  }
)(ProfilePermissionsWdgt);
