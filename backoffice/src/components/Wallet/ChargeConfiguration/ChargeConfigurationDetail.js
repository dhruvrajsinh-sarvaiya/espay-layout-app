/**
 *   Developer : Parth Andhariya
 *   Date : 19-03-2019
 *   Component: Charge Configuration Detail
 */
import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import {
    getChargeConfigurationList,
    getChargeConfigurationDetailById,
    updateChargeConfigurationList,
} from "Actions/ChargeConfigurationAction";
import classnames from "classnames";
import {
    NotificationManager
} from "react-notifications";
import Drawer from "rc-drawer";
import ChargeConfigurationDetailForm from "./ChargeConfigurationDetailsForm";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import IntlMessages from "Util/IntlMessages";
import AppConfig from 'Constants/AppConfig';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
//components name
const components = {
    ChargeConfigurationDetailForm: ChargeConfigurationDetailForm,
};
// dynamic component binding
const dynamicComponent = (
    TagName,
    props,
    drawerClose,
    closeAll,
    MasterId,
    Form,
    walletTypeId,
) => {
    return React.createElement(components[TagName], {
        props,
        drawerClose,
        closeAll,
        MasterId,
        Form,
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
    {
        title: <IntlMessages id="lable.ChargeConfigurationDetail" />,
        link: '',
        index: 2
    },
];

class ChargeConfigurationDetail extends Component {
    // construct with initial state
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: "",
            Form: false,
            MasterId: props.MasterId,
            walletTypeId: props.walletTypeId,
            showDialog: false,
            deleteRecord: null,
            notificationFlag: false,
            menudetail: [],
            notification: true,
        };
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('B5CC5A29-382B-03DE-7D5F-6D026CB26AD9'); // get wallet menu permission
    }
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                // this.props.ListChargeConfiguration({});
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notification: false });
        }
        if (nextProps.updateDetails.hasOwnProperty("ReturnCode") && this.state.notificationFlag) {
            this.setState({ notificationFlag: false });
            //faild
            if (nextProps.updateDetails.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id="news.form.deletenews_success" />);
                setTimeout(function () {
                    this.props.getChargeConfigurationList({ MasterId: this.state.MasterId })
                }.bind(this), 3000);
            } else if (nextProps.updateDetails.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.updateDetails.ErrorCode}`} />);
            }
        }
        //to get updated masterId from parant 
        this.setState({ MasterId: nextProps.MasterId, walletTypeId: nextProps.walletTypeId })
    }
    //method for close all inner compomnents
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false
        });
    };
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
    //method for edit form open and call api
    onEditChargeConfig(item, menuDetail) {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                componentName: "ChargeConfigurationDetailForm",
                open: true,
                Form: true,
                // menuDetail:menuDetail
            });
            this.props.getChargeConfigurationDetailById(
                item.ChargeConfigDetailId
            );
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    //drawer close
    close = () => {
        this.setState({
            open: false
        });
    };
    // hanlde delete action
    onDelete = () => {
        this.setState({ showDialog: false, notificationFlag: true })
        const { deleteRecord } = this.state;
        if (deleteRecord) {
            deleteRecord.Status = 9;
            this.props.updateChargeConfigurationList(deleteRecord);
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('FAA37144-6DFF-7514-4273-A6C349C270DE'); //FAA37144-6DFF-7514-4273-A6C349C270DE
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const intl = this.props.intl;
        const columns = [
            {
                name: intl.formatMessage({ id: "wallet.lblSr" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.ChargeType" }),
                options: { sort: true, filter: true }
            },
            {
                name: intl.formatMessage({ id: "lable.WalletTypeName" }),
                options: { sort: true, filter: true }
            },
            {
                name: intl.formatMessage({ id: "table.charge" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.MakerCharge" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.TakerCharge" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "sidebar.Status" }),
                options: {
                    sort: true,
                    filter: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
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
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "sidebar.colAction" }),
                options: { sort: true, filter: false }
            }
        ];
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            download: false,
            viewColumns: false,
            filter: menuPermissionDetail.Utility.indexOf('18736530') !== -1, //for check search permission,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            customToolbar: () => {
                if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
                    return (
                        <Button
                            variant="raised"
                            className="btn-primary text-white mt-5"
                            // style={{ float: "right" }}
                            onClick={() => this.showComponent("ChargeConfigurationDetailForm", (this.checkAndGetMenuAccessDetail('FAA37144-6DFF-7514-4273-A6C349C270DE').HasChild)  //24DC250B-A773-3FF0-5B86-8381F6906D59
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
        const { drawerClose } = this.props;
        return (
            <div className="jbs-page-content">
                {(this.props.menuLoading || this.props.loading) && <JbsSectionLoader />}
                <WalletPageTitle title={intl.formatMessage({ id: "lable.ChargeConfigurationDetail" })} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="StackingHistory">
                    <MUIDataTable
                        data={this.props.Details.map((item, index) => {
                            return [
                                (index + 1),
                                item.ChargeType === 1 ? intl.formatMessage({ id: "wallet,lblFixed" }) : intl.formatMessage({ id: "wallet,lblRange" }),
                                item.WalletTypeName,
                                item.ChargeValue.toFixed(2) + (item.ChargeValueType === 2 ? "%" : ""),
                                item.MakerCharge.toFixed(8),
                                item.TakerCharge.toFixed(8),
                                item.Status ? intl.formatMessage({ id: "wallet.Active" }) : intl.formatMessage({ id: "wallet.Inactive" }),
                                item.Remarks,
                                <div className="list-action">
                                    {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 &&
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.onEditChargeConfig(item, this.checkAndGetMenuAccessDetail('FAA37144-6DFF-7514-4273-A6C349C270DE').HasChild)} //1550242F-3C36-8153-999D-D415365B5700</div>/
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
                    <Drawer
                        width="50%"
                        handler={false}
                        open={this.state.open}
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
                                this.state.MasterId,
                                this.state.Form,
                                this.state.walletTypeId,
                                // this.state.menuDetail
                            )}
                    </Drawer>
                    {this.props.loading && <JbsSectionLoader />}
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
            </div>
        );
    }
}

//map method
const mapStateToProps = ({ ChargeConfiguration, authTokenRdcer }) => {
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { Details, loading, addDetails, getDetails, updateDetails } = ChargeConfiguration;
    return {
        Details, loading, addDetails, getDetails, updateDetails, menuLoading, menu_rights
    };
};

export default connect(
    mapStateToProps,
    { getChargeConfigurationList, getChargeConfigurationDetailById, updateChargeConfigurationList, getMenuPermissionByID }
)(injectIntl(ChargeConfigurationDetail));
