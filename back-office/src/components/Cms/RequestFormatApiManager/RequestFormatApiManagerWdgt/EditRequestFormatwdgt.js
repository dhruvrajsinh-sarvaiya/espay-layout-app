/* 
    Created By : Megha Kariya (actual develop by Jineshbhai)
    Date : 20-02-2019
    Description : Edit form of CMS Request Format API
*/

import React, { Component } from "react";
import {
  Form,
  FormGroup,
  Input,
  Label,
  Col,
  Row,
  Button
} from "reactstrap";
import { connect } from "react-redux";
import { NotificationManager } from "react-notifications";
import CloseButton from "@material-ui/core/Button";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import {
  editrequestlist,
  getrequestformet,
  getAppType
} from "Actions/RequestFormatApiManager";
import { getMenuPermissionByID } from 'Actions/MyAccount';
import IntlMessages from "Util/IntlMessages";
const validateRequestFormatApiInput = require("../../../../validation/RequestFormatApiManager/requestFormatApi");
const buttonSizeSmall = {
  maxHeight: "28px",
  minHeight: "28px",
  maxWidth: "28px",
  fontSize: "1rem"
};

class EditRequestformatwdgt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      isAPICall: false,
      updateNewData: false,
      RequestID: this.props.selectedData.RequestID,
      RequestName: this.props.selectedData.RequestName,
      ContentType: this.props.selectedData.ContentType,
      MethodType: this.props.selectedData.MethodType,
      RequestFormat: this.props.selectedData.RequestFormat,
      Status: this.props.selectedData.Status,
      RequestType: this.props.selectedData.RequestType,
      appTypeList: [],
      fieldList: {},
      menudetail: [],
      Pflag: true,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.props.getMenuPermissionByID('BEDDE08C-8EA4-60E4-A3BC-68ECA65B34F5');
  }

  componentWillReceiveProps(nextProps) {
    // update menu details if not set 
    if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
      if (nextProps.menu_rights.ReturnCode === 0) {
        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
        this.props.getAppType();
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        setTimeout(() => {
          this.props.drawerClose();
        }, 2000);
      }
      this.setState({ Pflag: false })
    }

    if (nextProps.selectedData) {
      this.setState({
        RequestID: nextProps.selectedData.RequestID,
        RequestName: nextProps.selectedData.RequestName,
        ContentType: nextProps.selectedData.ContentType,
        MethodType: nextProps.selectedData.MethodType,
        RequestFormat: nextProps.selectedData.RequestFormat,
        Status: nextProps.selectedData.Status,
        RequestType: nextProps.selectedData.RequestType,
      });
    }

    if (typeof nextProps.appTypeList != 'undefined' && nextProps.appTypeList.ReturnCode === 0 && typeof nextProps.appTypeList.Response != 'undefined' && nextProps.appTypeList.Response.length !== 0) {
      this.setState({ appTypeList: nextProps.appTypeList.Response });
    }

    if (
      nextProps.userlist !== undefined &&
      nextProps.userlist.ReturnCode === 0 &&
      this.state.updateNewData
    ) {
      NotificationManager.success(<IntlMessages id="emailApiManager.Status.Success.edit" />); // Change By Megha Kariya (21/02/2019)
      this.setState({
        updateNewData: false,
        open: false
      });
      this.props.drawerClose();
      this.props.getrequestformet();
    } else if (
      nextProps.EditError.length !== 0 &&
      nextProps.EditError.ReturnCode !== 0 &&
      this.state.updateNewData
    ) {
      NotificationManager.error(
        <IntlMessages
          id={`error.trading.transaction.${nextProps.EditError.ErrorCode}`}
        />
      );
      this.setState({ updateNewData: false });
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onEditUser = () => {
    const {
      RequestID,
      RequestName,
      ContentType,
      MethodType,
      RequestFormat,
      Status,
      RequestType
    } = this.state;
    const data = {
      RequestID: RequestID,
      RequestName: RequestName,
      ContentType: ContentType,
      MethodType: MethodType,
      RequestFormat: RequestFormat,
      Status: Status,
      RequestType: RequestType
    };

    const { errors, isValid } = validateRequestFormatApiInput(data);

    Object.keys(errors).forEach(function (item) {
      NotificationManager.error(<IntlMessages id={errors[item]} />);
    });

    if (!isValid) {
      this.setState({ updateNewData: true });
      this.props.editrequestlist(data);
    }
  };

  toggleDrawer = () => {
    this.setState({ open: this.state.open ? false : true });
  };

  closeAll = () => {
    this.setState({ open: this.state.open });
  };

  /* check menu permission */
  checkAndGetMenuAccessDetail(GUID) {
    let response = {};
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
    var menudetail = this.checkAndGetMenuAccessDetail('2D09A428-A31E-5F98-70D6-FCC5E1B93954');
    const { drawerClose } = this.props;

    return (
      <div className="m-10 p-5">
        {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
        <div className="m-20 page-title d-flex justify-content-between align-items-center">
          <div className="page-title-wrap">
            <h2>{<IntlMessages id="request.formet.editform" />}</h2>
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
              onClick={this.props.closeAll}
            >
              <i className="zmdi zmdi-home" />
            </CloseButton>
          </div>
        </div>
        <Row>
          <Col md={12}>
            <Form className="m-10 tradefrm">
              {(menudetail["FBE289F5-23C9-64F8-57D8-980F9E6992FA"] && menudetail["FBE289F5-23C9-64F8-57D8-980F9E6992FA"].Visibility === "E925F86B") && //FBE289F5-23C9-64F8-57D8-980F9E6992FA
                <FormGroup className="row">
                  <Label for="RequestName" className="col-md-2">
                    <IntlMessages id="request.formet.RequestName" />{" "}
                  </Label>
                  <Input
                    disabled={(menudetail["FBE289F5-23C9-64F8-57D8-980F9E6992FA"].AccessRight === "11E6E7B0") ? true : false}
                    type="text"
                    name="RequestName"
                    value={this.state.RequestName}
                    className="col-md-5"
                    id="RequestName"
                    placeholder="Enter Request Name"
                    onChange={this.handleChange}
                  />
                </FormGroup>}
              {(menudetail["60CC9A89-09FC-9FD0-0EF9-12FE7C9A2C0A"] && menudetail["60CC9A89-09FC-9FD0-0EF9-12FE7C9A2C0A"].Visibility === "E925F86B") && //60CC9A89-09FC-9FD0-0EF9-12FE7C9A2C0A
                <FormGroup className="row">
                  <Label for="ContentType" className="col-md-2">
                    <IntlMessages id="request.formet.ContentType" />
                  </Label>
                  <Input
                    disabled={(menudetail["60CC9A89-09FC-9FD0-0EF9-12FE7C9A2C0A"].AccessRight === "11E6E7B0") ? true : false}
                    type="select"
                    name="ContentType"
                    className="col-md-5"
                    value={this.state.ContentType}
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
                </FormGroup>}
              {(menudetail["6373972E-6697-2E84-48AA-651AABAF51BA"] && menudetail["6373972E-6697-2E84-48AA-651AABAF51BA"].Visibility === "E925F86B") && //6373972E-6697-2E84-48AA-651AABAF51BA
                <FormGroup className="row">
                  <Label for="MethodType" className="col-md-2">
                    <IntlMessages id="request.formet.MethodType" />
                  </Label>
                  <Input
                    disabled={(menudetail["6373972E-6697-2E84-48AA-651AABAF51BA"].AccessRight === "11E6E7B0") ? true : false}
                    type="select"
                    name="MethodType"
                    className="col-md-5"
                    value={this.state.MethodType}
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
                </FormGroup>}
              {(menudetail["134E5FED-A05A-2959-3E86-8C7E851D5D9D"] && menudetail["134E5FED-A05A-2959-3E86-8C7E851D5D9D"].Visibility === "E925F86B") && //134E5FED-A05A-2959-3E86-8C7E851D5D9D
                <FormGroup className="row">
                  <Label for="RequestFormat" className="col-md-2">
                    <IntlMessages id="request.formet.RequestFormat" />
                  </Label>
                  <Input
                    disabled={(menudetail["134E5FED-A05A-2959-3E86-8C7E851D5D9D"].AccessRight === "11E6E7B0") ? true : false}
                    type="text"
                    className="col-md-5"
                    name="RequestFormat"
                    value={this.state.RequestFormat}
                    id="RequestFormat"
                    placeholder="Enter Request Format"
                    onChange={this.handleChange}
                  />
                </FormGroup>}
              {(menudetail["E1E99653-34CD-7B42-0749-E2DC06164637"] && menudetail["E1E99653-34CD-7B42-0749-E2DC06164637"].Visibility === "E925F86B") && //E1E99653-34CD-7B42-0749-E2DC06164637
                <FormGroup className="row">
                  <Label for="Status" className="col-md-2">
                    <IntlMessages id="request.formet.Status" />
                  </Label>
                  <Input
                    disabled={(menudetail["E1E99653-34CD-7B42-0749-E2DC06164637"].AccessRight === "11E6E7B0") ? true : false}
                    type="select"
                    name="Status"
                    className="col-md-5"
                    value={this.state.Status}
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
                </FormGroup>}
              {(menudetail["6F6FA24C-8EDE-4550-84EC-49C86F2A7FB2"] && menudetail["6F6FA24C-8EDE-4550-84EC-49C86F2A7FB2"].Visibility === "E925F86B") && //6F6FA24C-8EDE-4550-84EC-49C86F2A7FB2
                <FormGroup className="row">
                  <Label for="RequestType" className="col-md-2">
                    <IntlMessages id="request.formet.RequestType" />
                  </Label>
                  <Input
                    disabled={(menudetail["6F6FA24C-8EDE-4550-84EC-49C86F2A7FB2"].AccessRight === "11E6E7B0") ? true : false}
                    type="select"
                    name="RequestType"
                    className="col-md-5"
                    value={this.state.RequestType}
                    id="RequestType"
                    onChange={this.handleChange}
                  >
                    <IntlMessages id="request.form.option.pleaseslect">
                      {pleaseslect => <option value="">{pleaseslect}</option>}
                    </IntlMessages>

                    {this.state.appTypeList.map((appType, key) =>
                      <option key={key} value={appType.Id}>{appType.AppTypeName}</option>
                    )}
                  </Input>
                </FormGroup>}
              {Object.keys(menudetail).length > 0 &&
                <FormGroup row>
                  <Button
                    variant="raised"
                    color="primary"
                    className="text-white mr-10"
                    onClick={() => this.onEditUser()}
                  >
                    <IntlMessages id="request.formet.update" />
                  </Button>
                  <Button
                    variant="raised"
                    className="btn-danger text-white"
                    onClick={drawerClose}
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
    userlist: AllRequestFormet.EditResponse,
    loading: AllRequestFormet.loading,
    EditError: AllRequestFormet.EditError,
    appTypeList: AllRequestFormet.appTypeList,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };
  return response;
};

export default connect(mapStateToProps, {
  editrequestlist,
  getrequestformet,
  getAppType,
  getMenuPermissionByID
})(EditRequestformatwdgt);