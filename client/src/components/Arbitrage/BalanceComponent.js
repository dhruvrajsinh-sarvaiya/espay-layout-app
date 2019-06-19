// Component for Display balance comopnent for Arbitrage Section By Tejas 12/6/2019
import React, { Component } from 'react';
// multiple classes 
import classNames from 'classnames';
import { connect } from "react-redux";
// constant 
import AppConfig from 'Constants/AppConfig';
//added by Tejas 14/6/2019
import JbsBarLoader from "Components/JbsPageLoader/JbsBarLoader"
import {Button} from 'reactstrap';
import { withRouter } from 'react-router-dom';
// scrollbar 
import { Scrollbars } from "react-custom-scrollbars";
// used for convert messages in different langauages
import IntlMessages from "Util/IntlMessages";

const BalanceWidget = ({ coin, balance }) => (
    <div className={classNames("social-card-arbitrage my-10 mx-5 balancecard")}>
        <span className={`social-icon`}>
            <img
                src={AppConfig.coinlistImageurl + '/' + coin + '.png'}
                style={{ width: "65px" }}
                alt={coin}
                className="rounded-circle"
                onError={(e) => {
                    e.target.src = require(`Assets/icon/default.png`) // default img
                }}
            />
        </span>
        <span className="w-60">
            <span className="font-weight-bold text-light">{parseFloat(balance).toFixed(8)}</span>
            <span className="fs-14 text-light">{coin}</span>
        </span>
    </div>
);

class FundBalances extends Component {

    render() {
        return (
            <div className="arbitrage_balance-tab">
                
                <Scrollbars
                    className="jbs-scroll"
                    autoHeight
                    autoHeightMin={260}
                    autoHeightMax={260}
                    autoHide
                >
                    <div className="row">
                    {this.props.loading && <JbsBarLoader />}
                        {this.props.Wallet && this.props.Wallet.map((coin, key) => {
                            return (
                                <div
                                    className="col-sm-6 col-md-2 col-lg-2 w-xs-half-block"
                                    key={key}
                                >

                                    <BalanceWidget
                                        coin={coin.CoinName}
                                        balance={coin.Balance}
                                    />
                                </div>
                            );
                        })}

                        
                                {this.props.Wallet && this.props.Wallet.length === 0 &&
                                    <Button className="arbitrage_btn_redirect"                                     
                                    variant="raised"
                                     onClick={() => {this.props.history.push('/app/arbitrage/Wallet')}}
                                      >
                                          {<IntlMessages id="sidebar.arbitrageConfigWallet" />}
                                    </Button>
                                }
                        
                    </div>

                </Scrollbars>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    loading: state.ArbitrageWalletReducer.loading,
});

export default connect(mapStateToProps, { })(withRouter(FundBalances));