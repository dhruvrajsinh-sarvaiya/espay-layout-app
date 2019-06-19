import React, { Component, Fragment } from 'react';

import { connect } from "react-redux";
import { isScriptTag,isHtmlTag } from 'Helpers/helpers';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Container,
  Row,
  Col
} from "reactstrap";

// import for tooltip
import Tooltip from "@material-ui/core/Tooltip";

import MatButton from "@material-ui/core/Button";

import CloseButton from '@material-ui/core/Button';
const buttonSizeSmall = {
  maxHeight: '28px',
  minHeight: '28px',
  maxWidth: '28px',
  fontSize: '1rem'
}

//  Used For Display Notification 
import { NotificationManager } from "react-notifications";

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";
//import NotFoundTable from "../NotFoundTable/notFoundTable";

//Action Import for Payment Method  Report Add And Update
import {
  getMarketCurrencyList,
  getPairCurrencyList,
  getExchangeList,
  submitPairConfigurationForm,
  editPairConfigurationForm,
  deletePairConfigurationForm
} from "Actions/PairConfiguration";

import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

import {
  validatePairConfigurationRequest,
  validateOnlyNumeric
} from "../../../validation/pairConfiguration";
//Action methods..
import {
  getMenuPermissionByID
} from 'Actions/MyAccount';

