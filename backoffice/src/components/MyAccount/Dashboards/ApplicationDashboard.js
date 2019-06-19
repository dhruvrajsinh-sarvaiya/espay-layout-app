/* eslint-disable no-script-url */
/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    update by Sanjay : 06-02-2019 (code for drawar), Bharat Jograna (BreadCrumb)09 March 2019
    File Comment : MyAccount Application Dashboard Component
*/
import React, { Component } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";
import { SimpleCard, CountCard } from './Widgets';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { getApplicationData } from 'Actions/MyAccount';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import { NotificationManager } from "react-notifications";

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
        title: <IntlMessages id="sidebar.applicationDashboard" />,
        link: '',
        index: 1
    }
];

// Component for MyAccount Application Dashboard
class ApplicationDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            loading: false,
            data: {}
        }
    }

    componentWillMount() {
        this.props.getApplicationData();
    }

    onClick = () => {
        this.setState({
            open: !this.state.open,
        })
    }

    showComponent = (componentName, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail.HasChild) {
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
    }

    componentWillReceiveProps(nextProps) {
        //Added by Bharat Jograna, (BreadCrumb)09 March 2019
        // To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({ open: false });
        }

        this.setState({ loading: nextProps.loading });
        if (Object.keys(nextProps.appDashData).length > 0 && Object.keys(nextProps.appDashData.TotalCountApplication).length > 0) {
            this.setState({ data: nextProps.appDashData.TotalCountApplication });
        }

    }

    render() {
        const { TotalApplication, TotalActiveApplication, TotalDisActiveApplication } = this.state.data;
        const { componentName, open } = this.state;
        const { drawerClose, loading } = this.props;

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.customerDashboard" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {loading && <JbsSectionLoader />}
                <div className="row">
                    {checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5') && //7AEC5D9E-A06E-797D-702F-B645993A1742
                        <div className="col-sm-12 col-md-3 w-xs-full">
                            {loading && <PreloadWidget />}
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('TotalApplicationDashboard', checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5'))} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="my_account.totalApplication" />}
                                    count={TotalApplication > 0 ? TotalApplication : 0}
                                    icon="zmdi zmdi-apps"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5') && //7AEC5D9E-A06E-797D-702F-B645993A1742
                        <div className="col-sm-12 col-md-3 w-xs-full">
                            {loading ? <PreloadWidget />
                                : <a href="javascript:void(0)" onClick={(e) => this.showComponent('ActiveApplicationDashboard', checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5'))} className="text-dark">
                                    <CountCard
                                        title={<IntlMessages id="my_account.activeApplication" />}
                                        count={TotalActiveApplication > 0 ? TotalActiveApplication : 0}
                                        icon="zmdi zmdi-check"
                                        bgClass="bg-dark"
                                        clickEvent={this.onClick}
                                    />
                                </a>
                            }
                        </div>}
                    {checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5') && //7AEC5D9E-A06E-797D-702F-B645993A1742
                        <div className="col-sm-12 col-md-3 w-xs-full">
                            {loading ? <PreloadWidget />
                                : <a href="javascript:void(0)" onClick={(e) => this.showComponent('InactiveApplicationDashboard', checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5'))} className="text-dark">
                                    <CountCard
                                        title={<IntlMessages id="my_account.inactiveApplication" />}
                                        count={TotalDisActiveApplication > 0 ? TotalDisActiveApplication : 0}
                                        icon="zmdi zmdi-block"
                                        bgClass="bg-dark"
                                        clickEvent={this.onClick}
                                    />
                                </a>
                            }
                        </div>}
                    {checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5') && //7AEC5D9E-A06E-797D-702F-B645993A1742
                        <div className="col-sm-12 col-md-3 w-xs-full">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddApplicationDashboard', checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.addApplication" />}
                                    icon="zmdi zmdi-plus-circle"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                </div>
                <Drawer
                    width={componentName === 'AddApplicationDashboard' ? '50%' : '100%'}
                    handler={false}
                    open={open}
                    placement="right"
                    className="drawer1"
                    level=".drawer0"
                    levelMove={100}
                    height="100%"
                >
                    {componentName !== '' &&
                        <DynamicLoadComponent componentName={componentName} drawerClose={this.onClick} closeAll={this.closeAll} props={this.props} />}
                </Drawer>
            </div>
        );
    }
}

const mapToProps = ({ appDashRdcer, drawerclose }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const { appDashData, loading } = appDashRdcer;
    return { appDashData, loading, drawerclose };
}

export default connect(mapToProps, {
    getApplicationData
})(ApplicationDashboard);