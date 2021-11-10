import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import NavBar from "./navBar";
import Login from "./login";
import Logout from "./logout";
import Admin from "./admin";
import Employee from "./employee";
import ViewEmployee from "./viewEmployee";
import AddEmp from "./addEmp";
import EmpDetails from "./empDetails";
import EmpBills from "./empBills";
import EmpContactDetails from "./empContactDetails";
import HotelBill from "./hotelBill";
import TravelBill from "./travelBill";
import NotAllowed from "./notAllowed";
import auth from "./services/authService";

class MainComponents extends Component {
  render() {
    const user = auth.getUser();
    return (
      <React.Fragment>
        <NavBar user={user} />
        <Switch>
          <Route
            path="/admin/viewemp/:id"
            render={(props) =>
              user ? (
                user.role === "ADMIN" ? (
                  <EmpDetails {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/emp/hotelbill/:id"
            render={(props) =>
              user ? (
                user.role === "EMPLOYEE" ? (
                  <HotelBill {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/emp/travelbill/:id"
            render={(props) =>
              user ? (
                user.role === "EMPLOYEE" ? (
                  <TravelBill {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route path="/login" render={(props) => <Login {...props} />} />
          <Route path="/logout" render={(props) => <Logout {...props} />} />
          <Route
            path="/admin/viewemp"
            render={(props) =>
              user ? (
                user.role === "ADMIN" ? (
                  <ViewEmployee {...props} />
                ) : (
                  <Redirect to="notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/admin/addemp"
            render={(props) =>
              user ? (
                user.role === "ADMIN" ? (
                  <AddEmp {...props} />
                ) : (
                  <Redirect to="notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/admin"
            render={(props) =>
              user ? (
                user.role === "ADMIN" ? (
                  <Admin {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/emp/contact"
            render={(props) =>
              user ? (
                user.role === "EMPLOYEE" ? (
                  <EmpContactDetails {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/emp/bills"
            render={(props) =>
              user ? (
                user.role === "EMPLOYEE" ? (
                  <EmpBills {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/emp"
            render={(props) =>
              user ? (
                <Employee {...props} user={user} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route path="/notAllowed" component={NotAllowed} />
        </Switch>
      </React.Fragment>
    );
  }
}
export default MainComponents;
