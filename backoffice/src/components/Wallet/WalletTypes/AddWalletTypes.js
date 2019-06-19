import React, { Component } from 'react';
import { connect } from "react-redux";
import { Form, FormGroup, Label, Input, Col } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import Switch from 'react-toggle-switch';
import { NotificationManager } from 'react-notifications';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { injectIntl } from 'react-intl';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
class AddWalletTypes extends Component {
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
                            fieldList[item.GUID] = item;
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
        /* check menu permission */
        var menuDetail = this.checkAndGetMenuAccessDetail('3b139bdc-43a6-1a60-333b-813afd973294'); //3b139bdc-43a6-1a60-333b-813afd973294
        const { addNewWalletTypeMasterDetail, currencyList, errors, intl } = this.props;
        return (
            <div>
                {this.props.menuLoading && <JbsSectionLoader />}
                <Form>
                    {(menuDetail['414c43a1-8b65-2f12-307c-8937b517788f'] && menuDetail['414c43a1-8b65-2f12-307c-8937b517788f'].Visibility === "E925F86B") && //414C43A1-8B65-2F12-307C-8937B517788F
                        <FormGroup row>
                            <Label sm={4} className="d-inline">
                                <IntlMessages id="table.currency" /><span className="text-danger">*</span>
                            </Label>
                            <Col sm={8}>
                                <Input
                                    disabled={(menuDetail['414c43a1-8b65-2f12-307c-8937b517788f'].AccessRight === "11E6E7B0") ? true : false}
                                    type="select"
                                    name="WalletTypeName"
                                    className="form-control"
                                    id="WalletTypeName"
                                    value={addNewWalletTypeMasterDetail.WalletTypeName}
                                    onChange={e =>
                                        this.props.onChangeText(
                                            "WalletTypeName",
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
                                {errors.WalletTypeName && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.WalletTypeName} />
                                    </span>
                                )}
                            </Col>
                        </FormGroup>
                    }
                    {(menuDetail['68a55834-88a8-6bed-2fe3-4e45136d0352'] && menuDetail['68a55834-88a8-6bed-2fe3-4e45136d0352'].Visibility === "E925F86B") && //68A55834-88A8-6BED-2FE3-4E45136D0352
                        <FormGroup row>
                            <Label sm={4} className="d-inline">
                                <IntlMessages id="lable.Description" /><span className="text-danger">*</span>
                            </Label>
                            <Col sm={8}>
                                <Input
                                    disabled={(menuDetail['68a55834-88a8-6bed-2fe3-4e45136d0352'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="Description"
                                    value={addNewWalletTypeMasterDetail.Description}
                                    maxLength="100"
                                    onChange={e =>
                                        this.props.onChangeText("Description", e.target.value)
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
                    {(menuDetail['4e20561f-9a09-65e8-a6be-8e95b0708323'] && menuDetail['4e20561f-9a09-65e8-a6be-8e95b0708323'].Visibility === "E925F86B") && //4E20561F-9A09-65E8-A6BE-8E95B0708323
                        <FormGroup row>
                            <Label sm={4}>
                                <IntlMessages id="lable.DepositionAllow" />
                            </Label>
                            <Col sm={8}>
                                <Switch
                                    enabled={(menuDetail['4e20561f-9a09-65e8-a6be-8e95b0708323'].AccessRight === "11E6E7B0") ? false : true}
                                    onClick={this.props.handleDACheckChange()}
                                    on={(addNewWalletTypeMasterDetail.IsDepositionAllow === "1") ? true : false} />
                            </Col>
                        </FormGroup>
                    }
                    {(menuDetail['8bc3a844-440e-8ee3-9fb6-4889608d92cd'] && menuDetail['8bc3a844-440e-8ee3-9fb6-4889608d92cd'].Visibility === "E925F86B") && //8BC3A844-440E-8EE3-9FB6-4889608D92CD
                        <FormGroup row>
                            <Label sm={4}>
                                <IntlMessages id="lable.WithdrawalAllow" />
                            </Label>
                            <Col sm={8}>
                                <Switch
                                    enabled={(menuDetail['8bc3a844-440e-8ee3-9fb6-4889608d92cd'].AccessRight === "11E6E7B0") ? false : true}
                                    onClick={this.props.handleWACheckChange()}
                                    on={(addNewWalletTypeMasterDetail.IsWithdrawalAllow === "1") ? true : false} />
                            </Col>
                        </FormGroup>
                    }
                    {(menuDetail['f37828df-2af3-97c1-0c75-81231eec5748'] && menuDetail['f37828df-2af3-97c1-0c75-81231eec5748'].Visibility === "E925F86B") && //F37828DF-2AF3-97C1-0C75-81231EEC5748
                        <FormGroup row>
                            <Label sm={4}>
                                <IntlMessages id="lable.TransactionAllow" />
                            </Label>
                            <Col sm={8}>
                                <Switch
                                    enabled={(menuDetail['f37828df-2af3-97c1-0c75-81231eec5748'].AccessRight === "11E6E7B0") ? false : true}
                                    onClick={this.props.handleTWCheckChange()}
                                    on={(addNewWalletTypeMasterDetail.IsTransactionWallet === "1") ? true : false} />
                            </Col>
                        </FormGroup>
                    }
                    {(menuDetail['bb1fd521-3fca-8bfb-70ac-4c9fdd112027'] && menuDetail['bb1fd521-3fca-8bfb-70ac-4c9fdd112027'].Visibility === "E925F86B") && //BB1FD521-3FCA-8BFB-70AC-4C9FDD112027
                        <FormGroup row>
                            <Label sm={4}>
                                <IntlMessages id="lable.Status" />
                            </Label>
                            <Col sm={8}>
                                <Switch
                                    enabled={(menuDetail['bb1fd521-3fca-8bfb-70ac-4c9fdd112027'].AccessRight === "11E6E7B0") ? false : true}
                                    onClick={this.props.handleCheckChange()}
                                    on={(addNewWalletTypeMasterDetail.Status === "1") ? true : false} />
                            </Col>
                        </FormGroup>
                    }
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
})(injectIntl(AddWalletTypes));