/* 
    Developer : Salim Deraiya
    Date : 20-02-2019
    Updated By : Saloni Rathod (11/03/2019)
    File Comment : MyAccount Add/Edit Rule Sub Module Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { addRuleSubModule, editRuleSubModule, getRuleSubModuleList, getRuleModuleList, getRuleSubModuleListForParentId } from "Actions/MyAccount"; //Added by Saloni Rathod
import { getActiveInactiveStatus } from 'Helpers/helpers';
import validateRuleSubModule from 'Validations/MyAccount/rule_sub_module';
import AppConfig from 'Constants/AppConfig';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//Component for MyAccount Add/Edit Rule Sub Module Dashboard
class AddEditRuleSubModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: {
                ParentID: this.props.ParentID,
                ModuleID: this.props.ModuleID,
                SubModuleID: this.props.SubModuleID,
                SubModuleName: '',
                Status: ''
            },
            pageData: {
                PageNo: 0,
                PageSize: AppConfig.totalRecordDisplayInList
            },
            mdlList: [],
            parentList: [], //Added by Saloni Rathod
            isAddData: false,
            errors: "",
            fieldList: {},
            menudetail: [],
            notification: true,
        };
    }

    resetData() {
        var newObj = Object.assign({}, this.state.data);
        newObj['ModuleID'] = '';
        newObj['SubModuleName'] = '';
        newObj['Status'] = '';
        this.setState({ data: newObj, isAddData: false, errors: "" });
        this.props.drawerClose();
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false
        });
    };

    showComponent = componentName => {
        this.setState({
            componentName: componentName,
            open: this.state.open ? false : true
        });
    };

    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.pagedata.isEdit ? 'A358B02C-45B8-A59B-6352-2E7DFCCBA73C' : 'D634E6A3-7213-A41D-22FF-D947CCEA2C52');
    }

    onChange(event) {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });
        // added by vishva
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                var rmObj = Object.assign({}, this.state.pageData);
                rmObj.AllRecords = 1; //Get All Record
                this.props.getRuleModuleList(rmObj);
                this.props.getRuleSubModuleListForParentId(this.state.pageData);
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notification: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        //Get Parent Sub Module List
        if (nextProps.plist.hasOwnProperty('Result') && nextProps.plist.Result.length > 0) {
            this.setState({ parentList: nextProps.plist.Result });
        }

        //Get Module List...
        if (nextProps.moduleList.hasOwnProperty('Result') && nextProps.moduleList.Result.length > 0) {
            this.setState({ mdlList: nextProps.moduleList.Result });
        }

        //Get Sub Module Data By Id
        if (nextProps.getData.hasOwnProperty('Result') && Object.keys(nextProps.getData.Result).length > 0 && this.props.pagedata.isEdit) {
            this.setState({ data: nextProps.getData.Result });
        }

        if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) {
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.data.ReturnCode === 0 && this.state.isAddData) {
            this.setState({ isAddData: false });
            this.props.getRuleSubModuleList(this.state.pageData);
            var sucMsg = nextProps.data.ErrorCode === 0 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
            this.resetData();
        }
    }

    //Add Sub Module method...
    onAddSubModule(event) {
        event.preventDefault();
        const { errors, isValid } = validateRuleSubModule(this.state.data);
        this.setState({ errors: errors });

        if (isValid) {
            this.setState({ isAddData: true });
            this.props.addRuleSubModule(this.state.data);
        }
    }

    //Edit Sub Module method...
    onEditSubModule(event) {
        event.preventDefault();
        const { errors, isValid } = validateRuleSubModule(this.state.data);
        this.setState({ errors: errors });

        if (isValid) {
            this.setState({ isAddData: true });
            this.props.editRuleSubModule(this.state.data);
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
        const { errors, mdlList, parentList } = this.state;
        const { SubModuleID, ModuleID, SubModuleName, Status, ParentID } = this.state.data;
        const statusList = getActiveInactiveStatus();
        var menuDetail = this.checkAndGetMenuAccessDetail(isEdit ? 'AE155FEC-24F9-68F6-2804-1BFF162C12DE' : 'F6BCADFE-630B-53A4-5A81-3ED7486C621C');
        return (
            <Fragment>
                {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id={isEdit ? "sidebar.editRuleSubModule" : "sidebar.addRuleSubModule"} />} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="jbs-page-content col-md-12 mx-auto">
                        {/* menu permission added by vishva */}
                        {/* Added By Saloni Rathod */}
                        <Form className="tradefrm">
                            {(isEdit ? (menuDetail["5EADD2C4-4588-1E90-A331-C2463A9B4D56"] && menuDetail["5EADD2C4-4588-1E90-A331-C2463A9B4D56"].Visibility === "E925F86B")//5EADD2C4-4588-1E90-A331-C2463A9B4D56
                                : (menuDetail["FCA9C6F2-0EA3-0E7C-8FC1-657F646C3120"] && menuDetail["FCA9C6F2-0EA3-0E7C-8FC1-657F646C3120"].Visibility === "E925F86B"))//FCA9C6F2-0EA3-0E7C-8FC1-657F646C3120
                                &&
                                <FormGroup className="row">
                                    <Label for="ParentID" className="control-label col"><IntlMessages id="sidebar.parentId" /></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input
                                            disabled={(isEdit ? (menuDetail["5EADD2C4-4588-1E90-A331-C2463A9B4D56"] && menuDetail["5EADD2C4-4588-1E90-A331-C2463A9B4D56"].AccessRight === "11E6E7B0")
                                                : (menuDetail["FCA9C6F2-0EA3-0E7C-8FC1-657F646C3120"] && menuDetail["FCA9C6F2-0EA3-0E7C-8FC1-657F646C3120"].AccessRight === "11E6E7B0")) ? true : false}
                                            type="select" name="ParentID" value={ParentID} id="ParentID" onChange={e => this.onChange(e)}>
                                            <IntlMessages id="sidebar.selParentId">{selStatus => <option value="0">{selStatus}</option>}</IntlMessages>
                                            {parentList.map((sList, index) =>
                                                SubModuleID !== sList.SubModuleID && (<option key={index} value={sList.SubModuleID}>{sList.SubModuleName}</option>)
                                            )}
                                        </Input>
                                        {errors.ParentID && <span className="text-danger text-left"><IntlMessages id={errors.ParentID} /></span>}
                                    </div>
                                </FormGroup>
                            }
                            {/* End By Saloni Rathod */}
                            {(isEdit ? (menuDetail["6EDC331B-5750-46B8-A68E-A79D84A80ACF"] && menuDetail["6EDC331B-5750-46B8-A68E-A79D84A80ACF"].Visibility === "E925F86B")//6EDC331B-5750-46B8-A68E-A79D84A80ACF
                                : (menuDetail["0ABCFA10-0174-3118-305A-893DAC184881"] && menuDetail["0ABCFA10-0174-3118-305A-893DAC184881"].Visibility === "E925F86B"))//0ABCFA10-0174-3118-305A-893DAC184881
                                &&
                                <FormGroup className="row">
                                    <Label for="ModuleID" className="control-label col"><IntlMessages id="my_account.moduleName" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input
                                            disabled={(isEdit ? (menuDetail["6EDC331B-5750-46B8-A68E-A79D84A80ACF"] && menuDetail["6EDC331B-5750-46B8-A68E-A79D84A80ACF"].AccessRight === "11E6E7B0")
                                                : (menuDetail["0ABCFA10-0174-3118-305A-893DAC184881"] && menuDetail["0ABCFA10-0174-3118-305A-893DAC184881"].AccessRight === "11E6E7B0")) ? true : false}
                                            type="select" name="ModuleID" value={ModuleID} id="ModuleID" onChange={(e) => this.onChange(e)}>
                                            <IntlMessages id="sidebar.selModuleName">{(selModuleName) => <option value="">{selModuleName}</option>}</IntlMessages>
                                            {mdlList.map((mList, index) => (
                                                <option key={index} value={mList.ModuleID}>{mList.ModuleName}</option>
                                            ))}
                                        </Input>
                                        {errors.ModuleID && <span className="text-danger text-left"><IntlMessages id={errors.ModuleID} /></span>}
                                    </div>
                                </FormGroup>
                            }
                            {(isEdit ? (menuDetail["8528DC60-7E8E-7602-7410-A72E664DA76F"] && menuDetail["8528DC60-7E8E-7602-7410-A72E664DA76F"].Visibility === "E925F86B")//8528DC60-7E8E-7602-7410-A72E664DA76F
                                : (menuDetail["32E13B16-5580-596F-A165-34EF66489610"] && menuDetail["32E13B16-5580-596F-A165-34EF66489610"].Visibility === "E925F86B"))//32E13B16-5580-596F-A165-34EF66489610
                                &&
                                <FormGroup className="row">
                                    <Label for="SubModuleName" className="control-label col" ><IntlMessages id="my_account.subModuleName" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <IntlMessages id="my_account.enterSubModuleName">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={(isEdit ? (menuDetail["8528DC60-7E8E-7602-7410-A72E664DA76F"] && menuDetail["8528DC60-7E8E-7602-7410-A72E664DA76F"].AccessRight === "11E6E7B0")
                                                        : (menuDetail["32E13B16-5580-596F-A165-34EF66489610"] && menuDetail["32E13B16-5580-596F-A165-34EF66489610"].AccessRight === "11E6E7B0")) ? true : false}
                                                    type="text" name="SubModuleName" value={SubModuleName} placeholder={placeholder} id="SubModuleName" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.SubModuleName && <span className="text-danger text-left"><IntlMessages id={errors.SubModuleName} /></span>}
                                    </div>
                                </FormGroup>
                            }
                            {(isEdit ? (menuDetail["6902F4CB-3986-12E9-5258-B4A176AB1B65"] && menuDetail["6902F4CB-3986-12E9-5258-B4A176AB1B65"].Visibility === "E925F86B")//6902F4CB-3986-12E9-5258-B4A176AB1B65
                                : (menuDetail["BD13F3EE-0AD5-6128-5B2A-2B16E7408D72"] && menuDetail["BD13F3EE-0AD5-6128-5B2A-2B16E7408D72"].Visibility === "E925F86B"))//BD13F3EE-0AD5-6128-5B2A-2B16E7408D72
                                &&
                                <FormGroup className="row">
                                    <Label for="Status" className="control-label col"><IntlMessages id="my_account.status" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input
                                            disabled={(isEdit ? (menuDetail["6902F4CB-3986-12E9-5258-B4A176AB1B65"] && menuDetail["6902F4CB-3986-12E9-5258-B4A176AB1B65"].AccessRight === "11E6E7B0")
                                                : (menuDetail["BD13F3EE-0AD5-6128-5B2A-2B16E7408D72"] && menuDetail["BD13F3EE-0AD5-6128-5B2A-2B16E7408D72"].AccessRight === "11E6E7B0")) ? true : false}
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
                            {Object.keys(menuDetail).length > 0 &&
                                <FormGroup row>
                                    <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                        <div className="btn_area">
                                            <Button disabled={this.props.loading} variant="raised" color="primary" onClick={isEdit ? (e) => this.onEditSubModule(e) : (e) => this.onAddSubModule(e)}><IntlMessages id={isEdit ? "sidebar.btnEdit" : "sidebar.btnAdd"} /></Button>
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
AddEditRuleSubModule.defaultProps = {
    ModuleID: '',
    SubModuleID: '0',
    ParentID: '0',
    pagedata: {
        isEdit: false
    }
}

const mapToProps = ({ ruleModuleRdcer, ruleSubModuleRdcer, authTokenRdcer }) => {
    const response = {
        moduleList: ruleModuleRdcer.list,
        data: ruleSubModuleRdcer.data,
        getData: ruleSubModuleRdcer.getData,
        loading: ruleSubModuleRdcer.loading,
        plist: ruleSubModuleRdcer.plist,
        menuLoading: authTokenRdcer.menuLoading,
        menu_rights: authTokenRdcer.menu_rights
    }
    return response;
}

export default connect(mapToProps, {
    addRuleSubModule,
    editRuleSubModule,
    getRuleSubModuleList,
    getRuleModuleList,
    getRuleSubModuleListForParentId, //Added by Saloni Rathod
    getMenuPermissionByID //added by vishva
})(AddEditRuleSubModule);