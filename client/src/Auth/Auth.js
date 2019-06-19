import { configureStore } from '../store';
//Added by salim dt:17/10/2018...
//Call Direct Sagas method (checkTokenSagas)

export default class Auth {

	constructor() {
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.handleAuthentication = this.handleAuthentication.bind(this);
		this.isAuthenticated = this.isAuthenticated.bind(this);
	}

	login() {
		//this.auth0.authorize();
	}

	handleAuthentication() {
		this.auth0.parseHash((err, authResult) => {
			if (authResult && authResult.accessToken && authResult.idToken) {
				this.setSession(authResult);
				localStorage.setItem("user_id", "user-id");
				let store = configureStore();
				store.dispatch({ type: 'LOGIN_USER_SUCCESS', payload: authResult })
				window.location.replace('/')
			} else if (err) {
				console.log(err);
				alert(`Error: ${err.error}. Check the console for further details.`);
			}
		});
	}

	setSession(authResult) {
		// Set the time that the access token will expire at
		let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
		localStorage.setItem('access_token', authResult.accessToken);
		localStorage.setItem('id_token', authResult.idToken);
		localStorage.setItem('expires_at', expiresAt);
	}

	logout() {
		// Clear access token and ID token from local storage
		localStorage.removeItem('access_token');
		localStorage.removeItem('id_token');
		localStorage.removeItem('expires_at');
		localStorage.removeItem('tokenID'); //Added by salim
		window.location.replace('/signin');
	}

	isAuthenticated() {
		// Check whether the current time is past the 
		// access token's expiry time
		let store = configureStore();
		store.dispatch({ type: 'CHECK_TOKEN', payload: {} })
		return localStorage.getItem('tokenID') != '' ? true : false;
	}
}