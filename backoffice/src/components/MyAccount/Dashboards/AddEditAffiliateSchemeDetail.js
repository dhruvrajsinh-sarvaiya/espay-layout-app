/* 
    Developer : Saloni Rathod
    Date : 28-03-2019
    File Comment : MyAccount Add/Edit Affiliate Scheme Detail Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import "rc-drawer/assets/index.css";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { addAffiliateSchemeDetail, editAffiliateSchemeDetail, getAffiliateSchemeDetailList, getAffiliateSchemeDetailById, getAffiliateSchemeTypeMappingList } from "Actions/MyAccount";
import { getWalletTypeMaster } from "Actions/WalletTypes";
import { getSchemeStatus, getCommissionType, getDistributionType } from 'Helpers/helpers';
import validateAffiliateSchemeDetail from 'Validations/MyAccount/affiliate_Scheme_Detail';
import AppConfig from 'Constants/AppConfig';
import Select from "react-select";
import $ from 'jquery';
import {
    
    getMenuPermissionByID
} from 'Actions/MyAccount';
//Component for MyAccount Add/Edit Affiliate Scheme Detail Dashboard
class AddEditAffiliateSchemeDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: {
                DetailId: this.props.DetailId,
                MinimumValue: '',
                MaximumValue: '',
                CommissionValue: '',
                CreditWalletTypeId: '',
                CommissionType: '',
                DistributionType: '',
                CreditWalletTypeName: null,
                Status: '',
                TrnWalletTypeId: '',
                TrnWalletTypeName: null,
                SchemeMappingId: '',
                SchemeMappingName: null,
                Level: '0',
                SchemeMasterId: '',
            },
            pageData: {
                PageNo: 0,
                PageSize: AppConfig.totalRecordDisplayInList
            },
            walletList: [],
            mappingList: [],
            isAddData: false,
            errors: "",
            // fieldList: {},
            menudetail: [],
            notification: true,
        };
        this.initState = this.state.data;
    }

    //reset data
    resetData() {
        this.setState({ data: this.initState, CreditWalletTypeName: null, TrnWalletTypeName: null, errors: '' });
        this.props.drawerClose();
        this.setState({ menudetail: this.state.menudetail })
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

    onSchemeMappingChange() {
        var schmemappingId = $('#SchemeMappingId :selected').val();
        var masterId = $('#SchemeMappingId :selected').attr('data-masterid');
        this.setState({
            data: {
                ...this.state.data,
                SchemeMappingId: schmemappingId,
                SchemeMasterId: masterId
            }
        })
    }

    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.pagedata.isEdit ? '0221cf1d-52b9-04d9-9cbb-cee35abf5f8b' : '64F62E1B-5F56-3FFC-6A20-A88FD9BF2D76');
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });
        // added by vishva
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getAffiliateSchemeTypeMappingList(this.state.pageData)
                this.props.getWalletTypeMaster();
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notification: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        //Get scheme type mapping Id
        if (nextProps.list.hasOwnProperty('AffiliateSchemeTypeMappingList') && Object.keys(nextProps.list.AffiliateSchemeTypeMappingList).length > 0) {
            this.setState({ mappingList: nextProps.list.AffiliateSchemeTypeMappingList });
        }

        //Get wallet type data
        if (nextProps.walletTypesData.hasOwnProperty('walletTypeMasters') && Object.keys(nextProps.walletTypesData.walletTypeMasters).length > 0) {
            this.setState({ walletList: nextProps.walletTypesData.walletTypeMasters });
        }

        //Get Module Data By Id
        if (nextProps.getData.hasOwnProperty('Data') && Object.keys(nextProps.getData.Data).length > 0 && this.props.pagedata.isEdit) {
            this.setState({ data: nextProps.getData.Data });
        }

        if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) {
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.data.ReturnCode === 0 && this.state.isAddData) {
            this.setState({ isAddData: false });
            this.props.getAffiliateSchemeDetailList(this.state.pageData);
            var sucMsg = nextProps.data.ErrorCode === 0 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
            this.resetData();
        }

    }

    //Add Module method...
    onAddModule(event) {
        event.preventDefault();
        if (this.state.data.SchemeMasterId !== '1') {
            this.setState({
                data: {
                    ...this.state.data,
                    Level: 0
                }
            })
        }
        setTimeout(() => {
            const { errors, isValid } = validateAffiliateSchemeDetail(this.state.data)
            this.setState({ errors: errors });
            if (isValid) {
                this.setState({ isAddData: true });
                let newObj = Object.assign({}, this.state.data);
                delete newObj['DistributionTypeName']
                delete newObj['CreditWalletTypeName']
                delete newObj['TrnWalletTypeName']
                delete newObj['TrnWalletTypeName']
                delete newObj['SchemeMasterId']
                delete newObj['SchemeMappingName']
                this.props.addAffiliateSchemeDetail(newObj);
            }
        }, 100);
    }

    //Edit Module method...
    onEditModule(event) {
        event.preventDefault();
        if (this.state.data.SchemeMasterId !== '1') {
            this.setState({
                data: {
                    ...this.state.data,
                    Level: 0
                }
            })
        }
        setTimeout(() => {
            const { errors, isValid } = validateAffiliateSchemeDetail(this.state.data);
            this.setState({ errors: errors });
            if (isValid) {
                this.setState({ isAddData: true });
                let newObj = Object.assign({}, this.state.data);
                delete newObj['DistributionTypeName']
                delete newObj['CreditWalletTypeName']
                delete newObj['TrnWalletTypeName']
                delete newObj['TrnWalletTypeName']
                delete newObj['SchemeMasterId']
                delete newObj['SchemeMappingName']
                this.props.editAffiliateSchemeDetail(newObj);

            }
        }, 100);
    }


    onChangeSelectCreditWalletTypeId(event) {
        event === null && (event = { label: null, value: "" });
        var newObj = Object.assign({}, this.state.data);
        newObj.CreditWalletTypeId = event.value;
        newObj.CreditWalletTypeName = event.label;
        this.setState({ data: newObj })
    }
    onChangeSelectTrnWalletTypeId(event) {
        event === null && (event = { label: null, value: "" });
        var newObj = Object.assign({}, this.state.data);
        newObj.TrnWalletTypeId = event.value;
        newObj.TrnWalletTypeName = event.label;
        this.setState({ data: newObj })
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
        const { errors, walletList, mappingList } = this.state;
        const { MinimumValue, Status, MaximumValue, CommissionValue, SchemeMasterId, SchemeMappingId, TrnWalletTypeName, CommissionType, Level, SchemeMappingName, DistributionType, CreditWalletTypeName } = this.state.data;
        const statusList = getSchemeStatus();
        const Commissiontypes = getCommissionType();
        const DistributionTypes = getDistributionType();
        var menuDetail = this.checkAndGetMenuAccessDetail(isEdit ? 'CFC0561B-6C97-1460-7118-3B46241372F7' : 'F463747D-74A7-69DE-934E-7FF19A791E52');
        return (
            <Fragment>
                {this.props.menuLoading && <JbsSectionLoader />}
                {this.props.loading && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id={isEdit ? "sidebar.editAffiliateSchemeDetail" : "sidebar.addAffiliateSchemeDetail"} />} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="jbs-page-content col-md-12 mx-auto">
                        <Form className="tradefrm">
                            {(isEdit ? (menuDetail["CD0C1323-7C2D-8914-425D-13133EB79AEC"] && menuDetail["CD0C1323-7C2D-8914-425D-13133EB79AEC"].Visibility === "E925F86B") //CD0C1323-7C2D-8914-425D-13133EB79AEC
                                : (menuDetail["FC784391-7428-6D67-987C-82B3817A7790"] && menuDetail["FC784391-7428-6D67-987C-82B3817A7790"].Visibility === "E925F86B")) && //FC784391-7428-6D67-987C-82B3817A7790
                                <FormGroup className="row">
                                    <Label for="MinimumValue" className="control-label col" ><IntlMessages id="sidebar.colMinimumValue" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-8 col-xs-12">
                                        <IntlMessages id="sidebar.enterMinimumValue">
                                            {(placeholder) =>
                                                <Input
                                                disabled={((isEdit ? (menuDetail["CD0C1323-7C2D-8914-425D-13133EB79AEC"] && menuDetail["CD0C1323-7C2D-8914-425D-13133EB79AEC"].AccessRight === "11E6E7B0")
                                : (menuDetail["FC784391-7428-6D67-987C-82B3817A7790"] && menuDetail["FC784391-7428-6D67-987C-82B3817A7790"].AccessRight === "11E6E7B0"))) ? true : false}
                                                type="text" name="MinimumValue" value={MinimumValue} placeholder={placeholder} id="MinimumValue" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.MinimumValue && <span className="text-danger text-left"><IntlMessages id={errors.MinimumValue} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["1505C287-9B22-39CE-7FAE-34CDEB2437CD"] && menuDetail["1505C287-9B22-39CE-7FAE-34CDEB2437CD"].Visibility === "E925F86B") //1505C287-9B22-39CE-7FAE-34CDEB2437CD
                                : (menuDetail["FA885E63-6CE5-A0A6-5914-A656895714B6"] && menuDetail["FA885E63-6CE5-A0A6-5914-A656895714B6"].Visibility === "E925F86B")) && //FA885E63-6CE5-A0A6-5914-A656895714B6
                                <FormGroup className="row">
                                    <Label for="MaximumValue" className="control-label col" ><IntlMessages id="sidebar.colMaximumValue" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-8 col-xs-12">
                                        <IntlMessages id="sidebar.enterMaximumValue">
                                            {(placeholder) =>
                                                <Input
                                                disabled={((isEdit ? (menuDetail["1505C287-9B22-39CE-7FAE-34CDEB2437CD"] && menuDetail["1505C287-9B22-39CE-7FAE-34CDEB2437CD"].AccessRight === "11E6E7B0")
                                : (menuDetail["FA885E63-6CE5-A0A6-5914-A656895714B6"] && menuDetail["FA885E63-6CE5-A0A6-5914-A656895714B6"].AccessRight === "11E6E7B0"))) ? true : false}
                                                type="text" name="MaximumValue" value={MaximumValue} placeholder={placeholder} id="MaximumValue" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.MaximumValue && <span className="text-danger text-left"><IntlMessages id={errors.MaximumValue} /></span>}
                                    </div>
                                </FormGroup>}
                            {(SchemeMasterId === '' || SchemeMasterId === '1' || SchemeMasterId === 1) &&
                                (isEdit ? (menuDetail["69DBF242-6CF5-45E3-41FD-FDF3728535D6"] && menuDetail["69DBF242-6CF5-45E3-41FD-FDF3728535D6"].Visibility === "E925F86B") //69DBF242-6CF5-45E3-41FD-FDF3728535D6
                                    : (menuDetail["A7C701C8-5444-5132-9AAD-0D1786601951"] && menuDetail["A7C701C8-5444-5132-9AAD-0D1786601951"].Visibility === "E925F86B")) && //A7C701C8-5444-5132-9AAD-0D1786601951
                                <FormGroup className="row">
                                    <Label for="Level" className="control-label col" ><IntlMessages id="sidebar.colAffiliateLevel" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-8 col-xs-12 ">
                                        <IntlMessages id="sidebar.enterLevel">
                                            {(placeholder) =>
                                                <Input
                                                disabled={((isEdit ? (menuDetail["69DBF242-6CF5-45E3-41FD-FDF3728535D6"] && menuDetail["69DBF242-6CF5-45E3-41FD-FDF3728535D6"].AccessRight === "11E6E7B0")
                                    : (menuDetail["A7C701C8-5444-5132-9AAD-0D1786601951"] && menuDetail["A7C701C8-5444-5132-9AAD-0D1786601951"].AccessRight === "11E6E7B0"))) ? true : false}
                                                type="text" name="Level" value={Level} placeholder={placeholder} id="Level" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.Level && <span className="text-danger text-left"><IntlMessages id={errors.Level} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["F164558B-40BC-351E-5560-454623CA0266"] && menuDetail["F164558B-40BC-351E-5560-454623CA0266"].Visibility === "E925F86B") //F164558B-40BC-351E-5560-454623CA0266
                                : (menuDetail["C1B0B6B1-3625-A191-8ED7-4B6374C1A1E9"] && menuDetail["C1B0B6B1-3625-A191-8ED7-4B6374C1A1E9"].Visibility === "E925F86B")) && //C1B0B6B1-3625-A191-8ED7-4B6374C1A1E9
                                <FormGroup className="row">
                                    <Label for="SchemeMappingId" className="control-label col "><IntlMessages id="sidebar.schemeMappingName" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-8 col-xs-12">
                                        <Input
                                        disabled={((isEdit ? (menuDetail["F164558B-40BC-351E-5560-454623CA0266"] && menuDetail["F164558B-40BC-351E-5560-454623CA0266"].AccessRight === "11E6E7B0")
                                : (menuDetail["C1B0B6B1-3625-A191-8ED7-4B6374C1A1E9"] && menuDetail["C1B0B6B1-3625-A191-8ED7-4B6374C1A1E9"].AccessRight === "11E6E7B0"))) ? true : false}
                                        type="select" name="SchemeMappingId" value={SchemeMappingId} id="SchemeMappingId" onChange={() => this.onSchemeMappingChange()}>
                                            <IntlMessages id="sidebar.selSchemeMappingId">{(selStatus) => <option value="">{selStatus}</option>}</IntlMessages>
                                            {mappingList.map((sList, index) => (
                                                <option key={index} value={sList.MappingId} data-masterid={sList.SchemeMasterId} >{sList.Description}</option>
                                            ))}
                                        </Input>
                                        {errors.SchemeMappingId && <span className="text-danger text-left"><IntlMessages id={errors.SchemeMappingId} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["7E6D7679-9472-217A-09E8-5FB4FEE41018"] && menuDetail["7E6D7679-9472-217A-09E8-5FB4FEE41018"].Visibility === "E925F86B") //7E6D7679-9472-217A-09E8-5FB4FEE41018
                                : (menuDetail["292FD4B6-3796-29BF-5FEB-A17120441ACB"] && menuDetail["292FD4B6-3796-29BF-5FEB-A17120441ACB"].Visibility === "E925F86B")) && //292FD4B6-3796-29BF-5FEB-A17120441ACB
                                <FormGroup className="row">
                                    <Label for="CommissionValue" className="control-label col" ><IntlMessages id="sidebar.colCommissionValue" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-8 col-xs-12">
                                        <IntlMessages id="sidebar.enterCommissionValue">
                                            {(placeholder) =>
                                                <Input
                                                disabled={((isEdit ? (menuDetail["7E6D7679-9472-217A-09E8-5FB4FEE41018"] && menuDetail["7E6D7679-9472-217A-09E8-5FB4FEE41018"].AccessRight === "11E6E7B0")
                                : (menuDetail["292FD4B6-3796-29BF-5FEB-A17120441ACB"] && menuDetail["292FD4B6-3796-29BF-5FEB-A17120441ACB"].AccessRight === "11E6E7B0"))) ? true : false}
                                                type="text" name="CommissionValue" value={CommissionValue} placeholder={placeholder} id="CommissionValue" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.CommissionValue && <span className="text-danger text-left"><IntlMessages id={errors.CommissionValue} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["1987ADB8-9267-8531-4A82-0623C58E5AD5"] && menuDetail["1987ADB8-9267-8531-4A82-0623C58E5AD5"].Visibility === "E925F86B") //1987ADB8-9267-8531-4A82-0623C58E5AD5
                                : (menuDetail["5C5F9EA8-A14B-521A-10B8-04853C9B776D"] && menuDetail["5C5F9EA8-A14B-521A-10B8-04853C9B776D"].Visibility === "E925F86B")) && //5C5F9EA8-A14B-521A-10B8-04853C9B776D
                                <FormGroup className="row" >
                                    <Label for="CreditWalletTypeId" className="control-label col "><IntlMessages id="sidebar.creditWalletTypeId" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-8 col-xs-12">
                                        <Select className="r_sel_20"
                                            value={this.state.data.CreditWalletTypeName === null ? null : ({ label: CreditWalletTypeName })}
                                            options={walletList.map((user) => ({
                                                value: user.Id,
                                                label: user.CoinName
                                            }))}
                                            isDisabled={((isEdit ? (menuDetail["1987ADB8-9267-8531-4A82-0623C58E5AD5"] && menuDetail["1987ADB8-9267-8531-4A82-0623C58E5AD5"].AccessRight === "11E6E7B0")
                                : (menuDetail["5C5F9EA8-A14B-521A-10B8-04853C9B776D"] && menuDetail["5C5F9EA8-A14B-521A-10B8-04853C9B776D"].AccessRight === "11E6E7B0"))) ? true : false}
                                            onChange={(e) => this.onChangeSelectCreditWalletTypeId(e)}
                                            maxMenuHeight={200}
                                            isClearable={true}
                                            placeholder={<IntlMessages id="sidebar.searchdot" />}
                                        />
                                        {errors.CreditWalletTypeId && <span className="text-danger text-left"><IntlMessages id={errors.CreditWalletTypeId} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["58136FF4-7134-4E42-781C-A405AB199E7C"] && menuDetail["58136FF4-7134-4E42-781C-A405AB199E7C"].Visibility === "E925F86B") //58136FF4-7134-4E42-781C-A405AB199E7C
                                : (menuDetail["2CB692FF-4FB1-4DEB-3040-F7A8F4B716FE"] && menuDetail["2CB692FF-4FB1-4DEB-3040-F7A8F4B716FE"].Visibility === "E925F86B")) && //2CB692FF-4FB1-4DEB-3040-F7A8F4B716FE
                                <FormGroup className="row" >
                                    <Label for="TrnWalletTypeId" className="control-label col"><IntlMessages id="sidebar.trnWalletTypeName" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-8 col-xs-12">
                                        <Select className="r_sel_20"
                                            value={this.state.data.TrnWalletTypeName === null ? null : ({ label: TrnWalletTypeName })}
                                            options={walletList.map((user) => ({
                                                value: user.Id,
                                                label: user.CoinName
                                            }))}
                                            isDisabled={((isEdit ? (menuDetail["58136FF4-7134-4E42-781C-A405AB199E7C"] && menuDetail["58136FF4-7134-4E42-781C-A405AB199E7C"].AccessRight === "11E6E7B0")
                                : (menuDetail["2CB692FF-4FB1-4DEB-3040-F7A8F4B716FE"] && menuDetail["2CB692FF-4FB1-4DEB-3040-F7A8F4B716FE"].AccessRight === "11E6E7B0"))) ? true : false}
                                            onChange={(e) => this.onChangeSelectTrnWalletTypeId(e)}
                                            isClearable={true}
                                            maxMenuHeight={200}
                                            placeholder={<IntlMessages id="sidebar.searchdot" />}
                                        />
                                        {errors.TrnWalletTypeId && <span className="text-danger text-left"><IntlMessages id={errors.TrnWalletTypeId} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["ECA5EAA2-4FB5-9B61-73D2-A61E2CD288D9"] && menuDetail["ECA5EAA2-4FB5-9B61-73D2-A61E2CD288D9"].Visibility === "E925F86B") //ECA5EAA2-4FB5-9B61-73D2-A61E2CD288D9
                                : (menuDetail["6875384E-99EC-A62D-8869-9CA49AE5A183"] && menuDetail["6875384E-99EC-A62D-8869-9CA49AE5A183"].Visibility === "E925F86B")) && //6875384E-99EC-A62D-8869-9CA49AE5A183
                                <FormGroup className="row">
                                    <Label for="DistributionType" className="control-label col "><IntlMessages id="sidebar.DistributionType" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-8 col-xs-12">
                                        <Input
                                        disabled={((isEdit ? (menuDetail["ECA5EAA2-4FB5-9B61-73D2-A61E2CD288D9"] && menuDetail["ECA5EAA2-4FB5-9B61-73D2-A61E2CD288D9"].AccessRight === "11E6E7B0")
                                : (menuDetail["6875384E-99EC-A62D-8869-9CA49AE5A183"] && menuDetail["6875384E-99EC-A62D-8869-9CA49AE5A183"].AccessRight === "11E6E7B0"))) ? true : false}
                                        type="select" name="DistributionType" value={DistributionType} id="DistributionType" onChange={(e) => this.onChange(e)}>
                                            <IntlMessages id="sidebar.selDistributionType">{(selStatus) => <option value="">{selStatus}</option>}</IntlMessages>
                                            {DistributionTypes.map((sList, index) => (
                                                (<IntlMessages key={index} id={sList.label}>{(placeholder) => <option value={sList.id}>{placeholder}</option>}</IntlMessages>)
                                            ))}
                                        </Input>
                                        {errors.DistributionType && <span className="text-danger text-left"><IntlMessages id={errors.DistributionType} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["E76CEBDC-6042-8B3C-248D-1112DEE2462F"] && menuDetail["E76CEBDC-6042-8B3C-248D-1112DEE2462F"].Visibility === "E925F86B") //E76CEBDC-6042-8B3C-248D-1112DEE2462F
                                : (menuDetail["EDCFB5CA-7195-02A3-141C-9BC5642A9FA3"] && menuDetail["EDCFB5CA-7195-02A3-141C-9BC5642A9FA3"].Visibility === "E925F86B")) && //EDCFB5CA-7195-02A3-141C-9BC5642A9FA3
                                <FormGroup className="row">
                                    <Label for="CommissionType" className="control-label col "><IntlMessages id="sidebar.colCommissionType" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-8 col-xs-12">
                                        <Input
                                        disabled={((isEdit ? (menuDetail["E76CEBDC-6042-8B3C-248D-1112DEE2462F"] && menuDetail["E76CEBDC-6042-8B3C-248D-1112DEE2462F"].AccessRight === "11E6E7B0")
                                : (menuDetail["EDCFB5CA-7195-02A3-141C-9BC5642A9FA3"] && menuDetail["EDCFB5CA-7195-02A3-141C-9BC5642A9FA3"].AccessRight === "11E6E7B0"))) ? true : false}
                                        type="select" name="CommissionType" value={CommissionType} id="CommissionType" onChange={(e) => this.onChange(e)}>
                                            <IntlMessages id="sidebar.selCommissionType">{(selCommissionType) => <option value="">{selCommissionType}</option>}</IntlMessages>
                                            {Commissiontypes.map((sList, index) => (
                                                (isEdit || sList.id !== 9) &&
                                                (<IntlMessages key={index} id={sList.label}>{(placeholder) => <option value={sList.id}>{placeholder}</option>}</IntlMessages>)
                                            ))}
                                        </Input>
                                        {errors.CommissionType && <span className="text-danger text-left"><IntlMessages id={errors.CommissionType} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["5D1096D1-8B33-4F58-0E4E-FD9F3E346C6F"] && menuDetail["5D1096D1-8B33-4F58-0E4E-FD9F3E346C6F"].Visibility === "E925F86B") //5D1096D1-8B33-4F58-0E4E-FD9F3E346C6F
                                : (menuDetail["55D9ED6C-74F6-765E-2021-72F4325B4772"] && menuDetail["55D9ED6C-74F6-765E-2021-72F4325B4772"].Visibility === "E925F86B")) && //55D9ED6C-74F6-765E-2021-72F4325B4772
                                <FormGroup className="row">
                                    <Label for="Status" className="control-label col "><IntlMessages id="my_account.status" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-8 col-xs-12">
                                        <Input
                                        disabled={((isEdit ? (menuDetail["5D1096D1-8B33-4F58-0E4E-FD9F3E346C6F"] && menuDetail["5D1096D1-8B33-4F58-0E4E-FD9F3E346C6F"].AccessRight === "11E6E7B0")
                                : (menuDetail["55D9ED6C-74F6-765E-2021-72F4325B4772"] && menuDetail["55D9ED6C-74F6-765E-2021-72F4325B4772"].AccessRight === "11E6E7B0"))) ? true : false}
                                        type="select" name="Status" value={Status} id="Status" onChange={(e) => this.onChange(e)}>
                                            <IntlMessages id="sidebar.selStatus">{(selStatus) => <option value="">{selStatus}</option>}</IntlMessages>
                                            {statusList.map((sList, index) => (
                                                (isEdit || sList.id !== 9) &&
                                                (<IntlMessages key={index} id={sList.label}>{(placeholder) => <option value={sList.id}>{placeholder}</option>}</IntlMessages>)
                                            ))}
                                        </Input>
                                        {errors.Status && <span className="text-danger text-left"><IntlMessages id={errors.Status} /></span>}
                                    </div>
                                </FormGroup>}
                            {menuDetail &&
                                <FormGroup row>
                                    <div className="offset-md-4 col-md-8 offset-sm-4 col-sm-8 col-xs-12">
                                        <div className="btn_area">
                                            <Button disabled={this.props.loading} variant="raised" color="primary" onClick={isEdit ? (e) => this.onEditModule(e) : (e) => this.onAddModule(e)}><IntlMessages id={isEdit ? "sidebar.btnEdit" : "sidebar.btnAdd"} /></Button>
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
AddEditAffiliateSchemeDetail.defaultProps = {
    DetailId: "0",
    Level: "0",
    pagedata: {
        isEdit: false
    }
}

const mapToProps = ({ affiliateSchemeDetailReducer, walletTypeMaster, AffiliateSchemeTypeMapping ,authTokenRdcer}) => {
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { data, getData, loading } = affiliateSchemeDetailReducer;
    const { walletTypesData } = walletTypeMaster;
    const { list } = AffiliateSchemeTypeMapping;
    return { data, getData, loading, walletTypesData, list ,menuLoading,menu_rights};
}

export default connect(mapToProps, {
    getWalletTypeMaster,
    addAffiliateSchemeDetail,
    getAffiliateSchemeDetailList,
    editAffiliateSchemeDetail,
    getAffiliateSchemeDetailById,
    getAffiliateSchemeTypeMappingList,
    getMenuPermissionByID
})(AddEditAffiliateSchemeDetail);