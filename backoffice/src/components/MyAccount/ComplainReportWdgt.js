/**
 * CreatedBy : Salim Deraiya
 * Date :08/10/2018
 * Complain Reports
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form,FormGroup, Label, Input, Button } from 'reactstrap';
import { Link } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { Badge } from "reactstrap";
import CircularProgress from '@material-ui/core/CircularProgress';
// redux action
import { complainList } from "Actions/MyAccount";
import { changeDateFormat } from "Helpers/helpers";
// intl messages
import IntlMessages from "Util/IntlMessages";

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
    name: <IntlMessages id="sidebar.colCustomerName" />,
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: <IntlMessages id="sidebar.colComplainID" />,
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
    name: <IntlMessages id="sidebar.colSubject" />,
    options: {
      filter: false,
      sort: true
    }
  },
  {
    name: <IntlMessages id="sidebar.colStatus" />,
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: <IntlMessages id="sidebar.colDescription" />,
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
    name: <IntlMessages id="sidebar.colAction" />,
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

const ComplainStatus = ({ status_id }) => {
  let htmlStatus = "";
  if (status_id === "Open") {
    htmlStatus = (
      <Badge color="success">
        <IntlMessages id="sidebar.open" />
      </Badge>
    );
  } else {
    htmlStatus = (
      <Badge color="danger">
        <IntlMessages id="sidebar.closed" />
      </Badge>
    );
  }
  return htmlStatus;
};

class ComplainReportWdgt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ComplainNumber: "",
      Subject: "",
      Getdata: {
        PageIndex: 0,
        Page_Size: 100,
        ComplainId: 0,
        EmailId: '',
        MobileNo: '',
        Status: 0,
        TypeId: 0,
      },
      data: [],
      ListComplain: false,
    }
    this.onChange = this.onChange.bind(this);
    this.getFilterData = this.getFilterData.bind(this);
  }

  componentWillMount() {
    this.props.complainList(this.state.Getdata);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ loading: nextProps.loading });
    if (Object.keys(nextProps.list).length > 0 && Object.keys(nextProps.list.GetTotalCompList).length > 0) {
      this.setState({ data: nextProps.list.GetTotalCompList });
    }
  }

  onChange = (event) => {
    var newObj = Object.assign({}, this.state.Getdata);
    newObj[event.target.name] = event.target.value;
    this.setState({ Getdata: newObj });
  }

  getFilterData() {
    this.props.complainList(this.state.Getdata);
  }

  render() {
    const { data, loading } = this.state;
    const { ComplainId, EmailId, MobileNo, Status, TypeId } = this.state.Getdata;
    return (
      <Fragment>
        {
          loading
            ?
            <div className="text-center py-40"><CircularProgress className="progress-primary" thickness={2} /></div>
            :
            <div className="col-md-12">
              <div className="card">
                <div className="top-filter clearfix px-20 py-20">
                <Form className="tradefrm">
                  <FormGroup className="col-md-2 mr-0">
                    <Label for="ComplainId"><IntlMessages id="my_account.complainId" /></Label>
                    <Input type="text" name="ComplainId" id="ComplainId" placeholder="Enter Complain Id" value={ComplainId} onChange={(e) => this.onChange(e)} />
                  </FormGroup>
                  <FormGroup className="col-md-2 mr-0">
                    <Label for="EmailId"><IntlMessages id="my_account.emailId" /></Label>
                    <Input type="text" name="EmailId" id="EmailId" placeholder="Enter Email Address" value={EmailId} onChange={(e) => this.onChange(e)} />
                  </FormGroup>
                  <FormGroup className="col-md-2 mr-0">
                    <Label for="MobileNo"><IntlMessages id="my_account.mobileNo" /></Label>
                    <Input type="text" name="MobileNo" id="MobileNo" placeholder="Enter Mobile No" value={MobileNo} onChange={(e) => this.onChange(e)} />
                  </FormGroup>
                  <FormGroup className="col-md-2 mr-0">
                    <Label for="Status"><IntlMessages id="my_account.status" /></Label>
                    <Input type="text" name="Status" id="Status" placeholder="Enter Status" value={Status} onChange={(e) => this.onChange(e)} />
                  </FormGroup>
                  <FormGroup className="col-md-2 mr-0">
                    <Label for="TypeId"><IntlMessages id="my_account.typeId" /></Label>
                    <Input type="text" name="TypeId" id="TypeId" placeholder="Enter TypeId" value={TypeId} onChange={(e) => this.onChange(e)} />
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
                  title={<IntlMessages id="sidebar.complainReports" />}
                  columns={columns}
                  data={data.map((list, index) => {
                    return [
                      index + 1,
                      // list.UserId,
                      list.UserName,
                      list.ComplainId,
                      list.Type,
                      list.Subject,
                      <ComplainStatus status_id={list.Status} />,
                      list.Description,
                      <span className="date">{changeDateFormat(list.CreatedDate, 'YYYY-MM-DD HH:mm:ss')}</span>,
                      <div className="list-action">
                        {/* <Link className="mr-5" to={{ pathname: "/app/my-account/edit-complain", state: { id: list.ComplainId } }}>
                          <i className="ti-pencil" />
                        </Link> */}
                        <Link className="mr-5" to={{ pathname: "/app/my-account/view-complain", state: { id: list.ComplainId, status: list.Status } }}>
                          <i className="zmdi zmdi-replay zmdi-hc-2x" />
                        </Link>
                      </div>
                    ];
                  })}
                  options={options}
                />
              </div>
            </div>
        }
      </Fragment>
    );
  }
}

// map state to props
const mapStateToProps = ({ complainRdcer }) => {
  const { list, loading } = complainRdcer;
  return { list, loading };
};

export default connect(mapStateToProps,
  { complainList }
)(ComplainReportWdgt);
