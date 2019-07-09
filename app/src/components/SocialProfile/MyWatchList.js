import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen } from '../Navigation';
import { changeTheme, parseArray, addPages } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, } from '../../validations/CommonValidation';
import { ListEmptyComponent, contentContainerStyle } from '../../native_theme/components/FlatListWidgets';
import ListLoader from '../../native_theme/components/ListLoader';
import { getLeaderWatchlist as getLeaderWatchlistAPI } from '../../actions/SocialProfile/SocialProfileActions';
import PaginationWidget from '../Widget/PaginationWidget';
import { AppConfig } from '../../controllers/AppConfig';
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

class MyWatchList extends Component {

    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            row: [],
            response: [],
            searchInput: '',
            refreshing: false,
            PageSize: AppConfig.pageSize,
            selectedPage: 1,
            totalCount: 0,
            getLeaderWatchlist: null,
            GroupId: 0,
            isFirstTime: true,
        };

        //To Bind All Method
        this.onPageChange = this.onPageChange.bind(this);
        this.onRefresh = this.onRefresh.bind(this);

        //initial Request
        this.Request = {
            PageIndex: 1,
            Page_Size: this.state.PageSize,
            GroupId: this.state.GroupId
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
        //Check NetWork is Available or not
        if (await isInternet()) {
            //Call Get My Watcher from API
            this.props.getLeaderWatchlist(this.Request);
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
        if (MyWatchList.oldProps !== props) {
            MyWatchList.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { getLeaderWatchlist } = props.Listdata;

            //To Check  Data Fetch or Not
            if (getLeaderWatchlist) {
                try {
                    if (state.getLeaderWatchlist == null || (state.getLeaderWatchlist != null && getLeaderWatchlist !== state.getLeaderWatchlist)) {
                        if (validateResponseNew({ response: getLeaderWatchlist, isList: true })) {
                            return Object.assign({}, state, {
                                getLeaderWatchlist,
                                response: parseArray(getLeaderWatchlist.WatcherList),
                                refreshing: false,
                                row: addPages(getLeaderWatchlist.TotalCount)
                            })
                        } else {
                            return Object.assign({}, state, {
                                getLeaderWatchlist: null,
                                refreshing: false,
                                response: [],
                                row: []
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        getLeaderWatchlist: null,
                        refreshing: false,
                        response: [],
                        row: []
                    })
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }
        }
        return null
    }

    //For Swipe to referesh Functionality
    async onRefresh() {
        this.setState({ refreshing: true });
        //Check NetWork is Available or not
        if (await isInternet()) {
            //bind Request My Watch List
            this.Request = {
                ...this.Request,
                PageIndex: this.state.selectedPage,
            }
            //Call Get My Watcher from APIs
            this.props.getLeaderWatchlist(this.Request);
        } else {
            this.setState({ refreshing: false });
        }
    }

    shouldComponentUpdate(nextProps, _nextState) {
        /* stop twice api call  */
        return isCurrentScreen(nextProps);
    };

    // Pagination Method Called When User Change Page  
    async onPageChange(pageNo) {
        //if user select other page number then and only then API Call else no need to call API
        if ((pageNo) !== (this.state.selectedPage)) {
            this.setState({ selectedPage: pageNo });
            if (await isInternet()) {
                //bind Request My Watch List
                this.Request = {
                    ...this.Request,
                    PageIndex: pageNo,
                }
                this.props.getLeaderWatchlist(this.Request)
            } else {
                this.setState({ refreshing: false });
            }
        }
    }

    render() {
        //Get is Fetching value For All APIs to handle Progress bar in All Activity 
        const { leaderWatcherLoading } = this.props.Listdata;

        //for final items from search input (validate on LeaderName and GroupName)
        //default searchInput is empty so it will display all records.
        let finalItems = this.state.response
        if (finalItems.length > 0) {
            finalItems = finalItems.filter(item =>
                (item.LeaderName.toLowerCase().includes(this.state.searchInput.toLowerCase())) ||
                (item.GroupName.toLowerCase().includes(this.state.searchInput.toLowerCase()))
            )
        }

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.myWatchList}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })}
                />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    {/* List Items */}
                    {/* To Check Response fetch or not if leaderWatcherLoading = true then display progress bar else display List*/}
                    {
                        (leaderWatcherLoading && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>
                                {finalItems.length ?
                                    <View style={{ flex: 1 }}>
                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            data={finalItems}
                                            /* render all item in list */
                                            renderItem={({ item, index }) =>
                                                <FlatListItem item={item}
                                                    index={index}
                                                    size={finalItems.length}
                                                    viewMore={() => this.props.navigation.navigate('xyzScreen', { LeaderId: item.LeaderId })}
                                                />
                                            }
                                            /* assign index as key value to list item */
                                            keyExtractor={(item, index) => index.toString()}
                                            contentContainerStyle={contentContainerStyle(finalItems)}
                                            ListEmptyComponent={<ListEmptyComponent />}
                                            /* For Refresh Functionality In FlatList Item */
                                            refreshControl={
                                                <RefreshControl
                                                    colors={[R.colors.accent]}
                                                    progressBackgroundColor={R.colors.background}
                                                    refreshing={this.state.refreshing}
                                                    onRefresh={this.onRefresh}
                                                />
                                            }
                                        />
                                    </View> : <ListEmptyComponent />}
                            </View>
                    }
                    {/*To Set Pagination View  */}
                    <View>
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
class FlatListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item === nextProps.item &&
            this.props.isContainInMainScreen === nextProps.isContainInMainScreen) {
            return false
        }
        return true
    }

    render() {
        let { index, size } = this.props;
        let item = this.props.item;
        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        flexDirection: 'column',
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: wp('10%'), justifyContent: 'center', alignItems: 'flex-start' }}>
                                <ImageTextButton
                                    icon={R.images.IC_OUTLINE_USER}
                                    style={{ justifyContent: 'center', alignSelf: 'center', width: R.dimens.activity_margin, height: R.dimens.activity_margin, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    iconStyle={{ width: R.dimens.text_left_right_margin, height: R.dimens.text_left_right_margin, tintColor: R.colors.white }}
                                />
                            </View>
                            <View style={{ paddingLeft: R.dimens.widgetMargin, width: wp('90%'), justifyContent: 'center' }}>
                                <Text style={{ fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, color: R.colors.textPrimary, }}>{item.LeaderName ? item.LeaderName : '-'}</Text>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{item.GroupName ? item.GroupName : '-'}</TextViewHML>
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
        //For Update isPortrait true or false
        preference: state.preference.dimensions.isPortrait,
        //Updated Data For leader watch list Action
        Listdata: state.SocialProfileReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //get My Watcher list
        getLeaderWatchlist: (Request) => dispatch(getLeaderWatchlistAPI(Request)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyWatchList)

