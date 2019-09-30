// ArbitrageApiRequestListScreen
import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl } from 'react-native'
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
import { getArbitrageApiRequest, clearArbitrageApiRequestData } from '../../../actions/Arbitrage/ArbitrageApiRequestActions';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { isInternet, validateResponseNew, } from '../../../validations/CommonValidation';
import { AppConfig } from '../../../controllers/AppConfig';
import { Fonts } from '../../../controllers/Constants';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import StatusChip from '../../widget/StatusChip';

export class ArbitrageApiRequestListScreen extends Component {
    constructor(props) {
        super(props);

        //Define all initial state
        this.state = {
            row: [],
            // for Arbitrage Api Request List
            ArbiApiRequestListResponse: [],
            ArbiApiRequestListState: null,

            selectedPage: 1,
            searchInput: '',

            refreshing: false,
            isFirstTime: true,
        }

        // Initial request
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

        this.callArbiApiRequest()
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    componentWillUnmount() {
        // clear reducer data
        this.props.clearArbitrageApiRequestData()
    }

    // for swipe to refresh functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Arbitrage Api Request List
            this.request = {
                ...this.request,
                Page: this.state.selectedPage,
            }
            // Call Get Arbitrage Api Request List API
            this.props.getArbitrageApiRequest(this.request);

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
                // Bind request for Arbitrage Api Request List
                this.request = {
                    ...this.request,
                    Page: pageNo,
                }
                //Call Get Arbitrage Api Request List API
                this.props.getArbitrageApiRequest(this.request);
            } else {
                this.setState({ refreshing: false });
            }
        }
    }


    //api call
    callArbiApiRequest = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.setState({ selectedPage: 1, })
            this.request = {
                Page: 1,
                PageSize: AppConfig.pageSize,
            }
            // Call Arbitrage Api Request List Api
            this.props.getArbitrageApiRequest(this.request)

        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (ArbitrageApiRequestListScreen.oldProps !== props) {
            ArbitrageApiRequestListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { ArbiApiRequestList } = props.ApiRequestResult

            // ArbiApiRequestList is not null
            if (ArbiApiRequestList) {
                try {
                    if (state.ArbiApiRequestListState == null || (ArbiApiRequestList !== state.ArbiApiRequestListState)) {
                        //succcess response fill the list 
                        if (validateResponseNew({ response: ArbiApiRequestList, isList: true, })) {

                            return Object.assign({}, state, {
                                ArbiApiRequestListState: ArbiApiRequestList,
                                ArbiApiRequestListResponse: parseArray(ArbiApiRequestList.Response),
                                refreshing: false,
                                row: addPages(ArbiApiRequestList.Count)
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                ArbiApiRequestListState: null,
                                ArbiApiRequestListResponse: [],
                                refreshing: false,
                                row: []
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        ArbiApiRequestListState: null,
                        ArbiApiRequestListResponse: [],
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
        let { ArbiApiRequestLoading, } = this.props.ApiRequestResult

        // For searching functionality
        let finalItems = this.state.ArbiApiRequestListResponse.filter(item => (
            item.APIName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.MethodType.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.AppTypeText.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.APISendURL.toLowerCase().includes(this.state.searchInput.toLowerCase())
        ))

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    title={R.strings.arbitrageAPIRequest}
                    onBackPress={() => this.onBackPress()}
                    nav={this.props.navigation}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => { this.props.navigation.navigate('ArbitrageApiRequestAddEditScreen', { onSuccess: this.callArbiApiRequest }) }}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {
                        (ArbiApiRequestLoading && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <FlatList
                                data={finalItems}
                                showsVerticalScrollIndicator={false}
                                // render all item in list
                                renderItem={({ item, index }) => <ArbitrageApiRequestListItem
                                    index={index}
                                    onDetailPress={() => this.props.navigation.navigate('ArbitrageApiRequestDetailScreen', { item })}
                                    item={item}
                                    size={finalItems.length}
                                    onPress={() => { this.props.navigation.navigate('ArbitrageApiRequestAddEditScreen', { item, onSuccess: this.callArbiApiRequest, edit: true }) }}
                                />
                                }
                                // assign index as key value to Arbitrage Api Request list item
                                keyExtractor={(_item, index) => index.toString()}
                                // For Refresh Functionality In Arbitrage Api Request FlatList Item
                                refreshControl={
                                    <RefreshControl
                                        colors={[R.colors.accent]} progressBackgroundColor={R.colors.background}
                                        onRefresh={this.onRefresh}
                                        refreshing={this.state.refreshing}
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
                            <PaginationWidget selectedPage={this.state.selectedPage} row={this.state.row} onPageChange={(item) => { this.onPageChange(item) }} />
                        }
                    </View>
                </View>
            </SafeView>
        )
    }
}

// This Class is used for display record in list
class ArbitrageApiRequestListItem extends Component {

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
        let { onDetailPress, size, index, item, onPress, } = this.props
        return (
            // flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1, marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0, borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }} onPress={onDetailPress}>

                        <View style={{ flexDirection: 'row', flex: 1, }}>

                            {/* For show APIName and MethodType */}
                            <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{
                                            color: R.colors.textPrimary, fontSize: R.dimens.smallText,
                                            fontFamily: Fonts.MontserratSemiBold,
                                        }}>{item.APIName}</Text>
                                        <Text style={{
                                            color: R.colors.accent, fontSize: R.dimens.smallestText,
                                            fontFamily: Fonts.MontserratSemiBold,
                                        }}>{item.MethodType ? ' - ' + item.MethodType : ''}</Text>
                                    </View>
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

                                {/* for App Type */}
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.appType + ': '}</TextViewHML>
                                    <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.AppTypeText ? item.AppTypeText : ''}</TextViewHML>
                                </View>

                                {/* for API Send URL */}
                                <View style={{ flex: 1, flexDirection: 'row', }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.apiSendUrl + ': '}</TextViewHML>
                                    <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.APISendURL ? item.APISendURL : ''}</TextViewHML>
                                </View>

                            </View>
                        </View>

                        {/* for status and Edit icon */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: R.dimens.widgetMargin }}>
                            <StatusChip
                                value={item.Status === 1 ? R.strings.Success : R.strings.Failed}
                                color={(item.Status === 1) ? R.colors.successGreen : R.colors.failRed} />
                            <ImageTextButton
                                style={
                                    {
                                        alignItems: 'center', justifyContent: 'center',
                                        backgroundColor: R.colors.accent,
                                        borderRadius: R.dimens.titleIconHeightWidth, margin: 0,
                                        padding: R.dimens.CardViewElivation,
                                    }}
                                iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                icon={R.images.IC_EDIT}
                                onPress={onPress} />
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get Arbitrage Api Request data from reducer
        ApiRequestResult: state.ArbitrageApiRequestReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Perform Arbitrage Api Request Action
    getArbitrageApiRequest: (request) => dispatch(getArbitrageApiRequest(request)),
    // Clear Arbitrage Api Request Data Action
    clearArbitrageApiRequestData: () => dispatch(clearArbitrageApiRequestData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArbitrageApiRequestListScreen)