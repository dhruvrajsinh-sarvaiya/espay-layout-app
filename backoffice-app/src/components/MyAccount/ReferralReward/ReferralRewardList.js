import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, addPages, convertDate, convertTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import PaginationWidget from '../../widget/PaginationWidget';
import R from '../../../native_theme/R';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import { AppConfig } from '../../../controllers/AppConfig';
import { getreferralList, enableStatus, disableStatus, clearRefferal } from '../../../actions/account/ReferralAction';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class ReferralRewardList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: [],
            searchInput: '',
            refreshing: false,
            referralListData: null,
            PageSize: AppConfig.pageSize,
            selectedPage: 1,
            row: [],
            statusId: null,
            isFirstTime: true,
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.Request = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
            }
            //call referral list Api 
            this.props.getreferralList(this.Request)
        }
    }

    componentWillUnmount() {
        this.props.clearRefferal();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        // stop twice api call
        return isCurrentScreen(nextProps);
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });
        //Check NetWork is Available or not
        if (await isInternet()) {
            this.Request = {
                PageIndex: this.state.selectedPage,
                Page_Size: this.state.PageSize,
            }
            //call referral list Api 
            this.props.getreferralList(this.Request)
        } else {
            this.setState({ refreshing: false });
        }
    }

    //this method is call when user add or update success from the add or update screen 
    onSuccessAddEdit = async () => {
        // set number one page if add edit success from add or update screen
        this.setState({ selectedPage: 1 })
        //Check NetWork is Available or not
        if (await isInternet()) {
            this.Request = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
            }
            //call referral list Api 
            this.props.getreferralList(this.Request)
        }
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
        if (ReferralRewardList.oldProps !== props) {
            ReferralRewardList.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { referralListData, enableStatusData, disableStatusData } = props.Listdata;
            if (referralListData) {
                try {
                    if (state.referralListData == null || (state.referralListData != null && referralListData !== state.referralListData)) {
                        if (validateResponseNew({ response: referralListData, isList: true, })) {
                            //Set State For Api response 
                            return {
                                ...state,
                                referralListData,
                                response: parseArray(referralListData.ReferralServiceList),
                                refreshing: false,
                                row: addPages(referralListData.TotalCount)
                            }
                        } else {
                            //Set State For Api response 
                            return {
                                ...state,
                                referralListData,
                                response: [],
                                refreshing: false,
                                row: []
                            }
                        }
                    }
                } catch (e) {
                    //Set State For Api response 
                    return {
                        ...state,
                        response: [],
                        refreshing: false,
                        row: []
                    }
                }
            }

            //Check Disable status  Response 
            if (disableStatusData) {
                try {
                    //Get Api response
                    if (validateResponseNew({ response: disableStatusData, isList: true })) {
                        let res = state.response;
                        let findIndexOfChangeID = state.statusId == null ? -1 : res.findIndex(el => el.Id === state.statusId);
                        //if index is >-1 then record is found
                        if (findIndexOfChangeID > -1) {
                            res[findIndexOfChangeID].Status = res[findIndexOfChangeID].Status === 1 ? 0 : 1;
                        }
                        //clear reducer data
                        props.clearRefferal();
                        return {
                            ...state,
                            response: res,
                            statusId: null
                        }
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }

            //Check enable status and delete both Response 
            if (enableStatusData) {
                try {
                    //Get Api response
                    if (validateResponseNew({ response: enableStatusData, isList: true })) {
                        let res = state.response;
                        let findIndexOfChangeID = state.statusId == null ? -1 : res.findIndex(el => el.Id === state.statusId);
                        //if index is >-1 then record is found
                        if (findIndexOfChangeID > -1) {
                            res[findIndexOfChangeID].Status = res[findIndexOfChangeID].Status === 1 ? 0 : 1;
                        }
                        //clear reducer data
                        props.clearRefferal();
                        return {
                            ...state,
                            response: res,
                            statusId: null
                        }
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }
        }
        return null;
    }

    // Pagination Method Called When User Change Page  
    onPageChange = async (pageNo) => {
        //if user select other page number then and only then API Call else no need to call API
        if ((pageNo) !== (this.state.selectedPage)) {
            this.setState({ selectedPage: pageNo });

            //Check NetWork is Available or not
            if (await isInternet()) {
                //Bind request 
                this.Request = {
                    PageIndex: pageNo,
                    Page_Size: this.state.PageSize,
                }
                //call referral list api
                this.props.getreferralList(this.Request)
            }
        }
    }

    updateStatus = async (item) => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.request = {
                Id: item.Id
            }
            //if status is true than call disble status api
            if (item.Status === 1) {
                this.props.disableStatus(this.request);
            }
            //if status is false than call enable status api
            else {
                this.props.enableStatus(this.request);
            }
            this.setState({ statusId: item.Id })
        }
    }

    render() {
        let finalItems = this.state.response;
        const { referralListLoading, enableStatusLoading, disableStatusLoading } = this.props.Listdata;

        //for search
        if (finalItems.length > 0) {
            finalItems = this.state.response.filter(item =>
                item.CurrencyName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.ReferralPayTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.ReferralServiceTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                ('' + item.ReferMinCount).includes(this.state.searchInput) ||
                ('' + item.ReferMaxCount).includes(this.state.searchInput) ||
                ('' + item.RewardsPay).includes(this.state.searchInput)
            )
        }

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.listReferralReward}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ searchInput: input })}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => {
                        this.props.navigation.navigate('AddEditRefferalReward', { edit: false, onSuccess: this.onSuccessAddEdit })
                    }}
                />

                {/* ProgressDialog */}
                <ProgressDialog isShow={enableStatusLoading || disableStatusLoading} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    {
                        (referralListLoading && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>
                                {finalItems.length ?
                                    <View style={{ flex: 1 }}>
                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            data={finalItems}
                                            renderItem={({ item, index }) => <ReferralRewardListItem
                                                item={item}
                                                ctx={this}
                                                index={index}
                                                size={this.state.response.length}
                                                onEdit={() => {
                                                    this.props.navigation.navigate('AddEditRefferalReward', { item: item, edit: true, onSuccess: this.onSuccessAddEdit })
                                                }}
                                                onUpdateFeature={() => this.updateStatus(item, index)}

                                                onDetailPress={() => {
                                                    this.props.navigation.navigate('ReferralRewardListDetail', { item: item })
                                                }}

                                            ></ReferralRewardListItem>
                                            }

                                            keyExtractor={(item, index) => index.toString()}
                                            contentContainerStyle={contentContainerStyle(finalItems)}
                                            /* For Refresh Functionality In Withdrawal FlatList Item */
                                            refreshControl={
                                                <RefreshControl
                                                    colors={[R.colors.accent]}
                                                    progressBackgroundColor={R.colors.background}
                                                    refreshing={this.state.refreshing}
                                                    onRefresh={this.onRefresh}
                                                />
                                            }
                                        />
                                    </View>
                                    :
                                    <ListEmptyComponent module={R.strings.addReferralReward} onPress={() => this.props.navigation.navigate('AddEditRefferalReward', { edit: false, onSuccess: this.onSuccessAddEdit })} />
                                }
                            </View>
                    }
                    <View>
                        {finalItems.length > 0 &&
                            <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
                        }
                    </View>
                </View>
            </SafeView>
        )
    }
}

