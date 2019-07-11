/* 
    Developer : Parth Andhariya
    Date : 17-06-2019
    File Comment : Provider ledger component
*/
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { FormGroup, Label, Input, Form } from "reactstrap";
import { injectIntl } from 'react-intl';
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import Select from "react-select";
import MUIDataTable from "mui-datatables";
import { changeDateFormat } from "Helpers/helpers";
import { NotificationManager } from 'react-notifications';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import {
    getProviderLedger,
    getProviderWallets
} from 'Actions/Arbitrage/ProviderLedger';
import { CustomFooter } from 'Components/MyAccount/Dashboards/Widgets/CustomFooter';
import AppConfig from 'Constants/AppConfig';
import { ListArbitrageCurrency } from 'Actions/Arbitrage/ArbitrageCurrencyConfiguration';
// Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
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
        title: <IntlMessages id="sidebar.Arbitrage" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="lable.ProviderLedger" />,
        link: '',
        index: 1
    },
];
const initState = {
    showReset: false,
    WalletUsageType: "",
    WalletTypeId: "",
    WalletId: "",
    walletLabel: null,
    FromDate: new Date().toISOString().slice(0, 10),
    ToDate: new Date().toISOString().slice(0, 10),
    Page: 1,
    PageSize: AppConfig.totalRecordDisplayInList,
    TotalCount: 0,
    Today: new Date().toISOString().slice(0, 10),
    menudetail: [],
    notificationFlag: true,
    Flag: false
}

class ProviderLedger extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
        this.handlePageChange = this.handlePageChange.bind(this);
    }
    getListFromServer = (Page, PageSize) => {
        var newObj = Object.assign({}, this.state);
        newObj['Page'] = Page > 0 ? Page : this.state.Page;
        newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.PageSize;
        this.setState(newObj);
        //For Action API...
        var reqObj = newObj;
        reqObj.Page = Page > 0 ? Page - 1 : 1;
        this.props.getProviderLedger(reqObj);
    }
    //action call from fatch wallet list
    componentWillMount() {
        this.props.getMenuPermissionByID('17C23F1F-A5D3-8A83-4AEB-9BD13B3F7A88'); // get wallet menu permission
    }
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.ListArbitrageCurrency({});
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        // will receive change totalcount
        if (this.state.TotalCount != nextProps.totalCount) {
            this.setState({ TotalCount: nextProps.totalCount });
        }
        // check ledger response 
        if (nextProps.ledgerResponse.hasOwnProperty('ReturnCode') && this.state.Flag) {
            this.setState({ Flag: false })
            if (nextProps.ledgerResponse.ReturnCode === 1) {
                const intl = this.props.intl;
                NotificationManager.error(intl.formatMessage({ id: `apiWalletErrCode.${nextProps.ledgerResponse.ErrorCode}` }));
            }
        }
    }
    //Pagination Change Method...
    handlePageChange(pageNumber) {
        this.getListFromServer(pageNumber);
    }
    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getListFromServer(1, event.target.value);
    };
    //change handler 
    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
        //onchange fetch wallets
        if (e.target.name === 'WalletUsageType') {
            this.setState({ walletLabel: null });
            this.props.getProviderWallets({
                SMSCode: this.state.WalletTypeId,
                Status: e.target.value
            });
        } else if (e.target.name === 'WalletTypeId') {
            this.setState({ walletLabel: null });
            this.props.getProviderWallets({
                SMSCode: e.target.value,
                Status: this.state.WalletUsageType
            });
        }
    }
    //onchange select user
    onChangeSelectWallet(e) {
        this.setState({ WalletId: e.value, walletLabel: { label: e.label } });
    }
    //   Apply Filter option
    applyFilter = () => {
        if (
            this.state.FromDate !== "" &&
            this.state.ToDate !== "" &&
            this.state.WalletId !== ""
        ) {
            this.getListFromServer(1, this.state.PageSize);
            this.setState({ showReset: true, Flag: true });
        }
    };
    //clear filter
    clearFilter = () => {
        let newObj = Object.assign({}, this.initState);
        newObj.menudetail = this.state.menudetail;
        this.setState(newObj);
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
    render() {
        /* check menu permission */
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('7161682E-9964-83B4-6146-15057C7C15DD'); //7161682E-9964-83B4-6146-15057C7C15DD
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const intl = this.props.intl;
        const columns = [
            {
                name: intl.formatMessage({ id: "lable.LedgerId" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.Amount" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "lable.CrAmount" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.DrAmount" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "lable.PreBal" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "lable.PostBal" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.Remarks" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.TrnDate" }),
                options: { sort: false, filter: false }
            },
        ];
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            download: false,
            viewColumns: false,
            filter: false,
            serverSide: true,
            page: this.state.Page,
            rowsPerPage: this.state.PageSize,
            count: this.state.TotalCount,
            search: false,// menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            textLabels: {
                body: {
                    noMatch: intl.formatMessage({ id: "wallet.emptyTable" }),
                    toolTip: intl.formatMessage({ id: "wallet.sort" }),
                }
            },
            customFooter: (count, page, rowsPerPage) => {
                var page1 = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page1} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
        };
        return (
            <div className="jbs-page-content drawer-data">
                {(this.props.menuLoading || this.props.loading) && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="lable.ProviderLedger" />} breadCrumbData={BreadCrumbData} drawerClose={this.props.drawerClose} closeAll={this.props.closeAll} />
                {menuPermissionDetail.Utility.indexOf('18736530') !== -1 &&
                    <JbsCollapsibleCard>
                        <div className="top-filter">
                            <Form className="tradefrm row">
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="FromDate">
                                        {intl.formatMessage({ id: "widgets.startDate" })}
                                    </Label>
                                    <Input
                                        type="date"
                                        name="FromDate"
                                        id="FromDate"
                                        placeholder="dd/mm/yyyy"
                                        value={this.state.FromDate}
                                        onChange={e => this.onChangeHandler(e)}
                                        max={this.state.Today}
                                    />
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="endDate">
                                        {intl.formatMessage({ id: "widgets.endDate" })}
                                    </Label>
                                    <Input
                                        type="date"
                                        name="ToDate"
                                        id="ToDate"
                                        placeholder="dd/mm/yyyy"
                                        value={this.state.ToDate}
                                        onChange={e => this.onChangeHandler(e)}
                                        max={this.state.Today}
                                    />
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="WalletTypeId">
                                        {intl.formatMessage({ id: "table.currency" })}
                                    </Label>
                                    <Input
                                        type="select"
                                        name="WalletTypeId"
                                        id="WalletTypeId"
                                        value={this.state.WalletTypeId}
                                        onChange={e => this.onChangeHandler(e)}
                                    >
                                        <option value="">{intl.formatMessage({ id: "wallet.errCurrency" })}</option>
                                        {this.props.ArbitrageCurrencyList.length > 0 &&
                                            this.props.ArbitrageCurrencyList.map((type, index) => (
                                                <option key={index} value={type.CoinName}>
                                                    {type.CoinName}
                                                </option>
                                            ))}
                                    </Input>
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="Select-1">
                                        {intl.formatMessage({ id: "wallet.lblUsageType" })}
                                    </Label>
                                    <Input
                                        type="select"
                                        name="WalletUsageType"
                                        id="WalletUsageType"
                                        value={this.state.WalletUsageType}
                                        onChange={e => this.onChangeHandler(e)}
                                    >
                                        <option value="">{intl.formatMessage({ id: "wallet.lblSelectUsageType" })}</option>
                                        <option value="0">{intl.formatMessage({ id: "wallet.lblTradingWallet" })}</option>
                                        <option value="1">{intl.formatMessage({ id: "wallet.lblMarketWallet" })}</option>
                                        <option value="2">{intl.formatMessage({ id: "wallet.lblColdWallet" })}</option>
                                        <option value="3">{intl.formatMessage({ id: "wallet.lblChargeWallet" })}</option>
                                        <option value="4">{intl.formatMessage({ id: "wallet.lblDepositionAdminWallet" })}</option>
                                    </Input>
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4 r_sel_20">
                                    <Label for="Select-1">
                                        {intl.formatMessage({ id: "sidebar.walletMenu" })}
                                    </Label>
                                    <Select
                                        options={this.props.ProviderWallets.map((wallet, i) => ({
                                            label: wallet.WalletName,
                                            value: wallet.WalletTypeID,
                                        }))}
                                        onChange={e => this.onChangeSelectWallet(e)}
                                        value={this.state.walletLabel}
                                        maxMenuHeight={200}
                                        placeholder={intl.formatMessage({ id: "sidebar.searchdot" })}
                                    />
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <div className="btn_area">
                                        <Button
                                            color="primary"
                                            variant="raised"
                                            disabled={(this.state.FromDate !== "" && this.state.ToDate !== "" && this.state.WalletId !== "") ? false : true}
                                            onClick={() => this.applyFilter()}
                                        >
                                            {intl.formatMessage({ id: "widgets.apply" })}
                                        </Button>
                                        {this.state.showReset && (
                                            <Button
                                                className="btn-danger text-white ml-15"
                                                onClick={e => this.clearFilter()}
                                            >
                                                {intl.formatMessage({ id: "bugreport.list.dialog.button.clear" })}
                                            </Button>
                                        )}
                                    </div>
                                </FormGroup>
                            </Form>
                        </div>
                    </JbsCollapsibleCard>
                }
                {this.props.ProviderLedgerList.length !== 0 && this.state.showReset === true && <div className="StackingHistory">
                    <MUIDataTable
                        title={this.props.title}
                        data={this.props.ProviderLedgerList.map(item => {
                            return [
                                item.LedgerId,
                                parseFloat(item.Amount).toFixed(8),
                                parseFloat(item.CrAmount).toFixed(8),
                                parseFloat(item.DrAmount).toFixed(8),
                                parseFloat(item.PreBal).toFixed(8),
                                parseFloat(item.PostBal).toFixed(8),
                                item.Remarks,
                                changeDateFormat(item.TrnDate, 'DD-MM-YYYY HH:mm:ss', false),
                            ];
                        })}
                        columns={columns}
                        options={options}
                    />
                </div>}
            </div>
        )
    }
}

const mapStateToProps = ({ ProviderLedgerReducer, authTokenRdcer, ArbitrageCurrencyConfigurationReducer }) => {
    const { loading, ProviderLedgerList, totalCount, ledgerResponse, ProviderWallets } = ProviderLedgerReducer;
    const { ArbitrageCurrencyList } = ArbitrageCurrencyConfigurationReducer;
    const { menuLoading, menu_rights } = authTokenRdcer;
    return { loading, ProviderLedgerList, totalCount, ledgerResponse, menuLoading, menu_rights, ArbitrageCurrencyList, ProviderWallets };
};

export default connect(mapStateToProps, {
    getMenuPermissionByID,
    getProviderLedger,
    getProviderWallets,
    ListArbitrageCurrency,
})(injectIntl(ProviderLedger));