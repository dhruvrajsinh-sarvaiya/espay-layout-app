/**
 * App DataTable Widget
 */
import React from 'react';
import Loadable from 'react-loadable';
import PreloadWidget from 'Components/PreloadLayout/PreloadWidget';

const MyLoadingComponent = () => (
   <PreloadWidget />
)

const DataTableFilter = Loadable({
    loader: () => import("./Filter3"),
    loading: MyLoadingComponent
 });

 const DataTableWithApi = Loadable({
    loader: () => import("./DataTableWithApi"),
    loading: MyLoadingComponent
 });

 const VirtualTable = Loadable({
    loader: () => import("./VirtualTable"),
    loading: MyLoadingComponent
 });

export {
   DataTableFilter,
   DataTableWithApi,
   VirtualTable
}