import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { changeTheme, parseArray, showAlert } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import CommonToast from '../../../native_theme/components/CommonToast';
import EditText from '../../../native_theme/components/EditText';
import { validateAlphaNumeric, isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import Button from '../../../native_theme/components/Button';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { clearWalletTrnTypes, addWalletTrnTypes } from '../../../actions/Wallet/WalletTrnTypesActions';
import { getWalletTransactionType } from '../../../actions/PairListAction';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { connect } from 'react-redux';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import TextCard from '../../../native_theme/components/TextCard';

export class AddEditWalletTrnTypesScreen extends Component {
    constructor(props) {
        super(props)

        let { item } = props.navigation.state.params
        // Define all initial state
        this.state = {
            Id: item !== undefined ? item.Id : 0,
            Status: item !== undefined ? (item.Status == 1 ? true : false) : false,
            isEdit: item !== undefined ? true : false,

            isFirstTime: false,
            WalletId: item !== undefined ? item.WalletId : '',
            Remarks: item !== undefined ? item.Remarks : '',

            TransactionType: [],
            TrnTypeId: item !== undefined ? item.TrnTypeId : 0,
            selectedTrnType: item !== undefined ? item.TrnTypeName : R.strings.selectTransactionType,
        }

        this.inputs = {}
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        if (!this.state.isEdit) {

            // check internet connection
            if (await isInternet()) {
                // Call Transaction Types Api
                this.props.getWalletTransactionType()
            }
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    // Wallet id must be in alpha numeric
    onWalletIdChange = (WalletId) => {
        if (validateAlphaNumeric(WalletId))
            this.setState({ WalletId })
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    // Call when user press on add/update button
    onSubmitPress = async () => {
        // check validation
        if (isEmpty(this.state.WalletId))
            this.toast.Show(R.strings.enterWalletId)
        else if (R.strings.selectTransactionType === this.state.selectedTrnType)
            this.toast.Show(R.strings.selectWalletType)
        else {
            // check internet connection
            if (await isInternet()) {
                let req = {
                    Id: this.state.Id,
                    WalletId: this.state.WalletId,
                    WTrnTypeMasterID: this.state.TrnTypeId,
                    Status: this.state.Status ? 1 : 0,
                    Remarks: this.state.Remarks
                }

                // Call Add Wallet Transaction Types Api
                this.props.addWalletTrnTypes(req)
            }
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (AddEditWalletTrnTypesScreen.oldProps !== props) {
            AddEditWalletTrnTypesScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { TransactionTypesData } = props.WalletTrnTypesResult

            // TransactionTypesData is not null
            if (TransactionTypesData) {
                try {
                    //if local TransactionTypesData state is null or its not null and also different then new response then and only then validate response.
                    if (state.TransactionTypesData == null || (state.TransactionTypesData != null && TransactionTypesData !== state.TransactionTypesData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: TransactionTypesData, isList: true })) {
                            let res = parseArray(TransactionTypesData.Data);

                            for (var dataItem in res) {
                                let item = res[dataItem]
                                item.value = item.TypeName
                            }

                            let transTypes = [
                                { value: R.strings.selectTransactionType },
                                ...res
                            ];

                            return { ...state, TransactionTypesData, TransactionType: transTypes };
                        } else {
                            return { ...state, TransactionTypesData, TransactionType: [{ value: R.strings.selectTransactionType }] };
                        }
                    }
                } catch (e) {
                    return { ...state, TransactionType: [{ value: R.strings.selectTransactionType }] };
                }
            }
        }
        return null
    }

    componentDidUpdate(prevProps, _prevState) {
        //Get All Updated field of Particular actions
        const { AddWalletTrnTypesData } = this.props.WalletTrnTypesResult

        // check previous props and existing props
        if (AddWalletTrnTypesData !== prevProps.WalletTrnTypesResult.AddWalletTrnTypesData) {
            // AddWalletTrnTypesData is not null
            if (AddWalletTrnTypesData) {
                try {
                    if (this.state.AddWalletTrnTypesData == null || (this.state.AddWalletTrnTypesData != null && AddWalletTrnTypesData !== this.state.AddWalletTrnTypesData)) {
                        // Handle Response
                        if (validateResponseNew({ response: AddWalletTrnTypesData })) {

                            this.setState({ AddWalletTrnTypesData })

                            showAlert(R.strings.Success + '!', AddWalletTrnTypesData.ReturnMsg, 0, () => {
                                // Clear wallet transaction types data
                                this.props.clearWalletTrnTypes()
                                // Navigate to Wallet Transaction Types List Screen
                                this.props.navigation.state.params.onRefresh(true)
                                this.props.navigation.goBack()
                            })
                        } else {
                            this.setState({ AddWalletTrnTypesData: null })
                            // Clear wallet transaction types data
                            this.props.clearWalletTrnTypes()
                        }
                    }
                } catch (error) {
                    // Clear wallet transaction types data
                    this.props.clearWalletTrnTypes()
                    this.setState({ AddWalletTrnTypesData: null })
                }
            }
        }
    }

    render() {
        // Loading status for Progress bar which is fetching from reducer
        let { TransactionTypesLoading, AddWalletTrnTypesLoading } = this.props.WalletTrnTypesResult

        let { isEdit } = this.state
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={isEdit ? R.strings.UpdateWalletTrnType : R.strings.AddWalletTrnType}
                    isBack={true}
                    onBackPress={this.onBackPress}
                    nav={this.props.navigation} />

                {/* For Toast */}
                <CommonToast ref={component => this.toast = component} />

                {/* Progressbar */}
                <ProgressDialog isShow={TransactionTypesLoading || AddWalletTrnTypesLoading} />

                {/* Toggle Button For Status Enable/Disable Functionality */}
                <FeatureSwitch
                    isGradient={true}
                    title={R.strings.Status}
                    isToggle={this.state.Status}
                    onValueChange={() => this.setState({ Status: !this.state.Status })}
                />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={this.styles().mainView}>

                            {/* To Set Wallet Id in EditText */}
                            {
                                !isEdit ?
                                    <EditText
                                        editable={true}
                                        isRequired={true}
                                        reference={input => { this.inputs['etWalletId'] = input; }}
                                        header={R.strings.WalletId}
                                        placeholder={R.strings.WalletId}
                                        multiline={false}
                                        maxLength={50}
                                        keyboardType='default'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => { this.focusNextField('etRemarks') }}
                                        onChangeText={(WalletId) => this.onWalletIdChange(WalletId)}
                                        value={this.state.WalletId}
                                    />
                                    :
                                    <TextCard title={R.strings.WalletId} value={this.state.WalletId} isRequired={true} />
                            }

                            {/* Picker for TransactionType */}
                            {
                                !isEdit ?
                                    <TitlePicker
                                        style={{ marginTop: R.dimens.margin }}
                                        isRequired={true}
                                        title={R.strings.TransactionType}
                                        array={this.state.TransactionType}
                                        selectedValue={this.state.selectedTrnType}
                                        onPickerSelect={(item, object) => this.setState({ selectedTrnType: item, TrnTypeId: object.TypeId })} />
                                    :
                                    <TextCard title={R.strings.TransactionType} value={this.state.selectedTrnType} isRequired={true} />
                            }

                            {/* To Set Remarks in EditText */}
                            <EditText
                                reference={input => { this.inputs['etRemarks'] = input; }}
                                header={R.strings.remarks}
                                placeholder={R.strings.remarks}
                                multiline={false}
                                maxLength={300}
                                keyboardType='default'
                                returnKeyType={"done"}
                                onChangeText={(Remarks) => this.setState({ Remarks })}
                                value={this.state.Remarks}
                            />
                        </View>
                    </ScrollView>

                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Submit Button */}
                        <Button
                            title={isEdit ? R.strings.update : R.strings.add}
                            onPress={this.onSubmitPress}
                        >

                        </Button>
                    </View>
                </View>
            </SafeView>
        )
    }

    styles = () => {
        return {
            mainView: {
                paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin,
                paddingTop: R.dimens.padding_top_bottom_margin, paddingBottom: R.dimens.padding_top_bottom_margin,
            }
        }
    }
}

const mapStateToProps = (state) => {
    return {
        // get wallet transaction data from reducer
        WalletTrnTypesResult: state.WalletTrnTypesReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // To Perform Clear Wallet Transaction Types Action
    clearWalletTrnTypes: () => dispatch(clearWalletTrnTypes()),
    // Wallet Transaction Types Action
    getWalletTransactionType: () => dispatch(getWalletTransactionType()),
    // Add Wallet Transaction Types Action
    addWalletTrnTypes: (payload) => dispatch(addWalletTrnTypes(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddEditWalletTrnTypesScreen)