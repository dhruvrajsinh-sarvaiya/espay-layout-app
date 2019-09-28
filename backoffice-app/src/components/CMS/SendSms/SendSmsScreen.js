// SendSmsScreen.js
import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
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
import { sendSmsData, clearSendSmsData } from '../../../actions/CMS/SendSmsAction';
import CommonToast from '../../../native_theme/components/CommonToast';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewMR from '../../../native_theme/components/TextViewMR';

export class SendSmsScreen extends Component {

    constructor(props) {
        super(props)

        //Define all initial state
        this.state = {
            Recipient: [],
            selectedRecipient: [],
            allUserData: [],
            UserDataListState: null,
            all: false,
            manually: true,
            SendSmsDataState: null,
            Message: '',
            isFirstTime: true,
        }

        //Create reference
        this.toast = React.createRef()
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme()

        // check internet connection
        if (await isInternet()) {
            // Call user Data Api
            this.props.getChatUserList()
        }
    }

    shouldComponentUpdate(nextProps, _nextState) {

        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    // Check validation when user select user mobile no from multiselection dropdown
    onUserMobileSelect = (selectedRecipient) => {
        this.setState({ selectedRecipient: selectedRecipient })
    }

    // Call api after check validation
    onSubmit = async () => {

        //Check valiations
        if (this.state.selectedRecipient.length < 1 && this.state.manually) {
            this.toast.Show(R.strings.selectUser)
            return
        }
        else if (isEmpty(this.state.Message)) {
            this.toast.Show(R.strings.enter_message)
            return
        } else if (this.state.Message.length < 5) {
            this.toast.Show(R.strings.msglengthMessage)
            return
        }
        else {
            let recepient = []

            if (this.state.all) {
                for (var allUserItem in this.state.allUserData) {
                    let item = this.state.allUserData[allUserItem]
                    recepient.push(item.value)
                }
            }
            else {
                for (var recepientKey in this.state.selectedRecipient) {
                    let item = this.state.selectedRecipient[recepientKey]
                    recepient.push(item.value)
                }
            }

            // check internet connection
            if (await isInternet()) {

                let request = {
                    MobileNo: recepient,
                    Message: this.state.Message
                }

                // Call Send Sms Api
                this.props.sendSmsData(request)
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
        if (SendSmsScreen.oldProps !== props) {
            SendSmsScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { UserDataList, } = props.SendSmsResult;

            // UserDataList is not null
            if (UserDataList) {
                try {
                    //if local UserDataList state is null or its not null and also different then new response then and only then validate response.
                    if (state.UserDataListState == null || (state.UserDataListState != null && UserDataList !== state.UserDataListState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: UserDataList, isList: true })) {
                            let res = parseArray(UserDataList.Users);

                            let res1 = []
                            for (var userDataKey in res) {
                                let item = res[userDataKey]

                                // item.Mobile is not empty/undefined or length must be 10
                                if (!isEmpty(item.Mobile) && item.Mobile != null && item.Mobile.length == 10) {
                                    item.value = item.Mobile
                                    res1.push(item)
                                }
                            }

                            return { ...state, UserDataListState: UserDataList, Recipient: res1, allUserData: res1 };
                        } else {
                            return { ...state, UserDataListState: null, Recipient: [{ value: R.strings.selectUser }] };
                        }
                    }
                } catch (e) {
                    return { ...state, UserDataListState: null, Recipient: [{ value: R.strings.selectUser }] };
                }
            }
        }
        return null
    }

    componentDidUpdate(prevProps, _prevState) {
        //Get All Updated field of Particular actions
        const { SendSmsData } = this.props.SendSmsResult

        // check previous props and existing props
        if (SendSmsData !== prevProps.SendSmsResult.SendSmsData) {
            // SendSmsData is not null
            if (SendSmsData) {
                try {
                    if (this.state.SendSmsDataState == null || (this.state.SendSmsDataState != null && SendSmsData !== this.state.SendSmsDataState)) {

                        // Handle Response
                        if (validateResponseNew({ response: SendSmsData })) {

                            this.setState({ SendSmsDataState: SendSmsData })

                            showAlert(R.strings.Success + '!', R.strings.messageSentSuccessfully, 0, () => {
                                // Clear send Sms data 
                                this.props.clearSendSmsData()
                                this.props.navigation.goBack()
                            })
                        } else {
                            // Clear send Sms data 
                            this.props.clearSendSmsData()
                            this.setState({ SendSmsDataState: null })
                        }
                    }
                } catch (error) {
                    // Clear send Sms data 
                    this.props.clearSendSmsData()
                    this.setState({ SendSmsDataState: null })
                }
            }
        }
    }

    componentWillUnmount = () => {
        // Clear send Sms data 
        this.props.clearSendSmsData()
    };

    render() {

        // Loading status for Progress bar which is fetching from reducer
        let { UserDataLoading, SendSmsLoading } = this.props.SendSmsResult

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    title={R.strings.sendMessage}
                    nav={this.props.navigation}
                />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                {/* Progressbar */}
                <ProgressDialog isShow={UserDataLoading || SendSmsLoading} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={this.styles().mainView}>

                            <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{R.strings.selectUser}</TextViewMR>

                            {/* Radion button for all ,manually */}
                            <View style={{ flex: 1, flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                                <ImageTextButton
                                    name={R.strings.all}
                                    icon={this.state.all ? R.images.IC_RADIO_CHECK : R.images.IC_RADIO_UNCHECK}
                                    onPress={() => this.setState({ all: true, manually: false })}
                                    style={{ marginLeft: 0, paddingLeft: 0, marginTop: R.dimens.CardViewElivation, marginBottom: 0, marginRight: R.dimens.widget_left_right_margin, flexDirection: 'row-reverse', alignSelf: 'flex-start', }}
                                    textStyle={{ color: R.colors.textPrimary, marginLeft: R.dimens.CardViewElivation }}
                                    iconStyle={{ tintColor: this.state.all ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, }}
                                />
                                <ImageTextButton
                                    name={R.strings.manually}
                                    icon={this.state.manually ? R.images.IC_RADIO_CHECK : R.images.IC_RADIO_UNCHECK}
                                    onPress={() => this.setState({ manually: true, all: false })}
                                    style={{ marginBottom: R.dimens.widget_left_right_margin, marginTop: R.dimens.CardViewElivation, marginRight: R.dimens.widget_left_right_margin, flexDirection: 'row-reverse', alignSelf: 'flex-start', }}
                                    textStyle={{ color: R.colors.textPrimary, marginLeft: R.dimens.CardViewElivation }}
                                    iconStyle={{ tintColor: this.state.manually ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                                />
                            </View>

                            {/* Multiselection button for recipients */}
                            {this.state.manually && <MultipleSelectionButton
                                isRequired={true}
                                navigate={this.props.navigation.navigate}
                                data={this.state.Recipient}
                                selectedItems={(selectedItems) => this.onUserMobileSelect(selectedItems)}
                                viewMore={true}
                                numColumns={3}
                            />}

                            {/* To Set Message Value in EditText */}
                            <EditText
                                style={{ marginTop: 0 }}
                                isRequired={true}
                                header={R.strings.Message}
                                placeholder={R.strings.Message}
                                multiline={true}
                                numberOfLines={4}
                                maxLength={300}
                                keyboardType='default'
                                returnKeyType={"done"}
                                blurOnSubmit={true}
                                textAlignVertical={'top'}
                                onChangeText={(Message) => this.setState({ Message })}
                                value={this.state.Message}
                            />

                        </View>
                    </ScrollView>

                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Submit Button */}
                        <Button title={R.strings.submit} onPress={this.onSubmit}></Button>
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
            }
        }
    }
}

const mapStateToProps = (state) => {
    return {
        // get transfer fee data from reducer
        SendSmsResult: state.SendSmsReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    // Perform User List Data Action
    getChatUserList: () => dispatch(getChatUserList()),
    // Perform Sending Sms Data Action
    sendSmsData: (payload) => dispatch(sendSmsData(payload)),
    // Perform Clear Send Sms Data
    clearSendSmsData: () => dispatch(clearSendSmsData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SendSmsScreen)