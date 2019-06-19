/**
 * Author : Devang parekh
 * Created : 18-6-2019
 *  Arbitrage profit indicator by pair
 * // change by devang parekh for arbitrage trading values from signalr response
*/

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import JbsBarLoader from "Components/JbsPageLoader/JbsBarLoader"
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import SwipeableViews from "react-swipeable-views";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import {injectIntl} from 'react-intl';

import { 
    getArbitragePairList,
    getAribitrageProfitIndicator
} from "Actions/Arbitrage";

import PairSelection from "../PairSelection";
import AppConfig from 'Constants/AppConfig';

function TabContainer({ children }) {
    return (
        <Typography component="div">
            {children}
        </Typography>
    );
}

class ProfitIndicator extends Component {

    constructor(props) {
        super(props);
        this.state = {
            profitIndicatorList: [],
            pairList: [],
            showLoader:false,
            pairName: AppConfig.defaultArbitragePair,
            activeIndex: 0,
            hubConnection: this.props.location.state.hubConnection, // get user hub connection from location state
            profitIndicatorSignalRData:[]
        };
    }

    componentWillMount() {

        this.isComponentActive = 1; // set active bit for component active or not
        this.props.getArbitragePairList({});
        this.props.getAribitrageProfitIndicator({PairName:this.state.pairName})
        
    }

    componentDidMount() {

        // add lisners for handle signalr response for profit indicator list
        this.state.hubConnection.on('RecieveProfitIndicatorArbitrage', (receivedMessage) => {

            //console.log("RecieveProfitIndicatorArbitrage",receivedMessage);
			if (this.isComponentActive === 1 && receivedMessage !== null) {

				try {

					const receivedMessageData = JSON.parse(receivedMessage);
					if ((receivedMessageData.EventTime && this.state.profitIndicatorSignalRData.length == 0) ||
						(this.state.profitIndicatorSignalRData.length !== 0 && receivedMessageData.EventTime >= this.state.profitIndicatorSignalRData.EventTime)) {

                        // check current pair active or not
                        if (this.state.pairName === receivedMessageData.Parameter) {
                            this.setState({ profitIndicatorList: receivedMessageData.Data, profitIndicatorSignalRData: receivedMessageData });
                        }                        
                            
                    }
                    
				} catch (error) {
                    //console.log("error",error);
                }
                
            }
            
		});

    }

    componentWillUnmount() {

        // on unmount set default pair for arbitrage trading (18-6-2019)
        this.state.hubConnection.invoke("AddArbitragePairSubscription", AppConfig.defaultArbitragePair, this.state.pairName)
        .catch((err) => console.error("AddArbitragePairSubscription", err));
        // end

        this.isComponentActive = 0;

    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.pairList.length && nextProps.pairList !== null && nextProps.pairList !== this.state.pairList) {

            // set Currency list if gets from API only          
            this.setState({
                pairList: nextProps.pairList,
            });

        } else if(nextProps.pairList !== undefined && !nextProps.pairList.length) {
            
            this.setState({
                pairList: [],
            });

        }
        
