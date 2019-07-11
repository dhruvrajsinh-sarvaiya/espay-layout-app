/* 
    Developer : Salim Deraiya
    Date : 20-03-2019
    Updated By:Saloni Rathod(26-03-2019)
    File Comment : MyAccount Add/Edit Affiliate Promotion Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import "rc-drawer/assets/index.css";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { addAffiliatePromotion, editAffiliatePromotion, getAffiliatePromotionList } from "Actions/MyAccount";
import { getSchemeStatus } from 'Helpers/helpers';
import validateAffiliatePromotion from 'Validations/MyAccount/affiliate_promotion';
import AppConfig from 'Constants/AppConfig';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//Component for MyAccount Add/Edit Affiliate Promotion Dashboard
class AddEditAffiliatePromotion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: {
                PromotionId: this.props.PromotionId,
                PromotionType: '',
                Status: ''
            },
            pageData: {
                PageNo: 0,
                PageSize: AppConfig.totalRecordDisplayInList
            },
            parentList: [],
            isAddData: false,
            errors: "",
            fieldList: {},
            menudetail: [],
            notification: true,
        };
        this.initState = this.state;
    }

    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.pagedata.isEdit ? '63534205-58B4-A6E3-1200-7C052AC09D56' : '8B328587-3A64-8B18-8087-8CF263518D44');
    }

    //reset data
    resetData() {
        let newObj = Object.assign({}, this.initState);
        newObj.menudetail = this.state.menudetail;
        this.setState(newObj);
        this.props.drawerClose();
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    };

    showComponent = componentName => {
        this.setState({
            componentName: componentName,
            open: this.state.open ? false : true
        });
    };

    onChange(event) {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });
        // added by vishva
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notification: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        //Get Module Data By Id
        if (nextProps.getData.hasOwnProperty('Data') && Object.keys(nextProps.getData.Data).length > 0 && this.props.pagedata.isEdit) {
            this.setState({ data: nextProps.getData.Data });
        } else {
            if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) {
                var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
                NotificationManager.error(errMsg);
            } else if (nextProps.data.ReturnCode === 0 && this.state.isAddData) {
                this.setState({ isAddData: false });
                this.props.getAffiliatePromotionList(this.state.pageData);
                var sucMsg = nextProps.data.ErrorCode === 0 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
                NotificationManager.success(sucMsg);
                this.resetData();
            }
        }
    }

    //Add Module method...
    onAddModule(event) {
        event.preventDefault();
        const { errors, isValid } = validateAffiliatePromotion(this.state.data);
        this.setState({ errors: errors });

        if (isValid) {
            this.setState({ isAddData: true });
            this.props.addAffiliatePromotion(this.state.data);
        }
    }

    //Edit Module method...
    onEditModule(event) {
        event.preventDefault();
        const { errors, isValid } = validateAffiliatePromotion(this.state.data);
        this.setState({ errors: errors });
        if (isValid) {
            this.setState({ isAddData: true });
            this.props.editAffiliatePromotion(this.state.data);
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
        const { drawerClose } = this.props;
        const { isEdit } = this.props.pagedata;
        const { errors } = this.state;
        const { PromotionType, Status } = this.state.data;
        const statusList = getSchemeStatus();
        var menuDetail = this.checkAndGetMenuAccessDetail(isEdit ? '28F98C65-5432-175E-521B-BA260855619D' : 'D1D6DF5E-4868-36BF-9A2D-5E0A69197651');
        return (
            <Fragment>
                {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id={isEdit ? "sidebar.editAffiliatePromotion" : "sidebar.addAffiliatePromotion"} />} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="jbs-page-content col-md-12 mx-auto">
                        <Form className="tradefrm">
                            {(isEdit ? (menuDetail["AD18DCF3-36C1-394A-5AE9-959C1DF58CAE"] && menuDetail["AD18DCF3-36C1-394A-5AE9-959C1DF58CAE"].Visibility === "E925F86B") //AD18DCF3-36C1-394A-5AE9-959C1DF58CAE
                                : (menuDetail["F1141C25-0554-8479-50A6-92D2C29D16A3"] && menuDetail["F1141C25-0554-8479-50A6-92D2C29D16A3"].Visibility === "E925F86B")) && //F1141C25-0554-8479-50A6-92D2C29D16A3
                                <FormGroup className="row">
                                    <Label for="PromotionType" className="control-label col" ><IntlMessages id="sidebar.promotionType" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <IntlMessages id="sidebar.enterPromotionType">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={(isEdit ? (menuDetail["AD18DCF3-36C1-394A-5AE9-959C1DF58CAE"] && menuDetail["AD18DCF3-36C1-394A-5AE9-959C1DF58CAE"].AccessRight === "11E6E7B0")
                                                        : (menuDetail["F1141C25-0554-8479-50A6-92D2C29D16A3"] && menuDetail["F1141C25-0554-8479-50A6-92D2C29D16A3"].AccessRight === "11E6E7B0")) ? true : false}
                                                    type="text" name="PromotionType" value={PromotionType} placeholder={placeholder} id="PromotionType" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.PromotionType && <span className="text-danger text-left"><IntlMessages id={errors.PromotionType} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["6FABCE82-40BA-3AF1-540B-1C84F5CA1164"] && menuDetail["6FABCE82-40BA-3AF1-540B-1C84F5CA1164"].Visibility === "E925F86B") //6FABCE82-40BA-3AF1-540B-1C84F5CA1164
                                : (menuDetail["3481321D-61EB-A302-32C5-98B79D5A611B"] && menuDetail["3481321D-61EB-A302-32C5-98B79D5A611B"].Visibility === "E925F86B")) && //3481321D-61EB-A302-32C5-98B79D5A611B
                                <FormGroup className="row">
                                    <Label for="Status" className="control-label col "><IntlMessages id="my_account.status" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input
                                            disabled={(isEdit ? (menuDetail["6FABCE82-40BA-3AF1-540B-1C84F5CA1164"] && menuDetail["6FABCE82-40BA-3AF1-540B-1C84F5CA1164"].AccessRight === "11E6E7B0")
                                                : (menuDetail["3481321D-61EB-A302-32C5-98B79D5A611B"] && menuDetail["3481321D-61EB-A302-32C5-98B79D5A611B"].AccessRight === "11E6E7B0")) ? true : false}
                                            type="select" name="Status" value={Status} id="Status" onChange={(e) => this.onChange(e)}>
                                            <IntlMessages id="sidebar.selStatus">{(selStatus) => <option value="">{selStatus}</option>}</IntlMessages>
                                            {statusList.map((sList, index) => (
                                                (isEdit || sList.id !== 9) &&
                                                (<IntlMessages key={index} id={sList.label}>{(placeholder) => <option value={sList.id}>{placeholder}</option>}</IntlMessages>)
                                            ))}
                                        </Input>
                                        {errors.Status && <span className="text-danger text-left"><IntlMessages id={errors.Status} /></span>}
                                    </div>
                                </FormGroup>}
                            {Object.keys(menuDetail).length > 0 &&
                                <FormGroup row>
                                    <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                        <div className="btn_area">
                                            <Button disabled={this.props.loading} variant="raised" color="primary" onClick={isEdit ? (e) => this.onEditModule(e) : (e) => this.onAddModule(e)}><IntlMessages id={isEdit ? "sidebar.btnEdit" : "sidebar.btnAdd"} /></Button>
                                            <Button disabled={this.props.loading} variant="raised" color="danger" className="ml-15" onClick={() => this.resetData()}><IntlMessages id="sidebar.btnCancel" /></Button>
                                        </div>
                                    </div>
                                </FormGroup>}
                        </Form>
                    </div>
                </div>
            </Fragment>
        );
    }
}

//Default Props
AddEditAffiliatePromotion.defaultProps = {
    PromotionId: "0",
    pagedata: {
        isEdit: false
    }
}

const mapToProps = ({ affiliatePromotionRdcer, authTokenRdcer }) => {
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { data, getData, loading } = affiliatePromotionRdcer;
    return { data, getData, loading, menu_rights, menuLoading };
}

export default connect(mapToProps, {
    addAffiliatePromotion,
    getAffiliatePromotionList,
    editAffiliatePromotion,
    getMenuPermissionByID
})(AddEditAffiliatePromotion);