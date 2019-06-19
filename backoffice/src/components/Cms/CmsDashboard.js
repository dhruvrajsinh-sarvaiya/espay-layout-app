/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 23-11-2018
    UpdatedDate : 23-11-2018
    Description : CMS Dashboard Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { SimpleCard, CountCard } from './DashboardWidgets';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
// jbs section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import Pages from './pages';
// import FaqCategories from './faq/categories';
// import FaqQuestions from './faq/questions';
import FaqDashboard from './faq/FaqDashboard';
import News from './news';
import Contactus from './contactus';
import SiteSetting from './sitesetting';
// import LanguagesConfig from './languages';
import LanguagesDashboard from './languages/LanguagesDashboard';
//Added by Jayesh 04-01-2018 
import Surveys from './surveys';
// import EmailTemplates from './emailtemplates';
// import EmailTemplatesConfiguration from './emailtemplatesconfiguration';
import EmailTemplatesDashboard from './emailTemplateList/EmailTemplatesDashboard';
import Regions from './regions';
// import HelpManualModule from './help/helpmanualmodule';
// import HelpManual from './help/helpmanual';
import HelpManualDashboard from './help/HelpManualDashboard';
// import CoinListRequest from './coinListRequest';
// import CoinListFields from './coinListFields';
import CoinListDashboard from './coinList/CoinListDashboard';
import PolicyManagement from './policymanagement';
//Added by Jayesh 17-01-2019
// import AddCrmForm from './zohocrmform';
import MessagingQueueWdgt from './messagequeue';
import PushMessageWdgt from './pushmessage';
import EmailQueueWdgt from './emailqueue';
import PushEmail from './pushemail';
import SocialMedias from './socialMedia';
//Added By Sanjay 27-05-2019
import HTMLBlocks from "./htmlblocks";
import ImageSliders from "./imagesliders";
import AdvanceHTMLBlocks from './advancehtmlblocks';
//Import CMS Dashboard Actions...
import { 
    getCmsDashboardPagesCount, 
    getCmsDashboardNewsCount, 
    getCmsDashboardContactusCount, 
    getCmsDashboardSurveysCount, 
    getCmsDashboardRegionsCount, 
    getCmsDashboardHTMLBlocksCount,
    getCmsDashboardImageSlidersCount,
    getCmsDashboardAdvanceHTMLBlocksCount 
} from "Actions/CmsDashboard";
import { getMenuPermissionByID } from 'Actions/MyAccount';
// Added By Megha Kariya (04/02/2019)
import { getLanguage } from 'Actions/Language';
import { getCountry } from 'Actions/Localization';
import { getSiteSettingInfo } from 'Actions/SiteSetting';
// Added By Megha Kariya (20/02/2019)
import EmailApiManager from './emailApiManager';
import RequestFormatApiManagerWdgt from './RequestFormatApiManager';
import { NotificationManager } from "react-notifications";
import AppConfig from 'Constants/AppConfig';
// componenet listing
const components = {
    Pages: Pages,
    // FaqCategories: FaqCategories,
    // FaqQuestions: FaqQuestions,
    FaqDashboard: FaqDashboard,
    News: News,
    Contactus: Contactus,
    SiteSetting: SiteSetting,
    // LanguagesConfig: LanguagesConfig,
    LanguagesDashboard: LanguagesDashboard,
    //Added by Jayesh - 04-01-2018
    Surveys: Surveys,
    // EmailTemplates: EmailTemplates,
    // EmailTemplatesConfiguration: EmailTemplatesConfiguration,
    EmailTemplatesDashboard: EmailTemplatesDashboard,
    Regions: Regions,
    // HelpManualModule: HelpManualModule,
    // HelpManual: HelpManual,
    HelpManualDashboard: HelpManualDashboard,
    // CoinListRequest: CoinListRequest,
    // CoinListFields: CoinListFields,
    CoinListDashboard: CoinListDashboard,
    PolicyManagement: PolicyManagement,
    // AddCrmForm: AddCrmForm,
    MessagingQueueWdgt: MessagingQueueWdgt,
    PushMessageWdgt: PushMessageWdgt,
    EmailQueueWdgt: EmailQueueWdgt,
    PushEmail: PushEmail,
    SocialMedias: SocialMedias,
    // Added By Megha Kariya (20/02/2019)
    EmailApiManager: EmailApiManager,
    RequestFormatApiManagerWdgt: RequestFormatApiManagerWdgt,
    //Added By Sanjay 
    HTMLBlocks: HTMLBlocks,
    ImageSliders: ImageSliders,
    AdvanceHTMLBlocks: AdvanceHTMLBlocks
};
// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll });
};

