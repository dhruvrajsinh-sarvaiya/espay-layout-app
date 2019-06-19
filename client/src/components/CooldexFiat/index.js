/**
 * Trade App Widgets
 */
import React from "react";
import Loadable from "react-loadable";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";

const MyLoadingComponent = () => <PreloadWidget />;


// Components For Display Cooldex Fiat Value Data  By Manish Vora Date:30/11/2018
const CooldexFiatLeft = Loadable({
  loader: () => import("./CooldexFiatLeft"),
  loading: MyLoadingComponent
});

// Components For Display Cooldex Fiat Value Data  By Manish Vora Date:30/11/2018
const CooldexFiatRight = Loadable({
  loader: () => import("./CooldexFiatRight"),
  loading: MyLoadingComponent
});


// Export components
export {
  CooldexFiatLeft,
  CooldexFiatRight
};
