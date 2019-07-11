// Component for Margin Trading Report  data by : Parth andhariya
// Date: 06-03-2019

// import react 
import React, { Component } from "react";
//import method for connect component
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
// used for display data as a table
import MUIDataTable from "mui-datatables";
import validator from "validator";
// import button
import MatButton from "@material-ui/core/Button";
//used for display loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
// import action for get trade pair list
import { getTradePairs } from "Actions/TradeRecon";
// import components
import { Form, Label, Input, FormGroup } from "reactstrap";
//Added By Tejas For Get Data With Saga
import { getTradeSummaryList } from "Actions/TradeSummary";
//  Used For Display Notification 
import { NotificationManager } from "react-notifications";
// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// intl messages
import IntlMessages from "Util/IntlMessages";
//classname for status button view
import classnames from "classnames";
// injectIntl messages
import { injectIntl } from 'react-intl';
import Pagination from "react-js-pagination";
//added by parth andhariya
import AppConfig from 'Constants/AppConfig';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';

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
        title: <IntlMessages id="sidebar.marginTrading" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="wallet.MarginTradingReport" />,
        link: '',
        index: 1
    },
];

/// component for User trade Report
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
            totalCount: 0,
            TotalPages: 0,
            start_row: 1,
            PageNo: 1,
            PageSize: AppConfig.totalRecordDisplayInList,
            today: new Date().toISOString().slice(0, 10),
            showReset: false,
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
            today: new Date().toISOString().slice(0, 10),
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
        if (validator.matches(event.target.value, regexNumeric) || event.target.value === '') {
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
        this.props.getTradeSummaryList({
            PageNo: pageNumber - 1,
            PageSize: this.state.PageSize,
            FromDate: this.state.start_date,
            ToDate: this.state.end_date,
            MarketType: this.state.orderType,
            IsMargin: 1
        });
    }

    // apply button used to call Trading ledger
    onApply(event) {
        if ((this.state.start_date !== '' && this.state.end_date === '') || (this.state.end_date !== '' && this.state.start_date === '')) {
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
                makeLedgerRequest.IsMargin = 1;
            }
            makeLedgerRequest.PageSize = this.state.PageSize;
            this.setState({ onLoad: 1, PageNo: 1, showReset: true })
            this.props.getTradeSummaryList(makeLedgerRequest);
        }
    }

    // Clear button for reset input fields
    onClear() {
        this.setState(this.initState);
        this.props.getTradeSummaryList({
            PageNo: 1,
            PageSize: this.state.PageSize,
            FromDate: this.initState.start_date,
            ToDate: this.initState.end_date,
            MarketType: this.initState.orderType,
            IsMargin: 1
        });
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState(this.initState)
    }

    // used for set data when change components
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    //used for set order type
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

    //component will mount fetch raw data...
    componentWillMount() {
        this.props.getMenuPermissionByID('DCB2260C-2612-0D3D-987A-5BFEFEFC2958'); // get wallet menu permission
    }

    componentWillReceiveProps(nextprops) {
        if (this.state.totalCount != nextprops.totalCount) {
            this.setState({ totalCount: nextprops.totalCount })
        }

        if (this.state.TotalPages != nextprops.TotalPages) {
            this.setState({ TotalPages: nextprops.TotalPages })
        }
        //set pair list data    
        if (nextprops.pairList.length) {
            this.setState({ pairList: nextprops.pairList })
            /* update menu details if not set */
            if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
                if (nextprops.menu_rights.ReturnCode === 0) {
                    this.setState({ onLoad: 1, PageNo: 1 });
                    this.props.getTradeSummaryList({
                        PageNo: this.state.PageNo - 1,
                        PageSize: this.state.PageSize,
                        FromDate: this.state.start_date,
                        ToDate: this.state.end_date,
                        MarketType: this.state.orderType,
                        IsMargin: 1
                    });
                    this.props.getTradePairs({ IsMargin: 1 });
                    this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
                } else if (nextprops.menu_rights.ReturnCode !== 0) {
                    NotificationManager.error(<IntlMessages id={"error.permission"} />);
                    this.props.drawerClose();
                }
                this.setState({ notificationFlag: false });
            }
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
        //added by parth andhariya
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('AB20EEEE-A3FF-4C4E-1F5E-FDB9D5CA2F61'); // margin_GUID AB20EEEE-A3FF-4C4E-1F5E-FDB9D5CA2F61
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const { drawerClose, intl } = this.props;
        let start_row = this.state.tradeSummary.length > 0 ? 1 : 0;
        
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
                name: <IntlMessages id={"sidebar.tradingLedger.tableHeading.status"} />,
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <span className={classnames({
                                "badge badge-danger": (value === 2 || value === 3),
                                "badge badge-success": (value === 1 || value === 4)
                            })} >
                                {intl.formatMessage({ id: "myorders.response.status." + value })}
                            </span>
                        );
                    }
                }
            },
            {
                name: <IntlMessages id={"traderecon.list.column.label.date"} />
            }
        ];
        const options = {
            search: false,
            sort: false,
            rowsPerPage: this.state.PageSize,
            pagination: false,
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            download: false,
            viewColumns: false,
            print: false,
            filter: false
        };
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="wallet.MarginTradingReport" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                {menuPermissionDetail.Utility.indexOf('18736530') !== -1 &&
                    <JbsCollapsibleCard>
                        <div className="top-filter">
                            <Form className="tradefrm row">
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="startDate1">{<IntlMessages id="sidebar.tradingLedger.filterLabel.startDate" />}</Label>
                                    <Input type="date" name="start_date" value={this.state.start_date} id="startDate1" placeholder="dd/mm/yyyy" max={this.state.today} onChange={this.handleChange} />
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="endDate1">{<IntlMessages id="sidebar.tradingLedger.filterLabel.endDate" />}</Label>
                                    <Input type="date" name="end_date" value={this.state.end_date} id="endDate1" placeholder="dd/mm/yyyy" max={this.state.today} onChange={this.handleChange} />
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="Select-2">{<IntlMessages id="tradingLedger.filterLabel.userID" />}</Label>
                                    <IntlMessages id="tradingLedger.filterLabel.userID">
                                        {(placeholder) =>
                                            <Input type="text" name="userID" id="User" value={this.state.userID} placeholder={placeholder} onChange={this.validateNumericValue} maxLength={10} />
                                        }
                                    </IntlMessages>
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="Select-2">{<IntlMessages id="tradingLedger.filterLabel.trnNo" />}</Label>
                                    <IntlMessages id="tradingLedger.filterLabel.trnNo">
                                        {(placeholder) =>
                                            <Input type="text" name="trnNo" value={this.state.trnNo} id="trnNo" placeholder={placeholder} onChange={this.validateNumericValue} maxLength={10} />
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
                                    <div className="btn_area m-0">
                                        <Label className="d-block">&nbsp;</Label>
                                        <MatButton variant="raised" className="btn-primary text-white" onClick={this.onApply} >
                                            <IntlMessages id="sidebar.tradingLedger.button.apply" />
                                        </MatButton>
                                        {/*Clear button added by Khushbu Badheka D:01/02/2019*/}
                                        {(this.state.showReset) &&
                                            <MatButton variant="raised" className="btn-danger text-white ml-10" onClick={this.onClear} >
                                                <IntlMessages id="sidebar.tradingLedger.button.clear" />
                                            </MatButton>
                                        }
                                    </div>
                                </FormGroup>
                            </Form>
                        </div>
                    </JbsCollapsibleCard>
                }
                <JbsCollapsibleCard fullBlock>
                    <div className="StackingHistory">
                        <MUIDataTable
                            data={this.state.tradeSummary.map((item, key) => {
                                {
                                    var price = item.OrderType == "MARKET" ?
                                        <IntlMessages id="trading.admin.markets.tab.market" /> : item.Price
                                }
                                return [
                                    item.TrnNo,
                                    item.MemberID,
                                    item.Type,
                                    item.OrderType,
                                    item.PairName,
                                    item.Price === 0 ? price : parseFloat(item.Price).toFixed(8),
                                    item.Amount ? parseFloat(item.Amount).toFixed(8) : 0,
                                    item.Total ? parseFloat(item.Total).toFixed(8) : 0,
                                    item.StatusCode,
                                    item.DateTime.replace('T', ' ').split('.')[0]
                                ];
                            })}
                            columns={columns}
                            options={options}
                        />
                        {this.state.totalCount > AppConfig.totalRecordDisplayInList &&
                            <Row>
                                <Col md={5} className="mt-20">
                                    <span>Total Pages :- {this.state.TotalPages}</span>
                                </Col>
                                <Col md={4} className="text-right">
                                    <div id="pagination_div">
                                        <Pagination className="pagination"
                                            activePage={this.state.PageNo}
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
                                    <span>{this.state.PageNo > 1 ? (start_row) + (this.state.PageSize * (this.state.PageNo - 1)) + ' - ' + ((this.state.PageSize * this.state.PageNo) > this.state.totalCount ? (this.state.totalCount) : (this.state.PageSize * this.state.PageNo)) : (start_row) + ' - ' + ((this.state.PageSize * this.state.PageNo) > this.state.totalCount ? (this.state.totalCount) : (this.state.PageSize * this.state.PageNo))} of {this.state.totalCount} Records</span>
                                </Col>
                            </Row>
                        }
                    </div>
                </JbsCollapsibleCard>
            </div>
        );
    }
}

// map states to props when changed in states from reducer
const mapStateToProps = state => ({
    tradeSummaryList: state.tradeSummary.tradeSummaryList,
    loading: state.tradeSummary.loading,
    error: state.tradeSummary.error,
    pairList: state.tradeRecon.pairList,
    tradeSummaryBit: state.tradeSummary.tradeSummaryBit,
    totalCount: state.tradeSummary.TotalCount,
    TotalPages: state.tradeSummary.TotalPages,
    menuLoading: state.authTokenRdcer.menuLoading,
    menu_rights: state.authTokenRdcer.menu_rights,

});

// export this component with action methods and props
export default connect(mapStateToProps,{
    getTradeSummaryList,
    getTradePairs,
    getMenuPermissionByID
})(injectIntl(trade_data));