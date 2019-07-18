import React, { Component } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { connect } from 'react-redux'
import { isCurrentScreen } from '../Navigation';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { changeTheme, getIPAddress } from '../../controllers/CommonUtils';
import { isInternet, isEmpty, validateResponseNew, validateValue } from '../../validations/CommonValidation';
import { getProfileByID, clearReducerData } from '../../actions/account/EditProfileActions';
import { ServiceUtilConstant } from '../../controllers/Constants';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { getData, setData } from '../../App';
import R from '../../native_theme/R';
import LinearGradient from 'react-native-linear-gradient';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';

class ViewProfile extends Component {
    constructor(props) {

        //getting user selected avatar from preference
        let avatar = getData(ServiceUtilConstant.KEY_USER_AVATAR);
        let userAvatar = '';
        try {
            if (JSON.parse(avatar)) {
                userAvatar = JSON.parse(avatar);
            } else {
                userAvatar = R.images.AVATAR_01;
            }
        } catch (error) {
            userAvatar = R.images.AVATAR_01;
        }

        super(props);
        //Define All initial State
        this.state = {
            viewProfile: null,
            firstName: '',
            lastName: '',
            userName: '',
            email: '',
            isEmailConfirmed: null,
            phoneNumber: '',
            redisDBKey: '',
            KYCStatus: false,
            userAvatar,
            isFirstTime: true,
            IpAddress: '',
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        let oldName = this.props.preference[ServiceUtilConstant.FIRSTNAME] + ' ' + this.props.preference[ServiceUtilConstant.LASTNAME];
        let newName = nextProps.preference[ServiceUtilConstant.FIRSTNAME] + ' ' + nextProps.preference[ServiceUtilConstant.LASTNAME];
        if (oldName !== newName) {
            return true;
        } else {
            /* stop twice api call  */
            return isCurrentScreen(nextProps);
        }
    };

    async componentDidMount() {
        changeTheme();

        // Check internet connection is available or not
        if (await isInternet()) {
            //Call GetProfileById api
            this.props.getProfileByID()
        }

        //getting user selected avatar from preference
        let avatar = getData(ServiceUtilConstant.KEY_USER_AVATAR);
        try {
            if (JSON.parse(avatar)) {
                this.setState({ userAvatar: JSON.parse(avatar) });
            } else {
                this.setState({ userAvatar: R.images.AVATAR_01 })
            }
        } catch (error) {
            this.setState({ userAvatar: R.images.AVATAR_01 })
        }
        let Ip = await getIPAddress();
        this.setState({ IpAddress: Ip, })
    };

    static getDerivedStateFromProps(props, state) {
        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        try {
            //if props user name and state's full name is different than store new name
            let propName = props.preference[ServiceUtilConstant.FIRSTNAME] + ' ' + props.preference[ServiceUtilConstant.LASTNAME];
            let stateName = state.firstName + ' ' + state.lastName;
            if (propName !== stateName) {
                return {
                    ...state,
                    firstName: props.preference[ServiceUtilConstant.FIRSTNAME],
                    lastName: props.preference[ServiceUtilConstant.LASTNAME]
                }
            }
        } catch (error) {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated field of Particular actions
            const { data, } = props.updateData
            // To check data is null or not
            if (data) {

                //if local buySellTrade state is null or its not null and also different then new response then and only then validate response.
                if (state.viewProfile == null || (state.viewProfile != null && data !== state.viewProfile)) {
                    try {
                        //currently use status code as success temprory
                        if (validateResponseNew({ response: data, isList: false })) {

                            //To update FirstName and LastName in preference
                            setData({
                                [ServiceUtilConstant.LASTNAME]: data.UserData.LastName,
                                [ServiceUtilConstant.FIRSTNAME]: data.UserData.FirstName,
                            })
                            return {
                                ...state,
                                viewProfile: data,
                                firstName: data.UserData.FirstName,
                                email: data.UserData.Email,
                                lastName: data.UserData.LastName,
                                userName: data.UserData.Username,
                                isEmailConfirmed: data.UserData.IsEmailConfirmed,
                                phoneNumber: data.UserData.MobileNo,
                            }

                        } else {
                            return {
                                ...state,
                                viewProfile
                            }
                        }
                    } catch (error) {
                        return {
                            ...state,
                        }
                    }
                }
            }
        }
        return null;
    }

    //Refresh The Image Based On backPress From Update Profile Screen
    refresh = () => {
        this.setState({ userAvatar: getData(ServiceUtilConstant.KEY_USER_AVATAR) ? getData(ServiceUtilConstant.KEY_USER_AVATAR) : R.images.AVATAR_01 })
    }

    render() {
        const { loading } = this.props.updateData

        let firstName = isEmpty(this.state.firstName) ? '' : this.state.firstName;
        let lastName = isEmpty(this.state.lastName) ? '' : this.state.lastName;
        let fullName = (firstName === '' && lastName === '') ? '-' : firstName + ' ' + lastName;

        return (
            <SafeView style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.ViewProfile}
                    isBack={true}
                    nav={this.props.navigation}
                    rightIcon={R.images.IC_EDIT}
                    onRightMenuPress={() => this.props.navigation.navigate('UpdateProfile', {
                        firstName: this.state.firstName,
                        lastName: this.state.lastName,
                        userName: this.state.userName,
                        email: this.state.email,
                        phoneNumber: this.state.phoneNumber,
                        isAvail: true,
                        refresh: this.refresh,
                    })}
                />

                {/* Progress bar */}
                <ProgressDialog isShow={loading} />

                <View style={{ flex: 10, }}>
                    <ScrollView showsVerticalScrollIndicator={false}>

                        <LinearGradient style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                        }}
                            locations={[0, 1]}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            colors={[R.colors.linearStart, R.colors.linearEnd]}>

