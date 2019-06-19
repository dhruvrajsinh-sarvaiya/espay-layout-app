/**
 * Trade App Widgets
 */
import React from "react";
import Loadable from "react-loadable";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";

const MyLoadingComponent = () => <PreloadWidget />;


// Components For Display Cooldex Finding By Manish Vora Date:06/12/2018
const CooldexBuySell = Loadable({
  loader: () => import("./CooldexBuySell"),
  loading: MyLoadingComponent
});

// Components For Display Cooldex FundingChart By Manish Vora Date:06/12/2018
const CooldexFundingChart = Loadable({
  loader: () => import("./CooldexFundingChart"),
  loading: MyLoadingComponent
});

// Components For Display Cooldex HigherLower By Manish Vora Date:06/12/2018
const CooldexHigherLower = Loadable({
  loader: () => import("./CooldexHigherLower"),
  loading: MyLoadingComponent
});

// Components For Display Cooldex Buy Checkout By Manish Vora Date:06/12/2018
const CooldexBuyCheckout = Loadable({
  loader: () => import("./CooldexBuyCheckout"),
  loading: MyLoadingComponent
});

// Components For Display Cooldex Tooltip Slider By Manish Vora Date:06/12/2018
const CooldexTooltipSlider = Loadable({
  loader: () => import("./CooldexTooltipSlider"),
  loading: MyLoadingComponent
});



// Export components
export {
    CooldexBuySell,
    CooldexFundingChart,
    CooldexHigherLower,
    CooldexBuyCheckout,
    CooldexTooltipSlider,
};
