import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, parseFloatVal, parseIntVal, getDeviceID, getIPAddress } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';
import EditText from '../../../native_theme/components/EditText';
import CommonToast from '../../../native_theme/components/CommonToast';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import Button from '../../../native_theme/components/Button';
import { getProfileType, getKYCLevelList, getProfileLevelList } from '../../../actions/account/ProfileConfigAction';
import { ServiceUtilConstant } from '../../../controllers/Constants';

class ProfileConfigAddEditScreen extends Component {

    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();

        this.inputs = {}

        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        //for check redirect from dashboard or not
        let fromDashboard = props.navigation.state.params && props.navigation.state.params.fromDashboard

        //for check redirect from dashboard or not
        let onSuccess = props.navigation.state.params && props.navigation.state.params.onSuccess

        //define all initial state
        this.state = {
            edit: edit,
            item: item,
            fromDashboard: fromDashboard,
            onSuccess: onSuccess,
            profileLevelDataState: null,
            kycDataState: null,
            profileTypeDataState: null,

            isFirstTime: true,

            typeNames: [{ value: R.strings.Please_Select }],
            selectedTypename: edit ? item.TypeName : R.strings.Please_Select,
            selectedTypenameCode: edit ? item.Typeid : '',

            kycLevels: [{ value: R.strings.Please_Select }],
            selectedKycLevel: edit ? item.KYCName : R.strings.Please_Select,//rem
            selectedKycLevelCode: edit ? item.KYCLevel : '',

            profileLevels: [{ value: R.strings.Please_Select }],
            selectedProfileLevel: edit ? item.ProfileName : R.strings.Please_Select,
            selectedProfileLevelCode: edit ? item.Profilelevel : '',

            SubscriptionLimit: edit ? (item.SubscriptionAmount).toString() : '',

            profileExpiries: [
                { value: R.strings.Please_Select, code: '' },
                { value: R.strings.true, code: true },
                { value: R.strings.false, code: false },
            ],
            selectedProfileExpiry: edit ? (item.IsProfileExpiry ? R.strings.true : R.strings.false) : R.strings.Please_Select,
            selectedProfileExpiryCode: edit ? item.IsProfileExpiry : '',

            Recursives: [
                { value: R.strings.Please_Select, code: '' },
                { value: R.strings.true, code: true },
                { value: R.strings.false, code: false },
            ],
            selectedRecursive: edit ? (item.IsRecursive ? R.strings.true : R.strings.false) : R.strings.Please_Select,
            selectedRecursiveCode: edit ? item.IsRecursive : '',

            profileFee: edit ? (item.ProfileFree).toString() : '',
            depositFee: edit ? (item.DepositFee).toString() : '',
            withdrawalFee: edit ? (item.Withdrawalfee).toString() : '',
            tradingFee: edit ? (item.Tradingfee).toString() : '',
            levelName: edit ? item.LevelName : '',
            description: edit ? item.Description : '',

            IpAddress: '',
        };

        //Bind all Methods
        this.focusNextField = this.focusNextField.bind(this);
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // get IP Address
        let Ip = await getIPAddress();
        this.setState({ IpAddress: Ip })

