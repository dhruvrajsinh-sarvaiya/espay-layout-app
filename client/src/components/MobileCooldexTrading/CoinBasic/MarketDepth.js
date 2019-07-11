import React, { Fragment,Component } from 'react';
// import High Chart Details
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
 import { connect } from "react-redux";

 //import section loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

 import {
  getMarketDepth,
} from 'Actions/Trade';

 class MarketDepth extends Component {
   constructor(props){
     super(props)
     this.state={
       askData:[],
       bidData:[]
     }
    
   }
  componentDidMount(){
    
    const pair = this.props.currencyPair
    // code changed by devang parekh for handling margin trading process
    if(this.props.hasOwnProperty('marginTrading') && this.props.marginTrading === 1) {
      this.props.getMarketDepth({ Pair: pair, marginTrading:1});
    } else {
      this.props.getMarketDepth({ Pair: pair, });
    }
    //end
        
  }

  componentWillReceiveProps(nextprops){

    var sellerorder=[];
    var buyerorder=[];

    if(nextprops.marketDepth.Bid && nextprops.marketDepth.Ask){
      
      nextprops.marketDepth.Ask.map((value,key) =>{
        if(parseFloat(value.Price) !== 0) {          
          sellerorder.push([value.Price,value.Amount])
        }
      })
      sellerorder.sort(function(a, b) {      
        return parseFloat(a) - parseFloat(b)
      })

      this.setState({
        askData:sellerorder
      })

      nextprops.marketDepth.Bid.map((value,key) =>{
        if(parseFloat(value.Price) !== 0) {          
          buyerorder.push([value.Price,value.Amount])
        }
      })

      buyerorder.sort(function(a, b) {      
        return parseFloat(a) - parseFloat(b)
      })

      this.setState({
        bidData:buyerorder
      })


    } else {

      this.setState({
        askData:[],
        bidData:[]
      })

    }
  }

  render() {
    
    const options = {          
      chart: {
        type: 'area',
        zoomType: 'xy',   
        backgroundColor: this.props.darkMode ? '#2c3644': 'transparent',   
        color:   this.props.darkMode ? 'white': '#464D69',  
     },
     title: {
      text: null,
      style: {
        color:   this.props.darkMode ? 'white': '#464D69',
      }
    },
    xAxis: [{
      type: 'logarithmic',
      title: {
        text: null,
        style: {
          color:   this.props.darkMode ? 'white': '#464D69',
        },
      },
      width: '50%',
      labels: {
        style: {
          color: 'green'
        }
      }
    }, {
      type: 'logarithmic',
      title: {
        text: null,
        style: {
          color:   this.props.darkMode ? 'white': '#464D69',
        },
      },
      labels: {
        style: {
          color: 'red'
        }
      },
      offset: 0,
      left: '50%',
      width: '50%'
    }],
    yAxis: {
      gridLineWidth: 0,
      title: {
        text: null,
        style: {
          color:   this.props.darkMode ? 'white': '#464D69',
        }
      }
    },
     responsive: {
        rules: [{
            condition: {
                maxWidth:600
            },
            chartOptions: {
                chart: {
                    height:225
                },
                subtitle: {
                    text: null
                },
                navigator: {
                    enabled: false
                }
            }
        }]
    },
    rangeSelector:{
      enabled: false,
      inputEnabled: false
    },
    legend: {
      enabled: false
    },
    scrollbar:{
      enabled: false
    },
    navigator: {
      enabled: false
    },
    plotOptions: {
      area: {
        softThreshold: true,
        marker: {
          radius: 2
        },
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 3
          }
        },
        threshold: null
      },
    },    

    series: [{
      name: 'Bids',
      type: 'area',
      data: this.state.bidData,
      color: 'rgb(161,243,121)',
      fillColor: 'rgba(161,243,121, 0.9)',
      xAxis: 0,
    }, {
      name: 'Asks',
      type: 'area',
      data: this.state.askData,
      color: 'rgb(237,114,72)',
      fillColor: 'rgba(237,114,72, 0.9)',
      xAxis: 1,
    }]
    };
    
    return (
      <Fragment>
        {this.props.loading && <JbsSectionLoader/>}         
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={"stockChart"}
            options={options}
          />                
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  marketDepth: state.tradeChart.marketDepth, 
  loading: state.tradeChart.depthLoading, 
  darkMode:state.settings.darkMode
});

export default connect(
  mapStateToProps,
  {
    getMarketDepth,            
  }
)(MarketDepth);
