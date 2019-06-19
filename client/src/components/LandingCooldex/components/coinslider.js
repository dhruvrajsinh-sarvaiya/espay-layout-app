import React, { Component } from 'react';
import {
    Card ,
    CardImg ,
    Container , Row , Col
  } from 'reactstrap';
import Slider from "react-slick";

import {
  getCoinSliderList  
} from 'Actions/LandingPage';

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

const newsData = [
    {
      Img:require("../../../assets/image/graph.png"),
      name:"Bitcoin",
      ImgCoin:require("../../../assets/image/bitcoin.png"),
      Hightcoin:"24H",
      usdprice:"USD $6405.92",
      updown:"+25.02%",
    },
    {
      Img:require("../../../assets/image/graph1.png"),
      name:"Bitcoin",
      ImgCoin:require("../../../assets/image/bitcoin.png"),
      Hightcoin:"24H",
      usdprice:"USD $6405.92",
      updown:"+25.02%",
     },
     {
      Img:require("../../../assets/image/graph2.png"),
      name:"Bitcoin",
      ImgCoin:require("../../../assets/image/bitcoin.png"),
      Hightcoin:"24H",
      usdprice:"USD $6405.92",
      updown:"+25.02%",
     },
     {
      Img:require("../../../assets/image/graph3.png"),
      name:"Bitcoin",
      ImgCoin:require("../../../assets/image/bitcoin.png"),
      Hightcoin:"24H",
      usdprice:"USD $6405.92",
      updown:"+25.02%",
     },
     {
      Img:require("../../../assets/image/graph.png"),
      name:"Bitcoin",
      ImgCoin:require("../../../assets/image/bitcoin.png"),
      Hightcoin:"24H",
      usdprice:"USD $6405.92",
      updown:"+25.02%",
     }
 ]

class coinslider extends Component {
    
    state = {
        settings2: undefined,
        coinSliderList:[],
        loading:true,
        hubConnection: new signalR.HubConnectionBuilder().withUrl(signalRURL).configureLogging(signalR.LogLevel.None).build(),
        getList:1,
        marketTickerData:[],
        isSiteUnderMaintenance:false
     }

     componentDidMount() {
        this.setState({
           settings2: this.settings2
        })
     }

    componentWillMount() {
      
      // call for getting coin slider list
      this.props.getCoinSliderList({});

      //console.log("Coin slider start conn");
      this.state.hubConnection.start().then(() => {
        //console.log("Coin slider end conn");
        this.setState({hubConnection:this.state.hubConnection});
        //console.log(this.state.hubConnection)

        // code added by devang parekh for handling site under maintenance (15-3-2019)
        this.state.hubConnection.on("ReceiveEnvironmentMode",(environmentDetail) => {
                        
          //console.log("Get Data from signalR ReceiveEnvironmentMode", environmentDetail);
          try {

              environmentDetail = JSON.parse(environmentDetail);
              
              if(typeof environmentDetail.Data !== 'undefined' && environmentDetail.Data !== '') {
                  
                  if(typeof environmentDetail.Data.MsgCode !== 'undefined' && parseInt(environmentDetail.Data.MsgCode) === 6062 ) { // MsgCode => 6062 : under maintance, 6063 : for live 
                      this.setState({isSiteUnderMaintenance:true});
                  } else {
                      this.setState({isSiteUnderMaintenance:false});
                  }
                  //NotificationManager.error(<IntlMessages id={`ectivityEnvironment.message.${environmentDetail.Data.MsgCode}`} values={environmentDetail.Data} />);
              }
              
          } catch(error) {
              //console.log("error",error)
          }
          
          setTimeout(function(){
              window.location.href = '/';
          },5000)

        });
      //end

      });

      this.state.hubConnection.on("RecieveMarketTicker",(MarketTickerData) => {
                    
        //console.log("Get Data from signalR RecieveMarketTicker", MarketTickerData);
        try {

            const MarketTickerDetail = JSON.parse(MarketTickerData);    
            
            if ((MarketTickerDetail.EventTime && this.state.marketTickerData.length === 0) || 
              (this.state.marketTickerData.length > 0 && MarketTickerDetail.EventTime > this.state.marketTickerData.EventTime) ) {     
                
                if(MarketTickerDetail.Data && MarketTickerDetail.Data.length) {
                  
                  if(MarketTickerDetail.Data.length > 1) {

                    this.setState({
                      coinSliderList:MarketTickerDetail.Data,
                      marketTickerData : MarketTickerDetail
                    })
                    
                  } else {
                    
                    var latestMarketData = this.state.coinSliderList;

                    latestMarketData.map((coinSliderDetail, key) => {

                      MarketTickerDetail.Data.map((MarketTickerDetail, key) => {

                        if(MarketTickerDetail.PairId === coinSliderDetail.PairId) {

                          latestMarketData[key] = MarketTickerDetail;

                        }

                      });

                    })

                    this.setState({
                      coinSliderList:latestMarketData,
                      marketTickerData : MarketTickerDetail
                    })
                    
                  }

                } 

            } 
            
        } catch(error) {
          //console.log(error)
        }
        
      });

    }
 
