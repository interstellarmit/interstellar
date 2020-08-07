import React, { Component, useState } from "react";
import { List, Modal, Row, Col, Button, Form, Input, DatePicker, Checkbox } from "antd";
export default function AddLock(props) {
  const [form] = Form.useForm();
  let onFinish = (fieldsValue) => {
    props.setLockCode(true, fieldsValue.joinCode);
    form.resetFields();
    props.setLockModal(false);
  };

  return (
    <Modal
      visible={props.lockModal}
      title={"Lock Page"}
      onCancel={() => {
        form.resetFields();
        props.setLockModal(false);
      }}
      footer={null}
    >
      <Form form={form} name={"Lock Page"} onFinish={onFinish}>
        <Form.Item
          name="joinCode"
          label="Join Code"
          rules={[
            {
              required: true,
              message: "Please choose a join code for this page",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button key="submit" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
