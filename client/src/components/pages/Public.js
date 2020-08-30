import React, { Component } from "react";

import { get, post } from "../../utilities";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { List, Space, Modal, Row, Col, Button, Form, Input, DatePicker, Checkbox } from "antd";
import { CalendarOutlined, TeamOutlined, BookOutlined } from "@ant-design/icons";

import "../../utilities.css";

import logo from "../../public/logo.png";
import public1 from "../../public/public1-removebg-preview.png";

export default function Public(props) {
  const [formLogin] = Form.useForm();
  const [formSignup] = Form.useForm();
  let onFinishLogin = (fieldsValue) => {
    formLogin.resetFields();
    props.login({
      email: fieldsValue.loginEmail,
      password: fieldsValue.loginPassword,
    });
  };
  let onFinishSignup = (fieldsValue) => {
    formSignup.resetFields();
    props.signup({
      name: fieldsValue.signupName,
      email: fieldsValue.signupEmail,
      password: fieldsValue.signupPassword,
    });
  };
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Row>
        <Col span={12}>
          <div
            style={{
              width: "100%",
              height: "100vh",
              backgroundColor: "#041528",
              display: "flex",
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "white",
            }}
          >
            <div>
              <h1
                style={{
                  color: "white",
                  marginBottom: "40px",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Space>
                  <BookOutlined /> <div> See classes of friends</div>
                </Space>
              </h1>
              <h1
                style={{
                  color: "white",
                  marginBottom: "40px",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Space>
                  <TeamOutlined /> <div> Work together in lounges</div>
                </Space>
              </h1>
              <h1
                style={{
                  color: "white",
                  marginBottom: "40px",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Space>
                  <CalendarOutlined /> <div> Keep track of assignments</div>
                </Space>
              </h1>
            </div>
          </div>
        </Col>
        <Col span={12}>
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
            <div>
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
                Login With Touchstone
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

/*
<Modal
      visible={props.visible}
      title={"Welcome"}
      onCancel={() => {
        // form.resetFields();
        //props.setVisible(false);
      }}
      footer={null}
    >
      <button
        onClick={() => {
          props.handleLogin();
        }}
      >
        Login
      </button>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form form={formLogin} name={"Login"} onFinish={onFinishLogin}>
            <Form.Item
              name="loginEmail"
              label="Email"
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please enter a valid email",
                },
              ]}
            >
              <Input placeholder="dansun@mit.edu" />
            </Form.Item>
            <Form.Item
              name="loginPassword"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please enter a password",
                },
              ]}
            >
              <Input.Password placeholder="asdfasdf" />
            </Form.Item>

            <Form.Item>
              <Button key="submit" type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>

            <Form.Item>{props.loginMessage}</Form.Item>
          </Form>
        </Col>
        <Col span={12}>
          <Form form={formSignup} name={"Signup"} onFinish={onFinishSignup}>
            <Form.Item
              name="signupName"
              label="Full Name"
              rules={[
                {
                  required: true,
                  message: "Please enter a valid name",
                },
              ]}
            >
              <Input placeholder={"Tim Beaver"} />
            </Form.Item>
            <Form.Item
              name="signupEmail"
              label="Email"
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please enter a valid email",
                },
              ]}
            >
              <Input placeholder={"timmyb@mit.edu"} />
            </Form.Item>
            <Form.Item
              name="signupPassword"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please enter a password",
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (getFieldValue("signupPassword").length >= 6) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Your password is too short!");
                  },
                }),
              ]}
            >
              <Input.Password placeholder={"dismypassword"} />
            </Form.Item>

            <Form.Item>
              <Button key="submit" type="primary" htmlType="submit">
                Signup
              </Button>
            </Form.Item>

            <Form.Item>{props.signUpMessage}</Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>




*/
