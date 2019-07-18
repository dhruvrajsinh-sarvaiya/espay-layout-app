import React, { Component } from 'react';
import { View, Text, Image, Linking, Platform } from 'react-native';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import Button from '../../native_theme/components/Button';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import { changeTheme, showAlert } from '../../controllers/CommonUtils';
import PackageChecker from '../../native_theme/helpers/PackageChecker';
import R from '../../native_theme/R';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import SafeView from '../../native_theme/components/SafeView';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import TextViewMR from '../../native_theme/components/TextViewMR';

class GoogleAuthenticatorDownloadApp extends Component {

    constructor(props) {
        super(props)

        this.state = {
            // To get Play Store or App Store link for Google Authenticator
            googleAuthAppLink: Platform.select({
                ios: 'https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8',
                android: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2'
            })
        }
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    };

    onSubmit = async () => {
        try {
            // if platform is android then check for app installed or not
            if (Platform.OS === 'android') {

                // Android Native Module to Check If Google Authenticator Package is install or not
                await PackageChecker.isAuthAvailable().then(result => {

                    // if result is true then package is installed then redirect to next screen
                    if (result) {
                        this.redirectToGoogleAuthBackupKey();
                    } else {

                        // show dialog to install google authenticator before proceeding to next screen
                        showAlert(R.strings.Info + '!', R.strings.App_Install_Message, 3, async () => { Linking.openURL(this.state.googleAuthAppLink) }, R.strings.cancel, async () => { })
                    }
                });
            }

            //For IOS only, as its not posssible to check if app is install or not so just redirect user to generate backup key.
            if (Platform.OS === 'ios') {
                this.redirectToGoogleAuthBackupKey();
            }
        } catch (e) { }
    }

    // To redirect to Generate Backup Key Screen
    redirectToGoogleAuthBackupKey() {
        const { params } = this.props.navigation.state;
        this.props.navigation.navigate('GoogleAuthenticatorBackupKey', params)
    }

    textStyle = {
        textAlign: 'center',
        fontSize: R.dimens.smallText,
        color: R.colors.textPrimary,
    }

    render() {

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.GoogleAuthenticator} isBack={true} nav={this.props.navigation} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    <View style={{ alignItems: 'center', paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                        <Image source={R.images.IC_GOOGLE_AUTHENTICATOR} style={{
                            height: R.dimens.signup_screen_logo_height,
                            width: R.dimens.signup_screen_logo_height,
                            marginBottom: R.dimens.padding_top_bottom_margin
                        }} />

                        <TextViewHML style={this.textStyle}>
                            {R.strings.googleAuthIntroMessagePart1}

                            <Text style={[this.textStyle, { color: R.colors.accent, fontFamily: Fonts.HindmaduraiSemiBold }]} onPress={() => Linking.openURL(this.state.googleAuthAppLink)}>
                                {R.strings.GoogleAuthenticator}
                            </Text>

                            {R.strings.googleAuthIntroMessagePart2}
                        </TextViewHML>

                        <View style={{
                            flexDirection: 'row',
                            marginTop: R.dimens.activity_margin,
                            alignItems: 'center',
                        }}>
                            <TextViewMR style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{R.strings.GoogleAuthenticator}</TextViewMR>
                            <View style={{ justifyContent: 'flex-end', }}>
                                <ImageTextButton
                                    name={R.strings.download}
                                    onPress={() => Linking.openURL(this.state.googleAuthAppLink)}
                                    textStyle={{
                                        color: R.colors.accent,
                                        fontSize: R.dimens.dashboardSelectedTabText,
                                        textAlign: 'center'
                                    }}
                                    style={{
                                        margin: 0,
                                        borderWidth: R.dimens.pickerBorderWidth,
                                        borderColor: R.colors.accent,
                                        alignItems: 'center',
                                        paddingLeft: R.dimens.WidgetPadding,
                                        paddingRight: R.dimens.WidgetPadding,
                                        paddingTop: R.dimens.widgetMargin,
                                        paddingBottom: R.dimens.widgetMargin
                                    }}
                                />
                            </View>

                        </View>
                    </View>

                    {/* To display button at the bottom */}
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* Submit Button */}
                        <Button title={R.strings.next} onPress={this.onSubmit}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

export default GoogleAuthenticatorDownloadApp;