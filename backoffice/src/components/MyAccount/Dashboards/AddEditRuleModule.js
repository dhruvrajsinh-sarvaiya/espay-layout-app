/* 
    Developer : Salim Deraiya
    Date : 20-02-2019
    Updated by:Saloni Rathod (11/03/2019)
    File Comment : MyAccount Add/Edit Rule Module Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import "rc-drawer/assets/index.css";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { addRuleModule, editRuleModule, getRuleModuleList, getRuleModuleListForParentId } from "Actions/MyAccount"; //Added by Saloni Rathod
import { getActiveInactiveStatus } from 'Helpers/helpers';
import validateRuleModule from 'Validations/MyAccount/rule_module';
import AppConfig from 'Constants/AppConfig';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//Component for MyAccount Add/Edit Rule Module Dashboard
class AddEditRuleModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: {
                ParentID: this.props.ParentID,
                ModuleID: this.props.ModuleID,
                ModuleName: '',
                Status: ''
            },
            pageData: {
                PageNo: 0,
                PageSize: AppConfig.totalRecordDisplayInList
            },
            parentList: [],
            isAddData: false,
            errors: "",
            // fieldList: {},
            menudetail: [],
            notification: true,
        };
        this.initState = this.state.data;
    }

    resetData() {
        this.setState({ data: this.initState });
        this.props.drawerClose();
        // this.setState({ fieldList: menuDetail })
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

    onChange(event) {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    //Added by Saloni Rathod
    //Component Will Mount
    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.pagedata.isEdit ? '7008D739-51ED-0B8C-540A-98E2C9A063AE' : 'DE581212-5B90-1C64-4992-449FA6422CB7');
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });
        // added by vishva
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getRuleModuleListForParentId(this.state.pageData);
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notification: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        //Get Parent Rule Module List
        if (nextProps.plist.hasOwnProperty('Result') && Object.keys(nextProps.plist.Result).length > 0) {
            this.setState({ parentList: nextProps.plist.Result });
        }

        //Get Module Data By Id
        if (nextProps.getData.hasOwnProperty('Result') && Object.keys(nextProps.getData.Result).length > 0 && this.props.pagedata.isEdit) {
            this.setState({ data: nextProps.getData.Result });
        } else {
            if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) {
                var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
                NotificationManager.error(errMsg);
            } else if (nextProps.data.ReturnCode === 0 && this.state.isAddData) {
                this.setState({ isAddData: false });
                this.props.getRuleModuleList(this.state.pageData);
                var sucMsg = nextProps.data.ErrorCode === 0 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
                NotificationManager.success(sucMsg);
                this.resetData();
            }
        }
    }

    //Add Module method...
    onAddModule(event) {
        event.preventDefault();
        const { errors, isValid } = validateRuleModule(this.state.data);
        this.setState({ errors: errors });

        if (isValid) {
            this.setState({ isAddData: true });
            this.props.addRuleModule(this.state.data);
        }
    }

    //Edit Module method...
    onEditModule(event) {
        event.preventDefault();
        const { errors, isValid } = validateRuleModule(this.state.data);
        this.setState({ errors: errors });

        if (isValid) {
            this.setState({ isAddData: true });
            this.props.editRuleModule(this.state.data);
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
        const { errors, parentList } = this.state;
        const { ModuleID, ModuleName, Status, ParentID } = this.state.data;
        const statusList = getActiveInactiveStatus();
        var menuDetail = this.checkAndGetMenuAccessDetail(isEdit ? '016E2F77-1BC9-3F27-618D-161B5F73A106' : '221416A5-6937-61F2-415B-64C83B560B3A');
        return (
            <Fragment>
                {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id={isEdit ? "sidebar.editRuleModule" : "sidebar.addRuleModule"} />} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="jbs-page-content col-md-12 mx-auto">
                        <Form className="tradefrm">
                            {/* field permission added by vishva */}
                            {/* Added by Saloni Rathod */}
                            {(isEdit ? (menuDetail["0F4A71E2-2350-0320-9052-D9B897C34E50"] && menuDetail["0F4A71E2-2350-0320-9052-D9B897C34E50"].Visibility === "E925F86B")//0F4A71E2-2350-0320-9052-D9B897C34E50
                                : (menuDetail["6DF7CFC1-6A85-9EFF-5E58-C87C74713440"] && menuDetail["6DF7CFC1-6A85-9EFF-5E58-C87C74713440"].Visibility === "E925F86B"))//6DF7CFC1-6A85-9EFF-5E58-C87C74713440
                                &&
                                <FormGroup className="row">
                                    <Label for="ParentID" className="control-label col"><IntlMessages id="sidebar.parentId" /></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input
                                            disabled={((isEdit ? (menuDetail["0F4A71E2-2350-0320-9052-D9B897C34E50"] && menuDetail["0F4A71E2-2350-0320-9052-D9B897C34E50"].AccessRight === "11E6E7B0")
                                                : (menuDetail["6DF7CFC1-6A85-9EFF-5E58-C87C74713440"] && menuDetail["6DF7CFC1-6A85-9EFF-5E58-C87C74713440"].AccessRight === "11E6E7B0"))) ? true : false}
                                            type="select" name="ParentID" value={ParentID} id="ParentID" onChange={e => this.onChange(e)}>
                                            <IntlMessages id="sidebar.selParentId">{selStatus => <option value="0">{selStatus}</option>}</IntlMessages>
                                            {parentList.map((sList, index) =>
                                                ModuleID !== sList.ModuleID && (<option key={index} value={sList.ModuleID}>{sList.ModuleName}</option>)
                                            )}
                                        </Input>
                                    </div>
                                </FormGroup>
                            }
                            {/* End by Saloni Rathod */}
                            {(isEdit ? (menuDetail["D8FB78E8-911A-6B42-1190-06C324A01FF4"] && menuDetail["D8FB78E8-911A-6B42-1190-06C324A01FF4"].Visibility === "E925F86B")//D8FB78E8-911A-6B42-1190-06C324A01FF4
                                : (menuDetail["A2BB0311-30FB-2724-2766-ECD9F958888F"] && menuDetail["A2BB0311-30FB-2724-2766-ECD9F958888F"].Visibility === "E925F86B"))//A2BB0311-30FB-2724-2766-ECD9F958888F
                                &&
                                <FormGroup className="row">
                                    <Label for="ModuleName" className="control-label col" ><IntlMessages id="my_account.moduleName" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <IntlMessages id="my_account.enterModuleName">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={((isEdit ? (menuDetail["D8FB78E8-911A-6B42-1190-06C324A01FF4"] && menuDetail["D8FB78E8-911A-6B42-1190-06C324A01FF4"].AccessRight === "11E6E7B0")
                                                        : (menuDetail["A2BB0311-30FB-2724-2766-ECD9F958888F"] && menuDetail["A2BB0311-30FB-2724-2766-ECD9F958888F"].AccessRight === "11E6E7B0"))) ? true : false}
                                                    type="text" name="ModuleName" value={ModuleName} placeholder={placeholder} id="ModuleName" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.ModuleName && <span className="text-danger text-left"><IntlMessages id={errors.ModuleName} /></span>}
                                    </div>
                                </FormGroup>
                            }
                            {(isEdit ? (menuDetail["1C8AA62E-8A7B-17DE-4DF1-7DC093C5040D"] && menuDetail["1C8AA62E-8A7B-17DE-4DF1-7DC093C5040D"].Visibility === "E925F86B")//1C8AA62E-8A7B-17DE-4DF1-7DC093C5040D
                                : (menuDetail["B3B7D3A2-826C-A7C0-923C-68756A8535DA"] && menuDetail["B3B7D3A2-826C-A7C0-923C-68756A8535DA"].Visibility === "E925F86B"))//B3B7D3A2-826C-A7C0-923C-68756A8535DA
                                &&
                                <FormGroup className="row">
                                    <Label for="Status" className="control-label col"><IntlMessages id="my_account.status" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input
                                            disabled={((isEdit ? (menuDetail["1C8AA62E-8A7B-17DE-4DF1-7DC093C5040D"] && menuDetail["1C8AA62E-8A7B-17DE-4DF1-7DC093C5040D"].AccessRight === "11E6E7B0")
                                                : (menuDetail["B3B7D3A2-826C-A7C0-923C-68756A8535DA"] && menuDetail["B3B7D3A2-826C-A7C0-923C-68756A8535DA"].AccessRight === "11E6E7B0"))) ? true : false}
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
                                            <Button disabled={this.props.loading} variant="raised" color="primary" onClick={isEdit ? (e) => this.onEditModule(e) : (e) => this.onAddModule(e)}><IntlMessages id={isEdit ? "sidebar.btnEdit" : "sidebar.btnAdd"} /></Button>
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
AddEditRuleModule.defaultProps = {
    ModuleID: "0",
    ParentID: "0",
    pagedata: {
        isEdit: false
    }
}

const mapToProps = ({ ruleModuleRdcer, authTokenRdcer }) => {
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { data, getData, plist, loading } = ruleModuleRdcer;
    return { data, getData, plist, loading, menuLoading, menu_rights };
}

export default connect(mapToProps, {
    addRuleModule,
    getRuleModuleList,
    editRuleModule,
    getRuleModuleListForParentId, //Added by Saloni Rathod,
    getMenuPermissionByID //added by vishva
})(AddEditRuleModule);