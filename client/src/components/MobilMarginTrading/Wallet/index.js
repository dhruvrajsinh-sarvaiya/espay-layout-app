/* 
    Developer : Nishant Vadgama
    Date : 19-02-2019
    FIle Comment : wallet module index file
*/

import React from 'react';
import Loadable from 'react-loadable';
import PreloadWidget from 'Components/PreloadLayout/PreloadWidget';

const MyLoadingComponent = () => (
    <PreloadWidget />
)

const ListMarginWallets = Loadable({
    loader: () => import("./ListMarginWallets"),
    loading: MyLoadingComponent
})

const AddMarginBalance = Loadable({
    loader: () => import("./AddMarginBalance"),
    loading: MyLoadingComponent
})

export {
    ListMarginWallets,
    AddMarginBalance
}