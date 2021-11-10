import React, { Component } from "react";
import { Link } from "react-router-dom";
import http from "./services/httpService";
import auth from "./services/authService";

class EmpBills extends Component {
  state = {
    bills: {},
    form: { description: "", expensetype: "", amount: "" },
    errors: {},
    expenseTypes: ["Travel", "Hotel", "Software", "Communication", "Others"],
    view: -1,
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
    let { description, expensetype, amount } = this.state.form;
    let errors = {};
    errors.description = this.validateDesp(description);
    errors.expensetype = this.validateExpense(expensetype);
    errors.amount = this.validateAmount(amount);

    return errors;
  };

  handleValidate = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    let { errors } = s1;

    switch (input.name) {
      case "description":
        errors.description = this.validateDesp(input.value);
        break;
      case "expensetype":
        errors.expensetype = this.validateExpense(input.value);
        break;
      case "amount":
        errors.amount = this.validateAmount(input.value);
        break;
      default:
        break;
    }
  };

  validateDesp = (desp) => {
    return !desp ? "Description is required" : "";
  };

  validateExpense = (expense) => (!expense ? "Select Expense Type" : "");

  validateAmount = (amt) => {
    let count = 0;
    for (let i = 0; i < amt.length; i++) {
      if (amt[i] >= "0" && amt[i] <= "9") {
        // do nothind
      } else if (amt[i] === ".") {
        //do nothing
      } else count++;
    }
    let dotCount = amt.split(".").length;
    let error = () => {
      if (amt[amt.length - 1] === ".") return true;
    };
    return !amt
      ? "Amount is required"
      : count > 0 || dotCount > 2 || amt[0] === "." || error()
      ? "Not a valid Amount"
      : "";
  };

  async getEmpDetails() {
    let user = auth.getUser();
    console.log(user.empuserid);
    if (user) {
      let response = await http.get(`/empapp/empbills/${user.empuserid}`);
      console.log(response);
      let { data } = response;
      this.setState({ bills: data });
    }
  }
  componentDidMount() {
    this.getEmpDetails();
  }

  async postData(url, obj) {
    try {
      let response = await http.post(url, obj);
      let success = "New Bill has been successfully created";
      this.setState({ success: success });
      window.location = `/emp/bills`;
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        let dbError = "Database error.";
        this.setState({ dbError: dbError });
      }
    }
  }

  handleAddEmpBills = (e) => {
    e.preventDefault();
    let user = auth.getUser();
    let { empuserid } = user;
    let { description, expensetype, amount } = this.state.form;
    let billJson = {
      empuserid: empuserid,
      description: description,
      expensetype: expensetype,
      amount: amount,
    };
    this.postData(`/empapp/empbills/${empuserid}`, billJson);
  };

  openBillForm = () => {
    this.setState({ view: 0 });
  };

  handleBills = (exType, id) => {
    if (exType === "Hotel") this.props.history.push(`/emp/hotelbill/${id}`);
    if (exType === "Travel") this.props.history.push(`/emp/travelbill/${id}`);
  };

  makeTextField = (label, type, name, val, pHolder) => {
    let { errors } = this.state;
    const myStyle = {
      fontWeight: "500",
    };
    return (
      <div class="row mb-3">
        <label class="col-sm-3 col-form-label" style={myStyle}>
          {label}:
        </label>
        <div class="col-sm-9">
          <input
            type={type}
            class="form-control"
            id={name}
            name={name}
            value={val}
            placeholder={pHolder}
            onChange={this.handleChange}
            onBlur={this.handleValidate}
          />
        </div>
        {name === "description" && errors && (
          <span className="text-danger px-5">{errors.description}</span>
        )}
        {name === "amount" && errors && (
          <span className="text-danger px-5">{errors.amount}</span>
        )}
      </div>
    );
  };
  render() {
    let {
      bills = {},
      form,
      expenseTypes,
      errors,
      view,
      success = null,
      dbError = null,
    } = this.state;
    let { data = [], pageInfo = {} } = bills;
    const myStyle = {
      fontWeight: "500",
    };
    console.log("bills", bills);
    return (
      <div className="container py-2">
        <h4 className="text-center">Welcome to Employee Management Portal</h4>
        <h5 className="pt-3">Details of Bills Submitted</h5>
        <div className="row">
          <div className="col-10 text-center">
            <div className="row bg-primary">
              <div className="col-2 border">Id</div>
              <div className="col-4 border">Description</div>
              <div className="col-3 border">Expense Head</div>
              <div className="col-2 border">Amount</div>
              <div className="col-1 border"></div>
            </div>
            {data.map((ele) => (
              <div className="row">
                <div className="col-2 border">{ele.billid}</div>
                <div className="col-4 border">{ele.description}</div>
                <div className="col-3 border">{ele.expensetype}</div>
                <div className="col-2 border">{ele.amount}</div>
                <div className="col-1 border">
                  {ele.expensetype === "Hotel" ||
                  ele.expensetype === "Travel" ? (
                    <i
                      className="fas fa-plus-square"
                      onClick={() =>
                        this.handleBills(ele.expensetype, ele.billid)
                      }
                    ></i>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <Link
          className="h6"
          style={{ color: "#000" }}
          onClick={() => this.openBillForm()}
        >
          Submit a New Bill
        </Link>
        {view >= 0 ? (
          <div className="row">
            <div className="col-10 bg-light">
              <div className="row">
                <div className="col-md-2 col-lg-4"></div>
                <div className="col-md-10 col-lg-8">
                  <h5 className="">Enter Details of the new Bill</h5>{" "}
                  {success ? (
                    <span className="text-success text-center">{success}</span>
                  ) : dbError ? (
                    <span className="text-primary text-center">{dbError}</span>
                  ) : (
                    ""
                  )}
                  <form>
                    {this.makeTextField(
                      "Description",
                      "text",
                      "description",
                      form.description,
                      "Description"
                    )}
                    <div class="row mb-3">
                      <label class="col-sm-3 col-form-label" style={myStyle}>
                        Expense Type:
                      </label>
                      <div class="col-sm-9">
                        <select
                          class="form-select"
                          id="expensetype"
                          name="expensetype"
                          value={form.expensetype}
                          onChange={this.handleChange}
                        >
                          <option selected value="">
                            Expense Type
                          </option>
                          {expenseTypes.map((ele) => (
                            <option>{ele}</option>
                          ))}
                        </select>
                      </div>
                      {errors && (
                        <span className="text-danger px-5">
                          {errors.expensetype}
                        </span>
                      )}
                    </div>
                    {this.makeTextField(
                      "Amount",
                      "text",
                      "amount",
                      form.amount,
                      "Amount"
                    )}
                    <div>
                      <button
                        type="submit"
                        class="btn btn-primary btn-sm mb-1"
                        style={{ marginLeft: "5rem" }}
                        onClick={this.handleAddEmpBills}
                        disabled={!this.isFormValid()}
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-2"></div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
export default EmpBills;
