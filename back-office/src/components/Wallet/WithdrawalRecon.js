/* 
    Developer : Parth Andhariya
    Date : 26-03-2019
    File Comment : Withdrawal Recon process component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import Button from "@material-ui/core/Button";
import { FormGroup, Form, Label, Input, Alert } from 'reactstrap';
import { changeDateFormat } from "Helpers/helpers";
import { injectIntl } from 'react-intl';
import Switch from 'react-toggle-switch';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { NotificationManager } from "react-notifications";
import { doWithdeawalReconProcess } from "Actions/Withdrawal";
import { verify2fa } from "Actions/Deposit";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import classnames from "classnames";
import { Table } from 'reactstrap';
import { isScriptTag } from 'Helpers/helpers';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//handle dialog
function Transition(props) {
    return <Slide direction="up" {...props} />;
}
//action type of switch
const ACTION_TYPES = [
    { id: 1, label: "lable.reconActivity.1" },
    { id: 2, label: "lable.reconActivity.2" },
    { id: 4, label: "lable.reconActivity.4" },
    { id: 5, label: "lable.reconActivity.5" },
]
//initial state
const initState = {
    actionType: 0,
    showError: false,
    showSuccess: false,
    responseMessage: "",
    showReset: false,
    remarks: "",
    TrnID: "",
    showDialog: false,
    code: "",
    NotificationFlag: false,
    flag2fa: false,
    errors: "",
    menudetail: [],
    notification: true,
};
const Size = {
    height: "300px"
};
const transtyle = {
    height: "70px"
}
const remarkstyle = {
    height: "200px"
}

class WithdrawalRecon extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }
    closeAll = () => {
        this.props.closeAll();
    };
    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.menuDetail ? '5A06A906-7713-4F55-8689-AB687A1561F7' : '724FE907-A05F-4B97-2F34-174E92073563'); // get wallet menu permission
    }
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notification: false });
        }
        if (nextProps.reconResponse.hasOwnProperty("ReturnCode") && this.state.NotificationFlag
        ) {
            if (nextProps.reconResponse.ReturnCode === 1) {
                NotificationManager.error(<IntlMessages id={"apiWalletErrCode." + nextProps.reconResponse.ErrorCode} />);
            } else if (nextProps.reconResponse.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id="wallet.reconSuccess" />);
                this.setState(initState);
                this.props.drawerClose();
                this.props.applyFilter();
            }
        }
        // success 2fa validattion
        if (nextProps.response2fa.hasOwnProperty("ErrorCode") && this.state.flag2fa) {
            if (nextProps.response2fa.ErrorCode == 0) {
                this.props.doWithdeawalReconProcess({
                    ActionType: this.state.actionType,
                    ActionMessage: this.state.remarks,
                    TrnNo: this.props.selectedRows[0].TrnNo,
                    TrnID: this.state.TrnID
                });
                this.setState({ NotificationFlag: true, showDialog: false, code: "", flag2fa: false });
            }
        }
    }
    /* handle cancel */
    handleCancel() {
        this.props.drawerClose();
        this.setState(initState);
    }
    /* change action type switch */
    onChangeOperationSwitch(key) {
        this.setState({ actionType: key });
    }
    /* handle Recon process */
    handleSubmit() {
        if (isScriptTag(this.state.remarks)) {
            this.setState({ errors: "my_account.err.scriptTag" });
        } else {
            if (this.props.selectedRows.length !== 0
                && this.state.actionType !== ""
                && this.state.remarks !== ""
            ) {
                this.setState({ showDialog: true, errors: "" });
            }
        }
    }
    /* handle confirmation */
    handleConfirmation() {
        if (this.state.code !== '') {
            this.setState({
                flag2fa: true
            }, () => this.props.verify2fa({
                'Code': this.state.code,
            }));
        }
    }
    /* check menu permission */
    checkAndGetMenuAccessDetail(GUID) {
        var response = {};
        var index;
        const { menudetail } = this.state;
        if (menudetail.length) {
            for (index in menudetail) {
                if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase()) {
                    if (menudetail[index].Fields && menudetail[index].Fields.length) {
                        var fieldList = {};
                        menudetail[index].Fields.forEach(function (item) {
                            fieldList[item.GUID] = item;
                        });
                        response = fieldList;
                    }
                }
            }
        } 
            return response;
    }
    render() {
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
                title: <IntlMessages id="walletDashboard.WithdrawalReport" />,
                link: '',
                index: 1
            },
            {
                title: <IntlMessages id="lable.withdrawalRecon" />,
                link: '',
                index: 2
            },
        ];
        const intl = this.props.intl;
        const depositTrnList = this.props.selectedRows;
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="lable.withdrawalRecon" />} breadCrumbData={BreadCrumbData} drawerClose={(e) => this.handleCancel()} closeAll={this.closeAll} />
                {this.props.loading && <JbsSectionLoader />}
                <div className="row">
                    <div className="col-sm-6">
                        <Table bordered responsive className="mb-0">
                            <tbody>
                                <tr>
                                    <th className="w-50">{<IntlMessages id="table.trnNo" />}</th>
                                    <td className="w-50">{depositTrnList[0].TrnNo}</td>
                                </tr>
                                {depositTrnList[0].hasOwnProperty('ExplorerLink') &&
                                    <tr>
                                        <th className="w-50">{<IntlMessages id="lable.trnId" />}</th>
                                        <td className="w-50">{<a href={(JSON.parse(depositTrnList[0].ExplorerLink).length) ? JSON.parse(depositTrnList[0].ExplorerLink)[0].Data + '/' + depositTrnList[0].TrnID : depositTrnList[0].TrnID} target="_blank">{depositTrnList[0].TrnID}</a>}</td>
                                    </tr>}
                                <tr>
                                    <th className="w-50">{<IntlMessages id="table.currency" />}</th>
                                    <td className="w-50">{depositTrnList[0].CoinName}</td>
                                </tr>
                                <tr>
                                    <th className="w-50">{<IntlMessages id="sidebar.ProviderName" />}</th>
                                    <td className="w-50">{depositTrnList[0].ProviderName}</td>
                                </tr>
                                <tr>
                                    <th className="w-50">{<IntlMessages id="table.FromAddress" />}</th>
                                    <td className="w-50">{depositTrnList[0].FromAddress}</td>
                                </tr>
                                <tr>
                                    <th className="w-50">{<IntlMessages id="table.ToAddress" />}</th>
                                    <td className="w-50">{depositTrnList[0].ToAddress}</td>
                                </tr>

                            </tbody>
                        </Table>
                    </div>
                    <div className="col-sm-6">
                        <Table bordered responsive className="mb-0">
                            <tbody>
                                <tr>
                                    <th className="w-50">{<IntlMessages id="table.UserName" />}</th>
                                    <td className="w-50">{depositTrnList[0].UserName}</td>
                                </tr>
                                <tr>
                                    <th className="w-50">{<IntlMessages id="table.OrgName" />}</th>
                                    <td className="w-50">{depositTrnList[0].OrganizationName}</td>
                                </tr>
                                <tr>
                                    <th className="w-50">{<IntlMessages id="table.Amount" />}</th>
                                    <td className="w-50">{depositTrnList[0].Amount.toFixed(8)}</td>
                                </tr>
                                <tr>
                                    <th className="w-50">{<IntlMessages id="table.Status" />}</th>
                                    <td className="w-50">
                                        <span className={classnames({
                                            "badge badge-danger": (depositTrnList[0].Status === 2 || depositTrnList[0].Status === 3),
                                            "badge badge-success": (depositTrnList[0].Status === 1),
                                            "badge badge-warning": (depositTrnList[0].Status === 6),
                                            "badge badge-info": (depositTrnList[0].Status === 5 || depositTrnList[0].Status === 999 || depositTrnList[0].Status === 4),

                                        })} >
                                            <IntlMessages id={"wallet.withdrawalReport." + depositTrnList[0].Status} />
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <th className="w-50">{<IntlMessages id="table.date" />}</th>
                                    <td className="w-50">{changeDateFormat(depositTrnList[0].Date, 'YYYY-MM-DD HH:mm:ss', false)}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div className="pt-25 px-10">
                    <Alert
                        color="danger"
                        isOpen={this.state.showError}
                        toggle={e => this.setState({ showError: false })}
                    >
                        {this.state.responseMessage}
                    </Alert>
                    <Alert
                        color="success"
                        isOpen={this.state.showSuccess}
                        toggle={e => this.setState({ showSuccess: false })}
                    >
                        {this.state.responseMessage}
                    </Alert>
                </div>
                <div className="recon-process row pb-25 px-10">
                    <div className="col-sm-12 my-20">
                        <h2><IntlMessages id="wallet.actionTitle" /></h2>
                    </div>
                    <div className="col-sm-6">
                        {ACTION_TYPES.map((obj, key) => (
                            <FormGroup key={key} className="col-sm-12 d-flex">
                                <Label className="w-40">
                                    <h2 className="text-primary"><IntlMessages id={obj.label} /></h2>
                                </Label>
                                <Switch
                                    onClick={(e) => this.onChangeOperationSwitch(obj.id)}
                                    on={(this.state.actionType === obj.id) ? true : false} />
                            </FormGroup>
                        ))}
                    </div>

                    <div className="col-sm-6" style={Size} >
                        {((this.state.actionType === 4 || this.state.actionType === 2) && (depositTrnList[0].TrnID === "Not Available" || depositTrnList[0].TrnID === ""))
                            && <FormGroup className="col-sm-12" style={transtyle}>
                                <Input
                                    type="text"

                                    placeholder={intl.formatMessage({ id: "lable.trnId" })}
                                    value={this.state.TrnID}
                                    onChange={(e) => this.setState({ TrnID: e.target.value })}
                                />
                            </FormGroup>}
                        <FormGroup className="col-sm-12" style={remarkstyle}>
                            <Input
                                type="textarea"
                                placeholder={intl.formatMessage({ id: "wallet.lblRemarks" })}
                                value={this.state.remarks}
                                onChange={(e) => this.setState({ remarks: e.target.value })}
                            />
                            {this.state.errors && (
                                <FormGroup className="d-flex mb-0">
                                    <Label>
                                        <span className="text-danger">
                                            <IntlMessages id={this.state.errors} />
                                        </span>
                                    </Label>
                                </FormGroup>
                            )}
                        </FormGroup>
                    </div>
                    <div className="col-sm-12 my-20">
                        <span className="text-danger"><IntlMessages id="wallet.reconHint" /></span>
                    </div>
                    <div className="col-sm-12 my-20 d-flex justify-content-center">
                        <Button
                            variant="raised"
                            className="btn-primary text-white mr-10"
                            disabled={this.state.actionType !== 0 && this.state.remarks !== '' ? false : true}
                            onClick={(e) => this.handleSubmit()}
                        >
                            <IntlMessages id="wallet.btnReconcileNow" />
                        </Button>{" "}
                        <Button
                            variant="raised"
                            className="btn-danger text-white"
                            onClick={(e) => this.handleCancel()}
                        >
                            <IntlMessages id="button.cancel" />
                        </Button>
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
                                <IntlMessages id="wallet.2FATitle" />
                            </div>
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                {this.props.response2fa.loading && <JbsSectionLoader />}
                                <Form onSubmit={(e) => { e.preventDefault() }}>
                                    <FormGroup className="mb-0">
                                        <Label for="Code"><IntlMessages id="wallet.2FAHint1" />{' "'}<IntlMessages id={"lable.reconActivity." + this.state.actionType} />{'" '}<IntlMessages id="wallet.2FAHint2" /></Label>
                                        <Input type="text" name="Code" id="Code" maxLength="6" autoComplete="off" value={this.state.code} onChange={(e) => (this.setState({ code: e.target.value }))} placeholder={intl.formatMessage({ id: "wallet.2FAPlaceholder" })} />
                                        {this.props.error2fa.hasOwnProperty("ErrorCode") && <span className="text-danger"><IntlMessages id={`apiErrCode.${this.props.error2fa.ErrorCode}`} /></span>}
                                    </FormGroup>
                                    <div className="mt-20 justify-content-between d-flex">
                                        <Button type="button" variant="raised" onClick={(e) => this.setState({ code: "", showDialog: false })} className={classnames("btn-danger text-white")} > <IntlMessages id="button.cancel" /></Button>
                                        <Button type="submit" variant="raised" onClick={(e) => this.handleConfirmation()} className={classnames("btn-success text-white")}> <IntlMessages id="sidebar.apiConfAddGen.button.confirm" /></Button>
                                    </div>
                                </Form>
                            </DialogContentText>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = ({ withdrawalReportReducer, dipositReportReducer, authTokenRdcer }) => {
    const { loading, reconResponse, errors } = withdrawalReportReducer;
    const { response2fa, error2fa } = dipositReportReducer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { loading, reconResponse, errors, response2fa, error2fa, menuLoading, menu_rights };
};

export default connect(mapDispatchToProps, {
    doWithdeawalReconProcess,
    verify2fa,
    getMenuPermissionByID
})(injectIntl(WithdrawalRecon));