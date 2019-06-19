/**
 * Create By Sanjay 
 * Created Date 21/02/2019
 * Component For Update Referral Reward Configuration
 */
import React, { Component } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Form, Input, Label, FormGroup } from "reactstrap";
import Button from "@material-ui/core/Button";
import { NotificationManager } from "react-notifications";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { updateReferralRewardConfig, getReferralRewardConfigData, getPayType, getServiceType, getCurrencyList } from "Actions/MyAccount";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { validateOnlyNumeric } from "../../../validation/pairConfiguration";
import validateConfigSetup from "../../../validation/MyAccount/configuration_setup"
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
class UpdateReferralRewardConfig extends Component {

    state = {
        open: false,
        data: {},
        currencyList: [],
        payTypeList: [],
        serviceTypeList: [],
        errors: "",
        flag: true,
        fieldList: {},
        menudetail: [],
        menuLoading: false,
        notificationFlag: true,
    };

    resetData = () => {
        this.setState({
            open: false,
            data: {},
            errors: "",
        });
        this.props.drawerClose();
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    };

    componentWillMount() {
        this.props.getMenuPermissionByID('AB9033B6-656B-2E8D-2414-9FE86EEA9670');

    }

    handleChange = (event) => {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    handleNumberChange = (event) => {
        let newObj = Object.assign({}, this.state.data);
        if (validateOnlyNumeric(event.target.value)) {
            newObj[event.target.name] = event.target.value;
            this.setState({ data: newObj });
        }
        else if (event.target.value === "") {
            newObj[event.target.name] = event.target.value;
            this.setState({ data: newObj });
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
    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading });

        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getCurrencyList();
                this.props.getPayType();
                this.props.getServiceType();
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        const reqObj = {
            PageIndex: 1,
            PAGE_SIZE: 10
        }
        if (nextProps.getReferralRewardConfigByIdData.ReturnCode === 0) {
            this.setState({ data: nextProps.getReferralRewardConfigByIdData.ReferralServiceObj });
        }
        if (nextProps.updateReferralRewardConfigData.ReturnCode === 0) {
            NotificationManager.success(<IntlMessages id="my_account.RewardUpdated" />);
            this.props.getReferralRewardConfigData(reqObj);
            this.resetData();
        } else if (nextProps.updateReferralRewardConfigData.ReturnCode === 1 && this.state.flag) {
            var errMsg = nextProps.updateReferralRewardConfigData.ErrorCode === 1 ? nextProps.updateReferralRewardConfigData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.updateReferralRewardConfigData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
            this.setState({ flag: false })
        }
        if (typeof nextProps.currencyList !== 'undefined' && nextProps.currencyList.length) {
            this.setState({ currencyList: nextProps.currencyList })
        }
        if (nextProps.payTypeData.ReturnCode === 0 && (nextProps.payTypeData.ReferralPayTypeDropDownList).length > 0) {
            this.setState({ payTypeList: nextProps.payTypeData.ReferralPayTypeDropDownList })
        }
        if (nextProps.serviceTypeData.ReturnCode === 0 && (nextProps.serviceTypeData.ReferralServiceTypeDropDownList).length > 0) {
            this.setState({ serviceTypeList: nextProps.serviceTypeData.ReferralServiceTypeDropDownList })
        }
    }

    OnEditReferralRewardConfig = (event) => {
        event.preventDefault();
        const { ReferMinCount, ReferMaxCount, RewardsPay, CurrencyId, ReferralPayTypeId, ReferralServiceTypeId, Description, ActiveDate, ExpireDate } = this.state.data;
        var reqObj = {
            RewardServiceType: ReferralServiceTypeId + "",
            RewardPayType: ReferralPayTypeId + "",
            RewardCurrency: CurrencyId + "",
            Description: Description,
            MinLimitRefer: ReferMinCount + "",
            MaxLimitRefer: ReferMaxCount + "",
            Reward: RewardsPay + "",
            ExpireDate: ExpireDate,
            ActiveDate: ActiveDate
        }
        const { errors, isValid } = validateConfigSetup(reqObj);
        this.setState({ errors: errors, flag: true });
        if (isValid) {
            this.props.updateReferralRewardConfig(this.state.data);
        }
    }

