import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import MUIDataTable from "mui-datatables";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import Button from "@material-ui/core/Button";
import { getOrgList } from "Actions/Wallet";
import { getTransferIn } from "Actions/TransferIn";
import { getWalletType } from "Actions/WalletUsagePolicy";
import { FormGroup, Label, Input, Row, Form } from 'reactstrap';
import { getUserDataList } from "Actions/MyAccount";
import Select from "react-select";
import { injectIntl } from 'react-intl';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { CustomFooter } from 'Components/MyAccount/Dashboards/Widgets/CustomFooter';
import AppConfig from 'Constants/AppConfig';
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import { NotificationManager } from 'react-notifications';
import validator from "validator";
//Action methods..
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
        title: <IntlMessages id="walletDashboard.transferIn" />,
        link: '',
        index: 1
    },
];
const initState = {
    Page: 1,
    PageSize: AppConfig.totalRecordDisplayInList,
    TotalCount: 0,
    UserId: "",
    UserLabel: null,
    Address: "",
    TrnID: "",
    OrgId: "",
    WalletType: "",
    showReset: false,
    flag: false,
    menudetail: [],
    notificationFlag: true,
}

class TransferIn extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
        this.handlePageChange = this.handlePageChange.bind(this);
    }
    closeAll = () => {
        this.props.closeAll();
    };
    getListFromServer = (Page, PageSize) => {
        var newObj = Object.assign({}, this.state);
        newObj['Page'] = Page > 0 ? Page : this.state.Page;
        if (PageSize > 0) {
            newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.PageSize;
        }
        this.setState(newObj);
        //For Action API...
        var reqObj = newObj;
        delete reqObj.flag;
        delete reqObj.showReset;
        reqObj.Page = Page > 0 ? Page - 1 : 1;
        this.props.getTransferIn(reqObj);
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('818D7B44-3FD3-2DF4-8C2A-0E7280D00260'); // get wallet menu permission
    }
    //Pagination Change Method...
    handlePageChange(pageNumber) {
        this.getListFromServer(pageNumber);
    }
    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getListFromServer(1, event.target.value);
    };
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getOrgList();
                this.props.getWalletType({ Status: 1 });
                this.props.getUserDataList();
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }
        if (nextProps.walletType.length !== 0 && this.state.WalletType === "") {
            var Coin = nextProps.walletType[0].TypeName;
            this.setState({
                WalletType: Coin
            }, () => this.getListFromServer(this.state.Page, this.state.PageSize))
        }
        if (this.state.TotalCount !== nextProps.TotalCount) {
            this.setState({ TotalCount: nextProps.TotalCount })
        }
    }
    //Apply Filter option
    applyFilter = () => {
        if (this.state.WalletType !== "") {
            this.getListFromServer(1, this.state.PageSize);
            this.setState({ showReset: true });
        }
    }
    //clear filter
    clearFilter = () => {
        this.setState({
            ...initState,
            WalletType: this.props.walletType[0].TypeName
        }, () => this.getListFromServer(this.state.Page, this.state.PageSize));
    }
    onChangeHandler(e, key) {
        e.preventDefault();
        if (key === "Address") {
            if (validator.isAlphanumeric(e.target.value) || e.target.value === "") {

                this.setState({ [key]: e.target.value });
            }
        } else if (key === "TrnID") {
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('B56F11A8-1880-6241-1D27-42DD15B629BD'); //B56F11A8-1880-6241-1D27-42DD15B629BD
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const intl = this.props.intl;
        const { drawerClose } = this.props;
        const userlist = this.props.getUser.hasOwnProperty('GetUserData') ? this.props.getUser.GetUserData : [];
        const columns = [
            {
                name: intl.formatMessage({ id: "wallet.lblSr" }),
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
                name: intl.formatMessage({ id: "table.Amount" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "table.ConfirmationCount" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "table.OrnType" }),
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
            selectableRows: false,
            serverSide: this.props.transferInData.length !== 0 ? true : false,
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
                var page = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
        };
        return (
            <div className="jbs-page-content">
                {this.props.menuLoading && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="walletDashboard.transferIn" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="StackingHistory">
                    {menuPermissionDetail.Utility.indexOf('18736530') !== -1 &&
                        <JbsCollapsibleCard>
                            <div className="top-filter">
                                <Form className="tradefrm row">
                                    <FormGroup className="col-md-2 col-sm-4 r_sel_20">
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
                                        <Label for="Address"><IntlMessages id="wallet.Address" /></Label>
                                        <Input type="text" name="Address" id="Address" placeholder={intl.formatMessage({ id: "wallet.lblAddress" })} value={this.state.Address} onChange={(e) => this.onChangeHandler(e, 'Address')} maxLength={50} />
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="TrnID"><IntlMessages id="lable.trnId" /></Label>
                                        <Input type="text" name="TrnID" id="TrnID" placeholder={intl.formatMessage({ id: "lable.trnId" })} value={this.state.TrnID} onChange={(e) => this.onChangeHandler(e, 'TrnID')} maxLength={50} />
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="OrnId"><IntlMessages id="table.organization" /></Label>
                                        <Input type="select" name="OrgId" id="OrgId" value={this.state.OrgId} onChange={(e) => this.onChangeHandler(e, 'OrgId')}>
                                            <IntlMessages id="table.organization">
                                                {(optionValue) =>
                                                    <option value="">{optionValue}</option>
                                                }
                                            </IntlMessages>
                                            {this.props.organizationList.hasOwnProperty("Organizations") &&
                                                this.props.organizationList.Organizations.length &&
                                                this.props.organizationList.Organizations.map((org, index) => (
                                                    <option key={index} value={org.OrgID}>{org.OrgName}</option>
                                                ))}
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Select-1"><IntlMessages id="table.currency" /></Label>
                                        <Input type="select" name="walletType" id="walletType" value={this.state.WalletType} onChange={(e) => this.onChangeHandler(e, 'WalletType')}>
                                            <option value="">{intl.formatMessage({ id: "wallet.errCurrency" })}</option>
                                            {this.props.walletType.length &&
                                                this.props.walletType.map((type, index) => (
                                                    <option key={index} value={type.TypeName}>{type.TypeName}</option>
                                                ))}
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <div className="btn_area">
                                            <Button color="primary" variant="raised" className="text-white" onClick={() => this.applyFilter()} disabled={this.state.WalletType !== "" ? false : true}><IntlMessages id="widgets.apply" /></Button>
                                            {this.state.showReset &&
                                                <Button className="btn-danger text-white ml-15" onClick={(e) => this.clearFilter()}>
                                                    <IntlMessages id="bugreport.list.dialog.button.clear" />
                                                </Button>}
                                        </div>
                                    </FormGroup>
                                </Form>
                            </div>
                        </JbsCollapsibleCard>
                    }
                    {this.props.loading && <JbsSectionLoader />}
                    <MUIDataTable
                        data={this.props.transferInData.map((item, key) => {
                            var ExplorerLink = (item.hasOwnProperty('ExplorerLink')) ? JSON.parse(item.ExplorerLink) : '';
                            return [
                                item.AutoNo,
                                <a href={(ExplorerLink.length) ? ExplorerLink[0].Data + '/' + item.TrnID : item.TrnID} target="_blank">{item.TrnID}</a>,
                                item.WalletType,
                                item.Address,
                                item.UserName,
                                parseFloat(item.Amount).toFixed(8),
                                item.ConfirmationCount,
                                item.OrganizationName
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

const mapDispatchToProps = ({ transferInReducer, superAdminReducer, walletUsagePolicy, actvHstrRdcer, authTokenRdcer }) => {
    const { transferInData, TotalCount, loading } = transferInReducer;
    const { organizationList } = superAdminReducer;
    const { walletType } = walletUsagePolicy;
    const { getUser } = actvHstrRdcer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { organizationList, TotalCount, transferInData, walletType, loading, getUser, menuLoading, menu_rights };
};

export default connect(mapDispatchToProps, {
    getOrgList,
    getTransferIn,
    getWalletType,
    getUserDataList,
    getMenuPermissionByID
})(injectIntl(TransferIn));
