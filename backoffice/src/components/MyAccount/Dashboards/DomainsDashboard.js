/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    update by Sanjay : 06-02-2019 (code for drawar), Bharat Jograna (BreadCrumb)09 March 2019
    File Comment : MyAccount Domain Dashboard Component
*/
import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { SimpleCard, CountCard } from './Widgets';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
// import { DashboardPageTitle } from './DashboardPageTitle';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { getDomainData } from 'Actions/MyAccount';
import CircularProgress from '@material-ui/core/CircularProgress';
import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';

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
        title: <IntlMessages id="sidebar.organizationInfo" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.domainDashboard" />,
        link: '',
        index: 2
    }
];

// Component for MyAccount Domain Dashboard
class DomainsDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            loading: false,
            data: {},
        }
    }

    onClick = () => {
        this.setState({
            open: !this.state.open,
        })
    }

    componentWillMount() {
        this.props.getDomainData();
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
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({ open: false });
        }

        this.setState({ loading: nextProps.loading });
        if (Object.keys(nextProps.domainDashData).length > 0 && Object.keys(nextProps.domainDashData.TotalCountDomain).length > 0) {
            this.setState({ data: nextProps.domainDashData.TotalCountDomain });
        }
    }


    render() {
        const { TotalDoamin, TotalActiveDomain, TotalDisActiveDomain } = this.state.data;
        const { componentName, open } = this.state;
        const { drawerClose, loading } = this.props;
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.domainDashboard" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {loading && <CircularProgress className="progress-primary" thickness={2} />}
                <div className="row">
                    {checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5') && //2C0CE3EA-5B58-5DA1-9062-1BBBF86D638E
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListDomainDashboard', checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5'))} className="text-dark">
                            <CountCard
                                title={<IntlMessages id="my_account.totalDomains" />}
                                count={TotalDoamin > 0 ? TotalDoamin : 0}
                                icon="zmdi zmdi-globe-alt"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>}
                    {checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5') && //2C0CE3EA-5B58-5DA1-9062-1BBBF86D638E
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListActiveDomainDashboard', checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5'))} className="text-dark">
                            <CountCard
                                title={<IntlMessages id="my_account.activeDomains" />}
                                count={TotalActiveDomain > 0 ? TotalActiveDomain : 0}
                                icon="zmdi zmdi-check"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>}
                    {checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5') && //2C0CE3EA-5B58-5DA1-9062-1BBBF86D638E
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListInActiveDomainDashboard', checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5'))} className="text-dark">
                            <CountCard
                                title={<IntlMessages id="my_account.inactiveDomains" />}
                                count={TotalDisActiveDomain > 0 ? TotalDisActiveDomain : 0}
                                icon="zmdi zmdi-block"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>}
                    {checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5') && //2C0CE3EA-5B58-5DA1-9062-1BBBF86D638E
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddDomainDashboard', checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5'))} className="text-dark">
                            <SimpleCard
                                title={<IntlMessages id="my_account.addDomains" />}
                                icon="zmdi zmdi-plus-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>}
                </div>
                <Drawer
                    width={componentName === 'AddDomainDashboard' ? '50%' : '100%'}
                    handler={null}
                    open={open}
                    onMaskClick={this.onClick}
                    className={null}
                    level={null}
                    placement="right"
                    getContainer={null}
                    showMask={false}
                    height="100%"
                >
                    {componentName !== '' &&
                        <DynamicLoadComponent componentName={componentName} drawerClose={this.onClick} closeAll={this.closeAll} props={this.props} />}
                </Drawer>
            </div>
        );
    }
}
const mapToProps = ({ domainDashRdcer, drawerclose }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }

    const { domainDashData, loading } = domainDashRdcer;
    return { domainDashData, loading, drawerclose };
}

export default connect(mapToProps, {
    getDomainData
})(DomainsDashboard);
