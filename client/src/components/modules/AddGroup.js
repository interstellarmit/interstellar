import React, { Component, useState } from "react";
import { List, Modal, Row, Col, Button, Form, Input, DatePicker, Checkbox } from "antd";
import { get, post } from "../../utilities";
export default function AddGroup(props) {
  const [form] = Form.useForm();
  let onFinish = (fieldsValue) => {
    post("/api/createNewPage", {
      pageType: "Group",
      name: fieldsValue.name,
      title: fieldsValue.title,
      description: fieldsValue.description,
      locked: false,
      joinCode: "",
    }).then((data) => {
      if (data.created) {
        post("/api/addSelfToPage", {
          pageId: data.pageId,
          joinCode: "",
        }).then((data2) => {
          if (data2.added) {
            props.redirectPage("/group/" + data.name);
          }
        });
      }
    });
    form.resetFields();
    props.setVisible(false);
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
          ]}
        >
          <Input placeholder={"MIT"} />
        </Form.Item>
        <Form.Item name="title" label="Group Title" rules={[]}>
          <Input placeholder={"Massachusetts Institute of Technology"} />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[]}>
          <Input placeholder={"Optional"} />
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
