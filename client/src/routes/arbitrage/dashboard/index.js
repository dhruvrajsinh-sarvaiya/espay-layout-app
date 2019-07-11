/**
 * Auther : Salim Deraiya
 * Created : 27/05/2019
 * updated by :
 * Arbitrage dashboard route....
 */
import React, { Component } from "react";
import { Dashboard } from "Components/Arbitrage";

export default class ArbitrageDashboard extends Component {
    render() {
        return (
            <div className="arbitrage-dashboard">
                <Dashboard {...this.props} />
            </div>
        );
    }
}