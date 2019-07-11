/**
 * LOCALIZATION Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// async components
import {
    AsyncCountryComponent,
	AsyncStateComponent,
	AsyncCityComponent,
    AsyncLanguageComponent,
    AsyncZipcodesComponent
} from 'Components/AsyncComponent/AsyncComponent';

import AddCountry from "./country/add";
import EditCountry from "./country/edit";

import AddState from "./state/add";
import EditState from "./state/edit";

import AddCity from "./city/add";
import EditCity from "./city/edit";

import AddLanguage from "./language/add";
import EditLanguage from "./language/edit";

import AddZipcodes from "./zipcodes/add";
import EditZipcodes from "./zipcodes/edit";

const LOCALIZATION = ({ match }) => (
    <div className="content-wrapper">
        <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/country`} /> {/* Added By Megha Kariya (27/02/2019*/}
            <Route path={`${match.url}/country`} component={AsyncCountryComponent} />
			<Route path={`${match.url}/state`} component={AsyncStateComponent} />
			<Route path={`${match.url}/city`} component={AsyncCityComponent} />
			<Route path={`${match.url}/language`} component={AsyncLanguageComponent} />
			<Route path={`${match.url}/add-country`} component={AddCountry} />
            <Route path={`${match.url}/edit-country`} component={EditCountry} />
			<Route path={`${match.url}/add-state`} component={AddState} />
            <Route path={`${match.url}/edit-state`} component={EditState} />
			<Route path={`${match.url}/add-city`} component={AddCity} />
            <Route path={`${match.url}/edit-city`} component={EditCity} />
			<Route path={`${match.url}/add-language`} component={AddLanguage} />
            <Route path={`${match.url}/edit-language`} component={EditLanguage} />
            <Route path={`${match.url}/zipcodes`} component={AsyncZipcodesComponent} /> 
	        <Route path={`${match.url}/add-zipcodes`} component={AddZipcodes} />
	        <Route path={`${match.url}/edit-zipcodes`} component={EditZipcodes} />
        </Switch>
    </div>
);

export default LOCALIZATION;
