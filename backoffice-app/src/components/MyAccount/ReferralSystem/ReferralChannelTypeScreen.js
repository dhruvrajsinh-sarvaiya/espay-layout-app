import React, { Component } from 'react';
import {
    View,
    FlatList,
    RefreshControl,
} from 'react-native';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { connect } from 'react-redux';
import { getReferralChannelTypeData, inactiveChannelType, activeChannelType, clearActiveInactive, clearData } from '../../../actions/account/ReferralChannelTypeAction';
import { changeTheme, parseArray, convertDate, convertTime, } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import R from '../../../native_theme/R';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class ReferralChannelTypeScreen extends Component {

    constructor(props) {
        super(props);
        //Define All State initial state
        this.state = {
            refreshing: false,
            searchInput: '',
            Selected: '',

            response: [],
            isFirstTime: true,
        };
        //----------
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            //Call referral channel type api
            this.props.getReferralChannelTypeData();
            //----------
        }
        //--------------
    }

    componentWillUnmount() {
        this.props.clearData();
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
        if (ReferralChannelTypeScreen.oldProps !== props) {
            ReferralChannelTypeScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { referralChannelTypeData,
                referralChannelLoading,
                activeReferralChannelTypeData,
                activeLoading,
                inActiceReferralChannelTypeData,
                inActiveLoading } = props.appData;

            //check fetch referral channle list API response.
            if (!referralChannelLoading) {
                try {
                    if (state.referralChannelTypeData == null || (state.referralChannelTypeData != null && referralChannelTypeData !== state.referralChannelTypeData)) {
                        //handle response of API
                        if (validateResponseNew({ response: referralChannelTypeData, isList: true })) {
                            //check Response is an Array Or not
                            //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                            var res = parseArray(referralChannelTypeData.ReferralChannelTypeList)
                            return {
                                ...state,
                                response: res, refreshing: false, referralChannelTypeData
                            }
                        }
                        else {
                            return {
                                ...state,
                                response: [], refreshing: false, referralChannelTypeData
                            }
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        response: [], refreshing: false,
                    }
                }
            }

            //check fetch referral channel active API response.
            if (!activeLoading) {
                try {
                    if (activeReferralChannelTypeData !== null) {
                        //handle response of API
                        if (validateResponseNew({ response: activeReferralChannelTypeData })) {

                            let resData = state.response;
                            let findIndexOfChangeID = state.Selected == null ? -1 : resData.findIndex(el => el.Id === state.Selected);

                            //if index is >-1 then record is found
                            if (findIndexOfChangeID > -1) {
                                resData[findIndexOfChangeID].Status = resData[findIndexOfChangeID].Status == 1 ? 0 : 1;
                            }
                            //to clear active inactive data
                            props.clearActiveInactive()
                            return {
                                ...state, response: resData
                            }
                        } else {
                            //to clear active inactive data
                            props.clearActiveInactive()
                        }
                    }
                } catch (e) {
                    //to clear active inactive data
                    props.clearActiveInactive()
                }
            }

            //check fetch referral channel Inactive API response.
            if (!inActiveLoading) {
                try {
                    if (inActiceReferralChannelTypeData !== null) {
                        //handle response of API
                        if (validateResponseNew({ response: inActiceReferralChannelTypeData })) {

                            let activeResData = state.response;
                            let findIndexOfChangeID = state.Selected == null ? -1 : activeResData.findIndex(el => el.Id === state.Selected);

                            //if index is >-1 then record is found
                            if (findIndexOfChangeID > -1) {
                                activeResData[findIndexOfChangeID].Status = activeResData[findIndexOfChangeID].Status == 1 ? 0 : 1;
                            }
                            //to clear active inactive data
                            props.clearActiveInactive()
                            return {
                                ...state, response: activeResData
                            }

                        } else {
                            //to clear active inactive data
                            props.clearActiveInactive()
                        }
                    }
                } catch (e) {
                    //to clear active inactive data
                    props.clearActiveInactive()
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

            //Call Get API
            this.props.getReferralChannelTypeData();
            //----------
        }
        else {
            this.setState({ refreshing: false });
        }
        //--------------
    }
    //-----------

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call 
        return isCurrentScreen(nextProps);
    };

    onEditReferralChannel = (index, item) => {

        //redirect screen for edit 
        if (item) {
            this.props.navigation.navigate('ReferralChannelTypeAddScreen', { ITEM: item, onRefresh: this.onRefresh })
        }
    }

    updateFeature = async (isEnable, Id) => {
        if (await isInternet()) {
            this.setState({ Selected: Id })
            //To update feature state value
            let request = {
                Id: Id,
            }
            //isEnable = 0 then it is inactive and call api of active
            //isEnable = 1 then it is active and call api of inactive
            if (isEnable.toString() === '0') {

                //call activeChannelType api
                this.props.activeChannelType(request);
            } else {

                //call inactiveChannelType api
                this.props.inactiveChannelType(request);
            }
        }
    }

    render() {
        let { loading, referralChannelLoading, activeLoading, inActiveLoading } = this.props.appData

        let finalItems = this.state.response

        //for search
        if (finalItems.length > 0) {
            finalItems = finalItems.filter(item =>
                item.ChannelTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.CreatedDate.toLowerCase().includes(this.state.searchInput.toLowerCase())
            )
        }
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    searchable={true}
                    isBack={true}
                    onSearchText={(input) => this.setState({ searchInput: input })}
                    nav={this.props.navigation}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => this.props.navigation.navigate('ReferralChannelTypeAddScreen', { onRefresh: this.onRefresh })}
                    title={R.strings.referral_channel_type}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={
                    loading || activeLoading || inActiveLoading} />

                <View style={{
                    flex: 1, justifyContent: 'space-between'
                }}>

                    {(referralChannelLoading && !this.state.refreshing) ?
                        <ListLoader />
                        :
                        <View style={{ flex: 1 }}>
                            {finalItems.length ?
                                <View style={{ flex: 1 }}>

                                    <FlatList
                                        //data={this.state.data}
                                        data={finalItems}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ index, item }) => <ReferralChannelTypeItem
                                            id={item.id}
                                            ChannelTypeName={item.ChannelTypeName}
                                            CreatedDate={item.CreatedDate}
                                            Status={item.Status}
                                            item={item}
                                            isGrid={false}
                                            index={index}
                                            size={this.state.response.length}
                                            onEditReferralChannel={() => this.onEditReferralChannel(index, item)}
                                            onUpdateFeature={() => this.updateFeature(item.Status, item.Id)}
                                        />
                                        }
                                        /* For Refresh Functionality In FlatList */
                                        refreshControl={
                                            <RefreshControl
                                                colors={[R.colors.accent]}
                                                progressBackgroundColor={R.colors.background}
                                                refreshing={this.state.refreshing}
                                                onRefresh={() => this.onRefresh(true, true)}
                                            />
                                        }
                                        keyExtractor={item => item.Id.toString()}
                                    />
                                </View> : !loading && <ListEmptyComponent module={R.strings.add_referral_channel_type} onPress={() => this.props.navigation.navigate('ReferralChannelTypeAddScreen', { onRefresh: this.onRefresh })} />
                            }
                        </View>
                    }
                </View>
            </SafeView>

        );
    };
}

class ReferralChannelTypeItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //if old item and new item are different than only render list item
        if (this.props.item !== nextProps.item ||
            this.props.onUpdateFeature !== nextProps.onUpdateFeature) {
            return true
        }
        return false
    }

    render() {

        let isEnable = this.props.Status.toString() === "1" ? true : false
        let props = this.props;
        let item = props.item;
        let index = props.index;
        let size = props.size;

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginRight: R.dimens.widget_left_right_margin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    flex: 1,
                }}>
                    <CardView style={{
                        flex: 1,
                        borderTopRightRadius: R.dimens.margin,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                    }}>

                        <View
                            style={{ flexDirection: 'row' }}>

                            <View
                                style={{
                                    justifyContent: 'flex-start',
                                    alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start'
                                }}>
                                {/* for show share icon */}
                                <ImageTextButton
                                    icon={R.images.IC_REFER_SHARE}
                                    style={{ margin: 0, padding: 0, justifyContent: 'center', alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                                />
                            </View>

                            <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, }}>

                                {/* for show ChannelType edit icon */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.ChannelType + ': '}</TextViewHML>
                                    <ImageTextButton
                                        style={{ margin: 0, padding: 0, paddingRight: 0 }}
                                        onPress={this.props.onEditReferralChannel}
                                        icon={R.images.IC_EDIT}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textPrimary }}
                                    />
                                </View>

                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.ChannelTypeName ? item.ChannelTypeName : '-'}</TextViewHML>
                            </View>
                        </View>

                        {/* for show time and status */}

                        <View
                            style={{
                                justifyContent: 'space-between',
                                flexDirection: 'row', alignItems: 'center',
                            }}>

                            <FeatureSwitch
                                onValueChange={() => this.props.onUpdateFeature(this.props.Status, this.props.item.Id)}
                                isToggle={isEnable}
                                style={{
                                    paddingLeft: R.dimens.widgetMargin,
                                    paddingBottom: R.dimens.widgetMargin,
                                    paddingTop: R.dimens.widgetMargin,
                                    //justifyContent: 'flex-end',
                                    paddingRight: R.dimens.widgetMargin,
                                    backgroundColor: 'transparent',
                                }}
                            />
                            <View style={{ flexDirection: 'row' }}>
                                <ImageTextButton
                                    icon={R.images.IC_TIMER}
                                    style={{ margin: 0, paddingRight: R.dimens.widgetMargin, }}
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                />
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDate(item.CreatedDate) + ' ' + convertTime(item.CreatedDate)}</TextViewHML>
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
        //data get from the reducer and set to appData
        appData: state.ReferralChannelTypeReducer
    }
}
function mapDispatchToProps(dispatch) {
    return {
        //Perform getReferralChannelTypeData List Action 
        getReferralChannelTypeData: () => dispatch(getReferralChannelTypeData()),
        //Perform activeChannelType Action 
        activeChannelType: (request) => dispatch(activeChannelType(request)),
        //Perform inactiveChannelType Action 
        inactiveChannelType: (request) => dispatch(inactiveChannelType(request)),
        //Perform clearActiveInactive Action 
        clearActiveInactive: () => dispatch(clearActiveInactive()),
        //Perform clearData Action 
        clearData: () => dispatch(clearData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReferralChannelTypeScreen)