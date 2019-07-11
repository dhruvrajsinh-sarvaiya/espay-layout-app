/* 
    Developer : Nishant Vadgama
    Date : 31-01-2019
    File Comment : Deposit Routing Component
*/
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { Form, FormGroup, Label, Input } from "reactstrap";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import Drawer from "rc-drawer";
import "rc-drawer/assets/index.css";
import IntlMessages from "Util/IntlMessages";
import { injectIntl } from 'react-intl';
import classnames from "classnames";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import MUIDataTable from "mui-datatables";
import { changeDateFormat } from "Helpers/helpers";
import DepositRouteForm from "Components/DepositRoute/DepositRouteForm";
import AddDepositRoute from "Components/DepositRoute/AddDepositRoute";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { CustomFooter } from "Components/MyAccount/Dashboards/Widgets";
import AppConfig from 'Constants/AppConfig';
import { NotificationManager } from 'react-notifications';
import MatButton from "@material-ui/core/Button";
import {
    getDepositRouteList,
    removeDepositRoute
} from "Actions/DepositRoute";
import {
    getServiceProviderList,
} from "Actions/LiquidityManager";
import {
    getWalletType
} from "Actions/WalletUsagePolicy";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount'
const initState = {
    routeId: 0,
    open: false,
    PageNo: 1,
    PageSize: AppConfig.totalRecordDisplayInList,
    TotalCount: 0,
    WalletTypeID: "",
    SerProId: "",
    showReset: false,
    pagedata: {},
    showDialog: false,
    componentName: "",
    menudetail: [],
    notification: true,
}
const components = {
    AddDepositRoute: AddDepositRoute,
    DepositRouteForm: DepositRouteForm,
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
        title: <IntlMessages id="sidebar.depositRoute" />,
        link: '',
        index: 1
    },
];
// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, pagedata) => {
    return React.createElement(components[TagName], {
        props,
        drawerClose,
        closeAll,
        pagedata,
    });
};

