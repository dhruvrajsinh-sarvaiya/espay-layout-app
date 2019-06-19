import React from "react";
import Loadable from "react-loadable";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";



const MyLoadingComponent = () => (
    <PreloadWidget />
);
const RequestApiManagerForm = Loadable({
    loader: () => import("./TradingSummeryLpWiseWdht"),
    loading: MyLoadingComponent
});


export {
    RequestApiManagerForm,
};