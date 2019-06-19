/* 
    Developer : Salim Deraiya
    Date : 20-02-2019
    File Comment : MyAccount Add/Edit Rule Tool Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { addRuleTool, editRuleTool, getRuleToolList, getRuleSubModuleList } from "Actions/MyAccount";
import { getActiveInactiveStatus } from 'Helpers/helpers';
import validateRuleTool from 'Validations/MyAccount/rule_tool';
import AppConfig from 'Constants/AppConfig';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//Component for MyAccount Add/Edit Rule Tool
class AddEditRuleTool extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: {
                SubModuleID: this.props.SubModuleID,
                ToolID: this.props.ToolID,
                ToolName: '',
                Status: ''
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
        newObj['ToolName'] = '';
        newObj['Status'] = '';
        this.setState({ data: newObj, isAddData: false, errors: "",menudetail:this.state.menudetail });
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
        this.props.getMenuPermissionByID(this.props.pagedata.isEdit ? 'AA8CE8F3-9CEA-7C66-2BF0-DF9E37F03F7F' : '69E15401-9685-3138-427F-6F14249A8432');
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
      
        //Get Module List...
        if (nextProps.subModuleList.hasOwnProperty('Result') && nextProps.subModuleList.Result.length > 0) {
            this.setState({ subMdlList: nextProps.subModuleList.Result });
        }

        //Get Tool Data By Id
        if (nextProps.getData.hasOwnProperty('Result') && Object.keys(nextProps.getData.Result).length > 0 && this.props.pagedata.isEdit) {
            this.setState({ data: nextProps.getData.Result });
        }

        if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) {
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.data.ReturnCode === 0 && this.state.isAddData) {
            this.setState({ isAddData: false });
            this.props.getRuleToolList(this.state.pageData);
            var sucMsg = nextProps.data.ErrorCode === 0 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
            this.resetData();
        }
    }

    //Add Tool method...
    onAddSubModule(event) {
        event.preventDefault();
        const { errors, isValid } = validateRuleTool(this.state.data);
        this.setState({ errors: errors });

        if (isValid) {
            this.setState({ isAddData: true });
            this.props.addRuleTool(this.state.data);
        }
    }

    //Edit Tool method...
    onEditSubModule(event) {
        event.preventDefault();
        const { errors, isValid } = validateRuleTool(this.state.data);
        this.setState({ errors: errors });

        if (isValid) {
            this.setState({ isAddData: true });
            this.props.editRuleTool(this.state.data);
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
        const { SubModuleID, ToolName, Status } = this.state.data;
        const statusList = getActiveInactiveStatus();
        var menuDetail = this.checkAndGetMenuAccessDetail(isEdit ? '38CD9CEE-4EAB-4F59-8DD9-A71CFACA168F' : '34292290-3305-A4A8-12DA-8735DB7655E7');
        return (
            <Fragment>
                {(this.props.menuLoading || this.props.loading) && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id={isEdit ? "sidebar.editRuleTool" : "sidebar.addRuleTool"} />} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="jbs-page-content col-md-12 mx-auto">
                        <Form className="tradefrm">
                            {(isEdit ? (menuDetail["AA53CD14-38AD-50DB-798F-6FCA50834880"] && menuDetail["AA53CD14-38AD-50DB-798F-6FCA50834880"].Visibility === "E925F86B")//AA53CD14-38AD-50DB-798F-6FCA50834880
                                : (menuDetail["2CDD8033-3A2E-13D8-90B3-C5A26CD0552F"] && menuDetail["2CDD8033-3A2E-13D8-90B3-C5A26CD0552F"].Visibility === "E925F86B"))//2CDD8033-3A2E-13D8-90B3-C5A26CD0552F
                                &&
                                <FormGroup className="row">
                                    <Label for="SubModuleID" className="control-label col"><IntlMessages id="my_account.subModuleName" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input
                                        disabled={((isEdit ? (menuDetail["AA53CD14-38AD-50DB-798F-6FCA50834880"] && menuDetail["AA53CD14-38AD-50DB-798F-6FCA50834880"].AccessRight === "11E6E7B0")
                                : (menuDetail["2CDD8033-3A2E-13D8-90B3-C5A26CD0552F"] && menuDetail["2CDD8033-3A2E-13D8-90B3-C5A26CD0552F"].AccessRight === "11E6E7B0"))) ? true : false}
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
                            {(isEdit ? (menuDetail["FB893DEC-2849-1317-995D-791BCA332B32"] && menuDetail["FB893DEC-2849-1317-995D-791BCA332B32"].Visibility === "E925F86B")//FB893DEC-2849-1317-995D-791BCA332B32
                                : (menuDetail["F45BE5DD-6B0B-773F-2DA2-28E615166320"] && menuDetail["F45BE5DD-6B0B-773F-2DA2-28E615166320"].Visibility === "E925F86B"))//F45BE5DD-6B0B-773F-2DA2-28E615166320
                                &&
                                <FormGroup className="row">
                                    <Label for="ToolName" className="control-label col" ><IntlMessages id="my_account.toolName" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <IntlMessages id="my_account.enterToolName">
                                            {(placeholder) =>
                                                <Input
                                                disabled={((isEdit ? (menuDetail["FB893DEC-2849-1317-995D-791BCA332B32"] && menuDetail["FB893DEC-2849-1317-995D-791BCA332B32"].AccessRight === "11E6E7B0")
                                : (menuDetail["F45BE5DD-6B0B-773F-2DA2-28E615166320"] && menuDetail["F45BE5DD-6B0B-773F-2DA2-28E615166320"].AccessRight === "11E6E7B0"))) ? true : false}
                                                type="text" name="ToolName" value={ToolName} placeholder={placeholder} id="ToolName" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.ToolName && <span className="text-danger text-left"><IntlMessages id={errors.ToolName} /></span>}
                                    </div>
                                </FormGroup>
                            }
                            {(isEdit ? (menuDetail["D7483EBE-8554-4E62-A30C-2F8C87C90B2A"] && menuDetail["D7483EBE-8554-4E62-A30C-2F8C87C90B2A"].Visibility === "E925F86B")//D7483EBE-8554-4E62-A30C-2F8C87C90B2A
                                : (menuDetail["D7483EBE-8554-4E62-A30C-2F8C87C90B2A"] && menuDetail["D7483EBE-8554-4E62-A30C-2F8C87C90B2A"].Visibility === "E925F86B"))//58E0897C-9140-5B4B-142D-D315312C0DDC
                                &&
                                <FormGroup className="row">
                                    <Label for="Status" className="control-label col"><IntlMessages id="my_account.status" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input
                                        disabled={((isEdit ? (menuDetail["D7483EBE-8554-4E62-A30C-2F8C87C90B2A"] && menuDetail["D7483EBE-8554-4E62-A30C-2F8C87C90B2A"].AccessRight === "11E6E7B0")
                                : (menuDetail["D7483EBE-8554-4E62-A30C-2F8C87C90B2A"] && menuDetail["D7483EBE-8554-4E62-A30C-2F8C87C90B2A"].AccessRight === "11E6E7B0"))) ? true : false}
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
                                    <div className="offset-md-4 col-md-8 col-sm-9 col-xs-12 offset-sm-3 col-sm-9 col-xs-12">
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
AddEditRuleTool.defaultProps = {
    SubModuleID: '',
    ToolID: '0',
    pagedata: {
        isEdit: false
    }
}

const mapToProps = ({ ruleSubModuleRdcer, ruleToolRdcer,authTokenRdcer }) => {
    const response = {
        subModuleList: ruleSubModuleRdcer.list,
        data: ruleToolRdcer.data,
        getData: ruleToolRdcer.getData,
        loading: ruleToolRdcer.loading,
        menuLoading:authTokenRdcer.menuLoading,
        menu_rights:authTokenRdcer.menu_rights,
    }

    return response;
}

export default connect(mapToProps, {
    addRuleTool,
    editRuleTool,
    getRuleToolList,
    getRuleSubModuleList,
    getMenuPermissionByID
})(AddEditRuleTool);