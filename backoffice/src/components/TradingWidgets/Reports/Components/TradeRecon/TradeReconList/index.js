// Component For TradeRecon By Tejas Date : 8/10/2018

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

// import for jquery
import $ from 'jquery';

//used for drawer
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

import Select from "react-select";

// import for validate numeric value
import { validateOnlyAlphaNumeric } from "Validations/pairConfiguration";

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import Pagination from "react-js-pagination";
//  Used For Display Notification 
import { NotificationManager } from "react-notifications";

//used for design
import {
  Form,
  Label,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  FormGroup
} from "reactstrap";
import Button from "@material-ui/core/Button";

import { getUserDataList } from "Actions/MyAccount";

// used for loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// used for call actions
import { getTradeReconList, getTradePairs, setTradeRecon } from "Actions/TradeRecon";

// intl messages means convert text into selected languages
import IntlMessages from "Util/IntlMessages";

// used for Mui data table
import MUIDataTable from "mui-datatables";
import MatButton from "@material-ui/core/Button";

import EditData from '../TradeReconEdit'

import { changeDateFormat } from "Helpers/helpers";
import { injectIntl } from 'react-intl';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';

import AppConfig from 'Constants/AppConfig';

// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';

import classnames from "classnames";
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
    title: <IntlMessages id="sidebar.trading" />,
    link: '',
    index: 0
  },
  {
    title: <IntlMessages id="card.list.title.report" />,
    link: '',
    index: 1
  }, {
    title: <IntlMessages id="sidebar.tradeRecon" />,
    link: '',
    index: 2
  },
];

const actionsTypes = [
  {
    title: "label.dropdown.successAndDebit",
    value: 2
  },
  {
    title: "components.success",
    value: 3
  },
  {
    title: "apiplanconfiguration.title.inprocess",
    value: 4
  },
  {
    title: "emailQueueReport.status.fail",
    value: 5
  },
  {
    title: "emailAPIManager.button.cancel",
    value: 8
  },
  {
    title: "label.dropdown.forceCancel",
    value: 9
  }, {
    title: "apiconfiguration.list.column.label.status.inactive",
    value: 10
  },
  {
    title: "apiconfiguration.list.column.label.status.active",
    value: 11
  },
  {
    title: "sidebar.tradeRecon.ReleaseInProccess",
    value: 12
  },
  {
    title: "label.dropdown.reinit",
    value: 13
  }
]

// define Trade Recon List component
class TradeReconList extends Component {
  // make default state values on load
  constructor(props) {
    super();
    this.state = {
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date().toISOString().slice(0, 10),
      currentDate: new Date().toISOString().slice(0, 10),
      onLoad: 1,
      reconList: [],
      memberID: '',
      userID: '',
      TrnNo: '',
      status: '',
      pair: '',
      marketType: '',
      type: '',
      pairList: [],
      open: false,
      editData: [],
      PairName: '',
      TradeType: '',
      actionType: "",
      selectedTrnNo: 0,
      applyTradeRecon: 0,
      remarks: "",
      TotalCount: 0,
      TotalPages: 0,
      start_row: 1,
      Page_Size: AppConfig.totalRecordDisplayInList,
      PageNo: 1,
      LPType: "",
      currencyList: [],
      currency: "",
      inProgress: "",
      userName: "",
      showReset: false,
      menudetail: [],
      notificationFlag: true,
    };
  }

  toggleDrawer = () => {
    this.setState({
      open: !this.state.open,
      componentName: ''
    })
  }

  onChangeSelectUser = (event) => {
    this.setState({
      userID: (typeof (event.value) === "undefined" ? "" : event.value),
      userName: (typeof (event.label) === "undefined" ? "" : event.label)
    });
  }

