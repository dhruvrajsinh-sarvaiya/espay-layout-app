// Component for displaying Currency Pair  Data By:Tejas Date : 13/9/2018

import React from "react";

// import for navigation bar Card
import { Table, Input, Nav, NavItem, NavLink, Row, Col } from "reactstrap";

// import scroll bar
import { Scrollbars } from "react-custom-scrollbars";

//import for use multiple classes in component
import classnames from "classnames";

// intl messages
import IntlMessages from "Util/IntlMessages";

// import action
import {
    getPairList,
    getVolumeData,
    getFavouritePairList,
    addToFavouritePairList,
    removeFromFavouritePairList,
} from "Actions/Trade";

// import section loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

// import connect function for store
import { connect } from "react-redux";

import $ from "jquery";

class PairList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pairList: this.props.pairData,
            volumeData: [],
            oldState: [],
            random: 0,
            oldValue: 0,
            value: 0,
            textFieldValue: "",
            showLoader: true,
            searchText: "",
            searchPair: [],
            displayPair: false,
            pairsInfo: "change",
            currencyPair: "",
            firstCurrency: this.props.firstCurrency,
            secondCurrency: this.props.secondCurrency,
            oldVolumeData: [],
            displayPairlist: 0,
            socketData: [],
            oldPairLists: [],
            favouritesPairList: [],
            favouriteListBit: 1,
        };
    }

    // handle change event for particular pair list
    handleChange = (event) => {
        this.setState({ pairsInfo: event.target.value });
    };

    componentWillMount() {
        this.isComponentActive = 1;

        // code changed by devang parekh for handling margin trading process
        if (
            this.props.hasOwnProperty("marginTrading") &&
            this.props.marginTrading === 1
        ) {
            // Call Actions For Get pair List
            this.props.getFavouritePairList({ marginTrading: 1 });
            this.processForMarginTrading(); // call for intialize socket listners for margin trading
        } else {
            // Call Actions For Get pairy List
            this.props.getFavouritePairList({});
            this.processForNormalTrading(); // call for intialize socket listners for normal trading
        }

        // code end (21-2-2019)

    }

    // code for handle signalr listners for normal trading
    processForNormalTrading() {

        this.props.hubConnection.on("RecievePairData", (pairListData) => {
            //console.log("Get Data from signalR RecievePairData", pairListData);
            if (this.isComponentActive === 1 && pairListData !== null) {
                var pairList = this.state.pairList;
                var oldPairLists = [];

                try {
                    const pairListDataDetail = JSON.parse(pairListData);

                    const newVolumeData = pairListDataDetail.Data;

                    if (
                        (pairListDataDetail.EventTime &&
                            this.state.socketData.length === 0) ||
                        (this.state.socketData.length !== 0 &&
                            pairListDataDetail.EventTime >=
                            this.state.socketData.EventTime)
                    ) {
                        if (
                            typeof pairListDataDetail.IsMargin !==
                            "undefined" &&
                            pairListDataDetail.IsMargin === 0
                        ) {
                            pairList.map((value, key) => {
                                if (
                                    value.Abbrevation ===
                                    this.props.secondCurrency
                                ) {
                                    oldPairLists = value.PairList;
                                    value.PairList.map(
                                        (newPairItem, indexValue) => {
                                            // if(newPairItem.PairId == newVolumeData.PairId){
                                            if (
                                                newPairItem.PairName ===
                                                newVolumeData.PairName
                                            ) {
                                                newPairItem.CurrentRate =
                                                    newVolumeData.CurrentRate;
                                                newPairItem.ChangePer =
                                                    newVolumeData.ChangePer;
                                                newPairItem.Volume =
                                                    newVolumeData.Volume24;
                                                newPairItem.UpDownBit =
                                                    newVolumeData.UpDownBit;
                                                newPairItem.changeBit =
                                                    newVolumeData.UpDownBit;
                                            }
                                        }
                                    );
                                }
                            });

                            this.setState({
                                pairList: pairList,
                                oldPairLists: oldPairLists,
                                socketData: pairListDataDetail,
                            });
                        }
                    }
                } catch (error) { }
            }
        });
    }

    // code for handle signalr listners for margin trading
    processForMarginTrading() {

        this.props.hubConnection.on("RecievePairData", (pairListData) => {

            //console.log("margin Get Data from signalR RecievePairData", pairListData);
            if (this.isComponentActive === 1 && pairListData !== null) {
                var pairList = this.state.pairList;
                var oldPairLists = [];

                try {
                    const pairListDataDetail = JSON.parse(pairListData);

                    const newVolumeData = pairListDataDetail.Data;

                    if (
                        (pairListDataDetail.EventTime &&
                            this.state.socketData.length === 0) ||
                        (this.state.socketData.length !== 0 &&
                            pairListDataDetail.EventTime >=
                            this.state.socketData.EventTime)
                    ) {
                        if (
                            typeof pairListDataDetail.IsMargin !==
                            "undefined" &&
                            pairListDataDetail.IsMargin === 1
                        ) {
                            pairList.map((value, key) => {
                                if (
                                    value.Abbrevation ===
                                    this.props.secondCurrency
                                ) {
                                    oldPairLists = value.PairList;
                                    value.PairList.map(
                                        (newPairItem, indexValue) => {
                                            // if(newPairItem.PairId == newVolumeData.PairId){
                                            if (
                                                newPairItem.PairName ===
                                                newVolumeData.PairName
                                            ) {
                                                newPairItem.CurrentRate =
                                                    newVolumeData.CurrentRate;
                                                newPairItem.ChangePer =
                                                    newVolumeData.ChangePer;
                                                newPairItem.Volume =
                                                    newVolumeData.Volume24;
                                                newPairItem.UpDownBit =
                                                    newVolumeData.UpDownBit;
                                                newPairItem.changeBit =
                                                    newVolumeData.UpDownBit;
                                            }
                                        }
                                    );
                                }
                            });

                            this.setState({
                                pairList: pairList,
                                oldPairLists: oldPairLists,
                                socketData: pairListDataDetail,
                            });
                        }
                    }
                } catch (error) {
                    //console.log("pair data ",error)
                }
            }
        });
    }

    componentWillUnmount() {
        this.isComponentActive = 0;
    }

    // This will Invoke when component will recieve Props or when props changed
    componentWillReceiveProps(nextprops) {
        if (nextprops.pairData.length !== 0 && nextprops.pairData !== null) {
            // set pair list if gets from API only
            this.setState({
                oldState: this.state.pairList,
                pairList: nextprops.pairData,
            });
        }

        if (nextprops.firstCurrency !== this.state.firstCurrency) {
            this.setState({
                firstCurrency: nextprops.firstCurrency,
            });
        }

        if (nextprops.secondCurrency !== this.state.secondCurrency) {
            this.setState({
                secondCurrency: nextprops.secondCurrency,
                volumeData: [],
                oldVolumeData: [],
                pairList: this.state.pairList,
            });
        }

        if (
            nextprops.favouritePairList &&
            this.state.favouriteListBit &&
            Array.isArray(nextprops.favouritePairList) &&
            nextprops.favouritePairList.length &&
            this.state.favouritesPairList.length === 0
        ) {
            var favoritePairDetail = [];
            nextprops.favouritePairList.map((value, key) => {
                favoritePairDetail.push({ pair: value.PairId });
            });

            this.setState({
                favouriteListBit: 0,
                favouritesPairList: favoritePairDetail,
            });
        }
    }

    // Seach PaiList By Tejas Date : 21/9/2018
    onSearchList = (event, value) => {
        const searchText = event.target.value;
        if (searchText !== "") {
            this.setState({ searchText: searchText, displayPair: true });
        } else {
            this.setState({ searchText: "", displayPair: false });
        }
    };

    // Function for Add Data in Favoourite List By Tejas : Date : 21/9/2018
    addToFavourite = (event, value) => {
        event.stopPropagation();
        if (this.state.favouritesPairList) {
            var isAvailable = this.state.favouritesPairList.findIndex(
                (fav) => fav.pair === value.PairId
            );
            //console.log("isAvailable",isAvailable);
            if (isAvailable !== -1) {
                var PairData = this.state.favouritesPairList[isAvailable];
                this.state.favouritesPairList.splice(isAvailable, 1);
                this.setState({
                    favouritesPairList: this.state.favouritesPairList,
                });
                // code changed by devang parekh for handling margin trading process
                if (
                    this.props.hasOwnProperty("marginTrading") &&
                    this.props.marginTrading === 1
                ) {
                    PairData.marginTrading = 1;
                    this.props.removeFromFavouritePairList(PairData);
                } else {
                    this.props.removeFromFavouritePairList(PairData);
                }
                //end
            } else {
                this.state.favouritesPairList.push({ pair: value.PairId });
                this.setState({
                    favouritesPairList: this.state.favouritesPairList,
                });
                // code changed by devang parekh for handling margin trading process
                if (
                    this.props.hasOwnProperty("marginTrading") &&
                    this.props.marginTrading === 1
                ) {
                    value.marginTrading = 1;
                    this.props.addToFavouritePairList(value);
                } else {
                    this.props.addToFavouritePairList(value);
                }
                //end

            }

        } else {
            this.state.favouritesPairList.push({ pair: value.PairId });
            this.setState({
                favouritesPairList: this.state.favouritesPairList,
            });
            // code changed by devang parekh for handling margin trading process
            if (
                this.props.hasOwnProperty("marginTrading") &&
                this.props.marginTrading === 1
            ) {
                value.marginTrading = 1;
                this.props.addToFavouritePairList(value);
            } else {
                this.props.addToFavouritePairList(value);
            }
            //end

        }
    };

    // clear search data
    clearSearchPair = () => {
        this.setState({ searchText: "", searchPair: [], displayPair: false });
    };

    // Render Component for Pair List
    render() {
        var pairsRow = [];
        var favouriteList = [];
        var searchPair = [];
        $(".sellOrderClass").removeClass("blink_me");

        if (this.props.displayFavourite && this.state.pairList.length !== 0) {
            pairsRow = [];
            var oldPairLists = this.state.oldPairLists;
            this.state.pairList.map((value, key) => {
                value.PairList.map((newPairItem, indexValue) => {
                    var isAvailablePairList = this.state.favouritesPairList.findIndex(
                        (fav) => fav.pair === newPairItem.PairId
                    );

                    if (isAvailablePairList !== -1) {
                        favouriteList.push(newPairItem);
                    }
                });
            });

            favouriteList.map((value, indexValue) => {
                var pair =
                    value.PairName.split("_")[0] +
                    "/" +
                    value.PairName.split("_")[1];
                var findIndexValuePrice = oldPairLists.findIndex(
                    (oldPairItem) =>
                        oldPairItem.CurrentRate === value.CurrentRate
                );
                var lastPrice = 0;

                var findIndexValuePer = oldPairLists.findIndex(
                    (oldPairItem) => oldPairItem.ChangePer === value.ChangePer
                );
                var lastChange = 0;

                var findIndexValueVolume = oldPairLists.findIndex(
                    (oldPairItem) => oldPairItem.Volume === value.Volume
                );
                var lastVolume = 0;

                if (findIndexValuePrice !== -1) {
                    lastPrice = oldPairLists[findIndexValuePrice].CurrentRate;
                }

                if (findIndexValuePer !== -1) {
                    lastChange = oldPairLists[findIndexValuePer].ChangePer;
                }

                if (findIndexValueVolume !== -1) {
                    lastVolume = oldPairLists[findIndexValueVolume].Volume;
                }

                pairsRow.push(
                    <PairListRow
                        key={indexValue}
                        index={indexValue}
                        pair={pair}
                        newPrice={value.CurrentRate}
                        oldPrice={lastPrice}
                        newChange={value.ChangePer}
                        oldChange={lastChange}
                        newVolume={value.Volume}
                        addToFavourite={this.addToFavourite}
                        oldVolume={lastVolume}
                        openModal={this.openModal}
                        isAvailable={isAvailable}
                        indexValue={indexValue}
                        changePairs={this.props.changePairs}
                        value={value}
                        pairsInfo={this.state.pairsInfo}
                        upDownBit={value.UpDownBit}
                        changeBit={value.changeBit ? value.changeBit : 0}
                    />
                );
                return [];
            });
        } else if (
            this.state.pairList.length !== 0 &&
            this.props.displayFavourite === false
        ) {
            // Display Pairlist When GetVolumedata  id not Available
            oldPairLists = this.state.oldPairLists;

            var isAvailable = null;
            this.state.pairList.map((value, key) => {
                if (value.Abbrevation === this.props.secondCurrency) {
                    // oldPairLists = value.PairList;
                    value.PairList.map((newPairItem, indexValue) => {
                        //  Display Record when Search Pair
                        if (this.state.searchText !== "") {
                            if (
                                newPairItem.Abbrevation.toLowerCase().indexOf(
                                    this.state.searchText
                                ) !== -1 ||
                                newPairItem.Abbrevation.indexOf(
                                    this.state.searchText
                                ) !== -1
                            ) {
                                var findIndexValuePrice = oldPairLists.findIndex(
                                    (oldPairItem) =>
                                        oldPairItem.CurrentRate ===
                                        newPairItem.CurrentRate
                                );
                                var lastPrice = 0;

                                var findIndexValuePer = oldPairLists.findIndex(
                                    (oldPairItem) =>
                                        oldPairItem.ChangePer ===
                                        newPairItem.ChangePer
                                );
                                var lastChange = 0;

                                var findIndexValueVolume = oldPairLists.findIndex(
                                    (oldPairItem) =>
                                        oldPairItem.Volume ===
                                        newPairItem.Volume
                                );
                                var lastVolume = 0;

                                if (findIndexValuePrice !== -1) {
                                    lastPrice =
                                        oldPairLists[findIndexValuePrice]
                                            .CurrentRate;
                                }

                                if (findIndexValuePer !== -1) {
                                    lastChange =
                                        oldPairLists[findIndexValuePer]
                                            .ChangePer;
                                }

                                if (findIndexValueVolume !== -1) {
                                    lastVolume =
                                        oldPairLists[findIndexValueVolume]
                                            .Volume;
                                }

                                searchPair.push(
                                    <PairListRow
                                        key={indexValue}
                                        index={indexValue}
                                        upDownBit={newPairItem.UpDownBit}
                                        pair={
                                            newPairItem.Abbrevation +
                                            "/" +
                                            this.props.secondCurrency
                                        }
                                        newPrice={newPairItem.CurrentRate}
                                        oldPrice={lastPrice}
                                        newChange={newPairItem.ChangePer}
                                        oldChange={lastChange}
                                        addToFavourite={this.addToFavourite}
                                        isAvailable={isAvailable}
                                        newVolume={newPairItem.Volume}
                                        oldVolume={lastVolume}
                                        openModal={this.openModal}
                                        indexValue={indexValue}
                                        changePairs={this.props.changePairs}
                                        value={newPairItem}
                                        pairsInfo={this.state.pairsInfo}
                                    />
                                );
                            }
                        } else {
                            if (this.state.favouritesPairList) {
                                isAvailable = this.state.favouritesPairList.findIndex(
                                    (fav) => fav.pair === newPairItem.PairId
                                );
                            } else {
                                isAvailable = null;
                            }
                            // Actual Display Data  without search
                            findIndexValuePrice = oldPairLists.findIndex(
                                (oldPairItem) =>
                                    oldPairItem.CurrentRate ===
                                    newPairItem.CurrentRate
                            );
                            lastPrice = 0;

                            findIndexValuePer = oldPairLists.findIndex(
                                (oldPairItem) =>
                                    oldPairItem.ChangePer ===
                                    newPairItem.ChangePer
                            );
                            lastChange = 0;

                            findIndexValueVolume = oldPairLists.findIndex(
                                (oldPairItem) =>
                                    oldPairItem.Volume === newPairItem.Volume
                            );
                            lastVolume = 0;

                            if (findIndexValuePrice !== -1) {
                                lastPrice =
                                    oldPairLists[findIndexValuePrice]
                                        .CurrentRate;
                            }

                            if (findIndexValuePer !== -1) {
                                lastChange =
                                    oldPairLists[findIndexValuePer].ChangePer;
                            }

                            if (findIndexValueVolume !== -1) {
                                lastVolume =
                                    oldPairLists[findIndexValueVolume].Volume;
                            }

                            pairsRow.push(
                                <PairListRow
                                    key={indexValue}
                                    index={indexValue}
                                    pair={
                                        newPairItem.Abbrevation +
                                        "/" +
                                        this.props.secondCurrency
                                    }
                                    newPrice={newPairItem.CurrentRate}
                                    oldPrice={lastPrice}
                                    newChange={newPairItem.ChangePer}
                                    oldChange={lastChange}
                                    newVolume={newPairItem.Volume}
                                    addToFavourite={this.addToFavourite}
                                    oldVolume={lastVolume}
                                    openModal={this.openModal}
                                    indexValue={indexValue}
                                    isAvailable={isAvailable}
                                    changePairs={this.props.changePairs}
                                    value={newPairItem}
                                    pairsInfo={this.state.pairsInfo}
                                    upDownBit={newPairItem.UpDownBit}
                                    changeBit={
                                        newPairItem.changeBit
                                            ? newPairItem.changeBit
                                            : 0
                                    }
                                />
                            );
                        }
                    });
                }
            });
        }
        //}

        if (pairsRow.length !== 0) {
            this.state.showLoader = false;
        }
        return (
            <div className="d-sm-full p-0">
                <div>
                    <Row>
                        <Col md={6} />
                        <Col md={6}>
                            <div className="pt-10 pl-10 pr-10 m-0 pairlistsearch">
                                <IntlMessages id="trading.currencypair.text.search">
                                    {(placeholder) => (
                                        <Input
                                            type="text"
                                            value={this.state.searchText}
                                            name="search"
                                            id="search"
                                            placeholder={placeholder}
                                            onChange={this.onSearchList}
                                        />
                                    )}
                                </IntlMessages>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Nav tabs className="dropdownboxmenu">
                                <NavItem>
                                    <NavLink
                                        value=""
                                        className={classnames(
                                            {
                                                active: this.props
                                                    .displayFavourite,
                                            },
                                            "btn-xs m-2"
                                        )}
                                        onClick={() => {
                                            this.clearSearchPair();
                                            this.props.displayFavouritePair();
                                        }}
                                    >
                                        {" "}
                                        <i className="ti-star ml-1" />{" "}
                                        <IntlMessages id="trading.currencypair.label.favorite" />{" "}
                                    </NavLink>
                                </NavItem>
                                {this.state.pairList.map((value, key) => (
                                    <NavItem key={key}>
                                        <NavLink
                                            value={value.Abbrevation}
                                            className={classnames(
                                                {
                                                    active:
                                                        this.props
                                                            .secondCurrency ===
                                                        value.Abbrevation &&
                                                        !this.props
                                                            .displayFavourite,
                                                },
                                                "btn-xs m-2"
                                            )}
                                            onClick={() => {
                                                this.clearSearchPair();
                                                this.props.changeSecondCurrency(
                                                    value
                                                );
                                            }}
                                        >
                                            {" "}
                                            {value.Abbrevation}{" "}
                                        </NavLink>
                                    </NavItem>
                                ))}
                            </Nav>
                        </Col>
                    </Row>
                </div>

                {this.state.showLoader &&
                    <JbsSectionLoader />
                }

                <div className="table-responsive-design p-5">
                    <div
                        className={
                            this.props.darkMode
                                ? "AdvacePairListtable-darkmode"
                                : "AdvacePairListtable"
                        }
                    >
                        {this.state.displayPair ? (
                            <div>
                                <Table className="table m-0 p-0">
                                    <thead>
                                        <tr className="bg-light">
                                            <th>
                                                {
                                                    <IntlMessages id="trading.currencypair.label.pair" />
                                                }
                                            </th>
                                            <th>
                                                {
                                                    <IntlMessages id="trading.currencypair.label.price" />
                                                }
                                            </th>
                                            <th className="numeric">
                                                {
                                                    <IntlMessages id="trading.currencypair.label.change" />
                                                }
                                            </th>
                                            <th className="numeric">
                                                {
                                                    <IntlMessages id="trading.currencypair.label.volume" />
                                                }
                                            </th>
                                        </tr>
                                    </thead>
                                </Table>
                                <Scrollbars
                                    className="jbs-scroll"
                                    autoHeight
                                    autoHeightMin={250}
                                    autoHeightMax={360}
                                    autoHide
                                >
                                    <Table className="m-0 p-0">
                                        <tbody>{searchPair}</tbody>
                                    </Table>
                                </Scrollbars>
                            </div>
                        ) : (
                                <div>
                                    <Table className="m-0 p-0">
                                        <thead>
                                            <tr className="bg-light">
                                                <th>
                                                    {
                                                        <IntlMessages id="trading.currencypair.label.pair" />
                                                    }
                                                </th>
                                                <th>
                                                    {
                                                        <IntlMessages id="trading.currencypair.label.price" />
                                                    }
                                                </th>
                                                <th className="numeric">
                                                    {
                                                        <IntlMessages id="trading.currencypair.label.change" />
                                                    }
                                                </th>
                                                <th className="numeric">
                                                    {
                                                        <IntlMessages id="trading.currencypair.label.volume" />
                                                    }
                                                </th>
                                            </tr>
                                        </thead>
                                    </Table>
                                    <Scrollbars
                                        className="jbs-scroll"
                                        autoHeight
                                        autoHeightMin={250}
                                        autoHeightMax={360}
                                        autoHide
                                    >
                                        <Table className="m-0 p-0">
                                            <tbody>{pairsRow}</tbody>
                                        </Table>
                                    </Scrollbars>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        );
    }
}

// Set Props when actions are dispatch
const mapStateToProps = (state) => ({
    volumeData: state.tradePairList.volumeData,
    favouritePairList: state.tradePairList.favouritePairList,
    favouritePairData: state.tradePairList.favouritePairData,
    // volumeData: state.tradePairList.volumeData,
    darkMode: state.settings.darkMode,
});

// connect action with store for dispatch
export default connect(
    mapStateToProps,
    {
        getPairList,
        getVolumeData,
        getFavouritePairList,
        addToFavouritePairList,
        removeFromFavouritePairList,
    }
)(PairList);

class PairListRow extends React.Component {
    render() {
        var changeClass = "";

        if (this.props.changeBit === 1) {
            changeClass = "blink_me";
        }

        $(".sellOrderClass").removeClass("sellOrderClass");

        return (
            <tr
                style={{ cursor: "pointer" }}
                className={
                    this.props.changeBit === 1
                        ? changeClass + " sellOrderClass"
                        : ""
                }
                onClick={() => {
                    this.props.changePairs(this.props.value);
                }}
                key={this.props.index}
            >
                <td>
                    <a
                        href="javascript:;"
                        onClick={(event) => {
                            this.props.addToFavourite(event, this.props.value);
                        }}
                    >
                        {this.props.isAvailable === -1 ||
                            this.props.isAvailable === null ? (
                                // <i className="material-icons">{<IntlMessages id="trading.currencypair.icon.fillstar" />}</i> :
                                // <i className="material-icons">{<IntlMessages id="trading.currencypair.icon.star" />}</i>}</a>
                                <i className="material-icons">star_border</i>
                            ) : (
                                <i className="material-icons">star</i>
                            )}
                    </a>
                    {this.props.pair}
                </td>
                {/* <td> {this.props.pair}</td> */}
                <td
                    className={classnames({
                        blink_success:
                            this.props.newPrice > this.props.oldPrice,
                        blink_danger: this.props.newPrice < this.props.oldPrice,
                    })}
                >
                    {parseFloat(this.props.newPrice).toFixed(8)}
                </td>

                {/* <td className={this.props.upDownBit ? 'text-success':'text-danger'}>                     */}
                <td
                    className={
                        this.props.newChange === 0
                            ? "text-default"
                            : this.props.newChange > 0
                                ? "text-success"
                                : "text-danger"
                    }
                >
                    {parseFloat(this.props.newChange).toFixed(2)} %
                </td>

                <td>{parseFloat(this.props.newVolume).toFixed(2)}</td>
            </tr>
        );
    }
}
