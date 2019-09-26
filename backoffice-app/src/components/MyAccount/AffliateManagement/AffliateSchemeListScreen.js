import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, addPages } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import R from '../../../native_theme/R';
import { AppConfig } from '../../../controllers/AppConfig';
import CardView from '../../../native_theme/components/CardView';
import PaginationWidget from '../../widget/PaginationWidget';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { changeStatusAffiliateScheme, getAffiliateSchemeList, clearAffiliateScheme } from '../../../actions/account/AffiliateSchemeAction';
import { Fonts } from '../../../controllers/Constants';
import StatusChip from '../../widget/StatusChip';
import SafeView from '../../../native_theme/components/SafeView';
import { connect } from 'react-redux';

class AffliateSchemeListScreen extends Component {
    constructor(props) {
        super(props);

        //Define initial state
        this.state = {
            response: [],
            searchInput: '',
            refreshing: false,
            ruleFieldListData: null,
            PageSize: AppConfig.pageSize,
            selectedPage: 1,
            row: [],
            statusId: null,
            changedStatus: null,
            isFirstTime: true,
            list: null,
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
            this.props.getAffiliateSchemeList(this.Request)
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

            //call affliate Scheme list Api 
            this.props.getAffiliateSchemeList(this.Request)
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
            this.props.getAffiliateSchemeList(this.Request)
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
        if (AffliateSchemeListScreen.oldProps !== props) {
            AffliateSchemeListScreen.oldProps = props;
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
                                list,
                                response: res,
                                refreshing: false,
                                row: addPages(list.TotalCount)
                            }
                        } else {
                            //Set State For Api response 
                            return {
                                ...state,
                                list,
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

            //Check enable status Response 
            if (chngStsData) {
                try {
                    //Get Api response
                    if (validateResponseNew({ response: chngStsData, isList: true })) {
                        let res = state.response;
                        let findIndexOfChangeID = state.statusId == null ? -1 : res.findIndex(el => el.SchemeMasterId === state.statusId);

                        //if index is >-1 then record is found
                        if (findIndexOfChangeID > -1) {
                            res[findIndexOfChangeID].Status = state.changedStatus;
                        }

                        props.clearAffiliateScheme();
                        return {
                            ...state,
                            response: res,
                            statusId: null,
                            changedStatus: null
                        }
                    }
                    else {
                        props.clearAffiliateScheme();
                    }

                } catch (e) {
                    props.clearAffiliateScheme();
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
                this.props.getAffiliateSchemeList(this.Request)
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
            else { status = 0 }
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

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.request = {
                Status: status, SchemeMasterId: item.SchemeMasterId
            }

            this.setState({ statusId: item.SchemeMasterId, changedStatus: status })
            this.props.changeStatusAffiliateScheme(this.request);
        }
    }

    render() {
        let finalItems = this.state.response;
        const { listLoading, changeStatusLoading } = this.props.Listdata;

        //for search
        if (finalItems.length > 0) {
            finalItems = this.state.response.filter(item =>
                item.SchemeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.SchemeType.toLowerCase().includes(this.state.searchInput.toLowerCase())
            )
        }

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* statusbar and actionbar  */}
                <CommonStatusBar />
                <CustomToolbar
                    title={R.strings.listAffliateScheme}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ searchInput: input })}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => {
                        this.props.navigation.navigate('AffiliateSchemeAddEditScreen', { edit: false, onSuccess: this.onSuccessAddEdit })
                    }}
                />

                {/* ProgressDialog */}
                <ProgressDialog isShow={changeStatusLoading} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    {
                        (listLoading && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>
                                {finalItems.length ?
                                    <View style={{ flex: 1 }}>
                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            data={finalItems}
                                            renderItem={({ item, index }) => <AffliateSchemeListItem
                                                item={item}
                                                index={index}
                                                size={this.state.response.length}
                                                onStatusChange={() => this.onUpdateStatus(item, false)}
                                                onDeleteStatusChange={() => this.onUpdateStatus(item, true)}
                                                onEdit={() => {
                                                    this.props.navigation.navigate('AffiliateSchemeAddEditScreen', { item: item, edit: true, onSuccess: this.onSuccessAddEdit })
                                                }
                                                }
                                            ></AffliateSchemeListItem>
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
                                    <ListEmptyComponent
                                        module={R.strings.addAffliateScheme}
                                        onPress={() => this.props.navigation.navigate
                                            ('AffiliateSchemeAddEditScreen', {
                                                edit: false,
                                                onSuccess: this.onSuccessAddEdit
                                            })} />
                                }
                            </View>
                    }
                    <View>
                        {finalItems.length > 0 &&
                            <PaginationWidget
                                row={this.state.row} selectedPage={this.state.selectedPage}
                                onPageChange={(item) => { this.onPageChange(item) }} />
                        }
                    </View>
                </View>

            </SafeView>
        )
    }
}

