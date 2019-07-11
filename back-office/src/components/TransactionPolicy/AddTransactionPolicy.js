import React, { Component, Fragment } from 'react'
import { Form, FormGroup, Label, Input } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import { TimePicker } from "material-ui-pickers";
import Switch from 'react-toggle-switch';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { NotificationManager } from 'react-notifications';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
class AddTransactionPolicy extends Component { 
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
        var menuDetail = this.checkAndGetMenuAccessDetail('C72BD7FF-3E59-4786-4ED3-E828555552BB');
        const { addNewTransactionPolicyDetail, TrnsactionType, Roles, errors, intl} = this.props;
        return (
            <Fragment>
                {this.props.menuLoading && <JbsSectionLoader />}
                <Form className="row">
                    <div className="col-sm-12">
                        <div className="row">
                        {(menuDetail['B4028373-3168-1D32-6BF0-2F33EF697145'] && menuDetail['B4028373-3168-1D32-6BF0-2F33EF697145'].Visibility === "E925F86B") && //B4028373-3168-1D32-6BF0-2F33EF697145
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.TrnType" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['B4028373-3168-1D32-6BF0-2F33EF697145'].AccessRight === "11E6E7B0") ? true : false}
                                    type="select"
                                    name="type"
                                    className="form-control"
                                    id="type"
                                    value={addNewTransactionPolicyDetail.TrnType}
                                    onChange={e =>
                                        this.props.onChangeText(
                                            "TrnType",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">{intl.formatMessage({ id: "lable.selectType" })}</option>
                                    {TrnsactionType.length > 0 &&
                                        TrnsactionType.map((list, index) => (
                                            <option key={index} value={list.TypeId}>
                                                {list.TypeName}
                                            </option>
                                        ))}
                                </Input>
                                {errors.TrnType && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.TrnType} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                         {(menuDetail['866F79EE-454F-63D1-0C19-585474E48ECB'] && menuDetail['866F79EE-454F-63D1-0C19-585474E48ECB'].Visibility === "E925F86B") && //866F79EE-454F-63D1-0C19-585474E48ECB
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.RoleType" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['866F79EE-454F-63D1-0C19-585474E48ECB'].AccessRight === "11E6E7B0") ? true : false}
                                    type="select"
                                    name="Roletype"
                                    className="form-control"
                                    id="Roletype"
                                    value={addNewTransactionPolicyDetail.RoleId}
                                    onChange={e =>
                                        this.props.onChangeText(
                                            "RoleId",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">{intl.formatMessage({ id: "lable.selectType" })}</option>
                                    {Roles.length > 0 &&
                                        Roles.map((list, index) => (
                                            <option key={index} value={list.ID}>
                                                {list.RoleName}
                                            </option>
                                        ))}
                                </Input>
                                {errors.RoleId && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.RoleId} />
                                    </span>
                                )}
                            </FormGroup>
                         }
                          {(menuDetail['E4362C83-2A9B-1AA2-6C57-95DC83FB29F9'] && menuDetail['E4362C83-2A9B-1AA2-6C57-95DC83FB29F9'].Visibility === "E925F86B") && //E4362C83-2A9B-1AA2-6C57-95DC83FB29F9
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.AllowedIP" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['E4362C83-2A9B-1AA2-6C57-95DC83FB29F9'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="AllowedIP"
                                    value={addNewTransactionPolicyDetail.AllowedIP}
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
                           {(menuDetail['DB90C277-A3A9-8482-29DF-1337199242F9'] && menuDetail['DB90C277-A3A9-8482-29DF-1337199242F9'].Visibility === "E925F86B") && //DB90C277-A3A9-8482-29DF-1337199242F9
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.AllowedLocation" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['DB90C277-A3A9-8482-29DF-1337199242F9'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="AllowedLocation"
                                    value={addNewTransactionPolicyDetail.AllowedLocation}
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
                            {(menuDetail['416C7378-4EC8-2896-78F0-0EDE88621B1B'] && menuDetail['416C7378-4EC8-2896-78F0-0EDE88621B1B'].Visibility === "E925F86B") && //416C7378-4EC8-2896-78F0-0EDE88621B1B
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.AuthenticationType" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['416C7378-4EC8-2896-78F0-0EDE88621B1B'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="AuthenticationType"
                                    value={addNewTransactionPolicyDetail.AuthenticationType}
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
                            {(menuDetail['AE5F582E-7B98-834C-71AA-6E145A5D005C'] && menuDetail['AE5F582E-7B98-834C-71AA-6E145A5D005C'].Visibility === "E925F86B") && //AE5F582E-7B98-834C-71AA-6E145A5D005C
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.DailyTrnCount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['AE5F582E-7B98-834C-71AA-6E145A5D005C'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="DailyTrnCount"
                                    value={addNewTransactionPolicyDetail.DailyTrnCount}
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
                            {(menuDetail['77C58CF5-50B4-5C14-6360-4F283C4B0128'] && menuDetail['77C58CF5-50B4-5C14-6360-4F283C4B0128'].Visibility === "E925F86B") && //77C58CF5-50B4-5C14-6360-4F283C4B0128
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.DailyTrnAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['77C58CF5-50B4-5C14-6360-4F283C4B0128'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="DailyTrnAmount"
                                    value={addNewTransactionPolicyDetail.DailyTrnAmount}
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
                            {(menuDetail['9D5CF5A1-8247-846F-4ADC-75FE9F90396D'] && menuDetail['9D5CF5A1-8247-846F-4ADC-75FE9F90396D'].Visibility === "E925F86B") && //9D5CF5A1-8247-846F-4ADC-75FE9F90396D
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.MonthlyTrnCount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['9D5CF5A1-8247-846F-4ADC-75FE9F90396D'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="MonthlyTrnCount"
                                    value={addNewTransactionPolicyDetail.MonthlyTrnCount}
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
                            {(menuDetail['814E6A89-A5B2-271C-7E27-ADB6F16427D5'] && menuDetail['814E6A89-A5B2-271C-7E27-ADB6F16427D5'].Visibility === "E925F86B") && //814E6A89-A5B2-271C-7E27-ADB6F16427D5
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.MonthlyTrnAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['814E6A89-A5B2-271C-7E27-ADB6F16427D5'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="MonthlyTrnAmount"
                                    value={addNewTransactionPolicyDetail.MonthlyTrnAmount}
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
                            {(menuDetail['C5AA4662-4F26-9A72-1025-C50B4C7F6D33'] && menuDetail['C5AA4662-4F26-9A72-1025-C50B4C7F6D33'].Visibility === "E925F86B") && //C5AA4662-4F26-9A72-1025-C50B4C7F6D33
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.WeeklyTrnCount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['C5AA4662-4F26-9A72-1025-C50B4C7F6D33'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="WeeklyTrnCount"
                                    value={addNewTransactionPolicyDetail.WeeklyTrnCount}
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
                            {(menuDetail['168F8294-52FB-48D6-32E5-3E3E96124C1B'] && menuDetail['168F8294-52FB-48D6-32E5-3E3E96124C1B'].Visibility === "E925F86B") && //168F8294-52FB-48D6-32E5-3E3E96124C1B
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.WeeklyTrnAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['168F8294-52FB-48D6-32E5-3E3E96124C1B'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="WeeklyTrnAmount"
                                    value={addNewTransactionPolicyDetail.WeeklyTrnAmount}
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
                            {(menuDetail['A3BDE5D1-1EE8-5379-163C-F26E15B28105'] && menuDetail['A3BDE5D1-1EE8-5379-163C-F26E15B28105'].Visibility === "E925F86B") && //A3BDE5D1-1EE8-5379-163C-F26E15B28105
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.YearlyTrnCount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['A3BDE5D1-1EE8-5379-163C-F26E15B28105'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="YearlyTrnCount"
                                    value={addNewTransactionPolicyDetail.YearlyTrnCount}
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
                            {(menuDetail['EA9C6204-370F-92D4-69F6-D541DD0D10B5'] && menuDetail['EA9C6204-370F-92D4-69F6-D541DD0D10B5'].Visibility === "E925F86B") && //EA9C6204-370F-92D4-69F6-D541DD0D10B5
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.YearlyTrnAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['EA9C6204-370F-92D4-69F6-D541DD0D10B5'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="YearlyTrnAmount"
                                    value={addNewTransactionPolicyDetail.YearlyTrnAmount}
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
                            {(menuDetail['10BC37A3-2AF9-6433-0BF3-AF242BF95A9D'] && menuDetail['10BC37A3-2AF9-6433-0BF3-AF242BF95A9D'].Visibility === "E925F86B") && //10BC37A3-2AF9-6433-0BF3-AF242BF95A9D
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.MinAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['10BC37A3-2AF9-6433-0BF3-AF242BF95A9D'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="MinAmount"
                                    value={addNewTransactionPolicyDetail.MinAmount}
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
                             {(menuDetail['865A6F96-22BA-9D45-386C-CA191B8D952A'] && menuDetail['865A6F96-22BA-9D45-386C-CA191B8D952A'].Visibility === "E925F86B") && //865A6F96-22BA-9D45-386C-CA191B8D952A
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.MaxAmount" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['865A6F96-22BA-9D45-386C-CA191B8D952A'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="MaxAmount"
                                    value={addNewTransactionPolicyDetail.MaxAmount}
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
                            {(menuDetail['EF802D53-3989-39D8-255B-557378F008A6'] && menuDetail['EF802D53-3989-39D8-255B-557378F008A6'].Visibility === "E925F86B") && //EF802D53-3989-39D8-255B-557378F008A6
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.AuthorityType" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['EF802D53-3989-39D8-255B-557378F008A6'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="AuthorityType"
                                    value={addNewTransactionPolicyDetail.AuthorityType}
                                    onChange={e =>
                                        this.props.onChangeNumber("AuthorityType", e.target.value)
                                    }
                                />
                                {errors.AuthorityType && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.AuthorityType} />
                                    </span>
                                )}
                            </FormGroup>
                            }
                            {(menuDetail['F1498EB2-6CFF-8664-255F-8A71F4CF0D22'] && menuDetail['F1498EB2-6CFF-8664-255F-8A71F4CF0D22'].Visibility === "E925F86B") && //F1498EB2-6CFF-8664-255F-8A71F4CF0D22
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.AllowedUserType" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['F1498EB2-6CFF-8664-255F-8A71F4CF0D22'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="AllowedUserType"
                                    value={addNewTransactionPolicyDetail.AllowedUserType}
                                    onChange={e =>
                                        this.props.onChangeNumber("AllowedUserType", e.target.value)
                                    }
                                />
                                {errors.AllowedUserType && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.AllowedUserType} />
                                    </span>
                                )}
                            </FormGroup>
                            }
                            {(menuDetail['96148DA4-609F-18E6-5E45-8FEA549298FE'] && menuDetail['96148DA4-609F-18E6-5E45-8FEA549298FE'].Visibility === "E925F86B") && //96148DA4-609F-18E6-5E45-8FEA549298FE
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label for="StartTime" className="font-weight-bold">
                                    <IntlMessages id={"lable.startTime"} />
                                </Label>
                                <div className="timePicker">
                                    <TimePicker
                                        name="StartTime"
                                        value={addNewTransactionPolicyDetail.StartTime}
                                        disabled={(menuDetail['96148DA4-609F-18E6-5E45-8FEA549298FE'].AccessRight === "11E6E7B0") ? true : false}
                                        onChange={e =>
                                            this.props.handleDateChange("StartTime", e)
                                        }
                                    />
                                </div>
                            </FormGroup>
                            }
                            {(menuDetail['46D00073-56CB-3701-28A8-8735365D5A42'] && menuDetail['46D00073-56CB-3701-28A8-8735365D5A42'].Visibility === "E925F86B") && //46D00073-56CB-3701-28A8-8735365D5A42
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label for="EndTime" className="font-weight-bold">
                                    <IntlMessages id={"lable.endTime"} />
                                </Label>
                                <div className="timePicker">
                                    <TimePicker
                                        name="EndTime"
                                        value={addNewTransactionPolicyDetail.EndTime}
                                        disabled={(menuDetail['46D00073-56CB-3701-28A8-8735365D5A42'].AccessRight === "11E6E7B0") ? true : false}
                                        onChange={e =>
                                            this.props.handleDateChange("EndTime", e)
                                        }
                                    />
                                </div>
                            </FormGroup>
                            }
                            {(menuDetail['4FE3B75C-1250-6B37-4BFD-9F66ABFF19E9'] && menuDetail['4FE3B75C-1250-6B37-4BFD-9F66ABFF19E9'].Visibility === "E925F86B") && //4FE3B75C-1250-6B37-4BFD-9F66ABFF19E9
                            <FormGroup className="col-sm-2">
                                <Label>
                                    <IntlMessages id="lable.Status" />
                                </Label>
                                <Switch
                                    onClick={this.props.handleCheckChange()}
                                    enabled={(menuDetail['4FE3B75C-1250-6B37-4BFD-9F66ABFF19E9'].AccessRight === "11E6E7B0") ? false : true}
                                    on={(addNewTransactionPolicyDetail.Status === "1") ? true : false} />
                            </FormGroup>
                            }
                            {(menuDetail['DB2029F3-3C33-2008-8BC7-44D95F530FD9'] && menuDetail['DB2029F3-3C33-2008-8BC7-44D95F530FD9'].Visibility === "E925F86B") && //DB2029F3-3C33-2008-8BC7-44D95F530FD9
                            <FormGroup className="col-sm-2">
                                <Label>
                                    <IntlMessages id="wallet.KYCOnly" />
                                </Label>
                                <Switch
                                    onClick={this.props.handleKYCChange()}
                                    enabled={(menuDetail['DB2029F3-3C33-2008-8BC7-44D95F530FD9'].AccessRight === "11E6E7B0") ? false : true}
                                    on={(addNewTransactionPolicyDetail.IsKYCEnable === "1") ? true : false} />
                            </FormGroup>
                            }
                        </div>
                    </div>
                </Form>
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
})(injectIntl(AddTransactionPolicy));
