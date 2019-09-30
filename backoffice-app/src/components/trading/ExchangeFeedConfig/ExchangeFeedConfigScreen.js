import React, { Component } from 'react';
import { View, FlatList, RefreshControl, } from 'react-native';
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { connect } from 'react-redux';
import { getExchangeFeedConfigList, clearExchangeFeed } from '../../../actions/Trading/ExchangeFeedConfigAction'
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

class ExchangeFeedConfigScreen extends Component {

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

            //Call exchange feed config list API
            this.props.getExchangeFeedConfigList();
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
        if (ExchangeFeedConfigScreen.oldProps !== props) {
            ExchangeFeedConfigScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //for fetch News API
            const { exchangeFeedList } = props.data;

            //if exchangeFeedList response is not null then handle resposne
            if (exchangeFeedList) {
                try {
                    //if local exchangeFeedList state is null or its not null and also different then new response then and only then validate response.
                    if (state.exchangeFeedList == null || (state.exchangeFeedList != null && exchangeFeedList !== state.exchangeFeedList)) {

                        //if exchangeFeedList response is success then store array list else store empty list
                        if (validateResponseNew({ response: exchangeFeedList, isList: true })) {
                            let res = parseArray(exchangeFeedList.Response);

                            res.map((el, index) => {
                                res[index].StatusText = el.Status == 0 ? R.strings.Inactive : R.strings.Active;
                            })

                            return { ...state, exchangeFeedList, response: res, refreshing: false };
                        } else {
                            return { ...state, exchangeFeedList, response: [], refreshing: false };
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
            //Call exchange feed config list API
            this.props.getExchangeFeedConfigList();
        } else {
            this.setState({ refreshing: false });
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount = () => {
        this.props.clearExchangeFeed();
    };

    render() {
        let { isLoadingExchangeFeedList } = this.props.data

        let finalItem = [];

        //For search
        if (this.state.response) {
            finalItem = this.state.response.filter((item) => {
                return item.MethodName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                    item.LimitDesc.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                    item.StatusText.toLowerCase().includes(this.state.searchInput.toLowerCase())
            })
        }

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.exchangeFeedConfiguration}
                    rightIcon={R.images.IC_PLUS}
                    isBack={true}
                    searchable={true}
                    onSearchText={(input) => this.setState({ searchInput: input })}
                    onRightMenuPress={() => {
                        this.props.navigation.navigate('ExchangeFeedConfigAdd', { onRefresh: this.onRefresh })
                    }}
                    nav={this.props.navigation}
                />

                <View style={{ flex: 1, flexDirection: 'column' }}>

                    {/* For FlatList View */}
                    {(isLoadingExchangeFeedList && !this.state.refreshing) ?
                        <ListLoader /> :
                        <FlatList
                            data={finalItem}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) =>
                                <ExchangeFeedItem
                                    index={index}
                                    item={item}
                                    onEdit={() => {
                                        this.props.navigation.navigate('ExchangeFeedConfigAdd', { item, isEdit: true, onRefresh: this.onRefresh })
                                    }}
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
                                <ListEmptyComponent module={R.strings.add_feed_configuration}
                                    onPress={() => this.props.navigation.navigate('ExchangeFeedConfigAdd', { onRefresh: this.onRefresh })} />
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
class ExchangeFeedItem extends Component {
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
        let { index, size, onEdit, item } = this.props;
        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        flex: 1,
                        borderRadius: 0,
                        elevation: R.dimens.listCardElevation,
                        borderTopRightRadius: R.dimens.margin,
                        borderBottomLeftRadius: R.dimens.margin,
                    }}>
                        <View style={{ flexDirection: 'row' }}>

                            {/* for show radar icon */}
                            <View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                                <ImageTextButton
                                    icon={R.images.ic_radar}
                                    style={{ margin: 0, padding: 0, justifyContent: 'center', alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                                />
                            </View>

                            {/* for show Method , Limit , Limit Type , Size , Max Record Count */}
                            <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
                                    <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{item.MethodName ? item.MethodName : '-'}</TextViewHML>
                                </View>
                                <View style={{ flexDirection: 'row' }} >
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.limit + ': '}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.MinLimit + '-' + item.MaxLimit}</TextViewHML>
                                </View>
                                <View style={{ flexDirection: 'row' }} >
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.LimitType + ': '}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.LimitDesc ? item.LimitDesc : '-'}</TextViewHML>
                                </View>
                                <View style={{ flexDirection: 'row' }} >
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.size + ': '}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.MinSize + '-' + item.MaxSize}</TextViewHML>
                                </View>
                                <View style={{ flexDirection: 'row' }} >
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.maxRecordCount + ': '}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.MaxRecordCount}</TextViewHML>
                                </View>
                            </View>
                        </View>

                        {/* for show status and Edit icon */}
                        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                            <StatusChip
                                color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed}
                                value={item.StatusText}></StatusChip>
                            <ImageTextButton
                                style={
                                    {
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: R.colors.accent,
                                        borderRadius: R.dimens.titleIconHeightWidth,
                                        margin: 0,
                                        padding: R.dimens.CardViewElivation,
                                    }}
                                icon={R.images.IC_EDIT}
                                iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                onPress={onEdit} />
                        </View>

                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStateToProps(state) {
    //Updated Data For exchangeFeedConfigReducer Data 
    return {
        data: state.exchangeFeedConfigReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getExchangeFeedConfigList Action 
        getExchangeFeedConfigList: () => dispatch(getExchangeFeedConfigList()),
        //Clear data
        clearExchangeFeed: () => dispatch(clearExchangeFeed()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeFeedConfigScreen)