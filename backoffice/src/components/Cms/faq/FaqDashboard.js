/* 
    Created By : Megha Kariya
    Date : 05-02-2019
    File Comment : CMS FAQ Dashboard Component
*/
import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { SimpleCard, CountCard } from '../DashboardWidgets';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { DashboardPageTitle } from '../DashboardPageTitle';
// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import { getCmsDashboardFaqCount } from "Actions/CmsDashboard";
import { getMenuPermissionByID } from 'Actions/MyAccount';
import FaqCategories from './categories';
import FaqQuestions from './questions';
import { NotificationManager } from "react-notifications";
import AppConfig from 'Constants/AppConfig';
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
        title: <IntlMessages id="sidebar.cms" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.faq" />,
        link: '',
        index: 0
    }
];


// componenet listing
const components = {
    FaqCategories: FaqCategories,
    FaqQuestions: FaqQuestions
};
// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, close2Level, closeAll) => {
    return React.createElement(components[TagName], { props, drawerClose, close2Level, closeAll });
};
// Component for MyAccount Organization Information dashboard
class FaqDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            loading: false,
            data: {},
            menudetail: [],
            Pflag: [],
        }
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('89895B4F-56FF-6329-9A7C-051F9F3286B5');
    }

    componentWillReceiveProps(nextProps) {
        // update menu details if not set 
        if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) && this.state.Pflag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getCmsDashboardFaqCount();
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    this.props.drawerClose();
                }, 2000);
            }
            this.setState({ Pflag: false })
        }
        this.setState({ loading: nextProps.loading });
    }

    onClick = () => {
        this.setState({
            open: !this.state.open,
        })
        this.reload();
    }

    showComponent = (componentName, permission) => {
        // check permission go on next page or not
        if (permission) {
            this.setState({
                componentName: componentName,
                open: !this.state.open,
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
        this.reload();
    }
    reload() {
        this.props.getCmsDashboardFaqCount();
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
        const { componentName, open, permission } = this.state;
        const { drawerClose, loading } = this.props;

        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="sidebar.faq" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(loading || this.props.menuLoading) && <JbsSectionLoader />}

                <div className="row">
                    {this.checkAndGetMenuAccessDetail('B2D2F534-7887-7C6A-5BB3-15C5AF543D89') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('FaqCategories', (this.checkAndGetMenuAccessDetail('B2D2F534-7887-7C6A-5BB3-15C5AF543D89')).HasChild)} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="sidebar.Faq-Categories" />}
                                    count={(typeof this.props.FaqCategoriesCount != "undefined") ? this.props.FaqCategoriesCount : 0}
                                    icon="zmdi zmdi-help"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('8C722FB9-8559-6A53-1011-24B2717C91D2') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('FaqQuestions', (this.checkAndGetMenuAccessDetail('8C722FB9-8559-6A53-1011-24B2717C91D2')).HasChild)} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="sidebar.Faq-Questions" />}
                                    count={(typeof this.props.FaqQuestionsCount != 'undefined') ? this.props.FaqQuestionsCount : 0}
                                    icon="zmdi zmdi-help-outline"
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
                    open={open}
                    className="drawer2"
                    level=".drawer1"
                    placement="right"
                    levelMove={100}
                >
                    {componentName != '' && dynamicComponent(componentName, this.props, this.onClick, this.close2Level, this.closeAll)}
                </Drawer>
            </div>
        );
    }
}

const mapToProps = ({ cmsDashboard, authTokenRdcer }) => {
    var response = {
        FaqCategoriesCount: cmsDashboard.faqCount.FaqCategories,
        FaqQuestionsCount: cmsDashboard.faqCount.FaqQuestions,
        menuLoading: authTokenRdcer.menuLoading,
        menu_rights: authTokenRdcer.menu_rights,
    };
    return response;
}

export default connect(mapToProps, {
    getCmsDashboardFaqCount,
    getMenuPermissionByID,
})(FaqDashboard);