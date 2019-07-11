/* 
    Developer : Nishant Vadgama
    Date : 19-11-2018
    File Comment : Charge Type list componrnt
*/
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { injectIntl } from 'react-intl';
import IntlMessages from "Util/IntlMessages";
import Button from "@material-ui/core/Button";
import { getChargeType, updateChargeTypeStatus, addChargeType, onUpdateChargeType } from "Actions/ChargeTypeDetail";
import MUIDataTable from "mui-datatables";
import Switch from 'react-toggle-switch';
import Drawer from "rc-drawer";
import { Form, FormGroup, Label, Input, Col } from "reactstrap";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import validator from "validator";
import { Alert } from "reactstrap";
import classnames from "classnames";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';

var validateEditChargeTypeRequest = require("../../validation/ChargeTypeDetail/EditChargeTypeDetail");
var validateAddChargeTypeRequest = require("../../validation/ChargeTypeDetail/AddChargeTypeDetail");

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
        title: <IntlMessages id="walletDashboard.ChargeTypeDetail" />,
        link: '',
        index: 1
    },
];

class ChargeTypeDetail extends Component {

    state = {
        open: false,
        checkedSwitch: false,
        isButtonDisabled: false,
        showErrorStatus: false,
        showSuccessStatus: false,
        showError: false,
        showSuccess: false,
        responseMessageForStatus: "",
        responseMessage: "",
        typelist: [],
        showDialog: false,
        deleteId: null,
        editChargeTypeModel: false,
        editChargeTypeDetail: null,
        addNewChargeType: false,
        addNewChargeTypeDetail: {
            TypeId: "0",
            TypeName: "",
            Status: "0"
        },
        errors: ""
    }