    componentWillReceiveProps(nextProps) {

      if(nextProps.coinSliderList && nextProps.coinSliderList.length && this.state.getList === 1) {
        this.setState({getList:0,coinSliderList:nextProps.coinSliderList})
      }

    }

    componentWillUnmount() {

      var self = this;
      
      if(self.hubConnection && self.hubConnection.connection.connectionState === 1 ) {
        self.state.hubConnection.stop();
      }

    }

    render() {

        //console.log("Coin slider List",this.state.coinSliderList);

        const settings2 = {
            slidesToShow:4,
            slidesToScroll: 1,
            dots: false,
            autoplay: true,
            speed:2000,
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
            {this.props.loading &&
              <JbsSectionLoader />
            }
               {this.state.coinSliderList && this.state.coinSliderList.map((coinSliderDetail, key) => (
                  <div key={coinSliderDetail.PairId} className="my-2">
                      <div className="sliderbox">
                      <Card>
                        <div className="coinslider">
                        <div className="marketslider"><IntlMessages id="widgets.change"/>  :  {parseFloat(coinSliderDetail.ChangePer).toFixed(2)}</div>
                          <ul>
                            <li>
                              {/* <CardImg src={coinSliderDetail.ImgCoin} className="img-fluid" alt="All Sponser's Logo" /> */}
                              <p>{coinSliderDetail.PairName.replace("_","/")}</p>
                            </li>
                          </ul>
                        </div>
                        <div className="coinsliderprice">
                          <div className="marketcap pricecol">
                            <IntlMessages id="widgets.price"/>
                            <p> {parseFloat(coinSliderDetail.CurrentRate).toFixed(8)}</p>                            
                            </div>
                            <div className="marketcap changecol">
                            <IntlMessages id="widgets.volume"/>
                            
                            <p>{parseFloat(coinSliderDetail.Volume24).toFixed(8)}</p>
                          </div>
                        </div>
                        <div className="coinsliderprice">
                        <div className="marketcap highcol">
                            <IntlMessages id="widgets.high"/> 
                            <p>{parseFloat(coinSliderDetail.High24Hr).toFixed(8)}</p>
                          </div>
                          <div className="marketcap lowcol">
                            <IntlMessages id="widgets.low"/> 
                            <p>{parseFloat(coinSliderDetail.Low24Hr).toFixed(8)}</p>
                          </div>
                        </div>                        
                        {/* <Col md="12">
                          <CardImg src={coinSliderDetail.Img} className="img-fluid" alt="All Sponser's Logo" />
                        </Col> */}
                      </Card>
                      </div>
                  </div>
               ))}

            </Slider>
            {/* <Slider {...settings2} className="slider-btn-wrap">
            {newsData && newsData.map((news, key) => (
                  <div key={news.id} className="my-2">
                      <div className="sliderbox">
                      <Card>
                        <div className="coinslider">
                          <span>{news.Hightcoin}</span>
                          <ul>
                            <li>
                              <CardImg src={news.ImgCoin} className="img-fluid" alt="All Sponser's Logo" />
                              <p>{news.name}</p>
                            </li>
                          </ul>
                        </div>
                        <div className="coinsliderprice">
                              <span>{news.usdprice}</span>
                              <p>{news.updown}</p>
                          </div>
                        <Col md="12">
                          <CardImg src={news.Img} className="img-fluid" alt="All Sponser's Logo" />
                        </Col>
                      </Card>
                      </div>
                  </div>
               ))}
            </Slider> */}
            { this.state.isSiteUnderMaintenance && <Dialog
                    open={this.state.isSiteUnderMaintenance}
                    TransitionComponent={Transition}
                    keepMounted
                    //onClose={this.handleNoWalletConfirmation}
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
                    {/* <DialogActions>
                        <Button variant="raised" onClick={(e) => this.handleNoWalletConfirmation(e)} className="btn-success text-white mr-10">{<IntlMessages id="wallet.AGDialogButtonAgree" />}</Button>
                    </DialogActions> */}
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
