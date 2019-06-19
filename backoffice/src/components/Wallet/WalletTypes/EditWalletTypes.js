import React,{ Component, Fragment } from 'react'
import { Form, FormGroup, Label, Input, Col } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import Switch from 'react-toggle-switch';
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { NotificationManager } from 'react-notifications';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
class EditWalletTypes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menudetail: [],
            notificationFlag: true,
        }
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('18FCC217-A78E-9CF9-6904-F17706051384'); // get wallet menu permission
    }
    componentWillReceiveProps(nextProps) {
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getWalletTypeMaster();
                this.props.getCurrencyList();
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
        var menuDetail = this.checkAndGetMenuAccessDetail('308F3AF6-8741-703C-2399-8A29348D5472'); //308F3AF6-8741-703C-2399-8A29348D5472
        const { editWalletTypeMastereDetail, currencyList, errors, intl } = this.props;
        return (
            <Fragment>
                 {this.props.menuLoading && <JbsSectionLoader />}
                {editWalletTypeMastereDetail.hasOwnProperty("CoinName") &&
                    <Form>
                        {(menuDetail['6EEFBEF1-197A-83E5-7975-714AA65F3A9A'] && menuDetail['6EEFBEF1-197A-83E5-7975-714AA65F3A9A'].Visibility === "E925F86B") && //6EEFBEF1-197A-83E5-7975-714AA65F3A9A
                        <FormGroup row>
                            <Label sm={4} className="d-inline">
                                <IntlMessages id="table.currency" /><span className="text-danger">*</span>
                            </Label>
                            <Col sm={8}>
                                <Input
                                    disabled={(menuDetail['6EEFBEF1-197A-83E5-7975-714AA65F3A9A'].AccessRight === "11E6E7B0") ? true : false}
                                    type="select"
                                    name="WalletTypeName"
                                    className="form-control"
                                    id="WalletTypeName"
                                    value={editWalletTypeMastereDetail.CoinName}
                                    // disabled={true}
                                    onChange={e =>
                                        this.props.onChangeEditText(
                                            "CoinName",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">{intl.formatMessage({ id: "sidebar.sitetoken.list.lable.enter.currencyId" })}</option>
                                    {currencyList.length &&
                                        currencyList.map((list, index) => (
                                            <option key={index} value={list.SMSCode}>
                                                {list.SMSCode}
                                            </option>
                                        ))}
                                </Input>
                                {errors.CoinName && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.CoinName} />
                                    </span>
                                )}
                            </Col>
                        </FormGroup>
                        }
                        {(menuDetail['D50BCC00-A6CB-0152-0F4E-9B93A45F9CE4'] && menuDetail['D50BCC00-A6CB-0152-0F4E-9B93A45F9CE4'].Visibility === "E925F86B") && //D50BCC00-A6CB-0152-0F4E-9B93A45F9CE4
                        <FormGroup row>
                            <Label sm={4} className="d-inline">
                                <IntlMessages id="lable.Description" /><span className="text-danger">*</span>
                            </Label>
                            <Col sm={8}>
                                <Input
                                    disabled={(menuDetail['D50BCC00-A6CB-0152-0F4E-9B93A45F9CE4'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="Description"
                                    maxLength="100"
                                    value={editWalletTypeMastereDetail.Description}
                                    onChange={e =>
                                        this.props.onChangeEditText("Description", e.target.value)
                                    }
                                />
                                {errors.Description && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.Description} />
                                    </span>
                                )}
                            </Col>
                        </FormGroup>
                        }
                        {(menuDetail['30A1C38C-519D-8001-A0D2-46F76AE31B31'] && menuDetail['30A1C38C-519D-8001-A0D2-46F76AE31B31'].Visibility === "E925F86B") && //30A1C38C-519D-8001-A0D2-46F76AE31B31
                        <FormGroup row>
                            <Label sm={4}>
                                <IntlMessages id="lable.DepositionAllow" />
                            </Label>
                            <Col sm={8}>
                                <Switch onClick={() => this.props.toggleDepositionAllowEditSwitch(editWalletTypeMastereDetail)}
                                enabled={(menuDetail['30A1C38C-519D-8001-A0D2-46F76AE31B31'].AccessRight === "11E6E7B0") ? false : true}
                                    on={(editWalletTypeMastereDetail.IsDepositionAllow === 1) ? true : false} />
                            </Col>
                        </FormGroup>
                        }
                        {(menuDetail['1B917693-9461-8AA8-0CC3-C566742BA756'] && menuDetail['1B917693-9461-8AA8-0CC3-C566742BA756'].Visibility === "E925F86B") && //1B917693-9461-8AA8-0CC3-C566742BA756
                        <FormGroup row>
                            <Label sm={4}>
                                <IntlMessages id="lable.WithdrawalAllow" />
                            </Label>
                            <Col sm={8}>
                                <Switch onClick={() => this.props.toggleWithdrawalAllowEditSwitch(editWalletTypeMastereDetail)}
                                enabled={(menuDetail['1B917693-9461-8AA8-0CC3-C566742BA756'].AccessRight === "11E6E7B0") ? false : true}
                                    on={(editWalletTypeMastereDetail.IsWithdrawalAllow === 1) ? true : false} />
                            </Col>
                        </FormGroup>
                        }
                        {(menuDetail['26AE9558-3618-A6F1-615B-8F7A7EEA6DF8'] && menuDetail['26AE9558-3618-A6F1-615B-8F7A7EEA6DF8'].Visibility === "E925F86B") && //26AE9558-3618-A6F1-615B-8F7A7EEA6DF8
                        <FormGroup row>
                            <Label sm={4}>
                                <IntlMessages id="lable.TransactionAllow" />
                            </Label>
                            <Col sm={8}>
                                <Switch onClick={() => this.props.toggleTransactionWalletEditSwitch(editWalletTypeMastereDetail)}
                                enabled={(menuDetail['26AE9558-3618-A6F1-615B-8F7A7EEA6DF8'].AccessRight === "11E6E7B0") ? false : true}
                                    on={(editWalletTypeMastereDetail.IsTransactionWallet === 1) ? true : false} />
                            </Col>
                        </FormGroup>
                        }
                        {(menuDetail['3FF85E56-3BC2-75A8-7CED-C4E2E9E1713F'] && menuDetail['3FF85E56-3BC2-75A8-7CED-C4E2E9E1713F'].Visibility === "E925F86B") && //3FF85E56-3BC2-75A8-7CED-C4E2E9E1713F
                        <FormGroup row>
                            <Label sm={4}>
                                <IntlMessages id="lable.Status" />
                            </Label>
                            <Col sm={4}>
                                <Switch onClick={() => this.props.toggleStatusEditSwitch(editWalletTypeMastereDetail, "Status")}
                                enabled={(menuDetail['3FF85E56-3BC2-75A8-7CED-C4E2E9E1713F'].AccessRight === "11E6E7B0") ? false : true}
                                    on={(editWalletTypeMastereDetail.Status === 1) ? true : false} />
                            </Col>
                        </FormGroup>
                        }
                    </Form>}
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
})(injectIntl(EditWalletTypes));
