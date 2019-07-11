// component for Api plan Configuration List By Tejas 21/2/2019

import React, { Fragment } from 'react';

// used for connect component to store
import { connect } from "react-redux";

// import data table
import MUIDataTable from "mui-datatables";

import Switch from '@material-ui/core/Switch';

//  Used For Display Notification 
import { NotificationManager } from "react-notifications";

// import for Pop over
import { Button, Col, Row, Modal, ModalBody, ModalFooter, Label, Input, FormGroup } from 'reactstrap';

// import tooltip
import Tooltip from "@material-ui/core/Tooltip";

// impport button 
import MatButton from "@material-ui/core/Button";

// used for drawer for open and edit form
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

// intl messages
import IntlMessages from "Util/IntlMessages";

import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';

import AppConfig from 'Constants/AppConfig';

// import action for fetch Api plan configuration list
import {
    getApiPlanConfigList,
    getRestMethodReadOnly,
    getRestMethodFullAccess,
    enableDisableAPIPlan
} from "Actions/ApiKeyConfiguration";

// used for display loader 
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// component for add and update
import AddApiPlan from './AddApiPlanConfiguration';
import UpdateApiPlan from './UpdateApiPlanConfiguration';
import ViewApiPlan from "./ViewApiPlanConfiguration";

// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
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
        title: <IntlMessages id="sidebar.ApiKeyConfiguration" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.APIPlanConfiguration" />,
        link: '',
        index: 1
    }
];

// class for Api plan Configuration List By Tejas 21/2/2019
class ApiPlanConfiguration extends React.Component {

    // constructor that defines default state
    constructor(props) {
        super(props);
        this.state = {
            apiPlanConfigList: [],
            open: false,
            addData: false,
            editData: false,
            editDetails: [],
            componentName: '',
            ViewList: false,
            selectedRow: [],
            restApiReadOnly: [],
            restApiFullAccess: [],
            openModalDisable: false,
            openModalEnable: false,
            disableData: {},
            enableData: {},
            allowAPIKey: 0,
            disableAPI: 0,
            IsSelected: 0,
            enable: false,
            notificationFlag: true,
            menudetail: [],
        };
    }

    // set handleChange Event for Switch button
    handleChange = name => event => {
        this.setState({ IsSelected: event.target.checked });
    };

    // used fro close Modal for Disable Plan
    closeModal = () => {
        this.setState({
            openModalDisable: false,
            openModalEnable: false,
            disableData: {},
            enableData: {},
            allowAPIKey: 0
        })
    }

    // Call API for Disable plan And set Request
    DisableApiPlan = () => {
        const data = {
            PlanId: this.state.disableData.ID,
            Status: 0,
            AllowAPIKey: this.state.allowAPIKey
        }

        this.setState({
            disableAPI: 1,
        })

        this.props.enableDisableAPIPlan(data)
    }

    // call Api for Enable APi plan and set request
    EnableAPIPlan = () => {
        const data = {
            PlanId: this.state.enableData.ID,
            Status: 1
        }

        this.setState({
            disableAPI: 1,
            enable: true
        })

        this.props.enableDisableAPIPlan(data)
    }

