import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import MUIDataTable from "mui-datatables";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import Button from "@material-ui/core/Button";
import { getOrgList } from "Actions/Wallet";
import { getWithdrawalReport } from "Actions/Withdrawal";
import { getWalletType } from "Actions/WalletUsagePolicy";
import { Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { getUserDataList } from "Actions/MyAccount";
import { injectIntl } from 'react-intl';
import Select from "react-select";
import { changeDateFormat } from "Helpers/helpers";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { CustomFooter } from "Components/MyAccount/Dashboards/Widgets";
import AppConfig from 'Constants/AppConfig';
import { NotificationManager } from 'react-notifications';
//added by parth andhariya
import WithdrawalRecon from 'Components/Wallet/WithdrawalRecon';
import Drawer from "rc-drawer";
import Tooltip from '@material-ui/core/Tooltip';
import validator from "validator";
import classnames from "classnames";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { Table } from 'reactstrap';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import Slide from "@material-ui/core/Slide";
//added by parth andhariya
//component names
const components = {
    WithdrawalRecon: WithdrawalRecon,
};
//added by parth andhariya
// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, selectedRows, applyFilter, menuDetail) => {
    return React.createElement(components[TagName], {
        props,
        drawerClose,
        closeAll,
        selectedRows,
        applyFilter,
        menuDetail
    });
};
//Added by salim dt:27/03/2019...
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
];
const initState = {
    open: false,
    Page: 1,
    PageSize: AppConfig.totalRecordDisplayInList,
    TotalCount: 0,
    FromDate: new Date().toISOString().slice(0, 10),
    ToDate: new Date().toISOString().slice(0, 10),
    Status: "",
    UserId: "",
    UserLabel: null,
    Address: "",
    TrnID: "",
    OrgId: "",
    TrnNo: "",
    WalletType: "",
    showError: false,
    showSuccess: false,
    responseMessage: "",
    showReset: false,
    // added by parth andhariya
    componentName: "",
    selectedRows: [],
    selectedRowsForTable: [],
    notificationFlag: true,
    Today: new Date().toISOString().slice(0, 10),
    errors: {
        Address: "",
        TrnNo: "",
        TrnID: ""
    },
    menudetail: [],
    notification: true,
    showDialog: false,
};
function Transition(props) {
    return <Slide direction="up" {...props} />;
}
class WithdrawalReport extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false
        });
    };
    onClick = () => {
        this.setState({
            open: this.state.open ? false : true
        });
    };
    //Get List From Server API...
    getListFromServer = (Page, PageSize) => {
        var newObj = Object.assign({}, this.state);
        newObj['Page'] = Page > 0 ? Page : this.state.Page;
        newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.PageSize;
        this.setState(newObj);
        //For Action API...
        var reqObj = newObj;
        reqObj.Page = Page > 0 ? Page - 1 : 1;
        delete reqObj.showReset;
        delete reqObj.showError;
        delete reqObj.UserLabel;
        delete reqObj.TotalCount;
        delete reqObj.open;
        delete reqObj.showSuccess;
        this.props.getWithdrawalReport(reqObj);
    };
    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.getListFromServer(pageNumber);
    }
    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getListFromServer(1, event.target.value);
    }
    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.menuDetail ? '0723F919-1E8A-7C0F-132E-D61FBF40949E' : '1944654E-05F0-6249-27D8-91EB98F611CA'); // get wallet menu permission

    }
    componentWillReceiveProps(nextProps) {
        const intl = this.props.intl;
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.getListFromServer(this.state.Page, this.state.PageSize);
                this.props.getOrgList();
                this.props.getWalletType({ Status: 1 });
                this.props.getUserDataList();
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notification: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        if (this.state.TotalCount !== nextProps.TotalCount) {
            this.setState({ TotalCount: nextProps.TotalCount })
        }
        if (nextProps.withdrawalResponce.ReturnCode === 1 && this.state.notificationFlag && this.props.loading) {
            this.setState({ notificationFlag: false });
            NotificationManager.error(intl.formatMessage({ id: "error.trading.transaction." + nextProps.withdrawalResponce.ErrorCode }));
        }
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
            })
        }
    }
    //Apply Filter option
    applyFilter = () => {
        if (this.state.FromDate !== '' && this.state.ToDate !== '') {
            this.setState({
                showReset: true,
                notificationFlag: true
            }, () => this.getListFromServer(1, this.state.PageSize));
        }
    }
    //clear filter
    clearFilter = () => {
        this.setState({
            ...initState,
            menudetail: this.state.menudetail
        }, () => this.getListFromServer(this.state.Page, this.state.PageSize));
    }
    onChangeHandler(e, key) {
        e.preventDefault();
        if (key === "Address") {
            if (validator.isAlphanumeric(e.target.value) || e.target.value === "") {

                this.setState({ [key]: e.target.value });
            }
        } else if (key === "TrnID" || key === "TrnNo") {
            if (validator.isDecimal(e.target.value, {
                no_symbols: true,
                decimal_digits: '0,8'
            }) ||
                (validator.isNumeric(e.target.value, { no_symbols: true })) || e.target.value === ""
            ) {
                this.setState({ [key]: e.target.value });
            }
        } else {
            this.setState({ [key]: e.target.value });
        }
    }

    //onchange select user
    onChangeSelectUser(e) {
        this.setState({ UserId: e.value, UserLabel: { label: e.label } });
    }
    viewDetail = (selectedRows) => {
        this.setState({
            showDialog: true,
            selectedRowsForTable: selectedRows
        });
    }
    /* show component */
    showComponent = (componentName, selectedRows, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                componentName: componentName,
                open: true,
                selectedRows: selectedRows
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
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
        /* check menu permission */
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail(this.props.menuDetail ? '5A06A906-7713-4F55-8689-AB687A1561F7' : '724FE907-A05F-4B97-2F34-174E92073563'); //724FE907-A05F-4B97-2F34-174E92073563
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const intl = this.props.intl;
        const { drawerClose } = this.props;
        const userlist = this.props.getUser.hasOwnProperty('GetUserData') ? this.props.getUser.GetUserData : [];
        const columns = [
            {
                name: intl.formatMessage({ id: "table.trnNo" }),
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
                name: intl.formatMessage({ id: "table.FromAddress" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "table.ToAddress" }),
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
                                "badge badge-danger": (value === 2 || value === 3),
                                "badge badge-success": (value === 1),
                                "badge badge-info": (value === 5 || value === 999 || value === 4),
                                "badge badge-warning": (value === 6)
                            })}
                        >
                            {this.props.intl.formatMessage({
                                id: "wallet.withdrawalReport." + value,
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
            },
            {
                name: intl.formatMessage({ id: "sidebar.colAction" }),
                options: { sort: true, filter: true }
            }
        ];
        const options = {
            filter: false,
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            serverSide: this.props.withdrawalReportData.length !== 0 ? true : false,
            page: this.state.Page,
            rowsPerPage: this.state.PageSize,
            count: this.state.TotalCount,
            print: false,
            download: false,
            viewColumns: false,
            search: false,// menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customFooter: (count, page, rowsPerPage) => {
                var pages = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter
                        count={count}
                        page={pages}
                        rowsPerPage={rowsPerPage}
                        handlePageChange={this.handlePageChange}
                        onChangeRowsPerPage={this.onChangeRowsPerPage}
                    />
                );
            },
        };
        return (
            <div className="jbs-page-content">
                {this.props.menuLoading && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id={this.props.componentTlt} />} breadCrumbData={this.props.BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <Fragment>
                    <Alert color="danger" isOpen={this.state.showError} toggle={(e) => this.setState({ showError: false })}>
                        {this.state.responseMessage}
                    </Alert>
                    <Alert color="success" isOpen={this.state.showSuccess} toggle={(e) => this.setState({ showSuccess: false })}>
                        {this.state.responseMessage}
                    </Alert>
                </Fragment>
                <div className="StackingHistory">
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
                                            {this.props.walletType.length > 0 &&
                                                this.props.walletType.map((type, index) => (
                                                    <option key={index} value={type.TypeName}>{type.TypeName}</option>
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
                                            <option value="1">{intl.formatMessage({ id: "wallet.lblstatusSuccess" })}</option>
                                            <option value="2">{intl.formatMessage({ id: "wallet.lblstatusSOperatorFail" })}</option>
                                            <option value="3">{intl.formatMessage({ id: "wallet.lblstatusSystemFail" })}</option>
                                            <option value="4">{intl.formatMessage({ id: "wallet.lblstatusHold" })}</option>
                                            <option value="5">{intl.formatMessage({ id: "wallet.lblstatusRefunded" })}</option>
                                            <option value="6">{intl.formatMessage({ id: "wallet.lblstatusPending" })}</option>
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="OrnId"><IntlMessages id="table.organization" /></Label>
                                        <Input type="select" name="OrgId" id="OrgId" value={this.state.OrgId} onChange={(e) => this.onChangeHandler(e, 'OrgId')}>
                                            <option value="">{intl.formatMessage({ id: "wallet.lblSelectOrganization" })}</option>
                                            {this.props.organizationList.hasOwnProperty("Organizations") &&
                                                this.props.organizationList.Organizations.length > 0 &&
                                                this.props.organizationList.Organizations.map((org, index) => (
                                                    <option key={index} value={org.OrgID}>{org.OrgName}</option>
                                                ))}
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="TrnNo"><IntlMessages id="tradingLedger.filterLabel.trnNo" /></Label>
                                        <Input type="text" name="TrnNo" id="TrnNo" placeholder={intl.formatMessage({ id: "tradingLedger.filterLabel.trnNo" })} value={this.state.TrnNo} onChange={(e) => this.onChangeHandler(e, 'TrnNo')} maxLength={10} />
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Address"><IntlMessages id="wallet.Address" /></Label>
                                        <Input type="text" name="Address" id="Address" placeholder={intl.formatMessage({ id: "wallet.Address" })} value={this.state.Address} onChange={(e) => this.onChangeHandler(e, 'Address')} maxLength={20} />
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="TrnID"><IntlMessages id="lable.trnId" /></Label>
                                        <Input type="text" name="TrnID" id="TrnID" placeholder={intl.formatMessage({ id: "lable.trnId" })} value={this.state.TrnID} onChange={(e) => this.onChangeHandler(e, 'TrnID')} maxLength={50} />
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <div className="btn_area">
                                            <Button color="primary" variant="raised" className="text-white" onClick={() => this.applyFilter()} disabled={(this.state.FromDate !== '' && this.state.ToDate !== '') ? false : true}><IntlMessages id="widgets.apply" /></Button>
                                            {this.state.showReset && <Button className="ml-15 btn-danger text-white" onClick={(e) => this.clearFilter()}><IntlMessages id="bugreport.list.dialog.button.clear" /></Button>}
                                        </div>
                                    </FormGroup>
                                </Form>
                            </div>
                        </JbsCollapsibleCard>
                    }
                    {this.props.loading && <JbsSectionLoader />}
                    <div className="StackingHistory">
                        <MUIDataTable
                            data={this.props.withdrawalReportData.map((item, key) => {
                                return [
                                    item.TrnNo,
                                    item.CoinName,
                                    item.FromAddress,
                                    item.ToAddress,
                                    item.UserName,
                                    item.OrganizationName,
                                    parseFloat(item.Amount).toFixed(8),
                                    item.Status,
                                    changeDateFormat(item.Date, 'YYYY-MM-DD HH:mm:ss', false),
                                    //    added by parth andhariya
                                    <div className="list-action">
                                        {menuPermissionDetail.CrudOption.indexOf('6AF64827') !== -1 &&
                                            <Tooltip title={<IntlMessages id="wallet.view" />} placement="bottom">
                                                <a
                                                    href="javascript:void(0)"
                                                    onClick={() => this.viewDetail(item)} // C53AA5C6-8C1C-1688-7A22-CF07970F8EFB
                                                >
                                                    <i className="ti-eye" />
                                                </a>
                                            </Tooltip>
                                        }{menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 &&
                                            <Tooltip title={<IntlMessages id="wallet.ReconTooltip" />} placement="bottom">
                                                <a
                                                    href="javascript:void(0)"
                                                    onClick={() => this.showComponent("WithdrawalRecon", [item], this.checkAndGetMenuAccessDetail(this.props.menuDetail ? '5A06A906-7713-4F55-8689-AB687A1561F7' : '724FE907-A05F-4B97-2F34-174E92073563').HasChild)} // C53AA5C6-8C1C-1688-7A22-CF07970F8EFB
                                                >
                                                    <i className="zmdi zmdi-open-in-new" />
                                                </a>
                                            </Tooltip>}
                                    </div>
                                ];
                            })}
                            columns={columns}
                            options={options}
                        />
                    </div>
                    {/* added by parth andhariya */}
                    <Drawer
                        width="100%"
                        handler={false}
                        open={this.state.open}
                        onMaskClick={this.toggleDrawer}
                        className="drawer2"
                        level=".drawer0"
                        placement="right"
                        levelMove={100}
                    >
                        {this.state.componentName !== "" &&
                            dynamicComponent(
                                this.state.componentName,
                                this.props,
                                this.onClick,
                                this.closeAll,
                                this.state.selectedRows,
                                this.applyFilter,
                                this.props.menuDetail
                            )}
                    </Drawer>
                </div>
                {/* added by vishva */}
                <Dialog
                    open={this.state.showDialog}
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth
                    maxWidth="md"
                    onClose={(e) => this.setState({ showDialog: false })}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        <div className="list-action justify-content-between d-flex">
                            <IntlMessages id="lable.withdrawalDetails" />
                            <a
                                href="javascript:void(0)"
                                onClick={(e) =>
                                    this.setState({ showDialog: false })
                                }
                            >
                                <i className="ti-close" />
                            </a>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            <div className="row">
                                <div className="col-sm-12 p-0">
                                    <Table bordered responsive className="mb-0">
                                        <tbody>
                                            <tr>
                                                <th className="w-50">{<IntlMessages id="table.trnNo" />}</th>
                                                <td className="w-50">{this.state.selectedRowsForTable.TrnNo}</td>
                                            </tr>
                                            {this.state.selectedRowsForTable.hasOwnProperty('ExplorerLink') &&
                                                <tr>
                                                    <th className="w-50">{<IntlMessages id="lable.trnId" />}</th>
                                                    <td className="w-50">{<a href={(JSON.parse(this.state.selectedRowsForTable.ExplorerLink).length) ? JSON.parse(this.state.selectedRowsForTable.ExplorerLink)[0].Data + '/' + this.state.selectedRowsForTable.TrnID : this.state.selectedRowsForTable.TrnID} target="_blank">{this.state.selectedRowsForTable.TrnID}</a>}</td>
                                                </tr>}
                                            <tr>
                                                <th className="w-50">{<IntlMessages id="table.currency" />}</th>
                                                <td className="w-50">{this.state.selectedRowsForTable.CoinName}</td>
                                            </tr>
                                            <tr>
                                                <th className="w-50">{<IntlMessages id="sidebar.ProviderName" />}</th>
                                                <td className="w-50">{this.state.selectedRowsForTable.ProviderName}</td>
                                            </tr>
                                            <tr>
                                                <th className="w-50">{<IntlMessages id="table.FromAddress" />}</th>
                                                <td className="w-50">{this.state.selectedRowsForTable.FromAddress}</td>
                                            </tr>
                                            <tr>
                                                <th className="w-50">{<IntlMessages id="table.ToAddress" />}</th>
                                                <td className="w-50">{this.state.selectedRowsForTable.ToAddress}</td>
                                            </tr>
                                            <tr>
                                                <th className="w-50">{<IntlMessages id="table.UserName" />}</th>
                                                <td className="w-50">{this.state.selectedRowsForTable.UserName}</td>
                                            </tr>
                                            <tr>
                                                <th className="w-50">{<IntlMessages id="table.OrgName" />}</th>
                                                <td className="w-50">{this.state.selectedRowsForTable.OrganizationName}</td>
                                            </tr>
                                            {this.state.selectedRowsForTable.hasOwnProperty("Amount") && (
                                                <tr>
                                                    <th className="w-50">{<IntlMessages id="table.Amount" />}</th>
                                                    <td className="w-50">{this.state.selectedRowsForTable.Amount.toFixed(8)}</td>
                                                </tr>)}
                                            <tr>
                                                <th className="w-50">{<IntlMessages id="table.Status" />}</th>
                                                <td className="w-50">
                                                    <span className={classnames({
                                                        "badge badge-danger": (this.state.selectedRowsForTable.Status === 2 || this.state.selectedRowsForTable.Status === 3),
                                                        "badge badge-success": (this.state.selectedRowsForTable.Status === 1),
                                                        "badge badge-warning": (this.state.selectedRowsForTable.Status === 6),
                                                        "badge badge-info": (this.state.selectedRowsForTable.Status === 5 || this.state.selectedRowsForTable.Status === 999 || this.state.selectedRowsForTable.Status === 4),

                                                    })} >
                                                        <IntlMessages id={"wallet.withdrawalReport." + this.state.selectedRowsForTable.Status} />
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="w-50">{<IntlMessages id="table.date" />}</th>
                                                <td className="w-50">{changeDateFormat(this.state.selectedRowsForTable.Date, 'YYYY-MM-DD HH:mm:ss', false)}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}
//added by salim dt:09/02/2019
WithdrawalReport.defaultProps = {
    componentTlt: "walletDashboard.WithdrawalReport",
    BreadCrumbData: BreadCrumbData
}

const mapDispatchToProps = ({ withdrawalReportReducer, superAdminReducer, walletUsagePolicy, actvHstrRdcer, drawerclose, authTokenRdcer }) => {
    // breadcrumb 
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { withdrawalReportData, TotalCount, withdrawalResponce, loading } = withdrawalReportReducer;
    const { organizationList } = superAdminReducer;
    const { walletType } = walletUsagePolicy;
    const { getUser } = actvHstrRdcer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { organizationList, TotalCount, withdrawalReportData, withdrawalResponce, walletType, loading, getUser, drawerclose, menuLoading, menu_rights };
};

export default connect(mapDispatchToProps, {
    getOrgList,
    getWithdrawalReport,
    getWalletType,
    getUserDataList,
    getMenuPermissionByID
})(injectIntl(WithdrawalReport));