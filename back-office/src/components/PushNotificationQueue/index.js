/* 
    Developer : Khushbu Badheka
    Date : 08-Jan-2019
    File Component index : Push Notification Queue Module
*/

import React from "react";
import Loadable from "react-loadable";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";

const MyLoadingComponent = () => <PreloadWidget />;

//Display Push Notification Queue
const PushNotificationQueue = Loadable({
  loader: () => import("./PushNotificationQueue"),
  loading: MyLoadingComponent
});

export {
  PushNotificationQueue
};