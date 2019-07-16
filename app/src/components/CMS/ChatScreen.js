import React, { Component } from 'react';
import { View, Image, FlatList, TextInput, Text, } from 'react-native';
import { connect } from 'react-redux'
import { isCurrentScreen } from '../Navigation';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isInternet, isEmpty, validateResponseNew } from '../../validations/CommonValidation';
import { getProfileByID } from '../../actions/account/ChatAction';
import { ServiceUtilConstant, Method, Fonts } from '../../controllers/Constants';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { getData, setData } from '../../App';
import { changeTheme, addListener, sendEvent, showAlert } from '../../controllers/CommonUtils';
import ImageButton from '../../native_theme/components/ImageTextButton';
import R from '../../native_theme/R';
import LinearGradient from 'react-native-linear-gradient';
import CommonToast from '../../native_theme/components/CommonToast';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';
import { getCardStyle } from '../../native_theme/components/CardView';
import KeyboardAvoidingView from '../../native_theme/components/KeyboardAvoidingView';

class ChatScreen extends Component {
    constructor(props) {
        super(props);

        //Define All State initial state
        this.state = {
            Message: '',
            Username: '',
            data: [],
            isBlocked: false,
        };
        this.flatList = React.createRef();
    }

    // send meesage
    onSend = async () => {
        if (isEmpty(this.state.Message)) {
            this.refs.Toast.Show(R.strings.msgblankvalidation);
        } else {
            try {
                //if user is blocked than show dialog otherwise send message
                if (this.state.isBlocked) {
                    showAlert(R.strings.Info + '!', R.strings.blockChat, 3)
                } else {

                    //check for internet connection
                    if (await isInternet()) {

                        //Call send Group Message Api using SignalR
                        sendEvent(Method.SendMessage, this.state.Message);
                    }
                }
                this.setState({ Message: '' })
            } catch (e) { }
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        this._isMounted = true;
        if (isEmpty(getData(ServiceUtilConstant.KEY_USER_NAME))) {

            // Check internet connection is available or not
            if (await isInternet()) {

                //Call GetProfileById api
                this.props.getProfileByID()
            }
        } else {
            sendEvent(Method.GetChatHistory);
        }
        this.setState({ isBlocked: getData(ServiceUtilConstant.KEY_IsBlockedUser) });

        //get data from preference
        if (getData(ServiceUtilConstant.KEY_IsBlockedUser)) {
            showAlert(R.strings.Info + '!', R.strings.blockChat, 3);
        }

        //add listener for receiving messages using SignalR
        this.listenerRecieveBlockUnblockUser = addListener(Method.RecieveBlockUnblockUser, (receivedMessage) => {
            try {
                let receivedMessageData = JSON.parse(receivedMessage);

                //check data is available
                if (receivedMessageData.Data) {

                    //if chat screen is open than also set state for blocked status
                    if (isCurrentScreen(this.props)) {
                        showAlert(R.strings.Info + '!', receivedMessageData.Data.IsBlocked ? R.strings.blockChat : R.strings.unBlockChat, 3);
                        this.setState({ isBlocked: receivedMessageData.Data.IsBlocked });
                    }
                }
            } catch (error) { }
        })

        //Call Receive Chat Message History using SignalR
        this.listenerRecieveChatHistory = addListener(Method.RecieveChatHistory, (RecieveChatHistory) => {

            //check for current screen
            if (isCurrentScreen(this.props)) {
                try {
                    let oldChat = this.state.data;
                    let data = JSON.parse(RecieveChatHistory);

                    //map for message data
                    data.Data.map((item, _index) => {
                        let userName = getData(ServiceUtilConstant.KEY_USER_NAME);
                        oldChat.push({ Name: item.Name, Message: item.Message, MyMessage: item.Name === userName });
                    })
                    if (this._isMounted) {
                        this.setState({ data: oldChat });
                    }
                } catch (error) { }
            }
        })

        //Call Receive Group Message Api using SignalR
        this.listenerReceiveMessage = addListener(Method.ReceiveMessage, (username, receivedMessage) => {

            //check for current screen
            if (isCurrentScreen(this.props)) {
                try {
                    let oldChat = this.state.data;
                    let userName = getData(ServiceUtilConstant.KEY_USER_NAME);
                    oldChat.push({ Name: username, Message: receivedMessage, MyMessage: username === userName });
                    if (this._isMounted) {
                        this.setState({ data: oldChat });
                    }
                } catch (error) { }
            }
        })
    };

    shouldComponentUpdate = (nextProps, _nextState) => {

        // stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount = () => {
        this._isMounted = false;

        //remove listener All listeners
        if (this.listenerRecieveBlockUnblockUser) {
            this.listenerRecieveBlockUnblockUser.remove();
        }
        if (this.listenerRecieveChatHistory) {
            this.listenerRecieveChatHistory.remove();
        }
        if (this.listenerReceiveMessage) {
            this.listenerReceiveMessage.remove();
        }
    };

    componentDidUpdate = (prevProps, prevState) => {
        //Get All Updated field of Particular actions
        const { dataFetch, data } = this.props

        if (data !== prevProps.data) {
            // To check data is null or not
            if (!dataFetch) {
                try {
                    //currently use status code as success temprory
                    if (validateResponseNew({ response: data })) {

                        //To update Username in preference
                        setData({
                            [ServiceUtilConstant.KEY_USER_NAME]: data.UserData.Username
                        });
                        sendEvent(Method.GetChatHistory);
                    }
                } catch (error) { }
            }
        }
    }

    render() {

        //loading bit for handling progress dialog
        const { loading } = this.props

        return (
            <SafeView style={this.styles().container}>

                {/* To show EditText even if keyboard is visible */}
                <KeyboardAvoidingView>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.Chat}
                        isBack={true}
                        nav={this.props.navigation}
                    />

                    {/* Common Toast */}
                    <CommonToast ref="Toast" />

                    {/* Progress bar */}
                    <ProgressDialog isShow={loading} />

                    {/* for footer set message Edit Text and Send Icon */}
                    <View style={{ flex: 1, justifyContent: 'space-between' }}>

                        <View style={{ flex: 1 }}>
                            {this.state.data.length ?
                                <FlatList
                                    ref={ref => this.flatList = ref}
                                    onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}
                                    onLayout={() => this.flatList.scrollToEnd({ animated: true })}
                                    data={this.state.data}
                                    showsVerticalScrollIndicator={false}
                                    /* To Refresh FlatList */
                                    extraData={this.state}
                                    /* render all item in list */
                                    renderItem={({ item }) => <FlatListItem
                                        Name={item.Name}
                                        Message={item.Message}
                                        isMyMeaasge={item.MyMessage}></FlatListItem>}
                                    /* assign index as key valye to Withdrawal list item */
                                    keyExtractor={(item, index) => index.toString()} />
                                : null}
                        </View>

                        <View style={{ margin: R.dimens.margin, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <TextInput
                                editable={!this.state.isBlocked}
                                numberOfLines={1}
                                value={this.state.Message}
                                placeholder={R.strings.enter_message}
                                placeholderTextColor={R.colors.textPrimary}
                                underlineColorAndroid='transparent'
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"done"}
                                onChangeText={(Message) => this.setState({ Message: Message })}
                                style={{
                                    flex: 1,
                                    borderColor: R.colors.textPrimary,
                                    borderWidth: R.dimens.pickerBorderWidth,
                                    height: R.dimens.ButtonHeight,
                                    fontSize: R.dimens.smallText,
                                    color: R.colors.textPrimary,
                                    paddingTop: R.dimens.widgetMargin,
                                    paddingBottom: R.dimens.widgetMargin,
                                    paddingLeft: R.dimens.widget_top_bottom_margin,
                                    paddingRight: R.dimens.widget_top_bottom_margin,
                                    marginRight: R.dimens.margin,
                                    borderRadius: R.dimens.margin_left_right,
                                }} />
                            {/* send button with icon */}
                            <LinearGradient style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                ...getCardStyle(R.dimens.CardViewElivation),
                                padding: R.dimens.widgetMargin,
                                width: R.dimens.paginationButtonRadious / 1.5,
                                height: R.dimens.paginationButtonRadious / 1.5,
                                borderRadius: R.dimens.paginationButtonRadious / 2,
                            }}
                                locations={[0, 1]}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                colors={[R.colors.linearStart, R.colors.linearEnd]}>
                                <ImageButton
                                    disabled={this.state.isBlocked}
                                    icon={R.images.IC_SEND_MSG}
                                    style={{ alignItems: 'center', justifyContent: 'center' }}
                                    iconStyle={{ width: R.dimens.iconheight, height: R.dimens.iconheight, tintColor: R.colors.white }}
                                    onPress={this.onSend} />
                            </LinearGradient>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeView >
        );
    }

    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background,
            },
        }
    }
}