    render() {
        let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
        const { drawerClose, edit_loading } = this.props;
        const { errors, payTypeList, serviceTypeList } = this.state;
        const { ReferMinCount, ReferMaxCount, RewardsPay, CurrencyId, ReferralPayTypeId, ReferralServiceTypeId, Description, ActiveDate, ExpireDate } = this.state.data;
        var menuDetail = this.checkAndGetMenuAccessDetail('9FF9E2DB-8614-366E-036F-AFDDFB4C508B');
        if (!menuDetail) {
            menuDetail = { Utility: [], CrudOption: [] }
        }
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.editReferralRewardConfig" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || edit_loading) && <JbsSectionLoader />}
                <div className="jbs-page-content col-md-12 mx-auto">
                    <Form>
                        {(menuDetail["A37AA6B4-103E-6EC9-0294-342C2A139AEA"] && menuDetail["A37AA6B4-103E-6EC9-0294-342C2A139AEA"].Visibility === "E925F86B") && //A37AA6B4-103E-6EC9-0294-342C2A139AEA
                            <FormGroup row>
                                <Label for="ReferMinCount" className="control-label col text-left"><IntlMessages id="my_account.MinLimitRefer" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.MinLimitRefer">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["A37AA6B4-103E-6EC9-0294-342C2A139AEA"].AccessRight === "11E6E7B0") ? true : false} type="text" name="ReferMinCount" value={ReferMinCount} placeholder={placeholder} id="ReferMinCount" onChange={this.handleNumberChange} />
                                        }
                                    </IntlMessages>
                                    {errors.MinLimitRefer && (<span className="text-danger text-left"><IntlMessages id={errors.MinLimitRefer} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["1BFFFD7A-5A73-6468-3CBF-3E7B17D524C5"] && menuDetail["1BFFFD7A-5A73-6468-3CBF-3E7B17D524C5"].Visibility === "E925F86B") && //1BFFFD7A-5A73-6468-3CBF-3E7B17D524C5
                            <FormGroup row>
                                <Label for="ReferMaxCount" className="control-label col text-left"><IntlMessages id="my_account.MaxLimitRefer" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.MaxLimitRefer">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["1BFFFD7A-5A73-6468-3CBF-3E7B17D524C5"].AccessRight === "11E6E7B0") ? true : false} type="text" name="ReferMaxCount" value={ReferMaxCount} placeholder={placeholder} id="ReferMaxCount" onChange={this.handleNumberChange} />
                                        }
                                    </IntlMessages>
                                    {errors.MaxLimitRefer && (<span className="text-danger text-left"><IntlMessages id={errors.MaxLimitRefer} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["F1C10D6C-6AF8-2FA5-5043-8CA2568239D4"] && menuDetail["F1C10D6C-6AF8-2FA5-5043-8CA2568239D4"].Visibility === "E925F86B") && //F1C10D6C-6AF8-2FA5-5043-8CA2568239D4
                            <FormGroup row>
                                <Label for="RewardsPay" className="control-label col text-left"><IntlMessages id="my_account.Reward" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.Reward">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["F1C10D6C-6AF8-2FA5-5043-8CA2568239D4"].AccessRight === "11E6E7B0") ? true : false} type="text" name="RewardsPay" value={RewardsPay} placeholder={placeholder} id="RewardsPay" onChange={this.handleNumberChange} />
                                        }
                                    </IntlMessages>
                                    {errors.Reward && (<span className="text-danger text-left"><IntlMessages id={errors.Reward} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["21629E97-5CA7-5A01-0C1D-F91A27FE2C64"] && menuDetail["21629E97-5CA7-5A01-0C1D-F91A27FE2C64"].Visibility === "E925F86B") && //21629E97-5CA7-5A01-0C1D-F91A27FE2C64
                            <FormGroup row>
                                <Label for="CurrencyId" className="control-label col text-left"><IntlMessages id="my_account.RewardCurrency" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <Input disabled={(menuDetail["21629E97-5CA7-5A01-0C1D-F91A27FE2C64"].AccessRight === "11E6E7B0") ? true : false} type="select" name="CurrencyId" className="form-control" id="CurrencyId" value={CurrencyId} onChange={this.handleChange}>
                                        <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                        {this.props.currencyList.walletTypeMasters && this.props.currencyList.walletTypeMasters.map((currency, key) =>
                                            <option key={key} value={currency.Id}>{currency.CoinName}</option>
                                        )}
                                    </Input>
                                    {errors.RewardCurrency && (<span className="text-danger text-left"><IntlMessages id={errors.RewardCurrency} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["489D73A7-0C1D-05E1-311D-865F33E85505"] && menuDetail["489D73A7-0C1D-05E1-311D-865F33E85505"].Visibility === "E925F86B") && //489D73A7-0C1D-05E1-311D-865F33E85505
                            <FormGroup row>
                                <Label for="ReferralPayTypeId" className="control-label col text-left"><IntlMessages id="my_account.RewardPayType" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <Input disabled={(menuDetail["489D73A7-0C1D-05E1-311D-865F33E85505"].AccessRight === "11E6E7B0") ? true : false} type="select" name="ReferralPayTypeId" className="form-control" id="ReferralPayTypeId" value={ReferralPayTypeId} onChange={this.handleChange}>
                                        <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                        {payTypeList.map((type, key) =>
                                            <option key={key} value={type.Id}>{type.PayTypeName}</option>
                                        )}
                                    </Input>
                                    {errors.RewardPayType && (<span className="text-danger text-left"><IntlMessages id={errors.RewardPayType} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["870760A4-809A-0540-3D79-E4E4B4F46998"] && menuDetail["870760A4-809A-0540-3D79-E4E4B4F46998"].Visibility === "E925F86B") && //870760A4-809A-0540-3D79-E4E4B4F46998
                            <FormGroup row>
                                <Label for="ReferralServiceTypeId" className="control-label col text-left"><IntlMessages id="my_account.RewardServiceType" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <Input disabled={(menuDetail["870760A4-809A-0540-3D79-E4E4B4F46998"].AccessRight === "11E6E7B0") ? true : false} type="select" name="ReferralServiceTypeId" className="form-control" id="ReferralServiceTypeId" value={ReferralServiceTypeId} onChange={this.handleChange}>
                                        <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                        {serviceTypeList.map((type, key) =>
                                            <option key={key} value={type.Id}>{type.ServiceTypeName}</option>
                                        )}
                                    </Input>
                                    {errors.RewardServiceType && (<span className="text-danger text-left"><IntlMessages id={errors.RewardServiceType} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["3F8633C8-5130-0AB5-53A0-D80F31AF82FB"] && menuDetail["3F8633C8-5130-0AB5-53A0-D80F31AF82FB"].Visibility === "E925F86B") && //3F8633C8-5130-0AB5-53A0-D80F31AF82FB
                            <FormGroup row>
                                <Label for="Description" className="control-label col text-left"><IntlMessages id="my_account.Description" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.Description">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["3F8633C8-5130-0AB5-53A0-D80F31AF82FB"].AccessRight === "11E6E7B0") ? true : false} type="textarea" name="Description" value={Description} placeholder={placeholder} id="Description" onChange={this.handleChange} />
                                        }
                                    </IntlMessages>
                                    {errors.Description && (<span className="text-danger text-left"><IntlMessages id={errors.Description} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["C07F067D-754F-74FA-4377-48AC4D147834"] && menuDetail["C07F067D-754F-74FA-4377-48AC4D147834"].Visibility === "E925F86B") && //C07F067D-754F-74FA-4377-48AC4D147834
                            <FormGroup row>
                                <Label for="ActiveDate" className="control-label col text-left"><IntlMessages id="my_account.ActiveDate" /><span className="text-danger">*</span></Label>
                                {ActiveDate ?
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input disabled={(menuDetail["C07F067D-754F-74FA-4377-48AC4D147834"].AccessRight === "11E6E7B0") ? true : false} type="date" name="ActiveDate" id="ActiveDate" placeholder="dd/mm/yyyy" value={ActiveDate.split('T')[0]} onChange={this.handleChange} min={today} />
                                    </div>
                                    :
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input disabled={(menuDetail["C07F067D-754F-74FA-4377-48AC4D147834"].AccessRight === "11E6E7B0") ? true : false} type="date" name="ActiveDate" id="ActiveDate" placeholder="dd/mm/yyyy" value={ActiveDate} onChange={this.handleChange} min={today} />
                                        {errors.ActiveDate && (<span className="text-danger text-left"><IntlMessages id={errors.ActiveDate} /></span>)}
                                    </div>
                                }
                            </FormGroup>}
                        {(menuDetail["04657917-65D1-8172-7EBB-34EDFA2F1E93"] && menuDetail["04657917-65D1-8172-7EBB-34EDFA2F1E93"].Visibility === "E925F86B") && //04657917-65D1-8172-7EBB-34EDFA2F1E93
                            <FormGroup row>
                                <Label for="ExpireDate" className="control-label col text-left"><IntlMessages id="my_account.ExpireDate" /><span className="text-danger">*</span></Label>
                                {ExpireDate ?
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input disabled={(menuDetail["04657917-65D1-8172-7EBB-34EDFA2F1E93"].AccessRight === "11E6E7B0") ? true : false} type="date" name="ExpireDate" id="ExpireDate" placeholder="dd/mm/yyyy" value={ExpireDate.split('T')[0]} onChange={this.handleChange} min={today} />
                                    </div>
                                    :
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input disabled={(menuDetail["04657917-65D1-8172-7EBB-34EDFA2F1E93"].AccessRight === "11E6E7B0") ? true : false} type="date" name="ExpireDate" id="ExpireDate" placeholder="dd/mm/yyyy" value={ExpireDate} onChange={this.handleChange} min={today} />
                                        {errors.ExpireDate && (<span className="text-danger text-left"><IntlMessages id={errors.ExpireDate} /></span>)}
                                    </div>}
                            </FormGroup>}
                        {menuDetail &&
                            <FormGroup row>
                                <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                    <div className="btn_area">
                                        <Button disabled={edit_loading} variant="raised" className="btn-primary text-white" onClick={this.OnEditReferralRewardConfig}><IntlMessages id="button.update" /></Button>
                                        <Button variant="raised" className="ml-15 btn-danger text-white" onClick={this.resetData}><IntlMessages id="button.cancel" /></Button>
                                    </div>
                                </div>
                            </FormGroup>}
                    </Form>
                </div>
            </div>
        )
    }
}

const mapToProps = ({ ReferralRewardConfig, profileConfigurationRdcer, authTokenRdcer }) => {
    const { updateReferralRewardConfigData, getReferralRewardConfigByIdData, payTypeData, serviceTypeData, edit_loading } = ReferralRewardConfig;
    const { currencyList } = profileConfigurationRdcer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return {
        updateReferralRewardConfigData, payTypeData, serviceTypeData, currencyList, getReferralRewardConfigByIdData, edit_loading, menuLoading,
        menu_rights
    };
}

export default connect(mapToProps, {
    updateReferralRewardConfig,
    getReferralRewardConfigData,
    getCurrencyList,
    getPayType,
    getServiceType,
    getMenuPermissionByID
})(UpdateReferralRewardConfig);