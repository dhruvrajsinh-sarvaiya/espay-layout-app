/* 
    Developer : Nishant Vadgama
    Date : 19-09-2018
    File Comment : Admin Daemon Address List
*/
import React, { Component } from "react";
import { connect } from "react-redux";
// Import component for internationalization
import IntlMessages from "Util/IntlMessages";
import MUIDataTable from "mui-datatables";
// Preloader show before data rendering
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import ImportDaemonAddresses from "Components/DaemonAddress/ImportDaemonAddresses";
import ExportDaemonAddresses from "Components/DaemonAddress/ExportDaemonAddresses";
import { getDaemonAddresses } from "Actions/DaemonAddresses";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import Button from "@material-ui/core/Button";
import { injectIntl } from 'react-intl';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { getWalletType } from "Actions/WalletUsagePolicy";
import Select from "react-select";
import { getUserDataList } from "Actions/MyAccount";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { CustomFooter } from 'Components/MyAccount/Dashboards/Widgets/CustomFooter';
import AppConfig from 'Constants/AppConfig';
import validator from "validator";
import { NotificationManager } from 'react-notifications';
import {
    getServiceProviderList,
} from "Actions/LiquidityManager";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
const initState = {
    open: false,
    PageNo: 1,
    PageSize: AppConfig.totalRecordDisplayInList,
    TotalCount: 0,
    ServiceProviderID: "",
    UserID: "",
    UserLabel: null,
    WalletTypeID: "",
    Address: "",
    showReset: false,
    menudetail: [],
    notificationFlag: true,
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
        title: <IntlMessages id="sidebar.wallet" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="wallet.DATitle" />,
        link: '',
        index: 1
    },
];

