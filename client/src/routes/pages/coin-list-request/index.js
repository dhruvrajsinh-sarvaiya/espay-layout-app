/* 
    Createdby : Dhara gajera
    CreatedDate : 8-01-2019
    Description : coin list fields page
*/
import React, { Component } from 'react';
//Import Coin List requesr Component
import CoinListRequest from "Components/Coinlist/CoinListRequest";

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// jbs card box
import { JbsCard } from 'Components/JbsCard';

//For Meta Tag and SEO Configuration
import Page from 'Components/page';

export default class ContactUs extends Component {
	render() {
		return (
			<Page id="coinListRequest" title="Coin list Request" description="This is Coin list request">
			<div className="about-wrapper">
				<PageTitleBar title={<IntlMessages id="sidebar.coinListRequestForm" />} match={this.props.match} />
				<JbsCard customClasses="p-60">
					<CoinListRequest {...this.props} />
				</JbsCard>
			</div>
			</Page>
		);
	}
}
