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
import { showAlert, changeTheme, parseFloatVal } from '../../../controllers/CommonUtils';
import { isEmpty, isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { setArbiTradeRecon, clearArbiTradeReconData } from '../../../actions/Arbitrage/ArbitrageTradeReconActions';
import SafeView from '../../../native_theme/components/SafeView';
import TextViewHML from '../../../native_theme/components/TextViewHML';

//Create Common class for ArbiTradeReconSetScreen
class ArbiTradeReconSetScreen extends Component {

    constructor(props) {
        super(props);

        this.inputs = {};

        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //for the dynamic actions
        const dynamicAction = [
            { value: R.strings.Success, code: 3 },
            { value: R.strings.successAndDebit, code: 2 },
            { value: R.strings.inProcess, code: 4 },
            { value: R.strings.fail, code: 5 },
            { value: R.strings.cancel, code: 8 },
            { value: R.strings.forceCancel, code: 9 },
            { value: R.strings.Inactive, code: 10 },
            { value: R.strings.active, code: 11 },
            { value: R.strings.releaseInProcess, code: 12 },
            { value: R.strings.reInitialize, code: 13 }
        ]

        //for the dynamic actions
        let dynamicActions = []

        //for the dynamic actions
        if (item.ActionStage) {
            let Actions = item.ActionStage.split(',')

            for (let i = 0; i < Actions.length; i++) {
                for (let j = 0; j < dynamicAction.length; j++) {
                    if (Actions[i] == dynamicAction[j].code) {
                        if (!(dynamicAction[j].code == 12 && item.IsProcessing == 0 || dynamicAction[j].code == 13 && item.IsAPITrade == 0))
                            dynamicActions.push(dynamicAction)
                    }
                }
            }
        }

        //Define All State initial state
        this.state = {
            item: item,
            screenType: props.navigation.state.params && props.navigation.state.params.screenType,

            actions: dynamicActions,
            selectedAction: R.strings.Please_Select,
            selectedActionCode: '',

            remark: '',
        };
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate(nextProps, nextState) {
        //For stop twice api call
        return isCurrentScreen(nextProps)
    }

    async componentDidUpdate(prevProps, prevState) {

        //Get All Updated field of Particular actions
        const { tradeReconSetdata } = this.props.Listdata;

        // check previous props and existing props
        if (tradeReconSetdata !== prevProps.Listdata.tradeReconSetdata) {
            // for show responce tradeReconSetdata
            if (tradeReconSetdata) {
                try {
                    // If tradeReconSetdata validate response shows success dialog else failure dialog
                    if (validateResponseNew({
                        response: tradeReconSetdata,
                        isList: true
                    })) {
                        showAlert(R.strings.Success, R.strings[`error.trading.transaction.${tradeReconSetdata.ErrorCode}`], 0, () => {

                            // Clear data
                            this.props.clearArbiTradeReconData()
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        showAlert(R.strings.status, R.strings[`error.trading.transaction.${tradeReconSetdata.ErrorCode}`], 1, () => {
                            // Clear data
                            this.props.clearArbiTradeReconData()
                        })
                    }
                } catch (e) {
                    // Clear data
                    this.props.clearArbiTradeReconData()
                }
            }
        }
    }

    //submitData
    submitData = async () => {

        //validations for Inputs 
        if (this.state.selectedAction === R.strings.Please_Select) {
            this.toast.Show(R.strings.selectAction)
            return;
        }
        if (isEmpty(this.state.remark)) {
            this.toast.Show(R.strings.enterRemarks)
            return;
        }

        Keyboard.dismiss();

        // Check Internet is Available or not
        if (await isInternet()) {
            //call setArbiTradeRecon api
            this.props.setArbiTradeRecon({
                TranNo: parseFloatVal(this.state.item.TrnNo),
                ActionType: parseFloatVal(this.state.selectedActionCode),
                ActionMessage: this.state.remark,
                //screen type = 1 Arbitrage trade recon , screen type = 2 Trade recon
                screenType: this.state.screenType,
            })
        }
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        const { tradeReconSetFetching } = this.props.Listdata;

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={R.strings.reconcileProcess}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={tradeReconSetFetching} />

                {/* Common Toast */}
                <CommonToast ref={component => this.toast = component} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>

                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>

                            {/* EditText for transactionno  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.transactionNo}
                                placeholder={R.strings.transactionNo}
                                value={this.state.item.TrnNo}
                                editable={false}
                                multiline={false}
                            />

                            {/* EditText for total  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.total}
                                value={(this.state.item.Total).toFixed(8).toString()}
                                editable={false}
                                multiline={false}
                            />

                            {/* picker for action  */}
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.action}
                                array={this.state.actions}
                                selectedValue={this.state.selectedAction}
                                onPickerSelect={(index, object) => this.setState({ selectedAction: index, selectedActionCode: object.code })}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.LineHeight }} />


                            {/* EditText for remarks  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.remarks}
                                maxLength={300}
                                placeholder={R.strings.remarks}
                                onChangeText={(text) => this.setState({ remark: text })}
                                value={this.state.remark}
                                keyboardType={'default'}
                                multiline={true}
                                returnKeyType={"done"}
                                numberOfLines={4}
                                blurOnSubmit={true}
                                textAlignVertical={'top'}
                            />

                            {/* NOTE  */}
                            <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                                <TextViewHML style={{
                                    fontSize: R.dimens.smallestText,
                                    marginLeft: R.dimens.LineHeight, color: R.colors.failRed
                                }}>{' * ' + R.strings.areYouSureYouWantToProceed}</TextViewHML>
                            </View>
                        </View>
                    </ScrollView>

                    {/* To Set Submit Button */}
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button title={R.strings.reconcile} onPress={this.submitData}></Button>
                    </View>
                </View>
            </SafeView >
        );
    }
}

function mapStateToProps(state) {
    return {
        //Updated ArbitrageTradeReconReducer data
        Listdata: state.ArbitrageTradeReconReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //for setArbiTradeRecon  api data
        setArbiTradeRecon: (add) => dispatch(setArbiTradeRecon(add)),
        //for data clear
        clearArbiTradeReconData: () => dispatch(clearArbiTradeReconData()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArbiTradeReconSetScreen)

