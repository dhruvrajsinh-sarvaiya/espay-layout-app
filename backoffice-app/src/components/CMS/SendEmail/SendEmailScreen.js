import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { changeTheme, parseArray, showAlert } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import R from '../../../native_theme/R';
import { MultipleSelectionButton } from '../../../native_theme/components/MultipleSelection';
import { getChatUserList } from '../../../actions/PairListAction';
import { connect } from 'react-redux';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import EditText from '../../../native_theme/components/EditText';
import Button from '../../../native_theme/components/Button';
import { sendEmailData, clearSendEmailData } from '../../../actions/CMS/SendEmailActions';
import CommonToast from '../../../native_theme/components/CommonToast';
import { CheckEmailValidation } from '../../../validations/EmailValidation';

export class SendEmailScreen extends Component {

    constructor(props) {
        super(props)

        //Define all initial state
        this.state = {
            Recipient: [],
            BCC: [],
            CC: [],

            UserDataListState: null,
            SendEmailDataState: null,

            selectedRecipient: [],
            selectedBCC: [],
            selectedCC: [],

            Subject: '',
            Message: '',
            isFirstTime: true,
            disabled: false,

            recFlag: false,
            ccFlag: false,
            bccFlag: false,

            mailLimit: 100,
        }

        //Create reference
        this.inputs = {}
        this.toast = React.createRef()
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme()

        // check internet connection
        if (await isInternet()) {
            // Call Wallet Data Api
            this.props.getChatUserList()
        }
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    // Check validation when user select recipient address from multiselection dropdown
    onRecipientAddressChange = (selectedRec) => {
        let flagBcc = false, flagCc = false
        for (var recipientDataItem in selectedRec) {
            let data = selectedRec[recipientDataItem]

            if (this.state.selectedBCC.length > 0) {
                let findIndex = this.state.selectedBCC.findIndex(item => item.value === data.value)

                if (findIndex > -1)
                    flagBcc = true
            }

            if (this.state.selectedCC.length > 0) {
                let findIndex = this.state.selectedCC.findIndex(item => item.value === data.value)
                if (findIndex > -1)
                    flagCc = true
            }
        }
        if (flagBcc) {
            this.setState({ bccFlag: true, selectedRecipient: selectedRec, })
            this.toast.Show(R.strings.sameBCCAddressValidation)
        } else if (flagCc) {
            this.setState({ ccFlag: true, selectedRecipient: selectedRec, })
            this.toast.Show(R.strings.sameCCAddressValidation)
        } else {
            let totalCount = selectedRec.length + this.state.selectedBCC.length + this.state.selectedCC.length

            if (totalCount > this.state.mailLimit) {
                this.toast.Show(R.strings.moreThan100EmailValidation)
                this.setState({ disabled: true, selectedRecipient: selectedRec, bccFlag: false, ccFlag: false })
            }
            else {
                this.setState({ disabled: false, selectedRecipient: selectedRec, bccFlag: false, ccFlag: false })
            }
        }

    }

    // Check validation when user select bcc address from multiselection dropdown
    onBccAddressChange = (selectedBcc) => {

        let flagRec = false, flagCc = false
        for (var bccDataItem in selectedBcc) {
            let data = selectedBcc[bccDataItem]

            if (this.state.selectedRecipient.length > 0) {
                let findIndex = this.state.selectedRecipient.findIndex(item => item.value === data.value)
                if (findIndex > -1)
                    flagRec = true
            }

            if (this.state.selectedCC.length > 0) {
                let findIndex = this.state.selectedCC.findIndex(item => item.value === data.value)
                if (findIndex > -1)
                    flagCc = true
            }
        }

        if (flagRec) {
            this.setState({ recFlag: true, selectedBCC: selectedBcc })
            this.toast.Show(R.strings.sameRecipientAddressValidation)
        }
        else if (flagCc) {
            this.setState({ ccFlag: true, selectedBCC: selectedBcc })
            this.toast.Show(R.strings.sameCCAddressValidation)
        } else {
            let totalCount = this.state.selectedRecipient.length + selectedBcc.length + this.state.selectedCC.length

            if (totalCount > this.state.mailLimit) {
                this.toast.Show(R.strings.moreThan100EmailValidation)
                this.setState({ disabled: true, selectedBCC: selectedBcc, recFlag: false, ccFlag: false })
            }
            else
                this.setState({ disabled: false, selectedBCC: selectedBcc, recFlag: false, ccFlag: false })
        }
    }

    // Check validation when user select cc address from multiselection dropdown
    onCcAddressChange = (selectedCc) => {

        let flagRec = false, flagBcc = false
        for (var ccDataItem in selectedCc) {
            let data = selectedCc[ccDataItem]

            if (this.state.selectedRecipient.length > 0) {
                let findIndex = this.state.selectedRecipient.findIndex(item => item.value === data.value)
                if (findIndex > -1)
                    flagRec = true
            }

            if (this.state.selectedBCC.length > 0) {
                let findIndex = this.state.selectedBCC.findIndex(item => item.value === data.value)
                if (findIndex > -1)
                    flagBcc = true
            }
        }

        if (flagRec) {
            this.setState({ recFlag: true, selectedCC: selectedCc })
            this.toast.Show(R.strings.sameRecipientAddressValidation)
        }
        else if (flagBcc) {
            this.setState({ bccFlag: true, selectedCC: selectedCc })
            this.toast.Show(R.strings.sameBCCAddressValidation)
        }
        else {
            let totalCount = this.state.selectedRecipient.length + this.state.selectedBCC.length + selectedCc.length

            if (totalCount > this.state.mailLimit) {
                this.toast.Show(R.strings.moreThan100EmailValidation)
                this.setState({ disabled: true, selectedCC: selectedCc, recFlag: false, bccFlag: false })
            }
            else
                this.setState({ disabled: false, selectedCC: selectedCc, recFlag: false, bccFlag: false })
        }

    }

    // Call api after check validation
    onEmailSend = async () => {

        let totalCount = this.state.selectedRecipient.length + this.state.selectedBCC.length + this.state.selectedCC.length
        //all validations 
        if (this.state.selectedRecipient.length < 1)
            this.toast.Show(R.strings.selectRecipientAddress)
        else if (totalCount > this.state.mailLimit)
            this.toast.Show(R.strings.moreThan100EmailValidation)
        else if (this.state.recFlag)
            this.toast.Show(R.strings.sameRecipientAddressValidation)
        else if (this.state.bccFlag)
            this.toast.Show(R.strings.sameBCCAddressValidation)
        else if (this.state.ccFlag)
            this.toast.Show(R.strings.sameCCAddressValidation)
        else if (isEmpty(this.state.Subject))
            this.toast.Show(R.strings.Enter_Subject)
        else if (isEmpty(this.state.Message))
            this.toast.Show(R.strings.enter_message)
        else {

            // Check email validation for Recipient Address
            if (this.state.selectedRecipient.length > 0) {
                for (var selelctDataItem in this.state.selectedRecipient) {
                    let item = this.state.selectedRecipient[selelctDataItem]
                    if (CheckEmailValidation(item.value)) {
                        this.toast.Show(R.strings.recipientAddressNotValid)
                        return
                    }
                }
            }

            // Check email validation for BCC Address
            if (this.state.selectedBCC.length > 0) {
                for (var dataItemBccKey in this.state.selectedBCC) {
                    let item = this.state.selectedBCC[dataItemBccKey]
                    if (CheckEmailValidation(item.value)) {
                        this.toast.Show(R.strings.bccAddressNotValid)
                        return
                    }
                }
            }

            // Check email validation for CC Address
            if (this.state.selectedCC.length > 0) {
                for (var ccKey in this.state.selectedCC) {
                    let item = this.state.selectedCC[ccKey]
                    if (CheckEmailValidation(item.value)) {
                        this.toast.Show(R.strings.ccAddressNotValid)
                        return
                    }
                }
            }

            let body = '<p>' + this.state.Message + '</p>'
            let recepient = [], bcc = [], cc = []

            for (var receiptKey in this.state.selectedRecipient) {
                let item = this.state.selectedRecipient[receiptKey]
                recepient.push(item.value)
            }

            for (var bccKey in this.state.selectedBCC) {
                let item = this.state.selectedBCC[bccKey]
                bcc.push(item.value)
            }

            for (var ccItemKey in this.state.selectedCC) {
                let item = this.state.selectedCC[ccItemKey]
                cc.push(item.value)
            }

            // check internet connection
            if (await isInternet()) {

                let req = {
                    Recepient: recepient,
                    BCC: this.state.selectedBCC.length > 0 ? bcc : [],
                    CC: this.state.selectedCC.length > 0 ? cc : [],
                    Body: body,
                    Subject: this.state.Subject
                }

                // Call Send Email Api
                this.props.sendEmailData(req)
            }
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (SendEmailScreen.oldProps !== props) {
            SendEmailScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { UserDataList, } = props.SendEmailResult;

            // UserDataList is not null
            if (UserDataList) {
                try {
                    //if local UserDataList state is null or its not null and also different then new response then and only then validate response.
                    if (state.UserDataListState == null || (state.UserDataListState != null && UserDataList !== state.UserDataListState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: UserDataList, isList: true })) {
                            let res = parseArray(UserDataList.Users);

                            let res1 = []
                            for (var userItem in res) {
                                let item = res[userItem]

                                // item.Email is not empty/undefined
                                if (!isEmpty(item.Email)) {
                                    item.value = item.Email
                                    res1.push(item)
                                }
                            }

                            let userNames = [
                                // { value: R.strings.Please_Select },
                                ...res1
                            ];

                            return { ...state, UserDataListState: UserDataList, Recipient: userNames, BCC: userNames, CC: userNames };
                        } else {
                            return { ...state, UserDataListState: null, Recipient: [{ value: R.strings.Please_Select }], BCC: [{ value: R.strings.Please_Select }], CC: [{ value: R.strings.Please_Select }], };
                        }
                    }
                } catch (e) {
                    return { ...state, UserDataListState: null, Recipient: [{ value: R.strings.Please_Select }], BCC: [{ value: R.strings.Please_Select }], CC: [{ value: R.strings.Please_Select }], };
                }
            }
        }
        return null
    }

