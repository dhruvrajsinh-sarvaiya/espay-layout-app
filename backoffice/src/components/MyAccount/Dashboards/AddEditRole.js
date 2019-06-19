/*
    Developer : Bharat Jograna
    Date : 19-02-2019
    Update by : Salim Deraiya 22/02/2019
    File Comment : Add/Edit Roles Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { addRoleManagement, editRoleManagement, getRoleManagementList } from "Actions/MyAccount";
import { getActiveInactiveStatus } from 'Helpers/helpers';
import validateRoles from 'Validations/MyAccount/add_role';
import AppConfig from 'Constants/AppConfig';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//Component for MyAccount Add/Edit Roles
class AddEditRole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: {
                RoleName: '',
                RoleDescription: '',
                Status: ''
            },
            pageData: {
                PageNo: 0,
                PageSize: AppConfig.totalRecordDisplayInList
            },
            isAddData: false,
            errors: "",
            fieldList: {},
            menudetail: [],
            notification: true,
        };
        this.initState = this.state;
    }

    resetData() {
        this.setState(this.initState);
        this.setState({ menudetail: this.state.menudetail })
        this.props.drawerClose();
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    };

    onChange(event) {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }
    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.pagedata.isEdit ? 'C65C0B7A-404E-9EAC-4CBD-A675695075AE' : '82ED2ABF-A48A-6973-4C07-A834C3FE56E0');
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });
        // added by vishva
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notification: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        //Get Role Data By Id
        if (nextProps.getData.hasOwnProperty('RoleDetail') && Object.keys(nextProps.getData.RoleDetail).length > 0 && this.props.pagedata.isEdit) {
            this.setState({ data: nextProps.getData.RoleDetail });
        }

        //Add/Edit Data
        if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) {
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.data.ReturnCode === 0 && this.state.isAddData) {
            this.setState({ isAddData: false });
            this.props.getRoleManagementList(this.state.pageData);
            var sucMsg = nextProps.data.ErrorCode === 0 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
            this.resetData();
        }
    }

    //Add Role method...
    onAddRole(event) {
        event.preventDefault();
        const { errors, isValid } = validateRoles(this.state.data);
        this.setState({ errors: errors });

        if (isValid) {
            this.setState({ isAddData: true });
            this.props.addRoleManagement(this.state.data);
        }
    }

    //Edit Role method...
    onEditRole(event) {
        event.preventDefault();
        const { errors, isValid } = validateRoles(this.state.data);
        this.setState({ errors: errors });

        if (isValid) {
            this.setState({ isAddData: true });
            this.props.editRoleManagement(this.state.data);
        }
    }
 /* check menu permission */
 checkAndGetMenuAccessDetail(GUID) {
    var response = {};
    var index;
    const { menudetail } = this.state;
    if (menudetail.length) {
        for (index in menudetail) {
            if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase()) {
                if (menudetail[index].Fields && menudetail[index].Fields.length) {
                    var fieldList = {};
                    menudetail[index].Fields.forEach(function (item) {
                        fieldList[item.GUID.toUpperCase()] = item;
                    });
                    return response = fieldList;
                }
            }
        }
    } else {
        return response;
    }
} 
    render() {
        const { drawerClose } = this.props;
        const { isEdit } = this.props.pagedata;
        const { errors } = this.state;
        const { RoleName, RoleDescription, Status } = this.state.data;
        const statusList = getActiveInactiveStatus();
        var menuDetail = this.checkAndGetMenuAccessDetail(isEdit ? 'CAA0731B-0FD9-7B5E-43FF-1DB8A9C1268B' : 'E6759F6E-8201-7AA2-0884-8DA2670519FA');
        return (
            <Fragment>
                {(this.props.loading || this.props.menuLoading )&& <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id={isEdit ? "sidebar.editRoles" : "sidebar.addRoles"} />} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="jbs-page-content col-md-12 mx-auto">
                        <Form className="tradefrm">
                            {(isEdit ? (menuDetail["8A62DE54-6B3F-59C1-2ECB-AFC00894185B"] && menuDetail["8A62DE54-6B3F-59C1-2ECB-AFC00894185B"].Visibility === "E925F86B")//8A62DE54-6B3F-59C1-2ECB-AFC00894185B
                                : (menuDetail["0E896867-4295-0EA9-26C2-2DB70904550E"] && menuDetail["0E896867-4295-0EA9-26C2-2DB70904550E"].Visibility === "E925F86B"))//0E896867-4295-0EA9-26C2-2DB70904550E
                                &&
                                <FormGroup className="row">
                                    <Label for="RoleName" className="control-label col" ><IntlMessages id="my_account.roleName" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <IntlMessages id="sidebar.enterRoleName">
                                            {(placeholder) =>
                                                <Input
                                                disabled={((isEdit ? (menuDetail["8A62DE54-6B3F-59C1-2ECB-AFC00894185B"] && menuDetail["8A62DE54-6B3F-59C1-2ECB-AFC00894185B"].AccessRight === "11E6E7B0")
                                : (menuDetail["0E896867-4295-0EA9-26C2-2DB70904550E"] && menuDetail["0E896867-4295-0EA9-26C2-2DB70904550E"].AccessRight === "11E6E7B0"))) ? true : false}
                                                type="text" name="RoleName" value={RoleName} placeholder={placeholder} id="RoleName" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.RoleName && <span className="text-danger text-left"><IntlMessages id={errors.RoleName} /></span>}
                                    </div>
                                </FormGroup>
                            }
                            {(isEdit ? (menuDetail["80CB78E0-129D-95C9-8227-DA175B1565CF"] && menuDetail["80CB78E0-129D-95C9-8227-DA175B1565CF"].Visibility === "E925F86B")//80CB78E0-129D-95C9-8227-DA175B1565CF
                                : (menuDetail["6B4995FA-0C2A-375A-0E37-CB3B022A913C"] && menuDetail["6B4995FA-0C2A-375A-0E37-CB3B022A913C"].Visibility === "E925F86B"))//6B4995FA-0C2A-375A-0E37-CB3B022A913C
                                &&
                                <FormGroup className="row">
                                    <Label for="RoleDescription" className="control-label col" ><IntlMessages id="my_account.roleDescription" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <IntlMessages id="sidebar.enterRoleDescription">
                                            {(placeholder) =>
                                                <Input
                                                disabled={((isEdit ? (menuDetail["80CB78E0-129D-95C9-8227-DA175B1565CF"] && menuDetail["80CB78E0-129D-95C9-8227-DA175B1565CF"].AccessRight === "11E6E7B0")
                                : (menuDetail["6B4995FA-0C2A-375A-0E37-CB3B022A913C"] && menuDetail["6B4995FA-0C2A-375A-0E37-CB3B022A913C"].AccessRight === "11E6E7B0"))) ? true : false}
                                                type="textarea" name="RoleDescription" rows="5" value={RoleDescription} placeholder={placeholder} id="RoleDescription" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.RoleDescription && <span className="text-danger text-left"><IntlMessages id={errors.RoleDescription} /></span>}
                                    </div>
                                </FormGroup>
                            }
                            {(isEdit ? (menuDetail["F64F8D60-7596-5546-52D9-557DEC613DC7"] && menuDetail["F64F8D60-7596-5546-52D9-557DEC613DC7"].Visibility === "E925F86B")//F64F8D60-7596-5546-52D9-557DEC613DC7
                                : (menuDetail["C16FD859-8FF8-7F90-A4CA-26D1C631A1AE"] && menuDetail["C16FD859-8FF8-7F90-A4CA-26D1C631A1AE"].Visibility === "E925F86B"))//C16FD859-8FF8-7F90-A4CA-26D1C631A1AE
                                &&
                                <FormGroup className="row">
                                    <Label for="Status" className="control-label col"><IntlMessages id="my_account.status" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input
                                        disabled={((isEdit ? (menuDetail["F64F8D60-7596-5546-52D9-557DEC613DC7"] && menuDetail["F64F8D60-7596-5546-52D9-557DEC613DC7"].AccessRight === "11E6E7B0")
                                : (menuDetail["C16FD859-8FF8-7F90-A4CA-26D1C631A1AE"] && menuDetail["C16FD859-8FF8-7F90-A4CA-26D1C631A1AE"].AccessRight === "11E6E7B0"))) ? true : false}
                                        type="select" name="Status" value={Status} id="Status" onChange={(e) => this.onChange(e)}>
                                            <IntlMessages id="sidebar.selStatus">{(selStatus) => <option value="">{selStatus}</option>}</IntlMessages>
                                            {statusList.map((sList, index) => (
                                                <IntlMessages key={index} id={sList.label}>{(placeholder) => <option value={sList.id}>{placeholder}</option>}</IntlMessages>
                                            ))}
                                        </Input>
                                        {errors.Status && <span className="text-danger text-left"><IntlMessages id={errors.Status} /></span>}
                                    </div>
                                </FormGroup>
                            }
                            {menuDetail &&
                                <FormGroup row>
                                    <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                        <div className="btn_area">
                                            <Button disabled={this.props.loading} variant="raised" color="primary" onClick={isEdit ? (e) => this.onEditRole(e) : (e) => this.onAddRole(e)}><IntlMessages id={isEdit ? "sidebar.btnEdit" : "sidebar.btnAdd"} /></Button>
                                            <Button disabled={this.props.loading} variant="raised" color="danger" className="ml-15" onClick={() => this.resetData()}><IntlMessages id="sidebar.btnCancel" /></Button>
                                        </div>
                                    </div>
                                </FormGroup>
                            }
                        </Form>
                    </div>
                </div>
            </Fragment>
        );
    }
}

//Default Props
AddEditRole.defaultProps = {
    pagedata: {
        isEdit: false
    }
}

const mapToProps = ({ roleManagementRdcer,authTokenRdcer }) => {
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { data, getData, loading } = roleManagementRdcer;
    return { data, getData, loading ,menuLoading,menu_rights};
}

export default connect(mapToProps, {
    addRoleManagement,
    getRoleManagementList,
    editRoleManagement,
    getMenuPermissionByID
})(AddEditRole);