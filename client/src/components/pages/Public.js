import { Button } from "antd";
import React from "react";
import { useMediaQuery } from "react-responsive";
import logo from "../../public/logo.png";
import "../../utilities.css";
export default function Public(props) {
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  return (
    <div style={{ borderRadius: "20px" }}>
      <center>
        <img src={logo} style={{ height: "200px", marginBottom: "20px" }} />
        <h1
          style={{
            fontSize: isMobile ? "35px" : "50px",
            fontWeight: "700",
            fontFamily: "Chakra Petch",
          }}
        >
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
        Login with Touchstone
      </Button>
    </div>
  );
}
