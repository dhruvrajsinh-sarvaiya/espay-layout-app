import React, { Component } from 'react';
import {
    View,
    FlatList,
    RefreshControl,
    Text,
    ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { changeTheme, parseArray, addPages, convertDateTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { ListEmptyComponent, contentContainerStyle } from '../../../native_theme/components/FlatListWidgets';
import ListLoader from '../../../native_theme/components/ListLoader';
import R from '../../../native_theme/R';
import { isCurrentScreen } from '../../Navigation';
import PaginationWidget from '../../widget/PaginationWidget';
import { ipHistoryBoList } from '../../../actions/account/IpHistoryAction';
import { AppConfig } from '../../../controllers/AppConfig';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import CardView from '../../../native_theme/components/CardView';
import SafeView from '../../../native_theme/components/SafeView';

class IpHistoryScreen extends Component {

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

        //initial request
        this.Request = {
            PageIndex: 0,
            PAGE_SIZE: AppConfig.pageSize,
        }

    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
        //Check NetWork is Available or not
        if (await isInternet()) {
            //Call Get Ip History from API
            this.props.ipHistoryBoList(this.Request);
            //----------
        }
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });
        //Check NetWork is Available or not
        if (await isInternet()) {
            this.Request = {
                PageIndex: this.state.selectedPage - 1,
                PAGE_SIZE: this.state.PAGE_SIZE,
            }
            //Call Get Ip History from API
            this.props.ipHistoryBoList(this.Request);
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    /* this method is called when page change and also api call */
    onPageChange = async (pageNo) => {
        if (this.state.selectedPage !== pageNo) {
            this.setState({ selectedPage: pageNo });

            //Check NetWork is Available or not
            if (await isInternet()) {
                this.Request = {
                    PageIndex: pageNo - 1,
                    PAGE_SIZE: this.state.PAGE_SIZE
                }
                //Call Get Ip History from API
                this.props.ipHistoryBoList(this.Request)
            }
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
        if (IpHistoryScreen.oldProps !== props) {
            IpHistoryScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { IpHistoryFetchData, IpHistorydata } = props;
            //To Check Ip History Data Fetch or Not

            if (!IpHistoryFetchData) {
                try {
                    if (validateResponseNew({ response: IpHistorydata, isList: true })) {
                        return {
                            ...state,
                            response: parseArray(IpHistorydata.IpHistoryList),
                            refreshing: false,
                            row: addPages(IpHistorydata.Totalcount)
                        }
                    } else {
                        return {
                            ...state,
                            refreshing: false,
                            response: [],
                            row: []
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        refreshing: false,
                        response: [],
                        row: []
                    }
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }
        }
        return null;
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { IpIsFetching } = this.props;
        //----------

        let finalItems = this.state.response

        //for search 
        if (finalItems.length > 0) {
            finalItems = finalItems.filter(item => item.IpAddress.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.Date.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.Location.toLowerCase().includes(this.state.searchInput.toLowerCase()));
        }

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={R.strings.Ip_History}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })}
                />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {/* To Check Response fetch or not if IpIsFetching = true then display progress bar else display List*/}
                    {
                        (IpIsFetching && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>

                                {finalItems.length > 0 ?

                                    <ScrollView showsVerticalScrollIndicator={false}
                                        refreshControl={
                                            <RefreshControl
                                                colors={[R.colors.accent]}
                                                progressBackgroundColor={R.colors.background}
                                                refreshing={this.state.refreshing}
                                                onRefresh={this.onRefresh}
                                            />
                                        }
                                    >
                                        <View style={{ flex: 1 }}>
                                            <CardView style={{
                                                flex: 1,
                                                elevation: R.dimens.listCardElevation,
                                                borderRadius: R.dimens.detailCardRadius,
                                                flexDirection: 'column',
                                                margin: R.dimens.WidgetPadding,
                                                padding: 0,
                                            }}>
                                                <FlatList
                                                    data={finalItems}
                                                    showsVerticalScrollIndicator={false}
                                                    /* render all item in list */
                                                    renderItem={({ item, index }) =>
                                                        <IpHistoryItem item={item}
                                                            index={index}
                                                            size={this.state.response.length}
                                                            finalItemsLength={finalItems.length}
                                                        />}
                                                    /* assign index as key valye to Ip History list item */
                                                    keyExtractor={(item, index) => index.toString()}
                                                    contentContainerStyle={contentContainerStyle(finalItems)}
                                                />
                                            </CardView>
                                        </View>
                                    </ScrollView>
                                    : <ListEmptyComponent />
                                }
                            </View>
                    }
                    <View>
                        {/* To Set Pagination View */}
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
class IpHistoryItem extends React.PureComponent {
    render() {
        let { index, size, item } = this.props;

        return (
            <View style={{ flexDirection: 'row', marginLeft: R.dimens.WidgetPadding, marginRight: R.dimens.WidgetPadding, marginTop: index === 0 ? R.dimens.WidgetPadding : 0, marginBottom: (index === size - 1) ? R.dimens.WidgetPadding : 0, }}>

                <View style={{ width: '10%', justifyContent: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                    <View style={{ flex: 1, alignItems: 'center', alignContent: 'center', marginTop: R.dimens.CardViewElivation }}>
                        <View style={{
                            width: R.dimens.SMALLEST_ICON_SIZE,
                            height: R.dimens.SMALLEST_ICON_SIZE,
                            backgroundColor: R.colors.accent,
                            borderColor: R.colors.textPrimary,
                            borderRadius: R.dimens.LoginButtonBorderRadius,
                        }} />
                        {this.props.finalItemsLength !== 1 &&
                            <View style={{
                                flex: 1,
                                width: R.dimens.normalizePixels(1),
                                backgroundColor: R.colors.textPrimary,
                            }} />
                        }
                    </View>
                </View>

                <View style={{ width: '60%', marginBottom: R.dimens.WidgetPadding, }}>
                    <Text style={{ fontFamily: Fonts.MontserratSemiBold, fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{item.IpAddress}</Text>
                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{convertDateTime(item.Date)}</TextViewHML>
                </View>

                <View style={{ width: '30%', alignContent: 'flex-end', alignItems: 'flex-end' }}>
                    <TextViewMR style={{
                        color: R.colors.textSecondary,
                        fontSize: R.dimens.smallestText
                    }}>{item.Location}</TextViewMR>
                </View>
            </View>
        )
    };
}

function mapStateToProps(state) {
    return {
        //Updated Data For Ip History
        IpHistoryFetchData: state.IpHistoryReducer.IpHistoryFetchData,
        IpIsFetching: state.IpHistoryReducer.IpIsFetching,
        IpHistorydata: state.IpHistoryReducer.IpHistorydata,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Ip history 
        ipHistoryBoList: (request) => dispatch(ipHistoryBoList(request)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IpHistoryScreen)


