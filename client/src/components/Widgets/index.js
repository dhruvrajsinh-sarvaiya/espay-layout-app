/**
 * App Widgets
 */
import React from 'react';
import Loadable from 'react-loadable';
import PreloadWidget from 'Components/PreloadLayout/PreloadWidget';

const MyLoadingComponent = () => (
   <PreloadWidget />
)






const Notifications = Loadable({
   loader: () => import("./Notifications"),
   loading: MyLoadingComponent
});

const TwitterFeeds = Loadable({
   loader: () => import("./TwitterFeeds"),
   loading: MyLoadingComponent
})

const ContactRequestWidget = Loadable({
   loader: () => import("./ContactRequest"),
   loading: MyLoadingComponent
})

const CurrentDateWidget = Loadable({
   loader: () => import("./CurrentDate"),
   loading: MyLoadingComponent
})

const ActivityWidget = Loadable({
   loader: () => import("./Activity"),
   loading: MyLoadingComponent
})

const TwitterFeedsV2 = Loadable({
   loader: () => import("./TwitterFeedsV2"),
   loading: MyLoadingComponent
})

const Announcement = Loadable({
    loader: () => import("./Announcement"),
    loading: MyLoadingComponent
 })
 
 //added Nirmit For phone number for international/national
 const PhoneWidget = Loadable({
    loader: () => import("./PhoneWidget"),
    loading: MyLoadingComponent
 })

// Added By Megha Kariya (13/02/2019)
const FacebookFeeds = Loadable({
    loader: () => import("./FacebookFeeds"),
    loading: MyLoadingComponent
});

export {
   Notifications,
   TwitterFeeds,
   ContactRequestWidget,
   CurrentDateWidget,
   ActivityWidget,
   TwitterFeedsV2,
   Announcement,
   PhoneWidget,
   FacebookFeeds, // Added By Megha Kariya (13/02/2019)
}