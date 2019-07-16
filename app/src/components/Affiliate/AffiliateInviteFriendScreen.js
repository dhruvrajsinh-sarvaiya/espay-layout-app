import React, { Component } from 'react';
import { View } from 'react-native';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import { isEmpty, validateMobileNumber, isInternet, validateResponseNew, multipleMobileNumber } from '../../validations/CommonValidation'
import Button from '../../native_theme/components/Button'
import EditText from '../../native_theme/components/EditText'
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { CheckEmailValidation } from '../../validations/EmailValidation'
import { changeTheme, showAlert, } from '../../controllers/CommonUtils';
import { connect } from 'react-redux';
import CommonToast from '../../native_theme/components/CommonToast';
import R from '../../native_theme/R';
import TextViewHML from '../../native_theme/components/TextViewHML';
import CardView from '../../native_theme/components/CardView';
import TextViewMR from '../../native_theme/components/TextViewMR';
import { isCurrentScreen } from '../Navigation';
import {
    getAffiliateInviteLink, shareAffiliateInviteLinkByEmail,
    shareAffiliateInviteLinkBySMS, clearAffiliateInviteData
} from '../../actions/Affiliate/AffiliateInviteFriendAction';
import SafeView from '../../native_theme/components/SafeView';
import InputScrollView from 'react-native-input-scroll-view';
import Share from 'react-native-share';

