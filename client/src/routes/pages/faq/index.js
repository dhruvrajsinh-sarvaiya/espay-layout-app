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
import { getFaqcategories, getFaqquestions } from 'Actions/Faq';
import { connect } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
//Components
import SearchFaqs from './components/SearchFaq';

class Faq extends Component {
	constructor(props) {
		super(props);
		// default ui local state
		this.state = {
			faqs: [],
			faq_categories: [],
			faqloading: false,
		};
	}

	componentWillMount() {
		this.props.getFaqcategories();
		this.props.getFaqquestions();
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			faq_categories: nextProps.faqs_categories_list,
			faqs: nextProps.faqs,
			faqloading: false
		});
	}

	render() {
		const { faq_categories, faqs, faqloading } = this.state;
		return (
			<div className="faq-page-wrapper">
				<PageTitleBar title={<IntlMessages id="sidebar.faq" />} match={this.props.match} />
				<SearchFaqs {...this.props} />
				<div>
					{faqloading &&
						<div className="d-flex justify-content-center loader-overlay">
							<CircularProgress />
						</div>}
					{faq_categories && faq_categories.map((category, index) => {
						if (category.locale !== null && category.locale[localStorage.getItem('locale')] !== undefined) {
							return (
								<JbsCollapsibleCard key={index} heading={category.locale[localStorage.getItem('locale')].category_name ? category.locale[localStorage.getItem('locale')].category_name : ''}>
									{faqs && faqs.map((faq, i) => {
										if (faq && faq.category_id != undefined && faq.category_id === category._id && faq.locale && typeof faq.locale[localStorage.getItem('locale')] != 'undefined') {
											return (
												<ExpansionPanel key={i} className="mb-15 panel">
													<ExpansionPanelSummary expandIcon={<i className="zmdi zmdi-chevron-down"></i>} className="m-0 panel-heading demo">
														<h4>
															{faq.locale[localStorage.getItem('locale')] && faq.locale[localStorage.getItem('locale')].question}
														</h4>
													</ExpansionPanelSummary>
													<ExpansionPanelDetails>
														<div>
															{ReactHtmlParser(faq.locale[localStorage.getItem('locale')] && faq.locale[localStorage.getItem('locale')].answer)}
														</div>
													</ExpansionPanelDetails>
												</ExpansionPanel>
											);
										}
										return null;
									})}
								</JbsCollapsibleCard>
							)
						}
						return null;
					})}
				</div>
			</div>
		)
	}
}

const mapStateToProps = ({ faq }) => {
	var response = {
		faqs: faq.faqs,
		faqloading: faq.faqloading,
		faqs_categories_list: faq.faqs_categories_list
	};
	return response;
}

export default connect(mapStateToProps, {
	getFaqcategories, getFaqquestions
})(Faq);