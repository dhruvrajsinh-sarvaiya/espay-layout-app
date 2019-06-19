/* 
    Developer : Nishant Vadgama
    Date : 26-12-2018
    File Comment : Stacking Config List component
*/
import React, { Component } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import MUIDataTable from "mui-datatables";
import Drawer from "rc-drawer";
import Button from '@material-ui/core/Button';
import StakingConfigForm from './StakingConfigForm';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { injectIntl } from 'react-intl';
import classnames from "classnames";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import { NotificationManager } from "react-notifications";
import {
    getStakingConfigList,
    deleteStakingConfig,
    getStckingById
} from "Actions/Wallet";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
const components = {
    StakingConfigForm: StakingConfigForm,
};
// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, MasterDetails, PolicyDetailID) => {
    return React.createElement(components[TagName], {
        props,
        drawerClose,
        closeAll,
        MasterDetails,
        PolicyDetailID,
    });
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
        title: <IntlMessages id="sidebar.wallet" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="tokenStaking.lblStakingConfigList" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="tokenStaking.lblStakingPolicyList" />,
        link: '',
        index: 2
    },
];
const initialState = {
    MasterDetails: {},
    PolicyDetailID: 0,
    deleteId: "",
    componentName: "",
    open: false,
    StakingType: "",
    SlabType: "",
    Status: "",
    showDialog: false,
    menudetail: [],
    notification: true,
}

class StakingConfigList extends Component {
    // construct with initial state
    constructor(props) {
        super(props);
        this.state = initialState;
    }
    //drawer close all event
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false
        });
    };
    //drawer close all event
    close = () => {
        this.setState({
            open: false
        });
        this.setState({ PolicyDetailID: 0 });
    };
    // set component and open drawer
    showComponent = (componentName, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                open: true,
                PolicyDetailID: 0,
                componentName: componentName,
                // menuDetail: menuDetail
            });
        }
        else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('24CB0E8F-06D4-0AB7-8B21-76193A2F53D3'); // get wallet menu permission
    }
    //validate reponse on status change 
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notification: false });
        }
        // set master details...
        if (nextProps.MasterDetails.hasOwnProperty('Id')) {
            this.setState({ MasterDetails: nextProps.MasterDetails });
        }
        // validate success
        if (nextProps.delResponse.hasOwnProperty("ReturnCode")) {
            const intl = this.props.intl;
            if (nextProps.delResponse.ReturnCode == 0) {     //success
                NotificationManager.success(intl.formatMessage({ id: "wallet.stakingConfig.deletedMsg" }));
                if (this.state.MasterDetails.hasOwnProperty('Id')) {
                    this.props.getStakingConfigList({ PolicyMasterId: this.state.MasterDetails.Id });
                }
            } else if (nextProps.delResponse.ReturnCode !== 0) {     //failed
                NotificationManager.error(intl.formatMessage({ id: "apiWalletErrCode." + nextProps.masterDeleteResponse.ErrorCode }));
            }
        }
    }
    // on edit 
    onEdit = (recId, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.props.getStckingById(recId);
            this.setState({ open: true, componentName: "StakingConfigForm", PolicyDetailID: recId })
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    // hanlde delete operation
    onDelete = () => {
        this.setState({ showDialog: false })
        if (this.state.deleteId) {
            this.props.deleteStakingConfig(this.state.deleteId);
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('E3A44946-852D-1D9B-59DD-FC360E6E8A51'); //E3A44946-852D-1D9B-59DD-FC360E6E8A51
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const intl = this.props.intl;
        const { drawerClose } = this.props;
        const columns = [
            { name: intl.formatMessage({ id: "wallet.lblSr" }), options: { sort: true, filter: false } },
            { name: intl.formatMessage({ id: "table.currency" }), options: { sort: true, filter: true } },
            { name: intl.formatMessage({ id: "tokenStaking.stakingType" }), options: { sort: true, filter: true } },
            { name: intl.formatMessage({ id: "tokenStaking.slabType" }), options: { sort: true, filter: true } },
            { name: intl.formatMessage({ id: "tokenStaking.lblMonths" }), options: { sort: true, filter: false } },
            { name: intl.formatMessage({ id: "tokenStaking.lblWeeks" }), options: { sort: true, filter: false } },
            { name: intl.formatMessage({ id: "table.amount" }), options: { sort: true, filter: false } },
            {
                name: intl.formatMessage({ id: "table.status" }),
                options: {
                    sort: true,
                    filter: true,
                    customBodyRender: (value) => {
                        return (
                            <span className={classnames({
                                "badge badge-danger": (value === intl.formatMessage({ id: "sidebar.btnDisable" })),
                                "badge badge-success": (value === intl.formatMessage({ id: "sidebar.btnEnable" }))
                            })} >
                                {(value)}
                            </span>
                        );
                    }
                }
            },
            { name: intl.formatMessage({ id: "table.action" }), options: { sort: false, filter: false } },
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
                            className="btn-primary text-white mt-5"
                            // style={{ float: "right" }}
                            // onClick={() => this.setState({ open: true, componentName: "StakingConfigForm", PolicyDetailID: 0 })}    
                            onClick={() => this.showComponent("StakingConfigForm", (this.checkAndGetMenuAccessDetail('E3A44946-852D-1D9B-59DD-FC360E6E8A51').HasChild) //59FCC4A6-8459-46E3-6CCD-481A06B59F06
                            )}
                        >
                            <IntlMessages id="button.addNew" />
                        </Button>
                    );
                } else {
                    return false;
                }
            }
        };
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="tokenStaking.lblStakingPolicyList" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {this.props.loading && <JbsSectionLoader />}
                <div className="StackingHistory">
                    <MUIDataTable
                        data={this.props.stakinList.map((item, index) => {
                            return [
                                index + 1,
                                item.StakingCurrency,
                                item.StakingTypeName,
                                item.SlabTypeName,
                                item.DurationMonth,
                                item.DurationWeek,
                                item.AvailableAmount,
                                item.Status ? intl.formatMessage({ id: "sidebar.btnEnable" }) : intl.formatMessage({ id: "sidebar.btnDisable" }),
                                <div className="list-action">
                                    {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 &&
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.onEdit(item.PolicyDetailID, this.checkAndGetMenuAccessDetail('E3A44946-852D-1D9B-59DD-FC360E6E8A51').HasChild)} //AD58442E-0C70-70A5-5A7A-FCCC7E8A8C2E
                                        >
                                            <i className="ti-pencil" />
                                        </a>
                                    }
                                    {menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 &&
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.setState({ showDialog: true, deleteId: item.PolicyDetailID })}
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
                    width="40%"
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
                            this.state.MasterDetails,
                            this.state.PolicyDetailID,
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
        )
    }
}

const mapStateToProps = ({ StakingConfigurationReducer, authTokenRdcer }) => {
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { loading, stakinList, delResponse } = StakingConfigurationReducer
    return { loading, stakinList, delResponse, menuLoading, menu_rights };
};

export default connect(mapStateToProps, {
    getStakingConfigList,
    deleteStakingConfig,
    getStckingById,
    getMenuPermissionByID
})(injectIntl(StakingConfigList));