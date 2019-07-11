import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "Actions/authActions";
import { clearCurrentProfile } from "Actions/profileActions";

class AuthLink extends React.Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
  }
  render() {
    const { isAuthenticated, user } = this.props.auth;
    if (isAuthenticated) {
      return (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/front/feed">
              Post Feed
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/front/dashboard">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <a
              href=""
              onClick={this.onLogoutClick.bind(this)}
              className="nav-link"
            >
              <img
                className="rounded-circle"
                src={user.avatar}
                alt={user.name}
                style={{ width: "25px", marginRight: "5px" }}
                title="You must have a Gravatar connected to your email to display an image"
              />{" "}
              Logout
            </a>
          </li>
        </ul>
      );
    } else {
      return null;
    }
  }
}
//export default authLinks;
AuthLink.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, clearCurrentProfile }
)(AuthLink);
