/* 
    Developer : Nishant Vadgama
    Date : 29-08-2018
    File Comment : Deposit Fee & LImit configuration Component
*/
import React from "react";
import IntlMessages from "Util/IntlMessages";
import validator from "validator";
import Chip from "@material-ui/core/Chip";
import { FormGroup, Label, Input, Row, Button } from "reactstrap";
import MatButton from "@material-ui/core/Button";

class DepositFeeAndLimit extends React.Component {
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
        <FormGroup
          className={
            "d-flex " + (this.state.errors.depositFeeType ? "mb-0" : "")
          }
        >
          <Label className="w-30 text-muted">
            <IntlMessages id="wallet.patternFeeType" />
          </Label>
          <Input
            className="w-70"
            type="select"
            name="depositFeeType"
            id="depositFeeType"
            value={this.state.depositFeeType}
            onChange={e => this.setState({ depositFeeType: e.target.value })}
          >
            <option value="Fixed">Fixed</option>
            <option value="Percentage">Percentage</option>
          </Input>
        </FormGroup>
        {this.state.errors.depositFeeType && (
          <FormGroup className="d-flex">
            <Label className="w-30" />
            <Label className="w-70">
              <span className="text-danger">
                {" "}
                <IntlMessages id={this.state.errors.depositFeeType} />
              </span>
            </Label>
          </FormGroup>
        )}
        <FormGroup
          className={
            "d-flex " + (this.state.errors.depositFeeRange ? "mb-0" : "")
          }
        >
          <Label className="w-30 text-muted">
            <IntlMessages id="wallet.feeRange" />
          </Label>
          <Input
            className="w-70"
            type="select"
            name="depositFeeRange"
            id="depositFeeRange"
            value={this.state.depositFeeRange}
            onChange={e => this.setState({ depositFeeRange: e.target.value })}
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </Input>
        </FormGroup>
        {this.state.errors.depositFeeRange && (
          <FormGroup className="d-flex">
            <Label className="w-30" />
            <Label className="w-70">
              <span className="text-danger">
                {" "}
                <IntlMessages id={this.state.errors.depositFeeRange} />
              </span>
            </Label>
          </FormGroup>
        )}
        {this.state.depositFeeRange === "No" && (
          <FormGroup
            className={
              "d-flex " + (this.state.errors.depositFeeAmount ? "mb-0" : "")
            }
          >
            <Label className="w-30 text-muted">
              <IntlMessages id="wallet.feeAmount" />
            </Label>
            <Input
              className="w-70"
              type="text"
              name="depositFeeAmount"
              value={this.state.depositFeeAmount}
              onChange={e =>
                validator.isDecimal(e.target.value, {
                  force_decimal: false,
                  decimal_digits: "0,8"
                }) || validator.isNumeric(e.target.value)
                  ? this.setState({ depositFeeAmount: e.target.value })
                  : ""
              }
            />
          </FormGroup>
        )}
        {this.state.depositFeeRange === "No" &&
          this.state.errors.depositFeeAmount && (
            <FormGroup className="d-flex">
              <Label className="w-30" />
              <Label className="w-70">
                <span className="text-danger">
                  {" "}
                  <IntlMessages id={this.state.errors.depositFeeAmount} />
                </span>
              </Label>
            </FormGroup>
          )}
        {this.state.depositFeeRange === "Yes" && (
          <div className="activity-board-wrapper">
            <div className="comment-box mb-4">
              {this.state.fees.map((fee, index) => (
                <Row key={index}>
                  <div className="col-xs-12 col-sm-12 col-md-12 justify-content-between d-inline-block">
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
                            <IntlMessages
                              id={this.state.errors.fees[index].to}
                            />
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
                        className="font-2x mt-30"
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
                </Row>
              ))}
              <Row>
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
              </Row>
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
            {this.state.limits.map((value, index) => (
              <Row key={index}>
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
                      value={this.state.limits[index].type}
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
                      <IntlMessages id="wallet.minDepAmount" />
                    </Label>
                    <Input
                      className=""
                      type="text"
                      name={"minDepAmount" + index}
                      value={this.state.limits[index].min_amount}
                      onChange={e => this.onChangeMinAmount(e, index)}
                    />
                    {this.state.errors.limits &&
                      this.state.errors.limits[index].minDepAmount && (
                        <span className="text-danger">
                          {" "}
                          <IntlMessages
                            id={this.state.errors.limits[index].minDepAmount}
                          />
                        </span>
                      )}
                  </FormGroup>
                  <FormGroup className="col-sm-3 col-md-3 d-inline-block">
                    <Label className="">
                      <IntlMessages id="wallet.maxDepAmount" />
                    </Label>
                    <Input
                      className=""
                      type="text"
                      name={"maxDepAmount" + index}
                      value={this.state.limits[index].max_amount}
                      onChange={e => this.onChangeMaxAmount(e, index)}
                    />
                    {this.state.errors.limits &&
                      this.state.errors.limits[index].maxDepAmount && (
                        <span className="text-danger">
                          {" "}
                          <IntlMessages
                            id={this.state.errors.limits[index].maxDepAmount}
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
                          limits: this.state.limits.filter(
                            (_, i) => i !== index
                          )
                        })
                      }
                    >
                      <i className="zmdi zmdi-delete"></i>
                    </a>
                  </FormGroup>
                </div>
              </Row>
            ))}
            <Row>
              <div className="col-xs-12 col-sm-12 col-md-12 justify-content-end d-inline-block ml-15">
                <MatButton
                  variant="raised"
                  className="btn-primary text-white"
                  onClick={e => this.addNewLimitColumn()}
                >
                  <IntlMessages id="wallet.btnAddLimit" />
                </MatButton>
              </div>
            </Row>
          </div>
        </div>
        <FormGroup className="">
          <h3 className="font-weight-bold">
            <IntlMessages id="wallet.applyToCoins" />
          </h3>
        </FormGroup>
        <FormGroup className="">
          {this.state.coins.map((coins, key) => (
            <Chip
              className="bg-skype text-white mr-10 mb-10"
              key={key}
              label={coins}
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
export default DepositFeeAndLimit;
