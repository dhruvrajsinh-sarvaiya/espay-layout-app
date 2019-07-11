import React, { Component, Fragment } from 'react'
import { Form, FormGroup, Label, Input } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import { TimePicker } from "material-ui-pickers";
import Switch from 'react-toggle-switch';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { NotificationManager } from 'react-notifications';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
class EditTransactionPolicy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menudetail: [],
            notificationFlag: true,
        }
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('596258E6-5825-334C-9338-02C042516765'); // get wallet menu permission
    }
    componentWillReceiveProps(nextProps) {
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                // this.props.getWalletTypeMaster();
                // this.props.getCurrencyList();
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
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
        var menuDetail = this.checkAndGetMenuAccessDetail('5B31CD29-70AF-9B6F-32DC-026B365A428A');
        const { editTransactionPolicyReport, errors, intl} = this.props;
        return (
            <Fragment>
                {this.props.menuLoading && <JbsSectionLoader />}
                <Form className="row">
                    <div className="col-sm-12">
                        <div className="row">
                        {(menuDetail['44DEFB70-8477-1569-5E07-00B57E370F41'] && menuDetail['44DEFB70-8477-1569-5E07-00B57E370F41'].Visibility === "E925F86B") && //44DEFB70-8477-1569-5E07-00B57E370F41
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.AllowedIP" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['44DEFB70-8477-1569-5E07-00B57E370F41'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="AllowedIP"
                                    value={editTransactionPolicyReport.AllowedIP}
                                    onChange={e =>
                                        this.props.onChangeEditText("AllowedIP", e.target.value)
                                    }
                                />
                                {errors.AllowedIP && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.AllowedIP} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['500F8766-1617-43F2-9127-7D8CD9414A98'] && menuDetail['500F8766-1617-43F2-9127-7D8CD9414A98'].Visibility === "E925F86B") && //500F8766-1617-43F2-9127-7D8CD9414A98
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.AllowedLocation" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['500F8766-1617-43F2-9127-7D8CD9414A98'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="AllowedLocation"
                                    value={editTransactionPolicyReport.AllowedLocation}
                                    onChange={e =>
                                        this.props.onChangeEditText("AllowedLocation", e.target.value)
                                    }
                                />
                                {errors.AllowedLocation && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.AllowedLocation} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['7B1CFACF-027E-6B2A-02F0-1AA5EA602695'] && menuDetail['7B1CFACF-027E-6B2A-02F0-1AA5EA602695'].Visibility === "E925F86B") && //7B1CFACF-027E-6B2A-02F0-1AA5EA602695
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.AuthenticationType" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['7B1CFACF-027E-6B2A-02F0-1AA5EA602695'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="AuthenticationType"
                                    value={editTransactionPolicyReport.AuthenticationType}
                                    onChange={e =>
                                        this.props.onChangeEditNumber("AuthenticationType", e.target.value)
                                    }
                                />
                                {errors.AuthenticationType && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.AuthenticationType} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['CDF3A102-7FD3-959F-164D-49A1E6282B0F'] && menuDetail['CDF3A102-7FD3-959F-164D-49A1E6282B0F'].Visibility === "E925F86B") && //CDF3A102-7FD3-959F-164D-49A1E6282B0F
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.DailyTrnCount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['CDF3A102-7FD3-959F-164D-49A1E6282B0F'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="DailyTrnCount"
                                    value={editTransactionPolicyReport.DailyTrnCount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeEditNumber("DailyTrnCount", e.target.value)
                                    }
                                />
                                {errors.DailyTrnCount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.DailyTrnCount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['37BF6BC0-0203-3178-25C9-AAC6310D2B13'] && menuDetail['37BF6BC0-0203-3178-25C9-AAC6310D2B13'].Visibility === "E925F86B") && //37BF6BC0-0203-3178-25C9-AAC6310D2B13
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.DailyTrnAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['37BF6BC0-0203-3178-25C9-AAC6310D2B13'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="DailyTrnAmount"
                                    value={editTransactionPolicyReport.DailyTrnAmount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeEditNumber("DailyTrnAmount", e.target.value)
                                    }
                                />
                                {errors.DailyTrnAmount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.DailyTrnAmount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['A7F57994-96E5-A228-490F-4AFAC61D4956'] && menuDetail['A7F57994-96E5-A228-490F-4AFAC61D4956'].Visibility === "E925F86B") && //A7F57994-96E5-A228-490F-4AFAC61D4956
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.MonthlyTrnCount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['A7F57994-96E5-A228-490F-4AFAC61D4956'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="MonthlyTrnCount"
                                    value={editTransactionPolicyReport.MonthlyTrnCount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeEditNumber("MonthlyTrnCount", e.target.value)
                                    }
                                />
                                {errors.MonthlyTrnCount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.MonthlyTrnCount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['50B8FE5B-5E99-8532-1162-716DB11A8DB0'] && menuDetail['50B8FE5B-5E99-8532-1162-716DB11A8DB0'].Visibility === "E925F86B") && //50B8FE5B-5E99-8532-1162-716DB11A8DB0
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.MonthlyTrnAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['50B8FE5B-5E99-8532-1162-716DB11A8DB0'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="MonthlyTrnAmount"
                                    value={editTransactionPolicyReport.MonthlyTrnAmount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeEditNumber("MonthlyTrnAmount", e.target.value)
                                    }
                                />
                                {errors.MonthlyTrnAmount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.MonthlyTrnAmount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['763E724B-10FB-3081-A4D8-291013CD64F7'] && menuDetail['763E724B-10FB-3081-A4D8-291013CD64F7'].Visibility === "E925F86B") && //763E724B-10FB-3081-A4D8-291013CD64F7
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.WeeklyTrnCount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['763E724B-10FB-3081-A4D8-291013CD64F7'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="WeeklyTrnCount"
                                    value={editTransactionPolicyReport.WeeklyTrnCount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeEditNumber("WeeklyTrnCount", e.target.value)
                                    }
                                />
                                {errors.WeeklyTrnCount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.WeeklyTrnCount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['15BA0FAD-9BA9-83F7-2A2B-D66C4DD552D9'] && menuDetail['15BA0FAD-9BA9-83F7-2A2B-D66C4DD552D9'].Visibility === "E925F86B") && //15BA0FAD-9BA9-83F7-2A2B-D66C4DD552D9
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.WeeklyTrnAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['15BA0FAD-9BA9-83F7-2A2B-D66C4DD552D9'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="WeeklyTrnAmount"
                                    value={editTransactionPolicyReport.WeeklyTrnAmount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeEditNumber("WeeklyTrnAmount", e.target.value)
                                    }
                                />
                                {errors.WeeklyTrnAmount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.WeeklyTrnAmount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['F23FDB34-57BA-A13F-0455-E31D870C3B72'] && menuDetail['F23FDB34-57BA-A13F-0455-E31D870C3B72'].Visibility === "E925F86B") && //F23FDB34-57BA-A13F-0455-E31D870C3B72
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.YearlyTrnCount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['F23FDB34-57BA-A13F-0455-E31D870C3B72'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="YearlyTrnCount"
                                    value={editTransactionPolicyReport.YearlyTrnCount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeEditNumber("YearlyTrnCount", e.target.value)
                                    }
                                />
                                {errors.YearlyTrnCount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.YearlyTrnCount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['BEFB4F18-8BF0-204C-24F0-671DE90B01E7'] && menuDetail['BEFB4F18-8BF0-204C-24F0-671DE90B01E7'].Visibility === "E925F86B") && //BEFB4F18-8BF0-204C-24F0-671DE90B01E7
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.YearlyTrnAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['BEFB4F18-8BF0-204C-24F0-671DE90B01E7'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="YearlyTrnAmount"
                                    value={editTransactionPolicyReport.YearlyTrnAmount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeEditNumber("YearlyTrnAmount", e.target.value)
                                    }
                                />
                                {errors.YearlyTrnAmount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.YearlyTrnAmount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['94570972-8A58-1AC1-65F9-9E21DBA32112'] && menuDetail['94570972-8A58-1AC1-65F9-9E21DBA32112'].Visibility === "E925F86B") && //94570972-8A58-1AC1-65F9-9E21DBA32112
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.MinAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['94570972-8A58-1AC1-65F9-9E21DBA32112'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="MinAmount"
                                    value={editTransactionPolicyReport.MinAmount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeEditNumber("MinAmount", e.target.value)
                                    }
                                />
                                {errors.MinAmount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.MinAmount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['241B0CB0-558E-772D-3E9A-273C87BF7E2F'] && menuDetail['241B0CB0-558E-772D-3E9A-273C87BF7E2F'].Visibility === "E925F86B") && //241B0CB0-558E-772D-3E9A-273C87BF7E2F
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.MaxAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['241B0CB0-558E-772D-3E9A-273C87BF7E2F'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="MaxAmount"
                                    value={editTransactionPolicyReport.MaxAmount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeEditNumber("MaxAmount", e.target.value)
                                    }
                                />
                                {errors.MaxAmount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.MaxAmount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['050D191B-95A3-870A-0DAD-59454274A218'] && menuDetail['050D191B-95A3-870A-0DAD-59454274A218'].Visibility === "E925F86B") && //050D191B-95A3-870A-0DAD-59454274A218
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.AuthorityType" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['050D191B-95A3-870A-0DAD-59454274A218'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="AuthorityType"
                                    value={editTransactionPolicyReport.AuthorityType}
                                    onChange={e =>
                                        this.props.onChangeEditNumber("AuthorityType", e.target.value)
                                    }
                                />
                                {errors.AuthorityType && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.AuthorityType} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['E756E814-2ED9-51BE-1DFF-BC3AF5951D6A'] && menuDetail['E756E814-2ED9-51BE-1DFF-BC3AF5951D6A'].Visibility === "E925F86B") && //E756E814-2ED9-51BE-1DFF-BC3AF5951D6A
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.AllowedUserType" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['E756E814-2ED9-51BE-1DFF-BC3AF5951D6A'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="AllowedUserType"
                                    value={editTransactionPolicyReport.AllowedUserType}
                                    onChange={e =>
                                        this.props.onChangeEditNumber("AllowedUserType", e.target.value)
                                    }
                                />
                                {errors.AllowedUserType && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.AllowedUserType} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['F9AC5901-7D72-2436-96F2-853C637866E0'] && menuDetail['F9AC5901-7D72-2436-96F2-853C637866E0'].Visibility === "E925F86B") && //F9AC5901-7D72-2436-96F2-853C637866E0
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label for="StartTime" className="font-weight-bold">
                                    <IntlMessages id={"lable.startTime"} />
                                </Label>
                                <div className="timePicker">
                                    <TimePicker
                                        disabled={(menuDetail['F9AC5901-7D72-2436-96F2-853C637866E0'].AccessRight === "11E6E7B0") ? true : false}
                                        name="StartTime"
                                        value={editTransactionPolicyReport.StartTime}
                                        onChange={e =>
                                            this.props.handleEditDateChange("StartTime", e)
                                        }
                                    />
                                </div>
                            </FormGroup>
                        }
                        {(menuDetail['58C8B41C-0B4A-14E1-460F-96E3F4EF678B'] && menuDetail['58C8B41C-0B4A-14E1-460F-96E3F4EF678B'].Visibility === "E925F86B") && //58C8B41C-0B4A-14E1-460F-96E3F4EF678B
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label for="EndTime" className="font-weight-bold">
                                    <IntlMessages id={"lable.endTime"} />
                                </Label>
                                <div className="timePicker">
                                    <TimePicker
                                        disabled={(menuDetail['58C8B41C-0B4A-14E1-460F-96E3F4EF678B'].AccessRight === "11E6E7B0") ? true : false}
                                        name="EndTime"
                                        value={editTransactionPolicyReport.EndTime}
                                        onChange={e =>
                                            this.props.handleEditDateChange("EndTime", e)
                                        }
                                    />
                                </div>
                            </FormGroup>
                        }
                        {(menuDetail['9D919D6C-5050-07FC-253A-C734826650F1'] && menuDetail['9D919D6C-5050-07FC-253A-C734826650F1'].Visibility === "E925F86B") && //9D919D6C-5050-07FC-253A-C734826650F1
                            <FormGroup className="col-sm-2">
                                <Label>
                                    <IntlMessages id="lable.Status" />
                                </Label>
                                <Switch onClick={() => this.props.toggleEditSwitch(editTransactionPolicyReport)}
                                enabled={(menuDetail['9D919D6C-5050-07FC-253A-C734826650F1'].AccessRight === "11E6E7B0") ? false : true}
                                    on={(editTransactionPolicyReport.Status === 1) ? true : false} />
                            </FormGroup>
                        }
                        {(menuDetail['1599B98D-7CBF-402C-05D6-DC6E60B29F39'] && menuDetail['1599B98D-7CBF-402C-05D6-DC6E60B29F39'].Visibility === "E925F86B") && //1599B98D-7CBF-402C-05D6-DC6E60B29F39
                            <FormGroup className="col-sm-2">
                                <Label>
                                    <IntlMessages id="wallet.KYCOnly" />
                                </Label>
                                <Switch onClick={() => this.props.toggleKYCSwitch(editTransactionPolicyReport)}
                                    on={(editTransactionPolicyReport.IsKYCEnable === 1) ? true : false} 
                                    enabled={(menuDetail['1599B98D-7CBF-402C-05D6-DC6E60B29F39'].AccessRight === "11E6E7B0") ? false : true}
                                    />
                                    
                            </FormGroup>
                        }
                        </div>
                    </div>
                </Form >
            </Fragment>
        )
    }
}
const mapToProps = ({ authTokenRdcer }) => {
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { menuLoading, menu_rights };
};

export default connect(mapToProps, {
    getMenuPermissionByID
})(injectIntl(EditTransactionPolicy));
