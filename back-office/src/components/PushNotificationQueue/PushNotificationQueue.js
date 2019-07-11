/* 
    Developer : Khushbu Badheka
    Date : 08-Jan-2019
    File Comment : Push Notification Queue Module
*/

import React, { Component, Fragment } from 'react';
// import connect function for store
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import { displayPushNotification, displayResendPushNotification } from "Actions/PushNotificationQueue";
import { Form, Label, Input, Col, Row, Badge } from 'reactstrap';
import MatButton from "@material-ui/core/Button";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { NotificationManager } from "react-notifications";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import "rc-drawer/assets/index.css";
import Pagination from "react-js-pagination";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
// intl messages
import IntlMessages from "Util/IntlMessages";

const displayStatus = (Status) => {
  switch (Status) {
    case 1:
      return <Badge className="mb-10 mr-10" color="success">
        {<IntlMessages id="sidervar.pushnotificationqueue.status.success" />}
      </Badge>;
    case 9:
      return <Badge className="mb-10 mr-10" color="danger">
        {<IntlMessages id="sidervar.pushnotificationqueue.status.fail" />}
      </Badge>;
    case 6:
      return <Badge className="mb-10 mr-10" color="primary">
        {<IntlMessages id="sidervar.pushnotificationqueue.status.pending" />}
      </Badge>;
    case 0:
      return <Badge className="mb-10 mr-10" color="primary">
        {<IntlMessages id="sidervar.pushnotificationqueue.status.initialize" />}
      </Badge>;
    default:
      return "";
  }
}

