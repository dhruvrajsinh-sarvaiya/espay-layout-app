import React from 'react';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Dashboard from '../admin/dashboard/Dashboard';
import CreateProfile from '../admin/create-profile/CreateProfile';
import EditProfile from '../admin/edit-profile/EditProfile';
import AddExperience from '../admin/add-credentials/AddExperience';
import AddEducation from '../admin/add-credentials/AddEducation';
import Profiles from '../admin/profiles/Profiles';
import Profile from '../admin/profile/Profile';
import Posts from '../admin/posts/Posts';
import Post from '../admin/post/Post'; 
import NotFound from '../not-found/NotFound';
import PrivateRoute from '../common/PrivateRoute';
import { Route, Switch } from 'react-router-dom';

export default () => {
  return (
      <div className="container">
        <Route exact path="/admin/register" component={Register} />
        <Route exact path="/admin/login" component={Login} />
        <Route exact path="/admin/profiles" component={Profiles} />
        <Route exact path="/admin/profile/:handle" component={Profile} />
        <Switch>
          <PrivateRoute exact path="/admin/dashboard" component={Dashboard} />
        </Switch>
        <Switch>
          <PrivateRoute
            exact
            path="/create-profile"
            component={CreateProfile}
          />
        </Switch>
        <Switch>
          <PrivateRoute
            exact
            path="/edit-profile"
            component={EditProfile}
          />
        </Switch>
        <Switch>
          <PrivateRoute
            exact
            path="/add-experience"
            component={AddExperience}
          />
        </Switch>
        <Switch>
          <PrivateRoute
            exact
            path="/add-education"
            component={AddEducation}
          />
        </Switch>
        <Switch>
          <PrivateRoute exact path="/admin/feed" component={Posts} />
        </Switch>
        <Switch>
          <PrivateRoute exact path="/admin/post/:id" component={Post} />
        </Switch>
        <Route exact path="/admin/not-found" component={NotFound} />
      </div>
  )

};