/* 
    Developer : Nishant Vadgama
    Date : 29-08-2018
    File Comment : Trade Fee & LImit configuration Component
*/
import React from "react";
import IntlMessages from "Util/IntlMessages";
import validator from "validator";
import Chip from "@material-ui/core/Chip";
import { FormGroup, Label, Input, Button } from "reactstrap";
class TradeFeeAndLimit extends React.Component {
  state = this.props.data;
  getData() {
    return this.state;
  }
  addNewLimitColumn() {
    /* check if already submited and error object has been created */
    if (this.state.isSubmitted) {
      const tempErrors = Object.assign([], this.state.errors);
      const tempObj = {};
      tempErrors.limits.push(tempObj);
      this.setState({ errors: tempErrors });
    }
    let newObj = {
      type: "",
      min_amount: "",
      max_amount: ""
    };
    this.setState({ limits: this.state.limits.concat(newObj) });
  }
  addNewFeeColumn() {
    /* check if already submited and error object has been created */
    if (this.state.isSubmitted) {
      const tempErrors = Object.assign([], this.state.errors);
      const tempObj = {};
      tempErrors.fees.push(tempObj);
      this.setState({ errors: tempErrors });
    }
    let newObj = {
      from: "",
      to: "",
      amount: ""
    };
    this.setState({ fees: this.state.fees.concat(newObj) });
  }
  applyToAllCoins(e) {
    if (e.target.checked) {
      let pairs = [
        "BTC/ETH",
        "LMX/ETH",
        "ETH/ETH",
        "FUN/ETH",
        "CVC/ETH",
        "BCH/ETH",
        "UNQ/ETH"
      ];
      this.setState({ pairs: pairs });
    } else {
      this.setState({ pairs: [] });
    }
  }
  onChangeAmount(e, index) {
    if (
      validator.isDecimal(e.target.value, {
        force_decimal: false,
        decimal_digits: "0,8"
      }) ||
      validator.isNumeric(e.target.value)
    ) {
      let tempFees = Object.assign([], this.state.fees);
      tempFees[index][e.target.name] = e.target.value;
      this.setState({ fees: tempFees });
    }
  }
  onChangeLimitType(e, index) {
    let tempLimits = Object.assign([], this.state.limits);
    tempLimits[index].type = e.target.value;
    this.setState({ limits: tempLimits });
  }
  onChangeMinAmount(e, index) {
    if (
      validator.isDecimal(e.target.value, {
        force_decimal: false,
        decimal_digits: "0,8"
      }) ||
      validator.isNumeric(e.target.value)
    ) {
      let tempLimits = Object.assign([], this.state.limits);
      tempLimits[index].min_amount = e.target.value;
      this.setState({ limits: tempLimits });
    }
  }
  onChangeMaxAmount(e, index) {
    if (
      validator.isDecimal(e.target.value, {
        force_decimal: false,
        decimal_digits: "0,8"
      }) ||
      validator.isNumeric(e.target.value)
    ) {
      let tempLimits = Object.assign([], this.state.limits);
      tempLimits[index].max_amount = e.target.value;
      this.setState({ limits: tempLimits });
    }
  }
  render() {
    const pairs = [
      { name: "BTC/ETH" },
      { name: "LMX/ETH" },
      { name: "ETH/ETH" },
      { name: "FUN/ETH" },
      { name: "CVC/ETH" },
      { name: "UNQ/ETH" },
      { name: "BCH/ETH" }
    ];
    return (
      <div className="col-xs-12 col-sm-12 col-md-12">
        <FormGroup className="">
          <h3 className="font-weight-bold">
            <IntlMessages id="wallet.patternFee" />
          </h3>
        </FormGroup>
        <FormGroup className="d-flex">
          <Label className="w-30 text-muted">
            <IntlMessages id="wallet.patternFeeType" />
          </Label>
          <Input
            className="w-70"
            type="select"
            name="tradeFeeType"
            id="tradeFeeType"
            value={this.state.tradeFeeType}
            onChange={e => this.setState({ tradeFeeType: e.target.value })}
          >
            <option>Fixed</option>
            <option>Percentage</option>
          </Input>
          {this.state.errors.name && (
            <span className="text-danger">
              {" "}
              <IntlMessages id={this.state.errors.name} />
            </span>
          )}
        </FormGroup>
        <FormGroup className="d-flex">
          <Label className="w-30 text-muted">
            <IntlMessages id="wallet.feeRange" />
          </Label>
          <Input
            className="w-70"
            type="select"
            name="tradeFeeRange"
            id="tradeFeeRange"
            value={this.state.tradeFeeRange}
            onChange={e => this.setState({ tradeFeeRange: e.target.value })}
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </Input>
          {this.state.errors.name && (
            <span className="text-danger">
              {" "}
              <IntlMessages id={this.state.errors.name} />
            </span>
          )}
        </FormGroup>
        {this.state.tradeFeeRange == "No" && (
          <FormGroup
            className={
              "d-flex " + (this.state.errors.tradeFeeAmount ? "mb-0" : "")
            }
          >
            <Label className="w-30 text-muted">
              <IntlMessages id="wallet.feeAmount" />
            </Label>
            <Input
              className="w-70"
              type="text"
              name="tradeFeeAmount"
              value={this.state.tradeFeeAmount}
              onChange={e =>
                validator.isDecimal(e.target.value, {
                  force_decimal: false,
                  decimal_digits: "0,8"
                }) || validator.isNumeric(e.target.value)
                  ? this.setState({ tradeFeeAmount: e.target.value })
                  : ""
              }
            />
          </FormGroup>
        )}
        {this.state.tradeFeeRange == "No" &&
          this.state.errors.tradeFeeAmount && (
            <FormGroup className="d-flex">
              <Label className="w-30" />
              <Label className="w-70">
                <span className="text-danger">
                  {" "}
                  <IntlMessages id={this.state.errors.tradeFeeAmount} />
                </span>
              </Label>
            </FormGroup>
          )}
        {this.state.tradeFeeRange == "Yes" && (
          <div className="activity-board-wrapper">
            <div className="comment-box mb-4 p-20">
              {this.state.fees.map((fee, index) => (
                <div
                  className="col-xs-12 col-sm-12 col-md-12 justify-content-between d-inline-block"
                  key={index}
                >
                  <FormGroup className="col-sm-3 col-md-3 d-inline-block">
                    <Label className="">
                      <IntlMessages id="wallet.tradeFrom" />
                    </Label>
                    <Input
                      className=""
                      type="text"
                      name="from"
                      value={this.state.fees[index].from}
                      onChange={e => this.onChangeAmount(e, index)}
                    />
                    {this.state.errors.fees &&
                      this.state.errors.fees[index].from && (
                        <span className="text-danger">
                          {" "}
                          <IntlMessages
                            id={this.state.errors.fees[index].from}
                          />
                        </span>
                      )}
                  </FormGroup>
                  <FormGroup className="col-sm-3 col-md-3 d-inline-block">
                    <Label className="">
                      <IntlMessages id="wallet.tradeTo" />
                    </Label>
                    <Input
                      className=""
                      type="text"
                      name="to"
                      value={this.state.fees[index].to}
                      onChange={e => this.onChangeAmount(e, index)}
                    />
                    {this.state.errors.fees &&
                      this.state.errors.fees[index].to && (
                        <span className="text-danger">
                          {" "}
                          <IntlMessages id={this.state.errors.fees[index].to} />
                        </span>
                      )}
                  </FormGroup>
                  <FormGroup className="col-sm-3 col-md-3 d-inline-block">
                    <Label className="">
                      <IntlMessages id="wallet.feeAmount" />
                    </Label>
                    <Input
                      className=""
                      type="text"
                      name="amount"
                      value={this.state.fees[index].amount}
                      onChange={e => this.onChangeAmount(e, index)}
                    />
                    {this.state.errors.fees &&
                      this.state.errors.fees[index].amount && (
                        <span className="text-danger">
                          {" "}
                          <IntlMessages
                            id={this.state.errors.fees[index].amount}
                          />
                        </span>
                      )}
                  </FormGroup>
                  <FormGroup className="col-sm-3 col-md-3 d-inline-block">
                    <a
                      className="font-2x"
                      href="javascript:void(0)"
                      onClick={e =>
                        this.setState({
                          fees: this.state.fees.filter((_, i) => i !== index)
                        })
                      }
                    >
                      <i className="zmdi zmdi-delete"></i>
                    </a>
                  </FormGroup>
                </div>
              ))}
              <div className="col-xs-12 col-sm-12 col-md-12 justify-content-end d-inline-block ml-15">
                <Button
                  size="small"
                  className=""
                  color="primary"
                  onClick={e => this.addNewFeeColumn()}
                >
                  <IntlMessages id="wallet.btnAddRange" />
                </Button>
              </div>
            </div>
          </div>
        )}
        <FormGroup className="">
          <h3 className="font-weight-bold">
            <IntlMessages id="wallet.feeLimit" />
          </h3>
        </FormGroup>
        <div className="activity-board-wrapper">
          <div className="comment-box mb-4 p-20">
            {this.state.limits.map((limit, index) => (
              <div
                className="col-xs-12 col-sm-12 col-md-12 justify-content-between d-inline-block"
                key={index}
              >
                <FormGroup className="col-sm-3 col-md-3 d-inline-block">
                  <Label className="">
                    <IntlMessages id="wallet.limitType" />
                  </Label>
                  <Input
                    className=""
                    type="select"
                    name={"limitType" + index}
                    id={"limitType" + index}
                    onChange={e => this.onChangeLimitType(e, index)}
                  >
                    <option value="Per Transaction">Per Transaction</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quaterly">Quaterly</option>
                    <option value="Yearly">Yearly</option>
                  </Input>
                  {this.state.errors.limits &&
                    this.state.errors.limits[index].limitType && (
                      <span className="text-danger">
                        {" "}
                        <IntlMessages
                          id={this.state.errors.limits[index].limitType}
                        />
                      </span>
                    )}
                </FormGroup>
                <FormGroup className="col-sm-3 col-md-3 d-inline-block">
                  <Label className="">
                    <IntlMessages id="wallet.minTraAmount" />
                  </Label>
                  <Input
                    className=""
                    type="text"
                    name={"minTraAmount" + index}
                    value={this.state.limits[index].min_amount}
                    onChange={e => this.onChangeMinAmount(e, index)}
                  />
                  {this.state.errors.limits &&
                    this.state.errors.limits[index].minTraAmount && (
                      <span className="text-danger">
                        {" "}
                        <IntlMessages
                          id={this.state.errors.limits[index].minTraAmount}
                        />
                      </span>
                    )}
                </FormGroup>
                <FormGroup className="col-sm-3 col-md-3 d-inline-block">
                  <Label className="">
                    <IntlMessages id="wallet.maxTraAmount" />
                  </Label>
                  <Input
                    className=""
                    type="text"
                    name={"maxTraAmount" + index}
                    value={this.state.limits[index].max_amount}
                    onChange={e => this.onChangeMaxAmount(e, index)}
                  />
                  {this.state.errors.limits &&
                    this.state.errors.limits[index].maxTraAmount && (
                      <span className="text-danger">
                        {" "}
                        <IntlMessages
                          id={this.state.errors.limits[index].maxTraAmount}
                        />
                      </span>
                    )}
                </FormGroup>
                <FormGroup className="col-sm-3 col-md-3 d-inline-block">
                  <a
                    className="font-2x"
                    href="javascript:void(0)"
                    onClick={e =>
                      this.setState({
                        limits: this.state.limits.filter((_, i) => i !== index)
                      })
                    }
                  >
                    <i className="zmdi zmdi-delete"></i>
                  </a>
                </FormGroup>
              </div>
            ))}
            <div className="col-xs-12 col-sm-12 col-md-12 justify-content-end d-inline-block ml-15">
              <Button
                size="small"
                className=""
                color="primary"
                onClick={e => this.addNewLimitColumn()}
              >
                <IntlMessages id="wallet.btnAddLimit" />
              </Button>
            </div>
          </div>
        </div>
        <FormGroup className="">
          <h3 className="font-weight-bold">
            <IntlMessages id="wallet.applyToPairs" />
          </h3>
        </FormGroup>
        <FormGroup className="">
          {this.state.pairs.map((pair, key) => (
            <Chip
              className="bg-skype text-white mr-10 mb-10"
              key={key}
              label={pair}
              onDelete={e =>
                this.setState({
                  pairs: this.state.pairs.filter((_, i) => i !== key)
                })
              }
            />
          ))}
        </FormGroup>
        <div className="d-flex justify-content-between mb-5">
          <p className="mb-0 text-muted">
            <IntlMessages id="wallet.pairNotice" />
          </p>
          <FormGroup className="mb-0">
            <Label check className="text-muted">
              <Input
                className=""
                type="checkbox"
                name="applyToAll"
                onClick={e => this.applyToAllCoins(e)}
              />
              <IntlMessages id="wallet.applyToAll" />
            </Label>
          </FormGroup>
        </div>
        <div className="border p-20 d-block">
          {pairs.map(
            (value, key) =>
              this.state.pairs.indexOf(value.name) == -1 ? (
                <Button
                  key={key}
                  size="small"
                  className="btn-outline-secondary mr-5 mb-5"
                  color="primary"
                  onClick={e =>
                    this.setState({
                      pairs: this.state.pairs.concat(value.name)
                    })
                  }
                >
                  {value.name}
                </Button>
              ) : (
                ""
              )
          )}
        </div>
      </div>
    );
  }
}
export default TradeFeeAndLimit;
