// AffiliateSchemeTypeListScreen.js
import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import { connect } from 'react-redux';
import StatusChip from '../../widget/StatusChip';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, addPages } from '../../../controllers/CommonUtils';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import R from '../../../native_theme/R';
import { AppConfig } from '../../../controllers/AppConfig';
import { isCurrentScreen } from '../../Navigation';
import CardView from '../../../native_theme/components/CardView';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import PaginationWidget from '../../widget/PaginationWidget';
import { changeAffiliateSchemeTypeStatus, affiliateSchemeTypeList, affiliateSchemeTypeListClear } from '../../../actions/account/AffiliateSchemeTypeAction';
import { Fonts } from '../../../controllers/Constants';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';

class AffiliateSchemeTypeListScreen extends Component {
    constructor(props) {
        super(props);

        //Define initial state
        this.state = {
            response: [],
            searchInput: '',
            refreshing: false,
            PageSize: AppConfig.pageSize,
            selectedPage: 1,
            row: [],
            statusId: null,
            changedStatus: null,
            isFirstTime: true,
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.Request = {
                PageNo: 0,
                PageSize: this.state.PageSize,
            }

            //call affliate Scheme list Api 
            this.props.affiliateSchemeTypeList(this.Request)
        }
    }

    shouldComponentUpdate = (nextProps) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount = () => {
        // clear reducer data
        this.props.affiliateSchemeTypeListClear();
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.Request = {
                PageNo: this.state.selectedPage - 1,
                PageSize: this.state.PageSize,
            }

            //call affliate Scheme list Api 
            this.props.affiliateSchemeTypeList(this.Request)
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
                PageNo: 0,
                PageSize: this.state.PageSize,
            }

