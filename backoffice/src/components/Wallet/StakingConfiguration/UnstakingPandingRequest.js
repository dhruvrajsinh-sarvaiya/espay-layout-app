/* 
    Developer : Vishva shah
    Date : 12-3-2019
    File Comment : Unstaking Pending Request Component
*/
import React, { Component } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import Button from "@material-ui/core/Button";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import MUIDataTable from "mui-datatables";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { injectIntl } from 'react-intl';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { getUserDataList } from "Actions/MyAccount";
import { Form,FormGroup, Label, Input } from "reactstrap";
import Select from "react-select";
import { getListPendingRequest, AccepetRejectRequest } from "Actions/UnstakingPendingRequest";
import AppConfig from 'Constants/AppConfig';
import { NotificationManager } from "react-notifications";
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import classnames from "classnames";
import Tooltip from '@material-ui/core/Tooltip';
// Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
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
        title: <IntlMessages id="walletDashboard.UnstakingPandingRequest" />,
        link: '',
        index: 1
    },
];
const initialState = {
    Userid: '',
    UserLabel: null,
    showDialog: false,
    item: null,
    Type: "",
    Bit: '',
    showReset: false,
    Status: "",
    UnStakingType: "",
    notificationFlag: false,
    menudetail: [],
    notification: true,
}

