import React, { Component, useState } from "react";
import { List, Modal, Row, Col, Button, Form, Input, DatePicker, Checkbox } from "antd";
import { get, post } from "../../utilities";
export default function AddGroup(props) {
  const [form] = Form.useForm();
  const [message, setMessage] = useState("");
  let onFinish = (fieldsValue) => {
    post("/api/createNewPage", {
      pageType: "Group",
      name: fieldsValue.name,
      title: fieldsValue.title,
      description: fieldsValue.description,
      locked: fieldsValue.joinCode ? fieldsValue.joinCode.length > 0 : false,
      joinCode: fieldsValue.joinCode || "",
    }).then((data) => {
      if (data.created) {
        post("/api/addSelfToPage", {
          pageId: data.pageId,
          joinCode: fieldsValue.joinCode || "",
        }).then((data2) => {
          if (data2.added) {
            props.redirectPage("/group/" + data.name);
          }
        });
      } else {
        form.resetFields();
        setMessage("Uh oh that group name already exists. Try searching for it in the search bar!");
      }
    });
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const tailLayout = {
    wrapperCol: { offset: 6, span: 18 },
  };

  return (
    <Modal
      visible={props.visible}
      title={"Create New Group"}
      onCancel={() => {
        form.resetFields();
        props.setVisible(false);
        setMessage("");
      }}
      footer={null}
    >
      <Form {...layout} form={form} name={"Create New Group"} onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Group Name"
          rules={[
            {
              required: true,
              message: "Please enter a short group name",
            },
            {
              min: 2,
              message: "Name must be at least 2 characters",
            },
            {
              max: 20,
              message: "Name must be at most 20 characters",
            },
          ]}
        >
          <Input placeholder={"MIT"} />
        </Form.Item>
        <Form.Item
          name="title"
          label="Group Title"
          rules={[
            {
              required: true,
              message: "Please enter a group title",
            },
            {
              min: 2,
              message: "Title must be at least 2 characters",
            },
            {
              max: 100,
              message: "Title must be at most 100 characters",
            },
          ]}
        >
          <Input placeholder={"Massachusetts Institute of Technology"} />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[
            {
              required: true,
              message: "Please enter a short description",
            },
            {
              min: 10,
              message: "Description must be at least 10 characters",
            },
            {
              max: 10000,
              message: "Description must be at most 10000 characters",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="joinCode"
          label="Join Code"
          rules={[
            {
              max: 500,
              message: "Join code must be at most 500 characters",
            },
          ]}
        >
          <Input placeholder={"Optional password for your group"} />
        </Form.Item>
        <Form.Item>
          <div style={{ color: "red" }}>{message}</div>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button key="submit" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
