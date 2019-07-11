// component for display provider configuration list By Tejas
import React, { Fragment } from "react";
import MUIDataTable from "mui-datatables";
import Tooltip from "@material-ui/core/Tooltip";
import MatButton from "@material-ui/core/Button";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import {
    getProviderConfigList,
} from "Actions/ProviderConfiguration";
import { connect } from "react-redux";
// intl messages
import IntlMessages from "Util/IntlMessages";
import AddProvider from './AddProviderConfiguration';
import UpdateProvider from './UpdateProviderConfiguration';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
import { NotificationManager } from "react-notifications";
import { Col } from 'reactstrap';
import classnames from "classnames";
import { injectIntl } from 'react-intl';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';


class ProviderConfigurationList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            providerConfigurationList: [],
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
        this.props.getMenuPermissionByID('37C0746C-0CCA-98F1-004D-AB2D38DC57AC'); // get wallet menu permission
    }
    componentWillReceiveProps(nextprops) {
        if (nextprops.providerConfigurationList) {
            this.setState({
                providerConfigurationList: nextprops.providerConfigurationList
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

                //code change by devang parekh (12-6-2019) for handle arbitrage configuration detail
                var reqObject = {};
                if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                    reqObject.IsArbitrage = this.props.IsArbitrage;
                }
                this.props.getProviderConfigList(reqObject);
                //end 
                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });

            } else if (nextprops.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
    }

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

    showComponent = (componentName, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
            });
        }
    }

    toggleDrawer = () => {
        this.setState({
            open: this.state.open ? false : true,
            componentName: '',
            addData: false,
            editData: false
        })
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            addData: false,
            editData: false,
            componentName: '',
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
    render() {

        const { drawerClose } = this.props;

        //added by jayshreeba Gohil for Arbiitrage breadcrumns (14/06/2019)
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
                    title: <IntlMessages id="sidebar.ArbitrageserviceProviderConfigurationList" />,
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
                    title: <IntlMessages id="sidebar.providerConfiguration" />,
                    link: '',
                    index: 2
                }
            ];
        }

        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('F713328D-5137-8E10-5020-861E757C39C6'); //F713328D-5137-8E10-5020-861E757C39C6
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

        const columns = [
            {
                name: <IntlMessages id="contactus.title.id" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="providerconfig.list.column.label.appKey" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="providerconfig.list.column.label.apikey" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="providerconfig.list.column.label.SecretKey" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="providerconfig.list.column.label.username" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="liquidityprovider.list.column.label.status" />,
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
                name: <IntlMessages id="liquidityprovider.list.column.label.action" />,
                options: { sort: true, filter: true }
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
            rowsPerPage: this.state.Page_Size,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            customToolbar: () => {
                if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
                    return (
                        <MatButton
                            variant="raised"
                            className="btn-primary text-white"
                            onClick={() => {
                                this.onAddData(this.checkAndGetMenuAccessDetail('F713328D-5137-8E10-5020-861E757C39C6').HasChild); // 54C1F160-9EB9-485F-20A7-22081A2D7A67
                                this.showComponent('AddProvider', this.checkAndGetMenuAccessDetail('F713328D-5137-8E10-5020-861E757C39C6').HasChild); // 54C1F160-9EB9-485F-20A7-22081A2D7A67
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
            <div className="table-wrapper jbs-page-content">
                {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                {/* {added by jayshreeba gohil for Aritrage breadcrumns (14/06/2019)} */}
                {data.IsArbitrage != undefined && data.IsArbitrage == 1 ? <WalletPageTitle title={<IntlMessages id="sidebar.ArbitrageserviceProviderConfigurationTitle"/>} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} /> : <WalletPageTitle title={<IntlMessages id="sidebar.providerConfiguration" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />}

                <Col md={12}>
                    <MUIDataTable
                        title={this.props.title}
                        data={this.state.providerConfigurationList.length !== 0 && this.state.providerConfigurationList.map((item, key) => {
                            return [
                                item.Id,
                                item.AppKey,
                                item.APIKey,
                                item.SecretKey,
                                item.UserName,
                                item.StatusText === "Active" ? this.props.intl.formatMessage({ id: "wallet.Active" }) : this.props.intl.formatMessage({ id: "wallet.Inactive" }),
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
                                                        this.onEditData(item, this.checkAndGetMenuAccessDetail('F713328D-5137-8E10-5020-861E757C39C6').HasChild) // 733FCB30-158F-2477-32B4-1E70EE8A4DD6
                                                        this.showComponent('UpdateProvider', this.checkAndGetMenuAccessDetail('F713328D-5137-8E10-5020-861E757C39C6').HasChild); // 733FCB30-158F-2477-32B4-1E70EE8A4DD6
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
                </Col>
                <Drawer
                    width="50%"
                    handler={false}
                    open={this.state.open}
                    // onMaskClick={this.toggleDrawer}
                    className="drawer2 drawer1 half_drawer"
                    level=".drawer1"
                    placement="right"
                    levelMove={100}
                >
                    {this.state.addData &&
                        <AddProvider {...this.props} drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
                    }
                    {this.state.editData && this.state.editDetails &&
                        <UpdateProvider {...this.props} selectedData={this.state.editDetails} drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
                    }
                </Drawer>
            </div>
        )
    }
}

const mapStateToProps = ({ ProviderConfig, drawerclose, authTokenRdcer }) => {
    const { providerConfigurationList, loading } = ProviderConfig;
    const { menuLoading, menu_rights } = authTokenRdcer;
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    return { providerConfigurationList, loading, drawerclose, menuLoading, menu_rights };
};

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        getProviderConfigList,
        getMenuPermissionByID
    }
)(injectIntl(ProviderConfigurationList));


//export default ProviderConfigurationList;