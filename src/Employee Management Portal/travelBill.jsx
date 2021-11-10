import React, { Component } from "react";
import http from "./services/httpService";
import auth from "./services/authService";

class TravelBill extends Component {
  state = {
    form: {
      dFDay: "",
      dFMonth: "",
      dFYear: "",
      dOCity: "",
      dDCity: "",
      dFNum: "",
      rFDay: "",
      rFMonth: "",
      rFYear: "",
      rOCity: "",
      rDCity: "",
      rFNum: "",
      corporateBooking: "",
    },
    errors: {},
    edit: false,
    month: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  };

  handleChange = (e) => {
    let { currentTarget: input } = e;
    console.log(input);
    let s1 = { ...this.state };
    if (input.type === "checkbox") {
      this.updateCBs(input.name);
    } else s1.form[input.name] = input.value;
    this.handleValidate(e);
    this.setState(s1);
  };

  updateCBs = (name) => {
    let s1 = { ...this.state };
    if (s1.form[name] === "Yes") s1.form[name] = "No";
    else if (!s1.form[name]) s1.form[name] = "Yes";
    else if (s1.form[name] === "No") s1.form[name] = "Yes";
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
    let {
      dFDay,
      dFMonth,
      dFYear,
      dOCity,
      dDCity,
      dFNum,
      rFDay,
      rFMonth,
      rFYear,
      rOCity,
      rDCity,
      rFNum,
    } = this.state.form;
    let errors = {};
    errors.dFDay = this.ValidateDeptDate(dFDay);
    errors.dFMonth = this.ValidateDeptDate(dFMonth);
    errors.dFYear = this.ValidateDeptDate(dFYear);
    errors.rFDay = this.ValidateReturnDate(rFDay);
    errors.rFMonth = this.ValidateReturnDate(rFMonth);
    errors.rFYear = this.ValidateReturnDate(rFYear);
    errors.dOCity = this.validateOriginCity(dOCity);
    errors.dDCity = this.validateDestCity(dDCity);
    errors.rOCity = this.validateOriginCity(rOCity);
    errors.rDCity = this.validateDestCity(rDCity);
    errors.dFNum = this.validateFlight(dFNum);
    errors.rFNum = this.validateFlight(rFNum);

    return errors;
  };

