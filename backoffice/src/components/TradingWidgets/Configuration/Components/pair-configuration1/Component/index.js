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

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";
import NotFoundTable from "../../../../../NotFoundTable/notFoundTable";
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

// import validation functions
import {
  validatePairConfigurationRequest,
  validateOnlyNumeric
} from "../../../../../../validation/pairConfiguration";

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
      //exchange: "",
    },
    deleteRecordDetail: {},
    successMessage: "",
    errors: "",
    loader: false
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
        //exchange: "",
      },
      loader: true,
      errors: {}
    });

    this.getBasicFormDetail();
  }

  async getBasicFormDetail() {
    await this.props.getMarketCurrencyList({});
    await this.props.getPairCurrencyList({});
    //await this.props.getExchangeList({});

    this.setState({ loader: false });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPairListFound >= 0) {
      this.setState({ loader: false });
    }

    if (nextProps.pairConfigurationList) {
      this.setState({ pairConfigurationList: nextProps.pairConfigurationList });
    }

    if (nextProps.marketCurrencyList) {
      this.setState({ marketCurrencyList: nextProps.marketCurrencyList });
    }

    if (nextProps.pairCurrencyList) {
      this.setState({ pairCurrencyList: nextProps.pairCurrencyList });
    }

    // if(nextProps.exchangeList) {
    //   this.setState({exchangeList:nextProps.exchangeList});
    // }

    if (nextProps.addPairSuccess >= 0) {
      this.setState({
        addNewPairConfigurationForm: false,
        addNewPairDetails: {
          marketName: "",
          marketCurrency: [],
          pairCurrency: "",
          status: ""
          //exchange: "",
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
          //exchange: "",
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
    //this.props.getPairConfigurationList({});
  }

  // start code for add process
  submitPairConfigurationForm() {
    const { errors, isValid } = validatePairConfigurationRequest(
      this.state.addNewPairDetails
    );
    this.setState({ errors: errors });

    if (isValid) {
      this.setState({ loader: true });
      this.props.editPairConfigurationForm(this.state.addNewPairDetails);
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
        //exchange: "",
      },
      loader: false,
      errors: {}
    });
  }

  // end

  // start code for edit process
  onEditPairConfiguration(selectedData) {
    this.setState({
      addNewPairConfigurationForm: true,
      editNewPairConfigurationForm: true,
      addNewPairDetails: {
        marketName: selectedData.marketName,
        marketCurrency: selectedData.currency,
        pairCurrency: selectedData.pairCurrency,
        defaultRate: selectedData.defaultRate,
        minQuantity: selectedData.minQuantity,
        maxQuantity: selectedData.maxQuantity,
        minPrice: selectedData.minPrice,
        maxPrice: selectedData.maxPrice,
        minOpenQuantity: selectedData.minOpenQuantity,
        maxOpenQuantity: selectedData.maxOpenQuantity,
        trnChargeType: selectedData.trnChargeType,
        trnCharge: selectedData.trnCharge,
        openOrderExpiration: selectedData.openOrderExpiration,
        status: selectedData.status,
        //exchange: selectedData.exchange,
        ID: selectedData.recordID
      },
      loader: true,
      errors: {}
    });

    this.getBasicFormDetail();
  }

  edirPairConfigurationForm() {
    const { errors, isValid } = validatePairConfigurationRequest(
      this.state.addNewPairDetails
    );
    this.setState({ errors: errors });

    if (isValid) {
      this.setState({ loader: true });
      this.props.editPairConfigurationForm(this.state.addNewPairDetails);
    }
  }

  onChangeMarketCurrency(e) {
    var options = e.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }

    this.setState({
      addNewPairDetails: {
        ...this.state.addNewPairDetails,
        marketCurrency: value
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
      exchangeList,
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
          <IntlMessages id="sidebar.pairConfiguration.list.lable.quantity" />
        ),
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="sidebar.pairConfiguration.list.lable.price" />,
        options: { sort: true, filter: true }
      },
      // {
      //   name: <IntlMessages id="sidebar.pairConfiguration.list.lable.openQuantity" />,
      //   options: { sort: true, filter: true }
      // },
      {
        name: (
          <IntlMessages id="sidebar.pairConfiguration.list.lable.trnCharge" />
        ),
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="sidebar.pairConfiguration.list.lable.status" />,
        options: { sort: true, filter: true }
      } /* ,
      {
        name: <IntlMessages id="sidebar.pairConfiguration.list.lable.exchange" />,
        options: { sort: true, filter: true }
      } */,
      {
        name: <IntlMessages id="sidebar.pairConfiguration.list.lable.action" />,
        options: { sort: false, filter: false }
      }
    ];

    const options = {
      filterType: "dropdown",
      responsive: "scroll",
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
        {/* {this.state.loader && <JbsSectionLoader />} */}
        {/* <div className="mb-10">
          <Button
            variant="raised"
            color="primary"
            className="text-white"
            onClick={() => this.addNewPairConfiguration()}
          >
            <IntlMessages id="button.addNew" />
          </Button>
        </div> */}
        <div className="StackingHistory">
        {pairConfigurationList.length !== 0 ? (
          <MUIDataTable
            title={this.props.title}
            data={pairConfigurationList.map((pairDetail, key) => {
              return [
                key + 1,
                pairDetail.marketName,
                pairDetail.currency + "-" + pairDetail.pairCurrency,
                pairDetail.defaultRate,
                pairDetail.minQuantity + "-" + pairDetail.maxQuantity,
                pairDetail.minPrice + "-" + pairDetail.maxPrice,
                //pairDetail.minOpenQuantity + "-" + pairDetail.maxOpenQuantity,
                pairDetail.trnCharge +
                  (pairDetail.trnChargeType == 1 ? "%" : ""),
                pairDetail.status,
                //pairDetail.exchange,
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
            //toggle={() => this.closeAddPairModal()}
          >
            <ModalHeader toggle={() => this.closeAddPairModal()}>
              {addNewPairConfigurationForm ? (
                <IntlMessages id="sidebar.pairConfiguration.modal.addNewPair" />
              ) : (
                <IntlMessages id="sidebar.pairConfiguration.modal.editPairConfiguration" />
              )}
            </ModalHeader>
            <ModalBody /* style={{
                "max-height": "calc(100vh - 210px)",
                "overflow-y": "auto"
              }} */
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
                  <Input
                    type="text"
                    name="marketName"
                    value={addNewPairDetails.marketName}
                    placeholder="Market Name"
                    onChange={e =>
                      this.onChangeAddNewPairForm("marketName", e.target.value)
                    }
                  />
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
                      multiple
                      type="select"
                      name="marketCurrency"
                      value={addNewPairDetails.marketCurrency}
                      onChange={e => this.onChangeMarketCurrency(e)}
                    >
                      {/* <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="XRP">XRP</option> */}
                      {marketCurrencyList.map((item, key) => (
                        <option
                          value={item.currency}
                          key={key}
                          defaultValue={
                            addNewPairDetails.marketCurrency.findIndex(
                              currency => currency === item.currency
                            ) !== -1
                              ? true
                              : false
                          }
                        >
                          {item.currency}
                        </option>
                      ))}
                    </Input>
                  ) : (
                    <Input
                      type="select"
                      name="marketCurrency"
                      value={addNewPairDetails.marketCurrency}
                      onChange={e =>
                        this.onChangeAddNewPairForm(
                          "marketCurrency",
                          e.target.value
                        )
                      }
                    >
                      {/* <option value="BTC">BTC</option>
                      <option value="ETH">ETH</option>
                      <option value="XRP">XRP</option> */}
                      {marketCurrencyList.map((item, key) => (
                        <option
                          value={item.currency}
                          key={key}
                          defaultValue={
                            item.currency === addNewPairDetails.marketCurrency
                              ? true
                              : false
                          }
                        >
                          {item.currency}
                        </option>
                      ))}
                    </Input>
                  )}
                  {this.state.errors.marketCurrency && (
                    <span className="text-danger">
                      <IntlMessages id={this.state.errors.marketCurrency} />
                    </span>
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
                    onChange={e =>
                      this.onChangeAddNewPairForm(
                        "pairCurrency",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Please Select Currency</option>
                    {/* <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="XRP">XRP</option> */}
                    {pairCurrencyList.map((item, key) => (
                      <option
                        value={item.pairCurrency}
                        key={key}
                        defaultValue={
                          item.pairCurrency === addNewPairDetails.pairCurrency
                            ? true
                            : false
                        }
                      >
                        {item.currency}
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
                  <Input
                    type="text"
                    name="defaultRate"
                    value={addNewPairDetails.defaultRate}
                    onChange={this.checkNumericFields}
                    placeholder="Default Rate"
                    // onChange={e =>
                    //   this.checkNumericFields(
                    //     "defaultRate",
                    //     e.target.value
                    //   )
                    // }
                  />
                  {this.state.errors.defaultRate && (
                    <span className="text-danger">
                      <IntlMessages id={this.state.errors.defaultRate} />
                    </span>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>
                    <IntlMessages id="sidebar.pairConfiguration.list.lable.quantity" />
                  </Label>
                  <div className="row">
                    <div className="col-sm-4">
                      <Input
                        type="text"
                        name="minQuantity"
                        value={addNewPairDetails.minQuantity}
                        placeholder="Min Qty."
                        onChange={this.checkNumericFields}
                        // onChange={e =>
                        //   this.checkNumericFields(
                        //     "minQuantity",
                        //     e.target.value
                        //   )
                        // }
                      />
                    </div>
                    <div className="col-sm-1">{" To "}</div>
                    <div className="col-sm-4">
                      <Input
                        type="text"
                        name="maxQuantity"
                        value={addNewPairDetails.maxQuantity}
                        placeholder="Max Qty."
                        onChange={this.checkNumericFields}
                        // onChange={e =>
                        //   this.checkNumericFields(
                        //     "maxQuantity",
                        //     e.target.value
                        //   )
                        // }
                      />
                    </div>
                  </div>
                  {this.state.errors.quantity && (
                    <span className="text-danger">
                      <IntlMessages id={this.state.errors.quantity} />
                    </span>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>
                    <IntlMessages id="sidebar.pairConfiguration.list.lable.price" />
                  </Label>
                  <div className="row">
                    <div className="col-sm-4">
                      <Input
                        type="text"
                        name="minPrice"
                        value={addNewPairDetails.minPrice}
                        placeholder="Min Price"
                        onChange={this.checkNumericFields}
                        // onChange={e =>
                        //   this.checkNumericFields(
                        //     "minPrice",
                        //     e.target.value
                        //   )
                        // }
                      />
                    </div>
                    <div className="col-sm-1">{" To "}</div>
                    <div className="col-sm-4">
                      <Input
                        type="text"
                        name="maxPrice"
                        value={addNewPairDetails.maxPrice}
                        placeholder="Max Price"
                        onChange={this.checkNumericFields}
                        // onChange={e =>
                        //   this.checkNumericFields(
                        //     "maxPrice",
                        //     e.target.value
                        //   )
                        // }
                      />
                    </div>
                  </div>
                  {this.state.errors.price && (
                    <span className="text-danger">
                      <IntlMessages id={this.state.errors.price} />
                    </span>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>
                    <IntlMessages id="sidebar.pairConfiguration.list.lable.openQuantity" />
                  </Label>
                  <div className="row">
                    <div className="col-sm-4">
                      <Input
                        type="text"
                        name="minOpenQuantity"
                        value={addNewPairDetails.minOpenQuantity}
                        placeholder="Min Open Qty."
                        onChange={this.checkNumericFields}
                        // onChange={e =>
                        //   this.checkNumericFields(
                        //     "minOpenQuantity",
                        //     e.target.value
                        //   )
                        // }
                      />
                    </div>
                    <div className="col-sm-1">{" To "}</div>
                    <div className="col-sm-4">
                      <Input
                        type="text"
                        name="maxOpenQuantity"
                        value={addNewPairDetails.maxOpenQuantity}
                        placeholder="Max Open Qty."
                        onChange={this.checkNumericFields}
                        // onChange={e =>
                        //   this.checkNumericFields(
                        //     "maxOpenQuantity",
                        //     e.target.value
                        //   )
                        // }
                      />
                    </div>
                  </div>
                  {this.state.errors.openQuantity && (
                    <span className="text-danger">
                      <IntlMessages id={this.state.errors.openQuantity} />
                    </span>
                  )}
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
                        Percentage
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
                        Fixed
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
                    <IntlMessages id="sidebar.pairConfiguration.list.lable.trnCharge" />
                  </Label>
                  <Input
                    type="text"
                    name="trnCharge"
                    value={addNewPairDetails.trnCharge}
                    placeholder="Transaction Charge"
                    onChange={this.checkNumericFields}
                    // onChange={e =>
                    //   this.checkNumericFields(
                    //     "trnCharge",
                    //     e.target.value
                    //   )
                    // }
                  />
                  {this.state.errors.trnCharge && (
                    <span className="text-danger">
                      <IntlMessages id={this.state.errors.trnCharge} />
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
                    <option value="">Please Select Days</option>
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
                    <option value="">Please Select Status</option>
                    <option
                      defaultValue={
                        "Active" === addNewPairDetails.status ? true : false
                      }
                      value="Active"
                    >
                      Active
                    </option>
                    <option
                      defaultValue={
                        "InActive" === addNewPairDetails.status ? true : false
                      }
                      value="InActive"
                    >
                      InActive
                    </option>
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
            //toggle={() => this.closeAddPairModal()}
          >
            <ModalHeader toggle={() => this.closeDeletePairModal()}>
              <IntlMessages id="sidebar.pairConfiguration.modal.deleteNewPair" />
            </ModalHeader>
            <ModalBody /* style={{
                "max-height": "calc(100vh - 210px)",
                "overflow-y": "auto"
              }} */
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
    // console.log(this.props);
    const { drawerClose } = this.props;

    return (
      <div className={"mt-20 mr-20"}>


        {/* <Tooltip title={"icon 2"}>
          <IconButton className={classes.iconButton} onClick={this.handleClick}>
            <FilterIcon className={classes.deleteIcon} />
          </IconButton>
        </Tooltip> */}
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
          }
          disableFocusListener disableTouchListener
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
          {/* <Button
              variant="raised"
              className="btn-danger text-white"
              onClick={() => this.deleteMultipleRows()}
            >
            <IntlMessages id="sidebar.pairConfiguration.button.cancel" />
            </Button> */}
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
    deletePairSuccess: pairConfiguration.deletePairSuccess
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
    deletePairConfigurationForm
  }
)(PairConfiguration);

