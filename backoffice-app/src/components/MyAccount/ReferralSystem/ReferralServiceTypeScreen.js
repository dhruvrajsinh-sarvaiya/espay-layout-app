import React, { Component } from 'react';
import {
    View,
    FlatList,
    RefreshControl,
} from 'react-native';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { connect } from 'react-redux';
import { getReferralServiceTypeData, inactiveServiceType, activeServiceType, clearActiveInactive, clearData } from '../../../actions/account/ReferralServiceTypeAction';
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

class ReferralServiceTypeScreen extends Component {

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
            //Call referral service type api
            this.props.getReferralServiceTypeData();
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
        if (ReferralServiceTypeScreen.oldProps !== props) {
            ReferralServiceTypeScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { referralServiceTypeData,
                referralServiceLoading,

                activeReferralServiceTypeData,
                activeLoading,

                inActiceReferralServiceTypeData,
                inActiveLoading } = props.appData;

            //check fetch referral service list API response.
            if (!referralServiceLoading) {
                try {
                    if (state.referralServiceTypeData == null || (state.referralServiceTypeData != null && referralServiceTypeData !== state.referralServiceTypeData)) {

                        //handle response of API
                        if (validateResponseNew({ response: referralServiceTypeData, isList: true })) {
                            //check News Response is an Array Or not
                            //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                            var res = parseArray(referralServiceTypeData.ReferralServiceTypeList)
                            return {
                                ...state, referralServiceTypeData, response: res, refreshing: false
                            }
                        } else {
                            return {
                                ...state, referralServiceTypeData, response: [], refreshing: false
                            }
                        }
                    }
                } catch (e) {
                    return {
                        ...state, response: [], refreshing: false
                    }
                }
            }

            //check fetch referral service active API response.
            if (!activeLoading) {
                try {
                    if (activeReferralServiceTypeData !== null) {
                        //handle response of API
                        if (validateResponseNew({ response: activeReferralServiceTypeData })) {

                            let activeResData = state.response;
                            let findIndexOfChangeID = state.Selected == null ? -1 : activeResData.findIndex(el => el.Id === state.Selected);

                            //if index is >-1 then record is found
                            if (findIndexOfChangeID > -1) {
                                activeResData[findIndexOfChangeID].Status = activeResData[findIndexOfChangeID].Status == 1 ? 0 : 1;
                            }
                            //to clear active inactive data
                            props.clearActiveInactive()
                            //------
                            return {
                                ...state, refreshing: false, response: activeResData
                            }
                        } else {
                            //to clear active inactive data
                            props.clearActiveInactive()
                            //------
                            return {
                                ...state, refreshing: false,
                            }
                        }
                    }
                } catch (e) {
                    //to clear active inactive data
                    props.clearActiveInactive()
                    //------
                    return {
                        ...state, refreshing: false,
                    }
                }
            }

            //check fetch referral service Inactive API response.
            if (!inActiveLoading) {
                try {
                    if (inActiceReferralServiceTypeData !== null) {
                        //handle response of API
                        if (validateResponseNew({ response: inActiceReferralServiceTypeData })) {

                            let inactiveResdata = state.response;
                            let findIndexOfChangeID = state.Selected == null ? -1 : inactiveResdata.findIndex(el => el.Id === state.Selected);

                            //if index is >-1 then record is found
                            if (findIndexOfChangeID > -1) {
                                inactiveResdata[findIndexOfChangeID].Status = inactiveResdata[findIndexOfChangeID].Status == 1 ? 0 : 1;
                            }
                            //to clear active inactive data
                            props.clearActiveInactive()
                            //------

                            return {
                                ...state, response: inactiveResdata, refreshing: false
                            }
                        } else {
                            //to clear active inactive data
                            props.clearActiveInactive()
                            //------
                            return {
                                ...state, refreshing: false
                            }
                        }
                    }
                } catch (e) {
                    //to clear active inactive data
                    props.clearActiveInactive()
                    //------
                    return {
                        ...state, refreshing: false
                    }
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
            this.props.getReferralServiceTypeData();
            //----------
        }
        else {
            this.setState({ refreshing: false });
        }
        //--------------
    }
    //-----------

    shouldComponentUpdate = (nextProps, nextState) => {
        // stop twice api call
        return isCurrentScreen(nextProps);
    };

    onEditReferralService = (index, item) => {
        //redirect screen for edit 
        if (item) {
            this.props.navigation.navigate('ReferralServiceTypeAddScreen', { ITEM: item, onRefresh: this.onRefresh })
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
                this.props.activeServiceType(request);
            } else {
                this.props.inactiveServiceType(request);
            }
        }
    }

    render() {
        let { loading, referralServiceLoading, activeLoading, inActiveLoading } = this.props.appData

        let finalItems = this.state.response
        if (finalItems.length > 0) {
            finalItems = finalItems.filter(item =>
                item.ServiceTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.CreatedDate.toLowerCase().includes(this.state.searchInput.toLowerCase())
            )
        }
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                <CommonStatusBar />

                <CustomToolbar
                    title={R.strings.referral_service_type}
                    isBack={true}
                    searchable={true}
                    onSearchText={(input) => this.setState({ searchInput: input })}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => this.props.navigation.navigate('ReferralServiceTypeAddScreen', { onRefresh: this.onRefresh })}
                    nav={this.props.navigation}
                />
                {/* Progress Dialog */}
                <ProgressDialog isShow={loading || activeLoading || inActiveLoading} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    {(referralServiceLoading && !this.state.refreshing) ?
                        <ListLoader />
                        :
                        <View style={{ flex: 1 }}>
                            {finalItems.length ?
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        //data={this.state.data}
                                        data={finalItems}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ index, item }) => <ReferralServiceTypeItem
                                            id={item.id}
                                            ServiceTypeName={item.ServiceTypeName}
                                            CreatedDate={item.CreatedDate}
                                            Status={item.Status}
                                            item={item}
                                            isGrid={false}
                                            index={index}
                                            size={this.state.response.length}
                                            onEditReferralService={() => this.onEditReferralService(index, item)}
                                            swipeable={(swipeable) => this.swipeable.push(swipeable)}
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
                                </View> : !loading && <ListEmptyComponent module={R.strings.add_referral_service_type} onPress={() => this.props.navigation.navigate('ReferralServiceTypeAddScreen', { onRefresh: this.onRefresh })} />
                            }
                        </View>
                    }
                </View>
            </SafeView>

        );
    };
}

class ReferralServiceTypeItem extends Component {
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
        let { item, size, index } = this.props;

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={
                    {   flex: 1,  marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                        marginLeft: R.dimens.widget_left_right_margin,
                        marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView 
                    style={{ elevation: R.dimens.listCardElevation,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        flex: 1,
                        borderTopRightRadius: R.dimens.margin,
                    }}>

                        <View style={{ flexDirection: 'row' }}>

                            {/* for show share icon */}
                            <View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                                <ImageTextButton
                                    style={{ 
                                        margin: 0, padding: 0, 
                                        justifyContent: 'center', alignSelf: 'center', 
                                        width: R.dimens.SignUpButtonHeight, 
                                        height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    icon={R.images.IC_REFER_SHARE}
                                    iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                                />
                            </View>

                            <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, }}>
                                {/* for show ServiceTypeName edit icon */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                                    <TextViewHML
                                        style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.service_type + ': '}</TextViewHML>
                                    <ImageTextButton
                                        style={{ margin: 0, padding: 0, paddingRight: 0 }}
                                        onPress={this.props.onEditReferralService}
                                        icon={R.images.IC_EDIT}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textPrimary }}
                                    />
                                </View>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.ServiceTypeName ? item.ServiceTypeName : '-'}</TextViewHML>
                            </View>
                        </View>

                        {/* for show time and status */}
                        <View style={{ 
                            flexDirection: 'row', 
                            alignItems: 'center', justifyContent: 'space-between' }}>

                            <FeatureSwitch
                                isToggle={isEnable}
                                onValueChange={() => this.props.onUpdateFeature(this.props.Status, this.props.item.Id)}
                                style={{
                                    //justifyContent: 'flex-end',
                                    backgroundColor: 'transparent',  paddingBottom: R.dimens.widgetMargin,
                                    paddingTop: R.dimens.widgetMargin,  paddingLeft: R.dimens.widgetMargin,
                                    paddingRight: R.dimens.widgetMargin,
                                }}
                            />

                            <View style={{ flexDirection: 'row' }}>
                                <ImageTextButton
                                    style={{ margin: 0, 
                                        paddingRight: R.dimens.widgetMargin, }}
                                        iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                        icon={R.images.IC_TIMER}
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
        appData: state.ReferralServiceTypeReducer
    }
}
function mapDispatchToProps(dispatch) {
    return {
        //Perform getReferralServiceTypeData Action 
        getReferralServiceTypeData: () => dispatch(getReferralServiceTypeData()),
        //Perform activeServiceType Action 
        activeServiceType: (request) => dispatch(activeServiceType(request)),
        //Perform inactiveServiceType Action 
        inactiveServiceType: (request) => dispatch(inactiveServiceType(request)),
        //Perform clearActiveInactive Action 
        clearActiveInactive: () => dispatch(clearActiveInactive()),
        //Perform clearData Action 
        clearData: () => dispatch(clearData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReferralServiceTypeScreen)