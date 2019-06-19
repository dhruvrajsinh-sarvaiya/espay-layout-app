/* 
    Developer : Vishva shah
    Date : 27-05-2019
    File Comment : decrease token supply Component
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
import Slide from '@material-ui/core/Slide';
import MUIDataTable from "mui-datatables";
import {
    decreaseTokenSupply,decreaseTokenSupplyList
} from "Actions/ERC223";
import {
    getWalletType
} from "Actions/WalletUsagePolicy";
import { NotificationManager } from 'react-notifications';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import validator from "validator";
import { isScriptTag,isHtmlTag,changeDateFormat } from 'Helpers/helpers';
function Transition(props) {
    return <Slide direction="up" {...props} />;
}
const initState = {
    open: false,
    WalletTypeID: '',
    Remarks: "",
    Amount: '',
    showReset: false,
    menudetail: [],
    flag: true,
    notificationFlag: false,
    handle2faflag: true,
    showDialog: false,
    code: "",
    FromDate: new Date().toISOString().slice(0, 10),
    ToDate: new Date().toISOString().slice(0, 10),
    Today: new Date().toISOString().slice(0, 10),
    showApply: false,
    WalletType: "",
    ActionType: "",
    errors:{}
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
        title: <IntlMessages id="lable.Decrease" />,
        link: '',
        index: 2
    },
];

class DecreaseTokenSupply extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('15D82444-7816-9EC9-1A0B-320BC6742CC8'); // get wallet menu permission
    }
    // will receive props update state..
    componentWillReceiveProps(nextProps) {
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.flag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getWalletType({ Status: 1 });
                this.props.decreaseTokenSupplyList({})
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ flag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        // success 2fa validattion
        if (nextProps.response2fa.hasOwnProperty("ErrorCode") && nextProps.response2fa.ErrorCode == 0 && this.state.handle2faflag) {
            // var Status;
            if (this.state.WalletTypeID !== "" && this.state.Amount !== "" && this.state.Remarks !== "") {
                this.props.decreaseTokenSupply({
                    Amount: parseFloat(this.state.Amount),
                    WalletTypeId: parseFloat(this.state.WalletTypeID),
                    Remarks: this.state.Remarks
                });
            }
            this.setState({ code: "", showDialog: false, handle2faflag: false, notificationFlag: true });
        }
        if (nextProps.Decrease.hasOwnProperty("ReturnCode") && this.state.notificationFlag) {
            this.setState({ notificationFlag: false })
            if (nextProps.Decrease.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.Decrease.ErrorCode}`} />);
            }
            else if (nextProps.Decrease.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id="token.decrease.success" />);
                this.props.decreaseTokenSupplyList({})
                this.setState({ ...initState, menudetail: this.state.menudetail })
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
       // numberic value only
       validateOnlyNumeric(value) {
        const regexNumeric = /^[0-9.]+$/;
        if (
            regexNumeric.test(value) &&
            validator.isDecimal(value, {
                force_decimal: false,
                decimal_digits: "0,8"
            })
        ) {
            return true;
        } else {
            return false;
        }
    }
    // onchange filter options
    onChangeHandler(e) {
        let error = {};
        if (e.target.name === "Remarks") {
            if (isScriptTag(e.target.value)) {
                error.Remarks = "my_account.err.scriptTag";

            }
            else if (isHtmlTag(e.target.value)) {
                error.Remarks = "my_account.err.htmlTag";
            }
            else {
                this.setState({errors:{}})
            }
            this.setState({ errors: error})
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
            this.props.decreaseTokenSupplyList({
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                WalletType:this.state.WalletType,
            });
            this.setState({ showApply: true });
        }
    }
    //clear filter
    clearFilter = () => {
        this.setState({...initState,menudetail:this.state.menudetail},() =>this.props.decreaseTokenSupplyList({}));
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
                        return response = fieldList;
                    }
                }
            }
        } else {
            return response;
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('97212A01-0659-6349-0031-A840E52A7BC8'); //97212A01-0659-6349-0031-A840E52A7BC8
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const {errors}= this.state
        /* check menu permission */
        var menuDetail = this.checkAndGetFieldsAccessDetail('E51D65FE-28F0-85C6-8668-9C8F93766D79'); //415D02C8-89C2-7AC4-6D89-3076CA9D9F92
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
                    filter: false,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "table.Amount" }),
                options: {
                    filter: false,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "sidebar.user" }),
                options: {
                    filter: false,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "lable.TrnHash" }),
                options: {
                    filter: false,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "lable.ActionTypeName" }),
                options: {
                    filter: false,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "table.date" }),
                options: {
                    filter: false,
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
            filter:false,
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            download: false,
            viewColumns: false,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission,
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
                <WalletPageTitle title={<IntlMessages id="lable.Decrease" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="StackingHistory">
                <JbsCollapsibleCard>
                    <h3>{<IntlMessages id="lable.addDecrease" />}</h3>
                        <div className="top-filter">
                            <Form className="tradefrm row">
                                {(menuDetail['4BFB9891-804E-988F-92EF-D435F8B4704E'] && menuDetail['4BFB9891-804E-988F-92EF-D435F8B4704E'].Visibility === "E925F86B") &&
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Amount"><IntlMessages id="table.amount" /><span className="text-danger">*</span></Label>
                                        <Input type="text" name="Amount" id="Amount" placeholder={intl.formatMessage({ id: "table.amount" })} value={this.state.Amount} onChange={(e) => this.onChangeHandler(e)}
                                            disabled={(menuDetail['4BFB9891-804E-988F-92EF-D435F8B4704E'].AccessRight === "11E6E7B0") ? true : false}
                                        />
                                    </FormGroup>
                                }
                                {(menuDetail['B7DF787F-7CBF-088C-3CCB-4E95D04C095B'] && menuDetail['B7DF787F-7CBF-088C-3CCB-4E95D04C095B'].Visibility === "E925F86B") &&
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="WalletTypeID"><IntlMessages id="table.currency" /><span className="text-danger">*</span></Label>
                                        <Input type="select" name="WalletTypeID" id="WalletTypeID" value={this.state.WalletTypeID} onChange={(e) => this.onChangeHandler(e)}
                                            disabled={(menuDetail['B7DF787F-7CBF-088C-3CCB-4E95D04C095B'].AccessRight === "11E6E7B0") ? true : false}
                                        >
                                            <option value="">{intl.formatMessage({ id: "wallet.errCurrency" })}</option>
                                            {this.props.walletType.length && this.props.walletType.map((type, index) => (
                                                <option key={index} value={type.ID}>{type.TypeName}</option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                }
                                {(menuDetail['8ED5D2FC-4B9E-2C80-2987-3EAB68306E64'] && menuDetail['8ED5D2FC-4B9E-2C80-2987-3EAB68306E64'].Visibility === "E925F86B") &&
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Remarks"><IntlMessages id="organizationLedger.title.remarks" /><span className="text-danger">*</span></Label>
                                        <Input type="text" name="Remarks" id="Remarks" placeholder={intl.formatMessage({ id: "organizationLedger.title.remarks" })} value={this.state.Remarks} onChange={(e) => {if (!validator.isEmpty(e.target.value+'',{ ignore_whitespace: true })){ this.onChangeHandler(e)}}}
                                            disabled={(menuDetail['8ED5D2FC-4B9E-2C80-2987-3EAB68306E64'].AccessRight === "11E6E7B0") ? true : false}
                                           
                                    />
                                     {errors.Remarks && <span className="text-danger text-left"><IntlMessages id={errors.Remarks} /></span>}    
                                    </FormGroup>
                                }
                                {menuDetail && <FormGroup className="col-md-2 col-sm-4">
                                    <div className="btn_area">
                                        <Button
                                            color="primary"
                                            variant="raised"
                                            className="text-white"
                                            onClick={() => this.submit()}
                                            disabled={(this.state.WalletTypeID !== '' && this.state.Remarks !== '' && this.state.Amount && Object.keys(errors).length===0) ? false : true}
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
                                            {this.props.walletType.length &&
                                                this.props.walletType.map((type, index) => (
                                                    <option key={index} value={type.ID}>{type.TypeName}</option>
                                                ))}
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <div className="btn_area">
                                            <Button color="primary" variant="raised" className="text-white" onClick={() => this.applyFilter()} disabled={((this.state.FromDate !== '' && this.state.ToDate !== '') || this.state.WalletType !== '')  ? false : true}><IntlMessages id="widgets.apply" /></Button>
                                            {this.state.showApply && <Button className="ml-15 btn-danger text-white" onClick={(e) => this.clearFilter()}><IntlMessages id="bugreport.list.dialog.button.clear" /></Button>}
                                        </div>
                                    </FormGroup>
                                </Form>
                            </div>
                        </JbsCollapsibleCard>
                    }
                    {this.props.loading && <JbsSectionLoader />}
                    <MUIDataTable
                        data={this.props.DecreaseList.filter(function (item) {
                            return item.ActionType === 2;
                        }).map((item, key) => {
                            return [
                                key + 1,
                                item.WalletTypeName,
                                item.Amount.toFixed(8),
                                item.ActionByUserName,
                                item.TrnHash,
                                item.ActionTypeName,
                                changeDateFormat(item.ActionDate,'DD-MM-YYYY HH:mm:ss', false),
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

const mapStateToProps = ({ DecreaseReducer, walletUsagePolicy, drawerclose, authTokenRdcer, dipositReportReducer }) => {
    // breadcrumb 
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { reconResponse, response2fa, errors, error2fa } = dipositReportReducer;
    const { Decrease, DecreaseList,loading } = DecreaseReducer;
    const { walletType } = walletUsagePolicy;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { loading, walletType, drawerclose, menuLoading, menu_rights, Decrease, reconResponse, response2fa, errors, error2fa ,DecreaseList};
};

export default connect(mapStateToProps, {
    decreaseTokenSupply,
    getWalletType,
    getMenuPermissionByID,
    verify2fa,
    decreaseTokenSupplyList
})(injectIntl(DecreaseTokenSupply));
