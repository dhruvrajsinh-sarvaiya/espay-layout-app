// component for add exchange configuration api manager list By devnag parekh (11-3-2019)

// import necessary components 
import React, { Component } from "react";

//used for design form
import {
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  Row,
  Button
} from "reactstrap";

// display notification
import { NotificationManager } from "react-notifications";

// intl messages
import IntlMessages from "Util/IntlMessages";

// used for display laoder
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

//Added By Tejas For Get Data With Saga
import {
  getExchangeConfigurationList,
  addExchangeConfigurationList,
  getArbitrageProvidersList,
  //getLimitDataList,
  getArbitrageServiceProviderList,
  getArbitrageServiceConfigurationList,
  getArbitrageProviderTypeList,
  getArbitrageTransactionTypeList,
  //getDaemonConfigList
} from "Actions/Arbitrage/ExchangeConfiguration";

// used for connect
import { connect } from "react-redux";

// import button and set style
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

// class for add exchange configuration api devnag parekh (11-3-2019)
class AddExchangeConfiguration extends Component {

  // constructor that defines default state
  constructor(props) {
    super(props);
    this.state = {
      addNewData: false,
      selectedArbitrageProvider: "",
      selectedArbitrageServiceProvider: "",
      selectedDaemon: "",
      selectedArbitrageProviderConfig: "",
      selectedArbitrageProviderType: "",
      //apiKey: "",
      isUsedBuyTransaction: false,
      arbitrageTransactionTypes: [],
      //apiSecret: "",
      selectedLimit: "",
      selectedStatus: "",
      isUsedSellTransaction: false,
      isUsedWithdrawTransaction: false,
      isUsedAddressGeneration: false,
      //added by parth andhariya 
      fieldList: {},
      notificationFlag: true,
      menudetail: [],
    };

  }

  // close all drawer
  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false,
    });
  }

  // used for close drawer
  handleClose = () => {
    this.props.drawerClose();
    this.setState({
      open: false,
      addNewData: false,
      selectedCurrency: "",
      selectedStatus: "",
      serviceId: 0,
      Id: 0,
      // added by Jinesh bhatt for cancel button event 04-02-2019
      selectedArbitrageProvider: "",
      selectedArbitrageServiceProvider: "",
      selectedDaemon: "",
      selectedArbitrageProviderConfig: "",
      selectedArbitrageProviderType: "",
      //apiKey: "",
      isUsedBuyTransaction: false,
      arbitrageTransactionTypes: [],
      //apiSecret: "",
      selectedLimit: "",
      isUsedSellTransaction: false,
      isUsedWithdrawTransaction: false,
      isUsedAddressGeneration: false,
    });
  };
  componentWillMount() {
    this.props.getMenuPermissionByID('62378DDC-65EB-7F6E-3532-2CC11F2E83FB'); // get Trading menu permission
  }
  // invoke when component is about to get props
  componentWillReceiveProps(nextprops) {

    // display success or failure message when get respone from add new record 
    if (nextprops.addExchangeConfigurationApiList && nextprops.addError.length == 0 && this.state.addNewData) {

      NotificationManager.success(<IntlMessages id="liquidity.add.currency.success" />);
      this.setState({
        addNewData: false,
        open: false
      })
      this.props.drawerClose();
      this.props.getExchangeConfigurationList({});
    } else if (nextprops.addError.length !== 0 && nextprops.addError.ReturnCode !== 0 && this.state.addNewData) {
      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.addError.ErrorCode}`} />);
      this.setState({
        addNewData: false
      })
    }
    /* update menu details if not set */
    if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
      if (nextprops.menu_rights.ReturnCode === 0) {
        this.props.getArbitrageProvidersList({});
        this.props.getArbitrageProviderTypeList({});
        this.props.getArbitrageServiceConfigurationList({});
        this.props.getArbitrageServiceProviderList({});
        //this.props.getLimitDataList({});
        this.props.getArbitrageTransactionTypeList({});
        //this.props.getDaemonConfigList({});
        this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
      } else if (nextprops.menu_rights.ReturnCode !== 0) {
        this.setState({ notificationFlag: false });
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        this.props.drawerClose();
      }
    }
  }

  // make request and call api for add api provider data
  addAPIProviderData = () => {

    const {
      selectedArbitrageProvider, selectedArbitrageServiceProvider,
      selectedDaemon, selectedArbitrageProviderConfig,
      selectedArbitrageProviderType, selectedLimit,
      selectedStatus, arbitrageTransactionTypes
    } = this.state;

    const data = {
      APIProviderId: selectedArbitrageProvider ? parseInt(selectedArbitrageProvider) : parseInt(0),
      //LimitId: selectedLimit ? parseInt(selectedLimit) : parseInt(0),
      ProviderMasterId: selectedArbitrageServiceProvider ? parseInt(selectedArbitrageServiceProvider) : parseInt(0),
      //DeamonConfigId: selectedDaemon ? parseInt(selectedDaemon) : parseInt(0),
      arbitrageServiceProviderCongigId: selectedArbitrageProviderConfig ? parseInt(selectedArbitrageProviderConfig) : parseInt(0),
      TransationType: arbitrageTransactionTypes ? arbitrageTransactionTypes : [],
      ProviderTypeId: selectedArbitrageProviderType ? parseInt(selectedArbitrageProviderType) : parseInt(0),
      Status: selectedStatus ? parseInt(selectedStatus) : parseInt(0)
    };

    if (selectedArbitrageProvider === "" || selectedArbitrageProvider == null) {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.apiprovider" />);
    } /* else if (selectedLimit === "" || selectedLimit == null) {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.limit" />);
    } */ else if (selectedArbitrageServiceProvider === "" || selectedArbitrageServiceProvider == null) {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.arbitrageServiceProvider" />);
    } /* else if (selectedDaemon === "" || selectedDaemon == null) {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.daemonconfig" />);
    } */ else if (selectedArbitrageProviderConfig === "" || selectedArbitrageProviderConfig == null) {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.providerconfig" />);
    } else if (selectedArbitrageProviderType === "" || selectedArbitrageProviderType == null) {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.providertype" />);
    } else if (arbitrageTransactionTypes == null) {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.trntype" />);
    } else if (selectedStatus === "" || selectedStatus == null) {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.errors.status" />);
    }
    else {
      this.setState({
        addNewData: true
      })
      this.props.addExchangeConfigurationList(data);
    }
  };

  // set state on change of textbox
  handleChangeData = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  // set status on change of dropdown
  handleChangeStatus = event => {
    this.setState({
      selectedStatus: event.target.value
    })
  }

  // set status on change of dropdown for multiple select
  handleChangeArbitrageTransactionTypes = event => {
    var options = event.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(parseInt(options[i].value));
      }
    }
    this.setState({
      arbitrageTransactionTypes: value
    })
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
    /* check menu permission */
    var menuDetail = this.checkAndGetMenuAccessDetail('1A971625-6681-3891-4F55-E36CEFF62A7D');//1A971625-6681-3891-4F55-E36CEFF62A7D
    const { arbitrageProvidersList, arbitrageTransactionTypeList, /* daemonConfigList, limitData, */ arbitrageProviderType, arbitrageServiceConfiguration, arbitrageServiceProvider } = this.props;
    return (
      <div className="m-10 p-5">
        {(
          this.props.loading
          || this.props.arbitrageProvidersLoading
          || this.props.arbitrageServiceProviderLoading
          || this.props.arbitrageServiceConfigurationLoading
          || this.props.limitDataLoading
          || this.props.daemonConfigListLoading
          || this.props.transactionTypeListLoading
          || this.props.providerTypeLoading
          || this.props.menuLoading
        )
          && <JbsSectionLoader />}
        <div className="m-20 page-title d-flex justify-content-between align-items-center">
          <div className="page-title-wrap">
            <h2><IntlMessages id="liquidityapi.list.title.addnewlist" /></h2>
          </div>
          <div className="page-title-wrap drawer_btn mb-10 text-right">
            <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={() => this.handleClose()}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
            <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
          </div>
        </div>
        <Row>
          <Col md={12}>
            <Form className="m-10 tradefrm">
              <FormGroup row>
                {((menuDetail["EDB1C415-4817-32AF-A194-0B55088119A8"]) && (menuDetail["EDB1C415-4817-32AF-A194-0B55088119A8"].Visibility === "E925F86B")) && //EDB1C415-4817-32AF-A194-0B55088119A8
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="Provider" className='d-inline'>
                        {<IntlMessages id="liquidityprovider.list.option.label.apiprovider" />}<span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <Input
                          disabled={(menuDetail["EDB1C415-4817-32AF-A194-0B55088119A8"].AccessRight === "11E6E7B0") ? true : false}
                          type="select"
                          name="selectedArbitrageProvider"
                          value={this.state.selectedArbitrageProvider}
                          onChange={this.handleChangeData}
                        >
                          <IntlMessages id="sidebar.pairConfiguration.list.lable.enter.apiprovider">
                            {(select) =>
                              <option value="">{select}</option>
                            }
                          </IntlMessages>
                          {arbitrageProvidersList.length && arbitrageProvidersList.map((item, key) => (
                            <option
                              value={item.Id}
                              key={key}
                            >
                              {item.APIName}
                            </option>
                          ))}
                        </Input>
                      </Col>
                    </Row>
                  </Col>
                }
                {/* ((menuDetail["9CD7BE47-58FA-4ABE-0ADE-FE10759852A3"]) && (menuDetail["9CD7BE47-58FA-4ABE-0ADE-FE10759852A3"].Visibility === "E925F86B")) && //9CD7BE47-58FA-4ABE-0ADE-FE10759852A3
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="Limit" className='d-inline'>
                        {<IntlMessages id="liquidityprovider.list.option.label.limit" />}<span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <Input
                          disabled={(menuDetail["9CD7BE47-58FA-4ABE-0ADE-FE10759852A3"].AccessRight === "11E6E7B0") ? true : false}
                          type="select"
                          name="selectedLimit"
                          value={this.state.selectedLimit}
                          onChange={this.handleChangeData}
                        >
                          <IntlMessages id="sidebar.pairConfiguration.list.lable.enter.limit">
                            {(select) =>
                              <option value="">{select}</option>
                            }
                          </IntlMessages>

                          {limitData.length && limitData.map((item, key) => (
                            <option
                              value={item.Id}
                              key={key}
                            >
                              {item.MinAmt} - {item.MaxAmt}
                            </option>
                          ))}
                        </Input>
                      </Col>
                    </Row>
                  </Col>
                 */}
              </FormGroup>
              <FormGroup row>
                {((menuDetail["87E4943B-6A34-9A77-422B-ABD1EDA30503"]) && (menuDetail["87E4943B-6A34-9A77-422B-ABD1EDA30503"].Visibility === "E925F86B")) && //87E4943B-6A34-9A77-422B-ABD1EDA30503
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="arbitrageServiceProvider" className='d-inline'>
                        {<IntlMessages id="liquidityprovider.list.option.label.arbitrageServiceProvider" />}<span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <Input
                          disabled={(menuDetail["87E4943B-6A34-9A77-422B-ABD1EDA30503"].AccessRight === "11E6E7B0") ? true : false}
                          type="select"
                          name="selectedArbitrageServiceProvider"
                          value={this.state.selectedArbitrageServiceProvider}
                          onChange={this.handleChangeData}
                        >
                          <IntlMessages id="sidebar.pairConfiguration.list.lable.enter.arbitrageServiceProvider">
                            {(select) =>
                              <option value="">{select}</option>
                            }
                          </IntlMessages>
                          {arbitrageServiceProvider.length && arbitrageServiceProvider.map((item, key) => (
                            <option
                              value={item.Id}
                              key={key}
                            >
                              {item.ProviderName}
                            </option>
                          ))}
                        </Input>
                      </Col>
                    </Row>
                  </Col>
                }
                {/* ((menuDetail["A1CC3EF0-6369-583C-4D88-118A551B4D44"]) && (menuDetail["A1CC3EF0-6369-583C-4D88-118A551B4D44"].Visibility === "E925F86B")) && //A1CC3EF0-6369-583C-4D88-118A551B4D44
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="daemon" className='d-inline'>
                        {<IntlMessages id="liquidityprovider.list.option.label.daemonconfig" />}<span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <Input
                          disabled={(menuDetail["A1CC3EF0-6369-583C-4D88-118A551B4D44"].AccessRight === "11E6E7B0") ? true : false}
                          type="select"
                          name="selectedDaemon"
                          value={this.state.selectedDaemon}
                          onChange={this.handleChangeData}
                        >
                          <IntlMessages id="sidebar.pairConfiguration.list.lable.enter.daemonconfig">
                            {(select) =>
                              <option value="">{select}</option>
                            }
                          </IntlMessages>
                          {daemonConfigList.length && daemonConfigList.map((item, key) => (
                            <option
                              value={item.Id}
                              key={key}
                            >
                              {item.Name}
                            </option>
                          ))}
                        </Input>
                      </Col>
                    </Row>
                  </Col> */
                }
              </FormGroup>
              <FormGroup row>
                {((menuDetail["2CB79502-9C9F-31FD-8EFA-32DE9C8B541A"]) && (menuDetail["2CB79502-9C9F-31FD-8EFA-32DE9C8B541A"].Visibility === "E925F86B")) && //2CB79502-9C9F-31FD-8EFA-32DE9C8B541A
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="serviceConfig" className='d-inline'>
                        {<IntlMessages id="liquidityprovider.list.option.label.serviceconfig" />}<span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <Input
                          disabled={(menuDetail["2CB79502-9C9F-31FD-8EFA-32DE9C8B541A"].AccessRight === "11E6E7B0") ? true : false}
                          type="select"
                          name="selectedArbitrageProviderConfig"
                          value={this.state.selectedArbitrageProviderConfig}
                          onChange={this.handleChangeData}
                        >
                          <IntlMessages id="sidebar.pairConfiguration.list.lable.enter.providerconfig">
                            {(select) =>
                              <option value="">{select}</option>
                            }
                          </IntlMessages>
                          {arbitrageServiceConfiguration.length && arbitrageServiceConfiguration.map((item, key) => (
                            <option
                              value={item.Id}
                              key={key}
                            >
                              {item.Name}
                            </option>
                          ))}
                        </Input>
                      </Col>
                    </Row>
                  </Col>
                }
                {((menuDetail["FEC0D57D-6070-32BA-8604-0F84DC113AAC"]) && (menuDetail["FEC0D57D-6070-32BA-8604-0F84DC113AAC"].Visibility === "E925F86B")) && //FEC0D57D-6070-32BA-8604-0F84DC113AAC
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="providertype" className='d-inline'>
                        {<IntlMessages id="liquidityprovider.list.option.label.providertype" />}<span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <Input
                          disabled={(menuDetail["FEC0D57D-6070-32BA-8604-0F84DC113AAC"].AccessRight === "11E6E7B0") ? true : false}
                          type="select"
                          name="selectedArbitrageProviderType"
                          value={this.state.selectedArbitrageProviderType}
                          onChange={this.handleChangeData}
                        >
                          <IntlMessages id="sidebar.pairConfiguration.list.lable.enter.providertype">
                            {(select) =>
                              <option value="">{select}</option>
                            }
                          </IntlMessages>
                          {arbitrageProviderType.length && arbitrageProviderType.map((item, key) => (
                            <option value={item.Id} key={key}> {item.ServiveProTypeName} </option>
                          ))}
                        </Input>
                      </Col>
                    </Row>
                  </Col>
                }
              </FormGroup>
              <FormGroup row>
                {((menuDetail["5D93BC75-4523-382D-72D9-B13CB7571278"]) && (menuDetail["5D93BC75-4523-382D-72D9-B13CB7571278"].Visibility === "E925F86B")) && //5D93BC75-4523-382D-72D9-B13CB7571278
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="TransactionTypes">
                        {<IntlMessages id="liquidityprovider.list.option.label.trntypes" />}
                      </Label>
                      <Col sm={8}>
                        <Input
                          disabled={(menuDetail["5D93BC75-4523-382D-72D9-B13CB7571278"].AccessRight === "11E6E7B0") ? true : false}
                          type="select"
                          name="TransactionTypes"
                          multiple="multiple"
                          value={this.state.arbitrageTransactionTypes}
                          onChange={this.handleChangeArbitrageTransactionTypes}
                        >
                          <IntlMessages id="sidebar.pairConfiguration.list.lable.enter.trntype">
                            {(select) =>
                              <option value="">{select}</option>
                            }
                          </IntlMessages>
                          {arbitrageTransactionTypeList.length && arbitrageTransactionTypeList.map((item, key) => (
                            <option
                              value={item.Id}
                              key={key}
                            >
                              {item.TrnTypeName}
                            </option>
                          ))}
                        </Input>
                      </Col>
                    </Row>
                  </Col>
                }
                {((menuDetail["BB7D5FF5-94F0-2F33-231A-2B1EEBF681C6"]) && (menuDetail["BB7D5FF5-94F0-2F33-231A-2B1EEBF681C6"].Visibility === "E925F86B")) && //BB7D5FF5-94F0-2F33-231A-2B1EEBF681C6
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="status" className='d-inline'>
                        <IntlMessages id="manageMarkets.list.form.label.status" /><span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <Input
                          disabled={(menuDetail["BB7D5FF5-94F0-2F33-231A-2B1EEBF681C6"].AccessRight === "11E6E7B0") ? true : false}
                          type="select"
                          name="status"
                          value={this.state.selectedStatus}
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
              {menuDetail &&
                            <FormGroup row>
                            <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                   <div className="btn_area">
                    <Button
                      variant="raised"
                      color="primary"
                      className="text-white"
                      onClick={() => this.addAPIProviderData()}
                      disabled={this.props.loading}
                    >
                      <IntlMessages id="button.add" />
                    </Button>


                    <Button
                      variant="raised"
                      color="danger"
                      className="text-white ml-15"
                      onClick={() => this.handleClose()}
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
  };
}

// map states to props when changed in states from reducer
const mapStateToProps = state => ({
  addExchangeConfigurationApiList: state.arbitrageExchangeConfiguration.addExchangeConfigurationApiList,
  arbitrageProvidersList: state.arbitrageExchangeConfiguration.arbitrageProvidersList,
  arbitrageProvidersLoading: state.arbitrageExchangeConfiguration.arbitrageProvidersLoading,
  arbitrageServiceProvider: state.arbitrageExchangeConfiguration.arbitrageServiceProvider,
  arbitrageServiceProviderLoading: state.arbitrageExchangeConfiguration.arbitrageServiceProviderLoading,
  arbitrageServiceConfiguration: state.arbitrageExchangeConfiguration.arbitrageServiceConfiguration,
  arbitrageServiceConfigurationLoading: state.arbitrageExchangeConfiguration.arbitrageServiceConfigurationLoading,
  arbitrageProviderType: state.arbitrageExchangeConfiguration.arbitrageProviderType,
  arbitrageProviderTypeLoading: state.arbitrageExchangeConfiguration.arbitrageProviderTypeLoading,
  arbitrageTransactionTypeList: state.arbitrageExchangeConfiguration.arbitrageTransactionTypeList,
  arbitrageTransactionTypeListLoading: state.arbitrageExchangeConfiguration.arbitrageTransactionTypeListLoading,
  loading: state.arbitrageExchangeConfiguration.addLoading,
  addError: state.arbitrageExchangeConfiguration.addError,
  menuLoading: state.authTokenRdcer.menuLoading,
  menu_rights: state.authTokenRdcer.menu_rights,
});

// export this component with action methods and props
export default connect(
  mapStateToProps,
  {
    getExchangeConfigurationList,
    addExchangeConfigurationList,
    getArbitrageProvidersList,
    getArbitrageServiceProviderList,
    getArbitrageServiceConfigurationList,
    getArbitrageProviderTypeList,
    getArbitrageTransactionTypeList,
    getMenuPermissionByID
  }
)(AddExchangeConfiguration);
