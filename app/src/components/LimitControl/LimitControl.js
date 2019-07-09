import React, { Component } from 'react';
import { View, } from 'react-native';
import { connect } from 'react-redux';
import { OnSaveLimits, OnFetchLimits, OnDropdownChange } from '../../actions/Wallet/LimitControlAction'
import { getWallets } from '../../actions/PairListAction';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isEmpty, isInternet, validateResponseNew } from '../../validations/CommonValidation'
import Button from '../../native_theme/components/Button'
import { isCurrentScreen } from '../Navigation'
import EditText from '../../native_theme/components/EditText'
import { changeTheme, showAlert, parseArray } from '../../controllers/CommonUtils';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import TimePickerWidget from '../Widget/TimePickerWidget';
import CommonToast from '../../native_theme/components/CommonToast';
import moment from 'moment';
import { sendEvent } from '../../controllers/CommonUtils';
import Picker from '../../native_theme/components/Picker';
import R from '../../native_theme/R';
import IndicatorViewPager from '../../native_theme/components/IndicatorViewPager';
import TextViewMR from '../../native_theme/components/TextViewMR';
import { Events } from '../../controllers/Constants';
import AlertDialog from '../../native_theme/components/AlertDialog';
import SafeView from '../../native_theme/components/SafeView';
import InputScrollView from 'react-native-input-scroll-view';
const { width, height } = R.screen();

class LimitControl extends Component {
    constructor(props) {
        super(props);
        this.inputs = {};

        //To Bind All Method
        this.focusNextField = this.focusNextField.bind(this);
        this.Redirection = this.Redirection.bind(this);
        this.onPageScroll = this.onPageScroll.bind(this)

        //Define All State initial state
        this.state = {
            walletItems: [{ value: R.strings.Please_Select }],
            AccWalletID: '',
            WalletName: R.strings.Please_Select,
            tabPosition: 0,
            walletLimit: null,
            setWalletLimit: null,
            LimitPerHour: '',
            LimitPerDay: '',
            LimitPerTrn: '',
            LifeTimeLimit: '',
            StartTime: '',
            EndTime: '',
            Limits: '',
            tabsName: [R.strings.TradingLimits, R.strings.WithdrawLimits, R.strings.DepositLimits, R.strings.APICallLimits],
            isFirstTime: true,
            isVisible: false,
        }
    }

    //To Redirect user to Main Screen
    Redirection = async () => {
        sendEvent(Events.MoveToMainScreen, 0);
        this.props.navigation.navigate('MainScreen')
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call to get Wallet List Api
            this.props.getWallets();
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, _prevState) => {

        //Get All Updated Feild of Particular actions
        const { LimitControlData, LimitControlFetchData,
            GetLimitData, GetLimitFetchData } = this.props;

        //compare response with previous response
        if (LimitControlData !== prevProps.LimitControlData) {

            //To Check Limit Control Api Data Fetch or Not
            if (!LimitControlFetchData) {
                try {
                    //if walletlimit is null or old and new data of wallet limit  and response is different then validate it
                    if (this.state.setWalletLimit == null || (this.state.setWalletLimit != null && LimitControlData !== this.state.setWalletLimit)) {
                        this.setState({ setWalletLimit: LimitControlData });

                        //Validate API and display message
                        if (validateResponseNew({ response: LimitControlData })) {
                            showAlert(R.strings.Success + '!', LimitControlData.ReturnMsg, 0, () => this.Redirection());
                        }
                    }
                } catch (e) { }
            }
        }

        //compare response with previous response
        if (GetLimitData !== prevProps.GetLimitData) {

            //To Check Limit Control Api Data Fetch or Not
            if (!GetLimitFetchData) {
                try {
                    //if walletlimit is null or old and new data of wallet limit  and response is different then validate it
                    if (this.state.walletLimit == null || (this.state.walletLimit != null && GetLimitData !== this.state.walletLimit)) {

                        //Validate Repsonse
                        validateResponseNew({ response: GetLimitData, isList: true });

                        //get and set response in UI
                        this.setValuesOfCurrentPage(this.state.tabPosition + 1, GetLimitData);
                    }
                } catch (e) { }
            }
        }
    };

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { ListWalletData, ListWalletFetchData } = props;

