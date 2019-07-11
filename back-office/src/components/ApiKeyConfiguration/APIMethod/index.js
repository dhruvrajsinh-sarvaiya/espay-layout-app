/**
 * Create By Sanjay 
 * Created Date 20/03/2019
 * Component For API Method List 
 */

import AppConfig from 'Constants/AppConfig';

import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Tooltip from "@material-ui/core/Tooltip";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { NotificationManager } from "react-notifications";
import Switch from '@material-ui/core/Switch';

import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { getApiMethodData, updateApiMethod } from 'Actions/RestAPIMethod';
import AddAPIMethod from './AddAPIMethod';
import UpdateAPIMethod from './UpdateAPIMethod';

//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//Columns Object
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />
    },
    {
        name: <IntlMessages id="sidebar.MethodName" />
    },
    {
        name: <IntlMessages id="sidebar.APIAccess" />
    },
    {
        name: <IntlMessages id="sidebar.status" />
    },
    {
        name: <IntlMessages id="table.SocketMethods" />
    },
    {
        name: <IntlMessages id="sidebar.RestMethods" />
    },
    {
        name: <IntlMessages id="liquidityprovider.list.column.label.action" />,
    }
];

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
        title: <IntlMessages id="sidebar.ApiKeyConfiguration" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="my_account.ListAPIMethod" />,
        link: '',
        index: 1
    }
];

class SimplePopover extends React.Component {
    state = {
        popover: null,
    };
    handleClick = event => {
        this.setState({
            popover: event.currentTarget,
        });
    };

    handleClose = () => {
        this.setState({
            popover: null,
        });
    };

