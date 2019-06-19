import React from "react";
import Loadable from "react-loadable";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";



const MyLoadingComponent = () => (
    <PreloadWidget />
);
const EmailAPIManager = Loadable({
    loader: () => import("./EmailApiManagerWdgt"),
    loading: MyLoadingComponent
});


export {
    EmailAPIManager,
};