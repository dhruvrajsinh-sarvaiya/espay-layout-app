/* 
    Developer : Saloni Rathod
    Date : 25-02-2019
    File Comment : MyAccount Add/Edit Rule Field Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
import { addRuleField, editRuleField, getRuleFieldList, getRuleSubModuleList } from "Actions/MyAccount";
import { getRuleStatus, getRuleVisibility } from 'Helpers/helpers';
import validateRuleField from 'Validations/MyAccount/rule_field';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//Component for MyAccount Add/Edit Rule Sub Module Dashboard
class AddEditRuleField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: {
                FieldID: this.props.FieldID,
                SubModuleID: '',
                FieldName: '',
                Status: '',
                Visibility: '',
            },
            pageData: {
                PageNo: 0,
                PageSize: AppConfig.totalRecordDisplayInList
            },
            subMdlList: [],
            isAddData: false,
            errors: "",
            fieldList: {},
            menudetail: [],
            notification: true,
        };
    }

    resetData() {
        var newObj = Object.assign({}, this.state.data);
        newObj['SubModuleID'] = '';
        newObj['FieldID'] = '';
        newObj['FieldName'] = '';
        newObj['Status'] = '';
        newObj['Visibility'] = '';
        this.setState({ data: newObj, isAddData: false, errors: "", menudetail:this.state.menudetail});
        this.props.drawerClose();
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    };

    showComponent = componentName => {
        this.setState({
            componentName: componentName,
            open: !this.state.open
        });
    };

    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.pagedata.isEdit ? 'd68df4cd-0601-3283-5b5b-30b558871c17' : '99107D67-10DA-3A6E-2EA0-724B963798FC');

    }

    onChange(event) {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });
        // added by saloni
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                var rmObj = Object.assign({}, this.state.pageData);
                rmObj.AllRecords = 1; //Get All Record
                this.props.getRuleSubModuleList(rmObj);
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notification: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }

        //Get SubModule List...
        if (nextProps.subModuleList.hasOwnProperty('Result') && nextProps.subModuleList.Result.length > 0) {
            this.setState({ subMdlList: nextProps.subModuleList.Result });
        }

        //Get Field Data By Id
        if (nextProps.getData.hasOwnProperty('Result') && Object.keys(nextProps.getData.Result).length > 0 && this.props.pagedata.isEdit) {
            this.setState({ data: nextProps.getData.Result });
        }

        if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) {
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.data.ReturnCode === 0 && this.state.isAddData) {
            this.setState({ isAddData: false });
            var rmObj = Object.assign({}, this.state.pageData);
            rmObj.AllRecords = 1; //Get All Record
            this.props.getRuleFieldList(rmObj);
            var sucMsg = nextProps.data.ErrorCode === 0 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
            this.resetData();
        }
    }

    //Add Field method...
    onAddSubModule(event) {
        event.preventDefault();
        const { errors, isValid } = validateRuleField(this.state.data);
        this.setState({ errors: errors });
        if (isValid) {
            this.setState({ isAddData: true });
            this.props.addRuleField(this.state.data);
        }
    }

    //Edit Field method...
    onEditSubModule(event) {
        event.preventDefault();
        const { errors, isValid } = validateRuleField(this.state.data);
        this.setState({ errors: errors });

        if (isValid) {
            this.setState({ isAddData: true });
            this.props.editRuleField(this.state.data);
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
        const { errors, subMdlList } = this.state;
        const { FieldName, Status, SubModuleID, Visibility } = this.state.data;
        const getvisibility = getRuleVisibility();
        const statusList = getRuleStatus();
        var menuDetail = this.checkAndGetMenuAccessDetail(isEdit ? '4F141D95-8F37-2190-040D-43E7AF28691C' : '1E2F4F35-A091-4089-98F3-D4A3662A78A8');
        return (
            <Fragment>
                {(this.props.menuLoading || this.props.loading) && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id={isEdit ? "sidebar.editRuleField" : "sidebar.addRuleField"} />} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="jbs-page-content col-md-12 mx-auto">
                        <Form className="tradefrm">
                            {(isEdit ? (menuDetail["624F8B6D-5F4C-8CAB-675D-6FF202542586"] && menuDetail["624F8B6D-5F4C-8CAB-675D-6FF202542586"].Visibility === "E925F86B")//624F8B6D-5F4C-8CAB-675D-6FF202542586
                                : (menuDetail["7CF9BBD4-4780-4706-7E5B-C407BA072002"] && menuDetail["7CF9BBD4-4780-4706-7E5B-C407BA072002"].Visibility === "E925F86B"))//7CF9BBD4-4780-4706-7E5B-C407BA072002
                                &&
                                <FormGroup className="row">
                                    <Label for="SubModuleID" className="control-label col"><IntlMessages id="my_account.subModuleName" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input
                                        disabled={((isEdit ? (menuDetail["624F8B6D-5F4C-8CAB-675D-6FF202542586"] && menuDetail["624F8B6D-5F4C-8CAB-675D-6FF202542586"].AccessRight === "11E6E7B0")
                                : (menuDetail["7CF9BBD4-4780-4706-7E5B-C407BA072002"] && menuDetail["7CF9BBD4-4780-4706-7E5B-C407BA072002"].AccessRight === "11E6E7B0"))) ? true : false}
                                        type="select" name="SubModuleID" value={SubModuleID} id="SubModuleID" onChange={(e) => this.onChange(e)}>
                                            <IntlMessages id="sidebar.selSubModuleName">{(selSubModuleName) => <option value="">{selSubModuleName}</option>}</IntlMessages>
                                            {subMdlList.map((smList, index) => (
                                                <option key={index} value={smList.SubModuleID}>{smList.SubModuleName}</option>
                                            ))}
                                        </Input>
                                        {errors.SubModuleID && <span className="text-danger text-left"><IntlMessages id={errors.SubModuleID} /></span>}
                                    </div>
                                </FormGroup>
                            }
                            {(isEdit ? (menuDetail["99E1A8AF-6310-9F12-08F7-D990FB240021"] && menuDetail["99E1A8AF-6310-9F12-08F7-D990FB240021"].Visibility === "E925F86B")//99E1A8AF-6310-9F12-08F7-D990FB240021
                                : (menuDetail["9897A38F-3C13-9D6C-5C06-9BC48C8B4BAA"] && menuDetail["9897A38F-3C13-9D6C-5C06-9BC48C8B4BAA"].Visibility === "E925F86B"))//9897A38F-3C13-9D6C-5C06-9BC48C8B4BAA
                                &&
                                <FormGroup className="row">
                                    <Label for="FieldName" className="control-label col" ><IntlMessages id="sidebar.fieldName" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <IntlMessages id="sidebar.enterFieldName">
                                            {(placeholder) =>
                                                <Input
                                                disabled={((isEdit ? (menuDetail["99E1A8AF-6310-9F12-08F7-D990FB240021"] && menuDetail["99E1A8AF-6310-9F12-08F7-D990FB240021"].AccessRight === "11E6E7B0")
                                : (menuDetail["9897A38F-3C13-9D6C-5C06-9BC48C8B4BAA"] && menuDetail["9897A38F-3C13-9D6C-5C06-9BC48C8B4BAA"].AccessRight === "11E6E7B0"))) ? true : false}
                                                type="text" name="FieldName" value={FieldName} placeholder={placeholder} id="sidebar.enterFieldName" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.FieldName && <span className="text-danger text-left"><IntlMessages id={errors.FieldName} /></span>}
                                    </div>
                                </FormGroup>
                            }
                            {(isEdit ? (menuDetail["470A383B-7861-6CA0-8654-D3CB7DB600AB"] && menuDetail["470A383B-7861-6CA0-8654-D3CB7DB600AB"].Visibility === "E925F86B")//470A383B-7861-6CA0-8654-D3CB7DB600AB
                                : (menuDetail["BBEC4334-01F1-2FE2-335A-0BD5882A1F9A"] && menuDetail["BBEC4334-01F1-2FE2-335A-0BD5882A1F9A"].Visibility === "E925F86B"))//BBEC4334-01F1-2FE2-335A-0BD5882A1F9A
                                &&
                                <FormGroup className="row">
                                    <Label for="Status" className="control-label col"><IntlMessages id="my_account.status" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input
                                        disabled={((isEdit ? (menuDetail["470A383B-7861-6CA0-8654-D3CB7DB600AB"] && menuDetail["470A383B-7861-6CA0-8654-D3CB7DB600AB"].AccessRight === "11E6E7B0")
                                : (menuDetail["BBEC4334-01F1-2FE2-335A-0BD5882A1F9A"] && menuDetail["BBEC4334-01F1-2FE2-335A-0BD5882A1F9A"].AccessRight === "11E6E7B0"))) ? true : false}
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
                            {(isEdit ? (menuDetail["381533B8-3FE9-0881-9FBD-E3B553221674"] && menuDetail["381533B8-3FE9-0881-9FBD-E3B553221674"].Visibility === "E925F86B")//381533B8-3FE9-0881-9FBD-E3B553221674
                                : (menuDetail["8DC67926-235E-7D05-542A-0034E0D2A165"] && menuDetail["8DC67926-235E-7D05-542A-0034E0D2A165"].Visibility === "E925F86B"))//8DC67926-235E-7D05-542A-0034E0D2A165
                                &&
                                <FormGroup className="row">
                                    <Label for="Visibility" className="control-label col"><IntlMessages id="sidebar.visibility" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input
                                        disabled={((isEdit ? (menuDetail["381533B8-3FE9-0881-9FBD-E3B553221674"] && menuDetail["381533B8-3FE9-0881-9FBD-E3B553221674"].AccessRight === "11E6E7B0")
                                : (menuDetail["8DC67926-235E-7D05-542A-0034E0D2A165"] && menuDetail["8DC67926-235E-7D05-542A-0034E0D2A165"].AccessRight === "11E6E7B0"))) ? true : false}
                                        type="select" name="Visibility" value={Visibility} id="Visibility" onChange={(e) => this.onChange(e)}>
                                            <IntlMessages id="sidebar.selVisibility">{(selStatus) => <option value="">{selStatus}</option>}</IntlMessages>
                                            {getvisibility.map((sList, index) => (
                                                <IntlMessages key={index} id={sList.label}>{(placeholder) => <option value={sList.id}>{placeholder}</option>}</IntlMessages>
                                            ))}
                                        </Input>
                                        {errors.Visibility && <span className="text-danger text-left"><IntlMessages id={errors.Visibility} /></span>}
                                    </div>
                                </FormGroup>
                            }
                            {menuDetail &&
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
AddEditRuleField.defaultProps = {
    FieldID: '0',
    pagedata: {
        isEdit: false
    }
}

const mapToProps = ({ ruleFieldRdcer, ruleSubModuleRdcer,authTokenRdcer }) => {
    const response = {
        subModuleList: ruleSubModuleRdcer.list,
        data: ruleFieldRdcer.data,
        getData: ruleFieldRdcer.getData,
        loading: ruleFieldRdcer.loading,
        menuLoading:authTokenRdcer.menuLoading,
        menu_rights:authTokenRdcer.menu_rights,
    }
    return response;
}

export default connect(mapToProps, {
    addRuleField,
    getRuleFieldList,
    editRuleField,
    getRuleSubModuleList,
    getMenuPermissionByID
})(AddEditRuleField);