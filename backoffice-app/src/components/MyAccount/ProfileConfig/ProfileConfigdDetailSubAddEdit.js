import {
    View,
    ScrollView,
    Keyboard,
} from 'react-native';
import React from 'react'
import { Component } from 'react';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import EditText from '../../../native_theme/components/EditText'
import Button from '../../../native_theme/components/Button';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme, parseArray, parseIntVal } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { getWalletTypeMaster } from '../../../actions/PairListAction';
import SafeView from '../../../native_theme/components/SafeView';

//Create ProfileConfigdDetailSubAddEdit class
class ProfileConfigdDetailSubAddEdit extends Component {

    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();

        //for focus next field 
        this.inputs = {};

        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        //item that check edit is true or not
        let index = props.navigation.state.params && props.navigation.state.params.index

        //tabPosition for chek which tab is selected basesd on Screen name displayed
        let tabPosition = props.navigation.state.params && props.navigation.state.params.tabPosition

        //Define All State initial state
        this.state = {
            edit: edit,
            item: item,
            tabPosition: tabPosition,
            currencies: [{ value: R.strings.Please_Select }],
            selectedCurrency: edit ? item.CurrancyName : R.strings.Please_Select, //rem
            selectedCurrencyCode: edit ? item.CurrencyId : '',
            Hourly: edit ? (item.Hourly).toString() : '',
            Daily: edit ? (item.Daily).toString() : '',
            Weekly: edit ? (item.Weekly).toString() : '',
            Monthly: edit ? (item.Monthly).toString() : '',
            Qauterly: edit ? (item.Qauterly).toString() : '',
            Yearly: edit ? (item.Yearly).toString() : '',
            index: index,
            isFirstTime: true,
            wallettypesDataState: null,
        };

        //Bind all methods
        this.focusNextField = this.focusNextField.bind(this);
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //to get route list
            this.props.getWalletTypeMaster();
        }
    }

    //Add Or Update Button Presss
    submitData = async () => {

        //validations for Inputs 
        if (this.state.selectedCurrency === R.strings.Please_Select) {
            this.toast.Show(R.strings.selectCurrency)
            return;
        }
        if (isEmpty(this.state.Hourly)) {
            this.toast.Show(R.strings.enterHourlyLimit)
            return;
        }
        if (isEmpty(this.state.Daily)) {
            this.toast.Show(R.strings.enterDailyLimit)
            return;
        }
        if (isEmpty(this.state.Weekly)) {
            this.toast.Show(R.strings.enterWeeklyLimit)
            return;
        }
        if (isEmpty(this.state.Monthly)) {
            this.toast.Show(R.strings.enterMonthlyLimit)
            return;
        }
        if (isEmpty(this.state.Qauterly)) {
            this.toast.Show(R.strings.enterQuaterlyLimit)
            return;
        }
        if (isEmpty(this.state.Yearly)) {
            this.toast.Show(R.strings.enterYearlyLimit)
            return;
        }

        Keyboard.dismiss();

        //Check NetWork is Available or not
        if (await isInternet()) {

            this.request = {
                CurrancyName: this.state.selectedCurrency,
                CurrencyId: parseIntVal(this.state.selectedCurrencyCode),
                Hourly: parseIntVal(this.state.Hourly),
                Daily: parseIntVal(this.state.Daily),
                Weekly: parseIntVal(this.state.Weekly),
                Monthly: parseIntVal(this.state.Monthly),
                Qauterly: parseIntVal(this.state.Qauterly),
                Yearly: parseIntVal(this.state.Yearly),
            }

            //handle adding route at our side static
            if (!this.state.edit) {

                //refresh previous screen list
                this.props.navigation.state.params.getResponseFromAdd(this.request);
            }
            else {
                this.request = {
                    ...this.request,
                    Id: this.state.item.Id,
                }

                //refresh previous screen list for edit
                this.props.navigation.state.params.getResponseFromEdit(this.request, this.state.index);
            }
            //navigate to back scrreen
            this.props.navigation.goBack()
        }
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    shouldComponentUpdate(nextProps, nextState) {
        // stop twice api call
        return isCurrentScreen(nextProps);
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
        if (ProfileConfigdDetailSubAddEdit.oldProps !== props) {
            ProfileConfigdDetailSubAddEdit.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            const { wallettypesData } = props.data;
            if (wallettypesData) {
                try {
                    //if local wallettypesData state is null or its not null and also different then new response then and only then validate response.
                    if (state.wallettypesDataState == null || (state.wallettypesDataState != null && wallettypesData !== state.wallettypesDataState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: wallettypesData, isList: true })) {

                            let res = parseArray(wallettypesData.walletTypeMasters);

                            //for add pairCurrencyList
                            for (var keyPairList in res) {
                                let item = res[keyPairList];
                                item.value = item.CoinName;
                            }

                            let currencies = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return { ...state, currencies, wallettypesDataState: wallettypesData };
                        } else {
                            return { ...state, currencies: [{ value: R.strings.Please_Select }], wallettypesDataState: wallettypesData };
                        }
                    }
                } catch (e) {
                    return { ...state, currencies: [{ value: R.strings.Please_Select }] };
                }
            }

        }
        return null;
    }


    render() {

        //set title of screen based on which tab is selected previous screen
        let title = ''

        if (this.state.tabPosition === 0) {
            title = this.state.edit ? R.strings.updateTransactionLimit : R.strings.addTransactionLimit
        } else if (this.state.tabPosition === 1) {
            title = this.state.edit ? R.strings.updateWithdrawalLimit : R.strings.addWithdrawalLimit
        }
        else if (this.state.tabPosition === 2) {
            title = this.state.edit ? R.strings.updateTradeLimit : R.strings.addTradeLimit
        }
        else if (this.state.tabPosition === 3) {
            title = this.state.edit ? R.strings.updateDepositLimit : R.strings.addDepositLimit
        }

        const { walletTypeLoading } = this.props.data;
        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={title}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={walletTypeLoading} />

                {/* Common Toast */}
              <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>

                            {/* picker for typeName  */}
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.Currency}
                                array={this.state.currencies}
                                selectedValue={this.state.selectedCurrency}
                                onPickerSelect={(index, object) => this.setState({ selectedCurrency: index, selectedCurrencyCode: object.Id })}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />


                            {/* EditText for hourly  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.hourly}
                                placeholder={R.strings.hourly}
                                onChangeText={(text) => this.setState({ Hourly: text })}
                                value={this.state.Hourly}
                                onlyDigit={true}
                                keyboardType={'numeric'}
                                validate={true}
                                multiline={false}
                                reference={input => { this.inputs['Hourly'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('Daily') }}
                                returnKeyType={"next"}
                            />

                            {/* EditText for Daily  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.daily}
                                placeholder={R.strings.daily}
                                onChangeText={(text) => this.setState({ Daily: text })}
                                value={this.state.Daily}
                                onlyDigit={true}
                                keyboardType={'numeric'}
                                validate={true}
                                multiline={false}
                                reference={input => { this.inputs['Daily'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('Weekly') }}
                                returnKeyType={"next"}
                            />

                            {/* EditText for weekly  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.weekly}
                                placeholder={R.strings.weekly}
                                onChangeText={(text) => this.setState({ Weekly: text })}
                                value={this.state.Weekly}
                                onlyDigit={true}
                                keyboardType={'numeric'}
                                validate={true}
                                multiline={false}
                                reference={input => { this.inputs['Weekly'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('Monthly') }}
                                returnKeyType={"next"}
                            />

                            {/* EditText for monthly  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.monthly}
                                placeholder={R.strings.monthly}
                                onChangeText={(text) => this.setState({ Monthly: text })}
                                value={this.state.Monthly}
                                onlyDigit={true}
                                keyboardType={'numeric'}
                                validate={true}
                                multiline={false}
                                reference={input => { this.inputs['Monthly'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('Qauterly') }}
                                returnKeyType={"next"}
                            />

                            {/* EditText for Qauterly  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.quaterly}
                                placeholder={R.strings.quaterly}
                                onChangeText={(text) => this.setState({ Qauterly: text })}
                                value={this.state.Qauterly}
                                onlyDigit={true}
                                keyboardType={'numeric'}
                                validate={true}
                                multiline={false}
                                reference={input => { this.inputs['Qauterly'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('Yearly') }}
                                returnKeyType={"next"}
                            />

                            {/* EditText for Yearly  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.yearly}
                                placeholder={R.strings.yearly}
                                onChangeText={(text) => this.setState({ Yearly: text })}
                                value={this.state.Yearly}
                                onlyDigit={true}
                                keyboardType={'numeric'}
                                validate={true}
                                multiline={false}
                                reference={input => { this.inputs['Yearly'] = input; }}
                                returnKeyType={"done"}
                            />
                        </View>
                    </ScrollView>

                    {/* To Set Submit Button */}
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button title={R.strings.submit} onPress={this.submitData}></Button>
                    </View>
                </View>
            </ SafeView>
        );
    }
}

function mapStatToProps(state) {
    //Updated Data For ProfileConfigReducer Data 
    let data = {
        ...state.ProfileConfigReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getWalletTypeMaster List Action 
        getWalletTypeMaster: () => dispatch(getWalletTypeMaster()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(ProfileConfigdDetailSubAddEdit);