    // Set OR Open Dialog box for display List
    onViewList = (List, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                selectedRow: List,
                ViewList: true,
                addData: false,
                editData: false,
            })
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    // open drawer and set data for add new request
    onAddData = (menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                addData: true,
                editData: false,
                ViewList: false,
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
                ViewList: false,
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

    // set State for Allow APi key
    handleChangeAllowAPIKey = (e) => {
        this.setState({
            allowAPIKey: e.target.value
        })
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


    // invoke after render and call api for get list
    // componentDidMount() {
    //     this.props.getApiPlanConfigList({})
    //     this.props.getRestMethodReadOnly({})
    //     this.props.getRestMethodFullAccess({})
    // }
    componentWillMount() {
        this.props.getMenuPermissionByID('573F4C2A-7BCB-9AF6-285D-1E82CEEE7B5C'); // get Trading menu permission
    }
    // invoke when component is about to get props
    componentWillReceiveProps(nextProps) {
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
            })
        }
        // setstate for api Plan Config List
        if (nextProps.apiPlanConfigList) {
            this.setState({
                apiPlanConfigList: nextProps.apiPlanConfigList
            })
        }

        // set rest apis data
        if (nextProps.restMethodReadOnly) {
            this.setState({
                restApiReadOnly: nextProps.restMethodReadOnly
            })
        }

        // set rest apis data
        if (nextProps.restMethodFullAccess) {
            this.setState({
                restApiFullAccess: nextProps.restMethodFullAccess
            })
        }

        if (nextProps.enableDisablePlanData !== null && this.state.disableAPI === 1) {
            if (this.state.enable === true) {
                NotificationManager.success(<IntlMessages id="sidebar.apiplan.enable.success.apiplan" />)
            } else {
                NotificationManager.success(<IntlMessages id="sidebar.apiplan.disable.success.apiplan" />)
            }
            this.setState({
                openModalDisable: false,
                openModalEnable: false,
                disableData: {},
                enableData: {},
                allowAPIKey: 0,
                disableAPI: 0,
                enable: false
            })
            this.props.getApiPlanConfigList({})
        } else if (nextProps.enableDisablePlanError && this.state.disableAPI === 1) {
            this.setState({
                openModalDisable: false,
                openModalEnable: false,
                disableData: {},
                enableData: {},
                allowAPIKey: 0,
                disableAPI: 0,
                enable: false
            })
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextProps.enableDisablePlanError.ErrorCode}`} />);
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getApiPlanConfigList({})
                this.props.getRestMethodReadOnly({})
                this.props.getRestMethodFullAccess({})
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }
    }

    // open modal for disable api plan
    DisablePlan = (item, accessPermission) => {
        if (accessPermission !== -1) {
            this.setState({
                openModalDisable: true,
                disableData: item,
                enableData: {},
                openModalEnable: false
            })
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }

    }

    EnablePlan = (item) => {
        this.setState({
            openModalEnable: true,
            enableData: item,
            disableData: {},
            openModalDisable: false
        })
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
    // renders the component
    render() {

        const { drawerClose } = this.props;

        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('FD169CF2-5F24-8A1D-7E08-24C6F2801E07'); //FD169CF2-5F24-8A1D-7E08-24C6F2801E07
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

        // defines columns header
        const columns = [
            {
                name: <IntlMessages id="apiplanconfiguration.title.planname" />,
            },
            {
                name: <IntlMessages id="apiplanconfiguration.title.planvalidity" />
            },
            {
                name: <IntlMessages id="sidebar.priority" />,
                options: { sort: true, filter: false }
            },
            {
                name: <IntlMessages id="widgets.price" />,
            },
            {
                name: <IntlMessages id="table.charge" />,
            },
            {
                name: <IntlMessages id="apiplanconfiguration.title.planrecursive" />
            },
            {
                name: <IntlMessages id="sidebar.Status" />,
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
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            download: false,
            viewColumns: false,
            filter: false,
            customToolbar: () => {
                if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
                    return (
                        <MatButton
                            variant="raised"
                            className="btn-primary text-white"
                            onClick={() => {
                                this.onAddData(this.checkAndGetMenuAccessDetail('FD169CF2-5F24-8A1D-7E08-24C6F2801E07').HasChild); // BB50CE7C-41A1-1D58-21D4-034001C15CF5
                                this.showComponent('AddApiPlan', this.checkAndGetMenuAccessDetail('FD169CF2-5F24-8A1D-7E08-24C6F2801E07').HasChild); // BB50CE7C-41A1-1D58-21D4-034001C15CF5
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
            <React.Fragment>
                <div className="jbs-page-content">
                    {
                        (this.props.loading
                            || this.props.restReadLoading
                            || this.props.restfullLoading
                            || this.props.menuLoading
                        )

                        && <JbsSectionLoader />}
                    <WalletPageTitle title={<IntlMessages id="sidebar.APIPlanConfiguration" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="StackingHistory">
                        <MUIDataTable
                            title={this.props.title}
                            data={this.state.apiPlanConfigList.length !== 0 && this.state.apiPlanConfigList.map((item, key) => {
                                var status = item.Status == 1 ? <IntlMessages id="sidebar.active" /> : <IntlMessages id="sidebar.inactive" />
                                var plan = item.IsPlanRecursive == 1 ? <IntlMessages id="button.yes" /> : <IntlMessages id="sidebar.no" />
                                var type = item.PlanValidityType == 1 ? <IntlMessages id="sidebar.day" />
                                    : item.PlanValidityType == 2 ? <IntlMessages id="sidebar.month" /> :
                                        item.PlanValidityType == 3 ? <IntlMessages id="sidebar.year" /> : ""
                                return [
                                    item.PlanName,
                                    <Fragment>
                                        {item.PlanValidity}   {type}
                                    </Fragment>,
                                    item.Priority,
                                    item.Price,
                                    item.Charge,
                                    <Fragment>
                                        {plan}
                                    </Fragment>,
                                    <Fragment>
                                        {item.Status == "1" &&
                                            <span className="text-success">
                                                <Switch
                                                    checked={item.Status == 1}
                                                    onChange={() => this.DisablePlan(item, menuPermissionDetail.CrudOption.indexOf('419E988B'))}
                                                    value={item.Status}

                                                />
                                            </span>
                                        }
                                        {item.Status == "0" &&
                                            <span className="text-danger">
                                                <Switch
                                                    value={item.Status}
                                                    checked={item.Status == 1}
                                                    onChange={() => this.EnablePlan(item, menuPermissionDetail.CrudOption.indexOf('419E988B'))}
                                                />
                                            </span>
                                        }
                                        <div className={item.Status == "1" ? "text-success font-weight-bold" : "text-danger font-weight-bold"}>{status}</div>
                                    </Fragment>,
                                    <Fragment>
                                        <div className="list-action">
                                            {menuPermissionDetail.CrudOption.indexOf('6AF64827') !== -1 && // check edit curd operation ?
                                                <Tooltip title={<IntlMessages id="liquidityprovider.tooltip.view" />}
                                                    disableFocusListener disableTouchListener
                                                >
                                                    <a href="javascript:void(0)" className="mr-10" onClick={(event) => {
                                                        this.onViewList(item, this.checkAndGetMenuAccessDetail('FD169CF2-5F24-8A1D-7E08-24C6F2801E07').HasChild) // 0A04FF81-381D-A577-8A08-DB2D3ADD1B66
                                                        this.showComponent('ViewApiPlan', this.checkAndGetMenuAccessDetail('FD169CF2-5F24-8A1D-7E08-24C6F2801E07').HasChild) // 0A04FF81-381D-A577-8A08-DB2D3ADD1B66
                                                    }}><i className="ti-eye" />
                                                    </a>
                                                </Tooltip>}

                                            {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && // check view operation ?
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
                                                            this.onEditData(item, this.checkAndGetMenuAccessDetail('FD169CF2-5F24-8A1D-7E08-24C6F2801E07').HasChild) // 02F9DCD8-211C-351B-716B-F4B93F223D33
                                                            this.showComponent('UpdateApiPlan', this.checkAndGetMenuAccessDetail('FD169CF2-5F24-8A1D-7E08-24C6F2801E07').HasChild); // 02F9DCD8-211C-351B-716B-F4B93F223D33
                                                        }}
                                                    >
                                                        <i className="ti-pencil" />
                                                    </a>
                                                </Tooltip>}
                                        </div>
                                    </Fragment>
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
                        onMaskClick={this.toggleDrawer}
                        className="drawer2 half_drawer"
                        level=".drawer1"
                        placement="right"
                        levelMove={100}
                    >
                        {this.state.addData &&
                            <AddApiPlan {...this.props}
                                restApiReadOnly={this.state.restApiReadOnly}
                                restApiFullAccess={this.state.restApiFullAccess}
                                drawerClose={this.toggleDrawer}
                                closeAll={this.closeAll} />
                        }
                        {this.state.editData && this.state.editDetails &&
                            <UpdateApiPlan {...this.props}
                                restApiReadOnly={this.state.restApiReadOnly}
                                restApiFullAccess={this.state.restApiFullAccess}
                                selectedData={this.state.editDetails}
                                drawerClose={this.toggleDrawer}
                                closeAll={this.closeAll}
                            />
                        }
                        {this.state.ViewList && this.state.selectedRow &&
                            <ViewApiPlan {...this.props} selectedData={this.state.selectedRow} drawerClose={this.toggleDrawer} closeAll={this.closeAll} menudetail={this.state.menudetail} GUID="FD169CF2-5F24-8A1D-7E08-24C6F2801E07" />
                        }
                    </Drawer>
                    <Modal isOpen={this.state.openModalEnable}>
                        {this.props.enableDisablePlanLoading && <JbsSectionLoader />}
                        <h1 className="text-center mt-10">
                            <IntlMessages id="sidebar.apiplan.enable.title" />
                        </h1>
                        <ModalBody>
                            <Row className="m-0">
                                <div>
                                    <IntlMessages id="sidebar.apiplan.enable.title.text" />
                                </div>
                            </Row>
                        </ModalBody>

                        <ModalFooter>
                            <Row className="m-0">
                                <Button
                                    variant="raised"
                                    onClick={() => this.closeModal()}
                                    className="btn-danger text-white m-5"
                                >
                                    <span>
                                        <IntlMessages id="button.cancel" />
                                    </span>
                                </Button>

                                <Button
                                    variant="raised"
                                    onClick={() => this.EnableAPIPlan()}
                                    className="btn-info text-white m-5"
                                >
                                    <span>
                                        <IntlMessages id="liquidityprovider.list.option.label.enable" />
                                    </span>
                                </Button>
                            </Row>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={this.state.openModalDisable}>
                        {this.props.enableDisablePlanLoading && <JbsSectionLoader />}
                        <h1 className="text-center mt-10">
                            <IntlMessages id="sidebar.apiplan.disable.title" />
                        </h1>
                        <ModalBody>
                            <Row className="m-5">
                                <Col md={4}>
                                    {<IntlMessages id="apiplanconfiguration.title.planname" />}

                                </Col>

                                <Col md={8}>
                                    <p className="font-weight-bold">{this.state.disableData.PlanName}</p>
                                </Col>
                            </Row>
                            <Row className="m-5">
                                <Col md={4}>
                                    {<IntlMessages id="sidebar.apiplan.disable.allowAPIKey" />}
                                </Col>
                                <Col md={8}>
                                    <div >
                                        <FormGroup check>

                                            <Label check >
                                                <Input
                                                    type="radio"
                                                    name="access"
                                                    value={1}
                                                    checked={this.state.allowAPIKey === 1}
                                                    onChange={this.handleChangeAllowAPIKey}
                                                />{' '}
                                                {<IntlMessages id="sidebar.apiplan.disable.allowAPIKey.revokeAll" />}
                                            </Label>
                                        </FormGroup>
                                        <FormGroup check>
                                            <Label check>
                                                <Input
                                                    type="radio"
                                                    name="access"
                                                    value={0}
                                                    checked={this.state.allowAPIKey === 0}
                                                    onChange={this.handleChangeAllowAPIKey}
                                                />
                                                {<IntlMessages id="sidebar.apiplan.disable.allowAPIKey.publicKey" />}
                                            </Label>
                                        </FormGroup>
                                    </div>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Row className="m-0">
                                <Button
                                    variant="raised"
                                    onClick={() => this.closeModal()}
                                    className="btn-danger text-white m-5"
                                >
                                    <span>
                                        <IntlMessages id="button.cancel" />
                                    </span>
                                </Button>
                                <Button
                                    variant="raised"
                                    onClick={() => this.DisableApiPlan()}
                                    className="btn-info text-white m-5"
                                >
                                    <span>
                                        <IntlMessages id="sidebar.btnDisable" />
                                    </span>
                                </Button>
                            </Row>
                        </ModalFooter>
                    </Modal>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = ({ ApiPlanConfig, drawerclose, authTokenRdcer }) => {
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { apiPlanConfigList, loading, restMethodReadOnly, restReadLoading, restMethodFullAccess, restfullLoading, enableDisablePlanData, enableDisablePlanError, enableDisablePlanLoading } = ApiPlanConfig;
    return { apiPlanConfigList, loading, restMethodReadOnly, restReadLoading, restMethodFullAccess, restfullLoading, enableDisablePlanData, enableDisablePlanError, enableDisablePlanLoading, drawerclose, menuLoading, menu_rights }
}

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        getApiPlanConfigList,
        getRestMethodReadOnly,
        getRestMethodFullAccess,
        enableDisableAPIPlan,
        getMenuPermissionByID
    }
)(ApiPlanConfiguration);