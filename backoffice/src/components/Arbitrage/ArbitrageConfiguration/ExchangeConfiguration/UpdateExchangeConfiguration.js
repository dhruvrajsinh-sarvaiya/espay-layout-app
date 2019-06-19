// component for update exchange configuration manager list by devang parekh (11-3-2019)

import React, { Component, Fragment } from "react";

// used for design 
import {
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  Row,
  Button
} from "reactstrap";

// display notification for success or failure
import { NotificationManager } from "react-notifications";

// section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// intl messages
import IntlMessages from "Util/IntlMessages";

// Actions for call methods, get data 
import {
  getLiquidityManagerList,
  updateLiquidityManagerList,
  getProvidersList,
  getLimitDataList,
  getServiceProviderList,
  getServiceConfigurationList,
  getProviderTypeList,
  getTransactionTypeList,
  getDaemonConfigList
} from "Actions/LiquidityManager";

// used for connect 
import { connect } from "react-redux";

//import button and set style
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

// class for update exchange configuration api managerby devang parekh (11-3-2019)
class UpdateExchangeConfiguration extends Component {

  // constructor and define default state
  constructor(props) {
    super(props);
    this.state = {
      updateData: false,
      selectedProvider: "",
      selectedServiceProvider: "",
      selectedDaemon: "",
      selectedProviderConfig: "",
      selectedProviderType: "",
      //apiKey: "",
      isUsedBuyTransaction: false,
      transactionTypes: [],
      //apiSecret: "",
      selectedLimit: "",
      selectedStatus: "",
      isUsedSellTransaction: false,
      isUsedWithdrawTransaction: false,
      isUsedAddressGeneration: false,
      isUpdate: false,
      id: 0,
      //added by parth andhariya 
      fieldList: {},
      notificationFlag: true,
      menudetail: [],
    };
  }

  // close drawer
  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false,
    });
  }
  // updated By jinesh bhatt for handle button close event date : 04-02-2019
  handleClose = () => {
    this.props.drawerClose();
    this.setState({
      open: false,
      updateData: false,
      selectedProvider: "",
      selectedServiceProvider: "",
      selectedDaemon: "",
      selectedProviderConfig: "",
      selectedProviderType: "",
      isUsedBuyTransaction: false,
      transactionTypes: [],
      selectedLimit: "",
      selectedStatus: "",
      isUsedSellTransaction: false,
      isUsedWithdrawTransaction: false,
      isUsedAddressGeneration: false,
      isUpdate: false,
      id: 0,
    });
  };
  componentWillMount() {
    this.props.getMenuPermissionByID('62378DDC-65EB-7F6E-3532-2CC11F2E83FB'); // get Trading menu permission
  }
  componentWillReceiveProps(nextprops) {
    // set state for selected data
    if (nextprops.selectedData && this.state.updateData == false) {
      this.setState({
        selectedProvider: nextprops.selectedData.APIProviderId,
        selectedLimit: nextprops.selectedData.LimitId,
        selectedServiceProvider: nextprops.selectedData.ProviderMasterId,
        selectedDaemon: nextprops.selectedData.DeamonConfigId,
        selectedStatus: nextprops.selectedData.Status,
        selectedProviderConfig: nextprops.selectedData.ServiceProviderCongigId,
        selectedProviderType: nextprops.selectedData.ProviderTypeId,
        TransationType: nextprops.selectedData.TransationType,
        id: nextprops.selectedData.Id
      })
    }

    // display success or failure message when get respone from Update record 
    if (nextprops.updateliquidityApiList && nextprops.updateError.length == 0 && this.state.updateData) {
      NotificationManager.success(<IntlMessages id="liquidity.update.currency.success" />);
      this.setState({
        updateData: false,
        open: false,
        isUpdate: false
      })
      this.props.drawerClose();
      this.props.getLiquidityManagerList({});
    } else if (nextprops.updateError.length !== 0 && nextprops.updateError.ReturnCode !== 0 && this.state.updateData) {
      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.updateError.ErrorCode}`} />);
      this.setState({
        updateData: false
      })
    }
    /* update menu details if not set */
    if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
      if (nextprops.menu_rights.ReturnCode === 0) {
        this.props.getProvidersList({});
        this.props.getProviderTypeList({});
        this.props.getServiceConfigurationList({});
        this.props.getServiceProviderList({});
        this.props.getLimitDataList({});
        this.props.getTransactionTypeList({});
        this.props.getDaemonConfigList({});
        this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
      } else if (nextprops.menu_rights.ReturnCode !== 0) {
        this.setState({ notificationFlag: false });
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        this.props.drawerClose();
      }
    }
  }

  // call api for get data
  // componentDidMount() {
  //   //added by parth andhariya 
  //   // code added by devang parekh for handle and check menu detail and store (18-4-2019)
  //   var fieldList = {};
  //   if (this.props.menuDetail.Fields && this.props.menuDetail.Fields.length) {
  //     this.props.menuDetail.Fields.forEach(function (item) {
  //       fieldList[item.GUID] = item;
  //     });
  //     this.setState({
  //       fieldList: fieldList
  //     });
  //   }
  //   // code end
  //   this.props.getProvidersList({});
  //   this.props.getProviderTypeList({});
  //   this.props.getServiceConfigurationList({});
  //   this.props.getServiceProviderList({});
  //   this.props.getLimitDataList({});
  //   this.props.getTransactionTypeList({});
  //   this.props.getDaemonConfigList({});
  // }

  // set state for on change of text box
  handleChangeData = event => {
    this.setState({
      [event.target.name]: event.target.value,
      isUpdate: true
    })
  }

  // set status on change of dropdown
  handleChangeStatus = event => {
    this.setState({
      selectedStatus: event.target.value
    })
  }

  // set state for transaction types n change of dropdown for multiple select
  handleChangeTransactionTypes = event => {
    var options = event.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(parseInt(options[i].value));
      }
    }
    this.setState({
      transactionTypes: value,
      isUpdate: true
    })
  }

  // create request for update  and call api for update exchange configuration api manager recordby devang parekh (11-3-2019)
  updateAPIProviderData = () => {
    const {
      selectedProvider, selectedServiceProvider,
      selectedDaemon, selectedProviderConfig,
      selectedProviderType, selectedLimit,
      selectedStatus, TransationType,
      id, isUpdate
    } = this.state;

    const data = {
      Id: id,
      APIProviderId: selectedProvider ? parseInt(selectedProvider) : parseInt(0),
      LimitId: selectedLimit ? parseInt(selectedLimit) : parseInt(0),
      ProviderMasterId: selectedServiceProvider ? parseInt(selectedServiceProvider) : parseInt(0),
      DeamonConfigId: selectedDaemon ? parseInt(selectedDaemon) : parseInt(0),
      ServiceProviderCongigId: selectedProviderConfig ? parseInt(selectedProviderConfig) : parseInt(0),
      TransationType: TransationType ? parseInt(TransationType) : parseInt(0),
      ProviderTypeId: selectedProviderType ? parseInt(selectedProviderType) : parseInt(0),
      Status: selectedStatus ? parseInt(selectedStatus) : parseInt(0)
    };

    if (selectedProvider === "" || selectedProvider == null) {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.apiprovider" />);
    } else if (selectedLimit === "" || selectedLimit == null) {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.limit" />);
    } else if (selectedServiceProvider === "" || selectedServiceProvider == null) {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.serviceprovider" />);
    } else if (selectedDaemon === "" || selectedDaemon == null) {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.daemonconfig" />);
    } else if (selectedProviderConfig === "" || selectedProviderConfig == null) {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.providerconfig" />);
    } else if (selectedProviderType === "" || selectedProviderType == null) {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.providertype" />);
    } else if (TransationType == "" || TransationType == null) {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.trntype" />);
    } else if (selectedStatus === "" || selectedStatus == null) {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.errors.status" />);
    }
    else {
      if (isUpdate) {
        this.setState({
          updateData: true
        })

        this.props.updateLiquidityManagerList(data);
      } else {
        NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.pleaseChange" />)
      }
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
  // renders the component
  render() {
    /* check menu permission */
    var menuDetail = this.checkAndGetMenuAccessDetail('83588D52-5394-4AF9-1340-260CC3CC98C4');//83588D52-5394-4AF9-1340-260CC3CC98C4
    const { providersList, transactionTypeList, daemonConfigList, limitData, providerType, serviceConfiguration, serviceProvider } = this.props;

    // returns the component
    return (
      <div className="m-10 p-5">
        {(
          this.props.loading
          || this.props.providersLoading
          || this.props.serviceProviderLoading
          || this.props.serviceConfigurationLoading
          || this.props.limitDataLoading
          || this.props.daemonConfigListLoading
          || this.props.transactionTypeListLoading
          || this.props.providerTypeLoading
          || this.props.menuLoading
        )
          && <JbsSectionLoader />}
        <div className="m-20 page-title d-flex justify-content-between align-items-center">
          <div className="page-title-wrap">
            <h2><IntlMessages id="liquidityprovider.list.title.updatelist" /></h2>
          </div>
          <div className="page-title-wrap drawer_btn mb-10 text-right">
            <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.drawerClose}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
            <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
          </div>
        </div>

        <Row>
          <Col md={12}>
            <Form className="m-10 tradefrm">
              <FormGroup row>
                {((menuDetail["3CDF6B3A-1729-49B7-0B65-B236ED217858"]) && (menuDetail["3CDF6B3A-1729-49B7-0B65-B236ED217858"].Visibility === "E925F86B")) && //3CDF6B3A-1729-49B7-0B65-B236ED217858
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="Provider" className='d-inline'>
                        {<IntlMessages id="liquidityprovider.list.option.label.apiprovider" />}<span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <Input
                          disabled={(menuDetail["3CDF6B3A-1729-49B7-0B65-B236ED217858"].AccessRight === "11E6E7B0") ? true : false}
                          type="select"
                          name="selectedProvider"
                          value={this.state.selectedProvider}
                          onChange={this.handleChangeData}
                        >
                          <IntlMessages id="sidebar.pairConfiguration.list.lable.enter.apiprovider">
                            {(select) =>
                              <option value="">{select}</option>
                            }
                          </IntlMessages>

                          {providersList.length && providersList.map((item, key) => (
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
                {((menuDetail["80CAA8F1-488C-9CDC-5B48-B5ABA1CB6DC7"]) && (menuDetail["80CAA8F1-488C-9CDC-5B48-B5ABA1CB6DC7"].Visibility === "E925F86B")) && //80CAA8F1-488C-9CDC-5B48-B5ABA1CB6DC7
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="Limit" className='d-inline'>
                        {<IntlMessages id="liquidityprovider.list.option.label.limit" />}<span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <Input
                          disabled={(menuDetail["80CAA8F1-488C-9CDC-5B48-B5ABA1CB6DC7"].AccessRight === "11E6E7B0") ? true : false}
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
                }

              </FormGroup>
              <FormGroup row>
                {((menuDetail["C46C6371-1227-63CA-024C-F5F27E2C2EEB"]) && (menuDetail["C46C6371-1227-63CA-024C-F5F27E2C2EEB"].Visibility === "E925F86B")) && //C46C6371-1227-63CA-024C-F5F27E2C2EEB
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="serviceProvider" className='d-inline'>
                        {<IntlMessages id="liquidityprovider.list.option.label.serviceprovider" />}<span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <Input
                          disabled={(menuDetail["C46C6371-1227-63CA-024C-F5F27E2C2EEB"].AccessRight === "11E6E7B0") ? true : false}
                          type="select"
                          name="selectedServiceProvider"
                          value={this.state.selectedServiceProvider}
                          onChange={this.handleChangeData}
                        >
                          <IntlMessages id="sidebar.pairConfiguration.list.lable.enter.serviceprovider">
                            {(select) =>
                              <option value="">{select}</option>
                            }
                          </IntlMessages>

                          {serviceProvider.length && serviceProvider.map((item, key) => (
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
                {((menuDetail["4DCFB533-5291-3A28-663A-2AC268A49FE7"]) && (menuDetail["4DCFB533-5291-3A28-663A-2AC268A49FE7"].Visibility === "E925F86B")) && //4DCFB533-5291-3A28-663A-2AC268A49FE7
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="daemon" className='d-inline'>
                        {<IntlMessages id="liquidityprovider.list.option.label.daemonconfig" />}<span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <Input
                          disabled={(menuDetail["4DCFB533-5291-3A28-663A-2AC268A49FE7"].AccessRight === "11E6E7B0") ? true : false}
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
                  </Col>
                }
              </FormGroup>
              <FormGroup row>
                {((menuDetail["0AC4F61F-8CB2-5A52-9B8D-C2AA0C153F24"]) && (menuDetail["0AC4F61F-8CB2-5A52-9B8D-C2AA0C153F24"].Visibility === "E925F86B")) && //0AC4F61F-8CB2-5A52-9B8D-C2AA0C153F24
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="serviceConfig" className='d-inline'>
                        {<IntlMessages id="liquidityprovider.list.option.label.serviceconfig" />}<span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <Input
                          disabled={(menuDetail["0AC4F61F-8CB2-5A52-9B8D-C2AA0C153F24"].AccessRight === "11E6E7B0") ? true : false}
                          type="select"
                          name="selectedProviderConfig"
                          value={this.state.selectedProviderConfig}
                          onChange={this.handleChangeData}
                        >
                          <IntlMessages id="sidebar.pairConfiguration.list.lable.enter.providerconfig">
                            {(select) =>
                              <option value="">{select}</option>
                            }
                          </IntlMessages>

                          {serviceConfiguration.length && serviceConfiguration.map((item, key) => (
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
                {((menuDetail["BCBC9C91-5F7D-69A6-138C-192CF2E63329"]) && (menuDetail["BCBC9C91-5F7D-69A6-138C-192CF2E63329"].Visibility === "E925F86B")) && //BCBC9C91-5F7D-69A6-138C-192CF2E63329
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="providertype" className='d-inline'>
                        {<IntlMessages id="liquidityprovider.list.option.label.providertype" />}<span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <Input
                          disabled={(menuDetail["BCBC9C91-5F7D-69A6-138C-192CF2E63329"].AccessRight === "11E6E7B0") ? true : false}
                          type="select"
                          name="selectedProviderType"
                          value={this.state.selectedProviderType}
                          onChange={this.handleChangeData}
                        >
                          <IntlMessages id="sidebar.pairConfiguration.list.lable.enter.providertype">
                            {(select) =>
                              <option value="">{select}</option>
                            }
                          </IntlMessages>

                          {providerType.length && providerType.map((item, key) => (
                            <option
                              value={item.Id}
                              key={key}
                            >
                              {item.ServiveProTypeName}
                            </option>
                          ))}
                        </Input>
                      </Col>
                    </Row>
                  </Col>
                }
              </FormGroup>

              <FormGroup row>
                {((menuDetail["41C6A71E-8B03-8C75-4666-B2D00ADA9AA5"]) && (menuDetail["41C6A71E-8B03-8C75-4666-B2D00ADA9AA5"].Visibility === "E925F86B")) && //41C6A71E-8B03-8C75-4666-B2D00ADA9AA5
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="TransactionTypes">
                        {<IntlMessages id="liquidityprovider.list.option.label.trntypes" />}

                      </Label>
                      <Col sm={8}>
                        <Input
                          disabled={(menuDetail["41C6A71E-8B03-8C75-4666-B2D00ADA9AA5"].AccessRight === "11E6E7B0") ? true : false}
                          type="select"
                          name="TransationType"
                          //multiple="multiple"
                          value={this.state.TransationType}
                          onChange={this.handleChangeData}
                        >
                          <IntlMessages id="sidebar.pairConfiguration.list.lable.enter.trntype">
                            {(select) =>
                              <option value="">{select}</option>
                            }
                          </IntlMessages>

                          {transactionTypeList.length && transactionTypeList.map((item, key) => (
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
                {((menuDetail["C06198FD-3E3F-114B-93F2-22A86C532BD7"]) && (menuDetail["C06198FD-3E3F-114B-93F2-22A86C532BD7"].Visibility === "E925F86B")) && //C06198FD-3E3F-114B-93F2-22A86C532BD7
                  <Col md={6}>
                    <Row>
                      <Label sm={4} for="status" className='d-inline'>
                        <IntlMessages id="manageMarkets.list.form.label.status" /><span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <Input
                          disabled={(menuDetail["C06198FD-3E3F-114B-93F2-22A86C532BD7"].AccessRight === "11E6E7B0") ? true : false}
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
                      onClick={() => this.updateAPIProviderData()}
                      disabled={this.props.loading}
                    >
                      <IntlMessages id="liquidityprovider.tooltip.update" />
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
  }
}

// map states to props when changed in states from reducer
const mapStateToProps = state => ({
  updateliquidityApiList: state.liquidityManager.updateliquidityApiList,
  providersList: state.liquidityManager.providersList,
  providersLoading: state.liquidityManager.providersLoading,
  serviceProvider: state.liquidityManager.serviceProvider,
  serviceProviderLoading: state.liquidityManager.serviceProviderLoading,
  serviceConfiguration: state.liquidityManager.serviceConfiguration,
  serviceConfigurationLoading: state.liquidityManager.serviceConfigurationLoading,
  providerType: state.liquidityManager.providerType,
  providerTypeLoading: state.liquidityManager.providerTypeLoading,
  limitData: state.liquidityManager.limitData,
  limitDataLoading: state.liquidityManager.limitDataLoading,
  daemonConfigList: state.liquidityManager.daemonConfigList,
  daemonConfigListLoading: state.liquidityManager.daemonConfigListLoading,
  transactionTypeList: state.liquidityManager.transactionTypeList,
  transactionTypeListLoading: state.liquidityManager.transactionTypeListLoading,
  loading: state.liquidityManager.updateLoading,
  updateError: state.liquidityManager.updateError,
  menuLoading: state.authTokenRdcer.menuLoading,
  menu_rights: state.authTokenRdcer.menu_rights,
});

// export this component with action methods and props
export default connect(
  mapStateToProps,
  {
    getLiquidityManagerList,
    updateLiquidityManagerList,
    getProvidersList,
    getLimitDataList,
    getServiceProviderList,
    getServiceConfigurationList,
    getProviderTypeList,
    getTransactionTypeList,
    getDaemonConfigList,
    getMenuPermissionByID
  }
)(UpdateExchangeConfiguration);
