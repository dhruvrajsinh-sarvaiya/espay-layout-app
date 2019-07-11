/* 
    Developer : Vishva shah
    Date : 1-03-2019
    File Comment : wallets Ledger index file
*/
import React from 'react';
import Loadable from 'react-loadable';
import PreloadWidget from 'Components/PreloadLayout/PreloadWidget';

const MyLoadingComponent = () => (
    <PreloadWidget />
)

const ListMarginWalletLedger = Loadable({
    loader: () => import("./ListMarginWalletLedger"),
    loading: MyLoadingComponent
})

export {
    ListMarginWalletLedger
}