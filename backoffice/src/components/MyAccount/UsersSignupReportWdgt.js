/**
 * CreatedBy : Kevin Ladani
 * Date :27/09/2018
 */
/**
 * Display Users Signup Reports
 */
import React, { Component } from "react";
import { connect } from "react-redux";

import MUIDataTable from "mui-datatables";
// redux action
import { displayUsersSignupReport } from "Actions/MyAccount";
import { Form,FormGroup, Label, Input, Button, Badge } from 'reactstrap';
// intl messages
import IntlMessages from "Util/IntlMessages";
import MatButton from "@material-ui/core/Button";

//Table Columns
const columns = [
  {
    name: <IntlMessages id="sidebar.colHash" />,
    options: {
      filter: false,
      sort: true
    }
  },
  {
    name: <IntlMessages id="sidebar.colUserName" />,
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: <IntlMessages id="sidebar.colEmail" />,
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: <IntlMessages id="sidebar.colMobile" />,
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: <IntlMessages id="sidebar.colFirstName" />,
    options: {
      filter: false,
      sort: true
    }
  },
  {
    name: <IntlMessages id="sidebar.colLastName" />,
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: <IntlMessages id="sidebar.colType" />,
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: <IntlMessages id="sidebar.colCreatedDt" />,
    options: {
      filter: false,
      sort: true
    }
  },
  {
    name: <IntlMessages id="sidebar.colStatus" />,
    options: {
      filter: false,
      sort: false
    }
  }
];

//Table Options
const options = {
  filterType: "dropdown",
  responsive: "scroll",
  selectableRows: false
};

const ActiveInactiveStatus = ({ status }) => {
  let htmlStatus = "";
  if (!status) {
    htmlStatus = <Badge color="danger"><IntlMessages id="sidebar.inactive" /></Badge>;
  } else if (status) {
    htmlStatus = <Badge color="success"><IntlMessages id="sidebar.active" /></Badge>;
  }
  return htmlStatus;
};



class UsersSignupReportWdgt extends Component {
  constructor(props) {
    super();
    this.state = {
      Getdata: {
        PageIndex: 0,
        Page_Size: 100,
        EmailAddress: "",
        Username: "",
        Mobile: "",
      },
      data: [],
      loading: false,
      errors: "",
      selectedUser: null // selected user to perform operations
    };
    this.onChange = this.onChange.bind(this);
    // this.getFilterData = this.getFilterData.bind(this);
  }

  onChange = (event) => {
    var newObj = Object.assign({}, this.state.Getdata);
    newObj[event.target.name] = event.target.value;
    this.setState({ Getdata: newObj });
  }


  componentWillMount() {
    this.props.displayUsersSignupReport();
  }

  render() {
    const data = this.props.userList;
    const { Username, EmailAddress, Mobile } = this.state.Getdata;
    return (
      <div className="jbs-page-content">
        <div className="col-md-12">
          <div className="card">
            <div className="top-filter clearfix px-20 py-20">
              <Form className="tradefrm">
                <FormGroup className="col-md-2 mr-0">
                  <Label for="EmailAddress"><IntlMessages id="my_account.emailAddress" /></Label>
                  <Input type="text" name="EmailAddress" id="EmailAddress" placeholder="Enter Email Address" value={EmailAddress} onChange={(e) => this.onChange(e)} />
                </FormGroup>
                <FormGroup className="col-md-2 mr-0">
                  <Label for="Username"><IntlMessages id="my_account.userName" /></Label>
                  <Input type="text" name="Username" id="Username" placeholder="Enter Username" value={Username} onChange={(e) => this.onChange(e)} />
                </FormGroup>
                <FormGroup className="col-md-2 mr-0">
                  <Label for="Mobile"><IntlMessages id="my_account.mobileNo" /></Label>
                  <Input type="text" name="Mobile" id="Mobile" placeholder="Enter Mobile No" value={Mobile} onChange={(e) => this.onChange(e)} />
                </FormGroup>
                <FormGroup className="col-md-2 mr-0">
                  <Label className="d-block">&nbsp;</Label>
                  <Button color="primary" className="border-0 rounded-0" onClick={this.getFilterData}><IntlMessages id="widgets.apply" /></Button>
                </FormGroup>
              </Form>
            </div>
          </div>

          <div className="StackingHistory mt-20">
            <MUIDataTable
              title={<IntlMessages id="sidebar.usersSignupReportList" />}
              columns={columns}
              data={data.map((list, index) => {
                return [
                  index + 1,
                  // list.Id,
                  list.UserName,
                  list.Email,
                  list.Mobile,
                  list.Firstname,
                  list.Lastname,
                  list.RegType,
                  list.CreatedDate,
                  // list.RegisterStatus,
                  <ActiveInactiveStatus status={list.RegisterStatus} />,
                ];
              })}
              options={options}
            />
          </div>
        </div>
      </div>
    );
  }
}
// map state to props
const mapStateToProps = ({ usersSignupReport }) => {
  var response = {
    userList: usersSignupReport.displayUsersDataReport,
    loading: usersSignupReport.loading
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    displayUsersSignupReport
  }
)(UsersSignupReportWdgt);
