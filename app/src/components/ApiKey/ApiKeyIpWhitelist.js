import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl, Image, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, getIPAddress, showAlert, convertDateTime } from '../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../components/Navigation';
import { isInternet, validateResponseNew, validateValue } from '../../validations/CommonValidation';
import ListLoader from '../../native_theme/components/ListLoader';
import Separator from '../../native_theme/components/Separator';
import { contentContainerStyle, ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import R from '../../native_theme/R';
import ImageButton from '../../native_theme/components/ImageTextButton';
import { getIpWhiteListdata, clearApikeyData, removeIPAddress } from '../../actions/ApiKey/ApiKeyAction';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import CardView from '../../native_theme/components/CardView';
import StatusChip from '../Widget/StatusChip';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import TextViewMR from '../../native_theme/components/TextViewMR';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class ApiKeyIpWhitelist extends Component {
    constructor(props) {
        super(props);

        //Get Date From Prev Screen
        let PlanID = props.navigation.state.params && props.navigation.state.params.PlanID
        let KeyId = props.navigation.state.params && props.navigation.state.params.KeyId
        let isStatic = props.navigation.state.params && props.navigation.state.params.isStatic
        let whiteListResponse = props.navigation.state.params && props.navigation.state.params.whiteListResponse
        let isFromView = props.navigation.state.params && props.navigation.state.params.isFromView


        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        //bind all methods
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });

        //Define All initial State
        this.state = {
            PlanID: PlanID,
            KeyId,
            refreshing: false,
            searchInput: '',
            response: whiteListResponse ? whiteListResponse : [],
            ipWhitelistData: null,
            IPLimitCount: ' - ',
            IPCount: ' - ',
            IpAddress: ' - ',
            isStatic,
            isFromView: isFromView == undefined ? false : isFromView,
            isFirstTime: true,
            ScreenName: props.ScreenName,
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme()

        //Check intenet connectivity
        if (await isInternet()) {

            //check for currently module is static or not
            if (!this.state.isStatic) {
                this.props.getIpWhiteListdata({ planKey: this.state.PlanID })
            }
            //----
        }
    }

    static oldProps = {};
    static oldState = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        // To Skip Render if old and new props are equal
        if (ApiKeyIpWhitelist.oldProps !== props) {
            ApiKeyIpWhitelist.oldProps = props;
        } else {
            return null;
        }

        // check for current screen or not
        if (isCurrentScreen(props)) {
            const { ipWhitelistData } = props.Listdata;
            if (ipWhitelistData) {
                try {
                    if (state.ipWhitelistData == null || (state.ipWhitelistData != null && ipWhitelistData !== state.ipWhitelistData)) {
                        if (validateResponseNew({ response: ipWhitelistData, isList: true, })) {

                            //clear reducer data
                            props.clearApikeyData();
                            //----

                            //Set State For Api response 
                            let res = ipWhitelistData
                            return {
                                ...state,
                                ipWhitelistData,
                                response: parseArray(res.Response),
                                refreshing: false,
                                IPLimitCount: res.IPLimitCount,
                                IPCount: res.IPCount
                            }
                        } else {
                            props.clearApikeyData();

                            //Set State For Api response 
                            return {
                                ...state,
                                response: [],
                                refreshing: false,
                            }
                        }
                    }
                } catch (e) {
                    //Set State For Api response 
                    return {
                        ...state,
                        response: [],
                        refreshing: false,
                    }
                }
            }
        }
        return null
    }

    componentDidUpdate = async (prevProps, prevState) => {

        if (this.state.IpAddress === ' - ') {
            let Ip = await getIPAddress();
            this.setState({ IpAddress: Ip })
        }

        const { removeIPAddressData } = this.props.Listdata;
        if (removeIPAddressData !== prevProps.removeIPAddressData) {
            if (removeIPAddressData) {
                try {
                    if (validateResponseNew({ response: removeIPAddressData })) {
                        showAlert(R.strings.Info + '!', removeIPAddressData.ReturnMsg, 0, () => {

                            //clear data
                            this.props.clearApikeyData();
                            //----

                            //call api to get ip whitelist lettest response
                            this.props.getIpWhiteListdata({ planKey: this.state.PlanID })
                            //------
                        })
                    } else {
                        //clear data
                        this.props.clearApikeyData();
                        //----
                    }
                } catch (e) {
                    //clear data
                    this.props.clearApikeyData();
                    //----
                }
            }
        }
    }

    //For Swipe to referesh Functionality
    onRefresh = async (needUpdate, fromRefreshControl = false) => {

        //check module is not static currently
        if (!this.state.isStatic) {
            if (fromRefreshControl)
                this.setState({ refreshing: true });

            //Check NetWork is Available or not
            if (needUpdate && await isInternet()) {
                this.props.getIpWhiteListdata({ planKey: this.state.PlanID })
            } else {
                this.setState({ refreshing: false });
            }
        }
    }

    //For Getting Data of Adding new IP For white listing
    getResponseFromAdd = (AddResponse) => {
        //check for response available or not
        if (AddResponse) {
            let resArray = this.state.response;
            resArray.push(AddResponse);
            this.setState({ response: resArray });
        }
    }

    onBackPress() {
        if (!this.state.isFromView) {
            //refresh previous screen list
            if (this.props.navigation.state.params && this.props.navigation.state.params.getStaticWhiteListData !== undefined) {
                this.props.navigation.state.params.getStaticWhiteListData(this.state.response);
            }

        }

        //goging back to the update screen
        this.props.navigation.goBack();
        //----
    }

    // Render Right Side Menu For Add New functionality 
    rightMenuRender = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                {this.state.isStatic &&
                    <ImageButton
                        icon={R.images.IC_PLUS}
                        style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                        iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                        onPress={() => {
                            this.props.navigation.navigate('ApiKeyWhiteListAddScreen', { onRefresh: this.onRefresh, PlanID: this.state.PlanID, KeyId: this.state.KeyId, getResponseFromAdd: this.getResponseFromAdd, isStatic: this.state.isStatic, whitelistArray: this.state.response })
                        }} />
                }
            </View>
        )
    }

    render() {
        const { ipWhitelistLoading, removeIPLoading } = this.props.Listdata;
        let finalItems = this.state.response;

        //for final items from search input (validate on AliasName)
        //default searchInput is empty so it will display all records.
        if (finalItems.length > 0) {
            finalItems = finalItems.filter(item =>
                item.AliasName.toLowerCase().includes(this.state.searchInput.toLowerCase())
            )
        }

        if (this.state.ScreenName === 'ApiKeyUpdateScreen') {
            finalItems = this.props.whiteListResponse
            return (
                <View style={{ flex: 1 }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={finalItems}
                        ItemSeparatorComponent={() => <Separator style={{ marginLeft: 0, marginRight: 0, marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin }} />}
                        renderItem={({ item, index }) => {
                            if (index < 5) {
                                return <FlatListItemFromDashBoard
                                    isContainInMainScreen={true}
                                    item={item}
                                    index={index}
                                    ctx={this}
                                    isStatic={this.state.isStatic}
                                    size={finalItems.length}
                                />
                            } else return null

                        }}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={contentContainerStyle(finalItems)}
                        ListEmptyComponent={<ListEmptyComponent style={{ marginTop: R.dimens.margin }} />}
                    />
                </View>
            )
        }
        else {

            return (
                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.whitelistedIPAddress}
                        isBack={true}
                        nav={this.props.navigation}
                        onBackPress={this.onBackPress}
                        searchable={true}
                        rightMenuRenderChilds={this.rightMenuRender()}
                        onSearchText={(input) => this.setState({ searchInput: input })}
                    />

                    {/* To Set ProgressDialog as per out theme */}
                    <ProgressDialog isShow={removeIPLoading} />
                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {
                            (ipWhitelistLoading && !this.state.refreshing) ?
                                <ListLoader />
                                :
                                <View style={{ flex: 1 }}>
                                    {finalItems.length ?
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin, paddingLeft: R.dimens.WidgetPadding, paddingRight: R.dimens.WidgetPadding, }}>
                                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                                                    <TextViewHML style={{ textAlign: 'right', fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{R.strings.currentIp}</TextViewHML>
                                                    <Text style={{ textAlign: 'right', fontSize: R.dimens.smallText, color: R.colors.listSeprator, fontFamily: Fonts.MontserratSemiBold }}>{this.state.IpAddress}</Text>
                                                </View>
                                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                                    <TextViewHML style={{ textAlign: 'right', fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{(R.strings.Limit).toUpperCase()}</TextViewHML>

                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ textAlign: 'right', fontSize: R.dimens.smallText, color: R.colors.accent, fontFamily: Fonts.MontserratSemiBold }}>{this.state.IPCount}</Text>
                                                        <Text style={{ textAlign: 'right', fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold }}>{"/" + this.state.IPLimitCount}</Text>
                                                    </View>
                                                </View>
                                            </View>

                                            <FlatList
                                                showsVerticalScrollIndicator={false}
                                                data={finalItems}
                                                renderItem={({ item, index }) => {
                                                    return <FlatListItem
                                                        item={item}
                                                        ctx={this}
                                                        isGrid={false}
                                                        index={index}
                                                        isStatic={this.state.isStatic}
                                                        _onDelete={() => this._onDelete(item, index)}
                                                        size={this.state.response.length}
                                                    />
                                                }}
                                                /* assign index as key value to list item */
                                                keyExtractor={(item, index) => index.toString()}
                                                contentContainerStyle={contentContainerStyle(finalItems)}
                                                /* For Refresh Functionality In  FlatList Item */
                                                refreshControl={
                                                    <RefreshControl
                                                        colors={[R.colors.accent]}
                                                        progressBackgroundColor={R.colors.background}
                                                        refreshing={this.state.refreshing}
                                                        onRefresh={() => this.onRefresh(true, true)}
                                                    />
                                                }
                                            />
                                        </View>
                                        :
                                        <ListEmptyComponent module={R.strings.addIpToWhiteListTitle} onPress={() => this.props.navigation.navigate('ApiKeyWhiteListAddScreen', { onRefresh: this.onRefresh, PlanID: this.state.PlanID, KeyId: this.state.KeyId, getResponseFromAdd: this.getResponseFromAdd, isStatic: this.state.isStatic, whitelistArray: this.state.response })} />
                                    }
                                </View>
                        }
                    </View>
                </SafeView >
            );
        }
    }

    _onDelete = (item, index) => {
        // for show selected Record in Dialog
        let selectedRecord = R.strings.aliasName + " : " + validateValue(item.AliasName) + "\n" + R.strings.ipTitle + " : " + validateValue(item.IPAddress) + "\n\n";
        showAlert(
            R.strings.Delete + '!',
            selectedRecord + R.strings.delete_message,
            6,
            async () => {
                if (!this.state.isStatic) {

                    //check for internet connection
                    if (await isInternet()) {

                        // call api for remove whitelist data
                        this.props.removeIPAddress({ IPId: item.ID });
                        //----
                    }
                    //-----
                } else {
                    let response = this.state.response
                    response.splice(index, 1);
                    this.setState({ response })
                }
            },
            R.strings.no_text,
            () => { }, R.strings.yes_text
        )
    }
}

