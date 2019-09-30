import { View, ScrollView, } from 'react-native';
import React from 'react'
import { Component } from 'react';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import Button from '../../../native_theme/components/Button';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import { showAlert, changeTheme } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';
import { getResendEmail, clearEmailQuedata } from '../../../actions/CMS/EmailQueActions';
import EditText from '../../../native_theme/components/EditText';
import EmailQueMultipleSelectionButton from './EmailQueMultipleSelectionButton';

class EmailQueResendEmailScreen extends Component {

    constructor(props) {
        super(props);

        let item = props.navigation.state.params && props.navigation.state.params.item

        //for the RecepientEmail
        let RecepientEmail = []

        //for the RecepientEmail
        if (item.RecepientEmail) {
            let Actions = item.RecepientEmail.split(',')
            Actions.map((action, key) => {
                RecepientEmail.push(
                    { value: action }
                )
            })
        }

        //for the CC
        let CC = []

        //for the CC
        if (item.CC) {
            let Actions = item.CC.split(',')
            Actions.map((action, key) => {
                CC.push(
                    { value: action }
                )
            })
        }

        //for the CC
        let BCC = []

        //for the CC
        if (item.BCC) {
            let Actions = item.BCC.split(',')
            Actions.map((action, key) => {
                BCC.push(
                    { value: action }
                )
            })
        }

        //Define All State initial state
        this.state = {
            item: item,
            RecepientEmail: RecepientEmail,
            CC: CC,
            BCC: BCC,
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

        const { resendEmaildata } = this.props.Listdata;

        if (resendEmaildata !== prevProps.Listdata.resendEmaildata) {
            // for show responce resendEmaildata
            if (resendEmaildata) {
                try {
                    if (validateResponseNew({
                        response: resendEmaildata,
                    })) {
                        showAlert(R.strings.Success, R.strings.resendEmailSuccesffully, 0, () => {
                            this.props.clearEmailQuedata()
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        this.props.clearEmailQuedata()
                    }
                } catch (e) {
                    this.props.clearEmailQuedata()
                }
            }
        }
    }

    ResendEmail = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            //call getResendEmail api
            this.props.getResendEmail({
                EmailID: this.state.item.EmailID
            })
        }
    }

    render() {
        const { resendEmailFetching } = this.props.Listdata;
        let { item } = this.state
        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={R.strings.emailQueue}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={resendEmailFetching} />

                {/* Common Toast */}
                <CommonToast ref={component => this.toast = component} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>

                            {/* Multiselection button for recipients */}
                            {this.state.RecepientEmail.length > 0 &&
                                <EmailQueMultipleSelectionButton
                                    header={R.strings.recipient}
                                    navigate={this.props.navigation.navigate}
                                    data={this.state.RecepientEmail}
                                    numColumns={3}
                                />}

                            {/* Multiselection button for BCC */}
                            {this.state.BCC.length > 0 &&
                                <EmailQueMultipleSelectionButton
                                    header={R.strings.bcc}
                                    navigate={this.props.navigation.navigate}
                                    data={this.state.BCC}
                                    numColumns={3}
                                />}

                            {/* Multiselection button for CC */}
                            {this.state.CC.length > 0 &&
                                <EmailQueMultipleSelectionButton
                                    header={R.strings.cc}
                                    navigate={this.props.navigation.navigate}
                                    data={this.state.CC}
                                    numColumns={3}
                                />}

                            {/* To Set Subject Value in EditText */}
                            <EditText
                                editable={false}
                                header={R.strings.subject}
                                placeholder={R.strings.subject}
                                multiline={true}
                                numberOfLines={2}
                                maxLength={100}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={true}
                                textAlignVertical={'top'}
                                value={item.Subject}
                            />
                        </View>
                    </ScrollView>

                    {/* To Set ResendEmail Button */}
                    {item.Status == 9 &&
                        < View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                            <Button title={R.strings.Resend} onPress={this.ResendEmail}></Button>
                        </View>}
                </View>
            </SafeView >
        );
    }
}

function mapStateToProps(state) {
    return {
        //Updated EmailQueReducer data
        Listdata: state.EmailQueReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getResendEmail List Action 
        getResendEmail: (request) => dispatch(getResendEmail(request)),
        //Perform clearEmailQuedata Action 
        clearEmailQuedata: () => dispatch(clearEmailQuedata())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EmailQueResendEmailScreen)

