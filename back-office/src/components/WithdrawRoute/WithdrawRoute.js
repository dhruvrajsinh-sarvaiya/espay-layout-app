/* 
    Developer : Nishant Vadgama
    Date : 24-10-2018
    File Comment : Withdrawal route list component
*/
import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import { connect } from "react-redux";
import Drawer from "rc-drawer";
import "rc-drawer/assets/index.css";
import IntlMessages from "Util/IntlMessages";
import {
    getWithdrawRouteList,
    getRouteInfoById,
    deleteWithdrawRoute,
} from "Actions/WithdrawRoute";
import MatButton from "@material-ui/core/Button";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import WithdrawRouteForm from './WithdrawRouteForm';
import { injectIntl } from 'react-intl';
import classnames from "classnames";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { NotificationManager } from 'react-notifications';
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
const components = {
    WithdrawRouteForm: WithdrawRouteForm,
};
// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, pagedata, TrnType,intl) => {
    return React.createElement(components[TagName], {
        props,
        drawerClose,
        closeAll,
        pagedata,
        TrnType,
        intl
    });
};
const INIT_STATE = {
    open: false,
    pagedata: {},
    componentName: "",
    showDialog: false,
    routeId: 0,
    notificationFlag: false,
    ApiCallBit: true,
    menudetail: [],
    notification: true,
}