// This Class is used for display record in list
class AffliateSchemeListItem extends Component {
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
        let item = this.props.item; let props = this.props;
        let size = props.size;
        let index = props.index;
        let icon = R.images.IC_CHECKMARK
        let color = R.colors.failRed; let delIcon = R.images.IC_DELETE
        let delColor = R.colors.failRed
        let statusText = ''
        let statusTextColor = R.colors.successGreen

        //if status is inactive=0 than set icons and colors
        if (item.Status == 0) {
            icon = R.images.IC_CHECKMARK
            color = R.colors.successGreen

            delColor = R.colors.failRed
            delIcon = R.images.IC_DELETE

            statusTextColor = R.colors.yellow
            statusText = R.strings.inActive
        }

        //if status is active=1 than set icons and colors
        else if (item.Status == 1) {

            statusTextColor = R.colors.successGreen
            statusText = R.strings.active

            delColor = R.colors.failRed
            delIcon = R.images.IC_DELETE

            icon = R.images.IC_CANCEL
            color = R.colors.yellow

        }

        //if status is Delete=9 than set icons and colors
        else if (item.Status == 9) {


            delIcon = R.images.IC_CANCEL
            delColor = R.colors.yellow

            icon = R.images.IC_CHECKMARK
            color = R.colors.successGreen

            statusText = R.strings.Delete
            statusTextColor = R.colors.failRed
        }

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    flex: 1,
                }}>
                    <CardView style={{
                        borderTopRightRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        flex: 1,
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

                            <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, }}>

                                {/* for show SchemeName , SchemeType */}
                                <Text style={{
                                    fontSize: R.dimens.smallText, color: R.colors.textPrimary,
                                    fontFamily: Fonts.MontserratSemiBold,
                                }}>{item.SchemeName ? item.SchemeName : '-'}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>
                                        {R.strings.scheme_type + ': '}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>
                                        {item.SchemeType ? item.SchemeType : '-'}</TextViewHML>
                                </View>
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
                                                marginRight: R.dimens.widgetMargin,
                                                alignItems: 'center',
                                                backgroundColor: R.colors.accent,
                                                borderRadius: R.dimens.titleIconHeightWidth,
                                                margin: 0,
                                                padding: R.dimens.CardViewElivation,
                                                justifyContent: 'center',
                                            }}
                                        icon={R.images.IC_EDIT}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                        onPress={this.props.onEdit} />

                                    <ImageTextButton
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
                                        icon={icon}
                                        onPress={this.props.onStatusChange} />

                                    <ImageTextButton
                                        style={
                                            {
                                                padding: R.dimens.CardViewElivation,
                                                alignItems: 'center',
                                                backgroundColor: delColor,
                                                borderRadius: R.dimens.titleIconHeightWidth,
                                                margin: 0,
                                                justifyContent: 'center',
                                            }}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                        icon={delIcon}
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
        //Updated AffiliateSchemeReducer Data 
        Listdata: state.AffiliateSchemeReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getAffiliateSchemeList action
        getAffiliateSchemeList: (request) => dispatch(getAffiliateSchemeList(request)),
        //Perform changeStatusAffiliateScheme action
        changeStatusAffiliateScheme: (request) => dispatch(changeStatusAffiliateScheme(request)),
        //Perform clearAffiliateScheme action
        clearAffiliateScheme: (request) => dispatch(clearAffiliateScheme(request)),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(AffliateSchemeListScreen);


