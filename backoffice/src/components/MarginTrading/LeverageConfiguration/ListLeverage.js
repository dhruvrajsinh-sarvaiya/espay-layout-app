/* 
    Developer : vishva shah
    Date : 18-02-2019
    File Comment : ListLeverage Component
*/
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { Form, FormGroup, Label, Input, Alert } from "reactstrap";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import Drawer from "rc-drawer";
import MatButton from "@material-ui/core/Button";
import "rc-drawer/assets/index.css";
import IntlMessages from "Util/IntlMessages";
import { injectIntl } from 'react-intl';
import classnames from "classnames";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import MUIDataTable from "mui-datatables";
import { changeDateFormat } from "Helpers/helpers";
import AddLeverageForm from "./AddLeverageForm";
import EditLeverageForm from "./EditLeverageForm";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
import { NotificationManager } from "react-notifications";
import {
    getListLeverage,
    removeLeverage
} from "Actions/MarginTrading/LeverageConfiguration";
import {
    getWalletType
} from "Actions/WalletUsagePolicy";
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
const buttonSizeSmall = {
    maxHeight: "28px",
    minHeight: "28px",
    maxWidth: "28px",
    fontSize: "1rem"
};

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
        title: <IntlMessages id="sidebar.marginTrading" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="wallet.LeverageConfiguration" />,
        link: '',
        index: 1
    },
];

