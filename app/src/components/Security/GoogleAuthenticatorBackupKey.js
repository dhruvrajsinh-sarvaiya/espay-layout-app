import React, { Component } from 'react';
import { View, Clipboard, Image, ScrollView } from 'react-native';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import Button from '../../native_theme/components/Button';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import { getGoogleAuthInfo } from '../../actions/account/EnableGoogleAuthAction';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import { changeTheme } from '../../controllers/CommonUtils'
import { isCurrentScreen } from '../Navigation';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import R from '../../native_theme/R';
import TextViewHML from '../../native_theme/components/TextViewHML';
import TextViewMR from '../../native_theme/components/TextViewMR';
import SafeView from '../../native_theme/components/SafeView';
import CardView from '../../native_theme/components/CardView';
import CommonToast from '../../native_theme/components/CommonToast';

class GoogleAuthenticatorBackupKey extends Component {
    constructor(props) {
        super(props);

        //Define initial state
        this.state = {
            SharedKey: '',
            AuthenticatorUri: '',
            isFirstTime: true,
        };

        // Create reference
        this.toastRef = React.createRef();
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
        
        //Check NetWork is Available or not
        if (await isInternet()) {
            //Call Get Google Auth Info API
            this.props.getGoogleAuthInfo();
        }
    };

    shouldComponentUpdate = (nextProps, _nextState) => {
        /* stop twice api call  */
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

            //Get All Updated Feild of Particular actions
            const { GetAuthKeyData, GetAuthKeyFetchData } = props;

            //To Check Google Auth Info Data Fetch or Not
            if (!GetAuthKeyFetchData) {

                try {
                    if (validateResponseNew({ response: GetAuthKeyData })) {
                        return {
                            ...state,
                            SharedKey: GetAuthKeyData.EnableAuthenticatorViewModel.SharedKey,
                            AuthenticatorUri: GetAuthKeyData.EnableAuthenticatorViewModel.AuthenticatorUri
                        }
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }

        }
        return null;
    }

    // Copy link Functionality
    onCopyAddress = async () => {
        await Clipboard.setString(this.state.SharedKey);
        this.toastRef.Show(R.strings.Copy_SuccessFul);
    }

    onSubmit = async () => {
        const { params } = this.props.navigation.state;
        //Redirect User to Enable Google Auth Screen
        this.props.navigation.navigate('EnableGoogleAuthenticator', params)
    }

    textStyle = () => {
        return {
            textAlign: 'center',
            fontSize: R.dimens.smallText,
            color: R.colors.textPrimary,
        }
    }

    render() {


        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { GetAuthKeyIsFetching } = this.props;
        //----------

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.googleAuthBackupKeyTitle}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Toast */}
                <CommonToast ref={cmp => this.toastRef = cmp} />

                {/* Progress Dialog */}
                <ProgressDialog isShow={GetAuthKeyIsFetching} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    {/* To Set All View in ScrolView */}
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'center', flexGrow: 1 }}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            {/* Backup Key of Google Authenticator */}
                            <View style={{ alignItems: 'center' }}>
                                <Image source={R.images.IC_BACKUP_KEY} style={{
                                    height: R.dimens.signup_screen_logo_height,
                                    width: R.dimens.signup_screen_logo_height,
                                    marginBottom: R.dimens.padding_top_bottom_margin
                                }} />

                                <TextViewHML style={this.textStyle()}>
                                    {R.strings.googleAuthBackupKeyMessage}
                                </TextViewHML>

                                <CardView style={{
                                    backgroundColor: R.colors.cardBackground,
                                    padding: R.dimens.WidgetPadding,
                                    marginTop: R.dimens.widget_top_bottom_margin,
                                    marginBottom: R.dimens.widget_top_bottom_margin,
                                    elevation: R.dimens.widgetMargin
                                }} onPress={this.onCopyAddress}>
                                    <TextViewMR style={this.textStyle()}>{this.state.SharedKey ? this.state.SharedKey : '-'}</TextViewMR>
                                </CardView>

                                <TextViewHML style={[this.textStyle()]}>
                                    {R.strings.ScanQR_Code_Message}
                                </TextViewHML>

                                {this.state.AuthenticatorUri ? <View style={{ marginTop: R.dimens.margin }}>
                                    {/* To Display your Address in QR Code Format */}
                                    <Image source={{ uri: this.state.AuthenticatorUri }} style={{ width: R.dimens.QRCodeIconWidthHeightD, height: R.dimens.QRCodeIconWidthHeightD }}></Image>
                                </View> : null}
                            </View>
                        </View>
                    </ScrollView>

                    {/* To display button at the bottom */}
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button title={R.strings.next} onPress={this.onSubmit} />
                    </View>
                </View>
            </SafeView >
        );
    }
}

function mapStatToProps(state) {
    return {
        preference: state.preference,
        //Updates Data For Get Google Auth Key Action
        GetAuthKeyFetchData: state.EnableGoogleAuthReducer.GetAuthKeyFetchData,
        GetAuthKeyData: state.EnableGoogleAuthReducer.GetAuthKeyData,
        GetAuthKeyIsFetching: state.EnableGoogleAuthReducer.GetAuthKeyIsFetching,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform google Auth Key Action
        getGoogleAuthInfo: () => dispatch(getGoogleAuthInfo()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(GoogleAuthenticatorBackupKey);