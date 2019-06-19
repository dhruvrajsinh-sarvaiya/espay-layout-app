/* 
    Developer : Nishant Vadgama
    File Comment : Leverage Report component
    Date : 13-09-2019
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import MUIDataTable from "mui-datatables";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import Button from "@material-ui/core/Button";
import { getLeverageReport } from "Actions/MarginTrading/LeverageReport";
import { getWalletType } from "Actions/WalletUsagePolicy";
import { Form, FormGroup, Label, Input, Row } from 'reactstrap';
import { getUserDataList } from "Actions/MyAccount";
import { injectIntl } from 'react-intl';
import Select from "react-select";
import { changeDateFormat } from "Helpers/helpers";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { CustomFooter } from 'Components/MyAccount/Dashboards/Widgets/CustomFooter';
import AppConfig from 'Constants/AppConfig';
import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import { NotificationManager } from "react-notifications";
import classnames from "classnames";
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

const initState = {
    open: false,
    PageNo: 1,
    PageSize: AppConfig.totalRecordDisplayInList,
    TotalCount: 0,
    WalletType: '',
    UserId: "",
    UserLabel: null,
    Status: '',
    FromDate: new Date().toISOString().slice(0, 10),
    ToDate: new Date().toISOString().slice(0, 10),
    showReset: false,
    Today: new Date().toISOString().slice(0, 10),
    menudetail: [],
    notificationFlag: true,
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
        title: <IntlMessages id="sidebar.marginTrading" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="wallet.LeverageReport" />,
        link: '',
        index: 1
    },
];

class LeverageReport extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
        this.handlePageChange = this.handlePageChange.bind(this);
    }
    /* server pagination */
    getListFromServer = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.PageNo;
        if (PageSize > 0) {
            newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.PageSize;
        }
        this.setState(newObj);
        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        this.props.getLeverageReport(reqObj);
    }
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false
        });
    };
    onClick = () => {
        this.setState({
            open: !this.state.open
        });
    };
    componentWillMount() {
        this.props.getMenuPermissionByID('741CB0F3-8504-6C9B-0C3D-B7DF28070312'); // get wallet menu permission
        // this.props.getUserDataList();
        // this.props.getWalletType({ Status: 1 });
        // this.getListFromServer(this.state.PageNo, this.state.PageSize);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
            })
        }
        if (this.state.TotalCount !== nextProps.TotalCount) {
            this.setState({ TotalCount: nextProps.TotalCount })
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.getListFromServer(this.state.PageNo, this.state.PageSize);
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
    onChangeHandler(e, key) {
        e.preventDefault();
        this.setState({ [key]: e.target.value });
    }
    //Pagination Change Method...
    handlePageChange(pageNumber) {
        this.getListFromServer(pageNumber);
    }
    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getListFromServer(1, event.target.value);
    };
    //onchange select user
    onChangeSelectUser(e) {
        this.setState({ UserId: e.value, UserLabel: { label: e.label } });
    }
    //Apply Filter option
    applyFilter = () => {
        if (this.state.FromDate !== '' && this.state.ToDate !== '') {
            this.getListFromServer(1, this.state.PageSize);
            this.setState({ showReset: true });
        }
    }
    //clear filter
    clearFilter = () => {
        this.setState(initState, () => this.getListFromServer(this.state.PageNo, this.state.PageSize));
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('61A90B1D-99EB-771D-47A1-6657429C9E3A');
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const intl = this.props.intl;
        const userlist = this.props.getUser.hasOwnProperty('GetUserData') ? this.props.getUser.GetUserData : [];
        const { drawerClose } = this.props;
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
                options: {
                    sort: true, filter: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (<span
                            className={classnames({
                                "badge badge-danger": value === 9,
                                "badge badge-success": (value === 1),
                                "badge badge-info": (value === 6 || value === 0 || value === 5),
                            })}
                        >
                            {this.props.intl.formatMessage({
                                id: "wallet.levrageStatus." + value,
                            })}
                        </span>)
                    }
                }
            },
            {
                name: intl.formatMessage({ id: "wallet.ApprovedByUserName" }),
                options: { filter: false, sort: false }
            },
            {
                name: intl.formatMessage({ id: "table.Remarks" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.TrnDate" }),
                options: { sort: false, filter: false }
            },
        ];
        const options = {
            filter: false,
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            // rowsPerPageOptions: [10, 25, 50, 100],
            serverSide: this.props.leverageList.length !== 0 ? true : false,
            page: this.state.PageNo,
            rowsPerPage: this.state.PageSize,
            count: this.state.TotalCount,
            print: false,
            download: false,
            viewColumns: false,
            search: false,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customFooter: (count, page, rowsPerPage) => {
                var page = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
        };
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="wallet.LeverageReport" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="StackingHistory">
                    {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                    {menuPermissionDetail.Utility.indexOf('18736530') !== -1 &&
                        <JbsCollapsibleCard>
                            <div className="top-filter">
                                <Form className="tradefrm row">
                                        <FormGroup className="col-md-2 col-sm-4">
                                            <Label for="startDate"><IntlMessages id="widgets.startDate" /></Label>
                                            <Input type="date" name="date" id="startDate" placeholder="dd/mm/yyyy" value={this.state.FromDate} onChange={(e) => this.onChangeHandler(e, 'FromDate')} max={this.state.Today} />
                                        </FormGroup>
                                        <FormGroup className="col-md-2 col-sm-4">
                                            <Label for="endDate"><IntlMessages id="widgets.endDate" /></Label>
                                            <Input type="date" name="date" id="endDate" placeholder="dd/mm/yyyy" value={this.state.ToDate} onChange={(e) => this.onChangeHandler(e, 'ToDate')} max={this.state.Today} />
                                        </FormGroup>
                                        <FormGroup className="col-md-2 col-sm-4">
                                            <Label for="Select-1"><IntlMessages id="table.currency" /></Label>
                                            <Input type="select" name="walletType" id="walletType" value={this.state.WalletType} onChange={(e) => this.onChangeHandler(e, 'WalletType')}>
                                                <option value="">{intl.formatMessage({ id: "wallet.errCurrency" })}</option>
                                                {this.props.walletType.length &&
                                                    this.props.walletType.map((type, index) => (
                                                        <option key={index} value={type.ID}>{type.TypeName}</option>
                                                    ))}
                                            </Input>
                                        </FormGroup>
                                        <FormGroup className="col-md-2 col-sm-4">
                                            <Label for="UserId"><IntlMessages id="wallet.lblUserId" /></Label>
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
                                            <Input type="select" name="status" id="status" value={this.state.Status} onChange={(e) => this.onChangeHandler(e, 'Status')}>
                                                <option value="">{intl.formatMessage({ id: "wallet.errStatus" })}</option>
                                                <option value="0">{intl.formatMessage({ id: "wallet.status.0" })}</option>
                                                <option value="1">{intl.formatMessage({ id: "widgets.open" })}</option>
                                                <option value="3">{intl.formatMessage({ id: "organizationLedger.status.fail" })}</option>
                                                <option value="5">{intl.formatMessage({ id: "lable.withdraw" })}</option>
                                                <option value="6">{intl.formatMessage({ id: "wallet.statusApprove" })}</option>
                                                <option value="9">{intl.formatMessage({ id: "sidebar.rejected" })}</option>
                                            </Input>
                                        </FormGroup>
                                        <FormGroup className="col-md-2 col-sm-4">
                                            <div className="btn_area">
                                                <Button
                                                    color="primary"
                                                    variant="raised"
                                                    className="text-white"
                                                    onClick={() => this.applyFilter()}
                                                    disabled={(this.state.FromDate !== '' && this.state.ToDate !== '') ? false : true}
                                                ><IntlMessages id="widgets.apply" /></Button>
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
                    {this.props.loading && <JbsSectionLoader />}
                    <MUIDataTable
                        data={this.props.leverageList.map((item, key) => {
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
                                item.Status,
                                item.ApprovedByUserName,
                                item.RequestRemarks,
                                changeDateFormat(item.TrnDate, 'YYYY-MM-DD HH:mm:ss', false),
                            ];
                        })}
                        columns={columns}
                        options={options}
                    />
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = ({ LeverageReportReducer, walletUsagePolicy, actvHstrRdcer, drawerclose, authTokenRdcer }) => {
    // breadcrumb 
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { leverageList, TotalCount, loading } = LeverageReportReducer;
    const { walletType } = walletUsagePolicy;
    const { getUser } = actvHstrRdcer;
    const { menuLoading, menu_rights } = authTokenRdcer;
    return { leverageList, walletType, getUser, TotalCount, loading, drawerclose, menuLoading, menu_rights };
};

export default connect(mapDispatchToProps, {
    getLeverageReport,
    getUserDataList,
    getWalletType,
    getMenuPermissionByID
})(injectIntl(LeverageReport));

