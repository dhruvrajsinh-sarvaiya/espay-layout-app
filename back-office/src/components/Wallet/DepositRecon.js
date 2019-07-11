/* 
    Developer : Nishant Vadgama
    Date : 18-03-2019
    File Comment : Deposit Recon process component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import MUIDataTable from "mui-datatables";
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import Button from "@material-ui/core/Button";
import { FormGroup, Form, Label, Input } from 'reactstrap';
import { changeDateFormat } from "Helpers/helpers";
import { injectIntl } from 'react-intl';
import Switch from 'react-toggle-switch';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { NotificationManager } from "react-notifications";
import { doReconProcess, verify2fa } from "Actions/Deposit";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import classnames from "classnames";
//added by parth andhariya
import AppConfig from 'Constants/AppConfig';
import { isScriptTag } from 'Helpers/helpers';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
function Transition(props) {
    return <Slide direction="up" {...props} />;
}
const ACTION_TYPES = [
    { id: 1, label: "wallet.reconActivity.1" },
    { id: 9, label: "wallet.reconActivity.9" },
]
const initState = {
    actionType: 0,
    showError: false,
    showSuccess: false,
    responseMessage: "",
    showReset: false,
    remarks: "",
    showDialog: false,
    code: "",
    NotificationFlag: false,
    errors: "",
    menudetail: [],
    notification: true,
};

class DepositRecon extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }
    closeAll = () => {
        this.props.closeAll();
    };
    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.menuDetail ? 'BCE3AAB7-7CE8-2B91-8AD5-D577E95C23F1' : '8D72DE0C-0139-7CC7-693F-DF42944B08A7'); // get wallet menu permission
    }
    componentWillReceiveProps(nextProps) {
        const intl = this.props.intl;
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notification: false });
        }
        if (nextProps.reconResponse.hasOwnProperty("ReturnCode") && this.state.NotificationFlag) {
            this.setState({ NotificationFlag: false });
            if (nextProps.reconResponse.ReturnCode === 1) {
                NotificationManager.error(intl.formatMessage({ id: "apiWalletErrCode." + nextProps.reconResponse.ErrorCode }));
            } else if (nextProps.reconResponse.ReturnCode === 0) {
                if (nextProps.reconResponse.ResponseList.length) {
                    nextProps.reconResponse.ResponseList.map((obj, key) => {
                        if (obj.ReturnCode === 0) {
                            //success
                            NotificationManager.success(intl.formatMessage({ id: "wallet.reconSuccess" }), intl.formatMessage({ id: "sidebar.colTrnNo" }) + ' : ' + obj.TrnNo);
                        } else {
                            //failied
                            NotificationManager.error(intl.formatMessage({ id: "apiWalletErrCode." + obj.ErrorCode }), intl.formatMessage({ id: "sidebar.colTrnNo" }) + ' : ' + obj.TrnNo);
                        }
                    });
                }
                setTimeout(function () {
                    this.setState(initState);
                    this.props.drawerClose();
                    this.props.applyFilter();
                }.bind(this), 3000);
            }
        }
        // success 2fa validattion
        if (nextProps.response2fa.hasOwnProperty("ErrorCode") && nextProps.response2fa.ErrorCode == 0) {
            var result = this.groupBy(this.props.selectedRows, "TrnNo");
            const request = {
                "TrnNo": result,
                "ActionType": this.state.actionType,
                "ActionRemarks": this.state.remarks
            }
            this.props.doReconProcess(request);
            this.setState({ code: "", showDialog: false });
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
                && this.state.remarks !== "") {
                this.setState({ showDialog: true, NotificationFlag: true, errors: "" });
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
    /* grp by filter */
    groupBy(objectArray, property) {
        var result = [];
        objectArray.map((obj, index) => {
            if (result.indexOf(obj[property]) === -1) {
                result.push(obj[property])
            }
        });
        return result;
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
                title: <IntlMessages id="walletDashboard.DepositReport" />,
                link: '',
                index: 1
            },
            {
                title: <IntlMessages id="wallet.depositRecon" />,
                link: '',
                index: 2
            },
        ];
        const intl = this.props.intl;
        const depositTrnList = this.props.selectedRows;
        const columns = [
            {
                name: intl.formatMessage({ id: "table.trnNo" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "lable.trnId" }),
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
                name: intl.formatMessage({ id: "table.Address" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "table.UserName" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "table.OrgName" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "table.Amount" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "table.Status" }),
                options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (<span
                            className={classnames({
                                "badge badge-danger": (value === 9),
                                "badge badge-success": (value === 1),
                                "badge badge-info": (value === 0),
                            })}
                        >
                            {this.props.intl.formatMessage({
                                id: "wallet.DepositReport." + value,
                            })}
                        </span>)
                    }
                }
            },
            {
                name: intl.formatMessage({ id: "table.date" }),
                options: {
                    filter: false,
                    sort: false
                }
            }
        ];
        const options = {
            filter: false,
            filterType: "dropdown",
            responsive: "scroll",
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            selectableRows: false,
            print: false,
            download: false,
            viewColumns: false,
            search: false,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />
                }
            },
        };
        return (
            <div className="jbs-page-content">
                {this.props.menuLoading && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="wallet.depositRecon" />} breadCrumbData={BreadCrumbData} drawerClose={(e) => this.handleCancel()} closeAll={this.closeAll} />
                <div className="StackingHistory">
                    {this.props.loading && <JbsSectionLoader />}
                    <MUIDataTable
                        data={depositTrnList.map((item, key) => {
                            var ExplorerLink = item.hasOwnProperty("ExplorerLink")
                                ? JSON.parse(item.ExplorerLink)
                                : "";
                            return [
                                item.TrnNo,
                                <a
                                    href={
                                        ExplorerLink.length
                                            ? ExplorerLink[0].Data + "/" + item.TrnId
                                            : item.TrnId
                                    }
                                    target="_blank"
                                >
                                    {item.TrnId}
                                </a>,
                                item.CoinName,
                                item.Address,
                                item.UserName,
                                item.OrganizationName,
                                parseFloat(item.Amount).toFixed(8),
                                item.Status,
                                changeDateFormat(item.Date, 'YYYY-MM-DD HH:mm:ss', false),
                            ];
                        })}
                        columns={columns}
                        options={options}
                    />
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
                    <div className="col-sm-6">
                        <FormGroup className="col-sm-12 ">
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
                                    <Label for="Code"><IntlMessages id="wallet.2FAHint1" />{' "'}<IntlMessages id={"wallet.reconActivity." + this.state.actionType} />{'" '}<IntlMessages id="wallet.2FAHint2" /></Label>
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
        );
    }
}

const mapDispatchToProps = ({ dipositReportReducer, authTokenRdcer }) => {
    const { loading, reconResponse, response2fa, errors, error2fa } = dipositReportReducer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { loading, reconResponse, response2fa, errors, error2fa, menuLoading, menu_rights };
};

export default connect(mapDispatchToProps, {
    doReconProcess,
    verify2fa,
    getMenuPermissionByID
})(injectIntl(DepositRecon));