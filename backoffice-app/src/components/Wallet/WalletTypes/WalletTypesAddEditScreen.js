import { View, ScrollView, Keyboard, } from 'react-native';
import React from 'react'
import { Component } from 'react';
import R from '../../../native_theme/R';
import { connect } from 'react-redux';
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import EditText from '../../../native_theme/components/EditText'
import Button from '../../../native_theme/components/Button';
import { showAlert, changeTheme, parseFloatVal, parseArray } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CommonToast from '../../../native_theme/components/CommonToast';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import { addWalletTypeMaster, clearWalletTypesData, onUpdateWalletTypeMaster } from '../../../actions/Wallet/WalletTypesAction';
import { getCurrencyList } from '../../../actions/PairListAction';
import SafeView from '../../../native_theme/components/SafeView';
import TextCard from '../../../native_theme/components/TextCard';

//Create Common class for Add Edit WalletTypes
class WalletTypesAddEditScreen extends Component {

    constructor(props) {
        super(props);


        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        //Define All State initial state
        this.state = {
            edit: edit,
            item: item,

            currencies: [{ value: R.strings.selectCurrency }],
            selectedCurrency: edit ? item.CoinName : R.strings.selectCurrency,

            description: edit ? item.Description : '',

            allowDeposition: edit ? (item.IsDepositionAllow == 1 ? true : false) : true,
            allowWithdrawal: edit ? (item.IsWithdrawalAllow == 1 ? true : false) : true,
            allowTransaction: edit ? (item.IsTransactionWallet == 1 ? true : false) : true,
            Status: edit ? (item.Status === 1 ? true : false) : false,

            isFirstTime: true,

            pairCurrencyList: null,
        };

        // Create reference
        this.toast = React.createRef();
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        if (await isInternet()) {

            //to get currency list
            if (!this.state.edit) {
                this.props.getCurrencyList();
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
        if (WalletTypesAddEditScreen.oldProps !== props) {
            WalletTypesAddEditScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            const { pairCurrencyList } = props.Listdata;

            if (pairCurrencyList) {
                try {
                    //if local currencyList state is null or its not null and also different then new response then and only then validate response.
                    if (state.pairCurrencyList == null || (state.pairCurrencyList != null && pairCurrencyList !== state.pairCurrencyList)) {

                        //if currencyList response is success then store array list else store empty list
                        if (validateResponseNew({ response: pairCurrencyList, isList: true })) {
                            let res = parseArray(pairCurrencyList.Response);

                            //for add pairCurrencyList
                            for (var keyPairList in res) {
                                let item = res[keyPairList];
                                item.value = item.SMSCode;
                            }

                            let currencies = [
                                { value: R.strings.selectCurrency },
                                ...res
                            ];

                            return { ...state, pairCurrencyList, currencies, };
                        } else {
                            return { ...state, pairCurrencyList, currencies: [{ value: R.strings.selectCurrency }], };
                        }
                    }
                } catch (e) {
                    return { ...state, currencies: [{ value: R.strings.selectCurrency }] };
                }
            }
        }
        return null;
    }


    componentDidUpdate = async (prevProps, prevState) => {

        const { addData, editData } = this.props.Listdata;

        if (addData !== prevProps.Listdata.addData) {
            // for show responce add
            if (addData) {
                try {
                    if (validateResponseNew({ response: addData, })) {
                        showAlert(R.strings.Success + '!', R.strings.insertSuccessFully, 0, () => {
                            this.props.clearWalletTypesData()
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        this.props.clearWalletTypesData()
                    }
                } catch (e) {
                    this.props.clearWalletTypesData()
                }
            }
        }

        if (editData !== prevProps.Listdata.editData) {
            // for show responce update
            if (editData) {
                try {
                    if (validateResponseNew({
                        response: editData
                    })) {
                        showAlert(R.strings.Success, R.strings.updatedSuccessFully, 0, () => {
                            this.props.clearWalletTypesData()
                            this.props.navigation.state.params.onSuccess() // if update success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        this.props.clearWalletTypesData()
                    }
                } catch (e) {
                    this.props.clearWalletTypesData()
                }
            }
        }
    }

    //Add Or Update Button Presss
    onAddEditWalletTypePress = async (Id) => {

        //validations for Inputs 
        if (this.state.selectedCurrency == R.strings.selectCurrency) {
            this.toast.Show(R.strings.selectCurrency)
            return;
        }

        if (isEmpty(this.state.description)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.description)
            return;
        }

        Keyboard.dismiss();

        if (await isInternet()) {

            this.request = {
                WalletTypeName: this.state.selectedCurrency,
                Description: this.state.description,
                IsDepositionAllow: parseFloatVal(this.state.allowDeposition === true ? 1 : 0),
                IsWithdrawalAllow: parseFloatVal(this.state.allowWithdrawal === true ? 1 : 0),
                IsTransactionWallet: parseFloatVal(this.state.allowTransaction === true ? 1 : 0),
                Status: parseFloatVal(this.state.Status === true ? 1 : 0),
            }

            if (this.state.edit) {
                this.request = {
                    ...this.request,
                    id: this.state.item.Id,
                }

                //call update chrage configuration api
                this.props.onUpdateWalletTypeMaster(this.request)
            }
            else {
                //call add charge configuration api
                this.props.addWalletTypeMaster(this.request)
            }
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        // stop twice api call
        return isCurrentScreen(nextProps);
    };

    render() {
        // Loading status for Progress bar which is fetching from reducer
        const { addLoading, editLoading, pairCurrencyLoading } = this.props.Listdata;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? (R.strings.updateWalletType) : (R.strings.addWalletType)}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={addLoading || editLoading || pairCurrencyLoading} />

                {/* for common toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                {/* Toggle Button For Status Enable/Disable Functionality */}
                <FeatureSwitch
                    isGradient
                    title={this.state.Status ? R.strings.enabled : R.strings.disabled}
                    isToggle={this.state.Status}
                    onValueChange={() => { this.setState({ Status: !this.state.Status }) }}
                />

                <View style={{
                    flex: 1, justifyContent: 'space-between',
                    paddingTop: R.dimens.widget_top_bottom_margin,
                    paddingLeft: R.dimens.activity_margin,
                    paddingRight: R.dimens.activity_margin,
                }}>

                    <View style={{ flex: 1 }}>
                        <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>

                            {/* Picker for Currency */}
                            {
                                this.state.edit ?
                                    <TextCard title={R.strings.Currency} value={this.state.selectedCurrency} />
                                    :
                                    <TitlePicker
                                        title={R.strings.Currency}
                                        array={this.state.currencies}
                                        selectedValue={this.state.selectedCurrency}
                                        style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                        onPickerSelect={(item) => this.setState({ selectedCurrency: item })} />
                            }

                            {/* EditText for description */}
                            <EditText
                                style={{ marginBottom: R.dimens.widget_top_bottom_margin, }}
                                isRequired={true}
                                maxLength={100}
                                header={R.strings.description}
                                placeholder={R.strings.description}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"done"}
                                onChangeText={(Label) => this.setState({ description: Label })}
                                value={this.state.description}
                            />

                            {/* Toggle Button For allowDeposition Enable/Disable Functionality */}
                            <FeatureSwitch
                                style={{ backgroundColor: 'transparent', paddingLeft: R.dimens.LineHeight, paddingRight: R.dimens.WidgetPadding, paddingBottom: 0, paddingTop: 0 }}
                                textStyle={{ color: R.colors.textSecondary }}
                                title={R.strings.allowDeposition}
                                isToggle={this.state.allowDeposition}
                                onValueChange={() => {
                                    this.setState({
                                        allowDeposition: !this.state.allowDeposition
                                    })
                                }}
                            />

                            {/* Toggle Button For allowWithdrawal Enable/Disable Functionality */}
                            <FeatureSwitch
                                style={{ backgroundColor: 'transparent', paddingBottom: 0, paddingLeft: R.dimens.LineHeight, paddingRight: R.dimens.WidgetPadding }}
                                textStyle={{ color: R.colors.textSecondary }}
                                title={R.strings.allowWithdrawal}
                                isToggle={this.state.allowWithdrawal}
                                onValueChange={() => {
                                    this.setState({
                                        allowWithdrawal: !this.state.allowWithdrawal
                                    })
                                }}
                            />

                            {/* Toggle Button For allowTransaction Enable/Disable Functionality */}
                            <FeatureSwitch
                                style={{ backgroundColor: 'transparent', paddingBottom: 0, paddingLeft: R.dimens.LineHeight, paddingRight: R.dimens.WidgetPadding }}
                                textStyle={{ color: R.colors.textSecondary }}
                                title={R.strings.allowTransaction}
                                isToggle={this.state.allowTransaction}
                                onValueChange={() => {
                                    this.setState({
                                        allowTransaction: !this.state.allowTransaction
                                    })
                                }}
                            />


                        </ScrollView>
                    </View>
                    <View style={{ paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Add or Edit Button */}
                        <Button title={this.state.edit ? R.strings.update : R.strings.Add} onPress={() => this.onAddEditWalletTypePress(this.state.edit ? this.state.item.Id : null)}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

function mapStateToProps(state) {
    return {
        //Updated WalletTypesReducer  
        Listdata: state.WalletTypesReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //for Currency list action 
        getCurrencyList: () => dispatch(getCurrencyList()),
        //for add  api data
        addWalletTypeMaster: (add) => dispatch(addWalletTypeMaster(add)),
        //for add  api data
        onUpdateWalletTypeMaster: (add) => dispatch(onUpdateWalletTypeMaster(add)),
        //for add edit data clear
        clearWalletTypesData: () => dispatch(clearWalletTypesData()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WalletTypesAddEditScreen)