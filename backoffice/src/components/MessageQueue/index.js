/*
 * Created By : Megha Kariya
 * Date : 15-01-2019
 * Comment : Report
 */
/**
 * App Widgets
 */
import React from "react";
import Loadable from "react-loadable";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";

const MyLoadingComponent = () => <PreloadWidget />;

// import NormalLoginWdgt from './NormalLoginWdgt';

const MessageQueueWdgt = Loadable({
  loader: () => import("./MessageQueueWdgt"),
  loading: MyLoadingComponent
});


export {
  
  MessageQueueWdgt,
};
