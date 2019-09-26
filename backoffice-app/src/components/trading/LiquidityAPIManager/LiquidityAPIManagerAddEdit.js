// LiquidityAPIManagerAddEdit
import React, { Component } from 'react';
import { View, ScrollView, } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, showAlert } from '../../../controllers/CommonUtils';
import Button from '../../../native_theme/components/Button';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation'
import {
    GetLiquidityAPIManagerList, AddLiquidityAPIManagerData, AddLiquidityAPIManagerDataClear, EditLiquidityAPIManagerData,
    EditLiquidityAPIManagerDataClear, GetApiProviderList, GetLimitdataList, GetServiceProviderList, GetDaemonConfigList,
    GetproviderConfigList, GetProviderTypeList, GetTransactionTypeList
} from '../../../actions/Trading/LiquidityAPIManagerAction';
import { isCurrentScreen } from '../../../components/Navigation';
import { connect } from 'react-redux';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import ComboPickerWidget from '../../widget/ComboPickerWidget'
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';

class LiquidityAPIManagerAddEdit extends Component {

    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();

        // static data set to picker for status
        this.status = [{ value: R.strings.Please_Select }, { value: R.strings.active, id: 1 }, { value: R.strings.inActive, id: 0 }];

        // get data from the another screen and store in params
        const { params } = this.props.navigation.state;

        //Define all initial state
        this.state = {
            // for api provider picker 
            provider: [{ value: R.strings.Please_Select }],
            SelectedproviderName: R.strings.Please_Select,
            selectedProviderId: params ? params.data.APIProviderId : 0,
            // for limit picker 
            limit: [{ value: R.strings.Please_Select }],
            SelectedLimit: R.strings.Please_Select,
            selectedLimitId: params ? params.data.LimitId : 0,
            // for serviceprovider picker 
            serviceprovider: [{ value: R.strings.Please_Select }],
            SelectedServiceProvider: R.strings.Please_Select,
            selectedServiceProviderId: params ? params.data.ProviderMasterId : 0,
            // for daemonconfig picker 
            daemonconfig: [{ value: R.strings.Please_Select }],
            SelectedDaemonConfig: R.strings.Please_Select,
            selectedDaemonConfigId: params ? params.data.DeamonConfigId : 0,
            // for providerconfig picker
            providerconfig: [{ value: R.strings.Please_Select }],
            SelectedProviderConfig: R.strings.Please_Select,
            selectedProviderConfigId: params ? params.data.ServiceProviderCongigId : 0,
            // for providertype picker
            providertype: [{ value: R.strings.Please_Select }],
            SelectedProviderType: R.strings.Please_Select,
            selectedProviderTypeId: params ? params.data.ProviderTypeId : 0,
            // for transactiontype picker
            transactiontype: [{ value: R.strings.Please_Select }],
            SelectedTransactionType: R.strings.Please_Select,
            selectedTransactionTypeId: params ? params.data.TransationType : 0,
            // for status picker
            Status: params == undefined ? this.status[0].value : params.data.StatusText,
            // get data from the screen while update record
            item: params == undefined ? undefined : params.data,
            isFirstTime: true,
        }
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            // for get ApiProviderList
            this.props.GetApiProviderList()
            // for get LimitList
            this.props.GetLimitdataList()
            // for get ServiceProviderList
            this.props.GetServiceProviderList()
            // for get DaemonConfigurationList
            this.props.GetDaemonConfigList()
            // for get providerConfigurationList
            this.props.GetproviderConfigList()
            // for get ProviderTypeList
            this.props.GetProviderTypeList()
            // for get TransactionTypeList
            this.props.GetTransactionTypeList()
        }
    }

    submitdata = async () => {
        // check validation for picker if value is not selected by user  
        if (this.state.SelectedproviderName === R.strings.Please_Select) {
            this.toast.Show(R.strings.Please_Select_ApiProvider)
            return;
        }
        if (this.state.SelectedLimit === R.strings.Please_Select) {
            this.toast.Show(R.strings.Please_Select_Limit)
            return;
        }
        if (this.state.SelectedServiceProvider === R.strings.Please_Select) {
            this.toast.Show(R.strings.Please_Select_ServiceProvider)
            return;
        }
        if (this.state.SelectedDaemonConfig === R.strings.Please_Select) {
            this.toast.Show(R.strings.Please_Select_DaemonConfiguration)
            return;
        }
        if (this.state.SelectedProviderConfig === R.strings.Please_Select) {
            this.toast.Show(R.strings.Please_Select_ProviderConfiguration)
            return;
        }
        if (this.state.SelectedProviderType === R.strings.Please_Select) {
            this.toast.Show(R.strings.Please_Select_ProviderType)
            return;
        }
        if (this.state.SelectedTransactionType === R.strings.Please_Select) {
            this.toast.Show(R.strings.transactionTypeValidate)
            return;
        }
        if (this.state.Status === R.strings.Please_Select) {
            this.toast.Show(R.strings.statusValidate)
            return;
        }
        // ------------------------------------------------------------
        else {
            if (this.state.item) {
                //Check NetWork is Available or not
                if (await isInternet()) {
                    // pass updated data for edit record
                    let RequestEditLiquidityAPI = {
                        Id: this.state.item.Id,
                        APIProviderId: this.state.selectedProviderId,
                        LimitId: this.state.selectedLimitId,
                        ProviderMasterId: this.state.selectedServiceProviderId,
                        DeamonConfigId: this.state.selectedDaemonConfigId,
                        ServiceProviderCongigId: this.state.selectedProviderConfigId,
                        ProviderTypeId: this.state.selectedProviderTypeId,
                        TransationType: this.state.selectedTransactionTypeId,
                        Status: this.state.Status === R.strings.active ? 1 : 0
                    }

                    // call action for Edit Data
                    this.props.EditLiquidityAPIManagerData(RequestEditLiquidityAPI);
                }
            }
            else {
                //Check NetWork is Available or not
                if (await isInternet()) {
                    // pass selecteddata from the picker for Add record
                    let RequestAddLiquidityAPI = {
                        APIProviderId: this.state.selectedProviderId,
                        LimitId: this.state.selectedLimitId,
                        ProviderMasterId: this.state.selectedServiceProviderId,
                        DeamonConfigId: this.state.selectedDaemonConfigId,
                        ServiceProviderCongigId: this.state.selectedProviderConfigId,
                        ProviderTypeId: this.state.selectedProviderTypeId,
                        TransationType: [this.state.selectedTransactionTypeId],
                        Status: this.state.Status === R.strings.active ? 1 : 0
                    }

                    // call action for Add Data
                    this.props.AddLiquidityAPIManagerData(RequestAddLiquidityAPI);
                }
            }
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, prevState) => {
        const { AddLiquidityAPIManagerdataget, AddedLiquidityAPIManagerdata, EditLiquidityAPIManagerdataget,
            EditedLiquidityAPIManagerdata, } = this.props;

        if (AddLiquidityAPIManagerdataget !== prevProps.AddLiquidityAPIManagerdataget) {

            // for show responce of add data
            if (!AddedLiquidityAPIManagerdata) {
                try {
                    // when returncode 0 display success and returncode 1 check for ErrorCode for Display error message
                    if (validateResponseNew({ response: AddLiquidityAPIManagerdataget, returnCode: AddLiquidityAPIManagerdataget.ReturnCode, returnMessage: AddLiquidityAPIManagerdataget.ReturnMsg })) {
                        showAlert(R.strings.Success, AddLiquidityAPIManagerdataget.ReturnMsg === null ? R.strings.RedcordAddedSuccessfully : AddLiquidityAPIManagerdataget.ReturnMsg, 0, () => {
                            // Add LiquidityAPI Clear
                            this.props.AddLiquidityAPIManagerDataClear();
                            this.props.navigation.navigate('LiquidityAPIManager')
                            // call api for refresh value in LiquidityAPI screen 
                            this.props.GetLiquidityAPIManagerList()
                        })
                    } else {
                        // for clear responce from the reducer when record already exist
                        this.props.AddLiquidityAPIManagerDataClear();
                    }
                } catch (e) {
                    this.props.AddLiquidityAPIManagerDataClear();
                }
            }
            // -------------------------------
        }

        if (EditLiquidityAPIManagerdataget !== prevProps.EditLiquidityAPIManagerdataget) {
            // for show responce of edit data
            if (!EditedLiquidityAPIManagerdata) {
                try {
                    // when returncode 0 display success and returncode 1 check for ErrorCode for Display error message
                    // if (validateResponseNew({ response: EditLiquidityAPIManagerdataget, returnCode: EditLiquidityAPIManagerdataget.ReturnCode, returnMessage: EditLiquidityAPIManagerdataget.ReturnMsg}))
                    if (validateResponseNew({ response: EditLiquidityAPIManagerdataget, returnCode: EditLiquidityAPIManagerdataget.ReturnCode, returnMessage: EditLiquidityAPIManagerdataget.ReturnMsg })) {

                        showAlert(R.strings.Success, EditLiquidityAPIManagerdataget.ReturnMsg === null ? R.strings.RedcordUpdatedSuccessfully : EditLiquidityAPIManagerdataget.ReturnMsg, 0, () => {
                            // edit LiquidityAPI Clear
                            this.props.EditLiquidityAPIManagerDataClear();
                            this.props.navigation.navigate('LiquidityAPIManager')
                            // call api for refresh value in LiquidityAPI screen 
                            this.props.GetLiquidityAPIManagerList()
                        })

                    } else {
                        // for clear responce from the reducer when record already exist
                        this.props.EditLiquidityAPIManagerDataClear();
                    }
                } catch (e) {
                    this.props.EditLiquidityAPIManagerDataClear();
                }
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
        if (LiquidityAPIManagerAddEdit.oldProps !== props) {
            LiquidityAPIManagerAddEdit.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { Apiproviderlistdata, LimitListdata, ServiceProviderListdata,
                DaemonConfigurationlistdata, ProviderConfigurationlistdata, Providertypelistdata,
                Transactiontypelistdata, } = props;

            if (Apiproviderlistdata) {
                try {
                    //if local provider state is null or its not null and also different then new response then and only then validate response.
                    if (state.Apiproviderlistdata == null || (state.Apiproviderlistdata != null && Apiproviderlistdata !== state.Apiproviderlistdata)) {
                        //if Apiproviderlist response is success then store array list else store empty list
                        if (validateResponseNew({ response: Apiproviderlistdata, isList: true })) {
                            let res = parseArray(Apiproviderlistdata.Response);
                            // add value name key in array
                            res.map((item, index) => {
                                res[index].value = item.APIName;
                            })
                            // merge array 
                            let provider = [
                                ...[{ value: R.strings.Please_Select }],
                                ...res
                            ];

                            let SelectedproviderName = '';
                            // if user select edit than fetch record from the array and store in selected value 
                            if (state.item) {
                                let resultIndex = provider.findIndex(el => el.Id == state.item.APIProviderId);
                                if (resultIndex > -1) {
                                    SelectedproviderName = provider[resultIndex].value
                                } else {
                                    SelectedproviderName = state.transactiontype[0].value
                                }
                            }
                            // set array to the state 
                            return { ...state, Apiproviderlistdata, provider, SelectedproviderName: SelectedproviderName === '' ? state.SelectedproviderName : SelectedproviderName };
                        } else {
                            // set blank array
                            return { ...state, Apiproviderlistdata, provider: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    return { ...state, provider: [{ value: R.strings.Please_Select }] };
                }
            }

            if (LimitListdata) {
                try {

                    //if limit state is null or its not null and also different then new response then and only then validate response.
                    if (state.LimitListdata == null || (state.LimitListdata != null && LimitListdata !== state.LimitListdata)) {
                        //if tradingLedgers response is success then store array list else store empty list
                        if (validateResponseNew({ response: LimitListdata, isList: true })) {
                            let res = parseArray(LimitListdata.Response);
                            // add value name key in array
                            res.map((item, index) => {
                                res[index].value = item.MinAmt + " - " + item.MaxAmt;
                            })
                            // merge array 
                            let limit = [
                                ...[{ value: R.strings.Please_Select }],
                                ...res
                            ];

                            let SelectedLimit = '';
                            // if user select edit than fetch record from the array and store in selected value 
                            if (state.item) {
                                let resultIndex = limit.findIndex(el => el.Id == state.item.LimitId);
                                if (resultIndex > -1) {
                                    SelectedLimit = limit[resultIndex].value
                                } else {
                                    SelectedLimit = state.transactiontype[0].value
                                }
                            }
                            // set array to the state 
                            return { ...state, LimitListdata, limit, SelectedLimit: SelectedLimit === '' ? state.SelectedLimit : SelectedLimit };
                        } else {
                            // set blank array
                            return { ...state, LimitListdata, limit: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    return { ...state, LimitListdata, limit: [{ value: R.strings.Please_Select }] };
                }
            }

            if (ServiceProviderListdata) {
                try {
                    if (state.ServiceProviderListdata == null || (state.ServiceProviderListdata != null && ServiceProviderListdata !== state.ServiceProviderListdata)) {
                        //if ServiceProviderList response is success then store array list else store empty list
                        if (validateResponseNew({ response: ServiceProviderListdata, isList: true })) {
                            let res = parseArray(ServiceProviderListdata.Response);
                            // add value name key in array
                            res.map((item, index) => {
                                res[index].value = item.ProviderName;
                            })
                            // merge array 
                            let serviceprovider = [
                                ...[{ value: R.strings.Please_Select }],
                                ...res
                            ];

                            let SelectedServiceProvider = '';
                            // if user select edit than fetch record from the array and store in selected value 
                            if (state.item) {
                                let resultIndex = serviceprovider.findIndex(el => el.Id == state.item.ProviderMasterId);
                                if (resultIndex > -1) {
                                    SelectedServiceProvider = serviceprovider[resultIndex].value
                                } else {
                                    SelectedServiceProvider = state.transactiontype[0].value
                                }
                            }
                            // set array to the state 
                            return { ...state, ServiceProviderListdata, serviceprovider, SelectedServiceProvider: SelectedServiceProvider === '' ? state.SelectedServiceProvider : SelectedServiceProvider };
                        } else {
                            // set blank array
                            return { ...state, ServiceProviderListdata, serviceprovider: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    return { ...state, serviceprovider: [{ value: R.strings.Please_Select }] };
                }
            }

            if (DaemonConfigurationlistdata) {
                try {
                    if (state.DaemonConfigurationlistdata == null || (state.DaemonConfigurationlistdata != null && DaemonConfigurationlistdata !== state.DaemonConfigurationlistdata)) {
                        //if DaemonConfigurationlist response is success then store array list else store empty list
                        if (validateResponseNew({ response: DaemonConfigurationlistdata, isList: true })) {
                            let res = parseArray(DaemonConfigurationlistdata.Response);
                            // add value name key in array
                            res.map((item, index) => {
                                res[index].value = item.Name;
                            })
                            // merge array 
                            let daemonconfig = [
                                ...[{ value: R.strings.Please_Select }],
                                ...res
                            ];

                            let SelectedDaemonConfig = '';
                            // if user select edit than fetch record from the array and store in selected value 
                            if (state.item) {
                                let resultIndex = daemonconfig.findIndex(el => el.Id == state.item.DeamonConfigId);
                                if (resultIndex > -1) {
                                    SelectedDaemonConfig = daemonconfig[resultIndex].value
                                } else {
                                    SelectedDaemonConfig = state.transactiontype[0].value
                                }
                            }
                            // set array to the state 
                            return { ...state, DaemonConfigurationlistdata, daemonconfig, SelectedDaemonConfig: SelectedDaemonConfig === '' ? state.SelectedDaemonConfig : SelectedDaemonConfig };
                        } else {
                            // set blank array
                            return { ...state, DaemonConfigurationlistdata, daemonconfig: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    return { ...state, daemonconfig: [{ value: R.strings.Please_Select }] };
                }
            }

            if (ProviderConfigurationlistdata) {
                try {
                    if (state.ProviderConfigurationlistdata == null || (state.ProviderConfigurationlistdata != null && ProviderConfigurationlistdata !== state.ProviderConfigurationlistdata)) {
                        //if ProviderConfigurationlist response is success then store array list else store empty list
                        if (validateResponseNew({ response: ProviderConfigurationlistdata, isList: true })) {
                            let res = parseArray(ProviderConfigurationlistdata.Response);
                            // add value name key in array
                            res.map((item, index) => {
                                res[index].value = item.Name;
                            })
                            // merge array 
                            let providerconfig = [
                                ...[{ value: R.strings.Please_Select }],
                                ...res
                            ];

                            let SelectedProviderConfig = '';
                            // if user select edit than fetch record from the array and store in selected value 
                            if (state.item) {
                                let resultIndex = providerconfig.findIndex(el => el.Id == state.item.ServiceProviderCongigId);
                                if (resultIndex > -1) {
                                    SelectedProviderConfig = providerconfig[resultIndex].value
                                } else {
                                    SelectedProviderConfig = state.transactiontype[0].value
                                }
                            }
                            // set array to the state 
                            return { ...state, ProviderConfigurationlistdata, providerconfig, SelectedProviderConfig: SelectedProviderConfig === '' ? state.SelectedProviderConfig : SelectedProviderConfig };
                        } else {
                            // set blank array
                            return { ...state, ProviderConfigurationlistdata, providerconfig: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    return { ...state, providerconfig: [{ value: R.strings.Please_Select }] };
                }
            }

            if (Providertypelistdata) {
                try {
                    if (state.Providertypelistdata == null || (state.Providertypelistdata != null && Providertypelistdata !== state.Providertypelistdata)) {
                        //if Providertypelist response is success then store array list else store empty list
                        if (validateResponseNew({ response: Providertypelistdata, isList: true })) {
                            let res = parseArray(Providertypelistdata.Response);
                            // add value name key in array
                            res.map((item, index) => {
                                res[index].value = item.ServiveProTypeName;
                            })
                            // merge array 
                            let providertype = [
                                ...[{ value: R.strings.Please_Select }],
                                ...res
                            ];

                            let SelectedProviderType = '';
                            // if user select edit than fetch record from the array and store in selected value
                            if (state.item) {
                                let resultIndex = providertype.findIndex(el => el.Id == state.item.ProviderTypeId);
                                if (resultIndex > -1) {
                                    SelectedProviderType = providertype[resultIndex].value
                                } else {
                                    SelectedProviderType = state.transactiontype[0].value
                                }
                            }
                            // set array to the state 
                            return { ...state, Providertypelistdata, providertype, SelectedProviderType: SelectedProviderType === '' ? state.SelectedProviderType : SelectedProviderType };
                        } else {
                            // set blank array
                            return { ...state, providertype: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    return { ...state, providertype: [{ value: R.strings.Please_Select }] };
                }
            }

            if (Transactiontypelistdata) {
                try {
                    if (state.Transactiontypelistdata == null || (state.Transactiontypelistdata != null && Transactiontypelistdata !== state.Transactiontypelistdata)) {
                        //if ransactiontypelist response is success then store array list else store empty list
                        if (validateResponseNew({ response: Transactiontypelistdata, isList: true })) {
                            let res = parseArray(Transactiontypelistdata.Response);
                            // add value name key in array
                            res.map((item, index) => {
                                res[index].value = item.TrnTypeName;
                            })
                            // merge array 
                            let transactiontype = [
                                ...[{ value: R.strings.Please_Select }],
                                ...res
                            ];
                            let SelectedTransactionType = '';
                            // if user select edit than fetch record from the array and store in selected value
                            if (state.item) {
                                let resultIndex = transactiontype.findIndex(el => el.Id == state.item.TransationType);
                                if (resultIndex > -1) {
                                    SelectedTransactionType = transactiontype[resultIndex].value
                                } else {
                                    SelectedTransactionType = state.transactiontype[0].value
                                }
                            }
                            // set array to the state 
                            return { ...state, Transactiontypelistdata, transactiontype, SelectedTransactionType: SelectedTransactionType === '' ? state.SelectedTransactionType : SelectedTransactionType };
                        } else {
                            // set blank array
                            return { ...state, Transactiontypelistdata, transactiontype: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    return { ...state, transactiontype: [{ value: R.strings.Please_Select }] };
                }
            }
        }
        return null;
    }

    render() {
        const { isApiproviderlistFetch, isAddLiquidityAPIManager, isEditLiquidityAPIManager, isTransactiontypelistFetch } = this.props;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={this.state.item ? R.strings.EditApiManager : R.strings.AddApiManager}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* for display progress dialog */}
                <ProgressDialog isShow={isApiproviderlistFetch || isTransactiontypelistFetch || isAddLiquidityAPIManager || isEditLiquidityAPIManager} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin }}>
                            <ComboPickerWidget
                                style={{ paddingLeft: 0, paddingRight: 0 }}
                                pickers={[
                                    {
                                        // {/* For select Api Provider */}
                                        title: R.strings.ApiProvider,
                                        array: this.state.provider,
                                        selectedValue: this.state.SelectedproviderName,
                                        onPickerSelect: (index, object) => this.setState({ SelectedproviderName: index, selectedProviderId: object.Id })
                                    },
                                    {
                                        // {/* For select Limit */}
                                        title: R.strings.limit,
                                        array: this.state.limit,
                                        selectedValue: this.state.SelectedLimit,
                                        onPickerSelect: (index, object) => this.setState({ SelectedLimit: index, selectedLimitId: object.Id })
                                    },
                                    {
                                        // {/* For select Service Provider */}
                                        title: R.strings.ServiceProvider,
                                        array: this.state.serviceprovider,
                                        selectedValue: this.state.SelectedServiceProvider,
                                        onPickerSelect: (index, object) => this.setState({ SelectedServiceProvider: index, selectedServiceProviderId: object.Id })
                                    },
                                    {
                                        // {/* For select Daemon Configuration */}
                                        title: R.strings.DaemonConfiguration,
                                        array: this.state.daemonconfig,
                                        selectedValue: this.state.SelectedDaemonConfig,
                                        onPickerSelect: (index, object) => this.setState({ SelectedDaemonConfig: index, selectedDaemonConfigId: object.Id })
                                    },
                                    {
                                        // {/* For select Provider Configuration */}
                                        title: R.strings.ProviderConfiguration,
                                        array: this.state.providerconfig,
                                        selectedValue: this.state.SelectedProviderConfig,
                                        onPickerSelect: (index, object) => this.setState({ SelectedProviderConfig: index, selectedProviderConfigId: object.Id })
                                    },
                                    {
                                        // {/* For select Provider Type */}
                                        title: R.strings.ProviderType,
                                        array: this.state.providertype,
                                        selectedValue: this.state.SelectedProviderType,
                                        onPickerSelect: (index, object) => this.setState({ SelectedProviderType: index, selectedProviderTypeId: object.Id })
                                    },
                                    {
                                        // {/* For select Transaction Type */}
                                        title: R.strings.transactionType,
                                        array: this.state.transactiontype,
                                        selectedValue: this.state.SelectedTransactionType,
                                        onPickerSelect: (index, object) => this.setState({ SelectedTransactionType: index, selectedTransactionTypeId: object.Id })
                                    },
                                    {
                                        // {/* For select Status */}
                                        title: R.strings.status,
                                        array: this.status,
                                        selectedValue: this.state.Status,
                                        onPickerSelect: (item) => this.setState({ Status: item })
                                    },

                                ]}
                            />
                        </View>
                    </ScrollView>
                </View>

                <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                    {/* To Set Submit Button */}
                    <Button title={this.state.item ? R.strings.update : R.strings.submit} onPress={this.submitdata}></Button>
                </View>
            </SafeView>
        );
    }
}

function mapStateToProps(state) {
    return {
        // for add data in LiquidityAPI
        isAddLiquidityAPIManager: state.liquidityAPIManagerReducer.isAddLiquidityAPIManager,
        AddLiquidityAPIManagerdataget: state.liquidityAPIManagerReducer.AddLiquidityAPIManagerdata,
        AddedLiquidityAPIManagerdata: state.liquidityAPIManagerReducer.AddedLiquidityAPIManagerdata,

        // for edit LiquidityAPI
        isEditLiquidityAPIManager: state.liquidityAPIManagerReducer.isEditLiquidityAPIManager,
        EditLiquidityAPIManagerdataget: state.liquidityAPIManagerReducer.EditLiquidityAPIManagerdata,
        EditedLiquidityAPIManagerdata: state.liquidityAPIManagerReducer.EditedLiquidityAPIManagerdata,

        // for get Apiproviderlist
        isApiproviderlistFetch: state.liquidityAPIManagerReducer.isApiproviderlistFetch,
        Apiproviderlistdata: state.liquidityAPIManagerReducer.Apiproviderlistdata,
        Apiproviderlistget: state.liquidityAPIManagerReducer.Apiproviderlistget,

        // For get LimitList
        isLimitListFetch: state.liquidityAPIManagerReducer.isLimitListFetch,
        LimitListdata: state.liquidityAPIManagerReducer.LimitListdata,
        LimitListget: state.liquidityAPIManagerReducer.LimitListget,

        // For ServiceProviderList
        isServiceProviderListFetch: state.liquidityAPIManagerReducer.isServiceProviderListFetch,
        ServiceProviderListdata: state.liquidityAPIManagerReducer.ServiceProviderListdata,
        ServiceProviderListget: state.liquidityAPIManagerReducer.ServiceProviderListget,

        // for DaemonConfigurationlist
        isDaemonConfigurationlistFetch: state.liquidityAPIManagerReducer.isDaemonConfigurationlistFetch,
        DaemonConfigurationlistdata: state.liquidityAPIManagerReducer.DaemonConfigurationlistdata,
        DaemonConfigurationlistget: state.liquidityAPIManagerReducer.DaemonConfigurationlistget,

        // for ProviderConfigurationlist
        isProviderConfigurationlistFetch: state.liquidityAPIManagerReducer.isProviderConfigurationlistFetch,
        ProviderConfigurationlistdata: state.liquidityAPIManagerReducer.ProviderConfigurationlistdata,
        ProviderConfigurationlistget: state.liquidityAPIManagerReducer.ProviderConfigurationlistget,

        // for Providertypelist
        isProvidertypelistFetch: state.liquidityAPIManagerReducer.isProvidertypelistFetch,
        Providertypelistdata: state.liquidityAPIManagerReducer.Providertypelistdata,
        Providertypelistget: state.liquidityAPIManagerReducer.Providertypelistget,

        // for Transactionypelist
        isTransactiontypelistFetch: state.liquidityAPIManagerReducer.isTransactiontypelistFetch,
        Transactiontypelistdata: state.liquidityAPIManagerReducer.Transactiontypelistdata,
        Transactiontypelistget: state.liquidityAPIManagerReducer.Transactiontypelistget,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // call action for get LiquidityAPI
        GetLiquidityAPIManagerList: () => dispatch(GetLiquidityAPIManagerList()),
        // call action for fetch data for selection of picker
        GetApiProviderList: () => dispatch(GetApiProviderList()),
        GetLimitdataList: () => dispatch(GetLimitdataList()),
        GetServiceProviderList: () => dispatch(GetServiceProviderList()),
        GetDaemonConfigList: () => dispatch(GetDaemonConfigList()),
        GetproviderConfigList: () => dispatch(GetproviderConfigList()),
        GetProviderTypeList: () => dispatch(GetProviderTypeList()),
        GetTransactionTypeList: () => dispatch(GetTransactionTypeList()),
        // call action for add data and than set data to null
        AddLiquidityAPIManagerData: (RequestAddLiquidityAPI) => dispatch(AddLiquidityAPIManagerData(RequestAddLiquidityAPI)),
        AddLiquidityAPIManagerDataClear: () => dispatch(AddLiquidityAPIManagerDataClear()),
        // call action for edit data and than set data to null
        EditLiquidityAPIManagerData: (RequestEditLiquidityAPI) => dispatch(EditLiquidityAPIManagerData(RequestEditLiquidityAPI)),
        EditLiquidityAPIManagerDataClear: () => dispatch(EditLiquidityAPIManagerDataClear()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiquidityAPIManagerAddEdit)