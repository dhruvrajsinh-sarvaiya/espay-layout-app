import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Image, Text } from 'react-native';
import { connect } from 'react-redux';
import { getCoinlist, clearCoinlist } from '../../actions/CMS/CoinlistActions'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import { changeTheme, convertDateTime, } from '../../controllers/CommonUtils';
import ListLoader from '../../native_theme/components/ListLoader';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import { isCurrentScreen } from '../Navigation';
import { ListEmptyComponent, contentContainerStyle } from '../../native_theme/components/FlatListWidgets';
import R from '../../native_theme/R';
import ImageViewWidget from '../Widget/ImageViewWidget';
import CardView from '../../native_theme/components/CardView';
import StatusChip from '../Widget/StatusChip';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';
import { Fonts } from '../../controllers/Constants';

class ListCoinScreen extends Component {

    constructor(props) {
        super(props);

        // Define All State initial state
        this.state = {
            refreshing: false,
            response: [],
            isFirstTime: true,
            searchInput: '',
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // for check internet connection
        if (await isInternet()) {

            //fetching list of coin
            this.props.getCoinlist();
        }
    }

    componentWillUnmount() {
        // call action for clear Reducer value
        this.props.clearCoinlist()
    }

    shouldComponentUpdate(nextProps, _nextState) {
        return isCurrentScreen(nextProps)
    }

    //redirect to details screen of coin
    onItemPress = (item) => {

        //redirect to coin info screen as with data
        this.props.navigation.navigate('CoinInfo', { DATA: item });
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Fetching list of coin
            this.props.getCoinlist();
        }
        else {
            this.setState({ refreshing: false });
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
        if (ListCoinScreen.oldProps !== props) {
            ListCoinScreen.oldProps = props;
        } else {
            return null;
        }

        //check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated fields of Particular actions
            var { loading, data } = props.dataListCoin;

            if (!loading) {

                // this condition execute either one time for getting data than check if data is same than not execute othrewise execute this condition
                if (state.data == null || (state.data != null && data !== state.data)) {
                    try {
                        if (validateResponseNew({ response: data, isList: true })) {

                            //handle success response
                            return { ...state, refreshing: false, response: data.Response };
                        }
                        else {
                            return { ...state, refreshing: false, response: [] };
                        }
                    } catch (e) {
                        return { ...state, refreshing: false, response: [] };
                    }
                }
            }
        }
        return null;
    }

    render() {

        //fetch loading bit for progressbar handling
        let { loading } = this.props.dataListCoin;

        //for final items from search input (validate on SMSCode, Name, StatusText, CirculatingSupply, IssuePrice)
        //default searchInput is empty so it will display all records.
        let finalItems = this.state.response.filter(item =>
            ((item.SMSCode.toLowerCase()).includes(this.state.searchInput.toLowerCase())
                || item.Name.toLowerCase().includes(this.state.searchInput.toLowerCase())
                || item.StatusText.toLowerCase().includes(this.state.searchInput.toLowerCase())
                || ('' + item.CirculatingSupply).includes(this.state.searchInput)
                || ('' + item.IssuePrice).includes(this.state.searchInput)
            ));

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }} >
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.coin_info}
                    isBack={true}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })}
                    nav={this.props.navigation}
                />
                {
                    (loading && !this.state.refreshing) ?
                        <ListLoader /> :
                        finalItems.length ?
                            <View style={{ flex: 1 }}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={finalItems}
                                    renderItem={({ item, index }) => <ListCoinItem
                                        id={item.ServiceId}
                                        image={item.ImageUrl}
                                        SMSCode={item.SMSCode}
                                        Name={item.Name}
                                        IssueDate={item.IssueDate}
                                        CirculatingSupply={item.CirculatingSupply}
                                        WebsiteUrl={item.WebsiteUrl}
                                        item={item}
                                        index={index}
                                        size={this.state.response.length}
                                        onPress={() => this.onItemPress(item)}
                                    />
                                    }
                                    keyExtractor={item => item.ServiceId.toString()}
                                    contentContainerStyle={contentContainerStyle(finalItems)}
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            progressBackgroundColor={R.colors.background}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                        />
                                    }
                                />
                            </View> : !loading && <ListEmptyComponent response={this.state.response} />
                }
            </SafeView>
        );
    }
}

// for displaying list item
class ListCoinItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {

        // Get required fields from props
        let { index, size, item } = this.props;

        let stColor = R.colors.accent

        // Check apply color as per status of coin
        if (item.Status === 1) {
            stColor = R.colors.successGreen
        }
        else {
            stColor = R.colors.sellerPink
        }

        return (
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
                }} onPress={this.props.onPress}>

                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}  >

                            <View style={{ flexDirection: 'row' }}>

                                <View>
                                    <ImageViewWidget url={item.SMSCode ? item.SMSCode : ''} width={R.dimens.LARGE_MENU_ICON_SIZE} height={R.dimens.LARGE_MENU_ICON_SIZE} />
                                </View>

                                <View style={{ marginLeft: R.dimens.widgetMargin }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{item.SMSCode ? item.SMSCode : '-'} </Text>
                                        <Text style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{item.Name ? '- ' + item.Name : '-'}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.cir_Supply + " :"} </TextViewHML>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.CirculatingSupply ? item.CirculatingSupply : '-'}</TextViewHML>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.issue_price + " :"} </TextViewHML>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.IssuePrice ? item.IssuePrice : '-'}</TextViewHML>
                                    </View>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    source={R.images.RIGHT_ARROW_DOUBLE}
                                    style={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
                                />
                            </View>
                        </View>

                        <View style={{ marginTop: R.dimens.widgetMargin, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                                <StatusChip
                                    color={stColor}
                                    value={item.StatusText}></StatusChip>
                            </View>
                            <ImageTextButton
                                style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                icon={R.images.IC_TIMER}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{item.IssueDate ? convertDateTime(item.IssueDate) : '-'}</TextViewHML>
                        </View>
                    </View>
                </CardView>
            </View>
        )
    };
}

function mapStateToProps(state) {
    return {
        // Updated state for Coin List
        dataListCoin: state.CoinlistReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // To perform action for Coin List
    getCoinlist: () => dispatch(getCoinlist()),
    // To perform action for Clear Coin List
    clearCoinlist: () => dispatch(clearCoinlist()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListCoinScreen);
