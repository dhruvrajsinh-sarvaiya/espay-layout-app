import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import { connect } from 'react-redux';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, addPages } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import R from '../../../native_theme/R';
import { AppConfig } from '../../../controllers/AppConfig';
import CardView from '../../../native_theme/components/CardView';
import PaginationWidget from '../../widget/PaginationWidget';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { Fonts } from '../../../controllers/Constants';
import StatusChip from '../../widget/StatusChip';
import { clearAffiliatePromotion, changeStatusAffiliatePromotion, getAffiliatePromotionList } from '../../../actions/account/AffiliatePromotionAction';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class AffliatePromotionListScreen extends Component {
    constructor(props) {
        super(props);

        //Define initial state
        this.state = {
            response: [],
            searchInput: '',
            selectedPage: 1,
            ruleFieldListData: null,
            PageSize: AppConfig.pageSize,
            row: [],
            changedStatus: null,
            statusId: null,
            list: null,
            refreshing: false,
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

            //call affliate Promotion list Api 
            this.props.getAffiliatePromotionList(this.Request)
        }
    }

    shouldComponentUpdate = (nextProps) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
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

            //call affliate Promotion list Api 
            this.props.getAffiliatePromotionList(this.Request)
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

            //call affliate Promotion list Api 
            this.props.getAffiliatePromotionList(this.Request)
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
        if (AffliatePromotionListScreen.oldProps !== props) {
            AffliatePromotionListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated data of Particular actions
            const { list, chngStsData } = props.Listdata;

            if (list) {
                try {
                    if (state.list == null || (state.list != null && list !== state.list)) {
                        if (validateResponseNew({ response: list, isList: true, })) {
                            //Set State For Api response 
                            let res = parseArray(list.Data);
                            return {
                                ...state,
                                list, response: res, refreshing: false,
                                row: addPages(list.TotalCount)
                            }
                        } else {
                            //Set State For Api response 
                            return {
                                ...state,
                                list, response: [], refreshing: false, row: []
                            }
                        }
                    }
                } catch (e) {
                    //Set State For Api response 
                    return {
                        ...state,
                        response: [], refreshing: false, row: []
                    }
                }
            }

            //Check enable status Response 
            if (chngStsData) {
                try {
                    //Get Api response
                    if (validateResponseNew({ response: chngStsData, isList: true })) {
                        let res = state.response;
                        let findIndexOfChangeID = state.statusId == null ? -1 : res.findIndex(el => el.PromotionId === state.statusId);

                        //if index is >-1 then record is found
                        if (findIndexOfChangeID > -1) {
                            res[findIndexOfChangeID].Status = state.changedStatus;
                        }

                        props.clearAffiliatePromotion();
                        return {
                            ...state,
                            response: res, statusId: null, changedStatus: null
                        }
                    }
                    else {
                        props.clearAffiliatePromotion();
                    }

                } catch (e) {
                    props.clearAffiliatePromotion();
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

                //call affliate Promotion list Api 
                this.props.getAffiliatePromotionList(this.Request)
            }
        }
    }

    onUpdateStatus = async (item, isDelete) => {

        let status
        //if status is inactive=0 than set status call for active 
        if (item.Status == 0) {
            //if status is inactive=0 and delete than call for delete
            if (isDelete) status = 9
            else status = 1

        }

        //if status is active=1 than set status call for inactive 
        else if (item.Status == 1) {
            //if status is active=0 and delete than call for delete
            if (isDelete) status = 9
            else status = 0

        }

        //if status is delete=9 than set status call for inactive 
        else if (item.Status == 9) {
            if (isDelete) status = 0
            else status = 1

        }

        if (await isInternet()) {
            this.request = {
                PromotionId: item.PromotionId,
                Status: status
            }

            //set the id of change the status and status
            this.setState({ statusId: item.PromotionId, changedStatus: status })

            //Call change status api
            this.props.changeStatusAffiliatePromotion(this.request);
        }
    }

    render() {
        const { listLoading, changeStatusLoading } = this.props.Listdata;

        let finalItems = this.state.response;
        if (finalItems.length > 0) {
            finalItems = this.state.response.filter(item =>
                item.PromotionType.toLowerCase().includes(this.state.searchInput.toLowerCase())
            )
        }

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.listAffliatePromotion}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ searchInput: input })}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => {
                        this.props.navigation.navigate('AffiliatePromotionAddEditScreen', { edit: false, onSuccess: this.onSuccessAddEdit })
                    }}
                />

                <ProgressDialog isShow={changeStatusLoading} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    {
                        (listLoading && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>
                                {finalItems.length ?
                                    <FlatList
                                        data={finalItems}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item, index }) => <AffliatePromotionListItem
                                            item={item}
                                            size={this.state.response.length}
                                            index={index}
                                            onStatusChange={() => this.onUpdateStatus(item, false)}
                                            onDeleteStatusChange={() => this.onUpdateStatus(item, true)}
                                            onEdit={() => {
                                                this.props.navigation.navigate('AffiliatePromotionAddEditScreen', { item: item, edit: true, onSuccess: this.onSuccessAddEdit })
                                            }
                                            }
                                        />}
                                        keyExtractor={(item, index) => index.toString()}
                                        contentContainerStyle={contentContainerStyle(finalItems)}
                                        /* For Refresh Functionality In Withdrawal FlatList Item */
                                        refreshControl={
                                            <RefreshControl
                                                colors={[R.colors.accent]}
                                                refreshing={this.state.refreshing}
                                                progressBackgroundColor={R.colors.background}
                                                onRefresh={this.onRefresh}
                                            />
                                        }
                                    />
                                    :
                                    <ListEmptyComponent module={R.strings.addAffliateScheme} onPress={() => this.props.navigation.navigate('AffiliatePromotionAddEditScreen', { edit: false, onSuccess: this.onSuccessAddEdit })} />
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
class AffliatePromotionListItem extends Component {
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
        let { item, size, index } = this.props;
        let color = R.colors.failRed
        let statusTextColor = R.colors.successGreen
        let delColor = R.colors.failRed
        let delIcon = R.images.IC_DELETE
        let statusText = ''
        let icon = R.images.IC_CHECKMARK

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
            icon = R.images.IC_CANCEL
            color = R.colors.yellow
            delIcon = R.images.IC_DELETE
            delColor = R.colors.failRed
            statusText = R.strings.active
            statusTextColor = R.colors.successGreen
        }

        //if status is Delete=9 than set icons and colors
        else if (item.Status == 9) {
            statusText = R.strings.Delete
            statusTextColor = R.colors.failRed
            icon = R.images.IC_CHECKMARK
            color = R.colors.successGreen
            delIcon = R.images.IC_CANCEL
            delColor = R.colors.yellow
        }

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderRadius: 0,
                        borderTopRightRadius: R.dimens.margin,
                    }}>

                        <View style={{ flexDirection: 'row' }}>

                            {/* image icon */}
                            <View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                                <ImageTextButton
                                    icon={R.images.IC_COPY}
                                    style={{ margin: 0, padding: 0, justifyContent: 'center', alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                                />
                            </View>

                            {/* for show PromotionType  */}
                            <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, }}>
                                <Text style={{
                                    fontSize: R.dimens.smallText, color: R.colors.textPrimary,
                                    fontFamily: Fonts.MontserratSemiBold,
                                }}>{item.PromotionType ? item.PromotionType : '-'}</Text>
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
                                        style={[this.styles().imgButtonStyle, { backgroundColor: R.colors.accent, marginRight: R.dimens.widgetMargin, }]}
                                        icon={R.images.IC_EDIT}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                        onPress={this.props.onEdit} />

                                    <ImageTextButton
                                        style={[this.styles().imgButtonStyle, {
                                            backgroundColor: color,
                                            marginRight: R.dimens.widgetMargin,
                                        }]}
                                        icon={icon}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                        onPress={this.props.onStatusChange} />

                                    <ImageTextButton
                                        style={[this.styles().imgButtonStyle, {
                                            backgroundColor: delColor,
                                            padding: R.dimens.CardViewElivation
                                        }]}
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

    styles = () => {
        return {
            imgButtonStyle: {
                justifyContent: 'center',
                alignItems: 'center',
                margin: 0,
                padding: R.dimens.CardViewElivation,
                borderRadius: R.dimens.titleIconHeightWidth,
            }
        }
    }
}

function mapStatToProps(state) {
    return {
        //Updated AffiliatePromotionReducer Data 
        Listdata: state.AffiliatePromotionReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getAffiliatePromotionList action
        getAffiliatePromotionList: (request) => dispatch(getAffiliatePromotionList(request)),
        //Perform changeStatusAffiliatePromotion action
        changeStatusAffiliatePromotion: (request) => dispatch(changeStatusAffiliatePromotion(request)),
        //Perform clearAffiliatePromotion action
        clearAffiliatePromotion: (request) => dispatch(clearAffiliatePromotion(request)),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(AffliatePromotionListScreen);


