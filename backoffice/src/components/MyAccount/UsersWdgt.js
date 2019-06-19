/**
 * CreatedBy : Kevin Ladani
 * Date :
 */
/**
 * Display Users
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { Badge } from "reactstrap";
// redux action
import { displayUsers, deleteUsers } from "Actions/MyAccount";
import MatButton from "@material-ui/core/Button";

// intl messages
import IntlMessages from "Util/IntlMessages";

// delete confirmation dialog
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";

//Columns Object
const columns = [
  {
    name: <IntlMessages id="myaccount.userColumn.id" />,
    options: {
      filter: false,
      sort: true
    }
  },
  {
    name: <IntlMessages id="myaccount.userColumn.fullName" />,
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: <IntlMessages id="myaccount.userColumn.email" />,
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: <IntlMessages id="myaccount.userColumn.profile" />,
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: <IntlMessages id="myaccount.userColumn.role" />,
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: <IntlMessages id="myaccount.userColumn.exchange" />,
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: <IntlMessages id="myaccount.userColumn.status" />,
    options: {
      filter: false,
      sort: false
    }
  },
  {
    name: <IntlMessages id="myaccount.customerColumn.action" />,
    options: {
      filter: false,
      sort: false
    }
  }
];

const options = {
  filterType: "select",
  responsive: "scroll",
  selectableRows: false,
  customToolbar: () => {
    return (
      <MatButton
        component={Link}
        to="/app/my-account/add-users"
        variant="raised"
        className="btn-primary text-white"
      >
        <IntlMessages id="my_account.user.addNewUser" />
      </MatButton>
    );
  }
};

class UsersWdgt extends Component {
  constructor(props) {
    super();
    this.state = {
      errors: "",
      selectedUser: null // selected user to perform operations
    };
    this.ondeleteCustomerDialog = this.ondeleteCustomerDialog.bind(this);
    this.ondeleteUser = this.ondeleteUser.bind(this);
  }
  componentWillMount() {
    this.props.displayUsers();
  }

  ondeleteCustomerDialog(data) {
    this.refs.deleteConfirmationDialog.open();
    this.setState({ selectedUser: data });
  }

  ondeleteUser() {
    const { selectedUser } = this.state;
    this.props.deleteUsers({ selectedUser });
    this.refs.deleteConfirmationDialog.close();
  }

  render() {
    const data = this.props.userList;

    return (
      <div className="StackingHistory">
        <MUIDataTable
          title={<IntlMessages id="my_account.user.userList" />}
          columns={columns}
          data={data.map((item, key) => {
            return [
              item.id,
              item.firstname + " " + item.lastname,
              item.email,
              item.exchange,
              item.profile,
              item.role,
              <Badge className="mb-10 mr-10" color="primary">
                {item.status}
              </Badge>,
              <Fragment>
                <div className="list-action">
                  <Link
                    className="mr-10"
                    to={{
                      pathname: "/app/my-account/edit-users",
                      state: { item }
                    }}
                  >
                    <i className="ti-pencil" />
                  </Link>
                  <a
                    href="javascript:void(0)"
                    className="mr-10"
                    onClick={() => this.ondeleteCustomerDialog(item)}
                  >
                    <i className="ti-close" />
                  </a>
                </div>
              </Fragment>
            ];
          })}
          options={options}
        />
        <DeleteConfirmationDialog
          ref="deleteConfirmationDialog"
          title="Are You Sure Want To Delete?"
          message="This will delete user permanently."
          onConfirm={() => this.ondeleteUser()}
        />
      </div>
    );
  }
}
// map state to props
const mapStateToProps = ({ displayUsers }) => {
  var response = {
    userList: displayUsers.displayUsersData,
    loading: displayUsers.loading
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    displayUsers,
    deleteUsers
  }
)(UsersWdgt);