class AffiliateInviteFriendScreen extends Component {

    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            isFirstTime: true,
            affiliateLink: '',
            emailId: '',
            inValidEmail: '',
            mobileNo: '',
            inValidMobile: '',
            facebookLink: '',
            twitterLink: '',
        }

        this.shareOptions = {
            title: R.strings.Referral_Link,
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            // call api for get affiliate invitelink
            this.props.getAffiliateInviteLink()
        }
    }

    // check mobile validation and call api
    onSmsSend = async () => {
        this.setState({ inValidMobile: '' })

        // for check MobileNo is empty or not
        if (isEmpty(this.state.mobileNo)) {
            this.refs.Toast.Show(R.strings.Validate_MobileNo);
            return;
        }

        if (this.state.mobileNo) {
            let mobileNos = this.state.mobileNo;//for store mobileno
            let mobileNoArray = mobileNos.split(",");//separeted values of mobileno by comma and converted in array
            let invalidValue = [];

            mobileNoArray.map((item) => {
                item = item.trim();//for remove unwanted space from item

                // if its numeric
                if (validateMobileNumber(item)) {

                    // if length is less than 10 and item is not empty than push to invalid
                    if (item.length < 10 && !isEmpty(item)) {
                        invalidValue.push(item)
                    }
                } else {
                    // if not number than push to invalid
                    invalidValue.push(item)
                }
            })

            // if invalid numbers length is 0 than call api
            if (invalidValue.length == 0) {

                let requestSMSList = {
                    MobileNumberList: mobileNoArray.filter(item => item !== '') // filters with not empty records
                }

                if (await isInternet()) {
                    //  call api for send SMS
                    this.props.shareAffiliateInviteLinkBySMS(requestSMSList)
                }
            } else {
                //get last invalid mobile record
                this.setState({ inValidMobile: invalidValue[invalidValue.length - 1] })
            }

        }
    }

    // check email validation and call api 
    onEmailSend = async () => {
        this.setState({ inValidEmail: '' })
        // for check email is empty or not
        if (isEmpty(this.state.emailId)) {
            this.refs.Toast.Show(R.strings.enterEmail);
            return;
        }

        if (this.state.emailId) {
            let emailIds = this.state.emailId;//for store emailIDs
            let emailArray = emailIds.split(",");//separeted values of emails by comma and converted in array
            let wrongEmail = [];

            emailArray.map((item) => {
                item = item.trim();//for remove unwanted space from item
                if (CheckEmailValidation(item)) {
                    wrongEmail.push(item)
                }
            })

            // if wrongEMail length is 0 than call api
            if (wrongEmail.length == 0) {
                let requestEmailList = {
                    EmailList: emailArray.filter(item => item !== '') // filters with not empty records
                }
                if (await isInternet()) {
                    //  call api for send EMail
                    this.props.shareAffiliateInviteLinkByEmail(requestEmailList)
                }
            } else {
                // get last invalid Email record 
                this.setState({ inValidEmail: wrongEmail[wrongEmail.length - 1] })
            }
        }

    }

    onFacebookPress = async () => {
        // "Facebook Share"
        Share.shareSingle(Object.assign({}, this.shareOptions, {
            social: "facebook",
            message: this.state.facebookLink,
            url: '',
        })).catch(err => logger(err));
    }

    onTwitterPress = async () => {
        // "Twitter Share"
        Share.shareSingle(Object.assign({}, this.shareOptions, {
            social: "twitter",
            message: this.state.twitterLink,
            url: '',
        })).catch(err => logger(err));
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    static getDerivedStateFromProps(props, state) {
        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Field of Particular actions
            const { inviteLink, inviteLinkFetch } = props;

            //To Check inviteLink Data Fetch or Not
            if (!inviteLinkFetch) {
                try {
                    if (validateResponseNew({ response: inviteLink, isList: true })) {
                        let affiliate = '';
                        let facebook = '';
                        let twitter = '';
                        // if get link from responce than set to state otherwise set to blank
                        if (inviteLink.Response != null) {
                            affiliate = inviteLink.Response.AffiliateLink.PromotionLink;
                            facebook = inviteLink.Response.Facebook.PromotionLink;
                            twitter = inviteLink.Response.Twitter.PromotionLink;
                        }
                        return {
                            ...state, affiliateLink: affiliate, twitterLink: twitter, facebookLink: facebook,
                        };
                    }
                    else {
                        return { ...state, affiliateLink: '', twitterLink: '', facebookLink: '', };
                    }
                } catch (e) {
                    return { ...state, affiliateLink: '', twitterLink: '', facebookLink: '', };
                }
            }
        }
        return null;
    }

    mobilenoValidate = (number) => {
        if (multipleMobileNumber(number)) {
            this.setState({ mobileNo: number })
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        //Get All Updated Field of Particular actions
        const { emailSendData, emailSendingDataFetch, smsSendData, smsSendingDataFetch } = this.props;

        // for check both data previous props and nextprops is not same than execute condition
        if (emailSendData !== prevProps.emailSendData) {
            if (!emailSendingDataFetch) {
                try {
                    if (validateResponseNew({ response: emailSendData })) {
                        // on success responce redirect to login screen 
                        showAlert(R.strings.Success + '!', emailSendData.ReturnMsg, 0, () => {
                            //clear reducer data
                            this.props.clearAffiliateInviteData()
                            //---
                            this.setState({ emailId: '' })
                        })
                    } else {
                        //clear reducer data
                        this.props.clearAffiliateInviteData()
                    }
                } catch (e) {
                    // logger('error :', e)
                }
            }
        }

        // for check both data previous props and nextprops is not same than execute condition
        if (smsSendData !== prevProps.smsSendData) {
            if (!smsSendingDataFetch) {
                try {
                    if (validateResponseNew({ response: smsSendData })) {
                        // on success responce redirect to login screen 
                        showAlert(R.strings.Success + '!', smsSendData.ReturnMsg, 0, () => {
                            //clear reducer data
                            this.props.clearAffiliateInviteData()
                            //---
                            this.setState({ mobileNo: '' })
                        })
                    } else {
                        //clear reducer data
                        this.props.clearAffiliateInviteData()
                    }
                } catch (e) {
                    // logger('error :', e)
                }
            }
        }
    }

    componentWillUnmount() {
        // call action for clear reducer data
        this.props.clearAffiliateInviteData()
    }

    render() {
        const { loading, isSendingEmail, isSendingSms } = this.props

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To Set Progress Dialog as per our theme */}
                <ProgressDialog isShow={loading || isSendingEmail || isSendingSms} />

                {/* To Set Toast as per our theme */}
                <CommonToast ref="Toast" />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    title={R.strings.inviteFriends}
                    nav={this.props.navigation}
                />

                <View style={{ flex: 1 }}>
                    <InputScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
                        {/* for Affiliate Link View */}
                        <CardView style={{
                            elevation: R.dimens.listCardElevation,
                            flex: 1,
                            borderRadius: 0,
                            flexDirection: 'column',
                            margin: R.dimens.widget_top_bottom_margin,
                        }}>
                            {/* affiliate link set which is get from response */}
                            <EditText
                                header={R.strings.affiliateLinkText}
                                style={{ marginTop: 0 }}
                                multiline={false}
                                editable={false}
                                value={this.state.affiliateLink}
                            />

                            <View style={{ marginTop: R.dimens.padding_top_bottom_margin }}>

                                <TextViewMR style={{
                                    fontSize: R.dimens.smallText,
                                    color: R.colors.textPrimary,
                                    marginLeft: R.dimens.LineHeight,
                                    alignSelf: 'flex-start',
                                }}>{R.strings.shareWith} :</TextViewMR>

                                <View style={{ flex: 1, marginTop: R.dimens.padding_top_bottom_margin, marginBottom: R.dimens.padding_top_bottom_margin, flexDirection: 'row' }}>
                                    {/* facebook Button */}
                                    <Button
                                        style={{ flex: 1, height: R.dimens.activity_margin, marginRight: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin }}
                                        textStyle={{ fontSize: R.dimens.smallText }}
                                        title={R.strings.shareOnFacebooktext}
                                        onPress={this.onFacebookPress}
                                        disabled={this.state.facebookLink ? false : true}
                                    />
                                    {/* twitter Button */}
                                    <Button
                                        style={{ flex: 1, marginLeft: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin, height: R.dimens.activity_margin, backgroundColor: R.colors.cardBalanceBlue }}
                                        textStyle={{ fontSize: R.dimens.smallText }}
                                        title={R.strings.shareOnTwittertext}
                                        onPress={this.onTwitterPress}
                                        disabled={this.state.twitterLink ? false : true}
                                    />

                                </View>

                            </View>

                        </CardView>

                        {/* for Email Send View */}
                        <CardView style={{
                            elevation: R.dimens.listCardElevation,
                            flex: 1,
                            borderRadius: 0,
                            flexDirection: 'column',
                            margin: R.dimens.widget_top_bottom_margin,
                            marginTop: 0
                        }}>
                            {/* for enter list of emails for send email invites */}
                            <EditText
                                header={R.strings.enterEmailId}
                                isRequired={true}
                                style={{ marginTop: 0 }}
                                placeholder={R.strings.emailids}
                                multiline={true}
                                keyboardType={'default'}
                                returnKeyType={"done"}
                                blurOnSubmit={true}
                                numberOfLines={5}
                                textAlignVertical='top'
                                maxLength={300}
                                value={this.state.emailId}
                                onChangeText={(emailId) => this.setState({ emailId })}
                            />

                            <TextViewHML style={{
                                fontSize: R.dimens.smallestText,
                                color: R.colors.textPrimary,
                                marginLeft: R.dimens.LineHeight,
                                alignSelf: 'flex-start',
                            }}>{R.strings.allowMultipleEmailIdsMessage}</TextViewHML>

                            {this.state.inValidEmail ? <TextViewHML style={{
                                fontSize: R.dimens.smallestText,
                                color: R.colors.failRed,
                                marginLeft: R.dimens.LineHeight,
                                alignSelf: 'flex-start',
                            }}>{R.strings.invalidEmailId} : {this.state.inValidEmail}</TextViewHML> : null}

                            <View style={{ flex: 1, flexDirection: "row", marginTop: R.dimens.widget_top_bottom_margin, justifyContent: "flex-end" }}>
                                {/* Email Send Button */}
                                <Button
                                    style={{ alignSelf: 'flex-end', height: R.dimens.activity_margin, marginBottom: R.dimens.widgetMargin }}
                                    textStyle={{ fontSize: R.dimens.smallText }}
                                    isRound={true}
                                    title={R.strings.send}
                                    onPress={this.onEmailSend}
                                />
                                {/* Email Cancel Button  to clear edittext */}
                                <Button
                                    style={{ alignSelf: 'flex-end', marginLeft: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin, height: R.dimens.activity_margin, backgroundColor: R.colors.failRed }}
                                    textStyle={{ fontSize: R.dimens.smallText }}
                                    isRound={true}
                                    title={R.strings.cancel}
                                    onPress={() => { this.setState({ emailId: '', inValidEmail: '' }) }}
                                />
                            </View>

                        </CardView>

                        {/* for Mobile Send View */}
                        <CardView style={{
                            elevation: R.dimens.listCardElevation,
                            flex: 1,
                            borderRadius: 0,
                            flexDirection: 'column',
                            margin: R.dimens.widget_top_bottom_margin,
                            marginTop: 0
                        }}>
                            {/* for enter list of mobile no.s */}
                            <EditText
                                header={R.strings.enterMobileNos}
                                isRequired={true}
                                style={{ marginTop: 0 }}
                                placeholder={R.strings.mobileNos}
                                keyboardType={'numeric'}
                                returnKeyType={"done"}
                                maxLength={300}
                                value={this.state.mobileNo}
                                onChangeText={(mobileNo) => this.mobilenoValidate(mobileNo)}
                            />

                            <TextViewHML style={{
                                fontSize: R.dimens.smallestText,
                                color: R.colors.textPrimary,
                                marginLeft: R.dimens.LineHeight,
                                alignSelf: 'flex-start',
                            }}>{R.strings.allowMultipleMobileNosMessage}</TextViewHML>

                            {this.state.inValidMobile ?
                                <TextViewHML style={{
                                    fontSize: R.dimens.smallestText,
                                    color: R.colors.failRed,
                                    marginLeft: R.dimens.LineHeight,
                                    alignSelf: 'flex-start',
                                }}>{R.strings.invalidMobileNo} : {this.state.inValidMobile}</TextViewHML> : null}

                            <View style={{ flex: 1, flexDirection: "row", marginTop: R.dimens.widget_top_bottom_margin, justifyContent: "flex-end" }}>
                                {/* for send list of mobile no.s invitation */}
                                <Button
                                    style={{ alignSelf: 'flex-end', height: R.dimens.activity_margin, marginBottom: R.dimens.widgetMargin }}
                                    textStyle={{ fontSize: R.dimens.smallText }}
                                    isRound={true}
                                    title={R.strings.send}
                                    onPress={this.onSmsSend}
                                />
                                {/* for cancel button to clear edittext */}
                                <Button
                                    style={{ alignSelf: 'flex-end', marginLeft: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin, height: R.dimens.activity_margin, backgroundColor: R.colors.failRed }}
                                    textStyle={{ fontSize: R.dimens.smallText }}
                                    isRound={true}
                                    title={R.strings.cancel}
                                    onPress={() => { this.setState({ mobileNo: '', inValidMobile: '' }) }}
                                />
                            </View>

                        </CardView>
                    </InputScrollView>
                </View>
            </SafeView>
        );
    }
}

