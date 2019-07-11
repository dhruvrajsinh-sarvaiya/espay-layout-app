/**
 * financial App Widgets By Devang Parekh (18-4-2019)
 */
import React from 'react';
import Loadable from 'react-loadable';
import PreloadWidget from 'Components/PreloadLayout/PreloadWidget';


const MyLoadingComponent = () => (
    <PreloadWidget />
)

// Component For Display BalanceInfo Tab
const FinancialDashboard = Loadable({
    loader: () => import("./FinancialDashboard"),
    loading: MyLoadingComponent
})

const StartUpPoolCount = Loadable({
    loader: () => import("./Widgets/StartUpPoolCount"),
    loading: MyLoadingComponent
})

const CreditPoolCount = Loadable({
    loader: () => import("./Widgets/CreditPoolCount"),
    loading: MyLoadingComponent
})

const ServiceProviderPoolCount = Loadable({
    loader: () => import("./Widgets/ServiceProviderPoolCount"),
    loading: MyLoadingComponent
})

export {
    FinancialDashboard,
    StartUpPoolCount,
    CreditPoolCount,
    ServiceProviderPoolCount
}