/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Card Widget Type 1
*/
import React from 'react';
import IntlMessages from "Util/IntlMessages";

const CurrencyWidget = ({ currency, memberCount, trnCount, totalTrnCount, WalletCount }) => (
    <div className="social-card bg-primary mb-10 mt-10 p-15 d-inline text-white">
        <div className="d-flex justify-content-between w-100">
            <h1 className="align-items-start font-weight-bold mx-20 d-flex">{WalletCount}&nbsp;{currency}&nbsp;<IntlMessages id="walletDeshbard.wallets" /></h1>
            <h1 className="align-items-end mx-20"><i className="zmdi zmdi-balance-wallet"></i></h1>
        </div>
        <div className="d-flex justify-content-between w-100">
            <div className="align-items-start px-20 py-10 border-right">
                <span className=""><IntlMessages id="walletDeshbard.members" /></span>
                <h1 className="font-weight-bold mb-0">{memberCount}</h1>
            </div>
            <div className="align-items-center px-20 py-10 border-right">
                <span className=""><IntlMessages id="walletDeshbard.transactions" /></span>
                <h1 className="font-weight-bold mb-0">{trnCount}</h1>
            </div>
            <div className="align-items-end px-20 py-10">
                <span className=""><IntlMessages id="walletDeshbard.balance" /></span>
                <h1 className="font-weight-bold mb-0">{totalTrnCount}</h1>
            </div>
        </div>
    </div>
);

export { CurrencyWidget };