class AddPairConfiguration extends Component {
  state = {
    pairCurrencyList: [],
    marketCurrencyList: [],
    pairCurrencyList: [],
    addPairConfig: false,
    addNewPairDetails: {
      marketName: "",
      marketCurrency: [],
      pairCurrency: "",
      defaultRate: "",
      buyMinQuantity: "",
      buyMaxQuantity: "",
      sellMinQuantity: "",
      sellMaxQuantity: "",
      buyMinPrice: "",
      buyMaxPrice: "",
      sellMinPrice: "",
      sellMaxPrice: "",
      minQuantity: "",
      maxQuantity: "",
      minPrice: "",
      maxPrice: "",
      buyPrice: "",
      sellPrice: "",
      buyFees: "",
      sellFees: "",
      feesCurrency: "INR",
      currencyPrice: "",
      volume: "",
      pairId: "",
      minOpenQuantity: "",
      maxOpenQuantity: "",
      trnChargeType: "0",
      trnCharge: "",
      openOrderExpiration: "",
      status: "",
      secondaryCurrencyId: "",
      baseCurrencyId: '',
      open: false,
      //exchange: "",
      //added by parth andhariya 
      fieldList: {},
    },
    notificationFlag: true,
    menudetail: [],
  }
  //added by parth andhariya 
  componentWillMount() {
    this.props.getMenuPermissionByID(this.props.ConfigurationShowCard === 1 ? "CDC06EAB-8843-588B-51AA-973A36482116" : 'CAE8A211-9051-492B-03D2-D2E342FD8F24'); // get Trading menu permission
    // code added by devang parekh for handle and check menu detail and store (17-4-2019)
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
  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false,
    });
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
        trnChargeType: "0",
        trnCharge: "",
        openOrderExpiration: "",
        status: "",
        open: false
        //exchange: "",
      },
      loader: false,
      errors: {}
    });
  }

  componentWillReceiveProps(nextProps) {
    // code added by Parth Andhariya for handle and check menu detail and store (17-4-2019)
    // var fieldList = {};
    // if (nextProps.menuDetail.Fields && nextProps.menuDetail.Fields.length) {
    //   nextProps.menuDetail.Fields.forEach(function (item) {
    //     fieldList[item.GUID] = item;
    //   });
    //   this.setState({
    //     fieldList: fieldList
    //   })
    // }
    // code end
    if (nextProps.marketCurrencyList && typeof nextProps.marketCurrencyList !== 'undefined') {
      this.setState({ marketCurrencyList: nextProps.marketCurrencyList });
    }

    if (nextProps.pairCurrencyList) {

      this.setState({ pairCurrencyList: nextProps.pairCurrencyList });
    }

    if (this.state.addPairConfig && nextProps.addPairSuccess && nextProps.error.length == 0) {
      NotificationManager.success(<IntlMessages id="pair.add.currency.success" />);
      this.setState({
        open: false,
        addPairConfig: false
      })
      this.props.drawerClose();
      
       //code change by jayshreeba gohil (14-6-2019) for handle arbitrage configuration detail
       var reqObject = {};
       if(this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
           reqObject.IsArbitrage = this.props.IsArbitrage;
       }
       this.props.getPairConfigurationList(reqObject);
       //end
       
      //added by parth andhariya 
      if (this.props.ConfigurationShowCard === 1) {
        this.props.getPairConfigurationList({});
      } else {
        this.props.getPairConfigurationList({ IsMargin: 1 });
      }
    } else if (nextProps.error && nextProps.error.ReturnCode !== 0 && this.state.addPairConfig) {

      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextProps.error.ErrorCode}`} />);
      this.setState({
        addPairConfig: false
      })
      //this.props.getMarketList({})
    }
    /* update menu details if not set */
    if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
      if (nextProps.menu_rights.ReturnCode === 0) {
      
        //added by parth andhariya 
        if (this.props.ConfigurationShowCard === 1) {
          this.props.getMarketCurrencyList({ IsMargin: 1 });
        } else {
          this.props.getMarketCurrencyList({});
        }
        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
        this.setState({ notificationFlag: false });
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        this.props.drawerClose();
      }
    }
  }

  submitPairConfigurationForm() {

    const { addNewPairDetails } = this.state
    if (addNewPairDetails.baseCurrencyId == '') {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.selectmarket" />)
    } else if (addNewPairDetails.secondaryCurrencyId == '') {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.selectcurrency" />)
    } else if (addNewPairDetails.defaultRate == '') {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.defaultrate" />)
    }
    else if (isScriptTag(addNewPairDetails.defaultRate)) {
      NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
    }
    else if (isHtmlTag(addNewPairDetails.defaultRate)) {
      NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
    }else if (addNewPairDetails.volume ==='') {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.volume" />)
    }
    else if (isScriptTag(addNewPairDetails.volume|| addNewPairDetails.buyMinQuantity||addNewPairDetails.sellMinQuantit||addNewPairDetails.buyMinPrice||addNewPairDetails.sellMinPrice||addNewPairDetails.sellPrice)) {
      NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
    }
    else if (isHtmlTag(addNewPairDetails.volume||addNewPairDetails.buyMinQuantity||addNewPairDetails.sellMinQuantit||addNewPairDetails.buyMinPrice||addNewPairDetails.sellMinPrice||addNewPairDetails.sellPrice)) {
      NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
    }
    /*   else if (addNewPairDetails.currencyPrice == '') {
  
        NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.currencyprice" />)
      } */
    else if (addNewPairDetails.buyMinQuantity == '' || addNewPairDetails.buyMaxQuantity == '') {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.buyquantity" />)
    } else if (addNewPairDetails.sellMinQuantity == '' || addNewPairDetails.sellMaxQuantity == '') {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.sellquantity" />)
    }
    else if (addNewPairDetails.buyMinPrice == '' || addNewPairDetails.buyMaxPrice == '') {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.buypricerange" />)
    } else if (addNewPairDetails.sellMinPrice == '' || addNewPairDetails.sellMaxPrice == '') {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.sellpricerange" />)
    }
    /*else if (addNewPairDetails.sellPrice == '' || addNewPairDetails.buyPrice == '') {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.price" />)
    } else if (addNewPairDetails.buyFees == '' || addNewPairDetails.sellFees == '') {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.buyfees" />)
    } else if (addNewPairDetails.feesCurrency == '') {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.sellfees" />)
    } else if (addNewPairDetails.trnChargeType == '') {

      NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.trncharge" />)
    } */
    //  else if (addNewPairDetails.openOrderExpiration == '') {

    //   NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.openorderexp" />)
    // } else if (addNewPairDetails.status == '') {

    //   NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.status" />)
    // }
    else {
      if (addNewPairDetails.buyMinQuantity > addNewPairDetails.buyMaxQuantity) {

        NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.rangebuyquantity" />)
      } else if (addNewPairDetails.sellMinQuantity > addNewPairDetails.sellMaxQuantity) {

        NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.rangesellquantity" />)
      }
      else if (addNewPairDetails.buyMinPrice > addNewPairDetails.buyMaxPrice) {

        NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.rangebuyprice" />)
      }
      else if (addNewPairDetails.sellMinPrice > addNewPairDetails.sellMaxPrice) {

        NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.rangesellprice" />)
      }
      else {
        const addRequest = {
          SecondaryCurrencyId: addNewPairDetails.secondaryCurrencyId ? parseInt(addNewPairDetails.secondaryCurrencyId) : parseInt(0),
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
          FeesCurrency: addNewPairDetails.feesCurrency, // addNewPairDetails.feesCurrency ? parseFloat(addNewPairDetails.feesCurrency) :parseFloat(0),
          Status: addNewPairDetails.status ? parseInt(addNewPairDetails.status) : parseInt(0),

          ChargeType: addNewPairDetails.trnChargeType ? parseInt(addNewPairDetails.trnChargeType) : parseInt(0),
          OpenOrderExpiration: addNewPairDetails.openOrderExpiration ? parseInt(addNewPairDetails.openOrderExpiration) : parseInt(0)

        }

        this.setState({
          addPairConfig: true
        })
          //code change by jayshreeba gohil (14-6-2019) for handle arbitrage configuration detail
          var reqObject = addRequest;
          if(this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
              reqObject.IsArbitrage = this.props.IsArbitrage;
          }
          this.props.submitPairConfigurationForm(reqObject);
          //end
        //added by parth andhariya 
        if (this.props.ConfigurationShowCard === 1) {
          addRequest.IsMargin = 1;
          this.props.submitPairConfigurationForm(addRequest);
        } else {
          this.props.submitPairConfigurationForm(addRequest);
        }
      }
    }

  }

  // on change Payment Method add new form value
  onChangeAddNewPairForm(key, value) {
    this.setState({
      addNewPairDetails: {
        ...this.state.addNewPairDetails,
        [key]: value
      }
    });
  }

  onChangeMarketCurrency(e, baseCurrency) {
    var market = '';
    var baseCurrencyId = ''
    if (e.target.value !== '') {
      //added by parth andhariya
      if (this.props.ConfigurationShowCard === 1) {
        this.props.getPairCurrencyList({ Base: e.target.value, IsMargin: 1 })
      } else {
        this.props.getPairCurrencyList({ Base: e.target.value })
      }
    }

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
      }

    });
  }

  onChangePairCurrency = (e) => {

    var currencyId = '', pairCurrency = ''
    if (this.state.pairCurrencyList) {
      this.state.pairCurrencyList.map((value, key) => {
        if (value.SMSCode == e.target.value) {
          currencyId = value.ServiceId,
            pairCurrency = value.SMSCode
        }
      })
    }

    this.setState({
      addNewPairDetails: {
        ...this.state.addNewPairDetails,
        secondaryCurrencyId: currencyId,
        pairCurrency: pairCurrency
      }

    });
  }

  // componentDidMount() {
  //   //this.props.getPairConfigurationList({}); 
  //   //added by parth andhariya 
  //   if (this.props.ConfigurationShowCard === 1) {
  //     this.props.getMarketCurrencyList({ IsMargin: 1 });
  //   } else {
  //     this.props.getMarketCurrencyList({});
  //   }
  // }

  checkNumericFields = event => {
    if (validateOnlyNumeric(event.target.value)) {
      this.setState({
        addNewPairDetails: {
          ...this.state.addNewPairDetails,
          [event.target.name]: event.target.value
        }
      });
    } else if (event.target.value == "") {
      this.setState({
        addNewPairDetails: {
          ...this.state.addNewPairDetails,
          [event.target.name]: event.target.value
        }
      });
    }
  };

  changeCurrencyFees = event => {
    if (!validateOnlyNumeric(event.target.value) || event.target.value == "") {
      this.setState({
        addNewPairDetails: {
          ...this.state.addNewPairDetails,
          [event.target.name]: event.target.value
        }
      })
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
    /* check menu permission */
    var menuDetail = this.checkAndGetMenuAccessDetail(this.props.ConfigurationShowCard === 1 ? '515C74FF-16DC-2941-35EB-2B7737A072D2' : '71EF0D4C-3378-4BBD-3A77-BA5AB68C6693');// 71EF0D4C-3378-4BBD-3A77-BA5AB68C6693  && MarginGUID 515C74FF-16DC-2941-35EB-2B7737A072D2
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
            <h2><IntlMessages id="sidebar.pairConfiguration.modal.addNewPair" /></h2>
          </div>
          <div className="page-title-wrap drawer_btn mb-10 text-right">
            <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={() => this.closeAddPairModal()}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
            <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
          </div>
        </div>
        <div className="m-10 p-5">
          <Row>
            <Col md={12}>
              <Form className="tradefrm">
                <FormGroup row>
                  {((ConfigurationShowCard === 1 ? menuDetail["C698652F-626B-8610-5BF5-66A40E8359F5"] : menuDetail["BB70A2FA-18C5-9685-7C5F-1AFC43BD8387"]) && (ConfigurationShowCard === 1 ? menuDetail["C698652F-626B-8610-5BF5-66A40E8359F5"].Visibility === "E925F86B" : menuDetail["BB70A2FA-18C5-9685-7C5F-1AFC43BD8387"].Visibility === "E925F86B")) && //BB70A2FA-18C5-9685-7C5F-1AFC43BD8387  && margin_GUID C698652F-626B-8610-5BF5-66A40E8359F5
                    <Col md={4} sm={6} xs={12}>
                      <Label>
                        <IntlMessages id="sidebar.pairConfiguration.list.lable.marketName" />
                      </Label>
                      <IntlMessages id="trading.pairconfig.placeholder.marketname">
                        {(placeholder) =>
                          <Input type="text"
                            disabled={(ConfigurationShowCard === 1 ? menuDetail["C698652F-626B-8610-5BF5-66A40E8359F5"].AccessRight === "11E6E7B0" : menuDetail["BB70A2FA-18C5-9685-7C5F-1AFC43BD8387"].AccessRight === "11E6E7B0") ? true : false}
                            name="marketName"
                            value={addNewPairDetails.marketName}
                            disabled={true}
                            onChange={e =>
                              this.onChangeAddNewPairForm("marketName", e.target.value)
                            }
                            placeholder={placeholder} >
                          </Input>
                        }
                      </IntlMessages>
                    </Col>
                  }
                  {((ConfigurationShowCard === 1 ? menuDetail["4B238945-9929-2C84-18CF-2CD972284440"] : menuDetail["16B440F6-44CD-7D8E-1E44-59FE2C4E16A4"]) && (ConfigurationShowCard === 1 ? menuDetail["4B238945-9929-2C84-18CF-2CD972284440"].Visibility === "E925F86B" : menuDetail["16B440F6-44CD-7D8E-1E44-59FE2C4E16A4"].Visibility === "E925F86B")) && //16B440F6-44CD-7D8E-1E44-59FE2C4E16A4  && margin_GUID 4B238945-9929-2C84-18CF-2CD972284440
                    <Col md={4} sm={6} xs={12}>
                      <Label>
                        <IntlMessages id="manageMarkets.list.form.label.basecurrency" /><span className="text-danger">*</span>
                      </Label>
                      <Input
                        disabled={(ConfigurationShowCard === 1 ? menuDetail["4B238945-9929-2C84-18CF-2CD972284440"].AccessRight === "11E6E7B0" : menuDetail["16B440F6-44CD-7D8E-1E44-59FE2C4E16A4"].AccessRight === "11E6E7B0") ? true : false}
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

                        {marketCurrencyList.length && marketCurrencyList.map((item, key) => (
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
                  {((ConfigurationShowCard === 1 ? menuDetail["B773B132-1D3D-1AB3-26B1-934A68EF51C3"] : menuDetail["1BAB1133-A722-8897-15C2-9657909977F4"]) && (ConfigurationShowCard === 1 ? menuDetail["B773B132-1D3D-1AB3-26B1-934A68EF51C3"].Visibility === "E925F86B" : menuDetail["1BAB1133-A722-8897-15C2-9657909977F4"].Visibility === "E925F86B")) && //1BAB1133-A722-8897-15C2-9657909977F4  && margin_GUID B773B132-1D3D-1AB3-26B1-934A68EF51C3
                    <Col md={4} sm={6} xs={12}>
                      <Label>
                        <IntlMessages id="sidebar.pairConfiguration.list.lable.pairCurrencies" /><span className="text-danger">*</span>
                        {"           "}
                        <Tooltip title={<IntlMessages id="pairConfiguration.tooltip.paircurrency" />}
                          disableFocusListener
                          disableTouchListener
                        >
                          <a href="javascript:void(0)"
                            className="ml-10"
                          >
                            <i className="fa fa-info-circle" />
                          </a>
                        </Tooltip>

                      </Label>
                      <Input
                        disabled={(ConfigurationShowCard === 1 ? menuDetail["B773B132-1D3D-1AB3-26B1-934A68EF51C3"].AccessRight === "11E6E7B0" : menuDetail["1BAB1133-A722-8897-15C2-9657909977F4"].AccessRight === "11E6E7B0") ? true : false}
                        type="select"
                        name="pairCurrency"
                        value={addNewPairDetails.pairCurrency}
                        disabled={addNewPairDetails.marketCurrency == ""}
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
                  {((ConfigurationShowCard === 1 ? menuDetail["77216219-37E1-90C8-0CA2-16BD1EAB97BE"] : menuDetail["76A656E5-315C-A261-32D1-E6B08F56023B"]) && (ConfigurationShowCard === 1 ? menuDetail["77216219-37E1-90C8-0CA2-16BD1EAB97BE"].Visibility === "E925F86B" : menuDetail["76A656E5-315C-A261-32D1-E6B08F56023B"].Visibility === "E925F86B")) && //76A656E5-315C-A261-32D1-E6B08F56023B  && margin_GUID 77216219-37E1-90C8-0CA2-16BD1EAB97BE
                    <Col md={4} sm={6} xs={12}>
                      <Label>
                        <IntlMessages id="sidebar.pairConfiguration.list.lable.defaultRate" /><span className="text-danger">*</span>
                      </Label>
                      <IntlMessages id="trading.pairconfig.placeholder.defaultrate">
                        {(placeholder) =>
                          <Input type="text"
                            disabled={(ConfigurationShowCard === 1 ? menuDetail["77216219-37E1-90C8-0CA2-16BD1EAB97BE"].AccessRight === "11E6E7B0" : menuDetail["76A656E5-315C-A261-32D1-E6B08F56023B"].AccessRight === "11E6E7B0") ? true : false}
                            name="defaultRate"
                            value={addNewPairDetails.defaultRate}
                            onChange={this.checkNumericFields}
                            placeholder={placeholder} ></Input>
                        }
                      </IntlMessages>
                    </Col>
                  }
                  {((ConfigurationShowCard === 1 ? menuDetail["0907A119-0878-965C-23F6-0CA777366FD8"] : menuDetail["87A13A26-6482-4959-2B5B-331F1C6A35EC"]) && (ConfigurationShowCard === 1 ? menuDetail["0907A119-0878-965C-23F6-0CA777366FD8"].Visibility === "E925F86B" : menuDetail["87A13A26-6482-4959-2B5B-331F1C6A35EC"].Visibility === "E925F86B")) && //87A13A26-6482-4959-2B5B-331F1C6A35EC  && margin_GUID 0907A119-0878-965C-23F6-0CA777366FD8
                    <Col md={4} sm={6} xs={12}>
                      <Label>
                        <IntlMessages id="trading.pairconfig.placeholder.volume" /><span className="text-danger">*</span>
                      </Label>
                      <IntlMessages id="trading.pairconfig.placeholder.volume">
                        {(placeholder) =>
                          <Input
                            disabled={(ConfigurationShowCard === 1 ? menuDetail["0907A119-0878-965C-23F6-0CA777366FD8"].AccessRight === "11E6E7B0" : menuDetail["87A13A26-6482-4959-2B5B-331F1C6A35EC"].AccessRight === "11E6E7B0") ? true : false}
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
                    {((ConfigurationShowCard === 1 ? menuDetail["6A6439FF-1DBE-7DD0-2E25-52EC6C8597B7"] : menuDetail["5F331AE9-3755-2CF4-01A7-2789408B302B"]) && (ConfigurationShowCard === 1 ? menuDetail["6A6439FF-1DBE-7DD0-2E25-52EC6C8597B7"].Visibility === "E925F86B" : menuDetail["5F331AE9-3755-2CF4-01A7-2789408B302B"].Visibility === "E925F86B")) || ((ConfigurationShowCard === 1 ? menuDetail["E858F3CE-0F02-6449-4F0A-E5802B160A38"] : menuDetail["2E1D6DCA-5B3E-A6D5-96BC-6FFEEA734268"]) && (ConfigurationShowCard === 1 ? menuDetail["E858F3CE-0F02-6449-4F0A-E5802B160A38"].Visibility === "E925F86B" : menuDetail["2E1D6DCA-5B3E-A6D5-96BC-6FFEEA734268"].Visibility === "E925F86B")) &&
                      <Label>
                        <IntlMessages id="sidebar.pairConfiguration.list.lable.buyquentity" /><span className="text-danger">*</span>
                      </Label>
                    }
                    <Row>
                      {((ConfigurationShowCard === 1 ? menuDetail["6A6439FF-1DBE-7DD0-2E25-52EC6C8597B7"] : menuDetail["5F331AE9-3755-2CF4-01A7-2789408B302B"]) && (ConfigurationShowCard === 1 ? menuDetail["6A6439FF-1DBE-7DD0-2E25-52EC6C8597B7"].Visibility === "E925F86B" : menuDetail["5F331AE9-3755-2CF4-01A7-2789408B302B"].Visibility === "E925F86B")) && //5F331AE9-3755-2CF4-01A7-2789408B302B  && margin_GUID 6A6439FF-1DBE-7DD0-2E25-52EC6C8597B7
                        <Col md={5} sm={5} xs={5}>
                          <IntlMessages id="trading.pairconfig.placeholder.buyminqty">
                            {(placeholder) =>
                              <Input
                                disabled={(ConfigurationShowCard === 1 ? menuDetail["6A6439FF-1DBE-7DD0-2E25-52EC6C8597B7"].AccessRight === "11E6E7B0" : menuDetail["5F331AE9-3755-2CF4-01A7-2789408B302B"].AccessRight === "11E6E7B0") ? true : false}
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
                      {((ConfigurationShowCard === 1 ? menuDetail["6A6439FF-1DBE-7DD0-2E25-52EC6C8597B7"] : menuDetail["5F331AE9-3755-2CF4-01A7-2789408B302B"]) && (ConfigurationShowCard === 1 ? menuDetail["6A6439FF-1DBE-7DD0-2E25-52EC6C8597B7"].Visibility === "E925F86B" : menuDetail["5F331AE9-3755-2CF4-01A7-2789408B302B"].Visibility === "E925F86B")) || ((ConfigurationShowCard === 1 ? menuDetail["E858F3CE-0F02-6449-4F0A-E5802B160A38"] : menuDetail["2E1D6DCA-5B3E-A6D5-96BC-6FFEEA734268"]) && (ConfigurationShowCard === 1 ? menuDetail["E858F3CE-0F02-6449-4F0A-E5802B160A38"].Visibility === "E925F86B" : menuDetail["2E1D6DCA-5B3E-A6D5-96BC-6FFEEA734268"].Visibility === "E925F86B")) &&
                        <Col md={2} sm={2} xs={2} className="text-center mt-10">To</Col>
                      }
                      {((ConfigurationShowCard === 1 ? menuDetail["E858F3CE-0F02-6449-4F0A-E5802B160A38"] : menuDetail["2E1D6DCA-5B3E-A6D5-96BC-6FFEEA734268"]) && (ConfigurationShowCard === 1 ? menuDetail["E858F3CE-0F02-6449-4F0A-E5802B160A38"].Visibility === "E925F86B" : menuDetail["2E1D6DCA-5B3E-A6D5-96BC-6FFEEA734268"].Visibility === "E925F86B")) && //2E1D6DCA-5B3E-A6D5-96BC-6FFEEA734268  && margin_GUID E858F3CE-0F02-6449-4F0A-E5802B160A38
                        <Col md={5} sm={5} xs={5}>
                          <IntlMessages id="trading.pairconfig.placeholder.buymaxqty">
                            {(placeholder) =>
                              <Input
                                disabled={(ConfigurationShowCard === 1 ? menuDetail["E858F3CE-0F02-6449-4F0A-E5802B160A38"].AccessRight === "11E6E7B0" : menuDetail["2E1D6DCA-5B3E-A6D5-96BC-6FFEEA734268"].AccessRight === "11E6E7B0") ? true : false}
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
                    {((ConfigurationShowCard === 1 ? menuDetail["24E6225B-536D-50EC-A0C1-1AAF191D92B9"] : menuDetail["0F6279B0-139D-18CA-02BA-E00CFAA85966"]) && (ConfigurationShowCard === 1 ? menuDetail["24E6225B-536D-50EC-A0C1-1AAF191D92B9"].Visibility === "E925F86B" : menuDetail["0F6279B0-139D-18CA-02BA-E00CFAA85966"].Visibility === "E925F86B")) || ((ConfigurationShowCard === 1 ? menuDetail["A3CE3163-607C-3B17-494B-50C7C39E182B"] : menuDetail["30CBB4A6-871B-0B51-9D60-FCDDDF6A7BA9"]) && (ConfigurationShowCard === 1 ? menuDetail["A3CE3163-607C-3B17-494B-50C7C39E182B"].Visibility === "E925F86B" : menuDetail["30CBB4A6-871B-0B51-9D60-FCDDDF6A7BA9"].Visibility === "E925F86B")) &&
                      <Label>
                        <IntlMessages id="sidebar.pairConfiguration.list.lable.sellquentity" /><span className="text-danger">*</span>
                      </Label>
                    }
                    <Row>
                      {((ConfigurationShowCard === 1 ? menuDetail["24E6225B-536D-50EC-A0C1-1AAF191D92B9"] : menuDetail["0F6279B0-139D-18CA-02BA-E00CFAA85966"]) && (ConfigurationShowCard === 1 ? menuDetail["24E6225B-536D-50EC-A0C1-1AAF191D92B9"].Visibility === "E925F86B" : menuDetail["0F6279B0-139D-18CA-02BA-E00CFAA85966"].Visibility === "E925F86B")) && //0F6279B0-139D-18CA-02BA-E00CFAA85966  && margin_GUID 24E6225B-536D-50EC-A0C1-1AAF191D92B9
                        <Col md={5} sm={5} xs={5}>
                          <IntlMessages id="trading.pairconfig.placeholder.sellminqty">
                            {(placeholder) =>
                              <Input
                                disabled={(ConfigurationShowCard === 1 ? menuDetail["24E6225B-536D-50EC-A0C1-1AAF191D92B9"].AccessRight === "11E6E7B0" : menuDetail["0F6279B0-139D-18CA-02BA-E00CFAA85966"].AccessRight === "11E6E7B0") ? true : false}
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
                      {((ConfigurationShowCard === 1 ? menuDetail["24E6225B-536D-50EC-A0C1-1AAF191D92B9"] : menuDetail["0F6279B0-139D-18CA-02BA-E00CFAA85966"]) && (ConfigurationShowCard === 1 ? menuDetail["24E6225B-536D-50EC-A0C1-1AAF191D92B9"].Visibility === "E925F86B" : menuDetail["0F6279B0-139D-18CA-02BA-E00CFAA85966"].Visibility === "E925F86B")) || ((ConfigurationShowCard === 1 ? menuDetail["A3CE3163-607C-3B17-494B-50C7C39E182B"] : menuDetail["30CBB4A6-871B-0B51-9D60-FCDDDF6A7BA9"]) && (ConfigurationShowCard === 1 ? menuDetail["A3CE3163-607C-3B17-494B-50C7C39E182B"].Visibility === "E925F86B" : menuDetail["30CBB4A6-871B-0B51-9D60-FCDDDF6A7BA9"].Visibility === "E925F86B")) &&
                        <Col md={2} sm={2} xs={2} className="text-center mt-10">To</Col>
                      }
                      {((ConfigurationShowCard === 1 ? menuDetail["A3CE3163-607C-3B17-494B-50C7C39E182B"] : menuDetail["30CBB4A6-871B-0B51-9D60-FCDDDF6A7BA9"]) && (ConfigurationShowCard === 1 ? menuDetail["A3CE3163-607C-3B17-494B-50C7C39E182B"].Visibility === "E925F86B" : menuDetail["30CBB4A6-871B-0B51-9D60-FCDDDF6A7BA9"].Visibility === "E925F86B")) && //30CBB4A6-871B-0B51-9D60-FCDDDF6A7BA9  && margin_GUID A3CE3163-607C-3B17-494B-50C7C39E182B
                        <Col md={5} sm={5} xs={5}>
                          <IntlMessages id="trading.pairconfig.placeholder.sellmaxqty">
                            {(placeholder) =>
                              <Input
                                disabled={(ConfigurationShowCard === 1 ? menuDetail["A3CE3163-607C-3B17-494B-50C7C39E182B"].AccessRight === "11E6E7B0" : menuDetail["30CBB4A6-871B-0B51-9D60-FCDDDF6A7BA9"].AccessRight === "11E6E7B0") ? true : false}
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
                    {((ConfigurationShowCard === 1 ? menuDetail["4D75F195-2574-4379-6D72-DF096D9E6DB9"] : menuDetail["DB4FA90B-5DAE-889A-3D96-3FAFDF860E2A"]) && (ConfigurationShowCard === 1 ? menuDetail["4D75F195-2574-4379-6D72-DF096D9E6DB9"].Visibility === "E925F86B" : menuDetail["DB4FA90B-5DAE-889A-3D96-3FAFDF860E2A"].Visibility === "E925F86B")) || ((ConfigurationShowCard === 1 ? menuDetail["6440A248-6CDD-404A-1D56-E67EE1A06241"] : menuDetail["E5A9C633-7EBB-9747-2603-D92142546A63"]) && (ConfigurationShowCard === 1 ? menuDetail["6440A248-6CDD-404A-1D56-E67EE1A06241"].Visibility === "E925F86B" : menuDetail["E5A9C633-7EBB-9747-2603-D92142546A63"].Visibility === "E925F86B")) &&
                      <Label>
                        <IntlMessages id="sidebar.pairConfiguration.list.lable.buyprice" /><span className="text-danger">*</span>
                      </Label>
                    }
                    <Row>
                      {((ConfigurationShowCard === 1 ? menuDetail["4D75F195-2574-4379-6D72-DF096D9E6DB9"] : menuDetail["DB4FA90B-5DAE-889A-3D96-3FAFDF860E2A"]) && (ConfigurationShowCard === 1 ? menuDetail["4D75F195-2574-4379-6D72-DF096D9E6DB9"].Visibility === "E925F86B" : menuDetail["DB4FA90B-5DAE-889A-3D96-3FAFDF860E2A"].Visibility === "E925F86B")) && //DB4FA90B-5DAE-889A-3D96-3FAFDF860E2A  && margin_GUID 4D75F195-2574-4379-6D72-DF096D9E6DB9
                        <Col md={5} sm={5} xs={5}>
                          <IntlMessages id="trading.pairconfig.placeholder.buyminprice">
                            {(placeholder) =>
                              <Input
                                disabled={(ConfigurationShowCard === 1 ? menuDetail["4D75F195-2574-4379-6D72-DF096D9E6DB9"].AccessRight === "11E6E7B0" : menuDetail["DB4FA90B-5DAE-889A-3D96-3FAFDF860E2A"].AccessRight === "11E6E7B0") ? true : false}
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
                      {((ConfigurationShowCard === 1 ? menuDetail["4D75F195-2574-4379-6D72-DF096D9E6DB9"] : menuDetail["DB4FA90B-5DAE-889A-3D96-3FAFDF860E2A"]) && (ConfigurationShowCard === 1 ? menuDetail["4D75F195-2574-4379-6D72-DF096D9E6DB9"].Visibility === "E925F86B" : menuDetail["DB4FA90B-5DAE-889A-3D96-3FAFDF860E2A"].Visibility === "E925F86B")) || ((ConfigurationShowCard === 1 ? menuDetail["6440A248-6CDD-404A-1D56-E67EE1A06241"] : menuDetail["E5A9C633-7EBB-9747-2603-D92142546A63"]) && (ConfigurationShowCard === 1 ? menuDetail["6440A248-6CDD-404A-1D56-E67EE1A06241"].Visibility === "E925F86B" : menuDetail["E5A9C633-7EBB-9747-2603-D92142546A63"].Visibility === "E925F86B")) &&
                        <Col md={2} sm={2} xs={2} className="text-center mt-10">To</Col>
                      }
                      {((ConfigurationShowCard === 1 ? menuDetail["6440A248-6CDD-404A-1D56-E67EE1A06241"] : menuDetail["E5A9C633-7EBB-9747-2603-D92142546A63"]) && (ConfigurationShowCard === 1 ? menuDetail["6440A248-6CDD-404A-1D56-E67EE1A06241"].Visibility === "E925F86B" : menuDetail["E5A9C633-7EBB-9747-2603-D92142546A63"].Visibility === "E925F86B")) && //E5A9C633-7EBB-9747-2603-D92142546A63  && margin_GUID 6440A248-6CDD-404A-1D56-E67EE1A06241
                        <Col md={5} sm={5} xs={5}>
                          <IntlMessages id="trading.pairconfig.placeholder.buymaxprice">
                            {(placeholder) =>
                              <Input
                                disabled={(ConfigurationShowCard === 1 ? menuDetail["6440A248-6CDD-404A-1D56-E67EE1A06241"].AccessRight === "11E6E7B0" : menuDetail["E5A9C633-7EBB-9747-2603-D92142546A63"].AccessRight === "11E6E7B0") ? true : false}
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
                    {((ConfigurationShowCard === 1 ? menuDetail["25BB8F6C-0849-6E58-5748-43D8F7C21E9E"] : menuDetail["013B0E78-98CB-9D2D-08C1-93E75853563A"]) && (ConfigurationShowCard === 1 ? menuDetail["25BB8F6C-0849-6E58-5748-43D8F7C21E9E"].Visibility === "E925F86B" : menuDetail["013B0E78-98CB-9D2D-08C1-93E75853563A"].Visibility === "E925F86B")) || ((ConfigurationShowCard === 1 ? menuDetail["EAAADD43-68B1-262D-00BE-AD91E3623BA7"] : menuDetail["F9B79DAC-67E4-485F-9F0A-7A21EC3E570B"]) && (ConfigurationShowCard === 1 ? menuDetail["EAAADD43-68B1-262D-00BE-AD91E3623BA7"].Visibility === "E925F86B" : menuDetail["F9B79DAC-67E4-485F-9F0A-7A21EC3E570B"].Visibility === "E925F86B")) &&
                      <Label>
                        <IntlMessages id="sidebar.pairConfiguration.list.lable.sellprice" /><span className="text-danger">*</span>
                      </Label>
                    }
                    <Row>
                      {((ConfigurationShowCard === 1 ? menuDetail["25BB8F6C-0849-6E58-5748-43D8F7C21E9E"] : menuDetail["013B0E78-98CB-9D2D-08C1-93E75853563A"]) && (ConfigurationShowCard === 1 ? menuDetail["25BB8F6C-0849-6E58-5748-43D8F7C21E9E"].Visibility === "E925F86B" : menuDetail["013B0E78-98CB-9D2D-08C1-93E75853563A"].Visibility === "E925F86B")) && //013B0E78-98CB-9D2D-08C1-93E75853563A  && margin_GUID 25BB8F6C-0849-6E58-5748-43D8F7C21E9E
                        <Col md={5} sm={5} xs={5}>
                          <IntlMessages id="trading.pairconfig.placeholder.sellminprice">
                            {(placeholder) =>
                              <Input
                                disabled={(ConfigurationShowCard === 1 ? menuDetail["25BB8F6C-0849-6E58-5748-43D8F7C21E9E"].AccessRight === "11E6E7B0" : menuDetail["013B0E78-98CB-9D2D-08C1-93E75853563A"].AccessRight === "11E6E7B0") ? true : false}
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
                      {((ConfigurationShowCard === 1 ? menuDetail["25BB8F6C-0849-6E58-5748-43D8F7C21E9E"] : menuDetail["013B0E78-98CB-9D2D-08C1-93E75853563A"]) && (ConfigurationShowCard === 1 ? menuDetail["25BB8F6C-0849-6E58-5748-43D8F7C21E9E"].Visibility === "E925F86B" : menuDetail["013B0E78-98CB-9D2D-08C1-93E75853563A"].Visibility === "E925F86B")) || ((ConfigurationShowCard === 1 ? menuDetail["EAAADD43-68B1-262D-00BE-AD91E3623BA7"] : menuDetail["F9B79DAC-67E4-485F-9F0A-7A21EC3E570B"]) && (ConfigurationShowCard === 1 ? menuDetail["EAAADD43-68B1-262D-00BE-AD91E3623BA7"].Visibility === "E925F86B" : menuDetail["F9B79DAC-67E4-485F-9F0A-7A21EC3E570B"].Visibility === "E925F86B")) &&
                        <Col md={2} sm={2} xs={2} className="text-center mt-10">To</Col>
                      }
                      {((ConfigurationShowCard === 1 ? menuDetail["EAAADD43-68B1-262D-00BE-AD91E3623BA7"] : menuDetail["F9B79DAC-67E4-485F-9F0A-7A21EC3E570B"]) && (ConfigurationShowCard === 1 ? menuDetail["EAAADD43-68B1-262D-00BE-AD91E3623BA7"].Visibility === "E925F86B" : menuDetail["F9B79DAC-67E4-485F-9F0A-7A21EC3E570B"].Visibility === "E925F86B")) && //F9B79DAC-67E4-485F-9F0A-7A21EC3E570B  && margin_GUID EAAADD43-68B1-262D-00BE-AD91E3623BA7
                        <Col md={5} sm={5} xs={5}>
                          <IntlMessages id="trading.pairconfig.placeholder.sellmaxprice">
                            {(placeholder) =>
                              <Input
                                disabled={(ConfigurationShowCard === 1 ? menuDetail["EAAADD43-68B1-262D-00BE-AD91E3623BA7"].AccessRight === "11E6E7B0" : menuDetail["F9B79DAC-67E4-485F-9F0A-7A21EC3E570B"].AccessRight === "11E6E7B0") ? true : false}
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

                  {((ConfigurationShowCard === 1 ? menuDetail["50141E9A-9C0C-0982-1472-DE5A99F31A1D"] : menuDetail["1CA2C35F-5047-74E5-59CF-E783F41C5A71"]) && (ConfigurationShowCard === 1 ? menuDetail["50141E9A-9C0C-0982-1472-DE5A99F31A1D"].Visibility === "E925F86B" : menuDetail["1CA2C35F-5047-74E5-59CF-E783F41C5A71"].Visibility === "E925F86B")) && //1CA2C35F-5047-74E5-59CF-E783F41C5A71  && margin_GUID 50141E9A-9C0C-0982-1472-DE5A99F31A1D
                    <Col md={4} sm={6} xs={12}>
                      <Label>
                        <IntlMessages id="sidebar.pairConfiguration.list.lable.openOrderExpiration" />
                      </Label>
                      <IntlMessages id="trading.pairconfig.placeholder.openOrderExpiration">
                        {(placeholder) =>
                          <Input
                            disabled={(ConfigurationShowCard === 1 ? menuDetail["50141E9A-9C0C-0982-1472-DE5A99F31A1D"].AccessRight === "11E6E7B0" : menuDetail["1CA2C35F-5047-74E5-59CF-E783F41C5A71"].AccessRight === "11E6E7B0") ? true : false}
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
                  {((ConfigurationShowCard === 1 ? menuDetail["AB933160-1391-1372-1A36-E6E2D6A251C6"] : menuDetail["3FEAEB73-29A0-8BAA-141E-93BF4CAD76E9"]) && (ConfigurationShowCard === 1 ? menuDetail["AB933160-1391-1372-1A36-E6E2D6A251C6"].Visibility === "E925F86B" : menuDetail["3FEAEB73-29A0-8BAA-141E-93BF4CAD76E9"].Visibility === "E925F86B")) && //3FEAEB73-29A0-8BAA-141E-93BF4CAD76E9  && margin_GUID AB933160-1391-1372-1A36-E6E2D6A251C6
                    <Col md={4} sm={6} xs={12}>
                      <Label>
                        <IntlMessages id="sidebar.pairConfiguration.list.lable.status" />
                      </Label>
                      <Input
                        disabled={(ConfigurationShowCard === 1 ? menuDetail["AB933160-1391-1372-1A36-E6E2D6A251C6"].AccessRight === "11E6E7B0" : menuDetail["3FEAEB73-29A0-8BAA-141E-93BF4CAD76E9"].AccessRight === "11E6E7B0") ? true : false}
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
                {menuDetail &&
                  <FormGroup row>
                    <div className="offset-md-5 col-md-7 offset-sm-5 col-sm-7 col-xs-12">
                      <div className="btn_area">
                        <Button color="primary" onClick={(e) => this.submitPairConfigurationForm(e)} disabled={this.props.loading}><IntlMessages id="sidebar.pairConfiguration.button.add" /></Button>
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
    pairCurrencyLoading: pairConfiguration.pairCurrencyLoading,
    marketCurrencyLoading: pairConfiguration.marketCurrencyLoading,
    marketCurrencyList: pairConfiguration.marketCurrencyList,
    addPairSuccess: pairConfiguration.addPairSuccess,
    loading: pairConfiguration.addLoading,
    error: pairConfiguration.addError,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };
  return responce;
};

export default connect(
  mapStateToProps,
  {
    getPairCurrencyList,
    getMarketCurrencyList,
    submitPairConfigurationForm,
    getMenuPermissionByID
  }
)(AddPairConfiguration);
