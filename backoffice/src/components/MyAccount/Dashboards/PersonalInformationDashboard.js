/* 
    Developer : Kevin Ladani
    Date : 24-11-2018
    File Comment : Personal Information Dashboard View
*/
import React, { Component } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Label, Form, FormGroup, Input, Button } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import { DashboardPageTitle } from './DashboardPageTitle';
import { getPersonalInfoData, editPersonalInfoData } from "Actions/MyAccount";
import validatePersonalInformationDashboard from "Validations/MyAccount/personal_information_dashboard"
import {
	getMenuPermissionByID
} from 'Actions/MyAccount';
class PersonalInformationDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				FirstName: '',
				LastName: '',
				Email: '',
				MobileNo: '',
				Username: '',
				isEmailConfirmed: true,
			},
			get_info: 'hide',
			loading: false,
			errors: {},
			drawerClose: false,
			fieldList: {},
			Ntf_flag: true,
			menudetail: [],
			menuLoading: false,
			notificationFlag: true,
		};
	}

	componentWillMount() {
		this.props.getMenuPermissionByID('A209CE11-65EC-76B8-5C45-F7ABB3121F85');
	}

	closeAll = () => {
		this.props.closeAll();
		this.setState({ open: false });
	}

	onChange = (event) => {
		let newObj = Object.assign({}, this.state.data);
		newObj[event.target.name] = event.target.value;
		this.setState({ data: newObj });
	}

	noCancle = () => {
		this.props.drawerClose();
		this.setState({ errors: {} });
	}

	onSubmit = (event) => {
		event.preventDefault();

		let profileObj = {
			FirstName: this.state.data.FirstName,
			LastName: this.state.data.LastName
		}
		const { errors, isValid } = validatePersonalInformationDashboard(profileObj);
		this.setState({ errors: errors, get_info: 'show' });

		if (isValid) {
			this.setState({ drawerClose: true })
			this.props.editPersonalInfoData(profileObj);
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });

		if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
				this.props.getPersonalInfoData();
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				this.setState({ notificationFlag: false });
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				this.props.drawerClose();
			}
		}

		if (this.state.Ntf_flag && (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9)) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			NotificationManager.error(errMsg)
			this.setState({ Ntf_flag: false })
		} else if (nextProps.data.statusCode === 200) {
			let userData = nextProps.data.UserData;
			this.setState({
				data: {
					FirstName: userData.FirstName !== 'null' ? userData.FirstName : '',
					LastName: userData.LastName !== 'null' ? userData.LastName : '',
					Email: userData.Email !== 'null' ? userData.Email : '',
					MobileNo: userData.MobileNo !== 'null' ? userData.MobileNo : '',
					Username: userData.Username !== 'null' ? userData.Username : ''
				}
			});
			if (this.state.drawerClose) {
				this.props.drawerClose();
				this.setState({ drawerClose: false })
			}
		}
	}

	OnSave() {
		const { errors, isValid } = validatePersonalInformationDashboard(this.state);
		const { firstName, lastName, userName, emailId, country, language, gender } = this.state;
		this.setState({ errors: errors });
		if (isValid) {
			this.props.editPersonalInfoData({ firstName, lastName, userName, emailId, country, language, gender });
		}
	}
	/* check menu permission */
	checkAndGetMenuAccessDetail(GUID) {
		var response = {};
		var index;
		const { menudetail } = this.state;
		if (menudetail.length) {
			for (index in menudetail) {
				if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase()) {
					if (menudetail[index].Fields && menudetail[index].Fields.length) {
						var fieldList = {};
						menudetail[index].Fields.forEach(function (item) {
							fieldList[item.GUID] = item;
						});
						return response = fieldList;
					}
				}
			}
		} else {
			return response;
		}
	}
	render() {
		const { drawerClose } = this.props;
		const { FirstName, LastName, Email, MobileNo, Username } = this.state.data;
		const { loading, errors } = this.state;
        var menuDetail = this.checkAndGetMenuAccessDetail('fd8f079a-7ab0-a44a-5f53-af4d4f8e8e84');
        if (!menuDetail) {
            menuDetail = { Utility: [], CrudOption: [] }
        }
		return (
			<div className="jbs-page-content">
				<DashboardPageTitle title={<IntlMessages id="my_account.PersonalInformation" />} drawerClose={drawerClose} closeAll={this.closeAll} />
				{(this.state.menuLoading || loading) && <JbsSectionLoader />}
				<Form>
					{(menuDetail["bf7ca4a7-3d94-2adc-2afe-57c67d019480"] && menuDetail["bf7ca4a7-3d94-2adc-2afe-57c67d019480"].Visibility === "E925F86B") && //BF7CA4A7-3D94-2ADC-2AFE-57C67D019480
						<FormGroup className="row">
							<Label for="FirstName" className="control-label col"><IntlMessages id="my_account.editProfile.firstName" /><span className="text-danger">*</span></Label>
							<div className="col-md-8 col-sm-8 col-xs-12">
								<IntlMessages id="myaccount.enterFirstName">
									{(placeholder) =>
										<Input disabled={(menuDetail["bf7ca4a7-3d94-2adc-2afe-57c67d019480"].AccessRight === "11E6E7B0") ? true : false} type="text" tabIndex="1" name="FirstName" value={FirstName} id="FirstName" placeholder={placeholder} onChange={this.onChange} />
									}
								</IntlMessages>
								{errors.FirstName && <div className="text-danger text-left"><IntlMessages id={errors.FirstName} /></div>}
							</div>
						</FormGroup>
					}
					{(menuDetail["40ce518f-74d0-1a8f-1288-27b1c21c4a87"] && menuDetail["40ce518f-74d0-1a8f-1288-27b1c21c4a87"].Visibility === "E925F86B") && //40CE518F-74D0-1A8F-1288-27B1C21C4A87F
						<FormGroup className="row">
							<Label for="LastName" className="control-label col"><IntlMessages id="my_account.editProfile.lastName" /><span className="text-danger">*</span></Label>
							<div className="col-md-8 col-sm-8 col-xs-12">
								<IntlMessages id="myaccount.enterLastName">
									{(placeholder) =>
										<Input disabled={(menuDetail["40ce518f-74d0-1a8f-1288-27b1c21c4a87"].AccessRight === "11E6E7B0") ? true : false} type="text" tabIndex="2" name="LastName" value={LastName} id="LastName" placeholder={placeholder} onChange={this.onChange} />
									}
								</IntlMessages>
								{errors.LastName && <div className="text-danger text-left"><IntlMessages id={errors.LastName} /></div>}
							</div>
						</FormGroup>
					}
					{(menuDetail["1ee71463-24b1-4d30-079a-914d65173858"] && menuDetail["1ee71463-24b1-4d30-079a-914d65173858"].Visibility === "E925F86B") && //1EE71463-24B1-4D30-079A-914D65173858
						<FormGroup className="row">
							<Label for="Username" className="control-label col"><IntlMessages id="my_account.editProfile.username" /></Label>
							<div className="col-md-8 col-sm-8 col-xs-12">
								<Label className="control-label">{Username}</Label>
							</div>
						</FormGroup>
					}
					{(menuDetail["5d042ff6-3b3e-0710-5fb0-840e521f4c1c"] && menuDetail["5d042ff6-3b3e-0710-5fb0-840e521f4c1c"].Visibility === "E925F86B") && //5D042FF6-3B3E-0710-5FB0-840E521F4C1C
						Email && <FormGroup className="row">
							<Label for="Email" className="control-label col"><IntlMessages id="my_account.editProfile.email" /></Label>
							<div className="col-md-8 col-sm-8 col-xs-12">
								<Label className="control-label">{Email}</Label>
							</div>
						</FormGroup>
					}
					{(menuDetail["e1486799-3bcc-a159-685a-6b872e932c96"] && menuDetail["e1486799-3bcc-a159-685a-6b872e932c96"].Visibility === "E925F86B") && //E1486799-3BCC-A159-685A-6B872E932C96
						MobileNo && <FormGroup className="row">
							<Label for="MobileNo" className="control-label col"><IntlMessages id="sidebar.mobileNumber" /></Label>
							<div className="col-md-8 col-sm-8 col-xs-12">
								<Label className="control-label">{MobileNo}</Label>
							</div>
						</FormGroup>}
					{menuDetail &&
						<FormGroup row>
							<div className="offset-md-4 col-md-8 offset-sm-4 col-sm-8 col-xs-12">
								<div className="btn_area">
									<Button disabled={loading} type="submit" color="primary" variant="raised" onClick={this.onSubmit}><IntlMessages id="sidebar.btnUpdate" /></Button>
									<Button color="danger" variant="raised" className="ml-15" onClick={this.noCancle}><IntlMessages id="sidebar.btnCancel" /></Button>
								</div>
							</div>
						</FormGroup>
					}
				</Form>
			</div >
		)
	}
}

const mapToProps = ({ personalDashboard, authTokenRdcer }) => {
	const { data, loading } = personalDashboard;
	const {
		menuLoading,
		menu_rights
	} = authTokenRdcer;
	return {
		data, loading, menuLoading,
		menu_rights
	};
}

export default connect(mapToProps, {
	getPersonalInfoData,
	editPersonalInfoData,
	getMenuPermissionByID
})(PersonalInformationDashboard);