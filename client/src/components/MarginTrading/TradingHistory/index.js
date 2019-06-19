/* 
    Developer : Devang parekh
    Date : 6-03-2019
    File Comment : export loadable margin trading history
*/
import React from 'react';
import Loadable from 'react-loadable';
import PreloadWidget from 'Components/PreloadLayout/PreloadWidget';

const MyLoadingComponent = () => (
    <PreloadWidget />
)

const MarginTradingHistory = Loadable({
    loader: () => import("./MarginTradingHistory"),
    loading: MyLoadingComponent
})

export {
    MarginTradingHistory
}