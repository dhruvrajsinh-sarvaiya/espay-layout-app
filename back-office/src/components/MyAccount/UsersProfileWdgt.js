/**
 * CreatedBy : Kevin Ladani
 * Date :29/09/2018
 */
/**
 * Display Users Profile
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
// redux action
import { displayUsersProfile } from "Actions/MyAccount";
// intl messages
import IntlMessages from "Util/IntlMessages";

class UsersProfileWdgt extends Component {
  constructor(props) {
    super();
    this.state = {
      errors: "",
      selectedUser: null // selected user to perform operations
    };
  }

  componentWillMount() {
    this.props.displayUsersProfile();
  }

  render() {
    const data = this.props.userList;
    const columns = [
      {
        name: "Id",
        options: {
          filter: false,
          sort: true
        }
      },
      "Name",
      "Email",
      "Role",
      "Status"
    ];

    const options = {
      filterType: "multiselect",
      responsive: "scroll",
      selectableRows: false
    };
    return (
      <div className="report-status mb-30 p-0 StackingHistory">
        <MUIDataTable
          title={<IntlMessages id="sidebar.profiles" />}
          data={data.map((item, key) => {
            return [item.id, item.name, item.email, item.role, item.status];
          })}
          columns={columns}
          options={options}
        />
      </div>
    );
  }
}
// map state to props
const mapStateToProps = ({ profiles }) => {
  var response = {
    userList: profiles.userprofilesdata,
    loading: profiles.loading
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    displayUsersProfile
  }
)(UsersProfileWdgt);
