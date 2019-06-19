/**
 * CreatedBy :Raj Kangad
 * Date :09/10/2018
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Popover, PopoverBody, Row } from "reactstrap";
import MUIDataTable from "mui-datatables";

//Added By Tejas For Get Data With Saga
import { getTradeSummaryList } from "Actions/TradeSummary";

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
      tradeSummary: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.tradeSummaryList.length) {
      this.setState({
        tradeSummary: nextprops.tradeSummaryList
      });
    }
  }
  componentDidMount() {
    this.props.getTradeSummaryList({});
  }

  render() {
    const columns = [
      {
        name: <IntlMessages id="trade.summery.trade.pair" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="trade.summery.trade.totaltrade" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="trade.summery.trade.buy" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="trade.summery.trade.sell" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="trade.summery.trade.settled" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="trade.summery.trade.cancelled" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="trade.summery.trade.price" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="trade.summery.trade.volume" />,
        options: { sort: true, filter: true }
      }
    ];
    const options = {
      filterType: "dropdown",
      responsive: "scroll",
      selectableRows: true,
      download: false,
      viewColumns: false,
      print: false,
      search: true,
      sort: true
    };
    return (
      <div className="responsive-table-wrapper">
        {this.state.tradeSummary.length && (
          <JbsCollapsibleCard fullBlock>
          <div className="StackingHistory">
            <MUIDataTable
             title={<IntlMessages id="sidebar.TradeSummery.title" />}            
              data={this.state.tradeSummary.map((item, key) => {
                return [
                  item.pairname,
                  item.total_trade,
                  item.total_buy,
                  item.total_sell,
                  item.total_settled,
                  item.total_cancelled,
                  <button
                    className="tradesummery-price"
                    id="Pricepopup"
                    onClick={this.toggle}
                  >
                    {item.total_price}
                  </button>,
                  item.total_volume
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
                  <ul className="tradesummery-detail">
                    <li>
                      <a className="text-center">Open - 0.00025 BTC</a>
                    </li>
                    <li>
                      <a className="text-center">Close - 0.05265 ATC</a>
                    </li>
                    <li>
                      <a className="text-center">High - 0.33256 LTC</a>
                    </li>
                    <li>
                      <a className="text-center">Low - 0.00025 BTC</a>
                    </li>
                    <li>
                      <a className="text-center">Close - 0.56987 ATC</a>
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
  tradeSummaryList: state.tradeSummary.tradeSummaryList
});

// export this component with action methods and props
export default connect(
  mapStateToProps,
  { getTradeSummaryList }
)(trade_data);
