/**
 * Author : Salim Deraiya
 * Created : 27/05/2019
 *  Arbitrage Exchange List
 * // chnaged by Tejas API INtegrationa and record binding
*/
import React, { Fragment, Component } from 'react';
// used for connect store
import { connect } from "react-redux";
// used for language conversion
import IntlMessages from 'Util/IntlMessages';
//import actions
import {
    arbitrageGetExchangeList
} from "Actions/Arbitrage";
//added by Tejas 14/6/2019
import JbsBarLoader from "Components/JbsPageLoader/JbsBarLoader"
//used for display scroll bar
import { Scrollbars } from "react-custom-scrollbars";
import $ from 'jquery';

//class for exchange list 
class ExchangeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exchageList: [],//exchangeData,
            exchageListSignalRData: []
        }
    }

    componentWillMount() {

        this.isComponentActive = 1
        this.props.arbitrageGetExchangeList({ Pair: this.props.currencyPair })
        this.props.hubConnection.on("RecieveProviderMarketDataArbitrage", (receivedMessage) => {
            if (this.isComponentActive === 1 && receivedMessage !== null) {
                try {
                    const receivedMessageData = JSON.parse(receivedMessage);
                    if ((receivedMessageData.EventTime && this.state.exchageListSignalRData.length === 0) || (this.state.exchageListSignalRData.length !== 0 &&
                        receivedMessageData.EventTime > this.state.exchageListSignalRData.EventTime)) {

                        if (this.props.currencyPair === receivedMessageData.Parameter && typeof receivedMessageData.IsMargin !== "undefined"
                            && receivedMessageData.IsMargin === 0) {

                            const newData = receivedMessageData.Data;
                            if (parseFloat(newData.LTP) !== 0) {

                                var latestExchageList = $.extend(true, [], this.state.exchangeList);

                                var findIndexPrice = latestExchageList.findIndex(exchangeDetail => parseFloat(exchangeDetail.LPType) === parseFloat(newData.LPType));

                                if (findIndexPrice === -1) {
                                    //to do if want to add new exchange into it 
                                } else {

                                    latestExchageList[findIndexPrice] = newData;
                                    latestExchageList[findIndexPrice].UpDownBit = 1;

                                }

                                this.setState({ exchangeList: latestExchageList, exchageListSignalRData: receivedMessageData });

                            }
                        }
                    }
                } catch (error) {
                }
            }
        });

    }

    componentWillUnmount() {
        this.isComponentActive = 0;
    }

    componentWillReceiveProps(nextprops) {
        if (nextprops.arbitrageExchange && nextprops.arbitrageExchange.length) {

            this.setState({
                exchangeList: nextprops.arbitrageExchange
            })
        } else {

            this.setState({
                exchangeList: []
            })
        }
    }

    changeData = (obj) => {
    }

    //renders the component
    render() {
        const { exchangeList } = this.state;
        return (
            <Fragment>
                <Scrollbars
                    className="jbs-scroll"
                    autoHeight
                    autoHeightMin={this.props.autoHeightMin}
                    autoHeightMax={this.props.autoHeightMax}
                    autoHide
                >
                    {this.props.arbitrageExchangeLoading && <JbsBarLoader />}

                    {exchangeList && exchangeList.length > 0
                        ?
                        exchangeList.map((list, index) => {
                            return (
                                <div className="card" key={index} onClick={() => this.changeData(list)}>
                                    <div className="d-flex justify-content-between">
                                        <div className="font-weight-bold">{list.ProviderName}</div>
                                        <div><span className="text-blue font-weight-bold">
                                            {list.Volume.toFixed(2)}

                                        </span></div>
                                    </div>
                                    <div className="d-flex justify-content-between mt-5">
                                        <div className="font-weight-bold text-danger">{list.LTP.toFixed(8)}</div>
                                        <div className="font-weight-bold text-success">{list.LTP.toFixed(8)}</div>
                                    </div>
                                </div>
                            )
                        })
                        :
                        <div className="not_data_found">
                            <IntlMessages id="apiWalletErrCode.17037" />
                        </div>
                    }
                </Scrollbars>
            </Fragment>
        );
    }
}

// Set Props when actions are dispatch
const mapStateToProps = state => ({
    arbitrageExchange: state.ArbitrageExchange.arbitrageExchange,
    arbitrageExchangeLoading: state.ArbitrageExchange.arbitrageExchangeLoading,
});

// connect action with store for dispatch
export default connect(
    mapStateToProps,
    {
        arbitrageGetExchangeList
    }
)(ExchangeList);