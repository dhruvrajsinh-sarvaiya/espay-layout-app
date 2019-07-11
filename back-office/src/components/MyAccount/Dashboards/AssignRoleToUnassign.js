/*
    Developer : Bharat Jograna
    Date : 20 MARCH 2019
    Update by :
    File Comment : My Account Remove And Assign Role Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { FormGroup, Button } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { getRoleManagementList, assignRoleManagement, listUnassignUserRole } from "Actions/MyAccount";
import Select from "react-select";
import AppConfig from 'Constants/AppConfig';
import { getMenuPermissionByID } from 'Actions/MyAccount';

class AssignRoleToUnassign extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                RoleId: '',
                UserId: ''
            },
            loading: true,
            userDetail: {},
            roleList: [],
            roleLable: null,
            errors: {},
            fieldList: {},
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
        }
    }

    //To close all the drawer
    closeAll = () => {
        this.props.closeAll();
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('36B05A7B-39B0-7998-410D-F14BAC3983D6'); // get myaccount menu permission
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading,loading:nextProps.loading })
        //Added by Saloni Rathod
		/* update menu details if not set */
		if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')&& this.state.notificationFlag) {
			if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                const reqObj = {
                    PageNo: 1,
                    PageSize: AppConfig.totalRecordDisplayInList,
                    AllRecords: 1
                }
                this.props.getRoleManagementList(reqObj);
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					window.location.href = AppConfig.afterLoginRedirect;
				}, 2000);
			}
		}

        //Get User Detail By User Id... 
        if (nextProps.getData.ReturnCode === 1 || nextProps.getData.ReturnCode === 9) {
            var errMsg = nextProps.getData.ErrorCode === 1 ? nextProps.getData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.getData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.getData.ReturnCode === 0 && nextProps.getData.hasOwnProperty('Data')) {
            this.setState({ userDetail: nextProps.getData.Data, data: { RoleId: nextProps.getData.Data.RoleId } })
        }

        //Get Role List...
        if (nextProps.list.ReturnCode === 0) {
            this.setState({ roleList: nextProps.list.Details })
        }

        //Get Responce of Remove And Assign Role...
        if (nextProps.assignData.ReturnCode === 1 || nextProps.assignData.ReturnCode === 9) {
            var assErrMsg = nextProps.assignData.ErrorCode === 1 ? nextProps.assignData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.assignData.ErrorCode}`} />;
            NotificationManager.error(assErrMsg);
        } else if (nextProps.assignData.ReturnCode === 0) {
            NotificationManager.success(nextProps.assignData.ReturnMsg);
            this.props.listUnassignUserRole(this.props.pagedata);
            this.props.drawerClose();
        }
    }

    onChangeSelectUser(event) {
        event === null && (event = { label: null, value: "" });
        var newObj = Object.assign({}, this.state.data);
        newObj.RoleId = event.value;
        newObj.UserId = this.state.userDetail.UserId;
        this.setState({ data: newObj, roleLable: event.label })
    }

    onAssignRole() {
        if (typeof (this.state.data.RoleId) === 'undefined' || this.state.data.RoleId === '' || this.state.data.RoleId <= 0) {
            this.setState({ errors: { RoleId: "my_account.err.fieldRequired" } })
        } else if (this.state.data.RoleId > 0) {
            this.setState({ errors: '' });
            this.props.assignRoleManagement(this.state.data);
        }
    }

    clearData() {
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
        const { UserName, FirstName, LastName, Email, Mobile } = this.state.userDetail;
        const { loading, roleList, roleLable, errors } = this.state;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('7DAE790E-A3A1-1EB7-5C74-4765DBE47E2A'); //C65C0B7A-404E-9EAC-4CBD-A675695075AE
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

        return (
            <div className="jbs-page-content">
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="my_account.userRoleAssign" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <Fragment>
                    <table className="table table-striped">
                        <tbody>
                            <tr className="row">
                                {(menuPermissionDetail["0B4F9B62-5001-4B52-67C6-B247B89846CF"] && menuPermissionDetail["0B4F9B62-5001-4B52-67C6-B247B89846CF"].Visibility === "E925F86B") && //0B4F9B62-5001-4B52-67C6-B247B89846CF
                                    <th scope="row" className="col-md-3 col-sm-3 col-6"><IntlMessages id="my_account.common.userName" /></th>}
                                {(menuPermissionDetail["0B4F9B62-5001-4B52-67C6-B247B89846CF"] && menuPermissionDetail["0B4F9B62-5001-4B52-67C6-B247B89846CF"].Visibility === "E925F86B") && //0B4F9B62-5001-4B52-67C6-B247B89846CF
                                    <td className="col-md-3 col-sm-3 col-6">{UserName}</td>}
                                {(menuPermissionDetail["FF898186-9343-6833-021D-C976968A6B8A"] && menuPermissionDetail["FF898186-9343-6833-021D-C976968A6B8A"].Visibility === "E925F86B") && //FF898186-9343-6833-021D-C976968A6B8A
                                    <th scope="row" className="col-md-3 col-sm-3 col-6"><IntlMessages id="my_account.common.fullname" /></th>}
                                {(menuPermissionDetail["FF898186-9343-6833-021D-C976968A6B8A"] && menuPermissionDetail["FF898186-9343-6833-021D-C976968A6B8A"].Visibility === "E925F86B") && //FF898186-9343-6833-021D-C976968A6B8A
                                    <td className="col-md-3 col-sm-3 col-6">{FirstName + ' ' + LastName}</td>}
                            </tr>
                            <tr className="row">
                                {(menuPermissionDetail["A0476337-6636-2F1C-2BD3-F720999648CA"] && menuPermissionDetail["A0476337-6636-2F1C-2BD3-F720999648CA"].Visibility === "E925F86B") && //A0476337-6636-2F1C-2BD3-F720999648CA
                                    <th scope="row" className="col-md-3 col-sm-3 col-6"><IntlMessages id="my_account.common.email" /></th>}
                                {(menuPermissionDetail["A0476337-6636-2F1C-2BD3-F720999648CA"] && menuPermissionDetail["A0476337-6636-2F1C-2BD3-F720999648CA"].Visibility === "E925F86B") && //A0476337-6636-2F1C-2BD3-F720999648CA
                                    <td className="col-md-3 col-sm-3 col-6">{Email}</td>}
                                {(menuPermissionDetail["5A07A1DB-8A78-5A76-7F6A-3F479A4914DB"] && menuPermissionDetail["5A07A1DB-8A78-5A76-7F6A-3F479A4914DB"].Visibility === "E925F86B") && //5A07A1DB-8A78-5A76-7F6A-3F479A4914DB
                                    <th scope="row" className="col-md-3 col-sm-3 col-6"><IntlMessages id="my_account.common.mobileno" /></th>}
                                {(menuPermissionDetail["5A07A1DB-8A78-5A76-7F6A-3F479A4914DB"] && menuPermissionDetail["5A07A1DB-8A78-5A76-7F6A-3F479A4914DB"].Visibility === "E925F86B") && //5A07A1DB-8A78-5A76-7F6A-3F479A4914DB
                                    <td className="col-md-3 col-sm-3 col-6">{Mobile}</td>}
                            </tr>
                        </tbody>
                    </table>
                    <div className="tradefrm">
                        {(menuPermissionDetail["2FCA825A-7151-5619-6ED8-D2DEEBB02BBF"] && menuPermissionDetail["2FCA825A-7151-5619-6ED8-D2DEEBB02BBF"].Visibility === "E925F86B") && //2FCA825A-7151-5619-6ED8-D2DEEBB02BBF
                            <FormGroup className="row">
                                <label className="col"><IntlMessages id="my_account.common.role" /><span className="text-danger">*</span></label>
                                <div className="col-md-9 col-sm-9 col-xs-12">
                                    <Select className="w-50"
                                        options={roleList.map((user) => ({
                                            value: user.RoleID,
                                            label: user.RoleName
                                        }))}
                                        isDisabled={(menuPermissionDetail["2FCA825A-7151-5619-6ED8-D2DEEBB02BBF"].AccessRight === "11E6E7B0") ? true : false}
                                        value={this.state.roleLable === null ? null : ({ label: roleLable })}
                                        onChange={(e) => this.onChangeSelectUser(e)}
                                        maxMenuHeight={200}
                                    />
                                    {errors.RoleId && <span className="text-danger"><IntlMessages id={errors.RoleId} /></span>}
                                </div>
                            </FormGroup>}
                    </div>
                    {Object.keys(menuPermissionDetail).length > 0  &&
                        <FormGroup row>
                            <div className="offset-md-3 col-md-9 offset-sm-3 col-sm-9 col-xs-12">
                                <div className="btn_area">
                                <Button disabled={this.props.loading} variant="raised" color="primary" onClick={() => this.onAssignRole()}><IntlMessages id="sidebar.btnAssignRole" /></Button>
                                <Button disabled={this.props.loading} variant="raised" color="danger" className="ml-15" onClick={() => this.clearData()}><IntlMessages id="sidebar.btnCancel" /></Button>
                                </div>
                            </div>
                        </FormGroup>
                    }
                </Fragment>
            </div>
        );
    }
}

//function map to props
const mapToStateProps = ({ roleManagementRdcer, UserRdcer ,authTokenRdcer}) => {
    var response = {
        userRoleList: roleManagementRdcer.userRoleList,
        list: roleManagementRdcer.list,
        loading: roleManagementRdcer.listLoading || roleManagementRdcer.loading ? true : false,
        assignData: roleManagementRdcer.assignData,
        getData: UserRdcer.getData,        menuLoading:authTokenRdcer.menuLoading,
        menu_rights:authTokenRdcer.menu_rights,
    }
    return response;
}

export default connect(mapToStateProps, {
    getRoleManagementList,
    assignRoleManagement,
    listUnassignUserRole,
    getMenuPermissionByID
})(AssignRoleToUnassign);