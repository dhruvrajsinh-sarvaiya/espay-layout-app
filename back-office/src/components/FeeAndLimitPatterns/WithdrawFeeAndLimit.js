/* 
    Developer : Nishant Vadgama
    Date : 29-08-2018
    File Comment : Withdraw Fee & LImit configuration Component
*/
import React from "react";
import IntlMessages from "Util/IntlMessages";
import validator from "validator";
import Chip from "@material-ui/core/Chip";
import { FormGroup, Label, Input, Button } from "reactstrap";
class WithdrawFeeAndLimit extends React.Component {
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
      let coin = ["BTC", "LMX", "ETH", "FUN", "CVC", "BCH", "UNQ"];
      this.setState({ coins: coin });
    } else {
      this.setState({ coins: [] });
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
    const coin = [
      { name: "BTC" },
      { name: "LMX" },
      { name: "ETH" },
      { name: "FUN" },
      { name: "CVC" },
      { name: "UNQ" },
      { name: "BCH" }
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
            name="withdrawFeeType"
            id="withdrawFeeType"
            value={this.state.withdrawFeeType}
            onChange={e => this.setState({ withdrawFeeType: e.target.value })}
          >
            <option value="Fixed">Fixed</option>
            <option value="Percentage">Percentage</option>
          </Input>
        </FormGroup>
        {this.state.errors.withdrawFeeType && (
          <FormGroup className="d-flex">
            <Label className="w-30" />
            <Label className="w-70">
              <span className="text-danger">
                {" "}
                <IntlMessages id={this.state.errors.withdrawFeeType} />
              </span>
            </Label>
          </FormGroup>
        )}
        <FormGroup className="d-flex">
          <Label className="w-30 text-muted">
            <IntlMessages id="wallet.feeRange" />
          </Label>
          <Input
            className="w-70"
            type="select"
            name="withdrawFeeRange"
            id="withdrawFeeRange"
            value={this.state.withdrawFeeRange}
            onChange={e => this.setState({ withdrawFeeRange: e.target.value })}
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </Input>
        </FormGroup>
        {this.state.errors.withdrawFeeRange && (
          <FormGroup className="d-flex">
            <Label className="w-30" />
            <Label className="w-70">
              <span className="text-danger">
                {" "}
                <IntlMessages id={this.state.errors.withdrawFeeRange} />
              </span>
            </Label>
          </FormGroup>
        )}
        {this.state.withdrawFeeRange === "No" && (
          <FormGroup
            className={
              "d-flex " + (this.state.errors.withdrawFeeAmount ? "mb-0" : "")
            }
          >
            <Label className="w-30 text-muted">
              <IntlMessages id="wallet.feeAmount" />
            </Label>
            <Input
              className="w-70"
              type="text"
              name="withdrawFeeAmount"
              value={this.state.withdrawFeeAmount}
              onChange={e =>
                validator.isDecimal(e.target.value, {
                  force_decimal: false,
                  decimal_digits: "0,8"
                }) || validator.isNumeric(e.target.value)
                  ? this.setState({ withdrawFeeAmount: e.target.value })
                  : ""
              }
            />
          </FormGroup>
        )}
        {this.state.withdrawFeeRange === "No" &&
          this.state.errors.withdrawFeeAmount && (
            <FormGroup className="d-flex">
              <Label className="w-30" />
              <Label className="w-70">
                <span className="text-danger">
                  {" "}
                  <IntlMessages id={this.state.errors.withdrawFeeAmount} />
                </span>
              </Label>
            </FormGroup>
          )}
        {this.state.withdrawFeeRange === "Yes" && (
          <div className="activity-board-wrapper">
            <div className="comment-box mb-4">
              {this.state.fees.map((fee, index) => (
                <div
                  className="col-xs-12 col-sm-12 col-md-12 justify-content-between d-inline-block"
                  key={index}
                >
                  <FormGroup className="col-sm-3 col-md-3 d-inline-block">
                    <Label className="">
                      <IntlMessages id="wallet.withdrawFrom" />
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
                      <IntlMessages id="wallet.withdrawTo" />
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
                    <IntlMessages id="wallet.minWitAmount" />
                  </Label>
                  <Input
                    className=""
                    type="text"
                    name={"minWitAmount" + index}
                    value={this.state.limits[index].min_amount}
                    onChange={e => this.onChangeMinAmount(e, index)}
                  />
                  {this.state.errors.limits &&
                    this.state.errors.limits[index].minWitAmount && (
                      <span className="text-danger">
                        {" "}
                        <IntlMessages
                          id={this.state.errors.limits[index].minWitAmount}
                        />
                      </span>
                    )}
                </FormGroup>
                <FormGroup className="col-sm-3 col-md-3 d-inline-block">
                  <Label className="">
                    <IntlMessages id="wallet.maxWitAmount" />
                  </Label>
                  <Input
                    className=""
                    type="text"
                    name={"maxWitAmount" + index}
                    value={this.state.limits[index].max_amount}
                    onChange={e => this.onChangeMaxAmount(e, index)}
                  />
                  {this.state.errors.limits &&
                    this.state.errors.limits[index].maxWitAmount && (
                      <span className="text-danger">
                        {" "}
                        <IntlMessages
                          id={this.state.errors.limits[index].maxWitAmount}
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
            <IntlMessages id="wallet.applyToCoins" />
          </h3>
        </FormGroup>
        <FormGroup className="">
          {this.state.coins.map((Coins, key) => (
            <Chip
              className="bg-skype text-white mr-10 mb-10"
              key={key}
              label={Coins}
              onDelete={e =>
                this.setState({
                  coins: this.state.coins.filter((_, i) => i !== key)
                })
              }
            />
          ))}
        </FormGroup>
        <div className="d-flex justify-content-between mb-5">
          <p className="mb-0 text-muted">
            <IntlMessages id="wallet.coinNotice" />
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
          {coin.map(
            (value, key) =>
              this.state.coins.indexOf(value.name) == -1 ? (
                <Button
                  key={key}
                  size="small"
                  className="btn-outline-secondary mr-5 mb-5"
                  color="primary"
                  onClick={e =>
                    this.setState({
                      coins: this.state.coins.concat(value.name)
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
export default WithdrawFeeAndLimit;
