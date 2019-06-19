/* 
    Developer : Bharat Jograna
    Date : 23 May 2019
    Updated By :
    File Comment : MyAccount Add/Edit Referral Service Detail Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import Select from "react-select";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { addReferralServiceDetail, getReferralServiceDetailData, getReferralSchemeTypeMappingData } from "Actions/MyAccount";
import { getWalletType } from "Actions/WalletUsagePolicy";
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { getActiveInactiveStatus } from 'Helpers/helpers';
import validateReferralServiceDetail from 'Validations/MyAccount/referral_service_detail';

//Component for MyAccount Add/Edit Referral Service Detail
class AddEditReferralServiceDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            isEdit: false,
            data: {
                Id: '',
                SchemeTypeMappingId: '',
                MaximumLevel: '',
                MaximumCoin: '',
                MinimumValue: '',
                MaximumValue: '',
                CreditWalletTypeId: '',
                CommissionType: '',
                CommissionValue: '',
                Status: '',
            },
            errors: "",
            fieldList: {},
            menudetail: [],
            notification: true,
            CreditWalletTypeList: [],
            CreditWalletTypeLable: null,
            SchemeTypeMappingList: [],
            SchemeTypeMappingLable: null,
        };
    }

    resetData() {
        var newObj = Object.assign({}, this.state.data);
        newObj['Id'] = '';
        newObj['SchemeTypeMappingId'] = '';
        newObj['MaximumLevel'] = '';
        newObj['MaximumCoin'] = '';
        newObj['MinimumValue'] = '';
        newObj['MaximumValue'] = '';
        newObj['CreditWalletTypeId'] = '';
        newObj['CommissionType'] = '';
        newObj['CommissionValue'] = '';
        newObj['Status'] = '';
        this.setState({ data: newObj, errors: "", CreditWalletTypeLable: null });
        this.props.drawerClose();
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    };

    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.pagedata.isEdit ? '7D7AA261-93BF-7C10-1A13-5D1F086A12F7' : '312225B7-03D1-5772-7BE9-C5627C305763');

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
                this.props.getWalletType({ Status: 1 });
                this.props.getReferralSchemeTypeMappingData();
                if (this.state.isEdit) {
                    this.props.addReferralServiceDetail();
                }
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notification: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        //Get Service Detail Data By Id
        if (nextProps.getDataById.hasOwnProperty('Data') && Object.keys(nextProps.getDataById.Data).length > 0 && this.props.pagedata.isEdit) {
            this.setState({ data: nextProps.getDataById.Data, SchemeTypeMappingLable: nextProps.getDataById.Data.SchemeTypeMappingName, CreditWalletTypeLable: nextProps.getDataById.Data.WalletTypeName });
        }

        //Get walletType
        if (nextProps.hasOwnProperty('walletType') && Object.keys(nextProps.walletType).length > 0) {
            this.setState({ CreditWalletTypeList: nextProps.walletType });
        }

        if (nextProps.mappingList.ReturnCode === 1 || nextProps.mappingList.ReturnCode === 9) {
            this.setState({ SchemeTypeMappingList: [], totalCount: 0 });
        } else if (nextProps.mappingList.hasOwnProperty('Data') && nextProps.mappingList.Data !== null) {
            this.setState({ SchemeTypeMappingList: nextProps.mappingList.Data, totalCount: nextProps.mappingList.TotalCount });
        }

        if (nextProps.addEditData.ReturnCode === 1 || nextProps.addEditData.ReturnCode === 9) {
            var errMsg = nextProps.addEditData.ErrorCode === 1 ? nextProps.addEditData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.addEditData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.addEditData.ReturnCode === 0 && this.state.isEdit) {
            var sucMsg = nextProps.addEditData.ErrorCode === 0 ? nextProps.addEditData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.addEditData.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
            this.setState({ isEdit: false });
            this.resetData();
            this.props.getReferralServiceDetailData();
            this.props.drawerClose();
        }
    }

    //Add Sub Module method...
    onAddEditServiceDetail(event) {
        const { errors, isValid } = validateReferralServiceDetail(this.state.data);
        this.setState({ errors: errors });

        if (isValid) {
            this.props.addReferralServiceDetail(this.state.data);
        }
    }

    //onchange select Wallet...
    onChangeSelectCoin = (event) => {
        event === null && (event = { label: null, value: "" });
        var newObj = Object.assign({}, this.state.data);
        newObj.CreditWalletTypeId = event.value;
        this.setState({ data: newObj, CreditWalletTypeLable: event.label });
    }

    //onchange select SchemeTypeMappingId...
    onChangeSelectSchemeTypeMapping = (event) => {
        event === null && (event = { label: null, value: "" });
        var newObj = Object.assign({}, this.state.data);
        newObj.SchemeTypeMappingId = event.value;
        this.setState({ data: newObj, SchemeTypeMappingLable: event.label });
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
        const { errors, mdlList, CreditWalletTypeList, CreditWalletTypeLable, SchemeTypeMappingList, SchemeTypeMappingLable } = this.state;
        const { SchemeTypeMappingId, MaximumLevel, MaximumCoin, MinimumValue, MaximumValue, CommissionType, CommissionValue, Status } = this.state.data;
        const statusList = getActiveInactiveStatus();
        var menuDetail = this.checkAndGetMenuAccessDetail(isEdit ? '7E130931-50FA-5553-20F5-C5450AA5243A' : '06969D4A-70EF-3285-5CCC-D3EA0FD6883E');
        return (
            <Fragment>
                {(this.props.menuLoading || this.props.edit_loading) && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id={isEdit ? "sidebar.editReferralServiceDetail" : "sidebar.addReferralServiceDetail"} />} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="jbs-page-content col-md-12 mx-auto">
                        <Form className="tradefrm">

                            {(isEdit ? (menuDetail["63ECF7F0-0A64-8F5A-60E6-6CA15A034B79"] && menuDetail["63ECF7F0-0A64-8F5A-60E6-6CA15A034B79"].Visibility === "E925F86B")//63ECF7F0-0A64-8F5A-60E6-6CA15A034B79
                                : (menuDetail["D8ECA6D1-12C3-55E6-2198-1C1233839151"] && menuDetail["D8ECA6D1-12C3-55E6-2198-1C1233839151"].Visibility === "E925F86B"))//D8ECA6D1-12C3-55E6-2198-1C1233839151
                                &&
                                <FormGroup className="row">
                                    <Label for="SchemeTypeMappingId" className="control-label col" ><IntlMessages id="sidebar.colSchemeTypeName" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Select
                                            options={SchemeTypeMappingList.map((user) => ({
                                                value: user.Id,
                                                label: user.ServiceTypeName
                                            }))}
                                            disabled={(isEdit ? (menuDetail["63ECF7F0-0A64-8F5A-60E6-6CA15A034B79"] && menuDetail["63ECF7F0-0A64-8F5A-60E6-6CA15A034B79"].AccessRight === "11E6E7B0")
                                                : (menuDetail["D8ECA6D1-12C3-55E6-2198-1C1233839151"] && menuDetail["D8ECA6D1-12C3-55E6-2198-1C1233839151"].AccessRight === "11E6E7B0")) ? true : false}
                                            isClearable={true}
                                            value={SchemeTypeMappingLable === null ? null : ({ value: SchemeTypeMappingId, label: SchemeTypeMappingLable })}
                                            onChange={(e) => this.onChangeSelectSchemeTypeMapping(e)}
                                            maxMenuHeight={200}
                                            placeholder={<IntlMessages id="sidebar.searchdot" />}
                                        />
                                        {errors.SchemeTypeMappingId && <span className="text-danger text-left"><IntlMessages id={errors.SchemeTypeMappingId} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["52CB849D-8619-68DB-2C6B-327FC76D87EB"] && menuDetail["52CB849D-8619-68DB-2C6B-327FC76D87EB"].AccessRight) //52CB849D-8619-68DB-2C6B-327FC76D87EB
                                : (menuDetail["DE7616CE-7EC8-1CEF-6C39-462AB30E9DA8"] && menuDetail["DE7616CE-7EC8-1CEF-6C39-462AB30E9DA8"].AccessRight)) && //DE7616CE-7EC8-1CEF-6C39-462AB30E9DA8
                                <FormGroup className="row">
                                    <Label for="MaximumLevel" className="control-label col" ><IntlMessages id="sidebar.colMaximumLevel" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <IntlMessages id="sidebar.colMaximumLevel">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={(isEdit ? (menuDetail["52CB849D-8619-68DB-2C6B-327FC76D87EB"] && menuDetail["52CB849D-8619-68DB-2C6B-327FC76D87EB"].AccessRight === "11E6E7B0")
                                                        : (menuDetail["DE7616CE-7EC8-1CEF-6C39-462AB30E9DA8"] && menuDetail["DE7616CE-7EC8-1CEF-6C39-462AB30E9DA8"].AccessRight === "11E6E7B0")) ? true : false}
                                                    type="text" name="MaximumLevel" placeholder={placeholder} id="MaximumLevel" value={MaximumLevel} onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.MaximumLevel && <span className="text-danger text-left"><IntlMessages id={errors.MaximumLevel} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["B60C2F1F-391A-6F7F-740F-8FE69A3D3957"] && menuDetail["B60C2F1F-391A-6F7F-740F-8FE69A3D3957"].AccessRight) //B60C2F1F-391A-6F7F-740F-8FE69A3D3957
                                : (menuDetail["B70F16DE-0A39-00EB-0A1C-508EBEBE19A1"] && menuDetail["B70F16DE-0A39-00EB-0A1C-508EBEBE19A1"].AccessRight)) && //B70F16DE-0A39-00EB-0A1C-508EBEBE19A1
                                <FormGroup className="row">
                                    <Label for="MaximumCoin" className="control-label col" ><IntlMessages id="sidebar.colMaximumCoin" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <IntlMessages id="sidebar.colMaximumCoin">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={(isEdit ? (menuDetail["B60C2F1F-391A-6F7F-740F-8FE69A3D3957"] && menuDetail["B60C2F1F-391A-6F7F-740F-8FE69A3D3957"].AccessRight === "11E6E7B0")
                                                        : (menuDetail["B70F16DE-0A39-00EB-0A1C-508EBEBE19A1"] && menuDetail["B70F16DE-0A39-00EB-0A1C-508EBEBE19A1"].AccessRight === "11E6E7B0")) ? true : false}
                                                    type="text" name="MaximumCoin" placeholder={placeholder} id="MaximumCoin" value={MaximumCoin} onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.MaximumCoin && <span className="text-danger text-left"><IntlMessages id={errors.MaximumCoin} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["21D68076-3D66-913D-1BE0-AD960D861F4A"] && menuDetail["21D68076-3D66-913D-1BE0-AD960D861F4A"].AccessRight) //21D68076-3D66-913D-1BE0-AD960D861F4A
                                : (menuDetail["64D8E144-A3E9-83FD-276D-01ACA6672BE1"] && menuDetail["64D8E144-A3E9-83FD-276D-01ACA6672BE1"].AccessRight)) && //64D8E144-A3E9-83FD-276D-01ACA6672BE1
                                <FormGroup className="row">
                                    <Label for="MinimumValue" className="control-label col" ><IntlMessages id="sidebar.colMinimumValue" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <IntlMessages id="sidebar.colMinimumValue">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={(isEdit ? (menuDetail["21D68076-3D66-913D-1BE0-AD960D861F4A"] && menuDetail["21D68076-3D66-913D-1BE0-AD960D861F4A"].AccessRight === "11E6E7B0")
                                                        : (menuDetail["64D8E144-A3E9-83FD-276D-01ACA6672BE1"] && menuDetail["64D8E144-A3E9-83FD-276D-01ACA6672BE1"].AccessRight === "11E6E7B0")) ? true : false}
                                                    type="text" name="MinimumValue" placeholder={placeholder} id="MinimumValue" value={MinimumValue} onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.MinimumValue && <span className="text-danger text-left"><IntlMessages id={errors.MinimumValue} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["3742A217-21C1-876D-5D4D-DD3F6CB270B4"] && menuDetail["3742A217-21C1-876D-5D4D-DD3F6CB270B4"].AccessRight) //3742A217-21C1-876D-5D4D-DD3F6CB270B4
                                : (menuDetail["2A9A1D77-2FFE-2CC4-1734-5A77EF6B2DD9"] && menuDetail["2A9A1D77-2FFE-2CC4-1734-5A77EF6B2DD9"].AccessRight)) && //2A9A1D77-2FFE-2CC4-1734-5A77EF6B2DD9
                                <FormGroup className="row">
                                    <Label for="MaximumValue" className="control-label col" ><IntlMessages id="sidebar.colMaximumValue" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <IntlMessages id="sidebar.colMaximumValue">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={(isEdit ? (menuDetail["3742A217-21C1-876D-5D4D-DD3F6CB270B4"] && menuDetail["3742A217-21C1-876D-5D4D-DD3F6CB270B4"].AccessRight === "11E6E7B0")
                                                        : (menuDetail["2A9A1D77-2FFE-2CC4-1734-5A77EF6B2DD9"] && menuDetail["2A9A1D77-2FFE-2CC4-1734-5A77EF6B2DD9"].AccessRight === "11E6E7B0")) ? true : false}
                                                    type="text" name="MaximumValue" placeholder={placeholder} id="MaximumValue" value={MaximumValue} onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.MaximumValue && <span className="text-danger text-left"><IntlMessages id={errors.MaximumValue} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["696EE02D-736C-2EAF-5521-C48543267EAC"] && menuDetail["696EE02D-736C-2EAF-5521-C48543267EAC"].AccessRight) //696EE02D-736C-2EAF-5521-C48543267EAC
                                : (menuDetail["F005B58C-7F0F-7AE0-76F2-E3AB7A072DB9"] && menuDetail["F005B58C-7F0F-7AE0-76F2-E3AB7A072DB9"].AccessRight)) && //F005B58C-7F0F-7AE0-76F2-E3AB7A072DB9
                                <FormGroup className="row">
                                    <Label for="CreditWalletTypeId" className="control-label col"><IntlMessages id="sidebar.colCreditWalletTypeName" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Select
                                            options={CreditWalletTypeList.map((Wallet) => ({
                                                value: Wallet.ID,
                                                label: Wallet.TypeName
                                            }))}
                                            disabled={(isEdit ? (menuDetail["696EE02D-736C-2EAF-5521-C48543267EAC"] && menuDetail["696EE02D-736C-2EAF-5521-C48543267EAC"].AccessRight === "11E6E7B0")
                                                : (menuDetail["F005B58C-7F0F-7AE0-76F2-E3AB7A072DB9"] && menuDetail["F005B58C-7F0F-7AE0-76F2-E3AB7A072DB9"].AccessRight === "11E6E7B0")) ? true : false}
                                            isClearable={true}
                                            value={CreditWalletTypeLable === null ? null : ({ label: CreditWalletTypeLable })}
                                            onChange={(e) => this.onChangeSelectCoin(e)}
                                            maxMenuHeight={200}
                                            placeholder={<IntlMessages id="sidebar.searchdot" />}
                                        />
                                        {errors.CreditWalletTypeId && <span className="text-danger text-left"><IntlMessages id={errors.CreditWalletTypeId} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["BAA81770-3210-7175-A0B8-7E80A54275FA"] && menuDetail["BAA81770-3210-7175-A0B8-7E80A54275FA"].AccessRight) //BAA81770-3210-7175-A0B8-7E80A54275FA
                                : (menuDetail["1C28F51E-3F7F-4300-A1E7-50B60920A32A"] && menuDetail["1C28F51E-3F7F-4300-A1E7-50B60920A32A"].AccessRight)) && //1C28F51E-3F7F-4300-A1E7-50B60920A32A
                                <FormGroup className="row">
                                    <Label for="CommissionType" className="control-label col"><IntlMessages id="sidebar.commissionType" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input
                                            disabled={(isEdit ? (menuDetail["BAA81770-3210-7175-A0B8-7E80A54275FA"] && menuDetail["BAA81770-3210-7175-A0B8-7E80A54275FA"].AccessRight === "11E6E7B0")
                                                : (menuDetail["1C28F51E-3F7F-4300-A1E7-50B60920A32A"] && menuDetail["1C28F51E-3F7F-4300-A1E7-50B60920A32A"].AccessRight === "11E6E7B0")) ? true : false}
                                            type="select" id="CommissionType" name="CommissionType" value={CommissionType} onChange={(e) => this.onChange(e)}>
                                            <IntlMessages id="sidebar.selCommissionType">{(placeholder) => <option value="">{placeholder}</option>}</IntlMessages>
                                            <IntlMessages id="wallet.Fixed">{(fix) => <option value="1">{fix}</option>}</IntlMessages>
                                            <IntlMessages id="wallet.Percentage">{(percentage) => <option value="2">{percentage}</option>}</IntlMessages>
                                        </Input>
                                        {errors.CommissionType && <span className="text-danger text-left"><IntlMessages id={errors.CommissionType} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["1F4BF35C-3AF3-0CB6-7B18-66F8FF9D4DA3"] && menuDetail["1F4BF35C-3AF3-0CB6-7B18-66F8FF9D4DA3"].AccessRight) //1F4BF35C-3AF3-0CB6-7B18-66F8FF9D4DA3
                                : (menuDetail["A7836291-8F3B-96AB-7333-244300AA3388"] && menuDetail["A7836291-8F3B-96AB-7333-244300AA3388"].AccessRight)) && //A7836291-8F3B-96AB-7333-244300AA3388
                                <FormGroup className="row">
                                    <Label for="CommissionValue" className="control-label col" ><IntlMessages id="sidebar.colCommissionValue" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <IntlMessages id="sidebar.enterCommissionValue">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={(isEdit ? (menuDetail["1F4BF35C-3AF3-0CB6-7B18-66F8FF9D4DA3"] && menuDetail["1F4BF35C-3AF3-0CB6-7B18-66F8FF9D4DA3"].AccessRight === "11E6E7B0")
                                                        : (menuDetail["A7836291-8F3B-96AB-7333-244300AA3388"] && menuDetail["A7836291-8F3B-96AB-7333-244300AA3388"].AccessRight === "11E6E7B0")) ? true : false}
                                                    type="text" name="CommissionValue" placeholder={placeholder} id="CommissionValue" value={CommissionValue} onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.CommissionValue && <span className="text-danger text-left"><IntlMessages id={errors.CommissionValue} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["DC6638FD-3797-578A-502E-75F343380C9C"] && menuDetail["DC6638FD-3797-578A-502E-75F343380C9C"].AccessRight) //DC6638FD-3797-578A-502E-75F343380C9C
                                : (menuDetail["165D1E718-7F4D-2AB4-4A57-0109B38C13FC"] && menuDetail["165D1E718-7F4D-2AB4-4A57-0109B38C13FC"].AccessRight)) && //165D1E718-7F4D-2AB4-4A57-0109B38C13FC
                                <FormGroup className="row">
                                    <Label for="Status" className="control-label col"><IntlMessages id="my_account.status" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input
                                            disabled={(isEdit ? (menuDetail["DC6638FD-3797-578A-502E-75F343380C9C"] && menuDetail["DC6638FD-3797-578A-502E-75F343380C9C"].AccessRight === "11E6E7B0")
                                                : (menuDetail["165D1E718-7F4D-2AB4-4A57-0109B38C13FC"] && menuDetail["165D1E718-7F4D-2AB4-4A57-0109B38C13FC"].AccessRight === "11E6E7B0")) ? true : false}
                                            type="select" name="Status" value={Status} id="Status" onChange={(e) => this.onChange(e)}>
                                            <IntlMessages id="sidebar.selStatus">{(selStatus) => <option value="">{selStatus}</option>}</IntlMessages>
                                            {statusList.map((sList) => (
                                                (isEdit || sList.id !== 9) &&
                                                (<IntlMessages key={sList.id} id={sList.label}>{(placeholder) => <option key={sList.id} value={sList.id}>{placeholder}</option>}</IntlMessages>)
                                            ))}
                                        </Input>
                                        {errors.Status && <span className="text-danger text-left"><IntlMessages id={errors.Status} /></span>}
                                    </div>
                                </FormGroup>}
                            {menuDetail &&
                                <FormGroup row>
                                    <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                        <div className="btn_area">
                                            <Button disabled={this.props.loading} variant="raised" color="primary" onClick={(e) => this.onAddEditServiceDetail(e)}><IntlMessages id={isEdit ? "sidebar.btnEdit" : "sidebar.btnAdd"} /></Button>
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
AddEditReferralServiceDetail.defaultProps = {
    isEdit: false,
    pagedata: {
        isEdit: false
    }
}

const mapToProps = ({ ReferralServiceDetail, walletUsagePolicy, ReferralSchemeTypeMappingReducer, authTokenRdcer }) => {
    const response = {
        getDataById: ReferralServiceDetail.getDataById,
        addEditData: ReferralServiceDetail.addEditData,
        list: ReferralServiceDetail.list,
        loading: ReferralServiceDetail.loading,
        edit_loading: ReferralServiceDetail.edit_loading,
        menuLoading: authTokenRdcer.menuLoading,
        menu_rights: authTokenRdcer.menu_rights,
        walletType: walletUsagePolicy.walletType,
        mappingList: ReferralSchemeTypeMappingReducer.list,
    }
    return response;
}

export default connect(mapToProps, {
    addReferralServiceDetail,
    getReferralServiceDetailData,
    getWalletType,
    getReferralSchemeTypeMappingData,
    getMenuPermissionByID,
})(AddEditReferralServiceDetail);