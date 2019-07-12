// DiscoverScreen
import React, { Component } from 'react';
import {
    View,
    ScrollView,
    FlatList,
    RefreshControl,
    TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { changeTheme, parseArray, convertDate, } from '../../controllers/CommonUtils';
import { isCurrentScreen } from '../Navigation';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import ListLoader from '../../native_theme/components/ListLoader';
import { ListEmptyComponent, contentContainerStyle } from '../../native_theme/components/FlatListWidgets';
import Separator from '../../native_theme/components/Separator';
import R from '../../native_theme/R';
import { NewsSectionFatchData } from '../../actions/CMS/NewsSectionAction'
import CommonToast from '../../native_theme/components/CommonToast';
import { Category } from '../CMS/MyAccount';
import MenuListItem from '../../native_theme/components/MenuListItem';
import { getData } from '../../App';
import { ServiceUtilConstant } from '../../controllers/Constants';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class DiscoverScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            search: '',
            refreshing: false,
            categoryList: [
                { title: R.strings.Announcement, screenname: 'Announcement' },
                { title: R.strings.coins, screenname: 'ListCoinScreen' },
                // { title: R.strings.coins, screenname: 'AccountSubMenu', icons: R.images.IC_EXCHANGE, category: Category.Exchange },
                { title: R.strings.helpAndSupport, screenname: 'AccountSubMenu', category: Category.Support },
                { title: R.strings.policy, screenname: 'AccountSubMenu', category: Category.Policy },
            ],
            locale: getData(ServiceUtilConstant.KEY_Locale)
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            //  call api for newsdata fetch
            this.props.NewsSectionFatchData()
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        // To Skip Render if old and new props are equal
        if (DiscoverScreen.oldProps !== props) {
            DiscoverScreen.oldProps = props;
        } else {
            return null;
        }

        //If previous and new languages are different than refresh static list to change effect of language.
        if (state.locale !== props.preference.locale) {
            return Object.assign({}, state, {
                locale: props.preference.locale,
                categoryList: [
                    { title: R.strings.Announcement, screenname: 'Announcement' },
                    { title: R.strings.coins, screenname: 'ListCoinScreen' },
                    // { title: R.strings.coins, screenname: 'AccountSubMenu', icons: R.images.IC_EXCHANGE, category: Category.Exchange },
                    { title: R.strings.helpAndSupport, screenname: 'AccountSubMenu', category: Category.Support },
                    { title: R.strings.policy, screenname: 'AccountSubMenu', category: Category.Policy },
                ],
            })
        }

        if (isCurrentScreen(props)) {
            const { newsdata } = props;

            if (newsdata) {
                try {
                    //if local newsdata state is null or its not null and also different then new response then and only then validate response.
                    if (state.newsdata == null || (state.newsdata != null && newsdata !== state.newsdata)) {
                        if (validateResponseNew({ response: newsdata.data, returnCode: newsdata.data.responseCode, returnMessage: newsdata.data.message, isList: true })) {
                            //Get array from response
                            var res = parseArray(newsdata.data);
                            //Set State For Api response 
                            return Object.assign({}, state, {
                                data: res,
                                refreshing: false
                            })
                        }
                        else {
                            return Object.assign({}, state, {
                                data: [],
                                refreshing: false
                            })
                        }
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    return Object.assign({}, state, {
                        data: [],
                        refreshing: false
                    })
                }
            }
        }
        return null;
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //If theme or locale is changed then update componenet
        if (this.props.preference.theme !== nextProps.preference.theme || this.props.preference.locale !== nextProps.preference.locale) {
            return true;
        } else {
            if (this.props.isNewsFetch !== nextProps.isNewsFetch
                || this.props.newsdata !== nextProps.newsdata
                || this.state.refreshing !== nextState.refreshing
                || this.state.search !== nextState.search) {
                return isCurrentScreen(nextProps);
            } else {
                return false;
            }
        }
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {
            //  call api for newsdata fetch
            this.props.NewsSectionFatchData()
        } else {
            this.setState({ refreshing: false });
        }
    }

    onAdPress = () => {
        this.refs.Toast.Show(R.strings.AD);
    }

    moveToScreen(item) {
        if (item.screenname != '') {
            var { navigate } = this.props.navigation;
            navigate(item.screenname, { category: item.category ? item.category : '', title: item.title })
        }
    }

    render() {
        // loading bit for display listloader
        const { isNewsFetch } = this.props;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.LatestTrends}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ search: input })} />

                {/* For Toast */}
                <CommonToast ref="Toast" />

                <ScrollView showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            colors={[R.colors.accent]}
                            progressBackgroundColor={R.colors.background}
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />}>
                    {/* for show image */}
                    {/* <View style={{ height: R.dimens.QRCodeIconWidthHeight, backgroundColor: R.colors.background, elevation: R.dimens.toastElevation }}></View> */}

                    <View style={{ marginLeft: R.dimens.padding_left_right_margin, marginRight: R.dimens.padding_left_right_margin }}>
                        {/* for display text for Latest Trends */}
                        {/* <TextViewMR style={{
                                marginBottom: R.dimens.padding_top_bottom_margin,
                                fontSize: R.dimens.mediumText,
                                color: R.colors.textPrimary,
                            }}>{R.strings.LatestTrends}</TextViewMR> */}

                        {/* for display  Latest Trend data list  */}
                        {isNewsFetch && !this.state.refreshing ?
                            <View style={{ height: R.dimens.emptyListWidgetHeight }}>
                                <ListLoader />
                            </View>
                            :
                            <FlatList
                                data={this.state.data.filter(item => item.locale[R.strings.getLanguage()].title.toLowerCase().includes(this.state.search.toLowerCase()))}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => {
                                    return <TrendItem item={item} preference={this.props.preference} navigation={this.props.navigation} />
                                }}
                                keyExtractor={(item, index) => index.toString()}
                                ItemSeparatorComponent={() => <Separator style={{ marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin }} />}
                                contentContainerStyle={contentContainerStyle(this.state.data)}
                                ListEmptyComponent={<View style={{ height: R.dimens.emptyListWidgetHeight }}>
                                    <ListEmptyComponent />
                                </View>} />
                        }

                        {this.state.data.length > 0 && <Separator style={{ marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin }} />}

                        {/* for display text for Explore by Category */}
                        <TextViewMR style={{
                            marginTop: R.dimens.padding_top_bottom_margin,
                            marginBottom: R.dimens.padding_top_bottom_margin,
                            fontSize: R.dimens.mediumText,
                            color: R.colors.textPrimary,
                        }}>{R.strings.ExplorebyCategory}</TextViewMR>

                        {/* for display static data flatlist  */}
                        <View style={{ marginBottom: R.dimens.widgetMargin }}>
                            {this.state.categoryList.length > 0 ?
                                <FlatList
                                    data={this.state.categoryList}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) => {

                                        return <MenuListItem
                                            key={index + ''}
                                            title={item.title}
                                            onPress={() => this.moveToScreen(item)}
                                            style={{
                                                marginTop: 0,
                                                marginBottom: 0,
                                                backgroundColor: 'transparent'
                                            }}
                                            separator={index != this.state.categoryList.length - 1}
                                        />
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                    contentContainerStyle={contentContainerStyle(this.state.categoryList)}
                                />
                                :
                                <ListEmptyComponent />
                            }
                        </View>

                        {/* for display AD Button */}
                        {/* <View style={{ paddingBottom: R.dimens.activity_margin, paddingTop: R.dimens.activity_margin }}>
                                <Button
                                    style={{
                                        height: R.dimens.signup_screen_logo_height, backgroundColor: R.colors.cardBackground
                                    }}
                                    textStyle={{ color: R.colors.textPrimary }}
                                    title={R.strings.AD}
                                    onPress={this.onAdPress} />
                            </View> */}
                    </View>
                </ScrollView>
            </SafeView>
        )
    }
}

