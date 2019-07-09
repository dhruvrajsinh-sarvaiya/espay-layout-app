import React, { Component } from 'react';
import { View } from 'react-native';
import { getDeviceID, parseArray } from '../../controllers/CommonUtils';
import { ServiceUtilConstant } from '../../controllers/Constants';
import { socialLogin } from '../../actions/Login/loginAction';
import { connect } from 'react-redux';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import { isCurrentScreen } from '../Navigation';
import { generateToken } from '../../actions/Login/AuthorizeToken';
import { GoogleSignin } from 'react-native-google-signin';
import R from '../../native_theme/R';
import { getData, setData } from '../../App';
import ImageTextButton from '../../native_theme/components/ImageTextButton';

//Create Common class for GoogleLoginButtonWidget
class GoogleLoginButtonWidget extends Component {
    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            googleLoginData: null,
            generateToken: null,
            data: {
                Email: '',
                ProviderKey: '',
                ProviderName: 'Google',
                access_token: '',
                DeviceId: '',
                Mode: ServiceUtilConstant.Mode,
                IPAddress: '',
                HostName: ServiceUtilConstant.Mode,
            },

        };
    }

    componentDidMount = () => {
        //for google sign in configure
        GoogleSignin.configure();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps)
    }

    componentDidUpdate = async (prevProps, prevState) => {

        //Get All Updated field of Particular actions
        const { SocialLoginData, } = this.props.SocialLoginData
        if (SocialLoginData !== prevProps.SocialLoginData.SocialLoginData) {

            // SocialLoginData can not be null
            if (SocialLoginData) {
                try {
                    if (validateResponseNew({ response: SocialLoginData })) {

                        //check Social Login Response is an Array Or not
                        //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                        let res = parseArray(SocialLoginData);
                        var reqObj = {
                            username: this.state.data.Email,
                            password: this.state.data.ProviderKey,
                            appkey: res[0].Appkey
                        }

                        // check for internet connection
                        if (await isInternet()) {

                            //Call generate token method
                            this.props.generateToken(reqObj);
                            //this.props.onData(reqObj.username)

                        } else {
                            this.props.hideDialog()
                        }
                    }
                } catch (error) { }
            }
        }
    }

    resetDialogCounts() {
        if (getData(ServiceUtilConstant.KEY_DialogCount) > 0) {
            //To reset dialog show count for session expire causing
            //Set dialog show count to 0
            setData({ [ServiceUtilConstant.KEY_DialogCount]: 0 });
        }
    }

    onGoogleLoginPress = async () => {

        this.resetDialogCounts();

        await GoogleSignin.hasPlayServices({ autoResolve: true })
            .then(async () => {
                // play services are available. can now configure library
                //If Google Play Service is Available then go to Google Sign In process
                GoogleSignin.signIn()
                    .then(async (user) => {
                        //Google Sign In Success then fetch Email and set in Edit Text
                        try {
                            // Set New Value of State
                            var newObj = Object.assign({}, this.state.data);
                            newObj.Email = user.email
                            newObj.ProviderKey = user.id
                            newObj.access_token = user.accessToken
                            newObj.DeviceId = await getDeviceID()

                            //Note : ipAddress parameter is passed in its saga.
                            this.setState({ data: newObj })

                            // check for internet connection
                            if (await isInternet()) {
                                this.props.showDialog()

                                // GenerateToken Api Call
                                this.props.socialLogin(this.state.data)
                            }

                            //For Google Sign out
                            GoogleSignin.signOut()
                                .then(() => {
                                    //Google Sign Out Success
                                })
                                .catch((err) => {
                                    //handle catch
                                });
                        } catch (error) {
                            this.props.hideDialog()
                            showAlert(R.strings.NetworkError, R.strings.SLOW_INTERNET, 5);
                        }

                    })
                    .catch((err) => {
                        this.setState({ data: [] });
                    })
                    .done();
            })
            .catch((err) => {
                //handle catch
                //Google Play Service not available in device then display alert dialog
            })

    }

    render() {
        return (
            <View>
                <ImageTextButton
                    icon={R.images.IC_GOOGLE}
                    onPress={this.onGoogleLoginPress}
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
        SocialLoginData: state.loginReducer,
        token: state.AuthorizeTokenReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    socialLogin: (payload) => dispatch(socialLogin(payload)),
    generateToken: (payload) => dispatch(generateToken(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(GoogleLoginButtonWidget);
