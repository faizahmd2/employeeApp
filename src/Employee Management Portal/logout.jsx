import React, { Component } from "react";
import auth from "./services/authService";

class Logout extends Component {
  componentDidMount() {
    auth.logout();
    //this.props.history.push('/login');
    window.location = "/login";
  }

  render() {
    return "";
  }
}
export default Logout;
