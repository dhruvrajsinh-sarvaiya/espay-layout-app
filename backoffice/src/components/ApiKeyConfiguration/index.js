/**
 * Api Configuration Widgets By Tejas 21/2/2019
 */
import React from 'react';
import Loadable from 'react-loadable';
import PreloadWidget from 'Components/PreloadLayout/PreloadWidget';


const MyLoadingComponent = () => (
    <PreloadWidget />
)

// Component For Display ApiPlan Configuration Tab
const ApiPlan = Loadable({
    loader: () => import("./ApiPlanConfiguration"),
    loading: MyLoadingComponent
})

// Component For Display ApiPlan Configuration Tab
const ApiSubscriptionHistory = Loadable({
    loader: () => import("./ApiPlanSubscriptionHistory/ApiPlanSubscriptionHistory"),
    loading: MyLoadingComponent
})

// code added by devang parekh for api plan configuration history (11-3-2019)
const ApiPlanConfigurationHistory = Loadable({
    loader: () => import("./ApiPlanConfigurationHistory/ApiPlanConfiggurationHistory"),
    loading: MyLoadingComponent
})

// code added by devang parekh for api key configuration history (12-3-2019)
const ApiKeyHistory = Loadable({
    loader: () => import("./ApiKeyHistory/ApiKeyHistory"),
    loading: MyLoadingComponent
})

// Component For Display ApiKey Policy Setting tab By Tejas 14/3/2019
const ApiKeyPolicySetting = Loadable({
    loader: () => import("./APIKeyPolicySetting"),
    loading: MyLoadingComponent
})

// Component For API Plan Config Request Count Added By Sanjay 18/03/2019
const APIPlanConfigRequest = Loadable({
    loader: () => import("./APIPlanConfigRequest"),
    loading: MyLoadingComponent
})

const APIMethod = Loadable({
    loader: () => import("./APIMethod"),
    loading: MyLoadingComponent
})
//added by parth andhariya
const IPWiseRequestReport = Loadable({
    loader: () => import("./IPWiseRequestReport/IPWiseRequestReport"),
    loading: MyLoadingComponent
})

// Export components 
export {
    ApiPlan,
    ApiSubscriptionHistory,
    ApiPlanConfigurationHistory,
    ApiKeyHistory,
    ApiKeyPolicySetting,
    APIPlanConfigRequest,
    APIMethod,
    //added by parth andhariya
    IPWiseRequestReport
}