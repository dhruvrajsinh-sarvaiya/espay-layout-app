/* 
    Developer : Nishant Vadgama
    File Comment : wallet block transaction type list component
    Date : 19-12-2018
*/
import React, { Component } from 'react';
import { connect } from "react-redux";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import IntlMessages from "Util/IntlMessages";
import Button from '@material-ui/core/Button';
import MUIDataTable from "mui-datatables";
import Drawer from "rc-drawer";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import classnames from "classnames";
import {
    getWalletBlockTrnList,
    changeWalletBlockTrnStatus
} from "Actions/WalletBlockTrnType";
import { getWalletTransactionType } from "Actions/TransactionPolicy";
import WalletBlockTrnTypeForm from "./WalletBlockTrnTypeForm";
import AddWalletBlockTrnType from "./AddWalletBlockTrnType";
import { injectIntl } from 'react-intl';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
import { NotificationManager } from "react-notifications";
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';
const components = {
    WalletBlockTrnTypeForm: WalletBlockTrnTypeForm,
    AddWalletBlockTrnType: AddWalletBlockTrnType,
};

// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, rowDetails, getWalletBlockTrnsList) => {
    return React.createElement(components[TagName], {
        props,
        drawerClose,
        closeAll,
        rowDetails,
        getWalletBlockTrnsList,
    });
};

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
        title: <IntlMessages id="walletDashboard.WalletBlockTrnType" />,
        link: '',
        index: 1
    },
];

const initialState = {
    componentName: "",
    showError: false,
    showSuccess: false,
    responseMessage: "",
    showDialog: false,
    open: false,
    rowDetails: {},
    deleteId: null,
    // menuDetail:[],
    menudetail: [],
    notification: true,
}

class WalletBlockTrnTypeList extends Component {
    // construct with initial state
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    //drawer close all event
    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    };

    //toggle drawer
    toggleDrawer = () => {
        this.setState({ open: false });
    }

    //show component
    showComponent = (componentName, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                open: true,
                rowDetails: {},
                componentName: componentName,
            });
        }
        else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    //Edit item
    Edit = (item, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                open: true,
                rowDetails: item,
                componentName: "WalletBlockTrnTypeForm",
            });
        }
        else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    // component will mount actions
    componentWillMount() {
        this.props.getMenuPermissionByID('1F69E9FB-2810-4CB1-1993-4006C01005C9'); // get wallet menu permission
    }

    //validate reponse on status change 
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getWalletBlockTrnList();
                this.props.getWalletTransactionType({});
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notification: false });
        }

        // validate success
        if (nextProps.statusResponse.hasOwnProperty("ReturnCode")) {
            if (nextProps.statusResponse.ReturnCode === 0) {     //success
                NotificationManager.success(<IntlMessages id="common.form.delete.success" />);
                this.props.getWalletBlockTrnList();
            } else if (nextProps.statusResponse.ReturnCode !== 0) {     //failed
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.statusResponse.ErrorCode}`} />);
            }
        }
    }

    // hanlde delete operation
    onDelete = () => {
        this.setState({ showDialog: false })
        if (this.state.deleteId) {
            this.props.changeWalletBlockTrnStatus({
                Id: this.state.deleteId,
                Status: 9 // fixed for delete
            });
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
        /* check menu permission */
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('0A5D3E63-8545-9791-698A-68DE98CD435A'); //0A5D3E63-8545-9791-698A-68DE98CD435A
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const intl = this.props.intl;
        const { drawerClose, walletBlockTrnList } = this.props;
        const columns = [
            { name: intl.formatMessage({ id: "wallet.lblSr" }), options: { sort: true, filter: false } },
            { name: intl.formatMessage({ id: "table.walletId" }), options: { sort: true, filter: false } },
            { name: intl.formatMessage({ id: "table.walletName" }), options: { sort: true, filter: false } },
            { name: intl.formatMessage({ id: "table.currency" }), options: { sort: true, filter: true } },
            { name: intl.formatMessage({ id: "wallet.trnType" }), options: { sort: true, filter: true } },
            {
                name: intl.formatMessage({ id: "table.status" }),
                options: {
                    sort: true,
                    filter: true,
                    customBodyRender: (value) => {
                        return (
                            <span className={classnames({
                                "badge badge-danger": (value === intl.formatMessage({ id: "sidebar.btnDisable" })),
                                "badge badge-success": (value === intl.formatMessage({ id: "sidebar.btnEnable" }))
                            })} >
                                {value}
                            </span>
                        );
                    }
                }
            },
            { name: intl.formatMessage({ id: "table.action" }), options: { sort: false, filter: false } },
        ];
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            download: false,
            viewColumns: false,
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            filter: menuPermissionDetail.Utility.indexOf('18736530') !== -1, //for check filter permission
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customToolbar: () => {
                if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
                    return (
                        <Button
                            variant="raised"
                            className="btn-primary text-white mt-5"
                            onClick={() => this.showComponent("AddWalletBlockTrnType", this.checkAndGetMenuAccessDetail('0A5D3E63-8545-9791-698A-68DE98CD435A').HasChild //A38A2D4B-0769-3D35-0056-28F09A7F1BC0
                            )}
                        >
                            <IntlMessages id="button.addNew" />
                        </Button>
                    );
                } else {
                    return false;
                }
            }
        };
        return (
            <div className="jbs-page-content">
                {this.props.menuLoading && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="walletDashboard.WalletBlockTrnType" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="StackingHistory">
                    {this.props.loading && <JbsSectionLoader />}
                    <MUIDataTable
                        data={walletBlockTrnList.map((item, index) => {
                            return [
                                index + 1,
                                item.WalletId,
                                item.WalletName,
                                item.WalletType,
                                item.TrnTypeName,
                                item.Status ? intl.formatMessage({ id: "sidebar.btnEnable" }) : intl.formatMessage({ id: "sidebar.btnDisable" }),
                                <div className="list-action">
                                    {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 &&
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.Edit(item, this.checkAndGetMenuAccessDetail('0A5D3E63-8545-9791-698A-68DE98CD435A').HasChild //B79BB194-8496-8CB0-37F0-59C81BF743D7
                                            )}
                                        >
                                            <i className="ti-pencil" />
                                        </a>
                                    }
                                    {menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 &&
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.setState({ showDialog: true, deleteId: item.Id })}
                                        >
                                            <i className="ti-close" />
                                        </a>
                                    }
                                </div>
                            ];
                        })}
                        columns={columns}
                        options={options}
                    />
                </div>
                <Drawer
                    width="40%"
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
                            this.toggleDrawer,
                            this.closeAll,
                            this.state.rowDetails,
                            this.props.getWalletBlockTrnList,
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
                        <Button onClick={() => this.onDelete()} className="btn-primary text-white" autoFocus>
                            <IntlMessages id="button.yes" />
                        </Button>
                        <Button onClick={() => this.setState({ showDialog: false })} className="btn-danger text-white">
                            <IntlMessages id="sidebar.btnNo" />
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

const mapStateToProps = ({ WalletBlockTrnTypeReducer, authTokenRdcer }) => {
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { walletBlockTrnList, loading, errors, statusResponse } = WalletBlockTrnTypeReducer;
    return { walletBlockTrnList, loading, errors, statusResponse, menuLoading, menu_rights };
};

export default connect(mapStateToProps, {
    getWalletBlockTrnList,
    changeWalletBlockTrnStatus,
    getWalletTransactionType,
    getMenuPermissionByID
})(injectIntl(WalletBlockTrnTypeList));