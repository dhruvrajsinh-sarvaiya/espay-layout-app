/**
 * CreatedBy : Kevin Ladani
 * Date :28/09/2018
 */
/**
 * Display Profiles
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import { Link } from "react-router-dom";

// intl messages
import IntlMessages from "Util/IntlMessages";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

import { FormGroup, Input, Label } from "reactstrap";
import Button from "@material-ui/core/Button";
import MatButton from "@material-ui/core/Button";

// redux action
import { displayProfiles, deleteProfile } from "Actions/MyAccount";

class ProfilesWdgt extends Component {
  constructor(props) {
    super();
    this.state = {
      errors: "",
      selectedUser: null, // selected user to perform operations
      open: false,
      userrole: "Administrator",
      id: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.props.displayProfiles();
  }

  handleClickOpen = item => {
    this.setState({ open: true, id: item.id, userrole: item.profilename });
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

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const { userrole } = this.state;

    const data = this.props.userList;

    const columns = [
      {
        name: "Id",
        options: {
          filter: false,
          sort: true
        }
      },
      "Profile Name",
      "Description",
      "Exchange",
      "Action"
    ];

    const options = {
      filterType: "multiselect",
      responsive: "scroll",
      selectableRows: false,
      customToolbar: () => {
        return (
          <MatButton
            component={Link}
            to="/app/my-account/create-profile"
            variant="raised"
            className="btn-primary text-white"
          >
            <IntlMessages id="profiles.createNewProfile" />
          </MatButton>
        );
      }
    };
    return (
      <div className="StackingHistory">
        <MUIDataTable
          title={<IntlMessages id="sidebar.profiles" />}
          data={data.map((item, key) => {
            return [
              item.id,
              item.profilename,
              item.description,
              item.exchange,

              <Fragment>
                <div className="list-action">
                  <Link
                    className="mr-10"
                    to={{
                      pathname: "/app/my-account/edit-profile",
                      state: { item }
                    }}
                  >
                    <i className="ti-pencil" />
                  </Link>
                  <a
                    href="javascript:void(0)"
                    className="mr-10"
                    onClick={() => this.handleClickOpen(item)}
                  >
                    <i className="ti-close" />
                  </a>
                </div>
              </Fragment>
            ];
          })}
          columns={columns}
          options={options}
        />
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
                    onChange={this.handleChange}
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

export default connect(
  mapStateToProps,
  {
    displayProfiles,
    deleteProfile
  }
)(ProfilesWdgt);
