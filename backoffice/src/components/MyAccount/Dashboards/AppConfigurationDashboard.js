/* 
    Developer : Sanjay
    Date : 10/01/2019
    Updated By : Bharat Jograna (BreadCrumb)09 March 2019
    File Comment : MyAccount Application Configuration Dashboard Component
*/
import React, { Component } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { SimpleCard, CountCard } from './Widgets';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import { getApplicationList } from 'Actions/MyAccount';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
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
        title: <IntlMessages id="sidebar.appConfig" />,
        link: '',
        index: 1
    }
];


// Component for MyAccount Organization Information dashboard
class AppConfigurationDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            PageIndex: 0,
            PAGE_SIZE: 100,
            data: null,
        }
    }

    componentWillMount() {
        this.getListApplication();
    }

    componentWillReceiveProps(nextProps) {
        //Added by Bharat Jograna, (BreadCrumb)09 March 2019
        // To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({ open: false });
        }

        if (Object.keys(nextProps.getApplicationListData).length > 0
            && nextProps.getApplicationListData.hasOwnProperty('TotalCount')) {
            this.setState({ data: nextProps.getApplicationListData.TotalCount });
        }

        // To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open1 === false) {
            this.setState({ open: false })
        }
    }

    getListApplication() {
        const reqObj = {
            PageIndex: this.state.PageIndex,
            PAGE_SIZE: this.state.PAGE_SIZE
        }
        this.props.getApplicationList(reqObj);
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

    render() {
        const { componentName, open, data } = this.state;
        const { drawerClose, loading } = this.props;
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.appConfig" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {loading && <JbsSectionLoader />}
                <div className="row">
                    {checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5') && //7AEC5D9E-A06E-797D-702F-B645993A1742
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListApplications', checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5'))} className="text-dark">
                            <CountCard
                                title={<IntlMessages id="my_account.listApplication" />}
                                count={data > 0 ? data : 0}
                                icon="zmdi zmdi-assignment-account"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>}
                    {checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5') && //7AEC5D9E-A06E-797D-702F-B645993A1742
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('CreateApplication', checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5'))} className="text-dark">
                            <SimpleCard
                                title={<IntlMessages id="my_account.createApplication" />}
                                icon="zmdi zmdi-assignment-account"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>}
                </div>
                <Drawer
                    width="100%"
                    handler={null}
                    open={open}
                    onMaskClick={this.onClick}
                    className={null}
                    placement="right"
                    level={null}
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

const mapStateToProps = ({ ApplicationConfig, drawerclose }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }

    const { getApplicationListData, loading } = ApplicationConfig;
    return { getApplicationListData, loading, drawerclose };
}

export default connect(mapStateToProps, {
    getApplicationList
})(AppConfigurationDashboard);