// This Class is used for display record in list
class ReferralRewardListItem extends Component {
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
        let props = this.props;  let item = props.item;
        let size = props.size;  let index = props.index;

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    flex: 1,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin, marginRight: R.dimens.widget_left_right_margin,
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        borderRadius: 0,  borderBottomLeftRadius: R.dimens.margin,  borderTopRightRadius: R.dimens.margin,
                        flex: 1,
                    }} onPress={this.props.onDetailPress}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>

                            {/* for show share icon */}
                            <View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                                <ImageTextButton
                                    icon={R.images.IC_REFER_SHARE}
                                    style={{ margin: 0, padding: 0, justifyContent: 'center', alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                                />
                            </View>

                            {/* for show slab reward service pay type*/}
                            <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>
                                            {R.strings.slab + ': '}</TextViewHML>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.ReferMinCount) + " TO " + validateValue(item.ReferMaxCount)}</TextViewHML>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.reward + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, marginLeft: R.dimens.widgetMargin }}>{validateValue(item.RewardsPay) + " " + item.CurrencyName}</TextViewHML>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.service + R.strings.type + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, marginLeft: R.dimens.widgetMargin }}>{item.ReferralServiceTypeName ? item.ReferralServiceTypeName : '-'}</TextViewHML>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.pay + R.strings.type + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, marginLeft: R.dimens.widgetMargin }}>{item.ReferralPayTypeName ? item.ReferralPayTypeName : '-'}</TextViewHML>
                                    </View>

                                </View>

                                {/* for show detail icon */}
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                    <ImageTextButton
                                        style={{ margin: 0, padding: 0, paddingRight: 0 }}
                                        onPress={this.props.onDetailPress}
                                        icon={R.images.RIGHT_ARROW_DOUBLE}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textPrimary }}
                                    />
                                </View>

                            </View>
                        </View>

                        {/* for show time and status */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <FeatureSwitch
                                isToggle={item.Status === 1 ? true : false}
                                onValueChange={props.onUpdateFeature}
                                style={{
                                    backgroundColor: 'transparent',
                                    paddingBottom: R.dimens.widgetMargin,
                                    paddingTop: R.dimens.widgetMargin,
                                    paddingLeft: R.dimens.widgetMargin,
                                    paddingRight: R.dimens.widgetMargin,
                                }}
                                textStyle={{ marginTop: R.dimens.widgetMargin, color: R.colors.textPrimary, fontSize: R.dimens.secondCurrencyText }}
                            />
                            <View style={{ flexDirection: 'row' }}>
                                <ImageTextButton
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                    style={{ margin: 0, paddingRight: R.dimens.widgetMargin, }}  icon={R.images.IC_TIMER}
                                />
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDate(item.CreatedDate) + ' ' + convertTime(item.CreatedDate)}</TextViewHML>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    return {
        //Updated Data Referral
        Listdata: state.ReferralReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //list data
        getreferralList: (request) => dispatch(getreferralList(request)),
        //enable status 
        enableStatus: (request) => dispatch(enableStatus(request)),
        //disable status 
        disableStatus: (request) => dispatch(disableStatus(request)),
        //clear refereal Reducer data
        clearRefferal: () => dispatch(clearRefferal()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(ReferralRewardList);


