import React, { Component } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
// intl messages
import IntlMessages from "Util/IntlMessages";

import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { FormGroup, Input, Label } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import MatButton from "@material-ui/core/Button";

import {
  ProfileInfoWdgt,
  UsersProfileWdgt,
  ProfilePermissionsWdgt
} from "Components/MyAccount";

// redux action
import { deleteProfile } from "Actions/MyAccount/ProfilesAction";

function TabContainer({ children }) {
  return (
    <Typography component="div" style={{ padding: 8 * 2 }}>
      {children}
    </Typography>
  );
}

class EditProfileWdgt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      open: false,
      userrole: "",
      id: ""
    };
    this.handleChangeDialog = this.handleChangeDialog.bind(this);
  }

  componentWillMount() {
    let prevObj = this.props.location.state;
    if (prevObj.id !== "") {
      this.setState({
        id: prevObj.item.id,
        userrole: prevObj.item.profilename
      });
    } else {
      this.props.history.push("/app/my-account/profiles");
    }
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  ondeleteProfile = () => {
    var id = this.state.id;
    var usersrole = this.state.userrole;
    this.props.deleteProfile({
      id,
      usersrole
    });
    this.setState({ open: false });
  };

  Counterevent() {
    this.setState({ view1: false });
  }

  handleChangeIndex(index) {
    this.setState({ activeIndex: index });
  }

  handleChange(event, value) {
    this.setState({ activeIndex: value });
  }

  handleChangeDialog(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const { activeIndex, userrole } = this.state;
    return (
      <div className="my-account-wrapper">
        <JbsCollapsibleCard>
          <div className="row">
            <div className="col-md-12">
              <Tabs
                value={this.state.activeIndex}
                onChange={(e, value) => this.handleChange(e, value)}
              >
                <Tab
                  className="btn-primary text-white col-md-2"
                  label="Profile Info"
                />
                <Tab
                  className="btn-primary text-white  col-md-2"
                  label="Profile Premissions"
                />
                <Tab
                  className="btn-primary text-white  col-md-2"
                  label="Profile Users"
                />
                <div className="col-md-2" />

                <div className="col-md-2">
                  <MatButton
                    component={Link}
                    to="/app/my-account/profiles"
                    variant="raised"
                    className="btn-secondary text-white"
                  >
                    {<IntlMessages id="profile.backprofile" />}
                  </MatButton>
                </div>
                <div className="col-md-2">
                  <MatButton
                    variant="raised"
                    className="btn-danger text-white"
                    onClick={() => this.handleClickOpen()}
                  >
                    {<IntlMessages id="profile.deleteProfile" />}
                  </MatButton>
                </div>
              </Tabs>

              {activeIndex === 0 && (
                <TabContainer>
                  <ProfileInfoWdgt />
                </TabContainer>
              )}
              {activeIndex === 1 && (
                <TabContainer>
                  <ProfilePermissionsWdgt />
                </TabContainer>
              )}
              {activeIndex === 2 && (
                <TabContainer>
                  <UsersProfileWdgt />
                </TabContainer>
              )}
            </div>
          </div>
          {/* <DeleteProfileDialogWdgt /> */}
        </JbsCollapsibleCard>
        <div>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogContent>
              <DialogContentText>
                There are other users associated with this profile. Please
                transfer the users to another profile and then delete it.
              </DialogContentText>
              <FormGroup className="has-wrapper pt-20" row>
                <Label for="userrole" className="control-label pt-10 col-sm-4">
                  {<IntlMessages id="profile.transferUsersTo" />}
                </Label>
                <div className="col-md-8">
                  <Input
                    type="select"
                    name="userrole"
                    value={userrole}
                    id="userrole"
                    onChange={this.handleChangeDialog}
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Partner">Partner</option>
                  </Input>
                </div>
              </FormGroup>
            </DialogContent>
            <DialogActions>
              <Button
                variant="raised"
                onClick={this.ondeleteProfile}
                className="btn-danger text-white"
              >
                Transfer & Delete
              </Button>
              <Button
                variant="raised"
                onClick={this.handleClose}
                color="primary"
                className="text-white"
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
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
      deleteProfile
    }
  )(EditProfileWdgt)
);
