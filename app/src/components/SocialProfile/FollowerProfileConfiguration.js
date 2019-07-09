import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { isCurrentScreen } from '../Navigation';
import { changeTheme, getDeviceID, showAlert, parseIntVal, parseFloatVal } from '../../controllers/CommonUtils';
import EditText from '../../native_theme/components/EditText';
import Button from '../../native_theme/components/Button';
import { isEmpty, isInternet, validateResponseNew } from '../../validations/CommonValidation';
import CommonToast from '../../native_theme/components/CommonToast';
import { TitlePicker } from '../Widget/ComboPickerWidget';
import { getLeaderFollowById, editFollowerConfig, clearFollowerConfig } from '../../actions/SocialProfile/SocialProfileActions';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { ServiceUtilConstant } from '../../controllers/Constants';
import R from '../../native_theme/R';
import SafeView from '../../native_theme/components/SafeView';

class FollowerProfileConfiguration extends Component {
    constructor(props) {
        super(props);

        //Data from previous screen
        let item = props.navigation.state.params && props.navigation.state.params.leaderIds
        let LeaderId = props.navigation.state.params && props.navigation.state.params.LeaderId

        //Define inital state
        this.state = {
            TradeLimit: '',
            CopyTradeLimit: '',
            TradeType: [
                { value: R.strings.Please_Select },
                { value: R.strings.CopyTrade },
                { value: R.strings.MirrorTrade }
            ],
            selectedTradeType: R.strings.Please_Select,
            LeaderIds: item,
            LeaderId: LeaderId,
            isFirstTime: true,
        };

        //Create reference
        this.toast = React.createRef();
    }

    shouldComponentUpdate(nextProps, nextState) {
        /* stop twice api call  */
        return isCurrentScreen(nextProps);
    };

    async componentDidMount() {
        changeTheme()

        // Check internet connection
        if (await isInternet()) {

            // Leader Follow By Id Api call
            this.props.getLeaderFollowById({ LeaderId: this.state.LeaderId })
        }
    };

    onSelectTradeType = (item) => {
        // selected item and value are different
        if (this.state.selectedTradeType !== item) {

            // selectedItem is copy trade 
            if (item === R.strings.CopyTrade) {
                let CopyTradeLimit = this.state.CopyTradeLimit;
                this.setState({ selectedTradeType: item, TradeLimit: CopyTradeLimit })
            } else if (item === R.strings.MirrorTrade) {
                // Trade Limit assign with 100 when selectedItem is MirrorTrade 
                this.setState({ TradeLimit: '100', selectedTradeType: item })
            } else {
                this.setState({ TradeLimit: '', selectedTradeType: item })
            }
        }
    }

    // Called when user press on save button
    onSavePress = async () => {

        // Check Validation
        if (this.state.selectedTradeType === R.strings.Please_Select)
            this.toast.Show(R.strings.TradeTypeValidation)

        else if (isEmpty(this.state.TradeLimit))
            this.toast.Show(R.strings.TradeLimitValidation)

        else {
            if (this.state.selectedTradeType === R.strings.CopyTrade) {
               
                // Value between 0 to 99
                if (!(parseIntVal(this.state.TradeLimit) > 0 && parseIntVal(this.state.TradeLimit) < 100)) {
                    this.toast.Show(R.strings.TradeLimitValueValidation)
                    return
                }
            }
            let copytrade;
            let mirrortrade;
            if (this.state.selectedTradeType === R.strings.CopyTrade) {
                copytrade = 1
                mirrortrade = 2
            } else {
                copytrade = 2
                mirrortrade = 1
            }

            //bind Request For Edit Follwer Profile Configuration
            let req = {
                LeaderId: this.state.LeaderIds !== undefined ? this.state.LeaderIds : this.state.LeaderId,
                Can_Copy_Trade: copytrade,
                Can_Mirror_Trade: mirrortrade,
                Trade_Percentage: parseFloatVal(this.state.TradeLimit),
                DeviceId: await getDeviceID(),
                Mode: ServiceUtilConstant.Mode,
                HostName: ServiceUtilConstant.hostName
                //Note : ipAddress parameter is passed in its saga
            }
          
            // Check internet connection
            if (await isInternet()) {
                
                // Edit Follower Profile Configuration api 
                this.props.editFollowerConfig(req)
            }
        }
    }

