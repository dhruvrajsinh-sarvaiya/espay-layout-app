import React, { Component, Fragment } from 'react'
import { Form, FormGroup, Label, Input } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import { TimePicker } from "material-ui-pickers";
import Switch from 'react-toggle-switch';
import { injectIntl } from "react-intl";
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import { NotificationManager } from 'react-notifications';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { connect } from "react-redux";
class AddLimitConfiguration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menudetail: [],
            notificationFlag: true,
        }
    }
    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.menuDetail ? '6525A743-A518-39A6-45CE-EDCA6D7E6EB9' : 'CCDF9019-081A-22CB-1051-6A1D0A8A7CF8'); // get wallet menu permission
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
        var menuDetail = this.checkAndGetMenuAccessDetail(this.props.menuDetail ? 'BFC213CB-3FC5-33A9-38B6-455EE71690C0' : '7903E8C6-7914-3D67-78A7-903FA4F1484B');
        const { addNewDetail, TrnsactionType, walletType, errors, intl } = this.props;
        return (
            <Fragment>
                {this.props.menuLoading && <JbsSectionLoader />}
                <Form className="row">
                    <div className="col-sm-12">
                        <div className="row">
                            {(this.props.menuDetail ? (menuDetail['E1C86F5F-15BE-8C86-5FD9-46B1DB1633D8'] && menuDetail['E1C86F5F-15BE-8C86-5FD9-46B1DB1633D8'].Visibility === "E925F86B") : (menuDetail['1F40D099-563A-5EA9-22B5-8328C7D5514C'] && menuDetail['1F40D099-563A-5EA9-22B5-8328C7D5514C'].Visibility === "E925F86B")) && //1F40D099-563A-5EA9-22B5-8328C7D5514C
                                <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                    <Label>
                                        <IntlMessages id="lable.TrnType" /><span className="text-danger"> *</span>
                                    </Label>
                                    <Input
                                        disabled={this.props.menuDetail ? ((menuDetail['E1C86F5F-15BE-8C86-5FD9-46B1DB1633D8'].AccessRight === "11E6E7B0") ? true : false) : (menuDetail['1F40D099-563A-5EA9-22B5-8328C7D5514C'].AccessRight === "11E6E7B0") ? true : false}
                                        type="select"
                                        name="type"
                                        className="form-control"
                                        id="type"
                                        value={addNewDetail.TrnType}
                                        onChange={e =>
                                            this.props.onChangeText(
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
                                    {errors.TrnType && (
                                        <span className="text-danger">
                                            <IntlMessages id={errors.TrnType} />
                                        </span>
                                    )}
                                </FormGroup>
                            }
                            {(this.props.menuDetail ? (menuDetail['1B5A0EA6-A5B5-9661-6829-8B9B3AD6243D'] && menuDetail['1B5A0EA6-A5B5-9661-6829-8B9B3AD6243D'].Visibility === "E925F86B") : (menuDetail['EB397938-0453-1448-88CF-385F2BCA4C4D'] && menuDetail['EB397938-0453-1448-88CF-385F2BCA4C4D'].Visibility === "E925F86B")) && //EB397938-0453-1448-88CF-385F2BCA4C4D
                                <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                    <Label>
                                        <IntlMessages id="lable.WalletTypeName" /><span className="text-danger"> *</span>
                                    </Label>
                                    <Input
                                        disabled={this.props.menuDetail ? ((menuDetail['1B5A0EA6-A5B5-9661-6829-8B9B3AD6243D'].AccessRight === "11E6E7B0") ? true : false) : (menuDetail['EB397938-0453-1448-88CF-385F2BCA4C4D'].AccessRight === "11E6E7B0") ? true : false}
                                        type="select"
                                        name="walletType"
                                        className="form-control"
                                        id="walletType"
                                        value={addNewDetail.walletType}
                                        onChange={e =>
                                            this.props.onChangeText(
                                                "walletType",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">{intl.formatMessage({ id: "tradingLedger.filterLabel.currency" })}</option>
                                        {walletType.length  > 0 &&
                                            walletType.map((list, index) => (
                                                <option key={index} value={list.ID}>
                                                    {list.TypeName}
                                                </option>
                                            ))}
                                    </Input>
                                    {errors.walletType && (
                                        <span className="text-danger">
                                            <IntlMessages id={errors.walletType} />
                                        </span>
                                    )}
                                </FormGroup>
                            }
                            {(this.props.menuDetail ? (menuDetail['70818B83-7AF1-89DE-62B7-EA1B77295FAD'] && menuDetail['70818B83-7AF1-89DE-62B7-EA1B77295FAD'].Visibility === "E925F86B") : (menuDetail['EB053DC6-6245-4F10-50BA-BAB4E1A97CD6'] && menuDetail['EB053DC6-6245-4F10-50BA-BAB4E1A97CD6'].Visibility === "E925F86B")) && //EB053DC6-6245-4F10-50BA-BAB4E1A97CD6
                                <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                    <Label>
                                        <IntlMessages id="lable.PerTranMinAmount" /><span className="text-danger"> *</span>
                                    </Label>
                                    <Input
                                        disabled={this.props.menuDetail ? ((menuDetail['70818B83-7AF1-89DE-62B7-EA1B77295FAD'].AccessRight === "11E6E7B0") ? true : false) : (menuDetail['EB053DC6-6245-4F10-50BA-BAB4E1A97CD6'].AccessRight === "11E6E7B0") ? true : false}
                                        type="text"
                                        name="PerTranMinAmount"
                                        value={addNewDetail.PerTranMinAmount}
                                        placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                        onChange={e =>
                                            this.props.onChangeNumber("PerTranMinAmount", e.target.value)
                                        }
                                    />
                                    {errors.PerTranMinAmount && (
                                        <span className="text-danger">
                                            <IntlMessages id={errors.PerTranMinAmount} />
                                        </span>
                                    )}
                                </FormGroup>
                            }
                            {(this.props.menuDetail ? (menuDetail['83488508-257F-8240-8E73-A8A3CD9A77B5'] && menuDetail['83488508-257F-8240-8E73-A8A3CD9A77B5'].Visibility === "E925F86B") : (menuDetail['3C207D64-68DF-2116-0579-C128D1840190'] && menuDetail['3C207D64-68DF-2116-0579-C128D1840190'].Visibility === "E925F86B")) && //3C207D64-68DF-2116-0579-C128D1840190
                                <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                    <Label>
                                        <IntlMessages id="lable.PerTranMaxAmount" /><span className="text-danger"> *</span>
                                    </Label>
                                    <Input
                                        disabled={this.props.menuDetail ? ((menuDetail['83488508-257F-8240-8E73-A8A3CD9A77B5'].AccessRight === "11E6E7B0") ? true : false) : (menuDetail['3C207D64-68DF-2116-0579-C128D1840190'].AccessRight === "11E6E7B0") ? true : false}
                                        type="text"
                                        name="PerTranMaxAmount"
                                        value={addNewDetail.PerTranMaxAmount}
                                        placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                        onChange={e =>
                                            this.props.onChangeNumber("PerTranMaxAmount", e.target.value)
                                        }
                                    />
                                    {errors.PerTranMaxAmount && (
                                        <span className="text-danger">
                                            <IntlMessages id={errors.PerTranMaxAmount} />
                                        </span>
                                    )}
                                </FormGroup>
                            }
                            {(this.props.menuDetail ? (menuDetail['70818B83-7AF1-89DE-62B7-EA1B77295FAD'] && menuDetail['70818B83-7AF1-89DE-62B7-EA1B77295FAD'].Visibility === "E925F86B") : (menuDetail['F4B24A66-4A66-359D-7DA3-E51DF8222023'] && menuDetail['F4B24A66-4A66-359D-7DA3-E51DF8222023'].Visibility === "E925F86B")) && //F4B24A66-4A66-359D-7DA3-E51DF8222023
                                <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                    <Label>
                                        <IntlMessages id="lable.HourlyTrnCount" /><span className="text-danger"> *</span>
                                    </Label>
                                    <Input
                                        disabled={this.props.menuDetail ? ((menuDetail['70818B83-7AF1-89DE-62B7-EA1B77295FAD'].AccessRight === "11E6E7B0") ? true : false) : (menuDetail['F4B24A66-4A66-359D-7DA3-E51DF8222023'].AccessRight === "11E6E7B0") ? true : false}
                                        type="text"
                                        name="HourlyTrnCount"
                                        value={addNewDetail.HourlyTrnCount}
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
                            {(this.props.menuDetail ? (menuDetail['789763FC-4676-0DEC-920C-2A8EDC071AE1'] && menuDetail['789763FC-4676-0DEC-920C-2A8EDC071AE1'].Visibility === "E925F86B") : (menuDetail['5D9529BF-974D-2F89-14FC-4E55A9264CB1'] && menuDetail['5D9529BF-974D-2F89-14FC-4E55A9264CB1'].Visibility === "E925F86B")) && //5D9529BF-974D-2F89-14FC-4E55A9264CB1
                                <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                    <Label>
                                        <IntlMessages id="lable.HourlyTrnAmount" /><span className="text-danger"> *</span>
                                    </Label>
                                    <Input
                                        disabled={this.props.menuDetail ? ((menuDetail['789763FC-4676-0DEC-920C-2A8EDC071AE1'].AccessRight === "11E6E7B0") ? true : false) : (menuDetail['5D9529BF-974D-2F89-14FC-4E55A9264CB1'].AccessRight === "11E6E7B0") ? true : false}
                                        type="text"
                                        name="HourlyTrnAmount"
                                        value={addNewDetail.HourlyTrnAmount}
                                        placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                        onChange={e =>
                                            this.props.onChangeNumber("HourlyTrnAmount", e.target.value)
                                        }
                                    />
                                    {errors.HourlyTrnAmount && (
                                        <span className="text-danger">
                                            <IntlMessages id={errors.HourlyTrnAmount} />
                                        </span>
                                    )}
                                </FormGroup>
                            }
                            {(this.props.menuDetail ? (menuDetail['0AB5D8DF-2D73-1589-4777-48B6AECD94B9'] && menuDetail['0AB5D8DF-2D73-1589-4777-48B6AECD94B9'].Visibility === "E925F86B") : (menuDetail['C2430477-47AA-45FF-4F00-AD3F522368DD'] && menuDetail['C2430477-47AA-45FF-4F00-AD3F522368DD'].Visibility === "E925F86B")) && //C2430477-47AA-45FF-4F00-AD3F522368DD
                                <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                    <Label>
                                        <IntlMessages id="lable.DailyTrnCount" /><span className="text-danger"> *</span>
                                    </Label>
                                    <Input
                                        disabled={this.props.menuDetail ? ((menuDetail['0AB5D8DF-2D73-1589-4777-48B6AECD94B9'].AccessRight === "11E6E7B0") ? true : false) : (menuDetail['C2430477-47AA-45FF-4F00-AD3F522368DD'].AccessRight === "11E6E7B0") ? true : false}
                                        type="text"
                                        name="DailyTrnCount"
                                        value={addNewDetail.DailyTrnCount}
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
                            {(this.props.menuDetail ? (menuDetail['1765DC49-1665-A316-72F5-9B063A396CE9'] && menuDetail['1765DC49-1665-A316-72F5-9B063A396CE9'].Visibility === "E925F86B") : (menuDetail['BA241158-91ED-7B88-315D-F6C22FDA710A'] && menuDetail['BA241158-91ED-7B88-315D-F6C22FDA710A'].Visibility === "E925F86B")) && //BA241158-91ED-7B88-315D-F6C22FDA710A
                                <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                    <Label>
                                        <IntlMessages id="lable.DailyTrnAmount" /><span className="text-danger"> *</span>
                                    </Label>
                                    <Input
                                        disabled={this.props.menuDetail ? ((menuDetail['1765DC49-1665-A316-72F5-9B063A396CE9'].AccessRight === "11E6E7B0") ? true : false) : (menuDetail['BA241158-91ED-7B88-315D-F6C22FDA710A'].AccessRight === "11E6E7B0") ? true : false}
                                        type="text"
                                        name="DailyTrnAmount"
                                        value={addNewDetail.DailyTrnAmount}
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
                            {(this.props.menuDetail ? (menuDetail['6235CF58-80A7-0396-5C49-F5C1DF888350'] && menuDetail['6235CF58-80A7-0396-5C49-F5C1DF888350'].Visibility === "E925F86B") : (menuDetail['539039AF-79B1-8F29-71A9-7E8EFE9E8974'] && menuDetail['539039AF-79B1-8F29-71A9-7E8EFE9E8974'].Visibility === "E925F86B")) && //539039AF-79B1-8F29-71A9-7E8EFE9E8974
                                <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                    <Label>
                                        <IntlMessages id="lable.WeeklyTrnCount" /><span className="text-danger"> *</span>
                                    </Label>
                                    <Input
                                        disabled={this.props.menuDetail ? ((menuDetail['6235CF58-80A7-0396-5C49-F5C1DF888350'].AccessRight === "11E6E7B0") ? true : false) : (menuDetail['539039AF-79B1-8F29-71A9-7E8EFE9E8974'].AccessRight === "11E6E7B0") ? true : false}
                                        type="text"
                                        name="WeeklyTrnCount"
                                        value={addNewDetail.WeeklyTrnCount}
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
                            {(this.props.menuDetail ? (menuDetail['BD06F719-379D-8028-A304-FB287EDD6CA1'] && menuDetail['BD06F719-379D-8028-A304-FB287EDD6CA1'].Visibility === "E925F86B") : (menuDetail['F9A6564C-4E49-173F-3663-C02CD3291DD0'] && menuDetail['F9A6564C-4E49-173F-3663-C02CD3291DD0'].Visibility === "E925F86B")) && //F9A6564C-4E49-173F-3663-C02CD3291DD0
                                <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                    <Label>
                                        <IntlMessages id="lable.WeeklyTrnAmount" /><span className="text-danger"> *</span>
                                    </Label>
                                    <Input
                                        disabled={this.props.menuDetail ? ((menuDetail['BD06F719-379D-8028-A304-FB287EDD6CA1'].AccessRight === "11E6E7B0") ? true : false) : (menuDetail['F9A6564C-4E49-173F-3663-C02CD3291DD0'].AccessRight === "11E6E7B0") ? true : false}
                                        type="text"
                                        name="WeeklyTrnAmount"
                                        value={addNewDetail.WeeklyTrnAmount}
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
                            {(this.props.menuDetail ? (menuDetail['D2BB7327-59E0-553A-363C-71A192582ED2'] && menuDetail['D2BB7327-59E0-553A-363C-71A192582ED2'].Visibility === "E925F86B") : (menuDetail['6575A4E9-12C8-62DE-96B1-934406124B2E'] && menuDetail['6575A4E9-12C8-62DE-96B1-934406124B2E'].Visibility === "E925F86B")) && //6575A4E9-12C8-62DE-96B1-934406124B2E
                                <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                    <Label>
                                        <IntlMessages id="lable.MonthlyTrnCount" /><span className="text-danger"> *</span>
                                    </Label>
                                    <Input
                                        disabled={this.props.menuDetail ? ((menuDetail['D2BB7327-59E0-553A-363C-71A192582ED2'].AccessRight === "11E6E7B0") ? true : false) : (menuDetail['6575A4E9-12C8-62DE-96B1-934406124B2E'].AccessRight === "11E6E7B0") ? true : false}
                                        type="text"
                                        name="MonthlyTrnCount"
                                        value={addNewDetail.MonthlyTrnCount}
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
                            {(this.props.menuDetail ? (menuDetail['4547DA16-8EDD-5C3A-0C74-F8E8D91D5854'] && menuDetail['4547DA16-8EDD-5C3A-0C74-F8E8D91D5854'].Visibility === "E925F86B") : (menuDetail['361535B9-62A9-1B27-135C-E9D0376308E5'] && menuDetail['361535B9-62A9-1B27-135C-E9D0376308E5'].Visibility === "E925F86B")) && //361535B9-62A9-1B27-135C-E9D0376308E5
                                <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                    <Label>
                                        <IntlMessages id="lable.MonthlyTrnAmount" /><span className="text-danger"> *</span>
                                    </Label>
                                    <Input
                                        disabled={this.props.menuDetail ? ((menuDetail['4547DA16-8EDD-5C3A-0C74-F8E8D91D5854'].AccessRight === "11E6E7B0") ? true : false) : (menuDetail['361535B9-62A9-1B27-135C-E9D0376308E5'].AccessRight === "11E6E7B0") ? true : false}
                                        type="text"
                                        name="MonthlyTrnAmount"
                                        value={addNewDetail.MonthlyTrnAmount}
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
                            {(this.props.menuDetail ? (menuDetail['856F58AF-765D-1F98-754B-BED1AABA9E77'] && menuDetail['856F58AF-765D-1F98-754B-BED1AABA9E77'].Visibility === "E925F86B") : (menuDetail['556C024D-5A8E-78E9-5D85-1C11EFB0A2AE'] && menuDetail['556C024D-5A8E-78E9-5D85-1C11EFB0A2AE'].Visibility === "E925F86B")) && //556C024D-5A8E-78E9-5D85-1C11EFB0A2AE
                                <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                    <Label>
                                        <IntlMessages id="lable.YearlyTrnCount" /><span className="text-danger"> *</span>
                                    </Label>
                                    <Input
                                        disabled={this.props.menuDetail ? ((menuDetail['856F58AF-765D-1F98-754B-BED1AABA9E77'].AccessRight === "11E6E7B0") ? true : false) : (menuDetail['556C024D-5A8E-78E9-5D85-1C11EFB0A2AE'].AccessRight === "11E6E7B0") ? true : false}
                                        type="text"
                                        name="YearlyTrnCount"
                                        value={addNewDetail.YearlyTrnCount}
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
                            {(this.props.menuDetail ? (menuDetail['B230499B-388C-7A84-1265-F4D45B2846D0'] && menuDetail['B230499B-388C-7A84-1265-F4D45B2846D0'].Visibility === "E925F86B") : (menuDetail['A7C96F31-6C61-58D4-3C4E-7BB9AE825081'] && menuDetail['A7C96F31-6C61-58D4-3C4E-7BB9AE825081'].Visibility === "E925F86B")) && //A7C96F31-6C61-58D4-3C4E-7BB9AE825081
                                <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                    <Label>
                                        <IntlMessages id="lable.YearlyTrnAmount" /><span className="text-danger"> *</span>
                                    </Label>
                                    <Input
                                        disabled={this.props.menuDetail ? ((menuDetail['B230499B-388C-7A84-1265-F4D45B2846D0'].AccessRight === "11E6E7B0") ? true : false) : (menuDetail['A7C96F31-6C61-58D4-3C4E-7BB9AE825081'].AccessRight === "11E6E7B0") ? true : false}
                                        type="text"
                                        name="YearlyTrnAmount"
                                        value={addNewDetail.YearlyTrnAmount}
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
                            {(this.props.menuDetail ? (menuDetail['AB1AE6FD-3732-54E6-2DE1-78FD445998F8'] && menuDetail['AB1AE6FD-3732-54E6-2DE1-78FD445998F8'].Visibility === "E925F86B") : (menuDetail['7E1716AE-7017-24E7-43B4-CB63906968BC'] && menuDetail['7E1716AE-7017-24E7-43B4-CB63906968BC'].Visibility === "E925F86B")) && //7E1716AE-7017-24E7-43B4-CB63906968BC
                                <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                    <Label for="StartTime" className="font-weight-bold">
                                        <IntlMessages id={"lable.startTime"} />
                                    </Label>
                                    <div className="timePicker">
                                        <TimePicker
                                            disabled={this.props.menuDetail ? ((menuDetail['AB1AE6FD-3732-54E6-2DE1-78FD445998F8'].AccessRight === "11E6E7B0") ? true : false) : (menuDetail['7E1716AE-7017-24E7-43B4-CB63906968BC'].AccessRight === "11E6E7B0") ? true : false}
                                            name="StartTime"
                                            value={addNewDetail.StartTime}
                                            onChange={e =>
                                                this.props.handleDateChange("StartTime", e)
                                            }
                                        />
                                    </div>
                                </FormGroup>
                            }
                            {(this.props.menuDetail ? (menuDetail['D8FDC14F-63D5-13D2-0162-59D0D6F359C0'] && menuDetail['D8FDC14F-63D5-13D2-0162-59D0D6F359C0'].Visibility === "E925F86B") : (menuDetail['34440F9A-68F1-9587-7D19-8B8C038844C0'] && menuDetail['34440F9A-68F1-9587-7D19-8B8C038844C0'].Visibility === "E925F86B")) && //34440F9A-68F1-9587-7D19-8B8C038844C0
                                <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                    <Label for="EndTime" className="font-weight-bold">
                                        <IntlMessages id={"lable.endTime"} />
                                    </Label>
                                    <div className="timePicker">
                                        <TimePicker
                                            disabled={this.props.menuDetail ? ((menuDetail['D8FDC14F-63D5-13D2-0162-59D0D6F359C0'].AccessRight === "11E6E7B0") ? true : false) : (menuDetail['34440F9A-68F1-9587-7D19-8B8C038844C0'].AccessRight === "11E6E7B0") ? true : false}
                                            name="EndTime"
                                            value={addNewDetail.EndTime}
                                            onChange={e =>
                                                this.props.handleDateChange("EndTime", e)
                                            }
                                        />
                                    </div>
                                </FormGroup>
                            }
                            {(this.props.menuDetail ? (menuDetail['2A0D3F0E-8242-58D2-7008-4389569471E4'] && menuDetail['2A0D3F0E-8242-58D2-7008-4389569471E4'].Visibility === "E925F86B") : (menuDetail['05B25C05-A238-0AAB-A3E3-EDB5F6083CFA'] && menuDetail['05B25C05-A238-0AAB-A3E3-EDB5F6083CFA'].Visibility === "E925F86B")) && //05B25C05-A238-0AAB-A3E3-EDB5F6083CFA
                                <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                    <Label>
                                        <IntlMessages id="lable.Status" />
                                    </Label>
                                    <Switch
                                        enabled={this.props.menuDetail ? ((menuDetail['2A0D3F0E-8242-58D2-7008-4389569471E4'].AccessRight === "11E6E7B0") ? false : true) : (menuDetail['05B25C05-A238-0AAB-A3E3-EDB5F6083CFA'].AccessRight === "11E6E7B0") ? false : true}
                                        onClick={this.props.handleCheckChange("Status")}
                                        on={(addNewDetail.Status === "1") ? true : false} />
                                </FormGroup>
                            }
                            {(this.props.menuDetail ? (menuDetail['590882FC-7297-9EBF-4EBD-8C5C2E5F6DF6'] && menuDetail['590882FC-7297-9EBF-4EBD-8C5C2E5F6DF6'].Visibility === "E925F86B") : (menuDetail['A7700349-321E-5B72-3287-9BD7C4137B57'] && menuDetail['A7700349-321E-5B72-3287-9BD7C4137B57'].Visibility === "E925F86B")) && //A7700349-321E-5B72-3287-9BD7C4137B57
                                <FormGroup className="col-md-3 col-sm-4 col-xs-12">
                                    <Label>
                                        <IntlMessages id="lable.KYCComplaint" />
                                    </Label>
                                    <Switch
                                        enabled={this.props.menuDetail ? ((menuDetail['590882FC-7297-9EBF-4EBD-8C5C2E5F6DF6'].AccessRight === "11E6E7B0") ? false : true) : (menuDetail['A7700349-321E-5B72-3287-9BD7C4137B57'].AccessRight === "11E6E7B0") ? false : true}
                                        onClick={this.props.handleCheckChange("IsKYCEnable")}
                                        on={(addNewDetail.IsKYCEnable === "1") ? true : false} />
                                </FormGroup>
                            }
                        </div>
                    </div>
                </Form>
            </Fragment>
        )
    }
}
AddLimitConfiguration.defaultProps = {
    addNewDetail: {
        TrnType: "",
        walletType: "",
        PerTranMinAmount: "",
        PerTranMaxAmount: "",
        StartTime: null,
        EndTime: null,
        HourlyTrnCount: "",
        HourlyTrnAmount: "",
        DailyTrnCount: "",
        DailyTrnAmount: "",
        MonthlyTrnCount: "",
        MonthlyTrnAmount: "",
        WeeklyTrnCount: "",
        WeeklyTrnAmount: "",
        YearlyTrnCount: "",
        YearlyTrnAmount: "",
        Status: "0",
        IsKYCEnable: "0"
    }
};
const mapToProps = ({ authTokenRdcer }) => {
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { menuLoading, menu_rights };
};
export default connect(mapToProps, {
    getMenuPermissionByID
})(injectIntl(AddLimitConfiguration));