function mapStateToProps(state) {
    return {
        //updated data for Affiliate Invite Link
        loading: state.AffiliateInvitefriendReducer.loading,
        inviteLink: state.AffiliateInvitefriendReducer.inviteLink,
        inviteLinkFetch: state.AffiliateInvitefriendReducer.inviteLinkFetch,

        // updated data for Affiliate Invite by Email
        isSendingEmail: state.AffiliateInvitefriendReducer.isSendingEmail,
        emailSendData: state.AffiliateInvitefriendReducer.emailSendData,
        emailSendingDataFetch: state.AffiliateInvitefriendReducer.emailSendingDataFetch,

        // updated data for Affiliate Invite by Email
        isSendingSms: state.AffiliateInvitefriendReducer.isSendingSms,
        smsSendData: state.AffiliateInvitefriendReducer.smsSendData,
        smsSendingDataFetch: state.AffiliateInvitefriendReducer.smsSendingDataFetch,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform AffiliateInvites Action
        getAffiliateInviteLink: () => dispatch(getAffiliateInviteLink()),
        //Perform AffiliateInvites by Email Action
        shareAffiliateInviteLinkByEmail: (requestEmailList) => dispatch(shareAffiliateInviteLinkByEmail(requestEmailList)),
        //Perform AffiliateInvites by SMS Action
        shareAffiliateInviteLinkBySMS: (requestSMSList) => dispatch(shareAffiliateInviteLinkBySMS(requestSMSList)),
        //Perform Action for clear reducer
        clearAffiliateInviteData: () => dispatch(clearAffiliateInviteData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AffiliateInviteFriendScreen)