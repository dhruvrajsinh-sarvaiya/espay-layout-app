/**
 * Create by Sanjay 
 * Created Date 20/02/2019
 * Component For Add Referrl Reward Service 
 */
import React, { Component } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Form, Input, Label, FormGroup } from "reactstrap";
import Button from "@material-ui/core/Button";
import { NotificationManager } from "react-notifications";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { addConfigurationSetup, getPayType, getServiceType, getCurrencyList } from "Actions/MyAccount";
import { validateOnlyNumeric } from "../../../validation/pairConfiguration";
import validateConfigSetup from "Validations/MyAccount/configuration_setup"
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
class AddReferralRewardConfig extends Component {
    state = {
        open: false,
        data: {
            MinLimitRefer: "",
            MaxLimitRefer: "",
            Reward: "",
            RewardCurrency: "",
            RewardPayType: "",
            RewardServiceType: "",
            Description: '',
            ActiveDate: "",
            ExpireDate: ""
        },
        currencyList: [],
        payTypeList: [],
        serviceTypeList: [],
        errors: "",
        flage: true,
        fieldList: {},
        menudetail: [],
        menuLoading: false,
        notificationFlag: true,

    }

    componentWillMount() {
        this.props.getMenuPermissionByID('1A3A4326-44FB-49E9-2979-F9AEB30D9AD7');

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
        if (typeof nextProps.currencyList !== 'undefined' && nextProps.currencyList.length) {
            this.setState({ currencyList: nextProps.currencyList })
        }
        if (nextProps.payTypeData.ReturnCode === 0 && (nextProps.payTypeData.ReferralPayTypeDropDownList).length > 0) {
            this.setState({ payTypeList: nextProps.payTypeData.ReferralPayTypeDropDownList })
        }
        if (nextProps.serviceTypeData.ReturnCode === 0 && (nextProps.serviceTypeData.ReferralServiceTypeDropDownList).length > 0) {
            this.setState({ serviceTypeList: nextProps.serviceTypeData.ReferralServiceTypeDropDownList })
        }
        if (nextProps.addConfigSetupData.ReturnCode === 0 && this.state.flage) {
            NotificationManager.success(<IntlMessages id="my_account.RewardAdded" />);
            this.resetData();
            this.setState({ flage: false })
        } else if (nextProps.addConfigSetupData.ReturnCode === 1 && this.state.flage) {
            var errMsg = nextProps.addConfigSetupData.ErrorCode === 1 ? nextProps.addConfigSetupData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.addConfigSetupData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
            this.setState({ flage: false })
        }
    }

    resetData = () => {
        this.setState({
            data: {
                MinLimitRefer: "",
                MaxLimitRefer: "",
                Reward: "",
                RewardCurrency: "",
                RewardPayType: "",
                RewardServiceType: "",
                Description: '',
                ActiveDate: "",
                ExpireDate: ""
            },
            errors: ""
        });
        this.props.drawerClose();
    }