    componentDidUpdate(prevProps, _prevState) {
        //Get All Updated field of Particular actions
        const { SendEmailData } = this.props.SendEmailResult

        // check previous props and existing props
        if (SendEmailData !== prevProps.SendEmailResult.SendEmailData) {
            // SendEmailData is not null
            if (SendEmailData) {
                try {
                    if (this.state.SendEmailDataState == null || (this.state.SendEmailDataState != null && SendEmailData !== this.state.SendEmailDataState)) {

                        // Handle Response
                        if (validateResponseNew({ response: SendEmailData })) {

                            this.setState({ SendEmailDataState: SendEmailData })

                            showAlert(R.strings.Success + '!', R.strings.messageSentSuccessfully, 0, () => {
                                // Clear send email data 
                                this.props.clearSendEmailData()
                                this.props.navigation.goBack()
                            })
                        } else {
                            // Clear send email data 
                            this.props.clearSendEmailData()
                            this.setState({ SendEmailDataState: null })
                        }
                    }
                } catch (error) {
                    // Clear send email data 
                    this.props.clearSendEmailData()
                    this.setState({ SendEmailDataState: null })
                }
            }
        }
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        let { UserDataLoading, SendEmailLoading } = this.props.SendEmailResult

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    title={R.strings.sendEmail}
                    onBackPress={this.onBackPress}
                    nav={this.props.navigation}
                />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                {/* Progressbar */}
                <ProgressDialog isShow={UserDataLoading || SendEmailLoading} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={this.styles().mainView}>

                            {/* Multiselection button for recipients */}
                            <MultipleSelectionButton
                                disabled={this.state.disabled}
                                header={R.strings.recipient}
                                isRequired={true}
                                navigate={this.props.navigation.navigate}
                                data={this.state.Recipient}
                                selectedItems={(selectedItems) => this.onRecipientAddressChange(selectedItems)}
                                viewMore={true}
                                numColumns={3}
                            />

                            {/* Multiselection button for BCC */}
                            <MultipleSelectionButton
                                disabled={this.state.disabled}
                                header={R.strings.bcc}
                                navigate={this.props.navigation.navigate}
                                data={this.state.BCC}
                                selectedItems={(selectedItems) => this.onBccAddressChange(selectedItems)}
                                viewMore={true}
                                numColumns={3}
                            />

                            {/* Multiselection button for CC */}
                            <MultipleSelectionButton
                                disabled={this.state.disabled}
                                header={R.strings.cc}
                                navigate={this.props.navigation.navigate}
                                data={this.state.CC}
                                selectedItems={(selectedItems) => this.onCcAddressChange(selectedItems)}
                                viewMore={true}
                                numColumns={3}
                            />

                            {/* To Set Subject Value in EditText */}
                            <EditText
                                isRequired={true}
                                reference={input => { this.inputs['etSubject'] = input; }}
                                header={R.strings.subject}
                                placeholder={R.strings.subject}
                                multiline={true}
                                numberOfLines={2}
                                maxLength={100}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={true}
                                textAlignVertical={'top'}
                                onSubmitEditing={() => { this.focusNextField('etMessage') }}
                                onChangeText={(Subject) => this.setState({ Subject })}
                                value={this.state.Subject}
                            />

                            {/* To Set Message Value in EditText */}
                            <EditText
                                isRequired={true}
                                reference={input => { this.inputs['etMessage'] = input; }}
                                header={R.strings.Message}
                                placeholder={R.strings.Message}
                                multiline={true}
                                numberOfLines={4}
                                maxLength={300}
                                keyboardType='default'
                                returnKeyType={"done"}
                                textAlignVertical={'top'}
                                blurOnSubmit={true}
                                onChangeText={(Message) => this.setState({ Message })}
                                value={this.state.Message}
                            />

                        </View>
                    </ScrollView>

                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Submit Button */}
                        <Button title={R.strings.submit} onPress={this.onEmailSend}></Button>
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
                paddingBottom: R.dimens.padding_top_bottom_margin,
                paddingTop: R.dimens.padding_top_bottom_margin,
            }
        }
    }
}

const mapStateToProps = (state) => {
    return {
        // get transfer fee data from reducer
        SendEmailResult: state.SendEmailReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    // Perform User List Data Action
    getChatUserList: () => dispatch(getChatUserList()),
    // Perform Sending Email Data Action
    sendEmailData: (payload) => dispatch(sendEmailData(payload)),
    // Perform Clear Send Email Data
    clearSendEmailData: () => dispatch(clearSendEmailData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SendEmailScreen)