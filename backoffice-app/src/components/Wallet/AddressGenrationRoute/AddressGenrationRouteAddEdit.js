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
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, isEmpty, isScriptTag, isHtmlTag } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { getWithdrawRouteInfo } from '../../../actions/Wallet/AddressGenrationRouteAction';
import SafeView from '../../../native_theme/components/SafeView';

//Create AddressGenrationRouteAddEdit class
class AddressGenrationRouteAddEdit extends Component {

    constructor(props) {
        super(props);

        //for focus next field 
        this.inputs = {};

        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        //item that check count is for Priority
        let count = props.navigation.state.params && props.navigation.state.params.count

        // TrnType=9 for address genration route else withdraw route
        let TrnType = props.navigation.state.params && props.navigation.state.params.TrnType

        //item that check edit is true or not
        let index = props.navigation.state.params && props.navigation.state.params.index

        //Define All State initial state
        this.state = {
            TrnType: TrnType,
            edit: edit,
            item: item,
            count: count,
            Priority: edit ? (item.Priority).toString() : (count + 1).toString(),
            ProviderWalletID: edit ? item.ProviderWalletID : '',
            AssetName: edit ? item.AssetName : '',
            ConfirmationCount: edit ? (item.ConfirmationCount).toString() : '',
            AccountNoLen: edit ? (item.AccountNoLen).toString() : '',
            AccNoStartsWith: edit ? item.AccNoStartsWith : '',
            AccNoValidationRegex: edit ? item.AccNoValidationRegex : '',
            availableRoute: null,
            routes: [{ value: R.strings.Please_Select }],
            selectedRoute: edit ? item.RouteName : R.strings.Please_Select,
            selectedRouteId: edit ? item.ServiceProDetailId : 0,
            ConvertAmount: edit ? (item.ConvertAmount).toString() : '',
            isFirstTime: true,
            id: edit ? item.Id : 0,// fro static add key for add
            index: index
        };

        // Create reference
        this.toast = React.createRef();
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        if (await isInternet()) {

            //to get route list
            this.props.getWithdrawRouteInfo();
        }
    }

    //Add Or Update Button Presss
    onAddRoute = async (Id) => {

        //validations for Inputs 
        if (isEmpty(this.state.Priority)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.priority)
            return;
        }
        if (this.state.selectedRoute === R.strings.Please_Select || this.state.selectedRouteId === '') {
            this.toast.Show(R.strings.select + ' ' + R.strings.Route)
            return;
        }
        if (isEmpty(this.state.ProviderWalletID)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.providerWalletId)
            return;
        }
        if (isEmpty(this.state.AssetName)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.assetName)
            return;
        }
        if (isEmpty(this.state.ConfirmationCount)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.confirmationCount)
            return;
        }

        if (this.state.TrnType === 9) {
            if (isEmpty(this.state.AccountNoLen)) {
                this.toast.Show(R.strings.enter + ' ' + R.strings.accountNoLength)
                return;
            }
            if (isScriptTag(this.state.AccountNoLen.toString())) {
                this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.accountNoLength)
                return;
            }
            if (isHtmlTag(this.state.AccountNoLen.toString())) {
                this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.accountNoLength)
                return;
            }
            if (isEmpty(this.state.AccNoStartsWith)) {
                this.toast.Show(R.strings.enter + ' ' + R.strings.accountNoStartsWith)
                return;
            }
            if (isScriptTag(this.state.AccNoStartsWith)) {
                this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.accountNoStartsWith)
                return;
            }
            if (isHtmlTag(this.state.AccNoStartsWith.toString())) {
                this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.accountNoStartsWith)
                return;
            }
            if (isEmpty(this.state.AccNoValidationRegex)) {
                this.toast.Show(R.strings.enter + ' ' + R.strings.accountNoValidation)
                return;
            }
            if (isScriptTag(this.state.AccNoValidationRegex)) {
                this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.accountNoValidation)
                return;
            }
            if (isHtmlTag(this.state.AccNoValidationRegex.toString())) {
                this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.accountNoValidation)
                return;
            }
        } else {
            if (isEmpty(this.state.ConvertAmount)) {
                this.toast.Show(R.strings.enter + ' ' + R.strings.convertAmount)
                return;
            }
        }

        Keyboard.dismiss();

        if (await isInternet()) {

            this.request = {
                Id: this.state.id,
                Priority: this.state.Priority,
                RouteName: this.state.selectedRoute,
                ProviderWalletID: this.state.ProviderWalletID,
                AssetName: this.state.AssetName,
                ConfirmationCount: this.state.ConfirmationCount,
                ServiceProDetailId: this.state.selectedRouteId,
                AccNoStartsWith: this.state.AccNoStartsWith,
                AccNoValidationRegex: this.state.AccNoValidationRegex,
                AccountNoLen: this.state.AccountNoLen,
                ConvertAmount: this.state.ConvertAmount,
            }

            //handle adding route at our side static
            if (!this.state.edit) {
                //refresh previous screen list
                this.props.navigation.state.params.getResponseFromAdd(this.request);
            }
            else {

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

    shouldComponentUpdate = (nextProps, nextState) => {
        // stop twice api call
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
        if (AddressGenrationRouteAddEdit.oldProps !== props) {
            AddressGenrationRouteAddEdit.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            const { availableRoute } = props.data;

            if (availableRoute) {
                try {
                    //if local availableRoute state is null or its not null and also different then new response then and only then validate response.
                    if (state.availableRoute == null || (state.availableRoute != null && availableRoute !== state.availableRoute)) {

                        //if currencyList response is success then store array list else store empty list
                        if (validateResponseNew({ response: availableRoute, isList: true })) {

                            let res = parseArray(availableRoute.Response);

                            //for add availableRoute
                            for (var keyRoute in res) {
                                let item = res[keyRoute];
                                item.value = item.ProviderName;
                            }

                            let routes = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return { ...state, routes, availableRoute };
                        } else {
                            return { ...state, routes: [{ value: R.strings.Please_Select }], availableRoute };
                        }
                    }
                } catch (e) {
                    return { ...state, routes: [{ value: R.strings.Please_Select }] };
                }
            }
        }
        return null;
    }


    render() {
        // Loading status for Progress bar which is fetching from reducer
        const { loadingAvailableRoute } = this.props.data;

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? (R.strings.updateRoute) : (R.strings.addRoute)}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={loadingAvailableRoute} />

                {/* for common toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{
                    flex: 1, justifyContent: 'space-between',
                    paddingLeft: R.dimens.activity_margin,
                    paddingRight: R.dimens.activity_margin,
                    paddingTop: R.dimens.widget_top_bottom_margin
                }}>

                    <View style={{ flex: 1 }}>

                        <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>

                            {/* EditText for priority */}
                            <EditText
                                isRequired={true}
                                editable={false}
                                header={R.strings.priority}
                                placeholder={R.strings.priority}
                                multiline={false}
                                keyboardType='numeric'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                reference={input => { this.inputs['Priority'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('ProviderWalletID') }}
                                onChangeText={(Label) => this.setState({ Priority: Label })}
                                value={this.state.Priority}
                                validate={true}
                                onlyDigit={true}
                            />

                            {/* Picker for Route */}
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.Route}
                                array={this.state.routes}
                                selectedValue={this.state.selectedRoute}
                                onPickerSelect={(index, object) => this.setState({ selectedRoute: index, selectedRouteId: object.Id })}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                            />

                            {/* EditText for providerWalletId */}
                            <EditText
                                isRequired={true}
                                header={R.strings.providerWalletId}
                                reference={input => { this.inputs['ProviderWalletID'] = input; }}
                                placeholder={R.strings.providerWalletId}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ ProviderWalletID: Label })}
                                onSubmitEditing={() => { this.focusNextField('AssetName') }}
                                value={this.state.ProviderWalletID}
                            />

                            {/* EditText for assetName */}
                            <EditText
                                isRequired={true}
                                header={R.strings.assetName}
                                reference={input => { this.inputs['AssetName'] = input; }}
                                placeholder={R.strings.assetName}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ AssetName: Label })}
                                onSubmitEditing={() => { this.focusNextField('ConfirmationCount') }}
                                value={this.state.AssetName}
                            />

                            {/* EditText for Confirmation Count */}
                            <EditText
                                isRequired={true}
                                header={R.strings.confirmationCount}
                                reference={input => { this.inputs['ConfirmationCount'] = input; }}
                                placeholder={R.strings.confirmationCount}
                                multiline={false}
                                keyboardType='numeric'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ ConfirmationCount: Label })}
                                onSubmitEditing={() => { this.focusNextField(this.state.TrnType == 9 ? 'AccountNoLen' : 'convertAmount') }}
                                value={this.state.ConfirmationCount}
                                validate={true}
                                onlyDigit={true}
                            />
                            {this.state.TrnType == 9 &&
                                <View>

                                    {/* EditText for accountNoLength */}
                                    <EditText
                                        isRequired={true}
                                        header={R.strings.accountNoLength}
                                        reference={input => { this.inputs['AccountNoLen'] = input; }}
                                        placeholder={R.strings.accountNoLength}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ AccountNoLen: Label })}
                                        onSubmitEditing={() => { this.focusNextField('AccNoStartsWith') }}
                                        value={this.state.AccountNoLen}
                                        validate={true}
                                        onlyDigit={true}
                                    />

                                    {/* EditText for accountNoStartsWith  */}
                                    <EditText
                                        isRequired={true}
                                        header={R.strings.accountNoStartsWith}
                                        reference={input => { this.inputs['AccNoStartsWith'] = input; }}
                                        placeholder={R.strings.accountNoStartsWith}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"next"}
                                        maxLength={30}
                                        onChangeText={(Label) => this.setState({ AccNoStartsWith: Label })}
                                        onSubmitEditing={() => { this.focusNextField('AccNoValidationRegex') }}
                                        value={this.state.AccNoStartsWith}
                                    />

                                    {/* EditText for accountNoValidation */}
                                    <EditText
                                        style={{ marginBottom: R.dimens.widget_top_bottom_margin, }}
                                        isRequired={true}
                                        header={R.strings.accountNoValidation}
                                        reference={input => { this.inputs['AccNoValidationRegex'] = input; }}
                                        placeholder={R.strings.accountNoValidation}
                                        multiline={false}
                                        keyboardType='default'
                                        returnKeyType={"done"}
                                        maxLength={80}
                                        onChangeText={(Label) => this.setState({ AccNoValidationRegex: Label })}
                                        value={this.state.AccNoValidationRegex}
                                    />

                                </View>
                            }

                            {/* EditText for convertAmount */}
                            {this.state.TrnType == 6 &&
                                < EditText
                                    isRequired={true}
                                    header={R.strings.convertAmount}
                                    reference={input => { this.inputs['convertAmount'] = input; }}
                                    placeholder={R.strings.convertAmount}
                                    multiline={false}
                                    keyboardType='numeric'
                                    returnKeyType={"done"}
                                    onChangeText={(Label) => this.setState({ ConvertAmount: Label })}
                                    value={this.state.ConvertAmount}
                                    validate={true}
                                />
                            }

                        </ScrollView>
                    </View>
                    <View style={{ paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Add or Edit Button */}
                        <Button title={this.state.edit ? R.strings.update : R.strings.Add} onPress={() => this.onAddRoute(this.state.edit ? this.state.item.Id : null)}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

function mapStatToProps(state) {
    //Updated Data For AddressGenrationRouteReducer Data 
    let data = {
        ...state.AddressGenrationRouteReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //get route list
        getWithdrawRouteInfo: () => dispatch(getWithdrawRouteInfo())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(AddressGenrationRouteAddEdit);