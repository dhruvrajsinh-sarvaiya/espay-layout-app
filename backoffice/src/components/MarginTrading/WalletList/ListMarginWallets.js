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
import { injectIntl } from 'react-intl';
import Select from "react-select";
import IconButton from '@material-ui/core/IconButton';
import SwipeableViews from "react-swipeable-views";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Tooltip from '@material-ui/core/Tooltip';
import AppConfig from 'Constants/AppConfig';
import IntlMessages from "Util/IntlMessages";
import { getUserDataList } from "Actions/MyAccount";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { getUserMarginWallets } from "Actions/MarginTrading/WalletLedgerReport";
import { CustomFooter } from 'Components/MyAccount/Dashboards/Widgets/CustomFooter';
import {
    FormGroup,
    Label,
    Input,
    Button
} from "reactstrap";
import {
    getMaringWalletList
} from 'Actions/MarginTrading/MarginWallet';
import { getWalletType } from "Actions/WalletUsagePolicy";

const initState = {
    WalletTypeObj: null,
    WalletTypeId: '',
    WalletUsageType: '',
    Status: '',
    UsageType: '',
    WalletId: '',
    WalletName: "",
    // AccWalletId:"",
    showReset: false,
    // activeIndex: 0,
    PageNo: 1,
    PageSize: AppConfig.totalRecordDisplayInList,
    TotalCount: 0,
    UserLabel: null,
    UserId: "",
    visible: false,
}

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
        title: <IntlMessages id="wallet.wallets" />,
        link: '',
        index: 1
    },
];

