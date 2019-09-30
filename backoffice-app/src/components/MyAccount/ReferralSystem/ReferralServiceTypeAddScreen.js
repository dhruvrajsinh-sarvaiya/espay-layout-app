import React, { Component } from 'react';
import {
    ScrollView,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import { updateReferralServiceType, addReferralServiceType, clearData } from '../../../actions/account/ReferralServiceTypeAction';
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

class ReferralServiceTypeAddScreen extends Component {

    constructor(props) {
        super(props)

        // create reference
        this.toast = React.createRef();

        let item = props.navigation.state.params && props.navigation.state.params.ITEM;
        this.headerText = item == undefined ? R.strings.add_referral_service_type : R.strings.edit_referral_service_type;
        this.buttonText = item == undefined ? R.strings.add : R.strings.update;

        //for focus on next field
        this.inputs = {};

        //define all initial state 
        this.state = {
            isFromUpdate: item == undefined ? false : true,
            id: item == undefined ? '' : item.Id,
            serviceTypeName: item == undefined ? '' : item.ServiceTypeName,
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    componentWillMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const { loading, addReferralServiceTypeData, editReferralServiceTypeData } = this.props.appData;
        if (addReferralServiceTypeData !== prevProps.appData.addReferralServiceTypeData) {
            if (!loading) {
                if (addReferralServiceTypeData != null) {
                    if (validateResponseNew({ response: addReferralServiceTypeData })) {
                        showAlert(R.strings.status, addReferralServiceTypeData.ReturnMsg, 0, () => {
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

        if (editReferralServiceTypeData !== prevProps.appData.editReferralServiceTypeData) {
            if (!loading) {
                if (editReferralServiceTypeData != null) {
                    if (validateResponseNew({ response: editReferralServiceTypeData })) {
                        showAlert(R.strings.status, editReferralServiceTypeData.ReturnMsg, 0, () => {
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
        if (isEmpty(this.state.serviceTypeName)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.service_type);
        }
        else {
            if (this.state.isFromUpdate) {
                //for edit
                //Check NetWork is Available or not
                if (await isInternet()) {

                    let request = {
                        Id: this.state.id,
                        ServiceTypeName: this.state.serviceTypeName,
                    }
                    // call API  for Updating API
                    this.props.updateReferralServiceType(request);
                }
            } else {
                //for add
                //Check NetWork is Available or not
                if (await isInternet()) {
                    let request = {
                        ServiceTypeName: this.state.serviceTypeName,
                    }
                    // call API  for Adding API
                    this.props.addReferralServiceType(request);
                }

            }
        }
    }
    //this Method is used to focus on next feild
    focusNextField(id) { this.inputs[id].focus(); }
    //---
    render() {

        let { loading } = this.props.appData
        return (
            <SafeView style={this.styles().container}
            >

                {/* To set status bar as per our theme */}
                <CommonStatusBar
                />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={this.headerText} isBack={true} nav={this.props.navigation} />

                {/* Progress Dialog */}
                <ProgressDialog isShow={loading} />

                {/* Common Toast */}
                <CommonToast
                    ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView keyboardShouldPersistTaps='always'
                        showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            {/* EditText for serviceType */}
                            <EditText
                                style={{ marginTop: R.dimens.widgetMargin }}
                                reference={input => { this.inputs['etServiceType'] = input; }}
                                value={this.state.serviceTypeName}
                                header={R.strings.service_type}
                                placeholder={R.strings.service_type}
                                keyboardType='default'
                                returnKeyType={"done"}
                                onChangeText={(serviceTypeName) => this.setState({ serviceTypeName })}
                            //onSubmitEditing={() => { this.focusNextField('etHourlyLimit') }}
                            />

                        </View>
                    </ScrollView>
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>

                        {/* Button for submit */}
                        <Button title={this.buttonText}
                            onPress={this.onPressSubmit} />
                    </View>

                </View >
            </SafeView >
        );
    }
    styles = () => {
        return {
            container: {
                flexDirection: 'column',
                backgroundColor: R.colors.background,
                flex: 1,
            },
        }
    }
}
function mapStateToProps(state) {
    //Updated Data For ReferralServiceTypeReducer Data 
    return {
        appData: state.ReferralServiceTypeReducer,
    }

}

function mapDispatchToProps(dispatch) {
    return {
        //Perform clearData Action 
        clearData: () => dispatch(clearData()),
        //Perform addReferralServiceType Action 
        addReferralServiceType: (request) => dispatch(addReferralServiceType(request)),
        //Perform updateReferralServiceType Action 
        updateReferralServiceType: (request) => dispatch(updateReferralServiceType(request)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReferralServiceTypeAddScreen)
