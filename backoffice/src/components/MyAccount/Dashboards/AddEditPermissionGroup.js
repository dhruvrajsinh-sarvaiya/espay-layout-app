/*
    Developer : Salim Deraiya
    Date : 07-03-2019
    Update by : 
    File Comment : Add/Edit Role Permission Group Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Input, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Checkbox from '@material-ui/core/Checkbox';
import { NotificationManager } from "react-notifications";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { Divider } from "@material-ui/core";
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import { getRoleManagementList, addRolePermissionGroup, editRolePermissionGroup, getRolePermissionGroupList, getConfigurationRolePermissionGroup } from "Actions/MyAccount";
import { getIPAddress, getActiveInactiveStatus } from "Helpers/helpers";
import validateRolePermissionGroup from 'Validations/MyAccount/add_role_permission_group';
import AppConfig from 'Constants/AppConfig';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//Component for MyAccount Add/Edit Role Permission Group 
class AddEditPermissionGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: {
                GroupID: this.props.GroupID,
                GroupName: '',
                Description: '',
                IPAddress: '',
                RoleId: this.props.RoleId,
                DomainID : '',
                Status: 0,
            },
            pageData: {
                PageNo: 0,
                PageSize: AppConfig.totalRecordDisplayInList
            },
            statusList : getActiveInactiveStatus(),
            roleList: [],
            cnfgMdlData: {},
            curMdlData: {},
            isModelShow: false,
            expanded: 0,
            isAddData: false,
            errors: "",
            fieldsList: {},
            menudetail: [],
            notification: true,
        };
    }

    resetData() {
        var resetObj = Object.assign({}, this.state.data);
        resetObj['GroupName'] = '';
        resetObj['Description'] = '';
        this.setState({ data: resetObj, errors: '' });
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

    moduleChangeData(type, value, name = '', mIdx = '', smIdx = '', fIdx = '', tIdx = '') {
        let newObj = Object.assign({}, this.state.cnfgMdlData);

        if (type === 'subModule') {
            newObj.Modules[mIdx]['SubModules'][smIdx][name] = value ? 1 : 0;
        } else if (type === 'Fields') {
            newObj.Modules[mIdx]['SubModules'][smIdx]['Fields'][fIdx][name] = value === 2 ? 9 : value;
        } else if (type === 'Tools') {
            newObj.Modules[mIdx]['SubModules'][smIdx]['Tools'][tIdx][name] = value ? 1 : 0;
        }
        this.setState({ cnfgMdlData: newObj });
    }

    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.pagedata.isEdit ? '627E46A0-6181-4C1A-6B15-A1EF259930E8' : 'BE053415-3257-0805-399C-0AE2F1D61699');
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });
        // added by vishva
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                if (!this.props.pagedata.isEdit) {
                    // this.props.getConfigurationRolePermissionGroup();
                    var pageData = {
                        PageNo: 0,
                        PageSize: AppConfig.totalRecordDisplayInList,
                        AllRecords: 1
                    };
                    this.props.getRoleManagementList(pageData);
                }
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notification: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }

        //Get Role List...
        if (nextProps.list.hasOwnProperty('Details') && nextProps.list.Details.length > 0) {
            this.setState({ roleList: nextProps.list.Details });
        }

        //Get ConfigData
        /* if (nextProps.configData.ReturnCode === 1 || nextProps.configData.ReturnCode === 9) {
            this.setState({ cnfgMdlData: {} });
        } else if (nextProps.configData.ReturnCode === 0 && nextProps.configData.hasOwnProperty('Result') && Object.keys(nextProps.configData.Result).length > 0){
            this.setState({ cnfgMdlData: nextProps.configData.Result });
        } */

        //Get Permissoin Group Data By Id
        /* if (nextProps.getData.hasOwnProperty('Data') && Object.keys(nextProps.getData.Data).length > 0 && this.props.pagedata.isEdit) {
            var newData = {
                PermissionGroupID: nextProps.getData.Data.PermissionGroupID,
                GroupName: nextProps.getData.Data.GroupName,
                Description: nextProps.getData.Data.Description,
                IPAddress: nextProps.getData.Data.IPAddress,
                LinkedRoleId: nextProps.getData.Data.LinkedRoleId === null ? 0 : nextProps.getData.Data.LinkedRoleId,
                Status: nextProps.getData.Data.Status
            }

            this.setState({ data: newData });
        } */

        if (Object.keys(nextProps.pagedata.prmData).length > 0 && this.props.pagedata.isEdit) {
            this.setState({ data: nextProps.pagedata.prmData });
        }

        //Add/Edit Permission Group Data
        if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) {
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.data.ReturnCode === 0 && this.state.isAddData) {
            this.setState({ isAddData: false });
            this.props.getRolePermissionGroupList(this.state.pageData);
            var sucMsg = nextProps.data.ErrorCode === 0 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
            this.resetData();
        }

        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open4 === false) {
            this.setState({ open: false });
        }
    }

    //Open Model Method...
    openModel = (ModuleName, smdlList, mdlIndex, smIndex) => {
        var newMdlObj = {
            ModuleName: ModuleName,
            SubModuleName: smdlList.SubModuleName,
            ModuleIndex: mdlIndex,
            SubModuleIndex: smIndex,
            SubMdlData: smdlList
        }
        this.setState({ isModelShow: true, curMdlData: newMdlObj });
    }

    //Close Model Method...
    closeModel() {
        this.setState({ isModelShow: false });
    }

    //Expand Panel Change....
    expandPanelChange = panel => (event, expanded) => {
        this.setState({ expanded: expanded ? panel : '' });
    };

    //Add Role Permission Group method...
    onAddRolePerimssionGroup(event) {
        event.preventDefault();
        const { errors, isValid } = validateRolePermissionGroup(this.state.data, this.props.pagedata.isEdit);
        this.setState({ errors: errors });

        if (isValid) {
            this.setState({ isAddData: true });
            let reqObj = {
                RoleId: this.state.data.LinkedRoleId,
                GroupName: this.state.data.GroupName,
                Description: this.state.data.Description,
                DomainID: this.state.data.DomainID
            }
            this.props.addRolePermissionGroup(reqObj);
            /* let self = this;
            var reqObj = Object.assign({}, this.state.data);
            getIPAddress().then(function (ipAddress) {
                reqObj.IPAddress = ipAddress;
                reqObj.Data = self.state.cnfgMdlData;
                self.props.addRolePermissionGroup(reqObj);
            }); */
        }
    }

    //Edit Role Permission Group method...
    onEditRolePerimssionGroup(event) {
        event.preventDefault();
        const { errors, isValid } = validateRolePermissionGroup(this.state.data, this.props.pagedata.isEdit);
        this.setState({ errors: errors });

        if (isValid) {
            this.setState({ isAddData: true });
            this.props.editRolePermissionGroup(this.state.data);
            /* let self = this;
            var reqObj = Object.assign({}, this.state.data);
            getIPAddress().then(function (ipAddress) {
                reqObj.IPAddress = ipAddress;
                reqObj.Data = self.state.cnfgMdlData;
                self.props.editRolePermissionGroup(reqObj);
            }); */
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
        const { expanded, errors, isModelShow, curMdlData, cnfgMdlData, roleList, statusList } = this.state;
        const { GroupName, Description, RoleId, DomainID, Status } = this.state.data;
        var menuDetail = this.checkAndGetMenuAccessDetail(isEdit ? 'D44E6185-1951-78E2-1F94-C5DFE75E9D78' : '55C991D7-9853-8C93-5192-07542A090BE9');
        //BreadCrumbData
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
                title: <IntlMessages id="sidebar.adminPanel" />,
                link: '',
                index: 0
            },
            {
                title: <IntlMessages id="sidebar.userManagement" />,
                link: '',
                index: 1
            },
            {
                title: <IntlMessages id="my_account.permissionGroups" />,
                link: '',
                index: 2
            },
            {
                title: <IntlMessages id={isEdit ? "my_account.editPermissionGroups" : "my_account.addPermissionGroups"} />,
                link: '',
                index: 3
            },
        ];

        return (
            <Fragment>
                {(this.props.menuLoading || this.props.loading) && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id={isEdit ? "my_account.editPermissionGroups" : "my_account.addPermissionGroups"} />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <Form className="tradefrm">
                        {(isEdit ? (menuDetail["CE1328E4-A392-3F38-1A5F-674592824CB4"] && menuDetail["CE1328E4-A392-3F38-1A5F-674592824CB4"].Visibility === "E925F86B")//CE1328E4-A392-3F38-1A5F-674592824CB4
                            : (menuDetail["9C1A5C1E-8526-075B-391F-228E5DA916AB"] && menuDetail["9C1A5C1E-8526-075B-391F-228E5DA916AB"].Visibility === "E925F86B"))//9C1A5C1E-8526-075B-391F-228E5DA916AB
                            &&
                            <FormGroup className="row">
                                <Label for="GroupName" className="control-label col" ><IntlMessages id="my_account.permissionGroupName" /><span className="text-danger">*</span></Label>
                                <div className="col-md-10 col-sm-9 col-xs-12">
                                    <IntlMessages id="sidebar.enterGroupName">
                                        {(placeholder) =>
                                            <Input
                                            disabled={((isEdit ? (menuDetail["CE1328E4-A392-3F38-1A5F-674592824CB4"] && menuDetail["CE1328E4-A392-3F38-1A5F-674592824CB4"].AccessRight === "11E6E7B0")
                                            : (menuDetail["9C1A5C1E-8526-075B-391F-228E5DA916AB"] && menuDetail["9C1A5C1E-8526-075B-391F-228E5DA916AB"].AccessRight === "11E6E7B0"))) ? true : false}
                                            type="text" className="col-md-4 col-12" name="GroupName" value={GroupName} placeholder={placeholder} id="GroupName" onChange={(e) => this.onChange(e)} />
                                        }
                                    </IntlMessages>
                                    {errors.GroupName && <span className="text-danger text-left"><IntlMessages id={errors.GroupName} /></span>}
                                </div>
                            </FormGroup>
                        }
                        {(isEdit ? (menuDetail["F7BCA82E-2607-9D86-3170-62AF40565A79"] && menuDetail["F7BCA82E-2607-9D86-3170-62AF40565A79"].Visibility === "E925F86B")//F7BCA82E-2607-9D86-3170-62AF40565A79
                            : (menuDetail["B5DE8D98-0311-665C-5F1E-C28FE0860101"] && menuDetail["B5DE8D98-0311-665C-5F1E-C28FE0860101"].Visibility === "E925F86B"))//B5DE8D98-0311-665C-5F1E-C28FE0860101
                            &&
                            <FormGroup className="row">
                                <Label for="Description" className="control-label col" ><IntlMessages id="my_account.Description" /><span className="text-danger">*</span></Label>
                                <div className="col-md-10 col-sm-9 col-xs-12">
                                    <IntlMessages id="sidebar.enterDescription">
                                        {(placeholder) =>
                                            <Input
                                            disabled={((isEdit ? (menuDetail["F7BCA82E-2607-9D86-3170-62AF40565A79"] && menuDetail["F7BCA82E-2607-9D86-3170-62AF40565A79"].AccessRight === "11E6E7B0")
                                            : (menuDetail["B5DE8D98-0311-665C-5F1E-C28FE0860101"] && menuDetail["B5DE8D98-0311-665C-5F1E-C28FE0860101"].AccessRight === "11E6E7B0"))) ? true : false}
                                            type="textarea" name="Description" rows="3" value={Description} placeholder={placeholder} id="Description" onChange={(e) => this.onChange(e)} />
                                        }
                                    </IntlMessages>
                                    {errors.Description && <span className="text-danger text-left"><IntlMessages id={errors.Description} /></span>}
                                </div>
                            </FormGroup>
                        }
                        {((menuDetail["0819975E-4EDB-832D-3CBB-CA57CC3F69C2"] && menuDetail["0819975E-4EDB-832D-3CBB-CA57CC3F69C2"].Visibility === "E925F86B"))//0819975E-4EDB-832D-3CBB-CA57CC3F69C2---edit
                            &&
                            <FormGroup className="row">
                                <Label for="DomainID" className="control-label col"><IntlMessages id="sidebar.domainName" /><span className="text-danger">*</span></Label>
                                <div className="col-md-10 col-sm-9 col-xs-12">
                                    <Input
                                    disabled={(menuDetail["0819975E-4EDB-832D-3CBB-CA57CC3F69C2"].AccessRight === "11E6E7B0") ? true : false}
                                    type="select" className="col-md-4 col-12" name="DomainID" value={DomainID} id="DomainID" onChange={(e) => this.onChange(e)}>
                                        <IntlMessages id="sidebar.selDomainName">{(selDomainName) => <option value="">{selDomainName}</option>}</IntlMessages>
                                        <IntlMessages id="sidebar.domainName1">{(backoffice) => <option value={1}>{backoffice}</option>}</IntlMessages>
                                        <IntlMessages id="sidebar.domainName2">{(front) => <option value={2}>{front}</option>}</IntlMessages>
                                    </Input>
                                    {errors.DomainID && <span className="text-danger text-left"><IntlMessages id={errors.DomainID} /></span>}
                                </div>
                            </FormGroup>
                        }
                        {/* {((menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"] && menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].Visibility === "E925F86B"))//0819975E-4EDB-832D-3CBB-CA57CC3F69C2---edit
                            &&
                            // isEdit &&
                            <FormGroup className="row">
                                <Label for="RoleId" className="control-label col"><IntlMessages id="sidebar.assignRole" />{isEdit && <span className="text-danger">*</span>}</Label>
                                <div className="col-md-10 col-sm-9 col-xs-12">
                                    <Input
                                    disabled={(menuDetail["617D7124-235A-0A51-766E-00D7C7F738E5"].AccessRight === "11E6E7B0") ? true : false}
                                    type="select" className="w-25" name="RoleId" value={RoleId} id="RoleId" onChange={(e) => this.onChange(e)}>
                                        <IntlMessages id="sidebar.selRoleId">{(selModuleName) => <option value="">{selModuleName}</option>}</IntlMessages>
                                        {roleList.map((rList, Index) => (
                                            <option key={Index} value={rList.RoleID}>{rList.RoleName}</option>
                                        ))}
                                    </Input>
                                    {errors.RoleId && <span className="text-danger text-left"><IntlMessages id={errors.RoleId} /></span>}
                                </div>
                            </FormGroup>
                        } */}
                         {((menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"] && menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].Visibility === "E925F86B"))//0819975E-4EDB-832D-3CBB-CA57CC3F69C2---edit
                            &&
                            isEdit &&
                            <FormGroup className="row">
                                <Label for="Status" className="control-label col"><IntlMessages id="sidebar.status" />{isEdit && <span className="text-danger">*</span>}</Label>
                                <div className="col-md-10 col-sm-9 col-xs-12">
                                    <Input
                                    disabled={(menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].AccessRight === "11E6E7B0") ? true : false}
                                    type="select" className="col-md-4 col-12" name="Status" value={Status} id="Status" onChange={(e) => this.onChange(e)}>
                                        <IntlMessages id="sidebar.selStatus">{(selStatus) => <option value="">{selStatus}</option>}</IntlMessages>
                                        <IntlMessages id="sidebar.active">{(stsActive) => <option value={1}>{stsActive}</option>}</IntlMessages>
                                        <IntlMessages id="sidebar.inactive">{(stsInactive) => <option value={0}>{stsInactive}</option>}</IntlMessages>
                                        <IntlMessages id="sidebar.delete">{(stsDelete) => <option value={9}>{stsDelete}</option>}</IntlMessages>
                                    </Input>
                                    {errors.Status && <span className="text-danger text-left"><IntlMessages id={errors.Status} /></span>}
                                </div>
                            </FormGroup>
                        }

                        {/* {(isEdit ? (menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"] && menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].Visibility === "E925F86B")//2B33D98F-2906-321A-A495-9CDC53D6122F
                            : (menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"] && menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].Visibility === "E925F86B"))//604B8B4B-A1DB-6631-7058-5D6D59D58C11
                            &&
                            typeof cnfgMdlData.Modules !== 'undefined' && cnfgMdlData.Modules.length > 0 &&
                            <Fragment>
                                <h2><IntlMessages id="sidebar.configurePermission" /></h2>
                                {cnfgMdlData.Modules.map((mdlList, mIndex) => (
                                    <ExpansionPanel key={mIndex} className="epd_panel m-0" square expanded={expanded === 'pgMdl' + mdlList.ModuleID} onChange={this.expandPanelChange('pgMdl' + mdlList.ModuleID)}>
                                        <ExpansionPanelSummary className="epd_tlt" expandIcon={<i className="zmdi zmdi-chevron-down"></i>}>
                                            {mdlList.ModuleName}
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails className="epd_detail">
                                            <table className="table">
                                                <colgroup>
                                                    <col width="40%" />
                                                    <col width="10%" />
                                                    <col width="10%" />
                                                    <col width="10%" />
                                                    <col width="10%" />
                                                    <col width="20%" />
                                                </colgroup>
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th scope="col"><IntlMessages id="sidebar.modules" /></th>
                                                        {(isEdit ? (menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"] && menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].Visibility === "E925F86B")//764E56BC-0795-2803-12AC-507165780EB3
                                                            : (menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"] && menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].Visibility === "E925F86B"))//BE569387-60D7-5CCB-8371-9518C7B967A6
                                                            &&
                                                            <th scope="col" className="text-center"><Checkbox color="primary" name="View" checked={false} onChange={(e) => this.moduleChangeData('AllSubModule', e.target.checked, e.target.name, mIndex)} /><IntlMessages id="sidebar.view" /></th>
                                                        }
                                                        {(isEdit ? (menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"] && menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].Visibility === "E925F86B")//CD0AA00B-93B3-8E58-1429-6E7923C776CA
                                                            : (menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"] && menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].Visibility === "E925F86B"))//6238902B-A25C-2C5D-5FA1-FF05088F9EFA
                                                            &&
                                                            <th scope="col" className="text-center"><Checkbox color="primary" name="Create" checked={false} onChange={(e) => this.moduleChangeData('AllSubModule', e.target.checked, e.target.name, mIndex)} /><IntlMessages id="sidebar.create" /></th>
                                                        }
                                                        {(isEdit ? (menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"] && menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].Visibility === "E925F86B")//5F200D00-8FFC-58C0-11D9-028F766113AD
                                                            : (menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"] && menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].Visibility === "E925F86B"))//6B48A6DF-08F9-24BF-92A0-400F92F77C11
                                                            &&
                                                            <th scope="col" className="text-center"><Checkbox color="primary" name="Edit" checked={false} onChange={(e) => this.moduleChangeData('AllSubModule', e.target.checked, e.target.name, mIndex)} /><IntlMessages id="sidebar.edit" /></th>
                                                        }
                                                        {(isEdit ? (menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"] && menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].Visibility === "E925F86B")//761C9652-3F11-3776-19B2-0E73BCCB48F1
                                                            : (menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"] && menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].Visibility === "E925F86B"))//F0847710-3021-1DBB-2363-30E798747D6B
                                                            &&
                                                            <th scope="col" className="text-center"><Checkbox color="primary" name="Delete" checked={false} onChange={(e) => this.moduleChangeData('AllSubModule', e.target.checked, e.target.name, mIndex)} /><IntlMessages id="sidebar.delete" /></th>
                                                        }
                                                        <th scope="col"><IntlMessages id="sidebar.fieldPrivileges" /></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {mdlList.SubModules.length > 0
                                                        ?
                                                        <Fragment>
                                                            {mdlList.SubModules.map((smdlList, smIndex) => (
                                                                <tr>
                                                                    <td>{smdlList.SubModuleName}</td>
                                                                    {(isEdit ? (menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"] && menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].Visibility === "E925F86B")//764E56BC-0795-2803-12AC-507165780EB3
                                                                        : (menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"] && menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].Visibility === "E925F86B"))//BE569387-60D7-5CCB-8371-9518C7B967A6
                                                                        &&
                                                                        <td className="text-center"><Checkbox color="primary" name="View" checked={smdlList.View} onChange={(e) => this.moduleChangeData('subModule', e.target.checked, e.target.name, mIndex, smIndex)} /></td>
                                                                    }
                                                                    {(isEdit ? (menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"] && menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].Visibility === "E925F86B")//CD0AA00B-93B3-8E58-1429-6E7923C776CA
                                                                        : (menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"] && menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].Visibility === "E925F86B"))//6238902B-A25C-2C5D-5FA1-FF05088F9EFA
                                                                        &&
                                                                        <td className="text-center"><Checkbox color="primary" name="Create" checked={smdlList.Create} onChange={(e) => this.moduleChangeData('subModule', e.target.checked, e.target.name, mIndex, smIndex)} /></td>
                                                                    }
                                                                    {(isEdit ? (menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"] && menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].Visibility === "E925F86B")//5F200D00-8FFC-58C0-11D9-028F766113AD
                                                                        : (menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"] && menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].Visibility === "E925F86B"))//6B48A6DF-08F9-24BF-92A0-400F92F77C11
                                                                        &&
                                                                        <td className="text-center"><Checkbox color="primary" name="Edit" checked={smdlList.Edit} onChange={(e) => this.moduleChangeData('subModule', e.target.checked, e.target.name, mIndex, smIndex)} /></td>
                                                                    }
                                                                    {(isEdit ? (menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"] && menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].Visibility === "E925F86B")//761C9652-3F11-3776-19B2-0E73BCCB48F1
                                                                        : (menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"] && menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].Visibility === "E925F86B"))//F0847710-3021-1DBB-2363-30E798747D6B
                                                                        &&
                                                                        <td className="text-center"><Checkbox color="primary" name="Delete" checked={smdlList.Delete} onChange={(e) => this.moduleChangeData('subModule', e.target.checked, e.target.name, mIndex, smIndex)} /></td>
                                                                    }
                                                                    <td>
                                                                        <span onClick={() => this.openModel(mdlList.ModuleName, smdlList, mIndex, smIndex)} className="text-dark mr-5 cursor_pointer"><i className="zmdi zmdi-settings zmdi-hc-2x"></i></span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </Fragment>
                                                        :
                                                        <tr><td colSpan="6" className="text-center"><IntlMessages id="sidebar.noRecordFound" /></td></tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                ))}
                            </Fragment>
                        } */}
                        {menuDetail &&
                            <FormGroup row>
                                <div className="offset-md-2 col-md-10 offset-sm-3 col-sm-9 col-xs-12">
                                    <div className="btn_area">
                                        <Button disabled={this.props.loading} variant="raised" color="primary" onClick={isEdit ? (e) => this.onEditRolePerimssionGroup(e) : (e) => this.onAddRolePerimssionGroup(e)}><IntlMessages id={isEdit ? "sidebar.btnEdit" : "sidebar.btnAdd"} /></Button>
                                        <Button disabled={this.props.loading} variant="raised" color="danger" className="ml-15" onClick={() => this.resetData()}><IntlMessages id="sidebar.btnCancel" /></Button>
                                    </div>
                                </div>
                            </FormGroup>
                        }
                    </Form>
                    <Modal isOpen={isModelShow} className="modal-dialog-centered big_mdl_80" toggle={() => this.closeModel()}>
                        <ModalHeader>
                            {curMdlData.ModuleName + " -> " + curMdlData.SubModuleName}
                            <a title="Close" className="cls_lnk" onClick={() => this.closeModel()}><i className="zmdi zmdi-close zmdi-hc-2x" /></a>
                        </ModalHeader>
                        <ModalBody>
                            <div className="field_area">
                                <h2 className="ptltwtbrd"><IntlMessages id="sidebar.fieldsList" /></h2>
                                {
                                    curMdlData.hasOwnProperty('SubMdlData') && curMdlData.SubMdlData.Fields.length > 0
                                        ?
                                        <Fragment>
                                            <div className="stsLbl">
                                                <span className="lspn"><IntlMessages id="sidebar.readOnly" /></span>
                                                <span className="lspn"><IntlMessages id="sidebar.write" /></span>
                                                <span className="lspn"><IntlMessages id="sidebar.invisible" /></span>
                                            </div>
                                            <ul className="list_style_none lst_field clearfix">
                                                {curMdlData.SubMdlData.Fields.map((fldList, fIndex) => {
                                                    var fdlStatus = fldList.Status === 9 ? 2 : fldList.Status;
                                                    return (
                                                        <li className={fldList.IsVisibility ? "clearfix" : "clearfix lst_opcty"}>
                                                            <div className="rng_sld slider">
                                                                {
                                                                    fldList.IsVisibility
                                                                        ? <Slider min={0} max={2} tooltip={false} value={fdlStatus} onChange={(e) => this.moduleChangeData('Fields', e, 'Status', curMdlData.ModuleIndex, curMdlData.SubModuleIndex, fIndex)} />
                                                                        : <Slider min={0} max={2} tooltip={false} value={fdlStatus} />
                                                                }
                                                            </div> <span>{fldList.FieldName}</span>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </Fragment>
                                        :
                                        <ul className="list_style_none"><li><IntlMessages id="sidebar.noDataFound" /></li></ul>
                                }
                                <Divider className="my-15" />
                                <h2 className="ptltwtbrd"><IntlMessages id="sidebar.toolList" /></h2>
                                <ul className="list_style_none lst_tool clearfix">
                                    {
                                        curMdlData.hasOwnProperty('SubMdlData') && curMdlData.SubMdlData.Tools.length > 0
                                            ?
                                            curMdlData.SubMdlData.Tools.map((tolList, tolIndex) => {
                                                return (
                                                    <li className="clearfix">
                                                        <Checkbox color="primary" checked={tolList.Status} value="1" onChange={(e) => this.moduleChangeData('Tools', e.target.checked, 'Status', curMdlData.ModuleIndex, curMdlData.SubModuleIndex, '', tolIndex)} /> {tolList.ToolName}
                                                    </li>
                                                )
                                            })
                                            :
                                            <li><IntlMessages id="sidebar.noDataFound" /></li>
                                    }
                                </ul>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                        </ModalFooter>
                    </Modal>
                </div>
            </Fragment>
        );
    }
}

//Default Props...
AddEditPermissionGroup.defaultProps = {
    GroupID: 0,
    RoleId: 0,
    pagedata: {
        isEdit: false,
        prmData : {}
    }
}

//MapStateToProps...
const MapStateToProps = ({ rolePermissionGroupRdcer, roleManagementRdcer, drawerclose,authTokenRdcer }) => {
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }

    var response = {
        loading : rolePermissionGroupRdcer.loading || roleManagementRdcer.listLoading ? true : false,
        data : rolePermissionGroupRdcer.data,
        getData : rolePermissionGroupRdcer.getData,
        configData : rolePermissionGroupRdcer.configData,
        list : roleManagementRdcer.list,
        drawerclose: drawerclose,
        menuLoading:authTokenRdcer.menuLoading,
        menu_rights:authTokenRdcer.menu_rights,
    }

    return response;
    // const { data, getData, configData, loading } = rolePermissionGroupRdcer;
    // const { list, listLoading } = roleManagementRdcer;
    // return { data, getData, configData, loading, list, listLoading, drawerclose };
}

export default connect(MapStateToProps, {
    addRolePermissionGroup,
    getRolePermissionGroupList,
    editRolePermissionGroup,
    getConfigurationRolePermissionGroup,
    getRoleManagementList,
    getMenuPermissionByID
})(AddEditPermissionGroup);