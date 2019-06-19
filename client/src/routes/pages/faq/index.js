/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 19-09-2018
    UpdatedDate : 22-10-2018
    Description : For Display faq As per Category Wise 
*/
import React, { Component } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import CircularProgress from '@material-ui/core/CircularProgress';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// jbs card
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import { getFaqcategories,getFaqquestions } from 'Actions/Faq';
import { connect } from 'react-redux';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

//For Meta Tag and SEO Configuration
import Page from 'Components/page';

//Components
import SearchFaqs from './components/SearchFaq';
import {Link} from 'react-router-dom';
import AppConfig from 'Constants/AppConfig';
import Surveys from 'Components/Surveys/survey-form';//Added by dhara gajera 21/1/2019
class Faq extends Component {

	constructor(props) {
		super(props);
		// default ui local state
		this.state = {
		  faqs: [],
		  faq_categories:[],
		  faqloading:false,
		};
	}

	componentWillMount() {
		this.props.getFaqcategories();
		this.props.getFaqquestions();
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			faq_categories: nextProps.faqs_categories_list,
			faqs:nextProps.faqs,
			faqloading: false
		});

	}

	render() {
		const { faq_categories,faqs,faqloading } = this.state;
		return (
		// <Page id="FAQ" title="FAQ" description="This is FAQ Page">
			<div className="faq-page-wrapper">
				<PageTitleBar title={<IntlMessages id="sidebar.faq" />} match={this.props.match} />
				{/* <p>Click here to Give <Link
                          to={{
                            pathname: "/app/pages/survey",
                            state: { surveytypeId: AppConfig.survey["feedback_survey"] }
                          }}
                        >
                          Survey
						</Link></p> */}
					{/* <Surveys {...this.props} surveytypeId={ AppConfig.survey["feedback_survey"]} /> */}
				<SearchFaqs {...this.props}/>
				<div>
					{faqloading &&
						<div className="d-flex justify-content-center loader-overlay">
							<CircularProgress />
						</div>
					}
				  
					{faq_categories && faq_categories.map((category,key) => {

						if (category.locale && typeof category.locale[localStorage.getItem('locale')]!='undefined'){
							return (
								<JbsCollapsibleCard key={key} heading={category!=null && category.locale && category.locale[localStorage.getItem('locale')] && category.locale[localStorage.getItem('locale')].category_name ? category.locale[localStorage.getItem('locale')].category_name : ''}>
					
									{faqs && faqs.map((faq, key) => {
										if (faq.category_id!=undefined && faq.category_id==category._id && faq && faq.locale && typeof faq.locale[localStorage.getItem('locale')]!='undefined') {
											return (
												<ExpansionPanel key={key} className="mb-15 panel">
													<ExpansionPanelSummary expandIcon={<i className="zmdi zmdi-chevron-down"></i>} className="m-0 panel-heading demo">
														<h4>
															{faq && faq.locale && faq.locale[localStorage.getItem('locale')] && faq.locale[localStorage.getItem('locale')].question}
														</h4>
													</ExpansionPanelSummary>
													<ExpansionPanelDetails>
														<div>
															{ReactHtmlParser(faq && faq.locale && faq.locale[localStorage.getItem('locale')] && faq.locale[localStorage.getItem('locale')].answer)}
														</div>
													</ExpansionPanelDetails>
												</ExpansionPanel>
											);
										}
									})}
								</JbsCollapsibleCard>
							)} 
						})}	
				</div>
			</div>
		// </Page>
		)
	}
}

const mapStateToProps = ({faq}) => {
	var response = { 
		faqs: faq.faqs,
		faqloading: faq.faqloading,
		faqs_categories_list:faq.faqs_categories_list
	};
	return response;
}

export default connect(mapStateToProps, {getFaqcategories,getFaqquestions
})(Faq);