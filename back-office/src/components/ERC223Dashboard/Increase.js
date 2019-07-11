/* 
    Developer : Vishva shah
    Date : 27-05-2019
    File Comment : Increase Component
*/
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { Form, FormGroup, Label, Input } from "reactstrap";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import "rc-drawer/assets/index.css";
import IntlMessages from "Util/IntlMessages";
import { injectIntl } from 'react-intl';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import classnames from "classnames";
import Dialog from '@material-ui/core/Dialog';
import { verify2fa } from "Actions/Deposit";
import MUIDataTable from "mui-datatables";
import {
    increaseTokenSupply, increaseTokenSupplyList
} from "Actions/ERC223";
import { getWalletType } from "Actions/WalletUsagePolicy";
import { NotificationManager } from 'react-notifications';
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { changeDateFormat } from "Helpers/helpers";
import Slide from '@material-ui/core/Slide';
import validator from "validator";
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

const initState = {
    open: false,
    WalletTypeID: '',
    Remarks: "",
    Amount: '',
    showReset: false,
    menudetail: [],
    notificationFlag: false,
    flag: true,
    showDialog: false,
    code: "",
    handle2faflag: true,
    FromDate: new Date().toISOString().slice(0, 10),
    ToDate: new Date().toISOString().slice(0, 10),
    Today: new Date().toISOString().slice(0, 10),
    showApply: false,
    WalletType: "",
    ActionType: "",
    errors: {},
    isValid: true,
}

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

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
        title: <IntlMessages id="sidebar.Erc223dashboard" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="lable.Increase" />,
        link: '',
        index: 2
    },
];

