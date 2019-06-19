/**
 * Created By : Salim Deraiya
 * Created Date : 09/10/2018
 * SLA Configuration Widget
 */
import React from "react";
import Loadable from "react-loadable";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";

const MyLoadingComponent = () => <PreloadWidget />;

//Add SLA Configuration Widget...
const AddSLAFormWdgt = Loadable({
  loader: () => import("./AddSLAFormWdgt"),
  loading: MyLoadingComponent
});

//Edit SLA Configuration Widget...
const EditSLAFormWdgt = Loadable({
  loader: () => import("./EditSLAFormWdgt"),
  loading: MyLoadingComponent
});

//List SLA Configuration Widget...
const ListSLAWdgt = Loadable({
  loader: () => import("./ListSLAWdgt"),
  loading: MyLoadingComponent
});

export { AddSLAFormWdgt, EditSLAFormWdgt, ListSLAWdgt };
