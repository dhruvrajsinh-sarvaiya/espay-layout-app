/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 09-01-2019
    UpdatedDate : 09-01-2019
    Description : Help Manual Module Page
*/
import React, { Component,Fragment } from "react";
import { connect } from "react-redux";
import {Alert} from "reactstrap";
import CircularProgress from '@material-ui/core/CircularProgress';

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// intl messages
import IntlMessages from "Util/IntlMessages";
// jbs card box
import { JbsCard, JbsCardContent, JbsCardHeading } from 'Components/JbsCard';
import Divider from '@material-ui/core/Divider';
// redux actions
import { getHelpManualModules } from "Actions/HelpCenter";

import {Link} from 'react-router-dom';
//For Meta Tag and SEO Configuration
import Page from "Components/page";

class HelpCenterModule extends Component {
  
  	constructor(props) {
    	super(props);
		this.state = {
			helpmanualmoduledata: [],
			loading: false, // loading activity
			errors : {},
			err_msg : "",
			err_alert : true,
			btn_disabled : false
		};
		this.onDismiss = this.onDismiss.bind(this);
  	}
  	onDismiss() {
    	let err=delete  this.state.errors['message'];
    	this.setState({ err_alert: false, errors:err});
  	}
  	componentWillMount() {
		this.props.getHelpManualModules();
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
		if (typeof nextProps.helpmanualmodules != 'undefined') {
			this.setState({
				helpmanualmoduledata: nextProps.helpmanualmodules,
				loading: nextProps.loading
			});
		}
  	}

  	render() {
		const {err_alert,errors,loading,helpmanualmoduledata} = this.state;

		return (
      		<Page id="HelpCenter" title="HelpCenter" description="This is HelpCenter">
      			<PageTitleBar
            		title={<IntlMessages id="sidebar.helpcenter" />}
            		match={this.props.match}
      			/>
				<Fragment>
						{errors.message && <div className="alert_area">
						<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
						</div>}
						<div className="row clearfix py-10 px-20">
							{loading &&
								<div className="d-flex justify-content-center loader-overlay">
									<CircularProgress />
								</div>
							}
							{helpmanualmoduledata && helpmanualmoduledata.map((helpmodule,key) => {
								if (helpmodule.locale && typeof helpmodule.locale[localStorage.getItem('locale')]!='undefined'){
									return (
										<div className="col-sm-12 col-md-4 w-xs-full helpcenter" key={key}>
										   <Link
											to={{
												pathname: "/app/pages/helpcenter-info",
												state: { data: helpmodule }
											}}>
												<JbsCard colClasses="col-sm-full">
												<JbsCardHeading title={helpmodule.locale[localStorage.getItem('locale')].module_name} customClasses="py-5" />
												<Divider />
													<JbsCardContent customClasses="text-left pt-5">
														<p>{ helpmodule.locale[localStorage.getItem('locale')].description  }</p>
													</JbsCardContent>
												</JbsCard >
											</Link>
										</div>
									)} 
								})}	
							
						</div>
				</Fragment>	
      	</Page>
    	);
  	}
}

//map state to props
const mapStateToProps = ({ helpCenter }) => {
  	var response = { 
		data: helpCenter.data,
		loading: helpCenter.loading,
		helpmanualmodules:helpCenter.helpmanualmodules
    };
    return response;
};

export default connect(
  	mapStateToProps,
  	{
    	getHelpManualModules
  	}
)(HelpCenterModule);