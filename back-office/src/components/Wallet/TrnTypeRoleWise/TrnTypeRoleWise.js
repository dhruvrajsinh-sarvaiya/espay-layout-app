/*
Component Name : Transaction Type Role Wise
Created By : Sanjay Rathod
Date : 02/01/2019
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import Switch from 'react-toggle-switch';
import MUIDataTable from "mui-datatables";
import Button from "@material-ui/core/Button";
import { Form, FormGroup, Label, Input } from 'reactstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Drawer from "rc-drawer";
import { injectIntl } from 'react-intl';
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import {
    getTrnTypeRoleWise,
    updateTrnTypeRoleWiseStatus,
    addTrnTypeRoleWise
} from "Actions/TrnTypeRoleWise";
import { getWalletTransactionType, getRoleDetails } from "Actions/TransactionPolicy";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
import { NotificationManager } from 'react-notifications';
//Add and Edit Form Import 
import AddTrnTypeRoleWise from "./AddTrnTypeRoleWise";
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';
//Add and Edit Validation Import 
var validateAddTrnTypeRoleWiseRequest = require("../../../validation/TrnTypeRoleWise/AddTrnTypeRoleWise");
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
        title: <IntlMessages id="sidebar.wallet" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="walletDashboard.TrnTypeRoleWise" />,
        link: '',
        index: 1
    },
];

class TrnTypeRoleWise extends Component {
    state = {
        RoleId: "",
        TrnTypeId: "",
        deleteId: null,
        checkedSwitch: false,
        showDialog: false,
        Status: "",
        TrnsactionType: [],
        Roles: [],
        showReset: false,
        addTrnTypeRoleWiseModal: false,
        addTrnTypeRoleWiseForm: {
            TrnTypeId: "",
            RoleId: "",
            Status: "0"
        },
        errors: "",
        menuDetail: [],
        fieldList: {},
        menudetail: [],
        notification: true,
    };

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            addTrnTypeRoleWiseModal: false
        });
    };

    componentWillMount() {
        this.props.getMenuPermissionByID('09FC758C-641C-9C0F-1620-EC99115703FC'); // get wallet menu permission   
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getTrnTypeRoleWise({});
                this.props.getRoleDetails();
                this.props.getWalletTransactionType();
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notification: false });
        }

        /* add record */
        if (nextProps.addTrnTypeRoleWiseData.hasOwnProperty("ReturnCode")) {
            if (nextProps.addTrnTypeRoleWiseData.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.addTrnTypeRoleWiseData.ErrorCode}`} />);
                setTimeout(function () {
                    this.setState({ showError: false });
                }.bind(this), 1000);
            } else if (nextProps.addTrnTypeRoleWiseData.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id="common.form.add.success" />);
                setTimeout(function () {
                    this.setState({ addTrnTypeRoleWiseModal: false });
                }.bind(this), 1000);
                this.props.getTrnTypeRoleWise({});
            }
        }

        /* update status */
        if (nextProps.updateStatus.hasOwnProperty("ReturnCode")) {
            if (nextProps.updateStatus.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.updateStatus.ErrorCode}`} />);
            } else if (nextProps.updateStatus.ReturnCode === 0) {
                if (this.state.deleteId) {
                    NotificationManager.success(<IntlMessages id="common.form.delete.success" />);
                    this.props.getTrnTypeRoleWise({});
                    this.setState({
                        deleteId: null
                    })
                } else {
                    NotificationManager.success(<IntlMessages id="common.form.edit.success" />);
                }
            }
        }

        if (nextProps.walletTransactionType) {
            this.setState({ TrnsactionType: nextProps.walletTransactionType })
        }
        if (nextProps.roleDetails) {
            this.setState({ Roles: nextProps.roleDetails.Roles })
        }
    }

    //For Update Status In Mui-Table Column
    toggleSwitch = (key) => {
        let tempObj = this.props.TrnTypeRoleWiseData;
        tempObj[key].Status = tempObj[key].Status ? 0 : 1;
        this.props.updateTrnTypeRoleWiseStatus({
            status: tempObj[key].Status,
            id: tempObj[key].Id
        });
    }

    //toggle Drawer for add/Edit
    toggleEditTrnTypeRoleWiseModal = () => {
        this.setState({
            addTrnTypeRoleWiseModal: false,
            errors: {}
        });
    };

    // hanlde delete operation
    onDelete = () => {
        this.setState({ showDialog: false })
        if (this.state.deleteId) {
            this.props.updateTrnTypeRoleWiseStatus({
                id: this.state.deleteId,
                status: 9 // fixed for delete
            });
        }
    }

    //add new Trn Type Role Wise
    addNewTrnTypeRoleWise(menuDetail) {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                addTrnTypeRoleWiseModal: true,
                editTrnTypeRoleWiseForm: null,
                addTrnTypeRoleWiseForm: {
                    TrnTypeId: "",
                    RoleId: "",
                    Status: "0"
                },
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    //On Change Method for Drop Down In Add form
    onChangeAdd(key, value) {
        this.setState({
            addTrnTypeRoleWiseForm: {
                ...this.state.addTrnTypeRoleWiseForm,
                [key]: value
            }
        });
    }

    //Handel Switch In add Method 
    handleCheckChange = name => (checked) => {
        this.setState({ [name]: checked });
        if (this.state.checkedSwitch !== true) {
            this.setState({
                addTrnTypeRoleWiseForm: {
                    ...this.state.addTrnTypeRoleWiseForm,
                    Status: (this.state.addTrnTypeRoleWiseForm.Status === "1") ? "0" : "1"
                }
            })
        }
    }

    //submit new record for TrnTypeRole Wise
    onSubmitAddTrnTypeRoleWiseForm() {
        const { errors, isValid } = validateAddTrnTypeRoleWiseRequest(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            const { addTrnTypeRoleWiseForm } = this.state;
            this.props.addTrnTypeRoleWise(addTrnTypeRoleWiseForm);
        }
    }

    //Apply Filter option
    applyFilter = () => {
        if (this.state.RoleId !== '' || this.state.TrnTypeId !== '' || this.state.Status !== '') {
            this.props.getTrnTypeRoleWise({
                RoleId: this.state.RoleId,
                TrnTypeId: this.state.TrnTypeId,
                Status: this.state.Status
            });
            this.setState({ showReset: true });
        }
    }

    //clear filter
    clearFilter = () => {
        this.setState({
            RoleId: "",
            TrnTypeId: "",
            Status: "",
            showReset: false
        });
        this.props.getTrnTypeRoleWise({});
    }

    //Change event for Filter's
    onChangeHandler(e, key) {
        e.preventDefault();
        this.setState({ [key]: e.target.value });
    }

    /* check menu permission */
    checkAndGetMenuAccessDetail(GUID) {
        let response = false;
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('88660680-3319-6BC0-2649-E2C6A6AC4421');
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const intl = this.props.intl;
        const { drawerClose } = this.props;
        const { addTrnTypeRoleWiseModal, addTrnTypeRoleWiseForm } = this.state;
        const columns = [
            {
                name: intl.formatMessage({ id: "wallet.lblSr" }),
                options: { filter: false, sort: false }
            },
            {
                name: intl.formatMessage({ id: "table.TrnTypeName" }),
                options: { filter: false, sort: false }
            },
            {
                name: intl.formatMessage({ id: "table.RoleName" }),
                options: { filter: false, sort: false }
            },
            {
                name: intl.formatMessage({ id: "table.Status" }),
                options: { filter: false, sort: false }
            },
            {
                name: intl.formatMessage({ id: "table.Action" }),
                options: { filter: false, sort: false }
            }
        ];

        const options = {
            filter: false,
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            download: false,
            viewColumns: false,
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customToolbar: () => {
                if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) {
                    return (
                        <Button
                            variant="raised"
                            className="btn-primary text-white mt-5"
                            onClick={() => this.addNewTrnTypeRoleWise(this.checkAndGetMenuAccessDetail('88660680-3319-6BC0-2649-E2C6A6AC4421').HasChild)} //0EA69504-09BB-8EF5-5837-8F38B82F6B8C
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
                {this.props.menuLoading && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="walletDashboard.TrnTypeRoleWise" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="StackingHistory">
                    {menuPermissionDetail.Utility.indexOf('18736530') !== -1 &&
                        <JbsCollapsibleCard>
                            <div className="top-filter">
                                <Form className="tradefrm row">
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Select-1"><IntlMessages id="table.TrnTypeName" /></Label>
                                        <Input type="select" name="TrnTypeId" id="TrnTypeId" value={this.state.TrnTypeId} onChange={(e) => this.onChangeHandler(e, 'TrnTypeId')}>
                                            <IntlMessages id="lable.selectType">
                                                {(optionValue) =>
                                                    <option value="">{optionValue}</option>
                                                }
                                            </IntlMessages>
                                            {this.state.TrnsactionType &&
                                                this.state.TrnsactionType.map((type, index) => (
                                                    <option key={index} value={type.TypeId}>{type.TypeName}</option>
                                                ))}
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="RoleId"><IntlMessages id="table.RoleName" /></Label>
                                        <Input type="select" name="RoleId" id="RoleId" value={this.state.RoleId} onChange={(e) => this.onChangeHandler(e, 'RoleId')}>
                                            <IntlMessages id="wallet.selectRole">
                                                {(optionValue) =>
                                                    <option value="">{optionValue}</option>
                                                }
                                            </IntlMessages>
                                            {this.props.roleDetails.hasOwnProperty("Roles") &&
                                                this.props.roleDetails.Roles.length > 0 &&
                                                this.props.roleDetails.Roles.map((item, index) => (
                                                    <option key={index} value={item.ID}>{item.RoleName}</option>
                                                ))}
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Select-1"><IntlMessages id="widgets.status" /></Label>
                                        <Input type="select" name="status" id="status" value={this.state.Status} onChange={(e) => this.onChangeHandler(e, 'Status')}>
                                            <IntlMessages id="wallet.errStatus">
                                                {(optionValue) =>
                                                    <option value="">{optionValue}</option>
                                                }
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
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <div className="btn_area">
                                            <Button
                                                color="primary"
                                                variant="raised"
                                                className="text-white"
                                                onClick={() => this.applyFilter()}
                                                disabled={(this.state.RoleId !== '' || this.state.TrnTypeId !== '' || this.state.Status !== '') ? false : true}
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
                    {this.props.loading && <JbsSectionLoader />}
                    <MUIDataTable
                        data={this.props.TrnTypeRoleWiseData.map((item, key) => {
                            return [
                                key + 1,
                                item.TrnTypeName,
                                item.RoleName,
                                <Switch onClick={() => this.toggleSwitch(key)} on={(item.Status === 1) ? true : false} />,
                                <div className="list-action">
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
                {addTrnTypeRoleWiseModal && (
                    <Drawer
                        width="40%"
                        handler={false}
                        open={this.state.addTrnTypeRoleWiseModal}
                        className="drawer2 half_drawer"
                        level=".drawer0"
                        placement="right"
                        levelMove={100}
                    >
                        <div className="jbs-page-content">
                            <div className="page-title d-flex justify-content-between align-items-center">
                                <h2>
                                    <span>
                                        <IntlMessages id="modal.addTrnTypeRoleWise" />
                                    </span>
                                </h2>
                                <div className="page-title-wrap drawer_btn mb-10 text-right">
                                    <Button
                                        className="btn-warning text-white mr-10 mb-10"
                                        style={buttonSizeSmall}
                                        variant="fab"
                                        mini
                                        onClick={this.toggleEditTrnTypeRoleWiseModal}
                                    >
                                        <i className="zmdi zmdi-mail-reply" />
                                    </Button>
                                    <Button
                                        className="btn-info text-white mr-10 mb-10"
                                        style={buttonSizeSmall}
                                        variant="fab"
                                        mini
                                        onClick={this.closeAll}
                                    >
                                        <i className="zmdi zmdi-home" />
                                    </Button>
                                </div>
                            </div>
                            {this.props.loading && <JbsSectionLoader />}
                            <AddTrnTypeRoleWise
                                addTrnTypeRoleWiseForm={addTrnTypeRoleWiseForm}
                                TrnsactionType={this.state.TrnsactionType}
                                onChangeAdd={this.onChangeAdd.bind(this)}
                                Roles={this.state.Roles}
                                errors={this.state.errors}
                                handleCheckChange={() => this.handleCheckChange()}
                                {...this.props}

                            />
                            {this.checkAndGetMenuAccessDetail('88660680-3319-6BC0-2649-E2C6A6AC4421').HasChild &&
                                <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                    <div className="btn_area">
                                        <Button
                                            variant="raised"
                                            className="btn-primary text-white mr-20"
                                            onClick={(e) => this.onSubmitAddTrnTypeRoleWiseForm()}
                                        >
                                            <IntlMessages id="button.add" />
                                        </Button>{" "}
                                        <Button
                                            variant="raised"
                                            className="btn-danger text-white ml-15"
                                            onClick={this.toggleEditTrnTypeRoleWiseModal}
                                        >
                                            <IntlMessages id="button.cancel" />
                                        </Button>
                                    </div>
                                </div>
                            }
                        </div>
                    </Drawer>
                )}
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
                        <Button onClick={() => this.setState({ showDialog: false, deleteId: null })} className="btn-danger text-white">
                            <IntlMessages id="sidebar.btnNo" />
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

const mapDispatchToProps = ({ TrnTypeRoleWiseRdcer, transactionPolicy, authTokenRdcer }) => {
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { TrnTypeRoleWiseData, updateStatus, addTrnTypeRoleWiseData, loading } = TrnTypeRoleWiseRdcer;
    const { walletTransactionType, roleDetails } = transactionPolicy;
    return { TrnTypeRoleWiseData, roleDetails, updateStatus, walletTransactionType, addTrnTypeRoleWiseData, loading, menuLoading, menu_rights };
};

export default connect(mapDispatchToProps, {
    getTrnTypeRoleWise,
    getWalletTransactionType,
    getRoleDetails,
    updateTrnTypeRoleWiseStatus,
    addTrnTypeRoleWise,
    getMenuPermissionByID
})(injectIntl(TrnTypeRoleWise));