/**
 * Auther : Salim Deraiya
 * Created : 10/10/2018
 * Google Login Button Component
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
// intl messages
import IntlMessages from "Util/IntlMessages";
//For Google login button
import { GoogleLogin } from "react-google-login";
//Import Social Login...
import { socialLogin, gerenateToken } from "Actions/MyAccount";
import { 
    getDeviceInfo,
    getIPAddress,
    getHostName,
    getMode
} from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';

class GoogleLoginButtonWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				Email: '',
				ProviderKey: '',
				ProviderName: 'Google',
				access_token: '',
				DeviceId: getDeviceInfo(),
				Mode: getMode(),
				IPAddress: '', //getIPAddress(),
				HostName: getHostName()
			},
			disabled: false,
			err_msg: '',
			err_alert: true,
			success_msg: '',
			success_alert: true,
			loading: false
		};
		
		this.onClick = this.onClick.bind(this);
		this.googleResponse = this.googleResponse.bind(this);
	}

	componentWillMount() {
		this.setState({ disabled : this.props.disabled})
	}

	componentWillReceiveProps(nextProps) {	
		this.setState({ loading : nextProps.loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });
		
        if (nextProps.redirect) {
            // added for withdraw approval screen
            if (localStorage.getItem('RefNo') !== null && localStorage.getItem('Bit') !== null) {
                window.location.href = AppConfig.WithdrawRedirect;
            } else {
                window.location.href = AppConfig.afterLoginRedirect;
            }
        } else if (nextProps.data.ReturnCode === 1) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			this.props.onSocialClick({loading : false, err_msg : errMsg});
			this.setState({ err_alert: true, err_msg: errMsg });
		} else if (nextProps.data.ReturnCode === 0) {
			if(this.state.data.Email !== '') {
				this.setState({ loading : true });
				var reqObj = {
					username : this.state.data.Email,
					password : this.state.data.ProviderKey,
					appkey : nextProps.data.Appkey
				}
				this.props.gerenateToken(reqObj);
			}
        }
	}

	onClick(event) {
		this.setState({ loading : true });
		this.props.onSocialClick({loading : true, err_msg : ''});
	}

	googleResponse(response) {
		// console.log('Google :',response);
		if(response.error !== undefined) {
			this.props.onSocialClick({loading : false });
		} else if (response.accessToken !== 'undefined' && response.profileObj.email !== '' && response.googleId !== '' && response.accessToken !== '') {
			var newObj = Object.assign({}, this.state.data);
			newObj.Email = response.profileObj.email;
			newObj.ProviderKey = response.googleId;
			newObj.access_token = response.accessToken;
			// newObj.IPAddress = getIPAddress();
			// this.setState({ data : newObj });
			
			let self = this;
            getIPAddress().then(function (ipAddress) {				
				newObj.IPAddress = ipAddress;
				this.setState({ data : newObj });
                self.props.socialLogin(this.state.data);
            });
		}
	}

	render() {
		const { disabled } = this.props;
		return (
			<Fragment>
				<GoogleLogin
					isDisabled={disabled}
					render={renderProps => (
						<button disabled={disabled} className="btn_glg_login" onClick={renderProps.onClick} onBlur={this.onClick}>{<IntlMessages id="sidebar.btnLoginWithGoogle" />}</button>
					)}
					buttonText={<IntlMessages id="sidebar.btnLoginWithGoogle" />}
					className="btn_glg_login"
					clientId={AppConfig.googleClientID}
					onSuccess={this.googleResponse}
					onFailure={this.googleResponse}
				/>
			</Fragment>
		);
	}
}

const mapStateToProps = ({ socialLoginRdcer, authTokenRdcer }) => {
	var response = {
        data: socialLoginRdcer.data,
        loading: socialLoginRdcer.loading,
        redirect: authTokenRdcer.redirect
    };
    return response;
};

export default connect(mapStateToProps,{
	socialLogin,
	gerenateToken
})(GoogleLoginButtonWdgt);