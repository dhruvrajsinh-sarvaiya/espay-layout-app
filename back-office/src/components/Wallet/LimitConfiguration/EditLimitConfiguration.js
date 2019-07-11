import React, { Component, Fragment } from 'react'
import { Form, FormGroup, Label, Input } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import { TimePicker } from "material-ui-pickers";
import Switch from 'react-toggle-switch';
import { injectIntl } from "react-intl";
import { NotificationManager } from 'react-notifications';
import { connect } from "react-redux";
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
class EditLimitConfiguration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menudetail: [],
            notificationFlag: true,
        }
    }
    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.menuDetail ? '6525A743-A518-39A6-45CE-EDCA6D7E6EB9' :'CCDF9019-081A-22CB-1051-6A1D0A8A7CF8'); // get wallet menu permission
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
        var menuDetail = this.checkAndGetMenuAccessDetail(this.props.menuDetail ? '41E3440D-36AC-0122-7652-0552308E64BD':'CF0F289B-A5C5-642F-2933-15C5FA665CD3');
        const { UpdateRecord, errors, intl, TrnsactionType, walletType } = this.props;
        return (
            <Fragment>
                  {this.props.menuLoading && <JbsSectionLoader />}
                <Form className="row">
                    <div className="col-sm-12">
                        <div className="row">
                        {(this.props.menuDetail ? (menuDetail['FDA32EC7-9F88-6B79-646A-6252A0AE5373'] && menuDetail['FDA32EC7-9F88-6B79-646A-6252A0AE5373'].Visibility === "E925F86B"):(menuDetail['7B48B2FE-4FCA-2A75-7F07-35436FAF4732'] && menuDetail['7B48B2FE-4FCA-2A75-7F07-35436FAF4732'].Visibility === "E925F86B")) && //7B48B2FE-4FCA-2A75-7F07-35436FAF4732
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.TrnType" /><span className="text-danger"> *</span>
                                </Label>
                                <Input
                                    disabled={(this.props.menuDetail ? (menuDetail['FDA32EC7-9F88-6B79-646A-6252A0AE5373'].AccessRight === "11E6E7B0"):(menuDetail['7B48B2FE-4FCA-2A75-7F07-35436FAF4732'].AccessRight === "11E6E7B0") ? true : false)}
                                    type="select"
                                    // disabled
                                    name="type"
                                    className="form-control"
                                    id="type"
                                    value={UpdateRecord.TrnType}
                                    onChange={e =>
                                        this.props.onChangeEditNumber(
                                            "TrnType",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">{intl.formatMessage({ id: "lable.selectType" })} </option>
                                    {TrnsactionType.length > 0 &&
                                        TrnsactionType.map((list, index) => (
                                            <option key={index} value={list.TypeId}>
                                                {intl.formatMessage({ id: list.TypeName })}
                                            </option>
                                        ))}
                                </Input>
                            </FormGroup>
                        }
                        {(this.props.menuDetail ? (menuDetail['9BDF0513-5D13-A58F-5B6A-F76B703A05DC'] && menuDetail['9BDF0513-5D13-A58F-5B6A-F76B703A05DC'].Visibility === "E925F86B"):(menuDetail['002717DB-4AA5-5C08-8794-84B7444C18EA'] && menuDetail['002717DB-4AA5-5C08-8794-84B7444C18EA'].Visibility === "E925F86B")) && //002717DB-4AA5-5C08-8794-84B7444C18EA
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.WalletTypeName" /><span className="text-danger"> *</span>
                                </Label>
                                <Input
                                    disabled={(this.props.menuDetail ? (menuDetail['9BDF0513-5D13-A58F-5B6A-F76B703A05DC'].AccessRight === "11E6E7B0"):menuDetail['002717DB-4AA5-5C08-8794-84B7444C18EA'].AccessRight === "11E6E7B0") ? true : false}
                                    // disabled
                                    type="select"
                                    name="walletType"
                                    className="form-control"
                                    id="walletType"
                                    value={UpdateRecord.WalletType}
                                    onChange={e =>
                                        this.props.onChangeEditNumber(
                                            "walletType",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">{intl.formatMessage({ id: "tradingLedger.filterLabel.currency" })}</option>
                                    {walletType.length > 0 &&
                                        walletType.map((list, index) => (
                                            <option key={index} value={list.ID}>
                                                {list.TypeName}
                                            </option>
                                        ))}
                                </Input>
                            </FormGroup>
                        }
                        {(this.props.menuDetail ? (menuDetail['F6850D29-562C-3A59-443F-9CB9C7A041CC'] && menuDetail['F6850D29-562C-3A59-443F-9CB9C7A041CC'].Visibility === "E925F86B"):(menuDetail['D43A1212-9DEF-9CD4-0709-B0BF2E097BD5'] && menuDetail['D43A1212-9DEF-9CD4-0709-B0BF2E097BD5'].Visibility === "E925F86B")) && //D43A1212-9DEF-9CD4-0709-B0BF2E097BD5
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.PerTranMinAmount" /><span className="text-danger"> *</span>
                                </Label>
                                <Input
                                    disabled={(this.props.menuDetail ? (menuDetail['F6850D29-562C-3A59-443F-9CB9C7A041CC'].AccessRight === "11E6E7B0"):menuDetail['D43A1212-9DEF-9CD4-0709-B0BF2E097BD5'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="PerTranMinAmount"
                                    value={UpdateRecord.PerTranMinAmount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeEditNumber("PerTranMinAmount", e.target.value)
                                    }
                                />
                                {errors.PerTranMinAmount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.PerTranMinAmount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(this.props.menuDetail ? (menuDetail['0F1469C0-89EC-0AF0-2F3F-03B7102205D7'] && menuDetail['0F1469C0-89EC-0AF0-2F3F-03B7102205D7'].Visibility === "E925F86B"):(menuDetail['D29767FE-7F7E-1FD4-6891-A06438DF4A7D'] && menuDetail['D29767FE-7F7E-1FD4-6891-A06438DF4A7D'].Visibility === "E925F86B")) && //D29767FE-7F7E-1FD4-6891-A06438DF4A7D
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.PerTranMaxAmount" /><span className="text-danger"> *</span>
                                </Label>
                                <Input
                                    disabled={(this.props.menuDetail ? (menuDetail['0F1469C0-89EC-0AF0-2F3F-03B7102205D7'].AccessRight === "11E6E7B0"):menuDetail['D29767FE-7F7E-1FD4-6891-A06438DF4A7D'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="PerTranMaxAmount"
                                    value={UpdateRecord.PerTranMaxAmount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeEditNumber("PerTranMaxAmount", e.target.value)
                                    }
                                />
                                {errors.PerTranMaxAmount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.PerTranMaxAmount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(this.props.menuDetail ? (menuDetail['8E7AABF8-8094-89B3-2744-A5068BD25BD9'] && menuDetail['8E7AABF8-8094-89B3-2744-A5068BD25BD9'].Visibility === "E925F86B"):(menuDetail['76CD5445-544A-A4F7-4459-AFACAFE09E46'] && menuDetail['76CD5445-544A-A4F7-4459-AFACAFE09E46'].Visibility === "E925F86B")) && //76CD5445-544A-A4F7-4459-AFACAFE09E46
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.HourlyTrnCount" /><span className="text-danger"> *</span>
                                </Label>
                                <Input
                                    disabled={(this.props.menuDetail ? (menuDetail['8E7AABF8-8094-89B3-2744-A5068BD25BD9'].AccessRight === "11E6E7B0"):menuDetail['76CD5445-544A-A4F7-4459-AFACAFE09E46'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="HourlyTrnCount"
                                    value={UpdateRecord.HourlyTrnCount}
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
                        {(this.props.menuDetail ? (menuDetail['3224A774-0BA5-40C5-12B2-6E0C3D08383E'] && menuDetail['3224A774-0BA5-40C5-12B2-6E0C3D08383E'].Visibility === "E925F86B"):(menuDetail['8FF1D8C3-15B3-6E54-3142-E338CDA58795'] && menuDetail['8FF1D8C3-15B3-6E54-3142-E338CDA58795'].Visibility === "E925F86B")) && //8FF1D8C3-15B3-6E54-3142-E338CDA58795
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.HourlyTrnAmount" /><span className="text-danger"> *</span>
                                </Label>
                                <Input
                                    disabled={(this.props.menuDetail ? (menuDetail['3224A774-0BA5-40C5-12B2-6E0C3D08383E'].AccessRight === "11E6E7B0"):menuDetail['8FF1D8C3-15B3-6E54-3142-E338CDA58795'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="HourlyTrnAmount"
                                    value={UpdateRecord.HourlyTrnAmount}
                                    placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                    onChange={e =>
                                        this.props.onChangeEditNumber("HourlyTrnAmount", e.target.value)
                                    }
                                />
                                {errors.HourlyTrnAmount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.HourlyTrnAmount} />
                                    </span>
                                )}
                            </FormGroup>
                        }
                        {(this.props.menuDetail ? (menuDetail['8A97E076-65C5-5A45-7C0D-A2B9CAAD44EC'] && menuDetail['8A97E076-65C5-5A45-7C0D-A2B9CAAD44EC'].Visibility === "E925F86B"):(menuDetail['F3EF3C03-3242-4B6E-7323-1B5888918E28'] && menuDetail['F3EF3C03-3242-4B6E-7323-1B5888918E28'].Visibility === "E925F86B")) && //F3EF3C03-3242-4B6E-7323-1B5888918E28
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.DailyTrnCount" /><span className="text-danger"> *</span>
                                </Label>
                                <Input
                                    disabled={(this.props.menuDetail ? (menuDetail['8A97E076-65C5-5A45-7C0D-A2B9CAAD44EC'].AccessRight === "11E6E7B0"):menuDetail['F3EF3C03-3242-4B6E-7323-1B5888918E28'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="DailyTrnCount"
                                    value={UpdateRecord.DailyTrnCount}
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
                        {(this.props.menuDetail ? (menuDetail['E1C86F5F-15BE-8C86-5FD9-46B1DB1633D8'] && menuDetail['E1C86F5F-15BE-8C86-5FD9-46B1DB1633D8'].Visibility === "E925F86B"):(menuDetail['C5372BE4-40F7-3E39-92E2-31D691498856'] && menuDetail['C5372BE4-40F7-3E39-92E2-31D691498856'].Visibility === "E925F86B")) && //C5372BE4-40F7-3E39-92E2-31D691498856
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.DailyTrnAmount" /><span className="text-danger"> *</span>
                                </Label>
                                <Input
                                    disabled={(this.props.menuDetail ? (menuDetail['8A97E076-65C5-5A45-7C0D-A2B9CAAD44EC'].AccessRight === "11E6E7B0"):menuDetail['C5372BE4-40F7-3E39-92E2-31D691498856'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="DailyTrnAmount"
                                    value={UpdateRecord.DailyTrnAmount}
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
                        {(this.props.menuDetail ? (menuDetail['E363AFD3-5004-740E-9FDD-0C23D9637269'] && menuDetail['E363AFD3-5004-740E-9FDD-0C23D9637269'].Visibility === "E925F86B"):(menuDetail['242FC0DA-3E82-19A6-3FD6-740BB36A91A1'] && menuDetail['242FC0DA-3E82-19A6-3FD6-740BB36A91A1'].Visibility === "E925F86B")) && //242FC0DA-3E82-19A6-3FD6-740BB36A91A1
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.WeeklyTrnCount" /><span className="text-danger"> *</span>
                                </Label>
                                <Input
                                    disabled={(this.props.menuDetail ? (menuDetail['E363AFD3-5004-740E-9FDD-0C23D9637269'].AccessRight === "11E6E7B0"):menuDetail['242FC0DA-3E82-19A6-3FD6-740BB36A91A1'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="WeeklyTrnCount"
                                    value={UpdateRecord.WeeklyTrnCount}
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
                        {(this.props.menuDetail ? (menuDetail['985E2DF7-632A-15CB-721B-12866DAA5C9B'] && menuDetail['985E2DF7-632A-15CB-721B-12866DAA5C9B'].Visibility === "E925F86B"):(menuDetail['94E5E0F2-7EB3-1FE7-075B-0FF889080244'] && menuDetail['94E5E0F2-7EB3-1FE7-075B-0FF889080244'].Visibility === "E925F86B")) && //94E5E0F2-7EB3-1FE7-075B-0FF889080244
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.WeeklyTrnAmount" /><span className="text-danger"> *</span>
                                </Label>
                                <Input
                                    disabled={(this.props.menuDetail ? (menuDetail['985E2DF7-632A-15CB-721B-12866DAA5C9B'].AccessRight === "11E6E7B0"):menuDetail['94E5E0F2-7EB3-1FE7-075B-0FF889080244'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="WeeklyTrnAmount"
                                    value={UpdateRecord.WeeklyTrnAmount}
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
                        {(this.props.menuDetail ? (menuDetail['26C9DED9-449E-2105-4E20-8BDDC6E71E9E'] && menuDetail['26C9DED9-449E-2105-4E20-8BDDC6E71E9E'].Visibility === "E925F86B"):(menuDetail['C87A4443-56A3-A7BA-8683-B49B7AB4463B'] && menuDetail['C87A4443-56A3-A7BA-8683-B49B7AB4463B'].Visibility === "E925F86B")) && //C87A4443-56A3-A7BA-8683-B49B7AB4463B
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.MonthlyTrnCount" /><span className="text-danger"> *</span>
                                </Label>
                                <Input
                                    disabled={(this.props.menuDetail ? (menuDetail['26C9DED9-449E-2105-4E20-8BDDC6E71E9E'].AccessRight === "11E6E7B0"):menuDetail['C87A4443-56A3-A7BA-8683-B49B7AB4463B'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="MonthlyTrnCount"
                                    value={UpdateRecord.MonthlyTrnCount}
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
                        {(this.props.menuDetail ? (menuDetail['98BBDF08-0BE1-9FCA-3D94-D1EB9AB15C11'] && menuDetail['98BBDF08-0BE1-9FCA-3D94-D1EB9AB15C11'].Visibility === "E925F86B"):(menuDetail['9E180659-0928-4F99-7C4F-01469547466C'] && menuDetail['9E180659-0928-4F99-7C4F-01469547466C'].Visibility === "E925F86B")) && //9E180659-0928-4F99-7C4F-01469547466C
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.MonthlyTrnAmount" /><span className="text-danger"> *</span>
                                </Label>
                                <Input
                                    disabled={(this.props.menuDetail ? (menuDetail['98BBDF08-0BE1-9FCA-3D94-D1EB9AB15C11'].AccessRight === "11E6E7B0"):menuDetail['9E180659-0928-4F99-7C4F-01469547466C'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="MonthlyTrnAmount"
                                    value={UpdateRecord.MonthlyTrnAmount}
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
                        {(this.props.menuDetail ? (menuDetail['4437B1A3-1119-0261-0F8F-FEA478B83B7F'] && menuDetail['4437B1A3-1119-0261-0F8F-FEA478B83B7F'].Visibility === "E925F86B"):(menuDetail['D3B68C21-7E46-1795-41E5-52BE15242568'] && menuDetail['D3B68C21-7E46-1795-41E5-52BE15242568'].Visibility === "E925F86B")) && //D3B68C21-7E46-1795-41E5-52BE15242568
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.YearlyTrnCount" /><span className="text-danger"> *</span>
                                </Label>
                                <Input
                                    disabled={(this.props.menuDetail ? (menuDetail['4437B1A3-1119-0261-0F8F-FEA478B83B7F'].AccessRight === "11E6E7B0"):menuDetail['D3B68C21-7E46-1795-41E5-52BE15242568'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="YearlyTrnCount"
                                    value={UpdateRecord.YearlyTrnCount}
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
                        {(this.props.menuDetail ? (menuDetail['CCB32FDE-936C-5392-8E57-2258E9F77DE8'] && menuDetail['CCB32FDE-936C-5392-8E57-2258E9F77DE8'].Visibility === "E925F86B"):(menuDetail['7F74BD28-70FD-99E5-01D2-C94A85F4683F'] && menuDetail['7F74BD28-70FD-99E5-01D2-C94A85F4683F'].Visibility === "E925F86B")) && //7F74BD28-70FD-99E5-01D2-C94A85F4683F
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.YearlyTrnAmount" /><span className="text-danger"> *</span>
                                </Label>
                                <Input
                                    disabled={(this.props.menuDetail ? (menuDetail['CCB32FDE-936C-5392-8E57-2258E9F77DE8'].AccessRight === "11E6E7B0"):menuDetail['7F74BD28-70FD-99E5-01D2-C94A85F4683F'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="YearlyTrnAmount"
                                    value={UpdateRecord.YearlyTrnAmount}
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
                        {(this.props.menuDetail ? (menuDetail['79A84472-4BC7-791A-4A1C-D3A6B30B6C2E'] && menuDetail['79A84472-4BC7-791A-4A1C-D3A6B30B6C2E'].Visibility === "E925F86B"):(menuDetail['F095E35E-3F81-970F-1D84-108AC18C6242'] && menuDetail['F095E35E-3F81-970F-1D84-108AC18C6242'].Visibility === "E925F86B")) && //F095E35E-3F81-970F-1D84-108AC18C6242
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label for="StartTime" className="font-weight-bold">
                                    <IntlMessages id={"lable.startTime"} />
                                </Label>
                                <div className="timePicker">
                                    <TimePicker
                                        disabled={(this.props.menuDetail ? (menuDetail['79A84472-4BC7-791A-4A1C-D3A6B30B6C2E'].AccessRight === "11E6E7B0"):menuDetail['F095E35E-3F81-970F-1D84-108AC18C6242'].AccessRight === "11E6E7B0") ? true : false}
                                        name="StartTime"
                                        value={UpdateRecord.StartTime}
                                        onChange={e =>
                                            this.props.handleEditDateChange("StartTime", e)
                                        }
                                    />
                                </div>
                            </FormGroup>
                        }
                        {(this.props.menuDetail ? (menuDetail['EF733995-48BD-4B80-9EBB-221944B86FCE'] && menuDetail['EF733995-48BD-4B80-9EBB-221944B86FCE'].Visibility === "E925F86B"):(menuDetail['568DE997-39EB-76EF-07ED-C150B08B609C'] && menuDetail['568DE997-39EB-76EF-07ED-C150B08B609C'].Visibility === "E925F86B")) && //568DE997-39EB-76EF-07ED-C150B08B609C
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label for="EndTime" className="font-weight-bold">
                                    <IntlMessages id={"lable.endTime"} />
                                </Label>
                                <div className="timePicker">
                                    <TimePicker
                                        disabled={(this.props.menuDetail ? (menuDetail['EF733995-48BD-4B80-9EBB-221944B86FCE'].AccessRight === "11E6E7B0"):menuDetail['568DE997-39EB-76EF-07ED-C150B08B609C'].AccessRight === "11E6E7B0") ? true : false}
                                        name="EndTime"
                                        value={UpdateRecord.EndTime}
                                        onChange={e =>
                                            this.props.handleEditDateChange("EndTime", e)
                                        }
                                    />
                                </div>
                            </FormGroup>
                        }
                        {(this.props.menuDetail ? (menuDetail['B7897A26-6CD9-A098-541F-4731EABE76A3'] && menuDetail['B7897A26-6CD9-A098-541F-4731EABE76A3'].Visibility === "E925F86B"):(menuDetail['19948893-2E6E-6CD2-8AE0-CC5CF4474C9D'] && menuDetail['19948893-2E6E-6CD2-8AE0-CC5CF4474C9D'].Visibility === "E925F86B")) && //19948893-2E6E-6CD2-8AE0-CC5CF4474C9D
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.Status" />
                                </Label>
                                <Switch
                                    enabled={(this.props.menuDetail ? (menuDetail['B7897A26-6CD9-A098-541F-4731EABE76A3'].AccessRight === "11E6E7B0"):menuDetail['19948893-2E6E-6CD2-8AE0-CC5CF4474C9D'].AccessRight === "11E6E7B0") ? false : true}
                                    onClick={this.props.handleCheckChange("Status")}
                                    on={(UpdateRecord.Status === 1) ? true : false} />
                            </FormGroup>
                        }
                        {(this.props.menuDetail ? (menuDetail['E43E94F2-2A01-9980-6F25-2BE26EFF70BD'] && menuDetail['E43E94F2-2A01-9980-6F25-2BE26EFF70BD'].Visibility === "E925F86B"):(menuDetail['A8B28893-311E-121F-4FD3-EAC715963537'] && menuDetail['A8B28893-311E-121F-4FD3-EAC715963537'].Visibility === "E925F86B")) && //A8B28893-311E-121F-4FD3-EAC715963537
                            <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                <Label>
                                    <IntlMessages id="lable.KYCComplaint" />
                                </Label>
                                <Switch
                                    enabled={(this.props.menuDetail ? (menuDetail['E43E94F2-2A01-9980-6F25-2BE26EFF70BD'].AccessRight === "11E6E7B0"):menuDetail['A8B28893-311E-121F-4FD3-EAC715963537'].AccessRight === "11E6E7B0") ? false : true}
                                    // enabled={false}
                                    onClick={this.props.handleCheckChange("IsKYCEnable")}
                                    on={(UpdateRecord.IsKYCEnable === 1) ? true : false} />
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
export default connect (mapToProps, {
    getMenuPermissionByID
})(injectIntl(EditLimitConfiguration));