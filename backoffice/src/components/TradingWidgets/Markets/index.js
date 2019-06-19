import React, { Component } from 'react';
import { Card } from 'reactstrap';
import Slider from "react-slick";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { connect } from "react-redux";

import { getMarketsDataList } from 'Actions/Trading';
// import for display Loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

//Slider Settings nextarrow
function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "none" }}
      onClick={onClick}
    />
  );
}

//Slider Settings prevarrow
function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "none" }}
      onClick={onClick}
    />
  );
}

class Markets extends Component {

  state = {
    settings2: undefined,
    marketsData: [],
    loading: true,
    getList: 1,
    marketTickerData: [],
    //added by parth andhariya
    marginTradingBit: this.props.marginTradingBit
  }

  componentDidMount() {
    this.setState({
      settings2: this.settings2
    })
  }

  componentWillMount() {
    //added by parth andhariya
    if (this.state.marginTradingBit === 1) {
      // call for getting coin slider list
      this.props.getMarketsDataList({ IsMargin: 1 });
    } else {
      this.props.getMarketsDataList({});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.marketsData && nextProps.marketsData.length && this.state.getList === 1) {
      this.setState({ getList: 0, marketsData: nextProps.marketsData })
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
            nextArrow: <SampleNextArrow />,
            prevArrow: <SamplePrevArrow />,
            className: "left",
            infinite: false,
            Padding: "-50px",
          }
        }
      ]
    };

    return (
      <div className="sponser maintrading_cards">
        <Slider {...settings2} className="slider-btn-wrap">
          {this.props.loading &&
            <JbsSectionLoader />
          }
          {this.state.marketsData && this.state.marketsData.map((coinSliderDetail, key) => (
            <div key={coinSliderDetail.PairId} className="my-2">
              <div className="sliderbox">
                <Card>
                  <div className="coinslider">
                    <div className="marketslider"><IntlMessages id="widgets.volume" /> : {parseFloat(coinSliderDetail.Volume24).toFixed(2)}</div>
                    <ul>
                      <li>
                        <p>{coinSliderDetail.PairName.replace("_", "/")}</p>
                      </li>
                    </ul>
                  </div>
                  <div className="coinsliderprice">
                    <div className="marketcap">
                      <IntlMessages id="widgets.price" />
                      <p> {parseFloat(coinSliderDetail.CurrentRate).toFixed(8)}</p>
                    </div>
                    <div className="marketcap">
                      <IntlMessages id="widgets.change" />
                      <p> {parseFloat(coinSliderDetail.ChangePer).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="coinsliderprice">
                    <div className="marketcap">
                      <IntlMessages id="widgets.high" />
                      <p>{parseFloat(coinSliderDetail.High24Hr).toFixed(8)}</p>
                    </div>
                    <div className="marketcap">
                      <IntlMessages id="widgets.low" />
                      <p>{parseFloat(coinSliderDetail.Low24Hr).toFixed(8)}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    )
  }
}

const mapStateToProps = ({ marketsData }) => {
  return {
    loading: marketsData.loading,
    marketsData: marketsData.marketsData,
  };
}

// connect action with store for dispatch
export default connect(
  mapStateToProps,
  {
    getMarketsDataList
  }
)(Markets);
