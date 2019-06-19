/* 
    Developer : Nishant Vadgama
    Date : 07-02-2019
    File Comment : Charges collected report
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import { injectIntl } from 'react-intl';
import IntlMessages from "Util/IntlMessages";
import Button from "@material-ui/core/Button";
import { getChargeCollectedReport } from "Actions/ChargesCollected";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { changeDateFormat } from "Helpers/helpers";
import { Form,FormGroup, Label, Input } from "reactstrap";
import { getWalletType } from "Actions/WalletUsagePolicy";
import { getWalletTrnTypes } from "Actions/Wallet";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { CustomFooter } from 'Components/MyAccount/Dashboards/Widgets/CustomFooter';
import AppConfig from 'Constants/AppConfig';
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import validator from "validator";
import classnames from "classnames";
import { NotificationManager } from 'react-notifications';
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
        title: <IntlMessages id="sidebar.chargeCollected" />,
        link: '',
        index: 1
    },
];
const initState = {
    Page: 1,
    PageSize: AppConfig.totalRecordDisplayInList,
    TrnNo: "",
    WalletTypeId: "",
    Status: "",
    TrnTypeID: "",
    SlabType: "",
    TotalCount: 0,
    FromDate: new Date().toISOString().slice(0, 10),
    ToDate: new Date().toISOString().slice(0, 10),
    showReset: false,
    Today: new Date().toISOString().slice(0, 10),
    errFromDate: false,
    errToDate: false,
    menudetail: [],
    notificationFlag: true,
}

class ChargesCollected extends Component {
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
        this.props.getChargeCollectedReport(reqObj);
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('DB8B3999-18DE-8278-25E2-268C3D1312EF'); // get wallet menu permission
    }
    // receive total count
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getWalletType({ Status: 1 });
                this.props.getWalletTrnTypes();
                this.getListFromServer(this.state.Page, this.state.PageSize);
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }
        if (this.state.TotalCount != nextProps.totalCount) {
            this.setState({ TotalCount: nextProps.totalCount });
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
    /* On change handler */
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
    /* apply filter */
    applyFilter() {
        if (this.state.ToDate < this.state.FromDate) {
            this.setState({
                errToDate: true,
                errFromDate: true
            })
        }
        else {
        this.getListFromServer(1, this.state.PageSize);
        this.setState({ Page: 0, showReset: true,errFromDate: false, errToDate: false, });
        }
    }
    /* reset filter and state */
    clearFilter() {
        this.setState(initState, () => this.getListFromServer(this.state.Page, this.state.PageSize));
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
            return response;
        }
    }
    render() {
        /* check menu permission */
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('B0198738-1091-1320-35A4-404B1BBA1420'); //B0198738-1091-1320-35A4-404B1BBA1420
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const intl = this.props.intl;
        const columns = [
            {
                name: intl.formatMessage({ id: "table.trnNo" }),
                options: { sort: false, filter: true }
            },
            {
                name: intl.formatMessage({ id: "table.trnType" }),
                options: { sort: false, filter: true }
            },

            {
                name: intl.formatMessage({ id: "table.Amount" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.Status" }),
                options: { sort: false, filter: true,customBodyRender: (value, tableMeta, updateValue) => {
                    return (<span
                        className={classnames({
                            "badge badge-danger": value === 9,
                            "badge badge-success": (value === 1),
                            "badge badge-info": (value === 6 || value === 0 || value === 5),
                        })}
                    >
                        {this.props.intl.formatMessage({
                            id: "wallet.status." + value,
                        })}
                    </span>)
                } }
            },
            {
                name: intl.formatMessage({ id: "table.charge" }),
                options: { sort: false, filter: true }
            },
            {
                name: intl.formatMessage({ id: "table.DWalletName" }),
                options: { sort: false, filter: true }
            },
            {
                name: intl.formatMessage({ id: "table.OWalletName" }),
                options: { sort: false, filter: true }
            },
            {
                name: intl.formatMessage({ id: "table.DUserName" }),
                options: { sort: false, filter: true }
            },
            {
                name: intl.formatMessage({ id: "table.OUserName" }),
                options: { sort: false, filter: true }
            },
            {
                name: intl.formatMessage({ id: "table.currency" }),
                options: { sort: false, filter: true }
            },
            {
                name: intl.formatMessage({ id: "table.Remarks" }),
                options: { sort: false, filter: true }
            },
            {
                name: intl.formatMessage({ id: "table.date" }),
                options: { sort: false, filter: true }
            }
        ];
        const options = {
            filterType: "multiselect",
            responsive: "scroll",
            selectableRows: false,
            download: false,
            viewColumns: false,
            filter: false,
            print: false,
            serverSide: this.props.chargesData.length === 0 ? false : true,
            page: this.state.Page,
            rowsPerPage: this.state.PageSize,
            count: this.state.TotalCount,
            search: false,// menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
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
        };
        return (
            <div className="jbs-page-content drawer-data">
            {this.props.menuLoading && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="sidebar.chargeCollected" />} breadCrumbData={BreadCrumbData} drawerClose={this.props.drawerClose} closeAll={this.props.closeAll} />
                {menuPermissionDetail.Utility.indexOf('18736530') !== -1 &&
                    <JbsCollapsibleCard>
                        <div className="top-filter">
                                <Form className="tradefrm row">
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="startDate">
                                            {intl.formatMessage({ id: "widgets.startDate" })}
                                        </Label>
                                        <Input
                                            type="date"
                                            name="FromDate"
                                            id="FromDate"
                                            value={this.state.FromDate}
                                            onChange={e => this.onChangeHandler(e)}
                                            max={this.state.Today}
                                        />
                                        {this.state.errFromDate && (
                                        <span className="text-danger">
                                        {intl.formatMessage({ id: "wallet.invalidDate" })}
                                        </span>
                                        )}
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="endDate">
                                            {intl.formatMessage({ id: "widgets.endDate" })}
                                        </Label>
                                        <Input
                                            type="date"
                                            name="ToDate"
                                            id="ToDate"
                                            value={this.state.ToDate}
                                            onChange={e => this.onChangeHandler(e)}
                                            max={this.state.Today}
                                        />
                                        {this.state.errToDate && (
                                        <span className="text-danger">
                                        {intl.formatMessage({ id: "wallet.invalidDate" })}
                                        </span>
                                        )}
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="endDate">
                                            {intl.formatMessage({ id: "tradingLedger.filterLabel.trnNo" })}
                                        </Label>
                                        <Input
                                            type="text"
                                            name="TrnNo"
                                            id="TrnNo"
                                            placeholder={intl.formatMessage({ id: "tradingLedger.filterLabel.trnNo" })}
                                            value={this.state.TrnNo}
                                            onChange={e => this.onChangeHandler(e)}
                                        />
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Select-1">
                                            {intl.formatMessage({ id: "wallet.trnType" })}
                                        </Label>
                                        <Input
                                            type="select"
                                            name="TrnTypeID"
                                            id="TrnTypeID"
                                            value={this.state.TrnTypeID}
                                            onChange={e => this.onChangeHandler(e)}
                                        >
                                            <option value="">{intl.formatMessage({ id: "wallet.errTrnType" })}</option>
                                            {this.props.walletTrnTypes.length && this.props.walletTrnTypes.map((type, index) => (
                                                <option key={index} value={type.TypeId}>{type.TypeName}</option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Select-1">
                                            {intl.formatMessage({ id: "wallet.WalleTypeId" })}
                                        </Label>
                                        <Input
                                            type="select"
                                            name="WalletTypeId"
                                            id="WalletTypeId"
                                            value={this.state.WalletTypeId}
                                            onChange={e => this.onChangeHandler(e)}
                                        >
                                            <option value="">{intl.formatMessage({ id: "wallet.errCurrency" })}</option>
                                            {this.props.walletType.length &&
                                                this.props.walletType.map((type, index) => (
                                                    <option key={index} value={type.ID}>
                                                        {type.TypeName}
                                                    </option>
                                                ))}
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Select-1">
                                            {intl.formatMessage({ id: "wallet.SlabType" })}
                                        </Label>
                                        <Input
                                            type="select"
                                            name="SlabType"
                                            id="SlabType"
                                            value={this.state.SlabType}
                                            onChange={e => this.onChangeHandler(e)}
                                        >
                                            <option value="">{intl.formatMessage({ id: "wallet.selctTrnType" })}</option>
                                            <option value="1">{intl.formatMessage({ id: "wallet.Fixed" })}</option>
                                            <option value="2">{intl.formatMessage({ id: "sidebar.trade.filterLabel.range" })}</option>
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Select-1">
                                            {intl.formatMessage({ id: "wallet.Status" })}
                                        </Label>
                                        <Input
                                            type="select"
                                            name="Status"
                                            id="Status"
                                            value={this.state.Status}
                                            onChange={e => this.onChangeHandler(e)}
                                        >
                                            <option value="">{intl.formatMessage({ id: "wallet.lblSelectStatus" })}</option>
                                            <option value="0">{intl.formatMessage({ id: "wallet.status.0" })}</option>
                                            <option value="1">{intl.formatMessage({ id: "wallet.status.1" })}</option>
                                            <option value="6">{intl.formatMessage({ id: "wallet.status.6" })}</option>
                                            <option value="5">{intl.formatMessage({ id: "wallet.status.5" })}</option>
                                            <option value="9">{intl.formatMessage({ id: "wallet.status.9" })}</option>
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                    <div className="btn_area">
                                        <Button
                                            color="primary"
                                            variant="raised"
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
                        data={this.props.chargesData.map(item => {
                            return [
                                item.TrnNo,
                                item.TrnTypeName,
                                parseFloat(item.Amount).toFixed(8),
                                item.Status,
                                parseFloat(item.Charge).toFixed(8),
                                item.DWalletName,
                                item.OWalletName,
                                item.DUserName,
                                item.OUserName,
                                item.WalletTypeName,
                                item.TrnChargeLogRemarks,
                                changeDateFormat(item.Date, 'YYYY-MM-DD HH:mm:ss', false),
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

const mapStateToProps = ({ chargeCollected, walletUsagePolicy, superAdminReducer,authTokenRdcer }) => {
    const { walletType } = walletUsagePolicy;
    const { walletTrnTypes } = superAdminReducer;
    const { chargesData, loading, totalCount } = chargeCollected;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { chargesData, loading, totalCount, walletType, walletTrnTypes,menuLoading,menu_rights };
};

export default connect(mapStateToProps, {
    getChargeCollectedReport,
    getWalletType,
    getWalletTrnTypes,
    getMenuPermissionByID
})(injectIntl(ChargesCollected));