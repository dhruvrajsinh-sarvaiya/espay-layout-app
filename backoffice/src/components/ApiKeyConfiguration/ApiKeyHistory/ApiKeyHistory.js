/// Component for api key configuration report/history by :devang parekh
// date : 12-3-2019

// import react 
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
//import method for connect component
import { connect } from 'react-redux';
// import components
import { Form, FormGroup, Label, Input, Col, Row, Table, Card, Button } from 'reactstrap';
import MatButton from "@material-ui/core/Button";

//import action for trade report data
import { getApiKeyConfigurationHistory } from "Actions/ApiKeyConfiguration"

//import loader component
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

//  Used For Display Notification 
import { NotificationManager } from "react-notifications";

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

// Pagination 
import Pagination from "react-js-pagination";

import AppConfig from 'Constants/AppConfig';

// action for get api config list
import { getApiPlanConfigList } from "Actions/ApiKeyConfiguration";

import { getUserDataList } from "Actions/MyAccount";

import Select from "react-select";

import { changeDateFormat } from "Helpers/helpers";

import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';

// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
//Action methods..
import {
  getMenuPermissionByID
} from 'Actions/MyAccount';
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
    title: <IntlMessages id="sidebar.ApiKeyConfiguration" />,
    link: '',
    index: 0
  },
  {
    title: <IntlMessages id="sidebar.APIKeyHistory" />,
    link: '',
    index: 1
  }
];

class ApiKeyHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date().toISOString().slice(0, 10),
      currentDate: new Date().toISOString().slice(0, 10),
      planID: 0,
      status: '',
      onLoad: 1,
      open: false,
      userID: '',
      loading: false,
      planList: [],
      apiKeyConfigurationHistory: [],
      isChange: false,
      TotalCount: 0,
      PageNo: 1,
      PageSize: AppConfig.totalRecordDisplayInList,
      totalCount: 0,
      TotalPages: 0,
      notificationFlag: true,
      menudetail: [],
    }
    this.onApply = this.onApply.bind(this);
    this.onClear = this.onClear.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // pagination handle change event
  handlePageChange = (pageNumber) => {

    if (this.state.userID === '') {
      NotificationManager.error(<IntlMessages id="pushMessage.form.error.selectedUser" />);
    } else if ((this.state.start_date !== '' && this.state.end_date === '') || (this.state.end_date !== '' && this.state.start_date === '')) {
      NotificationManager.error(<IntlMessages id="trading.openorders.dateselect" />);
    } else if (this.state.end_date < this.state.start_date) {
      NotificationManager.error(<IntlMessages id="trading.openorders.datediff" />);
    } else if (this.state.end_date > this.state.currentDate) {
      NotificationManager.error(<IntlMessages id="trading.openorders.endcurrentdate" />);
    } else if (this.state.start_date > this.state.currentDate) {
      NotificationManager.error(<IntlMessages id="trading.openorders.startcurrentdate" />);
    } else {
      var apiKeyHistoryRequest = { FromDate: this.state.start_date, ToDate: this.state.end_date };
      if (this.state.status) {
        apiKeyHistoryRequest.Status = this.state.status;
      }
      if (this.state.userID) {
        apiKeyHistoryRequest.UserID = this.state.userID;
      }
      // if (this.state.planID) {
      //   makeLedgerRequest.PlanID = this.state.planID;
      // }
      // makeLedgerRequest.PageNo = pageNumber - 1;
      // makeLedgerRequest.PageSize = this.state.PageSize;
      this.setState({ onLoad: 1, PageNo: pageNumber });
      this.props.getApiKeyConfigurationHistory(apiKeyHistoryRequest)
    }
  }

  // apply button used to call Trading ledger
  onApply(event) {
    if (this.state.userID === '') {
      NotificationManager.error(<IntlMessages id="pushMessage.form.error.selectedUser" />);
    } else if ((this.state.start_date !== '' && this.state.end_date === '') || (this.state.end_date !== '' && this.state.start_date === '')) {
      NotificationManager.error(<IntlMessages id="trading.openorders.dateselect" />);
    } else if (this.state.end_date < this.state.start_date) {
      NotificationManager.error(<IntlMessages id="trading.openorders.datediff" />);
    } else if (this.state.end_date > this.state.currentDate) {
      NotificationManager.error(<IntlMessages id="trading.openorders.endcurrentdate" />);
    } else if (this.state.start_date > this.state.currentDate) {
      NotificationManager.error(<IntlMessages id="trading.openorders.startcurrentdate" />);
    } else {
      var apiKeyHistoryRequest = { FromDate: this.state.start_date, ToDate: this.state.end_date };
      if (this.state.status) {
        apiKeyHistoryRequest.Status = this.state.status;
      }
      if (this.state.userID) {
        apiKeyHistoryRequest.UserID = this.state.userID;
      }
      // if (this.state.planID) {
      //   makeLedgerRequest.PlanID = this.state.planID;
      // }
      if (this.state.PageNo > 1) {
        this.setState({ PageNo: 1 });
        apiKeyHistoryRequest.PageNo = 0;
      } else {
        apiKeyHistoryRequest.PageNo = this.state.PageNo - 1;
      }
      apiKeyHistoryRequest.PageSize = this.state.PageSize;

      this.setState({ onLoad: 1, PageNo: 1 });
      this.props.getApiKeyConfigurationHistory(apiKeyHistoryRequest)
    }

  }

  onClear(event) {

    this.setState({
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date().toISOString().slice(0, 10),
      PageNo: 1,
      PageSize: AppConfig.totalRecordDisplayInList,
      apiKeyConfigurationHistory: [],
      userID: '',
      status: '',
      onLoad: 1,
      planID: 0,
    });
  }

  //set state for input types
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  componentWillMount() {
    this.props.getMenuPermissionByID('4524A918-5CD1-72AC-44F4-660D456B1366'); // get Trading menu permission
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
      this.setState({
        open: false,
      })
    }

    if (nextProps.onLoad === 1) {
      this.setState({
        collapse: false
      })
    } // This If condition added by Khushbu Badheka D:02/02/2019

    if (typeof nextProps.planList !== 'undefined' && nextProps.planList.length > 0) {

      this.setState({
        planList: nextProps.planList
      })
    }


    if (this.state.TotalCount !== nextProps.TotalCount) {
      this.setState({ TotalCount: nextProps.TotalCount })
    }

    if (this.state.TotalPages !== nextProps.TotalPages) {
      this.setState({ TotalPages: nextProps.TotalPages })
    }

    if (nextProps.apiKeyConfigurationHistory && nextProps.apiKeyConfigurationHistory.length > 0 &&
      nextProps.error.length === 0 && this.state.onLoad) {
      this.setState({
        apiKeyConfigurationHistory: nextProps.apiKeyConfigurationHistory,
        onLoad: 0
      })
    } else if (nextProps.error.length !== 0 && nextProps.error.ReturnCode !== 0 && this.state.onLoad) {
      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextProps.error.ErrorCode}`} />);
      this.setState({
        apiKeyConfigurationHistory: [],
        onLoad: 0
      })
    }

    if (nextProps.ErrorCode === 4501 && nextProps.error.length === 0 && this.state.onLoad) {
      //NotificationManager.error(<IntlMessages id="error.trading.transaction.4501" />);
      NotificationManager.error(<IntlMessages id="trading.market.label.nodata" />);
      this.setState({
        apiKeyConfigurationHistory: [],
        onLoad: 0
      })
    }
    /* update menu details if not set */
    if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
      if (nextProps.menu_rights.ReturnCode === 0) {
        this.setState({ onLoad: 1, PageNo: 1 })
        this.props.getUserDataList();
        this.props.getApiPlanConfigList({});

        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        this.props.drawerClose();
      }
      this.setState({ notificationFlag: false });
    }
  }

  //call after render component
  // componentDidMount() {
  //   this.setState({ onLoad: 1, PageNo: 1 })

  //   this.props.getUserDataList();
  //   this.props.getApiPlanConfigList({});

  // }

  // used for close drawer
  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false,
    });
  }

  onChangeSelectUser = (event) => {
    this.setState({ userID: (typeof (event.value) === "undefined" ? "" : event.value) });
  }

  // used for set state for chanage status
  handleChangeStatus = event => {
    this.setState({ status: event.target.value });
  };
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
  //render component for report
  render() {

    const { drawerClose } = this.props;
    const data = this.state.apiKeyConfigurationHistory;

    const userlist = this.props.getUser.hasOwnProperty('GetUserData') ? this.props.getUser.GetUserData : [];

    var menuPermissionDetail = this.checkAndGetMenuAccessDetail('6AD8388C-1F05-1F94-511A-7CF027942E1C');//getting object detail for checking permissions 6AD8388C-1F05-1F94-511A-7CF027942E1C
    if (!menuPermissionDetail) {
      menuPermissionDetail = { Utility: [], CrudOption: [] }
    }

    return (
      <Fragment >
        <Scrollbars
          className="jbs-scroll"
          autoHide
          autoHideDuration={100}
          style={{ height: 'calc(100vh - 100px)' }}
        >
          <div className="charts-widgets-wrapper jbs-page-content" style={{ overflow: "hidden" }}>

            <WalletPageTitle title={<IntlMessages id="sidebar.APIKeyHistory" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />

            {/* <PageTitleBar title={<IntlMessages id="sidebar.tradingLedger" />} match={this.props.match} /> */}
            <Fragment>
              {(this.props.userListLoading || this.props.menuLoading) && <JbsSectionLoader />}

              {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && // check for filter permission
                <JbsCollapsibleCard>
                  <div className="top-filter">
                    <Form className="frm_search tradefrm row">
                      <FormGroup className="col-md-2 col-sm-4">
                        <Label for="UserId"><IntlMessages id="my_account.userName" /></Label>
                        <Select className="r_sel_20"
                          options={userlist.map((user) => ({
                            label: user.UserName,
                            value: user.Id,
                          }))}
                          onChange={this.onChangeSelectUser}
                          maxMenuHeight={200}
                          placeholder={<IntlMessages id="sidebar.searchdot" />}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-2 col-sm-4">
                        <Label for="startDate1">{<IntlMessages id="sidebar.tradingLedger.filterLabel.startDate" />}</Label>
                        <Input type="date" name="start_date" value={this.state.start_date} id="startDate1" placeholder="dd/mm/yyyy" onChange={this.handleChange} />
                      </FormGroup>
                      <FormGroup className="col-md-2 col-sm-4">
                        <Label for="endDate1">{<IntlMessages id="sidebar.tradingLedger.filterLabel.endDate" />}</Label>
                        <Input type="date" name="end_date" value={this.state.end_date} id="endDate1" placeholder="dd/mm/yyyy" onChange={this.handleChange} />
                      </FormGroup>

                      <FormGroup className="col-md-2 col-sm-4">
                        <Label for="planid">{<IntlMessages id="apiplanconfiguration.title.planid" />}</Label>
                        <div className="app-selectbox-sm">
                          <Input type="select" name="planid" value={this.state.planid} id="Select-2" onChange={this.handleChange}>
                            <IntlMessages id="apiplanconfiguration.selectplan">
                              {(selectCurrency) =>
                                <option value="">{selectCurrency}</option>
                              }
                            </IntlMessages>
                            {this.state.planList.map((plan, key) =>
                              <option key={key} value={plan.ID}>{plan.PlanName}</option>
                            )}
                          </Input>
                        </div>
                      </FormGroup>
                      <FormGroup className="col-md-2 col-sm-4">
                        <Label for="Select-2">{<IntlMessages id="sidebar.tradingLedger.filterLabel.status" />}</Label>
                        <div className="app-selectbox-sm">
                          <Input type="select" name="status" value={this.state.status} id="Select-2" onChange={(e) => this.handleChangeStatus(e)}>
                            <IntlMessages id="sidebar.tradingLedger.filterLabel.status.selectStatus">
                              {(selectStatus) =>
                                <option value="">{selectStatus}</option>
                              }
                            </IntlMessages>
                            <IntlMessages id="sidebar.active">
                              {(activeOrder) =>
                                <option value="1">{activeOrder}</option>
                              }
                            </IntlMessages>
                            <IntlMessages id="sidebar.inactive">
                              {(partialOrder) =>
                                <option value="0">{partialOrder}</option>
                              }
                            </IntlMessages>
                            <IntlMessages id="sidebar.btnDisable">
                              {(settledOrder) =>
                                <option value="9">{settledOrder}</option>
                              }
                            </IntlMessages>
                          </Input>
                        </div>
                      </FormGroup>
                      <FormGroup className="col-md-2 col-sm-4">
                        <div className="btn_area">
                          <Button color="primary" onClick={this.onApply} ><IntlMessages id="sidebar.tradingLedger.button.apply" /></Button>
                          <Button color="danger" className="ml-15" onClick={this.onClear}><IntlMessages id="sidebar.tradingLedger.button.clear" /></Button>
                        </div>
                      </FormGroup>
                    </Form>
                  </div>
                </JbsCollapsibleCard>
              }
              {this.props.loading && <JbsSectionLoader />}
              <Card>
                <div className="m-20 page-title d-flex justify-content-between align-items-center">
                  <div className="page-title-wrap">
                    <h5><IntlMessages id="sidebar.APIKeyHistory" /></h5>
                  </div>
                </div>
                <Scrollbars className="jbs-scroll" autoHeight autoHeightMin={200} autoHeightMax={280} autoHide>
                  <Table hover className="mb-0" responsive>
                    <thead>
                      <tr>
                        <th width="13%">
                          <IntlMessages id={"sidebar.colAliasName"} />
                        </th>
                        <th width="13%">
                          <IntlMessages id={"sidebar.apiPermission"} />
                        </th>
                        <th width="13%">
                          <IntlMessages id={"sidebar.ipAccess"} />
                        </th>
                        <th width="13%">
                          <IntlMessages id={"tradingLedger.tableHeading.type"} />
                        </th>
                        <th width="13%">
                          <IntlMessages id={"tradingLedger.tableHeading.orderType"} />
                        </th>
                        <th width="13%">
                          <IntlMessages id={"sidebar.tradingLedger.tableHeading.price"} />
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {data.length > 0 ?
                        data.map((item, key) => (
                          <ApiKeyHistoryCollapse key={key} data={item} onLoad={this.state.onLoad} />
                        ))
                        :
                        <tr className="text-center">
                          <td colSpan={8}>
                            <IntlMessages id="trading.market.label.nodata" />
                          </td>
                        </tr>

                      }
                    </tbody>
                  </Table>
                </Scrollbars>
              </Card>

            </Fragment>
            {this.props.TotalCount > AppConfig.totalRecordDisplayInList ?
              <Row>
                <Col md={5} className="mt-20">
                  <span>Total Pages :- {this.state.TotalPages}</span>
                </Col>
                <Col md={4} className="text-right">
                  <div id="pagination_div">
                    <Pagination className="pagination"
                      activePage={this.state.PageNo}
                      itemsCountPerPage={this.state.PageSize}
                      totalItemsCount={this.props.TotalCount}
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
                  <span>{this.state.PageNo > 1 ? (this.state.start_row) + (this.state.PageSize * (this.state.PageNo - 1)) + ' - ' + ((this.state.PageSize * this.state.PageNo) > this.state.TotalCount ? (this.state.TotalCount) : (this.state.PageSize * this.state.PageNo)) : (this.state.start_row) + ' - ' + ((this.state.PageSize * this.state.PageNo) > this.state.TotalCount ? (this.state.TotalCount) : (this.state.PageSize * this.state.PageNo))} of {this.state.TotalCount} Records</span>
                </Col>
              </Row> :
              null
            }
          </div>
        </Scrollbars>
      </Fragment>
    );
  }
}

//class for collapsible data
class ApiKeyHistoryCollapse extends Component {
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

  componentWillUnmount() {
    this.setState({
      collapse: false
    })
  }
  //redner for collapsible data
  render() {
    const { data } = this.props;
    const { collapse } = this.state;

    var status = '';
    if (data.Status === 1) {
      status = <IntlMessages id="sidebar.active" />
    } else if (data.Status === 0) {
      status = <IntlMessages id="sidebar.btnInactive" />
    } else if (data.Status === 9) {
      status = <IntlMessages id="sidebar.btnDisable" />
    }

    return (
      <Fragment>
        <tr style={{ cursor: "pointer" }} onClick={() => this.OnCollapseProject()}>
          <td>{data.AliasName}</td>
          <td>{data.APIPermission === 1 ? <IntlMessages id="sidebar.adminrights" /> : <IntlMessages id="sidebar.viewrights" />}</td>
          <td>{data.IPAccess === 1 ? <IntlMessages id="sidebar.restricted" /> : <IntlMessages id="sidebar.unRestricted" />}</td>
          <td>
            {data.Status === 1 &&
              <span style={{ float: "left" }} className={`badge badge-xs badge-success position-relative`}>&nbsp;</span>
            }
            {data.Status === 0 &&
              <span style={{ float: "left" }} className={`badge badge-xs badge-danger position-relative`} > &nbsp;</span>
            }
            {data.Status === 9 &&
              <span style={{ float: "left" }} className={`badge badge-xs badge-danger position-relative`} > &nbsp;</span>
            }
            <div className="status pl-30">{status}</div>
          </td>
          <td>{changeDateFormat(data.CreatedDate, 'YYYY-MM-DD HH:mm:ss', false)}</td>
          <td>{changeDateFormat(data.UpdatedDate, 'YYYY-MM-DD HH:mm:ss', false)}</td>
        </tr>
        {collapse && (
          <Fragment>
            <tr className="text-center">
              <td colSpan={8}>
                <Table hover className="mb-0 tradetable">
                  <thead>
                    <tr>
                      <th width="25%">
                        <IntlMessages id={"my_account.IPWhitelis.addColumn.aliasName"} />
                      </th>
                      <th width="25%">
                        <IntlMessages id={"sidebar.colIpAddress"} />
                      </th>
                      <th width="25%">
                        <IntlMessages id={"sidebar.ipType"} />
                      </th>
                      <th width="25%">
                        <IntlMessages id={"sidebar.colCreatedDt"} />
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.KeyDetails.map((info, i) => {
                      return [
                        <tr key={i} className="tradeexpansion">
                          <td>{info.AliasName}</td>
                          <td>{info.IPAddress}</td>
                          <td>{info.IPType === 1 ? <IntlMessages id="sidebar.ipType.whiteList" /> : <IntlMessages id="sidebar.ipType.concurrent" />}</td>
                          <td>{changeDateFormat(info.CreatedDate, 'YYYY-MM-DD HH:mm:ss', false)}</td>
                        </tr>
                      ];
                    })}
                  </tbody>
                </Table>
              </td>
            </tr>
          </Fragment>
        )}

      </Fragment>
    );
  }
}

// map states to props when changed in states from reducer
const mapStateToProps = ({ ApiKeyConfigurationHistory, ApiPlanConfig, actvHstrRdcer, drawerclose, authTokenRdcer }) => {

  if (drawerclose.bit === 1) {
    setTimeout(function () {
      drawerclose.bit = 2
    }, 1000);
  }
  const { menuLoading, menu_rights } = authTokenRdcer;
  const { apiKeyConfigurationHistory, loading, error, TotalCount, TotalPages } = ApiKeyConfigurationHistory;

  const planList = ApiPlanConfig.apiPlanConfigList;
  const planListLoading = ApiPlanConfig.loading;
  const { getUser } = actvHstrRdcer;
  const userListLoading = actvHstrRdcer.loading;

  return { apiKeyConfigurationHistory, loading, error, TotalCount, TotalPages, planList, planListLoading, getUser, userListLoading, drawerclose, menuLoading, menu_rights }

}

// export this component with action methods and props
export default connect(mapStateToProps, {
  getApiKeyConfigurationHistory,
  getApiPlanConfigList,
  getUserDataList,
  getMenuPermissionByID
})(ApiKeyHistory);

