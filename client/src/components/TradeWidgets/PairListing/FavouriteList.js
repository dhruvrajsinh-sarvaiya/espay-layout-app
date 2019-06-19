// Component for displaying Currency For Favourite Pair List  Data By:Tejas Date : 21/9/2018
import React from "react";

//import table and input type nav dat  for navigation Card
import {
  Table,
  Input,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardBody
} from "reactstrap";

// import radio button
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

//import scroll bar
import { Scrollbars } from "react-custom-scrollbars";

//import for use multiple claases in component
import classnames from "classnames";

// intl messages
import IntlMessages from "Util/IntlMessages";

// import action
import { getPairList } from "Actions/Trade";

//impor tsection loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

// import connect function for store
import { connect } from "react-redux";

// create component for favourite pair list
class FavouriteList extends React.Component {
  constructor() {
    super();
    this.state = {
      pairList: [],
      oldState: [],
      classNamed: "chn",
      random: 0,
      oldValue: 0,
      value: 0,
      textFieldValue: "",
      showLoader: true,
      searchText: "",
      searchPair: [],
      displayPair: false,
      pairsInfo: "change"
    };
  }

  // function for change pair details
  handleChange = event => {
    this.setState({ pairsInfo: event.target.value });
  };

  // This will invoke After component render
  componentWillMount() {
    // Call Actions For Get Pair List
    this.props.getPairList({ Pair: this.state.currencyPair });
  }

  // this will call after render function
  componentDidMount() {
    setInterval(
      this.props.getPairList({ Pair: this.state.currencyPair }),
      10000
    );
  }

  // This will Invoke when component will recieve Props or when props changed
  componentWillReceiveProps(nextprops) {
    if (nextprops.pairList && nextprops.pairList !== null) {
      // set pair list if gets from API only
      this.setState({
        classNamed: "blink_me",
        oldState: this.state.pairList,
        pairList: nextprops.pairList,
        showLoader: false
      });
    }

    if (
      nextprops.firstCurrency &&
      nextprops.secondCurrency &&
      nextprops.currencyPair
    ) {
      this.setState({
        firstCurrency: nextprops.firstCurrency,
        secondCurrency: nextprops.secondCurrency,
        currencyPair: nextprops.currencyPair
      });
    }
  }

  // function for search data from list
  onSearchList = (event, value) => {
    const searchText = event.target.value;
    this.setState({ searchText: searchText });
    var favourites = JSON.parse(localStorage.getItem("favourite"));
    var list = [];

    // iterate object and search pair and push into search data array
    this.state.pairList.map((value, key) => {
      if (value.currency) {
        value.currency.map(data => {
          var isAvailable = favourites.findIndex(fav => fav.pair === data.pair);
          if (isAvailable !== -1) {
            if (
              data.pair
                .split("/")[0]
                .toLowerCase()
                .indexOf(searchText) != -1
            ) {
              list.push(data);
            }
          }
        });
      }
    });

    // set state for search pair
    this.setState({ displayPair: true, searchPair: list });
  };

  // Function for Add Data in Favoourite List By Tejas : Date : 21/9/2018
  addToFavourite(value) {
    //get data from localstorage
    var favourites = JSON.parse(localStorage.getItem("favourite"));
    if (favourites) {
      var isAvailable = favourites.findIndex(fav => fav.pair === value.pair);

      // if data is availabe  remove from localstorage
      if (isAvailable !== -1) {
        favourites.splice(isAvailable, 1);
        localStorage.setItem("favourite", JSON.stringify(favourites));
      } else {
        favourites.push({ pair: value.pair });
        localStorage.setItem("favourite", JSON.stringify(favourites));
      }
    } else {
      var favourites = [];
      favourites.push({ pair: value.pair });
      localStorage.setItem("favourite", JSON.stringify(favourites));
    }
  }

  // clear search data on click of other button
  clearSearchPair = () => {
    this.setState({ searchText: "", searchPair: [], displayPair: false });
  };

