import React, { Component } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { connect } from 'react-redux'
import { isCurrentScreen } from '../../Navigation';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { changeTheme, getIPAddress } from '../../../controllers/CommonUtils';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import { isInternet, isEmpty, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { getProfileByID, clearReducerData } from '../../../actions/account/EditProfileActions';
import { ServiceUtilConstant } from '../../../controllers/Constants';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { getData, setData } from '../../../App';
import R from '../../../native_theme/R';
import LinearGradient from 'react-native-linear-gradient';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';

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

        //Add this method to change theme based on stored theme name.
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
                this.setState(
                    { userAvatar: JSON.parse(avatar) });
            } else {
                this.setState(
                    { userAvatar: R.images.AVATAR_01 })
            }
        }
        catch (error) {
            this.setState(
                { userAvatar: R.images.AVATAR_01 })
        }
        let Ip = await getIPAddress();
        this.setState(
            { IpAddress: Ip, })
    };

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
        if (ViewProfile.oldProps !== props) {
            ViewProfile.oldProps = props;
        }
        else {
            
            return null;
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
        }
         catch (error) {
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
                        if (validateResponseNew(
                            { response: data, isList: false })) {

                            //To update FirstName and LastName in preference
                            setData(
                                {
                                    [ServiceUtilConstant.FIRSTNAME]: data.UserData.FirstName,
                                    [ServiceUtilConstant.LASTNAME]: data.UserData.LastName
                                })
                            return {
                                ...state,
                                viewProfile: data,
                                lastName: data.UserData.LastName,
                                firstName: data.UserData.FirstName,
                                isEmailConfirmed: data.UserData.IsEmailConfirmed,
                                userName: data.UserData.Username,
                                email: data.UserData.Email,
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

    refresh = () => {
        this.setState({ userAvatar: getData(ServiceUtilConstant.KEY_USER_AVATAR) ? getData(ServiceUtilConstant.KEY_USER_AVATAR) : R.images.AVATAR_01 })
    }

    render() {
        const { loading } = this.props.updateData

        let firstName = isEmpty(this.state.firstName) ? '' : this.state.firstName;
        let lastName = isEmpty(this.state.lastName) ? '' : this.state.lastName;
        let fullName = (firstName === '' && lastName === '') ? '-' : firstName + ' ' + lastName;

        return (
            <View style={this.styles().container}>

                {/* Statusbar of ViewProfile */}
                <CommonStatusBar />

                {/* Custom Toolbar of ViewProfile */}
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
                <ProgressDialog isShow={loading} />

                <View style={{ flex: 10, }}>
                    <ScrollView showsVerticalScrollIndicator={false}>

                        <LinearGradient style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                            elevation: R.dimens.CardViewElivation
                        }}
                            locations={[0, 10]}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            colors={[R.colors.cardBalanceBlue, R.colors.accent]}>

                            <View style={{ flexDirection: 'row', padding: R.dimens.WidgetPadding }}>
                                <View style={{ marginLeft: R.dimens.widget_left_right_margin, borderRadius: R.dimens.QRCodeIconWidthHeight / 2, borderWidth: R.dimens.ViewProfileImageBorder, borderColor: R.colors.backgroundTransparent, }}>
                                    <Image
                                        style={this.styles().image_style}
                                        source={this.state.userAvatar} />
                                </View>
                                <View style={{ flex: 1, marginLeft: R.dimens.margin_left_right, marginRight: R.dimens.widget_left_right_margin, paddingTop: R.dimens.margin_top_bottom }}>
                                    <TextViewMR style={{ color: R.colors.white, fontSize: R.dimens.mediumText }}>{fullName}</TextViewMR>
                                    <TextViewHML style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.white, fontSize: R.dimens.smallestText }}>{validateValue(this.state.userName)}</TextViewHML>
                                    <View style={{ marginLeft: R.dimens.widgetMargin, flexDirection: 'row', marginTop: R.dimens.widget_left_right_margin }}>
                                        <TextViewHML style={{ color: R.colors.white, fontSize: R.dimens.smallText }}>{R.strings.Basic}</TextViewHML>
                                        <ImageButton icon={R.images.IC_UPGRADE} style={{ marginLeft: R.dimens.widget_left_right_margin, marginTop: 0, marginBottom: 0, }} iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, }} />
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>

                        <View style={{ paddingLeft: R.dimens.margin_left_right, paddingRight: R.dimens.margin_left_right, marginBottom: R.dimens.widget_top_bottom_margin }}>
                            <View style={{ flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin, }}>
                                <View style={{ flex: 1 }}>
                                    <TextViewMR style={this.styles().detailHeader}>{R.strings.firstName}</TextViewMR>
                                    <TextViewHML style={this.styles().detailValue}>{validateValue(this.state.firstName)}</TextViewHML>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TextViewMR style={this.styles().detailHeader}>{R.strings.lastName}</TextViewMR>
                                    <TextViewHML style={this.styles().detailValue}>{validateValue(this.state.lastName)}</TextViewHML>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin, alignItems: 'center' }}>
                                <View>
                                    <TextViewMR style={this.styles().detailHeader}>{R.strings.MobileNo}</TextViewMR>
                                    <TextViewHML style={this.styles().detailValue}>{isEmpty(this.state.phoneNumber) ? '-' : this.state.phoneNumber}</TextViewHML>
                                </View>
                                {/*  <View style={{ flex: 1 }}>
                                    <ImageButton icon={R.images.IC_EDIT} style={{ alignSelf: 'flex-end', }} iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }} />
                                </View> */}
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin, alignItems: 'center' }}>
                                <View>
                                    <TextViewMR style={this.styles().detailHeader}>{R.strings.Email}</TextViewMR>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextViewHML style={this.styles().detailValue}>{this.state.email}</TextViewHML>
                                        {
                                            this.state.isEmailConfirmed ?
                                                <TextViewHML style={{ color: R.colors.buyerGreen, fontSize: R.dimens.smallestText, marginLeft: R.dimens.widget_left_right_margin }}>{R.strings.Verified.toUpperCase()}</TextViewHML>
                                                :
                                                <TextViewHML style={{ color: R.colors.accent, fontSize: R.dimens.smallestText, marginLeft: R.dimens.widget_left_right_margin }}>{R.strings.Verfiy.toUpperCase()}</TextViewHML>
                                        }
                                    </View>
                                </View>
                                {/*  <View style={{ flex: 1 }}>
                                    <ImageButton icon={R.images.IC_EDIT} style={{ alignSelf: 'flex-end', }} iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }} />
                                </View> */}
                            </View>
                            <View style={{ marginTop: R.dimens.widget_top_bottom_margin, }}>
                                <TextViewMR style={this.styles().detailHeader}>{R.strings.IPAddress}</TextViewMR>
                                <TextViewHML style={this.styles().detailValue}>{this.state.IpAddress}</TextViewHML>
                            </View>
                            <View style={{ marginTop: R.dimens.widget_top_bottom_margin, }}>
                                <TextViewMR style={this.styles().detailHeader}>{R.strings.Location}</TextViewMR>
                                <TextViewHML style={this.styles().detailValue}>Bhavnagar, India</TextViewHML>
                            </View>
                            <View style={{ marginTop: R.dimens.widget_top_bottom_margin, }}>
                                <TextViewMR style={this.styles().detailHeader}>{R.strings.KYCLevel}</TextViewMR>
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={this.styles().detailValue}>Lv 1</TextViewHML>
                                    {
                                        this.state.KYCStatus ?
                                            <TextViewHML style={{ color: R.colors.buyerGreen, fontSize: R.dimens.smallestText, marginLeft: R.dimens.widget_left_right_margin }}>{R.strings.Verified.toUpperCase()}</TextViewHML>
                                            :
                                            <TextViewHML style={{ color: R.colors.accent, fontSize: R.dimens.smallestText, marginLeft: R.dimens.widget_left_right_margin }}>{R.strings.Verfiy.toUpperCase()}</TextViewHML>
                                    }
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }

    styles = () => {
        return {
            container: {
                backgroundColor: R.colors.background,
                flex: 1,
            },
            detailHeader: {
                fontSize: R.dimens.smallText,
                color: R.colors.textPrimary,
            },
            detailValue: {
                fontSize: R.dimens.smallestText,
                color: R.colors.textSecondary,
            },
            image_style: {
                borderRadius: R.dimens.QRCodeIconWidthHeight / 2,
                alignItems: 'center',
                width: R.dimens.QRCodeIconWidthHeightD,
                justifyContent: 'center',
                padding: R.dimens.WidgetPadding,
                height: R.dimens.QRCodeIconWidthHeightD,
            },
        }
    }
}

function mapStatToProps(state) {
    return {
        preference: state.preference,
        updateData: state.EditProfileReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getProfileByID: () => dispatch(getProfileByID()),
        clearReducerData: () => dispatch(clearReducerData())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(ViewProfile);