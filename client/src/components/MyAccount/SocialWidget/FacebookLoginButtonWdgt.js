/**
 * Auther : Salim Deraiya
 * Created : 10/10/2018
 * Facebook Login Button Component
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
// intl messages
import IntlMessages from "Util/IntlMessages";
//For Facebook login button
import FacebookLogin from "react-facebook-login";
//Import Social Login...
import { socialLogin, gerenateToken } from "Actions/MyAccount";
import { 
    getDeviceInfo,
    getIPAddress,
    getHostName,
    getMode
} from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';

class FacebookLoginButtonWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				Email: '',
				ProviderKey: '',
				ProviderName: 'Facebook',
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
		this.facebookResponse = this.facebookResponse.bind(this);
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
	
	onClick() {
		this.setState({ loading : true });
		this.props.onSocialClick({loading : true, err_msg : ''});
	}

	facebookResponse(response) {
		// console.log('Facebook User', response,typeof response);
		if(Object.keys(response).length === 1 && response.status === undefined) {
			this.props.onSocialClick({loading : false });
		} else if (typeof response.accessToken !== 'undefined' && response.email !== '' && response.id !== '' && response.accessToken !== '') {
			var newObj = Object.assign({}, this.state.data);
			newObj.Email = response.email;
			newObj.ProviderKey = response.id;
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
				<FacebookLogin
					isDisabled={disabled}
					textButton={<IntlMessages id="sidebar.btnLoginWithFacebook" />}
					cssClass="btn_fb_login"
					appId={AppConfig.facebookProviderID}
					fields="name,email,picture"
					onClick={this.onClick}
					callback={this.facebookResponse}
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

export default connect(mapStateToProps, {
	socialLogin,
	gerenateToken
})(FacebookLoginButtonWdgt);