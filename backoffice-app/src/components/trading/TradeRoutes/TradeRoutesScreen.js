import React, { Component } from 'react';
import { View, FlatList, RefreshControl, } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../../components/Navigation';
import { connect } from 'react-redux';
import { getTradeRoutes, clearTradeRouteData } from '../../../actions/Trading/TradeRoutesActions';
import R from '../../../native_theme/R';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import StatusChip from '../../widget/StatusChip';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class TradeRoutesScreen extends Component {

    constructor(props) {
        super(props);

        //Define all initial state
        this.state = {
            refreshing: false,
            response: [],
            isFirstTime: true,
            search: '',
        };
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.  
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get trade routes
            this.props.getTradeRoutes();
        }
    };

    shouldComponentUpdate = (nextProps, _nextState) => {
        //For stop twice api call
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
        if (TradeRoutesScreen.oldProps !== props) {
            TradeRoutesScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { tradeRoutes } = props.data;

            if (tradeRoutes) {
                try {
                    //if local tradeRoutes state is null or its not null and also different then new response then and only then validate response.
                    if (state.tradeRoutes == null || (state.tradeRoutes != null && tradeRoutes !== state.tradeRoutes)) {

                        //if tradeRoutes response is success then store array list else store empty list
                        if (validateResponseNew({ response: tradeRoutes, isList: true })) {
                            let res = parseArray(tradeRoutes.Response);
                            return { ...state, tradeRoutes, response: res, refreshing: false };
                        } else {
                            return { ...state, tradeRoutes, response: [], refreshing: false };
                        }
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false };
                }
            }
        }
        return null;
    }

    onRefresh = async (needUpdate, fromRefreshControl = false) => {
        if (fromRefreshControl)
            this.setState({ refreshing: true });

        if (needUpdate && await isInternet()) {

            this.setState({ tradeRoutes: null });

            //To get the trade routes
            this.props.getTradeRoutes();
        } else {
            this.setState({ refreshing: false });
        }
    }

    componentWillUnmount = () => {
        this.props.clearTradeRouteData();
    };

    render() {
        let finalItem = [];

        //For search
        if (this.state.response) {
            finalItem = this.state.response.filter((item) => {
                return item.PairName.replace('_', '/').toLowerCase().includes(this.state.search.toLowerCase()) ||
                    item.TradeRouteName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                    item.OrderTypeText.toLowerCase().includes(this.state.search.toLowerCase()) ||
                    item.TrnTypeText.toLowerCase().includes(this.state.search.toLowerCase())
            })
        }
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.tradeRoute}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ search: input })}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => this.props.navigation.navigate('AddUpdateTradeRoutes', { isEdit: false, onRefresh: this.onRefresh })}
                />

                {/* Progress */}
                {(this.props.data.isLoadingTradeRoutes && !this.state.refreshing)
                    ?
                    <ListLoader />
                    :
                    (finalItem.length ?
                        <FlatList
                            data={finalItem}
                            extraData={this.state}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) =>
                                <TradeRouteItem
                                    index={index}
                                    item={item}
                                    onEdit={() => this.props.navigation.navigate('AddUpdateTradeRoutes', { item: item, isEdit: true, onRefresh: this.onRefresh })}
                                    size={this.state.response.length} />
                            }
                            keyExtractor={(_item, index) => index.toString()}
                            refreshControl={<RefreshControl
                                colors={[R.colors.accent]}
                                progressBackgroundColor={R.colors.background}
                                refreshing={this.state.refreshing}
                                onRefresh={() => this.onRefresh(true, true)}
                            />}
                        /> : <ListEmptyComponent module={R.strings.add + ' ' + R.strings.tradeRoute}
                            onPress={() => this.props.navigation.navigate('AddUpdateTradeRoutes', { onRefresh: this.onRefresh })} />
                    )
                }
            </SafeView>
        );
    }
}

// This Class is used for display record in list
class TradeRouteItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //if old item and new item are different than only render list item
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {
        let { index, size, onEdit, item: { TradeRouteName, PairName, OrderTypeText, TrnTypeText, AssetName, StatusText } } = this.props;

        //Set status color
        let statusColor = StatusText === 'Active' ? R.colors.successGreen : R.colors.failRed;
        let trnType = TrnTypeText;

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginLeft: R.dimens.widget_left_right_margin, flex: 1,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>

                    <CardView style={{   borderBottomLeftRadius: R.dimens.margin, elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        borderTopRightRadius: R.dimens.margin,
                    }}>
                        <View>
                            {/* for show PairName, trnType and OrderType */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                    <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{PairName ? PairName.replace('_', '/') : '-'}</TextViewMR>
                                    <TextViewMR style={{ color: statusColor, fontSize: R.dimens.smallText, marginLeft: R.dimens.widgetMargin }}>
                                        {trnType ? trnType : '-'}</TextViewMR>
                                </View>
                                <TextViewHML style={{
                                    color: R.colors.textPrimary, fontSize: R.dimens.smallText,
                                    marginRight: R.dimens.widgetMargin
                                }}>{OrderTypeText ? OrderTypeText : '-'}</TextViewHML>
                            </View>

                            {/* for show TradeRouteName, AssetName */}
                            <View style={{ flex: 1, marginTop: R.dimens.widgetMargin }}>
                                <View style={{ flex: 1, flexDirection: 'row', }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.tradeRouteName + ' : '}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{TradeRouteName ? TradeRouteName : '-'}</TextViewHML>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.assetName + ' : '}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{AssetName ? AssetName : '-'}</TextViewHML>
                                </View>
                            </View>

                            {/* for show status and edit icon */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>
                                <StatusChip
                                    color={statusColor}
                                    value={StatusText}></StatusChip>

                                <ImageTextButton
                                    style={{  alignItems: 'center',  backgroundColor: R.colors.accent,
                                            justifyContent: 'center',
                                            margin: 0,
                                            padding: R.dimens.CardViewElivation,
                                            borderRadius: R.dimens.titleIconHeightWidth,
                                        }}
                                        iconStyle={{ 
                                            width: R.dimens.titleIconHeightWidth, 
                                            height: R.dimens.titleIconHeightWidth, 
                                            tintColor: 'white' }}
                                        icon={R.images.IC_EDIT}
                                    onPress={onEdit} />
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    return {
        data: state.tradeRoutesBOReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getTradeRoutes: () => dispatch(getTradeRoutes()),
        clearTradeRouteData: () => dispatch(clearTradeRouteData()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(TradeRoutesScreen);