/*
 * Created By : Megha Kariya
 * Date : 15-01-2019
 * Comment : list of Messaging Queue
 */
/**
 * Display Messages
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { Form, FormGroup, Label, Input, Button, Col, Row } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import { getMessageQueueList, resendMessageUser } from "Actions/Reports";
import { getMenuPermissionByID } from 'Actions/MyAccount';
import ReactHtmlParser from 'react-html-parser';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Pagination from "react-js-pagination";
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import validator from "validator";
import DialogActions from '@material-ui/core/DialogActions';
//Added by Jayesh on 29-01-2019
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { DashboardPageTitle } from '../DashboardPageTitle';
import AppConfig from 'Constants/AppConfig';

//BreadCrumbData
const BreadCrumbData = [
  {
    title: <IntlMessages id="sidebar.app" />,
    link: '',
    index: 0
  },
  {
    title: <IntlMessages id="sidebar.dashboard" />,
    link: '',
    index: 0
  },
  {
    title: <IntlMessages id="sidebar.cms" />,
    link: '',
    index: 1
  },
  {
    title: <IntlMessages id="messageQueue.title.report" />,
    link: '',
    index: 0
  }
];

//Columns Object
const columns = [
  {
    name: <IntlMessages id="messageQueue.messageQueueColumn.MobileNo" />
  },
  {
    name: <IntlMessages id="messageQueue.messageQueueColumn.SMSDate" />
  },
  {
    name: <IntlMessages id="messageQueue.messageQueueColumn.StrStatus" />
  },
  {
    name: <IntlMessages id="messageQueue.messageQueueColumn.action" />,
    // Added By Megha Kariya (30/01/2019)
    options: {
      sort: false
    }
  }
];
class MessagingQueueWdgt extends Component {

  constructor(props) {
    super(props);
    this.state = {
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date().toISOString().slice(0, 10),
      currentDate: new Date().toISOString().slice(0, 10),
      mobileNo: '',
      status: '',
      isChange: false,
      openViewMessageDialog: false,
      selectedRecord: null,
      onLoad: 0,
      msgSent: 0,
      messageQueueList: [],
      Page: 1,
      PageSize: 10,
      totalCount: 0,
      totalPage: 0,
      start_row: 1,
      // Added By Megha Kariya (30/01/2019)
      oldTotalCount: 0,
      oldTotalPage: 0,
      oldPage: 1,
      menudetail: [],
      Pflag: true,
    }

    this.onApply = this.onApply.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  //fetch details before render
  componentWillMount() {
    this.props.getMenuPermissionByID('13CBECED-267F-589B-5D8F-6472A00C1612');
  }

  handlePageChange = (pageNumber) => {

    // Added By Megha Kariya (30/01/2019)
    if (pageNumber !== 1) {
      this.setState({ oldPage: pageNumber });
    }

    this.setState({ Page: pageNumber, onLoad: 1 });
    this.props.getMessageQueueList({
      Page: pageNumber,
      PageSize: this.state.PageSize,
      FromDate: this.state.start_date + " 00:00:00",
      ToDate: this.state.end_date + " 23:59:59",
      Status: this.state.status,
      MobileNo: this.state.mobileNo
    });

  }
  onApply(event) {

    if (this.state.start_date === '') {

      NotificationManager.error(<IntlMessages id="report.messageQueue.selectstartdate" />);
      this.setState({
        onLoad: 0,
        msgSent: 0,
        messageQueueList: []
      })
    } else if (this.state.end_date === '') {

      NotificationManager.error(<IntlMessages id="report.messageQueue.selectenddate" />);
      this.setState({
        onLoad: 0,
        msgSent: 0,
        messageQueueList: []
      })
    } else if ((this.state.start_date !== '' && this.state.end_date === '') || (this.state.end_date !== '' && this.state.start_date === '')) {

      NotificationManager.error(<IntlMessages id="report.messageQueue.dateselect" />);
      this.setState({
        onLoad: 0,
        msgSent: 0,
        messageQueueList: []
      })
    } else if (this.state.end_date < this.state.start_date) {

      NotificationManager.error(<IntlMessages id="report.messageQueue.datediff" />);
      this.setState({
        onLoad: 0,
        msgSent: 0,
        messageQueueList: []
      })
    } else if (this.state.end_date > this.state.currentDate) {

      NotificationManager.error(<IntlMessages id="report.messageQueue.endcurrentdate" />);
      this.setState({
        onLoad: 0,
        msgSent: 0,
        messageQueueList: []
      })
    } else if (this.state.start_date > this.state.currentDate) {

      NotificationManager.error(<IntlMessages id="report.messageQueue.startcurrentdate" />);
      this.setState({
        onLoad: 0,
        msgSent: 0,
        messageQueueList: []
      })
    } else if (Math.ceil((Math.abs(new Date(this.state.end_date + " 23:59:59").getTime() - new Date(this.state.start_date + " 00:00:00").getTime())) / (1000 * 3600 * 24)) > 2) {

      NotificationManager.error(<IntlMessages id="report.messageQueue.dateDifference" />);
      this.setState({
        onLoad: 0,
        msgSent: 0,
        messageQueueList: []
      })
    }
    else if (typeof this.state.mobileNo !== 'undefined' && this.state.mobileNo !== '' && this.state.mobileNo.length > 10) { // Added By Megha Kariya (15/02/2019)

      NotificationManager.error(<IntlMessages id="report.messageQueue.mobilenoInvalid" />);
      this.setState({
        onLoad: 0,
        msgSent: 0,
        messageQueueList: []
      })
    }
    else {
      var makeLedgerRequest = { FromDate: this.state.start_date + " 00:00:00", ToDate: this.state.end_date + " 23:59:59" };
      if (this.state.mobileNo) {
        makeLedgerRequest.MobileNo = this.state.mobileNo;
      }
      if (this.state.status) {
        makeLedgerRequest.Status = this.state.status;
      }
      if (this.state.Page > 1) {
        this.setState({ Page: 1, oldPage: 1 });
        makeLedgerRequest.Page = 1;
      }
      else {
        makeLedgerRequest.Page = this.state.Page;
      }
      makeLedgerRequest.PageSize = this.state.PageSize;
      this.setState({ onLoad: 1 });

      this.props.getMessageQueueList(makeLedgerRequest)
    }
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleClose() {
    this.setState({ openViewMessageDialog: false })
  };
  validateNumericValue = event => {

    const regexNumeric = /^[0-9]+$/;
    if (validator.matches(event.target.value,regexNumeric) || event.target.value === '') {

      if (event.target.name === 'mobileNo') {
        this.setState({ mobileNo: event.target.value });
      }

    }

  }
  componentWillReceiveProps(nextProps) {

    // update menu details if not set 
    if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
      if (nextProps.menu_rights.ReturnCode === 0) {
        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });

      } else if (nextProps.menu_rights.ReturnCode !== 0) {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        setTimeout(() => {
          this.props.drawerClose();
        }, 2000);
      }
      this.setState({ Pflag: false })
    }

    if (nextProps.messageQueueList && nextProps.error.length === 0 && typeof nextProps.resendData !== 'undefined' && nextProps.resendData !== '' && typeof nextProps.resendData.ReturnCode !== "undefined" && nextProps.resendData.ReturnCode === 0 && this.state.msgSent) {

      var messageQueueList = nextProps.messageQueueList;
      let indexOfResendMessage = messageQueueList.indexOf(this.state.selectedRecord);
      messageQueueList[indexOfResendMessage].Status = 1;
      messageQueueList[indexOfResendMessage].StrStatus = 'Success';

      // Change By Megha Kariya (30/01/2019)
      if (this.state.totalCount != nextProps.totalCount) {
        this.setState({ totalCount: nextProps.totalCount, oldTotalCount: nextProps.totalCount })
      }
      if (this.state.totalPage != nextProps.totalPage) {
        this.setState({ totalPage: nextProps.totalPage, oldTotalPage: nextProps.totalPage })
      }

      this.setState({ loading: false, selectedRecord: null, onLoad: 0, msgSent: 0, messageQueueList: messageQueueList });
      NotificationManager.success(nextProps.resendData.ReturnMsg);

    }
    else if (nextProps.messageQueueList && nextProps.error.length === 0 && this.state.onLoad) {

      // Change By Megha Kariya (30/01/2019)
      if (this.state.totalCount != nextProps.totalCount) {
        this.setState({ totalCount: nextProps.totalCount, oldTotalCount: nextProps.totalCount })
      }
      if (this.state.totalPage != nextProps.totalPage) {
        this.setState({ totalPage: nextProps.totalPage, oldTotalPage: nextProps.totalPage })
      }

      this.setState({
        onLoad: 0,
        msgSent: 0,
        messageQueueList: nextProps.messageQueueList
      })
    }
    else if (nextProps.error.length !== 0 && nextProps.error.ReturnCode !== 0 && this.state.onLoad) {

      // Change By Megha Kariya (30/01/2019)
      if (this.state.totalCount != nextProps.totalCount) {
        this.setState({ totalCount: nextProps.totalCount, oldTotalCount: nextProps.totalCount })
      }
      if (this.state.totalPage != nextProps.totalPage) {
        this.setState({ totalPage: nextProps.totalPage, oldTotalPage: nextProps.totalPage })
      }

      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextProps.error.ErrorCode}`} />);
      this.setState({
        onLoad: 0,
        msgSent: 0,
        messageQueueList: []
      })
    }

    this.setState({
      loading: nextProps.loading
    });
  }

  viewMessageDetail(data) {
    this.setState({ openViewMessageDialog: true, selectedRecord: data });
  }

  onResend(data) {
    this.refs.deleteConfirmationDialog.open();
    this.setState({ selectedRecord: data });
  }

  resendMessage() {
    const { selectedRecord } = this.state;

    this.refs.deleteConfirmationDialog.close();

    this.setState({
      msgSent: 1
    })
    this.setState({ loading: true });
    setTimeout(() => {
      this.props.resendMessageUser(selectedRecord);
    }, 2000);

  }

  closeAll = () => {
    this.setState({
      open: false,
      messageQueueList: []
    });
    this.props.closeAll();
  }

  drawerClose = () => {
    this.setState({
      open: false,
      messageQueueList: [],
      // Added By Megha Kariya (04/02/2019)
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date().toISOString().slice(0, 10),
      currentDate: new Date().toISOString().slice(0, 10),
      mobileNo: '',
      status: '',
    });
    this.props.drawerClose();
  }

  /* check menu permission */
  checkAndGetMenuAccessDetail(GUID) {
    var response = false;
    var index;
    const { menudetail } = this.state;
    if (menudetail.length) {
      for (index in menudetail) {
        if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase())
          response = menudetail[index];
      }
    }
    return response;
  }

  render() {
    var menuPermissionDetail = this.checkAndGetMenuAccessDetail('9DD6EF01-2DC5-8A17-280D-B3C91F435597'); //9DD6EF01-2DC5-8A17-280D-B3C91F435597
    if (!menuPermissionDetail) {
      menuPermissionDetail = { Utility: [], CrudOption: [] }
    }
    const data = this.state.messageQueueList;
    const { selectedRecord } = this.state;
    const { drawerClose } = this.props;
    const options = {
      filterType: 'dropdown',
      responsive: 'stacked',
      selectableRows: false,
      filter: false,
      search: false,
      print: false,
      download: false,
      viewColumns: false,
      pagination: false,
      rowsPerPage: this.state.PageSize,
      textLabels: {
        body: {
          noMatch: <IntlMessages id="wallet.emptyTable" />,
          toolTip: <IntlMessages id="wallet.sort" />
        }
      },
      // Added By Megha Kariya (30/01/2019)
      onTableChange: (action, tableState) => {
        if (action === 'search') {
          if (tableState.searchText !== '' && tableState.searchText !== null) {
            if (tableState.displayData.length > 0) {
              this.setState({ totalCount: tableState.displayData.length, totalPage: (tableState.page + 1), Page: 1, start_row: 1 });
            } else {
              this.setState({ totalCount: tableState.displayData.length, totalPage: (tableState.page + 1), Page: 1, start_row: 0 });
            }
          } else {
            this.setState({ totalCount: this.state.oldTotalCount, totalPage: this.state.oldTotalPage, Page: this.state.oldPage, start_row: 1 });
          }
        }
      }
    };
    return (
      <div className="jbs-page-content">
        <DashboardPageTitle title={<IntlMessages id="messageQueue.title.report" />} breadCrumbData={BreadCrumbData} drawerClose={this.drawerClose} closeAll={this.closeAll} />
        {menuPermissionDetail.Utility.indexOf('18736530') !== -1 &&
          <JbsCollapsibleCard>
            <div className="top-filter">
              <Form className="frm_search tradefrm row">
                <FormGroup className="col-md-2 col-sm-4">
                  <Label for="startDate1">{<IntlMessages id="sidebar.messageQueue.filterLabel.startDate" />}</Label>
                  <Input type="date" name="start_date" value={this.state.start_date} id="startDate1" placeholder="dd/mm/yyyy" onChange={this.handleChange} />
                </FormGroup>
                <FormGroup className="col-md-2 col-sm-4">
                  <Label for="endDate1">{<IntlMessages id="sidebar.messageQueue.filterLabel.endDate" />}</Label>
                  <Input type="date" name="end_date" value={this.state.end_date} id="endDate1" placeholder="dd/mm/yyyy" onChange={this.handleChange} />
                </FormGroup>

                <FormGroup className="col-md-2 col-sm-4">
                  <Label for="Select-2">{<IntlMessages id="messageQueue.filterLabel.mobileNo" />}</Label>
                  <IntlMessages id="messageQueue.filterLabel.mobileNo">
                    {(placeholder) =>
                      <Input type="text" name="mobileNo" value={this.state.mobileNo} id="mobileNo" maxLength={10} placeholder={placeholder} onChange={this.validateNumericValue} />
                    }
                  </IntlMessages>
                </FormGroup>
                <FormGroup className="col-md-2 col-sm-4">
                  <Label for="Select-2">{<IntlMessages id="sidebar.messageQueue.filterLabel.status" />}</Label>
                  <div className="app-selectbox-sm">
                    <Input type="select" name="status" value={this.state.status} id="Select-2" onChange={this.handleChange}>
                      <IntlMessages id="messageQueue.selectStatus">
                        {(selectType) =>
                          <option value="">{selectType}</option>
                        }
                      </IntlMessages>
                      <IntlMessages id="messageQueue.selectStatus.initialize">
                        {(initialize) =>
                          <option value="0">{initialize}</option>
                        }
                      </IntlMessages>
                      <IntlMessages id="messageQueue.selectStatus.pending">
                        {(pending) =>
                          <option value="6">{pending}</option>
                        }
                      </IntlMessages>
                      <IntlMessages id="messageQueue.selectStatus.success">
                        {(success) =>
                          <option value="1">{success}</option>
                        }
                      </IntlMessages>
                      <IntlMessages id="messageQueue.selectStatus.fail">
                        {(fail) =>
                          <option value="9">{fail}</option>
                        }
                      </IntlMessages>
                    </Input>
                  </div>
                </FormGroup>
                <FormGroup className="col-md-2 col-sm-4">
                  <div className="btn_area">
                    <Button variant="raised" color="primary" className="text-white" onClick={this.onApply} >
                      <IntlMessages id="sidebar.messageQueue.button.apply" />
                    </Button>
                  </div>
                </FormGroup>
              </Form>
            </div>
          </JbsCollapsibleCard>
        }
        {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
        {data.length !== 0 &&
          <div className="StackingHistory">
            <MUIDataTable
              // title=""
              data={data.map(item => {

                return [
                  item.MobileNo,
                  item.SMSDate,
                  item.StrStatus,

                  <Fragment>
                    <div className="list-action">
                      {menuPermissionDetail.CrudOption.indexOf('6AF64827') !== -1 && // check for view permission
                        <a href="javascript:void(0)" onClick={() => this.viewMessageDetail(item)}><i className="fa fa-eye"></i></a>}
                      {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && item.Status === 9 &&
                        <a href="javascript:void(0)" className="btn-primary text-white" onClick={() => this.onResend(item)} className="text-dark">
                          <i className="fa fa-paper-plane"></i>

                        </a>
                      }
                    </div>
                  </Fragment>
                ]
              })}
              columns={columns}
              options={options}
            />
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
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange}
                    prevPageText='<'
                    nextPageText='>'
                    firstPageText='<<'
                    lastPageText='>>'
                  />

                </div>
              </Col>
              <Col md={3} className="text-right mt-20">
                <span>{this.state.Page > 1 ? (this.state.start_row) + (this.state.PageSize * (this.state.Page - 1)) + ' - ' + ((this.state.PageSize * this.state.Page) > this.state.totalCount ? (this.state.totalCount) : (this.state.PageSize * this.state.Page)) : (this.state.start_row) + ' - ' + ((this.state.PageSize * this.state.Page) > this.state.totalCount ? (this.state.totalCount) : (this.state.PageSize * this.state.Page))} of {this.state.totalCount} Records</span>
              </Col>
            </Row>

            <DeleteConfirmationDialog
              ref="deleteConfirmationDialog"
              title="Confirmation"
              message="Wants to Resend Message to this User?"
              onConfirm={() => this.resendMessage()}
            />
            <Dialog
              fullWidth={true}
              maxWidth="sm"
              onClose={() => this.setState({ openViewMessageDialog: false })}
              open={this.state.openViewMessageDialog}
            >
              <DialogTitle id="simple-dialog-title">{<IntlMessages id="messageQueue.messageTital" />}</DialogTitle>
              <DialogContent>
                {selectedRecord !== null &&
                  <div>
                    <div className="clearfix d-flex">
                      <div className="media pull-left">
                        <div className="media-body">
                          <p><span className="fw-bold">{ReactHtmlParser(selectedRecord.SMSText.replace("\n", "<br/>"))}</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </DialogContent>
              <DialogActions>
                <Button variant="raised" onClick={() => this.handleClose()} className="btn-danger text-white"> Close </Button>
              </DialogActions>
            </Dialog>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = ({ messageQueue, authTokenRdcer }) => {
  var response = {
    messageQueueList: messageQueue.messageQueueList,
    loading: messageQueue.loading,
    error: messageQueue.error,
    resendData: messageQueue.resendData,
    totalCount: messageQueue.TotalCount,
    totalPage: messageQueue.TotalPage,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    getMessageQueueList,
    resendMessageUser,
    getMenuPermissionByID,
  }
)(MessagingQueueWdgt);


