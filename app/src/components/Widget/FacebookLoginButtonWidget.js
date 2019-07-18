import React, { Component } from 'react';
import { View } from 'react-native';
import { LoginManager, AccessToken, } from 'react-native-fbsdk';
import { getDeviceID, parseArray, showAlert } from '../../controllers/CommonUtils';
import { ServiceUtilConstant } from '../../controllers/Constants';
import { socialFacebookLogin } from '../../actions/Login/loginAction';
import { connect } from 'react-redux';
import { isEmpty, isInternet, validateResponseNew } from '../../validations/CommonValidation';
import { generateToken } from '../../actions/Login/AuthorizeToken';
import R from '../../native_theme/R';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { getData, setData } from '../../App';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import { isCurrentScreen } from '../Navigation';

class FacebookLoginButtonWidget extends Component {
    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            data: {
                Email: '',
                ProviderKey: '',
                ProviderName: 'Facebook',
                access_token: '',
                DeviceId: '',
                Mode: ServiceUtilConstant.Mode,
                IPAddress: '',
                HostName: ServiceUtilConstant.Mode,
                isFirstTime: true
            }
        };
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps)
    }

    initUser = (data) => {
        const { accessToken, userID } = data
        fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + accessToken)
            .then((response) => response.json())
            .then(async (json) => {
                if (!isEmpty(json.email) && !isEmpty(userID) && !isEmpty(accessToken) && accessToken !== undefined) {
                    try {
                        // Set New Value of State
                        var newObj = Object.assign({}, this.state.data);
                        newObj.Email = json.email
                        newObj.ProviderKey = userID
                        newObj.access_token = accessToken
                        newObj.DeviceId = await getDeviceID()
                        
                        //Note : ipAddress parameter is passed in its saga.
                        this.setState({ data: newObj })
                        if (await isInternet()) {
                            this.props.showDialog()
                            
                            //Social Login Api Call
                            this.props.socialFacebookLogin(this.state.data)
                            LoginManager.logOut()
                        }
                    } catch (error) {
                        this.props.hideDialog();
                        showAlert(R.strings.NetworkError, R.strings.SLOW_INTERNET, 5);
                    }
                }
            })
    }

    resetDialogCounts() {
        if (getData(ServiceUtilConstant.KEY_DialogCount) > 0) {
            //To reset dialog show count for session expire causing
            //Set dialog show count to 0
            setData({ [ServiceUtilConstant.KEY_DialogCount]: 0 })
        }
    }

    onFacebookPress = () => {

        this.resetDialogCounts();

        let ctx = this;
        LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
            function (result) {
                if (result.isCancelled) {
                    LoginManager.logOut();
                }
                else {
                    AccessToken.getCurrentAccessToken().then((data) => {
                        ctx.initUser(data)
                    })
                }
            },
            function (error) {
                //logger('Facebook Login Error : ' + error);
            }
        )
    }

    componentDidUpdate = async (prevProps, prevState) => {
        let { SocialFacebookLoginData } = this.props.SocialLoginData
        //logger('props', this.props)
        if (SocialFacebookLoginData !== prevProps.SocialLoginData.SocialFacebookLoginData) {
            
            // SocialLoginData can not be null
            if (SocialFacebookLoginData) {

                if (validateResponseNew({ response: SocialFacebookLoginData })) {
                    
                    //check Social Login Response is an Array Or not
                    //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                    let res = parseArray(SocialFacebookLoginData);

                    // User logout from Facebook
                    LoginManager.logOut()

                    if (await isInternet()) {
                        
                        //Call generate token method
                        this.props.generateToken({ username: this.state.data.Email, password: this.state.data.ProviderKey, appkey: res[0].Appkey });
                    }
                }
            }
        }
    }

    static getDerivedStateFromProps(props, state) {
        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return Object.assign({}, state, {
                isFirstTime: false,
            });
        }
        return null
    }

    render() {
        let { SocialFacebookLoginFetching } = this.props.SocialLoginData
        return (
            <View>
                {/* Progressbar */}
                <ProgressDialog isShow={SocialFacebookLoginFetching} />

                <ImageTextButton
                    icon={R.images.IC_FACEBOOK}
                    onPress={this.onFacebookPress}
                    iconStyle={{
                        width: R.dimens.IconWidthHeight,
                        height: R.dimens.IconWidthHeight,
                        tintColor: R.colors.buttonBackground
                    }}
                    style={{ margin: 0 }} />
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        SocialLoginData: state.loginReducer
    }
}

const mapDispatchToProps = (dispatch) => ({
    socialFacebookLogin: (payload) => dispatch(socialFacebookLogin(payload)),
    generateToken: (payload) => dispatch(generateToken(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FacebookLoginButtonWidget);