    render() {
        const { popover } = this.state;
        const { name, data } = this.props;
        const open = Boolean(popover);
        var MethodData = Object.entries(data).map(([key, value]) => ({ key, value }));

        return (
            <div>
                {MethodData.length > 0 ?
                    <Button
                        aria-owns={open ? 'simple-popper' : undefined}
                        aria-haspopup="true"
                        variant="contained"
                        color="primary"
                        onClick={this.handleClick}
                    >
                        {name}
                    </Button> :
                    "-"
                }
                <Popover
                    id="simple-popper"
                    open={open}
                    anchorEl={popover}
                    onClose={this.handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <ul className="List-Methods">
                        {MethodData.length > 0 && MethodData.map((item, key) => {
                            return <li key={key}>
                                {item.value}
                            </li>
                        })}
                    </ul>
                </Popover>
            </div>
        );
    }
}

class LisAPIMethod extends Component {
    state = {
        Data: [],
        open: false,
        addData: false,
        editData: false,
        componentName: '',
        editDetails: [],
        check: null,
        notificationFlag: true,
        menudetail: [],
    }
    onClick = () => {
        this.setState({
            open: this.state.open ? false : true,
        })
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            addData: false,
            editData: false,
            componentName: ''
        });
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('F9F9D3D8-777C-172A-2D35-D72049478D8E'); // get Trading menu permission
        // this.props.getApiMethodData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
            })
        }
        if (nextProps.apiMethodListData.ReturnCode === 0 && nextProps.apiMethodListData !== "undefine") {
            this.setState({
                Data: nextProps.apiMethodListData.Response
            })
        }
        if (nextProps.updateApiMethodData.ReturnCode === 0) {
            NotificationManager.success(<IntlMessages id="my_account.ApiMethodEdit" />);
            this.props.getApiMethodData();
            this.toggleDrawer();
        } else if (nextProps.updateApiMethodData.ReturnCode === 1) {
            var errMsg = nextProps.updateApiMethodData.ErrorCode === 1 ? nextProps.updateApiMethodData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.updateApiMethodData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getApiMethodData();
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }
    }

    handleChange = (name, lst, menuDetail) => (event) => {

        if (menuDetail) {

            let newObj = Object.assign({}, lst);
            newObj["SocketMethods"] = lst.SocketMethods ? Object.keys(lst.SocketMethods) : [];
            newObj["RestMethods"] = lst.RestMethods ? Object.keys(lst.RestMethods) : []
            if (name === "check") {
                this.setState({ [name]: event.target.checked });
                delete newObj.check;
                if (event.target.checked === true) {
                    newObj["Status"] = 1;
                } else {
                    newObj["Status"] = 0;
                }
            }
            this.props.updateApiMethod(newObj);

        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }

    }

    // open drawer and set data for add new request
    onAddData = (menuDetail) => {

        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                addData: true,
                editData: false
            })
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }

    }

    // open drawer and set data for Edit new request
    onEditData = (selectedData, menuDetail) => {

        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                editData: true,
                editDetails: selectedData,
                addData: false
            })
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }

    }

    // set component and open drawer
    showComponent = (componentName, menuDetail) => {

        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
            });
        }

    }

    // toogle drawer 
    toggleDrawer = () => {
        this.setState({
            open: false,
            componentName: '',
            addData: false,
            editData: false,
        })
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
        const { Data, addData, editData, editDetails } = this.state;
        const { drawerClose, loading, loading_methods } = this.props;

        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('2520CF88-9F7B-91B7-738B-34BE0D178C2A'); //2520CF88-9F7B-91B7-738B-34BE0D178C2A
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

        const options = {
            responsive: "scroll",
            print: false,
            selectableRows: false,
            resizableColumns: false,
            pagination: true,
            viewColumns: false,
            filter: false,
            download: false,
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            customToolbar: () => {

                if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
                    return (
                        <Button
                            variant="raised"
                            className="btn-primary text-white"
                            onClick={() => {
                                this.onAddData(this.checkAndGetMenuAccessDetail('2520CF88-9F7B-91B7-738B-34BE0D178C2A')); // 86D74833-2E62-4DC9-1F19-E7432C8F1831
                                this.showComponent('AddApiPlan', this.checkAndGetMenuAccessDetail('2520CF88-9F7B-91B7-738B-34BE0D178C2A')); // 86D74833-2E62-4DC9-1F19-E7432C8F1831
                            }}
                        >
                            <IntlMessages id="liquidityprovider.list.button.add" />
                        </Button>
                    );
                } else {
                    return false;
                }

            }
        };
        return (
            <div className="jbs-page-content">

                <WalletPageTitle title={<IntlMessages id="my_account.ListAPIMethod" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />

                {(loading || this.props.menuLoading) && <JbsSectionLoader />}
                {loading_methods && <JbsSectionLoader />}
                <div className="StackingHistory table-align statusbtn-comm">
                    <MUIDataTable
                        title={<IntlMessages id="my_account.ListAPIMethod" />}
                        columns={columns}
                        options={options}
                        data={
                            Data.map((lst, key) => {
                                return [
                                    key + 1,
                                    lst.MethodName,
                                    lst.IsReadOnly === 1 ? "IsReadOnly" : "IsFullAccess",
                                    (
                                        <Switch
                                            checked={lst.Status === 1 ? true : false}
                                            onChange={this.handleChange('check', lst, this.checkAndGetMenuAccessDetail('2520CF88-9F7B-91B7-738B-34BE0D178C2A').HasChild)}//A19D0B33-48CE-9771-18BC-D7CD43ED3173
                                            value="check"
                                            disabled={loading_methods}
                                            color="primary"
                                        />
                                    ),
                                    <SimplePopover className="btn_socket" name={<IntlMessages id="table.SocketMethods" />} data={lst.SocketMethods} style={{ width: '120px' }} />,
                                    <SimplePopover className="btn_reset_socket" name={<IntlMessages id="sidebar.RestMethods" />} data={lst.RestMethods} style={{ width: '102px' }} />,

                                    menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 ? // check edit curd operation ?
                                        <Fragment>
                                            <div className="list-action">
                                                <Tooltip
                                                    title={
                                                        <IntlMessages id="liquidityprovider.tooltip.update" />
                                                    }
                                                    disableFocusListener disableTouchListener
                                                >
                                                    <a
                                                        href="javascript:void(0)"
                                                        className="mr-10"
                                                        onClick={(event) => {
                                                            this.onEditData(lst, this.checkAndGetMenuAccessDetail('2520CF88-9F7B-91B7-738B-34BE0D178C2A')) // A19D0B33-48CE-9771-18BC-D7CD43ED3173
                                                            this.showComponent('UpdateAPIMethod', this.checkAndGetMenuAccessDetail('2520CF88-9F7B-91B7-738B-34BE0D178C2A')); // A19D0B33-48CE-9771-18BC-D7CD43ED3173
                                                        }}
                                                    >
                                                        <i className="ti-pencil" />
                                                    </a>
                                                </Tooltip>
                                            </div>
                                        </Fragment>
                                        : '-'
                                ]
                            })
                        }
                    />

                    <Drawer
                        width="50%"
                        handler={false}
                        open={this.state.open}
                        onMaskClick={this.toggleDrawer}
                        className="drawer2 half_drawer"
                        level=".drawer1"
                        placement="right"
                        levelMove={100}
                    >
                        {addData &&
                            <AddAPIMethod {...this.props}
                                drawerClose={this.toggleDrawer}
                                closeAll={this.closeAll} />
                        }

                        {editData && editDetails &&
                            <UpdateAPIMethod {...this.props}
                                selectedData={editDetails}
                                drawerClose={this.toggleDrawer}
                                closeAll={this.closeAll}
                            />
                        }
                    </Drawer>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ RestAPIMethodReducer, drawerclose, authTokenRdcer }) => {
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { apiMethodListData, updateApiMethodData, loading_methods, loading } = RestAPIMethodReducer;
    return { apiMethodListData, updateApiMethodData, loading, loading_methods, drawerclose, menuLoading, menu_rights };
}

export default connect(mapStateToProps, {
    getApiMethodData,
    updateApiMethod,
    getMenuPermissionByID
})(LisAPIMethod);
