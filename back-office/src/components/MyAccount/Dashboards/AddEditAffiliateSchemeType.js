/* 
    Developer : Salim Deraiya
    Date : 20-03-2019
    File Comment : MyAccount Add/Edit Affiliate Scheme Type Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { addAffiliateSchemeType, editAffiliateSchemeType, getAffiliateSchemeTypeList } from "Actions/MyAccount";
import { getActiveInactiveStatus } from 'Helpers/helpers';
import validateAffiliateSchemeType from 'Validations/MyAccount/affiliate_schemetype';
import AppConfig from 'Constants/AppConfig';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//Component for MyAccount Add/Edit Affiliate Scheme Type Dashboard
class AddEditAffiliateSchemeType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: {
                SchemeTypeId: '0',
                SchemeTypeName: '',
                Description: '',
                Status: '',
            },
            pageData: {
                PageNo: 0,
                PageSize: AppConfig.totalRecordDisplayInList
            },
            isAddData: false,
            errors: "",
            menudetail: [],
            notification: true,
        };
        this.initState = this.state;
    }

    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.pagedata.isEdit ? 'A9658239-7A08-6CBE-058A-F8D8F8B02946' : '0593E805-0E35-857B-1A8E-FB2E201624BB');
    }

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
        //Get AffiliateScheme Data By Id
        if (nextProps.getData.hasOwnProperty('Data') && Object.keys(nextProps.getData.Data).length > 0 && this.props.pagedata.isEdit) {
            this.setState({ data: nextProps.getData.Data });
        } else {
            if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) {
                var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
                NotificationManager.error(errMsg);
            } else if (nextProps.data.ReturnCode === 0 && this.state.isAddData) {
                this.setState({ isAddData: false });
                var sucMsg = nextProps.data.ErrorCode === 0 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
                NotificationManager.success(sucMsg);
                this.resetData();
                this.props.getAffiliateSchemeTypeList(this.state.pageData)
            }
        }
    }

    //Add AffiliateScheme method...
    onAddAffiliateScheme(event) {
        event.preventDefault();
        const { errors, isValid } = validateAffiliateSchemeType(this.state.data);
        this.setState({ errors: errors });

        if (isValid) {
            this.setState({ isAddData: true });
            this.props.addAffiliateSchemeType(this.state.data);
        }
    }

    //Edit AffiliateScheme method...
    onEditAffiliateScheme(event) {
        event.preventDefault();
        const { errors, isValid } = validateAffiliateSchemeType(this.state.data);
        this.setState({ errors: errors });

        if (isValid) {
            this.setState({ isAddData: true });
            this.props.editAffiliateSchemeType(this.state.data);
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
        const { SchemeTypeName, Description, Status } = this.state.data;
        const statusList = getActiveInactiveStatus();
        var menuDetail = this.checkAndGetMenuAccessDetail(isEdit ? '85098FB5-094B-A792-196D-8C840C941576' : '37E65D15-95DD-43AD-4B64-0B0B61AD0ABE');
        return (
            <Fragment>
                {this.props.menuLoading && <JbsSectionLoader />}
                {this.props.loading && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id={isEdit ? "sidebar.editAffiliateSchemeType" : "sidebar.addAffiliateSchemeType"} />} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="jbs-page-content col-md-12 mx-auto">
                        <Form className="tradefrm">
                            {/* Added by Bharat Jograna */}
                            {(isEdit ? (menuDetail["C206F1EB-5687-1208-5B8D-18F8541778A3"] && menuDetail["C206F1EB-5687-1208-5B8D-18F8541778A3"].Visibility === "E925F86B") //C206F1EB-5687-1208-5B8D-18F8541778A3
                                : (menuDetail["CFA07E5A-6330-7165-21AD-9C9AAF152B41"] && menuDetail["CFA07E5A-6330-7165-21AD-9C9AAF152B41"].Visibility === "E925F86B")) && //CFA07E5A-6330-7165-21AD-9C9AAF152B41
                                <FormGroup className="row">
                                    <Label for="SchemeTypeName" className="control-label col" ><IntlMessages id="sidebar.colSchemeTypeName" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <IntlMessages id="sidebar.colSchemeTypeName">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={(isEdit ? (menuDetail["C206F1EB-5687-1208-5B8D-18F8541778A3"] && menuDetail["C206F1EB-5687-1208-5B8D-18F8541778A3"].AccessRight === "11E6E7B0") //C206F1EB-5687-1208-5B8D-18F8541778A3
                                                        : (menuDetail["CFA07E5A-6330-7165-21AD-9C9AAF152B41"] && menuDetail["CFA07E5A-6330-7165-21AD-9C9AAF152B41"].AccessRight === "11E6E7B0")) ? true : false}
                                                    type="text" name="SchemeTypeName" value={SchemeTypeName} placeholder={placeholder} id="SchemeTypeName" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.SchemeTypeName && <span className="text-danger text-left"><IntlMessages id={errors.SchemeTypeName} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["D8B6BFBF-5455-2097-239E-04F9E9409F3D"] && menuDetail["D8B6BFBF-5455-2097-239E-04F9E9409F3D"].Visibility === "E925F86B") //D8B6BFBF-5455-2097-239E-04F9E9409F3D
                                : (menuDetail["998E70CD-67CF-8043-5B9F-5CBD019D5F17"] && menuDetail["998E70CD-67CF-8043-5B9F-5CBD019D5F17"].Visibility === "E925F86B")) && //998E70CD-67CF-8043-5B9F-5CBD019D5F17
                                <FormGroup className="row">
                                    <Label for="Description" className="control-label col" ><IntlMessages id="sidebar.description" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <IntlMessages id="sidebar.description">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={(isEdit ? (menuDetail["D8B6BFBF-5455-2097-239E-04F9E9409F3D"] && menuDetail["D8B6BFBF-5455-2097-239E-04F9E9409F3D"].AccessRight === "11E6E7B0") //D8B6BFBF-5455-2097-239E-04F9E9409F3D
                                                        : (menuDetail["998E70CD-67CF-8043-5B9F-5CBD019D5F17"] && menuDetail["998E70CD-67CF-8043-5B9F-5CBD019D5F17"].AccessRight === "11E6E7B0")) ? true : false}
                                                    type="textarea" rows="5" name="Description" value={Description} placeholder={placeholder} id="Description" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.Description && <span className="text-danger text-left"><IntlMessages id={errors.Description} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["E498D87B-4133-52D4-8AC1-961D0F5997CB"] && menuDetail["E498D87B-4133-52D4-8AC1-961D0F5997CB"].Visibility === "E925F86B") //E498D87B-4133-52D4-8AC1-961D0F5997CB
                                : (menuDetail["82B23EA9-92D8-1B4E-3F4A-90C96B737A91"] && menuDetail["82B23EA9-92D8-1B4E-3F4A-90C96B737A91"].Visibility === "E925F86B")) && //82B23EA9-92D8-1B4E-3F4A-90C96B737A91
                                <FormGroup className="row">
                                    <Label for="Status" className="control-label col "><IntlMessages id="my_account.status" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input
                                            disabled={(isEdit ? (menuDetail["E498D87B-4133-52D4-8AC1-961D0F5997CB"] && menuDetail["E498D87B-4133-52D4-8AC1-961D0F5997CB"].AccessRight === "11E6E7B0") //E498D87B-4133-52D4-8AC1-961D0F5997CB
                                                : (menuDetail["82B23EA9-92D8-1B4E-3F4A-90C96B737A91"] && menuDetail["82B23EA9-92D8-1B4E-3F4A-90C96B737A91"].AccessRight === "11E6E7B0")) ? true : false}
                                            type="select" name="Status" value={Status} id="Status" onChange={(e) => this.onChange(e)}>
                                            <IntlMessages id="sidebar.selStatus">{(selStatus) => <option value="">{selStatus}</option>}</IntlMessages>
                                            {statusList.map((sList, index) => (
                                                <IntlMessages key={index} id={sList.label}>{(placeholder) => <option value={sList.id}>{placeholder}</option>}</IntlMessages>
                                            ))}
                                        </Input>
                                        {errors.Status && <span className="text-danger text-left"><IntlMessages id={errors.Status} /></span>}
                                    </div>
                                </FormGroup>}
                            {Object.keys(menuDetail).length > 0 &&
                                <FormGroup row>
                                    <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                        <div className="btn_area">
                                            <Button disabled={this.props.loading} variant="raised" color="primary" onClick={isEdit ? (e) => this.onEditAffiliateScheme(e) : (e) => this.onAddAffiliateScheme(e)}><IntlMessages id={isEdit ? "sidebar.btnEdit" : "sidebar.btnAdd"} /></Button>
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
AddEditAffiliateSchemeType.defaultProps = {
    SchemeTypeId: "0",
    pagedata: {
        isEdit: false
    }
}

const mapToProps = ({ affiliateSchemeTypeRdcer, authTokenRdcer }) => {
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { data, getData, plist, loading } = affiliateSchemeTypeRdcer;
    return { data, getData, plist, loading, menuLoading, menu_rights };
}

export default connect(mapToProps, {
    addAffiliateSchemeType,
    getAffiliateSchemeTypeList,
    editAffiliateSchemeType,
    getMenuPermissionByID
})(AddEditAffiliateSchemeType);