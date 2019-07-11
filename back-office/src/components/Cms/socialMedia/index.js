/* 
    Created By : Megha Kariya
    Date : 12-02-2019
    Description : CMS Social Media List
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import { Alert } from "reactstrap";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { SimpleCard, AddCard } from '../DashboardWidgets';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
// jbs section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
//Import List page Actions...
import { getSocialMedias } from "Actions/SocialMedias"; // getPageById Added by Khushbu Badheka D:29/01/2019
import { getMenuPermissionByID } from 'Actions/MyAccount';
import AddSocialMedia from './add';
import EditSocialMedia from './edit';
import { DashboardPageTitle } from '../DashboardPageTitle';

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
        title: <IntlMessages id="sidebar.SocialMedia" />,
        link: '',
        index: 0
    }
];

// componenet listing
const components = {
    AddSocialMedia: AddSocialMedia,
    EditSocialMedia: EditSocialMedia
};
// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, SocialMediadata, reload, permission) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll, SocialMediadata, reload, permission });
};
class SocialMedias extends Component {
    constructor() {
        super();
        this.state = {
            loading: false, // loading activity
            SocialMediaslist: [],
            errors: {},
            err_msg: "",
            err_alert: true,
            open: false,
            componentName: '',
            SocialMediadata: {},
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
        this.props.getMenuPermissionByID('10D1F8C0-5207-9D0A-23E7-EAE6A83A84EA');
    }

    componentWillReceiveProps(nextProps) {

        // update menu details if not set 
        if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getSocialMedias();
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    this.props.drawerClose();
                }, 2000);
            }
            this.setState({ Pflag: false })
        }

        this.setState({
            SocialMediaslist: nextProps.cms_SocialMedias_list,
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
        this.props.getSocialMedias();

    }

    // For Drawer Colse
    onClick = () => {
        this.setState({
            open: this.state.open ? false : true,
        });
        this.reload();
    }

    // Show Component with Open Drawer
    showComponent = (componentName, permission, SocialMedia) => {
        // check permission go on next page or not
        if (permission) {
            if (SocialMedia !== undefined && SocialMedia != '') {
                this.setState({ SocialMediadata: SocialMedia });
                this.props.getSocialMedias(SocialMedia.social_media_type);
            }
            this.props.getSocialMedias();
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
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
        var menudetail = this.checkAndGetMenuAccessDetail('B84A778D-46BE-0D56-5506-F566E37F89C9'); //B84A778D-46BE-0D56-5506-F566E37F89C9
        if (!menudetail) {
            menudetail = { Utility: [], CrudOption: [] }
        }
        const { loading, err_alert, errors, SocialMediaslist } = this.state;
        const { drawerClose } = this.props;

        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="sidebar.SocialMedia" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(loading || this.props.menuLoading) && <JbsSectionLoader />}

                {errors.message && <div className="alert_area">
                    <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
                </div>}

                <div className="row">
                    {(menudetail.CrudOption.indexOf('04F44CE0') !== -1) && SocialMediaslist.length !== 2 &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddSocialMedia', (this.checkAndGetMenuAccessDetail('B84A778D-46BE-0D56-5506-F566E37F89C9')).HasChild)} className="text-dark">
                                <AddCard
                                    title={<IntlMessages id="cmssocialmedia.button.add-SocialMedia" />}
                                    icon="zmdi zmdi-collection-plus"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('B84A778D-46BE-0D56-5506-F566E37F89C9') && SocialMediaslist &&
                        SocialMediaslist.map((SocialMedia, key) => (
                            <div className="col-md-3 col-sm-6 col-xs-12" key={key}>
                                <a href="javascript:void(0)" onClick={(e) => this.showComponent('EditSocialMedia', (this.checkAndGetMenuAccessDetail('B84A778D-46BE-0D56-5506-F566E37F89C9')).HasChild, SocialMedia)} className="text-dark">
                                    <SimpleCard
                                        title={SocialMedia.name}
                                        icon="zmdi zmdi-view-web"
                                        count={(typeof SocialMedia.date_modified != 'undefined') ? new Date(SocialMedia.date_modified).toLocaleString() : "N/A"}
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
                    {this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.onClick, this.closeAll, this.state.SocialMediadata, this.reload)}
                </Drawer>
            </div>
        );
    }
}

const mapStateToProps = ({ staticSocialMedias, authTokenRdcer }) => {
    var response = {
        data: staticSocialMedias.data,
        loading: staticSocialMedias.loading,
        cms_SocialMedias_list: staticSocialMedias.cms_SocialMedias_list,
        menuLoading: authTokenRdcer.menuLoading,
        menu_rights: authTokenRdcer.menu_rights,
    };
    return response;
};

export default connect(
    mapStateToProps,
    {
        getSocialMedias,
        getMenuPermissionByID,
    }
)(SocialMedias);