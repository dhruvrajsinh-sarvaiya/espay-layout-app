// AffiliateSchemeTypeMappingScreen.js
import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, addPages } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { AppConfig } from '../../../controllers/AppConfig';
import CardView from '../../../native_theme/components/CardView';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import PaginationWidget from '../../widget/PaginationWidget';
import { connect } from 'react-redux';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { listAffiliateSchemeTypeMappingData, changeAffiliateSchemeTypeMappingStatus, affiliateSchemeMappingDataClear } from '../../../actions/account/AffiliateSchemeTypeMappingAction';
import { Fonts } from '../../../controllers/Constants';
import StatusChip from '../../widget/StatusChip';
import ImageViewWidget from '../../widget/ImageViewWidget';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class AffiliateSchemeTypeMappingScreen extends Component {

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
            // Bind Request for Scheme Type Mapping List
            this.Request = {
                PageNo: 0,
                PageSize: this.state.PageSize,
            }

            //call affliate Scheme Type Mapping List
            this.props.listAffiliateSchemeTypeMappingData(this.Request)
        }
    }

    shouldComponentUpdate = (nextProps) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount = () => {
        // clear reducer data
        this.props.affiliateSchemeMappingDataClear();
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {
            // Bind Request for Scheme Type Mapping List
            this.Request = {
                PageNo: this.state.selectedPage - 1,
                PageSize: this.state.PageSize,
            }

            //call affliate Scheme Type Mapping List
            this.props.listAffiliateSchemeTypeMappingData(this.Request)
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
            // Bind Request for Scheme Type Mapping List
            this.Request = {
                PageNo: 0,
                PageSize: this.state.PageSize,
            }

            //call affliate Scheme Type Mapping List
            this.props.listAffiliateSchemeTypeMappingData(this.Request)
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
        if (AffiliateSchemeTypeMappingScreen.oldProps !== props) {
            AffiliateSchemeTypeMappingScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated data of Particular actions
            const { schemeTypeMappingList, schemeTypeMappingListFetch, changeMappingStatus, changeMappingStatusFetch } = props;

            // to check Mapping Data Is fetch or not
            if (!schemeTypeMappingListFetch) {
                try {
                    if (validateResponseNew({ response: schemeTypeMappingList, isList: true })) {
                        //Store Api Response Field and display in Screen.
                        var res = parseArray(schemeTypeMappingList.AffiliateSchemeTypeMappingList);
                        return { ...state, response: res, refreshing: false, row: addPages(schemeTypeMappingList.TotalCount) };
                    }
                    else {
                        return { ...state, response: [], refreshing: false, row: [] };
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false, row: [] };
                }
            }

            //Check enable status Response 
            if (!changeMappingStatusFetch) {
                try {
                    //Get Api response
                    if (validateResponseNew({ response: changeMappingStatus, isList: true })) {
                        let responseData = state.response;
                        let findIndexOfChangeID = state.statusId == null ? -1 : responseData.findIndex(el => el.MappingId === state.statusId);

                        //if index is >-1 then record is found
                        if (findIndexOfChangeID > -1) {
                            responseData[findIndexOfChangeID].Status = state.changedStatus;
                        }

                        props.affiliateSchemeMappingDataClear();
                        return {
                            ...state,
                            response: responseData,
                            statusId: null,
                            changedStatus: null
                        }
                    }
                    else {
                        props.affiliateSchemeMappingDataClear();
                    }

                } catch (e) {
                    props.affiliateSchemeMappingDataClear();
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
                // Bind Request for Scheme Type Mapping List
                this.Request = {
                    PageNo: pageNo - 1,
                    PageSize: this.state.PageSize,
                }

                //call affliate Scheme Type Mapping List
                this.props.listAffiliateSchemeTypeMappingData(this.Request)
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

        //if status is delete=9 than set status call for inactive 
        else if (item.Status == 9) {
            if (isDelete) {
                status = 0
            }
            else {
                status = 1
            }
        }

        // check Network is Available or not
        if (await isInternet()) {
            // Bind Request forchange  detail status
            this.request = {
                MappingId: item.MappingId,
                Status: status,
            }

            this.setState({ changedStatus: status, statusId: item.MappingId })

            // call api for change status of scheme detail
            this.props.changeAffiliateSchemeTypeMappingStatus(this.request);
        }
    }

    render() {

        const { isSchemeTypeMappingList, isChangeMappingStatus } = this.props;

        let finalItems = this.state.response;
        if (finalItems.length > 0) {
            finalItems = this.state.response.filter(item =>
                item.SchemeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.Description.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.SchemeTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase())
            )
        }

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.listAffiliateSchemeTypeMapping}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ searchInput: input })}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => {
                        this.props.navigation.navigate('AffiliateSchemeTypeMappingAddEditScreen', { edit: false, onSuccess: this.onSuccessAddEdit })
                    }}
                />

                {/* Progress Dialog Display  */}
                {<ProgressDialog isShow={isChangeMappingStatus} />}

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {/* To Check Response fetch or not if isSchemeTypeMappingList = true then display progress bar else display List*/}
                    {
                        (isSchemeTypeMappingList && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>
                                {finalItems.length ?
                                    <View style={{ flex: 1 }}>
                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            data={finalItems}
                                            renderItem={({ item, index }) => <AffiliateSchemeTypeMappingItem
                                                item={item}
                                                index={index}
                                                size={this.state.response.length}
                                                onStatusChange={() => this.onUpdateStatus(item, false)}
                                                onDeleteStatusChange={() => this.onUpdateStatus(item, true)}
                                                onEdit={() => {
                                                    this.props.navigation.navigate('AffiliateSchemeTypeMappingAddEditScreen', { item: item, edit: true, onSuccess: this.onSuccessAddEdit })
                                                }
                                                }
                                                onPress={() => this.props.navigation.navigate('AffiliateSchemeTypeMappingDetailScreen', { item })}
                                            ></AffiliateSchemeTypeMappingItem>
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
                                    <ListEmptyComponent module={R.strings.addAffiliateSchemeTypeMapping} onPress={() => this.props.navigation.navigate('AffiliateSchemeTypeMappingAddEditScreen', { edit: false, onSuccess: this.onSuccessAddEdit })} />
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
class AffiliateSchemeTypeMappingItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let props = this.props;
        let item = this.props.item;
        let size = props.size;
        let index = props.index;
        let delIcon = R.images.IC_DELETE
        let icon = R.images.IC_CHECKMARK
        let color = R.colors.failRed
        let statusTextColor = R.colors.successGreen
        let delColor = R.colors.failRed
        let statusText = ''

        //if status is inactive=0 than set icons and colors
        if (item.Status == 0) {

            statusText = R.strings.inActive
            statusTextColor = R.colors.yellow

            color = R.colors.successGreen
        }

        //if status is active=1 than set icons and colors
        else if (item.Status == 1) {
  
            color = R.colors.yellow
            icon = R.images.IC_CANCEL
 
            statusText = R.strings.active
        }

        //if status is Delete=9 than set icons and colors
        else if (item.Status == 9) {
            color = R.colors.successGreen 

            delColor = R.colors.yellow
            delIcon = R.images.IC_CANCEL

            statusTextColor = R.colors.failRed
            statusText = R.strings.Delete
        }

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    flex: 1,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginLeft: R.dimens.widget_left_right_margin,
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        borderTopRightRadius: R.dimens.margin,
                        borderBottomLeftRadius: R.dimens.margin,
                    }} onPress={this.props.onPress}>

                        <View style={{ flexDirection: 'row' }}>
                            {/* for show coin image */}
                            <View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                                <ImageViewWidget url={item.DepositWalletTypeName ? item.DepositWalletTypeName : ''} width={R.dimens.SignUpButtonHeight} height={R.dimens.SignUpButtonHeight} />
                            </View>

                            {/* for show Scheme, SchemeType, and Description*/}
                            <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, justifyContent: 'center' }}>
                                <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <Text style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, }}>{item.SchemeName ? item.SchemeName : '-'}</Text>
                                    <ImageTextButton
                                        icon={R.images.RIGHT_ARROW_DOUBLE}
                                        onPress={this.props.onPress}
                                        style={{ margin: 0 }}
                                        iconStyle={{
                                            width: R.dimens.dashboardMenuIcon,
                                            height: R.dimens.dashboardMenuIcon,
                                            tintColor: R.colors.textPrimary
                                        }}
                                    />
                                </View>

                                <View style={{ flex: 1, }}>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.schemeType + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.SchemeTypeName ? item.SchemeTypeName : '-'}</TextViewHML>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.description + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.Description ? item.Description : '-'}</TextViewHML>
                                    </View>
                                </View>
                            </View>

                        </View>

                        {/* for show status and button for edit,status,delete */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, }}>
                            <StatusChip
                                color={statusTextColor}
                                value={statusText}></StatusChip>
                            <View>

                                <View style={{ flexDirection: 'row' }}>
                                    <ImageTextButton
                                        style={
                                            {
                                                padding: R.dimens.CardViewElivation,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: R.colors.accent,
                                                borderRadius: R.dimens.titleIconHeightWidth,
                                                margin: 0,
                                                marginRight: R.dimens.widgetMargin,
                                            }}
                                        icon={R.images.IC_EDIT}
                                        iconStyle={{ height: R.dimens.titleIconHeightWidth, width: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                        onPress={this.props.onEdit} />

                                    <ImageTextButton
                                        style={
                                            {
                                                margin: 0,
                                                justifyContent: 'center',
                                                backgroundColor: color,
                                                borderRadius: R.dimens.titleIconHeightWidth,
                                                padding: R.dimens.CardViewElivation,
                                                marginRight: R.dimens.widgetMargin,
                                                alignItems: 'center',
                                            }}
                                        icon={icon}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                        onPress={this.props.onStatusChange} />

                                    <ImageTextButton
                                        icon={delIcon}
                                        style={
                                            {
                                                alignItems: 'center',
                                                padding: R.dimens.CardViewElivation,
                                                backgroundColor: delColor,
                                                borderRadius: R.dimens.titleIconHeightWidth,
                                                margin: 0,
                                                justifyContent: 'center',
                                            }}
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
        //Updated Data of Scheme Mapping List
        isSchemeTypeMappingList: state.AffiliateSchemeTypeMappingReducer.isSchemeTypeMappingList,
        schemeTypeMappingList: state.AffiliateSchemeTypeMappingReducer.schemeTypeMappingList,
        schemeTypeMappingListFetch: state.AffiliateSchemeTypeMappingReducer.schemeTypeMappingListFetch,

        //Updated Data of Scheme Mapping Status
        isChangeMappingStatus: state.AffiliateSchemeTypeMappingReducer.isChangeMappingStatus,
        changeMappingStatus: state.AffiliateSchemeTypeMappingReducer.changeMappingStatus,
        changeMappingStatusFetch: state.AffiliateSchemeTypeMappingReducer.changeMappingStatusFetch,

    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Action for SchemeTypeList
        listAffiliateSchemeTypeMappingData: (request) => dispatch(listAffiliateSchemeTypeMappingData(request)),
        //Perform Action for Change status 
        changeAffiliateSchemeTypeMappingStatus: (request) => dispatch(changeAffiliateSchemeTypeMappingStatus(request)),
        //clear Reducer data
        affiliateSchemeMappingDataClear: () => dispatch(affiliateSchemeMappingDataClear()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(AffiliateSchemeTypeMappingScreen);