import React, { Component } from "react";
import { Form, FormGroup, Label, Input, Col, Row, Button } from "reactstrap";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';
import { NotificationManager } from "react-notifications";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

//Added By Tejas For Get Data With Saga
import {
  getProviderConfigList,
  updateProviderConfig,
} from "Actions/ProviderConfiguration";

import { connect } from "react-redux";

import CloseButton from '@material-ui/core/Button';
//Action methods..
import {
  getMenuPermissionByID
} from 'Actions/MyAccount';
const buttonSizeSmall = {
  maxHeight: '28px',
  minHeight: '28px',
  maxWidth: '28px',
  fontSize: '1rem'
}

class UpdateProviderConfigration extends Component {

  constructor(props) {
    super(props);
    this.state = {
      updateData: false,
      appKey: this.props.selectedData.AppKey,
      apiKey: this.props.selectedData.APIKey,
      secretKey: this.props.selectedData.SecretKey,
      userName: this.props.selectedData.UserName,
      password: this.props.selectedData.Password,
      status: this.props.selectedData.status,
      id: this.props.selectedData.Id,
      isUpdate: false,
      //added by parth andhariya 
      fieldList: {},
      notificationFlag: true,
      menudetail: [],
    };
  }
  //added by parth andhariya 
  componentWillMount() {
    this.props.getMenuPermissionByID('F713328D-5137-8E10-5020-861E757C39C6'); // get Trading menu permission
  }
  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false,
      isUpdate: false,
    });
  }

  handleClose = () => {
    this.props.closeAll();
    this.setState({
      open: false,
      updateData: false,
      isUpdate: false,
    });
  };

  componentWillReceiveProps(nextprops) {

    if (nextprops.selectedData) {
      this.setState({
        appKey: nextprops.selectedData.AppKey,
        apiKey: nextprops.selectedData.APIKey,
        secretKey: nextprops.selectedData.SecretKey,
        userName: nextprops.selectedData.UserName,
        password: nextprops.selectedData.Password,
        status: nextprops.selectedData.status,
        id: nextprops.selectedData.Id,
      })
    }

    if (nextprops.updateProviderConfiguration && nextprops.updateError.length == 0 && this.state.updateData) {
      NotificationManager.success(<IntlMessages id="providerconfig.add.currency.success" />);
      this.setState({
        updateData: false,
        isUpdate: false,
        open: false
      })
      this.props.drawerClose();
      
      //code change by devang parekh (12-6-2019) for handle arbitrage configuration detail
      var reqObject = {};
      if(this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
          reqObject.IsArbitrage = this.props.IsArbitrage;
      }
      this.props.getProviderConfigList(reqObject);
      //end

    } else if (nextprops.updateError.length !== 0 && nextprops.updateError.ReturnCode !== 0 && this.state.updateData) {
      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.updateError.ErrorCode}`} />);
      this.setState({
        updateData: false,
        isUpdate: false
      })
    }
    /* update menu details if not set */
    if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
      if (nextprops.menu_rights.ReturnCode === 0) {
        this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
      } else if (nextprops.menu_rights.ReturnCode !== 0) {
        this.setState({ notificationFlag: false });
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        this.props.drawerClose();
      }
    }
  }

  updateProviderConfigurationData = () => {
    const {
      appKey,
      apiKey,
      secretKey,
      userName,
      password,
      status,
      id
    } = this.state;

    const data = {
      AppKey: appKey ? appKey : '',
      APIKey: apiKey ? apiKey : '',
      SecretKey: secretKey ? secretKey : '',
      UserName: userName ? userName : '',
      Password: password ? password : '',
      Status: status ? parseInt(status) : parseInt(0),
      Id: id
    };

    if (appKey === "" || appKey == null) {
      NotificationManager.error(<IntlMessages id="sidebar.providerconfig.list.lable.enter.appkey" />);
    } else if (isScriptTag(appKey)) {
      NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
    }
    else if (isHtmlTag(appKey)) {
      NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
    }
    else if (apiKey === "" || apiKey == null) {

      NotificationManager.error(<IntlMessages id="sidebar.providerconfig.list.lable.enter.apikey" />);
    }
    else if (isScriptTag(apiKey)) {
      NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
    }
    else if (isHtmlTag(apiKey)) {
      NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
    } else if (secretKey === "" || secretKey == null) {

      NotificationManager.error(<IntlMessages id="sidebar.providerconfig.list.lable.enter.secretkey" />);
    }
    else if (isScriptTag(secretKey)) {
      NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
    }
    else if (isHtmlTag(secretKey)) {
      NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
    } else if (userName === "" || userName == null) {

      NotificationManager.error(<IntlMessages id="sidebar.providerconfig.list.lable.enter.username" />);
    }
    else if (isScriptTag(userName)) {
      NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
    }
    else if (isHtmlTag(userName)) {
      NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
    } else if (password === "" || password == null) {

      NotificationManager.error(<IntlMessages id="sidebar.providerconfig.list.lable.enter.password" />);
    }
    else if (isScriptTag(password)) {
      NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
    }
    else if (isHtmlTag(password)) {
      NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
    } else if (status === "" || status == null) {
      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.errors.status" />);
    }
    else {
      if (this.state.isUpdate) {
        this.setState({
          updateData: true
        })

        //code change by devang parekh (12-6-2019) for handle arbitrage configuration detail
        var reqObject = data;
        if(this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
            reqObject.IsArbitrage = this.props.IsArbitrage;
        }
        this.props.updateProviderConfig(reqObject);

      } else {
        NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.pleaseChange" />)
      }
    }
  };

  handleChangeData = event => {
    this.setState({
      [event.target.name]: event.target.value,
      isUpdate: true,
    })
  }

  handleChangeStatus = event => {
    this.setState({
      status: event.target.value,
      isUpdate: true,
    })
  };
  // added by jinesh bhatt for cancel button event 04-02-2019
  resetData = () => {
    this.props.drawerClose();
    this.setState({
      updateData: false,
      appKey: "",
      apiKey: "",
      secretKey: "",
      userName: "",
      password: "",
      status: "",
      id: "",
      isUpdate: false,
    });
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
             response = fieldList;
          }
        }
      }
    }
      return response;
  }
  render() {
    /* check menu permission */
    var menuDetail = this.checkAndGetMenuAccessDetail('733FCB30-158F-2477-32B4-1E70EE8A4DD6');//733FCB30-158F-2477-32B4-1E70EE8A4DD6
    const { drawerClose } = this.props;
    return (
      <div className="m-10 p-5">
        {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
        <div className="m-20 page-title d-flex justify-content-between align-items-center">
          <div className="page-title-wrap">
            <h2><IntlMessages id="providerconfig.list.title.updatelist" /></h2>
          </div>
          <div className="page-title-wrap drawer_btn mb-10 text-right">
            <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
            <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
          </div>
        </div>
        <Row>
          <Col md={12}>
            <Form className="m-10 tradefrm">
              <FormGroup row>
                {((menuDetail["0E093D7F-78C7-765E-1AA6-3479879C5902"]) && (menuDetail["0E093D7F-78C7-765E-1AA6-3479879C5902"].Visibility === "E925F86B")) && //0E093D7F-78C7-765E-1AA6-3479879C5902
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="appkey" className='d-inline'>
                        <IntlMessages id="sidebar.providerconfig.list.lable.appkey" /><span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <IntlMessages id="sidebar.providerconfig.list.lable.appkey">
                          {(placeholder) =>
                            <Input type="text"
                              disabled={(menuDetail["0E093D7F-78C7-765E-1AA6-3479879C5902"].AccessRight === "11E6E7B0") ? true : false}
                              name="appKey"
                              value={this.state.appKey}
                              onChange={this.handleChangeData}
                              placeholder={placeholder} ></Input>
                          }
                        </IntlMessages>
                      </Col>
                    </Row>
                  </Col>
                }
                {((menuDetail["A2D4D9FF-393B-8359-2220-4250C7D2750F"]) && (menuDetail["A2D4D9FF-393B-8359-2220-4250C7D2750F"].Visibility === "E925F86B")) && //A2D4D9FF-393B-8359-2220-4250C7D2750F
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="apikey" className='d-inline'>
                        <IntlMessages id="sidebar.providerconfig.list.lable.apikey" /><span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <IntlMessages id="sidebar.providerconfig.list.lable.apikey">
                          {(placeholder) =>
                            <Input type="text"
                              disabled={(menuDetail["A2D4D9FF-393B-8359-2220-4250C7D2750F"].AccessRight === "11E6E7B0") ? true : false}
                              name="apiKey"
                              value={this.state.apiKey}
                              onChange={this.handleChangeData}
                              placeholder={placeholder} ></Input>
                          }
                        </IntlMessages>
                      </Col>
                    </Row>
                  </Col>
                }
              </FormGroup>
              <FormGroup row>
                {((menuDetail["A86E4F5B-4378-2CBC-0C16-652DAC7A0D66"]) && (menuDetail["A86E4F5B-4378-2CBC-0C16-652DAC7A0D66"].Visibility === "E925F86B")) && //A86E4F5B-4378-2CBC-0C16-652DAC7A0D66
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="secretkey" className='d-inline'>
                        <IntlMessages id="sidebar.providerconfig.list.lable.secretkey" /><span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <IntlMessages id="sidebar.providerconfig.list.lable.secretkey">
                          {(placeholder) =>
                            <Input type="text"
                              disabled={(menuDetail["A86E4F5B-4378-2CBC-0C16-652DAC7A0D66"].AccessRight === "11E6E7B0") ? true : false}
                              name="secretKey"
                              value={this.state.secretKey}
                              onChange={this.handleChangeData}
                              placeholder={placeholder} ></Input>
                          }
                        </IntlMessages>
                      </Col>
                    </Row>
                  </Col>
                }
                {((menuDetail["EDFA432D-46A4-2EFC-87FF-D79FDA7C290E"]) && (menuDetail["EDFA432D-46A4-2EFC-87FF-D79FDA7C290E"].Visibility === "E925F86B")) && //EDFA432D-46A4-2EFC-87FF-D79FDA7C290E
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="username" className='d-inline'>
                        <IntlMessages id="sidebar.providerconfig.list.lable.username" /><span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <IntlMessages id="sidebar.providerconfig.list.lable.username">
                          {(placeholder) =>
                            <Input type="text"
                              disabled={(menuDetail["EDFA432D-46A4-2EFC-87FF-D79FDA7C290E"].AccessRight === "11E6E7B0") ? true : false}
                              name="userName"
                              value={this.state.userName}
                              onChange={this.handleChangeData}
                              placeholder={placeholder} ></Input>
                          }
                        </IntlMessages>
                      </Col>
                    </Row>
                  </Col>
                }
              </FormGroup>
              <FormGroup row>
                {((menuDetail["5507D448-0254-17EA-7298-5931CE927BAA"]) && (menuDetail["5507D448-0254-17EA-7298-5931CE927BAA"].Visibility === "E925F86B")) && //5507D448-0254-17EA-7298-5931CE927BAA
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="password" className='d-inline'>
                        <IntlMessages id="sidebar.providerconfig.list.lable.password" /><span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <IntlMessages id="sidebar.providerconfig.list.lable.password">
                          {(placeholder) =>
                            <Input type="password"
                              disabled={(menuDetail["5507D448-0254-17EA-7298-5931CE927BAA"].AccessRight === "11E6E7B0") ? true : false}
                              name="password"
                              // value={this.state.password} //Added By Bharat Jograna
                              onChange={this.handleChangeData}
                              placeholder={placeholder} ></Input>
                          }
                        </IntlMessages>
                      </Col>
                    </Row>
                  </Col>
                }
                {((menuDetail["552DCD14-06EA-7479-29AB-932CC62982CA"]) && (menuDetail["552DCD14-06EA-7479-29AB-932CC62982CA"].Visibility === "E925F86B")) && //552DCD14-06EA-7479-29AB-932CC62982CA
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="status" className='d-inline'>
                        <IntlMessages id="manageMarkets.list.form.label.status" /><span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <Input
                          disabled={(menuDetail["552DCD14-06EA-7479-29AB-932CC62982CA"].AccessRight === "11E6E7B0") ? true : false}
                          type="select"
                          name="status"
                          value={this.state.status}
                          onChange={(e) => this.handleChangeStatus(e)}
                        >
                          <IntlMessages id="trading.pairconfig.placeholder.selectstatus">
                            {(select) =>
                              <option value="">{select}</option>
                            }
                          </IntlMessages>
                          <IntlMessages id="manageMarkets.list.column.label.status.active">
                            {(select) =>
                              <option value="1">{select}</option>
                            }
                          </IntlMessages>
                          <IntlMessages id="manageMarkets.list.column.label.status.inactive">
                            {(select) =>
                              <option value="0">{select}</option>
                            }
                          </IntlMessages>
                        </Input>
                      </Col>
                    </Row>
                  </Col>
                }
              </FormGroup>
              {/* // added By jinesh bhatt for cancel button and change button alignemnt into center date : 04-02-2019*/}
              <hr />
              {Object.keys(menuDetail).length > 0 &&
                <FormGroup row>
                  <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                    <div className="btn_area">
                      <Button
                        variant="raised"
                        color="primary"
                        className="text-white"
                        onClick={() => this.updateProviderConfigurationData()}
                        disabled={this.props.loading}
                      >
                        <IntlMessages id="liquidityprovider.tooltip.update" />
                      </Button>
                      <Button
                        variant="raised"
                        color="danger"
                        className="text-white ml-15"
                        onClick={() => this.resetData()}
                        disabled={this.props.loading}
                      >
                        <IntlMessages id="sidebar.pairConfiguration.button.cancel" />
                      </Button>
                    </div>
                  </div>
                </FormGroup>
              }
            </Form>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  updateProviderConfiguration: state.ProviderConfig.updateProviderConfiguration,
  loading: state.ProviderConfig.updateLoading,
  updateError: state.ProviderConfig.updateError,
  menuLoading: state.authTokenRdcer.menuLoading,
  menu_rights: state.authTokenRdcer.menu_rights,
});

// export this component with action methods and props
export default connect(
  mapStateToProps,
  {
    getProviderConfigList,
    updateProviderConfig,
    getMenuPermissionByID,
  }
)(UpdateProviderConfigration);
