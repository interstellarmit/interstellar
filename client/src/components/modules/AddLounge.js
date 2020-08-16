import React, { Component, useState } from "react";
import { List, Modal, Row, Col, Button, Form, Input, DatePicker, Checkbox } from "antd";
export default function AddLounge(props) {
  const [form] = Form.useForm();
  let onFinish = (fieldsValue) => {
    props.createNewLounge({
      name: fieldsValue.name,
      zoomLink: fieldsValue.zoomLink || "",
      permanent: fieldsValue.permanent || false,
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
      title={"Add New Lounge"}
      onCancel={() => {
        form.resetFields();
        props.setVisible(false);
      }}
      footer={null}
    >
      <Form {...layout} form={form} name={"Add New Lounge"} onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Lounge Name"
          rules={[
            {
              required: true,
              message: "Please enter a lounge name",
            },
            {
              min: 1,
              message: "Name must be at least 1 character",
            },
            {
              max: 100,
              message: "Name must be at most 100 characters",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="zoomLink"
          label="Zoom Link"
          rules={[
            {
              type: "url",
              message: "Please enter a zoom link",
            },
            {
              max: 200,
              message: "Zoom link must be at most 200 characters",
            },
          ]}
        >
          <Input placeholder={"Optional"} />
        </Form.Item>

        {props.admin ? (
          <Form.Item {...tailLayout} name="permanent" valuePropName="checked">
            <Checkbox>Permanent</Checkbox>
          </Form.Item>
        ) : (
          <></>
        )}

        <Form.Item {...tailLayout}>
          <Button key="submit" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
