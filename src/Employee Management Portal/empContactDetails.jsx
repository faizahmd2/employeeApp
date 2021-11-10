import React, { Component } from "react";
import http from "./services/httpService";
import auth from "./services/authService";

class EmpContactDetails extends Component {
  state = {
    form: { mobile: "", address: "", city: "", country: "", pincode: "" },
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
    let { mobile, country, pincode } = this.state.form;
    let errors = {};
    errors.mobile = this.validateMobile(mobile);
    errors.country = this.validateCountry(country);
    errors.pincode = this.validatePinCode(pincode);

    return errors;
  };

  handleValidate = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    let { errors } = s1;

    switch (input.name) {
      case "mobile":
        errors.mobile = this.validateMobile(input.value);
        break;
      case "country":
        errors.country = this.validateCountry(input.value);
        break;
      case "pincode":
        errors.pincode = this.validatePinCode(input.value);
        break;
      default:
        break;
    }
  };

  validateMobile = (mob = "") => {
    let len = mob.length;
    let count = 0;
    for (let i = 0; i < len; i++) {
      if (
        (mob[i] >= "0" && mob[i] <= "9") ||
        mob[i] == "+" ||
        mob[i] == "-" ||
        mob[i] == " "
      ) {
        // do nothing
      } else count++;
    }
    return !mob
      ? "Mobile number is required"
      : count > 0 || len < 10
      ? "Mobile number has at least 10 characters. Allowed are 0-9,+,- and space"
      : "";
  };
  validateCountry = (c1) => (!c1 ? "Country is required" : "");
  validatePinCode = (pin) => (!pin ? "Pincode is required" : "");

  async getEmpDetails() {
    let user = auth.getUser();
    console.log(user.empuserid);
    if (user) {
      let response = await http.get(`/empapp/empcontact/${user.empuserid}`);
      console.log(response);
      let { data } = response;
      if (!data.address) {
        let dbError = "No Contact Details Found. Please Enter Them.";
        let form = {
          mobile: "",
          address: "",
          city: "",
          country: "",
          pincode: "",
        };
        this.setState({ form: form, dbError: dbError, edit: true });
      } else {
        let success = "Displaying Contact Details";
        this.setState({ form: data, success: success, edit: false });
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
      window.location = `/emp`;
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        let dbError = "Database error.";
        this.setState({ dbError: dbError });
      }
    }
  }

  handleAddEmpDetails = (e) => {
    e.preventDefault();
    let user = auth.getUser();
    let { empuserid } = user;
    let { mobile, address, city, country, pincode } = this.state.form;
    let empJson = {
      empuserid: empuserid,
      mobile: mobile,
      address: address,
      city: city,
      country: country,
      pincode: pincode,
    };
    this.postData(`/empapp/empcontact/${empuserid}`, empJson);
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
          <h4 className="text-center">Welcome to Employee Management Portal</h4>
          <div className="row bg-light">
            <div className="row">
              <h5 className="text-center">Your Contact Details</h5>
              {success ? (
                <span className="text-success text-center">{success}</span>
              ) : dbError ? (
                <span className="text-primary text-center">{dbError}</span>
              ) : (
                ""
              )}
              <div className="col-5"></div>
              <div className="col-7">
                <form>
                  <div class="row mb-3">
                    <label class="col-sm-2 col-form-label" style={myStyle}>
                      Mobile:
                    </label>
                    <div class="col-sm-10">
                      <input
                        type="text"
                        class="form-control"
                        id="mobile"
                        name="mobile"
                        value={form.mobile}
                        placeholder="Enter the Mobile number"
                        readOnly={!edit}
                        onChange={this.handleChange}
                        onBlur={this.handleValidate}
                      />
                    </div>
                    {errors && (
                      <span className="text-danger px-1">{errors.mobile}</span>
                    )}
                  </div>
                  <div class="row mb-3">
                    <label class="col-sm-2 col-form-label" style={myStyle}>
                      Address:
                    </label>
                    <div class="col-sm-10">
                      <input
                        type="text"
                        class="form-control"
                        id="address"
                        name="address"
                        value={form.address}
                        placeholder="Address"
                        readOnly={!edit}
                        onChange={this.handleChange}
                        onBlur={this.handleValidate}
                      />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label class="col-sm-2 col-form-label" style={myStyle}>
                      City:
                    </label>
                    <div class="col-sm-10">
                      <input
                        type="text"
                        class="form-control"
                        id="city"
                        name="city"
                        value={form.city}
                        placeholder="City"
                        readOnly={!edit}
                        onChange={this.handleChange}
                        onBlur={this.handleValidate}
                      />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label class="col-sm-2 col-form-label" style={myStyle}>
                      Country:
                    </label>
                    <div class="col-sm-10">
                      <input
                        type="text"
                        class="form-control"
                        id="country"
                        name="country"
                        value={form.country}
                        placeholder="Country"
                        readOnly={!edit}
                        onChange={this.handleChange}
                        onBlur={this.handleValidate}
                      />
                    </div>
                    <span className="text-danger px-5">{errors.country}</span>
                  </div>
                  <div class="row mb-3">
                    <label class="col-sm-2 col-form-label" style={myStyle}>
                      PinCode:
                    </label>
                    <div class="col-sm-10">
                      <input
                        type="text"
                        class="form-control"
                        id="pincode"
                        name="pincode"
                        value={form.pincode}
                        placeholder="PinCode"
                        readOnly={!edit}
                        onChange={this.handleChange}
                        onBlur={this.handleValidate}
                      />
                    </div>
                    <span className="text-danger px-5">{errors.pincode}</span>
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
export default EmpContactDetails;
