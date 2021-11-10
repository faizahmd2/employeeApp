import React, { Component } from "react";
import http from "./services/httpService";

class ViewEmpoyee extends Component {
  state = { emps: {} };
  async componentDidMount() {
    let response = await http.get("/empapp/emps");
    let { data } = response;
    this.setState({ emps: data });
    console.log(data);
  }

  handleDetails = (id) => {
    this.props.history.push(`/admin/viewemp/${id}`);
  };
  render() {
    let { emps } = this.state;
    let { data = [], pageInfo = {} } = emps;
    let {
      pageNumber = "",
      numberOfPages = "",
      numOfItems = "",
      totalItemCount = "",
    } = pageInfo;
    console.log("data", data);
    console.log("emps", emps);
    return (
      <div className="container">
        <label className="py-2 fw-bold">
          {pageNumber} to {numOfItems} of {totalItemCount}
        </label>
        <div className="row">
          <div className="col-8">
            <div className="row bg-primary">
              <div className="col-5 border text-center">Name</div>
              <div className="col-5 border text-center">EmailId</div>
              <div className="col-2 border text-center"></div>
            </div>
            {data.map((emp) => (
              <div className="row">
                <div className="col-5 border text-center">{emp.name}</div>
                <div className="col-5 border text-center">{emp.email}</div>
                <div className="col-2 border text-center">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => this.handleDetails(emp.empuserid)}
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
export default ViewEmpoyee;
