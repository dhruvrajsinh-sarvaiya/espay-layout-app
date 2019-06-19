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
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
class EditWalletUsagePolicy extends Component {
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
        const { editWalletUsagePolicyDetail, errors, WalletTypeList, intl} = this.props
        var menuDetail = this.checkAndGetMenuAccessDetail('2AC143BF-02FE-4C8C-A1DE-EB4223DF063B');
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
                        {(menuDetail['7FB422B7-3D5D-5FE5-3AFA-9DA46C116B0D'] && menuDetail['7FB422B7-3D5D-5FE5-3AFA-9DA46C116B0D'].Visibility === "E925F86B") && //7FB422B7-3D5D-5FE5-3AFA-9DA46C116B0D
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.WalletType" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['7FB422B7-3D5D-5FE5-3AFA-9DA46C116B0D'].AccessRight === "11E6E7B0") ? true : false}
                                    type="select"
                                    name="type"
                                    className="form-control"
                                    id="type"
                                    value={editWalletUsagePolicyDetail.WalletTypeId}
                                    onChange={e =>
                                        this.props.onChangeEditText(
                                            "WalletType",
                                            e.target.value
                                        )
                                    }
                                    readOnly
                                >
                                    <option value="">-- Select Type --</option>
                                    {WalletTypeList.length &&
                                        WalletTypeList.map((list, index) => (
                                            <option key={index} value={list.ID}>
                                                {list.TypeName}
                                            </option>
                                        ))}
                                </Input>
                            </FormGroup>
                        }
                        {(menuDetail['889191C5-3307-393C-4C7F-01E7C7D5974E'] && menuDetail['889191C5-3307-393C-4C7F-01E7C7D5974E'].Visibility === "E925F86B") && //889191C5-3307-393C-4C7F-01E7C7D5974E
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.PolicyName" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['889191C5-3307-393C-4C7F-01E7C7D5974E'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="PolicyName"
                                    value={editWalletUsagePolicyDetail.PolicyName}
                                    maxLength="50"
                                    onChange={e =>
                                        this.props.onChangeEditText("PolicyName", e.target.value)
                                    }
                                />
                                {errors.PolicyName && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.PolicyName} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['003760FF-6442-91FC-7DF3-1061281753FF'] && menuDetail['003760FF-6442-91FC-7DF3-1061281753FF'].Visibility === "E925F86B") && //003760FF-6442-91FC-7DF3-1061281753FF
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.AllowedIP" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['003760FF-6442-91FC-7DF3-1061281753FF'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="AllowedIP"
                                    value={editWalletUsagePolicyDetail.AllowedIP}
                                    maxLength="50"
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
                        {(menuDetail['10707C02-21B4-0535-2061-8F62816E320D'] && menuDetail['10707C02-21B4-0535-2061-8F62816E320D'].Visibility === "E925F86B") && //10707C02-21B4-0535-2061-8F62816E320D
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.AllowedLocation" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['10707C02-21B4-0535-2061-8F62816E320D'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="AllowedLocation"
                                    value={editWalletUsagePolicyDetail.AllowedLocation}
                                    maxLength="50"
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
                        {(menuDetail['C92B6D21-307C-353B-7029-42D848F95C2D'] && menuDetail['C92B6D21-307C-353B-7029-42D848F95C2D'].Visibility === "E925F86B") && //C92B6D21-307C-353B-7029-42D848F95C2D
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.AuthenticationType" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['C92B6D21-307C-353B-7029-42D848F95C2D'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="AuthenticationType"
                                    value={editWalletUsagePolicyDetail.AuthenticationType}
                                    maxLength="50"
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
                        {(menuDetail['BEB0D42B-60C8-3C92-929E-9174A1CD27E5'] && menuDetail['BEB0D42B-60C8-3C92-929E-9174A1CD27E5'].Visibility === "E925F86B") && //BEB0D42B-60C8-3C92-929E-9174A1CD27E5
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.DailyTrnCount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['BEB0D42B-60C8-3C92-929E-9174A1CD27E5'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="DailyTrnCount"
                                    value={editWalletUsagePolicyDetail.DailyTrnCount}
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
                        {(menuDetail['2F3C4941-639E-9369-39C3-764D080B4B14'] && menuDetail['2F3C4941-639E-9369-39C3-764D080B4B14'].Visibility === "E925F86B") && //2F3C4941-639E-9369-39C3-764D080B4B14
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.DailyTrnAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['2F3C4941-639E-9369-39C3-764D080B4B14'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="DailyTrnAmount"
                                    value={editWalletUsagePolicyDetail.DailyTrnAmount}
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
                        {(menuDetail['04CA26A0-2ADA-5691-6D5A-63C4F0E50E5F'] && menuDetail['04CA26A0-2ADA-5691-6D5A-63C4F0E50E5F'].Visibility === "E925F86B") && //04CA26A0-2ADA-5691-6D5A-63C4F0E50E5F
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.HourlyTrnCount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['04CA26A0-2ADA-5691-6D5A-63C4F0E50E5F'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="HourlyTrnCount"
                                    value={editWalletUsagePolicyDetail.HourlyTrnCount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeEditNumber("HourlyTrnCount", e.target.value)
                                    }
                                />
                                {errors.HourlyTrnCount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.HourlyTrnCount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['EF542337-4C70-8149-1097-FBD71DFC8B3B'] && menuDetail['EF542337-4C70-8149-1097-FBD71DFC8B3B'].Visibility === "E925F86B") && //EF542337-4C70-8149-1097-FBD71DFC8B3B
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.HourlyTrnAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['EF542337-4C70-8149-1097-FBD71DFC8B3B'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="HourlyTrnAmount"
                                    value={editWalletUsagePolicyDetail.HourlyTrnAmount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeEditNumber("HourlyTrnAmount", e.target.value)
                                    }
                                />
                                {errors.HourlyTrnCount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.HourlyTrnAmount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['9CC528C8-69C0-3CB2-43BC-068FD49C1D71'] && menuDetail['9CC528C8-69C0-3CB2-43BC-068FD49C1D71'].Visibility === "E925F86B") && //9CC528C8-69C0-3CB2-43BC-068FD49C1D71
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.MonthlyTrnCount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['9CC528C8-69C0-3CB2-43BC-068FD49C1D71'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="MonthlyTrnCount"
                                    value={editWalletUsagePolicyDetail.MonthlyTrnCount}
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
                        {(menuDetail['A7C4D620-3FCF-5470-5AE0-31C406D5895D'] && menuDetail['A7C4D620-3FCF-5470-5AE0-31C406D5895D'].Visibility === "E925F86B") && //A7C4D620-3FCF-5470-5AE0-31C406D5895D
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.MonthlyTrnAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['A7C4D620-3FCF-5470-5AE0-31C406D5895D'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="MonthlyTrnAmount"
                                    value={editWalletUsagePolicyDetail.MonthlyTrnAmount}
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
                        {(menuDetail['60F9628D-47E7-0371-039C-D6F5FB399793'] && menuDetail['60F9628D-47E7-0371-039C-D6F5FB399793'].Visibility === "E925F86B") && //60F9628D-47E7-0371-039C-D6F5FB399793
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.WeeklyTrnCount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['60F9628D-47E7-0371-039C-D6F5FB399793'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="WeeklyTrnCount"
                                    value={editWalletUsagePolicyDetail.WeeklyTrnCount}
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
                        {(menuDetail['9D783CED-084C-5059-47E0-C7EE1B7D12F6'] && menuDetail['9D783CED-084C-5059-47E0-C7EE1B7D12F6'].Visibility === "E925F86B") && //9D783CED-084C-5059-47E0-C7EE1B7D12F6
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.WeeklyTrnAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['9D783CED-084C-5059-47E0-C7EE1B7D12F6'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="WeeklyTrnAmount"
                                    value={editWalletUsagePolicyDetail.WeeklyTrnAmount}
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
                        {(menuDetail['4E8D941C-9B2C-7844-356F-A1E1FD09543C'] && menuDetail['4E8D941C-9B2C-7844-356F-A1E1FD09543C'].Visibility === "E925F86B") && //4E8D941C-9B2C-7844-356F-A1E1FD09543C
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.YearlyTrnCount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['4E8D941C-9B2C-7844-356F-A1E1FD09543C'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="YearlyTrnCount"
                                    value={editWalletUsagePolicyDetail.YearlyTrnCount}
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
                        {(menuDetail['1874EC44-2A82-70C3-5097-3494CE8B1325'] && menuDetail['1874EC44-2A82-70C3-5097-3494CE8B1325'].Visibility === "E925F86B") && //1874EC44-2A82-70C3-5097-3494CE8B1325
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.YearlyTrnAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['1874EC44-2A82-70C3-5097-3494CE8B1325'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="YearlyTrnAmount"
                                    value={editWalletUsagePolicyDetail.YearlyTrnAmount}
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
                        {(menuDetail['56510506-4D9B-6D70-245D-879F2A326EE1'] && menuDetail['56510506-4D9B-6D70-245D-879F2A326EE1'].Visibility === "E925F86B") && //56510506-4D9B-6D70-245D-879F2A326EE1
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.LifeTimeTrnCount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['56510506-4D9B-6D70-245D-879F2A326EE1'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="LifeTimeTrnCount"
                                    value={editWalletUsagePolicyDetail.LifeTimeTrnCount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeEditNumber("LifeTimeTrnCount", e.target.value)
                                    }
                                />
                                {errors.LifeTimeTrnCount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.LifeTimeTrnCount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['DE2D0614-9607-4646-2D52-C01A6AE34B91'] && menuDetail['DE2D0614-9607-4646-2D52-C01A6AE34B91'].Visibility === "E925F86B") && //DE2D0614-9607-4646-2D52-C01A6AE34B91
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.LifeTimeTrnAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['DE2D0614-9607-4646-2D52-C01A6AE34B91'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="LifeTimeTrnAmount"
                                    value={editWalletUsagePolicyDetail.LifeTimeTrnAmount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeEditNumber("LifeTimeTrnAmount", e.target.value)
                                    }
                                />
                                {errors.LifeTimeTrnAmount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.LifeTimeTrnAmount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(menuDetail['CC72DE72-2194-857B-16CD-0193C71B749F'] && menuDetail['CC72DE72-2194-857B-16CD-0193C71B749F'].Visibility === "E925F86B") && //CC72DE72-2194-857B-16CD-0193C71B749F
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.MinAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['CC72DE72-2194-857B-16CD-0193C71B749F'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="MinAmount"
                                    value={editWalletUsagePolicyDetail.MinAmount}
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
                        {(menuDetail['1892090F-2232-5684-78CE-A66896B9347E'] && menuDetail['1892090F-2232-5684-78CE-A66896B9347E'].Visibility === "E925F86B") && //1892090F-2232-5684-78CE-A66896B9347E
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.MaxAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['1892090F-2232-5684-78CE-A66896B9347E'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="MaxAmount"
                                    value={editWalletUsagePolicyDetail.MaxAmount}
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
                        {(menuDetail['213A375B-222A-275E-46FB-83B9C4666DD5'] && menuDetail['213A375B-222A-275E-46FB-83B9C4666DD5'].Visibility === "E925F86B") && //213A375B-222A-275E-46FB-83B9C4666DD5
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.Status" />
                                </Label>
                                <Switch onClick={() => this.props.toggleEditSwitch(editWalletUsagePolicyDetail)}
                                enabled={(menuDetail['213A375B-222A-275E-46FB-83B9C4666DD5'].AccessRight === "11E6E7B0") ? false : true}
                                    on={(editWalletUsagePolicyDetail.Status === 1) ? true : false} />
                            </FormGroup>
                        }
                        {(menuDetail['C28521AA-3B18-8FBA-576D-149784EE1BA4'] && menuDetail['C28521AA-3B18-8FBA-576D-149784EE1BA4'].Visibility === "E925F86B") && //C28521AA-3B18-8FBA-576D-149784EE1BA4
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label for="StartTime">
                                    <IntlMessages id={"lable.startTime"} />
                                </Label>
                                <div className="timePicker">
                                    <TimePicker
                                        name="StartTime"
                                        disabled={(menuDetail['C28521AA-3B18-8FBA-576D-149784EE1BA4'].AccessRight === "11E6E7B0") ? true : false}
                                        value={editWalletUsagePolicyDetail.StartTime}
                                        onChange={e =>
                                            this.prop.handleEditDateChange("StartTime", e)
                                        }
                                    />
                                </div>
                            </FormGroup>
                        }
                        {(menuDetail['63E8B6E6-0D08-5375-3131-BC05076D16F7'] && menuDetail['63E8B6E6-0D08-5375-3131-BC05076D16F7'].Visibility === "E925F86B") && //63E8B6E6-0D08-5375-3131-BC05076D16F7
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label for="EndTime">
                                    <IntlMessages id={"lable.endTime"} />
                                </Label>
                                <div className="timePicker">
                                    <TimePicker
                                        name="EndTime"
                                        disabled={(menuDetail['63E8B6E6-0D08-5375-3131-BC05076D16F7'].AccessRight === "11E6E7B0") ? true : false}
                                        value={editWalletUsagePolicyDetail.EndTime}
                                        onChange={e =>
                                            this.props.handleEditDateChange("EndTime", e)
                                        }
                                    />
                                </div>
                            </FormGroup>
                        }
                        {(menuDetail['26596E0C-7AB6-1B95-4B24-7439BD520D49'] && menuDetail['26596E0C-7AB6-1B95-4B24-7439BD520D49'].Visibility === "E925F86B") && //26596E0C-7AB6-1B95-4B24-7439BD520D49
                            <FormGroup className="col-sm-12">
                                <Label>
                                    <IntlMessages id="lable.AllowedDays" />
                                </Label>
                                <div className="row ml-0">
                                    {days.map(
                                        (value, key) =>
                                            <FormControlLabel key={key} control={
                                                <Checkbox
                                                    disabled={(menuDetail['26596E0C-7AB6-1B95-4B24-7439BD520D49'].AccessRight === "11E6E7B0") ? true : false}
                                                    color="primary"
                                                    checked={editWalletUsagePolicyDetail.DayNo.indexOf((key + 1)) == -1 ? false : true}
                                                    onChange={e => this.props.handleDaysChange(e.target.checked, (key + 1))}
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
})(injectIntl(EditWalletUsagePolicy));

