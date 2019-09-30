import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    RefreshControl,
    ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { changeTheme, parseArray, addPages, convertDateTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import Separator from '../../../native_theme/components/Separator';
import { ListEmptyComponent, contentContainerStyle } from '../../../native_theme/components/FlatListWidgets';
import ListLoader from '../../../native_theme/components/ListLoader';
import R from '../../../native_theme/R';
import { isCurrentScreen } from '../../Navigation';
import PaginationWidget from '../../widget/PaginationWidget';
import { getLoginHistoryListBo, clearLoginHistory } from '../../../actions/account/LoginHistoryBoAction';
import { AppConfig } from '../../../controllers/AppConfig';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { Fonts } from '../../../controllers/Constants';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import SafeView from '../../../native_theme/components/SafeView';

class LoginHistoryScreen extends Component {

    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            row: [],
            selectedPage: 1,
            response: [],
            searchInput: '',
            refreshing: false,
            PAGE_SIZE: AppConfig.pageSize,
            isFirstTime: true,
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
        //Check NetWork is Available or not
        if (await isInternet()) {
            //Bind Login History Api Object Bit
            const LoginHistoryReqObj = this.state.selectedPage - 1 + '/' + this.state.PAGE_SIZE;
            //Call Get Login History from API
            this.props.getLoginHistoryListBo(LoginHistoryReqObj);
            //----------
        }
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {
            //Bind Login History Api Object Bit
            const LoginHistoryReqObj = this.state.selectedPage - 1 + '/' + this.state.PAGE_SIZE;
            //Call Get Login History from API
            this.props.getLoginHistoryListBo(LoginHistoryReqObj);
            //----------

        } else {
            this.setState({ refreshing: false });
        }
    }

    /* this method is called when page change and also api call */
    onPageChange = async (pageNo) => {
        if (this.state.selectedPage !== pageNo) {
            this.setState({ selectedPage: pageNo });

            //Check NetWork is Available or not
            if (await isInternet()) {
                const LoginHistoryReqObj = pageNo - 1 + '/' + this.state.PAGE_SIZE;
                /* Called Domain List Api */
                this.props.getLoginHistoryListBo(LoginHistoryReqObj)
            }
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

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
        if (LoginHistoryScreen.oldProps !== props) {
            LoginHistoryScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { LoginHistorydata } = props;
            //To Check Ip History Data Fetch or Not

            //To Check Login History Data Fetch or Not
            if (LoginHistorydata) {
                try {

                    //if local LoginHistorydata state is null or its not null and also different then new response then and only then validate response.
                    if (state.LoginHistorydata == null || (state.LoginHistorydata != null && LoginHistorydata !== state.LoginHistorydata)) {
                        if (validateResponseNew({ response: LoginHistorydata, isList: true })) {

                            //Set State For Api response , Selected Item and Refershing Bit
                            return {
                                ...state,
                                LoginHistorydata,
                                response: parseArray(LoginHistorydata.LoginHistoryList),
                                refreshing: false,
                                row: addPages(LoginHistorydata.TotalCount)
                            }
                        }
                        else {
                            return {
                                ...state,
                                LoginHistorydata,
                                refreshing: false,
                                row: [],
                                response: []
                            }
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        refreshing: false,
                        row: [],
                        response: []
                    }
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }
        }
        return null;
    }

    componentWillUnmount() {
        //clear reducer data
        this.props.clearLoginHistory();
    }

    render() {
        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { LoginIsFetching } = this.props;

        let finalItems = this.state.response

        //for search
        if (finalItems.length > 0) {
            finalItems = finalItems.filter(item => item.IpAddress.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.Device.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.Location.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.Date.toLowerCase().includes(this.state.searchInput.toLowerCase()));
        }

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={R.strings.Login_History}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })}
                />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {/* To Check Response fetch or not if LoginIsFetching = true then display progress bar else display List*/}
                    {LoginIsFetching && !this.state.refreshing ?
                        <ListLoader />
                        :
                        <View style={{ flex: 1, }}>
                            {finalItems.length > 0 ?
                                <ScrollView showsVerticalScrollIndicator={false}
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            progressBackgroundColor={R.colors.background}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                        />
                                    }>
                                    <View style={{ flex: 1 }}>
                                        <CardView style={{
                                            flex: 1,
                                            elevation: R.dimens.listCardElevation,
                                            borderRadius: R.dimens.detailCardRadius,
                                            flexDirection: 'column',
                                            margin: R.dimens.WidgetPadding,
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                            paddingRight: 0,
                                        }}>
                                            <FlatList
                                                data={finalItems}
                                                showsVerticalScrollIndicator={false}
                                                /* render all item in list */
                                                renderItem={({ item, }) =>
                                                    <LoginHistoryItem item={item} />
                                                }
                                                /* assign index as key valye to Login History list item */
                                                keyExtractor={(item, index) => index.toString()}
                                                /* for item seprator on Login History list item */
                                                ItemSeparatorComponent={() => <Separator style={{ marginLeft: R.dimens.paginationButtonHeightWidth, marginRight: 0 }} />}
                                                contentContainerStyle={contentContainerStyle(finalItems)}
                                            />
                                        </CardView>
                                    </View>
                                </ScrollView> :
                                <ListEmptyComponent />
                            }
                        </View>
                    }

                    <View>
                        {/*To Set Pagination View  */}
                        {finalItems.length > 0 &&
                            <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
                        }
                    </View>
                </View>
            </SafeView>
        );
    }
}

