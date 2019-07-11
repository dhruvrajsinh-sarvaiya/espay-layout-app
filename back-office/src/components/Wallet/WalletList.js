/* 
    Developer : Nishant Vadgama
    Date : 18-09-2018
    File Comment : Wallet list file component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import Drawer from "rc-drawer";
import WalletView from "./WalletView";
import "rc-drawer/assets/index.css";
// Import component for internationalization
import IntlMessages from "Util/IntlMessages";
import MUIDataTable from "mui-datatables";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import Button from "@material-ui/core/Button";
import { injectIntl } from 'react-intl';
import Select from "react-select";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { CustomFooter } from "Components/MyAccount/Dashboards/Widgets";
import AppConfig from 'Constants/AppConfig';
import {
    getAllWallets,
    getWalletById,
    getWalletsAuthUserList,
    getOrgList,
} from "Actions/Wallet";
import { getWalletType } from "Actions/WalletUsagePolicy";
import { Form, FormGroup, Label, Input } from 'reactstrap';
import ExportWallets from "Components/Wallet/ExportWallets";
import { getUserDataList } from "Actions/MyAccount";
import { NotificationManager } from "react-notifications";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
const components = {
    WalletView: WalletView
};
// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, pagedata, menuDetail) => {
    return React.createElement(components[TagName], {
        props,
        drawerClose,
        closeAll,
        pagedata,
        menuDetail
    });
};
const initState = {
    open: false,
    componentName: "",
    pagedata: {},
    Page: 1,
    PageSize: AppConfig.totalRecordDisplayInList,
    TotalWallet: 0,
    FromDate: "",
    ToDate: "",
    Status: "",
    UserId: "",
    UserLabel: null,
    OrgId: "",
    WalletType: "",
    showReset: false,
    walletID: '',
    Today: new Date().toISOString().slice(0, 10),
    menudetail: [],
    notification: true,
};

class WalletList extends Component {
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
    showComponent = (componentName, menuDetail, walletID) => {
        // check permission go on next page or not
        if (menuDetail) {
            if (typeof walletID != "undefined" && walletID !== "") {
                this.setState({
                    walletID: walletID
                }, () => {
                    this.props.getWalletById({
                        walletId: walletID
                    });
                    this.props.getWalletsAuthUserList({
                        walletId: walletID
                    });
                })
            }
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
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
        delete reqObj.UserLabel;
        delete reqObj.open;
        delete reqObj.componentName;
        delete reqObj.pagedata;
        delete reqObj.TotalWallet;
        this.props.getAllWallets(reqObj);
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
        this.props.getMenuPermissionByID(this.props.menuDetail ? 'E83F62A6-01F8-4E45-39A7-CB8B38F50223' : '3B9E778F-28E0-98F1-52FE-DAD191245381'); // get wallet menu permission
    }
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.getListFromServer(this.state.Page, this.state.PageSize);
                this.props.getOrgList();
                this.props.getWalletType({ Status: 1 });
                this.props.getUserDataList();
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notification: false });
        }
        if (this.state.TotalWallet != nextProps.TotalWallet) {
            this.setState({ TotalWallet: nextProps.TotalWallet })
        }
        /* drawer close */
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
            })
        }
    }
    //Apply Filter option
    applyFilter = () => {
        if (this.state.FromDate !== '' ||
            this.state.ToDate !== '' ||
            this.state.Status !== '' ||
            this.state.UserId !== '' ||
            this.state.OrgId !== '' ||
            this.state.WalletType !== '') {
            this.getListFromServer(1, this.state.PageSize);
            this.setState({ showReset: true, Page: 0 });
        }
    }
    //clear filter
    clearFilter = () => {
        this.setState({ ...initState }, () => this.getListFromServer(this.state.Page, this.state.PageSize));
    }
    onChangeHandler(e, key) {
        e.preventDefault();
        this.setState({ [key]: e.target.value });
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
        var BreadCrumbData = [];
        if (this.props.TitleBit === 1) {
            BreadCrumbData = [
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
                    title: <IntlMessages id="sidebar.adminPanel" />,
                    link: '',
                    index: 0
                },
                {
                    title: this.props.manageAcc === 1 ? <IntlMessages id="my_account.manageAccount" /> : <IntlMessages id="sidebar.reportsDashboard" />,
                    link: '',
                    index: 1
                },
                {
                    title: <IntlMessages id="wallet.walletTitle" />,
                    link: '',
                    index: 2
                },
            ];
        }
        else {
            BreadCrumbData = [
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
                    title: <IntlMessages id="wallet.walletTitle" />,
                    link: '',
                    index: ''
                },
            ];
        }
        /* check menu permission */
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail(this.props.menuDetail ? 'DB060E19-0938-841B-316C-D5C91910100F' : '85AF8731-2B77-40C2-574D-EC1F4F4A2A87'); //85AF8731-2B77-40C2-574D-EC1F4F4A2A87
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const intl = this.props.intl;
        const { drawerClose } = this.props;
        const userlist = this.props.getUser.hasOwnProperty('GetUserData') ? this.props.getUser.GetUserData : [];
        const columns = [
            {
                name: intl.formatMessage({ id: "table.walletId" }),
                options: { filter: false, sort: false }
            },
            {
                name: intl.formatMessage({ id: "table.walletName" }),
                options: { filter: false, sort: false }
            },
            {
                name: intl.formatMessage({ id: "table.balance" }),
                options: { filter: false, sort: false }
            },
            {
                name: intl.formatMessage({ id: "widgets.user" }),
                options: { filter: false, sort: false }
            },
            {
                name: intl.formatMessage({ id: "table.organization" }),
                options: { filter: false, sort: false }
            },
            {
                name: intl.formatMessage({ id: "table.currency" }),
                options: { filter: false, sort: false }
            },
            {
                name: intl.formatMessage({ id: "table.status" }),
                options: { filter: false, sort: false }
            },
            {
                name: intl.formatMessage({ id: "language.isdefault" }),
                options: { filter: false, sort: false }
            },
            {
                name: intl.formatMessage({ id: "wallet.lblAction" }),
                options: { filter: false, sort: false }
            }
        ];
        const options = {
            filter: false,
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            serverSide: this.props.walletsList.length !== 0 ? true : false,
            page: this.state.Page,
            rowsPerPage: this.state.PageSize,
            count: this.state.TotalWallet,
            print: false,
            download: false,
            viewColumns: false,
            search: false, //menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customToolbar: () => {
                if (menuPermissionDetail.Utility.indexOf('D42A3D17') !== -1) { // check add curd operation
                    return <ExportWallets {...this.props} />;
                } else {
                    return false;
                }
            },
            customFooter: (count, page, rowsPerPage) => {
                var page1 = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter
                        count={count}
                        page={page1}
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
                <WalletPageTitle title={<IntlMessages id="wallet.walletTitle" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="StackingHistory">
                    {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && // filter permission check
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
                                        <Label for="Select-1"><IntlMessages id="widgets.status" /></Label>
                                        <Input type="select" name="status" id="status" value={this.state.Status} onChange={(e) => this.onChangeHandler(e, 'Status')}>
                                            <option value="">{intl.formatMessage({ id: "wallet.lblSelectStatus" })}</option>
                                            <option value="1">{intl.formatMessage({ id: "sidebar.btnEnable" })} </option>
                                            <option value="2">{intl.formatMessage({ id: "sidebar.btnDisable" })} </option>
                                            <option value="3">{intl.formatMessage({ id: "wallet.lblWalletStatusFreeze" })} </option>
                                            <option value="4">{intl.formatMessage({ id: "wallet.lblWalletStatusInoperative" })} </option>
                                            <option value="5">{intl.formatMessage({ id: "wallet.lblWalletStatusSuspended" })} </option>
                                            <option value="6">{intl.formatMessage({ id: "wallet.lblWalletStatusBlocked" })} </option>
                                            <option value="9">{intl.formatMessage({ id: "wallet.lblWalletStatusDeleted" })} </option>
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4 r_sel_20">
                                        <Label for="endDate"><IntlMessages id="wallet.lblUserId" /></Label>
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
                                        <Label for="endDate"><IntlMessages id="table.organization" /></Label>
                                        <Input type="select" name="OrgId" id="OrgId" value={this.state.OrgId} onChange={(e) => this.onChangeHandler(e, 'OrgId')}>
                                            <option value="">{intl.formatMessage({ id: "wallet.lblSelectOrganization" })} </option>
                                            {this.props.organizationList.hasOwnProperty("Organizations") &&
                                                this.props.organizationList.Organizations.length > 0 &&
                                                this.props.organizationList.Organizations.map((org, index) => (
                                                    <option key={index} value={org.OrgID}>{org.OrgName}</option>
                                                ))}
                                        </Input>
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
                                        <div className="btn_area">
                                            <Button
                                                color="primary"
                                                variant="raised"
                                                className="text-white"
                                                onClick={() => this.applyFilter()}
                                                disabled={(this.state.FromDate !== '' ||
                                                    this.state.ToDate !== '' ||
                                                    this.state.Status !== '' ||
                                                    this.state.UserId !== '' ||
                                                    this.state.OrgId !== '' ||
                                                    this.state.WalletType !== '') ? false : true}
                                            ><IntlMessages id="widgets.apply" /></Button>
                                            {this.state.showReset && <Button className="btn-danger text-white ml-15" onClick={(e) => this.clearFilter()}>
                                                <IntlMessages id="bugreport.list.dialog.button.clear" />
                                            </Button>}
                                        </div>
                                    </FormGroup>
                                </Form>
                            </div>
                        </JbsCollapsibleCard>
                    }
                    <div className="StackingHistory">
                        <MUIDataTable
                            data={this.props.walletsList.map((wallet, key) => {
                                return [
                                    wallet.AccWalletID,
                                    wallet.Walletname,
                                    wallet.Balance.toFixed(8),
                                    wallet.UserName,
                                    wallet.OrganizationName,
                                    wallet.WalletTypeName,
                                    wallet.StrStatus,
                                    wallet.IsDefaultWallet ? <IntlMessages id="sidebar.yes" /> : <IntlMessages id="sidebar.no" />,
                                    <div className="list-action">
                                        {menuPermissionDetail.CrudOption.indexOf('6AF64827') !== -1 && // check for view permission
                                            <a
                                                href="javascript:void(0)"
                                                onClick={e => this.showComponent("WalletView", this.checkAndGetMenuAccessDetail(this.props.menuDetail ? 'DB060E19-0938-841B-316C-D5C91910100F' : '85AF8731-2B77-40C2-574D-EC1F4F4A2A87').HasChild, wallet.AccWalletID)} // 85AF8731-2B77-40C2-574D-EC1F4F4A2A87
                                            >
                                                <i className="ti-eye" />
                                            </a>
                                        }
                                    </div>
                                ];
                            })}
                            columns={columns}
                            options={options}
                        />
                    </div>
                    {this.props.loading && <JbsSectionLoader />}
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
                                this.state.walletID,
                                this.props.menuDetail
                            )}
                    </Drawer>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = ({ walletReducer, superAdminReducer, walletUsagePolicy, actvHstrRdcer, drawerclose, authTokenRdcer }) => {
    // breadcrumb 
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { walletsList, TotalWallet, loading } = walletReducer;
    const { organizationList } = superAdminReducer;
    const { walletType } = walletUsagePolicy;
    const { getUser } = actvHstrRdcer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { organizationList, walletsList, TotalWallet, walletType, loading, getUser, drawerclose, menuLoading, menu_rights };
};

export default connect(mapDispatchToProps, {
    getOrgList,
    getAllWallets,
    getWalletById,
    getWalletsAuthUserList,
    getWalletType,
    getUserDataList,
    getMenuPermissionByID
})(injectIntl(WalletList));