// Component for CMS dashboard
class CmsDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            loading: false, // loading activity
            errors: {},
            err_msg: "",
            err_alert: true,
            pagesCount: 0,
            policyManagementCount: 0,
            newsCount: 0,
            contactusCount: 0,
            surveysCount: 0,
            regionsCount: 0,
            menudetail: [],
            Pflag: true,
            htmlBlocksCount: 0,
            imageSlidersCount: 0,
            advanceHtmlBlocksCount: 0
        };
        this.onDismiss = this.onDismiss.bind(this);
    }

    onDismiss() {
        let err = delete this.state.errors['message'];
        this.setState({ err_alert: false, errors: err });
    }

    onClose = () => {
        this.setState({
            open: !this.state.open,
            pagesCount: 0,
            policyManagementCount: 0,
            newsCount: 0,
            contactusCount: 0,
            surveysCount: 0,
            regionsCount: 0,
            htmlBlocksCount: 0,
            imageSlidersCount: 0,
            advanceHtmlBlocksCount: 0
        });
        this.reload();
    }

    onClick = () => {
        this.setState({
            dashboarddata: {},
            open: false,
            pagesCount: 0,
            policyManagementCount: 0,
            newsCount: 0,
            contactusCount: 0,
            surveysCount: 0,
            regionsCount: 0,
            htmlBlocksCount: 0,
            imageSlidersCount: 0,
            advanceHtmlBlocksCount: 0
        });
        this.reload();
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('38868F8E-11F7-A6B5-A520-E9D0E1514A5F');
    }

    // when close drawer its call reload method
    reload() {
        this.props.getCmsDashboardPagesCount();
        this.props.getCmsDashboardNewsCount();
        this.props.getCmsDashboardContactusCount();
        this.props.getCmsDashboardSurveysCount();
        this.props.getCmsDashboardRegionsCount();
        this.props.getCmsDashboardHTMLBlocksCount();
        this.props.getCmsDashboardImageSlidersCount();
        this.props.getCmsDashboardAdvanceHTMLBlocksCount();
    }

    componentWillReceiveProps(nextProps) {
        // update menu details if not set 
        if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getCmsDashboardPagesCount();
                this.props.getCmsDashboardNewsCount();
                this.props.getCmsDashboardContactusCount();
                this.props.getCmsDashboardSurveysCount();
                this.props.getCmsDashboardRegionsCount();
                this.props.getCmsDashboardHTMLBlocksCount();
                this.props.getCmsDashboardImageSlidersCount();
                this.props.getCmsDashboardAdvanceHTMLBlocksCount();
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    window.location.href = AppConfig.afterLoginRedirect;
                }, 2000);
            }
            this.setState({ Pflag: false })
        }
        this.setState({
            loading: nextProps.loading
        });
    }

    showComponent = (componentName, permission) => {
        // check permission go on next page or not
        if (permission) {
            // Added By Megha Kariya (04/02/2019)
            if (componentName !== '' && componentName === 'SiteSetting') {
                this.props.getLanguage();
                this.props.getCountry({ page: 'all' });
                this.props.getSiteSettingInfo(1);
            }
            this.setState({
                componentName: componentName,
                open: !this.state.open,
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    closeAll = () => {
        this.setState({
            open: false,
        });
        this.reload();
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
        const { componentName, open, loading, err_alert, errors } = this.state;
        const { pagesCount } = this.props;

        return (
            <Fragment>
                <div className="row">
                    {(loading || this.props.menuLoading) && <JbsSectionLoader />}
                    {this.checkAndGetMenuAccessDetail('5DBD47D4-1E19-2253-9CB6-76E2226D8452') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('Pages', (this.checkAndGetMenuAccessDetail('5DBD47D4-1E19-2253-9CB6-76E2226D8452')).HasChild)} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="sidebar.pages" />}
                                    count={(typeof this.props.pagesCount != "undefined") ? this.props.pagesCount : 0}
                                    icon="zmdi zmdi-view-web"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('A4BC58C8-96DF-6425-55A2-0513D5464A3A') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('PolicyManagement', (this.checkAndGetMenuAccessDetail('A4BC58C8-96DF-6425-55A2-0513D5464A3A')).HasChild)} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="sidebar.policymanagement" />}
                                    count={(typeof this.props.policyManagementCount != "undefined") ? this.props.policyManagementCount : 0}
                                    icon="zmdi zmdi-view-web"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {/* Added By Megha Kariya (05-02-2019) */}
                    {this.checkAndGetMenuAccessDetail('89895B4F-56FF-6329-9A7C-051F9F3286B5') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('FaqDashboard', (this.checkAndGetMenuAccessDetail('89895B4F-56FF-6329-9A7C-051F9F3286B5')).HasChild)} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.faq" />}
                                    icon="zmdi zmdi-help-outline"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />

                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('BF144589-69FA-3637-2F9F-3F5F006661EC') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('News', (this.checkAndGetMenuAccessDetail('BF144589-69FA-3637-2F9F-3F5F006661EC')).HasChild)} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="sidebar.news" />}
                                    count={(typeof this.props.newsCount != 'undefined') ? this.props.newsCount : 0}
                                    icon="zmdi zmdi-notifications"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('3C2684B7-98A4-2388-0EF8-0A5006CD21BA') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('Contactus', (this.checkAndGetMenuAccessDetail('3C2684B7-98A4-2388-0EF8-0A5006CD21BA')).HasChild)} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="sidebar.contactUs" />}
                                    count={(typeof this.props.contactusCount != 'undefined') ? this.props.contactusCount : 0}
                                    icon="zmdi zmdi-account-box"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('86D8E511-1BDC-61C0-6DA0-F8235070A588') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('SiteSetting', (this.checkAndGetMenuAccessDetail('86D8E511-1BDC-61C0-6DA0-F8235070A588')).HasChild)} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.sitesetting" />}
                                    icon="zmdi zmdi-settings"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('FE118EA0-580C-0B11-78AB-E9F63B763F32') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('LanguagesDashboard', (this.checkAndGetMenuAccessDetail('FE118EA0-580C-0B11-78AB-E9F63B763F32')).HasChild)} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.languages" />}
                                    icon="zmdi zmdi-settings"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {/* Added by Jayesh for Surveys & Templates & TemplatesConfiguration */}
                    {this.checkAndGetMenuAccessDetail('21B5873A-9A15-465A-1BCE-5064A48E1E7F') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('Surveys', (this.checkAndGetMenuAccessDetail('21B5873A-9A15-465A-1BCE-5064A48E1E7F')).HasChild)} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="sidebar.surveys" />}
                                    count={(typeof this.props.surveysCount != 'undefined') ? this.props.surveysCount : 0}
                                    icon="zmdi zmdi-assignment"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('48899E46-090A-09D5-296D-32CD4EB8952C') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('EmailTemplatesDashboard', (this.checkAndGetMenuAccessDetail('48899E46-090A-09D5-296D-32CD4EB8952C')).HasChild)} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.templates" />}
                                    icon="zmdi zmdi-email"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('350C7050-034C-A0CE-6CD7-D8D1F10E30AE') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('Regions', (this.checkAndGetMenuAccessDetail('350C7050-034C-A0CE-6CD7-D8D1F10E30AE')).HasChild)} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="sidebar.regions" />}
                                    count={(typeof this.props.regionsCount != 'undefined') ? this.props.regionsCount : 0}
                                    icon="zmdi zmdi-view-web"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('8481C365-4D1D-3479-9719-FC57274A95E6') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('HelpManualDashboard', (this.checkAndGetMenuAccessDetail('8481C365-4D1D-3479-9719-FC57274A95E6')).HasChild)} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.help" />}
                                    icon="zmdi zmdi-help-outline"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />

                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('D34203BD-5D27-041F-5A73-167E86F87307') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('CoinListDashboard', (this.checkAndGetMenuAccessDetail('D34203BD-5D27-041F-5A73-167E86F87307')).HasChild)} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.coinList" />}
                                    icon="zmdi zmdi-blur-circular"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    { /* Added by Jayesh 30-01-2019 move from page to drawer : word by meghaben & jinesh  */}
                    {this.checkAndGetMenuAccessDetail('13CBECED-267F-589B-5D8F-6472A00C1612') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('MessagingQueueWdgt', (this.checkAndGetMenuAccessDetail('13CBECED-267F-589B-5D8F-6472A00C1612')).HasChild)} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="messageQueue.title.report" />}
                                    icon="zmdi zmdi-code-smartphone"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('9C8E9AB0-14D6-391F-29B7-A55B55C66AE0') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('EmailQueueWdgt', (this.checkAndGetMenuAccessDetail('9C8E9AB0-14D6-391F-29B7-A55B55C66AE0')).HasChild)} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.emailQueueReport" />}
                                    icon="zmdi zmdi-email"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('6083249D-39A5-0D86-9D72-B1CCCB5E3732') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('PushMessageWdgt', (this.checkAndGetMenuAccessDetail('6083249D-39A5-0D86-9D72-B1CCCB5E3732')).HasChild)} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="pushMessage.sendMessageUser" />}
                                    icon="zmdi zmdi-code-smartphone"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('EF0CA6BC-4A0D-1C08-74C8-779360AA4DBC') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('PushEmail', (this.checkAndGetMenuAccessDetail('EF0CA6BC-4A0D-1C08-74C8-779360AA4DBC')).HasChild)} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.PushEmail" />}
                                    icon="zmdi zmdi-email"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {/* Added by Megha Kariya (12/02/2019) */}
                    {this.checkAndGetMenuAccessDetail('10D1F8C0-5207-9D0A-23E7-EAE6A83A84EA') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('SocialMedias', (this.checkAndGetMenuAccessDetail('10D1F8C0-5207-9D0A-23E7-EAE6A83A84EA')).HasChild)} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.SocialMedia" />}
                                    icon="zmdi zmdi-share" // Change icon by Megha Kariya (23/02/2019)
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {/* Added By Megha Kariya (20/02/2019) */}
                    {this.checkAndGetMenuAccessDetail('95A5477B-A036-2026-1ADC-902E77021D42') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('EmailApiManager', (this.checkAndGetMenuAccessDetail('95A5477B-A036-2026-1ADC-902E77021D42')).HasChild)} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="emailAPIManager.PageTitle" />}
                                    icon="zmdi zmdi-card"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('652FF8FE-9544-5471-9F4A-F6F0563E8612') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('RequestFormatApiManagerWdgt', (this.checkAndGetMenuAccessDetail('652FF8FE-9544-5471-9F4A-F6F0563E8612')).HasChild)} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.requestformet" />}
                                    icon="zmdi zmdi-card"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('350C7050-034C-A0CE-6CD7-D8D1F10E30AE') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('HTMLBlocks', (this.checkAndGetMenuAccessDetail('350C7050-034C-A0CE-6CD7-D8D1F10E30AE')).HasChild)} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="sidebar.HTMLBlocks" />}
                                    count={(typeof this.props.htmlBlocksCount !== 'undefined') ? this.props.htmlBlocksCount : 0}
                                    icon="zmdi zmdi-view-web"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('350C7050-034C-A0CE-6CD7-D8D1F10E30AE') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ImageSliders', (this.checkAndGetMenuAccessDetail('350C7050-034C-A0CE-6CD7-D8D1F10E30AE')).HasChild)} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="sidebar.ImageSliders" />}
                                    count={(typeof this.props.imageSlidersCount !== 'undefined') ? this.props.imageSlidersCount : 0}
                                    icon="zmdi zmdi-view-web"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('350C7050-034C-A0CE-6CD7-D8D1F10E30AE') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AdvanceHTMLBlocks', (this.checkAndGetMenuAccessDetail('350C7050-034C-A0CE-6CD7-D8D1F10E30AE')).HasChild)} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="sidebar.AdvanceHTMLBlocks" />}
                                    count={(typeof this.props.advancehtmlBlocksCount !== 'undefined') ? this.props.advancehtmlBlocksCount : 0}
                                    icon="zmdi zmdi-view-web"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                </div>
                <Drawer
                    width="100%"
                    handler={false}
                    open={this.state.open}
                    //Added by Meghaben 29-01-2019
                    className="drawer2"
                    level=".drawer1"
                    placement="right"
                    levelMove={100}
                >
                    {componentName !== '' && dynamicComponent(componentName, this.props, this.onClick, this.closeAll)}
                </Drawer>
            </Fragment>
        );
    }
}

const mapStateToProps = ({ cmsDashboard, authTokenRdcer }) => {
    var response = {
        data: cmsDashboard.data,
        loading: cmsDashboard.loading,
        pagesCount: cmsDashboard.pagesCount.pagesCount,
        policyManagementCount: cmsDashboard.pagesCount.policyManagementCount,
        newsCount: cmsDashboard.newsCount.newsCount,
        contactusCount: cmsDashboard.contactusCount.contactUsCount,
        surveysCount: cmsDashboard.surveysCount.surveysCount,
        regionsCount: cmsDashboard.regionsCount.regionsCount,
        menuLoading: authTokenRdcer.menuLoading,
        menu_rights: authTokenRdcer.menu_rights,
        htmlBlocksCount: cmsDashboard.htmlBlocksCount.htmlBlocksCount,
        imageSlidersCount: cmsDashboard.imageSlidersCount.imageSliderCount,
        advancehtmlBlocksCount: cmsDashboard.advancehtmlBlocksCount.AdvanceHtmlBlocksCount
    };
    return response;
};

export default connect(
    mapStateToProps, 
    { 
        getCmsDashboardHTMLBlocksCount, 
        getCmsDashboardPagesCount, 
        getCmsDashboardNewsCount, 
        getCmsDashboardContactusCount, 
        getCmsDashboardSurveysCount, 
        getCmsDashboardRegionsCount, 
        getLanguage, 
        getCountry, 
        getSiteSettingInfo, 
        getMenuPermissionByID,
        getCmsDashboardImageSlidersCount,
        getCmsDashboardAdvanceHTMLBlocksCount 
    })(CmsDashboard); // Added By Megha Kariya (04/02/2019)