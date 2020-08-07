import React, { Component } from "react";
import { get, post } from "../../utilities";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { List, Modal, Row, Col, Button, Form, Input, DatePicker, Checkbox } from "antd";

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
  );
}