  handleValidate = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    let { errors } = s1;
    switch (input.name) {
      case "dFDay":
        errors.dFDay = this.ValidateDeptDate(input.value);
        break;
      case "dFMonth":
        errors.dFMonth = this.ValidateDeptDate(input.value);
        break;
      case "dFYear":
        errors.dFYear = this.ValidateDeptDate(input.value);
        break;
      case "rFDay":
        errors.rFDay = this.ValidateReturnDate(input.value);
        break;
      case "rFMonth":
        errors.rFMonth = this.ValidateReturnDate(input.value);
        break;
      case "rFYear":
        errors.rFYear = this.ValidateReturnDate(input.value);
        break;
      case "dOCity":
        errors.dOCity = this.validateOriginCity(input.value);
        break;
      case "dDCity":
        errors.dDCity = this.validateDestCity(input.value);
        break;
      case "rOCity":
        errors.rOCity = this.validateOriginCity(input.value);
        break;
      case "rDCity":
        errors.rDCity = this.validateDestCity(input.value);
        break;
      case "dFNum":
        errors.dFNum = this.validateFlight(input.value);
        break;
      case "rFNum":
        errors.rFNum = this.validateFlight(input.value);
        break;
      default:
        break;
    }
    this.setState(s1);
  };

  ValidateDeptDate = (date) => (!date ? "Departure Date is required" : "");
  ValidateReturnDate = (date) => (!date ? "Return Date is required" : "");
  validateOriginCity = (city) => (!city ? "Origin City is required" : "");
  validateDestCity = (city) => (!city ? "Destination City is required" : "");
  validateFlight = (fNum) => (!fNum ? "Flight Number is required" : "");

  async getBillDetails() {
    let user = auth.getUser();
    let { id } = this.props.match.params;
    if (user) {
      let response = await http.get(
        `/empapp/travelbill/${user.empuserid}/${id}`
      );
      console.log(response);
      let { data } = response;
      if (data.goflightDate) {
        let departure = data.goflightDate;
        let returnF = data.backflightDate;
        console.log(departure, returnF);
        let deptDay =
          departure[2] === "-"
            ? departure.substring(0, 2)
            : departure.substring(0, 1);
        let returnDay =
          returnF[2] === "-"
            ? returnF.substring(0, 2)
            : returnF.substring(0, 1);
        let deptYear = departure.substring(departure.length - 4);
        let returnYear = returnF.substring(returnF.length - 4);
        let deptMonth =
          departure[2] === "-"
            ? departure.substring(3, departure.length - 5)
            : departure.substring(2, departure.length - 5);
        let returnMonth =
          returnF[2] === "-"
            ? returnF.substring(3, returnF.length - 5)
            : returnF.substring(2, returnF.length - 5);
        let billJSON = {
          dFDay: deptDay,
          dFMonth: deptMonth,
          dFYear: deptYear,
          dOCity: data.goflightOrigin,
          dDCity: data.goflightDest,
          dFNum: data.goflightNum,
          rFDay: returnDay,
          rFMonth: returnMonth,
          rFYear: returnYear,
          rOCity: data.backflightOrigin,
          rDCity: data.backflightDest,
          rFNum: data.backflightNum,
          corporateBooking: data.corpbooking,
        };
        this.setState({
          form: billJSON,
          edit: true,
          success: "Displaying Flight Details",
        });
      } else {
        let form = {
          dFDay: "",
          dFMonth: "",
          dFYear: "",
          dOCity: "",
          dDCity: "",
          dFNum: "",
          rFDay: "",
          rFMonth: "",
          rFYear: "",
          rOCity: "",
          rDCity: "",
          rFNum: "",
          corporateBooking: "",
        };
        this.setState({
          form: form,
          dbError: "No Flight Details Found. Please Enter Them.",
        });
      }
    }
  }

  componentDidMount() {
    this.getBillDetails();
  }

  async postData(url, obj) {
    try {
      let response = await http.post(url, obj);
      let success = "Flight Details has been successfully created";
      this.setState({ dbError: success });
      window.location = `/emp/bills`;
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        let dbError = "Database error.";
        this.setState({ dbError: dbError });
      }
    }
  }

  handleSubmit = (e) => {
    console.log("I am in");
    e.preventDefault();
    let user = auth.getUser();
    let { id } = this.props.match.params;
    let s1 = { ...this.state };
    let {
      dFDay,
      dFMonth,
      dFYear,
      dOCity,
      dDCity,
      dFNum,
      rFDay,
      rFMonth,
      rFYear,
      rOCity,
      rDCity,
      rFNum,
      corpBooking,
    } = s1.form;
    let deptDate = dFDay + "-" + dFMonth + "-" + dFYear;
    let returnDate = rFDay + "-" + rFMonth + "-" + rFYear;
    let corpBook = !corpBooking ? "No" : corpBooking;
    let Data = {
      billid: id,
      empuserid: user.empuserid,
      goflightDate: deptDate,
      goflightOrigin: dOCity,
      goflightDest: dDCity,
      goflightNum: dFNum,
      backflightDate: returnDate,
      backflightOrigin: rOCity,
      backflightDest: rDCity,
      backflightNum: rFNum,
      corpbooking: corpBook,
    };
    this.postData("/empapp/travelbill", Data);
  };

  makeForm = (display) => {
    let { form, errors, edit, month } = this.state;
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    return (
      <React.Fragment>
        {" "}
        <div className="row mb-3">
          <div className="row">
            <label className="col-sm-3 col-form-label">Flight date:</label>
            <div className="col-3">
              <select
                className="form-select"
                id={display === "departure" ? "dFDay" : "rFDay"}
                name={display === "departure" ? "dFDay" : "rFDay"}
                value={display === "departure" ? form.dFDay : form.rFDay}
                onChange={this.handleChange}
                onBlur={this.handleValidate}
              >
                <option selected value="">
                  Day
                </option>
                {days.map((d1) => (
                  <option value={d1} key={d1}>
                    {d1}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-3">
              <select
                className="form-select"
                id={display === "departure" ? "dFMonth" : "rFMonth"}
                name={display === "departure" ? "dFMonth" : "rFMonth"}
                value={display === "departure" ? form.dFMonth : form.rFMonth}
                onChange={this.handleChange}
                onBlur={this.handleValidate}
              >
                <option selected value="">
                  Month
                </option>
                {month.map((m1) => (
                  <option value={m1} key={m1}>
                    {m1}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-3">
              <select
                className="form-select"
                id={display === "departure" ? "dFYear" : "rFYear"}
                name={display === "departure" ? "dFYear" : "rFYear"}
                value={display === "departure" ? form.dFYear : form.rFYear}
                onChange={this.handleChange}
                onBlur={this.handleValidate}
              >
                <option selected value="">
                  year
                </option>
                <option value="2018">2018</option>
                <option value="2019">2019</option>
                <option value="2020">2020</option>
              </select>
            </div>
          </div>
          {display === "departure" ? (
            errors.dFDay || errors.dFMonth || errors.dFYear ? (
              <span className="text-danger">
                {errors.dFDay || errors.dFMonth || errors.dFYear}
              </span>
            ) : (
              ""
            )
          ) : errors.rFDay || errors.rFMonth || errors.rFYear ? (
            <span className="text-danger">
              {errors.rFDay || errors.rFMonth || errors.rFYear}
            </span>
          ) : (
            ""
          )}
        </div>
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">Origin City:</label>
          <div className="col-sm-9">
            <input
              type="text"
              class="form-control"
              id={display === "departure" ? "dOCity" : "rOCity"}
              name={display === "departure" ? "dOCity" : "rOCity"}
              value={display === "departure" ? form.dOCity : form.rOCity}
              onChange={this.handleChange}
              onBlur={this.handleValidate}
            />
          </div>
          {display === "departure" && errors.dOCity ? (
            <span className="text-danger">{errors.dOCity}</span>
          ) : display === "return" && errors.rOCity ? (
            <span className="text-danger">{errors.rOCity}</span>
          ) : (
            ""
          )}
        </div>
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">Destination City:</label>
          <div className="col-sm-9">
            <input
              type="text"
              class="form-control"
              id={display === "departure" ? "dDCity" : "rDCity"}
              name={display === "departure" ? "dDCity" : "rDCity"}
              value={display === "departure" ? form.dDCity : form.rDCity}
              onChange={this.handleChange}
              onBlur={this.handleValidate}
            />
          </div>
          {display === "departure" && errors.dDCity ? (
            <span className="text-danger">{errors.dDCity}</span>
          ) : display === "return" && errors.rDCity ? (
            <span className="text-danger">{errors.rDCity}</span>
          ) : (
            ""
          )}
        </div>
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">Flight Number:</label>
          <div className="col-sm-9">
            <input
              type="text"
              className="form-control"
              id={display === "departure" ? "dFNum" : "rFNum"}
              name={display === "departure" ? "dFNum" : "rFNum"}
              value={display === "departure" ? form.dFNum : form.rFNum}
              onChange={this.handleChange}
              onBlur={this.handleValidate}
            />
          </div>
          {display === "departure" && errors.dFNum ? (
            <span className="text-danger">{errors.dFNum}</span>
          ) : display === "return" && errors.rFNum ? (
            <span className="text-danger">{errors.rFNum}</span>
          ) : (
            ""
          )}
        </div>
      </React.Fragment>
    );
  };

  render() {
    let { id } = this.props.match.params;
    let { form, edit, success = null, dbError = null } = this.state;
    return (
      <div className="container">
        <h4 className="text-center py-2">
          Welcome to Employee Management Portal
        </h4>
        <div className="row text-center bg-light border-bottom">
          <h5 className="">Flight Details</h5>
          <h6 className="">Bill Id : {id}</h6>
          {success ? (
            <span className="text-success pb-3">{success}</span>
          ) : dbError ? (
            <span className="text-primary pb-3">{dbError}</span>
          ) : (
            ""
          )}
        </div>
        <div className="row bg-light border-bottom">
          <h6 className="text-center pt-4 pb-2 fw-bold">
            Departure Flight Details
          </h6>
          <div className="col-4"></div>
          <div className="col-8">{this.makeForm("departure")}</div>
        </div>
        <div className="row bg-light">
          <h6 className="text-center pt-4 pb-2 fw-bold">
            Return Flight Details
          </h6>
          <div className="col-4"></div>
          <div className="col-8 pb-2">
            {this.makeForm("return")}
            <div className="row mb-3">
              <div className="col-sm-10 offset-sm-3">
                <div className="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="corporateBooking"
                    name="corporateBooking"
                    value={form.corporateBooking}
                    checked={form.corporateBooking === "Yes"}
                    onChange={this.handleChange}
                  />
                  <label className="form-check-label">Corporate Booking</label>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              style={{ marginLeft: "9rem" }}
              disabled={!this.isFormValid() || edit}
              onClick={this.handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default TravelBill;
