import React, { Component } from "react";

import { get, post } from "../../utilities";
import { List, Space, Modal, Row, Col, Button, Form, Input, DatePicker, Checkbox } from "antd";
import { CalendarOutlined, TeamOutlined, BookOutlined } from "@ant-design/icons";

import "../../utilities.css";

import logo from "../../public/logo.png";
import public1 from "../../public/public1-removebg-preview.png";

export default function Public(props) {

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Row>

        <Col span={24}>
          <div
            style={{
              width: "100%",
              height: "100vh",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              backgroundColor: "white",
            }}
          >
            <div style={{ border: "10px solid #4090F7", borderRadius: "20px", padding: "20px" }}>
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
          </div>
        </Col>
      </Row>
    </div>
  );
}
