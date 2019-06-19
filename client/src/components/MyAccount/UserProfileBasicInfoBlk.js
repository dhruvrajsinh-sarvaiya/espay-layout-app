/**
 * Active User Component
 */
import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';

// intl messages
import IntlMessages from 'Util/IntlMessages';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Badge, Alert } from 'reactstrap';

//Added by salim
import { getProfileByID } from "Actions/MyAccount";

const KYCStatus = ({kycStatusId}) => {
	var htmlMsg = '';
	if(kycStatusId === 1) {
		htmlMsg = <Fragment><IntlMessages id="sidebar.kycStatus" /> : <Badge color="success"><IntlMessages id="sidebar.approval" /></Badge></Fragment>;
	} else if(kycStatusId === 2) {
		htmlMsg = <Fragment><IntlMessages id="sidebar.kycStatus" /> : <Badge color="danger"><IntlMessages id="sidebar.reject" /></Badge></Fragment>;
	} else if(kycStatusId === 4) {
		htmlMsg = <Fragment><IntlMessages id="sidebar.kycStatus" /> : <Badge color="warning"><IntlMessages id="sidebar.pending" /></Badge></Fragment>;
	}

	return htmlMsg;
}

class UserProfileBasicInfoBlk extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : false,
            username : ''
        }
    }
    componentWillMount() {
		this.props.getProfileByID();
    }
    
    onUserSignUp() {
        this.props.changeUsername(this.props.darkMode);
      }
    

	componentWillReceiveProps(nextProps) {
        // console.log('Next : ',nextProps);
        this.setState({ loading : nextProps.loading });
		if(Object.keys(nextProps.profileData).length > 0 && nextProps.profileData.ReturnCode === 0) {
            var userData = nextProps.profileData.UserData;
			const userName = userData.Email !== '' && userData.Email !== null ? userData.Email : userData.Username;
			this.setState({ username : userName });
		}
    }
    
    render() {
        const { username, loading } = this.state;
        return (
            <Fragment>
                {
                    loading
                    ?
                    <div className="text-center py-40">
                        <CircularProgress className="progress-primary" thickness={2} />
                    </div>
                    :
                    <div className="media profilesection">
                        <div className="media-left"><i className="font-4x material-icons mr-10 mt-15">account_circle</i></div>
                        <div className="media-body pb-20">
                            <p>
                                <span className="mr-30">{username}</span>
                                <span className="levelcolor font-weight-bold"><IntlMessages id="my_account.level1" /></span>
                            </p>
                            <p><KYCStatus kycStatusId={this.props.KYCStatus} /></p>
                            <p>
                                <span className="mr-10"><IntlMessages id="my_account.lastLoginTime" /> : 2018-06-07 10:08:00</span>
                                <span><IntlMessages id="my_account.IP" /> : 45.116.123.43</span>
                            </p>
                            <p><IntlMessages id="my_account.usingPayFeesInfo" /></p>
                        </div>
                    </div>
                }
            </Fragment>
        )
    }
}

const mapStateToProps = ({ editProfileRdcer , settings }) => {
	const response = {
        profileData : editProfileRdcer.data,
        loading : editProfileRdcer.loading,
        darkMode : settings.darkMode
	}
	return response;
}

export default connect(mapStateToProps, {
	getProfileByID
})(UserProfileBasicInfoBlk);
