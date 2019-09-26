// ApiKeyPolicySettingScreen.js
import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { isCurrentScreen } from '../../../components/Navigation';
import { connect } from 'react-redux'
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import EditText from '../../../native_theme/components/EditText';
import { changeTheme, parseArray, showAlert, parseIntVal } from '../../../controllers/CommonUtils';
import { isInternet, isEmpty, validateResponseNew, } from '../../../validations/CommonValidation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CommonToast from '../../../native_theme/components/CommonToast';
import R from '../../../native_theme/R';
import IndicatorViewPager from '../../../native_theme/components/IndicatorViewPager';
import { TitlePicker } from '../../widget/ComboPickerWidget'
import { getApiKeyPolicy, updateApiKeyPolicy, clearApiKeyPolicy } from '../../../actions/ApiKeyConfiguration/ApiKeyPolicySettingAction';
import SafeView from '../../../native_theme/components/SafeView';
import BottomButton from '../../../native_theme/components/BottomButton';

class ApiKeyPolicySettingScreen extends Component {

    constructor(props) {
        super(props)

        //Define All State initial state
        this.state = {
            ApiKeyPolicySettingDataState: null,

            tabNames: [R.strings.addNewKeys, R.strings.deleteKeys],
            tabPosition: 0,
            isFirstTime: true,

            id: '',
            maxDayKeyGen: '',
            keyGenPerDay: '',
            keyGen: '',

            delMaxLimit: '',
            delKeyPerDay: '',
            deleteKey: '',

            genType: [{ value: R.strings.frequencyType, id: 0 }, { value: R.strings.day, id: 1 }, { value: R.strings.week, id: 4 }, { value: R.strings.month, id: 2 }, { value: R.strings.Year, id: 3 }],
            selectedGenType: R.strings.frequencyType,
            genTypeId: 0,

            delType: [{ value: R.strings.frequencyType, id: 0 }, { value: R.strings.day, id: 1 }, { value: R.strings.week, id: 4 }, { value: R.strings.month, id: 2 }, { value: R.strings.Year, id: 3 }],
            selectedDelType: R.strings.frequencyType,
            delTypeId: 0

        };

        // create reference
        this.toast = React.createRef();

        // for focus on next field
        this.inputs = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme()

        // Check interner connection is available or not
        if (await isInternet()) {

            // Call Api Key Policy  Api
            this.props.getApiKeyPolicy()
        }
    }

    componentDidUpdate = async (prevProps, prevState) => {
        //Get All Updated field of Particular actions
        const { updateApiKeyPolicySetting } = this.props.keyPolicyResult;

        // check previous props and existing props
        if (updateApiKeyPolicySetting !== prevProps.keyPolicyResult.updateApiKeyPolicySetting) {
            // for show responce Update or Add
            if (updateApiKeyPolicySetting) {
                try {
                    //If updateApiKeyPolicySetting response is validate than show success dialog else show failure dialog
                    if (validateResponseNew({
                        response: updateApiKeyPolicySetting,
                    })) {
                        showAlert(R.strings.Success, R.strings.updateSuccessfully, 0, () => {
                            this.props.clearApiKeyPolicy()
                            this.props.navigation.goBack()
                        });
                    } else {
                        this.props.clearApiKeyPolicy()
                    }
                } catch (e) {
                    this.props.clearApiKeyPolicy()
                }
            }
        }
    }

    //this Method is used to focus on next feild 
    focusNextField(id) {
        this.inputs[id].focus();
    }

    // user press on next page button
    onNextPagePress = () => {
        if (this.state.tabPosition < this.state.tabNames.length - 1) {
            let pos = this.state.tabPosition + 1

            if (this.refs['PairConfigurationTab']) {
                this.refs['PairConfigurationTab'].setPage(pos)
            }
        }
    }

    // Called when onPage Scrolling
    onPageScroll = (scrollData) => {
        let { position } = scrollData
        if (position != this.state.tabPosition) {
            this.setState({ tabPosition: position, })
        }
    }

    // user press on prev page button
    onPrevPagePress = () => {
        if (this.state.tabPosition > 0) {
            let pos = this.state.tabPosition - 1

            if (this.refs['PairConfigurationTab']) {
                this.refs['PairConfigurationTab'].setPage(pos)
            }
        }
    }

    // on submit check validation and call api for add or update
    onSubmitPress = async () => {

        if (isEmpty(this.state.maxDayKeyGen))
            this.toast.Show(R.strings.entermaxLimitKeyGeneration)
        else if (isEmpty(this.state.keyGenPerDay))
            this.toast.Show(R.strings.enterfrequencyKeyGenerationPerDay)
        else if (isEmpty(this.state.keyGen))
            this.toast.Show(R.strings.enterfrequencyKeyGeneration)
        else if (this.state.selectedGenType === R.strings.frequencyType)
            this.toast.Show(R.strings.selectAddFrequencyType)
        else if (isEmpty(this.state.delMaxLimit))
            this.toast.Show(R.strings.entermaxLimitDeleteKey)
        else if (isEmpty(this.state.delKeyPerDay))
            this.toast.Show(R.strings.enterfrequencyDeleteKeyPerDay)
        else if (isEmpty(this.state.deleteKey))
            this.toast.Show(R.strings.enterfrequencyofDeleteKey)
        else if (this.state.selectedDelType === R.strings.frequencyType)
            this.toast.Show(R.strings.selectDeleteFrequencyType)
        else {
            // Check NetWork is Available or not
            if (await isInternet()) {
                let Request = {
                    AddMaxLimit: parseIntVal(this.state.maxDayKeyGen),
                    AddPerDayFrequency: parseIntVal(this.state.keyGenPerDay),
                    AddFrequency: parseIntVal(this.state.keyGen),
                    AddFrequencyType: parseIntVal(this.state.genTypeId),
                    DeleteMaxLimit: parseIntVal(this.state.delMaxLimit),
                    DeletePerDayFrequency: parseIntVal(this.state.delKeyPerDay),
                    DeleteFrequency: parseIntVal(this.state.deleteKey),
                    DeleteFrequencyType: parseIntVal(this.state.delTypeId),
                    ID: parseIntVal(this.state.id),
                }
                // call api for update  
                this.props.updateApiKeyPolicy(Request)
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
        if (ApiKeyPolicySettingScreen.oldProps !== props) {
            ApiKeyPolicySettingScreen.oldProps = props;
        } else {
            return null;
        }

        // check for currenct screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { ApiKeyPolicySettingData, } = props.keyPolicyResult;

            if (ApiKeyPolicySettingData) {
                try {
                    //if local currencyList state is null or its not null and also different then new response then and only then validate response.
                    if (state.ApiKeyPolicySettingDataState == null || (state.ApiKeyPolicySettingDataState != null && ApiKeyPolicySettingData !== state.ApiKeyPolicySettingDataState)) {

                        //if currencyList response is success then store array list else store empty list
                        if (validateResponseNew({ response: ApiKeyPolicySettingData, isList: true })) {
                            let res = parseArray(ApiKeyPolicySettingData.Response);
                            let genTypeValue = R.strings.frequencyType;
                            let delTypeValue = R.strings.frequencyType;

                            if (res[0].AddFrequencyType == 1) { genTypeValue = R.strings.day }
                            if (res[0].AddFrequencyType == 2) { genTypeValue = R.strings.month }
                            if (res[0].AddFrequencyType == 3) { genTypeValue = R.strings.Year }
                            if (res[0].AddFrequencyType == 4) { genTypeValue = R.strings.week }

                            if (res[0].DeleteFrequencyType == 1) { delTypeValue = R.strings.day }
                            if (res[0].DeleteFrequencyType == 2) { delTypeValue = R.strings.month }
                            if (res[0].DeleteFrequencyType == 3) { delTypeValue = R.strings.Year }
                            if (res[0].DeleteFrequencyType == 4) { delTypeValue = R.strings.week }

                            return {
                                ...state, ApiKeyPolicySettingDataState: ApiKeyPolicySettingData,
                                id: res[0].ID,
                                maxDayKeyGen: res[0].AddMaxLimit,
                                keyGenPerDay: res[0].AddPerDayFrequency,
                                keyGen: res[0].AddFrequency,

                                delMaxLimit: res[0].DeleteMaxLimit,
                                delKeyPerDay: res[0].DeletePerDayFrequency,
                                deleteKey: res[0].DeleteFrequency,
                                genTypeId: res[0].AddFrequencyType,
                                delTypeId: res[0].DeleteFrequencyType,
                                selectedGenType: genTypeValue,
                                selectedDelType: delTypeValue,
                            };
                        } else {
                            return {
                                ...state, ApiKeyPolicySettingDataState: ApiKeyPolicySettingData,
                                id: '', maxDayKeyGen: '', keyGenPerDay: '', keyGen: '', delMaxLimit: '',
                                delKeyPerDay: '', deleteKey: '', genTypeId: 0, delTypeId: 0, selectedGenType: R.strings.frequencyType,
                                selectedDelType: R.strings.frequencyType,
                            };
                        }
                    }
                } catch (e) {

                    return {
                        ...state, id: '', maxDayKeyGen: '', keyGenPerDay: '', keyGen: '', delMaxLimit: '',
                        delKeyPerDay: '', deleteKey: '', genTypeId: 0, delTypeId: 0, selectedGenType: R.strings.frequencyType,
                        selectedDelType: R.strings.frequencyType,
                    };
                }
            }
        }
        return null;
    }


    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        let { ApiKeyPolicySettingLoading, updateApiKeyPolicySettingLoading } = this.props.keyPolicyResult

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={R.strings.apiKeyPolicySetting}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Common progress dialog */}
                <ProgressDialog isShow={ApiKeyPolicySettingLoading || updateApiKeyPolicySettingLoading} />

                {/* Common Toast */}
                <CommonToast ref={component => this.toast = component} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    {/* View Pager Indicator (Tab) */}
                    <IndicatorViewPager
                        ref='PairConfigurationTab'
                        titles={this.state.tabNames}
                        numOfItems={2}
                        horizontalScroll={false}
                        isGradient={true}
                        style={{ marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin, }}
                        onPageScroll={this.onPageScroll}>

                        {/* First Tab */}
                        <View>
                            <View style={{
                                paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin,
                                paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin,
                            }}>
                                <ScrollView showsVerticalScrollIndicator={false}>

                                    {/* Inputfield for maxLimitKeyGeneration */}
                                    <EditText
                                        isRequired={true}
                                        style={{ marginTop: 0 }}
                                        header={R.strings.maxLimitKeyGeneration}
                                        reference={input => { this.inputs['etmaxlimit'] = input; }}
                                        placeholder={R.strings.maxLimitKeyGeneration}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        maxLength={10}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ maxDayKeyGen: Label })}
                                        onSubmitEditing={() => { this.focusNextField('etKeyGenPerDay') }}
                                        value={this.state.maxDayKeyGen + ''}
                                        validate={true}
                                        onlyDigit={true}
                                    />

                                    {/* Inputfield for frequencyKeyGenerationPerDay */}
                                    <EditText
                                        isRequired={true}
                                        header={R.strings.frequencyKeyGenerationPerDay}
                                        reference={input => { this.inputs['etKeyGenPerDay'] = input; }}
                                        placeholder={R.strings.frequencyKeyGenerationPerDay}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        maxLength={10}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ keyGenPerDay: Label })}
                                        onSubmitEditing={() => { this.focusNextField('etKeyGen') }}
                                        value={this.state.keyGenPerDay + ''}
                                        validate={true}
                                        onlyDigit={true}
                                    />

                                    {/* Inputfield for frequencyKeyGeneration */}
                                    <EditText
                                        isRequired={true}
                                        reference={input => { this.inputs['etKeyGen'] = input; }}
                                        header={R.strings.frequencyKeyGeneration}
                                        placeholder={R.strings.frequencyKeyGeneration}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"done"}
                                        maxLength={10}
                                        onChangeText={(Label) => this.setState({ keyGen: Label })}
                                        value={this.state.keyGen + ''}
                                        validate={true}
                                        onlyDigit={true}
                                    />

                                    {/* Picker for frequencyType */}
                                    <TitlePicker
                                        isRequired={true}
                                        title={R.strings.frequencyType}
                                        array={this.state.genType}
                                        selectedValue={this.state.selectedGenType}
                                        onPickerSelect={(index, object) => this.setState({ selectedGenType: index, genTypeId: object.id })}
                                        style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widget_top_bottom_margin }}
                                    />

                                </ScrollView>
                            </View>
                        </View>

                        {/* Second Tab */}
                        <View>
                            <View style={{
                                paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin,
                                paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin,
                            }}>
                                <ScrollView showsVerticalScrollIndicator={false}>

                                    {/* Inputfield for maxLimitDeleteKey */}
                                    <EditText
                                        style={{ marginTop: 0 }}
                                        isRequired={true}
                                        header={R.strings.maxLimitDeleteKey}
                                        reference={input => { this.inputs['etDeletemaxlimit'] = input; }}
                                        placeholder={R.strings.maxLimitDeleteKey}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        maxLength={10}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ delMaxLimit: Label })}
                                        onSubmitEditing={() => { this.focusNextField('etDeletePerDay') }}
                                        value={this.state.delMaxLimit + ''}
                                        validate={true}
                                        onlyDigit={true}
                                    />

                                    {/* Inputfield for frequencyDeleteKeyPerDay */}
                                    <EditText
                                        isRequired={true}
                                        header={R.strings.frequencyDeleteKeyPerDay}
                                        reference={input => { this.inputs['etDeletePerDay'] = input; }}
                                        placeholder={R.strings.frequencyDeleteKeyPerDay}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        maxLength={10}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ delKeyPerDay: Label })}
                                        onSubmitEditing={() => { this.focusNextField('etDeleteKeyGen') }}
                                        value={this.state.delKeyPerDay + ''}
                                        validate={true}
                                        onlyDigit={true}
                                    />

                                    {/* Inputfield for frequencyofDeleteKey */}
                                    <EditText
                                        isRequired={true}
                                        header={R.strings.frequencyofDeleteKey}
                                        reference={input => { this.inputs['etDeleteKeyGen'] = input; }}
                                        placeholder={R.strings.frequencyofDeleteKey}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"done"}
                                        maxLength={10}
                                        onChangeText={(Label) => this.setState({ deleteKey: Label })}
                                        value={this.state.deleteKey + ''}
                                        validate={true}
                                        onlyDigit={true}
                                    />

                                    {/* picker for frequencyType */}
                                    <TitlePicker
                                        isRequired={true}
                                        title={R.strings.frequencyType}
                                        array={this.state.delType}
                                        selectedValue={this.state.selectedDelType}
                                        onPickerSelect={(index, object) => this.setState({ selectedDelType: index, delTypeId: object.id })}
                                        style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widget_top_bottom_margin }}
                                    />
                                </ScrollView>
                            </View>
                        </View>
                    </IndicatorViewPager>

                    <View style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        margin: R.dimens.margin
                    }}
                    >
                        {
                            this.state.tabPosition > 0 ?
                                <BottomButton title={R.strings.Prev}
                                    onPress={() => this.onPrevPagePress()} />
                                :
                                null
                        }
                        <View style={{ flex: 1 }} />
                        {
                            (this.state.tabPosition < this.state.tabNames.length - 1) ?
                                <BottomButton title={R.strings.next} onPress={() => this.onNextPagePress()} />
                                :
                                <BottomButton title={R.strings.update} onPress={() => this.onSubmitPress()} />
                        }
                    </View>
                </View>
            </SafeView >
        );
    }
}

/* return state from reducer */
const mapStateToProps = (state) => {
    // data from ApiKeyPolicySettingReducer 
    return {
        keyPolicyResult: state.ApiKeyPolicySettingReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // call api for Api Key Policy  Api
    getApiKeyPolicy: () => dispatch(getApiKeyPolicy()),

    // action for update Api Key Policy  Api
    updateApiKeyPolicy: (request) => dispatch(updateApiKeyPolicy(request)),

    //Perform action to clear Api Key Policy  Api
    clearApiKeyPolicy: () => dispatch(clearApiKeyPolicy())
})

export default connect(mapStateToProps, mapDispatchToProps)(ApiKeyPolicySettingScreen);
