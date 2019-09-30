import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { changeTheme, parseIntVal, parseArray, showAlert } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import CommonToast from '../../../native_theme/components/CommonToast';
import Button from '../../../native_theme/components/Button';
import EditText from '../../../native_theme/components/EditText';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import { isEmpty, isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { getDepositionIntervalList, addDepositionInterval, clearDepositionInterval } from '../../../actions/Wallet/DepositionIntervalActions';
import { connect } from 'react-redux';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';

export class DepositionIntervalScreen extends Component {
    constructor(props) {
        super(props);

        // Define all state initial state
        this.state = {
            HistoryFetchInterval: '',
            StatusCheckInterval: '',
            DepositionIntervalListState: null,
            Status: false,

            isFirstTime: true,
        }

        this.inputs = {}
        // Create reference
        this.toast = React.createRef();
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // check internet connection
        if (await isInternet()) {
            // Call Deposition Interval List Api
            this.props.getDepositionIntervalList()
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    //this Method is used to focus on next feild 
    focusNextField(id) {
        this.inputs[id].focus();
    }

    onSubmitPress = async () => {
        // call api after check all validation
        if (isEmpty(this.state.HistoryFetchInterval))
            this.toast.Show(R.strings.enterHistoryFetchInterval)
        // History Fetch Interval value is not smaller than 300 and not greater than 3600
        else if (parseIntVal(this.state.HistoryFetchInterval) < 300)
            this.toast.Show(R.strings.amountBetween300To3600)
        else if (parseIntVal(this.state.HistoryFetchInterval) > 3600)
            this.toast.Show(R.strings.amountBetween300To3600)
        if (isEmpty(this.state.StatusCheckInterval))
            this.toast.Show(R.strings.enterStatusCheckInterval)
        // Status Check Interval value is not smaller than 300 and not greater than 3600
        else if (parseIntVal(this.state.StatusCheckInterval) < 300)
            this.toast.Show(R.strings.amountBetween300To3600)
        else if (parseIntVal(this.state.StatusCheckInterval) > 3600)
            this.toast.Show(R.strings.amountBetween300To3600)
        else {

            // check internet connection
            if (await isInternet()) {
                let req = {
                    DepositHistoryFetchListInterval: parseIntVal(this.state.HistoryFetchInterval),
                    DepositStatusCheckInterval: parseIntVal(this.state.StatusCheckInterval),
                    Status: this.state.Status ? 1 : 0,
                }
                this.props.addDepositionInterval(req)
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
        if (DepositionIntervalScreen.oldProps !== props) {
            DepositionIntervalScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { DepositionIntervalList, } = props.DepositionIntervalResult;

            // DepositionIntervalList is not null
            if (DepositionIntervalList) {
                try {
                    if (state.DepositionIntervalListState == null || (state.DepositionIntervalListState != null && DepositionIntervalList !== state.DepositionIntervalListState)) {

                        //succcess response fill the list 
                        if (validateResponseNew({ response: DepositionIntervalList, isList: true })) {

                            // parse deposition interval list array
                            let res = parseArray(DepositionIntervalList.ListDepositionInterval)

                            return Object.assign({}, state, {
                                DepositionIntervalListState: DepositionIntervalList,
                                HistoryFetchInterval: res[0].DepositHistoryFetchListInterval.toString(),
                                StatusCheckInterval: res[0].DepositStatusCheckInterval.toString(),
                                Status: res[0].Status == 1 ? true : false,
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                DepositionIntervalListState: null,
                                HistoryFetchInterval: '',
                                StatusCheckInterval: '',
                                Status: false,
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        DepositionIntervalListState: null,
                        HistoryFetchInterval: '',
                        StatusCheckInterval: '',
                        Status: false,
                    })
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }
        }
        return null
    }

    componentDidUpdate(prevProps, _prevState) {

        //Get All Updated field of Particular actions
        const { AddDepositionInterval, } = this.props.DepositionIntervalResult

        if (AddDepositionInterval !== prevProps.DepositionIntervalResult.AddDepositionInterval) {
            // AddDepositionInterval is not null
            if (AddDepositionInterval) {
                try {
                    if (this.state.AddDepositionInterval == null || (this.state.AddDepositionInterval != null && AddDepositionInterval !== this.state.AddDepositionInterval)) {

                        // Handle Response
                        if (validateResponseNew({ response: AddDepositionInterval, isList: true })) {
                            showAlert(R.strings.status, AddDepositionInterval.ReturnMsg, 0, () => {
                                this.props.clearDepositionInterval()
                                this.props.navigation.goBack()
                            })
                            this.setState({ AddDepositionInterval })
                        } else {
                            this.props.clearDepositionInterval()
                            this.setState({ AddDepositionInterval: null })
                        }
                    }
                } catch (error) {
                    this.props.clearDepositionInterval()
                    this.setState({ AddDepositionInterval: null })
                }
            }
        }
    }

    render() {
        // Loading status for Progress bar which is fetching from reducer
        const { DepositionIntervalLoading, AddDepositionIntervalLoading } = this.props.DepositionIntervalResult;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    nav={this.props.navigation}
                    title={R.strings.depositionInterval}
                />

                {/* For Toast */}
                <CommonToast ref={component => this.toast = component} />

                {/* Progress bar */}
                <ProgressDialog isShow={DepositionIntervalLoading || AddDepositionIntervalLoading} />

                {/* Toggle Button For Status Enable/Disable Functionality */}
                <FeatureSwitch
                    isGradient={true}
                    title={this.state.Status ? R.strings.Enable : R.strings.Disable}
                    isToggle={this.state.Status}
                    onValueChange={() => this.setState({ Status: !this.state.Status })}
                />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>

                        <View style={this.styles().mainView}>
                            {/* Input of History Fetch Interval */}
                            <EditText
                                isRequired={true}
                                header={R.strings.historyFetchInterval}
                                placeholder={R.strings.historyFetchInterval}
                                multiline={false}
                                keyboardType='numeric'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                maxLength={250}
                                onChangeText={(item) => this.setState({ HistoryFetchInterval: item })}
                                value={this.state.HistoryFetchInterval}
                                reference={input => { this.inputs['etHistoryFetchInterval'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('etStatusCheckInterval') }}
                                validate={true}
                                onlyDigit={true}
                            />

                            {/* Input of Status Check Interval */}
                            <EditText
                                isRequired={true}
                                header={R.strings.statusCheckInterval}
                                placeholder={R.strings.statusCheckInterval}
                                multiline={false}
                                keyboardType='numeric'
                                returnKeyType={"done"}
                                maxLength={250}
                                onChangeText={(item) => this.setState({ StatusCheckInterval: item })}
                                value={this.state.StatusCheckInterval}
                                reference={input => { this.inputs['etStatusCheckInterval'] = input; }}
                                validate={true}
                                onlyDigit={true}
                            />
                        </View>
                    </ScrollView>

                    <View style={this.styles().submitButton}>
                        {/* To Set Submit Button */}
                        <Button title={R.strings.submit} onPress={this.onSubmitPress}></Button>
                    </View>
                </View>
            </SafeView>
        )
    }

    styles = () => {
        return {
            mainView: {
                paddingLeft: R.dimens.activity_margin,
                paddingRight: R.dimens.activity_margin,
                paddingTop: R.dimens.padding_top_bottom_margin,
                paddingBottom: R.dimens.padding_top_bottom_margin,
            },
            submitButton: {
                paddingLeft: R.dimens.activity_margin,
                paddingRight: R.dimens.activity_margin,
                paddingBottom: R.dimens.widget_top_bottom_margin,
                paddingTop: R.dimens.widget_top_bottom_margin
            }
        }
    }
}

const mapStateToProps = (state) => {
    return {
        // get deposition interval data from reducer
        DepositionIntervalResult: state.DepositionIntervalReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    // Perform Deposition Interval List Action
    getDepositionIntervalList: () => dispatch(getDepositionIntervalList()),
    // Perform Add Deposition Interval List Action
    addDepositionInterval: (payload) => dispatch(addDepositionInterval(payload)),
    // Clear Deposition Interval Action
    clearDepositionInterval: () => dispatch(clearDepositionInterval()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DepositionIntervalScreen);