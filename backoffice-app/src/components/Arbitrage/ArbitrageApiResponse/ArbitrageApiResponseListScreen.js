// ArbitrageApiResponseListScreen.js
import React, { Component } from 'react'
import { View, FlatList, RefreshControl } from 'react-native'
import { changeTheme, parseArray, addPages, } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import PaginationWidget from '../../widget/PaginationWidget';
import { getArbitrageApiResponse, clearArbitrageApiResponseData } from '../../../actions/Arbitrage/ArbitrageApiResponseActions';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { isInternet, validateResponseNew, } from '../../../validations/CommonValidation';
import { AppConfig } from '../../../controllers/AppConfig';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import StatusChip from '../../widget/StatusChip';

export class ArbitrageApiResponseListScreen extends Component {
    constructor(props) {
        super(props);

        //Define all initial state
        this.state = {
            row: [],
            // for Arbitrage Api Response List
            ArbiApiResponseListResponse: [],
            ArbiApiResponseListState: null,

            selectedPage: 1,
            searchInput: '',

            refreshing: false,
            isFirstTime: true,
        }

        this.request = {
            Page: 1,
            PageSize: AppConfig.pageSize,
        }

        //add current route for backpress handle
        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
    }

    // return to previous screen
    onBackPress = () => {
        //goging back screen
        this.props.navigation.goBack();
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme()

        this.callArbiApiResponse()
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    componentWillUnmount() {
        // clear reducer data
        this.props.clearArbitrageApiResponseData()
    }

    // for swipe to refresh functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Arbitrage Api Response List
            this.request = {
                ...this.request,
                Page: this.state.selectedPage,
            }
            // Call Get Arbitrage Api Response List API
            this.props.getArbitrageApiResponse(this.request);

        } else {
            this.setState({ refreshing: false });
        }
    }


    // Pagination Method Called When User Change Page 
    onPageChange = async (pageNo) => {

        //if selected page is diffrent than call api
        if (pageNo != this.state.selectedPage) {
            //if user selecte other page number then and only then API Call elase no need to call API
            this.setState({ selectedPage: pageNo });

            // Check NetWork is Available or not
            if (await isInternet()) {
                // Bind request for Arbitrage Api Response List
                this.request = {
                    ...this.request,
                    Page: pageNo,
                }
                //Call Get Arbitrage Api Response List API
                this.props.getArbitrageApiResponse(this.request);
            } else {
                this.setState({ refreshing: false });
            }
        }
    }


    //api call
    callArbiApiResponse = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.setState({ selectedPage: 1, })
            this.request = {
                Page: 1,
                PageSize: AppConfig.pageSize,
            }
            // Call Arbitrage Api Response List Api
            this.props.getArbitrageApiResponse(this.request)

        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (ArbitrageApiResponseListScreen.oldProps !== props) {
            ArbitrageApiResponseListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { ArbiApiResponseList } = props.ApiResponseResult

            // ArbiApiResponseList is not null
            if (ArbiApiResponseList) {
                try {
                    if (state.ArbiApiResponseListState == null || (state.ArbiApiResponseListState !== null && ArbiApiResponseList !== state.ArbiApiResponseListState)) {
                        //succcess response fill the list 
                        if (validateResponseNew({ response: ArbiApiResponseList, isList: true, })) {

                            return Object.assign({}, state, {
                                ArbiApiResponseListState: ArbiApiResponseList,
                                ArbiApiResponseListResponse: parseArray(ArbiApiResponseList.Response),
                                refreshing: false,
                                row: addPages(ArbiApiResponseList.Count)
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                ArbiApiResponseListState: null,
                                ArbiApiResponseListResponse: [],
                                refreshing: false,
                                row: []
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        ArbiApiResponseListState: null,
                        ArbiApiResponseListResponse: [],
                        refreshing: false,
                        row: [],
                    })
                }
            }
        }
        return null
    }

    render() {
        // Loading status for Progress bar which is fetching from reducer
        let { ArbiApiResponseLoading, } = this.props.ApiResponseResult

        // For searching functionality
        let finalItems = this.state.ArbiApiResponseListResponse.filter(item => (
            item.BalanceRegex.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.StatusRegex.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.TrnRefNoRegex.toLowerCase().includes(this.state.searchInput.toLowerCase())
        ))

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    title={R.strings.arbitrageApiResponse}
                    onBackPress={() => this.onBackPress()}
                    nav={this.props.navigation}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => { this.props.navigation.navigate('ArbitrageApiResponseAddEditScreen', { onSuccess: this.callArbiApiResponse }) }}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {
                        (ArbiApiResponseLoading && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <FlatList
                                data={finalItems}
                                showsVerticalScrollIndicator={false}
                                // render all item in list
                                renderItem={({ item, index }) => <ArbitrageApiResponseListItem
                                    index={index}
                                    item={item}
                                    size={finalItems.length}
                                    onDetailPress={() => this.props.navigation.navigate('ArbitrageApiResponseDetailsScreen', { item })}
                                    onPress={() => { this.props.navigation.navigate('ArbitrageApiResponseAddEditScreen', { item, onSuccess: this.callArbiApiResponse, edit: true }) }}
                                />
                                }
                                // assign index as key value to Arbitrage Api Response list item
                                keyExtractor={(_item, index) => index.toString()}
                                // For Refresh Functionality In Arbitrage Api Response FlatList Item
                                refreshControl={
                                    <RefreshControl
                                        progressBackgroundColor={R.colors.background} colors={[R.colors.accent]}
                                        refreshing={this.state.refreshing} onRefresh={this.onRefresh}
                                    />
                                }
                                contentContainerStyle={contentContainerStyle(finalItems)}
                                // Displayed empty component when no record found 
                                ListEmptyComponent={<ListEmptyComponent />}
                            />
                    }

                    {/*To Set Pagination View  */}
                    <View>
                        {
                            finalItems.length > 0 &&
                            <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
                        }
                    </View>
                </View>
            </SafeView>
        )
    }
}

