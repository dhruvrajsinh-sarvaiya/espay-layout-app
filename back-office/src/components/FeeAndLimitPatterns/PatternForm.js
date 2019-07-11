/* 
    Developer : Nishant Vadgama
    Date : 29-08-2018
    File Comment : Add & Edit form for free & limit patterns
*/
import React from "react";
import IntlMessages from "Util/IntlMessages";
import { connect } from "react-redux";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import SwipeableViews from "react-swipeable-views";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { FormGroup, Label, Input } from "reactstrap";
import MatButton from "@material-ui/core/Button";
import DepositFeeAndLimit from "Components/FeeAndLimitPatterns/DepositFeeAndLimit";
import WithdrawFeeAndLimit from "Components/FeeAndLimitPatterns/WithdrawFeeAndLimit";
import TradeFeeAndLimit from "Components/FeeAndLimitPatterns/TradeFeeAndLimit";
import { getPatternInfo, postPatternInfo } from "Actions/FeeAndLimitPatterns";
function TabContainer({ children }) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

const validateAddNewRequest = require("../../validation/FeeAndLimitPatterns/addNewPattern");
const validateDepositTab = require("../../validation/FeeAndLimitPatterns/validateDepositTab");
const validateWithdrawTab = require("../../validation/FeeAndLimitPatterns/validateWithdrawTab");
const validateTradeTab = require("../../validation/FeeAndLimitPatterns/validateTradeTab");

