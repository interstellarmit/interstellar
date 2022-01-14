import { Alert, Button, Form, Input, Modal } from "antd";
import React from "react";
export default function AddEnterCode(props) {
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
        <Alert
          message="If the group creator forgot the join code, they can unlock and re-lock the group with a different code"
          type="info"
          showIcon
          style={{ marginBottom: "10px" }}
        />
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
          <Input
            placeholder={"Contact " + (props.hostName || "Akshaj Kadaveru") + " for Join Code"}
          />
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