  //For handle Page Change
  handlePageChange = (pageNumber) => {

    const Data = {
      MemberID: this.state.userID ? parseInt(this.state.userID) : 0,
      FromDate: this.state.start_date,
      ToDate: this.state.end_date,
      TrnNo: this.state.TrnNo ? parseInt(this.state.TrnNo) : 0,
      Status: this.state.status ? this.state.status : 0,
      SMSCode: this.state.currency,
      MarketType: this.state.marketType,
      Pair: this.state.pair,
      Trade: this.state.type,
      LPType: this.state.LPType ? this.state.LPType : 0,
      IsMargin: 0,
      IsProcessing: this.state.inProgress ? this.state.inProgress : 999,
      PageNo: pageNumber - 1,
      PageSize: this.state.Page_Size,
    };

    this.setState({ PageNo: pageNumber, onLoad: 1 });
    this.props.getTradeReconList(Data);
  }

  //set state for input types
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  //used for close drawer
  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false,
    });
  }
  componentWillMount() {
    this.props.getMenuPermissionByID('9D793056-3CD5-5244-2701-E0AC3D983EF5'); // get wallet menu permission
  }
  componentWillReceiveProps(nextprops) {

    if (nextprops.pairList) {
      this.setState({
        pairList: nextprops.pairList
      })
    }

    if (this.state.TotalCount != nextprops.TotalCount) {
      this.setState({ TotalCount: nextprops.TotalCount })
    }

    if (this.state.TotalPages != nextprops.TotalPages) {
      this.setState({ TotalPages: nextprops.TotalPages })
    }


    if (nextprops.tradeReconList && nextprops.tradeReconList.length > 0 && this.state.onLoad) {
      this.setState({
        reconList: nextprops.tradeReconList,
        onLoad: 0
      })
    } else if (nextprops.error && nextprops.error.ReturnCode == 1 && this.state.onLoad) {
      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.error.ErrorCode}`} />);
      this.setState({
        reconList: [],
        onLoad: 0
      })
    } else if (nextprops.error && nextprops.error.ReturnCode == 9 && this.state.onLoad) {
      NotificationManager.error(<IntlMessages id="error.trading.transaction.500" />);
      this.setState({
        reconList: [],
        onLoad: 0
      })
    }

    if (nextprops.tradeReconList == null) {
      NotificationManager.error(<IntlMessages id="sidebar.tradeRecon.noData" />);
      this.setState({
        reconList: [],
        onLoad: 0
      })
    }

    if (nextprops.drawerclose.bit === 1 && nextprops.drawerclose.Drawersclose.open3 === false) {
      this.setState({
        open: false,
      })
    }

    if (nextprops.setTradeReconList && nextprops.setTradeReconList.ReturnCode == 0 && this.state.applyTradeRecon == 1) {

      this.setState({
        applyTradeRecon: 0
      })
      this.closeTradeReconModal()
      const Data = {
        MemberID: this.state.userID ? parseInt(this.state.userID) : 0,
        FromDate: this.state.start_date,
        ToDate: this.state.end_date,
        TrnNo: this.state.TrnNo ? parseInt(this.state.TrnNo) : 0,
        Status: this.state.status ? this.state.status : 0,
        SMSCode: this.state.currency,
        MarketType: this.state.marketType,
        Pair: this.state.pair,
        Trade: this.state.type,
        LPType: this.state.LPType ? this.state.LPType : 0,
        IsMargin: 0,
        IsProcessing: this.state.inProgress ? this.state.inProgress : 999,
        PageNo: 0,
        PageSize: this.state.Page_Size,
      };
      this.setState({
        PageNo: 0,
        onLoad: 1
      })
      this.props.getTradeReconList(Data)
      NotificationManager.success(<IntlMessages id={`error.trading.transaction.${nextprops.setTradeReconList.ErrorCode}`} />);

    } else if (this.state.applyTradeRecon == 1 && nextprops.setTradeReconError && nextprops.setTradeReconError.ReturnCode == 1) {

      this.setState({
        applyTradeRecon: 0
      })
      this.closeTradeReconModal()
      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.setTradeReconError.ErrorCode}`} />);
    }
    /* update menu details if not set */
    if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
      if (nextprops.menu_rights.ReturnCode === 0) {
        this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
        this.setState({ onLoad: 1 })
        this.props.getUserDataList();
        this.props.getTradePairs({ IsMargin: 0 });
        const Data = {
          MemberID: this.state.userID ? parseInt(this.state.userID) : 0,
          FromDate: this.state.start_date,
          ToDate: this.state.end_date,
          TrnNo: this.state.TrnNo ? parseInt(this.state.TrnNo) : 0,
          Status: this.state.status ? this.state.status : 0,
          SMSCode: this.state.currency,
          MarketType: this.state.marketType,
          Pair: this.state.pair,
          Trade: this.state.type,
          LPType: this.state.LPType ? this.state.LPType : 0,
          IsMargin: 0,
          IsProcessing: this.state.inProgress ? this.state.inProgress : 999,
          PageNo: 0,
          PageSize: this.state.Page_Size,
        };
        this.setState({
          PageNo: 0
        })
        this.props.getTradeReconList(Data)
      } else if (nextprops.menu_rights.ReturnCode !== 0) {
        this.setState({ notificationFlag: false });
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        this.props.drawerClose();
      }
    }
  }

  // componentDidMount() {

  //   this.setState({ onLoad: 1 })
  //   this.props.getUserDataList();
  //   this.props.getTradePairs({ IsMargin: 0 });
  //   const Data = {
  //     MemberID: this.state.userID ? parseInt(this.state.userID) : 0,
  //     FromDate: this.state.start_date,
  //     ToDate: this.state.end_date,
  //     TrnNo: this.state.TrnNo ? parseInt(this.state.TrnNo) : 0,
  //     Status: this.state.status ? this.state.status : 0,
  //     SMSCode: this.state.currency,
  //     MarketType: this.state.marketType,
  //     Pair: this.state.pair,
  //     Trade: this.state.type,
  //     LPType: this.state.LPType ? this.state.LPType : 0,
  //     IsMargin: 0,
  //     IsProcessing: this.state.inProgress ? this.state.inProgress : 999,
  //     PageNo: 0,
  //     PageSize: this.state.Page_Size,
  //   };
  //   this.setState({
  //     PageNo: 0
  //   })
  //   this.props.getTradeReconList(Data)
  // }

  //cleear all fields
  onClear = event => {
    event.preventDefault();

    this.setState({
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date().toISOString().slice(0, 10),
      currentDate: new Date().toISOString().slice(0, 10),
      onLoad: 1,
      memberID: '',
      userID: "",
      TrnNo: '',
      status: '',
      pair: '',
      marketType: '',
      type: '',
      pairList: [],
      open: false,
      editData: [],
      PairName: '',
      TradeType: '',
      actionType: "",
      selectedTrnNo: 0,
      applyTradeRecon: 0,
      remarks: "",
      TotalCount: 0,
      TotalPages: 0,
      start_row: 1,
      Page_Size: AppConfig.totalRecordDisplayInList,
      PageNo: 1,
      LPType: "",
      currencyList: [],
      currency: "",
      inProgress: "",
      userName: "",
      showReset: false
    })
    const Data = {
      MemberID: 0,
      FromDate: new Date().toISOString().slice(0, 10),
      ToDate: new Date().toISOString().slice(0, 10),
      TrnNo: 0,
      Status: 0,
      SMSCode: "",
      MarketType: "",
      Pair: "",
      Trade: "",
      LPType: 0,
      IsMargin: 0,
      IsProcessing: 999,
      PageNo: 0,
      PageSize: AppConfig.totalRecordDisplayInList,
    };
    this.setState({
      PageNo: 0
    })
    this.props.getTradeReconList(Data)
  }

  // apply button for Fetch Trade Recon List
  onApply = event => {
    event.preventDefault();

    const Data = {
      MemberID: this.state.memberID ? parseInt(this.state.memberID) : 0,
      FromDate: this.state.start_date,
      ToDate: this.state.end_date,
      TrnNo: this.state.TrnNo ? parseInt(this.state.TrnNo) : 0,
      Status: this.state.status ? this.state.status : 0,
      SMSCode: this.state.currency,
      MarketType: this.state.marketType,
      Pair: this.state.pair,
      Trade: this.state.type,
      LPType: this.state.LPType ? this.state.LPType : 0,
      IsMargin: 0,
      IsProcessing: this.state.inProgress ? this.state.inProgress : 999,
      PageSize: this.state.Page_Size,
    };
    if ((this.state.start_date !== '' && this.state.end_date == '') || (this.state.end_date !== '' && this.state.start_date == '')) {

      NotificationManager.error(<IntlMessages id="trading.openorders.dateselect" />);
    } else if (this.state.end_date < this.state.start_date) {

      NotificationManager.error(<IntlMessages id="trading.openorders.datediff" />);
    } else if (this.state.end_date > this.state.currentDate) {

      NotificationManager.error(<IntlMessages id="trading.openorders.endcurrentdate" />);
    } else if (this.state.start_date > this.state.currentDate) {

      NotificationManager.error(<IntlMessages id="trading.openorders.startcurrentdate" />);
    } else {

      if (this.state.PageNo > 1) {
        this.setState({ PageNo: 1 });
        Data.PageNo = 0;
      }
      else {
        Data.PageNo = this.state.PageNo - 1;
      }

      this.setState({ onLoad: 1, PageNo: 1, showReset: true })
      this.props.getTradeReconList(Data);
    }

  };

  // used to handle change event of every input field and set values in states
  handleChangeFromDate = event => {
    this.setState({ start_date: event.target.value });
  };

  // used to handle change event of every input field and set values in states
  handleChangeToDate = event => {
    this.setState({ end_date: event.target.value });
  };

  handleChangeMemberId = (event) => {
    if ($.isNumeric(event.target.value)) {
      this.setState({ [event.target.name]: event.target.value });
    }
    if (event.target.value == "") {
      this.setState({ [event.target.name]: event.target.value });
    }
  }

  handleChangeTrnNo = (event) => {
    if ($.isNumeric(event.target.value)) {
      this.setState({ [event.target.name]: event.target.value });
    } else if (event.target.value === "") {
      this.setState({ [event.target.name]: event.target.value });
    }
  }

  handleChangeStatus = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleChangeMarketType = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  // handle actionbs types and set in state
  handleChangeActionType = (event, trnNo) => {
    this.setState({
      selectedTrnNo: trnNo,
      actionType: event.target.value
    })
  }

  //set state for order type
  handleChangeType = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  // call for trade recon
  ApplyTradeRecon = (menuAccessDetail) => {

    if (menuAccessDetail !== -1) {

      if (this.state.selectedTrnNo == "" || this.state.selectedTrnNo == 0) {

        NotificationManager.error(<IntlMessages id="sidebar.tradeRouting.label.trnno.noAvailable" />)
      } else if (this.state.actionType == "" || this.state.actionType == 0) {

        NotificationManager.error(<IntlMessages id="sidebar.tradeRouting.label.please.select.type" />)
      } else if (this.state.remarks == "" || this.state.remarks == null) {

        NotificationManager.error(<IntlMessages id="sidebar.tradeRecon.remarks.enter" />)
      } else {

        this.setState({
          applyTradeRecon: 1,
        })

        const data = {
          TranNo: this.state.selectedTrnNo,
          ActionType: this.state.actionType,
          ActionMessage: this.state.remarks
        }
        this.props.setTradeRecon(data)
      }

    }

  }

  // open modal for trade recon
  OpenTradeReconModal = () => {
    this.setState({
      modal: true,
      remarks: ""
    })
  }

  // close modal for trade recon
  closeTradeReconModal = () => {
    this.setState({
      modal: false,
      selectedTrnNo: 0,
      actionType: 0,
      remarks: ""
    })
  }

  // set data for textboxes in state and validate the value
  handleChangeData = event => {
    if (validateOnlyAlphaNumeric(event.target.value)) {
      this.setState({
        [event.target.name]: event.target.value,
      });
    } else if (event.target.value === "") {
      this.setState({
        [event.target.name]: event.target.value
      });
    }

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

    const intl = this.props.intl;
    const { drawerClose, closeAll } = this.props;

    var data = this.props.tradeReconList ? this.props.tradeReconList : []
    const userlist = this.props.getUser.hasOwnProperty('GetUserData') ? this.props.getUser.GetUserData : [];

    var menuPermissionDetail = this.checkAndGetMenuAccessDetail('01E902E9-969B-77B5-5279-7A8A61191AB4'); //01E902E9-969B-77B5-5279-7A8A61191AB4
    if (!menuPermissionDetail) {
      menuPermissionDetail = { Utility: [], CrudOption: [] }
    }

    const options = {
      filterType: "dropdown",
      responsive: "scroll",
      selectableRows: false,
      download: false,
      rowsPerPage: this.state.Page_Size,
      search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
      downloadOptions: {
        filename: 'Trade_Recon_List_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
      },
      pagination: false,
      sort: false,
      filter: false,
      print: false,
      viewColumns: false
    };

    // define columns for data tables
    const columns = [
      {
        name: intl.formatMessage({ id: "traderecon.list.column.label.trnno" })
      },
      {
        name: intl.formatMessage({ id: "compenets.username" })
      },
      {
        name: intl.formatMessage({ id: "traderecon.list.column.label.pair" })
      },
      {
        name: intl.formatMessage({ id: "traderecon.list.column.label.ordertype" })
      },
      {
        name: intl.formatMessage({ id: "wallet.orderType" })
      },
      {
        name: intl.formatMessage({ id: "widgets.price" })
      },
      {
        name: intl.formatMessage({ id: "traderecon.list.column.label.amount" })
      },
      {
        name: intl.formatMessage({ id: "label.column.settleamount" })
      },
      {
        name: intl.formatMessage({ id: "widgets.total" })
      },
      {
        name: intl.formatMessage({ id: "traderecon.list.column.label.status" })
      },
      {
        name: intl.formatMessage({ id: "label.column.dateCreated" })
      },
      {
        name: intl.formatMessage({ id: "traderecon.list.column.label.action" })
      },
      {
        //name: intl.formatMessage({ id: "traderecon.list.column.label.action" })
        name: ""
      },

    ];

    return (
      <Fragment>
        <div className="charts-widgets-wrapper jbs-page-content">

          <WalletPageTitle title={<IntlMessages id="sidebar.tradeRecon" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />

          {(this.props.loading || this.props.userListLoading || this.props.menuLoading) && <JbsSectionLoader />}
          <div className=" mb-10  Trade-Recon">

            {//menuPermissionDetail.Utility.indexOf('18736530') !== -1 &&
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
                            <IntlMessages id="traderecon.search.dropdown.label.fromdate" />
                          }
                        </Label>
                        <Input
                          type="date"
                          name="start_date"
                          value={this.state.start_date}
                          id="startDate1"
                          placeholder="dd/mm/yyyy"
                          max={this.state.currentDate}
                          onChange={this.handleChangeFromDate}
                        />
                       </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                        <Label for="endDate1">
                          {
                            <IntlMessages id="traderecon.search.dropdown.label.todate" />
                          }
                        </Label>
                        <Input
                          type="date"
                          name="end_date"
                          value={this.state.end_date}
                          id="endDate1"
                          max={this.state.currentDate}
                          min={this.state.start_date}
                          placeholder="dd/mm/yyyy"
                          onChange={this.handleChangeToDate}
                        />
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
                        <Label for="member_id">
                          {
                            <IntlMessages id="wallet.orderType" />
                          }
                        </Label>
                        <Input type="select" name="type" value={this.state.type} id="Select-2" onChange={this.handleChangeType}>
                          <IntlMessages id="traderecon.list.selectall">
                            {(select) =>
                              <option value="">{select}</option>
                            }
                          </IntlMessages>
                          <IntlMessages id="traderecon.list.buy">
                            {(buy) =>
                              <option value="buy">{buy}</option>
                            }
                          </IntlMessages>
                          <IntlMessages id="traderecon.list.sell">
                            {(sell) =>
                              <option value="sell">{sell}</option>
                            }
                          </IntlMessages>
                        </Input>
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
                        <Label for="trn_no">
                          {
                            <IntlMessages id="traderecon.list.column.label.trnno" />
                          }
                        </Label>
                        <Input
                          type="text"
                          name="TrnNo"
                          value={this.state.TrnNo}
                          id="TrnNo"
                          onChange={this.handleChangeTrnNo}
                        />
                       </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                        <Label for="status">
                          {
                            <IntlMessages id="traderecon.list.column.label.status" />
                          }
                        </Label>
                        <Input type="select" name="status" value={this.state.status} id="Select-2" onChange={this.handleChangeStatus}>
                          <IntlMessages id="traderecon.list.selectall">
                            {(select) =>
                              <option value="0">{select}</option>
                            }
                          </IntlMessages>
                          <IntlMessages id="components.success">
                            {(settle) =>
                              <option value="1">{settle}</option>
                            }
                          </IntlMessages>
                          <IntlMessages id="wallet.lblstatusSOperatorFail">
                            {(partial) =>
                              <option value="2">{partial}</option>
                            }
                          </IntlMessages>
                          <IntlMessages id="wallet.lblstatusSystemFail">
                            {(systemfail) =>
                              <option value="3">{systemfail}</option>
                            }
                          </IntlMessages>
                          <IntlMessages id="sidebar.hold">
                            {(activeorder) =>
                              <option value="4">{activeorder}</option>
                            }
                          </IntlMessages>
                          <IntlMessages id="sidebar.inActive">
                            {(activeorder) =>
                              <option value="9">{activeorder}</option>
                            }
                          </IntlMessages>
                        </Input>
                       </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                        <Label for="status">
                          {
                            <IntlMessages id="sidebar.report.tradeRecon.isProgress" />
                          }
                        </Label>
                        <Input type="select" name="inProgress" value={this.state.inProgress} id="Select-2" onChange={this.handleChangeStatus}>
                          <IntlMessages id="traderecon.list.selectall">
                            {(select) =>
                              <option value="999">{select}</option>
                            }
                          </IntlMessages>
                          <IntlMessages id="sidebar.report.tradeRecon.inprogress">
                            {(settle) =>
                              <option value="0">{settle}</option>
                            }
                          </IntlMessages>
                          <IntlMessages id="sidebar.report.tradeRecon.processed">
                            {(partial) =>
                              <option value="1">{partial}</option>}
                          </IntlMessages>

                        </Input>
                       </FormGroup>

                                    <FormGroup className="col-md-2 col-sm-4">
                        <Label for="market_type">
                          {
                            <IntlMessages id="traderecon.list.column.label.ordertype" />
                          }
                        </Label>
                        <Input type="select" name="marketType" value={this.state.marketType} id="Select-2" onChange={this.handleChangeMarketType}>
                          <IntlMessages id="traderecon.list.selectall">
                            {(select) =>
                              <option value="">{select}</option>
                            }
                          </IntlMessages>
                          <IntlMessages id="traderecon.list.limit">
                            {(limit) =>
                              <option value="Limit">{limit}</option>
                            }
                          </IntlMessages>
                          <IntlMessages id="traderecon.list.market">
                            {(market) =>
                              <option value="Market">{market}</option>
                            }
                          </IntlMessages>
                          <IntlMessages id="traderecon.list.stop_limit">
                            {(stoplimit) =>
                              <option value="STOP_Limit">{stoplimit}</option>
                            }
                          </IntlMessages>
                          <IntlMessages id="traderecon.list.stop">
                            {(stop) =>
                              <option value="STOP">{stop}</option>
                            }
                          </IntlMessages>
                        </Input>
                       </FormGroup>
                    <FormGroup className="col-md-2 col-sm-4">
                    <div className="btn_area">
                        <Button
                          color="primary"
                          variant="raised"
                          className="text-white"
                          onClick={this.onApply}
                        ><IntlMessages id="widgets.apply" /></Button>

                      {(this.state.showReset &&

                        <Button className="btn-danger text-white ml-10" onClick={this.onClear}>
                          <IntlMessages id="bugreport.list.dialog.button.clear" />
                          </Button>)}
                        </div>
                      </FormGroup>
                    </Form>
                   </div>
              </JbsCollapsibleCard>
            }

            {this.props.tradeReconList && this.props.tradeReconList.length > 0 ? (
              <div className="trade-recon-list-data">
                <MUIDataTable
                  title={<IntlMessages id="sidebar.tradeRecon.list" />}
                  data={this.props.tradeReconList.map(item => {
                    let Actions = item.ActionStage.split(',')
                    let types = []
                    Actions.map((action, key) => {
                      actionsTypes.map((act, key1) => {
                        if (action == act.value) {
                          types.push(act)
                        }
                      })
                    })

                    var status = item.IsCancelled == 1 ? intl.formatMessage({ id: 'myorders.response.tradeRecon.status.cancel' }) : intl.formatMessage({ id: `myorders.response.tradeRecon.status.${item.StatusCode}` })

                    return [
                      item.TrnNo,
                      item.UserName,
                      item.PairName,
                      item.Type,
                      item.OrderType,
                      item.Price.toFixed(8),
                      item.Amount.toFixed(8),
                      item.SettleQty.toFixed(8),
                      item.Total.toFixed(8),
                      <span className={classnames(
                        item.IsCancelled == 1 ? "badge badge-danger font-weight-bold" :
                          item.StatusCode == 1 ? "badge badge-success  font-weight-bold" :
                            item.StatusCode == 4 ? "badge badge-primary font-weight-bold" :
                              "badge badge-danger font-weight-bold"
                      )}> {status}</span>,
                      item.DateTime.replace('T', ' ').split('.')[0],

                      <div>
                        <Input type="select" name="actionType" id="Select-2" onChange={(event) => this.handleChangeActionType(event, item.TrnNo)}>
                          <IntlMessages id="traderecon.list.selectall">
                            {(select) =>
                              <option selected={this.state.selectedTrnNo == 0} value="">{select}</option>
                            }
                          </IntlMessages>
                          {types.map((currency, key) =>
                            (currency.value == 12 && item.IsProcessing == 0 ||
                              currency.value == 13 && item.IsAPITrade == 0) ?
                              null
                              :
                              <IntlMessages id={currency.title}>
                                {(successAndDebit) =>
                                  <option selected={(this.state.selectedTrnNo == item.TrnNo) && (currency.value == this.state.actionType)} value={currency.value}>{successAndDebit}</option>
                                }
                              </IntlMessages>
                          )}
                        </Input>
                      </div>,
                      <div>
                        <MatButton
                          variant="raised"
                          className="btn-primary text-white"
                          onClick={this.OpenTradeReconModal}
                          disabled={(this.state.selectedTrnNo !== item.TrnNo ||
                            this.state.actionType == "" || this.state.actionType == 0)}
                        >
                          <IntlMessages id="apiconfiguration.list.button.save" />
                        </MatButton>
                      </div>
                    ];
                  })}
                  columns={columns}
                  options={options}
                />
                {this.props.TotalCount > AppConfig.totalRecordDisplayInList ?
                  <Row>
                    <Col md={5} className="mt-20">
                      <span>Total Pages :- {this.state.TotalPages}</span>
                    </Col>
                    <Col md={4} className="text-right">
                      <div id="pagination_div">
                        <Pagination className="pagination"
                          activePage={this.state.PageNo}
                          itemsCountPerPage={this.state.Page_Size}
                          totalItemsCount={this.state.TotalCount}
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
                      <span>{this.state.PageNo > 1 ? (this.state.start_row) + (this.state.Page_Size * (this.state.PageNo - 1)) + ' - ' + ((this.state.Page_Size * this.state.PageNo) > this.state.TotalCount ? (this.state.TotalCount) : (this.state.Page_Size * this.state.PageNo)) : (this.state.start_row) + ' - ' + ((this.state.Page_Size * this.state.PageNo) > this.state.TotalCount ? (this.state.TotalCount) : (this.state.Page_Size * this.state.PageNo))} of {this.state.TotalCount} Records</span>
                    </Col>
                  </Row>
                  :
                  null
                }
              </div>
            ) : (
                ""
              )}
          </div>
        </div>

        <Drawer
          width="80%"
          handler={false}
          open={this.state.open}
          onMaskClick={this.toggleDrawer}
          className="drawer2"
          level=".drawer1"
          placement="right"
          levelMove={100}
        >
          <EditData {...this.props} editData={this.state.editData} TradeType={this.state.TradeType} Pair={this.state.PairName} drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
        </Drawer>

        <Modal isOpen={this.state.modal}>
          <h1 className="text-center mt-5">
            <IntlMessages id="sidebar.tradeRecon.title" />
          </h1>
          {this.props.setTradeReconLoading && <JbsSectionLoader />}
          <ModalBody>
            <Row className="m-10">
              <Label className="font-weight-bold">
                <IntlMessages id="wallet.lblRemarks" />
              </Label>
              <IntlMessages id="sidebar.tradeRecon.remarks.enter">
                {(placeholder) =>
                  <Input type="text"
                    name="remarks"
                    value={this.state.remarks}
                    onChange={this.handleChangeData}
                    placeholder={placeholder} ></Input>
                }
              </IntlMessages>

            </Row>
            <IntlMessages id="sidebar.tradeRecon.sure" />
          </ModalBody>

          <ModalFooter>
            <Button
              variant="raised"
              color="primary"
              className="text-white"
              onClick={() => this.ApplyTradeRecon()}
            >
              <span>
                <IntlMessages id="sidebar.tradeRecon.button.proceed" />
              </span>
            </Button>

            <Button
              variant="raised"
              onClick={() => this.closeTradeReconModal()}
              className="btn-danger text-white"
            >
              <span>
                <IntlMessages id="sidebar.btnClear" />
              </span>
            </Button>
          </ModalFooter>
        </Modal>

      </Fragment>
    );
  }
}

const mapStateToProps = ({ actvHstrRdcer, tradeRecon, drawerclose, tradingledger, authTokenRdcer }) => {
  const {
    tradeReconList,
    error,
    loading,
    pairList,
    setTradeReconList,
    setTradeReconError,
    setTradeReconLoading,
    TotalCount,
    TotalPages
  } = tradeRecon;
  if (drawerclose.bit === 1) {
    setTimeout(function () {
      drawerclose.bit = 2
    }, 1000);
  }

  const { getUser } = actvHstrRdcer;
  const { menuLoading, menu_rights } = authTokenRdcer;
  const userListLoading = actvHstrRdcer.loading;

  return {
    drawerclose,
    tradeReconList,
    error,
    loading,
    pairList,
    setTradeReconList,
    setTradeReconError,
    setTradeReconLoading,
    TotalCount,
    TotalPages,
    getUser,
    userListLoading,
    menuLoading,
    menu_rights
  };
}

// export this component with action methods and props
export default connect(
  mapStateToProps,
  {
    getTradeReconList,
    getTradePairs,
    setTradeRecon,
    getUserDataList,
    getMenuPermissionByID
  }
)(injectIntl(TradeReconList));