                            <View style={{ flexDirection: 'row', padding: R.dimens.WidgetPadding }}>
                                <View style={{ marginLeft: R.dimens.widget_left_right_margin, borderRadius: R.dimens.QRCodeIconWidthHeight / 2, borderWidth: R.dimens.ViewProfileImageBorder, borderColor: R.colors.backgroundTransparent, }}>
                                    {/* Avtar Image For Profile */}
                                    <Image
                                        style={this.styles().image_style}
                                        source={this.state.userAvatar} />
                                </View>
                                <View style={{
                                    flex: 1,
                                    marginLeft: R.dimens.margin_left_right,
                                    marginRight: R.dimens.widget_left_right_margin,
                                    justifyContent: 'center'
                                }}>
                                    {/* Full Name */}
                                    {
                                        fullName !== '-' &&
                                        <TextViewMR style={{ color: R.colors.white, fontSize: R.dimens.mediumText }}>{fullName}</TextViewMR>
                                    }
                                    {/* User Name */}
                                    <TextViewHML style={{ color: R.colors.white, fontSize: fullName !== '-' ? R.dimens.smallestText : R.dimens.mediumText }}>{validateValue(this.state.userName)}</TextViewHML>

                                </View>
                            </View>
                        </LinearGradient>

                        <View style={{ paddingLeft: R.dimens.margin_left_right, paddingRight: R.dimens.margin_left_right, marginBottom: R.dimens.widget_top_bottom_margin }}>
                            <View style={{ flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin, }}>
                                <View style={{ flex: 1 }}>
                                    {/* First Name */}
                                    <TextViewMR style={this.styles().detailHeader}>{R.strings.firstName}</TextViewMR>
                                    <TextViewHML style={this.styles().detailValue}>{validateValue(this.state.firstName)}</TextViewHML>
                                </View>
                                <View style={{ flex: 1 }}>
                                    {/* Last Name */}
                                    <TextViewMR style={this.styles().detailHeader}>{R.strings.lastName}</TextViewMR>
                                    <TextViewHML style={this.styles().detailValue}>{validateValue(this.state.lastName)}</TextViewHML>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin, alignItems: 'center' }}>
                                <View>
                                    {/* Mobile Number */}
                                    <TextViewMR style={this.styles().detailHeader}>{R.strings.MobileNo}</TextViewMR>
                                    <TextViewHML style={this.styles().detailValue}>{isEmpty(this.state.phoneNumber) ? '-' : this.state.phoneNumber}</TextViewHML>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin, alignItems: 'center' }}>
                                <View>
                                    {/* Email Id */}
                                    <TextViewMR style={this.styles().detailHeader}>{R.strings.EmailId}</TextViewMR>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextViewHML style={this.styles().detailValue}>{this.state.email}</TextViewHML>
                                        {/* if Email Id is confirmed Than show Verifed else Verify */}
                                        {this.state.isEmailConfirmed ?
                                            <TextViewHML style={{ color: R.colors.buyerGreen, fontSize: R.dimens.smallestText, marginLeft: R.dimens.widget_left_right_margin }}>{R.strings.Verified.toUpperCase()}</TextViewHML>
                                            :
                                            <TextViewHML style={{ color: R.colors.accent, fontSize: R.dimens.smallestText, marginLeft: R.dimens.widget_left_right_margin }}>{R.strings.Verfiy.toUpperCase()}</TextViewHML>
                                        }
                                    </View>
                                </View>
                            </View>
                            <View style={{ marginTop: R.dimens.widget_top_bottom_margin, }}>
                                {/* Ip Address */}
                                <TextViewMR style={this.styles().detailHeader}>{R.strings.IPAddress}</TextViewMR>
                                <TextViewHML style={this.styles().detailValue}>{this.state.IpAddress}</TextViewHML>
                            </View>
                            <View style={{ marginTop: R.dimens.widget_top_bottom_margin, }}>
                                {/* Kyc Level */}
                                <TextViewMR style={this.styles().detailHeader}>{R.strings.KYCLevel}</TextViewMR>
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={this.styles().detailValue}>Lv 1</TextViewHML>
                                    {/* if kyc status is true Than show Verifed else Verify */}
                                    {this.state.KYCStatus ?
                                        <TextViewHML style={{ color: R.colors.buyerGreen, fontSize: R.dimens.smallestText, marginLeft: R.dimens.widget_left_right_margin }}>{R.strings.Verified.toUpperCase()}</TextViewHML>
                                        :
                                        <TextViewHML style={{ color: R.colors.accent, fontSize: R.dimens.smallestText, marginLeft: R.dimens.widget_left_right_margin }}>{R.strings.Verfiy.toUpperCase()}</TextViewHML>
                                    }
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeView>
        );
    }

    // styles for this class
    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background,
            },
            detailHeader: {
                color: R.colors.textPrimary,
                fontSize: R.dimens.smallText,
            },
            detailValue: {
                color: R.colors.textSecondary,
                fontSize: R.dimens.smallestText,
            },
            image_style: {
                height: R.dimens.QRCodeIconWidthHeightD,
                width: R.dimens.QRCodeIconWidthHeightD,
                alignItems: 'center',
                justifyContent: 'center',
                padding: R.dimens.WidgetPadding,
                borderRadius: R.dimens.QRCodeIconWidthHeightD / 2,
            },
        }
    }
}

function mapStatToProps(state) {
    return {
        //Updated Data For View Profile Action
        preference: state.preference,
        updateData: state.EditProfileReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform get Profilebyid  Action
        getProfileByID: () => dispatch(getProfileByID()),
        //Perform Clear Data Action
        clearReducerData: () => dispatch(clearReducerData())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(ViewProfile);