    handleChange = (event) => {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    handleNumberChange = (event) => {
        let newObj = Object.assign({}, this.state.data);
        if (validateOnlyNumeric(event.target.value) || event.target.value === "") {
            newObj[event.target.name] = event.target.value;
            this.setState({ data: newObj });
        }
    }

    onClick = () => {
        this.setState({ open: this.state.open ? false : true })
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    OnAddConfigSetup = (event) => {
        event.preventDefault();
        const { errors, isValid } = validateConfigSetup(this.state.data);
        this.setState({ errors: errors, flage: true });
        if (isValid) {
            const { MinLimitRefer, MaxLimitRefer, Reward, RewardCurrency, RewardPayType, RewardServiceType, Description, ActiveDate, ExpireDate } = this.state.data;
            var reqObj = {
                ReferralServiceTypeId: RewardServiceType,
                ReferralPayTypeId: RewardPayType,
                CurrencyId: RewardCurrency,
                Description: Description,
                ReferMinCount: MinLimitRefer,
                ReferMaxCount: MaxLimitRefer,
                RewardsPay: Reward,
                ExpireDate: ExpireDate,
                ActiveDate: ActiveDate
            }
            this.props.addConfigurationSetup(reqObj);
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
        let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
        const { drawerClose, loading } = this.props;
        const { errors, payTypeList, serviceTypeList } = this.state;
        const { MinLimitRefer, MaxLimitRefer, Reward, RewardCurrency, RewardPayType, RewardServiceType, Description, ActiveDate, ExpireDate } = this.state.data;
        var menuDetail = this.checkAndGetMenuAccessDetail('B9970C9F-11E4-84E9-177C-04E263207B68');
        if (!menuDetail) {
            menuDetail = { Utility: [], CrudOption: [] }
        }
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="my_account.AddReferralRewardConfig" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                <div className="jbs-page-content col-md-12 mx-auto">
                    <Form className="tradefrm">
                        {(menuDetail["FAAFD15A-357B-96A2-3C74-B6A3DF2F8EE4"] && menuDetail["FAAFD15A-357B-96A2-3C74-B6A3DF2F8EE4"].Visibility === "E925F86B") &&   //FAAFD15A-357B-96A2-3C74-B6A3DF2F8EE4
                            <FormGroup row>
                                <Label for="MinLimitRefer" className="control-label col"><IntlMessages id="my_account.MinLimitRefer" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.MinLimitRefer">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["FAAFD15A-357B-96A2-3C74-B6A3DF2F8EE4"].AccessRight === "11E6E7B0") ? true : false} type="text" name="MinLimitRefer" value={MinLimitRefer} placeholder={placeholder} id="MinLimitRefer" onChange={this.handleNumberChange} />
                                        }
                                    </IntlMessages>
                                    {errors.MinLimitRefer && (<span className="text-danger"><IntlMessages id={errors.MinLimitRefer} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["7ACDD3F6-75DB-2766-6576-74333DC12BB7"] && menuDetail["7ACDD3F6-75DB-2766-6576-74333DC12BB7"].Visibility === "E925F86B") &&  //7ACDD3F6-75DB-2766-6576-74333DC12BB7
                            <FormGroup row>
                                <Label for="MaxLimitRefer" className="control-label col"><IntlMessages id="my_account.MaxLimitRefer" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.MaxLimitRefer">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["7ACDD3F6-75DB-2766-6576-74333DC12BB7"].AccessRight === "11E6E7B0") ? true : false} type="text" name="MaxLimitRefer" value={MaxLimitRefer} placeholder={placeholder} id="MaxLimitRefer" onChange={this.handleNumberChange} />
                                        }
                                    </IntlMessages>
                                    {errors.MaxLimitRefer && (<span className="text-danger"><IntlMessages id={errors.MaxLimitRefer} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["28255175-9761-4B4C-8F14-3B55AC771583"] && menuDetail["28255175-9761-4B4C-8F14-3B55AC771583"].Visibility === "E925F86B") &&  //28255175-9761-4B4C-8F14-3B55AC771583
                            <FormGroup row>
                                <Label for="Reward" className="control-label col"><IntlMessages id="my_account.Reward" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.Reward">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["28255175-9761-4B4C-8F14-3B55AC771583"].AccessRight === "11E6E7B0") ? true : false} type="text" name="Reward" value={Reward} placeholder={placeholder} id="Reward" onChange={this.handleNumberChange} />
                                        }
                                    </IntlMessages>
                                    {errors.Reward && (<span className="text-danger"><IntlMessages id={errors.Reward} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["F91B4664-808C-8EEA-2D8F-69B3124542AE"] && menuDetail["F91B4664-808C-8EEA-2D8F-69B3124542AE"].Visibility === "E925F86B") &&  //F91B4664-808C-8EEA-2D8F-69B3124542AE
                            <FormGroup row>
                                <Label for="RewardCurrency" className="control-label col"><IntlMessages id="my_account.RewardCurrency" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <Input disabled={(menuDetail["F91B4664-808C-8EEA-2D8F-69B3124542AE"].AccessRight === "11E6E7B0") ? true : false} type="select" name="RewardCurrency" className="form-control" id="RewardCurrency" value={RewardCurrency} onChange={this.handleChange}>
                                        <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                        {this.props.currencyList.walletTypeMasters && this.props.currencyList.walletTypeMasters.map((currency, key) =>
                                            <option key={key} value={currency.Id}>{currency.CoinName}</option>
                                        )}
                                    </Input>
                                    {errors.RewardCurrency && (<span className="text-danger"><IntlMessages id={errors.RewardCurrency} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["5BB4D48C-18FD-03F8-861D-9AC924D06317"] && menuDetail["5BB4D48C-18FD-03F8-861D-9AC924D06317"].Visibility === "E925F86B") &&  //5BB4D48C-18FD-03F8-861D-9AC924D06317
                            <FormGroup row>
                                <Label for="RewardPayType" className="control-label col"><IntlMessages id="my_account.RewardPayType" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <Input disabled={(menuDetail["5BB4D48C-18FD-03F8-861D-9AC924D06317"].AccessRight === "11E6E7B0") ? true : false} type="select" name="RewardPayType" className="form-control" id="RewardPayType" value={RewardPayType} onChange={this.handleChange}>
                                        <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                        {payTypeList.map((type, key) =>
                                            <option key={key} value={type.Id}>{type.PayTypeName}</option>
                                        )}
                                    </Input>
                                    {errors.RewardPayType && (<span className="text-danger"><IntlMessages id={errors.RewardPayType} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["FFF068CA-2DB5-8105-40D6-F3B7FD27083C"] && menuDetail["FFF068CA-2DB5-8105-40D6-F3B7FD27083C"].Visibility === "E925F86B") &&  //FFF068CA-2DB5-8105-40D6-F3B7FD27083C
                            <FormGroup row>
                                <Label for="RewardServiceType" className="control-label col"><IntlMessages id="my_account.RewardServiceType" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <Input disabled={(menuDetail["FFF068CA-2DB5-8105-40D6-F3B7FD27083C"].AccessRight === "11E6E7B0") ? true : false} type="select" name="RewardServiceType" className="form-control" id="RewardServiceType" value={RewardServiceType} onChange={this.handleChange}>
                                        <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                        {serviceTypeList.map((type, key) =>
                                            <option key={key} value={type.Id}>{type.ServiceTypeName}</option>
                                        )}
                                    </Input>
                                    {errors.RewardServiceType && (<span className="text-danger"><IntlMessages id={errors.RewardServiceType} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["6D87832E-5B9B-741B-2887-CEEA1C82785F"] && menuDetail["6D87832E-5B9B-741B-2887-CEEA1C82785F"].Visibility === "E925F86B") &&  //6D87832E-5B9B-741B-2887-CEEA1C82785F
                            <FormGroup row>
                                <Label for="Description" className="control-label col"><IntlMessages id="my_account.Description" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.Description">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["6D87832E-5B9B-741B-2887-CEEA1C82785F"].AccessRight === "11E6E7B0") ? true : false} type="textarea" name="Description" value={Description} placeholder={placeholder} id="Description" onChange={this.handleChange} />
                                        }
                                    </IntlMessages>
                                    {errors.Description && (<span className="text-danger"><IntlMessages id={errors.Description} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["52A31288-46D8-1232-2201-4F3268F7628D"] && menuDetail["52A31288-46D8-1232-2201-4F3268F7628D"].Visibility === "E925F86B") &&  //52A31288-46D8-1232-2201-4F3268F7628D
                            <FormGroup row>
                                <Label for="ActiveDate" className="control-label col"><IntlMessages id="my_account.ActiveDate" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <Input disabled={(menuDetail["52A31288-46D8-1232-2201-4F3268F7628D"].AccessRight === "11E6E7B0") ? true : false} type="date" name="ActiveDate" id="ActiveDate" placeholder="dd/mm/yyyy" value={ActiveDate} onChange={this.handleChange} min={today} />
                                    {errors.ActiveDate && (<span className="text-danger"><IntlMessages id={errors.ActiveDate} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["16EF5B9F-2465-04FE-5708-F7B957384589"] && menuDetail["16EF5B9F-2465-04FE-5708-F7B957384589"].Visibility === "E925F86B") &&  //16EF5B9F-2465-04FE-5708-F7B957384589
                            <FormGroup row>
                                <Label for="ExpireDate" className="control-label col"><IntlMessages id="my_account.ExpireDate" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <Input disabled={(menuDetail["16EF5B9F-2465-04FE-5708-F7B957384589"].AccessRight === "11E6E7B0") ? true : false} type="date" name="ExpireDate" id="ExpireDate" placeholder="dd/mm/yyyy" value={ExpireDate} onChange={this.handleChange} min={ActiveDate} />
                                    {errors.ExpireDate && (<span className="text-danger"><IntlMessages id={errors.ExpireDate} /></span>)}
                                </div>
                            </FormGroup>}
                        {Object.keys(menuDetail).length > 0 &&
                            <FormGroup row>
                                <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                    <div className="btn_area">
                                        <Button disabled={loading} variant="raised" className="btn-primary text-white" onClick={this.OnAddConfigSetup}><IntlMessages id="button.add" /></Button>
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
    const { addConfigSetupData, payTypeData, serviceTypeData, loading } = ReferralRewardConfig;
    const { currencyList } = profileConfigurationRdcer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return {
        addConfigSetupData, payTypeData, serviceTypeData, currencyList, loading, menuLoading,
        menu_rights
    };

}

export default connect(mapToProps, {
    addConfigurationSetup,
    getCurrencyList,
    getPayType,
    getServiceType,
    getMenuPermissionByID
})(AddReferralRewardConfig);