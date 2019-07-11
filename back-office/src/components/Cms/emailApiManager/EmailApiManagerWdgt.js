/* 
    Created By : Megha Kariya (actual develop by Jineshbhai)
    Date : 20-02-2019
    Description : CMS Email API manager List
*/
/**
 * Display Email API Manager
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import Tooltip from "@material-ui/core/Tooltip";
import MatButton from "@material-ui/core/Button";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
// intl messages
import IntlMessages from "Util/IntlMessages";

// import action
import { getEmailApiList } from "Actions/EmailApiManager";

//Notification Manager
import { NotificationManager } from "react-notifications";


import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

import EditEmailApi from './EmailApiManagerWdgt/EditEmailApi';
import AddEmailAPI from './EmailApiManagerWdgt/AddEmailAPI';
import ViewEmailAPIDetail from './EmailApiManagerWdgt/ViewEmailAPIDetail';
import { DashboardPageTitle } from '../DashboardPageTitle';
import { getMenuPermissionByID } from 'Actions/MyAccount';

//Columns Object
const columns = [
    {
        name: "APID",
        options: {
            filter: false,
            sort: true
        }
    }, {
        name: <IntlMessages id="emailAPIManager.column.SenderID" />,
        options: {
            filter: false,
            sort: true
        }
    },
    {
        name: <IntlMessages id="emailAPIManager.column.SendURL" />,
        options: {
            filter: true,
            sort: true
        }
    },
    {
        name: <IntlMessages id="emailAPIManager.column.ServiceName" />,//"ServiceName", //Change By Megha Kariya (21/02/2019)
        options: {
            filter: true,
            sort: false
        }
    },
    {
        name: <IntlMessages id="emailAPIManager.column.Action" />,
        options: {
            filter: false,
            sort: false
        }
    }
];

const components = {
    EditEmailApi: EditEmailApi,
    AddEmailAPI: AddEmailAPI,
    ViewEmailAPIDetail: ViewEmailAPIDetail
};
const dynamicComponent = (TagName, EmailApiDetail, type, drawerClose, closeAll, close2Level, GUID) => {
    return React.createElement(components[TagName], { EmailApiDetail, type, drawerClose, closeAll, close2Level, GUID });
};
//Component EmailApiManagerWdgt Class
class EmailApiManagerWdgt extends Component {
    constructor(props) {

        super(props);

        this.state = {
            errors: 0,
            start_date: new Date().toISOString().slice(0, 10),
            end_date: new Date().toISOString().slice(0, 10),
            currentDate: new Date().toISOString().slice(0, 10),
            loading: false,
            componentName: '',
            open: false,
            SelectedEmailAPI: {},
            type: this.props.type,
            permission: {},
            menudetail: [],
            Pflag: true,
            GUID: '',
            PGUID: this.props.GUID,

        };
        this.onApply = this.onApply.bind(this);
    }

    componentWillMount() {
        this.props.getMenuPermissionByID(this.state.PGUID);
    }

    componentWillReceiveProps(nextProps) {

        if (this.state.PGUID !== this.props.GUID) {
            this.props.getMenuPermissionByID(this.props.GUID);
            this.setState({ PGUID: this.props.GUID })
        }

        // update menu details if not set 
        if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getEmailApiList({ type: this.state.type });
                this.setState({ loading: true });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    this.props.drawerClose();
                }, 2000);
            }
            this.setState({ Pflag: false })
        }

        if (nextProps.error !== '' && this.state.errors == 0) {
            NotificationManager.error(nextProps.error);
            this.setState({ errors: 1 });
        }

        if (this.state.type !== nextProps.type) {
            this.props.getEmailApiList({ type: nextProps.type });

            this.setState({ loading: true, type: nextProps.type });
        }

    }

    // on change if change in any field store value in state
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    onApply(event) {

        this.props.getEmailApiList({});

        this.setState({ loading: true });
    }

    // Drawer Component
    showComponent = (componentName, EmailAPIDetail, permission, GUID) => {
        // check permission go on next page or not
        if (permission) {
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
                SelectedEmailAPI: EmailAPIDetail,
                GUID: GUID
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    };
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    };
    toggleDrawer = (Email) => {
        this.setState({
            open: this.state.open ? false : true,
        });
    };
    close2Level = () => {
        this.props.close2Level();
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail(this.state.type === 2 ? 'AB309E3D-0BBA-28E9-A2C7-3D1DB99451AA' : '69de6f45-4b2f-5d6e-7db4-4410bc893b97');
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const data = typeof this.props.EmailApiList.Result == 'undefined' ? [] : this.props.EmailApiList.Result;
        const { drawerClose } = this.props;
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
                index: 0
            },
            {
                title: <IntlMessages id="emailAPIManager.PageTitle" />,
                link: '',
                index: 1
            },
            {
                title: <IntlMessages id={this.state.type === 2 ? "emailAPIManager.email.title" : "emailAPIManager.sms.title"} />,
                link: '',
                index: 0
            }
        ];

        return (
            <div className="jbs-page-content EmailAPIManagerList">
                <DashboardPageTitle title={<IntlMessages id="emailAPIManager.PageTitle" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}

                <div className="StackingHistory">
                    <MUIDataTable
                        columns={columns}
                        data={data.map((item, key) => {
                            return [
                                item.APID,
                                item.SenderID,
                                item.SendURL,
                                item.ServiceName,
                                <div>
                                    {menuPermissionDetail.CrudOption.indexOf('6AF64827') !== -1 &&
                                        /* Change Toolip as view by Megha Kariya (23/02/2019) */
                                        <Tooltip title={<IntlMessages id="liquidityprovider.tooltip.view" />}>
                                            <a href="javascript:void(0)" className="mr-10" onClick={(event) => {
                                                this.showComponent('ViewEmailAPIDetail', item, this.state.type === 2 ? (this.checkAndGetMenuAccessDetail('AB309E3D-0BBA-28E9-A2C7-3D1DB99451AA')).HasChild : (this.checkAndGetMenuAccessDetail('69DE6F45-4B2F-5D6E-7DB4-4410BC893B97')).HasChild, this.state.type === 2 ? 'AB309E3D-0BBA-28E9-A2C7-3D1DB99451AA' : '69DE6F45-4B2F-5D6E-7DB4-4410BC893B97')
                                            }}><i className="ti-eye" />
                                            </a>
                                        </Tooltip>
                                    }
                                    {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 &&
                                        <Tooltip title={<IntlMessages id="liquidityprovider.tooltip.update" />}>
                                            <a href="javascript:void(0)" className="mr-10" onClick={(event) => {
                                                this.showComponent('EditEmailApi', item, this.state.type === 2 ? (this.checkAndGetMenuAccessDetail('AB309E3D-0BBA-28E9-A2C7-3D1DB99451AA')).HasChild : (this.checkAndGetMenuAccessDetail('69DE6F45-4B2F-5D6E-7DB4-4410BC893B97')).HasChild, this.state.type === 2 ? 'AB309E3D-0BBA-28E9-A2C7-3D1DB99451AA' : '69DE6F45-4B2F-5D6E-7DB4-4410BC893B97')
                                            }}><i className="ti-pencil" />
                                            </a>
                                        </Tooltip>
                                    }
                                </div>

                            ];
                        })}
                        options={{
                            selectableRows: false, // <===== will turn off checkboxes in rows
                            print: false,// <===== will turn off print option in header
                            download: false,// <===== will turn off download option in header
                            viewColumns: false,// <===== will turn off viewColumns option in header
                            filter: false,// <===== will turn off filter option in header
                            customToolbar: () => {
                                if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) {
                                    return (
                                        <MatButton
                                            variant="raised"
                                            className="btn-primary text-white"
                                            onClick={(e) => this.showComponent('AddEmailAPI', {}, this.state.type === 2 ? (this.checkAndGetMenuAccessDetail('AB309E3D-0BBA-28E9-A2C7-3D1DB99451AA')).HasChild : (this.checkAndGetMenuAccessDetail('69DE6F45-4B2F-5D6E-7DB4-4410BC893B97')).HasChild, this.state.type === 2 ? 'AB309E3D-0BBA-28E9-A2C7-3D1DB99451AA' : '69DE6F45-4B2F-5D6E-7DB4-4410BC893B97')}
                                        >
                                            <IntlMessages id="button.add" />
                                        </MatButton>
                                    );
                                }
                            },
                        }}
                    />
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
                    {this.state.componentName == 'EditEmailApi' ? this.state.componentName != '' && this.state.componentName == 'EditEmailApi' && dynamicComponent(this.state.componentName, this.state.SelectedEmailAPI, this.state.type, this.toggleDrawer, this.closeAll, this.close2Level, this.state.GUID) : this.state.componentName == 'ViewEmailAPIDetail' ? this.state.componentName != '' && this.state.componentName == 'ViewEmailAPIDetail' && dynamicComponent(this.state.componentName, this.state.SelectedEmailAPI, this.state.type, this.toggleDrawer, this.closeAll, this.close2Level, this.state.GUID) : this.state.componentName != '' && this.state.componentName == 'AddEmailAPI' && dynamicComponent(this.state.componentName, {}, this.state.type, this.toggleDrawer, this.closeAll, this.close2Level, this.state.GUID)}
                </Drawer>
            </div>
        );
    }
}

// map state to props
const mapStateToProps = ({ EmailApiManager, authTokenRdcer }) => {

    const response = {
        EmailApiList: EmailApiManager.EmailApiList,
        loading: EmailApiManager.loading,
        error: EmailApiManager.error,
        menuLoading: authTokenRdcer.menuLoading,
        menu_rights: authTokenRdcer.menu_rights,
    };
    return response;
};

export default connect(
    mapStateToProps,
    {
        getEmailApiList, getMenuPermissionByID
    }
)(EmailApiManagerWdgt);
