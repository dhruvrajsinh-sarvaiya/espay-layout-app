// Components for Daemon Configuration
import React, { Fragment } from "react";

// action for get Daemon Config List
import { getDaemonData } from "Actions/DaemonConfigure";

// used for connect store
import { connect } from "react-redux";

// import drawer
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

// intl messages
import IntlMessages from "Util/IntlMessages";

// import data table for display data
import MUIDataTable from "mui-datatables";

// comopnent for open in a drawer
import AddDaemonConfiguration from './DaemonConfigurationAdd';
import EditDaemonConfiguration from './DaemonConfigurationEdit';

// used for button
import MatButton from "@material-ui/core/Button";

// used for display tool tip
import Tooltip from "@material-ui/core/Tooltip";

// used for loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

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

// bread crumb option
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
        title: <IntlMessages id="sidebar.daemon-configure" />,
        link: '',
        index: 2
    }
];


// class for daemon config
class DaemonConfigure extends React.Component {

    //define default state
    state = {
        daemonConfig: [],
        addDaemonResponse: [],
        daemonStatus: "",
        isUserNameValid: true,
        isPasswordValid: true,
        open: false,
        addData: false,
        editDetails: [],
        editData: false,
        componentName: '',
        Page_Size: AppConfig.totalRecordDisplayInList,
        menudetail: [],
        notificationFlag: true,
    };

    //invoke when component mount and call api for get daemon data
    componentWillMount() {
        this.props.getMenuPermissionByID('B63419C9-65B1-8AB8-6D06-EB4B0CC947AA'); // get wallet menu permission
        // this.props.getDaemonData({});
    }

    // invoke whenb component is about to get props and set state from props
    componentWillReceiveProps(nextprops) {
        if (nextprops.drawerclose.bit === 1 && nextprops.drawerclose.Drawersclose.open3 === false) {
            this.setState({
                open: false,
            })
        }
        // set state for daemon data
        if (nextprops.daemonConfig) {
            this.setState({
                daemonConfig: nextprops.daemonConfig
            });
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextprops.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
                this.props.getDaemonData({});
            } else if (nextprops.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
    }

    // used for display component in drawer and set component name
    showComponent = (componentName, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
            });
        }
    }

    // used for toggle drawer
    toggleDrawer = () => {
        this.setState({
            open: this.state.open ? false : true,
            componentName: '',
            addData: false,
            editData: false
        })
    }

    // used for close all drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            addData: false,
            editData: false,
            componentName: '',
        });
    }

    // open drawer and set form for add data
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

    // open drawer and set form for update  data and set state for selected data
    onEditDaemonConfiguration = (selectedData, menuDetail) => {
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
    };
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
    // renders the component
    render() {

        const rows = this.state.daemonConfig;
        const { drawerClose } = this.props;

        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('7AD7F010-2051-633A-1B25-66CAE2D81208'); //7AD7F010-2051-633A-1B25-66CAE2D81208
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        // define columns for data tables
        const columns = [
            {
                name: <IntlMessages id="daemonconfigure.IPAddress" />
            },
            {
                name: <IntlMessages id="daemonconfigure.portAddress" />
            },
            {
                name: <IntlMessages id="daemonconfigure.url" />
            },
            {
                name: <IntlMessages id="daemonconfigure.status" />,
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
                name: <IntlMessages id="daemonconfigure.action" />,
                options: { sort: false, filter: false }
            }
        ];

        // set options for table
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
                                this.onAddData(this.checkAndGetMenuAccessDetail('7AD7F010-2051-633A-1B25-66CAE2D81208').HasChild); // 3D23B8A7-25B8-57B2-510F-475E4F5F9475
                                this.showComponent('AddDeamonConfiguration', this.checkAndGetMenuAccessDetail('7AD7F010-2051-633A-1B25-66CAE2D81208').HasChild); // 3D23B8A7-25B8-57B2-510F-475E4F5F9475
                            }}
                        >
                            <IntlMessages id="daemonconfigure.list.button.add" />
                        </MatButton>
                    );
                } else {
                    return false;
                }

            },
            // customToolbarSelect: selectedRows => (
            //     <CustomToolbarSelect
            //         selectedRows={selectedRows}
            //         deleteDaemonConfigurationForm={this.props.deleteDeamonConfigurationForm}
            //         daemonConfigurationList={pairConfigurationList}
            //     />
            // )
        };

        // returns the component
        return (
            <div className="Daemon-wrapper mb-10 jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.daemon-configure" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {/* loader added by jinesh bhatt for display loader Date : 01-02-2019 */}
                {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                <Col md={12}>
                    <MUIDataTable
                        title=""
                        columns={columns}
                        data={rows.map(item => {
                            return [
                                item.IPAdd,
                                item.PortAdd,
                                item.Url,
                                item.StatusText === "Active" ? this.props.intl.formatMessage({ id: "wallet.Active" }) : this.props.intl.formatMessage({ id: "wallet.Inactive" }),
                                menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 ? // check edit curd operation ?
                                    <Fragment>
                                        <div className="list-action">
                                            <Tooltip
                                                title={
                                                    <IntlMessages id="daemonconfigure.list.button.edit" />
                                                }
                                                disableFocusListener disableTouchListener
                                            >
                                                <a
                                                    href="javascript:void(0)"
                                                    className="mr-10"
                                                    onClick={() => {
                                                        this.onEditDaemonConfiguration(item, this.checkAndGetMenuAccessDetail('7AD7F010-2051-633A-1B25-66CAE2D81208')); // 642D9BE4-2E44-55BA-3597-15B4573E869F
                                                        this.showComponent('EditDaemonConfiguration', this.checkAndGetMenuAccessDetail('7AD7F010-2051-633A-1B25-66CAE2D81208')); // 642D9BE4-2E44-55BA-3597-15B4573E869F
                                                    }}
                                                >
                                                    <i className="ti-pencil" />
                                                </a>
                                            </Tooltip>
                                        </div>
                                    </Fragment>
                                    : '-'
                            ]
                        })}

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
                        <AddDaemonConfiguration {...this.props} drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
                    }
                    {this.state.editData && this.state.editDetails &&
                        <EditDaemonConfiguration {...this.props} selectedData={this.state.editDetails} drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
                    }
                </Drawer>
            </div>
        );
    }
}

const mapStateToProps = ({ daemonConfigure, drawerclose, authTokenRdcer }) => {
    const { daemonConfig, loading } = daemonConfigure;
    const { menuLoading, menu_rights } = authTokenRdcer;
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    return { daemonConfig, loading, drawerclose, menuLoading, menu_rights };
};

// connect action with store for dispatch
export default connect(
    mapStateToProps,
    {
        getDaemonData,
        getMenuPermissionByID
    }
)(injectIntl(DaemonConfigure));
