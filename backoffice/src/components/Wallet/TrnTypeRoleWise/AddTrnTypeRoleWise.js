import React, { Component, Fragment } from 'react';
import Switch from 'react-toggle-switch';
import { Form, FormGroup, Label, Input, Col } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { NotificationManager } from 'react-notifications';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';

class AddTrnTypeRoleWise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menudetail: [],
            notificationFlag: true,
        }
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('88660680-3319-6BC0-2649-E2C6A6AC4421'); // get wallet menu permission
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
        var menuDetail = this.checkAndGetMenuAccessDetail('0EA69504-09BB-8EF5-5837-8F38B82F6B8C');
        const { addTrnTypeRoleWiseForm, TrnsactionType, Roles, errors, intl} = this.props;
        return (
            <Fragment>
                 {this.props.menuLoading && <JbsSectionLoader />}
                <Form>
                {(menuDetail['62E11459-2021-3181-724B-FFF132AA43EB'] && menuDetail['62E11459-2021-3181-724B-FFF132AA43EB'].Visibility === "E925F86B") && //62E11459-2021-3181-724B-FFF132AA43EB
                    <FormGroup row>
                        <Label sm={4} className="d-inline">
                            <IntlMessages id="table.TrnTypeName" /> <span className="text-danger">*</span>
                        </Label>
                        <Col sm={8}>
                            <Input
                                disabled={(menuDetail['62E11459-2021-3181-724B-FFF132AA43EB'].AccessRight === "11E6E7B0") ? true : false}
                                type="select"
                                name="TrnTypeId"
                                className="form-control"
                                id="TrnTypeId"
                                value={addTrnTypeRoleWiseForm.TrnTypeId}
                                onChange={e =>
                                    this.props.onChangeAdd(
                                        "TrnTypeId",
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">{intl.formatMessage({ id: "lable.selectType" })}</option>
                                {TrnsactionType.length &&
                                    TrnsactionType.map((list, index) => (
                                        <option key={index} value={list.TypeId}>
                                            {list.TypeName}
                                        </option>
                                    ))}
                            </Input>
                            {errors.TrnTypeId && (
                                <span className="text-danger">
                                    <IntlMessages id={errors.TrnTypeId} />
                                </span>
                            )}
                        </Col>
                    </FormGroup>
                }
                {(menuDetail['8A1FAD8A-852D-61EA-5406-B2ECEE3A620A'] && menuDetail['8A1FAD8A-852D-61EA-5406-B2ECEE3A620A'].Visibility === "E925F86B") && //8A1FAD8A-852D-61EA-5406-B2ECEE3A620A
                    <FormGroup row>
                        <Label sm={4} className="d-inline">
                            <IntlMessages id="table.RoleName" /> <span className="text-danger">*</span>
                        </Label>
                        <Col sm={8}>
                            <Input
                                disabled={(menuDetail['8A1FAD8A-852D-61EA-5406-B2ECEE3A620A'].AccessRight === "11E6E7B0") ? true : false}
                                type="select"
                                name="RoleId"
                                className="form-control"
                                id="RoleId"
                                value={addTrnTypeRoleWiseForm.RoleId}
                                onChange={e =>
                                    this.props.onChangeAdd(
                                        "RoleId",
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">{intl.formatMessage({ id: "wallet.selectRole" })}</option>
                                {Roles.length &&
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
                        </Col>
                    </FormGroup>
                }
                {(menuDetail['4F39DC58-819A-478C-84AB-89F5426C828E'] && menuDetail['4F39DC58-819A-478C-84AB-89F5426C828E'].Visibility === "E925F86B") && //4F39DC58-819A-478C-84AB-89F5426C828E
                    <FormGroup row>
                        <Label sm={4}>
                            <IntlMessages id="lable.Status" />
                        </Label>
                        <Col sm={8}>
                            <Switch
                                 enabled={(menuDetail['4F39DC58-819A-478C-84AB-89F5426C828E'].AccessRight === "11E6E7B0") ? false : true}
                                className="mt-5"
                                onClick={this.props.handleCheckChange()}
                                on={(addTrnTypeRoleWiseForm.Status === "1") ? true : false} />
                        </Col>
                    </FormGroup>
                }
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
})(injectIntl(AddTrnTypeRoleWise));
