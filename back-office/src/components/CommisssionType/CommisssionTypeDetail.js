/* 
    Developer : Nishant Vadgama
    Date : 19-11-2018
    File Comment : Admin Dashboard Component
*/
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import Button from "@material-ui/core/Button";
import { getCommissionType, updateCommissionTypeStatus, addCommissionType, onUpdateCommissionType } from "Actions/CommisssionType";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import MUIDataTable from "mui-datatables";
import Switch from 'react-toggle-switch';
import Drawer from "rc-drawer";
import { Form, FormGroup, Label, Input, Col } from "reactstrap";
import validator from "validator";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { Alert } from "reactstrap";
import classnames from "classnames";
import { injectIntl } from 'react-intl';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';

var validateEditCommissionTypeRequest = require("../../validation/CommisssionType/EditCommissionType");
var validateAddCommissionTypeRequest = require("../../validation/CommisssionType/AddCommisssionType");

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
        title: <IntlMessages id="walletDashboard.CommissionType" />,
        link: '',
        index: 1
    },
];

class CommisssionTypeDetail extends Component {

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
        editCommissionTypeModel: false,
        editCommissionTypeDetail: null,
        addNewCommissionType: false,
        addNewCommissionTypeDetail: {
            TypeId: "0",
            TypeName: "",
            Status: "0"
        },
        errors: ""
    }

    componentWillMount() {
        this.props.getCommissionType();
        this.setState({
            typelist: this.props.commissionTypeData.Types
        });
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            editCommissionTypeModel: false
        });
    };

    toggleSwitch = (key) => {
        let tempObj = this.props.commissionTypeData.Types;
        tempObj[key].Status = tempObj[key].Status ? 0 : 1;
        this.setState({ typelist: tempObj });
        this.props.updateCommissionTypeStatus({
            status: tempObj[key].Status,
            id: tempObj[key].TypeID
        });
    }

    // hanlde delete operation
    onDelete = () => {
        this.setState({ showDialog: false })
        if (this.state.deleteId) {
            this.props.updateCommissionTypeStatus({
                id: this.state.deleteId,
                status: 9 // fixed for delete
            });
        }
    }

    //Edit  Commission Type 
    onEditCommissionType(commissionType) {
        if (commissionType) {
            let newObj = Object.assign({}, commissionType);
            this.setState({
                editCommissionTypeModel: true,
                editCommissionTypeDetail: newObj,
                addNewCommissionType: false
            });
        }
    }

    //toggle Commission Type Drawer
    toggleEditCommissionModal = () => {
        this.setState({
            editCommissionTypeModel: false,
            errors: {}
        });
    };

    //submit Updated Form Commission Policy
    onSubmitCommissionTypeForm() {
        const { errors, isValid } = validateEditCommissionTypeRequest(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            this.setState({
                isButtonDisabled: true
            })
            const { editCommissionTypeDetail } = this.state;
            let reqObj = {
                TypeId: parseInt(editCommissionTypeDetail.TypeID),
                TypeName: editCommissionTypeDetail.TypeName,
                Status: parseInt(editCommissionTypeDetail.Status)
            };
            this.props.onUpdateCommissionType(reqObj);
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
                editCommissionTypeDetail: {
                    ...this.state.editCommissionTypeDetail,
                    [key]: value
                }
            });
        }
    }

    onChangeEditText(key, value) {
        this.setState({
            editCommissionTypeDetail: {
                ...this.state.editCommissionTypeDetail,
                [key]: value
            }
        });
    }

    toggleEditSwitch = (key) => {
        let tempObj = key;
        tempObj.Status = tempObj.Status ? 0 : 1;
        this.setState({
            editCommissionTypeDetail: {
                ...this.state.editCommissionTypeDetail,
                tempObj
            }
        });
    }

    onAddNewCommissionTypeDetail() {
        this.setState({
            editCommissionTypeModel: true,
            addNewCommissionType: true,
            editCommissionTypeDetail: null,
            addNewCommissionTypeDetail: {
                TypeId: "0",
                TypeName: "",
                Status: "0"
            }
        });
    }

    //submit new record for Transaction policy
    onSubmitAddNewCommissionTypeForm() {
        const { errors, isValid } = validateAddCommissionTypeRequest(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            const { addNewCommissionTypeDetail } = this.state;
            let newTransactionPolicy = addNewCommissionTypeDetail;
            this.props.addCommissionType(newTransactionPolicy);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.addCommissionTypeData.ReturnCode === 1) {
            this.setState({ showError: true, responseMessage: nextProps.addCommissionTypeData.ReturnMsg })
            setTimeout(function () {
                this.setState({ showError: false, editCommissionTypeModel: false });
            }.bind(this), 3000);
        } else if (nextProps.addCommissionTypeData.ReturnCode === 0) {
            this.props.getCommissionType();
            this.setState({ showSuccess: true, responseMessage: nextProps.addCommissionTypeData.ReturnMsg })
            setTimeout(function () {
                this.setState({ showSuccess: false, editCommissionTypeModel: false });
            }.bind(this), 3000);
        } else if (nextProps.updateCommissionTypeData.ReturnCode === 1) {
            this.setState({ showError: true, responseMessage: nextProps.updateCommissionTypeData.ReturnMsg })
            setTimeout(function () {
                this.setState({ showError: false, editCommissionTypeModel: false });
            }.bind(this), 3000);
        } else if (nextProps.updateCommissionTypeData.ReturnCode === 0) {
            this.props.getCommissionType();
            this.setState({ showSuccess: true, responseMessage: nextProps.updateCommissionTypeData.ReturnMsg, isButtonDisabled: false })
            setTimeout(function () {
                this.setState({ showSuccess: false, editCommissionTypeModel: false });
            }.bind(this), 3000);
        } else if (nextProps.updateStatus.ReturnCode === 1) {
            this.setState({ showErrorStatus: true, responseMessageForStatus: nextProps.updateStatus.ReturnMsg })
            setTimeout(function () {
                this.setState({ showErrorStatus: false });
            }.bind(this), 3000);
        } else if (nextProps.updateStatus.ReturnCode === 0) {
            this.props.getCommissionType();
            this.setState({ showSuccessStatus: true, responseMessageForStatus: nextProps.updateStatus.ReturnMsg })
            setTimeout(function () {
                this.setState({ showSuccessStatus: false });
            }.bind(this), 3000);
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
                addNewCommissionTypeDetail: {
                    ...this.state.addNewCommissionTypeDetail,
                    Status: "1"
                }
            });
        } else {
            this.setState({
                addNewCommissionTypeDetail: {
                    ...this.state.addNewCommissionTypeDetail,
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
                addNewCommissionTypeDetail: {
                    ...this.state.addNewCommissionTypeDetail,
                    [key]: value
                }
            });
        }
    }

    onChangeText(key, value) {
        this.setState({
            addNewCommissionTypeDetail: {
                ...this.state.addNewCommissionTypeDetail,
                [key]: value
            }
        });
    }

    render() {
        const {
            editCommissionTypeModel,
            editCommissionTypeDetail,
            addNewCommissionType,
            addNewCommissionTypeDetail
        } = this.state;
        const { drawerClose, intl } = this.props;
        const commissionTypeList = this.props.commissionTypeData.hasOwnProperty("Types") ? this.props.commissionTypeData.Types : [];
        const columns = [
            {
                name: intl.formatMessage({ id: "wallet.lblSr" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.commissionType" }),
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
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customToolbar: () => {
                return (
                    <Button
                        variant="raised"
                        className="btn-primary text-white mt-5"
                        style={{ float: "right" }}
                        onClick={() => this.onAddNewCommissionTypeDetail()}
                    >
                        <IntlMessages id="button.addNew" />
                    </Button>
                );
            }
        };
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="walletDashboard.CommissionType" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
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
                        data={commissionTypeList.map((item, key) => {
                            return [
                                key + 1,
                                item.TypeName,
                                item.Status ? intl.formatMessage({ id: "sidebar.btnEnable" }) : intl.formatMessage({ id: "sidebar.btnDisable" }),
                                // <Switch onClick={() => this.toggleSwitch(key)}
                                //     on={(item.Status === 1) ? true : false} />,
                                <div className="list-action">
                                    <a
                                        href="javascript:void(0)"
                                        onClick={() => this.onEditCommissionType(item)}
                                    >
                                        <i className="ti-pencil" />
                                    </a>
                                    <a
                                        href="javascript:void(0)"
                                        onClick={() => this.setState({ showDialog: true, deleteId: item.TypeID })}
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
                {editCommissionTypeModel && (
                    <Drawer
                        width="40%"
                        handler={false}
                        open={this.state.editCommissionTypeModel}
                        // onMaskClick={this.toggleEditCommissionModal}
                        className="drawer2"
                        level=".drawer1"
                        placement="right"
                        levelMove={100}
                    >
                        <div className="jbs-page-content">
                            <div className="page-title d-flex justify-content-between align-items-center">
                                {addNewCommissionType ? (
                                    <h2><IntlMessages id="modal.addCommissionType" /></h2>
                                ) : (
                                        <h2><IntlMessages id="modal.editCommissionType" /></h2>
                                    )}
                                <div className="page-title-wrap">
                                    <Button
                                        className="btn-warning text-white mr-10 mb-10"
                                        style={buttonSizeSmall}
                                        variant="fab"
                                        mini
                                        onClick={this.toggleEditCommissionModal}
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
                            {addNewCommissionType ? (
                                <Form>
                                    <FormGroup row>
                                        <Label sm={3} className="d-inline">
                                            <IntlMessages id="lable.TypeName" /> <span className="text-danger">*</span>
                                        </Label>
                                        <Col sm={9}>
                                            <Input
                                                type="text"
                                                name="TypeName"
                                                value={addNewCommissionTypeDetail.TypeName}
                                                maxLength="50"
                                                onChange={e =>
                                                    this.onChangeText("TypeName", e.target.value)
                                                }
                                            />
                                            {this.state.errors.TypeName && (
                                                <span className="text-danger">
                                                    <IntlMessages id={this.state.errors.TypeName} />
                                                </span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={3}>
                                            <IntlMessages id="lable.Status" />
                                        </Label>
                                        <Col sm={9}>
                                            <Switch
                                                className="mt-5"
                                                onClick={(e) => this.setState({
                                                    addNewCommissionTypeDetail: {
                                                        ...this.state.addNewCommissionTypeDetail,
                                                        Status: (this.state.addNewCommissionTypeDetail.Status === "1") ? "0" : "1"
                                                    }
                                                })}
                                                on={(this.state.addNewCommissionTypeDetail.Status === "1") ? true : false} />
                                        </Col>
                                    </FormGroup>
                                </Form>
                            ) : (
                                    <Form>
                                        <FormGroup row>
                                            <Label sm={3} className="d-inline">
                                                <IntlMessages id="lable.TypeName" /> <span className="text-danger">*</span>
                                            </Label>
                                            <Col sm={9}>
                                                <Input
                                                    type="text"
                                                    name="TypeName"
                                                    maxLength="50"
                                                    value={editCommissionTypeDetail.TypeName}
                                                    onChange={e =>
                                                        this.onChangeEditText("TypeName", e.target.value)
                                                    }
                                                />
                                                {this.state.errors.TypeName && (
                                                    <span className="text-danger">
                                                        <IntlMessages id={this.state.errors.TypeName} />
                                                    </span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={3}>
                                                <IntlMessages id="lable.Status" />
                                            </Label>
                                            <Col sm={9}>
                                                <Switch className="mt-5" onClick={() => this.toggleEditSwitch(editCommissionTypeDetail)}
                                                    on={(editCommissionTypeDetail.Status === 1) ? true : false} />
                                            </Col>
                                        </FormGroup>
                                    </Form>
                                )}
                            {addNewCommissionType ? (
                                <div>
                                    <Button
                                        variant="raised"
                                        className="btn-primary text-white mr-10"
                                        onClick={(e) => this.onSubmitAddNewCommissionTypeForm()}
                                    >
                                        <IntlMessages id="button.add" />
                                    </Button>{" "}
                                    <Button
                                        variant="raised"
                                        className="btn-danger text-white"
                                        onClick={this.toggleEditCommissionModal}
                                    >
                                        <IntlMessages id="button.cancel" />
                                    </Button>
                                </div>
                            ) : (
                                    <div>
                                        <Button
                                            variant="raised"
                                            className="btn-primary text-white mr-10"
                                            onClick={() => this.onSubmitCommissionTypeForm()}
                                            disabled={this.state.isButtonDisabled}
                                        >
                                            <IntlMessages id="button.update" />
                                        </Button>{" "}
                                        <Button
                                            variant="raised"
                                            className="btn-danger text-white"
                                            onClick={this.toggleEditCommissionModal}
                                        >
                                            <IntlMessages id="button.cancel" />
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
                        <IntlMessages id="global.delete.message" />
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={() => this.setState({ showDialog: false })} className="btn-danger text-white">
                            <IntlMessages id="button.cancel" />
                        </Button>
                        <Button onClick={() => this.onDelete()} className="btn-primary text-white" autoFocus>
                            <IntlMessages id="button.yes" />
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}


const mapToProps = ({ commissionTypeDetail, drawerclose }) => {
    // breadcrumb 
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { commissionTypeData, addCommissionTypeData, updateCommissionTypeData, updateStatus, Loading } = commissionTypeDetail;
    return { commissionTypeData, addCommissionTypeData, updateCommissionTypeData, updateStatus, Loading, drawerclose };
};

export default connect(mapToProps, {
    getCommissionType, updateCommissionTypeStatus, onUpdateCommissionType, addCommissionType
})(injectIntl(CommisssionTypeDetail));
