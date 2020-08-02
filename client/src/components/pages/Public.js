import React, { Component } from "react";
import { get, post } from "../../utilities";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { List, Modal, Row, Col, Button, Form, Input, DatePicker, Checkbox } from "antd";

//import classes from "../full.js";
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
    form.resetFields();
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
        form.resetFields();
        //props.setVisible(false);
      }}
      footer={null}
    >
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
              <Input placeholder="xd@mit.edu" />
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
              <Input.Password placeholder="hehexd" />
            </Form.Item>

            <Form.Item>
              <Button key="submit" type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={12}>
          <Form form={formSignup} name={"Signup"} onFinish={onFinishSignup}>
            <Form.Item
              name="signupName"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please enter a valid name",
                },
              ]}
            >
              <Input />
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
              <Input />
            </Form.Item>
            <Form.Item
              name="signupPassword"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please enter a password",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button key="submit" type="primary" htmlType="submit">
                Signup
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
}

/*
 /*
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
