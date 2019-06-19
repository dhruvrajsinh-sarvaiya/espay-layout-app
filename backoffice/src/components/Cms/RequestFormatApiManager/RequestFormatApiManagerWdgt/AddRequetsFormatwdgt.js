/* 
    Created By : Megha Kariya (actual develop by Jineshbhai)
    Date : 20-02-2019
    Description : Add Form of CMS Request Format API
*/

import React, { Component } from "react";

//import for Form
import { Form, FormGroup, Input, Label, Col, Row, Button } from "reactstrap";

//connect actions
import { connect } from "react-redux";

//import Actions
import { addrequestformetlist, getAppType } from "Actions/RequestFormatApiManager";

//Intl Messages
import IntlMessages from "Util/IntlMessages";

//  Used For Display Notification
import { NotificationManager } from "react-notifications";

//Back and Home button
import CloseButton from "@material-ui/core/Button";
import { getMenuPermissionByID } from 'Actions/MyAccount';
import AppConfig from 'Constants/AppConfig';
//Section Loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
const validateRequestFormatApiInput = require("../../../../validation/RequestFormatApiManager/requestFormatApi");
const buttonSizeSmall = {
  maxHeight: "28px",
  minHeight: "28px",
  maxWidth: "28px",
  fontSize: "1rem"
};

class Addrequetsformatwdgt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      RequestName: "",
      ContentType: "",
      MethodType: "",
      RequestFormat: "",
      Status: "",
      errors: "",
      addModal: false,
      addNewData: false,
      RequestType: '',
      appTypeList: [],
      fieldList: {},
      menudetail: [],
      Pflag: true,
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false
    });
  };
  componentWillMount() {
    this.props.getMenuPermissionByID('BEDDE08C-8EA4-60E4-A3BC-68ECA65B34F5');
  }
  componentWillReceiveProps(nextprops) {

    // update menu details if not set 
    if ((!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
      if (nextprops.menu_rights.ReturnCode === 0) {
        this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
        this.props.getAppType();
      } else if (nextprops.menu_rights.ReturnCode !== 0) {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        setTimeout(() => {
          this.props.drawerClose();
        }, 2000);
      }
      this.setState({ Pflag: false })
    }

    if (typeof nextprops.appTypeList !== 'undefined' && nextprops.appTypeList.ReturnCode === 0 && typeof nextprops.appTypeList.Response !== 'undefined' && nextprops.appTypeList.Response.length !== 0) {
      this.setState({ appTypeList: nextprops.appTypeList.Response });
    }
    if (
      nextprops.userlist &&
      nextprops.addError.length == 0 &&
      this.state.addNewData
    ) {
      NotificationManager.success(
        <IntlMessages id="emailApiManager.Status.Success.add" /> // Change Language variable by Megha Kariya (23/02/2019)
      );
      this.setState({
        addNewData: false,
        open: false
      });

      this.props.drawerClose();
      this.props.getrequestformet();
    } else if (
      nextprops.addError.length !== 0 &&
      nextprops.addError.ReturnCode !== 0 &&
      this.state.addNewData
    ) {
      NotificationManager.error(
        <IntlMessages
          id={`error.trading.transaction.${nextprops.addError.ErrorCode}`}
        />
      );
      this.setState({
        addNewData: false
      });
    }
  }

  resetData = () => {
    this.props.drawerClose();
    this.setState({
      addNewData: false,
      RequestName: "",
      ContentType: "",
      MethodType: "",
      RequestFormat: "",
      Status: "",
      errors: "",
      RequestType: '',
      appTypeList: []
    });
  };

  onAddUser = () => {
    const {
      RequestName,
      ContentType,
      MethodType,
      RequestFormat,
      Status,
      RequestType
    } = this.state;

    const data = {
      RequestName: RequestName,
      ContentType: ContentType ? ContentType : "",
      MethodType: MethodType ? MethodType : "",
      RequestFormat: RequestFormat ? RequestFormat : "",
      Status: Status ? Status : "",
      RequestType: RequestType ? RequestType : ""
    };

    const { errors, isValid } = validateRequestFormatApiInput(data);

    Object.keys(errors).forEach(function (item) {
      NotificationManager.error(<IntlMessages id={errors[item]} />);
    });

    if (!isValid) {
      this.setState({
        addNewData: true
      });
      this.props.addrequestformetlist(data);
    }

  };

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
    var menudetail = this.checkAndGetMenuAccessDetail('D151FF51-584F-191C-683A-66E91E68504D');
    const { drawerClose } = this.props;
    const {
      RequestName,
      ContentType,
      MethodType,
      RequestFormat,
      Status,
      errors,
      RequestType,
      appTypeList
    } = this.state;

    return (
      <div className="m-10 p-5">
        {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
        <div className="m-20 page-title d-flex justify-content-between align-items-center">
          <div className="page-title-wrap">
            <h2>{<IntlMessages id="request.formet.adddetailes" />}</h2>
          </div>
          <div className="page-title-wrap">
            <CloseButton
              className="btn-warning text-white mr-10 mb-10"
              style={buttonSizeSmall}
              variant="fab"
              mini
              onClick={drawerClose}
            >
              <i className="zmdi zmdi-mail-reply" />
            </CloseButton>
            <CloseButton
              className="btn-info text-white mr-10 mb-10"
              style={buttonSizeSmall}
              variant="fab"
              mini
              onClick={drawerClose}
            >
              <i className="zmdi zmdi-home" />
            </CloseButton>
          </div>
        </div>

        <Row>
          <Col md={12}>
            <Form className="m-10 tradefrm">
              {(menudetail["CDBAABF2-9A71-025B-2643-83101F525A7A"] && menudetail["CDBAABF2-9A71-025B-2643-83101F525A7A"].Visibility === "E925F86B") && //CDBAABF2-9A71-025B-2643-83101F525A7A
                <FormGroup className="row">
                  <Label for="RequestName" className="col-md-2">
                    <IntlMessages id="request.formet.RequestName" />
                  </Label>
                  <Input
                    disabled={(menudetail["CDBAABF2-9A71-025B-2643-83101F525A7A"].AccessRight === "11E6E7B0") ? true : false}
                    type="text"
                    name="RequestName"
                    value={RequestName}
                    className="col-md-5"
                    id="RequestName"
                    placeholder="Enter Request Name"
                    onChange={this.handleChange}
                  />
                  {errors.RequestName && (
                    <span className="text-danger text-left">
                      <IntlMessages id={errors.RequestName} />
                    </span>
                  ) &&
                    NotificationManager.error(
                      <IntlMessages id={errors.RequestName} />
                    )}
                </FormGroup>}

              {(menudetail["1DA7F0E3-877A-3BB4-2738-5E97FB33920A"] && menudetail["1DA7F0E3-877A-3BB4-2738-5E97FB33920A"].Visibility === "E925F86B") && //1DA7F0E3-877A-3BB4-2738-5E97FB33920A
                <FormGroup className="row">
                  <Label for="ContentType" className="col-md-2">
                    <IntlMessages id="request.formet.ContentType" />
                  </Label>
                  <Input
                    disabled={(menudetail["1DA7F0E3-877A-3BB4-2738-5E97FB33920A"].AccessRight === "11E6E7B0") ? true : false}
                    type="select"
                    name="ContentType"
                    className="col-md-5"
                    value={ContentType}
                    id="ContentType"
                    onChange={this.handleChange}
                  >
                    <IntlMessages id="request.form.option.pleaseslect">
                      {pleaseslect => <option value="">{pleaseslect}</option>}
                    </IntlMessages>
                    <IntlMessages id="request.form.option.string">
                      {string => <option value="string">{string}</option>}
                    </IntlMessages>
                    <IntlMessages id="request.form.option.application/json">
                      {applicationjson => (
                        <option value="application/json">
                          {applicationjson}
                        </option>
                      )}
                    </IntlMessages>
                  </Input>

                  {errors.ContentType && (
                    <span className="text-danger text-left">
                      <IntlMessages id={errors.ContentType} />
                    </span>
                  ) &&
                    NotificationManager.error(
                      <IntlMessages id={errors.ContentType} />
                    )}
                </FormGroup>}

              {(menudetail["C8016B76-8B5D-A093-8FE8-A54D99330A54"] && menudetail["C8016B76-8B5D-A093-8FE8-A54D99330A54"].Visibility === "E925F86B") && //C8016B76-8B5D-A093-8FE8-A54D99330A54
                <FormGroup className="row">
                  <Label for="MethodType" className="col-md-2">
                    <IntlMessages id="request.formet.MethodType" />
                  </Label>
                  <Input
                    disabled={(menudetail["C8016B76-8B5D-A093-8FE8-A54D99330A54"].AccessRight === "11E6E7B0") ? true : false}
                    type="select"
                    name="MethodType"
                    className="col-md-5"
                    value={MethodType}
                    id="MethodType"
                    onChange={this.handleChange}
                  >
                    <IntlMessages id="request.form.option.pleaseslect">
                      {pleaseslect => <option value="">{pleaseslect}</option>}
                    </IntlMessages>
                    <IntlMessages id="request.form.option.get">
                      {GET => <option value="GET">{GET}</option>}
                    </IntlMessages>
                    <IntlMessages id="request.form.option.post">
                      {POST => <option value="POST">{POST}</option>}
                    </IntlMessages>
                    <IntlMessages id="request.form.option.string">
                      {string => <option value="string">{string}</option>}
                    </IntlMessages>
                  </Input>
                  {errors.MethodType && (
                    <span className="text-danger text-left">
                      <IntlMessages id={errors.MethodType} />
                    </span>
                  ) &&
                    NotificationManager.error(
                      <IntlMessages id={errors.MethodType} />
                    )}
                </FormGroup>}

              {(menudetail["9C222536-7785-3FAA-30A1-276D98379038"] && menudetail["9C222536-7785-3FAA-30A1-276D98379038"].Visibility === "E925F86B") && //9C222536-7785-3FAA-30A1-276D98379038
                <FormGroup className="row">
                  <Label for="RequestFormat" className="col-md-2">
                    <IntlMessages id="request.formet.RequestFormat" />
                  </Label>
                  <Input
                    disabled={(menudetail["9C222536-7785-3FAA-30A1-276D98379038"].AccessRight === "11E6E7B0") ? true : false}
                    type="text"
                    className="col-md-5"
                    name="RequestFormat"
                    value={RequestFormat}
                    id="RequestFormat"
                    placeholder="Enter Request Format"
                    onChange={this.handleChange}
                  />
                  {errors.RequestFormat && (
                    <span className="text-danger text-left">
                      <IntlMessages id={errors.RequestFormat} />
                    </span>
                  ) &&
                    NotificationManager.error(
                      <IntlMessages id={errors.RequestFormat} />
                    )}
                </FormGroup>}

              {(menudetail["7D8D9153-5E71-6735-A3A2-4174E72D7AD4"] && menudetail["7D8D9153-5E71-6735-A3A2-4174E72D7AD4"].Visibility === "E925F86B") && //7D8D9153-5E71-6735-A3A2-4174E72D7AD4
                <FormGroup className="row">
                  <Label for="Status" className="col-md-2">
                    <IntlMessages id="request.formet.Status" />
                  </Label>
                  <Input
                    disabled={(menudetail["7D8D9153-5E71-6735-A3A2-4174E72D7AD4"].AccessRight === "11E6E7B0") ? true : false}
                    type="select"
                    name="Status"
                    className="col-md-5"
                    value={Status}
                    id="Status"
                    onChange={this.handleChange}
                  >
                    <IntlMessages id="request.form.option.pleaseslect">
                      {pleaseslect => <option value="">{pleaseslect}</option>}
                    </IntlMessages>
                    <IntlMessages id="request.form.option.zero">
                      {zero => <option value="0">{zero}</option>}
                    </IntlMessages>
                    <IntlMessages id="request.form.option.one">
                      {one => <option value="1">{one}</option>}
                    </IntlMessages>
                  </Input>
                  {errors.Status && (
                    <span className="text-danger text-left">
                      <IntlMessages id={errors.Status} />
                    </span>
                  ) &&
                    NotificationManager.error(
                      <IntlMessages id={errors.Status} />
                    )}
                </FormGroup>}
              {(menudetail["A1C1FE71-342C-27D5-8EA5-84738CC71B8A"] && menudetail["A1C1FE71-342C-27D5-8EA5-84738CC71B8A"].Visibility === "E925F86B") && //A1C1FE71-342C-27D5-8EA5-84738CC71B8A
                <FormGroup className="row">
                  <Label for="RequestType" className="col-md-2">
                    <IntlMessages id="request.formet.RequestType" />
                  </Label>
                  <Input
                    disabled={(menudetail["A1C1FE71-342C-27D5-8EA5-84738CC71B8A"].AccessRight === "11E6E7B0") ? true : false}
                    type="select"
                    name="RequestType"
                    className="col-md-5"
                    value={RequestType}
                    id="RequestType"
                    onChange={this.handleChange}
                  >
                    <IntlMessages id="request.form.option.pleaseslect">
                      {pleaseslect => <option value="">{pleaseslect}</option>}
                    </IntlMessages>

                    {appTypeList.map((appType, key) =>
                      <option key={key} value={appType.Id}>{appType.AppTypeName}</option>
                    )}
                  </Input>
                  {errors.RequestType && (
                    <span className="text-danger text-left">
                      <IntlMessages id={errors.RequestType} />
                    </span>
                  ) &&
                    NotificationManager.error(
                      <IntlMessages id={errors.RequestType} />
                    )}
                </FormGroup>}

              {(menudetail) &&
                <FormGroup row>
                  <Button
                    variant="raised"
                    color="primary"
                    className="text-white mr-10"
                    onClick={() => this.onAddUser()}
                    disabled={this.props.loading}
                  >
                    <IntlMessages id="request.formet.Save" />
                  </Button>
                  <Button
                    variant="raised"
                    color="danger"
                    className="text-white"
                    onClick={() => this.resetData()}
                    disabled={this.props.loading}
                  >
                    <IntlMessages id="request.formet.cancel" />
                  </Button>
                </FormGroup>}
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ({ AllRequestFormet, authTokenRdcer }) => {

  var response = {
    userlist: AllRequestFormet.data,
    loading: AllRequestFormet.loading,
    addError: AllRequestFormet.addError,
    appTypeList: AllRequestFormet.appTypeList,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    addrequestformetlist,
    getAppType,
    getMenuPermissionByID,
  }
)(Addrequetsformatwdgt);
