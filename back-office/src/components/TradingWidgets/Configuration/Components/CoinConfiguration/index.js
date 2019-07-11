// Create Component for coin configuration List Data By Tejas Date : 7/1/2019

// import neccessary component for create component
import React, { Component, Fragment } from 'react';
// used for connect component with store
import { connect } from "react-redux";
// Used for display new component as a drawer
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
// Display message when hover on tab
import Tooltip from "@material-ui/core/Tooltip";
// Data table for display list
import MUIDataTable from "mui-datatables";
// import button
import Button from "@material-ui/core/Button";
// Import component for internationalization
import IntlMessages from "Util/IntlMessages";
import { NotificationManager } from "react-notifications";
// import action for get Configuration list Data
import { getCoinConfigurationList } from 'Actions/CoinConfiguration';
// loader for page
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
//import Component
import AddCoinData from './AddConfigurationList';
import UpdateCoinData from './UpdateConfiguration';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
import classnames from "classnames";
import { injectIntl } from 'react-intl';
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';

// create class for coin configuration
class CoinConfiguration extends Component {
    // used for set data for state 
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            coinConfigurationList: [],
            error: [],
            addData: false,
            editDetails: [],
            editData: false,
            componentName: '',
            //added by parth andhariya
            ConfigurationShowCard: props.ConfigurationShowCard,
            Page_Size: AppConfig.totalRecordDisplayInList,
            notificationFlag: true,
            menudetail: [],
        }
    }

    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.ConfigurationShowCard === 1 ? '1D9C27EE-800D-92A2-9AFB-59AAA813841C' : '00872623-88E1-A6FA-2B0A-C25A47181860'); // get Trading menu permission
    }

    // used for set state from props 
    componentWillReceiveProps(nextprops) {
        // added by parth andhariya
        if (nextprops.coinConfigurationList) {
            this.setState({ coinConfigurationList: nextprops.coinConfigurationList })
        }

        if (nextprops.drawerclose.bit === 1 && nextprops.drawerclose.Drawersclose.open3 === false) {
            this.setState({ open: false })
        }

        /* update menu details if not set */
        if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextprops.menu_rights.ReturnCode === 0) {
                //added by parth andhariya
                if (this.state.ConfigurationShowCard === 1) {
                    this.props.getCoinConfigurationList({ IsMargin: 1 });
                } else {
                    this.props.getCoinConfigurationList({});
                }

                //added by jayshreeba gohil (14/06/2019)
                var reqObject = {};
                if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                    reqObject.IsArbitrage = this.props.IsArbitrage;
                }
                this.props.getCoinConfigurationList(reqObject);
                //end
                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
            } else if (nextprops.menu_rights.ReturnCode !== 0) {
                //code change by jayshreeba gohil (13-6-2019) for handle Coin arbitrage configuration detail
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }

            this.setState({ notificationFlag: false });
        }
    }

    // used for display component for drawer
    showComponent = (componentName, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
            });
        }
    }

    // used for close drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            addData: false,
            editData: false,
            componentName: ''
        });
    }

    // used for toggle drawer
    toggleDrawer = () => {
        this.setState({
            open: this.state.open ? false : true,
            componentName: '',
            addData: false,
            editData: false,
        })
    }

    //used for add data
    onAddData = (menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                addData: true,
                editData: false,
            })
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    //used for store edit data 
    onEditData = (coinDetail, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                editData: true,
                editDetails: coinDetail,
                addData: false,
            })
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    };

    resetData = () => {
        this.props.drawerClose();
        this.setState({
            open: false,
            coinConfigurationList: [],
            error: [],
            addData: false,
            editDetails: [],
            editData: false,
            componentName: '',
            notificationFlag: false
        });
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

    // render component
    render() {
        const { drawerClose } = this.props;
        const { ConfigurationShowCard } = this.state;

        //added by jayshrreeba gohil for Arbitrage BreadCrumbdata (14/06/2019)
        const data = this.props;
        var BreadCrumbData = '';
        if (data.IsArbitrage != undefined && data.IsArbitrage === 1) {
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
                    title: <IntlMessages id="sidebar.Arbitrage" />,
                    link: '',
                    index: 0
                },
                {
                    title: <IntlMessages id="lable.ArbitragePairConfiguration" />,
                    link: '',
                    index: 0
                },
                {
                    title: <IntlMessages id="sidebar.CoinConfigurationList" />,
                    link: '',
                    index: 1
                }
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
                    title: ConfigurationShowCard === 1 ? <IntlMessages id="sidebar.marginTrading" /> : <IntlMessages id="sidebar.trading" />,
                    link: '',
                    index: 0
                },
                {
                    title: <IntlMessages id="card.list.title.configuration" />,
                    link: '',
                    index: 1
                },
                {
                    title: <IntlMessages id="sidebar.coinConfig" />,
                    link: '',
                    index: 2
                }
            ]
        }

        var menuPermissionDetail = this.checkAndGetMenuAccessDetail(ConfigurationShowCard === 1 ? '3C655E15-6A4C-7B41-50C4-4D03E2AB5A85' : '3EA5320A-531C-07B9-1C3D-E4FCDD59131E'); //3EA5320A-531C-07B9-1C3D-E4FCDD59131E  && margin_GUID 3C655E15-6A4C-7B41-50C4-4D03E2AB5A85

        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

        const columns = [
            {
                name: <IntlMessages id="coincofiguration.serviceid" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="coincofiguration.CurrencyLogo" />,
                options: { sort: false, filter: false }
            },
            {
                name: <IntlMessages id="table.Coin" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="manageMarkets.list.form.label.code" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="coincofiguration.totsupply" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="coincofiguration.maxsupply" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="coincofiguration.issuedate" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="coincofiguration.issueprice" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="coincofiguration.circulatingspply" />,
                options: { sort: false, filter: false }
            },
            {
                name: <IntlMessages id="manageMarkets.list.form.label.status" />,
                options: {
                    sort: false,
                    filter: false,
                    customBodyRender: (value) => {
                        return (
                            <span className={classnames({
                                "badge badge-danger": (value === this.props.intl.formatMessage({ id: "wallet.Inactive" })),
                                "badge badge-success": (value === this.props.intl.formatMessage({ id: "wallet.Active" }))
                            })} >
                                {value}
                            </span>
                        );
                    }
                }
            },
            {
                name: <IntlMessages id="manageMarkets.list.form.label.action" />,
                options: { sort: true, filter: false }
            }
        ];

        // setup options for Mui data table
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            download: false,
            viewColumns: false,
            filter: false,
            rowsPerPage: this.state.Page_Size,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            customToolbar: () => {
                if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
                    return (
                        <Button
                            variant="raised"
                            className="btn-primary text-white"
                            onClick={() => {
                                this.onAddData(this.checkAndGetMenuAccessDetail(ConfigurationShowCard === 1 ? '3C655E15-6A4C-7B41-50C4-4D03E2AB5A85' : '3EA5320A-531C-07B9-1C3D-E4FCDD59131E').HasChild); // 0919F104-5205-15F5-1F35-9F756ED424D2  && margin_GUID 9280741E-5B98-8B7B-0746-5494BB473D86
                                this.showComponent('AddCoinData', this.checkAndGetMenuAccessDetail(ConfigurationShowCard === 1 ? '3C655E15-6A4C-7B41-50C4-4D03E2AB5A85' : '3EA5320A-531C-07B9-1C3D-E4FCDD59131E').HasChild);
                            }}
                        >
                            <IntlMessages id="exchangefeedConfig.pairConfiguration.button.add" />
                        </Button>
                    );
                } else {
                    return false;
                }
            }
        };

        //returns the component
        return (
            <div className="data-table-wrapper mb-20 jbs-page-content">
                {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                {/* {added by jayshreeba gohil (14/06/2019)} */}
                {data.IsArbitrage != undefined && data.IsArbitrage === 1 ? <WalletPageTitle title={<IntlMessages id="sidebar.CoinConfigurationTitle" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} /> : <WalletPageTitle title={<IntlMessages id="sidebar.coinConfig" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />}
                {/* <WalletPageTitle title={<IntlMessages id="sidebar.coinConfig" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} /> */}
                <div className="StackingHistory">
                    <MUIDataTable
                        title={this.props.title}
                        data={this.state.coinConfigurationList.length &&
                            this.state.coinConfigurationList.map((coinDetail, key) => {
                                const imageSrc = AppConfig.coinlistImageurl + '/' + coinDetail.SMSCode + '.png';
                                const imageHash = Date.now();
                                return [
                                    coinDetail.ServiceId.toString(),
                                    //added by parth andhariya for Show Currency Logo
                                    <img
                                        src={`${imageSrc}?${imageHash}`}
                                        className="mr-10"
                                        height="25px"
                                        width="25px"
                                        alt={coinDetail.SMSCode}
                                        onError={(e) => {
                                            e.target.src = require(`Assets/icon/no_image.png`) // default no img
                                        }}
                                    />,
                                    coinDetail.Name,
                                    coinDetail.SMSCode,
                                    coinDetail.TotalSupply.toString(),
                                    coinDetail.MaxSupply.toString(),
                                    coinDetail.IssueDate.replace('T', ' ').split(' ')[0],
                                    coinDetail.IssuePrice.toString(),
                                    coinDetail.CirculatingSupply.toString(),
                                    coinDetail.StatusText === "Active" ? this.props.intl.formatMessage({ id: "wallet.Active" }) : this.props.intl.formatMessage({ id: "wallet.Inactive" }),
                                    menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 ? // check edit curd operation ?
                                        <Fragment>
                                            <div className="list-action">
                                                <Tooltip
                                                    title={<IntlMessages id="manageMarkets.tooltip.update" />}
                                                    disableFocusListener disableTouchListener
                                                >
                                                    <a
                                                        href="javascript:void(0)"
                                                        className="mr-10"
                                                        onClick={(event) => {
                                                            this.onEditData(coinDetail, this.checkAndGetMenuAccessDetail(ConfigurationShowCard === 1 ? '3C655E15-6A4C-7B41-50C4-4D03E2AB5A85' : '3EA5320A-531C-07B9-1C3D-E4FCDD59131E').HasChild) // E64232D5-7332-7149-4783-4DCE71497A82  && margin_GUID 23D49980-6122-2CF4-40C5-8C25317F7F9A
                                                            this.showComponent('UpdateCoinData', this.checkAndGetMenuAccessDetail(ConfigurationShowCard === 1 ? '3C655E15-6A4C-7B41-50C4-4D03E2AB5A85' : '3EA5320A-531C-07B9-1C3D-E4FCDD59131E').HasChild); //E64232D5-7332-7149-4783-4DCE71497A82  && margin_GUID 23D49980-6122-2CF4-40C5-8C25317F7F9A
                                                        }}
                                                    >
                                                        <i className="ti-pencil" />
                                                    </a>
                                                </Tooltip>
                                            </div>
                                        </Fragment> : '-'
                                ];
                            })}
                        columns={columns}
                        options={options}
                    />
                </div>
                <Drawer
                    width="80%"
                    handler={false}
                    open={this.state.open}
                    className="drawer2 half_drawer"
                    level=".drawer1"
                    placement="right"
                    levelMove={100}
                >
                    {this.state.addData &&
                        <AddCoinData {...this.props} drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
                    }
                    {this.state.editData && this.state.editDetails &&
                        <UpdateCoinData {...this.props} selectedData={this.state.editDetails} drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
                    }
                </Drawer>
            </div>
        )
    }
}

// used for set state and props (get props from reducer)
const mapStateToProps = ({ coinConfiguration, drawerclose, authTokenRdcer }) => {
    const { coinConfigurationList, error, loading, CurrencyLogo } = coinConfiguration; //addad by parth andhariya  CurrencyLogo
    const { menuLoading, menu_rights } = authTokenRdcer;
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    return { coinConfigurationList, error, loading, drawerclose, CurrencyLogo, menuLoading, menu_rights }; //addad by parth andhariya  CurrencyLogo
};

// connect component with store
export default connect(mapStateToProps, {
    getCoinConfigurationList,
    getMenuPermissionByID
})(injectIntl(CoinConfiguration));