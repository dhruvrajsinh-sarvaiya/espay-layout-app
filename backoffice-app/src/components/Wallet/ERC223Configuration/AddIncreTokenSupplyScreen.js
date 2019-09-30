import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import SafeView from '../../../native_theme/components/SafeView';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, showAlert, parseIntVal } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import EditText from '../../../native_theme/components/EditText';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import Button from '../../../native_theme/components/Button';
import { connect } from 'react-redux';
import { getWalletType } from '../../../actions/PairListAction';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import LostGoogleAuthWidget from '../../widget/LostGoogleAuthWidget';
import CommonToast from '../../../native_theme/components/CommonToast';
import { clearIncreaseToken, } from '../../../actions/Wallet/ERC223DashboardActions';

export class AddIncreTokenSupplyScreen extends Component {

    constructor(props) {
        super(props);

        // get data from previous screen
        let { Currency, isIncrease } = props.navigation.state.params
        // Define all initial state
        this.state = {
            Amount: '',
            Remarks: '',
            isFirstTime: true,
            askTwoFA: false,
            WalletTypeId: 0,

            Currency: Currency !== undefined ? Currency : [],
            isIncrease: isIncrease,
            selectedCurrency: R.strings.selectCurrency,

            AddIncreaseTokenState: null,
            AddDecreaseTokenState: null,
            WalletDataListState: null,

            request: {},
        }

        this.inputs = {};

        // create reference
        this.toast = React.createRef();
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // Called api when currency array is empty
        if (this.state.Currency.length == 0) {

            // check internet connection
            if (await isInternet()) {
                // Call Get Wallet List Api
                this.props.getWalletType()
            }
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    // Open Google Authenticator after check all validation
    onSubmitPress = () => {
        if (isEmpty(this.state.Amount))
            this.toast.Show(R.strings.Enter_Amount)
        else if (R.strings.selectCurrency === this.state.selectedCurrency)
            this.toast.Show(R.strings.selectCurrency)
        else if (isEmpty(this.state.Remarks))
            this.toast.Show(R.strings.enterRemarks)
        else {
            let req = {
                Amount: parseIntVal(this.state.Amount),
                WalletTypeId: this.state.WalletTypeId,
                Remarks: this.state.Remarks
            }
            this.setState({ askTwoFA: true, request: req })
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        // if (state.isFirstTime) {
        //     return { ...state, isFirstTime: false, };
        // }

        // To Skip Render if old and new props are equal
        if (AddIncreTokenSupplyScreen.oldProps !== props) {
            AddIncreTokenSupplyScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { WalletDataList } = props.IncreaseTokenSupplyResult;

            // WalletDataList is not null
            if (WalletDataList) {
                try {

                    //if local WalletDataList state is null or its not null and also different then new response then and only then validate response.
                    if (state.WalletDataListState == null || (state.WalletDataListState != null && WalletDataList !== state.WalletDataListState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: WalletDataList, isList: true })) {
                            let res = parseArray(WalletDataList.Types);

                            for (var dataItem in res) {
                                let item = res[dataItem]
                                item.value = item.TypeName
                            }

                            let walletNames = [
                                { value: R.strings.selectCurrency },
                                ...res
                            ];

                            return { ...state, WalletDataListState: WalletDataList, Currency: walletNames };
                        } else {
                            return { ...state, WalletDataListState: null, Currency: [{ value: R.strings.selectCurrency }] };
                        }
                    }
                } catch (e) {
                    return { ...state, WalletDataListState: null, Currency: [{ value: R.strings.selectCurrency }] };
                }
            }
        }
        return null
    }

    componentDidUpdate(prevProps, _prevState) {

        //Get All Updated field of Particular actions
        const { AddIncreaseToken, AddDecreaseToken } = this.props.IncreaseTokenSupplyResult

        if (AddIncreaseToken !== prevProps.IncreaseTokenSupplyResult.AddIncreaseToken) {
            // AddIncreaseToken is not null
            if (AddIncreaseToken) {

                try {
                    if (this.state.AddIncreaseTokenState == null || (this.state.AddIncreaseTokenState != null && AddIncreaseToken !== this.state.AddIncreaseTokenState)) {

                        // Handle Response
                        if (validateResponseNew({ response: AddIncreaseToken, })) {
                            // Show success dialog
                            showAlert(R.strings.status, AddIncreaseToken.ReturnMsg, 0, () => {
                                this.props.clearIncreaseToken()
                                this.props.navigation.state.params.onRefresh(true)
                                this.props.navigation.goBack()
                            })
                            this.setState({ AddIncreaseTokenState: AddIncreaseToken })
                        } else {
                            // clear reducer data
                            this.props.clearIncreaseToken()
                            this.setState({ AddIncreaseTokenState: null })
                        }
                    }
                } catch (error) {
                    // clear reducer data
                    this.props.clearIncreaseToken()
                    this.setState({ AddIncreaseTokenState: null })
                }
            }
        }

        if (AddDecreaseToken !== prevProps.IncreaseTokenSupplyResult.AddDecreaseToken) {
            // AddDecreaseToken is not null
            if (AddDecreaseToken) {

                try {
                    if (this.state.AddDecreaseTokenState == null || (this.state.AddDecreaseTokenState != null && AddDecreaseToken !== this.state.AddDecreaseTokenState)) {

                        // Handle Response
                        if (validateResponseNew({ response: AddDecreaseToken, isList: true })) {
                            // Show success dialog 
                            showAlert(R.strings.status, AddDecreaseToken.ReturnMsg, 0, () => {
                                this.props.clearIncreaseToken()
                                this.props.navigation.state.params.onRefresh(true)
                                this.props.navigation.goBack()
                            })
                            this.setState({ AddDecreaseTokenState: AddDecreaseToken })
                        } else {
                            // clear reducer data
                            this.props.clearIncreaseToken()
                            this.setState({ AddDecreaseTokenState: null })
                        }
                    }
                } catch (error) {
                    // clear reducer data
                    this.props.clearIncreaseToken()
                    this.setState({ AddDecreaseTokenState: null })
                }
            }
        }
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        const { WalletDataListLoading, AddIncreaseTokenLoading, AddDecreaseTokenLoading } = this.props.IncreaseTokenSupplyResult;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={this.state.isIncrease ? R.strings.addIncreaseToken : R.strings.addDecreaseToken}
                    isBack={true}
                    onBackPress={this.onBackPress}
                    nav={this.props.navigation}
                />

                {/* Progressbar */}
                <ProgressDialog isShow={WalletDataListLoading || AddIncreaseTokenLoading || AddDecreaseTokenLoading} />

                {/* Common Toast */}
                <CommonToast ref={component => this.toast = component} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={this.styles().mainView}>

                            {/* To Set Amount in EditText */}
                            <EditText
                                header={R.strings.Amount}
                                reference={input => { this.inputs['etAmount'] = input; }}
                                placeholder={R.strings.Amount}
                                multiline={false}
                                keyboardType='numeric'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Amount) => this.setState({ Amount })}
                                onSubmitEditing={() => { this.focusNextField('etRemarks') }}
                                value={this.state.Amount}
                                validate={true}
                            />

