import React, { Component } from 'react';
import { Card, Container } from 'reactstrap';
import Slider from "react-slick";
import { getCoinSliderList } from 'Actions/LandingPage';

// intl messages
import IntlMessages from "Util/IntlMessages";

// import for display Loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

import { connect } from "react-redux";
import AppConfig from 'Constants/AppConfig';

// code for add display dialogbox when site under maintenance (devang parekh)
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
const signalR = require("@aspnet/signalr");
const signalRURL = AppConfig.signalRURL

class coinslider extends Component {

  state = {
    settings2: undefined,
    coinSliderList: [],
    loading: true,
    hubConnection: new signalR.HubConnectionBuilder().withUrl(signalRURL).configureLogging(signalR.LogLevel.None).build(),
    getList: 1,
    marketTickerData: [],
    isSiteUnderMaintenance: false
  }

  componentDidMount() {
    this.setState({
      settings2: this.settings2
    })
  }

  componentWillMount() {

    // call for getting coin slider list
    this.props.getCoinSliderList({});

    this.state.hubConnection.start().then(() => {
      this.setState({ hubConnection: this.state.hubConnection });

      // code added by devang parekh for handling site under maintenance (15-3-2019)
      this.state.hubConnection.on("ReceiveEnvironmentMode", (environmentDetail) => {

        try {

          environmentDetail = JSON.parse(environmentDetail);

          if (typeof environmentDetail.Data !== 'undefined' && environmentDetail.Data !== '') {

            if (typeof environmentDetail.Data.MsgCode !== 'undefined' && parseInt(environmentDetail.Data.MsgCode) === 6062) { // MsgCode => 6062 : under maintance, 6063 : for live 
              this.setState({ isSiteUnderMaintenance: true });
            } else {
              this.setState({ isSiteUnderMaintenance: false });
            }
          }

        } catch (error) {
        }

        setTimeout(function () {
          window.location.href = '/';
        }, 5000)

      });
      //end

    });

    this.state.hubConnection.on("RecieveMarketTicker", (MarketTickerData) => {

      try {

        const MarketTickerDetail = JSON.parse(MarketTickerData);

        if ((MarketTickerDetail.EventTime && this.state.marketTickerData.length === 0) ||
          (this.state.marketTickerData.length > 0 && MarketTickerDetail.EventTime > this.state.marketTickerData.EventTime)) {

          if (MarketTickerDetail.Data && MarketTickerDetail.Data.length) {

            if (MarketTickerDetail.Data.length > 1) {

              this.setState({
                coinSliderList: MarketTickerDetail.Data,
                marketTickerData: MarketTickerDetail
              })

            } else {

              var latestMarketData = this.state.coinSliderList;

              latestMarketData.map((coinSliderDetail) => {

                MarketTickerDetail.Data.map((MarketTickerDetails, key) => {

                  if (MarketTickerDetails.PairId === coinSliderDetail.PairId) {

                    latestMarketData[key] = MarketTickerDetails;

                  }
                  return [];
                });
                return [];
              })

              this.setState({
                coinSliderList: latestMarketData,
                marketTickerData: MarketTickerDetail
              })
            }
          }
        }
      } catch (error) { }
    });
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.coinSliderList && nextProps.coinSliderList.length && this.state.getList === 1) {
      this.setState({ getList: 0, coinSliderList: nextProps.coinSliderList })
    }

  }

  componentWillUnmount() {

    var self = this;

    if (self.hubConnection && self.hubConnection.connection.connectionState === 1) {
      self.state.hubConnection.stop();
    }

  }

  render() {

    const settings2 = {
      slidesToShow: 4,
      slidesToScroll: 1,
      dots: false,
      autoplay: true,
      speed: 2000,
      infinite: true,
      cssEase: "linear",
      focusOnSelect: true,
      ref: (slider) => (this.settings2 = slider),
      asNavFor: this.state.settings1,
      rtl: false,
      adaptiveHeight: true,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          }
        }
      ]
    };

    return (
      <div className="sponser">
        <Container>
          <Slider {...settings2} className="slider-btn-wrap">
            {this.props.loading && <JbsSectionLoader />}
            {this.state.coinSliderList && this.state.coinSliderList.map((coinSliderDetail, key) => (
              <div key={coinSliderDetail.PairId} className="my-2">
                <div className="sliderbox">
                  <Card>
                    <div className="coinslider">
                      <div className="marketslider"><IntlMessages id="widgets.change" />  :  {parseFloat(coinSliderDetail.ChangePer).toFixed(2)}</div>
                      <ul>
                        <li>
                          <p>{coinSliderDetail.PairName.replace("_", "/")}</p>
                        </li>
                      </ul>
                    </div>
                    <div className="coinsliderprice">
                      <div className="marketcap pricecol">
                        <IntlMessages id="widgets.price" />
                        <p> {parseFloat(coinSliderDetail.CurrentRate).toFixed(8)}</p>
                      </div>
                      <div className="marketcap changecol">
                        <IntlMessages id="widgets.volume" />

                        <p>{parseFloat(coinSliderDetail.Volume24).toFixed(8)}</p>
                      </div>
                    </div>
                    <div className="coinsliderprice">
                      <div className="marketcap highcol">
                        <IntlMessages id="widgets.high" />
                        <p>{parseFloat(coinSliderDetail.High24Hr).toFixed(8)}</p>
                      </div>
                      <div className="marketcap lowcol">
                        <IntlMessages id="widgets.low" />
                        <p>{parseFloat(coinSliderDetail.Low24Hr).toFixed(8)}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            ))}
          </Slider>
          {this.state.isSiteUnderMaintenance && <Dialog
            open={this.state.isSiteUnderMaintenance}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            {<DialogTitle id="alert-dialog-slide-title">
              <strong>{<IntlMessages id="wallet.DWTableInfo" />}</strong>
            </DialogTitle>}
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                <strong>{<IntlMessages id="activityNotification.message.6062" />}</strong>
              </DialogContentText>
            </DialogContent>
          </Dialog>}
        </Container>
      </div>
    )
  }
}

const mapStateToProps = ({ coinSlider }) => {
  return {
    loading: coinSlider.loading,
    coinSliderList: coinSlider.coinSliderList,
  };
}

// connect action with store for dispatch
export default connect(
  mapStateToProps,
  {
    getCoinSliderList
  }
)(coinslider);
