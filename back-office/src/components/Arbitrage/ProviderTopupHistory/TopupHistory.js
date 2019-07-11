/*
    Developer : Parth Andhariya
    Date : 10-06-2019
    File Comment :  Topup History list
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import MUIDataTable from "mui-datatables";
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import Button from "@material-ui/core/Button";
import { Form, FormGroup, Label, Input } from 'reactstrap';
import Drawer from "rc-drawer";
import { ListTopupHistory } from "Actions/Arbitrage/ProviderTopupHistory";
import validator from "validator";
import { injectIntl } from 'react-intl';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { NotificationManager } from 'react-notifications';
import { CustomFooter } from "Components/MyAccount/Dashboards/Widgets";
import classnames from "classnames";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import AppConfig from 'Constants/AppConfig';
import TopupRequestForm from './TopupRequestForm';
import { ListArbitrageCurrency } from 'Actions/Arbitrage/ArbitrageCurrencyConfiguration';
import { listServiceProvider } from 'Actions/ServiceProvider';
import { changeDateFormat } from "Helpers/helpers";
const components = {
    TopupRequestForm: TopupRequestForm,
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
        title: <IntlMessages id="sidebar.Arbitrage" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="lable.TopupHistory" />,
        link: '',
        index: 1
    },
];
const initState = {
    menudetail: [],
    notificationFlag: true,
    componentName: '',
    open: false,
    Page: 1,
    PageSize: AppConfig.totalRecordDisplayInList,
    TotalCount: 0,
    FromDate: "",
    ToDate: "",
    Status: "",
    showReset: false,
    CoinName: '',
    Today: new Date().toISOString().slice(0, 10),
    FromServiceProviderId: "",
    ToServiceProviderId: "",
    Address: "",
    TrnId: "",
    ProviderList: []
}
// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, getListFromServer) => {
    return React.createElement(components[TagName], {
        props,
        drawerClose,
        closeAll,
        getListFromServer
    });
};
class TopupHistory extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }
    //Get List From Server API...
    getListFromServer = (Page, PageSize) => {
        var newObj = Object.assign({}, this.state);
        newObj['Page'] = Page > 0 ? Page : this.state.Page;
        newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.PageSize;
        this.setState(newObj);
        //For Action API...
        var reqObj = newObj;
        reqObj.Page = Page > 0 ? Page - 1 : 1;
        delete reqObj.menudetail;
        delete reqObj.notificationFlag;
        delete reqObj.open;
        delete reqObj.componentName;
        delete reqObj.Today;
        delete reqObj.showReset;
        this.props.ListTopupHistory(reqObj);
    };
    //Pagination Change Method...   
    handlePageChange = (pageNumber) => {
        this.getListFromServer(pageNumber);
    }
    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getListFromServer(1, event.target.value);
    }
    //Apply Filter option
    applyFilter = () => {
        if ((this.state.FromDate !== '' && this.state.ToDate !== '') || this.state.Status !== '' || this.state.FromServiceProviderId !== '' || this.state.ToServiceProviderId !== '' || this.state.Address !== '' || this.state.TrnId !== '' || this.state.CoinName !== '') {
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
        if (key === "TrnId" || key === "FromServiceProviderId" || key === "ToServiceProviderId") {
            if ((validator.isNumeric(e.target.value, { no_symbols: true })) || e.target.value === "") {
                this.setState({ [key]: e.target.value });
            }
        } else if (key === "Address") {
            if (validator.isAlphanumeric(e.target.value) || e.target.value === "") {
                this.setState({ [key]: e.target.value });
            }
        } else {
            this.setState({ [key]: e.target.value });
        }
    }

    closeAll = () => {
        this.props.closeAll();
    };
    //handle cancel 
    close = () => {
        this.setState({
            open: false
        });
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('DB0F1779-16DA-41DB-9C51-746C84D47987'); // get wallet menu permission
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.listServiceProvider({ IsArbitrage: 1 });
                this.props.ListArbitrageCurrency({});
                this.getListFromServer(this.state.Page, this.state.PageSize);
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }
        if (this.state.ProviderList.length === 0) {
            if (nextProps.listServiceProviderData.ReturnCode === 0 && nextProps.listServiceProviderData !== "undefine") {
                this.setState({
                    ProviderList: nextProps.listServiceProviderData.Response
                })
            }
        }
    }

    //show Component
    showComponent(componentName, menuDetail) {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true
            })
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('A131FA1D-20A8-6DA7-1C27-A050193F631B'); //A131FA1D-20A8-6DA7-1C27-A050193F631B for List
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const intl = this.props.intl;
        const { drawerClose } = this.props;
        const columns = [
            {
                name: intl.formatMessage({ id: "table.Fromprovider" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "table.Toprovider" }),
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
                name: intl.formatMessage({ id: "table.address" }),
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
                name: intl.formatMessage({ id: "lable.status" }),
                options: {
                    sort: true, filter: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <span
                                className={classnames({
                                    "badge badge-danger":
                                        value === 2 ||
                                        value === 3 ||
                                        value === 5,
                                    "badge badge-info":
                                        value === 6 ||
                                        value === 9 ||
                                        value === 0,
                                    "badge badge-warning": value === 4,
                                    "badge badge-success": value === 1,
                                })}
                            >
                                {intl.formatMessage({
                                    id: "Arbitrage.historyStatus." + value,
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
        ];
        const options = {
            filter: false,
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            download: false,
            viewColumns: false,
            serverSide: this.props.TopupList.length !== 0 ? true : false,
            page: this.state.Page,
            rowsPerPage: this.state.PageSize,
            count: this.state.TotalCount,
            search: false,// menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customToolbar: () => {
                if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
                    return (
                        <Button
                            variant="raised"
                            className="btn-primary text-white mt-5 btn-icon"
                            onClick={() => this.showComponent('TopupRequestForm', true)}
                        // onClick={() => this.showComponent('TopupRequestForm', this.checkAndGetMenuAccessDetail('A131FA1D-20A8-6DA7-1C27-A050193F631B').HasField)}// added GUID A43C7826-3757-0EBB-9B6C-3C01AD461B30
                        >
                            <i className="ti-plus" />
                            <span className="icon_btn_fnt_sz"> {intl.formatMessage({ id: "lable.Topup" })}</span>
                        </Button>
                    );
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
            <div className="jbs-page-content" >
                <WalletPageTitle title={<IntlMessages id="lable.TopupHistory" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.props.menuLoading || this.props.loading || this.props.ArbitrageCurrencyloading) && <JbsSectionLoader />
                }
                <div className="StackingHistory">
                    {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && // filter permission check
                        <JbsCollapsibleCard>
                            <div className="top-filter">
                                <Form className="tradefrm row">
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="TrnId"><IntlMessages id="lable.trnId" /></Label>
                                        <Input type="TrnId" name="TrnId" id="TrnId" value={this.state.TrnId} placeholder={intl.formatMessage({ id: "lable.trnId" })} onChange={(e) => this.onChangeHandler(e, 'TrnId')} maxLength={100} />
                                    </FormGroup>
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
                                        <Input type="select" name="CoinName" id="CoinName" value={this.state.CoinName} onChange={(e) => this.onChangeHandler(e, 'CoinName')}>
                                            <option value="">{intl.formatMessage({ id: "wallet.errCurrency" })}</option>
                                            {this.props.ArbitrageCurrencyList.length > 0 &&
                                                this.props.ArbitrageCurrencyList.map((type, index) => (
                                                    <option key={index} value={type.Id}>{type.CoinName}</option>
                                                ))}
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Select-2"><IntlMessages id="lable.FromServiceProviderId" /></Label>
                                        <Input type="select" name="FromServiceProviderId" id="FromServiceProviderId" value={this.state.FromServiceProviderId} onChange={(e) => this.onChangeHandler(e, 'FromServiceProviderId')}  >
                                            <option value="">{intl.formatMessage({ id: "sidebar.pleaseSelect" })}</option>
                                            {this.state.ProviderList.length > 0 &&
                                                this.state.ProviderList.map((type, index) => (
                                                    <option key={index} value={type.Id}>{type.ProviderName}</option>
                                                ))}
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Select-3"><IntlMessages id="lable.ToServiceProviderId" /></Label>
                                        <Input type="select" name="ToServiceProviderId" id="ToServiceProviderId" value={this.state.ToServiceProviderId} onChange={(e) => this.onChangeHandler(e, 'ToServiceProviderId')} >
                                            <option value="">{intl.formatMessage({ id: "sidebar.pleaseSelect" })}</option>
                                            {this.state.ProviderList.length > 0 &&
                                                this.state.ProviderList.map((type, index) => (
                                                    <option key={index} value={type.Id}>{type.ProviderName}</option>
                                                ))}
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Address"><IntlMessages id="table.address" /></Label>
                                        <Input type="Address" name="Address" id="Address" value={this.state.Address} placeholder={intl.formatMessage({ id: "wallet.lblAddress" })} onChange={(e) => this.onChangeHandler(e, 'Address')} maxLength={100} />
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Select-1"><IntlMessages id="widgets.status" /></Label>
                                        <Input type="select" name="status" id="status" value={this.state.Status} onChange={(e) => this.onChangeHandler(e, 'Status')}>
                                            <option value="">{intl.formatMessage({ id: "wallet.lblSelectStatus" })}</option>
                                            <option value="0">{intl.formatMessage({ id: "Arbitrage.historyStatus.0" })} </option>
                                            <option value="1">{intl.formatMessage({ id: "Arbitrage.historyStatus.1" })} </option>
                                            <option value="2">{intl.formatMessage({ id: "Arbitrage.historyStatus.2" })} </option>
                                            <option value="3">{intl.formatMessage({ id: "Arbitrage.historyStatus.3" })} </option>
                                            <option value="4">{intl.formatMessage({ id: "Arbitrage.historyStatus.4" })} </option>
                                            <option value="5">{intl.formatMessage({ id: "Arbitrage.historyStatus.5" })} </option>
                                            <option value="6">{intl.formatMessage({ id: "Arbitrage.historyStatus.6" })} </option>
                                            <option value="9">{intl.formatMessage({ id: "Arbitrage.historyStatus.9" })} </option>
                                            <option value="999">{intl.formatMessage({ id: "Arbitrage.historyStatus.999" })} </option>

                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <div className="btn_area">
                                            <Button
                                                color="primary"
                                                variant="raised"
                                                className="text-white"
                                                onClick={() => this.applyFilter()}
                                                disabled={((this.state.FromDate !== '' && this.state.ToDate !== '') || this.state.Status !== '' || this.state.FromServiceProviderId !== '' || this.state.ToServiceProviderId !== '' || this.state.Address !== '' || this.state.TrnId !== '' || this.state.CoinName !== '') ? false : true}
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
                    <MUIDataTable
                        data={this.props.TopupList.map((item, key) => {
                            return [
                                item.FromServiceProviderId,
                                item.ToServiceProviderId,
                                item.Amount.toFixed(8),
                                item.Address,
                                item.TrnId,
                                item.Status,
                                changeDateFormat(item.TrnDate, 'YYYY-MM-DD HH:mm:ss', false),
                            ];
                        })}
                        columns={columns}
                        options={options} />
                </div>
                <Drawer
                    width={"50%"}
                    handler={false}
                    open={this.state.open}
                    level=".drawer0"
                    className="drawer2 half_drawer"
                    placement="right"
                    levelMove={100}
                >
                    {this.state.componentName !== "" &&
                        dynamicComponent(
                            this.state.componentName,
                            this.props,
                            this.close,
                            this.closeAll,
                            this.getListFromServer
                        )}
                </Drawer>
            </div >
        );
    }
}

const mapDispatchToProps = ({ authTokenRdcer, TopupHistoryReducer, ArbitrageCurrencyConfigurationReducer, ServiceProviderReducer }) => {
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { TopupList, loading } = TopupHistoryReducer;
    const { ArbitrageCurrencyList, ArbitrageCurrencyloading } = ArbitrageCurrencyConfigurationReducer;
    const { listServiceProviderData } = ServiceProviderReducer;
    return { menuLoading, menu_rights, TopupList, loading, ArbitrageCurrencyList, ArbitrageCurrencyloading, listServiceProviderData };
};

export default connect(mapDispatchToProps, {
    getMenuPermissionByID,
    ListTopupHistory,
    ListArbitrageCurrency,
    listServiceProvider,
})(injectIntl(TopupHistory));
