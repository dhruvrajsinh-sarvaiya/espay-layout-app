// component for Trade Roiuting report By Tejas 25/3/2019
//import necessary components
import React, { Fragment, Component } from 'react';
import { connect } from "react-redux";

//  Used For Display Notification 
import { NotificationManager } from "react-notifications";

//used for design
import {
    Form,
    FormGroup,
    Label,
    Input,
    Row,
    Col
} from "reactstrap";


import Button from "@material-ui/core/Button";

import fusioncharts from 'fusioncharts';
import charts from 'fusioncharts/fusioncharts.charts';
import ReactFusioncharts from 'react-fusioncharts';

// Resolves charts dependancy
charts(fusioncharts);

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
//used for display loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// intl messages means convert text into selected languages
import IntlMessages from "Util/IntlMessages";

// used for display table
import MUIDataTable from "mui-datatables";

//used for convert language 
import { injectIntl } from 'react-intl';

// used for breadscrumb
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';

// used for convert date format
import { changeDateFormat } from "Helpers/helpers";

//Used for Get provider list
import {
    getServiceProviderList,
    getTransactionTypeList
} from "Actions/LiquidityManager";

import {
    getWalletType
} from "Actions/WalletUsagePolicy";

import { getTradeRoutingReport } from 'Actions/TradeRoutingReport'

import AppConfig from 'Constants/AppConfig';

//BreadCrumbData
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
        title: <IntlMessages id="sidebar.trading" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="card.list.title.report" />,
        link: '',
        index: 1
    }, {
        title: <IntlMessages id="sidebar.tradeRouting" />,
        link: '',
        index: 2
    },
];

// class for Trade Routing Report
class TradeRoutingReport extends Component {

    // make default state values on load
    constructor(props) {

        super();
        this.state = {
            start_date: "",
            end_date: "",
            currentDate: new Date().toISOString().slice(0, 10),
            onLoad: 1,
            serviceProvider: [],
            selectedServiceProvider: "",
            currencyList: [],
            selectedCurrency: "",
            transactionTypes: [],
            selectedTrnType: "",
            tradeRoutingList: [],
            Page_Size: AppConfig.totalRecordDisplayInList

        }
    }

    componentDidMount() {
        this.props.getServiceProviderList({})
        this.props.getTransactionTypeList({});
        this.props.getWalletType({ Status: 1 });
    }

    componentWillReceiveProps(nextprops) {

        if (this.state.onLoad == 1 && nextprops.tradeRouteReportList && nextprops.tradeRouteReportList.length > 0) {
            this.setState({
                onLoad: 0,
                tradeRoutingList: nextprops.tradeRouteReportList
            })
        } else if (this.state.onLoad == 1 && nextprops.tradeRouteReportList && nextprops.tradeRouteReportList.length == 0) {

            NotificationManager.error(<IntlMessages id="trading.market.label.nodata" />)
            this.setState({
                onLoad: 0,
                tradeRoutingList: []
            })
        }
    }

    //used for toggle drawer
    toggleDrawer = () => {
        this.setState({
            open: !this.state.open,
            componentName: ''
        })
    }

    //used for close all drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    //cleas the state
    onClear = event => {
        event.preventDefault();

        this.setState({
            start_date: "",
            end_date: "",
            onLoad: 1,
            serviceProvider: [],
            selectedServiceProvider: "",
            currencyList: [],
            selectedCurrency: "",
            transactionTypes: [],
            selectedTrnType: "",
        })
    }

    // apply button for Fetch Trade Recon List
    onApply = event => {
        event.preventDefault();

        const Data = {
            FromDate: this.state.start_date,
            ToDate: this.state.end_date,
        };
        if ((this.state.start_date !== '' && this.state.end_date == '') || (this.state.end_date !== '' && this.state.start_date == '')) {

            NotificationManager.error(<IntlMessages id="trading.openorders.dateselect" />);
        } else if (this.state.end_date < this.state.start_date) {

            NotificationManager.error(<IntlMessages id="trading.openorders.datediff" />);
        } else if (this.state.end_date > this.state.currentDate) {

            NotificationManager.error(<IntlMessages id="trading.openorders.endcurrentdate" />);
        } else if (this.state.start_date > this.state.currentDate) {

            NotificationManager.error(<IntlMessages id="trading.openorders.startcurrentdate" />);
        } else {
            this.setState({ onLoad: 1 })
            //this.props.getTradeRoutingReport(Data);
        }
    };