  // Render Component for Pair List
  render() {
    const pairs = [];
    const oldPairs = [];
    const info = this.props.state;

    // iterate object and stores into array
    if (this.state.pairList && this.state.oldState) {
      this.state.pairList.map((value, key) => {
        this.state.oldState.map(data => {
          if (
            value.symbol === info.secondCurrency &&
            data.symbol === info.secondCurrency
          ) {
            if (value.currency) {
              value.currency.map(currency => {
                pairs.push(currency);
              });
            }
          }
        });
      });
    }

    //iterate old state data
    if (this.state.oldState) {
      this.state.oldState.map(value => {
        if (value.symbol === info.secondCurrency) {
          if (value.currency) {
            value.currency.map(data => {
              oldPairs.push(data);
            });
          }
        }
      });
    }

    // get favourites data from localstorage
    var favourites = JSON.parse(localStorage.getItem("favourite"));
    var list = [];
    if (favourites) {
      this.state.pairList.map((value, key) => {
        if (value.currency) {
          value.currency.map(data => {
            var isAvailable = favourites.findIndex(
              fav => fav.pair === data.pair
            );
            if (isAvailable !== -1) {
              list.push(data);
            }
          });
        }
      });

      // create rows for table
      var rows = list.map((value, key) => {
        var isAvailable = favourites.findIndex(fav => fav.pair === value.pair);
        var isChangedprice = oldPairs.findIndex(
          old => old.price <= value.price
        );
        var isChangedvolume = oldPairs.findIndex(
          old => old.volume <= value.volume
        );

        return (
          <tr
            key={key}
            onClick={() => {
              this.props.changePairs(value);
            }}
            style={{ cursor: "pointer" }}
          >
            <td>
              <a
                href="#"
                onClick={() => {
                  this.addToFavourite(value);
                }}
              >
                {isAvailable === -1 ? (
                  <i className="material-icons">
                    {<IntlMessages id="trading.currencypair.icon.fillstar" />}
                  </i>
                ) : (
                  <i className="material-icons">
                    {<IntlMessages id="trading.currencypair.icon.star" />}
                  </i>
                )}
              </a>
              {value.pair}
            </td>
            <td className={isChangedprice === -1 ? "" : "blink_me"}>
              {value.price}
            </td>
            {this.state.pairsInfo === "change" ? (
              <td className={value.change > 0 ? "text-success" : "text-danger"}>
                {value.change}%
              </td>
            ) : (
              <td className={isChangedvolume === -1 ? "" : "blink_me"}>
                {value.volume}%
              </td>
            )}
          </tr>
        );
      });
    } else {
      var rows = (
        <tr>
          <td colSpan="2">
            {<IntlMessages id="trading.orders.label.nodata" />}
          </td>
        </tr>
      );
    }

    if (this.state.searchPair) {
      var searchPair = this.state.searchPair.map((value, key) => {
        return (
          <tr
            key={key}
            onClick={() => {
              this.props.changePairs(value);
            }}
            style={{ cursor: "pointer" }}
          >
            <td>{value.pair}</td>
            <td>{value.price}</td>
            {this.state.pairsInfo === "change" ? (
              <td className={value.change > 0 ? "text-success" : "text-danger"}>
                {value.change}%
              </td>
            ) : (
              <td>{value.volume}%</td>
            )}
          </tr>
        );
      });
    } else {
      this.clearSearchPair();
    }

    return (
      <Card className="jbs-block col-sm-12 col-md-12 col-lg-12 d-sm-half d-md-full p-5">
        <CardBody className="pb-0 d-flex justify-content-between">
          <p className="fs-14 mt-15">
            <Input
              type="text"
              name="search"
              id="search"
              placeholder="Search"
              onChange={this.onSearchList}
            />
          </p>
          <RadioGroup
            name="pairlist"
            value={this.state.pairsInfo}
            onChange={this.handleChange}
            className="d-flex flex-row flex-nowrap fs-14 ml-5"
          >
            <FormControlLabel
              value="change"
              control={<Radio />}
              label="Change"
            />
            <FormControlLabel
              value="volume"
              control={<Radio />}
              label="Volume"
            />
          </RadioGroup>
        </CardBody>

        <div>
          <Nav tabs className="nav-pills p-5">
            <NavItem>
              <NavLink
                value=""
                className={classnames(
                  { active: this.props.state.displayFavourite },
                  "btnFavorite btn-xs m-2"
                )}
                onClick={() => {
                  this.clearSearchPair();
                  this.props.openFavourite;
                }}
              >
                {" "}
                <i className="ti-star ml-1">
                  {" "}
                  <IntlMessages id="trading.currencypair.label.favorite" />
                </i>{" "}
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                value="BTC"
                className={classnames(
                  {
                    active:
                      info.secondCurrency === "BTC" &&
                      !this.props.state.displayFavourite
                  },
                  "btn-xs m-2"
                )}
                onClick={() => {
                  this.clearSearchPair();
                  this.props.changeSecondCurrency("BTC");
                }}
              >
                {" "}
                BTC{" "}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                value="INR"
                className={classnames(
                  {
                    active:
                      info.secondCurrency === "INR" &&
                      !this.props.state.displayFavourite
                  },
                  "btn-xs m-2"
                )}
                onClick={() => {
                  this.clearSearchPair();
                  this.props.changeSecondCurrency("INR");
                }}
              >
                INR{" "}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                value="ETH"
                className={classnames(
                  {
                    active:
                      info.secondCurrency === "ETH" &&
                      !this.props.state.displayFavourite
                  },
                  "btn-xs m-2"
                )}
                onClick={() => {
                  this.clearSearchPair();
                  this.props.changeSecondCurrency("ETH");
                }}
              >
                ETH
              </NavLink>
            </NavItem>
          </Nav>
        </div>

        {this.state.showLoader && <JbsSectionLoader />}
        <div className="table-responsive-design p-5" style={{ width: "100%" }}>
          {this.state.displayPair ? (
            <Table className="table m-0 p-10">
              <thead>
                <tr className="bg-light">
                  <th>
                    {<IntlMessages id="trading.currencypair.label.pair" />}
                  </th>
                  <th>
                    {<IntlMessages id="trading.currencypair.label.price" />}
                  </th>
                  {this.state.pairsInfo === "change" ? (
                    <th className="numeric">
                      {<IntlMessages id="trading.currencypair.label.change" />}
                    </th>
                  ) : (
                    <th className="numeric">
                      {<IntlMessages id="trading.currencypair.label.volume" />}
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>{searchPair}</tbody>
            </Table>
          ) : (
            <Scrollbars
              className="jbs-scroll"
              autoHeight
              autoHeightMin={383}
              autoHeightMax={383}
              autoHide
            >
              <Table className="table m-0 p-15">
                <thead>
                  <tr className="bg-light">
                    <th>
                      {<IntlMessages id="trading.currencypair.label.pair" />}
                    </th>
                    <th>
                      {<IntlMessages id="trading.currencypair.label.price" />}
                    </th>
                    {this.state.pairsInfo === "change" ? (
                      <th className="numeric">
                        {
                          <IntlMessages id="trading.currencypair.label.change" />
                        }
                      </th>
                    ) : (
                      <th className="numeric">
                        {
                          <IntlMessages id="trading.currencypair.label.volume" />
                        }
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody>{rows}</tbody>
              </Table>
            </Scrollbars>
          )}
        </div>
      </Card>
    );
  }
}

// Set Props when actions are dispatch
const mapStateToProps = state => ({
  pairList: state.tradePairList.pairList
});

// connect action with store for dispatch
export default connect(
  mapStateToProps,
  {
    getPairList
  }
)(FavouriteList);
