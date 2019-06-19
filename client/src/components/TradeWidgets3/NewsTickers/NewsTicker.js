// Component for displaying Marquee  Data By:Tejas Date : 13/9/2018
import React from "react";

// import action
import { getNewsTickerList } from "Actions/Trade";

// import connect function for store
import { connect } from "react-redux";

class NewsTicker extends React.Component {
  constructor() {
    super();
    this.state = {
      newsText: []
    };
  }

  // This will invoke After component render
  componentDidMount() {
    // Call Actions For Get News Ticker For MArquee

    this.props.getNewsTickerList();
  }

  // This will Invoke when component will recieve Props or when props changed
  componentWillReceiveProps(nextprops) {
    if (nextprops.newsText && nextprops.newsText !== null) {
      // set pair list if gets from API only
      this.setState({ newsText: nextprops.newsText });
    }
  }

  // Render Component for News Ticker
  render() {
    const text = [];
    if (this.state.newsText) {
      this.state.newsText.map(value => {
        return [text.push(value)];
      });
    }

    return (
      <div className="clearfix">
        {text.length
          ? text.map((value, key) => (
              <marquee
                direction="left"
                speed="normal"
                behavior="loop"
                key={key}
              >
                {value.text}
              </marquee>
            ))
          : ""}
      </div>
    );
  }
}

// Set Props when actions are dispatch
const mapStateToProps = state => ({
  newsText: state.newsTicker.newsTicker
});

// connect action with store for dispatch
export default connect(
  mapStateToProps,
  {
    getNewsTickerList
  }
)(NewsTicker);
