import { Button } from "antd";
import React from "react";
import logo from "../../public/logo.png";
import "../../utilities.css";

export default function Public(props) {
  return (
    <div style={{ borderRadius: "20px" }}>
      <center>
        <img src={logo} style={{ height: "200px", marginBottom: "20px" }} />
        <h1 style={{ fontSize: "50px", fontWeight: "700", fontFamily: "Chakra Petch" }}>
          interstellar
        </h1>
      </center>
      <Button
        block
        type="primary"
        shape="round"
        onClick={() => {
          props.handleLogin();
        }}
        size="large"
      >
        Login with Touchstone/FireRoad
      </Button>
    </div>
  );
}
