import { ConfigProvider, Empty, Input, List } from "antd";
import React, { Component } from "react";
import { socket } from "../../client-socket.js";
import { post } from "../../utilities";
import ProfilePic from "./ProfilePic";

class Chat extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      currentMessage: "",
      messages: [],
      lastMessage: new Date(),
    };
  }

  componentDidMount() {
    socket.on("message", (data) => {
      if (data.pageId !== this.props.pageId) return;
      let messages = this.state.messages;
      messages.push({
        userId: data.userId,
        name: data.name,
        text: data.text,
        pageId: data.pageId,
      });
      this.setState({ messages: messages });
    });
  }

  render() {
    return (
      <div style={{ height: "100%", overflow: "auto" }}>
        <div
          style={{
            overflow: "auto",
            height: "calc(100% - 40px)",
            display: "flex",
            flexDirection: "column-reverse",
            margin: "auto",
          }}
        >
          <ConfigProvider
            renderEmpty={() => {
              return <Empty description="Chat" />;
            }}
          >
            <List
              dataSource={this.state.messages}
              renderItem={(message) => {
                return (
                  <List.Item style={{ display: "flex" }}>
                    <List.Item.Meta
                      avatar={<ProfilePic user={{ userId: message.userId, name: message.name }} />}
                      title={message.name.split(" ")[0] + ": " + message.text}
                    />
                  </List.Item>
                );
              }}
            />
          </ConfigProvider>
        </div>
        <Input
          value={this.state.currentMessage}
          onChange={(e) => {
            this.setState({ currentMessage: e.target.value });
          }}
          onPressEnter={() => {
            let text = this.state.currentMessage;
            if (
              text != undefined &&
              text.length > 0 &&
              new Date().getTime() - new Date(this.state.lastMessage).getTime() >= 500
            ) {
              this.setState({ currentMessage: "", lastMessage: new Date() });
              post("/api/message", { text: text, pageId: this.props.pageId }).then((res) => {
                let messages = this.state.messages;
                messages.push(res);
                this.setState({ messages: messages });
              });
            }
          }}
        />
      </div>
    );
  }
}

export default Chat;
