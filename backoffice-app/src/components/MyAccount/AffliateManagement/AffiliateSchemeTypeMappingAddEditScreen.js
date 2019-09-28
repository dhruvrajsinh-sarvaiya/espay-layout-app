// AffiliateSchemeTypeMappingAddEditScreen.js
import {
    View,
    ScrollView,
} from 'react-native';
import React from 'react'
import { Component } from 'react';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import EditText from '../../../native_theme/components/EditText'
import Button from '../../../native_theme/components/Button';
import { connect } from 'react-redux';
import { showAlert, changeTheme, parseIntVal, parseArray, parseFloatVal } from '../../../controllers/CommonUtils';
import { isEmpty, isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { listAffiliateSchemeData, listAffiliateSchemeTypeData, addAffiliateSchemeTypeMapping, editAffiliateSchemeTypeMapping, affiliateSchemeMappingDataClear } from '../../../actions/account/AffiliateSchemeTypeMappingAction';
import { getWalletTypeMaster } from '../../../actions/PairListAction';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';

class AffiliateSchemeTypeMappingAddEditScreen extends Component {

    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();

        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        let intervalData = R.strings.Please_Select

        if (edit) {
            var Status = ''
            var code
            if (item.Status === 0) {
                Status = R.strings.inActive
                code = 0
            }
            else if (item.Status === 1) {
                Status = R.strings.active
                code = 1
            }
            else {
                Status = R.strings.Delete
                code = 9
            }

            if (item.CommissionTypeInterval == 0) { intervalData = 'Per Transaction' }
            if (item.CommissionTypeInterval == 1) { intervalData = 'Hourly' }
            if (item.CommissionTypeInterval == 2) { intervalData = 'Daily' }
            if (item.CommissionTypeInterval == 3) { intervalData = 'Weekly' }
        }

        //Define All State initial state
        this.state = {
            edit: edit,
            item: item,
            showBit: edit ? true : false,

            schemeName: [],
            selectedSchemeName: R.strings.Please_Select,
            schemeNameId: '',

            schemeTypeName: [],
            selectedSchemeTypeName: R.strings.Please_Select,
            schemeTypeNameId: '',

            depositionValue: edit ? '' + item.MinimumDepositionRequired : '',

            depositWalletType: [],
            selectedWallet: edit ? item.DepositWalletTypeName : R.strings.Please_Select,
            selectedWalletId: edit ? item.DepositWalletTypeId : '',

            commissionHour: [],
            selectedCommissionHour: edit ? '' + item.CommissionHour : R.strings.Please_Select,

            interval: [
                { value: R.strings.Please_Select, code: '99' },
                { value: 'Per Transaction', code: '0' },
                { value: 'Hourly', code: '1' },
                { value: 'Daily', code: '2' },
                { value: 'Weekly', code: '3' }
            ],
            selectedInterval: edit ? intervalData : R.strings.Please_Select,
            intervalId: edit ? item.CommissionTypeInterval : '',

            description: edit ? item.Description : '',

            status:
                edit ?
                    [
                        { value: R.strings.Please_Select, code: '99' },
                        { value: R.strings.active, code: '1' },
                        { value: R.strings.inActive, code: '0' },
                        { value: R.strings.Delete, code: '9' }
                    ] :
                    [
                        { value: R.strings.Please_Select, code: '99' },
                        { value: R.strings.active, code: '1' },
                        { value: R.strings.inActive, code: '0' },
                    ],
            selectedStatus: edit ? Status : R.strings.Please_Select,
            selectedStatusId: edit ? code : 99,
        };
    }

    async componentDidMount() {

        changeTheme();//Add this method to change theme based on stored theme name.

        // for set array item to commission hour 
        let data = [{ value: R.strings.Please_Select }];
        for (var i = 1; i <= 24; i++) {
            data.push({ value: '' + i })
        }
        this.setState({ commissionHour: data })
        // --------------------------

        // check Network is Available or not
        if (await isInternet()) {

            // Call api for Scheme List
            this.props.listAffiliateSchemeData({ PageNo: 0, PageSize: 100 });

            // Call api for Scheme Type List
            this.props.listAffiliateSchemeTypeData({ PageNo: 0, PageSize: 100 });

            // Call Api for Wallet Type List
            this.props.getWalletTypeMaster();
        }
    }

    componentDidUpdate = async (prevProps, prevState) => {

        const { addSchemeTypeData, addSchemeTypeDataFetch, editSchemeTypeData, editSchemeTypeDataFetch } = this.props;

        if (addSchemeTypeData !== prevProps.addSchemeTypeData) {
            // for show responce add
            if (!addSchemeTypeDataFetch) {
                try {
                    if (validateResponseNew({
                        response: addSchemeTypeData,
                    })) {
                        showAlert(R.strings.Success, addSchemeTypeData.ReturnMsg, 0, () => {
                            this.props.affiliateSchemeMappingDataClear()
                            if (this.props.navigation.state.params !== undefined) {
                                this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                                this.props.navigation.goBack()
                            }
                            else {
                                this.props.navigation.goBack()
                            }
                        });
                    } else {
                        this.props.affiliateSchemeMappingDataClear()
                    }
                } catch (e) {
                    this.props.affiliateSchemeMappingDataClear()
                }
            }
        }

        if (editSchemeTypeData !== prevProps.editSchemeTypeData) {
            // for show responce update
            if (!editSchemeTypeDataFetch) {
                try {
                    if (validateResponseNew({
                        response: editSchemeTypeData
                    })) {
                        showAlert(R.strings.Success, editSchemeTypeData.ReturnMsg, 0, () => {
                            this.props.affiliateSchemeMappingDataClear()
                            this.props.navigation.state.params.onSuccess() // if update success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        this.props.affiliateSchemeMappingDataClear()
                    }
                } catch (e) {
                    this.props.affiliateSchemeMappingDataClear()
                }
            }
        }
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
        if (AffiliateSchemeTypeMappingAddEditScreen.oldProps !== props) {
            AffiliateSchemeTypeMappingAddEditScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Field of Particular actions
            const { schemeData, schemeDataFetch, schemeTypeData, schemeTypeDataFetch, walletTypeListData, walletTypeListFetch } = props;

            //To Check scheme List Data Fetch or Not
            if (!schemeDataFetch) {
                try {
                    if (validateResponseNew({ response: schemeData, isList: true })) {
                        //Store Api Response Field and display in Screen.
                        var res = parseArray(schemeData.Data);
                        res.map((item, index) => {
                            res[index].value = item.SchemeName;
                        })

                        return { ...state, schemeName: [{ value: R.strings.Please_Select }, ...res] };
                    }
                    else {
                        return { ...state, schemeName: [], selectedSchemeName: R.strings.Please_Select, schemeNameId: '', };
                    }
                } catch (e) {
                    return { ...state, schemeName: [], selectedSchemeName: R.strings.Please_Select, schemeNameId: '', };
                }
            }

            //To Check scheme Type List Data Fetch or Not
            if (!schemeTypeDataFetch) {
                try {
                    if (validateResponseNew({ response: schemeTypeData, isList: true })) {
                        //Store Api Response Field and display in Screen.
                        var schemeTypeResponse = parseArray(schemeTypeData.Data);
                        schemeTypeResponse.map((item, index) => {
                            schemeTypeResponse[index].value = item.SchemeTypeName;
                        })

                        return { ...state, schemeTypeName: [{ value: R.strings.Please_Select }, ...schemeTypeResponse] };
                    }
                    else {
                        return { ...state, schemeTypeName: [], selectedSchemeTypeName: R.strings.Please_Select, schemeTypeNameId: '', };
                    }
                } catch (e) {
                    return { ...state, schemeTypeName: [], selectedSchemeTypeName: R.strings.Please_Select, schemeTypeNameId: '', };
                }
            }

            //To Check Wallet Type List Data Fetch or Not
            if (!walletTypeListFetch) {
                try {
                    if (validateResponseNew({ response: walletTypeListData, isList: true })) {

                        //Store Api Response Field and display in Screen.
                        var walletTypeResponse = parseArray(walletTypeListData.walletTypeMasters);
                        walletTypeResponse.map((item, index) => {
                            walletTypeResponse[index].value = item.CoinName;
                        })

                        return {
                            ...state, depositWalletType: [{ value: R.strings.Please_Select }, ...walletTypeResponse]
                        };
                    }
                    else {
                        return {
                            ...state, depositWalletType: [], selectedWallet: R.strings.Please_Select, selectedWalletId: '',
                        };
                    }
                } catch (e) {
                    return {
                        ...state, depositWalletType: [], selectedWallet: R.strings.Please_Select, selectedWalletId: '',
                    };
                }
            }
        }
        return null;
    }

    //Add Or Update Button Presss
    onPress = async () => {

        // check empty value and selected value validation

        if (!this.state.showBit && this.state.selectedSchemeName === R.strings.Please_Select) {
            this.toast.Show(R.strings.selectSchemeName)
            return;
        }

        if (!this.state.showBit && this.state.selectedSchemeTypeName === R.strings.Please_Select) {
            this.toast.Show(R.strings.selectSchemeTypeName)
            return;
        }

        if (isEmpty(this.state.depositionValue)) {
            this.toast.Show(R.strings.enterDepositionValue)
            return;
        }

        if (this.state.selectedWallet === R.strings.Please_Select) {
            this.toast.Show(R.strings.selectDepositWalletType)
            return;
        }

        if (this.state.selectedCommissionHour === R.strings.Please_Select) {
            this.toast.Show(R.strings.selectCommissionHour)
            return;
        }

        if (this.state.selectedInterval === R.strings.Please_Select) {
            this.toast.Show(R.strings.selectCommissionTypeInterval)
            return;
        }

        if (isEmpty(this.state.description)) {
            this.toast.Show(R.strings.Description_blank)
            return;
        }

        if (this.state.selectedStatus === R.strings.Please_Select) {
            this.toast.Show(R.strings.select_status)
            return;
        }

        // check Network is Available or not
        if (await isInternet()) {
            if (this.state.edit) {
                // bind request for edit Scheme Type Mapping
                let request = {
                    MappingId: this.state.item.MappingId,
                    MinimumDepositionRequired: parseFloatVal(this.state.depositionValue),
                    DepositWalletTypeId: parseIntVal(this.state.selectedWalletId),
                    CommissionHour: parseIntVal(this.state.selectedCommissionHour),
                    CommissionTypeInterval: parseIntVal(this.state.intervalId),
                    Description: this.state.description,
                    Status: parseIntVal(this.state.selectedStatusId),
                }

                // call api for edit Scheme Type Mapping
                this.props.editAffiliateSchemeTypeMapping(request)
            }
            else {
                // bind request for Add Scheme Type Mapping
                let request = {
                    SchemeMasterId: parseIntVal(this.state.schemeNameId),
                    SchemeTypeMasterId: parseIntVal(this.state.schemeTypeNameId),
                    MinimumDepositionRequired: parseFloatVal(this.state.depositionValue),
                    DepositWalletTypeId: parseIntVal(this.state.selectedWalletId),
                    CommissionHour: parseIntVal(this.state.selectedCommissionHour),
                    CommissionTypeInterval: parseIntVal(this.state.intervalId),
                    Description: this.state.description,
                    Status: parseIntVal(this.state.selectedStatusId),
                }

                // call api for add Scheme Type Mapping
                this.props.addAffiliateSchemeTypeMapping(request)
            }
        }
    }

    render() {
        const { isSchemeFetch, isSchemeTypeFetch, isWalletTypeListFetch, isAddSchemeTypeFetch, isEditSchemeTypeFetch } = this.props;
        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? R.strings.editAffiliateSchemeTypeMapping : R.strings.addAffiliateSchemeTypeMapping}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={isSchemeFetch || isSchemeTypeFetch || isWalletTypeListFetch || isAddSchemeTypeFetch || isEditSchemeTypeFetch} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{
                    flex: 1, justifyContent: 'space-between',
                    paddingLeft: R.dimens.activity_margin,
                    paddingRight: R.dimens.activity_margin,
                }}>

                    <View style={{ flex: 1 }}>
                        {/* Display Data in scrollview */}
                        <ScrollView showsVerticalScrollIndicator={false} >
                            {this.state.showBit ? null :
                                <View>
                                    {/* For  Scheme Name */}
                                    < TitlePicker
                                        style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                        isRequired={true}
                                        pickerStyle={{
                                            borderWidth: 0,
                                            justifyContent: 'center',
                                            borderRadius: R.dimens.cardBorderRadius,
                                            height: R.dimens.ButtonHeight,
                                            backgroundColor: R.colors.background,
                                            marginTop: R.dimens.widgetMargin,
                                            elevation: R.dimens.CardViewElivation,
                                            margin: R.dimens.CardViewElivation,
                                        }}
                                        title={R.strings.schemeName}
                                        array={this.state.schemeName}
                                        selectedValue={this.state.selectedSchemeName}
                                        onPickerSelect={(item, object) => this.setState({ selectedSchemeName: item, schemeNameId: object.SchemeMasterId })} />

                                    {/* For  Scheme Type Name */}
                                    <TitlePicker
                                        style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                        isRequired={true}
                                        pickerStyle={{
                                            borderWidth: 0,
                                            justifyContent: 'center',
                                            borderRadius: R.dimens.cardBorderRadius,
                                            height: R.dimens.ButtonHeight,
                                            backgroundColor: R.colors.background,
                                            marginTop: R.dimens.widgetMargin,
                                            elevation: R.dimens.CardViewElivation,
                                            margin: R.dimens.CardViewElivation,
                                        }}
                                        title={R.strings.schemeTypeName}
                                        array={this.state.schemeTypeName}
                                        selectedValue={this.state.selectedSchemeTypeName}
                                        onPickerSelect={(item, object) => this.setState({ selectedSchemeTypeName: item, schemeTypeNameId: object.SchemeTypeId })} />
                                </View>
                            }

                            {/* for Minimum Deposit Value */}
                            <EditText
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, }}
                                isRequired={true}
                                header={R.strings.minimumDepositionRequired}
                                placeholder={R.strings.minimumDepositionRequired}
                                onChangeText={(text) => this.setState({ depositionValue: text })}
                                value={this.state.depositionValue}
                                keyboardType={'numeric'}
                                validate={true}
                                validateNumeric={true}
                                maxLength={20}
                                returnKeyType={"done"}
                            />

                            {/* for deposit Wallet Type*/}
                            <TitlePicker
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                isRequired={true}
                                pickerStyle={{
                                    borderWidth: 0,
                                    justifyContent: 'center',
                                    borderRadius: R.dimens.cardBorderRadius,
                                    height: R.dimens.ButtonHeight,
                                    backgroundColor: R.colors.background,
                                    marginTop: R.dimens.widgetMargin,
                                    elevation: R.dimens.CardViewElivation,
                                    margin: R.dimens.CardViewElivation,
                                }}
                                title={R.strings.depositWalletType}
                                array={this.state.depositWalletType}
                                selectedValue={this.state.selectedWallet}
                                onPickerSelect={(item, object) => this.setState({ selectedWallet: item, selectedWalletId: object.Id })} />

                            {/*For Commission Hour*/}
                            <TitlePicker
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                isRequired={true}
                                pickerStyle={{
                                    borderWidth: 0,
                                    justifyContent: 'center',
                                    borderRadius: R.dimens.cardBorderRadius,
                                    height: R.dimens.ButtonHeight,
                                    backgroundColor: R.colors.background,
                                    marginTop: R.dimens.widgetMargin,
                                    elevation: R.dimens.CardViewElivation,
                                    margin: R.dimens.CardViewElivation,
                                }}
                                title={R.strings.commissionHour}
                                array={this.state.commissionHour}
                                selectedValue={this.state.selectedCommissionHour}
                                onPickerSelect={(item, object) => this.setState({ selectedCommissionHour: item })} />

                            {/* for commission Type Interval */}
                            <TitlePicker
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                isRequired={true}
                                pickerStyle={{
                                    borderWidth: 0,
                                    justifyContent: 'center',
                                    borderRadius: R.dimens.cardBorderRadius,
                                    height: R.dimens.ButtonHeight,
                                    backgroundColor: R.colors.background,
                                    marginTop: R.dimens.widgetMargin,
                                    elevation: R.dimens.CardViewElivation,
                                    margin: R.dimens.CardViewElivation,
                                }}
                                title={R.strings.commissionTypeInterval}
                                array={this.state.interval}
                                selectedValue={this.state.selectedInterval}
                                onPickerSelect={(item, object) => this.setState({ selectedInterval: item, intervalId: object.code })} />

                            {/* for Description */}
                            <EditText
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                isRequired={true}
                                header={R.strings.description}
                                placeholder={R.strings.description}
                                onChangeText={(text) => this.setState({ description: text })}
                                value={this.state.description}
                                maxLength={300}
                                multiline={true}
                                numberOfLines={4}
                                blurOnSubmit={true}
                                textAlignVertical={'top'}
                                returnKeyType={"done"}
                            />

                            {/* for Status */}
                            <TitlePicker
                                style={{
                                    marginTop: R.dimens.widget_top_bottom_margin,
                                    marginBottom: R.dimens.widget_top_bottom_margin,
                                }}
                                pickerStyle={{
                                    justifyContent: 'center',
                                    borderWidth: 0,
                                    borderRadius: R.dimens.cardBorderRadius,
                                    height: R.dimens.ButtonHeight,
                                    backgroundColor: R.colors.background,
                                    marginTop: R.dimens.widgetMargin,
                                    elevation: R.dimens.CardViewElivation,
                                    margin: R.dimens.CardViewElivation,
                                }}
                                isRequired={true}
                                array={this.state.status}
                                title={R.strings.Status}
                                selectedValue={this.state.selectedStatus}
                                onPickerSelect={(item, object) => this.setState({ selectedStatus: item, selectedStatusId: object.code })} />

                        </ScrollView>
                    </View>

                    <View style={{ paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Add or Edit Button */}
                        <Button title={this.state.edit ? R.strings.update : R.strings.Add} onPress={() => this.onPress()}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

function mapStateToProps(state) {
    return {
        //Updated Data of Scheme List
        isSchemeFetch: state.AffiliateSchemeTypeMappingReducer.isSchemeFetch,
        schemeData: state.AffiliateSchemeTypeMappingReducer.schemeData,
        schemeDataFetch: state.AffiliateSchemeTypeMappingReducer.schemeDataFetch,

        //Updated Data of Scheme Type List
        isSchemeTypeFetch: state.AffiliateSchemeTypeMappingReducer.isSchemeTypeFetch,
        schemeTypeData: state.AffiliateSchemeTypeMappingReducer.schemeTypeData,
        schemeTypeDataFetch: state.AffiliateSchemeTypeMappingReducer.schemeTypeDataFetch,

        //Updated Data of Wallet Type List
        isWalletTypeListFetch: state.AffiliateSchemeTypeMappingReducer.isWalletTypeListFetch,
        walletTypeListData: state.AffiliateSchemeTypeMappingReducer.walletTypeListData,
        walletTypeListFetch: state.AffiliateSchemeTypeMappingReducer.walletTypeListFetch,

        //Updated Data of Add Scheme mapping
        isAddSchemeTypeFetch: state.AffiliateSchemeTypeMappingReducer.isAddSchemeTypeFetch,
        addSchemeTypeData: state.AffiliateSchemeTypeMappingReducer.addSchemeTypeData,
        addSchemeTypeDataFetch: state.AffiliateSchemeTypeMappingReducer.addSchemeTypeDataFetch,

        //Updated Data of Edit Scheme Mapping
        isEditSchemeTypeFetch: state.AffiliateSchemeTypeMappingReducer.isEditSchemeTypeFetch,
        editSchemeTypeData: state.AffiliateSchemeTypeMappingReducer.editSchemeTypeData,
        editSchemeTypeDataFetch: state.AffiliateSchemeTypeMappingReducer.editSchemeTypeDataFetch,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Action for Scheme List
        listAffiliateSchemeData: (requestList) => dispatch(listAffiliateSchemeData(requestList)),
        //Perform Action for Scheme List
        listAffiliateSchemeTypeData: (requestList) => dispatch(listAffiliateSchemeTypeData(requestList)),
        //Perform Action for Wallet Type List
        getWalletTypeMaster: () => dispatch(getWalletTypeMaster()),
        // Perform Action for Add Scheme detail
        addAffiliateSchemeTypeMapping: (requestAddSchemeMapping) => dispatch(addAffiliateSchemeTypeMapping(requestAddSchemeMapping)),
        // Perform Action for edit Scheme detail
        editAffiliateSchemeTypeMapping: (requestEditSchemeMapping) => dispatch(editAffiliateSchemeTypeMapping(requestEditSchemeMapping)),
        //Perform Action to clear reducer data
        affiliateSchemeMappingDataClear: () => dispatch(affiliateSchemeMappingDataClear()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AffiliateSchemeTypeMappingAddEditScreen)