        if (nextProps.arbitrageProfitIndicatorData && nextProps.arbitrageProfitIndicatorData.ReturnCode !== undefined 
            && nextProps.arbitrageProfitIndicatorData.ReturnCode === 0 && nextProps.arbitrageProfitIndicatorData.response
            && Object.keys(nextProps.arbitrageProfitIndicatorData.response).length) {

            // set Currency list if gets from API only          
            this.setState({
                profitIndicatorList: nextProps.arbitrageProfitIndicatorData.response,
            });

        } else if (nextProps.arbitrageProfitIndicatorData && nextProps.arbitrageProfitIndicatorData.ReturnCode !== undefined 
                    && nextProps.arbitrageProfitIndicatorData.ReturnCode === 0 && nextProps.arbitrageProfitIndicatorData.response
                    && Object.keys(nextProps.arbitrageProfitIndicatorData.response).length) {
            
            this.setState({
                profitIndicatorList: [],
            });

        }

    }

    changePair = (value) => {
        
        // invoke method when pair change after success get that pair related response in listner
        this.state.hubConnection.invoke("AddArbitragePairSubscription", value.PairName, this.state.pairName)
                .catch((err) => console.error("AddArbitragePairSubscription", err));
        //end
        
        this.setState({pairName:value.PairName})
        this.props.getAribitrageProfitIndicator({PairName:value.PairName});

    }

	 handleChangeIndex(index) {
        this.setState({ activeIndex: index });
    }

    render() {
        
		const { intl } = this.props;
        const { profitIndicatorList } = this.state;
        
        return (
            <Fragment>
                {this.props.profitIndicatorLoader && <JbsBarLoader />}
				 <JbsCollapsibleCard
                    colClasses="todo-wrapper"
                    fullBlock
                    customClasses="overflow-hidden"
                >
				
				 <div className="row px-20 py-5 mt-20">
						<div className="col-sm-3">
							<PairSelection
								pairData={this.state.pairList}
								currencyPair={this.state.pairName}
								changePairs={this.changePair}
							/>
						</div>
				</div>
				<AppBar position="static" color="default">
                        <Tabs
                            value={this.state.activeIndex}
                            onChange={(e, value) => this.handleChangeIndex(value)}
                            fullWidth
                            textColor="primary"
                            indicatorColor="primary"
                            centered
                        >
                            <Tab
                                label={intl.formatMessage({ id: "sidebar.openOrders.filterLabel.type.buy" })}
                                className="font-weight-bold"
                            />
                            <Tab
                                label={intl.formatMessage({ id: "sidebar.openOrders.filterLabel.type.sell" })}
                                className="font-weight-bold"
                            />
                        </Tabs>
                    </AppBar>
					<SwipeableViews
                        axis={"x"}
                        index={this.state.activeIndex}
                        onChangeIndex={index => this.handleChangeIndex(index)}
						className="mt-20 mb-50"
                    >
                        <TabContainer>
						 {profitIndicatorList && profitIndicatorList.BUY && profitIndicatorList.BUY.length ?
								<table className="opn_ord_profit striped highlight ml-20">
									<thead>
										<tr>
											<th>{this.state.pairName}</th>
											{/* <th></th> */}
											{profitIndicatorList.BUY[0].Providers.map(function(item){
												return <th>{item.ProviderName} ({item.LTP})</th>
											})}
										</tr>
										{/* <tr>
											<th></th>
											<th><IntlMessages id="myaccount.tradeSummaryColumn.buyRate" /></th>
											{profitIndicatorList.BUY[0].Providers.map(function(item){
												return <th>{item.LTP}</th>
											})}
										</tr> */}                                
									</thead>
									<tbody>
										{profitIndicatorList.BUY.map(function(buyItem){
											return  <tr>
														<th>{buyItem.ProviderName} ({buyItem.LTP})</th>
														{/* <th>{buyItem.LTP}</th> */}
														{buyItem.Providers.map(function(buySubItem){
															return <th className={buySubItem.Profit > 0 ? 'text-black-pro' : buySubItem.Profit < 0 ? 'text-black-profit' : ''}>{parseFloat(buySubItem.Profit).toFixed(2)}%</th>
														})}
													</tr>
										})}                                
									</tbody>
								</table> : "No Record Found"}
						</TabContainer>
						 <TabContainer>
						{profitIndicatorList && profitIndicatorList.SELL && profitIndicatorList.SELL.length ?
                                    <table className="opn_ord_profit striped highlight ml-20">
                                        <thead>
                                            <tr>
                                                <th>{this.state.pairName}</th>
                                                {/* <th></th> */}
                                                {profitIndicatorList.SELL[0].Providers.map(function(item){
                                                    return <th>{item.ProviderName} ({item.LTP})</th>
                                                })}
                                            </tr>
                                            {/* <tr>
                                                <th></th>
                                                <th><IntlMessages id="myaccount.tradeSummaryColumn.sellRate" /></th>
                                                {profitIndicatorList.SELL[0].Providers.map(function(item){
                                                    return <th>{item.LTP}</th>
                                                })}
                                            </tr> */}                                
                                        </thead>
                                        <tbody>
                                            {profitIndicatorList.SELL.map(function(sellItem){
                                                return  <tr>
                                                            <th>{sellItem.ProviderName} ({sellItem.LTP})</th>
                                                            {/* <th>{sellItem.LTP}</th> */}
                                                            {sellItem.Providers.map(function(sellSubItem){
                                                                return <th className={sellSubItem.Profit > 0 ? 'text-black-pro' : sellSubItem.Profit < 0 ? 'text-black-profit' : ''}>{parseFloat(sellSubItem.Profit).toFixed(2)}%</th>
                                                            })}
                                                        </tr>

                                            })}                                
                                        </tbody>
                                    </table> : "No Record Found"}
							</TabContainer>
					</SwipeableViews>
				</JbsCollapsibleCard>
                
                
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    pairList: state.arbitrageOrderBook.arbitragePairList,
    profitIndicatorLoader:state.arbitradeProfitIndicator.profitIndicatorLoader,
    arbitrageProfitIndicatorData:state.arbitradeProfitIndicator.arbitrageProfitIndicator,
});

export default connect(mapStateToProps, {
    getArbitragePairList,
    getAribitrageProfitIndicator
})(injectIntl(ProfitIndicator));

//export default ProfitIndicator;