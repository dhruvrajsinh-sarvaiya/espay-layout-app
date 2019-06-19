/* 
    Developer : Salim Deraiya
    Date : 22-01-2019
    UpdatedBy : Salim Deraiya (22-01-2019)..
    File Comment : Follower List Component
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import MUIDataTable from "mui-datatables";
import {  Alert } from 'reactstrap';
// intl messages
import IntlMessages from 'Util/IntlMessages';
//Import Referral Friends Actions...
import { getFollowerList } from 'Actions/SocialProfile';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
//change date formate from the helper.js
import { changeDateFormat } from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';

//Table Object...
const columns = [
	{
        name: <IntlMessages id="sidebar.colHash" />,
		options: {
			filter: false,
			sort: false
		}
	},
	{
		name: <IntlMessages id="sidebar.colUserName" />,
		options: {
			filter: false,
			sort: true
		}
	},
	{
		name: <IntlMessages id="sidebar.colMobile" />,
		options: {
			filter: false,
			sort: true
		}
	},
	{
		name: <IntlMessages id="sidebar.colTradeType" />,
		options: {
			filter: false,
			sort: true
		}
    },
	{
		name: <IntlMessages id="sidebar.colTradePercentage" />,
		options: {
			filter: false,
			sort: true
		}
	},

];
const options = {
    filterType: "select",
	responsive: "scroll",
	selectableRows: false,
    resizableColumns: false,
    viewColumns: false,
	filter: false,
	download: false,
	textLabels: {
		body: {
			noMatch: <IntlMessages id="wallet.emptyTable" />,
			toolTip: <IntlMessages id="wallet.sort" />,
		}
	},
	downloadOptions : {
		filename: 'FOLLOWER_LIST_'+changeDateFormat(new Date(),'YYYY-MM-DD')+'.csv'
	}
};

class FollowerListDataTbl extends Component {
    constructor(props) {
		super(props);
		this.state = {
			list : [],
			err_msg: '',
			err_alert: true,
			success_msg: '',
			success_alert: true,
			loading : false,
			PageIndex : 0,
			Page_Size : AppConfig.totalRecordDisplayInList
		};

		this.onDismiss = this.onDismiss.bind(this);
	}

	onDismiss() {
		this.setState({ err_alert: false, success_alert: false });
	}

	followerList() {
		const reqObj = {
			PageIndex : this.state.PageIndex,
			Page_Size : this.state.Page_Size
        }
		this.props.getFollowerList(reqObj);
	}

	componentWillMount() {
        this.followerList();
	}
    
    componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });
		
        if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode===9) {
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            this.setState({ err_alert: true, err_msg: errMsg });
		} else if(Object.keys(nextProps.data).length > 0 && (typeof(nextProps.data.FollowerList) !== 'undefined' || nextProps.data.FollowerList.length > 0)) {
            this.setState({ 
                success_msg: nextProps.data.ReturnMsg, 
                success_alert: true,
				list : nextProps.data.FollowerList
			});
        }
	}

	render() {
		const { list, err_alert, err_msg, loading } = this.state;
		return (
			<Fragment>
				<div className="StackingHistory statusbtn-comm">
                {err_msg && <div className="alert_area">
                    <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}>{err_msg}</Alert>
                </div>}
                {loading && <JbsSectionLoader />}
                <MUIDataTable title={<IntlMessages id="sidebar.followerList" />} columns={columns} options={options}
                    data={list.map((item, key) => {
                        return [                            
                            key + 1,
                            item.UserName,
                            item.Mobile,
                            <Fragment>
                                {item.ConfigKey === 'Can_Copy_Trade' ? <IntlMessages id="sidebar.copy" /> : <IntlMessages id="sidebar.mirror" /> }
                            </Fragment>,
                            item.TradePercentage                            
                        ];
                    })}
                />
				</div>
            </Fragment>
		);
	}
}

const mapStateToProps = ({ socialProfileRdcer , settings}) => {
	var response = {
		darkMode : settings.darkMode,
		data : socialProfileRdcer.getFollowerList,
		loading : socialProfileRdcer.loading
	}

	return response;
}

export default connect(mapStateToProps,{
	getFollowerList
}) (FollowerListDataTbl);