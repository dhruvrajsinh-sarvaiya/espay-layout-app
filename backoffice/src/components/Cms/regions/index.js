/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 27-12-2018
    UpdatedDate : 27-12-2018
    Description : Region List
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Alert } from "reactstrap";

// intl messages
import IntlMessages from "Util/IntlMessages";
import { SimpleCard, AddCard } from '../DashboardWidgets';
// jbs section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
//Import List Region Actions...
import { getRegions, getRegionById } from "Actions/Regions"; // getRegionById Added by Khushbu Badheka D:29/01/2019
import { getMenuPermissionByID } from 'Actions/MyAccount';
import AddRegion from './add';
import EditRegion from './edit';
import { DashboardPageTitle } from '../DashboardPageTitle';
import { getLanguage } from 'Actions/Language'; // Added by Khushbu Badheka D:29/01/2019
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
        title: <IntlMessages id="sidebar.regions" />,
        link: '',
        index: 0
    }
];

// componenet listing
const components = {
    AddRegion: AddRegion,
    EditRegion: EditRegion
};
// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, regiondata, reload) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll, regiondata, reload });
};
class Regions extends Component {
    constructor() {
        super();
        this.state = {
            loading: false, // loading activity
            regionslist: [],
            errors: {},
            err_msg: "",
            err_alert: true,
            open: false,
            componentName: '',
            regiondata: {},
            menudetail: [],
            Pflag: true,
        };
        this.onDismiss = this.onDismiss.bind(this);
    }

    onDismiss() {
        let err = delete this.state.errors['message'];
        this.setState({ err_alert: false, errors: err });
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('350C7050-034C-A0CE-6CD7-D8D1F10E30AE');
    }

    componentWillReceiveProps(nextProps) {
        // update menu details if not set 
        if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getRegions();
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    this.props.drawerClose();
                }, 2000);
            }
            this.setState({ Pflag: false })
        }

        this.setState({
            regionslist: nextProps.region_list,
            loading: false
        });

        if (typeof nextProps.data != 'undefined' && (nextProps.data.responseCode === 9 || nextProps.data.responseCode === 1)) {
            if (typeof nextProps.data.errors.message != 'undefined' && nextProps.data.errors.message != '') {
                this.setState({ err_alert: true });
            }
            this.setState({ errors: nextProps.data.errors });
        }
    }

    //On Reload
    reload() {
        //this.setState({ loading: true });
        this.props.getRegions();
        // setTimeout(() => {
        // this.setState({ loading: false });
        // }, 2000);
    }

    // For Drawer Colse
    onClick = () => {
        this.setState({
            open: !this.state.open,
        })
    }

    // Show Component with Open Drawer
    showComponent = (componentName, permission, region = '') => {
        // check permission go on next page or not
        if (permission) {
            if (typeof region != 'undefined' && region != '') {
                this.setState({ regiondata: region });
                this.props.getRegionById(region._id);// Added by Khushbu Badheka D:29/01/2019
            }
            this.props.getLanguage(); // Added by Khushbu Badheka D:29/01/2019
            this.setState({
                componentName: componentName,
                open: !this.state.open,
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    // For Close All Open Drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
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
        var menudetail = this.checkAndGetMenuAccessDetail('4C768434-4849-3940-9FFB-2B04892D37AA'); //4C768434-4849-3940-9FFB-2B04892D37AA
        if (!menudetail) {
            menudetail = { Utility: [], CrudOption: [] }
        }
        const { loading, err_alert, errors, regionslist, permission } = this.state;
        const { drawerClose } = this.props;

        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="sidebar.regions" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(loading || this.props.menuLoading) && <JbsSectionLoader />}

                {errors.message && <div className="alert_area">
                    <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
                </div>}

                <div className="row">
                    {(menudetail.CrudOption.indexOf('04F44CE0') !== -1) &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddRegion', (this.checkAndGetMenuAccessDetail('4C768434-4849-3940-9FFB-2B04892D37AA')).HasChild)} className="text-dark">
                                <AddCard
                                    title={<IntlMessages id="region.button.add-Region" />}
                                    icon="zmdi zmdi-collection-plus"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('4C768434-4849-3940-9FFB-2B04892D37AA') &&
                        regionslist &&
                        regionslist.map((region, key) => (  //Added date_modified into card by Jayesh 22-01-2019
                            <div className="col-md-3 col-sm-6 col-xs-12" key={key}>
                                <a href="javascript:void(0)" onClick={(e) => this.showComponent('EditRegion', (this.checkAndGetMenuAccessDetail('4C768434-4849-3940-9FFB-2B04892D37AA')), region)} className="text-dark">
                                    <SimpleCard
                                        title={region.regionname}
                                        icon="zmdi zmdi-view-web"
                                        count={(typeof region.date_modified != 'undefined') ? new Date(region.date_modified).toLocaleString() : "N/A"}
                                        bgClass="bg-dark"
                                        clickEvent={this.onClick}
                                    />
                                </a>
                            </div>
                        ))}
                </div>

                <Drawer
                    width="100%"
                    handler={false}
                    open={this.state.open}
                    className="drawer2"
                    level=".drawer1"
                    placement="right"
                    levelMove={100}
                >
                    {this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.onClick, this.closeAll, this.state.regiondata, this.reload)}
                </Drawer>
            </div>
        );
    }
}

const mapStateToProps = ({ regions, authTokenRdcer }) => {
    var response = {
        data: regions.data,
        loading: regions.loading,
        region_list: regions.region_list,
        menuLoading: authTokenRdcer.menuLoading,
        menu_rights: authTokenRdcer.menu_rights,
    };
    return response;
};

export default connect(
    mapStateToProps,
    {
        getRegions,
        getRegionById, // Added by Khushbu Badheka D:29/01/2019
        getLanguage, // Added by Khushbu Badheka D:29/01/2019
        getMenuPermissionByID,
    }
)(Regions);