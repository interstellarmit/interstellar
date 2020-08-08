import React, { Component, useState } from "react";
import { List, Modal, Row, Col, Button, Form, Input, DatePicker, Checkbox } from "antd";
export default function AddLounge(props) {
  const [form] = Form.useForm();

  let onFinish = (fieldsValue) => {
    props.addSelfToPage(props.pageId, fieldsValue.joinCode);
    form.resetFields();
    props.setEnterCodeModal(false);
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
      visible={props.enterCodeModal}
      title={"Enter Join Code"}
      onCancel={() => {
        form.resetFields();
        props.setEnterCodeModal(false);
      }}
      footer={null}
    >
      <Form {...layout} form={form} name={"Enter Join Code"} onFinish={onFinish}>
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

        <Form.Item {...tailLayout}>
          <Button key="submit" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
