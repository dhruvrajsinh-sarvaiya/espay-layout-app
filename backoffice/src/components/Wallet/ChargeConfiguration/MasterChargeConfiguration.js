/* 
    Developer : Parth Andhariya
    Date : 18-03-2019
    File Comment : Master Charge Configuration
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import Button from "@material-ui/core/Button";
import Drawer from "rc-drawer";
import { injectIntl } from "react-intl";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import classnames from "classnames";
//Add and Edit Form Import
import MasterChargeConfigurationForm from "./MasterChargeConfigurationForm";
//added for display carge configuration detail records
import ChargeConfigurationDetail from "./ChargeConfigurationDetail";
//action for Charge Configuration Detail
import { ListChargeConfiguration, getChargeConfigurationById, getChargeConfigurationList, UpdateChargesConfiguration } from "Actions/ChargeConfigurationAction/ChargeConfigurationAction";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import IntlMessages from "Util/IntlMessages";
import AppConfig from 'Constants/AppConfig';
import { NotificationManager } from "react-notifications";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//added by parth andhariya
//components names
const components = {
    ChargeConfigurationDetail: ChargeConfigurationDetail,
    MasterChargeConfigurationForm: MasterChargeConfigurationForm
};
// dynamic component binding
const dynamicComponent = (
    TagName,
    props,
    drawerClose,
    closeAll,
    Form,
    MasterId,
    walletTypeId,
) => {
    return React.createElement(components[TagName], {
        props,
        drawerClose,
        closeAll,
        Form,
        MasterId,
        walletTypeId,
    });
};
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
        title: <IntlMessages id="sidebar.walletMenu" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="lable.ChargeConfiguration" />,
        link: '',
        index: 1
    },
];
//initial state
const initstate = {
    open: false,
    errors: "",
    componentName: "",
    Form: false,
    MasterId: "",
    walletTypeId: "",
    deleteRecord: null,
    showDialog: false,
    notificationFlag: false,
    menudetail: [],
    notification: true,
};

class MasterChargeConfiguration extends Component {
    constructor(props) {
        super(props);
        this.state = initstate;
    }
    //close all drawers
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            editChargeConfigModel: false
        });
    };
    //drawer close all event
    close = () => {
        this.setState({
            open: false
        });
    };
    //api called here
    componentWillMount() {
        this.props.getMenuPermissionByID('96865BE7-6FF3-9585-30FF-4C7810883DBF'); // get wallet menu permission
    }
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.ListChargeConfiguration({});
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notification: false });
        }
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
            })
        }
        if (nextProps.updateData.hasOwnProperty("ReturnCode") && this.state.notificationFlag) {
            this.setState({ notificationFlag: false });
            // validate success foe Delete
            if (nextProps.updateData.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id="news.form.deletenews_success" />);
                setTimeout(function () {
                    this.props.ListChargeConfiguration({});
                }.bind(this), 1000);
            } else if (nextProps.updateData.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.updateData.ErrorCode}`} />);
            }
        }
    }
    // hanlde delete action
    onDelete = () => {
        this.setState({ showDialog: false, notificationFlag: true });
        const { deleteRecord } = this.state;
        if (deleteRecord) {
            deleteRecord.Status = 9;
            this.props.UpdateChargesConfiguration(deleteRecord);
        }
    }
    //method for edit form open and call api
    onEditChargeConfig(ListChargeConfiguration, menuDetail) {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                componentName: "MasterChargeConfigurationForm",
                open: true,
                Form: true,
                // menuDetail:menuDetail
            });
            this.props.getChargeConfigurationById({
                MasterId: ListChargeConfiguration
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    //show Component
    showComponent(componentName, menuDetail) {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                componentName: componentName,
                open: true,
                Form: false,
                // menuDetail:menuDetail
            })
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    //method for display charge configuration detail table
    ListChargeConfigurationDtails(item, menuDetail) {
        // check permission go on next page or not
        if (menuDetail) {
            this.props.getChargeConfigurationList({ MasterId: item.Id });
            this.setState({
                open: true,
                componentName: "ChargeConfigurationDetail",
                MasterId: item.Id,
                walletTypeId: item.WalletTypeID
            });
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
        /* check menu permission */
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('B5CC5A29-382B-03DE-7D5F-6D026CB26AD9'); //B5CC5A29-382B-03DE-7D5F-6D026CB26AD9
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const intl = this.props.intl;
        const { drawerClose } = this.props;
        const columns = [
            {
                name: intl.formatMessage({ id: "wallet.lblSr" }),
                options: {
                    filter: false,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "lable.WalletTypeName" }),
                options: {
                    filter: true,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "wallet.trnType" }),
                options: {
                    filter: true,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "lable.KYCComplaint" }),
                options: {
                    filter: true,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "sidebar.Status" }),
                options: {
                    sort: true,
                    filter: true,
                    customBodyRender: (value) => {
                        return (
                            <span className={classnames({
                                "badge badge-danger": (value === intl.formatMessage({ id: "wallet.Inactive" })),
                                "badge badge-success": (value === intl.formatMessage({ id: "wallet.Active" }))
                            })} >
                                {value}
                            </span>
                        );
                    }
                }
            },
            {
                name: intl.formatMessage({ id: "table.Remarks" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "sidebar.colAction" }),
                options: {
                    filter: false,
                    sort: false
                }
            }
        ];
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            download: false,
            viewColumns: false,
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            filter: menuPermissionDetail.Utility.indexOf('18736530') !== -1, //for check search permission,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            textLabels: {
                body: {
                    noMatch: intl.formatMessage({ id: "wallet.emptyTable" }),
                    toolTip: intl.formatMessage({ id: "wallet.sort" })
                }
            },
            customToolbar: () => {
                if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
                    return (
                        <Button
                            variant="raised"
                            className="btn-primary text-white mt-5"
                            // style={{ float: "right" }}
                            onClick={() => this.showComponent("MasterChargeConfigurationForm", (this.checkAndGetMenuAccessDetail('B5CC5A29-382B-03DE-7D5F-6D026CB26AD9').HasChild)  //BEE7C897-231A-0D98-85FF-CB2ED9A10D07
                            )}
                        >
                            {intl.formatMessage({ id: "button.addNew" })}
                        </Button>
                    );
                } else {
                    return false;
                }
            }
        };
        return (
            <div className="jbs-page-content">
                {this.props.menuLoading && <JbsSectionLoader />}
                <WalletPageTitle title={intl.formatMessage({ id: "lable.ChargeConfiguration" })} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="StackingHistory">
                    {this.props.loading && <JbsSectionLoader />}
                    <MUIDataTable
                        data={this.props.ChargeData.map((item, key) => {
                            return [
                                (key + 1),
                                item.WalletTypeName,
                                item.TrnTypeName,
                                item.KYCComplaint === 1 ? intl.formatMessage({ id: "sidebar.yes" }) : intl.formatMessage({ id: "sidebar.no" }),
                                item.Status ? intl.formatMessage({ id: "wallet.Active" }) : intl.formatMessage({ id: "wallet.Inactive" }),
                                item.Remarks,
                                <div className="list-action">
                                    {menuPermissionDetail.CrudOption.indexOf('5645F321') !== -1 &&
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.ListChargeConfigurationDtails(item, this.checkAndGetMenuAccessDetail('B5CC5A29-382B-03DE-7D5F-6D026CB26AD9').HasChild)} // FAA37144-6DFF-7514-4273-A6C349C270DE
                                        >
                                            <i className="ti-list" />
                                        </a>
                                    }
                                    {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 &&
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.onEditChargeConfig(item.Id, this.checkAndGetMenuAccessDetail('B5CC5A29-382B-03DE-7D5F-6D026CB26AD9').HasChild)} //325D23B9-5C3C-74AD-2C7B-3C2010D22B3F
                                        >
                                            <i className="ti-pencil" />
                                        </a>
                                    }
                                    {menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 &&
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => {
                                                this.setState({ showDialog: true, deleteRecord: item })

                                            }}
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
                <Drawer
                    width={
                        this.state.componentName === "ChargeConfigurationDetail"
                            ? "100%"
                            : "50%"
                    }
                    handler={false}
                    open={this.state.open}
                    onMaskClick={this.toggleeditChargeConfigModel}
                    level=".drawer0"
                    className="drawer2 half_drawer"
                    placement="right"
                    levelMove={100}
                >
                    {this.state.componentName !== "" &&
                        dynamicComponent(
                            this.state.componentName,
                            this.props,
                            this.close,
                            this.closeAll,
                            this.state.Form,
                            this.state.MasterId,
                            this.state.walletTypeId,
                            // this.state.menuDetail
                        )}
                </Drawer>
                <Dialog
                    style={{ zIndex: '99999' }}
                    open={this.state.showDialog}
                    onClose={() => this.setState({ showDialog: false })}
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
                            <IntlMessages id="sidebar.btnNo" />
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

//map method
const mapStateToProps = ({ ChargeConfiguration, drawerclose, authTokenRdcer }) => {
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { ChargeData, loading, updateData } = ChargeConfiguration;
    return {
        drawerclose,
        ChargeData,
        loading,
        updateData,
        menuLoading,
        menu_rights
    };
};

export default connect(
    mapStateToProps,
    {
        ListChargeConfiguration,
        getChargeConfigurationById,
        getChargeConfigurationList,
        UpdateChargesConfiguration,
        getMenuPermissionByID
    }
)(injectIntl(MasterChargeConfiguration));
