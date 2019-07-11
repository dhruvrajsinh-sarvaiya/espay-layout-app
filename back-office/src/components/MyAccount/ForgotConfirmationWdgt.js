/**
 * Create By : Sanjay 
 * Created Date: 31/01/2019
 * Forgot Confirmation Component
 */

import React, { Component } from "react";
import { connect } from "react-redux";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { Link } from "react-router-dom";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// redux action
import { forgotConfirmation } from "Actions/MyAccount";
import qs from "query-string";
// app config
import AppConfig from 'Constants/AppConfig';
import ResetPassword from './ResetPassword';

class ForgotConfirmationWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Id: '',
			loading: false
		};
	}

	componentWillMount() {
		const parsed = qs.parse(location.search);
		if (parsed.Forgotverifylink !== "") {
			var reqObj = {
				LinkData: parsed.Forgotverifylink
			};
			this.props.forgotConfirmation(reqObj);
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });
		if (nextProps.data.statusCode === 200) {
			if (nextProps.data.Id !== '') {
				this.setState({ Id: nextProps.data.Id })
			}
		}
	}

	render() {
		const { loading, Id } = this.state;
		return (
			<div className="container mt-70">
				<div className="site-logo text-center mb-20">
					<Link to="/" className="logo-normal">
						<img src={AppConfig.appLogo} className="img-fluid" alt="site-logo" width="150" height="25" />
					</Link>
				</div>
				{loading && <JbsSectionLoader color="secondary" />}
				{this.state.Id === '' ? (
					<div className="row">
						<div className="col-sm-12 col-md-5 mx-auto forgotconfirmradius mt-40">
							<JbsCollapsibleCard>
								<div className="forgotconfirmbox">
									<span className="bg-danger"><i className="material-icons font-2x">close</i></span>
								</div>
								<div className="forgotconfirmdetails">
									<h1 className="font-weight-bold mb-20 text-center">
										<IntlMessages id="my_account.forgotConfirm.forgoteVerifyLinkNotValid" />
									</h1>
									<Link to="/signin" className="lnkToBtn forgot-passwrong btn-danger" variant="raised"><IntlMessages id="sidebar.btnBackToLogin" /></Link>
								</div>
							</JbsCollapsibleCard>
						</div>
					</div>
				) : (
						<ResetPassword Id={Id} />
					)}

			</div >
		);
	}
}
// map state to props
const mapStateToProps = ({ forgotConfirmationReducer }) => {
	const { data, loading } = forgotConfirmationReducer;
	return { data, loading };
};

export default connect(mapStateToProps, {
	forgotConfirmation
})(ForgotConfirmationWdgt);