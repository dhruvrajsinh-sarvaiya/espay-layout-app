// component for Api Request List Display Request List By Tejas
// import for react and fragment component
import React, { Component, Fragment } from "react";

// used for connect  component with store
import { connect } from "react-redux";

// import data table
import MUIDataTable from "mui-datatables";

// intl messages
import IntlMessages from "Util/IntlMessages";

// import tooltip
import Tooltip from "@material-ui/core/Tooltip";

// impport button 
import MatButton from "@material-ui/core/Button";
import { NotificationManager } from "react-notifications";

// used for display loader 
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// used for drawer for open and edit form
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

//Added By Tejas For Get Data With Saga
import {
    getProvidersList,
} from "Actions/LiquidityManager";

// component for add and update
import AddApiRequest from './AddRequestList';
import UpdateApiRequest from './UpdateRequestList';

import AppConfig from 'Constants/AppConfig';

import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';

//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';

// class for Request List
class ApiRequestList extends Component {
    // constructor that defines default state
    constructor(props) {
        super(props);
        this.state = {
            requestList: [],
            open: false,
            addData: false,
            editData: false,
            editDetails: [],
            componentName: '',
            Page_Size: AppConfig.totalRecordDisplayInList,
            menudetail: [],
            notificationFlag: true,
        };
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('41D5DD8F-49AC-5F30-847A-1DAB69717C61'); // get wallet menu permission
    }
    // invoke when component is about to get props
    componentWillReceiveProps(nextprops) {
        if (nextprops.providersList) {
            this.setState({
                requestList: nextprops.providersList
            })
        }
        if (nextprops.drawerclose.bit === 1 && nextprops.drawerclose.Drawersclose.open3 === false) {
            this.setState({
                open: false,
            })
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextprops.menu_rights.ReturnCode === 0) {
                this.props.getProvidersList();
                //code change by jayshreeba Gohil (17-6-2019) for handle arbitrage configuration detail
                var reqObject = {};
                if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                    reqObject.IsArbitrage = this.props.IsArbitrage;
                }
                this.props.getProvidersList(reqObject);
                //end 

                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });

            } else if (nextprops.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();

            }
        }
    }

    // open drawer and set data for add new request
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

    // open drawer and set data for Edit new request
    onEditData = (selectedData, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                editData: true,
                editDetails: selectedData,
                addData: false,
            })
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    // set component and open drawer
    showComponent = (componentName, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
            });
        }
    }

    // toogle drawer 
    toggleDrawer = () => {
        this.setState({
            open: this.state.open ? false : true,
            componentName: '',
            addData: false,
            editData: false,
        })
    }

    // close all drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            addData: false,
            editData: false,
            componentName: ''
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
    // render the list component
    render() {
        const { drawerClose } = this.props;
        //added by jayshreeba Gohil for Arbiitrage breadcrumns (17/06/2019)
        const data = this.props;
        var BreadCrumbData = [];
        if (data.IsArbitrage != undefined && data.IsArbitrage == 1) {

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
                    title: <IntlMessages id="lable.ArbitrageExchangeConfiguration" />,
                    link: '',
                    index: 0
                },
                {
                    title: <IntlMessages id="sidebar.ArbitrageapiRequestList" />,
                    link: '',
                    index: 1
                }
            ];
        } else {
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
                    title: <IntlMessages id="sidebar.trading" />,
                    link: '',
                    index: 0
                },
                {
                    title: <IntlMessages id="card.list.title.configuration" />,
                    link: '',
                    index: 1
                },
                {
                    title: <IntlMessages id="sidebar.apiRequest" />,
                    link: '',
                    index: 2
                }
            ];
        }


        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('BF30765C-65DD-8965-A757-DE0EE5F02F61'); //BF30765C-65DD-8965-A757-DE0EE5F02F61
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

        // defines columns header
        const columns = [
            {
                name: <IntlMessages id="contactus.title.id" />,
            },
            {
                name: <IntlMessages id="liquidityprovider.list.column.label.apiname" />,
            },
            {
                name: <IntlMessages id="liquidityprovider.list.column.label.apiurl" />,
            },
            {
                name: <IntlMessages id="liquidityprovider.list.column.label.type" />,
            },
            {
                name: <IntlMessages id="liquidityprovider.list.column.label.apptype" />,
            },
            {
                name: <IntlMessages id="liquidityprovider.list.column.label.action" />,
            }
        ];

        // set options for table (MUI data table)
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            download: false,
            viewColumns: false,
            filter: false,
            sort: false,
            rowsPerPage: this.state.Page_Size,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            customToolbar: () => {
                if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
                    return (
                        <MatButton
                            variant="raised"
                            className="btn-primary text-white"
                            onClick={() => {
                                this.onAddData(this.checkAndGetMenuAccessDetail('BF30765C-65DD-8965-A757-DE0EE5F02F61').HasChild); // 30025EE8-38BB-985F-A3B4-97F87BDC99EC
                                this.showComponent('AddApiRequest', this.checkAndGetMenuAccessDetail('BF30765C-65DD-8965-A757-DE0EE5F02F61').HasChild); // 30025EE8-38BB-985F-A3B4-97F87BDC99EC
                            }}
                        >
                            <IntlMessages id="liquidityprovider.list.button.add" />
                        </MatButton>
                    );
                } else {
                    return false;
                }
            }
        };

        //returns the component
        return (
            <div className="jbs-page-content">
                {/* {added by jayshreeba gohil for Aritrage breadcrumns (17/06/2019)} */}
                {data.IsArbitrage != undefined && data.IsArbitrage == 1 ? <WalletPageTitle title={<IntlMessages id="sidebar.ArbitrageapiRequestTitle" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} /> : <WalletPageTitle title={<IntlMessages id="sidebar.apiRequest" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />}

                <div className="StackingHistory">
                    {(this.props.providersLoading || this.props.menuLoading) && <JbsSectionLoader />}
                    <MUIDataTable
                        title={this.props.title}
                        data={this.state.requestList.length !== 0 && this.state.requestList.map((item, key) => {
                            return [
                                key + 1,
                                item.APIName,
                                item.APISendURL,
                                item.MethodType,
                                <Fragment>
                                    {item.StatusText === "Active" &&
                                        <span
                                            style={{ float: "left" }}
                                            className={`badge badge-xs badge-success position-relative`}
                                        >
                                            &nbsp;
                                        </span>
                                    }
                                    {item.StatusText === "InActive" &&
                                        <span
                                            style={{ float: "left" }}
                                            className={`badge badge-xs badge-danger position-relative`}
                                        >
                                            &nbsp;
                                        </span>
                                    }
                                    <div className="status pl-30">{item.AppType}</div>
                                </Fragment>,
                                menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 ? // check edit curd operation ?
                                    <Fragment>
                                        <div className="list-action">
                                            <Tooltip
                                                title={
                                                    <IntlMessages id="liquidityprovider.tooltip.update" />
                                                }
                                                disableFocusListener disableTouchListener
                                            >
                                                <a
                                                    href="javascript:void(0)"
                                                    className="mr-10"
                                                    onClick={(event) => {
                                                        this.onEditData(item, this.checkAndGetMenuAccessDetail('BF30765C-65DD-8965-A757-DE0EE5F02F61').HasChild) // EC34D9FD-8C64-267F-3C09-0DBA62CA5EE6
                                                        this.showComponent('UpdateApiRequest', this.checkAndGetMenuAccessDetail('BF30765C-65DD-8965-A757-DE0EE5F02F61').HasChild); // EC34D9FD-8C64-267F-3C09-0DBA62CA5EE6
                                                    }}
                                                >
                                                    <i className="ti-pencil" />
                                                </a>
                                            </Tooltip>
                                        </div>
                                    </Fragment>
                                    : '-'
                            ];
                        })}
                        columns={columns}
                        options={options}
                    />
                </div>
                <Drawer
                    width="70%"
                    handler={false}
                    open={this.state.open}
                    className="drawer2 drawer1 half_drawer"
                    level=".drawer1"
                    placement="right"
                    levelMove={100}
                >
                    {this.state.addData &&
                        <AddApiRequest {...this.props} drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
                    }
                    {this.state.editData && this.state.editDetails &&
                        <UpdateApiRequest {...this.props} selectedData={this.state.editDetails} drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
                    }
                </Drawer>
            </div>
        )
    }
}

const mapStateToProps = ({ liquidityManager, drawerclose, authTokenRdcer }) => {
    const { providersList, providersLoading } = liquidityManager;
    const { menuLoading, menu_rights } = authTokenRdcer;
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    return { providersList, providersLoading, drawerclose, menuLoading, menu_rights };
};

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        getProvidersList,
        getMenuPermissionByID
    }
)(ApiRequestList);