class DaemonAddressList extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
        this.handlePageChange = this.handlePageChange.bind(this);
    }
    getListFromServer = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.PageNo;
        newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.PageSize;
        this.setState(newObj);
        //For Action API...
        var reqObj = newObj;
        delete reqObj.open;
        delete reqObj.showReset;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        this.props.getDaemonAddresses(reqObj);
    }
    // fetch data before load
    componentWillMount() {
        this.props.getMenuPermissionByID('A76AC6EA-38F3-46C5-50EE-DC7F99598E37'); // get wallet menu permission
    }
    // fetch response and set total count
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getWalletType({ Status: 1 });
                this.props.getUserDataList();
                this.props.getServiceProviderList({});
                this.getListFromServer(this.state.PageNo, this.state.PageSize);
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }
        if (this.state.TotalCount != nextProps.TotalCount) {
            this.setState({ TotalCount: nextProps.TotalCount })
        }
    }
    // close all drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false
        });
    };
    //on change filter option handler
    onChangeHandler(e) {
        if (e.target.name === "Address") {
            if (validator.isAlphanumeric(e.target.value) || e.target.value === "") {
                this.setState({ [e.target.name]: e.target.value });
            }
        } else {
            this.setState({ [e.target.name]: e.target.value });
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
    // apply filter 
    applyFilter() {
        if (this.state.ServiceProviderID !== '' || this.state.UserID !== '' || this.state.WalletTypeID !== '' || this.state.Address !== '') {
            this.getListFromServer(1, this.state.PageSize);
            this.setState({ showReset: true, PageNo: 0 });
        }
    }
    //reset filter 
    clearFilter() {
        this.setState(initState, () => this.getListFromServer(this.state.PageNo, this.state.PageSize));
    }
    //onchange select user
    onChangeSelectUser(e) {
        this.setState({ UserID: e.value, UserLabel: { label: e.label } });
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('FE56BBE3-6B14-7030-32BA-A4D5EFA58D48'); //FE56BBE3-6B14-7030-32BA-A4D5EFA58D48
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const intl = this.props.intl;
        const { drawerClose } = this.props;
        const userlist = this.props.getUser.hasOwnProperty('GetUserData') ? this.props.getUser.GetUserData : [];
        const columns = [
            {
                name: intl.formatMessage({ id: "wallet.lblLabel" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "table.walletType" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "wallet.lblAddress" }),
                options: { filter: false, sort: false }
            },
            {
                name: intl.formatMessage({ id: "liquidityprovider.list.option.label.serviceprovider" }),
                options: { filter: true, sort: true }
            },
            {
                name: intl.formatMessage({ id: "table.email" }),
                options: { filter: true, sort: true }
            },
            {
                name: intl.formatMessage({ id: "language.isdefault" }),
                options: { filter: true, sort: true }
            }
        ];
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            filter: false,
            sort: false,
            search: false,// menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            download: false,
            downloadOptions: { filename: 'daemonAddress.csv' },
            print: false,
            viewColumns: false,
            serverSide: this.props.addresses.length !== 0 ? true : false,
            page: this.state.PageNo,
            rowsPerPage: this.state.PageSize,
            count: this.state.TotalCount,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customToolbar: () => {
                return <React.Fragment>
                    {menuPermissionDetail.Utility.indexOf('8B92994B') !== -1 && <ImportDaemonAddresses {...this.props} />}
                    {menuPermissionDetail.Utility.indexOf('D42A3D17') !== -1 && <ExportDaemonAddresses {...this.props} />}
                </React.Fragment>;
            },
            customFooter: (count, page, rowsPerPage) => {
                var pages = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={pages} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
        };
        return (
            <div className="jbs-page-content">
                {this.props.menuLoading && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="wallet.DATitle" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="StackingHistory">
                    {this.props.loading && <JbsSectionLoader />}
                    {menuPermissionDetail.Utility.indexOf('18736530') !== -1 &&
                        <JbsCollapsibleCard>
                            <div className="top-filter">
                                <Form className="tradefrm row">
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="ServiceProviderID"><IntlMessages id="liquidityprovider.list.option.label.serviceprovider" /></Label>
                                        <Input type="select" name="ServiceProviderID" id="ServiceProviderID" value={this.state.ServiceProviderID} onChange={(e) => this.onChangeHandler(e)}>
                                            <option value="">{intl.formatMessage({ id: "sidebar.apiConfAddGen.apiProvider.selectProvider" })}</option>
                                            {this.props.serviceProvider.length > 0 && this.props.serviceProvider.map((item, key) => (
                                                <option value={item.Id} key={key}>{item.ProviderName}</option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4 r_sel_20">
                                        <Label for="UserID"><IntlMessages id="wallet.lblUserId" /></Label>
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
                                        <Label for="WalletTypeID"><IntlMessages id="table.walletType" /></Label>
                                        <Input type="select" name="WalletTypeID" id="WalletTypeID" value={this.state.WalletTypeID} onChange={(e) => this.onChangeHandler(e)}>
                                            <option value="">{intl.formatMessage({ id: "wallet.selectWalletType" })}</option>
                                            {this.props.walletType.length > 0 && this.props.walletType.map((type, index) => (
                                                <option key={index} value={type.ID}>{type.TypeName}</option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Address"><IntlMessages id="wallet.lblAddress" /></Label>
                                        <Input type="text" name="Address" id="Address" placeholder={intl.formatMessage({ id: "wallet.lblAddress" })} value={this.state.Address} onChange={(e) => this.onChangeHandler(e)} />
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <div className="btn_area">
                                            <Button
                                                color="primary"
                                                variant="raised"
                                                className="text-white"
                                                onClick={() => this.applyFilter()}
                                                disabled={(this.state.ServiceProviderID !== '' || this.state.UserID !== '' || this.state.WalletTypeID !== '' || this.state.Address !== '') ? false : true}
                                            ><IntlMessages id="widgets.apply" /></Button>
                                            {this.state.showReset &&
                                                <Button className="btn-danger text-white ml-10" onClick={(e) => this.clearFilter()}>
                                                    <IntlMessages id="bugreport.list.dialog.button.clear" />
                                                </Button>}
                                        </div>
                                    </FormGroup>
                                </Form>
                            </div>
                        </JbsCollapsibleCard>
                    }
                    <MUIDataTable
                        data={this.props.addresses.map((item, key) => {
                            return [
                                item.AddressLable,
                                item.WalletTypeName,
                                item.Address,
                                item.ServiceProviderName,
                                item.Email,
                                item.IsDefaultAddress ? intl.formatMessage({ id: "sidebar.yes" }) : intl.formatMessage({ id: "sidebar.no" }),
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

const mapDispatchToProps = ({ daemonAddressReducer, walletUsagePolicy, liquidityManager, actvHstrRdcer, authTokenRdcer }) => {
    const { addresses, TotalCount, loading } = daemonAddressReducer;
    const { walletType } = walletUsagePolicy;
    const { serviceProvider } = liquidityManager;
    const { getUser } = actvHstrRdcer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { addresses, TotalCount, walletType, serviceProvider, loading, getUser, menuLoading, menu_rights };
};

export default connect(mapDispatchToProps, {
    getDaemonAddresses,
    getServiceProviderList,
    getWalletType,
    getUserDataList,
    getMenuPermissionByID
})(injectIntl(DaemonAddressList));
