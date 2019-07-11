/// Component for Trade sumamry report by :tejas

// import react 
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
//import method for connect component
import { connect } from 'react-redux';
//  Used For Display Notification 
import { NotificationManager } from "react-notifications";
// intl messages
import IntlMessages from "Util/IntlMessages";
// Pagination 
import Pagination from "react-js-pagination";
// import components
import { Form, Label, Input, Col, Row, Table, Card, FormGroup } from 'reactstrap';
import Button from "@material-ui/core/Button";
//import action for trade report data
import { getTradingLedgerDataList } from "Actions/Trading"
//import loader component
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import validator from "validator";
// import pairlist data action 
import { getTradePairs } from "Actions/TradeRecon";
// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';
//repost Guid select from here
const menuDetailArray = [
  // Margin Trading GUID
  { "GUID": '2F34DE45-77E8-2ACC-6DF2-E49DB2410B40', "Report": '4634C44A-8E46-25A0-A421-07AEF9A94347' },
  { "GUID": '42080130-138D-0F50-7672-3EBE296317BF', "Report": '8A0F3143-5E18-4A46-1D24-A17BDF82A46B' },
  { "GUID": '8123C875-2E29-2C3C-7323-C577FEB681AE', "Report": '53D47129-36A8-6476-5560-9A9F1A7120D7' },
  { "GUID": '9B8A4044-64B4-4AB7-3E77-D2BF08385165', "Report": '1E1B4FF8-128A-890A-9D13-6F03E235A532' },
  //Trading GUID
  { "GUID": 'AB797B9E-18C7-2570-073D-103D1ABF7EC9', "Report": '1B8DB130-526C-6636-504B-86BEEA721887' },
  { "GUID": '4553E2F3-6293-4D61-1D9E-F1736756588F', "Report": 'F2BBB85A-8167-4305-1EFF-0553A8351453' },
  { "GUID": '65C52175-4BEA-48EC-1196-FBA3DBC976A4', "Report": 'A66890E8-04DE-8A77-0F68-BCCA336B9EFE' },
  { "GUID": 'B6E7575D-7146-330F-56CF-1A3E092F873C', "Report": '71C88AC8-5D0B-3321-6F0A-1281E08D6EB3' },
]

