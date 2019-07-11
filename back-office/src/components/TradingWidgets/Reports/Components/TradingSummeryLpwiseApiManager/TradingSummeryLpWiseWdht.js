// Component for Trade sumamry LP wise report by : Karan Joshi

// import react
import React, { Component, Fragment } from "react";
//scrollbar
import { Scrollbars } from "react-custom-scrollbars";
//import method for connect component
import { connect } from "react-redux";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
import validator from "validator";
// import pairlist data action
import { getTradePairs } from "Actions/TradeRecon";
// import components
import {
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  Row,
  Table,
  Card
} from "reactstrap";
import { getUserDataList } from "Actions/MyAccount";
import Select from "react-select";
import Button from "@material-ui/core/Button";
//import loader component
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
// import pairlist data action
import { getTradingSummeryLpwiseList } from "Actions/TradingSummeryLpWise";
//  Used For Display Notification
import { NotificationManager } from "react-notifications";
// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// intl messages
import IntlMessages from "Util/IntlMessages";
// Pagination
import Pagination from "react-js-pagination";
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';

//BreadCrumbData
const BreadCrumbData = [
  {
    title: <IntlMessages id="sidebar.app" />,
    link: "",
    index: 0
  },
  {
    title: <IntlMessages id="sidebar.dashboard" />,
    link: "",
    index: 0
  },
  {
    title: <IntlMessages id="sidebar.trading" />,
    link: "",
    index: 0
  },
  {
    title: <IntlMessages id="sidebar.reports" />,
    link: "",
    index: 1
  },
  {
    title: <IntlMessages id="sidebar.tradeRouting" />,
    link: "",
    index: 2
  }
];

