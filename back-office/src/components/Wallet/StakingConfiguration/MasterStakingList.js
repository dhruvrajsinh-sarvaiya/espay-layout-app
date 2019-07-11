/* 
    Developer : Nishant Vadgama
    Date : 17-01-2019
    File Comment : Master staking list
*/
import React, { Component } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import MUIDataTable from "mui-datatables";
import Drawer from "rc-drawer";
import Button from '@material-ui/core/Button';
import MasterStakingForm from './MasterStakingForm';
import StakingConfigList from './StakingConfigList';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { FormGroup, Label, Input, Row, Col } from 'reactstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { injectIntl } from 'react-intl';
import classnames from "classnames";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
import { NotificationManager } from "react-notifications";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import {
    getWalletType,
} from "Actions/WalletUsagePolicy";
import {
    getMasterStakingList,
    deleteMasterStaking,
    getStakingConfigList
} from "Actions/Wallet";
const components = {
    MasterStakingForm: MasterStakingForm,
    StakingConfigList: StakingConfigList,
};
// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, MasterDetails) => {
    return React.createElement(components[TagName], {
        props,
        drawerClose,
        closeAll,
        MasterDetails,
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
];
const initialState = {
    MasterDetails: {},
    deleteId: "",
    componentName: "",
    open: false,
    StakingType: "",
    SlabType: "",
    Status: "",
    WalletTypeID: "",
    showReset: false,
    showDialog: false,
    // menuDetail: [],
    menudetail: [],
    notification: true,
}

class MasterStakingList extends Component {
    // construct with initial state
    constructor(props) {
        super(props);
        this.state = initialState;
    }
    //drawer close all event
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            MasterDetails: {}
        });
    };
    //drawer close all event
    close = () => {
        this.setState({
            open: false
        });
        this.setState({ MasterDetails: {} });
    };
    // set component and open drawer
    showComponent = (componentName, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
                // menuDetail: menuDetail
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    // component will mount actions
    componentWillMount() {
        this.props.getMenuPermissionByID('271B23A8-6D0A-9389-063B-B669B741931B'); // get wallet menu permission   
    }
    //validate reponse on status change 
    componentWillReceiveProps(nextProps) {
        const intl = this.props.intl;
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getMasterStakingList({});
                this.props.getWalletType({ Status: 1 });
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notification: false });
        }
        // validate success
        if (nextProps.masterDeleteResponse.hasOwnProperty("ReturnCode")) {
            if (nextProps.masterDeleteResponse.ReturnCode == 0) {     //success
                this.props.getMasterStakingList({});
                NotificationManager.success(intl.formatMessage({ id: "wallet.stakingConfig.deletedMsg" }));
            } else if (nextProps.masterDeleteResponse.ReturnCode > 0) {     //failed
                NotificationManager.error(intl.formatMessage({ id: "apiWalletErrCode." + nextProps.masterDeleteResponse.ErrorCode }));
            }
        }
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
            })
        }
    }
    // on edit ...
    onEdit = (MasterDetails, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({ open: true, componentName: "MasterStakingForm", MasterDetails: MasterDetails })
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    // hanlde delete operation...
    onDelete = () => {
        this.setState({ showDialog: false })
        if (this.state.deleteId) {
            this.props.deleteMasterStaking(this.state.deleteId);
        }
    }
    // show policy list...
    showList(MasterDetails, menuDetail) {
        // check permission go on next page or not
        if (menuDetail) {
            //get policy list
            this.props.getStakingConfigList({ PolicyMasterId: MasterDetails.Id });
            this.setState({ open: true, componentName: "StakingConfigList", MasterDetails: MasterDetails })
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    // input change handler...
    onChangeHandler(e, key) {
        e.preventDefault();
        this.setState({ [key]: e.target.value });
    }
    //Apply Filter option
    applyFilter = () => {
        this.props.getMasterStakingList({
            StakingType: this.state.StakingType,
            SlabType: this.state.SlabType,
            Status: this.state.Status,
            WalletTypeID: this.state.WalletTypeID,
        });
        this.setState({ showReset: true });
    }
    //clear filter
    clearFilter = () => {
        let newObj = Object.assign({}, this.initState);
        newObj.menudetail = this.state.menudetail;
        this.setState(newObj);
        this.props.getMasterStakingList({});
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('24CB0E8F-06D4-0AB7-8B21-76193A2F53D3'); //24CB0E8F-06D4-0AB7-8B21-76193A2F53D3
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
                                {value}
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
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            filter: false,
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
                            className="btn-primary text-white mt-5"
                            // style={{ float: "right" }}
                            onClick={() => this.showComponent("MasterStakingForm", this.checkAndGetMenuAccessDetail('24CB0E8F-06D4-0AB7-8B21-76193A2F53D3')
                            )} //EDFC12B0-5ABA-2D76-1D96-943D4538052F
                        >
                            <IntlMessages id="button.addNew" />
                        </Button>
                    );
                }
                else {
                    return false;
                }
            }
        };
        return (
            <div className="jbs-page-content">
                {this.props.menuLoading && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="tokenStaking.lblStakingConfigList" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {this.props.loading && <JbsSectionLoader />}
                {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && // filter permission check
                    <JbsCollapsibleCard>
                        <div className="col-md-12">
                            <div className="top-filter clearfix p-20">
                                <Row>
                                    <Col sm="2" md="2">
                                        <FormGroup className="mb-5">
                                            <Label for="WalletTypeID"><IntlMessages id="lable.currency" /></Label>
                                            <Input type="select" name="WalletTypeID" id="WalletTypeID" value={this.state.WalletTypeID} onChange={(e) => this.onChangeHandler(e, 'WalletTypeID')}>
                                                <IntlMessages id="wallet.errCurrency">
                                                    {(optionValue) => <option value="">{optionValue}</option>}
                                                </IntlMessages>
                                                {this.props.walletType.length > 0 && this.props.walletType.map((currency, key) => (
                                                    <option key={key} value={currency.ID}>{currency.TypeName}</option>
                                                ))}
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="2" md="2">
                                        <FormGroup className="mb-5">
                                            <Label for="StakingType"><IntlMessages id="tokenStaking.stakingType" /></Label>
                                            <Input type="select" name="StakingType" id="StakingType" value={this.state.StakingType} onChange={(e) => this.onChangeHandler(e, 'StakingType')}>
                                                <IntlMessages id="tokenStaking.selectstakingType">
                                                    {(optionValue) => <option value="">{optionValue}</option>}
                                                </IntlMessages>
                                                <IntlMessages id="tokenStaking.fixedDeposit">
                                                    {(optionValue) => <option value="1">{optionValue}</option>}
                                                </IntlMessages>
                                                <IntlMessages id="table.charge">
                                                    {(optionValue) => <option value="2">{optionValue}</option>}
                                                </IntlMessages>
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="2" md="2">
                                        <FormGroup className="mb-5">
                                            <Label for="SlabType"><IntlMessages id="tokenStaking.slabType" /></Label>
                                            <Input type="select" name="SlabType" id="SlabType" value={this.state.SlabType} onChange={(e) => this.onChangeHandler(e, 'SlabType')}>
                                                <IntlMessages id="tokenStaking.selectslabType">
                                                    {(optionValue) => <option value="">{optionValue}</option>}
                                                </IntlMessages>
                                                <IntlMessages id="wallet.Fixed">
                                                    {(optionValue) => <option value="1">{optionValue}</option>}
                                                </IntlMessages>
                                                <IntlMessages id="sidebar.trade.filterLabel.range">
                                                    {(optionValue) => <option value="2">{optionValue}</option>}
                                                </IntlMessages>
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="2" md="2">
                                        <FormGroup className="mb-5">
                                            <Label for="Status"><IntlMessages id="widgets.status" /></Label>
                                            <Input type="select" name="Status" id="Status" value={this.state.Status} onChange={(e) => this.onChangeHandler(e, 'Status')}>
                                                <IntlMessages id="wallet.errStatus">
                                                    {(optionValue) => <option value="">{optionValue}</option>}
                                                </IntlMessages>
                                                <IntlMessages id="sidebar.btnEnable">
                                                    {(optionValue) =>
                                                        <option value="1">{optionValue}</option>
                                                    }
                                                </IntlMessages>
                                                <IntlMessages id="sidebar.btnDisable">
                                                    {(optionValue) =>
                                                        <option value="0">{optionValue}</option>
                                                    }
                                                </IntlMessages>
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                    <FormGroup className="mb-5">
                                        <Label className="d-block">&nbsp;</Label>
                                        <Button
                                            color="primary"
                                            variant="raised"
                                            className="text-white"
                                            onClick={() => this.applyFilter()}
                                            disabled={(this.state.StakingType !== '' || this.state.SlabType !== '' || this.state.Status !== '' || this.state.WalletTypeID !== '') ? false : true}
                                        ><IntlMessages id="widgets.apply" /></Button>
                                    </FormGroup>
                                    {this.state.showReset && <FormGroup className="mb-5">
                                        <Label className="d-block">&nbsp;</Label>
                                        <Button className="btn-danger text-white ml-15" onClick={(e) => this.clearFilter()}>
                                            <IntlMessages id="bugreport.list.dialog.button.clear" />
                                        </Button>
                                    </FormGroup>}
                                </Row>
                            </div>
                        </div>
                    </JbsCollapsibleCard>
                }
                <div className="StackingHistory">
                    <MUIDataTable
                        data={this.props.masterStakinList.map((item, index) => {
                            return [
                                index + 1,
                                item.WalletTypeName,
                                (item.StakingType === 1) ? intl.formatMessage({ id: "tokenStaking.fixedDeposit" }) : intl.formatMessage({ id: "table.charge" }),
                                (item.SlabType === 1) ? intl.formatMessage({ id: "wallet.Fixed" }) : intl.formatMessage({ id: "sidebar.trade.filterLabel.range" }),
                                item.Status ? intl.formatMessage({ id: "sidebar.btnEnable" }) : intl.formatMessage({ id: "sidebar.btnDisable" }),
                                <div className="list-action">
                                    {menuPermissionDetail.CrudOption.indexOf('5645F321') !== -1 &&
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.showList(item, this.checkAndGetMenuAccessDetail('24CB0E8F-06D4-0AB7-8B21-76193A2F53D3').HasChild)} // E3A44946-852D-1D9B-59DD-FC360E6E8A51
                                        >
                                            <i className="ti-list" />
                                        </a>
                                    }
                                    {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 &&
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.onEdit(item, this.checkAndGetMenuAccessDetail('24CB0E8F-06D4-0AB7-8B21-76193A2F53D3').HasChild)} //B169DB2E-084C-8C7B-A511-50CB9A091A59
                                        >
                                            <i className="ti-pencil" />
                                        </a>
                                    }
                                    {menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 &&
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.setState({ showDialog: true, deleteId: item.Id })}
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
                    width={(this.state.componentName === 'StakingConfigList') ? "100%" : "40%"}
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
        )
    }
}

const mapStateToProps = ({ StakingConfigurationReducer, walletUsagePolicy, drawerclose, authTokenRdcer }) => {
    // breadcrumb 
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { walletType } = walletUsagePolicy;
    const { loading, masterStakinList, masterDeleteResponse } = StakingConfigurationReducer;
    return { loading, masterStakinList, walletType, masterDeleteResponse, drawerclose, menuLoading, menu_rights };
};

export default connect(mapStateToProps, {
    getMasterStakingList,
    deleteMasterStaking,
    getStakingConfigList,
    getWalletType,
    getMenuPermissionByID
})(injectIntl(MasterStakingList));