/* 
    Developer : Vishva shah
    Date : 27-05-2019
    File Comment : token transfer Component
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
import { getTokenTransfer, getTokenTransferlist } from "Actions/ERC223";
import { getWalletType } from "Actions/WalletUsagePolicy";
import { NotificationManager } from 'react-notifications';
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';
import MUIDataTable from "mui-datatables";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import classnames from "classnames";
import Dialog from '@material-ui/core/Dialog';
import { verify2fa } from "Actions/Deposit";
import Slide from '@material-ui/core/Slide';
import validator from "validator";
import { isScriptTag, isHtmlTag, changeDateFormat } from 'Helpers/helpers';
const initState = {
    open: false,
    ToAddress: "",
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
    errors: {}
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
        title: <IntlMessages id="lable.TokenTransfer" />,
        link: '',
        index: 2
    },
];
function Transition(props) {
    return <Slide direction="up" {...props} />;
}
class TokenTransfer extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('9A157A6C-73F3-1EB5-3E67-B6E6302170F4'); // get wallet menu permission
    }
    // will receive props update state..
    componentWillReceiveProps(nextProps) {
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.flag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getWalletType({ Status: 1 });
                this.props.getTokenTransferlist({})
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ flag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        // success 2fa validattion
        if (nextProps.response2fa.hasOwnProperty("ErrorCode") && nextProps.response2fa.ErrorCode == 0 && this.state.handle2faflag) {
            if (this.state.WalletTypeID !== "" && this.state.Amount !== "" && this.state.Remarks !== "" && this.state.ToAddress !== "") {
                this.props.getTokenTransfer({
                    Amount: parseFloat(this.state.Amount),
                    FromWalletTypeID: parseFloat(this.state.WalletTypeID),
                    Remarks: this.state.Remarks,
                    ToAddress: this.state.ToAddress
                });
            }
            this.setState({ code: "", showDialog: false, handle2faflag: false, notificationFlag: true });
        }
        if (nextProps.tokenTransfer.hasOwnProperty("ReturnCode") && this.state.notificationFlag) {
            this.setState({ notificationFlag: false })
            if (nextProps.tokenTransfer.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.tokenTransfer.ErrorCode}`} />);
            }
            else if (nextProps.tokenTransfer.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id="token.tokenTransfer.success" />);
                let newObj = Object.assign({}, this.initState);
                newObj.menudetail = this.state.menudetail;
                this.setState(newObj);
            }
        }
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({
                open: false,
            })
        }
    }
    // close all drawer...
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            pagedata: {}
        });
    };
    // apply filter 
    submit() {
        this.setState({
            showDialog: true,
            handle2faflag: true
        })
    }
    /* handle confirmation of 2fa */
    handleConfirmation() {
        if (this.state.code !== '') {
            this.props.verify2fa({
                'Code': this.state.code,
            });
        }
    }
    // onchange filter options
    onChangeHandler(e) {
        let error = Object.keys(this.state.errors).length !== 0 ? this.state.errors : {}
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
                    this.setState({
                    errors: {
                        Remarks: '',
                        ToAddress: this.state.errors.ToAddress
                    }
                })
            }

        }

        else if (e.target.name === "ToAddress") {
            if (isScriptTag(e.target.value)) {
                error.ToAddress = "my_account.err.scriptTag";
                this.setState({ errors: error })
            }
            else if (isHtmlTag(e.target.value)) {
                error.ToAddress = "my_account.err.htmlTag";
                this.setState({ errors: error })
            }
            else {
                setTimeout(() => {
                    this.setState({
                        errors: {
                            Remarks: this.state.errors.Remarks,
                            ToAddress: ''
                        }
                    })
                }, 100)
            }
        }
        if (e.target.name === "Amount") {
            if (validator.isNumeric(e.target.value, { no_symbols: true }) || e.target.value === '') {
                this.setState({ [e.target.name]: e.target.value });
            }
        } else {
            this.setState({ [e.target.name]: e.target.value });
        }
    }
    onChange(e, key) {
        this.setState({ [key]: e.target.value });
    }
    //Apply Filter option
    applyFilter = () => {
        if (this.state.FromDate !== '' && this.state.ToDate !== '') {
            this.props.getTokenTransferlist({
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            });
            this.setState({ showApply: true });
        }
    }
    //clear filter
    clearFilter = () => {
        this.setState({ ...initState, menudetail: this.state.menudetail }, () => this.props.getTokenTransferlist({}));
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('9FEF09A6-7939-8D08-1A32-7610AFB07F33'); //9FEF09A6-7939-8D08-1A32-7610AFB07F33
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        /* check menu permission */
        var menuDetail = this.checkAndGetFieldsAccessDetail('2E25902C-8176-2C6D-4D0D-BABAAE599046'); //2E25902C-8176-2C6D-4D0D-BABAAE599046
        const { drawerClose, intl } = this.props;
        const { errors } = this.state;
        const columns = [
            {
                name: intl.formatMessage({ id: "wallet.lblSr" }),
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
                name: intl.formatMessage({ id: "table.FromAddress" }),
                options: {
                    filter: true,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "table.ToAddress" }),
                options: {
                    filter: true,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "organizationLedger.title.Amount" }),
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
                name: intl.formatMessage({ id: "table.date" }),
                options: {
                    filter: true,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "organizationLedger.title.remarks" }),
                options: {
                    filter: true,
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
                <WalletPageTitle title={<IntlMessages id="lable.TokenTransfer" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="StackingHistory">
                    <JbsCollapsibleCard>
                        <h3>{<IntlMessages id="lable.addTokenTransfer" />}</h3>
                        <div className="top-filter">
                            <Form className="tradefrm row">
                                {(menuDetail['23C8BF0B-3F02-1DFE-1E0D-48212622A240'] && menuDetail['23C8BF0B-3F02-1DFE-1E0D-48212622A240'].Visibility === "E925F86B") &&
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Amount"><IntlMessages id="table.amount" /><span className="text-danger">*</span></Label>
                                        <Input type="text" name="Amount" id="Amount" placeholder={intl.formatMessage({ id: "table.amount" })} value={this.state.Amount} onChange={(e) => this.onChangeHandler(e)}
                                            disabled={(menuDetail['23C8BF0B-3F02-1DFE-1E0D-48212622A240'].AccessRight === "11E6E7B0") ? true : false}
                                        />
                                    </FormGroup>
                                }
                                {(menuDetail['CDC784BE-7CC9-A230-4B47-7463F1F54789'] && menuDetail['CDC784BE-7CC9-A230-4B47-7463F1F54789'].Visibility === "E925F86B") &&
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="WalletTypeID"><IntlMessages id="table.currency" /><span className="text-danger">*</span></Label>
                                        <Input type="select" name="WalletTypeID" id="WalletTypeID" value={this.state.WalletTypeID} onChange={(e) => this.onChangeHandler(e)}
                                            disabled={(menuDetail['CDC784BE-7CC9-A230-4B47-7463F1F54789'].AccessRight === "11E6E7B0") ? true : false}
                                        >
                                            <option value="">{intl.formatMessage({ id: "wallet.errCurrency" })}</option>
                                            {this.props.walletType.length > 0 && this.props.walletType.map((type, index) => (
                                                <option key={index} value={type.ID}>{type.TypeName}</option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                }
                                {(menuDetail['087E939A-3040-2A0F-9B4C-40BBDFF48B2E'] && menuDetail['087E939A-3040-2A0F-9B4C-40BBDFF48B2E'].Visibility === "E925F86B") &&
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Remarks"><IntlMessages id="organizationLedger.title.remarks" /><span className="text-danger">*</span></Label>
                                        <Input type="text" name="Remarks" id="Remarks" placeholder={intl.formatMessage({ id: "organizationLedger.title.remarks" })} value={this.state.Remarks} onChange={(e) => { if (!validator.isEmpty(e.target.value + '', { ignore_whitespace: true })) { this.onChangeHandler(e) } }}
                                            disabled={(menuDetail['087E939A-3040-2A0F-9B4C-40BBDFF48B2E'].AccessRight === "11E6E7B0") ? true : false}
                                        />
                                        {errors.Remarks && <span className="text-danger text-left"><IntlMessages id={errors.Remarks} /></span>}
                                    </FormGroup>
                                }
                                {(menuDetail['F170BD97-60FA-8091-4B5D-C0447D043D86'] && menuDetail['F170BD97-60FA-8091-4B5D-C0447D043D86'].Visibility === "E925F86B") &&
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="ToAddress"><IntlMessages id="table.toAddress" /><span className="text-danger">*</span></Label>
                                        <Input type="text" name="ToAddress" id="ToAddress" placeholder={intl.formatMessage({ id: "table.toAddress" })} value={this.state.ToAddress} onChange={(e) => { if (validator.isAlphanumeric(e.target.value) || e.target.value === "") { this.onChangeHandler(e) } }} maxLength={50}
                                            disabled={(menuDetail['F170BD97-60FA-8091-4B5D-C0447D043D86'].AccessRight === "11E6E7B0") ? true : false}
                                        />
                                        {errors.ToAddress && <span className="text-danger text-left"><IntlMessages id={errors.ToAddress} /></span>}
                                    </FormGroup>
                                }
                                {Object.keys(menuDetail).length > 0 && <FormGroup className="col-md-2 col-sm-4">
                                    <div className="btn_area">
                                        <Button
                                            color="primary"
                                            variant="raised"
                                            className="text-white"
                                            onClick={() => this.submit()}
                                            disabled={(this.state.WalletTypeID !== '' && this.state.Remarks !== '' && this.state.Amount && this.state.ToAddress !== '' && Object.keys(errors).length === 0) ? false : true}
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
                        data={this.props.tokenTransferList.map((item, key) => {
                            return [
                                key + 1,
                                item.ActionByUserName,
                                item.FromAddress,
                                item.ToAddress,
                                item.Amount.toFixed(8),
                                item.TrnHash,
                                changeDateFormat(item.ActionDate, 'DD-MM-YYYY HH:mm:ss', false),
                                item.Remarks,
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

const mapStateToProps = ({ TokenTransferReducer, walletUsagePolicy, drawerclose, authTokenRdcer, dipositReportReducer }) => {
    // breadcrumb 
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { reconResponse, response2fa, errors, error2fa } = dipositReportReducer;
    const { tokenTransfer, tokenTransferList, loading } = TokenTransferReducer;
    const { walletType } = walletUsagePolicy;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { loading, walletType, drawerclose, menuLoading, menu_rights, tokenTransfer, reconResponse, response2fa, errors, error2fa, tokenTransferList };
};

export default connect(mapStateToProps, {
    getTokenTransfer,
    getWalletType,
    getMenuPermissionByID,
    verify2fa,
    getTokenTransferlist
})(injectIntl(TokenTransfer));
