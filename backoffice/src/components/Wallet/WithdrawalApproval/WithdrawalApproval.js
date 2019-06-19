/*
    Developer : Parth Andhariya
    Date : 04-06-2019
    File Comment :  Withdrawal Approval list
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import MUIDataTable from "mui-datatables";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import Button from "@material-ui/core/Button";
import { getListWithdrawalRequest, getAcceptRejectWithdrawalRequest } from "Actions/WithdrawalApprovalAction";
import { FormGroup, Label, Input, Row, Col, Form } from 'reactstrap';
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
import { changeDateFormat } from "Helpers/helpers";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import validator from "validator";
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
        title: <IntlMessages id="wallet.WithdrawalApproval" />,
        link: '',
        index: 1
    },
];
const initState = {
    TrnNo: "",
    FromDate: "",
    ToDate: "",
    Status: '',
    showReset: false,
    menudetail: [],
    notificationFlag: true,
    Today: new Date().toISOString().slice(0, 10),
    showDialog: false,
    code: "",
    CollectedRecord: {},
    handle2faflag: false,
    showdestroyDialog: false,
    AcceptRejectRemarks: "",
    action: null,
    AcceptRejectWithdeawalflag: false
}
function Transition(props) {
    return <Slide direction="up" {...props} />;
}
class WithdrawalApproval extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }
    closeAll = () => {
        this.props.closeAll();
        this.setState({ ...initState, menudetail: this.state.menudetail });
    };
    drawerClose = () => {
        this.props.drawerClose();
        this.setState({ ...initState, menudetail: this.state.menudetail });
    }
    componentWillMount() {
        // this.props.getListWithdrawalRequest({});
        this.props.getMenuPermissionByID('DB8CFB7D-81CA-7BE7-7A49-B945C496468C'); // get wallet menu permission
    }

    componentWillReceiveProps(nextProps) {

        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getListWithdrawalRequest({});
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }
        // success 2fa validattion
        if (nextProps.response2fa.hasOwnProperty("ErrorCode") && nextProps.response2fa.ErrorCode == 0 && this.state.handle2faflag) {
            this.props.getAcceptRejectWithdrawalRequest({
                AdminReqId: this.state.CollectedRecord.AdminReqId,
                Bit: this.state.action,
                Remarks: this.state.AcceptRejectRemarks
            })
            this.setState({ code: "", showDialog: false, handle2faflag: false, AcceptRejectWithdeawalflag: true, AcceptRejectRemarks: "" });
        }
        if (nextProps.AcceptRejectWithdeawal !== "" && this.state.AcceptRejectWithdeawalflag) {
            if (nextProps.AcceptRejectWithdeawal.hasOwnProperty("ReturnCode") && nextProps.AcceptRejectWithdeawal.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id={`apiWalletErrCode.${nextProps.AcceptRejectWithdeawal.ErrorCode}`} />);
                this.props.getListWithdrawalRequest({});
            } else if (nextProps.AcceptRejectWithdeawal.hasOwnProperty("ReturnCode") && nextProps.AcceptRejectWithdeawal.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.AcceptRejectWithdeawal.ErrorCode}`} />);
            }
            this.setState({ AcceptRejectWithdeawalflag: false })
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
        if (this.state.TrnNo !== "" || (this.state.FromDate !== "" && this.state.ToDate !== "") || this.state.Status !== "") {
            this.props.getListWithdrawalRequest({
                TrnNo: this.state.TrnNo,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                Status: this.state.Status,
            });
            this.setState({ showReset: true });
        }
    }
    //clear filter
    clearFilter = () => {
        this.setState({
            ...initState,
            menudetail: this.state.menudetail,
        });
        this.props.getListWithdrawalRequest({});
    }
    //change handler 
    onChangeHandler(e) {
        if (e.target.name === "TrnNo") {
            if (validator.isDecimal(e.target.value, {
                no_symbols: true,
                decimal_digits: '0,8'
            }) ||
                (validator.isNumeric(e.target.value, { no_symbols: true })) || e.target.value === ""
            ) {
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
            this.setState({

            })
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    //handle accept reject action 
    AcceptRejectHandler = (Data, action) => {
        this.setState({ showdestroyDialog: true, CollectedRecord: Data, action: action })
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('92965DED-7954-835A-682A-494339740670'); //92965DED-7954-835A-682A-494339740670
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const intl = this.props.intl;
        const { drawerClose } = this.props;
        const columns = [
            {
                name: intl.formatMessage({ id: "request.formet.RequestID" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "traderecon.list.column.label.trnno" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "sidebar.trnDate" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "table.amount" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "tradingLedger.filterLabel.trnNo" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "tradingLedger.filterLabel.userID" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "wallet.lblUserName" }),
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
                                "badge badge-danger": (value === 9),
                                "badge badge-success": (value === 1),
                                "badge badge-info": (value === 0),
                            })}
                        >
                            {this.props.intl.formatMessage({
                                id: "wallet.WithdrawalApproval." + value,
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
                name: intl.formatMessage({ id: "table.date" }),
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
        };
        return (
            <div className="jbs-page-content">
                {(this.props.menuLoading || this.props.loading) && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="wallet.WithdrawalApproval" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
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
                                            <option value="0">{intl.formatMessage({ id: "sidebar.pending" })}</option>
                                            <option value="1">{intl.formatMessage({ id: "button.accept" })}</option>
                                            <option value="9">{intl.formatMessage({ id: "sidebar.reject" })}</option>
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="TrnNo"> {intl.formatMessage({ id: "traderecon.list.column.label.trnno" })}</Label>
                                        <Input type="text" name="TrnNo" id="TrnNo" placeholder={intl.formatMessage({ id: "traderecon.list.column.label.trnno" })} value={this.state.TrnNo} onChange={(e) => this.onChangeHandler(e)} maxLength={50} />
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <div className="btn_area">
                                            <Button color="primary" variant="raised" className="text-white" onClick={() => this.applyFilter()} disabled={(this.state.TrnNo !== "" || (this.state.FromDate !== "" && this.state.ToDate !== "") || this.state.Status !== "") ? false : true}><IntlMessages id="widgets.apply" /></Button>
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
                    <MUIDataTable
                        data={this.props.WithdrawalRequest.map((item, key) => {
                            return [
                                item.AdminReqId,
                                item.TrnNo,
                                changeDateFormat(item.TrnDate, 'DD-MM-YYYY HH:mm:ss', false),
                                item.Amount,
                                item.Currency,
                                item.ActionByUserId,
                                item.ActionByUserName,
                                item.Status,
                                item.Remarks,
                                changeDateFormat(item.ActionDate, 'DD-MM-YYYY HH:mm:ss', false),
                                <div className="list-action">
                                    {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 &&
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.AcceptRejectHandler(item, 1)}
                                        >
                                            <i className="ti-check" />
                                        </a>
                                    }
                                    {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 &&
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.AcceptRejectHandler(item, 9)}
                                        >
                                            <i className="ti-close" />
                                        </a>
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
                                        <Button type="button" variant="raised" onClick={(e) => this.setState({ code: "", showDialog: false, AcceptRejectRemarks: "" })} className={classnames("btn-danger text-white")} > <IntlMessages id="button.cancel" /></Button>
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
                        <IntlMessages id="margintrading.doYouWantToProceed" />
                    </DialogTitle>&nbsp;
                   <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {this.props.loading && <JbsSectionLoader />}
                            <FormGroup className="mb-0">
                                <Label>
                                    <IntlMessages id="organizationLedger.title.remarks" /><span className="text-danger">*</span>
                                </Label>
                                <Input type="text" name="AcceptRejectRemarks" id="AcceptRejectRemarks" placeholder={intl.formatMessage({ id: "sidebar.tradeRecon.remarks.enter" })} value={this.state.AcceptRejectRemarks} onChange={(e) => this.onChangeHandler(e)}
                                />
                            </FormGroup>
                            <DialogActions>
                                <Button className="btn-primary text-white mr-10" onClick={() => this.setState({ showDialog: true, showdestroyDialog: false, handle2faflag: true })} autoFocus disabled={this.state.AcceptRejectRemarks === ""}>
                                    <IntlMessages id="button.yes" />
                                </Button>
                                <Button onClick={() => this.setState({ showdestroyDialog: false, AcceptRejectRemarks: "" })} className="btn-danger text-white">
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


const mapDispatchToProps = ({ authTokenRdcer, WithdrawalApproval, dipositReportReducer }) => {
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { loading, WithdrawalRequest, AcceptRejectWithdeawal } = WithdrawalApproval;
    const { reconResponse, response2fa, errors, error2fa } = dipositReportReducer;
    return { menuLoading, menu_rights, loading, WithdrawalRequest, AcceptRejectWithdeawal, reconResponse, response2fa, errors, error2fa };
};

export default connect(mapDispatchToProps, {
    getMenuPermissionByID,
    getListWithdrawalRequest,
    getAcceptRejectWithdrawalRequest,
    verify2fa,
})(injectIntl(WithdrawalApproval));
