/**
 * Device Management Page (code added by Parth Jani 19-9-2018)
 */
import React, { Component } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { NotificationManager } from "react-notifications";

import api from "Api";

// delete confirmation dialog
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// jbs section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

//import IconButton from '@material-ui/core/IconButton';
import { Collapse } from "reactstrap";

export default class DeviceManagementWdgt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false
    };
  }
  //On collapse project description
  OnCollapseProject() {
    this.setState({
      collapse: !this.state.collapse
    });
  }

  state = {
    all: false,
    users: null, // initial user data
    selectedUser: null, // selected user to perform operations
    loading: false, // loading activity
    addNewUserModal: false, // add new user form modal
    openViewUserDialog: false // view user dialog box
  };

  componentDidMount() {
    api
      .get("deviceManagementData.js")
      .then(response => {
        this.setState({ users: response.data });
      })
      .catch(error => {
        this.setState({ users: null });
      });
  }

  /**
   * On Delete
   */
  onDelete(data) {
    this.refs.deleteConfirmationDialog.open();
    this.setState({ selectedUser: data });
  }

  /**
   * Delete User Permanently
   */
  deleteUserPermanently() {
    const { selectedUser } = this.state;
    let users = this.state.users;
    let indexOfDeleteUser = users.indexOf(selectedUser);
    users.splice(indexOfDeleteUser, 1);
    this.refs.deleteConfirmationDialog.close();
    this.setState({ loading: true });
    let self = this;
    setTimeout(() => {
      self.setState({ loading: false, users, selectedUser: null });
      NotificationManager.success("Device Removed Successfully!");
    }, 2000);
  }

  /**
   * On Reload
   */
  onReload() {
    this.setState({ loading: true });
    let self = this;
    setTimeout(() => {
      self.setState({ loading: false });
    }, 2000);
  }

  /**
   * On Select User
   */
  onSelectUser(user) {
    user.checked = !user.checked;
    let selectedUsers = 0;
    let users = this.state.users.map(userData => {
      if (userData.checked) {
        selectedUsers++;
      }
      if (userData.id === user.id) {
        if (userData.checked) {
          selectedUsers++;
        }
        return user;
      } else {
        return userData;
      }
    });
    this.setState({ users, selectedUsers });
  }

  /**
   * View User Detail Hanlder
   */
  viewUserDetail(data) {
    this.setState({ openViewUserDialog: true, selectedUser: data });
  }

  //Select All user
  onSelectAllUser(e) {
    const { selectedUsers, users } = this.state;
    let selectAll = selectedUsers < users.length;
    if (selectAll) {
      let selectAllUsers = users.map(user => {
        user.checked = true;
        return user;
      });
      this.setState({
        users: selectAllUsers,
        selectedUsers: selectAllUsers.length
      });
    } else {
      let unselectedUsers = users.map(user => {
        user.checked = false;
        return user;
      });
      this.setState({ selectedUsers: 0, users: unselectedUsers });
    }
  }

  render() {
    const { loading, selectedUsers, collapse } = this.state;
    const tempObj = this.props.data.data;
    let users = tempObj;
    const columns = ["Demo", "Locations", "Recent Activity", "IP Address", ""];
    return (
      <div className="user-management">
        <p className="text-right">
          These devices are currently allowed to access your account.
        </p>
        <JbsCollapsibleCard fullBlock>
          <div className="table-responsive">
            <table className="table table-middle table-hover mb-0">
              <thead>
                <tr>
                  <th className="w-5">
                    <FormControlLabel
                      control={
                        <Checkbox
                          indeterminate={
                            selectedUsers > 0 && selectedUsers < users.length
                          }
                          checked={selectedUsers > 0}
                          onChange={e => this.onSelectAllUser(e)}
                          value="all"
                          color="primary"
                        />
                      }
                      label="All"
                    />
                  </th>
                  <th>Device</th>
                  <th>Location</th>
                  <th>Recent activity</th>
                  <th>IP Address</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users.map((user, key) => (
                    <tr key={key}>
                      <td>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={user.checked}
                              onChange={() => this.onSelectUser(user)}
                              color="primary"
                            />
                          }
                        />
                      </td>
                      <td>{user.device}</td>
                      <td>{user.locations}</td>
                      <td>{user.recentActivity}</td>
                      <td>{user.iPAddress}</td>
                      <td className="list-action">
                        <a
                          href="javascript:void(0)"
                          onClick={() => this.viewUserDetail(user)}
                        >
                          <i className="ti-eye" />
                        </a>
                        <a
                          href="javascript:void(0)"
                          onClick={() => this.onDelete(user)}
                        >
                          <i className="ti-close" />
                        </a>
                        <a
                          href="javascript:void(0)"
                          onClick={() => this.OnCollapseProject()}
                        >
                          <i className="ti-arrow-down" />
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
              {collapse && (
                <tr>
                  <td colSpan="4">
                    <Collapse isOpen={collapse}>
                      <div className="p-10">
                        <p>Expansion demo</p>
                      </div>
                    </Collapse>
                  </td>
                </tr>
              )}            
            </table>
          </div>
          {loading && <JbsSectionLoader />}
        </JbsCollapsibleCard>
        <DeleteConfirmationDialog
          ref="deleteConfirmationDialog"
          title="Are you sure want to delete the selected trusted device?"
          message="This will delete device permanently."
          onConfirm={() => this.deleteUserPermanently()}
        />
        <Dialog
          onClose={() => this.setState({ openViewUserDialog: false })}
          open={this.state.openViewUserDialog}
        >
          <DialogContent>
            {users &&
              users.map(
                (user, key) =>
                  user !== null && (
                    <div key={key}>
                      <div className="clearfix d-flex">
                        <div className="media pull-left">
                          <div className="media-body">
                            <p>
                              Device:{" "}
                              <span className="fw-bold">{user.device}</span>
                            </p>
                            <p>
                              Locations:{" "}
                              <span className="fw-bold">{user.locations}</span>
                            </p>
                            <p>
                              Recent Activity:{" "}
                              <span className="badge badge-warning">
                                {user.recentActivity}
                              </span>
                            </p>
                            <p>
                              IP Address:{" "}
                              <span
                                className={`badge ${
                                  user.badgeClass
                                } badge-pill`}
                              >
                                {user.iPAddress}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
              )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
