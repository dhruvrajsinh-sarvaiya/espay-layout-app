/**
 * Api exchange Configuration Widgets By Devang parekh 11/6/2019
 */
import React from 'react';
import Loadable from 'react-loadable';
import PreloadWidget from 'Components/PreloadLayout/PreloadWidget';


const MyLoadingComponent = () => (
    <PreloadWidget />
)

// Component For Display exchange Configuration Tab
const ExchangeConfiguration = Loadable({
    loader: () => import("./ExchangeConfiguration/ExchangeConfigurationList"),
    loading: MyLoadingComponent
})

const ArbitrageAllowOrderType = Loadable({
    loader: () => import("./ArbitrageAllowOrderType"),
    loading: MyLoadingComponent
})

// Export components 
export {
    ExchangeConfiguration,
    ArbitrageAllowOrderType
}