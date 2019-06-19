/**
 * CreatedBy : Kevin Ladani
 * Date :
 */
/**
 * Display Customers
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { Badge } from "reactstrap";
import MatButton from "@material-ui/core/Button";

// redux action
import { displayCustomers, deleteCustomers } from "Actions/MyAccount";
// intl messages
import IntlMessages from "Util/IntlMessages";

// delete confirmation dialog
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";

//Columns Object
const columns = [
  {
    name: <IntlMessages id="myaccount.customerColumn.id" />,
    options: {
      filter: false,
      sort: true
    }
  },
  {
    name: <IntlMessages id="myaccount.customerColumn.firstname" />,
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: <IntlMessages id="myaccount.customerColumn.lastname" />,
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: <IntlMessages id="myaccount.customerColumn.email" />,
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: <IntlMessages id="myaccount.customerColumn.tfa" />,
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: <IntlMessages id="myaccount.customerColumn.documents" />,
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: <IntlMessages id="myaccount.customerColumn.status" />,
    options: {
      filter: false,
      sort: false
    }
  },
  {
    name: <IntlMessages id="myaccount.customerColumn.exchange" />,
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
        to="/app/my-account/add-customer"
        variant="raised"
        className="btn-primary text-white"
      >
        <IntlMessages id="my_account.customer.addNewCustomer" />
      </MatButton>
    );
  }
};

class CustomersWdgt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: "",
      selectedUser: null // selected user to perform operations
    };
  }

  componentWillMount() {
    this.props.displayCustomers();
  }

  ondeleteCustomerDialog(data) {
    this.refs.deleteConfirmationDialog.open();
    this.setState({ selectedUser: data });
  }

  ondeleteCustomer() {
    this.refs.deleteConfirmationDialog.close();
  }

  render() {
    const data = this.props.userList;

    return (
      <div className="StackingHistory">
        <MUIDataTable 
          title={"Customers List"}
          columns={columns}
          data={data.map((item, key) => {
            return [
              item.id,
              item.firstname,
              item.lastname,
              item.email,
              item.tfa,
              item.documents,
              item.exchange,
              <Badge className="mb-10 mr-10" color="primary">
                {item.status}
              </Badge>,
              <Fragment>
                <div className="list-action">
                  <Link
                    to={{
                      pathname: "/app/my-account/edit-customer",
                      state: { item }
                    }}
                  >
                    <i className="ti-pencil" />
                  </Link>
                  <a
                    href="javascript:void(0);"
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
          onConfirm={() => this.ondeleteCustomer()}
        />
      </div>
    );
  }
}
// map state to props
const mapStateToProps = ({ costomers }) => {
  var response = {
    userList: costomers.displayCustomersData,
    loading: costomers.Loading
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    displayCustomers,
    deleteCustomers
  }
)(CustomersWdgt);