    componentWillMount() {
        this.props.getChargeType();
        this.setState({
            typelist: this.props.chargeTypeData.Types
        });
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            editChargeTypeModel: false
        });
    };

    toggleSwitch = (key) => {
        let tempObj = this.props.chargeTypeData.Types;
        tempObj[key].Status = tempObj[key].Status ? 0 : 1;
        this.setState({ typelist: tempObj });
        this.props.updateChargeTypeStatus({
            status: tempObj[key].Status,
            id: tempObj[key].ChargeTypeID
        });
    }

    // hanlde delete operation
    onDelete = () => {
        this.setState({ showDialog: false })
        if (this.state.deleteId) {
            this.props.updateChargeTypeStatus({
                id: this.state.deleteId,
                status: 9 // fixed for delete
            });
        }
    }

    //Edit Transaction Policy 
    onEditChargeType(chargeType) {
        if (chargeType) {
            let newObj = Object.assign({}, chargeType);
            this.setState({
                editChargeTypeModel: true,
                editChargeTypeDetail: newObj,
                addNewChargeType: false
            });
        }
    }

    //toggle Transaction Policy Drawer
    toggleEditChargeModal = () => {
        this.setState({
            editChargeTypeModel: false,
            errors: {}
        });
    };

    //submit Updated Form Form Transaction Policy
    onSubmitChargeTypeForm() {
        const { errors, isValid } = validateEditChargeTypeRequest(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            this.setState({
                isButtonDisabled: true
            })
            const { editChargeTypeDetail } = this.state;
            let reqObj = {
                TypeID: parseInt(editChargeTypeDetail.ChargeTypeID),
                TypeName: editChargeTypeDetail.TypeName,
                Status: parseInt(editChargeTypeDetail.Status)
            };
            this.props.onUpdateChargeType(reqObj);
        }
    }

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    //function for allow only integer in text box for Edit from
    onChangeEditNumber(key, value) {
        if (
            validator.isDecimal(value, {
                force_decimal: false
            }) ||
            validator.isNumeric(value)
        ) {
            this.setState({
                editChargeTypeDetail: {
                    ...this.state.editChargeTypeDetail,
                    [key]: value
                }
            });
        }
    }

    onChangeEditText(key, value) {
        this.setState({
            editChargeTypeDetail: {
                ...this.state.editChargeTypeDetail,
                [key]: value
            }
        });
    }

    toggleEditSwitch = (key) => {
        let tempObj = key;
        tempObj.Status = tempObj.Status ? 0 : 1;
        this.setState({
            editChargeTypeDetail: {
                ...this.state.editChargeTypeDetail,
                tempObj
            }
        });
    }

    onAddNewChargeTypeDetail() {
        this.setState({
            editChargeTypeModel: true,
            addNewChargeType: true,
            editChargeTypeDetail: null,
            addNewChargeTypeDetail: {
                TypeId: "0",
                TypeName: "",
                Status: "0"
            }
        });
    }

    //submit new record for Transaction policy
    onSubmitAddNewChargeTypeForm() {
        const { errors, isValid } = validateAddChargeTypeRequest(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            const { addNewChargeTypeDetail } = this.state;
            let newTransactionPolicy = addNewChargeTypeDetail;
            this.props.addChargeType(newTransactionPolicy);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.addChargeTypeData.ReturnCode === 1) {
            this.setState({ showError: true, responseMessage: nextProps.addChargeTypeData.ReturnMsg })
            setTimeout(function () {
                this.setState({ showError: false, editChargeTypeModel: false });
            }.bind(this), 5000);
        } else if (nextProps.addChargeTypeData.ReturnCode === 0) {
            this.setState({ showSuccess: true, responseMessage: nextProps.addChargeTypeData.ReturnMsg })
            setTimeout(function () {
                this.setState({ showSuccess: false, editChargeTypeModel: false });
            }.bind(this), 5000);
            this.props.getChargeType();
        } else if (nextProps.updateChargeTypeData.ReturnCode === 1) {
            this.setState({ showError: true, responseMessage: nextProps.updateChargeTypeData.ReturnMsg })
            setTimeout(function () {
                this.setState({ showError: false, editChargeTypeModel: false });
            }.bind(this), 5000);
        } else if (nextProps.updateChargeTypeData.ReturnCode === 0) {
            this.setState({ showSuccess: true, responseMessage: nextProps.updateChargeTypeData.ReturnMsg, isButtonDisabled: false })
            setTimeout(function () {
                this.setState({ showSuccess: false, editChargeTypeModel: false });
            }.bind(this), 5000);
            this.props.getChargeType();
        } else if (nextProps.updateStatus.ReturnCode === 1) {
            this.setState({ showErrorStatus: true, responseMessageForStatus: nextProps.updateStatus.ReturnMsg })
            setTimeout(function () {
                this.setState({ showErrorStatus: false });
            }.bind(this), 5000);
        } else if (nextProps.updateStatus.ReturnCode === 0) {
            this.props.getChargeType();
            this.setState({ showSuccessStatus: true, responseMessageForStatus: nextProps.updateStatus.ReturnMsg })
            setTimeout(function () {
                this.setState({ showSuccessStatus: false });
            }.bind(this), 5000);
        }
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
            })
        }
    }

    handleCheckChange = name => (event, checked) => {
        this.setState({ [name]: checked });
        if (this.state.checkedSwitch !== true) {
            this.setState({
                addNewChargeTypeDetail: {
                    ...this.state.addNewChargeTypeDetail,
                    Status: "1"
                }
            });
        } else {
            this.setState({
                addNewChargeTypeDetail: {
                    ...this.state.addNewChargeTypeDetail,
                    Status: "0"
                }
            });
        }
    };

    onChangeNumber(key, value) {
        if (
            validator.isDecimal(value, {
                force_decimal: false,
            }) ||
            validator.isNumeric(value)
        ) {
            this.setState({
                addNewChargeTypeDetail: {
                    ...this.state.addNewChargeTypeDetail,
                    [key]: value
                }
            });
        }
    }

    onChangeText(key, value) {
        this.setState({
            addNewChargeTypeDetail: {
                ...this.state.addNewChargeTypeDetail,
                [key]: value
            }
        });
    }

    render() {
        const {
            editChargeTypeModel,
            editChargeTypeDetail,
            addNewChargeType,
            addNewChargeTypeDetail
        } = this.state;
        const { drawerClose, intl } = this.props;
        const typeList = this.props.chargeTypeData.hasOwnProperty('Types') ? this.props.chargeTypeData.Types : [];
        const columns = [
            {
                name: intl.formatMessage({ id: "wallet.lblSr" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.chargeType" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.status" }),
                options: {
                    sort: true,
                    filter: true,
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
                name: intl.formatMessage({ id: "table.action" }),
                options: { sort: false, filter: false }
            }
        ];
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            download: false,
            viewColumns: false,
            filter: true,
            search : true,
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            textLabels: {
                body: {
                    noMatch: intl.formatMessage({ id: "wallet.emptyTable" }),
                    toolTip: intl.formatMessage({ id: "wallet.sort" }),
                }
            },
            customToolbar: () => {
                return (
                    <Button
                        variant="raised"
                        className="btn-primary text-white mt-5"
                        style={{ float: "right" }}
                        onClick={() => this.onAddNewChargeTypeDetail()}
                    >
                        {intl.formatMessage({ id: "button.addNew" })}
                    </Button>
                );
            }
        };
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="walletDashboard.ChargeTypeDetail" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <Fragment>
                    <Alert color="danger" isOpen={this.state.showErrorStatus} toggle={(e) => this.setState({ showErrorStatus: false })}>
                        {this.state.responseMessageForStatus}
                    </Alert>
                    <Alert color="success" isOpen={this.state.showSuccessStatus} toggle={(e) => this.setState({ showSuccessStatus: false })}>
                        {this.state.responseMessageForStatus}
                    </Alert>
                </Fragment>
                <div className="StackingHistory">
                    {this.props.Loading && <JbsSectionLoader />}
                    <MUIDataTable
                        data={typeList.map((item, key) => {
                            return [
                                key + 1,
                                item.TypeName,
                                item.Status ? intl.formatMessage({ id: "sidebar.btnEnable" }) : intl.formatMessage({ id: "sidebar.btnDisable" }),
                                // <Switch onClick={() => this.toggleSwitch(key)}
                                //     on={(item.Status === 1) ? true : false} />,
                                <div className="list-action">
                                    <a
                                        href="javascript:void(0)"
                                        onClick={() => this.onEditChargeType(item)}
                                    >
                                        <i className="ti-pencil" />
                                    </a>
                                    <a
                                        href="javascript:void(0)"
                                        onClick={() => this.setState({ showDialog: true, deleteId: item.ChargeTypeID })}
                                    >
                                        <i className="ti-close" />
                                    </a>
                                </div>
                            ];
                        })}
                        columns={columns}
                        options={options}
                    />
                </div>
                {editChargeTypeModel && (
                    <Drawer
                        width="40%"
                        handler={false}
                        open={this.state.editChargeTypeModel}
                        // onMaskClick={this.toggleEditChargeModal}
                        className="drawer2"
                        level=".drawer1"
                        placement="right"
                        levelMove={100}
                    >
                        <div className="jbs-page-content">
                            <div className="page-title d-flex justify-content-between align-items-center">
                                {addNewChargeType ? (
                                    <h2>{intl.formatMessage({ id: "modal.addChargeType" })}</h2>
                                ) : (
                                        <h2>{intl.formatMessage({ id: "modal.editChargeType" })}</h2>
                                    )}
                                <div className="page-title-wrap">
                                    <Button
                                        className="btn-warning text-white mr-10 mb-10"
                                        style={buttonSizeSmall}
                                        variant="fab"
                                        mini
                                        onClick={this.toggleEditChargeModal}
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
                            <Fragment>
                                <Alert color="danger" isOpen={this.state.showError} toggle={(e) => this.setState({ showError: false })}>
                                    {this.state.responseMessage}
                                </Alert>
                                <Alert color="success" isOpen={this.state.showSuccess} toggle={(e) => this.setState({ showSuccess: false })}>
                                    {this.state.responseMessage}
                                </Alert>
                            </Fragment>
                            {this.props.Loading && <JbsSectionLoader />}
                            {addNewChargeType ? (
                                <Form>
                                    <FormGroup row>
                                        <Label sm={3} className="d-inline">
                                            {intl.formatMessage({ id: "lable.TypeName" })} <span className="text-danger">*</span>
                                        </Label>
                                        <Col sm={9}>
                                            <Input
                                                type="text"
                                                name="TypeName"
                                                value={addNewChargeTypeDetail.TypeName}
                                                maxLength="50"
                                                onChange={e =>
                                                    this.onChangeText("TypeName", e.target.value)
                                                }
                                            />
                                            {this.state.errors.TypeName && (
                                                <span className="text-danger">
                                                    {intl.formatMessage({ id: this.state.errors.TypeName })}
                                                </span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={3}>
                                            {intl.formatMessage({ id: "lable.Status" })}
                                        </Label>
                                        <Col sm={9}>
                                            <Switch className="mt-5"
                                                onClick={(e) => this.setState({
                                                    addNewChargeTypeDetail: {
                                                        ...this.state.addNewChargeTypeDetail,
                                                        Status: (this.state.addNewChargeTypeDetail.Status === "1") ? "0" : "1"
                                                    }
                                                })}
                                                on={(this.state.addNewChargeTypeDetail.Status === "1") ? true : false} />
                                        </Col>
                                    </FormGroup>
                                </Form>
                            ) : (
                                    <Form>
                                        <FormGroup row>
                                            <Label sm={3} className="d-inline">
                                                {intl.formatMessage({ id: "lable.TypeName" })} <span className="text-danger">*</span>
                                            </Label>
                                            <Col sm={9}>
                                                <Input
                                                    type="text"
                                                    name="TypeName"
                                                    maxLength="50"
                                                    value={editChargeTypeDetail.TypeName}
                                                    onChange={e =>
                                                        this.onChangeEditText("TypeName", e.target.value)
                                                    }
                                                />
                                                {this.state.errors.TypeName && (
                                                    <span className="text-danger">
                                                        {intl.formatMessage({ id: this.state.errors.TypeName })}
                                                    </span>
                                                )}
                                            </Col>

                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={3}>
                                                {intl.formatMessage({ id: "lable.Status" })}
                                            </Label>
                                            <Col sm={9}>
                                                <Switch className="mt-5" onClick={() => this.toggleEditSwitch(editChargeTypeDetail)}
                                                    on={(editChargeTypeDetail.Status === 1) ? true : false} />
                                            </Col>
                                        </FormGroup>
                                    </Form>
                                )}
                            {addNewChargeType ? (
                                <div>
                                    <Button
                                        variant="raised"
                                        className="btn-primary text-white mr-10"
                                        onClick={(e) => this.onSubmitAddNewChargeTypeForm()}
                                    >
                                        {intl.formatMessage({ id: "button.add" })}
                                    </Button>{" "}
                                    <Button
                                        variant="raised"
                                        className="btn-danger text-white"
                                        onClick={this.toggleEditChargeModal}
                                    >
                                        {intl.formatMessage({ id: "button.cancel" })}
                                    </Button>
                                </div>
                            ) : (
                                    <div>
                                        <Button
                                            variant="raised"
                                            className="btn-primary text-white mr-10"
                                            onClick={() => this.onSubmitChargeTypeForm()}
                                            disabled={this.state.isButtonDisabled}
                                        >
                                            {intl.formatMessage({ id: "button.update" })}
                                        </Button>{" "}
                                        <Button
                                            variant="raised"
                                            className="btn-danger text-white"
                                            onClick={this.toggleEditChargeModal}
                                        >
                                            {intl.formatMessage({ id: "button.cancel" })}
                                        </Button>
                                    </div>
                                )}
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
                        {intl.formatMessage({ id: "global.delete.message" })}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={() => this.setState({ showDialog: false })} className="btn-danger text-white">
                            {intl.formatMessage({ id: "button.cancel" })}
                        </Button>
                        <Button onClick={() => this.onDelete()} className="btn-primary text-white" autoFocus>
                            {intl.formatMessage({ id: "button.yes" })}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}


const mapToProps = ({ chargeTypeDetail, drawerclose }) => {
    // breadcrumb 
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { chargeTypeData, addChargeTypeData, updateChargeTypeData, updateStatus, Loading } = chargeTypeDetail;
    return { chargeTypeData, addChargeTypeData, updateChargeTypeData, updateStatus, Loading, drawerclose };
};

export default connect(mapToProps, {
    getChargeType, updateChargeTypeStatus, onUpdateChargeType, addChargeType
})(injectIntl(ChargeTypeDetail));
