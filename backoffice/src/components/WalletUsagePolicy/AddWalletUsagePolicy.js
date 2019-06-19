import React, { Component } from 'react'
import { Form, FormGroup, Label, Input } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import { TimePicker } from "material-ui-pickers";
import Switch from 'react-toggle-switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { NotificationManager } from 'react-notifications';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';

class AddWalletUsagePolicy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menudetail: [],
            notificationFlag: true,
        }
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('9055302E-206D-7707-387E-2CBE4C26929C'); // get wallet menu permission
    }
    componentWillReceiveProps(nextProps) {
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
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
                        return response = fieldList;
                    }
                }
            }
        } else {
            return response;
        }
    }
    render() {
        var menuDetail = this.checkAndGetMenuAccessDetail('9C640BA3-60DD-958A-38AB-05E631A6056B');
        const { addNewWalletUsagePolicyDetail, errors, WalletTypeList, intl} = this.props
        const days = [
            <IntlMessages id="lable.Monday" />,
            <IntlMessages id="lable.Tuesday" />,
            <IntlMessages id="lable.Wednesday" />,
            <IntlMessages id="lable.Thursday" />,
            <IntlMessages id="lable.Friday" />,
            <IntlMessages id="lable.Saturday" />,
            <IntlMessages id="lable.Sunday" />
        ];
        return (
            <div>
                {this.props.menuLoading && <JbsSectionLoader />}
                <Form className="row">
                    <div className="col-sm-12">
                        <div className="row">
                        {(menuDetail['7F3B8CA8-6776-462F-120B-1E8EE22F7F97'] && menuDetail['7F3B8CA8-6776-462F-120B-1E8EE22F7F97'].Visibility === "E925F86B") && //7F3B8CA8-6776-462F-120B-1E8EE22F7F97
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.WalletType" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['7F3B8CA8-6776-462F-120B-1E8EE22F7F97'].AccessRight === "11E6E7B0") ? true : false}
                                    type="select"
                                    name="type"
                                    className="form-control"
                                    id="type"
                                    value={addNewWalletUsagePolicyDetail.WalletType}
                                    onChange={e =>
                                        this.props.onChangeText(
                                            "WalletType",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">{intl.formatMessage({ id: "lable.selectType" })}</option>
                                    {WalletTypeList.length &&
                                        WalletTypeList.map((list, index) => (
                                            <option key={index} value={list.ID}>
                                                {list.TypeName}
                                            </option>
                                        ))}
                                </Input>
                                {errors.WalletType && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.WalletType} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['0F9E3BE3-9931-8C3D-2604-1D0548007024'] && menuDetail['0F9E3BE3-9931-8C3D-2604-1D0548007024'].Visibility === "E925F86B") && //0F9E3BE3-9931-8C3D-2604-1D0548007024
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.PolicyName" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['0F9E3BE3-9931-8C3D-2604-1D0548007024'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="PolicyName"
                                    value={addNewWalletUsagePolicyDetail.PolicyName}
                                    maxLength="50"
                                    onChange={e =>
                                        this.props.onChangeText("PolicyName", e.target.value)
                                    }
                                />
                                {errors.PolicyName && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.PolicyName} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['B9D4019D-1641-84DB-4BFC-3F4FEF712690'] && menuDetail['B9D4019D-1641-84DB-4BFC-3F4FEF712690'].Visibility === "E925F86B") && //B9D4019D-1641-84DB-4BFC-3F4FEF712690
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.AllowedIP" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['B9D4019D-1641-84DB-4BFC-3F4FEF712690'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="AllowedIP"
                                    value={addNewWalletUsagePolicyDetail.AllowedIP}
                                    maxLength="50"
                                    onChange={e =>
                                        this.props.onChangeText("AllowedIP", e.target.value)
                                    }
                                />
                                {errors.AllowedIP && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.AllowedIP} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['B37B9DC2-76AC-57FB-58B4-0FE125997DF5'] && menuDetail['B37B9DC2-76AC-57FB-58B4-0FE125997DF5'].Visibility === "E925F86B") && //B37B9DC2-76AC-57FB-58B4-0FE125997DF5
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.AllowedLocation" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['B37B9DC2-76AC-57FB-58B4-0FE125997DF5'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="AllowedLocation"
                                    value={addNewWalletUsagePolicyDetail.AllowedLocation}
                                    maxLength="50"
                                    onChange={e =>
                                        this.props.onChangeText("AllowedLocation", e.target.value)
                                    }
                                />
                                {errors.AllowedLocation && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.AllowedLocation} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['3E5B7BD7-0BE1-2998-1D43-3871CD619135'] && menuDetail['3E5B7BD7-0BE1-2998-1D43-3871CD619135'].Visibility === "E925F86B") && //3E5B7BD7-0BE1-2998-1D43-3871CD619135
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.AuthenticationType" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['3E5B7BD7-0BE1-2998-1D43-3871CD619135'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="AuthenticationType"
                                    value={addNewWalletUsagePolicyDetail.AuthenticationType}
                                    maxLength="50"
                                    onChange={e =>
                                        this.props.onChangeNumber("AuthenticationType", e.target.value)
                                    }
                                />
                                {errors.AuthenticationType && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.AuthenticationType} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['A3039BC2-3D6B-47D4-1CAA-9E6051232102'] && menuDetail['A3039BC2-3D6B-47D4-1CAA-9E6051232102'].Visibility === "E925F86B") && //A3039BC2-3D6B-47D4-1CAA-9E6051232102
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.DailyTrnCount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['A3039BC2-3D6B-47D4-1CAA-9E6051232102'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="DailyTrnCount"
                                    value={addNewWalletUsagePolicyDetail.DailyTrnCount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeNumber("DailyTrnCount", e.target.value)
                                    }
                                />
                                {errors.DailyTrnCount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.DailyTrnCount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['8A055DC0-1917-12AD-39C5-E9EAD36F3330'] && menuDetail['8A055DC0-1917-12AD-39C5-E9EAD36F3330'].Visibility === "E925F86B") && //8A055DC0-1917-12AD-39C5-E9EAD36F3330
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.DailyTrnAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['8A055DC0-1917-12AD-39C5-E9EAD36F3330'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="DailyTrnAmount"
                                    value={addNewWalletUsagePolicyDetail.DailyTrnAmount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeNumber("DailyTrnAmount", e.target.value)
                                    }
                                />
                                {errors.DailyTrnAmount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.DailyTrnAmount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['6D065BB5-73D7-2A6F-0E03-D3B92C6B0D7C'] && menuDetail['6D065BB5-73D7-2A6F-0E03-D3B92C6B0D7C'].Visibility === "E925F86B") && //6D065BB5-73D7-2A6F-0E03-D3B92C6B0D7C
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.HourlyTrnCount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['6D065BB5-73D7-2A6F-0E03-D3B92C6B0D7C'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="HourlyTrnCount"
                                    value={addNewWalletUsagePolicyDetail.HourlyTrnCount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeNumber("HourlyTrnCount", e.target.value)
                                    }
                                />
                                {errors.HourlyTrnCount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.HourlyTrnCount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['7C1CF046-226C-0CDC-7579-B00B5ABA7094'] && menuDetail['7C1CF046-226C-0CDC-7579-B00B5ABA7094'].Visibility === "E925F86B") && //7C1CF046-226C-0CDC-7579-B00B5ABA7094
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.HourlyTrnAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['7C1CF046-226C-0CDC-7579-B00B5ABA7094'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="HourlyTrnAmount"
                                    value={addNewWalletUsagePolicyDetail.HourlyTrnAmount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeNumber("HourlyTrnAmount", e.target.value)
                                    }
                                />
                                {errors.HourlyTrnCount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.HourlyTrnAmount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['B3AE4FBB-5994-86E7-2D4C-340AD62A61AF'] && menuDetail['B3AE4FBB-5994-86E7-2D4C-340AD62A61AF'].Visibility === "E925F86B") && //B3AE4FBB-5994-86E7-2D4C-340AD62A61AF
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.MonthlyTrnCount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['B3AE4FBB-5994-86E7-2D4C-340AD62A61AF'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="MonthlyTrnCount"
                                    value={addNewWalletUsagePolicyDetail.MonthlyTrnCount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeNumber("MonthlyTrnCount", e.target.value)
                                    }
                                />
                                {errors.MonthlyTrnCount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.MonthlyTrnCount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['2F23417E-8627-86D5-7FA5-885FFC1F3EA2'] && menuDetail['2F23417E-8627-86D5-7FA5-885FFC1F3EA2'].Visibility === "E925F86B") && //2F23417E-8627-86D5-7FA5-885FFC1F3EA2
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.MonthlyTrnAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['2F23417E-8627-86D5-7FA5-885FFC1F3EA2'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="MonthlyTrnAmount"
                                    value={addNewWalletUsagePolicyDetail.MonthlyTrnAmount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeNumber("MonthlyTrnAmount", e.target.value)
                                    }
                                />
                                {errors.MonthlyTrnAmount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.MonthlyTrnAmount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['E278482D-1FFD-26CD-5548-CDB61C4761BB'] && menuDetail['E278482D-1FFD-26CD-5548-CDB61C4761BB'].Visibility === "E925F86B") && //E278482D-1FFD-26CD-5548-CDB61C4761BB
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.WeeklyTrnCount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['E278482D-1FFD-26CD-5548-CDB61C4761BB'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="WeeklyTrnCount"
                                    value={addNewWalletUsagePolicyDetail.WeeklyTrnCount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeNumber("WeeklyTrnCount", e.target.value)
                                    }
                                />
                                {errors.WeeklyTrnCount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.WeeklyTrnCount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['1F590C75-19F9-1057-6C74-D10F3CEB0A29'] && menuDetail['1F590C75-19F9-1057-6C74-D10F3CEB0A29'].Visibility === "E925F86B") && //1F590C75-19F9-1057-6C74-D10F3CEB0A29
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.WeeklyTrnAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['1F590C75-19F9-1057-6C74-D10F3CEB0A29'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="WeeklyTrnAmount"
                                    value={addNewWalletUsagePolicyDetail.WeeklyTrnAmount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeNumber("WeeklyTrnAmount", e.target.value)
                                    }
                                />
                                {errors.WeeklyTrnAmount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.WeeklyTrnAmount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['AF64BECC-4836-88D6-7A5F-FC974BA129C0'] && menuDetail['AF64BECC-4836-88D6-7A5F-FC974BA129C0'].Visibility === "E925F86B") && //AF64BECC-4836-88D6-7A5F-FC974BA129C0
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.YearlyTrnCount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['AF64BECC-4836-88D6-7A5F-FC974BA129C0'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="YearlyTrnCount"
                                    value={addNewWalletUsagePolicyDetail.YearlyTrnCount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeNumber("YearlyTrnCount", e.target.value)
                                    }
                                />
                                {errors.YearlyTrnCount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.YearlyTrnCount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['48965754-2E34-3F36-5AAD-BE3BB8699B9D'] && menuDetail['48965754-2E34-3F36-5AAD-BE3BB8699B9D'].Visibility === "E925F86B") && //48965754-2E34-3F36-5AAD-BE3BB8699B9D
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.YearlyTrnAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['48965754-2E34-3F36-5AAD-BE3BB8699B9D'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="YearlyTrnAmount"
                                    value={addNewWalletUsagePolicyDetail.YearlyTrnAmount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeNumber("YearlyTrnAmount", e.target.value)
                                    }
                                />
                                {errors.YearlyTrnAmount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.YearlyTrnAmount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['05F56B97-9310-556E-0709-9E0E191D09DD'] && menuDetail['05F56B97-9310-556E-0709-9E0E191D09DD'].Visibility === "E925F86B") && //05F56B97-9310-556E-0709-9E0E191D09DD
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.LifeTimeTrnCount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['05F56B97-9310-556E-0709-9E0E191D09DD'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="LifeTimeTrnCount"
                                    value={addNewWalletUsagePolicyDetail.LifeTimeTrnCount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeNumber("LifeTimeTrnCount", e.target.value)
                                    }
                                />
                                {errors.LifeTimeTrnCount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.LifeTimeTrnCount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['A3443E55-55DC-5B23-94C4-802D4F81438A'] && menuDetail['A3443E55-55DC-5B23-94C4-802D4F81438A'].Visibility === "E925F86B") && //A3443E55-55DC-5B23-94C4-802D4F81438A
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.LifeTimeTrnAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['A3443E55-55DC-5B23-94C4-802D4F81438A'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="LifeTimeTrnAmount"
                                    value={addNewWalletUsagePolicyDetail.LifeTimeTrnAmount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeNumber("LifeTimeTrnAmount", e.target.value)
                                    }
                                />
                                {errors.LifeTimeTrnAmount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.LifeTimeTrnAmount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['6C9EC5D5-09C0-5AAE-2E71-87E344200F46'] && menuDetail['6C9EC5D5-09C0-5AAE-2E71-87E344200F46'].Visibility === "E925F86B") && //6C9EC5D5-09C0-5AAE-2E71-87E344200F46
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.MinAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['6C9EC5D5-09C0-5AAE-2E71-87E344200F46'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="MinAmount"
                                    value={addNewWalletUsagePolicyDetail.MinAmount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeNumber("MinAmount", e.target.value)
                                    }
                                />
                                {errors.MinAmount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.MinAmount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['9E0D08CA-0041-10DC-838D-B1B1848189CB'] && menuDetail['9E0D08CA-0041-10DC-838D-B1B1848189CB'].Visibility === "E925F86B") && //9E0D08CA-0041-10DC-838D-B1B1848189CB
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.MaxAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['9E0D08CA-0041-10DC-838D-B1B1848189CB'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="MaxAmount"
                                    value={addNewWalletUsagePolicyDetail.MaxAmount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeNumber("MaxAmount", e.target.value)
                                    }
                                />
                                {errors.MaxAmount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.MaxAmount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['F1356232-3DF6-3509-1CD6-D2E163718942'] && menuDetail['F1356232-3DF6-3509-1CD6-D2E163718942'].Visibility === "E925F86B") && //F1356232-3DF6-3509-1CD6-D2E163718942
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.Status" />
                                </Label>
                                <Switch
                                    enabled={(menuDetail['F1356232-3DF6-3509-1CD6-D2E163718942'].AccessRight === "11E6E7B0") ? false : true}
                                    onClick={this.props.handleCheckChange()}
                                    on={(addNewWalletUsagePolicyDetail.Status === "1") ? true : false} />
                            </FormGroup>
                        }
                        {(menuDetail['658EDDEA-7CBA-292E-6F0C-854C147969C4'] && menuDetail['658EDDEA-7CBA-292E-6F0C-854C147969C4'].Visibility === "E925F86B") && //658EDDEA-7CBA-292E-6F0C-854C147969C4
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label for="StartTime">
                                    <IntlMessages id={"lable.startTime"} />
                                </Label>
                                <div className="timePicker">
                                    <TimePicker
                                        name="StartTime"
                                        value={addNewWalletUsagePolicyDetail.StartTime}
                                        disabled={(menuDetail['658EDDEA-7CBA-292E-6F0C-854C147969C4'].AccessRight === "11E6E7B0") ? true : false}
                                        onChange={e =>
                                            this.props.handleDateChange("StartTime", e)
                                        }
                                    />
                                </div>
                            </FormGroup>
                        }
                        {(menuDetail['DD9C7C8C-6825-9F02-8A7A-E2E6B0CA3ECD'] && menuDetail['DD9C7C8C-6825-9F02-8A7A-E2E6B0CA3ECD'].Visibility === "E925F86B") && //DD9C7C8C-6825-9F02-8A7A-E2E6B0CA3ECD
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label for="EndTime">
                                    <IntlMessages id={"lable.endTime"} />
                                </Label>
                                <div className="timePicker">
                                    <TimePicker
                                        name="EndTime"
                                        value={addNewWalletUsagePolicyDetail.EndTime}
                                        disabled={(menuDetail['DD9C7C8C-6825-9F02-8A7A-E2E6B0CA3ECD'].AccessRight === "11E6E7B0") ? true : false}
                                        onChange={e =>
                                            this.props.handleDateChange("EndTime", e)
                                        }
                                    />
                                </div>
                            </FormGroup>
                        }
                        {(menuDetail['6415E0A3-82E5-058E-64D5-5F580BAC1DEF'] && menuDetail['6415E0A3-82E5-058E-64D5-5F580BAC1DEF'].Visibility === "E925F86B") && //6415E0A3-82E5-058E-64D5-5F580BAC1DEF
                            <FormGroup className="col-sm-12">
                                <Label>
                                    <IntlMessages id="lable.AllowedDays" />
                                </Label>
                                <div className="row ml-0">
                                    {days.map(
                                        (value, key) =>
                                            <FormControlLabel key={key} control={
                                                <Checkbox
                                                    color="primary"
                                                    checked={addNewWalletUsagePolicyDetail.DayNo.indexOf(key) == -1 ? false : true}
                                                    disabled={(menuDetail['6415E0A3-82E5-058E-64D5-5F580BAC1DEF'].AccessRight === "11E6E7B0") ? true : false}
                                                    onChange={e => this.props.handleDaysChange(e.target.checked, key)}
                                                    value={value} />
                                            } label={value}
                                            />
                                    )}
                                </div>
                            </FormGroup>
                        }
                        </div>
                    </div>
                </Form>
            </div>
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
})(injectIntl(AddWalletUsagePolicy));
