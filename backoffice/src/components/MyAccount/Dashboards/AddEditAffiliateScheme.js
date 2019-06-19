/* 
    Developer : Salim Deraiya
    Date : 20-03-2019
    Upadted by:Saloni Rathod(27/03/2018)
    File Comment : MyAccount Add/Edit Affiliate Scheme Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import "rc-drawer/assets/index.css";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { addAffiliateScheme, editAffiliateScheme, getAffiliateSchemeList, getAffiliateSchemeById } from "Actions/MyAccount";
import { getSchemeStatus } from 'Helpers/helpers';
import validateAffiliateScheme from 'Validations/MyAccount/affiliate_scheme';
import AppConfig from 'Constants/AppConfig';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//Component for MyAccount Add/Edit Affiliate Scheme Dashboard
class AddEditAffiliateScheme extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            menudetail: [],
            notification: true,
            data: {
                SchemeMasterId: this.props.SchemeMasterId,
                SchemeName: '',
                SchemeType: '',
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
            ntf_flag: true,
        };
        this.initState = this.state;
    }

    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.pagedata.isEdit ? 'D0ED6F41-42C9-1A08-8844-BFABEE072FE2' : '7CC9A36F-773A-3081-3C50-1B3FAFD06A52');
    }

    resetData() {
        this.setState(this.initState);
        this.props.drawerClose();
        this.setState({ menudetail: this.state.menudetail })
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    };

    showComponent = componentName => {
        this.setState({
            componentName: componentName,
            open: !this.state.open
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
            if (this.state.ntf_flag && (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9)) {
                var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
                NotificationManager.error(errMsg);
                this.setState({ ntf_flag: false })
            } else if (this.state.ntf_flag && (nextProps.data.ReturnCode === 0 && this.state.isAddData)) {
                this.setState({ isAddData: false, ntf_flag: false });
                this.props.getAffiliateSchemeList(this.state.pageData);
                var sucMsg = nextProps.data.ErrorCode === 0 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
                NotificationManager.success(sucMsg);
                this.resetData();
            }
        }
    }

    //Add Module method...
    onAddModule(event) {
        event.preventDefault();
        const { errors, isValid } = validateAffiliateScheme(this.state.data);
        this.setState({ isAddData: true, errors: errors });

        if (isValid) {
            this.props.addAffiliateScheme(this.state.data);
        }
    }

    //Edit Module method...
    onEditModule(event) {
        event.preventDefault();
        const { errors, isValid } = validateAffiliateScheme(this.state.data);
        this.setState({ errors: errors });

        if (isValid) {
            this.setState({ isAddData: true });
            this.props.editAffiliateScheme(this.state.data);
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
        const { drawerClose } = this.props;
        const { isEdit } = this.props.pagedata;
        const { errors } = this.state;
        const { SchemeName, Status, SchemeType } = this.state.data;
        const statusList = getSchemeStatus();
        var menuDetail = this.checkAndGetMenuAccessDetail(isEdit ? '62D6E5A3-750A-8FF6-9332-0A08EF95A5EC' : '9F03E1AE-9B98-5E23-99F9-4D97EC3D8F5E');
        return (
            <Fragment>
                {this.props.menuLoading && <JbsSectionLoader />}
                {this.props.loading && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id={isEdit ? "sidebar.editAffiliateScheme" : "sidebar.addAffiliateScheme"} />} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="jbs-page-content col-md-12 mx-auto">
                        <Form className="tradefrm">
                            {/* End by Saloni Rathod */}
                            {/* field permission added by vishva */}
                            {(isEdit ? (menuDetail["424C6A40-702D-7465-9478-47763A1C3F3E"] && menuDetail["424C6A40-702D-7465-9478-47763A1C3F3E"].Visibility === "E925F86B") //424C6A40-702D-7465-9478-47763A1C3F3E
                                : (menuDetail["E13E0B63-2165-6E7D-47A8-EBFF613E8A29"] && menuDetail["E13E0B63-2165-6E7D-47A8-EBFF613E8A29"].Visibility === "E925F86B")) && //E13E0B63-2165-6E7D-47A8-EBFF613E8A29
                                <FormGroup className="row">
                                    <Label for="SchemeName" className="control-label col" ><IntlMessages id="sidebar.colSchemeName" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <IntlMessages id="sidebar.enterSchemeName">
                                            {(placeholder) =>
                                                <Input disabled={((isEdit ? (menuDetail["424C6A40-702D-7465-9478-47763A1C3F3E"] && menuDetail["424C6A40-702D-7465-9478-47763A1C3F3E"].AccessRight === "11E6E7B0") //424C6A40-702D-7465-9478-47763A1C3F3E
                                                    : (menuDetail["E13E0B63-2165-6E7D-47A8-EBFF613E8A29"] && menuDetail["E13E0B63-2165-6E7D-47A8-EBFF613E8A29"].AccessRight === "11E6E7B0"))) ? true : false} type="text" name="SchemeName" value={SchemeName} placeholder={placeholder} id="SchemeName" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.SchemeName && <span className="text-danger text-left"><IntlMessages id={errors.SchemeName} /></span>}
                                    </div>
                                </FormGroup>}
                            {/* End by Saloni Rathod */}
                            {(isEdit ? (menuDetail["A97FDB32-6408-781C-2861-DF3FD7B61D5C"] && menuDetail["A97FDB32-6408-781C-2861-DF3FD7B61D5C"].Visibility === "E925F86B") //A97FDB32-6408-781C-2861-DF3FD7B61D5C
                                : (menuDetail["DE19614B-3D36-195F-2175-413F4F9E7706"] && menuDetail["DE19614B-3D36-195F-2175-413F4F9E7706"].Visibility === "E925F86B")) && //DE19614B-3D36-195F-2175-413F4F9E7706
                                <FormGroup className="row">
                                    <Label for="SchemeType" className="control-label col" ><IntlMessages id="sidebar.colSchemeType" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <IntlMessages id="sidebar.enterSchemeType">
                                            {(placeholder) =>
                                                <Input disabled={((isEdit ? (menuDetail["A97FDB32-6408-781C-2861-DF3FD7B61D5C"] && menuDetail["A97FDB32-6408-781C-2861-DF3FD7B61D5C"].AccessRight === "11E6E7B0") //A97FDB32-6408-781C-2861-DF3FD7B61D5C
                                                    : (menuDetail["DE19614B-3D36-195F-2175-413F4F9E7706"] && menuDetail["DE19614B-3D36-195F-2175-413F4F9E7706"].AccessRight === "11E6E7B0"))) ? true : false} type="text" name="SchemeType" value={SchemeType} placeholder={placeholder} id="SchemeType" onChange={(e) => this.onChange(e)} />
                                            }
                                        </IntlMessages>
                                        {errors.SchemeType && <span className="text-danger text-left"><IntlMessages id={errors.SchemeType} /></span>}
                                    </div>
                                </FormGroup>}
                            {(isEdit ? (menuDetail["23EF00D8-48C8-22C1-51B1-2FAB49514104"] && menuDetail["23EF00D8-48C8-22C1-51B1-2FAB49514104"].Visibility === "E925F86B") //23EF00D8-48C8-22C1-51B1-2FAB49514104
                                : (menuDetail["170BA26D-38F9-3854-1EBE-6B2475345450"] && menuDetail["170BA26D-38F9-3854-1EBE-6B2475345450"].Visibility === "E925F86B")) && //170BA26D-38F9-3854-1EBE-6B2475345450
                                <FormGroup className="row">
                                    <Label for="Status" className="control-label col "><IntlMessages id="my_account.status" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input disabled={((isEdit ? (menuDetail["A97FDB32-6408-781C-2861-DF3FD7B61D5C"] && menuDetail["A97FDB32-6408-781C-2861-DF3FD7B61D5C"].AccessRight === "11E6E7B0") //A97FDB32-6408-781C-2861-DF3FD7B61D5C
                                            : (menuDetail["DE19614B-3D36-195F-2175-413F4F9E7706"] && menuDetail["DE19614B-3D36-195F-2175-413F4F9E7706"].AccessRight === "11E6E7B0"))) ? true : false} type="select" name="Status" value={Status} id="Status" onChange={(e) => this.onChange(e)}>
                                            <IntlMessages id="sidebar.selStatus">{(selStatus) => <option value="">{selStatus}</option>}</IntlMessages>
                                            {statusList.map((sList, index) => (
                                                (isEdit || sList.id !== 9) &&
                                                (<IntlMessages key={index} id={sList.label}>{(placeholder) => <option value={sList.id}>{placeholder}</option>}</IntlMessages>)
                                            ))}
                                        </Input>
                                        {errors.Status && <span className="text-danger text-left"><IntlMessages id={errors.Status} /></span>}
                                    </div>
                                </FormGroup>}
                            {menuDetail &&
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
AddEditAffiliateScheme.defaultProps = {
    SchemeMasterId: "0",
    pagedata: {
        isEdit: false
    }
}

const mapToProps = ({ affiliateSchemeRdcer, authTokenRdcer }) => {
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { data, getData, plist, loading } = affiliateSchemeRdcer;
    return { data, getData, plist, loading, menuLoading, menu_rights };
}

export default connect(mapToProps, {
    addAffiliateScheme,
    getAffiliateSchemeList,
    editAffiliateScheme,
    getAffiliateSchemeById,
    getMenuPermissionByID
})(AddEditAffiliateScheme);