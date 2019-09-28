import React, { Component } from 'react'
import { View, FlatList, RefreshControl } from 'react-native'
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import LinearGradient from 'react-native-linear-gradient';
import { changeTheme, parseArray, getIPAddress, convertDateTime, showAlert, getDeviceID, addPages } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import { validateResponseNew, isInternet } from '../../../validations/CommonValidation';
import { AppConfig } from '../../../controllers/AppConfig';
import { listIPWhitelist, DeleteIPToWhitelist, clearIpToWhitelist } from '../../../actions/account/IPWhitelistHistoryActions';
import ListLoader from '../../../native_theme/components/ListLoader';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { connect } from 'react-redux';
import { ServiceUtilConstant } from '../../../controllers/Constants';
import PaginationWidget from '../../widget/PaginationWidget';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';

export class IPWhitelistScreen extends Component {
    constructor(props) {
        super(props);

        // Define all initial state
        this.state = {
            row: [],
            IPWhitelistResponse: [],
            IPWhitelistDataState: null,
            MobileIp: '',
            IpAddress: '',

            searchInput: '',
            refreshing: false,
            isFirstTime: true,
            selectedPage: 1,
        }

        // Initial request
        this.request = {
            PageIndex: 0,
            Page_Size: AppConfig.pageSize,
        }
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme()

        // Getting IP Address
        let Ip = await getIPAddress();
        this.setState({ IpAddress: Ip, MobileIp: Ip })

        //Check NetWork is Available or not
        if (await isInternet()) {
            //To fetch IP whitelist
            this.props.getIPWhitelist(this.request);
        }
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    // for swipe to refresh functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Call Get Withdraw Report API
            this.props.getIPWhitelist(this.request);

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
                // Bind request for Api Plan Subscription History List
                this.request = {
                    ...this.request,
                    PageNo: pageNo - 1,
                }
                //Call Get Api Plan Subscription History List API
                this.props.getIPWhitelist(this.request);
            } else {
                this.setState({ refreshing: false });
            }
        }
    }

    // Show alert dialog when user press on delete button
    onDeletePress = async (item) => {
        showAlert(R.strings.alert, R.strings.delete_message, 3, async () => {
            // check internet connection
            if (await isInternet()) {

                //Bind Request For Delete Ip From Whitelist
                let req = {
                    SelectedIPAddress: item.IpAddress,
                    IpAliasName: item.IpAliasName,
                    deviceId: await getDeviceID(),
                    mode: ServiceUtilConstant.Mode,
                    hostName: ServiceUtilConstant.hostName
                    //Note : ipAddress parameter is passed in its saga.
                }

                //call api for Delete Ip Address From Whitelist
                this.props.deleteIpAddress(req)
            }
        }, R.strings.cancel, async () => { })
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (IPWhitelistScreen.oldProps !== props) {
            IPWhitelistScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            // Get all upadated field of particular actions
            const { IPWhitelistData, } = props.IPWhitelistResult

            // IPWhitelistData is not null
            if (IPWhitelistData) {
                try {
                    if (state.IPWhitelistDataState == null || (IPWhitelistData !== state.IPWhitelistDataState)) {
                        //succcess response fill the list 
                        if (validateResponseNew({ response: IPWhitelistData, isList: true, })) {

                            let res = parseArray(IPWhitelistData.IpList)

                            // Add statusText in response
                            for (var IpListKey in res) {
                                let item = res[IpListKey];
                                item.StatusText = item.Status == 1 ? R.strings.active : R.strings.inActive;
                            }

                            return Object.assign({}, state, {
                                IPWhitelistDataState: IPWhitelistData,
                                IPWhitelistResponse: res,
                                refreshing: false,
                                row: addPages(IPWhitelistData.TotalRow)
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                IPWhitelistDataState: null,
                                IPWhitelistResponse: [],
                                refreshing: false,
                                row: [],
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        IPWhitelistDataState: null,
                        IPWhitelistResponse: [],
                        refreshing: false,
                        row: []
                    })
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }
        }
        return null
    }

    componentDidUpdate(prevProps, _prevState) {
        const { DeleteIpWhitelistData, } = this.props.IPWhitelistResult;

        // compare response with previous response
        if (DeleteIpWhitelistData !== prevProps.IPWhitelistResult.DeleteIpWhitelistData) {

            // DeleteIpWhitelistData is not null
            if (DeleteIpWhitelistData) {
                try {
                    // if local DeleteIpWhitelistData state is null or its not null and also different then new response then and only then validate response.
                    if (this.state.DeleteIpWhitelistData == null || (this.state.DeleteIpWhitelistData != null && DeleteIpWhitelistData !== this.state.DeleteIpWhitelistData)) {
                        //handle response of API
                        if (validateResponseNew({ response: DeleteIpWhitelistData })) {
                            //Display Success Message and Refresh Wallet User List
                            showAlert(R.strings.Success + '!', DeleteIpWhitelistData.ReturnMsg, 0, async () => {
                                this.setState({ DeleteIpWhitelistData })

                                //Clear Leverage Config Data 
                                this.props.clearIpToWhitelist();

                                // Call Leverage Configuration List Api 
                                this.props.getIPWhitelist({ PageIndex: 1, Page_Size: AppConfig.pageSize })

                            });
                        }
                    }
                } catch (error) {
                    this.setState({ DeleteIpWhitelistData: null })
                    //Clear Leverage Config Data 
                    this.props.clearIpToWhitelist();
                }
            }
        }
    }

    render() {
        // Loading status for Progress bar which is fetching from reducer
        let { IPWhitelistLoading, DeleteIpWhitelistLoading } = this.props.IPWhitelistResult

        // for searching functionality
        let finalItems = this.state.IPWhitelistResponse.filter(item =>
            item.IpAddress.toString().includes(this.state.searchInput) ||
            item.StatusText.toLowerCase().includes(this.state.searchInput.toLowerCase())
        )

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    title={R.strings.ipWhitelisting}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })} />

                {/* Progressbar */}
                <ProgressDialog isShow={DeleteIpWhitelistLoading} />

                <LinearGradient style={{
                    elevation: R.dimens.CardViewElivation,
                    flexDirection: 'row', backgroundColor: R.colors.primary, paddingTop: R.dimens.widget_top_bottom_margin, paddingBottom: R.dimens.widget_top_bottom_margin
                }}
                    locations={[0, 10]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    colors={[R.colors.cardBalanceBlue, R.colors.accent]}>

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TextViewMR style={{ color: R.colors.white, fontSize: R.dimens.mediumText, }}>{this.state.MobileIp}</TextViewMR>
                        <TextViewHML style={{ color: R.colors.white, fontSize: R.dimens.smallestText, }}>{R.strings.ipAddress}</TextViewHML>
                    </View>
                </LinearGradient>

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {
                        (IPWhitelistLoading && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <FlatList
                                data={finalItems}
                                showsVerticalScrollIndicator={false}
                                // render all item in list
                                renderItem={({ item, index }) =>
                                    <IPWhitelistItem
                                        index={index}
                                        item={item}
                                        size={finalItems.length}
                                        onDelete={() => this.onDeletePress(item)}
                                    />}
                                // assign index as key value to Withdraw Report list item
                                keyExtractor={(_item, index) => index.toString()}
                                // Refresh functionality in api plan configuration
                                refreshControl={
                                    <RefreshControl
                                        colors={[R.colors.accent]}
                                        progressBackgroundColor={R.colors.background}
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
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
class IPWhitelistItem extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        // If new props and old props are equal then it will return false otherwise it will return true
        if (this.props.item === nextProps.item)
            return false
        return true
    }

    render() {
        let { size, index, item, onDelete } = this.props

        return (
            // flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1, marginRight: R.dimens.widget_left_right_margin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView style={{
                        borderRadius: 0, elevation: R.dimens.listCardElevation,
                        borderBottomLeftRadius: R.dimens.margin,
                        flex: 1, borderTopRightRadius: R.dimens.margin,
                    }}>

                        {/* IP Address and Delete Icon */}
                        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', }}>
                            <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{item.IpAddress}</TextViewMR>

                            <ImageTextButton
                                style={
                                    {
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: R.colors.failRed,
                                        borderRadius: R.dimens.titleIconHeightWidth,
                                        margin: 0,
                                        padding: R.dimens.CardViewElivation,
                                    }}
                                icon={R.images.IC_DELETE}
                                iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                onPress={onDelete} />

                        </View>

                        {/* for show status and datetime  */}
                        <View style={{ flex: 1, flexDirection: 'row', marginTop: R.dimens.widgetMargin, alignItems: 'center', justifyContent: 'space-between' }}>
                            <StatusChip
                                color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed}
                                value={item.Status == 1 ? R.strings.active : R.strings.inActive}
                            />

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <ImageTextButton
                                    style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                    icon={R.images.IC_TIMER}
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                />
                                <TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get api plan configuration data from reducer
        IPWhitelistResult: state.IPWhitelistHistoryReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Perform Api Plan Config List Action
    getIPWhitelist: (payload) => dispatch(listIPWhitelist(payload)),
    //Perform Delete Ip To Whitelist Api
    deleteIpAddress: (payload) => dispatch(DeleteIPToWhitelist(payload)),
    // Perform Clear IP To Whitelist
    clearIpToWhitelist: (payload) => dispatch(clearIpToWhitelist()),
})

export default connect(mapStateToProps, mapDispatchToProps)(IPWhitelistScreen)