        //Check NetWork is Available or not
        if (await isInternet()) {

            //getProfileType 
            this.props.getProfileType();
            //getKYCLevelList 
            this.props.getKYCLevelList();
            //getProfileLevelList 
            this.props.getProfileLevelList();
        }
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
        if (ProfileConfigAddEditScreen.oldProps !== props) {
            ProfileConfigAddEditScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { profileTypeData, kycData, profileLevelData } = props.data;

            if (profileTypeData) {
                try {
                    //if local profileTypeData state is null or its not null and also different then new response then and only then validate response.
                    if (state.profileTypeDataState == null || (state.profileTypeDataState != null && profileTypeData !== state.profileTypeDataState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: profileTypeData, isList: true })) {
                            let res = parseArray(profileTypeData.TypeMasterList);

                            //for add profileTypeData
                            for (var profileKey in res) {
                                let item = res[profileKey];
                                item.value = item.Type;
                            }

                            let typeNames = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return { ...state, profileTypeDataState: profileTypeData, typeNames };
                        } else {
                            return { ...state, profileTypeDataState: profileTypeData, typeNames: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    return { ...state, typeNames: [{ value: R.strings.Please_Select }] };
                }
            }

            if (kycData) {
                try {
                    //if local profileTypeData state is null or its not null and also different then new response then and only then validate response.
                    if (state.kycDataState == null || (state.kycDataState != null && kycData !== state.kycDataState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: kycData, isList: true })) {
                            let res = parseArray(kycData.KYCLevelList);

                            //for add kyc
                            for (var kyckey in res) {
                                let item = res[kyckey];
                                item.value = item.KYCName;
                            }

                            let kycLevels = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return { ...state, kycDataState: kycData, kycLevels };
                        } else {
                            return { ...state, kycDataState: kycData, kycLevels: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    return { ...state, kycLevels: [{ value: R.strings.Please_Select }] };
                }
            }

            if (profileLevelData) {
                try {
                    //if local profileLevelData state is null or its not null and also different then new response then and only then validate response.
                    if (state.profileLevelDataState == null || (state.profileLevelDataState != null && profileLevelData !== state.profileLevelDataState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: profileLevelData, isList: true })) {
                            let res = parseArray(profileLevelData.GetProfilelevelmasters);

                            //for add kyc
                            for (var profileLevelKey in res) {
                                let item = res[profileLevelKey];
                                item.value = item.ProfileName;
                            }

                            let profileLevels = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return { ...state, profileLevelDataState: profileLevelData, profileLevels };
                        } else {
                            return { ...state, profileLevelDataState: profileLevelData, profileLevels: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    return { ...state, profileLevels: [{ value: R.strings.Please_Select }] };
                }
            }

        }
        return null;
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    submitData = async () => {

        // validations for inputs
        if (this.state.selectedTypename === R.strings.Please_Select) {
            this.toast.Show(R.strings.selectTypeName);
            return;
        }
        if (this.state.selectedKycLevel === R.strings.Please_Select) {
            this.toast.Show(R.strings.selectKycLevel);
            return;
        }
        if (this.state.selectedProfileLevel === R.strings.Please_Select) {
            this.toast.Show(R.strings.selectProfileLevel);
            return;
        }
        if (isEmpty(this.state.SubscriptionLimit)) {
            this.toast.Show(R.strings.enterSubscriptionlimit)
            return;
        }
        if (this.state.selectedProfileExpiry === R.strings.Please_Select) {
            this.toast.Show(R.strings.selectProfileExpiry);
            return;
        }
        if (this.state.selectedRecursive === R.strings.Please_Select) {
            this.toast.Show(R.strings.selectRecursive);
            return;
        }
        if (isEmpty(this.state.profileFee)) {
            this.toast.Show(R.strings.enterProfileFee)
            return;
        }
        if (isEmpty(this.state.depositFee)) {
            this.toast.Show(R.strings.enterDepositFee)
            return;
        }
        if (isEmpty(this.state.withdrawalFee)) {
            this.toast.Show(R.strings.enterWithdrawalFee)
            return;
        }
        if (isEmpty(this.state.tradingFee)) {
            this.toast.Show(R.strings.enterTradingFee)
            return;
        }
        if (isEmpty(this.state.levelName)) {
            this.toast.Show(R.strings.enterLevelName)
            return;
        }
        if (isEmpty(this.state.description)) {
            this.toast.Show(R.strings.enterDescription)
            return;
        }
        else {
            //Check NetWork is Available or not
            if (await isInternet()) {

                this.request = {
                    TypeId: parseIntVal(this.state.selectedTypenameCode),
                    ProfileFree: parseFloatVal(this.state.profileFee),
                    Description: this.state.description,
                    KYCLevel: parseIntVal(this.state.selectedKycLevelCode),
                    LevelName: this.state.levelName,
                    DepositFee: parseFloatVal(this.state.depositFee),
                    Withdrawalfee: parseFloatVal(this.state.withdrawalFee),
                    Tradingfee: parseFloatVal(this.state.tradingFee),
                    Profilelevel: parseIntVal(this.state.selectedProfileLevelCode),
                    IsProfileExpiry: this.state.selectedProfileExpiryCode,
                    SubscriptionAmount: parseFloatVal(this.state.depositFee),
                    IsRecursive: this.state.selectedRecursiveCode,
                    DeviceId: await getDeviceID(),
                    Mode: ServiceUtilConstant.Mode,
                    IPAddress: this.state.IpAddress,
                    HostName: ServiceUtilConstant.hostName
                }

                if (this.state.edit) {
                    //if edit true than send item for ProfileConfigAddEditDetailScreen
                    this.props.navigation.navigate('ProfileConfigAddEditDetailScreen', { mainmRequest: this.request, edit: true, item: this.state.item, onSuccess: this.state.onSuccess })
                }
                else {
                    this.props.navigation.navigate('ProfileConfigAddEditDetailScreen', { mainmRequest: this.request, fromDashboard: this.state.fromDashboard, onSuccess: this.state.onSuccess })
                }
            }
        }
    }

    render() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }} >

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={this.state.edit ? R.strings.updateProfileConfiguration : R.strings.AddProfileConfiguration}
                    isBack={true} nav={this.props.navigation} />

                {/* for progress dialog */}
                <ProgressDialog isShow={
                    this.props.data.profileTypeLoading ||
                    this.props.data.kycLoading ||
                    this.props.data.profileLevelLoading
                } />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>

                            {/* picker for typeName  */}
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.typeName}
                                array={this.state.typeNames}
                                selectedValue={this.state.selectedTypename}
                                onPickerSelect={(index, object) => this.setState({ selectedTypename: index, selectedTypenameCode: object.id })}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />

                            {/* picker for KYCLevel  */}
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.KYCLevel}
                                array={this.state.kycLevels}
                                selectedValue={this.state.selectedKycLevel}
                                onPickerSelect={(index, object) => this.setState({ selectedKycLevel: index, selectedKycLevelCode: object.Id })}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />

                            {/* picker for KYCLevel  */}
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.profileLevel}
                                array={this.state.profileLevels}
                                selectedValue={this.state.selectedProfileLevel}
                                onPickerSelect={(index, object) => this.setState({ selectedProfileLevel: index, selectedProfileLevelCode: object.Id })}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />

                            {/* EditText for subscriptionLimit  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.subscriptionLimit}
                                placeholder={R.strings.subscriptionAmount}
                                onChangeText={(text) => this.setState({ SubscriptionLimit: text })}
                                value={this.state.SubscriptionLimit}
                                keyboardType={'numeric'}
                                validate={true}
                                multiline={false}
                                reference={input => { this.inputs['subscriptionLimit'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('profileFee') }}
                                returnKeyType={"next"}
                            />

                            {/* picker for KYCLevel  */}
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.profileExpiry}
                                array={this.state.profileExpiries}
                                selectedValue={this.state.selectedProfileExpiry}
                                onPickerSelect={(index, object) => this.setState({ selectedProfileExpiry: index, selectedProfileExpiryCode: object.Code })}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />

                            {/* picker for KYCLevel  */}
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.recursive}
                                array={this.state.Recursives}
                                selectedValue={this.state.selectedRecursive}
                                onPickerSelect={(index, object) => this.setState({ selectedRecursive: index, selectedRecursiveCode: object.Code })}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />

                            {/* EditText for profileFee  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.profileFee}
                                placeholder={R.strings.profileFee}
                                onChangeText={(text) => this.setState({ profileFee: text })}
                                value={this.state.profileFee}
                                keyboardType={'numeric'}
                                validate={true}
                                multiline={false}
                                reference={input => { this.inputs['profileFee'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('depositFee') }}
                                returnKeyType={"next"}
                            />

                            {/* EditText for profileFee  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.Depositfee}
                                placeholder={R.strings.Depositfee}
                                onChangeText={(text) => this.setState({ depositFee: text })}
                                value={this.state.depositFee}
                                keyboardType={'numeric'}
                                validate={true}
                                multiline={false}
                                reference={input => { this.inputs['depositFee'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('withdrawalFee') }}
                                returnKeyType={"next"}
                            />

                            {/* EditText for Withdrawelfee  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.Withdrawelfee}
                                placeholder={R.strings.Withdrawelfee}
                                onChangeText={(text) => this.setState({ withdrawalFee: text })}
                                value={this.state.withdrawalFee}
                                keyboardType={'numeric'}
                                validate={true}
                                multiline={false}
                                reference={input => { this.inputs['withdrawalFee'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('tradingFee') }}
                                returnKeyType={"next"}
                            />

                            {/* EditText for tradingFee  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.Tradingfee}
                                placeholder={R.strings.Tradingfee}
                                onChangeText={(text) => this.setState({ tradingFee: text })}
                                value={this.state.tradingFee}
                                keyboardType={'numeric'}
                                validate={true}
                                multiline={false}
                                reference={input => { this.inputs['tradingFee'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('levelName') }}
                                returnKeyType={"next"}
                            />

                            {/* EditText for levelName  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.levelName}
                                placeholder={R.strings.levelName}
                                onChangeText={(text) => this.setState({ levelName: text })}
                                value={this.state.levelName}
                                keyboardType={'default'}
                                multiline={false}
                                reference={input => { this.inputs['levelName'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('description') }}
                                returnKeyType={"next"}
                            />

                            {/* EditText for description  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.description}
                                placeholder={R.strings.description}
                                onChangeText={(text) => this.setState({ description: text })}
                                value={this.state.description}
                                keyboardType={'default'}
                                multiline={false}
                                reference={input => { this.inputs['description'] = input; }}
                                returnKeyType={"done"}
                            />
                        </View>
                    </ScrollView>

                    {/* To Set Submit Button */}
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button title={R.strings.next} onPress={this.submitData}></Button>
                    </View>
                </View>
            </SafeView>
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
        //Perform getProfileType Action 
        getProfileType: () => dispatch(getProfileType()),
        //Perform getKYCLevelList Action 
        getKYCLevelList: () => dispatch(getKYCLevelList()),
        //Perform getProfileLevelList Action 
        getProfileLevelList: () => dispatch(getProfileLevelList()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(ProfileConfigAddEditScreen);