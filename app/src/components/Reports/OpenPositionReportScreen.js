import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text, Easing } from 'react-native';
import { connect } from 'react-redux';
import { getOpenPositionReportData } from '../../actions/Reports/OpenPositionReportAction'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen, addRouteToBackPress } from '../Navigation';
import { changeTheme, parseArray, parseFloatVal, convertDateTime } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../validations/CommonValidation';
import { ListEmptyComponent, contentContainerStyle, } from '../../native_theme/components/FlatListWidgets';
import ListLoader from '../../native_theme/components/ListLoader';
import R from '../../native_theme/R';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../Widget/FilterWidget';
import CardView from '../../native_theme/components/CardView';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import { getPairList } from '../../actions/PairListAction';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class OpenPositionReportScreen extends Component {

    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            response: [],
            searchInput: '',
            refreshing: false,
            isFirstTime: true,

            currencyPairs: [{ value: R.strings.all, PairId: 0 }],
            selectedCurrencyPair: R.strings.all,
            currencyPairId: 0,
            isDrawerOpen: false, // First Time Drawer is Closed
        };

        // create Reference
        this.drawer = React.createRef()

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });

        //Initial Request Parameter
        this.Request = {
            PairId: '',
        }
    }

    //for BackPress if Drawer is Open Than First Close The Drawer else Back to Previous Screen
    onBackPress() {
        if (this.state.isDrawerOpen) {
            this.drawer.closeDrawer();
            this.setState({ isDrawerOpen: false })
        }
        else {
            //going back screen
            this.props.navigation.goBack();
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //to get pair list
            this.props.getCurrencyPairs();

            //Call Open Position Report API
            this.props.getOpenPositionReportData(this.Request);
            //----------
        }
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {

        this.setState({ refreshing: true })

        //Check NetWork is Available or not
        if (await isInternet()) {

            // bind request for OpenPositionReport
            this.Request = {
                PairId: this.state.currencyPairId != 0 ? this.state.currencyPairId : '',
            }
            //Call Open Position Report API
            this.props.getOpenPositionReportData(this.Request);
            //----------
        } else {
            this.setState({ refreshing: false })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return isCurrentScreen(nextProps);
    };

    // Called when user press on Reset Button from Drawer
    onResetPress = async () => {
        this.drawer.closeDrawer();

        // set initial state
        this.setState({
            searchInput: '',
            refreshing: false,

            selectedCurrencyPair: R.strings.all,
            currencyPairId: 0,
        })

        //Check NetWork is Available or not
        if (await isInternet()) {

            // bind request for OpenPositionReport
            this.Request = {
                PairId: this.state.currencyPairId != 0 ? this.state.currencyPairId : '',
            }
            //Call Open Position Report API
            this.props.getOpenPositionReportData(this.Request)
        }
    }

    // Called when user press on Complete Button from Drawer
    onCompletePress = async () => {

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen */
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            // bind request for OpenPositionReport
            this.Request = {
                PairId: this.state.currencyPairId != 0 ? this.state.currencyPairId : '',
            }
            //Call Open Position Report API
            this.props.getOpenPositionReportData(this.Request)
        } else {
            this.setState({ refreshing: false });
        }

        // searchInput empty when user click on Complete button from Drawer
        this.setState({ searchInput: '' })
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
        if (OpenPositionReportScreen.oldProps !== props) {
            OpenPositionReportScreen.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { positionReportDataFetch, positionReportData, pairList, pairListDataFetch, } = props;

            //To Check pair List Data Fetch or Not
            if (!pairListDataFetch) {
                try {

                    if (validateResponseNew({ response: pairList, isList: true })) {
                        let resPair = parseArray(pairList.Response);

                        resPair.map((item, index) => {
                            resPair[index].value = item.PairName;
                        })

                        let currencyPairs = [
                            { value: R.strings.all, PairId: 0 },
                            ...resPair
                        ];

                        return Object.assign({}, state, { pairList, currencyPairs })
                    } else {
                        return Object.assign({}, state, { pairList, currencyPairs: [{ value: R.strings.all, PairId: 0 }] })
                    }
                } catch (e) {
                    return Object.assign({}, state, { refreshing: false });
                }
            }

            //To Check position Report Data Fetch or Not
            if (!positionReportDataFetch) {
                try {
                    if (validateResponseNew({ response: positionReportData, isList: true })) {
                        return {
                            ...state,
                            response: parseArray(positionReportData.Data[0].DetailedData),
                            refreshing: false
                        }
                    } else {
                        return {
                            ...state,
                            refreshing: false,
                            response: [],
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        refreshing: false,
                        response: [],
                    }
                }
            }
        }
        return null;
    }

    //Navigation Drawer Functionality
    navigationDrawer = () => {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* filterwidget for display currencypair data */}
                <FilterWidget
                    comboPickerStyle={{ marginTop: 0 }}
                    pickers={[{
                        title: R.strings.selectPair,
                        array: this.state.currencyPairs,
                        selectedValue: this.state.selectedCurrencyPair,
                        onPickerSelect: (item, object) => { this.setState({ selectedCurrencyPair: item, currencyPairId: object.PairId }) }
                    }]}
                    onCompletePress={this.onCompletePress}
                    onResetPress={this.onResetPress}
                />
            </SafeView>
        )
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { loading } = this.props;
        //----------

        //for final items from search input on pairname, trnno, and ordertype
        let finalItems = this.state.response.filter(opnPositionReportItem =>
            opnPositionReportItem.PairName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            ("" + opnPositionReportItem.TrnNo).includes(this.state.searchInput) ||
            opnPositionReportItem.OrderType.toLowerCase().includes(this.state.searchInput.toLowerCase()));

        return (
            //DrawerLayout for Withdraw History Filteration
            <Drawer
                ref={cmp => this.drawer = cmp}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.openPositionReport}
                        nav={this.props.navigation}
                        isBack={true}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between', }}>
                        {/* To Check Response fetch or not if loading = true then display progress bar else display List*/}
                        {
                            (loading && !this.state.refreshing) ?
                                <ListLoader />
                                :
                                <View style={{ flex: 1 }}>
                                    {finalItems.length ?
                                        <View style={{ flex: 1 }}>
                                            <FlatList
                                                showsVerticalScrollIndicator={false}
                                                data={finalItems}
                                                renderItem={({ item, index }) =>
                                                    <OpenPositionReportList
                                                        opnPositionReportItem={item}
                                                        opnPositionReportIndex={index}
                                                        opnPositionReportSize={this.state.response.length}
                                                    />
                                                }
                                                keyExtractor={(item, index) => index.toString()}
                                                contentContainerStyle={contentContainerStyle(finalItems)}
                                                ListEmptyComponent={<ListEmptyComponent />}
                                                /* for refreshing data of flatlist */
                                                refreshControl={
                                                    <RefreshControl
                                                        colors={[R.colors.accent]}
                                                        progressBackgroundColor={R.colors.background}
                                                        refreshing={this.state.refreshing}
                                                        onRefresh={this.onRefresh}
                                                    />
                                                }
                                            />
                                        </View> : <ListEmptyComponent />}
                                </View>
                        }
                    </View>
                </SafeView >
            </Drawer>
        );
    }
}

// This Class is used for display record in list
class OpenPositionReportList extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.opnPositionReportItem !== nextProps.opnPositionReportItem) {
            return true;
        }
        return false;
    }

    render() {

        // Get required fields from props 
        let { opnPositionReportItem, opnPositionReportIndex, opnPositionReportSize } = this.props;

        // Set color based on status
        let statusColor = opnPositionReportItem.OrderType === 'Buy' ? R.colors.successGreen : R.colors.failRed

        return (
            <AnimatableItem>
                <View style={{
                    flexDirection: 'row',
                    marginLeft: R.dimens.WidgetPadding,
                    marginRight: R.dimens.WidgetPadding, marginTop: (opnPositionReportIndex == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    arginBottom: (opnPositionReportIndex == opnPositionReportSize - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>

                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        flexDirection: 'column',
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>

                        {/* for show pairName,OrderType and TrnNo */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                            <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{opnPositionReportItem.PairName}  <Text style={{ color: statusColor, fontSize: R.dimens.volumeText, fontFamily: Fonts.MontserratSemiBold }}>{opnPositionReportItem.OrderType}</Text></Text>
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, textAlign: 'right' }}>{R.strings.Trn_No} : <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{opnPositionReportItem.TrnNo}</TextViewHML></TextViewHML>
                        </View>

                        {/* for show qty,bid price and landing price */}
                        <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', marginBottom: R.dimens.widgetMargin }}>
                            <View style={{ width: '30%', justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML numberOfLines={1} ellipsizeMode={'tail'} style={[this.styles().headerItem]}>{R.strings.Qty}</TextViewHML>
                                <TextViewHML style={[this.styles().detailItem]}>{(parseFloatVal(opnPositionReportItem.Qty).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(opnPositionReportItem.Qty).toFixed(8)) : '-')}</TextViewHML>
                            </View>

                            <View style={{ width: '40%', justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML numberOfLines={1} ellipsizeMode={'tail'} style={[this.styles().headerItem]}>{R.strings.bidPrice}</TextViewHML>
                                <TextViewHML style={[this.styles().detailItem]}>{(parseFloatVal(opnPositionReportItem.BidPrice).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(opnPositionReportItem.BidPrice).toFixed(8)) : '-')}</TextViewHML>
                            </View>

                            <View style={{ width: '30%', justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML numberOfLines={1} ellipsizeMode={'tail'} style={[this.styles().headerItem]}>{R.strings.landingPrice}</TextViewHML>
                                <TextViewHML style={[this.styles().detailItem]}>{(parseFloatVal(opnPositionReportItem.LandingPrice).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(opnPositionReportItem.LandingPrice).toFixed(8)) : '-')}</TextViewHML>
                            </View>
                        </View>

                        {/* for show Datetime*/}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <ImageTextButton
                                style={{ margin: 0, paddingRight: R.dimens.LineHeight }}
                                icon={R.images.IC_TIMER}
                                iconStyle={{ tintColor: R.colors.textSecondary, width: R.dimens.smallestText, height: R.dimens.smallestText }}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, textAlign: 'center', fontSize: R.dimens.smallestText }}>{opnPositionReportItem.TrnDate ? convertDateTime(opnPositionReportItem.TrnDate, 'YYYY-MM-DD HH:mm:ss', false) : '-'}</TextViewHML>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    };

    styles = () => {
        return {
            headerItem: {
                color: R.colors.textSecondary,
                fontSize: R.dimens.smallText,
                textAlign: 'center',
            },
            detailItem: {
                color: R.colors.textPrimary,
                fontSize: R.dimens.smallText,
                textAlign: 'center'
            }
        }
    }
}

function mapStateToProps(state) {
    return {
        // Updated Data for PairList
        pairList: state.OpenPositionReportReducer.pairList,
        pairListDataFetch: state.OpenPositionReportReducer.pairListDataFetch,

        // Updated Data for OpenPositionReport
        loading: state.OpenPositionReportReducer.loading,
        positionReportData: state.OpenPositionReportReducer.positionReportData,
        positionReportDataFetch: state.OpenPositionReportReducer.positionReportDataFetch,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // Perform Open Position Report Action
        getOpenPositionReportData: (ReqObj) => dispatch(getOpenPositionReportData(ReqObj)),
        // Perform currency pair Action
        getCurrencyPairs: () => dispatch(getPairList()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OpenPositionReportScreen)