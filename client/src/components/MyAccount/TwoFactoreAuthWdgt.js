import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import { Row, Col } from "reactstrap";
// intl messages
import IntlMessages from "Util/IntlMessages";
import CircularProgress from '@material-ui/core/CircularProgress';
import MatButton from "@material-ui/core/Button";

//Added by salim
import { getProfileByID } from "Actions/MyAccount";

class TwoFactoreAuthWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			google2FA: false,
			sms2Fa: false,
			loading: true
		};
	}

	componentWillMount() {
		this.props.getProfileByID();
	}

	componentWillReceiveProps(nextProps) {
        this.setState({ loading : nextProps.loading });
		if(Object.keys(nextProps.profileData).length > 0 && nextProps.profileData.ReturnCode === 0) {
			this.setState({ google2FA : nextProps.profileData.UserData.TwoFactorEnabled });
		}
	}
	
	loadComponentView(component) {
		this.props.changeComponent(component);
	}

	render() {
		const { loading, google2FA, sms2Fa } = this.state;
		return (
			<Fragment>
				<Row>
					<Col md={10} sm={12} className="my-30 mx-auto">
						{
							loading
							?
							<div className="text-center py-40">
								<CircularProgress className="progress-primary" thickness={2} />
							</div>
							:
							<table className={this.props.darkMode ? 'TowFactorlist-darkmode d-sm-full':'TowFactorlist d-sm-full'}>
								<tbody>
									<tr>
										<td>
											<span className="material-icons mr-10">check_circle</span>
										</td>
										<td>
											<img className="img-fluid d-xs-none" alt="share" width="50" height="50" src={require("Assets/img/QRicon-1.png")} />
										</td>
										<td>
											<span><IntlMessages id="my_account.glgAuthentication" /></span>
											<p><IntlMessages id="my_account.glgAuthNote" /></p>
										</td>
										<td>
											{
												google2FA
												?
												<MatButton  onClick={() => this.loadComponentView('View5')} variant="raised" className="btn-danger text-white text-center mt-10" >
												<IntlMessages id="sidebar.btnDisable" />
												</MatButton>
												:
												<MatButton  onClick={() => this.loadComponentView('View4')} variant="raised" className="btn-success text-white text-center mt-10" >
												<IntlMessages id="sidebar.btnEnable" />
												</MatButton>
											}
										</td>
									</tr>
								</tbody>
							</table>
						}
					</Col>
				</Row>
			</Fragment>
		);
	}
}

//Map state to props
const mapStateToProps = ({ editProfileRdcer, settings }) => {
	const response = {
        profileData : editProfileRdcer.data,
		loading : editProfileRdcer.loading,
		darkMode: settings.darkMode
	}
	return response;
}

export default connect(mapStateToProps, {
	getProfileByID
})(TwoFactoreAuthWdgt);