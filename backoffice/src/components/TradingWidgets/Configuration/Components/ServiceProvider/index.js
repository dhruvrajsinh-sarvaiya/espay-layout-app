/**
 * Create By Sanjay 
 * Created Date 25/03/2019
 * Component For Service Provider List 
 */

import React, { Component } from 'react';
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import Button from '@material-ui/core/Button';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import Switch from 'react-toggle-switch';
import { NotificationManager } from "react-notifications";

import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { listServiceProvider, updateServiceProvider } from 'Actions/ServiceProvider';
import AddServiceProvider from './AddServiceProvider';

import AppConfig from 'Constants/AppConfig';
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//Columns Object
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />
    },
    {
        name: <IntlMessages id="sidebar.ProviderName" />
    },
    {
        name: <IntlMessages id="sidebar.status" />
    }
];

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
        title: <IntlMessages id="card.list.title.configuration" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.ServiceProvider" />,
        link: '',
        index: 2
    }
];

class ServiceProviderList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Data: [],
            open: false,
            addData: false,
            componentName: '',
            check: null,
            Page_Size: AppConfig.totalRecordDisplayInList,
            menudetail: [],
            notificationFlag: true,
        }

    }


    onClick = () => {
        this.setState({
            open: !this.state.open,
        })
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            addData: false,
            componentName: ''
        });
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('F4E1D801-8914-2FE3-0439-E084C8F33D51'); // get wallet menu permission
        // this.props.listServiceProvider();
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({
                open: false,
            })
        }
        if (nextProps.listServiceProviderData.ReturnCode === 0 && nextProps.listServiceProviderData !== "undefine") {
            this.setState({
                Data: nextProps.listServiceProviderData.Response
            })
        }
        if (nextProps.updateServiceProviderData.ReturnCode === 0) {

            NotificationManager.success(<IntlMessages id="my_account.ServiceProviderEdit" />);
            //code change by devang parekh (12-6-2019) for handle arbitrage configuration detail
            var reqObject = {};
            if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                reqObject.IsArbitrage = this.props.IsArbitrage;
            }
            this.props.listServiceProvider(reqObject);
            //end

        } else if (nextProps.updateServiceProviderData.ReturnCode === 1) {
            var errMsg = nextProps.updateServiceProviderData.ErrorCode === 1 ? nextProps.updateServiceProviderData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.updateServiceProviderData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {

                //code change by devang parekh (12-6-2019) for handle arbitrage configuration detail
                var reqObject = {};
                if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                    reqObject.IsArbitrage = this.props.IsArbitrage;
                }
                this.props.listServiceProvider(reqObject);
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                //end

            } else if (nextProps.menu_rights.ReturnCode !== 0) {
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
                addData: true
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
                open: !this.state.open,
            });
        }

    }

    // toogle drawer 
    toggleDrawer = () => {
        this.setState({
            open: !this.state.open,
            componentName: '',
            addData: false
        })
    }

    handleChange = (lst, updatePermission) => (event) => {

        // check permission go on next page or not
        if (updatePermission !== -1) {
            let newObj = Object.assign({}, lst);
            this.setState({ check: lst.Status });
            delete newObj.check;
            if (lst.Status === 0) {
                newObj["Status"] = 1;
            } else {
                newObj["Status"] = 0;
            }
            //code change by devang parekh (12-6-2019) for handle arbitrage configuration detail
            if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                newObj.IsArbitrage = this.props.IsArbitrage;
            }
            //end
            this.props.updateServiceProvider(newObj);

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

        const { Data, addData } = this.state;
        const { drawerClose, loading } = this.props;

        //added by jayshreeba Gohil for Arbitrage Breadcrumns (14/06/2019)
        const data = this.props;
        if (data.IsArbitrage != undefined && data.IsArbitrage == 1) {

            var BreadCrumbData = [
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
                    title: <IntlMessages id="sidebar.ArbitrageProviderConfiguration" />,
                    link: '',
                    index: 1
                }
            ];
        }else {

            var BreadCrumbData = [
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
                    title: <IntlMessages id="sidebar.providerConfiguration" />,
                    link: '',
                    index: 2
                }
            ]; }


        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('1C5AF084-5308-74B2-4E6B-4F79859593D7'); //1C5AF084-5308-74B2-4E6B-4F79859593D7
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

        const options = {
            responsive: "scroll",
            print: false,
            selectableRows: false,
            resizableColumns: false,
            pagination: true,
            viewColumns: false,
            filter: false,
            download: false,
            rowsPerPage: this.state.Page_Size,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
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
                            className="btn-primary text-white"
                            onClick={() => {
                                this.onAddData(this.checkAndGetMenuAccessDetail('1C5AF084-5308-74B2-4E6B-4F79859593D7')); //FBBBF319-2700-1117-33A7-71A473253F9E
                                this.showComponent('AddServiceProvider', this.checkAndGetMenuAccessDetail('1C5AF084-5308-74B2-4E6B-4F79859593D7')); //FBBBF319-2700-1117-33A7-71A473253F9E
                            }}
                        >
                            <IntlMessages id="liquidityprovider.list.button.add" />
                        </Button>
                    );
                } else {
                    return false;
                }
            }
        };
        return (
            <div className="jbs-page-content">
                {/* {added by jayshreeba gohil for Arbitrage Breadcrumns (14/06/2019)} */}
                {data.IsArbitrage != undefined && data.IsArbitrage == 1 ? <WalletPageTitle title={<IntlMessages id="sidebar.ArbitrageserviceProvider"/>} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} /> : <WalletPageTitle title={<IntlMessages id="my_account.ListServiceProvider" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />}

                {/* <WalletPageTitle title={<IntlMessages id="my_account.ListServiceProvider" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} /> */}
                {(loading || this.props.menuLoading) && <JbsSectionLoader />}
                <div className="StackingHistory statusbtn-comm ">
                    <MUIDataTable
                        title={<IntlMessages id="my_account.ListServiceProvider" />}
                        columns={columns}
                        options={options}
                        data={
                            Data.map((lst, key) => {
                                return [
                                    key + 1,
                                    lst.ProviderName,
                                    <div>
                                        <Switch
                                            on={lst.Status === 1 ? true : false}
                                            onClick={this.handleChange(lst, menuPermissionDetail.CrudOption.indexOf('0BB7ACAC'))} // CAE8A211-9051-492B-03D2-D2E342FD8F24
                                            enabled={!loading}
                                        />
                                    </div>,
                                ]
                            })
                        }
                    />
                    <Drawer
                        width="50%"
                        handler={false}
                        open={this.state.open}
                        // onMaskClick={this.toggleDrawer}
                        className="drawer2 half_drawer"
                        level=".drawer1"
                        placement="right"
                        levelMove={100}
                    >
                        {addData &&
                            <AddServiceProvider {...this.props}
                                drawerClose={this.toggleDrawer}
                                closeAll={this.closeAll}
                                IsArbitrage={this.props.IsArbitrage !== undefined ? 1 : 0}
                            />
                        }
                    </Drawer>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ ServiceProviderReducer, drawerclose, authTokenRdcer }) => {
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { listServiceProviderData, updateServiceProviderData, loading } = ServiceProviderReducer;
    const { menuLoading, menu_rights } = authTokenRdcer;
    return { listServiceProviderData, updateServiceProviderData, loading, drawerclose, menuLoading, menu_rights };
}

export default connect(mapStateToProps, {
    listServiceProvider,
    updateServiceProvider,
    getMenuPermissionByID
})(ServiceProviderList);
