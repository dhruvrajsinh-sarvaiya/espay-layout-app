/*
    Developer : Bharat Jograna
    Date : 14 MARCH 2019
    Update by :
    File Comment : My Account Remove And Assign Role Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { FormGroup, Label, Button } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { getRoleManagementList, removeAndAssignRole, listUserRoleAssignByRoleId } from "Actions/MyAccount";
import { ActiveInactiveStatus } from '../ActiveInactiveStatus';
import Select from "react-select";
import AppConfig from 'Constants/AppConfig';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
class UpdateAssignRole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                RoleId: '',
                UserId: ''
            },
            isAddData: false,
            defaultLable: null,
            loading: true,
            userDetail: {},
            roleList: [],
            errors: {},
            fieldList: {},
            menudetail: [],
            notification: true,
        }
    }

    //To close all the drawer
    closeAll = () => {
        this.props.closeAll();
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('0B2076D0-A57A-9200-2078-F959AE608B7F'); // get myaccount menu permission
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });
        // added by vishva
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                if (!this.props.pagedata.isEdit) {
                    const reqObj = {
                        PageNo: 1,
                        PageSize: AppConfig.totalRecordDisplayInList,
                        AllRecords: 1
                    }
                    this.props.getRoleManagementList(reqObj);
                }
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notification: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }

        //Get User Detail By User Id... 
        if (nextProps.getData.ReturnCode === 1 || nextProps.getData.ReturnCode === 9) {
            let errMsg = nextProps.getData.ErrorCode === 1 ? nextProps.getData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.getData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.getData.ReturnCode === 0 && nextProps.getData.hasOwnProperty('Data')) {
            this.setState({
                userDetail: nextProps.getData.Data,
                data: { RoleId: nextProps.getData.Data.RoleId }, //to set role id
                defaultLable: nextProps.getData.Data.RoleName, //to set role name in drop down 
            })
        }

        //Get Role List...
        if (nextProps.list.ReturnCode === 0) {
            this.setState({ roleList: nextProps.list.Details })
        }

        //Get Responce of Remove And Assign Role...
        if ((nextProps.assignData.ReturnCode === 1 && this.state.isAddData) || nextProps.assignData.ReturnCode === 9) {
            let errMsg = nextProps.assignData.ErrorCode === 1 ? nextProps.assignData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.assignData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
            this.setState({ isAddData: false });
        } else if (nextProps.assignData.ReturnCode === 0 && this.state.isAddData) {
            NotificationManager.success(nextProps.assignData.ReturnMsg);
            this.setState({ isAddData: false });
            this.props.drawerClose();
            this.props.listUserRoleAssignByRoleId(this.state.data.RoleId)
        }
    }

    onChangeSelectUser(event) {
        event === null && (event = { label: null, value: "" });
        var newObj = Object.assign({}, this.state.data);
        newObj.RoleId = event.value;
        newObj.UserId = this.state.userDetail.UserId;
        this.setState({ data: newObj, defaultLable: event.label })
    }

    onAssignRole() {
        if (this.state.data.RoleId !== this.state.userDetail.RoleId) {
            this.setState({ errors: '', isAddData: true });
            this.props.removeAndAssignRole(this.state.data);
        } else if (this.state.data.RoleId > 0) {
            this.setState({ errors: { RoleId: "sidebar.pleaseSelectDiffRole" } });
        } else {
            this.setState({ errors: { RoleId: "my_account.err.fieldRequired" } });
        }
    }

    clearData() {
        this.setState({ data: { RoleId: '' } })
        this.props.drawerClose();
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
                        response = fieldList;
                    }
                }
            }
        }
                return response;
    }
    render() {
        const { drawerClose } = this.props;
        const { UserName, FirstName, LastName, Email, Mobile, RoleName, PermissionGroup, Status } = this.state.userDetail;
        const { loading, roleList, errors, defaultLable } = this.state;
        var menuDetail = this.checkAndGetMenuAccessDetail('F3566CD7-816D-7132-7C11-1DE726D31A2D'); //C65C0B7A-404E-9EAC-4CBD-A675695075AE
        if (!menuDetail) {
            menuDetail = { Utility: [], CrudOption: [] }
        }
        return (
            <div className="jbs-page-content">
                {(this.props.menuLoading || loading) && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="my_account.updateAssignRole" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <Fragment>
                    <table className="table table-striped">
                        <colgroup>
                            <col width="25%" />
                            <col width="25%" />
                        </colgroup>
                        <tbody>
                            <tr>   {(menuDetail["B0D47C38-2F6E-16DE-2FF3-53801B8794F7"] && menuDetail["B0D47C38-2F6E-16DE-2FF3-53801B8794F7"].Visibility === "E925F86B") && //B0D47C38-2F6E-16DE-2FF3-53801B8794F7
                                <th scope="row"><IntlMessages id="my_account.common.userName" /></th>}
                                {(menuDetail["B0D47C38-2F6E-16DE-2FF3-53801B8794F7"] && menuDetail["B0D47C38-2F6E-16DE-2FF3-53801B8794F7"].Visibility === "E925F86B") && //B0D47C38-2F6E-16DE-2FF3-53801B8794F7
                                    <td>{UserName}</td>}
                                {(menuDetail["C14ABBA7-2951-3475-73E1-EC31DB975206"] && menuDetail["C14ABBA7-2951-3475-73E1-EC31DB975206"].Visibility === "E925F86B") && //C14ABBA7-2951-3475-73E1-EC31DB975206
                                    <th scope="row"><IntlMessages id="my_account.common.fullname" /></th>}
                                {(menuDetail["C14ABBA7-2951-3475-73E1-EC31DB975206"] && menuDetail["C14ABBA7-2951-3475-73E1-EC31DB975206"].Visibility === "E925F86B") && //C14ABBA7-2951-3475-73E1-EC31DB975206
                                    <td>{FirstName + ' ' + LastName}</td>}
                            </tr>
                            <tr>
                                {(menuDetail["88942EEB-4EF3-9EAC-68AE-98E3320D87C5"] && menuDetail["88942EEB-4EF3-9EAC-68AE-98E3320D87C5"].Visibility === "E925F86B") && //88942EEB-4EF3-9EAC-68AE-98E3320D87C5
                                    <th scope="row"><IntlMessages id="my_account.common.email" /></th>}
                                {(menuDetail["88942EEB-4EF3-9EAC-68AE-98E3320D87C5"] && menuDetail["88942EEB-4EF3-9EAC-68AE-98E3320D87C5"].Visibility === "E925F86B") && //88942EEB-4EF3-9EAC-68AE-98E3320D87C5
                                    <td>{Email}</td>}
                                {(menuDetail["E2714B8A-2C34-9F8F-3815-3A8214524716"] && menuDetail["E2714B8A-2C34-9F8F-3815-3A8214524716"].Visibility === "E925F86B") && //E2714B8A-2C34-9F8F-3815-3A8214524716
                                    <th scope="row"><IntlMessages id="my_account.common.mobileno" /></th>}
                                {(menuDetail["E2714B8A-2C34-9F8F-3815-3A8214524716"] && menuDetail["E2714B8A-2C34-9F8F-3815-3A8214524716"].Visibility === "E925F86B") && //E2714B8A-2C34-9F8F-3815-3A8214524716
                                    <td>{Mobile}</td>}
                            </tr>
                            <tr>
                                {(menuDetail["2AC82DEF-4412-5256-A3AA-FC8685316D87"] && menuDetail["2AC82DEF-4412-5256-A3AA-FC8685316D87"].Visibility === "E925F86B") && //2AC82DEF-4412-5256-A3AA-FC8685316D87
                                    <th scope="row"><IntlMessages id="my_account.roleName" /></th>}
                                {(menuDetail["2AC82DEF-4412-5256-A3AA-FC8685316D87"] && menuDetail["2AC82DEF-4412-5256-A3AA-FC8685316D87"].Visibility === "E925F86B") && //2AC82DEF-4412-5256-A3AA-FC8685316D87
                                    <td>{RoleName}</td>}
                                {(menuDetail["C83F1926-94AA-64E8-6488-029FB6B30ABA"] && menuDetail["C83F1926-94AA-64E8-6488-029FB6B30ABA"].Visibility === "E925F86B") && //C83F1926-94AA-64E8-6488-029FB6B30ABA
                                    <th scope="row"><IntlMessages id="my_account.permissionGroups" /></th>}
                                {(menuDetail["C83F1926-94AA-64E8-6488-029FB6B30ABA"] && menuDetail["C83F1926-94AA-64E8-6488-029FB6B30ABA"].Visibility === "E925F86B") && //C83F1926-94AA-64E8-6488-029FB6B30ABA
                                    <td>{PermissionGroup}</td>}
                            </tr>
                            <tr>
                                {(menuDetail["C7E03D52-9784-4BB9-825D-B2008F974488"] && menuDetail["C7E03D52-9784-4BB9-825D-B2008F974488"].Visibility === "E925F86B") && //C7E03D52-9784-4BB9-825D-B2008F974488
                                    <th scope="row"><IntlMessages id="sidebar.colRoleStatus" /></th>}
                                {(menuDetail["C7E03D52-9784-4BB9-825D-B2008F974488"] && menuDetail["C7E03D52-9784-4BB9-825D-B2008F974488"].Visibility === "E925F86B") && //C7E03D52-9784-4BB9-825D-B2008F974488
                                    <td><ActiveInactiveStatus status={Status} /></td>}
                            </tr>
                        </tbody>
                    </table>
                    <div className="tradefrm">
                        {(menuDetail["BBF7C5B6-587A-15F8-9604-E5FF55BF822C"] && menuDetail["BBF7C5B6-587A-15F8-9604-E5FF55BF822C"].Visibility === "E925F86B") && //BBF7C5B6-587A-15F8-9604-E5FF55BF822C
                            <FormGroup className="row mx-0">
                                <label className="col ml-10 mb-15"><IntlMessages id="my_account.common.role" /><span className="text-danger">*</span></label>
                                <div className="col-md-9">
                                    <Select className="w-50"
                                        value={this.state.defaultLable === null ? null : ({ label: defaultLable })}
                                        options={roleList.map((user) => ({
                                            value: user.RoleID,
                                            label: user.RoleName
                                        }))}
                                        onChange={(e) => this.onChangeSelectUser(e)}
                                        maxMenuHeight={200}
                                        isClearable={true}
                                        placeholder={<IntlMessages id="sidebar.searchdot" />}
                                    />
                                    {errors.RoleId && <span className="text-danger"><IntlMessages id={errors.RoleId} /></span>}
                                </div>
                            </FormGroup>
                        }
                    </div>
                    <FormGroup row className="mt-50">
                        <Label className="col-md-4" />
                        <div className="col-md-2">
                            <Button disabled={this.props.loading} variant="raised" color="primary" onClick={() => this.onAssignRole()}><IntlMessages id="sidebar.btnAssignRole" /></Button>
                        </div>
                        <div className="col-md-2">
                            <Button disabled={this.props.loading} variant="raised" color="danger" onClick={() => this.clearData()}><IntlMessages id="sidebar.btnCancel" /></Button>
                        </div>
                    </FormGroup>
                </Fragment>
            </div>
        );
    }
}

//function map to props
const mapToStateProps = ({ roleManagementRdcer, UserRdcer, authTokenRdcer }) => {
    var response = {
        list: roleManagementRdcer.list,
        loading: UserRdcer.loading || roleManagementRdcer.listLoading ? true : false,
        assignData: roleManagementRdcer.assignData,
        getData: UserRdcer.getData,

        menuLoading: authTokenRdcer.menuLoading,
        menu_rights: authTokenRdcer.menu_rights

    }
    return response;
}

export default connect(mapToStateProps, {
    getRoleManagementList,
    removeAndAssignRole,
    listUserRoleAssignByRoleId,
    getMenuPermissionByID,
})(UpdateAssignRole);