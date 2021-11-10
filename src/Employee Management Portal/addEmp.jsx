import React, { Component } from "react";
import http from "./services/authService";

class AddEmp extends Component {
  state = {
    form: { name: "", email: "", password: "", rePassword: "" },
    errors: {},
  };

  handleChange = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    s1.form[input.name] = input.value;
    this.handleValidate(e);
    this.setState(s1);
  };

  isFormValid = () => {
    let errors = this.validateAll();
    return this.isValid(errors);
  };

  isValid = (errors) => {
    let keys = Object.keys(errors);
    let count = keys.reduce((acc, curr) => (errors[curr] ? acc + 1 : acc), 0);
    return count === 0;
  };

  validateAll = () => {
    let { name, email, password, rePassword } = this.state.form;
    let errors = {};
    errors.name = this.validateName(name);
    errors.email = this.validateEmail(email);
    errors.password = this.validatePwd(password);
    errors.rePassword = this.validateRePwd(rePassword);

    return errors;
  };

  handleValidate = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    let { errors } = s1;

    switch (input.name) {
      case "name":
        errors.name = this.validateName(input.value);
        break;
      case "email":
        errors.email = this.validateEmail(input.value);
        break;
      case "password":
        errors.password = this.validatePwd(input.value);
        break;
      case "rePassword":
        errors.rePassword = this.validateRePwd(input.value);
        break;
      default:
        break;
    }
  };

  validateName = (name) =>
    !name
      ? "Name must be entered"
      : name.length < 8
      ? "Name should have at least 8 chracters"
      : "";
  validateEmail = (email) => {
    let atPos = email.indexOf("@");
    let periodPos = email.indexOf(".");

    return !email
      ? "Email is Mandatory"
      : atPos < 1 || periodPos < atPos + 2 || periodPos + 2 >= email.length
      ? "Not a Valid Email"
      : "";
  };

  validatePwd = (pwd) => {
    let len = pwd.length;
    let countLower = 0;
    let countUpper = 0;
    let digitCount = 0;

    for (let i = 0; i < pwd.length; i++) {
      if (pwd[i] >= "a" && pwd[i] <= "z") countLower++;
      if (pwd[i] >= "A" && pwd[i] <= "Z") countUpper++;
      if (pwd[i] >= "0" && pwd[i] <= "9") digitCount++;
    }

    console.log(countLower, countUpper, digitCount);

    return !pwd
      ? "Password is Mandatory"
      : countLower < 1 || countUpper < 1 || digitCount < 1 || len < 8
      ? "Password should be min. 8 chars with a lowercase, uppercase, digit"
      : "";
  };

  validateRePwd = (rePwd) => {
    let { password } = this.state.form;
    return !rePwd || !password || rePwd !== password
      ? "password do not match"
      : "";
  };

  async postData(url, obj) {
    try {
      let response = await http.post(url, obj);
      let success = "Employee succesfully added";
      this.setState({ success: success });
      window.location = "/admin/addemp";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        let dbError = "Database error.";
        this.setState({ dbError: dbError });
      }
    }
    //this.props.history.push("/admin/addemp");
  }

  handleAddEmp = (e) => {
    e.preventDefault();
    let { name, email, password } = this.state.form;
    let empJson = {
      name: name,
      email: email,
      password: password,
      role: "EMPLOYEE",
    };
    this.postData("/empapp/emps", empJson);
  };

  validateEmp = () => {
    let { form, errors } = this.state;
  };

  render() {
    let { form, errors, success = null, dbError = null } = this.state;
    console.log(errors);
    const myStyle = {
      fontWeight: "500",
    };
    return (
      <React.Fragment>
        <div className="py-2 mx-5">
          <h4 className="text-center">Welcome to Employee Management Portal</h4>
          <div className="row bg-light">
            <div className="row">
              <div className="col-5"></div>
              <div className="col-7">
                <h5>Add New Employee</h5>
                <form>
                  {success ? (
                    <span className="text-success">{success}</span>
                  ) : dbError ? (
                    <span className="text-danger">{dbError}</span>
                  ) : (
                    ""
                  )}
                  <div class="row mb-3">
                    <label
                      for="inputEmail3"
                      class="col-sm-2 col-form-label"
                      style={myStyle}
                    >
                      Name:
                    </label>
                    <div class="col-sm-10">
                      <input
                        type="text"
                        class="form-control"
                        id="name"
                        name="name"
                        value={form.name}
                        placeholder="Enter the Employee Name"
                        onChange={this.handleChange}
                        onBlur={this.handleValidate}
                      />
                    </div>
                    {errors && (
                      <span className="text-danger">{errors.name}</span>
                    )}
                  </div>
                  <div class="row mb-3">
                    <label
                      for="inputEmail3"
                      class="col-sm-2 col-form-label"
                      style={myStyle}
                    >
                      Email:
                    </label>
                    <div class="col-sm-10">
                      <input
                        type="email"
                        class="form-control"
                        id="email"
                        name="email"
                        value={form.email}
                        placeholder="Enter the Employee's email"
                        onChange={this.handleChange}
                        onBlur={this.handleValidate}
                      />
                    </div>
                    <span className="text-danger">{errors.email}</span>
                  </div>
                  <div class="row mb-3">
                    <label
                      for="inputPassword3"
                      class="col-sm-2 col-form-label"
                      style={myStyle}
                    >
                      Password:
                    </label>
                    <div class="col-sm-10">
                      <input
                        type="password"
                        class="form-control"
                        id="password"
                        name="password"
                        value={form.password}
                        placeholder="Enter the Password"
                        onChange={this.handleChange}
                        onBlur={this.handleValidate}
                      />
                    </div>
                    <span className="text-danger">{errors.password}</span>
                  </div>
                  <div class="row mb-3">
                    <label
                      for="inputPassword3"
                      class="col-sm-2 col-form-label"
                    ></label>
                    <div class="col-sm-10">
                      <input
                        type="password"
                        class="form-control"
                        id="rePassword"
                        name="rePassword"
                        value={form.rePassword}
                        placeholder="Re-Enter the Password"
                        onChange={this.handleChange}
                        onBlur={this.handleValidate}
                      />
                    </div>
                    <span className="text-danger">{errors.rePassword}</span>
                  </div>
                  <button
                    type="submit"
                    class="btn btn-primary btn-sm mb-1"
                    style={{ marginLeft: "5rem" }}
                    onClick={this.handleAddEmp}
                    disabled={!this.isFormValid()}
                  >
                    Add
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
export default AddEmp;
