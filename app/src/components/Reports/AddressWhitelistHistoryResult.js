import React, { Component } from 'react';
import {
    View, FlatList, TouchableWithoutFeedback,
    Image, RefreshControl, Text
} from 'react-native';
import { connect } from 'react-redux';
import { getAllWhithdrawalAddress, addToWhitelist, removeWhitelist, deleteAddress } from '../../actions/Wallet/AddressManagementAction'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen } from '../Navigation';
import { changeTheme, showAlert } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import ListLoader from '../../native_theme/components/ListLoader';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import CommonToast from '../../native_theme/components/CommonToast';
import R from '../../native_theme/R';
import ImageViewWidget from '../Widget/ImageViewWidget';
import CardView from '../../native_theme/components/CardView';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class AddressWhitelistHistoryResult extends Component {

    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            response: [],
            searchInput: '',
            SelectedItemCount: 0,
            isSelectAll: false,
            refreshing: false,
            isFirstTime: true,
        };
        //----------

        //To Bind All Method
        this.AddToWhitelist = this.AddToWhitelist.bind(this);
        this.RemoveFromWhitelist = this.RemoveFromWhitelist.bind(this);
        this.deleteRecord = this.deleteRecord.bind(this);
        this.GetSelectedItems = this.GetSelectedItems.bind(this);
        this.SelecetAllItems = this.SelecetAllItems.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        //-----------------

        //On Option Menu Item For Perform Functionality
        this.MenuItem = [R.strings.Add_WhiteList, R.strings.Remove_Whitelist, R.strings.Delete, R.strings.Whitelisted_Record];
        //----------------
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ SelectedItemCount: 0, refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get Withdrawal Address History from API
            this.props.getAllWhithdrawalAddress();
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Call Get Withdrawal Address History from API
        this.GetWhitdrawalWhitelistAddress();
    }

    //Call Get Withdrawal Address History from API
    GetWhitdrawalWhitelistAddress = async () => {
        this.setState({ SelectedItemCount: 0 });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get Withdrawal Address History from API
            this.props.getAllWhithdrawalAddress();
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, prevState) => {

        //Get All Updated Feild of Particular actions
        const { AddAddresssFetchData, AddAddressHistorydata, RemoveAddresssFetchData, RemoveAddressHistorydata,
            DeleteWithdrawalAddressFetchData, DeleteWWithdrawalAddressHistorydata } = this.props;

        // compare response with previous response
        if (AddAddressHistorydata !== prevProps.AddAddressHistorydata) {

            //Check Add Address to Whitelist Api Response 
            if (!AddAddresssFetchData) {
                try {
                    if (validateResponseNew({ response: AddAddressHistorydata.BizResponse, statusCode: AddAddressHistorydata.statusCode })) {

                        // on success responce Refresh List
                        showAlert(R.strings.Success + '!', AddAddressHistorydata.BizResponse.ReturnMsg, 0, () => this.GetWhitdrawalWhitelistAddress())
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                }
            }
        }

        // compare response with previous response
        if (RemoveAddressHistorydata !== prevProps.RemoveAddressHistorydata) {

            //To Check Remove Withdrawal address From List Fetch
            if (!RemoveAddresssFetchData) {
                try {
                    //Get Delete Whitelisted Address Api Return Message
                    if (validateResponseNew({ response: RemoveAddressHistorydata.BizResponse, statusCode: RemoveAddressHistorydata.statusCode })) {

                        // on success responce Refresh List
                        showAlert(R.strings.Success + '!', RemoveAddressHistorydata.BizResponse.ReturnMsg, 0, () => this.GetWhitdrawalWhitelistAddress())
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                }
            }
        }

        // compare response with previous response
        if (DeleteWWithdrawalAddressHistorydata !== prevProps.DeleteWWithdrawalAddressHistorydata) {

            //To Check Delete Withdrawal address history Fetch
            if (!DeleteWithdrawalAddressFetchData) {
                try {
                    if (validateResponseNew({ response: DeleteWWithdrawalAddressHistorydata.BizResponse, statusCode: DeleteWWithdrawalAddressHistorydata.statusCode })) {

                        // on success responce Refresh List
                        showAlert(R.strings.Success + '!', DeleteWWithdrawalAddressHistorydata.BizResponse.ReturnMsg, 0, () => this.GetWhitdrawalWhitelistAddress())
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                }
            }
        }
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
        if (AddressWhitelistHistoryResult.oldProps !== props) {
            AddressWhitelistHistoryResult.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { WithdrawalAddressHistorydata, WithdrawalAddresssFetchData, } = props;


            //To Check Withdrawal Address History Data Fetch or Not
            if (!WithdrawalAddresssFetchData) {
                try {

                    if (validateResponseNew({ response: WithdrawalAddressHistorydata.BizResponse, statusCode: WithdrawalAddressHistorydata.statusCode, isList: true })) {

                        //check Withdrawal Address History Response is an Array Or not
                        //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                        var res = WithdrawalAddressHistorydata.Beneficiaries;
                        var resArr = [];
                        var rescheckArr = [];
                        if (!Array.isArray(res)) {
                            resArr.push(res);
                            resArr.map((item, index) => rescheckArr.push({ index: index, isSelected: false }))
                        }

                        //Take another Array for Check Item Selected Or Not.Initial Set False to all Items 
                        if (Array.isArray(res)) {
                            res.map((item, index) => rescheckArr.push({ index: index, isSelected: false }))
                        }

                        //Set State For Api response , Selected Item and Refershing Bit
                        return Object.assign({}, state, {
                            response: (Array.isArray(res)) ? res : resArr,
                            rescheckArr,
                            refreshing: false
                        })
                    } else {
                        return Object.assign({}, state, {
                            response: [],
                            refreshing: false
                        })
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        response: [],
                        refreshing: false
                    })
                    //Handle Catch and Notify User to Exception.
                }
            }
        }
        return null;
    }

    // Get Selected Item From List Of Records
    GetSelectedItems = () => {

        let selectItemList = [];
        this.state.rescheckArr.map((item, index) => {
            if (item.isSelected) {
                selectItemList.push(this.state.response[index].BeneficiaryID);
            }
        })
        this.setState({ SelectedItemCount: selectItemList.length })
        return selectItemList;
    }

    //For Select All Items From List 
    SelecetAllItems = () => {

        //reverse curent all select value
        let isSelectAll = !this.state.isSelectAll;
        let checkArr = [];

        //loop through all records and set isSelected = isSelectAll
        this.state.rescheckArr.map((item) => {
            item.isSelected = isSelectAll;
            checkArr.push(item)
        })
        this.setState({ rescheckArr: checkArr, isSelectAll, SelectedItemCount: checkArr.length })
        if (!isSelectAll) {
            this.setState({ SelectedItemCount: 0 })
        }
    }

    // Add to whitelist Record
    AddToWhitelist = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call For Add  Address in Whitelist
            if (this.GetSelectedItems().length > 0) {

                //Bind Request For Add Address to Whitelist
                let addWhiteListRequest = {
                    ID: this.GetSelectedItems(),
                    WhitelistingBit: 1
                }
                this.props.addToWhitelist(addWhiteListRequest);
            }
            else {
                this.refs.Toast.Show('Please Select Any One Item');
            }
            //----------
        }
    }

    // Remove From whitelist Record
    RemoveFromWhitelist = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call For Remove Address From Whitelist
            if (this.GetSelectedItems().length > 0) {

                //Bind Request For Remove Address From Whitelist
                let removeWhiteListRequest = {
                    ID: this.GetSelectedItems(),
                    WhitelistingBit: 0
                }
                this.props.removeWhitelist(removeWhiteListRequest);
            }
            else {
                this.refs.Toast.Show('Please Select Any One Item');
            }
            //----------
        }
    }

    // Delete Whitelist and Non WhiteListed Records
    deleteRecord = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call For Delete Address From Whitelist
            if (this.GetSelectedItems().length > 0) {

                //Bind Request For Delete Address From Whitelist
                let deleteWhiteListRequest = {
                    ID: this.GetSelectedItems(),
                    WhitelistingBit: 9
                }
                this.props.deleteAddress(deleteWhiteListRequest);
            }
            else {
                this.refs.Toast.Show('Please Select Any One Item');
            }
            //----------
        }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { WithdrawalAddressIsFetching, listLoading } = this.props;
        //----------

        //for final items from search input (validate on coin)
        //default searchInput is empty so it will display all records.
        let finalItems = this.state.response.filter(item => (item.CoinName.toLowerCase().includes(this.state.searchInput.toLowerCase()) || item.Name.toLowerCase().includes(this.state.searchInput.toLowerCase()) || item.Address.toLowerCase().includes(this.state.searchInput.toLowerCase())));

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.Whitelist_Address_History}
                    titleClickable={false}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={listLoading} />

                {/* For Display Toast Message*/}
                <CommonToast ref="Toast" />

                {/* Display Data in CardView */}
                <View style={{ flex: 1 }}>

                    {this.state.SelectedItemCount > 0 ?
                        <CardView style={{
                            elevation: R.dimens.listCardElevation,
                            borderRadius: 0,
                            margin: R.dimens.margin,
                            flexDirection: 'row'
                        }}>
                            <Text style={{ flex: 1, color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{this.state.SelectedItemCount} {R.strings.Selected}</Text>

                            <TouchableWithoutFeedback onPress={() => this.AddToWhitelist()}>
                                <Image style={{ height: R.dimens.dashboardMenuIcon, width: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }} source={R.images.IC_PLUS} />
                            </TouchableWithoutFeedback>

                            <TouchableWithoutFeedback onPress={() => this.RemoveFromWhitelist()}>
                                <Image style={{ height: R.dimens.dashboardMenuIcon, width: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary, marginLeft: R.dimens.widget_left_right_margin }} source={R.images.IC_CANCEL} />
                            </TouchableWithoutFeedback>

                            <TouchableWithoutFeedback onPress={() =>
                                showAlert(R.strings.Delete + '!', R.strings.delete_message, 6, () => this.deleteRecord(), R.strings.no_text, () => { }, R.strings.yes_text)
                            }>
                                <Image style={{ height: R.dimens.dashboardMenuIcon, width: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary, marginLeft: R.dimens.widget_left_right_margin }} source={R.images.IC_DELETE} />
                            </TouchableWithoutFeedback>

                            <TouchableWithoutFeedback onPress={this.SelecetAllItems}>
                                <Image style={{ height: R.dimens.dashboardMenuIcon, width: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary, marginLeft: R.dimens.widget_left_right_margin }} source={R.images.IC_SELECT_ALL} />
                            </TouchableWithoutFeedback>

                        </CardView>
                        : null
                    }

                    {/* To Check Response fetch or not if WithdrawalAddressIsFetching = true then display progress bar else display List*/}
                    {(WithdrawalAddressIsFetching && !this.state.refreshing) ?
                        <ListLoader />
                        :
                        <View style={{ flex: 1 }}>
                            {finalItems.length ?

                                <FlatList
                                    data={finalItems}
                                    showsVerticalScrollIndicator={false}
                                    /* render all item in list */
                                    renderItem={({ item, index }) =>
                                        <FlatListItem
                                            item={item}
                                            index={index}
                                            size={this.state.response.length}
                                            isSelected={this.state.rescheckArr[index].isSelected}
                                            onPress={() => {
                                                /* On checkbox click pass true bit to selected item */
                                                let checkArr = Array.from(this.state.rescheckArr);
                                                checkArr[index].isSelected = !checkArr[index].isSelected;
                                                this.setState({ rescheckArr: checkArr })
                                                this.GetSelectedItems()
                                            }}
                                        ></FlatListItem>}
                                    /* assign index as key value to Address Whitelist item */
                                    keyExtractor={(item, index) => index.toString()}
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
                                :
                                <ListEmptyComponent module={R.strings.Add_Withdrawal_Address} onPress={() => this.props.navigation.navigate('AddreesWhiteListMainScreen')} />
                            }
                        </View>
                    }
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
            this.props.isSelected === nextProps.isSelected) {
            return false
        }
        return true
    }

    render() {

        // Get required field from props
        let item = this.props.item;
        let { index, size, } = this.props;

        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginTop: R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin,
                }}>
                    <CardView
                        style={{
                            flex: 1,
                            borderRadius: 0,
                            borderBottomLeftRadius: R.dimens.margin,
                            borderTopRightRadius: R.dimens.margin,
                            elevation: R.dimens.listCardElevation,
                        }} onPress={this.props.onPress}>

                        <View style={{ flex: 1, flexDirection: 'row' }}>

                            {/* Currency Image */}
                            <ImageViewWidget url={item.CoinName ? item.CoinName : ''} width={R.dimens.IconWidthHeight} height={R.dimens.IconWidthHeight} />

                            <View style={{ flex: 1, marginLeft: R.dimens.widget_top_bottom_margin, }}>

                                {/* LabelName ,CoinName */}
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.Name ? item.Name : '-'}</Text>
                                    <TextViewMR style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.successGreen, fontSize: R.dimens.smallText, }}>{item.CoinName ? item.CoinName : '-'}</TextViewMR>
                                </View>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, }}>{item.Address ? item.Address : '-'}</TextViewHML>

                                <View style={{ flexDirection: 'row', }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, }}>{R.strings.WhiteListed} : </TextViewHML>
                                    <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.IsWhiteListed == 1 ? R.strings.yes_text : R.strings.no_text}</Text>
                                </View>
                            </View>

                            {/* CheckBox For select Item */}
                            <TouchableWithoutFeedback onPress={this.props.onPress}>
                                <Image style={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: this.props.isSelected ? R.colors.accent : R.colors.textPrimary }}
                                    source={this.props.isSelected ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX} />
                            </TouchableWithoutFeedback>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    };
}