// This Class is used for display record in list
export class LoginHistoryItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {
        let { item } = this.props;

        let imgBackgroundColor = R.colors.successGreen;
        let icon = R.images.IC_EARTH_NEW;

        //set icon and icon color for device
        if ((item.Device).toLowerCase().includes("android") || (item.Device).toLowerCase().includes("ios") || (item.Device).toLowerCase().includes("iphone os")) {
            icon = R.images.IC_MOBILE
            imgBackgroundColor = R.colors.accent;
        }
        else { 
            imgBackgroundColor = R.colors.successGreen;
        }

        return (
            <View style={{ flex: 1, marginBottom: R.dimens.widget_top_bottom_margin, flexDirection: 'row', justifyContent: 'center' }}>

                <View style={{ width: '10%', justifyContent: 'center' }}>
                    {/* for show icon for device */}
                    <ImageTextButton
                        icon={icon}
                        style={{ justifyContent: 'center', alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, margin: 0, backgroundColor: imgBackgroundColor, borderRadius: R.dimens.ButtonHeight }}
                        iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                    />
                </View>

                <View style={{ width: '90%' }}>
                    <View style={this.styles().simpleItem}>
                        <View style={{ width: '50%' }}>
                            {/* for show IpAddress */}
                            <Text style={[this.styles().simpleText, { fontFamily: Fonts.MontserratSemiBold, fontSize: R.dimens.smallText }]}>
                                {item.IpAddress}</Text>
                        </View>
                        <View style={{ width: '50%', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                            {/* for show Location */}
                            <TextViewMR style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>
                                {item.Location}</TextViewMR>
                        </View>
                    </View>
                    {/* for show Device name */}
                    <TextViewHML style={[this.styles().simpleText, {
                        flex: 1, marginLeft: R.dimens.widget_left_right_margin,
                        marginRight: R.dimens.widget_left_right_margin,
                    }]} >{item.Device}</TextViewHML>
                    {/* for show Date Time */}
                    <TextViewHML style={[this.styles().simpleText, this.styles().simpleItem, {
                        fontSize: R.dimens.smallestText,
                        marginTop: 0, color: R.colors.textSecondary,
                    }]}>{convertDateTime(item.Date)}</TextViewHML>
                </View>
            </View>
        )
    };

    styles = () => {
        return {
            simpleItem: {
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: R.dimens.widget_top_bottom_margin,
                marginLeft: R.dimens.widget_left_right_margin,
                marginRight: R.dimens.widget_left_right_margin,
            },
            simpleText: {
                color: R.colors.textPrimary,
                fontSize: R.dimens.smallestText
            }
        }
    }
}

function mapStateToProps(state) {
    //Updated LoginHistoryBoReducer data
    return {
        LoginIsFetching: state.LoginHistoryBoReducer.LoginIsFetching,
        LoginHistorydata: state.LoginHistoryBoReducer.LoginHistorydata,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Login history 
        getLoginHistoryListBo: (LoginHistoryReqObj) => dispatch(getLoginHistoryListBo(LoginHistoryReqObj)),
        //clear data
        clearLoginHistory: () => dispatch(clearLoginHistory()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginHistoryScreen)

