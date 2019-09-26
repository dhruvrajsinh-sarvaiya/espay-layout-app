import React, { Component } from 'react';
import {
    View,
    FlatList,
    RefreshControl,
} from 'react-native';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { connect } from 'react-redux';
import { getReferralPayTypeData, inactivePayType, activePayType, clearActiveInactive, clearData } from '../../../actions/account/ReferralPayTypeAction';
import { changeTheme, parseArray, convertDate, convertTime } from '../../../controllers/CommonUtils';
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


class ReferralPayTypeScreen extends Component {

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
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or no
        if (await isInternet()) {
            //Call referral Pay type api
            this.props.getReferralPayTypeData();
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
        if (ReferralPayTypeScreen.oldProps !== props) {
            ReferralPayTypeScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const {
                referralPayTypeData,
                referralPayLoading,
                activeReferralPayTypeData,
                activeLoading,
                inActiceReferralPayTypeData,
                inActiveLoading } = props.appData;

            //check fetch referral channle list API response.
            if (!referralPayLoading) {
                try {
                    if (state.referralPayTypeData == null || (state.referralPayTypeData != null && referralPayTypeData !== state.referralPayTypeData)) {
                        //handle response of API
                        if (validateResponseNew({ response: referralPayTypeData, isList: true })) {
                            //check News Response is an Array Or not
                            //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                            var res = parseArray(referralPayTypeData.ReferralPayTypeList)
                            return {
                                ...state, referralPayTypeData, response: res, refreshing: false
                            }
                        }
                        else {
                            return {
                                ...state, referralPayTypeData, response: [], refreshing: false
                            }
                        }
                    }
                } catch (e) {
                    return {
                        ...state, response: [], refreshing: false
                    }
                }
            }

            //check fetch referral Pay active API response.
            if (!activeLoading) {
                try {
                    if (activeReferralPayTypeData !== null) {
                        //handle response of API
                        if (validateResponseNew({ response: activeReferralPayTypeData })) {

                            let responseData = state.response;
                            let findIndexOfChangeID = state.Selected == null ? -1 : responseData.findIndex(el => el.Id === state.Selected);

                            //if index is >-1 then record is found
                            if (findIndexOfChangeID > -1) {
                                responseData[findIndexOfChangeID].Status = responseData[findIndexOfChangeID].Status == 1 ? 0 : 1;
                            }
                            //clear data
                            props.clearActiveInactive()
                            return {
                                ...state, response: responseData
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

            //check fetch referral Pay Inactive API response.
            if (!inActiveLoading) {
                try {
                    if (inActiceReferralPayTypeData !== null) {
                        //handle response of API
                        if (validateResponseNew({ response: inActiceReferralPayTypeData })) {

                            let inactiveResponseData = state.response;
                            let findIndexOfChangeID = state.Selected == null ? -1 : inactiveResponseData.findIndex(el => el.Id === state.Selected);

                            //if index is >-1 then record is found
                            if (findIndexOfChangeID > -1) {
                                inactiveResponseData[findIndexOfChangeID].Status = inactiveResponseData[findIndexOfChangeID].Status == 1 ? 0 : 1;
                            }

                            //clear data
                            props.clearActiveInactive()

                            return {
                                ...state, response: inactiveResponseData
                            }

                        } else {
                            //clear data
                            props.clearActiveInactive()
                        }
                    }
                } catch (e) {
                    //clear data
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
            this.props.getReferralPayTypeData();
            //----------
        }
        else {
            this.setState({ refreshing: false });
        }
        //--------------
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        // stop twice api call
        return isCurrentScreen(nextProps);
    };

    onEditReferralPay = (index, item) => {
        //redirect screen for edit
        if (item) {
            this.props.navigation.navigate('ReferralPayTypeAddScreen', { ITEM: item, onRefresh: this.onRefresh })
        }
    }

    updateFeature = async (isEnable, Id) => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.setState({ Selected: Id })
            //To update feature state value
            let request = {
                Id: Id,
            }
            //isEnable = 0 then it is inactive and call api of active
            //isEnable = 1 then it is active and call api of inactive
            if (isEnable.toString() === '0') {

                //call activePayType api
                this.props.activePayType(request);
            } else {

                //call inactivePayType api
                this.props.inactivePayType(request);
            }
        }
    }

    render() {
        let { loading, referralPayLoading, activeLoading, inActiveLoading } = this.props.appData

        let finalItems = this.state.response

        //for search
        if (finalItems.length > 0) {
            finalItems = finalItems.filter(item =>
                item.PayTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.CreatedDate.toLowerCase().includes(this.state.searchInput.toLowerCase())
            )
        }
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.referral_pay_type}
                    isBack={true}
                    searchable={true}
                    onSearchText={(input) => this.setState({ searchInput: input })}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => this.props.navigation.navigate('ReferralPayTypeAddScreen', { onRefresh: this.onRefresh })}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={loading || activeLoading || inActiveLoading} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    {(referralPayLoading && !this.state.refreshing) ?
                        <ListLoader />
                        :
                        <View style={{ flex: 1 }}>
                            {finalItems.length ?
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        //data={this.state.data}
                                        data={finalItems}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ index, item }) => <ReferralPayTypeItem
                                            id={item.id}
                                            PayTypeName={item.PayTypeName}
                                            CreatedDate={item.CreatedDate}
                                            Status={item.Status}
                                            item={item}
                                            isGrid={false}
                                            index={index}
                                            size={this.state.response.length}
                                            onEditReferralPay={() => this.onEditReferralPay(index, item)}
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
                                </View> : !loading && <ListEmptyComponent module={R.strings.add_referral_pay_type} onPress={() => this.props.navigation.navigate('ReferralPayTypeAddScreen', { onRefresh: this.onRefresh })} />
                            }
                        </View>
                    }
                </View>
            </SafeView>

        );
    };
}

