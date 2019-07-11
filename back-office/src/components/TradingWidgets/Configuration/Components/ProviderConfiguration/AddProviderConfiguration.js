// component for Add Provider  By Tejas

// import necessary component
import React, { Component } from "react";

// used for design
import {
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  Row,
  Button // added By jinesh bhatt for cancel button and submit button instead of mat button
} from "reactstrap";

// import for display notification
import { NotificationManager } from "react-notifications";

// used for laoder
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';
//import action for provider list and add provider
import {
  getProviderConfigList,
  addProviderConfig,
} from "Actions/ProviderConfiguration";

// used for connect 
import { connect } from "react-redux";

// import button and set style for close
import CloseButton from '@material-ui/core/Button';

// intl messages
import IntlMessages from "Util/IntlMessages";
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';

const buttonSizeSmall = {
  maxHeight: '28px',
  minHeight: '28px',
  maxWidth: '28px',
  fontSize: '1rem'
}

// class for add provider configuration
class AddProviderConfigration extends Component {

  // constructor and define default state
  constructor(props) {
    super(props);
    this.state = {
      addNewData: false,
      appKey: "",
      apiKey: "",
      secretKey: "",
      userName: "",
      password: "",
      status: 0,
      //added by parth andhariya 
      fieldList: {},
      notificationFlag: true,
      menudetail: [],
    };
  }
  //added by parth andhariya 
  componentWillMount() {
    this.props.getMenuPermissionByID('F713328D-5137-8E10-5020-861E757C39C6'); // get Trading menu permission
    // code added by parth andhariya for handle and check menu detail and store (18-4-2019)
    // var fieldList = {};
    // if (this.props.menuDetail.Fields && this.props.menuDetail.Fields.length) {
    //   this.props.menuDetail.Fields.forEach(function (item) {
    //     fieldList[item.GUID] = item;
    //   });
    //   this.setState({
    //     fieldList: fieldList
    //   });
    // }
    // code end
  }
  // close all drawer
  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false,
    });
  }

  // close drawer
  handleClose = () => {
    this.props.closeAll();
    this.setState({
      open: false,
      addNewData: false,
    });
  };

  // invoke when component is about to get props
  componentWillReceiveProps(nextprops) {

    // display notification success or failure on add provider 
    if (nextprops.addProviderConfiguration && nextprops.addError.length == 0 && this.state.addNewData) {

      NotificationManager.success(<IntlMessages id="providerconfig.add.currency.success" />);
      this.setState({
        addNewData: false,
        open: false
      })
      this.props.drawerClose();

      //code change by devang parekh (12-6-2019) for handle arbitrage configuration detail
      var reqObject = {};
      if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
        reqObject.IsArbitrage = this.props.IsArbitrage;
      }
      this.props.getProviderConfigList(reqObject);
      //end

    } else if (nextprops.addError.length !== 0 && nextprops.addError.ReturnCode !== 0 && this.state.addNewData) {
      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.addError.ErrorCode}`} />);
      this.setState({
        addNewData: false
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

  // create request and call api for add provider
  addProviderConfigurationData = () => {

    const {
      appKey,
      apiKey,
      secretKey,
      userName,
      password,
      status,
    } = this.state;

    const data = {
      AppKey: appKey ? appKey : '',
      APIKey: apiKey ? apiKey : '',
      SecretKey: secretKey ? secretKey : '',
      UserName: userName ? userName : '',
      Password: password ? password : '',
      Status: status ? parseInt(status) : parseInt(0)
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
      this.setState({
        addNewData: true
      })

      //code change by devang parekh (12-6-2019) for handle arbitrage configuration detail
      var reqObject = data;
      if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
        reqObject.IsArbitrage = this.props.IsArbitrage;
      }
      this.props.addProviderConfig(reqObject);
      //end

    }
  };

  // sert state for handle text boxes
  handleChangeData = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  // set state for status on change of dropdown
  handleChangeStatus = event => {
    this.setState({
      status: event.target.value
    })
  }

  // reset data on click of cancel or back button
  resetData = () => {

    this.props.drawerClose();
    this.setState({
      addNewData: false,
      appKey: "",
      apiKey: "",
      secretKey: "",
      userName: "",
      password: "",
      status: 0,
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
  // renders the component
  render() {
    /* check menu permission */
    var menuDetail = this.checkAndGetMenuAccessDetail('54C1F160-9EB9-485F-20A7-22081A2D7A67');//54C1F160-9EB9-485F-20A7-22081A2D7A67
    // returs the component
    return (
      <div className="m-10 p-5">
        {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
        <div className="m-20 page-title d-flex justify-content-between align-items-center">
          <div className="page-title-wrap">
            <h2><IntlMessages id="providerconfig.list.title.addnewlist" /></h2>
          </div>
          <div className="page-title-wrap drawer_btn mb-10 text-right">
            <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" onClick={() => this.resetData()}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
            <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
          </div>
        </div>

        <Row>
          <Col md={12}>
            <Form className="m-10 tradefrm">
              <FormGroup row>
                {((menuDetail["BEFC7A8E-3591-698C-4E28-D39D4A1F9E4A"]) && (menuDetail["BEFC7A8E-3591-698C-4E28-D39D4A1F9E4A"].Visibility === "E925F86B")) && //BEFC7A8E-3591-698C-4E28-D39D4A1F9E4A
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="appkey" className='d-inline'>
                        <IntlMessages id="sidebar.providerconfig.list.lable.appkey" /><span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <IntlMessages id="sidebar.providerconfig.list.lable.appkey">
                          {(placeholder) =>
                            <Input type="text"
                              disabled={(menuDetail["BEFC7A8E-3591-698C-4E28-D39D4A1F9E4A"].AccessRight === "11E6E7B0") ? true : false}
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
                {((menuDetail["99969BFC-9CD9-0EC8-415C-CAB818370252"]) && (menuDetail["99969BFC-9CD9-0EC8-415C-CAB818370252"].Visibility === "E925F86B")) && //99969BFC-9CD9-0EC8-415C-CAB818370252
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="apikey" className='d-inline'>
                        <IntlMessages id="sidebar.providerconfig.list.lable.apikey" /><span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <IntlMessages id="sidebar.providerconfig.list.lable.apikey">
                          {(placeholder) =>
                            <Input type="text"
                              disabled={(menuDetail["99969BFC-9CD9-0EC8-415C-CAB818370252"].AccessRight === "11E6E7B0") ? true : false}
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
                {((menuDetail["AF25C24C-A6F1-1D6E-0AB6-75D5C06C774D"]) && (menuDetail["AF25C24C-A6F1-1D6E-0AB6-75D5C06C774D"].Visibility === "E925F86B")) && //AF25C24C-A6F1-1D6E-0AB6-75D5C06C774D
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="secretkey" className='d-inline'>
                        <IntlMessages id="sidebar.providerconfig.list.lable.secretkey" /><span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <IntlMessages id="sidebar.providerconfig.list.lable.secretkey">
                          {(placeholder) =>
                            <Input type="text"
                              disabled={(menuDetail["AF25C24C-A6F1-1D6E-0AB6-75D5C06C774D"].AccessRight === "11E6E7B0") ? true : false}
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
                {((menuDetail["78DB8DE9-A011-30B5-9357-786D65779B74"]) && (menuDetail["78DB8DE9-A011-30B5-9357-786D65779B74"].Visibility === "E925F86B")) && //78DB8DE9-A011-30B5-9357-786D65779B74
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="username" className='d-inline'>
                        <IntlMessages id="sidebar.providerconfig.list.lable.username" /><span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <IntlMessages id="sidebar.providerconfig.list.lable.username">
                          {(placeholder) =>
                            <Input type="text"
                              disabled={(menuDetail["78DB8DE9-A011-30B5-9357-786D65779B74"].AccessRight === "11E6E7B0") ? true : false}
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
                {((menuDetail["D7517EB1-9C15-9E47-16CC-891C74C6A091"]) && (menuDetail["D7517EB1-9C15-9E47-16CC-891C74C6A091"].Visibility === "E925F86B")) && //D7517EB1-9C15-9E47-16CC-891C74C6A091
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="password" className='d-inline'>
                        <IntlMessages id="sidebar.providerconfig.list.lable.password" /><span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <IntlMessages id="sidebar.providerconfig.list.lable.password">
                          {(placeholder) =>
                            <Input type="password"
                              disabled={(menuDetail["D7517EB1-9C15-9E47-16CC-891C74C6A091"].AccessRight === "11E6E7B0") ? true : false}
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
                {((menuDetail["14947E13-1D6A-25D9-9B20-9A60CF2F5BC6"]) && (menuDetail["14947E13-1D6A-25D9-9B20-9A60CF2F5BC6"].Visibility === "E925F86B")) && //14947E13-1D6A-25D9-9B20-9A60CF2F5BC6
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="status" className='d-inline'>
                        <IntlMessages id="manageMarkets.list.form.label.status" /><span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <Input
                          disabled={(menuDetail["14947E13-1D6A-25D9-9B20-9A60CF2F5BC6"].AccessRight === "11E6E7B0") ? true : false}
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
              <hr />
              {Object.keys(menuDetail).length > 0 &&
                <FormGroup row>
                  <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                    <div className="btn_area">
                      <Button
                        variant="raised"
                        color="primary"
                        className="text-white"
                        onClick={() => this.addProviderConfigurationData()}
                        disabled={this.props.loading}
                      >
                        <IntlMessages id="button.add" />
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

// map states to props when changed in states from reducer
const mapStateToProps = state => ({
  addProviderConfiguration: state.ProviderConfig.addProviderConfiguration,
  loading: state.ProviderConfig.addLoading,
  addError: state.ProviderConfig.addError,
  menuLoading: state.authTokenRdcer.menuLoading,
  menu_rights: state.authTokenRdcer.menu_rights,
});

// export this component with action methods and props
export default connect(
  mapStateToProps,
  {
    getProviderConfigList,
    addProviderConfig,
    getMenuPermissionByID
  }
)(AddProviderConfigration);
