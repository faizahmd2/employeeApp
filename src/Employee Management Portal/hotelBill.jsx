import React, { Component } from "react";
import http from "./services/httpService";
import auth from "./services/authService";

class HotelBill extends Component {
  state = {
    form: {
      inDay: "",
      inMonth: "",
      inYear: "",
      outDay: "",
      outMonth: "",
      outYear: "",
      city: "",
      hotel: "",
      corpBooking: "",
    },
    errors: {},
    edit: false,
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
    let { inDay, inMonth, inYear, outDay, outMonth, outYear, city, hotel } =
      this.state.form;
    let errors = {};
    errors.inDay = this.ValidateStartDate(inDay);
    errors.inMonth = this.ValidateStartDate(inMonth);
    errors.inYear = this.ValidateStartDate(inYear);
    errors.outDay = this.ValidateEndDate(outDay);
    errors.outMonth = this.ValidateEndDate(outMonth);
    errors.outYear = this.ValidateEndDate(outYear);
    errors.hotel = this.validateHotel(hotel);
    errors.amount = this.validateCity(city);

    return errors;
  };

  handleValidate = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    let { errors } = s1;
    switch (input.name) {
      case "inDay":
        errors.inDay = this.ValidateStartDate(input.value);
        break;
      case "inMonth":
        errors.inMonth = this.ValidateStartDate(input.value);
        break;
      case "inYear":
        errors.inYear = this.ValidateStartDate(input.value);
        break;
      case "outDay":
        errors.outDay = this.ValidateEndDate(input.value);
        break;
      case "outMonth":
        errors.outMonth = this.ValidateEndDate(input.value);
        break;
      case "outYear":
        errors.outYear = this.ValidateEndDate(input.value);
        break;
      case "hotel":
        errors.hotel = this.validateHotel(input.value);
        break;
      case "city":
        errors.city = this.validateCity(input.value);
        break;
      default:
        break;
    }
    this.setState(s1);
  };

  ValidateStartDate = (date) => (!date ? "Check in Date is required" : "");
  ValidateEndDate = (date) => (!date ? "Check out Date is required" : "");
  validateHotel = (hotel) => (!hotel ? "Hotel is required" : "");
  validateCity = (city) => (!city ? "City is required" : "");

  async getBillDetails() {
    let user = auth.getUser();
    let { id } = this.props.match.params;
    if (user) {
      let response = await http.get(
        `/empapp/hotelbill/${user.empuserid}/${id}`
      );
      console.log(response);
      let { data } = response;
      if (data.staystartdate) {
        let checkIn = data.staystartdate;
        let checkOut = data.stayenddate;
        console.log(checkIn, checkOut);
        let checkInDay =
          checkIn[2] === "-"
            ? checkIn.substring(0, 2)
            : checkIn.substring(0, 1);
        let checkOutDay =
          checkOut[2] === "-"
            ? checkOut.substring(0, 2)
            : checkOut.substring(0, 1);
        let checkInYear = checkIn.substring(checkIn.length - 4);
        let checkOutYear = checkOut.substring(checkOut.length - 4);
        let checkInMonth =
          checkIn[2] === "-"
            ? checkIn.substring(3, checkIn.length - 5)
            : checkIn.substring(2, checkIn.length - 5);
        let checkOutMonth =
          checkOut[2] === "-"
            ? checkOut.substring(3, checkOut.length - 5)
            : checkOut.substring(2, checkOut.length - 5);
        let billJSON = {
          inDay: checkInDay,
          inMonth: checkInMonth,
          inYear: checkInYear,
          outDay: checkOutDay,
          outMonth: checkOutMonth,
          outYear: checkOutYear,
          city: data.city,
          hotel: data.hotel,
          corpBooking: data.corpbooking,
        };
        this.setState({
          form: billJSON,
          edit: true,
          success: "Displaying Hotel Bill Details",
        });
      } else {
        let form = {
          inDay: "",
          inMonth: "",
          inYear: "",
          outDay: "",
          outMonth: "",
          outYear: "",
          city: "",
          hotel: "",
          corpBooking: "",
        };
        this.setState({
          form: form,
          dbError: "No Hotel Stay Details Found. Please Enter Them.",
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
      inDay,
      inMonth,
      inYear,
      outDay,
      outMonth,
      outYear,
      city,
      hotel,
      corpBooking,
    } = s1.form;
    let startDate = inDay + "-" + inMonth + "-" + inYear;
    console.log(startDate);
    let endDate = outDay + "-" + outMonth + "-" + outYear;
    console.log(endDate);
    let corBook = !corpBooking ? "No" : corpBooking;
    let Data = {
      billid: id,
      empuserid: user.empuserid,
      staystartdate: startDate,
      stayenddate: endDate,
      hotel: hotel,
      city: city,
      corpbooking: corBook,
    };
    this.postData("/empapp/hotelbill", Data);
  };

  render() {
    let { form, success = null, dbError, errors, edit } = this.state;

    let { id } = this.props.match.params;
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    const month = [
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
    ];
    return (
      <div className="container">
        <h4 className="text-center py-2">
          Welcome to Employee Management Portal
        </h4>
        <div className="container bg-light">
          <h5 className="text-center">Hotel Stay Details</h5>
          <h6 className="text-center">Bill Id : {id}</h6>
          <div className="row">
            <div className="col-4"></div>
            <div className="col-8">
              {success ? (
                <span className="text-success text-center">{success}</span>
              ) : dbError ? (
                <span className="text-primary text-center">{dbError}</span>
              ) : (
                ""
              )}
              <form>
                <div class="row mb-3">
                  <div className="row">
                    <label class="col-sm-3 col-form-label">
                      Check in Date:
                    </label>
                    <div class="col-3">
                      <select
                        class="form-select"
                        id="inDay"
                        name="inDay"
                        value={form.inDay}
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
                    <div class="col-3">
                      <select
                        class="form-select"
                        id="inMonth"
                        name="inMonth"
                        value={form.inMonth}
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
                    <div class="col-3">
                      <select
                        class="form-select"
                        id="inYear"
                        name="inYear"
                        value={form.inYear}
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
                  {errors.inDay || errors.inMonth || errors.inYear ? (
                    <span className="text-danger">
                      {errors.inDay || errors.inMonth || errors.inYear}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div class="row mb-3">
                  <div className="row">
                    <label class="col-sm-3 col-form-label">
                      Check out Date:
                    </label>
                    <div class="col-3">
                      <select
                        class="form-select"
                        id="outDay"
                        name="outDay"
                        value={form.outDay}
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
                    <div class="col-3">
                      <select
                        class="form-select"
                        id="outMonth"
                        name="outMonth"
                        value={form.outMonth}
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
                    <div class="col-3">
                      <select
                        class="form-select"
                        id="outYear"
                        name="outYear"
                        value={form.outYear}
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
                  {errors.outDay || errors.outMonth || errors.outYear ? (
                    <span className="text-danger">
                      {errors.outDay || errors.outMonth || errors.outYear}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div class="row mb-3">
                  <label class="col-sm-3 col-form-label">Hotel:</label>
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      id="hotel"
                      name="hotel"
                      value={form.hotel}
                      onChange={this.handleChange}
                      onBlur={this.handleValidate}
                    />
                  </div>
                  {errors.hotel ? (
                    <span className="text-danger">{errors.hotel}</span>
                  ) : (
                    ""
                  )}
                </div>
                <div class="row mb-3">
                  <label class="col-sm-3 col-form-label">City:</label>
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={this.handleChange}
                      onBlur={this.handleValidate}
                    />
                  </div>
                  {errors.city ? (
                    <span className="text-danger">{errors.city}</span>
                  ) : (
                    ""
                  )}
                </div>
                <div class="row mb-3">
                  <div class="col-sm-10 offset-sm-3">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="corpBooking"
                        name="corpBooking"
                        value={form.corpBooking}
                        checked={form.corpBooking === "Yes"}
                        onChange={this.handleChange}
                      />
                      <label className="form-check-label">
                        Corporate Booking
                      </label>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ marginLeft: "9rem" }}
                  disabled={!this.isFormValid() || edit}
                  onClick={this.handleSubmit}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default HotelBill;