class TradingSummaryLpWise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start_date: this.props.state ? this.props.state.FromDate : new Date().toISOString().slice(0, 10),
      end_date: this.props.state ? this.props.state.ToDate : new Date().toISOString().slice(0, 10),
      currentDate: new Date().toISOString().slice(0, 10),
      pair: "",
      status: "",
      TrnType: "",
      onLoad: 1,
      open: false,
      userID: "",
      trnNo: "",
      currency: "",
      orderType: this.props.state ? this.props.state.orderType : "",
      reportTitle: this.props.state ? this.props.state.reportTitle : "sidebar.tradeRouting",
      loading: false,
      pairList: [],
      tradingLedger: [],
      isChange: false,
      tradeLedgerlpBit: 0,
      TotalCount: 0,
      PageNo: 1,
      PageSize: AppConfig.totalRecordDisplayInList,
      start_row: 1,
      TotalPages: "0",
      LPType: "",
      userName: "",
      showReset: false,
      menudetail: [],
      notificationFlag: true,
    };

    this.initState = {
      start_date: this.props.state ? this.props.state.FromDate : new Date().toISOString().slice(0, 10),
      end_date: this.props.state ? this.props.state.ToDate : new Date().toISOString().slice(0, 10),
      currentDate: new Date().toISOString().slice(0, 10),
      pair: "",
      status: "",
      TrnType: "",
      onLoad: 1,
      open: false,
      userID: "",
      trnNo: "",
      currency: "",
      orderType: this.props.state ? this.props.state.orderType : "",
      reportTitle: this.props.state ? this.props.state.reportTitle : "sidebar.TradingLpwise",
      loading: false,
      pairList: [],
      tradingLedger: [],
      isChange: false,
      tradeLedgerlpBit: 0,
      TotalCount: 0,
      PageNo: 1,
      PageSize: AppConfig.totalRecordDisplayInList,
      LPType: "",
      userName: "",
      showReset: false,
      menudetail: [],
      notificationFlag: true,
    };

    this.onApply = this.onApply.bind(this);
    this.onClear = this.onClear.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeOrder = this.handleChangeOrder.bind(this);
  }

  validateNumericValue = event => {
    const regexNumeric = /^[0-9]+$/;
    if (validator.matches(event.target.value, regexNumeric) || event.target.value === "") {
      if (event.target.name === "userID") {
        this.setState({ userID: event.target.value });
      } else if (event.target.name === "trnNo") {
        this.setState({ trnNo: event.target.value });
      }
    }
  };

  handlePageChange = pageNumber => {
    if ((this.state.start_date !== "" && this.state.end_date == "") || (this.state.end_date !== "" && this.state.start_date == "")) {
      NotificationManager.error(<IntlMessages id="trading.openorders.dateselect" />);
    } else if (this.state.end_date < this.state.start_date) {
      NotificationManager.error(<IntlMessages id="trading.openorders.datediff" />);
    } else if (this.state.end_date > this.state.currentDate) {
      NotificationManager.error(<IntlMessages id="trading.openorders.endcurrentdate" />);
    } else if (this.state.start_date > this.state.currentDate) {
      NotificationManager.error(<IntlMessages id="trading.openorders.startcurrentdate" />);
    } else {
      var makeLedgerRequest = {
        FromDate: this.state.start_date,
        ToDate: this.state.end_date
      };
      if (this.state.trnNo) {
        makeLedgerRequest.TrnNo = this.state.trnNo;
      }
      if (this.state.status) {
        makeLedgerRequest.Status = this.state.status;
      }
      if (this.state.userID) {
        makeLedgerRequest.MemberID = this.state.userID;
      }
      if (this.state.currency) {
        makeLedgerRequest.SMSCode = this.state.currency;
      }
      if (this.state.TrnType) {
        makeLedgerRequest.TrnType = this.state.TrnType;
      }
      if (this.state.pair) {
        makeLedgerRequest.PairName = this.state.pair;
      }
      if (this.state.orderType) {
        makeLedgerRequest.OrderType = this.state.orderType;
      }
      if (this.state.LPType) {
        makeLedgerRequest.LPType = this.state.LPType;
      }
      makeLedgerRequest.PageNo = pageNumber - 1;
      makeLedgerRequest.PageSize = this.state.PageSize;

      this.setState({ onLoad: 1, PageNo: pageNumber });
      this.props.getTradingSummeryLpwiseList(makeLedgerRequest);
    }
  };

  onApply(event) {
    if ((this.state.start_date !== "" && this.state.end_date == "") || (this.state.end_date !== "" && this.state.start_date == "")) {
      NotificationManager.error(<IntlMessages id="trading.openorders.dateselect" />);
    } else if (this.state.end_date < this.state.start_date) {
      NotificationManager.error(<IntlMessages id="trading.openorders.datediff" />);
    } else if (this.state.end_date > this.state.currentDate) {
      NotificationManager.error(<IntlMessages id="trading.openorders.endcurrentdate" />);
    } else if (this.state.start_date > this.state.currentDate) {
      NotificationManager.error(<IntlMessages id="trading.openorders.startcurrentdate" />);
    } else {
      var makeLedgerRequest = {
        FromDate: this.state.start_date,
        ToDate: this.state.end_date
      };
      if (this.state.trnNo) {
        makeLedgerRequest.TrnNo = this.state.trnNo;
      }

      if (this.state.userID) {
        makeLedgerRequest.MemberID = this.state.userID;
      }

      if (this.state.TrnType) {
        makeLedgerRequest.TrnType = this.state.TrnType;
      }
      if (this.state.pair) {
        makeLedgerRequest.PairName = this.state.pair;
      }
      if (this.state.orderType) {
        makeLedgerRequest.OrderType = this.state.orderType;
      }
      if (this.state.LPType) {
        makeLedgerRequest.LPType = this.state.LPType;
      }
      if (this.state.PageNo > 1) {
        this.setState({ PageNo: 1 });
        makeLedgerRequest.PageNo = 0;
      } else {
        makeLedgerRequest.PageNo = this.state.PageNo - 1;
      }
      makeLedgerRequest.PageSize = this.state.PageSize;

      this.setState({ onLoad: 1, PageNo: 1, showReset: true });
      this.props.getTradingSummeryLpwiseList(makeLedgerRequest)
    }
  }

  onClear(event) {
    this.setState(this.initState);
    this.props.getTradingSummeryLpwiseList({
      FromDate: this.initState.start_date,
      ToDate: this.initState.end_date,
      OrderType: this.initState.orderType,
      LPType: this.initState.LPType,
      PageNo: this.initState.PageNo - 1,
      PageSize: this.initState.PageSize,
    });
  }

  //set state for input types
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  //set order type
  handleChangeOrder(event) {
    if (event.target.value === "") {
      this.setState({
        isChange: true,
        [event.target.name]: event.target.value,
        reportTitle: "sidebar.tradeRouting"
      });
    } else {
      this.setState({
        isChange: true,
        [event.target.name]: event.target.value,
        reportTitle: "tradesummary.title." + event.target.value
      });
    }
  }

  componentWillMount() {
    this.props.getMenuPermissionByID('89953702-A505-24CA-8C1C-730FF9F20758'); // get wallet menu permission
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
      this.setState({ open: false });
    }

    if (nextProps.onLoad === 1) {
      this.setState({ collapse: false });
    }

    if (this.state.TotalCount !== nextProps.TotalCount) {
      this.setState({ TotalCount: nextProps.TotalCount });
    }

    if (nextProps.hasOwnProperty('TotalPages') && this.state.TotalPages !== nextProps.TotalPages) {
      this.setState({ TotalPages: nextProps.TotalPages })
    }
    else {
      this.setState({ TotalPages: 0 })
    }


    if (nextProps.pairList.length) {
      this.setState({ pairList: nextProps.pairList });
    }

    if (nextProps.displayCustomerData && nextProps.error.length == 0 && this.state.tradeLedgerlpBit !== nextProps.tradeLedgerlpBit) {
      this.setState({
        tradingLedger: nextProps.displayCustomerData,
        onLoad: 0,
        tradeLedgerlpBit: nextProps.tradeLedgerlpBit
      });
    } else if (nextProps.error.length !== 0 && nextProps.error.ReturnCode !== 0 && this.state.tradeLedgerlpBit !== nextProps.tradeLedgerlpBit) {
      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextProps.error.ErrorCode}`} />);
      this.setState({
        tradingLedger: [],
        onLoad: 0,
        tradeLedgerlpBit: nextProps.tradeLedgerlpBit
      });
    }

    /* update menu details if not set */
    if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
      if (nextProps.menu_rights.ReturnCode === 0) {
        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
        this.setState({ onLoad: 1, PageNo: 1 });
        this.props.getUserDataList()
        this.props.getTradingSummeryLpwiseList({
          OrderType: this.state.orderType,
          LPType: this.state.LPType,
          FromDate: this.state.start_date,
          ToDate: this.state.end_date,
          PageNo: this.state.PageNo - 1,
          PageSize: this.state.PageSize
        });
        this.props.getTradePairs();
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
        this.setState({ notificationFlag: false });
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        this.props.drawerClose();
      }
    }
  }

  // used for close drawer
  closeAll = () => {
    this.props.closeAll();
    this.setState({ open: false });
  };

  onChangeSelectUser = (event) => {
    this.setState({ userID: (typeof (event.value) === "undefined" ? "" : event.value), userName: (typeof (event.label) === "undefined" ? "" : event.label) });
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
    const { drawerClose } = this.props;
    const data = this.state.tradingLedger;
    const userlist = this.props.getUser.hasOwnProperty('GetUserData') ? this.props.getUser.GetUserData : [];
    var menuPermissionDetail = this.checkAndGetMenuAccessDetail('1F0F3F44-02DE-6BDC-945F-9923E2E51176'); //1F0F3F44-02DE-6BDC-945F-9923E2E51176
    if (!menuPermissionDetail) {
      menuPermissionDetail = { Utility: [], CrudOption: [] }
    }
    let start_row = data.length > 0 ? 1 : 0;

    return (
      <Fragment>
        <Scrollbars
          className="jbs-scroll"
          autoHide
          autoHideDuration={100}
          style={{ height: "calc(100vh - 100px)" }}
        >
          <div
            className="charts-widgets-wrapper jbs-page-content"
            style={{ overflow: "hidden" }}
          >
            <WalletPageTitle title={<IntlMessages id="sidebar.tradeRouting" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
            <div className="transaction-history-detail">
              <div className="col-md-12">
                {menuPermissionDetail.Utility.indexOf('18736530') !== -1 &&
                  <JbsCollapsibleCard>
                    <div className="top-filter">
                      <Form className="tradefrm row">
                        <FormGroup className="col-md-2 col-sm-4">
                          <Label for="UserId"><IntlMessages id="my_account.userName" /></Label>
                          <Select
                            options={userlist.map((user) => ({
                              label: user.UserName,
                              value: user.Id,
                            }))}
                            onChange={this.onChangeSelectUser}
                            maxMenuHeight={200}
                            value={{ label: this.state.userName }}
                            placeholder={<IntlMessages id="sidebar.searchdot" />}
                          />
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                          <Label for="startDate1">
                            {
                              <IntlMessages id="sidebar.Tradingsummarylpwise.filterLabel.startDate" />
                            }
                          </Label>
                          <Input
                            type="date"
                            name="start_date"
                            value={this.state.start_date}
                            id="startDate1"
                            placeholder="dd/mm/yyyy"
                            max={this.state.currentDate}
                            onChange={this.handleChange}
                          />
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                          <Label for="endDate1">
                            {
                              <IntlMessages id="sidebar.Tradingsummarylpwise.filterLabel.endDate" />
                            }
                          </Label>
                          <Input
                            type="date"
                            name="end_date"
                            value={this.state.end_date}
                            id="endDate1"
                            placeholder="dd/mm/yyyy"
                            max={this.state.currentDate}
                            min={this.state.start_date}
                            onChange={this.handleChange}
                          />
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                          <Label for="Select-2">
                            {
                              <IntlMessages id="Tradingsummarylpwise.filterLabel.trnNo" />
                            }
                          </Label>
                          <IntlMessages id="Tradingsummarylpwise.filterLabel.trnNo">
                            {placeholder => (
                              <Input
                                type="text"
                                name="trnNo"
                                value={this.state.trnNo}
                                id="trnNo"
                                placeholder={placeholder}
                                onChange={this.validateNumericValue}
                              />
                            )}
                          </IntlMessages>
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                          <Label for="Select-2">
                            {
                              <IntlMessages id="sidebar.Tradingsummarylpwise.filterLabel.LPtype" />
                            }
                          </Label>
                          <div className="app-selectbox-sm">
                            <Input
                              type="select"
                              name="LPType"
                              value={this.state.LPType}
                              id="Select-1"
                              onChange={this.handleChange}
                            >
                              <IntlMessages id="Tradingsummarylpwise.selectType">
                                {selectType => (
                                  <option value="">{selectType}</option>
                                )}
                              </IntlMessages>
                              <IntlMessages id="Tradingsummarylpwise.form.option.Binance">
                                {Binance => <option value="9">{Binance}</option>}
                              </IntlMessages>
                              <IntlMessages id="Tradingsummarylpwise.form.option.Bittrex">
                                {Bittrex => <option value="10">{Bittrex}</option>}
                              </IntlMessages>
                              <IntlMessages id="Tradingsummarylpwise.form.option.TradeSatoshi">
                                {TradeSatoshi => <option value="11">{TradeSatoshi}</option>}
                              </IntlMessages>
                              <IntlMessages id="Tradingsummarylpwise.form.option.Poloniex">
                                {Poloniex => <option value="12">{Poloniex}</option>}
                              </IntlMessages>
                              <IntlMessages id="Tradingsummarylpwise.form.option.Coinbase">
                                {Coinbase => <option value="13">{Coinbase}</option>}
                              </IntlMessages>
                              <IntlMessages id="Tradingsummarylpwise.form.option.Erc20Withdraw">
                                {Erc20Withdraw => <option value="14">{Erc20Withdraw}</option>}
                              </IntlMessages>
                              <IntlMessages id="Tradingsummarylpwise.form.option.Twilio">
                                {Twilio => <option value="15">{Twilio}</option>}
                              </IntlMessages>
                            </Input>
                          </div>
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                          <Label for="Select-2">
                            {
                              <IntlMessages id="sidebar.Tradingsummarylpwise.filterLabel.type" />
                            }
                          </Label>
                          <div className="app-selectbox-sm">
                            <Input
                              type="select"
                              name="type"
                              value={this.state.type}
                              id="Select-2"
                              onChange={this.handleChange}
                            >
                              <IntlMessages id="Tradingsummarylpwise.selectType">
                                {selectType => (
                                  <option value="">{selectType}</option>
                                )}
                              </IntlMessages>
                              <IntlMessages id="Tradingsummarylpwise.selectType.buy">
                                {buy => <option value="buy">{buy}</option>}
                              </IntlMessages>
                              <IntlMessages id="Tradingsummarylpwise.selectType.sell">
                                {sell => <option value="sell">{sell}</option>}
                              </IntlMessages>
                            </Input>
                          </div>
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                          <Label for="Select-1">
                            {
                              <IntlMessages id="sidebar.Tradingsummarylpwise.filterLabel.currencyPair" />
                            }
                          </Label>
                          <div className="app-selectbox-sm">
                            <Input
                              type="select"
                              name="pair"
                              value={this.state.pair}
                              id="Select-1"
                              onChange={this.handleChange}
                            >
                              <IntlMessages id="Tradingsummarylpwise.selectCurrencyPair.all">
                                {all => <option value="">{all}</option>}
                              </IntlMessages>

                              {this.state.pairList.map((currency, key) => (
                                <option key={key} value={currency.PairName}>
                                  {currency.PairName}
                                </option>
                              ))}
                            </Input>
                          </div>
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                          <Label for="Select-2">
                            {
                              <IntlMessages id="Tradingsummarylpwise.orderType.label" />
                            }
                          </Label>
                          <div className="app-selectbox-sm">
                            <Input
                              type="select"
                              name="orderType"
                              value={this.state.orderType}
                              id="Select-2"
                              onChange={this.handleChangeOrder}
                            >
                              <IntlMessages id="Tradingsummarylpwise.orderType">
                                {orderType => (
                                  <option value="">{orderType}</option>
                                )}
                              </IntlMessages>
                              <IntlMessages id="Tradingsummarylpwise.orderType.limit">
                                {limit => (
                                  <option value="LIMIT">{limit}</option>
                                )}
                              </IntlMessages>
                              <IntlMessages id="Tradingsummarylpwise.orderType.market">
                                {market => (
                                  <option value="MARKET">{market}</option>
                                )}
                              </IntlMessages>
                              <IntlMessages id="Tradingsummarylpwise.orderType.stopLimit">
                                {stopLimit => (
                                  <option value="STOP_Limit">
                                    {stopLimit}
                                  </option>
                                )}
                              </IntlMessages>
                              <IntlMessages id="Tradingsummarylpwise.orderType.spot">
                                {spot => <option value="SPOT">{spot}</option>}
                              </IntlMessages>
                            </Input>
                          </div>
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                          <div className="btn_area">
                            <Button
                              color="primary"
                              variant="raised"
                              className="text-white"
                              onClick={this.onApply}
                            ><IntlMessages id="widgets.apply" /></Button>

                            {this.state.showReset &&
                              <Button className="btn-danger text-white ml-10" onClick={this.onClear}>
                                <IntlMessages id="bugreport.list.dialog.button.clear" />
                              </Button>}
                          </div>
                        </FormGroup>
                      </Form>
                    </div>
                  </JbsCollapsibleCard>
                }
              </div>
              {(this.props.loading || this.props.userListLoading || this.props.menuLoading) && <JbsSectionLoader />}
              <Card className="m-10">
                <div className="m-20 page-title d-flex justify-content-between align-items-center">
                  <div className="page-title-wrap">
                    <h5>
                      <IntlMessages id={this.state.reportTitle} />
                    </h5>
                  </div>
                </div>
                <Table hover className="mb-0" responsive>
                  <thead>
                    <tr>
                      <th width="13%">
                        <IntlMessages
                          id={"Tradingsummarylpwise.tableHeading.trnNo"}
                        />
                      </th>
                      <th width="13%">
                        <IntlMessages
                          id={"Tradingsummarylpwise.tableHeading.userID"}
                        />
                      </th>
                      <th width="13%">
                        <IntlMessages
                          id={"Tradingsummarylpwise.tableHeading.pair"}
                        />
                      </th>
                      <th width="13%">
                        <IntlMessages
                          id={"Tradingsummarylpwise.tableHeading.type"}
                        />
                      </th>
                      <th width="13%">
                        <IntlMessages
                          id={"Tradingsummarylpwise.tableHeading.orderType"}
                        />
                      </th>
                      <th width="13%">
                        <IntlMessages
                          id={
                            "sidebar.Tradingsummarylpwise.tableHeading.price"
                          }
                        />
                      </th>
                      <th width="13%">
                        <IntlMessages
                          id={
                            "sidebar.Tradingsummarylpwise.tableHeading.amount"
                          }
                        />
                      </th>
                      <th width="13%">
                        <IntlMessages
                          id={"Tradingsummarylpwise.tableHeading.dateTime"}
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((item, key) => (
                        <tr key={key}>
                          <td>{item.TrnNo}</td>
                          <td>{item.MemberID}</td>
                          <td>{item.PairName}</td>
                          <td>{item.Type}</td>
                          <td>{item.OrderType}</td>
                          <td>{item.Price == 0 ? price : parseFloat(item.Price).toFixed(8)}</td>
                          <td>{item.Amount ? parseFloat(item.Amount).toFixed(8) : 0}</td>
                          <td>{item.DateTime.replace("T", " ").split(".")[0]}</td>
                        </tr>
                      ))
                    ) : (
                        <tr className="text-center">
                          <td colSpan={8}>
                            <IntlMessages id="trading.market.label.nodata" />
                          </td>
                        </tr>
                      )}
                  </tbody>
                </Table>
              </Card>
            </div>
            {data.length !== 0 && (
              <Row>
                <Col md={5} className="mt-20">
                  <span>Total Pages :- {this.state.TotalPages}</span>
                </Col>
                <Col md={4} className="text-right">
                  <div id="pagination_div">
                    <Pagination
                      className="pagination"
                      activePage={this.state.PageNo}
                      itemsCountPerPage={this.state.PageSize}
                      totalItemsCount={this.props.TotalCount}
                      pageRangeDisplayed={5}
                      onChange={this.handlePageChange}
                      prevPageText="<"
                      nextPageText=">"
                      firstPageText="<<"
                      lastPageText=">>"
                    />
                  </div>
                </Col>
                <Col md={3} className="text-right mt-20">
                  <span>
                    {this.state.PageNo > 1
                      ? start_row +
                      this.state.PageSize * (this.state.PageNo - 1) +
                      " - " +
                      (this.state.PageSize * this.state.PageNo >
                        this.state.TotalCount
                        ? this.state.TotalCount
                        : this.state.PageSize * this.state.PageNo)
                      : start_row +
                      " - " +
                      (this.state.PageSize * this.state.PageNo >
                        this.state.TotalCount
                        ? this.state.TotalCount
                        : this.state.PageSize * this.state.PageNo)}{" "}
                    of {this.state.TotalCount} Records
                  </span>
                </Col>
              </Row>
            )}
          </div>
        </Scrollbars>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ TradingLpWise, actvHstrRdcer, tradeRecon, drawerclose, authTokenRdcer }) => {
  if (drawerclose.bit === 1) {
    setTimeout(function () {
      drawerclose.bit = 2
    }, 1000);
  }
  const {
    displayCustomerData,
    loading,
    error,
    tradeLedgerlpBit,
    TotalCount,
    TotalPages
  } = TradingLpWise;
  const { pairList } = tradeRecon;
  const { menuLoading, menu_rights } = authTokenRdcer;

  const { getUser } = actvHstrRdcer;
  const userListLoading = actvHstrRdcer.loading;

  return {
    displayCustomerData,
    loading,
    error,
    tradeLedgerlpBit,
    TotalCount,
    TotalPages,
    pairList,
    drawerclose,
    getUser,
    userListLoading,
    menuLoading,
    menu_rights
  };
};

export default connect(mapStateToProps, {
  getTradingSummeryLpwiseList,
  getTradePairs,
  getUserDataList,
  getMenuPermissionByID
})(TradingSummaryLpWise);