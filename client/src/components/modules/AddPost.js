import React, { useState } from "react";
import { Form, Input, Card, Button } from "antd";

const layout = {};

// goal: set up title and form entry boxes
export default function AddPost(props) {
  const [form] = Form.useForm();
  let onFinish = (fieldsValue) => {
    props.createNewPost({
      title: fieldsValue.title,
      text: fieldsValue.text,
      pageId: props.page._id,
    });
    form.resetFields();
  };

  return (
    <React.Fragment>
      <Card title="Add Post">
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="title" rules={[{ required: true }]}>
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item name="text">
            <Input.TextArea placeholder="Text" />
          </Form.Item>
          <Form.Item>
            <Button key="submit" type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </React.Fragment>
  );
}
