// Component for displaying My Holdings Data By:Tejas Date : 12/9/2018

import React from "react";
import { Table } from "reactstrap";

import { Alert } from 'reactstrap';

// intl messages
import IntlMessages from "Util/IntlMessages";

// Import Actions From Actions By Tejas Date:14/9/2018
import { getHoldingList } from "Actions/Trade";

import { Scrollbars } from "react-custom-scrollbars";

import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// function for connect store
import { connect } from "react-redux";

class Holding extends React.Component {
  constructor() {
    super();
    this.state = {
      holdings: [],
      showLoader: true
    };
  }

  // This will invoke After component render
  componentDidMount() {
    // Call Action For Get Holding List
    //const pair = this.props.firstCurrency + '_' + this.props.secondCurrency;
    const pair = this.props.currecyPair
    this.props.getHoldingList({ Pair: pair });
  }


  // This will Invoke when component will recieve Props or when props changed
  componentWillReceiveProps(nextProps) {
    if (nextProps.holdings.length) {
      // set Holding list if gets from API only
      this.setState({
        holdings: nextProps.holdings,
        showLoader: false
      })
    }
  }

  render() {
    //display component

    // iterate object and stores into array
    const holdings = [];
    if (this.state.holdings) {
      this.state.holdings.map(value => {
        if (value.symbol == this.props.firstCurrency) {
          holdings.push(value)
        }
      })
    }


    return (
      <Scrollbars
        className="jbs-scroll"
        autoHeight
        autoHeightMin={250}
        autoHeightMax={300}
        autoHide
      >
        <div className="table-responsive-design p-10" style={{ width: "100%" }}>
          <div className="">
            {this.state.showLoader && <JbsSectionLoader />}
            <Table className="table m-0 p-0">
              <thead>
                <tr className="bg-light">
                  <th>
                    {<IntlMessages id="trading.holdingorder.label.currency" />}
                  </th>
                  <th>
                    {<IntlMessages id="trading.holdingorder.label.balance" />}
                  </th>
                  <th className="numeric">
                    {<IntlMessages id="trading.holdingorder.label.cost" />}
                  </th>
                  <th className="numeric">
                    {<IntlMessages id="trading.holdingorder.label.lastprice" />}
                  </th>
                  <th className="numeric">
                    {
                      <IntlMessages id="trading.holdingorder.label.currentvalue" />
                    }
                  </th>
                  <th className="numeric">
                    {
                      <IntlMessages id="trading.holdingorder.label.profitloss" />
                    }
                  </th>
                  <th className="numeric">
                    {
                      <IntlMessages id="trading.holdingorder.label.buyingdate" />
                    }
                  </th>
                </tr>
              </thead>
              <tbody>
                {holdings.length ? (
                  holdings.map((value, key) => (
                    <tr key={key}>
                      <td>{value.currency + " (" + value.symbol + ")"}</td>
                      <td>{value.balance.toFixed(8)}</td>
                      <td>{value.buying.toFixed(8)}</td>
                      <td>{value.price.toFixed(8)}</td>
                      <td>{value.current_value.toFixed(8)}</td>
                      <td>{value.profit_lose.toFixed(8)}</td>
                      <td>{value.buyin_date}</td>
                    </tr>
                  ))
                ) : (
                    <tr>
                      <td colSpan="7">
                      <Alert color="danger" className="text-center fs-32">
                          {<IntlMessages id="trading.holdingorder.label.nodata" />}
                    </Alert> 
                      </td>
                    </tr>
                  )}
              </tbody>
            </Table>
          </div>
        </div>
      </Scrollbars>
    );
  }
}

// set Props when actions are dispatch
const mapStateToProps = state => ({
  holdings: state.holdings.holdings
});

// connect action with store for dispatch
export default connect(
  mapStateToProps,
  {
    getHoldingList
  }
)(Holding);
