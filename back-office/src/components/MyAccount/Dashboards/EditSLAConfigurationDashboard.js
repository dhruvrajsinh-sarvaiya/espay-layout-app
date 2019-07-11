/* 
    Developer : Kevin Ladani
    Date : 24-11-2018
    File Comment : Add Priority Component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { FormGroup, Form, Input, Label, Button } from "reactstrap";
import { editSLAConfiguration, slaConfigurationList } from "Actions/MyAccount";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; //added by Bharat Jograna for Loader and NotificationManager
import { NotificationManager } from "react-notifications"; //added by Bharat Jograna for Loader and NotificationManager
import validateSLAForm from "Validations/MyAccount/sla_configuration";
import AppConfig from "../../../constants/AppConfig";
import { getMenuPermissionByID } from 'Actions/MyAccount';

class EditSLAConfigurationDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: {
                Id: "",
                Priority: "",
                PriorityTime: "",
                Timewith: "",
            },
            SLAdata: {
                PageIndex: 0,
                PAGE_SIZE: AppConfig.totalRecordDisplayInList,
            },
            loading: false,
            errors: "",
            handle_flag: true,
            flag: true,
            flagPageData: true,
            pageValue: 0,
            fieldList: {},
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
        };
        this.initState = this.state;
    }

    resetData = () => {
        let newObj = Object.assign({}, this.initState);
        newObj.menudetail = this.state.menudetail;
        newObj.handle_flag = this.state.handle_flag;
        this.setState(newObj);
        this.props.drawerClose();
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('9D15F612-8C2F-9943-3AB5-74EB80331CEA');
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false, flag: false });
    };

    handleChange = (event) => {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    OnEditPriority = (event) => {
        event.preventDefault();
        const { errors, isValid } = validateSLAForm(this.state.data);
        this.setState({ errors: errors });
        if (isValid) {
            var reqObj = Object.assign({}, this.state.data);
            reqObj.PriorityTime = reqObj.PriorityTime + " " + reqObj.Timewith;
            const { Id, Priority, PriorityTime } = reqObj;
            this.props.editSLAConfiguration({ Id, Priority, PriorityTime });
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });

        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        
        if ((nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) && this.state.handle_flag) {
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.error(errMsg); //added by Bharat Jograna for errMsg
            this.setState({ handle_flag: false })
        } else if (nextProps.data.ReturnCode === 0 && this.state.handle_flag) {
            NotificationManager.success(nextProps.data.ReturnMsg); //added by Bharat Jograna for success_msg
            this.setState({ handle_flag: false });
            this.props.drawerClose();
            setTimeout(() => this.props.slaConfigurationList(this.state.SLAdata), 2000);
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
        var menuDetail = this.checkAndGetMenuAccessDetail('E80DE216-0055-1C6F-1D80-815023B012DD');
        if (!menuDetail) {
            menuDetail = { Utility: [], CrudOption: [] }
        }
        const { drawerClose } = this.props;
        const { loading, errors } = this.state;
        const { Priority, PriorityTime, Timewith } = this.state.data;

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.editProiority" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.props.menuLoading || loading) && <JbsSectionLoader />}
                <div className="jbs-page-content col-md-12 mx-auto">
                    <Form className="tradefrm">
                        {(menuDetail["326678EA-4130-8E50-992B-CF38E97C637A"] && menuDetail["326678EA-4130-8E50-992B-CF38E97C637A"].Visibility === "E925F86B") &&
                            <FormGroup row className="mb-20">
                                <Label for="Priority" className="control-label col" ><IntlMessages id="my_account.priorityName" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-8 col-xs-12">
                                    <IntlMessages id="myaccount.enterPriority">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["326678EA-4130-8E50-992B-CF38E97C637A"].AccessRight === "11E6E7B0") ? true : false} type="text" name="Priority" value={Priority} placeholder={placeholder} id="Priority" onChange={this.handleChange} />
                                        }
                                    </IntlMessages>
                                    {errors.Priority && (<span className="text-danger"><IntlMessages id={errors.Priority} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["305B1B78-95D1-1903-61F8-BF5850BE2607"] && menuDetail["305B1B78-95D1-1903-61F8-BF5850BE2607"].Visibility === "E925F86B") &&
                            <FormGroup row className="mb-20">
                                <Label for="PriorityTime" className="control-label col"><IntlMessages id="my_account.priorityTime" /><span className="text-danger">*</span></Label>
                                <div className="col-md-4 col-sm-4 col-xs-4">
                                    <IntlMessages id="myaccount.enterTime">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["305B1B78-95D1-1903-61F8-BF5850BE2607"].AccessRight === "11E6E7B0") ? true : false} type="text" name="PriorityTime" value={PriorityTime} id="PriorityTime" placeholder={placeholder} onChange={this.handleChange} />
                                        }
                                    </IntlMessages>
                                    {errors.PriorityTime && (<span className="text-danger"><IntlMessages id={errors.PriorityTime} /></span>)}
                                </div>
                                <div className="col-md-4 col-sm-4 col-xs-4">
                                    <Input disabled={(menuDetail["305B1B78-95D1-1903-61F8-BF5850BE2607"].AccessRight === "11E6E7B0") ? true : false} type="select" name="Timewith" className="form-control" id="Timewith" value={Timewith} onChange={this.handleChange}>
                                        <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                        <IntlMessages id="sidebar.hours">{(selectOption) => <option value="Hours">{selectOption}</option>}</IntlMessages>
                                        <IntlMessages id="sidebar.minutes">{(selectOption) => <option value="Minutes">{selectOption}</option>}</IntlMessages>
                                        <IntlMessages id="sidebar.days">{(selectOption) => <option value="Days">{selectOption}</option>}</IntlMessages>
                                    </Input>
                                    {errors.Timewith && (<span className="text-danger text-left"><IntlMessages id={errors.Timewith} /></span>)}
                                </div>
                            </FormGroup>}
                        {Object.keys(menuDetail).length > 0 &&
                            <FormGroup row>
                                <div className="offset-md-4 col-md-8 offset-sm-4 col-sm-8 col-xs-12">
                                    <div className="btn_area">
                                        <Button variant="raised" color="primary" className="text-white" onClick={this.OnEditPriority}><IntlMessages id="sidebar.btnEdit" /></Button>
                                        <Button variant="raised" className="ml-15 btn-danger text-white" onClick={this.resetData}><IntlMessages id="button.cancel" /></Button>
                                    </div>
                                </div>
                            </FormGroup>
                        }
                    </Form>
                </div>
            </div>
        );
    }
}

const mapToProps = ({ slaRdcer, authTokenRdcer }) => {
    const { data, loading } = slaRdcer;
    const { menuLoading, menu_rights } = authTokenRdcer;
    return { data, loading, menuLoading, menu_rights };
}

export default connect(mapToProps, {
    editSLAConfiguration,
    slaConfigurationList,
    getMenuPermissionByID
})(EditSLAConfigurationDashboard);