class UnstakingPandingRequest extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('50BCFE65-0039-1D79-70AE-E67C2D294988'); // get wallet menu permission
    }
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getListPendingRequest({});
                this.props.getUserDataList();
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notification: false });
        }
        if (nextProps.statusResponse.hasOwnProperty("ReturnCode") && this.state.notificationFlag) {
            this.setState({ notificationFlag: false });
            if (nextProps.statusResponse.ReturnCode == 0) { // success
                NotificationManager.success(<IntlMessages id={this.state.Bit ? "wallet.acceptSuccess" : "wallet.rejectSuccess"} />);
                this.props.getListPendingRequest({})
            } else if (nextProps.statusResponse.ReturnCode !== 0) {     //failed
                NotificationManager.error(<IntlMessages id={"apiWalletErrCode." + nextProps.statusResponse.ErrorCode} />);
            }
        }
    }
    //onchange select user
    onChangeSelectUser = (e) => {
        this.setState({ Userid: e.value, UserLabel: { label: e.label } });
    }
    acceptRejectRequest = (item) => {
        this.setState({ showDialog: false, notificationFlag: true });
        this.props.AccepetRejectRequest({
            AdminReqID: item.AdminReqID,
            Bit: this.state.Bit,
            StakingHistoryId: item.TokenStakingHistoryID,
            Type: item.UnstakeType,
            StakingPolicyDetailId: item.DegradeStakingHistoryRequestID,
        });
    }
    onChangeHandler(e) {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }
    //apply filter
    applyFilter = () => {
        if (this.state.Userid !== "" || this.state.Status !== "" || this.state.UnStakingType !== "") {
            this.props.getListPendingRequest({
                Userid: this.state.Userid,
                Status: this.state.Status,
                UnStakingType: this.state.UnStakingType,
                Amount: this.state.Amount
            });
            this.setState({ showReset: true });
        }
    };
    // clear filter
    clearFilter = () => {
        this.setState(initialState);
        this.props.getListPendingRequest({})
    };
    /* close all */
    closeAll = () => {
        this.props.closeAll();
        this.setState(initialState);
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('75E029B1-547F-9DB8-6FD2-E7A7BC2583D4');
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const userlist = this.props.getUser.hasOwnProperty('GetUserData') ? this.props.getUser.GetUserData : [];
        const { drawerClose, intl } = this.props;
        const columns = [
            {
                name: intl.formatMessage({ id: "wallet.lblSr" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.UserName" }),
                options: { sort: true, filter: true }
            },
            {
                name: intl.formatMessage({ id: "table.Email" }),
                options: { sort: true, filter: true }
            },
            {
                name: intl.formatMessage({ id: "table.AmountCredited" }),
                options: { sort: true, filter: true }
            },
            {
                name: intl.formatMessage({ id: "table.ChargeBeforeMaturity" }),
                options: { sort: true, filter: true }
            },
            {
                name: intl.formatMessage({ id: "table.UnstackTypeName" }),
                options: { sort: true, filter: true }
            },
            {
                name: intl.formatMessage({ id: "table.status" }),
                options: {
                    sort: true,
                    filter: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (<span
                            className={classnames({
                                "badge badge-success": (value === 1),
                                "badge badge-info": (value === 0),
                            })}
                        >
                            {this.props.intl.formatMessage({
                                id: "wallet.unstaking." + value,
                            })}
                        </span>)
                    } 
                }
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
            filter: false,
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },

        };
        return (
            <div className="jbs-page-content">
             {this.props.menuLoading && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="walletDashboard.UnstakingPandingRequest" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {menuPermissionDetail.Utility.indexOf('18736530') !== -1 &&
                    <JbsCollapsibleCard>
                        <div className="top-filter">
                                <Form className="tradefrm row">
                                <FormGroup className="col-md-2 col-sm-4 r_sel_20">
                                    <Label for="Userid">{intl.formatMessage({ id: "wallet.lblUserId" })}</Label>
                                    <Select className="r_sel_20"
                                        options={userlist.map((user, i) => ({
                                            label: user.UserName,
                                            value: user.Id,
                                        }))}
                                        onChange={e => this.onChangeSelectUser(e)}
                                        value={this.state.UserLabel}
                                        maxMenuHeight={200}
                                        placeholder={intl.formatMessage({ id: "sidebar.searchdot" })}
                                    />
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="Select-1"><IntlMessages id="widgets.status" /></Label>
                                    <Input type="select" name="Status" id="Status" value={this.state.Status} onChange={(e) => this.onChangeHandler(e)}>
                                        <option value="">{intl.formatMessage({ id: "wallet.errStatus" })}</option>
                                        <option value="0">{intl.formatMessage({ id: "widgets.pending" })}</option>
                                        <option value="1">{intl.formatMessage({ id: "wallet.Accept" })}</option>
                                    </Input>
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="Select-1"><IntlMessages id="table.UnstackTypeName" /></Label>
                                    <Input type="select" name="UnStakingType" id="UnStakingType" value={this.state.UnStakingType} onChange={(e) => this.onChangeHandler(e)}>
                                        <option value="">{intl.formatMessage({ id: "lable.selectType" })}</option>
                                        <option value="1">{intl.formatMessage({ id: "wallet.Full" })}</option>
                                        <option value="2">{intl.formatMessage({ id: "wallet.Partial" })}</option>
                                    </Input>
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <div className="btn_area">
                                    <Button
                                        color="primary"
                                        variant="raised"
                                        disabled={(this.state.Userid !== "" || this.state.Status !== "" || this.state.UnStakingType !== "") ? false : true}
                                        onClick={() => this.applyFilter()}
                                    >
                                        {intl.formatMessage({ id: "widgets.apply" })}
                                    </Button>
                                {this.state.showReset && (
                                        <Button
                                            className="btn-danger text-white ml-10"
                                            onClick={e => this.clearFilter()}
                                        >
                                            {intl.formatMessage({ id: "bugreport.list.dialog.button.clear" })}
                                        </Button>
                                )}
                                </div>
                                 </FormGroup>
                            </Form>
                        </div>
                    </JbsCollapsibleCard>
                }
                <div className="StackingHistory">
                    {this.props.loading && <JbsSectionLoader />}
                    <MUIDataTable
                        data={this.props.PendingList.filter(function (item) {
                            return item.Status !== 9;
                        }).map((item, key) => {
                            return [
                                key + 1,
                                item.UserName,
                                item.Email,
                                parseFloat(item.AmountCredited).toFixed(8),
                                parseFloat(item.ChargeBeforeMaturity).toFixed(8),
                                item.UnstackTypeName,
                                item.Status,
                                <div className="list-action">
                                    {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && item.Status === 0 && <Tooltip title={intl.formatMessage({ id: "button.accept" })} placement="bottom">
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.setState({ showDialog: true, Bit: 1, item: item })}
                                        >
                                            <i className="ti-check" />
                                        </a></Tooltip>
                                    }
                                    {menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 && item.Status === 0 && <Tooltip title={intl.formatMessage({ id: "widgets.reject" })} placement="bottom">
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.setState({ showDialog: true, Bit: 0, item: item })}
                                        >
                                            <i className="ti-close" />
                                        </a></Tooltip>
                                    }
                                </div>
                            ];
                        })}
                        columns={columns}
                        options={options}
                    />
                </div>
                <Dialog
                    style={{ zIndex: '99999' }}
                    open={this.state.showDialog}
                    onClose={() => this.setState({ showDialog: false })}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        <IntlMessages id="margintrading.doYouWantToProceed" />
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={() => this.acceptRejectRequest(this.state.item)} className="btn-primary text-white" autoFocus>
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

// map state to props
const mapToProps = ({ UnstakingPendingRequestReducer, actvHstrRdcer,authTokenRdcer }) => {
    const { PendingList, loading, statusResponse } = UnstakingPendingRequestReducer;
    const { getUser } = actvHstrRdcer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { PendingList, loading, statusResponse, getUser, menuLoading,menu_rights };
};

export default connect(mapToProps, {
    getListPendingRequest,
    AccepetRejectRequest,
    getUserDataList,
    getMenuPermissionByID
})(injectIntl(UnstakingPandingRequest));