            //To check if both CoinList and ListWallets response is available then continue
            if (!ListWalletFetchData) {
                try {
                    //if balance has records and WalletListData has success response then get arrays.
                    if (validateResponseNew({ response: ListWalletData, isList: true })) {

                        //Check Response is array or not 
                        let res = parseArray(ListWalletData.Wallets)

                        //Store Wallet Name Array in State
                        res.map((item, index) => {
                            res[index].value = item.WalletName;
                        })

                        //Concat Select String With Wallet Name 
                        let walletItem = [
                            { value: R.strings.Please_Select },
                            ...res
                        ];

                        return {
                            ...state,
                            walletItems: walletItem,
                        }
                    }
                    else {
                        return {
                            ...state,
                            walletItems: [{ value: R.strings.Please_Select }],
                        }
                    }
                }
                catch (error) {
                    return {
                        ...state,
                        walletItems: [{ value: R.strings.Please_Select }],
                    }
                }
            }
        }
        return null;
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    //Check All Validation and if validation is proper then call API
    onSaveButtonPress = async () => {

        //Check Limit Hour is Empty or Not
        if (isEmpty(this.state.AccWalletID)) {
            this.refs.Toast.Show(R.strings.Select_Wallet);
            return;
        }

        //Check Limit Hour is Empty or Not
        if (isEmpty(this.state.LimitPerHour)) {
            this.refs.Toast.Show(R.strings.LimitPerHourValidation);
            return;
        }

        //Check Limit Per Day is Empty or Not
        if (isEmpty(this.state.LimitPerDay)) {
            this.refs.Toast.Show(R.strings.LimitPerDayValidation);
            return;
        }

        //Check Limit Per Transaction is Empty or Not
        if (isEmpty(this.state.LimitPerTrn)) {
            this.refs.Toast.Show(R.strings.LimitPerTrnValidation);
            return;
        }

        //Check Limit Per Transaction is Empty or Not
        if (isEmpty(this.state.LifeTimeLimit)) {
            this.refs.Toast.Show(R.strings.LifeTimeLimitValidation);
            return;
        }

        //Check If Start Time is Enter and End time is Empty or Not
        if (!isEmpty(this.state.StartTime) && isEmpty(this.state.EndTime)) {
            this.refs.Toast.Show(R.strings.EndTimeValidation);
            return;
        }

        //Check If End Time is Enter and Start time is Empty or Not
        if (isEmpty(this.state.StartTime) && !isEmpty(this.state.EndTime)) {
            this.refs.Toast.Show(R.strings.StartTimeValidation);
            return;
        }

        //Check If Start and End Time 
        if (!isEmpty(this.state.StartTime) && !isEmpty(this.state.EndTime)) {
            if (moment(this.state.StartTime, 'hh:mm A').format('X') > moment(this.state.EndTime, 'hh:mm A').format('X')) {
                this.refs.Toast.Show(R.strings.startEndTimeValidation);
                return;
            }
            else {
                let trnType = this.state.tabPosition + 1;
                if ((this.state.tabPosition + 1) == 2) {
                    trnType = 9;
                }
                if ((this.state.tabPosition + 1) == 3) {
                    trnType = 2;
                }
                //Check NetWork is Available or not
                if (await isInternet()) {
                    //call Save Limits Control API
                    this.props.onSaveLimits(this.state.AccWalletID, this.state.LimitPerHour, this.state.LimitPerDay, this.state.LimitPerTrn, this.state.LifeTimeLimit, moment(this.state.StartTime, 'hh:mm A').format('X'), moment(this.state.EndTime, 'hh:mm A').format('X'), trnType);
                }
            }
        }
        else {
            let trnType = this.state.tabPosition + 1;
            if ((this.state.tabPosition + 1) == 2) {
                trnType = 9;
            }
            if ((this.state.tabPosition + 1) == 3) {
                trnType = 2;
            }

            //Check NetWork is Available or not
            if (await isInternet()) {

                //call Save Limits Control API
                this.props.onSaveLimits(this.state.AccWalletID, this.state.LimitPerHour, this.state.LimitPerDay, this.state.LimitPerTrn, this.state.LifeTimeLimit, moment(this.state.StartTime, 'hh:mm A').format('X'), moment(this.state.EndTime, 'hh:mm A').format('X'), trnType);
            }
        }
    }

    //This Method Is Used To Display Paga based on Selected Tab From Tab View
    onPageScroll = async (scrollData) => {
        let { position } = scrollData

        if (position != this.state.tabPosition) {
            //Set response in UI
            this.setValuesOfCurrentPage(position + 1, this.state.walletLimit);
        }
    }

    setValuesOfCurrentPage = (tabItem, data) => {

        //If data is not null and nor its array then continue
        if (data && data.WalletLimitConfigurationRes) {

            //Find index of current tab type
            let itemIndex = data.WalletLimitConfigurationRes.findIndex((item) => {
                if ((item.TrnType == 1 && tabItem == 1) ||
                    (item.TrnType == 9 && tabItem == 2) ||
                    (item.TrnType == 2 && tabItem == 3) ||
                    (item.TrnType == 4 && tabItem == 4)) {
                    return true;
                }
                return false;
            });

            //If index is found then get data
            if (itemIndex > -1) {

                //Item which is consist perfect match for current selected tab.
                let item = data.WalletLimitConfigurationRes[itemIndex];

                var dateEnd = '';
                var dateStart = '';

                //if EndTime is 0 from response then no need to formatting else convert millisecond into hh:MM A format
                if (item.EndTime != 0 && item.EndTime != null) {
                    dateEnd = moment(item.EndTime, 'X').format('hh:mm A');
                }
                //if StartTime is 0 from response then no need to formatting else convert millisecond into hh:MM A format
                if (item.StartTime != 0 && item.StartTime != null) {
                    dateStart = moment(item.StartTime, 'X').format('hh:mm A');
                }
                this.setState({
                    tabPosition: tabItem - 1,
                    LimitPerDay: item.LimitPerDay.toString(),
                    LimitPerHour: item.LimitPerHour.toString(),
                    LimitPerTrn: item.LimitPerTransaction.toString(),
                    LifeTimeLimit: item.LifeTime.toString(),
                    EndTime: dateEnd,
                    StartTime: dateStart,
                    walletLimit: data,
                })
            } else {
                //if nothing found then set default data.
                this.setState({ tabPosition: tabItem - 1, LimitPerDay: '', LimitPerHour: '', LimitPerTrn: '', LifeTimeLimit: '', StartTime: '', EndTime: '', walletLimit: data })
            }
        }
        else {
            //if nothing found then set default data.
            this.setState({ tabPosition: tabItem - 1, LimitPerDay: '', LimitPerHour: '', LimitPerTrn: '', LifeTimeLimit: '', StartTime: '', EndTime: '', walletLimit: data })
        }
    }

    //on Selection of Currency From Drop Down
    onWalletChange = async (index, object) => {
        try {
            if (index !== R.strings.Please_Select) {

                //To empty Reducer
                this.props.OnDropdownChange();
                //---------

                //Chcek if Item is Select From Select Wallet DropDown
                if (this.refs.spSelectWallet != null) {

                    //Store Update DropDown Item and Perform Wallet Change Action For Update Item
                    if (object.AccWalletID !== this.state.AccWalletID) {

                        //Check NetWork is Available or not
                        if (await isInternet()) {

                            //Bind get Limits Request
                            let getLimitRequest = {
                                AccWalletID: object.AccWalletID
                            }
                            //Call Get Fetch Limit API
                            this.props.onFetchLimits(getLimitRequest, object.AccWalletID);
                        }
                    }
                    this.setState({ WalletName: index, AccWalletID: object.AccWalletID })
                }
            }
            else {
                this.setState({
                    AccWalletID: '',
                    WalletName: index,
                    LimitPerDay: '',
                    LimitPerHour: '',
                    LimitPerTrn: '',
                    LifeTimeLimit: '',
                    EndTime: '',
                    StartTime: '',
                    walletLimit: null,
                })
            }
        }
        catch (e) {
            //Catch Code here
            this.setState({
                AccWalletID: '',
                WalletName: index,
                LimitPerDay: '',
                LimitPerHour: '',
                LimitPerTrn: '',
                LifeTimeLimit: '',
                EndTime: '',
                StartTime: '',
                walletLimit: null,
            })
        }
    }

    render() {
        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { LimitControlisFetching, GetLimitisFetching, ListWalletIsFetching } = this.props;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.LimitControl}
                    isBack={true}
                    nav={this.props.navigation}
                    rightIcon={R.images.IC_INFO}
                    onRightMenuPress={() => {
                        this.setState({ isVisible: true });
                    }} />

                {/* Progress Dialog */}
                <ProgressDialog isShow={LimitControlisFetching || GetLimitisFetching || ListWalletIsFetching} />

                {/* For Toast */}
                <CommonToast ref="Toast" />

                {/* To Display Limit Info */}
                <AlertDialog
                    visible={this.state.isVisible}
                    title={R.strings.Info}
                    titleStyle={{ justifyContent: 'center', textAlign: 'center' }}
                    negativeButton={{
                        onPress: () => this.setState({ isVisible: false })
                    }}
                    positiveButton={{
                        title: R.strings.OK,
                        onPress: () => this.setState({ isVisible: false })
                    }}
                    requestClose={() => this.setState({ isVisible: false })}>

                    <View style={{
                        paddingLeft: R.dimens.margin,
                        paddingRight: R.dimens.margin
                    }}>
                        <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                            <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'left' }}>{R.strings.LimitNotice1} {this.state.tabPosition == 0 ? R.strings.TradingLimits : this.state.tabPosition == 1 ? R.strings.WithdrawLimits : this.state.tabPosition == 2 ? R.strings.DepositLimits : R.strings.APICallLimits} {R.strings.LimitNotice2}</TextViewMR>
                        </View>
                    </View>
                </AlertDialog>

                <View style={{ flex: 1, justifyContent: 'space-between', overflow: 'hidden' }}>

                    <IndicatorViewPager
                        isGradient={true}
                        titles={this.state.tabsName}
                        numOfItems={4}
                        style={{ marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin, }}
                        onPageScroll={this.onPageScroll}>

                        {this.state.tabsName.map((tabItem) =>
                            <View key={tabItem} style={{ flex: 1, width, height }}>

                                {/* To Set All View in ScrolView */}
                                <InputScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
                                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                                        {/* To Set Wallet in Dropdown */}
                                        <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginTop: R.dimens.widget_top_bottom_margin, marginLeft: R.dimens.LineHeight }}>{R.strings.Select_Wallet}</TextViewMR>
                                        <Picker
                                            ref='spSelectWallet'
                                            title={R.strings.Select_Wallet}
                                            searchable={true}
                                            data={this.state.walletItems}
                                            value={this.state.WalletName ? this.state.WalletName : ''}
                                            onPickerSelect={(index, object) => this.onWalletChange(index, object)}
                                            displayArrow={'true'}
                                            width={'100%'}
                                        />

                                        {/* To Set Limit Per Hour in EditText */}
                                        <EditText
                                            header={R.strings.LimitPerHour}
                                            reference={input => { this.inputs['etLimitPerHour'] = input; }}
                                            placeholder={R.strings.LimitPerHour}
                                            multiline={false}
                                            keyboardType='numeric'
                                            returnKeyType={"next"}
                                            onChangeText={(LimitPerHour) => this.setState({ LimitPerHour })}
                                            onSubmitEditing={() => { this.focusNextField('etLimitPerDay') }}
                                            value={this.state.LimitPerHour}
                                            validate={true}
                                            style={{ marginTop: 0, }}
                                        />

                                        {/* To Set Limit Per Day in EditText */}
                                        <EditText
                                            header={R.strings.LimitPerDay}
                                            reference={input => { this.inputs['etLimitPerDay'] = input; }}
                                            placeholder={R.strings.LimitPerDay}
                                            multiline={false}
                                            keyboardType='numeric'
                                            returnKeyType={"next"}
                                            onChangeText={(LimitPerDay) => this.setState({ LimitPerDay })}
                                            onSubmitEditing={() => { this.focusNextField('etLimitPerTrn') }}
                                            value={this.state.LimitPerDay}
                                            validate={true}
                                        />

                                        {/* To Set Limit Per Transaction in EditText */}
                                        <EditText
                                            header={R.strings.LimitPerTrn}
                                            reference={input => { this.inputs['etLimitPerTrn'] = input; }}
                                            placeholder={R.strings.LimitPerTrn}
                                            multiline={false}
                                            keyboardType='numeric'
                                            returnKeyType={"next"}
                                            onSubmitEditing={() => { this.focusNextField('etLifeTimeLimit') }}
                                            onChangeText={(LimitPerTrn) => this.setState({ LimitPerTrn })}
                                            value={this.state.LimitPerTrn}
                                            validate={true}
                                        />

                                        {/* To Set Life Time Limit in EditText */}
                                        <EditText
                                            header={R.strings.LifeTimeLimit}
                                            reference={input => { this.inputs['etLifeTimeLimit'] = input; }}
                                            placeholder={R.strings.LifeTimeLimit}
                                            multiline={false}
                                            keyboardType='numeric'
                                            returnKeyType={"done"}
                                            onChangeText={(LifeTimeLimit) => this.setState({ LifeTimeLimit })}
                                            value={this.state.LifeTimeLimit}
                                            validate={true}
                                        />
                                        {/* For StartTime and EndTime Picker and Its View */}
                                        <TimePickerWidget StartTimePickerCall={(StartTime) => this.setState({ StartTime })} EndTimePickerCall={(EndTime) => this.setState({ EndTime })} StartTime={this.state.StartTime} EndTime={this.state.EndTime} />
                                    </View>
                                </InputScrollView>
                            </View>
                        )}
                    </IndicatorViewPager>

                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, }}>

                        {/* To Set Save Button */}
                        <Button title={R.strings.Save} onPress={() => { this.onSaveButtonPress() }}></Button>
                    </View>
                </View>
            </SafeView >
        );
    }

}

