/*
 * Created By Sanjay
 * Created Date 13/02/2019
 * Component for Add Referral ChannelType
 */
import React, { Component } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Form, Input, Label, FormGroup } from "reactstrap";
import Button from "@material-ui/core/Button";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import { addReferralChannelType } from "Actions/MyAccount";
import { validateOnlyNumeric } from "../../../validation/pairConfiguration";
//Validation
import validateChannelTypeForm from "Validations/MyAccount/add_referral_channelType"
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
class AddReferralChannelType extends Component {

    state = {
        open: false,
        data: {
            ChannelTypeName: '',
            HourlyLimit: "",
            DailyLimit: "",
            WeeklyLimit: "",
            MonthlyLimit: ""
        },
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
            data: {
                ChannelTypeName: '',
                HourlyLimit: "",
                DailyLimit: "",
                WeeklyLimit: "",
                MonthlyLimit: ""
            },
            errors: ""
        });
        this.props.drawerClose();
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('F43D69FC-990E-6111-41FC-2871AFB912B5');

    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    };

    handleChange = (event) => {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    };

    handleNumberChange = (event) => {
        let newObj = Object.assign({}, this.state.data);
        if (validateOnlyNumeric(event.target.value) || event.target.value === "") {
            newObj[event.target.name] = event.target.value;
            this.setState({ data: newObj });
        }
    }

    OnAddReferralChannelType = (event) => {
        event.preventDefault();
        const { errors, isValid } = validateChannelTypeForm(this.state.data);
        this.setState({ errors: errors, flag: true });
        if (isValid) {
            var reqObj = Object.assign({}, this.state.data);
            this.props.addReferralChannelType(reqObj);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading });

        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        if ((nextProps.addReferralChannelTypeData.ReturnCode === 1 && this.state.flag) || nextProps.addReferralChannelTypeData.ReturnCode === 9) {
            var errMsg = nextProps.addReferralChannelTypeData.ErrorCode === 1 ? nextProps.addReferralChannelTypeData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.addReferralChannelTypeData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
            this.setState({ flag: false })
        } else if (nextProps.addReferralChannelTypeData.ReturnCode === 0 && this.state.flag) {
            NotificationManager.success(<IntlMessages id="my_account.ChannelAdded" />);
            this.resetData();
            this.props.drawerClose();
            this.setState({ flag: false })
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
        const { drawerClose, loading } = this.props;
        const { errors } = this.state;
        const { ChannelTypeName, HourlyLimit, DailyLimit, WeeklyLimit, MonthlyLimit } = this.state.data;
        var menuDetail = this.checkAndGetMenuAccessDetail('1B822994-8433-7747-820A-D569BD243779');
        if (!menuDetail) {
            menuDetail = { Utility: [], CrudOption: [] }
        }
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="my_account.AddReferralChannelType" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                <div className="jbs-page-content col-md-12 mx-auto">
                    <Form className="tradefrm">
                        {(menuDetail["E2DB6085-7011-7DE3-2C0F-C5152D914F3F"] && menuDetail["E2DB6085-7011-7DE3-2C0F-C5152D914F3F"].Visibility === "E925F86B") && //E2DB6085-7011-7DE3-2C0F-C5152D914F3F
                            <FormGroup row>
                                <Label for="ChannelType" className="control-label col" ><IntlMessages id="my_account.ChannelType" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.ChannelType">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["E2DB6085-7011-7DE3-2C0F-C5152D914F3F"].AccessRight === "11E6E7B0") ? true : false} type="text" name="ChannelTypeName" maxLength="50" value={ChannelTypeName} placeholder={placeholder} id="ChannelTypeName" onChange={this.handleChange} />
                                        }
                                    </IntlMessages>
                                    {errors.ChannelTypeName && (<span className="text-danger"><IntlMessages id={errors.ChannelTypeName} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["71B043F4-7819-395D-2B6D-83D4CC012F21"] && menuDetail["71B043F4-7819-395D-2B6D-83D4CC012F21"].Visibility === "E925F86B") && //71B043F4-7819-395D-2B6D-83D4CC012F21
                            <FormGroup row>
                                <Label for="HourlyLimit" className="control-label col" ><IntlMessages id="my_account.HourlyLimit" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.HourlyLimit">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["71B043F4-7819-395D-2B6D-83D4CC012F21"].AccessRight === "11E6E7B0") ? true : false} type="text" name="HourlyLimit" value={HourlyLimit} placeholder={placeholder} id="HourlyLimit" onChange={this.handleNumberChange} />
                                        }
                                    </IntlMessages>
                                    {errors.HourlyLimit && (<span className="text-danger"><IntlMessages id={errors.HourlyLimit} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["4F772CB1-5F17-2271-0FC6-A348774E361C"] && menuDetail["4F772CB1-5F17-2271-0FC6-A348774E361C"].Visibility === "E925F86B") && //4F772CB1-5F17-2271-0FC6-A348774E361C
                            <FormGroup row>
                                <Label for="DailyLimit" className="control-label col" ><IntlMessages id="my_account.DailyLimit" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.DailyLimit">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["4F772CB1-5F17-2271-0FC6-A348774E361C"].AccessRight === "11E6E7B0") ? true : false} type="text" name="DailyLimit" value={DailyLimit} placeholder={placeholder} id="DailyLimit" onChange={this.handleNumberChange} />
                                        }
                                    </IntlMessages>
                                    {errors.DailyLimit && (<span className="text-danger"><IntlMessages id={errors.DailyLimit} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["3A97BCC1-732D-8508-4391-7A8825B99C51"] && menuDetail["3A97BCC1-732D-8508-4391-7A8825B99C51"].Visibility === "E925F86B") && //3A97BCC1-732D-8508-4391-7A8825B99C51
                            <FormGroup row>
                                <Label for="WeeklyLimit" className="control-label col" ><IntlMessages id="my_account.WeeklyLimit" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.WeeklyLimit">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["3A97BCC1-732D-8508-4391-7A8825B99C51"].AccessRight === "11E6E7B0") ? true : false} type="text" name="WeeklyLimit" value={WeeklyLimit} placeholder={placeholder} id="WeeklyLimit" onChange={this.handleNumberChange} />
                                        }
                                    </IntlMessages>
                                    {errors.WeeklyLimit && (<span className="text-danger"><IntlMessages id={errors.WeeklyLimit} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"] && menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].Visibility === "E925F86B") && //19975F03-5200-3CB9-A082-B5FFC0A742FE
                            <FormGroup row>
                                <Label for="MonthlyLimit" className="control-label col" ><IntlMessages id="my_account.MonthlyLimit" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.MonthlyLimit">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].AccessRight === "11E6E7B0") ? true : false} type="text" name="MonthlyLimit" value={MonthlyLimit} placeholder={placeholder} id="MonthlyLimit" onChange={this.handleNumberChange} />
                                        }
                                    </IntlMessages>
                                    {errors.MonthlyLimit && (<span className="text-danger"><IntlMessages id={errors.MonthlyLimit} /></span>)}
                                </div>
                            </FormGroup>}
                        {Object.keys(menuDetail).length > 0 &&
                            <FormGroup row>
                                <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                    <div className="btn_area">
                                        <Button disabled={loading} variant="raised" className="btn-primary text-white" onClick={this.OnAddReferralChannelType}><IntlMessages id="button.add" /></Button>
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

const mapToProps = ({ ReferralChannelTypeReducer, authTokenRdcer }) => {
    const { addReferralChannelTypeData, loading } = ReferralChannelTypeReducer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return {
        addReferralChannelTypeData, loading, menuLoading,
        menu_rights
    };

}

export default connect(mapToProps, {
    addReferralChannelType,
    getMenuPermissionByID
})(AddReferralChannelType);