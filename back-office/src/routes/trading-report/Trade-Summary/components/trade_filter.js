import React, { Component } from "react";
import { Form, Label, Input } from "reactstrap";
import MatButton from "@material-ui/core/Button";

// intl messages means convert text into selected languages
import IntlMessages from "Util/IntlMessages";

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

export default class trade_filter extends Component {
  onApply = () => {
  };
  render() {
    return (
      <div className="charts-widgets-wrapper">
        <div className="transaction-history-detail">
          <JbsCollapsibleCard>
            <div className="row">
              <div className="col-md-12">
                <div className="top-filter clearfix">
                  <Form name="frm_search" className="row mb-10">
                    <div className="col-md-1">
                      <Label>&nbsp;</Label>
                    </div>

                    <div className="col-md-3">
                      <Label for="Select-1">
                        {<IntlMessages id="sidebar.trade.filterLabel.pair" />}
                      </Label>
                      <div className="app-selectbox-sm">
                        <Input type="select" name="pair" id="Select-1">
                          <option value="all">All</option>
                          <option value="LTC">LTC</option>
                          <option value="BTC">BTC</option>
                          <option value="xrp_atcc">XRP_ATCC</option>
                        </Input>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <Label for="Select-1">
                        {<IntlMessages id="sidebar.trade.filterLabel.range" />}
                      </Label>
                      <div className="app-selectbox-sm">
                        <Input type="select" name="pair" id="Select-1">
                          <option value="Daily">Daily</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Yearly">Yearly</option>
                        </Input>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <Label for="Select-1">
                        {
                          <IntlMessages id="sidebar.trade.filterLabel.Ordertype" />
                        }
                      </Label>
                      <div className="app-selectbox-sm">
                        <Input type="select" name="pair" id="Select-1">
                          <option value="Limit">Limit</option>
                          <option value="Margin">Margin</option>
                          <option value="Spot">Spot</option>
                        </Input>
                      </div>
                    </div>

                    <div className="col-md-1">
                      <Label>&nbsp;</Label>
                      <MatButton
                        variant="raised"
                        className="btn-primary text-white"
                        onClick={this.onApply}
                      >
                        <IntlMessages id="sidebar.trade.filterLabel.apply" />
                      </MatButton>
                    </div>

                    <div className="col-md-1">
                      <Label className="d-block">&nbsp;</Label>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </JbsCollapsibleCard>
        </div>
      </div>
    );
  }
}
