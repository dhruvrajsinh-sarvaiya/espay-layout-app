/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 21-09-2018
    UpdatedDate : 21-09-2018
    Description : For Display API List 
*/
import React, { Component } from 'react';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// jbs card box
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

import { getApi } from 'Actions/Api';
import { connect } from 'react-redux';
//For Meta Tag and SEO Configuration
import Page from 'Components/page';
class API extends Component {

	constructor(props) {
		super(props);
		// default ui local state
		this.state = {
		  apis: []
		};
	}
  
	componentWillMount() {
		this.props.getApi();
	}

	render() {
		const { apis,apiloading } = this.props;
		return (
			<Page id="apidoc" title="API Documentation" description="This is API Doc">
				<div className="about-wrapper">
					<PageTitleBar title={<IntlMessages id="sidebar.api" />} match={this.props.match} />
						<div className="terms-wrapper" >
							<div className="terms-conditions-rules">
								<JbsCollapsibleCard customClasses="p-20">
									{apis && apis.map((api, key) => (
										<div key={key}>
											<h4 className="heading">{api.method_name}</h4>
											<p>{api.description}</p>
										</div>
									))}
								</JbsCollapsibleCard>
							</div>
						</div>
				</div>
			</Page>
		);
	}
}

//export default API;

const mapStateToProps = ({api}) => {
	const { apis } = api;
    return { apis }
}

export default connect(mapStateToProps, {getApi
})(API);
