/* 
    Developer : Saloni Rathod
    Date : 28-02-2019
    File Comment : MyAccount Add/Edit User Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
import { addUser, editUser, getUserById, listUser, getRoleManagementList, getRolePermissionGroupList } from "Actions/MyAccount";
import { getUserStatus } from 'Helpers/helpers';
import validateUser from "Validations/MyAccount/add_edit_user";
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//Component for MyAccount Add/Edit user Dashboard
class AddEditUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: {
                UserName: '',
                FirstName: '',
                LastName: '',
                Email: '',
                Password: '',
                Mobile: '',
                confirmPassword: '',
                Status: '',

                GroupID: ''
            },
            isEdit: false,
            roleList: [],
            isAddData: false,
            errors: "",
            pageData: {
                PageNo: 0,
                PageSize: AppConfig.totalRecordDisplayInList
            },
            fieldList: {},
            browserData: {},
            BData_flag: true,
            menudetail: [],
            notification: true,
            groupData: []
        };
    }

    resetData() {
        var newObj = Object.assign({}, this.state.data);
        newObj['UserName'] = this.state.browserData.UserName;
        newObj['FirstName'] = '';
        newObj['LastName'] = '';
        newObj['Email'] = '';
        newObj['Password'] = this.state.browserData.Password;
        newObj['confirmPassword'] = '';
        newObj['Mobile'] = '';
        newObj['Status'] = '';
        newObj['GroupID'] = '';
        this.setState({ data: newObj, isAddData: false, errors: "", isEdit: false });
        this.props.drawerClose();
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    };

    showComponent = componentName => {
        this.setState({
            componentName: componentName,
            open: this.state.open ? false : true
        });
    };

    onChange(event) {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
        if (this.state.BData_flag) {
            if (this.state.browserData.UserName && this.state.browserData.Password) {
                this.setState({ BData_flag: false })
            } else {
                this.setState({ browserData: newObj })
            }
        }
    }

    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.pagedata.isEdit ? 'AB0A8F90-6808-3660-1921-DF04924E94D9' : '179F0A38-445D-4CA1-905D-662D07F22E20');

    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });
        // added by saloni
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                var rmObj = Object.assign({}, this.state.pageData);
                rmObj.AllRecords = 1; //Get All Record
                this.props.getRoleManagementList(rmObj);
                this.props.getRolePermissionGroupList({}); // added by Tejas fro get group list
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notification: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }

        //Get  Role List...
        if (nextProps.list.hasOwnProperty('Details') && nextProps.list.Details.length > 0) {
            this.setState({ roleList: nextProps.list.Details });
        }

        //Get Edit Data By Id
        if (nextProps.getData.hasOwnProperty('Data') && Object.keys(nextProps.getData.Data).length > 0 && this.props.pagedata.isEdit) {
            this.setState({ data: nextProps.getData.Data });
        }

        //to add Data
        if ((nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) && this.state.isAddData) {

            this.setState({ isAddData: false });
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.data.ReturnCode === 0 && this.state.isAddData) {
            this.setState({ isAddData: false });
            var rmObject = Object.assign({}, this.state.pageData);
            rmObject.AllRecords = 1; //Get All Record
            this.props.listUser(rmObject);
            var sucMsg = nextProps.data.ErrorCode === 0 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
            this.resetData();
        }

        //set for grouplist data added by tejas
        if (nextProps.groupListData && nextProps.groupListData.ReturnCode === 0) {
            this.setState({
                groupData: nextProps.groupListData.GroupListData
            })
        } else {
            this.setState({
                groupData: []
            })
        }
    }

    //Add User method...
    onAddUser(event) {
        event.preventDefault();

        const { errors, isValid } = validateUser(this.state.data);
        this.setState({ errors: errors });
        if (isValid) {
            this.setState({ isAddData: true });
            this.props.addUser(this.state.data);
        }
    }

    //Edit User method...
    onEditUser(event) {
        event.preventDefault();
        var newObj = Object.assign({});
        newObj['UserId'] = this.state.data.UserId;
        newObj['FirstName'] = this.state.data.FirstName;
        newObj['LastName'] = this.state.data.LastName;
        newObj['Status'] = this.state.data.Status;

        newObj['GroupID'] = this.state.data.GroupID
        const { errors, isValid } = validateUser(newObj);
        this.setState({ errors: errors });
        if (isValid) {
            this.setState({ isAddData: true });
            this.props.editUser(newObj);
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
        const { drawerClose } = this.props;
        const { isEdit } = this.props.pagedata;
        const { errors, groupData } = this.state;
        const { UserName, FirstName, LastName, Email, Mobile, Status, GroupID } = this.state.data;
        const statusList = getUserStatus();
        var menuDetail = this.checkAndGetMenuAccessDetail(isEdit ? 'BF61D838-0D07-5A81-9B44-951141EC83FB' : '99A49E22-8CF7-3F56-2842-D50DFEED26A7');
        return (
            <Fragment>
                {(this.props.menuLoading || this.props.loading) && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id={isEdit ? "sidebar.editUsers" : "sidebar.adduser"} />} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="jbs-page-content col-md-12 mx-auto">
                        <Form className="tradefrm">
                            {(menuDetail["BE683DED-6F05-15FA-41E3-41B9EFFA0936"] && menuDetail["BE683DED-6F05-15FA-41E3-41B9EFFA0936"].Visibility === "E925F86B")//BE683DED-6F05-15FA-41E3-41B9EFFA0936--edit

                                &&
                                isEdit &&
                                <FormGroup className="row">
                                    <Label for="UserName" className="control-label col" ><IntlMessages id="sidebar.colUserName" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8">{UserName}</div>
                                </FormGroup>
                            }
                            {(menuDetail["14B390CD-6121-437B-8A31-04B0F5FFA7BC"] && menuDetail["14B390CD-6121-437B-8A31-04B0F5FFA7BC"].Visibility === "E925F86B")//14B390CD-6121-437B-8A31-04B0F5FFA7BC---edit

                                &&
                                isEdit &&
                                <FormGroup className="row">
                                    <Label for="Email" className="control-label col" ><IntlMessages id="sidebar.email" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8">{Email}</div>
                                </FormGroup>
                            }

                            {(menuDetail["7923EE4B-41A2-282D-6534-F77131700024"] && menuDetail["7923EE4B-41A2-282D-6534-F77131700024"].Visibility === "E925F86B")//7923EE4B-41A2-282D-6534-F77131700024
                                &&
                                isEdit &&
                                <FormGroup className="row">
                                    <Label for="Mobile" className="control-label col" ><IntlMessages id="my_account.common.mobileno" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8">{Mobile}</div>
                                </FormGroup>
                            }
                            {(menuDetail["399A1A9F-4968-04E0-0940-B8E8FF5D0C40"] && menuDetail["399A1A9F-4968-04E0-0940-B8E8FF5D0C40"].Visibility === "E925F86B")//399A1A9F-4968-04E0-0940-B8E8FF5D0C40--add
                                &&
                                !isEdit &&
                                <FormGroup className="row">
                                    <Label for="UserName" className="control-label col" ><IntlMessages id="sidebar.colUserName" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8">
                                        <IntlMessages id="sidebar.entrUserName">
                                            {(placeholder) =>
                                                <Input type="text" name="UserName" value={UserName} placeholder={placeholder} id="UserName" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.UserName && <span className="text-danger text-left"><IntlMessages id={errors.UserName} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["7869A3BD-1B1E-8185-92F8-64BA065D2A2F"] && menuDetail["7869A3BD-1B1E-8185-92F8-64BA065D2A2F"].Visibility === "E925F86B")//7869A3BD-1B1E-8185-92F8-64BA065D2A2F
                                : (menuDetail["C8287774-0AF3-091F-7C3D-62F607CFA6F2"] && menuDetail["C8287774-0AF3-091F-7C3D-62F607CFA6F2"].Visibility === "E925F86B"))//C8287774-0AF3-091F-7C3D-62F607CFA6F2
                                &&
                                <FormGroup className="row">
                                    <Label for="FirstName" className="control-label col" ><IntlMessages id="sidebar.colFirstName" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8">
                                        <IntlMessages id="sidebar.entrFirstName">
                                            {(placeholder) =>
                                                <Input type="text" name="FirstName" value={FirstName} placeholder={placeholder} id="FirstName" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.FirstName && <span className="text-danger text-left"><IntlMessages id={errors.FirstName} /></span>}
                                    </div>
                                </FormGroup>
                            }
                            {(isEdit ? (menuDetail["A58BC588-2B1E-785E-1715-F56355CC064C"] && menuDetail["A58BC588-2B1E-785E-1715-F56355CC064C"].Visibility === "E925F86B")//A58BC588-2B1E-785E-1715-F56355CC064C
                                : (menuDetail["49107ABE-0DB3-8ED8-18C5-BA4D6773355B"] && menuDetail["49107ABE-0DB3-8ED8-18C5-BA4D6773355B"].Visibility === "E925F86B"))//49107ABE-0DB3-8ED8-18C5-BA4D6773355B
                                &&
                                <FormGroup className="row">
                                    <Label for="LastName" className="control-label col" ><IntlMessages id="sidebar.colLastName" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8">
                                        <IntlMessages id="sidebar.entrLastName">
                                            {(placeholder) =>
                                                <Input type="text" name="LastName" value={LastName} placeholder={placeholder} id="LastName" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.LastName && <span className="text-danger text-left"><IntlMessages id={errors.LastName} /></span>}
                                    </div>
                                </FormGroup>
                            }
                            {(menuDetail["399A79E0-7C48-145C-328F-4ABC74E37A83"] && menuDetail["399A79E0-7C48-145C-328F-4ABC74E37A83"].Visibility === "E925F86B")//399A79E0-7C48-145C-328F-4ABC74E37A83---add
                                &&
                                !isEdit &&
                                <FormGroup className="row">
                                    <Label for="Email" className="control-label col" ><IntlMessages id="sidebar.email" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8">
                                        <IntlMessages id="sidebar.entrEmail">
                                            {(placeholder) =>
                                                <Input type="text" name="Email" value={Email} placeholder={placeholder} id="Email" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.Email && <span className="text-danger text-left"><IntlMessages id={errors.Email} /></span>}
                                    </div>
                                </FormGroup>}
                            {(menuDetail["D5CDEF7A-1234-A634-1F92-BDACA4E52340"] && menuDetail["D5CDEF7A-1234-A634-1F92-BDACA4E52340"].Visibility === "E925F86B")//D5CDEF7A-1234-A634-1F92-BDACA4E52340---add
                                &&
                                !isEdit &&
                                <FormGroup className="row">
                                    <Label for="Mobile" className="control-label col" ><IntlMessages id="my_account.common.mobileno" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8">
                                        <IntlMessages id="sidebar.entrMobileNo">
                                            {(placeholder) =>
                                                <Input type="text" name="Mobile" value={Mobile} placeholder={placeholder} id="MobileNo" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.Mobile && <span className="text-danger text-left"><IntlMessages id={errors.Mobile} /></span>}
                                    </div>
                                </FormGroup>}
                            {(menuDetail["9C413C0E-2AF6-837C-4099-B7A442599630"] && menuDetail["9C413C0E-2AF6-837C-4099-B7A442599630"].Visibility === "E925F86B")//A997E102-5D05-4237-72A2-6040A2683883----edit
                                &&
                                isEdit &&
                                <FormGroup className="row">


                                    <Label for="GroupID" className="control-label col"><IntlMessages id="sidebar.groupID" />

                                    </Label>

                                    <div className="col-md-8">
                                        <Input type="select" name="GroupID" value={GroupID} id="GroupID" onChange={(e) => this.onChange(e)}>
                                            <IntlMessages id="sidebar.selGroupID">{(GroupId) => <option value="0">{GroupId}</option>}</IntlMessages>
                                            {groupData.map((mList, index) => (
                                                <option key={index} value={mList.GroupID}>{mList.GroupName}</option>
                                            ))}
                                        </Input>
                                        {errors.GroupID && <span className="text-danger text-left"><IntlMessages id={errors.GroupID} /></span>}
                                    </div>
                                </FormGroup>}
                            {(menuDetail["B0347C50-6191-A475-55AF-F37BA7504260"] && menuDetail["B0347C50-6191-A475-55AF-F37BA7504260"].Visibility === "E925F86B")//9B493A6F-15A6-A32A-1126-6E9E2445136B--add
                                &&
                                !isEdit &&
                                <FormGroup className="row">
                                    <Label for="GroupID" className="control-label col"><IntlMessages id="sidebar.groupID" />

                                    </Label>
                                    <div className="col-md-8">
                                        <Input type="select" name="GroupID" value={GroupID} id="GroupID" onChange={(e) => this.onChange(e)}>
                                            <IntlMessages id="sidebar.selGroupID">{(groupId) => <option value="0">{groupId}</option>}</IntlMessages>
                                            {groupData.map((mList, index) => (
                                                <option key={index} value={mList.GroupID}>{mList.GroupName}</option>
                                            ))}
                                        </Input>
                                        {errors.GroupID && <span className="text-danger text-left"><IntlMessages id={errors.GroupID} /></span>}
                                    </div>
                                </FormGroup>}
                            {(menuDetail["9B493A6F-15A6-A32A-1126-6E9E2445136B"] && menuDetail["9B493A6F-15A6-A32A-1126-6E9E2445136B"].Visibility === "E925F86B")//9B493A6F-15A6-A32A-1126-6E9E2445136B--add
                                &&
                                !isEdit &&
                                <FormGroup className="row">
                                    <Label for="Password" className="control-label col" ><IntlMessages id="sidebar.password" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8">
                                        <IntlMessages id="sidebar.entrPassword">
                                            {(placeholder) =>

                                                <Input type="password" name="Password" placeholder={placeholder} id="Password" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.Password && <span className="text-danger text-left"><IntlMessages id={errors.Password} /></span>}
                                    </div>
                                </FormGroup>}
                            {(menuDetail["4080E02C-4F14-0AC0-4A71-2FE8A3C71B76"] && menuDetail["4080E02C-4F14-0AC0-4A71-2FE8A3C71B76"].Visibility === "E925F86B")//4080E02C-4F14-0AC0-4A71-2FE8A3C71B76--add
                                &&
                                !isEdit &&
                                <FormGroup className="row">
                                    <Label for="confirmPassword" className="control-label col" ><IntlMessages id="my_account.common.confirmPassword" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8">
                                        <IntlMessages id="sidebar.entrConfirmPassword">
                                            {(placeholder) =>
                                                <Input type="password" name="confirmPassword" placeholder={placeholder} id="confirmPassword" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.confirmPassword && <span className="text-danger text-left"><IntlMessages id={errors.confirmPassword} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["E78BACDD-928B-A3AD-9237-4DF295D671BB"] && menuDetail["E78BACDD-928B-A3AD-9237-4DF295D671BB"].Visibility === "E925F86B")//E78BACDD-928B-A3AD-9237-4DF295D671BB
                                : (menuDetail["8396DD4E-3038-80D3-1EFF-460CAD0520C2"] && menuDetail["8396DD4E-3038-80D3-1EFF-460CAD0520C2"].Visibility === "E925F86B"))//8396DD4E-3038-80D3-1EFF-460CAD0520C2
                                &&
                                <FormGroup className="row">
                                    <Label for="Status" className="control-label col"><IntlMessages id="my_account.status" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8">
                                        <Input type="select" name="Status" value={Status} id="Status" onChange={(e) => this.onChange(e)}>
                                            <IntlMessages id="sidebar.selStatus">{(selStatus) => <option value="">{selStatus}</option>}</IntlMessages>
                                            {statusList.map((sList, index) => (
                                                <IntlMessages key={index} id={sList.label}>{(placeholder) => <option value={sList.id}>{placeholder}</option>}</IntlMessages>
                                            ))}
                                        </Input>
                                        {errors.Status && <span className="text-danger text-left"><IntlMessages id={errors.Status} /></span>}
                                    </div>
                                </FormGroup>
                            }
                            {Object.keys(menuDetail).length > 0 &&
                                <FormGroup row className="mt-50">
                                    <Label className="col-md-4" />
                                    <div className="col-md-2">
                                        <Button disabled={this.props.loading} variant="raised" color="primary" onClick={isEdit ? (e) => this.onEditUser(e) : (e) => this.onAddUser(e)}><IntlMessages id={isEdit ? "sidebar.btnEdit" : "sidebar.btnAdd"} /></Button>
                                    </div>
                                    <div className="col-md-2">
                                        <Button disabled={this.props.loading} variant="raised" color="danger" onClick={() => this.resetData()}><IntlMessages id="sidebar.btnCancel" /></Button>
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
AddEditUser.defaultProps = {
    UserId: '0',
    pagedata: {
        isEdit: false
    }
}

const mapToProps = ({ UserRdcer, roleManagementRdcer, authTokenRdcer, rolePermissionGroupRdcer }) => {
    const response = {
        getData: UserRdcer.getData,
        data: UserRdcer.data,
        loading: UserRdcer.loading || rolePermissionGroupRdcer.loading ? true : false,
        list: roleManagementRdcer.list,
        menuLoading: authTokenRdcer.menuLoading,
        menu_rights: authTokenRdcer.menu_rights,
        groupListData: rolePermissionGroupRdcer.list
    }
    return response;
}

export default connect(mapToProps, {
    addUser,
    getUserById,
    editUser,
    listUser,
    getRoleManagementList,
    getMenuPermissionByID,
    getRolePermissionGroupList
})(AddEditUser);