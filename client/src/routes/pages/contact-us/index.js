/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 27-09-2018
    UpdatedDate : 27-09-2018
    Description : Contact us page use ContactForm Component
*/
import React, { Component } from 'react';
import ContactForm from 'Components/Contactus/Contact-form';
// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

export default class ContactUs extends Component {
	render() {
		return (
			<div className="about-wrapper">
				<PageTitleBar title={<IntlMessages id="sidebar.contactUs" />} match={this.props.match} />
				 <JbsCollapsibleCard customClasses="p-60">
					<ContactForm {...this.props} />
				</JbsCollapsibleCard>
			</div>
		);
	}
}
