import React, { Component } from "react";

import { get, post } from "../../utilities";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { List, Modal, Row, Col, Button, Form, Input, DatePicker, Checkbox } from "antd";
import { CalendarOutlined, TeamOutlined, BookOutlined } from "@ant-design/icons";

import "../../utilities.css";

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
              backgroundColor: "#6c57f5",
              display: "flex",

              alignItems: "center",
              paddingTop: "200px",
              flexDirection: "column",
              color: "white",
            }}
          >
            <h3
              style={{
                color: "white",
                marginBottom: "20px",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <BookOutlined /> <div> Find classmates</div>
            </h3>
            <h3
              style={{
                color: "white",
                marginBottom: "20px",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <TeamOutlined /> <div> Work together in lounges</div>
            </h3>
            <h3
              style={{
                color: "white",
                marginBottom: "20px",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <CalendarOutlined /> <div> Keep track of assignments</div>
            </h3>
          </div>
        </Col>
        <Col span={12}>
          <div style={{ margin: "200px 80px 200px 80px" }}>
            <center>
              <h1>interstellar</h1>
            </center>
            <Button
              block
              type="primary"
              shape="round"
              onClick={() => {
                props.handleLogin();
              }}
            >
              Login With Touchstone
            </Button>
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
