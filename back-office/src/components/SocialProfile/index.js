/**
 * App Widgets
 */
import React from "react";
import Loadable from "react-loadable";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";

const MyLoadingComponent = () => <PreloadWidget />;

//LeaderProfileWdgt
const LeaderProfileWdgt = Loadable({
    loader: () => import("./LeaderProfileWdgt"),
    loading: MyLoadingComponent
});

//FollowerProfileWdgt
const FollowerProfileWdgt = Loadable({
    loader: () => import("./FollowerProfileWdgt"),
    loading: MyLoadingComponent
});

export {
    /* Added by Kevin */
    LeaderProfileWdgt,
    FollowerProfileWdgt,
};
