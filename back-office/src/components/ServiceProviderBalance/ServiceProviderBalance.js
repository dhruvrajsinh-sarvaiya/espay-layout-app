/* 
    Developer : Vishva shah
    Date : 15-04-2019
    File Comment : Service Provider balance Component
*/
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { Form, FormGroup, Label, Input } from "reactstrap";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import "rc-drawer/assets/index.css";
import IntlMessages from "Util/IntlMessages";
import { injectIntl } from 'react-intl';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import MUIDataTable from "mui-datatables";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
import { getWalletTransactionType } from "Actions/TransactionPolicy";
import { getServiceProviderBalanceList } from "Actions/ServiceProviderBalance";
import { getServiceProviderList } from "Actions/LiquidityManager";
import { getWalletType } from "Actions/WalletUsagePolicy";
import { NotificationManager } from 'react-notifications';
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';

const initState = {
    open: false,
    PageSize: AppConfig.totalRecordDisplayInList,
    WalletTypeID: "",
    SerProId: "",
    TransactionType: "",
    showReset: false,
    menudetail: [],
    notificationFlag: true,
    flag: false,
    N_flag: false
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
        title: <IntlMessages id="wallet.ServiceProviderBalance" />,
        link: '',
        index: 1
    },
];

class ServiceProviderBalance extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('A1DA426A-72E9-A0BF-99F7-413544BC34F8'); // get wallet menu permission
    }

    // will receive props update state..
    componentWillReceiveProps(nextProps) {
        if (nextProps.hasOwnProperty('walletType') && this.state.N_flag) {
            if (nextProps.walletType.length === undefined) {
                this.setState({ N_flag: false, flag: false })
                NotificationManager.error(<IntlMessages id={"sidebar.noCurrencyFound"} />);
            }
            else if (nextProps.walletType.length !== 0) {
                this.setState({ flag: true })
            }
        }

        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getServiceProviderList({});
                this.props.getWalletTransactionType();
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }

        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({ open: false });
        }
    }

    // close all drawer...
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            pagedata: {}
        });
    };

    // apply filter 
    applyFilter() {
        if (this.state.WalletTypeID !== '' && this.state.SerProId !== '') {
            this.props.getServiceProviderBalanceList({
                ServiceProviderId: this.state.SerProId,
                CurrencyName: this.state.WalletTypeID,
                TransactionType: this.state.TransactionType
            });
            this.setState({ showReset: true, PageNo: 0 });
        }
    }

    //reset filter 
    clearFilter() {
        let newObj = Object.assign({}, this.initState);
        newObj.menudetail = this.state.menudetail;
        this.setState(newObj);
    }

    onChangeHandlerwallet(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    // onchange filter options
    onChangeHandler(e) {
        if (e.target.value !== "") {
            this.setState({ [e.target.name]: e.target.value, N_flag: true });
            this.props.getWalletType({ ServiceProviderId: e.target.value, Status: 1 });
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('D2B101FF-70E5-1432-0AFF-09F3BF182874'); //D2B101FF-70E5-1432-0AFF-09F3BF182874
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
                name: intl.formatMessage({ id: "wallet.lblAddress" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "walletDeshbard.balance" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "sidebar.tradingLedger.tableHeading.fee" }),
                options: { sort: true, filter: false }
            },
        ];

        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            download: false,
            viewColumns: false,
            filter: false,
            print: false,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
        };

        return (
            <div className="jbs-page-content">
                {this.props.menuLoading && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="wallet.ServiceProviderBalance" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
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
                                {this.state.flag &&
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="WalletTypeID"><IntlMessages id="table.currency" /></Label>
                                        <Input type="select" name="WalletTypeID" id="WalletTypeID" value={this.state.WalletTypeID} onChange={(e) => this.onChangeHandlerwallet(e)}>
                                            <option value="">{intl.formatMessage({ id: "wallet.errCurrency" })}</option>
                                            {this.props.walletType.length > 0 && this.props.walletType.map((type, index) => (
                                                <option key={index} value={type.TypeName}>{type.TypeName}</option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                }
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="TransactionType"><IntlMessages id="lable.TrnType" /></Label>
                                    <Input type="select" name="TransactionType" id="TransactionType" value={this.state.TransactionType} onChange={(e) => this.onChangeHandlerwallet(e)}>
                                        <option value="">{intl.formatMessage({ id: "wallet.TransactionType" })}</option>
                                        <option value="6">{intl.formatMessage({ id: "wallet.Withdrawal" })}</option>
                                        <option value="9">{intl.formatMessage({ id: "wallet.AddressGeneration" })}</option>
                                    </Input>
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <div className="btn_area">
                                        <Button
                                            color="primary"
                                            variant="raised"
                                            className="text-white"
                                            onClick={() => this.applyFilter()}
                                            disabled={(this.state.WalletTypeID !== '' && this.state.SerProId !== '' && this.state.flag) ? false : true}
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
                {this.state.showReset === true && <div className="StackingHistory">
                    {this.props.loading && <JbsSectionLoader />}
                    <MUIDataTable
                        data={this.props.ServiceProviderList.map((item, index) => {
                            return [
                                index + 1,
                                item.CurrencyName,
                                item.Address,
                                item.Balance.toFixed(8),
                                item.Fee.toFixed(8),
                            ];
                        })}
                        columns={columns}
                        options={options}
                    />
                </div>}
            </div>
        )
    }
}

const mapStateToProps = ({ serviceProviderBalanceRdcer, walletUsagePolicy, liquidityManager, transactionPolicy, drawerclose, authTokenRdcer }) => {
    // breadcrumb 
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { loading, ServiceProviderList } = serviceProviderBalanceRdcer;
    const { walletTransactionType } = transactionPolicy;
    const { walletType } = walletUsagePolicy;
    const { serviceProvider } = liquidityManager;
    const { menuLoading, menu_rights } = authTokenRdcer;
    return { loading, ServiceProviderList, walletType, serviceProvider, drawerclose, walletTransactionType, menuLoading, menu_rights };
};

export default connect(mapStateToProps, {
    getServiceProviderBalanceList,
    getServiceProviderList,
    getWalletType,
    getWalletTransactionType,
    getMenuPermissionByID
})(injectIntl(ServiceProviderBalance));