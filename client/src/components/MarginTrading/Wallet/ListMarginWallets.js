/* 
    Developer : Nishant Vadgama
    Date : 19-02-2019
    File Comment : list & create a margin wallets
*/
import React, { Component, Fragment } from 'react';
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import classnames from "classnames";
import MUIDataTable from "mui-datatables";
import { connect } from 'react-redux';
import { changeDateFormat } from "Helpers/helpers";
// import CreateWallet from './CreateWallet';
import AddMarginBalance from './AddMarginBalance';
import Select from "react-select";
import IconButton from '@material-ui/core/IconButton';
import SwipeableViews from "react-swipeable-views";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Tooltip from '@material-ui/core/Tooltip';
import AppConfig from 'Constants/AppConfig';
import WithdrawMargin from './WithdrawMargin';
import {
    FormGroup,
    Label,
    Input,
    Button
} from "reactstrap";
import {
    getMaringWalletList
} from 'Actions/MarginTrading';
import {
    getCurrency,
} from "Actions/Withdraw";
import SiteTokenConversion from 'Components/SiteTokenConversion/index.js'
const initState = {
    WalletTypeObj: null,
    WalletTypeId: '',
    WalletUsageType: '',
    Status: '',
    UsageType: '',
    showReset: false,
    activeIndex: 0,
}

function TabContainer({ children }) {
    return (
        <Typography component="div">
            {children}
        </Typography>
    );
}