    //used for show component
    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: !this.state.open,
        });
    }

    // used to handle change event of every input field and set values in states
    handleChangeFromDate = event => {
        this.setState({ start_date: event.target.value });
    };

    // used to handle change event of every input field and set values in states
    handleChangeToDate = event => {
        this.setState({ end_date: event.target.value });
    };

    // used to handle change event of select Wallet
    handleChangeCurrency = event => {
        this.setState({ selectedCurrency: event.target.value });
    };

    // used to handle change event of select Service Provider
    handleChangeServiceProvider = event => {
        this.setState({ selectedServiceProvider: event.target.value });
    };

    // used to handle change event of select transaction type
    handleChangeTransactionType = event => {
        this.setState({ selectedTrnType: event.target.value });
    };

    //renders the component
    render() {

        //used for convert columns in to string
        const intl = this.props.intl;
        const { drawerClose, closeAll } = this.props;
        const { serviceProvider, transactionTypeList, walletType } = this.props;
        const options = {
            filterType: "dropdown",
            responsive: "stacked",
            selectableRows: false,
            download: false,
            rowsPerPage: this.state.Page_Size,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            downloadOptions: {
                filename: 'Trade_Routing_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            filter: false,
            search: false
        };

        // define columns for data tables
        const columns = [
            {
                name: intl.formatMessage({ id: "sidebar.tradeRouting.label.routeName" })
            },
            {
                name: intl.formatMessage({ id: "wallet.trnType" })
            },
            {
                name: intl.formatMessage({ id: "liquidityprovider.list.option.label.serviceprovider" })
            },
            {
                name: intl.formatMessage({ id: "walletDeshbard.wallets" })
            },
            {
                name: intl.formatMessage({ id: "daemonconfigure.status" })
            },
            {
                name: intl.formatMessage({ id: "sidebar.date_created" })
            },
            {
                name: intl.formatMessage({ id: "sidebar.date_modified" })
            },
            {
                name: intl.formatMessage({ id: "sidebar.tradeRouting.label.routeID" })
            },


        ];

        const data = [
            {
                TxnType: "Deposit",
                RouteName: "Deposit now",
                ServiceProvider: "Bitgo API",
                Wallets: "btc,bch",
                Status: 1,
                date_created: "2019-02-09T10:36:11.49",
                date_modified: "2019-02-09T10:36:11.49",
                routeID: 1,
            }
        ]

        const dataSource = {
            "chart": {
                "caption": "",
                "showlegend": "1",
                "legendPosition": "RIGHT",
                "showpercentvalues": "1",
                "usedataplotcolorforlabels": "1",
                "theme": "fusion",
                "showLabels": "0",
                "showValues": "0"
            },
            "data": [
                {
                    "label": "Active",
                    "value": 6
                },
                {
                    "label": "InActive",
                    "value": 4
                },
            ]
        };
        return (
            <Fragment>
                <div className="charts-widgets-wrapper jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id="sidebar.tradeRouting" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                    {(this.props.serviceProviderLoading
                        || this.props.loading
                        || this.props.transactionTypeListLoading
                        || this.props.tradeRoutingLoading
                    ) && <JbsSectionLoader />}
                    <div className="mb-10 trade-Routing">
                        <JbsCollapsibleCard>
                            <div className="col-md-12">
                                <div className="top-filter clearfix  tradefrm">
                                    <Form name="frm_search" className="row mb-10">
                                        <div className="col-md-2">
                                            <Label for="startDate1">
                                                {
                                                    <IntlMessages id="traderecon.search.dropdown.label.fromdate" />
                                                }
                                            </Label>
                                            <Input
                                                type="date"
                                                name="start_date"
                                                value={this.state.start_date}
                                                id="startDate1"
                                                placeholder="dd/mm/yyyy"
                                                onChange={this.handleChangeFromDate}
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <Label for="endDate1">
                                                {
                                                    <IntlMessages id="traderecon.search.dropdown.label.todate" />
                                                }
                                            </Label>
                                            <Input
                                                type="date"
                                                name="end_date"
                                                value={this.state.end_date}
                                                id="endDate1"
                                                placeholder="dd/mm/yyyy"
                                                onChange={this.handleChangeToDate}
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <Label for="wallets">
                                                {
                                                    <IntlMessages id="walletDeshbard.wallets" />
                                                }
                                            </Label>

                                            <Input
                                                type="select"
                                                name="selectedCurrency"
                                                value={this.state.selectedCurrency}
                                                onChange={this.handleChangeCurrency}
                                            >
                                                <IntlMessages id="sidebar.pleaseSelect">
                                                    {(select) =>
                                                        <option value="">{select}</option>
                                                    }
                                                </IntlMessages>

                                                {walletType && walletType.length && walletType.map((item, key) => (
                                                    <option
                                                        value={item.ID}
                                                        key={key}
                                                    >
                                                        {item.TypeName}
                                                    </option>
                                                ))}
                                            </Input>

                                        </div>


                                        <div className="col-md-2">
                                            <Label for="selectedServiceProvider">
                                                {
                                                    <IntlMessages id="liquidityprovider.list.option.label.serviceprovider" />
                                                }
                                            </Label>
                                            <Input
                                                type="select"
                                                name="selectedServiceProvider"
                                                value={this.state.selectedServiceProvider}
                                                onChange={this.handleChangeServiceProvider}
                                            >
                                                <IntlMessages id="sidebar.pleaseSelect">
                                                    {(select) =>
                                                        <option value="">{select}</option>
                                                    }
                                                </IntlMessages>

                                                {serviceProvider && serviceProvider.length && serviceProvider.map((item, key) => (
                                                    <option
                                                        value={item.Id}
                                                        key={key}
                                                    >
                                                        {item.ProviderName}
                                                    </option>
                                                ))}
                                            </Input>

                                        </div>

                                        <div className="col-md-2">
                                            <Label for="selectedTrnType">
                                                {
                                                    <IntlMessages id="liquidityprovider.list.option.label.trntypes" />
                                                }
                                            </Label>
                                            <Input
                                                type="select"
                                                name="selectedTrnType"
                                                value={this.state.selectedTrnType}
                                                onChange={this.handleChangeTransactionType}
                                            >
                                                <IntlMessages id="sidebar.pleaseSelect">
                                                    {(select) =>
                                                        <option value="">{select}</option>
                                                    }
                                                </IntlMessages>

                                                {transactionTypeList.length && transactionTypeList.map((item, key) => (
                                                    <option
                                                        value={item.Id}
                                                        key={key}

                                                    >
                                                        {item.TrnTypeName}
                                                    </option>
                                                ))}
                                            </Input>
                                        </div>

                                        <div className="col-md-1">
                                            <Label className="d-block">&nbsp;</Label>

                                            <Button
                                                variant="raised"
                                                className="btn-primary text-white"
                                                onClick={this.onApply}
                                            >
                                                <IntlMessages id="traderecon.search.dropdown.button.search" />
                                            </Button>
                                        </div>

                                        <div className="col-md-1">
                                            <Label className="d-block">&nbsp;</Label>

                                            <Button
                                                variant="raised"
                                                className="btn-danger text-white"
                                                onClick={this.onClear}
                                            >
                                                <IntlMessages id="button.cancel" />
                                            </Button>
                                        </div>

                                    </Form>
                                </div>
                            </div>
                        </JbsCollapsibleCard>
                        {/* 
                         <JbsCollapsibleCard>
                            <Row className="m-0">
                                <Col md={8}>
                                <Col md={4}>
                                <span>
                                    10
                                </span>
                                {<IntlMessages id="sidebar.tradeRouting.label.totalRoutes" />}
                                    
                                </Col>

                                <Col md={4}>
                                <span>
                                    06
                                </span>
                                {<IntlMessages id="sidebar.tradeRouting.label.activeRoutes" />}
                                </Col>

                                <Col md={4}>
                                    <span>
                                        04
                                    </span>

                                    {<IntlMessages id="sidebar.tradeRouting.label.inActiveRoutes" />}                                
                                </Col>
                                </Col>
                                <Col md={4}>                                
                                
                                <ReactFusioncharts
                                type="pie3d"
                                width='100%'
                                dataFormat="JSON"
                                dataSource={dataSource} />
                            
                                </Col>
                            </Row>
                        </JbsCollapsibleCard> */}

                        {data && data.length ? (
                            <MUIDataTable
                                //title={<IntlMessages id="sidebar.tradeRecon.list" />}
                                data={data.map(item => {
                                    return [
                                        item.RouteName,
                                        item.TxnType,
                                        item.ServiceProvider,
                                        item.Wallets,
                                        item.Status,
                                        item.date_created.replace('T', ' ').split('.')[0],
                                        item.date_modified.replace('T', ' ').split('.')[0],
                                        item.routeID,
                                    ];
                                })}
                                columns={columns}
                                options={options}
                            />
                        ) : (
                                ""
                            )}
                    </div>
                </div>
            </Fragment>
        )
    }
}


//export default TradeRoutingReport;
const mapStateToProps = ({ tradeRecon, drawerclose, liquidityManager, walletUsagePolicy, tradeRoutingReport }) => {
    const { tradeReconList, error, loading, pairList } = tradeRecon;
    const {
        serviceProvider,
        serviceProviderLoading,
        transactionTypeList,
        transactionTypeListLoading
    } = liquidityManager

    const { walletType } = walletUsagePolicy;

    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }

    const {
        tradeRouteReportList,
        tradeRoutingLoading,
        tradeRoutingError
    } = tradeRoutingReport
    return {
        drawerclose,
        tradeReconList,
        error,
        loading,
        pairList,
        serviceProvider,
        serviceProviderLoading,
        transactionTypeList,
        transactionTypeListLoading,
        walletType,
        tradeRouteReportList,
        tradeRoutingLoading,
        tradeRoutingError
    };
}

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        getServiceProviderList,
        getTransactionTypeList,
        getWalletType,
        getTradeRoutingReport
    }
)(injectIntl(TradeRoutingReport));