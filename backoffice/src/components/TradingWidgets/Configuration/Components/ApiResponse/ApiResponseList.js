// component for Display API response lsi By Tejas
import React, { Fragment } from "react";

// import table for MUI Data table
import MUIDataTable from "mui-datatables";

// import for tooltip
import Tooltip from "@material-ui/core/Tooltip";

// import for button 
import MatButton from "@material-ui/core/Button";

// used for display loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// import for drawer
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

//Added By Tejas For Get Data With Saga
import {
    getThirdPartyApiResponse,
} from "Actions/ApiResponseConfig";

// used for connect component with reducers
import { connect } from "react-redux";

import AppConfig from 'Constants/AppConfig';

// intl messages
import IntlMessages from "Util/IntlMessages";

// component for add and update response
import AddApiResponse from './AddResponseList';
import UpdateApiResponse from './UpdateResponseList';

import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';

// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import { NotificationManager } from "react-notifications";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';


// defines columns
const columns = [
    {
        name: <IntlMessages id="contactus.title.id" />,
        options: { sort: false, filter: true }
    },
    {
        name: <IntlMessages id="sidebar.apiresponse.list.lable.enter.balanceRegex" />,
        options: { sort: false, filter: true }
    },
    {
        name: <IntlMessages id="sidebar.apiresponse.list.lable.enter.statusRegex" />,
        options: { sort: false, filter: true }
    },
    {
        name: <IntlMessages id="sidebar.apiresponse.list.lable.enter.errorCodeRegex" />,
        options: { sort: false, filter: true }
    },
    {
        name: <IntlMessages id="sidebar.apiresponse.list.lable.enter.trnRefNoRegex" />,
        options: { sort: false, filter: true }
    },
    {
        name: <IntlMessages id="liquidityprovider.list.column.label.action" />,
        options: { sort: false, filter: false }
    }
];

// class for API response list
class ApiResponseList extends React.Component {

    //constructor 
    constructor(props) {
        super(props);
        //define default state
        this.state = {
            responseList: [],
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
        this.props.getMenuPermissionByID('D8FC2B5E-3ABB-74A8-5D61-2F792D402816'); // get wallet menu permission
    }
    // invoke when component is about to get props
    componentWillReceiveProps(nextprops) {
        if (nextprops.apiResponseList) {
            this.setState({
                responseList: nextprops.apiResponseList
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
                this.props.getThirdPartyApiResponse({});
                 //code change by jayshreeba Gohil (17-6-2019) for handle arbitrage configuration detail
                 var reqObject = {};
                 if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                     reqObject.IsArbitrage = this.props.IsArbitrage;
                 }
                 this.props.getThirdPartyApiResponse(reqObject);
                 //end 
                 
                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
            } else if (nextprops.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
    }

    // open form for add data
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

    // open form for edit data
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

    // set state for show component / display 
    showComponent = (componentName, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                componentName: componentName,
                open: !this.state.open,
            });
        }
    }

    // toggkle drawer
    toggleDrawer = () => {
        this.setState({
            open: !this.state.open,
            componentName: '',
            addData: false,
            editData: false,
        })
    }

    //close drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            addData: false,
            editData: false,
            componentName: ''
        });
    }

    // call API for get third party response
    // componentDidMount() {
    //     this.props.getThirdPartyApiResponse({});
    // }
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
    //renders the component
    render() {

        const { drawerClose } = this.props;
        //added by jayshreeba Gohil for Arbiitrage breadcrumns (17/06/2019)
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
                    title: <IntlMessages id="sidebar.ArbitrageapiResponseList" />,
                    link: '',
                    index: 1
                }
            ];
        } else {
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
                    title: <IntlMessages id="sidebar.apiResponse" />,
                    link: '',
                    index: 2
                }
            ];
        }


        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('B69F6C37-49C0-A714-12C3-3AD51F4E62E3'); //B69F6C37-49C0-A714-12C3-3AD51F4E62E3
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

        // defines optiosn for table
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            selectableRows: false, // <===== will turn off checkboxes in rows
            print: false,// <===== will turn off print option in header
            download: false,// <===== will turn off download option in header
            viewColumns: false,// <===== will turn off viewColumns option in header
            filter: false,// <===== will turn off filter option in header
            rowsPerPage: this.state.Page_Size,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            customToolbar: () => {
                if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
                    return (
                        <MatButton
                            variant="raised"
                            className="btn-primary text-white"
                            onClick={() => {
                                this.onAddData(this.checkAndGetMenuAccessDetail('B69F6C37-49C0-A714-12C3-3AD51F4E62E3').HasChild); // 3F430D1D-70C9-14E5-916E-D68BA2AF6DE2
                                this.showComponent('AddApiResponse', this.checkAndGetMenuAccessDetail('B69F6C37-49C0-A714-12C3-3AD51F4E62E3').HasChild); // 3F430D1D-70C9-14E5-916E-D68BA2AF6DE2
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

        return (
            <div className="jbs-page-content"> 
                {(this.props.apiResponseListLoading|| this.props.menuLoading) && <JbsSectionLoader />}
                {/* {added by jayshreeba gohil for Aritrage breadcrumns (17/06/2019)} */}
               {data.IsArbitrage != undefined && data.IsArbitrage == 1 ? <WalletPageTitle title={<IntlMessages id=    "sidebar.ArbitrageapiResponseTitle"/>} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} /> : <WalletPageTitle title={<IntlMessages id="sidebar.apiResponse" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />}
             
               {/*  <WalletPageTitle title={<IntlMessages id="sidebar.apiResponse" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />   */}             
                <div className="StackingHistory">
                    <MUIDataTable
                        title={this.props.title}
                        columns={columns}
                        data={this.state.responseList.length !== 0 && this.state.responseList.map((item, key) => {
                            return [
                                item.Id,
                                item.BalanceRegex,
                                item.StatusRegex,
                                item.ErrorCodeRegex,
                                item.TrnRefNoRegex,
                                menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 ? // check edit curd operation ?
                                    <Fragment>
                                        <div className="list-action">
                                            <Tooltip title={<IntlMessages id="liquidityprovider.tooltip.update" />} disableFocusListener disableTouchListener >
                                                <a href="javascript:void(0)" className="mr-10" onClick={(event) => {
                                                    this.onEditData(item, this.checkAndGetMenuAccessDetail('B69F6C37-49C0-A714-12C3-3AD51F4E62E3').HasChild) // B58C3E73-36CA-473F-366E-52563E7475BE
                                                    this.showComponent('UpdateApiResponse', this.checkAndGetMenuAccessDetail('B69F6C37-49C0-A714-12C3-3AD51F4E62E3').HasChild); // B58C3E73-36CA-473F-366E-52563E7475BE
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
                        options={options}
                    />
                </div>

                <Drawer
                    width="70%"
                    handler={false}
                    open={this.state.open}
                    // onMaskClick={this.toggleDrawer}
                    className="drawer2 drawer1 half_drawer"
                    level=".drawer1"
                    placement="right"
                    levelMove={100}
                >
                    {this.state.addData && 
                        <AddApiResponse {...this.props} drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
                    }
                    {this.state.editData && this.state.editDetails &&
                        <UpdateApiResponse {...this.props} selectedData={this.state.editDetails}
                            drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
                    }
                </Drawer>
            </div>
        )
    }
}

const mapStateToProps = ({ thirdPartyApiResponse, drawerclose,authTokenRdcer }) => {
    const { apiResponseList, apiResponseListLoading } = thirdPartyApiResponse;
    const { menuLoading, menu_rights } = authTokenRdcer;
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    return { apiResponseList, apiResponseListLoading, drawerclose ,menuLoading, menu_rights};
};

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        getThirdPartyApiResponse,
        getMenuPermissionByID
    }
)(ApiResponseList);