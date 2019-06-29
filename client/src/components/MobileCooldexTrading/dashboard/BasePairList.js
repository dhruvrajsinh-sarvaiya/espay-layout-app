import React, { Component } from "react";
import { connect } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
//import { NotificationManager } from 'react-notifications';
import SwipeableViews from "react-swipeable-views";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
//import List from '@material-ui/core/List';
import ListItem from "@material-ui/core/ListItem";
//import Loadable from 'react-loadable';
import { Scrollbars } from "react-custom-scrollbars";
// Preloader show before data rendering
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";
// jbs section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
// redux action
import { getPairList, getUpdatedPairList } from "Actions";

// Tab container for list pair
function TabContainer({ children }) {
  return <Typography component="div">{children}</Typography>;
}

// Pair List Component
class BasePairList extends Component {
  state = {
    value: 0,
    pairList: []
  };
  // involk before render content
  componentWillMount() {
    //load pair once
    this.props.getPairList({});
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }
  // involk after render content
  componentDidMount() {
    this.timer = setInterval(() => {
      //refresh data from api every 5 second
      this.props.getUpdatedPairList();
    }, 1000);
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.pairList && nextprops.pairList !== null) {
      // set pair list if gets from API only
      this.setState({ pairList: nextprops.pairList });
    }
  }

  handleChange = (event, value) => {
    // set tab index value
    this.setState({ value });
  };
  //on click pair change
  pairChange(pair) { }
  // change tab selection
  handleChangeIndex = index => {
    //set tab index value
    this.setState({ value: index });
  };

  render() {
    return (
      <div>
        {this.props.sectionReload && <PreloadWidget />}
        {this.props.sectionReload && <JbsSectionLoader />}
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            fullWidth
          >
            {this.state.pairList &&
              this.state.pairList !== null &&
              this.state.pairList.map((pair, key) => (
                <Tab label={pair.name} key={key} className="font-weight-bold" />
              ))}
          </Tabs>
        </AppBar>
        <SwipeableViews
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          {this.state.pairList ? (
            this.state.pairList &&
            this.state.pairList !== null &&
            this.state.pairList.map((pair, index) => (
              <TabContainer key={index}>
                <Scrollbars
                  className="jbs-scroll initialism"
                  autoHeight
                  autoHeightMin={100}
                  autoHeightMax={550}
                  autoHide
                >
                  <ListItem
                    key={index}
                    className="border-bottom d-flex justify-content-between align-items-center p-5 pl-20 pr-20"
                  >
                    <div className="w-40 d-flex">
                      <span className="font-weight-bold">PAIR</span>
                    </div>
                    <div className="w-20 d-flex">
                      <span className="font-weight-bold">VOLUME</span>
                    </div>
                    <div className="w-40 d-flex justify-content-between">
                      <span className="font-weight-bold">CHANGE</span>
                      <span className="font-weight-bold">PRICE</span>
                    </div>
                  </ListItem>
                  {pair.pairs.map((list, i) => (
                    <ListItem
                      key={i}
                      className="border-bottom d-flex justify-content-between align-items-center p-5 pl-20 pr-20"
                      button
                      onClick={() => this.pairChange(list.pair_symbol)}
                    >
                      <div className="w-40 d-flex">
                        <span className="w-20 d-flex" />
                        <span>
                          {list.to_symbol}/{list.from_symbol}
                        </span>
                      </div>
                      <div className="w-20 d-flex">
                        <span>{list.volume}</span>
                      </div>
                      <div className="w-40 d-flex justify-content-between">
                        <span>
                          {list.percentage_diff > 0 ? (
                            <i className="ti-arrow-up mr-10 text-success" />
                          ) : (
                              <i className="ti-arrow-down mr-10 text-danger" />
                            )}
                          {list.percentage_diff > 0 ? (
                            <span className="text-success">
                              {list.percentage_diff}%
                            </span>
                          ) : (
                              <span className="text-danger">
                                {list.percentage_diff}%
                            </span>
                            )}
                        </span>
                        <span>{list.marketRate}</span>
                      </div>
                    </ListItem>
                  ))}
                </Scrollbars>
              </TabContainer>
            ))
          ) : (
              <div>No Data Found</div>
            )}
        </SwipeableViews>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  pairList: state.pairList
});

export default connect(
  mapStateToProps,
  {
    getPairList,
    getUpdatedPairList
  }
)(BasePairList);
