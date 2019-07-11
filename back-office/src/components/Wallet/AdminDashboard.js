/* 
    Developer : Nishant Vadgama
    Date : 19-11-2018
    File Comment : Admin Dashboard Component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";
import ScrollMenu from 'react-horizontal-scrolling-menu';
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
//wallet components...
import OrganizationList from './OrganizationList';
import UserList from './UserList';
import WithdrawRoute from "Components/WithdrawRoute/WithdrawRoute";
import WalletList from "Components/Wallet/WalletList";
import WalletBlockTrnTypeList from "Components/Wallet/WalletBlockTrnType/WalletBlockTrnTypeList";
import MasterStakingList from "Components/Wallet/StakingConfiguration/MasterStakingList";
import WalletTypesList from "./WalletTypes/WalletTypesList";
import TransferIn from './TransferIn';
import TransferOut from "./TransferOut";
import WithdrawalReport from "./WithdrawalReport";
import DepositReport from "./DepositReport";
import TrnTypeRoleWise from './TrnTypeRoleWise/TrnTypeRoleWise';
import AdminAssetReport from "Components/AdminAssetReport/AdminAssetReport";
import DaemonAddressList from "Components/DaemonAddress/DaemonAddressList";
import DepositRoute from "Components/DepositRoute/DepositRoute";
import OrganizationLedger from "Components/Wallet/OrganizationLedger";
import ChargesCollected from "Components/ChargesCollected/ChargesCollected";
import ChargeTypeDetail from "Components/ChargeTypeDetail/ChargeTypeDetail";
import WalletUsagePolicy from "Components/WalletUsagePolicy/WalletUsagePolicy";
import CommisssionTypeDetail from "Components/CommisssionType/CommisssionTypeDetail";
import TransactionPolicyList from "Components/TransactionPolicy/TransactionPolicyList";
import MasterChargeConfiguration from "Components/Wallet/ChargeConfiguration/MasterChargeConfiguration";
import DepositionInterval from 'Components/Wallet/DepositionInterval/DepositionInterval';
import UnstakingPandingRequest from 'Components/Wallet/StakingConfiguration/UnstakingPandingRequest';
import LimitConfiguration from 'Components/Wallet/LimitConfiguration/LimitConfiguration';
import ServiceProviderBalance from 'Components/ServiceProviderBalance/ServiceProviderBalance';
import StakingHistoryReport from 'Components/StakingHistoryReport/StakingHistoryReport';
import AppConfig from 'Constants/AppConfig';
import ERC223Dashboard from './ERC223Dashboard';
import BlockUnblockUserAddresss from 'Components/Wallet/BlockUnblockUserAddress/BlockUnblockUserAddress';
import WithdrawalApproval from 'Components/Wallet/WithdrawalApproval/WithdrawalApproval';

//wallet widgets...
import {
    CardWidgetType1,
    CardWidgetType2,
    CurrencyWidget,
    WalletFeedsWidget,
    SimpleCard
} from './DashboardWidgets';
import {
    getOrganizationsDetails,
    getUsersDetails,
    getUserTypesDetails,
    getRoleDetails,
    getUserGraph,
    getOrganizationGraph,
    getWalletDetails,
    getWalletTypeList,
    getWalletSummary
} from "Actions/Wallet";
import { ListDepositionInterval } from "Actions/DepositionInterval";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
// componenet listing...
const components = {
    OrganizationList: OrganizationList,
    UserList: UserList,
    WithdrawRoute: WithdrawRoute,
    WalletList: WalletList,
    WalletBlockTrnTypeList: WalletBlockTrnTypeList,
    MasterStakingList: MasterStakingList,
    WalletTypesList: WalletTypesList,
    TransferIn: TransferIn,
    TransferOut: TransferOut,
    WithdrawalReport: WithdrawalReport,
    DepositReport: DepositReport,
    TrnTypeRoleWise: TrnTypeRoleWise,
    AdminAssetReport: AdminAssetReport,
    DaemonAddressList: DaemonAddressList,
    DepositRoute: DepositRoute,
    OrganizationLedger: OrganizationLedger,
    ChargesCollected: ChargesCollected,
    ChargeTypeDetail: ChargeTypeDetail,
    WalletUsagePolicy: WalletUsagePolicy,
    CommisssionTypeDetail: CommisssionTypeDetail,
    TransactionPolicyList: TransactionPolicyList,
    MasterChargeConfiguration: MasterChargeConfiguration,
    DepositionInterval: DepositionInterval,
    UnstakingPandingRequest: UnstakingPandingRequest,
    LimitConfiguration: LimitConfiguration,
    ServiceProviderBalance: ServiceProviderBalance,
    StakingHistoryReport: StakingHistoryReport,
    ERC223Dashboard: ERC223Dashboard,
    BlockUnblockUserAddresss: BlockUnblockUserAddresss,
    WithdrawalApproval: WithdrawalApproval
};

// dynamic component binding...
const dynamicComponent = (TagName, props, drawerClose, closeAll, TrnType) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll, TrnType });
};
const Arrow = ({ text, className }) => {
    return (
        <div
            className={className}
        >{text}</div>
    );
};
const Menu = (list) => list.map((wallet, key) => {
    return (
        <div className="col-sm-12 w-xs-half-block" key={key}>
            <CurrencyWidget
                currency={wallet.WalletType}
                memberCount={wallet.UserCount}
                trnCount={wallet.TransactionCount}
                totalTrnCount={wallet.ToatalBalance}
                WalletCount={wallet.WalletCount}
            />
        </div>
    );
});
// Component for wallet dashboard
class AdminDashboard extends Component {
    state = {
        componentName: '',
        open: false,
        menudetail: [],
        TrnType: 9,
    }
    //fetch details before render
    componentWillMount() {
        this.props.getMenuPermissionByID('58adc832-8637-6895-3ace-9025dee8247b'); // get wallet menu permission
    }
    componentWillReceiveProps(nextProps) {
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getWalletDetails()
                this.props.getOrganizationsDetails();
                this.props.getUsersDetails();
                this.props.getUserGraph();
                this.props.getUserTypesDetails();
                this.props.getRoleDetails();
                this.props.getOrganizationGraph();
                this.props.getWalletTypeList();
                this.props.getWalletSummary();
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    window.location.href = AppConfig.afterLoginRedirect;
                }, 2000);
            }
        }
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open1 === false) {
            this.setState({
                open: false,
                componentName: ''
            })
        }
    }
    toggleDrawer = () => {
        this.setState({
            open: this.state.open ? false : true,
        });
    }
    /* drawe close */
    closeDrawer = () => {
        this.setState({
            open: false,
            componentName: ''
        });
    }
    showComponent = (componentName, permission, GUID) => {
        // check permission go on next page or not
        if (permission) {
            if (GUID === '4DE698A0-86F1-3564-7850-870026774895') {
                this.setState({
                    TrnType: 6,
                    componentName: componentName,
                    open: true,
                });
                //check for AddressGenerationRoute Guid for send bit name as TraType      added  by parth andhariya 25-04-2019 
            } else if (GUID === '5D24B2D8-6C79-0CBD-A544-A6562518A318') {
                this.setState({
                    TrnType: 9,
                    componentName: componentName,
                    open: true,
                });
            } else {
                this.setState({
                    componentName: componentName,
                    open: true,
                });
            }
            //added by parth andhariya
            if (componentName === "DepositionInterval") {
                this.props.ListDepositionInterval({});
            }
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    closeAll = () => {
        this.setState({
            open: false,
            componentName: ''
        });
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
        let walletList = [];
        if (this.props.walletTypeList.hasOwnProperty("WalletTypes") && this.props.walletTypeList.WalletTypes.length) {
            walletList = Menu(this.props.walletTypeList.WalletTypes);
        }
        const ArrowLeft = Arrow({ text: '<', className: 'arrow-prev' });
        const ArrowRight = Arrow({ text: '>', className: 'arrow-next' });
        // organization graph data
        let orgLabels = [];
        let orgCount = [];
        if (this.props.organizationGraph.hasOwnProperty("TotalCount")) {
            orgLabels = this.props.organizationGraph.Month;
            orgCount = this.props.organizationGraph.TotalCount;
        }
        const organizationData = {
            chartData: {
                labels: orgLabels,
                data: orgCount
            },
            color: "primary"
        }
        //user graph data
        let userLabels = [];
        let userCount = [];
        if (this.props.userGraph.hasOwnProperty("TotalCount")) {
            userLabels = this.props.userGraph.Month;
            userCount = this.props.userGraph.TotalCount;
        }
        const userGraphData = {
            chartData: {
                labels: userLabels,
                data: userCount
            },
            color: "warning"
        }
        return (
            <React.Fragment>
                {this.props.menuLoading && <JbsSectionLoader />}
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('5DCACB91-1781-5CA1-8CE1-791861EE25FC') && //5DCACB91-1781-5CA1-8CE1-791861EE25FC
                        <div className="col-md-4 col-sm-4 col-xs-12">
                            {this.props.organizationDetails.loading && <PreloadWidget />}
                            {!this.props.organizationDetails.loading &&
                                <CardWidgetType1
                                    title={<IntlMessages id="walletDeshbard.organizations" />}
                                    count={(this.props.organizationDetails.hasOwnProperty("TotalCount")) ? this.props.organizationDetails.TotalCount : 0}
                                    icon="zmdi-balance"
                                    bgClass="bg-dark"
                                    clickEvent={this.toggleDrawer}
                                    data={organizationData}
                                    createCount={(this.props.organizationDetails.hasOwnProperty("TodayCount")) ? this.props.organizationDetails.TodayCount : 0}
                                    createTitle={<IntlMessages id="walletDeshbard.createdToday" />}
                                />
                            }
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('0BBEBE62-2360-9A81-3347-41FAE9E2122A') && //0BBEBE62-2360-9A81-3347-41FAE9E2122A
                        <div className="col-md-4 col-sm-4 col-xs-12">
                            {this.props.usersDetails.loading && <PreloadWidget />}
                            {!this.props.usersDetails.loading &&
                                <CardWidgetType1
                                    title={<IntlMessages id="walletDeshbard.users" />}
                                    count={(this.props.usersDetails.hasOwnProperty("TotalCount")) ? this.props.usersDetails.TotalCount : 0}
                                    icon="zmdi-account-circle"
                                    bgClass="bg-dark"
                                    clickEvent={this.toggleDrawer}
                                    data={userGraphData}
                                    createCount={(this.props.usersDetails.hasOwnProperty("TodayCount")) ? this.props.usersDetails.TodayCount : 0}
                                    createTitle={<IntlMessages id="walletDeshbard.newUserReg" />}
                                />
                            }
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('65D6511D-03D0-36CC-2171-9E6727DDA17B') && //65D6511D-03D0-36CC-2171-9E6727DDA17B
                        <div className="col-md-4 col-sm-4 col-xs-12">
                            {this.props.userTypesDetails.loading && <PreloadWidget />}
                            {!this.props.userTypesDetails.loading &&
                                <CardWidgetType2
                                    title={<IntlMessages id="walletDeshbard.userTypes" />}
                                    adminCount={(this.props.userTypesDetails.hasOwnProperty("Counter")) ? (typeof this.props.userTypesDetails.Counter[0] !== "undefined") ? this.props.userTypesDetails.Counter[0].Count : 0 : 0}
                                    userCount={(this.props.userTypesDetails.hasOwnProperty("Counter")) ? (typeof this.props.userTypesDetails.Counter[1] !== "undefined") ? this.props.userTypesDetails.Counter[1].Count : 0 : 0}
                                    clickEvent={this.toggleDrawer}
                                    isAdmin={1} />
                            }
                        </div>
                    }
                </div>
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('3B9E778F-28E0-98F1-52FE-DAD191245381') && //3B9E778F-28E0-98F1-52FE-DAD191245381
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            {this.props.walletSummary.loading ?
                                <PreloadWidget /> :
                                <a href="javascript:void(0)" onClick={(e) => this.showComponent('WalletList', (this.checkAndGetMenuAccessDetail('3B9E778F-28E0-98F1-52FE-DAD191245381')).HasChild)} className="text-dark col-sm-full">
                                    <WalletFeedsWidget
                                        feedsTitle={<IntlMessages id="walletDeshbard.wallets" />}
                                        feedsCount={this.props.walletSummary.hasOwnProperty("Data") ? this.props.walletSummary.Data.WalletCount : 0}
                                        icon="zmdi zmdi-balance-wallet"
                                    />
                                </a>}
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('AD938175-3B8D-6EBE-37DE-5C604075667A') && //AD938175-3B8D-6EBE-37DE-5C604075667A
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            {this.props.walletSummary.loading ?
                                <PreloadWidget /> :
                                <a href="javascript:void(0)" onClick={(e) => this.showComponent('WalletTypesList', (this.checkAndGetMenuAccessDetail('AD938175-3B8D-6EBE-37DE-5C604075667A')).HasChild)} className="text-dark col-sm-full">
                                    <WalletFeedsWidget
                                        feedsTitle={<IntlMessages id="walletDeshbard.walletTypes" />}
                                        feedsCount={this.props.walletSummary.hasOwnProperty("Data") ? this.props.walletSummary.Data.WalletTypeCount : 0}
                                        icon="zmdi zmdi-widgets"
                                    />
                                </a>}
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('DCBDB1AD-A299-6EBB-1E99-66E52E442CC4') && //DCBDB1AD-A299-6EBB-1E99-66E52E442CC4
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            {this.props.walletSummary.loading ?
                                <PreloadWidget /> :
                                <a href="javascript:void(0)" onClick={(e) => this.showComponent('UserList', (this.checkAndGetMenuAccessDetail('DCBDB1AD-A299-6EBB-1E99-66E52E442CC4')).HasChild)} className="text-dark col-sm-full">
                                    <WalletFeedsWidget
                                        feedsTitle={<IntlMessages id="walletDeshbard.walletMembers" />}
                                        feedsCount={this.props.walletSummary.hasOwnProperty("Data") ? this.props.walletSummary.Data.UserCount : 0}
                                        icon="zmdi zmdi-accounts"
                                    />
                                </a>}
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('F3364A4E-A2EE-2288-024A-D9BE20FB46A4') && //F3364A4E-A2EE-2288-024A-D9BE20FB46A4
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            {this.props.walletSummary.loading ?
                                <PreloadWidget /> :
                                <WalletFeedsWidget
                                    feedsTitle={<IntlMessages id="walletDeshbard.walletsTotal" />}
                                    feedsCount={this.props.walletSummary.hasOwnProperty("Data") ? parseFloat(this.props.walletSummary.Data.ToatalBalance).toFixed(8) : 0}
                                    icon="zmdi zmdi-money"
                                />}
                        </div>
                    }
                </div>
                {this.checkAndGetMenuAccessDetail('DFFF16E4-8F62-4B18-8CC4-F9C27C389352') && //DFFF16E4-8F62-4B18-8CC4-F9C27C389352
                    <div className="row">
                        <div className="col-sm-12">
                            <JbsCollapsibleCard heading={<IntlMessages id="walletDeshbard.walletTypes" />} contentCustomClasses="pt-0" collapsible>
                                {this.props.walletTypeList.loading ?
                                    <JbsSectionLoader /> :
                                    <ScrollMenu
                                        data={walletList}
                                        arrowLeft={ArrowLeft}
                                        arrowRight={ArrowRight}
                                        menuClass={''}
                                    />}
                            </JbsCollapsibleCard>
                        </div>
                    </div>
                }
                {this.checkAndGetMenuAccessDetail('93F8014D-838F-16B4-A135-731AD1C57F79') && //93F8014D-838F-16B4-A135-731AD1C57F79
                    <div className="row">
                        <div className="col-sm-12">
                            <JbsCollapsibleCard heading={<IntlMessages id="walletDeshbard.walletStatus" />} contentCustomClasses="report-status" collapsible>
                                {this.props.walletDetails.loading ?
                                    <JbsSectionLoader /> :
                                    <ul className="list-inline d-flex align-content-center">
                                        {this.props.walletDetails.hasOwnProperty("Counter") && this.props.walletDetails.Counter.map((type, key) => (
                                            <li className={"list-inline-item col " + ((key == 0) ? 'border-left ' : '') + ((key == (this.props.walletDetails.Counter.length - 1)) ? 'border-right' : '')} key={key}>
                                                <h4 className="mb-0">{type.Name}</h4>
                                                <h2 className="title mb-0 font-weight-normal">{type.Count}</h2>
                                            </li>
                                        ))}
                                    </ul>
                                }
                            </JbsCollapsibleCard>
                        </div>
                    </div>
                }
                {(this.checkAndGetMenuAccessDetail('1944654E-05F0-6249-27D8-91EB98F611CA') || //1944654E-05F0-6249-27D8-91EB98F611CA
                    this.checkAndGetMenuAccessDetail('AC8E1AB2-901F-A6BA-4D03-22EF84C11C96') || //AC8E1AB2-901F-A6BA-4D03-22EF84C11C96
                    this.checkAndGetMenuAccessDetail('818D7B44-3FD3-2DF4-8C2A-0E7280D00260') || //818D7B44-3FD3-2DF4-8C2A-0E7280D00260
                    this.checkAndGetMenuAccessDetail('7363BA28-9C8A-7C23-7FD1-E1F40CA66053') || //7363BA28-9C8A-7C23-7FD1-E1F40CA66053
                    this.checkAndGetMenuAccessDetail('983A4733-0DF5-7A4D-6569-868864306313') || //983A4733-0DF5-7A4D-6569-868864306313
                    this.checkAndGetMenuAccessDetail('AAF5A79C-297E-7327-269A-4B8C4FF85BC8') || //AAF5A79C-297E-7327-269A-4B8C4FF85BC8
                    this.checkAndGetMenuAccessDetail('A76AC6EA-38F3-46C5-50EE-DC7F99598E37') || //A76AC6EA-38F3-46C5-50EE-DC7F99598E37
                    this.checkAndGetMenuAccessDetail('A1DA426A-72E9-A0BF-99F7-413544BC34F8') || //A1DA426A-72E9-A0BF-99F7-413544BC34F8
                    this.checkAndGetMenuAccessDetail('F493156B-2265-2682-3E4A-53F7A7C55A5E') ||//F493156B-2265-2682-3E4A-53F7A7C55A5E
                    this.checkAndGetMenuAccessDetail('DB8CFB7D-81CA-7BE7-7A49-B945C496468C')) &&//DB8CFB7D-81CA-7BE7-7A49-B945C496468C
                    <div className="row">
                        <div className="col-sm-12">
                            <h3 className="text-uppercase"><IntlMessages id="sidebar.reports" /></h3>
                        </div>
                    </div>
                }
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('1944654E-05F0-6249-27D8-91EB98F611CA') && //1944654E-05F0-6249-27D8-91EB98F611CA
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("WithdrawalReport", (this.checkAndGetMenuAccessDetail('1944654E-05F0-6249-27D8-91EB98F611CA')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="walletDashboard.WithdrawalReport" />}
                                    icon="zmdi zmdi-chart"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('AC8E1AB2-901F-A6BA-4D03-22EF84C11C96') && //AC8E1AB2-901F-A6BA-4D03-22EF84C11C96
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("DepositReport", (this.checkAndGetMenuAccessDetail('AC8E1AB2-901F-A6BA-4D03-22EF84C11C96')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="walletDashboard.DepositReport" />}
                                    icon="zmdi zmdi-chart"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('818D7B44-3FD3-2DF4-8C2A-0E7280D00260') && //818D7B44-3FD3-2DF4-8C2A-0E7280D00260
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("TransferIn", (this.checkAndGetMenuAccessDetail('818D7B44-3FD3-2DF4-8C2A-0E7280D00260')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="walletDashboard.transferIn" />}
                                    icon="zmdi zmdi-trending-down"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('7363BA28-9C8A-7C23-7FD1-E1F40CA66053') && //7363BA28-9C8A-7C23-7FD1-E1F40CA66053
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("TransferOut", (this.checkAndGetMenuAccessDetail('7363BA28-9C8A-7C23-7FD1-E1F40CA66053')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="walletDashboard.transferOut" />}
                                    icon="zmdi zmdi-trending-up"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('983A4733-0DF5-7A4D-6569-868864306313') && //983A4733-0DF5-7A4D-6569-868864306313
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("OrganizationLedger", (this.checkAndGetMenuAccessDetail('983A4733-0DF5-7A4D-6569-868864306313')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="wallet.titleOrgLedger" />}
                                    icon="zmdi zmdi-assignment"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('DB8B3999-18DE-8278-25E2-268C3D1312EF') && //DB8B3999-18DE-8278-25E2-268C3D1312EF
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("ChargesCollected", (this.checkAndGetMenuAccessDetail('DB8B3999-18DE-8278-25E2-268C3D1312EF')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.chargeCollected" />}
                                    icon="zmdi zmdi-collection-text"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('AAF5A79C-297E-7327-269A-4B8C4FF85BC8') && //AAF5A79C-297E-7327-269A-4B8C4FF85BC8
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("AdminAssetReport", (this.checkAndGetMenuAccessDetail('AAF5A79C-297E-7327-269A-4B8C4FF85BC8')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="table.adminAsset" />}
                                    icon="zmdi zmdi-money-box"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('A76AC6EA-38F3-46C5-50EE-DC7F99598E37') && //A76AC6EA-38F3-46C5-50EE-DC7F99598E37
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("DaemonAddressList", (this.checkAndGetMenuAccessDetail('A76AC6EA-38F3-46C5-50EE-DC7F99598E37')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="wallet.DATitle" />}
                                    icon="zmdi zmdi-confirmation-number"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('A1DA426A-72E9-A0BF-99F7-413544BC34F8') && //A1DA426A-72E9-A0BF-99F7-413544BC34F8
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("ServiceProviderBalance", (this.checkAndGetMenuAccessDetail('A1DA426A-72E9-A0BF-99F7-413544BC34F8')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="wallet.ServiceProviderBalance" />}
                                    icon="zmdi zmdi-confirmation-number"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('F493156B-2265-2682-3E4A-53F7A7C55A5E') && //F493156B-2265-2682-3E4A-53F7A7C55A5E
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("StakingHistoryReport", (this.checkAndGetMenuAccessDetail('F493156B-2265-2682-3E4A-53F7A7C55A5E')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="wallet.StakingHistoryReport" />}
                                    icon="zmdi zmdi-confirmation-number"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {/* added by parth andhariya */}
                    {this.checkAndGetMenuAccessDetail('DB8CFB7D-81CA-7BE7-7A49-B945C496468C') && //DB8CFB7D-81CA-7BE7-7A49-B945C496468C
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("WithdrawalApproval", (this.checkAndGetMenuAccessDetail('DB8CFB7D-81CA-7BE7-7A49-B945C496468C')).HasChild)}
                                // onClick={e => this.showComponent("WithdrawalApproval", true)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="wallet.WithdrawalApproval" />}
                                    icon="zmdi zmdi-confirmation-number"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                </div>
                {(this.checkAndGetMenuAccessDetail('271B23A8-6D0A-9389-063B-B669B741931B') || //271B23A8-6D0A-9389-063B-B669B741931B
                    this.checkAndGetMenuAccessDetail('9954F3A7-18BF-570E-486F-33CBFAF64796') || //9954F3A7-18BF-570E-486F-33CBFAF64796
                    this.checkAndGetMenuAccessDetail('96865BE7-6FF3-9585-30FF-4C7810883DBF') || //96865BE7-6FF3-9585-30FF-4C7810883DBF
                    this.checkAndGetMenuAccessDetail('566F0BD3-3515-8BAE-9D50-7F4DDBB36C9C') ||//566F0BD3-3515-8BAE-9D50-7F4DDBB36C9C
                    this.checkAndGetMenuAccessDetail('02F30558-639C-6C0F-7F2F-120E1EC37ECC') || //02F30558-639C-6C0F-7F2F-120E1EC37ECC
                    this.checkAndGetMenuAccessDetail('4007FDB1-0D02-0210-959F-FFDC4BAD668B')) && //4007FDB1-0D02-0210-959F-FFDC4BAD668B
                    <div className="row">
                        <div className="col-sm-12">
                            <h3 className="text-uppercase"><IntlMessages id="card.list.title.configuration" /></h3>
                        </div>
                    </div>
                }
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('271B23A8-6D0A-9389-063B-B669B741931B') && //271B23A8-6D0A-9389-063B-B669B741931B
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("MasterStakingList", (this.checkAndGetMenuAccessDetail('271B23A8-6D0A-9389-063B-B669B741931B')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="tokenStaking.lblStakingConfig" />}
                                    icon="fa fa-cogs"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {/* added by parth andhariya */}
                    {this.checkAndGetMenuAccessDetail('9954F3A7-18BF-570E-486F-33CBFAF64796') && //9954F3A7-18BF-570E-486F-33CBFAF64796
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("LimitConfiguration", (this.checkAndGetMenuAccessDetail('9954F3A7-18BF-570E-486F-33CBFAF64796')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="lable.LimitConfiguration" />}
                                    icon="fa fa-cogs"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('96865BE7-6FF3-9585-30FF-4C7810883DBF') && //96865BE7-6FF3-9585-30FF-4C7810883DBF
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("MasterChargeConfiguration", (this.checkAndGetMenuAccessDetail('96865BE7-6FF3-9585-30FF-4C7810883DBF')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="lable.ChargeConfiguration" />}
                                    icon="fa fa-cogs"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {/* added by parth andhariya */}
                    {/* if any one change the name of this perticuler component "DepositionInterval" then that porsone has to change in method: "showComponent" */}
                    {this.checkAndGetMenuAccessDetail('566F0BD3-3515-8BAE-9D50-7F4DDBB36C9C') && //566F0BD3-3515-8BAE-9D50-7F4DDBB36C9C
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("DepositionInterval", (this.checkAndGetMenuAccessDetail('566F0BD3-3515-8BAE-9D50-7F4DDBB36C9C')))}  //566F0BD3-3515-8BAE-9D50-7F4DDBB36C9C
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="lable.DepositionInterval" />}
                                    icon="fa fa-cogs"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('4007FDB1-0D02-0210-959F-FFDC4BAD668B') && //4007FDB1-0D02-0210-959F-FFDC4BAD668B
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("ERC223Dashboard", this.checkAndGetMenuAccessDetail('4007FDB1-0D02-0210-959F-FFDC4BAD668B').HasChild)}  //4007FDB1-0D02-0210-959F-FFDC4BAD668B
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="lable.ERC223" />}
                                    icon="fa fa-cogs"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {/* guid mukavana ane add karavana api ma  */}
                    {this.checkAndGetMenuAccessDetail('02F30558-639C-6C0F-7F2F-120E1EC37ECC') && //
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("BlockUnblockUserAddresss", (this.checkAndGetMenuAccessDetail('02F30558-639C-6C0F-7F2F-120E1EC37ECC')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="walletDashboard.BlockUnblockUserAddress" />}
                                    icon="fa fa-cogs"
                                    // icon="zmdi zmdi-layers"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                </div>
                {(this.checkAndGetMenuAccessDetail('4DE698A0-86F1-3564-7850-870026774895') || //4DE698A0-86F1-3564-7850-870026774895
                    this.checkAndGetMenuAccessDetail('1C82E227-2AC0-57F0-0A1B-608EAF999DBB') || //1C82E227-2AC0-57F0-0A1B-608EAF999DBB
                    this.checkAndGetMenuAccessDetail('1F69E9FB-2810-4CB1-1993-4006C01005C9') || //1F69E9FB-2810-4CB1-1993-4006C01005C9
                    this.checkAndGetMenuAccessDetail('09FC758C-641C-9C0F-1620-EC99115703FC') || //09FC758C-641C-9C0F-1620-EC99115703FC
                    this.checkAndGetMenuAccessDetail('50BCFE65-0039-1D79-70AE-E67C2D294988')) && //50BCFE65-0039-1D79-70AE-E67C2D294988
                    <div className="row">
                        <div className="col-sm-12">
                            <h3 className="text-uppercase"><IntlMessages id="walletDashboard.lblUtils" /></h3>
                        </div>
                    </div>
                }
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('4DE698A0-86F1-3564-7850-870026774895') && //4DE698A0-86F1-3564-7850-870026774895
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("WithdrawRoute", (this.checkAndGetMenuAccessDetail('4DE698A0-86F1-3564-7850-870026774895')).HasChild, '4DE698A0-86F1-3564-7850-870026774895')}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.withdrawRoute" />}
                                    icon="zmdi zmdi-case-download"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {/* added by parth andhariya   */}
                    {this.checkAndGetMenuAccessDetail('5D24B2D8-6C79-0CBD-A544-A6562518A318') && //5D24B2D8-6C79-0CBD-A544-A6562518A318
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("WithdrawRoute", (this.checkAndGetMenuAccessDetail('5D24B2D8-6C79-0CBD-A544-A6562518A318')).HasChild, '5D24B2D8-6C79-0CBD-A544-A6562518A318')}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.AddressGenerationRoute" />}
                                    icon="zmdi zmdi-case-download"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('1C82E227-2AC0-57F0-0A1B-608EAF999DBB') && //1C82E227-2AC0-57F0-0A1B-608EAF999DBB
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("DepositRoute", (this.checkAndGetMenuAccessDetail('1C82E227-2AC0-57F0-0A1B-608EAF999DBB')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.depositRoute" />}
                                    icon="zmdi zmdi-present-to-all"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('1F69E9FB-2810-4CB1-1993-4006C01005C9') && //1F69E9FB-2810-4CB1-1993-4006C01005C9
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("WalletBlockTrnTypeList", (this.checkAndGetMenuAccessDetail('1F69E9FB-2810-4CB1-1993-4006C01005C9')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="walletDashboard.WalletBlockTrnType" />}
                                    icon="zmdi zmdi-block"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('09FC758C-641C-9C0F-1620-EC99115703FC') && //09FC758C-641C-9C0F-1620-EC99115703FC
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("TrnTypeRoleWise", (this.checkAndGetMenuAccessDetail('09FC758C-641C-9C0F-1620-EC99115703FC')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="walletDashboard.TrnTypeRoleWise" />}
                                    icon="zmdi zmdi-widgets"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('50BCFE65-0039-1D79-70AE-E67C2D294988') && //50BCFE65-0039-1D79-70AE-E67C2D294988
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("UnstakingPandingRequest", (this.checkAndGetMenuAccessDetail('50BCFE65-0039-1D79-70AE-E67C2D294988')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="walletDashboard.UnstakingPandingRequest" />}
                                    icon="zmdi zmdi-notifications-add"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                </div>
                {(this.checkAndGetMenuAccessDetail('19B37746-6A7A-95AE-33D7-6DE594B32CD1') || //19B37746-6A7A-95AE-33D7-6DE594B32CD1
                    this.checkAndGetMenuAccessDetail('30AA0584-7167-6EF9-8DB9-4584B1242A2C')) && //30AA0584-7167-6EF9-8DB9-4584B1242A2C
                    <div className="row">
                        <div className="col-sm-12">
                            <h3 className="text-uppercase"><IntlMessages id="wallet.titlePolicies" /></h3>
                        </div>
                    </div>
                }
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('19B37746-6A7A-95AE-33D7-6DE594B32CD1') && //19B37746-6A7A-95AE-33D7-6DE594B32CD1
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("WalletUsagePolicy", (this.checkAndGetMenuAccessDetail('19B37746-6A7A-95AE-33D7-6DE594B32CD1')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="walletDashboard.WalletUsagePolicy" />}
                                    icon="zmdi zmdi-balance-wallet"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('30AA0584-7167-6EF9-8DB9-4584B1242A2C') && //30AA0584-7167-6EF9-8DB9-4584B1242A2C
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("TransactionPolicyList", (this.checkAndGetMenuAccessDetail('30AA0584-7167-6EF9-8DB9-4584B1242A2C')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="walletDashboard.transactionPolicy" />}
                                    icon="zmdi zmdi-storage"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                </div>
                <Drawer
                    width={this.state.componentName === "DepositionInterval" ? "50%" : "100%"}
                    handler={false}
                    open={this.state.open}
                    className="drawer1 half_drawer"
                    placement="right"
                    levelMove={100}
                    level={null}
                >
                    {this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.closeDrawer, this.closeAll, this.state.TrnType)}
                </Drawer>
            </React.Fragment>
        );
    }
}

const mapToProps = ({ superAdminReducer, drawerclose, authTokenRdcer }) => {
    // breadcrumb 
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const {
        organizationDetails,
        usersDetails,
        userTypesDetails,
        roleDetails,
        userGraph,
        organizationGraph,
        walletDetails,
        walletTypeList,
        walletSummary
    } = superAdminReducer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return {
        organizationDetails,
        usersDetails,
        userTypesDetails,
        roleDetails,
        userGraph,
        organizationGraph,
        walletDetails,
        walletTypeList,
        walletSummary,
        drawerclose,
        menu_rights,
        menuLoading
    };
};

export default connect(mapToProps, {
    getOrganizationsDetails,
    getUsersDetails,
    getUserTypesDetails,
    getRoleDetails,
    getUserGraph,
    getOrganizationGraph,
    getWalletDetails,
    getWalletTypeList,
    getWalletSummary,
    ListDepositionInterval,
    getMenuPermissionByID
})(AdminDashboard);
