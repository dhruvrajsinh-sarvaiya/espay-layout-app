/*
    Developer : Parth Andhariya
    Date : 24-05-2019
    File Comment :  Block Unblock User Address list
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import MUIDataTable from "mui-datatables";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import Button from "@material-ui/core/Button";
import { getListBlockUnblockUserAddress, getBlockUnblockUserAddress, destroyBlackfund } from "Actions/BlockUnblockUserAddressAction";
import { FormGroup, Label, Input, Form } from 'reactstrap';
import { injectIntl } from 'react-intl';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { NotificationManager } from 'react-notifications';
import classnames from "classnames";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import { verify2fa } from "Actions/Deposit";
import DialogActions from '@material-ui/core/DialogActions';
import Tooltip from '@material-ui/core/Tooltip';
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';
import validator from "validator";
import { getWalletType } from "Actions/WalletUsagePolicy";
import validateAddBlockUnblock from 'Validations/AddBlockUnblockValidation/AddBlockUnblockValidation';
import AppConfig from 'Constants/AppConfig';

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
        title: <IntlMessages id="walletDashboard.UserAddressList" />,
        link: '',
        index: 1
    },
];

const initState = {
    Address: "",
    FromDate: "",
    ToDate: "",
    Status: '',
    showReset: false,
    flag: false,
    menudetail: [],
    notificationFlag: true,
    Today: new Date().toISOString().slice(0, 10),
    showDialog: false,
    code: "",
    CollectedRecord: {},
    BlockUnblockflag: false,
    handle2faflag: true,
    showdestroyDialog: false,
    destroyData: {},
    Flag: false,
    destroyRemarks: "",
    WalletType: '',
    AddBlockUnblockflag: false,
    AddAddress: '',
    AddStatus: '',
    AddRemarks: '',
    errors: {},
}

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class BlockUnblockUserAddresss extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }
    closeAll = () => {
        this.props.closeAll();
    };

    componentWillMount() {
        this.props.getMenuPermissionByID('02F30558-639C-6C0F-7F2F-120E1EC37ECC'); // get wallet menu permission
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getListBlockUnblockUserAddress({});
                this.props.getWalletType({ Status: 1 });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }

        // success 2fa validattion
        if (nextProps.response2fa.hasOwnProperty("ErrorCode") && nextProps.response2fa.ErrorCode == 0 && this.state.handle2faflag) {
            // var Status;
            let request;
            if (this.state.CollectedRecord.Status === 1) {
                request = {
                    "Id": this.state.CollectedRecord.Id,
                    "Address": this.state.CollectedRecord.Address,
                    "WalletTypeID": this.state.CollectedRecord.WalletTypeId,
                    "Status": 2,
                    "Remarks": this.state.CollectedRecord.Remarks,
                }
            } else if (this.state.CollectedRecord.Status === 2) {
                request = {
                    "Address": this.state.CollectedRecord.Address,
                    "WalletTypeID": this.state.CollectedRecord.WalletTypeId,
                    "Status": 1,
                    "Remarks": this.state.CollectedRecord.Remarks,
                }
            }
            this.props.getBlockUnblockUserAddress(request);
            this.setState({ code: "", showDialog: false, handle2faflag: false, BlockUnblockflag: true });
        }

        if (nextProps.BlockUnblock !== "" && this.state.BlockUnblockflag) {
            if (nextProps.BlockUnblock.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id={`apiWalletErrCode.${nextProps.BlockUnblock.ErrorCode}`} />);
            } else if (nextProps.BlockUnblock.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.BlockUnblock.ErrorCode}`} />);
            }
            this.setState({ BlockUnblockflag: false })
        }

        if (nextProps.hasOwnProperty('BlackFund') && this.state.Flag) {
            this.setState({ Flag: false, destroyData: {}, showdestroyDialog: false })
            if (nextProps.BlackFund.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.BlackFund.ErrorCode}`} />);
                this.setState({ destroyRemarks: "" })
            }
            else if (nextProps.BlackFund.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id="token.BlackFund.success" />);
                this.setState({ destroyRemarks: "" })
            }
        }
    }

    /* handle confirmation of 2fa */
    handleConfirmation() {
        if (this.state.code !== '') {
            this.props.verify2fa({
                'Code': this.state.code,
            });
        }
    }

    //Apply Filter option
    applyFilter = () => {
        if (this.state.Address !== "" || (this.state.FromDate !== "" && this.state.ToDate !== "") || this.state.Status !== "") {
            this.props.getListBlockUnblockUserAddress({
                Address: this.state.Address,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                Status: this.state.Status,
            });
            this.setState({ showReset: true });
        }
    }

    Destroyfund(data) {
        this.setState({ Flag: true });
        this.props.destroyBlackfund({
            Id: data.Id,
            Address: data.Address,
            Remarks: this.state.destroyRemarks
        })
    }

    //clear filter
    clearFilter = () => {
        this.setState({
            ...initState,
            menudetail: this.state.menudetail,
            AddBlockUnblockflag: this.state.AddBlockUnblockflag,
            WalletType: this.state.WalletType,
            AddAddress: this.state.AddAddress,
            AddStatus: this.state.AddStatus,
            AddRemarks: this.state.AddRemarks,
            errors: this.state.errors,
        });
        this.props.getListBlockUnblockUserAddress({});
    }

    //change handler 
    onChangeHandler(e) {
        if (e.target.name === "Address" || e.target.name === "AddAddress") {
            if (validator.isAlphanumeric(e.target.value) || e.target.value === "") {
                this.setState({ [e.target.name]: e.target.value });
            }
        } else {
            this.setState({ [e.target.name]: e.target.value });
        }
    }

    //show Component
    showComponent(menuDetail) {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({ AddBlockUnblockflag: true })
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    //handle add form  
    AddBlockUnblock = () => {
        const { errors, isValid } = validateAddBlockUnblock(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            if (this.state.AddAddress !== "" && this.state.AddStatus !== "" && this.state.WalletType !== "" && this.state.AddRemarks !== "") {
                var request;
                if (this.state.AddStatus === "2") {
                    request = {
                        "Id": 0,
                        "Address": this.state.AddAddress,
                        "WalletTypeID": this.state.WalletType,
                        "Status": 2,
                        "Remarks": this.state.AddRemarks,
                    }
                } else if (this.state.AddStatus === "1") {
                    request = {
                        "Address": this.state.AddAddress,
                        "WalletTypeID": this.state.WalletType,
                        "Status": 1,
                        "Remarks": this.state.AddRemarks,
                    }
                }
                this.setState({ BlockUnblockflag: true });
                this.props.getBlockUnblockUserAddress(request);
            }
        }
    }

    //clear Form
    clearForm = () => {
        this.setState({
            AddAddress: '',
            AddStatus: '',
            WalletType: '',
            AddRemarks: '',
            errors: {},
            AddBlockUnblockflag: false
        });
    }

    /* check menu permission */
    checkAndGetMenuAccessDetail(GUID) {
        let response = false;
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

    /* check menu permission */
    checkAndGetFieldsAccessDetail(GUID) {
        let response = {};
        var index;
        const { menudetail } = this.state;
        if (menudetail.length) {
            for (index in menudetail) {
                if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase()) {
                    if (menudetail[index].Fields && menudetail[index].Fields.length) {
                        var fieldList = {};
                        menudetail[index].Fields.forEach(function (item) {
                            fieldList[item.GUID.toUpperCase()] = item;
                        });
                        response = fieldList;
                    }
                }
            }
        }
        return response;
    }

    render() {
        /* check menu permission */
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('72F0EA86-15BE-1050-3CD2-18AA23159812'); //72F0EA86-15BE-1050-3CD2-18AA23159812
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        var menuDetail = this.checkAndGetFieldsAccessDetail('02F3D7BB-3C24-0946-1090-D8ADFE366290');//02F3D7BB-3C24-0946-1090-D8ADFE366290 - add 
        const intl = this.props.intl;
        const { drawerClose } = this.props;
        const { errors } = this.state;
        const columns = [
            {
                name: intl.formatMessage({ id: "sidebar.colId" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "table.address" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "table.blockby" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "table.currency" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "lable.status" }),
                options: {
                    sort: true, filter: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (<span
                            className={classnames({
                                "badge badge-danger": (value === 1),
                                "badge badge-success": (value === 2),
                            })}
                        >
                            {this.props.intl.formatMessage({
                                id: "wallet.BlockUnblock." + value,
                            })}
                        </span>)
                    }
                }
            },
            {
                name: intl.formatMessage({ id: "organizationLedger.title.remarks" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "sidebar.colActions" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
        ];
        const options = {
            filter: false,
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            download: false,
            viewColumns: false,
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            search: false,// menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
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
                            onClick={() => this.showComponent(this.checkAndGetMenuAccessDetail('02F3D7BB-3C24-0946-1090-D8ADFE366290').HasField)}
                        >
                            {intl.formatMessage({ id: "button.addNew" })}
                        </Button>
                    );
                } else {
                    return false;
                }
            },
        };
        return (
            <div className="jbs-page-content">
                {(this.props.menuLoading || this.props.loading) && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="walletDashboard.UserAddressList" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="StackingHistory">
                    {menuPermissionDetail.Utility.indexOf('18736530') !== -1 &&
                        <JbsCollapsibleCard>
                            <div className="top-filter">
                                <Form className="tradefrm row">
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="FromDate">
                                            {intl.formatMessage({ id: "widgets.startDate" })}
                                        </Label>
                                        <Input
                                            type="date"
                                            name="FromDate"
                                            id="FromDate"
                                            placeholder="dd/mm/yyyy"
                                            value={this.state.FromDate}
                                            onChange={e => this.onChangeHandler(e)}
                                            max={this.state.Today}
                                        />
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="endDate">
                                            {intl.formatMessage({ id: "widgets.endDate" })}
                                        </Label>
                                        <Input
                                            type="date"
                                            name="ToDate"
                                            id="ToDate"
                                            placeholder="dd/mm/yyyy"
                                            value={this.state.ToDate}
                                            onChange={e => this.onChangeHandler(e)}
                                            max={this.state.Today}
                                        />
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Address"> {intl.formatMessage({ id: "wallet.Address" })}</Label>
                                        <Input type="text" name="Address" id="Address" placeholder={intl.formatMessage({ id: "wallet.lblAddress" })} value={this.state.Address} onChange={(e) => this.onChangeHandler(e)} maxLength={50} />
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Select-1">
                                            {intl.formatMessage({ id: "lable.status" })}
                                        </Label>
                                        <Input
                                            type="select"
                                            name="Status"
                                            id="Status"
                                            value={this.state.Status}
                                            onChange={e => this.onChangeHandler(e)}
                                        >
                                            <option value="">{intl.formatMessage({ id: "wallet.errStatus" })}</option>
                                            <option value="1">{intl.formatMessage({ id: "wallet.BlockUnblock.1" })}</option>
                                            <option value="2">{intl.formatMessage({ id: "wallet.BlockUnblock.2" })}</option>
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <div className="btn_area">
                                            <Button color="primary" variant="raised" className="text-white" onClick={() => this.applyFilter()} disabled={(this.state.Address !== "" || (this.state.FromDate !== "" && this.state.ToDate !== "") || this.state.Status !== "") ? false : true}><IntlMessages id="widgets.apply" /></Button>
                                            {this.state.showReset &&
                                                <Button className="btn-danger text-white ml-15" onClick={(e) => this.clearFilter()}>
                                                    <IntlMessages id="bugreport.list.dialog.button.clear" />
                                                </Button>
                                            }
                                        </div>
                                    </FormGroup>
                                </Form>
                            </div>
                        </JbsCollapsibleCard>
                    }
                    {/* add form for add new address in the list  */}
                    {(this.state.AddBlockUnblockflag) &&
                        <JbsCollapsibleCard>
                            <div className="top-filter">
                                <Form className="tradefrm row">
                                    {(menuDetail['00472E9C-7909-47F0-34A7-A7D1CF3F1277'] && menuDetail['00472E9C-7909-47F0-34A7-A7D1CF3F1277'].Visibility === "E925F86B") && //00472E9C-7909-47F0-34A7-A7D1CF3F1277
                                        <FormGroup className="col-md-2 col-sm-4">
                                            <Label for="FromDate">
                                                {intl.formatMessage({ id: "table.currency" })}<span className="text-danger">*</span>
                                            </Label>
                                            <Input
                                                className={(errors.WalletType) ? "is-invalid" : ""}
                                                disabled={(menuDetail['00472E9C-7909-47F0-34A7-A7D1CF3F1277'].AccessRight === "11E6E7B0") ? true : false}
                                                type="select"
                                                name="WalletType"
                                                id="walletType"
                                                value={this.state.WalletType}
                                                onChange={(e) => this.onChangeHandler(e)}>
                                                <option value="">{intl.formatMessage({ id: "wallet.errCurrency" })}</option>
                                                {this.props.walletType.length > 0 &&
                                                    this.props.walletType.map((type, index) => (
                                                        <option key={index} value={type.ID}>{type.TypeName}</option>
                                                    ))}
                                            </Input>
                                        </FormGroup>
                                    }
                                    {(menuDetail['7A52D5ED-7CCF-6ECE-5AD3-B0B377CD61A3'] && menuDetail['7A52D5ED-7CCF-6ECE-5AD3-B0B377CD61A3'].Visibility === "E925F86B") && //7A52D5ED-7CCF-6ECE-5AD3-B0B377CD61A3
                                        <FormGroup className="col-md-2 col-sm-4">
                                            <Label for="Address"> {intl.formatMessage({ id: "wallet.Address" })} <span className="text-danger">*</span></Label>
                                            <Input
                                                className={(errors.AddAddress) ? "is-invalid" : ""}
                                                disabled={(menuDetail['7A52D5ED-7CCF-6ECE-5AD3-B0B377CD61A3'].AccessRight === "11E6E7B0") ? true : false}
                                                type="text"
                                                name="AddAddress"
                                                id="AddAddress"
                                                placeholder={intl.formatMessage({ id: "wallet.lblAddress" })}
                                                value={this.state.AddAddress}
                                                onChange={(e) => this.onChangeHandler(e)}
                                                maxLength={50}
                                            />
                                        </FormGroup>
                                    }
                                    {(menuDetail['4E9DD368-505D-97FD-5F17-2DD5CFE30AF0'] && menuDetail['4E9DD368-505D-97FD-5F17-2DD5CFE30AF0'].Visibility === "E925F86B") && //4E9DD368-505D-97FD-5F17-2DD5CFE30AF0
                                        <FormGroup className="col-md-2 col-sm-4">
                                            <Label for="Address"> {intl.formatMessage({ id: "organizationLedger.title.remarks" })}<span className="text-danger">*</span></Label>
                                            <Input
                                                className={(errors.AddRemarks) ? "is-invalid" : ""}
                                                disabled={(menuDetail['4E9DD368-505D-97FD-5F17-2DD5CFE30AF0'].AccessRight === "11E6E7B0") ? true : false}
                                                type="text"
                                                name="AddRemarks"
                                                id="AddRemarks"
                                                placeholder={intl.formatMessage({ id: "organizationLedger.title.remarks" })}
                                                value={this.state.AddRemarks}
                                                onChange={(e) => this.onChangeHandler(e)}
                                            />
                                        </FormGroup>
                                    }
                                    {(menuDetail['2BE2D8C5-16F5-8E5E-6C5B-3E5642159D9F'] && menuDetail['2BE2D8C5-16F5-8E5E-6C5B-3E5642159D9F'].Visibility === "E925F86B") && //2BE2D8C5-16F5-8E5E-6C5B-3E5642159D9F
                                        <FormGroup className="col-md-2 col-sm-4">
                                            <Label for="Select-1">
                                                {intl.formatMessage({ id: "lable.status" })}<span className="text-danger">*</span>
                                            </Label>
                                            <Input
                                                className={(errors.AddStatus) ? "is-invalid" : ""}
                                                disabled={(menuDetail['2BE2D8C5-16F5-8E5E-6C5B-3E5642159D9F'].AccessRight === "11E6E7B0") ? true : false}
                                                type="select"
                                                name="AddStatus"
                                                id="AddStatus"
                                                value={this.state.AddStatus}
                                                onChange={e => this.onChangeHandler(e)}
                                            >
                                                <option value="">{intl.formatMessage({ id: "wallet.errStatus" })}</option>
                                                <option value="1">{intl.formatMessage({ id: "wallet.BlockUnblock.1" })}</option>
                                                <option value="2">{intl.formatMessage({ id: "wallet.BlockUnblock.2" })}</option>
                                            </Input>
                                        </FormGroup>
                                    }
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <div className="btn_area">
                                            <Button color="primary" variant="raised" className="text-white" onClick={() => this.AddBlockUnblock()} ><IntlMessages id="button.addNew" /></Button>
                                            <Button className="btn-danger text-white ml-15" onClick={(e) => this.clearForm()}>
                                                <IntlMessages id="button.cancel" />
                                            </Button>
                                        </div>
                                    </FormGroup>
                                </Form>
                            </div>
                        </JbsCollapsibleCard>
                    }
                    <MUIDataTable
                        data={this.props.BlockUnblockList.map((item, key) => {
                            return [
                                item.Id,
                                item.Address,
                                item.BlockedByUserName,
                                item.WalletTypeName,
                                item.Status,
                                item.Remarks,
                                <div className="list-action">
                                    {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 &&
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.setState({ showDialog: true, CollectedRecord: item, handle2faflag: true })}
                                        >
                                            {item.Status === 1 ?
                                                <i className="zmdi zmdi-lock-open" /> : <i className="zmdi zmdi-lock" />
                                            }
                                        </a>
                                    }
                                    {(menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && item.Status === 1) && <Tooltip title={intl.formatMessage({ id: "button.destroy" })} placement="bottom">
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.setState({ showdestroyDialog: true, destroyData: item })}
                                        >
                                            <i className="ti-close" />
                                        </a></Tooltip>
                                    }
                                </div>
                            ];
                        })}
                        columns={columns}
                        options={options} />
                    <Dialog
                        open={this.state.showDialog}
                        TransitionComponent={Transition}
                        keepMounted
                        fullWidth={true}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle id="alert-dialog-slide-title">
                            <div className="list-action justify-content-between d-flex">
                                <IntlMessages id="myAccount.Dashboard.2faAuthentication" />
                            </div>
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                {this.props.response2fa.loading && <JbsSectionLoader />}
                                <Form onSubmit={(e) => { e.preventDefault() }}>
                                    <FormGroup className="mb-0">
                                        <Label for="Code"><IntlMessages id="my_account.googleAuthCode" /></Label>
                                        <Input type="text" name="Code" id="Code" maxLength="6" autoComplete="off" value={this.state.code} onChange={(e) => (this.setState({ code: e.target.value }))} placeholder={intl.formatMessage({ id: "wallet.2FAPlaceholder" })} />
                                        {this.props.error2fa.hasOwnProperty("ErrorCode") && <span className="text-danger"><IntlMessages id={`apiErrCode.${this.props.error2fa.ErrorCode}`} /></span>}
                                    </FormGroup>
                                    <div className="mt-20 justify-content-between d-flex">
                                        <Button type="button" variant="raised" onClick={(e) => this.setState({ code: "", showDialog: false })} className={classnames("btn-danger text-white")} > <IntlMessages id="button.cancel" /></Button>
                                        <Button type="submit" variant="raised" onClick={(e) => this.handleConfirmation()} className={classnames("btn-success text-white", { "disabled": !this.state.code })} disabled={!this.state.code ? true : false}> <IntlMessages id="sidebar.apiConfAddGen.button.confirm" /></Button>
                                    </div>
                                </Form>
                            </DialogContentText>
                        </DialogContent>
                    </Dialog>
                </div>
                <Dialog
                    style={{ zIndex: '99999' }}
                    open={this.state.showdestroyDialog}
                    onClose={() => this.setState({ showdestroyDialog: false })}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        <IntlMessages id="global.destroy.message" />
                    </DialogTitle>&nbsp;
                   <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {this.props.loading && <JbsSectionLoader />}
                            <FormGroup className="mb-0">
                                <Label>
                                    <IntlMessages id="organizationLedger.title.remarks" /><span className="text-danger">*</span>
                                </Label>
                                <Input type="text" name="destroyRemarks" id="destroyRemarks" placeholder={intl.formatMessage({ id: "sidebar.tradeRecon.remarks.enter" })} value={this.state.destroyRemarks} onChange={(e) => this.onChangeHandler(e)}
                                />
                            </FormGroup>
                            <DialogActions>
                                <Button className="btn-primary text-white mr-10" onClick={() => this.Destroyfund(this.state.destroyData)} autoFocus disabled={this.state.destroyRemarks === ""}>
                                    <IntlMessages id="button.yes" />
                                </Button>
                                <Button onClick={() => this.setState({ showdestroyDialog: false, destroyRemarks: "" })} className="btn-danger text-white">
                                    <IntlMessages id="sidebar.btnNo" />
                                </Button>
                            </DialogActions>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

const mapDispatchToProps = ({ authTokenRdcer, BlockUnblockUserAddress, dipositReportReducer, walletUsagePolicy }) => {
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { loading, BlockUnblockList, BlockUnblock, BlackFund } = BlockUnblockUserAddress;
    const { reconResponse, response2fa, errors, error2fa } = dipositReportReducer;
    const { walletType } = walletUsagePolicy;
    return { menuLoading, menu_rights, loading, BlockUnblockList, BlockUnblock, reconResponse, response2fa, errors, error2fa, BlackFund, walletType };
};

export default connect(mapDispatchToProps, {
    getMenuPermissionByID,
    getListBlockUnblockUserAddress,
    getBlockUnblockUserAddress,
    verify2fa,
    destroyBlackfund,
    getWalletType,
})(injectIntl(BlockUnblockUserAddresss));