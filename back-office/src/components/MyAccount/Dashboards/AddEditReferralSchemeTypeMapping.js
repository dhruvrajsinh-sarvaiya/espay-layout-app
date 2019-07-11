/* 
    Developer : Saloni Rathod
    Date : 25th May 2019
    Updated By :
    File Comment : MyAccount Add/Edit Referral Scheme type Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import Select from "react-select";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { addEditReferralSchemeTypeMapping } from "Actions/MyAccount";
import { getMenuPermissionByID } from 'Actions/MyAccount';
import validateReferraSchemeTypeMapping from 'Validations/MyAccount/referral_scheme_type_mapping';
import { getReferralServiceTypeData, getReferralPayTypeData, getReferralSchemeTypeMappingData } from 'Actions/MyAccount';
//Component for MyAccount Add/Edit Referral Service Detail
class AddEditReferralSchemeTypeMapping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            isEdit: false,
            data: {
                Id: '',
                PayTypeId: '',
                ServiceTypeMstId: '',
                MinimumDepositionRequired: '',
                Description: '',
                FromDate: '',
                ToDate: '',
                Status: ""
            },
            errors: "",
            ServicetypeData: [],
            PaytypeData: [],
            fieldList: {},
            stypeLabel: '',
            ptypeLabel: '',
            isAddData: false,
            notificationFlag: true,
            menudetail: [],
            notification: true,
        };
    }

    resetData() {
        var newObj = Object.assign({}, this.state.data);
        newObj['Id'] = '';
        newObj['PayTypeId'] = '';
        newObj['ServiceTypeMstId'] = '';
        newObj['MinimumDepositionRequired'] = '';
        newObj['Description'] = '';
        newObj['FromDate'] = '';
        newObj['ToDate'] = '';
        newObj['Status'] = '';
        this.setState({ isAddData: true });
        this.setState({ data: newObj, errors: "" });
        this.props.drawerClose();
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    };

    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.pagedata.isEdit ? 'A595279E-7D18-1D91-69DC-1499D7B46E36' : 'D35D60AA-419E-6003-3A90-D0F21849A1E1');

    }

    onChange(event) {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, isEdit: this.props.pagedata.isEdit });
        // added by saloni
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getReferralServiceTypeData();
                this.props.getReferralPayTypeData();
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notification: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        //Get Scheme type mapping Data By Id
        if (nextProps.getDataById.hasOwnProperty('Data') && Object.keys(nextProps.getDataById.Data).length > 0 && this.props.pagedata.isEdit) {
            this.setState({ data: nextProps.getDataById.Data, stypeLabel: nextProps.getDataById.Data.ServiceTypeName, ptypeLabel: nextProps.getDataById.Data.PayTypeName, });
        }

        if (nextProps.referralServiceTypeData.ReturnCode === 0) {
            this.setState({ ServicetypeData: nextProps.referralServiceTypeData.ReferralServiceTypeList })
        }
        if (nextProps.referralPayTypeData.ReturnCode === 0) {
            this.setState({ PaytypeData: nextProps.referralPayTypeData.ReferralPayTypeList })
        }
        if (this.state.notificationFlag && (nextProps.addEditData.ReturnCode === 1 || nextProps.addEditData.ReturnCode === 9)) {
            this.setState({ notificationFlag: false });
            var errMsg = nextProps.addEditData.ErrorCode === 1 ? nextProps.addEditData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.addEditData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (this.state.notificationFlag && nextProps.addEditData.ReturnCode === 0 && (this.state.isAddData || this.state.isEdit)) {
            this.setState({ notificationFlag: false });
            var sucMsg = nextProps.addEditData.ErrorCode === 0 ? nextProps.addEditData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.addEditData.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
            this.props.drawerClose();
            this.setState({ isAddData: false, isEdit: false });
            this.props.getReferralSchemeTypeMappingData();
            this.resetData();
        }
    }

    //Add Sub Module method...
    onAddSubModule(event) {
        const { errors, isValid } = validateReferraSchemeTypeMapping(this.state.data);
        this.setState({ errors: errors });
        if (isValid) {
            this.setState({ isAddData: true });
            this.props.addEditReferralSchemeTypeMapping(this.state.data);
        }
    }
    onChangeData = (event) => {
        var newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }
    //onchange Scheme  Type
    onChangeSelectServiceType = (event) => {
        event === null && (event = { label: null, value: "" });
        var newObj = Object.assign({}, this.state.data);
        newObj.ServiceTypeMstId = event.value;
        this.setState({ data: newObj, stypeLabel: event.label });

    }
    //onchange select paytype
    onChangeSelectUser = (event) => {
        event === null && (event = { label: null, value: "" });
        var newObj = Object.assign({}, this.state.data);
        newObj.PayTypeId = event.value;
        this.setState({ data: newObj, ptypeLabel: event.label });
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
        let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
        const { drawerClose } = this.props;
        const { isEdit } = this.props.pagedata;
        const { errors, ServicetypeData, PaytypeData } = this.state;
        const { MinimumDepositionRequired, Description, FromDate, ToDate, Status } = this.state.data;
        var menuDetail = this.checkAndGetMenuAccessDetail(isEdit ? '6FF461D2-5E50-5350-72A4-A07CD35A8442' : '4E12D806-537B-723F-39C4-61B999C64D41');
        return (
            <Fragment>
                {(this.props.menuLoading || this.props.loading || this.props.edit_loading) && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id={isEdit ? "sidebar.editAffiliateSchemeTypeMapping" : "sidebar.addAffiliateSchemeTypeMaping"} />} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="jbs-page-content col-md-12 mx-auto">
                        <Form className="tradefrm">
                            {(isEdit ? (menuDetail["D856141D-4960-94A2-0DDD-AAFBAF8314EF"] && menuDetail["D856141D-4960-94A2-0DDD-AAFBAF8314EF"].Visibility === "E925F86B")//D856141D-4960-94A2-0DDD-AAFBAF8314EF
                                : (menuDetail["0801A727-01FB-4426-5B4E-C8EC33963205"] && menuDetail["0801A727-01FB-4426-5B4E-C8EC33963205"].Visibility === "E925F86B"))//0801A727-01FB-4426-5B4E-C8EC33963205
                                &&
                                <FormGroup className="row">
                                    <Label for="ServiceType" className="control-label col"><IntlMessages id="sidebar.serviceType" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Select
                                            options={ServicetypeData.map((sList, index) => ({
                                                label: sList.ServiceTypeName,
                                                value: sList.Id
                                            }))}
                                            disabled={(isEdit ? (menuDetail["D856141D-4960-94A2-0DDD-AAFBAF8314EF"] && menuDetail["D856141D-4960-94A2-0DDD-AAFBAF8314EF"].AccessRight === "11E6E7B0")
                                                : (menuDetail["0801A727-01FB-4426-5B4E-C8EC33963205"] && menuDetail["0801A727-01FB-4426-5B4E-C8EC33963205"].AccessRight === "11E6E7B0")) ? true : false}
                                            value={{ label: this.state.stypeLabel }}
                                            onChange={this.onChangeSelectServiceType}
                                            isClearable={true}
                                            maxMenuHeight={200}
                                            placeholder={<IntlMessages id="sidebar.searchdot" />}
                                        />
                                        {errors.ServiceTypeMstId && <span className="text-danger text-left"><IntlMessages id={errors.ServiceTypeMstId} /></span>}
                                    </div>
                                </FormGroup>
                            }
                            {(isEdit ? (menuDetail["0282E0D0-0E9C-7D48-7A81-EA7A434625AA"] && menuDetail["0282E0D0-0E9C-7D48-7A81-EA7A434625AA"].Visibility === "E925F86B")//0282E0D0-0E9C-7D48-7A81-EA7A434625AA
                                : (menuDetail["5B76F7B6-2DDC-9A90-2897-74E83E7C655A"] && menuDetail["5B76F7B6-2DDC-9A90-2897-74E83E7C655A"].Visibility === "E925F86B"))//5B76F7B6-2DDC-9A90-2897-74E83E7C655A
                                &&
                                <FormGroup className="row">
                                    <Label for="PayType" className="control-label col"><IntlMessages id="sidebar.payType" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Select
                                            options={PaytypeData.map((sList, index) => ({
                                                label: sList.PayTypeName,
                                                value: sList.Id
                                            }))}
                                            disabled={(isEdit ? (menuDetail["0282E0D0-0E9C-7D48-7A81-EA7A434625AA"] && menuDetail["0282E0D0-0E9C-7D48-7A81-EA7A434625AA"].AccessRight === "11E6E7B0")
                                                : (menuDetail["5B76F7B6-2DDC-9A90-2897-74E83E7C655A"] && menuDetail["5B76F7B6-2DDC-9A90-2897-74E83E7C655A"].AccessRight === "11E6E7B0")) ? true : false}
                                            value={{ label: this.state.ptypeLabel }}
                                            onChange={this.onChangeSelectUser}
                                            isClearable={true}
                                            maxMenuHeight={200}
                                            placeholder={<IntlMessages id="sidebar.searchdot" />}
                                        />
                                        {errors.PayTypeId && <span className="text-danger text-left"><IntlMessages id={errors.PayTypeId} /></span>}
                                    </div>
                                </FormGroup>
                            }
                            {(isEdit ? (menuDetail["71029BDB-24FB-1253-7354-D2B7E29D3288"] && menuDetail["71029BDB-24FB-1253-7354-D2B7E29D3288"].Visibility === "E925F86B")//71029BDB-24FB-1253-7354-D2B7E29D3288
                                : (menuDetail["52FCD7A8-434C-26DE-03FA-D43C640F4314"] && menuDetail["52FCD7A8-434C-26DE-03FA-D43C640F4314"].Visibility === "E925F86B"))//52FCD7A8-434C-26DE-03FA-D43C640F4314
                                &&
                                <FormGroup className="row">
                                    <Label for="MaximumLevel" className="control-label col" ><IntlMessages id="sidebar.mindepositionrequired" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <IntlMessages id="sidebar.mindepositionrequired">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={(isEdit ? (menuDetail["71029BDB-24FB-1253-7354-D2B7E29D3288"] && menuDetail["71029BDB-24FB-1253-7354-D2B7E29D3288"].AccessRight === "11E6E7B0")
                                                        : (menuDetail["52FCD7A8-434C-26DE-03FA-D43C640F4314"] && menuDetail["52FCD7A8-434C-26DE-03FA-D43C640F4314"].AccessRight === "11E6E7B0")) ? true : false}
                                                    type="text" name="MinimumDepositionRequired" placeholder={placeholder} id="MinimumDepositionRequired" value={MinimumDepositionRequired} onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.MinimumDepositionRequired && <span className="text-danger text-left"><IntlMessages id={errors.MinimumDepositionRequired} /></span>}
                                    </div>
                                </FormGroup>
                            }
                            {(isEdit ? (menuDetail["F92CB0F7-042B-9E5E-9C0A-850514010CC4"] && menuDetail["F92CB0F7-042B-9E5E-9C0A-850514010CC4"].Visibility === "E925F86B")//F92CB0F7-042B-9E5E-9C0A-850514010CC4
                                : (menuDetail["C750ED45-5FC5-6E52-1D64-305E502E6426"] && menuDetail["C750ED45-5FC5-6E52-1D64-305E502E6426"].Visibility === "E925F86B"))//C750ED45-5FC5-6E52-1D64-305E502E6426
                                &&
                                <FormGroup className="row">
                                    <Label for="MaximumLevel" className="control-label col" ><IntlMessages id="sidebar.description" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <IntlMessages id="sidebar.description">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={(isEdit ? (menuDetail["F92CB0F7-042B-9E5E-9C0A-850514010CC4"] && menuDetail["F92CB0F7-042B-9E5E-9C0A-850514010CC4"].AccessRight === "11E6E7B0")
                                                        : (menuDetail["C750ED45-5FC5-6E52-1D64-305E502E6426"] && menuDetail["C750ED45-5FC5-6E52-1D64-305E502E6426"].AccessRight === "11E6E7B0")) ? true : false}
                                                    type="textarea" name="Description" placeholder={placeholder} id="Description" value={Description} onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.Description && <span className="text-danger text-left"><IntlMessages id={errors.Description} /></span>}
                                    </div>
                                </FormGroup>
                            }
                            {(isEdit ? (menuDetail["325CF45F-5547-9007-6B96-FFD9161052B4"] && menuDetail["325CF45F-5547-9007-6B96-FFD9161052B4"].Visibility === "E925F86B")//325CF45F-5547-9007-6B96-FFD9161052B4
                                : (menuDetail["C2485A14-90D6-283F-47F6-4CEB6AE1469C"] && menuDetail["C2485A14-90D6-283F-47F6-4CEB6AE1469C"].Visibility === "E925F86B"))//C2485A14-90D6-283F-47F6-4CEB6AE1469C
                                &&
                                <FormGroup className="row">

                                    <Label for="Status" className="control-label col"><IntlMessages id="my_account.status" /></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input
                                            disabled={(isEdit ? (menuDetail["325CF45F-5547-9007-6B96-FFD9161052B4"] && menuDetail["325CF45F-5547-9007-6B96-FFD9161052B4"].AccessRight === "11E6E7B0")
                                                : (menuDetail["C2485A14-90D6-283F-47F6-4CEB6AE1469C"] && menuDetail["C2485A14-90D6-283F-47F6-4CEB6AE1469C"].AccessRight === "11E6E7B0")) ? true : false}
                                            type="select" name="Status" id="Status" value={Status} onChange={(e) => this.onChangeData(e)}>
                                            <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                            <IntlMessages id="sidebar.active">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
                                            <IntlMessages id="sidebar.inactive">{(selectOption) => <option value="0">{selectOption}</option>}</IntlMessages>
                                            {isEdit &&
                                                <IntlMessages id="sidebar.delete">{(selectOption) => <option value="9">{selectOption}</option>}</IntlMessages>
                                            }
                                        </Input>
                                        {errors.Status && <span className="text-danger text-left"><IntlMessages id={errors.Status} /></span>}
                                    </div>
                                </FormGroup>
                            }
                            {(isEdit ? (menuDetail["21DF06E3-6D4E-0A64-0D59-9AB03DE1A1A6"] && menuDetail["21DF06E3-6D4E-0A64-0D59-9AB03DE1A1A6"].Visibility === "E925F86B")//21DF06E3-6D4E-0A64-0D59-9AB03DE1A1A6
                                : (menuDetail["A7727301-669E-3229-9A84-139884CF61D3"] && menuDetail["A7727301-669E-3229-9A84-139884CF61D3"].Visibility === "E925F86B"))//A7727301-669E-3229-9A84-139884CF61D3
                                &&
                                <FormGroup row>
                                    <Label for="FromDate" className="control-label col"><IntlMessages id="my_account.startDate" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input
                                            disabled={(isEdit ? (menuDetail["21DF06E3-6D4E-0A64-0D59-9AB03DE1A1A6"] && menuDetail["21DF06E3-6D4E-0A64-0D59-9AB03DE1A1A6"].AccessRight === "11E6E7B0")
                                                : (menuDetail["A7727301-669E-3229-9A84-139884CF61D3"] && menuDetail["A7727301-669E-3229-9A84-139884CF61D3"].AccessRight === "11E6E7B0")) ? true : false}
                                            type="date" name="FromDate" id="FromDate" placeholder="dd/mm/yyyy" value={FromDate.split('T')[0]} onChange={(e) => this.onChangeData(e)} min={today} />
                                        {errors.FromDate && (<span className="text-danger"><IntlMessages id={errors.FromDate} /></span>)}
                                    </div>
                                </FormGroup>
                            }
                            {(isEdit ? (menuDetail["9B9E0C9C-10FE-7299-06EA-D312D17C9283"] && menuDetail["9B9E0C9C-10FE-7299-06EA-D312D17C9283"].Visibility === "E925F86B")//9B9E0C9C-10FE-7299-06EA-D312D17C9283
                                : (menuDetail["1674821A-12B4-8ABB-411A-51E68C534601"] && menuDetail["1674821A-12B4-8ABB-411A-51E68C534601"].Visibility === "E925F86B"))//1674821A-12B4-8ABB-411A-51E68C534601
                                &&
                                <FormGroup row>
                                    <Label for="ExpireDate" className="control-label col"><IntlMessages id="my_account.endDate" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input
                                            disabled={(isEdit ? (menuDetail["9B9E0C9C-10FE-7299-06EA-D312D17C9283"] && menuDetail["9B9E0C9C-10FE-7299-06EA-D312D17C9283"].AccessRight === "11E6E7B0")
                                                : (menuDetail["1674821A-12B4-8ABB-411A-51E68C534601"] && menuDetail["1674821A-12B4-8ABB-411A-51E68C534601"].AccessRight === "11E6E7B0")) ? true : false}
                                            type="date" name="ToDate" id="ToDate" placeholder="dd/mm/yyyy" value={ToDate.split('T')[0]} onChange={(e) => this.onChangeData(e)} min={FromDate} />
                                        {errors.ToDate && (<span className="text-danger"><IntlMessages id={errors.ToDate} /></span>)}
                                    </div>
                                </FormGroup>
                            }


                            {Object.keys(menuDetail).length > 0 &&
                                <FormGroup row>
                                    <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                        <div className="btn_area">
                                            <Button disabled={this.props.loading} variant="raised" color="primary" onClick={(e) => this.onAddSubModule(e)}><IntlMessages id={isEdit ? "sidebar.btnEdit" : "sidebar.btnAdd"} /></Button>
                                            <Button disabled={this.props.loading} variant="raised" color="danger" className="ml-15" onClick={() => this.resetData()}><IntlMessages id="sidebar.btnCancel" /></Button>
                                        </div>
                                    </div>
                                </FormGroup>}
                        </Form>
                    </div>
                </div>
            </Fragment>
        );
    }
}

//Default Props
AddEditReferralSchemeTypeMapping.defaultProps = {
    pagedata: {
        isEdit: false
    }
}

const mapToProps = ({ ReferralSchemeTypeMappingReducer, authTokenRdcer, ReferralServiceTypeReducer, ReferralPayTypeReducer }) => {
    const response = {
        addEditData: ReferralSchemeTypeMappingReducer.addEditData,
        list: ReferralSchemeTypeMappingReducer.list,
        loading: ReferralSchemeTypeMappingReducer.loading,
        edit_loading: ReferralSchemeTypeMappingReducer.edit_loading,
        menuLoading: authTokenRdcer.menuLoading,
        menu_rights: authTokenRdcer.menu_rights,
        referralServiceTypeData: ReferralServiceTypeReducer.referralServiceTypeData,
        referralPayTypeData: ReferralPayTypeReducer.referralPayTypeData,
        getDataById: ReferralSchemeTypeMappingReducer.getDataById


    }
    return response;
}

export default connect(mapToProps, {
    addEditReferralSchemeTypeMapping,
    getMenuPermissionByID,
    getReferralPayTypeData,
    getReferralServiceTypeData,
    getReferralSchemeTypeMappingData
})(AddEditReferralSchemeTypeMapping);