class WithdrawRoute extends Component {
    state = INIT_STATE;
    onClose = () => {
        this.setState({
            open: false,
            componentName: ""
        });
    };
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            componentName: "",
        });
    };
    showComponent = (componentName, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    };
    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.TrnType === 9 ? '5D24B2D8-6C79-0CBD-A544-A6562518A318' : '4DE698A0-86F1-3564-7850-870026774895');
    }
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getWithdrawRouteList({ TrnType: nextProps.TrnType })
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notification: false });
        }

        // validate remove response
        if (nextProps.delResponse.hasOwnProperty("ReturnCode") && this.state.notificationFlag) {
            this.setState({ notificationFlag: false }); // reset flag
            if (nextProps.delResponse.ReturnCode === 0) {     //success
                NotificationManager.success(<IntlMessages id={"common.form.delete.success"} />);
                setTimeout(function () {
                    this.props.getWithdrawRouteList({ TrnType: nextProps.TrnType });
                }.bind(this), 3000);
            } else if (nextProps.delResponse.ReturnCode !== 0) {     //failed
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.delResponse.ErrorCode}`} />);
            }
        }
        /* drawe bit */
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
                componentName: ''
            })
        }
    }
    onEditWithdrawRoute(item, menuDetail) {
        // check permission go on next page or not
        if (menuDetail) {
            this.props.getRouteInfoById({ ServiceID: item.ServiceID, TrnType: item.TrnType });
            this.showComponent("WithdrawRouteForm", menuDetail);
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    // remove ...
    onDelete = () => {
        this.setState({ showDialog: false, notificationFlag: true })
        if (this.state.routeId) {
            this.props.deleteWithdrawRoute({ routeId: this.state.routeId, TrnType: this.props.TrnType });
        }
    }
    handleClose = () => {
        this.setState(INIT_STATE);
        this.props.drawerClose();
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
        // BreadCrumb
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
                title: <IntlMessages id="sidebar.wallet" />,
                link: '',
                index: 0
            },
            {
                title: this.props.TrnType === 9 ? <IntlMessages id="sidebar.AddressGenerationRoute" /> : <IntlMessages id="sidebar.withdrawRoute" />,
                link: '',
                index: 1
            },
        ];
        /* check menu permission */
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail(this.props.TrnType === 9 ? '1AAA7B05-9FB6-9F53-11B0-CFD7C46794D8' : 'C6C67C0E-6FB3-74A7-A742-05F5AA1067FF'); //C6C67C0E-6FB3-74A7-A742-05F5AA1067FF   &&  Addressgunration GUID    1AAA7B05-9FB6-9F53-11B0-CFD7C46794D8
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const intl = this.props.intl;
        const columns = [
            {
                name: intl.formatMessage({ id: "wallet.lblSr" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.currency" }),
                options: { sort: true, filter: true }
            },
            {
                name: intl.formatMessage({ id: "table.status" }),
                options: {
                    filter: true,
                    sort: true,
                    customBodyRender: (value) => {
                        return (
                            <span className={classnames({
                                "badge badge-danger": (value === intl.formatMessage({ id: "sidebar.inactive" })),
                                "badge badge-success": (value === intl.formatMessage({ id: "sidebar.active" }))
                            })} >
                                {value}
                            </span>
                        );
                    }
                }
            },
            {
                name: intl.formatMessage({ id: "table.action" }),
                options: { sort: false, filter: false }
            }
        ];
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            download: false,
            viewColumns: false,
            print: false,
            filter: menuPermissionDetail.Utility.indexOf('18736530') !== -1, //for check search permission,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            customToolbar: () => {
                if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
                    return (
                        <MatButton
                            variant="raised"
                            className="btn-primary text-white mt-5"
                            // style={{ float: "right" }}
                            onClick={() => this.showComponent("WithdrawRouteForm", this.checkAndGetMenuAccessDetail(this.props.TrnType === 9 ? '1AAA7B05-9FB6-9F53-11B0-CFD7C46794D8' : 'C6C67C0E-6FB3-74A7-A742-05F5AA1067FF').HasChild)}//0CCB101C-16A7-5F8E-A3D9-416A98DE425C   &&  Addressgunration GUID    85CDAB55-0E65-0186-A110-CEA9DD0A8540
                        >
                            <IntlMessages id="button.addNew" />
                        </MatButton>
                    );
                } else {
                    return false;
                }
            }
        };
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={this.props.TrnType === 9 ? <IntlMessages id="sidebar.AddressGenerationRoute" /> : <IntlMessages id="sidebar.withdrawRoute" />} breadCrumbData={BreadCrumbData} drawerClose={(e) => this.handleClose()} closeAll={this.closeAll} />
                <div className="StackingHistory">
                    {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                    {(this.props.withdrawRouteList.length > 0 && this.state.menudetail.length > 0) && <MUIDataTable
                        data={this.props.withdrawRouteList.map((item, index) => {
                            return [
                                index + 1,
                                item.CurrencyName,
                                item.status ? intl.formatMessage({ id: "sidebar.active" }) : intl.formatMessage({ id: "sidebar.inactive" }),
                                <div className="list-action">
                                    {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 &&
                                        <a
                                            className="mr-10"
                                            href="javascript:void(0)"
                                            onClick={() => this.onEditWithdrawRoute(item, this.checkAndGetMenuAccessDetail(this.props.TrnType === 9 ? '1AAA7B05-9FB6-9F53-11B0-CFD7C46794D8' : 'C6C67C0E-6FB3-74A7-A742-05F5AA1067FF').HasChild)}//9FF3DCF9-4C49-5986-106D-A3D7D54122F5   &&  Addressgunration GUID    C449F95F-0AC1-3F64-84FB-51055C0D8B05
                                        >
                                            <i className="ti-pencil" />
                                        </a>
                                    }
                                    {menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 &&
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.setState({ showDialog: true, routeId: item.ServiceID })}
                                        >
                                            <i className="ti-close" />
                                        </a>
                                    }
                                </div>
                            ];
                        })}
                        columns={columns}
                        options={options}
                    />}
                </div>
                <Drawer
                    width="100%"
                    handler={false}
                    open={this.state.open}
                    className="drawer2 half_drawer"
                    level=".drawer0"
                    placement="right"
                    levelMove={100}
                >
                    {this.state.componentName !== "" &&
                        dynamicComponent(
                            this.state.componentName,
                            this.props,
                            this.onClose,
                            this.closeAll,
                            this.state.pagedata,
                            this.props.TrnType,
                            this.props.intl
                        )}
                </Drawer>
                <Dialog
                    style={{ zIndex: '99999' }}
                    open={this.state.showDialog}
                    onClose={() => this.setState({ showDialog: false })}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        <IntlMessages id="global.delete.message" />
                    </DialogTitle>
                    <DialogActions>
                        <MatButton onClick={() => this.onDelete()} className="btn-primary text-white" autoFocus>
                            <IntlMessages id="button.yes" />
                        </MatButton>
                        <MatButton onClick={() => this.setState({ showDialog: false })} className="btn-danger text-white">
                            <IntlMessages id="sidebar.btnNo" />
                        </MatButton>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

const mapStateToProps = ({ withdrawRoute, drawerclose, authTokenRdcer }) => {
    // breadcrumb 
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { withdrawRouteList, loading, errors, delResponse } = withdrawRoute;
    return { withdrawRouteList, loading, errors, drawerclose, delResponse, menuLoading, menu_rights };
};

export default connect(mapStateToProps, {
    getWithdrawRouteList,
    getRouteInfoById,
    deleteWithdrawRoute,
    getMenuPermissionByID
})(injectIntl(WithdrawRoute));
