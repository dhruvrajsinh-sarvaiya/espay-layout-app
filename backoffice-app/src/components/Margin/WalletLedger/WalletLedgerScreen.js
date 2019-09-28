import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation'
import Button from '../../../native_theme/components/Button'
import { changeTheme, getCurrentDate, parseArray } from '../../../controllers/CommonUtils';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CommonToast from '../../../native_theme/components/CommonToast';
import R from '../../../native_theme/R';
import DatePickerWidget from '../../../components/widget/DatePickerWidget';
import { isCurrentScreen } from '../../../components/Navigation';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import SafeView from '../../../native_theme/components/SafeView';
import { AppConfig } from '../../../controllers/AppConfig';
import { getUserDataList } from '../../../actions/PairListAction';
import { getUserMarginWallets, getMarginWalletLedger, clearMarginWalletLedger } from '../../../actions/Margin/WalletLedgerAction';
import { DateValidation } from '../../../validations/DateValidation';

class WalletLedgerScreen extends Component {
    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();

        //Define All initial State
        this.state = {
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            selectedPage: 0,
            refreshing: false,
            isFirstTime: true,

            userData: null,
            walletLedgerData: null,
            walletsData: null,

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

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            // call api for margin user list
            this.props.getUserDataList();
        }
    }

    componentWillUnmount() {

        // call api for clear Wallet ledger
        this.props.clearMarginWalletLedger();
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
        if (WalletLedgerScreen.oldProps !== props) {
            WalletLedgerScreen.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { userData, walletsData } = props.data;

            // check userData fetch or not
            if (userData) {
                try {
                    //set data to picker 
                    if (state.userData == null || (state.userData != null && userData !== state.userData)) {
                        if (validateResponseNew({ response: userData, isList: true })) {

                            // convert response data into array 
                            let res = parseArray(userData.GetUserData);

                            for (var itemUserData in res) {
                                let item = res[itemUserData]
                                item.value = item.UserName
                            }

                            let userNames = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];
                            return { ...state, userData, userNames };
                        }
                        else {
                            return { ...state, userData, userNames: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    return { ...state, userNames: [{ value: R.strings.Please_Select }] };
                }
            }

            // check userData fetch or not
            if (walletsData) {
                try {
                    //set data to picker 
                    if (state.walletsData == null || (state.walletsData != null && walletsData !== state.walletsData)) {
                        if (validateResponseNew({ response: walletsData, isList: true })) {


                            // convert response data into array 
                            let res = parseArray(walletsData.Data);

                            for (var walletDataKey in res) {
                                let item = res[walletDataKey]
                                item.value = item.WalletName
                            }

                            let wallets = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return { ...state, walletsData, wallets, walletsVisible: true };
                        }
                        else {
                            return { ...state, walletsData, wallets: [{ value: R.strings.Please_Select }], walletsVisible: true };
                        }
                    }
                } catch (e) {
                    return { ...state, wallets: [{ value: R.strings.Please_Select }], walletsVisible: false };
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

            // check marginWalletLedgerData fetch or not
            if (walletLedgerData != null) {
                try {
                    if (validateResponseNew({ response: walletLedgerData })) {
                        let res = parseArray(walletLedgerData.WalletLedgers);

                        // If get response is not null than redirect to details screen and set data to ledger screen  
                        this.props.navigation.navigate('WalletLedgerListScreen',
                            {
                                item: res,
                                allData: walletLedgerData,
                                FromDate: this.state.FromDate,
                                ToDate: this.state.ToDate,
                                WalletId: this.state.selectedWalletsCode
                            })

                        //for clear marginwallet ledger data from Reducer
                        this.props.clearMarginWalletLedger();
                    } else {

                        //for clear marginwallet ledger data from Reducer
                        this.props.clearMarginWalletLedger();
                    }
                } catch (e) { }
            }
        }
    };


    //check validation and pass data and call api and internet condition
    submitData = async () => {

        //Check All From Date Validation
        if (DateValidation(this.state.FromDate, this.state.ToDate, true)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true));
            return;
        }

        // validate selected wallet is empty or not
        if (this.state.selectedUserName === R.strings.Please_Select) {
            this.toast.Show(R.strings.selectUser);
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
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    WalletId: this.state.selectedWalletsCode,
                    PageNo: this.state.selectedPage,
                    PageSize: AppConfig.pageSize
                }
                // call api for margin Wallet ledger
                this.props.getMarginWalletLedger(requestLedgerdata)
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
                    this.props.getUserMarginWallets({ UserId: item.Id });
                    this.setState({
                        datesVissible: false,
                        walletsVisible: true,
                        selectedUserName: index,
                        wallets: [{ value: R.strings.Please_Select }],
                        FromDate: getCurrentDate(),
                        ToDate: getCurrentDate(),
                        selectedWallets: R.strings.Please_Select
                    })
                }
            }
            else {
                this.setState({ selectedUserNameCode: '', selectedUserName: index, walletsVisible: false, datesVissible: false, })
            }
        }
        catch (e) {
            //Catch Code here
            this.setState({ selectedUserNameCode: '', selectedUserName: index, walletsVisible: false, datesVissible: false, })
        }
    }

    onChangeWallets = async (index, item) => {
        try {
            //To Check Currecny is Selected or Not
            if (index != R.strings.Please_Select) {

                this.setState({
                    selectedWallets: index,
                    selectedWalletsCode: item.AccWalletID,
                    datesVissible: true,
                    FromDate: getCurrentDate(),
                    ToDate: getCurrentDate(),
                })
            }
            else {
                this.setState({ selectedWallets: index, datesVissible: false })
            }
        }
        catch (e) {
            //Catch Code here
            this.setState({ selectedWallets: index, datesVissible: false })
        }
    }


    render() {

        //loading bit for handling progress dialog
        const { userDataFetching, walletsFetching, walletLedgerFetching } = this.props.data;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }} >

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.marginWalletLedger} isBack={true} nav={this.props.navigation} />

                {/* for progress dialog */}
                <ProgressDialog isShow={userDataFetching || walletsFetching || walletLedgerFetching} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>

                            <TitlePicker
                                title={R.strings.User}
                                searchable={true}
                                array={this.state.userNames}
                                selectedValue={this.state.selectedUserName}
                                onPickerSelect={(index, object) => {
                                    this.OnChangeUser(index, object)
                                }}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />

                            {this.state.walletsVisible &&
                                <TitlePicker
                                    title={R.strings.Select_Wallet}
                                    searchable={true}
                                    array={this.state.wallets}
                                    selectedValue={this.state.selectedWallets}
                                    onPickerSelect={(index, object) => {
                                        this.onChangeWallets(index, object)
                                    }}
                                    style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />
                            }

                            {/* DatePicker for FromDate and ToDate */}
                            {
                                this.state.datesVissible &&
                                <DatePickerWidget
                                    FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                                    FromDate={this.state.FromDate}
                                    ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                                    ToDate={this.state.ToDate} />}
                        </View>
                    </ScrollView>

                    {/* To Set Submit Button */}
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button title={R.strings.submit} onPress={this.submitData}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

function mapStateToProps(state) {
    //Updated Data For WalletLedgerReducer Data 
    let data = {
        ...state.WalletLedgerReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform margin getUserDataList Action
        getUserDataList: () => dispatch(getUserDataList()),
        //Perform getUserMarginWallets wallet Action
        getUserMarginWallets: (request) => dispatch(getUserMarginWallets(request)),
        //Perform getMarginWalletLedger ledger Action
        getMarginWalletLedger: (requestLedgerData) => dispatch(getMarginWalletLedger(requestLedgerData)),
        // Perform Action for clearMarginWalletLedger from reducer
        clearMarginWalletLedger: () => dispatch(clearMarginWalletLedger()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletLedgerScreen)