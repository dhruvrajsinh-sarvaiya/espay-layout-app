import React from 'react';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Dashboard from '../front/dashboard/Dashboard';
import CreateProfile from '../front/create-profile/CreateProfile';
import EditProfile from '../front/edit-profile/EditProfile';
import AddExperience from '../front/add-credentials/AddExperience';
import AddEducation from '../front/add-credentials/AddEducation'; 
import Profiles from '../front/profiles/Profiles';
import Profile from '../front/profile/Profile';
import Posts from '../front/posts/Posts';
import Post from '../front/post/Post';
import NotFound from '../not-found/NotFound';
import PrivateRoute from '../common/PrivateRoute';
import { Route, Switch } from 'react-router-dom';

export default () => {
  return (
      <div className="container">
        <Route exact path="/front/register" component={Register} />
        <Route exact path="/front/login" component={Login} />
        <Route exact path="/front/profiles" component={Profiles} />
        <Route exact path="/front/profile/:handle" component={Profile} />
        <Switch>
          <PrivateRoute exact path="/front/dashboard" component={Dashboard} />
        </Switch>        
        <Switch>
          <PrivateRoute
            exact
            path="/front/create-profile"
            component={CreateProfile}
          />
        </Switch>
        <Switch>
          <PrivateRoute
            exact
            path="/front/edit-profile"
            component={EditProfile}
          />
        </Switch>
        <Switch>
          <PrivateRoute
            exact
            path="/front/add-experience"
            component={AddExperience}
          />
        </Switch>
        <Switch>
          <PrivateRoute
            exact
            path="/front/add-education"
            component={AddEducation}
          />
        </Switch>
        <Switch>
          <PrivateRoute exact path="/front/feed" component={Posts} />
        </Switch>
        <Switch>
          <PrivateRoute exact path="/post/:id" component={Post} />
        </Switch>
        <Route exact path="/not-found" component={NotFound} />
      </div>
  )

};