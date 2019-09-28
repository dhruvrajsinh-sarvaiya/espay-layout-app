import React, { Component } from 'react';
import { View, FlatList, RefreshControl, } from 'react-native';
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { connect } from 'react-redux';
import { getFeedLimitList, clearFeedLimitData } from '../../../actions/Trading/FeedLimitConfigAction'
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../../components/Navigation';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent, contentContainerStyle } from '../../../native_theme/components/FlatListWidgets';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class FeedLimitConfigScreen extends Component {

    constructor(props) {
        super(props);

        //Define all initial state
        this.state = {
            refreshing: false,
            response: [],
            searchInput: '',
            isFirstTime: true,
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            //Call exchange feed limit config list API
            this.props.getFeedLimitList();
        }
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
        if (FeedLimitConfigScreen.oldProps !== props) {
            FeedLimitConfigScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //for fetch News API
            const { feedLimitList } = props.data;

            //if feedLimitList response is not null then handle resposne
            if (feedLimitList) {
                try {
                    //if local feedLimitList state is null or its not null and also different then new response then and only then validate response.
                    if (state.feedLimitList == null || (state.feedLimitList != null && feedLimitList !== state.feedLimitList)) {

                        //if feedLimitList response is success then store array list else store empty list
                        if (validateResponseNew({ response: feedLimitList, isList: true })) {
                            let res = parseArray(feedLimitList.Response);

                            return { ...state, feedLimitList, response: res, refreshing: false };
                        } else {
                            return { ...state, feedLimitList, response: [], refreshing: false };
                        }
                    }
                } catch (error) {
                    return { ...state, refreshing: false };
                }
            }
        }
        return null;
    }

    //For Swipe to referesh Functionality
    onRefresh = async (needUpdate, fromRefreshControl = false) => {
        if (fromRefreshControl)
            this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (needUpdate && await isInternet()) {
            //Call exchange feed limit config list API
            this.props.getFeedLimitList();
        } else {
            this.setState({ refreshing: false });
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount = () => {
        this.props.clearFeedLimitData();
    };

    render() {
        let { isLoadingFeedLimitList } = this.props.data

        let finalItem = [];

        //for search
        if (this.state.response) {
            finalItem = this.state.response.filter((item) => {

                return item.LimitDesc.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                    ('' + item.Status).includes(this.state.searchInput)
            })
        }
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                <CommonStatusBar />

                <CustomToolbar
                    title={R.strings.exchangeFeedLimit}
                    rightIcon={R.images.IC_PLUS}
                    isBack={true}
                    searchable={true}
                    onSearchText={(input) => this.setState({ searchInput: input })}
                    onRightMenuPress={() => this.props.navigation.navigate('FeedLimitConfigAdd', { onRefresh: this.onRefresh })}
                    nav={this.props.navigation}
                />

                <View style={{ flex: 1, flexDirection: 'column' }}>

                    {/* For FlatList View */}
                    {(isLoadingFeedLimitList && !this.state.refreshing) ?
                        <ListLoader /> :
                        <FlatList
                            data={finalItem}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) =>
                                <FeedLimitConfigItem
                                    index={index}
                                    item={item}
                                    onEdit={() => this.props.navigation.navigate('FeedLimitConfigAdd', { item, isEdit: true, onRefresh: this.onRefresh })}
                                    size={this.state.response.length} />
                            }
                            refreshControl={
                                <RefreshControl
                                    colors={[R.colors.accent]}
                                    progressBackgroundColor={R.colors.background}
                                    refreshing={this.state.refreshing}
                                    onRefresh={() => this.onRefresh(true, true)}
                                />
                            }
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={
                                <ListEmptyComponent module={R.strings.addExchangeFeedLimit}
                                    onPress={() => this.props.navigation.navigate('FeedLimitConfigAdd', { onRefresh: this.onRefresh })} />
                            }
                            contentContainerStyle={contentContainerStyle(finalItem)}
                        />
                    }
                </View>
            </SafeView>
        );
    };
}


// This Class is used for display record in list
class FeedLimitConfigItem extends Component {
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
        let { onEdit, index, size, item: { MinSize, MaxSize, RowLenghtSize, MaxRowCount, MinRecordCount, MaxRecordCount, MinLimit, MaxLimit, LimitDesc, Status } } = this.props;

        //set status color based on status code
        let color = R.colors.textSecondary;
        if (Status == 1) {
            color = R.colors.successGreen;
        } else if (Status == 0) {
            color = R.colors.failRed;
        } else 
        {
            color = R.colors.accent
        }

        return (

            // Flatlist item animation
            <AnimatableItem>
                <View style=
                {{  marginLeft: R.dimens.widget_left_right_margin, marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    flex: 1,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView 
                    style={{ elevation: R.dimens.listCardElevation,  flex: 1,
                        borderTopRightRadius: R.dimens.margin,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                    }}>

                        {/* for show size , rowSize */}
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText }}>{R.strings.size + ': '}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{MinSize + '-' + MaxSize}</TextViewHML>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText }}>{R.strings.rowSize + ': '}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{RowLenghtSize}</TextViewHML>
                                </View>
                            </View>

                            {/* for show recordCount , maxRowCount */}
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText }}>{R.strings.recordCount + ': '}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{MinRecordCount + '-' + MaxRecordCount}</TextViewHML>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText }}>{R.strings.maxRowCount + ': '}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{MaxRowCount}</TextViewHML>
                                </View>
                            </View>

                            {/* for show limit , limitDesc */}
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText }}>{R.strings.limit + ': '}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{MinLimit + '-' + MaxLimit}</TextViewHML>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText }}>{R.strings.limitDesc + ': '}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{LimitDesc}</TextViewHML>
                                </View>
                            </View>

                            {/* for show status , edit icon */}
                            <View style={{ flex: 1, marginTop: R.dimens.widgetMargin, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                                <StatusChip
                                    color={color}
                                    value={Status == 1 ? 'Active' : 'InActive'}></StatusChip>
                                <ImageTextButton
                                    style={
                                        { justifyContent: 'center', alignItems: 'center',
                                        padding: R.dimens.CardViewElivation,
                                        borderRadius: R.dimens.titleIconHeightWidth,
                                        margin: 0,
                                        backgroundColor: R.colors.accent,
                                        }}
                                        onPress={onEdit} 
                                    icon={R.images.IC_EDIT}
                                    iconStyle=
                                    {{ 
                                        width: R.dimens.titleIconHeightWidth, 
                                        height: R.dimens.titleIconHeightWidth, 
                                        tintColor: 'white' 
                                    }}
                                    />
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStateToProps(state) {
    return {
        //Updated feedLimitConfigReducer Data 
        data: state.feedLimitConfigReducer
    }
}
function mapDispatchToProps(dispatch) {
    return {
        //Perform getFeedLimitList action
        getFeedLimitList: () => dispatch(getFeedLimitList()),
        //Clear data
        clearFeedLimitData: () => dispatch(clearFeedLimitData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedLimitConfigScreen)