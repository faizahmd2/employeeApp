import React, { Component } from "react";
import http from "./services/httpService";
import auth from "./services/authService";
import { Redirect } from "react-router";

class Login extends Component {
  state = {
    form: { email: "", password: "" },
  };

  handleChange = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    s1.form[input.name] = input.value;
    this.setState(s1);
  };

  async login(url, obj) {
    try {
      let response = await http.post(url, obj);
      let { data } = response;
      auth.login(data);
      data.role === "ADMIN"
        ? (window.location = "/admin")
        : (window.location = "/emp");
      //window.location = "/products";
    } catch (ex) {
      if (ex.response && ex.response.status === 401) {
        let errors = "";
        errors = ex.response.data + " Check the username and password";
        this.setState({ errors: errors });
      }
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.login(`/empapp/loginuser`, this.state.form);
  };

  render() {
    let { form, errors = null } = this.state;

    const myStyle = {
      marginLeft: "5rem",
    };
    if (localStorage.getItem("user") !== null) return <Redirect to="/" />;
    return (
      <React.Fragment>
        <div className="py-2 mx-5">
          <h4 className="text-center">Welcome to Employee Management Portal</h4>
          <div className="row bg-light">
            <div className="row">
              <div className="col-5"></div>
              <div className="col-7">
                <h5 style={myStyle}>Login</h5>
                <form>
                  {errors && <span className="text-danger">{errors}</span>}
                  <div class="row mb-3">
                    <label for="inputEmail3" class="col-sm-2 col-form-label">
                      Email ID:
                    </label>
                    <div class="col-sm-10">
                      <input
                        type="email"
                        class="form-control"
                        id="email"
                        name="email"
                        value={form.email}
                        placeholder="Enter your Email ID"
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="inputPassword3" class="col-sm-2 col-form-label">
                      Password:
                    </label>
                    <div class="col-sm-10">
                      <input
                        type="password"
                        class="form-control"
                        id="password"
                        name="password"
                        value={form.password}
                        placeholder="Enter your Password"
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    class="btn btn-primary btn-sm mb-1"
                    style={myStyle}
                    onClick={this.handleSubmit}
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Login;
