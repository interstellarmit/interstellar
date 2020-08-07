import React, { Component } from "react";
import { get, post } from "../../utilities";
import ProfilePic from "./ProfilePic";
import { List, Avatar, Input } from "antd";
import { socket } from "../../client-socket.js";

class Chat extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      currentMessage: String,
      messages: [],
    };
  }

  componentDidMount() {
    socket.on("message", (data) => {
      if (data.loungeId !== this.props.loungeId) console.log("Wrong lounge...");
      let messages = this.state.messages;
      messages.push({
        userId: data.userId,
        name: data.name,
        text: data.text,
        loungeId: data.loungeId,
      });
      this.setState({ messages: messages });
    });
  }
  a;
  render() {
    return (
      <div>
        <div
          style={{
            overflow: "auto",
            height: "50vh",
            display: "flex",
            flexDirection: "column-reverse",
            marginBottom: "auto",
          }}
        >
          <List
            dataSource={this.state.messages.filter((message) => {
              return message.loungeId === this.props.loungeId;
            })}
            renderItem={(message) => {
              return (
                <List.Item>
                  <ProfilePic user={{ userId: message.userId, name: message.name }} />
                  {" " + message.name.split(" ")[0] + ": " + message.text}
                </List.Item>
              );
            }}
          />
        </div>
        <Input
          value={this.state.currentMessage}
          onChange={(e) => {
            this.setState({ currentMessage: e.target.value });
          }}
          onPressEnter={() => {
            let text = this.state.currentMessage;
            this.setState({ currentMessage: "" });
            post("/api/message", { text: text, loungeId: this.props.loungeId }).then((res) => {
              let messages = this.state.messages;
              messages.push(res);
              this.setState({ messages: messages });
            });
          }}
        />
      </div>
    );
  }
}

export default Chat;
