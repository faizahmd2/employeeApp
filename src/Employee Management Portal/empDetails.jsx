import React, { Component } from "react";
import http from "./services/httpService";

class EmpDetails extends Component {
  state = {
    form: { department: "", designation: "", manager: "" },
    errors: {},
    edit: false,
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
    let { department, designation, manager } = this.state.form;
    let errors = {};
    errors.department = this.validateDept(department);
    errors.designation = this.validateDesg(designation);
    errors.manager = this.validateManager(manager);

    return errors;
  };

  handleValidate = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    let { errors } = s1;

    switch (input.name) {
      case "department":
        errors.department = this.validateDept(input.value);
        break;
      case "designation":
        errors.designation = this.validateDesg(input.value);
        break;
      case "manager":
        errors.manager = this.validateManager(input.value);
        break;
      default:
        break;
    }
  };

  validateDept = (dept) => (!dept ? "Department must be entered" : "");
  validateDesg = (desg) => (!desg ? "Designation must be entered" : "");
  validateManager = (manager) =>
    !manager ? "Manager's Name must be entered" : "";

  async getEmpDetails() {
    let { id } = this.props.match.params;
    if (id) {
      let response = await http.get(`/empapp/empdept/${id}`);
      let { data } = response;
      if (data.department) {
        let success = "Displaying Department Details";
        this.setState({ form: data, success: success, edit: false });
      } else {
        let dbError = "No Department Details Found. Please Enter Them.";
        let form = { department: "", designation: "", manager: "" };
        this.setState({ form: form, dbError: dbError, edit: true });
      }
    }
  }

  componentDidMount() {
    this.getEmpDetails();
  }

  async postData(url, obj) {
    try {
      let response = await http.post(url, obj);
      let success = "Deatils have been succesfully added";
      this.setState({ success: success });
      window.location = "/admin/viewemp";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        let dbError = "Database error.";
        this.setState({ dbError: dbError });
      }
    }
  }

  handleAddEmpDetails = (e) => {
    e.preventDefault();
    let { id } = this.props.match.params;
    let { department, designation, manager } = this.state.form;
    let empJson = {
      empuserid: id,
      department: department,
      designation: designation,
      manager: manager,
    };
    this.postData(`/empapp/empdept/${id}`, empJson);
  };

  render() {
    let { form, errors, success = null, dbError = null, edit } = this.state;
    console.log(errors);
    const myStyle = {
      fontWeight: "500",
    };
    return (
      <React.Fragment>
        <div className="py-2 mx-5">
          <h4 style={{ marginLeft: "16rem" }}>
            Welcome to Employee Management Portal
          </h4>
          <div className="row bg-light">
            <div className="row">
              <div className="col-3"></div>
              <div className="col-9">
                <h5>Department Details of New Employee</h5>
                <form>
                  {success ? (
                    <span className="text-success">{success}</span>
                  ) : dbError ? (
                    <span className="text-danger">{dbError}</span>
                  ) : (
                    ""
                  )}
                  <div class="row mb-3">
                    <label class="col-sm-2 col-form-label" style={myStyle}>
                      Department:
                    </label>
                    <div class="col-sm-10">
                      <input
                        type="text"
                        class="form-control"
                        id="department"
                        name="department"
                        value={form.department}
                        placeholder="Enter the Department"
                        readOnly={!edit}
                        onChange={this.handleChange}
                        onBlur={this.handleValidate}
                      />
                    </div>
                    {errors && (
                      <span className="text-danger">{errors.department}</span>
                    )}
                  </div>
                  <div class="row mb-3">
                    <label class="col-sm-2 col-form-label" style={myStyle}>
                      Designation:
                    </label>
                    <div class="col-sm-10">
                      <input
                        type="text"
                        class="form-control"
                        id="designation"
                        name="designation"
                        value={form.designation}
                        placeholder="Enter the Employee's email"
                        readOnly={!edit}
                        onChange={this.handleChange}
                        onBlur={this.handleValidate}
                      />
                    </div>
                    <span className="text-danger">{errors.designation}</span>
                  </div>
                  <div class="row mb-3">
                    <label class="col-sm-2 col-form-label" style={myStyle}>
                      Manager's Name:
                    </label>
                    <div class="col-sm-10">
                      <input
                        type="text"
                        class="form-control"
                        id="manager"
                        name="manager"
                        value={form.manager}
                        placeholder="Enter the Manager's Name"
                        readOnly={!edit}
                        onChange={this.handleChange}
                        onBlur={this.handleValidate}
                      />
                    </div>
                    <span className="text-danger">{errors.manager}</span>
                  </div>
                  <button
                    type="submit"
                    class="btn btn-primary btn-sm mb-1"
                    style={{ marginLeft: "5rem" }}
                    onClick={this.handleAddEmpDetails}
                    disabled={!this.isFormValid() || !edit}
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
export default EmpDetails;
