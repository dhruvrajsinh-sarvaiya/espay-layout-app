/* 
    Developer : Parth andhariya
    Date : 05-03-2019
    FIle Comment : Leverge Report index file
*/

import React from 'react';
import Loadable from 'react-loadable';
import PreloadWidget from 'Components/PreloadLayout/PreloadWidget';

const MyLoadingComponent = () => (
    <PreloadWidget />
)

const LeverageReport = Loadable({
    loader: () => import("./LeverageReport"),
    loading: MyLoadingComponent
})

export {
    LeverageReport
}