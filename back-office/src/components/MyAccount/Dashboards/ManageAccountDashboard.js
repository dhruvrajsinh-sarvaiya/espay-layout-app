/* 
    Developer : Salim Deraiya
    Date : 09-02-2019
    Update by : Bharat Jograna (BreadCrumb)09 March 2019
    File Comment : Manage Account Component
*/
import React, { Component } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { SimpleCard } from './Widgets';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { NotificationManager } from "react-notifications";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; 
// import { this.checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
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
        title: <IntlMessages id="sidebar.adminPanel" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="my_account.manageAccount" />,
        link: '',
        index: 1
    }
];

//Withdraw Breadcrumb....
const withdrawBreadcrumb = [
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
        title: <IntlMessages id="sidebar.adminPanel" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="my_account.manageAccount" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="my_account.withdrawHistory" />,
        link: '',
        index: 2
    }
];

//Deposite Breadcrumb....
const depositeBreadcrumb = [
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
        title: <IntlMessages id="sidebar.adminPanel" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="my_account.manageAccount" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="my_account.depositeHistory" />,
        link: '',
        index: 2
    }
];

//Limit Configuration Breadcrumb....
const limitConfigBreadcrumb = [
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
        title: <IntlMessages id="sidebar.adminPanel" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="my_account.manageAccount" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="lable.LimitConfiguration" />,
        link: '',
        index: 2
    }
];

//Margin Trading Breadcrumb....
const marginTradingBreadcrumb = [
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
        title: <IntlMessages id="sidebar.adminPanel" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="my_account.manageAccount" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="my_account.tradingHistory" />,
        link: '',
        index: 2
    }
];

