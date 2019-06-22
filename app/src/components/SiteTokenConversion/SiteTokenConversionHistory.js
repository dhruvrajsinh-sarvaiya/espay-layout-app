import React, { Component } from 'react';
import {
    View,
    FlatList,
    RefreshControl,
    Image,
    Text
} from 'react-native';
import { connect } from 'react-redux';
import { getSiteTokenReportList } from '../../actions/SiteTokenConversion/SiteTokenConversionAction'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen } from '../Navigation';
import { changeTheme, parseArray, parseFloatVal, convertDateTime, } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../validations/CommonValidation';
import Separator from '../../native_theme/components/Separator';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import ListLoader from '../../native_theme/components/ListLoader';
import R from '../../native_theme/R';
import ImageViewWidget from '../Widget/ImageViewWidget';
import CardView from '../../native_theme/components/CardView';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

class SiteTokenConversionHistory extends Component {
    constructor(props) {
        super(props);

        //Define All State initial state
        this.state = {
            response: [],
            searchInput: '',
            refreshing: false,
            isFirstTime: true,
        };
        //----------

        //To Bind All Method
        this.onRefresh = this.onRefresh.bind(this);
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get Site Token History API
            this.props.getSiteTokenReportList();
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get Site Token History API
            this.props.getSiteTokenReportList();
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }
    //-----------

    shouldComponentUpdate = (nextProps, nextState) => {
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
        if (SiteTokenConversionHistory.oldProps !== props) {
            SiteTokenConversionHistory.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { SiteTokenHistorydata, SiteTokenHistoryFetchData } = props;

            //To Check Site Token History Data Fetch or Not
            if (!SiteTokenHistoryFetchData) {
                try {
                    if (validateResponseNew({ response: SiteTokenHistorydata, isList: true })) {

                        var resData = parseArray(SiteTokenHistorydata.Response);
                        return {
                            ...state,
                            response: resData,
                            refreshing: false,
                        }
                    }
                    else {
                        return {
                            ...state,
                            response: [],
                            refreshing: false,
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        response: [],
                        refreshing: false,
                    }
                    //Handle Catch and Notify User to Exception.
                }
            }
        }
        return null;
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { SiteTokenHistoryisFetching } = this.props;
        //----------

        //for final items from search input (validate on SourceCurrency and TargerCurrency)
        //default searchInput is empty so it will display all records.
        let finalItems = this.state.response.filter(item => item.SourceCurrency.toLowerCase().includes(this.state.searchInput.toLowerCase()) || item.TargerCurrency.toLowerCase().includes(this.state.searchInput.toLowerCase()));

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.SiteTokenHistory}
                    isBack={true}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })}
                    nav={this.props.navigation}
                />

                {/* To Check Response fetch or not if SiteTokenHistoryisFetching = true then display progress bar else display List*/}
                {(SiteTokenHistoryisFetching && !this.state.refreshing) ?
                    <ListLoader />
                    :
                    <View style={{ flex: 1 }}>

                        {finalItems.length ?
                            <View style={{ flex: 1 }}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={finalItems}
                                    /* render all item in list */
                                    renderItem={({ item, index }) => <FlatListItem item={item} index={index} size={this.state.response.length} ></FlatListItem>}
                                    /* assign index as key valye to Site Token History list item */
                                    keyExtractor={(item, index) => index.toString()}
                                    /* For Refresh Functionality In Site Token History FlatList Item */
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            progressBackgroundColor={R.colors.background}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                        />
                                    } />
                            </View>
                            : !SiteTokenHistoryisFetching && <ListEmptyComponent module={R.strings.ConverttoSiteToken} onPress={() => this.props.navigation.navigate('SiteTokenConversion')} />
                        }
                    </View>
                }
            </SafeView>
        );
    }
}

// This Class is used for display record in list
class FlatListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {

        // get required params from props
        let item = this.props.item;
        let { index, size, } = this.props;

        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        flexDirection: 'column',
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>

                            <View style={{ flex: 1, flexDirection: 'column' }}>

                                {/* Source Currecny and Token Price */}
                                <View style={{ flexDirection: 'row' }}>
                                    <ImageViewWidget url={item.SourceCurrency ? item.SourceCurrency : ''} width={R.dimens.IconWidthHeight} height={R.dimens.IconWidthHeight} />
                                    <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>

