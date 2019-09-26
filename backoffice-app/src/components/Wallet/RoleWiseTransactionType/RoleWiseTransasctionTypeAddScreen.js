import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, showAlert } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';
import CommonToast from '../../../native_theme/components/CommonToast';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import Button from '../../../native_theme/components/Button';
import { getWalletTransactionType, getRoleDetails } from '../../../actions/PairListAction';
import { clearRoleWiseData, addTrnTypeRoleWise } from '../../../actions/Wallet/RoleWiseTransactionTypesAction';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';


class RoleWiseTransasctionTypeAddScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {

            transactionTypes: [{ value: R.strings.Select_Type }],
            selectedTransactionType: R.strings.Select_Type,
            selectedTransactionTypeCode: '',

            roles: [{ value: R.strings.selectRole }],
            selectedRole: R.strings.selectRole,
            selectedRoleCode: '',

            Status: false,

            roleDetails: null,
            walletTransactionType: null,
            addRoleWiseData: null,

            isFirstTime: true,
        };

        // Create reference
        this.toast = React.createRef();
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //call getWalletTransactionType api
            this.props.getWalletTransactionType()
            //call getRoleDetails api
            this.props.getRoleDetails()
        }
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
        if (RoleWiseTransasctionTypeAddScreen.oldProps !== props) {
            RoleWiseTransasctionTypeAddScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { walletTransactionType, roleDetails } = props.data;

            if (walletTransactionType) {

                try {

                    //if local walletTransactionType state is null or its not null and also different then new response then and only then validate response.
                    if (state.walletTransactionType == null || (state.walletTransactionType != null && walletTransactionType !== state.walletTransactionType)) {

                        //if  response is success then store walletTransactionType list else store empty list
                        if (validateResponseNew({
                            response: walletTransactionType, isList: true
                        })) {
                            let res = parseArray(walletTransactionType.Data);

                            //for add transactionTypes
                            for (var transactionTypesKey in res) {
                                let item = res[transactionTypesKey];
                                item.value = item.TypeName;
                            }

                            let transactionTypes = [{ value: R.strings.Select_Type },
                            ...res
                            ];

                            return {
                                ...state, walletTransactionType, transactionTypes
                            };
                        }
                        else {
                            return {
                                ...state,
                                walletTransactionType, transactionTypes: [{ value: R.strings.Select_Type }]
                            };
                        }
                    }
                } catch (e) {
                    return {
                        ...state, transactionTypes: [{ value: R.strings.Select_Type }]
                    };
                }
            }

            if (roleDetails) {
                try {
                    //if local roleDetails state is null or its not null and also different then new response then and only then validate response.
                    if (state.roleDetails == null || (state.roleDetails != null && roleDetails !== state.roleDetails)) {

                        //if  response is success then store roleDetails list else store empty list

                        if (validateResponseNew({ response: roleDetails, isList: true })) {
                            let res = parseArray(roleDetails.Roles);

                            //for add roleDetails
                            for (var roleDetailsKey in res) { let item = res[roleDetailsKey]; item.value = item.RoleName; }

                            let roles = [
                                { value: R.strings.selectRole },
                                ...res
                            ];

                            return {
                                ...state, roleDetails,
                                roles
                            };
                        } else {
                            return {
                                ...state, roleDetails,
                                roles: [{ value: R.strings.selectRole }]
                            };
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        roles: [{ value: R.strings.selectRole }]
                    };
                }
            }
        }
        return null;
    }

    componentDidUpdate(prevProps, _prevState) {
        //Get All Updated field of Particular actions
        const { addRoleWiseData } = this.props.data
        if (addRoleWiseData !== prevProps.data.addRoleWiseData) {
            // addRoleWiseData is not null
            if (addRoleWiseData) {

                try {
                    if (this.state.addRoleWiseData == null || (this.state.addRoleWiseData != null && addRoleWiseData !== this.state.addRoleWiseData)) {

                        // Handle Response
                        if (validateResponseNew({ response: addRoleWiseData })) {
                            // Show success dialog
                            showAlert(R.strings.status, addRoleWiseData.ReturnMsg, 0, async () => {

                                this.props.clearRoleWiseData()
                                this.props.navigation.state.params.onSuccess() // if update success call list method from back screen
                                this.props.navigation.goBack()

                            })
                            this.setState({ addRoleWiseData })
                        } else {
                            // clear reducer data
                            this.props.clearRoleWiseData()
                            this.setState({ addRoleWiseData: null })
                        }
                    }
                } catch (error) {
                    // clear reducer data
                    this.props.clearRoleWiseData()
                    this.setState({ addRoleWiseData: null })
                }
            }
        }
    }

    submitData = async () => {

        // validate selected transaction type is empty or not
        if (this.state.selectedTransactionType === R.strings.Select_Type) {
            this.toast.Show(R.strings.selectTransactionType);
            return;
        }
        // validate selected role is empty or not
        if (this.state.selectedRole === R.strings.selectRole) {
            this.toast.Show(R.strings.selectRoleMsg);
            return;
        }
        else {
            //Check NetWork is Available or not
            if (await isInternet()) {

                // Bind Request for addTrnTypeRoleWise
                let request = {
                    RoleId: parseFloat(this.state.selectedRoleCode),
                    TrnTypeId: parseFloat(this.state.selectedTransactionTypeCode),
                    Status: parseFloat(this.state.Status === true ? 1 : 0)
                }

                // call api addTrnTypeRoleWise
                this.props.addTrnTypeRoleWise(request)
            }
        }
    }

    render() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }} >

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.addRoleWiseTransactionType} isBack={true} nav={this.props.navigation} />

                {/* for progress dialog */}
                <ProgressDialog isShow={this.props.data.addFetching || this.props.data.isRoleFetching || this.props.data.isWalletTransactionType} />

                {/* For Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>

                        {/* for status switch */}
                        <FeatureSwitch
                            isGradient={true}
                            title={R.strings.Status}
                            isToggle={this.state.Status}
                            onValueChange={() => {
                                this.setState({
                                    Status: !this.state.Status
                                })
                            }}
                            textStyle={{ color: R.colors.white }}
                        />

                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>


                            {/* picker for transactionType  */}
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.TransactionType}
                                searchable={true}
                                array={this.state.transactionTypes}
                                selectedValue={this.state.selectedTransactionType}
                                onPickerSelect={(index, object) => this.setState({ selectedTransactionType: index, selectedTransactionTypeCode: object.TypeId })}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />

                            {/* picker for role  */}
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.Role}
                                array={this.state.roles}
                                selectedValue={this.state.selectedRole}
                                onPickerSelect={(index, object) => this.setState({ selectedRole: index, selectedRoleCode: object.ID })}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />
                        </View>
                    </ScrollView>

                    {/* To Set Submit Button */}
                    <View style={{
                        paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin,
                        paddingLeft: R.dimens.activity_margin,
                    }}>
                        <Button
                            onPress={this.submitData}
                            title={R.strings.add}
                        ></Button>
                    </View>
                </View>

            </SafeView>
        );
    }
}

function mapStatToProps(state) {
    //Updated Data For RoleWiseTransactionTypesReducer Data 
    let data = {
        ...state.RoleWiseTransactionTypesReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform  getWalletTransactionType Api Data 
        getWalletTransactionType: () => dispatch(getWalletTransactionType()),
        //Perform role type
        getRoleDetails: () => dispatch(getRoleDetails()),
        //Perform addTrnTypeRoleWise
        addTrnTypeRoleWise: (request) => dispatch(addTrnTypeRoleWise(request)),
        //Perform clearRoleWiseData Action 
        clearRoleWiseData: () => dispatch(clearRoleWiseData())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(RoleWiseTransasctionTypeAddScreen);