class TradingLedger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date().toISOString().slice(0, 10),
      currentDate: new Date().toISOString().slice(0, 10),
      pair: '',
      status: '',
      type: '',
      onLoad: 1,
      open: false,
      userID: '',
      trnNo: '',
      currency: '',
      orderType: this.props.state ? this.props.state.orderType : '',
      reportTitle: this.props.state ? this.props.state.reportTitle : 'sidebar.TradeSummary.title',
      loading: false,
      pairList: [],
      tradingLedger: [],
      isChange: false,
      tradeLedgerBit: 0,
      TotalCount: 0,
      PageNo: 1,
      PageSize: AppConfig.totalRecordDisplayInList,
      start_row: 1,
      TotalPages: 0,
      //added by parth andhariya
      marginTradingBit: props.state.marginTradingBit,
      showReset: false,
      ReportGuid: "",
      menudetail: [],
      notificationFlag: true,
    }

    // Added by Khushbu Badheka D:02/02/2019 
    this.initState = {
      start_date: '',
      end_date: '',
      currentDate: new Date().toISOString().slice(0, 10),
      pair: '',
      status: '',
      type: '',
      onLoad: 1,
      open: false,
      userID: '',
      trnNo: '',
      currency: '',
      orderType: this.props.state ? this.props.state.orderType : '',
      reportTitle: this.props.state ? this.props.state.reportTitle : 'sidebar.TradeSummary.title',
      loading: false,
      pairList: [],
      tradingLedger: [],
      isChange: false,
      tradeLedgerBit: 0,
      TotalCount: 0,
      PageNo: 1,
      PageSize: AppConfig.totalRecordDisplayInList,
      showReset: false,
    }

    this.onApply = this.onApply.bind(this);
    this.onClear = this.onClear.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeOrder = this.handleChangeOrder.bind(this)
  }

  // validate input  for numeric input
  validateNumericValue = event => {
    const regexNumeric = /^[0-9]+$/;
    if (validator.matches(event.target.value, regexNumeric) || event.target.value === '') {
      if (event.target.name === 'userID') {
        this.setState({ userID: event.target.value });
      } else if (event.target.name === 'trnNo') {
        this.setState({ trnNo: event.target.value });
      }
    }
  }

  // pagination handle change event
  handlePageChange = (pageNumber) => {
    if ((this.state.start_date !== '' && this.state.end_date === '') || (this.state.end_date !== '' && this.state.start_date === '')) {
      NotificationManager.error(<IntlMessages id="trading.openorders.dateselect" />);
    } else if (this.state.end_date < this.state.start_date) {
      NotificationManager.error(<IntlMessages id="trading.openorders.datediff" />);
    } else if (this.state.end_date > this.state.currentDate) {
      NotificationManager.error(<IntlMessages id="trading.openorders.endcurrentdate" />);
    } else if (this.state.start_date > this.state.currentDate) {
      NotificationManager.error(<IntlMessages id="trading.openorders.startcurrentdate" />);
    } else {
      var makeLedgerRequest = { FromDate: this.state.start_date, ToDate: this.state.end_date };
      if (this.state.trnNo) {
        makeLedgerRequest.TrnNo = this.state.trnNo;
      }
      if (this.state.userID) {
        makeLedgerRequest.MemberID = this.state.userID;
      }
      if (this.state.type) {
        makeLedgerRequest.TrnType = this.state.type;
      }
      if (this.state.pair) {
        makeLedgerRequest.PairName = this.state.pair;
      }
      if (this.state.orderType) {
        makeLedgerRequest.OrderType = this.state.orderType;
      }
      makeLedgerRequest.PageNo = pageNumber - 1;
      makeLedgerRequest.PageSize = this.state.PageSize;
      this.setState({ onLoad: 1, PageNo: pageNumber });
      //added by parth andhariya
      if (this.state.marginTradingBit === 1) {
        makeLedgerRequest.IsMargin = 1;
        this.props.getTradingLedgerDataList(makeLedgerRequest)
      } else {
        this.props.getTradingLedgerDataList(makeLedgerRequest)
      }
    }
  }

  // apply button used to call Trading ledger
  onApply(event) {
    if ((this.state.start_date !== '' && this.state.end_date === '') || (this.state.end_date !== '' && this.state.start_date === '')) {
      NotificationManager.error(<IntlMessages id="trading.openorders.dateselect" />);
    } else if (this.state.end_date < this.state.start_date) {
      NotificationManager.error(<IntlMessages id="trading.openorders.datediff" />);
    } else if (this.state.end_date > this.state.currentDate) {
      NotificationManager.error(<IntlMessages id="trading.openorders.endcurrentdate" />);
    } else if (this.state.start_date > this.state.currentDate) {
      NotificationManager.error(<IntlMessages id="trading.openorders.startcurrentdate" />);
    } else {
      var makeLedgerRequest = { FromDate: this.state.start_date, ToDate: this.state.end_date };
      if (this.state.trnNo) {
        makeLedgerRequest.TrnNo = this.state.trnNo;
      }
      if (this.state.userID) {
        makeLedgerRequest.MemberID = this.state.userID;
      }
      if (this.state.type) {
        makeLedgerRequest.TrnType = this.state.type;
      }
      if (this.state.pair) {
        makeLedgerRequest.PairName = this.state.pair;
      }
      if (this.state.orderType) {
        makeLedgerRequest.OrderType = this.state.orderType;
      }
      if (this.state.PageNo > 1) {
        this.setState({ PageNo: 1 });
        makeLedgerRequest.PageNo = 0;
      }
      else {
        makeLedgerRequest.PageNo = this.state.PageNo - 1;
      }
      makeLedgerRequest.PageSize = this.state.PageSize;
      this.setState({ onLoad: 1, PageNo: 1, showReset: true });
      //added by parth andhariya
      if (this.state.marginTradingBit === 1) {
        makeLedgerRequest.IsMargin = 1;
        this.props.getTradingLedgerDataList(makeLedgerRequest)
      } else {
        this.props.getTradingLedgerDataList(makeLedgerRequest)
      }
    }
  }

	/*Function added by Khushbu Badheka D:01/02/2019 
	  for reset input fields variables while clear button clicked.
	*/
  onClear(event) {
    this.setState(this.initState);
    //added by parth andhariya
    if (this.state.marginTradingBit === 1) {
      this.props.getTradingLedgerDataList({
        FromDate: this.initState.start_date,
        ToDate: this.initState.end_date,
        OrderType: this.initState.orderType,
        PageNo: this.initState.PageNo - 1,
        PageSize: this.initState.PageSize,
        IsMargin: 1
      });
    } else {
      this.props.getTradingLedgerDataList({
        FromDate: this.initState.start_date,
        ToDate: this.initState.end_date,
        OrderType: this.initState.orderType,
        PageNo: this.initState.PageNo - 1,
        PageSize: this.initState.PageSize
      });
    }
  }

  //set state for input types
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  //set order type
  handleChangeOrder(event) {
    if (event.target.value === '') {
      this.setState({
        isChange: true,
        [event.target.name]: event.target.value,
        reportTitle: "sidebar.TradeSummary.title"
      })
    } else {
      this.setState({
        isChange: true,
        [event.target.name]: event.target.value,
        reportTitle: "tradesummary.title." + event.target.value
      })
    }
  }

  componentWillMount() {
    menuDetailArray.length > 0 && menuDetailArray.map((menuDetails, key) => {
      if (menuDetails.GUID.toLowerCase() === this.props.state.Guid.toLowerCase()) {
        this.setState({ ReportGuid: menuDetails.Report })
        this.props.getMenuPermissionByID(this.props.state.Guid); // get Trading menu permission
      }
      return []
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.onLoad === 1) {
      this.setState({ collapse: false })
    } // This If condition added by Khushbu Badheka D:02/02/2019
    if (this.state.TotalCount !== nextProps.TotalCount) {
      this.setState({ TotalCount: nextProps.TotalCount })
    }
    if (this.state.TotalPages !== nextProps.TotalPages) {
      this.setState({ TotalPages: nextProps.TotalPages })
    }
    if (nextProps.pairList.length) {
      this.setState({ pairList: nextProps.pairList })
    }
    if (nextProps.state.orderType !== this.state.orderType && this.state.isChange === false) {
      //added by parth andhariya
      if (this.state.marginTradingBit === 1) {
        this.props.getTradingLedgerDataList({
          OrderType: nextProps.state.orderType,
          FromDate: this.state.start_date,
          ToDate: this.state.end_date,
          PageNo: this.state.PageNo - 1,
          PageSize: this.state.PageSize,
          IsMargin: 1
        });
      } else {
        this.props.getTradingLedgerDataList({
          OrderType: nextProps.state.orderType,
          FromDate: this.state.start_date,
          ToDate: this.state.end_date,
          PageNo: this.state.PageNo - 1,
          PageSize: this.state.PageSize
        });
      }
      this.setState({
        orderType: nextProps.state.orderType,
        onLoad: 1,
        PageNo: 1
      })
    }

    if (nextProps.state.reportTitle !== this.state.reportTitle && this.state.isChange === false) {
      this.setState({ reportTitle: nextProps.state.reportTitle })
    }

    if (nextProps.tradeLedgerList && nextProps.error.length === 0 && this.state.tradeLedgerBit !== nextProps.tradeLedgerBit) {
      this.setState({
        tradingLedger: nextProps.tradeLedgerList,
        onLoad: 0,
        tradeLedgerBit: nextProps.tradeLedgerBit
      })
    }
    else if (nextProps.error.length !== 0 && nextProps.error.ReturnCode !== 0 && this.state.tradeLedgerBit !== nextProps.tradeLedgerBit) {
      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextProps.error.ErrorCode}`} />);
      this.setState({
        tradingLedger: [],
        onLoad: 0,
        tradeLedgerBit: nextProps.tradeLedgerBit
      })
    }

    if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
      this.setState({ open: false })
    }

    /* update menu details if not set */
    if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
      if (nextProps.menu_rights.ReturnCode === 0) {
        this.setState({ onLoad: 1, PageNo: 1 })
        //added by parth andhariya
        if (this.state.marginTradingBit === 1) {
          this.props.getTradingLedgerDataList({
            OrderType: this.state.orderType,
            FromDate: this.state.start_date,
            ToDate: this.state.end_date,
            PageNo: this.state.PageNo - 1,
            PageSize: this.state.PageSize,
            IsMargin: 1
          });
          this.props.getTradePairs({ IsMargin: 1 });
        } else {
          this.props.getTradingLedgerDataList({
            OrderType: this.state.orderType,
            FromDate: this.state.start_date,
            ToDate: this.state.end_date,
            PageNo: this.state.PageNo - 1,
            PageSize: this.state.PageSize
          });
          this.props.getTradePairs({});
        }
        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        this.props.drawerClose();
      }
      this.setState({ notificationFlag: false });
    }
  }

  // used for close drawer
  closeAll = () => {
    this.props.closeAll();
    this.setState({ open: false });
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

  //render component for report
  render() {
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
        title: this.state.marginTradingBit === 1 ? <IntlMessages id="sidebar.marginTrading" /> : <IntlMessages id="sidebar.trading" />,
        link: '',
        index: 0
      },
      {
        title: <IntlMessages id="sidebar.trade-summary" />,
        link: '',
        index: 1
      },
      {
        title: <IntlMessages id="tradesummary.title.report" />,
        link: '',
        index: 2
      }
    ];

    const { drawerClose } = this.props;
    let data = this.state.tradingLedger;
    let start_row = data.length > 0 ? 1 : 0;
    if (this.state.ReportGuid !== "") {
      var menuPermissionDetail = this.checkAndGetMenuAccessDetail(this.state.ReportGuid);
    }
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
          <div className="jbs-page-content" >
            {this.props.menuLoading && <JbsSectionLoader />}
            <WalletPageTitle title={<IntlMessages id="tradesummary.title.report" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
            {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && // check for filter permission
              <JbsCollapsibleCard>
                <div className="top-filter">
                  <Form className="frm_search tradefrm row">
                    <FormGroup className="col-md-2 col-sm-4">
                      <Label for="startDate1">{<IntlMessages id="sidebar.tradingLedger.filterLabel.startDate" />}</Label>
                      <Input type="date" name="start_date" max={this.state.currentDate} value={this.state.start_date} id="startDate1" placeholder="dd/mm/yyyy" onChange={this.handleChange} />
                    </FormGroup>
                    <FormGroup className="col-md-2 col-sm-4">
                      <Label for="endDate1">{<IntlMessages id="sidebar.tradingLedger.filterLabel.endDate" />}</Label>
                      <Input type="date" name="end_date" max={this.state.currentDate} min={this.state.start_date} value={this.state.end_date} id="endDate1" placeholder="dd/mm/yyyy" onChange={this.handleChange} />
                    </FormGroup>
                    <FormGroup className="col-md-2 col-sm-4">
                      <Label for="Select-2">{<IntlMessages id="tradingLedger.filterLabel.userID" />}</Label>
                      <IntlMessages id="tradingLedger.filterLabel.userID">
                        {(placeholder) =>
                          <Input type="text" name="userID" id="User" value={this.state.userID} placeholder={placeholder} onChange={this.validateNumericValue} />
                        }
                      </IntlMessages>
                    </FormGroup>
                    <FormGroup className="col-md-2 col-sm-4">
                      <Label for="Select-2">{<IntlMessages id="tradingLedger.filterLabel.trnNo" />}</Label>
                      <IntlMessages id="tradingLedger.filterLabel.trnNo">
                        {(placeholder) =>
                          <Input type="text" name="trnNo" value={this.state.trnNo} id="trnNo" placeholder={placeholder} onChange={this.validateNumericValue} />
                        }
                      </IntlMessages>
                    </FormGroup>
                    <FormGroup className="col-md-2 col-sm-4">
                      <Label for="Select-2">{<IntlMessages id="sidebar.tradingLedger.filterLabel.type" />}</Label>
                      <div className="app-selectbox-sm">
                        <Input type="select" name="type" value={this.state.type} id="Select-2" onChange={this.handleChange}>
                          <IntlMessages id="tradingLedger.selectType">
                            {(selectType) =>
                              <option value="">{selectType}</option>
                            }
                          </IntlMessages>
                          <IntlMessages id="tradingLedger.selectType.buy">
                            {(buy) =>
                              <option value="buy">{buy}</option>
                            }
                          </IntlMessages>
                          <IntlMessages id="tradingLedger.selectType.sell">
                            {(sell) =>
                              <option value="sell">{sell}</option>
                            }
                          </IntlMessages>
                        </Input>
                      </div>
                    </FormGroup>
                    <FormGroup className="col-md-2 col-sm-4">
                      <Label for="Select-1">{<IntlMessages id="sidebar.tradingLedger.filterLabel.currencyPair" />}</Label>
                      <div className="app-selectbox-sm">
                        <Input type="select" name="pair" value={this.state.pair} id="Select-1" onChange={this.handleChange}>
                          <IntlMessages id="tradingLedger.selectCurrencyPair.all">
                            {(all) =>
                              <option value="">{all}</option>
                            }
                          </IntlMessages>

                          {this.state.pairList.map((currency, key) =>
                            <option key={key} value={currency.PairName}>{currency.PairName}</option>
                          )}
                        </Input>
                      </div>
                    </FormGroup>
                    <FormGroup className="col-md-2 col-sm-4">
                      <Label for="Select-2">{<IntlMessages id="tradingLedger.orderType.label" />}</Label>
                      <div className="app-selectbox-sm">
                        <Input type="select" name="orderType" value={this.state.orderType} id="Select-2" onChange={this.handleChangeOrder}>
                          <IntlMessages id="tradingLedger.orderType">
                            {(orderType) =>
                              <option value="">{orderType}</option>
                            }
                          </IntlMessages>
                          <IntlMessages id="tradingLedger.orderType.limit">
                            {(limit) =>
                              <option value="LIMIT">{limit}</option>
                            }
                          </IntlMessages>
                          <IntlMessages id="tradingLedger.orderType.market">
                            {(market) =>
                              <option value="MARKET">{market}</option>
                            }
                          </IntlMessages>
                          <IntlMessages id="tradingLedger.orderType.stopLimit">
                            {(stopLimit) =>
                              <option value="STOP_Limit">{stopLimit}</option>
                            }
                          </IntlMessages>
                          <IntlMessages id="tradingLedger.orderType.spot">
                            {(spot) =>
                              <option value="SPOT">{spot}</option>
                            }
                          </IntlMessages>
                        </Input>
                      </div>
                    </FormGroup>
                    <FormGroup className="col-md-2 col-sm-4">
                      <div className="btn_area">
                        <Button color="primary"
                          variant="raised" onClick={this.onApply}><IntlMessages id="widgets.apply" /></Button>
                        {this.state.showReset && <Button className="btn-danger text-white ml-10" onClick={this.onClear}><IntlMessages id="bugreport.list.dialog.button.clear" /></Button>}
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
                  <h5><IntlMessages id={this.state.reportTitle} /></h5>
                </div>
              </div>
              <Table hover className="mb-0" responsive>
                <thead>
                  <tr>
                    <th width="13%">
                      <IntlMessages id={"tradingLedger.tableHeading.trnNo"} />
                    </th>
                    <th width="13%">
                      <IntlMessages id={"tradingLedger.tableHeading.userID"} />
                    </th>
                    <th width="13%">
                      <IntlMessages id={"tradingLedger.tableHeading.pair"} />
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
                    <th width="13%">
                      <IntlMessages id={"sidebar.tradingLedger.tableHeading.amount"} />
                    </th>
                    <th width="13%">
                      <IntlMessages id={"tradingLedger.tableHeading.dateTime"} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ?
                    data.map((item, key) => (
                      <TradeSummaryCollapse key={key} data={item} onLoad={this.state.onLoad} />
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
            </Card>
            {/* </div> */}
            {data.length !== 0 &&
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
                  <span>{this.state.PageNo > 1 ? (start_row) + (this.state.PageSize * (this.state.PageNo - 1)) + ' - ' + ((this.state.PageSize * this.state.PageNo) > this.state.TotalCount ? (this.state.TotalCount) : (this.state.PageSize * this.state.PageNo)) : (start_row) + ' - ' + ((this.state.PageSize * this.state.PageNo) > this.state.TotalCount ? (this.state.TotalCount) : (this.state.PageSize * this.state.PageNo))} of {this.state.TotalCount} Records</span>
                </Col>
              </Row>
            }
          </div>
        </Scrollbars>
      </Fragment>
    );
  }
}

//class for collapsible data
class TradeSummaryCollapse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false
    };
  }

  //On collapse project description
  OnCollapseProject() {
    this.setState({
      collapse: this.state.collapse ? false : true
    });
  }

  //redner for collapsible data
  render() {
    const { data } = this.props;
    const { collapse } = this.state;
    return (
      <Fragment>
        <tr style={{ cursor: "pointer" }} onClick={() => this.OnCollapseProject()}>
          <td>{data.TrnNo}</td>
          <td>{data.MemberID}</td>
          <td>{data.PairName}</td>
          <td>{data.TrnType}</td>
          <td>{data.OrderType}</td>
          <td>{data.Price === 0 ? data.OrderType === "MARKET" ?
            <IntlMessages id="trading.admin.markets.tab.market" /> : data.Price : parseFloat(data.Price).toFixed(8)}</td>
          <td>{data.Amount ? parseFloat(data.Amount).toFixed(8) : 0}</td>
          <td>{data.TrnDate.replace('T', ' ').split('.')[0]}</td>
        </tr>
        {collapse && (
          <Fragment>
            <tr className="text-center">
              <td colSpan={8}>
                <Table hover className="mb-0 tradetable">
                  <thead>
                    <tr>
                      <th width="25%">
                        <IntlMessages id={"tradingLedger.tableHeading.trnNo"} />
                      </th>
                      <th width="25%">
                        <IntlMessages id={"tradingLedger.tableHeading.type"} />
                      </th>
                      <th width="25%">
                        <IntlMessages id={"sidebar.tradingLedger.tableHeading.price"} />
                      </th>
                      <th width="25%">
                        <IntlMessages id={"sidebar.tradingLedger.tableHeading.amount"} />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.Trades.map((info, i) => {
                      return [
                        <tr key={i} className="tradeexpansion">
                          <td>{info.TrnNo}</td>
                          <td>{info.TrnType}</td>
                          <td>{info.Price}</td>
                          <td>{info.Qty}</td>
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
const mapStateToProps = ({ tradeledger, tradeRecon, drawerclose, authTokenRdcer }) => {
  if (drawerclose.bit === 1) {
    setTimeout(function () {
      drawerclose.bit = 2
    }, 1000);
  }
  const { tradeLedgerList, loading, error, tradeLedgerBit, TotalCount, TotalPages } = tradeledger;
  const { pairList } = tradeRecon;
  const { menuLoading, menu_rights } = authTokenRdcer;
  return { tradeLedgerList, loading, pairList, error, tradeLedgerBit, TotalCount, TotalPages, drawerclose, menuLoading, menu_rights }
}

// export this component with action methods and props
export default connect(mapStateToProps, {
  getTradingLedgerDataList,
  getTradePairs,
  getMenuPermissionByID
})(TradingLedger);