class ListMarginWallets extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }
    componentWillMount() {
        this.props.getCurrency();
        this.props.getMaringWalletList({});
    }
    /* on chane handler select search */
    onChangeSelectCurrency(e) {
        this.setState({ WalletTypeId: e.value, WalletTypeObj: { label: e.label } });
    }
    /* on change handler */
    onChangeHander(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    /* apply filter */
    applyFilter() {
        if (this.state.Status !== '' || this.state.WalletUsageType !== '' || this.state.WalletTypeId !== '') {
            this.props.getMaringWalletList({
                Status: this.state.Status,
                WalletUsageType: this.state.WalletUsageType,
                WalletTypeId: this.state.WalletTypeId
            });
            this.setState({ showReset: true });
        }
    }
    /* reset filter options */
    clearFilter() {
        this.setState(initState);
        this.props.getMaringWalletList({});
    }
    // change index
    handleChangeIndex(index) {
        this.setState({ activeIndex: index });
    }
    //show COnvert Token screen
    showCnvertToken(details) {
        this.props.history.push({ pathname: '/app/tokenConversion', state: { MarginWalletCurrency: details, IsMargin: true } });
    }
    render() {
        const { intl, walletList, loading } = this.props;
        var columns = [
            {
                name: intl.formatMessage({ id: "wallet.walletName" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "trading.holdingorder.label.balance" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "trading.holdingorder.label.currency" }),
                options: { filter: true, sort: true }
            },
            {
                name: intl.formatMessage({ id: "table.OutBoundBalance" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "table.InBoundBalance" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "wallet.DWTableStatus" }),
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <span className={classnames({
                                "badge badge-danger": (value === 0),
                                "badge badge-success": (value === 1)
                            })} >
                                {value ? intl.formatMessage({ id: "sidebar.btnEnable" }) : intl.formatMessage({ id: "sidebar.btnDisable" })}
                            </span>
                        );
                    }
                }
            },
            {
                name: intl.formatMessage({ id: "wallet.Role" }),
                options: { filter: true, sort: true }
            },
            // {
            //     name: intl.formatMessage({ id: "wallet.usageType" }),
            //     options: { filter: true, sort: true }
            // },
            {
                name: intl.formatMessage({ id: "components.expiryDate" }),
                options: { filter: false, sort: true }
            },
        ];
        var columnsMargin = [
            {
                name: intl.formatMessage({ id: "wallet.walletName" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "trading.holdingorder.label.balance" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "trading.holdingorder.label.currency" }),
                options: { filter: true, sort: true }
            },
            {
                name: intl.formatMessage({ id: "table.OutBoundBalance" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "table.InBoundBalance" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "wallet.DWTableStatus" }),
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <span className={classnames({
                                "badge badge-danger": (value === 0),
                                "badge badge-success": (value === 1)
                            })} >
                                {value ? intl.formatMessage({ id: "sidebar.btnEnable" }) : intl.formatMessage({ id: "sidebar.btnDisable" })}
                            </span>
                        );
                    }
                }
            },
            {
                name: intl.formatMessage({ id: "wallet.Role" }),
                options: { filter: true, sort: true }
            },
            // {
            //     name: intl.formatMessage({ id: "wallet.usageType" }),
            //     options: { filter: true, sort: true }
            // },
            {
                name: intl.formatMessage({ id: "components.expiryDate" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "sidebar.colActions" }),
                options: { filter: false, sort: false }
            },
        ]
        const options = {
            filterType: 'dropdown',
            responsive: 'scroll',
            selectableRows: false,
            download: false,
            viewColumns: false,
            print: false,
            filter: false,
            search: false,
            rowsPerPage: 100,
            textLabels: {
                body: {
                    noMatch: intl.formatMessage({ id: "wallet.emptyTable" }),
                    toolTip: intl.formatMessage({ id: "wallet.sort" }),
                }
            },
            // customToolbar: () => {
            //     return (
            //         <Fragment>
            //             <IconButton color="primary" aria-label="Refresh" onClick={(e) => this.props.getMaringWalletList({})}>
            //                 <i className="zmdi zmdi-refresh"></i>
            //             </IconButton>
            //             <AddMarginBalance {...this.props} widgetType={1} />
            //         </Fragment>
            //     );
            // },
        };
        return (
            <div className={this.props.darkMode ? 'DepositWithdrawHistory-darkmode tbl_overflow_auto' : 'DepositWithdrawHistory tbl_overflow_auto'}>
                {loading && <JbsSectionLoader />}
                <JbsCollapsibleCard>
                    <div className="top-filter row">
                        <FormGroup className="col-md-2 col-sm-4">
                            <Label for="WalletTypeId">{intl.formatMessage({ id: "trading.holdingorder.label.currency" })}</Label>
                            <Select
                                options={this.props.currencies.map((wallet, key) => ({
                                    label: wallet.SMSCode,
                                    value: wallet.WalletTypeID,
                                }))}
                                onChange={e => this.onChangeSelectCurrency(e)}
                                value={this.state.WalletTypeObj}
                                placeholder={intl.formatMessage({ id: "widgets.search" })}
                            />
                        </FormGroup>
                        {/* <FormGroup className="col-md-2 col-sm-4">
                            <Label for="WalletUsageType">{intl.formatMessage({ id: "wallet.usageType" })}</Label>
                            <Input
                                type="select"
                                name="WalletUsageType"
                                id="WalletUsageType"
                                value={this.state.WalletUsageType}
                                onChange={(e) => this.onChangeHander(e)}>
                                <option value="">{intl.formatMessage({ id: "wallet.selectUsageType" })}</option>
                                <option value="5">{intl.formatMessage({ id: "wallet.usagetypes.5" })}</option>
                                <option value="6">{intl.formatMessage({ id: "wallet.usagetypes.6" })}</option>
                                <option value="7">{intl.formatMessage({ id: "wallet.usagetypes.7" })}</option>
                            </Input>
                        </FormGroup> */}
                        <FormGroup className="col-md-2 col-sm-4">
                            <Label for="Status">{intl.formatMessage({ id: "wallet.DWTableStatus" })}</Label>
                            <Input
                                type="select"
                                name="Status"
                                id="Status"
                                value={this.state.Status}
                                onChange={(e) => this.onChangeHander(e)}>
                                <option value="">{intl.formatMessage({ id: "wallet.selectStatus" })}</option>
                                <option value="1">{intl.formatMessage({ id: "sidebar.btnEnable" })}</option>
                                <option value="0">{intl.formatMessage({ id: "sidebar.btnDisable" })}</option>
                            </Input>
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                            <div className="btn_area">
                                <Button color="primary" className={"border-0 rounded-0 " + ((this.state.Status !== '' || this.state.WalletUsageType !== '' || this.state.WalletTypeId !== '') ? "" : "disabled")} onClick={(e) => this.applyFilter(e)}>{intl.formatMessage({ id: "widgets.apply" })}</Button>
                                {this.state.showReset && <Button color="success" className="ml-15 border-0 rounded-0" onClick={(e) => this.clearFilter()}>{intl.formatMessage({ id: "button.clear" })}</Button>}
                            </div>
                        </FormGroup>
                    </div>
                </JbsCollapsibleCard>
                <JbsCollapsibleCard
                    colClasses="todo-wrapper"
                    fullBlock
                    customClasses="overflow-hidden"
                >
                    <div className="float-right px-20 py-5">
                        <IconButton color="primary" aria-label="Refresh" onClick={(e) => this.props.getMaringWalletList({})}>
                            <i className="zmdi zmdi-refresh"></i>
                        </IconButton>
                        <AddMarginBalance {...this.props} widgetType={1} />
                    </div>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={this.state.activeIndex}
                            onChange={(e, value) => this.handleChangeIndex(value)}
                            fullWidth
                            textColor="primary"
                            indicatorColor="primary"
                            centered
                        >
                            <Tab
                                label={intl.formatMessage({ id: "wallet.MarginWallets" })}
                                className="font-weight-bold"
                            />
                            <Tab
                                label={intl.formatMessage({ id: "wallet.SafetyWallets" })}
                                className="font-weight-bold"
                            />
                            <Tab
                                label={intl.formatMessage({ id: "wallet.ProfitWallets" })}
                                className="font-weight-bold"
                            />
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                        axis={"x"}
                        index={this.state.activeIndex}
                        onChangeIndex={index => this.handleChangeIndex(index)}
                    >
                        <TabContainer>
                            <MUIDataTable
                                data={walletList.filter(function (wallet) {
                                    return wallet.WalletUsageType === AppConfig.marginTradingWalletId;
                                }).map(wallet => {
                                    return [
                                        wallet.WalletName,
                                        parseFloat(wallet.Balance).toFixed(8),
                                        wallet.CoinName,
                                        parseFloat(wallet.OutBoundBalance).toFixed(8),
                                        parseFloat(wallet.InBoundBalance).toFixed(8),
                                        wallet.Status,
                                        wallet.RoleName,
                                        // intl.formatMessage({ id: "wallet.usagetypes." + wallet.WalletUsageType }),
                                        changeDateFormat(wallet.ExpiryDate, 'YYYY-MM-DD', false),
                                        <div className="list-action">
                                            <AddMarginBalance {...this.props} widgetType={2} walletTypeName={wallet.CoinName} />
                                            <WithdrawMargin  widgetType={2} walletTypeName={wallet.CoinName}/>
                                            <Tooltip title="Convert Token" placement="bottom">
                                                <a
                                                    href="javascript:void(0)"
                                                    onClick={e => this.showCnvertToken(wallet)}
                                                >
                                                    <i className="ti-link" />
                                                </a>
                                            </Tooltip>
                                        </div>
                                        
                                    ]
                                })}
                                columns={columnsMargin}
                                options={options}
                            />
                        </TabContainer>
                        <TabContainer>
                            <MUIDataTable
                                data={walletList.filter(function (wallet) {
                                    return wallet.WalletUsageType === AppConfig.marginSafetyWalletId;
                                }).map(wallet => {
                                    return [
                                        wallet.WalletName,
                                        parseFloat(wallet.Balance).toFixed(8),
                                        wallet.CoinName,
                                        parseFloat(wallet.OutBoundBalance).toFixed(8),
                                        parseFloat(wallet.InBoundBalance).toFixed(8),
                                        wallet.Status,
                                        wallet.RoleName,
                                        // intl.formatMessage({ id: "wallet.usagetypes." + wallet.WalletUsageType }),
                                        changeDateFormat(wallet.ExpiryDate, 'YYYY-MM-DD', false),
                                    ]
                                })}
                                columns={columns}
                                options={options}
                            />
                        </TabContainer>
                        <TabContainer>
                            <MUIDataTable
                                data={walletList.filter(function (wallet) {
                                    return wallet.WalletUsageType === AppConfig.marginProfitWalletId;
                                }).map(wallet => {
                                    return [
                                        wallet.WalletName,
                                        parseFloat(wallet.Balance).toFixed(8),
                                        wallet.CoinName,
                                        parseFloat(wallet.OutBoundBalance).toFixed(8),
                                        parseFloat(wallet.InBoundBalance).toFixed(8),
                                        wallet.Status,
                                        wallet.RoleName,
                                        // intl.formatMessage({ id: "wallet.usagetypes." + wallet.WalletUsageType }),
                                        changeDateFormat(wallet.ExpiryDate, 'YYYY-MM-DD', false),
                                    ]
                                })}
                                columns={columns}
                                options={options}
                            />
                        </TabContainer>
                    </SwipeableViews>
                </JbsCollapsibleCard>
            </div>
        )
    }
}
const mapDispatchToProps = ({ settings, WalletManagementReducer, withdrawApp }) => {
    const { darkMode } = settings;
    const { currencies } = withdrawApp;
    const { loading, walletList } = WalletManagementReducer;
    return { darkMode, loading, walletList, currencies };
}

export default connect(mapDispatchToProps, {
    getCurrency,
    getMaringWalletList
})(ListMarginWallets);