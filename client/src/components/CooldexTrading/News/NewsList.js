import React, { Component } from 'react';

// import scroll bar
import { Scrollbars } from "react-custom-scrollbars";

import ReactHtmlParser from 'react-html-parser';

import {getNews} from 'Actions/News';
import {connect} from 'react-redux';

// intl messages
import IntlMessages from "Util/IntlMessages";

class NewsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newslist: []
    };
  }

  componentWillMount() {
    this.props.getNews();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
        newslist: nextProps.newslist,
    });
  }

  render() {
    const newslist =this.state.newslist;
    
    return (
      <div className="newstitle">          
              <h3><IntlMessages id="trading.newTrading.news.text"/></h3>
              <Scrollbars
                className="jbs-scroll"
                autoHeight
                autoHeightMin={this.props.autoHeightMin}
                autoHeightMax={this.props.autoHeightMax}
                autoHide
            >
                 {newslist.length !== 0 && newslist.map((headline,key) => {
                    if (headline && headline.locale && typeof headline.locale[localStorage.getItem('locale')]!='undefined' && typeof headline.locale[localStorage.getItem('locale')].content!='undefined') {
                      return (                        
                          <span key={key}>{ReactHtmlParser(headline && headline.locale && headline.locale[localStorage.getItem('locale')] && headline.locale[localStorage.getItem('locale')].content)}</span>                          
                        );
                      }
                  })}   
                 </Scrollbars>
        </div>

      
    )
  }
}

const mapStateToProps = ({news}) => {
	const { newslist } = news;
  return { newslist}
}

export default connect(mapStateToProps, {getNews
})(NewsList);