// This Class is used for display record in list
class FlatListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {

        //component update if these values are changed
        if (this.props.Name === nextProps.Name &&
            this.props.Message === nextProps.Message &&
            this.props.isMyMeaasge === nextProps.isMyMeaasge) {
            return false
        }
        return true
    }

    render() {
        //getting required data from props
        let flexDirection = this.props.isMyMeaasge ? 'row-reverse' : 'row';
        let cardBackground = this.props.isMyMeaasge ? R.colors.accent : R.colors.cardBackground;
        let textColor = this.props.isMyMeaasge ? R.colors.chatCardTextColor : R.colors.textPrimary;
        let marginLeft = this.props.isMyMeaasge ? 0 : R.dimens.margin;
        let marginRight = this.props.isMyMeaasge ? R.dimens.margin : 0;
        let borderBottomEndRadius = this.props.isMyMeaasge ? 0 : R.dimens.margin;
        let borderBottomLeftRadius = this.props.isMyMeaasge ? R.dimens.margin : 0;

        return (
            <View style={{ flexDirection: flexDirection, margin: R.dimens.margin, justifyContent: 'center', alignItems: 'center' }}>
                {/* view for displaying message with avatar */}
                <View style={{
                    width: R.dimens.signup_screen_logo_height,
                    height: R.dimens.signup_screen_logo_height,
                    backgroundColor: R.colors.background,
                }}>
                    <Image source={R.images.AVATAR_05} style={{ width: R.dimens.signup_screen_logo_height, height: R.dimens.signup_screen_logo_height, padding: R.dimens.margin, borderRadius: R.dimens.signup_screen_logo_height / 2 }}></Image>
                </View>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        marginLeft: marginLeft,
                        marginRight: marginRight,
                        backgroundColor: cardBackground,
                        justifyContent: 'center',
                        ...getCardStyle(R.dimens.CardViewElivation),
                        padding: R.dimens.widgetMargin,
                        borderRadius: R.dimens.margin,
                        borderBottomEndRadius: borderBottomEndRadius,
                        borderBottomLeftRadius: borderBottomLeftRadius
                    }}>
                    <Text style={{ fontSize: R.dimens.smallText, color: textColor, fontFamily: Fonts.MontserratSemiBold }}>{this.props.Name ? this.props.Name : ' '}</Text>
                    <TextViewHML style={{ fontSize: R.dimens.smallText, color: textColor }}>{this.props.Message ? this.props.Message : ' '}</TextViewHML>
                </View>
            </View>
        )
    };
}

function mapStatToProps(state) {
    return {
        //For Update isPortrait true or false
        preference: state.preference.dimensions.isPortrait,
        // updated state for Chat Screen
        data: state.ChatReducer.data,
        loading: state.ChatReducer.loading,
        dataFetch: state.ChatReducer.dataFetch,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // To perform action for Profile By Id
        getProfileByID: () => dispatch(getProfileByID()),
    }
}
export default connect(mapStatToProps, mapDispatchToProps)(ChatScreen);