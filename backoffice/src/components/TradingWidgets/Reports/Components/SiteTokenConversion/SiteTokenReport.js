// Component For Site Token Conversion By Tejas 9/2/2019
import React, { Component, Fragment } from "react";

// used to connect store
import { connect } from "react-redux";

// used for jquery 
import $ from 'jquery';

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

//  Used For Display Notification 
import { NotificationManager } from "react-notifications";

import { getUserDataList } from "Actions/MyAccount";

import Select from "react-select";

// used for change date format
import { changeDateFormat } from "Helpers/helpers";

// import components
import { Form, Label, Input, FormGroup } from "reactstrap";

// displa loader 
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// intl messages means convert text into selected languages
import IntlMessages from "Util/IntlMessages";

// display mui data table 
import MUIDataTable from "mui-datatables";
import Button from "@material-ui/core/Button";

import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';

// convert message in saimple string
import { injectIntl } from 'react-intl';

//get data from currecy list and base currency list
import { getLedgerCurrencyList, getBaseCurrencyList } from "Actions/TradingReport";

//import action for get list 
import { getSiteTokenConversionList } from "Actions/SiteToken";

// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';

import AppConfig from 'Constants/AppConfig';
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
        title: <IntlMessages id="sidebar.siteTokenReport" />,
        link: '',
        index: 2
    },
];

