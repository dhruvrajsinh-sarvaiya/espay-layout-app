import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../../components/Navigation';
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { getSiteTokenList, clearSiteToken } from '../../../actions/Trading/SiteTokenAction';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import StatusChip from '../../widget/StatusChip';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import TextViewMR from '../../../native_theme/components/TextViewMR';

class SiteTokenScreen extends Component {
    constructor(props) {
        super(props);

        //Define All State initial state
        this.state = {
            refreshing: false,
            response: [],
            search: '',
            isFirstTime: true,
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // check for internet connection
        if (await isInternet()) {

            //To get site token list data
            this.props.getSiteTokenList({});
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
        if (SiteTokenScreen.oldProps !== props) {
            SiteTokenScreen.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { siteTokenList } = props.data;

            // check response is available or not
            if (siteTokenList) {
                try {
                    //if local siteTokenList state is null or its not null and also different then new response then and only then validate response.
                    if (state.siteTokenList == null || (state.siteTokenList != null && siteTokenList !== state.siteTokenList)) {

                        //if siteTokenList response is success then store array list else store empty list
                        if (validateResponseNew({ response: siteTokenList, isList: true })) {

                            let response = parseArray(siteTokenList.Response);

                            return { ...state, siteTokenList, response, refreshing: false };
                        } else {
                            return { ...state, siteTokenList, response: [], refreshing: false };
                        }
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false };
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

            //To get Site Token data
            this.props.getSiteTokenList({});
        } else {
            this.setState({ refreshing: false });
        }
    }

    componentWillUnmount = () => {

        // clear reducer data
        this.props.clearSiteToken();
    };

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { loading } = this.props.data;
        //----------

        //for final items from search input (validate on CurrencySMSCode, BaseCurrencySMSCode, MinLimit, MaxLimit, WeeklyLimit and MonthlyLimit)
        //default searchInput is empty so it will display all records.
        let filteredList = [];
        if (this.state.response) {
            filteredList = this.state.response.filter(item => (
                item.CurrencySMSCode.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.BaseCurrencySMSCode.toLowerCase().includes(this.state.search.toLowerCase()) ||
                ('' + item.MinLimit).includes(this.state.search.toLowerCase()) ||
                ('' + item.MaxLimit).includes(this.state.search.toLowerCase()) ||
                ('' + item.WeeklyLimit).includes(this.state.search.toLowerCase()) ||
                ('' + item.MonthlyLimit).includes(this.state.search.toLowerCase())
            ));
        }

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.siteToken}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ search: input })}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => this.props.navigation.navigate('SiteTokenAddEditScreen', { onRefresh: this.onRefresh })}
                />
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {
                        loading && !this.state.refreshing ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>

                                {/* for display Headers for list  */}
                                {filteredList.length > 0 ?
                                    <FlatList
                                        data={filteredList}
                                        extraData={this.state}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item, index }) =>
                                            <SiteTokenItem
                                                index={index}
                                                item={item}
                                                size={this.state.response.length}
                                                onEdit={() => this.props.navigation.navigate('SiteTokenAddEditScreen', { item: item, edit: true, onRefresh: this.onRefresh })
                                                }
                                            />
                                        }
                                        keyExtractor={(_item, index) => index.toString()}
                                        refreshControl={<RefreshControl
                                            colors={[R.colors.accent]}
                                            progressBackgroundColor={R.colors.background}
                                            refreshing={this.state.refreshing}
                                            onRefresh={() => this.onRefresh(true, true)}
                                        />}
                                    />
                                    :
                                    <ListEmptyComponent module={R.strings.add_site_token}
                                        onPress={() => this.props.navigation.navigate('SiteTokenAddEditScreen', { onRefresh: this.onRefresh })} />
                                }
                            </View>
                    }
                </View>
            </SafeView>
        );
    }
}

// This class is used for display record in list
class SiteTokenItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {

        //check previous item and current item is same or not
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {
        // Get Reuired field from props
        let { item: { CurrencySMSCode, BaseCurrencySMSCode, MinLimit, MaxLimit, DailyLimit, WeeklyLimit, MonthlyLimit, Status }, index, size } = this.props;

        // apply color based on status
        let statusColor = Status == 1 ? R.colors.successGreen : R.colors.failRed;
        let statusText = Status == 1 ? R.strings.active : R.strings.inActive;

        return (
            // Flatlist item item
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                            {/* image for site token */}
                            <ImageTextButton
                                style={{ margin: 0, padding: 0, justifyContent: 'center', width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                icon={R.images.IC_KEY}
                                iconStyle={{ height: R.dimens.SMALLEST_ICON_SIZE, width: R.dimens.SMALLEST_ICON_SIZE, tintColor: R.colors.white }}
                            />

                            {/* for currency and base currency */}
                            <TextViewMR style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallText, paddingLeft: R.dimens.widgetMargin }}>{validateValue(BaseCurrencySMSCode) + '/' + validateValue(CurrencySMSCode)}</TextViewMR>

                        </View>

                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>

                                {/* for min limit and max limit */}
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.limit + ': '}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{validateValue(MinLimit) + ' - ' + validateValue(MaxLimit)}</TextViewHML>
                                </View>

                                {/* for daily limit */}
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.daily_limit + ': '}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{validateValue(DailyLimit)}</TextViewHML>
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>

                                {/* for weekly limit */}
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.weekly_limit + ': '}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{validateValue(WeeklyLimit)}</TextViewHML>
                                </View>

                                {/* for Monthly limit */}
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.monthly_limit + ': '}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{validateValue(MonthlyLimit)}</TextViewHML>
                                </View>
                            </View>
                        </View>

                        {/* for show status , edit icon  */}
                        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                            <StatusChip
                                color={statusColor}
                                value={statusText ? statusText : '-'}
                            />
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
                                onPress={this.props.onEdit} />
                        </View>

                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    //Updated SiteTokenReducer Data 
    return { data: state.SiteTokenReducer }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getSiteTokenList action
        getSiteTokenList: (request) => dispatch(getSiteTokenList(request)),
        //clear data
        clearSiteToken: () => dispatch(clearSiteToken()),
    }
}
export default connect(mapStatToProps, mapDispatchToProps)(SiteTokenScreen);