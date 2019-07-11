/* 
    Developer : Nishant Vadgama
    Date : 01-02-2019
    File Comment : Admin asset report component
*/
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { Form, FormGroup, Label, Input } from "reactstrap";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import IntlMessages from "Util/IntlMessages";
import { injectIntl } from 'react-intl';
import MUIDataTable from "mui-datatables";
import classnames from "classnames";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { getAdminAssetReport } from "Actions/AdminAsset";
import { getWalletType } from "Actions/WalletUsagePolicy";
import AppConfig from 'Constants/AppConfig';
//custom footer from widgets
import { CustomFooter } from "Components/MyAccount/Dashboards/Widgets";
import { NotificationManager } from 'react-notifications';
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';

const initState = {
    PageNo: 1,
    PageSize: AppConfig.totalRecordDisplayInList,
    WalletTypeId: "",
    WalletUsageType: "",
    TotalCount: 0,
    showReset: false,
    menudetail: [],
    notification: true,
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
        title: <IntlMessages id="table.adminAsset" />,
        link: '',
        index: 1
    },
];

class AdminAssetReport extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }
    //will mount fetch data...
    componentWillMount() {
        this.props.getMenuPermissionByID('AAF5A79C-297E-7327-269A-4B8C4FF85BC8'); // get wallet menu permission 
    }
    //Get List From Server API...
    getListFromServer = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.PageNo;
        newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.PageSize;
        this.setState(newObj);
        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        delete reqObj.showReset;
        delete reqObj.TotalCount;
        this.props.getAdminAssetReport(reqObj);
    };
    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.getListFromServer(pageNumber);
    }
    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getListFromServer(1, event.target.value);
    }
    // will receive props update state..
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getWalletType({ Status: 1 });
                this.getListFromServer(this.state.PageNo, this.state.PageSize);
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.setState({ notification: false });
                this.props.drawerClose();
            }
        }
        if (this.state.TotalCount != nextProps.TotalCount) {
            this.setState({ TotalCount: nextProps.TotalCount })
        }
    }
    // close all drawer...
    closeAll = () => {
        this.props.closeAll();
    };
    //onchange handler...
    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    // apply filter 
    applyFilter() {
        if (this.state.WalletTypeId !== '' || this.state.WalletUsageType !== '') {
            this.getListFromServer(1, this.state.PageSize);
            this.setState({ showReset: true });
        }
    }
    //reset filter 
    clearFilter() {
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
        /* check menu permission */
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('BBD84790-3BAA-6C61-7195-0AB2F18A1D84'); //BBD84790-3BAA-6C61-7195-0AB2F18A1D84
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const { intl } = this.props;
        const columns = [
            {
                name: intl.formatMessage({ id: "table.currency" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "wallet.lblUsageType" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.walletName" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.email" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.balance" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.InBoundBalance" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.OutBoundBalance" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.organization" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.status" }),
                options: {
                    sort: false,
                    filter: false,
                    customBodyRender: (value) => {
                        return (
                            <span className={classnames({
                                "badge badge-danger": (value === intl.formatMessage({ id: "wallet.Inactive" })),
                                "badge badge-success": (value === intl.formatMessage({ id: "wallet.Active" }))
                            })} >
                                {value}
                            </span>
                        );
                    }
                }
            },
        ];
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            download: false,
            viewColumns: false,
            filter: false,
            serverSide: this.props.adminAssetList.length !== 0 ? true : false,
            page: this.state.PageNo,
            rowsPerPage: this.state.PageSize,
            count: this.state.TotalCount,
            search: false,// menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customFooter: (count, page, rowsPerPage) => {
                var tblPage = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter
                        count={count}
                        page={tblPage}
                        rowsPerPage={rowsPerPage}
                        handlePageChange={this.handlePageChange}
                        onChangeRowsPerPage={this.onChangeRowsPerPage}
                    />
                );
            },
        };
        const { drawerClose } = this.props;
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="table.adminAsset" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="StackingHistory">
                    {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                    {menuPermissionDetail.Utility.indexOf('18736530') !== -1 &&
                        <JbsCollapsibleCard>
                            <div className="top-filter">
                                <Form className="tradefrm row">
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="WalletTypeId"><IntlMessages id="table.currency" /></Label>
                                        <Input type="select" name="WalletTypeId" id="WalletTypeId" value={this.state.WalletTypeId} onChange={(e) => this.onChangeHandler(e)}>
                                            <option value="">{intl.formatMessage({ id: "wallet.errCurrency" })}</option>
                                            {this.props.walletType.length > 0 && this.props.walletType.map((type, index) => (
                                                <option key={index} value={type.ID}>{type.TypeName}</option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="WalletUsageType"><IntlMessages id="wallet.lblUsageType" /></Label>
                                        <Input type="select" name="WalletUsageType" id="WalletUsageType" value={this.state.WalletUsageType} onChange={(e) => this.onChangeHandler(e)}>
                                            <option value="">{intl.formatMessage({ id: "wallet.lblSelectUsageType" })}</option>
                                            <option value="0">{intl.formatMessage({ id: "wallet.lblTradingWallet" })}</option>
                                            <option value="1">{intl.formatMessage({ id: "wallet.lblMarketWallet" })}</option>
                                            <option value="2">{intl.formatMessage({ id: "wallet.lblColdWallet" })}</option>
                                            <option value="3">{intl.formatMessage({ id: "wallet.lblChargeWallet" })}</option>
                                            <option value="4">{intl.formatMessage({ id: "wallet.lblDepositionAdminWallet" })}</option>
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <div className="btn_area">
                                            <Button
                                                color="primary"
                                                variant="raised"
                                                className="text-white"
                                                onClick={() => this.applyFilter()}
                                                disabled={(this.state.WalletTypeId !== '' || this.state.WalletUsageType !== '') ? false : true}
                                            ><IntlMessages id="widgets.apply" /></Button>
                                            {this.state.showReset &&
                                                <Button className="btn-danger text-white ml-10" onClick={(e) => this.clearFilter()}>
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
                        title={this.props.title}
                        data={this.props.adminAssetList.map(item => {
                            return [
                                item.WalletTypeName,
                                item.StrWalletUsageType,
                                item.WalletName,
                                item.Email,
                                parseFloat(item.Balance).toFixed(8),
                                parseFloat(item.InBoundBalance).toFixed(8),
                                parseFloat(item.OutBoundBalance).toFixed(8),
                                item.OrganizationName,
                                item.Status ? intl.formatMessage({ id: "wallet.Active" }) : intl.formatMessage({ id: "wallet.Inactive" }),
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

const mapStateToProps = ({ adminAssetReport, walletUsagePolicy, authTokenRdcer }) => {
    const { walletType } = walletUsagePolicy;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { loading, TotalCount, adminAssetList } = adminAssetReport;
    return { loading, TotalCount, adminAssetList, walletType, menuLoading, menu_rights };
};

export default connect(mapStateToProps, {
    getAdminAssetReport,
    getWalletType,
    getMenuPermissionByID
})(injectIntl(AdminAssetReport));