class PatternForm extends React.Component {
  // assign details to state
  state = this.props.details;
  componentWillMount() {
    this.props.getPatternInfo();
  }
  handleChange(event, value) {
    this.setState({ activeIndex: value });
  }
  handleChangeIndex(index) {
    this.setState({ activeIndex: index });
  }
  onChangeStatus(e) {
    this.setState({ patternStatus: e.target.value });
  }
  onChangeExchange(e) {
    this.setState({ patternExchange: e.target.value });
  }
  handleCancel(e) {
    e.preventDefault();
    const error = {};
    this.setState({ errors: error });
    this.props.history.push({ pathname: "/app/fee-limit-patterns" });
  }
  handleSubmit(e) {
    e.preventDefault();
    // validate main form content
    const { errors, isValid } = validateAddNewRequest(this.state);
    // validate deposit tab content
    let depositState = this._depositFeeAndLimit.getData();
    const { depositErrors, isValidDeposit } = validateDepositTab(depositState);
    depositState.isSubmitted = true;
    depositState.errors = depositErrors;
    // validate withdraw tab content
    let withdrawState = this._withdrawFeeAndLimit.getData();
    const { withdrawErrors, isValidWithdraw } = validateWithdrawTab(
      withdrawState
    );
    withdrawState.isSubmitted = true;
    withdrawState.errors = withdrawErrors;
    // validate trade tab content
    let tradeState = this._tradeFeeAndLimit.getData();
    const { tradeErrors, isValidTrade } = validateTradeTab(tradeState);
    tradeState.isSubmitted = true;
    tradeState.errors = tradeErrors;
    this.setState({
      errors: errors,
      depositFeeAndLimit: depositState,
      withdrawFeeAndLimit: withdrawState,
      tradeFeeAndLimit: tradeState
    });
    if (isValid && isValidDeposit && isValidWithdraw && isValidTrade) {
      let postData = {
        patternName: this.state.patternName,
        patternDesc: this.state.patternDesc,
        patternStatus: this.state.patternStatus,
        patternExchange: this.state.patternExchange,
        depositFeeAndLimit: depositState,
        withdrawFeeAndLimit: withdrawState,
        tradeFeeAndLimit: tradeState
      };
      this.props.postPatternInfo(postData);
    }
  }
  render() {
    const exchanges = [
      { name: "OHOCASH" },
      { name: "PAROEXCHANGE" },
      { name: "OLILIA" },
      { name: "UNIQEXCHANGE" }
    ];
    return (
      <div className="PatternForm todo-wrapper">
        <JbsCollapsibleCard contentCustomClasses="p-30">
          <div className="col-xs-12 col-sm-12 col-md-12">
            <FormGroup
              className={
                "d-flex " + (this.state.errors.patternName ? "mb-0" : "")
              }
            >
              <Label className="w-30 px-20">
                <IntlMessages id="wallet.patternName" />
              </Label>
              <Input
                className="w-70"
                type="text"
                name="patternName"
                id="patternName"
                value={this.state.patternName}
                onChange={e => this.setState({ patternName: e.target.value })}
              />
            </FormGroup>
            {this.state.errors.patternName && (
              <FormGroup className="d-flex">
                <Label className="w-30 px-20" />
                <Label className="w-70">
                  <span className="text-danger">
                    {" "}
                    <IntlMessages id={this.state.errors.patternName} />
                  </span>
                </Label>
              </FormGroup>
            )}
            <FormGroup
              className={
                "d-flex " + (this.state.errors.patternDesc ? "mb-0" : "")
              }
            >
              <Label className="w-30 px-20">
                <IntlMessages id="wallet.patternDesc" />
              </Label>
              <Input
                className="w-70"
                type="textarea"
                name="patternDesc"
                id="patternDesc"
                value={this.state.patternDesc}
                onChange={e => this.setState({ patternDesc: e.target.value })}
              />
            </FormGroup>
            {this.state.errors.patternDesc && (
              <FormGroup className="d-flex">
                <Label className="w-30 px-20" />
                <Label className="w-70">
                  <span className="text-danger">
                    {" "}
                    <IntlMessages id={this.state.errors.patternDesc} />
                  </span>
                </Label>
              </FormGroup>
            )}
            <FormGroup className="mb-0">
              <h3 className="pb-20">
                <IntlMessages id="wallet.patternMatrix" />
              </h3>
            </FormGroup>
          </div>
          <JbsCollapsibleCard
            colClasses="col-sm-12 col-md-12 col-lg-12"
            fullBlock
            customClasses="overflow-hidden"
          >
            <AppBar position="static" color="default">
              <Tabs
                value={this.state.activeIndex}
                onChange={(e, value) => this.handleChange(e, value)}
                fullWidth
              >
                <Tab
                  label={<IntlMessages id="wallet.tabDeposit" />}
                  className="font-weight-bold"
                />
                <Tab
                  label={<IntlMessages id="wallet.tabWithdraw" />}
                  className="font-weight-bold"
                />
                <Tab
                  label={<IntlMessages id="wallet.tabTrade" />}
                  className="font-weight-bold"
                />
                />
              </Tabs>
            </AppBar>
            <SwipeableViews
              axis={"x"}
              index={this.state.activeIndex}
              onChangeIndex={index => this.handleChangeIndex(index)}
            >
              <TabContainer>
                <DepositFeeAndLimit
                  ref={ref => (this._depositFeeAndLimit = ref)}
                  data={this.state.depositFeeAndLimit}
                />
              </TabContainer>
              <TabContainer>
                <WithdrawFeeAndLimit
                  ref={ref => (this._withdrawFeeAndLimit = ref)}
                  data={this.state.withdrawFeeAndLimit}
                />
              </TabContainer>
              <TabContainer>
                <TradeFeeAndLimit
                  ref={ref => (this._tradeFeeAndLimit = ref)}
                  data={this.state.tradeFeeAndLimit}
                />
              </TabContainer>
            </SwipeableViews>
          </JbsCollapsibleCard>
          <div className="col-xs-12 col-sm-12 col-md-12">
            <FormGroup
              className={
                "d-flex " + (this.state.errors.patternStatus ? "mb-0" : "")
              }
            >
              <Label className="w-30 px-20 text-muted">
                <IntlMessages id="wallet.patternStatus" />
              </Label>
              <Input
                className="w-70"
                type="select"
                name="patternStatus"
                id="patternStatus"
                onChange={e => this.onChangeStatus(e)}
                value={this.state.patternStatus}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Input>
            </FormGroup>
            {this.state.errors.patternStatus && (
              <FormGroup className="d-flex">
                <Label className="w-30 px-20" />
                <Label className="w-70">
                  <span className="text-danger">
                    {" "}
                    <IntlMessages id={this.state.errors.patternStatus} />
                  </span>
                </Label>
              </FormGroup>
            )}
            <FormGroup
              className={
                "d-flex " + (this.state.errors.patternExchange ? "mb-0" : "")
              }
            >
              <Label className="w-30 px-20 text-muted">
                <IntlMessages id="wallet.patternExchange" />
              </Label>
              <Input
                className="w-70"
                type="select"
                name="patternExchange"
                id="patternExchange"
                onChange={e => this.onChangeExchange(e)}
                value={this.state.patternExchange}
              >
                <option value="">Select Exchange</option>
                {exchanges.map((value, key) => (
                  <option value={value.name} key={key}>
                    {value.name}
                  </option>
                ))}
              </Input>
            </FormGroup>
            {this.state.errors.patternExchange && (
              <FormGroup className="d-flex">
                <Label className="w-30 px-20" />
                <Label className="w-70">
                  <span className="text-danger">
                    {" "}
                    <IntlMessages id={this.state.errors.patternExchange} />
                  </span>
                </Label>
              </FormGroup>
            )}
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12 justify-content-center d-flex">
            <FormGroup className="mb-10">
              <MatButton
                variant="raised"
                className="btn-danger text-white"
                onClick={e => this.handleCancel(e)}
              >
                <IntlMessages id="button.cancel" />
              </MatButton>{" "}
              <MatButton
                variant="raised"
                className="btn-primary text-white"
                onClick={e => this.handleSubmit(e)}
              >
                <IntlMessages id={"wallet.btnAddPattern"} />
              </MatButton>
            </FormGroup>
          </div>
        </JbsCollapsibleCard>
      </div>
    );
  }
}

const mapStateToProps = ({ patternListReducer }) => {
  const { patternInfo, loading } = patternListReducer;
  return { patternInfo, loading };
};

export default connect(
  mapStateToProps,
  {
    getPatternInfo,
    postPatternInfo
  }
)(PatternForm);
