/* 
    Developer : Vishva shah
    Date : 18-04-2019
    File Comment : margin profit & loss report index
*/
import React from 'react';
import Loadable from 'react-loadable';
import PreloadWidget from 'Components/PreloadLayout/PreloadWidget';

const MyLoadingComponent = () => (
    <PreloadWidget />
)

const ProfitLossReport = Loadable({
    loader: () => import("./ProfitLossReport"),
    loading: MyLoadingComponent
})

export {
    ProfitLossReport
}