// This Class is used for display record in list
class ArbitrageApiResponseListItem extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item === nextProps.item)
            return false
        return true
    }

    render() {
        let { size, index, item, onPress, onDetailPress } = this.props
        return (
            // flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    flex: 1,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView style={{
                        borderTopRightRadius: R.dimens.margin,
                        flex: 1,
                        elevation: R.dimens.listCardElevation,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderRadius: 0,
                    }} onPress={onDetailPress}>

                        {/* for balance, status and transaction Regex */}
                        <View style={{ flex: 1, }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                <TextViewHML style={[this.styles().title]}>{R.strings.balanceRegex}</TextViewHML>
                                <ImageTextButton
                                    icon={R.images.RIGHT_ARROW_DOUBLE}
                                    style={{ margin: 0 }}
                                    iconStyle={{
                                        width: R.dimens.dashboardMenuIcon,
                                        height: R.dimens.dashboardMenuIcon,
                                        tintColor: R.colors.textPrimary
                                    }}
                                    onPress={onDetailPress} />
                            </View>
                            <TextViewHML numberOfLines={1} style={[this.styles().value]}>{item.BalanceRegex ? item.BalanceRegex : '-'}</TextViewHML>

                            <TextViewHML style={[this.styles().title]}>{R.strings.statusRegex}</TextViewHML>
                            <TextViewHML numberOfLines={1} style={[this.styles().value]}>{item.StatusRegex ? item.StatusRegex : '-'}</TextViewHML>

                            <TextViewHML style={[this.styles().title]}>{R.strings.trnRefNoRegex}</TextViewHML>
                            <TextViewHML numberOfLines={1} style={[this.styles().value]}>{item.TrnRefNoRegex ? item.TrnRefNoRegex : '-'}</TextViewHML>

                        </View>

                        {/* for status and Edit icon */}
                        <View style={{justifyContent: 'space-between', flex: 1, flexDirection: 'row',  alignItems: 'center', marginTop: R.dimens.widgetMargin }}>
                            <StatusChip
                                color={(item.Status === 1) ? R.colors.successGreen : R.colors.failRed}
                                value={item.Status === 1 ? R.strings.Success : R.strings.Failed} />
                            <ImageTextButton
                                style={
                                    {
                                        margin: 0,
                                        alignItems: 'center',
                                        backgroundColor: R.colors.accent,
                                        borderRadius: R.dimens.titleIconHeightWidth,
                                        justifyContent: 'center',  padding: R.dimens.CardViewElivation,
                                    }}
                                icon={R.images.IC_EDIT}
                                iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                onPress={onPress} />
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
    // style for this class
    styles = () => {
        return {
            title: {
                flex: 1,
                fontSize: R.dimens.smallText,
                color: R.colors.textSecondary,

            },
            value: {
                fontSize: R.dimens.smallText,
                color: R.colors.textPrimary,
            }
        }
    }
}

const mapStateToProps = (state) => {
    return {
        // get Arbitrage Api Response data from reducer
        ApiResponseResult: state.ArbitrageApiResponseReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Perform Arbitrage Api Response Action
    getArbitrageApiResponse: (request) => dispatch(getArbitrageApiResponse(request)),
    // Clear Arbitrage Api Response Data Action
    clearArbitrageApiResponseData: () => dispatch(clearArbitrageApiResponseData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArbitrageApiResponseListScreen)