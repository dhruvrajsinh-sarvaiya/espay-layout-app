/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 27-09-2018
    UpdatedDate : 27-09-2018
    Description : Contact us page use ContactForm Component
*/
import React, { Component } from 'react';
import ContactForm from 'Components/Contactus/Contact-form';
// import InviteFriend from 'Components/InviteFriend';
// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// jbs card box
import { JbsCard } from 'Components/JbsCard';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

//For Meta Tag and SEO Configuration
import Page from 'Components/page';

export default class ContactUs extends Component {
	render() {
		return (
			// <Page id="contactus" title="Contact US" description="This is Contact Us">
			<div className="about-wrapper">
				<PageTitleBar title={<IntlMessages id="sidebar.contactUs" />} match={this.props.match} />
				<JbsCollapsibleCard customClasses="p-60">
					<ContactForm {...this.props} />
					{/* <InviteFriend /> */}
				</JbsCollapsibleCard>
			</div>
			// </Page>
		);
	}
}
