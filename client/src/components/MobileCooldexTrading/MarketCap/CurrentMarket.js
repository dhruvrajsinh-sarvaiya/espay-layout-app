// Component for displaying Market Cap history Data By:Tejas Date : 12/9/2018

import React from "react";
import { Row, Col, Alert } from "reactstrap";
// intl messages
import IntlMessages from "Util/IntlMessages";

// import Actions dor market cap list
import { getMarketCapList } from "Actions/Trade";

// import connect function for store
import { connect } from "react-redux";

// create Component
class CurrentMarket extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      langDropdownOpen: false,
      currentMarket: [],
      showLoader: true,
      oldMarketCapData: [],
      socketData: [],
      lastPrice: 0,
      oldLastPrice: 0,
      socketLastPriceData: [],
      upDownBit: 1,
      Change24: 0
    };
    this.isComponentActive = 1
  }

  // This will invoke After component render
  componentWillMount() {

    this.isComponentActive = 1

    // code changed by devang parekh for handling margin trading process
    if (this.props.hasOwnProperty('marginTrading') && this.props.marginTrading === 1) {

      // Call Actions For Get Market Cap List
      this.props.getMarketCapList({ Pair: this.props.currencyPair, marginTrading: 1 });
      this.processForMarginTrading(); // call for intialize socket listners for margin trading

    } else {

      this.props.getMarketCapList({ Pair: this.props.currencyPair });
      this.processForNormalTrading();// call for intialize socket listners for normal trading

    }

    // code end (20-2-2019)

  }

  // code for handle signalr listners for normal trading
  processForNormalTrading() {

    this.props.hubConnection.on('RecieveMarketData', (receivedMessage) => {

      if (this.isComponentActive === 1 && receivedMessage !== null) {

        try {

          const marketCap = JSON.parse(receivedMessage)
          if ((marketCap.EventTime && this.state.socketData.length === 0) ||
            (this.state.socketData.length !== 0 && marketCap.EventTime > this.state.socketData.EventTime)) {

            if (this.props.currencyPair === marketCap.Parameter && typeof marketCap.IsMargin !== 'undefined' && marketCap.IsMargin === 0) {

              this.setState({
                currentMarket: marketCap.Data,
                oldMarketCapData: this.state.currentMarket,
                socketData: marketCap,
                Change24: this.state.currentMarket.Change24
              })

            }

          }

        } catch (error) {

        }

      }

    });

    this.props.hubConnection.on('RecieveLastPrice', (receivedMessage) => {

      if (this.isComponentActive === 1 && receivedMessage !== null) {

        try {

          const marketCap = JSON.parse(receivedMessage)

          if ((marketCap.EventTime && this.state.socketLastPriceData.length === 0) ||
            (this.state.socketLastPriceData.length !== 0 && marketCap.EventTime > this.state.socketLastPriceData.EventTime)) {

            if (this.props.currencyPair === marketCap.Parameter && typeof marketCap.IsMargin !== 'undefined' && marketCap.IsMargin === 0) {

              this.setState({
                lastPrice: marketCap.Data.LastPrice,
                upDownBit: marketCap.Data.UpDownBit,
                oldLastPrice: this.state.lastPrice,
                socketLastPriceData: marketCap
              })

            }

          }

        } catch (error) {

        }

      }

    });

  }

  // code for handle signalr listners for margin trading
  processForMarginTrading() {

    this.props.hubConnection.on('RecieveMarketData', (receivedMessage) => {

      if (this.isComponentActive === 1 && receivedMessage !== null) {

        try {

          const marketCap = JSON.parse(receivedMessage)

          if ((marketCap.EventTime && this.state.socketData.length === 0) ||
            (this.state.socketData.length !== 0 && marketCap.EventTime > this.state.socketData.EventTime)) {

            if (this.props.currencyPair === marketCap.Parameter && typeof marketCap.IsMargin !== 'undefined' && marketCap.IsMargin === 1) {

              this.setState({
                currentMarket: marketCap.Data,
                oldMarketCapData: this.state.currentMarket,
                socketData: marketCap,
                Change24: this.state.currentMarket.Change24
              })

            }

          }

        } catch (error) {
        }

      }

    });

    this.props.hubConnection.on('RecieveLastPrice', (receivedMessage) => {

      if (this.isComponentActive === 1 && receivedMessage !== null) {

        try {

          const marketCap = JSON.parse(receivedMessage)

          if ((marketCap.EventTime && this.state.socketLastPriceData.length === 0) ||
            (this.state.socketLastPriceData.length !== 0 && marketCap.EventTime > this.state.socketLastPriceData.EventTime)) {

            if (this.props.currencyPair === marketCap.Parameter && typeof marketCap.IsMargin !== 'undefined' && marketCap.IsMargin === 1) {

              this.setState({
                lastPrice: marketCap.Data.LastPrice,
                upDownBit: marketCap.Data.UpDownBit,
                oldLastPrice: this.state.lastPrice,
                socketLastPriceData: marketCap
              })

            }
          }

        } catch (error) {

        }

      }

    });

  }

  // function to toggle dropdown menu
  toggle = () => {
    this.setState({
      langDropdownOpen: !this.state.langDropdownOpen
    });
  }

  componentWillUnmount() {
    this.isComponentActive = 0;
  }
  // This will Invoke when component will recieve Props or when props changed
  componentWillReceiveProps(nextprops) {
    if (nextprops.currentMarketCap) {
      // set Market Cap list if gets from API only
      this.setState({
        oldMarketCapData: this.props.currentMarket,
        currentMarket: nextprops.currentMarketCap,
        showLoader: false,
        lastPrice: nextprops.currentMarketCap.LastPrice ? nextprops.currentMarketCap.LastPrice : 0
      });
    }
  }

  // Render Component for Current MArket List
  render() {

    var price = 0;

    // get price and old price
    if (this.state.currentMarket.length !== 0 && this.state.lastPrice == 0) {
      price = this.state.currentMarket.LastPrice;
    }
    else {
      price = this.state.lastPrice
    }

    return (

      <div>
        {this.state.currentMarket ? (
          <div className="pb-15">
            <Row>
              <Col xs={6}>
                <div class="selectcoin" onClick={this.handleClickOpen}>
                  {this.state.upDownBit ?
                    <span className="text-center text-success">
                      {parseFloat(price).toFixed(8)} <i className="ti-arrow-up" />
                    </span>
                    :
                    <span className="text-center text-danger">
                      {parseFloat(price).toFixed(8)} <i className="ti-arrow-down" />
                    </span>
                  }
                </div>
              </Col>

            </Row>

            <Row>
              <Col xs={6} className="pl-30">
                <div>{<IntlMessages id="trading.marketcap.label.24hchange" />} {this.state.currentMarket.Change24 !== undefined ? parseFloat(this.state.currentMarket.Change24).toFixed(8) : 0}</div>
                <div>{<IntlMessages id="trading.marketcap.label.24hvoulme" />}  {this.state.currentMarket.Volume24 !== undefined ? parseFloat(this.state.currentMarket.Volume24).toFixed(8) : 0}</div>
              </Col>
              <Col xs={6} className="text-right pr-30">
                <div>{<IntlMessages id="trading.marketcap.label.24hhigh" />} {this.state.currentMarket.High24 !== undefined ? parseFloat(this.state.currentMarket.High24).toFixed(8) : 0}</div>
                <div>{<IntlMessages id="trading.marketcap.label.24hlow" />} {this.state.currentMarket.Low24 !== undefined ? parseFloat(this.state.currentMarket.Low24).toFixed(8) : 0}</div>
              </Col>
            </Row>



          </div>
        ) : (
            <div>
              <span>
                <Alert color="danger" className="text-center fs-32">
                  {<IntlMessages id="trading.marketcap.label.nodata" />}
                </Alert>
              </span>
            </div>
          )}
      </div>

    );
  }
}

// Set Props when actions are dispatch
const mapStateToProps = state => ({
  currentMarketCap: state.currentMarketCap.currentMarketCap,
});

// connect action with store for dispatch
export default connect(
  mapStateToProps,
  {
    getMarketCapList
  }
)(CurrentMarket);
