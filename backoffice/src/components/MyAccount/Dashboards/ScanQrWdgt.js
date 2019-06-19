/**
 * Auther : Kevin Ladani
 * Created : 05/09/2018
 * Updated : 22/10/2018 (Salim Deraiya)
 * Scan QR Widget
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Card, CardBody } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import IntlMessages from "Util/IntlMessages";
import { getGoogleAuthInfo } from 'Actions/MyAccount';
//Generate textToImage
import { textToImage } from 'Helpers/helpers';

class ScanQrWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				Code: '',
				SharedKey: '',
				AuthenticatorUri: ''
			},
			simgUrl: '',
			loading: false
		};
		sessionStorage.removeItem("simgUrl");
	}

	componentWillMount() {
		this.props.getGoogleAuthInfo();
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading });
		if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			NotificationManager.error(errMsg);
		} else if (nextProps.data.statusCode === 200) {
			const googleAuthData = nextProps.data.EnableAuthenticatorViewModel;
			const simgUrl = textToImage(googleAuthData.SharedKey);
			this.setState({ simgUrl: simgUrl, data: googleAuthData });
			sessionStorage.setItem("simgUrl", simgUrl);

		}
	}

	render() {
		const { SharedKey, AuthenticatorUri } = this.state.data;
		const { loading, simgUrl } = this.state;
		return (
			<div className="border border-dark p-25">
				<div className="downloadappbox offset-md-3 mt-20 row">
					<div className="col-md-12">
						<h3><IntlMessages id="my_account.scanQrCode.step2" /></h3>
					</div>
				</div>
				{loading && <JbsSectionLoader />}
				<Fragment>
					<div className="offset-md-3 downloadappbox row">
						<div className="col-md-9">
							<Card className="marginbox border border-dark">
								<CardBody className="d-flex row">
									<div className="col-md-4">
										<span className="d-flex justify-content-center align-items-center">
											<img className="img-fluid d-xs-none" alt="share" width="250" height="250" src={AuthenticatorUri} />
										</span>
									</div>
									<div className="col-md-8">
										<p className="fs-180 fw-bold mt-20 text-uppercase"><img src={simgUrl} alt="image" /></p>
										<span className="fs-50 d-block text-muted"><IntlMessages id="my_account.scanQrCode.msgQRCode" /></span>
									</div>
								</CardBody>
							</Card>
						</div>
					</div>
					<div className="downloadappbox offset-md-3 row">
						<div className="col-md-12">
							<h3><IntlMessages id="my_account.scanQrCode.scannedQRCode" /></h3>
						</div>
					</div>
				</Fragment>
			</div>
		);
	}
}

// map state to props
const mapStateToProps = ({ googleauthenable }) => {
	var response = {
		data: googleauthenable.data,
		loading: googleauthenable.loading,
		errObj: googleauthenable.error
	};
	return response;
};

export default connect(mapStateToProps, {
	getGoogleAuthInfo
})(ScanQrWdgt);