class ListMarginWallets extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    //serveride pagination form API...
    getListFromServer = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.PageNo;
        if (PageSize > 0) {
            newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.PageSize;
        }
        this.setState(newObj);
        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        this.props.getMaringWalletList(reqObj);
    }

    componentWillMount() {
        this.props.getUserDataList();
        this.props.getWalletType({ Status: 1 });
        this.getListFromServer(this.state.PageNo, this.state.PageSize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
            })
        }
        if (this.state.TotalCount !== nextProps.TotalCount) {
            this.setState({ TotalCount: nextProps.TotalCount })
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

    /* on chane handler select search */
    onChangeSelectCurrency(e) {
        this.setState({ WalletTypeId: e.value, WalletTypeObj: { label: e.label } });
    }
    //onchange select user
    onChangeSelectUser(e) {
        if (e.value !== undefined && e.value !== "") {
            this.setState({ UserId: e.value, UserLabel: { label: e.label }, visible: true, WalletName: "" });
            this.props.getUserMarginWallets({ UserId: e.value })
        } else {
            this.setState({ visible: false, WalletName: "", UserId: e.value, UserLabel: { label: e.label }, })
        }
    }
    //onchange select walletId
    onChangeSelectwalletId(e) {
        this.setState({
            WalletId: e.value,
            WalletName: { label: e.label }
        })
    }
    /* on change handler */
    onChangeHander(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    /* apply filter */
    applyFilter() {
        if (this.state.Status !== '' || this.state.WalletId !== "" || this.state.UserId !== "" || this.state.WalletTypeId !== '' || this.state.WalletUsageType !== '') {
            this.getListFromServer(1, this.state.PageSize);
            this.setState({ showReset: true, });
        }
    }
    /* reset filter options */
    clearFilter() {
        this.setState(initState, () => this.getListFromServer(this.state.PageNo, this.state.PageSize));
    }
    render() {
        const { intl, walletList, loading } = this.props;
        const userMarginWallets = this.props.userMarginWallets;
        const userlist = this.props.getUser.hasOwnProperty('GetUserData') ? this.props.getUser.GetUserData : [];
        var columnsMargin = [
            {
                name: intl.formatMessage({ id: "table.walletName" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "table.balance" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "table.currency" }),
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
                name: intl.formatMessage({ id: "table.status" }),
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
                name: intl.formatMessage({ id: "table.RoleName" }),
                options: { filter: true, sort: true }
            },
            {
                name: intl.formatMessage({ id: "wallet.lblUsageType" }),
                options: { filter: true, sort: true }
            },
            {
                name: intl.formatMessage({ id: "components.expiryDate" }),
                options: { filter: false, sort: true }
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
            // rowsPerPageOptions: [10, 25, 50, 100],
            serverSide: walletList.length !== 0 ? true : false,
            page: this.state.PageNo,
            rowsPerPage: this.state.PageSize,
            count: this.state.TotalCount,
            textLabels: {
                body: {
                    noMatch: intl.formatMessage({ id: "wallet.emptyTable" }),
                    toolTip: intl.formatMessage({ id: "wallet.sort" }),
                }
            },
            customFooter: (count, page, rowsPerPage) => {
                var page = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
        };
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="wallet.wallets" />} breadCrumbData={BreadCrumbData} drawerClose={this.props.drawerClose} closeAll={this.props.closeAll} />
                <div className="StackingHistory">
                    {loading && <JbsSectionLoader />}
                    <JbsCollapsibleCard>
                        <div className="top-filter clearfix">
                            <FormGroup className="mb-5 mt-5">
                                <Label for="Status">{intl.formatMessage({ id: "table.status" })}</Label>
                                <Input
                                    type="select"
                                    name="Status"
                                    id="Status"
                                    value={this.state.Status}
                                    onChange={(e) => this.onChangeHander(e)}>
                                    <option value="">{intl.formatMessage({ id: "wallet.lblSelectStatus" })}</option>
                                    <option value="1">{intl.formatMessage({ id: "sidebar.btnEnable" })}</option>
                                    <option value="0">{intl.formatMessage({ id: "sidebar.btnDisable" })}</option>
                                </Input>
                            </FormGroup>
                            <FormGroup className="mb-5 mt-5 col-sm-2">
                                <Label for="WalletTypeId">{intl.formatMessage({ id: "table.currency" })}</Label>
                                <Select
                                    options={this.props.walletType.map((wallet, key) => ({
                                        label: wallet.TypeName,
                                        value: wallet.ID,
                                    }))}
                                    onChange={e => this.onChangeSelectCurrency(e)}
                                    value={this.state.WalletTypeObj}
                                    placeholder={intl.formatMessage({ id: "widgets.search" })}
                                />
                            </FormGroup>
                            <FormGroup className="mb-5 mt-5 w-20">
                                <Label for="WalletUsageType">{intl.formatMessage({ id: "wallet.lblUsageType" })}</Label>
                                <Input
                                    type="select"
                                    name="WalletUsageType"
                                    id="WalletUsageType"
                                    value={this.state.WalletUsageType}
                                    onChange={(e) => this.onChangeHander(e)}>
                                    <option value="">{intl.formatMessage({ id: "wallet.lblSelectUsageType" })}</option>
                                    <option value="5">{intl.formatMessage({ id: "wallet.usagetypes.5" })}</option>
                                    <option value="6">{intl.formatMessage({ id: "wallet.usagetypes.6" })}</option>
                                    <option value="7">{intl.formatMessage({ id: "wallet.usagetypes.7" })}</option>
                                </Input>
                            </FormGroup>
                            <FormGroup className="mb-5 mt-5 col-sm-2 p-0">
                                <Label for="UserId"><IntlMessages id="wallet.lblUserId" /></Label>
                                <Select
                                    options={userlist.map((user, i) => ({
                                        label: user.UserName,
                                        value: user.Id,
                                    }))}
                                    onChange={e => this.onChangeSelectUser(e)}
                                    value={this.state.UserLabel}
                                    maxMenuHeight={200}
                                    placeholder={intl.formatMessage({ id: "sidebar.searchdot" })}
                                />
                            </FormGroup>
                            {this.state.visible === true && (
                                < FormGroup className="mb-5 mt-5 w-20">
                                    <Label for="WalletId">{intl.formatMessage({ id: "wallet.walletList" })}</Label>
                                    <Select
                                        options={userMarginWallets.map((wallet, i) => ({
                                            label: wallet.WalletName,
                                            value: wallet.AccWalletID,
                                        }))}
                                        onChange={e => this.onChangeSelectwalletId(e)}
                                        value={this.state.WalletName}
                                        maxMenuHeight={200}
                                        placeholder={intl.formatMessage({ id: "sidebar.searchdot" })}
                                    />
                                </FormGroup>)}
                            <FormGroup className="mb-5 mt-5">
                                <Label className="d-block">&nbsp;</Label>
                                <Button
                                    color="primary"
                                    variant="raised"
                                    disabled={((this.state.Status !== '' || this.state.UserId !== "" || this.state.WalletTypeId !== '' || this.state.WalletUsageType !== '' || this.state.WalletId !== '') ? false : true)}
                                    onClick={(e) => this.applyFilter(e)}
                                >
                                    {intl.formatMessage({ id: "widgets.apply" })}
                                </Button>
                            </FormGroup>
                            {this.state.showReset && (<FormGroup className="mb-5 mt-5">
                                <Label className="d-block">&nbsp;</Label>
                                <Button
                                    className="btn-danger text-white"
                                    // variant="raised"
                                    // className="border-0 rounded-0"
                                    onClick={(e) => this.clearFilter()}>
                                    {intl.formatMessage({ id: "sidebar.tradingLedger.button.clear" })}
                                </Button>
                            </FormGroup>)}
                        </div>
                    </JbsCollapsibleCard>

                    <MUIDataTable
                        data={walletList.map(wallet => {
                            return [
                                wallet.WalletName,
                                parseFloat(wallet.Balance).toFixed(8),
                                wallet.CoinName,
                                parseFloat(wallet.OutBoundBalance).toFixed(8),
                                parseFloat(wallet.InBoundBalance).toFixed(8),
                                wallet.Status,
                                wallet.RoleName,
                                intl.formatMessage({ id: "wallet.usagetypes." + wallet.WalletUsageType }),
                                changeDateFormat(wallet.ExpiryDate, 'YYYY-MM-DD', false),
                            ]
                        })}
                        columns={columnsMargin}
                        options={options}
                    />

                </div>
            </div>
        )
    }
}
const mapDispatchToProps = ({ settings, WalletManagementReducer, drawerclose, actvHstrRdcer, walletUsagePolicy, MarginWalletLedger }) => {
    const { getUser } = actvHstrRdcer;
    // breadcrumb 
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { darkMode } = settings;
    const { walletType } = walletUsagePolicy;
    const { loading, walletList, TotalCount } = WalletManagementReducer;
    const { userMarginWallets } = MarginWalletLedger;
    return { darkMode, loading, walletList, drawerclose, TotalCount, getUser, walletType, userMarginWallets };
}

export default connect(mapDispatchToProps, {
    getWalletType,
    getUserMarginWallets,
    getMaringWalletList,
    getUserDataList,

})(injectIntl(ListMarginWallets));