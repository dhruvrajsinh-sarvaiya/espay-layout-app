/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Card Widget Type 1
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IntlMessages from "Util/IntlMessages";
import { JbsCard, JbsCardContent, JbsCardHeading } from 'Components/JbsCard';
import Divider from '@material-ui/core/Divider';
import Switch from 'react-toggle-switch';

export class CardWidgetSwitch extends Component {
    state = {
        deposit: true,
        trade: true,
        withdrawal: false,
        charge: false,
        commission: true,
        loading: false
    }
    // toggle switch
    toggleSwitch = (key) => {
        this.setState({ [key]: !this.state[key] });
    }
    render() {
        return (
            <JbsCard colClasses="col-sm-full">
                <div className="jbs-block-title py-5">
                    <h4><IntlMessages id="walletDeshbard.walletTrnTypes" /></h4>
                </div>
                <Divider />
                <JbsCardContent customClasses="">
                    <ul className="list-unstyled mt-15">
                        <li className="d-flex justify-content-between px-30 py-25">
                            <div className="">
                                <h3 className="mb-0 mt-1">Trade</h3>
                            </div>
                            <Switch
                                onClick={() => this.toggleSwitch('trade')}
                                on={this.state['trade']}
                            />
                        </li>
                        <Divider />
                        <li className="d-flex justify-content-between px-30 py-25">
                            <div className="">
                                <h3 className="mb-0 mt-1">Deposit</h3>
                            </div>
                            <Switch
                                onClick={() => this.toggleSwitch('deposit')}
                                on={this.state['deposit']}
                            />
                        </li>
                        <Divider />
                        <li className="d-flex justify-content-between px-30 py-25">
                            <div className="">
                                <h3 className="mb-0 mt-1">Withdrawal</h3>
                            </div>
                            <Switch
                                onClick={() => this.toggleSwitch('withdrawal')}
                                on={this.state['withdrawal']}
                            />
                        </li>
                        <Divider />
                        <li className="d-flex justify-content-between px-30 py-25">
                            <div className="">
                                <h3 className="mb-0 mt-1">Charge</h3>
                            </div>
                            <Switch
                                onClick={() => this.toggleSwitch('charge')}
                                on={this.state['charge']}
                            />
                        </li>
                        <Divider />
                        <li className="d-flex justify-content-between px-30 py-25">
                            <div className="">
                                <h3 className="mb-0 mt-1">Commission</h3>
                            </div>
                            <Switch
                                onClick={() => this.toggleSwitch('commission')}
                                on={this.state['commission']}
                            />
                        </li>
                    </ul>
                    <h2 className="w-100 text-center mb-1"><a href="javascript:void(0)" onClick={() => (console.log('clicked'))} >....</a></h2>
                </JbsCardContent>
            </JbsCard >
        )
    }
}