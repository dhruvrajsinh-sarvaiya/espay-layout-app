/**
 * App Widgets
 */
import React from "react";
import Loadable from "react-loadable";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";

const MyLoadingComponent = () => <PreloadWidget />;



const PushEmailForm = Loadable({
  loader:()=>import("./PushEmail"),
  loading:MyLoadingComponent
});

export {
    PushEmailForm,
};
