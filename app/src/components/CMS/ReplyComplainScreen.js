import React, { Component, PureComponent } from 'react';
import { TextInput, View, FlatList, Image, RefreshControl, Text, } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { changeTheme, } from '../../controllers/CommonUtils';
import { connect } from 'react-redux';
import { isInternet, isEmpty, validateResponseNew } from '../../validations/CommonValidation';
import { isCurrentScreen } from '../Navigation';
import ListLoader from '../../native_theme/components/ListLoader';
import { replaySend, clearSendData, getComplainById } from '../../actions/account/Complain';
import ImageButton from '../../native_theme/components/ImageTextButton';
import CommonToast from '../../native_theme/components/CommonToast';
import { getData } from '../../App';
import { ServiceUtilConstant, Fonts } from '../../controllers/Constants';
import { contentContainerStyle, ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import R from '../../native_theme/R';
import LinearGradient from 'react-native-linear-gradient';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';
import { getCardStyle } from '../../native_theme/components/CardView';
import KeyboardAvoidingView from '../../native_theme/components/KeyboardAvoidingView';

class ReplyComplainScreen extends Component {
    constructor(props) {
        super(props)

        //get parameter from previous screen
        let { params } = props.navigation.state

        //Define All State initial state
        this.state = {
            complaintId: params.cid,
            subject: params.subject,
            replyMsg: '',
            ComplaintListResponse: [],

            // for static height of textinput
            height: R.dimens.replyMessageEditTextHeight,
            refreshing: false,
            isFirstTime: true,
            isChatUpdate: false,
        }
        this.flatList = React.createRef();
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            if (this.state.complaintId != '') {

                // Call Complaint Chat List Api using Complaint id
                this.props.getComplainById({ ComplainId: this.state.complaintId })
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        // component update if those values are changed otherwise not
        if (this.props.complaindata.ComplaintByIdData !== nextProps.complaindata.ComplaintByIdData ||
            this.props.complaindata.ReplySendData !== nextProps.complaindata.ReplySendData ||
            this.props.complaindata.ComplaintByIdLoading !== nextProps.complaindata.ComplaintByIdLoading ||
            this.props.complaindata.ReplySendLoading !== nextProps.complaindata.ReplySendLoading ||
            this.state.ComplaintListResponse !== nextState.ComplaintListResponse ||
            this.state.replyMsg !== nextState.replyMsg
        ) {
            return isCurrentScreen(nextProps);
        } else {
            return false;
        }
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //  call api for related complain id 
            this.props.getComplainById({ ComplainId: this.state.complaintId })
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    //to clear data, reply message
    clearSendData = async () => {
        this.setState({ replyMsg: '', })

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Clear Chat Data
            this.props.clearSendData()

            // Call Api for Complain By Id
            this.props.getComplainById({ ComplainId: this.state.complaintId })
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
        if (ReplyComplainScreen.oldProps !== props) {
            ReplyComplainScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated field of Particular actions
            const { ComplaintByIdData } = props.complaindata

            //check data is available or not
            if (ComplaintByIdData) {

                //if local ComplaintByIdData state is null or its not null and also different then new response then and only then validate response.
                if (state.ComplaintByIdData == null || (state.ComplaintByIdData != null && ComplaintByIdData !== state.ComplaintByIdData)) {
                    try {
                        if (validateResponseNew({ response: ComplaintByIdData })) {
                            let current_username = getData(ServiceUtilConstant.LOGINUSERNAME)
                            let complaintData = ComplaintByIdData.ComplainViewmodel.CompainTrailViewModel
                            {
                                complaintData.map((item, index) => {
                                    complaintData[index].isExistingUser = current_username === item.Username
                                })
                            }
                            return {
                                ...state,
                                ComplaintByIdData,
                                ComplaintListResponse: complaintData,
                                refreshing: false,
                                isChatUpdate: true,
                            }
                        } else {
                            return {
                                ...state,
                                ComplaintByIdData: null,
                                ComplaintListResponse: [],
                                isChatUpdate: false,
                            }
                        }
                    } catch (error) {
                        return {
                            ...state,
                            ComplaintByIdData: null,
                            ComplaintListResponse: [],
                            isChatUpdate: false,
                        }
                    }
                }
            }
        }
        return null;
    }

    componentDidUpdate = (prevProps, prevState) => {

        //Get All Updated field of Particular actions
        const { ReplySendData } = this.props.complaindata;

        if (ReplySendData !== prevProps.complaindata.ReplySendData) {

            //check data is available or not
            if (ReplySendData) {
                try {
                    // check isChatUpdate bit is true for clear reducer
                    if (this.state.isChatUpdate)
                        this.clearSendData()
                } catch (error) { }
            }
        }
    }

    // to send message on reply
    sendreply = async () => {

        //check user has input proper reply message.
        if (isEmpty(this.state.replyMsg)) {
            this.refs.Toast.Show(R.strings.msgblankvalidation);
        }
        else {
            //Check NetWork is Available or not
            if (await isInternet()) {

                // call api for send msg
                this.props.replaySend({ ComplainId: this.state.complaintId, Description: this.state.replyMsg, Remark: '', Complainstatus: 'Open' });
            }
        }
    }

    render() {

        //loading bit for handling progress dialog
        let { ComplaintByIdLoading, ReplySendLoading } = this.props.complaindata

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To show EditText even if keyboard is visible */}
                <KeyboardAvoidingView>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar title={R.strings.Reply_Complain} isBack={true} nav={this.props.navigation} />

                    {/* for toast */}
                    <CommonToast ref="Toast" />

                    {/* for progress dialog */}
                    <ProgressDialog isShow={ReplySendLoading} />

                    <View style={{ flex: 1, marginBottom: R.dimens.widgetMargin }}>

                        <View style={{ flexDirection: 'row', marginLeft: R.dimens.widget_left_right_margin, }}>

                            {/* for header content as id, subject and complain id */}
                            <Text style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>#{this.state.complaintId} : </Text>
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, }}>{this.state.subject}</TextViewHML>
                        </View>
                        {
                            !ComplaintByIdLoading ?

                                /* for flatlist data views */
                                <FlatList
                                    ref={ref => this.flatList = ref}
                                    onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}
                                    onLayout={() => this.flatList.scrollToEnd({ animated: true })}
                                    style={{ marginLeft: R.dimens.widgetMargin, marginRight: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin }}
                                    showsVerticalScrollIndicator={false}
                                    data={this.state.ComplaintListResponse}
                                    renderItem={({ item, index }) =>
                                        <FlatListItem
                                            item={item}
                                            index={index}
                                        />
                                    }
                                    keyExtractor={item => item.TrailID.toString()}
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            progressBackgroundColor={R.colors.background}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                        />}
                                    contentContainerStyle={contentContainerStyle(this.state.ComplaintListResponse)}
                                    ListEmptyComponent={<ListEmptyComponent />}
                                />
                                :
                                <ListLoader />
                        }
                        {/* for footer set message Edit Text and Send Icon */}
                        <View style={{ margin: R.dimens.margin, alignItems: 'center', justifyContent: 'center' }}>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <TextInput
                                    numberOfLines={1}
                                    value={this.state.replyMsg}
                                    placeholder={R.strings.enter_message}
                                    placeholderTextColor={R.colors.textPrimary}
                                    underlineColorAndroid='transparent'
                                    multiline={false}
                                    keyboardType='default'
                                    returnKeyType={"done"}
                                    onChangeText={(Message) => this.setState({ replyMsg: Message })}
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
                                        icon={R.images.IC_SEND_MSG}
                                        style={{ alignItems: 'center', justifyContent: 'center' }}
                                        iconStyle={{ width: R.dimens.iconheight, height: R.dimens.iconheight, tintColor: R.colors.white }}
                                        onPress={this.sendreply} />
                                </LinearGradient>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeView>
        );
    }
}

