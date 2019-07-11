/* 
    Developer : Kevin Ladani
    Date : 24-11-2018
    File Comment : Personal Information Dashboard View
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import { Badge } from 'reactstrap';
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import { getProfileByID } from "Actions/MyAccount";

class ViewUserProfile extends Component {
	constructor(props) {
		super(props);
		this.state = {
            loading: false,
			data: {}
		};
    }
    
	componentWillMount() {
		this.props.getProfileByID();
    }

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading });

		if (nextProps.data.ReturnCode === 1) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			NotificationManager.error(errMsg);
		} else if (nextProps.data.ReturnCode === 0) {
			this.setState({ data: nextProps.data.UserData });
		}
	}

	render() {
        const { loading, data} = this.state;
		return (
			<div className="jbs-page-content card">
                {loading && <JbsSectionLoader />}
				<table className="table table-striped">
                    <colgroup>
                        <col width="20%" />
                        <col width="80%" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th><IntlMessages id="sidebar.firstName" /></th>
                            <td>{ data.hasOwnProperty('FirstName') ? data.FirstName : '-' }</td>
                        </tr>
                        <tr>
                            <th><IntlMessages id="sidebar.lastName" /></th>
                            <td>{ data.hasOwnProperty('LastName') ? data.LastName : '-' }</td>
                        </tr>
                        <tr>
                            <th><IntlMessages id="sidebar.username" /></th>
                            <td>{ data.hasOwnProperty('Username') ? data.Username : '-' }</td>
                        </tr>
                        <tr>
                            <th><IntlMessages id="my_account.emailId" /></th>
                            <td>{ data.hasOwnProperty('Email') ? data.Email : '-' }</td>
                        </tr>
                        <tr>
                            <th><IntlMessages id="my_account.mobileNo" /></th>
                            <td>{ data.hasOwnProperty('MobileNo') ? data.MobileNo : '-' }</td>
                        </tr>
                        <tr>
                            <th><IntlMessages id="sidebar.twoFAStatus" /></th>
                            <td>{ data.hasOwnProperty('TwoFactorEnabled') ? (data.TwoFactorEnabled ? <Badge color="success"><IntlMessages id="sidebar.active" /></Badge> : <Badge color="danger"><IntlMessages id="sidebar.inactive" /></Badge>) : '-' }</td>
                        </tr>
                        <tr>
                            <th><IntlMessages id="sidebar.emailConfirmStatus" /></th>
                            <td>{ data.hasOwnProperty('IsEmailConfirmed') ? (data.IsEmailConfirmed ? <Badge color="success"><IntlMessages id="sidebar.yes" /></Badge> : <Badge color="danger"><IntlMessages id="sidebar.no" /></Badge>) : '-' }</td>
                        </tr>
                        <tr>
                            <th><IntlMessages id="sidebar.socialProfileStatus" /></th>
                            <td>{ data.hasOwnProperty('SocialProfile') ? data.SocialProfile : '-' }</td>
                        </tr>
                    </tbody>
                </table>			
			</div>
		)
	}
}

const mapStateToProps = ({ editProfileRdcer }) => {
	const { data, loading } = editProfileRdcer;
	return { data, loading };
}

export default connect(mapStateToProps, {
	getProfileByID
})(ViewUserProfile);