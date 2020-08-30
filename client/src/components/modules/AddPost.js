import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { Form, Input, Card, Button } from "antd";
import { FormOutlined } from "@ant-design/icons";

const layout = {};

const validateMessages = {
  required: "${name} is required!",
};

// goal: set up title and form entry boxes
export default function AddPost(props) {
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const [value, setValue] = useState("");

  let onFinish = (fieldsValue) => {
    props.createNewPost({
      title: fieldsValue.Title,
      text: fieldsValue.Text,
      pageId: props.page._id,
    });
    form.resetFields();
  };

  return (
    <React.Fragment>
      {editing ? (
        <div
          style={{
            display: "flex",
            background: "#FFFFFF",
            border: "1px solid #d9d9d9",
            boxSizing: "borderBox",
            borderRadius: "10px",
            padding: "15px 10px 25px 10px",
            marginRight: "10px",
          }}
        >
          <Form validateMessages={validateMessages} form={form} onFinish={onFinish}>
            <Form.Item name="Title" rules={[{ required: true }]}>
              <Input placeholder="Title" />
            </Form.Item>
            <Form.Item name="Text">
              <Input.TextArea rows={5} placeholder="Text" rules={[{ required: true }]} />
            </Form.Item>
            <Form.Item style={{ marginBottom: "0px" }}>
              <Button style={{ marginRight: "10px" }} key="submit" type="primary" htmlType="submit">
                Submit
              </Button>
              <Button key="cancel" type="secondary" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <div
          onClick={() => setEditing(true)}
          style={{
            display: "flex",
            background: "#FFFFFF",
            border: "1px solid #d9d9d9",
            boxSizing: "borderBox",
            borderRadius: "10px",
            padding: "5px 10px 5px 10px",
            marginRight: "10px",
          }}
        >
          <div
            style={{
              margin: "5px",
            }}
          >
            <FormOutlined />
          </div>
          <div
            style={{
              margin: "5px",
            }}
          >
            Write a post...
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
