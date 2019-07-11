/**
 * Added By Devang parekh
 * Component is used to pair configuration
 * pair configuration page contain add, update delete and multi delete option in list
 *
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from "reactstrap";

import MatButton from "@material-ui/core/Button";

//  Used For Display Notification 
import { NotificationManager } from "react-notifications";

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";
import NotFoundTable from "../NotFoundTable/notFoundTable";
import Tooltip from "@material-ui/core/Tooltip";

//Action Import for Payment Method  Report Add And Update
import {
  getPairConfigurationList,
  getMarketCurrencyList,
  getPairCurrencyList,
  getExchangeList,
  submitPairConfigurationForm,
  editPairConfigurationForm,
  deletePairConfigurationForm
} from "Actions/PairConfiguration";

import MUIDataTable from "mui-datatables";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';
// import validation functions
import { validateOnlyNumeric } from "../../validation/pairConfiguration";

class PairConfiguration extends Component {
  state = {
    pairConfigurationList: [],
    marketCurrencyList: [],
    pairCurrencyList: [],
    exchangeList: [],
    addNewPairConfigurationForm: false,
    editNewPairConfigurationForm: false,
    deleteNewPairConfigurationForm: false,
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
      feesCurrency: "",
      currencyPrice: "",
      volume: "",
      pairId: "",
      minOpenQuantity: "",
      maxOpenQuantity: "",
      trnChargeType: "",
      trnCharge: "",
      openOrderExpiration: "",
      status: "",
      secondaryCurrencyId: "",
      BaseCurrencyId: '',
    },
    deleteRecordDetail: {},
    successMessage: "",
    errors: "",
    loader: false,
    notificationFlag: true,
    menudetail: [],
  };

  addNewPairConfiguration() {
    this.setState({
      addNewPairConfigurationForm: true,
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
        trnChargeType: "1",
        trnCharge: "",
        openOrderExpiration: "",
        status: ""
      },
      loader: true,
      errors: {}
    });

    this.getBasicFormDetail();
  }

  async getBasicFormDetail() {
    await this.props.getMarketCurrencyList({});
    this.setState({ loader: false });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPairListFound >= 0) {
      this.setState({ loader: false });
    }

    if (nextProps.pairConfigurationList.length !== 0 && nextProps.error.length == 0 && this.state.addNewPairConfigurationForm == false) {
      this.setState({
        pairConfigurationList: nextProps.pairConfigurationList,
      })
    } else if (nextProps.error.length !== 0 && nextProps.error.ReturnCode !== 0 && this.state.addNewPairConfigurationForm == false) {
      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextProps.error.ErrorCode}`} />);
      this.setState({
        pairConfigurationList: [],
      })
    }


    if (nextProps.marketCurrencyList !== undefined && nextProps.marketCurrencyList) {
      this.setState({ marketCurrencyList: nextProps.marketCurrencyList });
    }

    if (nextProps.pairCurrencyList) {
      this.setState({ pairCurrencyList: nextProps.pairCurrencyList });
    }

    if (nextProps.addPairSuccess >= 0) {
      this.setState({
        addNewPairConfigurationForm: false,
        addNewPairDetails: {
          marketName: "",
          marketCurrency: [],
          pairCurrency: "",
          status: ""
        },
        loader: false
      });

      if (nextProps.addPairSuccess == 1) {
        this.props.getPairConfigurationList({ loading: true });
      }
    }

    if (nextProps.editPairSuccess >= 0) {
      this.setState({
        addNewPairConfigurationForm: false,
        editNewPairConfigurationForm: false,
        addNewPairDetails: {
          marketName: "",
          marketCurrency: [],
          pairCurrency: "",
          status: ""
        },
        ID: "",
        loader: false
      });

      if (nextProps.addPairSuccess == 1) {
        this.props.getPairConfigurationList({ loading: true });
      }
    }

    if (nextProps.deletePairSuccess >= 0) {
      this.setState({
        deleteRecordDetail: {},
        deleteNewPairConfigurationForm: false,
        loader: false
      });

      if (nextProps.deletePairSuccess == 1) {
        this.props.getPairConfigurationList({});
      }
    }
  }

  componentDidMount() {
    this.setState({ loader: true });
    this.props.getPairConfigurationList({});
  }

  // start code for add process
  submitPairConfigurationForm() {
    const { addNewPairDetails } = this.state
    const addRequest = {
      SecondaryCurrencyId: addNewPairDetails.secondaryCurrencyId ? parseInt(addNewPairDetails.secondaryCurrencyId) : parseInt(0),
      BaseCurrencyId: addNewPairDetails.baseCurrencyId ? parseInt(addNewPairDetails.baseCurrencyId) : parseInt(0),
      CurrentRate: addNewPairDetails.defaultRate ? parseFloat(addNewPairDetails.defaultRate) : parseFloat(0),
      BuyMinQty: addNewPairDetails.buyMinQuantity ? parseFloat(addNewPairDetails.buyMinQuantity) : parseFloat(0),
      BuyMaxQty: addNewPairDetails.buyMaxQuantity ? parseFloat(addNewPairDetails.buyMaxQuantity) : parseFloat(0),
      SellMinQty: addNewPairDetails.sellMinQuantity ? parseFloat(addNewPairDetails.sellMinQuantity) : parseFloat(0),
      SellMaxQty: addNewPairDetails.sellMaxQuantity ? parseFloat(addNewPairDetails.sellMaxQuantity) : parseFloat(0),
      CurrencyPrice: addNewPairDetails.currencyPrice ? parseFloat(addNewPairDetails.currencyPrice) : parseFloat(0),
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
      ChargeType: addNewPairDetails.trnChargeType ? parseInt(addNewPairDetails.trnChargeType) : parseInt(0),
      OpenOrderExpiration: addNewPairDetails.openOrderExpiration ? parseInt(addNewPairDetails.openOrderExpiration) : parseInt(0)

    }
    this.props.submitPairConfigurationForm(addRequest);
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

  closeAddPairModal() {
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
        status: ""
      },
      loader: false,
      errors: {}
    });
  }

  // end

  // start code for edit process
  onEditPairConfiguration(selectedData) {

    this.props.getMarketCurrencyList({});
    this.props.getPairCurrencyList({ Base: selectedData.PairName.split("_")[0] });

    this.setState({
      addNewPairConfigurationForm: true,
      editNewPairConfigurationForm: true,
      addNewPairDetails: {
        marketName: selectedData.MarketName,
        baseCurrencyId: selectedData.BaseCurrencyId,
        secondaryCurrencyId: selectedData.SecondaryCurrencyId,
        pairId: selectedData.Id,
        marketCurrency: selectedData.PairName.split("_")[0],
        pairCurrency: selectedData.PairName.split("_")[1],
        defaultRate: selectedData.CurrentRate,
        buyMinQuantity: selectedData.BuyMinQty,
        buyMaxQuantity: selectedData.BuyMaxQty,
        sellMaxQuantity: selectedData.SellMaxQty,
        currencyPrice: selectedData.CurrencyPrice,
        volume: selectedData.Volume,
        sellMinQuantity: selectedData.SellMinQty,
        buyMinPrice: selectedData.BuyMinPrice,
        buyMaxPrice: selectedData.BuyMaxPrice,
        sellMinPrice: selectedData.SellMinPrice,
        sellMaxPrice: selectedData.SellMaxPrice,
        trnChargeType: selectedData.ChargeType,
        buyPrice: selectedData.BuyPrice,
        sellPrice: selectedData.SellPrice,
        buyFees: selectedData.BuyFees,
        sellFees: selectedData.SellFees,
        feesCurrency: selectedData.FeesCurrency,
        openOrderExpiration: selectedData.OpenOrderExpiration,
        status: selectedData.Status,
        Id: 0
      },
      errors: {}
    });

  }

  edirPairConfigurationForm() {

    const { addNewPairDetails } = this.state
    const addRequest = {
      SecondaryCurrencyId: addNewPairDetails.secondaryCurrencyId ? parseInt(addNewPairDetails.secondaryCurrencyId) : parseInt(0),
      Id: addNewPairDetails.pairId ? parseInt(addNewPairDetails.pairId) : parseInt(0),
      BaseCurrencyId: addNewPairDetails.baseCurrencyId ? parseInt(addNewPairDetails.baseCurrencyId) : parseInt(0),
      CurrentRate: addNewPairDetails.defaultRate ? parseFloat(addNewPairDetails.defaultRate) : parseFloat(0),
      BuyMinQty: addNewPairDetails.buyMinQuantity ? parseFloat(addNewPairDetails.buyMinQuantity) : parseFloat(0),
      BuyMaxQty: addNewPairDetails.buyMaxQuantity ? parseFloat(addNewPairDetails.buyMaxQuantity) : parseFloat(0),
      SellMinQty: addNewPairDetails.sellMinQuantity ? parseFloat(addNewPairDetails.sellMinQuantity) : parseFloat(0),
      SellMaxQty: addNewPairDetails.sellMaxQuantity ? parseFloat(addNewPairDetails.sellMaxQuantity) : parseFloat(0),
      CurrencyPrice: addNewPairDetails.currencyPrice ? parseFloat(addNewPairDetails.currencyPrice) : parseFloat(0),
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
      ChargeType: addNewPairDetails.trnChargeType ? parseInt(addNewPairDetails.trnChargeType) : parseInt(0),
      OpenOrderExpiration: addNewPairDetails.openOrderExpiration ? parseInt(addNewPairDetails.openOrderExpiration) : parseInt(0)

    }
    this.props.editPairConfigurationForm(addRequest);
  }

  onChangeMarketCurrency(e, baseCurrency) {
    var market = '';
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
      }

    });
  }

  onChangePairCurrency = (e) => {

    var currencyId = '', pairCurrency = ''
    if (this.state.pairCurrencyList) {
      this.state.pairCurrencyList.map((value, key) => {
        if (value.SMSCode == e.target.value) {
          currencyId = value.ServiceId
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

  // end
  // start code for delete pair process

  deletePairConfiguration(deleteRecordDetail) {
    this.setState({
      deleteRecordDetail: deleteRecordDetail,
      deleteNewPairConfigurationForm: true
    });
  }

  confirmDeletePairConfiguration() {
    if (this.state.deleteRecordDetail) {
      this.setState({
        loader: true
      });
      this.props.deletePairConfigurationForm(this.state.deleteRecordDetail);
    }
  }

  closeDeletePairModal() {
    this.setState({
      deleteRecordDetail: {},
      deleteNewPairConfigurationForm: false
    });
  }

  // check numeric fields value and validate string entered by user
  checkNumericFields = event => {
    if (validateOnlyNumeric(event.target.value) || (event.target.value == "")) {
      this.setState({
        addNewPairDetails: {
          ...this.state.addNewPairDetails,
          [event.target.name]: event.target.value
        }
      });
    }
  };

  // end

  render() {
    const {
      addNewPairConfigurationForm,
      editNewPairConfigurationForm,
      deleteNewPairConfigurationForm,
      addNewPairDetails,
      pairConfigurationList,
      marketCurrencyList,
      pairCurrencyList,
      loader
    } = this.state;

    const columns = [
      {
        name: "#",
        options: { sort: false, filter: false }
      },
      {
        name: (
          <IntlMessages id="sidebar.pairConfiguration.list.lable.marketName" />
        ),
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="sidebar.pairConfiguration.list.lable.pair" />,
        options: { sort: true, filter: true }
      },
      {
        name: (
          <IntlMessages id="sidebar.pairConfiguration.list.lable.defaultRate" />
        ),
        options: { sort: true, filter: true }
      },
      {
        name: (
          <IntlMessages id="sidebar.pairConfiguration.list.lable.buyquentity" />
        ),
        options: { sort: true, filter: true }
      },
      {
        name: (
          <IntlMessages id="sidebar.pairConfiguration.list.lable.sellquentity" />
        ),
        options: { sort: true, filter: true }
      },
      {
        name: (
          <IntlMessages id="sidebar.pairConfiguration.list.lable.buyprice" />
        ),
        options: { sort: true, filter: true }
      },

      {
        name: (
          <IntlMessages id="sidebar.pairConfiguration.list.lable.sellprice" />
        ),
        options: { sort: true, filter: true }
      },
      {
        name: (
          <IntlMessages id="sidebar.pairConfiguration.list.lable.trnCharge" />
        ),
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="sidebar.pairConfiguration.list.lable.status" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="sidebar.pairConfiguration.list.lable.action" />,
        options: { sort: false, filter: false }
      }
    ];

    const options = {
      filterType: "dropdown",
      responsive: "stacked",
      selectableRows: true,
      print: false,
      download: false,
      viewColumns: false,
      filter: true,
      customToolbar: () => {
        return (
          <MatButton
            variant="raised"
            className="btn-primary text-white"
            onClick={() => this.addNewPairConfiguration()}
          >

            <IntlMessages id="sidebar.pairConfiguration.button.add" />
          </MatButton>
        );
      },
      customToolbarSelect: selectedRows => (
        <CustomToolbarSelect
          selectedRows={selectedRows}
          deletePairConfigurationForm={this.props.deletePairConfigurationForm}
          pairConfigurationList={pairConfigurationList}
        />
      )
    };

    return (
      <div>
        {this.state.loader && <JbsSectionLoader />}
        <div className="StackingHistory">
          {pairConfigurationList.length !== 0 ? (
            <MUIDataTable
              title={this.props.title}
              data={pairConfigurationList.map((pairDetail, key) => {
                return [
                  key + 1,
                  pairDetail.MarketName,
                  pairDetail.PairName,
                  pairDetail.CurrentRate,
                  pairDetail.BuyMinQty + "-" + pairDetail.BuyMaxQty,
                  pairDetail.SellMinQty + "-" + pairDetail.SellMaxQty,
                  pairDetail.BuyMinPrice + "-" + pairDetail.BuyMaxPrice,
                  pairDetail.SellMinPrice + "-" + pairDetail.SellMaxPrice,
                  pairDetail.ChargeType +
                  (pairDetail.ChargeType == 1 ? "%" : ""),
                  pairDetail.StatusText,
                  <Fragment>
                    <div className="list-action">
                      <Tooltip
                        title={
                          <IntlMessages id="sidebar.pairConfiguration.button.update" />
                        }
                        disableFocusListener disableTouchListener
                      >
                        <a
                          href="javascript:void(0)"
                          className="mr-10"
                          onClick={() => this.onEditPairConfiguration(pairDetail)}
                        >
                          <i className="ti-pencil" />
                        </a>
                      </Tooltip>
                      <Tooltip
                        title={
                          <IntlMessages id="sidebar.pairConfiguration.tooltip.delete" />
                        }
                        disableFocusListener disableTouchListener
                      >
                        <a
                          href="javascript:void(0)"
                          className="mr-10"
                          onClick={() => this.deletePairConfiguration(pairDetail)}
                        >
                          <i className="ti-close" />
                        </a>
                      </Tooltip>
                    </div>
                  </Fragment>
                ];
              })}
              columns={columns}
              options={options}
            />
          ) : (
              <NotFoundTable title={this.props.title} columns={columns} />
            )}
        </div>
        {addNewPairConfigurationForm && (
          <Modal
            isOpen={addNewPairConfigurationForm}
          >
            <ModalHeader toggle={() => this.closeAddPairModal()}>
              {
                <IntlMessages id="sidebar.pairConfiguration.modal.addNewPair" />
              }
            </ModalHeader>
            <ModalBody
            >
              <div className="text-center">
                {loader ? (
                  <CircularProgress
                    className="mr-30 mb-10 progress-success"
                    size={40}
                  />
                ) : null}
              </div>
              <Form>
                <FormGroup>
                  <Label>
                    <IntlMessages id="sidebar.pairConfiguration.list.lable.marketName" />
                  </Label>
                  <IntlMessages id="trading.pairconfig.placeholder.marketname">
                    {(placeholder) =>
                      <Input type="text"
                        name="marketName"
                        value={addNewPairDetails.marketName}
                        onChange={e =>
                          this.onChangeAddNewPairForm("marketName", e.target.value)
                        }
                        placeholder={placeholder} >
                      </Input>
                    }
                  </IntlMessages>
                  {this.state.errors.marketName && (
                    <span className="text-danger">
                      <IntlMessages id={this.state.errors.marketName} />
                    </span>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>
                    <IntlMessages id="sidebar.pairConfiguration.list.lable.currency" />
                  </Label>
                  {!editNewPairConfigurationForm ? (
                    <Input
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

                      {marketCurrencyList.map((item, key) => (
                        <option
                          value={item.CurrencyName}
                          key={key}
                        >
                          {item.CurrencyName}
                        </option>
                      ))}
                    </Input>
                  ) : (
                      <Input
                        type="select"
                        name="marketCurrency"
                        value={addNewPairDetails.marketCurrency}
                        onChange={e => this.onChangeMarketCurrency(e)}
                      >

                        {marketCurrencyList.map((item, key) => (
                          <option
                            value={item.CurrencyName}
                            key={key}
                          >
                            {item.CurrencyName}
                          </option>
                        ))}
                      </Input>
                    )}

                </FormGroup>
                <FormGroup>
                  <Label>
                    <IntlMessages id="sidebar.pairConfiguration.list.lable.pairCurrencies" />
                  </Label>
                  <Input
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

                  {this.state.errors.pairCurrency && (
                    <span className="text-danger">
                      <IntlMessages id={this.state.errors.pairCurrency} />
                    </span>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>
                    <IntlMessages id="sidebar.pairConfiguration.list.lable.defaultRate" />
                  </Label>
                  <IntlMessages id="trading.pairconfig.placeholder.defaultrate">
                    {(placeholder) =>
                      <Input type="text"
                        name="defaultRate"
                        value={addNewPairDetails.defaultRate}
                        onChange={this.checkNumericFields}
                        placeholder={placeholder} ></Input>
                    }
                  </IntlMessages>
                  {this.state.errors.defaultRate && (
                    <span className="text-danger">
                      <IntlMessages id={this.state.errors.defaultRate} />
                    </span>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>
                    <IntlMessages id="trading.pairconfig.placeholder.volume" />
                  </Label>
                  <IntlMessages id="trading.pairconfig.placeholder.volume">
                    {(placeholder) =>
                      <Input
                        type="text"
                        name="volume"
                        value={addNewPairDetails.volume}
                        onChange={this.checkNumericFields}
                        placeholder={placeholder} >
                      </Input>
                    }
                  </IntlMessages>

                </FormGroup>

                <FormGroup>
                  <Label>
                    <IntlMessages id="trading.pairconfig.placeholder.currencyprice" />
                  </Label>
                  <IntlMessages id="trading.pairconfig.placeholder.currencyprice">
                    {(placeholder) =>
                      <Input
                        type="text"
                        name="currencyPrice"
                        value={addNewPairDetails.currencyPrice}
                        onChange={this.checkNumericFields}
                        placeholder={placeholder} >
                      </Input>
                    }
                  </IntlMessages>

                </FormGroup>

                <FormGroup>
                  <Label>
                    <IntlMessages id="sidebar.pairConfiguration.list.lable.buyquentity" />
                  </Label>
                  <div className="row">
                    <div className="col-sm-4">
                      <IntlMessages id="trading.pairconfig.placeholder.buyminqty">
                        {(placeholder) =>
                          <Input
                            type="text"
                            name="buyMinQuantity"
                            value={addNewPairDetails.buyMinQuantity}
                            onChange={this.checkNumericFields}
                            placeholder={placeholder} >
                          </Input>
                        }
                      </IntlMessages>
                    </div>
                    <div className="col-sm-1">{" To "}</div>
                    <div className="col-sm-4">
                      <IntlMessages id="trading.pairconfig.placeholder.buymaxqty">
                        {(placeholder) =>
                          <Input
                            type="text"
                            name="buyMaxQuantity"
                            value={addNewPairDetails.buyMaxQuantity}
                            onChange={this.checkNumericFields}
                            placeholder={placeholder} >
                          </Input>
                        }
                      </IntlMessages>

                    </div>
                  </div>
                </FormGroup>

                <FormGroup>
                  <Label>
                    <IntlMessages id="sidebar.pairConfiguration.list.lable.sellquentity" />
                  </Label>
                  <div className="row">
                    <div className="col-sm-4">
                      <IntlMessages id="trading.pairconfig.placeholder.sellminqty">
                        {(placeholder) =>
                          <Input
                            type="text"
                            name="sellMinQuantity"
                            value={addNewPairDetails.sellMinQuantity}
                            onChange={this.checkNumericFields}
                            placeholder={placeholder} >
                          </Input>
                        }
                      </IntlMessages>
                    </div>
                    <div className="col-sm-1">{" To "}</div>
                    <div className="col-sm-4">
                      <IntlMessages id="trading.pairconfig.placeholder.sellmaxqty">
                        {(placeholder) =>
                          <Input
                            type="text"
                            name="sellMaxQuantity"
                            value={addNewPairDetails.sellMaxQuantity}
                            onChange={this.checkNumericFields}
                            placeholder={placeholder} >
                          </Input>
                        }
                      </IntlMessages>


                    </div>
                  </div>
                </FormGroup>

                <FormGroup>
                  <Label>
                    <IntlMessages id="sidebar.pairConfiguration.list.lable.buyprice" />
                  </Label>
                  <div className="row">
                    <div className="col-sm-4">
                      <IntlMessages id="trading.pairconfig.placeholder.buyminprice">
                        {(placeholder) =>
                          <Input
                            type="text"
                            name="buyMinPrice"
                            value={addNewPairDetails.buyMinPrice}
                            onChange={this.checkNumericFields}
                            placeholder={placeholder} >
                          </Input>
                        }
                      </IntlMessages>

                    </div>
                    <div className="col-sm-1">{" To "}</div>
                    <div className="col-sm-4">
                      <IntlMessages id="trading.pairconfig.placeholder.buymaxprice">
                        {(placeholder) =>
                          <Input
                            type="text"
                            name="buyMaxPrice"
                            value={addNewPairDetails.buyMaxPrice}
                            onChange={this.checkNumericFields}
                            placeholder={placeholder} >
                          </Input>
                        }
                      </IntlMessages>

                    </div>
                  </div>
                </FormGroup>

                <FormGroup>
                  <Label>
                    <IntlMessages id="sidebar.pairConfiguration.list.lable.sellprice" />
                  </Label>
                  <div className="row">
                    <div className="col-sm-4">
                      <IntlMessages id="trading.pairconfig.placeholder.sellminprice">
                        {(placeholder) =>
                          <Input
                            type="text"
                            name="sellMinPrice"
                            value={addNewPairDetails.sellMinPrice}
                            onChange={this.checkNumericFields}
                            placeholder={placeholder} >
                          </Input>
                        }
                      </IntlMessages>
                    </div>
                    <div className="col-sm-1">{" To "}</div>
                    <div className="col-sm-4">
                      <IntlMessages id="trading.pairconfig.placeholder.sellmaxprice">
                        {(placeholder) =>
                          <Input
                            type="text"
                            name="sellMaxPrice"
                            value={addNewPairDetails.sellMaxPrice}
                            onChange={this.checkNumericFields}
                            placeholder={placeholder} >
                          </Input>
                        }
                      </IntlMessages>

                    </div>
                  </div>
                </FormGroup>

                <FormGroup>
                  <Label>
                    Price
                  </Label>
                  <div className="row">
                    <div className="col-sm-4">
                      <IntlMessages id="sidebar.pairConfiguration.list.lable.sellprice">
                        {(placeholder) =>
                          <Input
                            type="text"
                            name="sellPrice"
                            value={addNewPairDetails.sellPrice}
                            onChange={this.checkNumericFields}
                            placeholder={placeholder} >
                          </Input>
                        }
                      </IntlMessages>
                    </div>

                    <div className="col-sm-4">
                      <IntlMessages id="sidebar.pairConfiguration.list.lable.buyprice">
                        {(placeholder) =>
                          <Input
                            type="text"
                            name="buyPrice"
                            value={addNewPairDetails.buyPrice}
                            onChange={this.checkNumericFields}
                            placeholder={placeholder} >
                          </Input>
                        }
                      </IntlMessages>
                    </div>

                  </div>
                </FormGroup>

                <FormGroup>
                  <Label>
                    <IntlMessages id="trading.pairconfig.placeholder.fees" />
                  </Label>
                  <div className="row">
                    <div className="col-sm-4">
                      <IntlMessages id="trading.pairconfig.placeholder.sellfees">
                        {(placeholder) =>
                          <Input
                            type="text"
                            name="sellFees"
                            value={addNewPairDetails.sellFees}
                            onChange={this.checkNumericFields}
                            placeholder={placeholder} >
                          </Input>
                        }
                      </IntlMessages>

                    </div>

                    <div className="col-sm-4">
                      <IntlMessages id="trading.pairconfig.placeholder.buyfees">
                        {(placeholder) =>
                          <Input
                            type="text"
                            name="buyFees"
                            value={addNewPairDetails.buyFees}
                            onChange={this.checkNumericFields}
                            placeholder={placeholder} >
                          </Input>
                        }
                      </IntlMessages>


                    </div>

                  </div>

                </FormGroup>

                <FormGroup>
                  <Label>
                    <IntlMessages id="trading.pairconfig.placeholder.feescurrency" />
                  </Label>
                  <IntlMessages id="trading.pairconfig.placeholder.feescurrency">
                    {(placeholder) =>
                      <Input
                        type="text"
                        name="feesCurrency"
                        value={addNewPairDetails.feesCurrency}
                        onChange={this.checkNumericFields}
                        placeholder={placeholder} >
                      </Input>
                    }
                  </IntlMessages>

                </FormGroup>

                <FormGroup>
                  <Label>
                    <IntlMessages id="sidebar.pairConfiguration.list.lable.trnChargeType" />
                  </Label>
                  <div className="row">
                    <div className="col-sm-4">
                      <FormGroup check className="form-check form-check-inline">
                        <Input
                          type="radio"
                          name="trnChargeType"
                          checked={
                            this.state.addNewPairDetails.trnChargeType === "1"
                          }
                          onChange={e =>
                            this.onChangeAddNewPairForm("trnChargeType", "1")
                          }
                        />{" "}
                        <IntlMessages id="wallet.Percentage" />
                      </FormGroup>
                    </div>
                    <div className="col-sm-4">
                      <FormGroup check className="form-check form-check-inline">
                        <Input
                          type="radio"
                          name="trnChargeType"
                          checked={
                            this.state.addNewPairDetails.trnChargeType === "2"
                          }
                          onChange={e =>
                            this.onChangeAddNewPairForm("trnChargeType", "2")
                          }
                        />{" "}
                        <IntlMessages id="wallet.Fixed" />
                      </FormGroup>
                    </div>
                  </div>
                  {this.state.errors.trnChargeType && (
                    <span className="text-danger">
                      <IntlMessages id={this.state.errors.trnChargeType} />
                    </span>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>
                    <IntlMessages id="sidebar.pairConfiguration.list.lable.openOrderExpiration" />
                  </Label>
                  <Input
                    type="select"
                    name="openOrderExpiration"
                    value={addNewPairDetails.openOrderExpiration}
                    onChange={e =>
                      this.onChangeAddNewPairForm(
                        "openOrderExpiration",
                        e.target.value
                      )
                    }
                  >
                    <IntlMessages id="trading.pairconfig.placeholder.selectdays">
                      {(select) =>
                        <option value="">{select}</option>
                      }
                    </IntlMessages>

                    <option
                      value="1"
                      defaultValue={
                        addNewPairDetails.openOrderExpiration === "1"
                      }
                    >
                      1 Day
                    </option>
                    <option
                      value="2"
                      defaultValue={
                        addNewPairDetails.openOrderExpiration === "2"
                      }
                    >
                      2 Days
                    </option>
                    <option
                      value="3"
                      defaultValue={
                        addNewPairDetails.openOrderExpiration === "3"
                      }
                    >
                      3 Days
                    </option>
                    <option
                      value="5"
                      defaultValue={
                        addNewPairDetails.openOrderExpiration === "5"
                      }
                    >
                      5 Days
                    </option>
                    <option
                      value="10"
                      defaultValue={
                        addNewPairDetails.openOrderExpiration === "10"
                      }
                    >
                      10 Days
                    </option>
                    <option
                      value="15"
                      defaultValue={
                        addNewPairDetails.openOrderExpiration === "15"
                      }
                    >
                      15 Days
                    </option>
                    <option
                      value="30"
                      defaultValue={
                        addNewPairDetails.openOrderExpiration === "30"
                      }
                    >
                      1 Month
                    </option>
                    <option
                      value="45"
                      defaultValue={
                        addNewPairDetails.openOrderExpiration === "45"
                      }
                    >
                      1 1/2 Months
                    </option>
                    <option
                      value="60"
                      defaultValue={
                        addNewPairDetails.openOrderExpiration === "60"
                      }
                    >
                      2 Months
                    </option>
                    <option
                      value="90"
                      defaultValue={
                        addNewPairDetails.openOrderExpiration === "90"
                      }
                    >
                      3 Months
                    </option>
                  </Input>
                  {this.state.errors.openOrderExpiration && (
                    <span className="text-danger">
                      <IntlMessages
                        id={this.state.errors.openOrderExpiration}
                      />
                    </span>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>
                    <IntlMessages id="sidebar.pairConfiguration.list.lable.status" />
                  </Label>
                  <Input
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

                    <IntlMessages id="trading.pairconfig.placeholder.disable">
                      {(select) =>
                        <option value="9">{select}</option>
                      }
                    </IntlMessages>

                    <IntlMessages id="trading.pairconfig.placeholder.active">
                      {(select) =>
                        <option value="0">{select}</option>
                      }
                    </IntlMessages>



                    <IntlMessages id="trading.pairconfig.placeholder.inactive">
                      {(select) =>
                        <option value="1">{select}</option>
                      }
                    </IntlMessages>
                  </Input>
                  {this.state.errors.status && (
                    <span className="text-danger">
                      <IntlMessages id={this.state.errors.status} />
                    </span>
                  )}
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              {!editNewPairConfigurationForm ? (
                <div>
                  <Button
                    variant="raised"
                    color="primary"
                    className="text-white"
                    onClick={() => this.submitPairConfigurationForm()}
                    disabled={this.state.loader}
                  >
                    <IntlMessages id="sidebar.pairConfiguration.button.add" />
                  </Button>{" "}
                  <Button
                    variant="raised"
                    className="btn-danger text-white"
                    onClick={() => this.closeAddPairModal()}
                    disabled={this.state.loader}
                  >
                    <IntlMessages id="sidebar.pairConfiguration.button.cancel" />
                  </Button>
                </div>
              ) : (
                  <div>
                    <Button
                      variant="raised"
                      color="primary"
                      className="text-white"
                      onClick={() => this.edirPairConfigurationForm()}
                      disabled={this.state.loader}
                    >
                      <IntlMessages id="sidebar.pairConfiguration.button.update" />
                    </Button>{" "}
                    <Button
                      variant="raised"
                      className="btn-danger text-white"
                      onClick={() => this.closeAddPairModal()}
                      disabled={this.state.loader}
                    >
                      <IntlMessages id="sidebar.pairConfiguration.button.cancel" />
                    </Button>
                  </div>
                )}
            </ModalFooter>
          </Modal>
        )}
        {deleteNewPairConfigurationForm && (
          <Modal
            isOpen={deleteNewPairConfigurationForm}
          >
            <ModalHeader toggle={() => this.closeDeletePairModal()}>
              <IntlMessages id="sidebar.pairConfiguration.modal.deleteNewPair" />
            </ModalHeader>
            <ModalBody
            >
              <div className="text-center">
                {loader ? (
                  <CircularProgress
                    className="mr-30 mb-10 progress-success"
                    size={40}
                  />
                ) : null}
              </div>
              <div>
                <IntlMessages id="sidebar.pairConfiguration.modal.deleteNewPair.message" />
              </div>
            </ModalBody>
            <ModalFooter>
              <div>
                <Button
                  variant="raised"
                  color="primary"
                  className="text-white"
                  onClick={() => this.confirmDeletePairConfiguration()}
                  disabled={this.state.loader}
                >
                  <IntlMessages id="sidebar.pairConfiguration.button.yes" />
                </Button>{" "}
                <Button
                  variant="raised"
                  className="btn-danger text-white"
                  onClick={() => this.closeDeletePairModal()}
                  disabled={this.state.loader}
                >
                  <IntlMessages id="sidebar.pairConfiguration.button.no" />
                </Button>
              </div>
            </ModalFooter>
          </Modal>
        )}
      </div>
    );
  }
}

class CustomToolbarSelect extends Component {
  deleteMultipleRows() {
    //(this.props.pairConfigurationList) find index and pass into
    var value = [];
    for (var i = 0; i < this.props.selectedRows.data.length; i++) {
      value.push(
        this.props.pairConfigurationList[this.props.selectedRows[i].index]
      );
    }

    var request = { data: value, isDelete: 1 }; // is delete means delete records
    this.props.deletePairConfigurationForm(request);
  }

  activeAll() {
    var value = [];
    for (var i = 0; i < this.props.selectedRows.data.length; i++) {
      value.push(
        this.props.pairConfigurationList[this.props.selectedRows[i].index]
      );
    }

    var request = { data: value, isActive: 1 }; // is active means active selected records
    this.props.deletePairConfigurationForm(request);
  }

  inActiveAll() {
    var value = [];
    for (var i = 0; i < this.props.selectedRows.data.length; i++) {
      value.push(
        this.props.pairConfigurationList[this.props.selectedRows[i].index]
      );
    }

    var request = { data: value, isInActive: 1 }; // is inactive means inactive selected records
    this.props.deletePairConfigurationForm(request);
  }

  render() {
    return (
      <div className={"mt-20 mr-20"}>
        <Tooltip
          title={<IntlMessages id="sidebar.pairConfiguration.tooltip.active" />} disableFocusListener disableTouchListener
        >
          <a href="javascript:void(0)" onClick={() => this.activeAll()}>
            <i className="ti-unlock font-2x" />
          </a>
        </Tooltip>{" "}
        <Tooltip
          title={
            <IntlMessages id="sidebar.pairConfiguration.tooltip.inActive" />
          } disableFocusListener disableTouchListener
        >
          <a href="javascript:void(0)" onClick={() => this.inActiveAll()}>
            <i className="ti-lock font-2x" />
          </a>
        </Tooltip>{" "}
        <Tooltip
          title={<IntlMessages id="sidebar.pairConfiguration.tooltip.delete" />} disableFocusListener disableTouchListener
        >
          <a
            href="javascript:void(0)"
            onClick={() => this.deleteMultipleRows()}
          >
            <i className="ti-trash font-2x" />
          </a>

        </Tooltip>
      </div>
    );
  }
}

const mapStateToProps = ({ pairConfiguration }) => {
  var responce = {
    isPairListFound: pairConfiguration.isPairListFound,
    pairConfigurationList: pairConfiguration.pairConfigurationList,
    marketCurrencyList: pairConfiguration.marketCurrencyList,
    pairCurrencyList: pairConfiguration.pairCurrencyList,
    exchangeList: pairConfiguration.exchangeList,
    loading: pairConfiguration.loading,
    addPairSuccess: pairConfiguration.addPairSuccess,
    editPairSuccess: pairConfiguration.editPairSuccess,
    deletePairSuccess: pairConfiguration.deletePairSuccess,
    error: pairConfiguration.error,
  };

  return responce;
};

export default connect(
  mapStateToProps,
  {
    getPairConfigurationList,
    getMarketCurrencyList,
    getPairCurrencyList,
    getExchangeList,
    submitPairConfigurationForm,
    editPairConfigurationForm,
    deletePairConfigurationForm,
    getMenuPermissionByID
  }
)(PairConfiguration);
