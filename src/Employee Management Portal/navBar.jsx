import React, { Component } from "react";
import { Link } from "react-router-dom";

class NavBar extends Component {
  render() {
    let { user } = this.props;
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              Employee Portal
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarText"
              aria-controls="navbarText"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {user && user.role === "ADMIN" && (
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Admin
                    </a>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <li>
                        <Link className="dropdown-item" to="/admin/addemp">
                          Add Employee
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/admin/viewemp">
                          View Employees
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}
                {user && user.role === "EMPLOYEE" && (
                  <li class="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      My Portal
                    </a>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <li>
                        <Link className="dropdown-item" to="/emp/contact">
                          Contact Details
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/emp/bills">
                          Bills
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}
              </ul>
              <ul className="navbar-nav ms-auto">
                {!user && (
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">
                      LOGIN
                    </Link>
                  </li>
                )}
                {user && (
                  <li className="nav-item">
                    <Link to="/logout" className="nav-link">
                      LOGOUT
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}
export default NavBar;