            //call affliate Scheme list Api 
            this.props.affiliateSchemeTypeList(this.Request)
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
        if (AffiliateSchemeTypeListScreen.oldProps !== props) {
            AffiliateSchemeTypeListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated data of Particular actions
            const { schemeTypeListData, schemeTypeListDataFetch, schemeTypeStatusData, schemeTypeStatusDataFetch } = props;

            //To Check affiliateUser Data Fetch or Not
            if (!schemeTypeListDataFetch) {
                try {
                    if (validateResponseNew({ response: schemeTypeListData, isList: true })) {
                        //Store Api Response Field and display in Screen.
                        var res = parseArray(schemeTypeListData.Data);
                        return { ...state, response: res, refreshing: false, row: addPages(schemeTypeListData.TotalCount) };
                    }
                    else {
                        return { ...state, response: [], refreshing: false, row: [] };
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false, row: [] };
                }
            }

            //Check enable status Response 
            if (!schemeTypeStatusDataFetch) {
                try {
                    //Get Api response
                    if (validateResponseNew({ response: schemeTypeStatusData, isList: true })) {
                        let resItem = state.response;
                        let findIndexOfChangeID = state.statusId == null ? -1 : resItem.findIndex(el => el.SchemeTypeId === state.statusId);

                        //if index is >-1 then record is found
                        if (findIndexOfChangeID > -1) {
                            resItem[findIndexOfChangeID].Status = state.changedStatus;
                        }

                        props.affiliateSchemeTypeListClear();
                        return {
                            ...state,
                            response: resItem,
                            statusId: null,
                            changedStatus: null
                        }
                    }
                    else {
                        props.affiliateSchemeTypeListClear();
                    }

                } catch (e) {
                    props.affiliateSchemeTypeListClear();
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
                    PageNo: pageNo - 1,
                    PageSize: this.state.PageSize,
                }

                //call affliate Scheme list Api 
                this.props.affiliateSchemeTypeList(this.Request)
            }
        }
    }

    onUpdateStatus = async (item, isDelete) => {

        let status
        //if status is inactive=0 than set status call for active 
        if (item.Status == 0) {
            //if status is inactive=0 and delete than call for delete
            if (isDelete) {
                status = 9
            }
            else {
                status = 1
            }
        }

        //if status is delete=9 than set status call for inactive 
        else if (item.Status == 9) {
            if (isDelete) {
                status = 0
            }
            else {
                status = 1
            }
        }

        //if status is active=1 than set status call for inactive 
        else if (item.Status == 1) {
            //if status is active=0 and delete than call for delete
            if (isDelete) {
                status = 9
            }
            else {
                status = 0
            }
        }

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.request = {
                SchemeTypeId: item.SchemeTypeId, Status: status
            }

            this.setState({ statusId: item.SchemeTypeId, changedStatus: status })

            //call changeAffiliateSchemeTypeStatus api
            this.props.changeAffiliateSchemeTypeStatus(this.request);
        }
    }

    render() {

        const { isSchemeTypeListFetch, isSchemeTypeStatusFetch } = this.props;

        let finalItems = this.state.response;
        if (finalItems.length > 0) {
            finalItems = this.state.response.filter(item =>
                item.SchemeTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.Description.toLowerCase().includes(this.state.searchInput.toLowerCase())
            )
        }

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.listAffiliateSchemeType}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ searchInput: input })}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => {
                        this.props.navigation.navigate('AffiliateSchemeTypeAddEditScreen', { edit: false, onSuccess: this.onSuccessAddEdit })
                    }}
                />

                {/* Progress Dialog Display  */}
                {<ProgressDialog isShow={isSchemeTypeStatusFetch} />}

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {/* To Check Response fetch or not if isSchemeTypeListFetch = true then display progress bar else display List*/}
                    {
                        (isSchemeTypeListFetch && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>
                                {finalItems.length ?
                                    <View style={{ flex: 1 }}>
                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            data={finalItems}
                                            renderItem={({ item, index }) => <AffiliateSchemeTypeListItem
                                                size={this.state.response.length}
                                                item={item}
                                                index={index}
                                                onStatusChange={() => this.onUpdateStatus(item, false)}
                                                onDeleteStatusChange={() => this.onUpdateStatus(item, true)}
                                                onEdit={() => {
                                                    this.props.navigation.navigate('AffiliateSchemeTypeAddEditScreen', { item: item, edit: true, onSuccess: this.onSuccessAddEdit })
                                                }
                                                }
                                            />
                                            }
                                            keyExtractor={(item, index) => index.toString()}
                                            contentContainerStyle={contentContainerStyle(finalItems)}
                                            /* For Refresh Functionality In Withdrawal FlatList Item */
                                            refreshControl={
                                                <RefreshControl
                                                    onRefresh={this.onRefresh}
                                                    progressBackgroundColor={R.colors.background}
                                                    refreshing={this.state.refreshing}
                                                    colors={[R.colors.accent]}
                                                />
                                            }
                                        />
                                    </View>
                                    :
                                    <ListEmptyComponent module={R.strings.addAffiliateSchemeType} onPress={() => this.props.navigation.navigate('AffiliateSchemeTypeAddEditScreen', { edit: false, onSuccess: this.onSuccessAddEdit })} />
                                }
                            </View>
                    }

                    {/* show pagination   */}
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
class AffiliateSchemeTypeListItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let item = this.props.item;
        let props = this.props;
        let size = props.size;
        let index = props.index;
        let icon = R.images.IC_CHECKMARK
        let color = R.colors.failRed
        let delIcon = R.images.IC_DELETE
        let delColor = R.colors.failRed
        let statusText = ''
        let statusTextColor = R.colors.successGreen

        //if status is inactive=0 than set icons and colors
        if (item.Status == 0) {

            delIcon = R.images.IC_DELETE
            delColor = R.colors.failRed

            icon = R.images.IC_CHECKMARK
            color = R.colors.successGreen

            statusText = R.strings.inActive
            statusTextColor = R.colors.yellow
        }

        //if status is active=1 than set icons and colors
        else if (item.Status == 1) {
            color = R.colors.yellow
            icon = R.images.IC_CANCEL

            delIcon = R.images.IC_DELETE
            delColor = R.colors.failRed

            statusTextColor = R.colors.successGreen
            statusText = R.strings.active
        }

        //if status is Delete=9 than set icons and colors
        else if (item.Status == 9) {
            icon = R.images.IC_CHECKMARK
            color = R.colors.successGreen

            delIcon = R.images.IC_CANCEL
            delColor = R.colors.yellow

            statusText = R.strings.Delete
            statusTextColor = R.colors.failRed
        }

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
                        elevation: R.dimens.listCardElevation,
                        flex: 1, borderRadius: 0,
                        borderTopRightRadius: R.dimens.margin,
                        borderBottomLeftRadius: R.dimens.margin,
                    }}>
                        <View style={{ flexDirection: 'row' }}>
                            {/* image icon */}
                            <View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                                <ImageTextButton
                                    style={{ margin: 0, padding: 0, justifyContent: 'center', alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    icon={R.images.IC_COPY}
                                    iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                                />
                            </View>

                            {/* for show Description , SchemeTypeName */}
                            <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, }}>
                                <Text style={{
                                    fontSize: R.dimens.smallText, color: R.colors.textPrimary,
                                    fontFamily: Fonts.MontserratSemiBold,
                                }}>{item.SchemeTypeName ? item.SchemeTypeName : '-'}</Text>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{item.Description ? item.Description : '-'}</TextViewHML>
                            </View>
                        </View>

                        {/* for show status , edit icon , status change ,delete */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, }}>
                            <StatusChip
                                color={statusTextColor}
                                value={statusText}></StatusChip>
                            <View>

                                <View style={{ flexDirection: 'row' }}>
                                    <ImageTextButton
                                        style={
                                            {
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: R.colors.accent,
                                                borderRadius: R.dimens.titleIconHeightWidth,
                                                padding: R.dimens.CardViewElivation,
                                                marginRight: R.dimens.widgetMargin,
                                                margin: 0,
                                            }}
                                        icon={R.images.IC_EDIT}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                        onPress={this.props.onEdit} />

                                    <ImageTextButton
                                        icon={icon}
                                        style={
                                            {
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: color,
                                                borderRadius: R.dimens.titleIconHeightWidth,
                                                margin: 0,
                                                padding: R.dimens.CardViewElivation,
                                                marginRight: R.dimens.widgetMargin,
                                            }}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                        onPress={this.props.onStatusChange} />

                                    <ImageTextButton
                                        style={
                                            {
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: delColor,
                                                borderRadius: R.dimens.titleIconHeightWidth,
                                                margin: 0,
                                                padding: R.dimens.CardViewElivation
                                            }}
                                        icon={delIcon}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                        onPress={this.props.onDeleteStatusChange} />
                                </View>
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
        //Updated Data of SchemetypeList
        isSchemeTypeListFetch: state.AffiliateSchemeTypeReducer.isSchemeTypeListFetch,
        schemeTypeListData: state.AffiliateSchemeTypeReducer.schemeTypeListData,
        schemeTypeListDataFetch: state.AffiliateSchemeTypeReducer.schemeTypeListDataFetch,

        //Updated Data of Scheme Type Status
        isSchemeTypeStatusFetch: state.AffiliateSchemeTypeReducer.isSchemeTypeStatusFetch,
        schemeTypeStatusData: state.AffiliateSchemeTypeReducer.schemeTypeStatusData,
        schemeTypeStatusDataFetch: state.AffiliateSchemeTypeReducer.schemeTypeStatusDataFetch,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Action for SchemeTypeList
        affiliateSchemeTypeList: (request) => dispatch(affiliateSchemeTypeList(request)),
        //Perform Action for Change status 
        changeAffiliateSchemeTypeStatus: (request) => dispatch(changeAffiliateSchemeTypeStatus(request)),
        //clear Reducer data
        affiliateSchemeTypeListClear: (request) => dispatch(affiliateSchemeTypeListClear(request)),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(AffiliateSchemeTypeListScreen);