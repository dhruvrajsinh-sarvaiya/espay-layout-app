import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col
} from "reactstrap";
import CloseButton from '@material-ui/core/Button';
//  Used For Display Notification 
import { NotificationManager } from "react-notifications";
// Import component for internationalization
import IntlMessages from "Util/IntlMessages";
//Action Import for Payment Method  Report Add And Update
import {
  getMarketCurrencyList,
  getPairCurrencyList,
  getPairConfigurationList,
  editPairConfigurationForm,
} from "Actions/PairConfiguration";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { validateOnlyNumeric } from "../../../validation/pairConfiguration";
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';
const buttonSizeSmall = {
  maxHeight: '28px',
  minHeight: '28px',
  maxWidth: '28px',
  fontSize: '1rem'
}

class UpdatePairConfiguration extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pairCurrencyList: [],
      marketCurrencyList: [],
      editPairConfig: false,
      addNewPairDetails: {
        marketName: this.props.selectedData.MarketName ? this.props.selectedData.MarketName : "",
        marketCurrency: this.props.selectedData.PairName ? this.props.selectedData.PairName.split("_")[1] : "",
        pairCurrency: this.props.selectedData.PairName ? this.props.selectedData.PairName.split("_")[0] : "",
        defaultRate: this.props.selectedData.CurrentRate !== "" ? this.props.selectedData.CurrentRate : 0,
        buyMinQuantity: this.props.selectedData.BuyMinQty !== "" ? this.props.selectedData.BuyMinQty : 0,
        buyMaxQuantity: this.props.selectedData.BuyMaxQty !== "" ? this.props.selectedData.BuyMaxQty : 0,
        sellMinQuantity: this.props.selectedData.SellMinQty !== "" ? this.props.selectedData.SellMinQty : 0,
        sellMaxQuantity: this.props.selectedData.SellMaxQty !== "" ? this.props.selectedData.SellMaxQty : 0,
        buyMinPrice: this.props.selectedData.BuyMinPrice !== "" ? this.props.selectedData.BuyMinPrice : 0,
        buyMaxPrice: this.props.selectedData.BuyMaxPrice !== "" ? this.props.selectedData.BuyMaxPrice : 0,
        sellMinPrice: this.props.selectedData.SellMinPrice !== "" ? this.props.selectedData.SellMinPrice : 0,
        sellMaxPrice: this.props.selectedData.SellMaxPrice !== "" ? this.props.selectedData.SellMaxPrice : 0,
        minQuantity: "",
        maxQuantity: "",
        minPrice: "",
        maxPrice: "",
        buyPrice: this.props.selectedData.BuyPrice !== "" ? this.props.selectedData.BuyPrice : 0,
        sellPrice: this.props.selectedData.SellPrice !== "" ? this.props.selectedData.SellPrice : 0,
        buyFees: this.props.selectedData.BuyFees !== "" ? this.props.selectedData.BuyFees : 0,
        sellFees: this.props.selectedData.SellFees !== "" ? this.props.selectedData.SellFees : 0,
        feesCurrency: "",
        currencyPrice: this.props.selectedData.CurrencyPrice !== "" ? this.props.selectedData.CurrencyPrice : 0,
        volume: this.props.selectedData.Volume !== "" ? this.props.selectedData.Volume : 0,
        pairId: this.props.selectedData.Id !== "" ? this.props.selectedData.Id : 0,
        minOpenQuantity: "",
        maxOpenQuantity: "",
        trnChargeType: this.props.selectedData.ChargeType ? this.props.selectedData.ChargeType : "",
        trnCharge: "",
        openOrderExpiration: this.props.selectedData.OpenOrderExpiration !== "" ? this.props.selectedData.OpenOrderExpiration : 0,
        status: this.props.selectedData.Status ? this.props.selectedData.Status : 0,
        secondaryCurrencyId: this.props.selectedData.SecondaryCurrencyId !== "" ? this.props.selectedData.SecondaryCurrencyId : 0,
        baseCurrencyId: this.props.selectedData.BaseCurrencyId !== "" ? this.props.selectedData.BaseCurrencyId : 0,
        open: false,
        //added by parth andhariya
        ConfigurationShowCard: props.ConfigurationShowCard,
        fieldList: {}
      },
      notificationFlag: true,
      menudetail: [],
    }
  }

  //added by parth andhariya 
  componentWillMount() {
    this.props.getMenuPermissionByID(this.props.ConfigurationShowCard === 1 ? "CDC06EAB-8843-588B-51AA-973A36482116" : 'CAE8A211-9051-492B-03D2-D2E342FD8F24'); // get Trading menu permission
  }

  closeAll = () => {
    this.props.closeAll();
    this.setState({ open: false });
  }

  handleClose = () => {
    this.setState({
      open: false,
      confirm: false
    });
  };

  closeAddPairModal() {
    this.props.drawerClose();
    this.setState({
      addNewPairConfigurationForm: false,
      editNewPairConfigurationForm: false,
      addNewPairDetails: {
        marketName: "",
        marketCurrency: [],
        pairCurrency: "",
        defaultRate: "",
        minQuantity: "",
        maxQuantity: "",
        minPrice: "",
        maxPrice: "",
        minOpenQuantity: "",
        maxOpenQuantity: "",
        trnChargeType: "",
        trnCharge: "",
        openOrderExpiration: "",
        status: "",
        open: false
      },
      loader: false,
      errors: {}
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.editPairConfig && nextProps.editPairSuccess && nextProps.error.length === 0) {
      NotificationManager.success(<IntlMessages id="pair.update.currency.success" />);
      this.setState({
        open: false,
        editPairConfig: false
      })
      this.props.drawerClose();

      //code change by jayshreeba gohil (14-6-2019) for handle arbitrage configuration detail
      let reqObject = {};
      if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
        reqObject.IsArbitrage = this.props.IsArbitrage;
      }
      this.props.getPairConfigurationList(reqObject);
      //end
      //added by parth andhariya
      if (this.props.ConfigurationShowCard === 1) {
        this.props.getPairConfigurationList({ IsMargin: 1 });
      } else {
        this.props.getPairConfigurationList({});
      }
    } else if (nextProps.error.length !== 0 && nextProps.error.ReturnCode !== 0 && this.state.editPairConfig) {
      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextProps.error.ErrorCode}`} />);
      this.setState({
        editPairConfig: false
      })
    }

    if (nextProps.marketCurrencyList !== undefined && nextProps.marketCurrencyList) {
      this.setState({ marketCurrencyList: nextProps.marketCurrencyList });
    }

    if (nextProps.pairCurrencyList) {
      this.setState({ pairCurrencyList: nextProps.pairCurrencyList });
    }
    /* update menu details if not set */
    if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
      if (nextProps.menu_rights.ReturnCode === 0) {
        //added by parth andhariya
        if (this.props.ConfigurationShowCard === 1) {
          this.props.getMarketCurrencyList({ IsMargin: 1 });
          this.props.getPairCurrencyList({ Base: this.props.selectedData.PairName.split("_")[1], IsMargin: 1 });
        } else {
          this.props.getMarketCurrencyList({});
          this.props.getPairCurrencyList({ Base: this.props.selectedData.PairName.split("_")[1] });
        }
        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
        this.setState({ notificationFlag: false });
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        this.props.drawerClose();
      }
    }
  }

  // on change Payment Method add new form value
  onChangeAddNewPairForm(key, value) {
    this.setState({
      addNewPairDetails: {
        ...this.state.addNewPairDetails,
        [key]: value
      },
      isUpdate: true
    });
  }

  onChangeMarketCurrency(e, baseCurrency) {
    let market = '';
    var baseCurrencyId = ''
    this.props.getPairCurrencyList({ Base: e.target.value })
    if (this.state.marketCurrencyList) {
      this.state.marketCurrencyList.map((value, key) => {
        if (value.CurrencyName === e.target.value) {
          market = value.CurrencyDesc;
          baseCurrencyId = value.ServiceID
        }
      })
    }
    this.setState({
      addNewPairDetails: {
        ...this.state.addNewPairDetails,
        marketCurrency: e.target.value,
        marketName: market,
        baseCurrencyId: baseCurrencyId
      },
      isUpdate: true
    });
  }

  onChangePairCurrency = (e) => {
    var currencyId = '', pairCurrency = ''
    if (this.state.pairCurrencyList) {
      this.state.pairCurrencyList.map((value, key) => {
        if (value.SMSCode == e.target.value) {
          currencyId = value.ServiceId;
          pairCurrency = value.SMSCode;
        }
      })
    }

    this.setState({
      addNewPairDetails: {
        ...this.state.addNewPairDetails,
        secondaryCurrencyId: currencyId,
        pairCurrency: pairCurrency
      },
      isUpdate: true
    });
  }

  checkNumericFields = event => {
    if (validateOnlyNumeric(event.target.value) || event.target.value === "") {
      this.setState({
        addNewPairDetails: {
          ...this.state.addNewPairDetails,
          [event.target.name]: event.target.value
        },
        isUpdate: true
      });
    }
  };

  changeCurrencyFees = event => {
    if (!validateOnlyNumeric(event.target.value) || event.target.value === "") {
      this.setState({
        addNewPairDetails: {
          ...this.state.addNewPairDetails,
          [event.target.name]: event.target.value
        },
        isUpdate: true
      })
    }
  }


  editPairConfigurationForm = (event) => {
    const { addNewPairDetails } = this.state
    if (addNewPairDetails.baseCurrencyId == null) {
      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.selectmarket" />)
    } else if (addNewPairDetails.secondaryCurrencyId == null) {
      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.selectcurrency" />)
    } else if (addNewPairDetails.defaultRate == null) {
      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.defaultrate" />)
    } else if (addNewPairDetails.volume == null) {
      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.volume" />)
    } else if (addNewPairDetails.buyMinQuantity == null || addNewPairDetails.buyMaxQuantity == null) {
      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.buyquantity" />)
    } else if (addNewPairDetails.sellMinQuantity == null || addNewPairDetails.sellMaxQuantity == null) {
      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.sellquantity" />)
    } else if (addNewPairDetails.buyMinPrice == null || addNewPairDetails.buyMaxPrice == null) {
      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.buypricerange" />)
    } else if (addNewPairDetails.sellMinPrice == null || addNewPairDetails.sellMaxPrice == null) {
      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.sellpricerange" />)
    } else if (addNewPairDetails.openOrderExpiration == null) {
      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.openorderexp" />)
    } else if (addNewPairDetails.status == null) {
      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.status" />)
    } else {
      if (addNewPairDetails.buyMinQuantity > addNewPairDetails.buyMaxQuantity) {
        NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.rangebuyquantity" />)
      } else if (addNewPairDetails.sellMinQuantity > addNewPairDetails.sellMaxQuantity) {
        NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.rangesellquantity" />)
      } else if (addNewPairDetails.buyMinPrice > addNewPairDetails.buyMaxPrice) {
        NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.rangebuyprice" />)
      } else if (isScriptTag(addNewPairDetails.defaultRate)) {
        NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
      } else if (isHtmlTag(addNewPairDetails.defaultRate)) {
        NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
      } else if (addNewPairDetails.sellMinPrice > addNewPairDetails.sellMaxPrice) {
        NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.rangesellprice" />)
      } else if (isScriptTag(addNewPairDetails.volume || addNewPairDetails.buyMinQuantity || addNewPairDetails.sellMinQuantit || addNewPairDetails.buyMinPrice || addNewPairDetails.sellMinPrice || addNewPairDetails.sellPrice)) {
        NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
      } else if (isHtmlTag(addNewPairDetails.volume || addNewPairDetails.buyMinQuantity || addNewPairDetails.sellMinQuantit || addNewPairDetails.buyMinPrice || addNewPairDetails.sellMinPrice || addNewPairDetails.sellPrice)) {
        NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
      } else {
        if (this.state.isUpdate) {
          const addRequest = {
            SecondaryCurrencyId: addNewPairDetails.secondaryCurrencyId ? parseInt(addNewPairDetails.secondaryCurrencyId) : parseInt(0),
            Id: addNewPairDetails.pairId ? parseInt(addNewPairDetails.pairId) : parseInt(0),
            BaseCurrencyId: addNewPairDetails.baseCurrencyId ? parseInt(addNewPairDetails.baseCurrencyId) : parseInt(0),
            CurrentRate: addNewPairDetails.defaultRate ? parseFloat(addNewPairDetails.defaultRate) : parseFloat(0),
            BuyMinQty: addNewPairDetails.buyMinQuantity ? parseFloat(addNewPairDetails.buyMinQuantity) : parseFloat(0),
            BuyMaxQty: addNewPairDetails.buyMaxQuantity ? parseFloat(addNewPairDetails.buyMaxQuantity) : parseFloat(0),
            SellMinQty: addNewPairDetails.sellMinQuantity ? parseFloat(addNewPairDetails.sellMinQuantity) : parseFloat(0),
            SellMaxQty: addNewPairDetails.sellMaxQuantity ? parseFloat(addNewPairDetails.sellMaxQuantity) : parseFloat(0),
            CurrencyPrice: addNewPairDetails.defaultRate ? parseFloat(addNewPairDetails.defaultRate) : parseFloat(0),
            Volume: addNewPairDetails.volume ? parseFloat(addNewPairDetails.volume) : parseFloat(0),
            SellPrice: addNewPairDetails.sellPrice ? parseFloat(addNewPairDetails.sellPrice) : parseFloat(0),
            BuyPrice: addNewPairDetails.buyPrice ? parseFloat(addNewPairDetails.buyPrice) : parseFloat(0),
            BuyMinPrice: addNewPairDetails.buyMinPrice ? parseFloat(addNewPairDetails.buyMinPrice) : parseFloat(0),
            BuyMaxPrice: addNewPairDetails.buyMaxPrice ? parseFloat(addNewPairDetails.buyMaxPrice) : parseFloat(0),
            SellMinPrice: addNewPairDetails.sellMinPrice ? parseFloat(addNewPairDetails.sellMinPrice) : parseFloat(0),
            SellMaxPrice: addNewPairDetails.sellMaxPrice ? parseFloat(addNewPairDetails.sellMaxPrice) : parseFloat(0),
            BuyFees: addNewPairDetails.buyFees ? parseFloat(addNewPairDetails.buyFees) : parseFloat(0),
            SellFees: addNewPairDetails.sellFees ? parseFloat(addNewPairDetails.sellFees) : parseFloat(0),
            FeesCurrency: "INR",
            Status: addNewPairDetails.status ? parseInt(addNewPairDetails.status) : parseInt(0),
            ChargeType: addNewPairDetails.trnChargeType ? parseInt(addNewPairDetails.trnChargeType) : parseInt(0),
            OpenOrderExpiration: addNewPairDetails.openOrderExpiration ? parseInt(addNewPairDetails.openOrderExpiration) : parseInt(0)
          }

          this.setState({ editPairConfig: true })

          //added by parth andhariya
          if (this.props.ConfigurationShowCard === 1) {
            addRequest.IsMargin = 1;
            this.props.editPairConfigurationForm(addRequest);
          } else {
            this.props.editPairConfigurationForm(addRequest);
          }
        } else {
          NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.pleaseChange" />)
        }
      }
      //code change by devang parekh (12-6-2019) for handle arbitrage configuration detail
      let reqObject = {};
      if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
        reqObject.IsArbitrage = this.props.IsArbitrage;
      }
      this.props.editPairConfigurationForm(reqObject);
    }

  }
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
    /* check menu permission */
    var menuDetail = this.checkAndGetMenuAccessDetail(this.props.ConfigurationShowCard === 1 ? '8306126C-6ECC-262F-5F16-25BC630150FC' : '1E00CB45-A3E9-28E7-2974-898235D98609');// 1E00CB45-A3E9-28E7-2974-898235D98609   && MarginGUID  8306126C-6ECC-262F-5F16-25BC630150FC
    const { drawerClose, ConfigurationShowCard } = this.props;
    const {
      marketCurrencyList,
      pairCurrencyList,
      addNewPairDetails
    } = this.state;

    return (
      <Fragment>
        {(this.props.loading || this.props.pairCurrencyLoading || this.props.marketCurrencyLoading || this.props.menuLoading) && <JbsSectionLoader />}
        <div className="m-20 page-title d-flex justify-content-between align-items-center">
          <div className="page-title-wrap">
            <h2>{<IntlMessages id="sidebar.pairConfiguration.modal.editPair" />}</h2>
          </div>
          <div className="page-title-wrap drawer_btn mb-10 text-right">
            <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
            <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
          </div>
        </div>
        <div className="m-10 p-5">
          <Row>
            <Col md={12}>
              <Form className="tradefrm">
                <FormGroup row>
                  {((ConfigurationShowCard === 1 ? menuDetail["7148DF7F-3987-1CCE-7D03-B5865D735B93"] : menuDetail["721BEA5F-6E2C-8907-1B29-27D6A4052E85"]) && (ConfigurationShowCard === 1 ? menuDetail["7148DF7F-3987-1CCE-7D03-B5865D735B93"].Visibility === "E925F86B" : menuDetail["721BEA5F-6E2C-8907-1B29-27D6A4052E85"].Visibility === "E925F86B")) && //721BEA5F-6E2C-8907-1B29-27D6A4052E85  && margin_GUID 7148DF7F-3987-1CCE-7D03-B5865D735B93
                    <Col md={4} sm={6} xs={12}>
                      <Label>
                        <IntlMessages id="sidebar.pairConfiguration.list.lable.marketName" />
                      </Label>
                      <IntlMessages id="trading.pairconfig.placeholder.marketname">
                        {(placeholder) =>
                          <Input type="text"
                            disabled={(ConfigurationShowCard === 1 ? menuDetail["7148DF7F-3987-1CCE-7D03-B5865D735B93"].AccessRight === "11E6E7B0" : menuDetail["721BEA5F-6E2C-8907-1B29-27D6A4052E85"].AccessRight === "11E6E7B0") ? true : false}
                            name="marketName"
                            value={addNewPairDetails.marketName}
                            onChange={e =>
                              this.onChangeAddNewPairForm("marketName", e.target.value)
                            }
                            placeholder={placeholder} >
                          </Input>
                        }
                      </IntlMessages>
                    </Col>
                  }
                  {((ConfigurationShowCard === 1 ? menuDetail["1B954201-1217-9AE5-3152-D81801195506"] : menuDetail["41031BF5-2AA2-A3BD-6EB3-2D8338BA7CFC"]) && (ConfigurationShowCard === 1 ? menuDetail["1B954201-1217-9AE5-3152-D81801195506"].Visibility === "E925F86B" : menuDetail["41031BF5-2AA2-A3BD-6EB3-2D8338BA7CFC"].Visibility === "E925F86B")) && //41031BF5-2AA2-A3BD-6EB3-2D8338BA7CFC  && margin_GUID 1B954201-1217-9AE5-3152-D81801195506
                    <Col md={4} sm={6} xs={12}>
                      <Label>
                        <IntlMessages id="manageMarkets.list.form.label.basecurrency" />
                      </Label>
                      <Input
                        disabled={(ConfigurationShowCard === 1 ? menuDetail["1B954201-1217-9AE5-3152-D81801195506"].AccessRight === "11E6E7B0" : menuDetail["41031BF5-2AA2-A3BD-6EB3-2D8338BA7CFC"].AccessRight === "11E6E7B0") ? true : false}
                        type="select"
                        name="marketCurrency"
                        value={addNewPairDetails.marketCurrency}
                        onChange={e => this.onChangeMarketCurrency(e)}
                      >
                        <IntlMessages id="sidebar.pairConfiguration.list.lable.selectmarket">
                          {(select) =>
                            <option value="">{select}</option>
                          }
                        </IntlMessages>
                        {marketCurrencyList.length > 0 && marketCurrencyList.map((item, key) => (
                          <option
                            value={item.CurrencyName}
                            key={key}
                          >
                            {item.CurrencyName}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  }
                  {((ConfigurationShowCard === 1 ? menuDetail["8E3B34AF-4949-2895-4530-3644355A373F"] : menuDetail["3B98E571-8D96-9A84-7352-1A6F65E32642"]) && (ConfigurationShowCard === 1 ? menuDetail["8E3B34AF-4949-2895-4530-3644355A373F"].Visibility === "E925F86B" : menuDetail["3B98E571-8D96-9A84-7352-1A6F65E32642"].Visibility === "E925F86B")) && //3B98E571-8D96-9A84-7352-1A6F65E32642  && margin_GUID 8E3B34AF-4949-2895-4530-3644355A373F
                    <Col md={4} sm={6} xs={12}>
                      <Label>
                        <IntlMessages id="sidebar.pairConfiguration.list.lable.pairCurrencies" />
                      </Label>
                      <Input
                        disabled={(ConfigurationShowCard === 1 ? menuDetail["8E3B34AF-4949-2895-4530-3644355A373F"].AccessRight === "11E6E7B0" : menuDetail["3B98E571-8D96-9A84-7352-1A6F65E32642"].AccessRight === "11E6E7B0") ? true : false}
                        type="select"
                        name="pairCurrency"
                        value={addNewPairDetails.pairCurrency}
                        onChange={e => this.onChangePairCurrency(e)}
                      >
                        <IntlMessages id="sidebar.pairConfiguration.list.lable.selectcurrency">
                          {(select) =>
                            <option value="">{select}</option>
                          }
                        </IntlMessages>
                        {pairCurrencyList.map((item, key) => (
                          <option
                            value={item.SMSCode}
                            key={key}
                          >
                            {item.SMSCode}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  }
                  {((ConfigurationShowCard === 1 ? menuDetail["0FAA4DC7-14E8-489B-7437-4BE8E13D4447"] : menuDetail["2267D516-13BB-0228-1B30-B8E27DB87777"]) && (ConfigurationShowCard === 1 ? menuDetail["0FAA4DC7-14E8-489B-7437-4BE8E13D4447"].Visibility === "E925F86B" : menuDetail["2267D516-13BB-0228-1B30-B8E27DB87777"].Visibility === "E925F86B")) && //2267D516-13BB-0228-1B30-B8E27DB87777  && margin_GUID 0FAA4DC7-14E8-489B-7437-4BE8E13D4447
                    <Col md={4} sm={6} xs={12}>
                      <Label>
                        <IntlMessages id="sidebar.pairConfiguration.list.lable.defaultRate" /><span className="text-danger">*</span>
                      </Label>
                      <IntlMessages id="trading.pairconfig.placeholder.defaultrate">
                        {(placeholder) =>
                          <Input type="text"
                            disabled={(ConfigurationShowCard === 1 ? menuDetail["0FAA4DC7-14E8-489B-7437-4BE8E13D4447"].AccessRight === "11E6E7B0" : menuDetail["2267D516-13BB-0228-1B30-B8E27DB87777"].AccessRight === "11E6E7B0") ? true : false}
                            name="defaultRate"
                            value={addNewPairDetails.defaultRate}
                            onChange={this.checkNumericFields}
                            placeholder={placeholder} ></Input>
                        }
                      </IntlMessages>
                    </Col>
                  }
                  {((ConfigurationShowCard === 1 ? menuDetail["2CB27489-6203-616C-031F-0A9749F158C5"] : menuDetail["EB5583B7-365C-1877-2EB9-B397BEC23BCA"]) && (ConfigurationShowCard === 1 ? menuDetail["2CB27489-6203-616C-031F-0A9749F158C5"].Visibility === "E925F86B" : menuDetail["EB5583B7-365C-1877-2EB9-B397BEC23BCA"].Visibility === "E925F86B")) && //EB5583B7-365C-1877-2EB9-B397BEC23BCA  && margin_GUID 2CB27489-6203-616C-031F-0A9749F158C5
                    <Col md={4} sm={6} xs={12}>
                      <Label>
                        <IntlMessages id="trading.pairconfig.placeholder.volume" /><span className="text-danger">*</span>
                      </Label>
                      <IntlMessages id="trading.pairconfig.placeholder.volume">
                        {(placeholder) =>
                          <Input
                            disabled={(ConfigurationShowCard === 1 ? menuDetail["2CB27489-6203-616C-031F-0A9749F158C5"].AccessRight === "11E6E7B0" : menuDetail["EB5583B7-365C-1877-2EB9-B397BEC23BCA"].AccessRight === "11E6E7B0") ? true : false}
                            type="text"
                            name="volume"
                            value={addNewPairDetails.volume}
                            onChange={this.checkNumericFields}
                            placeholder={placeholder} >
                          </Input>
                        }
                      </IntlMessages>
                    </Col>
                  }
                  <Col md={4} sm={6} xs={12}>
                    {((ConfigurationShowCard === 1 ? menuDetail["8D98931F-1F7A-8319-0801-7510ED91586A"] : menuDetail["4CA3B58E-9FAD-662D-0EB8-70F5481389B8"]) && (ConfigurationShowCard === 1 ? menuDetail["8D98931F-1F7A-8319-0801-7510ED91586A"].Visibility === "E925F86B" : menuDetail["4CA3B58E-9FAD-662D-0EB8-70F5481389B8"].Visibility === "E925F86B")) || ((ConfigurationShowCard === 1 ? menuDetail["BCCD206D-0BA8-879E-1542-44C0246B21A3"] : menuDetail["6BAFB8DC-79D5-7D16-49EB-69CF6D3A1918"]) && (ConfigurationShowCard === 1 ? menuDetail["BCCD206D-0BA8-879E-1542-44C0246B21A3"].Visibility === "E925F86B" : menuDetail["6BAFB8DC-79D5-7D16-49EB-69CF6D3A1918"].Visibility === "E925F86B")) &&
                      <Label>
                        <IntlMessages id="sidebar.pairConfiguration.list.lable.buyquentity" /><span className="text-danger">*</span>
                      </Label>
                    }
                    <Row>
                      {((ConfigurationShowCard === 1 ? menuDetail["8D98931F-1F7A-8319-0801-7510ED91586A"] : menuDetail["4CA3B58E-9FAD-662D-0EB8-70F5481389B8"]) && (ConfigurationShowCard === 1 ? menuDetail["8D98931F-1F7A-8319-0801-7510ED91586A"].Visibility === "E925F86B" : menuDetail["4CA3B58E-9FAD-662D-0EB8-70F5481389B8"].Visibility === "E925F86B")) && //4CA3B58E-9FAD-662D-0EB8-70F5481389B8  && margin_GUID 8D98931F-1F7A-8319-0801-7510ED91586A
                        <Col md={5} sm={5} xs={5}>
                          <IntlMessages id="trading.pairconfig.placeholder.buyminqty">
                            {(placeholder) =>
                              <Input
                                disabled={(ConfigurationShowCard === 1 ? menuDetail["8D98931F-1F7A-8319-0801-7510ED91586A"].AccessRight === "11E6E7B0" : menuDetail["4CA3B58E-9FAD-662D-0EB8-70F5481389B8"].AccessRight === "11E6E7B0") ? true : false}
                                type="text"
                                name="buyMinQuantity"
                                value={addNewPairDetails.buyMinQuantity}
                                onChange={this.checkNumericFields}
                                placeholder={placeholder} >
                              </Input>
                            }
                          </IntlMessages>
                        </Col>
                      }
                      {((ConfigurationShowCard === 1 ? menuDetail["8D98931F-1F7A-8319-0801-7510ED91586A"] : menuDetail["4CA3B58E-9FAD-662D-0EB8-70F5481389B8"]) && (ConfigurationShowCard === 1 ? menuDetail["8D98931F-1F7A-8319-0801-7510ED91586A"].Visibility === "E925F86B" : menuDetail["4CA3B58E-9FAD-662D-0EB8-70F5481389B8"].Visibility === "E925F86B")) || ((ConfigurationShowCard === 1 ? menuDetail["BCCD206D-0BA8-879E-1542-44C0246B21A3"] : menuDetail["6BAFB8DC-79D5-7D16-49EB-69CF6D3A1918"]) && (ConfigurationShowCard === 1 ? menuDetail["BCCD206D-0BA8-879E-1542-44C0246B21A3"].Visibility === "E925F86B" : menuDetail["6BAFB8DC-79D5-7D16-49EB-69CF6D3A1918"].Visibility === "E925F86B")) &&
                        <Col md={2} sm={2} xs={2} className="text-center mt-10">To</Col>
                      }
                      {((ConfigurationShowCard === 1 ? menuDetail["BCCD206D-0BA8-879E-1542-44C0246B21A3"] : menuDetail["6BAFB8DC-79D5-7D16-49EB-69CF6D3A1918"]) && (ConfigurationShowCard === 1 ? menuDetail["BCCD206D-0BA8-879E-1542-44C0246B21A3"].Visibility === "E925F86B" : menuDetail["6BAFB8DC-79D5-7D16-49EB-69CF6D3A1918"].Visibility === "E925F86B")) && //6BAFB8DC-79D5-7D16-49EB-69CF6D3A1918  && margin_GUID BCCD206D-0BA8-879E-1542-44C0246B21A3
                        <Col md={5} sm={5} xs={5}>
                          <IntlMessages id="trading.pairconfig.placeholder.buymaxqty">
                            {(placeholder) =>
                              <Input
                                disabled={(ConfigurationShowCard === 1 ? menuDetail["BCCD206D-0BA8-879E-1542-44C0246B21A3"].AccessRight === "11E6E7B0" : menuDetail["6BAFB8DC-79D5-7D16-49EB-69CF6D3A1918"].AccessRight === "11E6E7B0") ? true : false}
                                type="text"
                                name="buyMaxQuantity"
                                value={addNewPairDetails.buyMaxQuantity}
                                onChange={this.checkNumericFields}
                                placeholder={placeholder} >
                              </Input>
                            }
                          </IntlMessages>
                        </Col>
                      }
                    </Row>
                  </Col>
                  <Col md={4} sm={6} xs={12}>
                    {((ConfigurationShowCard === 1 ? menuDetail["0BE7D84E-3AD3-1536-2140-DFF0C5033602"] : menuDetail["291967E8-2D65-738F-3499-B2E4C3A9A48C"]) && (ConfigurationShowCard === 1 ? menuDetail["0BE7D84E-3AD3-1536-2140-DFF0C5033602"].Visibility === "E925F86B" : menuDetail["291967E8-2D65-738F-3499-B2E4C3A9A48C"].Visibility === "E925F86B")) || ((ConfigurationShowCard === 1 ? menuDetail["B1430F61-8637-575F-973E-F7CC01E28464"] : menuDetail["79746379-3781-0DD9-1670-C853F94758C0"]) && (ConfigurationShowCard === 1 ? menuDetail["B1430F61-8637-575F-973E-F7CC01E28464"].Visibility === "E925F86B" : menuDetail["79746379-3781-0DD9-1670-C853F94758C0"].Visibility === "E925F86B")) &&
                      <Label>
                        <IntlMessages id="sidebar.pairConfiguration.list.lable.sellquentity" /><span className="text-danger">*</span>
                      </Label>
                    }
                    <Row>
                      {((ConfigurationShowCard === 1 ? menuDetail["0BE7D84E-3AD3-1536-2140-DFF0C5033602"] : menuDetail["291967E8-2D65-738F-3499-B2E4C3A9A48C"]) && (ConfigurationShowCard === 1 ? menuDetail["0BE7D84E-3AD3-1536-2140-DFF0C5033602"].Visibility === "E925F86B" : menuDetail["291967E8-2D65-738F-3499-B2E4C3A9A48C"].Visibility === "E925F86B")) && //291967E8-2D65-738F-3499-B2E4C3A9A48C  && margin_GUID 0BE7D84E-3AD3-1536-2140-DFF0C5033602
                        <Col md={5} sm={5} xs={5}>
                          <IntlMessages id="trading.pairconfig.placeholder.sellminqty">
                            {(placeholder) =>
                              <Input
                                disabled={(ConfigurationShowCard === 1 ? menuDetail["0BE7D84E-3AD3-1536-2140-DFF0C5033602"].AccessRight === "11E6E7B0" : menuDetail["291967E8-2D65-738F-3499-B2E4C3A9A48C"].AccessRight === "11E6E7B0") ? true : false}
                                type="text"
                                name="sellMinQuantity"
                                value={addNewPairDetails.sellMinQuantity}
                                onChange={this.checkNumericFields}
                                placeholder={placeholder} >
                              </Input>
                            }
                          </IntlMessages>
                        </Col>
                      }
                      {((ConfigurationShowCard === 1 ? menuDetail["0BE7D84E-3AD3-1536-2140-DFF0C5033602"] : menuDetail["291967E8-2D65-738F-3499-B2E4C3A9A48C"]) && (ConfigurationShowCard === 1 ? menuDetail["0BE7D84E-3AD3-1536-2140-DFF0C5033602"].Visibility === "E925F86B" : menuDetail["291967E8-2D65-738F-3499-B2E4C3A9A48C"].Visibility === "E925F86B")) || ((ConfigurationShowCard === 1 ? menuDetail["B1430F61-8637-575F-973E-F7CC01E28464"] : menuDetail["79746379-3781-0DD9-1670-C853F94758C0"]) && (ConfigurationShowCard === 1 ? menuDetail["B1430F61-8637-575F-973E-F7CC01E28464"].Visibility === "E925F86B" : menuDetail["79746379-3781-0DD9-1670-C853F94758C0"].Visibility === "E925F86B")) &&
                        <Col md={2} sm={2} xs={2} className="text-center mt-10">To</Col>
                      }
                      {((ConfigurationShowCard === 1 ? menuDetail["B1430F61-8637-575F-973E-F7CC01E28464"] : menuDetail["79746379-3781-0DD9-1670-C853F94758C0"]) && (ConfigurationShowCard === 1 ? menuDetail["B1430F61-8637-575F-973E-F7CC01E28464"].Visibility === "E925F86B" : menuDetail["79746379-3781-0DD9-1670-C853F94758C0"].Visibility === "E925F86B")) && //79746379-3781-0DD9-1670-C853F94758C0  && margin_GUID B1430F61-8637-575F-973E-F7CC01E28464
                        <Col md={5} sm={5} xs={5}>
                          <IntlMessages id="trading.pairconfig.placeholder.sellmaxqty">
                            {(placeholder) =>
                              <Input
                                disabled={(ConfigurationShowCard === 1 ? menuDetail["B1430F61-8637-575F-973E-F7CC01E28464"].AccessRight === "11E6E7B0" : menuDetail["79746379-3781-0DD9-1670-C853F94758C0"].AccessRight === "11E6E7B0") ? true : false}
                                type="text"
                                name="sellMaxQuantity"
                                value={addNewPairDetails.sellMaxQuantity}
                                onChange={this.checkNumericFields}
                                placeholder={placeholder} >
                              </Input>
                            }
                          </IntlMessages>
                        </Col>
                      }
                    </Row>
                  </Col>
                  <Col md={4} sm={6} xs={12}>
                    {((ConfigurationShowCard === 1 ? menuDetail["021E8B8E-A6E1-6EAE-5A38-587ACE921239"] : menuDetail["CDCDFEF0-2F1C-662D-A13C-985D733127CA"]) && (ConfigurationShowCard === 1 ? menuDetail["021E8B8E-A6E1-6EAE-5A38-587ACE921239"].Visibility === "E925F86B" : menuDetail["CDCDFEF0-2F1C-662D-A13C-985D733127CA"].Visibility === "E925F86B")) || ((ConfigurationShowCard === 1 ? menuDetail["5BEB02B5-597F-935F-6A9F-BC72009020F8"] : menuDetail["2EAEB471-8969-0E50-A462-1BBFE8CD204E"]) && (ConfigurationShowCard === 1 ? menuDetail["5BEB02B5-597F-935F-6A9F-BC72009020F8"].Visibility === "E925F86B" : menuDetail["2EAEB471-8969-0E50-A462-1BBFE8CD204E"].Visibility === "E925F86B")) &&
                      <Label>
                        <IntlMessages id="sidebar.pairConfiguration.list.lable.buyprice" /><span className="text-danger">*</span>
                      </Label>
                    }
                    <Row>
                      {((ConfigurationShowCard === 1 ? menuDetail["021E8B8E-A6E1-6EAE-5A38-587ACE921239"] : menuDetail["CDCDFEF0-2F1C-662D-A13C-985D733127CA"]) && (ConfigurationShowCard === 1 ? menuDetail["021E8B8E-A6E1-6EAE-5A38-587ACE921239"].Visibility === "E925F86B" : menuDetail["CDCDFEF0-2F1C-662D-A13C-985D733127CA"].Visibility === "E925F86B")) && //CDCDFEF0-2F1C-662D-A13C-985D733127CA  && margin_GUID 021E8B8E-A6E1-6EAE-5A38-587ACE921239
                        <Col md={5} sm={5} xs={5}>
                          <IntlMessages id="trading.pairconfig.placeholder.buyminprice">
                            {(placeholder) =>
                              <Input
                                disabled={(ConfigurationShowCard === 1 ? menuDetail["021E8B8E-A6E1-6EAE-5A38-587ACE921239"].AccessRight === "11E6E7B0" : menuDetail["CDCDFEF0-2F1C-662D-A13C-985D733127CA"].AccessRight === "11E6E7B0") ? true : false}
                                type="text"
                                name="buyMinPrice"
                                value={addNewPairDetails.buyMinPrice}
                                onChange={this.checkNumericFields}
                                placeholder={placeholder} >
                              </Input>
                            }
                          </IntlMessages>
                        </Col>
                      }
                      {((ConfigurationShowCard === 1 ? menuDetail["021E8B8E-A6E1-6EAE-5A38-587ACE921239"] : menuDetail["CDCDFEF0-2F1C-662D-A13C-985D733127CA"]) && (ConfigurationShowCard === 1 ? menuDetail["021E8B8E-A6E1-6EAE-5A38-587ACE921239"].Visibility === "E925F86B" : menuDetail["CDCDFEF0-2F1C-662D-A13C-985D733127CA"].Visibility === "E925F86B")) || ((ConfigurationShowCard === 1 ? menuDetail["5BEB02B5-597F-935F-6A9F-BC72009020F8"] : menuDetail["2EAEB471-8969-0E50-A462-1BBFE8CD204E"]) && (ConfigurationShowCard === 1 ? menuDetail["5BEB02B5-597F-935F-6A9F-BC72009020F8"].Visibility === "E925F86B" : menuDetail["2EAEB471-8969-0E50-A462-1BBFE8CD204E"].Visibility === "E925F86B")) &&
                        <Col md={2} sm={2} xs={2} className="text-center mt-10">To</Col>
                      }
                      {((ConfigurationShowCard === 1 ? menuDetail["5BEB02B5-597F-935F-6A9F-BC72009020F8"] : menuDetail["2EAEB471-8969-0E50-A462-1BBFE8CD204E"]) && (ConfigurationShowCard === 1 ? menuDetail["5BEB02B5-597F-935F-6A9F-BC72009020F8"].Visibility === "E925F86B" : menuDetail["2EAEB471-8969-0E50-A462-1BBFE8CD204E"].Visibility === "E925F86B")) && //2EAEB471-8969-0E50-A462-1BBFE8CD204E  && margin_GUID 5BEB02B5-597F-935F-6A9F-BC72009020F8
                        <Col md={5} sm={5} xs={5}>
                          <IntlMessages id="trading.pairconfig.placeholder.buymaxprice">
                            {(placeholder) =>
                              <Input
                                disabled={(ConfigurationShowCard === 1 ? menuDetail["5BEB02B5-597F-935F-6A9F-BC72009020F8"].AccessRight === "11E6E7B0" : menuDetail["2EAEB471-8969-0E50-A462-1BBFE8CD204E"].AccessRight === "11E6E7B0") ? true : false}
                                type="text"
                                name="buyMaxPrice"
                                value={addNewPairDetails.buyMaxPrice}
                                onChange={this.checkNumericFields}
                                placeholder={placeholder} >
                              </Input>
                            }
                          </IntlMessages>
                        </Col>
                      }
                    </Row>
                  </Col>
                  <Col md={4} sm={6} xs={12}>
                    {((ConfigurationShowCard === 1 ? menuDetail["983C41F8-5E84-5991-1C1E-71978712A08D"] : menuDetail["F274E718-9F9D-43CE-A7BC-BCA99029A2E6"]) && (ConfigurationShowCard === 1 ? menuDetail["983C41F8-5E84-5991-1C1E-71978712A08D"].Visibility === "E925F86B" : menuDetail["F274E718-9F9D-43CE-A7BC-BCA99029A2E6"].Visibility === "E925F86B")) || ((ConfigurationShowCard === 1 ? menuDetail["96273D0D-1411-7174-010F-1C4ACC6439C6"] : menuDetail["455AAC4C-9059-8C55-6ACE-8D1917663B40"]) && (ConfigurationShowCard === 1 ? menuDetail["96273D0D-1411-7174-010F-1C4ACC6439C6"].Visibility === "E925F86B" : menuDetail["455AAC4C-9059-8C55-6ACE-8D1917663B40"].Visibility === "E925F86B")) &&
                      <Label>
                        <IntlMessages id="sidebar.pairConfiguration.list.lable.sellprice" /><span className="text-danger">*</span>
                      </Label>
                    }
                    <Row>
                      {((ConfigurationShowCard === 1 ? menuDetail["983C41F8-5E84-5991-1C1E-71978712A08D"] : menuDetail["F274E718-9F9D-43CE-A7BC-BCA99029A2E6"]) && (ConfigurationShowCard === 1 ? menuDetail["983C41F8-5E84-5991-1C1E-71978712A08D"].Visibility === "E925F86B" : menuDetail["F274E718-9F9D-43CE-A7BC-BCA99029A2E6"].Visibility === "E925F86B")) && //F274E718-9F9D-43CE-A7BC-BCA99029A2E6  && margin_GUID 983C41F8-5E84-5991-1C1E-71978712A08D
                        <Col md={5} sm={5} xs={5}>
                          <IntlMessages id="trading.pairconfig.placeholder.sellminprice">
                            {(placeholder) =>
                              <Input
                                disabled={(ConfigurationShowCard === 1 ? menuDetail["983C41F8-5E84-5991-1C1E-71978712A08D"].AccessRight === "11E6E7B0" : menuDetail["F274E718-9F9D-43CE-A7BC-BCA99029A2E6"].AccessRight === "11E6E7B0") ? true : false}
                                type="text"
                                name="sellMinPrice"
                                value={addNewPairDetails.sellMinPrice}
                                onChange={this.checkNumericFields}
                                placeholder={placeholder} >
                              </Input>
                            }
                          </IntlMessages>
                        </Col>
                      }
                      {((ConfigurationShowCard === 1 ? menuDetail["983C41F8-5E84-5991-1C1E-71978712A08D"] : menuDetail["F274E718-9F9D-43CE-A7BC-BCA99029A2E6"]) && (ConfigurationShowCard === 1 ? menuDetail["983C41F8-5E84-5991-1C1E-71978712A08D"].Visibility === "E925F86B" : menuDetail["F274E718-9F9D-43CE-A7BC-BCA99029A2E6"].Visibility === "E925F86B")) || ((ConfigurationShowCard === 1 ? menuDetail["96273D0D-1411-7174-010F-1C4ACC6439C6"] : menuDetail["455AAC4C-9059-8C55-6ACE-8D1917663B40"]) && (ConfigurationShowCard === 1 ? menuDetail["96273D0D-1411-7174-010F-1C4ACC6439C6"].Visibility === "E925F86B" : menuDetail["455AAC4C-9059-8C55-6ACE-8D1917663B40"].Visibility === "E925F86B")) &&
                        <Col md={2} sm={2} xs={2} className="text-center mt-10">To</Col>
                      }
                      {((ConfigurationShowCard === 1 ? menuDetail["96273D0D-1411-7174-010F-1C4ACC6439C6"] : menuDetail["455AAC4C-9059-8C55-6ACE-8D1917663B40"]) && (ConfigurationShowCard === 1 ? menuDetail["96273D0D-1411-7174-010F-1C4ACC6439C6"].Visibility === "E925F86B" : menuDetail["455AAC4C-9059-8C55-6ACE-8D1917663B40"].Visibility === "E925F86B")) && //455AAC4C-9059-8C55-6ACE-8D1917663B40  && margin_GUID 96273D0D-1411-7174-010F-1C4ACC6439C6
                        <Col md={5} sm={5} xs={5}>
                          <IntlMessages id="trading.pairconfig.placeholder.sellmaxprice">
                            {(placeholder) =>
                              <Input
                                disabled={(ConfigurationShowCard === 1 ? menuDetail["96273D0D-1411-7174-010F-1C4ACC6439C6"].AccessRight === "11E6E7B0" : menuDetail["455AAC4C-9059-8C55-6ACE-8D1917663B40"].AccessRight === "11E6E7B0") ? true : false}
                                type="text"
                                name="sellMaxPrice"
                                value={addNewPairDetails.sellMaxPrice}
                                onChange={this.checkNumericFields}
                                placeholder={placeholder} >
                              </Input>
                            }
                          </IntlMessages>
                        </Col>
                      }
                    </Row>
                  </Col>
                  {((ConfigurationShowCard === 1 ? menuDetail["547BDB6E-7FDD-5F64-7F42-513CAF311349"] : menuDetail["33BC75F6-A18A-3BB2-6A47-4B376E1BA682"]) && (ConfigurationShowCard === 1 ? menuDetail["547BDB6E-7FDD-5F64-7F42-513CAF311349"].Visibility === "E925F86B" : menuDetail["33BC75F6-A18A-3BB2-6A47-4B376E1BA682"].Visibility === "E925F86B")) && //33BC75F6-A18A-3BB2-6A47-4B376E1BA682  && margin_GUID 547BDB6E-7FDD-5F64-7F42-513CAF311349
                    <Col md={4} sm={6} xs={12}>
                      <Label>
                        <IntlMessages id="sidebar.pairConfiguration.list.lable.openOrderExpiration" />
                      </Label>
                      <IntlMessages id="trading.pairconfig.placeholder.openOrderExpiration">
                        {(placeholder) =>
                          <Input
                            disabled={(ConfigurationShowCard === 1 ? menuDetail["547BDB6E-7FDD-5F64-7F42-513CAF311349"].AccessRight === "11E6E7B0" : menuDetail["33BC75F6-A18A-3BB2-6A47-4B376E1BA682"].AccessRight === "11E6E7B0") ? true : false}
                            type="text"
                            name="openOrderExpiration"
                            value={addNewPairDetails.openOrderExpiration}
                            onChange={this.checkNumericFields}
                            placeholder={placeholder} >
                          </Input>
                        }
                      </IntlMessages>
                    </Col>
                  }
                  {((ConfigurationShowCard === 1 ? menuDetail["074E438B-1DA3-2330-3368-4A5896AF7702"] : menuDetail["E9565697-500E-2E93-A4B0-0A0951B621BD"]) && (ConfigurationShowCard === 1 ? menuDetail["074E438B-1DA3-2330-3368-4A5896AF7702"].Visibility === "E925F86B" : menuDetail["E9565697-500E-2E93-A4B0-0A0951B621BD"].Visibility === "E925F86B")) && //E9565697-500E-2E93-A4B0-0A0951B621BD  && margin_GUID 074E438B-1DA3-2330-3368-4A5896AF7702
                    <Col md={4} sm={6} xs={12}>
                      <Label>
                        <IntlMessages id="sidebar.pairConfiguration.list.lable.status" />
                      </Label>
                      <Input
                        disabled={(ConfigurationShowCard === 1 ? menuDetail["074E438B-1DA3-2330-3368-4A5896AF7702"].AccessRight === "11E6E7B0" : menuDetail["E9565697-500E-2E93-A4B0-0A0951B621BD"].AccessRight === "11E6E7B0") ? true : false}
                        type="select"
                        name="status"
                        value={addNewPairDetails.status}
                        onChange={e =>
                          this.onChangeAddNewPairForm("status", e.target.value)
                        }
                      >
                        <IntlMessages id="trading.pairconfig.placeholder.selectstatus">
                          {(select) =>
                            <option value="">{select}</option>
                          }
                        </IntlMessages>
                        <IntlMessages id="trading.pairconfig.placeholder.active">
                          {(select) =>
                            <option value="1">{select}</option>
                          }
                        </IntlMessages>
                        <IntlMessages id="trading.pairconfig.placeholder.inactive">
                          {(select) =>
                            <option value="0">{select}</option>
                          }
                        </IntlMessages>
                      </Input>
                    </Col>
                  }
                </FormGroup>
                <hr />
                {Object.keys(menuDetail).length > 0 &&
                  <FormGroup row>
                    <div className="offset-md-5 col-md-7 offset-sm-5 col-sm-7 col-xs-12">
                      <div className="btn_area">
                        <Button color="primary" onClick={(e) => this.editPairConfigurationForm(e)} disabled={this.props.loading}><IntlMessages id="sidebar.pairConfiguration.button.update" /></Button>
                        <Button color="danger" className="ml-15" onClick={() => this.closeAddPairModal()} disabled={this.props.loading}><IntlMessages id="sidebar.pairConfiguration.button.cancel" /></Button>
                      </div>
                    </div>
                  </FormGroup>
                }
              </Form>
            </Col>
          </Row>
        </div>
      </Fragment >
    )
  }
}

const mapStateToProps = ({ pairConfiguration, authTokenRdcer }) => {
  var responce = {
    pairCurrencyList: pairConfiguration.pairCurrencyList,
    marketCurrencyList: pairConfiguration.marketCurrencyList,
    editPairSuccess: pairConfiguration.editPairSuccess,
    loading: pairConfiguration.updateLoading,
    error: pairConfiguration.updateError,
    pairCurrencyLoading: pairConfiguration.pairCurrencyLoading,
    marketCurrencyLoading: pairConfiguration.marketCurrencyLoading,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };

  return responce;
};

export default connect(mapStateToProps, {
  getPairCurrencyList,
  getMarketCurrencyList,
  editPairConfigurationForm,
  getPairConfigurationList,
  getMenuPermissionByID
})(UpdatePairConfiguration);
