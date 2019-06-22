import React, { Component } from 'react';
import { View, FlatList, TouchableWithoutFeedback, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { isCurrentScreen, addComponentDidResume } from '../Navigation';
import { changeTheme, parseArray, parseFloatVal, windowPercentage, addListener } from '../../controllers/CommonUtils';
import { validateResponseNew, isInternet } from '../../validations/CommonValidation';
import { contentContainerStyle, ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import ListLoader from '../../native_theme/components/ListLoader';
import { storeBaseCurrency, onFetchMarkets } from '../../actions/Trade/TradeActions';
import { getFavourites, addFavourite, removeFavourite } from '../../actions/Trade/FavouriteActions';
import R from '../../native_theme/R';
import IndicatorViewPager from '../../native_theme/components/IndicatorViewPager';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Cache } from '../../App';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';
import { Events } from '../../controllers/Constants';

const CacheName = 'MarketListScreen';

class MarketListScreen extends Component {

    constructor(props) {
        super(props);

        // To fire resume event when component is reappear
        addComponentDidResume({ props, componentDidResume: this.componentDidResume, widgetName: CacheName });

        let tabsName = [R.strings.favourites];
        let viewCaseTabs = [];

        // Bind All Method
        this.onPageScroll = this.onPageScroll.bind(this);
        this.onTradeHistoryItemPress = this.onTradeHistoryItemPress.bind(this);

        this.tabName = tabsName[0];

        let { width, height } = Dimensions.get('window');

        let contentPercentage = windowPercentage(65, width);

        //Define all initial State
        this.state = {
            tabsName: tabsName,
            viewCaseTabs: viewCaseTabs,
            marketListData: null,
            response: [],
            isFavoriteScreen: true,
            width: width < height ? width : contentPercentage
        }
    }

    componentDidResume = () => {

        // check cache is available or not
        if (Cache.getCache(CacheName) !== undefined) {

            // cache is available then store into state and clear chache
            this.setState(Cache.getCache([CacheName]));
            Cache.setCache({ [CacheName]: undefined });
        }
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        // check for internet connection
        if (await isInternet()) {

            if (this.props.favourites.favouriteList === null) {
                //Call API To get the favourites list
                this.props.getFavourites({});
            }

            if (this.props.marketData.marketList === null) {
                //Call API To get all pairs initially
                this.props.getPairList();
            }
        }

        // add listener for update Dimensions
        this.dimensionListener = addListener(Events.Dimensions, (data) => {

            let { width, height } = data;

            let contentPercentage = windowPercentage(65, width);

            this.setState({
                // as tablet will consider 35% of screen so display content in rest 65%	
                width: width < height ? width : contentPercentage,
            })
        });
    };

    componentWillUnmount() {
        if (this.dimensionListener) {

            // remove listener of dimensions
            this.dimensionListener.remove();
        }
    }

    static getDerivedStateFromProps(props, state) {

        try {

            //Get All Updated Feild of Particular actions
            let { marketData: { marketList }, favourites: { favouriteList } } = props;

            // check market list data is available or not
            if (marketList) {

                //if local marketList state is null or its not null and also different then new response then and only then validate response.
                if (state.marketList == null || (state.marketList != null && marketList !== state.marketList)) {
                    let newState = { marketList };

                    if (validateResponseNew({ response: marketList, isList: true })) {

                        //To check if there is list then loop through all records and find common second names
                        if (marketList.response) {

                            //Loop through all records
                            marketList.response.map((marketItem) => {

                                //if base currency is not exist in list then add in list.
                                if (state.tabsName.every((item) => !item.includes(marketItem.Abbrevation))) {

                                    //This tabsName for tabs name
                                    state.tabsName.push(marketItem.Abbrevation);

                                    //This viewCaseTabs for display only rest tabs for its own loop
                                    state.viewCaseTabs.push(marketItem.Abbrevation);
                                }
                            })

                            newState = Object.assign({}, newState, { marketListData: marketList.response });
                        }
                    }

                    //check for current screen
                    if (isCurrentScreen(props)) {
                        return Object.assign({}, state, newState);
                    } else {
                        Cache.setCache({ [CacheName]: newState });
                    }
                }
            }

            //To Check Favourit list data is available or not
            if (favouriteList) {

                //if local favouriteList state is null or its not null and also different then new response then and only then validate response.
                if (state.favouriteList == null || (state.favouriteList != null && favouriteList !== state.favouriteList)) {
                    let newState = { favouriteList };

                    //if favouriteList response is success then store array list else store empty list
                    if (validateResponseNew({ response: favouriteList, isList: true })) {
                        let res = parseArray(favouriteList.response);

                        newState = Object.assign({}, newState, {
                            response: res
                        })
                    } else {
                        // otherwise store empty array in favorite response
                        newState = Object.assign({}, newState, {
                            response: []
                        })
                    }

                    // check for current screen
                    if (isCurrentScreen(props)) {
                        return Object.assign({}, state, newState);
                    } else {
                        Cache.setCache({ [CacheName]: newState });
                    }
                }
            }
        } catch (error) {
            return null;
        }
        return null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        //If theme or locale is changed then update componenet
        if (this.props.preference.theme !== nextProps.preference.theme
            || this.props.preference.locale !== nextProps.preference.locale
            || this.state.favouriteList !== nextProps.favourites.favouriteList
            || this.props.favourites.isFetching !== nextProps.favourites.isFetching
            || this.state.width !== nextState.width) {
            return true;
        } else {
            if (this.state.marketList !== nextProps.marketData.marketList ||
                this.props.marketData.isFetchMarket !== nextProps.marketData.isFetchMarket ||
                this.state.isFavoriteScreen !== nextState.isFavoriteScreen) {
                return isCurrentScreen(nextProps);
            } else {
                return false;
            }
        }
    };

    // for scrolling of page
    onPageScroll(scrollData) {

        // get position from scroll
        let { position } = scrollData

        //If favorite screen is open then set favourite true otherwise false
        if (position == 0) {
            this.setState({ isFavoriteScreen: true })
        } else {

            //this will reduce render multiple time with if its already false it wont save state again
            if (this.state.isFavoriteScreen) {
                this.setState({ isFavoriteScreen: false })
            }

            if (this.tabName !== this.state.tabsName[position]) {
                this.tabName = this.state.tabsName[position];
                this.props.storeBaseCurrency(this.tabName);
            }
        }
    }

    // redirect to details screen
    onTradeHistoryItemPress(item) {
        var { navigate } = this.props.navigation;
        navigate('MarketPairDetail', { item });
    }

    render() {

        //Store list in local data variable so we can filter on it.
        let data = this.state.marketListData ? this.state.marketListData : [];

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.marketTitle}
                    leftIcon={this.state.isFavoriteScreen && this.state.simple == undefined && R.images.SIMPLE_FAVORITE}
                    rightIcon={R.images.SEARCH_ICON}
                    isBack={this.state.simple}
                    nav={this.props.navigation}
                    onLeftMenuPress={() => this.props.navigation.navigate('EditFavorite')}
                    onRightMenuPress={() => this.props.navigation.navigate('MarketSearch')}
                />

                {/* Progress */}
                {this.props.marketData.isFetchMarket && <ListLoader />}

                {/* If market list data is null than display no records found */}
                {!this.props.marketData.isFetchMarket && this.state.marketList === null && <ListEmptyComponent />}

                {!this.props.marketData.isFetchMarket && this.props.marketData.marketList &&
                    <IndicatorViewPager
                        ref='MarketTabs'
                        titles={this.state.tabsName}
                        style={{ width: this.state.width, marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin, }}
                        onPageScroll={this.onPageScroll}>

                        {/* Button background */}
                        <View >

                            {/* List Items */}
                            {this.props.favourites.isFetching ? <ListLoader /> :
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    key={R.strings.favorite}
                                    data={this.state.response}
                                    extraData={this.state}
                                    renderItem={({ item }) => <MarketPairItem
                                        isPortrait={this.props.preference.dimensions.isPortrait}
                                        key={item.PairId.toString()}
                                        item={item}
                                        isFavorite={true}
                                        preference={this.props.preference}
                                        onPress={() => this.onTradeHistoryItemPress(item)} />}
                                    keyExtractor={item => item.PairId.toString()}
                                    contentContainerStyle={contentContainerStyle(this.state.response)}
                                    ListEmptyComponent={<ListEmptyComponent />}
                                />}
                        </View>

                        {/* Rest tabs */}
                        {this.state.viewCaseTabs.map((tabItem, index) =>

                            <View key={tabItem}>

                                {/* List Items */}
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    key={tabItem}
                                    data={data[index] ? data[index].PairList : []}
                                    extraData={this.state}
                                    renderItem={({ item }) => <MarketPairItem
                                        key={item.PairId.toString()}
                                        item={item}
                                        preference={this.props.preference}
                                        onPress={() => this.onTradeHistoryItemPress(item)} />}
                                    keyExtractor={item => item.PairId.toString()}
                                    contentContainerStyle={contentContainerStyle(this.props.marketData.marketList.response)}
                                    ListEmptyComponent={<ListEmptyComponent />}
                                />
                            </View>)}
                    </IndicatorViewPager>
                }
            </SafeView >
        );
    }
}

class MarketPairItem extends Component {
    shouldComponentUpdate = (nextProps) => {

        //Check If Old Props and New Props are Equal then Return False
        if (this.props.preference.theme !== nextProps.preference.theme
            || this.props.preference.locale !== nextProps.preference.locale
            || this.props.isPortrait !== nextProps.isPortrait) {
            return true;
        } else if (this.props.item !== nextProps.item || this.props.item.isFavorite != nextProps.isFavorite) {
            return true;
        } else {
            return false;
        }
    }

    render() {

        // Get required fields from props
        let item = this.props.item;

        //if colors are available in item then use it otherwise display default colors.
        let sign = item.ChangePer != 0 ? (item.ChangePer > 0 ? '+' : '') : '';

        // apply color based on sign
        let changePerColor;
        if (sign === '' && item.ChangePer == 0) {
            changePerColor = R.colors.textSecondary;
        } else if (sign === '+') {
            changePerColor = R.colors.successGreen;
        } else {
            changePerColor = R.colors.failRed;
        }

        return (
            <AnimatableItem>
                <TouchableWithoutFeedback onPress={this.props.onPress}>

                    <View style={[this.styles().simpleItem, { width: '100%', marginBottom: R.dimens.widgetMargin, borderRadius: R.dimens.cardBorderRadius, }]}>
                        <View style={[this.styles().simpleItem, { flex: 1, marginTop: 0 }]}>

                            {/* pair and volume display here */}
                            <View style={{ width: '37%' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.firstCurrencyText }}>{item.Abbrevation}</TextViewMR>
                                    <TextViewMR style={{ color: R.colors.textSecondary, fontSize: R.dimens.secondCurrencyText }}> / {item.PairName.split('_')[1]}</TextViewMR>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.dashboardSelectedTabText }}>{R.strings.vol_24h}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.dashboardSelectedTabText }}> {item.Volume.toFixed(8)}</TextViewHML>
                                </View>
                            </View>

                            {/* chart here  */}
                            <View style={{ width: '36%', paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.margin }}>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.firstCurrencyText }}>{parseFloatVal(item.CurrentRate).toFixed(8)}</TextViewHML>
                            </View>

                            {/* price and charge value here */}
                            <View style={{ width: '27%' }}>
                                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'flex-end' }}>
                                    <TextViewHML style={{
                                        width: '80%',
                                        textAlign: 'right',
                                        color: R.colors.white,
                                        fontSize: R.dimens.secondCurrencyText,
                                        backgroundColor: changePerColor,
                                        borderRadius: R.dimens.normalizePixels(2),
                                        paddingLeft: R.dimens.WidgetPadding,
                                        paddingRight: R.dimens.WidgetPadding,
                                        paddingTop: R.dimens.widgetMargin,
                                        paddingBottom: R.dimens.widgetMargin
                                    }}>{item.changePer != 0 && sign}{item.ChangePer.toFixed(2)}%</TextViewHML>
                                </View>
                            </View>
                        </View>
                        {!props.isFavorite && item.isFavorite && <Image source={R.images.FAVORITE} style={{ tintColor: null, position: 'absolute', width: R.dimens.widget_left_right_margin, height: R.dimens.widget_left_right_margin }} />}
                    </View>
                </TouchableWithoutFeedback>
            </AnimatableItem>
        )
    }

    // style for this class
    styles() {
        return {
            simpleItem: {
                flexDirection: "row",
                marginTop: R.dimens.widgetMargin,
                marginLeft: R.dimens.widget_left_right_margin,
                paddingRight: R.dimens.widget_left_right_margin,
            },
        }
    }
}

function mapStatToProps(state) {

    // Updated Data of market, favourit and Preference
    return {
        marketData: state.tradeData,
        favourites: state.favouriteReducer,
        preference: state.preference
    }
}

function mapDispatchToProps(dispatch) {
    return {

        // Perform Store Base Currency Action
        storeBaseCurrency: (baseCurrency) => dispatch(storeBaseCurrency(baseCurrency)),

        // Perform Pair List Action
        getPairList: () => dispatch(onFetchMarkets()),

        // Perform Favourit Action
        getFavourites: (payload) => dispatch(getFavourites(payload)),

        // Perform Add Favourit Action
        addFavourite: (payload) => dispatch(addFavourite(payload)),

        // Perform remove Favourit Action
        removeFavourite: (payload) => dispatch(removeFavourite(payload)),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(MarketListScreen);