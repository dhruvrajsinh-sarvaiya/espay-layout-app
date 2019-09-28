import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation'
import R from '../../../native_theme/R';
import Button from '../../../native_theme/components/Button'
import { changeTheme, getCurrentDate, parseArray } from '../../../controllers/CommonUtils';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CommonToast from '../../../native_theme/components/CommonToast';
import DatePickerWidget from '../../widget/DatePickerWidget';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import SafeView from '../../../native_theme/components/SafeView';
import { isCurrentScreen } from '../../Navigation';
import { AppConfig } from '../../../controllers/AppConfig';
import { getArbiUserWalletsList, clearArbiUserWalletsData } from '../../../actions/Arbitrage/ArbitrageUserWalletsActions';
import { getArbiUserWalletLedger, clearArbiUserWalletLedger } from '../../../actions/Arbitrage/ArbitrageUserWalletLedgerActions';
import { DateValidation } from '../../../validations/DateValidation';
import { getUserDataList } from '../../../actions/PairListAction';

class ArbiUserWalletLedgerScreen extends Component {
    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();

        //Define All initial State
        this.state = {
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            selectedPage: 0,
            isFirstTime: true,

            userDataState: null,
            userWalletsListDataState: null,

            userNames: [{ value: R.strings.Please_Select }],
            selectedUserName: R.strings.Please_Select,
            selectedUserNameCode: '',

            wallets: [{ value: R.strings.Please_Select }],
            selectedWallets: R.strings.Please_Select,
            selectedWalletsCode: '',

            walletsVisible: false,
            datesVissible: false,
        }
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            // call api for user list
            this.props.getUserDataList();
        }
    }

    componentWillUnmount() {

        // call api for clear Wallet ledger
        this.props.clearArbiUserWalletLedger();
        this.props.clearArbiUserWalletsData();
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
        if (ArbiUserWalletLedgerScreen.oldProps !== props) {
            ArbiUserWalletLedgerScreen.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { userData, userWalletsListData } = props.data;

            // check userData fetch or not
            if (userData) {
                try {
                    //set data to picker 
                    if (state.userDataState == null || (state.userDataState != null && userData !== state.userDataState)) {
                        if (validateResponseNew({ response: userData, isList: true })) {

                            // convert response data into array 
                            let res = parseArray(userData.GetUserData);

                            for (var userDataItem in res) {
                                let item = res[userDataItem]
                                item.value = item.UserName
                            }

                            let userNames = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];
                            return { ...state, userDataState: userData, userNames };
                        }
                        else {
                            return { ...state, userDataState: userData, userNames: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    return { ...state, userNames: [{ value: R.strings.Please_Select }] };
                }
            }

            // check userData fetch or not
            if (userWalletsListData) {
                try {
                    //set data to picker 
                    if (state.userWalletsListDataState == null || (state.userWalletsListDataState != null && userWalletsListData !== state.userWalletsListDataState)) {
                        if (validateResponseNew({ response: userWalletsListData, isList: true })) {

                            // convert response data into array 
                            let res = parseArray(userWalletsListData.Data);

                            for (var walletDataKey in res) {
                                let item = res[walletDataKey]
                                item.value = item.WalletName
                            }

                            let wallets = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return { ...state, userDataState: userWalletsListData, wallets, walletsVisible: true };
                        }
                        else {
                            return { ...state, userDataState: userWalletsListData, wallets: [{ value: R.strings.Please_Select }], walletsVisible: true };
                        }
                    }
                } catch (e) {
                    return { ...state, walletsVisible: false, wallets: [{ value: R.strings.Please_Select }], };
                }
            }
        }
        return null;
    }

    componentDidUpdate = (prevProps, prevState) => {

        //Get All Updated Feild of Particular actions
        const { walletLedgerData } = this.props.data;

        // compare response with previous response
        if (walletLedgerData !== prevProps.walletLedgerData) {

            // check userLedgerData fetch or not
            if (walletLedgerData != null) {
                try {
                    if (validateResponseNew({ response: walletLedgerData })) {
                        let res = parseArray(walletLedgerData.WalletLedgers);

                        // If get response is not null than redirect to details screen and set data to ledger screen  
                        this.props.navigation.navigate('ArbiUserWalletLedgerListScreen',
                            {
                                item: res, allData: walletLedgerData,
                                FromDate: this.state.FromDate, ToDate: this.state.ToDate,
                                WalletId: this.state.selectedWalletsCode
                            })

                        //for clear user ledger data from Reducer
                        this.props.clearArbiUserWalletLedger();
                    } else {

                        //for clear user ledger data from Reducer
                        this.props.clearArbiUserWalletLedger();
                    }
                } catch (e) {
                    //for clear user ledger data from Reducer
                    this.props.clearArbiUserWalletLedger();
                }
            }
        }
    };


    //check validation and pass data and call api and internet condition
    submitData = async () => {


        // validate selected wallet is empty or not
        if (this.state.selectedUserName === R.strings.Please_Select) {
            this.toast.Show(R.strings.selectUser);
            return;
        }

        //Check All From Date Validation
        if (DateValidation(this.state.FromDate, this.state.ToDate, true)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true));
            return;
        }

        if (this.state.selectedWallets === R.strings.Please_Select) {
            this.toast.Show(R.strings.Select_Wallet);
            return;
        }

        else {
            //Check NetWork is Available or not
            if (await isInternet()) {

                // Bind Request for ledger data
                let requestLedgerdata = {
                    ToDate: this.state.ToDate, WalletId: this.state.selectedWalletsCode,
                    FromDate: this.state.FromDate,
                    PageNo: this.state.selectedPage,
                    PageSize: AppConfig.pageSize
                }
                // call api for user Wallet ledger
                this.props.getArbiUserWalletLedger(requestLedgerdata)
            }
        }
    }


    OnChangeUser = async (index, item) => {
        try {
            //To Check User is Selected or Not
            if (index != R.strings.Please_Select) {

                //Check NetWork is Available or not
                if (await isInternet()) {

                    //Call Get Wallet List Api 
                    this.props.getArbiUserWalletsList({ UserId: item.Id });
                    this.setState({
                        walletsVisible: true, datesVissible: false,
                        selectedUserName: index,
                        wallets: [{ value: R.strings.Please_Select }],
                        FromDate: getCurrentDate(), ToDate: getCurrentDate(),
                        selectedWallets: R.strings.Please_Select
                    })
                }
            }
            else {
                this.setState({ selectedUserNameCode: '', walletsVisible: false, selectedUserName: index, datesVissible: false, })
            }
        }
        catch (e) {
            //Catch Code here
            this.setState({ datesVissible: false, selectedUserNameCode: '', selectedUserName: index, walletsVisible: false, })
        }
    }

    onChangeWallets = async (index, item) => {
        try {
            //To Check Currecny is Selected or Not
            if (index != R.strings.Please_Select) {

                this.setState({
                    selectedWalletsCode: item.AccWalletID, datesVissible: true,
                    selectedWallets: index,
                    FromDate: getCurrentDate(), ToDate: getCurrentDate(),
                })
            }
            else {
                this.setState({ datesVissible: false, selectedWallets: index, })
            }
        }
        catch (e) {
            //Catch Code here
            this.setState({ selectedWallets: index, datesVissible: false })
        }
    }


    render() {

        //loading bit for handling progress dialog
        const { userDataFetching, userWalletsListFetching, walletLedgerFetching } = this.props.data;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }} >

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.walletLedger} isBack={true} nav={this.props.navigation} />

                {/* for progress dialog */}
                <ProgressDialog isShow={userDataFetching || userWalletsListFetching || walletLedgerFetching} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>

                            {/* Dropdown for userName */}
                            <TitlePicker
                                title={R.strings.User}
                                searchable={true}
                                array={this.state.userNames}
                                selectedValue={this.state.selectedUserName}
                                onPickerSelect={(index, object) => {
                                    this.OnChangeUser(index, object)
                                }}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />

                            {/* Dropdown for wallets */}
                            {this.state.walletsVisible &&
                                <TitlePicker
                                    title={R.strings.Select_Wallet}
                                    searchable={true}
                                    selectedValue={this.state.selectedWallets}
                                    array={this.state.wallets}
                                    onPickerSelect={(index, object) => {
                                        this.onChangeWallets(index, object)
                                    }}
                                    style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />
                            }

                            {/* DatePicker for FromDate and ToDate */}
                            {
                                this.state.datesVissible &&
                                <DatePickerWidget
                                    FromDatePickerCall={(date) => this.setState({ FromDate: date })} FromDate={this.state.FromDate}
                                    ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                                    ToDate={this.state.ToDate} />}
                        </View>
                    </ScrollView>

                    {/* To Set Submit Button */}
                    <View style={{ paddingRight: R.dimens.activity_margin, paddingLeft: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button title={R.strings.submit} onPress={this.submitData}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

function mapStateToProps(state) {
    //Updated Data For ArbitrageUserWalletsReducer,ArbitrageUserWalletLedgerReducer Data 
    let data = {
        ...state.ArbitrageUserWalletsReducer,
        ...state.ArbitrageUserWalletLedgerReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getUserDataList Action
        getUserDataList: () => dispatch(getUserDataList()),
        //Perform getArbiUserWalletsList wallet Action
        getArbiUserWalletsList: (request) => dispatch(getArbiUserWalletsList(request)),
        //Perform getArbiUserWalletLedger ledger Action
        getArbiUserWalletLedger: (requestLedgerData) => dispatch(getArbiUserWalletLedger(requestLedgerData)),
        // Perform Action for clearArbiUserWalletLedger from reducer
        clearArbiUserWalletLedger: () => dispatch(clearArbiUserWalletLedger()),
        // Perform Action for clearArbiUserWalletsData from reducer
        clearArbiUserWalletsData: () => dispatch(clearArbiUserWalletsData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArbiUserWalletLedgerScreen)