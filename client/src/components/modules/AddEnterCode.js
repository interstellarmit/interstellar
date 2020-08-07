import React, { Component, useState } from "react";
import { List, Modal, Row, Col, Button, Form, Input, DatePicker, Checkbox } from "antd";
export default function AddLounge(props) {
  const [form] = Form.useForm();
  let onFinish = (fieldsValue) => {
    props.addSelfToPage(props.pageId, fieldsValue.joinCode);
    form.resetFields();
    props.setEnterCodeModal(false);
  };

  return (
    <Modal
      visible={props.enterCodeModal}
      title={"Enter Join Code"}
      onCancel={() => {
        form.resetFields();
        props.setEnterCodeModal(false);
      }}
      footer={null}
    >
      <Form form={form} name={"Enter Join Code"} onFinish={onFinish}>
        <Form.Item
          name="joinCode"
          label="Join Code"
          rules={[
            {
              required: true,
              message: "Please enter the join code",
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
