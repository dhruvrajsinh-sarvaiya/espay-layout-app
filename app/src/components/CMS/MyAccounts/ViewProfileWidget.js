import React, { Component } from 'react';
import {
    View,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';
import { changeTheme, getIPAddress, parseArray, convertDateTime } from '../../../controllers/CommonUtils';
import { validateResponseNew, isEmpty, isInternet } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import R from '../../../native_theme/R';
import { ServiceUtilConstant } from '../../../controllers/Constants';
import { getData } from '../../../App';
import { loginHistoryList } from '../../../actions/Reports/LoginHistoryAction';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';

class ViewProfileWidget extends Component {

    // static constant for checking if class is mounted then load ip, last login time even if screen is not open
    static classMounted = true;

    constructor(props) {
        super(props)

        //To get firstname and lastname from stored data
        let firstName = getData(ServiceUtilConstant.FIRSTNAME);
        let lastName = getData(ServiceUtilConstant.LASTNAME);
        let userName = getData(ServiceUtilConstant.KEY_USER_NAME);
        let email = getData(ServiceUtilConstant.Email);
        let avatar = getData(ServiceUtilConstant.KEY_USER_AVATAR);
        let fullName = '-';
        let userAvatar = '';

        //if firstName & lastName is not empty than store name in state
        if (!isEmpty(firstName) && !isEmpty(lastName)) {
            fullName = firstName + ' ' + lastName;
        } else {
            fullName = '-';
        }

        // if email and username is not empty
        if (isEmpty(email) && isEmpty(userName)) {
            email = '-';
        } else if (isEmpty(email) && !isEmpty(userName)) {
            email = userName;
        }

        try {
            if (JSON.parse(avatar)) {
                userAvatar = JSON.parse(avatar);
            } else {
                userAvatar = R.images.AVATAR_01;
            }
        } catch (error) {
            userAvatar = R.images.AVATAR_01;
        }

        this.onPressWidget = this.onPressWidget.bind(this);

        this.state = {
            fullName,
            email,
            lastLogin: '',
            ipAddress: R.strings.ipTitle + ' : ',
            userAvatar,
            PageIndex: 0,
            PAGE_SIZE: 1,
        };
    };

    async componentDidMount() {

        // update static classMounted to true
        ViewProfileWidget.classMounted = true;

        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            let ipAddress = await getIPAddress();

            this.setState({ ipAddress: R.strings.ipTitle + ' : ' + ipAddress });

            //Call Get Login History from API
            this.props.loginHistoryList({
                PageIndex: this.state.PageIndex,
                PAGE_SIZE: this.state.PAGE_SIZE,
                isWidget: true,
            });
        }
    };

    componentWillUnmount() {
        // update static classMounted to false
        ViewProfileWidget.classMounted = false;
    }
    

    static getDerivedStateFromProps(props, state) {

        try {
            let firstName = props.preference[ServiceUtilConstant.FIRSTNAME];
            let lastName = props.preference[ServiceUtilConstant.LASTNAME];
            let userName = props.preference[ServiceUtilConstant.KEY_USER_NAME];
            let email = props.preference[ServiceUtilConstant.Email];
            let avatar = props.preference[ServiceUtilConstant.KEY_USER_AVATAR];

            let fullName = '-';
            let userAvatar = '';

            //if firstName & lastName is not empty than store name
            if (!isEmpty(firstName) && !isEmpty(lastName)) {
                fullName = firstName + ' ' + lastName;
            }

            if (isEmpty(email) && isEmpty(userName)) {
                email = '-';
            } else if (isEmpty(email) && !isEmpty(userName)) {
                email = userName;
            }

            try {
                if (JSON.parse(avatar)) {
                    userAvatar = JSON.parse(avatar);
                } else {
                    userAvatar = R.images.AVATAR_01;
                }
            } catch (error) {
                userAvatar = R.images.AVATAR_01;
            }

            if (state.fullName !== fullName || state.email !== email || state.userAvatar !== userAvatar) {
                return Object.assign({}, state, { fullName, email, userAvatar });
            }

        } catch (error) {
            return null;
        }

        // check if curent screen is active, or class is already mounted or not
        if (isCurrentScreen(props) || ViewProfileWidget.classMounted) {

            let { updateData: { data }, LoginHistoryWidgetData } = props

            // To check data is null or not
            if (data) {

                //if local viewProfile state is null or its not null and also different then new response then and only then validate response.
                if (state.viewProfile == null || (state.viewProfile != null && data !== state.viewProfile)) {
                    let temp = {
                        viewProfile: data
                    };

                    try {
                        //currently use status code as success temprory
                        if (validateResponseNew({ response: data, isList: true })) {

                            temp = {
                                ...temp,
                                fullName: data.UserData.FirstName + ' ' + data.UserData.LastName,
                                email: data.UserData.Email
                            }
                        }
                    } catch (error) {
                        //perform catch operation
                        temp = { ...temp };
                    }
                    return Object.assign({}, state, temp);
                }
            }

            //To Check Login History Data Fetch or Not
            if (LoginHistoryWidgetData) {
                try {
                    //if local LoginHistoryWidgetData state is null or its not null and also different then new response then and only then validate response.
                    if (state.LoginHistoryWidgetData == null || (state.LoginHistoryWidgetData != null && LoginHistoryWidgetData !== state.LoginHistoryWidgetData)) {

                        if (validateResponseNew({ response: LoginHistoryWidgetData, isList: true })) {

                            //check Ip History Response is an Array Or not
                            //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                            var res = parseArray(LoginHistoryWidgetData.LoginHistoryList);

                            let lastLoginTime = '';
                            if (res.length > 0) {
                                lastLoginTime = convertDateTime(res[0].Date);
                            }

                            return Object.assign({}, state, {
                                LoginHistoryWidgetData,
                                lastLogin: lastLoginTime
                            });
                        } else {
                            return Object.assign({}, state, {
                                LoginHistoryWidgetData,
                            });
                        }
                    } else {
                        return Object.assign({}, state, {
                            LoginHistoryWidgetData,
                        });
                    }
                } catch (e) {
                    return null;
                }
            }
        }

        return null;
    }

    shouldComponentUpdate = (nextProps, nextState) => {

        //To get old name and new name if there's changes then refresh screen.
        let oldName = this.props.preference[ServiceUtilConstant.FIRSTNAME] + ' ' + this.props.preference[ServiceUtilConstant.LASTNAME];
        let newName = nextProps.preference[ServiceUtilConstant.FIRSTNAME] + ' ' + nextProps.preference[ServiceUtilConstant.LASTNAME];
        let oldAvatar = this.props.preference[ServiceUtilConstant.KEY_USER_AVATAR] + ' ' + this.props.preference[ServiceUtilConstant.KEY_USER_AVATAR];
        let avatar = nextProps.preference[ServiceUtilConstant.KEY_USER_AVATAR] + ' ' + nextProps.preference[ServiceUtilConstant.KEY_USER_AVATAR];

        //If theme or locale is changed then update componenet
        if (this.props.preference.theme !== nextProps.preference.theme ||
            this.props.preference.locale !== nextProps.preference.locale ||
            oldAvatar !== avatar ||
            oldName !== newName) {
            return true;
        } else {
            if (this.state.fullName !== nextState.fullName ||
                this.state.email !== nextState.email ||
                this.state.ipAddress !== nextState.ipAddress ||
                this.state.lastLogin !== nextState.lastLogin ||
                this.state.userAvatar !== nextState.userAvatar ||
                this.state.lastLogin !== nextState.lastLogin) {
                return isCurrentScreen(nextProps);
            } else {
                return false;
            }
        }
    };

    onPressWidget() {
        this.props.navigation.navigate('ViewProfile');
    }

    render() {
        return <TouchableWithoutFeedback onPress={this.onPressWidget}>
            <View style={{ flexDirection: 'row', marginLeft: R.dimens.margin_left_right, marginRight: R.dimens.margin_left_right }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{
                        margin: R.dimens.widgetMargin,
                        borderRadius: R.dimens.profilePicBorderRadius / 2,
                        borderWidth: R.dimens.profilePicBorderWidth,
                        borderColor: R.colors.backgroundTransparent
                    }}>
                        <Image
                            style={{
                                height: R.dimens.profilePicWidthHeight,
                                width: R.dimens.profilePicWidthHeight,
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: R.dimens.WidgetPadding,
                                borderRadius: R.dimens.profilePicWidthHeight / 2
                            }}
                            source={this.state.userAvatar} />
                    </View>
                </View>

                <View style={{ flex: 1, marginLeft: R.dimens.widget_left_right_margin, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    {
                        this.state.fullName !== '-' &&
                        <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText }}>{this.state.fullName} </TextViewMR>
                    }
                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: this.state.fullName !== '-' ? R.dimens.smallText : R.dimens.mediumText }}>{this.state.email} </TextViewHML>
                    <TextViewHML style={{ marginTop: R.dimens.widgetMargin, color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{this.state.ipAddress}</TextViewHML>
                    <ImageTextButton
                        name={this.state.lastLogin}
                        isHML
                        textStyle={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}
                        isLeftIcon
                        icon={R.images.IC_LAST_LOGIN}
                        iconStyle={{
                            width: R.dimens.etHeaderImageHeightWidth,
                            height: R.dimens.etHeaderImageHeightWidth,
                            tintColor: R.colors.textSecondary,
                            marginRight: R.dimens.widgetMargin
                        }}
                        style={{ margin: 0, justifyContent: 'center', alignItems: 'center' }}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    }
}

function mapStateToProps(state) {
    return {
        preference: state.preference,
        updateData: state.EditProfileReducer,
        LoginHistoryWidgetData: state.LoginHistoryReducer.LoginHistoryWidgetData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loginHistoryList: (LoginHistoryReqObj) => dispatch(loginHistoryList(LoginHistoryReqObj)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewProfileWidget);