/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 18-09-2018
    UpdatedDate : 27-09-2018
    Description : Coin List Page with static data 
*/
import React, { Component } from 'react';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

//Import Coin List Component
import CoinList from "Components/Coinlist/CoinList";

// intl messages
import IntlMessages from 'Util/IntlMessages';
//Added by dhara gajera 21/1/2019
export default class coinList extends Component {
	render() {
		return (
			// <Page id="coinlist" title="Coin List" description="This is Coin List">
			<div className="about-wrapper">
				<PageTitleBar title={<IntlMessages id="sidebar.coinList" />} match={this.props.match} />
					<div className="terms-wrapper" >
						<div className="terms-conditions-rules">
						{/* <p>Click here to Give <Link
                          to={{
                            pathname: "/app/pages/survey",
                            state: { surveytypeId: AppConfig.survey["coinlist_survey"] }
                          }}
                        >
                          Survey
												</Link></p> */}
							{/* <Surveys {...this.props} surveytypeId={ AppConfig.survey["coinlist_survey"]} /> */}
							<CoinList {...this.props}/>
						</div>
					</div>
			</div>
			// </Page>
		);
	}
}
