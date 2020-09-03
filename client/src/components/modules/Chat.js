import React, { Component } from "react";
import { get, post } from "../../utilities";
import ProfilePic from "./ProfilePic";
import { List, Avatar, Input, notification, ConfigProvider, Empty } from "antd";
import { socket } from "../../client-socket.js";

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
      let page = this.props.page.name;
      notification.info({
        message: page.name,

        description: data.name + ": " + data.text,
        placement: "bottomRight",
        onClick: () => {
          if (!page) return;
          this.props.redirectPage("/" + page.pageType.toLowerCase() + "/" + page.name + "/lounge");
        },
      });
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
              return <Empty description="No messages" />;
            }}
          >
            <List
              dataSource={this.state.messages}
              renderItem={(message) => {
                return (
                  <List.Item style={{ display: "flex" }}>
                    <div style={{ alignItems: "center" }}>
                      <ProfilePic user={{ userId: message.userId, name: message.name }} />
                      {"  " + message.name.split(" ")[0] + ": " + message.text}
                    </div>
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
