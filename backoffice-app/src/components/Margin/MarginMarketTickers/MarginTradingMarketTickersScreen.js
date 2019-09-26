import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, showAlert } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import CommonToast from '../../../native_theme/components/CommonToast';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import StatusChip from '../../widget/StatusChip';
import CardView from '../../../native_theme/components/CardView';
import { getMarginMarketCapTickers, updateMarginCapMarketTickers, clearMarginCapMarketTickersData } from '../../../actions/Margin/MarginTradingMarketCapTickersActions';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class MarginTradingMarketTickersScreen extends Component {

    constructor(props) {
        super(props);

        //Create reference
        this.progressDialog = React.createRef();
        this.toast = React.createRef();

        //Intial Request 
        this.request = {};

        //Define all Initial state
        this.state = {
            refreshing: false,
            response: [],
            selectedArray: [],
            isFirstTime: true,
        };

    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get market tickers
            this.props.getMarketTickers({ IsMargin: 1 });
        }
    };

    shouldComponentUpdate = (nextProps, _nextState) => {
        //Stop twice api call
        return isCurrentScreen(nextProps);
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        // To Skip Render if old and new props are equal
        if (MarginTradingMarketTickersScreen.oldProps !== props) {
            MarginTradingMarketTickersScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            const { marketTickers } = props.data;

            if (marketTickers) {
                try {
                    if (state.marketTickers == null || (state.marketTickers != null && marketTickers !== state.marketTickers)) {

                        //if tradingLedgers response is success then store array list else store empty list
                        if (validateResponseNew({ response: marketTickers, isList: true })) {
                            // get array response
                            let res = parseArray(marketTickers.Response);

                            let selectedArray = [];

                            // fetching only IsMarketTicker and PairID from response
                            for (var marketTickerKey in res) {
                                let item = res[marketTickerKey]

                                if (item.IsMarketTicker == 1) {
                                    selectedArray.push({
                                        PairId: item.PairId,
                                        IsMarketTicker: item.IsMarketTicker
                                    })
                                }
                            }

                            return { ...state, marketTickers, response: res, selectedArray, refreshing: false };
                        } else {
                            return { marketTickers, response: [], refreshing: false };
                        }
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false };
                }
            }
        }
        return null;
    }

    componentDidUpdate = (prevProps, prevState) => {
        const { updateMarketTickers } = this.props.data;

        if (updateMarketTickers !== prevProps.data.updateMarketTickers) {

            // for show responce of Update
            if (updateMarketTickers) {
                try {
                    //if local updateMarketTickers state is null or its not null and also different then new response then and only then validate response.
                    if (this.state.updateMarketTickers == null || (this.state.updateMarketTickers != null && updateMarketTickers !== this.state.updateMarketTickers)) {

                        //if updateMarketTickers response is success then show dialog
                        if (validateResponseNew({ response: updateMarketTickers })) {
                            showAlert(R.strings.status, updateMarketTickers.ReturnMsg, 0, async () => {
                                if (await isInternet()) {
                                    //  call api for get Updated MarketTickerdata
                                    this.props.getMarketTickers({ IsMargin: 1 })
                                }
                            });
                        }
                    }
                } catch (e) {

                }
            }
        }
    }

    //Swipe to refresh functionality
    onRefresh = async () => {

        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //call market cap tiker api
            this.props.getMarketTickers({ IsMargin: 1 });
        } else {
            this.setState({ refreshing: false });
        }
    }

    //on Save Button Press for Update market cap ticker
    onPress = async () => {

        let selectedArray = [];
        let newArray = this.state.response;

        newArray.map(el => {

            if (el.IsMarketTicker == 1) {
                selectedArray.push({
                    PairId: el.PairId,
                    PairName: el.PairName,
                    IsMarketTicker: el.IsMarketTicker,
                })
            }
        })

        if (JSON.stringify(this.state.selectedArray) !== JSON.stringify(selectedArray)) {
            if (await isInternet()) {

                //To update market tickers
                this.props.updateMarketTickers({ request: selectedArray, IsMargin: 1 });
            }
        } else {
            this.toast.Show(R.strings.noChnages);
        }
    }

    componentWillUnmount = () => {
        //for clear the data on backpress
        this.props.clearMarketTickers();
    };

    render() {
        // Loading status for Progress bar which is fetching from reducer
        let { isUpdatingMarketTickers } = this.props.data;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.market_cap}
                    rightMenu={R.strings.Save}
                    onRightMenuPress={() => this.onPress()}
                    isBack={true}
                    nav={this.props.navigation} />

                {/* Progress bar for loading */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={isUpdatingMarketTickers} />

                {/* Common Toast */}
                <CommonToast ref={component => this.toast = component} />

                {(this.props.data.isLoadingMarketTickers && !this.state.refreshing)
                    ?
                    <ListLoader />
                    :
                    <View style={{ flex: 1 }}>
                        {this.state.response.length ?
                            <FlatList
                                data={this.state.response}
                                extraData={this.state}
                                showsVerticalScrollIndicator={false}
                                // render all item in list
                                renderItem={({ item, index }) =>
                                    <MarketTickerItem
                                        index={index}
                                        item={item}
                                        onPress={() => {
                                            let response = this.state.response;
                                            response[index].IsMarketTicker = response[index].IsMarketTicker == 0 ? 1 : 0;
                                            this.setState({ response });
                                        }}
                                    />
                                }
                                // assign index as key value to list item
                                keyExtractor={(_item, index) => index.toString()}
                                // Refresh functionality in list
                                refreshControl={<RefreshControl
                                    colors={[R.colors.accent]}
                                    progressBackgroundColor={R.colors.background}
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                />}
                            /> :
                            // Displayed empty component when no record found 
                            <ListEmptyComponent />}
                    </View>
                }
            </SafeView>
        );
    }
}

