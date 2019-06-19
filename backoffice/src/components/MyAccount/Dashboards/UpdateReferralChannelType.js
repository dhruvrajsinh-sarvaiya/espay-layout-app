/**
 * Created By Sanjay
 * Created Date 13/02/2019
 * Component For Update Referral ChannelType
 */
import React, { Component } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Form, Input, Label, FormGroup } from "reactstrap";
import Button from "@material-ui/core/Button";
import { NotificationManager } from "react-notifications";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { updateReferralChannelType, getReferralChannelTypeData } from "Actions/MyAccount";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { validateOnlyNumeric } from "../../../validation/pairConfiguration";
//Validation
import validateChannelTypeForm from "../../../validation/MyAccount/add_referral_channelType"
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
class UpdateReferralChannelType extends Component {
    state = {
        open: false,
        data: {},
        errors: "",
        flag: true,
        fieldList: {},
        menudetail: [],
        menuLoading: false,
        notificationFlag: true,
    };

    componentWillMount() {
        this.props.getMenuPermissionByID('58C0BCF3-8F91-2109-4812-5CC8B42376C8');

    }

    resetData = () => {
        this.setState({
            open: false,
            data: {},
            errors: ""
        });
        this.props.drawerClose();
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    };

    handleChange = (event) => {
        this.setState({
            data: {
                ...this.state.data,
                [event.target.name]: event.target.value
            }
        });
    }

    handleNumberChange = (event) => {
        if (validateOnlyNumeric(event.target.value)) {
            this.setState({
                data: {
                    ...this.state.data,
                    [event.target.name]: event.target.value
                }
            });
        }
        else if (event.target.value === "") {
            this.setState({
                data: {
                    ...this.state.data,
                    [event.target.name]: event.target.value
                }
            });
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
        if (nextProps.getReferralChannelTypeDataById.ReturnCode === 0) {
            this.setState({ data: nextProps.getReferralChannelTypeDataById.ReferralChannelTypeObj });
        }
        if (nextProps.editReferralChannelTypeData.ReturnCode === 0) {
            NotificationManager.success(<IntlMessages id="my_account.ChannelUpdated" />);
            this.props.getReferralChannelTypeData();
            this.resetData();
        } else if (nextProps.editReferralChannelTypeData.ReturnCode === 1 && this.state.flag) {
            var errMsg = nextProps.editReferralChannelTypeData.ErrorCode === 1 ? nextProps.editReferralChannelTypeData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.editReferralChannelTypeData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
            this.setState({ flag: false })
        }
    }

    OnEditReferralChannelType = (event) => {
        event.preventDefault();
        const { ChannelTypeName, HourlyLimit, DailyLimit, WeeklyLimit, MonthlyLimit } = this.state.data;
        const reqObj = {
            ChannelTypeName: ChannelTypeName,
            HourlyLimit: HourlyLimit + "",
            DailyLimit: DailyLimit + "",
            WeeklyLimit: WeeklyLimit + "",
            MonthlyLimit: MonthlyLimit + ""
        }
        const { errors, isValid } = validateChannelTypeForm(reqObj);
        this.setState({ errors: errors, flag: true });
        if (isValid) {
            this.props.updateReferralChannelType(this.state.data);
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
        const { drawerClose, edit_loading } = this.props;
        const { errors } = this.state;
        const { ChannelTypeName, HourlyLimit, DailyLimit, WeeklyLimit, MonthlyLimit } = this.state.data;
        var menuDetail = this.checkAndGetMenuAccessDetail('AEACB9FC-9E10-6B63-339C-D6249E5A6ECC');
        if (!menuDetail) {
            menuDetail = { Utility: [], CrudOption: [] }
        }
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.editReferralChannelType" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || edit_loading) && <JbsSectionLoader />}
                <div className="jbs-page-content col-md-12 mx-auto">
                    <Form className="tradefrm">
                        {(menuDetail["1BE9EA39-230B-5214-94BE-C09D82BA925C"] && menuDetail["1BE9EA39-230B-5214-94BE-C09D82BA925C"].Visibility === "E925F86B") && //1BE9EA39-230B-5214-94BE-C09D82BA925C
                            <FormGroup row>
                                <Label for="ChannelType" className="control-label col" ><IntlMessages id="my_account.ChannelType" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.ChannelType">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["1BE9EA39-230B-5214-94BE-C09D82BA925C"].AccessRight === "11E6E7B0") ? true : false} type="text" name="ChannelTypeName" value={ChannelTypeName} placeholder={placeholder} id="ChannelTypeName" onChange={this.handleChange} />
                                        }
                                    </IntlMessages>
                                    {errors.ChannelTypeName && (<span className="text-danger"><IntlMessages id={errors.ChannelTypeName} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["73E558C2-68DE-3D92-63E6-2F09373E0E79"] && menuDetail["73E558C2-68DE-3D92-63E6-2F09373E0E79"].Visibility === "E925F86B") && //73E558C2-68DE-3D92-63E6-2F09373E0E79
                            <FormGroup row>
                                <Label for="HourlyLimit" className="control-label col" ><IntlMessages id="my_account.HourlyLimit" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.HourlyLimit">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["73E558C2-68DE-3D92-63E6-2F09373E0E79"].AccessRight === "11E6E7B0") ? true : false} type="text" name="HourlyLimit" value={HourlyLimit} placeholder={placeholder} id="HourlyLimit" onChange={this.handleNumberChange} />
                                        }
                                    </IntlMessages>
                                    {errors.HourlyLimit && (<span className="text-danger"><IntlMessages id={errors.HourlyLimit} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["D9E3317C-3391-A1E4-01B7-F26F25D91A10"] && menuDetail["D9E3317C-3391-A1E4-01B7-F26F25D91A10"].Visibility === "E925F86B") && //D9E3317C-3391-A1E4-01B7-F26F25D91A10
                            <FormGroup row>
                                <Label for="DailyLimit" className="control-label col" ><IntlMessages id="my_account.DailyLimit" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.DailyLimit">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["D9E3317C-3391-A1E4-01B7-F26F25D91A10"].AccessRight === "11E6E7B0") ? true : false} type="text" name="DailyLimit" value={DailyLimit} placeholder={placeholder} id="DailyLimit" onChange={this.handleNumberChange} />
                                        }
                                    </IntlMessages>
                                    {errors.DailyLimit && (<span className="text-danger"><IntlMessages id={errors.DailyLimit} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["A70FE32D-5391-0346-473C-AE73FF3E3132"] && menuDetail["A70FE32D-5391-0346-473C-AE73FF3E3132"].Visibility === "E925F86B") && //A70FE32D-5391-0346-473C-AE73FF3E3132
                            <FormGroup row>
                                <Label for="WeeklyLimit" className="control-label col" ><IntlMessages id="my_account.WeeklyLimit" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.WeeklyLimit">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["A70FE32D-5391-0346-473C-AE73FF3E3132"].AccessRight === "11E6E7B0") ? true : false} type="text" name="WeeklyLimit" value={WeeklyLimit} placeholder={placeholder} id="WeeklyLimit" onChange={this.handleNumberChange} />
                                        }
                                    </IntlMessages>
                                    {errors.WeeklyLimit && (<span className="text-danger"><IntlMessages id={errors.WeeklyLimit} /></span>)}
                                </div>
                            </FormGroup>}
                        {(menuDetail["B540CC1B-69EC-5DFC-61A1-535233205AA2"] && menuDetail["B540CC1B-69EC-5DFC-61A1-535233205AA2"].Visibility === "E925F86B") && //B540CC1B-69EC-5DFC-61A1-535233205AA2
                            <FormGroup row>
                                <Label for="MonthlyLimit" className="control-label col" ><IntlMessages id="my_account.MonthlyLimit" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.MonthlyLimit">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["B540CC1B-69EC-5DFC-61A1-535233205AA2"].AccessRight === "11E6E7B0") ? true : false} type="text" name="MonthlyLimit" value={MonthlyLimit} placeholder={placeholder} id="MonthlyLimit" onChange={this.handleNumberChange} />
                                        }
                                    </IntlMessages>
                                    {errors.MonthlyLimit && (<span className="text-danger"><IntlMessages id={errors.MonthlyLimit} /></span>)}
                                </div>
                            </FormGroup>}
                        {menuDetail && //
                            <FormGroup row>
                                <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                    <div className="btn_area">
                                        <Button disabled={edit_loading} variant="raised" className="btn-primary text-white" onClick={this.OnEditReferralChannelType}><IntlMessages id="sidebar.btnEdit" /></Button>
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
    const { editReferralChannelTypeData, getReferralChannelTypeDataById, edit_loading } = ReferralChannelTypeReducer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return {
        editReferralChannelTypeData, getReferralChannelTypeDataById, edit_loading, menuLoading,
        menu_rights
    };
}

export default connect(mapToProps, {
    updateReferralChannelType,
    getReferralChannelTypeData,
    getMenuPermissionByID
})(UpdateReferralChannelType);