class Increase extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('37434F40-8165-2628-263D-8A06E9FAA2DD'); // get wallet menu permission
    }

    // will receive props update state..
    componentWillReceiveProps(nextProps) {
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.flag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getWalletType({ Status: 1 });
                this.props.increaseTokenSupplyList({});
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ flag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }

        // success 2fa validattion
        if (nextProps.response2fa.hasOwnProperty("ErrorCode") && nextProps.response2fa.ErrorCode === 0 && this.state.handle2faflag) {
            var request;
            request = {
                "Amount": parseFloat(this.state.Amount),
                "WalletTypeId": parseFloat(this.state.WalletTypeID),
                "Remarks": this.state.Remarks
            }
            this.props.increaseTokenSupply(request);
            this.setState({ code: "", showDialog: false, handle2faflag: false, notificationFlag: true });
        }

        if (nextProps.IncreaseToken.hasOwnProperty("ReturnCode") && this.state.notificationFlag) {
            if (nextProps.IncreaseToken.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.IncreaseToken.ErrorCode}`} />);
            }
            else if (nextProps.IncreaseToken.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id="token.increase.success" />);
                let newObj = Object.assign({}, this.initState);
                newObj.menudetail = this.state.menudetail;
                this.setState(newObj);
            }
            this.setState({ notificationFlag: false })
        }

        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({ open: false })
        }
    }

    // close all drawer...
    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    };

    /* handle confirmation of 2fa */
    handleConfirmation() {
        if (this.state.code !== '') {
            this.props.verify2fa({
                'Code': this.state.code,
            });
        }
    }

    // numberic value only
    validateOnlyNumeric(value) {
        const regexNumeric = /^[0-9.]+$/;
        return (regexNumeric.test(value) && validator.isDecimal(value, { force_decimal: false, decimal_digits: "0,8" })) ? true : false;
    }

    // onchange filter options
    onChangeHandler(e) {
        let error = {};
        if (e.target.name === "Remarks") {
            if (isScriptTag(e.target.value)) {
                error.Remarks = "my_account.err.scriptTag";
                this.setState({ errors: error })
            }
            else if (isHtmlTag(e.target.value)) {
                error.Remarks = "my_account.err.htmlTag";
                this.setState({ errors: error })
            }
            else {
                this.setState({ errors: {} })
            }
        }

        if (e.target.name === "Amount") {
            if (this.validateOnlyNumeric(e.target.value, { no_symbols: true }) || e.target.value === '') {
                this.setState({ [e.target.name]: e.target.value });
            }
        }
        else {
            this.setState({ [e.target.name]: e.target.value });
        }
    }

    onChange(e, key) {
        this.setState({ [key]: e.target.value });
    }

    //Apply Filter option
    applyFilter = () => {
        if ((this.state.FromDate !== '' && this.state.ToDate !== '') || this.state.WalletType !== '') {
            this.props.increaseTokenSupplyList({
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                WalletType: this.state.WalletType,
            });
            this.setState({ showApply: true });
        }
    }

    //clear filter
    clearFilter = () => {
        this.setState({ ...initState, menudetail: this.state.menudetail }, () => this.props.increaseTokenSupplyList({}));
    }

    /* check menu permission */
    checkAndGetFieldsAccessDetail(GUID) {
        var response = {};
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('7BED7B84-042E-6AD7-5967-A0E82FF83FB0'); //7BED7B84-042E-6AD7-5967-A0E82FF83FB0
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

        var menuDetail = this.checkAndGetFieldsAccessDetail('415D02C8-89C2-7AC4-6D89-3076CA9D9F92'); //415D02C8-89C2-7AC4-6D89-3076CA9D9F92
        const { errors } = this.state
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
                name: intl.formatMessage({ id: "table.Amount" }),
                options: {
                    filter: true,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "sidebar.user" }),
                options: {
                    filter: true,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "lable.TrnHash" }),
                options: {
                    filter: true,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "lable.ActionTypeName" }),
                options: {
                    filter: true,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "table.date" }),
                options: {
                    filter: true,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "table.address" }),
                options: {
                    filter: false,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "organizationLedger.title.remarks" }),
                options: {
                    filter: false,
                    sort: true
                }
            }
        ];

        const options = {
            filter: false,
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            download: false,
            viewColumns: false,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission,,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
        }

        return (
            <div className="jbs-page-content">
                {(this.props.menuLoading || this.props.loading) && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="lable.Increase" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="StackingHistory">
                    <JbsCollapsibleCard>
                        <h3>{<IntlMessages id="lable.addIncrease" />}</h3>
                        <div className="top-filter">
                            <Form className="tradefrm row">
                                {(menuDetail['2FE81A48-0906-9563-9CF9-9B9984DC60BC'] && menuDetail['2FE81A48-0906-9563-9CF9-9B9984DC60BC'].Visibility === "E925F86B") &&
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Amount"><IntlMessages id="table.amount" /><span className="text-danger">*</span></Label>
                                        <Input type="text" name="Amount" id="Amount" placeholder={intl.formatMessage({ id: "table.amount" })} value={this.state.Amount} onChange={(e) => this.onChangeHandler(e)} maxLength={10}
                                            disabled={(menuDetail['2FE81A48-0906-9563-9CF9-9B9984DC60BC'].AccessRight === "11E6E7B0") ? true : false}
                                        />
                                    </FormGroup>
                                }
                                {(menuDetail['14B80E5D-7209-A272-506B-D08BAC5344A8'] && menuDetail['14B80E5D-7209-A272-506B-D08BAC5344A8'].Visibility === "E925F86B") &&
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="WalletTypeID"><IntlMessages id="table.currency" /><span className="text-danger">*</span></Label>
                                        <Input type="select" name="WalletTypeID" id="WalletTypeID" value={this.state.WalletTypeID} onChange={(e) => this.onChangeHandler(e)}
                                            disabled={(menuDetail['14B80E5D-7209-A272-506B-D08BAC5344A8'].AccessRight === "11E6E7B0") ? true : false}
                                        >
                                            <option value="">{intl.formatMessage({ id: "wallet.errCurrency" })}</option>
                                            {this.props.walletType.length > 0 && this.props.walletType.map((type, index) => (
                                                <option key={index} value={type.ID}>{type.TypeName}</option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                }
                                {(menuDetail['14064573-9EC0-1ABB-0C53-2D746FF06077'] && menuDetail['14064573-9EC0-1ABB-0C53-2D746FF06077'].Visibility === "E925F86B") &&
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Remarks"><IntlMessages id="organizationLedger.title.remarks" /><span className="text-danger">*</span></Label>
                                        <Input type="text" name="Remarks" id="Remarks" placeholder={intl.formatMessage({ id: "organizationLedger.title.remarks" })} value={this.state.Remarks} onChange={(e) => { if (!validator.isEmpty(e.target.value + '', { ignore_whitespace: true })) { this.onChangeHandler(e) } }}
                                            disabled={(menuDetail['14064573-9EC0-1ABB-0C53-2D746FF06077'].AccessRight === "11E6E7B0") ? true : false}
                                        />
                                        {errors.Remarks && <span className="text-danger text-left"><IntlMessages id={errors.Remarks} /></span>}
                                    </FormGroup>
                                }

                                {Object.keys(menuDetail).length > 0 &&
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <div className="btn_area">
                                            <Button
                                                color="primary"
                                                variant="raised"
                                                className="text-white"
                                                onClick={() => this.setState({ showDialog: true, handle2faflag: true })}
                                                disabled={(this.state.WalletTypeID !== '' && this.state.Remarks !== '' && this.state.Amount && Object.keys(errors).length === 0) ? false : true}
                                            ><IntlMessages id="widgets.Submit" /></Button>
                                        </div>
                                    </FormGroup>}
                            </Form>
                        </div>
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
                    </JbsCollapsibleCard>
                    {menuPermissionDetail.Utility.indexOf('18736530') !== -1 &&
                        <JbsCollapsibleCard>
                            <div className="top-filter">
                                <Form className="tradefrm row">
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="FromDate"><IntlMessages id="widgets.startDate" /></Label>
                                        <Input type="date" name="FromDate" id="FromDate" placeholder="dd/mm/yyyy" value={this.state.FromDate} onChange={(e) => this.onChange(e, 'FromDate')} max={this.state.Today} />
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="ToDate"><IntlMessages id="widgets.endDate" /></Label>
                                        <Input type="date" name="ToDate" id="ToDate" placeholder="dd/mm/yyyy" value={this.state.ToDate} onChange={(e) => this.onChange(e, 'ToDate')} max={this.state.Today} />
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Select-1"><IntlMessages id="table.currency" /></Label>
                                        <Input type="select" name="walletType" id="walletType" value={this.state.WalletType} onChange={(e) => this.onChange(e, 'WalletType')}>
                                            <option value="">{intl.formatMessage({ id: "wallet.errCurrency" })}</option>
                                            {this.props.walletType.length > 0 &&
                                                this.props.walletType.map((type, index) => (
                                                    <option key={index} value={type.ID}>{type.TypeName}</option>
                                                ))}
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <div className="btn_area">
                                            <Button color="primary" variant="raised" className="text-white" onClick={() => this.applyFilter()} disabled={((this.state.FromDate !== '' && this.state.ToDate !== '') || this.state.WalletType !== '') ? false : true}><IntlMessages id="widgets.apply" /></Button>
                                            {this.state.showApply && <Button className="ml-15 btn-danger text-white" onClick={(e) => this.clearFilter()}><IntlMessages id="bugreport.list.dialog.button.clear" /></Button>}
                                        </div>
                                    </FormGroup>
                                </Form>
                            </div>
                        </JbsCollapsibleCard>
                    }
                    {this.props.loading && <JbsSectionLoader />}
                    <MUIDataTable
                        data={this.props.IncreaseList.filter(function (item) {
                            return item.ActionType === 1;
                        }).map((item, key) => {
                            return [
                                key + 1,
                                item.WalletTypeName,
                                item.Amount.toFixed(8),
                                item.ActionByUserName,
                                item.TrnHash,
                                item.ActionTypeName,
                                changeDateFormat(item.ActionDate, 'DD-MM-YYYY HH:mm:ss', false),
                                item.ContractAddress,
                                item.Remarks
                            ];
                        })}
                        columns={columns}
                        options={options}
                    />
                </div>
            </div>
        )
    }
}
const mapStateToProps = ({ IncreaseReducer, walletUsagePolicy, drawerclose, authTokenRdcer, dipositReportReducer }) => {
    // breadcrumb 
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { reconResponse, response2fa, errors, error2fa } = dipositReportReducer;
    const { IncreaseToken, IncreaseList, loading } = IncreaseReducer;
    const { walletType } = walletUsagePolicy;
    const { menuLoading, menu_rights } = authTokenRdcer;
    return { loading, walletType, drawerclose, menuLoading, menu_rights, IncreaseToken, reconResponse, response2fa, errors, error2fa, IncreaseList };
};

export default connect(mapStateToProps, {
    increaseTokenSupply,
    increaseTokenSupplyList,
    getWalletType,
    getMenuPermissionByID,
    verify2fa,
})(injectIntl(Increase));