class PushNotificationQueue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FromDate: new Date().toISOString().slice(0, 10),
      ToDate: new Date().toISOString().slice(0, 10),
      currentDate: new Date().toISOString().slice(0, 10),
      PushNotificationList: [],
      Page: 1,
      PageSize: 10,
      totalCount: 0,
      totalPage: 0,
      start_row: 1,
      status: '',
      errors: "",
      showReset: false,
      openViewMessageDialog: false,
      selectedRecord: null,
      onLoad: 1
    };
    this.handleChange = this.handleChange.bind(this);
    this.onApply = this.onApply.bind(this);
  }

  // View Message Detail 
  viewMessageDetail = (item) => {
    this.setState({ openViewMessageDialog: true, selectedRecord: item });
  };

  // Function for Resend call
  onResend = (item) => {
    this.setState({ onLoad: 1 });
    this.props.displayResendPushNotification({ item : item });

  };
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handlePageChange = (pageNumber) => {
    this.setState({ Page: pageNumber });
    this.props.displayPushNotification({
      Page: pageNumber,
      PageSize: this.state.PageSize,
      FromDate: this.state.FromDate,
      ToDate: this.state.ToDate,
      Status: this.state.status,
    });
  }

  onApply(event) {
    event.preventDefault();
    this.setState({ showReset: true });
    var date1 = new Date(this.state.FromDate);
    var date2 = new Date(this.state.ToDate);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if ((this.state.FromDate !== '' && this.state.ToDate === '') || (this.state.ToDate !== '' && this.state.FromDate === '')) {
      NotificationManager.error(<IntlMessages id="siderbar.pushnotificationqueue.selectfromdate" />);
    } else if (this.state.ToDate < this.state.FromDate) {
      NotificationManager.error(<IntlMessages id="siderbar.pushnotificationqueue.selectfromdate" />);
    } else if (this.state.ToDate > this.state.currentDate) {
      NotificationManager.error(<IntlMessages id="siderbar.pushnotificationqueue.selecttodate" />);
    } else if (this.state.FromDate > this.state.currentDate) {
      NotificationManager.error(<IntlMessages id="siderbar.pushnotificationqueue.selectfromdate" />);
    } else if (diffDays > 2) {
      NotificationManager.error(<IntlMessages id="sidebar.pushnotificationqueue.diffDateError" />);
    }

    this.setState({ onLoad: 1 });
    this.props.displayPushNotification({
      Page: 1,
      PageSize: this.state.PageSize,
      FromDate: this.state.FromDate,
      ToDate: this.state.ToDate,
      Status: this.state.status,
    });
  }

  //on change props...
  componentWillReceiveProps(nextProps) {
    if (this.state.totalCount != nextProps.totalCount) {
      this.setState({ totalCount: nextProps.totalCount, selectedRecord: null })
    }

    if (this.state.totalPage != nextProps.totalPage) {
      this.setState({ totalPage: nextProps.totalPage })
    }

    if (nextProps.ReturnCode === 0 && nextProps.ReturnMsg != '' && this.state.onLoad === 1) {
      this.setState({ loading: false, selectedRecord: null, onLoad: 0 });
      NotificationManager.success(nextProps.ReturnMsg);
    } else if (nextProps.ReturnCode != 0 && nextProps.ReturnMsg != '' && this.state.onLoad === 1) {
      NotificationManager.error(nextProps.ReturnMsg);
    }
  }

  render() {
    const { selectedRecord } = this.state;
    const columns = [
      { name: "Subject" },
      { name: "Content Title" },
      { name: "Notification Date" },
      { name: "Status" },
      { name: "Action" }
    ];

    const options = {
      sort: false,
      filter: false,
      pagination: false,
      selectableRows: false,
      rowsPerPageOptions: false,
      rowsPerPage: this.state.PageSize,
      serverSide: false,
      print: false,
      download: false,
      viewColumns: false,
      search: false,
      textLabels: {
        body: {
          noMatch: "No Records Found",
          toolTip: "No Records Found",
        }
      },
    };

    const data = this.props.PushNotificationList.length > 0 ? this.props.PushNotificationList : [];

    return (
      <div>
        <JbsCollapsibleCard>
          {this.props.loading && <JbsSectionLoader />}
          <Form name="frm_search" className="row mb-10">
            <div className="col-md-3">
              <Label for="startDate1">{<IntlMessages id="sidebar.pushnotificationqueue.fromdate" />}</Label>
              <Input type="date" name="FromDate" value={this.state.FromDate} id="startDate1" placeholder="dd/mm/yyyy" onChange={this.handleChange} />
            </div>
            <div className="col-md-3">
              <Label for="endDate1">{<IntlMessages id="sidebar.pushnotificationqueue.todate" />}</Label>
              <Input type="date" name="ToDate" value={this.state.ToDate} id="endDate1" placeholder="dd/mm/yyyy" onChange={this.handleChange} />
            </div>
            <div className="col-md-2">
              <Label for="Select-2">{<IntlMessages id="sidervar.pushnotificationqueue.status" />}</Label>
              <div className="app-selectbox-sm">
                <Input type="select" name="status" value={this.state.status} id="Select-2" onChange={this.handleChange}>
                  <IntlMessages id="sidervar.pushnotificationqueue.status.select">
                    {(selectStatus) =>
                      <option value="">{selectStatus}</option>
                    }
                  </IntlMessages>
                  <IntlMessages id="sidervar.pushnotificationqueue.status.pending">
                    {(Pending) =>
                      <option value="6">{Pending}</option>
                    }
                  </IntlMessages>
                  <IntlMessages id="sidervar.pushnotificationqueue.status.success">
                    {(Success) =>
                      <option value="1">{Success}</option>
                    }
                  </IntlMessages>
                  <IntlMessages id="sidervar.pushnotificationqueue.status.initialize">
                    {(Initialize) =>
                      <option value="0">{Initialize}</option>
                    }
                  </IntlMessages>
                  <IntlMessages id="sidervar.pushnotificationqueue.status.fail">
                    {(Fail) =>
                      <option value="9">{Fail}</option>
                    }
                  </IntlMessages>
                </Input>
              </div>
            </div>
            <div className="col-md-1">
              <Label className="d-block">&nbsp;</Label>
              <MatButton variant="raised" className="btn-primary text-white" onClick={this.onApply} >
                {<IntlMessages id="sidebar.pushnotificationqueue.applybtn" />}
              </MatButton>
            </div>
          </Form>
        </JbsCollapsibleCard>
        <MUIDataTable
          title={<IntlMessages id="sidebar.pushnotificationqueuetitle" />}
          columns={columns}
          data={data.map((item, key) => {
            return [
              item.Subject,
              item.ContentTitle,
              item.NotificationDate,
              displayStatus(item.Status),
              <Fragment>
                <div className="list-action">
                  <a href="javascript:void(0)" onClick={() => { this.viewMessageDetail(item.Message) }}><i className="fa fa-eye"></i></a>
                  {item.Status === 9 &&
                    <a href="javascript:void(0)" className="btn-primary text-white" onClick={() => this.onResend(item)} >
                      <i className="fa fa-paper-plane"></i>
                    </a>
                  }
                </div>
              </Fragment>
            ];
          })}
          options={options}
        />
        {this.props.PushNotificationList.length > 0 &&
          <Row>
            <Col md={5} className="mt-20">
              <span>Total Pages :- {this.state.totalPage}</span>
            </Col>
            <Col md={4} className="text-right">
              <div id="pagination_div">
                <Pagination className="pagination"
                  activePage={this.state.Page}
                  itemsCountPerPage={this.state.PageSize}
                  totalItemsCount={this.state.totalCount}
                  pageRangeDisplayed={3}
                  onChange={this.handlePageChange}
                  prevPageText='<'
                  nextPageText='>'
                  firstPageText='<<'
                  lastPageText='>>'
                />
              </div>
            </Col>
            <Col md={3} className="text-right mt-20">
              <span> {this.state.Page > 1 ? (this.state.start_row) + (this.state.PageSize * (this.state.Page - 1)) + ' - ' + ((this.state.PageSize * this.state.Page) > this.state.totalCount ? (this.state.totalCount) : (this.state.PageSize * this.state.Page)) : (this.state.start_row) + ' - ' + ((this.state.PageSize * this.state.Page) > this.state.totalCount ? (this.state.totalCount) : (this.state.PageSize * this.state.Page))} of {this.state.totalCount} Records</span>
            </Col>
          </Row>
        }
        <Dialog
          onClose={() => this.setState({ openViewMessageDialog: false })}
          open={this.state.openViewMessageDialog}
        >
          <DialogTitle id="simple-dialog-title">{<IntlMessages id="sidervar.pushnotificationqueue.ViewMessage" />}</DialogTitle>
          <DialogContent>
            <div>
              <p><span className="fw-bold">{selectedRecord}</span></p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

// map state to props
const mapStateToProps = ({ displayPushNotificationRdcer }) => {
  var response = {
    PushNotificationList: displayPushNotificationRdcer.displayPushNotificationData,
    loading: displayPushNotificationRdcer.loading,
    totalCount: displayPushNotificationRdcer.TotalCount,
    totalPage: displayPushNotificationRdcer.TotalPage,
    ReturnMsg: displayPushNotificationRdcer.ReturnMsg,
    ReturnCode: displayPushNotificationRdcer.ReturnCode,
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    displayPushNotification,
    displayResendPushNotification,
  }
)(PushNotificationQueue);