class TrendItem extends Component {

    showdetails = (title, content, date) => {
        this.props.navigation.navigate('NewsSectionDetail', { maintitle: title, maincontent: content, maindate: date });
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.preference.theme !== nextProps.preference.theme
            || this.props.preference.locale !== nextProps.preference.locale
            || this.props.item !== nextProps.item) {
            return true;
        }
        return false;
    }

    render() {
        let item = this.props.item; //for get single item from trendlist
        return (
            <AnimatableItem>
                <View style={{ paddingTop: R.dimens.margin, paddingBottom: R.dimens.margin }}>
                    <TouchableWithoutFeedback onPress={() => this.showdetails(item.locale[R.strings.getLanguage()].title, item.locale[R.strings.getLanguage()].content, item.date_created)}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '100%' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.locale[R.strings.getLanguage()].title} </TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, marginTop: R.dimens.widgetMargin }}>{convertDate(item.date_created)}</TextViewHML>
                            </View>

                            {/*  <View style={{ width: '30%', padding: R.dimens.margin, alignItems: 'flex-end' }}>
                            <View style={{ backgroundColor: R.colors.cardBackground, elevation: R.dimens.toastElevation, height: R.dimens.signup_screen_logo_height, width: R.dimens.LoginImageWidthHeight, }} />
                        </View> */}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStateToProps(state) {
    return {
        //data get from the reducer and set to sectiondata
        isNewsFetch: state.NewsSectionReducer.isNewsFetch,
        newsdata: state.NewsSectionReducer.newsdata,
        preference: state.preference
    }
}
function mapDispatchToProps(dispatch) {
    return {
        // To perform action for NewsSection 
        NewsSectionFatchData: () => dispatch(NewsSectionFatchData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiscoverScreen)