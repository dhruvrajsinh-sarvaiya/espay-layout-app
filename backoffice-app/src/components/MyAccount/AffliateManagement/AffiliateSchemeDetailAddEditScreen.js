// AffiliateSchemeDetailAddEditScreen.js
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
import { affiliateSchemeMappingList, addAffiliateSchemeDetail, editAffiliateSchemeDetail, affiliateSchemeDetailClear } from '../../../actions/account/AffiliateSchemeDetailAction';
import { getWalletTypeMaster } from '../../../actions/PairListAction';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';

class AffiliateSchemeDetailAddEditScreen extends Component {

    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();

        this.inputs = {};

        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        let DistributionTypeName = '';
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

            if (item.DistributionType == 1) DistributionTypeName = 'Depend Transaction Amount';
            if (item.DistributionType == 2) DistributionTypeName = 'Pre Level Commission';
            if (item.DistributionType == 3) DistributionTypeName = 'Each Transaction';
        }

        //Define All State initial state
        this.state = {
            edit: edit,
            item: item,

            minValue: edit ? '' + item.MinimumValue : '',
            maxValue: edit ? '' + item.MaximumValue : '',
            level: edit ? '' + item.Level : '0',
            commissionValue: edit ? '' + item.CommissionValue : '',

            schemeMapping: [],
            selectedSchemeMapping: edit ? item.SchemeMappingName : R.strings.Please_Select,
            schemeMappingId: edit ? item.SchemeMappingId : '',

            walletType: [],
            selectedWalletType: edit ? item.CreditWalletTypeName : R.strings.Please_Select,
            selectedWalletTypeId: edit ? item.CreditWalletTypeId : '',

            trnWalletType: [],
            selectedTrnWalletType: edit ? item.TrnWalletTypeName : R.strings.Please_Select,
            selectedTrnWalletTypeId: edit ? item.TrnWalletTypeId : '',

            distributionType: [
                { code: '99', value: R.strings.Please_Select },
                { code: '1', value: 'Depend Transaction Amount' },
                { code: '2', value: 'Pre Level Commission' },
                { code: '3', value: 'Each Transaction' },
            ],
            selectedDistributionType: edit ? DistributionTypeName : R.strings.Please_Select,
            selectedDistributionTypeId: edit ? item.DistributionType : '',

            commissionType: [
                { code: '99', value: R.strings.Please_Select },
                { code: '1', value: 'Fix' },
                { code: '2', value: 'Percentage' }],
            selectedCommissionType: edit ? item.CommissionTypeName : R.strings.Please_Select,
            selectedCommissionTypeId: edit ? item.CommissionType : '',

            status: edit ? [
                { value: R.strings.Please_Select, code: '99' },
                { value: R.strings.active, code: '1' },
                { value: R.strings.inActive, code: '0' },
                { value: R.strings.Delete, code: '9' }] :
                [{ value: R.strings.Please_Select, code: '99' },
                { value: R.strings.active, code: '1' },
                { value: R.strings.inActive, code: '0' },],
            selectedStatusId: edit ? code : 99,
            selectedStatus: edit ? Status : R.strings.Please_Select,
        };
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Call api for Scheme Mapping List
            this.props.affiliateSchemeMappingList({ PageNo: 0, PageSize: 100 });

            // Call Api for Wallet Type List
            this.props.getWalletTypeMaster();
        }
    }

    componentDidUpdate = async (prevProps, prevState) => {

        const { addSchemeDetailData, addSchemeDetailDataFetch, editSchemeDetailDataFetch, editSchemeDetailData, } = this.props;

        if (addSchemeDetailData !== prevProps.addSchemeDetailData) {
            // for show responce add
            if (!addSchemeDetailDataFetch) {
                try {
                    if (validateResponseNew({
                        response: addSchemeDetailData,
                    })) {
                        showAlert(R.strings.Success, addSchemeDetailData.ReturnMsg, 0, () => {
                            this.props.affiliateSchemeDetailClear()
                            if (this.props.navigation.state.params !== undefined) {
                                this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                                this.props.navigation.goBack()
                            }
                            else {
                                this.props.navigation.goBack()
                            }
                        });
                    } else {
                        this.props.affiliateSchemeDetailClear()
                    }
                } catch (e) {
                    this.props.affiliateSchemeDetailClear()
                }
            }
        }

        if (editSchemeDetailData !== prevProps.editSchemeDetailData) {
            // for show responce update
            if (!editSchemeDetailDataFetch) {
                try {
                    if (validateResponseNew({
                        response: editSchemeDetailData
                    })) {
                        showAlert(R.strings.Success, editSchemeDetailData.ReturnMsg, 0, () => {
                            this.props.affiliateSchemeDetailClear()
                            this.props.navigation.state.params.onSuccess() // if update success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        this.props.affiliateSchemeDetailClear()
                    }
                } catch (e) {
                    this.props.affiliateSchemeDetailClear()
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
        if (AffiliateSchemeDetailAddEditScreen.oldProps !== props) {
            AffiliateSchemeDetailAddEditScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Field of Particular actions
            const { schemeMappingListData, schemeMappingListDataFetch, walletTypeListData, walletTypeListFetch } = props;

            //To Check scheme Mapping List Data Fetch or Not
            if (!schemeMappingListDataFetch) {
                try {
                    if (validateResponseNew({ response: schemeMappingListData, isList: true })) {
                        //Store Api Response Field and display in Screen.
                        var res = parseArray(schemeMappingListData.AffiliateSchemeTypeMappingList);
                        res.map((item, index) => {
                            res[index].value = item.Description;
                        })

                        return {
                            ...state,
                            schemeMapping: [{ value: R.strings.Please_Select }, ...res]
                        };
                    }
                    else {
                        return { ...state, schemeMapping: [], selectedSchemeMapping: R.strings.Please_Select, schemeMappingId: '', };
                    }
                } catch (e) {
                    return { ...state, schemeMapping: [], selectedSchemeMapping: R.strings.Please_Select, schemeMappingId: '', };
                }
            }

            //To Check Wallet Type List Data Fetch or Not
            if (!walletTypeListFetch) {
                try {
                    if (validateResponseNew({ response: walletTypeListData, isList: true })) {

                        //Store Api Response Field and display in Screen.
                        var resItem = parseArray(walletTypeListData.walletTypeMasters);
                        resItem.map((item, index) => {
                            resItem[index].value = item.CoinName;
                        })

                        let resArray = [
                            { value: R.strings.Please_Select },
                            ...resItem
                        ];

                        return {
                            ...state, walletType: resArray, trnWalletType: resArray,
                        };
                    }
                    else {
                        return {
                            ...state, walletType: [], selectedWalletType: R.strings.Please_Select, selectedWalletTypeId: '',
                            trnWalletType: [], selectedTrnWalletType: R.strings.Please_Select, selectedTrnWalletTypeId: '',
                        };
                    }
                } catch (e) {
                    return {
                        ...state, walletType: [], selectedWalletType: R.strings.Please_Select, selectedWalletTypeId: '',
                        trnWalletType: [], selectedTrnWalletType: R.strings.Please_Select, selectedTrnWalletTypeId: '',
                    };
                }
            }

        }
        return null;
    }

    //Add Or Update Button Presss
    onPress = async () => {

        // check empty value and selected value validation
        if (isEmpty(this.state.minValue)) {
            this.toast.Show(R.strings.enterMinValue)
            return;
        }

        if (isEmpty(this.state.maxValue)) {
            this.toast.Show(R.strings.enterMaxValue)
            return;
        }

        if (isEmpty(this.state.level)) {
            this.toast.Show(R.strings.enterLevel)
            return;
        }

        if (this.state.selectedSchemeMapping === R.strings.Please_Select) {
            this.toast.Show(R.strings.selectSchemeMapping)
            return;
        }

        if (isEmpty(this.state.commissionValue)) {
            this.toast.Show(R.strings.enterCommissionValue)
            return;
        }

        if (this.state.selectedWalletType === R.strings.Please_Select) {
            this.toast.Show(R.strings.selectCreditWalletType)
            return;
        }

        if (this.state.selectedTrnWalletType === R.strings.Please_Select) {
            this.toast.Show(R.strings.selectTransactionWalletType)
            return;
        }

        if (this.state.selectedDistributionType === R.strings.Please_Select) {
            this.toast.Show(R.strings.selectDistributionType)
            return;
        }

        if (this.state.selectedCommissionType === R.strings.Please_Select) {
            this.toast.Show(R.strings.selectCommissionType)
            return;
        }

        if (this.state.selectedStatus === R.strings.Please_Select) {
            this.toast.Show(R.strings.select_status)
            return;
        }

        // check Network is Avoilable or not
        if (await isInternet()) {
            // bind request for add Scheme Details
            this.request = {
                MinimumValue: parseFloatVal(this.state.minValue),
                MaximumValue: parseFloatVal(this.state.maxValue),
                Level: parseIntVal(this.state.level),
                SchemeMappingId: parseIntVal(this.state.schemeMappingId),
                CommissionValue: parseFloatVal(this.state.commissionValue),
                CreditWalletTypeId: parseIntVal(this.state.selectedWalletTypeId),
                TrnWalletTypeId: parseIntVal(this.state.selectedTrnWalletTypeId),
                DistributionType: parseIntVal(this.state.selectedDistributionTypeId),
                CommissionType: parseIntVal(this.state.selectedCommissionTypeId),
                Status: parseIntVal(this.state.selectedStatusId),
            }

            if (this.state.edit) {
                this.request = {
                    DetailId: this.state.item.DetailId,
                    ...this.request,
                }

                //call editAffiliateSchemeDetail api
                this.props.editAffiliateSchemeDetail(this.request)
            }
            else {
                // call api for add Scheme Details
                this.props.addAffiliateSchemeDetail(this.request)
            }
        }
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    render() {
        const { isSchemeMappingListFetch, isWalletTypeListFetch, isAddSchemeDetailFetch, iseditSchemeDetailFetch } = this.props;
        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? R.strings.editAffiliateSchemeDetail : R.strings.addAffiliateSchemeDetail}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={isSchemeMappingListFetch || isWalletTypeListFetch || isAddSchemeDetailFetch || iseditSchemeDetailFetch} />

                {/* Common Toast */}
                <CommonToast
                    ref={cmpToast => this.toast = cmpToast} />

                <View style={{
                    paddingLeft: R.dimens.activity_margin,
                    paddingRight: R.dimens.activity_margin,
                    flex: 1, justifyContent: 'space-between',
                }}>

                    <View style={{ flex: 1 }}>
                        {/* Display Data in scrollview */}
                        <ScrollView showsVerticalScrollIndicator={false} >

                            {/* for minimum value */}
                            <EditText
                                style={{ marginTop: R.dimens.widget_top_bottom_margin + R.dimens.CardViewElivation }}
                                isRequired={true}
                                header={R.strings.minivalue}
                                onSubmitEditing={() => { this.focusNextField('etMaxValue') }}
                                validateNumeric={true}
                                onChangeText={(text) => this.setState({ minValue: text })}
                                value={this.state.minValue}
                                keyboardType={'numeric'}
                                placeholder={R.strings.enterMinValue}
                                validate={true}
                                maxLength={20}
                                returnKeyType={"next"}
                            />

                            {/* for maximum value */}
                            <EditText
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                isRequired={true}
                                header={R.strings.maxivalue}
                                placeholder={R.strings.enterMaxValue}
                                onChangeText={(text) => this.setState({ maxValue: text })}
                                value={this.state.maxValue}
                                validate={true}
                                validateNumeric={true}
                                keyboardType={'numeric'}
                                maxLength={20}
                                reference={input => { this.inputs['etMaxValue'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('etLevel') }}
                                returnKeyType={"next"}
                            />

                            {/* for levle */}
                            <EditText
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                isRequired={true}
                                header={R.strings.level}
                                placeholder={R.strings.enterLevel}
                                onChangeText={(text) => this.setState({ level: text })}
                                value={this.state.level}
                                validate={true}
                                validateNumeric={true}
                                keyboardType={'numeric'}
                                maxLength={20}
                                reference={input => { this.inputs['etLevel'] = input; }}
                                returnKeyType={"done"}
                            />

                            {/*For  Scheme Mapping Name */}
                            <TitlePicker
                                style={{ marginBottom: R.dimens.widget_top_bottom_margin, marginTop: R.dimens.widget_top_bottom_margin }}
                                isRequired={true}
                                pickerStyle={{
                                    backgroundColor: R.colors.background,
                                    borderWidth: 0,
                                    margin: R.dimens.CardViewElivation,
                                    marginTop: R.dimens.widgetMargin,
                                    elevation: R.dimens.CardViewElivation,
                                    height: R.dimens.ButtonHeight,
                                    borderRadius: R.dimens.cardBorderRadius,
                                    justifyContent: 'center',
                                }}
                                title={R.strings.schemeMappingName}
                                array={this.state.schemeMapping}
                                selectedValue={this.state.selectedSchemeMapping}
                                onPickerSelect={(item, object) => this.setState({ selectedSchemeMapping: item, schemeMappingId: object.MappingId })} />

                            {/* for Commission Value */}
                            <EditText
                                style={{ marginTop: R.dimens.widget_top_bottom_margin - R.dimens.CardViewElivation, marginBottom: R.dimens.CardViewElivation }}
                                isRequired={true}
                                header={R.strings.commissionValue}
                                placeholder={R.strings.enterCommissionValue}
                                onChangeText={(text) => this.setState({ commissionValue: text })}
                                value={this.state.commissionValue}
                                keyboardType={'numeric'}
                                validate={true}
                                validateNumeric={true}
                                maxLength={20}
                                returnKeyType={"done"}
                            />

                            {/* For Credit Wallet Type Id */}
                            <TitlePicker
                                style={{ marginBottom: R.dimens.widget_top_bottom_margin, marginTop: R.dimens.widget_top_bottom_margin }}
                                isRequired={true}
                                pickerStyle={{
                                    margin: R.dimens.CardViewElivation,
                                    height: R.dimens.ButtonHeight,
                                    backgroundColor: R.colors.background,
                                    marginTop: R.dimens.widgetMargin,
                                    elevation: R.dimens.CardViewElivation,
                                    borderWidth: 0,
                                    justifyContent: 'center',
                                    borderRadius: R.dimens.cardBorderRadius,
                                }}
                                title={R.strings.creaditWalletTypeId}
                                array={this.state.walletType}
                                selectedValue={this.state.selectedWalletType}
                                onPickerSelect={(item, object) => this.setState({ selectedWalletType: item, selectedWalletTypeId: object.Id })} />

                            {/* for Transaction Wallet Type  */}
                            <TitlePicker
                                style={{ marginBottom: R.dimens.widget_top_bottom_margin, marginTop: R.dimens.widget_top_bottom_margin }}
                                isRequired={true}
                                pickerStyle={{
                                    justifyContent: 'center',
                                    borderRadius: R.dimens.cardBorderRadius,
                                    borderWidth: 0,
                                    height: R.dimens.ButtonHeight,
                                    backgroundColor: R.colors.background,
                                    marginTop: R.dimens.widgetMargin,
                                    margin: R.dimens.CardViewElivation,
                                    elevation: R.dimens.CardViewElivation,
                                }}
                                title={R.strings.transactionWalletType}
                                array={this.state.trnWalletType}
                                selectedValue={this.state.selectedTrnWalletType}
                                onPickerSelect={(item, object) => this.setState({ selectedTrnWalletType: item, selectedTrnWalletTypeId: object.Id })} />

                            {/* for  Distribution Type */}
                            <TitlePicker
                                style={{ marginBottom: R.dimens.widget_top_bottom_margin, marginTop: R.dimens.widget_top_bottom_margin }}
                                isRequired={true}
                                pickerStyle={{
                                    borderWidth: 0,
                                    justifyContent: 'center',
                                    borderRadius: R.dimens.cardBorderRadius,
                                    marginTop: R.dimens.widgetMargin,
                                    height: R.dimens.ButtonHeight,
                                    backgroundColor: R.colors.background,
                                    elevation: R.dimens.CardViewElivation,
                                    margin: R.dimens.CardViewElivation,
                                }}
                                title={R.strings.distributionType}
                                array={this.state.distributionType}
                                selectedValue={this.state.selectedDistributionType}
                                onPickerSelect={(item, object) => this.setState({ selectedDistributionType: item, selectedDistributionTypeId: object.code })} />

                            {/* for Commission Type */}
                            <TitlePicker
                                style={{ marginBottom: R.dimens.widget_top_bottom_margin, marginTop: R.dimens.widget_top_bottom_margin }}
                                isRequired={true}
                                pickerStyle={{
                                    borderWidth: 0,
                                    borderRadius: R.dimens.cardBorderRadius,
                                    justifyContent: 'center',
                                    height: R.dimens.ButtonHeight,
                                    backgroundColor: R.colors.background,
                                    marginTop: R.dimens.widgetMargin,
                                    elevation: R.dimens.CardViewElivation,
                                    margin: R.dimens.CardViewElivation,
                                }}
                                title={R.strings.commissionType}
                                array={this.state.commissionType}
                                selectedValue={this.state.selectedCommissionType}
                                onPickerSelect={(item, object) => this.setState({ selectedCommissionType: item, selectedCommissionTypeId: object.code })} />

                            {/* for Status */}
                            <TitlePicker
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widget_top_bottom_margin }}
                                isRequired={true}
                                pickerStyle={{
                                    borderRadius: R.dimens.cardBorderRadius,
                                    borderWidth: 0,
                                    justifyContent: 'center',
                                    backgroundColor: R.colors.background,
                                    height: R.dimens.ButtonHeight,
                                    marginTop: R.dimens.widgetMargin,
                                    elevation: R.dimens.CardViewElivation,
                                    margin: R.dimens.CardViewElivation,
                                }}
                                title={R.strings.Status}
                                array={this.state.status}
                                selectedValue={this.state.selectedStatus}
                                onPickerSelect={(item, object) => this.setState({ selectedStatus: item, selectedStatusId: object.code })} />

                        </ScrollView>
                    </View>

                    <View style={{ paddingBottom: R.dimens.WidgetPadding, paddingTop: R.dimens.widget_top_bottom_margin }}>
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
        //Updated Data of Scheme MApping List
        isSchemeMappingListFetch: state.AffiliateSchemeDetailReducer.isSchemeMappingListFetch,
        schemeMappingListData: state.AffiliateSchemeDetailReducer.schemeMappingListData,
        schemeMappingListDataFetch: state.AffiliateSchemeDetailReducer.schemeMappingListDataFetch,

        //Updated Data of Wallet Type List
        isWalletTypeListFetch: state.AffiliateSchemeDetailReducer.isWalletTypeListFetch,
        walletTypeListData: state.AffiliateSchemeDetailReducer.walletTypeListData,
        walletTypeListFetch: state.AffiliateSchemeDetailReducer.walletTypeListFetch,

        //Updated Data of Add Scheme Detail
        isAddSchemeDetailFetch: state.AffiliateSchemeDetailReducer.isAddSchemeDetailFetch,
        addSchemeDetailData: state.AffiliateSchemeDetailReducer.addSchemeDetailData,
        addSchemeDetailDataFetch: state.AffiliateSchemeDetailReducer.addSchemeDetailDataFetch,

        //Updated Data of Add Scheme Detail
        iseditSchemeDetailFetch: state.AffiliateSchemeDetailReducer.iseditSchemeDetailFetch,
        editSchemeDetailData: state.AffiliateSchemeDetailReducer.editSchemeDetailData,
        editSchemeDetailDataFetch: state.AffiliateSchemeDetailReducer.editSchemeDetailDataFetch,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Action for Scheme Mapping List
        affiliateSchemeMappingList: (requestList) => dispatch(affiliateSchemeMappingList(requestList)),
        //Perform Action for Wallet Type List
        getWalletTypeMaster: () => dispatch(getWalletTypeMaster()),
        // Perform Action for Add Scheme detail
        addAffiliateSchemeDetail: (requestSchemeDetail) => dispatch(addAffiliateSchemeDetail(requestSchemeDetail)),
        // Perform Action for edit Scheme detail
        editAffiliateSchemeDetail: (requestSchemeDetail) => dispatch(editAffiliateSchemeDetail(requestSchemeDetail)),
        //Perform Action to clear reducer data
        affiliateSchemeDetailClear: () => dispatch(affiliateSchemeDetailClear()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AffiliateSchemeDetailAddEditScreen)