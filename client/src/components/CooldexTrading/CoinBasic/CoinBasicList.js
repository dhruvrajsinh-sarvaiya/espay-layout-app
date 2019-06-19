import React, { Component } from 'react';

// import scrollbar
import { Scrollbars } from "react-custom-scrollbars";

import {getCoinlist} from 'Actions/Coinlist';
import {connect} from 'react-redux';

import AppConfig from 'Constants/AppConfig';

// intl messages
import IntlMessages from "Util/IntlMessages";

 class CoinBasicList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      coinlist: [],
      loading:true
    };
  }

  componentWillMount() {
    this.props.getCoinlist();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.coindata.statusCode==200)
    {
      this.setState({
        coinlist: nextProps.coindata.Response,        
      });
    }
  }

  render() {
    const Coinlist =this.state.coinlist;

    return (
      <div>
        <div className="coinbasetitle"><IntlMessages id="trading.newTrading.coinbasic.text" /> </div>
        <Scrollbars
          className="jbs-scroll"
          autoHeight
          autoHeightMin={this.props.autoHeightMin}
          autoHeightMax={this.props.autoHeightMax}
          autoHide
        >
        {Coinlist &&Coinlist.map((coinlist, key) => (
            <div key={key} className="coinbasicbox">
                <h3>{coinlist.Name}  (<span>{coinlist.SMSCode}</span> )</h3>
                <p>
                {coinlist.Introduction.substring(0,300)+"..."}
                </p>            
            </div>
          ))
        }         
          </Scrollbars>
      </div>
    )
  }
}
const mapStateToProps = ({coinlist}) => {
  var response = {
		coindata:coinlist.data,
		loading: coinlist.loading,
  };
  return response
}

export default connect(mapStateToProps, {getCoinlist
})(CoinBasicList);