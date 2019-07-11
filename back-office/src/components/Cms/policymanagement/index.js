/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 15-01-2019
    UpdatedDate : 15-01-2019
    Description : Policy Management Pages List
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
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
//Import List page Actions...
import { getPages, getPageById } from "Actions/Pages";
import AddPage from '../pages/add';
import EditPage from '../pages/edit';
import { DashboardPageTitle } from '../DashboardPageTitle';
import { getLanguage } from 'Actions/Language'; //Added by Khushbu Badheka D:29/01/2019
import { getMenuPermissionByID } from 'Actions/MyAccount';
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
        title: <IntlMessages id="sidebar.policymanagement" />,
        link: '',
        index: 0
    }
];

// componenet listing
const components = {
    AddPage: AddPage,
    EditPage: EditPage
};
// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, pagedata, reload, GUID) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll, pagedata, reload, GUID });
};
class PolicyManagement extends Component {
    constructor() {
        super();
        this.state = {
            loading: false, // loading activity
            pageslist: [],
            errors: {},
            err_msg: "",
            err_alert: true,
            open: false,
            componentName: '',
            pagedata: {},
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
        this.props.getMenuPermissionByID('A4BC58C8-96DF-6425-55A2-0513D5464A3A');
    }

    componentWillReceiveProps(nextProps) {
        // update menu details if not set 
        if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) && this.state.Pflag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getPages("2");
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    this.props.drawerClose();
                }, 2000);
            }
            this.setState({ Pflag: false })
        }
        this.setState({
            pageslist: nextProps.cms_pages_list,
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
        this.props.getPages("2");
    }

    // For Drawer Colse
    onClick = () => {
        this.setState({
            open: this.state.open ? false : true,
        })
    }

    // Show Component with Open Drawer
    showComponent = (componentName, permission, page) => {
        // check permission go on next page or not
        if (permission) {
            if (page !== undefined && page != '') {
                this.setState({ pagedata: page });
                this.props.getPageById(page._id);//Added by Khushbu Badheka D:29/01/2019
            }
            this.props.getLanguage(); //Added by Khushbu Badheka D:29/01/2019
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
        var menudetail = this.checkAndGetMenuAccessDetail('2896E607-2429-13D0-73B8-290FAF8835AA');
        if (!menudetail) {
            menudetail = { Utility: [], CrudOption: [] }
        }
        const { loading, err_alert, errors, pageslist } = this.state;
        const { drawerClose } = this.props;

        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="sidebar.policymanagement" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(loading || this.props.menuLoading) && <JbsSectionLoader />}

                {errors.message && <div className="alert_area">
                    <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
                </div>}

                <div className="row">
                    {(menudetail.CrudOption.indexOf('04F44CE0') !== -1) &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddPage', (this.checkAndGetMenuAccessDetail('2896E607-2429-13D0-73B8-290FAF8835AA')).HasChild)} className="text-dark">
                                <AddCard
                                    title={<IntlMessages id="cmspage.button.add-Page" />}
                                    icon="zmdi zmdi-collection-plus"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('2896E607-2429-13D0-73B8-290FAF8835AA') &&
                        (pageslist &&
                            pageslist.map((page, key) => (   //Added date_modified into card by Jayesh 22-01-2019
                                <div className="col-md-3 col-sm-6 col-xs-12" key={key}>
                                    <a href="javascript:void(0)" onClick={(e) => this.showComponent('EditPage', (this.checkAndGetMenuAccessDetail('2896E607-2429-13D0-73B8-290FAF8835AA')).HasChild, page)} className="text-dark">
                                        <SimpleCard
                                            title={page.locale.en.title}
                                            icon="zmdi zmdi-view-web"
                                            count={(typeof page.date_modified != 'undefined') ? new Date(page.date_modified).toLocaleString() : "N/A"}
                                            bgClass="bg-dark"
                                            clickEvent={this.onClick}
                                        />
                                    </a>
                                </div>
                            ))
                        )
                    }
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
                    {this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.onClick, this.closeAll, this.state.pagedata, this.reload, '2896E607-2429-13D0-73B8-290FAF8835AA')}
                </Drawer>
            </div>
        );
    }
}

const mapStateToProps = ({ staticpages, authTokenRdcer }) => {
    var response = {
        data: staticpages.data,
        loading: staticpages.loading,
        cms_pages_list: staticpages.cms_pages_list,
        menuLoading: authTokenRdcer.menuLoading,
        menu_rights: authTokenRdcer.menu_rights,
    };
    return response;
};

export default connect(
    mapStateToProps,
    {
        getPages,
        getLanguage, // Added by Khushbu Badheka D:29/01/2019
        getPageById, // Added by Khushbu Badheka D:29/01/2019
        getMenuPermissionByID
    }
)(PolicyManagement);