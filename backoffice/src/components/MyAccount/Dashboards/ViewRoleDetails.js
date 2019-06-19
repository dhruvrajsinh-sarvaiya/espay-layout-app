/* 
    Developer : Salim Deraiya
    Date : 27-02-2019
    Update by  : Bharat Jograna (BreadCrumb)13 March 2019
    File Comment : My Account Assign Role Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import { getRoleManagementById } from "Actions/MyAccount";
import { ActiveInactiveStatus } from '../ActiveInactiveStatus';
import ListUserRoleAssign from "./ListUserRoleAssign";
import AppConfig from 'Constants/AppConfig';
import { NotificationManager } from "react-notifications";
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
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
        title: <IntlMessages id="sidebar.userManagement" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.roleManagement" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="sidebar.listRoles" />,
        link: '',
        index: 3
    },
    {
        title: <IntlMessages id="sidebar.roleDetails" />,
        link: '',
        index: 4
    }
];

class ViewRoleDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: {
                RoleID: '',
                RoleName: '',
                RoleDescription: '',
                Status: ''
            },
            userRoleHistory: [],
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
        };
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    };
    componentWillMount() {
        this.props.getMenuPermissionByID('C65C0B7A-404E-9EAC-4CBD-A675695075AE'); // get myaccount menu permission

    }
    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        //Added by Saloni Rathod
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            }
            // } else if (nextProps.menu_rights.ReturnCode !== 0) {
            //     this.setState({ notificationFlag: false });
            // 	NotificationManager.error(<IntlMessages id={"error.permission"} />);
            // 	setTimeout(() => {
            // 		window.location.href = AppConfig.afterLoginRedirect;
            // 	}, 2000);
            // }
        }
        //Added by Bharat Jograna, (BreadCrumb)09 March 2019
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open4 === false) {
            this.setState({ open: false });
        }

        //Get Role Data By Id
        if (nextProps.getData.hasOwnProperty('RoleDetail') && Object.keys(nextProps.getData.RoleDetail).length > 0 && this.props.pagedata.isEdit) {
            this.setState({ data: nextProps.getData.RoleDetail });
        }
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
        const { drawerClose } = this.props;
        const { RoleName, RoleDescription, Status } = this.state.data;
        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('64BA3351-22DF-3931-496B-76096D9E4593'); //C65C0B7A-404E-9EAC-4CBD-A675695075AE
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.roleDetails" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <Fragment>
                    {(this.state.menuLoading || this.props.loading) && <JbsSectionLoader />}
                    <div className="row">
                        <div className="col">
                            <h2><IntlMessages id="sidebar.roleDetails" /></h2>
                            <table className="table table-striped">
                                <colgroup>
                                    <col width="30%" />
                                    <col width="70%" />
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <th scope="row"><IntlMessages id="my_account.roleName" /></th>
                                        <td>{RoleName}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><IntlMessages id="my_account.roleDescription" /></th>
                                        <td>{RoleDescription}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><IntlMessages id="my_account.status" /></th>
                                        <td><ActiveInactiveStatus status={Status} /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-md-8 col-12">
                            <h2><IntlMessages id="sidebar.associatedUsers" /></h2>

                            <ListUserRoleAssign {...this.props} isShowPageTitle={false} dynPageTitle={<IntlMessages id="sidebar.associatedUsers" />} menuDetail={this.state.menudetail} />

                        </div>
                    </div>
                </Fragment>
            </div>
        );
    }
}

const mapStateToProps = ({ roleManagementRdcer, drawerclose, authTokenRdcer }) => {
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { getData, loading } = roleManagementRdcer;
    return {
        getData, loading, drawerclose, menuLoading,
        menu_rights
    };
}

export default connect(mapStateToProps, {
    getRoleManagementById,
    getMenuPermissionByID,
})(ViewRoleDetails);