/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Updated By : Salim Deraiya (24-01-2019)
 * User KYC Status
 */

import React, { Fragment, Component } from "react";
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { Badge, Alert } from 'reactstrap';
// intl messages
import IntlMessages from "Util/IntlMessages";
import CircularProgress from '@material-ui/core/CircularProgress';
import { getKYCStatus } from "Actions/MyAccount";

const KYCStatus = ({kycStatusId}) => {
	var htmlMsg = <Link to="/app/my-account/personal-verification" className="text-primary"><IntlMessages id="my_account.submitVerificationDocuments" /></Link>;
	if(kycStatusId === 1) {
		htmlMsg = <Fragment><IntlMessages id="sidebar.kycStatus" /> : <Badge color="success"><IntlMessages id="sidebar.approval" /></Badge></Fragment>;
	} else if(kycStatusId === 2) {
		htmlMsg = <Fragment>
					<div><IntlMessages id="sidebar.kycStatus" /> : <Badge color="danger"><IntlMessages id="sidebar.reject" /></Badge></div>
					<Link to="/app/my-account/personal-verification" className="text-primary mt-10"><IntlMessages id="my_account.submitVerificationDocuments" /></Link>
				</Fragment>;
	} else if(kycStatusId === 4) {
		htmlMsg = <Fragment><IntlMessages id="sidebar.kycStatus" /> : <Badge color="warning"><IntlMessages id="sidebar.pending" /></Badge></Fragment>;
	}

	return htmlMsg;
}

class WithdrawLimitLevelBlk extends Component {
	constructor(props) {
		super(props);
		this.state = {
            loading : false,
            kycStatus : ''
		}
		
		this.onChangeVerifyDocumentTypeView = this.onChangeVerifyDocumentTypeView.bind(this);
		this.onChangeMembershipLevelView = this.onChangeMembershipLevelView.bind(this);
	}

	// On onChangeVerifyDocumentTypeView
	onChangeVerifyDocumentTypeView() {
		this.props.changeComponentView("View2");
	}

	// On onChangeMembershipLevelView
	onChangeMembershipLevelView() {
		this.props.changeComponentView("View5");
	}

	componentWillMount() {
		this.props.getKYCStatus();
    }

	componentWillReceiveProps(nextProps) {
        this.setState({ loading : nextProps.loading });
		if(Object.keys(nextProps.data).length > 0 && nextProps.data.hasOwnProperty('KYCStatus')) {
			this.setState({ kycStatus : nextProps.data.KYCStatus });
		}
    }

	render() {
		const { kycStatus, loading } = this.state;
		return (
			<Fragment>
				{
                    loading
                    ?
                    <div className="text-center py-40">
                        <CircularProgress className="progress-primary" thickness={2} />
                    </div>
					:
					<div className="kyc_verify text-center">
						<KYCStatus kycStatusId={kycStatus} />
					</div>
				}
			</Fragment>
		);
	}
}

//MapStateToProps
const mapStateToProps = ({ prsnlVerifyFrmRdcer , settings }) => {
	const response = {
        data : prsnlVerifyFrmRdcer.kycStatus,
        loading : prsnlVerifyFrmRdcer.loading,
        darkMode : settings.darkMode
	}
	return response;
}

export default connect(mapStateToProps, {
	getKYCStatus
})(WithdrawLimitLevelBlk);