/**
 * Privacy Policy Page
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
		//const html = pageContents!=null ? pageContents.locale[localStorage.getItem('locale')].content : '';
		const html =pageContents != null && pageContents.locale && pageContents.locale[localStorage.getItem('locale')] && pageContents.locale[localStorage.getItem('locale')].content ? pageContents.locale[localStorage.getItem("locale")].content : "";
		return (
			// <Page id="application-center" title="Application Center" description="This is Application Center">
			<div className="about-wrapper">
				<PageTitleBar title={<IntlMessages id="sidebar.applicationCenter" />} match={this.props.match} />
					
					<div className="terms-wrapper" >
						<div className="terms-conditions-rules">
							<JbsCollapsibleCard customClasses="p-20">
								{ReactHtmlParser(html)}
								{/* <div class="termsconbox">
									
									<p>To aid productivity and allow improved communication within project teams, CoolDex has come up with a self-help platform that allows efficient listing and mitigate intervention factors. This platform allows team members get updated information on supplement listing documents and review progress, making it possible to accelerate the listing process.
									</p>
									<p>Our self-help platform is available to both mature projects and those yet to start financing.</p>
									<h6>For mature projects, CoolDex evaluates the assets and all listed coins, making sure they meet the following conditions:</h6>
									<ol>
										<li>Submitted documents are complete and accurate.</li>
										<li>Fulfill the professionalism and compliance requirements with no policy risks.</li>
										<li>Meet the standards in Blockchain Asset Evaluation.</li> 
										<li>Strong team or community maintenance.</li>
										<li>Projects have actual technical support or practical application.</li>
										<li>Disclose project information, including white papers, periodic development and progress reports in a truthful and timely manner.</li>
										<li>Other specified requirements for being listed on our platform.</li>
									</ol>

									<h6>While for unlisted projects, we evaluate the assets and all listed coins, making sure they meet the following conditions:</h6>
									<ol>
										<li>Submitted documents are complete and accurate.</li>
										<li>Strong team or community maintenance.</li>
										<li>Fulfill the professionalism and compliance requirements with no policy risks.</li> 
										<li>Recommended by professional investment institutions.</li>
										<li>Projects have actual technical support or practical application.</li>
										<li>Provide not less than 5% of the total tokens, or 10% of the tokens in circulation to enter the voting.</li>
										<li>Disclose project information, including white papers, periodic development and progress reports in a truthful and timely manner.</li>
										<li>Other specified requirements for being listed on our platform.</li>
									</ol>

									<h4 class="commmain_title">Delisting Policy</h4>
									<p>To maintain the interest of investors on our platform, CoolDex maintains the right to keep or withhold any token from its exchange and notify the delisting via announcement, if project teams trigger the following conditions:</p>
									<ol>
										<li>Project teams fail to submit a weekly report and have not submitted a weekly report for more than eight times;</li>
										<li>Project teams intentionally conceal any major events that may seriously affect the price of tokens;</li>
										<li>Projects are suspected of illegal and criminal activities such as money laundering, fraud or pyramid selling;</li> 
										<li>There are other major risks in the projects, such as theft of coins by hackers, concealment of additional issuance and so on, which are sufficient to make the projects have risk events.</li>
										<li>Project teams are suspected of operating the market, and the circumstances are serious;</li>
										<li>The publicity or marketing conduct of project teams damage the interest of the community, and the circumstances are serious;</li>
										<li>Dissolution or change of project team members;</li>
										<li>Other circumstances that is sufficient for delisting.</li>
									</ol>
									<p>We issue a delisting announcement for projects that trigger any of the delisting condition 5 days in advance. Within 30 days after announcement date, users are expected to transfer the currencies to their personal digital asset wallets or other trading platforms.</p>
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
})(ApplicationCenter);