                            {/* Picker for Currency */}
                            <TitlePicker
                                title={R.strings.Currency}
                                array={this.state.Currency}
                                selectedValue={this.state.selectedCurrency}
                                style={{ marginTop: R.dimens.margin }}
                                onPickerSelect={(item, object) => this.setState({ selectedCurrency: item, WalletTypeId: object.ID })} />

                            {/* To Set Remarks in EditText */}
                            <EditText
                                header={R.strings.remarks}
                                reference={input => { this.inputs['etRemarks'] = input; }}
                                placeholder={R.strings.remarks}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"done"}
                                onChangeText={(item) => this.setState({ Remarks: item })}
                                value={this.state.Remarks}
                            />
                        </View>
                    </ScrollView>

                    <View style={this.styles().submitButton}>
                        {/* To Set Submit Button */}
                        <Button title={R.strings.add} onPress={this.onSubmitPress}></Button>
                    </View>
                </View>

                <LostGoogleAuthWidget
                    generateTokenApi={this.state.isIncrease ? 1 : 2}
                    navigation={this.props.navigation}
                    isShow={this.state.askTwoFA}
                    ApiRequest={this.state.request}
                    onShow={() => this.setState({ askTwoFA: true })}
                    onCancel={() => this.setState({ askTwoFA: false })}
                />
            </SafeView>
        )
    }

    styles = () => {
        return {
            mainView: {
                paddingLeft: R.dimens.activity_margin,
                paddingRight: R.dimens.activity_margin,
                paddingTop: R.dimens.padding_top_bottom_margin,
                paddingBottom: R.dimens.padding_top_bottom_margin,
            },
            submitButton: {
                paddingLeft: R.dimens.activity_margin,
                paddingRight: R.dimens.activity_margin,
                paddingBottom: R.dimens.widget_top_bottom_margin,
                paddingTop: R.dimens.widget_top_bottom_margin
            }
        }
    }
}

const mapStateToProps = (state) => {
    return {
        // get position report data from reducer
        IncreaseTokenSupplyResult: state.ERC223DashboardReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    // To Perform Wallet Data Action
    getWalletType: () => dispatch(getWalletType()),
    // To Perform Clear Increase Token
    clearIncreaseToken: () => dispatch(clearIncreaseToken()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddIncreTokenSupplyScreen)