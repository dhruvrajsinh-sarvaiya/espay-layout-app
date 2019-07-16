import React, { Component } from 'react';
import { View, FlatList, TouchableWithoutFeedback, Image } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import { onFetchMarkets, onFetchMarginMarkets } from '../../actions/Trade/TradeActions';
import { isCurrentScreen } from '../Navigation';
import { changeTheme, } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import Separator from '../../native_theme/components/Separator';
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { addFavourite as addFavouriteApi, getFavourites, removeFavourite as removeFavouriteApi } from '../../actions/Trade/FavouriteActions';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import R from '../../native_theme/R';
import CommonToast from '../../native_theme/components/CommonToast';
import TextViewHML from '../../native_theme/components/TextViewHML';
import TextViewMR from '../../native_theme/components/TextViewMR';
import { getData } from '../../App';
import { ServiceUtilConstant } from '../../controllers/Constants';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class MarketSearchScreen extends Component {

    constructor(props) {
        super(props);

        // Create reference
        this.toast = React.createRef();

        // Bind all methods
        this.addToFavourite = this.addToFavourite.bind(this);
        this.onTradeHistoryItemPress = this.onTradeHistoryItemPress.bind(this);

        //Define All initial State
        this.state = {
            searchInput: '',
            marketListData: [],
            currencyPair: getData(ServiceUtilConstant.KEY_CurrencyPair).PairName,
        };
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        // check mariket list data is not available then call api for fetching markets
        if (this.props.marketData.marketList == undefined) {

            //Check NetWork is Available or not
            if (await isInternet()) {

                // Call API to Get Market List
                if (getData(ServiceUtilConstant.KEY_IsMargin)) {
                    this.props.onFetchMarginMarkets({ IsMargin: 1 });
                } else {
                    this.props.onFetchMarkets();
                }
            }
        }
    };

    static getDerivedStateFromProps(props, state) {

        // check for current screen
        if (isCurrentScreen(props)) {
            try {
                //Get All Updated field of Particular actions
                const { marketData: { marketList }, favourites: { addFavourite, removeFavourite } } = props;

                //To check if marketList is not null then getther tabs name
                if (marketList) {

                    if (validateResponseNew({ response: marketList, isList: true })) {
                        //To check if there is list then loop through all records and find common second names
                        if (marketList.response) {

                            let marketListData = [];

                            //Loop through all records
                            marketList.response.map((marketItem) => {

                                //To concate all sub array into single array
                                marketListData = marketListData.concat(marketItem.PairList);
                            });

                            return Object.assign({}, state, {
                                marketList,
                                marketListData,
                                addFavourite: null,
                                removeFavourite: null
                            })
                        } else {
                            return Object.assign({}, state, {
                                marketList,
                                marketListData: [],
                                addFavourite: null,
                                removeFavourite: null
                            })
                        }
                    }
                }

                //if addFavourite response is not null then handle resposne
                if (addFavourite) {

                    //if local favouritesData state is null or its not null and also different then new response then and only then validate response.
                    if (state.addFavourite == null || (state.addFavourite != null && addFavourite !== state.addFavourite)) {

                        //if favouriteList response is success then store array list else store empty list
                        if (validateResponseNew({ response: addFavourite, isList: true })) {

                            //take local market list
                            let marketListTemp = state.marketListData;

                            //Find item index
                            let itemIndex = marketListTemp.findIndex(el => el.PairId === this.PairId);

                            if (itemIndex > -1) marketListTemp[itemIndex].isFavorite = true;

                            return Object.assign({}, state, {
                                addFavourite,
                                removeFavourite: null,
                                marketListData: marketListTemp
                            })
                        } else {
                            return Object.assign({}, state, {
                                addFavourite,
                                removeFavourite: null,
                            })
                        }
                    }
                }

                //if removeFavourite response is not null then handle resposne
                if (removeFavourite) {

                    //if local favouritesData state is null or its not null and also different then new response then and only then validate response.
                    if (state.removeFavourite == null || (state.removeFavourite != null && removeFavourite !== state.removeFavourite)) {

                        //if favouriteList response is success then store array list else store empty list
                        if (validateResponseNew({ response: removeFavourite, isList: true })) {

                            //take local market list
                            let marketListTemp = state.marketListData;

                            //Find item index
                            let itemIndex = marketListTemp.findIndex(el => el.PairId === this.PairId);

                            if (itemIndex > -1) marketListTemp[itemIndex].isFavorite = false;

                            return Object.assign({}, state, {
                                removeFavourite,
                                addFavourite: null,
                                marketListData: marketListTemp
                            })
                        } else {
                            return Object.assign({}, state, {
                                removeFavourite,
                                addFavourite: null
                            })
                        }
                    }
                }
            } catch (error) {
                return null;
            }
        }
        return null;
    }

    async componentDidUpdate(prevProps, prevState) {

        //Get All Updated field of Particular actions
        let { favourites: { addFavourite, removeFavourite } } = this.props;

        //To check if both current and previous addFavourite are different
        if (addFavourite !== prevProps.favourites.addFavourite) {

            //If addFavourite is not null
            if (addFavourite) {
                this.toast.Show(addFavourite.ReturnMsg);

                //Check NetWork is Available or not
                if (await isInternet()) {

                    //To get the favourites list
                    if (getData(ServiceUtilConstant.KEY_IsMargin)) {
                        this.props.getFavourites({ IsMargin: 1 });
                    } else {
                        this.props.getFavourites({});
                    }
                }
            }
        }

        //To check if both current and previous removeFavourite are different
        if (removeFavourite !== prevProps.favourites.removeFavourite) {

            //If removeFavourite is not null
            if (removeFavourite) {
                this.toast.Show(removeFavourite.ReturnMsg);

                // check for internet connection
                if (await isInternet()) {

                    //To get the favourites list
                    if (getData(ServiceUtilConstant.KEY_IsMargin)) {
                        this.props.getFavourites({ IsMargin: 1 });
                    } else {
                        this.props.getFavourites({});
                    }
                }
            }
        }
    };

    shouldComponentUpdate = (nextProps, nextState) => {
        if (this.props.marketData.marketList !== nextProps.marketData.marketList ||
            this.props.favourites.isAdding !== nextProps.favourites.isAdding ||
            this.props.favourites.isRemoving !== nextProps.favourites.isRemoving ||
            this.state.searchInput !== nextState.searchInput ||
            this.state.marketListData !== nextState.marketListData) {

            // stop twice api call 
            return isCurrentScreen(nextProps);
        } else {
            return false;
        }
    };

    // for redirect to details screen
    onTradeHistoryItemPress(item) {
        var { navigate } = this.props.navigation;

        if (getData(ServiceUtilConstant.KEY_IsMargin)) {
            navigate('MarginMarketPairDetail', { item });
        } else {
            navigate('MarketPairDetail', { item });
        }
    }

    // for add/remove pair to/from favorite
    async addToFavourite(item) {

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.PairId = item.PairId;

            // check for pair is alerady selected for favorite then remove from favorite otherwise add to favorite
            if (getData(ServiceUtilConstant.KEY_IsMargin)) {
                if (item.isFavorite) {
                    // call api for Remove Favourite
                    this.props.removeFavourite({ PairId: item.PairId, IsMargin: 1 });
                } else {
                    // call api for Add Favourite
                    this.props.addFavourite({ PairId: item.PairId, IsMargin: 1 });
                }
            } else {
                if (item.isFavorite) {
                    // call api for Remove Favourite
                    this.props.removeFavourite({ PairId: item.PairId });
                } else {
                    // call api for Add Favourite
                    this.props.addFavourite({ PairId: item.PairId });
                }
            }
        }
    }

    render() {

        //for final items from search input (validate on PairName, Abbrevation)
        //default searchInput is empty so it will display all records.
        let filteredList = null;
        if (this.state.marketListData) {
            filteredList = this.state.marketListData.filter(item => (
                item.PairName.split('_')[1].toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.Abbrevation.toLowerCase().includes(this.state.searchInput.toLowerCase())
            ));
        }

        return (
            <SafeView style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    visibleSearch={true}
                    searchHint={R.strings.searchHere2}
                    onSearchText={(text) => this.setState({ searchInput: text })}
                    onSearchCancel={() => this.props.navigation.goBack()}
                />

                {/* Custom Toast */}
                <CommonToast ref={(cmp) => this.toast = cmp} />

                {/* Progress Dialog */}
                <ProgressDialog isShow={this.props.favourites.isAdding || this.props.favourites.isRemoving} />

                {/* List Items */}
                {
                    this.state.searchInput !== '' && filteredList &&
                    <View>
                        <TextViewHML style={[this.styles().searchResultText, { color: R.colors.textPrimary }]}>{R.strings.selectedCurrency + " : " + this.state.currencyPair.replace('_', '/')}</TextViewHML>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={filteredList}
                            ItemSeparatorComponent={() => <Separator />}
                            renderItem={({ item }) => <SearchItem
                                key={item.PairId.toString()}
                                item={item}
                                isSelect={item.isFavorite}
                                onPress={() => this.onTradeHistoryItemPress(item)}
                                onFavouritePress={() => this.addToFavourite(item)} />}
                            keyExtractor={item => item.PairId.toString()}
                        />
                    </View>
                }
            </SafeView >
        );
    }

    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background,
            },
            searchResultText: {
                fontSize: R.dimens.listHeaderText,
                color: R.colors.textSecondary,
                margin: R.dimens.WidgetPadding
            }
        }
    }
}

class SearchItem extends Component {

    shouldComponentUpdate = (nextProps) => {

        //Check If Old Props and New Props are Equal then Return False
        if (this.props.isSelect !== nextProps.isSelect) {
            return true;
        }
        return false;
    };

    render() {

        // Get required fields from props
        let props = this.props;
        let item = props.item;

        //if colors are available in item then use it otherwise display default colors.
        let changePerColor = ''
        if (item.ChangePer < 0) {
            changePerColor = R.colors.failRed
        }
        else if (item.ChangePer == 0) {
            changePerColor = R.colors.textPrimary
        }
        else {
            changePerColor = R.colors.buyerGreen
        }

        let sign = item.ChangePer != 0 ? (item.ChangePer > 0 ? '+' : '') : '';

        return (
            <AnimatableItem>
                <TouchableWithoutFeedback onPress={props.onPress}>
                    <View style={{
                        flexDirection: "row",
                        marginTop: R.dimens.widgetMargin,
                        marginLeft: R.dimens.widget_left_right_margin,
                        marginRight: R.dimens.widget_left_right_margin,
                        paddingTop: R.dimens.widgetMargin,
                        paddingBottom: R.dimens.widgetMargin
                    }}>
                        {/* for show Pairname */}
                        <View style={{ width: '30%' }}>
                            <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.PairName.replace('_', '/')}</TextViewMR>
                        </View>

                        {/* for show Current rate */}
                        <View style={{ width: '33%', flexDirection: 'row' }}>
                            <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, marginRight: R.dimens.padding_left_right_margin }}>{item.CurrentRate}</TextViewHML>
                        </View>

                        {/* for show changePer. */}
                        <View style={{ width: '32%', flexDirection: 'row' }}>
                            <TextViewHML style={{ color: changePerColor, fontSize: R.dimens.smallestText }}> {sign + item.ChangePer.toFixed(6) + '%'}</TextViewHML>
                        </View>

                        {/* icon of favourite  */}
                        <View style={{ width: '5%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableWithoutFeedback onPress={props.onFavouritePress}>
                                <Image source={item.isFavorite ? R.images.FAVORITE : R.images.SIMPLE_FAVORITE} style={{ tintColor: item.isFavorite ? null : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }} />
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {

    // Updated Data of Market and Favorites
    return {
        marketData: state.preference.isMargin ? state.marginTradeReducer : state.tradeData,
        favourites: state.favouriteReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // Perform Markets Action
        onFetchMarkets: () => dispatch(onFetchMarkets()),

        // Perform Margin Markets Action
        onFetchMarginMarkets: (payload) => dispatch(onFetchMarginMarkets(payload)),

        // Perform Favourites Action
        getFavourites: (payload) => dispatch(getFavourites(payload)),

        // Perform Add Favourites Action
        addFavourite: (payload) => dispatch(addFavouriteApi(payload)),

        // Perform remove Favourites Action
        removeFavourite: (payload) => dispatch(removeFavouriteApi(payload))
    }
}
export default connect(mapStatToProps, mapDispatchToProps)(MarketSearchScreen);