class DepositRoute extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
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
        this.props.getDepositRouteList(reqObj);
    };
    //component will mount fetch raw data...
    componentWillMount() {
        this.props.getMenuPermissionByID('1C82E227-2AC0-57F0-0A1B-608EAF999DBB'); // get wallet menu permission
    }
    // will receive props update state..
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.getListFromServer(this.state.PageNo, this.state.PageSize);
                this.props.getWalletType({ Status: 1 });
                this.props.getServiceProviderList({});
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notification: false });
        }
        if (this.state.TotalCount != nextProps.TotalCount) {
            this.setState({ TotalCount: nextProps.TotalCount })
        }
        // validate remove response
        if (nextProps.removeResponse.hasOwnProperty("ReturnCode")) {
            if (nextProps.removeResponse.ReturnCode === 0) {     //success
                NotificationManager.success(<IntlMessages id={"common.form.delete.success"} />);
                setTimeout(function () {
                    this.getListFromServer(1, this.state.PageSize);
                }.bind(this), 3000);
            } else if (nextProps.removeResponse.ReturnCode !== 0) {     //failed
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.removeResponse.ErrorCode}`} />);
            }
        }
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
            })
        }
    }
    // force closed drawer...
    onClose = () => {
        this.setState({
            open: false,
            pagedata: {}
        });
    };
    // close all drawer...
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            pagedata: {}
        });
    };
    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.getListFromServer(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getListFromServer(1, event.target.value);
    };
    // set component and open drawer
    showComponent = (componentName, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                open: true,
                pagedata: {},
                componentName: componentName,
                // menuDetail:menuDetail
            });
        }
        else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    // apply filter 
    applyFilter() {
        if (this.state.WalletTypeID !== '' || this.state.SerProId !== '') {
            this.getListFromServer(1, this.state.PageSize);
            this.setState({ showReset: true, PageNo: 0 });
        }
    }
    //reset filter 
    clearFilter() {
        this.setState({ ...initState, menudetail: this.state.menudetail }, () => this.getListFromServer(this.state.PageNo, this.state.PageSize));
    }
    // onchange filter options
    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    // on edit row data...
    onEditDepositRoute(item, menuDetail) {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({ open: true, componentName: 'DepositRouteForm', pagedata: item });
        } else {
            NotificationManager.error(<IntlMessages id={'error.permission'} />);
        }
    }
    // remove ...
    onDelete = () => {
        this.setState({ showDialog: false })
        if (this.state.routeId) {
            this.props.removeDepositRoute(this.state.routeId);
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('82603087-9747-4497-2155-5AEBB39E8808'); //C6C67C0E-6FB3-74A7-A742-05F5AA1067FF
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const { drawerClose, intl } = this.props;
        const columns = [
            {
                name: intl.formatMessage({ id: "sidebar.colId" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.currency" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "wallet.lblProvider" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "wallet.lblRecCount" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.status" }),
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value) => {
                        return (
                            <span className={classnames({
                                "badge badge-danger": (value === intl.formatMessage({ id: "sidebar.btnDisable" })),
                                "badge badge-success": (value === intl.formatMessage({ id: "sidebar.btnEnable" }))
                            })} >
                                {value}
                            </span>
                        );
                    }
                }
            },
            {
                name: intl.formatMessage({ id: "wallet.feeLimit" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "wallet.lblMaxLimit" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "sidebar.colUpdatedDt" }),
                options: { sort: true, filter: false }
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
            download: false,
            viewColumns: false,
            filter: false,
            print: false,
            search: false,
            serverSide: this.props.depositRouteList.length !== 0 ? true : false,
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
                if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
                    return (
                        <MatButton
                            variant="raised"
                            className="btn-primary text-white"
                            onClick={() => this.showComponent("AddDepositRoute", this.checkAndGetMenuAccessDetail('82603087-9747-4497-2155-5AEBB39E8808').HasChild //59E1F282-6D9A-4195-7F1C-4A86BF7D1E15
                            )}
                        >
                            <IntlMessages id="button.addNew" />
                        </MatButton>
                    );
                } else {
                    return false;
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
                <WalletPageTitle title={<IntlMessages id="sidebar.depositRoute" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="StackingHistory">
                    {this.props.loading && <JbsSectionLoader />}
                    {menuPermissionDetail.Utility.indexOf('18736530') !== -1 &&
                        <JbsCollapsibleCard>
                            <div className="top-filter">
                                <Form className="tradefrm row">
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="SerProId"><IntlMessages id="liquidityprovider.list.option.label.serviceprovider" /></Label>
                                        <Input type="select" name="SerProId" id="SerProId" value={this.state.SerProId} onChange={(e) => this.onChangeHandler(e)}>
                                            <option value="">{intl.formatMessage({ id: "sidebar.apiConfAddGen.apiProvider.selectProvider" })}</option>
                                            {this.props.serviceProvider.length > 0 && this.props.serviceProvider.map((item, key) => (
                                                <option value={item.Id} key={key}>{item.ProviderName}</option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="WalletTypeID"><IntlMessages id="table.currency" /></Label>
                                        <Input type="select" name="WalletTypeID" id="WalletTypeID" value={this.state.WalletTypeID} onChange={(e) => this.onChangeHandler(e)}>
                                            <option value="">{intl.formatMessage({ id: "wallet.errCurrency" })}</option>
                                            {this.props.walletType.length > 0 && this.props.walletType.map((type, index) => (
                                                <option key={index} value={type.ID}>{type.TypeName}</option>
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
                                                disabled={(this.state.WalletTypeID !== '' || this.state.SerProId !== '') ? false : true}
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
                        data={this.props.depositRouteList.map((item, index) => {
                            return [
                                item.Id,
                                item.WalletTypeName,
                                item.SerProName,
                                item.RecordCount,
                                item.Status ? intl.formatMessage({ id: "sidebar.btnEnable" }) : intl.formatMessage({ id: "sidebar.btnDisable" }),
                                item.Limit,
                                item.MaxLimit,
                                changeDateFormat(item.UpdatedDate, 'YYYY-MM-DD', false),
                                <div className="list-action">
                                    {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 &&
                                        <a
                                            className="mr-10"
                                            href="javascript:void(0)"
                                            onClick={() => this.onEditDepositRoute(item, this.checkAndGetMenuAccessDetail('82603087-9747-4497-2155-5AEBB39E8808').HasChild)} //236A2DBF-9E95-2463-2DB3-1E04120D1611
                                        >
                                            <i className="ti-pencil" />
                                        </a>
                                    }
                                    {menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 &&
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.setState({ showDialog: true, routeId: item.Id })}
                                        >
                                            <i className="ti-close" />
                                        </a>
                                    }
                                </div>
                            ];
                        })}
                        columns={columns}
                        options={options}
                    />
                </div>
                <Drawer
                    width="40%"
                    handler={false}
                    open={this.state.open}
                    className="drawer2 half_drawer"
                    level=".drawer0"
                    placement="right"
                    levelMove={100}
                >
                    {this.state.componentName !== "" &&
                        dynamicComponent(
                            this.state.componentName,
                            this.props,
                            this.onClose,
                            this.closeAll,
                            this.state.pagedata,
                        )}
                </Drawer>
                <Dialog
                    style={{ zIndex: '99999' }}
                    open={this.state.showDialog}
                    onClose={() => this.setState({ showDialog: false })}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        <IntlMessages id="global.delete.message" />
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={() => this.onDelete()} className="btn-primary text-white" autoFocus>
                            <IntlMessages id="button.yes" />
                        </Button>
                        <Button onClick={() => this.setState({ showDialog: false })} className="btn-danger text-white">
                            <IntlMessages id="sidebar.btnNo" />
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

const mapStateToProps = ({ DepositRouteReducer, walletUsagePolicy, liquidityManager, drawerclose, authTokenRdcer }) => {
    // breadcrumb 
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { loading, depositRouteList, TotalCount, removeResponse } = DepositRouteReducer;
    const { walletType } = walletUsagePolicy;
    const { serviceProvider } = liquidityManager;
    return { loading, depositRouteList, TotalCount, removeResponse, walletType, serviceProvider, drawerclose, menuLoading, menu_rights };
};

export default connect(mapStateToProps, {
    getDepositRouteList,
    getServiceProviderList,
    getWalletType,
    removeDepositRoute,
    getMenuPermissionByID
})(injectIntl(DepositRoute));