// This Class is used for display record in list
class MarketTickerItem extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        // If new props and old props are equal then it will return false otherwise it will return true
        if (this.props.item !== nextProps.item || this.props.onPress !== nextProps.onPress)
            return true
        return false
    }

    render() {
        let { index, size } = this.props;
        let item = this.props.item;
        return (
            // Flatlist item animatable
            <AnimatableItem>
                <View style={{ marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    flex: 1,  marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin,
                }}>
                    <CardView 
                    style={{
                        elevation: R.dimens.listCardElevation,
                        borderBottomLeftRadius: R.dimens.margin,  borderTopRightRadius: R.dimens.margin,  borderRadius: 0,
                        flex: 1,
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                <ImageButton
                                    icon={item.IsMarketTicker == 1 ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
                                    onPress={this.props.onPress}
                                    style={{ margin: R.dimens.widgetMargin, flexDirection: 'row-reverse' }}
                                    textStyle={{ color: R.colors.textPrimary }}
                                    iconStyle={{ tintColor: item.IsMarketTicker == 1 ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                                />
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{item.PairName}</TextViewHML>
                            </View>
                            <StatusChip
                                color={item.IsMarketTicker == 0 ? R.colors.failRed : R.colors.successGreen}
                                value={item.IsMarketTicker == 0 ? R.strings.inActive : R.strings.active}></StatusChip>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    //Updated data for Margin Trading Cap List and Update action
    return { data: state.MarginTradingMarketCapTickersReducer }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform action for get market cap tiker list
        getMarketTickers: (payload) => dispatch(getMarginMarketCapTickers(payload)),
        //Perform action for Update market cap tikers 
        updateMarketTickers: (payload) => dispatch(updateMarginCapMarketTickers(payload)),
        //Perform action for clear data
        clearMarketTickers: () => dispatch(clearMarginCapMarketTickersData())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(MarginTradingMarketTickersScreen);