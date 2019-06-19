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
import MatButton from "@material-ui/core/Button";
// redux action
import { displayPatternsAssignments, deletePatternsAssignments } from "Actions/MyAccount";

// intl messages
import IntlMessages from "Util/IntlMessages";

// delete confirmation dialog
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";

//Columns Object
const columns = [
  {
    name: <IntlMessages id="myaccount.patternsColumn.id" />,
    options: {
        filter: false,
        sort: true,
    }
},
  {
    name: <IntlMessages id="myaccount.patternsColumn.exchange" />,
      options: {
          filter: true,
          sort: true,
      }
  },
  {
    name: <IntlMessages id="myaccount.patternsColumn.memberShip" />,
      options: {
          filter: true,
          sort: true,
      }
  },
  {
    name: <IntlMessages id="myaccount.patternsColumn.feesLimit" />,
      options: {
          filter: true,
          sort: true,
      }
  },
  {
    name: <IntlMessages id="myaccount.patternsColumn.referalPattern" />,
      options: {
          filter: true,
          sort: false,
      }
  },
  {
    name: <IntlMessages id="myaccount.patternsColumn.remark" />,
    options: {
        filter: true,
        sort: false,
    }
},
{
  name: <IntlMessages id="myaccount.patternsColumn.action" />,
  options: {
      filter: false,
      sort: false,
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
        to="/app/my-account/add-patterns-assignments"
        variant="raised"
          className="btn-primary text-white"
      >
            <IntlMessages id="my_account.patternAssignments.addpatternsAssignments" />
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
    this.props.displayPatternsAssignments();
  }

  ondeletePatternsAssignmentsDialog(data) {
      this.refs.deleteConfirmationDialog.open();
      this.setState({ selectedUser: data });
}

  ondeletePatternsAssignments() {
    const { selectedUser } = this.state;
    this.props.deletePatternsAssignments({ selectedUser });
    this.refs.deleteConfirmationDialog.close();

  }

  render() {
    const data = this.props.userList;

    return (
      <div className="StackingHistory">
        <MUIDataTable
          title={<IntlMessages id="my_account.patternAssignments.patternList" />}
          columns={columns}
          data={data.map((item, key) => {
            return [
              item.id,
              item.exchange,
              item.membership,
              item.feeslimits,
              item.referalpattern,              
              item.remark,

              <Fragment>
                <div className="list-action">
                    <Link className="mr-10"  to={{pathname: "/app/my-account/edit-patterns-assignments",state: { item } }}><i className="ti-pencil"></i></Link>
                    <a href="javascript:void(0)" className="mr-10" onClick={() => this.ondeletePatternsAssignmentsDialog(item)}><i className="ti-close"></i></a>
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
          onConfirm={() => this.ondeletePatternsAssignments()}
        />
      </div>
    );
  }
}
// map state to props
const mapStateToProps = ({ patternsAssignment }) => {
  var response = {
    userList: patternsAssignment.displayCustomersData,
    loading: patternsAssignment.Loading
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    displayPatternsAssignments,
    deletePatternsAssignments
  }
)(CustomersWdgt);
