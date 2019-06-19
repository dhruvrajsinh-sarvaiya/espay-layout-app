/* 
    Developer : Kevin Ladani
    Date : 13-12-2018
    File Comment : Follower Profile Configuration Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { FormGroup, Form, Input, Label, Button } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; //added by Bharat Jograna for Loader and NotificationManager
import { NotificationManager } from "react-notifications"; //added by Bharat Jograna for Loader and NotificationManager
import { getDeviceInfo, getIPAddress, getHostName, getMode } from "Helpers/helpers";
import { getFollowerTradingPolicy, editFollowerTradingPolicy } from "Actions/SocialProfile";
import validateFollowerProfileForm from "Validations/SocialProfile/follower_profile"
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
class FollowerProfileWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				Can_Copy_Trade: "",
				Can_Mirror_Trade: "",
				Maximum_Number_of_Leaders_to_Allow_Follow: "",
				Can_Add_Leader_to_Watchlist: "",
				Max_Number_of_Leader_to_Allow_in_Watchlist: ""
			},
			loading: false,
			errors: {},
			fieldList: {},
			Ntf_flage: true,
			menudetail: [],
			menuLoading:false,
			notificationFlag:true,
		};
	}

	componentWillMount() {
		this.props.getMenuPermissionByID('A2C4CBBA-159B-3AF9-2EE6-5E45B7D096A9'); 
	}

	cancelData = () => {
		this.props.drawerClose();
		this.setState({ errors: {},menudetail:this.state.menudetail })
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
				this.props.getFollowerTradingPolicy();
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
		}
		if (this.state.Ntf_flage && (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9)) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			NotificationManager.error(errMsg)
			this.setState({ Ntf_flage: false })
		} else if (this.state.Ntf_flage && nextProps.data.ReturnCode === 0) {
			if (typeof nextProps.data.FollowerAdminPolicy !== 'undefined' && Object.keys(nextProps.data.FollowerAdminPolicy).length > 0) {
				this.setState({ data: nextProps.data.FollowerAdminPolicy });
			} else {
				NotificationManager.success(nextProps.data.ReturnMsg)
				this.setState({ Ntf_flage: false });
				this.props.drawerClose();
			}
		}
	}

	onChange = (event) => {
		let newObj = Object.assign({}, this.state.data);
		newObj[event.target.name] = event.target.value;
		this.setState({ data: newObj });
	}

	updateData = (event) => {
		event.preventDefault();
		const { errors, isValid } = validateFollowerProfileForm(this.state.data);
		this.setState({ err_alert: false, errors: errors });

		if (isValid) {
			var reqObj = Object.assign({}, this.state.data);
			delete reqObj.UpdatedDate;
			delete reqObj.UserName;

			reqObj.deviceId = getDeviceInfo();
			reqObj.mode = getMode();
			reqObj.hostName = getHostName();

			let self = this;
			getIPAddress().then(function (ipAddress) {
				reqObj.IPAddress = ipAddress;
				self.props.editFollowerTradingPolicy(reqObj);
			});
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
                            fieldList[item.GUID.toUpperCase()] = item;
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
		const { loading, errors } = this.state;
		const { Can_Copy_Trade, Can_Mirror_Trade, Maximum_Number_of_Leaders_to_Allow_Follow, Can_Add_Leader_to_Watchlist, Max_Number_of_Leader_to_Allow_in_Watchlist, modifiedBy } = this.state.data;
		var menuDetail = this.checkAndGetMenuAccessDetail('d5d9381e-2de2-7f18-4916-743f5ba51250');
        if (!menuDetail) {
            menuDetail = { Utility: [], CrudOption: [] }
        }
		return (
			<div className="FollowerForm">
				<Form className="tradefrm">
					<Fragment>
					{(this.state.menuLoading || loading) && <JbsSectionLoader />}
						<Fragment>
							<Form>
							{menuDetail && this.props.topButton &&
									<FormGroup className="mb-20 mt-20">
										<div className="socialUpdateBtn text-right">
											<Button variant="raised" color="primary" onClick={this.updateData}><IntlMessages id="button.update" /></Button>
										</div>
									</FormGroup>}
									{(menuDetail["20FD798D-8569-0D9B-6191-75563BCB436F"] && menuDetail["20FD798D-8569-0D9B-6191-75563BCB436F"].AccessRight) && //20FD798D-8569-0D9B-6191-75563BCB436F
									<FormGroup row className="mb-20">
										<Label for="Can_Copy_Trade" className="control-label col" ><IntlMessages id="socialProfile.canCopyTrade" /><span className="text-danger">*</span></Label>
										<div className="col-md-7 col-sm-7 col-xs-12">
											<Input disabled={(menuDetail["20FD798D-8569-0D9B-6191-75563BCB436F"].AccessRight === "6AB0714D") ? true : false} type="select" name="Can_Copy_Trade" value={Can_Copy_Trade} id="Can_Copy_Trade" onChange={this.onChange}>
												<IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
												<IntlMessages id="sidebar.yes">{(yes) => <option value="1">{yes}</option>}</IntlMessages>
												<IntlMessages id="sidebar.no">{(no) => <option value="2">{no}</option>}</IntlMessages>
											</Input>
											{errors.Can_Copy_Trade && (<span className="text-danger text-left"><IntlMessages id={errors.Can_Copy_Trade} /></span>)}
										</div>
									</FormGroup>
								}
								{(menuDetail["91ECA50E-66CE-4FFB-228A-B8BAAB92171C"] && menuDetail["91ECA50E-66CE-4FFB-228A-B8BAAB92171C"].Visibility === "E925F86B") && //91ECA50E-66CE-4FFB-228A-B8BAAB92171C
									<FormGroup row className="mb-20">
										<Label for="Can_Mirror_Trade" className="control-label col" ><IntlMessages id="socialProfile.canMirrorTrade" /><span className="text-danger">*</span></Label>
										<div className="col-md-7 col-sm-7 col-xs-12">
											<Input disabled={(menuDetail["91ECA50E-66CE-4FFB-228A-B8BAAB92171C"].AccessRight === "6AB0714D") ? true : false} type="select" name="Can_Mirror_Trade" value={Can_Mirror_Trade} id="Can_Mirror_Trade" onChange={this.onChange}>
												<IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
												<IntlMessages id="sidebar.yes">{(yes) => <option value="1">{yes}</option>}</IntlMessages>
												<IntlMessages id="sidebar.no">{(no) => <option value="2">{no}</option>}</IntlMessages>
											</Input>
											{errors.Can_Mirror_Trade && (<span className="text-danger text-left"><IntlMessages id={errors.Can_Mirror_Trade} /></span>)}
										</div>
									</FormGroup>
								}
								{(menuDetail["D03EE03A-95BF-77FF-4C22-0897C1A21D0E"] && menuDetail["D03EE03A-95BF-77FF-4C22-0897C1A21D0E"].AccessRight) && //D03EE03A-95BF-77FF-4C22-0897C1A21D0E
									<FormGroup row className="mb-20">
										<Label for="Maximum_Number_of_Leaders_to_Allow_Follow" className="control-label col" ><IntlMessages id="socialProfile.maxLeadersAllow" /><span className="text-danger">*</span></Label>
										<div className="col-md-7 col-sm-7 col-xs-12">
											<IntlMessages id="socialProfile.enterMaxLeadersAllow">
												{(placeholder) =>
													<Input disabled={(menuDetail["D03EE03A-95BF-77FF-4C22-0897C1A21D0E"].AccessRight === "6AB0714D") ? true : false} type="text" name="Maximum_Number_of_Leaders_to_Allow_Follow" value={Maximum_Number_of_Leaders_to_Allow_Follow} placeholder={placeholder} id="Maximum_Number_of_Leaders_to_Allow_Follow" onChange={this.onChange} />
												}
											</IntlMessages>
											{errors.Maximum_Number_of_Leaders_to_Allow_Follow && (<span className="text-danger text-left"><IntlMessages id={errors.Maximum_Number_of_Leaders_to_Allow_Follow} /></span>)}
										</div>
									</FormGroup>
								}
								{(menuDetail["450D54C5-4576-97F7-6E4E-B5BF05676526"] && menuDetail["450D54C5-4576-97F7-6E4E-B5BF05676526"].AccessRight) && //450D54C5-4576-97F7-6E4E-B5BF05676526
									<FormGroup row className="mb-20">
										<Label for="Can_Add_Leader_to_Watchlist" className="control-label col" ><IntlMessages id="socialProfile.addPairWatchList" /><span className="text-danger">*</span></Label>
										<div className="col-md-7 col-sm-7 col-xs-12">
											<Input disabled={(menuDetail["450D54C5-4576-97F7-6E4E-B5BF05676526"].AccessRight === "6AB0714D") ? true : false} type="select" name="Can_Add_Leader_to_Watchlist" value={Can_Add_Leader_to_Watchlist} id="Can_Add_Leader_to_Watchlist" onChange={this.onChange}>
												<IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
												<IntlMessages id="sidebar.yes">{(yes) => <option value="1">{yes}</option>}</IntlMessages>
												<IntlMessages id="sidebar.no">{(no) => <option value="2">{no}</option>}</IntlMessages>
											</Input>
											{errors.Can_Add_Leader_to_Watchlist && (<span className="text-danger text-left"><IntlMessages id={errors.Can_Add_Leader_to_Watchlist} /></span>)}
										</div>
									</FormGroup>
								}
									{(menuDetail["CEF2B846-A7BF-757C-06E1-38FF64611F1C"] && menuDetail["CEF2B846-A7BF-757C-06E1-38FF64611F1C"].AccessRight) && //CEF2B846-A7BF-757C-06E1-38FF64611F1C
									<FormGroup row className="mb-20">
										<Label for="Max_Number_of_Leader_to_Allow_in_Watchlist" className="control-label col" ><IntlMessages id="socialProfile.maxPairAllowToWatchlist" /><span className="text-danger">*</span></Label>
										<div className="col-md-7 col-sm-7 col-xs-12">
											<IntlMessages id="socialProfile.enterMaxPairAllowToWatchlist">
												{(placeholder) =>
													<Input disabled={(menuDetail["CEF2B846-A7BF-757C-06E1-38FF64611F1C"].AccessRight === "6AB0714D") ? true : false} type="text" name="Max_Number_of_Leader_to_Allow_in_Watchlist" value={Max_Number_of_Leader_to_Allow_in_Watchlist} placeholder={placeholder} id="Max_Number_of_Leader_to_Allow_in_Watchlist" onChange={this.onChange} />
												}
											</IntlMessages>
											{errors.Max_Number_of_Leader_to_Allow_in_Watchlist && (<span className="text-danger text-left"><IntlMessages id={errors.Max_Number_of_Leader_to_Allow_in_Watchlist} /></span>)}
										</div>
									</FormGroup>
								}
									{menuDetail && !this.props.topButton &&
									<FormGroup row>
										<div className="offset-md-5 col-md-7 offset-sm-5 col-sm-7 col-xs-12">
											<div className="btn_area">
												<Button variant="raised" color="primary" onClick={this.updateData}><IntlMessages id="button.update" /></Button>
												<Button variant="raised" color="danger" className="ml-15" onClick={this.cancelData}><IntlMessages id="button.cancel" /></Button>
											</div>
										</div>
									</FormGroup>}
							</Form>
						</Fragment>
					</Fragment>
				</Form>
			</div>
		);
	}
}

FollowerProfileWdgt.defaultProps = {
	topButton: true
}

//map state to props
const mapStateToProps = ({ socialTradingPolicy,authTokenRdcer }) => {
	var response = {
		data: socialTradingPolicy.followerData,
		loading: socialTradingPolicy.followerLoading,
		menuLoading:authTokenRdcer.menuLoading,
        menu_rights:authTokenRdcer.menu_rights
	};
	return response;
};

export default connect(mapStateToProps, {
	getFollowerTradingPolicy,
	editFollowerTradingPolicy,
	getMenuPermissionByID
})(FollowerProfileWdgt);