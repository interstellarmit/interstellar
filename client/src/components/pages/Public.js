import React, { Component } from "react";
import { get, post } from "../../utilities";
import Cookies from "universal-cookie";
const cookies = new Cookies();
//import classes from "../full.js";
import "../../utilities.css";

class Public extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {};
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    return (
      <>
        <button
          onClick={() => {
            this.props.signup();
          }}
        >
          Signup
        </button>
        <button
          onClick={() => {
            this.props.login();
          }}
        >
          Login
        </button>
        <button
          onClick={() => {
            this.props.me();
          }}
        >
          Me
        </button>
        <button
          onClick={() => {
            this.props.logout();
          }}
        >
          Logout
        </button>
        <button
          onClick={() => {
            console.log(cookies.get("token"));
          }}
        >
          Cookie
        </button>
      </>
    );
  }
}

export default Public;
/*
 /*
        <button
          onClick={() => {
            Object.keys(classes).forEach((oneclass) => {
              let classObj = classes[oneclass];
              //if (["6.031", "6.033", "6.UAT", "11.125"].includes(oneclass)) return;
              post("/api/createNewPage", {
                pageType: "Class",
                name: oneclass,
                title: classObj.n,
                description: classObj.d,
                locked: false,
                joinCode: "",
              }).then((created) => {
                if (created.created) console.log(oneclass);
                else console.log("error:" + oneclass);
              });
            });
          }}
        >
          Add MIT
        </button>
        */
