// Component for User Trade Report  data by :tejas
// import react 
import React, { Component } from "react";

//import method for connect component
import { connect } from "react-redux";
import { Row, Col, FormGroup, Form, Label, Input } from "reactstrap";

// used for display data as a table
import MUIDataTable from "mui-datatables";

// import button
import Button from "@material-ui/core/Button";
import { NotificationManager } from "react-notifications";
import validator from "validator";
// intl messages
import IntlMessages from "Util/IntlMessages";

import Pagination from "react-js-pagination";

//used for display loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// import action for get trade pair list
import { getTradePairs } from "Actions/TradeRecon";

//Added By Tejas For Get Data With Saga
import { getTradeSummaryList } from "Actions/TradeSummary";

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
//Action methods..
import {
  getMenuPermissionByID
} from 'Actions/MyAccount';
//repost Guid select from here
const menuDetailArray = [
  // Margin Trading GUID
  { "GUID": 'ADC3FE10-7BE0-3B3E-1721-F4A8E3F64C65', "Report": '0E9A10AB-0700-1375-10DA-24053C1E5684' },
  { "GUID": '4AAC6558-A715-3E2C-5013-E807262A37E2', "Report": 'B230A7FB-59BE-5B3F-2125-FE0507213CBF' },
  { "GUID": '94BFA5CF-3636-4DAD-140D-FE1244B08627', "Report": '155251CD-11D1-2395-5101-D0BFCD134518' },
  { "GUID": '21131BC1-39E1-11A7-2E79-552FEEDE8B36', "Report": '3D8C536B-6EBB-76EC-5552-270C852F39EC' },
  { "GUID": '6FD8F734-9A58-7320-09D2-F9D95E439505', "Report": '48100575-5AB5-6631-A01B-AC8B607D37D7' },
  { "GUID": '9C773DD6-2880-8736-4249-236937D67B6A', "Report": '182039BB-477A-2FC4-A5A6-F81450601316' },
  { "GUID": 'B00B9D95-777B-1DC7-495C-B492AC3285AF', "Report": '90A2EBE1-2456-390B-854E-DDCAA72F888A' },
  { "GUID": 'A18142DB-9CA3-7CB3-7F05-C4CCB5B535B8', "Report": 'FECA44D0-065C-152F-3593-265F29EC6A42' },
  { "GUID": 'A73A5E71-5A00-8213-1D26-DC2118F50F84', "Report": '4C6B3CBD-4239-6804-5E65-56D8E97F2F91' },
  { "GUID": 'BD7C7694-7B6F-A3AD-2A81-8DCA4FF02AED', "Report": '8D9F638E-4102-03D8-2301-25E64B8549D7' },
  { "GUID": 'D10C73E2-4307-81A8-6FBB-BEF57F900E47', "Report": '43F10EC1-42D6-8E20-8FC7-F4EBC4A601B5' },
  { "GUID": 'F22E1B7B-701C-6483-1481-CEF239950A03', "Report": 'C1301B84-1426-9821-0136-9DAA4BAC73C8' },
  { "GUID": '47CD2D1A-3689-6EA2-7C6A-38A34768536F', "Report": '6630C987-8C2D-304A-7646-FC9243021552' },
  { "GUID": 'C58E63B3-028E-30CF-1889-FAD3930A57FF', "Report": '298E6904-5BBA-0ECE-5C4F-75E071CA2708' },
  { "GUID": '438E8DEE-2A48-8032-29B5-436B4B7DA16B', "Report": 'B5FCE139-2974-382F-8F92-8002965C20EC' },
  { "GUID": 'F38391B2-7290-3DD7-52EF-DA176D4E9CCE', "Report": '9C3E81BF-3F9B-405A-05B8-B78BA3213A13' },
  //trading GUID
  { "GUID": "0307DE59-9541-9B20-7C38-496D255518D5", "Report": 'D0701745-7C9D-8A46-34D6-8FF6B4728187' },
  { "GUID": "B86159E1-3FAB-048C-7546-67D208D76B57", "Report": 'DC9A1D11-197D-3AFE-A687-AA5BE8796857' },
  { "GUID": "1BDA8B61-5CC0-1350-A4E9-6A05685101B3", "Report": '36029CC0-8733-403A-7A24-ABB585543E2D' },
  { "GUID": "06AB8080-78B9-9E0E-1F66-FC4B459A02A3", "Report": '524030F7-2D8E-67B4-4A36-44D085A5275E' },
  { "GUID": "5CA221B0-9531-2DA3-95E3-02D08B024906", "Report": '949CE8F3-986A-6E47-61B2-C27B9E828643' },
  { "GUID": "EC35ED60-9495-8228-1697-512F204D7643", "Report": '3AF66B95-30A2-4924-34F1-D0876AEF8727' },
  { "GUID": "437A7069-80F6-6CEB-3287-F89912BC1C30", "Report": 'CF3058F0-32F2-48AC-355D-B0ADC5DA8E65' },
  { "GUID": "7E67C7BC-A584-25FC-9378-EDC84CB76386", "Report": '870631D8-0FD5-03F6-87E4-CE09A2D955F3' },
  { "GUID": "E2FB80F1-0D6C-61DC-8182-9E9A1234629D", "Report": '05798324-408D-91EB-2BB8-1532988E8982' },
  { "GUID": "85754218-025D-8ABB-0B93-2C7AFE7D8B99", "Report": '36E1DC47-2F60-1341-349C-CBE174951B29' },
  { "GUID": "98D05763-313F-87A3-8737-EA73F0511012", "Report": 'FFC3918E-76E1-97FC-0EAC-F1E8AE285A95' },
  { "GUID": "06A15A00-558F-3A26-16B9-F2FCDF1E3CB0", "Report": '24E5BC66-676C-3FE3-31C9-FDFB8732671D' },
  { "GUID": "66F94118-5748-7553-703F-2FC64C649DD6", "Report": 'E2B32D54-480E-5C14-358E-DD6C64948805' },
  { "GUID": "C41DDC8A-0A20-2B88-5BE9-7F8FB71C436D", "Report": '9F1E0341-28A6-1EC1-2970-E583B022851E' },
  { "GUID": "AFD56FD6-2579-5AEA-2897-A583EFFD4340", "Report": '3F4532E0-3FE8-82A0-1DD2-D89682A5544E' },
  { "GUID": "EB0E240B-6033-6D0A-243B-132376F929A3", "Report": '155A1F62-93A2-6795-A290-A3419D324651' },
  //My Account GUID  
  { "GUID": "8E2D2919-4DAA-3865-1BF8-BA28CF5E5293", "Report": '21266F65-0771-777D-44AD-77E8056C6BE3' },
  { "GUID": "E347E401-5386-97CC-802D-229CA6355FD6", "Report": '19CE8C9C-87AC-9970-4910-5D62EEE17B52' },
]
// component for User trade Report
class trade_data extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start_date: this.props.state ? this.props.state.start_date : new Date().toISOString().slice(0, 10),
      end_date: this.props.state ? this.props.state.end_date : new Date().toISOString().slice(0, 10),
      currentDate: new Date().toISOString().slice(0, 10),
      errors: "",
      name: this.props.state ? this.props.state.name : '',
      type: '',
      selectedUser: null,
      open: false,
      userrole: "Administrator",
      id: "",
      userID: '',
      trnNo: '',
      modal: false,
      currency: '',
      orderType: this.props.state ? this.props.state.orderType : '',
      reportTitle: this.props.state ? this.props.state.reportTitle : 'sidebar.TradeSummary.title',
      popoverOpen: false,
      popoverData: [],
      tradeSummary: [],
      onLoad: 1,
      status: '',
      pair: '',
      marketType: '',
      range: '',
      loading: false,
      pairList: [],
      currencyList: [],
      isChange: false,
      tradeSummaryBit: 0,
      TotalCount: 0,
      TotalPages: 0,
      start_row: 1,
      PageNo: 1,
      PageSize: AppConfig.totalRecordDisplayInList,
      //added by parth andhariya
      marginTradingBit: props.state.marginTradingBit,
      showReset: false,
      ReportGuid: "",
      menudetail: [],
      notificationFlag: true,
    };
    // Added by Khushbu Badheka D:01/02/2019
    this.initState = {
      start_date: this.props.state ? this.props.state.start_date : new Date().toISOString().slice(0, 10),
      end_date: this.props.state ? this.props.state.end_date : new Date().toISOString().slice(0, 10),
      currentDate: new Date().toISOString().slice(0, 10),
      errors: "",
      name: this.props.state ? this.props.state.name : '',
      type: '',
      selectedUser: null,
      open: false,
      userrole: "Administrator",
      id: "",
      userID: '',
      trnNo: '',
      modal: false,
      currency: '',
      orderType: this.props.state ? this.props.state.orderType : '',
      reportTitle: this.props.state ? this.props.state.reportTitle : 'sidebar.TradeSummary.title',
      popoverOpen: false,
      popoverData: [],
      tradeSummary: [],
      onLoad: 1,
      status: '',
      pair: '',
      marketType: '',
      range: '',
      loading: false,
      pairList: [],
      currencyList: [],
      isChange: false,
      tradeSummaryBit: 0,
      showReset: false,

    };
    this.handleChange = this.handleChange.bind(this);
    this.onClear = this.onClear.bind(this); // Added by Khushbu Badheka D:01/02/2019
    this.onApply = this.onApply.bind(this);
    this.handleChangeOrder = this.handleChangeOrder.bind(this)
  }

  // used for validate date is numeric or not
  validateNumericValue = event => {
    const regexNumeric = /^[0-9]+$/;
    if (validator.matches(event.target.value,regexNumeric) || event.target.value === '') {
      if (event.target.name === 'userID') {
        this.setState({ userID: event.target.value });
      } else if (event.target.name === 'trnNo') {
        this.setState({ trnNo: event.target.value });
      }
    }
  }

  //For handle Page Change
  handlePageChange = (pageNumber) => {
    this.setState({ PageNo: pageNumber, onLoad: 1 });
    //added by parth andhariya
    if (this.state.marginTradingBit === 1) {
      this.props.getTradeSummaryList({
        PageNo: pageNumber - 1,
        PageSize: this.state.PageSize,
        FromDate: this.state.start_date,
        ToDate: this.state.end_date,
        MarketType: this.state.orderType,
        IsMargin: 1
      });
    } else {
      this.props.getTradeSummaryList({
        PageNo: pageNumber - 1,
        PageSize: this.state.PageSize,
        FromDate: this.state.start_date,
        ToDate: this.state.end_date,
        MarketType: this.state.orderType,
      });
    }
  }

  // apply button used to call Trading ledger
  onApply(event) {
    if ((this.state.start_date !== '' && this.state.end_date == '') || (this.state.end_date !== '' && this.state.start_date == '')) {
      NotificationManager.error(<IntlMessages id="trading.openorders.dateselect" />, true);
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
      if (this.state.status) {
        makeLedgerRequest.Status = this.state.status;
      }
      if (this.state.userID) {
        makeLedgerRequest.MemberID = this.state.userID;
      }
      if (this.state.currency) {
        makeLedgerRequest.SMSCode = this.state.currency;
      }
      if (this.state.type) {
        makeLedgerRequest.Trade = this.state.type;
      }
      if (this.state.pair) {
        makeLedgerRequest.Pair = this.state.pair;
      }
      if (this.state.orderType) {
        makeLedgerRequest.MarketType = this.state.orderType;
      }
      if (this.state.PageNo > 1) {
        this.setState({ PageNo: 1 });
        makeLedgerRequest.PageNo = 0;
      }
      else {
        makeLedgerRequest.PageNo = this.state.PageNo - 1;
      }
      makeLedgerRequest.PageSize = this.state.PageSize;
      this.setState({ onLoad: 1, PageNo: 1, showReset: true })

      //added by parth andhariya
      if (this.state.marginTradingBit === 1) {
        makeLedgerRequest.IsMargin = 1;
        this.props.getTradeSummaryList(makeLedgerRequest);
      } else {
        this.props.getTradeSummaryList(makeLedgerRequest);
      }
    }
  }

  // Added by Khushbu Badheka D:01/02/2019
  // Clear button for reset input fields
  onClear() {
    this.setState(this.initState);
    //added by parth andhariya
    if (this.state.marginTradingBit === 1) {
      this.props.getTradeSummaryList({
        PageNo: 1,
        PageSize: this.state.PageSize,
        FromDate: this.initState.start_date,
        ToDate: this.initState.end_date,
        MarketType: this.initState.orderType,
        IsMargin: 1
      });
    } else {
      this.props.getTradeSummaryList({
        PageNo: 1,
        PageSize: this.state.PageSize,
        FromDate: this.initState.start_date,
        ToDate: this.initState.end_date,
        MarketType: this.initState.orderType
      });
    }
  }

  // used for set data when change components
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  //used for set order type
  handleChangeOrder(event) {
    if (event.target.value == '') {
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
    menuDetailArray.length && menuDetailArray.map((menuDetails, key) => {
      if (menuDetails.GUID.toLowerCase() === this.props.state.Guid.toLowerCase()) {
        this.setState({ ReportGuid: menuDetails.Report })
        this.props.getMenuPermissionByID(this.props.state.Guid); // get Trading menu permission

      }
    })
  }
  componentWillReceiveProps(nextprops) {
    //added by parth andhariya
    this.setState({ marginTradingBit: nextprops.state.marginTradingBit })
    if (this.state.TotalCount != nextprops.TotalCount) {
      this.setState({ TotalCount: nextprops.TotalCount })
    }
    if (this.state.TotalPages != nextprops.TotalPages) {
      this.setState({ TotalPages: nextprops.TotalPages })
    }
    //set pair list data    
    if (nextprops.pairList.length) {
      this.setState({
        pairList: nextprops.pairList
      })
    }
    if (nextprops.drawerclose.bit === 1 && nextprops.drawerclose.Drawersclose.open4 === false) {
      this.setState({
        open: false,
      })
    }
    // set order type
    if (nextprops.state.orderType !== this.state.orderType && this.state.isChange == false) {
      //added by parth andhariya
      if (this.state.marginTradingBit === 1) {
        this.props.getTradeSummaryList({
          PageNo: this.state.PageNo - 1,
          PageSize: this.state.PageSize,
          FromDate: this.state.start_date,
          ToDate: this.state.end_date,
          MarketType: nextprops.state.orderType,
          IsMargin: 1
        });
      } else {
        this.props.getTradeSummaryList({
          PageNo: this.state.PageNo - 1,
          PageSize: this.state.PageSize,
          FromDate: this.state.start_date,
          ToDate: this.state.end_date,
          MarketType: nextprops.state.orderType,
        });
      }
      this.setState({
        orderType: nextprops.state.orderType,
        onLoad: 1,
        PageNo: 1
      })
    }

    if (nextprops.state.reportTitle !== this.state.reportTitle && this.state.isChange == false) {
      this.setState({
        reportTitle: nextprops.state.reportTitle,
      })
    }

    // set trade sumary list for display report
    if (nextprops.tradeSummaryList && nextprops.error.length == 0 && this.state.tradeSummaryBit !== nextprops.tradeSummaryBit) {
      this.setState({
        tradeSummary: nextprops.tradeSummaryList,
        onLoad: 0,
        tradeSummaryBit: nextprops.tradeSummaryBit
      })
    }
    else if (nextprops.error.length !== 0 && nextprops.error.ReturnCode !== 0 && this.state.tradeSummaryBit !== nextprops.tradeSummaryBit) {
      // display error message if occured
      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.error.ErrorCode}`} />);
      this.setState({
        tradeSummary: [],
        onLoad: 0,
        tradeSummaryBit: nextprops.tradeSummaryBit
      })
    }
    /* update menu details if not set */
    if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
      if (nextprops.menu_rights.ReturnCode === 0) {
        this.setState({ onLoad: 1, PageNo: 1 });
        //added by parth andhariya
        if (this.state.marginTradingBit === 1) {
          this.props.getTradeSummaryList({
            PageNo: this.state.PageNo - 1,
            PageSize: this.state.PageSize,
            FromDate: this.state.start_date,
            ToDate: this.state.end_date,
            MarketType: this.state.orderType,
            IsMargin: 1
          });
          this.props.getTradePairs({ IsMargin: 1 });
        } else {
          this.props.getTradeSummaryList({
            PageNo: this.state.PageNo - 1,
            PageSize: this.state.PageSize,
            FromDate: this.state.start_date,
            ToDate: this.state.end_date,
            MarketType: this.state.orderType
          });
          this.props.getTradePairs({});
        }
        this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
      } else if (nextprops.menu_rights.ReturnCode !== 0) {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        this.props.drawerClose();
      }
      this.setState({ notificationFlag: false });
    }
  }

  // used for close drawer
  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false,
    });
  }

  // componentDidMount() {
  //   this.setState({ onLoad: 1, PageNo: 1 });
  //   //added by parth andhariya
  //   if (this.state.marginTradingBit === 1) {
  //     this.props.getTradeSummaryList({
  //       PageNo: this.state.PageNo - 1,
  //       PageSize: this.state.PageSize,
  //       FromDate: this.state.start_date,
  //       ToDate: this.state.end_date,
  //       MarketType: this.state.orderType,
  //       IsMargin: 1
  //     });
  //     this.props.getTradePairs({ IsMargin: 1 });
  //   } else {
  //     this.props.getTradeSummaryList({
  //       PageNo: this.state.PageNo - 1,
  //       PageSize: this.state.PageSize,
  //       FromDate: this.state.start_date,
  //       ToDate: this.state.end_date,
  //       MarketType: this.state.orderType
  //     });
  //     this.props.getTradePairs({});
  //   }
  // }
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
    const { drawerClose, closeAll } = this.props;
    const { menudetail } = this.props.state;
    // var menuPermissionDetail = { Utility: [], CrudOption: [] };
    // if (menuDetail.GUID !== undefined) {
    //   menuDetailArray.length && menuDetailArray.map((menuDetails, key) => {
    //     if (menuDetails === menuDetail.GUID) {
    //       menuPermissionDetail = checkAndGetMenuAccessDetail(menuDetails);//getting object detail for checking permissions
    //     }
    //   })
    //   // menuPermissionDetail = checkAndGetMenuAccessDetail(menuDetail.GUID);//getting object detail for checking permissions
    if (this.state.ReportGuid !== "") {
      var menuPermissionDetail = this.checkAndGetMenuAccessDetail(this.state.ReportGuid);
    }
    if (!menuPermissionDetail) {
      menuPermissionDetail = { Utility: [], CrudOption: [] }
    }

    if (this.state.tradeSummary.length === 0) {
      this.state.start_row = 0
    } else {
      this.state.start_row = 1
    }

    const columns = [
      {
        name: <IntlMessages id={"tradingLedger.filterLabel.trnNo"} />
      },
      {
        name: <IntlMessages id={"tradingLedger.filterLabel.userID"} />
      },
      {
        name: <IntlMessages id={"lable.TrnType"} />
      },
      {
        name: <IntlMessages id="exchangefeedConfig.list.column.label.ordertype" />,
      },
      {
        name: <IntlMessages id={"exchangefeedConfig.list.option.label.pair"} />
      },
      {
        name: <IntlMessages id={"sidebar.tradingLedger.tableHeading.price"} />
      },
      {
        name: <IntlMessages id={"sidebar.tradingLedger.tableHeading.amount"} />
      },
      {
        name: <IntlMessages id={"sidebar.tradingLedger.tableHeading.total"} />
      },
      {
        name: <IntlMessages id={"sidebar.tradingLedger.tableHeading.status"} />
      },
      {
        name: <IntlMessages id={"traderecon.list.column.label.date"} />
      }
    ];

    const options = {
      filterType: "dropdown",
      responsive: "scroll",
      selectableRows: false,
      download: false,
      viewColumns: false,
      print: false,
      search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
      sort: false,
      rowsPerPage: AppConfig.totalRecordDisplayInList,
      pagination: false,
      filter: false
    };
    return (
      <div className="responsive-table-wrapper jbs-page-content">
        {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
        <WalletPageTitle title={<IntlMessages id={this.props.state && this.props.state.title} />} breadCrumbData={this.props.state.BreadCrumbData} drawerClose={drawerClose} closeAll={closeAll} />
        {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && // check for filter permission
          <JbsCollapsibleCard>
          <div className="top-filter">
              <Form name="frm_search" className="tradefrm row">
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
                    <Label for="Select-2">{<IntlMessages id="sidebar.tradingLedger.filterLabel.status" />}</Label>
                    <div className="app-selectbox-sm">
                      <Input type="select" name="status" value={this.state.status} id="Select-2" onChange={this.handleChange}>
                        <IntlMessages id="sidebar.tradingLedger.filterLabel.status.selectStatus">
                          {(selectStatus) =>
                            <option value="">{selectStatus}</option>
                          }
                        </IntlMessages>
                        <IntlMessages id="tradingLedger.selectStatus.activeOrder">
                          {(activeOrder) =>
                            <option value="95">{activeOrder}</option>
                          }
                        </IntlMessages>
                        <IntlMessages id="tradingLedger.selectStatus.partialOrder">
                          {(partialOrder) =>
                            <option value="96">{partialOrder}</option>
                          }
                        </IntlMessages>
                        <IntlMessages id="tradingLedger.selectStatus.settledOrder">
                          {(settledOrder) =>
                            <option value="91">{settledOrder}</option>
                          }
                        </IntlMessages>
                        <IntlMessages id="tradesummary.title.cancelorder">
                          {(cancelorder) =>
                            <option value="93">{cancelorder}</option>
                          }
                        </IntlMessages>
                        <IntlMessages id="tradingLedger.selectStatus.systemFailed">
                          {(systemFailed) =>
                            <option value="94">{systemFailed}</option>
                          }
                        </IntlMessages>
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
                        <Button color="primary" variant="raised" className="text-white" onClick={this.onApply}><IntlMessages id="widgets.apply" /></Button>
                          {this.state.showReset && <Button className="ml-15 btn-danger text-white" onClick={this.onClear}><IntlMessages id="bugreport.list.dialog.button.clear" /></Button>}
                      </div>
                  </FormGroup>
                </Form>
          </div>              
        </JbsCollapsibleCard>
        }
        <JbsCollapsibleCard fullBlock>
          {this.state.tradeSummary.length > 0 &&
            <div className="StackingHistory">
              <MUIDataTable
                title={<IntlMessages id={this.props.state && this.state.reportTitle} />}
                data={this.state.tradeSummary.map((item, key) => {
                  return [
                    item.TrnNo,
                    item.MemberID,
                    item.Type,
                    item.OrderType,
                    item.PairName,
                    (item.Price === 0 ? item.OrderType === "MARKET" ?
                      <IntlMessages id="trading.admin.markets.tab.market" /> : item.Price : parseFloat(item.Price).toFixed(8)),
                    item.Amount ? parseFloat(item.Amount).toFixed(8) : 0,
                    item.Total ? parseFloat(item.Total).toFixed(8) : 0,
                    (<IntlMessages id={`myorders.response.status.${item.StatusCode}`} />),
                    item.DateTime.replace('T', ' ').split('.')[0]
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
                        itemsCountPerPage={this.state.PageSize}
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
                    <span>{this.state.PageNo > 1 ? (this.state.start_row) + (this.state.PageSize * (this.state.PageNo - 1)) + ' - ' + ((this.state.PageSize * this.state.PageNo) > this.state.TotalCount ? (this.state.TotalCount) : (this.state.PageSize * this.state.PageNo)) : (this.state.start_row) + ' - ' + ((this.state.PageSize * this.state.PageNo) > this.state.TotalCount ? (this.state.TotalCount) : (this.state.PageSize * this.state.PageNo))} of {this.state.TotalCount} Records</span>
                  </Col>
                </Row>
                :
                null
              }
            </div>
          }
        </JbsCollapsibleCard>
      </div>
    );
  }
}

const mapStateToProps = ({ tradeSummary, tradeRecon, drawerclose, authTokenRdcer }) => {
  const { tradeSummaryList, loading, error, tradeSummaryBit, TotalCount, TotalPages } = tradeSummary;
  const { menuLoading, menu_rights } = authTokenRdcer;
  const { pairList } = tradeRecon;
  if (drawerclose.bit === 1) {
    setTimeout(function () {
      drawerclose.bit = 2
    }, 1000);
  }
  return { tradeSummaryList, loading, error, tradeSummaryBit, TotalCount, TotalPages, pairList, drawerclose, menuLoading, menu_rights };
}

// export this component with action methods and props
export default connect(
  mapStateToProps,
  { getTradeSummaryList, getTradePairs, getMenuPermissionByID }
)(trade_data);
