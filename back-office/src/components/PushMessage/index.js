/*
 * Created By : Megha Kariya
 * Date : 17-01-2019
 * Comment : Push Message
 */
/**
 * App Widgets
 */
import React from "react";
import Loadable from "react-loadable";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";

const MyLoadingComponent = () => <PreloadWidget />;

const PushMessageWdgt = Loadable({
  loader: () => import("./PushMessageWdgt"),
  loading: MyLoadingComponent
});

export {
   PushMessageWdgt,
};
