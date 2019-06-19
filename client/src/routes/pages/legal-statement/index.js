/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 18-09-2018
    UpdatedDate : 27-09-2018
    Description : AML Policy static page 
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

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

//For Meta Tag and SEO Configuration
import Page from 'Components/page';

class LegalStatement extends Component {

	state = {
		myContnet: []
    }
    
    componentDidMount(){
		//HAVE TO PASS PROPER PAGE ID TO GET RELAVANT PAGE CONTENT
        this.props.getPageContents(AppConfig.pages['legal-statement']);
	}

	render() {
		const { pageContents } = this.props;
		const html =pageContents != null && pageContents.locale && pageContents.locale[localStorage.getItem('locale')] && pageContents.locale[localStorage.getItem('locale')].content ? pageContents.locale[localStorage.getItem("locale")].content : "";
		return (
			// <Page id="legal-statement" title="Legal Statement" description="This is Legal Statement">
			<div className="about-wrapper">
				<PageTitleBar title={<IntlMessages id="sidebar.legalStatement" />} match={this.props.match} />
					<div className="terms-wrapper" >
						<div className="terms-conditions-rules">
							<JbsCollapsibleCard customClasses="p-20">
								{ReactHtmlParser(html)}
								{/* <div class="termsconbox">
									<h4 class="commmain_title">Article 1</h4>
									<p>This website is intended to provide to its best ability financial products and trading platform of international standards for the majority of global digital assets enthusiasts and investors, on the precondition that it does not violate any of the relevant laws and regulations. It is prohibited to use this Website for the purpose of engaging in any illegal trading activities like smuggling, money laundering and commercial bribery; where any account is found to violate any of these aforementioned illegal activities, this Website will terminate such account and immediately report such account to the appropriate authority.
									</p>
									<h4 class="commmain_title">Article 2</h4>
									<p>Where a competent authority, on the strength of applicable investigation certificate, requests this Website to cooperate with the investigation relating to any designated user, or if the account of the user is subject to measures like freezing, closure, or transfer, we will, as is required by the designated authority, assist by providing corresponding data relating to the account user, or carrying out the needed operation as is required by the competent authority; for any disclosure of the user’s privacy, failure in the operation of the account and any such losses arising therefrom, this Website will not be held liable in any manner whatsoever.</p>
									<h4 class="commmain_title">Article 3</h4>
									<p>Where a user of this Website violates any of these provisions and consequently violates any clause of relevant laws, this Website, as a service provider, is obliged to improve the rules and services of this platform. However, this Website does not have either the motivation for violating any law, nor has this Website committed any actual breach of any of the relevant laws, and will not assume any joint or several liability for the acts of the user.</p>
									<h4>Article 4</h4>
									<p>Any person that logs into this Website or uses this Website directly or indirectly shall be deemed as having voluntarily accepted the restriction of this Website.</p>
									<h4>Article 5</h4>
									<p>Any matter not covered in this statement shall be handled in accordance with relevant laws and regulations. Where this statement is in conflict with relevant laws and regulations of the Republic, the latter shall prevail.</p>
								</div> */}
							</JbsCollapsibleCard>
						</div>
					</div>
			</div>
			// </Page>
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
})(LegalStatement);
