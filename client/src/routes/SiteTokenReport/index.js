// Report for Site Token Conversion History  11/2/2019

// import React and component, fragment 
import React, { Component, Fragment } from 'react';

// import for connect store
import { connect } from 'react-redux';

// import for set as a design 
import { Form, Label, Input, Row, Col } from 'reactstrap';

// import button
import Button from '@material-ui/core/Button';
 
// import neccessary actions for fetch records
import {
	getSiteTokenReportList	
} from 'Actions/SiteTokenReport';

// display mui data table 
import MUIDataTable from "mui-datatables";

// used for display notifications
import { NotificationManager } from 'react-notifications';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// import section loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

// jbs card box
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

// intl messages means convert text into selected languages
import IntlMessages from 'Util/IntlMessages';

// for cinvert language object into string
import {injectIntl} from 'react-intl';

// change date format
import { changeDateFormat } from "Helpers/helpers";

// define Site token history component
class SiteTokenReport extends Component {

	// make default state values on load
	constructor(props) {
		super();
		this.state = {			
            siteTokenHistory:[],
            getSiteToken:0
		}
	}

    // invoke after render component
	componentDidMount() {
        this.setState({
            getSiteToken:1
        })
		this.props.getSiteTokenReportList({})
	}
	
// Invoke when component will about to recieve props
	componentWillReceiveProps(nextprops) {

		if(this.state.getSiteToken && nextprops.siteTokenHistory.length !==0 ){
			this.setState({
				getSiteToken: 0,
				siteTokenHistory:nextprops.siteTokenHistory
			})
        } 
        if(nextprops.siteTokenHistory.length == 0 && this.state.getSiteToken && nextprops.errorCode == 4501 ){        
			NotificationManager.error(<IntlMessages id="error.trading.transaction.4501" />);
			this.setState({
				getSiteToken: 0,
				siteTokenHistory:[]
			})
		}
	}

	render() {

		const intl = this.props.intl;

		const data = this.state.siteTokenHistory ? this.state.siteTokenHistory : [];

		// define options for data tables
		const options = {
			filterType: 'dropdown',
			responsive: 'scroll',
			selectableRows: false,
			filter: false,
			download: true,
			textLabels: {
                body: {
                    noMatch: intl.formatMessage({id:"wallet.emptyTable"}),
                    toolTip: intl.formatMessage({id:"wallet.sort"})
                }
            },
			downloadOptions : {
				filename: 'Site_Token_'+changeDateFormat(new Date(),'YYYY-MM-DD')+'.csv'
			}
        };	
        	
	// define columns for data tables
	const columns = [
		{
			name: intl.formatMessage({id:"myaccount.tradeSummaryColumn.id"}),
		},
		{
			name: intl.formatMessage({id:"sidebar.siteTokenReport.walletcurrency"})
		},
		{
			name: intl.formatMessage({id:"sidebar.siteTokenReport.tocurrency"})
		},
		{
			name: intl.formatMessage({id:"sidebar.siteTokenReport.srcqty"})
		}, 

		 {
			name: intl.formatMessage({id:"sidebar.siteTokenReport.targetqty"})
        },        
        {
            name: intl.formatMessage({ id: "sidebar.siteTokenReport.tokenprice" })
        },
        {
			name: intl.formatMessage({id:"sidebar.openOrders.tableHeading.date"})
		}
    ]
   
		return (
			<Fragment>
				{this.props.loading &&
					<JbsSectionLoader />
				}

				<div className="charts-widgets-wrapper">
					<PageTitleBar title={<IntlMessages id="sidebar.siteToken" />} match={this.props.match} />
					<div className="transaction-history-detail tbl_overflow_auto">						
						{ data.length > 0 &&
						<MUIDataTable
                        title={<IntlMessages id="sidebar.siteTokenReport" />}							
							data={data.map((item,key) => {
                                return [
                                    key + 1,
                                    item.SourceCurrency,
                                    item.TargerCurrency,
                                    item.SourceCurrencyQty.toFixed(8),
                                    item.TargetCurrencyQty,                                    
                                    item.TokenPrice.toFixed(8),                                        
                                    item.TrnDate.replace('T', ' ').split('.')[0]
                                ];
                            })}
							columns={columns}
							options={options}
						/> }
					</div>
				</div>

			</Fragment>
		);
	}
}

// map states to props when changed in states from reducer
const mapStateToProps = ({ siteTokenReport }) => {
	const { siteTokenHistory, loading, errorCode } = siteTokenReport;	
	return { siteTokenHistory, loading, errorCode }
}

// export this component with action methods and props
export default connect(mapStateToProps, {getSiteTokenReportList })(injectIntl(SiteTokenReport));