class ReferralPayTypeItem extends Component {

    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(nextProps) {
        //if old item and new item are different than only render list item

        if (this.props.item !== nextProps.item || this.props.onUpdateFeature !== nextProps.onUpdateFeature) {

            return true
        }
        return false
    }

    render() {

        let isEnable = this.props.Status.toString() === "1" ? true : false
        let size = props.size;
        let props = this.props;
        let index = props.index;
        let item = props.item;

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>

                    <CardView style={{
                        borderRadius: 0,
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>

                        <View style={{
                            flexDirection: 'row'
                        }}>

                            {/* share icon*/}
                            <View style={{
                                justifyContent: 'flex-start', alignSelf: 'flex-start',
                                alignItems: 'flex-start', alignContent: 'flex-start'
                            }}>
                                <ImageTextButton
                                    icon={R.images.IC_REFER_SHARE}
                                    style={{
                                        margin: 0, padding: 0, justifyContent: 'center',
                                        alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight
                                    }}
                                    iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                                />
                            </View>

                            <View style={{
                                flex: 1,
                                paddingLeft: R.dimens.widgetMargin,
                            }}>
                                {/* PayType and PayTypeName  */}
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }} >
                                    <TextViewHML style={{
                                        fontSize: R.dimens.smallestText,
                                        color: R.colors.textSecondary,
                                    }}>{R.strings.PayType + ': '}</TextViewHML>
                                    <ImageTextButton
                                        style={{ margin: 0, padding: 0, paddingRight: 0 }}
                                        icon={R.images.IC_EDIT}
                                        onPress={this.props.onEditReferralPay}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textPrimary }}
                                    />
                                </View>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.PayTypeName ? item.PayTypeName : '-'}</TextViewHML>
                            </View>
                        </View>

                        {/* for show time and status */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <FeatureSwitch
                                isToggle={isEnable}
                                onValueChange={() => this.props.onUpdateFeature(this.props.Status, this.props.item.Id)}
                                style={{
                                    //justifyContent: 'flex-end',
                                    backgroundColor: 'transparent',
                                    paddingBottom: R.dimens.widgetMargin,
                                    paddingTop: R.dimens.widgetMargin,
                                    paddingLeft: R.dimens.widgetMargin,
                                    paddingRight: R.dimens.widgetMargin,
                                }}
                            />
                            <View style={{ flexDirection: 'row' }}>
                                <ImageTextButton
                                    style={{ margin: 0, paddingRight: R.dimens.widgetMargin, }}
                                    icon={R.images.IC_TIMER}
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
        appData: state.ReferralPayTypeReducer
    }
}
function mapDispatchToProps(dispatch) {
    return {
        //Perform getReferralPayTypeData List Action 
        getReferralPayTypeData: () => dispatch(getReferralPayTypeData()),
        //Perform activePayType Action 
        activePayType: (request) => dispatch(activePayType(request)),
        //Perform inactivePayType Action 
        inactivePayType: (request) => dispatch(inactivePayType(request)),
        //Perform clearActiveInactive Action 
        clearActiveInactive: () => dispatch(clearActiveInactive()),
        //Perform clearData Action 
        clearData: () => dispatch(clearData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReferralPayTypeScreen)