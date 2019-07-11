/**
* Main App
*/
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';

// css
import './lib/reactifyCss';

// app component
import AppWidget from './container/App';

import { configureStore } from './store';
localStorage.setItem("user_id", "user-id");

const App = () => (
	<Provider store={configureStore()}>
		<MuiPickersUtilsProvider utils={MomentUtils}>
			<Router>
				<Switch>
					<Route path="/" component={AppWidget} />
				</Switch>
			</Router>
			<Router>
				<Switch>
					<Route path="/backoffice" component={AppWidget} />
				</Switch>
			</Router>
		</MuiPickersUtilsProvider>
	</Provider>
);

export default App;
