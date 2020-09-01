import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { Tag, Form, Input, Select, Button } from "antd";
import { FormOutlined } from "@ant-design/icons";

const layout = {};

const validateMessages = {
  required: "  ${name} is required.",
};

// goal: set up title and form entry boxes
export default function AddPost(props) {
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  let onFinish = (fieldsValue) => {
    console.log(fieldsValue);
    props.createNewPost({
      title: fieldsValue.Title,
      text: fieldsValue.Text,
      labels: fieldsValue.Label,
      pageId: props.page._id,
    });
    form.resetFields();
    setEditing(false);
  };

  const postTags = ["General", "Scheduling", "Resources", "Question", "Meme"];
  const postOptions = [];
  postTags.forEach((tag) => {
    postOptions.push(
      <Tag
        style={{
          borderRadius: "5px",
        }}
        key={tag}
      >
        {tag}
      </Tag>
    );
  });

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
            <Form.Item name="Label" style={{ marginBottom: "12px" }} rules={[{ required: true }]}>
              <Select bordered={false} mode="multiple" placeholder="Select a label...">
                {postOptions}
              </Select>
            </Form.Item>
            <Form.Item name="Title" style={{ marginBottom: "12px" }} rules={[{ required: true }]}>
              <Input
                style={{
                  borderRadius: "5px",
                }}
                placeholder="Title"
              />
            </Form.Item>
            <Form.Item name="Text">
              <Input.TextArea
                style={{
                  borderRadius: "5px",
                }}
                rows={5}
                placeholder="Text"
                rules={[{ required: true }]}
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: "0px" }}>
              <Button style={{ marginRight: "10px" }} key="submit" type="primary" htmlType="submit">
                Submit
              </Button>
              <Button
                key="cancel"
                type="secondary"
                onClick={() => {
                  setEditing(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <div
          onClick={() => setEditing(true)}
          style={{
            cursor: "pointer",
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