class FlatListItem extends PureComponent {
    render() {

        //get response data from props to perticullar item
        let item = this.props.item
        let flexDirection = item.isExistingUser ? 'row-reverse' : 'row';
        let cardBackground = item.isExistingUser ? R.colors.accent : R.colors.cardBackground;
        let textColor = item.isExistingUser ? R.colors.chatCardTextColor : R.colors.textPrimary;
        let marginLeft = item.isExistingUser ? 0 : R.dimens.margin;
        let marginRight = item.isExistingUser ? R.dimens.margin : 0;
        let borderBottomEndRadius = item.isExistingUser ? 0 : R.dimens.margin;
        let borderBottomLeftRadius = item.isExistingUser ? R.dimens.margin : 0;

        return (
            /* View for displaying message */
            <View style={{ flexDirection: flexDirection, margin: R.dimens.margin, justifyContent: 'center', alignItems: 'center' }}>

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
                        padding: R.dimens.widgetMargin,
                        borderRadius: R.dimens.margin,
                        borderBottomEndRadius: borderBottomEndRadius,
                        borderBottomLeftRadius: borderBottomLeftRadius,
                        ...getCardStyle(R.dimens.CardViewElivation),
                    }}>
                    <Text style={{ fontSize: R.dimens.smallText, color: textColor, fontFamily: Fonts.MontserratSemiBold }}>{item.Username ? item.Username : ' '}</Text>
                    <TextViewHML style={{ fontSize: R.dimens.smallText, color: textColor }}>{item.Description ? item.Description : ' '}</TextViewHML>
                </View>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        complaindata: state.complainReducer,
        //For Update isPortrait true or false
        preference: state.preference.dimensions.isPortrait,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        replaySend: (payload) => dispatch(replaySend(payload)),
        clearSendData: () => dispatch(clearSendData()),
        getComplainById: (payload) => dispatch(getComplainById(payload)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ReplyComplainScreen)