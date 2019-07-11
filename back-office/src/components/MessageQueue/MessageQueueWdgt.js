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
import MatButton from "@material-ui/core/Button";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { Form, Label, Input, Button, Col, Row } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import { getMessageQueueList, resendMessageUser } from "Actions/Reports";
import validator from "validator";
import ReactHtmlParser from 'react-html-parser';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Pagination from "react-js-pagination";
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import DialogActions from '@material-ui/core/DialogActions';


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
    name: <IntlMessages id="messageQueue.messageQueueColumn.action" />
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
      start_row: 1
    }

    this.onApply = this.onApply.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handlePageChange = (pageNumber) => {

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
    } else {
      var makeLedgerRequest = { FromDate: this.state.start_date + " 00:00:00", ToDate: this.state.end_date + " 23:59:59" };
      if (this.state.mobileNo) {
        makeLedgerRequest.MobileNo = this.state.mobileNo;
      }
      if (this.state.status) {
        makeLedgerRequest.Status = this.state.status;
      }
      if (this.state.Page > 1) {
        this.setState({ Page: 1 });
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
    if (validator.matches(event.target.value, regexNumeric) || event.target.value === '') {

      if (event.target.name === 'mobileNo') {
        this.setState({ mobileNo: event.target.value });
      }

    }

  }
  componentWillReceiveProps(nextProps) {

    if (nextProps.messageQueueList && nextProps.error.length === 0 && typeof nextProps.resendData !== 'undefined' && nextProps.resendData !== '' && typeof nextProps.resendData.ReturnCode !== "undefined" && nextProps.resendData.ReturnCode === 0 && this.state.msgSent) {

      var messageQueueList = nextProps.messageQueueList;
      let indexOfResendMessage = messageQueueList.indexOf(this.state.selectedRecord);
      messageQueueList[indexOfResendMessage].Status = 1;
      messageQueueList[indexOfResendMessage].StrStatus = 'Success';

      if (this.state.totalCount != nextProps.totalCount) {
        this.setState({ totalCount: nextProps.totalCount })
      }
      if (this.state.totalPage != nextProps.totalPage) {
        this.setState({ totalPage: nextProps.totalPage })
      }
      this.setState({ loading: false, selectedRecord: null, onLoad: 0, msgSent: 0, messageQueueList: messageQueueList });
      NotificationManager.success(nextProps.resendData.ReturnMsg);

    }
    else if (nextProps.messageQueueList && nextProps.error.length === 0 && this.state.onLoad) {

      if (this.state.totalCount != nextProps.totalCount) {
        this.setState({ totalCount: nextProps.totalCount })
      }
      if (this.state.totalPage != nextProps.totalPage) {
        this.setState({ totalPage: nextProps.totalPage })
      }
      this.setState({
        onLoad: 0,
        msgSent: 0,
        messageQueueList: nextProps.messageQueueList
      })
    }
    else if (nextProps.error.length !== 0 && nextProps.error.ReturnCode !== 0 && this.state.onLoad) {
      if (this.state.totalCount != nextProps.totalCount) {
        this.setState({ totalCount: nextProps.totalCount })
      }
      if (this.state.totalPage != nextProps.totalPage) {
        this.setState({ totalPage: nextProps.totalPage })
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

  render() {
    const data = this.state.messageQueueList;
    const { selectedRecord } = this.state;
    const options = {
      filterType: 'dropdown',
      responsive: 'stacked',
      selectableRows: false,
      filter: false,
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
    };
    return (
      <Fragment>
        <div className="charts-widgets-wrapper">

          <div className="m-20 page-title d-flex justify-content-between align-items-center">
            <div className="page-title-wrap">
              <h2>{<IntlMessages id="messageQueue.title.report" />}</h2>
            </div>
          </div>
          <div className="transaction-history-detail">
            <div className="col-md-12">
              <JbsCollapsibleCard>
                <div className="row">
                  <div className="col-md-12">
                    <div className="top-filter clearfix">
                      <Form name="frm_search" className="row mb-10">
                        <div className="col-md-3">
                          <Label for="startDate1">{<IntlMessages id="sidebar.messageQueue.filterLabel.startDate" />}</Label>
                          <Input type="date" name="start_date" value={this.state.start_date} id="startDate1" placeholder="dd/mm/yyyy" onChange={this.handleChange} />
                        </div>
                        <div className="col-md-3">
                          <Label for="endDate1">{<IntlMessages id="sidebar.messageQueue.filterLabel.endDate" />}</Label>
                          <Input type="date" name="end_date" value={this.state.end_date} id="endDate1" placeholder="dd/mm/yyyy" onChange={this.handleChange} />
                        </div>

                        <div className="col-md-2">
                          <Label for="Select-2">{<IntlMessages id="messageQueue.filterLabel.mobileNo" />}</Label>
                          <IntlMessages id="messageQueue.filterLabel.mobileNo">
                            {(placeholder) =>
                              <Input type="text" name="mobileNo" value={this.state.mobileNo} id="mobileNo" placeholder={placeholder} onChange={this.validateNumericValue} />
                            }
                          </IntlMessages>
                        </div>
                        <div className="col-md-2">
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
                        </div>

                        <div className="col-md-1">
                          <Label className="d-block">&nbsp;</Label>
                          <MatButton variant="raised" className="btn-primary text-white" onClick={this.onApply} >
                            <IntlMessages id="sidebar.messageQueue.button.apply" />
                          </MatButton>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </JbsCollapsibleCard>
            </div>
            {this.props.loading && <JbsSectionLoader />}
            {data.length !== 0 &&
              <div className="responsive-table-wrapper">
                <JbsCollapsibleCard>
                  <div className="table-responsive">
                    <div className="unseen">
                      <MUIDataTable
                        title=""
                        data={data.map(item => {

                          return [
                            item.MobileNo,
                            item.SMSDate,
                            item.StrStatus,

                            <Fragment>
                              <div className="list-action">

                                <a href="javascript:void(0)" onClick={() => this.viewMessageDetail(item)}><i className="fa fa-eye"></i></a>
                                {item.Status === 9 &&
                                  <a href="javascript:void(0)" className="btn-primary text-dark" onClick={() => this.onResend(item)} >
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
                    </div>
                  </div>

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

                </JbsCollapsibleCard>
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
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ messageQueue }) => {
  var response = {
    messageQueueList: messageQueue.messageQueueList,
    loading: messageQueue.loading,
    error: messageQueue.error,
    resendData: messageQueue.resendData,
    totalCount: messageQueue.TotalCount,
    totalPage: messageQueue.TotalPage,
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    getMessageQueueList,
    resendMessageUser
  }
)(MessagingQueueWdgt);


