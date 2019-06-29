/**
 * Auther : Salim Deraiya
 * Created : 05/02/2019
 * Watch Group List
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import {
	getWatchlist,
	addWatchlistGroup,
	addWatchlist,
	removeWatchlist
 } from 'Actions/SocialProfile';
 import {
	getDeviceInfo,
    getIPAddress,
    getHostName,
    getMode
} from "Helpers/helpers";
 const validateLeaderProfileConfigForm = require("../../../validation/SocialProfile/leader_profile_configuration");

class WatchListWdg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultWatchlist : [],
            selLeaderGrpIds : [],
			anchorEl: null,
			watchDialog: false,
			groupName: '',
			loading : false,
        }
    }

    componentWillMount() {
		this.props.getWatchlist();
	}

    addToWatchlist(GroupId) {
		this.closeWatchDialog();
		var watchObj = {
			GroupId: GroupId,
			LeaderId: this.state.selLeaderId,
			DeviceId: getDeviceInfo(),
			Mode: getMode(),
			HostName: getHostName()
		}

		let self = this;
		getIPAddress().then(function (ipAddress) {
			watchObj.IPAddress = ipAddress;
			self.props.addWatchlist(watchObj);
			self.setState({ refLdrList : true });
		});
	}

	removeToWatchlist(GroupId) {
		this.closeWatchDialog();
		var delWatchObj = {
			GroupId: GroupId,
			LeaderId: this.state.selLeaderId,
			DeviceId: getDeviceInfo(),
			Mode: getMode(),
			HostName: getHostName()
		}

		let self = this;
		getIPAddress().then(function (ipAddress) {
			delWatchObj.IPAddress = ipAddress;
			self.props.removeWatchlist(delWatchObj);
			self.setState({ refLdrList : true });
		});
	}

	openWatchDialog() {
		this.setState({ anchorEl: null });
		this.setState({ watchDialog : true });
	}
	
	closeWatchDialog() {
		this.setState({ watchDialog : false });
		this.handleClose();
	}

	addNewWatchlist() {
		event.preventDefault();
        const { errors, isValid } = validateLeaderProfileConfigForm({ groupName :this.state.groupName });
		this.setState({ errors: errors });		

        if (isValid) {
			var addGrpWatchObj = {
				GroupName: this.state.groupName,
				DeviceId: getDeviceInfo(),
				Mode: getMode(),
				HostName: getHostName()
			}

			let self = this;
			getIPAddress().then(function (ipAddress) {
				addGrpWatchObj.IPAddress = ipAddress;
				self.props.addWatchlistGroup(addGrpWatchObj);
				self.setState({ refLdrList : true });
			});
		}
    }

    handleClose() {
		this.setState({ anchorEl: null, selLeaderId : '' });
	};

	handleClick(event, LeaderId, LeaderGrpIds) {
		this.setState({ anchorEl: event.currentTarget, selLeaderId : LeaderId, selLeaderGrpIds : LeaderGrpIds });
	};

    handleChange(event) {
		this.setState({ groupName: event.target.value });
	};
    
    componentWillReceiveProps(nextProps) {
		// console.log('Next props :',nextProps.watchList);
		this.setState({ loading: nextProps.loading });

		//Get Watch list
		if(nextProps.watchList.hasOwnProperty('GroupList') && nextProps.watchList.GroupList.length > 0) {
			this.setState({ defaultWatchlist : nextProps.watchList.GroupList });
		}		
		
		if (nextProps.data.ReturnCode === 1) {
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			NotificationManager.error(errMsg);
		} else if (nextProps.data.ReturnCode === 0) {
			NotificationManager.success(nextProps.data.ReturnMsg);
			if(this.state.refLdrList) {
				this.setState({ refLdrList : false });
				this.closeWatchDialog();
			}			
		}
	}

    render() {
		const { selLeaderGrpIds, groupName, defaultWatchlist, anchorEl, watchDialog,  errors, loading } = this.state;
		return (
			<Fragment>                    
				{loading && <JbsSectionLoader />}
				<Fragment>
					<div className="f_area">
						<Checkbox checked={this.state.selectedIDs.length ? true : false} onChange={e => this.onSelectAllAddresses(e)} value="all" color="primary" />
						<Button size="small" className={ this.state.selectedIDs.length ? "my-10 mr-10" : "disabled my-10 mr-10" } color="primary" onClick={() => this.onFollowToLeader()}><IntlMessages id="sidebar.btnbulkFollow" /></Button>
						<Button size="small" className={ this.state.selectedIDs.length ? "my-10 mr-10" : "disabled my-10 mr-10" } color="primary" onClick={() => this.onUnfollowToLeader()}><IntlMessages id="sidebar.btnbulkUnfollow" /></Button>
					</div>
					<div id="scl_ldr_lst">
						<MUIDataTable title={<IntlMessages id="sidebar.leaderList" />} columns={columns} options={options}
							data={list.map((item, key) => {
								return [
									<Checkbox style={{width:'auto'}} checked={ this.state.selectedIDs.indexOf(item.LeaderId) >= 0 ? true : false } onChange={e =>this.onSelectAddress(e, item.LeaderId)} color="primary" />,
									// key + 1,
									item.LeaderName,
									item.NoOfFollowerFollow,
									item.UserDefaultVisible,
									<Fragment>
										{item.IsFollow ? <Badge color="success"><IntlMessages id="sidebar.yes" /></Badge> : <Badge color="danger"><IntlMessages id="sidebar.no" /></Badge> }
									</Fragment>,
									<Fragment>
										{item.IsWatcher ? <Badge color="success"><IntlMessages id="sidebar.yes" /></Badge> : <Badge color="danger"><IntlMessages id="sidebar.no" /></Badge> }
									</Fragment>,
									<Fragment>
										<Link className="text-primary" to={{pathname: "/app/social-profile/follower-profile-configuration", state : { LeaderId : item.LeaderId, type : 'single' }}}><i className="zmdi zmdi-settings zmdi-hc-2x"></i></Link>
										{ item.IsFollow && <a href="javascript:void(0)" className="ml-10 text-danger" onClick={() => this.onUnfollowToLeader(item.LeaderId)}><i className="zmdi zmdi-thumb-down zmdi-hc-2x" /></a> }											
										{ item.IsWatcher 
											? <IconButton aria-owns={anchorEl ? 'long-menu' : null} aria-haspopup="true" className="ml-10 text-warning ldbtn" onClick={(e) => this.handleClick(e,item.LeaderId,item.GroupId)}><i className="zmdi zmdi-check-circle zmdi-hc-2x" /></IconButton>
											: <IconButton aria-owns={anchorEl ? 'long-menu' : null} aria-haspopup="true" className="ml-10 text-success ldbtn" onClick={(e) => this.handleClick(e,item.LeaderId,item.GroupId)}><i className="zmdi zmdi-plus-circle zmdi-hc-2x" /></IconButton>
										}
									</Fragment>
								];
							})}
						/>
						{ defaultWatchlist.length > 0 &&
							<Menu id="long-menu" className="wtc_list" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose} >
								{ 	defaultWatchlist.map((wlst,index) => 
										// ( selLeaderGrpIds.findIndex(selLeaderGrpId => (selLeaderGrpId === wlst.Id))
										(selLeaderGrpIds.indexOf(wlst.Id) !== -1
											? <MenuItem key={index} className="wtc_true" onClick={() => this.removeToWatchlist(wlst.Id,selLeaderId)}>{wlst.GroupName+' '+wlst.Id}</MenuItem>
											: <MenuItem key={index} onClick={() => this.addToWatchlist(wlst.Id,selLeaderId)}>{wlst.GroupName+' '+wlst.Id}</MenuItem>
										)
									)
								}
								<MenuItem onClick={() => this.openWatchDialog()}><IntlMessages id="sidebar.addToNewList" /></MenuItem>
							</Menu>
						}
					</div>
				</Fragment>
				<Modal isOpen={watchDialog} className="watch_model modal-dialog-centered" toggle={() => this.closeWatchDialog()}>
					<a href="javascript:void(0)" className="btn_cls" onClick={() => this.closeWatchDialog()}><i className="zmdi zmdi-close zmdi-hc-2x" /></a>
					<ModalHeader><IntlMessages id="sidebar.createNewWatchlist" /></ModalHeader>
					<ModalBody>
						<div className="clearfix">
							<div className="watch_img">
								<img src={require('Assets/image/createlist.png')} alt={<IntlMessages id="sidebar.image" />} />
							</div>
							<div className="watch_cnt">
								<h2><IntlMessages id="sidebar.createNewWatchlistNote" /></h2>
								<IntlMessages id="sidebar.enterNewWatchListGrp">
									{(placeholder) =>
										<Input type="text" tabIndex="1" name="groupName" className="w-50" value={groupName} placeholder={placeholder} id="groupName" onChange={e => this.handleChange(e)} />
									}
								</IntlMessages>
								{errors.groupName && (<span className="text-danger text-left"><IntlMessages id={errors.groupName} /></span>)}
							</div>
						</div>							
						<Button variant="raised" tabIndex="2" type="submit" size="large" className="perverbtn" onClick={() => this.addNewWatchlist()}><IntlMessages id="sidebar.btnCreateNewList" /></Button>
					</ModalBody>
				</Modal>
            </Fragment>
		);
	}
}

// type checking props
WatchListWdg.defaultProps = {
    data: []
}

//MapStateToProps
const mapStateToProps = ({ socialProfileRdcer , settings}) => {
	var response = {
		darkMode : settings.darkMode,
		data : socialProfileRdcer.response,
		watchList : socialProfileRdcer.watchlst,
		watchGrpData : socialProfileRdcer.watchGrpData,
		loading : socialProfileRdcer.loading
	}

	return response;
}

export default connect(mapStateToProps,{
	getWatchlist,
	addWatchlistGroup,
	addWatchlist,
	removeWatchlist
}) (WatchListWdg);