import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import Button from "@material-ui/core/Button";
import Drawer from "rc-drawer";
import { getWalletTypeMaster, deleteWalletTypeMaster, addWalletTypeMaster, onUpdateWalletTypeMaster, getWalletTypeMasterById } from "Actions/WalletTypes";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import MUIDataTable from "mui-datatables";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { Alert } from "reactstrap";
import EditWalletTypes from "./EditWalletTypes";
import AddWalletTypes from './AddWalletTypes';
import { injectIntl } from 'react-intl';
import classnames from "classnames";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
import { NotificationManager } from 'react-notifications';
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import {
    getCurrencyList,
} from "Actions/WithdrawRoute";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
var validateEditWalletTypeMasterRequest = require("../../../validation/WalletTypes/EditWalletTypes");
var validateAddWalletTypeMasterRequest = require("../../../validation/WalletTypes/AddWalletTypes");
const buttonSizeSmall = {
    maxHeight: "28px",
    minHeight: "28px",
    maxWidth: "28px",
    fontSize: "1rem"
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
        title: <IntlMessages id="walletDashboard.WalletTypes" />,
        link: '',
        index: 1
    },
];

class WalletTypesList extends Component {
    state = {
        open: false,
        checkedSwitch: false,
        isButtonDisabled: false,
        showErrorStatus: false,
        showSuccessStatus: false,
        showError: false,
        showSuccess: false,
        responseMessageForStatus: "",
        responseMessage: "",
        showDialog: false,
        deleteId: null,
        editWalletTypeMasterModel: false,
        editWalletTypeMastereDetail: {},
        addNewWalletTypeMaster: false,
        addNewWalletTypeMasterDetail: {
            WalletTypeName: "",
            Description: "",
            IsDepositionAllow: "0",
            IsWithdrawalAllow: "0",
            IsTransactionWallet: "0",
            Status: "0"
        },
        errors: "",
        fieldList: {},
        menudetail: [],
        notificationFlag: true,
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('AD938175-3B8D-6EBE-37DE-5C604075667A'); // get wallet menu permission
        // this.props.getWalletTypeMaster();
        // this.props.getCurrencyList();
    }
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            editWalletTypeMasterModel: false
        });
    };
    // hanlde delete operation
    onDelete = () => {
        this.setState({ showDialog: false })
        if (this.state.deleteId) {
            this.props.deleteWalletTypeMaster({
                id: this.state.deleteId
            });
        }
    }
    //Edit  Commission Type 
    onEditWalletTypeMaster(walletTypeMaster, menuDetail) {
        // check permission go on next page or not
        if (menuDetail) {
            this.props.getWalletTypeMasterById({
                id: walletTypeMaster.Id
            })
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    //toggle Wallet Type Drawer
    toggleEditWalletTypeModal = () => {
        this.setState({
            editWalletTypeMasterModel: !this.state.editWalletTypeMasterModel,
            errors: {}
        });
    };
    handleDACheckChange = name => (checked) => {
        this.setState({ [name]: checked });
        if (this.state.checkedSwitch !== true) {
            this.setState({
                addNewWalletTypeMasterDetail: {
                    ...this.state.addNewWalletTypeMasterDetail,
                    IsDepositionAllow: (this.state.addNewWalletTypeMasterDetail.IsDepositionAllow === "1") ? "0" : "1"
                }
            })
        }
    }
    handleWACheckChange = name => (checked) => {
        this.setState({ [name]: checked });
        if (this.state.checkedSwitch !== true) {
            this.setState({
                addNewWalletTypeMasterDetail: {
                    ...this.state.addNewWalletTypeMasterDetail,
                    IsWithdrawalAllow: (this.state.addNewWalletTypeMasterDetail.IsWithdrawalAllow === "1") ? "0" : "1"
                }
            })
        }
    }
    handleTWCheckChange = name => (checked) => {
        this.setState({ [name]: checked });
        if (this.state.checkedSwitch !== true) {
            this.setState({
                addNewWalletTypeMasterDetail: {
                    ...this.state.addNewWalletTypeMasterDetail,
                    IsTransactionWallet: (this.state.addNewWalletTypeMasterDetail.IsTransactionWallet === "1") ? "0" : "1"
                }
            })
        }
    }
    handleCheckChange = name => (checked) => {
        this.setState({ [name]: checked });
        if (this.state.checkedSwitch !== true) {
            this.setState({
                addNewWalletTypeMasterDetail: {
                    ...this.state.addNewWalletTypeMasterDetail,
                    Status: (this.state.addNewWalletTypeMasterDetail.Status === "1") ? "0" : "1"
                }
            })
        }
    }
    //submit Updated Form Wallet Type Master Policy
    onSubmitWalletTypeMasterForm() {
        const { errors, isValid } = validateEditWalletTypeMasterRequest(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            this.setState({
                isButtonDisabled: true
            })
            const { editWalletTypeMastereDetail } = this.state;
            let reqObj = {
                WalletTypeName: editWalletTypeMastereDetail.CoinName,
                Description: editWalletTypeMastereDetail.Description,
                IsDepositionAllow: parseInt(editWalletTypeMastereDetail.IsDepositionAllow),
                IsWithdrawalAllow: parseInt(editWalletTypeMastereDetail.IsWithdrawalAllow),
                IsTransactionWallet: parseInt(editWalletTypeMastereDetail.IsTransactionWallet),
                Status: parseInt(editWalletTypeMastereDetail.Status)
            };
            this.props.onUpdateWalletTypeMaster({
                id: editWalletTypeMastereDetail.Id,
                reqObj
            });
        }
    }
    componentWillReceiveProps(nextProps) {
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getWalletTypeMaster();
                this.props.getCurrencyList();
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        if (nextProps.addWalletTypeMasterData.hasOwnProperty("ReturnCode")) {
            if (nextProps.addWalletTypeMasterData.ReturnCode !== 0) {
                NotificationManager.error(nextProps.addWalletTypeMasterData.ReturnMsg);
            } else if (nextProps.addWalletTypeMasterData.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id={"wallet.wallettype.addMsg"} />);
                this.setState({ editWalletTypeMasterModel: false });
                this.props.getWalletTypeMaster();
                this.props.getWalletTypeMaster();
            }
        }
        if (nextProps.updateWalletTypeMaster.hasOwnProperty("ReturnCode")) {
            if (nextProps.updateWalletTypeMaster.ReturnCode !== 0) {
                NotificationManager.error(nextProps.addWalletTypeMasterData.ReturnMsg);
            } else if (nextProps.updateWalletTypeMaster.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id={"wallet.wallettype.updateMsg"} />);
                this.setState({ editWalletTypeMasterModel: false, isButtonDisabled: false });
                this.props.getWalletTypeMaster();
                this.props.getWalletTypeMaster();
            }
        }
        if (nextProps.deleteStatus.hasOwnProperty("ReturnCode")) {
            if (nextProps.deleteStatus.ReturnCode !== 0) {
                NotificationManager.error(nextProps.addWalletTypeMasterData.ReturnMsg);
            } else if (nextProps.deleteStatus.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id={"wallet.wallettype.deleteMsg"} />);
                this.props.getWalletTypeMaster();
            }
        }
        if (nextProps.getWalletTypeById.ReturnCode === 0) {
            this.setState({
                editWalletTypeMasterModel: true,
                editWalletTypeMastereDetail: nextProps.getWalletTypeById.walletTypeMaster,
                addNewWalletTypeMaster: false
            });
        }
        if (nextProps.currencyList) {
            this.setState({
                currencyList: nextProps.currencyList
            })
        }
    }
    onChangeEditText(key, value) {
        this.setState({
            editWalletTypeMastereDetail: {
                ...this.state.editWalletTypeMastereDetail,
                [key]: value
            }
        });
    }
    toggleStatusEditSwitch = (key) => {
        let tempObj = key;
        tempObj.Status = tempObj.Status ? 0 : 1;
        this.setState({
            editWalletTypeMastereDetail: {
                ...this.state.editWalletTypeMastereDetail,
                tempObj
            }
        });
    }
    toggleDepositionAllowEditSwitch = (key) => {
        let tempObj = key;
        tempObj.IsDepositionAllow = tempObj.IsDepositionAllow ? 0 : 1;
        this.setState({
            editWalletTypeMastereDetail: {
                ...this.state.editWalletTypeMastereDetail,
                tempObj
            }
        });
    }
    toggleWithdrawalAllowEditSwitch = (key) => {
        let tempObj = key;
        tempObj.IsWithdrawalAllow = tempObj.IsWithdrawalAllow ? 0 : 1;
        this.setState({
            editWalletTypeMastereDetail: {
                ...this.state.editWalletTypeMastereDetail,
                tempObj
            }
        });
    }
    toggleTransactionWalletEditSwitch = (key) => {
        let tempObj = key;
        tempObj.IsTransactionWallet = tempObj.IsTransactionWallet ? 0 : 1;
        this.setState({
            editWalletTypeMastereDetail: {
                ...this.state.editWalletTypeMastereDetail,
                tempObj
            }
        });
    }
    onAddNewWalletTypeMasterDetail(menuDetail) {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                editWalletTypeMasterModel: true,
                addNewWalletTypeMaster: true,
                editWalletTypeMastereDetail: null,
                addNewWalletTypeMasterDetail: {
                    WalletTypeName: "",
                    Description: "",
                    IsDepositionAllow: "0",
                    IsWithdrawalAllow: "0",
                    IsTransactionWallet: "0",
                    Status: "0"
                },
                // menuDetail: menuDetail
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    //submit new record for Transaction policy
    onSubmitAddNewWalletTypeMasterForm() {
        const { errors, isValid } = validateAddWalletTypeMasterRequest(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            const { addNewWalletTypeMasterDetail } = this.state;
            this.props.addWalletTypeMaster(addNewWalletTypeMasterDetail);
        }

    }
    onChangeText(key, value) {
        this.setState({
            addNewWalletTypeMasterDetail: {
                ...this.state.addNewWalletTypeMasterDetail,
                [key]: value
            }
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
        /* check menu permission */
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('18FCC217-A78E-9CF9-6904-F17706051384'); //18FCC217-A78E-9CF9-6904-F17706051384
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const intl = this.props.intl;
        const {
            editWalletTypeMasterModel,
            editWalletTypeMastereDetail,
            addNewWalletTypeMaster,
            addNewWalletTypeMasterDetail,
            errors
        } = this.state;
        const { drawerClose } = this.props;
        const walletTypeMasters = this.props.walletTypesData.hasOwnProperty('walletTypeMasters') ? this.props.walletTypesData.walletTypeMasters : [];
        const columns = [
            {
                name: intl.formatMessage({ id: "table.id" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "lable.WalletTypeName" }),
                options: { sort: true, filter: true }
            },
            {
                name: intl.formatMessage({ id: "table.Discription" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.IsDepositionAllow" }),
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
            {
                name: intl.formatMessage({ id: "table.IsWithdrawalAllow" }),
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
            {
                name: intl.formatMessage({ id: "table.IsTransactionWallet" }),
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
            {
                name: intl.formatMessage({ id: "table.Status" }),
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
            {
                name: intl.formatMessage({ id: "table.action" }),
                options: { sort: false, filter: false }
            }
        ];
        const options = {
            responsive: "scroll",
            selectableRows: false,
            print: false,
            download: false,
            viewColumns: false,
            filterType: 'dropdown',
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            filter: menuPermissionDetail.Utility.indexOf('18736530') !== -1, //for check filter permission,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            textLabels: {
                body: {
                    noMatch: intl.formatMessage({ id: "wallet.emptyTable" }),
                    toolTip: intl.formatMessage({ id: "wallet.sort" }),
                }
            },
            customToolbar: () => {
                if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
                    return (
                        <Button
                            variant="raised"
                            className="btn-primary text-white mt-5 mb-15 wallet_wallettype_button"
                            style={{ float: "right" }}
                            onClick={() => this.onAddNewWalletTypeMasterDetail(this.checkAndGetMenuAccessDetail('18FCC217-A78E-9CF9-6904-F17706051384').HasChild)} //3B139BDC-43A6-1A60-333B-813AFD973294
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
                <WalletPageTitle title={<IntlMessages id="walletDashboard.WalletTypes" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="StackingHistory">
                    {this.props.Loading && <JbsSectionLoader />}
                    <MUIDataTable
                        data={walletTypeMasters.map((item, key) => {
                            return [
                                key + 1,
                                item.CoinName,
                                item.Description,
                                item.IsDepositionAllow ? intl.formatMessage({ id: "sidebar.btnEnable" }) : intl.formatMessage({ id: "sidebar.btnDisable" }),
                                item.IsWithdrawalAllow ? intl.formatMessage({ id: "sidebar.btnEnable" }) : intl.formatMessage({ id: "sidebar.btnDisable" }),
                                item.IsTransactionWallet ? intl.formatMessage({ id: "sidebar.btnEnable" }) : intl.formatMessage({ id: "sidebar.btnDisable" }),
                                item.Status ? intl.formatMessage({ id: "sidebar.btnEnable" }) : intl.formatMessage({ id: "sidebar.btnDisable" }),
                                <div className="list-action">
                                    {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && // check for edit permission
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.onEditWalletTypeMaster(item, this.checkAndGetMenuAccessDetail('18FCC217-A78E-9CF9-6904-F17706051384').HasChild)} //308F3AF6-8741-703C-2399-8A29348D5472
                                        >
                                            <i className="ti-pencil" />
                                        </a>
                                    }
                                    {menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 && // check for delete permission
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
                {editWalletTypeMasterModel && (
                    <Drawer
                        width="40%"
                        handler={false}
                        open={this.state.editWalletTypeMasterModel}
                        className="drawer2 half_drawer"
                        level=".drawer1"
                        placement="right"
                        levelMove={100}
                    >
                        <div className="jbs-page-content">
                            <div className="page-title d-flex justify-content-between align-items-center">
                                {addNewWalletTypeMaster ? (
                                    <h2>
                                        <span>
                                            <IntlMessages id="modal.addWalletTypeMaster" />
                                        </span>
                                    </h2>
                                ) : (
                                        <h2>
                                            <span>
                                                <IntlMessages id="modal.editWalletTypeMaster" />
                                            </span>
                                        </h2>
                                    )}
                                <div className="page-title-wrap drawer_btn mb-10 text-right">
                                    <Button
                                        className="btn-warning text-white mr-10 mb-10"
                                        style={buttonSizeSmall}
                                        variant="fab"
                                        mini
                                        onClick={this.toggleEditWalletTypeModal}
                                    >
                                        <i className="zmdi zmdi-mail-reply" />
                                    </Button>
                                    <Button
                                        className="btn-info text-white mr-10 mb-10"
                                        style={buttonSizeSmall}
                                        variant="fab"
                                        mini
                                        onClick={this.closeAll}
                                    >
                                        <i className="zmdi zmdi-home" />
                                    </Button>
                                </div>
                            </div>
                            <Fragment>
                                <Alert color="danger" isOpen={this.state.showError} toggle={(e) => this.setState({ showError: false })}>
                                    {this.state.responseMessage}
                                </Alert>
                                <Alert color="success" isOpen={this.state.showSuccess} toggle={(e) => this.setState({ showSuccess: false })}>
                                    {this.state.responseMessage}
                                </Alert>
                            </Fragment>
                            {this.props.Loading && <JbsSectionLoader />}
                            {addNewWalletTypeMaster ? (
                                <AddWalletTypes
                                    addNewWalletTypeMasterDetail={addNewWalletTypeMasterDetail}
                                    errors={errors}
                                    currencyList={this.state.currencyList}
                                    onChangeText={this.onChangeText.bind(this)}
                                    handleCheckChange={this.handleCheckChange.bind(this)}
                                    handleDACheckChange={this.handleDACheckChange.bind(this)}
                                    handleWACheckChange={this.handleWACheckChange.bind(this)}
                                    handleTWCheckChange={this.handleTWCheckChange.bind(this)}
                                    {...this.props}
                                />
                            ) : (
                                    <EditWalletTypes
                                        editWalletTypeMastereDetail={editWalletTypeMastereDetail}
                                        errors={errors}
                                        currencyList={this.state.currencyList}
                                        onChangeEditText={this.onChangeEditText.bind(this)}
                                        toggleDepositionAllowEditSwitch={this.toggleDepositionAllowEditSwitch.bind(this)}
                                        toggleWithdrawalAllowEditSwitch={this.toggleWithdrawalAllowEditSwitch.bind(this)}
                                        toggleTransactionWalletEditSwitch={this.toggleTransactionWalletEditSwitch.bind(this)}
                                        toggleStatusEditSwitch={this.toggleStatusEditSwitch.bind(this)}
                                        {...this.props}
                                    />
                                )}
                            {addNewWalletTypeMaster ? (this.checkAndGetMenuAccessDetail('18FCC217-A78E-9CF9-6904-F17706051384').HasChild &&
                                (<div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                    <div className="btn_area">
                                        <Button
                                            variant="raised"
                                            className="btn-primary text-white mr-10"
                                            onClick={(e) => this.onSubmitAddNewWalletTypeMasterForm()}
                                        >
                                            <IntlMessages id="button.add" />
                                        </Button>{" "}
                                        <Button
                                            variant="raised"
                                            className="btn-danger text-white"
                                            onClick={this.toggleEditWalletTypeModal}
                                        >
                                            <IntlMessages id="button.cancel" />
                                        </Button>
                                    </div>
                                </div>)
                            ) : (
                                    <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                        <div className="btn_area">
                                            <Button
                                                variant="raised"
                                                className="btn-primary text-white mr-10"
                                                onClick={() => this.onSubmitWalletTypeMasterForm()}
                                                disabled={this.state.isButtonDisabled}
                                            >
                                                <IntlMessages id="button.update" />
                                            </Button>{" "}
                                            <Button
                                                variant="raised"
                                                className="btn-danger text-white"
                                                onClick={this.toggleEditWalletTypeModal}
                                            >
                                                <IntlMessages id="button.cancel" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </Drawer>
                )}
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

const mapToProps = ({ walletTypeMaster, withdrawRoute, authTokenRdcer }) => {
    const { currencyList } = withdrawRoute;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { walletTypesData, deleteStatus, addWalletTypeMasterData, updateWalletTypeMaster, getWalletTypeById, Loading } = walletTypeMaster;
    return { walletTypesData, deleteStatus, addWalletTypeMasterData, updateWalletTypeMaster, getWalletTypeById, Loading, currencyList, menuLoading, menu_rights };
};

export default connect(mapToProps, {
    getWalletTypeMaster,
    deleteWalletTypeMaster,
    addWalletTypeMaster,
    onUpdateWalletTypeMaster,
    getWalletTypeMasterById,
    getCurrencyList,
    getMenuPermissionByID
})(injectIntl(WalletTypesList));
