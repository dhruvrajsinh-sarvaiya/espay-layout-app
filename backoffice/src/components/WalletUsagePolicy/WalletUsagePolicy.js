/* 
    Developer : Nishant Vadgama
    Date : 19-11-2018
    File Comment : Wallet Usage Policy
*/
import React, { Component } from 'react';
import { connect } from "react-redux";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import IntlMessages from "Util/IntlMessages";
import Button from "@material-ui/core/Button";
import { getWalletUsagePolicy, updateWalletUsagePolicyStatus, addWalletUsagePolicy, onUpdateWalletUsagePolicy, getWalletType } from "Actions/WalletUsagePolicy";
import MUIDataTable from "mui-datatables";
import Drawer from "rc-drawer";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import validator from "validator";
import AddWalletUsagePolicy from "./AddWalletUsagePolicy";
import EditWalletUsagePolicy from "./EditWalletUsagePolicy";
import { injectIntl } from 'react-intl';
import classnames from "classnames";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
import { NotificationManager } from "react-notifications";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
var validateEditWalletUsagePolicyRequest = require("../../validation/WalletUsagePolicy/EditWalletUsagePolicy");
var validateAddWalletUsagePolicyRequest = require("../../validation/WalletUsagePolicy/AddWalletUsagePolicy");
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
        title: <IntlMessages id="walletDashboard.WalletUsagePolicy" />,
        link: '',
        index: 1
    },
];

