import React, { Component } from 'react';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { ServiceUtilConstant } from '../../controllers/Constants';
import { changeTheme } from '../../controllers/CommonUtils';
import MenuListItem from '../../native_theme/components/MenuListItem';
import { getData } from '../../App';
import R from '../../native_theme/R';
import SafeView from '../../native_theme/components/SafeView';

class SecurityScreen extends Component {
    constructor(props) {
        super(props);

        // Define initial state
        this.state = {
            isGoogle: false,
            isSMS: false,
            isFirstTime: true,
        };
    }

    componentDidMount = () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        // Check google authenticator bit true or false
        this.checkUpdateResult();
    };

    /* static getDerivedStateFromProps(props, state) {
        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }
        
        if (isCurrentScreen(props)) {
            //To get the current feature state from preference
            let isGoogleAuth = getData(ServiceUtilConstant.KEY_GoogleAuth);
            let isSMSAuth = getData(ServiceUtilConstant.KEY_SMSAuth);

            let isGoogle = isGoogleAuth === undefined ? false : isGoogleAuth;
            let isSMS = (isSMSAuth === undefined || isSMSAuth === '' || isSMSAuth === 'false') ? false : true;

            if (state.isGoogle !== isGoogle)
                return { ...state, isGoogle: isGoogle }

            if (state.isSMS !== isSMS)
                return { ...state, isSMS: isSMS }
        }
        return null
    } */

    checkUpdateResult = async () => {
        //To get the current feature state from preference
        let isGoogleAuth = getData(ServiceUtilConstant.KEY_GoogleAuth);
        let isSMSAuth = getData(ServiceUtilConstant.KEY_SMSAuth);

        let isGoogle = isGoogleAuth === undefined ? false : isGoogleAuth;
        let isSMS = (isSMSAuth === undefined || isSMSAuth === '' || isSMSAuth === 'false') ? false : true;

        //Update feature state in current screen.
        this.setState({ isGoogle, isSMS })
    }

    render() {

        let { navigate } = this.props.navigation;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.Security}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* For changing password */}
                <MenuListItem
                    title={R.strings.changePassword}
                    onPress={() => navigate('ResetPasswordComponent', { isLogin: true })}
                />

                {this.state.isGoogle ?
                    /* To enable or disable Google Authenticator */
                    <MenuListItem
                        title={R.strings.GoogleAuthenticator}
                        onPress={() => navigate('DisableGoogleAuthenticator', { update: this.checkUpdateResult })}
                        status={this.state.isGoogle ? R.strings.on : R.strings.off}
                    /> :
                    /* To enable or disable Google Authenticator */
                    <MenuListItem
                        title={R.strings.GoogleAuthenticator}
                        onPress={() => navigate('GoogleAuthenticatorDownloadApp', { screenName: 'Security', update: this.checkUpdateResult })}
                        status={this.state.isGoogle ? R.strings.on : R.strings.off}
                    />}

            </SafeView>
        );
    }
}

export default SecurityScreen;
