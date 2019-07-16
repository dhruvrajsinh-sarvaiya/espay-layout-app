import React, { Component } from 'react';
import {
    View,
    ScrollView,
} from 'react-native';

import { addNewContactUs, ContactUsCleardata } from '../../actions/CMS/ContactusActions'
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isEmpty, isInternet, validateResponseNew } from '../../validations/CommonValidation'
import Button from '../../native_theme/components/Button'
import { changeTheme, showAlert, sendEvent } from '../../controllers/CommonUtils';
import EditText from '../../native_theme/components/EditText'
import { CheckEmailValidation } from '../../validations/EmailValidation'
import { isCurrentScreen } from '../Navigation';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import CommonToast from '../../native_theme/components/CommonToast';
import R from '../../native_theme/R';
import TextViewMR from '../../native_theme/components/TextViewMR';
import { Events } from '../../controllers/Constants';
import SafeView from '../../native_theme/components/SafeView';

class ContactUs extends Component {
    constructor(props) {
        super(props);

        //for focus on next field
        this.inputs = {};

        //initial state for contact us
        this.state = {
            EmailAddress: '',
            subject: '',
            description: '',
        }
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    //To Redirect user to Main Screen
    Redirection = async () => {
        //To move to dashboard
        sendEvent(Events.MoveToMainScreen, 0);
        this.props.navigation.navigate('MainScreen')
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        return isCurrentScreen(nextProps);
    };

    //check validation and pass data and call api and internet condition
    submitdata = async () => {

        //regex for non-special characters
        let regex = /^[a-zA-Z0-9 ]+$/;

        if (isEmpty(this.state.EmailAddress)) {
            this.refs.Toast.Show(R.strings.E_mail_blank)
            return;
        }
        else if (isEmpty(this.state.subject)) {
            this.refs.Toast.Show(R.strings.subject_blank)
            return;
        }
        else if (isEmpty(this.state.description)) {
            this.refs.Toast.Show(R.strings.Description_blank)
            return;
        }
        //vaidation on length
        else if (this.state.subject.length < 2 || this.state.subject.length > 100) {
            this.refs.Toast.Show(R.strings.subject_length_validation)
        }
        //vaidation on length
        else if (this.state.description.length < 10 || this.state.description.length > 300) {
            this.refs.Toast.Show(R.strings.description_length_validation)
        }
        else if (CheckEmailValidation(this.state.EmailAddress)) {
            this.refs.Toast.Show(R.strings.Enter_Valid_Email)
            return;
        }
        //for checking non special character
        else if (!regex.test(this.state.subject)) {
            this.refs.Toast.Show(R.strings.enter_proper + ' ' + R.strings.subject)
        }
        else if (!regex.test(this.state.description)) {
            this.refs.Toast.Show(R.strings.enter_proper + ' ' + R.strings.description)
        }
        else {
            if (await isInternet()) {

                let email = this.state.EmailAddress;
                let subject = this.state.subject;
                let description = this.state.description;

                //form request for contact us
                let request = {
                    email: email,
                    subject: subject,
                    description: description,
                }

                //make  API Call for Contact us
                this.props.addNewContactUs(request)
                //---------
            }
        }
    }

    componentDidUpdate = (prevProps, _prevState) => {

        const { addUpdateStatus } = this.props.appData;
        if (addUpdateStatus !== prevProps.appData.addUpdateStatus) {
            if (addUpdateStatus != null) {
                try {
                    if (validateResponseNew({ response: addUpdateStatus, returnCode: addUpdateStatus.responseCode, returnMessage: addUpdateStatus.message })) {
                        // on success Display success dialog and clear input values
                        showAlert(R.strings.Success + '!', "Success", 0, () => {
                            //clear data
                            this.props.ContactUsCleardata()
                            //--------

                            //Redirect To Main Screen
                            this.Redirection()
                        })
                    }
                } catch (e) {

                }
            }
        }
    };

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    render() {
        //loading bit for handling progress dialog
        let { loading } = this.props.appData

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }} >

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.Contact_Us} isBack={true} nav={this.props.navigation} />

                {/* For Progress dialog */}
                <ProgressDialog isShow={loading} />

                {/* For Toast */}
                <CommonToast ref="Toast" />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                            {/* for email address */}
                            <EditText
                                header={R.strings.EmailId}
                                reference={input => { this.inputs['etEmail'] = input; }}
                                placeholder={R.strings.EmailId}
                                multiline={false}
                                maxLength={50}
                                returnKeyType={"next"}
                                onSubmitEditing={() => { this.focusNextField('etSubject') }}
                                onChangeText={(text) => this.setState({ EmailAddress: text })}
                                value={this.state.EmailAddress}
                            />
                            {/* for subject */}
                            <EditText
                                header={R.strings.subject}
                                reference={input => { this.inputs['etSubject'] = input; }}
                                placeholder={R.strings.subject}
                                multiline={false}
                                maxLength={100}
                                returnKeyType={"next"}
                                onSubmitEditing={() => { this.focusNextField('etDescription') }}
                                onChangeText={(text) => this.setState({ subject: text })}
                                value={this.state.subject}
                            />
                            {/* for description */}
                            <EditText
                                header={R.strings.description}
                                placeholder={R.strings.description}
                                reference={input => { this.inputs['etDescription'] = input; }}
                                multiline={true}
                                blurOnSubmit={true}
                                numberOfLines={4}
                                textAlignVertical='top'
                                maxLength={300}
                                returnKeyType={"done"}
                                onChangeText={(text) => this.setState({ description: text })}
                                value={this.state.description}
                            />
                            <TextViewMR style={[this.styles().titleItem, { marginLeft: R.dimens.LineHeight, color: R.colors.failRed, marginTop: R.dimens.WidgetPadding }]}>{R.strings.note_text} : </TextViewMR>
                            <TextViewMR style={[this.styles().titleItem, { marginLeft: R.dimens.LineHeight, color: R.colors.failRed }]}>{R.strings.contact_us_note}</TextViewMR>
                        </View>
                    </ScrollView>

                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Submit Button */}
                        <Button title={R.strings.submit} onPress={this.submitdata}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }

    // styles for this class
    styles = () => {
        return {
            titleItem: {
                fontSize: R.dimens.smallestText,
                color: R.colors.textSecondary,
            },
        }
    }
}

function mapStateToProps(state) {
    return {
        //data get from the reducer and set to contactus data
        appData: state.ContactUsReducer
    }
}
function mapDispatchToProps(dispatch) {
    return {
        //here dispatch action and pass to action file and then goes to saga then data set to reducer and change state acording to responce.
        addNewContactUs: (request) => dispatch(addNewContactUs(request)),
        ContactUsCleardata: () => dispatch(ContactUsCleardata())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ContactUs)