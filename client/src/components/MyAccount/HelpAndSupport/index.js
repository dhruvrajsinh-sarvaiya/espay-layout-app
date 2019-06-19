/**
 * Help & Support Component
 */
import React from 'react';
import Loadable from 'react-loadable';
import PreloadWidget from 'Components/PreloadLayout/PreloadWidget';

const MyLoadingComponent = () => (
    <PreloadWidget />
)

//Complain Form Widget...
const ComplainFormWdgt = Loadable({
    loader: () => import("./ComplainFormWdgt"),
    loading: MyLoadingComponent
});

//Complain Report Widget...
const ComplainReportsWdgt = Loadable({
    loader: () => import("./ComplainReportsWdgt"),
    loading: MyLoadingComponent
});

//Replay Complain Form Widget...
const ComplainReplayFormWdgt = Loadable({
    loader: () => import("./ComplainReplayFormWdgt"),
    loading: MyLoadingComponent
});

export {
    ComplainFormWdgt,
    ComplainReportsWdgt,
    ComplainReplayFormWdgt
}