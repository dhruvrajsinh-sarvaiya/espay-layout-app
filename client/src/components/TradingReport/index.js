/*
 * Created By Megha Kariya
 * Date :- 09-01-2019
 * Component File for Trade Summary Report
 */
/**
 * App Widgets
 */
import React from "react";
import Loadable from "react-loadable";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";

const MyLoadingComponent = () => <PreloadWidget />;

//DisplayUsersWdgt
const TradeSummary = Loadable({
    loader: () => import("./TradeSummary"),
    loading: MyLoadingComponent,
});

export {
    /* Added by Kevin */

    TradeSummary,
};
