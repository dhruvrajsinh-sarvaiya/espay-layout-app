import React, { Component } from 'react';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { languages } from '../../localization/strings';
import { FeatureSwitch } from '../../native_theme/components/FeatureSwitch';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import { connect } from 'react-redux';
import MenuListItem from '../../native_theme/components/MenuListItem';
import { changeTheme, showAlert } from '../../controllers/CommonUtils';
import { isEmpty, isInternet, validateResponseNew } from '../../validations/CommonValidation';
import { getData, setData } from '../../App';
import { ServiceUtilConstant } from '../../controllers/Constants';
import { isCurrentScreen, addRouteToBackPress } from '../Navigation';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { subscribeNotification, unsubscribeNotification, clearNotificationData } from '../../actions/account/SubscribeNotification'
import R from '../../native_theme/R';
import SafeView from '../../native_theme/components/SafeView';

class SettingScreen extends Component {
    constructor(props) {
        super(props);

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });

        this.state = {
            isLogin: true,
            onNotificatioToggle: false,
            locale: '',
        }

        //To Bind All Method
        this.updateNotification = this.updateNotification.bind(this);
    }

    onBackPress() {

        if (this.props.navigation.state.params.refresh !== undefined) {
            //refresh previous screen list
            this.props.navigation.state.params.refresh()
        }

        //go to previous screen
        this.props.navigation.goBack();
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //To clear notification data if exist
        this.props.clearNotificationData();
    };

    updateLocale = async () => {
        var locale = this.props.preference.locale;
        locale = isEmpty(locale) ? 'en' : locale;

        let index = languages.findIndex((item) => item.value === locale);
        locale = languages[index].name;

        this.setState({ locale: locale });
    }

    updateTheme = () => {

        let theme = '';
        //To swap current themes
        if (this.props.preference.theme === 'nightTheme') {
            theme = 'lightTheme'
        } else {
            theme = 'nightTheme'
        }

        //To update theme in redux store
        setData({ [ServiceUtilConstant.KEY_Theme]: theme });

    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        if (this.props.preference.locale !== nextProps.preference.locale) {
            return true;
        } else {
            return isCurrentScreen(nextProps);
        }
    };

    componentDidUpdate = (prevProps, prevState) => {
        //Get All Updated Feild of Particular actions
        const { subscribeNoti, unsubscribeNoti } = this.props;

        if (subscribeNoti !== prevProps.subscribeNoti) {
            //To Check Subscribe Notification  Api Data Fetch or Not
            if (subscribeNoti) {
                try {

                    if (validateResponseNew({ response: subscribeNoti })) {

                        //To update Notification Subscribe to true in preference
                        setData({ [ServiceUtilConstant.KEY_SubscribeNoti]: true });

                        showAlert(R.strings.Success + '!', subscribeNoti.ReturnMsg, 0);
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }
        }

        if (unsubscribeNoti !== prevProps.unsubscribeNoti) {
            //To Check Subscribe Notification  Api Data Fetch or Not
            if (unsubscribeNoti) {
                try {
                    if (validateResponseNew({ response: unsubscribeNoti })) {

                        //To update Notification Subscribe to true in preference
                        setData({
                            [ServiceUtilConstant.KEY_SubscribeNoti]: false,
                        });

                        showAlert(R.strings.Success + '!', unsubscribeNoti.ReturnMsg, 0);
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }
        }
    }

    updateNotification = async () => {

        let isNoti = getData(ServiceUtilConstant.KEY_SubscribeNoti);

        //Check NetWork is Available or not
        if (await isInternet()) {

            if (!isNoti) {
                //Call to Subscribe Notification
                this.props.subscribeNotification();
            }
            else {
                //Call to Set UnSubscribe Notification
                this.props.unSubscribeNotification();
            }

        }
    }

    render() {

        let language = getData(ServiceUtilConstant.KEY_Locale);

        language = languages[languages.findIndex(el => el.value === language)].name;

        const { isSubscribing, isUnsubscribing } = this.props;

        return (
            <SafeView style={[{ flex: 1, backgroundColor: R.colors.background }, this.props.style]}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.Preferences}
                    isBack={true}
                    nav={this.props.navigation}
                    onBackPress={this.onBackPress}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={isSubscribing || isUnsubscribing} />

                {/* For Dark and light theme toggle button */}
                <FeatureSwitch
                    backgroundColor={R.colors.background}
                    style={{ marginTop: R.dimens.widgetMargin }}
                    title={R.strings.EnableDarkMode}
                    isToggle={this.props.preference.theme === 'lightTheme' ? false : true}
                    onValueChange={this.updateTheme}
                    textStyle={{ color: R.colors.textPrimary }}
                    tintColor={R.colors.textSecondary}
                />

                {/* For Notification Setting */}
                <FeatureSwitch
                    backgroundColor={R.colors.background}
                    style={{ marginTop: R.dimens.widgetMargin }}
                    title={R.strings.NotificationSettings}
                    isToggle={this.props.preference[ServiceUtilConstant.KEY_SubscribeNoti] ? this.props.preference[ServiceUtilConstant.KEY_SubscribeNoti] : false}
                    onValueChange={() => this.updateNotification()}
                    textStyle={{ color: R.colors.textPrimary }}
                    tintColor={R.colors.textSecondary}
                />

                <MenuListItem
                    icon={R.images.IC_LANGUAGE}
                    title={R.strings.language}
                    onPress={() => this.props.navigation.navigate('LanguageScreen', { updateLocale: this.updateLocale })}
                    status={language}
                />
            </SafeView>
        );
    }
}

const mapStateToProps = (state) => {
    return {

        preference: state.preference,

        //Subscribe Notification
        subscribeNoti: state.notificationReducer.subscribeNoti,
        isSubscribing: state.notificationReducer.isSubscribing,
        subscribeNotiError: state.notificationReducer.subscribeNotiError,

        //UnSubscribe Notification
        unsubscribeNoti: state.notificationReducer.unsubscribeNoti,
        isUnsubscribing: state.notificationReducer.isUnsubscribing,
        unsubscribeNotiError: state.notificationReducer.unsubscribeNotiError,
    }
};

function mapStatToProps(dispatch) {
    return {
        //To subscribe and unsubscribe Notification
        subscribeNotification: () => dispatch(subscribeNotification()),
        unSubscribeNotification: () => dispatch(unsubscribeNotification()),
        clearNotificationData: () => dispatch(clearNotificationData())
    }
}

export default connect(mapStateToProps, mapStatToProps)(SettingScreen);
