// component for API Key Policy Setting By Tejas 14/3/2019
import React, { Component } from 'react';
// used for connect component to store
import { connect } from "react-redux";
//  Used For Display Notification 
import { NotificationManager } from "react-notifications";
// intl messages
import IntlMessages from "Util/IntlMessages";
// import for Pop over
import { Button, Col, Row, Form, Label, Card, Input, FormGroup } from 'reactstrap';

// import action for fetch Api Key Policy
import {
    getApiKeyPolicySetting,
    updateApiKeyPolicySetting
} from "Actions/ApiKeyConfiguration";
// import for validate numbers in add data
import { validateNumericValue } from "Validations/pairConfiguration";
// used for display loader 
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//BreadCrumbData
const BreadCrumbData = [
    {
        title: <IntlMessages id="sidebar.app" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.dashboard" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.ApiKeyConfiguration" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.APIKeyPolicySetting" />,
        link: '',
        index: 1
    }
];

// class for Api Key POlicy Settings
class APIKeyPolicySetting extends Component {

    // constructor that defines default state
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            ApiKeyPolicySettingList: [],
            updateKeyList: 0,
            apiKeyList: 0,
            ID: "",
            AddMaxLimit: "",
            AddPerDayFrequency: "",
            AddFrequency: "",
            AddFrequencyType: "",
            DeleteMaxLimit: "",
            DeletePerDayFrequency: "",
            DeleteFrequency: "",
            DeleteFrequencyType: "",
            CreatedDate: null,
            CreatedBy: "",
            UpdatedBy: null,
            UpdatedDate: null,
            IsUpdate: false,
            notificationFlag: true,
            menudetail: [],
        };
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('92EF5A48-0B73-7451-00CF-3C85D93941E7'); // get Trading menu permission
    }
    // invoke when component is about to Get New Props
    componentWillReceiveProps(nextProps) {
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
            })
        }
        // set APi Key POlicy List
        if (nextProps.apiKeyPolicyList && this.state.apiKeyList === 1) {
            this.setState({
                ApiKeyPolicySettingList: nextProps.apiKeyPolicyList,
                apiKeyList: 0,
                ID: nextProps.apiKeyPolicyList.ID ? nextProps.apiKeyPolicyList.ID : "",
                AddMaxLimit: nextProps.apiKeyPolicyList.AddMaxLimit ? nextProps.apiKeyPolicyList.AddMaxLimit : "",
                AddPerDayFrequency: nextProps.apiKeyPolicyList.AddPerDayFrequency ? nextProps.apiKeyPolicyList.AddPerDayFrequency : "",
                AddFrequency: nextProps.apiKeyPolicyList.AddFrequency ? nextProps.apiKeyPolicyList.AddFrequency : "",
                AddFrequencyType: nextProps.apiKeyPolicyList.AddFrequencyType ? nextProps.apiKeyPolicyList.AddFrequencyType : "",
                DeleteMaxLimit: nextProps.apiKeyPolicyList.DeleteMaxLimit ? nextProps.apiKeyPolicyList.DeleteMaxLimit : "",
                DeletePerDayFrequency: nextProps.apiKeyPolicyList.DeletePerDayFrequency ? nextProps.apiKeyPolicyList.DeletePerDayFrequency : "",
                DeleteFrequency: nextProps.apiKeyPolicyList.DeleteFrequency ? nextProps.apiKeyPolicyList.DeleteFrequency : "",
                DeleteFrequencyType: nextProps.apiKeyPolicyList.DeleteFrequencyType ? nextProps.apiKeyPolicyList.DeleteFrequencyType : "",
                CreatedDate: nextProps.apiKeyPolicyList.CreatedDate ? nextProps.apiKeyPolicyList.CreatedDate : null,
                CreatedBy: nextProps.apiKeyPolicyList.CreatedBy ? nextProps.apiKeyPolicyList.CreatedBy : "",
                UpdatedBy: nextProps.apiKeyPolicyList.UpdatedBy ? nextProps.apiKeyPolicyList.UpdatedBy : null,
                UpdatedDate: nextProps.apiKeyPolicyList.UpdatedDate ? nextProps.apiKeyPolicyList.UpdatedDate : null
            })
        } else if (nextProps.apiKeyPolicyError && this.state.apiKeyList === 1 && nextProps.apiKeyPolicyError.ReturnCode === 1) {
            this.setState({
                ApiKeyPolicySettingList: [],
                apiKeyList: 0,

            })
        } else if (nextProps.apiKeyPolicyError && this.state.apiKeyList === 1 && nextProps.apiKeyPolicyError.ReturnCode === 9) {
            this.setState({
                ApiKeyPolicySettingList: [],
                apiKeyList: 0,
            })
            NotificationManager.error(<IntlMessages id="emailApiManager.Status.Fail.edit" />)
        }
        // update Api Key POlicy List
        if (nextProps.updateApiKeyPolicy && this.state.updateKeyList === 1 && nextProps.updateApiKeyPolicy.ReturnCode === 0) {
            this.setState({
                updateKeyList: 0,
                IsUpdate: false
            })
            NotificationManager.success(<IntlMessages id="sidebar.apikeypolicy.update.success" />)
        } else if (nextProps.updateApiKeyPolicyError && this.state.updateKeyList === 1 && nextProps.updateApiKeyPolicyError.ReturnCode === 1) {
            this.setState({
                updateKeyList: 0,
                IsUpdate: false
            })
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextProps.updateApiKeyPolicy.ErrorCode}`} />);
        } else if (nextProps.updateApiKeyPolicyError && this.state.updateKeyList === 1 && nextProps.updateApiKeyPolicyError.ReturnCode === 9) {
            this.setState({
                updateKeyList: 0,
                IsUpdate: false
            })
            NotificationManager.error(<IntlMessages id="emailApiManager.Status.Fail.edit" />)
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({
                    apiKeyList: 1
                })
                this.props.getApiKeyPolicySetting({})
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }
    }

    // call APifor update and set API Call
    UpdateKeyPolicy = () => {
        const {
            ID,
            AddMaxLimit,
            AddPerDayFrequency,
            AddFrequency,
            AddFrequencyType,
            DeleteMaxLimit,
            DeletePerDayFrequency,
            DeleteFrequency,
            DeleteFrequencyType,
            IsUpdate
        } = this.state

        if (AddMaxLimit === "") {
            NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.please.addMarket" />)
        } else if (AddPerDayFrequency === "") {
            NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.please.addFrequencyPerDay" />)
        } else if (AddFrequency === "") {
            NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.please.addFrequency" />)
        } else if (AddFrequencyType === "") {
            NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.please.addFrequencyType" />)
        } else if (AddFrequencyType !== "" && AddFrequency !== "" && AddFrequencyType === 1 && AddFrequency > 31) {
            NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.please.select.add.month" />)
        } else if (AddFrequencyType !== "" && AddFrequency !== "" && AddFrequencyType === 2 && AddFrequency > 12) {
            NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.please.select.add.year" />)
        } else if (AddFrequencyType !== "" && AddFrequency !== "" && AddFrequencyType === 4 && AddFrequency > 4) {
            NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.please.select.add.week" />)
        } else if (DeleteMaxLimit === "") {
            NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.please.deleteMarket" />)
        } else if (DeletePerDayFrequency === "") {
            NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.please.deleteFrequencyPerDay" />)
        } else if (DeleteFrequency === "") {
            NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.please.deleteFrequency" />)
        } else if (DeleteFrequencyType === "") {
            NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.please.deleteFrequencyType" />)
        } else if (DeleteFrequencyType !== "" && DeleteFrequency !== "" && DeleteFrequencyType === 1 && DeleteFrequency > 31) {
            NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.please.select.delete.month" />)
        } else if (DeleteFrequencyType !== "" && DeleteFrequency !== "" && DeleteFrequencyType === 2 && DeleteFrequency > 12) {
            NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.please.select.delete.year" />)
        } else if (DeleteFrequencyType !== "" && DeleteFrequency !== "" && DeleteFrequencyType === 4 && DeleteFrequency > 4) {
            NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.please.select.delete.week" />)
        } else {
            const data = {
                ID: ID,
                AddMaxLimit: AddMaxLimit,
                AddPerDayFrequency: AddPerDayFrequency,
                AddFrequency: AddFrequency,
                AddFrequencyType: AddFrequencyType,
                DeleteMaxLimit: DeleteMaxLimit,
                DeletePerDayFrequency: DeletePerDayFrequency,
                DeleteFrequency: DeleteFrequency,
                DeleteFrequencyType: DeleteFrequencyType,
            }
            if (IsUpdate === true) {
                this.setState({
                    updateKeyList: 1
                })
                this.props.updateApiKeyPolicySetting(data)
            } else {
                NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.pleaseChange" />)
            }
        }
    }

    // Cancel Update and clear Textboxes
    CloseUpdate = () => {
        this.props.drawerClose()
        this.setState({
            open: false,
            componentName: '',
            ApiKeyPolicySettingList: [],
            updateKeyList: 0,
            apiKeyList: 0,
            ID: "",
            AddMaxLimit: "",
            AddPerDayFrequency: "",
            AddFrequency: "",
            AddFrequencyType: "",
            DeleteMaxLimit: "",
            DeletePerDayFrequency: "",
            DeleteFrequency: "",
            DeleteFrequencyType: "",
            CreatedDate: null,
            CreatedBy: "",
            UpdatedBy: null,
            UpdatedDate: null,
            IsUpdate: false
        })
    }

    // set Data for Delete Textboxes
    HandleChangeDeleteData = (event) => {
        if (validateNumericValue(event.target.value) || event.target.value === '') {
            this.setState({
                [event.target.name]: event.target.value,
                IsUpdate: true
            })
        }
    }

    // set Data for Add Textboxes
    HandleChangeAddData = (event) => {
        if (validateNumericValue(event.target.value) || event.target.value === '') {
            this.setState({
                [event.target.name]: event.target.value,
                IsUpdate: true
            })
        }
    }

    // set state for Add frequency type 
    handleChangeAddFrequencyType = event => {
        this.setState({ AddFrequencyType: event.target.value, IsUpdate: true });

    };

    // set state for delete frequency type 
    handleChangeDeleteFrequencyType = event => {
        this.setState({ DeleteFrequencyType: event.target.value, IsUpdate: true });
    };

    // set component and open drawer
    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: !this.state.open,
        });
    }

    // invoke after component render
    // componentDidMount() {
    //     this.setState({
    //         apiKeyList: 1
    //     })
    //     this.props.getApiKeyPolicySetting({})
    // }

    // toogle drawer 
    toggleDrawer = () => {
        this.setState({
            open: !this.state.open,
            componentName: '',
            addData: false,
            editData: false,
        })
    }

    // close all drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            addData: false,
            editData: false,
            componentName: ''
        });
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
    // renders the component
    render() {
        const { drawerClose, } = this.props;
        var menuDetail = this.checkAndGetMenuAccessDetail('B46C51B7-6AA2-692C-1E73-385602FA3A1D');//getting object detail for checking permissions // B46C51B7-6AA2-692C-1E73-385602FA3A1D
        return (
            <div className="jbs-page-content">
                {(this.props.apiKeyPolicyLoading || this.props.updateApiKeyPolicyLoading || this.props.menuLoading) && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="sidebar.APIKeyPolicySetting" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <Card>
                    <Col md={12} className="">
                        <Row style={{ fontSize: "24px" }} className="m-10 mt-5 font-weight-bold">
                            <IntlMessages id="sidebar.apikeypolicy.title" />
                        </Row>
                        <Row className="m-0 mt-5">
                            <Col md={6} className="hd_brd_mobile" style={{ borderRight: "1px solid" }}>
                                <div style={{ fontSize: "24px" }} className="font-weight-italic"><IntlMessages id="sidebar.apikeypolicy.addkey" /></div>
                                <Form>
                                    {((menuDetail["7DF087A4-84A1-16C4-3F56-2291CEEA4F2B"]) && (menuDetail["7DF087A4-84A1-16C4-3F56-2291CEEA4F2B"].Visibility === "E925F86B")) && //7DF087A4-84A1-16C4-3F56-2291CEEA4F2B
                                        <FormGroup row>
                                            <Label md={5} sm={6} xs={12}>
                                                <IntlMessages id="sidebar.apikeypolicy.addkey.maxLimit" />
                                            </Label>
                                            <Col md={6} sm={6} xs={12}>
                                                <Input type="text"
                                                  disabled={(menuDetail["7DF087A4-84A1-16C4-3F56-2291CEEA4F2B"].AccessRight === "11E6E7B0") ? true : false}
                                                name="AddMaxLimit"
                                                    value={this.state.AddMaxLimit}
                                                    onChange={this.HandleChangeAddData}
                                                ></Input>
                                            </Col>
                                        </FormGroup>
                                    }
                                    {((menuDetail["9149FBAE-69A8-6EAA-5ABA-697AF7EB475E"]) && (menuDetail["9149FBAE-69A8-6EAA-5ABA-697AF7EB475E"].Visibility === "E925F86B")) && //9149FBAE-69A8-6EAA-5ABA-697AF7EB475E
                                        <FormGroup row>
                                            <Label md={5} sm={6} xs={12}>
                                                <IntlMessages id="sidebar.apikeypolicy.addkey.frequency.perDay" />
                                            </Label>
                                            <Col md={6} sm={6} xs={12}>
                                                <Input type="text"
                                                  disabled={(menuDetail["9149FBAE-69A8-6EAA-5ABA-697AF7EB475E"].AccessRight === "11E6E7B0") ? true : false}
                                                name="AddPerDayFrequency"
                                                    value={this.state.AddPerDayFrequency}
                                                    onChange={this.HandleChangeAddData}
                                                ></Input>
                                            </Col>
                                        </FormGroup>
                                    }
                                    <FormGroup row>
                                        <Label md={5} sm={6} xs={12}>
                                            <IntlMessages id="sidebar.apikeypolicy.addkey.frequency" />
                                        </Label>
                                        {((menuDetail["11CA74FD-3E87-8AB8-2F19-EEDF790B0392"]) && (menuDetail["11CA74FD-3E87-8AB8-2F19-EEDF790B0392"].Visibility === "E925F86B")) && //11CA74FD-3E87-8AB8-2F19-EEDF790B0392
                                            <Col md={3} sm={3} xs={6}>
                                                <Input type="text"
                                                  disabled={(menuDetail["11CA74FD-3E87-8AB8-2F19-EEDF790B0392"].AccessRight === "11E6E7B0") ? true : false}
                                                name="AddFrequency"
                                                    value={this.state.AddFrequency}
                                                    onChange={this.HandleChangeAddData}
                                                ></Input>
                                            </Col>
                                        }
                                        {((menuDetail["7F6F0DB9-0716-A737-39AF-D4CE48F78436"]) && (menuDetail["7F6F0DB9-0716-A737-39AF-D4CE48F78436"].Visibility === "E925F86B")) && //7F6F0DB9-0716-A737-39AF-D4CE48F78436
                                            <Col md={3} sm={3} xs={6}>
                                                <Input
                                                  disabled={(menuDetail["7F6F0DB9-0716-A737-39AF-D4CE48F78436"].AccessRight === "11E6E7B0") ? true : false}
                                                type="select"
                                                    name="status"
                                                    value={this.state.AddFrequencyType}
                                                    onChange={(e) => this.handleChangeAddFrequencyType(e)}
                                                >
                                                    <IntlMessages id="sidebar.apiKeyPolicy.select">
                                                        {(select) =>
                                                            <option value="">{select}</option>
                                                        }
                                                    </IntlMessages>
                                                    <IntlMessages id="sidebar.day">
                                                        {(select) =>
                                                            <option value="1">{select}</option>
                                                        }
                                                    </IntlMessages>
                                                    <IntlMessages id="sidebar.week">
                                                        {(select) =>
                                                            <option value="4">{select}</option>
                                                        }
                                                    </IntlMessages>
                                                    <IntlMessages id="sidebar.month">
                                                        {(select) =>
                                                            <option value="2">{select}</option>
                                                        }
                                                    </IntlMessages>
                                                    <IntlMessages id="sidebar.year">
                                                        {(select) =>
                                                            <option value="3">{select}</option>
                                                        }
                                                    </IntlMessages>
                                                </Input>
                                            </Col>
                                        }
                                    </FormGroup>
                                </Form>
                            </Col>
                            <Col md={6}>
                                <div style={{ fontSize: "24px" }} className="font-weight-italic"><IntlMessages id="sidebar.apikeypolicy.deleteKey" /></div>
                                <Form>
                                    {((menuDetail["0DCDA1A1-2E5F-8E82-633C-C606E68A0624"]) && (menuDetail["0DCDA1A1-2E5F-8E82-633C-C606E68A0624"].Visibility === "E925F86B")) && //0DCDA1A1-2E5F-8E82-633C-C606E68A0624
                                        <FormGroup row>
                                            <Label md={5} sm={6} xs={12}>
                                                <IntlMessages id="sidebar.apikeypolicy.deleteKey.maxLimit" />
                                            </Label>

                                            <Col md={6} sm={6} xs={12}>
                                                <Input type="text"
                                                  disabled={(menuDetail["0DCDA1A1-2E5F-8E82-633C-C606E68A0624"].AccessRight === "11E6E7B0") ? true : false}
                                                name="DeleteMaxLimit"
                                                    value={this.state.DeleteMaxLimit}
                                                    onChange={this.HandleChangeDeleteData}
                                                ></Input>

                                            </Col>
                                        </FormGroup>
                                    }
                                    {((menuDetail["D1012777-9FF9-5C9C-82E8-787FD23313B1"]) && (menuDetail["D1012777-9FF9-5C9C-82E8-787FD23313B1"].Visibility === "E925F86B")) && //D1012777-9FF9-5C9C-82E8-787FD23313B1
                                        <FormGroup row>
                                            <Label md={5} sm={6} xs={12}>
                                                <IntlMessages id="sidebar.apikeypolicy.deleteKey.frequency.perDay" />
                                            </Label>
                                            <Col md={6} sm={6} xs={12}>
                                                <Input type="text"
                                                  disabled={(menuDetail["D1012777-9FF9-5C9C-82E8-787FD23313B1"].AccessRight === "11E6E7B0") ? true : false}
                                                name="DeletePerDayFrequency"
                                                    value={this.state.DeletePerDayFrequency}
                                                    onChange={this.HandleChangeDeleteData}
                                                ></Input>

                                            </Col>
                                        </FormGroup>
                                    }
                                    <FormGroup row>
                                        <Label md={5} sm={6} xs={12}>
                                            <IntlMessages id="sidebar.apikeypolicy.deleteKey.frequency" />
                                        </Label>
                                        {((menuDetail["1238DF03-2B56-2820-781C-6F80BFF66FFE"]) && (menuDetail["1238DF03-2B56-2820-781C-6F80BFF66FFE"].Visibility === "E925F86B")) && //1238DF03-2B56-2820-781C-6F80BFF66FFE
                                            <Col md={3} sm={3} xs={6}>
                                                <Input type="text"
                                                  disabled={(menuDetail["1238DF03-2B56-2820-781C-6F80BFF66FFE"].AccessRight === "11E6E7B0") ? true : false}
                                                name="DeleteFrequency"
                                                    value={this.state.DeleteFrequency}
                                                    onChange={this.HandleChangeDeleteData}
                                                ></Input>
                                            </Col>
                                        }
                                        {((menuDetail["B0D0246B-3A9B-8B52-7A01-7F77FD3D7310"]) && (menuDetail["B0D0246B-3A9B-8B52-7A01-7F77FD3D7310"].Visibility === "E925F86B")) && //B0D0246B-3A9B-8B52-7A01-7F77FD3D7310
                                            <Col md={3} sm={3} xs={6}>
                                                <Input
                                                  disabled={(menuDetail["B0D0246B-3A9B-8B52-7A01-7F77FD3D7310"].AccessRight === "11E6E7B0") ? true : false}
                                                type="select"
                                                    name="status"
                                                    value={this.state.DeleteFrequencyType}
                                                    onChange={(e) => this.handleChangeDeleteFrequencyType(e)}
                                                >
                                                    <IntlMessages id="sidebar.apiKeyPolicy.select">
                                                        {(select) =>
                                                            <option value="">{select}</option>
                                                        }
                                                    </IntlMessages>

                                                    <IntlMessages id="sidebar.day">
                                                        {(select) =>
                                                            <option value="1">{select}</option>
                                                        }
                                                    </IntlMessages>

                                                    <IntlMessages id="sidebar.week">
                                                        {(select) =>
                                                            <option value="4">{select}</option>
                                                        }
                                                    </IntlMessages>

                                                    <IntlMessages id="sidebar.month">
                                                        {(select) =>
                                                            <option value="2">{select}</option>
                                                        }
                                                    </IntlMessages>

                                                    <IntlMessages id="sidebar.year">
                                                        {(select) =>
                                                            <option value="3">{select}</option>
                                                        }
                                                    </IntlMessages>
                                                </Input>
                                            </Col>
                                        }
                                    </FormGroup>
                                </Form>
                            </Col>
                        </Row>

                        <div className="row">
                            <div className="mx-auto my-15">
                                <div className="btn_area">
                                    <Button variant="raised" onClick={() => this.CloseUpdate()} className="btn-danger text-white"><IntlMessages id="button.cancel" /></Button>
                                    <Button variant="raised" color="primary" className="ml-15 text-white" onClick={() => this.UpdateKeyPolicy()}><IntlMessages id="button.update" /></Button>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Card>
            </div>
        )
    }
}

const mapStateToProps = ({ ApiKeyPolicy, drawerclose, authTokenRdcer }) => {
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { apiKeyPolicyList, apiKeyPolicyLoading, apiKeyPolicyError, updateApiKeyPolicy, updateApiKeyPolicyLoading, updateApiKeyPolicyError } = ApiKeyPolicy;
    return { apiKeyPolicyList, apiKeyPolicyLoading, apiKeyPolicyError, updateApiKeyPolicy, updateApiKeyPolicyLoading, updateApiKeyPolicyError, drawerclose, menuLoading, menu_rights }
}

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        getApiKeyPolicySetting,
        updateApiKeyPolicySetting,
        getMenuPermissionByID
    }
)(APIKeyPolicySetting);
