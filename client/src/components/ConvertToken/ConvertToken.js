import React from "react";
import { connect } from "react-redux";
// Import component for internationalization
import IntlMessages from "Util/IntlMessages";
// import component for Card Design
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import Slide from "@material-ui/core/Slide";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

import {
  getConvertTokenInfo,
  submitConvertTokenRequest
} from "Actions/ConvertToken";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}
// add validation
const validateConvertTokenRequest = require("../../validation/ConvertToken/ConvertToken");

// class For Display token convert component
class ConvertToken extends React.Component {
  state = {
    errors: {},
    totalBalance: 10.1001,
    formCurrency: "",
    toCurrency: "",
    amount: "",
    address: "",
    price: "10",
    selectedCurreny: {}
  };

  componentWillMount() {
    this.props.getConvertTokenInfo();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onChangeFromCurreny(e) {
    e.preventDefault();
    this.setState({
      formCurrency: e.target.value,
      selectedCurreny: this.props.fromCurrency[e.target.value]
    });
  }

  onChangeToCurreny(e) {
    e.preventDefault();
    this.setState({ toCurrency: e.target.value });
  }

  handleChangeSelect(e) {
    e.preventDefault();
    this.setState({ address: e.target.value });
  }

  onSubmit(event) {
    event.preventDefault();
    const postData = {
      fromCurrency: this.state.selectedCurreny.name,
      toCurrency: this.state.toCurrency,
      amount: this.state.amount,
      price: this.state.price,
      address: this.state.address
    };
    const { errors, isValid } = validateConvertTokenRequest(postData);
    this.setState({ errors: errors });

    if (isValid) {
      this.props.submitConvertTokenRequest(postData);
    }
  }

  render() {
    const { errors } = this.state;
    return (
      <JbsCollapsibleCard
        colClasses="col-sm-12 col-md-12 col-xl-6"
        heading=""
        fullBlock
      >
        <div className="d-block p-30">
          <Form>
            <FormGroup>
              <Input
                type="select"
                name="toCurrency"
                id="toCurrency"
                onChange={e => this.onChangeToCurreny(e)}
                value={this.state.toCurrency}
              >
                <option value="">
                  {<IntlMessages id="wallet.CTChooseToCurreny" />}
                </option>
                {this.props.buyCurrency.map((item, key) => (
                  <option key={key}>{item.name}</option>
                ))}
                {errors.toCurrency && (
                  <span className="text-danger">
                    <IntlMessages id={errors.toCurrency} />
                  </span>
                )}
              </Input>
            </FormGroup>
            <FormGroup>
              <Input
                type="select"
                name="formCurrency"
                id="formCurrency"
                onChange={e => this.onChangeFromCurreny(e)}
                value={this.state.formCurrency}
              >
                <option value="">
                  {<IntlMessages id="wallet.CTChooseFromCurreny" />}
                </option>
                {this.props.fromCurrency.map((item, key) => (
                  <option key={key} value={key}>
                    {item.name}
                  </option>
                ))}
                {errors.fromCurrency && (
                  <span className="text-danger">
                    <IntlMessages id={errors.fromCurrency} />
                  </span>
                )}
              </Input>
            </FormGroup>
            {this.state.formCurrency !== "" &&
              this.state.toCurrency !== "" && (
                <FormGroup className="mb-0">
                  <Label className="d-flex px-20">
                    <span className="w-30">
                      {<IntlMessages id="wallet.CTAvailableBalance" />}
                    </span>
                    {this.state.selectedCurreny.balance +
                      " " +
                      this.state.selectedCurreny.name}
                  </Label>
                </FormGroup>
              )}
          </Form>
        </div>

        {this.state.formCurrency !== "" &&
          this.state.toCurrency !== "" && (
            <JbsCollapsibleCard
              colClasses="col-sm-12 col-md-12 col-xl-12 pl-30 pr-30"
              fullBlock
            >
              <div className="col-sm-12 col-md-12 col-xl-12 p-30">
                <div className="lazy-up">
                  <div className=" col-sm-12 col-md-12 col-xl-12 p-0">
                    <Form>
                      <FormGroup>
                        <Input
                          type="text"
                          name="amount"
                          id="amount"
                          placeholder={this.state.toCurrency + " Amount"}
                          value={this.state.amount}
                          onChange={e => this.onChange(e)}
                        />
                        {errors.amount && (
                          <span className="text-danger">
                            <IntlMessages id={errors.amount} />
                          </span>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label className="d-flex px-20">
                          <span className="w-30">
                            {this.state.selectedCurreny.name}{" "}
                            {<IntlMessages id="wallet.CTPrice" />} :{" "}
                          </span>
                          {this.state.selectedCurreny.price}
                        </Label>
                      </FormGroup>
                      <FormGroup>
                        <Input
                          type="select"
                          name="address"
                          id="address"
                          onChange={e => this.handleChangeSelect(e)}
                          value={this.state.address}
                        >
                          <option value="">
                            {<IntlMessages id="wallet.CTChooseAddress" />}
                          </option>
                          {this.state.selectedCurreny.addresses.map(
                            (item, key) => (
                              <option key={key} value={item}>
                                {item}
                              </option>
                            )
                          )}
                        </Input>
                        {errors.address && (
                          <span className="text-danger">
                            <IntlMessages id={errors.address} />
                          </span>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label className="d-flex px-20">
                          <span className="w-30">
                            {<IntlMessages id="wallet.CTTotal" />}{" "}
                            {this.state.selectedCurreny.name} :{" "}
                          </span>
                          {this.state.selectedCurreny.price * this.state.amount}
                        </Label>
                      </FormGroup>
                      <FormGroup className="mb-0">
                        <div className="col-sm-12 col-md-12 col-xl-12 mt-30 p-0">
                          <Button
                            color="primary"
                            className="border-0 rounded-0"
                            onClick={e => this.onSubmit(e)}
                          >
                            <IntlMessages id="button.submit" />
                          </Button>
                        </div>
                      </FormGroup>
                    </Form>
                  </div>
                </div>
              </div>
            </JbsCollapsibleCard>
          )}
      </JbsCollapsibleCard>
    );
  }
}

const mapDispatchToProps = ({ convertTokenInfo }) => {
  const { showLoading, buyCurrency, fromCurrency } = convertTokenInfo;
  return { showLoading, buyCurrency, fromCurrency };
};

export default connect(
  mapDispatchToProps,
  {
    getConvertTokenInfo,
    submitConvertTokenRequest
  }
)(ConvertToken);
