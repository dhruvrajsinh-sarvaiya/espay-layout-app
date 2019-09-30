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

class GoogleAuthenticatorDownloadApp extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    };

    onSubmit = async () => {
        try {
            let link = '';
            //For Android only
            //To Check Google Authenticator App install in Device or not
            //if install then redirect user to next screen
            //else display dialog and redirect user to play store screen to download Google Authenticator App.
            if (Platform.OS === 'android') {
                link = 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2';
                await PackageChecker.isAuthAvailable().then(result => {
                    // logger('Google Authenticator App Status:' + result)
                    if (result) {
                        const { params } = this.props.navigation.state;
                        this.props.navigation.navigate('GoogleAuthenticatorBackupKey', params)
                    } else {
                        showAlert(R.strings.Status, R.strings.App_Install_Message, 3, async () => { Linking.openURL(link) }, R.strings.cancel, async () => { })
                    }
                });
            }
            //For IOS only
            if (Platform.OS === 'ios') {
                link = 'https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8';
            }
        } catch (e) {
            //some logic
        }
    }

    textStyle = () => {
        return {
            textAlign: 'center',
            fontSize: R.dimens.smallText,
            color: R.colors.textPrimary,
        }
    }

    render() {

        let link = '';
        if (Platform.OS === 'android') {
            link = 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2';
        }
        if (Platform.OS === 'ios') {
            link = 'https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8';
        }

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.GoogleAuthenticator} isBack={true} nav={this.props.navigation} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    <View style={{ alignItems: 'center', paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                        {/* Google auth image */}
                        <Image source={R.images.IC_GOOGLE_AUTHENTICATOR} style={{
                            height: R.dimens.signup_screen_logo_height,
                            width: R.dimens.signup_screen_logo_height,
                            marginBottom: R.dimens.padding_top_bottom_margin
                        }} />

                        <TextViewHML style={this.textStyle()}>
                            {R.strings.googleAuthIntroMessagePart1}

                            <Text style={[this.textStyle(), { color: R.colors.accent, fontFamily: Fonts.HindmaduraiSemiBold }]} onPress={() => Linking.openURL(link)}>
                                {R.strings.GoogleAuthenticator}
                            </Text>

                            {R.strings.googleAuthIntroMessagePart2}
                        </TextViewHML>
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