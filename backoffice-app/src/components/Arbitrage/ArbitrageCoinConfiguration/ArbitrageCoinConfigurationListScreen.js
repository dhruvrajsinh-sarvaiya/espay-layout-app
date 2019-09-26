// ArbitrageCoinConfigurationListScreen.js
import React, { Component } from 'react'
import { View, FlatList, RefreshControl } from 'react-native'
import { changeTheme, parseArray, addPages, convertDate, convertTime, parseFloatVal, } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import PaginationWidget from '../../widget/PaginationWidget';
import { getArbiCoinConfigurationList, clearArbiCoinConfigurationData } from '../../../actions/Arbitrage/ArbitrageCoinConfigurationActions';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { isInternet, validateResponseNew, } from '../../../validations/CommonValidation';
import { AppConfig } from '../../../controllers/AppConfig';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import StatusChip from '../../widget/StatusChip';
import ImageViewWidget from '../../widget/ImageViewWidget';

export class ArbitrageCoinConfigurationListScreen extends Component {
    constructor(props) {
        super(props);

        //Define all initial state
        this.state = {
            row: [],
            // for Arbitrage Coin Configuration List
            ArbiCoinConfigListResponse: [],
            ArbiCoinConfigListState: null,

            selectedPage: 1,
            searchInput: '',

            refreshing: false,
            isFirstTime: true,
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme()

        // Call Arbitrage Coin Configuration List Api
        this.callArbiCoinConfigList()
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    componentWillUnmount() {
        // clear reducer data
        this.props.clearArbiCoinConfigurationData()
    }

    // for swipe to refresh functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Arbitrage Coin Configuration List
            let request = {
                Page: this.state.selectedPage,
                PageSize: AppConfig.pageSize,
            }
            // Call Get Arbitrage Coin Configuration List API
            this.props.getArbiCoinConfigurationList(request);

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
                // Bind request for Arbitrage Coin Configuration List
                let request = {
                    Page: pageNo,
                    PageSize: AppConfig.pageSize,
                }
                //Call Get Arbitrage Coin Configuration List API
                this.props.getArbiCoinConfigurationList(request);
            } else {
                this.setState({ refreshing: false });
            }
        }
    }


    //api call
    callArbiCoinConfigList = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.setState({ selectedPage: 1, })
            let request = {
                Page: 1,
                PageSize: AppConfig.pageSize,
            }
            // Call Arbitrage Coin Configuration List Api
            this.props.getArbiCoinConfigurationList(request)

        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (ArbitrageCoinConfigurationListScreen.oldProps !== props) {
            ArbitrageCoinConfigurationListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { ArbiCoinConfigList } = props.coinConfigurationResult

            // ArbiCoinConfigList is not null
            if (ArbiCoinConfigList) {
                try {
                    if (state.ArbiCoinConfigListState == null || (state.ArbiCoinConfigListState !== null && ArbiCoinConfigList !== state.ArbiCoinConfigListState)) {
                        //succcess response fill the list 
                        if (validateResponseNew({ response: ArbiCoinConfigList, isList: true, })) {
                            return Object.assign({}, state, {
                                ArbiCoinConfigListState: ArbiCoinConfigList,
                                ArbiCoinConfigListResponse: parseArray(ArbiCoinConfigList.Response),
                                refreshing: false,
                                row: addPages(ArbiCoinConfigList.Count)
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                ArbiCoinConfigListState: null,
                                ArbiCoinConfigListResponse: [],
                                refreshing: false,
                                row: []
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        ArbiCoinConfigListState: null,
                        ArbiCoinConfigListResponse: [],
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
        let { ArbiCoinConfigLoading, } = this.props.coinConfigurationResult

        // For searching functionality
        let finalItems = this.state.ArbiCoinConfigListResponse.filter(item => (
            item.Name.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.SMSCode.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            parseFloatVal(item.CirculatingSupply).toString().includes(this.state.searchInput) ||
            parseFloatVal(item.MaxSupply).toString().includes(this.state.searchInput) ||
            parseFloatVal(item.TotalSupply).toString().includes(this.state.searchInput)
        ))

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    title={R.strings.arbitrageCoinConfiguration}
                    nav={this.props.navigation}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => { this.props.navigation.navigate('ArbitrageCoinConfigurationAddEditScreen', { onSuccess: this.callArbiCoinConfigList }) }}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {
                        (ArbiCoinConfigLoading && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <FlatList
                                data={finalItems}
                                showsVerticalScrollIndicator={false}
                                // render all item in list
                                renderItem={({ item, index }) => <ArbitrageCoinConfigurationListItem
                                    index={index}
                                    item={item}
                                    size={finalItems.length}
                                    onEdit={() => this.props.navigation.navigate('ArbitrageCoinConfigurationAddEditScreen', { item, isEdit: true, onSuccess: this.callArbiCoinConfigList })}
                                    onDetail={() => this.props.navigation.navigate('ArbitrageCoinConfigurationDetailScreen', { item })}
                                />
                                }
                                // assign index as key value to Arbitrage Coin Configuration list item
                                keyExtractor={(_item, index) => index.toString()}
                                // For Refresh Functionality In Arbitrage Coin Configuration FlatList Item
                                refreshControl={
                                    <RefreshControl
                                    progressBackgroundColor={R.colors.background}
                                    refreshing={this.state.refreshing} onRefresh={this.onRefresh}
                                    colors={[R.colors.accent]}
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
                            <PaginationWidget selectedPage={this.state.selectedPage} row={this.state.row}  onPageChange={(item) => { this.onPageChange(item) }} />
                        }
                    </View>
                </View>
            </SafeView>
        )
    }
}

// This Class is used for display record in list
class ArbitrageCoinConfigurationListItem extends Component {

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
        // Get required fields from props
        let { item: { SMSCode, Name, IssueDate, CirculatingSupply, StatusText, MaxSupply, TotalSupply }, index, size, onEdit, onDetail } = this.props;

        return (
            // flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin,
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>

                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        borderTopRightRadius: R.dimens.margin,
                        flex: 1,  borderRadius: 0, borderBottomLeftRadius: R.dimens.margin,
                    }} onPress={onDetail}>

                        {/* For show currnency logo, Currency name and Name */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                <ImageViewWidget url={SMSCode ? SMSCode : ''} width={R.dimens.IconWidthHeight}
                                    height={R.dimens.IconWidthHeight} />
                                <TextViewHML style={{
                                    color: R.colors.textPrimary, fontSize: R.dimens.smallText,
                                    paddingLeft: R.dimens.widgetMargin
                                }}>{SMSCode ? SMSCode : '-'}</TextViewHML>
                                <TextViewHML style={{
                                    color: R.colors.textSecondary,
                                    fontSize: R.dimens.smallText
                                }}>{Name ? ' - ' + Name : '-'}</TextViewHML>
                            </View>
                            <View style={{ flexDirection: 'row', }}>
                                <ImageTextButton
                                    style={{ margin: 0, padding: 0, paddingRight: R.dimens.LineHeight, }}
                                    icon={R.images.RIGHT_ARROW_DOUBLE}
                                    onPress={onDetail}
                                    iconStyle={{ padding: 0, margin: 0, marginRight: R.dimens.widgetMargin, width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textPrimary }}
                                />
                            </View>
                        </View>

                        {/* for show status and issue date */}
                        <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{
                                    fontSize: R.dimens.smallestText,
                                    color: R.colors.textSecondary, textAlign: 'center'
                                }}>{R.strings.circulating_supply}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{CirculatingSupply}</TextViewHML>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, textAlign: 'center' }}>{R.strings.max_supply}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{MaxSupply}</TextViewHML>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, textAlign: 'center' }}>{R.strings.total_supply}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{TotalSupply}</TextViewHML>
                            </View>
                        </View>

                        {/* for show status and issue date */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: R.dimens.widgetMargin }}>
                            <StatusChip
                                color={StatusText === 'Active' ? R.colors.successGreen : R.colors.failRed}
                                value={StatusText} />

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <ImageTextButton
                                    style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                    icon={R.images.IC_TIMER}
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                />
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{IssueDate ? convertDate(IssueDate) + ' ' + convertTime(IssueDate) : '-'}</TextViewHML>
                                <ImageTextButton
                                    style={
                                        {
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: R.colors.accent,
                                            borderRadius: R.dimens.titleIconHeightWidth,
                                            margin: 0,
                                            padding: R.dimens.CardViewElivation,
                                            marginLeft: R.dimens.widgetMargin,
                                        }}
                                    icon={R.images.IC_EDIT}
                                    iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                    onPress={onEdit} />
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get Arbitrage Coin Configuration data from reducer
        coinConfigurationResult: state.ArbitrageCoinConfigurationReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Perform Arbitrage Coin Configuration Action
    getArbiCoinConfigurationList: (request) => dispatch(getArbiCoinConfigurationList(request)),
    // Clear Arbitrage Coin Configuration Data Action
    clearArbiCoinConfigurationData: () => dispatch(clearArbiCoinConfigurationData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArbitrageCoinConfigurationListScreen)