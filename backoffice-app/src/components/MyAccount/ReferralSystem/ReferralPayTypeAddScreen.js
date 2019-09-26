import React, { Component } from 'react';
import {
    ScrollView,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import { updateReferralPayType, addReferralPayType, clearData } from '../../../actions/account/ReferralPayTypeAction';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import Button from '../../../native_theme/components/Button';
import EditText from '../../../native_theme/components/EditText';
import { changeTheme } from '../../../controllers/CommonUtils';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { isEmpty, isInternet, validateResponseNew, } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { showAlert } from '../../../controllers/CommonUtils';
import CommonToast from '../../../native_theme/components/CommonToast';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';

class ReferralPayTypeAddScreen extends Component {

    constructor(props) {
        super(props)

        // create reference
        this.toast = React.createRef();

        let item = props.navigation.state.params && props.navigation.state.params.ITEM;

        this.headerText = item == undefined ? R.strings.add_referral_pay_type : R.strings.edit_referral_pay_type;
        this.buttonText = item == undefined ? R.strings.add : R.strings.update;

        //for focus on next field
        this.inputs = {};
        this.state = {
            isFromUpdate: item == undefined ? false : true,
            id: item == undefined ? '' : item.Id,
            payTypeName: item == undefined ? '' : item.PayTypeName,
        }
        //To Bind All Method
        this.focusNextField = this.focusNextField.bind(this);
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const { loading, addReferralPayTypeData, editReferralPayTypeData } = this.props.appData;

        if (addReferralPayTypeData !== prevProps.appData.addReferralPayTypeData) {
            if (!loading) {

                //add response validate
                if (addReferralPayTypeData != null) {
                    if (validateResponseNew({ response: addReferralPayTypeData })) {
                        showAlert(R.strings.status, addReferralPayTypeData.ReturnMsg, 0, () => {
                            //clear add data
                            this.props.clearData()
                            //----
                            if (this.props.navigation.state.params && this.props.navigation.state.params.onRefresh !== undefined) {
                                //refresh previous screen list
                                this.props.navigation.state.params.onRefresh(true)
                            }
                            //navigate to back scrreen
                            this.props.navigation.goBack()
                        })
                    } else {
                        //clear add data
                        this.props.clearData()
                        //----
                    }
                }
            }
        }

        if (editReferralPayTypeData !== prevProps.appData.editReferralPayTypeData) {
            if (!loading) {

                //edit response validate
                if (editReferralPayTypeData != null) {
                    if (validateResponseNew({ response: editReferralPayTypeData })) {
                        showAlert(R.strings.status, editReferralPayTypeData.ReturnMsg, 0, () => {
                            //clear update data
                            this.props.clearData()
                            //--
                            if (this.props.navigation.state.params && this.props.navigation.state.params.onRefresh !== undefined) {
                                //refresh previous screen list
                                this.props.navigation.state.params.onRefresh(true)
                            }
                            //navigate to back scrreen
                            this.props.navigation.goBack()
                        })
                    } else {
                        //clear add data
                        this.props.clearData()
                        //----
                    }
                }
            }
        }
    }

    onPressSubmit = async () => {
        //check for validations
        if (isEmpty(this.state.payTypeName)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.pay_type);
        }
        else {
            if (this.state.isFromUpdate) {
                //for edit
                //Check NetWork is Available or not
                if (await isInternet()) {

                    let request = {
                        Id: this.state.id,
                        PayTypeName: this.state.payTypeName,
                    }
                    // call API  for Updating API
                    this.props.updateReferralPayType(request);
                }
            } else {
                //for add
                //Check NetWork is Available or not
                if (await isInternet()) {
                    let request = {
                        PayTypeName: this.state.payTypeName,
                    }
                    // call API  for Adding API
                    this.props.addReferralPayType(request);
                }

            }
        }
    }
    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }
    //---
    render() {

        let { loading } = this.props.appData
        return (
            <SafeView
                style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={this.headerText}
                    isBack={true}
                    nav={this.props.navigation} />

                {/* Progress Dialog */}
                <ProgressDialog
                    isShow={loading} />

                {/* Common Toast */}
                <CommonToast
                    ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView keyboardShouldPersistTaps='always'
                        showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            {/* EditText for payTypeName  */}
                            <EditText style={{ marginTop: R.dimens.widgetMargin }}
                                returnKeyType={"done"}
                                value={this.state.payTypeName}
                                header={R.strings.pay_type}
                                placeholder={R.strings.pay_type}
                                keyboardType='default'
                                reference={input => { this.inputs['etPayType'] = input; }}
                                onChangeText={(payTypeName) => this.setState({ payTypeName })}
                            //onSubmitEditing={() => { this.focusNextField('etHourlyLimit') }}
                            />

                        </View>
                    </ScrollView>
                    <View
                        style={{
                            paddingLeft: R.dimens.activity_margin,
                            paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin
                        }}>

                        {/* Button for submit  */}
                        <Button
                            title={this.buttonText}
                            onPress={this.onPressSubmit} />
                 
                    </View>
                </View >
            </SafeView>
        );
    }
  
    styles = () => {
       
        return {
            container: {
                flexDirection: 'column',
                flex: 1,
                backgroundColor: R.colors.background
            },
        }
    
    }

}

function mapStateToProps(state) {
    
    //Updated Data For ReferralPayTypeReducerF Data 
   
    return {
        appData: state.ReferralPayTypeReducer,
    }

}

function mapDispatchToProps(dispatch) {
    return {
        //Perform clearData Action 
        clearData: () => dispatch(clearData()),
        //Perform addReferralPayType Action 
        addReferralPayType: (request) => dispatch(addReferralPayType(request)),
        //Perform updateReferralPayType Action 
        updateReferralPayType: (request) => dispatch(updateReferralPayType(request)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReferralPayTypeAddScreen)
