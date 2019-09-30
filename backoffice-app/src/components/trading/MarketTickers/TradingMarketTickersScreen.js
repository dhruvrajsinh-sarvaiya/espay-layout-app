import React, { Component, PureComponent } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, showAlert } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../../components/Navigation';
import { connect } from 'react-redux';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import { getMarketTickersBO, updateMarketTickersBO, clearMarketTickersBOData } from '../../../actions/Trading/TradingMarketTickersActions';
import CommonToast from '../../../native_theme/components/CommonToast';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import StatusChip from '../../widget/StatusChip';
import CardView from '../../../native_theme/components/CardView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class TradingMarketTickersScreen extends Component {

    constructor(props) {
        super(props);

        //Create reference
        this.progressDialog = React.createRef();
        this.toast = React.createRef();
        this.request = {};

        //Define all initial state
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
            this.props.getMarketTickers({});
        }
    };

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

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
        if (TradingMarketTickersScreen.oldProps !== props) {
            TradingMarketTickersScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //for fetch News API
            const { marketTickers } = props.data;

            if (marketTickers) {
                try {
                    if (state.marketTickers == null || (state.marketTickers != null && marketTickers !== state.marketTickers)) {

                        //if tradingLedgers response is success then store array list else store empty list
                        if (validateResponseNew({ response: marketTickers, isList: true })) {
                            let res = parseArray(marketTickers.Response);

                            let selectedArray = [];

                            res.map(el => {
                                if (el.IsMarketTicker == 1) {
                                    selectedArray.push({
                                        PairId: el.PairId,
                                        IsMarketTicker: el.IsMarketTicker
                                    })
                                }
                            })

                            return {
                                ...state, marketTickers,
                                response: res, selectedArray, refreshing: false
                            };

                        }
                        else {
                            return {
                                marketTickers,
                                response: [], refreshing: false
                            };
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        response: [], refreshing: false
                    };
                }
            }
        }
        return null;
    }

    componentDidUpdate = (prevProps, prevState) => 
    {
        const { updateMarketTickers } = 
        this.props.data;

        if (updateMarketTickers !== prevProps.data.updateMarketTickers) 
        {

            // for show responce of delete data
            if (updateMarketTickers) {
                try {
                    //if local updateMarketTickers state is null or its not null and also different then new response then and only then validate response.
                    if (this.state.updateMarketTickers == null 
                        || (this.state.updateMarketTickers != null 
                            && updateMarketTickers !== this.state.updateMarketTickers)) {

                        //if updateMarketTickers response is success then show dialog

                        if (validateResponseNew({ response: updateMarketTickers }))
                         {

                            showAlert(R.strings.status, updateMarketTickers.ReturnMsg, 0, async () => 
                            {
                                //Check NetWork is Available or not

                                if (await isInternet()) {
                                    //  call api for get Updated MarketTickerdata

                                    this.props.getMarketTickers({})
                                }
                            });
                        }
                    }
                } catch (e) {

                }
            }
        }
    }

    onRefresh = async () => {

        this.setState({ refreshing: true });

        //Check NetWork is Available or not 
        if (await isInternet()) {

            //To get the trading ledgers
            this.props.getMarketTickers({});
        } else {
            this.setState({ refreshing: false });
        }
    }

    onPress = async () => {

        let selectedArray = [];
        let newArray = this.state.response;

        newArray.map(el => {

            if (el.IsMarketTicker == 1) {
                selectedArray.push({
                    PairId: el.PairId,
                    IsMarketTicker: el.IsMarketTicker
                })
            }
        })

        if (JSON.stringify(this.state.selectedArray) !== JSON.stringify(selectedArray)) {

            //Check NetWork is Available or not
            if (await isInternet()) {

                //To update market tickers
                this.props.updateMarketTickers({ request: selectedArray });
            }
        } else {
            this.toast.Show(R.strings.noChnages);
        }
    }

    componentWillUnmount = () => {
        this.props.clearMarketTickers();
    };

    render() {

        let { isUpdatingMarketTickers } = this.props.data;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* Progress Dialog */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={isUpdatingMarketTickers} />

                {/* For Toast */}
                <CommonToast ref={component => this.toast = component} />

                {/* Set Toolbar */}
                <CustomToolbar
                    title={R.strings.market_cap}
                    rightMenu={R.strings.Save}
                    onRightMenuPress={() => this.onPress()}
                    isBack={true}
                    nav={this.props.navigation} />

                {
                    (this.props.data.isLoadingMarketTickers
                        && !this.state.refreshing)
                        ?
                        <ListLoader />
                        :
                        <View
                            style={{ flex: 1 }}>

                            {this.state.response.length ?
                                <FlatList
                                    extraData={this.state}
                                    data={this.state.response}
                                    // ItemSeparatorComponent={() => <Separator />}
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
                                    showsVerticalScrollIndicator={false}
                                    refreshControl={<RefreshControl
                                        colors={[R.colors.accent]}
                                        progressBackgroundColor={R.colors.background}
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                    />}
                                    keyExtractor={(_item, index) => index.toString()}
                                /> : <ListEmptyComponent />}
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

    render() {
        let { index, size } = this.props;
        let item = this.props.item;
        return (
            // Flatlist item animation

            <AnimatableItem>
                <View style={{
                    marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin,
                    flex: 1, marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView style={{
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation, flex: 1,
                        borderTopRightRadius: R.dimens.margin,
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                            {/* for show PairName , status */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center', alignContent: 'center'
                                }}>
                                <ImageButton
                                    textStyle={{ color: R.colors.textPrimary }}
                                    iconStyle={{ tintColor: item.IsMarketTicker == 1 ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                                    icon={item.IsMarketTicker == 1 ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
                                    onPress={this.props.onPress}
                                    style={{ margin: R.dimens.widgetMargin, flexDirection: 'row-reverse' }}
                                />
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{item.PairName}</TextViewHML>
                            </View>
                            <StatusChip
                                value={item.IsMarketTicker == 0 ? R.strings.inActive : R.strings.active}
                                color={item.IsMarketTicker == 0 ? R.colors.failRed : R.colors.successGreen}
                            >
                            </StatusChip>
                        </View>

                    </CardView>

                </View>
                
            </AnimatableItem>

        )
    }
}

function mapStatToProps(state) {
    //Updated marketTickerReducer Data 
    return { data: state.marketTickerReducer }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getMarketTickers action
        getMarketTickers: (payload) => dispatch(getMarketTickersBO(payload)),
        //Perform updateMarketTickers action
        updateMarketTickers: (payload) => dispatch(updateMarketTickersBO(payload)),
        //clear data
        clearMarketTickers: () => dispatch(clearMarketTickersBOData())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(TradingMarketTickersScreen);