    componentDidUpdate = (prevProps, _prevState) => {

        //Get All Updated field of Particular actions
        const { EditFollowerConfigData } = this.props.SocialProfileResult

        if (EditFollowerConfigData !== prevProps.SocialProfileResult.EditFollowerConfigData) {

            // EditFollowerConfigData is not null
            if (EditFollowerConfigData) {
                try {
                   
                    // Handle Response
                    if (validateResponseNew({ response: EditFollowerConfigData })) {
                        showAlert(R.strings.Success + '!', this.props.SocialProfileResult.EditFollowerConfigData.ReturnMsg, 0, () => {
                            this.props.clearFollowerConfig()
                            this.props.navigation.state.params.onRefresh(true)
                            this.props.navigation.goBack()
                        });
                    }
                    else {
                        this.props.clearFollowerConfig()
                    }
                } catch (error) {
                    this.props.clearFollowerConfig()
                }
            }
        }
    }

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }
      
        if (isCurrentScreen(props)) {

            //Get All Updated field of Particular actions
            const { LeaderFollowByIdData } = props.SocialProfileResult

            // LeaderFollowByIdData is not null
            if (LeaderFollowByIdData) {
                try {
                    if (state.LeaderFollowByIdData == null || (state.LeaderFollowByIdData != null && LeaderFollowByIdData !== state.LeaderFollowByIdData)) {

                        // Handle Response
                        if (validateResponseNew({ response: LeaderFollowByIdData })) {

                            let response = LeaderFollowByIdData.FollowerFrontConfiguration
                            let type = ''
                            if (response.Can_Copy_Trade == 1)
                                type = R.strings.CopyTrade
                            else if (response.Can_Mirror_Trade == 1)
                                type = R.strings.MirrorTrade
                            else
                                type = R.strings.Please_Select
                            return {
                                ...state,
                                selectedTradeType: type,
                                TradeLimit: response.Default_Copy_Trade_Percentage.toString(),
                                CopyTradeLimit: response.Default_Copy_Trade_Percentage.toString(),
                                LeaderFollowByIdData,
                            }
                        } else {
                            return {
                                ...state,
                                LeaderFollowByIdData: LeaderFollowByIdData,
                            }
                        }
                    }
                } catch (error) {
                    return {
                        ...state,
                        LeaderFollowByIdData: LeaderFollowByIdData,
                    }
                    // logger('error in Follower', error.message)
                }
            }
        }
        return null
    };

    render() {

        let { LeaderFollowByIdLoading, EditFollowerConfigLoading } = this.props.SocialProfileResult

        let isEditable = true
        if (this.state.selectedTradeType === R.strings.MirrorTrade)
            isEditable = false
        return (
            <SafeView style={this.style().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.FollowerProfileConfig}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress bar */}
                <ProgressDialog isShow={LeaderFollowByIdLoading || EditFollowerConfigLoading} />

                {/* Custom Toast */}
                <CommonToast ref={component => this.toast = component} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View style={{ marginTop: R.dimens.padding_top_bottom_margin, marginBottom: R.dimens.padding_top_bottom_margin, marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin }}>
                        <ScrollView showsVerticalScrollIndicator={false} >

                            {/* Picker for Trade Type */}
                            <TitlePicker
                                title={R.strings.tradeType}
                                array={this.state.TradeType}
                                selectedValue={this.state.selectedTradeType}
                                onPickerSelect={(item) => this.onSelectTradeType(item)} />

                            {/* To set Trade Limit */}
                            <EditText
                                editable={isEditable}
                                header={R.strings.TradeLimit}
                                placeholder={R.strings.TradeLimitValidation}
                                multiline={false}
                                keyboardType='numeric'
                                returnKeyType={"done"}
                                onChangeText={(Text) => this.setState({ TradeLimit: Text })}
                                value={this.state.TradeLimit}
                                validate={true}
                                validPercentage={true}
                            />

                        </ScrollView>
                    </View>
                </View>

                {/* Save Button */}
                <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                    <Button title={R.strings.Save} onPress={this.onSavePress}></Button>
                </View>

            </SafeView>
        );
    }
    
    style = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background,
            },
        }
    }
}

// return state from saga or reducer
const mapStateToProps = (state) => {
    return {
        //Updated Data For edit Follwer Profile Configuration Action
        SocialProfileResult: state.SocialProfileReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Get method for Leader Follow by Id
    getLeaderFollowById: (payload) => dispatch(getLeaderFollowById(payload)),
    // Edit Follower Configuration
    editFollowerConfig: (payload) => dispatch(editFollowerConfig(payload)),
    // Clear Follwer Configuration
    clearFollowerConfig: () => dispatch(clearFollowerConfig()),
})

export default connect(mapStateToProps, mapDispatchToProps)(FollowerProfileConfiguration);