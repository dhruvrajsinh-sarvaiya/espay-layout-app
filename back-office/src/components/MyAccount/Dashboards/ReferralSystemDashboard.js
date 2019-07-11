/**
 * Created By Sanjay
 * Created Date : 9/02/2019
 * Referral Dashboard 
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import { Row } from 'reactstrap';
import 'rc-drawer/assets/index.css';
import CountUp from 'react-countup';
import fusioncharts from 'fusioncharts';
import charts from 'fusioncharts/fusioncharts.charts';
import ReactFusioncharts from 'react-fusioncharts';
import { FaInstagram, FaFacebookMessenger } from "react-icons/fa";
import { SimpleCard, CountCard } from "./Widgets";
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import { getCountReferralDashboard } from 'Actions/MyAccount';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { JbsCard, JbsCardContent } from 'Components/JbsCard';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { NotificationManager } from "react-notifications";
import AppConfig from 'Constants/AppConfig';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';

//Resolves charts dependancy
charts(fusioncharts);

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
        title: <IntlMessages id="my_account.referralSystem" />,
        link: '',
        index: 1
    }
];

class ReferralSystemDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            viewData: '',
            data: {},
            menudetail: [],
            menuLoading: false
        }
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('10A2DCB3-9F88-05C3-4A83-67A854413F77'); // get myaccount menu permission

    }

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        //Added by Saloni Rathod
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getCountReferralDashboard();
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    window.location.href = AppConfig.afterLoginRedirect;
                }, 2000);
            }
        }
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
            })
        }
        if (nextProps.countsOfReferralDashboard.ReturnCode === 0) {
            this.setState({ data: nextProps.countsOfReferralDashboard.ReferralChannelAdminCount });
        }
    }

    onClick = () => {
        this.setState({ open: this.state.open ? false : true })
    }

    showComponent = (componentName, menuDetail, viewData) => {
        //check permission go on next page or not
        if (menuDetail.HasChild) {
            this.setState({
                viewData: viewData,
                componentName: componentName,
                open: this.state.open ? false : true,
                menuDetail: menuDetail
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    close2Level = () => {
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
        const { componentName, open, viewData, menuDetail } = this.state;
        const { drawerClose, loading } = this.props;
        const { TotalParticipants, Invite, Clicks, Converts, EmailInvite, FacebookShare, TwitterShare, SMSInvite, LinkedIn, Messenger, WhatsApp, InstaShare, Pinterest, Telegram } = this.state.data;
        const dataSource = {
            "chart": {
                "caption": "Referral Invites Statistics",
                "showlegend": "1",
                "legendPosition": "RIGHT",
                "showpercentvalues": "1",
                "usedataplotcolorforlabels": "1",
                "theme": "fusion",
                "showLabels": "0",
                "showValues": "0"
            },
            "data": [
                {
                    "label": "EmailInvite",
                    "value": EmailInvite
                },
                {
                    "label": "SMSInvite",
                    "value": SMSInvite
                },
                {
                    "label": "FacebookShare",
                    "value": FacebookShare
                },
                {
                    "label": "TwitterShare",
                    "value": TwitterShare
                },
                {
                    "label": "LinkedIn",
                    "value": LinkedIn
                },
                {
                    "label": "Messenger",
                    "value": Messenger
                },
                {
                    "label": "Whatsapp",
                    "value": WhatsApp
                },
                {
                    "label": "InstaShare",
                    "value": InstaShare
                },
                {
                    "label": "Pinterest",
                    "value": Pinterest
                },
                {
                    "label": "Telegram",
                    "value": Telegram
                }
            ]
        };

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="my_account.referralSystem" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('169D9798-3351-A3FC-0032-AEC5FDE17AB4') && //169D9798-3351-A3FC-0032-AEC5FDE17AB4
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListReferralParticipate', this.checkAndGetMenuAccessDetail('169D9798-3351-A3FC-0032-AEC5FDE17AB4'))} className="text-dark col-sm-full">
                                <CountCard
                                    title={<IntlMessages id="my_account.participant" />}
                                    count={TotalParticipants > 0 ? TotalParticipants : 0}
                                    icon="icon-people"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('2FAF811F-26A9-4058-7A00-F69B17667B20') && //2FAF811F-26A9-4058-7A00-F69B17667B20
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListReferralInvite', this.checkAndGetMenuAccessDetail('2FAF811F-26A9-4058-7A00-F69B17667B20'))} className="text-dark col-sm-full">
                                <CountCard
                                    title={<IntlMessages id="my_account.invites" />}
                                    count={Invite > 0 ? Invite : 0}
                                    icon="ti-sharethis"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('98F71172-640A-2965-94D9-4DEB8B049ED3') && //98F71172-640A-2965-94D9-4DEB8B049ED3
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ClickOnReferralLinkReport', this.checkAndGetMenuAccessDetail('98F71172-640A-2965-94D9-4DEB8B049ED3'))} className="text-dark col-sm-full">
                                <CountCard
                                    title={<IntlMessages id="my_account.clicks" />}
                                    count={Clicks > 0 ? Clicks : 0}
                                    icon="ti-hand-point-up"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('B0F0B462-5081-857A-A3F7-64BA1FF0499A') && //B0F0B462-5081-857A-A3F7-64BA1FF0499A
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListReferralRewards', this.checkAndGetMenuAccessDetail('B0F0B462-5081-857A-A3F7-64BA1FF0499A'))} className="text-dark col-sm-full">
                                <CountCard
                                    title={<IntlMessages id="my_account.converts" />}
                                    count={Converts > 0 ? Converts : 0}
                                    icon="ti-shopping-cart"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                </div>
                <Row>
                    <div className="col-md-6 col-sm-12 col-xs-12">
                        <Row>
                            {this.checkAndGetMenuAccessDetail('F35359EA-948E-40DC-727F-BF4592374944') && //F35359EA-948E-40DC-727F-BF4592374944
                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListInviteVieEmailAndSMS', this.checkAndGetMenuAccessDetail('F35359EA-948E-40DC-727F-BF4592374944'), 1)} className="text-dark col-sm-full">
                                        <CountCard
                                            title={<IntlMessages id="my_account.emialInvite" />}
                                            count={EmailInvite > 0 ? EmailInvite : 0}
                                            icon="zmdi zmdi-email"
                                            bgClass="bg-dark"
                                            clickEvent={this.onClick}
                                        />
                                    </a>
                                </div>}
                            {this.checkAndGetMenuAccessDetail('6860BA14-1301-2E85-2E66-9723783B1037') && //6860BA14-1301-2E85-2E66-9723783B1037
                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListInviteVieEmailAndSMS', this.checkAndGetMenuAccessDetail('6860BA14-1301-2E85-2E66-9723783B1037'), 2)} className="text-dark col-sm-full">
                                        <CountCard
                                            title={<IntlMessages id="my_account.smsInvite" />}
                                            count={SMSInvite > 0 ? SMSInvite : 0}
                                            icon="ti-themify-favicon-alt"
                                            bgClass="bg-dark"
                                            clickEvent={this.onClick}
                                        />
                                    </a>
                                </div>}
                            {this.checkAndGetMenuAccessDetail('5D27E97C-0D4F-421D-8563-44CBB9B35156') && //5D27E97C-0D4F-421D-8563-44CBB9B35156
                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListSocialMediaInvite', this.checkAndGetMenuAccessDetail('5D27E97C-0D4F-421D-8563-44CBB9B35156'), 3)} className="text-dark col-sm-full">
                                        <CountCard
                                            title={<IntlMessages id="my_account.facebookShare" />}
                                            count={FacebookShare > 0 ? FacebookShare : 0}
                                            icon="ti-facebook"
                                            bgClass="bg-dark"
                                            clickEvent={this.onClick}
                                        />
                                    </a>
                                </div>}
                            {this.checkAndGetMenuAccessDetail('27B288D9-9B7E-3F82-2706-780266026F76') && //27B288D9-9B7E-3F82-2706-780266026F76
                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListSocialMediaInvite', this.checkAndGetMenuAccessDetail('27B288D9-9B7E-3F82-2706-780266026F76'), 4)} className="text-dark col-sm-full">
                                        <CountCard
                                            title={<IntlMessages id="my_account.twitterShare" />}
                                            count={TwitterShare > 0 ? TwitterShare : 0}
                                            icon="ti-twitter-alt"
                                            bgClass="bg-dark"
                                            clickEvent={this.onClick}
                                        />
                                    </a>
                                </div>}
                            {this.checkAndGetMenuAccessDetail('B25F1A43-3560-6A59-21F3-815637301606') && //B25F1A43-3560-6A59-21F3-815637301606
                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListSocialMediaInvite', this.checkAndGetMenuAccessDetail('B25F1A43-3560-6A59-21F3-815637301606'), 5)} className="text-dark col-sm-full">
                                        <CountCard
                                            title={<IntlMessages id="my_account.linkedinShare" />}
                                            count={LinkedIn > 0 ? LinkedIn : 0}
                                            icon="ti-linkedin"
                                            bgClass="bg-dark"
                                            clickEvent={this.onClick}
                                        />
                                    </a>
                                </div>}
                            {this.checkAndGetMenuAccessDetail('1FA8F586-9706-9DC2-4B6F-137D47225744') && //1FA8F586-9706-9DC2-4B6F-137D47225744
                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListSocialMediaInvite', this.checkAndGetMenuAccessDetail('1FA8F586-9706-9DC2-4B6F-137D47225744'), 6)} className="text-dark col-sm-full">
                                        <JbsCard colClasses="col-sm-full">
                                            <JbsCardContent>
                                                <div className="d-flex justify-content-between">
                                                    <div className="align-items-end">
                                                        <h1 className="accountcommoncard display-4 font-weight-light"><FaFacebookMessenger /></h1>
                                                    </div>
                                                    <div className="text-right">
                                                        <h1 className="font-weight-bold font-2x lh_100"><CountUp separator="," start={0} end={Messenger} /></h1>
                                                        <h2 className="fs-18 d-block font-weight-normal m-0 lh_100">{<IntlMessages id="my_account.messenger" />}</h2>
                                                    </div>
                                                </div>
                                            </JbsCardContent>
                                        </JbsCard>
                                    </a>
                                </div>}
                            {this.checkAndGetMenuAccessDetail('62631C7A-3BC4-5E46-5B0C-9FA8E9601A1B') && //62631C7A-3BC4-5E46-5B0C-9FA8E9601A1B
                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListSocialMediaInvite', this.checkAndGetMenuAccessDetail('62631C7A-3BC4-5E46-5B0C-9FA8E9601A1B'), 7)} className="text-dark col-sm-full">
                                        <JbsCard colClasses="col-sm-full">
                                            <JbsCardContent>
                                                <div className="d-flex justify-content-between">
                                                    <div className="align-items-end">
                                                        <h1 className="accountcommoncard display-4 font-weight-light"><FaInstagram /></h1>
                                                    </div>
                                                    <div className="text-right">
                                                        <h1 className="font-weight-bold font-2x lh_100"><CountUp separator="," start={0} end={InstaShare} /></h1>
                                                        <h2 className="fs-18 d-block font-weight-normal m-0 lh_100">{<IntlMessages id="my_account.instaShare" />}</h2>
                                                    </div>
                                                </div>
                                            </JbsCardContent>
                                        </JbsCard>
                                    </a>
                                </div>}
                            {this.checkAndGetMenuAccessDetail('577BE6C5-5478-825E-6E51-7BD2FB8A038D') && //577BE6C5-5478-825E-6E51-7BD2FB8A038D
                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListSocialMediaInvite', this.checkAndGetMenuAccessDetail('577BE6C5-5478-825E-6E51-7BD2FB8A038D'), 8)} className="text-dark col-sm-full">
                                        <CountCard
                                            title={<IntlMessages id="my_account.pinterest" />}
                                            count={Pinterest > 0 ? Pinterest : 0}
                                            icon="ti-pinterest-alt"
                                            bgClass="bg-dark"
                                            clickEvent={this.onClick}
                                        />
                                    </a>
                                </div>}
                            {this.checkAndGetMenuAccessDetail('F745F514-8812-70D2-1B2D-496AE55B3558') && //F745F514-8812-70D2-1B2D-496AE55B3558
                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListSocialMediaInvite', this.checkAndGetMenuAccessDetail('F745F514-8812-70D2-1B2D-496AE55B3558'), 9)} className="text-dark col-sm-full">
                                        <CountCard
                                            title={<IntlMessages id="my_account.telegram" />}
                                            count={Telegram > 0 ? Telegram : 0}
                                            icon="fa fa-telegram"
                                            bgClass="bg-dark"
                                            clickEvent={this.onClick}
                                        />
                                    </a>
                                </div>}
                        </Row>
                    </div>
                    {this.checkAndGetMenuAccessDetail('742C3190-8457-A3FE-739E-685610E5422F') && //742C3190-8457-A3FE-739E-685610E5422F
                        <div className="col-md-6 col-sm-12 col-xs-12 mb-25 refer_chart">
                            <ReactFusioncharts
                                type="pie2d"
                                dataFormat="JSON"
                                width="100%"
                                height="100%"
                                dataSource={dataSource} />
                        </div>}
                </Row>
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('AD6FE99F-6CA2-32AF-6238-09B17BBB9434') && //AD6FE99F-6CA2-32AF-6238-09B17BBB9434
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ReferralRewardConfigDashboard', this.checkAndGetMenuAccessDetail('AD6FE99F-6CA2-32AF-6238-09B17BBB9434'))} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.rewardConfig" />}
                                    icon="icon-settings"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('EB439920-A565-75AC-3542-5E9262841C83') && //EB439920-A565-75AC-3542-5E9262841C83
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ReferralPayTypeDashboard', this.checkAndGetMenuAccessDetail('EB439920-A565-75AC-3542-5E9262841C83'))} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.referralPayType" />}
                                    icon="ti-credit-card"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('B3F0F02D-696C-36C2-175D-C64BE77E2E2F') && //B3F0F02D-696C-36C2-175D-C64BE77E2E2F
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ReferralChannelTypeDashboard', this.checkAndGetMenuAccessDetail('B3F0F02D-696C-36C2-175D-C64BE77E2E2F'))} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.referralChannelType" />}
                                    icon="ti-pin-alt"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('34883BBA-9748-6FC4-A52B-80E687B75D09') && //34883BBA-9748-6FC4-A52B-80E687B75D09
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ReferralServiceTypeDashboard', this.checkAndGetMenuAccessDetail('34883BBA-9748-6FC4-A52B-80E687B75D09'))} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.referralServiceTypeDashboard" />}
                                    icon="zmdi zmdi-wrench"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('4CF652B2-019C-103A-84F6-69F8FF5F66BA') && //4CF652B2-019C-103A-84F6-69F8FF5F66BA
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ReferralServiceDetailDashboard',this.checkAndGetMenuAccessDetail('4CF652B2-019C-103A-84F6-69F8FF5F66BA'))} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.referralServiceDetail" />}
                                    icon="fa fa-clone"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('7FF02580-414E-0582-2154-6D22C9B90FB3') && //7FF02580-414E-0582-2154-6D22C9B90FB3
                        <div className="col-md-3 col-sm-6 col-xs-12">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ReferralSchemeTypeMappingDashboard',this.checkAndGetMenuAccessDetail('7FF02580-414E-0582-2154-6D22C9B90FB3'))} className="text-dark col-sm-full">
                            <SimpleCard
                                title={<IntlMessages id="sidebar.referralSchemeTypeMapping" />}
                                icon="fa fa-clone"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>}
            </div>
                <Drawer
                    width={componentName === 'ConfigurationSetupDashboard' ? '50%' : '100%'}
                    handler={false}
                    open={open}
                    placement="right"
                    className={componentName === 'ConfigurationSetupDashboard' ? "drawer1 half_drawer" : "drawer1"}
                    level=".drawer0"
                    levelMove={100}
                    height="100%"
                >
                    {componentName !== '' &&
                        <DynamicLoadComponent componentName={componentName} close2Level={this.close2Level} drawerClose={this.onClick} closeAll={this.closeAll} pagedata={viewData} props={this.props} state={this.state} menuDetail={menuDetail} />}
                </Drawer>
            </div>
        )
    }
}

const mapStateToProps = ({ ReferralDashboardReducer, drawerclose, authTokenRdcer }) => {
    const { countsOfReferralDashboard, loading } = ReferralDashboardReducer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    return { countsOfReferralDashboard, loading, drawerclose, menuLoading, menu_rights };
}

export default connect(mapStateToProps, {
    getCountReferralDashboard,
    getMenuPermissionByID
})(ReferralSystemDashboard);