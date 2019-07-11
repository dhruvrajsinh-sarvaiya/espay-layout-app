/**
 * Social Widgets
 */
import React from 'react';
import Loadable from 'react-loadable';
import PreloadWidget from 'Components/PreloadLayout/PreloadWidget';

const MyLoadingComponent = () => (
   <PreloadWidget />
)

//Facebook Login Button Widget...
const FacebookLoginButtonWdgt = Loadable({
   loader: () => import("./FacebookLoginButtonWdgt"),
   loading: MyLoadingComponent
});

//Google Login Button Widget...
const GoogleLoginButtonWdgt = Loadable({
    loader: () => import("./GoogleLoginButtonWdgt"),
    loading: MyLoadingComponent
});

//Twitter Login Button Widget...
const TwitterLoginButtonWdgt = Loadable({
    loader: () => import("./TwitterLoginButtonWdgt"),
    loading: MyLoadingComponent
});

export {
    FacebookLoginButtonWdgt,
    GoogleLoginButtonWdgt,
    TwitterLoginButtonWdgt
}