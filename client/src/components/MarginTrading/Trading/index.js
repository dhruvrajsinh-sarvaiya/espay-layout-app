/**
 * margin trading widgets which is newly created
 * developer: devang parekh
 * date : 19-2-2019
 * 
 */
import React from "react";
import Loadable from "react-loadable";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";

const MyLoadingComponent = () => <PreloadWidget />;

// for display user's margin account detail
const MarginAccountDetail = Loadable({
  loader: () => import("./MarginAccountDetail"),
  loading: MyLoadingComponent
});

// added by devang parekh for active and recent order component (22-3-2019)
const MarginActiveOrders = Loadable({
  loader: () => import("./MarginActiveOrders"),
  loading: MyLoadingComponent
});

// Export components
export {
  MarginAccountDetail,
  MarginActiveOrders // added by devang parekh
};
