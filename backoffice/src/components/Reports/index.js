import React from "react";
import Loadable from "react-loadable";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";



const MyLoadingComponent = () => (
    <PreloadWidget />
);
const EmailQueueWdgt = Loadable({
    loader : () => import("./EmailQueueWdgt"),
    loading: MyLoadingComponent
});

export {
    EmailQueueWdgt
};