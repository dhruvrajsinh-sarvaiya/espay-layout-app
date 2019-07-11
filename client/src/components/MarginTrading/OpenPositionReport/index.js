/* 
    Developer : Parth andhariya
    Date : 22-04-2019
    FIle Comment : Open Position Report module index file
*/

import React from 'react';
import Loadable from 'react-loadable';
import PreloadWidget from 'Components/PreloadLayout/PreloadWidget';

const MyLoadingComponent = () => (
    <PreloadWidget />
)

const OpenPositionReport = Loadable({
    loader: () => import("./OpenPositionReportList"),
    loading: MyLoadingComponent
})

export {
    OpenPositionReport,
}