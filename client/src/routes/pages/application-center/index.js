/**
 * Privacy Policy Page
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// jbs card box
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

// app config
import AppConfig from 'Constants/AppConfig';

// redux actions
import { getPageContents } from 'Actions';



class ApplicationCenter extends Component {

	state = {
		myContnet: []
    }
    
    componentDidMount(){
		//HAVE TO PASS PROPER PAGE ID TO GET RELAVANT PAGE CONTENT
        this.props.getPageContents(AppConfig.pages['application-center']);
	}

	render() {
		const { pageContents } = this.props;
		
		const html =pageContents != null && pageContents.locale && pageContents.locale[localStorage.getItem('locale')] && pageContents.locale[localStorage.getItem('locale')].content ? pageContents.locale[localStorage.getItem("locale")].content : "";
		return (
			
			<div className="about-wrapper">
				<PageTitleBar title={<IntlMessages id="sidebar.applicationCenter" />} match={this.props.match} />
					
					<div className="terms-wrapper" >
						<div className="terms-conditions-rules">
							<JbsCollapsibleCard customClasses="p-20">
								{ReactHtmlParser(html)}
								
							</JbsCollapsibleCard>
						</div>
					</div>
			</div>
			
		);
	}
}
// map state to props
const mapStateToProps = ({ pageContentApp }) => {
	const { pageContents } = pageContentApp;
	return { pageContents };
}

export default connect(mapStateToProps, {
	getPageContents
})(ApplicationCenter);