                                        <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.SourceCurrency ? item.SourceCurrency : '-'}</Text>
                                        {/* seprator */}
                                        <Separator style={{ width: wp('10%'), marginTop: R.dimens.widget_top_bottom_margin, marginLeft: 0, marginRight: 0 }} />
                                    </View>
                                </View>

                                {/* Source Qty and Price */}
                                <View style={{ flex: 1, }}>

                                    <View style={{ marginRight: R.dimens.widget_left_right_margin, flexDirection: 'row', }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, marginTop: R.dimens.widgetMargin, }}>{R.strings.Qty} : </TextViewHML>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, marginTop: R.dimens.widgetMargin, }}>{validateValue(parseFloatVal(item.SourceCurrencyQty).toFixed(8))}</TextViewHML>
                                    </View>

                                    <View style={{ flexDirection: 'row', }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, marginTop: R.dimens.widgetMargin, }}>{R.strings.Price} : </TextViewHML>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, marginTop: R.dimens.widgetMargin, }}>{validateValue(parseFloatVal(item.SourceToBasePrice).toFixed(8))}</TextViewHML>
                                    </View>
                                </View>

                            </View>

                            <Image style={{ marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin, tintColor: R.colors.textPrimary, width: R.dimens.IconWidthHeight, height: R.dimens.IconWidthHeight }} source={R.images.IC_TRANSFER} />

                            <View style={{ flex: 1, flexDirection: 'column', }}>

                                {/* Target Currency*/}
                                <View style={{ flexDirection: 'row' }}>
                                    <ImageViewWidget url={item.TargerCurrency ? item.TargerCurrency : ''} width={R.dimens.IconWidthHeight} height={R.dimens.IconWidthHeight} />

                                    <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
                                        <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.TargerCurrency ? item.TargerCurrency : '-'}</Text>
                                        {/* seprator */}
                                        <Separator style={{ width: wp('10%'), marginTop: R.dimens.widget_top_bottom_margin, marginLeft: 0, marginRight: 0 }} />
                                    </View>
                                </View>

                                {/* Source Qty and Price */}
                                <View style={{ flex: 1, }}>
                                    <View style={{ marginRight: R.dimens.widget_left_right_margin, flexDirection: 'row', }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, marginTop: R.dimens.widgetMargin, }}>{R.strings.Qty} : </TextViewHML>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, marginTop: R.dimens.widgetMargin, }}>{validateValue(parseFloatVal(item.TargetCurrencyQty).toFixed(8))}</TextViewHML>
                                    </View>

                                    <View style={{ flexDirection: 'row', }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, marginTop: R.dimens.widgetMargin, }}>{R.strings.Price} : </TextViewHML>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, marginTop: R.dimens.widgetMargin, }}>{validateValue(parseFloatVal(item.SourceToBaseQty).toFixed(8))}</TextViewHML>
                                    </View>
                                </View>

                            </View>
                        </View>

                        {/* Date and Time */}
                        <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin, justifyContent: 'space-between', }}>
                            <TextViewHML style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, }}>{validateValue(parseFloatVal(item.TokenPrice).toFixed(8))}</TextViewHML>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Image style={{ tintColor: R.colors.textSecondary, width: R.dimens.etHeaderImageHeightWidth, height: R.dimens.etHeaderImageHeightWidth }} source={R.images.IC_TIMER} />
                                <TextViewHML style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.TrnDate, 'YYYY-MM-DD HH:mm:ss A', false)}</TextViewHML>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    };
}

function mapStateToProps(state) {
    return {
        //For Update isPortrait true or false
        preference: state.preference.dimensions.isPortrait,
        //Updated Data For Site Token History Action
        SiteTokenHistoryFetchData: state.SiteTokenConversionReducer.SiteTokenHistoryFetchData,
        SiteTokenHistorydata: state.SiteTokenConversionReducer.SiteTokenHistorydata,
        SiteTokenHistoryisFetching: state.SiteTokenConversionReducer.SiteTokenHistoryisFetching,
    }
}

function mapDispatchToProps(dispatch) {

    return {
        //Perform Site Token History
        getSiteTokenReportList: () => dispatch(getSiteTokenReportList()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SiteTokenConversionHistory)