// List Component for site configuration data by Tejas  8/2/2019
// import Component from react
import React, { Component, Fragment } from "react";

// import Inbuilt table for display data
import MUIDataTable from "mui-datatables";

// Used for display tooltip
import Tooltip from "@material-ui/core/Tooltip";

// import button
import MatButton from "@material-ui/core/Button";

// Section Loader 
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// drawer component for display add and update component
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

//Added By Tejas For Get Data From Saga
import {
    getSiteTokenList,
} from "Actions/SiteToken";

// import for connect component to store
import { connect } from "react-redux";

// intl messages
import IntlMessages from "Util/IntlMessages";

// add and update component module
import AddSiteToken from './AddSiteToken';
import UpdateSiteToken from './UpdateSiteToken';

import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';

import AppConfig from 'Constants/AppConfig';

// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import { NotificationManager } from "react-notifications";
import { Col } from 'reactstrap';
import classnames from "classnames";
import { injectIntl } from 'react-intl';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';

// site Token Component
class SiteToken extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            siteTokenList: [],
            open: false,
            addData: false,
            editData: false,
            editDetails: [],
            componentName: '',
            Page_Size: AppConfig.totalRecordDisplayInList,
            notificationFlag: true,
            menudetail: [],
        };
    }
    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.ConfigurationShowCard === 1 ? '40D532A4-24F8-3E69-034D-D257C1EC8460' : '6D5C7BF2-8D83-7074-0BA0-04A7818F791C'); // get Trading menu permission
    }

    // call when component is about to get new props
    componentWillReceiveProps(nextprops) {
        if (nextprops.siteTokenList) {
            this.setState({
                siteTokenList: nextprops.siteTokenList
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
                //added by parth andhariya 
                if (this.props.ConfigurationShowCard === 1) {
                    this.props.getSiteTokenList({ IsMargin: 1 });
                } else {
                    this.props.getSiteTokenList({});
                }
                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
            } else if (nextprops.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }
    }

    //Set State For open add data component
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

    //Set State For open Edit data component and set edit data
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

    // /used for open drawer  and set component
    showComponent = (componentName, menuDetail) => {

        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                componentName: componentName,
                open: !this.state.open,
            });
        }

    }

    // Toggle drawer and set component
    toggleDrawer = () => {
        this.setState({
            open: !this.state.open,
            componentName: '',
            addData: false,
            editData: false
        })
    }


    // close drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            addData: false,
            editData: false,
            componentName: '',
        });
    }

    //render before render
    // componentDidMount() {
    //     //added by parth andhariya 
    //     if (this.props.ConfigurationShowCard === 1) {
    //         this.props.getSiteTokenList({ IsMargin: 1 });
    //     } else {
    //         this.props.getSiteTokenList({});
    //     }
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
    render() {
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
                title: this.props.ConfigurationShowCard === 1 ? <IntlMessages id="sidebar.marginTrading" /> : <IntlMessages id="sidebar.trading" />,
                link: '',
                index: 0
            },
            {
                title: <IntlMessages id="card.list.title.configuration" />,
                link: '',
                index: 1
            },
            {
                title: <IntlMessages id="sidebar.siteToken" />,
                link: '',
                index: 2
            }
        ];

        const { drawerClose } = this.props;

        var menuPermissionDetail = this.checkAndGetMenuAccessDetail(this.props.ConfigurationShowCard === 1 ? '42F80880-2041-A374-078D-85E1961564F8' : '92A74EEC-89FB-9FF9-6A7C-F730BB413010'); //92A74EEC-89FB-9FF9-6A7C-F730BB413010  &&  margin_GUID   42F80880-2041-A374-078D-85E1961564F8
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

        const columns = [
            {
                name: <IntlMessages id="contactus.title.id" />,
            },
            {
                name: <IntlMessages id="table.currency" />,
            },
            {
                name: <IntlMessages id="sidebar.sitetoken.basecurrency" />,
            },
            {
                name: <IntlMessages id="trading.placeorder.buttonTab.limit" />,
            },
            {
                name: <IntlMessages id="sidebar.sitetoken.dailylimit" />,
            },
            {
                name: <IntlMessages id="sidebar.sitetoken.weeklylimit" />,
            },
            {
                name: <IntlMessages id="sidebar.sitetoken.monthlylimit" />,
            },
            {
                name: <IntlMessages id="lable.status" />,
                options: {
                    filter: true,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <span
                                className={classnames({
                                    "badge badge-danger": value === 0,
                                    "badge badge-success": value === 1,
                                })}
                            >
                                {this.props.intl.formatMessage({
                                    id: "wallet.historyStatus." + value,
                                })}
                            </span>
                        );
                    },
                },
            }, {
                name: <IntlMessages id="sidebar.pairConfiguration.list.lable.action" />,
            }
        ];

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
                                this.onAddData(this.checkAndGetMenuAccessDetail(this.props.ConfigurationShowCard === 1 ? '42F80880-2041-A374-078D-85E1961564F8' : '92A74EEC-89FB-9FF9-6A7C-F730BB413010').HasChild);//65220C3F-9441-731C-0314-F877DE9252E5   &&  margin_GUID  3AE6A18B-6572-5C14-6D29-AB56F981A57A
                                this.showComponent('AddSiteToken', this.checkAndGetMenuAccessDetail(this.props.ConfigurationShowCard === 1 ? '42F80880-2041-A374-078D-85E1961564F8' : '92A74EEC-89FB-9FF9-6A7C-F730BB413010').HasChild);//65220C3F-9441-731C-0314-F877DE9252E5   &&  margin_GUID  3AE6A18B-6572-5C14-6D29-AB56F981A57A
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
                {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}

                <WalletPageTitle title={<IntlMessages id="sidebar.siteToken" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />

                <div className="StackingHistory">
                    <MUIDataTable
                        title={this.props.title}
                        data={this.state.siteTokenList.length !== 0 && this.state.siteTokenList.map((item, key) => {
                            return [
                                key + 1,
                                item.CurrencySMSCode,
                                item.BaseCurrencySMSCode,
                                item.MinLimit + " - " + item.MaxLimit,
                                item.DailyLimit,
                                item.WeeklyLimit,
                                item.MonthlyLimit,
                                item.Status === 9 ? 0 : item.Status,
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
                                                        this.onEditData(item, this.checkAndGetMenuAccessDetail(this.props.ConfigurationShowCard === 1 ? '42F80880-2041-A374-078D-85E1961564F8' : '92A74EEC-89FB-9FF9-6A7C-F730BB413010').HasChild) // 863A3044-7582-9E9F-402C-0244217693EA    &&  margin_GUID  DF499F0B-2096-555A-9CF0-2B2C711DA35D
                                                        this.showComponent('UpdateSiteToken', this.checkAndGetMenuAccessDetail(this.props.ConfigurationShowCard === 1 ? '42F80880-2041-A374-078D-85E1961564F8' : '92A74EEC-89FB-9FF9-6A7C-F730BB413010').HasChild); //863A3044-7582-9E9F-402C-0244217693EA    &&  margin_GUID  DF499F0B-2096-555A-9CF0-2B2C711DA35D
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
                    width="50%"
                    handler={false}
                    open={this.state.open}
                    // onMaskClick={this.toggleDrawer}
                    className="drawer2 half_drawer"
                    level=".drawer0"
                    placement="right"
                    levelMove={100}
                >
                    {this.state.addData &&
                        <AddSiteToken {...this.props} drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
                    }

                    {this.state.editData && this.state.editDetails &&
                        <UpdateSiteToken {...this.props} selectedData={this.state.editDetails} drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
                    }
                </Drawer>
            </div>
        )
    }
}

const mapStateToProps = ({ siteToken, drawerclose, authTokenRdcer }) => {
    const { siteTokenList, loading } = siteToken;
    const { menuLoading, menu_rights } = authTokenRdcer;
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    return { siteTokenList, loading, drawerclose, menuLoading, menu_rights };
};

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        getSiteTokenList,
        getMenuPermissionByID
    }
)(injectIntl(SiteToken));