class WalletUsagePolicy extends Component {
    state = {
        isButtonDisabled: false,
        WalletTypeList: [],
        typelist: [],
        showDialog: false,
        deleteId: null,
        editWalletUsagePolicyModel: false,
        editWalletUsagePolicyDetail: null,
        addNewWalletUsagePolicy: false,
        addNewWalletUsagePolicyDetail: {
            Id: "0",
            WalletType: "",
            PolicyName: "",
            AllowedIP: "",
            AllowedLocation: "",
            AuthenticationType: "",
            StartTime: null,
            EndTime: null,
            DailyTrnCount: "",
            DailyTrnAmount: "",
            HourlyTrnCount: "",
            HourlyTrnAmount: "",
            MonthlyTrnCount: "",
            MonthlyTrnAmount: "",
            WeeklyTrnCount: "",
            WeeklyTrnAmount: "",
            YearlyTrnCount: "",
            YearlyTrnAmount: "",
            LifeTimeTrnCount: "",
            LifeTimeTrnAmount: "",
            MinAmount: "",
            MaxAmount: "",
            Status: "0",
            DayNo: []
        },
        errors: "",
        notificationFlag: false,
        Flag:false,
        UpdateFlag:false,
        fieldList:{},
        menudetail: [],
        notification: true,
    }
    componentWillMount() {
            this.props.getMenuPermissionByID('19B37746-6A7A-95AE-33D7-6DE594B32CD1'); // get wallet menu permission
    }
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            editWalletUsagePolicyModel: false
        });
    };
    // hanlde delete operation
    onDelete = () => {
        this.setState({ showDialog: false })
        if (this.state.deleteId) {
            this.props.updateWalletUsagePolicyStatus({
                id: this.state.deleteId,
                status: 9 // fixed for delete
            });
            this.setState({ Flag: true });
        }
    }
    //Edit Wallet Usage Policy 
    onEditWalletUsagePolicy(walletUsagePolicy,menuDetail) {
        // check permission go on next page or not
      if(menuDetail){
        if (walletUsagePolicy.hasOwnProperty('DayNo')) {
            if (walletUsagePolicy.DayNo !== null) {
                walletUsagePolicy.DayNo = walletUsagePolicy.DayNo.toString().split(",").map(Number);
            } else {
                walletUsagePolicy.DayNo = []
            }
            if (walletUsagePolicy.hasOwnProperty('DayNo')) {
                if (walletUsagePolicy.DayNo !== null) {
                    walletUsagePolicy.DayNo = walletUsagePolicy.DayNo.toString().split(",").map(Number);
                } else {
                    walletUsagePolicy.DayNo = []
                }
            }
            if (walletUsagePolicy) {
                let newObj = Object.assign({}, walletUsagePolicy);
                this.setState({
                    editWalletUsagePolicyModel: true,
                    editWalletUsagePolicyDetail: newObj,
                    addNewWalletUsagePolicy: false,
                    // menuDetail: menuDetail
                });
            }
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
        if (walletUsagePolicy) {
            let newObj = Object.assign({}, walletUsagePolicy);
            this.setState({
                editWalletUsagePolicyModel: true,
                editWalletUsagePolicyDetail: newObj,
                addNewWalletUsagePolicy: false,
                menuDetail:menuDetail
            });
        }
    }else {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
    }
}
    //toggle Wallet Usage Policy Drawer
    toggleEditWalletUsagePolicy = () => {
        this.setState({
            editWalletUsagePolicyModel: false,
            errors: {}
        });
    };
    //submit Updated Form Form Wallet Usage Policy
    onSubmitWalletUsagePolicyForm() {
        const { errors, isValid } = validateEditWalletUsagePolicyRequest(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            this.setState({
                isButtonDisabled: true
            })
            const { editWalletUsagePolicyDetail } = this.state;
            let reqObj = {
                Id: parseFloat(editWalletUsagePolicyDetail.Id),
                WalletType: editWalletUsagePolicyDetail.WalletTypeId,
                PolicyName: editWalletUsagePolicyDetail.PolicyName,
                AllowedIP: editWalletUsagePolicyDetail.AllowedIP,
                AllowedLocation: editWalletUsagePolicyDetail.AllowedLocation,
                AuthenticationType: parseFloat(editWalletUsagePolicyDetail.AuthenticationType),
                StartTime: parseFloat(editWalletUsagePolicyDetail.StartTime),
                EndTime: parseFloat(editWalletUsagePolicyDetail.EndTime),
                DailyTrnCount: parseFloat(editWalletUsagePolicyDetail.DailyTrnCount),
                DailyTrnAmount: parseFloat(editWalletUsagePolicyDetail.DailyTrnAmount),
                HourlyTrnCount: parseFloat(editWalletUsagePolicyDetail.HourlyTrnCount),
                HourlyTrnAmount: parseFloat(editWalletUsagePolicyDetail.HourlyTrnAmount),
                MonthlyTrnCount: parseFloat(editWalletUsagePolicyDetail.MonthlyTrnCount),
                MonthlyTrnAmount: parseFloat(editWalletUsagePolicyDetail.MonthlyTrnAmount),
                WeeklyTrnCount: parseFloat(editWalletUsagePolicyDetail.WeeklyTrnCount),
                WeeklyTrnAmount: parseFloat(editWalletUsagePolicyDetail.WeeklyTrnAmount),
                YearlyTrnCount: parseFloat(editWalletUsagePolicyDetail.YearlyTrnCount),
                YearlyTrnAmount: parseFloat(editWalletUsagePolicyDetail.YearlyTrnAmount),
                LifeTimeTrnCount: parseFloat(editWalletUsagePolicyDetail.LifeTimeTrnCount),
                LifeTimeTrnAmount: parseFloat(editWalletUsagePolicyDetail.LifeTimeTrnAmount),
                MinAmount: parseFloat(editWalletUsagePolicyDetail.MinAmount),
                MaxAmount: parseFloat(editWalletUsagePolicyDetail.MaxAmount),
                Status: parseFloat(editWalletUsagePolicyDetail.Status),
                DayNo: editWalletUsagePolicyDetail.DayNo,
            };
            this.props.onUpdateWalletUsagePolicy(reqObj);
            this.setState({ UpdateFlag: true });
        }
    }
    handleEditDateChange = (type, e) => {
        let tempObj = this.state.editWalletUsagePolicyDetail;
        tempObj[type] = e.valueOf();
        this.setState({ editWalletUsagePolicyDetail: tempObj })
    };
    //function for allow only integer in text box for Edit from
    onChangeEditNumber(key, value) {
        if (
            validator.isDecimal(value, {
                force_decimal: false
            }) ||
            validator.isNumeric(value)
        ) {
            this.setState({
                editWalletUsagePolicyDetail: {
                    ...this.state.editWalletUsagePolicyDetail,
                    [key]: value
                }
            });
        }
    }
    onChangeEditText(key, value) {
        if (key === "PolicyName") {
            if (validator.isAlphanumeric(value) || value === "") {

                this.setState({
                    editWalletUsagePolicyDetail: {
                        ...this.state.editWalletUsagePolicyDetail,
                        [key]: value
                    }
                });        
            }
        } else {
            this.setState({
                editWalletUsagePolicyDetail: {
                    ...this.state.editWalletUsagePolicyDetail,
                    [key]: value
                }
            });    
        }
         }
    toggleEditSwitch = (key) => {
        let tempObj = key;
        tempObj.Status = tempObj.Status ? 0 : 1;
        this.setState({
            editWalletUsagePolicyDetail: {
                ...this.state.editWalletUsagePolicyDetail,
                tempObj
            }
        });
    }
    onAddNewWalletUsagePolicy(menuDetail) {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                editWalletUsagePolicyModel: true,
                addNewWalletUsagePolicy: true,
                editWalletUsagePolicyDetail: null,
                addNewWalletUsagePolicyDetail: {
                    Id: "0",
                    WalletType: "",
                    PolicyName: "",
                    AllowedIP: "",
                    AllowedLocation: "",
                    AuthenticationType: "",
                    StartTime: null,
                    EndTime: null,
                    DailyTrnCount: "",
                    DailyTrnAmount: "",
                    HourlyTrnCount: "",
                    HourlyTrnAmount: "",
                    MonthlyTrnCount: "",
                    MonthlyTrnAmount: "",
                    WeeklyTrnCount: "",
                    WeeklyTrnAmount: "",
                    YearlyTrnCount: "",
                    YearlyTrnAmount: "",
                    LifeTimeTrnCount: "",
                    LifeTimeTrnAmount: "",
                    MinAmount: "",
                    MaxAmount: "",
                    Status: "0",
                    DayNo: []
                },
                // menuDetail: menuDetail
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    //submit new record for Transaction policy
    onSubmitAddNewWalletUsagePolicyForm() {
        const { errors, isValid } = validateAddWalletUsagePolicyRequest(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            const { addNewWalletUsagePolicyDetail } = this.state;
            let newWalletUsagePolicy = addNewWalletUsagePolicyDetail;
            this.props.addWalletUsagePolicy(newWalletUsagePolicy);
            this.setState({ notificationFlag: true });
        }
    }
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {     
                this.props.getWalletType({ Status: 1 });
                this.setState({
                    typelist: this.props.walletUsagePolicyData.Details
                });
                this.props.getWalletUsagePolicy();
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notification: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        /* add */
        if (nextProps.addWalletUsagePolicyData.hasOwnProperty("ReturnCode") && this.state.notificationFlag) {
            this.setState({ notificationFlag: false });
            if (nextProps.addWalletUsagePolicyData.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.addWalletUsagePolicyData.ErrorCode}`} />);
                this.setState({ showError: false });
            } else if (nextProps.addWalletUsagePolicyData.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id="common.form.add.success" />);
                this.setState({ editWalletUsagePolicyModel: false });
                this.props.getWalletUsagePolicy();
            }
        }
        /* Update */
        if (nextProps.updateWalletUsagePolicyData.hasOwnProperty("ReturnCode") && this.state.UpdateFlag) {
            this.setState({ UpdateFlag: false });
            if (nextProps.updateWalletUsagePolicyData.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.updateWalletUsagePolicyData.ErrorCode}`} />);
                this.setState({ editWalletUsagePolicyModel: false });
            } else if (nextProps.updateWalletUsagePolicyData.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id="common.form.edit.success" />);
                this.setState({ editWalletUsagePolicyModel: false, isButtonDisabled: false });
                this.props.getWalletUsagePolicy();
            }
        }
        /* delete */
        if (nextProps.updateStatus.hasOwnProperty("ReturnCode") && this.state.Flag) {
            this.setState({ Flag: false });
            if (nextProps.updateStatus.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.updateStatus.ErrorCode}`} />);
            } else if (nextProps.updateStatus.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id="common.form.delete.success" />);
                this.props.getWalletUsagePolicy();
            }
        }
        if (nextProps.walletType) {
            this.setState({
                WalletTypeList: nextProps.walletType
            })
        }
    }
    handleCheckChange = name => (checked) => {
        this.setState({ [name]: checked });
        this.setState({
            addNewWalletUsagePolicyDetail: {
                ...this.state.addNewWalletUsagePolicyDetail,
                Status: (this.state.addNewWalletUsagePolicyDetail.Status === "1") ? "0" : "1"
            }
        })
    }
    handleDaysChange(checked, index) {
        if (checked) {
            this.setState({
                addNewWalletUsagePolicyDetail: {
                    ...this.state.addNewWalletUsagePolicyDetail,
                    DayNo: (this.state.addNewWalletUsagePolicyDetail.DayNo.concat(index))
                }
            });
        } else {
            this.setState({
                addNewWalletUsagePolicyDetail: {
                    ...this.state.addNewWalletUsagePolicyDetail,
                    DayNo: this.state.addNewWalletUsagePolicyDetail.DayNo.filter((v, i) => v !== index)
                }
            });
        }
    }
    handleDaysChangeEdit(checked, index) {
        if (checked) {
            this.setState({
                editWalletUsagePolicyDetail: {
                    ...this.state.editWalletUsagePolicyDetail,
                    DayNo: (this.state.editWalletUsagePolicyDetail.DayNo.concat(index))
                }
            });
        } else {
            this.setState({
                editWalletUsagePolicyDetail: {
                    ...this.state.editWalletUsagePolicyDetail,
                    DayNo: this.state.editWalletUsagePolicyDetail.DayNo.filter((v, i) => v !== index)
                }
            });
        }
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
                addNewWalletUsagePolicyDetail: {
                    ...this.state.addNewWalletUsagePolicyDetail,
                    [key]: value
                }
            });
        }
    }
    onChangeText(key, value) {
        if (key === "PolicyName") {
            if (validator.isAlphanumeric(value) || value === "") {

              this.setState({
                addNewWalletUsagePolicyDetail: {
                    ...this.state.addNewWalletUsagePolicyDetail,
                    [key]: value
                }
            });
            }
        } else {
            this.setState({
                addNewWalletUsagePolicyDetail: {
                    ...this.state.addNewWalletUsagePolicyDetail,
                    [key]: value
                }
            });
        }

    }
    handleDateChange = (type, e) => {
        let tempObj = this.state.addNewWalletUsagePolicyDetail;
        tempObj[type] = e.valueOf();
        this.setState({ addNewWalletUsagePolicyDetail: tempObj })
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('9055302E-206D-7707-387E-2CBE4C26929C'); //9055302E-206D-7707-387E-2CBE4C26929C
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const {
            editWalletUsagePolicyModel,
            editWalletUsagePolicyDetail,
            addNewWalletUsagePolicy,
            addNewWalletUsagePolicyDetail
        } = this.state;
        const { drawerClose, intl } = this.props;
        const usagePolicyList = this.props.walletUsagePolicyData.hasOwnProperty("Details") ? this.props.walletUsagePolicyData.Details : [];
        const columns = [
            {
                name: intl.formatMessage({ id: "wallet.lblSr" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "lable.WalletType" }),
                options: { sort: true, filter: true }
            },
            {
                name: intl.formatMessage({ id: "table.PolicyName" }),
                options: { sort: true, filter: false }
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
                name: intl.formatMessage({ id: "table.Action" }),
                options: { sort: false, filter: false }
            },
        ];
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            download: false,
            viewColumns: false,
            // filter: true,
            // search: true,
            filter: menuPermissionDetail.Utility.indexOf('18736530') !== -1, //for check filter permission,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customToolbar: () => {
                if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) {  // check add curd operation
                return (
                    <Button
                        variant="raised"
                        className="btn-primary text-white mt-5"
                        // style={{ float: "right" }}                      
                        onClick={() => this.onAddNewWalletUsagePolicy(this.checkAndGetMenuAccessDetail('9055302E-206D-7707-387E-2CBE4C26929C').HasChild)} //9C640BA3-60DD-958A-38AB-05E631A6056B
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
            {(this.props.menuLoading || this.props.Loading) && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="walletDashboard.WalletUsagePolicy" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="StackingHistory">
                    <MUIDataTable
                        data={usagePolicyList.map((item, key) => {
                            return [
                                key + 1,
                                item.WalletType,
                                item.PolicyName,
                                item.AllowedIP,
                                item.AllowedLocation,
                                item.Status ? intl.formatMessage({ id: "sidebar.btnEnable" }) : intl.formatMessage({ id: "sidebar.btnDisable" }),
                                <div className="list-action">
                                {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 &&
                                    <a
                                        href="javascript:void(0)"                                           
                                        onClick={() => this.onEditWalletUsagePolicy(item,this.checkAndGetMenuAccessDetail('9055302E-206D-7707-387E-2CBE4C26929C').HasChild)} //2AC143BF-02FE-4C8C-A1DE-EB4223DF063B</div>
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
                {editWalletUsagePolicyModel && (
                    <Drawer
                        width="50%"
                        handler={false}
                        open={this.state.editWalletUsagePolicyModel}
                        className="drawer2 half_drawer"
                        level=".drawer0"
                        placement="right"
                        levelMove={100}
                    >
                        <div className="jbs-page-content">
                            <div className="page-title d-flex justify-content-between align-items-center">
                                {addNewWalletUsagePolicy ? (
                                    <h2><IntlMessages id="modal.addWalletUsagePolicy" /></h2>
                                ) : (
                                        <h2><IntlMessages id="modal.editWalletUsagePolicy" /></h2>
                                    )}
                                <div className="page-title-wrap drawer_btn mb-10 text-right">
                                    <Button
                                        className="btn-warning text-white mr-10 mb-10"
                                        style={buttonSizeSmall}
                                        variant="fab"
                                        mini
                                        onClick={this.toggleEditWalletUsagePolicy}
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
                            {addNewWalletUsagePolicy ? (
                                <AddWalletUsagePolicy
                                    addNewWalletUsagePolicyDetail={addNewWalletUsagePolicyDetail}
                                    onChangeNumber={this.onChangeNumber.bind(this)}
                                    errors={this.state.errors}
                                    onChangeText={this.onChangeText.bind(this)}
                                    handleDateChange={this.handleDateChange.bind(this)}
                                    WalletTypeList={this.state.WalletTypeList}
                                    handleCheckChange={this.handleCheckChange.bind(this)}
                                    handleDaysChange={this.handleDaysChange.bind(this)}
                                    {...this.props}
                                    // menuDetail= {this.state.fieldList}
                                />
                            ) : (
                                    <EditWalletUsagePolicy
                                        editWalletUsagePolicyDetail={editWalletUsagePolicyDetail}
                                        errors={this.state.errors}
                                        WalletTypeList={this.state.WalletTypeList}
                                        onChangeEditText={this.onChangeEditText.bind(this)}
                                        onChangeEditNumber={this.onChangeEditNumber.bind(this)}
                                        handleEditDateChange={this.handleEditDateChange.bind(this)}
                                        toggleEditSwitch={this.toggleEditSwitch.bind(this)}
                                        handleDaysChange={this.handleDaysChangeEdit.bind(this)}
                                        {...this.props}
                                        // menuDetail= {this.state.fieldList}
                                    />
                                )
                            }
                            {
                                addNewWalletUsagePolicy ? (this.checkAndGetMenuAccessDetail('9055302E-206D-7707-387E-2CBE4C26929C').HasChild
                                     && 
                                    (<div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                    <div className="btn_area">
                                        <Button
                                            variant="raised"
                                            className="btn-primary text-white mr-10"
                                            onClick={(e) => this.onSubmitAddNewWalletUsagePolicyForm()}
                                        >
                                            <IntlMessages id="button.add" />
                                        </Button>{" "}
                                        <Button
                                            variant="raised"
                                            className="btn-danger text-white"
                                            onClick={this.toggleEditWalletUsagePolicy}
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
                                                onClick={() => this.onSubmitWalletUsagePolicyForm()}
                                                disabled={this.state.isButtonDisabled}
                                            >
                                                <IntlMessages id="button.update" />
                                            </Button>{" "}
                                            <Button
                                                variant="raised"
                                                className="btn-danger text-white"
                                                onClick={this.toggleEditWalletUsagePolicy}
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
            </div >
        )
    }
}

const mapToProps = ({ walletUsagePolicy,authTokenRdcer }) => {
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { walletUsagePolicyData, addWalletUsagePolicyData, updateWalletUsagePolicyData, walletType, updateStatus, Loading } = walletUsagePolicy;
    return { walletUsagePolicyData, addWalletUsagePolicyData, updateWalletUsagePolicyData, walletType, updateStatus, Loading,menuLoading ,menu_rights};
};

export default connect(mapToProps, {
    getWalletUsagePolicy,
    updateWalletUsagePolicyStatus,
    onUpdateWalletUsagePolicy,
    addWalletUsagePolicy,
    getWalletType,
    getMenuPermissionByID
})(injectIntl(WalletUsagePolicy));
