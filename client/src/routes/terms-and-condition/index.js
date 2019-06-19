/**
 * Terms and condition Page
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// jbs card box
import { JbsCard } from 'Components/JbsCard';

// app config
import AppConfig from 'Constants/AppConfig';

// redux actions
import { getPageContents } from 'Actions';

class TermsAndConditions extends Component {

	state = {
		myContnet: []
    }
    
    componentDidMount(){
        //console.log('called terms component did mount');
		//console.log("pageId",AppConfig.pages['terms-and-conditions']);
		//HAVE TO PASS PROPER PAGE ID TO GET RELAVANT PAGE CONTENT
        this.props.getPageContents(AppConfig.pages['terms-and-conditions']);
    }

	render() {

		const { pageContents } = this.props;
		const html = pageContents.locale[localStorage.getItem('locale')].content;
		return (
			<div className="about-wrapper">
				<PageTitleBar title={<IntlMessages id="termsAndCondition.title" />} match={this.props.match} />
				<div className="terms-and-condition-detail">																	
					<JbsCard customClasses="p-60">
						{ReactHtmlParser(html)}   
					</JbsCard>   
				</div>   
			</div>
		);
	}
}

// map state to props
const mapStateToProps = ({ pageContentApp }) => {
    //console.log("from map state to props",pageContentApp);
	const { pageContents } = pageContentApp;
	return { pageContents };
}

export default connect(mapStateToProps, {
	getPageContents
})(TermsAndConditions);
