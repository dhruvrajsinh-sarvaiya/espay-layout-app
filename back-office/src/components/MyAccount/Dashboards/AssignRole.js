/* 
    Developer : Salim Deraiya
    Date : 27-02-2019
    File Comment : My Account Assign Role Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { FormGroup, Label, Button } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { assignRoleManagement, getRoleManagementList, getUserDataList } from "Actions/MyAccount";
import { ActiveInactiveStatus } from '../ActiveInactiveStatus';
import Select from "react-select";
import { injectIntl } from 'react-intl';
import validateRoles from 'Validations/MyAccount/add_role';
import AppConfig from 'Constants/AppConfig';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
class AssignRole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: {
                RoleID: '',
                RoleName: '',
                RoleDescription: '',
                Status: ''
            },
            pageData: {
                PageNo: 0,
                PageSize: AppConfig.totalRecordDisplayInList
            },
            isAddData: false,
            UserId: '',
            UserLabel: null,
            errors: "",
            fieldList: {},
            menudetail: [],
            notification: true,
        };
        this.initState = this.state;
    }

    clearData() {
        this.setState(this.initState);
        this.props.drawerClose();
        this.setState({ fieldList: this.state.fieldList })
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    };

    //onchange select user
    onChangeSelectUser(e) {
        e === null && (e = { label: null, value: "" });
        this.setState({ UserId: e.value, UserLabel: e.label });
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('C65C0B7A-404E-9EAC-4CBD-A675695075AE'); // get myaccount menu permission
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });
        // added by vishva
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getUserDataList();
                
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

        //Add Data
        if (nextProps.assignData.ReturnCode === 1 || nextProps.assignData.ReturnCode === 9) {
            var errMsg = nextProps.assignData.ErrorCode === 1 ? nextProps.assignData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.assignData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.assignData.ReturnCode === 0 && this.state.isAddData) {
            this.setState({ isAddData: false });
            this.props.getRoleManagementList(this.state.pageData);
            var sucMsg = nextProps.assignData.ErrorCode === 0 ? nextProps.assignData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.assignData.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
            this.resetData();
        }
    }

    //Assign Role method...
    onAssignRole(event) {
        event.preventDefault();
        const { errors, isValid } = validateRoles({ UserId: this.state.UserId });
        this.setState({ errors: errors });

        if (isValid) {
            this.setState({ isAddData: true });
            var reqObj = {
                RoleId: this.state.data.RoleID,
                UserId: this.state.UserId
            }
            this.props.assignRoleManagement(reqObj);
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
                    response = fieldList;
                }
            }
        }
    }
        return response;
}
    render() {
        const intl = this.props.intl;
        const { drawerClose } = this.props;
        const { errors, UserLabel } = this.state;
        const { RoleName, RoleDescription, Status } = this.state.data;
        const userlist = this.props.getUser.hasOwnProperty('GetUserData') ? this.props.getUser.GetUserData : [];
        var menuDetail = this.checkAndGetMenuAccessDetail('3F55FFD9-6CB8-06F4-7296-120B8A192E38'); //C65C0B7A-404E-9EAC-4CBD-A675695075AE
        if (!menuDetail) {
            menuDetail = { Utility: [], CrudOption: [] }
        }
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.userRoleAssign" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <Fragment>
                    {this.props.loading && <JbsSectionLoader />}
                    <table className="table table-striped">
                        <colgroup>
                            <col width="25%" />
                            <col width="75%" />
                        </colgroup>
                        <tbody>
                            {(menuDetail["7BF86B00-1154-11C7-3DEF-99CD0BBE8F54"] && menuDetail["7BF86B00-1154-11C7-3DEF-99CD0BBE8F54"].Visibility === "E925F86B") && //7BF86B00-1154-11C7-3DEF-99CD0BBE8F54
                                <tr>
                                    <th scope="row"><IntlMessages id="my_account.roleName" /></th>
                                    <td>{RoleName}</td>
                                </tr>
                            }
                            {(menuDetail["EE5AB370-2F85-5276-20C7-6C7CE70020EF"] && menuDetail["EE5AB370-2F85-5276-20C7-6C7CE70020EF"].Visibility === "E925F86B") && //EE5AB370-2F85-5276-20C7-6C7CE70020EF
                                <tr>
                                    <th scope="row"><IntlMessages id="my_account.roleDescription" /></th>
                                    <td>{RoleDescription}</td>
                                </tr>}
                            {(menuDetail["66BB3A6D-4DCB-4DF9-A126-F87A1B677790"] && menuDetail["66BB3A6D-4DCB-4DF9-A126-F87A1B677790"].Visibility === "E925F86B") && //66BB3A6D-4DCB-4DF9-A126-F87A1B677790
                                <tr>
                                    <th scope="row"><IntlMessages id="my_account.status" /></th>
                                    <td><ActiveInactiveStatus status={Status} /></td>
                                </tr>}
                        </tbody>
                    </table>
                    <div className="tradefrm">
                        {(menuDetail["C78E7956-A5CF-2FDE-4FC5-F6FB3C1937CB"] && menuDetail["C78E7956-A5CF-2FDE-4FC5-F6FB3C1937CB"].Visibility === "E925F86B") && //C78E7956-A5CF-2FDE-4FC5-F6FB3C1937CB
                            <FormGroup>
                                <div className="row">
                                    <label className="col ml-10 mb-15"><IntlMessages id="sidebar.user" /><span className="text-danger">*</span></label>
                                    <div className="col-md-9">
                                        <Select className="w-50"
                                            options={userlist.map((user, i) => ({
                                                label: user.UserName,
                                                value: user.Id,
                                            }))}
                                            onChange={e => this.onChangeSelectUser(e)}
                                            value={this.state.UserLabel === null ? null : ({ labl: UserLabel })}
                                            isClearable={true}
                                            maxMenuHeight={200}
                                            placeholder={intl.formatMessage({ id: "sidebar.searchdot" })}
                                        />
                                        {errors.UserId && <span className="text-danger"><IntlMessages id={errors.UserId} /></span>}
                                    </div>
                                </div>
                            </FormGroup>}
                    </div>
                    {Object.keys(menuDetail).length > 0 &&
                        <FormGroup row className="mt-50">
                            <Label className="col-md-4" />
                            <div className="col-md-2">
                                <Button disabled={this.props.loading} variant="raised" color="primary" onClick={(e) => this.onAssignRole(e)}><IntlMessages id="sidebar.btnAssignRole" /></Button>
                            </div>
                            <div className="col-md-2">
                                <Button disabled={this.props.loading} variant="raised" color="danger" onClick={() => this.clearData()}><IntlMessages id="sidebar.btnCancel" /></Button>
                            </div>
                        </FormGroup>
                    }
                </Fragment>
            </div>
        );
    }
}

const mapStateToProps = ({ roleManagementRdcer, actvHstrRdcer ,authTokenRdcer}) => {
    const { getData, assignData, loading } = roleManagementRdcer;
    const { getUser } = actvHstrRdcer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { getData, assignData, loading, getUser ,        menuLoading,
        menu_rights};
}

export default connect(mapStateToProps, {
    assignRoleManagement,
    getRoleManagementList,
    getUserDataList,
    getMenuPermissionByID,
})(injectIntl(AssignRole));