/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 19-09-2018
    UpdatedDate : 19-09-2018
    Description : UI Of Coin Info Page 
*/
import React, { Component, Fragment} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// jbs card box
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
//For SET META TAG
import Page from 'Components/page';
import AppConfig from 'Constants/AppConfig';


export default class coinInfo extends Component {

	constructor(props) {
		super(props);
	
		// default ui local state
		this.state = {
			coininfo:{},
			loading: false, // loading activity
      		errors : {},	
    	};
  	}

	componentWillMount() {
		let coininfo = this.props.location.state.data;
		if(coininfo != '') {
			this.setState({coininfo: this.props.location.state.data});
		} else {
			this.props.history.push('/app/pages/coin-list');
		}
	}

	render() {
		const coininfo = this.state.coininfo;
		var dateFormat = require('dateformat');
		return (
			// <Page id="coininfo" title="COIN INFO" description="This is COIN INFO">
			<div className="about-wrapper">
				<PageTitleBar title={<IntlMessages id="sidebar.coinInfo" />} match={this.props.match} />
					
				<div className="row">
					<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 w-xs-full">
						<div className="dash-cards">
							{/* <a href="javascript:void(0);" className="square-40 bg-warning card-right-action fs-8">2</a> */}
								<div className="card">
									<div className="media">
										<div className="media-left mr-25">
											<img src={AppConfig.coinlistImageurl+'/'+coininfo.SMSCode+'.png'} className="img-fluid rounded-circle" alt="user profile" width="120" height="120" />
										</div>
										<div className="media-body pt-5">
                            				<div className="mb-10">
                                				<h2 className="mb-5">{coininfo.SMSCode}</h2>
                                				<p className="text-muted mb-15">{coininfo.Name}</p>
												{/* <div className="mb-10">
													<p className="font-3x mb-0">$623<sub className="text-dark font-lg">+1.5%</sub></p>
												</div> */}
                            				</div>
                        				</div>
									</div>
								</div>
						</div>
					</div>
							
					<div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 col-xl-9 w-xs-full">
						<div className="dash-cards">
							<div className="card p-25">
								<div className="row mt-50">
                        			{/* <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 pb-10">
                            			<span className="fs-14 d-block font-weight-bold text-center">Market Cap</span>
                            			<span className="text-center">$21,326,015,000</span>
                        			</div>

									<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 pb-10">
										<span className="fs-14 d-block font-weight-bold text-center">24h Vol (Global)</span>
										<span className="text-center">฿139,038 ($890,368,352)</span>
									</div> */}

									<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 pb-10">
										<span className="fs-14 d-block font-weight-bold text-center">{<IntlMessages id="coininfo.circulatingsupply" />}</span>
										<span className="text-center">{coininfo.CirculatingSupply}</span>
									</div>
								
									<div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 pb-10">
										<span className="fs-14 d-block font-weight-bold text-center">{<IntlMessages id="coininfo.issueprice" />}</span>
										<span className="text-center">{coininfo.IssuePrice}</span>
									</div>

									<div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 pb-10">
										<span className="fs-14 d-block font-weight-bold text-center">{<IntlMessages id="coininfo.issuedate" />}</span>
										<span className="text-center">{dateFormat(coininfo.IssueDate, "isoDate")}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<JbsCollapsibleCard heading={<IntlMessages id="coininfo.detail" />} customClasses="p-10">
					<div className="table-responsive">
						<Table>
							<TableHead>
								<TableRow hover>
									<TableCell>{<IntlMessages id="coininfo.maxsupply" />}</TableCell>
									<TableCell numeric>{<IntlMessages id="coininfo.circulatingsupply" />}</TableCell>
									<TableCell numeric>{<IntlMessages id="coininfo.issuedate" />}</TableCell>
									<TableCell numeric>{<IntlMessages id="coininfo.issueprice" />}</TableCell>
									<TableCell numeric>{<IntlMessages id="coininfo.consensusprotocol" />}</TableCell>
									<TableCell numeric>{<IntlMessages id="coininfo.explorer" />}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<Fragment>
									<TableRow>
										<TableCell>{coininfo.MaxSupply?coininfo.MaxSupply:'--'}</TableCell>
										<TableCell numeric>{coininfo.CirculatingSupply?coininfo.CirculatingSupply:'--'}</TableCell>
										<TableCell numeric>{dateFormat(coininfo.IssueDate, "isoDate")}</TableCell>
										<TableCell numeric>{coininfo.IssuePrice?coininfo.IssuePrice:'--'}</TableCell>
										<TableCell numeric>{coininfo.ProofType?coininfo.ProofType:'--'}</TableCell>
										<TableCell numeric>--</TableCell>
									</TableRow>
								</Fragment>
							</TableBody>

							<TableHead>
								<TableRow hover>
									<TableCell>{<IntlMessages id="coininfo.totalsupply" />}</TableCell>
									<TableCell numeric>{<IntlMessages id="coininfo.cryptographicalgorithm" />}</TableCell>
									<TableCell numeric>{<IntlMessages id="coininfo.sorcecode" />}</TableCell>
									<TableCell numeric>{<IntlMessages id="coininfo.whitepaper" />}</TableCell>
									<TableCell numeric>{<IntlMessages id="coininfo.website" />}</TableCell>
									<TableCell numeric>{<IntlMessages id="coininfo.type" />}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<Fragment>
									<TableRow>
										<TableCell>{coininfo.TotalSupply?coininfo.TotalSupply:'--'}</TableCell>
										<TableCell numeric>{coininfo.EncryptionAlgorithm?coininfo.EncryptionAlgorithm:'--'}</TableCell>
										<TableCell numeric>--</TableCell>
										<TableCell numeric><a target="_blank" href={coininfo.WhitePaperPath?coininfo.WhitePaperPath:'#'}>{coininfo.WhitePaperPath?coininfo.WhitePaperPath:'--'}</a></TableCell>
										<TableCell numeric><a target="_blank" href={coininfo.WebsiteUrl?coininfo.WebsiteUrl:'#'}>{coininfo.WebsiteUrl?coininfo.WebsiteUrl:'--'}</a></TableCell>
										<TableCell numeric>COIN</TableCell>
									</TableRow>
								</Fragment>
							</TableBody>
						</Table>
					</div>
					<div className="pt-20">
						<p className="text-justify">{coininfo.Introduction?coininfo.Introduction:'--'}</p>
					</div>
				</JbsCollapsibleCard>
			</div>
			// </Page>	
		);
	}
}