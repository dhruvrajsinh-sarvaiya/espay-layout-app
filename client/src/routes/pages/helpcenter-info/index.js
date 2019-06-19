/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 09-01-2019
    UpdatedDate : 09-01-2019
	Description : Help Manual Module Page
	Todo: When Get one data in sert its not auto select
*/
import React, { Component,Fragment } from "react";
import { connect } from "react-redux";
import { Row, Col, Alert} from "reactstrap";
import CircularProgress from '@material-ui/core/CircularProgress';

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// intl messages
import IntlMessages from "Util/IntlMessages";
// jbs card box
import { JbsCard, JbsCardContent, JbsCardHeading } from 'Components/JbsCard';
import { TabProvider, Tab, TabPanel, TabList, Tabs } from "react-web-tabs";
import Divider from '@material-ui/core/Divider';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
// redux actions
import { getHelpManualById } from "Actions/HelpCenter";

import {Link} from 'react-router-dom';
//For Meta Tag and SEO Configuration
import Page from "Components/page";
//Components
import SearchHelps from './components/SearchHelp';
class HelpCenterInfo extends Component {
  
  	constructor(props) {
    	super(props);
		this.state = {
			helpmanualdetailsdata: [],
			loading: false, // loading activity
			errors : {},
			err_msg : "",
			err_alert : true,
			btn_disabled : false,
			module_locale : {},
			tabIndex: 0,
		};
		this.onDismiss = this.onDismiss.bind(this);
  	}
  	onDismiss() {
    	let err=delete  this.state.errors['message'];
    	this.setState({ err_alert: false, errors:err});
  	}
  	componentWillMount() {
		
		let helpmodule = this.props.location.state.data;
		if(typeof helpmodule !== 'undefined' && helpmodule._id != '') {
			this.props.getHelpManualById(helpmodule._id);
			this.setState({ module_locale : helpmodule.locale, searchHelpText:'' });
		} else {
			this.props.history.push('/app/pages/helpcenter');
		}
		
	}

  	componentWillReceiveProps(nextProps) {

		if(typeof nextProps.data != 'undefined' && (nextProps.data.responseCode === 9 || nextProps.data.responseCode === 1)) {
      		if(typeof nextProps.data.errors.message !='undefined' && nextProps.data.errors.message!='')
      		{
          		this.setState({ err_alert: true, loading: nextProps.loading });
      		}
      		this.setState({ 
        		errors : nextProps.data.errors
      		});
		}
		if (typeof nextProps.helpmanualdetails != 'undefined') {
			this.setState({
				helpmanualdetailsdata: nextProps.helpmanualdetails,
				loading: nextProps.loading
			});
		}
	  }
	
  	render() {
		const {err_alert,errors,loading,helpmanualdetailsdata, module_locale} = this.state;

		return (
      		<Page id="HelpCenter" title="HelpCenter" description="This is HelpCenter">
      			<PageTitleBar
					title={module_locale[localStorage.getItem('locale')].module_name || ''}
            		match={this.props.match}
      			/>
				<SearchHelps {...this.props}/>
				<Fragment>
						{errors.message && <div className="alert_area">
						<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
						</div>}
						<div>
							{loading &&
								<div className="d-flex justify-content-center loader-overlay">
									<CircularProgress />
								</div>
							}
							
							{helpmanualdetailsdata.length > 0 && helpmanualdetailsdata ? 
							<Tabs defaultTab="Info0" className="helpcenterinner" onSelect={tabIndex => this.setState({ tabIndex })} forceRenderTabPanel={true}>
								<Row className="clearfix py-10 px-20">
									<Col md={3} className="pr-0 bg-white">
									<div className="innertabpanel ">
										<TabList className="myaccountinnerTab">
											{helpmanualdetailsdata.map((helpmodule,key) => {
												if (helpmodule.locale && typeof helpmodule.locale[localStorage.getItem('locale')]!='undefined'){
													let tabfor = "Info"+key;
													return (
															<Tab className={this.props.darkMode ? 'innertabmenu-darkmode ' : 'innertabmenu'} tabFor={tabfor} key={key} value={key}>
																<span>{ helpmodule.locale[localStorage.getItem('locale')].title || ''}</span>
															</Tab>
													)}
											})}	
										</TabList>
									</div>
									</Col>
									<Col md={9} className="pl-0 bg-white">
										{helpmanualdetailsdata.map((helpmodule,key) => {
											if (helpmodule.locale && typeof helpmodule.locale[localStorage.getItem('locale')]!='undefined'){
												let tabId = "Info"+key;
												return (
														<TabPanel tabId={tabId} key={key}>
															<div className="tabformtitle">
																<div className="tabformheading">{ helpmodule.locale[localStorage.getItem('locale')].title || ''}</div>
																<div className="tabformcontent">{ ReactHtmlParser(helpmodule.locale[localStorage.getItem('locale')].content) || ''}</div>
															</div>
														</TabPanel>
												)}		
										})}	
										
									</Col>
								</Row>
							</Tabs>
							: <JbsCard customClasses="p-30 text-center"><IntlMessages id="trading.marketcap.label.nodata" /></JbsCard>}
						</div>
				</Fragment>	
      	</Page>
    	);
  	}
}

//map state to props
const mapStateToProps = ({ helpCenter, settings }) => {
  	var response = { 
		data: helpCenter.data,
		loading: helpCenter.loading,
		helpmanualdetails:helpCenter.helpmanualdetails,
		darkMode:settings.darkMode
    };
    return response;
};

export default connect(
  	mapStateToProps,
  	{
    	getHelpManualById
  	}
)(HelpCenterInfo);