function mapStateToProps(state) {
    return {
        listLoading: state.AddressManagementReducer.listLoading,

        //Updated Data For whitelisted Addresses History
        WithdrawalAddressIsFetching: state.AddressManagementReducer.WithdrawalAddressIsFetching,
        WithdrawalAddresssFetchData: state.AddressManagementReducer.WithdrawalAddresssFetchData,
        WithdrawalAddressHistorydata: state.AddressManagementReducer.WithdrawalAddressHistorydata,

        //Updated Data For Add Whitelisted Record
        AddAddresssFetchData: state.AddressManagementReducer.AddAddresssFetchData,
        AddAddressHistorydata: state.AddressManagementReducer.AddAddressHistorydata,

        //Updated Data For Remove Whitelisted Record
        RemoveAddresssFetchData: state.AddressManagementReducer.RemoveAddresssFetchData,
        RemoveAddressHistorydata: state.AddressManagementReducer.RemoveAddressHistorydata,

        //Updated Data For Delete Withdrawal Whitelisted Addresses
        DeleteWithdrawalAddressFetchData: state.AddressManagementReducer.DeleteWithdrawalAddressFetchData,
        DeleteWWithdrawalAddressHistorydata: state.AddressManagementReducer.DeleteWWithdrawalAddressHistorydata,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Whitelisted Withdrawal history 
        getAllWhithdrawalAddress: () => dispatch(getAllWhithdrawalAddress()),

        //Perform Whitelisted Add history
        addToWhitelist: (addWhiteListRequest) => dispatch(addToWhitelist(addWhiteListRequest)),

        //Perform Whitelisted Remove history
        removeWhitelist: (removeWhiteListRequest) => dispatch(removeWhitelist(removeWhiteListRequest)),

        //Perform Delete Withdrawal History Data
        deleteAddress: (deleteWhiteListRequest) => dispatch(deleteAddress(deleteWhiteListRequest)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddressWhitelistHistoryResult)