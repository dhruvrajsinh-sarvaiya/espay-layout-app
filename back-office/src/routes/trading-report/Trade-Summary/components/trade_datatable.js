/**
 * CreatedBy :Raj Kangad
 * Date :09/10/2018
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Popover, PopoverBody, Row } from "reactstrap";
import MUIDataTable from "mui-datatables";

import MatButton from "@material-ui/core/Button";

import { getTradePairs } from "Actions/TradeRecon";

import { Form, Label, Input } from "reactstrap";

//Added By Tejas For Get Data With Saga
import { getTradeSummaryList } from "Actions/TradeSummary";

//  Used For Display Notification 
import { NotificationManager } from "react-notifications";

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

class trade_data extends Component {
  constructor(props) {
    super();
    this.state = {
      errors: "",
      selectedUser: null,
      open: false,
      userrole: "Administrator",
      id: "",
      modal: false,
      popoverOpen: false,
      popoverData: [],
      tradeSummary: [],
      onLoad: 1,
      status: '',
      pair: '',
      marketType: '',
      pairList: [],
      range: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  toggle(data) {
    this.setState({
      popoverData: data,
      popoverOpen: this.state.popoverOpen ? false: true
    });
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.pairList.length) {

      this.setState({
        pairList: nextprops.pairList
      })
    }

    if (nextprops.tradeSummaryList.length !== 0 && nextprops.error.length == 0 && this.state.onLoad) {
      this.setState({
        tradeSummary: nextprops.tradeSummaryList,
        onLoad: 0
      })
    } else if (nextprops.error.length !== 0 && nextprops.error.ReturnCode !== 0 && this.state.onLoad) {
      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.error.ErrorCode}`} />);
      this.setState({
        tradeSummary: [],
        onLoad: 0
      })
    }

  }

  onGetData = event => {
    event.preventDefault();

    const Data = {
      Range: this.state.range ? parseInt(this.state.range) : 0,
      MarketType: this.state.marketType,
      Pair: this.state.pair,
    };

    this.setState({ onLoad: 1 })
    this.props.getTradeSummaryList(Data);
  };

  componentDidMount() {
    this.props.getTradeSummaryList({});
    this.props.getTradePairs()
  }

  handleChangePair = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleChangeMarketType = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleChangeRange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {

    const columns = [
      {
        name: <IntlMessages id="trade.summary.trade.pair" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="trade.summary.trade.totaltrade" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="trade.summary.trade.buy" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="trade.summary.trade.sell" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="trade.summary.trade.settled" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="trade.summary.trade.cancelled" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="trade.summary.trade.price" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="trade.summary.trade.volume" />,
        options: { sort: true, filter: true }
      }
    ];
    const options = {
      filterType: "dropdown",
      responsive: "scroll",
      selectableRows: false,
      download: false,
      viewColumns: false,
      print: false,
      search: true,
      sort: true
    };
    return (
      <div className="responsive-table-wrapper">
        <JbsCollapsibleCard>
          <div className="row">
            <div className="col-md-12">
              <div className="top-filter clearfix">
                <Form name="frm_search" className="row mb-10">
                  <div className="col-md-3">
                    <Label for="pair">
                      {
                        <IntlMessages id="traderecon.list.column.label.pair" />
                      }
                    </Label>
                    <div className="app-selectbox-sm">

                      <Input type="select" name="pair" value={this.state.pair} id="Select-1" onChange={this.handleChangePair}>
                        <IntlMessages id="traderecon.list.selectall">
                          {(select) =>
                            <option value="all">{select}</option>
                          }
                        </IntlMessages>
                        {this.state.pairList.map((currency, key) =>
                          <option key={key} value={currency.PairName}>{currency.PairName}</option>
                        )}
                      </Input>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <Label for="Range">
                      {
                        <IntlMessages id="sidebar.trade.filterLabel.range" />
                      }
                    </Label>
                    <Input type="select" name="range" value={this.state.range} id="Select-2" onChange={this.handleChangeRange}>
                      <IntlMessages id="trade.summary.option.range.title">
                        {(select) =>
                          <option value="0">{select}</option>
                        }
                      </IntlMessages>
                      <IntlMessages id="trade.summary.option.range.daily">
                        {(daily) =>
                          <option value="1">{daily}</option>
                        }
                      </IntlMessages>
                      <IntlMessages id="trade.summary.option.range.weekly">
                        {(weekly) =>
                          <option value="2">{weekly}</option>
                        }
                      </IntlMessages>
                      <IntlMessages id="trade.summary.option.range.monthly">
                        {(monthly) =>
                          <option value="3">{monthly}</option>
                        }
                      </IntlMessages>
                      <IntlMessages id="trade.summary.option.range.yearly">
                        {(yearly) =>
                          <option value="6">{yearly}</option>
                        }
                      </IntlMessages>
                    </Input>
                  </div>


                  <div className="col-md-3">
                    <Label for="market_type">
                      {
                        <IntlMessages id="traderecon.list.column.label.ordertype" />
                      }
                    </Label>
                    <Input type="select" name="marketType" value={this.state.marketType} id="Select-2" onChange={this.handleChangeMarketType}>
                      <IntlMessages id="traderecon.list.selectall">
                        {(select) =>
                          <option value="">{select}</option>
                        }
                      </IntlMessages>
                      <IntlMessages id="traderecon.list.limit">
                        {(limit) =>
                          <option value="Limit">{limit}</option>
                        }
                      </IntlMessages>
                      <IntlMessages id="traderecon.list.market">
                        {(market) =>
                          <option value="Market">{market}</option>
                        }
                      </IntlMessages>
                      <IntlMessages id="traderecon.list.stop_limit">
                        {(stoplimit) =>
                          <option value="STOP_Limit">{stoplimit}</option>
                        }
                      </IntlMessages>
                      <IntlMessages id="traderecon.list.stop">
                        {(stop) =>
                          <option value="STOP">{stop}</option>
                        }
                      </IntlMessages>
                    </Input>
                  </div>
                  <div className="col-md-3">
                    <Label>&nbsp;</Label>
                    <MatButton
                      variant="raised"
                      className="btn-primary text-white"
                      onClick={this.onGetData}
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
        {this.state.tradeSummary.length > 0 && (
          <JbsCollapsibleCard fullBlock>

            <div className="StackingHistory">
              <MUIDataTable
                title={<IntlMessages id="sidebar.TradeSummary.title" />}
                data={this.state.tradeSummary.map((item, key) => {
                  return [
                    item.PairName,
                    item.TradeCount,
                    item.buy,
                    item.sell,
                    item.Settled,
                    item.Cancelled,
                    <button
                      className="tradesummary-price"
                      id="Pricepopup"
                      onClick={() => this.toggle(item)}
                    >
                      {item.ChargePer}
                    </button>,
                    item.Volume
                  ];
                })}
                columns={columns}
                options={options}
              />
            </div>
            <Row>
              <Popover
                placement="bottom"
                isOpen={this.state.popoverOpen}
                target="Pricepopup"
                toggle={this.toggle}
              >
                <PopoverBody>
                  <ul className="tradesummary-detail">
                    <li>
                      <a className="text-center"><IntlMessages id="sidebar.open" /> - {this.state.popoverData.OpenP} </a>
                    </li>
                    <li>
                      <a className="text-center"><IntlMessages id="sidebar.closed" /> - {this.state.popoverData.CloseP} </a>
                    </li>
                    <li>
                      <a className="text-center"><IntlMessages id="widgets.high" /> - {this.state.popoverData.high} </a>
                    </li>
                    <li>
                      <a className="text-center"><IntlMessages id="widgets.low" /> - {this.state.popoverData.low} </a>
                    </li>
                  </ul>
                </PopoverBody>
              </Popover>
            </Row>
          </JbsCollapsibleCard>
        )}
      </div>
    );
  }
}

// map states to props when changed in states from reducer
const mapStateToProps = state => ({
  tradeSummaryList: state.tradeSummary.tradeSummaryList,
  loading: state.tradeSummary.loading,
  error: state.tradeSummary.error,
  pairList: state.tradeRecon.pairList
});

// export this component with action methods and props
export default connect(
  mapStateToProps,
  { getTradeSummaryList, getTradePairs }
)(trade_data);