const initState = {
    Id: 0,
    showDialog: false,
    showError: false,
    showSuccess: false,
    responseMessage: "",
    open: false,
    componentName: "",
    WalletTypeId: "",
    Status: "",
    showError: false,
    showSuccess: false,
    responseMessage: "",
    menuDetail: "",
    showReset: false,
    menudetail: [],
    notificationFlag: true,
}
const components = {
    AddLeverageForm: AddLeverageForm,
    EditLeverageForm: EditLeverageForm,
};
// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, pagedata, Id, menuDetail) => {
    return React.createElement(components[TagName], {
        props,
        drawerClose,
        closeAll,
        pagedata,
        Id,
        menuDetail
    });
};
class ListLeverage extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }
    //component will mount fetch raw data...
    componentWillMount() {
        this.props.getMenuPermissionByID('3A1F18E1-8613-647C-3BE2-F24DC9870A27'); // get wallet menu permission
        // this.props.getWalletType({ Status: 1 });
        // this.props.getListLeverage({});
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
            })
        }
        if (nextProps.removeRecord.hasOwnProperty("ReturnCode")) {
            if (nextProps.removeRecord.ReturnCode == 0) {
                NotificationManager.success(<IntlMessages id="common.form.delete.success" />);
                this.props.getListLeverage({})

            } else if (nextProps.removeRecord.ReturnCode !== 0) {     //failed
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.removeRecord.ErrorCode}`} />);
            }
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getWalletType({ Status: 1 });
                this.props.getListLeverage({});
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }
    }
    // toggle drawer...
    toggleDrawer = () => {
        // this.setState(initState);
        this.setState({
            open: !this.state.open,
            pagedata: {}
        });
    };

    // force closed drawer...
    onClose = () => {
        this.setState({
            open: false,
            pagedata: {},
        });
    };
    // close all drawer...
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            pagedata: {}
        });
    };
    showComponent = (componentName, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                componentName: componentName,
                open: !this.state.open,
                pagedata: {},
                Id: this.state.Id,
                menuDetail: menuDetail
            });
        }
        else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    // on edit row data...
    onEditLeverage(item, menuDetail) {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({ open: true, componentName: "EditLeverageForm", pagedata: item, menuDetail: menuDetail })
        }
        else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    // remove record from list
    onDelete = () => {
        this.setState({ showDialog: false })
        if (this.state.Id) {
            this.props.removeLeverage(this.state.Id);
        }
    }
    // apply filter options
    applyFilter() {
        if (this.state.WalletTypeId !== "" || this.state.Status !== "") {
            this.props.getListLeverage({
                WalletTypeId: this.state.WalletTypeId,
                Status: this.state.Status
            });
            this.setState({ showReset: true });
        }
    }
    // onchange filter options
    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    //reset filter 
    clearFilter() {
        this.setState(initState);
        this.props.getListLeverage({});
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('BEA68939-55E6-4C3A-8A4B-6FB272FE9F9A'); //BEA68939-55E6-4C3A-8A4B-6FB272FE9F9A
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const { drawerClose, intl } = this.props;
        const columns = [
            {
                name: intl.formatMessage({ id: "wallet.lblSr" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.currency" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "wallet.LeveragePer" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "wallet.SafetyMarginPer" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "wallet.MarginChargePer" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.Status" }),
                options: {
                    sort: true,
                    filter: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <span className={classnames({
                                "badge badge-danger": (value === intl.formatMessage({ id: "sidebar.btnDisable" })),
                                "badge badge-success": (value === intl.formatMessage({ id: "sidebar.btnEnable" }))
                            })} >
                                {value}
                            </span>
                        );
                    }
                }
            },
            {
                name: intl.formatMessage({ id: "wallet.IsAutoApprove" }),
                options: { filter: true, sort: true }
            },
            {
                name: intl.formatMessage({ id: "wallet.LeverageChargeDeductionTypeName" }),
                options: { sort: true, filter: true }
            },
            {
                name: intl.formatMessage({ id: "table.action" }),
                options: { sort: false, filter: false }
            }
        ];
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            download: false,
            viewColumns: false,
            filter: true,
            print: false,
            search: false,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            customToolbar: () => {
                if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) {
                    return (
                        // <div className="StackingHistory">
                        <MatButton
                            variant="raised"
                            className="btn-primary text-white"
                            // style={{ float: "right" }}
                            onClick={() => this.showComponent("AddLeverageForm", this.checkAndGetMenuAccessDetail('BEA68939-55E6-4C3A-8A4B-6FB272FE9F9A').HasChild//6AA154A2-A775-8AAA-654D-A14360B57814
                            )}
                        >
                            <IntlMessages id="button.addNew" />
                        </MatButton>
                        // </div>
                    );
                } else {
                    return false;
                }
            },
        };
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="wallet.LeverageConfiguration" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <React.Fragment>
                    <Alert color="danger" isOpen={this.state.showError} toggle={(e) => this.setState({ showError: false })}>
                        {this.state.responseMessage}
                    </Alert>
                    <Alert color="success" isOpen={this.state.showSuccess} toggle={(e) => this.setState({ showSuccess: false })}>
                        {this.state.responseMessage}
                    </Alert>
                </React.Fragment>
                <div className="StackingHistory">
                    {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                    {menuPermissionDetail.Utility.indexOf('18736530') !== -1 &&
                        <JbsCollapsibleCard>
                            <div className="top-filter">
                                <Form className="tradefrm row">
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="WalletTypeId"><IntlMessages id="table.currency" /></Label>
                                        <Input type="select" name="WalletTypeId" id="WalletTypeId" value={this.state.WalletTypeId} onChange={(e) => this.onChangeHandler(e)}>
                                            <option value="">{intl.formatMessage({ id: "wallet.errCurrency" })}</option>
                                            {this.props.walletType.length && this.props.walletType.map((type, index) => (
                                                <option key={index} value={type.ID}>{type.TypeName}</option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Select-1"><IntlMessages id="widgets.status" /></Label>
                                        <Input type="select" name="Status" id="Status" value={this.state.Status} onChange={(e) => this.onChangeHandler(e)}>
                                            <option value="">{intl.formatMessage({ id: "wallet.errStatus" })}</option>
                                            <option value="0">{intl.formatMessage({ id: "wallet.Disable" })}</option>
                                            <option value="1">{intl.formatMessage({ id: "wallet.Enable" })}</option>
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <div className="btn_area">
                                            <Button
                                                color="primary"
                                                variant="raised"
                                                className="text-white"
                                                onClick={() => this.applyFilter()}
                                                disabled={this.state.WalletTypeId !== "" || this.state.Status !== "" ? false : true}
                                            ><IntlMessages id="widgets.apply" /></Button>
                                            {this.state.showReset && 
                                                <Button className="btn-danger text-white ml-10" onClick={(e) => this.clearFilter()}>
                                                    <IntlMessages id="bugreport.list.dialog.button.clear" />
                                                </Button>
                                            }
                                        </div>
                                    </FormGroup>
                                </Form>
                            </div>
                        </JbsCollapsibleCard>
                    }
                    <div className="StackingHistory">
                    <MUIDataTable
                        data={this.props.LeverageList.map((item, index) => {
                            return [
                                index + 1,
                                item.WalletTypeName,
                                parseInt(item.LeveragePer) + "X",
                                parseFloat(item.SafetyMarginPer).toFixed(8),
                                parseFloat(item.MarginChargePer).toFixed(8),
                                item.Status ? intl.formatMessage({ id: "sidebar.btnEnable" }) : intl.formatMessage({ id: "sidebar.btnDisable" }),
                                item.IsAutoApprove ? intl.formatMessage({ id: "sidebar.yes" }) : intl.formatMessage({ id: "sidebar.no" }),
                                intl.formatMessage({ id: 'wallet.deductionType.' + item.LeverageChargeDeductionType }),
                                <div className="list-action">
                                    {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && // check for edit permission
                                        <a
                                            className="mr-10"
                                            href="javascript:void(0)"
                                            onClick={() => this.onEditLeverage(item, this.checkAndGetMenuAccessDetail('BEA68939-55E6-4C3A-8A4B-6FB272FE9F9A').HasChild)}//2112237F-02D7-034D-6AF1-F6F0F20D3A8D
                                        >
                                            <i className="ti-pencil" />
                                        </a>
                                    }
                                    {menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 && // check for delete permission
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.setState({ showDialog: true, Id: item.Id })}
                                        >
                                            <i className="ti-close" />
                                        </a>
                                    }
                                </div>
                            ];
                        })}
                        columns={columns}
                        options={options}
                    />
                    </div>
                </div>
                <Drawer
                    width="40%"
                    handler={false}
                    open={this.state.open}
                    // onMaskClick={this.toggleDrawer}
                    className="drawer2 half_drawer"
                    level=".drawer1"
                    placement="right"
                    levelMove={100}
                >
                    {this.state.componentName !== "" &&
                        dynamicComponent(
                            this.state.componentName,
                            this.props,
                            this.onClose,
                            this.closeAll,
                            this.state.pagedata,
                            this.state.Id,
                            this.state.menuDetail
                        )}
                </Drawer>
                <Dialog
                    style={{ zIndex: '99999' }}
                    open={this.state.showDialog}
                    // onClose={() => this.setState({ showDialog: false })}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        <IntlMessages id="global.delete.message" />
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={() => this.onDelete()} className="btn-primary text-white" autoFocus>
                            <IntlMessages id="button.yes" />
                        </Button>
                        <Button onClick={() => this.setState({ showDialog: false })} className="btn-danger text-white">
                            <IntlMessages id="button.No" />
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

const mapStateToProps = ({ LeverageConfigReducer, walletUsagePolicy, drawerclose, authTokenRdcer }) => {
    // breadcrumb 
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { loading, LeverageList, removeRecord } = LeverageConfigReducer;
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { walletType } = walletUsagePolicy;
    return { loading, LeverageList, walletType, removeRecord, drawerclose, menuLoading, menu_rights };
};

export default connect(mapStateToProps, {
    getListLeverage,
    getWalletType,
    removeLeverage,
    getMenuPermissionByID
})(injectIntl(ListLeverage));
