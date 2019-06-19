// Component for displaying News Tickers Data By:Tejas Date : 12/9/2018

import React from "react";

//import card details
import { Card, CardText, CardBody, CardTitle, CardSubtitle } from "reactstrap";

// intl messages
import IntlMessages from "Util/IntlMessages";

// import action
import { getTickersList } from "Actions/Trade";

// import connect function for store
import { connect } from "react-redux";

class Tickers extends React.Component {
  constructor() {
    super();
    this.state = {
      tickers: []
    };
  }

  // This will invoke After component render
  componentDidMount() {
    // Call Actions For Get  Ticker For MArquee
    //const pair = this.props.firstCurrency + '_' + this.props.secondCurrency;
    const pair = this.props.state.currencyPair
    
    this.props.getTickersList({ Pair: pair });
  }

  // This will Invoke when component will recieve Props or when props changed
  componentWillReceiveProps(nextprops) {
    if (nextprops.tickers && nextprops.tickers !== null) {
      // set pair list if gets from API only
      this.setState({ tickers: nextprops.tickers });
    }
  }

  // Render Component for Ticker
  render() {
    const data = this.state.tickers;

    return (
      <div>
        {data.length
          ? data.map((value, key) => (
              <div className="row" key={key}>
                <div className="col-xs-3 col-sm-3 col-md-3 text-center">
                  <Card>
                    <CardBody>
                      <CardTitle>
                        {
                          <IntlMessages id="trading.newsticker.label.investment" />
                        }
                      </CardTitle>
                      <CardSubtitle>
                        {data[0].totalInvestmentCurrency}
                      </CardSubtitle>
                      <CardText>{data[0].totalInvestmentBalance}</CardText>
                    </CardBody>
                  </Card>
                </div>

                <div className="col-xs-3 col-sm-3 col-md-3 text-center">
                  <Card>
                    <CardBody>
                      <CardTitle>
                        {<IntlMessages id="trading.newsticker.label.balance" />}
                      </CardTitle>
                      <CardSubtitle>
                        {data[0].currentBalancecurrency}
                      </CardSubtitle>
                      <CardText>{data[0].currentBalance}</CardText>
                    </CardBody>
                  </Card>
                </div>

                <div className="col-xs-3 col-sm-3 col-md-3 text-center">
                  <Card>
                    <CardBody>
                      <CardTitle>
                        {
                          <IntlMessages id="trading.newsticker.label.fiatcurrency" />
                        }
                      </CardTitle>
                      <CardSubtitle>{data[0].profitFiatCurrency}</CardSubtitle>
                      <CardText>{data[0].profitFiatCurrencyBalance}</CardText>
                    </CardBody>
                  </Card>
                </div>

                <div className="col-xs-3 col-sm-3 col-md-3 text-center">
                  <Card>
                    <CardBody>
                      <CardTitle>
                        {
                          <IntlMessages id="trading.newsticker.label.profitcurrency" />
                        }{" "}
                        {this.props.secondCurrency}
                      </CardTitle>
                      <CardSubtitle>{data[0].profitCurrency}</CardSubtitle>
                      <CardText>{data[0].profitCurrencyBalance}</CardText>
                    </CardBody>
                  </Card>
                </div>
              </div>
            ))
          : ""}
      </div>
    );
  }
}

// Set Props when actions are dispatch
const mapStateToProps = state => ({
  tickers: state.newsTicker.tickers
});

// connect action with store for dispatch
export default connect(
  mapStateToProps,
  {
    getTickersList
  }
)(Tickers);
