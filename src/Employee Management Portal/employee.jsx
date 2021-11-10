import React, { Component } from "react";

class Employee extends Component {
  render() {
    let { user } = this.props;
    return (
      <div className="container">
        <h2>Welcome {user.name} to the Employee Management Portal</h2>
      </div>
    );
  }
}
export default Employee;
