/* 
    Developer : Vishva shah
    Date : 04-06-2019
    File Comment : Wallet report
*/
import React from 'react';
import Loadable from 'react-loadable';
import PreloadWidget from 'Components/PreloadLayout/PreloadWidget';

const MyLoadingComponent = () => (
    <PreloadWidget />
)

const ListArbitrageWallet = Loadable({
    loader: () => import("./ListArbitrageWallet"),
    loading: MyLoadingComponent
});
const CreateArbitrageWallet = Loadable({
    loader: () => import("./CreateArbitrageWallet"),
    loading: MyLoadingComponent
});
// const Leverage = Loadable({
//     loader: () => import("./Leverage"),
//     loading: MyLoadingComponent
// })
export {
    ListArbitrageWallet,
    CreateArbitrageWallet,
    // Leverage
}