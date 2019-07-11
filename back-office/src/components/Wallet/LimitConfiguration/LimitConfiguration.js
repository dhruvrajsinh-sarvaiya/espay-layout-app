/*
    Developer : Parth Andhariya
    Date : 25-03-2019
    File Comment :  Limit Configuration
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import Button from "@material-ui/core/Button";
import Drawer from "rc-drawer";
import { injectIntl } from "react-intl";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import classnames from "classnames";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import validator from "validator";
import AppConfig from "Constants/AppConfig";
//import action for wallettype list
import { getWalletType } from "Actions/WalletUsagePolicy";
//Add and Edit Form Import
import AddLimitConfiguration from "./AddLimitConfiguration";
import EditLimitConfiguration from "./EditLimitConfiguration";
//action for Charge Configuration Detail
import {
    ListLimitConfiguration,
    getLimitConfigurationById,
    ChangeLimitsConfiguration,
    addLimitsConfiguration,
    UpdateLimitsConfiguration
} from "Actions/LimitConfiguration";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import IntlMessages from "Util/IntlMessages";
//to validate the form 
import validateAddLimitConfigurationRequest from 'Validations/LimitConfigurationValidation/AddLimitConfiguration';
import validateEditLimitConfigurationRequest from 'Validations/LimitConfigurationValidation/EditLimitConfiguration';
//to show notification of delete Limit 
import { NotificationManager } from "react-notifications";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
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
        title: <IntlMessages id="sidebar.wallet" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="lable.LimitConfiguration" />,
        link: '',
        index: 1
    },
];
//small Button 
const buttonSizeSmall = {
    maxHeight: "28px",
    minHeight: "28px",
    maxWidth: "28px",
    fontSize: "1rem"
};
// TrnsactionType
//Enum value
const TrnsactionType = [
    {
        TypeId: 1,
        TypeName: "sidebar.trading",
    },
    {
        TypeId: 2,
        TypeName: "wallet.tabDeposit",
    },

    {
        TypeId: 4,
        TypeName: "wallet.APICalls",
    },
    {
        TypeId: 9,
        TypeName: "wallet.trnTypeWithdrawal",
    },
];
//initial state
const initstate = {
    open: false,
    errors: {},
    walletType: [],
    checkedSwitch: false,
    showDialog: false,
    deleteId: null,
    addGetRecord: false,
    UpdateRecord: null,
    addNewRecordForm: false,
    addNewDetail: {
        Id: 0,
        TrnType: "",
        walletType: "",
        PerTranMinAmount: "",
        PerTranMaxAmount: "",
        StartTime: null,
        EndTime: null,
        HourlyTrnCount: "",
        HourlyTrnAmount: "",
        DailyTrnCount: "",
        DailyTrnAmount: "",
        MonthlyTrnCount: "",
        MonthlyTrnAmount: "",
        WeeklyTrnCount: "",
        WeeklyTrnAmount: "",
        YearlyTrnCount: "",
        YearlyTrnAmount: "",
        Status: "0",
        IsKYCEnable: "0"
    },
    notificationFlag: false,
    Flag: false,
    menudetail: [],
    notification: true,
};

class LimitConfiguration extends Component {
    constructor(props) {
        super(props);
        this.state = initstate;
    }
    //close all drawers
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    };
    //api called here
    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.menuDetail ? '6B13C4B3-2CAB-9CB7-9F74-DA05E05419FA' : '9954F3A7-18BF-570E-486F-33CBFAF64796'); // get wallet menu permission
    }
    // hanlde delete operation
    onDelete = () => {
        this.setState({ showDialog: false, Flag: true })
        if (this.state.deleteId) {
            this.props.ChangeLimitsConfiguration({
                Id: this.state.deleteId,
                Status: 9 // fixed for delete
            });
        }
    }
    //submit Updated Form Form Transaction Policy
    onSubmitUpdateForm() {
        const { errors, isValid } = validateEditLimitConfigurationRequest(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            const { UpdateRecord } = this.state;
            let reqObj = {
                Id: UpdateRecord.Id,
                PerTranMinAmount: parseFloat(UpdateRecord.PerTranMinAmount),
                PerTranMaxAmount: parseFloat(UpdateRecord.PerTranMaxAmount),
                HourlyTrnCount: parseFloat(UpdateRecord.HourlyTrnCount),
                HourlyTrnAmount: parseFloat(UpdateRecord.HourlyTrnAmount),
                DailyTrnCount: parseFloat(UpdateRecord.DailyTrnCount),
                DailyTrnAmount: parseFloat(UpdateRecord.DailyTrnAmount),
                WeeklyTrnCount: parseFloat(UpdateRecord.WeeklyTrnCount),
                WeeklyTrnAmount: parseFloat(UpdateRecord.WeeklyTrnAmount),
                MonthlyTrnCount: parseFloat(UpdateRecord.MonthlyTrnCount),
                MonthlyTrnAmount: parseFloat(UpdateRecord.MonthlyTrnAmount),
                YearlyTrnCount: parseFloat(UpdateRecord.YearlyTrnCount),
                YearlyTrnAmount: parseFloat(UpdateRecord.YearlyTrnAmount),
                StartTime: parseFloat(UpdateRecord.StartTime),
                EndTime: parseFloat(UpdateRecord.EndTime),
                Status: parseFloat(UpdateRecord.Status),
            };
            this.props.UpdateLimitsConfiguration(reqObj);
            this.setState({ notificationFlag: true });
        }
    }
    //function for allow only integer in text box for Edit from
    onChangeEditNumber(key, value) {
        if (
            validator.isDecimal(value, {
                no_symbols: true,
                decimal_digits: '0,8'
            }) ||
            (validator.isNumeric(value, { no_symbols: true })) || value === ""
        ) {
            this.setState({
                UpdateRecord: {
                    ...this.state.UpdateRecord,
                    [key]: value
                }
            });
        }
    }
    //for handelDate Change
    handleEditDateChange = (type, e) => {
        let tempObj = this.state.UpdateRecord;
        tempObj[type] = e.valueOf();
        this.setState({ UpdateRecord: tempObj })
    };
    //clear button 
    handleClear = () => {
        this.setState({

            walletType: this.props.walletType,
            ...initstate,
            menudetail: this.state.menudetail
        });
    }
    //getById api call for update 
    onGetLimitConguration = (id, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.props.getLimitConfigurationById({ Id: id })
            this.setState({ addNewRecordForm: false, addGetRecord: true, open: true })
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    //submit new record for Limit Configuration
    onSubmitaddNewRecordForm() {
        const { errors, isValid } = validateAddLimitConfigurationRequest(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            const { addNewDetail } = this.state;
            this.props.addLimitsConfiguration(addNewDetail);
            this.setState({ notificationFlag: true });
        }
    }
    //handle the api response 
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.ListLimitConfiguration({});
                this.props.getWalletType({ Status: 1 });
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notification: false });
        }
        //handle getById api response success
        if (nextProps.getById.ReturnCode === 0 && this.state.addGetRecord) {
            this.setState({ UpdateRecord: nextProps.getById.Data, addGetRecord: false })
        }
        //handle delete api response success
        if (nextProps.DeleteData.hasOwnProperty("ReturnCode") && this.state.Flag) {
            this.setState({ Flag: false })
            if (nextProps.DeleteData.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id={"common.form.delete.success"} />);
                this.props.ListLimitConfiguration({});
            } else if (nextProps.DeleteData.ReturnCode === 1) {
                //handle delete api response faild
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.DeleteData.ErrorCode}`} />);
            }
        }
        //handle Add/Update api response fail
        if (nextProps.Data.hasOwnProperty("ReturnCode") && this.state.notificationFlag) {
            this.setState({ notificationFlag: false })
            if (nextProps.Data.ReturnCode === 1) {
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.Data.ErrorCode}`} />);
            } else if (nextProps.Data.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id={"common.form.edit.success"} />);
                this.setState((prevstate) => {
                    return {
                         ...initstate, menudetail: prevstate.menudetail 
                }
                });
                 
                this.props.ListLimitConfiguration({});
            }
        }
        //add wallet type list
        if (nextProps.walletType) {
            this.setState({
                walletType: nextProps.walletType
            })
        }
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
            })
        }
    }
    //show Component
    showComponent(menuDetail) {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                open: true,
                addNewRecordForm: true,
                // menuDetail :menuDetail
            })
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    //handle switch for Add/Update Form
    handleCheckChange = name => (event, checked) => {
        this.setState({ [name]: checked });
        if (name === "Status") {
            if (this.state.checkedSwitch !== true) {
                //update form 
                if (this.state.UpdateRecord != null) {
                    this.setState({
                        UpdateRecord: {
                            ...this.state.UpdateRecord,
                            Status: (this.state.UpdateRecord.Status === 1) ? 0 : 1
                        }
                    })
                } else {
                    this.setState({
                        addNewDetail: {
                            ...this.state.addNewDetail,
                            Status: (this.state.addNewDetail.Status === "1") ? "0" : "1"
                        }
                    })
                }
            }
        }
        if (name === "IsKYCEnable") {
            this.setState({
                addNewDetail: {
                    ...this.state.addNewDetail,
                    IsKYCEnable: (this.state.addNewDetail.IsKYCEnable === "1") ? "0" : "1"
                }
            })
        }
    }
    //handle number for Add Form
    onChangeNumber(key, value) {
        if (
            validator.isDecimal(value, {
                no_symbols: true,
                decimal_digits: '0,8'
            }) ||
            (validator.isNumeric(value, { no_symbols: true })) || value === ""
        ) {
            this.setState({
                addNewDetail: {
                    ...this.state.addNewDetail,
                    [key]: value
                }
            });
        }
    }
    //handle text for Add Form 
    onChangeText(key, value) {
        this.setState({
            addNewDetail: {
                ...this.state.addNewDetail,
                [key]: value
            }
        });
    }
    //handle Dates for Add/Update form 
    handleDateChange = (type, e) => {
        let tempObj = this.state.addNewDetail;
        tempObj[type] = e.valueOf();
        this.setState({ addNewDetail: tempObj })
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
        /* check menu permission */
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail(this.props.menuDetail ? '6525A743-A518-39A6-45CE-EDCA6D7E6EB9' : 'CCDF9019-081A-22CB-1051-6A1D0A8A7CF8'); //CCDF9019-081A-22CB-1051-6A1D0A8A7CF8
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const {
            open,
            UpdateRecord,
            addNewRecordForm,
            addNewDetail
        } = this.state;
        const { drawerClose, intl } = this.props;
        const columns = [
            {
                name: intl.formatMessage({ id: "wallet.lblSr" }),
                options: {
                    filter: false,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "lable.WalletTypeName" }),
                options: {
                    filter: true,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "wallet.trnType" }),
                options: {
                    filter: true,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "lable.KYCComplaint" }),
                options: {
                    filter: true,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "sidebar.Status" }),
                options: {
                    sort: true,
                    filter: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <span className={classnames({
                                "badge badge-danger": (value === intl.formatMessage({ id: "wallet.Inactive" })),
                                "badge badge-success": (value === intl.formatMessage({ id: "wallet.Active" }))
                            })} >
                                {value}
                            </span>
                        );
                    }
                }
            },
            {
                name: intl.formatMessage({ id: "sidebar.colAction" }),
                options: {
                    filter: false,
                    sort: false
                }
            }
        ];
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            download: false,
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            viewColumns: false,
            filter: menuPermissionDetail.Utility.indexOf('18736530') !== -1, //for check search permission,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            textLabels: {
                body: {
                    noMatch: intl.formatMessage({ id: "wallet.emptyTable" }),
                    toolTip: intl.formatMessage({ id: "wallet.sort" })
                }
            },
            customToolbar: () => {
                if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
                    return (
                        <Button
                            variant="raised"
                            className="btn-primary text-white mt-5"
                            style={{ float: "right" }}
                            onClick={() => this.showComponent(this.checkAndGetMenuAccessDetail(this.props.menuDetail ? '6525A743-A518-39A6-45CE-EDCA6D7E6EB9' : 'CCDF9019-081A-22CB-1051-6A1D0A8A7CF8').HasChild
                            )}
                        //7903E8C6-7914-3D67-78A7-903FA4F1484B
                        >
                            {intl.formatMessage({ id: "button.addNew" })}
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
                <WalletPageTitle title={intl.formatMessage({ id: this.props.componentTlt })} breadCrumbData={this.props.BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="StackingHistory">
                    {this.props.loading && <JbsSectionLoader />}
                    <MUIDataTable
                        data={this.props.ListData.length > 0 && this.props.ListData.map((item, key) => {
                            return [
                                key + 1,
                                item.WalletTypeName,
                                item.StrTrnType,
                                item.IsKYCEnable === 1 ? intl.formatMessage({ id: "sidebar.yes" }) : intl.formatMessage({ id: "sidebar.no" }),
                                item.Status ? intl.formatMessage({ id: "wallet.Active" }) : intl.formatMessage({ id: "wallet.Inactive" }),
                                <div className="list-action">
                                    {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 &&
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.onGetLimitConguration(item.Id, this.checkAndGetMenuAccessDetail(this.props.menuDetail ? '6525A743-A518-39A6-45CE-EDCA6D7E6EB9' : 'CCDF9019-081A-22CB-1051-6A1D0A8A7CF8').HasChild)}  //CF0F289B-A5C5-642F-2933-15C5FA665CD3
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
                {open && (
                    <Drawer
                        width="50%"
                        handler={false}
                        open={this.state.open}
                        level=".drawer0"
                        className="drawer2 half_drawer"
                        placement="right"
                        levelMove={100}
                    >
                        <div className="jbs-page-content">
                            <div className="page-title d-flex justify-content-between align-items-center">
                                {addNewRecordForm ? (
                                    <h2><IntlMessages id="lable.addLimitConfiguration" /></h2>
                                ) : (
                                        <h2><IntlMessages id="lable.editLimitConfiguration" /></h2>
                                    )}
                                <div className="page-title-wrap drawer_btn mb-10 text-right">
                                    <Button
                                        className="btn-warning text-white mr-10 mb-10"
                                        style={buttonSizeSmall}
                                        variant="fab"
                                        mini
                                        onClick={this.handleClear}
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
                            {this.props.loading && <JbsSectionLoader />}
                            {addNewRecordForm ? (
                                <AddLimitConfiguration
                                    addNewDetail={addNewDetail}
                                    TrnsactionType={TrnsactionType}
                                    walletType={this.state.walletType}
                                    onChangeText={this.onChangeText}
                                    errors={this.state.errors}
                                    onChangeNumber={this.onChangeNumber}
                                    handleDateChange={this.handleDateChange}
                                    handleCheckChange={this.handleCheckChange}
                                    menuDetail={this.props.menuDetail}
                                />
                            ) : (
                                    <EditLimitConfiguration
                                        UpdateRecord={UpdateRecord ? UpdateRecord : ""}
                                        TrnsactionType={TrnsactionType}
                                        walletType={this.state.walletType}
                                        errors={this.state.errors}
                                        onChangeEditNumber={this.onChangeEditNumber}
                                        handleEditDateChange={this.handleEditDateChange}
                                        handleCheckChange={this.handleCheckChange}
                                        menuDetail={this.props.menuDetail}
                                    />
                                )
                            }
                            {
                                addNewRecordForm ? (
                                    this.checkAndGetMenuAccessDetail(this.props.menuDetail ? '6525A743-A518-39A6-45CE-EDCA6D7E6EB9' : 'CCDF9019-081A-22CB-1051-6A1D0A8A7CF8').HasChild &&
                                    (<div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                        <div className="btn_area">
                                            <Button
                                                variant="raised"
                                                className="btn-primary text-white mr-10"
                                                onClick={(e) => this.onSubmitaddNewRecordForm()}
                                                disabled={this.props.loading}
                                            >
                                                <IntlMessages id="button.add" />
                                            </Button>{" "}
                                            <Button
                                                variant="raised"
                                                className="btn-danger text-white"
                                                onClick={this.handleClear}
                                            >
                                                <IntlMessages id="button.cancel" />
                                            </Button>
                                        </div>
                                    </div>)
                                ) :
                                    (<div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                        <div className="btn_area">
                                            <Button
                                                variant="raised"
                                                className="btn-primary text-white mr-10"
                                                onClick={() => this.onSubmitUpdateForm()}
                                                disabled={this.props.loading}
                                            >
                                                <IntlMessages id="button.update" />
                                            </Button>{" "}
                                            <Button
                                                variant="raised"
                                                className="btn-danger text-white"
                                                onClick={this.handleClear}
                                            >
                                                <IntlMessages id="button.cancel" />
                                            </Button>
                                        </div>
                                    </div>)
                            }

                        </div >
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
        );
    }
}
//added by salim dt:27/03/2019
LimitConfiguration.defaultProps = {
    componentTlt: 'lable.LimitConfiguration',
    BreadCrumbData: BreadCrumbData
}

//map method
const mapStateToProps = ({ ConfigurationLimit, walletUsagePolicy, transactionPolicy, drawerclose, authTokenRdcer }) => {
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { walletTransactionType } = transactionPolicy;
    const { walletType } = walletUsagePolicy;
    const { loading, ListData, Data, getById, DeleteData } = ConfigurationLimit;
    return {
        drawerclose,
        loading,
        ListData,
        Data,
        getById,
        walletType,
        walletTransactionType,
        DeleteData,
        menuLoading,
        menu_rights
    };
};

export default connect(
    mapStateToProps,
    {
        ListLimitConfiguration,
        getLimitConfigurationById,
        ChangeLimitsConfiguration,
        getWalletType,
        addLimitsConfiguration,
        UpdateLimitsConfiguration,
        getMenuPermissionByID
    }
)(injectIntl(LimitConfiguration));
