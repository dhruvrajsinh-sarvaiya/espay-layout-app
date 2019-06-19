/* 
    Developer : Nishant Vadgama
    File Comment : Leverage Request report
    Date : 12-09-2019
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import { injectIntl } from 'react-intl';
import IntlMessages from "Util/IntlMessages";
import Button from "@material-ui/core/Button";
import MUIDataTable from "mui-datatables";
import { Form, FormGroup, Label, Input, Alert } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { changeDateFormat } from "Helpers/helpers";
import Select from "react-select";
import { getUserDataList } from "Actions/MyAccount";
import { getWalletType } from "Actions/WalletUsagePolicy";
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { CustomFooter } from 'Components/MyAccount/Dashboards/Widgets/CustomFooter';
import AppConfig from 'Constants/AppConfig';
import { NotificationManager } from "react-notifications";
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import {
    getLeverageRequests,
    acceptRejectLeverageRequest
} from "Actions/MarginTrading/LeverageRequests";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
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
        title: <IntlMessages id="sidebar.marginTrading" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="margintrading.leverageRequests" />,
        link: '',
        index: 1
    },
];

const initState = {
    Page: 1,
    PageSize: AppConfig.totalRecordDisplayInList,
    TotalCount: 0,
    FromDate: new Date().toISOString().slice(0, 10),
    ToDate: new Date().toISOString().slice(0, 10),
    // FromDate: '',
    // ToDate: '',
    WalletTypeID: '',
    UserID: '',
    UserLabel: null,
    showReset: false,
    showDialog: false,
    ReuestId: '',
    IsApproved: '',
    showError: false,
    showSuccess: false,
    responseMessage: "",
    Today: new Date().toISOString().slice(0, 10),
    menudetail: [],
    notificationFlag: true,
}

class LeverageRequests extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    getListFromServer = (Page, PageSize) => {
        var newObj = Object.assign({}, this.state);
        newObj['Page'] = Page > 0 ? Page : this.state.Page;
        if (PageSize > 0) {
            newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.PageSize;
        }
        this.setState(newObj);
        //For Action API...
        var reqObj = newObj;
        reqObj.Page = Page > 0 ? Page - 1 : 1;
        this.props.getLeverageRequests(reqObj);
    }
    /* will fetch data */
    componentWillMount() {
        this.props.getMenuPermissionByID('F3066628-955E-5D83-1CE7-0300152C5817'); // get wallet menu permission
        // this.props.getUserDataList();
        //this.props.getWalletType({ Status: 1 });
        // this.getListFromServer(this.state.Page, this.state.PageSize);
        // this.props.getLeverageRequests({
        //     Page: this.state.Page,
        //     PageSize: this.state.PageSize
        // })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
            })
        }
        if (nextProps.leverageResponse.hasOwnProperty('ReturnCode')) {
            if (nextProps.leverageResponse.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id={this.state.IsApproved ? "wallet.acceptSuccess" : "wallet.rejectSuccess"} />);
                this.props.getLeverageRequests({
                    Page: this.state.Page,
                    PageSize: this.state.PageSize
                })

            } else if (nextProps.leverageResponse.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"apiWalletErrCode." + nextProps.leverageResponse.ErrorCode} />);
            }
        }
        // if (nextProps.leverageResponse.hasOwnProperty('ReturnCode')) {
        //     if (nextProps.leverageResponse.ReturnCode === 0) {
        //         this.setState({ showSuccess: true, responseMessage: nextProps.leverageResponse.ReturnMsg });
        //         setTimeout(function () {
        //             this.setState({ showSuccess: false });
        //             this.props.getLeverageRequests({
        //                 Page: this.state.Page,
        //                 PageSize: this.state.PageSize
        //             })
        //         }.bind(this), 3000);
        //     } else if (nextProps.leverageResponse.ReturnCode === 1) {
        //         this.setState({ showError: true, responseMessage: nextProps.leverageResponse.ReturnMsg })
        //         setTimeout(function () {
        //             this.setState({ showError: false });
        //         }.bind(this), 3000);
        //     }
        // }
        if (this.state.TotalCount !== nextProps.TotalCount) {
            this.setState({ TotalCount: nextProps.TotalCount })
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.getListFromServer(this.state.Page, this.state.PageSize);
                this.props.getUserDataList();
                this.props.getWalletType({ Status: 1 });
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }
    }
    //Pagination Change Method...
    handlePageChange(pageNumber) {
        this.getListFromServer(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getListFromServer(1, event.target.value);
    };
    // on change handler
    onChangeHandler(e) {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }
    //onchange select user
    onChangeSelectUser(e) {
        this.setState({ UserID: e.value, UserLabel: { label: e.label } });
    }
    applyFilter = () => {
        if ((this.state.FromDate !== "" && this.state.ToDate !== "") || this.state.WalletTypeID !== "" || this.state.UserID !== "") {
            this.getListFromServer(1, this.state.PageSize);
            // this.props.getLeverageRequests({
            //     FromDate: this.state.FromDate,
            //     ToDate: this.state.ToDate,
            //     WalletTypeID: this.state.WalletTypeID,
            //     UserID: this.state.UserID,
            //     Page: 0,
            //     PageSize: this.state.PageSize
            // });
            this.setState({ showReset: true });
        }
    };
    //clear filter
    clearFilter = () => {
        this.setState(initState, () => this.getListFromServer(this.state.Page, this.state.PageSize));
        // this.setState(initState);
        // this.props.getLeverageRequests({
        //     Page: 0,
        //     PageSize: this.state.PageSize
        // })
    };
    /* Accept or Reject request */
    acceptRejectRequest = () => {
        if (this.state.ReuestId !== '' && this.state.IsApproved !== '') {
            this.setState({ showDialog: false });
            this.props.acceptRejectLeverageRequest({
                ReuestId: this.state.ReuestId,
                IsApproved: this.state.IsApproved
            });
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('4CCFF800-60EA-77BE-8046-4B927B461300');
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const intl = this.props.intl;
        const { drawerClose, closeAll } = this.props;
        const userlist = this.props.getUser.hasOwnProperty('GetUserData') ? this.props.getUser.GetUserData : [];
        const columns = [
            {
                name: intl.formatMessage({ id: "table.Id" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.currency" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "margintrading.fromWallet" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "margintrading.toWallet" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "wallet.lblUserId" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "lable.amount" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "margintrading.LeverageAmount" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "margintrading.ChargeAmount" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "wallet.LeveragePer" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "margintrading.MarginAmount" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "margintrading.CreditAmount" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.status" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.Remarks" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.TrnDate" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.action" }),
                options: { sort: false, filter: false }
            }
        ];
        const options = {
            search: false,
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            download: false,
            viewColumns: false,
            filter: false,
            serverSide: this.props.leverageRequest.length !== 0 ? true : false,
            page: this.state.Page,
            // rowsPerPageOptions: [10, 25, 50, 100],
            rowsPerPage: this.state.PageSize,
            count: this.state.TotalCount,
            textLabels: {
                body: {
                    noMatch: intl.formatMessage({ id: "wallet.emptyTable" }),
                    toolTip: intl.formatMessage({ id: "wallet.sort" }),
                }
            },
            customFooter: (count, page, rowsPerPage) => {
                var page = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            // onTableChange: (action, tableState) => {
            //     switch (action) {
            //         case "changeRowsPerPage":
            //             this.setState({
            //                 Page: tableState.page,
            //                 PageSize: tableState.rowsPerPage
            //             });
            //             this.props.getLeverageRequests({
            //                 FromDate: this.state.FromDate,
            //                 ToDate: this.state.ToDate,
            //                 WalletTypeID: this.state.WalletTypeID,
            //                 UserID: this.state.UserID,
            //                 Page: tableState.page,
            //                 PageSize: tableState.rowsPerPage
            //             });
            //             break;
            //         case "changePage":
            //             this.setState({
            //                 Page: tableState.page,
            //                 PageSize: tableState.rowsPerPage
            //             });
            //             this.props.getLeverageRequests({
            //                 FromDate: this.state.FromDate,
            //                 ToDate: this.state.ToDate,
            //                 WalletTypeID: this.state.WalletTypeID,
            //                 UserID: this.state.UserID,
            //                 Page: tableState.page,
            //                 PageSize: tableState.rowsPerPage
            //             });
            //             break;
            //     }
            // }
        };
        return (
            <div className="jbs-page-content drawer-data">
                <WalletPageTitle title={<IntlMessages id="margintrading.leverageRequests" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={closeAll} />
                <React.Fragment>
                    <Alert color="danger" isOpen={this.state.showError} toggle={(e) => this.setState({ showError: false })}>
                        {this.state.responseMessage}
                    </Alert>
                    <Alert color="success" isOpen={this.state.showSuccess} toggle={(e) => this.setState({ showSuccess: false })}>
                        {this.state.responseMessage}
                    </Alert>
                </React.Fragment>
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
                                    <Label for="WalletTypeID">
                                        {intl.formatMessage({ id: "table.currency" })}
                                    </Label>
                                    <Input
                                        type="select"
                                        name="WalletTypeID"
                                        id="WalletTypeID"
                                        value={this.state.WalletTypeID}
                                        onChange={e => this.onChangeHandler(e)}
                                    >
                                        <option value="">{intl.formatMessage({ id: "wallet.errCurrency" })}</option>
                                        {this.props.walletType.length && this.props.walletType.map((type, index) => (
                                            <option key={index} value={type.ID}>{type.TypeName}</option>
                                        ))}
                                    </Input>
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="UserId">{intl.formatMessage({ id: "wallet.lblUserId" })}</Label>
                                    <Select className="r_sel_20 no_mrg"
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
                                    <div className="btn_area">
                                        <Button
                                            color="primary"
                                            variant="raised"
                                            disabled={((this.state.FromDate !== "" && this.state.ToDate !== "") || this.state.WalletTypeID !== "" || this.state.UserID !== "") ? false : true}
                                            onClick={() => this.applyFilter()}
                                        >
                                            {intl.formatMessage({ id: "widgets.apply" })}
                                        </Button>
                                        {this.state.showReset && 
                                        <Button
                                            className="btn-danger text-white ml-15"
                                            onClick={e => this.clearFilter()}
                                        >
                                            {intl.formatMessage({ id: "bugreport.list.dialog.button.clear" })}
                                        </Button>}
                                    </div>
                                </FormGroup>
                            </Form>
                        </div>
                    </JbsCollapsibleCard>
                }
                <div className="StackingHistory">
                    {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                    <MUIDataTable
                        title={this.props.title}
                        data={this.props.leverageRequest.map(item => {
                            return [
                                item.Id,
                                item.WalletTypeName,
                                item.FromWalletName,
                                item.ToWalletName,
                                item.UserName,
                                parseFloat(item.Amount).toFixed(8),
                                parseFloat(item.LeverageAmount).toFixed(8),
                                parseFloat(item.ChargeAmount).toFixed(8),
                                parseInt(item.LeveragePer) + "X",
                                parseFloat(item.SafetyMarginAmount).toFixed(8),
                                parseFloat(item.CreditAmount).toFixed(8),
                                item.StrStatus,
                                item.RequestRemarks,
                                changeDateFormat(item.TrnDate, 'YYYY-MM-DD HH:mm:ss', false),
                                <div className="list-action">
                                    <Tooltip title={intl.formatMessage({ id: "button.accept" })} placement="bottom">
                                        {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 &&
                                            <a
                                                className="mr-10 d-inline"
                                                href="javascript:void(0)"
                                                onClick={() => this.setState({ showDialog: true, ReuestId: item.Id, IsApproved: 1 })}
                                            >
                                                <i className="ti-check" />
                                            </a>
                                        }
                                    </Tooltip>
                                    <Tooltip title={intl.formatMessage({ id: "button.reject" })} placement="bottom">
                                        {menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 && // check for delete permission
                                            <a
                                                href="javascript:void(0)"
                                                onClick={() => this.setState({ showDialog: true, ReuestId: item.Id, IsApproved: 0 })}
                                            >
                                                <i className="ti-na" />
                                            </a>
                                        }
                                    </Tooltip>
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
                        {intl.formatMessage({ id: "margintrading.doYouWantToProceed" })}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={() => this.acceptRejectRequest()} className="btn-primary text-white" autoFocus>
                            {intl.formatMessage({ id: "button.yes" })}
                        </Button>
                        <Button onClick={() => this.setState({ showDialog: false })} className="btn-danger text-white">
                            {intl.formatMessage({ id: "sidebar.btnNo" })}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
const mapStateToProps = ({ LeverageRequestsReducer, walletUsagePolicy, actvHstrRdcer, drawerclose, authTokenRdcer }) => {
    // breadcrumb 
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { walletType } = walletUsagePolicy;
    const { loading, leverageRequest, TotalCount, leverageResponse } = LeverageRequestsReducer;
    const { getUser } = actvHstrRdcer;
    const { menuLoading, menu_rights } = authTokenRdcer;
    return { loading, leverageRequest, walletType, TotalCount, getUser, leverageResponse, drawerclose, menuLoading, menu_rights };
};

export default connect(mapStateToProps, {
    getUserDataList,
    getWalletType,
    getLeverageRequests,
    acceptRejectLeverageRequest,
    getMenuPermissionByID
})(injectIntl(LeverageRequests));