// This Class is used for display record in list
class FlatListItem extends Component {
    constructor(props) {
        super(props);
    }

    //Check If Old Props and New Props are Equal then Return False
    shouldComponentUpdate(nextProps) {
        if (this.props.item !== nextProps.item ||
            this.props.isGrid !== nextProps.isGrid ||
            this.props.isStatic !== nextProps.isStatic ||
            this.props._onDelete !== nextProps._onDelete
        ) {
            return true
        }
        return false
    }

    render() {
        let { index, size, item, _onDelete } = this.props;
        let stColor = R.colors.accent;
        let stText = ' - ';

        if (item.IPType === 1) {
            stColor = R.colors.accent
            stText = R.strings.WhiteListed
        }
        else {
            stColor = R.colors.yellow
            stText = R.strings.concurrent
        }

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
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TextViewMR style={{ width: '90%', fontSize: R.dimens.smallText, color: R.colors.listSeprator }}>{item.AliasName}</TextViewMR>

                                {this.props.isStatic &&
                                    <TouchableWithoutFeedback onPress={_onDelete}>
                                        <Image
                                            source={R.images.IC_DELETE}
                                            style={{
                                                width: '10%',
                                                paddingLeft: 0,
                                                paddingRight: 0,
                                                tintColor: R.colors.textPrimary,
                                                height: R.dimens.dashboardMenuIcon,
                                            }} />
                                    </TouchableWithoutFeedback>
                                }
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>{R.strings.ipTitle + " : "}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{item.IPAddress}</TextViewHML>
                            </View>

                            <View style={{ marginTop: R.dimens.WidgetPadding, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <StatusChip
                                        color={stColor}
                                        value={stText}></StatusChip>
                                </View>
                                <ImageTextButton
                                    style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                    icon={R.images.IC_TIMER}
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                />
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{item.CreatedDate ? convertDateTime(item.CreatedDate) : '-'}</TextViewHML>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

// This Class is used for display record in list
class FlatListItemFromDashBoard extends Component {
    constructor(props) {
        super(props);
    }

    //Check If Old Props and New Props are Equal then Return False
    shouldComponentUpdate(nextProps) {
        if (this.props.isStatic !== nextProps.isStatic ||
            this.props.item !== nextProps.item) {
            return true
        }
        return false
    }

    render() {
        let { item } = this.props;
        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
            }}>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.listSeprator }}>{item.AliasName}</TextViewMR>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>{R.strings.ipTitle + " : "}</TextViewHML>
                        <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{item.IPAddress}</TextViewHML>
                    </View>
                </View>
            </View>
        )
    }
}

function mapStatToProps(state) {
    return {
        //For Update isPortrait true or false
        preference: state.preference.dimensions.isPortrait,
        //Updated Data For Api Key Action
        Listdata: state.ApiKeyReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform get Ip Whitelist plan Action
        getIpWhiteListdata: (request) => dispatch(getIpWhiteListdata(request)),
        //Perform Remove Ip Whitelist plan Action
        removeIPAddress: (request) => dispatch(removeIPAddress(request)),
        //Perform Clear Api Key Ip Whitelist plan Action
        clearApikeyData: () => dispatch(clearApikeyData())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(ApiKeyIpWhitelist);