/* 
    Developer : Bharat Jograna
    Date : 27 March 2019
    File Comment : MyAccount Add/Edit Affiliate Scheme Type Mapping Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import Select from "react-select";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { getAffiliateSchemeList, getAffiliateSchemeTypeList, addAffiliateSchemeTypeMapping, editAffiliateSchemeTypeMapping, getAffiliateSchemeTypeMappingList } from "Actions/MyAccount";
import { getWalletTypeMaster } from "Actions/WalletTypes";
import { getSchemeStatus, getCommissionType } from 'Helpers/helpers';
import validateAffiliateSchemeTypeMapping from 'Validations/MyAccount/affiliate_schemetype_mapping';
import AppConfig from 'Constants/AppConfig';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//Component for MyAccount Add/Edit Affiliate Scheme Type Mapping Dashboard
class AddEditAffiliateSchemeTypeMapping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: {
                SchemeMasterId: "",
                SchemeTypeMasterId: "",
                MinimumDepositionRequired: "",
                DepositWalletTypeId: "",
                CommissionTypeInterval: "",
                Description: "",
                CommissionHour: "",
                Status: "",
                MappingId: "",
            },
            pageData: {
                PageNo: 0,
                PageSize: AppConfig.totalRecordDisplayInList
            },
            isAddData: false,
            errors: "",
            SchemeMasterIdList: [],
            SchemeTypeMasterIdList: [],
            WalletTypeIdList: [],
            SchemeMasterIdLable: null,
            SchemeTypeMasterIdLable: null,
            WalletTypeIdLable: null,
            fieldList: {},
            menudetail: [],
            notification: true,
        };
        this.initState = this.state;
    }

    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.pagedata.isEdit ? '00440f64-4e55-a329-3533-0bfb519528c8' : '63CC6D76-239C-0548-4231-53C3A0F5873C');
    }

    resetData() {
        let newObj = Object.assign({}, this.initState);
        newObj.menudetail = this.state.menudetail;
        this.setState(newObj);
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

    //to set SchemeMasterId from react-select...
    onChangeSelectSchemeMasterId(event) {
        event === null && (event = { label: null, value: "" });
        var newObj = Object.assign({}, this.state.data);
        newObj.SchemeMasterId = event.value;
        this.setState({ data: newObj, SchemeMasterIdLable: event.label })
    }

    //to set SchemeTypeMasterId from react-select...
    onChangeSelectSchemeTypeMasterId(event) {
        event === null && (event = { label: null, value: "" });
        var newObj = Object.assign({}, this.state.data);
        newObj.SchemeTypeMasterId = event.value;
        this.setState({ data: newObj, SchemeTypeMasterIdLable: event.label })
    }

    //to set DepositWalletTypeId from react-select...
    onChangeSelectDepositWalletTypeId(event) {
        event === null && (event = { label: null, value: "" });
        var newObj = Object.assign({}, this.state.data);
        newObj.DepositWalletTypeId = event.value;
        this.setState({ data: newObj, WalletTypeIdLable: event.label })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });
        // added by vishva
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getAffiliateSchemeList(this.state.pageData)
                this.props.getAffiliateSchemeTypeList(this.state.pageData);
                this.props.getWalletTypeMaster();
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notification: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        //Get Affiliate SchemeMasterId List... 
        if (nextProps.Responce.SchemeMasterIdlist.hasOwnProperty('Data') && nextProps.Responce.SchemeMasterIdlist.Data.length > 0) {
            this.setState({ SchemeMasterIdList: nextProps.Responce.SchemeMasterIdlist.Data })
        }

        //Get Affiliate SchemeType MasterId List...
        if (nextProps.Responce.SchemeTypeMasterIdlist.hasOwnProperty('Data') && nextProps.Responce.SchemeTypeMasterIdlist.Data.length > 0) {
            this.setState({ SchemeTypeMasterIdList: nextProps.Responce.SchemeTypeMasterIdlist.Data });
        }

        //Get Affiliate SchemeType WalletTypeId List...
        if (nextProps.walletTypesData.hasOwnProperty('walletTypeMasters') && nextProps.walletTypesData.walletTypeMasters.length > 0) {
            this.setState({ WalletTypeIdList: nextProps.walletTypesData.walletTypeMasters });
        }

        //Get AffiliateScheme Data By Id
        if (nextProps.getData.hasOwnProperty('Data') && Object.keys(nextProps.getData.Data).length > 0 && this.props.pagedata.isEdit) {
            var newObj = Object.assign({}, this.state.data);
            newObj.MappingId = nextProps.getData.Data.MappingId;
            newObj.SchemeTypeMasterId = nextProps.getData.Data.SchemeTypeMasterId;
            newObj.MinimumDepositionRequired = nextProps.getData.Data.MinimumDepositionRequired;
            newObj.DepositWalletTypeId = nextProps.getData.Data.DepositWalletTypeId; //change with coin name
            newObj.CommissionTypeInterval = nextProps.getData.Data.CommissionTypeInterval;
            newObj.Description = nextProps.getData.Data.Description;
            newObj.CommissionHour = nextProps.getData.Data.CommissionHour;
            newObj.Status = nextProps.getData.Data.Status;
            this.setState({ data: newObj, SchemeTypeMasterIdLable: nextProps.getData.Data.SchemeTypeName, WalletTypeIdLable: nextProps.getData.Data.DepositWalletTypeName });
        } else {
            if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) {
                var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
                NotificationManager.error(errMsg);
            } else if (nextProps.data.ReturnCode === 0 && this.state.isAddData) {
                this.setState({ isAddData: false });
                var sucMsg = nextProps.data.ErrorCode === 0 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
                NotificationManager.success(sucMsg);
                this.resetData();
                this.props.getAffiliateSchemeTypeMappingList(this.state.pageData)
            }
        }
    }

    //Add AffiliateScheme method...
    onAddAffiliateScheme(event) {
        event.preventDefault();
        var newObj = Object.assign({}, this.state.data);
        delete newObj.MappingId;
        const { errors, isValid } = validateAffiliateSchemeTypeMapping(newObj);
        this.setState({ isAddData: true, errors: errors });

        if (isValid) {
            this.props.addAffiliateSchemeTypeMapping(newObj);
        }
    }

    //Edit AffiliateScheme method...
    onEditAffiliateScheme(event) {
        event.preventDefault();
        var newObj = Object.assign({}, this.state.data);
        const { errors, isValid } = validateAffiliateSchemeTypeMapping(newObj);
        this.setState({ isAddData: true, errors: errors });

        if (isValid) {
            this.props.editAffiliateSchemeTypeMapping(newObj);
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
        const { errors, SchemeMasterIdList, SchemeMasterIdLable, SchemeTypeMasterIdList, SchemeTypeMasterIdLable, WalletTypeIdList, WalletTypeIdLable } = this.state;
        const { MinimumDepositionRequired, CommissionTypeInterval, Description, CommissionHour, Status } = this.state.data;
        const statusList = getSchemeStatus();
        const commissionTypeList = getCommissionType();
        var menuDetail = this.checkAndGetMenuAccessDetail(isEdit ? '07225425-A7B0-A1EB-6D78-003ECC6772B7' : '34259F5C-159D-2C16-9D40-BEEEB45E6642');
        return (
            <Fragment>
                {this.props.menuLoading && <JbsSectionLoader />}
                {this.props.loading && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id={isEdit ? "sidebar.editAffiliateSchemeTypeMapping" : "sidebar.addAffiliateSchemeTypeMaping"} />} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="jbs-page-content col-md-12 mx-auto">
                        <Form className="tradefrm">
                            {!isEdit &&
                                menuDetail["E4B57BA4-1E3D-A757-69AF-CF69E40B1226"] && menuDetail["E4B57BA4-1E3D-A757-69AF-CF69E40B1226"].Visibility === "E925F86B" && //E4B57BA4-1E3D-A757-69AF-CF69E40B1226
                                <FormGroup className="row">
                                    <Label for="SchemeMasterId" className="control-label col" ><IntlMessages id="sidebar.colSchemeName" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-8 col-xs-12">
                                        <Select className="r_sel_20"
                                            options={SchemeMasterIdList.map((user) => ({
                                                value: user.SchemeMasterId,
                                                label: user.SchemeName
                                            }))}
                                            isDisabled={(menuDetail["E4B57BA4-1E3D-A757-69AF-CF69E40B1226"].AccessRight === "11E6E7B0") ? true : false}
                                            isClearable={true}
                                            value={this.state.SchemeMasterIdLable === null ? null : ({ label: SchemeMasterIdLable })}
                                            onChange={(e) => this.onChangeSelectSchemeMasterId(e)}
                                            maxMenuHeight={200}
                                            placeholder={<IntlMessages id="sidebar.searchdot" />}
                                        />
                                        {errors.SchemeMasterId && <span className="text-danger text-left"><IntlMessages id={errors.SchemeMasterId} /></span>}
                                    </div>
                                </FormGroup>}
                            {!isEdit &&
                                menuDetail["090496B9-1814-08AD-527A-FA3335EA5185"] && menuDetail["090496B9-1814-08AD-527A-FA3335EA5185"].Visibility === "E925F86B" && //090496B9-1814-08AD-527A-FA3335EA5185
                                <FormGroup className="row">
                                    <Label for="SchemeTypeMasterId" className="control-label col" ><IntlMessages id="sidebar.colSchemeTypeName" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-8 col-xs-12">
                                        <Select className="r_sel_20"
                                            options={SchemeTypeMasterIdList.map((user) => ({
                                                value: user.SchemeTypeId,
                                                label: user.SchemeTypeName
                                            }))}
                                            isDisabled={(menuDetail["090496B9-1814-08AD-527A-FA3335EA5185"].AccessRight === "11E6E7B0") ? true : false}
                                            value={this.state.SchemeTypeMasterIdLable === null ? null : ({ label: SchemeTypeMasterIdLable })}
                                            onChange={(e) => this.onChangeSelectSchemeTypeMasterId(e)}
                                            maxMenuHeight={200}
                                            placeholder={<IntlMessages id="sidebar.searchdot" />}
                                        />
                                        {errors.SchemeTypeMasterId && <span className="text-danger text-left"><IntlMessages id={errors.SchemeTypeMasterId} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["1BF1786C-400C-8D37-77EC-6880FDC2A392"] && menuDetail["1BF1786C-400C-8D37-77EC-6880FDC2A392"].Visibility === "E925F86B") //1BF1786C-400C-8D37-77EC-6880FDC2A392
                                : (menuDetail["5D02E5AD-02BA-2AE8-3F84-71D880A60DCB"] && menuDetail["5D02E5AD-02BA-2AE8-3F84-71D880A60DCB"].Visibility === "E925F86B")) && //5D02E5AD-02BA-2AE8-3F84-71D880A60DCB
                                <FormGroup className="row">
                                    <Label for="MinimumDepositionRequired" className="control-label col" ><IntlMessages id="sidebar.colMinimumDepositionRequired" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-8 col-xs-12">
                                        <IntlMessages id="sidebar.colMinimumDepositionRequired">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={(isEdit ? (menuDetail["1BF1786C-400C-8D37-77EC-6880FDC2A392"] && menuDetail["1BF1786C-400C-8D37-77EC-6880FDC2A392"].AccessRight === "11E6E7B0") //1BF1786C-400C-8D37-77EC-6880FDC2A392
                                                        : (menuDetail["5D02E5AD-02BA-2AE8-3F84-71D880A60DCB"] && menuDetail["5D02E5AD-02BA-2AE8-3F84-71D880A60DCB"].AccessRight === "11E6E7B0")) ? true : false}
                                                    type="text" name="MinimumDepositionRequired" value={MinimumDepositionRequired} placeholder={placeholder} id="MinimumDepositionRequired" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.MinimumDepositionRequired && <span className="text-danger text-left"><IntlMessages id={errors.MinimumDepositionRequired} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["D89FBFEC-77AF-0124-0BE2-51468D52738E"] && menuDetail["D89FBFEC-77AF-0124-0BE2-51468D52738E"].Visibility === "E925F86B") //D89FBFEC-77AF-0124-0BE2-51468D52738E
                                : (menuDetail["E937C133-2DFB-105F-427E-45D798FC48EC"] && menuDetail["E937C133-2DFB-105F-427E-45D798FC48EC"].Visibility === "E925F86B")) && //E937C133-2DFB-105F-427E-45D798FC48EC
                                <FormGroup className="row">
                                    <Label for="DepositWalletTypeId" className="control-label col" ><IntlMessages id="sidebar.colDepositWalletType" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-8 col-xs-12">
                                        <Select className="r_sel_20"
                                            options={WalletTypeIdList.map((user) => ({
                                                value: user.Id,
                                                label: user.CoinName
                                            }))}
                                            isDisabled={(isEdit ? (menuDetail["D89FBFEC-77AF-0124-0BE2-51468D52738E"] && menuDetail["D89FBFEC-77AF-0124-0BE2-51468D52738E"].AccessRight === "11E6E7B0") //D89FBFEC-77AF-0124-0BE2-51468D52738E
                                                : (menuDetail["E937C133-2DFB-105F-427E-45D798FC48EC"] && menuDetail["E937C133-2DFB-105F-427E-45D798FC48EC"].AccessRight === "11E6E7B0")) ? true : false}
                                            value={this.state.WalletTypeIdLable === null ? null : ({ label: WalletTypeIdLable })}
                                            onChange={(e) => this.onChangeSelectDepositWalletTypeId(e)}
                                            maxMenuHeight={200}
                                            placeholder={<IntlMessages id="sidebar.searchdot" />}
                                        />
                                        {errors.DepositWalletTypeId && <span className="text-danger text-left"><IntlMessages id={errors.DepositWalletTypeId} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["692D1B26-0F28-1FAE-3EFC-785BE0582331"] && menuDetail["692D1B26-0F28-1FAE-3EFC-785BE0582331"].Visibility === "E925F86B") //692D1B26-0F28-1FAE-3EFC-785BE0582331
                                : (menuDetail["12E20EC5-2394-A2CC-70AE-93A65C7553BA"] && menuDetail["12E20EC5-2394-A2CC-70AE-93A65C7553BA"].Visibility === "E925F86B")) && //12E20EC5-2394-A2CC-70AE-93A65C7553BA
                                <FormGroup className="row">
                                    <Label for="CommissionHour" className="control-label col"><IntlMessages id="sidebar.colCommissionHour" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-8 col-xs-12">
                                        <Input
                                            disabled={(isEdit ? (menuDetail["692D1B26-0F28-1FAE-3EFC-785BE0582331"] && menuDetail["692D1B26-0F28-1FAE-3EFC-785BE0582331"].AccessRight === "11E6E7B0") //692D1B26-0F28-1FAE-3EFC-785BE0582331
                                                : (menuDetail["12E20EC5-2394-A2CC-70AE-93A65C7553BA"] && menuDetail["12E20EC5-2394-A2CC-70AE-93A65C7553BA"].AccessRight === "11E6E7B0")) ? true : false}
                                            type="select" name="CommissionHour" value={CommissionHour} id="CommissionHour" onChange={(e) => this.onChange(e)}>
                                            <IntlMessages id="sidebar.colCommissionHour">{(selCommissionHour) => <option value="">{selCommissionHour}</option>}</IntlMessages>
                                            {Array(24).fill(1).map((i, data) => (<option key={data} value={data + 1}>{data + 1}</option>))}
                                        </Input>
                                        {errors.CommissionHour && <span className="text-danger text-left"><IntlMessages id={errors.CommissionHour} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["B0DC4E6E-310F-4655-59CD-C42F30A462C6"] && menuDetail["B0DC4E6E-310F-4655-59CD-C42F30A462C6"].Visibility === "E925F86B") //B0DC4E6E-310F-4655-59CD-C42F30A462C6
                                : (menuDetail["D7019A3A-5579-4421-597F-8167B5FC3402"] && menuDetail["D7019A3A-5579-4421-597F-8167B5FC3402"].Visibility === "E925F86B")) && //D7019A3A-5579-4421-597F-8167B5FC3402
                                <FormGroup className="row">
                                    <Label for="CommissionTypeInterval" className="control-label col"><IntlMessages id="sidebar.colCommissionTypeInterval" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-8 col-xs-12">
                                        <Input
                                            disabled={(isEdit ? (menuDetail["B0DC4E6E-310F-4655-59CD-C42F30A462C6"] && menuDetail["B0DC4E6E-310F-4655-59CD-C42F30A462C6"].AccessRight === "11E6E7B0") //B0DC4E6E-310F-4655-59CD-C42F30A462C6
                                                : (menuDetail["D7019A3A-5579-4421-597F-8167B5FC3402"] && menuDetail["D7019A3A-5579-4421-597F-8167B5FC3402"].AccessRight === "11E6E7B0")) ? true : false}
                                            type="select" name="CommissionTypeInterval" value={CommissionTypeInterval} onChange={(e) => this.onChange(e)}>
                                            <IntlMessages id="sidebar.colCommissionTypeInterval">{(placeholder) => <option value="">{placeholder}</option>}</IntlMessages>
                                            {commissionTypeList.map((List) => (
                                                <IntlMessages key={List.id} id={List.label}>{(placeholder) => <option key={List.id} value={List.id}>{placeholder}</option>}</IntlMessages>
                                            ))}
                                        </Input>
                                        {errors.CommissionTypeInterval && <span className="text-danger text-left"><IntlMessages id={errors.CommissionTypeInterval} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["4FD06A70-2F51-2E0C-212F-53D75B9C73E4"] && menuDetail["4FD06A70-2F51-2E0C-212F-53D75B9C73E4"].Visibility === "E925F86B") //4FD06A70-2F51-2E0C-212F-53D75B9C73E4
                                : (menuDetail["B8EFCC6B-A1AF-9F39-4267-4A0494A8861B"] && menuDetail["B8EFCC6B-A1AF-9F39-4267-4A0494A8861B"].Visibility === "E925F86B")) && //B8EFCC6B-A1AF-9F39-4267-4A0494A8861B
                                <FormGroup className="row">
                                    <Label for="Description" className="control-label col" ><IntlMessages id="sidebar.description" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-8 col-xs-12">
                                        <IntlMessages id="sidebar.description">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={(isEdit ? (menuDetail["4FD06A70-2F51-2E0C-212F-53D75B9C73E4"] && menuDetail["4FD06A70-2F51-2E0C-212F-53D75B9C73E4"].AccessRight === "11E6E7B0") //4FD06A70-2F51-2E0C-212F-53D75B9C73E4
                                                        : (menuDetail["B8EFCC6B-A1AF-9F39-4267-4A0494A8861B"] && menuDetail["B8EFCC6B-A1AF-9F39-4267-4A0494A8861B"].AccessRight === "11E6E7B0")) ? true : false}
                                                    type="textarea" rows="3" name="Description" value={Description} placeholder={placeholder} id="Description" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.Description && <span className="text-danger text-left"><IntlMessages id={errors.Description} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["DC6638FD-3797-578A-502E-75F343380C9C"] && menuDetail["DC6638FD-3797-578A-502E-75F343380C9C"].Visibility === "E925F86B") //DC6638FD-3797-578A-502E-75F343380C9C
                                : (menuDetail["18410103-4A01-53A2-4AA3-1C0999F299FA"] && menuDetail["18410103-4A01-53A2-4AA3-1C0999F299FA"].Visibility === "E925F86B")) && //18410103-4A01-53A2-4AA3-1C0999F299FA
                                <FormGroup className="row">
                                    <Label for="Status" className="control-label col"><IntlMessages id="my_account.status" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-8 col-xs-12">
                                        <Input
                                            disabled={(isEdit ? (menuDetail["DC6638FD-3797-578A-502E-75F343380C9C"] && menuDetail["DC6638FD-3797-578A-502E-75F343380C9C"].AccessRight === "11E6E7B0") //DC6638FD-3797-578A-502E-75F343380C9C
                                                : (menuDetail["18410103-4A01-53A2-4AA3-1C0999F299FA"] && menuDetail["18410103-4A01-53A2-4AA3-1C0999F299FA"].AccessRight === "11E6E7B0")) ? true : false}
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
                            {Object.keys(menuDetail).length > 0 &&
                                <FormGroup row>
                                    <div className="offset-md-4 col-md-8 offset-sm-4 col-sm-8 col-xs-12">
                                        <div className="btn_area">
                                            <Button disabled={this.props.loading} variant="raised" color="primary" onClick={isEdit ? (e) => this.onEditAffiliateScheme(e) : (e) => this.onAddAffiliateScheme(e)}><IntlMessages id={isEdit ? "sidebar.btnEdit" : "sidebar.btnAdd"} /></Button>
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
AddEditAffiliateSchemeTypeMapping.defaultProps = {
    pagedata: {
        isEdit: false
    }
}

const mapToProps = ({ affiliateSchemeRdcer, affiliateSchemeTypeRdcer, walletTypeMaster, AffiliateSchemeTypeMapping, authTokenRdcer }) => {
    var Responce = {
        SchemeMasterIdlist: affiliateSchemeRdcer.list,
        SchemeTypeMasterIdlist: affiliateSchemeTypeRdcer.list,
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { walletTypesData } = walletTypeMaster;
    const { data, getData, loading } = AffiliateSchemeTypeMapping;
    return { Responce, walletTypesData, data, getData, loading, menuLoading, menu_rights };
}

export default connect(mapToProps, {
    getAffiliateSchemeList,
    getAffiliateSchemeTypeList,
    getWalletTypeMaster,
    addAffiliateSchemeTypeMapping,
    getAffiliateSchemeTypeMappingList,
    editAffiliateSchemeTypeMapping,
    getMenuPermissionByID
})(AddEditAffiliateSchemeTypeMapping);