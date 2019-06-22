import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Linking, TouchableOpacity, Text } from 'react-native';
import { parseFloatVal, convertDateTime } from '../../controllers/CommonUtils';
import { connect } from 'react-redux';
import { getIncomingTransactionsReport } from '../../actions/Reports/TradeInOutAction'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen } from '../Navigation';
import { changeTheme, parseArray } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../validations/CommonValidation';
import Separator from '../../native_theme/components/Separator';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import ListLoader from '../../native_theme/components/ListLoader';
import R from '../../native_theme/R';
import ImageViewWidget from '../Widget/ImageViewWidget';
import CardView from '../../native_theme/components/CardView';
import StatusChip from '../Widget/StatusChip';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class TransferInHistoryResult extends Component {

    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            response: [],
            searchInput: '',
            refreshing: false,
            isFirstTime: true,
        };

        //To Bind All Method
        this.onRefresh = this.onRefresh.bind(this);
        this.onTrnLinkPress = this.onTrnLinkPress.bind(this);
        //-------
    }

    //This Method Is used to open Address in Browser With Specific Link
    onTrnLinkPress = (item) => {
        try {
            let res = (item.hasOwnProperty('ExplorerLink')) ? JSON.parse(item.ExplorerLink) : '';
            Linking.openURL((res.length) ? res[0].Data + '/' + item.TrnID : item.TrnID);
        } catch (error) {
            //handle catch block here
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call API to get Transfer In History List
            this.props.getIncomingTransactionsReport()
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get Transfer In History API
            this.props.getIncomingTransactionsReport();
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
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
        if (TransferInHistoryResult.oldProps !== props) {
            TransferInHistoryResult.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            let { incomingTransactionsData, incomingfetchdata } = props

            //Check Transfer in Data Fetch or Not
            if (!incomingfetchdata) {
                try {
                    if (validateResponseNew({ response: incomingTransactionsData.BizResponseObj, statusCode: incomingTransactionsData.statusCode, isList: true })) {
                        var resData = parseArray(incomingTransactionsData.IncomingTransactions);
                        return {
                            ...state,
                            response: resData,
                            refreshing: false
                        };
                    } else {
                        return {
                            ...state,
                            response: [],
                            refreshing: false
                        };
                    }
                } catch (e) {
                    return {
                        ...state,
                        response: [],
                        refreshing: false
                    };
                }
            }
        }
        return null;
    }

    render() {
        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        let { Loading } = this.props;

        //for final items from search input (validate on Amount , TrnID  and WalletType)
        //default searchInput is empty so it will display all records.
        let finalItems = this.state.response.filter(item => (('' + item.Amount).includes(this.state.searchInput) || ('' + item.TrnID).includes(this.state.searchInput.toLowerCase()) || item.WalletType.toLowerCase().includes(this.state.searchInput.toLowerCase())));

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.TransferInHistory}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })}
                />

                {/* To Check Response fetch or not if Loading = true then display progress bar else display List*/}
                {
                    Loading && !this.state.refreshing
                        ?
                        <ListLoader />
                        :
                        <View style={{ flex: 1 }}>
                            {finalItems.length ?
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        data={finalItems}
                                        showsVerticalScrollIndicator={false}
                                        /* render all item in list */
                                        renderItem={({ item, index }) =>
                                            <FlatListItem
                                                item={item}
                                                index={index}
                                                size={this.state.response.length}
                                                onTrnIdPress={() => this.onTrnLinkPress(item)}>
                                            </FlatListItem>}
                                        /* assign index as key valye to Transfer In History list item */
                                        keyExtractor={item => item.AutoNo.toString()}
                                        /* For Refresh Functionality In Transfer In History FlatList Item */
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
                                !Loading && <ListEmptyComponent />
                            }
                        </View>
                }
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
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {

        // Get required fields from props
        let item = this.props.item
        let { index, size, } = this.props;

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

                        <View style={{ flex: 1, flexDirection: 'row' }}>

                            {/* Currency Image */}
                            <ImageViewWidget url={item.WalletType ? item.WalletType : ''} width={R.dimens.IconWidthHeight} height={R.dimens.IconWidthHeight} />

                            <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>

                                {/* Amount , Currecncy Name and Transaction No */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{(parseFloatVal(item.Amount).toFixed(8).toString()) !== 'NaN' ? parseFloatVal(item.Amount).toFixed(8).toString() : '-'} {item.WalletType ? item.WalletType : '-'}</Text>
                                    {item.TrnNo ?
                                        <View style={{ flexDirection: 'row', }}>
                                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.Trn_No} : </TextViewHML>
                                            <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{validateValue(item.TrnNo)}</TextViewHML>
                                        </View>
                                        : null
                                    }
                                </View>

                                {/* To Address */}
                                <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, }}>{R.strings.to} : </TextViewHML>
                                    <TextViewHML style={{ flex: 1, alignSelf: 'center', color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{item.Address ? item.Address : '-'}</TextViewHML>
                                </View>
                            </View>
                        </View >

                        {/* Transaction Id */}
                        <View style={{ flex: 1, marginTop: R.dimens.widgetMargin, }}>
                            <View style={{ flexDirection: 'row', }}>
                                <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.txnid.toUpperCase()}</Text>
                                <Separator style={{ flex: 1, justifyContent: 'center', }} />
                            </View>
                            {
                                (item.TrnID && item.ExplorerLink) ?
                                    <TouchableOpacity onPress={this.props.onTrnIdPress}>
                                        <TextViewHML style={{ marginLeft: R.dimens.widget_left_right_margin, fontSize: R.dimens.smallestText, color: R.colors.accent, }}>{item.TrnID ? item.TrnID : '-'}</TextViewHML>
                                    </TouchableOpacity> :
                                    <TextViewHML style={{ marginLeft: R.dimens.widget_left_right_margin, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.TrnID ? item.TrnID : '-'}</TextViewHML>
                            }
                        </View>

                        {/* Confiramtion , Confiramation Count and DateTime */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widget_top_bottom_margin, marginLeft: R.dimens.widget_left_right_margin }}>
                            <StatusChip
                                color={R.colors.yellow}
                                value={(item.ConfirmationCount ? item.ConfirmationCount : '-') + '/' + (item.Confirmations ? item.Confirmations : '-') + ' ' + R.strings.Conf}></StatusChip>
                            <TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.Date)}</TextViewHML>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    };
}

const mapStateToProps = (state) => {
    return {
        //Updated Data For Transfer In History
        incomingTransactionsData: state.TransferInOutReducer.incomingTransactionsData,
        Loading: state.TransferInOutReducer.Loading,
        incomingfetchdata: state.TransferInOutReducer.incomingfetchdata,
    }
};

const mapDispatchToProps = (dispatch) => ({
    //Perform Transfer In History Action
    getIncomingTransactionsReport: () => dispatch(getIncomingTransactionsReport())
});

export default connect(mapStateToProps, mapDispatchToProps)(TransferInHistoryResult);