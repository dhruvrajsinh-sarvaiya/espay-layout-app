/**
 * Auther : Kevin Ladani
 * Created : 27/10/2018
 * updated by :Saloni Rathod(15th April 2019)
 * Forgot ConfirmationWdgt
 */

import React, { Component } from "react";
import { connect } from "react-redux";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { Link } from "react-router-dom";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
// redux action
import { forgotConfirmation } from "Actions/MyAccount";
import qs from "query-string";
// app config

import ResetPasswordWdgt from './ResetPasswordWdgt';

class ForgotConfirmationWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Id: '',
			loading: false,
			err: ''
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
				this.setState({
					Id: nextProps.data.Id,
					err: nextProps.data.ErrorCode
				})
			}
		}
		else if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) {
			this.setState({
				err: nextProps.data.ErrorCode
			})

		}
	}

	render() {
		const { loading, Id, err } = this.state;
		return (
			<div className="jbs-session-wrapper inner_bg">
				<div className="container">
					<div className="inner_box rmv_brd">
						<div className="site-logo text-center mb-20">
							<Link to="/" className="logo-normal">

							</Link>
						</div>

						{loading && <JbsSectionLoader color="secondary" />}
						{this.state.Id === '' ? (
							<div className="mt-50">
								<div className="text-center mb-30">
									<div className="card py-20 mt-50 forgotconfirmradius">
										<div className="forgotconfirmbox">
											<span className="bg-danger"><i className="material-icons font-2x">close</i></span>
										</div>
										<h1 className="font-weight-bold mb-20 text-center">
											<IntlMessages id="my_account.forgotConfirm.forgoteVerifyLinkNotValid" />
										</h1>
										<p className="text-center"><IntlMessages id={`apiErrCode.${err}`} /></p>
										<Link to="/signin" className="lnkToBtn btn-danger w-25 mx-auto" variant="raised"><IntlMessages id="sidebar.btnBackToLogin" /></Link>
									</div>
								</div>
							</div>
						) : (
								<div className="session-inner-wrapper">
									<ResetPasswordWdgt Id={Id} />
								</div>
							)}
					</div>
				</div>
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