//Component for MyAccount Groups Dashboard
class ManageAccountDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            componentTitle: '',
            breadcrumb: BreadCrumbData,
            menuDetail: {},
            TitleBit: 1,
            manageAcc: 1,
            menudetail: [],
            menuLoading:false,
            Guid : ''
        }
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('4F8FAF64-5179-A4E3-2E27-A75AFAA88263'); // get myaccount menu permission
       // this.props.getApplicationData();
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        //Added by Saloni Rathod
		/* update menu details if not set */
		if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					window.location.href = AppConfig.afterLoginRedirect;
				}, 2000);
			}
		}
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({ open: false })
        }
    }

    onClick = () => {
        this.setState({ open: this.state.open ? false : true });
    }

    showComponent = (componentName, menuDetail, GUID, componentTitle = '', breadcrumb = []) => {
        //check permission go on next page or not
        if (menuDetail.HasChild) {
            if (componentName === 'UserTradeReport') {
                this.setState({
                    BreadCrumbData: marginTradingBreadcrumb,
                    title: 'my_account.tradingHistory',
                    start_date: new Date().toISOString().slice(0, 10),
                    end_date: new Date().toISOString().slice(0, 10),
                    name: '',
                    orderType: '',
                    reportTitle: 'my_account.tradingHistory',
                    menuDetail: menuDetail,
                    Guid: GUID
                });
            }
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
                componentTitle: componentTitle,
                breadcrumb: breadcrumb,
                menuDetail: menuDetail,
                Guid: GUID
            });
        }
         else {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }        
    }

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
    render() {
        const { componentName, componentTitle, open, breadcrumb,menuDetail } = this.state;
        const { drawerClose } = this.props;
        return (
            <div className="jbs-page-content drawer-data">
              {(this.state.menuLoading) && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="my_account.manageAccount" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('A209CE11-65EC-76B8-5C45-F7ABB3121F85') && //A209CE11-65EC-76B8-5C45-F7ABB3121F85
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('PersonalInformationDashboard', this.checkAndGetMenuAccessDetail('A209CE11-65EC-76B8-5C45-F7ABB3121F85'))} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.PersonalInformation" />}
                                    icon="zmdi zmdi-account-box"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('4BBFECD3-4E7F-6AF5-1BA9-A124EC9950A7') && //4BBFECD3-4E7F-6AF5-1BA9-A124EC9950A7
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('IPWhitelistDashboard', this.checkAndGetMenuAccessDetail('4BBFECD3-4E7F-6AF5-1BA9-A124EC9950A7'))} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.ipWhitelist" />}
                                    icon="zmdi zmdi-globe-lock"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('DBF511E8-47C8-63CE-7063-2C74606D0F35') && //DBF511E8-47C8-63CE-7063-2C74606D0F35
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListDeviceWhitelistDashboard', this.checkAndGetMenuAccessDetail('DBF511E8-47C8-63CE-7063-2C74606D0F35'))} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.deviceWhitelist" />}
                                    icon="zmdi zmdi-smartphone-lock"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('E83F62A6-01F8-4E45-39A7-CB8B38F50223') && //E83F62A6-01F8-4E45-39A7-CB8B38F50223
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('WalletList', this.checkAndGetMenuAccessDetail('E83F62A6-01F8-4E45-39A7-CB8B38F50223'))} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.userWallets" />}
                                    icon="zmdi zmdi-balance-wallet"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('8E2D2919-4DAA-3865-1BF8-BA28CF5E5293') && //8E2D2919-4DAA-3865-1BF8-BA28CF5E5293
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('UserTradeReport', this.checkAndGetMenuAccessDetail('8E2D2919-4DAA-3865-1BF8-BA28CF5E5293'),'8E2D2919-4DAA-3865-1BF8-BA28CF5E5293')} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.tradingHistory" />}
                                    icon="fa fa-line-chart"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('0723F919-1E8A-7C0F-132E-D61FBF40949E') && //0723F919-1E8A-7C0F-132E-D61FBF40949E
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('WithdrawalReport', this.checkAndGetMenuAccessDetail('0723F919-1E8A-7C0F-132E-D61FBF40949E'), '', "my_account.withdrawHistory", withdrawBreadcrumb)} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.withdrawHistory" />}
                                    icon="zmdi zmdi-widgets"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('C499114C-A2DD-9F42-5E27-FA76149C95B2') && //C499114C-A2DD-9F42-5E27-FA76149C95B2
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('DepositReport', this.checkAndGetMenuAccessDetail('C499114C-A2DD-9F42-5E27-FA76149C95B2'), '', "my_account.depositeHistory", depositeBreadcrumb)} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.depositeHistory" />}
                                    icon="zmdi zmdi-archive"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {/* {this.checkAndGetMenuAccessDetail('D098E503-10A0-2E2A-A4EC-16A9F1346B0F') && //D098E503-10A0-2E2A-A4EC-16A9F1346B0F
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ActiveProfile')} className="text-dark col-sm-full">
                            <SimpleCard
                                title={<IntlMessages id="my_account.activeProfile" />}
                                icon="zmdi zmdi-account-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                            </a>
                        </div>} */}
                    {this.checkAndGetMenuAccessDetail('6B13C4B3-2CAB-9CB7-9F74-DA05E05419FA') && //6B13C4B3-2CAB-9CB7-9F74-DA05E05419FA
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('LimitConfiguration', this.checkAndGetMenuAccessDetail('6B13C4B3-2CAB-9CB7-9F74-DA05E05419FA'), '', 'lable.LimitConfiguration', limitConfigBreadcrumb)} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.configuredLimits" />}
                                    icon="zmdi zmdi-power-input"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('84E942EA-2195-3F13-2933-F35E1B728B33') && //84E942EA-2195-3F13-2933-F35E1B728B33
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('LoginHistoryDashboard', this.checkAndGetMenuAccessDetail('84E942EA-2195-3F13-2933-F35E1B728B33'))} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.loginHistory" />}
                                    icon="zmdi zmdi-calendar"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {/* {this.checkAndGetMenuAccessDetail('0B49941E-3744-1957-1B88-08358BCA3AE1') && //0B49941E-3744-1957-1B88-08358BCA3AE1
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('SecurityDetails')} className="text-dark col-sm-full">
                            <SimpleCard
                                title={<IntlMessages id="my_account.securityDetails" />}
                                icon="zmdi zmdi-account-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                            </a>
                        </div>} */}
                    {this.checkAndGetMenuAccessDetail('E347E401-5386-97CC-802D-229CA6355FD6') && //E347E401-5386-97CC-802D-229CA6355FD6
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('UserTradeReport', this.checkAndGetMenuAccessDetail('E347E401-5386-97CC-802D-229CA6355FD6'),'E347E401-5386-97CC-802D-229CA6355FD6')} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.marginTradingHistory" />}
                                    icon="zmdi zmdi-assignment"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {/* {this.checkAndGetMenuAccessDetail('A667B0EE-658E-A746-96FB-5E5FF1476058') && //A667B0EE-658E-A746-96FB-5E5FF1476058
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('SocialProfileStatus')} className="text-dark col-sm-full">
                            <SimpleCard
                                title={<IntlMessages id="my_account.socialProfileStatus" />}
                                icon="zmdi zmdi-account-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                            </a>
                        </div>} */}
                    {this.checkAndGetMenuAccessDetail('BEFB2C70-585A-0955-54F1-CD409EB93821') && //BEFB2C70-585A-0955-54F1-CD409EB93821
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('SocialTradingHistory', this.checkAndGetMenuAccessDetail('BEFB2C70-585A-0955-54F1-CD409EB93821'))} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.socialTradingHistory" />}
                                    icon="zmdi zmdi-calendar-note"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                </div>
                <Drawer
                    width={componentName === 'PersonalInformationDashboard' ? '50%' : '100%'}
                    handler={false}
                    open={open}
                    placement="right"
                    className={componentName === 'PersonalInformationDashboard' ? "drawer1 half_drawer" : "drawer1"}
                    level=".drawer0"
                    levelMove={100}
                    height="100%"
                >
                    {componentName !== "" && <DynamicLoadComponent drawerClose={this.onClick} closeAll={this.closeAll} componentName={componentName} props={this.props} componentTlt={componentTitle} BreadCrumbData={breadcrumb} state={this.state} menuDetail={menuDetail} manageAcc={this.state.manageAcc} TitleBit={this.state.TitleBit} />}
                </Drawer>
            </div>
        );
    }
}

const mapToProps = ({ drawerclose,authTokenRdcer }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { drawerclose,menuLoading,menu_rights};
}

export default connect(mapToProps, {
    getMenuPermissionByID
})(ManageAccountDashboard);