/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    update by Sanjay : 06-02-2019 (code for drawar), Bharat Jograna (BreadCrumb)09 March 2019
    File Comment : MyAccount Organization Information Dashboard Component
*/
import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";
import { SimpleCard, CountCard } from './Widgets';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
// import { DashboardPageTitle } from './DashboardPageTitle';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import { getDomainData } from 'Actions/MyAccount';

// added by Bharat Jograna for Loader and NotificationManager
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";


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
    }
];

// Component for MyAccount Organization Information dashboard
class OrganizationInfoDashboard extends Component {
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
            open: !this.state.open
        })
    }

    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: !this.state.open,
        });
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    componentWillMount() {
        this.props.getDomainData();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });
        if (Object.keys(nextProps.domainDashData).length > 0 && Object.keys(nextProps.domainDashData.TotalCountDomain).length > 0) {
            this.setState({ data: nextProps.domainDashData.TotalCountDomain });
        }

        //Added by Bharat Jograna, (BreadCrumb)09 March 2019
        // To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({ open: false });
        }
    }

    render() {
        const { TotalDoamin } = this.state.data;
        const { componentName, open } = this.state;
        const { drawerClose, loading } = this.props;
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.organizationInfo" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {loading && <JbsSectionLoader />}
                <div className="row">
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('OrganizationFormDashboard')} className="text-dark">
                            <SimpleCard
                                title={<IntlMessages id="my_account.organizationInfo" />}
                                icon="zmdi zmdi-assignment-account"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                                className="Organization-main"
                            />
                        </a>
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('DomainsDashboard')} className="text-dark">
                            <CountCard
                                title={<IntlMessages id="my_account.domains" />}
                                count={TotalDoamin > 0 ? TotalDoamin : 0}
                                icon="zmdi zmdi-globe-alt"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                                className="Organization-main"
                            />
                        </a>
                    </div>
                </div>
                <Drawer
                    width="100%"
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
                    {/* {componentName != '' && DynamicLoadComponent(componentName, this.props, this.onClick, this.closeAll)} */}
                </Drawer>
            </div>
        );
    }
}
const mapToProps = ({ domainDashRdcer, drawerclose }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    // To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }

    const { domainDashData, loading } = domainDashRdcer;
    return { domainDashData, loading, drawerclose };
}

export default connect(mapToProps, {
    getDomainData
})(OrganizationInfoDashboard);