// define Site Token Conversion component
class SiteTokenReport extends Component {
    // make default state values on load
    constructor(props) {
        super();
        this.state = {
            start_date: new Date().toISOString().slice(0, 10),
            end_date: new Date().toISOString().slice(0, 10),
            currentDate: new Date().toISOString().slice(0, 10),
            UserID: "",
            SourceCurrency: "",
            TargetCurrency: "",
            onLoad: 0,
            siteTokenConversionList: [],
            baseCurrencyList: [],
            currencyList: [],
            Page_Size: AppConfig.totalRecordDisplayInList,
            userName: "",
            showReset: false,
            menudetail: [],
            notificationFlag: true,
        };
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('0713516F-40A0-002A-8E69-95239B7F54E9'); // get wallet menu permission
    }
    // invoke when component get props
    componentWillReceiveProps(nextprops) {

        if (nextprops.drawerclose.bit === 1 && nextprops.drawerclose.Drawersclose.open3 === false) {
            this.setState({
                open: false,
            })
        }

        // set base currency list
        if (nextprops.baseCurrencyList) {
            this.setState({
                baseCurrencyList: nextprops.baseCurrencyList
            })
        }

        //set currency list
        if (nextprops.currencyList) {
            this.setState({
                currencyList: nextprops.currencyList
            })
        }

        //set siteTokenConversionList 
        if (nextprops.siteTokenConversionList.length > 0 && this.state.onLoad) {
            this.setState({
                siteTokenConversionList: nextprops.siteTokenConversionList,
                onLoad: 0
            })
        }

        if (nextprops.siteTokenConversionList.length == 0 && this.state.onLoad && nextprops.errorCode == 4501) {
            NotificationManager.error(<IntlMessages id="trading.market.label.nodata" />)
            this.setState({
                siteTokenConversionList: nextprops.siteTokenConversionList,
                onLoad: 0
            })
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextprops.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
                this.props.getLedgerCurrencyList({});
                this.props.getUserDataList();
                this.props.getBaseCurrencyList({ ActiveOnly: 1 })
            } else if (nextprops.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
    }

    // used to set currency id and currency name
    handleChangeCurrency = event => {

        if (event.target.value == '') {
            this.setState({
                SourceCurrency: event.target.value,
            })
        }

        this.state.currencyList.map((value, key) => {
            if (value.SMSCode === event.target.value) {
                if (this.state.TargetCurrency == value.SMSCode) {

                    NotificationManager.error(<IntlMessages id="sidebar.sitetoken.list.lable.enter.notsame.currency" />);
                } else {
                    this.setState({ SourceCurrency: event.target.value });
                }
            }
        })
    };

    // used to set base currency id and base currency name
    handleChangeBaseCurrency = event => {

        if (event.target.value == '') {
            this.setState({
                TargetCurrency: event.target.value,
            })
        }
        this.state.baseCurrencyList.map((value, key) => {
            if (value.CurrencyName == event.target.value) {
                if (this.state.SourceCurrency == value.CurrencyName) {

                    NotificationManager.error(<IntlMessages id="sidebar.sitetoken.list.lable.enter.notsame.currency" />);
                } else {
                    this.setState({
                        TargetCurrency: event.target.value,
                    })
                }
            }

        })
    }


    // invoke after render method
    // componentDidMount() {
    //     this.props.getLedgerCurrencyList({});
    //     this.props.getUserDataList();
    //     this.props.getBaseCurrencyList({ ActiveOnly: 1 })
    // }

    // clear all the filters
    onClear = event => {
        event.preventDefault();

        this.setState({
            UserID: "",
            start_date: "",
            end_date: "",
            SourceCurrency: "",
            TargetCurrency: "",
            onLoad: 0,
            siteTokenList: [],
            baseCurrencyList: [],
            currencyList: [],
            userName: "",
            siteTokenConversionList: [],
            showReset: false
        })
        this.props.getUserDataList();
    }
    // apply button for Fetch site token conversion
    onApply = event => {
        event.preventDefault();

        const Data = {
            UserID: this.state.UserID ? parseInt(this.state.UserID) : "",
            SourceCurrency: this.state.SourceCurrency,
            FromDate: this.state.start_date,
            ToDate: this.state.end_date,
            TargetCurrency: this.state.TargetCurrency
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
            this.setState({ onLoad: 1, showReset: true })
            this.props.getSiteTokenConversionList(Data)
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

    //used to set memberId data
    handleChangeMemberId = (event) => {
        if ($.isNumeric(event.target.value) || event.target.value == "") {
            this.setState({ [event.target.name]: event.target.value });
        }
    }

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

        const intl = this.props.intl;
        const { drawerClose, closeAll } = this.props;
        var data = this.state.siteTokenConversionList ? this.state.siteTokenConversionList : []

        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('68031806-A153-A5CE-4565-431E2DACA612'); //68031806-A153-A5CE-4565-431E2DACA612
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

        const userlist = this.props.getUser.hasOwnProperty('GetUserData') ? this.props.getUser.GetUserData : [];

        const options = {
            filterType: "dropdown",
            responsive: "stacked",
            selectableRows: false,
            sort: false,
            download: false,
            rowsPerPage: this.state.Page_Size,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            downloadOptions: {
                filename: 'site_Token_conversion_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
        };

        // define columns for data tables
        const columns = [
            {
                name: intl.formatMessage({ id: "tradingLedger.filterLabel.userID" })
            },

            {
                name: intl.formatMessage({ id: "sidebar.siteTokenReport.walletcurrency" })
            },
            {
                name: intl.formatMessage({ id: "sidebar.siteTokenReport.tocurrency" })
            },
            {
                name: intl.formatMessage({ id: "sidebar.siteTokenReport.srcqty" })
            },
            {
                name: intl.formatMessage({ id: "sidebar.siteTokenReport.targetqty" })
            },
            {
                name: intl.formatMessage({ id: "sidebar.siteTokenReport.tokenprice" })
            },
            {
                name: intl.formatMessage({ id: "tradingLedger.tableHeading.dateTime" })
            }
        ];

        return (
            <Fragment>
                <div className="charts-widgets-wrapper jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id="sidebar.siteTokenReport" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                    {(this.props.userListLoading || this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                    <div className=" mb-10">
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
                                                placeholder="dd/mm/yyyy"
                                                max={this.state.currentDate}
                                                min={this.state.start_date}
                                                onChange={this.handleChangeToDate}
                                            />
                                        </FormGroup>

                                        <FormGroup className="col-md-2 col-sm-4">
                                            <Label for="curency">
                                                {<IntlMessages id="sidebar.siteTokenReport.walletcurrency" />}
                                            </Label>

                                            <Input
                                                type="select"
                                                name="currency"
                                                value={this.state.SourceCurrency}
                                                onChange={(e) => this.handleChangeCurrency(e)}
                                            >
                                                <IntlMessages id="sidebar.sitetoken.list.lable.enter.select">
                                                    {(select) =>
                                                        <option value="">{select}</option>
                                                    }
                                                </IntlMessages>

                                                {this.state.currencyList.length && this.state.currencyList.map((item, key) => (
                                                    <option
                                                        value={item.SMSCode}
                                                        key={key}
                                                    >
                                                        {item.SMSCode}
                                                    </option>
                                                ))}
                                            </Input>
                                        </FormGroup>
                                        <FormGroup className="col-md-2 col-sm-4">
                                            <Label for="basecurency">
                                                {<IntlMessages id="sidebar.siteTokenReport.tocurrency" />}
                                            </Label>

                                            <Input
                                                type="select"
                                                name="basecurrency"
                                                value={this.state.TargetCurrency}
                                                onChange={(e) => this.handleChangeBaseCurrency(e)}
                                            >
                                                <IntlMessages id="sidebar.sitetoken.list.lable.enter.select">
                                                    {(select) =>
                                                        <option value="">{select}</option>
                                                    }
                                                </IntlMessages>

                                                {this.state.baseCurrencyList.length && this.state.baseCurrencyList.map((item, key) => (
                                                    <option
                                                        value={item.CurrencyName}
                                                        key={key}
                                                    >
                                                        {item.CurrencyName}
                                                    </option>
                                                ))}
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

                        {data.length ? (
                            <MUIDataTable
                                title={<IntlMessages id="sidebar.siteTokenReport" />}
                                data={data.map(item => {
                                    return [
                                        item.UserID,
                                        item.SourceCurrency,
                                        item.TargerCurrency,
                                        item.SourceCurrencyQty,
                                        item.TargetCurrencyQty,
                                        item.TokenPrice,
                                        item.TrnDate.replace('T', ' ').split('.')[0]
                                    ];
                                })}
                                columns={columns}
                                options={options}
                            />
                        ) : (
                                ""
                            )}
                    </div>
                </div>

            </Fragment>
        );
    }
}

const mapStateToProps = ({ actvHstrRdcer, tradingledger, siteTokenConversion, drawerclose, authTokenRdcer }) => {
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { currencyList, baseCurrencyList } = tradingledger;
    const { siteTokenConversionList, errorCode, loading } = siteTokenConversion;
    const { menuLoading, menu_rights } = authTokenRdcer;

    const { getUser } = actvHstrRdcer;
    const userListLoading = actvHstrRdcer.loading;

    return { getUser, userListLoading, currencyList, baseCurrencyList, loading, siteTokenConversionList, errorCode, drawerclose, menuLoading, menu_rights };
}

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        getLedgerCurrencyList,
        getBaseCurrencyList,
        getSiteTokenConversionList,
        getUserDataList,
        getMenuPermissionByID
    }
)(injectIntl(SiteTokenReport));
