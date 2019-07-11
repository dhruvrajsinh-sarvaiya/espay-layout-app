/* 
    Created By : Megha Kariya
    Date : 05-02-2019
    File Comment : CMS Coin List Dashboard Component
*/
import React, { Component } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { CountCard } from '../DashboardWidgets';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { DashboardPageTitle } from '../DashboardPageTitle';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { getCmsDashboardCoinListCount } from "Actions/CmsDashboard";
import { getMenuPermissionByID } from 'Actions/MyAccount';
import CoinListRequest from './coinListRequest';
import CoinListFields from './coinListFields';
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
        title: <IntlMessages id="sidebar.cms" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.coinList" />,
        link: '',
        index: 0
    }
];


// componenet listing
const components = {
    CoinListRequest: CoinListRequest,
    CoinListFields: CoinListFields,
};
// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, close2Level, closeAll, faqcategorydata, reload) => {
    return React.createElement(components[TagName], { props, drawerClose, close2Level, closeAll, faqcategorydata, reload });
};
// Component for MyAccount Organization Information dashboard
class CoinListDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            loading: false,
            data: {},
            menudetail: [],
            Pflag: true,
        }
    }

    onClick = () => {
        this.setState({
            open: this.state.open ? false : true,
        });
        this.reload();
    }

    showComponent = (componentName, permission) => {
        // check permission go on next page or not
        if (permission) {
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
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
        this.props.getCmsDashboardCoinListCount();
    }

    close2Level = () => {
        this.setState({ open: false });
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('D34203BD-5D27-041F-5A73-167E86F87307');
    }

    componentWillReceiveProps(nextProps) {
        // update menu details if not set 
        if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getCmsDashboardCoinListCount();
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
        const { componentName, open } = this.state;
        const { drawerClose, loading } = this.props;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="sidebar.coinList" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(loading || this.props.menuLoading) && <JbsSectionLoader />}
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('02F68038-6B00-1397-5B6B-1534616D3A05') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('CoinListRequest', (this.checkAndGetMenuAccessDetail('02F68038-6B00-1397-5B6B-1534616D3A05')).HasChild)} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="sidebar.coinListRequest" />}
                                    icon="zmdi zmdi-blur-circular"
                                    count={(typeof this.props.coinListRequestCount != 'undefined') ? this.props.coinListRequestCount : 0}
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('32610157-9208-781E-2F8E-91A151F414BC') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('CoinListFields', (this.checkAndGetMenuAccessDetail('32610157-9208-781E-2F8E-91A151F414BC')).HasChild)} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="sidebar.coinListFields" />}
                                    icon="zmdi zmdi-blur-circular"
                                    count={(typeof this.props.CoinListField != 'undefined') ? this.props.CoinListField : 0}
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
        CoinListField: cmsDashboard.coinList.CoinListField,
        coinListRequestCount: cmsDashboard.coinList.coinListRequestCount,
        menuLoading: authTokenRdcer.menuLoading,
        menu_rights: authTokenRdcer.menu_rights,
    };
    return response;
}

export default connect(mapToProps, {
    getCmsDashboardCoinListCount,
    getMenuPermissionByID,
})(CoinListDashboard);
