import React, { Component } from 'react';
import { connect } from "react-redux";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import IntlMessages from "Util/IntlMessages";
import Button from "@material-ui/core/Button";
import MUIDataTable from "mui-datatables";
import Drawer from "rc-drawer";
import validator from "validator";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import AddTransactionPolicy from "./AddTransactionPolicy";
import EditTransactionPolicy from "./EditTransactionPolicy";
import classnames from "classnames";
import { injectIntl } from 'react-intl';
import {
    getTransactionPolicy,
    updateTransactionPolicyStatus,
    onUpdateTransactionPolicy,
    addTransactionPolicy,
    getWalletTransactionType,
    getRoleDetails
} from "Actions/TransactionPolicy";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
import { NotificationManager } from "react-notifications";
//import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
var validateTransactionPolicyRequest = require("../../validation/TransactionPolicy/EditTransactionPolicy");
var validateaddTransactionPolicyRequest = require("../../validation/TransactionPolicy/AddTransactionPolicy");
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
        title: <IntlMessages id="walletDashboard.transactionPolicy" />,
        link: '',
        index: 1
    },
];

class TransactionPolicyList extends Component {
    state = {
        TrnsactionType: [],
        Roles: [],
        isButtonDisabled: false,
        showDialog: false,
        deleteId: null,
        editTransactionPolicyModal: false,
        editTransactionPolicyReport: null,
        addNewTransactionPolicyForm: false,
        addNewTransactionPolicyDetail: {
            TrnType: "",
            RoleId: "",
            AllowedIP: "",
            AllowedLocation: "",
            AuthenticationType: "",
            StartTime: null,
            EndTime: null,
            DailyTrnCount: "",
            DailyTrnAmount: "",
            MonthlyTrnCount: "",
            MonthlyTrnAmount: "",
            WeeklyTrnCount: "",
            WeeklyTrnAmount: "",
            YearlyTrnCount: "",
            YearlyTrnAmount: "",
            MinAmount: "",
            MaxAmount: "",
            AuthorityType: "",
            AllowedUserType: "",
            Status: "0",
            IsKYCEnable: "0",
        },
        errors: {},
        notificationFlag: false,
        fieldList: {},
        menudetail: [],
        notification: true,
    };
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            editTransactionPolicyModal: false
        });
    };
    componentWillMount() {
        this.props.getMenuPermissionByID('30AA0584-7167-6EF9-8DB9-4584B1242A2C'); // get wallet menu permission
    }
    // hanlde delete operation
    onDelete = () => {
        this.setState({ showDialog: false })
        if (this.state.deleteId) {
            this.props.updateTransactionPolicyStatus({
                id: this.state.deleteId,
                status: 9 // fixed for delete
            });
            this.setState({ notificationFlag: true });
        }
    }
    //Edit Transaction Policy 
    onEditTransactionPolicy(transactionPolicy, menudetail) {
        // check permission go on next page or not
        if (menudetail) {
            // var fieldList = {};
            // if (menudetail.Fields && menudetail.Fields.length) {
            //     menudetail.Fields.forEach(function (item) {
            //         fieldList[item.GUID] = item;
            //     });
            //     this.setState({
            //         fieldList: fieldList
            //     });

            // }
            if (transactionPolicy) {
                let newObj = Object.assign({}, transactionPolicy);
                this.setState({
                    editTransactionPolicyModal: true,
                    editTransactionPolicyReport: newObj,
                    addNewTransactionPolicyForm: false,
                    // menudetail: menudetail
                });
            }
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    toggleEditSwitch = (key) => {
        let tempObj = key;
        tempObj.Status = tempObj.Status ? 0 : 1;
        this.setState({
            editTransactionPolicyReport: {
                ...this.state.editTransactionPolicyReport,
                tempObj
            }
        });
    }
    toggleKYCSwitch = (key) => {
        let tempObj = key;
        tempObj.IsKYCEnable = tempObj.IsKYCEnable ? 0 : 1;
        this.setState({
            editTransactionPolicyReport: {
                ...this.state.editTransactionPolicyReport,
                tempObj
            }
        });
    }
    //toggle Transaction Policy Drawer
    toggleEditTransactionPolicyModal = () => {
        this.setState({
            editTransactionPolicyModal: false,
            errors: {}
        });
    };
    //submit Updated Form Form Transaction Policy
    onSubmitTransactionPolicyForm() {
        const { errors, isValid } = validateTransactionPolicyRequest(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            this.setState({
                isButtonDisabled: true
            })
            const { editTransactionPolicyReport } = this.state;
            const TrnPolicyId = parseFloat(editTransactionPolicyReport.Id);
            let reqObj = {
                AllowedIP: editTransactionPolicyReport.AllowedIP,
                AllowedLocation: editTransactionPolicyReport.AllowedLocation,
                AllowedUserType: parseFloat(editTransactionPolicyReport.AllowedUserType),
                AuthenticationType: parseFloat(editTransactionPolicyReport.AuthenticationType),
                AuthorityType: parseFloat(editTransactionPolicyReport.AuthorityType),
                DailyTrnAmount: parseFloat(editTransactionPolicyReport.DailyTrnAmount),
                DailyTrnCount: parseFloat(editTransactionPolicyReport.DailyTrnCount),
                EndTime: parseFloat(editTransactionPolicyReport.EndTime),
                MaxAmount: parseFloat(editTransactionPolicyReport.MaxAmount),
                MinAmount: parseFloat(editTransactionPolicyReport.MinAmount),
                MonthlyTrnAmount: parseFloat(editTransactionPolicyReport.MonthlyTrnAmount),
                MonthlyTrnCount: parseFloat(editTransactionPolicyReport.MonthlyTrnCount),
                StartTime: parseFloat(editTransactionPolicyReport.StartTime),
                Status: parseFloat(editTransactionPolicyReport.Status),
                WeeklyTrnAmount: parseFloat(editTransactionPolicyReport.WeeklyTrnAmount),
                WeeklyTrnCount: parseFloat(editTransactionPolicyReport.WeeklyTrnCount),
                YearlyTrnAmount: parseFloat(editTransactionPolicyReport.YearlyTrnAmount),
                YearlyTrnCount: parseFloat(editTransactionPolicyReport.YearlyTrnCount),
                IsKYCEnable: parseFloat(editTransactionPolicyReport.IsKYCEnable),
            };
            this.props.onUpdateTransactionPolicy({
                id: TrnPolicyId,
                reqObj
            });
            this.setState({ notificationFlag: true });
        }
    }
    //function for allow only integer in text box for Edit from
    onChangeEditNumber(key, value) {
        if (
            validator.isDecimal(value, {
                force_decimal: false
            }) ||
            validator.isNumeric(value)
        ) {
            this.setState({
                editTransactionPolicyReport: {
                    ...this.state.editTransactionPolicyReport,
                    [key]: value
                }
            });
        }
    }
    //onChnage Method for textbox
    onChangeEditText(key, value) {
        this.setState({
            editTransactionPolicyReport: {
                ...this.state.editTransactionPolicyReport,
                [key]: value
            }
        });
    }
    //for handelDate Change
    handleEditDateChange = (type, e) => {
        let tempObj = this.state.editTransactionPolicyReport;
        tempObj[type] = e.valueOf();
        this.setState({ editTransactionPolicyReport: tempObj })
    };
    //add new Transaction Policy
    addNewTransactionPolicy(menudetail) {
        // check permission go on next page or not
        if (menudetail) {
            // var fieldList = {};
            // if (menudetail.Fields && menudetail.Fields.length) {
            //     menudetail.Fields.forEach(function (item) {
            //         fieldList[item.GUID] = item;
            //     });
            //     this.setState({
            //         fieldList: fieldList
            //     });

            // }
            this.setState({
                editTransactionPolicyModal: true,
                addNewTransactionPolicyForm: true,
                editTransactionPolicyReport: null,
                addNewTransactionPolicyDetail: {
                    TrnType: "",
                    RoleId: "",
                    AllowedIP: "",
                    AllowedLocation: "",
                    AuthenticationType: "",
                    StartTime: null,
                    EndTime: null,
                    DailyTrnCount: "",
                    DailyTrnAmount: "",
                    MonthlyTrnCount: "",
                    MonthlyTrnAmount: "",
                    WeeklyTrnCount: "",
                    WeeklyTrnAmount: "",
                    YearlyTrnCount: "",
                    YearlyTrnAmount: "",
                    MinAmount: "",
                    MaxAmount: "",
                    AuthorityType: "",
                    AllowedUserType: "",
                    Status: "0",
                    IsKYCEnable: "0"
                },
                // menudetail: menudetail
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    //submit new record for Transaction policy
    onSubmitAddNewTransactionPolicyForm() {
        const { errors, isValid } = validateaddTransactionPolicyRequest(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            const { addNewTransactionPolicyDetail } = this.state;
            let newTransactionPolicy = addNewTransactionPolicyDetail;
            this.props.addTransactionPolicy(newTransactionPolicy);
            this.setState({ notificationFlag: true });
        }
    }
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {     
                this.props.getTransactionPolicy();
                this.props.getWalletTransactionType();
                this.props.getRoleDetails();
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notification: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        /* add */
        if (nextProps.addTransactionData.hasOwnProperty("ReturnCode") && this.state.notificationFlag) {
            this.setState({ notificationFlag: false });
            if (nextProps.addTransactionData.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.addTransactionData.ErrorCode}`} />);
                // this.setState({ editTransactionPolicyModal: false });
            } else if (nextProps.addTransactionData.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id="common.form.add.success" />);
                this.setState({ editTransactionPolicyModal: false });
                this.props.getTransactionPolicy();
            }
        }
        /* update */
        if (nextProps.updateTransactionData.hasOwnProperty("ReturnCode") && this.state.notificationFlag) {
            this.setState({ notificationFlag: false });
            if (nextProps.updateTransactionData.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.updateTransactionData.ErrorCode}`} />);
                this.setState({ editTransactionPolicyModal: false });
            } else if (nextProps.updateTransactionData.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id="common.form.edit.success" />);
                this.setState({ editTransactionPolicyModal: false, isButtonDisabled: false });
                this.props.getTransactionPolicy();
            }
        }
        /* delete */
        if (nextProps.updateStatus.hasOwnProperty("ReturnCode") && this.state.notificationFlag) {
            this.setState({ notificationFlag: false });
            if (nextProps.updateStatus.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.updateStatus.ErrorCode}`} />);
            } else if (nextProps.updateStatus.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id="common.form.delete.success" />);
                this.props.getTransactionPolicy();
            }
        }
        if (nextProps.walletTransactionType) {
            this.setState({
                TrnsactionType: nextProps.walletTransactionType
            })
        }
        if (nextProps.roleDetails) {
            this.setState({
                Roles: nextProps.roleDetails.Roles
            })
        }
    }
    handleCheckChange = name => (checked) => {
        this.setState({ [name]: checked });
        this.setState({
            addNewTransactionPolicyDetail: {
                ...this.state.addNewTransactionPolicyDetail,
                Status: (this.state.addNewTransactionPolicyDetail.Status === "1") ? "0" : "1"
            }
        })
    }
    handleKYCChange = name => (checked) => {
        this.setState({ [name]: checked });
        this.setState({
            addNewTransactionPolicyDetail: {
                ...this.state.addNewTransactionPolicyDetail,
                IsKYCEnable: (this.state.addNewTransactionPolicyDetail.IsKYCEnable === "1") ? "0" : "1"
            }
        })
    }
    onChangeNumber(key, value) {
        if (
            validator.isDecimal(value, {
                force_decimal: false,
                decimal_digits: "0,8"
            }) ||
            validator.isNumeric(value)
        ) {
            this.setState({
                addNewTransactionPolicyDetail: {
                    ...this.state.addNewTransactionPolicyDetail,
                    [key]: value
                }
            });
        }
    }
    onChangeText(key, value) {
        this.setState({
            addNewTransactionPolicyDetail: {
                ...this.state.addNewTransactionPolicyDetail,
                [key]: value
            }
        });
    }
    handleDateChange = (type, e) => {
        let tempObj = this.state.addNewTransactionPolicyDetail;
        tempObj[type] = e.valueOf();
        this.setState({ addNewTransactionPolicyDetail: tempObj })
    };
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('596258E6-5825-334C-9338-02C042516765'); //596258E6-5825-334C-9338-02C042516765
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const {
            editTransactionPolicyModal,
            editTransactionPolicyReport,
            addNewTransactionPolicyForm,
            addNewTransactionPolicyDetail
        } = this.state;
        const { drawerClose, intl } = this.props;
        const trnPolicyList = this.props.transactionPolicyData.hasOwnProperty("Data") ? this.props.transactionPolicyData.Data : [];
        const columns = [
            {
                name: intl.formatMessage({ id: "wallet.lblSr" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "lable.TrnType" }),
                options: { sort: true, filter: true }
            },
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
            {
                name: intl.formatMessage({ id: "sidebar.colRole" }),
                options: { sort: true, filter: true }
            },
            {
                name: intl.formatMessage({ id: "wallet.KYCOnly" }),
                options: { sort: true, filter: true }
            },
            {
                name: intl.formatMessage({ id: "lable.AllowedIP" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "lable.AllowedLocation" }),
                options: { sort: true, filter: false }
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
            print: false,
            download: false,
            viewColumns: false,
            // filter: true,
            filter: menuPermissionDetail.Utility.indexOf('18736530') !== -1, //for check filter permission,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            customToolbar: () => {
                if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
                    return (
                        <Button
                            variant="raised"
                            className="btn-primary text-white mt-5"
                            // style={{ float: "right" }}
                            onClick={() => this.addNewTransactionPolicy(this.checkAndGetMenuAccessDetail('596258E6-5825-334C-9338-02C042516765').HasChild)} //C72BD7FF-3E59-4786-4ED3-E828555552BB
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
                <WalletPageTitle title={<IntlMessages id="walletDashboard.transactionPolicy" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="StackingHistory">
                    {this.props.Loading && <JbsSectionLoader />}
                    <MUIDataTable
                        data={trnPolicyList.map((item, key) => {
                            return [
                                key + 1,
                                item.StrTrnType,
                                item.Status ? intl.formatMessage({ id: "sidebar.btnEnable" }) : intl.formatMessage({ id: "sidebar.btnDisable" }),
                                item.RoleName,
                                item.IsKYCEnable ? intl.formatMessage({ id: "sidebar.yes" }) : intl.formatMessage({ id: "sidebar.no" }),
                                item.AllowedIP,
                                item.AllowedLocation,
                                <div className="list-action">
                                    {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 &&
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.onEditTransactionPolicy(item, (this.checkAndGetMenuAccessDetail('596258E6-5825-334C-9338-02C042516765').HasChild))} //5B31CD29-70AF-9B6F-32DC-026B365A428A</div>
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
                {editTransactionPolicyModal && (
                    <Drawer
                        width="60%"
                        handler={false}
                        open={this.state.editTransactionPolicyModal}
                        level=".drawer0"
                        className="drawer2 half_drawer"
                        placement="right"
                        levelMove={100}
                    >
                        <div className="jbs-page-content">
                            <div className="page-title d-flex justify-content-between align-items-center">
                                {addNewTransactionPolicyForm ? (
                                    <h2><IntlMessages id="modal.addTrnPolicy" /></h2>
                                ) : (
                                        <h2><IntlMessages id="modal.editTrnPolicy" /></h2>
                                    )}
                                <div className="page-title-wrap drawer_btn mb-10 text-right">
                                    <Button
                                        className="btn-warning text-white mr-10 mb-10"
                                        style={buttonSizeSmall}
                                        variant="fab"
                                        mini
                                        onClick={this.toggleEditTransactionPolicyModal}
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
                            {this.props.Loading && <JbsSectionLoader />}
                            {addNewTransactionPolicyForm ? (
                                <AddTransactionPolicy
                                    addNewTransactionPolicyDetail={addNewTransactionPolicyDetail}
                                    TrnsactionType={this.state.TrnsactionType}
                                    onChangeText={this.onChangeText.bind(this)}
                                    Roles={this.state.Roles}
                                    errors={this.state.errors}
                                    onChangeNumber={this.onChangeNumber.bind(this)}
                                    handleDateChange={this.handleDateChange.bind(this)}
                                    handleCheckChange={this.handleCheckChange.bind(this)}
                                    handleKYCChange={this.handleKYCChange.bind(this)}
                                    {...this.props}
                                    // menudetail={this.state.fieldList}
                                />
                            ) : (
                                    <EditTransactionPolicy
                                        editTransactionPolicyReport={editTransactionPolicyReport}
                                        errors={this.state.errors}
                                        onChangeEditText={this.onChangeEditText.bind(this)}
                                        onChangeEditNumber={this.onChangeEditNumber.bind(this)}
                                        handleEditDateChange={this.handleEditDateChange.bind(this)}
                                        toggleEditSwitch={this.toggleEditSwitch.bind(this)}
                                        toggleKYCSwitch={this.toggleKYCSwitch.bind(this)}
                                        {...this.props}
                                        // menudetail={this.state.fieldList}
                                    />
                                )
                            }
                            {
                                addNewTransactionPolicyForm ? (this.checkAndGetMenuAccessDetail('596258E6-5825-334C-9338-02C042516765').HasChild
                                     &&
                                    (<div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                        <div className="btn_area">
                                        <Button
                                            variant="raised"
                                            className="btn-primary text-white mr-10"
                                            onClick={(e) => this.onSubmitAddNewTransactionPolicyForm()}
                                        >
                                            <IntlMessages id="button.add" />
                                        </Button>{" "}
                                        <Button
                                            variant="raised"
                                            className="btn-danger text-white"
                                            onClick={this.toggleEditTransactionPolicyModal}
                                        >
                                            <IntlMessages id="button.cancel" />
                                        </Button>
                                        </div>
                                    </div>)
                                ) :  (<div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                        <div className="btn_area">
                                            <Button
                                                variant="raised"
                                                className="btn-primary text-white mr-10"
                                                onClick={() => this.onSubmitTransactionPolicyForm()}
                                                disabled={this.state.isButtonDisabled}
                                            >
                                                <IntlMessages id="button.update" />
                                            </Button>{" "}
                                            <Button
                                                variant="raised"
                                                className="btn-danger text-white"
                                                onClick={this.toggleEditTransactionPolicyModal}
                                            >
                                                <IntlMessages id="button.cancel" />
                                            </Button>
                                            </div>
                                        </div>)
                            }
                        </div >
                    </Drawer >
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
                            <IntlMessages id="button.No" />
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

const mapToProps = ({ transactionPolicy ,authTokenRdcer}) => {
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { transactionPolicyData, addTransactionData, walletTransactionType, updateTransactionData, updateStatus, roleDetails, Loading } = transactionPolicy;
    return { transactionPolicyData, addTransactionData, walletTransactionType, updateTransactionData, updateStatus, roleDetails, Loading,menuLoading,menu_rights };
};

export default connect(mapToProps, {
    getTransactionPolicy,
    updateTransactionPolicyStatus,
    onUpdateTransactionPolicy,
    addTransactionPolicy,
    getWalletTransactionType,
    getRoleDetails,
    getMenuPermissionByID
})(injectIntl(TransactionPolicyList));
