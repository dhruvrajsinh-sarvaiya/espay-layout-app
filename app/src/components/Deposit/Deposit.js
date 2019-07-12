import React, { Component } from 'react';
import {
    View,
    Clipboard,
    Image,
    ScrollView,
    Platform,
    CameraRoll
} from 'react-native';

import { connect } from 'react-redux'
import { GenerateNewAddress, OnDropdownChange, getWallets, getDefaultAddress } from '../../actions/Wallet/DepositAction'
import Picker from '../../native_theme/components/Picker';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import Button from '../../native_theme/components/Button'
import { isEmpty, isInternet, validateResponseNew } from '../../validations/CommonValidation';
import { isCurrentScreen } from '../Navigation';
import ProgressDialog from '../../native_theme/components/ProgressDialog';

//To Save Image
import RNFetchBlob from 'rn-fetch-blob';
import { changeTheme, parseFloatVal, parseArray } from '../../controllers/CommonUtils';
import CommonToast from '../../native_theme/components/CommonToast';
import R from '../../native_theme/R';
import { ServiceUtilConstant, Fonts } from '../../controllers/Constants';
import ImageButton from '../../native_theme/components/ImageTextButton';
import { getFeeAndLimits } from '../../actions/Wallet/WithdrawAction';
import CardView from '../../native_theme/components/CardView';
import ImageViewWidget from '../Widget/ImageViewWidget';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';

class Deposit extends Component {

    constructor(props) {
        super(props);

        //To Bind All Method
        this.RedirectDepositHistory = this.RedirectDepositHistory.bind(this);
        this.onWalletChange = this.onWalletChange.bind(this);
        this.copyAddress = this.copyAddress.bind(this);
        this.GenerateNewAddress = this.GenerateNewAddress.bind(this);
        //----------

        //Define All initial State
        this.state = {
            walletItems: [],
            symbol: this.props.navigation.state.params ? this.props.navigation.state.params.CoinItem.SMSCode : '',
            Name: this.props.navigation.state.params ? this.props.navigation.state.params.CoinItem.Name : '',
            data: this.props.navigation.state.params ? this.props.navigation.state.params.Response : [],
            Id: this.props.navigation.state.params ? this.props.navigation.state.params.CoinItem.ServiceId : '',
            accWalletID: '',
            CoinName: R.strings.Please_Select,
            Address: '',
            CopybuttonClick: false,
            QrCodeButtonClick: false,

            //For Fee and Limit
            MinAmount: '',
            isFirstTime: true,
            isDisable: false,
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            let walletsRequest = {
                Coin: this.state.symbol
            }
            //To Get Wallets of Selected Currency
            this.props.getWallets(walletsRequest)

            let feeLimitRequest = {
                TrnType: 2,
                CoinName: this.state.symbol
            }
            //To Get Selected Currency Fee and Limits
            this.props.getFeeAndLimits(feeLimitRequest)
        }
        this.setState({ walletItems: [{ value: R.strings.Please_Select }] })
    }

    //To Save Image in Galary
    onSaveQRCode = async () => {
        this.setState({ CopybuttonClick: false, QrCodeButtonClick: true })
        //For Android Fetch Path And Save Image  
        if (Platform.OS === 'android') {
            RNFetchBlob
                .config({
                    fileCache: true,
                    appendExt: 'png'
                })
                .fetch('GET', 'https://chart.googleapis.com/chart?cht=qr&chl=' + this.state.Address + '&chs=150x150&chld=L|0')
                .then((res) => {
                    CameraRoll.saveToCameraRoll(res.path())
                        .then(this.refs.Toast.Show(R.strings.saveImageSuccess))
                        .catch(err => this.refs.Toast.Show(err.message))
                })
        }
        //For IOS
        else {
            CameraRoll.saveToCameraRoll('https://chart.googleapis.com/chart?cht=qr&chl=' + this.state.Address + '&chs=150x150&chld=L|0')
                .then(this.refs.Toast.Show(R.strings.saveImageSuccess))
        }
        //--------
    }
    //---------

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
        if (Deposit.oldProps !== props) {
            Deposit.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { FeeLimitData, FeeLimitFetchData,
                DefaultAddressFetchData, DefaultAddressData,
                GenerateNewAddressFetchData, GenerateNewAddressdata,
                WalletListData, WalletListFetchData } = props;

            //To Check Selected Currency Fee and Limit Api Data Fetch Or Not
            if (!FeeLimitFetchData) {
                try {
                    if (validateResponseNew({ response: FeeLimitData, isList: true })) {
                        //Store Minimum Amount
                        return {
                            ...state,
                            MinAmount: FeeLimitData.response.MinAmount
                        }
                    }
                    else {
                        return {
                            ...state,
                            MinAmount: '-'
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        MinAmount: '-'
                    }
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }

            //To Check Wallet Default Address Api Data Fetch Or Not
            if (!DefaultAddressFetchData) {
                try {
                    if (validateResponseNew({ response: DefaultAddressData })) {
                        //Store Default Address From Api Response
                        return {
                            ...state,
                            Address: DefaultAddressData.AddressList[0].Address,
                            isDisable: true,
                        }
                    } else {
                        return {
                            ...state,
                            Address: '',
                            isDisable: false,
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        Address: '',
                        isDisable: false,
                    }
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }

            //To Check Generate New Address Api Data Fetch Or Not
            if (!GenerateNewAddressFetchData) {
                try {
                    if (validateResponseNew({ response: GenerateNewAddressdata })) {
                        //Generate New Address Get From Response and Store in Address
                        return {
                            ...state,
                            Address: GenerateNewAddressdata.Address,
                            isDisable: true,
                        }
                    } else {
                        return {
                            ...state,
                            Address: '',
                            isDisable: false,
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        Address: '',
                        isDisable: false,
                    }
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }

            //To Check WalletList Address Api Data Fetch Or Not
            if (!WalletListFetchData) {
                try {
                    if (validateResponseNew({ response: WalletListData })) {

                        //Check Response is array or not
                        let res = parseArray(WalletListData.Wallets)

                        //Store Wallet Name Array in State
                        res.map((item, index) => { res[index].value = item.WalletName; })

                        //Concat Select String With Wallet Name 
                        let walletItem = [{ value: R.strings.Please_Select }, ...res];

                        return { ...state, walletItems: walletItem }
                    }
                    else {
                        return { ...state, walletItems: [{ value: R.strings.Please_Select }] }
                    }
                }
                catch (error) {
                    return { ...state, walletItems: [{ value: R.strings.Please_Select }] }
                }
            }
        }
        return null;
    }

    //on Selection of Currency From Drop Down
    onWalletChange = async (index, object) => {
        try {
            //Check If User Select Default Value From DropDown then Return Initial value Otherwise proceed further.
            if (index !== R.strings.Please_Select) {
                this.props.OnDropdownChange();
                //Chcek if Item is Select From Select Wallet DropDown
                if (this.refs.spSelectWallet != null) {
                    //Store Update DropDown Item and Perform Wallet Change Action For Update Item
                    if (object.AccWalletID !== this.state.accWalletID) {
                        //Check NetWork is Available or not
                        if (await isInternet()) {
                            let walletDefaultAddRequest = {
                                AccWalletID: object.AccWalletID
                            }
                            //To Get Default Wallet Address
                            this.props.getDefaultAddress(walletDefaultAddRequest)
                        }
                    }
                    this.setState({ accWalletID: object.AccWalletID, CoinName: index })
                }
            }
            else {
                this.setState({
                    accWalletID: '',
                    CoinName: index,
                    Address: '',
                    isDisable: false
                })
            }
        }
        catch (e) {
            //Catch Code here
            this.setState({
                accWalletID: '',
                CoinName: index,
                Address: '',
                isDisable: false
            })
        }
    }

    // Copy Functionality
    copyAddress = async () => {
        this.setState({ CopybuttonClick: true, QrCodeButtonClick: false })
        //Copy Address
        await Clipboard.setString(this.state.Address ? this.state.Address : '');
        this.refs.Toast.Show(R.strings.Copy_SuccessFul)
    }

    //Generate New Address 
    GenerateNewAddress = async () => {

        //Added Validation For Coin Selected or not from dropdown
        if (isEmpty(this.state.symbol)) {
            this.refs.Toast.Show(R.strings.Select_Coin)
            return;
        }
        //Added Validation For Wallet Selected or not from dropdown
        if (isEmpty(this.state.accWalletID)) {
            this.refs.Toast.Show(R.strings.Select_Wallet)
            return;
        }
        else {
            //Check NetWork is Available or not
            if (await isInternet()) {
                //To Bind Generate Address Request
                let generateAddressRequest = {
                    Coin: this.state.symbol,
                    AccWalletID: this.state.accWalletID
                }
                //call Coin Generate Address API
                this.props.GenerateNewAddress(generateAddressRequest);
            }
        }
    }

    //To Redirect User To Deposit History Screen
    RedirectDepositHistory() {
        var { navigate } = this.props.navigation;
        navigate('DepositHistory', { data: this.state.data });
        //----------
    }

    //To Select Coin from Prev Screen
    onCoinItemSelection = () => {
        var { navigate } = this.props.navigation;
        navigate('CoinSelectScreen', { isAction: ServiceUtilConstant.From_Deposit });
        //----------
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { loading, WalletBalanceIsFetching, DefaultAddressIsFetching } = this.props;
        //----------

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.Deposits} isBack={true} rightIcon={R.images.ic_history} onRightMenuPress={this.RedirectDepositHistory} nav={this.props.navigation} />

                {/* For Toast */}
                <CommonToast ref="Toast" />

                {/* Progress Dialog */}
                <ProgressDialog isShow={loading || WalletBalanceIsFetching || DefaultAddressIsFetching} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    {/* To Set All View in ScrolView */}
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>
                            {/* To Set Coin*/}
                            <SelectedCoin
                                symbol={this.state.symbol}
                                onCoinItemSelection={() => this.onCoinItemSelection()}>
                            </SelectedCoin>

                            {/* To Set Wallet in Dropdown */}
                            <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginTop: R.dimens.widget_top_bottom_margin }}>{R.strings.Select_Wallet}</TextViewMR>
                            <Picker
                                cardStyle={{ marginLeft: 0, marginRight: 0, }}
                                ref='spSelectWallet'
                                title={R.strings.Select_Wallet}
                                searchable={true}
                                data={this.state.walletItems}
                                value={this.state.CoinName ? this.state.CoinName : ''}
                                onPickerSelect={(index, object) => this.onWalletChange(index, object)}
                                displayArrow={'true'}
                                width={'100%'}
                            />

                            {/* To Display Generated Address */}
                            {this.state.Address ?
                                <CardView style={{ marginTop: R.dimens.padding_top_bottom_margin, flex: 1, alignItems: 'center' }} cardRadius={0}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingBottom: R.dimens.margin_top_bottom, paddingTop: R.dimens.margin_top_bottom, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin }}>
                                        <Image source={{ uri: 'https://chart.googleapis.com/chart?cht=qr&chl=' + this.state.Address + '&chs=150x150&chld=L|0' }} style={{ width: R.dimens.QRCodeIconWidthHeight, height: R.dimens.QRCodeIconWidthHeight }}></Image>
                                        {/* For Save QR Code button */}
                                        <CustomButton
                                            isCopyButton={false}
                                            image={true}
                                            title={R.strings.SaveQRCode}
                                            QrCodeclick={this.state.QrCodeButtonClick}
                                            onPress={() => { this.onSaveQRCode() }} />
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, marginTop: R.dimens.widget_top_bottom_margin, textAlign: 'center' }}>{R.strings.Address}</TextViewHML>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, marginTop: R.dimens.widget_top_bottom_margin, textAlign: 'center' }}>{this.state.Address}</TextViewHML>
                                        {/* For Copy button */}
                                        <CustomButton
                                            isCopyButton={true}
                                            image={false}
                                            title={R.strings.Copy_Address}
                                            onPress={this.copyAddress}
                                            copyAddressclick={this.state.CopybuttonClick} />
                                    </View>
                                </CardView>
                                : null}

                            {/* Important Message For Deposit */}
                            <View style={{ flex: 1, marginTop: R.dimens.widget_top_bottom_margin, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, textAlign: 'center' }}>{R.strings.formatString(R.strings.Important_Message, { MinAmount: (parseFloatVal(this.state.MinAmount).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.MinAmount).toFixed(8).toString() : '-'), Coin: this.state.symbol, Name: this.state.Name })}</TextViewHML>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Generate New Address Button */}
                        <Button disabled={this.state.isDisable} title={R.strings.Generate_NewAddres} onPress={this.GenerateNewAddress}></Button>
                    </View>
                </View>
            </SafeView >
        );
    }
}