function mapStateToProps(state) {
    return {
        //Updated Data For Limit Control Api Action
        LimitControlFetchData: state.LimitControlReducer.LimitControlFetchData,
        LimitControlisFetching: state.LimitControlReducer.LimitControlisFetching,
        LimitControlData: state.LimitControlReducer.LimitControlData,

        //Updated Data For Limit Data Api Action
        GetLimitFetchData: state.LimitControlReducer.GetLimitFetchData,
        GetLimitisFetching: state.LimitControlReducer.GetLimitisFetching,
        GetLimitData: state.LimitControlReducer.GetLimitData,

        //For Wallet List
        ListWalletData: state.LimitControlReducer.ListWalletData,
        ListWalletFetchData: state.LimitControlReducer.ListWalletFetchData,
        ListWalletIsFetching: state.LimitControlReducer.ListWalletIsFetching,
    }
}

function mapDispatchToProps(dispatch) {

    return {
        //Perform Save Limits Action
        onSaveLimits: (AccWalletID, LimitPerHour, LimitPerDay, LimitPerTrn, LifeTimeLimit, StartTime, EndTime, trnType) => dispatch(OnSaveLimits(AccWalletID, LimitPerHour, LimitPerDay, LimitPerTrn, LifeTimeLimit, StartTime, EndTime, trnType)),

        //Perform Fetch Limits Action
        onFetchLimits: (getLimitRequest, AccWalletID) => dispatch(OnFetchLimits(getLimitRequest, AccWalletID)),

        //To get Wallets
        getWallets: () => dispatch(getWallets()),

        // To perform action for dropdown
        OnDropdownChange: () => dispatch(OnDropdownChange()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LimitControl)