// Set Selected Coin
class SelectedCoin extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.symbol === nextProps.symbol) {
            return false
        }
        return true
    }

    render() {
        return (
            /* Coin Image With Name and Select Coin Option */
            <CardView style={{ height: R.dimens.ButtonHeight, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} cardRadius={0}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <ImageViewWidget url={this.props.symbol ? this.props.symbol : null} style={{ marginRight: R.dimens.margin }} width={R.dimens.SMALL_MENU_ICON_SIZE} height={R.dimens.SMALL_MENU_ICON_SIZE} />
                    <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{this.props.symbol ? this.props.symbol : ''}</TextViewMR>
                </View>
                <TextViewHML
                    onPress={this.props.onCoinItemSelection}
                    style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, textAlign: 'right' }}>{R.strings.Choose_Coin}</TextViewHML>
            </CardView>
        )
    };
}

//For Custom Button
class CustomButton extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.image === nextProps.image &&
            this.props.title === nextProps.title &&
            this.props.isCopyButton === nextProps.isCopyButton &&
            this.props.copyAddressclick === nextProps.copyAddressclick &&
            this.props.QrCodeclick === nextProps.QrCodeclick) {
            return false
        }
        return true
    }

    render() {
        let color = '';
        let image = null;
        let tintColor = null;
        let isGradient = false;
        // If copyAddressclick and QrCodeclick are available then change color and their gradient
        if (this.props.copyAddressclick || this.props.QrCodeclick) {
            color = R.colors.accent;
            isGradient = true;
        }
        else {
            color = R.colors.textPrimary;
            tintColor = R.colors.textPrimary;
        }

        if (this.props.image) {
            image = R.images.ic_history;
        }

        return (
            <View style={{ marginTop: R.dimens.widget_top_bottom_margin, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <ImageButton
                    isHML
                    name={this.props.title}
                    isGradient={isGradient}
                    style={{
                        flexDirection: 'row-reverse',
                        borderColor: color,
                        borderWidth: R.dimens.pickerBorderWidth,
                        paddingLeft: this.props.isCopyButton ? R.dimens.mediumText : R.dimens.margin,
                        paddingRight: this.props.isCopyButton ? R.dimens.mediumText : R.dimens.margin,
                        paddingTop: R.dimens.widgetMargin,
                        paddingBottom: R.dimens.widgetMargin,
                        backgroundColor: R.colors.cardBackground,
                        borderRadius: R.dimens.cardBorderRadius,
                    }}
                    icon={image}
                    iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: tintColor }}
                    onPress={this.props.onPress}
                    textStyle={{
                        textAlign: 'center',
                        alignItems: 'center',
                        fontSize: R.dimens.smallestText,
                        color: color,
                        fontFamily: Fonts.HindmaduraiLight,
                        marginTop: R.dimens.CardViewElivation,
                    }} />
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        //Generate New Deposit Address
        GenerateNewAddressFetchData: state.DepositReducer.GenerateNewAddressFetchData,
        GenerateNewAddressdata: state.DepositReducer.GenerateNewAddressdata,

        //For Wallet List
        WalletListData: state.DepositReducer.WalletListData,
        WalletListFetchData: state.DepositReducer.WalletListFetchData,
        loading: state.DepositReducer.loading,

        //For Wallet Balance Data
        WalletBalanceData: state.DepositReducer.WalletBalanceData,
        WalletBalanceFetchData: state.DepositReducer.WalletBalanceFetchData,
        WalletBalanceIsFetching: state.DepositReducer.WalletBalanceIsFetching,

        //For get Default Address
        DefaultAddressData: state.DepositReducer.DefaultAddressData,
        DefaultAddressFetchData: state.DepositReducer.DefaultAddressFetchData,
        DefaultAddressIsFetching: state.DepositReducer.DefaultAddressIsFetching,

        //For Fee and Limits
        FeeLimitFetchData: state.DepositReducer.FeeLimitFetchData,
        FeeLimitData: state.DepositReducer.FeeLimitData,
        FeeLimitIsFetching: state.DepositReducer.FeeLimitIsFetching,
    }

}

function mapDispatchToProps(dispatch) {
    return {
        // To perform dropDown action
        OnDropdownChange: () => dispatch(OnDropdownChange()),
        //Perform Generate New Address Functionality Action
        GenerateNewAddress: (generateAddressRequest) => dispatch(GenerateNewAddress(generateAddressRequest)),
        // To perform getWallet action
        getWallets: (walletsRequest) => dispatch(getWallets(walletsRequest)),
        // To perform wallet default add request
        getDefaultAddress: (walletDefaultAddRequest) => dispatch(getDefaultAddress(walletDefaultAddRequest)),
        // To perform Fees and Limits action
        getFeeAndLimits: (feeLimitRequest) => dispatch(getFeeAndLimits(feeLimitRequest)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Deposit)